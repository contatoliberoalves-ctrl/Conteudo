#!/usr/bin/env python3
"""conferir_fala.py: a fala certa ANTES de pagar o vídeo, e inteira DEPOIS de cada cena. Só precisa de ffmpeg e ffprobe.

  ritmo:  python3 conferir_fala.py ritmo viral.mp4 fala-do-viral.txt
          A régua do ritmo (0 crédito): a duração do arquivo, quantas palavras ele fala (o .txt = só o que é dito, sem
          rótulo de tempo nem de quem fala) e as palavras por segundo, do primeiro ao último som de fala. No viral: grave
          dur_viral e ritmo_viral no reel (o texto e a soma comparam o reel com ela). Na fala de teste do personagem
          (fala.mp3 + o texto dela): grave em personagem.voz.palavras_por_segundo.
  texto:  python3 conferir_fala.py texto frases.json --pps 2.8 [--speed 1.0] [--viral 31.5]
          Antes de gerar a voz (0 crédito). frases.json = as frases de cada cena, escritas como vão pra voz:
            {"01": ["Sabe por que a sua planta amarela?", "É a água da torneira."], "02": ["..."]}
          Mata (sai com 1): número em dígito, símbolo (%, R$, +, /...), palavra toda em maiúscula (a voz pode soletrar),
          cena acima de 15 s (o Persona Pro recusa) e, com --viral, o reel fora de 85% a 115% do viral.
          Avisa: frase de até 3 palavras (confira se tem sujeito e verbo), frase de mais de 30 palavras, cena acima de 8 s
          ou abaixo de 5 s (cena curta paga 5 s de vídeo).
  juntar: python3 conferir_fala.py juntar frases.json 03 [--pasta falas] [--alvo 0.40] [--pps 2.8] [--speed 1.0]
          Depois de gerar as frases da cena 03, uma fala por frase: falas/03-1.mp3, falas/03-2.mp3... na ordem de frases.json
          e, quando a voz devolveu o tempo de cada palavra, falas/03-1.txt com a linha "palavra@início-fim ..." da resposta.
          Mede o silêncio do começo e do fim de cada frase e diz o pauseSeconds do join_audio que deixa uns 0,40 s de
          silêncio entre uma frase e a outra. Mata: frase sem voz, silêncio de mais de 2,5 s no meio da frase, 3 ou mais
          palavras seguidas sem tempo nenhum (a voz pulou um pedaço) e cena acima de 15 s. Avisa: pausa de 0,8 a 2,5 s no
          meio da frase e frase rápida ou lenta demais pro número de palavras (ouça essa). Imprime as palavras por segundo
          da cena e grava a cena em falas.json, na pasta do reel (é o que o montar.py legendas lê).
  soma:   python3 conferir_fala.py soma falas.json --viral 31.5 [--ritmo-viral 2.9]
          Depois de juntar todas as cenas: a fala do reel inteiro fica entre 85% e 115% do viral? Com --ritmo-viral
          (as palavras por segundo do viral), diz também se a fala está mais lenta ou mais corrida que a dele e o que mexer:
          o speed da voz ou o texto.
  video:  python3 conferir_fala.py video <áudio-mandado> <cena-devolvida.mp4> [--minimo 0.85] [--falas falas.json --cena 03]
          Depois de cada cena com a fala juntada (Persona Pro ou Avatar Pro com a fala; 0 crédito): a cena tem pelo menos
          85% dos segundos com voz do áudio mandado? Menos que isso, o modelo comeu fala: refaça a cena com o MESMO áudio.
          Mais de 125%, a cena tem voz a mais (som inventado ou a fala repetida): quando vem só depois da última palavra,
          imprime o trecho pro --cortes do montar.py. Diz também quanto a voz entrou atrasada no vídeo e, com --falas e
          --cena, grava esse atraso como o desloc da legenda.
  --teste
--pps = as palavras por segundo da voz do personagem, medidas na fala de teste da ficha (personagem.voz.palavras_por_segundo).
--speed = o speed que vai nas falas do reel dividido pelo da fala de teste (sem mudar o speed, 1). A voz clonada sem
  speed conta como 1,2; a da galeria sem speed, como 1,0.
Speed (generate_voice): voz da galeria vai de 0,7 a 1,2 (sem speed = 1,0). Voz clonada já sai em 1,2 sem speed:
  pra acelerar, 1,3 a 1,5; pra desacelerar, mande 1,0 (ou menos). O speed não muda o preço da fala.
O áudio pode ser o arquivo baixado ou a URL https dele.
"""
import argparse, array, json, math, pathlib, re, subprocess, sys, tempfile

SR = 8000           # 8 kHz basta pra achar onde tem voz
JANELA = 0.02       # 20 ms
ALVO_PAUSA = 0.40   # silêncio entre uma frase e a outra, como num viral falado
TETO_CENA = 15.0    # o Persona Pro recusa áudio acima disso
AR_MORTO = 2.5      # silêncio acima disso no meio da frase mata
PAUSA_LONGA = 0.8   # de 0,8 a 2,5 s avisa: só fica se é pausa do conteúdo (reza, suspense marcado no roteiro)
SEM_TEMPO = 0.03    # palavra com menos que isso no tempo que a voz devolveu: a voz não falou, o tempo foi espremido
MARGEM = 0.2        # o que a montagem deixa antes da 1ª e depois da última palavra de cada cena
LETRA = re.compile(r"[^\W\d_]")
SIMBOLOS = re.compile(r"[%$€£+=&@#/*§°ºª]")
SPEED_MAIS = "speed maior (voz da galeria até 1,2; voz clonada de 1,3 a 1,5)"
SPEED_MENOS = "speed menor (voz da galeria até 0,7; voz clonada: mande 1,0, porque sem speed ela já sai em 1,2)"


def duracao(arquivo):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(arquivo)],
                       capture_output=True, text=True)
    try:
        return float(r.stdout.strip())
    except ValueError:
        sys.exit(f"não consegui ler {arquivo} (o arquivo existe? a URL abre?)")


def amostras(arquivo):
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", str(arquivo), "-vn", "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"],
                       capture_output=True)
    if r.returncode:
        sys.exit(f"não consegui ler o som de {arquivo}: {r.stderr.decode(errors='ignore')[-300:]}")
    return array.array("h", r.stdout)


def inicio_do_audio(arquivo):
    """num vídeo, quanto o som começa depois da imagem (start_time do áudio menos o do vídeo); 0 num arquivo só de som."""
    def st(sel):
        r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", sel, "-show_entries", "stream=start_time", "-of",
                            "csv=p=0", str(arquivo)], capture_output=True, text=True).stdout.strip().splitlines()
        try:
            return float(r[0])
        except (IndexError, ValueError):
            return None
    a, v = st("a:0"), st("v:0")
    return max(0.0, a - v) if a is not None and v is not None else 0.0


def blocos_de_voz(arquivo, minimo=0.04):
    """([(de, ate)] com voz, duração do som). Voz = mais alto que 30 dB abaixo do pico (no mínimo -35 dB)."""
    x = amostras(arquivo)
    w = int(SR * JANELA)
    db = [20 * math.log10(max(1.0, math.sqrt(sum(v * v for v in x[i:i + w]) / w)) / 32768) for i in range(0, len(x) - w + 1, w)]
    total = len(x) / SR
    if not db:
        return [], total
    limite = max(-35.0, max(db) - 30)
    blocos, ini = [], None
    for k, v in enumerate(db + [-200.0]):
        if v > limite and ini is None:
            ini = k
        elif v <= limite and ini is not None:
            if (k - ini) * JANELA >= minimo:
                blocos.append((ini * JANELA, k * JANELA))
            ini = None
    return blocos, total


def palavras(frase):
    return [p for p in frase.split() if LETRA.search(p)]


def problemas_da_frase(frase):
    """(mata, avisa) do texto de uma frase, do jeito que vai pra voz."""
    mata, avisa = [], []
    if re.search(r"\d", frase):
        mata.append("número em dígito: escreva por extenso, como se fala (\"duas colheres\", \"dezenove e noventa\"); "
                    "código ou telefone, um número por vez")
    simb = sorted(set(SIMBOLOS.findall(frase)))
    if simb:
        mata.append(f"símbolo {' '.join(simb)}: escreva como se fala (\"por cento\", \"reais\", \"mais\", \"ou\")")
    caps = [re.sub(r"[^\w]", "", p) for p in frase.split()]
    caps = [c for c in caps if len(c) >= 2 and c.isalpha() and c == c.upper()]
    if caps:
        mata.append(f"em maiúscula ({', '.join(caps)}): a voz pode soletrar. No texto da voz vai em minúscula, do jeito que "
                    "se fala; sigla que se soletra vai soletrada (\"cê pê éfe\"). A tela e a legenda ficam como estão")
    n = len(palavras(frase))
    if n <= 3:
        avisa.append(f"frase de {n} palavra(s): confira se tem sujeito e verbo (frase telegrama sai com voz de robô)")
    if n > 30:
        avisa.append(f"frase de {n} palavras: quebre em duas (em frase longa a voz corre ou engole palavra)")
    return mata, avisa


def ordem(chave):
    return (0, int(chave)) if chave.isdigit() else (1, chave)


def ritmo(arquivo, fala):
    """(duração, palavras por segundo) de um arquivo falado: palavras do texto ÷ segundos do 1º ao último som de fala."""
    d = duracao(arquivo)
    f = pathlib.Path(str(fala))
    try:
        eh_arquivo = f.is_file()
    except (OSError, ValueError):  # texto longo demais pra ser nome de arquivo
        eh_arquivo = False
    txt = f.read_text(encoding="utf-8") if eh_arquivo else str(fala)
    n = len(palavras(txt))
    blocos, _ = blocos_de_voz(arquivo)
    if not n or not blocos:
        print(f"{pathlib.Path(str(arquivo)).name}: {d:.1f} s · " + ("texto vazio" if not n else "não achei som de fala")
              + ": conte as palavras faladas e divida pelos segundos do 1º ao último som de fala")
        return d, None
    de, ate = blocos[0][0], blocos[-1][1]
    pps = n / max(ate - de, 0.5)
    print(f"{pathlib.Path(str(arquivo)).name}: {d:.1f} s · {n} palavras faladas de {de:.1f} a {ate:.1f} s · {pps:.2f} palavras por segundo")
    if ate - de < 0.5 * d:
        print("avisa a fala ocupa menos da metade do arquivo: confira se o .txt tem só o que é dito e se o vídeo é mesmo falado")
    elif de < 0.05 and d - ate < 0.05:
        print("avisa o som vai do começo ao fim (música por baixo?): a conta usou o vídeo inteiro e pode ficar um pouco abaixo da fala real")
    print(f"se é o viral: no reel, dur_viral {d:.1f} e ritmo_viral {pps:.2f} · se é a fala de teste: na voz, palavras_por_segundo {pps:.2f}")
    return d, pps


def texto(frases, pps, speed=1.0, viral=None, alvo=ALVO_PAUSA):
    ritmo = pps * speed
    mata, total = 0, 0.0
    for cena in sorted(frases, key=ordem):
        lista = frases[cena] if isinstance(frases[cena], list) else [frases[cena]]
        n = sum(len(palavras(f)) for f in lista)
        seg = n / ritmo + alvo * (len(lista) - 1) + MARGEM
        total += seg
        print(f"cena {cena}: {len(lista)} frase(s), {n} palavras, ~{seg:.1f} s")
        for f in lista:
            m, a = problemas_da_frase(f)
            for x in m:
                print(f"  MATA  \"{f}\": {x}")
            for x in a:
                print(f"  avisa \"{f}\": {x}")
            mata += len(m)
        if seg > TETO_CENA:
            print(f"  MATA  cena de ~{seg:.1f} s: passa de {TETO_CENA:.0f} s e o Persona Pro recusa. Divida em 2 cenas, cada uma com a sua imagem")
            mata += 1
        elif seg > 8:
            print("  avisa cena acima de 8 s: plano longo deixa o reel lento; divida em 2 cenas se a tela deixar")
        elif seg < 5:
            print("  avisa cena abaixo de 5 s: o vídeo cobra 5 s; junte com a vizinha se a tela deixar")
    linha = f"total ~{total:.1f} s no ritmo de {ritmo:.2f} palavras por segundo"
    if viral:
        r = total / viral
        linha += f" · o viral tem {viral:.1f} s ({r:.0%})"
        if r > 1.15:
            linha += f" · MATA: longo demais. Corte ~{math.ceil((total - viral) * ritmo)} palavras (primeiro o que repete; nunca o gancho nem o fecho) ou planeje {SPEED_MAIS}"
            mata += 1
        elif r < 0.85:
            linha += f" · MATA: curto demais (fala corrida, clone raso). Acrescente ~{math.ceil((viral - total) * ritmo)} palavras do viral que ficaram de fora ou planeje {SPEED_MENOS}"
            mata += 1
    print(linha)
    print("OK: pode gerar a voz" if not mata else f"{mata} problema(s) que matam: conserte o texto antes de gerar a voz")
    return mata == 0


TOKEN = re.compile(r"(\S+)@(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)")


def ler_palavras(base):
    """tempo de cada palavra da frase, se a voz devolveu: NN-K.txt com a linha `palavra@0.12-0.40 ...` copiada da
    resposta do generate_voice / wait_for_task, ou NN-K.json ({"palavras": [{"texto", "de", "ate"}]})."""
    txt, js = base.with_suffix(".txt"), base.with_suffix(".json")
    if txt.exists():
        lista = [{"texto": w, "de": float(a), "ate": float(b)} for w, a, b in TOKEN.findall(txt.read_text(encoding="utf-8"))]
        return lista or None
    if not js.exists():
        return None
    d = json.loads(js.read_text(encoding="utf-8"))
    lista = d.get("palavras") if isinstance(d, dict) else d
    saida = []
    for p in lista or []:
        if not isinstance(p, dict):
            continue
        w = p.get("texto", p.get("palavra", p.get("word")))
        a = p.get("de", p.get("inicio", p.get("start")))
        b = p.get("ate", p.get("fim", p.get("end")))
        if w is not None and a is not None and b is not None:
            saida.append({"texto": str(w), "de": float(a), "ate": float(b)})
    return saida or None


def sem_tempo_seguidas(lista):
    """maior sequência de palavras seguidas com duração quase zero no tempo que a voz devolveu (a voz pulou o pedaço)."""
    maior = atual = 0
    for p in lista:
        atual = atual + 1 if float(p["ate"]) - float(p["de"]) < SEM_TEMPO else 0
        maior = max(maior, atual)
    return maior


def peca(pasta, cena, k):
    for ext in (".mp3", ".wav", ".m4a"):
        p = pathlib.Path(pasta) / f"{cena}-{k}{ext}"
        if p.exists():
            return p
    sys.exit(f"falta a fala {cena}-{k} em {pasta} (baixe a frase {k} da cena {cena} como {cena}-{k}.mp3)")


def juntar(frases, cena, pasta="falas", alvo=ALVO_PAUSA, pps=None, speed=1.0, falas_json=None):
    lista = frases[cena] if isinstance(frases[cena], list) else [frases[cena]]
    mata, med = 0, []
    for k, f in enumerate(lista, 1):
        arq = peca(pasta, cena, k)
        blocos, d = blocos_de_voz(arq)
        n = len(palavras(f))
        if not blocos:
            print(f"frase {k}: MATA sem voz no arquivo ({arq.name}): gere de novo")
            mata += 1
            med.append({"d": d, "cabeca": 0.0, "rabo": 0.0, "fala": 0.0, "n": n, "pal": None})
            continue
        cabeca, rabo = blocos[0][0], max(0.0, d - blocos[-1][1])
        pausas = [b[0] - a[1] for a, b in zip(blocos, blocos[1:])]
        fala = blocos[-1][1] - blocos[0][0]
        pal = ler_palavras(arq)
        linha = f"frase {k} ({arq.name}): {d:.2f} s · {n} palavras · silêncio antes {cabeca:.2f} s, depois {rabo:.2f} s"
        avisos = []
        maior = max(pausas) if pausas else 0.0
        if maior > AR_MORTO:
            avisos.append(f"MATA pausa de {maior:.1f} s no meio da frase (ar morto): gere essa frase de novo")
            mata += 1
        elif maior >= PAUSA_LONGA:
            avisos.append(f"avisa pausa de {maior:.1f} s no meio da frase: fica só se é do conteúdo; senão gere de novo")
        if pal:
            s = sem_tempo_seguidas(pal)
            if s >= 3:
                avisos.append(f"MATA {s} palavras seguidas sem tempo nenhum: a voz pulou um pedaço. Gere essa frase de novo")
                mata += 1
        if pps and fala > 0 and n >= 4:
            r = n / fala / (pps * speed)
            if r > 1.4:
                avisos.append(f"avisa {n / fala:.1f} palavras por segundo, rápida demais pro número de palavras: ouça (pode ter comido palavra)")
            elif r < 0.6:
                avisos.append(f"avisa {n / fala:.1f} palavras por segundo, lenta demais: ouça (palavra esticada ou pausa)")
        print(linha + "".join("\n  " + a for a in avisos))
        med.append({"d": d, "cabeca": cabeca, "rabo": rabo, "fala": fala, "n": n, "pal": pal})
    base = [a["rabo"] + b["cabeca"] for a, b in zip(med, med[1:])]
    if base:
        meio = sorted(base)[len(base) // 2]
        pausa = min(2.0, max(0.0, round((alvo - meio) * 20) / 20))
        if alvo - meio > 2.0:
            print(f"avisa o pauseSeconds do join_audio vai até 2,0: o silêncio entre as frases fica em ~{meio + 2.0:.2f} s, não {alvo:.2f}")
    else:
        pausa = 0.0
    inicios, t = [], 0.0
    for m in med:
        inicios.append(t)
        t += m["d"] + pausa
    total = t - pausa
    for k, g in enumerate(base, 1):
        if g + pausa > PAUSA_LONGA:
            print(f"avisa entre a frase {k} e a {k + 1} ficam {g + pausa:.2f} s de silêncio: ok se for pausa do conteúdo; senão gere de novo a frase {k} ou a {k + 1}")
    primeira = med[0]["cabeca"]
    fim = inicios[-1] + med[-1]["d"] - med[-1]["rabo"]
    fala_s = max(0.0, fim - primeira)
    npal = sum(m["n"] for m in med)
    falado = sum(m["fala"] for m in med)
    if falado > 0:
        print(f"ritmo da cena: {npal} palavras em {falado:.2f} s de fala = {npal / falado:.2f} palavras por segundo")
    if len(lista) == 1:
        print(f"1 frase: não precisa juntar. A URL dessa fala vai direto como audioUrl. Cena de {total:.2f} s")
    else:
        print(f"join_audio com as {len(lista)} falas nesta ordem e pauseSeconds: {pausa:.2f} → cena de ~{total:.2f} s "
              f"(o join_audio devolve o número certo)")
    if total > TETO_CENA:
        print(f"MATA a cena dá {total:.1f} s: passa de {TETO_CENA:.0f} s e o Persona Pro recusa. Divida em 2 cenas")
        mata += 1
    if all(m["pal"] for m in med):
        cena_pal = [{"texto": p["texto"], "de": round(i + float(p["de"]), 3), "ate": round(i + float(p["ate"]), 3)}
                    for i, m in zip(inicios, med) for p in m["pal"]]
        item = {"palavras": cena_pal}
    else:
        item = {"texto": " ".join(lista)}
    item.update({"desloc": None, "duracao": round(total, 3), "fala_s": round(fala_s, 3), "pausa": pausa})
    destino = pathlib.Path(falas_json) if falas_json else pathlib.Path(pasta).resolve().parent / "falas.json"
    tudo = json.loads(destino.read_text(encoding="utf-8")) if destino.exists() else {}
    tudo[cena] = item
    destino.write_text(json.dumps(tudo, ensure_ascii=False, indent=1), encoding="utf-8")
    print(("OK" if not mata else f"{mata} problema(s) que matam: refaça só a frase apontada (é barata) antes do vídeo")
          + f" · cena gravada em {destino.name}")
    return mata == 0, pausa, item


def soma(falas, viral, ritmo_viral=None):
    cenas = sorted(falas, key=ordem)
    total = sum(float(falas[c].get("fala_s", 0)) + MARGEM for c in cenas)
    r = total / viral
    print(f"{len(cenas)} cena(s) · fala do reel ~{total:.1f} s · o viral tem {viral:.1f} s ({r:.0%})")
    rr = None
    if ritmo_viral:
        npal = sum(len(falas[c]["palavras"]) if falas[c].get("palavras") else len(palavras(falas[c].get("texto", "")))
                   for c in cenas)
        falado = sum(float(falas[c].get("fala_s", 0)) for c in cenas)
        if falado > 0 and npal:
            rr = npal / falado / ritmo_viral
            print(f"ritmo do reel: {npal} palavras em {falado:.1f} s de fala = {npal / falado:.2f} palavras por segundo · "
                  f"o viral fala {ritmo_viral:.2f} ({rr:.0%})")
    lento, corrido = rr is not None and rr < 0.85, rr is not None and rr > 1.15
    if r > 1.15:
        if lento:
            print(f"MATA longo demais e mais lento que o viral: gere de novo as falas com {SPEED_MAIS}, ANTES do vídeo")
        else:
            print(f"MATA longo demais: corte texto (primeiro o que repete; nunca o gancho nem o fecho) ou gere de novo todas "
                  f"as falas com {SPEED_MAIS} (o speed é um só no reel), ANTES do vídeo")
    elif r < 0.85:
        if corrido:
            print(f"MATA curto demais e mais corrido que o viral: gere de novo as falas com {SPEED_MENOS}, ANTES do vídeo; "
                  "vídeo em cima de fala corrida custa o reel")
        else:
            print("MATA curto demais: faltou texto do viral. Volte ao roteiro e acrescente o que ficou de fora (as batidas do "
                  f"viral), ou gere de novo com {SPEED_MENOS}, ANTES do vídeo")
    elif lento:
        print(f"avisa o tamanho cabe, mas a fala está mais lenta que a do viral: o reel prende menos. Gere de novo com {SPEED_MAIS} "
              "e acrescente o texto do viral que ficou de fora")
    elif corrido:
        print(f"avisa o tamanho cabe, mas a fala está mais corrida que a do viral: ouça. Se embola, gere de novo com {SPEED_MENOS} "
              "e corte o que repete")
    else:
        print("OK: o tamanho cabe no do viral" + (" e o ritmo é o dele" if rr is not None else ""))
    return 0.85 <= r <= 1.15


def corte_da_fala(ba, bv, desloc):
    """[de, ate] da fala mandada dentro da cena, quando a voz a mais vem só depois dela (o começo bate); senão None."""
    if abs((bv[0][1] - bv[0][0]) - (ba[0][1] - ba[0][0])) > 0.2:
        return None
    return [round(max(0.0, ba[0][0] + desloc - 0.08), 2), round(ba[-1][1] + desloc + 0.12, 2)]


def video(audio, cena_mp4, minimo=0.85, falas_json=None, cena=None):
    ba, _ = blocos_de_voz(audio)
    bv, _ = blocos_de_voz(cena_mp4)
    sa, sv = sum(b - a for a, b in ba), sum(b - a for a, b in bv)
    r = sv / sa if sa else 0.0
    ok = r >= minimo
    print(f"voz mandada {sa:.2f} s · voz na cena {sv:.2f} s · {r:.0%} · "
          + ("OK" if ok else "PERDEU FALA: refaça a cena com o MESMO áudio (não gere a voz de novo)"))
    if r > 1.25 and not (ba and bv):
        print("avisa a cena tem mais voz que o áudio mandado: o aluno ouve (som inventado ou fala repetida)")
    if ba and bv:
        desloc = bv[0][0] + inicio_do_audio(cena_mp4) - ba[0][0]
        print(f"a voz entra {desloc:+.2f} s em relação ao áudio (desloc da legenda) e vai de "
              f"{bv[0][0]:.2f} a {bv[-1][1]:.2f} s na cena")
        if r > 1.25:
            trecho = corte_da_fala(ba, bv, desloc)
            if trecho:
                print("avisa a cena tem mais voz que o áudio mandado, depois da última palavra (som inventado ou a fala repetida): "
                      "a montagem corta pelo som e levaria isso junto. Pra ficar só com a fala mandada, ponha no cortes.json da "
                      f"montagem (montar.py --cortes) " + json.dumps({cena or "NN": [trecho]}))
            else:
                print("avisa a cena tem mais voz que o áudio mandado, e não só no fim (som inventado ou fala trocada): o aluno ouve; "
                      "se a fala não é a mandada, refaça a cena com o MESMO áudio")
        if falas_json and cena:
            p = pathlib.Path(falas_json)
            tudo = json.loads(p.read_text(encoding="utf-8")) if p.exists() else {}
            tudo.setdefault(cena, {})["desloc"] = round(desloc, 3)
            p.write_text(json.dumps(tudo, ensure_ascii=False, indent=1), encoding="utf-8")
            print(f"desloc gravado na cena {cena} de {p.name}")
    return ok


def teste():
    def gera(destino, partes, video=False, atraso=0.0):
        """partes = [(segundos, tem_voz)]: tom de 220 Hz onde tem voz, silêncio no resto."""
        fil, n = [], len(partes)
        for i, (s, voz) in enumerate(partes):
            fil.append(f"sine=f=220:d={s}:sample_rate=44100,volume={1 if voz else 0}[p{i}]")
        fil.append("".join(f"[p{i}]" for i in range(n)) + f"concat=n={n}:v=0:a=1[a]")
        if not video:
            subprocess.run(["ffmpeg", "-y", "-v", "error", "-filter_complex", ";".join(fil), "-map", "[a]", str(destino)], check=True)
            return
        d = sum(s for s, _ in partes) + atraso + 0.5
        fil[-1] = fil[-1].replace("[a]", "[a0]")
        fil.append(f"[a0]adelay={int(atraso * 1000)}:all=1,apad=whole_dur={d}[a]")
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "lavfi", "-i", f"color=c=gray:s=180x320:r=24:d={d}",
                        "-filter_complex", ";".join(fil), "-map", "0:v", "-map", "[a]", "-t", str(d), "-c:v", "libx264",
                        "-preset", "ultrafast", "-c:a", "aac", str(destino)], check=True)

    with tempfile.TemporaryDirectory() as t:
        t = pathlib.Path(t)
        boas = {"01": ["Sabe por que a sua planta fica amarela tão rápido?", "É a água da torneira que você põe nela."],
                "02": ["Deixa a água descansar uma noite inteira no copo antes de regar."]}
        ruins = {"01": ["Põe 2 colheres de vinagre", "e 10% de água."], "02": ["Comenta PLANTA", "Só isso."]}
        assert texto(boas, pps=2.6) is True, "texto bom reprovado"
        assert texto(ruins, pps=2.6) is False, "dígito, símbolo e maiúscula passaram"
        m, a = problemas_da_frase("Comenta planta que eu te mando")
        assert not m and not a, f"frase limpa apontada: {m} {a}"
        assert problemas_da_frase("Comenta PLANTA")[0], "palavra toda em maiúscula passou"
        assert problemas_da_frase("custa R$ dezenove")[0], "R$ passou"
        assert texto(boas, pps=2.6, viral=30.0) is False, "roteiro de ~10 s contra viral de 30 s passou"
        assert texto(boas, pps=2.6, viral=12.5) is True, "roteiro do tamanho do viral reprovado"
        longa = {"01": [" ".join(["palavra"] * 45)]}
        assert texto(longa, pps=2.6) is False, "cena de mais de 15 s passou"

        f = t / "reel" / "falas"; f.mkdir(parents=True)
        gera(f / "01-1.wav", [(0.10, False), (1.20, True), (0.30, False)])
        gera(f / "01-2.wav", [(0.06, False), (1.00, True), (0.10, False)])
        (f / "01-1.json").write_text(json.dumps({"palavras": [{"texto": "Sabe", "de": 0.10, "ate": 0.50},
                                                              {"texto": "disso?", "de": 0.50, "ate": 1.30}]}), encoding="utf-8")
        (f / "01-2.txt").write_text("Duração da fala: 1.06s (2 palavras). Tempo por palavra (s):\nOlha@0.06-0.5 só.@0.5-1.06\n",
                                    encoding="utf-8")
        frases = {"01": ["Sabe disso?", "Olha só."]}
        ok, pausa, item = juntar(frases, "01", pasta=f)
        assert ok, "cena boa reprovada"
        assert abs(pausa - 0.05) < 0.051, f"pausa calculada {pausa} (esperado ~0,05: 0,40 menos 0,30 de fim e 0,06 de começo)"
        assert abs(item["palavras"][2]["de"] - (1.60 + pausa + 0.06)) < 0.03, f"tempo da 2ª frase fora do lugar: {item['palavras'][2]}"
        assert abs(item["duracao"] - (1.60 + pausa + 1.16)) < 0.05, f"duração prevista errada: {item['duracao']}"
        assert abs(item["fala_s"] - (1.20 + 0.30 + pausa + 0.06 + 1.00)) < 0.06, f"fala da cena errada: {item['fala_s']}"
        assert json.loads((t / "reel" / "falas.json").read_text(encoding="utf-8"))["01"]["pausa"] == pausa, "falas.json não gravou"
        gera(f / "02-1.wav", [(0.05, False), (1.0, True), (3.0, False), (1.0, True), (0.1, False)])
        assert juntar({"02": ["Uma frase com ar morto no meio."]}, "02", pasta=f)[0] is False, "pausa de 3 s passou"
        gera(f / "03-1.wav", [(0.05, False), (1.5, True), (0.1, False)])
        (f / "03-1.json").write_text(json.dumps({"palavras": [{"texto": w, "de": 0.5, "ate": 0.5 + (0.3 if i < 2 else 0.01)}
                                                              for i, w in enumerate("isso aqui que eu vou te".split())]}), encoding="utf-8")
        assert juntar({"03": ["isso aqui que eu vou te"]}, "03", pasta=f)[0] is False, "3 palavras sem tempo passaram"
        assert soma({"01": {"fala_s": 4.8}, "02": {"fala_s": 5.0}}, viral=10.0) is True, "reel do tamanho do viral reprovado"
        assert soma({"01": {"fala_s": 3.0}, "02": {"fala_s": 3.0}}, viral=10.0) is False, "reel curto passou"
        lenta = {"01": {"fala_s": 4.8, "texto": "uma duas três quatro cinco seis sete oito"},
                 "02": {"fala_s": 5.0, "texto": "nove dez onze doze treze catorze quinze dezesseis"}}
        assert soma(lenta, viral=10.0, ritmo_viral=2.5) is True, "tamanho certo reprovado por ritmo (ritmo só avisa)"
        assert soma({"01": {"fala_s": 13.0, "texto": "palavra " * 20}}, viral=10.0, ritmo_viral=2.5) is False, "longo e lento passou"

        gera(t / "viral.mp4", [(0.50, False), (4.00, True), (0.30, False), (3.70, True), (1.50, False)], video=True)
        (t / "viral.txt").write_text("um dois três quatro cinco seis sete oito nove dez onze doze treze catorze quinze "
                                     "dezesseis dezessete dezoito dezenove vinte vinte e um vinte e dois", encoding="utf-8")
        dv, pv = ritmo(t / "viral.mp4", t / "viral.txt")
        assert abs(pv - 26 / 8.0) < 0.15, f"ritmo do viral medido {pv} (esperado ~3,25: 26 palavras em 8 s de fala)"
        assert dv > 10.0, f"duração do viral medida {dv}"
        dl, pl = ritmo(t / "viral.mp4", " ".join(["palavra"] * 60))
        assert pl is not None and abs(pl - 60 / 8.0) < 0.4, "texto longo direto na linha de comando quebrou o ritmo"

        gera(t / "a.wav", [(0.20, False), (3.00, True), (0.20, False)])
        gera(t / "v.mp4", [(0.20, False), (3.00, True), (0.20, False)], video=True, atraso=0.30)
        gera(t / "comeu.mp4", [(0.20, False), (1.20, True), (2.00, False)], video=True)
        assert video(t / "a.wav", t / "v.mp4", falas_json=t / "reel" / "falas.json", cena="01") is True, "cena inteira reprovada"
        d = json.loads((t / "reel" / "falas.json").read_text(encoding="utf-8"))["01"]["desloc"]
        assert abs(d - 0.30) < 0.06, f"atraso da voz medido {d} (esperado 0,30)"
        assert video(t / "a.wav", t / "comeu.mp4") is False, "cena que perdeu fala passou"
        gera(t / "repetiu.mp4", [(0.20, False), (3.00, True), (0.60, False), (1.50, True), (0.30, False)], video=True)
        ba, bv = blocos_de_voz(t / "a.wav")[0], blocos_de_voz(t / "repetiu.mp4")[0]
        tr = corte_da_fala(ba, bv, bv[0][0] + inicio_do_audio(t / "repetiu.mp4") - ba[0][0])
        assert tr and abs(tr[1] - 3.32) < 0.12 and tr[0] < 0.2, f"corte da fala repetida errado: {tr} (esperado até ~3,3 s)"
        assert video(t / "a.wav", t / "repetiu.mp4") is True, "fala inteira com voz a mais no fim reprovada (só avisa)"
    print("teste ok: ritmo (medido do 1º ao último som de fala), texto (dígito, símbolo, maiúscula, cena acima de 15 s e tamanho contra o viral), juntar (pausa calculada "
          "pelo silêncio das pontas, tempo das palavras deslocado, ar morto e palavras sem tempo reprovados, falas.json gravado), "
          "soma contra o viral (com o ritmo dele) e video (fala comida reprovada, atraso da voz medido e gravado, voz a mais no fim "
          "com o trecho pro corte)")


def main():
    if sys.argv[1:] == ["--teste"]:
        return teste()
    p = argparse.ArgumentParser(description="confere a fala antes e depois do vídeo")
    s = p.add_subparsers(dest="modo", required=True)
    w = s.add_parser("ritmo"); w.add_argument("arquivo"); w.add_argument("fala")
    a = s.add_parser("texto"); a.add_argument("frases"); a.add_argument("--pps", type=float, required=True)
    a.add_argument("--speed", type=float, default=1.0); a.add_argument("--viral", type=float)
    b = s.add_parser("juntar"); b.add_argument("frases"); b.add_argument("cena"); b.add_argument("--pasta", default="falas")
    b.add_argument("--alvo", type=float, default=ALVO_PAUSA); b.add_argument("--pps", type=float)
    b.add_argument("--speed", type=float, default=1.0); b.add_argument("--falas")
    c = s.add_parser("soma"); c.add_argument("falas"); c.add_argument("--viral", type=float, required=True)
    c.add_argument("--ritmo-viral", type=float)
    v = s.add_parser("video"); v.add_argument("audio"); v.add_argument("cena_mp4"); v.add_argument("--minimo", type=float, default=0.85)
    v.add_argument("--falas"); v.add_argument("--cena")
    o = p.parse_args()
    ler = lambda x: json.loads(pathlib.Path(x).read_text(encoding="utf-8"))
    if o.modo == "ritmo":
        ok = ritmo(o.arquivo, o.fala)[1] is not None
    elif o.modo == "texto":
        ok = texto(ler(o.frases), o.pps, o.speed, o.viral)
    elif o.modo == "juntar":
        fr = ler(o.frases)
        if o.cena not in fr:
            sys.exit(f"a cena {o.cena} não está em {o.frases}")
        ok = juntar(fr, o.cena, o.pasta, o.alvo, o.pps, o.speed, o.falas)[0]
    elif o.modo == "soma":
        ok = soma(ler(o.falas), o.viral, o.ritmo_viral)
    else:
        ok = video(o.audio, o.cena_mp4, o.minimo, o.falas, o.cena)
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()

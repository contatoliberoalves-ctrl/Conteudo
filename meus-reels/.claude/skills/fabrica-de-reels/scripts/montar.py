#!/usr/bin/env python3
"""Monta o reel: corta cada cena no fim da fala (medido pelo ÁUDIO do próprio vídeo), junta na ordem (01.mp4, 02.mp4...),
deixa todas no mesmo volume e queima a legenda, o gancho (começo), o pedido do meio (quando pedir) e o CTA (fim).

Uso: python3 montar.py <pasta-das-cenas> --saida reel.mp4 [--legendas legendas.json] [--gancho "texto" --gancho-y <px>] [--cta "Comenta PALAVRA" --cta-y <px>]
                       [--cta-meio "Comenta PALAVRA\nque eu te mando" --cta-meio-y <px>]
                       [--cortes cortes.json] [--ritmo 1.0]   (a posição do texto é obrigatória: escolha olhando os quadros)
     python3 montar.py legendas <pasta-das-cenas> falas.json --saida legendas.json   (monta a legenda, ver abaixo)
     python3 montar.py rostos <pasta de imagens ou de cenas> --ref <foto do rosto> --saida folha.jpg   (portão do rosto, ver abaixo)
     python3 montar.py --teste
rostos = folha com o rosto de referência (1º, com borda) e o terço de cima de cada imagem (.png/.jpg) ou do quadro do meio de
  cada cena (.mp4), lado a lado, na ordem dos nomes. É o portão antes de pagar o vídeo: rosto que destoa da referência = refaz.
falas.json = por cena, do jeito que tiver: com o tempo de cada palavra (Persona Pro, da resposta da fala)
  {"01": {"palavras": [{"texto": "Cê", "de": 0.10, "ate": 0.32}, ...], "desloc": 0.0}}
  (desloc = quanto somar ao tempo da fala pra cair no tempo do vídeo: o atraso de entrada do vídeo, ou negativo quando a
  cena começa no meio de uma fala maior; quem grava é o conferir_fala.py video com --falas e --cena, e cena com palavras
  e sem desloc é recusada), ou só o texto (sem voz no idioma: o Avatar Pro falou o texto e a voz foi trocada, então não há tempo por palavra)
  {"02": {"texto": "Toma um gole de manhã"}}: os blocos são espalhados pelos trechos com som da cena, na proporção das letras.
Gancho e palavra pra comentar: até 18 letras por linha e no máximo 2 linhas (quebre com \n de propósito).
Pedido do meio (--cta-meio): 4 s a partir do 1º corte de cena depois de 1/4 do reel (nunca antes do fim do gancho; termina
  0,3 s antes do pedido do fim); a legenda some nesses 4 s. Reel com menos de ~11 s sai sem ele (o script avisa).
legendas.json = por cena, tempos DENTRO da cena: {"01": [{"de": 0.0, "ate": 0.6, "texto": "Cê pode"}, ...]}
cortes.json (opcional) = os trechos que FICAM de uma cena, em segundos: {"03": [[0.0, 4.2]]}. Cena fora dele: corte automático.
Grava ao lado do reel <saida>-cortes.json (os trechos que ficaram de cada cena, no formato do cortes.json: copie a linha da cena e mexa só no que precisa) e
<saida>-legendas.json (cada bloco da legenda com o segundo dele no reel, já com o --ritmo, também os que o pedido do meio esconde).
Precisa de ffmpeg com libass (o ffmpeg do site do Claude e o do brew têm). Sai 1080x1920, 30 fps, AAC.
"""
import argparse, array, json, math, pathlib, re, shutil, subprocess, sys, tempfile

ALVO_LUFS = -16.0  # mesmo volume em todas as cenas (ganho fixo por cena, sem compressor que achata a fala)
LARG, ALT = 1080, 1920


def cmd(*a, cwd=None):
    r = subprocess.run(a, capture_output=True, text=True, cwd=cwd)
    if r.returncode:
        sys.exit(f"ffmpeg falhou: {' '.join(map(str, a[:6]))}...\n{r.stderr[-800:]}")
    return r


def duracao(arquivo):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(arquivo)],
                       capture_output=True, text=True)
    return float(r.stdout.strip())


def tem_audio(arquivo):
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a", "-show_entries", "stream=index", "-of", "csv=p=0", str(arquivo)],
                       capture_output=True, text=True)
    return bool(r.stdout.strip())


def inicio_do_audio(arquivo):
    """quanto o som começa depois da imagem (start_time do áudio menos o do vídeo): o ffmpeg entrega o som a partir do 1º
    pedaço de áudio, então o fim medido nele precisa desse deslocamento pra cair no tempo do vídeo."""
    def st(sel):
        r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", sel, "-show_entries", "stream=start_time", "-of", "csv=p=0",
                            str(arquivo)], capture_output=True, text=True).stdout.strip().splitlines()
        try:
            return float(r[0])
        except (IndexError, ValueError):
            return 0.0
    return max(0.0, st("a:0") - st("v:0"))


def envelope(arquivo, janela=0.05):
    """volume do som a cada 0,05 s (dB) e o limite que separa fala de silêncio."""
    sr = 8000
    x = array.array("h", subprocess.run(["ffmpeg", "-v", "error", "-i", str(arquivo), "-vn", "-ac", "1", "-ar", str(sr),
                                         "-f", "s16le", "-"], capture_output=True).stdout)
    w = int(sr * janela)
    db = [20 * math.log10(max(1.0, math.sqrt(sum(v * v for v in x[i:i + w]) / w)) / 32768) for i in range(0, len(x) - w + 1, w)]
    return db, (max(-35.0, max(db) - 30) if db else 0.0)


def blocos_de_som(arquivo, janela=0.05, minimo=0.15):
    """trechos com som forte (fala) de pelo menos `minimo` s, no tempo do vídeo."""
    db, limite = envelope(arquivo, janela)
    desloc = inicio_do_audio(arquivo)
    blocos, ini = [], None
    for k, v in enumerate(db + [-200.0]):
        if v > limite and ini is None:
            ini = k
        elif v <= limite and ini is not None:
            if (k - ini) * janela >= minimo:
                blocos.append([ini * janela + desloc, k * janela + desloc])
            ini = None
    return blocos


def trechos_da_fala(arquivo, cabeca=0.08, rabo=0.12, pausa_max=0.40, pausa_alvo=0.24, janela=0.05, minimo=0.15):
    """pedaços da cena que ficam no reel: começa um instante antes da 1ª palavra, termina logo depois da última e
    encolhe toda pausa no meio maior que pausa_max pra pausa_alvo (corta só o miolo do silêncio, com margem dos dois
    lados, pra não comer começo nem fim de palavra). Sem som: a cena inteira."""
    d = duracao(arquivo)
    if not tem_audio(arquivo):
        return [[0.0, d]]
    blocos = blocos_de_som(arquivo, janela, minimo)
    if not blocos:
        return [[0.0, d]]
    juntos = [blocos[0][:]]
    for b in blocos[1:]:
        if b[0] - juntos[-1][1] > pausa_max:
            juntos.append(b[:])
        else:
            juntos[-1][1] = b[1]
    m = pausa_alvo / 2
    out = []
    for i, (x, y) in enumerate(juntos):
        de = max(0.0, x - (cabeca if i == 0 else m))
        ate = min(d, y + (rabo if i == len(juntos) - 1 else m))
        if out and de <= out[-1][1]:
            out[-1][1] = ate
        else:
            out.append([de, ate])
    return out


def no_reel(t, trechos):
    """tempo da cena original -> tempo dentro da cena já cortada (None se caiu num pedaço cortado antes do 1º trecho)."""
    acum = 0.0
    for de, ate in trechos:
        if t < de:
            return acum
        if t <= ate:
            return acum + (t - de)
        acum += ate - de
    return acum


def volume(arquivo):
    r = subprocess.run(["ffmpeg", "-nostats", "-i", str(arquivo), "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True)
    achou = re.findall(r"I:\s+(-?[\d.]+) LUFS", r.stderr)
    return float(achou[-1]) if achou else None


def normalizar(entrada, saida, trechos):
    """padroniza tamanho/fps/som, corta os trechos e iguala o volume. Partes intermediárias em PCM: o AAC perde ~0,05 s
    no fim de cada arquivo e, somado nas emendas, descasa o som da boca."""
    if tem_audio(entrada):
        entradas, a_in = ["-i", str(entrada)], "[0:a]"
    else:
        entradas, a_in = ["-i", str(entrada), "-f", "lavfi", "-t", str(duracao(entrada)), "-i", "anullsrc=r=44100:cl=stereo"], "[1:a]"
    f = []
    for i, (ini, fim) in enumerate(trechos):
        d = fim - ini
        f.append(f"[0:v]trim={ini}:{fim},setpts=PTS-STARTPTS[v{i}]")
        f.append(f"{a_in}atrim={ini}:{fim},asetpts=PTS-STARTPTS,aresample=44100,afade=t=in:d=0.012,afade=t=out:st={max(d - 0.04, 0):.3f}:d=0.04[a{i}]")
    k = len(trechos)
    f.append("".join(f"[v{i}][a{i}]" for i in range(k)) + f"concat=n={k}:v=1:a=1[vc][ac]")
    f.append(f"[vc]scale={LARG}:{ALT}:force_original_aspect_ratio=increase,crop={LARG}:{ALT},fps=30,setsar=1[v]")
    meio = saida.with_name(saida.stem + "-c.mkv")
    cmd("ffmpeg", "-y", "-loglevel", "error", *entradas, "-filter_complex", ";".join(f), "-map", "[v]", "-map", "[ac]",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", "-c:a", "pcm_s16le", "-ar", "44100", "-ac", "2", str(meio))
    lufs = volume(meio)
    ganho = 0.0 if lufs is None or lufs < -60 else ALVO_LUFS - lufs
    d = quadros(meio) / 30  # som com o tamanho exato da imagem
    cmd("ffmpeg", "-y", "-loglevel", "error", "-i", str(meio), "-c:v", "copy",
        "-af", f"volume={ganho:.2f}dB,alimiter=limit=0.89:level=false,apad=whole_dur={d:.4f},atrim=0:{d:.4f}",
        "-c:a", "pcm_s16le", "-ar", "44100", "-ac", "2", str(saida))
    return d


def quadros(arquivo):
    r = subprocess.run(["ffprobe", "-v", "error", "-count_frames", "-select_streams", "v", "-show_entries",
                        "stream=nb_read_frames", "-of", "csv=p=0", str(arquivo)], capture_output=True, text=True)
    return int(r.stdout.strip())


def t_ass(s):
    s = max(s, 0)
    return "%d:%02d:%05.2f" % (int(s // 3600), int(s % 3600 // 60), s % 60)


# Área livre do Instagram num reel 1080x1920: a barra de cima cobre até ~270 px e o nome do perfil, a legenda do post e o
# áudio cobrem de ~1340 px pra baixo; os botões (curtir, comentar, enviar) ficam na coluna da direita, ~180 px.
TOPO_LIVRE, BASE_LIVRE = 270, 1340
Y_LEGENDA = 1210  # centro da legenda, em px. Gancho e palavra pra comentar NÃO têm posição padrão: quem monta olha os quadros e escolhe


MAX_LETRAS, MAX_LINHAS = 18, 2  # gancho e palavra pra comentar: acima disso a caixa quebra sozinha e sai da faixa livre


def confere_texto(nome, texto, y):
    """recusa linha com mais de 18 letras ou mais de 2 linhas; a altura conta as linhas, pra a caixa não sair da faixa livre."""
    linhas = texto.split("\n")
    if len(linhas) > MAX_LINHAS:
        sys.exit(f"{nome} tem {len(linhas)} linhas; no máximo {MAX_LINHAS}.")
    for l in linhas:
        if len(l) > MAX_LETRAS:
            sys.exit(f"{nome}: a linha '{l}' tem {len(l)} letras; o máximo é {MAX_LETRAS} por linha. "
                     f"Encurte, ou quebre em 2 linhas de propósito com \\n (ex.: 'Unha fraca\\nque descasca').")
    confere_y(nome, y, 60 * len(linhas))


def confere_y(nome, y, meia_altura):
    if y - meia_altura < TOPO_LIVRE or y + meia_altura > BASE_LIVRE:
        sys.exit(f"{nome} em y={y} fica debaixo da tela do Instagram (livre: de {TOPO_LIVRE} a {BASE_LIVRE} px). "
                 f"Use um y entre {TOPO_LIVRE + meia_altura} e {BASE_LIVRE - meia_altura}.")


def escreve_ass(caminho, eventos, estilo="amarelo"):
    """eventos = [(de, ate, estilo, texto, y)]. L = legenda (branca com contorno), G = gancho e C = palavra pra comentar
    (caixa branca, letra preta). y = centro do texto em px; sempre dentro da área livre do Instagram."""
    cab = ("[Script Info]\nScriptType: v4.00+\nPlayResX: 1080\nPlayResY: 1920\nWrapStyle: 2\n\n[V4+ Styles]\n"
           "Format: Name, Fontname, Fontsize, PrimaryColour, OutlineColour, BackColour, Bold, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV\n"
           "Style: L,Arial,84,&H00FFFFFF,&H00000000,&H80000000,1,1,6,2,5,190,190,0\n"
           + ("Style: G,Arial,80,&H00000000,&H00FFFFFF,&H00FFFFFF,1,3,16,0,5,120,120,0\n"   # caixa branca, letra preta
              "Style: C,Arial,88,&H00000000,&H00FFFFFF,&H00FFFFFF,1,3,16,0,5,120,120,0\n" if estilo == "caixa" else
              "Style: G,Arial,88,&H0000FFFF,&H00000000,&H80000000,1,1,7,2,5,120,120,0\n"   # amarelo com contorno preto (padrão)
              "Style: C,Arial,96,&H0000FFFF,&H00000000,&H80000000,1,1,7,2,5,120,120,0\n")
           + "\n[Events]\n"
           "Format: Layer, Start, End, Style, Text\n")
    with open(caminho, "w", encoding="utf-8") as f:
        f.write(cab)
        for de, ate, estilo, texto, y in eventos:
            if ate > de:
                texto = texto.replace("{", "(").replace("}", ")")  # chave abre comando de estilo no ASS
                pos = "{\\an5\\pos(540,%d)}" % y
                f.write(f"Dialogue: 0,{t_ass(de)},{t_ass(ate)},{estilo},{pos}{texto.replace(chr(10), chr(92) + 'N')}\n")


DUR_MEIO = 4.0  # segundos do pedido do meio na tela


def janela_do_meio(limites, total, fim_gancho=3.0, dur_cta=3.0, dur=DUR_MEIO):
    """(de, ate) do pedido do meio: a partir do 1º corte de cena depois de 1/4 do reel, nunca antes do fim do gancho, e
    terminando 0,3 s antes do pedido do fim. Sem corte nessa faixa, entra em 1/4 do reel. Reel curto demais: None."""
    piso = max(total * 0.25, fim_gancho)
    teto = total - dur_cta - 0.3 - dur
    if teto < piso:
        return None
    for x in limites:
        if piso <= x <= teto:
            return (round(x, 3), round(x + dur, 3))
    return (round(piso, 3), round(piso + dur, 3))


def sem_legenda_em(eventos, de, ate):
    """a legenda some enquanto o pedido do meio está na tela (o bloco é cortado na borda; sobra de menos de 0,3 s sai)."""
    saida = []
    for e in eventos:
        a, b = e[0], e[1]
        if e[2] != "L" or b <= de or a >= ate:
            saida.append(e)
            continue
        if de - a >= 0.3:
            saida.append((a, de) + tuple(e[2:]))
        if b - ate >= 0.3:
            saida.append((ate, b) + tuple(e[2:]))
    return saida


def montar(pasta, saida, legendas=None, gancho="", cta="", cortes=None, rabo=0.12, cabeca=0.08, pausa_max=0.40,
           ritmo=1.0, y_gancho=None, y_cta=None, y_legenda=Y_LEGENDA, estilo="amarelo", cta_meio="", y_cta_meio=None):
    for nome, texto, y, onde in (("--gancho-y", gancho, y_gancho, "dos 3 primeiros segundos"), ("--cta-y", cta, y_cta, "dos 3 últimos"),
                                 ("--cta-meio-y", cta_meio, y_cta_meio, "de 1/4 até a metade do reel")):
        if texto and y is None:
            sys.exit(f"falta {nome}: tire 5 quadros {onde}, veja onde estão o ROSTO e o objeto em todos eles e passe o centro "
                     f"do texto (px, de {TOPO_LIVRE + 60} a {BASE_LIVRE - 60}) numa faixa que não encoste no rosto. "
                     "Texto em cima do rosto reprova o reel; chapéu ou boina baixa conta como rosto.")
    cenas = sorted((p for p in pathlib.Path(pasta).glob("*.mp4") if re.fullmatch(r"\d+\.mp4", p.name)), key=lambda p: int(p.stem))
    if not cenas:
        sys.exit(f"nenhum .mp4 em {pasta}")
    if not 1.0 <= ritmo <= 1.15:
        sys.exit("ritmo vai de 1.0 a 1.15: acima disso a fala fica corrida e a boca denuncia")
    gancho, cta, cta_meio = (x.replace("\\n", "\n") for x in (gancho, cta, cta_meio))
    if gancho:
        confere_texto("o gancho", gancho, y_gancho)
    if cta:
        confere_texto("a palavra pra comentar", cta, y_cta)
    if cta_meio:
        confere_texto("o pedido do meio", cta_meio, y_cta_meio)
    confere_y("a legenda", y_legenda, 55)
    legendas, cortes = legendas or {}, cortes or {}
    saida = pathlib.Path(saida).resolve()
    with tempfile.TemporaryDirectory() as tmp:
        tmp = pathlib.Path(tmp); partes, eventos, inicio, tabela, limites = [], [], 0.0, [], []
        usados = {}  # os trechos que ficaram de cada cena (vão pro <saida>-cortes.json)
        for i, c in enumerate(cenas):
            trechos = cortes.get(c.stem) or trechos_da_fala(c, cabeca, rabo, pausa_max)
            usados[c.stem] = [[round(a, 3), round(b, 3)] for a, b in trechos]
            n = tmp / f"{i:02d}.mkv"
            d = normalizar(c, n, trechos)
            partes.append(n)
            for g in legendas.get(c.stem, []):  # o tempo da legenda acompanha os cortes da cena
                de, ate = no_reel(g["de"], trechos), no_reel(g["ate"], trechos)
                if ate - de > 0.05:
                    eventos.append((inicio + de, inicio + min(ate, d), "L", g["texto"], y_legenda))
            tabela.append(f"{c.stem}: usa {d:.2f} s de {duracao(c):.2f} s" + (f" ({len(trechos) - 1} pausa encolhida)" if len(trechos) > 1 else ""))
            inicio += d
            limites.append(inicio)
        eventos = [(de / ritmo, ate / ritmo, e, t, y) for de, ate, e, t, y in eventos]
        total = inicio / ritmo
        leg_reel = [{"de": round(de, 3), "ate": round(ate, 3), "texto": x} for de, ate, e, x, _ in eventos if e == "L"]  # antes do pedido do meio esconder
        if gancho:
            eventos.append((0.0, min(3.0, total), "G", gancho, y_gancho))
        if cta:
            eventos.append((max(total - 3.0, 0), total, "C", cta, y_cta))
        meio = None
        if cta_meio:
            meio = janela_do_meio([x / ritmo for x in limites[:-1]], total, 3.0 if gancho else 0.0, 3.0 if cta else 0.0)
            if meio:
                eventos = sem_legenda_em(eventos, *meio)
                eventos.append((meio[0], meio[1], "C", cta_meio, y_cta_meio))
                print(f"pedido do meio: de {meio[0]:.2f} a {meio[1]:.2f} s (a legenda some nesse trecho)")
            else:
                print(f"aviso: o reel tem {total:.1f} s, curto demais pro pedido do meio (precisa de uns 11 s): saiu sem ele")
        escreve_ass(tmp / "t.ass", eventos, estilo)
        entradas = [x for p in partes for x in ("-i", str(p))]
        anda = f"[vc0]setpts=PTS/{ritmo}[vc];[a0]atempo={ritmo}[a];" if ritmo != 1.0 else "[vc0]null[vc];[a0]anull[a];"
        juntar = ("".join(f"[{i}:v][{i}:a]" for i in range(len(partes))) + f"concat=n={len(partes)}:v=1:a=1[vc0][a0];"
                  + anda + "[vc]ass=t.ass[v]")
        cmd("ffmpeg", "-y", "-loglevel", "error", *entradas, "-filter_complex", juntar, "-map", "[v]", "-map", "[a]",
            "-r", "30", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k",
            "-ar", "44100", "-ac", "2", "-movflags", "+faststart", str(saida), cwd=tmp)
    saida.with_name(saida.stem + "-cortes.json").write_text(  # uma linha por cena: copie a da cena pro cortes.json
        "{\n" + ",\n".join(f' "{k}": {json.dumps(v)}' for k, v in usados.items()) + "\n}\n", encoding="utf-8")
    saida.with_name(saida.stem + "-legendas.json").write_text(  # cada bloco com o segundo dele no reel
        "[\n" + ",\n".join(" " + json.dumps(b, ensure_ascii=False) for b in leg_reel) + "\n]\n", encoding="utf-8")
    if gancho or cta or meio:
        folha = saida.with_name(saida.stem + "-textos.jpg")
        ts = [0.3, 0.9, 1.5, 2.1, 2.7] + [max(total - x, 0) for x in (2.7, 2.1, 1.5, 0.9, 0.3)]
        if meio:
            ts = ts[:5] + [meio[0] + 0.3 + k * (meio[1] - meio[0] - 0.6) / 4 for k in range(5)] + ts[5:]
        with tempfile.TemporaryDirectory() as tq:
            for n, x in enumerate(ts):
                cmd("ffmpeg", "-y", "-loglevel", "error", "-ss", f"{x:.2f}", "-i", str(saida), "-frames:v", "1", "-vf", "scale=270:480",
                    f"{tq}/{n:02d}.jpg")
            cmd("ffmpeg", "-y", "-loglevel", "error", "-framerate", "1", "-i", f"{tq}/%02d.jpg", "-vf", f"tile=5x{len(ts) // 5}",
                "-frames:v", "1", str(folha))
        print(f"OLHE {folha} (5 quadros do começo, {'5 do pedido do meio, ' if meio else ''}5 do fim): gancho e pedidos pra "
              "comentar não podem encostar no rosto em NENHUM deles")
    return tabela, total


def folha_de_rostos(pasta, ref, saida, colunas=6):
    """terço de cima de cada imagem/cena lado a lado, com o rosto de referência primeiro (com borda branca)."""
    # shortcut: corta o terço de cima, sem detector de rosto; personagem de corpo inteiro ou de cabeça baixa sai cortado ou
    # pequeno; se isso acontecer, recorte à mão ou troque por um detector de rosto.
    itens = sorted(p for p in pathlib.Path(pasta).iterdir() if p.suffix.lower() in (".png", ".jpg", ".jpeg", ".webp", ".mp4"))
    if not itens:
        sys.exit(f"nenhuma imagem nem cena em {pasta}")
    with tempfile.TemporaryDirectory() as tq:
        for n, f in enumerate([pathlib.Path(ref)] + itens):
            meio = ["-ss", f"{duracao(f) / 2:.2f}"] if f.suffix.lower() == ".mp4" else []
            borda = ",drawbox=x=0:y=0:w=iw:h=ih:color=white:t=8" if n == 0 else ""
            cmd("ffmpeg", "-y", "-loglevel", "error", *meio, "-i", str(f), "-frames:v", "1", "-vf",
                f"scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,crop=1080:640:0:0,scale=360:213{borda}",
                f"{tq}/{n:03d}.jpg")
        total = len(itens) + 1
        col = min(colunas, total); lin = -(-total // col)
        cmd("ffmpeg", "-y", "-loglevel", "error", "-framerate", "1", "-i", f"{tq}/%03d.jpg", "-vf", f"tile={col}x{lin}",
            "-frames:v", "1", str(saida))
    return total - 1


# palavra de ligação: bloco de legenda nunca termina nela (passa pro bloco seguinte)
LIGACAO = set("e de do da dos das o a os as que em no na nos nas um uma pra pro por com se ou mas é y el la los las en del "
              "con un una al lo the and of to in on".split())


def em_blocos(palavras):
    """grupos de 1 a 3 palavras; fecha no ponto ou na 3ª palavra, nunca numa palavra de ligação (vai até 5 se preciso)."""
    out, atual = [], []
    for i, p in enumerate(palavras):
        atual.append(i)
        limpa = re.sub(r"[^\w]", "", p.lower())
        if limpa in LIGACAO and len(atual) < 5 and i < len(palavras) - 1:
            continue
        if len(atual) >= 3 or re.search(r"[.,!?;:]$", p) or i == len(palavras) - 1:
            out.append(atual); atual = []
    if atual:
        out.append(atual)
    return out


def montar_legendas(pasta, falas):
    """{"01": [{"de", "ate", "texto"}]} no tempo de cada cena, a partir do falas.json (ver o topo do arquivo)."""
    saida = {}
    for nome, f in falas.items():
        if f.get("palavras"):
            if f.get("desloc") is None:
                sys.exit(f"cena {nome}: falta o desloc no falas.json (a cena ainda não passou no conferidor do vídeo). Rode: "
                         f"python3 S/scripts/conferir_fala.py video R/falas/{nome}.mp3 R/cenas/{nome}.mp4 --falas R/falas.json --cena {nome}")
            pal, d = f["palavras"], float(f["desloc"])
            saida[nome] = [{"de": round(pal[b[0]]["de"] + d, 3), "ate": round(pal[b[-1]]["ate"] + d, 3),
                            "texto": " ".join(pal[i]["texto"] for i in b)} for b in em_blocos([x["texto"] for x in pal])]
            continue
        palavras = f.get("texto", "").split()
        cena = pathlib.Path(pasta) / f"{nome}.mp4"
        som = blocos_de_som(cena) if cena.exists() else []
        if not palavras or not som:
            saida[nome] = []; continue
        total = sum(b - a for a, b in som)
        def no_tempo(frac):  # fração do som falado -> segundo da cena
            alvo = frac * total
            for a, b in som:
                if alvo <= b - a:
                    return a + alvo
                alvo -= b - a
            return som[-1][1]
        blocos = em_blocos(palavras)
        letras = [sum(len(palavras[i]) for i in b) for b in blocos]
        acum, lista = 0, []
        for b, n in zip(blocos, letras):
            lista.append({"de": round(no_tempo(acum / sum(letras)), 3), "ate": round(no_tempo((acum + n) / sum(letras)), 3),
                          "texto": " ".join(palavras[i] for i in b)})
            acum += n
        saida[nome] = lista
    return saida


def quadro(video, t):
    return subprocess.run(["ffmpeg", "-v", "error", "-ss", str(t), "-i", str(video), "-frames:v", "1", "-vf", "scale=108:192",
                           "-f", "rawvideo", "-pix_fmt", "gray", "-"], capture_output=True).stdout


def teste():
    with tempfile.TemporaryDirectory() as t:
        t = pathlib.Path(t); c = t / "c"; c.mkdir()
        def cena(nome, fala, atraso=0.0, dur=5, pasta=c):  # fala (tom) e silêncio até dur s, como o modelo entrega; atraso = som começa depois
            a = ["-itsoffset", str(atraso)] if atraso else []
            cmd("ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", f"color=c=gray:s=360x640:r=24:d={dur}", *a, "-f", "lavfi",
                "-i", f"sine=f=220:d={fala},apad=whole_dur={dur - atraso}", "-t", str(dur), "-map", "0:v", "-map", "1:a",
                "-c:v", "libx264", "-c:a", "aac", str(pasta / nome))
        cena("01.mp4", 2.0); cena("02.mp4", 3.0); cena("03.mp4", 1.5, atraso=0.2); cena("10.mp4", 1.0)
        cena("02-avatar.mp4", 4.0)  # original antes da troca de voz: NÃO pode entrar
        leg = {"01": [{"de": 0.0, "ate": 1.0, "texto": "Cê {pode}"}, {"de": 1.0, "ate": 2.0, "texto": "comer isso"}]}
        tabela, _ = montar(c, t / "s.mp4", leg, "GANCHO TESTE", "Comenta TESTE", y_gancho=830, y_cta=330)
        assert [x.split(":")[0] for x in tabela] == ["01", "02", "03", "10"], f"ordem ou cenas erradas: {tabela}"
        usados = json.loads((t / "s-cortes.json").read_text(encoding="utf-8"))
        assert list(usados) == ["01", "02", "03", "10"] and all(usados.values()), f"trechos usados gravados errado: {usados}"
        assert [b["texto"] for b in json.loads((t / "s-legendas.json").read_text(encoding="utf-8"))] == ["Cê {pode}", "comer isso"], \
            "a legenda no tempo do reel não foi gravada"
        tab2, _ = montar(c, t / "s2.mp4", cortes=usados)
        usa = lambda x: float(x.split("usa ")[1].split(" s")[0])
        assert all(abs(usa(a) - usa(b)) < 0.05 for a, b in zip(tab2, tabela)), f"os trechos gravados não refazem a montagem: {tab2} x {tabela}"
        usa3 = float(tabela[2].split("usa ")[1].split(" s")[0])
        assert abs(usa3 - (0.08 + 1.5 + 0.12)) < 0.12, f"cena com 0,2 s de silêncio antes da fala ficou com {usa3:.2f} s (esperado ~1,70)"
        esperado = 2.0 + 3.0 + 1.5 + 1.0 + 4 * 0.12 + 0.08
        d = duracao(t / "s.mp4")
        assert abs(d - esperado) < 0.4, f"esperava ~{esperado:.2f} s, saiu {d:.2f} s ({tabela})"
        r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries", "stream=width,height", "-of", "csv=p=0", str(t / "s.mp4")],
                           capture_output=True, text=True)
        assert r.stdout.strip() == "1080,1920", f"tamanho errado: {r.stdout.strip()}"
        som = len(subprocess.run(["ffmpeg", "-v", "error", "-i", str(t / "s.mp4"), "-vn", "-ac", "1", "-ar", "44100", "-f", "s16le", "-"],
                                 capture_output=True).stdout) / 2 / 44100
        assert abs(som - quadros(t / "s.mp4") / 30) < 0.08, "som e imagem descasaram"
        cmd("ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", "color=c=gray:s=360x640:r=24:d=6", "-f", "lavfi", "-i",
            "sine=f=220:d=1.5,apad=pad_dur=1.5[a];sine=f=220:d=1.5[b];[a][b]concat=n=2:v=0:a=1,apad=whole_dur=6", "-t", "6",
            "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-c:a", "aac", str(t / "pausa.mp4"))
        tr = trechos_da_fala(t / "pausa.mp4")
        assert len(tr) == 2 and abs(sum(b - a for a, b in tr) - (3.0 + 0.08 + 0.12 + 0.24)) < 0.15, f"pausa de 1,5 s no meio não encolheu: {tr}"
        assert abs(no_reel(3.2, tr) - (0.08 + 1.5 + 0.24 + 0.2)) < 0.15, f"legenda depois da pausa cairia fora do lugar: {no_reel(3.2, tr):.2f}"
        _, rapido = montar(c, t / "r.mp4", ritmo=1.1)
        assert abs(duracao(t / "r.mp4") - d / 1.1) < 0.2, f"ritmo 1.1 deu {duracao(t / 'r.mp4'):.2f} s (esperado {d / 1.1:.2f})"
        try:
            montar(c, t / "x.mp4", gancho="X", y_gancho=150); raise AssertionError("texto debaixo da barra do Instagram passou")
        except SystemExit:
            pass
        for ruim in ("Unha fraca que descasca", "a\nb\nc"):
            try:
                montar(c, t / "x.mp4", gancho=ruim, y_gancho=830); raise AssertionError(f"gancho '{ruim}' passou")
            except SystemExit:
                pass
        montar(c, t / "duas.mp4", gancho="Unha fraca\\nque descasca", cta="Comenta TESTE", y_gancho=830, y_cta=330)  # 2 linhas de propósito: passa
        blocos = [" ".join("Um litro de água com canela e mel no fim".split()[i] for i in b)
                  for b in em_blocos("Um litro de água com canela e mel no fim".split())]
        assert all(re.sub(r"[^\w]", "", b.split()[-1].lower()) not in LIGACAO for b in blocos), f"bloco termina em ligação: {blocos}"
        leg = montar_legendas(c, {"02": {"texto": "Toma um gole de manhã e outro de noite"},
                                  "01": {"palavras": [{"texto": "Cê", "de": 0.1, "ate": 0.3}, {"texto": "pode", "de": 0.3, "ate": 0.6}], "desloc": 0.12}})
        assert leg["01"] == [{"de": 0.22, "ate": 0.72, "texto": "Cê pode"}], leg["01"]
        assert leg["02"] and leg["02"][0]["de"] >= 0 and leg["02"][-1]["ate"] <= 3.1, f"legenda sem tempo saiu fora do som: {leg['02']}"
        try:
            montar_legendas(c, {"03": {"palavras": [{"texto": "Oi", "de": 0.1, "ate": 0.3}], "desloc": None}})
            raise AssertionError("cena sem desloc passou")
        except SystemExit:
            pass
        try:
            montar(c, t / "x.mp4", gancho="SEM POSICAO"); raise AssertionError("gancho sem posição escolhida passou")
        except SystemExit:
            pass
        assert (t / "s-textos.jpg").exists(), "a folha pra conferir os textos não foi gerada"
        im = t / "im"; im.mkdir()
        for n, cor in enumerate(("red", "green", "blue")):
            cmd("ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", f"color=c={cor}:s=360x640", "-frames:v", "1", str(im / f"{n + 1:02d}.png"))
        assert folha_de_rostos(im, im / "01.png", t / "rostos.jpg") == 3, "folha de rostos: contou errado"
        assert folha_de_rostos(c, im / "01.png", t / "rostos-cenas.jpg") == 5, "folha de rostos das cenas: contou errado"
        larg = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=width", "-of", "csv=p=0", str(t / "rostos.jpg")],
                              capture_output=True, text=True).stdout.strip()
        assert larg == str(4 * 360), f"folha de rostos com largura {larg} (esperado {4 * 360}: referência + 3)"
        montar(c, t / "limpo.mp4")
        assert quadro(t / "s.mp4", 0.5) != quadro(t / "limpo.mp4", 0.5), "gancho e legenda não foram desenhados"
        assert quadro(t / "s.mp4", d - 0.5) != quadro(t / "limpo.mp4", d - 0.5), "a palavra pra comentar não foi desenhada no fim"
        assert janela_do_meio([3.2, 6.4, 11.6], 16.8) == (6.4, 10.4), f"pedido do meio fora do 1º corte depois de 1/4: {janela_do_meio([3.2, 6.4, 11.6], 16.8)}"
        assert janela_do_meio([1.0, 15.0], 16.8) == (4.2, 8.2), "sem corte na faixa: o pedido do meio devia entrar em 1/4 do reel"
        assert janela_do_meio([2.0, 4.0], 8.0) is None, "reel de 8 s não comporta o pedido do meio"
        ev = sem_legenda_em([(5.0, 6.0, "L", "a", 1210), (6.2, 7.0, "L", "b", 1210), (10.2, 11.0, "L", "c", 1210), (0.0, 3.0, "G", "g", 830)], 6.4, 10.4)
        assert ev == [(5.0, 6.0, "L", "a", 1210), (10.4, 11.0, "L", "c", 1210), (0.0, 3.0, "G", "g", 830)], f"legenda debaixo do pedido do meio: {ev}"
        m = t / "m"; m.mkdir()
        for nome, fala in (("01.mp4", 3.0), ("02.mp4", 3.0), ("03.mp4", 5.0), ("04.mp4", 5.0)):
            cena(nome, fala, dur=6, pasta=m)
        leg_m = {"03": [{"de": 0.5, "ate": 1.5, "texto": "some no meio"}]}
        montar(m, t / "m.mp4", leg_m, "GANCHO TESTE", "Comenta TESTE", y_gancho=830, y_cta=330,
               cta_meio="Comenta TESTE\\nque eu te mando", y_cta_meio=1100)
        montar(m, t / "m0.mp4", leg_m, "GANCHO TESTE", "Comenta TESTE", y_gancho=830, y_cta=330)
        assert "some no meio" in [b["texto"] for b in json.loads((t / "m-legendas.json").read_text(encoding="utf-8"))], \
            "a legenda que o pedido do meio esconde sumiu do arquivo da legenda no tempo do reel"
        faixa = lambda q: q[95 * 108:126 * 108]  # linhas em volta de y=1100 (o quadro é 108x192)
        dif = lambda x, y: max(abs(i - j) for i, j in zip(faixa(x), faixa(y)))
        assert dif(quadro(t / "m.mp4", 8.4), quadro(t / "m0.mp4", 8.4)) > 60, "o pedido do meio não foi desenhado"
        assert dif(quadro(t / "m.mp4", 5.0), quadro(t / "m0.mp4", 5.0)) < 30, "o pedido do meio entrou antes do 1º corte depois de 1/4"
        alt = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=height", "-of", "csv=p=0", str(t / "m-textos.jpg")],
                             capture_output=True, text=True).stdout.strip()
        assert alt == str(3 * 480), f"a folha dos textos com o pedido do meio devia ter 3 fileiras (altura {alt})"
        try:
            montar(m, t / "x.mp4", cta_meio="Comenta TESTE"); raise AssertionError("pedido do meio sem posição escolhida passou")
        except SystemExit:
            pass
    print(f"teste ok: cenas 01, 02, 03 e 10 em ordem, 02-avatar.mp4 fora; silêncio do começo cortado ({usa3:.2f} s); pausa de 1,5 s "
          f"encolhida; ritmo 1.1 ok; texto na área coberta pelo Instagram é recusado; gancho de 25 letras e de 3 linhas recusados, "
          f"2 linhas de propósito passam; legenda sem bloco terminando em ligação; legenda por tempo de palavra (com desloc; sem ele, recusada) e "
          f"espalhada pelo som (sem tempo) ok; folha de rostos (referência + imagens, e das cenas) ok; "
          f"{d:.2f} s (esperado ~{esperado:.2f}), 1080x1920; legenda, gancho e palavra do fim desenhados; som e imagem do mesmo tamanho; "
          f"pedido do meio no 1º corte depois de 1/4, com a legenda escondida nele e a folha de 3 fileiras; trechos usados e legenda no tempo do reel gravados, e os trechos refazem a mesma montagem")


def main():
    if sys.argv[1:] == ["--teste"]:
        return teste()
    if sys.argv[1:2] == ["rostos"]:
        p = argparse.ArgumentParser(prog="montar.py rostos")
        p.add_argument("pasta"); p.add_argument("--ref", required=True); p.add_argument("--saida", required=True)
        a = p.parse_args(sys.argv[2:])
        n = folha_de_rostos(a.pasta, a.ref, a.saida)
        return print(f"OLHE {a.saida}: o 1º (com borda) é o rosto de referência; as outras {n} têm que ser a MESMA pessoa. "
                     "A que destoa é refeita antes de pagar o vídeo.")
    if sys.argv[1:2] == ["legendas"]:
        p = argparse.ArgumentParser(prog="montar.py legendas")
        p.add_argument("pasta"); p.add_argument("falas"); p.add_argument("--saida", required=True)
        a = p.parse_args(sys.argv[2:])
        leg = montar_legendas(a.pasta, json.loads(pathlib.Path(a.falas).read_text(encoding="utf-8")))
        pathlib.Path(a.saida).write_text(json.dumps(leg, ensure_ascii=False, indent=1), encoding="utf-8")
        return print(f"pronto: {a.saida} ({sum(len(v) for v in leg.values())} blocos de legenda)")
    p = argparse.ArgumentParser()
    p.add_argument("pasta"); p.add_argument("--saida", required=True); p.add_argument("--legendas"); p.add_argument("--cortes")
    p.add_argument("--gancho", default=""); p.add_argument("--cta", default=""); p.add_argument("--rabo", type=float, default=0.12)
    p.add_argument("--cabeca", type=float, default=0.08); p.add_argument("--pausa-max", type=float, default=0.40)
    p.add_argument("--ritmo", type=float, default=1.0, help="1.0 a 1.15: acelera som e imagem juntos, sem mudar o tom")
    p.add_argument("--gancho-y", type=int); p.add_argument("--cta-y", type=int)
    p.add_argument("--cta-meio", default="", help="pedido do meio, ex.: 'Comenta PLANTA\\nque eu te mando' (um reel sim, um não)")
    p.add_argument("--cta-meio-y", type=int)
    p.add_argument("--legenda-y", type=int, default=Y_LEGENDA)
    p.add_argument("--estilo", choices=["amarelo", "caixa"], default="amarelo",
                   help="gancho e palavra pra comentar: amarelo com contorno (padrão) ou caixa branca com letra preta")
    a = p.parse_args()
    if not shutil.which("ffmpeg"):
        sys.exit("ffmpeg não encontrado: veja COMO-INSTALAR.md, passo 3")
    ler = lambda x: json.loads(pathlib.Path(x).read_text(encoding="utf-8")) if x else None
    tabela, total = montar(a.pasta, a.saida, ler(a.legendas), a.gancho, a.cta, ler(a.cortes), a.rabo, a.cabeca, a.pausa_max,
                           a.ritmo, a.gancho_y, a.cta_y, a.legenda_y, a.estilo, a.cta_meio, a.cta_meio_y)
    print("\n".join(tabela))
    print(f"pronto: {a.saida} ({total:.2f} s)")


if __name__ == "__main__":
    main()

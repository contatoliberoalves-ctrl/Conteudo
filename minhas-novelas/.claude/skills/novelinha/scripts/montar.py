#!/usr/bin/env python3
"""Junta os clipes da novelinha na ordem (01.mp4, 02.mp4...) com corte seco, deixa todos no mesmo volume (-15 LUFS),
põe um fundo de ruído bem baixo por baixo (o Persona Pro devolve silêncio digital entre as falas, que soa como buraco)
e fecha a parte do jeito dos virais (Regra 8 da skill):
  --fim continua (padrão, partes que continuam): "CONTINUA..." + "Comenta PARTE N" por cima do último 1 s da última cena
                 e o último quadro parado 1,2 s. Sem tela preta.
  --fim segue    (última parte da temporada): "ME SEGUE" por cima do fim, no mesmo jeito.
  --fim cartela  (o jeito antigo): tela preta com o --texto escrito letra a letra.
  --fim nenhum   só a parte.
Grava também <saida>-limpa.mp4, a parte sem o fim, que é a que entra no longo do YouTube (S/scripts/longo.py).
No fim confere os portões: volume -15 LUFS (±1,5) e nenhum buraco de silêncio (abaixo de -70 dB por 0,15 s ou mais).
Portão reprovado: o arquivo fica gravado, mas o script sai com erro (código 2) e diz o que falhou.

Uso: python3 montar.py <pasta-dos-clipes> --saida parte-1.mp4 [--cortes cortes.json] [--parte 1] [--idioma pt|es|en]
                      [--fim continua|segue|cartela|nenhum] [--texto "..."] [--arroba @perfil] [--segundos 1.5]
     python3 montar.py --teste
cortes.json (opcional) = os trechos que FICAM de cada clipe, em segundos: {"03": [[2.0, 2.9], [6.2, 9.5]], "07": [[2.0, 9.0]]}.
Clipe que não aparece no cortes.json entra inteiro. Use pra tirar plano parado sem fala e fala que o vídeo inventou.
--texto troca o texto do fim (uma linha por linha do texto; ex.: --texto "CONTINUA..." pra não pedir comentário).
Precisa de ffmpeg no PATH. Todos os clipes viram 1080x1920, 30 qps (pelo tempo: o take de 24 qps do Persona Pro não
adianta a boca), som 44,1 kHz antes de juntar.
"""
import argparse, json, pathlib, re, shutil, subprocess, sys, tempfile

ALVO_LUFS = -15.0       # portão da peça: -15 LUFS ±1,5 (ganho fixo por clipe, sem compressor que achata a fala)
TOLERANCIA_LUFS = 1.5
BURACO_DB, BURACO_S = -70, 0.15
CONGELA = 1.2           # último quadro parado depois da última fala, com o texto do fim por cima
TEXTO_ANTES = 1.0       # o texto do fim entra 1 s antes do fim da última cena
LARG, ALT, QPS = 1080, 1920, 30
FIM = {  # linha 1 (grande) e linha 2 (menor); {n} = número da próxima parte
    "continua": {"pt": ("CONTINUA...", "Comenta PARTE {n}"), "es": ("CONTINUARÁ...", "Comenta PARTE {n}"),
                 "en": ("TO BE CONTINUED...", "Comment PART {n}")},
    "segue": {"pt": ("ME SEGUE", "que tem mais novela"), "es": ("SÍGUEME", "que hay más novelas"),
              "en": ("FOLLOW ME", "for more dramas")},
    "cartela": {"pt": ("PARTE {n}?",), "es": ("PARTE {n}?",), "en": ("PART {n}?",)},
}
FONTES = ["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf",
          "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf", "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
          "/System/Library/Fonts/Supplemental/Arial Bold.ttf", "/Library/Fonts/Arial Bold.ttf", "C:/Windows/Fonts/arialbd.ttf"]


def cmd(*a, cwd=None):
    r = subprocess.run(a, capture_output=True, text=True, cwd=cwd)
    if r.returncode:
        sys.exit(f"ffmpeg falhou: {' '.join(map(str, a[:6]))}...\n{r.stderr[-800:]}")
    return r


def tem_audio(arquivo):
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a", "-show_entries", "stream=index", "-of", "csv=p=0", str(arquivo)],
                       capture_output=True, text=True)
    return bool(r.stdout.strip())


def duracao(arquivo):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(arquivo)],
                       capture_output=True, text=True)
    return float(r.stdout.strip())


def volume(arquivo):
    r = subprocess.run(["ffmpeg", "-nostats", "-i", str(arquivo), "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True)
    achou = re.findall(r"I:\s+(-?[\d.]+) LUFS", r.stderr)
    return float(achou[-1]) if achou else None


def buracos(arquivo):
    """trechos de silêncio digital (abaixo de -70 dB por 0,15 s ou mais): [(início, fim)]."""
    r = subprocess.run(["ffmpeg", "-nostats", "-i", str(arquivo), "-vn", "-af", f"silencedetect=n={BURACO_DB}dB:d={BURACO_S}", "-f", "null", "-"],
                       capture_output=True, text=True)
    ini = [float(x) for x in re.findall(r"silence_start: (-?[\d.]+)", r.stderr)]
    fim = [float(x) for x in re.findall(r"silence_end: (-?[\d.]+)", r.stderr)]
    return [(a, fim[i] if i < len(fim) else None) for i, a in enumerate(ini)]


def portoes(arquivo):
    """o que falhou nos portões da peça (lista vazia = passou)."""
    falhas, lufs = [], volume(arquivo)
    if lufs is None or abs(lufs - ALVO_LUFS) > TOLERANCIA_LUFS:
        falhas.append(f"volume {lufs} LUFS (alvo {ALVO_LUFS:.0f} ±{TOLERANCIA_LUFS})")
    for a, b in buracos(arquivo):
        falhas.append(f"buraco de silêncio em {a:.2f}-{b if b is None else round(b, 2)} s")
    return falhas


def quadros(arquivo):
    r = subprocess.run(["ffprobe", "-v", "error", "-count_frames", "-select_streams", "v", "-show_entries",
                        "stream=nb_read_frames", "-of", "csv=p=0", str(arquivo)], capture_output=True, text=True)
    return int(r.stdout.strip())


def normalizar(entrada, saida, trechos=None):
    """padroniza tamanho/qps/som, corta os trechos pedidos e iguala o volume."""
    if tem_audio(entrada):
        entradas, a_in = ["-i", str(entrada)], "[0:a]"
    else:  # clipe mudo: silêncio do mesmo tamanho, pra o concat não desalinhar o som
        entradas, a_in = ["-i", str(entrada), "-f", "lavfi", "-t", str(duracao(entrada)), "-i", "anullsrc=r=44100:cl=stereo"], "[1:a]"
    trechos = trechos or [[0, duracao(entrada)]]
    f = []
    for i, (ini, fim) in enumerate(trechos):
        d = fim - ini
        f.append(f"[0:v]trim={ini}:{fim},setpts=PTS-STARTPTS[v{i}]")
        f.append(f"{a_in}atrim={ini}:{fim},asetpts=PTS-STARTPTS,afade=t=in:d=0.012,afade=t=out:st={max(d - 0.012, 0):.3f}:d=0.012[a{i}]")
    k = len(trechos)
    f.append("".join(f"[v{i}][a{i}]" for i in range(k)) + f"concat=n={k}:v=1:a=1[vc][ac]")
    f.append(f"[vc]scale={LARG}:{ALT}:force_original_aspect_ratio=decrease,pad={LARG}:{ALT}:(ow-iw)/2:(oh-ih)/2,fps={QPS},setsar=1[v]")
    # partes intermediárias em .mkv com som sem compressão (PCM): o AAC perde ~0,05 s no fim de cada arquivo e,
    # somado nas emendas, deixou o som 0,3 s adiantado da boca no fim do episódio de teste (06/11)
    meio = saida.with_name(saida.stem + "-c.mkv")
    cmd("ffmpeg", "-y", "-loglevel", "error", *entradas, "-filter_complex", ";".join(f), "-map", "[v]", "-map", "[ac]",
        "-c:v", "libx264", "-crf", "16", "-pix_fmt", "yuv420p", "-c:a", "pcm_s16le", "-ar", "44100", "-ac", "2", str(meio))
    lufs = volume(meio)
    ganho = 0.0 if lufs is None or lufs < -60 else ALVO_LUFS - lufs  # clipe mudo fica como está
    d = quadros(meio) / QPS  # som com o tamanho exato da imagem
    cmd("ffmpeg", "-y", "-loglevel", "error", "-i", str(meio), "-c:v", "copy",
        "-af", f"volume={ganho:.2f}dB,alimiter=limit=0.89:level=false,apad=whole_dur={d:.4f},atrim=0:{d:.4f}",
        "-c:a", "pcm_s16le", "-ar", "44100", "-ac", "2", str(saida))


def fonte(tmp):
    """copia uma fonte em negrito pra pasta temporária (caminho sem ':' no filtro, até no Windows). Sem fonte: None."""
    for f in FONTES:
        if pathlib.Path(f).is_file():
            shutil.copy(f, tmp / "fonte.ttf")
            return "fonte.ttf"
    return None


def drawtext(tmp, nome, texto, tam, y, extra=""):
    (tmp / nome).write_text(texto, encoding="utf-8")
    f = fonte(tmp)
    return (f"drawtext={'fontfile=' + f + ':' if f else ''}textfile={nome}:expansion=none:fontcolor=white:fontsize={tam}:borderw=8:bordercolor=black"
            f":x=(w-text_w)/2:y={y}{extra}")


def tamanho(texto, maximo):
    return min(maximo, int(0.9 * LARG / (0.62 * max(len(texto), 1))))  # fonte em negrito ~0,62 da altura por letra


def cartela(tmp, saida, texto, segundos):
    """tela preta com o texto aparecendo letra a letra (0,1 s por letra) e parado até o fim (o jeito antigo)."""
    passos = []
    for k in range(1, len(texto) + 1):
        ini, fim = 0.1 * (k - 1), (0.1 * k if k < len(texto) else segundos)
        passos.append(drawtext(tmp, f"c{k}.txt", texto[:k], tamanho(texto, 108), "(h-text_h)/2", f":enable='between(t,{ini:.2f},{fim:.2f})'"))
    cmd("ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", f"color=c=black:s={LARG}x{ALT}:r={QPS}:d={segundos}",
        "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo", "-t", str(segundos), "-vf", ",".join(passos),
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "pcm_s16le", "-ar", "44100", "-ac", "2", str(saida.name), cwd=tmp)


def acabar(tmp, entrada, saida, linhas=(), arroba=None):
    """entrada (mkv) -> mp4 final: congela o último quadro e escreve o fim por cima (se houver linhas), @ no canto,
    fundo de ruído rosa bem baixo (~ -60 dB) o vídeo todo e limitador."""
    d = quadros(entrada) / QPS
    total = d + (CONGELA if linhas else 0)
    vf = [f"tpad=stop_mode=clone:stop_duration={CONGELA}"] if linhas else []
    quando = f":enable='gte(t,{max(d - TEXTO_ANTES, 0):.3f})'"
    for i, l in enumerate(linhas):
        grande = i == 0
        vf.append(drawtext(tmp, f"fim{i}.txt", l, tamanho(l, 110 if grande else 76), f"h*0.60+{0 if grande else 150}", quando))
    if arroba:
        vf.append(drawtext(tmp, "arroba.txt", arroba, 34, "110", "").replace("fontcolor=white", "fontcolor=white@0.55")
                  .replace(":x=(w-text_w)/2", ":x=w-text_w-40").replace("borderw=8", "borderw=2"))
    fc = (f"[0:v]{','.join(vf) or 'null'}[v];"
          f"[0:a]apad=whole_dur={total:.4f},atrim=0:{total:.4f},aformat=sample_rates=44100:channel_layouts=stereo[a0];"
          f"[1:a]aformat=sample_rates=44100:channel_layouts=stereo[n];"
          f"[a0][n]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.89:level=false[a]")
    cmd("ffmpeg", "-y", "-loglevel", "error", "-i", str(entrada), "-f", "lavfi", "-t", f"{total:.4f}", "-i",
        "anoisesrc=color=pink:sample_rate=44100:amplitude=0.003:seed=7", "-filter_complex", fc, "-map", "[v]", "-map", "[a]",
        "-t", f"{total:.4f}", "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-r", str(QPS),
        "-c:a", "aac", "-b:a", "192k", "-ar", "44100", "-ac", "2", "-movflags", "+faststart", str(pathlib.Path(saida).resolve()), cwd=tmp)


def textos_do_fim(fim, idioma, parte, texto=None):
    if fim == "nenhum":
        return ()
    if texto:
        return tuple(l for l in texto.replace("\\n", "\n").splitlines() if l.strip())
    return tuple(l.format(n=parte + 1) for l in FIM[fim][idioma])


def montar(pasta, saida, cortes=None, fim="continua", parte=1, idioma="pt", texto=None, arroba=None, segundos=1.5):
    saida = pathlib.Path(saida).resolve()
    limpa = saida.with_name(saida.stem + "-limpa.mp4")
    # nunca junta a própria saída de uma montagem anterior (saída gravada dentro da pasta dos clipes)
    clipes = sorted(c for c in pathlib.Path(pasta).glob("*.mp4")
                    if c.resolve() not in (saida, limpa) and not c.stem.endswith("-limpa"))
    if not clipes:
        sys.exit(f"nenhum .mp4 em {pasta}")
    cortes, linhas = cortes or {}, textos_do_fim(fim, idioma, parte, texto)
    with tempfile.TemporaryDirectory() as tmp:
        tmp = pathlib.Path(tmp); partes = []
        for i, c in enumerate(clipes):
            n = tmp / f"{i:02d}.mkv"; normalizar(c, n, cortes.get(c.stem)); partes.append(n)

        def juntar(lista, destino):
            entradas = [x for p in lista for x in ("-i", str(p))]
            fc = "".join(f"[{i}:v][{i}:a]" for i in range(len(lista))) + f"concat=n={len(lista)}:v=1:a=1[v][a]"
            cmd("ffmpeg", "-y", "-loglevel", "error", *entradas, "-filter_complex", fc, "-map", "[v]", "-map", "[a]",
                "-c:v", "libx264", "-crf", "16", "-pix_fmt", "yuv420p", "-c:a", "pcm_s16le", "-ar", "44100", "-ac", "2", str(destino))

        corpo = tmp / "corpo.mkv"; juntar(partes, corpo)
        acabar(tmp, corpo, limpa, (), arroba)
        if fim == "cartela":
            c = tmp / "fim.mkv"; cartela(tmp, c, " ".join(linhas).replace("'", ""), segundos)
            comfim = tmp / "comfim.mkv"; juntar([corpo, c], comfim)
            acabar(tmp, comfim, saida, (), arroba)
        else:
            acabar(tmp, corpo, saida, linhas, arroba)
    return len(clipes), linhas, limpa


def teste():
    with tempfile.TemporaryDirectory() as t:
        t = pathlib.Path(t); (t / "c").mkdir()
        for nome, dur in (("01", 4), ("02", 5), ("03", 5), ("04", 5)):  # 24 qps, como o take do Persona Pro
            cmd("ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", f"color=c=gray:s=320x568:r=24:d={dur}", "-f", "lavfi",
                "-i", f"sine=f=220:d={dur}", "-shortest", "-c:v", "libx264", "-c:a", "aac", str(t / "c" / f"{nome}.mp4"))
        cortes = {k: [[0, 1.5], [3, 4.5]] for k in ("02", "03", "04")}
        _, linhas, limpa = montar(t / "c", t / "s.mp4", cortes, "continua", 1, "pt")
        assert linhas == ("CONTINUA...", "Comenta PARTE 2"), linhas
        d, dl = duracao(t / "s.mp4"), duracao(limpa)
        assert abs(dl - 13) < 0.2, f"limpa: esperava 13 s, saiu {dl:.2f} s"
        assert abs(d - (13 + CONGELA)) < 0.2, f"esperava {13 + CONGELA} s, saiu {d:.2f} s"
        som = len(subprocess.run(["ffmpeg", "-v", "error", "-i", str(t / "s.mp4"), "-vn", "-ac", "1", "-ar", "44100", "-f", "s16le", "-"],
                                 capture_output=True).stdout) / 2 / 44100
        img = quadros(t / "s.mp4") / QPS
        assert abs(som - img) < 0.05, f"som {som:.3f} s e imagem {img:.3f} s descasaram"
        w, h = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries", "stream=width,height", "-of", "csv=p=0",
                               str(t / "s.mp4")], capture_output=True, text=True).stdout.strip().split(",")
        assert (int(w), int(h)) == (LARG, ALT), (w, h)

        def quadro(arq, seg):
            return subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{seg}", "-i", str(arq), "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "gray", "-"],
                                  capture_output=True).stdout
        assert quadro(t / "s.mp4", 13.8) != quadro(limpa, 12.9), "o texto do fim não apareceu no último quadro"
        falhas = portoes(t / "s.mp4")
        assert not falhas, f"portões: {falhas}"
        shutil.copy(t / "s.mp4", t / "c" / "parte-1.mp4"); shutil.copy(limpa, t / "c" / "parte-1-limpa.mp4")  # saída velha na pasta
        n, _, _ = montar(t / "c", t / "c" / "parte-1.mp4", cortes, "continua", 1, "pt", "CONTINUA... 100%")
        assert n == 4, f"juntou {n} clipes: entrou a saída velha"
        for velho in ("parte-1.mp4", "parte-1-limpa.mp4"):
            (t / "c" / velho).unlink()
        _, l2, _ = montar(t / "c", t / "u.mp4", cortes, "cartela", 2, "en")
        assert l2 == ("PART 3?",) and abs(duracao(t / "u.mp4") - 14.5) < 0.2, (l2, duracao(t / "u.mp4"))
        lufs = volume(t / "s.mp4")
    print(f"teste ok: 13 s de clipes (1 inteiro + 2 trechos de 3) + 1,2 s de fim por cima = 14,2 s em 1080x1920, som e imagem do mesmo "
          f"tamanho, texto do fim na tela, {lufs} LUFS e sem buraco; limpa de 13 s; cartela antiga ok")


def main(argv=None):
    if argv is None and sys.argv[1:] == ["--teste"]:
        if not shutil.which("ffmpeg"):
            sys.exit("ffmpeg não encontrado: veja COMO-INSTALAR.md, passo 3")
        return teste()
    p = argparse.ArgumentParser()
    p.add_argument("pasta"); p.add_argument("--saida", required=True); p.add_argument("--cortes")
    p.add_argument("--parte", type=int, default=1); p.add_argument("--idioma", choices=("pt", "es", "en"), default="pt")
    p.add_argument("--fim", choices=("continua", "segue", "cartela", "nenhum"), default="continua")
    p.add_argument("--texto"); p.add_argument("--arroba"); p.add_argument("--segundos", type=float, default=1.5)
    a = p.parse_args(argv)
    if not shutil.which("ffmpeg"):
        sys.exit("ffmpeg não encontrado: veja COMO-INSTALAR.md, passo 3")
    cortes = json.loads(pathlib.Path(a.cortes).read_text()) if a.cortes else None
    n, linhas, limpa = montar(a.pasta, a.saida, cortes, a.fim, a.parte, a.idioma, a.texto, a.arroba, a.segundos)
    print(f"pronto: {a.saida} ({n} clipes, fim: {' / '.join(linhas) or 'nenhum'}) e {limpa} (sem o fim, pro longo do YouTube)")
    falhas = portoes(a.saida)
    if falhas:
        print("PORTÃO REPROVADO: " + "; ".join(falhas))
        sys.exit(2)
    print(f"portões ok: {volume(a.saida)} LUFS, sem buraco de silêncio")


if __name__ == "__main__":
    main()

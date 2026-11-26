#!/usr/bin/env python3
"""Monta o longo do YouTube de uma série fechada (S/references/metodo-atual.md §Longo do YouTube).
Junta as partes limpas (o <parte>-limpa.mp4 que o montar.py grava, sem o fim do Instagram) num vídeo 16:9 de 1920x1080:
cada parte em pé no meio da tela, com o próprio vídeo desfocado e escurecido dos lados (nunca sobre uma foto parada).
Sem cartela entre as partes. Fecha com 6 s pedindo "Comenta PARTE 2" e inscrição (ou com a sua imagem, --cartao).
Imprime os capítulos pra colar na descrição e confere os portões (-15 LUFS ±1,5, sem buraco de silêncio).

Uso: python3 longo.py parte-1-limpa.mp4 parte-2-limpa.mp4 parte-3-limpa.mp4 --saida longo.mp4 [--idioma pt|es|en]
                      [--cartao cartao.png] [--capitulos "Começo|A virada|O final"]
     python3 longo.py --teste
Precisa de ffmpeg no PATH. Leva uns minutos por parte: é render de vídeo inteiro.
"""
import argparse, pathlib, shutil, subprocess, sys, tempfile

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from montar import cmd, duracao, fonte, portoes, volume, ALVO_LUFS  # noqa: E402

L, A, QPS, CARTAO_S = 1920, 1080, 30, 6.0
FIM = {"pt": ("Quer a PARTE 2?", "Comenta PARTE 2 e se inscreve no canal"),
       "es": ("¿Quieres la PARTE 2?", "Comenta PARTE 2 y suscríbete al canal"),
       "en": ("Want PART 2?", "Comment PART 2 and subscribe")}
CAP = {"pt": "Parte", "es": "Parte", "en": "Part"}


def tempo(s):
    s = int(round(s)); return f"{s // 3600}:{s // 60 % 60:02d}:{s % 60:02d}" if s >= 3600 else f"{s // 60}:{s % 60:02d}"


def deitar(entrada, saida):
    """parte em pé -> 1920x1080 com ela mesma desfocada atrás; som no volume da peça."""
    fc = (f"[0:v]fps={QPS},split[a][b];"
          f"[a]scale={L}:{A}:force_original_aspect_ratio=increase,crop={L}:{A},boxblur=40:2,eq=brightness=-0.12:saturation=0.8[fundo];"
          f"[b]scale=-2:{A}[frente];[fundo][frente]overlay=(W-w)/2:0,setsar=1[v];"
          f"[0:a]aformat=sample_rates=44100:channel_layouts=stereo[a0]")
    cmd("ffmpeg", "-y", "-loglevel", "error", "-i", str(entrada), "-filter_complex", fc, "-map", "[v]", "-map", "[a0]",
        "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-c:a", "pcm_s16le", "-ar", "44100", "-ac", "2", str(saida))


def cartao(tmp, saida, idioma, imagem=None):
    if imagem:
        entrada = ["-loop", "1", "-t", str(CARTAO_S), "-i", str(pathlib.Path(imagem).resolve())]
        vf = f"scale={L}:{A}:force_original_aspect_ratio=decrease,pad={L}:{A}:(ow-iw)/2:(oh-ih)/2:color=0x101010,fps={QPS},setsar=1"
    else:
        entrada = ["-f", "lavfi", "-i", f"color=c=0x101010:s={L}x{A}:r={QPS}:d={CARTAO_S}"]
        f = fonte(tmp); ff = f"fontfile={f}:" if f else ""
        partes = []
        for i, (texto, tam, y) in enumerate(zip(FIM[idioma], (120, 64), ("h*0.36", "h*0.58"))):
            (tmp / f"cart{i}.txt").write_text(texto, encoding="utf-8")
            partes.append(f"drawtext={ff}textfile=cart{i}.txt:fontcolor={'white' if i == 0 else '0xffd23f'}:fontsize={tam}"
                          f":expansion=none:x=(w-text_w)/2:y={y}:enable='gte(t,{0.3 * i:.1f})'")
        vf = ",".join(partes) + ",setsar=1"
    cmd("ffmpeg", "-y", "-loglevel", "error", *entrada, "-f", "lavfi", "-t", str(CARTAO_S), "-i", "anullsrc=r=44100:cl=stereo",
        "-vf", vf, "-t", str(CARTAO_S), "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p",
        "-c:a", "pcm_s16le", "-ar", "44100", "-ac", "2", str(saida.name), cwd=tmp)


def longo(partes, saida, idioma="pt", imagem=None, nomes=None):
    saida = pathlib.Path(saida).resolve()
    with tempfile.TemporaryDirectory() as tmp:
        tmp = pathlib.Path(tmp); deitadas, capitulos, t = [], [], 0.0
        for i, p in enumerate(partes):
            d = tmp / f"p{i}.mkv"; deitar(p, d); deitadas.append(d)
            capitulos.append((t, (nomes[i] if nomes and i < len(nomes) else f"{CAP[idioma]} {i + 1}"))); t += duracao(d)
        c = tmp / "cartao.mkv"; cartao(tmp, c, idioma, imagem); deitadas.append(c)
        entradas = [x for p in deitadas for x in ("-i", str(p))]
        n = len(deitadas)
        fc = ("".join(f"[{i}:v][{i}:a]" for i in range(n)) + f"concat=n={n}:v=1:a=1[v][ac];"
              f"[{n}:a]aformat=sample_rates=44100:channel_layouts=stereo[ru];"
              f"[ac][ru]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.89:level=false[a]")
        total = t + CARTAO_S
        cmd("ffmpeg", "-y", "-loglevel", "error", *entradas, "-f", "lavfi", "-t", f"{total:.3f}", "-i",
            "anoisesrc=color=pink:sample_rate=44100:amplitude=0.003:seed=7", "-filter_complex", fc, "-map", "[v]", "-map", "[a]",
            "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-r", str(QPS), "-c:a", "aac", "-b:a", "192k",
            "-movflags", "+faststart", str(saida))
    capitulos[0] = (0.0, capitulos[0][1])  # o YouTube exige o 1º capítulo em 0:00
    return capitulos, total


def teste():
    with tempfile.TemporaryDirectory() as t:
        t = pathlib.Path(t); ps = []
        for i, cor in enumerate(("red", "blue")):
            p = t / f"p{i}.mp4"
            cmd("ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", f"color=c={cor}:s=1080x1920:r=30:d=3", "-f", "lavfi",
                "-i", "sine=f=330:d=3", "-af", "volume=-12dB", "-shortest", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", str(p))
            ps.append(p)
        caps, total = longo(ps, t / "l.mp4", "pt")
        d = duracao(t / "l.mp4")
        assert abs(d - 12) < 0.25, f"esperava 12 s (3 + 3 + 6 de cartão), saiu {d:.2f}"
        wh = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries", "stream=width,height", "-of", "csv=p=0",
                             str(t / "l.mp4")], capture_output=True, text=True).stdout.strip()
        assert wh == f"{L},{A}", wh
        assert [c[1] for c in caps] == ["Parte 1", "Parte 2"] and caps[0][0] == 0 and abs(caps[1][0] - 3) < 0.1, caps
        falhas = [f for f in portoes(t / "l.mp4") if "volume" not in f]  # tom de teste não tem o volume de fala
        assert not falhas, falhas
    print(f"teste ok: 2 partes de 3 s deitadas em {L}x{A} + 6 s de cartão = {d:.1f} s, capítulos 0:00 e 0:03, sem buraco de silêncio")


def main():
    if sys.argv[1:] == ["--teste"]:
        if not shutil.which("ffmpeg"):
            sys.exit("ffmpeg não encontrado: veja COMO-INSTALAR.md, passo 3")
        return teste()
    p = argparse.ArgumentParser()
    p.add_argument("partes", nargs="+"); p.add_argument("--saida", required=True)
    p.add_argument("--idioma", choices=("pt", "es", "en"), default="pt"); p.add_argument("--cartao")
    p.add_argument("--capitulos", help='nomes dos capítulos separados por "|" (padrão: Parte 1, Parte 2...)')
    a = p.parse_args()
    if not shutil.which("ffmpeg"):
        sys.exit("ffmpeg não encontrado: veja COMO-INSTALAR.md, passo 3")
    caps, total = longo(a.partes, a.saida, a.idioma, a.cartao, a.capitulos.split("|") if a.capitulos else None)
    print(f"pronto: {a.saida} ({tempo(total)})\ncapítulos pra descrição:")
    for s, nome in caps:
        print(f"{tempo(s)} {nome}")
    durs = [b - a for (a, _), (b, _) in zip(caps, caps[1:] + [(total - CARTAO_S, "")])]
    if len(caps) < 3 or min(durs) < 10:
        print("aviso: o YouTube só mostra capítulos com 3 ou mais, cada um de 10 s ou mais; sem isso, não cole os tempos")
    falhas = portoes(a.saida)
    if falhas:
        print("PORTÃO REPROVADO: " + "; ".join(falhas)); sys.exit(2)
    print(f"portões ok: {volume(a.saida)} LUFS (alvo {ALVO_LUFS:.0f}), sem buraco de silêncio")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""conferir_fala.py: a fala que o Persona Pro devolveu está inteira?

Uso: python3 conferir_fala.py <audio-enviado.mp3> <video-devolvido.mp4> [--minimo 0.85]
     python3 conferir_fala.py --teste

Mede os segundos com voz nos dois arquivos (ffmpeg silencedetect). Se o vídeo tem menos de
85% da voz do áudio enviado, o modelo comeu fala: sai com código 1 e manda refazer o pedaço.
Também diz onde a voz começa e termina no vídeo, pra pôr no cortes.json.
Precisa de ffmpeg no PATH. Sem biblioteca de fora.
"""
import re
import subprocess
import sys

LIMIAR = "-35dB"  # abaixo disso é silêncio; a chuva de fundo dos clipes fica por volta de -50 dB


def trechos_com_voz(arquivo):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", arquivo, "-vn", "-af",
                        f"silencedetect=noise={LIMIAR}:d=0.15", "-f", "null", "-"],
                       capture_output=True, text=True)
    m = re.search(r"Duration: (\d+):(\d+):([\d.]+)", r.stderr)
    if not m:
        sys.exit(f"não consegui ler {arquivo}")
    total = int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))
    ini = [float(x) for x in re.findall(r"silence_start: (-?[\d.]+)", r.stderr)]
    fim = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", r.stderr)]
    fim += [total] * (len(ini) - len(fim))  # silêncio que vai até o fim do arquivo
    voz, t = [], 0.0
    for a, b in zip(ini, fim):
        if a - t > 0.05:
            voz.append((max(t, 0.0), a))
        t = b
    if total - t > 0.05:
        voz.append((t, total))
    return voz


def conferir(audio, video, minimo=0.85):
    va, vv = trechos_com_voz(audio), trechos_com_voz(video)
    sa, sv = sum(b - a for a, b in va), sum(b - a for a, b in vv)
    razao = sv / sa if sa else 0.0
    ok = razao >= minimo
    print(f"voz enviada {sa:.2f} s · voz devolvida {sv:.2f} s · {razao:.0%} · {'OK' if ok else 'PERDEU FALA: refaça o pedaço'}")
    if vv:
        print(f"no vídeo a voz vai de {vv[0][0]:.2f} s a {vv[-1][1]:.2f} s (corte: {max(0, vv[0][0] - 0.2):.2f} a {vv[-1][1] + 0.3:.2f})")
    return ok


def teste():
    """tom de 3 s inteiro passa; o mesmo tom com o 1º segundo mudo reprova."""
    import os
    import tempfile
    with tempfile.TemporaryDirectory() as d:
        a, b = os.path.join(d, "a.wav"), os.path.join(d, "b.wav")
        base = ["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", "sine=frequency=220:duration=3"]
        subprocess.run(base + [a], check=True)
        subprocess.run(base + ["-af", "volume=enable='lt(t,1.5)':volume=0", b], check=True)
        assert conferir(a, a) is True
        assert conferir(a, b) is False
    print("teste ok")


if __name__ == "__main__":
    if "--teste" in sys.argv:
        teste()
    elif len(sys.argv) >= 3:
        m = float(sys.argv[sys.argv.index("--minimo") + 1]) if "--minimo" in sys.argv else 0.85
        sys.exit(0 if conferir(sys.argv[1], sys.argv[2], m) else 1)
    else:
        sys.exit(__doc__)

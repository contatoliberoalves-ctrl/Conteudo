"""Autoavaliação barata: uma folha de contato (quadros nos cortes + começo/fim)
com a onda do áudio embaixo, e a medição de loudness. Uma imagem por checagem
em vez de assistir o vídeo: o Claude olha o JPG e lê os números."""
import json
import re
import subprocess
import tempfile
from pathlib import Path

from .comum import ler_json, rodar, sonda, tempo


def quadro(video, t, destino, largura):
    rodar(["ffmpeg", "-y", "-v", "error", "-ss", f"{max(t, 0):.3f}", "-i", video, "-frames:v", "1",
           "-vf", f"scale={largura}:-2", destino])


def folha(video, tempos, saida, colunas=6, largura=300):
    from PIL import Image, ImageDraw, ImageFont
    info = sonda(video)
    with tempfile.TemporaryDirectory() as tmp:
        ims = []
        for i, t in enumerate(tempos):
            p = Path(tmp) / f"{i}.jpg"
            quadro(video, min(t, info["duracao"] - 0.05), p, largura)
            ims.append((t, Image.open(p).convert("RGB")))
        wav = Path(tmp) / "onda.png"
        lw = colunas * largura
        rodar(["ffmpeg", "-y", "-v", "error", "-i", video, "-filter_complex",
               f"aformat=channel_layouts=mono,showwavespic=s={lw}x120:colors=#4fd18b", "-frames:v", "1", wav])
        onda = Image.open(wav).convert("RGB")
        h = ims[0][1].height
        linhas = (len(ims) + colunas - 1) // colunas
        out = Image.new("RGB", (lw, linhas * (h + 22) + 140), (18, 18, 18))
        d = ImageDraw.Draw(out)
        try:
            f = ImageFont.truetype("DejaVuSans-Bold.ttf", 15)
        except OSError:
            f = ImageFont.load_default()
        for i, (t, im) in enumerate(ims):
            x, y = (i % colunas) * largura, (i // colunas) * (h + 22)
            out.paste(im, (x, y + 22))
            d.text((x + 6, y + 3), f"{i + 1}. {tempo(t)}", fill=(240, 240, 240), font=f)
        y0 = linhas * (h + 22) + 10
        out.paste(onda, (0, y0))
        for t in tempos:
            xx = int(t / info["duracao"] * lw)
            d.line([(xx, y0), (xx, y0 + 120)], fill=(255, 80, 80), width=1)
        out.save(saida, quality=82)
    return saida


def loudness(video):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(video), "-af", "ebur128=peak=true",
                        "-f", "null", "-"], capture_output=True, text=True).stderr
    resumo = r[r.rfind("Summary:"):]
    I = re.search(r"I:\s+(-?[\d.]+) LUFS", resumo)
    tp = re.search(r"Peak:\s+(-?[\d.]+) dBFS", resumo)
    lra = re.search(r"LRA:\s+(-?[\d.]+) LU", resumo)
    return {"lufs": float(I.group(1)) if I else None, "pico_dbtp": float(tp.group(1)) if tp else None,
            "lra": float(lra.group(1)) if lra else None}


def main(args):
    video = Path(args.video).resolve()
    info = sonda(video)
    tempos = []
    if args.em:
        tempos = [float(x) for x in args.em.split(",")]
    else:
        edl_p = Path(args.edl) if args.edl else video.parent / "edl.json"
        cortes = []
        if edl_p.exists():
            acc = 0.0
            for r in ler_json(edl_p)["trechos"][:-1]:
                acc += r["fim"] - r["inicio"]
                cortes.append(acc)
        if len(cortes) > args.max - 2:     # amostra espalhada se houver muitos cortes
            passo = len(cortes) / (args.max - 2)
            cortes = [cortes[int(i * passo)] for i in range(args.max - 2)]
        tempos = [0.3] + [c + 0.08 for c in cortes] + [info["duracao"] - 0.3]
    (video.parent / "verificar").mkdir(exist_ok=True)
    saida = video.parent / "verificar" / f"{video.stem}.jpg"
    folha(str(video), tempos, saida, colunas=6 if info["altura"] <= info["largura"] else 8,
          largura=300 if info["altura"] <= info["largura"] else 200)
    print(f"✓ folha: {saida}")
    print("áudio:", json.dumps(loudness(video)), "(alvo -14 LUFS, pico ≤ -1)")
    print(f"vídeo: {info['duracao']:.1f}s {info['largura']}x{info['altura']} {info['fps']}fps")

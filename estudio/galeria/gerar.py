#!/usr/bin/env python3
"""Gera a galeria do estúdio (estudio/galeria/dist/): página + vídeos de amostra + capas.

Amostras em estudio/galeria/amostras/<id>.mp4 (fora do git; numa sessão nova,
baixe as publicadas com Artifact read path=videos/<id>.mp4). Imprime o `files`
para publicar.
"""
import json
import shutil
import subprocess
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI.parent))
from ev.comum import sonda  # noqa: E402

DIST = AQUI / "dist"
AMOSTRAS = AQUI / "amostras"


def main():
    (DIST / "videos").mkdir(parents=True, exist_ok=True)
    modelos = json.loads((AQUI / "modelos.json").read_text())
    arquivos = {}
    saida = []
    for m in modelos:
        src = AMOSTRAS / m["video"]
        dst = DIST / "videos" / m["video"]
        if not src.exists() and not dst.exists():
            print(f"⚠ sem amostra para {m['id']} ({src}); fica de fora")
            continue
        if src.exists() and (not dst.exists() or src.stat().st_mtime > dst.stat().st_mtime):
            shutil.copy(src, dst)
        info = sonda(dst)
        poster = m["video"].replace(".mp4", ".jpg")
        if not (DIST / "videos" / poster).exists() or dst.stat().st_mtime > (DIST / "videos" / poster).stat().st_mtime:
            subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", f"{info['duracao'] * 0.4:.2f}", "-i", str(dst),
                            "-frames:v", "1", "-q:v", "4", str(DIST / "videos" / poster)], check=True)
        saida.append({**m, "poster": poster, "dur": round(info["duracao"], 1),
                      "res": f"{info['largura']}×{info['altura']}"})
        arquivos[f"videos/{m['video']}"] = str(dst)
        arquivos[f"videos/{poster}"] = str(DIST / "videos" / poster)
    # personagens do editor (PNG transparente por tipo+pose, feitos pela composição Retrato do motion)
    pers = sorted(f.stem for f in (DIST / "personagens").glob("*.png"))
    for f in pers:
        arquivos[f"personagens/{f}.png"] = str(DIST / "personagens" / f"{f}.png")
    html = ((AQUI / "template.html").read_text().replace("__MODELOS__", json.dumps(saida, ensure_ascii=False))
            .replace("__PERSONAGENS__", json.dumps(pers)))
    (DIST / "index.html").write_text(html)
    print(f"✓ {DIST / 'index.html'} ({len(saida)} modelos)")
    print(json.dumps({k: str(Path(v).relative_to(DIST)) for k, v in arquivos.items()}, ensure_ascii=False))


if __name__ == "__main__":
    main()

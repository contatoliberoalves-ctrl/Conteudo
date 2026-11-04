#!/usr/bin/env python3
"""Gera a galeria do estúdio (estudio/galeria/dist/): página + vídeos de amostra + capas.

Amostras em estudio/galeria/amostras/<id>.mp4 (fora do git; numa sessão nova,
baixe as publicadas com Artifact read path=videos/<id>.mp4). Imprime o `files`
para publicar.
"""
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI.parent))
from ev.comum import sonda  # noqa: E402

DIST = AQUI / "dist"
AMOSTRAS = AQUI / "amostras"


def palavras(video):
    """Transcrição palavra a palavra da amostra (cache ao lado), para a legenda editável do editor."""
    cache = AMOSTRAS / (Path(video).stem + ".palavras.json")
    if cache.exists():
        return json.loads(cache.read_text())
    try:
        from ev.explicativo import whisper_palavras
        ws = whisper_palavras(video)
    except Exception as e:  # sem whisper instalado: editor sem legenda pronta
        print(f"⚠ sem transcrição de {Path(video).name}: {e}")
        return []
    cache.write_text(json.dumps(ws, ensure_ascii=False))
    return ws


def kits():
    """Kit de cada perfil (fonte e cores da legenda) tirado de estudio/estilos/*.json."""
    out = {}
    for f in sorted((AQUI.parent / "estilos").glob("*.json")):
        d = json.loads(f.read_text())
        lg = d.get("legenda", {})
        if not lg.get("fonte"):
            continue
        out[f.stem] = {"fonte": lg["fonte"], "destaque": lg.get("destaque", "#FFD52E"), "cor": lg.get("cor", "#FFFFFF"),
                       "contorno": lg.get("contorno_cor", "#000000"), "caixa_alta": lg.get("caixa_alta", True),
                       "fundo": lg.get("fundo_caixa"), "descricao": d.get("descricao", "")[:90]}
    return out


def desenho():
    """Funções de desenho dos elementos (as mesmas do render no Remotion), sem os `export`."""
    js = (AQUI.parent / "motion" / "src" / "editor-desenho.js").read_text()
    return re.sub(r"^export ", "", js, flags=re.M)


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
        saida.append({**m, "poster": poster, "dur": round(info["duracao"], 1), "palavras": palavras(dst),
                      "res": f"{info['largura']}×{info['altura']}"})
        arquivos[f"videos/{m['video']}"] = str(dst)
        arquivos[f"videos/{poster}"] = str(DIST / "videos" / poster)
    # personagens do editor (PNG transparente por tipo+pose, feitos pela composição Retrato do motion)
    pers = sorted(f.stem for f in (DIST / "personagens").glob("*.png"))
    for f in pers:
        arquivos[f"personagens/{f}.png"] = str(DIST / "personagens" / f"{f}.png")
    html = ((AQUI / "template.html").read_text().replace("__MODELOS__", json.dumps(saida, ensure_ascii=False))
            .replace("__PERSONAGENS__", json.dumps(pers)).replace("__KITS__", json.dumps(kits(), ensure_ascii=False))
            .replace("__DESENHO__", desenho()))
    (DIST / "index.html").write_text(html)
    print(f"✓ {DIST / 'index.html'} ({len(saida)} modelos)")
    print(json.dumps({k: str(Path(v).relative_to(DIST)) for k, v in arquivos.items()}, ensure_ascii=False))


if __name__ == "__main__":
    main()

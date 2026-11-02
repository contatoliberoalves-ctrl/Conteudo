"""Mapa em blocos: história contada sobre o Brasil em blocos 3D, capítulo por capítulo.

  ev.py blocos roteiro.json [--rascunho]

{"formato": "reels", "serie": "Constituições do Brasil", "voz": "pt-BR-AntonioNeural",
 "capitulos": [
  {"data": "MAR 1824", "titulo": "O Império", "fala": "…", "linha": "texto curto da caixa (opcional: usa a fala)",
   "cor": "#7B4BB7", "cores_uf": {"SP": "#…"}, "origem": "Rio de Janeiro", "capital": "Rio de Janeiro",
   "rotulos": ["Rio de Janeiro", "Salvador", {"texto": "Assembleia dissolvida", "cidade": "Rio de Janeiro", "destaque": true}],
   "legenda": [["#7B4BB7", "Império do Brasil"]], "camera": "brasil" | "<cidade>" | {"x": 60, "y": 60, "zoom": 1.5},
   "fumaca": false}]}
"""
import json
from pathlib import Path

import numpy as np

from .comum import FORMATOS, ler_json, pasta_edit, sonda
from .motion import PROJETO
from .remotion_util import FPS, decodificar, fontes_public, mixar, narrar, render
from .sfx import Mix, cama, clique, pop, whoosh


def main(args):
    rot_path = Path(args.roteiro).resolve()
    rot = ler_json(rot_path)
    W, H = FORMATOS[args.formato or rot.get("formato", "reels")]
    edit = pasta_edit(rot_path)
    grade = json.loads((PROJETO / "public" / "geo" / "brasil-grade.json").read_text())
    cid = grade["cidades"]
    ufs = {u["sigla"]: (u["cx"], u["cy"]) for u in grade["ufs"]}

    def ponto(nome, padrao=(60, 52)):
        if isinstance(nome, (list, tuple)):
            return list(nome)
        return cid.get(nome) or list(ufs.get(nome, padrao))

    def cam(c):
        v = c.get("camera", "brasil")
        if isinstance(v, dict):
            return v
        if v == "brasil":
            return {"x": 62, "y": 54, "zoom": 1.25 if H > W else 1.0}
        x, y = ponto(v)
        return {"x": x, "y": y, "zoom": 2.1}

    caps = rot["capitulos"]
    falas = narrar([c["fala"] for c in caps], rot.get("voz", "pt-BR-AntonioNeural"), edit / "voz-blocos", rot.get("velocidade", "+5%"))
    t, out = 0, []
    for c, (mp3, ws, d) in zip(caps, falas):
        dur = int((d + 0.7) * FPS)
        rot_ = []
        for r in c.get("rotulos", []):
            if isinstance(r, str):
                x, y = ponto(r)
                rot_.append({"texto": r, "x": x, "y": y})
            else:
                x, y = ponto(r.get("cidade") or r.get("uf"))
                rot_.append({"texto": r["texto"], "x": x, "y": y, "destaque": r.get("destaque", False)})
        out.append({"inicio": t, "duracao": dur, "data": c["data"], "titulo": c["titulo"], "linha": c.get("linha", c["fala"]),
                    "palavras": [{"w": w["w"], "s": round(w["s"] * FPS) + 10, "e": round(w["e"] * FPS) + 10} for w in ws],
                    "cor": c["cor"], "coresUf": c.get("cores_uf"), "origem": ponto(c.get("origem", "Brasília")),
                    "capital": ponto(c["capital"]) if c.get("capital") else None, "rotulos": rot_,
                    "legenda": c.get("legenda", []), "camera": cam(c), "fumaca": c.get("fumaca", False), "_mp3": str(mp3)})
        t += dur
    total = t + 20
    fontes_public("Silkscreen-Bold.ttf", "VT323-Regular.ttf")
    props = {"largura": W, "altura": H, "fps": FPS, "total": total, "grade": {k: grade[k] for k in ("cols", "rows", "grid", "ufs")},
             "capitulos": [{k: v for k, v in c.items() if k != "_mp3"} for c in out], "serie": rot.get("serie", "")}
    video = render("Blocos", props, edit / f"blocos-video{'-rascunho' if args.rascunho else ''}.mp4", args.rascunho, edit)
    m = Mix(total / FPS)
    m.put(0, cama(total / FPS, 146.8), 0.08)
    for k, c in enumerate(out):
        t0 = c["inicio"] / FPS
        m.put(max(0, t0 - 0.05), whoosh(0.5, 300, 2200, np.random.default_rng(k)), 0.16)
        for j in range(4):
            m.put(t0 + j * 0.05, clique(), 0.12)
        for j, _ in enumerate(c["rotulos"]):
            m.put(t0 + (14 + j * 4) / FPS, pop(900 + 80 * j), 0.08)
        m.put(t0 + 10 / FPS, decodificar(c["_mp3"]), 0.95)
    saida = edit / (args.saida or f"blocos-{args.formato or rot.get('formato', 'reels')}{'-rascunho' if args.rascunho else ''}.mp4")
    mixar(video, m, saida)
    print(f"✓ {saida} ({sonda(saida)['duracao']:.1f}s, {len(out)} capítulos)")

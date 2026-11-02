"""Neon e vidro: promo escura estilo anúncio Apple + synthwave (15–45 s).

  ev.py neon roteiro.json [--rascunho]

{"formato": "reels", "voz": "pt-BR-AntonioNeural", "cores": {"a": "#7C5CFF", "b": "#FF3CAC", "c": "#FFC86B"},
 "cenas": [{"tipo": "titulo", "titulo": "Inscrições|abertas", "sub": "…", "fala": "…"},
           {"tipo": "cartao", "icone": "⚖️", "titulo": "…", "sub": "…", "fala": "…"},
           {"tipo": "numero", "numero": 6, "sufixo": "/6", "titulo": "…", "gatilho": "seis", "fala": "…"},
           {"tipo": "pilulas", "titulo": "…", "itens": [{"texto": "…", "gatilho": "…"}], "fala": "…"},
           {"tipo": "cta", "titulo": "…", "botao": "Inscreva-se", "sub": "…", "fala": "…"}]}
"""
from pathlib import Path

import numpy as np

from .comum import FORMATOS, ler_json, pasta_edit, sonda
from .explicativo import quando
from .remotion_util import FPS, decodificar, fontes_public, mixar, narrar, render
from .sfx import Mix, cama, impacto, pop, subida, whoosh

ATRASO = 6


def main(args):
    rot_path = Path(args.roteiro).resolve()
    rot = ler_json(rot_path)
    W, H = FORMATOS[args.formato or rot.get("formato", "reels")]
    edit = pasta_edit(rot_path)
    cenas = rot["cenas"]
    falas = narrar([c["fala"] for c in cenas], rot.get("voz", "pt-BR-AntonioNeural"), edit / "voz-neon", rot.get("velocidade", "+5%"))
    t, out = 0, []
    for c, (mp3, ws, d) in zip(cenas, falas):
        dur = int((d + (1.2 if c["tipo"] == "cta" else 0.45)) * FPS) + ATRASO
        q = {k: v for k, v in c.items() if k not in ("fala", "gatilho", "itens")}
        q.update(inicio=t, duracao=dur, _mp3=str(mp3))
        if c.get("itens"):
            q["itens"] = [{"texto": it["texto"], "t": ATRASO + round(quando(ws, it.get("gatilho") or it["texto"], 0.4 + 0.5 * k) * FPS)}
                          for k, it in enumerate(c["itens"])]
        if c.get("gatilho"):
            q["t"] = ATRASO + round(quando(ws, c["gatilho"], 0.3) * FPS)
        out.append(q)
        t += dur
    tit, corpo = rot.get("fonte_titulo", "ArchivoExpanded-Black.ttf"), rot.get("fonte_corpo", "Poppins-Bold.ttf")
    fontes_public(tit, corpo)
    props = {"largura": W, "altura": H, "fps": FPS, "total": t, "cores": rot.get("cores", {"a": "#7C5CFF", "b": "#FF3CAC", "c": "#FFC86B"}),
             "fontes": {"titulo": f"fonts/{tit}", "corpo": f"fonts/{corpo}"}, "cenas": [{k: v for k, v in q.items() if k != "_mp3"} for q in out]}
    video = render("Neon", props, edit / f"neon-video{'-rascunho' if args.rascunho else ''}.mp4", args.rascunho, edit)
    m = Mix(t / FPS)
    m.put(0, cama(t / FPS, 110.0), 0.11)
    m.put(0, subida(1.0), 0.15)
    for k, q in enumerate(out):
        t0 = q["inicio"] / FPS
        m.put(max(0, t0 - 0.08), whoosh(0.55, 250, 3200, np.random.default_rng(k)), 0.2)
        if q["tipo"] in ("titulo", "cta"):
            m.put(t0 + 0.05, impacto(0.6), 0.22)
        for it in q.get("itens", []):
            m.put(t0 + it["t"] / FPS, pop(1100), 0.1)
        m.put(t0 + ATRASO / FPS, decodificar(q["_mp3"]), 0.95)
    saida = edit / (args.saida or f"neon-{args.formato or rot.get('formato', 'reels')}{'-rascunho' if args.rascunho else ''}.mp4")
    mixar(video, m, saida)
    print(f"✓ {saida} ({sonda(saida)['duracao']:.1f}s, {len(out)} cenas)")

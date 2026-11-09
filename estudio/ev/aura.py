"""Aura: edit cinematográfico curto, no ritmo da batida, com personagem (padrão: o Líbero).

  ev.py aura roteiro.json [--rascunho]

{"formato": "reels", "bpm": 120, "cores": {"aura": "#3DFF8B", "fundo": "#04070A", "luz": "#9FE8FF"},
 "tomadas": [{"batidas": 4, "personagem": "libero", "pose": "bracos-cruzados", "expressao": "confiante", "angulo": "baixo"}],
 "letreiros": [{"batida": 8, "batidas": 2, "texto": "QUEM\\nGABARITA"}],
 "queda": 8}                                   # batida em que entra o grave
"""
from pathlib import Path

import numpy as np

from .comum import FORMATOS, ler_json, pasta_edit, sonda
from .remotion_util import FPS, fontes_public, mixar, render
from .sfx import SR, Mix, cama, impacto, subida, whoosh


def bumbo():
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    y = np.sin(2 * np.pi * (48 + 110 * np.exp(-t / 0.03)) * t) * np.exp(-t / 0.12)
    return y / np.abs(y).max()


def main(args):
    rot_path = Path(args.roteiro).resolve()
    rot = ler_json(rot_path)
    W, H = FORMATOS[args.formato or rot.get("formato", "reels")]
    edit = pasta_edit(rot_path)
    batida = round(FPS * 60 / rot.get("bpm", 120))
    t, tomadas = 0, []
    for tm in rot["tomadas"]:
        d = tm.get("batidas", 4) * batida
        tomadas.append({"inicio": t, "duracao": d, "personagem": tm.get("personagem", "libero"), "pose": tm.get("pose", "bracos-cruzados"),
                        "expressao": tm.get("expressao", "confiante"), "angulo": tm.get("angulo", "frente"), **({"cor": tm["cor"]} if tm.get("cor") else {})})
        t += d
    total = t + batida
    letreiros = [{"inicio": l["batida"] * batida, "duracao": l.get("batidas", 2) * batida, "texto": l["texto"], **({"tamanho": l["tamanho"]} if l.get("tamanho") else {}),
                  **({"cor": l["cor"]} if l.get("cor") else {})} for l in rot.get("letreiros", [])]
    tit = rot.get("fonte_titulo", "ArchivoExpanded-Black.ttf")
    fontes_public(tit)
    props = {"largura": W, "altura": H, "fps": FPS, "total": total, "batida": batida, "tomadas": tomadas, "letreiros": letreiros,
             "cores": rot.get("cores", {"aura": "#3DFF8B", "fundo": "#04070A", "luz": "#9FE8FF"}), "fontes": {"titulo": f"fonts/{tit}", "corpo": f"fonts/{tit}"}}
    video = render("Aura", props, edit / f"aura-video{'-rascunho' if args.rascunho else ''}.mp4", args.rascunho, edit)
    dur = total / FPS
    seg = batida / FPS
    queda = rot.get("queda", 8)
    m = Mix(dur)
    m.put(0, cama(dur, 55.0), 0.22)
    m.put(max(0, queda * seg - 2.0), subida(2.0), 0.35)
    k = 0
    while k * seg < dur - seg:
        if k >= queda:
            m.put(k * seg, bumbo(), 0.6 if k % 2 == 0 else 0.45)
        k += 1
    for i, tm in enumerate(tomadas):
        m.put(max(0, tm["inicio"] / FPS - 0.12), whoosh(0.35, 600, 3500, np.random.default_rng(i)), 0.22)
    for l in letreiros:
        m.put(l["inicio"] / FPS, impacto(0.9), 0.55)
    saida = edit / (args.saida or f"aura-{args.formato or rot.get('formato', 'reels')}{'-rascunho' if args.rascunho else ''}.mp4")
    mixar(video, m, saida)
    print(f"✓ {saida} ({sonda(saida)['duracao']:.1f}s, {len(tomadas)} tomadas)")

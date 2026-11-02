"""Caminho de luz: um processo em estações ligadas por um fio de luz, câmera contínua.

  ev.py caminho roteiro.json [--rascunho]

{"estilo": "constitucionalgabaritado", "formato": "reels", "voz": "pt-BR-AntonioNeural",
 "estacoes": [
  {"tipo": "abertura", "titulo": "PEC", "rotulo": "o caminho de uma emenda", "fala": "…"},
  {"tipo": "chips", "titulo": "Quem propõe", "fala": "…", "chips": [{"texto": "1/3 da Câmara", "gatilho": "terço"}]},
  {"tipo": "contador", "titulo": "Câmara", "numero": 308, "de": 513, "rotulo": "3/5 em dois turnos", "gatilho": "trezentos", "fala": "…"},
  {"tipo": "check", "titulo": "…", "rotulo": "…", "gatilho": "…", "fala": "…"},
  {"tipo": "carimbo", "titulo": "Sanção?", "riscado": "VETO", "carimbo": "NÃO TEM", "gatilho": "…", "fala": "…"},
  {"tipo": "final", "frase": ["Duas Casas.", "Dois turnos.", "Três quintos."], "arroba": "@constitucionalgabaritado", "fala": "…"}]}
"""
from pathlib import Path

import numpy as np

from .comum import FORMATOS, carregar_estilo, ler_json, pasta_edit, sonda
from .explicativo import quando
from .remotion_util import FPS, decodificar, fontes_public, mixar, narrar, render
from .sfx import Mix, cama, clique, impacto, pop, whoosh

ATRASO = 8   # a fala começa 8 quadros depois da estação


def main(args):
    rot_path = Path(args.roteiro).resolve()
    rot = ler_json(rot_path)
    estilo = carregar_estilo(rot.get("estilo", "constitucionalgabaritado"))
    W, H = FORMATOS[args.formato or rot.get("formato", "reels")]
    edit = pasta_edit(rot_path)
    ests = rot["estacoes"]
    falas = narrar([e["fala"] for e in ests], rot.get("voz", "pt-BR-AntonioNeural"), edit / "voz-caminho", rot.get("velocidade", "+8%"))
    t, out = 0, []
    for e, (mp3, ws, d) in zip(ests, falas):
        dur = int((d + (1.6 if e["tipo"] == "final" else 0.5)) * FPS) + ATRASO
        if e["tipo"] == "final":
            dur = max(dur, 110)
        q = {k: v for k, v in e.items() if k not in ("fala", "gatilho", "chips")}
        q.update(inicio=t, duracao=dur, _mp3=str(mp3))
        g = lambda termo, pad: ATRASO + round(quando(ws, termo, pad) * FPS)   # noqa: E731
        if e.get("chips"):
            q["chips"] = [{"texto": c["texto"], "t": g(c.get("gatilho") or c["texto"], 0.5 + 0.6 * k)} for k, c in enumerate(e["chips"])]
        if e.get("gatilho"):
            q["t"] = g(e["gatilho"], 0.6)
        out.append(q)
        t += dur
    E, C = estilo.get("explicativo", {}), estilo["cartela"]
    cores = {"fundo": E.get("fundo", "#0B1210"), "fio": E.get("acento", "#58CC02"), "fio2": rot.get("fio2", "#C8F5CC"),
             "borda": rot.get("borda", "#2F7A3E"), "card": rot.get("card", "#18221F"), "texto": "#F2F5F3", "apagado": "#93A39C"}
    tit, corpo = E.get("fonte_titulo", C.get("arquivo_titulo", "BebasNeue-Regular.ttf")), E.get("fonte_corpo", C.get("arquivo_corpo", "Poppins-Bold.ttf"))
    fontes_public(tit, corpo)
    props = {"largura": W, "altura": H, "fps": FPS, "total": t, "cores": cores,
             "fontes": {"titulo": f"fonts/{tit}", "corpo": f"fonts/{corpo}"}, "estacoes": [{k: v for k, v in q.items() if k != "_mp3"} for q in out]}
    video = render("Caminho", props, edit / f"caminho-video{'-rascunho' if args.rascunho else ''}.mp4", args.rascunho, edit)
    m = Mix(t / FPS)
    m.put(0, cama(t / FPS, 146.8), 0.08)
    for k, q in enumerate(out):
        t0 = q["inicio"] / FPS
        if q["tipo"] == "abertura":
            m.put(t0 + 0.1, impacto(), 0.5)
        else:
            m.put(max(0, t0 - 0.05), whoosh(0.5, 400, 2800, np.random.default_rng(k)), 0.2)
            m.put(t0 + 18 / FPS, pop(760 + 60 * k), 0.18)
        for ch in q.get("chips", []):
            m.put(t0 + ch["t"] / FPS, pop(1000), 0.12)
        if q["tipo"] == "contador":
            for j in range(0, 34, 2):
                m.put(t0 + (q.get("t", 10) + j) / FPS, clique(), 0.07)
        if q["tipo"] in ("check", "carimbo"):
            m.put(t0 + q.get("t", 12) / FPS, impacto(0.4) if q["tipo"] == "carimbo" else pop(1320), 0.3)
        m.put(t0 + ATRASO / FPS, decodificar(q["_mp3"]), 0.95)
    saida = edit / (args.saida or f"caminho-{args.formato or rot.get('formato', 'reels')}{'-rascunho' if args.rascunho else ''}.mp4")
    mixar(video, m, saida)
    print(f"✓ {saida} ({sonda(saida)['duracao']:.1f}s, {len(out)} estações)")

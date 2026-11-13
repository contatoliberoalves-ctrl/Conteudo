"""Troféu "Terra da Serenata" para impressora 3D (feito para a Anycubic Kobra X, mesa 260 × 260 mm).

Peças (cada uma numa cor, todas sem suporte):
  lua-violao.stl   amarelo  deitada, violão para cima (relevo de cordas, trastes, boca, cavalete)
  pedestal.stl     creme    em pé: base retangular + cilindro + disco
  haste.stl        amarelo  em pé: o pescoço curto entre o pedestal e a lua
  letreiro.stl     amarelo  deitado: TERRA DA SERENATA, encaixa na frente da base
Montagem: haste no rasgo do disco, aba da lua na haste, aba do letreiro no rasgo da base (cola em gel).

Desenho da lua e do violão em desenho.py (traçado sobre a arte). Fonte: Archivo Black (SIL OFL).
Uso: pip install trimesh shapely manifold3d mapbox_earcut matplotlib && python3 gerar.py
"""
import json
from pathlib import Path

import numpy as np
import trimesh
from matplotlib.font_manager import FontProperties
from matplotlib.textpath import TextPath
from shapely import affinity
from shapely.geometry import Point, Polygon, box
from shapely.ops import unary_union

import desenho as D

PASTA = Path(__file__).parent
FONTE = FontProperties(fname=str(PASTA / "ArchivoBlack.ttf"))

# ---------- medidas (mm) ----------
ESCALA = 160 / 950          # mm por pixel da arte (a base tem 950 px)
BASE = (160, 100, 12)       # largura, fundo, altura
BASE_RAIO = 10
CILINDRO = (75, 33)         # diâmetro, altura
DISCO = (60, 7)
HASTE = (30, 7)
LUA_ESP = 10                # espessura da lua
VIOLAO_ESP = 14             # violão fica 4 mm à frente da lua
RELEVO = 0.7                # cordas, roseta e trastes
CAVALETE_ALT = 1.2
BOCA_FUNDO = 2.5
ABA_LUA = (20, 12)          # largura e comprimento da aba que entra na haste
FOLGA = 0.2
TEXTO = "TERRA DA SERENATA"
TEXTO_LARG, TEXTO_ALT, TEXTO_ESP = 144, 21, 8
TEXTO_FRENTE = 8            # distância da frente da base até a face do letreiro
ABA_TXT = 3


def mm(g):
    """pixels da arte (y para baixo) -> mm (y para cima)"""
    return affinity.scale(g, ESCALA, -ESCALA, origin=(0, 0))


def ext(g, z0, z1):
    partes = getattr(g, "geoms", [g])
    ms = []
    for p in partes:
        if p.area < 0.01:
            continue
        m = trimesh.creation.extrude_polygon(p.simplify(0.01), z1 - z0)
        m.apply_translation((0, 0, z0))
        ms.append(m)
    m = trimesh.util.concatenate(ms)
    m.merge_vertices()
    return m


def uniao(ms):
    out = ms[0]
    for m in ms[1:]:
        out = out.union(m)
    return out


def contorno_texto(t):
    tp = TextPath((0, 0), t, size=100, prop=FONTE)
    g = Polygon()
    for v in tp.to_polygons():
        if len(v) >= 3:
            g = g.symmetric_difference(Polygon(v).buffer(0))
    return g


def letreiro():
    cap = contorno_texto("H").bounds[3]
    x, partes = 0.0, []
    for ch in TEXTO:
        if ch == " ":
            x += 18
            continue
        g = affinity.scale(contorno_texto(ch), 1, 1, origin=(0, 0))
        g = affinity.translate(g, x - g.bounds[0], 0)
        partes.append(g)
        x = g.bounds[2] - 1.5           # letras encostadas, como na arte
    g = unary_union(partes)
    g = affinity.scale(g, TEXTO_LARG / g.bounds[2], TEXTO_ALT / cap, origin=(0, 0))
    g = affinity.translate(g, -g.bounds[0], 0)
    aba = box(1, -ABA_TXT, g.bounds[2] - 1, 0.5)
    return unary_union([g, aba]), aba


def main():
    v = {k: mm(g) for k, g in D.violao().items()}
    lua = mm(D.lua())
    # aba que desce da lua até dentro da haste
    xa = (D.HASTE_X[0] + D.HASTE_X[1]) / 2 * ESCALA
    fundo_lua = lua.intersection(box(xa - ABA_LUA[0] / 2, -1e4, xa + ABA_LUA[0] / 2, 1e4)).bounds[1]
    y_topo_haste = fundo_lua + 1.0       # a lua apoia 1 mm acima do ponto mais baixo (fica firme)
    aba = box(xa - ABA_LUA[0] / 2, y_topo_haste - ABA_LUA[1], xa + ABA_LUA[0] / 2, y_topo_haste + 6)

    silh_violao = unary_union([v["corpo"], v["braco"]])
    corte_boca = v["boca"].difference(v["cordas"])
    pecas = [
        ext(unary_union([lua, aba]).difference(silh_violao), 0, LUA_ESP),
        ext(silh_violao.difference(corte_boca).difference(v["fendas"]), 0, VIOLAO_ESP),
        ext(v["boca"], 0, VIOLAO_ESP - BOCA_FUNDO),
        ext(v["fendas"], 0, VIOLAO_ESP - 2),
        ext(v["cordas"].intersection(silh_violao), VIOLAO_ESP - BOCA_FUNDO - 0.01, VIOLAO_ESP + RELEVO),
        ext(v["trastes"].difference(v["cordas"]), VIOLAO_ESP - 0.01, VIOLAO_ESP + RELEVO * 0.7),
        ext(v["roseta"], VIOLAO_ESP - 0.01, VIOLAO_ESP + RELEVO * 0.7),
        ext(v["cavalete"], VIOLAO_ESP - 0.01, VIOLAO_ESP + CAVALETE_ALT),
    ]
    lua3d = uniao(pecas)
    # coloca a aba com o fundo em y = 0 (para a montagem) e exporta deitada (já está: z = espessura)
    dy = -(y_topo_haste - ABA_LUA[1])
    minx0 = lua3d.bounds[0][0]
    lua3d.apply_translation((-minx0, dy, 0))
    lua3d.export(PASTA / "lua-violao.stl")

    # ---------- pedestal (em pé: x largura, y fundo, z altura) ----------
    W, P, H = BASE
    placa = box(0, 0, W, P).buffer(-BASE_RAIO).buffer(BASE_RAIO)
    base = ext(placa, 0, H - 1.5).union(ext(placa.buffer(-1.5, join_style=1), H - 1.5 - 0.01, H))
    cx, cy = W / 2, TEXTO_FRENTE + TEXTO_ESP + 4 + CILINDRO[0] / 2
    z1 = H + CILINDRO[1]
    z2 = z1 + DISCO[1]
    ped = uniao([base, ext(Point(cx, cy).buffer(CILINDRO[0] / 2, 128), H - 0.01, z1),
                 ext(Point(cx, cy).buffer(DISCO[0] / 2, 128), z1 - 0.01, z2)])
    rasgo = box(cx - ABA_LUA[0] / 2 - FOLGA, cy - LUA_ESP / 2 - FOLGA, cx + ABA_LUA[0] / 2 + FOLGA, cy + LUA_ESP / 2 + FOLGA)
    prof_no_disco = ABA_LUA[1] - HASTE[1]
    ped = ped.difference(ext(rasgo, z2 - prof_no_disco, z2 + 1))
    txt, aba_txt = letreiro()
    tx = (W - txt.bounds[2]) / 2
    rasgo_txt = box(tx + aba_txt.bounds[0] - FOLGA, TEXTO_FRENTE - FOLGA, tx + aba_txt.bounds[2] + FOLGA, TEXTO_FRENTE + TEXTO_ESP + FOLGA)
    ped = ped.difference(ext(rasgo_txt, H - ABA_TXT, H + 1))
    ped.export(PASTA / "pedestal.stl")

    haste = ext(Point(0, 0).buffer(HASTE[0] / 2, 96).difference(box(-ABA_LUA[0] / 2 - FOLGA, -LUA_ESP / 2 - FOLGA, ABA_LUA[0] / 2 + FOLGA, LUA_ESP / 2 + FOLGA)), 0, HASTE[1])
    haste.export(PASTA / "haste.stl")

    letr = ext(txt, 0, TEXTO_ESP)
    letr.apply_translation((0, ABA_TXT, 0))
    letr.export(PASTA / "letreiro.stl")

    # ---------- montagem (para as imagens; three.js com y para cima e a frente para +z) ----------
    xa_local = xa - minx0
    m = {"pedestal": {"cx": cx, "cy": cy, "z2": z2},
         "haste": {"x": cx, "y": z2, "z": -cy},
         "lua": {"x": cx - xa_local, "y": z2 + HASTE[1] - ABA_LUA[1], "z": -(cy + LUA_ESP / 2)},
         "letreiro": {"x": tx, "y": H - ABA_TXT, "z": -(TEXTO_FRENTE + TEXTO_ESP)}}
    (PASTA / "montagem.json").write_text(json.dumps(m, indent=1))

    for nome, malha in (("lua-violao", lua3d), ("pedestal", ped), ("haste", haste), ("letreiro", letr)):
        e = malha.extents
        print(f"{nome}: {e[0]:.0f} × {e[1]:.0f} × {e[2]:.0f} mm, {malha.volume / 1000:.1f} cm³, estanque={malha.is_watertight}")
    print(f"altura total ≈ {z2 + HASTE[1] + lua3d.extents[1] - ABA_LUA[1]:.0f} mm")


if __name__ == "__main__":
    main()

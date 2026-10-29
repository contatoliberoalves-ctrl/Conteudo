"""Suporte para Vade Mecum, versão leve (econômica e mais bonita).

Peças:
  - lateral.stl  (imprimir 2x): perfil fino de traço arredondado, base em arco
    que só toca a mesa nos dois pés.
  - placa.stl    (imprimir 1x): travessa da frente, chata, com o nome gravado.
    Fica de pé sob o aparador, virada para quem estuda.
  - travessa.stl (imprimir 1x): travessa de trás.

Tudo imprime deitado e sem suporte numa mesa de 220 x 220 mm. Medidas em mm.

Uso: pip install trimesh shapely manifold3d mapbox_earcut matplotlib
     python3 gerar.py ["NOME NA PLACA"]
"""
import math
import sys
from pathlib import Path

import numpy as np
import trimesh
from matplotlib.font_manager import FontProperties
from matplotlib.textpath import TextPath
from shapely import affinity
from shapely.geometry import LineString, Polygon, box
from shapely.ops import unary_union

# ---------- parâmetros ----------
ANGULO = 62          # inclinação da rampa (graus)
RAMPA = 170          # comprimento da rampa onde o livro encosta
TRACO = 8            # largura do traço do perfil
APARADOR = 46        # fundo do aparador (meio Vade Mecum aberto, ~4 cm)
ABA = 14             # altura da aba que segura o livro
ARCO = 7             # quanto a base sobe no meio (só os pés tocam a mesa)
LARGURA = 16         # espessura de cada lateral (altura de impressão)
VAO = 150            # vão livre entre as laterais
PLACA = (22, 7)      # placa da frente: altura x espessura
BARRA = 9            # travessa de trás, seção quadrada
FOLGA = 0.2          # folga de cada lado nos encaixes
GRAVACAO = 0.8       # profundidade do nome gravado na placa
NOME = sys.argv[1] if len(sys.argv) > 1 else "VADE MECUM"

SAIDA = Path(__file__).parent
r = TRACO / 2


def traco(*pts):
    return LineString(pts).buffer(r, cap_style=1, join_style=1, quad_segs=24)


def perfil():
    a = math.radians(ANGULO)
    u = np.array([-math.cos(a), math.sin(a)])   # sobe a rampa
    n = np.array([math.sin(a), math.cos(a)])    # para o leitor

    # o = pé da face da rampa; a placa da frente fica sob o aparador
    altura_aparador = PLACA[0] + TRACO + 6
    o = np.array([0.0, altura_aparador + r])
    c_ramp = -n * r                                  # eixo da rampa (atrás da face)
    topo = o + c_ramp + u * RAMPA
    canto = o + c_ramp - u * r                       # junção rampa/aparador
    ponta = o - u * r + n * (APARADOR + r)           # fim do aparador
    aba = ponta + u * (ABA + r)

    pe_tras = np.array([topo[0] - 6, r])
    pe_frente = np.array([ponta[0], r])
    meio = (pe_tras + pe_frente) / 2 + (0, ARCO)
    base = [pe_tras + (0, 0), pe_tras + (18, ARCO * 0.55), meio,
            pe_frente - (18, -ARCO * 0.55), pe_frente]

    escora_ini = canto + u * (RAMPA * 0.45)
    escora_fim = np.array([escora_ini[0] - 8, ARCO + r * 0.6])

    p = unary_union([
        traco(canto, topo),                  # rampa
        traco(canto, ponta, aba),            # aparador e aba
        traco(topo, pe_tras),                # perna de trás
        traco(*base),                        # base em arco
        traco(ponta, pe_frente),             # perna da frente
        traco(escora_ini, escora_fim),       # escora
    ])
    # concordâncias nas junções internas
    p = p.buffer(5, quad_segs=24).buffer(-5, quad_segs=24)

    # encaixe da placa (de pé, sob o aparador) e da travessa de trás (no pé)
    pw, ph = PLACA[1] + 2 * FOLGA, PLACA[0] + 2 * FOLGA
    px = ponta[0] - r - 3                     # rente à perna da frente, por dentro
    reforco_p = box(px - pw - 4, ARCO, px + 0.1, ARCO + ph + 8).buffer(3, quad_segs=12)
    b = BARRA + 2 * FOLGA
    bx, by = pe_tras[0] + r + b / 2 + 3, ARCO + b / 2 + 4
    reforco_b = box(bx - b / 2 - 4, by - b / 2 - 4, bx + b / 2 + 4, by + b / 2 + 4).buffer(3, quad_segs=12)
    p = unary_union([p, reforco_p, reforco_b]).buffer(3, quad_segs=12).buffer(-3, quad_segs=12)
    # janelas pequenas que sobram perto dos reforços ficam cheias
    p = Polygon(p.exterior, [i for i in p.interiors if Polygon(i).area > 600])
    furo_p = box(px - pw, ARCO + 4, px, ARCO + 4 + ph)
    furo_b = box(bx - b / 2, by - b / 2, bx + b / 2, by + b / 2)
    p = p.difference(furo_p).difference(furo_b)
    # apoio plano nos pés (1 mm) para não balançar
    p = p.difference(box(-500, -10, 500, 0))
    p = affinity.translate(p, 0, -p.bounds[1])
    return p, dict(o=o, u=u, n=n, placa=(px - pw / 2, ARCO + 4 + ph / 2 - p.bounds[1]),
                   barra=(bx, by))


def extrudar(poly, altura):
    partes = getattr(poly, "geoms", [poly])
    m = trimesh.util.concatenate([trimesh.creation.extrude_polygon(g.simplify(0.03), altura)
                                  for g in partes])
    m.merge_vertices()
    return m


def texto(s, altura_letra, largura_max):
    tp = TextPath((0, 0), s, size=10, prop=FontProperties(family="DejaVu Sans", weight="bold"))
    polys = []
    for verts in tp.to_polygons():
        if len(verts) >= 3:
            polys.append(Polygon(verts))
    # regra par/ímpar: contornos internos (miolo do A, O…) viram furos
    g = Polygon()
    for pl in sorted(polys, key=lambda q: -q.area):
        g = g.symmetric_difference(pl.buffer(0))
    minx, miny, maxx, maxy = g.bounds
    k = min(altura_letra / (maxy - miny), largura_max / (maxx - minx))
    g = affinity.scale(g, k, k, origin=(minx, miny))
    return affinity.translate(g, -g.bounds[0], -g.bounds[1])


def main():
    p, info = perfil()
    lateral = extrudar(p, LARGURA)
    lateral.export(SAIDA / "lateral.stl")

    comp = VAO + 2 * LARGURA
    placa = trimesh.creation.box((comp, PLACA[0], PLACA[1]))
    placa.apply_translation(-placa.bounds[0])
    # nome gravado no centro, só na parte visível (entre as laterais)
    t = texto(NOME, PLACA[0] * 0.5, VAO - 24)
    tx = (comp - t.bounds[2]) / 2
    ty = (PLACA[0] - t.bounds[3]) / 2
    t = affinity.translate(t, tx, ty)
    corte = extrudar(t, GRAVACAO + 1)
    corte.apply_translation((0, 0, PLACA[1] - GRAVACAO))
    placa = placa.difference(corte)
    placa.export(SAIDA / "placa.stl")

    travessa = trimesh.creation.box((comp, BARRA, BARRA))
    travessa.apply_translation(-travessa.bounds[0])
    travessa.export(SAIDA / "travessa.stl")

    for nome, m in (("lateral", lateral), ("placa", placa), ("travessa", travessa)):
        e = m.extents
        print(f"{nome}: {e[0]:.0f} x {e[1]:.0f} x {e[2]:.0f} mm, {m.volume / 1000:.1f} cm³, "
              f"estanque={m.is_watertight}")
    vol = 2 * lateral.volume + placa.volume + travessa.volume
    print(f"volume total: {vol / 1000:.0f} cm³; largura montado: {comp:.0f} mm")

    import json
    (SAIDA / "montagem.json").write_text(json.dumps({
        "largura": LARGURA, "vao": VAO, "comp": comp, "placa": PLACA, "barra": BARRA,
        "pos_placa": info["placa"], "pos_barra": info["barra"], "angulo": ANGULO,
        "o": info["o"].tolist(), "aparador": APARADOR, "traco": TRACO,
    }, indent=1))
    desenho(p)


def desenho(p):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    fig, ax = plt.subplots(figsize=(6, 7))
    x, y = p.exterior.xy
    ax.fill(x, y, color="#dbe5f1", ec="#1f3a5f", lw=1.4)
    for i in p.interiors:
        x, y = i.xy
        ax.fill(x, y, color="white", ec="#1f3a5f", lw=1.2)
    minx, miny, maxx, maxy = p.bounds
    kw = dict(arrowprops=dict(arrowstyle="<->", color="#b23a3a", lw=1))
    ax.annotate("", (minx, -9), (maxx, -9), **kw)
    ax.text((minx + maxx) / 2, -17, f"{maxx - minx:.0f} mm", color="#b23a3a", ha="center",
            fontsize=10, fontweight="bold")
    ax.annotate("", (minx - 9, 0), (minx - 9, maxy), **kw)
    ax.text(minx - 14, maxy / 2, f"{maxy:.0f} mm", color="#b23a3a", ha="right", va="center",
            fontsize=10, fontweight="bold")
    ax.set_aspect("equal")
    ax.axis("off")
    ax.set_xlim(minx - 45, maxx + 10)
    ax.set_ylim(-25, maxy + 8)
    fig.savefig(SAIDA / "perfil.png", dpi=160, bbox_inches="tight", transparent=True)


if __name__ == "__main__":
    main()

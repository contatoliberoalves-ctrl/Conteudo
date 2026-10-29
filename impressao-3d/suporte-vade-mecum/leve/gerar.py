"""Suporte para Vade Mecum, versão leve (econômica).

Peças:
  - lateral.stl  (imprimir 2x): perfil em vela, de contorno contínuo com uma
    janela só e base em arco que só toca a mesa nos dois pés.
  - placa.stl    (imprimir 1x): travessa da frente, chata, com o nome em relevo
    (troque o filamento na camada do relevo para o nome sair em outra cor).
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
from shapely.geometry import Polygon, box
from shapely.ops import unary_union

# ---------- parâmetros ----------
ANGULO = 62          # inclinação da rampa (graus)
RAMPA = 172          # comprimento da face onde o livro encosta
ESP = 9              # espessura do contorno da lateral
APARADOR = 72        # fundo do aparador: cabe o lado grosso do Vade Mecum
                     # aberto no começo ou no fim (até ~7 cm)
ABA = 14             # altura da aba que segura o livro
ARCO = 5             # quanto a base sobe no meio (só os pés tocam a mesa)
LARGURA = 15         # espessura de cada lateral (altura de impressão)
VAO = 150            # vão livre entre as laterais
PLACA = (24, 7)      # placa da frente: altura x espessura
BARRA = 9            # travessa de trás, seção quadrada
FOLGA = 0.2          # folga de cada lado nos encaixes
RELEVO = 1.0         # altura do nome em relevo na placa (troca de cor nessa camada)
NOME = sys.argv[1] if len(sys.argv) > 1 else "@liberofilho"

SAIDA = Path(__file__).parent


def arredondar(p, convexo, concavo):
    p = p.buffer(-convexo, quad_segs=24).buffer(convexo, quad_segs=24)
    return p.buffer(concavo, quad_segs=24).buffer(-concavo, quad_segs=24)


def bezier(p0, c, p1, k=24):
    t = np.linspace(0, 1, k)[:, None]
    return (1 - t) ** 2 * p0 + 2 * (1 - t) * t * c + t ** 2 * p1


def perfil():
    a = math.radians(ANGULO)
    u = np.array([-math.cos(a), math.sin(a)])   # sobe a rampa
    n = np.array([math.sin(a), math.cos(a)])    # para o leitor

    # o = canto onde o livro encosta (face da rampa x aparador)
    o = np.array([0.0, PLACA[0] + 18])
    topo = o + u * RAMPA                         # alto da face
    topo_tras = topo - n * 13
    ponta = o + n * APARADOR                     # fim do aparador (base da aba)
    aba_in = ponta + u * ABA
    aba_out = aba_in + n * 9
    frente = ponta + n * 9 - u * ESP             # quina de baixo da aba, por fora
    pe_frente = np.array([frente[0], 0.0])
    pe_tras = np.array([topo_tras[0] - 18, 0.0])

    costas = bezier(topo_tras, np.array([topo_tras[0] - 6, 55]), pe_tras + (0, 0.01))
    base = bezier(pe_tras + (22, 0), np.array([(pe_tras[0] + pe_frente[0]) / 2, ARCO * 2]),
                  pe_frente - (22, 0))
    contorno = [o, topo, topo_tras, *costas, pe_tras, *base, pe_frente, frente,
                aba_out, aba_in, ponta]
    casca = arredondar(Polygon(contorno).buffer(0), 3.5, 6)

    # encaixes: placa de pé na frente, sob o aparador; travessa no pé de trás
    pw, ph = PLACA[1] + 2 * FOLGA, PLACA[0] + 2 * FOLGA
    px1 = pe_frente[0] - ESP
    furo_p = box(px1 - pw, ARCO + 6, px1, ARCO + 6 + ph)
    b = BARRA + 2 * FOLGA
    bx, by = pe_tras[0] + ESP + 4 + b / 2, ARCO + 4 + b / 2
    furo_b = box(bx - b / 2, by - b / 2, bx + b / 2, by + b / 2)

    # uma janela só, acompanhando o contorno, longe dos encaixes
    janela = casca.buffer(-ESP, join_style=1)
    janela = janela.difference(furo_p.buffer(ESP)).difference(furo_b.buffer(ESP))
    janela = janela.difference(box(-500, -10, 500, ARCO + ESP))
    janela = max(getattr(janela, "geoms", [janela]), key=lambda g: g.area)
    janela = arredondar(janela, 12, 0.01)
    p = casca.difference(janela).difference(furo_p).difference(furo_b)
    p = p.difference(box(-500, -10, 500, 0))
    return p, dict(o=o, u=u, n=n, placa=((px1 - pw / 2), ARCO + 6 + ph / 2), barra=(bx, by))


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
    # nome em relevo no centro, só na parte visível (entre as laterais)
    t = texto(NOME, PLACA[0] * 0.5, VAO - 24)
    t = affinity.translate(t, (comp - t.bounds[2]) / 2, (PLACA[0] - t.bounds[3]) / 2)
    letras = extrudar(t, RELEVO)
    letras.apply_translation((0, 0, PLACA[1]))
    placa.export(SAIDA / "render" / "placa-base.stl")      # só para as imagens 3D,
    letras.export(SAIDA / "render" / "placa-letras.stl")   # com o nome em outra cor
    placa = placa.union(letras)
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
        "o": info["o"].tolist(), "aparador": APARADOR, "relevo": RELEVO,
    }, indent=1))
    desenho(p)


def desenho(p):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    fig, ax = plt.subplots(figsize=(6, 7))
    x, y = p.exterior.xy
    ax.fill(x, y, color="#e4dbf3", ec="#4b2a7a", lw=1.4)
    for i in p.interiors:
        x, y = i.xy
        ax.fill(x, y, color="white", ec="#4b2a7a", lw=1.2)
    minx, miny, maxx, maxy = p.bounds
    kw = dict(arrowprops=dict(arrowstyle="<->", color="#7d4cc2", lw=1))
    ax.annotate("", (minx, -9), (maxx, -9), **kw)
    ax.text((minx + maxx) / 2, -17, f"{maxx - minx:.0f} mm", color="#7d4cc2", ha="center",
            fontsize=10, fontweight="bold")
    ax.annotate("", (minx - 9, 0), (minx - 9, maxy), **kw)
    ax.text(minx - 14, maxy / 2, f"{maxy:.0f} mm", color="#7d4cc2", ha="right", va="center",
            fontsize=10, fontweight="bold")
    ax.set_aspect("equal")
    ax.axis("off")
    ax.set_xlim(minx - 45, maxx + 10)
    ax.set_ylim(-25, maxy + 8)
    fig.savefig(SAIDA / "perfil.png", dpi=160, bbox_inches="tight", transparent=True)


if __name__ == "__main__":
    main()

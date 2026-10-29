"""Suporte (atril) para Vade Mecum aberto, para impressora 3D.

Peças:
  - lateral.stl  (imprimir 2x): perfil em treliça com rampa inclinada,
    aparador para a lombada/borda de baixo do livro e aba que segura as páginas.
  - travessa.stl (imprimir 2x): barras que passam pelos furos das duas
    laterais e mantêm o espaçamento.

Tudo cabe numa mesa de 220 x 220 mm e imprime sem suporte (laterais deitadas,
com o perfil na mesa). Medidas em mm.

Uso: pip install trimesh shapely manifold3d mapbox_earcut matplotlib
     python3 gerar.py
"""
import math
from pathlib import Path

import numpy as np
import trimesh
from shapely import affinity
from shapely.geometry import Polygon, box
from shapely.ops import unary_union

# ---------- parâmetros ----------
ANGULO = 62          # inclinação da rampa em relação à mesa (graus)
RAMPA = 185          # comprimento da rampa onde o livro encosta
ESP = 9              # espessura da rampa, do aparador e das paredes
APARADOR = 48        # profundidade do aparador (cabe meio Vade Mecum aberto, ~4 cm)
ABA = 16             # altura da aba da frente, que impede o livro de escorregar
BASE = 24            # altura da base (onde passam as travessas)
LARGURA = 40         # espessura de cada lateral (altura de impressão)
VAO = 130            # vão livre entre as duas laterais
BARRA = 12           # seção quadrada da travessa
FOLGA = 0.25         # folga de cada lado no encaixe da travessa
RAIO = 3             # arredondamento dos cantos

SAIDA = Path(__file__).parent


def perfil():
    a = math.radians(ANGULO)
    u = np.array([-math.cos(a), math.sin(a)])   # sobe a rampa (para trás)
    n = np.array([math.sin(a), math.cos(a)])    # normal, para o leitor

    def quad(o, su, sn):
        """retângulo a partir de o, com su ao longo de u e sn ao longo de n"""
        o = np.asarray(o, float)
        return Polygon([o,
                        o + u * su,
                        o + u * su + n * sn,
                        o + n * sn])

    # face da rampa passa por o; o aparador fica 4 mm acima da base
    def pecas(o):
        return (quad(o, RAMPA, -ESP),                                  # rampa, atrás da face
                quad(o - u * ESP - n * ESP, ESP, APARADOR + 2 * ESP),  # aparador
                quad(o - u * ESP + n * APARADOR, ESP + ABA, ESP))      # aba

    o = np.array([0.0, BASE + 4 - unary_union(pecas((0, 0))).bounds[1]])
    corpo = unary_union(pecas(o))
    minx, _, maxx, _ = corpo.bounds
    base = box(minx, 0, maxx, BASE)
    todos = unary_union([corpo, base])

    # moldura: casco convexo vazado + escora da metade da rampa até a base
    casco = todos.convex_hull
    moldura = casco.difference(casco.buffer(-ESP, join_style=2))
    meio = o + u * (RAMPA * 0.55) - n * ESP
    pe = np.array([meio[0] + 25, BASE])
    escora = Polygon([meio - (ESP * .7, 0), meio + (ESP * .7, 0),
                      pe + (ESP * .7, 0), pe - (ESP * .7, 0)])
    peca = unary_union([todos, moldura, escora])

    # vão onde o livro apoia: na frente da rampa e acima do aparador
    peca = peca.difference(quad(o, RAMPA + 50, APARADOR))
    peca = peca.buffer(RAIO).buffer(-RAIO).buffer(-RAIO / 2).buffer(RAIO / 2)

    # furos das travessas, na base
    b = BARRA + 2 * FOLGA
    cy = BASE / 2
    peca = peca.difference(unary_union(
        [box(x - b / 2, cy - b / 2, x + b / 2, cy + b / 2) for x in furos_x(peca)]))
    return peca


def furos_x(peca):
    """centro dos dois furos das travessas: perto da frente e de trás da base"""
    minx, _, maxx, _ = peca.bounds
    m = ESP + BARRA / 2 + 2
    return minx + m, maxx - m


def extrudar(poly, altura):
    m = trimesh.creation.extrude_polygon(poly.simplify(0.05), altura)
    m.merge_vertices()
    return m


def main():
    p = perfil()
    lateral = extrudar(p, LARGURA)
    lateral.apply_translation(-lateral.bounds[0])
    lateral.export(SAIDA / "lateral.stl")

    comp = VAO + 2 * LARGURA
    travessa = trimesh.creation.box((comp, BARRA, BARRA))
    travessa.apply_translation(-travessa.bounds[0])
    travessa.export(SAIDA / "travessa.stl")

    ext = lateral.extents
    print(f"lateral: {ext[0]:.0f} x {ext[1]:.0f} x {ext[2]:.0f} mm, "
          f"{lateral.volume / 1000:.0f} cm³, estanque={lateral.is_watertight}")
    print(f"travessa: {comp:.0f} x {BARRA} x {BARRA} mm")
    print(f"largura total do suporte: {comp:.0f} mm")
    previa(p, lateral, travessa)


def previa(p, lateral, travessa):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from mpl_toolkits.mplot3d.art3d import Poly3DCollection

    fig = plt.figure(figsize=(12, 6))
    ax = fig.add_subplot(1, 2, 1)
    for geom in [p]:
        x, y = geom.exterior.xy
        ax.fill(x, y, color="#c9d6e8", ec="#1f3a5f")
        for i in geom.interiors:
            x, y = i.xy
            ax.fill(x, y, color="white", ec="#1f3a5f")
    ax.set_aspect("equal")
    ax.set_title("Perfil da lateral (mm)")
    ax.grid(alpha=.3)

    ax3 = fig.add_subplot(1, 2, 2, projection="3d")
    # monta: perfil no plano XZ, laterais em y=0 e y=LARGURA+VAO
    def mesh_xz(m, dy):
        v = m.vertices.copy()
        v = np.c_[v[:, 0], v[:, 2] + dy, v[:, 1]]
        return v[m.faces]
    for dy in (0, LARGURA + VAO):
        ax3.add_collection3d(Poly3DCollection(mesh_xz(lateral, dy), facecolors="#c9d6e8",
                                              alpha=1, shade=True))
    dx = lateral.bounds[0][0] - p.bounds[0]
    for xc in furos_x(p):
        x0 = xc + dx - BARRA / 2
        t = travessa.copy()
        v = t.vertices.copy()
        v = np.c_[v[:, 1] + x0, v[:, 0], v[:, 2] + BASE / 2 - BARRA / 2]
        ax3.add_collection3d(Poly3DCollection(v[t.faces], facecolors="#e8b04a", shade=True))
    W = 2 * LARGURA + VAO
    ax3.set_xlim(-20, 200); ax3.set_ylim(0, W); ax3.set_zlim(0, 220)
    ax3.set_box_aspect((220, W, 220))
    ax3.view_init(elev=22, azim=-35)
    ax3.set_title("Montado (2 laterais + 2 travessas)")
    fig.tight_layout()
    fig.savefig(SAIDA / "previa.png", dpi=110)


if __name__ == "__main__":
    main()

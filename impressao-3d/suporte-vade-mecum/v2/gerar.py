"""Suporte para Vade Mecum v2 (projeto novo).

Uma prancha inteira onde o livro aberto encosta de ponta a ponta (o meio não tem
para onde afundar), um aparador corrido que segura a borda de baixo do livro em toda a
largura, duas pernas que encaixam nos trilhos de trás e dois prendedores de página com
dobradiça, que deitam sobre as páginas pelo próprio peso.

Peças (todas sem suporte, mesa a partir de 256 × 256 mm):
  prancha.stl       1×  deitada, face lisa para baixo
  aparador.stl      1×  deitado
  perna.stl         2×  deitada
  prendedor.stl     2×  deitado
Pinos das dobradiças: dois pedaços de 22 mm do próprio filamento (1,75 mm).

Uso: pip install trimesh shapely manifold3d mapbox_earcut matplotlib && python3 gerar.py
"""
import json
import math
from pathlib import Path

import numpy as np
import trimesh
from shapely.geometry import Point, Polygon, box
from shapely.ops import unary_union

PASTA = Path(__file__).parent

# ---------- medidas (mm) ----------
ANGULO = 65                  # inclinação da prancha (graus em relação à mesa)
LARG, ALT = 240, 200         # prancha
PLACA = 1.6                  # espessura da face da prancha
NERV = (2.0, 5)              # nervuras atrás: espessura, profundidade
BLOCO = 14                   # faixa maciça de baixo da prancha (recebe o aparador)
CANAL_X = (60, 180)          # trilhos das pernas (centro, ao longo da largura)
PERNA_ESP = 5
FAIXA_MEIO = (95, 145)       # faixa maciça atrás da lombada
HORIZ = (14, 60, 106, 152)   # nervuras horizontais (y)
FUNDO = 76                   # profundidade do aparador (cabe o lado grosso do livro aberto)
APAR_ESP = 2.4
ABA = 16                     # altura da aba da frente
LINGUETA = (2.6, 7)          # espessura e comprimento da lingueta do aparador
RANHURA_Y = 5                # onde fica a ranhura na faixa de baixo
DOBRADICAS_X = (45, 195)
PINO = 2.0                   # furo das orelhas (pino de filamento 1,75 mm)
FOLGA = 0.2


def ext(g, z0, z1):
    ms = []
    for p in getattr(g, "geoms", [g]):
        if p.area > 0.01:
            m = trimesh.creation.extrude_polygon(p.simplify(0.01), z1 - z0)
            m.apply_translation((0, 0, z0))
            ms.append(m)
    m = trimesh.util.concatenate(ms)
    m.merge_vertices()
    return m


def caixa(x0, y0, z0, x1, y1, z1):
    b = trimesh.creation.box((x1 - x0, y1 - y0, z1 - z0))
    b.apply_translation(((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2))
    return b


def cilindro_x(x0, x1, y, z, r, n=48):
    c = trimesh.creation.cylinder(radius=r, height=x1 - x0, sections=n)
    c.apply_transform(trimesh.transformations.rotation_matrix(math.pi / 2, (0, 1, 0)))
    c.apply_translation(((x0 + x1) / 2, y, z))
    return c


# ---------- prancha: x largura, y ao longo da inclinação, z para trás (face lisa em z = 0) ----------
def prancha_2d():
    t, d = NERV
    contorno = box(0, 0, LARG, ALT).buffer(-8).buffer(8)
    canais = [box(c - (PERNA_ESP / 2 + FOLGA) - t, BLOCO, c + (PERNA_ESP / 2 + FOLGA) + t, ALT - 20) for c in CANAL_X]
    vazio_canal = [box(c - PERNA_ESP / 2 - FOLGA, BLOCO, c + PERNA_ESP / 2 + FOLGA, ALT) for c in CANAL_X]
    # células da grade (onde a face pode ter janelas)
    xs = [4, CANAL_X[0] - PERNA_ESP / 2 - FOLGA - t, CANAL_X[0] + PERNA_ESP / 2 + FOLGA + t, FAIXA_MEIO[0],
          FAIXA_MEIO[1], CANAL_X[1] - PERNA_ESP / 2 - FOLGA - t, CANAL_X[1] + PERNA_ESP / 2 + FOLGA + t, LARG - 4]
    ys = list(HORIZ) + [ALT - 4]
    janelas = []
    for i in (0, 2, 4, 6):
        for j in range(len(ys) - 1):
            janelas.append(box(xs[i] + t + 3, ys[j] + t + 3, xs[i + 1] - 3, ys[j + 1] - 3).buffer(-5).buffer(5))
    face = contorno.difference(unary_union(janelas))
    # nervuras: aro, horizontais, verticais da faixa do meio e trilhos das pernas
    aro = contorno.difference(contorno.buffer(-2.4))
    linhas = [box(0, y, LARG, y + t) for y in HORIZ[1:]]
    verticais = [box(x, BLOCO, x + t, ALT) for x in (FAIXA_MEIO[0], FAIXA_MEIO[1] - t)]
    colunas = [box(x, BLOCO, x + t, ALT) for x in (xs[1] - t, xs[2], xs[5] - t, xs[6])]
    grade = unary_union([aro, *linhas, *verticais, *colunas, *canais])
    grade = grade.intersection(contorno).difference(unary_union(vazio_canal))
    bloco = box(0, 0, LARG, BLOCO).intersection(contorno)
    return face, grade, bloco


def prancha():
    face, grade, bloco = prancha_2d()
    z1 = PLACA + NERV[1]
    m = trimesh.boolean.union([ext(face, 0, PLACA), ext(grade, PLACA - 0.01, z1), ext(bloco, 0, z1)])
    # ranhura do aparador na face da frente (faixa de baixo)
    lt, ll = LINGUETA
    m = m.difference(caixa(3, RANHURA_Y, -1, LARG - 3, RANHURA_Y + lt + 2 * FOLGA, ll + FOLGA))
    return m


# ---------- aparador: x largura, y a partir da prancha, z espessura (deitado) ----------
def aparador():
    lt, ll = LINGUETA
    placa = box(0, 0, LARG, FUNDO).buffer(-3).buffer(3)
    m = ext(placa, 0, APAR_ESP)
    m = trimesh.boolean.union([
        m,
        caixa(3.4, -ll, (APAR_ESP - lt) / 2, LARG - 3.4, 0.5, (APAR_ESP + lt) / 2),     # lingueta
        ext(box(0, FUNDO - 3, LARG, FUNDO).buffer(-1).buffer(1), APAR_ESP - 0.01, APAR_ESP + ABA),   # aba
        *[caixa(x - 1.2, 0, APAR_ESP - 0.01, x + 1.2, FUNDO - 2, APAR_ESP + 3) for x in (20, 80, 160, 220)],  # reforços
    ])
    # orelhas das dobradiças em cima da aba
    zt = APAR_ESP + ABA
    orelhas, furos = [], []
    for c in DOBRADICAS_X:
        for x0 in (c - 9.6, c + 5.6):
            orelhas.append(caixa(x0, FUNDO - 6, zt - 0.01, x0 + 4, FUNDO, zt + 8))
        furos.append(cilindro_x(c - 12, c + 12, FUNDO - 3, zt + 4.5, PINO / 2 + 0.05))
    m = trimesh.boolean.union([m, *orelhas])
    return trimesh.boolean.difference([m, *furos])


# ---------- prendedor de página ----------
def prendedor():
    # deitado: dobradiça (cilindro ao longo de x) na ponta y = 0, haste ao longo de y
    nucleo = cilindro_x(-5, 5, 0, 3, 3)
    haste = ext(unary_union([box(-5, 0, 5, 14), Polygon([(-5, 14), (5, 14), (9, 24), (-9, 24)]),
                             box(-9, 24, 9, 72).buffer(-4).buffer(4)]), 0, 2.4)
    m = trimesh.boolean.union([nucleo, haste])
    return m.difference(cilindro_x(-6, 6, 0, 3, PINO / 2 + 0.3))


# ---------- perna (vista de lado: x para trás é negativo, y altura) ----------
def perna():
    a = math.radians(ANGULO)
    u = np.array([-math.cos(a), math.sin(a)])         # sobe a prancha
    n = np.array([math.sin(a), math.cos(a)])          # normal, para a frente
    zfundo = PLACA + NERV[1]
    O = np.array([0.0, 0.0])                          # quina de trás de baixo da prancha (na mesa)
    F = O + n * zfundo                                # quina da frente de baixo
    P = F - n * PLACA                                 # costas da face (onde a perna encosta)
    A = P + u * BLOCO
    E = O + u * BLOCO
    B = P + u * (ALT - 22)
    C = np.array([-135.0, 0.0])
    g = Polygon([O, E, A, B, C]).buffer(0)
    janela = g.buffer(-10, join_style=1).buffer(-6).buffer(6)
    g = g.difference(janela).buffer(2).buffer(-2)
    return ext(g, 0, PERNA_ESP), dict(u=u.tolist(), n=n.tolist(), F=F.tolist())


def main():
    pecas = {"prancha": prancha(), "aparador": aparador(), "prendedor": prendedor()}
    pecas["perna"], geo = perna()
    for nome, m in pecas.items():
        m.export(PASTA / f"{nome}.stl")
        e = m.extents
        print(f"{nome}: {e[0]:.0f} × {e[1]:.0f} × {e[2]:.0f} mm, {m.volume / 1000:.1f} cm³, estanque={m.is_watertight}")
    a = math.radians(ANGULO)
    print(f"altura ≈ {ALT * math.sin(a) + (PLACA + NERV[1]) * math.cos(a):.0f} mm, fundo ≈ 135 mm, largura {LARG} mm")
    (PASTA / "montagem.json").write_text(json.dumps({
        "angulo": ANGULO, "larg": LARG, "alt": ALT, "placa": PLACA, "nerv": NERV, "canais": CANAL_X,
        "perna_esp": PERNA_ESP, "fundo": FUNDO, "apar_esp": APAR_ESP, "aba": ABA, "lingueta": LINGUETA,
        "ranhura_y": RANHURA_Y, "dobradicas": DOBRADICAS_X, "folga": FOLGA, **geo}, indent=1))


if __name__ == "__main__":
    main()

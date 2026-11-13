"""Desenho 2D (vista de frente) da lua com o violão, em pixels da arte de referência
(1254 × 1254, y para baixo). gerar.py converte para mm."""
import math

import numpy as np
from shapely import affinity
from shapely.geometry import LineString, Point, Polygon, box
from shapely.ops import unary_union

# ---------- lua ----------
# Contorno traçado sobre a arte: borda de fora (da ponta de cima, pela esquerda, até a ponta da direita)
# e borda de dentro (de volta, da ponta da direita até a de cima). Uma spline suaviza o traço.
LUA_FORA = [(748, 66), (700, 48), (640, 40), (580, 43), (520, 55), (460, 78), (400, 113), (345, 163), (300, 223),
            (265, 293), (242, 373), (233, 460), (240, 545), (262, 625), (300, 695), (352, 752), (415, 795), (490, 820),
            (570, 830), (650, 824), (725, 801), (795, 761), (855, 703), (905, 633), (938, 563), (956, 505), (962, 470)]
LUA_DENTRO = [(957, 466), (946, 505), (938, 520), (908, 585), (862, 645), (802, 696), (735, 732), (665, 750), (590, 750), (520, 734),
              (455, 703), (406, 660), (374, 607), (360, 550), (358, 490), (367, 430), (385, 370), (412, 310), (450, 250),
              (500, 192), (560, 142), (622, 104), (690, 80), (745, 70)]
PONTA = 8                        # arredondamento das pontas


def curva(pts, n=60):
    """Catmull-Rom pelos pontos (aberta)"""
    p = np.array(pts, float)
    p = np.vstack([2 * p[0] - p[1], p, 2 * p[-1] - p[-2]])
    out = []
    for i in range(1, len(p) - 2):
        p0, p1, p2, p3 = p[i - 1], p[i], p[i + 1], p[i + 2]
        for t in np.linspace(0, 1, n, endpoint=False):
            out.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t ** 2
                              + (-p0 + 3 * p1 - 3 * p2 + p3) * t ** 3))
    out.append(p[-2])
    return out


def lua():
    g = Polygon(curva(LUA_FORA) + curva(LUA_DENTRO)).buffer(0)
    return g.buffer(-PONTA, 64).buffer(PONTA, 64)


# ---------- violão (eixo u ao longo do braço, v na largura; u = 0 no centro do bojo de baixo) ----------
ANG = 20                     # inclinação do braço em relação à vertical (graus)
ORIGEM = (630, 645)          # centro do bojo de baixo na arte
LARGURA_CORPO = 1.15         # o corpo é um pouco mais largo que redondo (como na arte)
BOJO_BAIXO, BOJO_CIMA, U_CIMA = 122, 95, 182
BRACO = (275, 515, 46)       # u inicial, u final, largura
CABECA = (515, 655, 62)
TARRAXAS_U = (560, 600, 640)
BOCA = (128, 42)             # u, raio
CAVALETE = (-40, 150, 26)    # u, largura, altura
TRASTES_U = [305 + i * 17 for i in range(12)]


def local_para_arte(g):
    """local (u para cima, v para a direita) -> pixels da arte (y para baixo)"""
    g = affinity.rotate(g, -ANG, origin=(0, 0))          # inclina para a direita
    g = affinity.scale(g, 1, -1, origin=(0, 0))          # y para baixo
    return affinity.translate(g, *ORIGEM)


def seg(p, q, w):
    return LineString([p, q]).buffer(w / 2, cap_style=2)


def violao():
    """retorna (corpo, braço+cabeça, detalhes): silhuetas no plano da arte"""
    corpo = unary_union([Point(0, 0).buffer(BOJO_BAIXO, 128), Point(0, U_CIMA).buffer(BOJO_CIMA, 128)])
    corpo = corpo.buffer(38, 64).buffer(-38, 64)                       # cintura suave
    corpo = affinity.scale(corpo, LARGURA_CORPO, 1, origin=(0, 0))
    u0, u1, w = BRACO
    braco = box(-w / 2, u0, w / 2, u1)
    c0, c1, cw = CABECA
    cabeca = box(-cw / 2, c0, cw / 2, c1).buffer(-10).buffer(10)
    tarraxas = [Point(s * (cw / 2 + 11), u).buffer(15, 32) for u in TARRAXAS_U for s in (-1, 1)]
    hastes = [box(-cw / 2 - 11, u - 4, cw / 2 + 11, u + 4) for u in TARRAXAS_U]
    braco = unary_union([braco, cabeca, *tarraxas, *hastes])
    fendas = unary_union([box(-17, c0 + 30, -5, c1 - 18).buffer(5), box(5, c0 + 30, 17, c1 - 18).buffer(5)])

    # detalhes em relevo (positivos) e recortes (negativos)
    bu, bw, bh = CAVALETE
    cavalete = box(-bw / 2, bu - bh / 2, bw / 2, bu + bh / 2)
    pinos = unary_union([Point(x, bu).buffer(4.5, 16) for x in (-24, -8, 8, 24)])
    bu_, br = BOCA
    roseta = Point(0, bu_).buffer(br + 14, 96).difference(Point(0, bu_).buffer(br + 8, 96))
    roseta = unary_union([roseta, Point(0, bu_).buffer(br + 3, 96).difference(Point(0, bu_).buffer(br, 96))])
    boca = Point(0, bu_).buffer(br, 96)
    cordas = unary_union([seg((-27 + i * 10.8, bu), (-14 + i * 5.6, CABECA[0] + 2), 3.2) for i in range(6)])
    trastes = unary_union([box(-w / 2 + 2, u - 2, w / 2 - 2, u + 2) for u in TRASTES_U])
    pestana = box(-w / 2, CABECA[0] - 4, w / 2, CABECA[0] + 4)

    L = local_para_arte
    return {
        "corpo": L(corpo), "braco": L(braco), "fendas": L(fendas), "boca": L(boca),
        "cavalete": L(cavalete.difference(pinos)), "roseta": L(roseta),
        "cordas": L(cordas.difference(boca).union(cordas.intersection(boca))),
        "trastes": L(unary_union([trastes, pestana])),
    }


# ---------- haste (sai da lua e entra no pedestal) ----------
HASTE_X = (545, 675)    # largura do encaixe na arte
HASTE_Y = 800           # onde começa abaixo da lua

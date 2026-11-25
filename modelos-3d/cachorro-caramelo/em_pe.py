#!/usr/bin/env python3
"""Cachorro em pé na base com a placa "CACHORRO", igual à imagem de referência, em 4 cores
(marrom, branco, bege, preto) como partes separadas: imprime com ACE Pro ou AMS, sem configuração de AMS.

  python3 em_pe.py --previa      comparação com a referência (grade grossa)
  python3 em_pe.py               3MF (uma parte por cor), STL de uma cor e imagens

A forma do corpo, do rabo e das pernas sai da própria silhueta da referência (entrada/referencia-em-pe.webp,
fora do git), "inflada" em 3D; as cores do corpo e das patas vêm dos pixels dela. A cabeça (virada para
quem olha) é esculpida em 3D. Unidade de trabalho: 1 pixel da referência; no fim tudo vira mm.
"""
import argparse
import time

import numpy as np
from PIL import Image
from scipy import ndimage as ndi
from scipy.ndimage import map_coordinates

import gerar as g
from gerar import caps, cavar, elip, esfera, f32, rx, ry, rz, smin, tubo, unit

REF = g.AQUI / "entrada" / "referencia-em-pe.webp"
ALTURA_MM = 110.0  # altura total (base + cachorro)
ELEV = np.radians(7.5)  # a foto é tirada um pouco de cima: o tampo da base aparece
Y0 = 822.5  # linha da imagem onde fica o tampo da base no meio da profundidade
FUNDO = (203, 200, 203)

# ---------------------------------------------------------------- referência
im = np.asarray(Image.open(REF).convert("RGB")).astype(np.float32)
Hi, Wi = im.shape[:2]
hsv = np.asarray(Image.open(REF).convert("HSV")).astype(np.float32)
S, Vv = hsv[..., 1] / 255, hsv[..., 2] / 255


FUNDO_M = np.sqrt(((im - np.array(FUNDO)) ** 2).sum(2)) < 16
YY, XX = np.mgrid[0:Hi, 0:Wi]
BASE_M = (YY > 780) & ((Vv < 0.33) | (YY > 862))
CAO = ~FUNDO_M & ~BASE_M & (YY < 870)
CAO = ndi.binary_fill_holes(ndi.binary_opening(CAO, iterations=2))  # buracos só os fechados pelo próprio cachorro
_rot, _n = ndi.label(CAO)
CAO = _rot == (1 + np.argmax(ndi.sum(CAO, _rot, range(1, _n + 1))))  # só o cachorro (maior pedaço)
BRANCO = CAO & (S < 0.27) & (Vv > 0.45)


def poligono(pts):
    from PIL import ImageDraw

    m = Image.new("L", (Wi, Hi), 0)
    ImageDraw.Draw(m).polygon([tuple(p) for p in pts], fill=1)
    return np.asarray(m).astype(bool)


CABECA_P = poligono([(830, 0), (1320, 0), (1320, 400), (1125, 372), (1062, 305), (1000, 236), (948, 188), (830, 178)])
RABO_P = poligono([(205, 720), (215, 600), (290, 430), (348, 355), (392, 392), (384, 470), (338, 585), (298, 700)])
PERNAS_P = {  # (polígono, linha da sola na imagem, lado: -1 perto, +1 longe)
    "tras_perto": (poligono([(300, 605), (474, 590), (474, 870), (300, 870)]), 840, -1),
    "tras_longe": (poligono([(474, 572), (640, 548), (640, 870), (474, 870)]), 810, 1),
    "frente_perto": (poligono([(775, 600), (936, 600), (936, 870), (775, 870)]), 852, -1),
    "frente_longe": (poligono([(940, 600), (1100, 600), (1100, 870), (940, 870)]), 830, 1),
}
AFASTA = {"tras": 106.0, "frente": 92.0}  # meia distância (px) entre as patas de perto e de longe


def esticar(m, E=110):
    """A perna continua para cima, dentro do corpo, com a largura que tem logo abaixo do topo."""
    rot, n = ndi.label(m)
    m = rot == (1 + np.argmax(ndi.sum(m, rot, range(1, n + 1))))  # só a perna (sem lascas da vizinha)
    ys = np.flatnonzero(m.any(1))
    ref = ys[0] + 60
    ext = np.zeros_like(m)
    ext[ys[0] - E : ref] = m[ref]
    return m | (ext & CAO), ys[0]


PERNAS = {}
for k, (p, sola, lado) in PERNAS_P.items():
    m, topo = esticar(CAO & p)
    PERNAS[k] = (m, sola, lado * AFASTA[k.split("_")[0]], sola - topo)
TRONCO = CAO & ~CABECA_P
for k, (p, _, _) in PERNAS_P.items():
    TRONCO &= ~(CAO & p)
RABO = CAO & RABO_P & ~CABECA_P


def sdf2(m):
    """Distância com sinal em pixels (negativo dentro)."""
    return (ndi.distance_transform_edt(~m) - ndi.distance_transform_edt(m)).astype(np.float32)


def sdf_suave(m, sigma=1.2):
    """Distância com sinal (negativa dentro) sem o serrilhado do recorte: perto do contorno vem de um
    campo borrado dividido pelo gradiente; longe, da transformada de distância."""
    G = ndi.gaussian_filter(m.astype(np.float32), sigma) - 0.5
    gy, gx = np.gradient(G)
    perto = -G / np.maximum(np.hypot(gx, gy), 1e-3)
    dentro = G > 0
    longe = np.where(dentro, 0.5 - ndi.distance_transform_edt(dentro), ndi.distance_transform_edt(~dentro) - 0.5)
    w = np.clip(np.abs(perto) - 1.0, 0, 1)
    return ((1 - w) * perto + w * longe).astype(np.float32)


def poisson(m, f=2):
    """h com -∇²h = 1 dentro de m e h = 0 no contorno."""
    from scipy.sparse import csr_matrix
    from scipy.sparse.linalg import spsolve

    ms = m[::f, ::f]
    H, W = ms.shape
    pts = np.flatnonzero(ms)
    idx = np.full(ms.size, -1)
    idx[pts] = np.arange(len(pts))
    r, c = np.divmod(pts, W)
    I, J, V = [np.arange(len(pts))], [np.arange(len(pts))], [np.full(len(pts), 4.0)]
    for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        rr, cc = r + dr, c + dc
        ok = (rr >= 0) & (rr < H) & (cc >= 0) & (cc < W)
        j = np.full(len(pts), -1)
        j[ok] = idx[rr[ok] * W + cc[ok]]
        k = j >= 0
        I.append(np.flatnonzero(k))
        J.append(j[k])
        V.append(-np.ones(k.sum()))
    A = csr_matrix((np.concatenate(V), (np.concatenate(I), np.concatenate(J))), shape=(len(pts),) * 2)
    h = np.zeros(ms.size)
    h[pts] = spsolve(A.tocsc(), np.full(len(pts), float(f * f)))
    return ndi.zoom(h.reshape(H, W), f, order=1)


def regiao(m):
    """(distância suave, meia largura local a). A meia espessura em Y é sqrt(δ(2a - δ)), δ = distância ao
    contorno: corte redondo que acompanha a largura de cada ponto (numa faixa de largura 2a, é um círculo)."""
    sd = sdf_suave(m)
    dl = -sd
    h = poisson(m)
    ok = dl >= 4
    a = np.where(ok, (h + dl * dl / 2) / np.maximum(dl, 1e-3), 0)
    num, den = ndi.gaussian_filter(a * ok, 4), ndi.gaussian_filter(ok.astype(np.float32), 4)
    return sd, np.where(den > 1e-3, num / np.maximum(den, 1e-3), 0).astype(np.float32)


SD_TRONCO, R_TRONCO = regiao(TRONCO)
SD_RABO, R_RABO = regiao(RABO)
SD_PERNAS = {k: (*regiao(m), sola, yc, alt) for k, (m, sola, yc, alt) in PERNAS.items()}
SD_BRANCO = sdf2(ndi.binary_opening(ndi.binary_closing(BRANCO, iterations=2) & CAO, iterations=2))
SD_CAO = sdf2(CAO)
GY_CAO, GX_CAO = np.gradient(ndi.gaussian_filter(SD_CAO, 2.0))


def amostra2(F, xi, yi):
    return map_coordinates(F, [np.clip(yi, 0, Hi - 1), np.clip(xi, 0, Wi - 1)], order=1, mode="nearest")


def cor_branca(xi, yi, M=14.0):
    """Zona branca da foto. Perto do contorno (frente do peito, dorso, frente das pernas) a foto é serrilhada:
    lê M px para dentro, na direção do contorno."""
    k = np.maximum(amostra2(SD_CAO, xi, yi) + M, 0)
    gx, gy = amostra2(GX_CAO, xi, yi), amostra2(GY_CAO, xi, yi)
    n = np.maximum(np.sqrt(gx * gx + gy * gy), 1e-6)
    return amostra2(SD_BRANCO, xi - k * gx / n, yi - k * gy / n)


def inflar(sd, A, xi, yi, Y, k, p=2.0):
    """Sólido cuja vista de lado é a região `sd`: em cada corte, uma elipse de meia altura a e meia largura k·a
    em volta do eixo da região (δ = a). Mesma superfície que |Y| = k·sqrt(δ(2a - δ)), mas com um campo
    liso (sem a quina da raiz no contorno, que deixava degraus no dorso e no peito)."""
    a = amostra2(A, xi, yi)
    dl = -amostra2(sd, xi, yi)
    return (np.abs(Y / k) ** p + np.abs(a - dl) ** p) ** (1 / p) - a  # p > 2: corte mais "quadrado"


def bump(x, c, w):
    return np.exp(-(((x - c) / w) ** 2))


# ---------------------------------------------------------------- cabeça (eixos locais: u frente, v esquerda do cão, w cima)
HC = np.array([1085.0, -30.0, 647.0])  # centro do crânio
GIRO_CABECA = 43.0  # graus virados para quem olha (os dois olhos aparecem na foto)
RH = rz(-GIRO_CABECA) @ ry(4)
OLHO_R = 26.0
FOCINHO = ((86.0, 0.0, -84.0), (150.0, 0.0, -100.0), 60.0, 50.0)  # cápsula do focinho (a, b, ra, rb)
NARIZ = np.array([180.0, 0.0, -78.0])


def cabeca_base(q):
    d = elip(q, (0, 0, 0), (110, 112, 106))
    for s in (1, -1):
        d = smin(d, elip(q, (40, 62 * s, -50), (70, 56, 58)), 26)  # bochechas
    d = smin(d, elip(q, (88, 0, -92), (78, 66, 52)), 30)  # queixo
    d = smin(d, caps(q, *FOCINHO), 26)
    return d


def _olhos():
    olhos = []
    for s in (1, -1):
        dire = unit((0.72, 0.69 * s, 0.05))
        ts = np.linspace(40, 160, 1201)
        v = cabeca_base(f32(ts[:, None] * dire))
        olhos.append(ts[np.argmin(np.abs(v + OLHO_R - 11))] * dire)
    return olhos


OLHOS = _olhos()


def _sorriso():
    """Linha da boca no focinho: do meio, embaixo do nariz, para cada lado."""
    lados = []
    c = np.array([136.0, 0, -96])
    for s in (1, -1):
        pts = []
        for a, b in ((0, -1.05), (0.35, -0.95), (0.7, -0.72), (1.0, -0.42)):
            dire = unit((np.cos(a * 1.1) * 0.6, np.sin(a * 1.1) * s, b))
            ts = np.linspace(5, 120, 1151)
            v = cabeca_base(f32(c + ts[:, None] * dire))
            i = np.flatnonzero((v[:-1] < 0) & (v[1:] >= 0))[-1]
            pts.append((*(c + ts[i] * dire), 3.4))
        lados.append(pts)
    return lados


SORRISO = _sorriso()


def orelha_placa(q, base, e1, n0, comprimento, r1, r2, esp, dobra=0.0, inicio=0.0, concha=0.0):
    e1 = unit(e1)
    e3 = unit(np.asarray(n0, float) - (np.asarray(n0, float) @ e1) * e1)
    e2 = np.cross(e1, e3)
    w = q - f32(base)
    a, b, c = w @ f32(e1), w @ f32(e2), w @ f32(e3)
    c = c - dobra * np.maximum(a - inicio, 0) ** 2 - concha * b * b
    h = np.clip(a / comprimento, 0, 1)
    d2 = np.sqrt((a - h * comprimento) ** 2 + b * b) - (r1 + (r2 - r1) * h)
    dz = np.abs(c) - esp
    return np.sqrt(np.maximum(d2, 0) ** 2 + np.maximum(dz, 0) ** 2) + np.minimum(np.maximum(d2, dz), 0) - 3


ORELHAS = (  # perto: larga, caída para o lado; longe: em pé
    ((-25, -88, 62), (-0.15, -1.0, 0.3), (1.0, -0.2, 0.3), 145, 52, 22, 7, 0.0012, 60, 0.008),
    ((-14, 60, 84), (-0.8, 0.35, 1.0), (1.0, -0.2, 0.25), 78, 48, 18, 7, 0.0015, 40, 0.005),
)


def cabeca(q):
    d = cabeca_base(q)
    for lado in SORRISO:
        d = cavar(d, tubo(q, lado, 1.0), 2.0)
    for o in ORELHAS:
        d = smin(d, orelha_placa(q, *o), 14)
    preto = None
    for o in OLHOS:
        e = esfera(q, o, OLHO_R)
        d = smin(d, e, 3)
        preto = e - 1 if preto is None else np.minimum(preto, e - 1)
    nariz = elip(q, NARIZ, (27, 37, 27))
    d = smin(d, nariz, 4)
    preto = np.minimum(preto, nariz - 1)
    bege = np.maximum(elip(q, (140, 0, -96), (98, 94, 76)), -(q[:, 0] - 78))  # focinho bege
    return d, preto, bege


COXA = (428.0, 78.0, 330.0, (64.0, 50.0, 100.0))  # centro x, |y|, z e raios
PESCOCO = (np.array([980.0, -14.0, 470.0]), HC + np.array([-20.0, 0.0, -30.0]), 110.0, 100.0)


# ---------------------------------------------------------------- base e placa
BASE_X = (218.0, 1215.0)
BASE_Y = 212.0  # meia profundidade (tampo de 55 px na foto; na vista de frente a base tem ~metade da altura do cão)
BASE_H = 125.0
CANTO, BORDA = 45.0, 12.0
PLACA_X, PLACA_Z = (532.0, 950.0), (-113.0, -47.0)
PLACA_E, LETRA_E = 9.0, 6.0  # espessuras (px) da placa e das letras em relevo


def base_sdf(P):
    cx, hx = sum(BASE_X) / 2, (BASE_X[1] - BASE_X[0]) / 2
    q = np.abs(P[:, :2] - f32((cx, 0))) - f32((hx - CANTO, BASE_Y - CANTO))
    d2 = np.sqrt((np.maximum(q, 0) ** 2).sum(1)) + np.minimum(q.max(1), 0) - CANTO
    dz = np.abs(P[:, 2] + BASE_H / 2) - BASE_H / 2
    w = np.stack([d2 + BORDA, dz + BORDA], 1)
    return np.sqrt((np.maximum(w, 0) ** 2).sum(1)) + np.minimum(w.max(1), 0) - BORDA


def _letras():
    """Máscara das letras da própria referência (escuro dentro da placa), em alta resolução."""
    x0, x1, y0, y1 = 540, 945, 895, 965
    rec = im[y0:y1, x0:x1]
    escuro = (rec.max(2) < 120).astype(np.float32)
    escuro[:8], escuro[-8:], escuro[:, :20], escuro[:, -20:] = 0, 0, 0, 0  # só as letras, nada da borda
    k = 6
    grande = np.asarray(Image.fromarray((escuro * 255).astype(np.uint8)).resize(((x1 - x0) * k, (y1 - y0) * k), Image.BICUBIC)).astype(np.float32) / 255
    grande = ndi.gaussian_filter(grande, k * 0.5) > 0.5
    return sdf2(grande) / k, (x0, y0, k)


SD_LETRAS, LETRAS_REF = _letras()


def placa_sdf(P):
    cx, hx = sum(PLACA_X) / 2, (PLACA_X[1] - PLACA_X[0]) / 2
    cz, hz = sum(PLACA_Z) / 2, (PLACA_Z[1] - PLACA_Z[0]) / 2
    q = np.abs(np.stack([P[:, 0] - cx, P[:, 2] - cz], 1)) - f32((hx - 14, hz - 14))
    d2 = np.sqrt((np.maximum(q, 0) ** 2).sum(1)) + np.minimum(q.max(1), 0) - 14
    dy = np.abs(P[:, 1] + BASE_Y + PLACA_E / 2) - PLACA_E / 2
    return np.maximum(d2, dy)


def letras_sdf(P):
    x0, y0, k = LETRAS_REF
    yi = 850.0 - P[:, 2] * np.cos(ELEV)  # face da frente: z da peça -> linha da imagem
    s2 = map_coordinates(SD_LETRAS, [np.clip((yi - y0) * k, 0, SD_LETRAS.shape[0] - 1), np.clip((P[:, 0] - x0) * k, 0, SD_LETRAS.shape[1] - 1)], order=1, mode="nearest")
    y_ini = -BASE_Y - PLACA_E
    dy = np.abs(P[:, 1] - (y_ini - LETRA_E / 2)) - LETRA_E / 2
    caixa = np.maximum(np.abs(P[:, 0] - sum(PLACA_X) / 2) - (PLACA_X[1] - PLACA_X[0]) / 2, np.abs(P[:, 2] - sum(PLACA_Z) / 2) - (PLACA_Z[1] - PLACA_Z[0]) / 2)
    return np.maximum(np.maximum(s2, dy), caixa)


# ---------------------------------------------------------------- cena
K_TRONCO, K_RABO, K_PERNA = 0.84, 1.5, 1.0  # largura/altura (vistas de frente e de cima)
P_TRONCO = 2.4  # dorso largo em cima, como na vista traseira


def cachorro(P):
    """Distância do cachorro e zonas (branca, preta, bege) em P (N, 3), unidades da referência."""
    X, Y, Z = P[:, 0], P[:, 1], P[:, 2]
    ce = np.cos(ELEV)
    yi = Y0 - Z * ce
    d = inflar(SD_TRONCO, R_TRONCO, X, yi, Y, K_TRONCO, P_TRONCO)
    d = smin(d, inflar(SD_RABO, R_RABO, X, yi, Y, K_RABO), 10)
    # cor: branco da imagem (o lado de longe repete o de perto); cada perna usa a própria linha da imagem
    linha = Y0 - (Z * ce - np.abs(Y) * np.sin(ELEV))
    melhor = d.copy()
    for sd, R, sola, yc, alt in SD_PERNAS.values():
        yl = sola - Z * ce
        t = np.clip((Z * ce - alt + 40) / 130, 0, 1)  # chegando no corpo a perna vai para o meio
        perna = inflar(sd, R, X, yl, Y - yc * (1 - 0.45 * t * t * (3 - 2 * t)), K_PERNA)
        linha = np.where(perna < melhor, np.where(Z * ce < 130, yl, -999.0), linha)  # perna: branco só na pata
        melhor = np.minimum(melhor, perna)
        d = smin(d, perna, 22)
    for lado in (-1, 1):  # coxas (vista traseira: o quadril é a parte mais larga)
        d = smin(d, elip(P, (COXA[0], lado * COXA[1], COXA[2]), COXA[3]), 30)
    d = smin(d, caps(P, *PESCOCO), 34)
    q = (P - f32(HC)) @ f32(RH)
    dc, preto, bege = cabeca(q)
    d = smin(d, dc, 26)
    zw = np.where(linha < -500, 9.0, cor_branca(X, np.maximum(linha, 0)))
    na_cabeca = dc < d + 6
    garganta = (q[:, 2] < -78) & (q[:, 0] < 60)  # embaixo do queixo a gola branca continua
    zw = np.where(na_cabeca & (q[:, 0] > -40) & ~garganta, 9.0, zw)  # cabeça e focinho não pegam o branco do peito
    d = np.maximum(d, -Z)  # sola reta no tampo da base
    return d, zw, preto, np.where(na_cabeca, bege, 9.0)


def cena_toda(P):
    d, zw, zb, zbe = cachorro(P)
    base = base_sdf(P)
    placa = placa_sdf(P)
    letras = letras_sdf(P)
    tudo = np.minimum(np.minimum(d, base), np.minimum(placa, letras))
    qual = np.argmin(np.stack([d, base, placa, letras]), 0)  # 0 cachorro, 1 base, 2 placa, 3 letras
    cao = qual == 0
    branco = np.where(cao, zw, 9.0)
    preto = np.where(cao, zb, np.where(qual == 2, 9.0, -9.0))
    bege = np.where(cao, zbe, np.where(qual == 2, -9.0, 9.0))
    return tudo, branco, preto, bege


def grade(h, cena_fn, lo, hi):
    n = np.ceil((hi - lo) / h).astype(int) + 1
    xs, ys, zs = (lo[i] + h * np.arange(n[i]) for i in range(3))
    saida = None
    Y_, Z_ = np.meshgrid(ys, zs, indexing="ij")
    yz = np.stack([Y_.ravel(), Z_.ravel()], 1)
    passo = max(1, int(500_000 // len(yz)))
    for i in range(0, n[0], passo):
        bloco = xs[i : i + passo]
        P = np.empty((len(bloco) * len(yz), 3), np.float32)
        P[:, 0] = np.repeat(bloco, len(yz))
        P[:, 1:] = np.tile(yz, (len(bloco), 1))
        res = cena_fn(P)
        if saida is None:
            saida = [np.empty(n, np.float32) for _ in res]
        for a, r in zip(saida, res):
            a[i : i + passo] = r.reshape(len(bloco), n[1], n[2])
    return saida, lo.astype(float)


LO = np.array([200.0, -BASE_Y - 30, -BASE_H - 6])
HI = np.array([1275.0, BASE_Y + 12, 850.0])


CORES_R = {"caramelo": (160, 88, 38), "branco": (232, 224, 214), "preto": (30, 30, 30), "bege": (222, 184, 142)}


CENTRO_V = np.array([737.0, 0.0, 300.0 + BASE_H])  # centro do conjunto (com o chão do render no fundo da base)


def _cam_ref():
    dist = 20000.0
    alvo = np.array([737.0, 0.0, (Y0 - Hi / 2) / np.cos(ELEV) + BASE_H])
    dire = np.array([0, -np.cos(ELEV), np.sin(ELEV)])
    return alvo + dist * dire, alvo, 2 * np.degrees(np.arctan((Hi / 2) / dist))


def redistancia(G, h):
    """Campo só para desenhar: perto da superfície, G dividido pelo gradiente; longe, distância real (EDT)."""
    gx, gy, gz = np.gradient(G, h)
    Gn = G / np.maximum(np.sqrt(gx * gx + gy * gy + gz * gz), 0.25)
    longe = np.where(G >= 0, ndi.distance_transform_edt(G >= 0) * h - 0.6 * h, -(ndi.distance_transform_edt(G < 0) * h - 0.6 * h))
    return np.where(np.abs(Gn) < 1.5 * h, Gn, longe).astype(np.float32)


def folha(grades, o, h, destino):
    """Em cima: referência e modelo no mesmo enquadramento. Embaixo: frente, de cima e 3/4 de trás."""
    o = o + np.array([0, 0, BASE_H])
    grades = (ndi.gaussian_filter(redistancia(grades[0], h), 0.8), *grades[1:])
    olho, alvo, fov = _cam_ref()
    W, Ht = 768, 512
    img = Image.new("RGB", (W * 2 + 10, Ht + 344), "white")
    img.paste(Image.open(REF).convert("RGB").resize((W, Ht)), (0, 0))
    img.paste(Image.fromarray(g.render(grades, o, h, olho, alvo, W, Ht, fov=fov, cores=CORES_R)), (W + 10, 0))
    vistas = [
        (CENTRO_V + 2600 * unit((1.0, -0.05, 0.12)), 34),
        (CENTRO_V + 2600 * unit((0.001, -0.02, 1.0)), 30),
        (CENTRO_V + 2600 * unit((-0.75, -0.6, 0.35)), 32),
    ]
    for i, (ol, fv) in enumerate(vistas):
        img.paste(Image.fromarray(g.render(grades, o, h, ol, CENTRO_V, 512, 340, fov=fv, cores=CORES_R)), (i * 515, Ht + 4))
    img.save(destino)


VISTAS = (  # (nome, direção da câmera a partir do centro, fov) — as mesmas da folha de vistas da referência
    ("FRENTE", (1.0, -0.02, 0.16), 20.0),
    ("LATERAL DIREITA", (0.0, -1.0, 0.14), 20.0),
    ("LATERAL ESQUERDA", (0.0, 1.0, 0.14), 20.0),
    ("TRASEIRA", (-1.0, 0.02, 0.16), 20.0),
    ("SUPERIOR", (0.001, -0.02, 1.0), 15.5),
    ("PERSPECTIVA 3/4", (0.45, -0.85, 0.32), 20.0),
)


def folha_vistas(grades, o, h, destino, W=512, Ht=340):
    from PIL import ImageDraw, ImageFont

    o = o + np.array([0, 0, BASE_H])
    grades = (ndi.gaussian_filter(redistancia(grades[0], h), 0.8), *grades[1:])
    centro = np.array([737.0, 0.0, 470.0])
    img = Image.new("RGB", (W * 3, (Ht + 34) * 2), (226, 225, 228))
    try:
        fonte = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 17)
    except OSError:
        fonte = ImageFont.load_default()
    dr = ImageDraw.Draw(img)
    for i, (nome, dire, fov) in enumerate(VISTAS):
        x, y = (i % 3) * W, (i // 3) * (Ht + 34)
        olho = centro + 3000 * unit(dire)
        g.LUZ = unit(0.55 * unit(dire) + np.array([0.3, 0.0, 0.0]) * np.sign(dire[1] or 1) + np.array([0, 0, 0.75]))
        img.paste(Image.fromarray(g.render(grades, o, h, olho, centro, W, Ht, fov=fov, cores=CORES_R)), (x, y))
        dr.text((x + W / 2, y + Ht + 17), nome, fill=(60, 60, 64), font=fonte, anchor="mm")
    img.save(destino)


# ---------------------------------------------------------------- arquivos para imprimir
CORES_3MF = (("1-marrom", (184, 104, 48)), ("2-branco", (244, 241, 234)), ("3-preto", (30, 28, 28)), ("4-bege", (226, 190, 150)))


def gravar_3mf_partes(caminho, partes, nome="Cachorro em pé"):
    """Um objeto montado com uma parte por cor (núcleo do 3MF: tudo num arquivo só) e, para o Bambu Studio /
    Orca / Anycubic Slicer Next, o filamento de cada parte (1, 2, 3, 4) em Metadata/model_settings.config.
    Sem configuração de impressora nem de AMS."""
    import zipfile

    n = len(partes) + 1
    x = ['<?xml version="1.0" encoding="UTF-8"?>\n<model unit="millimeter" xml:lang="pt-BR" '
         'xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02">\n',
         f' <metadata name="Title">{nome}</metadata>\n <resources>\n  <basematerials id="{n + 1}">\n']
    x += ['   <base name="%s" displaycolor="#%02X%02X%02XFF"/>\n' % (pnome, *cor) for pnome, cor, _, _ in partes]
    x.append("  </basematerials>\n")
    for i, (pnome, _, v, f) in enumerate(partes, 1):
        x.append(f'  <object id="{i}" name="{pnome}" type="model" pid="{n + 1}" pindex="{i - 1}">\n   <mesh>\n    <vertices>\n')
        x.append("".join('     <vertex x="%.4f" y="%.4f" z="%.4f"/>\n' % tuple(p) for p in v))
        x.append("    </vertices>\n    <triangles>\n")
        x.append("".join('     <triangle v1="%d" v2="%d" v3="%d"/>\n' % tuple(t) for t in f))
        x.append("    </triangles>\n   </mesh>\n  </object>\n")
    x.append(f'  <object id="{n}" name="{nome}" type="model">\n   <components>\n')
    x += [f'    <component objectid="{i}"/>\n' for i in range(1, n)]
    x.append(f'   </components>\n  </object>\n </resources>\n <build>\n  <item objectid="{n}" transform="1 0 0 0 1 0 0 0 1 128 128 0"/>\n </build>\n</model>\n')
    cfg = ['<?xml version="1.0" encoding="UTF-8"?>\n<config>\n', f'  <object id="{n}">\n',
           f'    <metadata key="name" value="{nome}"/>\n    <metadata key="extruder" value="1"/>\n']
    for i, (pnome, _, _, f) in enumerate(partes, 1):
        cfg.append(f'    <part id="{i}" subtype="normal_part">\n      <metadata key="name" value="{pnome}"/>\n'
                   '      <metadata key="matrix" value="1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1"/>\n'
                   f'      <metadata key="extruder" value="{i}"/>\n    </part>\n')
    cfg.append("  </object>\n</config>\n")
    tipos = ('<?xml version="1.0" encoding="UTF-8"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">\n'
             ' <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>\n'
             ' <Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/>\n</Types>\n')
    rel = ('<?xml version="1.0" encoding="UTF-8"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\n'
           ' <Relationship Target="/3D/3dmodel.model" Id="rel-1" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/>\n</Relationships>\n')
    with zipfile.ZipFile(caminho, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as z:
        z.writestr("[Content_Types].xml", tipos)
        z.writestr("_rels/.rels", rel)
        z.writestr("3D/3dmodel.model", "".join(x))
        z.writestr("Metadata/model_settings.config", "".join(cfg))


def _malha(F, o, h, escala, desloc, vol_min=30.0):
    v, f = g.malha(F, o, h)
    v = (v - desloc) * escala
    return g.limpar(v, f, vol_min)[:2]


def _reduzir(v, f, fracao):
    """Menos triângulos (superfície lisa); só aceita se a malha continuar fechada."""
    import fast_simplification
    import trimesh

    v2, f2 = fast_simplification.simplify(v.astype(np.float32), f.astype(np.int32), target_reduction=1 - fracao, agg=3)
    m = trimesh.Trimesh(v2, f2, process=True, validate=True)
    if m.is_watertight and m.is_winding_consistent and m.volume > 0:
        return np.asarray(m.vertices, float), np.asarray(m.faces)
    return v, f


def exportar(h):
    import trimesh

    t0 = time.time()
    # cachorro: 4 cores na mesma grade (as divisas entre as cores coincidem)
    lo, hi = np.array([200.0, -BASE_Y - 40, -6.0]), np.array([1280.0, BASE_Y + 12, 860.0])
    (D, ZW, ZB, ZBE), o = grade(h, cachorro, lo, hi)
    topo = o[2] + h * np.flatnonzero((D < 0).any((0, 1))).max()
    escala = ALTURA_MM / (topo + BASE_H)
    desloc = np.array([sum(BASE_X) / 2, 0.0, -BASE_H])
    print(f"grade do cachorro {D.shape} ({time.time() - t0:.0f} s); escala {escala:.4f} mm/px")
    campos = {
        "1-marrom": np.maximum(D, np.maximum(-ZBE, np.maximum(-ZW, -ZB))),
        "2-branco": np.maximum(D, np.maximum(ZW, -ZB)),
        "3-preto": np.maximum(D, ZB),
        "4-bege": np.maximum(D, np.maximum(ZBE, np.maximum(-ZW, -ZB))),
    }
    malhas = {k: [_malha(F, o, h, escala, desloc)] for k, F in campos.items()}
    # base, placa e letras: grades próprias, mais finas (letras nítidas)
    def peca(fn, lo, hi, hh):
        n = np.ceil((np.array(hi) - lo) / hh).astype(int) + 1
        xs, ys, zs = (lo[i] + hh * np.arange(n[i]) for i in range(3))
        P = np.stack(np.meshgrid(xs, ys, zs, indexing="ij"), -1).reshape(-1, 3).astype(np.float32)
        F = np.concatenate([fn(P[i : i + 2_000_000]) for i in range(0, len(P), 2_000_000)]).reshape(n)
        return _malha(F, np.array(lo, float), hh, escala, desloc, vol_min=0.05)
    malhas["3-preto"].append(peca(base_sdf, (BASE_X[0] - 6, -BASE_Y - 6, -BASE_H - 6), (BASE_X[1] + 6, BASE_Y + 6, 6), h))
    py0 = -BASE_Y - PLACA_E - LETRA_E - 3
    malhas["4-bege"].append(peca(placa_sdf, (PLACA_X[0] - 3, py0, PLACA_Z[0] - 3), (PLACA_X[1] + 3, -BASE_Y + 2, PLACA_Z[1] + 3), 1.0))
    malhas["3-preto"].append(peca(letras_sdf, (PLACA_X[0], py0, PLACA_Z[0]), (PLACA_X[1], -BASE_Y - PLACA_E + 2, PLACA_Z[1]), 0.6))
    print(f"malhas em {time.time() - t0:.0f} s")
    partes, todas = [], []
    for nome, cor in CORES_3MF:
        vs, fs, base_i = [], [], 0
        for v, f in malhas[nome]:
            vs.append(v)
            fs.append(f + base_i)
            base_i += len(v)
        v, f = np.concatenate(vs), np.concatenate(fs)
        v, f = _reduzir(v, f, 0.35)
        m = trimesh.Trimesh(v, f, process=False)
        print(f"  {nome}: {len(f)} triângulos, fechada={m.is_watertight}, volume={m.volume / 1000:.2f} cm³, "
              f"{len(m.split(only_watertight=False))} pedaço(s), tamanho {np.round(m.extents, 1)} mm")
        partes.append((nome, cor, v, f))
        todas.append(m)
    gravar_3mf_partes(g.SAIDA / "cachorro-em-pe-4-cores.3mf", partes)
    np.savez_compressed(g.SAIDA / "em-pe-partes.npz", **{f"v{i}": p[2] for i, p in enumerate(partes)}, **{f"f{i}": p[3] for i, p in enumerate(partes)})
    junto = trimesh.util.concatenate(todas)
    print(f"  conjunto: {np.round(junto.extents, 1)} mm (x, y, z)")
    # uma cor só: tudo num campo (letras em relevo na mesma cor)
    def tudo(P):
        return np.minimum(np.minimum(cachorro(P)[0], base_sdf(P)), np.minimum(placa_sdf(P), letras_sdf(P)))
    (U,), o2 = grade(h, lambda P: (tudo(P),), np.array([200.0, -BASE_Y - 40, -BASE_H - 6]), hi)
    v, f = _malha(U, o2, h, escala, desloc)
    v, f = _reduzir(v, f, 0.45)
    g.conferir("uma cor", v, f)
    g.gravar_stl(g.SAIDA / "cachorro-em-pe.stl", v, f)
    print(f"arquivos em {time.time() - t0:.0f} s")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--previa", action="store_true")
    ap.add_argument("--voxel", type=float, default=None)
    a = ap.parse_args()
    h = a.voxel or (6.0 if a.previa else 3.0)
    t0 = time.time()
    g.LUZ = unit((0.35, -0.75, 0.55))
    g.CHAO_CENTRO = np.array([737.0, 0.0])
    grades, o = grade(h, cena_toda, LO, HI)
    print(f"grade {grades[0].shape} de {h} px em {time.time() - t0:.0f} s")
    g.SAIDA.mkdir(exist_ok=True)
    folha(grades, o, h, g.SAIDA / "em-pe-comparacao.png")
    folha_vistas(grades, o, h, g.SAIDA / "em-pe-vistas.png")
    print(f"imagens em {time.time() - t0:.0f} s")
    if not a.previa:
        del grades
        exportar(h)


if __name__ == "__main__":
    main()

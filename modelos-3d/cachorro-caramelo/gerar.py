#!/usr/bin/env python3
"""Cachorro caramelo deitado, olhando para cima: escultura feita por código (campos de distância)
e exportada como malha fechada para impressão 3D.

  python3 gerar.py --previa      folha de vistas rápida (grade de 1 mm), sem exportar
  python3 gerar.py               modelo final: STL (uma cor), 3MF (3 cores) e imagem de apresentação

Precisa de numpy, scipy, scikit-image, trimesh e pillow.
"""
import argparse
import struct
import time
import zipfile
from pathlib import Path

import numpy as np
from scipy.ndimage import map_coordinates

AQUI = Path(__file__).resolve().parent
SAIDA = AQUI / "saida"
COMPRIMENTO = 150.0  # mm, do rabo à ponta da pata da frente
CORES = {"caramelo": (205, 134, 62), "branco": (246, 243, 236), "preto": (36, 32, 31), "bege": (226, 190, 150)}


# ---------------------------------------------------------------- primitivas
def unit(v):
    v = np.asarray(v, float)
    return v / np.linalg.norm(v)


def rz(g):
    c, s = np.cos(np.radians(g)), np.sin(np.radians(g))
    return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]])


def ry(g):
    c, s = np.cos(np.radians(g)), np.sin(np.radians(g))
    return np.array([[c, 0, s], [0, 1, 0], [-s, 0, c]])


def rx(g):
    c, s = np.cos(np.radians(g)), np.sin(np.radians(g))
    return np.array([[1, 0, 0], [0, c, -s], [0, s, c]])


def f32(a):
    return np.asarray(a, np.float32)


def elip(P, c, r, R=None):
    q = P - f32(c)
    if R is not None:
        q = q @ f32(R)
    r = f32(r)
    k0 = np.sqrt(((q / r) ** 2).sum(1))
    k1 = np.sqrt(((q / (r * r)) ** 2).sum(1))
    return np.where(k1 > 1e-6, k0 * (k0 - 1) / np.maximum(k1, 1e-6), -r.min())


def esfera(P, c, r):
    return np.sqrt(((P - f32(c)) ** 2).sum(1)) - r


def caps(P, a, b, ra, rb=None):
    a, b = f32(a), f32(b)
    rb = ra if rb is None else rb
    pa, ba = P - a, b - a
    h = np.clip(pa @ ba / (ba @ ba), 0, 1)
    return np.sqrt(((pa - h[:, None] * ba) ** 2).sum(1)) - (ra + (rb - ra) * h)


def smin(a, b, k):
    h = np.clip(0.5 + 0.5 * (b - a) / k, 0, 1)
    return b + (a - b) * h - k * h * (1 - h)


def apoiada(P, a, b, ra, rb):
    a, b = f32(a), f32(b)
    pa, ba = P[:, :2] - a[:2], b[:2] - a[:2]
    h = np.clip(pa @ ba / (ba @ ba), 0, 1)
    lado = np.sqrt(((pa - h[:, None] * ba) ** 2).sum(1)) - 0.92 * (ra + (rb - ra) * h)
    return np.minimum(caps(P, a, b, ra, rb), np.maximum(lado, P[:, 2] - (a[2] + h * (b[2] - a[2]))))


def cavar(d, g, k=0.5):
    return -smin(-d, g, k)


def tubo(P, pontos, k=1.5):
    d = None
    for p0, p1 in zip(pontos[:-1], pontos[1:]):
        c = caps(P, p0[:3], p1[:3], p0[3], p1[3])
        d = c if d is None else smin(d, c, k)
    return d


# ---------------------------------------------------------------- pose
# Espaço do modelo: corpo ao longo de X (cabeça em +X), pernas para +Y, chão em z = 0.
# No fim o Y é espelhado, para a cabeça ficar à direita de quem olha de frente, como na foto.
H = np.array([39.0, 14.0, 61.0])  # centro da cabeça
RH = rz(76) @ ry(-22) @ rx(4)  # virada para quem olha, focinho para cima, levemente inclinada


def loc(p):
    return H + RH @ np.asarray(p, float)


PESCOCO = (np.array([27.0, 2.0, 28.0]), loc((-8, 0, -9)))
GARGANTA = (np.array([37.0, 8.0, 25.0]), loc((9, 0, -13)))
PATAS = {
    "frente_perto": ((59, 29, 4.1), 15.7, (10.5, 7.6, 6.0)),
    "frente_longe": ((67, -9, 4.1), 9.5, (10.5, 7.6, 6.0)),
    "tras_cima": ((-7, 58.5, 4.1), 65.0, (10.5, 7.6, 6.0)),
    "tras_baixo": ((-1, 30.5, 4.1), 14.0, (9.5, 7.0, 5.6)),
}
OLHO_R = 3.7


def pata(P, c, ang, r):
    R = rz(ang)
    d = elip(P, c, r, R)
    q = (P - f32(c)) @ f32(R)  # a: para a frente da pata, b: de lado, z: para cima
    for b in (-2.3, 2.3):
        pts = []
        for fa in (0.30, 0.60, 0.82, 0.93):
            a = r[0] * fa
            z = r[2] * np.sqrt(max(1 - fa * fa - (b / r[1]) ** 2, 0.0))
            pts.append((a, b, z, 0.8))
        pts.append((r[0] * 0.95, b, -r[2], 0.8))
        d = cavar(d, tubo(q, pts, 0.3), 0.5)
    return d


def cabeca_base(q):
    d = elip(q, (0, 0, 0), (17, 16, 15))
    d = smin(d, elip(q, (5, 0, -7), (14, 14, 9)), 5)
    d = smin(d, caps(q, (10, 0, -4.0), (25, 0, -5.5), 10.0, 7.6), 6)
    d = smin(d, caps(q, (24, 0, -7.5), (8, 0, -12), 6.0, 10.0), 4)  # queixo e papada
    return d


def _olhos():
    """Centro dos olhos: na superfície da cabeça, com 1,15 mm para fora."""
    dire = unit((13.0, 7.8, 5.2))
    ts = np.linspace(8, 24, 321)
    v = cabeca_base(f32(ts[:, None] * dire))
    c = ts[np.argmin(np.abs(v + (OLHO_R - 1.3)))] * dire
    return c, c * np.array([1, -1, 1])


OLHOS = _olhos()


def _boca():
    """Linha do lábio (um sorriso leve): pontos na superfície do focinho, de baixo do nariz até a bochecha."""
    centro = np.array([22.0, 0.0, -6.0])
    lados = []
    for s in (1, -1):
        pts = []
        for az, baixo in ((0, 30), (25, 31), (50, 31), (75, 28), (100, 21), (120, 11)):
            a, b = np.radians(az), np.radians(baixo)
            dire = np.array([np.cos(a) * np.cos(b), s * np.sin(a) * np.cos(b), -np.sin(b)])
            ts = np.linspace(2, 30, 561)
            v = cabeca_base(f32(centro + ts[:, None] * dire))
            i = np.flatnonzero((v[:-1] < 0) & (v[1:] >= 0))[-1]
            pts.append((*(centro + ts[i] * dire), 0.9))
        lados.append(pts)
    return lados


BOCA = _boca()
ORELHA_DIR = np.array([0.05, 0.64, 0.77])


def orelha(q, s, comprimento=15.0, r1=7.6, r2=3.4, esp=1.1, arred=0.6, dobra=0.08, concha=0.02):
    base = np.array([-5.0, 6.5 * s, 8.5])
    e1 = unit(ORELHA_DIR * np.array([1, s, 1]))
    n0 = np.array([0.80, 0.45 * s, 0.0])
    e3 = unit(n0 - (n0 @ e1) * e1)
    e2 = np.cross(e1, e3)
    w = q - f32(base)
    a, b, c = w @ f32(e1), w @ f32(e2), w @ f32(e3)
    c = c - dobra * np.maximum(a - 7.5, 0) ** 2 - concha * b * b
    h = np.clip(a / comprimento, 0, 1)
    d2 = np.sqrt((a - h * comprimento) ** 2 + b * b) - (r1 + (r2 - r1) * h)
    dz = np.abs(c) - esp
    return np.sqrt(np.maximum(d2, 0) ** 2 + np.maximum(dz, 0) ** 2) + np.minimum(np.maximum(d2, dz), 0) - arred


def cabeca(q):
    d = cabeca_base(q)
    for lado in BOCA:
        d = cavar(d, tubo(q, lado, 0.3), 0.4)
    preto = None
    for s, olho in zip((1, -1), OLHOS):
        d = smin(d, elip(q, olho + np.array([-1.5, 0, 6.5]), (3.8, 5.0, 2.0), rx(-18 * s)), 2.5)  # sobrancelha caída: olhar manso
        d = smin(d, orelha(q, s), 3.5)
        o = esfera(q, olho, OLHO_R)
        d = smin(d, o, 0.5)
        preto = o - 0.3 if preto is None else np.minimum(preto, o - 0.3)
    d = smin(d, elip(q, (30.6, 0, -3.6), (4.0, 5.0, 3.7)), 0.8)  # nariz
    preto = np.minimum(preto, elip(q, (30.6, 0, -3.6), (4.35, 5.35, 4.05)))
    branco = elip(q, (22, 0, -12), (15.5, 12, 9))  # queixo e lábios
    return d, preto, branco


def cena(Pw):
    """Distância com sinal do cachorro e das zonas branca e preta nos pontos Pw (N, 3), em mm."""
    P = Pw.astype(np.float32, copy=True)
    P[:, 1] *= -1
    # tronco
    d = elip(P, (-34, -2, 13), (24, 23, 20))
    d = smin(d, elip(P, (-6, 0, 15), (30, 24, 22)), 10)
    d = smin(d, elip(P, (23, 1, 17), (22, 22, 24)), 10)
    d = smin(d, elip(P, (-8, 10, 11), (24, 19, 15)), 8)
    d = smin(d, elip(P, (22, 16, 12), (13, 10, 13)), 6)
    d = smin(d, elip(P, (26, -15, 12), (13, 10, 13)), 6)
    # pernas da frente
    d = smin(d, caps(P, (24, 19, 5.6), (52, 27, 4.6), 8.3, 6.6), 5)
    d = smin(d, pata(P, *PATAS["frente_perto"]), 2.5)
    d = smin(d, caps(P, (30, -15, 5.6), (60, -10, 4.6), 8.3, 6.6), 5)
    d = smin(d, pata(P, *PATAS["frente_longe"]), 2.5)
    # perna de trás que fica por baixo: só o fim aparece, junto da barriga
    d = smin(d, caps(P, (-36, 17, 6), (-10, 28, 5), 8.0, 6.2), 2.5)
    d = smin(d, pata(P, *PATAS["tras_baixo"]), 2.5)
    # perna de trás de cima, estendida para o lado
    d = smin(d, caps(P, (-38, 7, 22), (-18, 26, 11.5), 16, 10), 7)
    canela = smin(apoiada(P, (-18, 26, 11.5), (-15, 43, 4.2), 9.0, 6.4), apoiada(P, (-15, 43, 4.2), (-10, 52, 4.2), 6.4, 6.0), 3)
    d = smin(d, canela, 3)
    d = smin(d, pata(P, *PATAS["tras_cima"]), 2.5)
    # rabo, enrolado pelo chão
    rabo = [(-54, -8, 9, 7.5), (-67, -6, 5.0, 6.8), (-77, 4, 4.3, 6.0), (-79, 18, 3.8, 5.4), (-71, 30, 3.4, 4.8), (-59, 36, 3.0, 4.2)]
    dr = None
    for p0, p1 in zip(rabo[:-1], rabo[1:]):
        seg = apoiada(P, p0[:3], p1[:3], p0[3], p1[3])
        dr = seg if dr is None else smin(dr, seg, 2)
    d = smin(d, dr, 4)
    # pescoço, garganta e cabeça
    d = smin(d, caps(P, PESCOCO[0], PESCOCO[1], 17, 14), 9)
    d = smin(d, caps(P, GARGANTA[0], GARGANTA[1], 11, 9), 7)
    dc, preto, branco_c = cabeca((P - f32(H)) @ f32(RH))
    d = smin(d, dc, 6)

    # zonas de cor
    zw = branco_c
    for c, ang, _ in PATAS.values():
        zw = np.minimum(zw, esfera(P, np.array(c) + rz(ang) @ np.array([2.0, 0, 0]), 12.5))
    eixo = unit(PESCOCO[1] - PESCOCO[0])
    w = P - f32(PESCOCO[0] + 0.62 * (PESCOCO[1] - PESCOCO[0]))
    zw = np.minimum(zw, np.maximum(np.abs(w @ f32(eixo)) - 6.5, np.sqrt((w**2).sum(1)) - 27))  # colar
    zw = np.minimum(zw, caps(P, GARGANTA[0], loc((14, 0, -12)), 12.5, 11.5))
    zw = np.minimum(zw, elip(P, (40, 7, 27), (10, 14, 13)))  # peitilho

    d = np.maximum(d, -Pw[:, 2].astype(np.float32))  # base plana no chão
    return d, zw, preto


# ---------------------------------------------------------------- grade
LIMITES = (np.array([-90.0, -76.0, -1.37]), np.array([88.0, 30.0, 102.0]))  # já com o Y espelhado; z = 0 cai entre dois planos


def grade(h, cena_fn=None, limites=None):
    cena_fn = cena_fn or cena
    lo, hi = limites or LIMITES
    n = np.ceil((hi - lo) / h).astype(int) + 1
    xs, ys, zs = (lo[i] + h * np.arange(n[i]) for i in range(3))
    G = np.empty(n, np.float32)
    ZW = np.empty(n, np.float32)
    ZB = np.empty(n, np.float32)
    Y, Z = np.meshgrid(ys, zs, indexing="ij")
    yz = np.stack([Y.ravel(), Z.ravel()], 1)
    passo = max(1, int(600_000 // len(yz)))
    for i in range(0, n[0], passo):
        bloco = xs[i : i + passo]
        P = np.empty((len(bloco) * len(yz), 3), np.float32)
        P[:, 0] = np.repeat(bloco, len(yz))
        P[:, 1:] = np.tile(yz, (len(bloco), 1))
        d, zw, zb = cena_fn(P)
        forma = (len(bloco), n[1], n[2])
        G[i : i + passo], ZW[i : i + passo], ZB[i : i + passo] = d.reshape(forma), zw.reshape(forma), zb.reshape(forma)
    return G, ZW, ZB, lo.copy()


def amostra(G, o, h, p):
    c = (p - o) / h
    cc = np.clip(c, 0, np.array(G.shape) - 1)
    fora = np.sqrt(((c - cc) ** 2).sum(1)) * h
    return map_coordinates(G, cc.T, order=1, mode="nearest") + fora


# ---------------------------------------------------------------- imagem (traçado de raios na grade)
LUZ = unit((-0.40, -0.55, 0.73))
CHAO_CENTRO = np.array([0.0, -20.0])  # centro da mancha de chão na imagem


def _sombra(G, o, h, p):
    """Sombra suave na direção da luz (passos curtos: sem faixas na penumbra)."""
    res = np.ones(len(p))
    t = np.full(len(p), 0.9)
    for _ in range(90):
        d = amostra(G, o, h, p + LUZ * t[:, None])
        res = np.minimum(res, 9 * d / t)
        t += np.clip(0.5 * d, 0.3, 2.5)
    res = np.clip(res, 0, 1)
    return res * res * (3 - 2 * res)


def render(grades, o, h, olho, alvo, W=420, Ht=330, fov=28.0, cores=None):
    """grades: (G, ZW, ZB) ou (G, ZW, ZB, ZBE): sólido e zonas branca, preta e bege (negativo = dentro)."""
    G, ZW, ZB = grades[:3]
    ZBE = grades[3] if len(grades) > 3 else None
    cores = cores or CORES
    olho, alvo = np.asarray(olho, float), np.asarray(alvo, float)
    f = unit(alvo - olho)
    r = unit(np.cross(f, [0, 0, 1]))
    u = np.cross(r, f)
    t = np.tan(np.radians(fov) / 2)
    X, Y = np.meshgrid(((np.arange(W) + 0.5) / W * 2 - 1) * t * W / Ht, (1 - (np.arange(Ht) + 0.5) / Ht * 2) * t)
    D = f + X[..., None] * r + Y[..., None] * u
    D = (D / np.linalg.norm(D, axis=2, keepdims=True)).reshape(-1, 3)
    n = len(D)
    lo, hi = o, o + (np.array(G.shape) - 1) * h
    with np.errstate(divide="ignore", invalid="ignore"):
        t1, t2 = (lo - olho) / D, (hi - olho) / D
    tn, tf = np.minimum(t1, t2).max(1), np.maximum(t1, t2).min(1)
    ativo = tf > np.maximum(tn, 0)
    tt = np.where(ativo, np.maximum(tn, 0) + 1e-3, np.inf)
    acerto = np.zeros(n, bool)
    for _ in range(160):
        idx = np.flatnonzero(ativo)
        if not len(idx):
            break
        d = amostra(G, o, h, olho + D[idx] * tt[idx, None])
        ok = d < 0.06
        acerto[idx[ok]] = True
        tt[idx[~ok]] += np.maximum(d[~ok] * 0.85, 0.12)
        ativo[idx[ok | (tt[idx] > tf[idx])]] = False

    cor = np.empty((n, 3))
    cor[:] = np.linspace(1, 0, Ht).repeat(W)[:, None] * np.array([10, 9, 7]) + np.array([232, 231, 229])  # fundo
    # chão
    with np.errstate(divide="ignore", invalid="ignore"):
        tg = -olho[2] / D[:, 2]
    chao = ~acerto & (D[:, 2] < 0) & (tg > 0)
    if chao.any():
        pg = olho + D[chao] * tg[chao, None]
        s = _sombra(G, o, h, pg + np.array([0, 0, 0.3]))
        ao = 0.5 + 0.5 * np.clip(amostra(G, o, h, pg + np.array([0, 0, 3.0])) / 3.0, 0, 1)
        dist = np.sqrt(((pg[:, :2] - CHAO_CENTRO) ** 2).sum(1))
        base = np.array([226, 223, 218]) * (0.62 + 0.38 * s)[:, None] * ao[:, None]
        k = np.clip((dist - 150) / 160, 0, 1)[:, None]
        cor[chao] = base * (1 - k) + cor[chao] * k
    # cachorro
    idx = np.flatnonzero(acerto)
    if len(idx):
        p = olho + D[idx] * tt[idx, None]
        e = 0.7
        nrm = np.stack([amostra(G, o, h, p + dv) - amostra(G, o, h, p - dv) for dv in np.eye(3) * e], 1)
        nrm /= np.maximum(np.linalg.norm(nrm, axis=1, keepdims=True), 1e-9)
        alb = np.empty((len(idx), 3))
        alb[:] = cores["caramelo"]
        if ZBE is not None:
            alb[amostra(ZBE, o, h, p) < 0] = cores["bege"]
        alb[amostra(ZW, o, h, p) < 0] = cores["branco"]
        alb[amostra(ZB, o, h, p) < 0] = cores["preto"]
        ao = 1 - 0.85 * np.mean([np.clip((hh - amostra(G, o, h, p + nrm * hh)) / hh, 0, 1) for hh in (1.5, 4.0, 8.0)], 0)
        s = _sombra(G, o, h, p + nrm * 0.7)
        dif = np.clip(nrm @ LUZ, 0, 1) * s
        hv = unit(LUZ - f)
        spec = np.clip(nrm @ hv, 0, 1) ** 30 * s
        luz = 0.46 * (0.62 + 0.38 * nrm[:, 2]) * ao + 0.74 * dif
        escuro = (alb < 70).all(1)  # olhos e nariz: brilho de coisa molhada
        cor[idx] = alb * luz[:, None] + 255 * (0.07 * spec + 0.55 * escuro * np.clip(nrm @ hv, 0, 1) ** 140 * s)[:, None]
    return np.clip(cor, 0, 255).astype(np.uint8).reshape(Ht, W, 3)


CENTRO = np.array([0.0, -20.0, 30.0])
CABECA_W = H * np.array([1, -1, 1])
VISTAS = {
    "frente34": (CENTRO + 340 * unit((0.55, -0.75, 0.42)), CENTRO),
    "frente": (CENTRO + 340 * unit((0.0, -1.0, 0.2)), CENTRO),
    "cima": (CENTRO + 380 * unit((0.001, -0.03, 1.0)), CENTRO),
    "costas": (CENTRO + 340 * unit((-0.45, 0.8, 0.45)), CENTRO),
    "rosto": (CABECA_W + 150 * unit((0.25, -0.85, 0.35)), CABECA_W + np.array([0, -8, 0])),
    "lado": (CENTRO + 340 * unit((1.0, -0.3, 0.3)), CENTRO),
}


def folha(grades, o, h, destino, W=420, Ht=330):
    from PIL import Image

    nomes = list(VISTAS)
    img = Image.new("RGB", (W * 3, Ht * 2))
    for i, nome in enumerate(nomes):
        olho, alvo = VISTAS[nome]
        img.paste(Image.fromarray(render(grades, o, h, olho, alvo, W, Ht)), ((i % 3) * W, (i // 3) * Ht))
    img.save(destino)


def apresentacao(grades, o, h, destino):
    """Imagem para mostrar o modelo: vista principal, rosto, costas e de cima, com a foto de referência."""
    from PIL import Image, ImageOps

    W, Ht = 880, 660
    img = Image.new("RGB", (W + 440, Ht), "white")
    heroi = (CENTRO + np.array([4, 0, 2]) + 330 * unit((0.45, -0.8, 0.5)), CENTRO + np.array([4, 0, 2]))
    img.paste(Image.fromarray(render(grades, o, h, *heroi, W, Ht, fov=27)), (0, 0))
    lado = [
        (CABECA_W + 140 * unit((0.2, -0.85, 0.4)), CABECA_W + np.array([0, -6, -2])),
        VISTAS["costas"],
        VISTAS["cima"],
    ]
    for i, (olho, alvo) in enumerate(lado):
        img.paste(Image.fromarray(render(grades, o, h, olho, alvo, 440, 220, fov=26 if i else 28)), (W, i * 220))
    foto = AQUI / "foto.jpg"
    if foto.exists():
        f = Image.open(foto).convert("RGB")
        f = f.crop((0, int(f.height * 0.07), f.width, int(f.height * 0.89)))
        f.thumbnail((150, 240))
        img.paste(ImageOps.expand(f, 4, "white"), (14, Ht - f.height - 22))
    img.save(destino, quality=92)


# ---------------------------------------------------------------- malha
def malha(G, o, h):
    from skimage.measure import marching_cubes

    # Superfície colada num nó da grade gera triângulos minúsculos: o valor é afastado um pouco do zero.
    G = np.where(np.abs(G) < 0.012, np.where(G < 0, -0.012, 0.012), G).astype(np.float32)
    v, f, _, _ = marching_cubes(G, 0.0, spacing=(h, h, h))
    v = v.astype(np.float64) + o
    a, b, c = v[f[:, 0]], v[f[:, 1]], v[f[:, 2]]
    if np.einsum("ij,ij->i", a, np.cross(b, c)).sum() < 0:
        f = f[:, ::-1]
    return v, np.ascontiguousarray(f)


def limpar(v, f, vol_min=2.0):
    """Tira lascas soltas (pedaços minúsculos que sobram nas emendas das cores)."""
    import trimesh

    m = trimesh.Trimesh(v, f, process=False)
    partes = [p for p in m.split(only_watertight=False) if abs(p.volume) > vol_min]
    m = trimesh.util.concatenate(partes) if len(partes) > 1 else partes[0]
    return np.asarray(m.vertices), np.asarray(m.faces), len(partes)


def gravar_stl(caminho, v, f):
    tri = v[f].astype("<f4")
    nrm = np.cross(tri[:, 1] - tri[:, 0], tri[:, 2] - tri[:, 0])
    nrm /= np.maximum(np.linalg.norm(nrm, axis=1, keepdims=True), 1e-12)
    dados = np.zeros(len(f), dtype=[("n", "<f4", 3), ("v", "<f4", (3, 3)), ("a", "<u2")])
    dados["n"], dados["v"] = nrm, tri
    with open(caminho, "wb") as arq:
        arq.write(b"Cachorro caramelo".ljust(80, b" "))
        arq.write(struct.pack("<I", len(f)))
        arq.write(dados.tobytes())


def gravar_3mf(caminho, partes):
    """partes: [(nome, (r, g, b), vértices, faces)]. Um objeto por cor, na ordem dos filamentos."""
    x = ['<?xml version="1.0" encoding="UTF-8"?>']
    x.append('<model unit="millimeter" xml:lang="pt-BR" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02">')
    x.append('<metadata name="Title">Cachorro caramelo</metadata>')
    x.append('<resources><basematerials id="1">')
    for nome, cor, _, _ in partes:
        x.append('<base name="%s" displaycolor="#%02X%02X%02XFF"/>' % (nome, *cor))
    x.append("</basematerials>")
    for i, (nome, _, v, f) in enumerate(partes):
        x.append('<object id="%d" name="%s" type="model" pid="1" pindex="%d"><mesh><vertices>' % (i + 2, nome, i))
        x.extend('<vertex x="%.3f" y="%.3f" z="%.3f"/>' % tuple(p) for p in v)
        x.append("</vertices><triangles>")
        x.extend('<triangle v1="%d" v2="%d" v3="%d"/>' % tuple(t) for t in f)
        x.append("</triangles></mesh></object>")
    x.append("</resources><build>")
    x.extend('<item objectid="%d"/>' % (i + 2) for i in range(len(partes)))
    x.append("</build></model>")
    tipos = (
        '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
        '<Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/></Types>'
    )
    rels = (
        '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        '<Relationship Target="/3D/3dmodel.model" Id="rel0" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/></Relationships>'
    )
    with zipfile.ZipFile(caminho, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as z:
        z.writestr("[Content_Types].xml", tipos)
        z.writestr("_rels/.rels", rels)
        z.writestr("3D/3dmodel.model", "\n".join(x))


def conferir(nome, v, f):
    """Malha fechada? Quanto de superfície ficaria no ar (precisaria de suporte)?"""
    import trimesh

    m = trimesh.Trimesh(v, f, process=False)
    nz = m.face_normals[:, 2]
    cz = m.triangles_center[:, 2]
    ruim = (nz < -0.82) & (cz > 0.4)  # a menos de 35° da horizontal, virada para baixo
    medio = (nz < -0.707) & (cz > 0.4) & ~ruim
    print(f"  {nome}: {len(f)} triângulos, fechada={m.is_watertight}, volume={m.volume / 1000:.1f} cm³, "
          f"tamanho={np.round(m.extents, 1)} mm, área no ar={m.area_faces[ruim].sum():.0f} mm² (+{m.area_faces[medio].sum():.0f} mm² entre 35° e 45°)")
    if ruim.any():
        adj = m.face_adjacency[ruim[m.face_adjacency].all(1)]
        for comp in trimesh.graph.connected_components(adj, nodes=np.flatnonzero(ruim)):
            area = m.area_faces[comp].sum()
            if area > 4:
                c = m.triangles_center[comp]
                print(f"    no ar: {area:5.0f} mm² em x={c[:, 0].mean():6.1f} y={c[:, 1].mean():6.1f} z={c[:, 2].min():5.1f}..{c[:, 2].max():5.1f}")
    # pontos que começariam soltos no ar (mínimos locais acima da mesa)
    e = m.edges_unique
    viz = np.full(len(v), np.inf)
    np.minimum.at(viz, e[:, 0], v[e[:, 1], 2])
    np.minimum.at(viz, e[:, 1], v[e[:, 0], 2])
    ilhas = np.flatnonzero((v[:, 2] < viz - 1e-9) & (v[:, 2] > 0.4))
    for i in ilhas[:12]:
        print(f"    começa no ar: x={v[i, 0]:6.1f} y={v[i, 1]:6.1f} z={v[i, 2]:5.1f}")
    return m


def simular(G, o, h, avanco=1.7):
    """Regiões de cada camada a mais de `avanco` voxels da camada de baixo (inclinação acima de ~50°)."""
    from scipy import ndimage as ndi

    dentro = G < 0
    k0 = int(np.ceil(-o[2] / h)) + 1
    grupos = {}
    for k in range(k0, G.shape[2]):
        atual, antes = dentro[:, :, k], dentro[:, :, k - 1]
        if not atual.any():
            break
        solto = atual & (ndi.distance_transform_edt(~antes) > avanco)
        if not solto.any():
            continue
        rot, n = ndi.label(solto)
        for i in range(1, n + 1):
            ix, iy = np.nonzero(rot == i)
            area = len(ix) * h * h
            if area < 0.75:
                continue
            x, y, z = o[0] + ix.mean() * h, o[1] + iy.mean() * h, o[2] + k * h
            chave = (round(x / 8), round(y / 8), round(z / 8))
            g = grupos.setdefault(chave, [x, y, z, z, 0.0, not antes[max(ix.min() - 2, 0) : ix.max() + 3, max(iy.min() - 2, 0) : iy.max() + 3].any()])
            g[3], g[4] = z, g[4] + area
    for x, y, z0, z1, area, ilha in sorted(grupos.values(), key=lambda g: -g[4]):
        print(f"    camadas: {'ILHA' if ilha else 'avanço'} em x={x:6.1f} y={y:6.1f} z={z0:5.1f}..{z1:5.1f} ({area:.0f} mm² somados)")
    if not grupos:
        print("    camadas: nada no ar")


def tapar_vazios(G, h):
    """Preenche bolhas fechadas dentro do sólido (sobram onde várias formas redondas se encostam)."""
    from scipy import ndimage as ndi

    solido = G < 0
    bolhas = ndi.binary_fill_holes(solido) & ~solido
    if bolhas.any():
        G = G.copy()
        G[bolhas] = -0.3 * h
    return G, int(bolhas.sum())


def autoapoiar(G, h, k0, avanco=1.05, sub=4):
    """Tira o que ficaria no ar: cada camada só pode avançar `avanco` voxels (~45°) sobre a de baixo.
    Só remove material (chanfra por baixo o que ia precisar de suporte); não cria pontes.
    A borda da camada de baixo é medida numa grade `sub` vezes mais fina, para o chanfro sair liso."""
    from scipy import ndimage as ndi

    G = G.copy()
    nx, ny = G.shape[:2]
    fator = (((nx - 1) * sub + 1) / nx, ((ny - 1) * sub + 1) / ny)
    for k in range(k0 + 1, G.shape[2]):
        if not (G[:, :, k] < 0).any():
            continue
        fino = ndi.zoom(G[:, :, k - 1], fator, order=1, mode="nearest") < 0
        if not fino.any():
            G[:, :, k] = np.maximum(G[:, :, k], h)
            continue
        dist = (ndi.distance_transform_edt(~fino) - ndi.distance_transform_edt(fino))[::sub, ::sub] / sub
        camada = G[:, :, k]  # só mexe no que é sólido: o espaço vazio continua com a distância original
        G[:, :, k] = np.where(camada < 0, np.maximum(camada, (dist - avanco) * h), camada)
    return G


def campo_imagem(F, G0, h):
    """Campo só para desenhar a imagem depois do chanfro: distância segura até o que sobrou do sólido
    (sem isso, a luz e a sombra "enxergam" a casca do material que foi tirado)."""
    from scipy import ndimage as ndi

    tirado = (G0 < 0) & (F > 0)
    if not tirado.any():
        return F
    ate_solido = ndi.distance_transform_edt(F >= 0) * h - 0.9 * h  # folga: nunca passa da distância real
    return np.where(F > 0, np.maximum(np.where(tirado, 0.7 * F, F), ate_solido), F).astype(np.float32)


def simplificar(v, f, alvo):
    """Reduz os triângulos (a superfície é lisa, não perde forma). Só vale se a malha continuar fechada."""
    import fast_simplification
    import trimesh

    for n, agg in ((alvo, 3), (alvo, 1), (int(alvo * 1.4), 2), (int(alvo * 1.4), 1)):
        v2, f2 = fast_simplification.simplify(v.astype(np.float32), f.astype(np.int32), target_count=n, agg=agg)
        m = trimesh.Trimesh(v2, f2, process=True, validate=True)
        if m.is_watertight and m.is_winding_consistent and len(m.split(only_watertight=False)) == 1 and m.volume > 0:
            return np.asarray(m.vertices, float), np.asarray(m.faces)
    print("    (simplificação descartada: a malha não ficaria fechada)")
    return v, f


# ---------------------------------------------------------------- principal
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--previa", action="store_true", help="só a folha de vistas, com grade de 1 mm")
    ap.add_argument("--voxel", type=float, default=None)
    a = ap.parse_args()
    h = a.voxel or (1.0 if a.previa else 0.5)
    SAIDA.mkdir(exist_ok=True)
    t0 = time.time()
    G, ZW, ZB, o = grade(h)
    print(f"grade {G.shape} de {h} mm em {time.time() - t0:.0f} s")
    print("  orelhas: inclinação em relação à vertical =",
          [round(float(np.degrees(np.arccos((RH @ unit(ORELHA_DIR * np.array([1, s, 1])))[2]))), 1) for s in (1, -1)])
    folha((G, ZW, ZB), o, h, SAIDA / "vistas.png")
    print(f"vistas em {time.time() - t0:.0f} s")

    v, f = malha(G, o, h)
    escala = COMPRIMENTO / (v[:, 0].max() - v[:, 0].min())
    desloc = np.array([(v[:, 0].max() + v[:, 0].min()) / 2, (v[:, 1].max() + v[:, 1].min()) / 2, 0.0])
    ajustar = lambda p: (p - desloc) * escala
    v = ajustar(v)
    v[:, 2] = np.maximum(v[:, 2], 0)
    v, f, _ = limpar(v, f)  # tira grãozinhos soltos que a grade às vezes deixa perto de pontas finas
    conferir("inteiro", v, f)
    print("  simulação por camadas (coordenadas do projeto, sem a escala final):")
    simular(G, o, h)
    if a.previa:
        return
    v, f = simplificar(v, f, 130_000)
    v[:, 2] = np.maximum(v[:, 2], 0)
    conferir("inteiro simplificado", v, f)
    gravar_stl(SAIDA / "cachorro-caramelo.stl", v, f)

    campos = {
        "1-caramelo": np.maximum(G, np.maximum(-ZW, -ZB)),
        "2-branco": np.maximum(G, np.maximum(ZW - 0.1, -ZB)),
        "3-preto": np.maximum(G, ZB - 0.1),
    }
    partes = []
    for nome, campo in campos.items():
        pv, pf = malha(campo, o, h)
        pv = ajustar(pv)
        pv[:, 2] = np.maximum(pv[:, 2], 0)
        pv, pf, n = limpar(pv, pf)
        import trimesh

        m = trimesh.Trimesh(pv, pf, process=False)
        print(f"  {nome}: {len(pf)} triângulos, fechada={m.is_watertight}, volume={m.volume / 1000:.1f} cm³, {n} pedaços")
        partes.append((nome, CORES[nome.split("-")[1]], pv, pf))
    gravar_3mf(SAIDA / "cachorro-caramelo-colorido.3mf", partes)
    apresentacao((G, ZW, ZB), o, h, SAIDA / "cachorro-caramelo.jpg")
    print(f"pronto em {time.time() - t0:.0f} s: escala {escala:.3f}")


if __name__ == "__main__":
    main()

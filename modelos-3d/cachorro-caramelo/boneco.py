#!/usr/bin/env python3
"""Boneco "cabeção" do cachorro caramelo (estilo colecionável): cabeça grande, olhos enormes,
corpo pequeno sentado e base redonda. Usa o mesmo motor do gerar.py.

  python3 boneco.py --previa     folha de vistas rápida (grade de 1 mm), sem exportar
  python3 boneco.py              STL (uma cor), 3MF (3 cores) e imagem de apresentação
"""
import argparse
import time

import numpy as np

import gerar as g
from gerar import apoiada, caps, cavar, elip, esfera, f32, pata, rx, ry, rz, smin, tubo, unit

BASE_R, BASE_H = 36.0, 6.0  # base redonda (mm)
HC = np.array([6.0, 0.0, 70.0])  # centro da cabeça
RH = rz(8) @ ry(-6) @ rx(5)  # um pouco virada, olhando de leve para cima, inclinada
OLHO_R, OLHO_FORA, OLHO_FUNDO = 15.0, 2.3, 2.6  # olho: calota rasa de uma esfera grande
LIMITES = (np.array([-44.0, -46.0, -1.37]), np.array([52.0, 46.0, 122.0]))


# ---------------------------------------------------------------- cabeça (coordenadas locais: u frente, v lado, w cima)
def cabeca_base(q):
    d = elip(q, (0, 0, 0), (27, 31.5, 26))
    for s in (1, -1):
        d = smin(d, elip(q, (7, 15 * s, -8), (16, 14.5, 13)), 8)  # bochechas
    return smin(d, elip(q, (23, 0, -11), (11.5, 11.5, 8.5)), 5)  # focinho


def _superficie(origem, dire, t0=2.0, t1=45.0):
    """Distância da origem até a superfície da cabeça, andando na direção dada."""
    ts = np.linspace(t0, t1, int((t1 - t0) * 20) + 1)
    v = cabeca_base(f32(np.asarray(origem, float) + ts[:, None] * dire))
    i = np.flatnonzero((v[:-1] < 0) & (v[1:] >= 0))[-1]
    return ts[i] - v[i] * (ts[i + 1] - ts[i]) / (v[i + 1] - v[i])


def _olhos():
    olhos = []
    for s in (1, -1):
        az, el = np.radians(26 * s), np.radians(7)
        n = np.array([np.cos(az) * np.cos(el), np.sin(az) * np.cos(el), np.sin(el)])
        c = (_superficie((0, 0, 0), n) + OLHO_FORA - OLHO_R) * n
        cima = unit(np.array([0, 0, 1.0]) - n[2] * n)
        esquerda = unit(np.array([0, -1.0, 0]) + n[1] * n)
        brilho = c + OLHO_R * unit(n + 0.20 * cima + 0.20 * esquerda)  # reflexo: em cima, do mesmo lado nos dois olhos
        olhos.append((c, n, brilho))
    return olhos


def _boca():
    """Risco do nariz para baixo e um sorriso para cada lado, na superfície do focinho."""
    centro = np.array([23.0, 0.0, -11.0])
    lados = []
    for s in (1, -1):
        pts = []
        for az, el in ((0, -13), (0, -30), (22, -38), (42, -34), (58, -24)):
            a, b = np.radians(az * s), np.radians(el)
            dire = np.array([np.cos(a) * np.cos(b), np.sin(a) * np.cos(b), np.sin(b)])
            pts.append((*(centro + _superficie(centro, dire, 2.0, 30.0) * dire), 0.85))
        lados.append(pts)
    return lados


OLHOS = _olhos()
BOCA = _boca()


def orelha(q, s):
    """Orelha em pé, larga na base, com a ponta dobrando para a frente (uma dobra mais que a outra)."""
    comprimento, r1, r2, esp, arred = 27.0, 13.5, 5.5, 1.5, 0.7
    dobra, inicio = (0.04, 18.0) if s > 0 else (0.055, 17.0)
    base = np.array([-3.0, 14.0 * s, 13.0])
    e1 = unit((-0.05, 0.58 * s, 0.81))
    n0 = np.array([0.85, 0.35 * s, 0.0])
    e3 = unit(n0 - (n0 @ e1) * e1)
    e2 = np.cross(e1, e3)
    w = q - f32(base)
    a, b, c = w @ f32(e1), w @ f32(e2), w @ f32(e3)
    c = c - dobra * np.maximum(a - inicio, 0) ** 2 - 0.012 * b * b
    h = np.clip(a / comprimento, 0, 1)
    d2 = np.sqrt((a - h * comprimento) ** 2 + b * b) - (r1 + (r2 - r1) * h)
    dz = np.abs(c) - esp
    return np.sqrt(np.maximum(d2, 0) ** 2 + np.maximum(dz, 0) ** 2) + np.minimum(np.maximum(d2, dz), 0) - arred


def cabeca(q):
    d = cabeca_base(q)
    for lado in BOCA:
        d = cavar(d, tubo(q, lado, 0.3), 0.4)
    preto = brilho = None
    for s, (c, n, bri) in zip((1, -1), OLHOS):
        d = smin(d, orelha(q, s), 4)
        prof = (q - f32(c)) @ f32(n)
        lente = np.maximum(esfera(q, c, OLHO_R), (OLHO_R - OLHO_FORA - OLHO_FUNDO) - prof)
        d = smin(d, lente, 0.6)
        zona = np.maximum(esfera(q, c, OLHO_R + 0.3), (OLHO_R - OLHO_FORA - OLHO_FUNDO - 0.3) - prof)
        preto = zona if preto is None else np.minimum(preto, zona)
        b = esfera(q, bri, 2.6)
        brilho = b if brilho is None else np.minimum(brilho, b)
    d = smin(d, elip(q, (33.0, 0, -7.5), (3.4, 5.2, 3.5)), 0.8)  # nariz
    preto = np.minimum(preto, elip(q, (33.0, 0, -7.5), (3.75, 5.55, 3.85)))
    branco = elip(q, (25, 0, -14), (12, 12.5, 8))  # boca e queixo brancos
    return d, preto, branco, brilho


# ---------------------------------------------------------------- corpo
PEITILHO = ((14.0, 0.0, 37.0), (25.5, 0.0, 52.5))  # enche embaixo do focinho: é o que o sustenta na impressão
PATAS_FRENTE = [((20.0, 9.0 * s, 8.0), 0.0, (8.5, 6.8, 5.6)) for s in (1, -1)]
PATAS_TRAS = [((11.0, 20.0 * s, 8.0), 18.0 * s, (10.0, 6.6, 5.6)) for s in (1, -1)]
RABO = [(-22, 0, 11.5, 5.5), (-27, -6, 9.8, 5.2), (-27, -13, 9.2, 4.8), (-22, -21, 8.8, 4.3), (-15, -26, 8.4, 3.8)]


def cena(Pw):
    """Distância com sinal do boneco e das zonas branca e preta nos pontos Pw (N, 3), em mm. Frente = +X."""
    P = Pw.astype(np.float32, copy=False)
    z = P[:, 2]
    # corpo sentado: quadril largo na base, tronco inclinado, peito alto
    d = elip(P, (-7, 0, 14), (20, 22, 15.5))
    d = smin(d, caps(P, (-5, 0, 17), (3, 0, 42), 19.5, 17.5), 6)
    d = smin(d, elip(P, (9, 0, 35), (13.5, 15, 13)), 6)
    pernas = None
    for s in (1, -1):
        d = smin(d, elip(P, (-3, 17 * s, 15), (14, 9, 12)), 5)  # coxas
        perna = caps(P, (15.5, 8.5 * s, 33), (16.5, 9 * s, 12.5), 6.4, 5.8)
        pernas = perna if pernas is None else np.minimum(pernas, perna)
        d = smin(d, perna, 3.5)
    for c, ang, r in PATAS_FRENTE:
        d = smin(d, pata(P, c, ang, r), 2)
    for c, ang, r in PATAS_TRAS:
        d = smin(d, pata(P, c, ang, r), 2.5)
    dr = None
    for p0, p1 in zip(RABO[:-1], RABO[1:]):
        seg = apoiada(P, p0[:3], p1[:3], p0[3], p1[3])
        dr = seg if dr is None else smin(dr, seg, 2)
    d = smin(d, dr, 4)
    d = smin(d, caps(P, *PEITILHO, 10, 8), 5)
    dc, preto, branco_c, brilho = cabeca((P - f32(HC)) @ f32(RH))
    d = smin(d, dc, 4)
    # base redonda, com a quina de cima arredondada
    rho = np.sqrt(P[:, 0] ** 2 + P[:, 1] ** 2)
    d = np.minimum(d, -smin(-(rho - BASE_R), -(z - BASE_H), 1.5))
    d = np.maximum(d, -z)

    # zonas de cor
    zw = np.minimum(branco_c, caps(P, *PEITILHO, 11, 9))
    zw = np.minimum(zw, np.maximum(elip(P, (15, 0, 34), (12, 9.5, 14)), 0.6 - pernas))  # peito, sem pegar as pernas
    zw = np.minimum(zw, np.maximum(np.abs(z - 44.5) - 4.0, np.sqrt((P[:, 0] - 3) ** 2 + P[:, 1] ** 2) - 25))  # colar
    for c, ang, r in PATAS_FRENTE + PATAS_TRAS:
        meia = esfera(P, np.array(c) + rz(ang) @ np.array([1.5, 0, 0]), r[0] + 0.6)
        zw = np.minimum(zw, np.maximum(meia, BASE_H + 0.35 - z))  # começa logo acima da base, sem pintar o tampo
    zw = np.minimum(zw, brilho)
    zb = np.maximum(preto, -brilho)
    return d, zw, zb


# ---------------------------------------------------------------- imagens
CENTRO = np.array([2.0, 0.0, 56.0])
ROSTO = HC + np.array([10.0, 0.0, -2.0])
VISTAS = {
    "frente34": (CENTRO + 330 * unit((0.90, -0.36, 0.24)), CENTRO),
    "frente": (CENTRO + 330 * unit((1.0, 0.0, 0.12)), CENTRO),
    "lado": (CENTRO + 330 * unit((0.02, -1.0, 0.10)), CENTRO),
    "costas": (CENTRO + 330 * unit((-0.80, 0.50, 0.30)), CENTRO),
    "cima": (CENTRO + 330 * unit((0.55, -0.20, 0.82)), CENTRO),
    "rosto": (ROSTO + 170 * unit((0.92, -0.25, 0.12)), ROSTO),
}


def folha(grades, o, h, destino, W=400, Ht=440):
    from PIL import Image

    img = Image.new("RGB", (W * 3, Ht * 2))
    for i, (olho, alvo) in enumerate(VISTAS.values()):
        img.paste(Image.fromarray(g.render(grades, o, h, olho, alvo, W, Ht, fov=26)), ((i % 3) * W, (i // 3) * Ht))
    img.save(destino)


def apresentacao(grades, o, h, destino):
    from PIL import Image, ImageOps

    W, Ht = 720, 900
    img = Image.new("RGB", (W + 360, Ht), "white")
    img.paste(Image.fromarray(g.render(grades, o, h, *VISTAS["frente34"], W, Ht, fov=27)), (0, 0))
    for i, nome in enumerate(("frente", "lado", "costas")):
        img.paste(Image.fromarray(g.render(grades, o, h, *VISTAS[nome], 360, 300, fov=30)), (W, i * 300))
    foto = g.AQUI / "foto.jpg"
    if foto.exists():
        f = Image.open(foto).convert("RGB")
        f = f.crop((0, int(f.height * 0.07), f.width, int(f.height * 0.89)))
        f.thumbnail((140, 230))
        img.paste(ImageOps.expand(f, 4, "white"), (14, Ht - f.height - 22))
    img.save(destino, quality=92)


# ---------------------------------------------------------------- principal
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--previa", action="store_true", help="só a folha de vistas, com grade de 1 mm")
    ap.add_argument("--voxel", type=float, default=None)
    a = ap.parse_args()
    h = a.voxel or (1.0 if a.previa else 0.5)
    g.SAIDA.mkdir(exist_ok=True)
    g.LUZ = unit((0.55, -0.50, 0.67))
    g.CHAO_CENTRO = np.array([0.0, 0.0])
    t0 = time.time()
    G, ZW, ZB, o = g.grade(h, cena, LIMITES)
    k0 = int(np.ceil(-o[2] / h)) + 1
    G, bolhas = g.tapar_vazios(G, h)
    antes = int((G < 0).sum())
    G0, G = G, g.autoapoiar(G, h, k0)
    imagem = (g.campo_imagem(G, G0, h), ZW, ZB)
    print(f"grade {G.shape} de {h} mm em {time.time() - t0:.0f} s; chanfro para imprimir sem suporte tirou "
          f"{(antes - int((G < 0).sum())) * h**3 / 1000:.2f} cm³ de {antes * h**3 / 1000:.0f} cm³")
    folha(imagem, o, h, g.SAIDA / "boneco-vistas.png")

    v, f = g.malha(G, o, h)
    v[:, 2] = np.maximum(v[:, 2], 0)
    v, f, _ = g.limpar(v, f)
    g.conferir("inteiro", v, f)
    g.simular(G, o, h)
    if a.previa:
        return
    v, f = g.simplificar(v, f, 150_000)
    v[:, 2] = np.maximum(v[:, 2], 0)
    g.gravar_stl(g.SAIDA / "cachorro-boneco.stl", v, f)

    import trimesh

    campos = {
        "1-caramelo": np.maximum(G, np.maximum(-ZW, -ZB)),
        "2-branco": np.maximum(G, np.maximum(ZW - 0.1, -ZB)),
        "3-preto": np.maximum(G, ZB - 0.1),
    }
    partes = []
    for nome, campo in campos.items():
        pv, pf = g.malha(campo, o, h)
        pv[:, 2] = np.maximum(pv[:, 2], 0)
        pv, pf, n = g.limpar(pv, pf, 1.0)
        m = trimesh.Trimesh(pv, pf, process=False)
        print(f"  {nome}: {len(pf)} triângulos, fechada={m.is_watertight}, volume={m.volume / 1000:.1f} cm³, {n} pedaços, "
              f"z={pv[:, 2].min():.1f}..{pv[:, 2].max():.1f}")
        partes.append((nome, g.CORES[nome.split("-")[1]], pv, pf))
    g.gravar_3mf(g.SAIDA / "cachorro-boneco-colorido.3mf", partes)
    apresentacao(imagem, o, h, g.SAIDA / "cachorro-boneco.jpg")
    print(f"pronto em {time.time() - t0:.0f} s")


if __name__ == "__main__":
    main()

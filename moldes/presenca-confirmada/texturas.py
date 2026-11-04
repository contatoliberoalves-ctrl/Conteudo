"""Texturas do fundo, no estilo da arte de referência: nuvem vinho (arco),
rosa manchado com granulado (laterais e base) e topo rosado bem claro.

    python3 texturas.py <pasta_saida> <vinho_escuro> <vinho> <rosa_escuro> <rosa> <rosa_claro>
"""
import sys

import numpy as np
from PIL import Image


def hexrgb(h):
    h = h.lstrip("#")
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], dtype=np.float32)


def nuvem(w, h, semente, oitavas=6, base=4):
    """Ruído fractal suave (soma de grades aleatórias ampliadas), 0–1."""
    rng = np.random.default_rng(semente)
    acc = np.zeros((h, w), np.float32)
    amp, soma = 1.0, 0.0
    for o in range(oitavas):
        gw, gh = base * 2 ** o, max(2, int(base * 2 ** o * h / w))
        g = (rng.random((gh, gw)) * 255).astype(np.uint8)
        img = Image.fromarray(g).resize((w, h), Image.BICUBIC)
        acc += np.asarray(img, np.float32) / 255 * amp
        soma += amp
        amp *= 0.55
    acc /= soma
    acc = (acc - acc.min()) / (acc.max() - acc.min() + 1e-6)
    return acc


def granulado(w, h, semente, densidade=0.035):
    """Pontinhos claros e escuros espalhados (textura de papel/pó)."""
    rng = np.random.default_rng(semente)
    g = rng.random((h, w)).astype(np.float32)
    claro = (g > 1 - densidade).astype(np.float32)
    escuro = (g < densidade * 0.6).astype(np.float32)
    return claro, escuro


def colorir(n, c0, c1, contraste=1.6):
    n = np.clip((n - 0.5) * contraste + 0.5, 0, 1) ** 1.2
    return c0[None, None, :] * (1 - n[..., None]) + c1[None, None, :] * n[..., None]


def salvar(arr, caminho):
    Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).save(caminho, optimize=True)


def main():
    pasta = sys.argv[1]
    vinho_escuro, vinho, rosa_escuro, rosa, rosa_claro = map(hexrgb, sys.argv[2:7])

    # Arco: nuvem vinho com manchas escuras e pó claro.
    w, h = 900, 1300
    n = nuvem(w, h, 11) * 0.7 + nuvem(w, h, 12, base=12) * 0.3
    arr = colorir(n, vinho_escuro, vinho, 1.9)
    claro, escuro = granulado(w, h, 13, 0.02)
    arr = arr * (1 - claro[..., None] * 0.35) + 255 * claro[..., None] * 0.35
    arr = arr * (1 - escuro[..., None] * 0.3)
    salvar(arr, f"{pasta}/arco.png")

    # Rosa (laterais e base): manchado, com granulado mais fino.
    w, h = 1080, 1920
    n = nuvem(w, h, 21, base=3) * 0.65 + nuvem(w, h, 22, base=10) * 0.35
    arr = colorir(n, rosa_escuro, rosa, 1.5)
    claro, escuro = granulado(w, h, 23, 0.03)
    arr = arr * (1 - claro[..., None] * 0.25) + rosa_claro[None, None, :] * claro[..., None] * 0.25
    arr = arr * (1 - escuro[..., None] * 0.18)
    salvar(arr, f"{pasta}/rosa.png")

    # Topo: rosado bem claro, quase branco, com névoa leve.
    n = nuvem(w, h, 31, base=3)
    topo = colorir(n, np.array([250, 232, 241], np.float32), np.array([255, 248, 252], np.float32), 1.2)
    salvar(topo, f"{pasta}/topo.png")


if __name__ == "__main__":
    main()

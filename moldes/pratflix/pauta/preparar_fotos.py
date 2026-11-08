#!/usr/bin/env python3
"""Cria as fotos de exemplo dos modelos (fotos-padrao/f1.jpg, f2.jpg, f3.jpg), fora do git.
Origem: fotos do autor já recortadas no molde Estrutura de Peças. Uso: python3 preparar_fotos.py"""
import pathlib
from PIL import Image
R = pathlib.Path(__file__).parent
ORIG = R.parent.parent / 'estrutura-de-pecas' / 'fotos'
MAPA = {'f1': ('foto-2.png', 0), 'f2': ('foto-1.png', .07), 'f3': ('foto-3.png', 0)}  # (arquivo, fração cortada embaixo)
out = R / 'fotos-padrao'; out.mkdir(exist_ok=True)
for k, (nome, corte) in MAPA.items():
    im = Image.open(ORIG / nome).convert('RGB')
    w, h = im.size; im = im.crop((0, 0, w, int(h * (1 - corte))))
    im.thumbnail((1000, 1000)); im.save(out / f'{k}.jpg', quality=82, optimize=True)
    print(k, im.size, (out / f'{k}.jpg').stat().st_size // 1024, 'KB')

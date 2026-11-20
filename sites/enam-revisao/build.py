#!/usr/bin/env python3
"""Monta o site da Revisão em Dicas ENAM 2026.2 em dist/ (fora do git: tem a foto do autor).

Antes: gere os PDFs (moldes/concurso-pdf: node dicas.mjs enam / enam2) e as imagens do site
(node produto_enam.mjs site/). A foto do autor vem de moldes/carrossel-nativo/fotos (fora do git).
Saída: dist/index.html (página completa, com metatags de compartilhamento) e dist/assets/.
O link do checkout fica na constante CHECKOUT, no fim de pagina.html.
"""
import os, re
from PIL import Image

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.join(AQUI, '..', '..', 'moldes')
PDF = os.path.join(RAIZ, 'concurso-pdf', 'saida')
DIST = os.path.join(AQUI, 'dist'); A = os.path.join(DIST, 'assets'); os.makedirs(A, exist_ok=True)

def webp(src, dst, larg=None, q=82):
    im = Image.open(src)
    im = im.convert('RGBA') if im.mode in ('RGBA', 'LA', 'P') else im.convert('RGB')
    if larg and im.width > larg: im = im.resize((larg, round(im.height * larg / im.width)), Image.LANCZOS)
    im.save(os.path.join(A, dst), 'WEBP', quality=q, method=6)

webp(os.path.join(PDF, 'produto-enam', 'site', 'mockup.png'), 'mockup.webp')
webp(os.path.join(PDF, 'enam', '3.png'), 'parte1.webp', 794)
webp(os.path.join(PDF, 'enam2', '3.png'), 'parte2.webp', 794)
webp(os.path.join(PDF, 'enam', '40.png'), 'painel.webp', 794)
Image.open(os.path.join(PDF, 'produto-enam', 'site', 'og.png')).convert('RGB').save(os.path.join(A, 'og.jpg'), quality=85)
# Foto do autor: recorte 4:5 centrado no rosto.
f = Image.open(os.path.join(RAIZ, 'carrossel-nativo', 'fotos', 'libero-paleto.jpg')).convert('RGB')
w, h = f.size; cw = min(w, int(h * .8)); ch = int(cw / .8); x = (w - cw) // 2; y = max(0, min(h - ch, int(h * .02)))
f.crop((x, y, x + cw, y + ch)).resize((880, 1100), Image.LANCZOS).save(os.path.join(A, 'autor.webp'), 'WEBP', quality=80, method=6)

corpo = open(os.path.join(AQUI, 'pagina.html'), encoding='utf-8').read()
titulo = re.search(r'<title>.*?</title>', corpo).group(0)
corpo = corpo.replace(titulo, '', 1).replace('<meta name="claude:viewport-fit-sides" content="cover">\n', '')
desc = 'São 320 dicas das 8 disciplinas do ENAM 2026.2, com a regra em uma linha, explicação e fundamento. Parte 2 com todas explicadas. R$ 49,99.'
head = f'''<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Revisão em Dicas · ENAM 2026.2 · Concurso com Líbero</title>
<meta name="theme-color" content="#0B1633">
<meta property="og:type" content="product">
<meta property="og:title" content="Revisão em Dicas · ENAM 2026.2">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="assets/og.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect x='2' y='2' width='96' height='96' rx='28' fill='%23C9A227'/%3E%3Cpath d='M32 22 V70 H70' fill='none' stroke='%23fff' stroke-width='11' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E">
<link rel="preload" as="image" href="assets/mockup.webp" type="image/webp">
</head>
<body>
'''
open(os.path.join(DIST, 'index.html'), 'w', encoding='utf-8').write(head + corpo + '\n</body>\n</html>\n')
tot = sum(os.path.getsize(os.path.join(A, n)) for n in os.listdir(A)) + os.path.getsize(os.path.join(DIST, 'index.html'))
print('dist/ pronto:', round(tot / 1024), 'KB no total')

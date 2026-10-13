# Recria assets/emblema.png (pena sobre o quadrado prateado, fundo transparente) a partir da arte
# do logo do Cartório de Curral Queimado em fundo escuro (a imagem só com o emblema). Fica fora do git.
# Uso: python3 preparar_logo.py <imagem-do-emblema-em-fundo-escuro>
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

im = Image.open(sys.argv[1]).convert('RGB')
w, h = im.size
marca = im.copy()
# O fundo é a região ligada aos cantos com a cor do fundo; o preto da pena fica de fora porque
# tem contorno branco.
for canto in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
    ImageDraw.floodfill(marca, canto, (255, 0, 255), thresh=18)
a = Image.new('L', im.size, 255)
pm, pa = marca.load(), a.load()
for y in range(h):
    for x in range(w):
        if pm[x, y] == (255, 0, 255):
            pa[x, y] = 0
a = a.filter(ImageFilter.GaussianBlur(0.8))
out = im.convert('RGBA')
out.putalpha(a)
out = out.crop(a.point(lambda v: 255 if v > 40 else 0).getbbox())
destino = Path(__file__).resolve().parent / 'assets' / 'emblema.png'
destino.parent.mkdir(exist_ok=True)
out.save(destino)
print('✓', destino, out.size)

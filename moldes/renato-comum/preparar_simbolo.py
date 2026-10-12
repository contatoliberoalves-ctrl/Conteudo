# Recria assets/simbolo.png (máscara do V do Pastor Renato, fora do git: o repositório é público)
# a partir da versão colorida em fundo branco do símbolo.
# Uso: python3 preparar_simbolo.py <imagem-do-simbolo-em-fundo-branco>
import sys
from pathlib import Path
from PIL import Image

im = Image.open(sys.argv[1]).convert('RGB')
a = Image.new('L', im.size)
px, pa = im.load(), a.load()
for y in range(im.height):
    for x in range(im.width):
        d = 255 - min(px[x, y])
        pa[x, y] = max(0, min(255, int((d - 25) * 255 / 205)))
a = a.crop(a.getbbox())
out = Image.new('RGBA', a.size, (0, 0, 0, 255))
out.putalpha(a)
destino = Path(__file__).resolve().parent / 'assets' / 'simbolo.png'
destino.parent.mkdir(exist_ok=True)
out.save(destino)
print('✓', destino)

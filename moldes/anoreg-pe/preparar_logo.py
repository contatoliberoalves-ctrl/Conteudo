# Recorta o logo oficial da ANOREG/PE de um PDF da própria associação (o boleto de contribuição, no Drive) e gera
# as versões usadas no molde em assets/ (fora do git). Uso: python3 preparar_logo.py <arquivo.pdf>
#   logo-cor.png / logo-branco.png                    letreiro + assinatura
#   letreiro-cor.png / letreiro-branco.png            só "ANOREG|PE"
# Na versão branca, o índigo vira branco; o amarelo do PE e a barra vermelha ficam.
import os, subprocess, sys, tempfile, glob
from PIL import Image
R = os.path.dirname(os.path.abspath(__file__)); A = os.path.join(R, 'assets'); os.makedirs(A, exist_ok=True)
t = tempfile.mkdtemp()
subprocess.run(['pdfimages', '-png', '-f', '1', '-l', '1', sys.argv[1], os.path.join(t, 'im')], check=True)
# o logo é a maior imagem com máscara cujo conteúdo tem o índigo #0E1170
for f in sorted(glob.glob(os.path.join(t, 'im-*.png'))):
    im = Image.open(f)
    if im.mode != 'RGB' or im.width < 1000: continue
    nome = os.path.basename(f); n = int(nome[3:6]); m = Image.open(os.path.join(t, f'im-{n + 1:03d}.png')).convert('L')
    if m.size != im.size: continue
    im = im.convert('RGBA'); im.putalpha(m); im = im.crop(m.getbbox())
    if (14, 17, 112, 255) in im.getdata(): break
else: sys.exit('logo não encontrado no PDF')
im.save(os.path.join(A, 'logo-cor.png'))
# linha vazia entre o letreiro e a assinatura
al = im.getchannel('A'); w, h = im.size
vazias = [y for y in range(h) if al.crop((0, y, w, y + 1)).getbbox() is None]
corte = vazias[0] if vazias else h
im.crop((0, 0, w, corte)).save(os.path.join(A, 'letreiro-cor.png'))
def branco(src):
    px = [(255, 255, 255, a) if (b > r + 40 and b > g + 40) else (r, g, b, a) for r, g, b, a in src.getdata()]
    o = Image.new('RGBA', src.size); o.putdata(px); return o
branco(im).save(os.path.join(A, 'logo-branco.png'))
branco(im.crop((0, 0, w, corte))).save(os.path.join(A, 'letreiro-branco.png'))
print('ok', im.size, 'corte do letreiro em', corte)

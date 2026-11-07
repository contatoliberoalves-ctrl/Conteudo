# Recorta as peças de saida/ em imagens leves para a página de apresentação (saida/apresentacao/img/).
import os, shutil
from PIL import Image
R = os.path.dirname(os.path.abspath(__file__)); S = os.path.join(R, 'saida'); D = os.path.join(S, 'apresentacao', 'img')
shutil.rmtree(D, ignore_errors=True); os.makedirs(D)
def salvar(im, nome, w):
    im = im.convert('RGB'); im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    im.save(os.path.join(D, nome), 'WEBP', quality=88)
a = lambda n: Image.open(os.path.join(S, n + '.png'))
for f in sorted(os.listdir(S)):
    n = f[:-4]
    if f.startswith(('feed-', 'carrossel-', 'cidadao-', 'pe-', 'aula-', 'noticia', 'aviso', 'aniversario', 'luto', 'reels-', 'live-', 'provimento-')): salvar(a(n), n + '.webp', 720)
    elif f.startswith('destaque-'): salvar(a(n).crop((0, 420, 1080, 1500)), n + '.webp', 240)
yt = a('youtube-banner'); salvar(yt, 'yt.webp', 1600); salvar(yt.crop((0, 508, 2560, 931)), 'yt-faixa.webp', 1600)
salvar(a('perfil'), 'perfil.webp', 320)
logo = Image.open(os.path.join(R, 'assets', 'logo-cor.png')); logo.thumbnail((900, 900)); logo.save(os.path.join(D, 'logo.png'))
print(len(os.listdir(D)), 'imagens')

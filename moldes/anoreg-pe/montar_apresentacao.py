# Recorta as peças de saida/<opcao>/ em imagens leves para a página de apresentação (saida/apresentacao/img/).
import os
from PIL import Image
R = os.path.dirname(os.path.abspath(__file__)); S = os.path.join(R, 'saida'); D = os.path.join(S, 'apresentacao', 'img')
os.makedirs(D, exist_ok=True)
def salvar(im, nome, w):
    im = im.convert('RGB'); im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    im.save(os.path.join(D, nome), 'WEBP', quality=86)
for o in 'ABCD':
    d = os.path.join(S, o); a = lambda n: Image.open(os.path.join(d, n + '.png'))
    for n in ['feed-servico', 'feed-agenda', 'feed-frase'] + [f'carrossel-{i}' for i in range(1, 6)]: salvar(a(n), f'{o}-{n}.webp', 720)
    for f in sorted(os.listdir(d)):
        if f.startswith('destaque-'): salvar(Image.open(os.path.join(d, f)).crop((0, 420, 1080, 1500)), f'{o}-{f[:-4]}.webp', 240)
    yt = a('youtube-banner'); salvar(yt, f'{o}-yt.webp', 1600); salvar(yt.crop((0, 508, 2560, 931)), f'{o}-yt-faixa.webp', 1600)
    salvar(a('perfil'), f'{o}-perfil.webp', 320)
print(len(os.listdir(D)), 'imagens')

# Aplica os adesivos da Gran Doces (build/adesivos/*.png, de adesivos.mjs) em fotos reais de embalagem
# (assets/fotos/src-*.jpg, domínio público, CREDITOS.md), com a luz e a sombra da foto. Saída 1080×1350
# em saida/fotos-embalagem/. Uso: python3 montar_fotos.py
import numpy as np
from pathlib import Path
from PIL import Image, ImageFilter, ImageOps, ImageEnhance

R = Path(__file__).resolve().parent
A, F, OUT = R / 'build/adesivos', R / 'assets/fotos', R / 'saida/fotos-embalagem'
OUT.mkdir(parents=True, exist_ok=True)

def aplicar(foto, ades, cx, cy, d, rot=0, sx=1.0, sombra=True, base=None):
    s = Image.open(A / f'{ades}.png').convert('RGBA')
    k = d / max(s.size); s = s.resize((max(1, int(s.width * k * sx)), int(s.height * k)), Image.LANCZOS)
    s = s.rotate(rot, resample=Image.BICUBIC, expand=True).filter(ImageFilter.GaussianBlur(.5))
    x, y = int(cx - s.width / 2), int(cy - (s.height if base else s.height / 2))
    # luz: luminância da foto sob o adesivo (bem desfocada), normalizada pela média
    reg = foto.crop((x, y, x + s.width, y + s.height)).convert('L').filter(ImageFilter.GaussianBlur(max(4, d / 6)))
    lum = np.asarray(reg, dtype=float); f = np.clip(.55 + .45 * lum / max(lum.mean(), 1), .55, 1.25)
    arr = np.asarray(s, dtype=float); arr[..., :3] = np.clip(arr[..., :3] * f[..., None], 0, 255)
    # grão da foto
    arr[..., :3] += np.random.default_rng(1).normal(0, 4, arr[..., :3].shape)
    s = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    if sombra:
        sh = Image.new('RGBA', s.size, (20, 10, 5, 0)); sh.putalpha(s.getchannel('A').point(lambda v: v * .45))
        foto.alpha_composite(sh.filter(ImageFilter.GaussianBlur(d / 60 + 1.5)), (x + max(2, d // 90), y + max(3, d // 60)))
    foto.alpha_composite(s, (x, y))

def recorte(im, zoom=1.0, fx=.5, fy=.5):
    # recorta na proporção 4:5 e amplia para 1080×1350
    w, h = im.size; cw = min(w, h * .8) / zoom; ch = cw / .8
    x, y = (w - cw) * fx, (h - ch) * fy
    return im.crop((int(x), int(y), int(x + cw), int(y + ch))).resize((1080, 1350), Image.LANCZOS), (x, y, 1080 / cw)

def fazer(nome, src, adesivos, flip=False, zoom=1.0, fx=.5, fy=.5, ajuste=None):
    im = Image.open(F / f'src-{src}.jpg').convert('RGBA')
    if flip: im = ImageOps.mirror(im)
    for a in adesivos: aplicar(im, **a)
    out, _ = recorte(im, zoom, fx, fy)
    out = out.convert('RGB')
    if ajuste: out = ajuste(out)
    out = out.filter(ImageFilter.UnsharpMask(1.4, 40, 2))
    out.save(OUT / f'{nome}.jpg', quality=92); print('✓', nome)

P = dict(ades=None, cx=420, cy=742, d=250, rot=-2, sx=.93)
fazer('panetone-classico', 'panettone-0', [{**P, 'ades': 'classico'}])
fazer('panetone-gotas', 'panettone-0', [{**P, 'ades': 'gotas', 'cx': 399, 'rot': 2}], flip=True, ajuste=lambda o: ImageEnhance.Color(o).enhance(.85))
fazer('brownietone', 'panettone-0', [{**P, 'ades': 'brownietone', 'cy': 748}], zoom=1.12, fy=.62, ajuste=lambda o: ImageEnhance.Brightness(ImageEnhance.Color(o).enhance(.7)).enhance(.92))
fazer('mini-panetone', 'panettone-0', [{**P, 'ades': 'mini', 'd': 200, 'cy': 760}], zoom=.98)
fazer('kit-ninho', 'christmas-gift-box-9', [dict(ades='ninho', cx=445, cy=705, d=210, rot=-3, sx=.97)], fy=.75)
fazer('kit-tradicional', 'red-gift-box-2', [dict(ades='tradicional', cx=452, cy=965, d=165, rot=-2, sx=.82)], fy=.6)
fazer('kit-chocolate', 'christmas-gift-box-5', [dict(ades='chocolate', cx=598, cy=612, d=175, rot=5, sx=.88)], fy=.45)
fazer('torta-chocolate', 'chocolate-cake-slice-0', [dict(ades='topo', cx=470, cy=600, d=290, rot=6, sombra=False, base=True)], fy=.75)
# Kits: os três juntos (Ninho em cima; Tradicional e Chocolate embaixo, centrados no adesivo)
k = {n: Image.open(OUT / f'kit-{n}.jpg') for n in ('ninho', 'tradicional', 'chocolate')}
c = Image.new('RGB', (1080, 1350), '#F6E7DA')
c.paste(k['ninho'].crop((0, 330, 1080, 1070)), (0, 0))
c.paste(k['tradicional'].crop((177, 600, 713, 1200)), (0, 750)); c.paste(k['chocolate'].crop((544, 610, 1080, 1210)), (544, 750))
c.save(OUT / 'kits-brownie.jpg', quality=92); print('✓ kits-brownie')

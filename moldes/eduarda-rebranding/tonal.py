# Fundo das fotos em degradê de uma cor da marca (escuro→claro), pessoa em cor natural.
# Uso: python3 tonal.py <foto.jpg> <saida.jpg> <hex_escuro> <hex_claro> [mascara.png]
import sys, numpy as np
from PIL import Image, ImageFilter, ImageOps
src, dst, c0, c1 = sys.argv[1:5]
hx = lambda c: np.array([int(c[i:i+2], 16) for i in (1, 3, 5)], np.float32)
im = Image.open(src).convert('RGB'); a = np.array(im).astype(np.float32)
mpath = sys.argv[5] if len(sys.argv) > 5 else src.replace('.jpg', '-mask.png')
m = np.array(Image.open(mpath).convert('L').resize(im.size).filter(ImageFilter.GaussianBlur(4))).astype(np.float32) / 255
m = np.clip((m - 0.35) / 0.6, 0, 1)
lum = (0.3*a[...,0] + 0.59*a[...,1] + 0.11*a[...,2]) / 255
lum = np.clip((lum - 0.04) / 0.85, 0, 1) ** 0.9
# no fundo, apaga brilhos (neon, softbox): a luz fica no tom da parede
from scipy import ndimage
bg = m < 0.5
sat = np.array(im.convert('HSV'))[..., 1] / 255
claro = ndimage.binary_dilation((lum > 0.55) & (sat < 0.32) & bg, iterations=22) & bg
if claro.any():
    base = lum.copy(); base[claro] = np.median(lum[bg & ~claro]) if (bg & ~claro).any() else 0.35
    for _ in range(8):  # difusão: o entorno preenche o buraco
        base[claro] = ndimage.gaussian_filter(base, 30)[claro]
    base = np.where(claro, ndimage.gaussian_filter(base, 12), base)
    lum = np.where(claro, base, lum)
tint = hx(c0) * (1 - lum[..., None]) + hx(c1) * lum[..., None]
# roxo dentro da pessoa (estampa, garrafa) também vira tom da marca
hsv = np.array(im.convert('HSV')).astype(np.float32); h = hsv[..., 0] * 360 / 255; s = hsv[..., 1] / 255
roxo = np.clip(1.4 - np.abs(h - 275) / 50, 0, 1) * np.clip((s - .12) / .15, 0, 1)
w = np.maximum(1 - m, roxo)[..., None]
out = a * (1 - w) + tint * w
Image.fromarray(out.clip(0, 255).astype(np.uint8)).save(dst, quality=92)

# Recorta uma pessoa da foto (fundo transparente) para a capa "autoral" e para a "ringue".
# Uso: python3 recortar_pessoa.py <foto> fotos/<nome>.png [x1 y1 x2 y2]
# Usa o rembg (modelo u2net_human_seg), mantém só a maior mancha e tapa os buracos internos
# (documento ou objeto na mão), que voltam com a cor original da foto.
import sys
import numpy as np
from PIL import Image
from rembg import remove, new_session
from scipy import ndimage

origem, destino = sys.argv[1], sys.argv[2]
im = Image.open(origem).convert('RGB')
if len(sys.argv) == 7:
    im = im.crop(tuple(int(v) for v in sys.argv[3:7]))
a = np.array(remove(im, session=new_session('u2net_human_seg')))
lab, n = ndimage.label(a[:, :, 3] > 40)
maior = lab == np.argmax(np.bincount(lab.ravel())[1:]) + 1
cheio = ndimage.binary_fill_holes(maior)
buraco = cheio & ~maior
a[:, :, :3] = np.where(buraco[..., None], np.array(im), a[:, :, :3])
a[:, :, 3] = np.where(buraco, 255, np.where(maior, a[:, :, 3], 0))
out = Image.fromarray(a)
out.crop(out.getbbox()).save(destino)
print(destino, out.getbbox())

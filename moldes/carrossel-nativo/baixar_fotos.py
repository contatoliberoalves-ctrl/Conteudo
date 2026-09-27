"""Baixa as fotos de viagem do autor (pasta do Google Drive dele, compartilhada por link) para fotos/viagem-NN.jpg.

Uso: python3 baixar_fotos.py ids.txt   (um ID de arquivo do Drive por linha; liste com search_files, parentId = <pasta>)
A numeração segue a ordem alfabética dos IDs, a mesma usada nos posts do dados.json.
"""
import subprocess, sys, io, pathlib
from PIL import Image, ImageOps

ids = sorted({l.strip() for l in open(sys.argv[1]) if l.strip()})
dest = pathlib.Path(__file__).parent / 'fotos'
for n, i in enumerate(ids, 1):
    dados = subprocess.run(['curl', '-sSL', f'https://drive.usercontent.google.com/download?id={i}&export=download'],
                           capture_output=True, check=True).stdout
    im = ImageOps.exif_transpose(Image.open(io.BytesIO(dados))).convert('RGB')
    im.thumbnail((1600, 1600))
    im.save(dest / f'viagem-{n:02d}.jpg', quality=88)
    print(f'viagem-{n:02d}.jpg ← {i}')

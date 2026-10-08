# Monta o site: recorta as fotos do autor (originais em moldes/estrutura-de-pecas/fotos, fora do git),
# copia os PDFs e as capas dos materiais (moldes/*/saida) e gera artifact.html (prévia no claude.ai,
# sem doctype/html/head/body, que a publicação acrescenta). fotos/, materiais/ e artifact.html ficam fora do git.
# Uso: python3 site/montar.py
import re
import shutil
from pathlib import Path
from PIL import Image, ImageOps

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parent
FOTOS = RAIZ / 'moldes/estrutura-de-pecas/fotos'
# nome no site: (original, largura, recorte vertical opcional)
ESCOLHA = {'hero': ('0557.jpg', 900), 'sobre': ('0458.jpg', 900), 'reforco': ('dsc08888.jpg', 900),
           'podcast': ('dsc08680.jpg', 900), 'conteudo': ('dsc08842.jpg', 900)}
# materiais: pasta de saída do molde, arquivo do site
MATERIAIS = {'simulado-autoral.pdf': 'moldes/libero-pdf/saida/simulado-autoral-oab44/simulado-autoral-oab44.pdf',
             # O gabarito entra quando for divulgado (e publicado: true no index.html):
             # 'gabarito-simulado-autoral.pdf': 'moldes/libero-pdf/saida/simulado-autoral-oab44-gabarito/simulado-autoral-oab44-gabarito.pdf',
             }
CAPAS = {'simulado-autoral.webp': 'moldes/libero-pdf/saida/simulado-autoral-oab44/1.png',
         'gabarito-simulado-autoral.webp': 'moldes/libero-pdf/saida/simulado-autoral-oab44-gabarito/1.png'}

(AQUI / 'fotos').mkdir(exist_ok=True)
(AQUI / 'materiais').mkdir(exist_ok=True)
for nome, (orig, larg) in ESCOLHA.items():
    im = ImageOps.exif_transpose(Image.open(FOTOS / orig)).convert('RGB')
    im.thumbnail((larg, larg * 2))
    im.save(AQUI / 'fotos' / f'{nome}.webp', quality=80)
for nome, orig in MATERIAIS.items():
    if (RAIZ / orig).exists():
        shutil.copy(RAIZ / orig, AQUI / 'materiais' / nome)
    else:
        print('falta', orig)
for nome, orig in CAPAS.items():
    if (RAIZ / orig).exists():
        im = Image.open(RAIZ / orig).convert('RGB'); im.thumbnail((520, 800)); im.save(AQUI / 'materiais' / nome, quality=82)
html = (AQUI / 'index.html').read_text('utf8')
art = re.sub(r'<!doctype html>\s*<html[^>]*>\s*<head>|</head>\s*<body>|</body>\s*</html>\s*$', '', html, flags=re.I)
art = re.sub(r'<meta[^>]*>\s*', '', art)
(AQUI / 'artifact.html').write_text(art.strip() + '\n', 'utf8')
print('ok')

# Recria prints/*.jpg e os recortes prints/c_*.jpg a partir dos PNGs originais da pasta do Drive
# (1sYc4JFOVpYtBksBDZKI4EhB3vzJ2zIRX). Uso: python3 recortar_prints.py <pasta-com-os-png>
import sys
from pathlib import Path
from PIL import Image

NOMES = {'01 - Constitucional - Visão geral.png': 'visao', '02 - Constitucional - Aulas.png': 'aulas',
         '03 - Constitucional - Cronograma.png': 'cronograma', '04 - Constitucional - Banco de Questões.png': 'questoes',
         'Captura de Tela 2026-10-31 às 14.22.43.png': 'cap1422', 'Captura de Tela 2026-10-31 às 14.23.18.png': 'cap1423a',
         'Captura de Tela 2026-10-31 às 14.23.47.png': 'cap1423b', 'Captura de Tela 2026-10-31 às 14.24.23.png': 'cap1424'}
RECORTES = {'contagem': ('visao', (1170, 392, 1420, 534)), 'player': ('cap1422', (50, 22, 1326, 742)),
            'questao': ('cap1424', (0, 0, 1290, 1000)), 'cards': ('visao', (352, 600, 1470, 1039)),
            'hero': ('visao', (352, 140, 1470, 580)), 'aulasgrid': ('aulas', (352, 420, 1470, 1039)),
            'banco': ('questoes', (352, 140, 1470, 1039)), 'crono': ('cronograma', (352, 140, 1470, 1039))}
src, out = Path(sys.argv[1]), Path(__file__).parent / 'prints'
out.mkdir(exist_ok=True)
for arq, n in NOMES.items():
    Image.open(src / arq).convert('RGB').save(out / f'{n}.jpg', quality=90)
for n, (base, caixa) in RECORTES.items():
    Image.open(out / f'{base}.jpg').crop(caixa).save(out / f'c_{n}.jpg', quality=92)
print('ok')

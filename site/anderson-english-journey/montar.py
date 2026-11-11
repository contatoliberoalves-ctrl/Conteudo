# Monta a versão para hospedar fora do claude.ai (com <head>, manifesto e funcionamento offline) em dist/.
# O index.html do repositório não tem <html>/<head> porque o Artifact acrescenta; aqui eles entram.
# Uso: python3 site/anderson-english-journey/montar.py   (precisa do anderson.webp na pasta; ele fica fora do git)
import shutil
from pathlib import Path
AQUI = Path(__file__).resolve().parent
DIST = AQUI / 'dist'
if DIST.exists():
    shutil.rmtree(DIST)
(DIST / 'img').mkdir(parents=True)
CABECA = '''<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#0B2347">
<meta name="description" content="English Journey: inglês em pequenas paradas, com o Teacher Anderson.">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icone-192.png">
<link rel="apple-touch-icon" href="icone-192.png">
<style>html{color-scheme:light}:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>
</head>
<body>
'''
(DIST / 'index.html').write_text(CABECA + (AQUI / 'index.html').read_text('utf8') + '\n</body>\n</html>\n', 'utf8')
for nome in ['manifest.webmanifest', 'sw.js', 'icone-192.png', 'icone-512.png', 'icone-mask-512.png', 'anderson.webp']:
    if (AQUI / nome).exists():
        shutil.copy(AQUI / nome, DIST / nome)
    else:
        print('falta', nome)
for f in (AQUI / 'img').glob('*.webp'):
    shutil.copy(f, DIST / 'img' / f.name)
print('ok:', DIST)

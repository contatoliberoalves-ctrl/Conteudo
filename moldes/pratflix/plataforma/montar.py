#!/usr/bin/env python3
"""Monta a apresentação do PratFlix a partir de fonte.html.

Saídas:
  PratFlix_Apresentacao.html  arquivo único (imagens embutidas), abre direto no navegador
  saida/artifact.html         a mesma página sem <html>/<head>/<body>, para publicar como Artifact
"""
import base64, pathlib, re

AQUI = pathlib.Path(__file__).parent
fonte = (AQUI / 'fonte.html').read_text(encoding='utf-8')

def embutir(m):
    arq = AQUI / m.group(1)
    dados = base64.b64encode(arq.read_bytes()).decode()
    return f'url(data:image/webp;base64,{dados})'

pagina = re.sub(r'url\((img/[a-z]+\.webp)\)', embutir, fonte)
(AQUI / 'PratFlix_Apresentacao.html').write_text(pagina, encoding='utf-8')

art = pagina
for padrao in [r'<!doctype html>\s*', r'<html[^>]*>\s*', r'</?head>\s*', r'<body>\s*', r'</body>\s*', r'</html>\s*',
               r'<meta charset="utf-8">\s*', r'<meta name="viewport"[^>]*>\s*']:
    art = re.sub(padrao, '', art, flags=re.I)
(AQUI / 'saida').mkdir(exist_ok=True)
(AQUI / 'saida' / 'artifact.html').write_text(art, encoding='utf-8')
print('ok', len(pagina) // 1024, 'KB')

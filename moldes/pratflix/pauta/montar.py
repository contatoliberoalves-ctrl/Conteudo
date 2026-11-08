#!/usr/bin/env python3
"""Monta a Pauta num arquivo único.
Saídas: dist/pauta.html (abre no navegador ou sobe no servidor) e dist/artifact.html (sem <html>/<head>/<body>, para Artifact)."""
import pathlib, re
R = pathlib.Path(__file__).parent
src = R / 'src'
html = (src / 'index.html').read_text(encoding='utf-8')
css = (src / 'style.css').read_text(encoding='utf-8')
js = '\n'.join((src / f).read_text(encoding='utf-8') for f in ['areas.js', 'conteudo.js', 'app.js'])
html = html.replace('<!--CSS-->', f'<style>\n{css}\n</style>').replace('<!--JS-->', f'<script>\n{js}\n</script>')
(R / 'dist').mkdir(exist_ok=True)
(R / 'dist' / 'pauta.html').write_text(html, encoding='utf-8')
art = html
for p in [r'<!doctype html>\s*', r'<html[^>]*>\s*', r'</?head>\s*', r'<body>\s*', r'</body>\s*', r'</html>\s*', r'<meta charset="utf-8">\s*', r'<meta name="viewport"[^>]*>\s*']:
    art = re.sub(p, '', art, flags=re.I)
(R / 'dist' / 'artifact.html').write_text(art, encoding='utf-8')
print('ok', len(html) // 1024, 'KB')

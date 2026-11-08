#!/usr/bin/env python3
"""Monta a Pauta num arquivo único.
Saídas: dist/pauta.html e dist/artifact.html (sem fotos, vão para o git) e, se existir a pasta fotos-padrao/
(criada por preparar_fotos.py, fora do git), dist/com-foto/pauta.html e dist/com-foto/artifact.html com as fotos de exemplo."""
import base64, json, pathlib, re
R = pathlib.Path(__file__).parent
src = R / 'src'
base = (src / 'index.html').read_text(encoding='utf-8')
css = '\n'.join((src / f).read_text(encoding='utf-8') for f in ['style.css', 'modelos.css', 'estudio.css', 'escritorio.css'])
js = '\n'.join((src / f).read_text(encoding='utf-8') for f in ['areas.js', 'conteudo.js', 'modelos.js', 'estudio.js', 'escritorio.js', 'tendencias.js', 'app.js'])

def monta(pasta, fotos):
    pre = f'window.FOTOS_PADRAO = {json.dumps(fotos)};\n' if fotos else ''
    html = base.replace('<!--CSS-->', f'<style>\n{css}\n</style>').replace('<!--JS-->', f'<script>\n{pre}{js}\n</script>')
    pasta.mkdir(parents=True, exist_ok=True)
    (pasta / 'pauta.html').write_text(html, encoding='utf-8')
    art = html
    for p in [r'<!doctype html>\s*', r'<html[^>]*>\s*', r'</?head>\s*', r'<body>\s*', r'</body>\s*', r'</html>\s*', r'<meta charset="utf-8">\s*', r'<meta name="viewport"[^>]*>\s*']:
        art = re.sub(p, '', art, flags=re.I)
    (pasta / 'artifact.html').write_text(art, encoding='utf-8')
    print(pasta.relative_to(R), len(html) // 1024, 'KB')

monta(R / 'dist', {})
fp = R / 'fotos-padrao'
if fp.exists():
    fotos = {f.stem: 'data:image/jpeg;base64,' + base64.b64encode(f.read_bytes()).decode() for f in sorted(fp.glob('f*.jpg'))}
    monta(R / 'dist' / 'com-foto', fotos)

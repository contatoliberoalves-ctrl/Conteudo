# Monta o site da ARPEN-PE a partir de src/: gera index.html (site completo, pronto para hospedar junto
# com a pasta img/) e previa.html (prévia no claude.ai, sem doctype/html/head/body; fica fora do git).
# Uso: python3 sites/arpen-pe/montar.py
from pathlib import Path

AQUI = Path(__file__).resolve().parent
SRC = AQUI / 'src'
TITULO = 'ARPEN Pernambuco'
FONTES = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
          '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..600;1,9..144,400..600'
          '&family=Instrument+Sans:wght@400..700&display=swap">')
ORDEM = ['base.js', 'dados.js', 'publico.js', 'membros.js', 'painel.js', 'rota.js']

css = (SRC / 'site.css').read_text()
corpo = (SRC / 'corpo.html').read_text()
js = '\n'.join((SRC / n).read_text() for n in ORDEM)
assert '</script' not in js.lower()

miolo = f'{FONTES}\n<style>\n{css}</style>\n{corpo}'
(AQUI / 'index.html').write_text(
    '<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
    f'<title>{TITULO}</title>\n'
    '<meta name="description" content="Informação, cidadania e formação para o registro civil de Pernambuco.">\n'
    '<meta name="theme-color" content="#006B4F">\n'
    '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 40 40\'%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'20\' fill=\'%23006B4F\'/%3E%3Cpath d=\'M11 26c0-6 4-11 9-11s9 5 9 11\' fill=\'none\' stroke=\'%23fff\' stroke-width=\'3\' stroke-linecap=\'round\'/%3E%3Ccircle cx=\'28\' cy=\'11\' r=\'3\' fill=\'%23F6C544\'/%3E%3C/svg%3E">\n'
    f'</head>\n<body>\n{miolo}<script>\n{js}</script>\n</body>\n</html>\n')
(AQUI / 'previa.html').write_text(
    f'<title>{TITULO}</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n{miolo}'
    f'<script>window.ARPEN_PREVIA = true;</script>\n<script>\n{js}</script>\n')
print('index.html e previa.html gerados:', round((AQUI / 'index.html').stat().st_size / 1024), 'KB')

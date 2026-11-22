# Monta o site de vendas de um kit: preenche kits/site/<id>.html em build/site/<id>/index.html e gera as imagens
# em build/site/<id>/assets/ a partir das páginas dos PDFs (rode antes o render-pdf.mjs do kit).
# Imagens: produtos.json > site.assets ({nome: [pdf sem o prefixo do kit, página]}). Marcas: {{PRECO}} e {{CHECKOUT}}.
# A foto do autor (kits/site/assets/autor.webp) fica fora do git: está publicada nos sites da Revisão em Dicas.
# Uso: python3 kits/montar-site.py <id>
import json, re, shutil, sys
from pathlib import Path
from PIL import Image

KITS = Path(__file__).resolve().parent; RAIZ = KITS.parent
pid = sys.argv[1]
prod = next(p for p in json.loads((KITS / 'produtos.json').read_text('utf8')) if p['id'] == pid)
dest = RAIZ / 'build' / 'site' / pid
if (dest / 'assets').exists(): shutil.rmtree(dest / 'assets')
(dest / 'assets').mkdir(parents=True, exist_ok=True)
for nome, (pdf, n) in prod['site']['assets'].items():
    im = Image.open(RAIZ / 'saida' / f'{pid}-{pdf}' / f'{n}.png').convert('RGB')
    im.thumbnail((560, 792))
    im.save(dest / 'assets' / f'{nome}.webp', quality=76, method=6)
autor = KITS / 'site' / 'assets' / 'autor.webp'
if autor.exists(): shutil.copy(autor, dest / 'assets' / 'autor.webp')
else: print('! falta kits/site/assets/autor.webp (foto do autor, fora do git)')
html = (KITS / 'site' / f'{pid}.html').read_text('utf8').replace('{{PRECO}}', prod['preco']).replace('{{CHECKOUT}}', prod.get('checkout', ''))
assert '{{' not in html, re.findall(r'\{\{[^}]*\}\}', html)
(dest / 'index.html').write_text(html, 'utf8')
print('ok', dest, {f.name: f.stat().st_size // 1024 for f in sorted((dest / 'assets').iterdir())}, 'kB · html', len(html) // 1024, 'kB')

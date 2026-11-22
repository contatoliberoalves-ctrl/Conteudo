# Monta o site de vendas de um produto: preenche site/<arquivo> em build/site/<id>/index.html e gera as imagens em
# build/site/<id>/assets/ a partir das páginas dos PDFs (rode antes o render-pdf.mjs com --png dessas páginas).
# Imagens: produtos.json > site.assets ({nome: [parte ou caderno, página]}); sem `site`, usa o padrão do TCE MA.
# Marcas no HTML: {{PRECO}}, {{P1}}/{{P2}} e {{PG:<parte1|parte2|caderno>}} (páginas de cada PDF) e {{BARRAS}}.
# A foto do autor (site/assets/autor.webp) fica fora do git: está publicada no artifact "Revisão em Dicas ENAM".
# Uso: python3 montar-site.py <id>
import json, re, shutil, sys
from pathlib import Path
from PIL import Image

AQUI = Path(__file__).resolve().parent
pid = sys.argv[1]
prod = next(p for p in json.loads((AQUI / 'produtos.json').read_text('utf8')) if p['id'] == pid)
cont = json.loads((AQUI / 'conteudo' / f'{pid}.json').read_text('utf8'))
saida = AQUI / 'saida' / pid
dest = AQUI / 'build' / 'site' / pid
if (dest / 'assets').exists(): shutil.rmtree(dest / 'assets')
(dest / 'assets').mkdir(parents=True, exist_ok=True)
pasta = lambda p: f'parte{p}' if isinstance(p, int) else p
site = prod['site'] if 'site' in prod else {'arquivo': f'{pid}.html', 'assets': {n: prod['imagens'][k] for k, n in
        {'capa1': 'capa1', 'capa2': 'capa2', 'pagina': 'p1', 'explicada': 'p2', 'painel': 'painel'}.items()}}
for nome, (parte, n) in site['assets'].items():
    im = Image.open(saida / pasta(parte) / f'{n}.png').convert('RGB')
    im.thumbnail((640, 905))
    im.save(dest / 'assets' / f'{nome}.webp', quality=78, method=6)
autor = AQUI / 'site' / 'assets' / 'autor.webp'
if autor.exists(): shutil.copy(autor, dest / 'assets' / 'autor.webp')
else: print('! falta site/assets/autor.webp (foto do autor, fora do git)')
pg = {d.name: json.loads((d / 'marcos.json').read_text())['paginas'] for d in saida.iterdir() if (d / 'marcos.json').exists()}
destaque = prod.get('destaque')
barras = [[m['nome'], sum(len(b['dicas']) for b in m['blocos']), (m['nome'] in destaque) if destaque else 'ESPEC' in m['rotulo'].upper()] for m in cont['materias']]
html = (AQUI / 'site' / site['arquivo']).read_text('utf8')
html = html.replace('{{PRECO}}', prod['preco']).replace('{{BARRAS}}', json.dumps(barras, ensure_ascii=False))
html = html.replace('{{P1}}', str(pg.get('parte1', ''))).replace('{{P2}}', str(pg.get('parte2', '')))
html = re.sub(r'\{\{PG:([\w-]+)\}\}', lambda m: str(pg[m.group(1)]), html)
assert '{{' not in html, re.findall(r'\{\{[^}]*\}\}', html)
(dest / 'index.html').write_text(html, 'utf8')
print('ok', dest, {f.name: f.stat().st_size // 1024 for f in sorted((dest / 'assets').iterdir())}, 'kB · html', len(html) // 1024, 'kB')

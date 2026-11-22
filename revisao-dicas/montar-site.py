# Monta o site de vendas de um produto: preenche site/<id>.html (preço, páginas, barras) em build/site/<id>/index.html
# e gera as imagens em build/site/<id>/assets/ a partir das páginas dos PDFs (rode antes o render-pdf.mjs com
# --png das páginas de produtos.json > imagens). A foto do autor (assets/autor.webp) fica fora do git: copie-a
# para site/assets/autor.webp (está publicada no artifact "Revisão em Dicas ENAM").
# Uso: python3 montar-site.py <id>
import json, shutil, sys
from pathlib import Path
from PIL import Image

AQUI = Path(__file__).resolve().parent
pid = sys.argv[1]
prod = next(p for p in json.loads((AQUI / 'produtos.json').read_text('utf8')) if p['id'] == pid)
cont = json.loads((AQUI / 'conteudo' / f'{pid}.json').read_text('utf8'))
saida = AQUI / 'saida' / pid
dest = AQUI / 'build' / 'site' / pid
(dest / 'assets').mkdir(parents=True, exist_ok=True)
pag = {p: json.loads((saida / f'parte{p}' / 'marcos.json').read_text())['paginas'] for p in (1, 2)}
nomes = {'capa1': 'capa1', 'capa2': 'capa2', 'pagina': 'p1', 'explicada': 'p2', 'painel': 'painel'}
for chave, nome in nomes.items():
    parte, n = prod['imagens'][chave]
    im = Image.open(saida / f'parte{parte}' / f'{n}.png').convert('RGB')
    im.thumbnail((640, 905))
    im.save(dest / 'assets' / f'{nome}.webp', quality=78, method=6)
autor = AQUI / 'site' / 'assets' / 'autor.webp'
if autor.exists(): shutil.copy(autor, dest / 'assets' / 'autor.webp')
else: print('! falta site/assets/autor.webp (foto do autor, fora do git)')
barras = [[m['nome'], sum(len(b['dicas']) for b in m['blocos']), 'ESPEC' in m['rotulo'].upper()] for m in cont['materias']]
html = (AQUI / 'site' / f'{pid}.html').read_text('utf8')
for k, v in {'{{PRECO}}': prod['preco'], '{{P1}}': str(pag[1]), '{{P2}}': str(pag[2]), '{{BARRAS}}': json.dumps(barras, ensure_ascii=False)}.items():
    html = html.replace(k, v)
(dest / 'index.html').write_text(html, 'utf8')
print('ok', dest, {f.name: f.stat().st_size // 1024 for f in sorted((dest / 'assets').iterdir())}, 'kB · html', len(html) // 1024, 'kB')

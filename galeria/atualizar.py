# Atualiza a galeria já montada (galeria/dist/index.html) só para um molde, sem refazer as imagens de
# todos os posts como o gerar.py. Útil numa sessão em que só alguns posts mudaram.
# Uso: python3 galeria/atualizar.py <molde> [post ...]
#   Refaz a entrada do molde (nome, descrição e lista de posts, a partir de molde.json e dados.json) e as
#   imagens dos posts indicados e dos posts que ainda não estão na galeria. Imprime os arquivos a publicar
#   (o "files" do Artifact). O dist/index.html precisa existir: gere com gerar.py ou salve a galeria
#   publicada (Artifact read) e tire o esqueleto que a publicação acrescenta.
import json
import re
import sys
from pathlib import Path

from PIL import Image

raiz = Path(__file__).resolve().parent
dist = raiz / 'dist'
molde, pedidos = sys.argv[1], set(sys.argv[2:])
pasta = raiz.parent / 'moldes' / molde
from gerar_util import jpeg, titulo

html = (dist / 'index.html').read_text('utf8')
m = re.search(r'\nconst MOLDES = (.*);\n', html)
moldes = json.loads(m.group(1))
antigo = next((x for x in moldes if x['id'] == molde), None)
editores = {p['id']: p.get('editor') for p in (antigo or {}).get('posts', [])}

meta = json.loads((pasta / 'molde.json').read_text('utf8'))
meta['id'] = molde
posts, publicar = [], []
for c in json.loads((pasta / 'dados.json').read_text('utf8')):
    saida = pasta / 'saida' / c['id']
    slides = sorted((p for p in saida.glob('*.png') if p.stem.isdigit()), key=lambda p: int(p.stem))
    base = f'img/{molde}/{c["id"]}'
    publicado = c['id'] in editores
    if c['id'] in pedidos or not publicado:  # post novo ou pedido: refaz as imagens
        if not slides:
            print(f'! {c["id"]}: sem imagens em saida/, fica de fora', file=sys.stderr)
            continue
        alt = Image.open(slides[0]).height  # 1350 (4:5) ou 1440 (3:4)
        tira = Image.new('RGB', (1080 * len(slides), alt))
        for k, s in enumerate(slides):
            tira.paste(Image.open(s).convert('RGB'), (1080 * k, 0))
        (dist / base).parent.mkdir(parents=True, exist_ok=True)
        tira.save(dist / f'{base}-slides.webp', 'WEBP', quality=86, method=5)
        painel = saida / 'painel.png'
        jpeg(painel if painel.exists() else slides[0], dist / f'{base}-painel.jpg', 1200, 78)
        publicar += [f'{base}-painel.jpg', f'{base}-slides.webp']
    velho = next((p for p in (antigo or {}).get('posts', []) if p['id'] == c['id']), {})
    n = len(slides) or velho['n']
    alt = Image.open(slides[0]).height if slides else velho.get('h', 1350)
    posts.append({'id': c['id'], 'titulo': titulo(c), 'tema': c.get('tema', ''), 'topicos': len(c.get('topicos', [])),
                  'painel': f'{base}-painel.jpg', 'tira': f'{base}-slides.webp', 'n': n, 'h': alt, 'editor': editores.get(c['id'])})
meta['posts'] = posts
if antigo:
    moldes[moldes.index(antigo)] = meta
else:
    moldes.append(meta)
    moldes.sort(key=lambda x: x['id'])
modelo = (raiz / 'modelo.html').read_text('utf8')
dados = json.dumps(moldes, ensure_ascii=False).replace('</', '<\\/')
(dist / 'index.html').write_text(modelo.replace('/*__DADOS__*/[]', dados), 'utf8')
print(json.dumps({p: p for p in publicar}, ensure_ascii=False))

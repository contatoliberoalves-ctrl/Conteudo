# Monta a galeria de moldes a partir de moldes/*/ (molde.json + dados.json + saida/<id>/*.png).
# Por post publica 2 imagens: <id>-painel.jpg (miniatura) e <id>-slides.webp (todos os slides, 1080x1350).
# Posts com foto ganham também a imagem do editor de capa (ver editor()).
# Uso: python3 galeria/gerar.py   -> gera galeria/dist/index.html e as imagens em galeria/dist/img/
# Requer Pillow (pip install pillow). Rode antes o "npm run gerar" de cada molde.
import hashlib
import json
import shutil
from pathlib import Path

from PIL import Image

raiz = Path(__file__).resolve().parent
dist = raiz / 'dist'
shutil.rmtree(dist, ignore_errors=True)
(dist / 'img').mkdir(parents=True)


def jpeg(origem, destino, largura, qualidade=82):
    im = Image.open(origem).convert('RGB')
    if im.width > largura:
        im = im.resize((largura, round(im.height * largura / im.width)), Image.LANCZOS)
    destino.parent.mkdir(parents=True, exist_ok=True)
    im.save(destino, 'JPEG', quality=qualidade, optimize=True, progressive=True)


def titulo(c):
    """Nome do post na galeria: "titulo" (Estrutura de Peças), "destaque" (Carrossel Explicativo) ou "name" (Carrossel Infinito)."""
    t = c.get('titulo') or c.get('destaque') or c.get('name') or c['id']
    return ' '.join(t) if isinstance(t, list) else t


# Editor de capa: por post com foto, uma imagem [camada de texto | foto com margem] enviada ao
# espaço de arquivos ("assets") da página. galeria/ativos.json guarda nome -> {id, sha} dos já enviados;
# os que faltam (ou mudaram) ficam listados em dist/editor/pendentes.txt para enviar e anotar o id.
CAIXAS = {  # caixa da foto na capa (x, y, largura, altura), cor de fundo e se a foto esmaece embaixo
    'estrutura-de-pecas': ((0, 0, 1020, 1000), '#141412', True),
    'carrossel-explicativo': ((0, 0, 1080, 1350), '#1c1f1e', False),
}
ativos_arq = raiz / 'ativos.json'
ativos = json.loads(ativos_arq.read_text()) if ativos_arq.exists() else {}
pendentes = []


def editor(pasta, c, saida):
    camada = saida / 'capa-camada.png'
    fontes_arq = pasta / 'fotos' / 'fontes.json'
    if pasta.name not in CAIXAS or not c.get('foto') or not camada.exists() or not fontes_arq.exists():
        return None
    f = json.loads(fontes_arq.read_text()).get(Path(c['foto']).stem)
    fonte = pasta / 'fotos' / 'fontes' / c['foto']
    if not f or not fonte.exists():
        return None
    img = Image.new('RGBA', (1080 + f['w'], max(1350, f['h'])), (0, 0, 0, 0))
    img.paste(Image.open(camada).convert('RGBA'), (0, 0))
    img.paste(Image.open(fonte).convert('RGBA'), (1080, 0))
    nome = f'{pasta.name}__{c["id"]}.webp'
    destino = dist / 'editor' / nome
    destino.parent.mkdir(parents=True, exist_ok=True)
    img.save(destino, 'WEBP', quality=86, method=5)
    sha = hashlib.sha1(destino.read_bytes()).hexdigest()
    reg = ativos.get(nome)
    if not reg or reg.get('sha') != sha:
        pendentes.append(nome)
        reg = None
    caixa, fundo, mascara = CAIXAS[pasta.name]
    geo = {'fw': f['w'], 'fh': f['h'], 'ox': f['ox'], 'oy': f['oy']}
    # Capas com a foto numa caixa menor (Carrossel Explicativo, capas B a F): o render grava em
    # saida/<id>/capa.json a caixa, o fundo e a foto com margem já na escala da caixa.
    capa_arq = saida / 'capa.json'
    if capa_arq.exists():
        k = json.loads(capa_arq.read_text())
        if k.get('caixa') and 'fw' in k:
            caixa, fundo, mascara = k['caixa'], k['fundo'], False
            geo = {x: k[x] for x in ('fw', 'fh', 'ox', 'oy')}
    return {'img': '/_blob/' + reg['id'] if reg else None, 'sw': f['w'], 'sh': f['h'], **geo,
            'caixa': caixa, 'fundo': fundo, 'mascara': mascara, 'ajuste': c.get('fotoAjuste')}


moldes = []
for pasta in sorted((raiz.parent / 'moldes').iterdir()):
    meta_arq = pasta / 'molde.json'
    if not meta_arq.exists():
        continue
    meta = json.loads(meta_arq.read_text('utf8'))
    meta['id'] = pasta.name
    posts = []
    for c in json.loads((pasta / 'dados.json').read_text('utf8')):
        saida = pasta / 'saida' / c['id']
        slides = sorted(saida.glob('[0-9].png'), key=lambda p: int(p.stem))
        if not slides:
            print(f'  ! {pasta.name}/{c["id"]}: sem imagens em saida/, pulando')
            continue
        base = f'img/{pasta.name}/{c["id"]}'
        # Uma tira com todos os slides lado a lado em resolução cheia (1080x1350 cada, WebP): 1 arquivo
        # por post, para caber no limite de arquivos da página. A galeria recorta cada slide dela para
        # mostrar e para montar o zip de download.
        tira = Image.new('RGB', (1080 * len(slides), 1350))
        for k, s in enumerate(slides):
            tira.paste(Image.open(s).convert('RGB'), (1080 * k, 0))
        (dist / base).parent.mkdir(parents=True, exist_ok=True)
        tira.save(dist / f'{base}-slides.webp', 'WEBP', quality=86, method=5)
        painel = saida / 'painel.png'
        jpeg(painel if painel.exists() else slides[0], dist / f'{base}-painel.jpg', 1200, 78)
        posts.append({
            'id': c['id'],
            'titulo': titulo(c),
            'tema': c.get('tema', ''),
            'topicos': len(c.get('topicos', [])),
            'painel': f'{base}-painel.jpg',
            'tira': f'{base}-slides.webp',
            'n': len(slides),
            'editor': editor(pasta, c, saida),
        })
    meta['posts'] = posts
    moldes.append(meta)
    print(f'✓ {meta["nome"]}: {len(posts)} posts')

html = (raiz / 'modelo.html').read_text('utf8')
dados = json.dumps(moldes, ensure_ascii=False).replace('</', '<\\/')
(dist / 'index.html').write_text(html.replace('/*__DADOS__*/[]', dados), 'utf8')
(dist / 'editor').mkdir(exist_ok=True)
(dist / 'editor' / 'pendentes.txt').write_text('\n'.join(pendentes) + ('\n' if pendentes else ''))
if pendentes:
    print(f'! {len(pendentes)} imagens do editor para enviar (dist/editor/pendentes.txt)')
print('→', dist / 'index.html')

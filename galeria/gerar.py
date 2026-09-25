# Monta a galeria de moldes a partir de moldes/*/ (molde.json + dados.json + saida/<id>/*.png).
# Por post publica 2 imagens: <id>-painel.jpg (miniatura) e <id>-slides.jpg (todos os slides).
# Uso: python3 galeria/gerar.py   -> gera galeria/dist/index.html e as imagens em galeria/dist/img/
# Requer Pillow (pip install pillow). Rode antes o "npm run gerar" de cada molde.
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
    """Nome do post na galeria: "titulo" (molde Estrutura de Peças) ou "destaque" (Carrossel Explicativo)."""
    t = c.get('titulo') or c.get('destaque') or c['id']
    return ' '.join(t) if isinstance(t, list) else t


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
        # Uma tira com todos os slides lado a lado (720x900 cada): 1 arquivo por post no visualizador,
        # para caber no limite de arquivos da página publicada.
        tira = Image.new('RGB', (720 * len(slides), 900))
        for k, s in enumerate(slides):
            tira.paste(Image.open(s).convert('RGB').resize((720, 900), Image.LANCZOS), (720 * k, 0))
        (dist / base).parent.mkdir(parents=True, exist_ok=True)
        tira.save(dist / f'{base}-slides.jpg', 'JPEG', quality=80, optimize=True, progressive=True)
        painel = saida / 'painel.png'
        jpeg(painel if painel.exists() else slides[0], dist / f'{base}-painel.jpg', 1200, 78)
        posts.append({
            'id': c['id'],
            'titulo': titulo(c),
            'tema': c.get('tema', ''),
            'topicos': len(c.get('topicos', [])),
            'painel': f'{base}-painel.jpg',
            'tira': f'{base}-slides.jpg',
            'n': len(slides),
        })
    meta['posts'] = posts
    moldes.append(meta)
    print(f'✓ {meta["nome"]}: {len(posts)} posts')

html = (raiz / 'modelo.html').read_text('utf8')
dados = json.dumps(moldes, ensure_ascii=False).replace('</', '<\\/')
(dist / 'index.html').write_text(html.replace('/*__DADOS__*/[]', dados), 'utf8')
print('→', dist / 'index.html')

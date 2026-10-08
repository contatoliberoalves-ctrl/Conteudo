# Funções do gerar.py usadas também pelo atualizar.py.
import json
import re
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parent
GALERIAS = json.loads((RAIZ / 'galerias.json').read_text('utf8'))


def galeria_de(molde):
    """Chave da galeria do molde em galerias.json ("principal" para os que não estão em outra)."""
    return next((k for k, g in GALERIAS.items() if molde in g.get('moldes', [])), 'principal')


def pagina(chave, moldes):
    """HTML da galeria `chave`, com os moldes dela e o link para as outras galerias."""
    g = GALERIAS[chave]
    outras = [{'nome': o['nome'], 'url': o['url']} for k, o in GALERIAS.items() if k != chave and o.get('url')]
    info = json.dumps({'nome': g['nome'], 'outras': outras}, ensure_ascii=False).replace('</', '<\\/')
    dados = json.dumps(moldes, ensure_ascii=False).replace('</', '<\\/')
    html = (RAIZ / 'modelo.html').read_text('utf8').replace('/*__DADOS__*/[]', dados).replace('/*__GALERIA__*/null', info)
    return re.sub(r'<title>.*?</title>', f'<title>{g["nome"]}</title>', html, count=1)

def jpeg(origem, destino, largura, qualidade=82):
    im = Image.open(origem).convert('RGB')
    if im.width > largura:
        im = im.resize((largura, round(im.height * largura / im.width)), Image.LANCZOS)
    destino.parent.mkdir(parents=True, exist_ok=True)
    im.save(destino, 'JPEG', quality=qualidade, optimize=True, progressive=True)


def tamanho_tira(slides):
    """Tamanho de cada slide na tira: o original; nos slides deitados (aula, 1920×1080), 1600×900, nítido
    no PDF e com 10 slides por parte da tira (a galeria tem limite de arquivos por versão)."""
    w, h = Image.open(slides[0]).size
    if w > h and w > 1600:
        return 1600, round(h * 1600 / w)
    return w, h


def salvar_tira(slides, dist, base):
    """Grava os slides lado a lado em resolução cheia. O WebP aceita no máximo 16.383 px de largura,
    então a tira é dividida em partes: <base>-slides.webp (1ª), <base>-slides-2.webp, … Devolve
    (largura, altura, slides por parte, arquivos gravados)."""
    larg, alt = tamanho_tira(slides)
    por = max(1, 16000 // larg)
    arquivos = []
    for i in range(0, len(slides), por):
        grupo = slides[i:i + por]
        tira = Image.new('RGB', (larg * len(grupo), alt))
        for k, s in enumerate(grupo):
            tira.paste(Image.open(s).convert('RGB').resize((larg, alt), Image.LANCZOS), (larg * k, 0))
        nome = f'{base}-slides.webp' if i == 0 else f'{base}-slides-{i // por + 1}.webp'
        (dist / nome).parent.mkdir(parents=True, exist_ok=True)
        tira.save(dist / nome, 'WEBP', quality=86, method=5)
        arquivos.append(nome)
    return larg, alt, por, arquivos


def titulo(c):
    """Nome do post na galeria: "titulo" (Estrutura de Peças), "destaque" (Carrossel Explicativo) ou "name" (Carrossel Infinito)."""
    t = c.get('titulo') or c.get('destaque') or c.get('name') or c['id']
    return ' '.join(t) if isinstance(t, list) else t

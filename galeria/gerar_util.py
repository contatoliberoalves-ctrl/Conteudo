# Funções do gerar.py usadas também pelo atualizar.py.
from PIL import Image

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

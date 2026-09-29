# Funções do gerar.py usadas também pelo atualizar.py.
from PIL import Image

def jpeg(origem, destino, largura, qualidade=82):
    im = Image.open(origem).convert('RGB')
    if im.width > largura:
        im = im.resize((largura, round(im.height * largura / im.width)), Image.LANCZOS)
    destino.parent.mkdir(parents=True, exist_ok=True)
    im.save(destino, 'JPEG', quality=qualidade, optimize=True, progressive=True)


def tamanho_tira(slides):
    """Tamanho de cada slide na tira: o original, menos nos slides deitados (aula, 1920×1080), que
    encolhem para a tira não passar de 16.000 px de largura (limite do WebP)."""
    w, h = Image.open(slides[0]).size
    larg = min(w, 16000 // len(slides))
    return larg, round(h * larg / w)


def titulo(c):
    """Nome do post na galeria: "titulo" (Estrutura de Peças), "destaque" (Carrossel Explicativo) ou "name" (Carrossel Infinito)."""
    t = c.get('titulo') or c.get('destaque') or c.get('name') or c['id']
    return ' '.join(t) if isinstance(t, list) else t

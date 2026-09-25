# Recorta as fotos originais (de câmera) para as capas: 1224x1200 (proporção 1020:1000),
# rosto a ~30% da altura, orientação EXIF corrigida. As fotos ficam fora do git (repositório público).
# Uso: python3 recortar_fotos.py <pasta-com-os-originais>   -> grava em fotos/<nome>.jpg
# Outros moldes importam C e recortar() daqui, com outro tamanho de saída.
# Requer Pillow. Para uma foto nova, acrescente em C: nome do arquivo sem extensão ->
# (x do rosto, y do rosto, largura do recorte), em frações da foto já na orientação certa.
import json
import os
import re
import sys
import unicodedata
from pathlib import Path

from PIL import Image, ImageOps

C={
'CONSTITUCIONAL-14':(.55,.33,.8),'CONSTITUCIONAL-17':(.50,.43,.8),'CONSTITUCIONAL-24':(.47,.31,.8),'CONSTITUCIONAL-25':(.50,.31,.8),
'CONSTITUCIONAL-27':(.52,.37,.8),'CONSTITUCIONAL-3':(.45,.37,.85),
'DSC08680':(.60,.31,.55),'DSC08700':(.50,.33,.55),'DSC08712':(.50,.41,.5),'DSC08713':(.50,.42,.5),'DSC08716':(.52,.45,.45),
'DSC08842':(.58,.35,.55),'DSC08848':(.55,.35,.55),'DSC08859':(.50,.47,.4),'DSC08879':(.59,.37,.5),'DSC08888':(.74,.37,.5),
'DSC08906':(.47,.29,.7),'DSC08914':(.52,.22,.75),'DSC08915':(.50,.22,.75),'DSC08920':(.49,.26,.7),'DSC08922':(.50,.26,.7),
'DSC08925':(.48,.22,.75),'DSC08928':(.49,.24,.75),
'ÉTICA-13':(.36,.34,.8),'ÉTICA-14':(.35,.34,.8),'ÉTICA-17':(.44,.24,.85),'ÉTICA-22':(.48,.30,.5),'ÉTICA-23':(.50,.35,.5),
'ÉTICA-24':(.66,.39,.45),'ÉTICA-25':(.50,.32,.5),'ÉTICA-27':(.50,.38,.7),'ÉTICA-31':(.47,.44,.7),'ÉTICA-4':(.50,.34,.8),'ÉTICA-9':(.41,.40,.7),
'IMG_3156':(.50,.35,.85),'IMG_3159':(.50,.33,.85),'IMG_3160':(.50,.35,.85),'IMG_3161':(.50,.35,.85),
'IMG_5366':(.47,.31,.85),'IMG_5372':(.50,.33,.85),
'WhatsApp Image 2026-09-25 at 09.35.13 (1)':(.50,.39,.35),'WhatsApp Image 2026-09-25 at 09.35.13 (2)':(.46,.33,.6),
'WhatsApp Image 2026-09-25 at 09.35.13':(.55,.37,.55),'WhatsApp Image 2026-09-25 at 09.35.14 (1)':(.50,.27,.7),
'WhatsApp Image 2026-09-25 at 09.35.14 (2)':(.41,.50,.6),
'_-0207':(.46,.17,.6),'_-0211':(.47,.25,.6),'_-0322':(.53,.35,.8),'_-0341':(.52,.27,.55),'_-0357':(.45,.27,.55),
'_-0458':(.51,.31,.8),'_-0465':(.48,.29,.8),'_-0467':(.44,.31,.8),'_-0547':(.45,.33,.8),'_-0557':(.50,.26,.8),
'_-0558':(.47,.31,.6),'_-0561':(.48,.26,.75),'_-1534':(.48,.29,.75),'_-1539':(.51,.34,.8),
}


def slug(nome):
    """Nome do recorte: minúsculo, sem acento, só letras/números e hífens (ex.: "ÉTICA-13" -> "etica-13")."""
    sem_acento = unicodedata.normalize('NFD', nome).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]+', '-', sem_acento.lower()).strip('-')


def recortar(origem, destino, largura=1224, altura=1200, rosto_y=0.30, caixa=(1020, 1000), margem=1.8):
    """Recorta cada foto de C em largura x altura, com o rosto a rosto_y da altura.

    Também grava fotos/fontes/<nome>.jpg: a mesma foto com margem em volta (janela `margem` vezes
    maior, na escala da caixa da capa, `caixa` = largura x altura em px no slide) e fotos/fontes.json
    com o tamanho da fonte e onde o recorte fica dentro dela (ox, oy). O editor de capa da galeria e o
    campo `fotoAjuste` do dados.json usam isso para mover/ampliar a foto sem sair do quadro."""
    fontes, meta = Path(destino) / 'fontes', {}
    fontes.mkdir(parents=True, exist_ok=True)
    proporcao = altura / largura
    origem, destino = Path(origem), Path(destino)
    destino.mkdir(parents=True, exist_ok=True)
    arquivos = {unicodedata.normalize('NFC', f.stem): f for f in origem.iterdir() if f.suffix.lower() in ('.jpg', '.jpeg', '.png')}
    for nome, (fx, fy, w) in C.items():
        if nome not in arquivos:
            print('  ! não encontrada:', nome)
            continue
        im = ImageOps.exif_transpose(Image.open(arquivos[nome])).convert('RGB')
        W, H = im.size
        cw = w * W
        ch = cw * proporcao
        if ch > H:
            ch = H
            cw = ch / proporcao
        left = min(max(fx * W - cw / 2, 0), W - cw)
        top = min(max(fy * H - rosto_y * ch, 0), H - ch)
        recorte = im.crop((round(left), round(top), round(left + cw), round(top + ch))).resize((largura, altura), Image.LANCZOS)
        saida = destino / (slug(nome) + '.jpg')
        recorte.save(saida, quality=86, optimize=True, progressive=True)
        # fonte com margem, na escala da caixa (1 px da fonte = 1 px do slide)
        esc = caixa[0] / cw
        ew, eh = min(W, cw * margem), min(H, ch * margem)
        el = min(max(left + cw / 2 - ew / 2, 0), W - ew)
        et = min(max(top + ch / 2 - eh / 2, 0), H - eh)
        fw, fh = round(ew * esc), round(eh * esc)
        im.crop((round(el), round(et), round(el + ew), round(et + eh))).resize((fw, fh), Image.LANCZOS) \
          .save(fontes / saida.name, quality=84, optimize=True, progressive=True)
        meta[saida.stem] = {'w': fw, 'h': fh, 'ox': round((left - el) * esc), 'oy': round((top - et) * esc)}
        print('✓', saida.name)
    antigo = json.loads((Path(destino) / 'fontes.json').read_text()) if (Path(destino) / 'fontes.json').exists() else {}
    (Path(destino) / 'fontes.json').write_text(json.dumps({**antigo, **meta}, indent=1, sort_keys=True))


if __name__ == '__main__':
    recortar(sys.argv[1], Path(__file__).resolve().parent / 'fotos')

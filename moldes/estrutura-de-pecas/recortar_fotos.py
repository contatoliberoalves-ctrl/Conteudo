# Recorta as fotos originais (de câmera) para as capas: 1224x1200 (proporção 1020:1000),
# rosto a ~30% da altura, orientação EXIF corrigida. As fotos ficam fora do git (repositório público).
# Uso: python3 recortar_fotos.py <pasta-com-os-originais>   -> grava em fotos/<nome>.jpg
# Requer Pillow. Para uma foto nova, acrescente em C: nome do arquivo sem extensão ->
# (x do rosto, y do rosto, largura do recorte), em frações da foto já na orientação certa.
import os
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
}

PROPORCAO = 1000 / 1020
origem = Path(sys.argv[1])
destino = Path(__file__).resolve().parent / 'fotos'
arquivos = {unicodedata.normalize('NFC', f.stem): f for f in origem.iterdir() if f.suffix.lower() in ('.jpg', '.jpeg', '.png')}
for nome, (fx, fy, w) in C.items():
    if nome not in arquivos:
        print('  ! não encontrada:', nome)
        continue
    im = ImageOps.exif_transpose(Image.open(arquivos[nome])).convert('RGB')
    W, H = im.size
    cw = w * W
    ch = cw * PROPORCAO
    if ch > H:
        ch = H
        cw = ch / PROPORCAO
    left = min(max(fx * W - cw / 2, 0), W - cw)
    top = min(max(fy * H - 0.30 * ch, 0), H - ch)
    recorte = im.crop((round(left), round(top), round(left + cw), round(top + ch))).resize((1224, 1200), Image.LANCZOS)
    saida = destino / (nome.lower().replace('é', 'e') + '.jpg')
    recorte.save(saida, quality=86, optimize=True, progressive=True)
    print('✓', saida.name)

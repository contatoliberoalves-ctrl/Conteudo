# Recorta as fotos originais para a capa deste molde: 1080x1350 (tela cheia), rosto a ~24% da altura.
# Usa a mesma tabela de posições de rosto (C) do molde estrutura-de-pecas.
# Uso: python3 recortar_fotos.py <pasta-com-os-originais>   -> grava em fotos/<nome>.jpg
import importlib.util
import sys
from pathlib import Path

aqui = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('base', aqui.parent / 'estrutura-de-pecas' / 'recortar_fotos.py')
base = importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)

if __name__ == '__main__':
    base.recortar(sys.argv[1], aqui / 'fotos', largura=1080, altura=1350, rosto_y=0.24)

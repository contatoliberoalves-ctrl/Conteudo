# Monta a galeria "Vídeos Claude" (https://claude.ai/artifact/Q7vHDVYXuDx3TpFo3GfEHD) a partir de pagina.tpl,
# dados.json (coleções e vídeos) e assets.json (vídeos guardados no armazenamento da página: id -> /_blob/…).
# Uso: python3 galeria/videos-claude/montar.py <pasta-de-saida>  → <pasta>/index.html
# Vídeos de outras páginas entram por cópia no servidor (files: {"arquivo/video/x.mp4": {"artifact": url, "path": "video/x.mp4"}},
# no máximo 64 MB por publicação); vídeos locais entram como assets (Artifact publish com url, asset: true, file_paths).
import json, os, sys
aqui = os.path.dirname(os.path.abspath(__file__))
saida = sys.argv[1] if len(sys.argv) > 1 else aqui
t = open(os.path.join(aqui, 'pagina.tpl')).read()
assets = json.load(open(os.path.join(aqui, 'assets.json')))
d = json.dumps(json.load(open(os.path.join(aqui, 'dados.json'))), ensure_ascii=False).replace('</', '<\\/')
os.makedirs(saida, exist_ok=True)
open(os.path.join(saida, 'index.html'), 'w').write(t.replace('__DADOS__', d).replace('__ASSETS__', json.dumps(assets)))
print('✓', os.path.join(saida, 'index.html'))

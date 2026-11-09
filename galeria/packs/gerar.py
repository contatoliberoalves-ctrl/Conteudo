"""Galeria dos packs de concursos (molde concurso-pdf) -> galeria/dist-packs/.

Uso: python3 galeria/packs/gerar.py  (gere antes os PDFs: node moldes/concurso-pdf/render.mjs)
Saída: dist-packs/index.html, dist-packs/pdf/<id>.pdf e dist-packs/img/<id>.webp (as páginas
empilhadas numa tira, 2 arquivos por material). Imprime o `files` para o Artifact.
"""
import json, re, shutil
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parents[2]
MOLDE = RAIZ / 'moldes' / 'concurso-pdf'
DIST = RAIZ / 'galeria' / 'dist-packs'
LARG = 760  # largura de cada página na tira

colecoes = json.loads((MOLDE / 'colecoes.json').read_text())
dados = []
for f in sorted(MOLDE.glob('dados*.json')):
    dados += json.loads(f.read_text())

(DIST / 'pdf').mkdir(parents=True, exist_ok=True)
(DIST / 'img').mkdir(parents=True, exist_ok=True)
files, packs = {}, {}
for m in dados:
    saida = MOLDE / 'saida' / m['id']
    pdf = saida / f"{m['id']}.pdf"
    pngs = sorted(saida.glob('[0-9]*.png'), key=lambda p: int(p.stem))
    if not pdf.exists() or not pngs:
        print('sem saída, fica de fora:', m['id'])
        continue
    ims = [Image.open(p).convert('RGB') for p in pngs]
    h = round(ims[0].height * LARG / ims[0].width)
    tira = Image.new('RGB', (LARG, h * len(ims)), 'white')
    for i, im in enumerate(ims):
        tira.paste(im.resize((LARG, h), Image.LANCZOS), (0, i * h))
    tira.save(DIST / 'img' / f"{m['id']}.webp", quality=82, method=6)
    shutil.copy(pdf, DIST / 'pdf' / f"{m['id']}.pdf")
    files[f"img/{m['id']}.webp"] = f"img/{m['id']}.webp"
    files[f"pdf/{m['id']}.pdf"] = f"pdf/{m['id']}.pdf"
    titulo = re.sub(r'\[\[|\]\]', '', ' '.join(m['capa']['titulo']))
    packs.setdefault(m['colecao'], []).append({
        'id': m['id'], 'n': m['n'], 'titulo': titulo, 'sub': m['capa'].get('sub', ''),
        'paginas': len(ims), 'kb': round(pdf.stat().st_size / 1024)})

lista = []
for cid, mats in packs.items():
    c = colecoes[cid]
    lista.append({'id': cid, 'nome': c['nome'], 'sigla': c['sigla'], 'uf': c.get('uf', ''),
                  'grupo': c.get('grupo', 'Outros'), 'banca': c.get('banca', ''), 'cargo': c.get('cargo', ''),
                  'vagas': c.get('vagas', ''), 'prova': c.get('prova', ''),
                  'materiais': sorted(mats, key=lambda x: x['n'])})

modelo = (Path(__file__).parent / 'modelo.html').read_text()
(DIST / 'index.html').write_text(modelo.replace('/*PACKS*/[]', json.dumps(lista, ensure_ascii=False)))
print(f'{len(lista)} coleções, {sum(len(c["materiais"]) for c in lista)} materiais, {len(files)} arquivos')
(DIST / 'files.json').write_text(json.dumps(files, indent=1))
print('files em', DIST / 'files.json')

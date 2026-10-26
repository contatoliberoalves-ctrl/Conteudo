# Lê os .docx da coleção "Constitucional em Mapas" (Prof. Líbero Filho) e gera colecao/mapas.json:
# um item por mapa com número, título, referência, apoio, ramos (rótulo em negrito + texto), aplicação,
# pergunta/resposta e a "composição" indicada no prompt individual (usada para escolher o desenho).
# Uso: python3 colecao/importar_docx.py arquivo1.docx [arquivo2.docx ...]
import json, re, sys
from pathlib import Path
import docx

def rotulo(p):
    # rótulo = runs em negrito do começo do parágrafo
    r = ''
    for run in p.runs:
        if run.bold: r += run.text
        elif r: break
        elif run.text.strip(): return None, p.text.strip()
    resto = p.text[len(r):] if p.text.startswith(r) else p.text
    return r.strip(), resto.strip()

def ler(arq):
    d = docx.Document(arq)
    mapas, m, secao = [], None, None
    for p in d.paragraphs:
        t, st = p.text.strip(), p.style.name
        if not t: continue
        h = re.match(r'Mapa (\d+)\s*[—-]?\s*(.+)', t) if st == 'Heading 1' else None
        if h:
            m = {'numero': int(h.group(1)), 'titulo': h.group(2).strip(), 'ramos': []}
            mapas.append(m); secao = 'inicio'; continue
        if st == 'Heading 1': secao = None if not t.startswith('Arte do mapa') else 'prompt'; continue
        if not m: continue
        if st == 'Heading 2':
            secao = 'ramos' if 'ramos' in t.lower() else ('prompt' if 'prompt' in t.lower() else secao); continue
        if st == 'Source' and secao == 'inicio' and 'referencia' not in m: m['referencia'] = t; continue
        if secao == 'inicio' and st == 'Normal': m['apoio'] = (m.get('apoio', '') + ' ' + t).strip(); continue
        if secao == 'ramos' and st == 'Normal':
            r, txt = rotulo(p)
            if not r: continue
            if r.lower().startswith('aplica'): m['aplicacao'] = txt
            elif r.lower().startswith('confira'):
                q = re.split(r'\s*Resposta:\s*', txt, 1); m['pergunta'] = q[0]; m['resposta'] = q[1] if len(q) > 1 else ''
            else: m['ramos'].append({'titulo': r, 'texto': txt})
        if st == 'Prompt' and 'Composição' in t:
            c = re.search(r'Composição(?: deste mapa)?:\s*(.+?)\.(?:\s|$)', t)
            if c: m['composicao'] = c.group(1)
    return mapas

todos = {}
for a in sys.argv[1:]:
    for m in ler(a): todos[m['numero']] = m
saida = Path(__file__).with_name('mapas.json')
antigos = {m['numero']: m for m in json.loads(saida.read_text())} if saida.exists() else {}
antigos.update(todos)
saida.write_text(json.dumps([antigos[k] for k in sorted(antigos)], ensure_ascii=False, indent=1))
print(len(todos), 'mapas lidos;', len(antigos), 'no total')

# Lê os .docx do autor (conteúdo pago, fora do git) e gera os JSON usados pelos PDFs.
# Uso:
#   python3 extrair.py dicas <arquivo.docx> <id>              → conteudo/<id>.json (dicas numeradas)
#   python3 extrair.py caderno <arquivo.docx> <id> <nome>     → conteudo/<id>-<nome>.json (caderno corrido)
# Dicas: Heading1 = matéria (ou seção de bônus), Heading2 = bloco, linha "Base: ...", e cada dica como
# "**001  □  ****Regra em negrito. **Explicação." Uma seção Heading1 é matéria quando tem dicas; as que vêm
# antes ("Como usar…", "Distribuição…") são a introdução e as que vêm depois, os bônus.
# Caderno: a sequência de parágrafos com o estilo (Heading1–4, Title…) e as tabelas, na ordem do arquivo.
import json, re, sys, zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
AQUI = Path(__file__).resolve().parent

def paragrafo(p):
    s = ''
    for r in p.iter(W + 'r'):
        pr = r.find(W + 'rPr')
        b = pr is not None and pr.find(W + 'b') is not None
        t = ''.join(x.text or '' for x in r.iter(W + 't')).replace('*', '∗')
        s += ('**' + t + '**') if (b and t.strip()) else t
    pp = p.find(W + 'pPr')
    est = ''
    if pp is not None and pp.find(W + 'pStyle') is not None:
        est = pp.find(W + 'pStyle').get(W + 'val')
    return est, s.strip()

limpa = lambda s: re.sub(r'\*\*', '', s).strip()

def linhas(caminho):
    corpo = ET.fromstring(zipfile.ZipFile(caminho).read('word/document.xml')).find(W + 'body')
    for el in corpo:
        if el.tag == W + 'p':
            est, s = paragrafo(el)
            if s:
                yield est, s
        elif el.tag == W + 'tbl':
            yield 'TBL', [[limpa(' '.join(paragrafo(p)[1] for p in tc.iter(W + 'p'))) for tc in tr.findall(W + 'tc')] for tr in el.iter(W + 'tr')]

DICA = re.compile(r'^\*\*(\d{3})\s+□\s+\*\*\*\*(.+?)\s*\*\*\s*(.*)$')

def dicas(docx, pid):
    secoes, atual = [], None
    for est, s in linhas(docx):
        if est == 'Title':
            continue
        if est == 'Heading1':
            atual = {'titulo': s, 'linhas': []}; secoes.append(atual); continue
        if atual is not None:
            atual['linhas'].append((est, s))
    e_mat = lambda sec: any(est != 'TBL' and DICA.match(s) for est, s in sec['linhas'])
    i0 = next(i for i, sec in enumerate(secoes) if e_mat(sec))
    i1 = max(i for i, sec in enumerate(secoes) if e_mat(sec)) + 1
    intro, tabela = [], []
    for sec in secoes[:i0]:
        p = []
        for est, s in sec['linhas']:
            if est == 'TBL': tabela = s
            else: p.append(limpa(s))
        intro.append({'titulo': sec['titulo'], 'p': p})
    materias = []
    for sec in secoes[i0:i1]:
        mat, bloco = {'nome': sec['titulo'], 'rotulo': '', 'blocos': []}, None
        for est, s in sec['linhas']:
            if est == 'Heading2':
                bloco = {'nome': s, 'base': '', 'dicas': []}; mat['blocos'].append(bloco); continue
            m = DICA.match(s) if est != 'TBL' else None
            if m:
                bloco['dicas'].append({'n': int(m.group(1)), 'r': limpa(m.group(2)), 'e': limpa(m.group(3))}); continue
            if est != 'TBL' and s.startswith('Base:'):
                bloco['base'] = s[5:].strip(); continue
            if est != 'TBL' and '•' in s and not mat['rotulo']:
                mat['rotulo'] = s; continue
            print('?? fora do padrão em', sec['titulo'], ':', str(s)[:90])
        materias.append(mat)
    bonus = []
    for sec in secoes[i1:]:
        b, item = {'titulo': sec['titulo'], 'p': [], 'itens': []}, None
        for est, s in sec['linhas']:
            if est == 'TBL':
                b.setdefault('tabelas', []).append(s); continue
            if est == 'Heading2':
                item = {'titulo': s, 'p': []}; b['itens'].append(item); continue
            (item['p'] if item else b['p']).append(limpa(s))
        bonus.append(b)
    n = [d['n'] for m in materias for bl in m['blocos'] for d in bl['dicas']]
    assert n == list(range(1, len(n) + 1)), 'numeração das dicas com falha'
    saida = AQUI / 'conteudo' / f'{pid}.json'
    saida.parent.mkdir(exist_ok=True)
    saida.write_text(json.dumps({'intro': intro, 'tabela': tabela, 'materias': materias, 'bonus': bonus}, ensure_ascii=False, indent=1), 'utf8')
    print(len(n), 'dicas ·', len(materias), 'matérias ·', [b['titulo'] for b in bonus], '→', saida.name)

def caderno(docx, pid, nome):
    blocos = [{'s': est or 'p', 't': s} for est, s in linhas(docx)]
    saida = AQUI / 'conteudo' / f'{pid}-{nome}.json'
    saida.parent.mkdir(exist_ok=True)
    saida.write_text(json.dumps(blocos, ensure_ascii=False, indent=0), 'utf8')
    print(len(blocos), 'blocos →', saida.name)

{'dicas': dicas, 'caderno': caderno}[sys.argv[1]](*sys.argv[2:])

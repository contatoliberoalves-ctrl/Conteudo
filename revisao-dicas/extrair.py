# Lê o .docx das dicas (conteúdo autoral, fora do git) e gera conteudo/<id>.json para o pdf.mjs.
# Uso: python3 extrair.py <arquivo.docx> <id>      (ex.: python3 extrair.py TCE_MA_400_Dicas.docx tce-ma)
# Formato esperado do .docx: Heading1 = matéria, Heading2 = bloco, linha "Base: ...", e cada dica como
# "**001  □  ****Regra em negrito. **Explicação curta." Depois de "Roteiros de revisão por cargo" vêm os bônus.
import json, re, sys, zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'

def paragrafo(p):
    s = ''
    for r in p.iter(W + 'r'):
        pr = r.find(W + 'rPr')
        b = pr is not None and pr.find(W + 'b') is not None
        t = ''.join(x.text or '' for x in r.iter(W + 't'))
        s += ('**' + t + '**') if (b and t.strip()) else t
    pp = p.find(W + 'pPr')
    est = ''
    if pp is not None and pp.find(W + 'pStyle') is not None:
        est = pp.find(W + 'pStyle').get(W + 'val')
    return est, s.strip()

def linhas(caminho):
    corpo = ET.fromstring(zipfile.ZipFile(caminho).read('word/document.xml')).find(W + 'body')
    for el in corpo:
        if el.tag == W + 'p':
            est, s = paragrafo(el)
            if s:
                yield est, s
        elif el.tag == W + 'tbl':
            for tr in el.iter(W + 'tr'):
                yield 'TBL', [' '.join(paragrafo(p)[1] for p in tc.iter(W + 'p')).strip() for tc in tr.findall(W + 'tc')]

DICA = re.compile(r'^\*\*(\d{3})\s+□\s+\*\*\*\*(.+?)\s*\*\*\s*(.*)$')
limpa = lambda s: s.replace('**', '').strip()

def main(docx, pid):
    materias, bonus, intro, tabela = [], [], [], []
    mat = bloco = sec = None
    fase = 'intro'
    for est, s in linhas(docx):
        if est == 'TBL':
            tabela.append(s); continue
        if est == 'Title':
            continue
        if est == 'Heading1':
            if s.startswith('Roteiros de revisão'):
                fase = 'bonus'
            if fase == 'intro' and s in ('Como usar esta revisão', 'Distribuição das dicas'):
                sec = {'titulo': s, 'p': []}; intro.append(sec); continue
            if fase == 'bonus':
                sec = {'titulo': s, 'itens': []}; bonus.append(sec); bloco = None; continue
            fase = 'dicas'
            mat = {'nome': s, 'rotulo': '', 'blocos': []}; materias.append(mat); continue
        if fase == 'intro':
            if sec: sec['p'].append(limpa(s))
            continue
        if fase == 'dicas':
            if est == 'Heading2':
                bloco = {'nome': s, 'base': '', 'dicas': []}; mat['blocos'].append(bloco); continue
            m = DICA.match(s)
            if m:
                bloco['dicas'].append({'n': int(m.group(1)), 'r': limpa(m.group(2)), 'e': limpa(m.group(3))}); continue
            if s.startswith('Base:'):
                bloco['base'] = s[5:].strip(); continue
            if '•' in s and not mat['rotulo']:
                mat['rotulo'] = s; continue
            print('?? linha fora do padrão:', s[:90])
            continue
        # bônus: Heading2 abre um item; parágrafos seguintes são o corpo
        if est == 'Heading2':
            bloco = {'titulo': s, 'p': []}; sec['itens'].append(bloco); continue
        (bloco['p'] if bloco else sec.setdefault('p', [])).append(limpa(s))
    n = [d['n'] for m in materias for b in m['blocos'] for d in b['dicas']]
    assert n == list(range(1, len(n) + 1)), 'numeração das dicas com falha'
    saida = Path(__file__).resolve().parent / 'conteudo' / f'{pid}.json'
    saida.parent.mkdir(exist_ok=True)
    saida.write_text(json.dumps({'intro': intro, 'tabela': tabela, 'materias': materias, 'bonus': bonus}, ensure_ascii=False, indent=1), 'utf8')
    print(len(n), 'dicas ·', len(materias), 'matérias ·', len(bonus), 'seções de bônus →', saida)

main(sys.argv[1], sys.argv[2])

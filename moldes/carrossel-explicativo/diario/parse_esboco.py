import re,json
L=open(__import__('sys').argv[1] if len(__import__('sys').argv) > 1 else 'esboco.md').read().split('\n')
dias=[];cur=None;sec=None
for l in L:
    l=l.lstrip('*').strip()
    m=re.match(r'^DIA ?(\d+) ?[–-] ?(.*)$',l,re.I)
    if m:
        cur={'dia':int(m.group(1)),'tema':m.group(2).strip(),'dica':[],'explicacao':[],'tabela':[],'questao':[],'gabarito':[]};dias.append(cur);sec=None;continue
    key={'DICA DE OURO':'dica','EXPLICAÇÃO':'explicacao','TABELINHA':'tabela','QUESTÃO':'questao','GABARITO':'gabarito'}.get(l.upper().strip())
    if key: sec=key;continue
    if cur and sec: cur[sec].append(l)
json.dump(dias,open('esboco.json','w'),ensure_ascii=False,indent=1)

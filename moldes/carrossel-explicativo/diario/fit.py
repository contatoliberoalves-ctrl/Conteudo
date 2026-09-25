# Gera, lê os avisos de texto sobrando e ajusta: 1º compacto; depois corta parágrafos da explicação
# ou itens da tabela (do fim). Nunca corta a questão.
import json, re, subprocess, os
M = str(__import__('pathlib').Path(__file__).resolve().parents[1]) + '/'
env = dict(os.environ, CHROMIUM_PATH='/opt/pw-browsers/chromium', RENDER_PROXY=os.environ['HTTPS_PROXY'])
cortes = {}
def salvar(P):
    todos = json.load(open(M + 'dados.json'))
    D = [c for c in todos if not c['id'].startswith('diario-')]
    # Mantém a capa/estilo já escolhidos para cada post (variação do feed); posts novos seguem o rodízio.
    antes = {c['id']: c for c in todos}
    for i, c in enumerate(P):
        k = len(D) + i
        c.setdefault('capa', antes.get(c['id'], {}).get('capa') or 'BCDFA'[(k + k // 5) % 5])
        c.setdefault('estilo', antes.get(c['id'], {}).get('estilo') or ['caderno', 'noturno', 'classico'][k % 3])
    json.dump(D + P, open(M + 'dados.json', 'w'), ensure_ascii=False, indent=2); open(M + 'dados.json', 'a').write('\n')
P = json.load(open('diario_posts.json'))
pend = [c['id'] for c in P]
for rodada in range(12):
    salvar(P)
    ruins = {}
    for id in pend:
        out = subprocess.run(['node', 'render.mjs', id], cwd=M, env=env, capture_output=True, text=True).stdout
        for m in re.finditer(r'slide (\d+): conteúdo passa (\d+)px', out):
            ruins.setdefault(id, []).append((int(m.group(1)), int(m.group(2))))
    if not ruins: break
    print('rodada', rodada, {k: v for k, v in ruins.items()})
    for id, lst in ruins.items():
        post = next(c for c in P if c['id'] == id)
        for n, px in lst:
            s = post['slides'][n - 2]
            if not s.get('compacto'):
                s['compacto'] = True; continue
            t = s.get('_tipo')
            if t == 'exp':
                txt = s['texto']
                if len(txt) > 1: cortes.setdefault(id, []).append(('explicação', txt.pop()))
                else:  # um parágrafo só: corta a última frase
                    fr = re.split(r'(?<=[.;])\s+', txt[0])
                    if len(fr) > 1: cortes.setdefault(id, []).append(('explicação', fr.pop())); txt[0] = ' '.join(fr)
            elif t == 'tab' and len(s['lista']) > 2:
                cortes.setdefault(id, []).append(('tabela', s['lista'].pop()))
            elif t == 'dica':
                fr = re.split(r'(?<=[.;])\s+', s['texto'][0])
                if len(fr) > 1: cortes.setdefault(id, []).append(('dica', fr.pop())); s['texto'][0] = ' '.join(fr)
            else:
                cortes.setdefault(id, []).append(('NÃO CABE', f'slide {n} ({t}) passa {px}px'))
    pend = list(ruins)
json.dump(P, open('diario_posts.json', 'w'), ensure_ascii=False, indent=2)
json.dump(cortes, open('cortes.json', 'w'), ensure_ascii=False, indent=2)
print('restam:', ruins if ruins else 'nada')

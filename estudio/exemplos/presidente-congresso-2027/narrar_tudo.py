# Gera as 3 narrações com a voz clonada (perfil do estúdio de voz), mantendo o modelo carregado.
import sys, json, re
sys.path.insert(0, '/home/user/Conteudo/estudio')
from ev import vozes
p = vozes.perfil()
for n in ['1-linha-do-tempo', '2-cinco-regras']:
    vozes.gerar(open(f'{n}.fala.txt').read(), p['motor'], p['ref'], p['ref_texto'], f'audio/{n}.wav', **p.get('parametros', {}))
    print('ok', n, flush=True)
linhas = [l.split(': ', 1) for l in open('3-tres-erros.fala.txt').read().strip().split('\n')]
for i, (quem, txt) in enumerate(linhas):
    if quem == 'LIBERO':
        vozes.gerar(txt, p['motor'], p['ref'], p['ref_texto'], f'audio/v3-{i:02d}.wav', **p.get('parametros', {}))
        print('ok v3', i, flush=True)

import json, subprocess
from pathlib import Path
M = Path('/home/user/Conteudo/moldes/dark-constitucional')
V = Path('/tmp/claude-0/-home-user-Conteudo/e5c1d3d9-a352-5c85-9877-13e633f3b970/scratchpad/vt')
OUT = M / 'saida' / 'videoteca-yt'
ativos = json.loads((V / 'ativos.json').read_text()) if (V / 'ativos.json').exists() else {}
dados = json.loads((M / 'dados.json').read_text('utf8'))
def dur(p):
    o = subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(p)],capture_output=True,text=True).stdout
    return float(o.strip() or 0)
itens = []
for n, d in enumerate(dados, 1):
    i = d['id']; r = json.loads((M/'roteiros'/f'{i}.json').read_text('utf8')); s = M/'saida'/i
    rec = {'id': i, 'n': n, 'titulo': r['titulo'], 'serie': r.get('serie',''),
           'legenda': (s/'legenda.txt').read_text('utf8').strip(),
           'descricao': (s/'youtube-descricao.txt').read_text('utf8').strip() if (s/'youtube-descricao.txt').exists() else ''}
    for k in ('reel','yt'):
        f = V/k/f'{i}.mp4'
        rec['mb_'+k] = round(f.stat().st_size/1e6,1)
        rec['url_'+k] = ativos.get(f'{k}/{i}.mp4', f'video-{k}/{i}.mp4')
    rec['seg'] = round(dur(V/'reel'/f'{i}.mp4'))
    itens.append(rec)
itens.reverse()
js = json.dumps(itens, ensure_ascii=False).replace('<', '\\u003c')
pag = (V/'molde.html').read_text('utf8').replace('__DADOS__', js)
OUT.mkdir(exist_ok=True); (OUT/'index.html').write_text(pag,'utf8')
for k in ('reel','yt'):
    dst = OUT/f'capa-{k}'; dst.mkdir(exist_ok=True)
    for f in (V/f'capa-{k}').glob('*.jpg'):
        t = dst/f.name
        if not t.exists(): t.write_bytes(f.read_bytes())
print('ok', len(itens))

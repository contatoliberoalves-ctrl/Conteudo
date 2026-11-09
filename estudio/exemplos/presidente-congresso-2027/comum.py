# Partes comuns dos 3 vídeos: gatilhos por palavra, legenda karaokê no HTML, cabeça da página.
import json, re, unicodedata, html
E = html.escape
def norm(s):
    s = "".join(c for c in unicodedata.normalize("NFD", s.lower()) if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9 ]", "", s)
class Palavras:
    def __init__(self, arq):
        self.W = [w for w in json.load(open(arq))['words'] if w.get('start') is not None]
        self.T = [norm(w['text']) for w in self.W]
        self.total = round(self.W[-1]['end'] + 0.8, 2)
    def t(self, trig, depois=0.0):
        tt = norm(trig).split()
        for i in range(len(self.T) - len(tt) + 1):
            if self.T[i:i+len(tt)] == tt and self.W[i]['start'] >= depois - 0.01:
                return round(self.W[i]['start'], 2)
        # tolerante: a transcrição às vezes erra uma letra ("ajugou" por "julgou")
        import difflib
        best, bi = 0, None
        for i in range(len(self.T) - len(tt) + 1):
            if self.W[i]['start'] < depois - 0.01: continue
            r = difflib.SequenceMatcher(None, ' '.join(self.T[i:i+len(tt)]), ' '.join(tt)).ratio()
            if r > best: best, bi = r, i
        if bi is not None and best >= 0.72:
            print(f'  (gatilho aproximado: {trig!r} ~ {" ".join(self.T[bi:bi+len(tt)])!r})')
            return round(self.W[bi]['start'], 2)
        raise SystemExit(f'gatilho não achado: {trig!r} depois de {depois}')
def legenda(P, js, troca=None, top=1530, cor='#6FD39B'):
    """Grupos de até 3 palavras (quebra na pontuação); a palavra falada fica na cor de destaque."""
    troca = troca or {}
    W = P.W; grupos, g = [], []
    for k, w in enumerate(W):
        g.append(k)
        if len(g) == 3 or re.search(r'[.,?!:]$', w['text']): grupos.append(g); g = []
    if g: grupos.append(g)
    out = []
    for gi, g in enumerate(grupos):
        a = W[g[0]]['start']; b = W[grupos[gi+1][0]]['start'] if gi + 1 < len(grupos) else P.total
        txt = lambda k: E(troca.get(norm(W[k]['text']), W[k]['text']).rstrip(',.?!:'))
        out.append(f'<div class="lg" id="g{gi}" style="top:{top}px">' + ' '.join(f'<span id="w{k}">{txt(k)}</span>' for k in g) + '</div>')
        js.append(f'tl.set("#g{gi}",{{visibility:"visible"}},{a});tl.set("#g{gi}",{{visibility:"hidden"}},{b});')
        for k in g:
            fim = W[k+1]['start'] if k + 1 < len(W) else P.total
            js.append(f'tl.set("#w{k}",{{color:"{cor}"}},{W[k]["start"]});tl.set("#w{k}",{{color:"#FFFFFF"}},{fim});')
    return ''.join(out)
CABECA = '''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Antonio:wght@600;700&family=Poppins:wght@500;600;700;800&display=swap">
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>'''
CSS_BASE = '''*{margin:0;padding:0;box-sizing:border-box}html,body{width:1080px;height:1920px;overflow:hidden}
.lg{position:absolute;left:60px;right:60px;text-align:center;visibility:hidden;font-family:Poppins;font-weight:800;font-size:70px;line-height:1.1;text-transform:uppercase;color:#fff;z-index:20;text-shadow:0 4px 18px rgba(0,0,0,.45)}
.credito{position:absolute;left:0;right:0;bottom:46px;text-align:center;font-family:Poppins;font-weight:500;font-size:20px;color:rgba(255,255,255,.55);z-index:21}'''
def pagina(css, corpo, js, total):
    return (CABECA + f'<style>{CSS_BASE}{css}</style></head><body><div id="root" data-duration="{total}">{corpo}</div>'
            f'<script>window.__timelines={{}};const tl=gsap.timeline({{paused:true}});{"".join(js)}window.__timelines.main=tl;</script></body></html>')

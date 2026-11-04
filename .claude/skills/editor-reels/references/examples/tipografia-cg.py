# Vídeo 2: "5 regras" em tipografia animada de tela cheia, identidade do @constitucionalgabaritado
# (verde-escuro / verde / verde-claro / papel; Antonio + Poppins; sem pílulas nem balões).
import json, sys, re, unicodedata, html
d = json.load(open(sys.argv[1])); W = [w for w in d['words'] if w.get('start') is not None]
def norm(s):
    s = "".join(c for c in unicodedata.normalize("NFD", s.lower()) if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9 ]", "", s)
T = [norm(w['text']) for w in W]
def find(trig, after=0):
    tt = norm(trig).split()
    for i in range(len(T) - len(tt) + 1):
        if T[i:i+len(tt)] == tt and W[i]['start'] >= after - 0.01: return round(W[i]['start'], 2)
    raise SystemExit('gatilho não achado: ' + trig)
TOTAL = round(W[-1]['end'] + 0.7, 2)
E = html.escape
# cenas: (gatilho, fundo, numero, titulo, linhas extra [(gatilho, html)])
CENAS = [
 ("Cinco regras", "escuro", "5", "REGRAS PRA PRESIDIR O CONGRESSO", [("quarta", "A 4ª JÁ BARROU O ALCOLUMBRE")]),
 ("Primeiro", "papel", "1", "SER SENADOR", [("Pelo art", "CF · art. 57, § 5º"), ("trinta e cinco", "35 ANOS OU MAIS · art. 14, § 3º, VI, a")]),
 ("Segundo", "papel", "2", "BRASILEIRO NATO", [("naturalizado", "NATURALIZADO VOTA, MAS NÃO PRESIDE"), ("Pelo art 12", "CF · art. 12, § 3º, III")]),
 ("Terceiro", "escuro", "3", "VENCER O VOTO SECRETO", [("41", "41 DE 81 GARANTEM A CADEIRA")]),
 ("Quarto", "papel", "4", "SEM REELEIÇÃO NA MESMA LEGISLATURA", [("Foi essa regra", "STF, 2020: ALCOLUMBRE NÃO PODE"), ("Agora", "2027: LEGISLATURA NOVA. PODE")]),
 ("Quinto", "papel", "5", "MANDATO DE 2 ANOS", [("começa tudo", "CF · art. 57, § 4º")]),
 ("Comenta", "escuro", "", "COMENTA <b>SENADO</b>", [("mando", "E RECEBA O RESUMO COM OS 5 ARTIGOS")]),
]
ini = [find(c[0]) for c in CENAS]; fim = ini[1:] + [TOTAL]
cenas_html, js = [], []
for i, ((trig, fundo, num, tit, extras), a, b) in enumerate(zip(CENAS, ini, fim)):
    ex = "".join(f'<div class="ex" id="x{i}_{j}">{E(t)}</div>' for j, (_, t) in enumerate(extras))
    numh = f'<div class="num" id="n{i}">{num}</div>' if num else ''
    cenas_html.append(f'<section class="cena {fundo}" id="c{i}">{numh}<h1 id="h{i}">{tit}</h1><div class="barra" id="b{i}"></div>{ex}</section>')
    js.append(f'tl.set("#c{i}",{{visibility:"visible"}},{a});tl.set("#c{i}",{{visibility:"hidden"}},{b});')
    js.append(f'tl.fromTo("#c{i}",{{clipPath:"inset(0 0 100% 0)"}},{{clipPath:"inset(0 0 0% 0)",duration:0.28,ease:"power3.out"}},{a});')
    if num: js.append(f'tl.fromTo("#n{i}",{{opacity:0,x:-120}},{{opacity:1,x:0,duration:0.35,ease:"back.out(1.6)"}},{a+0.05});')
    js.append(f'tl.fromTo("#h{i}",{{opacity:0,y:60}},{{opacity:1,y:0,duration:0.32,ease:"power3.out"}},{a+0.12});')
    js.append(f'tl.fromTo("#b{i}",{{scaleX:0}},{{scaleX:1,duration:0.5,ease:"power2.out"}},{a+0.2});')
    for j, (g, _) in enumerate(extras):
        t = find(g, a)
        js.append(f'tl.fromTo("#x{i}_{j}",{{opacity:0,y:30}},{{opacity:1,y:0,duration:0.28,ease:"power3.out"}},{t});')
    js.append(f'tl.to("#prog i:nth-child(-n+{min(i,5)})",{{background:"#6FD39B",duration:0.2}},{a});' if 0 < i <= 5 else '')
# legenda: grupos de até 3 palavras, quebra em pontuação; a palavra dita fica verde
fix = {'art.': 'artigo', 'senado': 'SENADO'}
grupos, g = [], []
for k, w in enumerate(W):
    g.append(k)
    if len(g) == 3 or re.search(r'[.,?!]$', w['text']): grupos.append(g); g = []
if g: grupos.append(g)
leg = []
for gi, g in enumerate(grupos):
    a = W[g[0]]['start']; b = W[grupos[gi+1][0]]['start'] if gi + 1 < len(grupos) else TOTAL
    spans = " ".join(f'<span id="w{k}">{E(fix.get(W[k]["text"], W[k]["text"]).rstrip(",.?!"))}</span>' for k in g)
    leg.append(f'<div class="lg" id="g{gi}">{spans}</div>')
    js.append(f'tl.set("#g{gi}",{{visibility:"visible"}},{a});tl.set("#g{gi}",{{visibility:"hidden"}},{b});')
    for k in g:
        js.append(f'tl.set("#w{k}",{{color:"#6FD39B"}},{W[k]["start"]});tl.set("#w{k}",{{color:"#FFFFFF"}},{W[k+1]["start"] if k+1 < len(W) else TOTAL});')
page = f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Antonio:wght@600;700&family=Poppins:wght@500;600;700;800&display=swap">
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>*{{margin:0;padding:0;box-sizing:border-box}}html,body{{width:1080px;height:1920px;overflow:hidden;background:#0B2619}}
.cena{{position:absolute;inset:0;visibility:hidden;padding:300px 90px 0;display:flex;flex-direction:column;gap:34px}}
.escuro{{background:linear-gradient(170deg,#123A27 0%,#0B2619 60%,#071A10 100%);color:#fff}}
.papel{{background:#F2F6F3;color:#0B2619}}
.num{{font-family:Antonio;font-weight:700;font-size:430px;line-height:.8;color:transparent;-webkit-text-stroke:6px #1F8A55}}
.escuro .num{{-webkit-text-stroke-color:#6FD39B}}
h1{{font-family:Antonio;font-weight:700;font-size:150px;line-height:.92;text-transform:uppercase;letter-spacing:-1px}}
h1 b{{color:#6FD39B}}
.barra{{height:14px;width:300px;background:#1F8A55;transform-origin:left}}
.escuro .barra{{background:#6FD39B}}
.ex{{font-family:Poppins;font-weight:700;font-size:44px;line-height:1.2;border-left:10px solid #1F8A55;padding:6px 0 6px 26px;opacity:0}}
.escuro .ex{{border-color:#6FD39B}}
#topo{{position:absolute;left:90px;right:90px;top:110px;display:flex;justify-content:space-between;align-items:center;font-family:Poppins;font-weight:700;font-size:30px;color:#6FD39B;z-index:5;mix-blend-mode:normal}}
#prog{{display:flex;gap:10px}}#prog i{{width:58px;height:10px;background:rgba(111,211,155,.3);display:block}}
.lg{{position:absolute;left:60px;right:60px;top:1480px;text-align:center;visibility:hidden;font-family:Poppins;font-weight:800;font-size:76px;line-height:1.1;text-transform:uppercase;color:#fff;z-index:6}}
#faixa{{position:absolute;left:0;right:0;top:1440px;height:480px;background:#0B2619;z-index:5}}
</style></head><body><div id="root" data-duration="{TOTAL}">
{"".join(cenas_html)}<div id="faixa"></div>
<div id="topo"><span>@constitucionalgabaritado</span><span id="prog"><i></i><i></i><i></i><i></i><i></i></span></div>
{"".join(leg)}</div>
<script>window.__timelines={{}};const tl=gsap.timeline({{paused:true}});{"".join(js)}window.__timelines.main=tl;</script></body></html>'''
open('index.html', 'w').write(page); print('ok', TOTAL, len(grupos), 'grupos')

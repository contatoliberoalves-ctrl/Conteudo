# Faixa de baixo do vídeo 1: o plenário do Senado (81 cadeiras) reagindo à narração.
import json, math, sys, unicodedata, re
d = json.load(open(sys.argv[1])); W = [w for w in d['words'] if w.get('start') is not None]
def norm(s):
    s = "".join(c for c in unicodedata.normalize("NFD", s.lower()) if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9 ]", "", s)
T = [norm(w['text']) for w in W]
def find(trig, after=0):
    tt = norm(trig).split()
    for i in range(len(T) - len(tt) + 1):
        if T[i:i+len(tt)] == tt and W[i]['start'] >= after - 0.01: return round(W[i]['start'], 2)
    raise SystemExit(f'gatilho não achado: {trig}')
TOTAL = round(W[-1]['end'] + 0.6, 2)
# 81 cadeiras em 5 fileiras de semicírculo
rows = [(250, 11), (310, 14), (370, 17), (430, 19), (490, 20)]
assert sum(n for _, n in rows) == 81
seats = []
for r, n in rows:
    for k in range(n):
        a = math.pi - math.pi * (k + 0.5) / n
        seats.append((a, 540 + r * math.cos(a), 640 - r * math.sin(a)))
seats.sort(key=lambda s: -s[0])  # da esquerda para a direita
dots = "".join(f'<span class="s" id="s{i}" style="left:{x-15:.0f}px;top:{y-15:.0f}px"></span>' for i, (_, x, y) in enumerate(seats))
t_sen = find("Senado"); t48 = find("48"); t_mar = find("Rogério Marinho"); t_cons = find("mas a Constituição")
t41 = find("41"); t3 = find("terceiro"); t_cta = find("Comenta")
js = f'''
tl.fromTo(".s",{{opacity:0,scale:0.3}},{{opacity:1,scale:1,duration:0.35,stagger:0.012,ease:"back.out(2)"}},0.1);
tl.fromTo("#rot",{{opacity:0}},{{opacity:1,duration:0.4}},0.6);
tl.to(".s",{{backgroundColor:"#E8F5EC",duration:0.25,stagger:0.008}},{t_sen});
tl.to(".s:nth-child(-n+48)",{{backgroundColor:"#6FD39B",boxShadow:"0 0 14px #6FD39B",duration:0.2,stagger:0.015}},{t48});
tl.fromTo("#l48",{{opacity:0,y:20}},{{opacity:1,y:0,duration:0.3}},{t48});
tl.to("#l48",{{opacity:0,duration:0.2}},{t_mar-0.1});
tl.fromTo("#lmar",{{opacity:0,y:20}},{{opacity:1,y:0,duration:0.3}},{t_mar});
tl.to("#lmar",{{opacity:0,duration:0.2}},{t_cons});
tl.to(".s",{{backgroundColor:"#2B4A3A",boxShadow:"0 0 0 #000",duration:0.3}},{t_cons});
tl.to(".s:nth-child(-n+41)",{{backgroundColor:"#6FD39B",boxShadow:"0 0 14px #6FD39B",duration:0.12,stagger:0.025}},{t41});
tl.fromTo("#l41",{{opacity:0,scale:1.4}},{{opacity:1,scale:1,duration:0.35,ease:"back.out(2)"}},{t41});
tl.to("#l41",{{opacity:0,duration:0.2}},{t3-0.1});
tl.to(".s",{{backgroundColor:"#2B4A3A",boxShadow:"0 0 0 #000",duration:0.3}},{t3-0.1});
tl.fromTo("#l3",{{opacity:0,y:20}},{{opacity:1,y:0,duration:0.3}},{t3});
tl.to("#l3",{{opacity:0,duration:0.2}},{t_cta});
tl.to(".s",{{backgroundColor:"#6FD39B",boxShadow:"0 0 14px #6FD39B",duration:0.2,stagger:0.006}},{t_cta});
tl.to("#glow",{{scale:1.2,opacity:0.9,duration:3,yoyo:true,repeat:{int(TOTAL//3)},ease:"sine.inOut"}},0);
'''
html = f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;800;900&display=swap">
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>*{{margin:0;padding:0;box-sizing:border-box}}html,body{{width:1080px;height:1920px;background:#000;font-family:Montserrat,sans-serif;overflow:hidden}}
#band{{position:absolute;left:0;top:0;width:1080px;height:1056px;background:radial-gradient(90% 70% at 50% 60%,#123A27 0%,#0B2619 55%,#06140D 100%);overflow:hidden}}
#glow{{position:absolute;left:290px;top:360px;width:500px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(111,211,155,.22),transparent 65%);filter:blur(20px);opacity:.6}}
.s{{position:absolute;width:30px;height:30px;border-radius:50%;background:#2B4A3A}}
#mesa{{position:absolute;left:440px;top:660px;width:200px;height:26px;border-radius:6px;background:#1F8A55}}
#rot{{position:absolute;left:0;right:0;top:720px;text-align:center;color:#6FD39B;font-weight:800;font-size:28px;letter-spacing:6px}}
.lab{{position:absolute;left:60px;right:60px;top:800px;text-align:center;color:#fff;font-weight:900;font-size:58px;line-height:1.05;opacity:0}}
.lab small{{display:block;font-size:30px;font-weight:700;color:#6FD39B;letter-spacing:3px;margin-top:10px}}
</style></head><body>
<div id="root" data-duration="{TOTAL}"><div id="band"><div id="glow"></div>{dots}<div id="mesa"></div>
<div id="rot">PLENÁRIO DO SENADO · 81 CADEIRAS</div>
<div class="lab" id="l48">48 VOTOS<small>É O QUE ALCOLUMBRE DIZ TER</small></div>
<div class="lab" id="lmar">ROGÉRIO MARINHO<small>PL-RN · O DESAFIANTE</small></div>
<div class="lab" id="l41">41 DE 81<small>MAIORIA DO SENADO</small></div>
<div class="lab" id="l3">3º NA LINHA SUCESSÓRIA<small>CF · ART. 80</small></div>
</div></div>
<script>window.__timelines={{}};const tl=gsap.timeline({{paused:true}});{js}window.__timelines.main=tl;</script></body></html>'''
open('index.html', 'w').write(html)
print('ok', TOTAL, t48, t41, t3)

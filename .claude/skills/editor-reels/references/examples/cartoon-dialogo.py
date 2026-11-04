# Vídeo 3: cartoon Ana x Lex. Cada fala aparece palavra por palavra no tempo da voz.
import json, html, re
E = html.escape
F = json.load(open('falas.json')); W = [w for w in json.load(open('t/transcripts/voz.json'))['words']]
TOTAL = round(F[-1]['fim'] + 0.9, 2)
POSE = {'ANA': ['acena', 'pensando', 'pensando', 'aponta', 'pensando', 'joinha'],
        'LEX': ['aponta', 'aponta', 'aponta', 'aponta', 'aponta', 'joinha']}
PROPS = [  # (fala, texto do cartão)
 (1, 'CF · ART. 57, § 5º<br><b>PRESIDENTE DO SENADO = PRESIDE O CONGRESSO</b>'),
 (3, '<b>41 / 81</b><br>VOTO SECRETO'),
 (5, 'CF · ART. 57, § 4º<br><b>2027 = LEGISLATURA NOVA</b>'),
 (7, 'CF · ART. 12, § 3º, III<br><b>SÓ BRASILEIRO NATO</b>'),
 (9, 'CF · ART. 80<br><b>3º NA LINHA SUCESSÓRIA</b>'),
 (11, 'COMENTA<br><b>SENADO</b>'),
]
cnt = {'ANA': 0, 'LEX': 0}
js, bal = [], []
for i, f in enumerate(F):
    who = f['quem']; pose = POSE[who][min(cnt[who], 5)]; cnt[who] += 1
    a, b = f['ini'], (F[i+1]['ini'] if i + 1 < len(F) else TOTAL)
    # palavras desta fala: as do Whisper dentro da janela (o texto exibido vem do roteiro)
    ws = [w for w in W if a - 0.15 <= w['start'] < f['fim'] + 0.05]
    toks = f['texto'].split()
    # distribui os tempos do Whisper nas palavras do roteiro (mesma contagem? senão interpola)
    if len(ws) == len(toks): ts = [w['start'] for w in ws]
    else: ts = [a + (f['fim'] - a) * k / len(toks) for k in range(len(toks))]
    spans = ''.join(f'<span id="p{i}_{k}">{E(t)} </span>' for k, t in enumerate(toks))
    lado = 'esq' if who == 'ANA' else 'dir'
    bal.append(f'<div class="bal {lado}" id="b{i}"><div class="nome">{"ANA" if who=="ANA" else "LEX · A CONSTITUIÇÃO"}</div>{spans}</div>')
    js.append(f'tl.set("#b{i}",{{visibility:"visible"}},{a});tl.set("#b{i}",{{visibility:"hidden"}},{b});')
    js.append(f'tl.fromTo("#b{i}",{{scale:0.85,opacity:0}},{{scale:1,opacity:1,duration:0.2,ease:"back.out(2)"}},{a});')
    for k, t in enumerate(ts):
        js.append(f'tl.fromTo("#p{i}_{k}",{{opacity:0.25}},{{opacity:1,duration:0.08}},{t:.2f});')
    me, other = ('#ana', '#lex') if who == 'ANA' else ('#lex', '#ana')
    js.append(f'tl.set("{me} img",{{display:"none"}},{a});tl.set("{me} .{pose}",{{display:"block"}},{a});')
    js.append(f'tl.to("{me}",{{filter:"brightness(1)",scale:1.04,duration:0.15}},{a});tl.to("{other}",{{filter:"brightness(0.6)",scale:0.96,duration:0.15}},{a});')
    # "fala": balança enquanto a voz toca
    n = max(1, int((f['fim'] - a) / 0.32))
    js.append(f'tl.to("{me} .corpo",{{y:-14,rotation:{-1.5 if who=="ANA" else 1.5},duration:0.16,yoyo:true,repeat:{n*2-1},ease:"sine.inOut"}},{a});')
props = []
for j, (i, txt) in enumerate(PROPS):
    a = F[i]['ini'] + 0.3; b = F[i+1]['ini'] if i + 1 < len(F) else TOTAL
    props.append(f'<div class="prop" id="c{j}">{txt}</div>')
    js.append(f'tl.set("#c{j}",{{visibility:"visible"}},{a});tl.set("#c{j}",{{visibility:"hidden"}},{b});')
    js.append(f'tl.fromTo("#c{j}",{{y:-80,rotation:-6,opacity:0}},{{y:0,rotation:-2,opacity:1,duration:0.35,ease:"back.out(2)"}},{a});')
def pers(nome, poses):
    return ''.join(f'<img class="{p}" src="{nome}-{p}.png" style="display:none">' for p in poses)
page = f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Antonio:wght@700&family=Poppins:wght@600;700;800&display=swap">
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>*{{margin:0;padding:0;box-sizing:border-box}}html,body{{width:1080px;height:1920px;overflow:hidden}}
#root{{position:absolute;inset:0;background:linear-gradient(180deg,#DDF3E5 0%,#F2F6F3 55%,#CFE9D9 55.1%,#BFE0CC 100%)}}
#topo{{position:absolute;top:110px;left:70px;right:70px;font-family:Antonio;font-weight:700;font-size:96px;line-height:.95;color:#0B2619;text-transform:uppercase}}
#topo span{{color:#1F8A55}}
#cupula{{position:absolute;left:0;right:0;top:880px;height:180px}}
.pers{{position:absolute;bottom:250px;width:470px;height:663px;transform-origin:50% 100%}}
.pers .corpo{{width:100%;height:100%;transform-origin:50% 100%}}.pers img{{width:100%;height:100%}}
#ana{{left:30px}}#lex{{right:30px}}#lex img{{transform:scaleX(-1)}}
.bal{{position:absolute;top:470px;width:700px;visibility:hidden;background:#fff;border:5px solid #0B2619;padding:26px 30px;font-family:Poppins;font-weight:700;font-size:44px;line-height:1.2;color:#0B2619;box-shadow:10px 10px 0 #0B2619;z-index:5}}
.bal .nome{{font-size:24px;letter-spacing:3px;color:#1F8A55;margin-bottom:6px}}
.bal.esq{{left:60px}}.bal.dir{{right:60px}}
.prop{{position:absolute;left:240px;width:600px;top:770px;visibility:hidden;background:#0B2619;color:#6FD39B;font-family:Poppins;font-weight:700;font-size:28px;letter-spacing:2px;text-align:center;padding:22px 20px;z-index:6;line-height:1.3}}
.prop b{{display:block;color:#fff;font-family:Antonio;font-size:54px;letter-spacing:0;line-height:1}}
#rod{{position:absolute;bottom:80px;left:0;right:0;text-align:center;font-family:Poppins;font-weight:700;font-size:30px;color:#0B2619}}
</style></head><body><div id="root" data-duration="{TOTAL}">
<div id="topo">QUEM PRESIDE O <span>CONGRESSO</span> EM 2027?</div>
<svg id="cupula" viewBox="0 0 1080 180"><path d="M300 180 A140 110 0 0 1 580 180" fill="#BFE0CC"/><path d="M620 70 A120 90 0 0 0 860 70 Z" fill="#BFE0CC"/><rect x="700" y="0" width="22" height="180" fill="#BFE0CC"/><rect x="740" y="0" width="22" height="180" fill="#BFE0CC"/></svg>
<div class="pers" id="ana"><div class="corpo">{pers('ana',['acena','pensando','aponta','joinha'])}</div></div>
<div class="pers" id="lex"><div class="corpo">{pers('lex',['aponta','joinha','acena','pensando'])}</div></div>
{''.join(bal)}{''.join(props)}<div id="rod">@constitucionalgabaritado</div></div>
<script>window.__timelines={{}};const tl=gsap.timeline({{paused:true}});
tl.set("#ana .acena",{{display:"block"}},0);tl.set("#lex .acena",{{display:"block"}},0);
{"".join(js)}window.__timelines.main=tl;</script></body></html>'''
open('site/index.html', 'w').write(page); print('ok', TOTAL)

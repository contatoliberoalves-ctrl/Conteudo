# Vídeo 3: "3 erros sobre a eleição do Senado". A Ana pergunta por mensagem (texto na tela, com som),
# o Líbero em desenho responde com a voz clonada; o balão acende palavra por palavra.
import json, re
from comum import pagina, E, norm
F = json.load(open('v3/falas.json'))
W = json.load(open('v3/t/transcripts/voz.json'))['words']
TOTAL = round(F[-1]['fim'] + 0.9, 2)
js = ['tl.set("#ana .pensando",{display:"block"},0);tl.set("#lib .acena",{display:"block"},0);']; J = js.append; bal = []; props = []
POSE_L = ['aponta', 'aponta', 'aponta', 'aponta', 'joinha']; POSE_A = ['pensando', 'pensando', 'pensando', 'pensando', 'acena']
nl = na = 0; erro = 0
for i, f in enumerate(F):
    a, b = f['ini'], (F[i+1]['ini'] if i + 1 < len(F) else TOTAL)
    toks = f['texto'].split()
    if f['quem'] == 'ANA':
        pose = POSE_A[min(na, 4)]; na += 1
        bal.append(f'<div class="msg" id="b{i}"><div class="quem">ANA · MENSAGEM</div><div class="dots" id="d{i}">• • •</div><div class="txt" id="t{i}">{E(f["texto"])}</div></div>')
        J(f'tl.set("#b{i}",{{visibility:"visible"}},{a});tl.set("#b{i}",{{visibility:"hidden"}},{b});')
        J(f'tl.fromTo("#b{i}",{{y:40,opacity:0}},{{y:0,opacity:1,duration:0.22,ease:"back.out(2)"}},{a});')
        J(f'tl.set("#d{i}",{{display:"block"}},{a});tl.set("#d{i}",{{display:"none"}},{a+0.45});tl.set("#t{i}",{{display:"block"}},{a+0.45});tl.set("#t{i}",{{display:"none"}},{a});')
        J(f'tl.set("#ana img",{{display:"none"}},{a});tl.set("#ana .{pose}",{{display:"block"}},{a});')
        J(f'tl.to("#ana",{{filter:"brightness(1)",scale:1.04,duration:0.15}},{a});tl.to("#lib",{{filter:"brightness(0.65)",scale:0.97,duration:0.15}},{a});')
    else:
        pose = POSE_L[min(nl, 4)]; nl += 1
        ws = [w for w in W if a - 0.15 <= w['start'] < f['fim'] + 0.05]
        ts = [w['start'] for w in ws] if len(ws) == len(toks) else [a + (f['fim'] - a) * k / len(toks) for k in range(len(toks))]
        spans = ''.join(f'<span id="p{i}_{k}">{E(x)} </span>' for k, x in enumerate(toks))
        bal.append(f'<div class="bal" id="b{i}"><div class="quem">LÍBERO</div>{spans}</div>')
        J(f'tl.set("#b{i}",{{visibility:"visible"}},{a});tl.set("#b{i}",{{visibility:"hidden"}},{b});')
        J(f'tl.fromTo("#b{i}",{{scale:0.9,opacity:0}},{{scale:1,opacity:1,duration:0.2,ease:"back.out(2)"}},{a});')
        for k, x in enumerate(ts):
            J(f'tl.fromTo("#p{i}_{k}",{{opacity:0.25}},{{opacity:1,duration:0.08}},{x:.2f});')
        J(f'tl.set("#lib img",{{display:"none"}},{a});tl.set("#lib .{pose}",{{display:"block"}},{a});')
        J(f'tl.to("#lib",{{filter:"brightness(1)",scale:1.04,duration:0.15}},{a});tl.to("#ana",{{filter:"brightness(0.65)",scale:0.97,duration:0.15}},{a});')
        n = max(1, int((f['fim'] - a) / 0.34))
        J(f'tl.to("#lib .corpo",{{y:-12,rotation:1.2,duration:0.17,yoyo:true,repeat:{n*2-1},ease:"sine.inOut"}},{a});')
        if 'erro' in norm(f['texto']).split():
            erro += 1
            J(f'tl.fromTo("#e{erro}",{{opacity:0,scale:1.8,rotation:-12}},{{opacity:1,scale:1,rotation:-5,duration:0.3,ease:"back.out(2)"}},{a+0.1});')
            J(f'tl.to("#e{erro}",{{opacity:0,duration:0.2}},{b});')
            J(f'tl.to("#cont i:nth-child(-n+{erro})",{{background:"#FF5470",duration:0.2}},{a+0.1});')
# cartões didáticos (fala → conteúdo)
CARTOES = [(1, 'CF · ART. 57, § 5º', 'QUEM PRESIDE O SENADO <i>PRESIDE O CONGRESSO</i>'),
           (2, 'ELEIÇÃO: 1º/02/2027', '<span class="fotos"><img src="img/alc.jpg"><b>x</b><img src="img/mar.jpg"></span>ALCOLUMBRE x MARINHO'),
           (3, 'CF · ART. 57, § 4º + STF, ADI 6524', 'MESMA LEGISLATURA: NÃO PODE<br><i>LEGISLATURA NOVA: PODE</i>'),
           (5, 'VOTO SECRETO', '<span class="n">41</span> DE 81 <i>GARANTEM</i>'),
           (7, 'CF · ART. 80', '3º NA LINHA DE SUCESSÃO DA <i>PRESIDÊNCIA</i>'),
           (9, 'RESUMO NO DIRECT', 'COMENTA <i>SENADO</i>')]
for j, (i, k, txt) in enumerate(CARTOES):
    a = F[i]['ini'] + 0.25; b = F[i+1]['ini'] if i + 1 < len(F) else TOTAL
    props.append(f'<div class="card" id="c{j}"><small>{k}</small><div>{txt}</div></div>')
    J(f'tl.set("#c{j}",{{visibility:"visible"}},{a});tl.set("#c{j}",{{visibility:"hidden"}},{b});')
    J(f'tl.fromTo("#c{j}",{{y:-60,opacity:0,rotation:-4}},{{y:0,opacity:1,rotation:-1.5,duration:0.32,ease:"back.out(2)"}},{a});')
    if 'img' in txt:
        J(f'tl.set("#cred",{{visibility:"visible"}},{a});tl.set("#cred",{{visibility:"hidden"}},{b});')
pers = lambda nome, poses: ''.join(f'<img class="{p}" src="{nome}-{p}.png" style="display:none">' for p in poses)
corpo = f'''<div id="bg"></div>
<div id="topo"><span>@constitucionalgabaritado</span><span id="cont"><i></i><i></i><i></i></span></div>
<div id="tit">3 ERROS SOBRE A <i>ELEIÇÃO DO SENADO</i></div>
<div class="erro" id="e1">ERRO 1</div><div class="erro" id="e2">ERRO 2</div><div class="erro" id="e3">ERRO 3</div>
<div class="pers" id="ana"><div class="corpo">{pers('ana', ['acena', 'pensando', 'aponta', 'joinha'])}</div></div>
<div class="pers" id="lib"><div class="corpo">{pers('libero', ['acena', 'aponta', 'joinha', 'pensando'])}</div></div>
{''.join(bal)}{''.join(props)}<div class="credito" id="cred" style="visibility:hidden;color:#3d5a4a">Fotos: Agência Senado / Senado Federal (CC BY), via Wikimedia Commons</div>'''
css = '''#bg{position:absolute;inset:0;background:linear-gradient(180deg,#DDF3E5 0%,#F2F6F3 58%,#CFE9D9 58.1%,#BFE0CC 100%)}
#topo{position:absolute;top:80px;left:70px;right:70px;display:flex;justify-content:space-between;font-family:Poppins;font-weight:700;font-size:28px;color:#1F8A55}
#cont{display:flex;gap:10px}#cont i{width:60px;height:12px;background:rgba(11,38,25,.18);display:block}
#tit{position:absolute;top:130px;left:70px;right:70px;font-family:Antonio;font-weight:700;font-size:92px;line-height:.95;color:#0B2619}
i{font-style:normal;color:#1F8A55}
.erro{position:absolute;top:360px;right:70px;font-family:Antonio;font-weight:700;font-size:78px;color:#FF5470;border:7px solid #FF5470;padding:2px 22px;opacity:0;background:#fff;z-index:8}
.pers{position:absolute;bottom:150px;width:440px;height:620px;transform-origin:50% 100%}
.pers .corpo{width:100%;height:100%;transform-origin:50% 100%}.pers img{width:100%;height:100%}
#ana{left:20px}#lib{right:20px}
.msg,.bal{position:absolute;top:470px;visibility:hidden;background:#fff;border:5px solid #0B2619;padding:24px 28px;font-family:Poppins;font-weight:700;font-size:44px;line-height:1.22;color:#0B2619;box-shadow:10px 10px 0 #0B2619;z-index:6;width:720px}
.msg{left:50px}.bal{right:50px;border-color:#1F8A55;box-shadow:10px 10px 0 #1F8A55}
.quem{font-size:24px;letter-spacing:3px;color:#1F8A55;margin-bottom:6px}.msg .quem{color:#7a8a82}
.dots{font-size:60px;color:#9aa;letter-spacing:6px;display:none}.msg .txt{display:none}
.card{position:absolute;left:180px;right:180px;top:830px;visibility:hidden;background:#0B2619;color:#fff;font-family:Antonio;font-weight:700;font-size:56px;line-height:1.02;text-align:center;padding:20px 24px;z-index:7}
.card small{display:block;font-family:Poppins;font-size:24px;letter-spacing:2px;color:#6FD39B;margin-bottom:8px}.card i{color:#6FD39B}
.card .n{font-size:90px;color:#6FD39B}
.fotos{display:flex;justify-content:center;align-items:center;gap:16px;margin-bottom:12px}.fotos img{width:170px;height:200px;object-fit:cover;border:4px solid #fff}.fotos b{font-size:70px;color:#6FD39B}'''
open('v3/index.html', 'w').write(pagina(css, corpo, js, TOTAL)); print('ok', TOTAL)

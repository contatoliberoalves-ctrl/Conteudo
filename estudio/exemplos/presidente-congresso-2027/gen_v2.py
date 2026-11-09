# Vídeo 2: "5 regras pra comandar o Congresso" — tipografia de tela cheia na identidade do CG, com fotos e pegadinha.
import sys
from comum import Palavras, legenda, pagina, E
P = Palavras(sys.argv[1]); t = P.t; js = []; J = js.append
g = [('hook', 0.0)]
for k, trig in [('r1', 'ser senador'), ('r2', 'brasileiro nato'), ('r3', 'ganhar no voto'), ('r4', 'não repetir'),
                ('r5', 'o mandato dura'), ('peg', 'pegadinha'), ('cta', 'Comenta')]:
    a = t(trig); g.append((k, max(0, a - (0.75 if k.startswith('r') else 0.15))))
fim = [x[1] for x in g[1:]] + [P.total]
for (c, a), b in zip(g, fim):
    J(f'tl.set("#{c}",{{visibility:"visible"}},{a});tl.set("#{c}",{{visibility:"hidden"}},{b});')
    J(f'tl.fromTo("#{c}",{{clipPath:"inset(0 0 100% 0)"}},{{clipPath:"inset(0 0 0% 0)",duration:0.3,ease:"power3.out"}},{a});')
    J(f'tl.fromTo("#{c} .num",{{opacity:0,x:-140}},{{opacity:1,x:0,duration:0.35,ease:"back.out(1.6)"}},{a+0.05});')
    J(f'tl.fromTo("#{c} h1",{{opacity:0,y:60}},{{opacity:1,y:0,duration:0.32,ease:"power3.out"}},{a+0.15});')
    J(f'tl.fromTo("#{c} .barra",{{scaleX:0}},{{scaleX:1,duration:0.5}},{a+0.25});')
D = dict(g)
def ex(cena, gatilho, html_, cls='ex'):
    a = t(gatilho, D[cena]); i = len(js)
    J(f'tl.fromTo("#x{i}",{{opacity:0,y:30}},{{opacity:1,y:0,duration:0.28,ease:"power3.out"}},{a});')
    return f'<div class="{cls}" id="x{i}" style="opacity:0">{html_}</div>'
for i, (c, _) in enumerate(g[1:6]):
    J(f'tl.to("#prog i:nth-child(-n+{i+1})",{{background:"#6FD39B",duration:0.2}},{D[c]});')
cenas = {
 'hook': ('escuro', '5', 'REGRAS PRA <i>COMANDAR</i> O CONGRESSO',
          ex('hook', 'quarta', '<img class="mini" src="img/alc.jpg"><span>A 4ª REGRA JÁ DERRUBOU<br><i>DAVI ALCOLUMBRE</i></span>', 'exf')),
 'r1': ('papel', '1', 'SER SENADOR', ex('r1', 'Não existe', 'NÃO EXISTE ELEIÇÃO “PRO CONGRESSO”') + ex('r1', 'preside o Congresso', 'QUEM PRESIDE O SENADO PRESIDE O CONGRESSO · <b>CF, art. 57, § 5º</b>')),
 'r2': ('papel', '2', 'BRASILEIRO NATO', ex('r2', 'naturalizado', 'SENADOR NATURALIZADO EXISTE, MAS NÃO PRESIDE O SENADO') + ex('r2', 'presidir o Senado', '<b>CF, art. 12, § 3º, III</b>')),
 'r3': ('escuro', '3', 'VENCER NO VOTO SECRETO', ex('r3', 'São', '<span class="big">41</span> DE 81 VOTOS = MAIORIA GARANTIDA')),
 'r4': ('papel', '4', 'NÃO REPETIR O CARGO NA MESMA LEGISLATURA',
        ex('r4', 'Foi essa', '<img class="mini" src="img/alc.jpg"><span>STF, 2020 (ADI 6524):<br>ALCOLUMBRE BARRADO, 6 x 5</span>', 'exf') + ex('r4', 'Foi essa', '<b>CF, art. 57, § 4º</b>')),
 'r5': ('papel', '5', 'MANDATO DE SÓ 2 ANOS', ex('r5', 'cada eleição', 'A CADA 2 ANOS, NOVA ELEIÇÃO DA MESA')),
 'peg': ('escuro', '!', 'A PEGADINHA QUE MAIS CAI',
         ex('peg', 'terceiro', '<div class="linha"><span>1º VICE</span><span>2º PRES. DA CÂMARA</span><span class="on">3º PRES. DO SENADO</span><span>4º PRES. DO STF</span></div><b>CF, art. 80</b>', 'exl')),
 'cta': ('escuro', '', 'COMENTA <i>SENADO</i>', ex('cta', 'mando', 'E RECEBA OS 5 ARTIGOS NUM RESUMO SÓ')),
}
secs = ''.join(f'<section class="cena {f}" id="{c}">' + (f'<div class="num">{n}</div>' if n else '') + f'<h1>{h}</h1><div class="barra"></div>{x}</section>'
               for c, (f, n, h, x) in cenas.items())
for a, b in [(t('quarta'), D['r1']), (t('Foi essa'), D['r5'])]:
    J(f'tl.set("#cred",{{visibility:"visible"}},{a});tl.set("#cred",{{visibility:"hidden"}},{b});')
corpo = secs + '''<div id="faixa"></div><div id="topo"><span>@constitucionalgabaritado</span><span id="prog"><i></i><i></i><i></i><i></i><i></i></span></div>''' + \
        legenda(P, js, troca={'stf': 'STF', 'senado': 'SENADO'}, top=1530) + '<div class="credito" id="cred" style="visibility:hidden">Foto: Agência Senado, via Wikimedia Commons</div>'
css = '''.cena{position:absolute;inset:0;visibility:hidden;padding:250px 80px 0;display:flex;flex-direction:column;gap:30px}
.escuro{background:linear-gradient(170deg,#164A31 0%,#0B2619 60%,#06170E 100%);color:#fff}.papel{background:#F2F6F3;color:#0B2619}
.num{font-family:Antonio;font-weight:700;font-size:380px;line-height:.8;color:transparent;-webkit-text-stroke:6px #1F8A55}
.escuro .num{-webkit-text-stroke-color:#6FD39B}
h1{font-family:Antonio;font-weight:700;font-size:132px;line-height:.92;text-transform:uppercase}
i{font-style:normal;color:#6FD39B}.papel i{color:#1F8A55}
.barra{height:14px;width:300px;background:#1F8A55;transform-origin:left}.escuro .barra{background:#6FD39B}
.ex,.exf,.exl{font-family:Poppins;font-weight:700;font-size:42px;line-height:1.25;border-left:10px solid #1F8A55;padding:6px 0 6px 26px}
.escuro .ex,.escuro .exf,.escuro .exl{border-color:#6FD39B}
.ex b,.exl b{color:#1F8A55}.escuro .exl b{color:#6FD39B}
.exf{display:flex;align-items:center;gap:26px}.mini{width:190px;height:230px;object-fit:cover;border:5px solid #fff;box-shadow:0 8px 24px rgba(0,0,0,.25)}
.big{font-family:Antonio;font-size:110px;color:#6FD39B;vertical-align:middle;margin-right:10px}
.linha{display:flex;flex-direction:column;gap:12px;margin-bottom:16px}.linha span{font-family:Antonio;font-size:62px;color:rgba(255,255,255,.45)}
.linha .on{color:#0B2619;background:#6FD39B;padding:4px 18px;align-self:flex-start}
#topo{position:absolute;left:80px;right:80px;top:110px;display:flex;justify-content:space-between;align-items:center;font-family:Poppins;font-weight:700;font-size:28px;color:#6FD39B;z-index:5}
#prog{display:flex;gap:10px}#prog i{width:58px;height:10px;background:rgba(111,211,155,.3);display:block}
#faixa{position:absolute;left:0;right:0;top:1460px;bottom:0;background:#0B2619;z-index:5}'''
open('v2/index.html', 'w').write(pagina(css, corpo, js, P.total)); print('ok', P.total)

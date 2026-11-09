# Vídeo 1: "O STF proibiu. Em 2027, pode." Linha do tempo das legislaturas (CG: verde-escuro, Antonio + Poppins).
import sys
from comum import Palavras, legenda, pagina, E
P = Palavras(sys.argv[1]); t = P.t; js = []
T0 = 0.0
t_proibiu = t('proibiu'); t_pode = t('pode', t_proibiu + 1)
t_entender = t('entender'); t_prim = t('Primeiro'); t_mand = t('Esse mandato'); t_proibe = t('proíbe')
t_leg = t('Só que'); t_duas = t('eleições da Mesa'); t_queria = t('queria'); t_julgou = t('julgou'); t_nao = t('disse não')
t_vale = t('Mas a proibição'); t_tanto = t('Tanto que'); t_fev = t('Em fevereiro'); t_mar = t('Marinho')
t_guarda = t('guarda assim'); t_pode2 = t('pode', t_guarda + 1.2); t_cta = t('Comenta')
# cenas (id, início, fim) — o palco mostra uma por vez
cenas = [('hook', 0, t_entender), ('prova', t_entender, t_prim), ('senado', t_prim, t_mand), ('lei', t_mand, t_leg),
         ('linha', t_leg, t_mar), ('versus', t_mar, t_guarda), ('macete', t_guarda, t_cta), ('cta', t_cta, P.total)]
for c, a, b in cenas:
    js.append(f'tl.set("#{c}",{{visibility:"visible"}},{a});tl.set("#{c}",{{visibility:"hidden"}},{b});')
    js.append(f'tl.fromTo("#{c}",{{opacity:0,y:40}},{{opacity:1,y:0,duration:0.3,ease:"power3.out"}},{a});')
J = js.append
# título fixo no topo depois do gancho
J(f'tl.fromTo("#titulo",{{opacity:0}},{{opacity:1,duration:0.3}},{t_entender});')
# HOOK: foto + dois carimbos
J(f'tl.fromTo("#h1",{{opacity:0,y:30}},{{opacity:1,y:0,duration:0.3}},0.05);')
J(f'tl.fromTo("#st1",{{opacity:0,scale:1.8,rotation:-14}},{{opacity:1,scale:1,rotation:-8,duration:0.3,ease:"back.out(2)"}},{t_proibiu});')
J(f'tl.fromTo("#h2",{{opacity:0,y:30}},{{opacity:1,y:0,duration:0.3}},{t_pode-0.6});')
J(f'tl.to("#st1",{{opacity:0.25,duration:0.2}},{t_pode});')
J(f'tl.fromTo("#st2",{{opacity:0,scale:1.8,rotation:10}},{{opacity:1,scale:1,rotation:6,duration:0.3,ease:"back.out(2)"}},{t_pode});')
J('tl.fromTo("#fotoAlc",{scale:1.08},{scale:1,duration:%s,ease:"none"},0);' % round(t_entender, 2))
# PROVA
J(f'tl.fromTo("#pv",{{opacity:0,scale:1.5,rotation:-10}},{{opacity:1,scale:1,rotation:-4,duration:0.3,ease:"back.out(2)"}},{t_entender+0.2});')
# SENADO -> CONGRESSO
J(f'tl.fromTo("#sen1",{{opacity:0,x:-80}},{{opacity:1,x:0,duration:0.3}},{t_prim+0.1});')
J(f'tl.fromTo("#seta",{{scaleY:0}},{{scaleY:1,duration:0.4,ease:"power2.out"}},{t_prim+0.9});')
J(f'tl.fromTo("#sen2",{{opacity:0,x:80}},{{opacity:1,x:0,duration:0.3}},{t_prim+1.3});')
J(f'tl.fromTo("#art5",{{opacity:0}},{{opacity:1,duration:0.3}},{t_prim+2.0});')
# LEI com grifo
J(f'tl.fromTo("#grifo",{{backgroundSize:"0% 100%"}},{{backgroundSize:"100% 100%",duration:0.6,ease:"power2.out"}},{t_proibe});')
J(f'tl.fromTo("#grifo2",{{backgroundSize:"0% 100%"}},{{backgroundSize:"100% 100%",duration:0.5,ease:"power2.out"}},{t_mand+0.6});')
# LINHA DO TEMPO
for i in range(3):
    J(f'tl.fromTo("#lg{i}",{{opacity:0,x:-60}},{{opacity:1,x:0,duration:0.3,ease:"power3.out"}},{t_leg+0.2+i*0.35});')
J(f'tl.to(".slot",{{borderColor:"#6FD39B",duration:0.2,stagger:0.12}},{t_duas});')
J(f'tl.fromTo("#n2019",{{opacity:0}},{{opacity:1,duration:0.25}},{t_queria-0.4});')
J(f'tl.fromTo("#n2021a",{{opacity:0}},{{opacity:1,duration:0.25}},{t_queria+0.4});')
J(f'tl.fromTo("#stf",{{opacity:0,scale:1.8,rotation:-12}},{{opacity:1,scale:1,rotation:-6,duration:0.3,ease:"back.out(2)"}},{t_nao});')
J(f'tl.to("#n2021a",{{opacity:0,duration:0.2}},{t_vale-0.3});J0=0;')
J(f'tl.to("#stf",{{opacity:0,duration:0.2}},{t_vale-0.3});')
J(f'tl.fromTo("#n2021b",{{opacity:0}},{{opacity:1,duration:0.25}},{t_vale-0.2});')
J(f'tl.fromTo(".moldura",{{boxShadow:"0 0 0 0 rgba(111,211,155,0)"}},{{boxShadow:"0 0 0 6px rgba(111,211,155,.9)",duration:0.3,yoyo:true,repeat:3}},{t_vale+0.4});')
J(f'tl.fromTo("#n2023",{{opacity:0}},{{opacity:1,duration:0.25}},{t_tanto+0.5});')
J(f'tl.fromTo("#ok2023",{{opacity:0,scale:1.6}},{{opacity:1,scale:1,duration:0.3,ease:"back.out(2)"}},{t_tanto+1.2});')
J(f'tl.fromTo("#n2025",{{opacity:0}},{{opacity:1,duration:0.25}},{t_fev-0.3});')
J(f'tl.fromTo("#n2027",{{opacity:0,scale:1.4}},{{opacity:1,scale:1,duration:0.3,ease:"back.out(2)"}},{t_fev+0.6});')
# VERSUS
J(f'tl.fromTo("#vA",{{opacity:0,x:-120}},{{opacity:1,x:0,duration:0.35,ease:"power3.out"}},{t_mar});')
J(f'tl.fromTo("#vB",{{opacity:0,x:120}},{{opacity:1,x:0,duration:0.35,ease:"power3.out"}},{t_mar+0.15});')
J(f'tl.fromTo("#vX",{{opacity:0,scale:2}},{{opacity:1,scale:1,duration:0.3,ease:"back.out(2)"}},{t_mar+0.35});')
# MACETE
J(f'tl.fromTo("#m1",{{opacity:0,x:-80}},{{opacity:1,x:0,duration:0.3}},{t_guarda+0.4});')
J(f'tl.fromTo("#m2",{{opacity:0,x:-80}},{{opacity:1,x:0,duration:0.3}},{t_pode2-0.9});')
# CTA
J(f'tl.fromTo("#ctaW",{{opacity:0,scale:1.5}},{{opacity:1,scale:1,duration:0.35,ease:"back.out(2)"}},{t_cta+0.3});')
# créditos quando há foto
for a, b in [(0, t_entender), (t_prim, t_mand), (t_mar, t_guarda)]:
    J(f'tl.set("#cred",{{visibility:"visible"}},{a});tl.set("#cred",{{visibility:"hidden"}},{b});')
slot = lambda ano, nome, id_, extra='': f'<div class="slot"><b>{ano}</b><span id="{id_}" class="nome" style="opacity:0">{nome}</span>{extra}</div>'
corpo = f'''<div id="bg"></div>
<div id="topo">@constitucionalgabaritado</div>
<div id="titulo">O STF PROIBIU. <i>EM 2027, PODE.</i></div>
<section class="cena" id="hook">
  <div class="hookt"><span id="h1">O STF PROIBIU.</span><span id="h2"><i>EM 2027, PODE.</i></span></div>
  <div class="foto" id="fotoW"><img id="fotoAlc" src="img/alc.jpg"><div class="tag">DAVI ALCOLUMBRE · PRESIDENTE DO SENADO</div></div>
  <div class="carimbo vermelho" id="st1">PROIBIDO · STF 2020</div>
  <div class="carimbo verde" id="st2">2027: PODE</div>
</section>
<section class="cena" id="prova"><div class="grande">ISSO É<br><i>QUESTÃO DE PROVA</i></div><div class="carimbo verde" id="pv" style="position:relative;left:0;top:40px">CAI NA OAB E EM CONCURSO</div></section>
<section class="cena" id="senado">
  <div class="caixa" id="sen1"><img src="img/plen.jpg" class="plen"><div>PRESIDENTE<br>DO <i>SENADO</i></div></div>
  <div id="seta"></div>
  <div class="caixa clara" id="sen2"><div>PRESIDE O<br><i>CONGRESSO NACIONAL</i></div></div>
  <div class="ref" id="art5">CF · art. 57, § 5º</div>
</section>
<section class="cena" id="lei">
  <div class="papel"><div class="papelk">CONSTITUIÇÃO · ART. 57, § 4º</div>
  <p>“…eleição das respectivas Mesas, para <span id="grifo2" class="grifo">mandato de 2 (dois) anos</span>, <span id="grifo" class="grifo">vedada a recondução para o mesmo cargo</span> na eleição imediatamente subsequente.”</p></div>
</section>
<section class="cena" id="linha">
  <div class="lk">LEGISLATURA = 4 ANOS · MESA = 2 ANOS</div>
  <div class="leg" id="lg0"><div class="legn">56ª LEGISLATURA<br><small>2019 – 2023</small></div><div class="moldura">{slot(2019,'ALCOLUMBRE','n2019')}{slot(2021,'ALCOLUMBRE?','n2021a','<span id="n2021b" class="nome" style="opacity:0">PACHECO</span><div class="carimbo vermelho mini" id="stf">STF: NÃO · 6 x 5</div>')}</div></div>
  <div class="leg" id="lg1"><div class="legn">57ª LEGISLATURA<br><small>2023 – 2027</small></div><div class="moldura">{slot(2023,'PACHECO','n2023','<div class="ok" id="ok2023">✓ PODE</div>')}{slot(2025,'ALCOLUMBRE','n2025')}</div></div>
  <div class="leg" id="lg2"><div class="legn">58ª LEGISLATURA<br><small>2027 – 2031</small></div><div class="moldura">{slot(2027,'ALCOLUMBRE<br>x MARINHO','n2027')}{slot(2029,'','n2029')}</div></div>
</section>
<section class="cena" id="versus">
  <div class="vs"><div class="vf" id="vA"><img src="img/alc.jpg"><b>DAVI ALCOLUMBRE</b><small>UNIÃO-AP · BUSCA A REELEIÇÃO</small></div>
  <div class="vf" id="vB"><img src="img/mar.jpg"><b>ROGÉRIO MARINHO</b><small>PL-RN · LANÇADO PELO PL</small></div></div>
  <div id="vX">x</div><div class="ref" style="position:relative;top:40px">ELEIÇÃO: 1º DE FEVEREIRO DE 2027</div>
</section>
<section class="cena" id="macete"><div class="lk">PRA PROVA, GUARDA ASSIM</div>
  <div class="mac vermelho" id="m1"><b>MESMA LEGISLATURA</b><span>NÃO PODE</span></div>
  <div class="mac verde" id="m2"><b>LEGISLATURA NOVA</b><span>PODE</span></div></section>
<section class="cena" id="cta"><div class="grande" id="ctaW">COMENTA<br><i>SENADO</i></div><div class="ref" style="position:relative;top:40px">E RECEBA O RESUMO COM OS ARTIGOS</div></section>
<div id="faixa"></div>
{legenda(P, js, troca={'stf':'STF','senado':'SENADO','pln':'PL','assinado':'SENADO','pera':'Pra','sim':'assim'})}
<div class="credito" id="cred" style="visibility:hidden">Fotos: Agência Senado / Senado Federal (CC BY), via Wikimedia Commons</div>'''
css = '''#bg{position:absolute;inset:0;background:radial-gradient(120% 70% at 50% 0%,#164A31 0%,#0B2619 55%,#06170E 100%)}
#topo{position:absolute;top:70px;left:70px;font-family:Poppins;font-weight:700;font-size:28px;color:#6FD39B}
#titulo{position:absolute;top:118px;left:70px;right:70px;font-family:Antonio;font-weight:700;font-size:64px;color:#fff;opacity:0;letter-spacing:.5px}
i{font-style:normal;color:#6FD39B}
.cena{position:absolute;left:0;right:0;top:250px;height:1220px;visibility:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px;padding:0 70px}
.hookt{display:flex;flex-direction:column;align-items:center;font-family:Antonio;font-weight:700;font-size:118px;line-height:.95;color:#fff;text-align:center}
.foto{position:relative;width:560px;height:680px;overflow:hidden;border:8px solid #fff}
.foto img{width:100%;height:100%;object-fit:cover;transform-origin:50% 30%}
.tag{position:absolute;left:0;right:0;bottom:0;background:#0B2619;color:#6FD39B;font-family:Poppins;font-weight:700;font-size:22px;padding:12px;text-align:center;letter-spacing:1px}
.carimbo{position:absolute;font-family:Antonio;font-weight:700;font-size:70px;padding:6px 26px;border:7px solid;opacity:0;text-transform:uppercase;background:rgba(6,23,14,.55)}
.vermelho{color:#FF5470;border-color:#FF5470}.verde{color:#6FD39B;border-color:#6FD39B}
#st1{top:650px;left:120px}#st2{top:850px;right:120px}
.carimbo.mini{font-size:32px;border-width:4px;padding:1px 10px;left:8px;top:150px;white-space:nowrap}
.grande{font-family:Antonio;font-weight:700;font-size:150px;line-height:.95;color:#fff;text-align:center}
.caixa{display:flex;align-items:center;gap:30px;background:#123A27;border:4px solid #6FD39B;padding:26px;width:900px;font-family:Antonio;font-weight:700;font-size:84px;line-height:.95;color:#fff}
.caixa.clara{background:#F2F6F3;color:#0B2619;justify-content:center;text-align:center}.caixa.clara i{color:#1F8A55}
.plen{width:330px;height:220px;object-fit:cover}
#seta{width:14px;height:110px;background:#6FD39B;transform-origin:top;position:relative}
#seta:after{content:"";position:absolute;left:-23px;bottom:-30px;border:30px solid transparent;border-top-color:#6FD39B;border-bottom:0}
.ref{font-family:Poppins;font-weight:700;font-size:38px;color:#6FD39B;letter-spacing:1px;text-align:center}
.papel{background:#F2F6F3;padding:56px 54px;width:940px;border-left:16px solid #1F8A55}
.papelk{font-family:Poppins;font-weight:800;font-size:30px;color:#1F8A55;letter-spacing:2px;margin-bottom:24px}
.papel p{font-family:Poppins;font-weight:600;font-size:52px;line-height:1.35;color:#0B2619}
.grifo{background-image:linear-gradient(#6FD39B,#6FD39B);background-repeat:no-repeat;background-size:0% 100%;padding:0 4px}
.lk{font-family:Poppins;font-weight:800;font-size:34px;color:#6FD39B;letter-spacing:2px;text-align:center}
.leg{display:flex;align-items:center;gap:22px;width:960px}
.legn{width:250px;font-family:Antonio;font-weight:700;font-size:42px;color:#fff;line-height:1}
.legn small{font-family:Poppins;font-size:24px;color:#9FBFAE;font-weight:600}
.moldura{display:flex;gap:14px;flex:1;padding:12px;border:3px solid rgba(111,211,155,.35)}
.slot{position:relative;flex:1;height:210px;border:3px solid rgba(255,255,255,.25);background:rgba(18,58,39,.8);padding:16px;display:flex;flex-direction:column;gap:8px}
.slot b{font-family:Antonio;font-size:56px;color:#6FD39B;line-height:1}
.nome{font-family:Antonio;font-weight:700;font-size:44px;color:#fff;line-height:1}
#n2021b{position:absolute;left:16px;top:84px}
.ok{position:absolute;right:12px;bottom:12px;font-family:Antonio;font-weight:700;font-size:40px;color:#0B2619;background:#6FD39B;padding:2px 12px;opacity:0}
.vs{display:flex;gap:30px}.vf{width:450px;display:flex;flex-direction:column;gap:12px}
.vf img{width:450px;height:560px;object-fit:cover;border:6px solid #fff}
.vf b{font-family:Antonio;font-size:60px;color:#fff;line-height:1}.vf small{font-family:Poppins;font-weight:700;font-size:24px;color:#6FD39B}
#vX{position:absolute;z-index:3;left:465px;top:430px;font-family:Antonio;font-weight:700;font-size:150px;color:#0B2619;background:#6FD39B;width:150px;height:150px;line-height:140px;text-align:center}
.mac{width:940px;display:flex;justify-content:space-between;align-items:center;padding:34px 40px;border:6px solid}
.mac b{font-family:Antonio;font-size:76px;color:#fff}.mac span{font-family:Antonio;font-weight:700;font-size:76px}
.mac.vermelho span{color:#FF5470}.mac.verde span{color:#6FD39B}
#faixa{position:absolute;left:0;right:0;top:1480px;bottom:0;background:linear-gradient(180deg,rgba(6,23,14,0),#06170E 18%);z-index:10}'''
open('v1/index.html', 'w').write(pagina(css, corpo, js, P.total)); print('ok', P.total)

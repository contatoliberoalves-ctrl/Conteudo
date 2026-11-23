// Projeto 08 · "Dark Academia" (marca Ex Libris Eduarda): biblioteca antiga para a Eduarda Caraciolo.
// Verde-musgo, bordô, dourado envelhecido e papel antigo; Cormorant Garamond nos títulos e EB Garamond no texto.
// Elementos: moldura dupla dourada (com medida), capitular, numeração romana, ex-libris, selo de cera "EC",
// fotos em duotone musgo → dourado → papel. Vermelho (carimbo) só para erro/pegadinha.
import { render, CONTEUDO as C, PERFIL, root, esc } from './base.mjs';
import fs from 'node:fs';

const ID = 'id08-dark-academia';
const FONTES = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap';
const K = { musgo: '#25332A', fundo: '#18211B', bordo: '#6E1F2B', ouro: '#B4914F', papel: '#EFE5CF', perg: '#DCCBA6', tinta: '#2A211B', carimbo: '#B3261E' };

// As fotos entram como data URI (a página é montada com setContent e não lê file://).
const d64 = (arq, tipo) => `data:${tipo};base64,${fs.readFileSync(`${root}/fotos/${arq}`).toString('base64')}`;
const memo = {};
const foto = n => (memo['f' + n] ??= d64(`${n}.jpg`, 'image/jpeg'));
const recorte = n => (memo['r' + n] ??= d64(`${n}-recorte.png`, 'image/png'));

const grao = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .25  0 0 0 0 .18  0 0 0 0 .08  0 0 0 .10 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const css = `
body{font-family:'EB Garamond',serif;color:${K.tinta};position:relative}
.pg{position:absolute;inset:0;overflow:hidden}
.pg::after{content:'';position:absolute;inset:0;background-image:${grao};pointer-events:none;z-index:30}
.papel{background:radial-gradient(ellipse at 50% 40%,#f4ecd9 0,#efe5cf 45%,#ddcca7 100%)}
.musgo{background:radial-gradient(ellipse at 50% 35%,#2f4034 0,${K.musgo} 50%,${K.fundo} 100%);color:${K.papel}}
.bordo{background:radial-gradient(ellipse at 50% 35%,#86303d 0,${K.bordo} 55%,#4b131c 100%);color:${K.papel}}
.ab{position:absolute}
.cor{font-family:'Cormorant Garamond',serif;line-height:1}
.sc{font-family:'Cormorant Garamond',serif;font-weight:700;text-transform:uppercase;letter-spacing:.18em}
.it{font-style:italic}
.ouro{color:${K.ouro}}
.moldura{position:absolute;border:3px solid ${K.ouro};pointer-events:none}
.moldura::before{content:'';position:absolute;inset:12px;border:1.5px solid ${K.ouro}}
img.f{position:absolute;width:100%;height:100%;object-fit:cover}
.duo{filter:url(#duo)}
.cap::first-letter{font-family:'Cormorant Garamond';font-weight:700;float:left;font-size:3.3em;line-height:.8;padding:.06em .1em 0 0;color:${K.bordo}}
.rodape{position:absolute;left:80px;right:80px;bottom:44px;display:flex;justify-content:space-between;font-family:'Cormorant Garamond';font-weight:700;font-size:28px;letter-spacing:.16em;text-transform:uppercase;z-index:10}
`;
const DEFS = `<svg width="0" height="0" style="position:absolute"><filter id="duo" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".3 .55 .15 0 0  .3 .55 .15 0 0  .3 .55 .15 0 0  0 0 0 1 0"/><feComponentTransfer><feFuncR type="table" tableValues=".09 .42 .72 .95"/><feFuncG type="table" tableValues=".12 .40 .60 .91"/><feFuncB type="table" tableValues=".10 .27 .36 .82"/></feComponentTransfer></filter>
<radialGradient id="cera" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#9b3442"/><stop offset=".55" stop-color="${K.bordo}"/><stop offset="1" stop-color="#3f0e16"/></radialGradient></svg>`;

// ---------- elementos ----------
const romano = n => ['', 'I', 'II', 'III', 'IV', 'V', 'VI'][n];
const selo = (s, x, y, rot = -8, z = 12) => `<svg class="ab" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px;transform:rotate(${rot}deg);z-index:${z};filter:drop-shadow(0 6px 8px rgba(0,0,0,.35))" viewBox="0 0 200 200">
  <path d="M100 6c14 0 18 10 30 12s22-4 30 6 2 20 8 30 18 14 18 28-10 18-12 30 6 22-4 30-20 2-30 8-14 18-28 18-18-10-30-12-22 6-30-4-2-20-8-30S6 114 6 100s10-18 12-30-6-22 4-30 20-2 30-8S86 6 100 6z" fill="url(#cera)"/>
  <circle cx="100" cy="100" r="64" fill="none" stroke="#3f0e16" stroke-width="5" opacity=".7"/><circle cx="100" cy="100" r="64" fill="none" stroke="#b0505e" stroke-width="2" opacity=".6" transform="translate(-1.5 -1.5)"/>
  <text x="100" y="124" text-anchor="middle" font-family="Cormorant Garamond" font-style="italic" font-weight="700" font-size="76" fill="#4a1019">EC</text>
  <text x="98" y="121" text-anchor="middle" font-family="Cormorant Garamond" font-style="italic" font-weight="700" font-size="76" fill="#b85868" opacity=".75">EC</text></svg>`;
const orn = (cor = K.ouro, s = 1) => `<svg style="width:${110 * s}px;height:${22 * s}px;display:block" viewBox="0 0 110 22"><path d="M55 2l9 9-9 9-9-9z" fill="${cor}"/><path d="M28 7l4 4-4 4-4-4zM82 7l4 4-4 4-4-4z" fill="${cor}"/></svg>`;
const canto = (cor = K.ouro) => `<svg width="46" height="46" viewBox="0 0 46 46"><path d="M3 43V3h40" fill="none" stroke="${cor}" stroke-width="3"/><path d="M14 14l7 0 0 7-7 0z" fill="${cor}" transform="rotate(45 17.5 17.5)"/></svg>`;
const moldura = (x, y, w, h, cor = K.ouro, cantos = true) => `<div class="moldura" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-color:${cor}"><style>.m${x}${y}::before{}</style></div>${cantos ? [[x - 14, y - 14, 0], [x + w - 32, y - 14, 90], [x + w - 32, y + h - 32, 180], [x - 14, y + h - 32, 270]].map(([a, b, r]) => `<div class="ab" style="left:${a}px;top:${b}px;transform:rotate(${r}deg);z-index:2">${canto(cor)}</div>`).join('') : ''}`;
const rodape = (pag, cor = K.ouro, curto = false) => `<div class="rodape" style="color:${cor}"><span>${curto ? 'Ex Libris' : `Ex Libris · ${PERFIL.arroba}`}</span><span>${pag}</span></div>`;
const arco = (x, y, w, h, img, pos = '50% 30%', borda = K.ouro, zoom = 1) => `<div class="ab" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${w / 2}px ${w / 2}px 0 0;overflow:hidden;border:4px solid ${borda};box-shadow:0 0 0 10px transparent,0 0 0 12px ${borda}"><img class="f duo" src="${img}" style="object-position:${pos};transform:scale(${zoom});transform-origin:${pos}"></div>`;
const oval = (x, y, w, h, img, pos = '50% 30%', borda = K.ouro, zoom = 1) => `<div class="ab" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:50%;overflow:hidden;border:4px solid ${borda};box-shadow:0 0 0 9px rgba(0,0,0,0),0 0 0 11px ${borda}"><img class="f duo" src="${img}" style="object-position:${pos};transform:scale(${zoom});transform-origin:${pos}"></div>`;
const pg = (cls, html) => `<div class="pg ${cls}">${DEFS}${html}</div>`;
const W = 1080, H = 1350, HS = 1920;
const P = (nome, html, h = H, w = W) => ({ nome, w, h, html });

const marca = (s = 1, cor = K.papel) => `<div style="display:flex;align-items:center;gap:${26 * s}px"><div style="position:relative;width:${170 * s}px;height:${170 * s}px">${selo(170 * s, 0, 0, -8, 1)}</div>
  <div><div class="sc ouro" style="font-size:${26 * s}px">Ex Libris</div><div class="cor" style="font-size:${78 * s}px;font-weight:600;color:${cor};margin-top:${6 * s}px">Eduarda Caraciolo</div><div class="cor it" style="font-size:${32 * s}px;color:${K.ouro};margin-top:${8 * s}px">Advogada · Direito Civil e ECA</div></div></div>`;

const pecas = [];

// ---------- 00 identidade ----------
const sw = (nome, hex, borda = '') => `<div style="flex:1"><div style="height:110px;background:${hex};border:2px solid ${K.ouro};${borda}"></div><div class="cor" style="font-weight:700;font-size:30px;margin-top:12px">${nome}</div><div style="font-size:28px;opacity:.8">${hex}</div></div>`;
pecas.push(P('00-identidade', pg('musgo', `
  ${moldura(40, 40, 1000, 1270)}
  <div class="ab sc ouro" style="left:100px;top:100px;font-size:28px">Projeto VIII · Dark Academia</div>
  <div class="ab" style="left:96px;top:160px">${marca(1)}</div>
  <div class="ab" style="left:100px;top:420px;right:100px;display:flex;gap:18px">${sw('Musgo', K.musgo)}${sw('Bordô', K.bordo)}${sw('Ouro velho', K.ouro)}${sw('Papel', K.papel)}${sw('Tinta', K.tinta)}${sw('Carimbo', K.carimbo)}</div>
  <div class="ab" style="left:100px;top:660px;width:430px;background:${K.papel};color:${K.tinta};padding:30px 32px;height:330px">
    <div class="cor" style="font-size:66px;font-weight:600">Aa <span class="it" style="color:${K.bordo}">Aa</span></div><div style="font-size:28px;margin:6px 0 18px">Cormorant Garamond · títulos</div>
    <div style="font-size:46px;font-family:'EB Garamond'">Aa Bb Cc</div><div style="font-size:28px;margin-top:6px">EB Garamond · texto</div></div>
  <div class="ab" style="left:560px;top:660px;width:420px;height:330px;border:2px solid ${K.ouro};padding:26px 28px;display:flex;flex-wrap:wrap;gap:18px 26px;align-items:center">
    <div class="cor" style="font-size:120px;font-weight:700;color:${K.ouro};line-height:.8">P</div>
    <div class="cor" style="font-size:64px;font-weight:600;color:${K.papel}">I · II · III</div>
    <div style="position:relative;width:110px;height:110px">${selo(110, 0, 0, -8, 1)}</div>
    <div style="border:2px solid ${K.ouro};padding:10px 18px;text-align:center"><div class="cor it ouro" style="font-size:30px">Ex Libris</div></div>
    ${orn()}</div>
  <div class="ab" style="left:100px;top:1030px;right:100px">
    <div class="sc ouro" style="font-size:28px;margin-bottom:14px">Tom de voz</div>
    <div style="font-size:34px;line-height:1.32">Professora de biblioteca: calma, precisa e acolhedora. Explica com elegância, cita a fonte e convida a estudar junto, sem pressa e sem juridiquês.</div></div>`)));

// ---------- c1 · explicativo ----------
const c1 = C.c1;
pecas.push(P('c1-1', pg('musgo', `
  ${moldura(40, 40, 1000, 1270)}
  <div class="ab sc ouro" style="left:0;right:0;top:96px;text-align:center;font-size:28px">Lição de Civil · I</div>
  ${arco(300, 160, 480, 620, foto('explicando'), '50% 34%', K.ouro, 1.3)}
  <div class="ab cor" style="left:0;right:0;top:820px;text-align:center;font-size:132px;font-weight:600">Prescrição</div>
  <div class="ab cor it ouro" style="left:0;right:0;top:950px;text-align:center;font-size:118px;font-weight:500">x decadência</div>
  <div class="ab" style="left:0;right:0;top:1100px;display:flex;justify-content:center">${orn()}</div>
  <div class="ab it" style="left:0;right:0;top:1140px;text-align:center;font-size:40px;color:${K.perg}">${esc(c1.sub)}</div>
  ${rodape('I / III')}`)));
const col = (it, n) => `<div style="flex:1;padding:0 6px">
  <div class="cor ouro" style="font-size:44px;font-weight:700">${romano(n)}.</div>
  <div class="cor" style="font-size:76px;font-weight:600;color:${K.bordo};margin:6px 0 30px">${it.nome}</div>
  <div class="cap" style="font-size:44px;line-height:1.25">${esc(it.txt)}</div>
  <div style="font-size:38px;line-height:1.33;margin-top:30px;color:#4a3d31">${esc(it.det)}</div>
  <div class="it" style="font-size:34px;margin-top:28px;color:${K.bordo}">${esc(it.base)}</div></div>`;
pecas.push(P('c1-2', pg('papel', `
  <div class="ab" style="left:530px;top:0;width:20px;height:100%;background:linear-gradient(90deg,rgba(60,40,20,0),rgba(60,40,20,.18),rgba(60,40,20,0))"></div>
  <div class="ab sc" style="left:0;right:0;top:80px;text-align:center;font-size:28px;color:${K.bordo}">Capítulo I · a diferença</div>
  <div class="ab" style="left:80px;right:80px;top:160px;display:flex;gap:90px">${col(c1.itens[0], 1)}${col(c1.itens[1], 2)}</div>
  <div class="ab" style="left:90px;right:90px;top:930px;text-align:center;font-size:40px;line-height:1.3;background:${K.papel};padding:22px 30px;border:2px solid ${K.bordo}"><span class="it" style="color:${K.bordo}">Em uma linha:</span> prescrição atinge a <b>pretensão</b>; decadência, o <b>próprio direito</b>.</div>
  ${selo(150, 465, 1080, -8)}
  ${rodape('II / III', K.bordo)}`)));
pecas.push(P('c1-3', pg('musgo', `
  <div class="ab" style="left:130px;top:150px;width:820px;height:900px;background:${K.papel};color:${K.tinta};box-shadow:0 20px 40px rgba(0,0,0,.4)"></div>
  ${moldura(160, 180, 760, 840, K.bordo)}
  <div class="ab sc" style="left:0;right:0;top:260px;text-align:center;font-size:30px;color:${K.bordo}">Ex Libris</div>
  <div class="ab cor it" style="left:0;right:0;top:310px;text-align:center;font-size:64px;color:${K.tinta}">Eduarda Caraciolo</div>
  <div class="ab" style="left:0;right:0;top:410px;display:flex;justify-content:center">${orn(K.bordo)}</div>
  <div class="ab cor" style="left:220px;right:220px;top:480px;text-align:center;font-size:76px;font-weight:600;color:${K.tinta};line-height:1.08">Salva pra revisar</div>
  <div class="ab" style="left:220px;right:220px;top:660px;text-align:center;font-size:42px;line-height:1.3;color:#4a3d31">e manda pra quem vai<br>fazer a OAB.</div>
  <div class="ab it" style="left:220px;right:220px;top:850px;text-align:center;font-size:30px;color:${K.bordo}">Este volume pertence à sua revisão.</div>
  ${selo(230, 425, 950, -10)}
  ${rodape('III / III')}`)));

// ---------- c2 · lista ----------
const c2 = C.c2;
pecas.push(P('c2-1', pg('bordo', `
  <div class="ab" style="left:0;top:0;width:70px;height:100%;background:linear-gradient(90deg,rgba(0,0,0,.35),rgba(0,0,0,0))"></div>
  ${moldura(90, 50, 940, 1250)}
  ${oval(390, 130, 300, 380, foto('surpresa'), '62% 34%', K.ouro, 1.5)}
  <div class="ab cor ouro" style="left:0;right:0;top:520px;text-align:center;font-size:300px;font-weight:600;line-height:.9;padding-left:40px">IV</div>
  <div class="ab sc" style="left:120px;right:80px;top:820px;text-align:center;font-size:34px;color:${K.perg}">erros que derrubam</div>
  <div class="ab cor" style="left:120px;right:80px;top:880px;text-align:center;font-size:104px;font-weight:600">a peça de Civil</div>
  <div class="ab" style="left:40px;right:0;top:1030px;display:flex;justify-content:center">${orn()}</div>
  <div class="ab it" style="left:120px;right:80px;top:1080px;text-align:center;font-size:40px;color:${K.perg}">${esc(c2.sub)}</div>
  ${rodape('I / III')}`)));
pecas.push(P('c2-2', pg('papel', `
  <div class="ab sc" style="left:0;right:0;top:90px;text-align:center;font-size:30px;color:${K.bordo}">Índice dos erros</div>
  <div class="ab cor it" style="left:0;right:0;top:140px;text-align:center;font-size:62px">o que a banca não perdoa</div>
  <div class="ab" style="left:100px;right:100px;top:300px;display:flex;flex-direction:column;gap:64px">
    ${c2.itens.map((t, i) => `<div style="display:flex;gap:34px;align-items:baseline"><div class="cor" style="flex:none;width:150px;text-align:right;font-size:104px;font-weight:600;color:${K.bordo}">${romano(i + 1)}</div><div style="font-size:50px;line-height:1.2">${esc(t)}</div></div>`).join('')}
  </div>
  <div class="ab" style="left:100px;right:100px;top:1160px;font-size:34px;color:#4a3d31;text-align:center"><span class="it" style="color:${K.bordo}">Fundamento:</span> ${esc(c2.base)}.</div>
  ${rodape('II / III', K.bordo)}`)));
pecas.push(P('c2-3', pg('musgo', `
  ${moldura(40, 40, 1000, 1270)}
  <div class="ab cor ouro" style="left:100px;top:110px;font-size:240px;line-height:.8">“</div>
  <div class="ab cor" style="left:120px;right:120px;top:260px;font-size:104px;font-weight:600;line-height:1.02">Qual desses você já cometeu?</div>
  <div class="ab it" style="left:120px;top:620px;font-size:46px;color:${K.perg}">Conta nos comentários.</div>
  <div class="ab" style="left:120px;right:120px;top:760px;display:flex;justify-content:space-between">
    ${[1, 2, 3, 4].map(n => `<div style="width:170px;height:170px;border-radius:50%;border:3px solid ${K.ouro};box-shadow:inset 0 0 0 9px ${K.musgo},inset 0 0 0 11px ${K.ouro};display:grid;place-items:center" class="cor ouro"><span style="font-size:80px;font-weight:600">${romano(n)}</span></div>`).join('')}</div>
  <div class="ab it" style="left:120px;right:120px;top:980px;text-align:center;font-size:36px;color:${K.perg}">vale responder só com o número</div>
  ${selo(170, 820, 1060, 12)}
  ${rodape('III / III')}`)));

// ---------- c3 · questão ----------
const c3 = C.c3;
const ficha = (y, h, body) => `<div class="ab" style="left:70px;top:${y}px;width:940px;height:${h}px;background:#f6efdd;color:${K.tinta};border-radius:10px;box-shadow:0 18px 40px rgba(0,0,0,.35);padding:56px 64px;background-image:linear-gradient(transparent 0,transparent 108px,${K.bordo} 108px,${K.bordo} 111px,transparent 111px)">
  <div class="ab" style="left:50%;bottom:36px;width:50px;height:50px;margin-left:-25px;border-radius:50%;background:${K.musgo};box-shadow:inset 0 3px 6px rgba(0,0,0,.5)"></div>${body}</div>`;
const opc = (marca) => `<div style="display:flex;gap:70px;margin-top:50px;font-size:50px">${c3.opcoes.map((o, i) => `<span style="display:flex;align-items:center;gap:16px"><span class="cor" style="font-size:52px">(${marca !== undefined && i === c3.certa ? `<b style="color:${K.carimbo}">x</b>` : '&nbsp;&nbsp;'})</span>${o}</span>`).join('')}</div>`;
pecas.push(P('c3-1', pg('musgo', `
  <div class="ab cor it" style="left:80px;top:110px;font-size:108px;font-weight:500;line-height:.98">Certo<br>ou errado<span class="ouro">?</span></div>
  <div class="ab sc ouro" style="left:84px;top:370px;font-size:28px">Questão I · Família</div>
  ${oval(660, 70, 340, 430, foto('pensando'), '50% 34%', K.ouro, 1.6)}
  ${ficha(560, 660, `<div style="display:flex;justify-content:space-between;font-size:30px;color:${K.bordo}"><span class="sc" style="font-size:28px">Ficha nº 358</span><span class="it">alimentos · maioridade</span></div>
    <div class="cor" style="font-size:80px;font-weight:600;line-height:1.05;margin-top:76px">${esc(c3.pergunta)}</div>${opc()}`)}
  ${rodape('I / III')}`)));
pecas.push(P('c3-2', pg('musgo', `
  <div class="ab sc ouro" style="left:0;right:0;top:90px;text-align:center;font-size:30px">Gabarito comentado</div>
  ${ficha(170, 1040, `<div style="display:flex;justify-content:space-between;font-size:30px;color:${K.bordo}"><span class="sc" style="font-size:28px">Ficha nº 358</span><span class="it">alimentos · maioridade</span></div>
    <div style="font-size:34px;line-height:1.3;margin-top:64px;color:#4a3d31" class="it">${esc(c3.pergunta)}</div>
    ${opc(1)}
    <div class="cap" style="font-size:50px;line-height:1.28;margin-top:56px">A maioridade não encerra a pensão sozinha: a exoneração depende de decisão judicial, com contraditório.</div>
    <div class="it" style="font-size:40px;margin-top:40px;color:${K.bordo}">${esc(c3.base)}</div>`)}
  <div class="ab" style="left:520px;top:960px;transform:rotate(-10deg);border:7px double ${K.carimbo};color:${K.carimbo};padding:10px 34px;opacity:.88;z-index:12;font-family:'Cormorant Garamond';font-weight:700;font-size:92px;letter-spacing:.12em">ERRADO</div>
  ${rodape('II / III')}`)));
pecas.push(P('c3-3', pg('papel', `
  ${arco(560, 230, 440, 860, foto('joinha'), '45% 40%', K.musgo, 1.7)}
  <div class="ab cor it" style="left:80px;top:180px;font-size:140px;font-weight:600;color:${K.bordo}">Acertou?</div>
  <div class="ab" style="left:80px;top:400px;width:440px;font-size:46px;line-height:1.28">Comenta <b class="it" style="color:${K.bordo}">“acertei”</b> e marca quem precisa saber disso.</div>
  <div class="ab" style="left:80px;top:720px">${orn(K.bordo)}</div>
  <div class="ab it" style="left:80px;top:770px;width:420px;font-size:34px;line-height:1.3;color:#4a3d31">Na dúvida, relê a Súmula 358 do STJ antes da prova.</div>
  ${selo(190, 440, 980, -12)}
  ${rodape('III / III', K.bordo)}`)));

// ---------- c4 · mito ou verdade ----------
const c4 = C.c4;
pecas.push(P('c4-1', pg('musgo', `
  <div class="ab" style="left:470px;top:330px;width:560px;height:1100px;border-radius:280px 280px 0 0;background:radial-gradient(ellipse at 50% 30%,#86303d,${K.bordo} 60%,#4b131c);border:3px solid ${K.ouro}"></div>
  <img class="ab duo" src="${recorte('empolgada')}" style="left:420px;top:420px;width:680px">
  <div class="ab sc ouro" style="left:80px;top:120px;font-size:30px">ECA · art. 42</div>
  <div class="ab cor" style="left:70px;top:170px;font-size:200px;font-weight:600;line-height:.9">Adoção</div>
  <div class="ab cor it ouro" style="left:80px;top:400px;font-size:84px;line-height:1">mito<br><span style="color:${K.papel}">ou</span> verdade?</div>
  <div class="ab" style="left:80px;top:700px;width:380px;font-size:38px;line-height:1.3;color:${K.perg}">Duas afirmações que todo mundo repete. Uma delas está errada.</div>
  ${rodape('I / III', K.ouro, true)}`)));
const verbete = (it) => `<div>
  <div style="display:flex;align-items:center;gap:22px"><span class="sc" style="font-size:30px;padding:8px 20px;border:2.5px solid ${it.v ? K.musgo : K.carimbo};color:${it.v ? K.musgo : K.carimbo}">${it.v ? 'Verdade' : 'Mito'}</span><span class="it" style="font-size:30px;color:#6b5a48">${esc(it.base)}</span></div>
  <div class="cor" style="font-size:84px;font-weight:600;line-height:1.02;margin-top:26px">${esc(it.frase)}</div>
  <div class="cap" style="font-size:46px;line-height:1.28;margin-top:28px">${esc(it.txt)}</div></div>`;
pecas.push(P('c4-2', pg('papel', `
  <div class="ab" style="left:90px;right:90px;top:100px">${verbete(c4.itens[0])}</div>
  <div class="ab" style="left:0;right:0;top:650px;display:flex;justify-content:center">${orn(K.bordo)}</div>
  <div class="ab" style="left:90px;right:90px;top:730px">${verbete(c4.itens[1])}</div>
  ${rodape('II / III', K.bordo)}`)));
pecas.push(P('c4-3', pg('bordo', `
  ${moldura(40, 40, 1000, 1270)}
  <div class="ab cor it" style="left:0;right:0;top:170px;text-align:center;font-size:76px;line-height:1.08">Quer mais mito<br>ou verdade de ECA?</div>
  <div class="ab sc" style="left:0;right:0;top:420px;text-align:center;font-size:32px;color:${K.perg}">Comenta a palavra</div>
  <div class="ab" style="left:240px;top:500px;width:600px;height:330px;border:3px solid ${K.ouro};box-shadow:inset 0 0 0 12px ${K.bordo},inset 0 0 0 14px ${K.ouro};display:grid;place-items:center"><span class="cor ouro" style="font-size:220px;font-weight:600;letter-spacing:.04em">ECA</span></div>
  <div class="ab it" style="left:0;right:0;top:900px;text-align:center;font-size:40px;color:${K.perg}">que o próximo volume sai pra você.</div>
  ${selo(190, 445, 1010, -6)}
  ${rodape('III / III')}`)));

// ---------- c5 · apresentação ----------
const c5 = C.c5;
pecas.push(P('c5-1', pg('musgo', `
  <div class="ab" style="left:90px;top:80px;width:900px;height:960px;padding:30px;background:linear-gradient(135deg,#d9bb7a,#8a6a33 30%,#e3c88d 55%,#7a5a28 80%,#c8a865);box-shadow:0 24px 50px rgba(0,0,0,.5)">
    <div style="position:relative;width:100%;height:100%;border:6px solid #5e4520;overflow:hidden"><img class="f duo" src="${foto('empolgada')}" style="object-position:55% 26%;transform:scale(1.25);transform-origin:52% 30%"></div></div>
  <div class="ab" style="left:240px;top:990px;width:600px;padding:26px 30px 30px;text-align:center;background:linear-gradient(135deg,#e6cf98,#b4914f 50%,#d8bd80);color:${K.tinta};box-shadow:0 10px 24px rgba(0,0,0,.45);z-index:3">
    <div class="cor it" style="font-size:84px;font-weight:600">Prazer, Eduarda</div>
    <div class="sc" style="font-size:24px;margin-top:8px;letter-spacing:.14em">Advogada · Civil e ECA · OAB</div></div>
  ${rodape('I / III')}`)));
const livros = [[K.musgo, K.ouro, 860], [K.bordo, K.ouro, 900], [K.ouro, K.tinta, 830], [K.tinta, K.ouro, 880]];
pecas.push(P('c5-2', pg('papel', `
  <div class="ab sc" style="left:90px;top:90px;font-size:30px;color:${K.bordo}">Nesta estante</div>
  <div class="ab cap" style="left:90px;right:90px;top:150px;font-size:44px;line-height:1.3">${esc(c5.sub)}</div>
  <div class="ab" style="left:0;right:0;top:500px;display:flex;flex-direction:column;align-items:center;gap:0">
    ${c5.itens.map((t, i) => { const [bg, fg, w] = livros[i]; return `<div style="width:${w}px;height:170px;background:${bg};color:${fg};border-radius:8px;display:flex;align-items:center;justify-content:space-between;padding:0 44px;margin-left:${[0, 50, -40, 30][i]}px;box-shadow:inset 0 -6px 0 rgba(0,0,0,.25),inset 0 6px 0 rgba(255,255,255,.12),0 6px 10px rgba(0,0,0,.25);position:relative">
      <span style="position:absolute;left:24px;top:0;bottom:0;width:10px;border-left:3px solid ${fg};border-right:3px solid ${fg};opacity:.6"></span><span style="position:absolute;right:24px;top:0;bottom:0;width:10px;border-left:3px solid ${fg};border-right:3px solid ${fg};opacity:.6"></span>
      <span class="cor" style="font-size:60px;font-weight:600;margin-left:40px">${esc(t)}</span><span class="cor" style="font-size:44px;font-weight:700;margin-right:40px">${romano(i + 1)}</span></div>`; }).join('')}
  </div>
  ${rodape('II / III', K.bordo)}`)));
pecas.push(P('c5-3', pg('musgo', `
  ${moldura(40, 40, 1000, 1270)}
  ${oval(330, 120, 420, 520, foto('joinha'), '42% 36%', K.ouro, 1.4)}
  <div class="ab cor" style="left:100px;right:100px;top:700px;text-align:center;font-size:88px;font-weight:600;line-height:1.04">Me segue pra estudar Civil comigo.</div>
  <div class="ab" style="left:0;right:0;top:920px;display:flex;justify-content:center">${orn()}</div>
  <div class="ab cor it ouro" style="left:0;right:0;top:970px;text-align:center;font-size:58px">${PERFIL.arroba}</div>
  ${selo(150, 760, 520, 10)}
  ${rodape('III / III')}`)));

// ---------- posts únicos ----------
pecas.push(P('p1', pg('papel', `
  ${moldura(50, 50, 980, 1250, K.bordo)}
  <div class="ab cor" style="left:120px;top:170px;font-size:300px;line-height:.8;color:${K.ouro}">“</div>
  <div class="ab cor" style="left:130px;right:130px;top:400px;font-size:120px;font-weight:600;line-height:1">Peça boa não se decora.</div>
  <div class="ab cor it" style="left:130px;top:680px;font-size:170px;font-weight:600;color:${K.bordo};line-height:1">Se entende.</div>
  <div class="ab" style="left:130px;top:920px">${orn(K.bordo)}</div>
  <div class="ab sc" style="left:130px;top:980px;font-size:30px;color:${K.tinta}">Eduarda Caraciolo</div>
  ${selo(200, 780, 1000, -12)}`)));
pecas.push(P('p2', pg('musgo', `
  <div class="ab" style="left:90px;top:110px;width:900px;height:1080px;background:${K.papel};color:${K.tinta};box-shadow:0 20px 44px rgba(0,0,0,.45);transform:rotate(-1.2deg)"></div>
  <div class="ab" style="left:90px;top:110px;width:900px;height:1080px;padding:80px 84px;color:${K.tinta};transform:rotate(-1.2deg)">
    <div class="it" style="font-size:36px;color:${K.bordo}">Querida leitora, querido leitor,</div>
    <div class="cor" style="font-size:104px;font-weight:600;line-height:1.02;margin-top:40px">Qual tema de Civil mais te trava?</div>
    <div class="cap" style="font-size:44px;line-height:1.32;margin-top:44px">${esc(C.p2.txt)}</div>
    <div class="cor it" style="font-size:52px;margin-top:60px;color:${K.bordo}">com carinho, Eduarda</div></div>
  ${oval(70, 1010, 240, 240, foto('pensando'), '50% 38%', K.ouro, 2.2)}
  ${selo(210, 790, 1040, 14)}`)));
const p3 = C.p3;
pecas.push(P('p3', pg('musgo', `
  <div class="ab sc ouro" style="left:80px;top:90px;font-size:30px">Dica de Sucessões · ${esc(p3.base)}</div>
  <div class="ab cor" style="left:76px;top:140px;font-size:96px;font-weight:600;line-height:1">Ordem da vocação <span class="it ouro">hereditária</span></div>
  ${p3.itens.map((t, i) => `<div class="ab" style="left:${80 + i * 50}px;top:${410 + i * 210}px;width:${840 - i * 50}px;min-height:180px;background:${i % 2 ? K.perg : K.papel};color:${K.tinta};display:flex;align-items:center;gap:30px;padding:24px 34px;box-shadow:0 10px 22px rgba(0,0,0,.3)">
    <div class="cor" style="flex:none;width:100px;font-size:90px;font-weight:600;color:${K.bordo};text-align:center">${romano(i + 1)}</div><div style="font-size:38px;line-height:1.22">${esc(t)}</div></div>`).join('')}
  <div class="ab it" style="left:80px;top:1250px;font-size:30px;color:${K.perg}">Cada classe só é chamada na falta da anterior.</div>`)));

// ---------- stories ----------
pecas.push(P('s1', pg('musgo', `
  ${moldura(40, 40, 1000, 1840)}
  <div class="ab sc ouro" style="left:0;right:0;top:120px;text-align:center;font-size:32px">Caixinha de perguntas</div>
  ${arco(250, 200, 580, 760, foto('surpresa'), '50% 38%', K.ouro, 1.35)}
  <div class="ab cor" style="left:100px;right:100px;top:1010px;text-align:center;font-size:104px;font-weight:600;line-height:1.02">Me pergunta qualquer coisa sobre <span class="it ouro">ECA</span></div>
  <div class="ab" style="left:150px;top:1340px;width:780px;height:300px;background:${K.papel};color:#7b6a55;display:grid;place-items:center;font-size:40px;box-shadow:0 16px 30px rgba(0,0,0,.4)" class="it"><span class="it">escreva aqui a sua dúvida</span></div>
  ${selo(180, 800, 1560, 10)}
  ${rodape('')}`, HS), HS));
pecas.push(P('s2', pg('bordo', `
  <div class="ab sc ouro" style="left:0;right:0;top:150px;text-align:center;font-size:32px">Novo capítulo</div>
  <div class="ab cor" style="left:0;right:0;top:210px;text-align:center;font-size:120px;font-weight:600">Post novo no feed</div>
  <div class="ab musgo" style="left:170px;top:450px;width:740px;height:925px;transform:rotate(-2deg);box-shadow:0 26px 50px rgba(0,0,0,.5);overflow:hidden;border:10px solid ${K.papel}">
    ${arco(190, 60, 340, 440, foto('explicando'), '50% 34%', K.ouro, 1.3)}
    <div class="ab cor" style="left:0;right:0;top:560px;text-align:center;font-size:92px;font-weight:600">Prescrição</div>
    <div class="ab cor it ouro" style="left:0;right:0;top:660px;text-align:center;font-size:82px">x decadência</div>
    <div class="ab it" style="left:0;right:0;top:780px;text-align:center;font-size:32px;color:${K.perg}">${esc(c1.sub)}</div></div>
  <div class="ab" style="left:0;right:0;top:1490px;text-align:center;font-size:46px" class="it"><span class="it">Toque para ler a lição completa</span></div>
  <div class="ab" style="left:0;right:0;top:1580px;display:flex;justify-content:center">${orn()}</div>
  ${selo(170, 780, 1330, 12)}
  ${rodape('')}`, HS), HS));

// ---------- destaques e avatar ----------
const dest = (n, i) => `<div style="width:270px;height:270px;border-radius:50%;background:${i % 2 ? K.bordo : K.musgo};border:3px solid ${K.ouro};box-shadow:inset 0 0 0 10px ${i % 2 ? K.bordo : K.musgo},inset 0 0 0 12px ${K.ouro},0 10px 20px rgba(0,0,0,.3);display:flex;flex-direction:column;align-items:center;justify-content:center;color:${K.papel}">
  <div class="cor ouro" style="font-size:44px;font-weight:700">${romano(i + 1)}</div><div class="cor it" style="font-size:60px;font-weight:600;margin-top:4px">${n}</div></div>`;
pecas.push(P('destaques', pg('papel', `
  <div class="ab sc" style="left:0;right:0;top:110px;text-align:center;font-size:32px;color:${K.bordo}">Destaques</div>
  <div class="ab" style="left:60px;right:60px;top:230px;display:flex;justify-content:space-around">${C.destaques.slice(0, 3).map(dest).join('')}</div>
  <div class="ab" style="left:220px;right:220px;top:590px;display:flex;justify-content:space-around">${C.destaques.slice(3).map((n, i) => dest(n, i + 3)).join('')}</div>`), 1080));
pecas.push(P('avatar', pg('musgo', `
  <div class="ab" style="left:140px;top:140px;width:800px;height:800px;border-radius:50%;background:radial-gradient(circle at 50% 40%,#86303d,${K.bordo} 60%,#4b131c)"></div>
  <img class="ab" src="${recorte('empolgada')}" style="left:170px;top:110px;width:860px;filter:sepia(.35) saturate(.85) contrast(1.05)">`), 1080));

await render(ID, pecas, { fontes: FONTES, css });

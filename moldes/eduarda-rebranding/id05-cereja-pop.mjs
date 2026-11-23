// Projeto 05 · "Cereja Pop": vermelho-cereja, rosa chiclete e creme; Anton + Inter;
// adesivos com contorno preto e sombra dura, selo serrilhado, recortes dela com contorno branco de figurinha.
import { render, CONTEUDO as C, PERFIL, esc, root } from './base.mjs';
import path from 'node:path';
import fs from 'node:fs';

// O Chromium bloqueia file:// numa página aberta com setContent; as fotos entram como data URI.
const durl = (arq, mime) => `data:${mime};base64,${fs.readFileSync(arq).toString('base64')}`;
const cache = {};
const foto = n => cache['f' + n] ??= durl(path.join(root, 'fotos', `${n}.jpg`), 'image/jpeg');
const recorte = n => cache['r' + n] ??= durl(path.join(root, 'fotos', `${n}-recorte.png`), 'image/png');

const ID = 'id05-cereja-pop';
const K = { cereja: '#D3122F', chiclete: '#FF7EB6', rosa: '#FFCFE3', creme: '#FFF1DC', tinta: '#17110F', branco: '#FFFFFF' };
const W = 1080, H = 1350;

const fontes = 'https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800;900&display=swap';
const css = `
body{font-family:Inter,sans-serif;color:${K.tinta};-webkit-font-smoothing:antialiased}
.pg{position:absolute;inset:0;overflow:hidden}
.an{font-family:Anton,sans-serif;text-transform:uppercase;line-height:.92;letter-spacing:.005em;font-weight:400}
.abs{position:absolute}
.stk{display:inline-block;border:5px solid ${K.tinta};border-radius:999px;box-shadow:8px 8px 0 ${K.tinta};font-weight:800}
.card{border:5px solid ${K.tinta};border-radius:36px;box-shadow:12px 12px 0 ${K.tinta}}
.fig{filter:url(#fig)}
.rod{position:absolute;left:64px;bottom:52px;font-size:28px;font-weight:700;letter-spacing:.01em}
.pag{position:absolute;right:64px;bottom:44px;font-family:Anton;font-size:34px;padding:6px 22px}
`;

// Contorno branco de figurinha + sombra suave (para os recortes).
const DEFS = `<svg width="0" height="0" style="position:absolute"><defs>
<filter id="fig" x="-15%" y="-15%" width="130%" height="130%">
<feMorphology in="SourceAlpha" operator="dilate" radius="14" result="d"/>
<feFlood flood-color="#fff"/><feComposite in2="d" operator="in" result="o"/>
<feOffset in="d" dx="10" dy="12" result="s0"/><feFlood flood-color="${K.tinta}"/><feComposite in2="s0" operator="in" result="s"/>
<feMerge><feMergeNode in="s"/><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs></svg>`;

// Selo serrilhado (a "marca" de selo do projeto).
function selo(size, cor, txt, { rot = -10, fs = 44, cor2 = K.creme, pontas = 22, borda = true } = {}) {
  const r1 = 50, r2 = 44, pts = [];
  for (let i = 0; i < pontas * 2; i++) { const a = Math.PI * i / pontas, r = i % 2 ? r2 : r1; pts.push(`${(50 + r * Math.sin(a)).toFixed(2)},${(50 - r * Math.cos(a)).toFixed(2)}`); }
  return `<div style="position:relative;width:${size}px;height:${size}px;transform:rotate(${rot}deg)">
  <svg viewBox="-4 -4 108 108" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible">
  ${borda ? `<polygon points="${pts.join(' ')}" transform="translate(4,4)" fill="${K.tinta}"/>` : ''}
  <polygon points="${pts.join(' ')}" fill="${cor}" ${borda ? `stroke="${K.tinta}" stroke-width="2.4" stroke-linejoin="round"` : ''}/></svg>
  <div class="an" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;font-size:${fs}px;color:${cor2};line-height:.95"><div>${txt}</div></div></div>`;
}
const xis = (s, cor = K.tinta, fundo = K.creme) => `<div style="width:${s}px;height:${s}px;border-radius:50%;background:${cor};border:5px solid ${K.tinta};display:flex;align-items:center;justify-content:center;box-shadow:7px 7px 0 ${K.tinta}">
<svg viewBox="0 0 10 10" width="${s * .5}" height="${s * .5}"><path d="M2 2L8 8M8 2L2 8" stroke="${fundo}" stroke-width="2.1" stroke-linecap="round"/></svg></div>`;
const check = (s, cor = K.chiclete, tr = K.tinta) => `<div style="width:${s}px;height:${s}px;border-radius:50%;background:${cor};border:5px solid ${K.tinta};display:flex;align-items:center;justify-content:center;box-shadow:7px 7px 0 ${K.tinta}">
<svg viewBox="0 0 10 10" width="${s * .52}" height="${s * .52}"><path d="M1.8 5.4L4.1 7.6L8.4 2.6" fill="none" stroke="${tr}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`;
const pag = (n, bg = K.creme) => `<div class="stk pag" style="background:${bg};box-shadow:6px 6px 0 ${K.tinta}">${n}/3</div>`;
const rod = (cor = K.tinta) => `<div class="rod" style="color:${cor}">${PERFIL.arroba}</div>`;
const marca = (cor = K.creme, x = 64, y = 56) => `<div class="abs an" style="left:${x}px;top:${y}px;font-size:40px;color:${cor};letter-spacing:.02em">Eduarda<span style="color:${cor === K.creme ? K.chiclete : K.cereja}">.</span></div>`;
const pg = (bg, inner) => `${DEFS}<div class="pg" style="background:${bg}">${inner}</div>`;
const fotoBox = (n, { x, y, w, h, pos = '50% 30%', rot = 0, r = 36, zoom = 'cover', extra = '' }) =>
  `<div class="abs card" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;transform:rotate(${rot}deg);overflow:hidden;background:url(${foto(n)}) ${pos}/${zoom} no-repeat;border-radius:${r}px;${extra}"></div>`;
// Abaixo desta fração da altura o recorte fica irregular: a linha de corte tem de cair na borda da tela ou atrás de um card.
const SEGURO = { surpresa: .6, empolgada: .6, joinha: .66 };
const recB = (n, { x, corte, h, rot = 0 }) => rec(n, { x, y: Math.round(corte - SEGURO[n] * h), h, rot });
const rec = (n, { x, y, h, rot = 0, flip = false }) => `<img class="abs fig" src="${recorte(n)}" style="left:${x}px;top:${y}px;height:${h}px;transform:rotate(${rot}deg)${flip ? ' scaleX(-1)' : ''}">`;
const capaPng = path.join(root, 'saida', ID, 'c1-1.png');

const P = [];
const add = (nome, html, w = W, h = H) => P.push(typeof html === 'function' ? { nome, w, h, get html() { return html(); } } : { nome, w, h, html });

// ───────────── 00 identidade ─────────────
add('00-identidade', pg(K.creme, `
  <div class="abs" style="left:0;top:0;width:1080px;height:480px;background:${K.cereja}"></div>
  <div class="abs an" style="left:64px;top:52px;font-size:30px;color:${K.creme};letter-spacing:.08em">Projeto 05 · Identidade</div>
  <div class="abs an" style="left:60px;top:118px;font-size:214px;color:${K.creme};line-height:.86">Eduarda<span style="color:${K.chiclete}">.</span></div>
  <div class="abs" style="left:68px;top:318px;font-size:30px;font-weight:800;letter-spacing:.26em;color:${K.creme}">CARACIOLO</div>
  <div class="abs stk" style="left:66px;top:384px;background:${K.chiclete};padding:12px 26px;font-size:28px;transform:rotate(-3deg)">Direito Civil e ECA, sem juridiquês</div>
  <div class="abs" style="right:70px;top:88px">${selo(230, K.chiclete, 'EC', { fs: 104, cor2: K.tinta, rot: 12 })}</div>
  <div class="abs an" style="left:64px;top:516px;font-size:36px">Paleta</div>
  <div class="abs" style="left:64px;top:566px;display:flex;gap:18px">
    ${[['Cereja', K.cereja, K.creme], ['Chiclete', K.chiclete, K.tinta], ['Rosa', K.rosa, K.tinta], ['Creme', K.creme, K.tinta], ['Tinta', K.tinta, K.creme]].map(([n, c, t]) => `
    <div style="width:172px;height:160px;border-radius:30px;background:${c};border:5px solid ${K.tinta};color:${t};padding:18px;display:flex;flex-direction:column;justify-content:flex-end;box-shadow:7px 7px 0 ${K.tinta}">
    <div style="font-weight:800;font-size:28px">${n}</div><div style="font-size:24px;font-weight:600;opacity:.85">${c}</div></div>`).join('')}
  </div>
  <div class="abs an" style="left:64px;top:780px;font-size:36px">Tipografia</div>
  <div class="abs" style="left:64px;top:830px;width:480px">
    <div class="an" style="font-size:84px;color:${K.cereja}">Anton</div>
    <div style="font-size:28px;font-weight:600;margin-top:10px;line-height:1.3">Títulos condensados, sempre em caixa alta e bem grandes.</div>
    <div style="font-size:48px;font-weight:900;margin-top:18px;letter-spacing:-.02em">Inter</div>
    <div style="font-size:28px;font-weight:500;line-height:1.3;margin-top:6px">Texto corrido, adesivos e legendas. Peso 500 a 900.</div>
  </div>
  <div class="abs an" style="left:590px;top:780px;font-size:36px">Elementos</div>
  <div class="abs" style="left:590px;top:836px;width:440px;height:364px">
    <div class="abs stk" style="left:0;top:0;background:${K.cereja};color:${K.creme};padding:10px 24px;font-size:28px;transform:rotate(-4deg)">ADESIVO</div>
    <div class="abs" style="left:250px;top:-14px">${selo(140, K.creme, 'Selo', { fs: 40, cor2: K.cereja, rot: 8 })}</div>
    <div class="abs" style="left:0;top:116px">${check(104)}</div>
    <div class="abs" style="left:126px;top:116px">${xis(104)}</div>
    <div class="abs" style="left:0;top:240px;font-size:28px;font-weight:600;width:250px;line-height:1.25">certo em rosa, errado com X preto</div>
    <img class="abs fig" src="${recorte('empolgada')}" style="left:262px;top:${Math.round(364 - .6 * 230)}px;height:230px">
  </div>
  <div class="abs" style="left:0;bottom:0;width:1080px;height:150px;background:${K.tinta};color:${K.creme};padding:30px 64px">
    <div class="an" style="font-size:34px;color:${K.chiclete}">Tom de voz</div>
    <div style="font-size:29px;font-weight:600;margin-top:8px;line-height:1.3">Animado, direto e de igual pra igual. Frase curta, humor leve, lei explicada sem pose.</div>
  </div>`));

// ───────────── C1 explicativo (capa com recorte gigante; interna em duas metades) ─────────────
add('c1-1', pg(K.cereja, `
  ${marca()}
  <div class="abs an" style="left:58px;top:150px;font-size:178px;color:${K.creme}">Prescrição</div>
  <div class="abs" style="left:64px;top:326px">${selo(150, K.chiclete, 'x', { fs: 110, cor2: K.tinta, rot: -8 })}</div>
  <div class="abs an" style="left:58px;top:490px;font-size:178px;color:${K.creme}">Decadência</div>
  ${recB('surpresa', { x: 430, corte: 1196, h: 880 })}
  <div class="abs" style="left:0;top:1190px;width:1080px;height:160px;background:${K.tinta};display:flex;align-items:center;justify-content:space-between;padding:0 64px">
    <div style="font-size:30px;font-weight:700;color:${K.creme}">${PERFIL.arroba}</div>
    <div class="stk" style="background:${K.chiclete};padding:10px 28px;font-size:30px;transform:rotate(-3deg);border-color:${K.creme};box-shadow:6px 6px 0 ${K.cereja}">arrasta pro lado</div></div>
  <div class="abs stk" style="left:56px;top:760px;background:${K.creme};padding:18px 30px;font-size:38px;transform:rotate(-4deg);max-width:470px;line-height:1.15;border-radius:30px">o jeito fácil de não confundir</div>
`));

const metade = (it, bg, top, cor = K.tinta, sel) => `
  <div class="abs" style="left:0;top:${top}px;width:1080px;height:675px;background:${bg};padding:70px 64px 0">
    <div class="abs" style="right:60px;top:56px">${sel}</div>
    <div class="an" style="font-size:120px;color:${cor}">${esc(it.nome)}</div>
    <div style="font-size:44px;font-weight:800;line-height:1.15;margin-top:26px;max-width:760px;color:${cor}">${esc(it.txt)}</div>
    <div style="font-size:32px;font-weight:500;line-height:1.35;margin-top:22px;max-width:880px;color:${cor}">${esc(it.det)}</div>
    <div class="stk" style="margin-top:28px;background:${K.creme};color:${K.tinta};padding:8px 24px;font-size:28px;box-shadow:6px 6px 0 ${K.tinta}">${esc(it.base)}</div>
  </div>`;
add('c1-2', pg(K.creme, `
  ${metade(C.c1.itens[0], K.creme, 0, K.tinta, selo(170, K.chiclete, 'Perde a<br>pretensão', { fs: 27, cor2: K.tinta, rot: 10 }))}
  ${metade(C.c1.itens[1], K.cereja, 675, K.creme, selo(150, K.creme, 'Perde o<br>direito', { fs: 34, cor2: K.cereja, rot: -10 }))}
  <div class="abs" style="left:470px;top:627px">${selo(140, K.tinta, 'x', { fs: 90, cor2: K.chiclete, rot: 0, borda: false })}</div>
  ${pag(2)}`));

add('c1-3', pg(K.chiclete, `
  ${marca(K.tinta)}
  <div class="abs an" style="left:58px;top:160px;font-size:210px;color:${K.tinta}">Salva</div>
  <div class="abs an" style="left:58px;top:355px;font-size:210px;color:${K.cereja}">esse post</div>
  ${recB('empolgada', { x: 480, corte: 1352, h: 780 })}
  <div class="abs card" style="left:64px;top:620px;width:600px;background:${K.creme};padding:40px 44px;transform:rotate(-2deg)">
    <div style="font-size:42px;font-weight:800;line-height:1.2">${esc(C.c1.fim)}</div>
  </div>
  ${pag(3)}`));

// ───────────── C2 lista (número gigante + foto em adesivo; interna em tiras) ─────────────
add('c2-1', pg(K.creme, `
  ${marca(K.tinta)}
  <div class="abs an" style="left:30px;top:70px;font-size:760px;color:${K.cereja};line-height:.85">4</div>
  ${fotoBox('pensando', { x: 470, y: 120, w: 540, h: 700, pos: '45% 28%', rot: 4, zoom: '190%' })}
  <div class="abs" style="left:820px;top:690px">${selo(200, K.chiclete, 'OAB<br>2ª fase', { fs: 46, cor2: K.tinta, rot: 12 })}</div>
  <div class="abs an" style="left:58px;top:850px;font-size:112px;width:980px">Erros que derrubam a <span style="color:${K.cereja}">peça de Civil</span></div>
  <div class="abs stk" style="left:64px;top:1180px;background:${K.tinta};color:${K.creme};padding:12px 28px;font-size:32px;transform:rotate(-2deg)">${esc(C.c2.sub)}</div>
  `));

const tiraCores = [[K.cereja, K.creme], [K.chiclete, K.tinta], [K.tinta, K.creme], [K.rosa, K.tinta]];
add('c2-2', pg(K.creme, `
  <div class="abs an" style="left:64px;top:60px;font-size:84px">Os 4 erros</div>
  ${C.c2.itens.map((t, i) => { const [bg, c] = tiraCores[i]; const rot = [-2, 1.5, -1.5, 2][i];
    return `<div class="abs card" style="left:${i % 2 ? 90 : 50}px;top:${190 + i * 250}px;width:940px;height:200px;background:${bg};color:${c};transform:rotate(${rot}deg);display:flex;align-items:center;padding:0 40px;gap:36px">
    <div class="an" style="font-size:150px;line-height:1;width:100px;text-align:center">${i + 1}</div>
    <div style="font-size:42px;font-weight:800;line-height:1.15">${esc(t)}</div></div>`; }).join('')}
  <div class="abs stk" style="left:64px;top:1200px;background:${K.creme};padding:8px 24px;font-size:28px;box-shadow:6px 6px 0 ${K.tinta}">${esc(C.c2.base)}</div>
  ${pag(2, K.chiclete)}`));

add('c2-3', pg(K.tinta, `
  ${marca(K.creme)}
  <div class="abs an" style="left:58px;top:170px;font-size:150px;color:${K.creme};width:980px">Qual desses você <span style="color:${K.chiclete}">já cometeu?</span></div>
  ${recB('empolgada', { x: 590, corte: 1352, h: 820 })}
  <div class="abs card" style="left:64px;top:640px;width:640px;background:${K.creme};padding:30px 36px;border-radius:44px 44px 44px 8px;transform:rotate(-2deg)">
    <div style="font-size:28px;font-weight:700;opacity:.6">comentário</div>
    <div style="font-size:42px;font-weight:800;margin-top:6px">o 3, com certeza</div>
  </div>
  <div class="abs stk" style="left:64px;top:900px;background:${K.cereja};color:${K.creme};padding:16px 34px;font-size:40px;transform:rotate(2deg)">Conta nos comentários</div>
  ${pag(3, K.chiclete)}`));

// ───────────── C3 questão (capa estilo quiz; resposta com carimbo X) ─────────────
add('c3-1', pg(K.chiclete, `
  ${marca(K.tinta)}
  <div class="abs" style="left:64px;top:140px;display:flex;gap:18px">
    <div class="stk" style="background:${K.creme};padding:12px 30px;font-size:44px;font-family:Anton;font-weight:400;transform:rotate(-4deg)">CERTO</div>
    <div class="stk" style="background:${K.tinta};color:${K.creme};padding:12px 30px;font-size:44px;font-family:Anton;font-weight:400;transform:rotate(3deg)">OU ERRADO?</div>
  </div>
  <div class="abs card" style="left:56px;top:290px;width:968px;height:500px;background:${K.creme};padding:50px 52px">
    <div class="an" style="font-size:124px;width:640px">O filho fez <span style="color:${K.cereja}">18 anos.</span></div>
    <div style="font-size:58px;font-weight:800;line-height:1.12;margin-top:24px;width:860px">A pensão acaba automaticamente?</div>
  </div>
  ${recB('surpresa', { x: 380, corte: 1352, h: 1000 })}
  <div class="abs stk" style="left:56px;top:1110px;background:${K.cereja};color:${K.creme};padding:14px 30px;font-size:36px;transform:rotate(-3deg)">responde antes de arrastar</div>`));

add('c3-2', pg(K.creme, `
  <div class="abs an" style="left:64px;top:64px;font-size:40px;color:${K.cereja}">Resposta</div>
  <div class="abs" style="left:64px;top:130px;display:flex;align-items:center;gap:34px">
    ${xis(190)}
    <div class="an" style="font-size:240px">Errado</div>
  </div>
  <div class="abs card" style="left:56px;top:430px;width:968px;background:${K.cereja};color:${K.creme};padding:54px 52px">
    <div style="font-size:52px;font-weight:800;line-height:1.15">A maioridade não encerra a pensão sozinha.</div>
    <div style="font-size:38px;font-weight:500;line-height:1.35;margin-top:24px">A exoneração depende de decisão judicial, com contraditório.</div>
  </div>
  ${fotoBox('pensando', { x: 70, y: 860, w: 470, h: 400, pos: '42% 30%', rot: -3, zoom: '200%' })}
  <div class="abs" style="left:620px;top:850px">${selo(350, K.chiclete, 'Súmula<br><span style="font-size:120px">358</span><br><span style="font-size:40px">do STJ</span>', { fs: 60, cor2: K.tinta, rot: -8 })}</div>
  ${pag(2, K.chiclete)}`));

add('c3-3', pg(K.cereja, `
  ${marca()}
  <div class="abs an" style="left:58px;top:160px;font-size:200px;color:${K.creme}">Acertou?</div>
  <div class="abs card" style="left:64px;top:430px;width:640px;background:${K.creme};padding:40px 44px;transform:rotate(-2deg)">
    <div style="font-size:44px;font-weight:800;line-height:1.2">Comenta <span style="background:${K.chiclete};padding:0 10px;border-radius:10px">“acertei”</span> e marca quem precisa saber disso.</div>
  </div>
  ${recB('empolgada', { x: 520, corte: 1352, h: 800 })}
  <div class="abs" style="left:70px;top:760px">${selo(300, K.chiclete, 'Marca<br>alguém', { fs: 70, cor2: K.tinta, rot: -12 })}</div>
  ${pag(3)}`));

// ───────────── C4 mito ou verdade (capa em tinta com dois adesivos e foto; interna em fichas) ─────────────
add('c4-1', pg(K.tinta, `
  ${marca(K.creme)}
  ${fotoBox('explicando', { x: 420, y: 120, w: 610, h: 800, pos: '62% 22%', rot: -3, zoom: '180%', extra: `border-color:${K.creme};box-shadow:12px 12px 0 ${K.cereja}` })}
  <div class="abs an" style="left:58px;top:150px;font-size:150px;color:${K.creme}">Adoção</div>
  <div class="abs stk" style="left:40px;top:420px;background:${K.creme};padding:14px 40px;font-family:Anton;font-weight:400;font-size:110px;line-height:1.05;transform:rotate(-6deg);border-radius:40px;box-shadow:10px 10px 0 ${K.cereja};display:flex;align-items:center;gap:22px">MITO <span style="display:inline-block">${xis(84)}</span></div>
  <div class="abs an" style="left:120px;top:612px;font-size:84px;color:${K.chiclete}">ou</div>
  <div class="abs stk" style="left:40px;top:730px;background:${K.chiclete};padding:14px 40px;font-family:Anton;font-weight:400;font-size:110px;line-height:1.05;transform:rotate(4deg);border-radius:40px;box-shadow:10px 10px 0 ${K.cereja};display:flex;align-items:center;gap:22px">VERDADE <span style="display:inline-block">${check(84, K.creme)}</span></div>
  <div class="abs" style="left:64px;top:1010px;width:900px;font-size:40px;font-weight:700;color:${K.creme};line-height:1.25">2 frases sobre adoção no ECA. Você sabe qual é qual?</div>
  ${rod(K.creme)}`));

const ficha = (it, top, rot) => `<div class="abs card" style="left:56px;top:${top}px;width:968px;background:${it.v ? K.creme : K.rosa};padding:42px 48px 40px;transform:rotate(${rot}deg)">
  <div style="display:flex;align-items:center;gap:22px">${it.v ? check(92) : xis(92)}<div class="an" style="font-size:84px">${it.v ? 'Verdade' : 'Mito'}</div></div>
  <div class="an" style="font-size:66px;margin-top:22px;color:${K.cereja}">“${esc(it.frase)}”</div>
  <div style="font-size:36px;font-weight:600;line-height:1.3;margin-top:16px">${esc(it.txt)}</div>
  <div class="stk" style="margin-top:20px;background:${K.tinta};color:${K.creme};padding:6px 22px;font-size:28px;box-shadow:none">${esc(it.base)}</div></div>`;
add('c4-2', pg(K.cereja, `
  ${ficha(C.c4.itens[0], 70, -1.5)}
  ${ficha(C.c4.itens[1], 650, 1.2)}
  ${pag(2)}`));

add('c4-3', pg(K.creme, `
  ${marca(K.tinta)}
  <div class="abs an" style="left:58px;top:160px;font-size:132px;width:980px">Quer mais mito ou verdade de ECA?</div>
  <div class="abs" style="left:64px;top:620px;display:flex;align-items:center;gap:26px">
    <div class="an" style="font-size:110px">Comenta</div>
    <div class="stk" style="background:${K.cereja};color:${K.creme};padding:6px 40px;font-family:Anton;font-weight:400;font-size:120px;border-radius:40px;transform:rotate(-4deg)">ECA</div>
  </div>
  ${recB('surpresa', { x: 340, corte: 1352, h: 880 })}
  ${pag(3, K.chiclete)}`));

// ───────────── C5 apresentação (foto cheia + nome gigante; grade de adesivos; recorte) ─────────────
add('c5-1', pg(K.cereja, `
  <div class="abs" style="left:0;top:0;width:1080px;height:930px;background:url(${foto('empolgada')}) 60% 22%/150% no-repeat"></div>
  <div class="abs" style="left:0;top:880px;width:1080px;height:470px;background:${K.cereja}"></div>
  <div class="abs stk" style="left:64px;top:64px;background:${K.creme};padding:10px 26px;font-size:30px;transform:rotate(-3deg)">Oi, seja bem-vinda(o)!</div>
  <div class="abs an" style="left:50px;top:800px;font-size:250px;color:${K.creme};line-height:.84">Prazer,</div>
  <div class="abs an" style="left:50px;top:1000px;font-size:200px;color:${K.chiclete};line-height:.84">Eduarda</div>
  <div class="abs" style="left:770px;top:730px">${selo(250, K.chiclete, 'Civil<br>e ECA', { fs: 66, cor2: K.tinta, rot: 10 })}</div>
  <div class="abs" style="left:64px;top:1200px;font-size:30px;font-weight:700;color:${K.creme};width:900px;line-height:1.25">${esc(C.c5.sub)}</div>`));

const tiles = [[K.creme, K.tinta, -3], [K.chiclete, K.tinta, 2], [K.tinta, K.creme, 2.5], [K.rosa, K.tinta, -2]];
add('c5-2', pg(K.creme, `
  <div class="abs an" style="left:64px;top:70px;font-size:110px">O que rola <span style="color:${K.cereja}">por aqui</span></div>
  ${C.c5.itens.map((t, i) => { const [bg, c, r] = tiles[i]; const x = 56 + (i % 2) * 500, y = 300 + Math.floor(i / 2) * 470;
    return `<div class="abs card" style="left:${x}px;top:${y}px;width:458px;height:410px;background:${bg};color:${c};transform:rotate(${r}deg);padding:40px">
    <div class="an" style="font-size:120px;color:${i === 2 ? K.chiclete : K.cereja}">0${i + 1}</div>
    <div class="an" style="font-size:68px;margin-top:30px;line-height:1">${esc(t)}</div></div>`; }).join('')}
  ${pag(2, K.chiclete)}`));

add('c5-3', pg(K.chiclete, `
  <div class="abs an" style="left:58px;top:110px;font-size:170px;width:980px">Me segue pra estudar <span style="color:${K.cereja}">Civil comigo</span></div>
  <div class="abs stk" style="left:64px;top:690px;background:${K.creme};padding:16px 34px;font-size:44px;transform:rotate(-3deg)">${PERFIL.arroba}</div>
  <div class="abs stk" style="left:64px;top:820px;background:${K.cereja};color:${K.creme};padding:14px 34px;font-size:36px;transform:rotate(2deg)">+ Seguir</div>
  ${recB('empolgada', { x: 460, corte: 1352, h: 880 })}
  ${pag(3)}`));

// ───────────── Posts únicos ─────────────
add('p1', pg(K.creme, `
  ${marca(K.tinta)}
  <div class="abs an" style="left:56px;top:190px;font-size:250px;line-height:.86">Peça boa não se decora.</div>
  <div class="abs stk" style="left:40px;top:900px;background:${K.cereja};color:${K.creme};padding:22px 50px;font-family:Anton;font-weight:400;font-size:170px;line-height:1;border-radius:50px;transform:rotate(-5deg);box-shadow:14px 14px 0 ${K.tinta}">Se entende.</div>
  <div class="abs" style="left:830px;top:770px">${selo(190, K.chiclete, 'Civil', { fs: 56, cor2: K.tinta, rot: 14 })}</div>
  ${rod()}`));

add('p2', pg(K.cereja, `
  ${marca()}
  <div class="abs an" style="left:56px;top:150px;font-size:178px;color:${K.creme};width:980px">Qual tema de Civil mais <span style="color:${K.chiclete}">te trava?</span></div>
  ${recB('surpresa', { x: 510, corte: 1352, h: 820 })}
  <div class="abs card" style="left:56px;top:800px;width:640px;background:${K.creme};padding:34px 38px">
    <div style="font-size:42px;font-weight:800;line-height:1.2">Comenta aqui embaixo.</div>
    <div style="font-size:34px;font-weight:600;line-height:1.3;margin-top:10px">O mais pedido vira o próximo post.</div>
    <div style="margin-top:24px;border:4px solid ${K.tinta};border-radius:999px;padding:14px 26px;font-size:30px;font-weight:600;color:#7a6f6a;display:flex;justify-content:space-between">Adicione um comentário... <b style="color:${K.cereja}">Publicar</b></div>
  </div>
  `));

add('p3', pg(K.chiclete, `
  ${marca(K.tinta)}
  <div class="abs stk" style="left:64px;top:140px;background:${K.creme};padding:8px 24px;font-size:30px;transform:rotate(-3deg)">Dica de Sucessões</div>
  <div class="abs an" style="left:58px;top:230px;font-size:120px;width:980px">Ordem da vocação hereditária</div>
  ${C.p3.itens.map((t, i) => `<div class="abs card" style="left:${56 + i * 30}px;top:${530 + i * 190}px;width:${940 - i * 30}px;height:160px;background:${[K.cereja, K.creme, K.tinta, K.rosa][i]};color:${[K.creme, K.tinta, K.creme, K.tinta][i]};display:flex;align-items:center;gap:30px;padding:0 34px;box-shadow:8px 8px 0 ${K.tinta}">
    <div class="an" style="font-size:110px;width:64px;text-align:center">${i + 1}</div>
    <div style="font-size:${t.length > 50 ? 33 : 38}px;font-weight:700;line-height:1.2">${esc(t)}</div></div>`).join('')}
  <div class="abs stk" style="left:64px;top:1268px;background:${K.creme};padding:6px 22px;font-size:28px;box-shadow:5px 5px 0 ${K.tinta}">${esc(C.p3.base)}</div>`));

// ───────────── Stories ─────────────
add('s1', pg(K.cereja, `
  <div class="abs" style="left:0;top:0;width:1080px;height:1100px;background:url(${foto('surpresa')}) 58% 24%/160% no-repeat"></div>
  <div class="abs" style="left:0;top:1050px;width:1080px;height:870px;background:${K.cereja}"></div>
  <div class="abs" style="left:110px;top:900px;width:860px;border-radius:44px;background:${K.creme};border:5px solid ${K.tinta};box-shadow:14px 14px 0 ${K.tinta};overflow:hidden">
    <div style="background:${K.chiclete};padding:54px 50px 44px;text-align:center;border-bottom:5px solid ${K.tinta}">
      <div class="an" style="font-size:96px;line-height:.95">Me pergunta qualquer coisa sobre ECA</div></div>
    <div style="padding:40px 50px 46px"><div style="background:#fff;border:4px solid ${K.tinta};border-radius:26px;padding:30px;font-size:36px;font-weight:600;color:#8a7f7a;text-align:center">Digite algo...</div></div>
  </div>
  <div class="abs" style="left:780px;top:760px">${selo(220, K.creme, 'ECA', { fs: 80, cor2: K.cereja, rot: 12 })}</div>
  <div class="abs" style="left:0;top:1640px;width:1080px;text-align:center;font-size:34px;font-weight:700;color:${K.creme}">Respondo as melhores nos stories</div>
  <div class="abs an" style="left:64px;top:70px;font-size:48px;color:${K.creme}">Eduarda<span style="color:${K.chiclete}">.</span></div>`), 1080, 1920);

add('s2', () => pg(K.chiclete, `
  <div class="abs an" style="left:64px;top:70px;font-size:48px">Eduarda<span style="color:${K.cereja}">.</span></div>
  <div class="abs an" style="left:58px;top:190px;font-size:200px;width:980px;line-height:.86">Post <span style="color:${K.cereja}">novo</span> no feed</div>
  <div class="abs card" style="left:170px;top:640px;width:740px;height:925px;background:url(${fs.existsSync(capaPng) ? durl(capaPng, 'image/png') : ''}) center/cover;transform:rotate(-4deg)"></div>
  <div class="abs" style="left:740px;top:560px">${selo(230, K.cereja, 'Corre<br>lá', { fs: 62, cor2: K.creme, rot: 12 })}</div>
  <div class="abs stk" style="left:120px;top:1650px;background:${K.tinta};color:${K.creme};padding:20px 40px;font-size:42px;transform:rotate(-2deg)">${esc(C.s2.post)}</div>
  <div class="abs stk" style="left:600px;top:1760px;background:${K.creme};padding:12px 30px;font-size:34px;transform:rotate(3deg)">toca pra ver</div>`), 1080, 1920);

// ───────────── Destaques ─────────────
const dCores = [[K.cereja, K.creme, 'CC'], [K.chiclete, K.tinta, 'ECA'], [K.tinta, K.creme, 'OAB'], [K.creme, K.cereja, '!'], [K.rosa, K.cereja, 'Oi']];
add('destaques', pg(K.creme, `
  <div class="abs an" style="left:64px;top:60px;font-size:64px">Capas dos destaques</div>
  ${C.destaques.map((d, i) => { const [bg, c, sig] = dCores[i]; const x = [90, 410, 730, 250, 570][i], y = i < 3 ? 210 : 600;
    return `<div class="abs" style="left:${x}px;top:${y}px;width:260px;text-align:center">
    <div style="width:260px;height:260px;border-radius:50%;background:${bg};border:6px solid ${K.tinta};box-shadow:8px 8px 0 ${K.tinta};display:flex;align-items:center;justify-content:center">
      <div class="an" style="font-size:${sig.length > 2 ? 100 : 120}px;color:${c};line-height:1">${sig}</div></div>
    <div style="font-size:32px;font-weight:800;margin-top:20px">${d}</div></div>`; }).join('')}
  <div class="abs" style="left:64px;top:990px;font-size:28px;font-weight:600;opacity:.7">Civil · ECA · OAB · Dicas · Sobre</div>`), 1080, 1080);

add('avatar', pg(K.cereja, `
  <div class="abs" style="left:90px;top:90px;width:900px;height:900px;border-radius:50%;border:26px solid ${K.chiclete};background:url(${foto('empolgada')}) 58% 32%/190% no-repeat"></div>
  <div class="abs" style="left:700px;top:690px">${selo(210, K.cereja, 'EC', { fs: 96, cor2: K.creme, rot: 12 })}</div>
  `), 1080, 1080);

await render(ID, P, { fontes, css });

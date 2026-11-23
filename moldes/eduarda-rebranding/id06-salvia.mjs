// Projeto 06 · "Sálvia Acolhedora": verde-sálvia, bege areia, off-white e um toque de pêssego;
// formas orgânicas (blobs, arcos), cantos bem arredondados; DM Serif Display + Manrope.
import { render, CONTEUDO as C, PERFIL, esc, root } from './base.mjs';
import path from 'node:path';
import fs from 'node:fs';

const ID = 'id06-salvia';
const K = { salvia: '#9DB094', clara: '#DDE5D5', musgo: '#33463A', areia: '#EADCC6', off: '#FBF7F0', pessego: '#F3B89D', terra: '#B8654A' };
const W = 1080, H = 1350;

// O Chromium bloqueia file:// numa página aberta com setContent; as fotos entram como data URI.
const durl = (arq, mime) => `data:${mime};base64,${fs.readFileSync(arq).toString('base64')}`;
const cache = {};
const foto = n => cache['f' + n] ??= durl(path.join(root, 'fotos', `${n}.jpg`), 'image/jpeg');
const recorte = n => cache['r' + n] ??= durl(path.join(root, 'fotos', `${n}-recorte.png`), 'image/png');

const fontes = 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Manrope:wght@400;500;600;700;800&display=swap';
const css = `
body{font-family:Manrope,sans-serif;color:${K.musgo};-webkit-font-smoothing:antialiased}
.pg{position:absolute;inset:0;overflow:hidden}
.abs{position:absolute}
.se{font-family:'DM Serif Display',serif;font-weight:400;line-height:1.02;letter-spacing:-.01em}
.it{font-style:italic}
.pill{display:inline-block;border-radius:999px;font-weight:700}
.card{border-radius:56px}
.rod{position:absolute;left:72px;bottom:56px;font-size:28px;font-weight:700}
.pag{position:absolute;right:72px;bottom:50px;font-size:28px;font-weight:700;padding:8px 22px}
.ft{filter:saturate(.82) contrast(.98)}
`;

// Blob orgânico: pontos em volta de um círculo com raio variado, suavizados (Catmull-Rom → Bézier).
function blobPath(seed = 1, n = 7, amp = .14) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = 2 * Math.PI * i / n, r = 50 * (1 - amp + amp * 2 * (0.5 + 0.5 * Math.sin(seed * 12.9898 + i * 78.233) * Math.cos(seed * 4.1 + i * 1.7)));
    pts.push([50 + r * Math.cos(a), 50 + r * Math.sin(a)]);
  }
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1.map(v => v.toFixed(1))} ${c2.map(v => v.toFixed(1))} ${p2.map(v => v.toFixed(1))}`;
  }
  return d + 'Z';
}
const blob = (x, y, w, h, cor, seed = 1, { rot = 0, inner = '', amp = .14 } = {}) => `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">
  <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%;transform:rotate(${rot}deg)"><path d="${blobPath(seed, 7, amp)}" fill="${cor}"/></svg>
  ${inner ? `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center">${inner}</div>` : ''}</div>`;
// Centro do rosto em cada foto (fração da largura e da altura), para enquadrar sem cortar.
const ROSTO = { surpresa: [.6, .43], 'falando-neon': [.49, .44], pensando: [.4, .43], joinha: [.42, .43], empolgada: [.52, .4], explicando: [.52, .4] };
// Fundo com a foto: z = largura da foto em relação à caixa; o rosto fica em (ax, ay) da caixa.
const fx = (n, w, h, z = 2.2, ax = .5, ay = .42) => {
  const bw = w * z, bh = bw * 1.5, [rx, ry] = ROSTO[n];
  const px = Math.min(0, Math.max(w - bw, ax * w - rx * bw)), py = Math.min(0, Math.max(h - bh, ay * h - ry * bh));
  return `background:url(${foto(n)}) ${px.toFixed(0)}px ${py.toFixed(0)}px/${bw.toFixed(0)}px ${bh.toFixed(0)}px no-repeat`;
};
// Arco: janela com topo em semicírculo (a moldura das fotos).
const arco = (n, { x, y, w, h, z = 2.2, ax = .5, ay = .42, borda = 0, cor = K.off }) =>
  `<div class="abs ft" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${w / 2}px ${w / 2}px 48px 48px;${fx(n, w, h, z, ax, ay)};${borda ? `box-shadow:0 0 0 ${borda}px ${cor}` : ''}"></div>`;
const bola = (n, { x, y, d, z = 2.6, ax = .5, ay = .46, borda = 0, cor = K.off }) =>
  `<div class="abs ft" style="left:${x}px;top:${y}px;width:${d}px;height:${d}px;border-radius:50%;${fx(n, d, d, z, ax, ay)};${borda ? `box-shadow:0 0 0 ${borda}px ${cor}` : ''}"></div>`;
// Recorte: abaixo desta fração da altura a base fica irregular; a linha de corte cai na borda da tela ou atrás de um card.
const SEGURO = { surpresa: .6, empolgada: .6, joinha: .66 };
const rec = (n, { x, corte, h }) => `<img class="abs ft" src="${recorte(n)}" style="left:${x}px;top:${Math.round(corte - SEGURO[n] * h)}px;height:${h}px">`;

const mono = (s, bg = K.salvia, fg = K.off) => `<div style="width:${s}px;height:${s * 1.2}px;border-radius:${s / 2}px ${s / 2}px ${s * .16}px ${s * .16}px;background:${bg};display:flex;align-items:flex-end;justify-content:center;padding-bottom:${s * .16}px">
  <div class="se it" style="font-size:${s * .56}px;color:${fg};line-height:1">ec</div></div>`;
const marca = (cor = K.musgo, x = 72, y = 60) => `<div class="abs" style="left:${x}px;top:${y}px;display:flex;align-items:center;gap:16px">
  ${mono(46, cor === K.musgo ? K.salvia : K.off, cor === K.musgo ? K.off : K.musgo)}<div class="se" style="font-size:36px;color:${cor}">Eduarda Caraciolo</div></div>`;
const pag = (n, bg = K.off, fg = K.musgo) => `<div class="pill pag" style="background:${bg};color:${fg}">${n} de 3</div>`;
const rod = (cor = K.musgo) => `<div class="rod" style="color:${cor}">${PERFIL.arroba}</div>`;
const pg = (bg, inner) => `<div class="pg" style="background:${bg}">${inner}</div>`;
const ok = (s, bg = K.salvia, fg = K.off) => `<div style="width:${s}px;height:${s}px;border-radius:50%;background:${bg};display:flex;align-items:center;justify-content:center;flex:none"><svg viewBox="0 0 10 10" width="${s * .5}" height="${s * .5}"><path d="M1.8 5.4L4.1 7.6L8.4 2.6" fill="none" stroke="${fg}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`;
const no = (s, bg = K.terra, fg = K.off) => `<div style="width:${s}px;height:${s}px;border-radius:50%;background:${bg};display:flex;align-items:center;justify-content:center;flex:none"><svg viewBox="0 0 10 10" width="${s * .42}" height="${s * .42}"><path d="M2 2L8 8M8 2L2 8" stroke="${fg}" stroke-width="1.5" stroke-linecap="round"/></svg></div>`;
const capaPng = path.join(root, 'saida', ID, 'c1-1.png');

const P = [];
const add = (nome, html, w = W, h = H) => P.push(typeof html === 'function' ? { nome, w, h, get html() { return html(); } } : { nome, w, h, html });

// ───────────── 00 identidade ─────────────
add('00-identidade', pg(K.off, `
  ${blob(640, -120, 560, 520, K.clara, 3)}
  <div class="abs" style="left:72px;top:60px;font-size:28px;font-weight:700;letter-spacing:.14em;color:${K.terra}">PROJETO 06 · IDENTIDADE</div>
  <div class="abs" style="left:72px;top:140px;display:flex;align-items:center;gap:34px">
    ${mono(170)}
    <div><div class="se" style="font-size:96px;line-height:.98">Eduarda<br><span class="it">Caraciolo</span></div>
    <div style="font-size:26px;font-weight:700;letter-spacing:.2em;margin-top:16px">DIREITO CIVIL · ECA · OAB</div></div>
  </div>
  <div class="abs se" style="left:72px;top:470px;font-size:44px">Sálvia <span class="it">Acolhedora</span></div>
  <div class="abs" style="left:72px;top:540px;display:flex;gap:16px">
    ${[['Sálvia', K.salvia, K.musgo], ['Musgo', K.musgo, K.off], ['Sálvia clara', K.clara, K.musgo], ['Areia', K.areia, K.musgo], ['Pêssego', K.pessego, K.musgo], ['Off-white', K.off, K.musgo]].map(([n, c, t]) => `
    <div style="width:144px;height:180px;border-radius:72px 72px 24px 24px;background:${c};color:${t};padding:0 14px 18px;display:flex;flex-direction:column;justify-content:flex-end;${c === K.off ? `box-shadow:inset 0 0 0 3px ${K.areia}` : ''}">
    <div style="font-weight:800;font-size:24px;line-height:1.1">${n}</div><div style="font-size:22px;font-weight:600;opacity:.85;margin-top:4px">${c}</div></div>`).join('')}
  </div>
  <div class="abs card" style="left:56px;top:760px;width:470px;height:420px;background:${K.areia};padding:40px">
    <div style="font-size:26px;font-weight:800;letter-spacing:.12em;color:${K.terra}">TIPOGRAFIA</div>
    <div class="se" style="font-size:66px;margin-top:14px">DM Serif <span class="it">Display</span></div>
    <div style="font-size:28px;font-weight:500;line-height:1.3;margin-top:8px">Títulos, com itálico para a palavra que abraça.</div>
    <div style="font-size:44px;font-weight:800;margin-top:22px">Manrope</div>
    <div style="font-size:28px;font-weight:500;line-height:1.3;margin-top:4px">Texto corrido e etiquetas.</div>
  </div>
  <div class="abs card" style="left:554px;top:760px;width:470px;height:420px;background:${K.clara};padding:40px">
    <div style="font-size:26px;font-weight:800;letter-spacing:.12em;color:${K.terra}">ELEMENTOS</div>
    ${blob(40, 104, 150, 140, K.pessego, 5)}
    <div class="abs ft" style="left:210px;top:96px;width:110px;height:150px;border-radius:55px 55px 20px 20px;${fx('joinha', 110, 150, 3.4, .5, .45)}"></div>
    <div class="abs pill" style="left:40px;top:274px;background:${K.off};padding:10px 24px;font-size:26px">etiqueta</div>
    <div class="abs" style="left:240px;top:270px;display:flex;gap:12px">${ok(64)}${no(64)}</div>
    <div class="abs" style="left:40px;top:354px;font-size:26px;font-weight:600">blob · arco · pílula</div>
    <div class="abs" style="left:350px;top:110px;width:90px;height:120px;border-radius:45px 45px 16px 16px;background:${K.salvia}"></div>
  </div>
  <div class="abs" style="left:72px;top:1212px;width:940px">
    <div style="font-size:26px;font-weight:800;letter-spacing:.12em;color:${K.terra}">TOM DE VOZ</div>
    <div style="font-size:30px;font-weight:600;line-height:1.3;margin-top:6px">Acolhedor e calmo, como uma conversa na mesa da cozinha: explica com paciência e fala com quem cuida de família.</div>
  </div>`));

// ───────────── C1 explicativo (arco com foto no alto, título embaixo; interna em cartões empilhados) ─────────────
add('c1-1', pg(K.off, `
  ${blob(250, 40, 640, 640, K.pessego, 2, { amp: .1 })}
  ${arco('explicando', { x: 330, y: 110, w: 470, h: 640, z: 2.3 })}
  ${blob(720, 560, 250, 230, K.salvia, 8, { inner: `<div class="se it" style="font-size:40px;color:${K.off};line-height:1.05">guia<br>rápido</div>` })}
  ${marca()}
  <div class="abs se" style="left:72px;top:820px;font-size:118px;width:960px;line-height:.98">Prescrição <span class="it" style="color:${K.terra}">x</span> decadência</div>
  <div class="abs" style="left:72px;top:1080px;font-size:40px;font-weight:600">${esc(C.c1.sub)}</div>
  ${rod()}<div class="pill pag" style="background:${K.clara}">arrasta</div>`));

const cartao = (it, y, bg, n, cor) => `<div class="abs card" style="left:56px;top:${y}px;width:968px;height:560px;background:${bg};padding:52px 56px;overflow:hidden">
  ${blob(760, -80, 300, 280, cor, n * 3)}
  <div class="abs se it" style="right:70px;top:24px;font-size:150px;color:${K.off};line-height:1">${n}</div>
  <div class="se" style="font-size:86px;position:relative">${esc(it.nome)}</div>
  <div style="font-size:40px;font-weight:700;line-height:1.22;margin-top:18px;width:740px;position:relative">${esc(it.txt)}</div>
  <div style="font-size:32px;font-weight:500;line-height:1.38;margin-top:16px;width:860px">${esc(it.det)}</div>
  <div class="pill" style="margin-top:22px;background:${K.off};padding:8px 24px;font-size:28px">${esc(it.base)}</div></div>`;
add('c1-2', pg(K.off, `
  ${cartao(C.c1.itens[0], 70, K.clara, 1, K.salvia)}
  ${cartao(C.c1.itens[1], 660, K.areia, 2, K.pessego)}
  ${pag(2, K.clara)}`));

add('c1-3', pg(K.salvia, `
  ${marca(K.off)}
  ${blob(-120, 150, 1000, 760, K.off, 4, { amp: .08 })}
  <div class="abs se" style="left:90px;top:300px;width:700px;font-size:120px;line-height:1">Salva pra <span class="it" style="color:${K.terra}">revisar</span></div>
  <div class="abs" style="left:90px;top:560px;width:560px;font-size:42px;font-weight:600;line-height:1.3">e manda pra quem vai fazer a OAB.</div>
  ${rec('joinha', { x: 500, corte: 1352, h: 640 })}
  ${pag(3)}`));

// ───────────── C2 lista (fundo musgo, número em blob e foto em círculo; interna em cápsulas) ─────────────
add('c2-1', pg(K.musgo, `
  ${marca(K.off)}
  ${blob(-90, 160, 700, 680, K.salvia, 6, { inner: `<div class="se" style="font-size:520px;color:${K.off};line-height:1;margin-top:-30px">4</div>` })}
  ${bola('pensando', { x: 560, y: 210, d: 450, z: 2.5, borda: 14, cor: K.pessego })}
  <div class="abs se" style="left:72px;top:870px;font-size:104px;width:960px;color:${K.off}">erros que derrubam a <span class="it" style="color:${K.pessego}">peça de Civil</span></div>
  <div class="abs pill" style="left:72px;top:1180px;background:${K.pessego};padding:10px 28px;font-size:30px">${esc(C.c2.sub)}</div>`));

add('c2-2', pg(K.off, `
  <div class="abs se" style="left:72px;top:80px;font-size:84px">Os 4 <span class="it" style="color:${K.terra}">erros</span></div>
  ${C.c2.itens.map((t, i) => `<div class="abs" style="left:56px;top:${230 + i * 230}px;width:968px;height:200px;border-radius:100px;background:${[K.clara, K.areia][i % 2]};display:flex;align-items:center;gap:36px;padding:0 60px 0 28px">
    <div style="width:144px;height:144px;border-radius:50%;background:${[K.salvia, K.pessego][i % 2]};display:flex;align-items:center;justify-content:center;flex:none"><span class="se" style="font-size:84px;color:${i % 2 ? K.musgo : K.off}">${i + 1}</span></div>
    <div style="font-size:40px;font-weight:700;line-height:1.2">${esc(t)}</div></div>`).join('')}
  <div class="abs pill" style="left:72px;top:1180px;background:${K.musgo};color:${K.off};padding:8px 24px;font-size:28px">${esc(C.c2.base)}</div>
  ${pag(2, K.clara)}`));

add('c2-3', pg(K.areia, `
  ${marca()}
  <div class="abs se" style="left:72px;top:180px;font-size:110px;width:940px">Qual desses você <span class="it" style="color:${K.terra}">já cometeu?</span></div>
  ${rec('empolgada', { x: 560, corte: 1352, h: 820 })}
  <div class="abs" style="left:56px;top:640px;width:600px;background:${K.off};border-radius:48px 48px 48px 12px;padding:36px 40px">
    <div style="display:flex;align-items:center;gap:14px">${mono(40)}<div style="font-size:28px;font-weight:800">você</div></div>
    <div style="font-size:38px;font-weight:600;margin-top:14px;line-height:1.25">Confesso: já esqueci o valor da causa...</div></div>
  <div class="abs pill" style="left:72px;top:960px;background:${K.musgo};color:${K.off};padding:16px 34px;font-size:36px">Conta nos comentários</div>
  ${pag(3)}`));

// ───────────── C3 questão (balão de pergunta e botões de enquete; resposta marcada) ─────────────
const botao = (txt, { marcado = false, errado = false, fade = false } = {}) => `<div style="flex:1;height:130px;border-radius:65px;background:${marcado ? K.terra : K.off};color:${marcado ? K.off : K.musgo};display:flex;align-items:center;justify-content:center;gap:20px;font-size:46px;font-weight:800;opacity:${fade ? .45 : 1};${marcado ? '' : `box-shadow:inset 0 0 0 4px ${K.musgo}22`}">
  ${errado ? no(64, K.off, K.terra) : ''}${txt}</div>`;
add('c3-1', pg(K.clara, `
  ${marca()}
  ${blob(600, 120, 520, 500, K.salvia, 9)}
  ${bola('surpresa', { x: 650, y: 170, d: 400, z: 2.6, ax: .62, borda: 14 })}
  <div class="abs pill" style="left:72px;top:200px;background:${K.pessego};padding:12px 30px;font-size:32px">certo ou errado?</div>
  <div class="abs" style="left:56px;top:560px;width:968px;background:${K.off};border-radius:56px 12px 56px 56px;padding:56px 56px 60px">
    <div class="se" style="font-size:88px">O filho fez 18 anos.</div>
    <div class="se it" style="font-size:72px;color:${K.terra};margin-top:10px">A pensão acaba automaticamente?</div></div>
  <div class="abs" style="left:56px;top:1040px;width:968px;display:flex;gap:28px">${botao('Certo')}${botao('Errado')}</div>
  ${rod()}`));

add('c3-2', pg(K.off, `
  <div class="abs" style="left:72px;top:70px;font-size:28px;font-weight:800;letter-spacing:.14em;color:${K.terra}">RESPOSTA</div>
  <div class="abs" style="left:56px;top:130px;width:968px;display:flex;gap:28px">${botao('Certo', { fade: true })}${botao('Errado', { marcado: true, errado: true })}</div>
  <div class="abs card" style="left:56px;top:320px;width:968px;background:${K.areia};padding:56px 56px 60px;overflow:hidden">
    ${blob(780, -90, 280, 260, K.pessego, 11)}
    <div class="se" style="font-size:72px;position:relative;width:820px">A maioridade não encerra a pensão <span class="it">sozinha.</span></div>
    <div style="font-size:38px;font-weight:600;line-height:1.35;margin-top:24px">A exoneração depende de decisão judicial, com contraditório.</div>
  </div>
  ${arco('pensando', { x: 72, y: 870, w: 330, h: 400, z: 3.0 })}
  <div class="abs" style="left:450px;top:940px;width:560px">
    <div style="font-size:28px;font-weight:800;letter-spacing:.12em;color:${K.terra}">BASE</div>
    <div class="se" style="font-size:76px;margin-top:6px">Súmula 358 <span class="it">do STJ</span></div></div>
  ${pag(2, K.clara)}`));

add('c3-3', pg(K.salvia, `
  ${marca(K.off)}
  <div class="abs se" style="left:72px;top:190px;font-size:170px;color:${K.musgo}">Acertou<span class="it" style="color:${K.off}">?</span></div>
  ${blob(560, 700, 620, 700, K.clara, 12)}
  ${rec('surpresa', { x: 520, corte: 1352, h: 860 })}
  <div class="abs card" style="left:56px;top:470px;width:620px;background:${K.off};padding:44px 48px;border-radius:56px 56px 56px 12px">
    <div style="font-size:42px;font-weight:700;line-height:1.3">Comenta <span class="se it" style="font-size:52px;color:${K.terra}">“acertei”</span> e marca quem precisa saber disso.</div></div>
  <div class="abs pill" style="left:72px;top:1000px;background:${K.musgo};color:${K.off};padding:16px 34px;font-size:34px">marca alguém aqui</div>
  ${pag(3)}`));

// ───────────── C4 mito ou verdade (arco com foto e dois blobs; interna em duas colunas) ─────────────
add('c4-1', pg(K.off, `
  ${marca()}
  <div class="abs se" style="left:72px;top:170px;font-size:124px;width:960px">Adoção: <span class="it" style="color:${K.terra}">mito ou verdade?</span></div>
  ${arco('empolgada', { x: 56, y: 520, w: 500, h: 760, z: 2.2 })}
  ${blob(560, 520, 470, 380, K.pessego, 13, { inner: `<div class="se it" style="font-size:96px">mito?</div>` })}
  ${blob(600, 850, 440, 380, K.salvia, 14, { inner: `<div class="se it" style="font-size:96px;color:${K.off}">verdade?</div>` })}`));

const coluna = (it, x, bg) => `<div class="abs card" style="left:${x}px;top:200px;width:470px;height:1010px;background:${bg};padding:46px 40px">
  ${it.v ? ok(110) : no(110)}
  <div class="se it" style="font-size:78px;margin-top:24px;color:${it.v ? K.musgo : K.terra}">${it.v ? 'Verdade' : 'Mito'}</div>
  <div class="se" style="font-size:62px;margin-top:20px;line-height:1.06">“${esc(it.frase)}”</div>
  <div style="font-size:36px;font-weight:600;line-height:1.38;margin-top:28px">${esc(it.txt)}</div>
  <div class="pill abs" style="left:40px;bottom:46px;background:${K.off};padding:8px 22px;font-size:28px">${esc(it.base)}</div></div>`;
add('c4-2', pg(K.areia, `
  <div class="abs se" style="left:72px;top:70px;font-size:76px">Adoção no <span class="it">ECA</span></div>
  ${coluna(C.c4.itens[0], 56, K.clara)}
  ${coluna(C.c4.itens[1], 554, K.off)}
  ${pag(2)}`));

add('c4-3', pg(K.musgo, `
  ${marca(K.off)}
  <div class="abs se" style="left:72px;top:180px;font-size:104px;width:940px;color:${K.off}">Quer mais mito ou verdade de <span class="it" style="color:${K.pessego}">ECA?</span></div>
  ${blob(40, 600, 560, 420, K.pessego, 15, { inner: `<div><div style="font-size:36px;font-weight:700">comenta</div><div class="se" style="font-size:150px;line-height:1">ECA</div></div>` })}
  ${rec('joinha', { x: 500, corte: 1352, h: 720 })}
  ${pag(3, K.clara)}`));

// ───────────── C5 apresentação (arco gigante com foto; blobs com os assuntos; recorte) ─────────────
add('c5-1', pg(K.salvia, `
  ${arco('empolgada', { x: 140, y: 70, w: 800, h: 840, z: 1.65, borda: 16 })}
  ${blob(790, 700, 260, 240, K.pessego, 16, { inner: `<div class="se it" style="font-size:44px;line-height:1">Civil<br>e ECA</div>` })}
  <div class="abs se" style="left:72px;top:965px;font-size:140px;color:${K.musgo};line-height:1">Prazer, <span class="it">Eduarda</span></div>
  <div class="abs" style="left:72px;top:1150px;width:920px;font-size:32px;font-weight:600;line-height:1.3">${esc(C.c5.sub)}</div>`));

const bl = [[56, 260, 480, 440, K.clara, 21], [544, 300, 480, 440, K.pessego, 22], [56, 740, 480, 440, K.areia, 23], [544, 780, 480, 440, K.salvia, 24]];
add('c5-2', pg(K.off, `
  <div class="abs se" style="left:72px;top:80px;font-size:84px">O que você <span class="it" style="color:${K.terra}">encontra aqui</span></div>
  ${C.c5.itens.map((t, i) => { const [x, y, w, h, c, s] = bl[i];
    return blob(x, y, w, h, c, s, { amp: .1, inner: `<div style="width:340px"><div class="se it" style="font-size:64px;color:${i === 3 ? K.off : K.terra};line-height:1">0${i + 1}</div><div class="se" style="font-size:52px;margin-top:10px;line-height:1.05">${esc(t)}</div></div>` }); }).join('')}
  ${pag(2, K.clara)}`));

add('c5-3', pg(K.areia, `
  ${marca()}
  <div class="abs se" style="left:72px;top:180px;font-size:118px;width:940px">Me segue pra estudar <span class="it" style="color:${K.terra}">Civil comigo</span></div>
  ${blob(480, 640, 640, 720, K.salvia, 25)}
  ${rec('joinha', { x: 460, corte: 1352, h: 760 })}
  <div class="abs pill" style="left:72px;top:760px;background:${K.off};padding:16px 32px;font-size:38px">${PERFIL.arroba}</div>
  <div class="abs pill" style="left:72px;top:870px;background:${K.musgo};color:${K.off};padding:14px 34px;font-size:34px">Seguir</div>
  ${pag(3)}`));

// ───────────── Posts únicos ─────────────
add('p1', pg(K.off, `
  ${marca()}
  ${blob(560, 760, 600, 560, K.clara, 31)}
  <div class="abs se" style="left:72px;top:250px;font-size:150px;width:940px;line-height:1">Peça boa não se decora.</div>
  ${blob(40, 760, 680, 360, K.pessego, 32, { amp: .08, inner: `<div class="se it" style="font-size:136px">Se entende.</div>` })}
  ${rod()}`));

add('p2', pg(K.clara, `
  ${marca()}
  <div class="abs se" style="left:72px;top:180px;font-size:124px;width:940px">Qual tema de Civil mais <span class="it" style="color:${K.terra}">te trava?</span></div>
  ${blob(520, 600, 640, 760, K.salvia, 33)}
  ${rec('surpresa', { x: 470, corte: 1352, h: 860 })}
  <div class="abs" style="left:56px;top:740px;width:600px;background:${K.off};border-radius:48px;padding:40px">
    <div style="font-size:40px;font-weight:800;line-height:1.2">Comenta aqui embaixo.</div>
    <div style="font-size:32px;font-weight:500;line-height:1.35;margin-top:10px">O mais pedido vira o próximo post.</div>
    <div style="margin-top:24px;border-radius:999px;background:${K.areia};padding:16px 26px;font-size:28px;font-weight:600;display:flex;justify-content:space-between"><span style="opacity:.65">Adicione um comentário</span><b style="color:${K.terra}">Publicar</b></div>
  </div>`));

add('p3', pg(K.areia, `
  ${marca()}
  <div class="abs pill" style="left:72px;top:160px;background:${K.off};padding:10px 26px;font-size:28px">dica de Sucessões</div>
  <div class="abs se" style="left:72px;top:240px;font-size:96px;width:940px">Ordem da vocação <span class="it" style="color:${K.terra}">hereditária</span></div>
  ${C.p3.itens.map((t, i) => `<div class="abs" style="left:${56 + i * 40}px;top:${480 + i * 180}px;width:${968 - i * 40}px;height:160px;border-radius:80px 40px 40px 80px;background:${[K.musgo, K.salvia, K.clara, K.off][i]};color:${i ? K.musgo : K.off};display:flex;align-items:center;gap:28px;padding:0 40px 0 14px">
    <div style="width:132px;height:132px;border-radius:50%;background:${[K.pessego, K.off, K.salvia, K.areia][i]};color:${K.musgo};display:flex;align-items:center;justify-content:center;flex:none"><span class="se" style="font-size:64px">${i + 1}º</span></div>
    <div style="font-size:${t.length > 50 ? 32 : 36}px;font-weight:700;line-height:1.22">${esc(t)}</div></div>`).join('')}
  <div class="abs pill" style="left:72px;top:1220px;background:${K.musgo};color:${K.off};padding:8px 24px;font-size:28px">${esc(C.p3.base)}</div>`));

// ───────────── Stories ─────────────
add('s1', pg(K.areia, `
  ${blob(180, 70, 720, 700, K.pessego, 41)}
  ${arco('surpresa', { x: 260, y: 130, w: 560, h: 720, z: 2.3, ax: .64 })}
  <div class="abs" style="left:110px;top:800px;width:860px;border-radius:56px;background:${K.off};overflow:hidden;box-shadow:0 24px 60px ${K.musgo}26">
    <div style="background:${K.salvia};padding:54px 56px 48px;text-align:center">
      <div class="se" style="font-size:80px;line-height:1.05;color:${K.musgo}">Me pergunta qualquer coisa sobre <span class="it" style="color:${K.off}">ECA</span></div></div>
    <div style="padding:40px 50px 46px"><div style="background:${K.clara};border-radius:30px;padding:30px;font-size:36px;font-weight:600;text-align:center;opacity:.8">Digite algo...</div></div>
  </div>
  <div class="abs" style="left:0;top:1520px;width:1080px;text-align:center;font-size:34px;font-weight:700">Respondo as melhores por aqui</div>
  ${marca(K.musgo, 330, 1760)}`), 1080, 1920);

add('s2', () => pg(K.salvia, `
  ${marca(K.off, 72, 80)}
  <div class="abs se" style="left:72px;top:200px;font-size:140px;width:940px;color:${K.musgo};line-height:.98">Post novo <span class="it" style="color:${K.off}">no feed</span></div>
  ${blob(80, 560, 920, 1060, K.clara, 42, { amp: .07 })}
  <div class="abs" style="left:200px;top:640px;width:680px;height:850px;border-radius:48px;background:url(${fs.existsSync(capaPng) ? durl(capaPng, 'image/png') : ''}) center/cover;box-shadow:0 30px 60px ${K.musgo}40"></div>
  <div class="abs pill" style="left:0;right:0;margin:auto;top:1660px;width:max-content;background:${K.off};padding:20px 40px;font-size:40px">${esc(C.s2.post)}</div>
  <div class="abs pill" style="left:0;right:0;margin:auto;top:1780px;width:max-content;background:${K.musgo};color:${K.off};padding:14px 34px;font-size:32px">toca pra ver</div>`), 1080, 1920);

// ───────────── Destaques ─────────────
const dc = [[K.salvia, K.off], [K.pessego, K.musgo], [K.musgo, K.off], [K.areia, K.musgo], [K.clara, K.musgo]];
add('destaques', pg(K.off, `
  <div class="abs se" style="left:72px;top:60px;font-size:64px">Capas dos <span class="it" style="color:${K.terra}">destaques</span></div>
  ${C.destaques.map((d, i) => { const [bg, c] = dc[i]; const x = [90, 410, 730, 250, 570][i], y = i < 3 ? 200 : 600;
    return `<div class="abs" style="left:${x}px;top:${y}px;width:260px;text-align:center">
    <div style="width:260px;height:260px;border-radius:50%;background:${bg};display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 8px ${K.off},0 0 0 11px ${K.areia}">
      <div class="se it" style="font-size:${d.length > 3 ? 66 : 82}px;color:${c};line-height:1">${d.toLowerCase()}</div></div>
    <div style="font-size:32px;font-weight:700;margin-top:24px">${d}</div></div>`; }).join('')}`), 1080, 1080);

add('avatar', pg(K.salvia, `
  ${blob(80, 70, 920, 940, K.pessego, 51, { amp: .06 })}
  <div class="abs ft" style="left:140px;top:140px;width:800px;height:800px;border-radius:50%;${fx('empolgada', 800, 800, 2.1, .5, .47)}"></div>`), 1080, 1080);

await render(ID, P, { fontes, css });

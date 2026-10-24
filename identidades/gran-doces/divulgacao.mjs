// Imagens de divulgação da venda de Brownie e Pudim no copo da Gran Doces (feed 1080×1350 e stories 1080×1920),
// na identidade dos adesivos quadrados (adesivos-a4.mjs): monograma GD, Fraunces + DM Sans, temas vermelho e
// verde (losango amarelo). Versões com e sem adesivo, mais vendáveis e mais clean, "Venda", "É amanhã!" e o
// brownie de faixa presidencial. Fotos e recortes em assets/venda/ (fora do git; recortes com rembg u2net).
// Uso: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node divulgacao.mjs [id]
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const root = path.dirname(new URL(import.meta.url).pathname);
const { chromium } = createRequire(path.join(root, '../../moldes/libero-comum/package.json'))('playwright');
const OUT = path.join(root, 'saida', 'divulgacao'), BUILD = path.join(root, 'build');
fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(BUILD, { recursive: true });
const F = n => 'file://' + path.join(root, 'assets/venda', n);

const C = { cacau: '#3B1F14', choco: '#55301F', creme: '#FFF4E2', laranja: '#E59A2F', vermelho: '#B5172E', vinho: '#7E0F20', verde: '#0B7A3E', verdeEsc: '#07502A', amarelo: '#FFCC29', ouro: '#F2C14E' };
const TEMAS = {
  vermelho: { bg: C.vermelho, txt: C.creme, d: C.ouro },
  verde: { bg: C.verde, txt: '#FFFFFF', d: C.verde, losango: C.amarelo, gTxt: '#0B3D22' },
  marrom: { bg: C.cacau, txt: C.creme, d: C.laranja },
};

// Adesivo quadrado (mesmo desenho do adesivos-a4.mjs), em px.
const adesivo = (nome, tema, px, extra = '') => {
  const t = TEMAS[tema], k = px / 227;
  return `<div style="width:${px}px;height:${px}px;border-radius:${22 * k}px;background:${t.bg};color:${t.txt};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${8 * k}px;text-align:center;overflow:hidden;flex:none;${extra}">
  ${t.losango ? `<div style="position:relative;display:grid;place-items:center;width:${150 * k}px;height:${92 * k}px"><svg viewBox="0 0 150 92" style="position:absolute;inset:0;width:100%;height:100%"><path d="M75 2 L148 46 L75 90 L2 46 Z" fill="${t.losango}"/></svg>
  <div style="position:relative;font-family:Fraunces;font-weight:800;font-size:${64 * k}px;letter-spacing:-.04em;line-height:1;color:${t.gTxt}">G<i style="font-weight:600;color:${t.d}">D</i></div></div>`
  : `<div style="font-family:Fraunces;font-weight:800;font-size:${76 * k}px;letter-spacing:-.04em;line-height:1">G<i style="font-weight:600;color:${t.d}">D</i></div>`}
  <div style="font-family:Fraunces;font-weight:800;font-size:${30 * k}px;line-height:1">${nome}</div>
  <div style="font-family:'DM Sans';font-weight:700;font-size:${10 * k}px;letter-spacing:.34em;margin-right:-.34em">GRAN DOCES</div></div>`;
};
// Adesivo solto no post (um pouco girado, com sombra de papel).
const selo = (nome, tema, px, pos, rot = -8) => `<div style="position:absolute;${pos};transform:rotate(${rot}deg);filter:drop-shadow(0 14px 22px rgba(0,0,0,.35));z-index:5">${adesivo(nome, tema, px)}</div>`;
// Adesivo colado no copo do pudim: luz e sombra do vidro por cima.
const noCopo = (tema, px, pos) => `<div style="position:absolute;${pos};z-index:4">${adesivo('Pudim', tema, px, 'border-radius:10px')}
  <div style="position:absolute;inset:0;border-radius:10px;background:linear-gradient(90deg,rgba(0,0,0,.28) 0%,rgba(0,0,0,0) 22%,rgba(255,255,255,.22) 42%,rgba(255,255,255,0) 56%,rgba(0,0,0,0) 78%,rgba(0,0,0,.3) 100%)"></div></div>`;

const GD = (px, cor = C.creme, d = C.laranja) => `<span style="font-family:Fraunces;font-weight:800;font-size:${px}px;letter-spacing:-.04em;line-height:1;color:${cor}">G<i style="font-weight:600;color:${d}">D</i></span>`;
const marca = (px, cor = C.creme, d = C.laranja, dir = 'column') => `<div style="display:flex;flex-direction:${dir};align-items:center;gap:${px * .3}px">${GD(px, cor, d)}<span style="font-family:'DM Sans';font-weight:700;font-size:${px * .24}px;letter-spacing:.4em;margin-right:-.4em;color:${cor}">GRAN DOCES</span></div>`;
const pill = (t, bg, cor, px = 30, extra = '') => `<span style="display:inline-block;background:${bg};color:${cor};font-family:'DM Sans';font-weight:700;font-size:${px}px;letter-spacing:.14em;padding:${px * .55}px ${px * 1.2}px;border-radius:999px;${extra}">${t}</span>`;
const grao = (op = .25) => `<div style="position:absolute;inset:0;background-image:url(${'file://' + path.join(root, '../../moldes/metodo-vde/assets/grao.png')});background-size:400px;opacity:${op};mix-blend-mode:overlay;pointer-events:none;z-index:1"></div>`;
const losango = (w, cor, pos, op = 1) => `<svg viewBox="0 0 150 92" style="position:absolute;${pos};width:${w}px;opacity:${op}"><path d="M75 2 L148 46 L75 90 L2 46 Z" fill="${cor}"/></svg>`;
const recorte = (n, pos, extra = '') => `<img src="${F(n)}" style="position:absolute;${pos};filter:drop-shadow(0 34px 40px rgba(0,0,0,.45));z-index:3;${extra}">`;
// Fita "VENDA" atravessando o canto.
const fita = (t, bg, cor, top = 70) => `<div style="position:absolute;right:-120px;top:${top}px;width:520px;transform:rotate(38deg);background:${bg};color:${cor};text-align:center;font-family:'DM Sans';font-weight:700;font-size:40px;letter-spacing:.3em;padding:16px 0;box-shadow:0 10px 24px rgba(0,0,0,.3);z-index:6">${t}</div>`;
const box = (w, h, bg, html) => `<div style="position:relative;width:${w}px;height:${h}px;overflow:hidden;background:${bg}">${html}</div>`;
const titulo = (a, b, px, cor, corB, extra = '') => `<div style="font-family:Fraunces;font-weight:800;font-size:${px}px;line-height:.9;letter-spacing:-.03em;color:${cor};${extra}">${a}${b ? `<br><i style="font-weight:600;color:${corB}">${b}</i>` : ''}</div>`;

const PECAS = {
  // ---------- Mais vendáveis ----------
  'venda-brownie-vermelho': [1080, 1350, box(1080, 1350, `radial-gradient(75% 55% at 50% 58%,#D02238 0%,${C.vermelho} 50%,${C.vinho} 100%)`, `${grao()}
    <div style="position:absolute;left:0;right:0;top:70px;display:flex;justify-content:center;z-index:2">${marca(64)}</div>
    ${fita('VENDA', C.ouro, C.vinho)}
    <div style="position:absolute;left:0;right:0;top:250px;text-align:center;z-index:2">${titulo('Brownie', '', 200, C.creme)}</div>
    ${recorte('recorte-brownie-pilha.png', 'left:110px;top:470px;width:860px')}
    ${selo('Brownie', 'vermelho', 250, 'right:70px;top:930px', 9)}
    <div style="position:absolute;left:0;right:0;bottom:70px;text-align:center;z-index:6">${pill('PEÇA PELO DIRECT', C.creme, C.vermelho)}</div>`)],

  'venda-pudim-verde': [1080, 1350, box(1080, 1350, `radial-gradient(75% 55% at 60% 55%,#0F9149 0%,${C.verde} 50%,${C.verdeEsc} 100%)`, `${grao()}
    ${losango(1100, C.amarelo, 'left:330px;top:300px', .95)}
    <div style="position:absolute;left:70px;top:80px;z-index:2">${marca(56, '#fff', C.amarelo, 'row')}</div>
    <div style="position:absolute;left:70px;top:230px;z-index:6">${pill('VENDA', C.amarelo, C.verdeEsc, 32)}
      ${titulo('Pudim', 'no copo', 136, '#fff', C.amarelo, 'margin-top:36px')}
      <div style="font-family:'DM Sans';font-weight:500;font-size:34px;line-height:1.4;color:#fff;margin-top:34px;max-width:330px">Cremoso, com calda de caramelo.</div></div>
    ${recorte('recorte-pudim-tampa.png', 'right:-20px;top:430px;height:780px')}
    ${noCopo('verde', 190, 'right:146px;top:800px')}
    <div style="position:absolute;left:70px;bottom:80px;z-index:6">${pill('PEÇA PELO DIRECT', '#fff', C.verde)}</div>`)],

  'venda-dupla-adesivos': [1080, 1350, box(1080, 1350, C.verde, `
    <div style="position:absolute;inset:0;background:${C.vermelho};clip-path:polygon(0 0,100% 0,100% 38%,0 72%)"></div>${grao()}
    <div style="position:absolute;left:0;right:0;top:66px;text-align:center;z-index:2">${pill('VENDA', C.amarelo, C.vinho, 34)}</div>
    <div style="position:absolute;left:0;right:0;top:170px;text-align:center;z-index:2">${titulo('Brownie <i style="font-weight:600;color:' + C.amarelo + '">&amp;</i> Pudim', '', 112, C.creme)}</div>
    ${recorte('recorte-brownie-pilha.png', 'left:30px;top:430px;width:620px')}
    ${selo('Brownie', 'vermelho', 200, 'left:420px;top:760px', -10)}
    ${recorte('recorte-pudim-tampa.png', 'right:60px;top:440px;height:760px')}
    ${noCopo('verde', 190, 'right:200px;top:780px')}
    <div style="position:absolute;left:0;right:0;bottom:60px;display:flex;justify-content:center;z-index:6">${marca(54, '#fff', C.amarelo, 'row')}</div>`)],

  'venda-dupla-sem-adesivo': [1080, 1350, box(1080, 1350, `radial-gradient(80% 60% at 50% 60%,${C.choco} 0%,${C.cacau} 70%)`, `${grao(.3)}
    <div style="position:absolute;inset:36px;border:2px solid rgba(229,154,47,.4);border-radius:36px;z-index:2"></div>
    <div style="position:absolute;left:0;right:0;top:90px;display:flex;justify-content:center;z-index:2">${marca(70)}</div>
    <div style="position:absolute;left:0;right:0;top:300px;text-align:center;z-index:2">${titulo('Tem venda', 'de doce!', 130, C.creme, C.laranja)}</div>
    ${recorte('recorte-brownie-cima.png', 'left:70px;top:620px;width:500px')}
    ${recorte('recorte-pudim-tampa.png', 'right:110px;top:600px;height:560px')}
    <div style="position:absolute;left:0;right:0;bottom:90px;text-align:center;font-family:'DM Sans';font-weight:700;font-size:34px;letter-spacing:.06em;color:${C.creme};z-index:4">Brownie <span style="color:${C.laranja}">•</span> Pudim no copo</div>`)],

  // ---------- É amanhã! ----------
  'amanha-brownie': [1080, 1350, box(1080, 1350, `radial-gradient(75% 55% at 50% 60%,#D02238 0%,${C.vermelho} 55%,${C.vinho} 100%)`, `${grao()}
    <div style="position:absolute;left:70px;top:80px;z-index:6">${marca(52, C.creme, C.ouro, 'row')}</div>
    <div style="position:absolute;right:70px;top:60px;width:300px;background:${C.creme};border-radius:26px;overflow:hidden;transform:rotate(6deg);box-shadow:0 20px 40px rgba(0,0,0,.35);z-index:6;text-align:center">
      <div style="background:${C.cacau};color:${C.creme};font-family:'DM Sans';font-weight:700;font-size:26px;letter-spacing:.3em;padding:16px 0">VENDA DE</div>
      <div style="font-family:Fraunces;font-weight:800;font-size:72px;color:${C.vermelho};padding:26px 0 30px;line-height:1">Brownie</div></div>
    <div style="position:absolute;left:70px;top:330px;z-index:2">${titulo('É amanhã!', '', 168, C.creme)}
      <div style="font-family:'DM Sans';font-weight:500;font-size:38px;color:${C.creme};margin-top:22px;opacity:.95">Brownie fresquinho, feito no dia.</div></div>
    ${recorte('recorte-brownie-pilha.png', 'left:120px;top:640px;width:840px')}
    <div style="position:absolute;left:0;right:0;bottom:70px;text-align:center;z-index:6">${pill('RESERVE O SEU PELO DIRECT', C.ouro, C.vinho, 28)}</div>`)],

  'amanha-pudim': [1080, 1350, box(1080, 1350, C.verde, `${grao()}
    ${losango(1500, C.amarelo, 'left:-210px;top:330px')}
    <div style="position:absolute;left:0;right:0;top:70px;text-align:center;z-index:2">${titulo('É amanhã!', '', 170, '#fff')}</div>
    <div style="position:absolute;left:0;right:0;top:260px;text-align:center;font-family:'DM Sans';font-weight:700;font-size:34px;letter-spacing:.2em;color:${C.amarelo};z-index:2">VENDA DE PUDIM NO COPO</div>
    ${recorte('recorte-pudim-tampa.png', 'left:50%;transform:translateX(-50%);top:370px;height:860px')}
    ${noCopo('verde', 220, 'left:430px;top:760px')}
    <div style="position:absolute;left:0;right:0;bottom:60px;display:flex;justify-content:center;z-index:6">${pill('RESERVE O SEU', C.verdeEsc, '#fff', 28)}</div>`)],

  'amanha-dupla': [1080, 1350, box(1080, 1350, C.creme, `
    <div style="position:absolute;left:0;right:0;bottom:0;height:560px;background:${C.cacau};border-radius:60px 60px 0 0"></div>${grao(.15)}
    <div style="position:absolute;left:0;right:0;top:80px;display:flex;justify-content:center;z-index:2">${marca(60, C.cacau, C.laranja, 'row')}</div>
    <div style="position:absolute;left:0;right:0;top:220px;text-align:center;z-index:2">${titulo('É amanhã!', '', 190, C.vermelho)}
      <div style="font-family:'DM Sans';font-weight:700;font-size:36px;letter-spacing:.06em;color:${C.cacau};margin-top:26px">Venda de Brownie <span style="color:${C.laranja}">•</span> Pudim no copo</div></div>
    ${recorte('recorte-brownie-pilha.png', 'left:40px;top:640px;width:600px')}
    ${recorte('recorte-pudim-tampa.png', 'right:90px;top:560px;height:700px')}
    ${selo('Brownie', 'vermelho', 190, 'left:450px;top:1010px', -8)}
    ${noCopo('verde', 170, 'right:205px;top:890px')}`)],

  'amanha-dupla-stories': [1080, 1920, box(1080, 1920, `radial-gradient(80% 50% at 50% 55%,${C.choco} 0%,${C.cacau} 75%)`, `${grao(.3)}
    <div style="position:absolute;left:0;right:0;top:180px;display:flex;justify-content:center;z-index:2">${marca(80)}</div>
    <div style="position:absolute;left:0;right:0;top:470px;text-align:center;z-index:2">${pill('VENDA', C.laranja, C.cacau, 34)}
      ${titulo('É amanhã!', '', 190, C.creme, '', 'margin-top:40px')}</div>
    ${recorte('recorte-brownie-pilha.png', 'left:30px;top:1000px;width:620px')}
    ${recorte('recorte-pudim-tampa.png', 'right:80px;top:920px;height:760px')}
    ${selo('Brownie', 'vermelho', 200, 'left:440px;top:1370px', -8)}
    ${noCopo('verde', 185, 'right:205px;top:1260px')}
    <div style="position:absolute;left:0;right:0;bottom:150px;text-align:center;z-index:6">${pill('RESERVE PELO DIRECT', C.creme, C.cacau, 32)}</div>`)],

  // ---------- Mais clean ----------
  'clean-brownie': [1080, 1350, box(1080, 1350, '#000', `
    <div style="position:absolute;inset:0;background:url(${F('brownie-cima.jpg')}) center 40%/cover"></div>
    <div style="position:absolute;left:0;right:0;bottom:0;height:520px;background:linear-gradient(180deg,rgba(59,31,20,0) 0%,rgba(59,31,20,.85) 70%)"></div>
    <div style="position:absolute;left:70px;bottom:80px;color:${C.creme}">
      <div style="font-family:'DM Sans';font-weight:700;font-size:26px;letter-spacing:.34em">GRAN DOCES</div>
      ${titulo('Brownie', '', 130, C.creme, '', 'margin-top:14px')}</div>
    ${selo('Brownie', 'vermelho', 200, 'right:70px;bottom:80px', 0)}`)],

  'clean-pudim': [1080, 1350, box(1080, 1350, C.creme, `${grao(.12)}
    <div style="position:absolute;left:210px;right:210px;top:110px;height:880px;border-radius:330px 330px 24px 24px;overflow:hidden;background:url(${F('pudim-colher.jpg')}) center 40%/cover"></div>
    <div style="position:absolute;left:0;right:0;top:1040px;text-align:center">${titulo('Pudim <i style="font-weight:600;color:' + C.laranja + '">no copo</i>', '', 92, C.cacau)}
      <div style="font-family:'DM Sans';font-weight:700;font-size:24px;letter-spacing:.4em;margin-right:-.4em;color:${C.cacau};margin-top:30px;opacity:.75">GRAN DOCES</div></div>`)],

  'clean-brownie-sem-adesivo': [1080, 1350, box(1080, 1350, C.creme, `${grao(.12)}
    <div style="position:absolute;left:0;right:0;top:0;height:820px;background:url(${F('brownie-pilha.jpg')}) center 55%/cover"></div>
    <div style="position:absolute;left:70px;right:70px;top:880px;display:flex;justify-content:space-between;align-items:flex-start">
      <div>${titulo('Brownie', '', 140, C.cacau)}
        <div style="font-family:'DM Sans';font-size:32px;line-height:1.45;color:${C.cacau};margin-top:22px;max-width:560px">Casquinha por cima, molhadinho por dentro.</div></div>
      ${GD(110, C.cacau, C.laranja)}</div>
    <div style="position:absolute;left:70px;bottom:70px;font-family:'DM Sans';font-weight:700;font-size:24px;letter-spacing:.34em;color:${C.vermelho}">VENDA · PEÇA PELO DIRECT</div>`)],

  'clean-dupla': [1080, 1350, box(1080, 1350, C.creme, `${grao(.12)}
    <div style="position:absolute;left:0;right:0;top:80px;display:flex;justify-content:center">${marca(60, C.cacau, C.laranja, 'row')}</div>
    <div style="position:absolute;left:60px;top:220px;width:470px;height:800px;border-radius:24px;overflow:hidden;background:url(${F('brownie-cima.jpg')}) center/cover"></div>
    <div style="position:absolute;right:60px;top:220px;width:470px;height:800px;border-radius:24px;overflow:hidden;background:url(${F('pudim-colher.jpg')}) center 35%/cover"></div>
    <div style="position:absolute;left:60px;width:470px;top:1060px;text-align:center;font-family:Fraunces;font-weight:800;font-size:58px;color:${C.cacau}">Brownie</div>
    <div style="position:absolute;right:60px;width:470px;top:1060px;text-align:center;font-family:Fraunces;font-weight:800;font-size:58px;color:${C.cacau}">Pudim <i style="font-weight:600;color:${C.laranja}">no copo</i></div>
    <div style="position:absolute;left:0;right:0;bottom:80px;text-align:center;font-family:'DM Sans';font-weight:700;font-size:24px;letter-spacing:.34em;color:${C.vermelho}">VENDA</div>`)],

  // ---------- Brownie de faixa presidencial ----------
  'brownie-presidente': [1080, 1350, box(1080, 1350, `radial-gradient(75% 55% at 50% 60%,#0F9149 0%,${C.verde} 55%,${C.verdeEsc} 100%)`, `${grao()}
    ${losango(1240, C.amarelo, 'left:-80px;top:470px')}
    ${Array.from({ length: 26 }, (_, i) => { const x = (i * 397) % 1080, y = (i * 211) % 420 + 20, c = [C.amarelo, '#fff', '#2E7BF6'][i % 3]; return `<span style="position:absolute;left:${x}px;top:${y}px;width:${14 + (i % 3) * 6}px;height:${8 + (i % 2) * 6}px;background:${c};transform:rotate(${i * 37}deg);border-radius:2px;opacity:.9;z-index:1"></span>`; }).join('')}
    <div style="position:absolute;left:0;right:0;top:80px;text-align:center;z-index:2">${pill('VENDA', C.amarelo, C.verdeEsc, 30)}
      ${titulo('Brownie', '', 170, '#fff', '', 'margin-top:30px')}
      <div style="font-family:Fraunces;font-style:italic;font-weight:600;font-size:96px;line-height:1;color:${C.amarelo}">Presidente</div></div>
    <div style="position:absolute;left:190px;top:560px;width:700px;height:746px;z-index:3">
      <img src="${F('recorte-brownie-cima.png')}" style="position:absolute;inset:0;width:100%;height:100%;filter:drop-shadow(0 34px 40px rgba(0,0,0,.45))">
      <div style="position:absolute;inset:0;-webkit-mask:url(${F('recorte-brownie-cima.png')}) center/100% 100% no-repeat">
        <div style="position:absolute;left:-120px;top:300px;width:1000px;height:150px;transform:rotate(38deg);background:linear-gradient(180deg,#0B7A3E 0 34%,#FFD52E 34% 66%,#0B7A3E 66% 100%);box-shadow:0 10px 18px rgba(0,0,0,.45),inset 0 6px 10px rgba(255,255,255,.25),inset 0 -8px 12px rgba(0,0,0,.3)"></div></div>
      <div style="position:absolute;left:330px;top:470px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FFF1B0,#E8B92C 55%,#A97C12);box-shadow:0 8px 16px rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center">
        <svg viewBox="0 0 24 24" width="66"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 20.9l1.6-7L2 9.2l7.1-.6z" fill="${C.verde}"/></svg></div></div>
    <div style="position:absolute;left:0;right:0;bottom:66px;text-align:center;z-index:6">${pill('ELEITO POR UNANIMIDADE', '#fff', C.verde, 28)}</div>`)],

  'brownie-presidente-adesivo': [1080, 1350, box(1080, 1350, C.creme, `${grao(.12)}
    ${losango(900, C.amarelo, 'left:90px;top:420px', .9)}
    <div style="position:absolute;left:70px;top:80px;z-index:2">${titulo('Brownie', 'Presidente', 150, C.verde, C.vermelho)}
      <div style="font-family:'DM Sans';font-weight:700;font-size:32px;letter-spacing:.06em;color:${C.cacau};margin-top:26px">Eleito por unanimidade aqui em casa.</div></div>
    <div style="position:absolute;left:230px;top:500px;width:640px;height:682px;z-index:3">
      <img src="${F('recorte-brownie-cima.png')}" style="position:absolute;inset:0;width:100%;height:100%;filter:drop-shadow(0 30px 36px rgba(0,0,0,.35))">
      <div style="position:absolute;inset:0;-webkit-mask:url(${F('recorte-brownie-cima.png')}) center/100% 100% no-repeat">
        <div style="position:absolute;left:-110px;top:270px;width:920px;height:136px;transform:rotate(38deg);background:linear-gradient(180deg,#0B7A3E 0 34%,#FFD52E 34% 66%,#0B7A3E 66% 100%);box-shadow:0 10px 18px rgba(0,0,0,.45),inset 0 6px 10px rgba(255,255,255,.25),inset 0 -8px 12px rgba(0,0,0,.3)"></div></div></div>
    ${selo('Brownie', 'verde', 230, 'right:60px;bottom:70px', 8)}
    <div style="position:absolute;left:70px;bottom:80px;z-index:6">${pill('VENDA', C.vermelho, C.creme, 30)}</div>`)],
};

const HEAD = `<meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600..900;1,9..144,600..900&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet"><style>*{margin:0;box-sizing:border-box}body{-webkit-font-smoothing:antialiased}</style>`;
const launch = { args: ['--allow-file-access-from-files'] };
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors', '--allow-file-access-from-files'] });
const b = await chromium.launch(launch);
const filtro = process.argv[2];
for (const [id, [w, h, html]] of Object.entries(PECAS)) {
  if (filtro && id !== filtro) continue;
  const arq = path.join(BUILD, `div-${id}.html`);
  fs.writeFileSync(arq, `<!doctype html><html><head>${HEAD}</head><body>${html}</body></html>`);
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto('file://' + arq);
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => (i.onload = i.onerror = r)))));
  await p.waitForTimeout(400);
  await p.screenshot({ path: path.join(OUT, `gran-doces-${id}.jpg`), type: 'jpeg', quality: 92 }); await p.close();
  console.log('✓', id);
}
await b.close();

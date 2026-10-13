// Linha de embalagens de Natal Gran Doces nos formatos de mercado (lata, casinha com chaminé, casinha com
// selo de cera, caixa redonda, caixa imantada, cinta de brownie, fita de cetim), em 3D com CSS e cena
// em fundo sálvia. Saída: saida/linha-natal/{cenas,artes}. Uso: CHROMIUM_PATH=... RENDER_PROXY=... node linha-natal.mjs
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const root = path.dirname(new URL(import.meta.url).pathname);
const { chromium } = createRequire(path.join(root, '../../moldes/treino-de-pecas/package.json'))('playwright');
const OUT = path.join(root, 'saida', 'linha-natal'), BUILD = path.join(root, 'build');
for (const d of ['cenas', 'artes']) fs.mkdirSync(path.join(OUT, d), { recursive: true });
const GAL = 'data:image/png;base64,' + fs.readFileSync(path.join(root, 'assets/galinha.png')).toString('base64');
const FOTO = n => 'file://' + path.join(root, 'assets/fotos', n + '.jpg');
const C = { azul: '#0A62E8', azulEsc: '#0B3A8E', noite: '#0B2B6E', creme: '#FCEEDF', vermelho: '#A8142A', vinho: '#6D0F1E', verde: '#1E4A3A', verdeEsc: '#16352B', cacau: '#3B2418', caramelo: '#B9762F', ninho: '#EEF3F8', salvia: '#8C9C8A' };
const OURO = 'linear-gradient(115deg,#9a7330 0%,#e9cd86 28%,#fff1c4 40%,#c9a35b 55%,#8c6526 78%,#d9b86e 100%)';
const RUIDO = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;
const HEAD = `<meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,400..900,100&family=DM+Sans:wght@400;500;700&family=Pinyon+Script&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0}body{font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased}.f{font-family:Fraunces,serif;font-variation-settings:'SOFT' 100}.s{font-family:'Pinyon Script',cursive}
.ouro{background:${OURO};-webkit-background-clip:text;color:transparent}.papel{position:absolute;inset:0;background-image:${RUIDO};opacity:.35;mix-blend-mode:overlay;pointer-events:none}
.face{position:absolute;overflow:hidden;backface-visibility:hidden}.cena3d{perspective:2600px}.box{position:relative;transform-style:preserve-3d}</style>`;
const gal = (cor, px, ex = '') => `<span style="display:block;width:${px * .876}px;height:${px}px;background:${cor};-webkit-mask:url(${GAL}) center/contain no-repeat;${ex}"></span>`;
const estrelas = (w, h, n, seed = 5, cor = '#e9cd86') => { let r = seed, o = ''; const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < n; i++) { const s = 2 + rnd() * 5; o += rnd() < .2 ? `<span style="position:absolute;left:${rnd() * w}px;top:${rnd() * h}px;font-size:${10 + rnd() * 14}px;line-height:1" class="ouro">✦</span>` : `<span style="position:absolute;left:${rnd() * w}px;top:${rnd() * h}px;width:${s}px;height:${s}px;border-radius:50%;background:${cor};opacity:${.6 + rnd() * .4}"></span>`; } return o; };
const sombraLuz = (dir = 90) => `<div style="position:absolute;inset:0;background:linear-gradient(${dir}deg,rgba(0,0,0,.28),rgba(255,255,255,.08) 35%,rgba(255,255,255,0) 55%,rgba(0,0,0,.32));pointer-events:none"></div>`;

// ---------- caixa 3D genérica (CSS) ----------
// f: {frente, tras, esq, dir, topo} (HTML de cada face); tel: altura do oitão (casinha) ou 0
function caixa3d(w, h, d, f, { rx = -13, ry = -34, tel = 0, telhado = '', beiral = 1.1 } = {}) {
  const pent = tel ? `clip-path:polygon(50% 0,100% ${tel / (h + tel) * 100}%,100% 100%,0 100%,0 ${tel / (h + tel) * 100}%)` : '';
  const fh = h + tel, s = Math.hypot(w / 2, tel), ang = Math.atan2(tel, w / 2) * 180 / Math.PI;
  let o = `<div class="box" style="width:${w}px;height:${h}px;transform:rotateX(${rx}deg) rotateY(${ry}deg)">
    <div class="face" style="width:${w}px;height:${fh}px;top:${-tel}px;transform:translateZ(${d / 2}px);${pent}">${f.frente}</div>
    <div class="face" style="width:${w}px;height:${fh}px;top:${-tel}px;transform:rotateY(180deg) translateZ(${d / 2}px);${pent}">${f.tras || f.frente}</div>
    <div class="face" style="width:${d}px;height:${h}px;left:${(w - d) / 2}px;transform:rotateY(90deg) translateZ(${w / 2}px)">${f.dir}<div style="position:absolute;inset:0;background:rgba(0,0,0,.26)"></div></div>
    <div class="face" style="width:${d}px;height:${h}px;left:${(w - d) / 2}px;transform:rotateY(-90deg) translateZ(${w / 2}px)">${f.esq || f.dir}</div>`;
  if (!tel) o += `<div class="face" style="width:${w}px;height:${d}px;top:${(h - d) / 2}px;transform:rotateX(90deg) translateZ(${h / 2}px)">${f.topo}<div style="position:absolute;inset:0;background:rgba(255,255,255,.1)"></div></div>`;
  else for (const lado of [1, -1]) o += `<div class="face" style="width:${s * beiral}px;height:${d * 1.08}px;left:${(w - s * beiral) / 2}px;top:${(h - d * 1.08) / 2}px;transform:translate3d(${lado * w / 4}px,${-h / 2 - tel / 2}px,0) rotateZ(${lado * ang}deg) rotateX(90deg)">${telhado}${lado > 0 ? '<div style="position:absolute;inset:0;background:rgba(0,0,0,.3)"></div>' : '<div style="position:absolute;inset:0;background:rgba(255,255,255,.06)"></div>'}</div>`;
  return o + '</div>';
}
// cilindro (lata, caixa redonda) em vista frontal levemente de cima
const cilindro = (w, h, arte, { tampa = '#c9a35b', aro = OURO, aroH = 14, base = true } = {}) => { const ry = w * .14;
  return `<div style="position:relative;width:${w}px;height:${h + ry * 2}px">
    <div style="position:absolute;left:0;top:${ry}px;width:${w}px;height:${h}px;border-radius:0 0 ${w / 2}px ${w / 2}px / 0 0 ${ry}px ${ry}px;overflow:hidden">${arte}<div class="papel"></div>${sombraLuz()}</div>
    ${base ? `<div style="position:absolute;left:-2%;width:104%;top:${h - ry + aroH * .5}px;height:${ry * 2}px;border-radius:50%;background:${aro};z-index:-1"></div>` : ''}
    <div style="position:absolute;left:0;top:0;width:${w}px;height:${ry * 2}px;border-radius:50%;background:${tampa}"></div>
    <div style="position:absolute;left:4%;top:${ry * .16}px;width:92%;height:${ry * 1.7}px;border-radius:50%;background:radial-gradient(ellipse at 40% 40%,rgba(255,255,255,.35),rgba(0,0,0,.15))"></div></div>`; };
const laco = (cor, px, { estampa = true } = {}) => `<svg viewBox="0 0 300 200" style="width:${px}px;filter:drop-shadow(0 10px 12px rgba(0,0,0,.35))">
  <defs><linearGradient id="lg${cor.slice(1)}" x1="0" x2="1"><stop offset="0" stop-color="${cor}"/><stop offset=".45" stop-color="#fff" stop-opacity=".25"/><stop offset=".55" stop-color="${cor}"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient></defs>
  <path d="M150 92 C 90 10, 20 30, 40 92 C 55 135, 110 120, 150 92Z" fill="${cor}"/><path d="M150 92 C 210 10, 280 30, 260 92 C 245 135, 190 120, 150 92Z" fill="${cor}"/>
  <path d="M150 92 C 90 10, 20 30, 40 92 C 55 135, 110 120, 150 92Z M150 92 C 210 10, 280 30, 260 92 C 245 135, 190 120, 150 92Z" fill="url(#lg${cor.slice(1)})" opacity=".55"/>
  <path d="M140 100 L 95 195 L 120 180 L 132 198 L 152 104Z" fill="${cor}"/><path d="M160 100 L 205 195 L 180 180 L 168 198 L 148 104Z" fill="${cor}"/><path d="M160 100 L 205 195 L 180 180 L 168 198 L 148 104Z" fill="#000" opacity=".15"/>
  <rect x="128" y="74" width="44" height="40" rx="12" fill="${cor}"/><rect x="128" y="74" width="44" height="40" rx="12" fill="#fff" opacity=".18"/>
  ${estampa ? `<text x="60" y="80" font-family="Pinyon Script" font-size="22" fill="#e9cd86" transform="rotate(-25 60 80)">Gran Doces</text>` : ''}</svg>`;

// ---------- artes (faces) ----------
const feliz = (px, cor = 'ouro') => `<div class="s ${cor === 'ouro' ? 'ouro' : ''}" style="font-size:${px}px;line-height:1;${cor !== 'ouro' ? `color:${cor}` : ''}">Feliz Natal</div>`;
const marcaOuro = (px, sub = '') => `<div style="display:flex;flex-direction:column;align-items:center"><div class="f ouro" style="font-weight:700;font-size:${px}px;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap">Gran Doces</div>${sub ? `<div class="ouro" style="font-weight:700;font-size:${px * .32}px;letter-spacing:.4em;margin-top:${px * .15}px">${sub}</div>` : ''}</div>`;
const xadrez = (bg, l1, l2) => `background:${bg};background-image:repeating-linear-gradient(90deg,transparent 0 46px,${l1} 46px 52px,transparent 52px 60px,${l2} 60px 62px,transparent 62px 120px),repeating-linear-gradient(0deg,transparent 0 46px,${l1} 46px 52px,transparent 52px 60px,${l2} 60px 62px,transparent 62px 120px)`;
const listras = (bg) => `background:${bg};background-image:repeating-linear-gradient(90deg,transparent 0 16px,#d9b86e 16px 24px)`;

// Lata 1: vermelha com presépio-silhueta substituído por estrela de Belém + galinha; Lata 2: verde com a fachada Gran Doces; Lata 3: verde lisa
const lataArte = (tipo, w, h) => {
  if (tipo === 'vermelha') return `<div style="position:absolute;inset:0;background:${C.vermelho}">${estrelas(w, h, 40, 3)}
    <div style="position:absolute;left:0;right:0;top:${h * .1}px;display:flex;flex-direction:column;align-items:center">${marcaOuro(w * .075)}<div style="margin-top:${h * .07}px">${feliz(w * .26)}</div></div>
    <div style="position:absolute;left:50%;bottom:${h * .07}px;transform:translateX(-50%);display:flex;align-items:flex-end;gap:${w * .03}px">
      <span class="ouro" style="font-size:${w * .1}px;line-height:1;position:relative;top:-${h * .22}px">✦</span>${gal('#e3c37a', h * .32)}</div></div>`;
  if (tipo === 'fachada') return `<div style="position:absolute;inset:0;background:${C.verdeEsc}">${estrelas(w, h * .5, 30, 7)}
    <div style="position:absolute;left:0;right:0;top:${h * .1}px;display:flex;justify-content:center">${feliz(w * .24)}</div>
    <div style="position:absolute;left:${w * .14}px;right:${w * .14}px;bottom:0;height:${h * .38}px">
      <div style="position:absolute;left:-4%;right:-4%;top:0;height:${h * .07}px;background:#fff;border-radius:${h * .03}px ${h * .03}px 4px 4px;box-shadow:0 4px 0 #ddd"></div>
      <div style="position:absolute;left:0;right:0;top:${h * .06}px;bottom:0;background:${C.vermelho}"></div>
      <div style="position:absolute;left:8%;right:8%;top:${h * .1}px;height:${h * .06}px;background:${C.vinho};display:flex;align-items:center;justify-content:center"><span class="f ouro" style="font-weight:700;font-size:${h * .04}px;letter-spacing:.08em">GRAN DOCES</span></div>
      <div style="position:absolute;left:8%;right:8%;bottom:0;height:${h * .17}px;display:flex;gap:6%">${[0, 1, 2].map(() => `<div style="flex:1;background:linear-gradient(#ffe7a8,#e6a94c);border:3px solid ${C.vinho}"></div>`).join('')}</div></div>
    <div style="position:absolute;right:${w * .06}px;bottom:${h * .3}px">${gal('#e3c37a', h * .15)}</div></div>`;
  return `<div style="position:absolute;inset:0;background:${C.verde}">${estrelas(w, h, 50, 11)}
    <div style="position:absolute;left:0;right:0;top:${h * .25}px;display:flex;flex-direction:column;align-items:center;gap:${h * .06}px">${feliz(w * .27)}${marcaOuro(w * .085)}</div></div>`;
};
const lata = (tipo, w = 300, h = 420, fita = C.vermelho) => `<div style="position:relative;width:${w}px">
  ${cilindro(w, h, lataArte(tipo, w, h), { tampa: OURO })}
  <div style="position:absolute;left:50%;top:-${w * .25}px;transform:translateX(-46%) rotate(-4deg)">${laco(fita, w * .78)}</div></div>`;

// Casinha mini (chaminé, telhado listrado, porta em arco): mini panetone
function casinhaMini(w = 300, h = 300, d = 260, tel = 150) {
  const frente = `<div style="position:absolute;inset:0;${xadrez(C.verde, 'rgba(217,184,110,.55)', 'rgba(168,20,42,.6)')}">${estrelas(w, h + tel, 26, 2)}
    <div style="position:absolute;left:0;right:0;top:${tel + h * .1}px;display:flex;justify-content:center">${feliz(w * .2)}</div>
    <div style="position:absolute;left:50%;bottom:0;transform:translateX(-50%);width:${w * .34}px;height:${h * .44}px;border-radius:${w * .17}px ${w * .17}px 0 0;background:${C.verdeEsc};border:5px solid #d9b86e;border-bottom:0"><span style="position:absolute;right:16%;top:50%;width:12px;height:12px;border-radius:50%;background:#d9b86e"></span></div>
    <div style="position:absolute;left:50%;top:${tel * .45}px;transform:translateX(-50%)">${gal('#e3c37a', tel * .45)}</div></div>`;
  const lado = `<div style="position:absolute;inset:0;${xadrez(C.verde, 'rgba(217,184,110,.55)', 'rgba(168,20,42,.6)')}">${estrelas(d, h, 18, 9)}
    <div style="position:absolute;left:30%;top:28%;width:40%;height:38%;border:5px solid #d9b86e;background:${C.verdeEsc};display:grid;grid-template-columns:1fr 1fr;gap:5px;padding:5px">${'<span style="background:linear-gradient(#ffe7a8,#e6a94c)"></span>'.repeat(4)}</div></div>`;
  const tel3 = `<div style="position:absolute;inset:0;${listras(C.verde)}"></div><div style="position:absolute;left:0;right:0;bottom:-12px;height:24px;background:radial-gradient(circle at 12px 0,transparent 12px,#d9b86e 13px) 0 0/24px 24px"></div>`;
  return `<div style="position:relative">${caixa3d(w, h, d, { frente, dir: lado }, { tel, telhado: tel3, ry: -30 })}
    <div style="position:absolute;left:${w * .62}px;top:${-tel * .92}px;width:${w * .14}px;height:${tel * .55}px;${listras(C.verde)};transform:skewY(-8deg);box-shadow:inset -10px 0 0 rgba(0,0,0,.25)"></div></div>`;
}
// Casinha grande com selo de cera (panetones e brownietone)
function casinhaSelo(cor, nome, linha, { w = 420, h = 470, d = 380, tel = 200 } = {}) {
  const frente = `<div style="position:absolute;inset:0;background:${cor}">${estrelas(w, h + tel, 60, nome.length)}
    <div style="position:absolute;left:50%;top:${tel * .42}px;transform:translateX(-50%);width:${tel * .62}px;height:${tel * .62}px;border-radius:47% 53% 50% 48%;background:radial-gradient(circle at 35% 30%,#fff1c4,#d9b86e 40%,#8c6526 90%);box-shadow:0 6px 10px rgba(0,0,0,.35),inset 0 0 0 7px rgba(140,101,38,.5);display:flex;align-items:center;justify-content:center"><span class="f" style="font-weight:900;font-size:${tel * .26}px;color:#8c6526;letter-spacing:-.04em">GD</span></div>
    <div style="position:absolute;left:${w * .1}px;right:${w * .1}px;top:${tel + h * .12}px;height:${h * .3}px;border:3px solid #d9b86e;outline:1.5px solid #d9b86e;outline-offset:6px;display:flex;flex-direction:column;align-items:center;justify-content:center">
      <div class="f ouro" style="font-weight:800;font-size:${w * .1}px;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap">${nome}</div><div class="ouro" style="font-weight:700;font-size:${w * .035}px;letter-spacing:.32em;margin-top:8px">${linha}</div></div>
    <div style="position:absolute;left:0;right:0;bottom:${h * .1}px;display:flex;justify-content:center;opacity:.9">${marcaOuro(w * .055, 'CONFEITARIA ARTESANAL')}</div></div>`;
  const lado = `<div style="position:absolute;inset:0;background:${cor}">${estrelas(d, h, 40, 4)}<div style="position:absolute;left:50%;top:40%;transform:translate(-50%,-50%)">${gal('rgba(233,205,134,.85)', h * .34)}</div></div>`;
  const tel3 = `<div style="position:absolute;inset:0;background:${cor}">${estrelas(300, 400, 30, 8)}</div>`;
  return caixa3d(w, h, d, { frente, dir: lado }, { tel, telhado: tel3, beiral: 1.0, ry: -28 });
}
// Caixa redonda (cesta / torta)
const caixaRedonda = (w = 620, h = 330) => `<div style="position:relative;width:${w}px">${cilindro(w, h, `<div style="position:absolute;inset:0;background:${C.vermelho}"></div>
  <div style="position:absolute;left:0;right:0;top:0;height:${h * .3}px;background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(0,0,0,.05));border-bottom:5px solid rgba(0,0,0,.28)"></div>
  <div style="position:absolute;left:0;right:0;top:${h * .55}px;display:flex;justify-content:center">${marcaOuro(w * .07)}</div>`, { tampa: '#b51f33', aro: '#7d1020', base: false })}</div>`;
// Caixa imantada verde-escura com fita
function caixaImantada(w = 560, h = 160, d = 520) {
  const fita = (dir = 'v') => `<div style="position:absolute;${dir === 'v' ? 'left:44%;width:12%;top:0;bottom:0' : 'top:44%;height:12%;left:0;right:0'};background:linear-gradient(${dir === 'v' ? 90 : 0}deg,#7d1020,${C.vermelho} 40%,#d23a4f 50%,${C.vermelho} 60%,#7d1020)"></div>`;
  const topo = `<div style="position:absolute;inset:0;background:${C.verdeEsc}"><div class="papel"></div>
    <div style="position:absolute;left:8%;top:62%;transform:rotate(0deg)">${marcaOuro(w * .065)}</div>${fita('v')}${fita('h')}</div>`;
  const frente = `<div style="position:absolute;inset:0;background:${C.verdeEsc}"><div class="papel"></div>${fita('v')}<div style="position:absolute;left:0;right:0;top:46%;height:2px;background:rgba(0,0,0,.4)"></div></div>`;
  const lado = `<div style="position:absolute;inset:0;background:${C.verdeEsc}">${fita('v')}</div>`;
  return `<div style="position:relative">${caixa3d(w, h, d, { topo, frente, dir: lado }, { rx: -32, ry: -24 })}
    <div style="position:absolute;left:${w * .2}px;top:${-d * .52}px">${laco(C.vermelho, w * .62)}</div></div>`;
}
// Brownie com cinta (sabor)
function brownieCinta(cinta, texto, sabor, cor = '#e9cd86') {
  const w = 320, h = 90, d = 320;
  const massa = `<div style="position:absolute;inset:0;background:#2b170d"><div style="position:absolute;inset:0;background:url(${FOTO('brownies')}) 40% 45%/420% auto;filter:brightness(.8)"></div></div>`;
  const faixa = (larg) => `<div style="position:absolute;left:${(1 - larg) * 50}%;width:${larg * 100}%;top:0;bottom:0;background:${cinta}"><div class="papel"></div></div>`;
  const topo = `<div style="position:absolute;inset:0">${massa}${faixa(.62)}
    <div style="position:absolute;left:19%;width:62%;top:0;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;transform:rotate(-90deg)">
      <div style="position:absolute;inset:6% 4%;border-top:3px dotted ${cor};border-bottom:3px dotted ${cor}"></div>
      <div class="f" style="font-weight:800;font-size:40px;color:${cor};letter-spacing:.04em">Gran Doces</div><div class="s" style="font-size:40px;color:${cor};line-height:1">${sabor}</div><div style="font-weight:700;font-size:12px;letter-spacing:.3em;color:${cor}">${texto}</div></div></div>`;
  const frente = `<div style="position:absolute;inset:0">${massa}${faixa(.62)}</div>`;
  const lado = `<div style="position:absolute;inset:0;background:#2b170d"><div style="position:absolute;inset:0;background:url(${FOTO('brownies')}) 60% 60%/600% auto;filter:brightness(.6)"></div></div>`;
  return caixa3d(w, h, d, { topo, frente, dir: lado }, { rx: -38, ry: -28 });
}
const fitaCetim = (cor, txtCor, w = 1000) => `<div style="width:${w}px;height:70px;background:linear-gradient(0deg,rgba(0,0,0,.25),rgba(255,255,255,.18) 45%,rgba(0,0,0,.1) 55%,rgba(0,0,0,.3)),${cor};display:flex;align-items:center;gap:40px;overflow:hidden;white-space:nowrap;border-top:2px dashed rgba(233,205,134,.6);border-bottom:2px dashed rgba(233,205,134,.6)">${Array.from({ length: 8 }, (_, i) => i % 2 ? `<span class="s" style="font-size:40px;color:${txtCor}">Feliz Natal</span>` : `<span class="f" style="font-weight:700;font-size:24px;letter-spacing:.18em;color:${txtCor}">GRAN DOCES</span>`).join('')}</div>`;

// ---------- cena (fundo sálvia, bokeh, pinheirinhos, mesa) ----------
const cena = (miolo, { titulo = '', w = 1080, h = 1350, extra = '' } = {}) => { let r = 9, bok = ''; const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 18; i++) bok += `<span style="position:absolute;left:${rnd() * w}px;top:${rnd() * h * .45}px;width:${30 + rnd() * 70}px;height:${30 + rnd() * 70}px;border-radius:50%;background:radial-gradient(circle,rgba(255,236,180,.9),rgba(255,236,180,0) 70%);filter:blur(${2 + rnd() * 4}px)"></span>`;
  const pinheiro = (x, s, op) => `<div style="position:absolute;left:${x}px;bottom:${h * .38}px;width:${s}px;height:${s * 1.9}px;background:linear-gradient(#5d7a62,#2f4a37);clip-path:polygon(50% 0,100% 100%,0 100%);filter:blur(7px);opacity:${op}"></div>`;
  return `<div style="position:relative;width:${w}px;height:${h}px;overflow:hidden;background:linear-gradient(180deg,#7f9180 0%,#93a492 58%,#a9b6a4 62%,#b8c3b2 100%)">
    ${pinheiro(-40, 260, .8)}${pinheiro(170, 200, .7)}${pinheiro(740, 240, .75)}${pinheiro(900, 300, .8)}
    <div style="position:absolute;left:60px;top:-70px;width:300px;height:300px;border-radius:50%;background:repeating-linear-gradient(80deg,#8e1424 0 26px,#b51f33 26px 52px);filter:blur(5px);opacity:.9"></div>
    <div style="position:absolute;right:120px;top:-120px;width:260px;height:260px;border-radius:50%;background:repeating-linear-gradient(80deg,#8e1424 0 26px,#b51f33 26px 52px);filter:blur(6px);opacity:.85"></div>
    ${bok}<div style="position:absolute;left:0;right:0;top:${h * .6}px;bottom:0;background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(0,0,0,.08))"></div>
    <div class="cena3d" style="position:absolute;inset:0;display:flex;align-items:flex-end;justify-content:center;padding-bottom:${h * .16}px"><div style="transform:scale(1.22);transform-origin:50% 100%">${miolo}</div></div>${extra}
    ${titulo ? `<div style="position:absolute;left:70px;top:70px;display:flex;flex-direction:column;gap:12px;align-items:flex-start">
      <div style="background:rgba(109,15,30,.88);color:#fff;font-weight:700;font-size:44px;letter-spacing:.04em;padding:12px 26px;border-radius:14px" class="f">${titulo.nome}</div>
      <div style="background:rgba(109,15,30,.75);color:#fff;font-weight:500;font-size:30px;letter-spacing:.24em;padding:8px 22px;border-radius:12px">${titulo.info}</div></div>` : ''}
    <div class="papel" style="opacity:.18"></div></div>`; };
const sombraChao = (w, x = 0) => `<div style="position:absolute;left:50%;bottom:-30px;transform:translateX(calc(-50% + ${x}px));width:${w}px;height:70px;border-radius:50%;background:radial-gradient(rgba(20,30,20,.45),rgba(20,30,20,0) 70%);filter:blur(6px);z-index:-1"></div>`;
const foto = (n, s, ex = '') => `<div style="width:${s}px;height:${s}px;border-radius:50%;overflow:hidden;border:6px solid #d9b86e;box-shadow:0 14px 30px rgba(0,0,0,.3);${ex}"><div style="width:100%;height:100%;background:url(${FOTO(n)}) center/cover"></div></div>`;
const insetFoto = (n) => `<div style="position:absolute;right:70px;top:60px">${foto(n, 300)}</div>`;

const CENAS = {
  'panetone-classico': cena(`<div style="position:relative">${casinhaSelo(C.vermelho, 'Clássico', 'PANETONE ARTESANAL')}${sombraChao(640, 60)}</div>`, { titulo: { nome: 'PANETONE CLÁSSICO', info: '500 G | R$ 00,00' }, extra: insetFoto('panetone') }),
  'panetone-gotas': cena(`<div style="position:relative">${casinhaSelo(C.verde, 'Gotas', 'GOTAS DE CHOCOLATE')}${sombraChao(640, 60)}</div>`, { titulo: { nome: 'PANETONE GOTAS', info: '500 G | R$ 00,00' }, extra: insetFoto('panetone') }),
  'brownietone': cena(`<div style="position:relative">${casinhaSelo(C.azulEsc, 'Brownietone', 'O FAVORITO DA CASA')}${sombraChao(640, 60)}</div>`, { titulo: { nome: 'BROWNIETONE', info: '1,2 KG | R$ 00,00' }, extra: insetFoto('brownietone') }),
  'mini-panetone': cena(`<div style="position:relative;margin-left:260px;transform:scale(1.35);transform-origin:50% 100%">${casinhaMini()}${sombraChao(460, 40)}</div>`, { titulo: { nome: 'MINI PANETONE', info: '150 G | R$ 00,00' }, extra: insetFoto('panetone') }),
  'kits-brownie': cena(`<div style="display:flex;gap:40px;transform:scale(.64);transform-origin:50% 100%;align-items:flex-end;margin-bottom:40px"><div style="position:relative;transform:translateY(-120px)">${brownieCinta(C.caramelo, 'KIT BROWNIE', 'Tradicional')}</div><div style="position:relative">${brownieCinta(C.ninho, 'KIT BROWNIE', 'Ninho', C.azul)}</div><div style="position:relative;transform:translateY(-120px)">${brownieCinta(C.cacau, 'KIT BROWNIE', 'Chocolate')}</div></div>`, { titulo: { nome: 'KITS DE BROWNIE', info: 'TRADICIONAL · NINHO · CHOCOLATE' } }),
  'torta-chocolate': cena(`<div style="position:relative">${caixaRedonda()}${sombraChao(700)}<div style="position:absolute;left:60%;top:-80px">${laco(C.verde, 300)}</div></div>`, { titulo: { nome: 'TORTA DE CHOCOLATE', info: '10 FATIAS | R$ 00,00' }, extra: insetFoto('fatia') }),
  'caixa-imantada': cena(`<div style="position:relative;margin-bottom:60px">${caixaImantada()}${sombraChao(780)}</div>`, { titulo: { nome: 'CAIXA PRESENTE', info: 'BROWNIES SORTIDOS | R$ 00,00' }, extra: insetFoto('brownies') }),
  'latas': cena(`<div style="display:flex;align-items:flex-end;gap:10px"><div style="position:relative">${lata('fachada', 290, 380, '#c9a35b')}${sombraChao(330)}</div><div style="position:relative;margin-bottom:0">${lata('vermelha', 270, 430)}${sombraChao(310)}</div><div style="position:relative">${lata('verde', 290, 380, C.verde)}${sombraChao(330)}</div></div>`, { titulo: { nome: 'LATAS DE NATAL', info: 'BISCOITOS · ESTRELAS · BOMBONS' } }),
};

// ---------- artes planas para a gráfica ----------
const ARTES = {
  'lata-vermelha-rotulo': [900, 420, `<div style="position:relative;width:900px;height:420px">${lataArte('vermelha', 900, 420)}</div>`],
  'lata-fachada-rotulo': [900, 420, `<div style="position:relative;width:900px;height:420px">${lataArte('fachada', 900, 420)}</div>`],
  'lata-verde-rotulo': [900, 420, `<div style="position:relative;width:900px;height:420px">${lataArte('verde', 900, 420)}</div>`],
  'cintas-brownie': [1200, 700, `<div style="width:1200px;height:700px;background:#eee;display:flex;flex-direction:column;gap:30px;padding:40px">${[[C.caramelo, 'Tradicional', '#e9cd86'], [C.ninho, 'Ninho', C.azul], [C.cacau, 'Chocolate', '#e9cd86']].map(([bg, s, c]) => `<div style="position:relative;height:190px;background:${bg};display:flex;align-items:center;justify-content:center;gap:40px;border-top:4px dotted ${c};border-bottom:4px dotted ${c};outline:1px dashed #999;outline-offset:6px">${gal(c, 120)}<div class="f" style="font-weight:800;font-size:64px;color:${c}">Gran Doces</div><div class="s" style="font-size:72px;color:${c}">${s}</div></div>`).join('')}</div>`],
  'fitas-cetim': [1080, 420, `<div style="width:1080px;height:420px;background:#f3efe8;display:flex;flex-direction:column;gap:40px;justify-content:center;padding:40px">${fitaCetim(C.vermelho, '#e9cd86')}${fitaCetim(C.verde, '#e9cd86')}${fitaCetim('#c9a35b', C.vinho)}</div>`],
};

const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors', '--allow-file-access-from-files'] });
const browser = await chromium.launch(launch), page = await browser.newPage();
const tirar = async (nome, html, w, h, dest) => { const arq = path.join(BUILD, 'ln-' + nome + '.html');
  fs.writeFileSync(arq, `<!doctype html><html><head>${HEAD}</head><body style="width:${w}px;height:${h}px">${html}</body></html>`);
  await page.setViewportSize({ width: w, height: h }); await page.goto('file://' + arq); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(500);
  await page.screenshot({ path: dest }); };
const so = process.argv.slice(2);
for (const [n, html] of Object.entries(CENAS)) if (!so.length || so.includes(n)) await tirar(n, html, 1080, 1350, path.join(OUT, 'cenas', n + '.png'));
for (const [n, [w, h, html]] of Object.entries(ARTES)) if (!so.length || so.includes(n)) await tirar(n, html, w, h, path.join(OUT, 'artes', n + '.png'));
// ---------- cardápio PDF (1080×1350 por página): cena + faixa com a descrição ----------
const DESC = {
  'panetone-classico': 'Massa de fermentação natural, macia e perfumada, com frutas cristalizadas e uvas-passas. Na casinha vermelha com selo de cera.',
  'panetone-gotas': 'A mesma massa artesanal, recheada com muitas gotas de chocolate meio amargo. Na casinha verde com selo de cera.',
  'brownietone': 'Brownie molhadinho em formato de panetone, recheado com brigadeiro cremoso e coberto de chocolate. O favorito da casa.',
  'mini-panetone': 'Versão individual na casinha com chaminé: clássico, gotas ou brownietone. Perfeito para lembrancinhas.',
  'kits-brownie': 'Brownies com cinta personalizada em três sabores: Tradicional, Ninho e Chocolate. Consulte valor por quantidade.',
  'torta-chocolate': 'Massa de cacau, recheio cremoso de brigadeiro e ganache, na caixa redonda vermelha com laço.',
  'caixa-imantada': 'Caixa imantada verde com fita de cetim e brownies sortidos: um presente pronto para entregar.',
  'latas': 'Latas de Natal para biscoitos amanteigados, estrelas de chocolate e bombons. Três estampas exclusivas.',
};
const ORDEM = ['panetone-classico', 'panetone-gotas', 'brownietone', 'mini-panetone', 'kits-brownie', 'torta-chocolate', 'caixa-imantada', 'latas'];
const capaPdf = cena(`<div style="display:flex;flex-direction:column;align-items:center;margin-bottom:-40px"><div style="transform:scale(.85);transform-origin:50% 100%">${casinhaSelo(C.vermelho, 'Natal 2026', 'CARDÁPIO DE PRESENTES')}</div></div>`, { extra: `<div style="position:absolute;left:0;right:0;top:120px;display:flex;flex-direction:column;align-items:center;gap:10px">${gal('#fff', 170)}<div class="f" style="font-weight:900;font-size:110px;color:#fff;letter-spacing:-.03em;text-shadow:0 6px 20px rgba(0,0,0,.25)">Gran Doces</div><div class="s" style="font-size:100px;color:#fff;line-height:1">Natal 2026</div></div>` });
const pag = n => `<div style="position:relative;width:1080px;height:1350px;overflow:hidden">${CENAS[n]}
  <div style="position:absolute;left:0;right:0;bottom:0;height:170px;background:#E8D5A6;display:flex;align-items:center;justify-content:center;text-align:center;padding:0 70px"><p style="font-size:32px;line-height:1.4;color:${C.vinho}">${DESC[n]}</p></div></div>`;
const contatoPdf = cena('', { extra: `<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:30px;color:#fff;text-align:center">${gal('#fff', 300)}<div class="f" style="font-weight:900;font-size:96px">Faça sua encomenda</div><div style="font-size:40px;line-height:1.7">WhatsApp (00) 00000-0000<br>@grandoces<br>Endereço da loja</div><div style="background:${C.vinho};padding:16px 36px;border-radius:999px;font-size:30px;font-weight:700;letter-spacing:.1em">PEDIDOS ATÉ 00/12</div></div>` });
const paginas = [capaPdf, ...ORDEM.map(pag), contatoPdf];
fs.mkdirSync(path.join(OUT, 'cardapio'), { recursive: true });
for (const [i, h] of paginas.entries()) await tirar('pg' + i, h, 1080, 1350, path.join(OUT, 'cardapio', String(i).padStart(2, '0') + '.png'));
await tirar('capa', capaPdf, 1080, 1350, path.join(OUT, 'cenas', '00-capa.png'));
await browser.close(); console.log('✓ linha de Natal');

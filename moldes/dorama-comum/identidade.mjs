// Identidade "Cristão Dorameiro" (@cristaodorameiro): cores, fontes e peças comuns aos moldes dorama-*.
// Noite (tinta ameixa com luzes de cidade), creme (papel hanji) e rosa (cerejeira); dourado só nas notas.
// Fraunces (títulos, itálico nos destaques) + Plus Jakarta Sans (texto) + Noto Serif KR (hangul decorativo).
import fs from 'node:fs';
import path from 'node:path';
const aqui = path.dirname(new URL(import.meta.url).pathname);

export const C = {
  noite: '#1C1530', ameixa: '#35224D', rosa: '#F3A6B8', rosaForte: '#E0517A', blush: '#FBE3E8',
  creme: '#FBF5EC', papel: '#F3E9DA', tinta: '#22182E', ouro: '#F0B94D', branco: '#FFFFFF', cinza: '#7A6F86',
};
export const HEAD = `<meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,700;0,9..144,900;1,9..144,500;1,9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Serif+KR:wght@500;700&family=Figtree:wght@700;800&display=swap" rel="stylesheet"><style>*{box-sizing:border-box;margin:0}body{font-family:'Plus Jakarta Sans',sans-serif;-webkit-font-smoothing:antialiased}</style>`;
export const SERIF = "font-family:'Fraunces',serif;font-optical-sizing:auto";
export const KR = "font-family:'Noto Serif KR',serif";
export const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);

// Fundos. Cada um diz a cor do título, do texto, do destaque e das linhas.
const grao = op => `url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.35 0 0 0 0 0.25 0 0 0 0 0.2 0 0 0 ${op} 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E&quot;)`;
export const FUNDOS = {
  noite: { bg: `${grao(.10)},radial-gradient(120% 70% at 85% 0%,${C.ameixa} 0%,${C.noite} 60%)`, tit: C.creme, txt: 'rgba(251,245,236,.86)', dest: C.rosa, kick: C.rosa, linha: 'rgba(251,245,236,.16)', card: 'rgba(255,255,255,.06)', cardBorda: 'rgba(255,255,255,.12)', escuro: true },
  creme: { bg: `${grao(.14)},${C.creme}`, tit: C.tinta, txt: '#4A3F57', dest: C.rosaForte, kick: C.rosaForte, linha: 'rgba(34,24,46,.12)', card: '#FFFFFF', cardBorda: 'rgba(34,24,46,.08)', escuro: false },
  rosa: { bg: `${grao(.12)},linear-gradient(160deg,${C.blush} 0%,#F6C9D3 100%)`, tit: C.tinta, txt: '#4A3346', dest: C.rosaForte, kick: C.rosaForte, linha: 'rgba(34,24,46,.14)', card: 'rgba(255,255,255,.72)', cardBorda: 'rgba(255,255,255,.9)', escuro: false },
};
export const fundo = nome => FUNDOS[nome] || FUNDOS.creme;

// Texto rico: *itálico* (serifa itálica na cor de destaque) e **negrito**.
export const rico = (s, f) => esc(s)
  .replace(/\*\*(.+?)\*\*/g, '<b style="font-weight:800">$1</b>')
  .replace(/\*(.+?)\*/g, `<em style="${SERIF};font-style:italic;font-weight:500;color:${f.dest}">$1</em>`)
  .replace(/\n/g, '<br>');

// Luzes desfocadas de cidade à noite (bokeh) e pétalas de cerejeira: decoração das telas escuras.
const rnd = s => () => (s = (s * 9301 + 49297) % 233280) / 233280;
export const bokeh = (w, h, semente = 7, n = 14, cores = [C.rosa, C.ouro, '#9C8CFF', C.creme]) => {
  const r = rnd(semente); let out = '';
  for (let i = 0; i < n; i++) {
    const d = 60 + r() * 220, x = r() * w, y = r() * h * .75, cor = cores[i % cores.length], op = .08 + r() * .16;
    out += `<span style="position:absolute;left:${x - d / 2}px;top:${y - d / 2}px;width:${d}px;height:${d}px;border-radius:50%;background:radial-gradient(circle,${cor} 0%,transparent 68%);opacity:${op}"></span>`;
  }
  return `<div style="position:absolute;inset:0;pointer-events:none;overflow:hidden">${out}</div>`;
};
export const petala = (x, y, px, rot = 0, cor = C.rosa, op = .9) => `<span style="position:absolute;left:${x}px;top:${y}px;width:${px}px;height:${px * .78}px;background:${cor};opacity:${op};border-radius:80% 0 80% 0;transform:rotate(${rot}deg)"></span>`;
export const petalas = (pos, cor = C.rosa) => pos.map(([x, y, p, r, o]) => petala(x, y, p, r, cor, o ?? .85)).join('');

// Marca: cruz dentro de uma tela arredondada (TV / play), e o logotipo "cristão dorameiro".
export const marca = (px, bg = C.rosaForte, fg = C.creme) => `<span style="position:relative;display:inline-block;width:${px}px;height:${px * .82}px;border-radius:${px * .22}px;background:${bg};flex:none">
  <span style="position:absolute;left:50%;top:18%;width:${px * .11}px;height:64%;background:${fg};border-radius:${px * .05}px;transform:translateX(-50%)"></span>
  <span style="position:absolute;top:36%;left:50%;width:${px * .42}px;height:${px * .11}px;background:${fg};border-radius:${px * .05}px;transform:translateX(-50%)"></span></span>`;
export const logo = (px, { cor = C.creme, dest = C.rosa, marcaBg = C.rosaForte, marcaFg = C.creme } = {}) => `<div style="display:inline-flex;align-items:center;gap:${px * .32}px">${marca(px * 1.15, marcaBg, marcaFg)}
  <div style="line-height:.92;color:${cor}"><div style="${SERIF};font-style:italic;font-weight:500;font-size:${px * .62}px;color:${dest}">cristão</div><div style="font-weight:800;font-size:${px * .5}px;letter-spacing:.16em">DORAMEIRO</div></div></div>`;
export const arroba = (f, px = 24) => `<span style="font-weight:700;font-size:${px}px;letter-spacing:.08em;color:${f.tit};opacity:.7">@cristaodorameiro</span>`;

// Etiqueta de episódio ("EP. 02") e etiqueta de seção (kicker).
export const ep = (n, total, f, px = 24) => `<span style="display:inline-flex;align-items:center;gap:10px;font-weight:800;font-size:${px}px;letter-spacing:.16em;color:${f.tit}"><span style="width:12px;height:12px;border-radius:50%;background:${f.dest}"></span>EP. ${String(n).padStart(2, '0')}<span style="opacity:.4;font-weight:600">/ ${String(total).padStart(2, '0')}</span></span>`;
export const kicker = (txt, f, px = 26) => txt ? `<div style="display:inline-flex;align-items:center;gap:14px;font-weight:800;font-size:${px}px;letter-spacing:.2em;text-transform:uppercase;color:${f.kick}"><span style="width:${px * 1.6}px;height:3px;background:${f.kick}"></span>${esc(txt)}</div>` : '';
export const hangul = (txt, px, cor, extra = '') => txt ? `<span style="${KR};font-weight:500;font-size:${px}px;color:${cor};${extra}">${esc(txt)}</span>` : '';

// Notas: estrelas (0–5, aceita meia) e barras (0–10).
export const estrelas = (nota, px, cor = C.ouro, vazio = 'rgba(240,185,77,.25)') => {
  let s = '';
  for (let i = 1; i <= 5; i++) {
    const p = Math.max(0, Math.min(1, nota - (i - 1))) * 100;
    s += `<span style="position:relative;display:inline-block;font-size:${px}px;line-height:1;color:${vazio}">★<span style="position:absolute;left:0;top:0;width:${p}%;overflow:hidden;color:${cor}">★</span></span>`;
  }
  return `<span style="display:inline-flex;gap:${px * .08}px">${s}</span>`;
};
export const barra = (rotulo, nota, f, px = 32) => `<div><div style="display:flex;justify-content:space-between;align-items:baseline;font-weight:700;font-size:${px}px;color:${f.tit}"><span>${esc(rotulo)}</span><span style="${SERIF};font-weight:700;font-size:${px * 1.15}px">${String(nota).replace('.', ',')}</span></div>
  <div style="margin-top:${px * .35}px;height:${px * .42}px;border-radius:99px;background:${f.linha}"><div style="width:${nota * 10}%;height:100%;border-radius:99px;background:linear-gradient(90deg,${C.rosaForte},${C.ouro})"></div></div></div>`;

// Fotos (fora do git) ficam em moldes/dorama-comum/fotos/. Sem a foto, o cartaz é tipográfico.
export const foto = nome => {
  if (!nome) return null;
  const p = path.join(aqui, 'fotos', nome);
  if (fs.existsSync(p)) return 'file://' + p;
  console.log('  ! foto não encontrada:', nome, '(cartaz tipográfico no lugar)');
  return null;
};
// Paletas dos cartazes tipográficos.
export const CENAS = {
  noite: ['#2B1E4A', '#0F0B1E', C.rosa], cerejeira: ['#F6B9C8', '#B9466E', '#FFF'], por: ['#F7A66B', '#7A2E5C', '#FFE9C7'],
  mar: ['#6FB7C9', '#1D3B63', '#E8F7FA'], neve: ['#DDE6F2', '#6E7FA6', '#FFFFFF'], verde: ['#9FCB98', '#2E5643', '#F3FBEF'], vinho: ['#B44A63', '#3A0E22', '#FFD8E1'],
};
export const cena = (nome, w, h, semente = 3) => {
  const [a, b] = CENAS[nome] || CENAS.noite;
  return `<div style="position:absolute;inset:0;background:${grao(.12)},linear-gradient(165deg,${a} 0%,${b} 100%)"></div>${bokeh(w, h, semente, 12, ['#FFFFFF', C.ouro, C.rosa])}`;
};
// Cartaz do dorama (w×h): foto, ou fundo da cena com o título em serifa e o título em hangul.
export const cartaz = (d, w, h, { raio = 28, sombra = true } = {}) => {
  const src = foto(d.foto), [, , luz] = CENAS[d.cena] || CENAS.noite;
  const pal = Math.max(5, ...String(d.titulo || '').split(/\s+/).map(p => p.length)), t = Math.min(w * .16, w * .82 / (pal * .56));
  return `<div style="position:relative;width:${w}px;height:${h}px;border-radius:${raio}px;overflow:hidden;flex:none;${sombra ? 'box-shadow:0 30px 70px rgba(20,10,30,.35);' : ''}">
    ${src ? `<img src="${src}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${d.fotoPos || 'center'}">` : `${cena(d.cena, w, h, (d.titulo || '').length + 3)}
    <div style="position:absolute;left:${w * .09}px;right:${w * .09}px;top:${h * .09}px">${hangul(d.hangul, w * .075, luz, 'opacity:.85;letter-spacing:.08em')}</div>
    <div style="position:absolute;left:${w * .09}px;right:${w * .09}px;bottom:${h * .09}px;color:${luz}">
      <div style="${SERIF};font-weight:900;font-size:${t}px;line-height:.98;letter-spacing:-.01em">${esc(d.titulo)}</div>
      ${d.ano || d.eps ? `<div style="margin-top:${w * .04}px;font-weight:700;font-size:${w * .045}px;letter-spacing:.18em;opacity:.8">${[d.ano, d.eps && d.eps + ' EPS'].filter(Boolean).join(' · ')}</div>` : ''}</div>`}
  </div>`;
};

// Legenda de cena (estilo legenda de dorama: letra branca com contorno escuro) para memes.
export const legenda = (txt, px, cor = '#FFFFFF') => `<div style="font-weight:800;font-size:${px}px;line-height:1.2;color:${cor};text-align:center;-webkit-text-stroke:${px * .09}px #0d0812;paint-order:stroke fill;text-shadow:0 3px 12px rgba(0,0,0,.5)">${esc(txt).replace(/\n/g, '<br>')}</div>`;
export const chip = (txt, f, px = 26) => `<span style="display:inline-block;padding:${px * .45}px ${px * .8}px;border-radius:${px * .4}px;background:${f.card};border:2px solid ${f.cardBorda};font-weight:700;font-size:${px}px;color:${f.tit}">${esc(txt)}</span>`;

// Quadro de cena (meme): foto ou cena tipográfica, legenda embaixo e reação opcional.
export const quadro = (s, w, h) => {
  const src = foto(s.foto);
  return `<div style="position:relative;width:${w}px;height:${h}px;border-radius:30px;overflow:hidden;box-shadow:0 26px 60px rgba(20,10,30,.3)">
    ${src ? `<img src="${src}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${s.fotoPos || 'center'}">` : `${cena(s.cena || 'noite', w, h, 11)}${s.emoji ? `<div style="position:absolute;left:0;right:0;top:${h * .2}px;text-align:center;font-size:${h * .3}px;line-height:1">${s.emoji}</div>` : ''}`}
    <div style="position:absolute;inset:auto 0 0 0;height:45%;background:linear-gradient(transparent,rgba(10,6,16,.55))"></div>
    <div style="position:absolute;left:40px;right:40px;bottom:${s.legendaKr ? 74 : 44}px">${legenda(s.legenda || '', s.legendaTam || 46)}</div>
    ${s.legendaKr ? `<div style="position:absolute;left:40px;right:40px;bottom:30px;text-align:center">${hangul(s.legendaKr, 26, 'rgba(255,255,255,.85)')}</div>` : ''}
    ${s.episodio ? `<div style="position:absolute;left:26px;top:24px;padding:8px 16px;border-radius:10px;background:rgba(10,6,16,.55);font-weight:800;font-size:22px;letter-spacing:.14em;color:#fff">${esc(s.episodio)}</div>` : ''}</div>`;
};


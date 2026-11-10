// Identidade "Cristão Dorameiro" (@cristaodorameiro): cores, fontes e peças comuns aos moldes dorama-*.
// Noite (tinta ameixa com luzes de cidade), creme (papel hanji) e rosa (cerejeira); dourado só nas notas.
// Fraunces (títulos, itálico nos destaques) + Plus Jakarta Sans (texto) + Noto Serif KR (hangul decorativo).
import fs from 'node:fs';
import path from 'node:path';
const aqui = path.dirname(new URL(import.meta.url).pathname);

// Cores do perfil (as do Canva do @cristaodorameiro): turquesa, laranja, branco e preto, com o vermelho e o
// azul da bandeira da Coreia como detalhe. Os nomes antigos (noite, rosa…) continuam valendo para os moldes.
export const C = {
  turquesa: '#00CBAD', turqEsc: '#00A58C', laranja: '#FFA34E', vermelho: '#CD2E3A', azul: '#0047A0',
  noite: '#0E2A27', ameixa: '#14453F', rosa: '#FFA34E', rosaForte: '#00B39A', blush: '#E3F8F4',
  creme: '#FFFFFF', papel: '#F4F7F6', tinta: '#12201E', ouro: '#FFA34E', branco: '#FFFFFF', cinza: '#6B7A78',
};
export const HEAD = `<meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,700;0,9..144,900;1,9..144,500;1,9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Serif+KR:wght@500;700&family=Figtree:wght@700;800&family=Lilita+One&family=Audiowide&display=swap" rel="stylesheet"><style>*{box-sizing:border-box;margin:0}body{font-family:'Plus Jakarta Sans',sans-serif;-webkit-font-smoothing:antialiased}</style>`;
export const SERIF = "font-family:'Fraunces',serif;font-optical-sizing:auto";
export const KR = "font-family:'Noto Serif KR',serif";
export const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);

// Fundos. Cada um diz a cor do título, do texto, do destaque e das linhas.
const grao = op => `url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.35 0 0 0 0 0.25 0 0 0 0 0.2 0 0 0 ${op} 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E&quot;)`;
export const FUNDOS = {
  // Turquesa do perfil (capas e fechamento): título branco com sombra, destaque laranja com contorno.
  turquesa: { bg: `${grao(.10)},radial-gradient(120% 80% at 80% 0%,#2FE0C6 0%,${C.turquesa} 55%,#00B59A 100%)`, tit: '#FFFFFF', txt: C.noite, dest: C.laranja, kick: C.noite, linha: 'rgba(14,42,39,.18)', card: 'rgba(255,255,255,.9)', cardBorda: 'rgba(255,255,255,1)', escuro: false, sombra: '0 5px 0 rgba(0,90,78,.35)', contorno: C.noite },
  // Escuro (verde-petróleo quase preto): versículos e capas com foto.
  noite: { bg: `${grao(.10)},radial-gradient(120% 70% at 85% 0%,${C.ameixa} 0%,${C.noite} 60%)`, tit: '#FFFFFF', txt: 'rgba(255,255,255,.86)', dest: C.laranja, kick: C.turquesa, linha: 'rgba(255,255,255,.16)', card: 'rgba(255,255,255,.06)', cardBorda: 'rgba(255,255,255,.12)', escuro: true },
  // Branco (conteúdo): preto e turquesa.
  creme: { bg: `${grao(.10)},${C.branco}`, tit: C.tinta, txt: '#3B4A48', dest: C.turqEsc, kick: C.turqEsc, linha: 'rgba(18,32,30,.10)', card: C.papel, cardBorda: 'rgba(18,32,30,.06)', escuro: false },
  // Menta clarinho (conteúdo alternado).
  rosa: { bg: `${grao(.10)},linear-gradient(160deg,#EFFCF9 0%,${C.blush} 100%)`, tit: C.tinta, txt: '#33504B', dest: C.turqEsc, kick: C.turqEsc, linha: 'rgba(18,32,30,.12)', card: 'rgba(255,255,255,.85)', cardBorda: '#FFFFFF', escuro: false },
  // Pêssego (destaques: memes, listas).
  laranja: { bg: `${grao(.10)},linear-gradient(160deg,#FFF6EC 0%,#FFE7CF 100%)`, tit: C.tinta, txt: '#5A4632', dest: '#E07B1F', kick: '#E07B1F', linha: 'rgba(18,32,30,.12)', card: 'rgba(255,255,255,.85)', cardBorda: '#FFFFFF', escuro: false },
};
FUNDOS.branco = FUNDOS.creme; FUNDOS.menta = FUNDOS.rosa; FUNDOS.escuro = FUNDOS.noite;
export const fundo = nome => FUNDOS[nome] || FUNDOS.creme;

// Texto rico: *itálico* (serifa itálica na cor de destaque) e **negrito**.
export const rico = (s, f) => esc(s)
  .replace(/\*\*(.+?)\*\*/g, '<b style="font-weight:800">$1</b>')
  .replace(/\*(.+?)\*/g, `<em style="${SERIF};font-style:italic;font-weight:600;color:${f.dest};${f.contorno ? `-webkit-text-stroke:.07em ${f.contorno};paint-order:stroke fill;` : ''}">$1</em>`)
  .replace(/\n/g, '<br>');

// Luzes desfocadas de cidade à noite (bokeh) e pétalas de cerejeira: decoração das telas escuras.
const rnd = s => () => (s = (s * 9301 + 49297) % 233280) / 233280;
export const bokeh = (w, h, semente = 7, n = 14, cores = [C.turquesa, C.laranja, '#7FE9DA', '#FFFFFF']) => {
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
// Desenhos da bandeira da Coreia (SVG, quadro de -500 a 500): o taegeuk e os trigramas.
// Taegeuk (o círculo vermelho e azul da bandeira), inclinado como lá. r = raio, em coordenadas do SVG.
export const taegeuk = (r, rot = -33) => `<g transform="rotate(${rot})"><circle r="${r}" fill="${C.azul}"/><path d="M ${-r} 0 A ${r} ${r} 0 0 1 ${r} 0 A ${r / 2} ${r / 2} 0 0 1 0 0 A ${r / 2} ${r / 2} 0 0 0 ${-r} 0 Z" fill="${C.vermelho}"/></g>`;
// Trigrama (3 linhas, inteiras ou partidas) como na bandeira: linhas = [1,0,1] (1 inteira, 0 partida).
export const trigrama = (linhas, w, e, g, cor) => linhas.map((l, i) => { const y = i * (e + g);
  return l ? `<rect x="${-w / 2}" y="${y}" width="${w}" height="${e}" rx="${e * .2}" fill="${cor}"/>` : `<rect x="${-w / 2}" y="${y}" width="${w * .45}" height="${e}" rx="${e * .2}" fill="${cor}"/><rect x="${w * .05}" y="${y}" width="${w * .45}" height="${e}" rx="${e * .2}" fill="${cor}"/>`; }).join('');
// Marca do perfil (proposta B do molde dorama-logo): os quatro trigramas formam uma cruz em volta do taegeuk.
export const cruzTrigramas = (cor = C.noite) => `<g transform="translate(0,-400)">${trigrama([1, 1, 1], 230, 50, 26, cor)}</g><g transform="translate(0,198)">${trigrama([0, 0, 0], 230, 50, 26, cor)}</g>
    <g transform="translate(-198,0) rotate(90)">${trigrama([1, 0, 1], 230, 50, 26, cor)}</g><g transform="translate(400,0) rotate(90)">${trigrama([0, 1, 0], 230, 50, 26, cor)}</g>${taegeuk(125)}<circle r="125" fill="none" stroke="#FFFFFF" stroke-width="18"/>`;
export const marca = (px, cor = C.noite) => `<svg viewBox="-500 -500 1000 1000" width="${px}" height="${px}" style="display:block;flex:none;overflow:visible">${cruzTrigramas(cor)}</svg>`;
export const logo = (px, { cor = C.creme, dest = C.rosa, marcaBg = C.rosaForte, marcaFg = C.creme } = {}) => `<div style="display:inline-flex;align-items:center;gap:${px * .3}px">${marca(px * 1.25, /^#(fff|FFF)/.test(cor) || cor === C.creme ? '#FFFFFF' : C.noite)}
  <div style="line-height:.95"><div style="font-family:'Lilita One',sans-serif;font-size:${px * .62}px;letter-spacing:.04em;color:${C.laranja};-webkit-text-stroke:${px * .05}px ${C.noite};paint-order:stroke fill">CRISTÃO</div><div style="font-family:Audiowide,sans-serif;font-size:${px * .44}px;letter-spacing:.08em;color:${cor};text-shadow:${px * .035}px ${px * .035}px 0 ${C.vermelho},-${px * .025}px -${px * .02}px 0 ${C.azul}">DORAMEIRO</div></div></div>`;
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
  noite: ['#14453F', '#071917', C.laranja], turquesa: ['#2FE0C6', '#008F7A', '#FFFFFF'], cerejeira: ['#F6B9C8', '#B9466E', '#FFF'], por: ['#F7A66B', '#7A2E5C', '#FFE9C7'],
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
export const chip = (txt, f, px = 26) => `<span style="display:inline-block;padding:${px * .45}px ${px * .8}px;border-radius:${px * .4}px;background:${f.card};border:2px solid ${f.cardBorda};font-weight:700;font-size:${px}px;color:${f.escuro ? f.tit : C.tinta}">${esc(txt)}</span>`;

// Quadro de cena (meme): foto ou cena tipográfica, legenda embaixo e reação opcional.
export const quadro = (s, w, h) => {
  const src = foto(s.foto);
  return `<div style="position:relative;width:${w}px;height:${h}px;border-radius:30px;overflow:hidden;box-shadow:0 26px 60px rgba(20,10,30,.3)">
    ${src ? `<img src="${src}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${s.fotoPos || 'center'}">` : `${cena(s.cena || 'noite', w, h, 11)}${s.emoji ? `<div style="position:absolute;left:0;right:0;top:${h * .2}px;text-align:center;font-size:${h * .3}px;line-height:1">${s.emoji}</div>` : ''}`}
    <div style="position:absolute;inset:auto 0 0 0;height:45%;background:linear-gradient(transparent,rgba(8,24,22,.55))"></div>
    <div style="position:absolute;left:40px;right:40px;bottom:${s.legendaKr ? 74 : 44}px">${legenda(s.legenda || '', s.legendaTam || 46)}</div>
    ${s.legendaKr ? `<div style="position:absolute;left:40px;right:40px;bottom:30px;text-align:center">${hangul(s.legendaKr, 26, 'rgba(255,255,255,.85)')}</div>` : ''}
    ${s.episodio ? `<div style="position:absolute;left:26px;top:24px;padding:8px 16px;border-radius:10px;background:rgba(8,24,22,.55);font-weight:800;font-size:22px;letter-spacing:.14em;color:#fff">${esc(s.episodio)}</div>` : ''}</div>`;
};


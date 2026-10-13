// Embalagens Gran Doces desenhadas em SVG (caixas em perspectiva com a arte da marca) para os produtos de
// Natal, e o cardápio em PDF com elas. Uso: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node embalagens.mjs
// Precisa de assets/galinha.png e assets/fotos/*.jpg (fora do git).
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const root = path.dirname(new URL(import.meta.url).pathname);
const { chromium } = createRequire(path.join(root, '../../moldes/treino-de-pecas/package.json'))('playwright');
const OUT = path.join(root, 'saida', 'embalagens'), BUILD = path.join(root, 'build');
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(path.join(OUT, 'mockups'), { recursive: true }); fs.mkdirSync(path.join(OUT, 'posts'), { recursive: true }); fs.mkdirSync(path.join(OUT, 'cardapio'), { recursive: true }); fs.mkdirSync(BUILD, { recursive: true });
const GAL = 'data:image/png;base64,' + fs.readFileSync(path.join(root, 'assets/galinha.png')).toString('base64');
const FOTO = n => 'file://' + path.join(root, 'assets/fotos', n + '.jpg');
const C = { azul: '#0A62E8', noite: '#0B2B6E', creme: '#FCEEDF', caramelo: '#C9853E', rosa: '#F4B6C6', cacau: '#3B2418', vermelho: '#B5172E', vinho: '#6D0F1E', verde: '#114E3B', pinheiro: '#0A3328', dourado: '#C9A35B', ouro: '#E8CF95', ninho: '#EAF2FB', celeste: '#9CC3F5' };
const HEAD = `<meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,500..900,100&family=DM+Sans:wght@400;500;700&family=Pinyon+Script&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0}body{font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased}.f{font-family:Fraunces,serif;font-variation-settings:'SOFT' 100}.s{font-family:'Pinyon Script',cursive}text{font-variation-settings:'SOFT' 100}</style>`;
let n = 0; const id = p => p + (++n);
const F = "font-family='Fraunces' font-weight='900'", D = "font-family='DM Sans' font-weight='700'", S = "font-family='Pinyon Script'";

// ---------- peças de arte (SVG, coordenadas locais) ----------
const galinha = (x, y, h, cor) => { const m = id('g'); return `<mask id="${m}" style="mask-type:alpha"><image href="${GAL}" x="${x}" y="${y}" width="${h * .876}" height="${h}"/></mask><rect x="${x}" y="${y}" width="${h * .876}" height="${h}" fill="${cor}" mask="url(#${m})"/>`; };
const estrela = (x, y, r, cor, op = 1) => { let p = ''; for (let i = 0; i < 10; i++) { const a = Math.PI / 5 * i - Math.PI / 2, rr = i % 2 ? r * .45 : r; p += `${x + rr * Math.cos(a)},${y + rr * Math.sin(a)} `; } return `<polygon points="${p}" fill="${cor}" opacity="${op}"/>`; };
const padrao = (tipo, cor, op = .35) => { const p = id('p');
  const dentro = { estrelas: `${estrela(15, 15, 7, cor, op)}${estrela(45, 45, 5, cor, op)}`, gotas: `<path d="M15 8 q6 10 0 14 q-6 -4 0 -14z" fill="${cor}" opacity="${op}"/><path d="M45 38 q6 10 0 14 q-6 -4 0 -14z" fill="${cor}" opacity="${op}"/>`,
    listras: `<rect x="0" y="0" width="15" height="60" fill="${cor}" opacity="${op}"/>`, bolinhas: `<circle cx="15" cy="15" r="4" fill="${cor}" opacity="${op}"/><circle cx="45" cy="45" r="4" fill="${cor}" opacity="${op}"/>`,
    xadrez: `<rect width="30" height="30" fill="${cor}" opacity="${op}"/><rect x="30" y="30" width="30" height="30" fill="${cor}" opacity="${op}"/>` }[tipo];
  return [`<pattern id="${p}" width="60" height="60" patternUnits="userSpaceOnUse">${dentro}</pattern>`, `url(#${p})`]; };
const seloGD = (cx, cy, r, cor, fundo) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fundo}"/><circle cx="${cx}" cy="${cy}" r="${r * .86}" fill="none" stroke="${cor}" stroke-width="${r * .05}"/><text x="${cx}" y="${cy + r * .3}" text-anchor="middle" ${F} font-size="${r * .82}" fill="${cor}" letter-spacing="-2">GD</text>`;
const rotulo = (x, y, w, h, fundo, cor, nome, sub) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h * .14}" fill="${fundo}"/><rect x="${x + 8}" y="${y + 8}" width="${w - 16}" height="${h - 16}" rx="${h * .1}" fill="none" stroke="${cor}" stroke-width="2" opacity=".6"/>
  <text x="${x + w / 2}" y="${y + h * .36}" text-anchor="middle" ${F} font-size="${h * .22}" fill="${cor}">Gran Doces</text>
  <text x="${x + w / 2}" y="${y + h * .64}" text-anchor="middle" ${S} font-size="${h * .27}" fill="${cor}">${nome}</text>
  ${sub ? `<text x="${x + w / 2}" y="${y + h * .86}" text-anchor="middle" ${D} font-size="${h * .085}" letter-spacing="3" fill="${cor}">${sub}</text>` : ''}`;

// ---------- caixa em perspectiva oblíqua (frente reta, lateral e topo inclinados) ----------
// o: {x, y (base da frente), w, h, d, frente: fn(w,h), lado: fn(d,h), topo: fn(w,d), telhado (altura), cores {frente, lado, topo}, fita, laco}
function caixa(o) {
  const k = .62, dx = o.d * k, dy = -o.d * .42, { x, y, w, h } = o, t = y - h, r = o.telhado || 0;
  const cl = id('c'), cs = id('s'), ct = id('t');
  const P = a => a.map(p => p.join(',')).join(' ');
  const lado = [[x + w, y], [x + w + dx, y + dy], [x + w + dx, t + dy], [x + w, t]];
  const topo = r ? null : [[x, t], [x + dx, t + dy], [x + w + dx, t + dy], [x + w, t]];
  let s = `<ellipse cx="${x + w / 2 + dx / 2}" cy="${y + 10}" rx="${w * .62 + dx / 2}" ry="${26 + o.d * .08}" fill="rgba(30,15,5,.22)" filter="url(#sombra)"/>`;
  // lateral
  s += `<clipPath id="${cs}"><polygon points="${P(lado)}"/></clipPath><g clip-path="url(#${cs})"><polygon points="${P(lado)}" fill="${o.cores.lado}"/>
    <g transform="matrix(${dx / o.d},${dy / o.d},0,1,${x + w},${t})">${o.lado ? o.lado(o.d, h) : ''}</g><polygon points="${P(lado)}" fill="rgba(0,0,0,.2)"/></g>`;
  // topo ou telhado (caixa casinha)
  if (topo) s += `<clipPath id="${ct}"><polygon points="${P(topo)}"/></clipPath><g clip-path="url(#${ct})"><polygon points="${P(topo)}" fill="${o.cores.topo}"/>
    <g transform="matrix(1,0,${-dx / o.d},${-dy / o.d},${x + dx},${t + dy})">${o.topo ? o.topo(w, o.d) : ''}</g><polygon points="${P(topo)}" fill="rgba(255,255,255,.1)"/></g>`;
  else {
    const esq = [[x, t], [x + w / 2, t - r], [x + w / 2 + dx, t - r + dy], [x + dx, t + dy]], dir = [[x + w / 2, t - r], [x + w / 2 + dx, t - r + dy], [x + w + dx, t + dy], [x + w, t]];
    s += `<polygon points="${P(esq)}" fill="${o.cores.lado}"/><polygon points="${P(esq)}" fill="rgba(0,0,0,.28)"/><polygon points="${P(dir)}" fill="${o.cores.frente}"/><polygon points="${P(dir)}" fill="rgba(0,0,0,.12)"/>
      <polygon points="${x},${t} ${x + w / 2},${t - r} ${x + w},${t}" fill="${o.cores.frente}"/>${o.oitao ? o.oitao(x, t, w, r) : ''}
      <line x1="${x + w / 2}" y1="${t - r}" x2="${x + w / 2 + dx}" y2="${t - r + dy}" stroke="rgba(255,255,255,.35)" stroke-width="3"/>`;
  }
  // frente
  s += `<clipPath id="${cl}"><rect x="${x}" y="${t}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#${cl})"><rect x="${x}" y="${t}" width="${w}" height="${h}" fill="${o.cores.frente}"/>
    <g transform="translate(${x},${t})">${o.frente(w, h)}</g><rect x="${x}" y="${t}" width="${w}" height="${h}" fill="url(#luz)"/></g>`;
  // fita e laço
  if (o.fita) {
    const fw = o.fitaW || 34;
    if (o.fitaFrente !== false) s += `<rect x="${x + w / 2 - fw / 2}" y="${t}" width="${fw}" height="${h}" fill="${o.fita}"/><rect x="${x + w / 2 - fw / 2}" y="${t}" width="${fw}" height="${h}" fill="url(#luz)"/>`;
    if (topo) s += `<polygon points="${x + w / 2 - fw / 2},${t} ${x + w / 2 - fw / 2 + dx},${t + dy} ${x + w / 2 + fw / 2 + dx},${t + dy} ${x + w / 2 + fw / 2},${t}" fill="${o.fita}"/>`;
    if (o.laco) { const bx = x + w / 2 + dx * .5, by = (r ? t - r : t) + dy * .5 - 6, c = o.fita;
      s += `<path d="M${bx} ${by} C ${bx - 90} ${by - 70}, ${bx - 110} ${by + 20}, ${bx} ${by}" fill="${c}"/><path d="M${bx} ${by} C ${bx + 90} ${by - 70}, ${bx + 110} ${by + 20}, ${bx} ${by}" fill="${c}"/>
        <path d="M${bx} ${by} C ${bx - 90} ${by - 70}, ${bx - 110} ${by + 20}, ${bx} ${by}" fill="rgba(0,0,0,.15)" transform="translate(4 4) scale(1)"/>
        <path d="M${bx - 6} ${by} l -40 70 l 18 -4 l 8 16 z" fill="${c}"/><path d="M${bx + 6} ${by} l 40 70 l -18 -4 l -8 16 z" fill="${c}"/><circle cx="${bx}" cy="${by}" r="16" fill="${c}"/><circle cx="${bx}" cy="${by}" r="16" fill="rgba(255,255,255,.18)"/>`; }
  }
  return s;
}
// Lata/caixa redonda (cilindro): o {cx, y (base), r, h, cor, arte(w,h) na faixa, tampa}
function cilindro(o) {
  const { cx, y, r, h } = o, ry = r * .32, t = y - h, cl = id('cy');
  return `<ellipse cx="${cx}" cy="${y + 8}" rx="${r * 1.15}" ry="${ry * 1.1}" fill="rgba(30,15,5,.22)" filter="url(#sombra)"/>
    <clipPath id="${cl}"><path d="M${cx - r} ${t} L${cx - r} ${y} A${r} ${ry} 0 0 0 ${cx + r} ${y} L${cx + r} ${t} Z"/></clipPath>
    <g clip-path="url(#${cl})"><rect x="${cx - r}" y="${t}" width="${2 * r}" height="${h + ry}" fill="${o.cor}"/><g transform="translate(${cx - r},${t})">${o.arte(2 * r, h + ry)}</g>
      <rect x="${cx - r}" y="${t}" width="${2 * r}" height="${h + ry}" fill="url(#cil)"/></g>
    <ellipse cx="${cx}" cy="${t}" rx="${r}" ry="${ry}" fill="${o.tampa || o.cor}"/><ellipse cx="${cx}" cy="${t}" rx="${r}" ry="${ry}" fill="rgba(255,255,255,.14)"/>${o.topo ? o.topo(cx, t, r, ry) : ''}`;
}

const DEFS = `<defs><filter id="sombra" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
  <linearGradient id="luz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient>
  <linearGradient id="cil" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".35" stop-color="#fff" stop-opacity=".16"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient></defs>`;

// ---------- embalagens ----------
// Caixa casinha de panetone (frente quadrada + telhado), em várias cores
const casinha = (x, y, s, cor, padr, padCor, nome, sub, extra = {}) => { const [pd, pu] = padrao(padr, padCor, .4); return caixa({ x, y, w: s, h: s * .95, d: s * .9, telhado: s * .42,
  cores: { frente: cor, lado: cor, topo: cor }, fita: extra.fita, laco: !!extra.fita, fitaW: s * .07, fitaFrente: false,
  frente: (w, h) => `<defs>${pd}</defs><rect width="${w}" height="${h}" fill="${pu}"/>${extra.fita ? `<rect x="${w / 2 - s * .035}" width="${s * .07}" height="${h}" fill="${extra.fita}"/>` : ''}${rotulo(w * .12, h * .28, w * .76, h * .44, C.creme, extra.texto || cor, nome, sub)}`,
  lado: (d, h) => `<defs>${pd}</defs><rect width="${d}" height="${h}" fill="${pu}"/>${extra.galLado ? galinha(d * .25, h * .3, h * .4, C.creme) : ''}`,
  oitao: (x0, t, w, r) => extra.gal ? galinha(x0 + w / 2 - r * .3, t - r * .78, r * .66, C.creme) : seloGD(x0 + w / 2, t - r * .42, r * .3, cor, C.ouro),
}); };
const miniCubo = (x, y, s, cor, padr, padCor, sabor) => { const [pd, pu] = padrao(padr, padCor, .45); return caixa({ x, y, w: s, h: s, d: s * .8, cores: { frente: cor, lado: cor, topo: cor }, fita: C.ouro, laco: true, fitaW: s * .1, fitaFrente: false,
  frente: (w, h) => `<defs>${pd}</defs><rect width="${w}" height="${h}" fill="${pu}"/><rect x="${w / 2 - s * .05}" width="${s * .1}" height="${h}" fill="${C.ouro}"/><rect x="${w * .1}" y="${h * .58}" width="${w * .8}" height="${h * .3}" rx="12" fill="${C.creme}"/><text x="${w / 2}" y="${h * .71}" text-anchor="middle" ${F} font-size="${w * .09}" fill="${cor}">Gran Doces</text><text x="${w / 2}" y="${h * .83}" text-anchor="middle" ${D} font-size="${w * .055}" letter-spacing="2" fill="${cor}">${sabor}</text>`,
  lado: (d, h) => `<defs>${pd}</defs><rect width="${d}" height="${h}" fill="${pu}"/>`, topo: (w, d) => `<defs>${pd}</defs><rect width="${w}" height="${d}" fill="${pu}"/>` }); };
// Caixa de brownies com tampa e janela (vê os brownies)
const caixaBrownie = (x, y, cor, faixa, nome, foto) => caixa({ x, y, w: 520, h: 110, d: 420, cores: { frente: cor, lado: cor, topo: cor },
  frente: (w, h) => `<rect width="${w}" height="${h}" fill="${faixa}"/><text x="${w / 2}" y="${h * .62}" text-anchor="middle" ${D} font-size="30" letter-spacing="8" fill="${cor}">${nome.toUpperCase()}</text>`,
  lado: (d, h) => `<rect width="${d}" height="${h}" fill="${faixa}"/>`,
  topo: (w, d) => `<rect width="${w}" height="${d}" fill="${cor}"/><rect x="40" y="40" width="${w - 80}" height="${d - 150}" rx="26" fill="#fff"/><image href="${FOTO(foto)}" x="46" y="46" width="${w - 92}" height="${d - 162}" preserveAspectRatio="xMidYMid slice" clip-path="inset(0 round 22px)"/>
    <rect x="46" y="46" width="${w - 92}" height="${d - 162}" rx="22" fill="url(#luz)"/><text x="${w / 2}" y="${d - 52}" text-anchor="middle" ${F} font-size="46" fill="${faixa}">Gran Doces</text>${galinha(w - 110, d - 102, 80, faixa)}` });
// Caixa redonda (chapeleira) da torta
const caixaTorta = (cx, y) => cilindro({ cx, y, r: 340, h: 280, cor: C.verde, tampa: C.verde,
  arte: (w, h) => { const [pd, pu] = padrao('estrelas', C.ouro, .5); return `<defs>${pd}</defs><rect width="${w}" height="${h}" fill="${pu}"/><rect y="${h * .62}" width="${w}" height="44" fill="${C.ouro}"/>`; },
  topo: (cx, t, r, ry) => `<ellipse cx="${cx}" cy="${t}" rx="${r * .78}" ry="${ry * .78}" fill="none" stroke="${C.ouro}" stroke-width="3"/><g transform="translate(${cx},${t}) scale(1,.32)"><text y="-40" text-anchor="middle" ${F} font-size="58" fill="${C.creme}">Gran Doces</text><text y="60" text-anchor="middle" ${S} font-size="64" fill="${C.ouro}">Torta de Chocolate</text></g>
    
    <g transform="translate(${cx + r * .78},${t + ry * 1.9})"><path d="M0 0 C -80 -60, -100 18, 0 0" fill="${C.vermelho}"/><path d="M0 0 C 80 -60, 100 18, 0 0" fill="${C.vermelho}"/><path d="M-5 0 l -34 60 l 16 -4 l 7 14 z" fill="${C.vermelho}"/><path d="M5 0 l 34 60 l -16 -4 l -7 14 z" fill="${C.vermelho}"/><circle r="14" fill="${C.vermelho}"/></g>` });

// ---------- produtos ----------
const PROD = [
  { id: 'panetone-classico', nome: 'Panetone Clássico', peso: '500 g', foto: 'panetone', fundo: C.creme, cor: C.vermelho, desc: 'Massa de fermentação natural, macia e perfumada, com frutas cristalizadas e uvas-passas.',
    cena: () => casinha(330, 1080, 420, C.vermelho, 'estrelas', C.ouro, 'Clássico', 'PANETONE ARTESANAL', { fita: C.ouro }) },
  { id: 'panetone-gotas', nome: 'Panetone Gotas de Chocolate', peso: '500 g', foto: 'panetone', fundo: '#F3E6D6', cor: C.verde, desc: 'A mesma massa artesanal, recheada com muitas gotas de chocolate meio amargo.',
    cena: () => casinha(330, 1080, 420, C.verde, 'gotas', C.ouro, 'Gotas', 'GOTAS DE CHOCOLATE', { fita: C.vermelho }) },
  { id: 'brownietone', nome: 'Brownietone', peso: '1,2 kg', foto: 'brownietone', fundo: '#E5EEFC', cor: C.azul, desc: 'Brownie molhadinho em formato de panetone, recheado com brigadeiro cremoso e coberto de chocolate.',
    cena: () => casinha(330, 1080, 420, C.azul, 'bolinhas', C.creme, 'Brownietone', 'O FAVORITO DA CASA', { gal: true, galLado: true, texto: C.azul }) },
  { id: 'mini-panetone', nome: 'Mini Panetone', peso: '150 g', foto: 'panetone', fundo: C.creme, cor: C.vermelho, desc: 'Versão individual, perfeita para presentear: clássico, gotas de chocolate ou brownietone.',
    cena: () => `${miniCubo(140, 1080, 230, C.verde, 'gotas', C.ouro, 'GOTAS')}${miniCubo(600, 1080, 230, C.azul, 'bolinhas', C.creme, 'BROWNIETONE')}${miniCubo(370, 1170, 250, C.vermelho, 'estrelas', C.ouro, 'CLÁSSICO')}` },
  { id: 'kits-brownie', nome: 'Kits de Brownie', peso: '6 unidades', foto: 'brownies', fundo: '#F6E7DA', cor: C.cacau, desc: 'Três sabores, cada um com seu adesivo: Tradicional, Ninho e Chocolate. Caixa kraft com laço, pronta para presentear.',
    cena: () => `<g transform="translate(95,215) scale(.8)">${caixaBrownie(120, 640, C.caramelo, C.creme, 'Tradicional', 'brownies')}${caixaBrownie(330, 900, C.ninho, C.azul, 'Ninho', 'brownies')}${caixaBrownie(120, 1160, C.cacau, C.ouro, 'Chocolate', 'brownies')}</g>` },
  { id: 'torta-chocolate', nome: 'Torta de Chocolate', peso: '10 fatias', foto: 'fatia', fundo: '#E9F0EA', cor: C.verde, desc: 'Massa de cacau, recheio cremoso de brigadeiro e cobertura de ganache. Acompanha o topo de Feliz Natal da Gran Doces.',
    cena: () => caixaTorta(540, 1080) },
];
// Foto da embalagem (montar_fotos.py): foto real com o adesivo/etiqueta da Gran Doces aplicado.
const FOTOEMB = id => 'file://' + path.join(root, 'saida/fotos-embalagem', id + '.jpg');
const mockup = p => `<div style="width:1080px;height:1350px;background:url(${FOTOEMB(p.id)}) center/cover"></div>`;
const post = p => `<div style="position:relative;width:1080px;height:1350px;overflow:hidden">${mockup(p)}
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,6,4,.62) 0%,rgba(10,6,4,0) 26%,rgba(10,6,4,0) 74%,rgba(10,6,4,.66) 100%)"></div>
  <div style="position:absolute;left:80px;right:80px;top:70px;color:#fff">
    <div style="font-weight:700;font-size:24px;letter-spacing:.3em;color:${C.ouro}">NATAL 2026 · GRAN DOCES</div>
    <div class="f" style="font-weight:900;font-size:80px;line-height:1;letter-spacing:-.03em;margin-top:12px;max-width:900px">${p.nome}</div></div>
  <div style="position:absolute;left:80px;right:80px;bottom:64px;display:flex;justify-content:space-between;align-items:flex-end;color:#fff">
    <div style="font-size:32px;font-weight:700">${p.peso} · <span style="color:${C.ouro}">R$ 00,00</span></div>
    <div style="font-size:26px;font-weight:700;letter-spacing:.14em;background:${C.ouro};color:${C.cacau};padding:12px 26px;border-radius:999px">ENCOMENDE</div></div></div>`;

// ---------- cardápio A4 ----------
const W = 1240, H = 1754;
const estrelas = (cor, n2 = 30) => { let r = 13, o = ''; const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280; for (let i = 0; i < n2; i++) o += `<div style="position:absolute;left:${rnd() * W}px;top:${rnd() * H}px;color:${cor};opacity:${.3 + rnd() * .4};font-size:${14 + rnd() * 22}px">★</div>`; return o; };
const galDiv = (cor, px) => `<span style="display:block;width:${px * .876}px;height:${px}px;background:${cor};-webkit-mask:url(${GAL}) center/contain no-repeat"></span>`;
const capa = `<div style="position:relative;width:${W}px;height:${H}px;overflow:hidden;background:radial-gradient(110% 70% at 50% 0%,${C.vermelho} 0%,${C.vinho} 80%)">${estrelas(C.ouro, 40)}
  <div style="position:absolute;inset:60px;border:3px solid ${C.ouro};border-radius:30px"></div>
  <div style="position:absolute;left:0;right:0;top:230px;display:flex;flex-direction:column;align-items:center;text-align:center;color:${C.creme}">
    ${galDiv(C.creme, 300)}<div style="font-weight:700;font-size:38px;letter-spacing:.5em;margin:70px -.5em 0 0;color:${C.ouro}">CARDÁPIO</div>
    <div class="s" style="font-size:200px;line-height:1.1;color:${C.ouro}">Natal 2026</div>
    <div class="f" style="font-weight:900;font-size:100px;letter-spacing:-.03em;margin-top:60px">Gran Doces</div>
    <div style="font-weight:700;font-size:26px;letter-spacing:.42em;margin-top:16px">CONFEITARIA</div></div></div>`;
const pagina = (p, img) => `<div style="position:relative;width:${W}px;height:${H}px;overflow:hidden;background:${C.creme}">
  <img src="${FOTOEMB(p.id)}" style="position:absolute;left:0;top:0;width:${W}px;height:${W * 1350 / 1080 * .76}px;object-fit:cover;object-position:center 60%">
  <div style="position:absolute;left:0;right:0;top:${W * 1350 / 1080 * .74 - 10}px;bottom:0;background:${p.cor};padding:60px 90px;color:${C.creme}">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:40px">
      <div><div class="f" style="font-weight:900;font-size:84px;line-height:1;letter-spacing:-.03em">${p.nome}</div>
        <div style="font-weight:700;font-size:30px;letter-spacing:.12em;color:${C.ouro};margin-top:20px">${p.peso.toUpperCase()} · R$ 00,00</div></div>
      </div>
    <p style="font-size:34px;line-height:1.5;margin-top:26px;max-width:960px;opacity:.94">${p.desc}</p>
    <div style="position:absolute;right:90px;bottom:60px" class="f"><span style="font-weight:900;font-size:34px;color:${C.ouro}">Gran Doces</span></div></div></div>`;
const contato = `<div style="position:relative;width:${W}px;height:${H}px;overflow:hidden;background:${C.azul};display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:${C.creme}">
  ${galDiv(C.creme, 420)}<div class="f" style="font-weight:900;font-size:110px;letter-spacing:-.03em;margin-top:70px">Faça sua encomenda</div>
  <div style="margin-top:60px;display:flex;flex-direction:column;gap:24px;font-size:42px">
    <span>WhatsApp (00) 00000-0000</span><span>@grandoces</span><span>Endereço da loja</span></div>
  <div style="margin-top:70px;font-size:30px;opacity:.8">Pedidos até 00/12 · retirada ou entrega</div></div>`;

const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors', '--allow-file-access-from-files'] });
const browser = await chromium.launch(launch);
const page = await browser.newPage();
const tirar = async (nome, html, w, h, destino) => {
  const arq = path.join(BUILD, nome + '.html');
  fs.writeFileSync(arq, `<!doctype html><html><head>${HEAD}</head><body>${html}</body></html>`);
  await page.setViewportSize({ width: w, height: h }); await page.goto('file://' + arq); await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500); await page.screenshot({ path: destino });
};
for (const p of PROD) {
  await tirar('mk-' + p.id, mockup(p), 1080, 1350, path.join(OUT, 'mockups', p.id + '.png'));
  await tirar('post-' + p.id, post(p), 1080, 1350, path.join(OUT, 'posts', p.id + '.png'));
}
const PAGS = [['00-capa', capa], ...PROD.map((p, i) => [`${String(i + 1).padStart(2, '0')}-${p.id}`, pagina(p, path.join(OUT, 'mockups', p.id + '.png'))]), ['99-contato', contato]];
for (const [nm, html] of PAGS) await tirar('pg-' + nm, html, W, H, path.join(OUT, 'cardapio', nm + '.png'));
fs.writeFileSync(path.join(BUILD, 'cardapio-embalagens.html'), `<!doctype html><html><head>${HEAD}<style>@page{size:${W}px ${H}px;margin:0}</style></head><body>${PAGS.map(([, h]) => `<div style="width:${W}px;height:${H}px;overflow:hidden;break-after:page">${h}</div>`).join('')}</body></html>`);
await page.goto('file://' + path.join(BUILD, 'cardapio-embalagens.html')); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(800);
await page.pdf({ path: path.join(OUT, 'Cardapio-Natal-Gran-Doces-embalagens.pdf'), width: W + 'px', height: H + 'px', printBackground: true });
await browser.close();
console.log('✓', PROD.length, 'embalagens,', PAGS.length, 'páginas de cardápio');

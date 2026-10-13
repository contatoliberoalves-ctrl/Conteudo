// Facas (embalagens planificadas) da linha de Natal Gran Doces para a gráfica, em escala 1:1 (mm):
// casinha com telhado (panetones 500 g, brownietone, mini panetone), rótulo de lata, cinta de brownie e
// caixa redonda. Linha contínua = corte; tracejada = vinco (dobra). Fundo sangra além do corte.
// Uso: CHROMIUM_PATH=... RENDER_PROXY=... node facas.mjs  -> saida/facas/Gran-Doces-facas.pdf
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const root = path.dirname(new URL(import.meta.url).pathname);
const { chromium } = createRequire(path.join(root, '../../moldes/treino-de-pecas/package.json'))('playwright');
const OUT = path.join(root, 'saida', 'facas'); fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const GAL = 'data:image/png;base64,' + fs.readFileSync(path.join(root, 'assets/galinha.png')).toString('base64');
const C = { azul: '#0B3A8E', vermelho: '#A8142A', verde: '#1E4A3A', verdeEsc: '#16352B', cacau: '#3B2418', caramelo: '#B9762F', ninho: '#EEF3F8', ouro: '#C9A35B', creme: '#FCEEDF' };
const HEAD = `<meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,400..900,100&family=DM+Sans:wght@400;700&family=Pinyon+Script&display=swap" rel="stylesheet"><style>*{margin:0}body{font-family:'DM Sans'}</style>`;
const F = "font-family='Fraunces' font-weight='800'", S = "font-family='Pinyon Script'", D = "font-family='DM Sans' font-weight='700'";
let uid = 0;
const P = pts => pts.map(p => p.map(v => +v.toFixed(2)).join(',')).join(' ');
// aba na aresta a→b, para fora do polígono (centro c), profundidade dep, recuo k
const aba = (a, b, c, dep = 10, k = 4) => { const ux = b[0] - a[0], uy = b[1] - a[1], L = Math.hypot(ux, uy), u = [ux / L, uy / L]; let n = [-u[1], u[0]];
  const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; if ((m[0] + n[0] - c[0]) ** 2 + (m[1] + n[1] - c[1]) ** 2 < (m[0] - c[0]) ** 2 + (m[1] - c[1]) ** 2) n = [-n[0], -n[1]];
  return [[a[0] + u[0] * k + n[0] * dep, a[1] + u[1] * k + n[1] * dep], [b[0] - u[0] * k + n[0] * dep, b[1] - u[1] * k + n[1] * dep]]; };
const estrelas = (x, y, w, h, n, cor = C.ouro, seed = 3) => { let r = seed, o = ''; const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < n; i++) o += `<circle cx="${x + rnd() * w}" cy="${y + rnd() * h}" r="${.3 + rnd() * .8}" fill="${cor}" opacity="${.6 + rnd() * .4}"/>`; return o; };
const gal = (x, y, h, cor) => { const m = 'm' + (++uid); return `<mask id="${m}" style="mask-type:alpha"><image href="${GAL}" x="${x}" y="${y}" width="${h * .876}" height="${h}"/></mask><rect x="${x}" y="${y}" width="${h * .876}" height="${h}" fill="${cor}" mask="url(#${m})"/>`; };
const selo = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.ouro}"/><circle cx="${cx}" cy="${cy}" r="${r * .82}" fill="none" stroke="#8c6526" stroke-width=".6"/><text x="${cx}" y="${cy + r * .32}" text-anchor="middle" ${F} font-size="${r * .9}" fill="#8c6526">GD</text>`;
const pagina = (titulo, info, w, h, svg, montagem) => { const M = 18, W = w + 2 * M, H = h + 2 * M + 34;
  return { W, H, html: `<div style="width:${W}mm;height:${H}mm;position:relative;background:#fff">
    <div style="position:absolute;left:${M}mm;top:6mm;font-size:5mm;font-weight:700">${titulo}</div>
    <div style="position:absolute;left:${M}mm;top:13mm;font-size:3.2mm;color:#444">${info}</div>
    <svg style="position:absolute;left:${M}mm;top:${M + 12}mm;width:${w}mm;height:${h}mm;overflow:visible" viewBox="0 0 ${w} ${h}">${svg}</svg>
    <div style="position:absolute;left:${M}mm;bottom:6mm;right:${M}mm;font-size:3mm;color:#333;display:flex;gap:8mm;align-items:center">
      <span><svg width="14mm" height="2mm" viewBox="0 0 14 2"><line x1="0" y1="1" x2="14" y2="1" stroke="#E6007E" stroke-width=".5"/></svg> corte</span>
      <span><svg width="14mm" height="2mm" viewBox="0 0 14 2"><line x1="0" y1="1" x2="14" y2="1" stroke="#00A0E6" stroke-width=".5" stroke-dasharray="2 1.2"/></svg> vinco (dobra)</span>
      <span>Escala 1:1 · medidas em mm · fundo com sangria</span><span style="flex:1"></span><span>${montagem}</span></div></div>` }; };
const cortar = pts => `<polygon points="${P(pts)}" fill="none" stroke="#E6007E" stroke-width=".35"/>`;
const vinco = (a, b) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#00A0E6" stroke-width=".35" stroke-dasharray="2 1.2"/>`;

// ---------- casinha: frente, lateral, fundo, lateral + aba de cola; oitões na frente/fundo; telhado nas laterais ----------
function casinha({ W, Dp, H, T, cor, nome, linha, peso }) {
  const g = 12, s = Math.hypot(W / 2, T), fb = Dp * .5, sb = Dp * .45, x1 = W, x2 = W + Dp, x3 = 2 * W + Dp, x4 = 2 * W + 2 * Dp;
  const cF = [W / 2, H / 2], cB = [x2 + W / 2, H / 2];
  const gF = [[0, 0], [W / 2, -T], [W, 0]], gB = [[x2, 0], [x2 + W / 2, -T], [x3, 0]];
  const pts = [[0, 0], ...aba(gF[0], gF[1], cF), [W / 2, -T], ...aba(gF[1], gF[2], cF), [W, 0], [W, -s], [x2, -s], [x2, 0], ...aba(gB[0], gB[1], cB), [x2 + W / 2, -T], ...aba(gB[1], gB[2], cB), [x3, 0],
    [x3, -s], [x3 + 3, -s - 15], [x4 - 3, -s - 15], [x4, -s], [x4, 0], [x4 + g, 5], [x4 + g, H - 5], [x4, H],
    [x4 - 3, H + sb], [x3 + 3, H + sb], [x3, H], [x3 - 2, H + fb], [x2 + 2, H + fb], [x2, H], [x2 - 3, H + sb], [x1 + 3, H + sb], [x1, H], [x1 - 2, H + fb], [2, H + fb], [0, H]];
  const ox = 3, oy = s + 18, w = x4 + g + 6, h = s + 18 + H + fb + 6;
  const t = (x, y) => `translate(${x + ox} ${y + oy})`;
  const frente = (x0, isFrente) => `<g transform="${t(x0, 0)}">${estrelas(0, -T, W, H + T, 70)}${selo(W / 2, -T * .42, T * .28)}
    ${isFrente ? `<rect x="${W * .1}" y="${H * .12}" width="${W * .8}" height="${H * .32}" fill="none" stroke="${C.ouro}" stroke-width=".6"/><rect x="${W * .1 + 1.6}" y="${H * .12 + 1.6}" width="${W * .8 - 3.2}" height="${H * .32 - 3.2}" fill="none" stroke="${C.ouro}" stroke-width=".3"/>
      <text x="${W / 2}" y="${H * .3}" text-anchor="middle" ${F} font-size="${W * .1}" fill="${C.ouro}" letter-spacing=".6">${nome.toUpperCase()}</text><text x="${W / 2}" y="${H * .39}" text-anchor="middle" ${D} font-size="${W * .032}" letter-spacing="1.2" fill="${C.ouro}">${linha}</text>
      <text x="${W / 2}" y="${H * .82}" text-anchor="middle" ${F} font-size="${W * .06}" fill="${C.ouro}" letter-spacing=".8">GRAN DOCES</text><text x="${W / 2}" y="${H * .88}" text-anchor="middle" ${D} font-size="${W * .022}" letter-spacing="1.2" fill="${C.ouro}">CONFEITARIA ARTESANAL · ${peso}</text>`
    : `<text x="${W / 2}" y="${H * .3}" text-anchor="middle" ${S} font-size="${W * .16}" fill="${C.ouro}">Feliz Natal</text>
      <text x="${W / 2}" y="${H * .45}" text-anchor="middle" ${D} font-size="${W * .03}" fill="${C.ouro}">Feito à mão com carinho pela Gran Doces.</text>
      <rect x="${W * .12}" y="${H * .56}" width="${W * .76}" height="${H * .3}" fill="#fff" opacity=".92"/><text x="${W * .15}" y="${H * .62}" ${D} font-size="${W * .025}" fill="#333">INGREDIENTES · VALIDADE · LOTE · TABELA NUTRICIONAL</text><text x="${W * .15}" y="${H * .67}" font-family="DM Sans" font-size="${W * .022}" fill="#777">(área reservada para as informações obrigatórias)</text>`}</g>`;
  const lateral = x0 => `<g transform="${t(x0, 0)}">${estrelas(0, -s, Dp, s + H, 60, C.ouro, x0)}${gal(Dp / 2 - H * .17, H * .25, H * .4, C.ouro)}<text x="${Dp / 2}" y="${H * .82}" text-anchor="middle" ${D} font-size="${Dp * .035}" letter-spacing="1" fill="${C.ouro}">@grandoces</text></g>`;
  const folds = [vinco([x1, 0], [x1, H]), vinco([x2, 0], [x2, H]), vinco([x3, 0], [x3, H]), vinco([x4, 0], [x4, H]), vinco([0, H], [x4, H]), vinco([x1, 0], [x2, 0]), vinco([x3, 0], [x4, 0]), vinco([x3, -s], [x4, -s]),
    vinco(gF[0], gF[1]), vinco(gF[1], gF[2]), vinco(gB[0], gB[1]), vinco(gB[1], gB[2])].join('');
  return { w, h, svg: `<g><rect x="0" y="0" width="${w}" height="${h}" fill="${cor}"/>${frente(0, true)}${lateral(x1)}${frente(x2, false)}${lateral(x3)}
    <g transform="translate(${ox} ${oy})">${cortar(pts)}${folds}</g>
    <g transform="translate(${ox} ${oy})" font-family="DM Sans" font-size="3" fill="#E6007E"><text x="${W / 2}" y="${H + fb + 5}" text-anchor="middle">${W} mm</text><text x="${x1 + Dp / 2}" y="${H + sb + 5}" text-anchor="middle">${Dp} mm</text><text x="-2" y="${H / 2}" text-anchor="end">${H} mm</text></g></g>`,
    info: `Base ${W}×${Dp} mm · parede ${H} mm · cumeeira ${T} mm acima da parede · telhado ${s.toFixed(0)} mm · aberta ${(x4 + g).toFixed(0)}×${(s + 15 + H + fb).toFixed(0)} mm` };
}
// ---------- rótulo de lata ----------
function rotuloLata(dm, h, tipo) { const L = Math.PI * dm + 10, b = 3, w = L + 2 * b, hh = h + 2 * b;
  const bg = { vermelha: C.vermelho, verde: C.verde, fachada: C.verdeEsc }[tipo];
  let art = `<rect width="${w}" height="${hh}" fill="${bg}"/>${estrelas(0, 0, w, hh, 160)}`;
  for (const cx of [b + L * .25, b + L * .75]) art += `<text x="${cx}" y="${hh * .3}" text-anchor="middle" ${F} font-size="${h * .07}" fill="${C.ouro}" letter-spacing="1">GRAN DOCES</text><text x="${cx}" y="${hh * .55}" text-anchor="middle" ${S} font-size="${h * .22}" fill="${C.ouro}">Feliz Natal</text>${tipo === 'vermelha' ? gal(cx - h * .1, hh * .62, h * .26, C.ouro) : tipo === 'fachada' ? `<rect x="${cx - h * .28}" y="${hh * .68}" width="${h * .56}" height="${hh * .32}" fill="${C.vermelho}"/><rect x="${cx - h * .3}" y="${hh * .66}" width="${h * .6}" height="${h * .04}" fill="#fff"/><text x="${cx}" y="${hh * .78}" text-anchor="middle" ${F} font-size="${h * .04}" fill="${C.ouro}">GRAN DOCES</text>` : `<text x="${cx}" y="${hh * .75}" text-anchor="middle" ${D} font-size="${h * .035}" letter-spacing="2" fill="${C.ouro}">CONFEITARIA ARTESANAL</text>`}`;
  return { w, h: hh, svg: art + `<rect x="${b}" y="${b}" width="${L}" height="${h}" fill="none" stroke="#E6007E" stroke-width=".35"/>${vinco([b + L - 10, b], [b + L - 10, b + h])}<text x="${b + L - 5}" y="${b + 6}" text-anchor="middle" font-size="2.5" fill="#fff">cola</text>`,
    info: `Lata Ø ${dm} mm × ${h} mm · rótulo ${L.toFixed(0)}×${h} mm (10 mm de sobreposição para colar)` }; }
// ---------- cinta de brownie (6,5×6,5×3 cm) ----------
function cinta(cor, txt, sabor) { const A = 65, E = 30, larg = 45, L = 2 * A + 2 * E + 15, b = 3, w = L + 2 * b, h = larg + 2 * b;
  const xs = [0, A, A + E, 2 * A + E, 2 * A + 2 * E].map(v => v + b);
  return { w, h, svg: `<rect width="${w}" height="${h}" fill="${cor}"/>
    <line x1="${b}" y1="${b + 3}" x2="${b + L}" y2="${b + 3}" stroke="${txt}" stroke-width="1.1" stroke-dasharray="0 2.6" stroke-linecap="round"/><line x1="${b}" y1="${b + larg - 3}" x2="${b + L}" y2="${b + larg - 3}" stroke="${txt}" stroke-width="1.1" stroke-dasharray="0 2.6" stroke-linecap="round"/>
    ${gal(xs[0] + 4, b + 12, 20, txt)}<text x="${xs[0] + A / 2 + 8}" y="${b + 22}" text-anchor="middle" ${F} font-size="8" fill="${txt}">Gran Doces</text><text x="${xs[0] + A / 2 + 8}" y="${b + 35}" text-anchor="middle" ${S} font-size="11" fill="${txt}">${sabor}</text>
    <text x="${xs[2] + A / 2}" y="${b + 25}" text-anchor="middle" ${D} font-size="3" fill="${txt}" letter-spacing=".8">VALIDADE · LOTE · INGREDIENTES</text>
    <rect x="${b}" y="${b}" width="${L}" height="${larg}" fill="none" stroke="#E6007E" stroke-width=".35"/>${xs.slice(1).map(x => vinco([x, b], [x, b + larg])).join('')}`,
    info: `Brownie 65×65×30 mm · cinta ${L}×${larg} mm (frente · lateral · verso · lateral · 15 mm de cola)` }; }
// ---------- caixa redonda (torta) ----------
function caixaRedonda(dm, h, tampaH) { const b = 3, Lb = Math.PI * dm + 15, Lt = Math.PI * (dm + 4) + 15, r = dm / 2, rt = (dm + 4) / 2;
  const w = Math.max(Lb, Lt) + 2 * b, gap = 10, hh = h + tampaH + 2 * rt + 3 * gap + 2 * b;
  const y1 = b, y2 = y1 + h + gap, y3 = y2 + tampaH + gap;
  return { w, h: hh, svg: `<rect width="${w}" height="${hh}" fill="${C.vermelho}"/>
    <text x="${b + Lb / 2}" y="${y1 + h * .6}" text-anchor="middle" ${F} font-size="${h * .16}" fill="${C.ouro}" letter-spacing="2">GRAN DOCES</text>
    <text x="${b + Lt / 2}" y="${y2 + tampaH * .65}" text-anchor="middle" ${S} font-size="${tampaH * .55}" fill="${C.ouro}">Feliz Natal</text>
    <g>${estrelas(b + 20, y3, 2 * rt, 2 * rt, 60)}<text x="${b + rt + 20}" y="${y3 + rt}" text-anchor="middle" ${F} font-size="${rt * .2}" fill="${C.ouro}">Gran Doces</text>${gal(b + rt + 20 - rt * .18, y3 + rt * 1.15, rt * .42, C.ouro)}</g>
    <circle cx="${b + 2 * rt + 50 + r}" cy="${y3 + rt}" r="${r}" fill="#7d1020"/>
    <rect x="${b}" y="${y1}" width="${Lb}" height="${h}" fill="none" stroke="#E6007E" stroke-width=".35"/>${vinco([b + Lb - 15, y1], [b + Lb - 15, y1 + h])}
    <rect x="${b}" y="${y2}" width="${Lt}" height="${tampaH}" fill="none" stroke="#E6007E" stroke-width=".35"/>${vinco([b + Lt - 15, y2], [b + Lt - 15, y2 + tampaH])}
    <circle cx="${b + rt + 20}" cy="${y3 + rt}" r="${rt}" fill="none" stroke="#E6007E" stroke-width=".35"/><circle cx="${b + 2 * rt + 50 + r}" cy="${y3 + rt}" r="${r}" fill="none" stroke="#E6007E" stroke-width=".35"/>
    <g font-family="DM Sans" font-size="4" fill="#fff"><text x="${b + 4}" y="${y1 + 6}">LATERAL DA BASE</text><text x="${b + 4}" y="${y2 + 6}">FAIXA DA TAMPA</text><text x="${b + rt + 20}" y="${y3 + 2 * rt + 7}" text-anchor="middle" fill="#333">TOPO DA TAMPA</text><text x="${b + 2 * rt + 50 + r}" y="${y3 + 2 * rt + 7}" text-anchor="middle" fill="#333">FUNDO</text></g>`,
    info: `Base Ø ${dm} × ${h} mm · tampa Ø ${dm + 4} × ${tampaH} mm (montar sobre papelão rígido 2 mm, revestido com o papel impresso)` }; }

const PECAS = [
  ['Casinha Panetone Clássico (500 g)', casinha({ W: 150, Dp: 150, H: 140, T: 60, cor: C.vermelho, nome: 'Clássico', linha: 'PANETONE ARTESANAL', peso: '500 G' }), 'Montagem: dobre os vincos, cole a aba lateral, feche o fundo e encaixe o telhado colando nas abas dos oitões.'],
  ['Casinha Panetone Gotas (500 g)', casinha({ W: 150, Dp: 150, H: 140, T: 60, cor: C.verde, nome: 'Gotas', linha: 'GOTAS DE CHOCOLATE', peso: '500 G' }), 'Mesma faca da casinha Clássico.'],
  ['Casinha Brownietone (1,2 kg)', casinha({ W: 200, Dp: 200, H: 150, T: 75, cor: C.azul, nome: 'Brownietone', linha: 'O FAVORITO DA CASA', peso: '1,2 KG' }), 'Papel cartão 350 g ou mais.'],
  ['Casinha Mini Panetone (150 g)', casinha({ W: 95, Dp: 95, H: 95, T: 45, cor: C.verde, nome: 'Mini', linha: 'MINI PANETONE', peso: '150 G' }), 'Cabe 1 mini panetone de até 9 cm.'],
  ['Rótulo de lata · vermelha', rotuloLata(100, 140, 'vermelha'), 'Envolva a lata e cole sobre a faixa de cola.'],
  ['Rótulo de lata · fachada Gran Doces', rotuloLata(100, 140, 'fachada'), ''],
  ['Rótulo de lata · verde', rotuloLata(100, 140, 'verde'), ''],
  ['Cinta de brownie · Tradicional', cinta(C.caramelo, '#F3DDA6', 'Tradicional'), 'Envolve o brownie embalado; fecha no verso.'],
  ['Cinta de brownie · Ninho', cinta(C.ninho, C.azul, 'Ninho'), ''],
  ['Cinta de brownie · Chocolate', cinta(C.cacau, '#E9CD86', 'Chocolate'), ''],
  ['Caixa redonda · Torta de Chocolate', caixaRedonda(260, 110, 45), 'Caixa rígida: imprimir em papel couché e revestir o papelão.'],
];

const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch), page = await browser.newPage();
const pdfs = [];
for (const [i, [titulo, p, mont]] of PECAS.entries()) {
  const pg = pagina(titulo, p.info, p.w, p.h, p.svg, mont);
  await page.setContent(`<!doctype html><html><head>${HEAD}<style>@page{size:${pg.W}mm ${pg.H}mm;margin:0}</style></head><body>${pg.html}</body></html>`);
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(300);
  const arq = path.join(OUT, `${String(i + 1).padStart(2, '0')}.pdf`);
  await page.pdf({ path: arq, width: pg.W + 'mm', height: pg.H + 'mm', printBackground: true }); pdfs.push(arq);
  await page.setViewportSize({ width: Math.round(pg.W * 3.78 * .6), height: Math.round(pg.H * 3.78 * .6) });
  await page.setContent(`<!doctype html><html><head>${HEAD}</head><body style="zoom:.6">${pg.html}</body></html>`); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(200);
  await page.screenshot({ path: arq.replace('.pdf', '.png') });
}
await browser.close();
execFileSync('python3', ['-c', `import pymupdf,sys\nd=pymupdf.open()\nfor f in sys.argv[2:]: d.insert_pdf(pymupdf.open(f))\nd.save(sys.argv[1])`, path.join(OUT, 'Gran-Doces-facas-Natal.pdf'), ...pdfs]);
pdfs.forEach(f => fs.rmSync(f));
console.log('✓', PECAS.length, 'facas');

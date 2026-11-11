import { rng, f, suave, svg } from './base.mjs';
// Mapas de cada destino (860 px de largura, a página centraliza e corta as laterais no celular).
// As paradas das lições ficam sempre na faixa central; a página desenha a rota e os botões por cima.
const C = { mar: '#B4D5D8', mar2: '#96C2C9', mar3: '#7FB0BC', terra: '#F2E6CA', terra2: '#E7D7B2', rua: '#FFFBEF', parque: '#BCD08F', parque2: '#86A65C', tinta: '#0B2347', tinta2: '#51607D', verm: '#D7263D', ouro: '#E3A92F', tij: '#B4533A', lj: '#DB4A2B' };
const W = 860;
const tx = (x, y, t, o = {}) => `<text x="${x}" y="${y}" text-anchor="${o.a || 'middle'}" font-family="${o.caixa ? 'Barlow Condensed' : 'Fraunces'}" ${o.caixa ? '' : 'font-style="italic"'} font-weight="${o.p || (o.caixa ? 700 : 500)}" font-size="${o.t || 14}" letter-spacing="${o.ls || (o.caixa ? 2.500 : .300)}" fill="${o.c || C.tinta}" ${o.op ? `opacity="${o.op}"` : ''} ${o.g != null ? `transform="rotate(${o.g} ${x} ${y})"` : ''} ${o.halo === false ? '' : `stroke="${o.halo || C.terra}" stroke-width="3.500" paint-order="stroke" stroke-linejoin="round"`}>${t}</text>`;
function fundo(r, H, terras) {
  let s = `<rect width="${W}" height="${H}" fill="${C.mar}"/>`;
  for (let i = 0; i < H / 4; i++) { const x = r() * W, y = r() * H, w = 12 + r() * 14; s += `<path d="M${f(x)} ${f(y)}q${f(w / 4)}-3.500 ${f(w / 2)} 0t${f(w / 2)} 0" fill="none" stroke="${C.mar3}" stroke-width="1.400" stroke-linecap="round" opacity=".75"/>`; }
  const d = terras.join('');
  s += `<g fill="none" stroke-linejoin="round"><path d="${d}" stroke="${C.mar2}" stroke-width="30" opacity=".55"/><path d="${d}" stroke="#fff" stroke-width="10" opacity=".7"/></g><path d="${d}" fill="${C.terra}"/><clipPath id="t"><path d="${d}"/></clipPath>`;
  return s;
}
const contorno = terras => `<path d="${terras.join('')}" fill="none" stroke="${C.tinta}" stroke-width="2" stroke-linejoin="round"/>`;
const arvores = (r, n, x0, y0, w, h, cores = [C.parque2, '#6E9450']) => Array.from({ length: n }, () => `<circle cx="${f(x0 + r() * w)}" cy="${f(y0 + r() * h)}" r="${f(3 + r() * 2.500)}" fill="${cores[r() * cores.length | 0]}"/>`).join('');
const barco = (x, y, e = 1, cor = '#fff') => `<g transform="translate(${x} ${y}) scale(${e})"><path d="M-9 0h19l-3 4h-13z" fill="${C.tinta}"/><path d="M1-20v18h-9zM3-16v14h7z" fill="${cor}" stroke="${C.tinta}" stroke-width=".800"/></g>`;
const aviao = (x, y, g, t) => `<g transform="translate(${x} ${y})"><circle r="17" fill="${C.rua}" stroke="${C.tinta}" stroke-width="1.600"/><path transform="rotate(${g}) scale(1.150) translate(-12 -12)" fill="${C.tinta}" d="M21 15v-2l-8-5V3.500a1.500 1.500 0 0 0-3 0V8l-8 5v2l8-2.500V18l-2 1.500V21l3.500-1 3.500 1v-1.500L13 18v-5.500z"/></g>` + tx(x, y + 34, t, { caixa: 1, t: 15 });
const faixaTitulo = (x, y, w, t, sub) => `<g transform="translate(${x} ${y})"><path d="M0 0h${w}l-9 19 9 19H0l9-19z" fill="${C.rua}" stroke="${C.tinta}" stroke-width="1.600"/>${tx(w / 2, 17, t, { caixa: 1, t: 15, c: C.verm, halo: false, ls: 3 })}${tx(w / 2, 31, sub, { t: 11.500, halo: false })}</g>`;
const rosinha = (x, y) => `<g transform="translate(${x} ${y})"><circle r="24" fill="${C.mar}" stroke="${C.tinta}" stroke-width="1.300"/>${[0, 90, 180, 270].map(a => `<g transform="rotate(${a})"><path d="M0-21 4 0H0z" fill="${a ? C.tinta : C.verm}"/><path d="M0-21-4 0H0z" fill="${C.rua}" stroke="${C.tinta}" stroke-width=".800"/></g>`).join('')}<text y="-28" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="13" fill="${C.tinta}">N</text></g>`;
const grade = (x0, x1, y0, y1, px, py, g = 0, cx = 430, cy = 400) => { let d = ''; for (let x = x0; x <= x1; x += px) d += `M${x} ${y0}V${y1}`; for (let y = y0; y <= y1; y += py) d += `M${x0} ${y}H${x1}`; return `<path d="${d}" stroke="${C.rua}" stroke-width="2" fill="none" transform="rotate(${g} ${cx} ${cy})"/>`; };
const taxi = (x, y, g = 0) => `<g transform="translate(${x} ${y}) rotate(${g})"><rect x="-7" y="-3.500" width="14" height="7" rx="2" fill="#F5C518" stroke="${C.tinta}" stroke-width="1"/><rect x="-2.500" y="-3.500" width="5" height="7" fill="${C.tinta}" opacity=".7"/></g>`;

export function mapaNyc(glifos) {
  const r = rng(11), H = 820;
  const man = suave([[296, -30], [300, 120], [292, 260], [300, 380], [304, 480], [318, 580], [348, 680], [392, 752], [428, 784], [464, 756], [502, 700], [540, 630], [566, 540], [572, 430], [560, 320], [566, 200], [556, 90], [560, -30]], true);
  const nj = suave([[-30, -30], [150, -30], [162, 150], [140, 330], [152, 520], [120, 640], [60, 716], [-30, 760]], true);
  const bk = suave([[890, -30], [890, 850], [520, 850], [592, 792], [660, 720], [702, 640], [690, 540], [722, 420], [700, 300], [716, 170], [700, 60], [712, -30]], true);
  const ilhas = `M136 730a34 20 0 1 0 68 0a34 20 0 1 0 -68 0zM196 646h26v16h-26zM626 110q10-6 12 8l4 130q-2 12-10 4z`;
  let s = fundo(r, H, [man, nj, bk, ilhas]);
  s += `<g clip-path="url(#t)">` + grade(288, 580, -10, 612, 24, 13) + grade(250, 620, 612, 800, 30, 22, 28, 430, 700) + grade(-20, 170, -20, 800, 40, 40, 12, 70, 400) + grade(690, 880, -20, 840, 44, 36, -18, 780, 400);
  s += `<path d="M372-20 392 200 410 330 440 480 432 700" fill="none" stroke="${C.rua}" stroke-width="5"/><path d="M372-20 392 200 410 330 440 480 432 700" fill="none" stroke="${C.ouro}" stroke-width="1.600" stroke-dasharray="1 7" stroke-linecap="round"/>`;
  // Central Park
  s += `<rect x="372" y="14" width="98" height="196" fill="${C.parque}" stroke="${C.parque2}" stroke-width="1.600"/><ellipse cx="421" cy="150" rx="30" ry="15" fill="${C.mar}" stroke="${C.mar3}" stroke-width="1.200"/><path d="M380 60q30 16 40-10t44 6" fill="none" stroke="${C.rua}" stroke-width="2.400"/>` + arvores(r, 70, 376, 18, 90, 110) + arvores(r, 20, 376, 172, 90, 32);
  s += `<rect x="330" y="560" width="26" height="20" fill="${C.parque}"/><rect x="494" y="470" width="22" height="24" fill="${C.parque}"/>` + arvores(r, 6, 496, 472, 18, 20) + `</g>`;
  // píeres
  for (let y = 286; y < 560; y += 22) s += `<rect x="${f(274 + (y - 286) * .05)}" y="${y}" width="24" height="7" fill="${C.terra2}" stroke="${C.tinta}" stroke-width="1"/>`;
  for (let y = 600; y < 700; y += 24) s += `<rect x="${f(548 - (y - 600) * .55)}" y="${y}" width="22" height="6" fill="${C.terra2}" stroke="${C.tinta}" stroke-width="1" transform="rotate(-24 ${f(548 - (y - 600) * .55)} ${y})"/>`;
  s += contorno([man, nj, bk, ilhas]);
  // pontes
  const ponte = (x0, y0, x1, y1, e, cor = C.tinta) => `<path d="M${x0} ${y0}L${x1} ${y1}" stroke="${C.rua}" stroke-width="${e + 4}"/><path d="M${x0} ${y0}L${x1} ${y1}" stroke="${cor}" stroke-width="${e}"/>` + [.33, .67].map(t => `<rect x="${f(x0 + (x1 - x0) * t - 4)}" y="${f(y0 + (y1 - y0) * t - 6)}" width="8" height="12" fill="${cor}" stroke="${C.rua}" stroke-width="1.200"/>`).join('');
  s += ponte(553, 598, 704, 560, 5, '#7A5C4D') + ponte(566, 532, 694, 506, 3) + ponte(562, 152, 712, 142, 3) + ponte(300, 96, 156, 84, 3.500);
  // prédios em miniatura
  const empire = (x, y) => `<g transform="translate(${x} ${y})"><path d="M-9 0v-30h3v-10h3v-8h2v-12h2v12h2v8h3v10h3v30z" fill="${C.tinta}"/><path d="M-5-4v-22M0-4v-30M5-4v-22" stroke="${C.ouro}" stroke-width="1.300"/><circle cy="-62" r="1.800" fill="${C.verm}"/></g>`;
  const chrysler = (x, y) => `<g transform="translate(${x} ${y})"><path d="M-7 0v-26q0-14 7-30 7 16 7 30v26z" fill="${C.tinta2}"/><path d="M-4-28q4-8 8 0M-3-36q3-6 6 0" fill="none" stroke="${C.rua}" stroke-width="1.300"/></g>`;
  const wtc = (x, y) => `<g transform="translate(${x} ${y})"><path d="M-8 0v-34l5-14h6l5 14v34z" fill="${C.tinta}"/><path d="M-3-48 0 0 3-48z" fill="${C.mar2}"/><path d="M0-48v-14" stroke="${C.tinta}" stroke-width="1.600"/></g>`;
  const flatiron = (x, y) => `<g transform="translate(${x} ${y})"><path d="M0 0-13-10V-36L0-30l8-4v26z" fill="${C.terra2}" stroke="${C.tinta}" stroke-width="1.400"/><path d="M0 0v-30M-9-13v-18M-4.500-9v-21M4-6v-24" stroke="${C.tinta}" stroke-width=".900"/></g>`;
  s += empire(528, 392) + chrysler(546, 318) + wtc(488, 680) + flatiron(356, 474);
  s += `<path d="M388 300l3.500 8 8.500 1-6.500 5.500 2 8.500-7.500-4.500-7.500 4.500 2-8.500-6.500-5.500 8.500-1z" fill="${C.verm}" stroke="${C.rua}" stroke-width="1.200"/>`;
  for (const [x, y, g] of [[324, 232, 90], [348, 404, 90], [516, 286, 0], [396, 536, 90], [468, 566, 0], [540, 452, 90], [324, 148, 90], [500, 124, 90], [444, 626, 28], [372, 612, 28]]) s += taxi(x, y, g);
  // Estátua da Liberdade, balsa e rota
  s += `<use href="#g-liberty" x="144" y="668" width="52" height="52" color="#3F8F7D"/><path d="M424 778Q330 800 208 742" fill="none" stroke="${C.tinta}" stroke-width="1.500" stroke-dasharray="5 6"/>`;
  s += `<g transform="translate(306 772) rotate(12)"><path d="M-20 0h40l-6 8h-28z" fill="${C.tinta}"/><rect x="-14" y="-9" width="28" height="9" fill="#F08A24" stroke="${C.tinta}" stroke-width="1"/><rect x="-8" y="-15" width="16" height="6" fill="#F08A24" stroke="${C.tinta}" stroke-width="1"/></g>`;
  s += barco(214, 440, 1.100) + barco(236, 180, .900) + barco(640, 330, .900) + barco(626, 660, 1) + `<g transform="translate(204 300)"><path d="M-14 0h28l-4 7h-20z" fill="${C.verm}"/><rect x="-8" y="-8" width="12" height="8" fill="${C.rua}" stroke="${C.tinta}" stroke-width="1"/><rect x="-2" y="-15" width="4" height="7" fill="${C.tinta}"/></g>`;
  // rótulos
  s += tx(230, 560, 'Hudson River', { g: -90, t: 17, c: '#4F8794', halo: C.mar }) + tx(636, 430, 'East River', { g: 90, t: 16, c: '#4F8794', halo: C.mar }) + tx(74, 380, 'NEW JERSEY', { caixa: 1, g: -90, t: 17, op: .5 }) + tx(790, 640, 'BROOKLYN', { caixa: 1, t: 17, op: .5 }) + tx(792, 240, 'QUEENS', { caixa: 1, t: 17, op: .5 });
  s += tx(421, 204, 'Central Park', { t: 12.500, c: '#3F6B2E', halo: C.parque }) + tx(340, 312, 'Times Sq', { t: 13 }) + tx(528, 408, 'Empire State', { t: 12 }) + tx(650, 596, 'Brooklyn Bridge', { t: 12.500, g: -14, halo: C.mar }) + tx(170, 768, 'Statue of Liberty', { t: 12.500, halo: C.mar }) + tx(488, 696, 'One WTC', { t: 12 }) + tx(410, 262, 'Broadway', { t: 11.500, g: 81, c: C.tinta2 }) + tx(356, 490, 'Flatiron', { t: 12 });
  s += aviao(796, 730, 40, 'JFK') + rosinha(790, 68);
  return { nome: 'mapa-nyc', w: W, h: H, esc: 2, q: 82, svg: svg(W, H, s, glifos) };
}

export function mapaSf(glifos) {
  const r = rng(12), H = 700;
  const sf = suave([[288, 730], [290, 560], [286, 400], [290, 250], [296, 150], [312, 104], [336, 84], [380, 92], [430, 82], [480, 76], [530, 70], [566, 78], [590, 104], [596, 160], [604, 240], [598, 330], [612, 420], [604, 520], [620, 600], [612, 730]], true);
  const marin = suave([[-30, -30], [370, -30], [344, 20], [300, 38], [240, 30], [180, 50], [100, 40], [-30, 70]], true);
  const leste = suave([[890, -30], [890, 730], [790, 730], [770, 560], [790, 400], [772, 250], [800, 100], [780, -30]], true);
  const ilhas = `M498 30q8-10 24-8t22 10q-8 8-24 8t-22-10zM600-10q30-14 56 6-20 22-56-6zM684 196q14-10 24 2l-4 22q-14 6-20-4z`;
  let s = fundo(r, H, [sf, marin, leste, ilhas]);
  s += `<g clip-path="url(#t)">` + grade(270, 630, 70, 720, 20, 20) + grade(770, 880, -20, 720, 34, 34, 20, 820, 350) + `<path d="M606 232 388 486" stroke="${C.rua}" stroke-width="6"/><path d="M606 232 388 486" stroke="${C.ouro}" stroke-width="1.600" stroke-dasharray="1 7" stroke-linecap="round"/>`;
  // parques
  s += `<rect x="286" y="318" width="158" height="30" fill="${C.parque}" stroke="${C.parque2}" stroke-width="1.400"/>` + arvores(r, 44, 290, 321, 150, 24) + `<path d="${suave([[296, 100], [344, 88], [404, 96], [416, 140], [372, 168], [310, 160]], true)}" fill="${C.parque}" stroke="${C.parque2}" stroke-width="1.400"/>` + arvores(r, 34, 304, 102, 100, 56);
  s += `<rect x="462" y="344" width="26" height="22" fill="${C.parque}"/><rect x="340" y="610" width="60" height="40" fill="${C.parque}"/>` + arvores(r, 12, 342, 612, 56, 36);
  // Twin Peaks em curvas de nível
  for (const k of [1, .68, .38]) s += `<path d="${suave([[352 - 44 * k, 524], [352 - 20 * k, 524 - 34 * k], [352 + 30 * k, 524 - 28 * k], [352 + 46 * k, 524 + 4 * k], [352 + 18 * k, 524 + 32 * k], [352 - 26 * k, 524 + 28 * k]], true)}" fill="${k < .5 ? C.terra2 : 'none'}" stroke="#B89B6A" stroke-width="1.500"/>`;
  s += `</g>`;
  for (let y = 108; y < 232; y += 15) s += `<rect x="${f(593 + (y - 108) * .08)}" y="${y}" width="22" height="6" fill="${C.terra2}" stroke="${C.tinta}" stroke-width="1"/>`;
  for (let x = 470; x < 560; x += 18) s += `<rect x="${x}" y="52" width="6" height="22" fill="${C.terra2}" stroke="${C.tinta}" stroke-width="1"/>`;
  s += contorno([sf, marin, leste, ilhas]);
  // Golden Gate e Bay Bridge
  s += `<path d="M334 88 316 28" stroke="${C.rua}" stroke-width="10"/><path d="M334 88 316 28" stroke="${C.lj}" stroke-width="5.500"/><circle cx="328" cy="68" r="5" fill="${C.rua}" stroke="${C.lj}" stroke-width="2.400"/><circle cx="321" cy="45" r="5" fill="${C.rua}" stroke="${C.lj}" stroke-width="2.400"/>`;
  s += `<path d="M604 236 692 208 776 236" fill="none" stroke="${C.rua}" stroke-width="8"/><path d="M604 236 692 208 776 236" fill="none" stroke="${C.tinta2}" stroke-width="4"/>`;
  // bondinho, Lombard, casinhas, Transamerica
  s += `<path d="M530 84V306" stroke="${C.tinta}" stroke-width="1.800"/>` + Array.from({ length: 14 }, (_, i) => `<path d="M526 ${92 + i * 16}h8" stroke="${C.tinta}" stroke-width="1.400"/>`).join('') + `<g transform="translate(530 262)"><rect x="-8" y="-12" width="16" height="24" rx="2" fill="${C.verm}" stroke="${C.tinta}" stroke-width="1.200"/><rect x="-5" y="-8" width="10" height="16" fill="${C.ouro}"/></g>`;
  s += `<path d="M474 128l8 5-8 5 8 5-8 5 8 5-8 5" fill="none" stroke="${C.rua}" stroke-width="6" stroke-linejoin="round"/><path d="M474 128l8 5-8 5 8 5-8 5 8 5-8 5" fill="none" stroke="${C.tij}" stroke-width="2.400" stroke-linejoin="round"/>`;
  ['#F6D88F', '#BCDDBF', '#F3ABA2', '#A5CDE6'].forEach((c, i) => { const x = 496 + i * 15, y = 356 - i * 2; s += `<path d="M${x} ${y}v-16l7-9 7 9v16z" fill="${c}" stroke="${C.tinta}" stroke-width="1.200"/><rect x="${x + 4.500}" y="${y - 8}" width="5" height="8" fill="${C.tinta}" opacity=".7"/>`; });
  s += `<g transform="translate(566 190)"><path d="M-8 0 0-46 8 0z" fill="${C.tinta}"/><path d="M-4-14h8M-5.500-7h11" stroke="${C.rua}" stroke-width="1.200"/></g>`;
  s += `<path d="M508 22v-12h5v12zM516 22v-7h10v7z" fill="${C.tinta}"/>` + barco(680, 90, 1) + barco(736, 330, 1.150, C.ouro) + barco(660, 470, .900) + barco(450, 44, .800) + barco(700, 610, 1);
  s += `<g transform="translate(150 280)" fill="${C.tinta}"><path d="M0 0q-16-4-22-22 10 4 22 10 12-6 22-10-6 18-22 22z"/><path d="M-1 0q-2 10 1 18h3q-3-8-1-18z"/></g>`;
  // neblina vinda do Pacífico
  for (const [x, y, w] of [[20, 120, 230], [-30, 170, 300], [90, 214, 200], [20, 520, 220], [-40, 580, 280]]) s += `<path d="M${x} ${y}q${w * .12}-16 ${w * .26}-4q${w * .1}-20 ${w * .3}-2q${w * .16}-14 ${w * .3} 4q${w * .1} 2 ${w * .14} 12H${x}z" fill="#fff" opacity=".78"/>`;
  s += tx(190, 420, 'Pacific Ocean', { g: -90, t: 18, c: '#4F8794', halo: C.mar }) + tx(712, 520, 'San Francisco Bay', { g: 90, t: 17, c: '#4F8794', halo: C.mar }) + tx(244, 94, 'Golden Gate', { t: 14, c: C.lj, halo: C.mar, p: 700 }) + tx(520, 52, 'Alcatraz', { t: 12, halo: C.mar, a: 'start' }).replace('x="520"', 'x="548"') + tx(366, 338, 'Golden Gate Park', { t: 11.500, c: '#3F6B2E', halo: C.parque });
  s += tx(352, 574, 'Twin Peaks', { t: 12 }) + tx(452, 150, 'Lombard St', { t: 11.500, a: 'end' }) + tx(540, 386, 'Painted Ladies', { t: 12 }) + tx(572, 138, 'Transamerica', { t: 11.500 }) + tx(700, 196, 'Bay Bridge', { t: 12, halo: C.mar }) + tx(344, 134, 'Presidio', { t: 12, c: '#3F6B2E', halo: C.parque }) + tx(560, 300, 'cable car', { t: 11, a: 'start' }).replace('x="560"', 'x="540"');
  s += tx(832, 330, 'OAKLAND', { caixa: 1, g: 90, t: 16, op: .5 }) + tx(120, 22, 'MARIN', { caixa: 1, t: 16, op: .5 }) + tx(450, 470, 'MISSION', { caixa: 1, t: 13, op: .4 });
  s += aviao(704, 636, 150, 'SFO') + rosinha(72, 640);
  return { nome: 'mapa-sf', w: W, h: H, esc: 2, q: 82, svg: svg(W, H, s, glifos) };
}

export function mapaBoston(glifos) {
  const r = rng(13), H = 550;
  const cima = [[-30, 300], [120, 268], [240, 230], [360, 236], [480, 222], [600, 214], [720, 220], [800, 244], [890, 270]], baixo = [[-30, 352], [120, 322], [240, 286], [360, 296], [480, 300], [600, 312], [720, 334], [790, 372], [824, 430], [830, 580]];
  const norte = suave([[-30, -30], ...cima, [890, -30]]) + 'Z', sul = suave([[-30, 580], ...baixo]) + 'Z';
  let s = fundo(r, H, [norte, sul]) + `<clipPath id="tn"><path d="${norte}"/></clipPath><clipPath id="ts"><path d="${sul}"/></clipPath>`;
  s += `<g clip-path="url(#tn)">${grade(-140, 1000, -140, 500, 26, 26, -14, 430, 120)}</g><g clip-path="url(#ts)">${grade(-140, 1000, 180, 700, 22, 22, 8, 430, 420)}</g><g clip-path="url(#t)">`;
  // campus: pátio com prédios de tijolo em volta
  s += `<rect x="352" y="44" width="156" height="128" fill="${C.parque}" stroke="${C.parque2}" stroke-width="1.400" transform="rotate(-4 430 108)"/><path d="M360 60 500 156M360 156 500 60M430 46v124" stroke="${C.rua}" stroke-width="2" transform="rotate(-4 430 108)"/>`;
  for (const [x, y, w, h] of [[344, 34, 48, 13], [404, 30, 52, 13], [468, 34, 46, 13], [336, 56, 13, 46], [336, 112, 13, 50], [512, 54, 13, 44], [512, 108, 13, 52], [350, 170, 50, 13], [412, 174, 44, 13], [468, 170, 46, 13], [548, 70, 40, 16], [548, 100, 16, 40], [280, 80, 34, 14], [280, 106, 14, 40]]) s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${C.tij}" stroke="${C.tinta}" stroke-width="1" transform="rotate(-4 430 108)"/>`;
  const outono = ['#B5382B', '#D95B34', '#EE8A3C', '#F0A23B', '#8C9A4A'];
  s += arvores(r, 30, 360, 52, 140, 112, outono);
  // margens verdes, Public Garden, Common, Fenway
  s += `<path d="${suave(baixo.map(([x, y]) => [x, y + 9]))}" fill="none" stroke="${C.parque}" stroke-width="16"/><path d="${suave(cima.slice(0, 6).map(([x, y]) => [x, y - 8]))}" fill="none" stroke="${C.parque}" stroke-width="12"/>`;
  for (let i = 0; i < 46; i++) { const t = r() * (baixo.length - 2), k = t | 0, u = t - k; const x = baixo[k][0] + (baixo[k + 1][0] - baixo[k][0]) * u, y = baixo[k][1] + (baixo[k + 1][1] - baixo[k][1]) * u + 8 + r() * 6; s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(3 + r() * 2)}" fill="${outono[r() * 5 | 0]}"/>`; }
  s += `<rect x="604" y="384" width="56" height="70" fill="${C.parque}" stroke="${C.parque2}" stroke-width="1.400" transform="rotate(8 632 420)"/><path d="${suave([[618, 404], [640, 398], [648, 420], [634, 440], [616, 430]], true)}" fill="${C.mar}" stroke="${C.mar3}" stroke-width="1.200"/><path d="M628 420q4-8 9-2l-3 6h-8z" fill="#fff" stroke="${C.tinta}" stroke-width=".900"/>`;
  s += `<path d="M672 380 738 372 752 430 706 468 668 452z" fill="${C.parque}" stroke="${C.parque2}" stroke-width="1.400"/>` + arvores(r, 26, 676, 384, 62, 66, outono) + arvores(r, 10, 606, 388, 12, 62, outono);
  s += `<g transform="translate(196 452) rotate(20)"><rect x="-30" y="-30" width="60" height="60" rx="8" fill="${C.tij}" stroke="${C.tinta}" stroke-width="1.400"/><path d="M0 22-22 0 0-22 22 0z" fill="${C.parque}" stroke="${C.rua}" stroke-width="1.400"/><path d="M0 12-10 2 0-8 10 2z" fill="#D9B77E"/></g>`;
  s += `</g>` + contorno([norte, sul]);
  // pontes
  const ponte = (x0, y0, x1, y1, e, cor, torres) => `<path d="M${x0} ${y0}L${x1} ${y1}" stroke="${C.rua}" stroke-width="${e + 4}" stroke-linecap="round"/><path d="M${x0} ${y0}L${x1} ${y1}" stroke="${cor}" stroke-width="${e}"/>` + (torres ? [.3, .7].map(t => `<circle cx="${f(x0 + (x1 - x0) * t)}" cy="${f(y0 + (y1 - y0) * t)}" r="5" fill="${C.rua}" stroke="${C.tinta}" stroke-width="1.400"/>`).join('') : '');
  s += ponte(498, 216, 514, 306, 7, '#8C8F98') + ponte(232, 226, 252, 292, 5, C.tij) + ponte(708, 214, 736, 344, 6, '#8C8F98', 1) + ponte(96, 270, 108, 328, 4, C.tij);
  // remo, veleiros
  const remo = (x, y, g) => `<g transform="translate(${x} ${y}) rotate(${g})"><path d="M-26 0h52" stroke="${C.tinta}" stroke-width="2.600" stroke-linecap="round"/>${[-18, -9, 0, 9, 18].map((k, i) => `<path d="M${k} 0l${i % 2 ? -3 : 3} ${i % 2 ? -9 : 9}" stroke="${C.verm}" stroke-width="1.400"/>`).join('')}<path d="M-40 0h10M30 0h12" stroke="#fff" stroke-width="1.400" stroke-linecap="round" opacity=".9"/></g>`;
  s += remo(366, 266, 2) + remo(620, 262, 6) + barco(770, 300, 1) + barco(676, 276, .850) + barco(820, 352, 1.100, C.ouro) + barco(170, 296, .800);
  // miniaturas
  s += `<g transform="translate(636 188)"><rect x="-18" y="-10" width="36" height="12" fill="${C.rua}" stroke="${C.tinta}" stroke-width="1.200"/><path d="M-10-10a10 9 0 0 1 20 0z" fill="${C.rua}" stroke="${C.tinta}" stroke-width="1.200"/>${[-13, -7, 7, 13].map(k => `<path d="M${k}-9v10" stroke="${C.tinta}" stroke-width="1"/>`).join('')}</g>`;
  s += `<g transform="translate(318 426)"><path d="M-8 0v-40h16v40z" fill="${C.tinta}"/><path d="M0-40v-12" stroke="${C.tinta}" stroke-width="1.600"/><path d="M-4-6v-28M0-6v-28M4-6v-28" stroke="${C.mar2}" stroke-width="1"/></g>`;
  s += `<g transform="translate(540 392)"><path d="M-5 0v-52l10-5v57z" fill="${C.mar3}" stroke="${C.tinta}" stroke-width="1.200"/></g>`;
  s += `<path d="M750 360a8 8 0 0 1 16 0z" fill="${C.ouro}" stroke="${C.tinta}" stroke-width="1.200"/><rect x="747" y="360" width="22" height="9" fill="${C.rua}" stroke="${C.tinta}" stroke-width="1.200"/>`;
  s += `<path d="M720 430 756 372 778 330 800 290" fill="none" stroke="${C.verm}" stroke-width="2.400" stroke-dasharray="2 6" stroke-linecap="round"/>`;
  s += `<circle cx="318" cy="158" r="9" fill="${C.rua}" stroke="${C.tinta}" stroke-width="1.600"/><text x="318" y="162.500" text-anchor="middle" font-family="Barlow Condensed" font-weight="800" font-size="12" fill="${C.tinta}">T</text>`;
  s += tx(300, 262, 'Charles River', { t: 16, c: '#4F8794', halo: C.mar, g: -5 }) + tx(140, 150, 'CAMBRIDGE', { caixa: 1, t: 18, op: .5 }) + tx(120, 520, 'BOSTON', { caixa: 1, t: 18, op: .5 }) + tx(300, 180, 'Harvard Sq', { t: 12, a: 'end' }).replace('x="300"', 'x="304"') + tx(636, 206, 'MIT', { caixa: 1, t: 13 }) + tx(196, 506, 'Fenway Park', { t: 12.500 }) + tx(318, 442, 'Prudential', { t: 11.500 }) + tx(632, 474, 'Public Garden', { t: 11.500, c: '#3F6B2E' }) + tx(716, 484, 'Boston Common', { t: 11.500, c: '#3F6B2E' }) + tx(540, 410, 'Back Bay', { t: 12 }) + tx(762, 352, 'State House', { t: 11, a: 'start' }).replace('x="762"', 'x="774"') + tx(848, 500, 'Harbor', { t: 13, c: '#4F8794', halo: C.mar, g: 90 });
  s += aviao(796, 132, 60, 'BOS') + rosinha(70, 440);
  return { nome: 'mapa-boston', w: W, h: H, esc: 2, q: 82, svg: svg(W, H, s, glifos) };
}

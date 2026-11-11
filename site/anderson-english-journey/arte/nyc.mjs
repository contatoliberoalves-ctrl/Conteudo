import { rng, f, suave, onda, faixa, reflexos, pessoa, svg } from './base.mjs';
// Nova York na hora azul, vista do porto: Estátua da Liberdade, Lower Manhattan com o One World Trade Center,
// Empire State e Chrysler ao fundo, Ponte do Brooklyn e um calçadão com postes acesos.
export function liberdade(x, y, s, C) {
  const raios = Array.from({ length: 7 }, (_, i) => { const a = (-150 + i * 20) * Math.PI / 180; return `M${f(Math.cos(a) * 6)} ${f(-107 + Math.sin(a) * 6)}L${f(Math.cos(a) * 17)} ${f(-107 + Math.sin(a) * 17)}`; }).join('');
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M-104 122h208l-16-22h-176z" fill="${C.pedra2}"/><path d="M-88 100h176v-8h-176z" fill="${C.pedra}"/>
    <path d="M-34 100h68l-7-66h-54z" fill="${C.pedra}"/><path d="M0 100h34l-7-66h-27z" fill="${C.pedra2}"/><path d="M-30 34h60l-3-8h-54zM-24 26h48v-26h-48z" fill="${C.pedra}"/><path d="M0 26h24v-26h-24z" fill="${C.pedra2}"/>
    <path d="M-12 100v-20a5 5 0 0 1 10 0v20zM3 100v-20a5 5 0 0 1 10 0v20z" fill="${C.breu}" opacity=".55"/><path d="M-18 22v-14h5v14zM-6 22v-14h5v14zM6 22v-14h5v14z" fill="${C.breu}" opacity=".35"/>
    <path d="M-22 0-18-50-15-78-12-92-5-97h10l7 5 4 14 3 28 5 50z" fill="${C.cobre}"/><path d="M2 0 4-97h1l7 5 4 14 3 28 5 50z" fill="${C.cobre2}"/>
    <path d="M-14-70q8 30 2 68M-6-80q9 40 4 78M10-70q2 36 8 68" fill="none" stroke="${C.cobre3}" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M-11-90-20-136" stroke="${C.cobre}" stroke-width="8" stroke-linecap="round"/><path d="M-23-150h6l-1 16h-4zM-27-151h14l-2 5h-10z" fill="${C.cobre}"/>
    <path d="M-20-152c-7-7-4-14 1-19 0 6 6 8 5 14-1 4-3 5-6 5z" fill="${C.luz}"/>
    <path d="M7-86l14 5-5 24-14-5z" fill="${C.cobre2}"/><circle cx="0" cy="-104" r="7.5" fill="${C.cobre}"/><path d="${raios}" stroke="${C.cobre}" stroke-width="2.6" stroke-linecap="round"/><path d="M-8-108h16" stroke="${C.cobre2}" stroke-width="3"/></g>`;
}
function janelas(r, x, y, w, h, cor, dens = .34, px = 5, py = 8, jw = 2.4, jh = 4) { let s = ''; for (let yy = y + 6; yy < y + h - 5; yy += py) for (let xx = x + 3.5; xx < x + w - 3; xx += px) if (r() < dens) s += `<rect x="${f(xx)}" y="${f(yy)}" width="${jw}" height="${jh}" fill="${cor}" opacity="${f(.55 + r() * .45)}"/>`; return s; }
export function nyc() {
  const r = rng(21); const W = 1600, H = 640, B = 446;
  const C = { n1: '#141C3A', n2: '#1F2B52', n3: '#34407A', n4: '#5E4F8C', n5: '#B3628A', n6: '#EE8C5F', n7: '#F9C783', longe: '#59649E', meio: '#2B3566', perto: '#101833', breu: '#0A1026', luz: '#FFD36A', luz2: '#FFF0C2', agua: '#152048', agua2: '#1E2D62', cobre: '#7CC4AC', cobre2: '#4F9E8C', cobre3: '#3D8273', pedra: '#C9B091', pedra2: '#96806C' };
  let s = `<rect width="${W}" height="${H}" fill="${C.n1}"/>`;
  s += faixa(86, 8, 560, 0, B, C.n2) + faixa(168, 8, 640, 200, B, C.n3) + faixa(246, 7, 520, 90, B, C.n4) + faixa(318, 6, 600, 300, B, C.n5) + faixa(372, 5, 500, 40, B, C.n6) + faixa(414, 4, 700, 0, B, C.n7);
  for (let i = 0; i < 60; i++) { const y = r() * 210; s += `<circle cx="${f(r() * W)}" cy="${f(y)}" r="${f(.7 + r() * 1.3)}" fill="#fff" opacity="${f((.9 - y / 260) * (.4 + r() * .6))}"/>`; }
  s += `<circle cx="1290" cy="92" r="30" fill="${C.luz2}"/><circle cx="1302" cy="84" r="27" fill="${C.n1}"/>`;
  const tira = (x, y, w, h, cor, op) => `<path d="M${x} ${y}q${w * .2} ${-h} ${w * .45} ${-h * .3}q${w * .2} ${-h * .9} ${w * .55} ${h * .3}q${-w * .3} ${h * .6} ${-w} 0z" fill="${cor}" opacity="${op}"/>`;
  s += tira(360, 300, 360, 16, C.n6, .55) + tira(900, 250, 300, 14, C.n5, .6) + tira(1150, 340, 380, 16, C.n7, .5) + tira(60, 220, 260, 12, C.n4, .7);
  // ao fundo: Midtown com Empire State e Chrysler
  let fundo = ''; for (let x = 330; x < 1240;) { const w = 18 + r() * 34, h = 50 + r() * 120; fundo += `<rect x="${f(x)}" y="${f(B - h)}" width="${f(w)}" height="${f(h)}"/>`; if (r() < .3) fundo += `<rect x="${f(x + w * .3)}" y="${f(B - h - 14)}" width="${f(w * .4)}" height="14"/>`; x += w - 2 + r() * 6; }
  fundo += `<path d="M836 ${B}V250h8v-34h9v-30h7v-30h5v-52h3v52h5v30h7v30h9v34h8v${B - 250}z"/>`; // Empire State
  fundo += `<path d="M1010 ${B}V280h10v-26l6-24 7-22 5-20 2-58 2 58 5 20 7 22 6 24v26h10v${B - 280}z"/>`; // Chrysler
  fundo += `<rect x="930" y="186" width="22" height="${B - 186}"/><path d="M700 ${B}V236l26-22v${B - 214}z"/><rect x="1108" y="232" width="34" height="${B - 232}"/><path d="M1108 232l17-20 17 20z"/>`;
  s += `<g fill="${C.longe}">${fundo}</g>`;
  s += `<g fill="${C.luz2}" opacity=".7">${[[1041, 198], [1041, 210], [1037, 222], [1045, 222], [1041, 234]].map(([x, y]) => `<path d="M${x - 3} ${y + 5}l3-7 3 7z"/>`).join('')}</g>`;
  s += janelas(r, 836, 250, 62, 190, C.luz, .22, 6, 9, 2, 3) + janelas(r, 1010, 280, 62, 160, C.luz, .2, 6, 9, 2, 3) + janelas(r, 330, 330, 900, 110, C.luz2, .07, 7, 10, 2, 3);
  s += faixa(404, 4, 500, 130, B, C.n6, 'opacity=".28"');
  // plano médio
  let meio = '', jm = ''; for (let x = 380; x < 1120;) { const w = 26 + r() * 40, h = 80 + r() * 150; meio += `<rect x="${f(x)}" y="${f(B - h)}" width="${f(w)}" height="${f(h)}"/>`; if (r() < .35) meio += `<rect x="${f(x + 4)}" y="${f(B - h - 10)}" width="${f(w - 8)}" height="10"/><rect x="${f(x + w / 2 - 1)}" y="${f(B - h - 34)}" width="2" height="24"/>`; jm += janelas(r, x, B - h, w, h, C.luz, .3); x += w + r() * 5; }
  s += `<g fill="${C.meio}">${meio}</g>${jm}`;
  // One World Trade Center
  s += `<path d="M588 ${B}V188l20-58h24l20 58v${B - 188}z" fill="${C.meio}"/><path d="M608 130l12 316 12-316z" fill="#3C4A86"/><path d="M588 188l20-58 12 316h-32z" fill="#232C5A"/><rect x="618.5" y="62" width="3" height="70" fill="${C.meio}"/><circle cx="620" cy="60" r="3" fill="#FF6B6B"/>`;
  s += janelas(r, 590, 200, 60, 240, C.luz, .2, 5, 9, 2, 4);
  // primeiro plano de prédios com caixas-d'água
  let perto = '', jp = ''; for (let x = 420; x < 1110;) { const w = 34 + r() * 46, h = 40 + r() * 96; perto += `<rect x="${f(x)}" y="${f(B - h)}" width="${f(w)}" height="${f(h + 4)}"/>`; if (r() < .42) { const tx = x + 8 + r() * (w - 26); perto += `<path d="M${f(tx)} ${f(B - h - 8)}h12v-12l-6-6-6 6zM${f(tx + 1)} ${f(B - h)}v-8M${f(tx + 11)} ${f(B - h)}v-8" stroke="${C.perto}" stroke-width="1.6"/>`; } jp += janelas(r, x, B - h, w, h, C.luz, .36, 6, 9, 2.8, 4.4) + janelas(r, x, B - h, w, h, '#FF9E6B', .05, 6, 9, 2.8, 4.4); x += w + 1 + r() * 4; }
  s += `<g fill="${C.perto}">${perto}</g>${jp}`;
  // água
  s += `<rect y="${B}" width="${W}" height="${H - B}" fill="${C.agua}"/>` + faixa(B + 46, 4, 420, 0, H, C.agua2, 'opacity=".55"') + faixa(B + 104, 5, 520, 200, H, C.breu, 'opacity=".35"');
  s += reflexos(r, 90, 400, 1130, B + 2, B + 120, C.luz, .8, 6, 26, 1.8) + reflexos(r, 40, 300, 1300, B + 2, B + 60, C.n7, .7, 20, 90, 2) + reflexos(r, 46, 0, 1600, B + 20, B + 140, '#3A4C8E', .7, 18, 70, 2) + reflexos(r, 14, 590, 650, B + 4, B + 110, '#3C4A86', .9, 20, 44, 3);
  // Ponte do Brooklyn
  const torre = x => `<path d="M${x - 30} ${B + 6}V226h60v${B - 220}z" fill="#3A3760"/><path d="M${x} 226v${B - 220}h30V226z" fill="#2B2950" opacity=".6"/><path d="M${x - 33} 226h66v-8h-66zM${x - 33} 262h66v5h-66z" fill="#4A477A"/><path d="M${x - 21} ${B - 58}V306q9-36 18 0v${B - 58 - 306}zM${x + 3} ${B - 58}V306q9-36 18 0v${B - 58 - 306}z" fill="${C.n6}"/>`;
  const cabo = (x0, x1, y0, ym) => `M${x0} ${y0}Q${(x0 + x1) / 2} ${ym * 2 - y0} ${x1} ${y0}`;
  let ponte = `<path d="M1000 ${B - 52}Q1320 ${B - 66} 1640 ${B - 52}v10Q1320 ${B - 56} 1000 ${B - 42}z" fill="#2B2950"/>`;
  let fios = ''; for (let x = 1012; x < 1640; x += 9) { let yc; if (x < 1190) { const t = (x - 1000) / 190; yc = B - 52 - t * t * (B - 52 - 232); } else if (x < 1500) { const t = (x - 1190) / 310; yc = 232 + 4 * t * (1 - t) * 132; } else { const t = (1640 - x) / 140; yc = B - 100 - t * t * (B - 100 - 232); } fios += `M${x} ${f(yc)}V${B - 54}`; }
  ponte += `<path d="${fios}" stroke="#4A477A" stroke-width="1"/>`;
  for (const tx of [1190, 1500]) for (let k = 1; k <= 7; k++) for (const d of [-1, 1]) ponte += `<path d="M${tx} 234L${tx + d * k * 19} ${B - 54}" stroke="#4A477A" stroke-width=".8" opacity=".8"/>`;
  ponte += `<path d="M1000 ${B - 52}Q1130 ${B - 60} 1190 232M1190 232Q1345 496 1500 232M1500 232Q1560 ${B - 80} 1640 ${B - 110}" fill="none" stroke="#56538A" stroke-width="3"/>`;
  for (let i = 0; i <= 14; i++) { const t = i / 14, x = 1190 + 310 * t, y = 232 + 4 * t * (1 - t) * 132; ponte += `<circle cx="${f(x)}" cy="${f(y)}" r="2" fill="${C.luz2}"/>`; }
  s += ponte + torre(1190) + torre(1500) + `<path d="M980 ${B + 4}h60l-8-62h-44z" fill="#2B2950"/>`;
  // ilha e estátua
  s += `<path d="M60 ${B + 10}q20-22 70-24h250q50 4 66 24z" fill="${C.perto}"/>`;
  for (let i = 0; i < 9; i++) { const x = 84 + i * 40 + r() * 12; if (x > 200 && x < 330) continue; s += `<circle cx="${f(x)}" cy="${f(B - 20 - r() * 6)}" r="${f(11 + r() * 7)}" fill="#1B2A4A"/>`; }
  s += `<circle cx="239" cy="96" r="50" fill="${C.luz}" opacity=".14"/><circle cx="239" cy="96" r="26" fill="${C.luz}" opacity=".22"/>` + liberdade(264, B - 152, 1.26, C);
  s += reflexos(r, 12, 230, 300, B + 14, B + 90, C.cobre2, .5, 16, 40, 2.4) + reflexos(r, 6, 228, 250, B + 12, B + 70, C.luz, .7, 8, 20, 2);
  // calçadão com grade e postes
  s += `<rect y="584" width="${W}" height="56" fill="${C.breu}"/><path d="M0 566h${W}" stroke="${C.breu}" stroke-width="5"/>`;
  for (let x = 6; x < W; x += 16) s += `<rect x="${x}" y="566" width="2.4" height="20" fill="${C.breu}"/>`;
  s += `<path d="M0 612h${W}" stroke="#2C3766" stroke-width="2.5" stroke-dasharray="26 22"/>`;
  for (const x of [150, 700, 1250]) s += `<circle cx="${x}" cy="494" r="42" fill="${C.luz}" opacity=".14"/><circle cx="${x}" cy="494" r="20" fill="${C.luz}" opacity=".25"/><path d="M${x - 3} 586V510h6v76zM${x - 8} 586h16v-6h-16z" fill="${C.breu}"/><path d="M${x - 9} 506h18l-4-18h-10z" fill="${C.luz2}"/><path d="M${x - 11} 488h22l-11-10z" fill="${C.breu}"/>`;
  s += pessoa(820, 586, 46, C.breu) + pessoa(842, 586, 42, C.breu) + pessoa(1362, 586, 44, C.breu, 1);
  s += `<g transform="translate(1030 586)" fill="${C.breu}"><rect x="-38" y="-16" width="76" height="5" rx="2"/><path d="M-32-11v11M32-11v11M-38-28h76v5h-76z"/></g>`;
  return { nome: 'nyc', w: W, h: H, esc: 1.25, svg: svg(W, H, s) };
}

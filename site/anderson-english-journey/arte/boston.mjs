import { rng, f, suave, onda, faixa, reflexos, pessoa, veleiro, svg } from './base.mjs';
// Boston e Cambridge numa tarde de outono: o Charles River com veleiros, a ponte de arcos, o skyline de Boston
// ao fundo e um campus de tijolos com a torre de cúpula entre árvores vermelhas e douradas.
export function copa(r, x, y, R, tons, n = 16) { let s = ''; for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * R * .72; const cx = x + Math.cos(a) * d * 1.15, cy = y + Math.sin(a) * d * .8; s += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R * (.3 + r() * .22))}" fill="${tons[i < n * .45 ? 0 : i < n * .8 ? 1 : 2]}"/>`; } return s; }
function arvore(r, x, y, alt, R, tons, tronco) { return `<path d="M${x} ${y}q-4-${alt * .5} 0-${alt}M${x}-0" stroke="${tronco}" stroke-width="${f(R * .14)}" stroke-linecap="round" fill="none"/><path d="M${x} ${y - alt * .62}q-${R * .3}-${R * .2}-${R * .5}-${R * .5}M${x} ${y - alt * .5}q${R * .3}-${R * .25} ${R * .55}-${R * .5}" stroke="${tronco}" stroke-width="${f(R * .07)}" fill="none" stroke-linecap="round"/>` + copa(r, x, y - alt - R * .25, R, tons); }
export function boston() {
  const r = rng(90); const W = 1600, H = 640, B = 404;
  const C = { s1: '#A9CFD3', s2: '#C9DDD0', s3: '#E8E4C4', s4: '#F8DDA4', s5: '#F6C97F', sol: '#FFF6D6', l1: '#9DB4C6', l2: '#7C97B2', agua: '#4A8CA3', agua2: '#6BA6B5', agua3: '#356F88', tij: '#A9442F', tij2: '#853322', tij3: '#C25A3F', creme: '#FBF3DE', telha: '#46505E', gr1: '#8FA552', gr2: '#6C8840', gr3: '#4E6B34', breu: '#2B2230', tronco: '#4A2F2A', o1: ['#B5382B', '#D95B34', '#EE8A3C'], o2: ['#D9772B', '#F0A23B', '#F7C95C'], o3: ['#8C2A2A', '#B5382B', '#D95B34'], o4: ['#7E8F3F', '#A3B04E', '#D4C55A'] };
  let s = `<rect width="${W}" height="${H}" fill="${C.s1}"/>`;
  s += faixa(96, 8, 640, 0, B, C.s2) + faixa(184, 7, 520, 240, B, C.s3) + faixa(262, 6, 600, 60, B, C.s4) + faixa(334, 5, 700, 300, B, C.s5);
  s += `<circle cx="330" cy="150" r="96" fill="${C.sol}" opacity=".35"/><circle cx="330" cy="150" r="62" fill="${C.sol}"/>`;
  const tira = (x, y, w, h, cor, op) => `<path d="M${x} ${y}q${w * .2} ${-h} ${w * .45} ${-h * .3}q${w * .2} ${-h * .9} ${w * .55} ${h * .3}q${-w * .3} ${h * .6} ${-w} 0z" fill="${cor}" opacity="${op}"/>`;
  s += tira(560, 110, 360, 20, '#fff', .7) + tira(1060, 170, 300, 16, '#fff', .6) + tira(100, 260, 280, 14, '#fff', .5) + tira(1300, 80, 260, 16, '#fff', .55);
  // skyline de Boston
  let sk = ''; for (let x = 420; x < 1320;) { const w = 22 + r() * 34, h = 30 + r() * 80; sk += `<rect x="${f(x)}" y="${f(B - 20 - h)}" width="${f(w)}" height="${f(h + 20)}"/>`; x += w + r() * 8; }
  sk += `<path d="M700 ${B}V168l34-14v${B - 154}z"/>`; // Hancock
  sk += `<rect x="820" y="206" width="58" height="${B - 206}"/><rect x="832" y="194" width="34" height="14"/><rect x="847" y="150" width="3" height="46"/>`; // Prudential
  sk += `<path d="M1010 ${B}V270h34v${B - 270}zM1014 270v-40h26v40zM1016 230l11-34 11 34z"/><rect x="1026" y="184" width="2" height="14"/>`; // Custom House
  sk += `<rect x="930" y="250" width="40" height="${B - 250}"/><path d="M1130 ${B}V248h30l10 12v${B - 260}z"/>`;
  s += `<g fill="${C.l1}">${sk}</g>`;
  s += `<g fill="${C.creme}" opacity=".55">${Array.from({ length: 70 }, () => { const x = 700 + r() * 440, y = 180 + r() * 190; return (x > 700 && x < 734 && y > 170) || (x > 820 && x < 878 && y > 210) || (x > 1010 && x < 1044 && y > 274) ? `<rect x="${f(x)}" y="${f(y)}" width="2" height="4"/>` : ''; }).join('')}</g>`;
  // State House com cúpula dourada e ponte Zakim
  s += `<g><rect x="560" y="${B - 62}" width="74" height="44" fill="${C.l2}"/><path d="M574 ${B - 62}a23 23 0 0 1 46 0z" fill="#E3A92F"/><rect x="595" y="${B - 96}" width="4" height="12" fill="#E3A92F"/><path d="M566 ${B - 62}h62" stroke="${C.creme}" stroke-width="3"/></g>`;
  s += `<g stroke="${C.l2}" fill="none"><path d="M1400 ${B - 16}L1420 250l20 ${B - 266}M1520 ${B - 16}l14-120 14 120" stroke-width="5"/>${Array.from({ length: 9 }, (_, i) => `<path d="M1420 258L${1330 + i * 11} ${B - 34}M1420 258L${1510 - i * 9} ${B - 34}" stroke-width="1"/>`).join('')}<path d="M1300 ${B - 32}h320" stroke-width="5"/></g>`;
  s += faixa(376, 4, 500, 80, B, C.s5, 'opacity=".4"');
  // margem distante com árvores
  s += `<path d="${suave(onda(B - 14, 3, 400, 0))}L1620 ${B + 4}L-20 ${B + 4}Z" fill="${C.gr2}"/>`;
  const todas = [C.o1, C.o2, C.o3, C.o4]; for (let x = -10; x < 1620; x += 26 + r() * 20) s += copa(r, x, B - 26 - r() * 10, 17 + r() * 10, todas[r() * 4 | 0], 7);
  // rio
  s += `<rect y="${B}" width="${W}" height="150" fill="${C.agua}"/>` + faixa(B + 40, 3, 360, 0, 560, C.agua3, 'opacity=".35"') + faixa(B + 90, 4, 460, 200, 560, C.agua3, 'opacity=".4"');
  s += reflexos(r, 60, 0, 1600, B + 3, B + 40, '#D9772B', .55, 16, 70, 2.4) + reflexos(r, 70, 0, 1600, B + 20, B + 140, C.agua2, .9, 16, 80, 2.2) + reflexos(r, 22, 240, 430, B + 6, B + 120, C.sol, .7, 12, 60, 2.4);
  // ponte de arcos
  const px = 250, pw = 520, py = B - 30; let arcos = ''; for (let i = 0; i < 3; i++) { const ax = px + 40 + i * 152, aw = 136; arcos += `M${ax} ${B + 6}V${py + 26}a${aw / 2} 34 0 0 1 ${aw} 0V${B + 6}z`; }
  s += `<path d="M${px - 30} ${B + 6}V${py + 6}Q${px + pw / 2} ${py - 18} ${px + pw + 30} ${py + 6}V${B + 6}z" fill="${C.tij}"/><path d="${arcos}" fill="${C.agua3}"/><path d="${arcos}" fill="none" stroke="${C.creme}" stroke-width="3.500"/><path d="M${px - 30} ${py + 6}Q${px + pw / 2} ${py - 18} ${px + pw + 30} ${py + 6}" fill="none" stroke="${C.creme}" stroke-width="5"/>`;
  for (let i = 0; i <= 12; i++) { const t = i / 12, x = px - 20 + t * (pw + 40), y = py + 6 - Math.sin(t * Math.PI) * 12; s += `<rect x="${f(x)}" y="${f(y - 12)}" width="2.5" height="11" fill="${C.breu}"/>`; }
  s += `<path d="M${px - 30} ${py - 5}Q${px + pw / 2} ${py - 29} ${px + pw + 30} ${py - 5}" fill="none" stroke="${C.breu}" stroke-width="2"/>` + pessoa(430, py - 8, 22, C.breu) + pessoa(600, py - 7, 20, C.tij2, 1);
  s += reflexos(r, 30, px, px + pw, B + 8, B + 46, C.tij, .5, 20, 60, 2.6);
  s += veleiro(900, B + 44, 1, C.creme, '#FFFFFF') + veleiro(1010, B + 30, .75, C.creme, '#FFFFFF') + veleiro(140, B + 60, 1.1, '#B5382B', '#FFFFFF') + veleiro(1210, B + 70, 1.2, C.creme, '#F7C95C');
  // patos
  for (const [x, y] of [[820, B + 104], [842, B + 108], [860, B + 104], [878, B + 109]]) s += `<path d="M${x} ${y}q6-6 12 0zM${x + 10} ${y - 2}l4-4 2 3z" fill="${C.creme}"/><path d="M${x - 4} ${y + 2}h18" stroke="${C.agua2}" stroke-width="1.5"/>`;
  // gramado da margem próxima
  s += `<path d="${suave([[-20, 548], [200, 536], [500, 546], [800, 534], [1100, 544], [1620, 528]])}L1620 650L-20 650Z" fill="${C.gr1}"/><path d="${suave([[-20, 600], [300, 586], [700, 604], [1100, 590], [1620, 606]])}L1620 650L-20 650Z" fill="${C.gr2}"/>`;
  s += `<path d="${suave([[-20, 590], [240, 568], [520, 578], [820, 562], [1040, 566]])}" fill="none" stroke="#EAD8AE" stroke-width="16" stroke-linecap="round"/>`;
  // prédio do campus com torre
  const bx = 1010, bw = 520, bt = 428, by = 574;
  s += `<path d="M${bx - 14} ${bt}l26-44h${bw - 24}l26 44z" fill="${C.telha}"/><rect x="${bx}" y="${bt}" width="${bw}" height="${by - bt}" fill="${C.tij}"/><rect x="${bx + bw * .5}" y="${bt}" width="${bw * .5}" height="${by - bt}" fill="${C.tij2}" opacity=".35"/>`;
  for (let i = 0; i < 60; i++) s += `<rect x="${f(bx + r() * (bw - 14))}" y="${f(bt + 4 + r() * (by - bt - 10))}" width="12" height="3" fill="${r() < .5 ? C.tij3 : C.tij2}" opacity=".55"/>`;
  for (const cx of [bx + 60, bx + bw - 76]) s += `<rect x="${cx}" y="${bt - 62}" width="18" height="34" fill="${C.tij2}"/><rect x="${cx - 3}" y="${bt - 66}" width="24" height="6" fill="${C.creme}"/>`;
  for (let row = 0; row < 3; row++) for (let k = 0; k < 13; k++) { const jx = bx + 18 + k * 38, jy = bt + 14 + row * 46; if (k >= 5 && k <= 7) continue; s += `<rect x="${jx}" y="${jy}" width="20" height="30" fill="${C.creme}"/><rect x="${jx + 2.500}" y="${jy + 2.500}" width="15" height="25" fill="${r() < .25 ? '#F7C95C' : '#33475B'}"/><path d="M${jx + 10} ${jy + 2}v26M${jx + 2} ${jy + 15}h16" stroke="${C.creme}" stroke-width="1.6"/>`; }
  for (const dx of [bx + 100, bx + 250, bx + 400]) if (dx !== bx + 250) s += `<path d="M${dx - 13} ${bt - 6}l13-22 13 22z" fill="${C.telha}"/><rect x="${dx - 8}" y="${bt - 20}" width="16" height="16" fill="${C.creme}"/><rect x="${dx - 5.500}" y="${bt - 17.500}" width="11" height="12" fill="#33475B"/>`;
  // pórtico central e torre
  const m = bx + bw / 2;
  s += `<rect x="${m - 62}" y="${bt - 6}" width="124" height="${by - bt + 6}" fill="${C.tij3}"/><path d="M${m - 72} ${bt - 4}L${m} ${bt - 52}L${m + 72} ${bt - 4}z" fill="${C.creme}"/><path d="M${m - 54} ${bt - 10}L${m} ${bt - 44}L${m + 54} ${bt - 10}z" fill="${C.tij3}"/><circle cx="${m}" cy="${bt - 24}" r="8" fill="${C.creme}"/>`;
  for (let k = 0; k < 4; k++) s += `<rect x="${m - 52 + k * 32}" y="${bt + 2}" width="9" height="${by - bt - 2}" fill="${C.creme}"/>`;
  s += `<path d="M${m - 14} ${by}v-54a14 14 0 0 1 28 0v54z" fill="${C.breu}"/><rect x="${m - 70}" y="${bt - 4}" width="140" height="7" fill="${C.creme}"/>`;
  s += `<rect x="${m - 34}" y="${bt - 128}" width="68" height="84" fill="${C.tij}"/><rect x="${m}" y="${bt - 128}" width="34" height="84" fill="${C.tij2}" opacity=".4"/><circle cx="${m}" cy="${bt - 96}" r="15" fill="${C.creme}"/><circle cx="${m}" cy="${bt - 96}" r="11.500" fill="#33475B"/><path d="M${m} ${bt - 96}v-8M${m} ${bt - 96}l6 3" stroke="${C.creme}" stroke-width="2" stroke-linecap="round"/><rect x="${m - 40}" y="${bt - 134}" width="80" height="8" fill="${C.creme}"/>`;
  s += `<rect x="${m - 26}" y="${bt - 194}" width="52" height="60" fill="${C.creme}"/><rect x="${m}" y="${bt - 194}" width="26" height="60" fill="#E3D6B6"/>`;
  for (const k of [-16, 0, 16]) s += `<path d="M${m + k - 5} ${bt - 140}v-36a5 5 0 0 1 10 0v36z" fill="#33475B"/>`;
  s += `<rect x="${m - 31}" y="${bt - 200}" width="62" height="7" fill="${C.creme}"/><path d="M${m - 26} ${bt - 200}q0-44 26-52 26 8 26 52z" fill="#1E4E8C"/><path d="M${m} ${bt - 252}q26 8 26 52h-12q0-34-14-52z" fill="#143A6E"/><rect x="${m - 1.500}" y="${bt - 286}" width="3" height="36" fill="#E3A92F"/><circle cx="${m}" cy="${bt - 258}" r="5" fill="#E3A92F"/><path d="M${m - 12} ${bt - 282}h20l-5-4 5-4h-20z" fill="#E3A92F"/>`;
  // hera, arbustos e segundo prédio à esquerda
  for (let i = 0; i < 12; i++) s += `<circle cx="${f(bx + 6 + r() * 50)}" cy="${f(by - 6 - r() * 90)}" r="${f(6 + r() * 7)}" fill="${r() < .5 ? '#B5382B' : '#7E8F3F'}"/>`;
  for (let x = bx - 6; x < bx + bw + 10; x += 30) if (Math.abs(x - m) > 60) s += `<ellipse cx="${x}" cy="${by + 2}" rx="20" ry="12" fill="${C.gr3}"/>`;
  s += `<path d="M-20 430l60-36h150l40 36z" fill="${C.telha}"/><rect x="-20" y="430" width="230" height="130" fill="${C.tij}"/>`;
  for (let row = 0; row < 2; row++) for (let k = 0; k < 5; k++) { const jx = 4 + k * 40, jy = 448 + row * 50; s += `<rect x="${jx}" y="${jy}" width="20" height="30" fill="${C.creme}"/><rect x="${jx + 2.500}" y="${jy + 2.500}" width="15" height="25" fill="#33475B"/><path d="M${jx + 10} ${jy + 2}v26" stroke="${C.creme}" stroke-width="1.6"/>`; }
  for (let i = 0; i < 16; i++) s += `<circle cx="${f(150 + r() * 62)}" cy="${f(552 - r() * 110)}" r="${f(6 + r() * 8)}" fill="${['#B5382B', '#D95B34', '#7E8F3F'][r() * 3 | 0]}"/>`;
  // árvores, banco, poste e gente
  s += arvore(r, 930, 570, 110, 62, C.o2, C.tronco) + arvore(r, 1560, 590, 150, 84, C.o1, C.tronco) + arvore(r, 330, 606, 190, 104, C.o3, C.tronco) + arvore(r, 760, 560, 80, 44, C.o1, C.tronco) + arvore(r, 560, 566, 70, 40, C.o4, C.tronco);
  for (let i = 0; i < 46; i++) { const x = r() * W, y = 560 + r() * 76; s += `<path d="M${f(x)} ${f(y)}l5-3 2 5-5 2z" fill="${['#B5382B', '#EE8A3C', '#F7C95C', '#D95B34'][r() * 4 | 0]}"/>`; }
  s += `<g transform="translate(640 590)"><path d="M-3 0v-64h6v64z" fill="${C.breu}"/><circle cx="0" cy="-72" r="10" fill="${C.sol}"/><path d="M-8-64h16" stroke="${C.breu}" stroke-width="4"/></g>`;
  s += `<g transform="translate(1080 606)" fill="${C.breu}"><rect x="-34" y="-14" width="68" height="5" rx="2"/><path d="M-28-9v11M28-9v11M-34-26h68v5h-68z"/></g>`;
  s += pessoa(1180, 600, 44, C.breu) + pessoa(1204, 602, 40, '#1E4E8C', 1) + pessoa(880, 588, 34, C.breu, 1);
  // estudante lendo sob a árvore
  s += `<g transform="translate(396 616)"><path d="M0 0q16-20 34-2" fill="none" stroke="#1E4E8C" stroke-width="9" stroke-linecap="round"/><path d="M2-2v-24" stroke="${C.breu}" stroke-width="11" stroke-linecap="round"/><circle cx="3" cy="-37" r="7" fill="${C.breu}"/><path d="M10-20l12 4 10-6v-8l-10 6-12-4z" fill="${C.creme}"/></g>`;
  // ciclista
  s += `<g transform="translate(1340 606)" fill="none" stroke="${C.breu}" stroke-width="3" stroke-linecap="round"><circle cx="-22" cy="0" r="13"/><circle cx="24" cy="0" r="13"/><path d="M-22 0-8-22h22l10 22M-8-22 4 0h-26M14-22l-3-9h8"/><path d="M-6-28v-18" stroke="#B5382B" stroke-width="9"/><circle cx="-6" cy="-53" r="5" fill="${C.breu}" stroke="none"/><path d="M-6-42 12-30" stroke="#B5382B" stroke-width="4"/></g>`;
  return { nome: 'boston', w: W, h: H, esc: 1.25, svg: svg(W, H, s) };
}

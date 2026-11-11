import { rng, f, crista, poli, suave, onda, faixa, reflexos, pessoa, veleiro, svg } from './base.mjs';
// San Francisco de manhã: a Golden Gate saindo da neblina, Alcatraz na baía, as Painted Ladies numa encosta
// com a Transamerica ao fundo e uma ladeira com os trilhos do bondinho.
function nevoa(r, y, alt, cor, op, x0 = -40, x1 = 1640) {
  // banco de neblina: topo em gomos, pontas afinadas e base que se desfaz (degradê #nv)
  const pts = []; let x = x0; while (x < x1) { pts.push(x); x += 46 + r() * 80; } pts.push(x1);
  const yDe = xx => { const t = (xx - x0) / (x1 - x0); const borda = Math.min(x0 > 0 ? t : 1, x1 < 1600 ? 1 - t : 1); return y + alt * Math.pow(1 - Math.min(1, borda * 3.5), 2); };
  let d = `M${x0} ${y + alt}L${x0} ${f(yDe(x0))}`; for (let i = 1; i < pts.length; i++) { const w = pts[i] - pts[i - 1], h = 8 + r() * alt * .42; d += `Q${f(pts[i - 1] + w / 2)} ${f(Math.min(yDe(pts[i - 1]), yDe(pts[i])) - h * 2)} ${f(pts[i])} ${f(yDe(pts[i]))}`; }
  return `<path d="${d}L${x1} ${y + alt}Z" fill="url(#${cor})" opacity="${op}"/>`;
}
function casa(x, y, w, h, cor, cor2, C) {
  const t = y - h * .62, m = x + w / 2; const jan = (jx, jy, jw, jh) => `<rect x="${f(jx)}" y="${f(jy)}" width="${f(jw)}" height="${f(jh)}" fill="#FFFDF6"/><rect x="${f(jx + 2)}" y="${f(jy + 2)}" width="${f(jw - 4)}" height="${f(jh - 4)}" fill="${C.vidro}"/><path d="M${f(jx + 2)} ${f(jy + jh / 2)}h${f(jw - 4)}" stroke="#FFFDF6" stroke-width="1.6"/>`;
  let s = `<rect x="${x}" y="${f(t)}" width="${w}" height="${f(y - t)}" fill="${cor}"/><rect x="${f(x + w * .56)}" y="${f(t)}" width="${f(w * .44)}" height="${f(y - t)}" fill="${cor2}" opacity=".45"/>`;
  s += `<path d="M${x - 5} ${f(t)}L${m} ${f(t - h * .4)}L${x + w + 5} ${f(t)}z" fill="${cor}"/><path d="M${x - 5} ${f(t)}L${m} ${f(t - h * .4)}L${x + w + 5} ${f(t)}" fill="none" stroke="#FFFDF6" stroke-width="5" stroke-linejoin="miter"/><path d="M${x - 8} ${f(t + 2)}L${m} ${f(t - h * .4 - 4)}L${x + w + 8} ${f(t + 2)}" fill="none" stroke="${C.telha}" stroke-width="4"/>`;
  s += `<circle cx="${m}" cy="${f(t - h * .14)}" r="${f(w * .09)}" fill="#FFFDF6"/><circle cx="${m}" cy="${f(t - h * .14)}" r="${f(w * .055)}" fill="${C.vidro}"/><path d="M${x} ${f(t)}h${w}" stroke="#FFFDF6" stroke-width="4"/><path d="M${x} ${f(t + h * .3)}h${w}" stroke="#FFFDF6" stroke-width="3"/>`;
  // bay window em dois andares
  const bx = x + w * .07, bw = w * .44; s += `<path d="M${f(bx)} ${f(y)}V${f(t + 8)}l${f(bw * .5)}-7 ${f(bw * .5)} 7V${f(y)}z" fill="${cor}"/><path d="M${f(bx)} ${f(t + 8)}l${f(bw * .5)}-7 ${f(bw * .5)} 7" fill="none" stroke="#FFFDF6" stroke-width="3"/>`;
  for (const jy of [t + 16, t + h * .34]) for (let k = 0; k < 3; k++) s += jan(bx + 3 + k * (bw - 6) / 3, jy, (bw - 6) / 3 - 2, h * .19);
  s += jan(x + w * .64, t + 16, w * .24, h * .19);
  // porta com alpendre e escada
  const px = x + w * .6, pw = w * .32; s += `<rect x="${f(px)}" y="${f(t + h * .34)}" width="${f(pw)}" height="${f(y - t - h * .34)}" fill="${cor2}"/><path d="M${f(px - 3)} ${f(t + h * .34)}h${f(pw + 6)}l-${f(pw / 2 + 3)}-${f(h * .07)}z" fill="#FFFDF6"/><rect x="${f(px + pw * .28)}" y="${f(t + h * .39)}" width="${f(pw * .44)}" height="${f(h * .16)}" fill="${C.porta}"/><path d="M${f(px + 2)} ${f(t + h * .35)}V${f(y - h * .06)}M${f(px + pw - 2)} ${f(t + h * .35)}V${f(y - h * .06)}" stroke="#FFFDF6" stroke-width="3"/>`;
  for (let k = 0; k < 4; k++) s += `<rect x="${f(px - k * 2)}" y="${f(y - h * .07 + k * h * .018)}" width="${f(pw + k * 4)}" height="${f(h * .018)}" fill="${k % 2 ? '#D8CDB8' : '#F2E9D6'}"/>`;
  return s;
}
export function sf() {
  const r = rng(44); const W = 1600, H = 640, B = 436;
  const C = { s1: '#8FC0CF', s2: '#B2D6DA', s3: '#D5E5DC', s4: '#F1E8D0', s5: '#FBE3C0', sol: '#FFF8DE', m1: '#A6C3BE', m2: '#7FA7A4', m3: '#5A8A88', agua: '#3E8798', agua2: '#5BA2AD', agua3: '#2F6E80', lj: '#DB4A2B', lj2: '#A93320', breu: '#1F2E3A', v1: '#5F8F5B', v2: '#3E6E4C', v3: '#2C5340', vidro: '#3B566F', telha: '#4A5568', porta: '#8C2F39' };
  let s = `<rect width="${W}" height="${H}" fill="${C.s1}"/>`;
  s += faixa(100, 8, 620, 100, B, C.s2) + faixa(190, 7, 540, 300, B, C.s3) + faixa(276, 6, 660, 0, B, C.s4) + faixa(350, 5, 520, 200, B, C.s5);
  s += `<circle cx="1180" cy="112" r="88" fill="${C.sol}" opacity=".35"/><circle cx="1180" cy="112" r="56" fill="${C.sol}"/>`;
  // colinas de Marin e do outro lado da baía
  s += `<path d="${poli(crista([[-20, 330], [140, 296], [300, 320], [430, 290], [560, 330], [700, 368], [860, 392], [1000, 404], [1200, 410], [1620, 396]], r, 8), B)}" fill="${C.m1}"/>`;
  s += `<path d="${poli(crista([[-20, 372], [90, 340], [210, 352], [330, 330], [450, 362], [580, 402], [700, 428], [760, 440]], r, 7), B + 6)}" fill="${C.m2}"/>`;
  for (let i = 0; i < 16; i++) { const x = r() * 520, y = 366 + r() * 50; s += `<path d="M${f(x)} ${f(y)}q9-8 20 0" fill="none" stroke="${C.m3}" stroke-width="2.6" stroke-linecap="round" opacity=".7"/>`; }
  // centro com a Transamerica
  let centro = `<path d="M1310 ${B}L1332 236l22 ${B - 236}z"/><path d="M1320 330h-9v40h9zM1344 330h9v40h-9z"/><path d="M1420 ${B}V286q14-34 28 0v${B - 286}z"/>`;
  for (let x = 1150; x < 1600;) { const w = 20 + r() * 30, h = 40 + r() * 90; centro += `<rect x="${f(x)}" y="${f(B - h)}" width="${f(w)}" height="${f(h)}"/>`; x += w + r() * 6; }
  s += `<g fill="#8FB0BF">${centro}</g>` + nevoa(r, 392, 50, 'nv', .6, 1080, 1700);
  // água
  s += `<rect y="${B}" width="${W}" height="${H - B}" fill="${C.agua}"/>` + faixa(B + 40, 4, 380, 0, H, C.agua3, 'opacity=".35"') + faixa(B + 110, 5, 520, 160, H, C.agua3, 'opacity=".4"');
  s += reflexos(r, 80, 0, 1600, B + 4, 640, C.agua2, .9, 16, 80, 2.2) + reflexos(r, 30, 880, 1500, B + 4, B + 120, '#FFFFFF', .7, 10, 50, 2);
  // Alcatraz
  s += `<g fill="${C.m3}"><path d="M1196 ${B + 4}q10-22 46-26h88q34 4 48 26z"/><rect x="1236" y="${B - 40}" width="92" height="20"/><rect x="1250" y="${B - 50}" width="40" height="12"/><path d="M1344 ${B - 22}v-46h7v46z"/><path d="M1341 ${B - 68}h13l-6.500-10z"/><rect x="1210" y="${B - 30}" width="14" height="12"/></g><circle cx="1347.500" cy="${B - 66}" r="3" fill="${C.sol}"/>`;
  s += veleiro(900, B + 40, .9, '#FFFDF6', '#FFFDF6') + veleiro(1090, B + 86, 1.3, C.lj, '#FFFDF6') + veleiro(760, B + 120, 1.1, '#FFFDF6', '#FBE3C0') + veleiro(1440, B + 30, .7, '#FFFDF6', '#FFFDF6');
  // Golden Gate
  const DK = 352; const tx = [500, 1040];
  const yCabo = x => { if (x < tx[0]) { const t = (x + 40) / (tx[0] + 40); return 318 - t * t * (318 - 100) - Math.sin(t * Math.PI) * 6; } if (x < tx[1]) { const t = (x - tx[0]) / (tx[1] - tx[0]); return 100 + 4 * t * (1 - t) * 236; } const t = (1640 - x) / (1640 - tx[1]); return 310 - t * t * (310 - 100); };
  let fios = ''; for (let x = -16; x < 1640; x += 11) if (Math.abs(x - tx[0]) > 20 && Math.abs(x - tx[1]) > 20) fios += `M${x} ${f(yCabo(x))}V${DK}`;
  let cabo = ''; for (let x = -40; x <= 1640; x += 10) cabo += `${x === -40 ? 'M' : 'L'}${x} ${f(yCabo(x))}`;
  let trel = ''; for (let x = -20; x < 1640; x += 14) trel += `M${x} ${DK + 3}l7 11 7-11`;
  const torre = x => { let t = `<path d="M${x - 30} ${B + 4}V${DK + 8}h60v${B - DK - 4}z" fill="${C.lj2}"/><path d="M${x - 36} ${B + 8}h72l-6-30h-60z" fill="#E9DCC3"/><path d="M${x} ${B + 8}h36l-6-30h-30z" fill="#CDBFA6"/>`;
    t += `<path d="M${x - 30} ${B - 20}V250h4V176h3V100h10v76h3v74h4v${B - 270}z" fill="${C.lj}"/><path d="M${x + 6} ${B - 20}V250h4V176h3V100h10v76h3v74h4v${B - 270}z" fill="${C.lj}"/><path d="M${x - 16} ${B - 20}V100h3v${B - 120}zM${x + 20} ${B - 20}V100h3v${B - 120}z" fill="${C.lj2}"/>`;
    for (const [y, h] of [[108, 20], [166, 18], [234, 20], [300, 20]]) t += `<rect x="${x - 14}" y="${y}" width="28" height="${h}" fill="${C.lj}"/><rect x="${x - 10}" y="${y + 5}" width="20" height="${h - 9}" fill="${C.lj2}"/>`;
    return t + `<path d="M${x - 28} 100h20v-6h-20zM${x + 8} 100h20v-6h-20z" fill="${C.lj2}"/><circle cx="${x}" cy="88" r="2.600" fill="#fff"/>`; };
  s += `<path d="${fios}" stroke="${C.lj}" stroke-width="1.5" opacity=".85"/><path d="${cabo}" fill="none" stroke="${C.lj}" stroke-width="5"/>`;
  s += `<rect x="-20" y="${DK}" width="1660" height="6" fill="${C.lj}"/><path d="${trel}" fill="none" stroke="${C.lj2}" stroke-width="1.8"/><rect x="-20" y="${DK + 13}" width="1660" height="3" fill="${C.lj2}"/>`;
  s += torre(tx[0]) + torre(tx[1]);
  // neblina
  s += nevoa(r, 300, 70, 'nv', .75, -40, 420) + nevoa(r, 356, 110, 'nv', .92, -40, 800) + nevoa(r, 384, 96, 'nv2', .96, 150, 1010) + nevoa(r, 322, 70, 'nv', .7, 800, 1260) + nevoa(r, 410, 80, 'nv', .97, -40, 660);
  // encosta das Painted Ladies
  const enc = [[900, 650], [960, 590], [1040, 556], [1160, 536], [1300, 516], [1460, 500], [1620, 486]];
  s += `<path d="${suave(enc)}L1620 650Z" fill="${C.v1}"/>`;
  const cores = [['#F6D88F', '#D9A441'], ['#BCDDBf', '#6FA98A'], ['#F3ABA2', '#C96A6A'], ['#A5CDE6', '#5E8FB5'], ['#FAF0DA', '#C9B48A']];
  cores.forEach(([c, c2], i) => { s += casa(1056 + i * 104, 548 - i * 10, 96, 196, c, c2, C); });
  s += `<path d="${suave([[880, 660], [960, 606], [1050, 574], [1180, 556], [1320, 540], [1470, 526], [1620, 514]])}L1620 660Z" fill="${C.v2}"/>`;
  for (let i = 0; i < 40; i++) { const x = 980 + r() * 620, y = 580 + r() * 50; s += `<path d="M${f(x)} ${f(y)}l3-9 3 9" fill="none" stroke="${C.v1}" stroke-width="2" stroke-linecap="round"/>`; }
  s += pessoa(1250, 600, 34, C.breu) + pessoa(1270, 602, 30, C.porta, 1) + `<path d="M1390 606q16-12 34 0" fill="none" stroke="#F3ABA2" stroke-width="7" stroke-linecap="round"/><circle cx="1396" cy="590" r="5" fill="${C.breu}"/><path d="M1396 596v10" stroke="${C.breu}" stroke-width="7" stroke-linecap="round"/>`;
  // ladeira com trilhos do bondinho e ciprestes
  s += `<path d="M-20 430L520 650H-20z" fill="${C.v3}"/><path d="M-20 446L480 650H-20z" fill="#5B6270"/><path d="M-20 470l400 164M-20 494l340 140" stroke="#C9CED6" stroke-width="2.4" fill="none"/><path d="M-20 482l370 152" stroke="#3E4450" stroke-width="2" stroke-dasharray="3 12" fill="none"/><path d="M-20 446L480 650" stroke="#E9DCC3" stroke-width="5" fill="none"/>`;
  const cipreste = (x, y, e) => `<g transform="translate(${x} ${y}) scale(${e})"><path d="M0 0q-6-50 4-92" stroke="${C.breu}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-70-96q20-30 62-26 46-18 86 10 20 14-6 22-30-12-58-2-44-14-84-4z" fill="${C.v3}"/><path d="M-40-70q24-18 50-8 30-10 48 6-28-4-50 6-22-10-48-4z" fill="${C.v3}"/><path d="M-60-98q22-24 56-20" fill="none" stroke="${C.v1}" stroke-width="4" stroke-linecap="round"/></g>`;
  s += cipreste(70, 450, 1.5) + cipreste(210, 512, 1.1);
  // gaivotas
  for (const [x, y, e] of [[700, 150, 1], [745, 172, .8], [660, 184, .7], [300, 110, .9], [1420, 210, .8]]) s += `<path d="M${x - 15 * e} ${y}q${8 * e} ${-9 * e} ${15 * e} 0q${7 * e} ${-9 * e} ${15 * e} 0" fill="none" stroke="#fff" stroke-width="${3 * e}" stroke-linecap="round"/>`;
  return { nome: 'sf', w: W, h: H, esc: 1.25, svg: svg(W, H, s, '<linearGradient id="nv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><linearGradient id="nv2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EEF3EF"/><stop offset=".5" stop-color="#F6F8F4"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>') };
}

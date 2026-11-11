// Utilidades das ilustrações (todas desenhadas por código, sem imagem de terceiros).
export const rng = seed => () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
export const f = n => Math.round(n * 10) / 10;
// crista de montanha: linha quebrada suave entre x0 e x1 a partir de pontos-âncora [x, y]
export function crista(pts, r, rug = 6, passo = 14) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1]; const n = Math.max(1, Math.round(Math.abs(x1 - x0) / passo));
    for (let k = 0; k < n; k++) { const t = k / n; const e = t * t * (3 - 2 * t); out.push([x0 + (x1 - x0) * t, y0 + (y1 - y0) * e + (k ? (r() - .5) * rug : 0)]); }
  }
  out.push(pts[pts.length - 1]); return out;
}
export const poli = (pts, base) => `M${pts.map(p => `${f(p[0])} ${f(p[1])}`).join('L')}${base != null ? `L${f(pts[pts.length - 1][0])} ${base}L${f(pts[0][0])} ${base}Z` : ''}`;
// linha suave (Catmull-Rom → Bézier)
export function suave(pts, fecha = false) {
  const P = fecha ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M${f(P[1][0])} ${f(P[1][1])}`;
  for (let i = 1; i < P.length - 2; i++) { const [p0, p1, p2, p3] = [P[i - 1], P[i], P[i + 1], P[i + 2]]; d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`; }
  return d + (fecha ? 'Z' : '');
}
// faixa ondulada horizontal (borda de cima ondulada), para céu em faixas, água e neblina
export function onda(y, amp, comp, fase, x0 = -20, x1 = 1620, passo = 20) { const p = []; for (let x = x0; x <= x1; x += passo) p.push([x, y + Math.sin((x + fase) / comp * Math.PI * 2) * amp]); return p; }
export const faixa = (y, amp, comp, fase, base, cor, extra = '') => `<path d="${suave(onda(y, amp, comp, fase))}L1620 ${base}L-20 ${base}Z" fill="${cor}" ${extra}/>`;
// tracinhos de reflexo na água
export function reflexos(r, n, x0, x1, y0, y1, cor, op = .8, wmin = 10, wmax = 60, esp = 2) {
  let s = ''; for (let i = 0; i < n; i++) { const t = r(); const y = y0 + (y1 - y0) * t; const w = (wmin + r() * (wmax - wmin)) * (.5 + t); const x = x0 + r() * (x1 - x0) - w / 2; s += `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(esp * (.7 + t))}" rx="${esp}" fill="${cor}" opacity="${f(op * (.5 + r() * .5))}"/>`; } return s;
}
export function pessoa(x, y, h, cor, pose = 0) {
  const u = h / 40; const perna = pose === 1 ? `M${x - 2 * u} ${y - 16 * u}l${-5 * u} ${16 * u}M${x + 2 * u} ${y - 16 * u}l${6 * u} ${16 * u}` : `M${x - 2 * u} ${y - 16 * u}v${16 * u}M${x + 2.5 * u} ${y - 16 * u}v${16 * u}`;
  return `<g stroke="${cor}" stroke-linecap="round" fill="none"><path d="${perna}" stroke-width="${f(3.4 * u)}"/><path d="M${x} ${y - 30 * u}v${13 * u}" stroke-width="${f(8 * u)}"/><circle cx="${x}" cy="${f(y - 36.5 * u)}" r="${f(3.6 * u)}" fill="${cor}" stroke="none"/></g>`;
}
export function veleiro(x, y, s, casco = '#fff', vela = '#fff', sombra = '#00000030') {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-14 0h30l-5 6h-20z" fill="${casco}"/><path d="M2 -34v32h-15z" fill="${vela}"/><path d="M5 -28v26h11z" fill="${vela}" opacity=".85"/><path d="M-12 10h26" stroke="${sombra}" stroke-width="2" stroke-linecap="round"/></g>`;
}
export const svg = (w, h, corpo, defs = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><defs>${defs}</defs>${corpo}</svg>`;

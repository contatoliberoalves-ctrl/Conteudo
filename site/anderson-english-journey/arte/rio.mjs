import { rng, f, crista, poli, suave, onda, faixa, reflexos, pessoa, veleiro, svg } from './base.mjs';
// Rio de Janeiro no fim da tarde: Corcovado com o Cristo contra o sol, Pão de Açúcar com o bondinho,
// a enseada com veleiros e, na frente, o calçadão de ondas de Copacabana.
export const cristo = (x, y, s, cor) => `<g transform="translate(${x} ${y}) scale(${s})" fill="${cor}"><path d="M-15 0-13-22h26l2 22zM-10-22h20v-5h-20z"/><path d="M-11-27-8-70-10-88-22-86-40-92-52-97v-4l22-1 21-3 5-2h8l5 2 21 3 22 1v4l-12 5-18 6-12-2 2 18 3 43z"/><ellipse cx="0" cy="-113" rx="5" ry="6.5"/></g>`;
function palmeira(r, x, y, alt, inc, cor, esc = 1) {
  const tx = x + inc, ty = y - alt; let s = `<path d="M${x} ${y}Q${x + inc * .2} ${y - alt * .55} ${tx} ${ty}" fill="none" stroke="${cor}" stroke-width="${f(13 * esc)}" stroke-linecap="round"/>`;
  const n = 11; for (let i = 0; i < n; i++) {
    const a = -Math.PI * (.02 + i / (n - 1) * .96) + (r() - .5) * .16; const L = (118 + r() * 46) * esc; const cai = (.34 + Math.abs(Math.cos(a)) * .5) * L;
    const ex = tx + Math.cos(a) * L, ey = ty + Math.sin(a) * L * .62 + cai; const cx = tx + Math.cos(a) * L * .55, cy = ty + Math.sin(a) * L * .95 - 10 * esc;
    s += `<path d="M${f(tx)} ${f(ty)}Q${f(cx)} ${f(cy)} ${f(ex)} ${f(ey)}" fill="none" stroke="${cor}" stroke-width="${f(5 * esc)}" stroke-linecap="round"/>`;
    for (let k = 2; k <= 13; k++) { const t = k / 14; const px = (1 - t) * (1 - t) * tx + 2 * (1 - t) * t * cx + t * t * ex, py = (1 - t) * (1 - t) * ty + 2 * (1 - t) * t * cy + t * t * ey; const l = (26 - Math.abs(t - .5) * 22) * esc; const d = Math.cos(a) >= 0 ? 1 : -1; s += `<path d="M${f(px)} ${f(py)}l${f(d * l * .42)} ${f(l)}" stroke="${cor}" stroke-width="${f(3.2 * esc)}" stroke-linecap="round"/>`; }
  }
  return s + `<circle cx="${tx - 5}" cy="${ty + 9}" r="${6 * esc}" fill="${cor}"/><circle cx="${tx + 7}" cy="${ty + 10}" r="${6 * esc}" fill="${cor}"/>`;
}
export function rio() {
  const r = rng(7); const W = 1600, H = 640;
  const C = { c1: '#E0654F', c2: '#EC8458', c3: '#F4A35F', c4: '#F9C473', c5: '#FDE2A4', sol: '#FFF4CF', longe: '#D9806B', meio: '#8E4460', perto: '#3A2A52', breu: '#1E1A30', mar: '#1E6A70', mar2: '#17555C', mar3: '#2E8785', areia: '#F4E0B6', areia2: '#E3C48E' };
  let s = `<rect width="${W}" height="${H}" fill="${C.c1}"/>`;
  s += faixa(92, 9, 520, 60, 420, C.c2) + faixa(176, 8, 610, 300, 420, C.c3) + faixa(252, 7, 480, 120, 420, C.c4) + faixa(322, 5, 700, 0, 420, C.c5);
  // sol com anéis
  s += `<circle cx="600" cy="196" r="182" fill="${C.sol}" opacity=".16"/><circle cx="600" cy="196" r="150" fill="${C.sol}" opacity=".22"/><circle cx="600" cy="196" r="120" fill="${C.sol}"/>`;
  // nuvens em tiras
  const tira = (x, y, w, h, cor, op) => `<path d="M${x} ${y}q${w * .2} ${-h} ${w * .45} ${-h * .3}q${w * .2} ${-h * .9} ${w * .55} ${h * .3}q${-w * .3} ${h * .6} ${-w} 0z" fill="${cor}" opacity="${op}"/>`;
  s += tira(140, 120, 330, 22, C.c4, .75) + tira(980, 84, 420, 26, C.c3, .9) + tira(1180, 170, 300, 18, C.c5, .7) + tira(320, 214, 240, 14, C.c5, .65) + tira(760, 150, 200, 12, C.c5, .6);
  // serra ao longe
  s += `<path d="${poli(crista([[-20, 318], [160, 284], [300, 300], [470, 292], [760, 312], [930, 296], [1090, 268], [1230, 290], [1380, 262], [1500, 282], [1620, 270]], r, 9), 420)}" fill="${C.longe}"/>`;
  // maciço do Corcovado
  const cor = crista([[-20, 340], [110, 306], [215, 322], [330, 280], [430, 262], [515, 226], [572, 186], [600, 174], [626, 186], [682, 240], [760, 272], [850, 304], [960, 332], [1100, 352], [1300, 362], [1620, 344]], r, 7);
  s += `<path d="${poli(cor, 420)}" fill="${C.meio}"/>`;
  // névoa na base e luz na encosta
  s += `<path d="${poli(cor.filter(p => p[0] > 440 && p[0] < 604))}" fill="none" stroke="${C.c3}" stroke-width="3" stroke-linecap="round" opacity=".9"/>`;
  for (let i = 0; i < 26; i++) { const x = 60 + r() * 900, y = 300 + r() * 80; s += `<path d="M${f(x)} ${f(y)}q10 -9 22 0" fill="none" stroke="#7A3853" stroke-width="3" stroke-linecap="round" opacity=".7"/>`; }
  s += cristo(600, 176, .82, C.perto) + `<path d="M557 77l-3 4M643 77l3 4" stroke="${C.sol}" stroke-width="0"/>`;
  s += faixa(378, 5, 420, 40, 420, '#F4A35F', 'opacity=".42"');
  // prédios da orla
  const predios = ['#FBEBC6', '#F7D9A4', '#F0B987', '#FFF4DC', '#E9A27C'];
  for (let x = 250; x < 900;) { const w = 10 + r() * 20, h = 12 + r() * 34 * (x > 380 && x < 800 ? 1 : .6); s += `<rect x="${f(x)}" y="${f(403 - h)}" width="${f(w)}" height="${f(h)}" fill="${predios[r() * 5 | 0]}"/>`; if (h > 20) for (let yy = 403 - h + 5; yy < 398; yy += 7) s += `<rect x="${f(x + 3)}" y="${f(yy)}" width="${f(w - 6)}" height="2" fill="${C.meio}" opacity=".5"/>`; x += w + r() * 5; }
  // morro escuro à esquerda
  const morroE = crista([[-20, 296], [70, 286], [150, 318], [235, 356], [320, 386], [400, 404]], r, 8, 10);
  s += `<path d="${poli(morroE, 420)}" fill="${C.perto}"/>`;
  for (let i = 0; i < 16; i++) { const x = r() * 260, y = 330 + r() * 60; if (y > 300 + x * .3) s += `<rect x="${f(x)}" y="${f(y)}" width="5" height="4" fill="${C.c4}" opacity="${f(.5 + r() * .5)}"/>`; }
  // Pão de Açúcar e Morro da Urca
  const urca = [[836, 406], [868, 376], [912, 348], [962, 332], [1010, 334], [1046, 352], [1078, 392], [1090, 406]];
  const pao = [[1034, 406], [1058, 336], [1082, 280], [1112, 240], [1150, 220], [1190, 218], [1224, 234], [1252, 274], [1276, 332], [1304, 406]];
  s += `<path d="${suave(urca)}Z" fill="${C.perto}"/><path d="${suave(pao)}Z" fill="${C.perto}"/>`;
  s += `<path d="${suave(pao.slice(0, 5))}" fill="none" stroke="${C.c3}" stroke-width="3.5" stroke-linecap="round"/><path d="${suave(urca.slice(0, 4))}" fill="none" stroke="${C.c3}" stroke-width="3" stroke-linecap="round"/>`;
  for (const [x, y, l] of [[1100, 286, 80], [1128, 262, 110], [1160, 250, 124], [1196, 252, 120], [1230, 276, 96], [1256, 318, 60], [930, 356, 34], [980, 348, 40]]) s += `<path d="M${x} ${y}q-8 ${l * .5} 2 ${l}" fill="none" stroke="#4B3A66" stroke-width="5" stroke-linecap="round"/>`;
  // estações e cabos do bondinho (o bondinho em si é animado na página)
  s += `<path d="M770 398 978 330M986 330 1166 220" stroke="${C.breu}" stroke-width="1.6" fill="none"/><rect x="968" y="322" width="24" height="12" fill="${C.breu}"/><rect x="1156" y="212" width="22" height="11" fill="${C.breu}"/><rect x="760" y="392" width="20" height="12" fill="${C.breu}"/>`;
  // mar
  s += `<rect y="404" width="${W}" height="140" fill="${C.mar}"/>` + faixa(440, 3, 300, 0, 560, C.mar2, 'opacity=".55"') + faixa(476, 4, 380, 90, 560, C.mar2, 'opacity=".6"');
  s += reflexos(r, 70, 505, 695, 406, 500, C.c5, .95, 14, 120, 2.6) + reflexos(r, 26, 520, 680, 406, 470, C.sol, .9, 20, 90, 3);
  s += reflexos(r, 60, 0, 1600, 408, 500, C.mar3, .8, 16, 70, 2) + reflexos(r, 18, 860, 1300, 408, 440, C.perto, .5, 30, 90, 2.4);
  s += veleiro(380, 446, 1, '#FBF3DF', '#FFF9EA') + veleiro(790, 432, .7, '#FBF3DF', '#FFF9EA') + veleiro(1010, 470, 1.25, '#D7263D', '#FFF9EA') + veleiro(1400, 440, .8, '#FBF3DF', '#F9C473') + veleiro(180, 430, .6, '#FBF3DF', '#FFF9EA');
  // areia
  s += `<path d="${suave(onda(506, 6, 900, 200))}L1620 640L-20 640Z" fill="${C.areia}"/><path d="${suave(onda(506, 6, 900, 200))}" fill="none" stroke="#FFFDF2" stroke-width="5" opacity=".9"/><path d="${suave(onda(514, 5, 900, 260))}" fill="none" stroke="#FFFDF2" stroke-width="2" opacity=".6"/>`;
  for (let i = 0; i < 90; i++) s += `<circle cx="${f(r() * W)}" cy="${f(520 + r() * 34)}" r="${f(.8 + r() * 1.4)}" fill="${C.areia2}"/>`;
  const sombrinha = (x, y, c1, c2) => `<g transform="translate(${x} ${y})"><ellipse cx="6" cy="26" rx="26" ry="4" fill="${C.areia2}"/><path d="M0 26V-2" stroke="${C.breu}" stroke-width="2.4"/><path d="M-26 0a26 20 0 0 1 52 0z" fill="${c1}"/><path d="M-9 0a9 20 0 0 1 18 0z" fill="${c2}"/><rect x="10" y="17" width="20" height="4" rx="2" fill="${c2}" transform="rotate(-14 10 17)"/></g>`;
  s += sombrinha(330, 516, '#D7263D', '#FBF3DF') + sombrinha(450, 524, '#E3A92F', '#FBF3DF') + sombrinha(860, 518, '#FBF3DF', '#1E6A70') + sombrinha(1180, 522, '#D7263D', '#E3A92F') + sombrinha(1290, 514, '#1E6A70', '#FBF3DF');
  // trave e bola do futebol de areia
  s += `<path d="M640 540v-26h44v26" fill="none" stroke="#FFFDF2" stroke-width="3"/><circle cx="716" cy="536" r="4.5" fill="#FFFDF2" stroke="${C.breu}" stroke-width="1.2"/>` + pessoa(742, 541, 30, C.perto, 1) + pessoa(1010, 538, 28, C.perto) + pessoa(1028, 539, 24, '#8E4460');
  // calçadão: ondas em pedra portuguesa
  s += `<rect y="548" width="${W}" height="92" fill="#FBF6EA"/><rect y="546" width="${W}" height="4" fill="${C.areia2}"/>`;
  for (let k = 0; k < 4; k++) { const y = 566 + k * 24, a = 10, l = 168; const cima = onda(y - 6, a, l, 0, -20, 1620, 8), baixo = onda(y + 6, a, l, 0, -20, 1620, 8).reverse(); s += `<path d="${suave(cima)}L${baixo.map(p => `${f(p[0])} ${f(p[1])}`).join('L')}Z" fill="${C.breu}"/>`; }
  // coqueiros em primeiro plano
  s += palmeira(r, 70, 660, 420, 70, C.breu, 1.15) + palmeira(r, 215, 660, 300, -40, C.breu, .86) + palmeira(r, 1500, 660, 440, -80, C.breu, 1.2) + palmeira(r, 1385, 660, 290, 30, C.breu, .8);
  // aves
  for (const [x, y, e] of [[840, 120, 1], [884, 142, .8], [800, 150, .7], [1340, 96, .9], [1300, 122, .7], [300, 92, .8]]) s += `<path d="M${x - 15 * e} ${y}q${8 * e} ${-9 * e} ${15 * e} 0q${7 * e} ${-9 * e} ${15 * e} 0" fill="none" stroke="${C.perto}" stroke-width="${2.6 * e}" stroke-linecap="round"/>`;
  return { nome: 'rio', w: W, h: H, esc: 1.25, svg: svg(W, H, s) };
}

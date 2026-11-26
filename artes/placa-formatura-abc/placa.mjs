// Placas de formatura do ABC, 20×15 cm (frente: foto do aluno, nome, série e escola; verso: foto da turma).
// Tema de conto de fadas em papel recortado (torre, trança dourada, lanternas, castelo, flores), 3 variações.
//   node placa.mjs   → html/v<1-3>-<frente|verso>-<previa|limpo>.html   (depois: node render.js)
// "previa" mostra os espaços preenchidos com exemplos; "limpo" sai com a janela da foto transparente e sem os textos.
import fs from "node:fs";

const W = 1181, H = 886; // 20×15 cm a 150 dpi; o render usa escala 2 (300 dpi)
let _n = 0, DEFS = [];
const id = (p) => `${p}${++_n}`;
const f = (v) => Math.round(v * 10) / 10;
const R = (seed) => { let s = seed >>> 0; return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296); };
const gstops = (stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1) => {
  const i = id("g");
  DEFS.push(`<linearGradient id="${i}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</linearGradient>`);
  return `url(#${i})`;
};
const gl = (c1, c2, x1 = 0, y1 = 0, x2 = 0, y2 = 1) => gstops([[0, c1], [1, c2]], x1, y1, x2, y2);
const grad = (stops) => {
  const i = id("r");
  DEFS.push(`<radialGradient id="${i}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join("")}</radialGradient>`);
  return `url(#${i})`;
};

const BASE_DEFS = `
<filter id="sombra" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="5" stdDeviation="6" flood-color="#160a38" flood-opacity=".5"/></filter>
<filter id="sombraS" x="-40%" y="-40%" width="180%" height="190%"><feDropShadow dx="0" dy="2.5" stdDeviation="2.6" flood-color="#160a38" flood-opacity=".42"/></filter>
<filter id="sombraC" x="-10%" y="-60%" width="120%" height="200%"><feDropShadow dx="0" dy="-3" stdDeviation="7" flood-color="#160a38" flood-opacity=".42"/></filter>
<filter id="b2" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="1.6"/></filter>
<filter id="b6" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="8"/></filter>
<filter id="papel" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="7" result="n"/><feColorMatrix in="n" values="0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .9 0"/></filter>
<radialGradient id="halo"><stop offset="0" stop-color="#ffd27a" stop-opacity=".62"/><stop offset=".45" stop-color="#ffb24a" stop-opacity=".2"/><stop offset="1" stop-color="#ffb24a" stop-opacity="0"/></radialGradient>
<linearGradient id="lant" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0b0"/><stop offset=".55" stop-color="#ffc552"/><stop offset="1" stop-color="#ff8f2e"/></linearGradient>
<linearGradient id="ouro" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff2ae"/><stop offset=".5" stop-color="#f8c341"/><stop offset="1" stop-color="#dc9016"/></linearGradient>`;

// ---------------------------------------------------------------- peças
// Camada de nuvens recortadas (borda de cima em gomos), até o pé da arte.
function banco(y, c1, c2, seed, o = {}) {
  const { rMin = 50, rMax = 105, amp = 30, x0 = -70, x1 = W + 70 } = o;
  const r = R(seed);
  let x = x0, d = `M${x0} ${H + 70}L${x0} ${f(y + (r() - .5) * amp)}`;
  while (x < x1) {
    const rad = rMin + r() * (rMax - rMin), nx = x + rad * 1.62;
    d += `A${f(rad)} ${f(rad * (.82 + r() * .22))} 0 0 1 ${f(nx)} ${f(y + (r() - .5) * amp)}`;
    x = nx;
  }
  return `<path d="${d}L${f(x)} ${H + 70}Z" fill="${gl(c1, c2)}" filter="url(#sombraC)"/>`;
}

// Colina de borda lisa.
function colina(y, c1, c2, seed, amp = 34, n = 4) {
  const r = R(seed), pts = [];
  for (let i = 0; i <= n; i++) pts.push([-50 + (W + 100) * i / n, y + (r() - .5) * amp * 2]);
  let d = `M-50 ${H + 60}L${pts[0][0]} ${f(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], mx = (x0 + x1) / 2;
    d += `C${f(mx)} ${f(y0)} ${f(mx)} ${f(y1)} ${f(x1)} ${f(y1)}`;
  }
  return `<path d="${d}L${W + 50} ${H + 60}Z" fill="${gl(c1, c2)}" filter="url(#sombraC)"/>`;
}

function nuvem(x, y, s, cor) {
  const p = [[0, 0, 34], [40, -18, 44], [88, -6, 36], [122, 8, 25], [-32, 10, 23]];
  return `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#sombra)" fill="${cor}">${p.map(([a, b, c]) => `<circle cx="${a}" cy="${b}" r="${c}"/>`).join("")}<rect x="-46" y="2" width="184" height="31" rx="15.5"/></g>`;
}

function lanterna(x, y, s = 1, rot = 0, op = 1) {
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)}) scale(${f(s)})" opacity="${f(op)}"><circle r="48" fill="url(#halo)"/>` +
    `<path d="M-15 -17Q0 -27 15 -17L10.5 17Q0 22 -10.5 17Z" fill="url(#lant)" stroke="#fff1c2" stroke-width=".9" stroke-opacity=".7"/>` +
    `<path d="M-10.9 14Q0 19.4 10.9 14L10.5 17Q0 22 -10.5 17Z" fill="#e06a22" opacity=".9"/>` +
    `<path d="M-13.6 -6Q0 -1 13.6 -6" fill="none" stroke="#e58a2c" stroke-width="1.2" opacity=".55"/>` +
    `<ellipse cx="0" cy="9" rx="6" ry="8" fill="#fffce6" opacity=".8" filter="url(#b2)"/></g>`;
}

// Lanternas espalhadas numa área, fora das zonas de texto/foto (menores primeiro: parecem mais longe).
function lanternas(seed, qtd, area, evitar = [], esc = [.45, 1.05]) {
  const r = R(seed), lista = [];
  for (let t = 0; lista.length < qtd && t < qtd * 40; t++) {
    const x = area[0] + r() * (area[2] - area[0]), y = area[1] + r() * (area[3] - area[1]);
    if (evitar.some(([a, b, c, d]) => x > a && x < c && y > b && y < d)) continue;
    if (lista.some((l) => Math.hypot(l[0] - x, l[1] - y) < 62)) continue;
    lista.push([x, y, esc[0] + r() * r() * (esc[1] - esc[0]), (r() - .5) * 22, .78 + r() * .22]);
  }
  return lista.sort((a, b) => a[2] - b[2]).map((l) => lanterna(...l)).join("");
}

function luzinhas(seed, qtd, area, cor = "#ffd98a") {
  const r = R(seed);
  let s = "";
  for (let i = 0; i < qtd; i++) {
    const x = area[0] + r() * (area[2] - area[0]), y = area[1] + r() * (area[3] - area[1]);
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(1.4 + r() * r() * 5)}" fill="${cor}" opacity="${f(.3 + r() * .55)}" filter="url(#b2)"/>`;
  }
  return s;
}

const brilho = (x, y, r, op = 1, cor = "#fff") =>
  `<path transform="translate(${f(x)} ${f(y)})" d="M0 ${-r}Q${f(r * .13)} ${f(-r * .13)} ${r} 0Q${f(r * .13)} ${f(r * .13)} 0 ${r}Q${f(-r * .13)} ${f(r * .13)} ${-r} 0Q${f(-r * .13)} ${f(-r * .13)} 0 ${-r}Z" fill="${cor}" opacity="${f(op)}"/>`;

function estrelas(seed, qtd, yMax, cor = "#fff") {
  const r = R(seed);
  let s = "";
  for (let i = 0; i < qtd; i++) {
    const x = r() * W, y = r() * r() * yMax;
    s += r() < .12 ? brilho(x, y, 4 + r() * 6, .5 + r() * .5, cor) : `<circle cx="${f(x)}" cy="${f(y)}" r="${f(.6 + r() * 1.4)}" fill="${cor}" opacity="${f(.3 + r() * .6)}"/>`;
  }
  return s;
}

function lua(x, y, r) {
  const m = id("m");
  DEFS.push(`<mask id="${m}"><rect x="${x - r * 2}" y="${y - r * 2}" width="${r * 4}" height="${r * 4}" fill="#fff"/><circle cx="${x + r * .42}" cy="${y - r * .18}" r="${r * .88}" fill="#000"/></mask>`);
  return `<circle cx="${x}" cy="${y}" r="${r * 2.4}" fill="${grad([[0, "#fff3c4", .45], [1, "#fff3c4", 0]])}"/><circle cx="${x}" cy="${y}" r="${r}" fill="#fff4cc" mask="url(#${m})" filter="url(#sombraS)"/>`;
}

function flor(x, y, r, cor, o = {}) {
  const { n = 5, miolo = "#ffd34d", rot = 0 } = o;
  let s = `<g transform="translate(${f(x)} ${f(y)}) rotate(${rot})" filter="url(#sombraS)">`;
  for (let i = 0; i < n; i++) s += `<ellipse cx="0" cy="${f(-r * .56)}" rx="${f(r * .41)}" ry="${f(r * .56)}" transform="rotate(${f(i * 360 / n)})" fill="${cor}"/>`;
  for (let i = 0; i < n; i++) s += `<ellipse cx="0" cy="${f(-r * .46)}" rx="${f(r * .17)}" ry="${f(r * .34)}" transform="rotate(${f(i * 360 / n)})" fill="#fff" opacity=".3"/>`;
  return s + `<circle r="${f(r * .27)}" fill="${miolo}"/><circle cx="${f(-r * .06)}" cy="${f(-r * .06)}" r="${f(r * .12)}" fill="#fff8cf" opacity=".85"/></g>`;
}

const folha = (x, y, r, rot, cor = "#4fae62") =>
  `<path transform="translate(${f(x)} ${f(y)}) rotate(${rot})" d="M0 0Q${f(r * .6)} ${f(-r * .6)} 0 ${f(-r * 1.6)}Q${f(-r * .6)} ${f(-r * .6)} 0 0Z" fill="${cor}" filter="url(#sombraS)"/>`;

// Ramalhete: folhas atrás e flores na frente. itens: [dx, dy, raio, cor]
const FLORES = ["#ff6fae", "#b57bf0", "#ffffff", "#ff9a5c", "#e4489a", "#8f6be8", "#ffd9ec"];
function ramalhete(x, y, s, itens, folhas = []) {
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${s})">` + folhas.map(([a, b, r, rot, cor]) => folha(a, b, r, rot, cor)).join("") +
    itens.map(([a, b, r, cor], i) => flor(a, b, r, cor, { rot: i * 23, miolo: cor === "#ffffff" ? "#ffc23d" : "#ffe27a" })).join("") + `</g>`;
}
const RAM_A = [[[-34, 10, 22, "#b57bf0"], [30, 16, 20, "#ffffff"], [0, -12, 30, "#ff6fae"], [-8, 34, 15, "#ffd9ec"], [46, -14, 14, "#e4489a"]],
  [[-52, 26, 17, 250, "#3f9a58"], [58, 30, 17, 110, "#4fae62"], [-30, -30, 15, 320, "#5cbc6c"], [34, -40, 15, 30, "#3f9a58"], [6, 54, 14, 180, "#4fae62"]]];
const RAM_B = [[[0, 0, 22, "#ff6fae"], [28, 12, 15, "#ffffff"], [-24, 14, 14, "#b57bf0"]], [[-36, 22, 13, 250, "#4fae62"], [40, 26, 13, 110, "#3f9a58"], [2, -30, 12, 0, "#5cbc6c"]]];

// Pontos igualmente espaçados (com o ângulo) ao longo de uma linha densa.
function espacar(fino, passo) {
  const out = [];
  let acc = 0, prox = 0;
  for (let i = 1; i < fino.length; i++) {
    const [x0, y0] = fino[i - 1], [x1, y1] = fino[i], dl = Math.hypot(x1 - x0, y1 - y0);
    if (!dl) continue;
    for (; prox <= acc + dl; prox += passo) { const t = (prox - acc) / dl; out.push([x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, Math.atan2(y1 - y0, x1 - x0)]); }
    acc += dl;
  }
  return out;
}
const curva = (segs) => segs.flatMap(([a, b, c, d]) => Array.from({ length: 61 }, (_, i) => { const t = i / 60, u = 1 - t; return [u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]]; }));
const arco = (cx, cy, rx, ry, a0, a1) => Array.from({ length: 241 }, (_, i) => { const a = (a0 + (a1 - a0) * i / 240) * Math.PI / 180; return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]; });

// Trança dourada ao longo de uma linha: gomos alternados, flores presas e, na ponta, laço e tufo.
function tranca(fino, larg, o = {}) {
  const { afina = .6, flores = [], ponta = true, laco = "#b56fe0" } = o;
  const pts = espacar(fino, larg * .44), N = pts.length;
  let s = `<g filter="url(#sombraS)"><path d="M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join("L")}" fill="none" stroke="#e2a022" stroke-width="${f(larg * .62)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  for (let i = 0; i < N; i++) {
    const [x, y, a] = pts[i], L = larg * (1 - (1 - afina) * i / N), lado = i % 2 ? 1 : -1;
    const cx = x - Math.sin(a) * lado * L * .2, cy = y + Math.cos(a) * lado * L * .2;
    s += `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(L * .6)}" ry="${f(L * .33)}" transform="rotate(${f(a * 180 / Math.PI + lado * 40)} ${f(cx)} ${f(cy)})" fill="url(#ouro)" stroke="#b46f08" stroke-width="1.1" stroke-opacity=".6"/>`;
  }
  s += `</g>`;
  if (ponta) {
    const [x, y, a] = pts[N - 1], L = larg * Math.max(afina, .8) * .78, g = a * 180 / Math.PI;
    s += `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(g)})" filter="url(#sombraS)">` +
      `<path d="M${f(L * .3)} ${f(-L * .42)}C${f(L * 1.7)} ${f(-L * .7)} ${f(L * 2.3)} ${f(-L * .2)} ${f(L * 3)} ${f(L * .1)}C${f(L * 2.2)} ${f(L * .4)} ${f(L * 1.6)} ${f(L * .75)} ${f(L * .3)} ${f(L * .42)}Z" fill="url(#ouro)" stroke="#b9770e" stroke-width=".9" stroke-opacity=".5"/>` +
      `<path d="M${f(L * .5)} 0C${f(-L * .2)} ${f(-L * 1.2)} ${f(L * .1)} ${f(-L * 1.5)} ${f(L * .5)} ${f(-L * .15)}C${f(L * .9)} ${f(-L * 1.5)} ${f(L * 1.2)} ${f(-L * 1.2)} ${f(L * .5)} 0C${f(L * 1.2)} ${f(L * 1.2)} ${f(L * .9)} ${f(L * 1.5)} ${f(L * .5)} ${f(L * .15)}C${f(L * .1)} ${f(L * 1.5)} ${f(-L * .2)} ${f(L * 1.2)} ${f(L * .5)} 0Z" fill="${laco}"/>` +
      `<circle cx="${f(L * .5)}" cy="0" r="${f(L * .24)}" fill="#fff" opacity=".85"/></g>`;
  }
  for (const [fr, cor, k = .5] of flores) { const [x, y] = pts[Math.min(N - 1, Math.round(fr * (N - 1)))]; s += flor(x, y, larg * k, cor, { rot: fr * 200 }); }
  return s;
}

// Castelo de papel: torres com telhado de cone, muralha e portão. p: paleta.
function castelo(cx, yb, s, p) {
  const tw = (x, w, h, t, o = {}) => {
    const th = w * 1.55;
    let g = `<g filter="url(#sombraS)"><rect x="${x - w / 2}" y="${-h}" width="${w}" height="${h + 4}" fill="${gl(p.c[0], p.c[1], 0, 0, 1, 0)}"/>` +
      `<path d="M${f(x - w * .7)} ${-h}Q${f(x - w * .22)} ${f(-h - th * .5)} ${x} ${f(-h - th)}Q${f(x + w * .22)} ${f(-h - th * .5)} ${f(x + w * .7)} ${-h}Z" fill="${gl(t[0], t[1], 0, 0, 1, 0)}"/>`;
    if (o.b) g += `<path d="M${x} ${f(-h - th)}v${f(-w * .55)}" stroke="#fff3c4" stroke-width="1.8"/><path d="M${x} ${f(-h - th - w * .55)}l${f(w * .52)} ${f(w * .13)}l${f(-w * .52)} ${f(w * .15)}Z" fill="${p.b}"/>`;
    for (const jy of o.j ?? [.62]) g += `<path d="M${f(x - w * .12)} ${f(-h * jy)}v${f(-w * .22)}a${f(w * .12)} ${f(w * .12)} 0 0 1 ${f(w * .24)} 0v${f(w * .22)}Z" fill="${p.j}"/>`;
    return g + `</g>`;
  };
  let am = "";
  for (let x = -196; x < 190; x += 28) am += `<rect x="${x}" y="-88" width="16" height="16"/>`;
  return `<g transform="translate(${cx} ${yb}) scale(${s})">` + tw(-168, 40, 118, p.t2) + tw(168, 40, 128, p.t2, { b: 1 }) + tw(-112, 52, 176, p.t, { j: [.72, .42] }) + tw(112, 50, 160, p.t, { j: [.66] }) +
    tw(-52, 44, 236, p.t2, { b: 1, j: [.8, .55] }) + tw(56, 48, 262, p.t, { b: 1, j: [.82, .6, .4] }) +
    `<g filter="url(#sombraS)" fill="${gl(p.m[0], p.m[1])}"><rect x="-200" y="-74" width="400" height="80"/>${am}</g>` + tw(0, 74, 150, p.t, { j: [.78] }) +
    `<path d="M-20 4v-44a20 20 0 0 1 40 0v44Z" fill="${p.p}"/></g>`;
}
const CAST_NOITE = { c: ["#8e6fd0", "#5b3f9f"], m: ["#7556b8", "#4a3288"], t: ["#ff7fb2", "#c2468a"], t2: ["#5cc9c4", "#2f8f9a"], j: "#ffe28a", b: "#ffd34d", p: "#3a2470" };
const CAST_CLARO = { c: ["#efe2ff", "#cdb2f0"], m: ["#dcc6f7", "#b796e6"], t: ["#a06ae0", "#7443bd"], t2: ["#ff8fbd", "#d85a97"], j: "#fff2b8", b: "#ffc928", p: "#8a5fd0" };

// Torre alta de pedra com a casinha no topo, telhado roxo e trepadeira. A janela fica em (x, yb - 490·s).
function torre(x, yb, s, seed = 5) {
  const r = R(seed);
  let pedras = "";
  for (let i = 0; i < 28; i++) { const py = -24 - r() * 390, meio = 44 - (-py / 430) * 14, px = (r() * 2 - 1) * (meio - 13); pedras += `<rect x="${f(px - 8)}" y="${f(py)}" width="${f(11 + r() * 8)}" height="7" rx="3.5" fill="#a88f6e" opacity="${f(.2 + r() * .22)}"/>`; }
  let g = `<g transform="translate(${x} ${yb}) scale(${s})">` +
    `<g filter="url(#sombra)"><path d="M-48 8C-42 -150 -34 -330 -30 -440L30 -440C34 -330 42 -150 48 8Z" fill="${gl("#f6ead8", "#cdb594", 0, 0, 1, 0)}"/>${pedras}</g>` +
    `<path d="M-40 -6C12 -70 40 -122 -8 -192S-44 -300 26 -384" fill="none" stroke="#3f9a58" stroke-width="5" stroke-linecap="round"/>` +
    [[-20, -34, 60], [14, -92, -50], [22, -142, 40], [-14, -204, -60], [-30, -262, 50], [-6, -322, -40], [18, -372, 45]].map(([a, b, c]) => folha(a, b, 10, c)).join("") +
    flor(-2, -118, 9, "#ff7ab6") + flor(-28, -238, 9, "#c98cff") + flor(10, -350, 8, "#ffffff") +
    `<g filter="url(#sombra)"><path d="M-34 -432L-58 -458L58 -458L34 -432Z" fill="#a9825d"/><path d="M-66 -456L-73 -562L73 -562L66 -456Z" fill="${gl("#fff8ea", "#ecdcc0", 0, 0, 1, 0)}"/>` +
    `<path d="M-66 -456L-73 -562M66 -456L73 -562M-70 -458H70M-71 -560H71M-34 -456L-37 -562M34 -456L37 -562" stroke="#8a5a3c" stroke-width="5.5" fill="none" stroke-linecap="round"/></g>` +
    `<g filter="url(#sombraS)"><rect x="60" y="-548" width="30" height="74" fill="${gl("#fff8ea", "#e2cfae", 0, 0, 1, 0)}"/><path d="M52 -548Q70 -590 75 -624Q80 -590 98 -548Z" fill="${gl("#b57be6", "#7a4cc0", 0, 0, 1, 0)}"/><rect x="70" y="-530" width="10" height="20" rx="5" fill="#4b2f66"/></g>` +
    `<path d="M-19 -474V-515A19 19 0 0 1 19 -515V-474Z" fill="#4b2f66" stroke="#8a5a3c" stroke-width="4.5"/><rect x="-37" y="-524" width="13" height="52" rx="2.5" fill="#b56fd6"/><rect x="24" y="-524" width="13" height="52" rx="2.5" fill="#b56fd6"/>`;
  // telhado com fileiras de telhas
  let telhas = "";
  for (const ty of [-585, -622, -660, -700]) { const hw = 96 * (ty + 778) / 226 - 4, q = Math.max(2, Math.round(hw * 2 / 24)), w = hw * 2 / q; telhas += `<path d="M${f(-hw)} ${ty}${`q${f(w / 2)} 10 ${f(w)} 0`.repeat(q)}" fill="none" stroke="#fff" stroke-opacity=".24" stroke-width="2.6"/>`; }
  g += `<g filter="url(#sombra)"><path d="M-98 -552Q-34 -652 0 -778Q34 -652 98 -552Q0 -530 -98 -552Z" fill="${gl("#a56fe0", "#5f39a6", 0, 0, 1, 0)}"/>${telhas}</g>` +
    `<path d="M0 -780v-34" stroke="#ffe9a8" stroke-width="2.4"/><path d="M0 -814l28 8l-28 10Z" fill="#ff6fae"/><circle cx="0" cy="-780" r="6" fill="#ffd34d"/>` +
    `<rect x="-27" y="-476" width="54" height="10" rx="3" fill="#8a5a3c"/>` + flor(-16, -480, 6, "#ff7ab6") + flor(0, -482, 6, "#ffffff") + flor(16, -480, 6, "#c98cff");
  return g + `</g>`;
}

function bandeirolas(x0, y0, x1, y1, q, cores, sag = 26, fio = "#fff") {
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2 + sag * 2;
  let s = `<path d="M${x0} ${y0}Q${mx} ${my} ${x1} ${y1}" fill="none" stroke="${fio}" stroke-opacity=".85" stroke-width="2"/>`;
  for (let i = 0; i < q; i++) {
    const t = (i + .5) / q, u = 1 - t, x = u * u * x0 + 2 * u * t * mx + t * t * x1, y = u * u * y0 + 2 * u * t * my + t * t * y1;
    const a = Math.atan2(2 * u * (my - y0) + 2 * t * (y1 - my), 2 * u * (mx - x0) + 2 * t * (x1 - mx)) * 180 / Math.PI;
    s += `<path transform="translate(${f(x)} ${f(y)}) rotate(${f(a)})" d="M-14 -1H14L0 31Z" fill="${cores[i % cores.length]}" filter="url(#sombraS)"/>`;
  }
  return s;
}

const borboleta = (x, y, s, rot, cor, cor2) =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" filter="url(#sombraS)"><ellipse cx="-11" cy="-7" rx="12" ry="9" transform="rotate(-28 -11 -7)" fill="${cor}"/><ellipse cx="11" cy="-7" rx="12" ry="9" transform="rotate(28 11 -7)" fill="${cor}"/><ellipse cx="-8" cy="8" rx="8" ry="6.5" transform="rotate(24 -8 8)" fill="${cor2}"/><ellipse cx="8" cy="8" rx="8" ry="6.5" transform="rotate(-24 8 8)" fill="${cor2}"/><rect x="-1.6" y="-11" width="3.2" height="22" rx="1.6" fill="#5b3a2a"/></g>`;

// Faixa para o nome, com as pontas dobradas.
function faixa(cx, cy, w, h, c1, c2, escuro) {
  const x = cx - w / 2, y = cy - h / 2, d = 34;
  return `<g filter="url(#sombra)"><path d="M${x - d} ${y + 14}H${x + 26}V${y + h + 14}H${x - d}L${x - d + 18} ${y + h / 2 + 14}Z" fill="${escuro}"/><path d="M${x + w + d} ${y + 14}H${x + w - 26}V${y + h + 14}H${x + w + d}L${x + w + d - 18} ${y + h / 2 + 14}Z" fill="${escuro}"/>` +
    `<path d="M${x} ${y + h}L${x + 26} ${y + h + 14}V${y + h}ZM${x + w} ${y + h}L${x + w - 26} ${y + h + 14}V${y + h}Z" fill="#000" opacity=".35"/>` +
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${gl(c1, c2)}"/><rect x="${x + 7}" y="${y + 6}" width="${w - 14}" height="${h - 12}" rx="3" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.6" stroke-dasharray="1 6" stroke-linecap="round"/></g>`;
}

// ---------------------------------------------------------------- janelas das fotos
const oval = (cx, cy, rx, ry) => ({
  furo: `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#000"/>`,
  sombra: `<ellipse cx="${cx}" cy="${cy + 6}" rx="${rx + 10}" ry="${ry + 10}" fill="none" stroke="#160a38" stroke-opacity=".5" stroke-width="20" filter="url(#b6)"/>`,
  aro: (cor = "#fff") => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${cor}" stroke-width="26"/><ellipse cx="${cx}" cy="${cy}" rx="${rx + 15}" ry="${ry + 15}" fill="none" stroke="url(#ouro)" stroke-width="3.5"/>`,
  caixa: [cx - rx - 4, cy - ry - 4, rx * 2 + 8, ry * 2 + 8],
});
const caminhoArco = (x, y, w, h) => `M${x} ${y + h}V${y + w / 2}A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2}V${y + h}Z`;
const janelaArco = (x, y, w, h) => ({
  furo: `<path d="${caminhoArco(x, y, w, h)}" fill="#000"/>`,
  sombra: `<path d="${caminhoArco(x - 8, y - 4, w + 16, h + 16)}" fill="none" stroke="#160a38" stroke-opacity=".5" stroke-width="20" filter="url(#b6)"/>`,
  aro: (cor = "#fff") => `<path d="${caminhoArco(x, y, w, h)}" fill="none" stroke="${cor}" stroke-width="26" stroke-linejoin="round"/><path d="${caminhoArco(x - 15, y - 15, w + 30, h + 30)}" fill="none" stroke="url(#ouro)" stroke-width="3.5" stroke-linejoin="round"/>`,
  caixa: [x - 4, y - 4, w + 8, h + 8],
});
const retangulo = (x, y, w, h, r = 20) => ({
  furo: `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="#000"/>`,
  sombra: `<rect x="${x - 8}" y="${y - 2}" width="${w + 16}" height="${h + 16}" rx="${r + 8}" fill="none" stroke="#160a38" stroke-opacity=".5" stroke-width="20" filter="url(#b6)"/>`,
  aro: (cor = "#fff") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="none" stroke="${cor}" stroke-width="26"/><rect x="${x - 15}" y="${y - 15}" width="${w + 30}" height="${h + 30}" rx="${r + 15}" fill="none" stroke="url(#ouro)" stroke-width="3.5"/>`,
  caixa: [x - 4, y - 4, w + 8, h + 8],
});

// Exemplo que aparece só na prévia, atrás da janela.
const BONECO = `<circle cx="50" cy="34" r="19"/><path d="M12 100c0-24 17-41 38-41s38 17 38 41z"/>`;
function exemplo([x, y, w, h], turma) {
  const fig = turma
    ? `<svg viewBox="0 0 520 130" width="${f(w * .56)}" fill="#b5aad3">${[0, 1, 2, 3, 4].map((i) => `<g transform="translate(${i * 84 + (i > 3 ? 20 : 0)} ${i > 3 ? 0 : 30}) scale(${i > 3 ? 1.3 : 1})">${BONECO}</g>`).join("")}</svg>`
    : `<svg viewBox="0 0 100 100" width="${f(w * .5)}" fill="#b5aad3">${BONECO}</svg>`;
  return `<div class="ex" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">${fig}<div>${turma ? "FOTO DA TURMA" : "FOTO DO ALUNO"}</div></div>`;
}

// ---------------------------------------------------------------- textos
function abc(x, y, tam, cores, sombra = "rgba(22,10,56,.5)") {
  const lados = (c) => Array.from({ length: Math.round(tam * .065) }, (_, i) => `${f((i + 1) * .45)}px ${i + 1}px 0 ${c}`).join(",");
  const rot = [-5, 2, 6], dy = [8, -8, 5];
  return `<div class="abc" style="left:${x}px;top:${y}px;font-size:${tam}px">` + [..."ABC"].map((l, i) =>
    `<span style="color:${cores[i][0]};transform:translateY(${dy[i]}px) rotate(${rot[i]}deg);z-index:${i === 1 ? 2 : 1};text-shadow:${lados(cores[i][1])},${f(tam * .05)}px ${f(tam * .13)}px ${f(tam * .08)}px ${sombra}">${l}</span>`).join("") + `</div>`;
}
const ROSA = ["#ff5fa6", "#b81f6b"], OURO = ["#ffcb2e", "#d6860f"], VERDE = ["#6fe0b4", "#1f8f7a"], ROXO = ["#9a5be6", "#57279f"];
const TX = { aluno: "Nome Completo do Aluno", escola: "Nome da Escola", serie: "Série / Turma" };

const CSS = `html,body{margin:0;background:transparent}#tela{position:relative;width:${W}px;height:${H}px;overflow:hidden}
svg.cena{position:absolute;left:0;top:0}.tx{position:absolute;inset:0;font-family:'Fredoka',sans-serif}.tx>*{position:absolute}
.sw{font-family:'Berkshire Swash',serif;line-height:1.08}.c{text-align:center}
.abc{white-space:nowrap;line-height:1}.abc span{display:inline-block;position:relative;font-family:'Titan One',sans-serif;margin:0 -7px}
.esc{font-weight:600;line-height:1.15}.ser{font-weight:500;margin-top:6px}
.ex{position:absolute;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;background:linear-gradient(#efe9f9,#cbc1e4);color:#8f84ad;font:600 23px 'Fredoka',sans-serif;letter-spacing:3px}`;

function pagina({ dentro, fora, janela, textos, turma }, previa) {
  const svg = `<svg class="cena" xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${BASE_DEFS}${DEFS.join("")}` +
    `<mask id="furo" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#fff"/>${janela.furo}</mask></defs>` +
    `<g mask="url(#furo)">${dentro}${janela.sombra}<rect width="${W}" height="${H}" filter="url(#papel)" opacity=".3" style="mix-blend-mode:soft-light"/></g>${fora}</svg>`;
  return `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="../fontes/fontes.css"><style>${CSS}</style></head><body><div id="tela">` +
    `${previa ? exemplo(janela.caixa, turma) : ""}${svg}<div class="tx">${textos(previa)}</div></div></body></html>`;
}

// ---------------------------------------------------------------- variação 1: noite das lanternas
function v1(lado) {
  const frente = lado === "frente";
  const jan = frente ? oval(872, 414, 228, 326) : retangulo(96, 150, 989, 654);
  let d = `<rect width="${W}" height="${H}" fill="${gstops([[0, "#15103f"], [.36, "#2f2273"], [.62, "#5f3a9c"], [.8, "#b25ea4"], [.92, "#f2978e"], [1, "#ffd092"]])}"/>` +
    `<ellipse cx="430" cy="800" rx="660" ry="300" fill="${grad([[0, "#ffc98a", .6], [1, "#ffc98a", 0]])}"/>` + estrelas(11, 120, 520) + lua(frente ? 104 : 1118, frente ? 88 : 70, frente ? 38 : 30) +
    luzinhas(21, 170, [0, 20, W, 660]);
  const zonas = frente ? [[0, 120, 640, 560], [580, 40, 1150, 800]] : [[70, 20, 1111, 830]];
  d += lanternas(41, frente ? 20 : 26, [14, 24, W - 14, frente ? 640 : 780], zonas, [.5, 1]);
  d += banco(frente ? 700 : 792, "#5e41a6", "#3c2a7c", 31);
  if (frente) d += castelo(292, 776, .6, CAST_NOITE);
  d += banco(frente ? 756 : 820, "#e56fa9", "#b04589", 32) + banco(frente ? 806 : 848, "#8566d6", "#5a43a8", 33) + banco(frente ? 852 : 876, "#2c1d68", "#1a1145", 34, { rMin: 60, rMax: 120 });
  const grandes = frente ? [[36, 566, 1.5, -8], [596, 64, 1.45, 10], [1150, 92, 1.5, 8], [596, 640, 1.2, -9]] : [[46, 150, 1.6, -8], [1136, 250, 1.5, 9], [42, 470, 1.25, 7], [1140, 560, 1.3, -8], [50, 720, 1.05, 5], [1132, 772, 1.1, 6]];
  d += grandes.map((l) => lanterna(...l)).join("");
  let o = jan.aro();
  if (frente) {
    o += tranca(arco(872, 414, 228 + 40, 326 + 40, 196, 112), 38, { flores: [[.07, "#ff6fae", .56], [.3, "#ffffff", .5], [.53, "#b57bf0", .56], [.76, "#ff9a5c", .46]] });
    o += ramalhete(872 + 246 * Math.cos(-.72), 414 + 344 * Math.sin(-.72), 1, ...RAM_A);
  } else {
    o += ramalhete(110, 164, 1.05, ...RAM_A) + tranca(curva([[[1108, 560], [1122, 660], [1126, 770], [1088, 818]], [[1088, 818], [1040, 846], [900, 838], [810, 828]]]), 34, { flores: [[.12, "#ff6fae", .56], [.4, "#ffffff", .5], [.68, "#b57bf0", .52]] });
  }
  const sombraTx = "text-shadow:0 3px 0 #2a1763,0 7px 14px rgba(10,4,40,.55)";
  const textos = (p) => frente
    ? `<div class="sw" style="left:86px;top:142px;font-size:68px;color:#fff;${sombraTx}">Formandos do</div>${abc(72, 214, 205, [ROSA, OURO, VERDE])}` +
      (p ? `<div style="left:90px;top:456px;width:520px;color:#fff;${sombraTx}"><div class="esc" style="font-size:30px">${TX.escola}</div><div class="ser" style="font-size:24px;color:#ffe7a6">${TX.serie}</div></div>` +
        `<div class="sw c" style="left:602px;top:788px;width:540px;font-size:42px;color:#fff;${sombraTx}">${TX.aluno}</div>` : "")
    : (p ? `<div class="sw c" style="left:60px;top:46px;width:1061px;font-size:52px;color:#fff;${sombraTx}">${TX.escola}</div>` : "");
  return { dentro: d, fora: o, janela: jan, textos, turma: !frente };
}

// ---------------------------------------------------------------- variação 2: a torre ao entardecer
function v2(lado) {
  const frente = lado === "frente";
  const jan = frente ? janelaArco(672, 104, 436, 640) : retangulo(182, 150, 912, 640);
  const tx = frente ? 150 : 92, ty = frente ? 806 : 818, ts = frente ? .84 : .7;
  let d = `<rect width="${W}" height="${H}" fill="${gstops([[0, "#6a67d6"], [.34, "#b78ae6"], [.62, "#ff9fc2"], [.84, "#ffc79b"], [1, "#ffe6ad"]])}"/>` +
    `<circle cx="${frente ? 452 : 640}" cy="650" r="340" fill="${grad([[0, "#fff1b8", .85], [1, "#fff1b8", 0]])}"/><circle cx="${frente ? 452 : 640}" cy="650" r="128" fill="#fff6cf"/>` +
    luzinhas(51, 60, [0, 10, W, 420], "#ffffff") + nuvem(frente ? 22 : 230, frente ? 96 : 44, frente ? .8 : .55, "#ffffff") + nuvem(frente ? 20 : 930, frente ? 300 : 40, frente ? .6 : .55, "#fbeaff") +
    `<path d="M-40 ${H}V664C60 610 150 660 250 640S430 560 540 640S720 600 820 650S1040 590 1230 660V${H}Z" fill="${gl("#a99bea", "#8a7bd8")}" filter="url(#sombraC)"/>`;
  if (frente) d += castelo(566, 676, .3, CAST_CLARO);
  d += colina(frente ? 716 : 800, "#62c9a6", "#2f9d83", 61) + colina(frente ? 772 : 836, "#86d67c", "#4bae5e", 62, 26) + torre(tx, ty, ts) + colina(frente ? 838 : 872, "#b2e486", "#6cc266", 63, 16);
  const r = R(71);
  for (let i = 0; i < (frente ? 16 : 12); i++) { const x = 200 + r() * (W - 220), y = (frente ? 800 : 846) + r() * (frente ? 70 : 30); d += flor(x, y, 7 + r() * 6, FLORES[i % FLORES.length], { rot: i * 31 }); }
  d += frente ? bandeirolas(232, 26, 690, 46, 10, ["#9a5be6", "#ff6fae", "#ffcb2e", "#ffffff"]) + borboleta(248, 566, .85, 18, "#ff8fc0", "#ffd0e4")
    : borboleta(1138, 300, 1, -14, "#ff8fc0", "#ffd0e4") + borboleta(1132, 560, .8, 18, "#b57bf0", "#e3ccff") + lanterna(1136, 150, 1.1, 6) + lanterna(1140, 430, .8, -8);
  const jx = tx + 4, jy = ty - 474 * ts;
  let o = jan.aro();
  const linha = frente
    ? curva([[[jx - 4, jy - 8], [jx + 62, jy + 40], [jx + 44, jy + 190], [jx + 62, jy + 290]], [[jx + 62, jy + 290], [jx + 80, jy + 380], [300, 852], [430, 822]], [[430, 822], [520, 800], [560, 770], [636, 800]]])
    : curva([[[jx - 4, jy - 6], [jx + 52, jy + 34], [jx + 40, jy + 170], [jx + 54, jy + 260]], [[jx + 54, jy + 260], [jx + 66, jy + 330], [210, 870], [330, 846]], [[330, 846], [470, 818], [600, 866], [760, 840]]]);
  const tr = tranca(linha, frente ? 36 : 32, { flores: [[.1, "#ff6fae", .54], [.27, "#ffffff", .48], [.45, "#b57bf0", .54], [.62, "#ff9a5c", .46], [.8, "#ff6fae", .5]], laco: "#ff5fa6" });
  if (frente) { d += tr; o += faixa(890, 806, 452, 62, "#ff6fb0", "#e23f8b", "#b3256a") + ramalhete(684, 742, .8, ...RAM_B) + ramalhete(1098, 744, .8, ...RAM_B); } else o += tr + ramalhete(1088, 786, .9, ...RAM_A) + ramalhete(196, 162, .8, ...RAM_B);
  const sombraTx = "text-shadow:0 2px 0 #5a2ea6,0 5px 12px rgba(40,10,90,.45)";
  const textos = (p) => frente
    ? `<div class="sw" style="left:262px;top:128px;font-size:58px;color:#fff;${sombraTx}">Formandos do</div>${abc(250, 190, 182, [ROXO, OURO, ROSA], "rgba(60,20,110,.45)")}` +
      (p ? `<div style="left:264px;top:410px;width:392px;color:#fff;${sombraTx}"><div class="esc" style="font-size:27px">${TX.escola}</div><div class="ser" style="font-size:22px;color:#fff6cf">${TX.serie}</div></div>` +
        `<div class="sw c" style="left:664px;top:784px;width:452px;font-size:33px;line-height:44px;color:#fff;text-shadow:0 2px 0 #9c1f5c">${TX.aluno}</div>` : "")
    : (p ? `<div class="sw c" style="left:182px;top:48px;width:912px;font-size:50px;color:#fff;${sombraTx}">${TX.escola}</div>` : "");
  return { dentro: d, fora: o, janela: jan, textos, turma: !frente };
}

// ---------------------------------------------------------------- variação 3: jardim claro com a trança em volta da foto
function v3(lado) {
  const frente = lado === "frente";
  const jan = frente ? oval(318, 430, 208, 292) : retangulo(96, 150, 989, 636);
  const r = R(81);
  let d = `<rect width="${W}" height="${H}" fill="${gstops([[0, "#fff7ea"], [1, "#efdfff"]], 0, 0, 1, 1)}"/><ellipse cx="760" cy="380" rx="620" ry="420" fill="${grad([[0, "#ffffff", .9], [1, "#ffffff", 0]])}"/>`;
  for (let i = 0; i < 46; i++) d += `<circle cx="${f(r() * W)}" cy="${f(r() * H * .9)}" r="${f(6 + r() * 22)}" fill="${["#ffc1dc", "#d9bcff", "#ffe29a"][i % 3]}" opacity="${f(.14 + r() * .2)}" filter="url(#b2)"/>`;
  d += estrelas(83, 26, 700, "#f3b93a");
  if (frente) d += bandeirolas(-12, 22, 1193, 22, 17, ["#9a5be6", "#ff6fae", "#ffcb2e", "#c9a2f5"], 20, "#b9a0dd");
  d += lanternas(85, frente ? 8 : 6, frente ? [560, 110, 1160, 700] : [10, 160, 1171, 760], frente ? [[590, 130, 1130, 690]] : [[90, 0, 1091, 886]], [.6, .95]);
  d += banco(frente ? 770 : 826, "#ecd9ff", "#d6b8f5", 86);
  if (frente) d += castelo(1004, 812, .42, CAST_CLARO);
  d += banco(frente ? 812 : 850, "#bf97ee", "#9c6bd9", 87) + banco(frente ? 852 : 874, "#8452c9", "#63379f", 88, { rMin: 60, rMax: 120 });
  let o = jan.aro();
  const textos = (p) => frente
    ? `<div class="sw c" style="left:590px;top:128px;width:540px;font-size:62px;color:#5b2a91;text-shadow:0 2px 0 #fff,0 6px 12px rgba(91,42,145,.25)">Formandos do</div>${abc(672, 196, 190, [ROXO, OURO, ROSA], "rgba(60,20,110,.35)")}` +
      (p ? `<div class="c" style="left:590px;top:428px;width:540px;color:#5b2a91"><div class="esc" style="font-size:29px">${TX.escola}</div><div class="ser" style="font-size:23px;color:#a3489f">${TX.serie}</div></div>` +
        `<div class="sw c" style="left:590px;top:603px;width:540px;font-size:37px;line-height:66px;color:#fff;text-shadow:0 2px 0 #4a1f8a">${TX.aluno}</div>` : "")
    : (p ? `<div class="sw c" style="left:60px;top:46px;width:1061px;font-size:52px;color:#5b2a91;text-shadow:0 2px 0 #fff,0 6px 12px rgba(91,42,145,.25)">${TX.escola}</div>` : "");
  if (frente) {
    o += tranca(arco(318, 430, 208 + 38, 292 + 38, 100, 460), 38, { afina: 1, ponta: false, flores: [[.2, "#ffffff", .46], [.36, "#ff6fae", .5], [.62, "#b57bf0", .5], [.8, "#ffffff", .46]] });
    o += ramalhete(250, 746, 1.2, ...RAM_A) + ramalhete(498, 196, .95, ...RAM_B) + faixa(860, 636, 500, 66, "#9a5be6", "#6f3cc4", "#4f2797");
  } else {
    o += tranca(curva([[[130, 800], [400, 812], [760, 792], [1040, 806]]]), 34, { afina: .8, flores: [[.16, "#ffffff", .5], [.34, "#ff6fae", .54], [.52, "#b57bf0", .52], [.7, "#ffffff", .48], [.88, "#ff9a5c", .46]] });
    o += ramalhete(112, 792, 1.15, ...RAM_A) + ramalhete(1078, 166, 1, ...RAM_A) + ramalhete(1082, 640, .7, ...RAM_B) + ramalhete(104, 300, .7, ...RAM_B);
  }
  return { dentro: d, fora: o, janela: jan, textos, turma: !frente };
}

fs.mkdirSync("html", { recursive: true });
for (const [nome, fn] of [["v1", v1], ["v2", v2], ["v3", v3]]) {
  for (const lado of ["frente", "verso"]) {
    for (const previa of [true, false]) {
      _n = 0; DEFS = [];
      fs.writeFileSync(`html/${nome}-${lado}-${previa ? "previa" : "limpo"}.html`, pagina(fn(lado), previa));
    }
  }
}
console.log("html pronto");

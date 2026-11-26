// Placas de formatura do ABC, 20×15 cm, versão realista no estilo pedido: cena 3D (fundos/*.jpg), moldura oval
// creme com filetes dourados, "Formandos do" em cursiva roxa e "ABC" em serifa roxa com contorno dourado,
// plaquinha creme com nome, escola e série, e cubinhos de madeira com A, B e C (blocos/*.png).
//   node placa-real.mjs   → html/r<1-3>-<frente|verso>-<previa|limpo>.html   (depois: node render.js 2 r)
import fs from "node:fs";

const W = 1181, H = 886; // 20×15 cm a 150 dpi; o render usa escala 2 (300 dpi)
const TX = { aluno: "Nome Completo do Aluno", escola: "Nome da Escola", serie: "Série / Turma" };

const DEFS = `
<linearGradient id="roxo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9b4fe0"/><stop offset=".55" stop-color="#6a26b4"/><stop offset="1" stop-color="#4a1386"/></linearGradient>
<linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9a6a0c"/><stop offset=".2" stop-color="#f7d774"/><stop offset=".34" stop-color="#fff7cf"/><stop offset=".5" stop-color="#d9a520"/><stop offset=".7" stop-color="#a8780f"/><stop offset=".85" stop-color="#f3cf62"/><stop offset="1" stop-color="#b07a12"/></linearGradient>
<linearGradient id="creme" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fffaf0"/><stop offset=".5" stop-color="#f8edd2"/><stop offset="1" stop-color="#ead6a8"/></linearGradient>
<linearGradient id="cartao" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffdf6"/><stop offset="1" stop-color="#f6ead0"/></linearGradient>
<radialGradient id="vinheta"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></radialGradient>
<filter id="sombra" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#1a0c30" flood-opacity=".45"/></filter>
<filter id="sombraTx" x="-10%" y="-30%" width="120%" height="170%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#2a0f4a" flood-opacity=".55"/></filter>
<filter id="b3"><feGaussianBlur stdDeviation="3"/></filter>`;

// Janela da foto: forma com folga, para desenhar furo, sombra e moldura com o mesmo contorno.
const ovalEl = (cx, cy, rx, ry) => (o, a) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx + o}" ry="${ry + o}" ${a}/>`;
const retEl = (x, y, w, h, r) => (o, a) => `<rect x="${x - o}" y="${y - o}" width="${w + 2 * o}" height="${h + 2 * o}" rx="${r + o}" ${a}/>`;
const linha = (el, o, cor, larg, op = 1) => el(o, `fill="none" stroke="${cor}" stroke-width="${larg}" stroke-opacity="${op}"`);
// moldura creme como a da referência: faixa marfim com filete dourado por dentro e por fora
const moldura = (el) =>
  `<g filter="url(#sombra)">${linha(el, 14, "url(#metal)", 5)}${linha(el, 13, "url(#creme)", 26)}</g>` +
  linha(el, 25.5, "#fff9e6", 1.6, .9) + linha(el, 2, "url(#metal)", 4) + linha(el, 0, "#7a5408", 1.2, .6) + el(-6, `fill="none" stroke="#000" stroke-opacity=".22" stroke-width="10" filter="url(#b3)"`);

// Texto com contorno branco e sombra (por baixo) e preenchimento roxo; opcional filete dourado.
function titulo(t, x, y, tam, familia, peso = 400, ouro = 0, anchor = "middle") {
  const base = `x="${x}" y="${y}" font-family="${familia}" font-size="${tam}" font-weight="${peso}" text-anchor="${anchor}"`;
  return `<g filter="url(#sombraTx)"><text ${base} fill="#fff" stroke="#fff" stroke-width="${Math.round(tam * .085)}" stroke-linejoin="round">${t}</text></g>` +
    (ouro ? `<text ${base} fill="none" stroke="url(#metal)" stroke-width="${ouro}" stroke-linejoin="round">${t}</text>` : "") +
    `<text ${base} fill="url(#roxo)">${t}</text>`;
}

function exemplo([x, y, w, h], turma) {
  const boneco = `<circle cx="50" cy="34" r="19"/><path d="M12 100c0-24 17-41 38-41s38 17 38 41z"/>`;
  const fig = turma
    ? `<svg viewBox="0 0 520 130" width="${Math.round(w * .5)}" fill="#c3b8d6">${[0, 1, 2, 3, 4].map((i) => `<g transform="translate(${i * 84 + (i > 3 ? 20 : 0)} ${i > 3 ? 0 : 30}) scale(${i > 3 ? 1.3 : 1})">${boneco}</g>`).join("")}</svg>`
    : `<svg viewBox="0 0 100 100" width="${Math.round(w * .48)}" fill="#c3b8d6">${boneco}</svg>`;
  return `<div class="ex" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">${fig}<div>${turma ? "FOTO DA TURMA" : "FOTO DO ALUNO"}</div></div>`;
}

const CSS = `html,body{margin:0;background:transparent}#tela{position:relative;width:${W}px;height:${H}px;overflow:hidden}
svg.cena{position:absolute;left:0;top:0}.ex{position:absolute;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;
background:linear-gradient(#f6f1fb,#ddd3ec);color:#9b8fb3;font:600 22px 'Fredoka',sans-serif;letter-spacing:3px}`;

function pagina({ fundo, espelhar, el, caixa, por_cima }, previa, turma) {
  const img = `<image href="../fundos/${fundo}.jpg" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice"${espelhar ? ` transform="translate(${W} 0) scale(-1 1)"` : ""}/>`;
  const svg = `<svg class="cena" xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${DEFS}` +
    `<mask id="furo" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#fff"/>${el(0, `fill="#000"`)}</mask></defs>` +
    `<g mask="url(#furo)">${img}<rect width="${W}" height="${H}" fill="url(#vinheta)"/></g>${moldura(el)}${por_cima(previa)}</svg>`;
  return `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="../fontes/fontes.css"><style>${CSS}</style></head><body><div id="tela">` +
    `${previa ? exemplo(caixa, turma) : ""}${svg}</div></body></html>`;
}

// Plaquinha creme com nome (cursiva roxa), escola e série.
function plaquinha(cx, y, w, h, previa) {
  const x = cx - w / 2;
  let s = `<g filter="url(#sombra)"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="url(#cartao)"/></g>` +
    `<rect x="${x + 2}" y="${y + 2}" width="${w - 4}" height="${h - 4}" rx="16" fill="none" stroke="url(#metal)" stroke-width="3.5"/>` +
    `<rect x="${x + 9}" y="${y + 9}" width="${w - 18}" height="${h - 18}" rx="11" fill="none" stroke="#c9a24a" stroke-opacity=".55" stroke-width="1.2"/>`;
  if (previa) {
    s += `<text x="${cx}" y="${y + 56}" font-family="Playball" font-size="38" fill="url(#roxo)" text-anchor="middle">${TX.aluno}</text>` +
      `<text x="${cx}" y="${y + 96}" font-family="Fredoka" font-weight="600" font-size="23" fill="#5a1f96" text-anchor="middle">${TX.escola}</text>` +
      `<text x="${cx}" y="${y + 126}" font-family="Fredoka" font-weight="500" font-size="19" fill="#8a5bb8" text-anchor="middle">${TX.serie}</text>`;
  }
  return s;
}

const blocos = (nome, x, y, w) => {
  const [bw, bh] = nome === "pilha" ? [940, 810] : [991, 378];
  return `<image href="../blocos/${nome}-recorte.png" x="${x}" y="${y}" width="${w}" height="${Math.round(w * bh / bw)}"/>`;
};

// Frente: coluna com título, oval e plaquinha; a cena fica à mostra do outro lado.
function frente(fundo, lado, espelhar, blocosX) {
  const X = lado === "dir" ? 880 : 300;
  const [cx, cy, rx, ry] = [X, 466, 190, 222];
  return {
    fundo, espelhar, el: ovalEl(cx, cy, rx, ry), caixa: [cx - rx - 4, cy - ry - 4, 2 * rx + 8, 2 * ry + 8],
    por_cima: (previa) => titulo("Formandos do", X, 80, 64, "Playball") + titulo("ABC", X, 210, 146, "Cinzel", 900, 5) +
      plaquinha(X, 718, 480, 146, previa) + blocos("pilha", blocosX, 650, 200),
  };
}
// Verso: foto da turma com a mesma moldura e o nome da escola em cima.
function verso(fundo, espelhar) {
  const [x, y, w, h] = [118, 176, 945, 612];
  return {
    fundo, espelhar, el: retEl(x, y, w, h, 14), caixa: [x - 4, y - 4, w + 8, h + 8],
    por_cima: (previa) => (previa ? titulo(TX.escola, W / 2, 118, 62, "Playball") : "") + blocos("fila", 868, 752, 290),
  };
}

const VARIACOES = {
  r1: { fundo: "vale", lado: "dir", espelhar: false, blocosX: 452 },
  r2: { fundo: "jardim", lado: "esq", espelhar: true, blocosX: 560 },
  r3: { fundo: "lanternas", lado: "dir", espelhar: false, blocosX: 446 },
};

fs.mkdirSync("html", { recursive: true });
for (const [nome, v] of Object.entries(VARIACOES)) {
  for (const previa of [true, false]) {
    const tipo = previa ? "previa" : "limpo";
    fs.writeFileSync(`html/${nome}-frente-${tipo}.html`, pagina(frente(v.fundo, v.lado, v.espelhar, v.blocosX), previa, false));
    fs.writeFileSync(`html/${nome}-verso-${tipo}.html`, pagina(verso(v.fundo, v.espelhar), previa, true));
  }
}
console.log("html pronto");

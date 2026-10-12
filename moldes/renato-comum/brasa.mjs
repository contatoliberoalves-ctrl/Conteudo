// Identidade "Brasa" do curso Interpretação Bíblica (Pastor Renato Torres): cores, fontes e peças comuns
// aos moldes renato-*. O símbolo (V) vem de assets/simbolo.png (fora do git; recrie com preparar_simbolo.py).
import fs from 'node:fs';
import path from 'node:path';
const aqui = path.dirname(new URL(import.meta.url).pathname);
const arq = path.join(aqui, 'assets', 'simbolo.png');
export const SIMB = fs.existsSync(arq) ? 'data:image/png;base64,' + fs.readFileSync(arq).toString('base64') : null;

export const C = { brasa: '#FF4D00', laranja: '#FF8A00', creme: '#FFF4E8', carvao: '#2B0E00', branco: '#FFFFFF' };
export const G = `linear-gradient(90deg,${C.brasa} 0%,${C.laranja} 100%)`;
export const T = "font-family:'Bricolage Grotesque',sans-serif;font-weight:800;letter-spacing:-.035em;text-transform:uppercase";
export const HEAD = `<meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"><style>*{box-sizing:border-box;margin:0}body{font-family:Inter,sans-serif;-webkit-font-smoothing:antialiased}</style>`;
export const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);

// Símbolo pintado com qualquer cor (máscara). Sem o arquivo, um "V" em texto no lugar.
export const sim = (cor, px, extra = '') => SIMB
  ? `<span style="display:block;width:${px}px;height:${px}px;background:${cor};-webkit-mask:url(${SIMB}) center/contain no-repeat;mask:url(${SIMB}) center/contain no-repeat;${extra}"></span>`
  : `<span style="display:block;width:${px}px;height:${px}px;${extra};font:800 ${px}px/1 sans-serif;color:#fff;opacity:.5;text-align:center">V</span>`;
// Assinatura: símbolo no canto inferior direito. Marca-d'água: o V gigante e bem suave saindo pelo canto.
export const canto = (cor, px, m) => sim(cor, px, `position:absolute;right:${m}px;bottom:${m}px;z-index:4`);
export const agua = (px, dx, dy, cor = 'rgba(255,255,255,.09)') => sim(cor, px, `position:absolute;right:${dx}px;bottom:${dy}px`);
export const pill = (txt, px, bg = C.carvao, fg = C.creme) => `<span style="display:inline-block;background:${bg};color:${fg};font-family:Inter;font-weight:700;font-size:${px}px;letter-spacing:.14em;padding:${px * .34}px ${px * .8}px;border-radius:999px;white-space:nowrap">${txt}</span>`;
export const botao = (txt, px, bg = G, fg = '#fff') => `<span style="display:inline-block;background:${bg};color:${fg};font-weight:700;font-size:${px}px;padding:${px * .62}px ${px * 1.3}px;border-radius:999px;white-space:nowrap">${esc(txt)}</span>`;

// Logo: INTERPRETAÇÃO / BÍBLICA + selo RENATO TORRES, símbolo no canto inferior direito do bloco.
export const logo = (s, { cor = C.branco, pBg = C.carvao, pFg = C.creme, simb = cor, semSimbolo = false } = {}) => `<div style="position:relative;display:inline-flex;flex-direction:column;align-items:flex-start;color:${cor}">
  <div style="${T};font-size:${s}px;line-height:.98">Interpretação<br>Bíblica</div>
  <div style="margin-top:${s * .16}px">${pill('RENATO TORRES', s * .17, pBg, pFg)}</div>
  ${semSimbolo ? '' : sim(simb, s * .55, 'position:absolute;right:0;bottom:0')}</div>`;
export const logoH = (s, { cor = C.branco, pBg = C.carvao, pFg = C.creme, simb = cor } = {}) => `<div style="display:inline-flex;align-items:flex-end;gap:${s * .35}px;color:${cor}">
  <div style="${T};font-size:${s}px;line-height:.9;white-space:nowrap">Interpretação Bíblica</div>
  <div style="padding-bottom:${s * .06}px">${pill('RENATO TORRES', s * .26, pBg, pFg)}</div>${sim(simb, s * .75, 'margin-left:' + s * .1 + 'px')}</div>`;

// Fundos: degradê (capa), creme (conteúdo) e carvão (fechamento). Cada um diz a cor do texto,
// do destaque [[...]] e do símbolo.
export const FUNDOS = {
  degrade: { bg: G, tit: '#fff', txt: '#fff', kick: '#fff', sim: '#fff', agua: 'rgba(255,255,255,.09)', dBg: C.carvao, dFg: C.creme, linha: 'rgba(255,255,255,.3)', num: C.carvao },
  creme: { bg: C.creme, tit: C.carvao, txt: C.carvao, kick: C.brasa, sim: C.brasa, agua: 'rgba(255,77,0,.06)', dBg: G, dFg: '#fff', linha: 'rgba(43,14,0,.12)', num: C.brasa },
  carvao: { bg: C.carvao, tit: '#fff', txt: C.creme, kick: C.laranja, sim: C.laranja, agua: 'rgba(255,138,0,.08)', dBg: G, dFg: '#fff', linha: 'rgba(255,244,232,.18)', num: C.laranja },
};
// Texto rico: **negrito** e [[destaque]] (caixa sólida na cor do fundo).
export const rico = (s, f) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b style="font-weight:700">$1</b>')
  .replace(/\[\[(.+?)\]\]/g, `<span style="background:${f.dBg};color:${f.dFg};padding:0 .12em;box-decoration-break:clone;-webkit-box-decoration-break:clone">$1</span>`);

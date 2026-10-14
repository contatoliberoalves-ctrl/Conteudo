// Identidade do Cartório do Registro Civil das Pessoas Naturais de Curral Queimado (titular Líbero Filho):
// carvão do logo, prata escovada do quadrado do emblema, papel claro nas páginas de conteúdo.
// O emblema (pena sobre o quadrado prateado) vem de assets/emblema.png, fora do git: recrie com
// preparar_logo.py a partir da arte do emblema em fundo escuro.
import fs from 'node:fs';
import path from 'node:path';
const aqui = path.dirname(new URL(import.meta.url).pathname);
const arq = path.join(aqui, 'assets', 'emblema.png');
export const EMB = fs.existsSync(arq) ? 'data:image/png;base64,' + fs.readFileSync(arq).toString('base64') : null;
export const EMB_PROP = 840 / 1231; // largura / altura do emblema recortado

export const C = { carvao: '#14130F', carvao2: '#1E1D18', papel: '#F3F2EE', grafite: '#1C1B17', cinza: '#7C7A73', linha: '#D8D6CF', branco: '#FFFFFF' };
// Prata escovada, como no quadrado do emblema (escuro à esquerda, brilho, cinza e brilho de novo).
export const PRATA = 'linear-gradient(90deg,#8E8E8E 0%,#D9D9D9 12%,#FFFFFF 24%,#CFCFCF 46%,#E9E9E9 66%,#FFFFFF 80%,#BDBDBD 100%)';
export const PRATA_V = 'linear-gradient(180deg,#FFFFFF 0%,#D2D2D2 45%,#F4F4F4 70%,#A9A9A9 100%)';
export const HEAD = `<meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Jost:wght@400;500;600&display=swap" rel="stylesheet"><style>*{box-sizing:border-box;margin:0}body{font-family:Jost,sans-serif;-webkit-font-smoothing:antialiased}.prata{background:${PRATA};-webkit-background-clip:text;background-clip:text;color:transparent}.prataV{background:${PRATA_V};-webkit-background-clip:text;background-clip:text;color:transparent}</style>`;
export const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
export const DISPLAY = "font-family:'Cormorant Garamond',serif;font-weight:600;letter-spacing:.01em";
// Jost nas versaletes: a Josefin Sans perde o acento das maiúsculas (DÚVIDA saía DUVIDA).
export const CAPS = "font-family:Jost,sans-serif;font-weight:400;letter-spacing:.16em;text-transform:uppercase";

// Fundos: carvão (capa, destaque, fechamento) e papel (conteúdo). Cada um diz a cor do texto e do destaque.
export const FUNDOS = {
  carvao: { bg: C.carvao, tit: '#fff', txt: '#E9E8E4', sub: '#A9A7A0', linha: 'rgba(255,255,255,.18)', escuro: true },
  papel: { bg: C.papel, tit: C.grafite, txt: C.grafite, sub: C.cinza, linha: C.linha, escuro: false },
};
// Texto rico: **negrito** e [[destaque]] (prata no carvão; sublinhado prata no papel).
export const rico = (s, f) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b style="font-weight:600">$1</b>')
  .replace(/\[\[(.+?)\]\]/g, f.escuro
    ? '<span class="prata" style="font-style:italic">$1</span>'
    : `<span style="font-style:italic;background:linear-gradient(transparent 70%,#CFCFCF 70%,#EDEDED 92%,transparent 92%);padding:0 .06em">$1</span>`);

// Emblema com altura px. Sem o arquivo, um quadrado prateado no lugar.
export const emblema = (px, extra = '') => EMB
  ? `<img src="${EMB}" style="display:block;height:${px}px;width:${Math.round(px * EMB_PROP)}px;${extra}">`
  : `<span style="display:block;height:${px * .66}px;width:${px * .66}px;border-radius:${px * .03}px;background:${PRATA};${extra}"></span>`;

// Logo em texto como na arte: CARTÓRIO em prata, fio e a linha do registro civil.
export const logo = (s, { sub = 'Registro Civil das Pessoas Naturais de Curral Queimado', titular = 'Titular: Líbero Alves Rodrigues Filho | Tabelião', comEmblema = true, fio = true } = {}) => `<div style="display:inline-flex;flex-direction:column;align-items:center;text-align:center">
  ${comEmblema ? `<div style="margin-bottom:${s * .3}px">${emblema(s * 1.5)}</div>` : ''}
  <div class="prata" style="font-family:'Cormorant Garamond',serif;font-weight:500;font-size:${s}px;line-height:1;letter-spacing:.04em">CARTÓRIO</div>
  ${sub ? `<div style="${CAPS};font-size:${s * .155}px;color:#EDEDED;margin-top:${s * .1}px;letter-spacing:.04em;white-space:nowrap">${esc(sub)}</div>` : ''}
  ${fio ? `<div style="height:2px;align-self:stretch;background:${PRATA};margin:${s * .06}px 0"></div>` : ''}
  ${titular ? `<div style="${CAPS};font-size:${s * .13}px;color:#E2E2E2;letter-spacing:.04em;white-space:nowrap">${esc(titular)}</div>` : ''}</div>`;

// Contato do cartório (rodapés, fechamento e PDF).
export const CONTATO = {
  nome: 'Cartório do Registro Civil das Pessoas Naturais de Curral Queimado',
  endereco: ['Rua Ponta da Serra, nº 25, Curral Queimado', 'CEP 56306-660 · Petrolina/PE'],
  telefone: '(87) 98166-3179',
  site: 'registrocivil.net/76745',
};

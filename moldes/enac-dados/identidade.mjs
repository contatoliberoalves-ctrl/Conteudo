// Identidade do "ENAC em dados": jornalismo de dados sobre o Exame Nacional dos Cartórios.
// Tinta (quase preto), osso, lima como cor de dado e coral só para alerta (recurso, divergência).
// Space Grotesk nos títulos e números, IBM Plex Mono nas etiquetas. Cantos retos, sem pílulas e sem emoji.
// Elemento-assinatura: a grade de 100 quadrados, em que cada quadrado é uma questão da prova.
export const C = {
  tinta: '#0B0D10', grafite: '#161A20', linha: '#2B313B', osso: '#F3F1EA',
  lima: '#C6FF3D', coral: '#FF5C39', azul: '#6FA3FF', cinza: '#8A93A3', apagado: '#3A414D',
};
// Variações de tema, para os vídeos e capas não parecerem todos iguais no feed. Mesma paleta, papéis trocados:
// noite (padrão: fundo tinta), papel (fundo osso, dado em tinta, destaque em marca-texto lima) e lima (fundo lima).
const BASE = { ...C };
const T = { hl: `color:${BASE.lima}`, brilho: BASE.lima + '1f', ponto: '#ffffff1c' };
export const TEMAS = {
  noite: {},
  papel: { tinta: '#F3F1EA', osso: '#0B0D10', grafite: '#E8E4D7', linha: '#CBC6B6', cinza: '#5B616B', lima: '#0B0D10', apagado: '#D5D0C2', coral: '#D93A17', azul: '#2D5BE3',
    hl: 'background:#C6FF3D;color:#0B0D10;padding:0 .1em', brilho: '#C6FF3D66', ponto: '#0000001c' },
  lima: { tinta: '#C6FF3D', osso: '#0B0D10', grafite: '#B6EC30', linha: '#8FBF1F', cinza: '#3B4A12', lima: '#0B0D10', apagado: '#A6DB26', coral: '#B3240A', azul: '#1D3FAE',
    hl: 'background:#0B0D10;color:#C6FF3D;padding:0 .1em', brilho: '#ffffff66', ponto: '#00000020' },
};
export function aplicarTema(nome = 'noite') {
  const { hl, brilho, ponto, ...cores } = TEMAS[nome] || {};
  Object.assign(C, BASE, cores);
  Object.assign(T, { hl: hl || `color:${BASE.lima}`, brilho: brilho || BASE.lima + '1f', ponto: ponto || '#ffffff1c' });
}
export const destaque = () => T.hl;
export const PERFIL = '@enacemdados';
export const FONTES = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap';
export const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// [[trecho]] em lima; {{trecho}} em coral
export const tit = s => esc(s).replace(/\[\[(.+?)\]\]/g, (_, x) => `<span style="${T.hl};box-decoration-break:clone;-webkit-box-decoration-break:clone">${x}</span>`).replace(/\{\{(.+?)\}\}/g, (_, x) => `<span style="color:${C.coral}">${x}</span>`);
export const cor = c => C[c] || c || C.lima;

export const cssBase = () => `
*{box-sizing:border-box;margin:0}
body{background:${C.tinta}}
.tela{position:relative;overflow:hidden;background:${C.tinta};color:${C.osso};font-family:'Space Grotesk',sans-serif}
.tit{font-family:'Space Grotesk',sans-serif;font-weight:700;letter-spacing:-.04em;line-height:.98}
.mono{font-family:'IBM Plex Mono',monospace;font-weight:600;text-transform:uppercase;letter-spacing:.12em}
.txt{font:500 44px/1.32 'Space Grotesk',sans-serif;color:${C.osso}}
.etq{display:inline-flex;align-items:center;gap:16px;border:2px solid ${C.linha};background:${C.grafite};padding:13px 20px;font:600 25px 'IBM Plex Mono',monospace;text-transform:uppercase;letter-spacing:.12em;color:${C.osso}}
.etq i{width:14px;height:14px;background:${C.lima};flex:none}
`;
// fundo: tinta com malha de pontos e um clarão de lima no canto
export const fundo = () => `<div style="position:absolute;inset:0;background:radial-gradient(60% 40% at 88% 4%,${T.brilho} 0%,transparent 70%),${C.tinta}"></div>
<div style="position:absolute;inset:0;background-image:radial-gradient(${T.ponto} 2px,transparent 2.4px);background-size:45px 45px;background-position:22px 22px"></div>`;
export const etiqueta = (t, c = 'lima') => `<span class="etq"><i style="background:${cor(c)}"></i>${esc(t)}</span>`;
// marca: três barras subindo + ENAC / em dados
export const logo = (px = 44, clara = false) => {
  const b = (h) => `<i style="width:${px * .2}px;height:${px * h}px;background:${C.lima}"></i>`;
  return `<div style="display:inline-flex;align-items:flex-end;gap:${px * .32}px">
    <div style="display:flex;align-items:flex-end;gap:${px * .09}px;height:${px}px">${b(.42)}${b(.7)}${b(1)}</div>
    <div style="display:flex;flex-direction:column;justify-content:flex-end;height:${px}px">
      <span style="font:700 ${px * .78}px/.8 'Space Grotesk';letter-spacing:-.04em;color:${clara ? C.tinta : C.osso}">ENAC</span>
      <span style="font:600 ${px * .25}px/1 'IBM Plex Mono';letter-spacing:.2em;text-transform:uppercase;color:${clara ? C.tinta : C.lima};margin-top:${px * .1}px">em dados</span></div></div>`;
};
// grade de 100: grupos = [{n, cor}], estilo(i, grupo) devolve CSS extra de cada quadrado (animação nos vídeos)
export const grade = (grupos, lado = 900, estilo = () => '') => {
  const gap = lado * .0148, cel = (lado - gap * 9) / 10;
  const cores = grupos.flatMap((g, k) => Array(g.n).fill([cor(g.cor), k]));
  return `<div style="display:grid;grid-template-columns:repeat(10,${cel}px);gap:${gap}px;width:${lado}px">${Array.from({ length: 100 }, (_, i) => {
    const [c, k] = cores[i] || [C.apagado, -1];
    return `<i style="height:${cel}px;background:${c};${estilo(i, k)}"></i>`;
  }).join('')}</div>`;
};

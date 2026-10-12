// Molde "Renato · E-mail" (Interpretação Bíblica, identidade Brasa): cabeçalhos de e-mail em 1200 px de
// largura (use com 600 px no e-mail). Estilos: "faixa" (1200×400, título grande) e "completo" (1200×640,
// título, texto e botão). Fundo: degrade, creme ou carvao.
import { C, FUNDOS, T, agua, canto, esc, lista, logoH, pill, botao, rico } from '../renato-comum/brasa.mjs';

export function slides(c) {
  const completo = c.estilo === 'completo';
  const f = FUNDOS[c.fundo] || FUNDOS[completo ? 'carvao' : 'degrade'];
  const [w, h] = completo ? [1200, 640] : [1200, 400];
  const rotulo = f === FUNDOS.degrade
    ? `<div style="font-weight:700;font-size:20px;letter-spacing:.2em;color:#fff">INTERPRETAÇÃO BÍBLICA <span style="opacity:.75">· RENATO TORRES</span></div>`
    : pill('INTERPRETAÇÃO BÍBLICA · RENATO TORRES', 18, C.brasa, '#fff');
  const html = completo
    ? `<div style="position:absolute;left:0;right:0;top:0;height:14px;background:linear-gradient(90deg,${C.brasa},${C.laranja})"></div>
      <div style="position:absolute;left:80px;top:80px">${logoH(40, { cor: f.tit, simb: f.sim, pBg: C.brasa, pFg: '#fff' })}</div>
      <div data-cabe style="position:absolute;left:80px;right:200px;top:170px;bottom:110px;display:flex;flex-direction:column;gap:26px;overflow:hidden">
        <div style="${T};font-size:${c.ts || 96}px;line-height:.98;color:${f.tit}">${rico(c.titulo, f)}</div>
        ${c.texto ? `<p style="font-size:30px;font-weight:500;line-height:1.4;color:${f.txt};opacity:.9;max-width:800px">${rico(c.texto, f)}</p>` : ''}</div>
      ${c.botao ? `<div style="position:absolute;left:80px;bottom:56px">${botao(c.botao, 30)}</div>` : ''}`
    : `<div style="position:absolute;left:70px;top:58px">${rotulo}</div>
      <div data-cabe style="position:absolute;left:70px;right:170px;top:116px;bottom:30px;overflow:hidden"><div style="${T};font-size:${c.ts || 96}px;line-height:.98;color:${f.tit}">${rico(c.titulo, f)}</div></div>`;
  return { w, h, slides: [`<div style="position:absolute;inset:0;background:${f.bg}"></div>${agua(completo ? 900 : 760, completo ? -200 : -170, completo ? -330 : -300, f.agua)}${html}${canto(f.sim, completo ? 90 : 84, completo ? 50 : 44)}`] };
}

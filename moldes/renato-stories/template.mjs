// Molde "Renato · Stories" (Interpretação Bíblica, identidade Brasa): stories 1080×1920.
// Tipos: logo (abertura com o logo e uma frase), versiculo, aviso (título grande + texto + botão), lista.
import { C, FUNDOS, T, agua, canto, esc, lista, logo, pill, botao, rico } from '../renato-comum/brasa.mjs';

const selo = f => pill('INTERPRETAÇÃO BÍBLICA · RENATO TORRES', 26, f === FUNDOS.degrade ? C.carvao : C.brasa, f === FUNDOS.degrade ? C.creme : '#fff');
const area = (html, extra = '') => `<div data-cabe style="position:absolute;left:110px;right:110px;top:200px;bottom:200px;display:flex;flex-direction:column;gap:50px;overflow:hidden;${extra}">${html}</div>`;
const TIPOS = {
  logo: (s, f) => area(`${logo(118, { cor: f.tit, pBg: f === FUNDOS.degrade ? C.carvao : C.brasa, pFg: f === FUNDOS.degrade ? C.creme : '#fff', semSimbolo: true })}
    <div style="margin-top:auto;font-family:'Bricolage Grotesque';font-weight:700;font-size:${s.ts || 72}px;line-height:1.15;color:${f.tit}">${rico(s.texto || '', f)}</div>${s.botao ? `<div>${botao(s.botao, 44, f === FUNDOS.degrade ? C.carvao : undefined, f === FUNDOS.degrade ? C.creme : undefined)}</div>` : ''}`),
  versiculo: (s, f) => area(`<div>${selo(f)}</div><div style="margin-top:auto;font-family:'Bricolage Grotesque';font-weight:700;font-size:${s.ts || 66}px;line-height:1.2;color:${f.tit}">“${rico(s.texto, f)}”</div>
    <div style="font-weight:700;font-size:32px;letter-spacing:.2em;text-transform:uppercase;color:${f.txt};opacity:.85;margin-bottom:auto">${esc(s.ref)}</div>${s.botao ? `<div>${botao(s.botao, 44, f === FUNDOS.degrade ? C.carvao : undefined, f === FUNDOS.degrade ? C.creme : undefined)}</div>` : ''}`),
  aviso: (s, f) => area(`<div>${selo(f)}</div><div style="${T};font-size:${s.ts || 140}px;line-height:1;color:${f.tit}">${rico(s.titulo, f)}</div>
    ${s.texto ? `<div style="font-size:50px;font-weight:500;line-height:1.35;color:${f.txt}">${rico(s.texto, f)}</div>` : ''}${s.botao ? `<div style="margin-top:20px">${botao(s.botao, 46, f === FUNDOS.degrade ? C.carvao : undefined, f === FUNDOS.degrade ? C.creme : undefined)}</div>` : ''}`, 'justify-content:center'),
  lista: (s, f) => area(`<div>${selo(f)}</div><div style="font-family:'Bricolage Grotesque';font-weight:800;font-size:${s.ts || 100}px;line-height:1.02;letter-spacing:-.035em;color:${f.tit}">${rico(s.titulo, f)}</div>
    <div style="display:flex;flex-direction:column;gap:30px">${lista(s.itens).map((t, i) => `<div style="display:flex;gap:28px;align-items:baseline;padding-bottom:26px;border-bottom:2px solid ${f.linha}"><span style="font-family:'Bricolage Grotesque';font-weight:800;font-size:46px;color:${f.num}">${String(i + 1).padStart(2, '0')}</span><span style="font-size:48px;font-weight:500;line-height:1.3;color:${f.txt}">${rico(t, f)}</span></div>`).join('')}</div>
    ${s.botao ? `<div style="margin-top:20px">${botao(s.botao, 46)}</div>` : ''}`, 'justify-content:center'),
};
export function slides(c) {
  return { w: 1080, h: 1920, slides: lista(c.slides).map(s => {
    const f = FUNDOS[s.fundo] || FUNDOS[{ aviso: 'carvao', lista: 'creme' }[s.tipo] || 'degrade'];
    return `<div style="position:absolute;inset:0;background:${f.bg}"></div>${agua(1500, -500, -380, f.agua)}${(TIPOS[s.tipo] || TIPOS.aviso)(s, f)}${canto(f.sim, 140, 100)}`;
  }) };
}

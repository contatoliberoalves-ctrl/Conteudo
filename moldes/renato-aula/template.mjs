// Molde "Renato · Aula" (Interpretação Bíblica, identidade Brasa): slides de aula 16:9 (1920×1080) e,
// com "formato": "youtube", miniaturas 1280×720. Tipos: capa, conteudo (texto + cartão com lista),
// citacao (versículo), lista, fim; no YouTube: thumb.
import { C, FUNDOS, T, agua, canto, esc, lista, logo, pill, botao, rico } from '../renato-comum/brasa.mjs';

const assin = f => `<div style="position:absolute;left:150px;bottom:90px;font-weight:700;font-size:24px;letter-spacing:.2em;color:${f.txt};opacity:.6">INTERPRETAÇÃO BÍBLICA · RENATO TORRES</div>`;
const kicker = (s, f) => s.kicker ? `<div style="font-weight:700;font-size:30px;letter-spacing:.2em;text-transform:uppercase;color:${f.kick}">${esc(s.kicker)}</div>` : '';
const tit = (s, f, px, caixa = false) => `<div style="${caixa ? T : "font-family:'Bricolage Grotesque';font-weight:800;letter-spacing:-.035em"};font-size:${s.ts || px}px;line-height:${caixa ? .98 : 1};color:${f.tit}">${rico(s.titulo, f)}</div>`;
const TIPOS = {
  capa: (s, f) => `<div data-cabe style="position:absolute;left:150px;right:300px;top:120px;bottom:260px;display:flex;flex-direction:column;gap:50px;overflow:hidden">
      <div>${pill(esc((s.kicker || '').toUpperCase()), 30, f === FUNDOS.degrade ? C.carvao : C.brasa, f === FUNDOS.degrade ? C.creme : '#fff')}</div>${tit(s, f, 170, true)}</div>
    <div style="position:absolute;left:150px;bottom:100px">${logo(56, { cor: f.tit, semSimbolo: true })}</div>`,
  conteudo: (s, f) => `<div data-cabe style="position:absolute;left:150px;width:${s.cartao ? 980 : 1500}px;top:110px;bottom:170px;display:flex;flex-direction:column;justify-content:center;gap:44px;overflow:hidden">${kicker(s, f)}${tit(s, f, 110)}
      ${lista(s.texto).map(p => `<p style="font-size:${s.corpo || 38}px;line-height:1.4;color:${f.txt};opacity:.9">${rico(p, f)}</p>`).join('')}</div>
    ${s.cartao ? `<div data-cabe style="position:absolute;right:170px;top:180px;width:560px;max-height:720px;overflow:hidden;background:${f === FUNDOS.creme ? '#fff' : 'rgba(255,255,255,.08)'};border-radius:28px;padding:50px;box-shadow:0 20px 50px rgba(43,14,0,.08)">
      <div style="font-weight:700;font-size:26px;letter-spacing:.18em;text-transform:uppercase;color:${f.kick}">${esc(s.cartao.titulo)}</div>
      ${lista(s.cartao.itens).map((q, i) => `<div style="display:flex;gap:20px;align-items:baseline;font-size:36px;font-weight:500;color:${f.txt};padding:18px 0;border-bottom:2px solid ${f.linha}"><span style="font-family:'Bricolage Grotesque';font-weight:800;font-size:28px;color:${f.num}">${String(i + 1).padStart(2, '0')}</span>${rico(q, f)}</div>`).join('')}</div>` : ''}${assin(f)}`,
  lista: (s, f) => `<div data-cabe style="position:absolute;left:150px;right:300px;top:110px;bottom:170px;display:flex;flex-direction:column;justify-content:center;gap:40px;overflow:hidden">${kicker(s, f)}${tit(s, f, 100)}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:26px 60px">${lista(s.itens).map((t, i) => `<div style="display:flex;gap:24px;align-items:baseline;padding-bottom:22px;border-bottom:2px solid ${f.linha}"><span style="font-family:'Bricolage Grotesque';font-weight:800;font-size:38px;color:${f.num}">${String(i + 1).padStart(2, '0')}</span><span style="font-size:${s.corpo || 38}px;font-weight:500;line-height:1.3;color:${f.txt}">${rico(t, f)}</span></div>`).join('')}</div></div>${assin(f)}`,
  citacao: (s, f) => `<div data-cabe style="position:absolute;left:150px;right:330px;top:110px;bottom:170px;display:flex;flex-direction:column;justify-content:center;gap:40px;overflow:hidden">${kicker(s, f)}
      <div style="font-family:'Bricolage Grotesque';font-weight:700;font-size:${s.ts || 76}px;line-height:1.18;color:${f.tit}">“${rico(s.texto, f)}”</div>
      <div style="font-weight:700;font-size:32px;letter-spacing:.2em;text-transform:uppercase;color:${f.txt};opacity:.85">${esc(s.ref)}</div></div>${assin(f)}`,
  fim: (s, f) => `<div data-cabe style="position:absolute;left:150px;right:300px;top:110px;bottom:170px;display:flex;flex-direction:column;justify-content:center;gap:44px;overflow:hidden">${kicker(s, f)}${tit(s, f, 130)}
      ${s.texto ? `<p style="font-size:40px;line-height:1.4;color:${f.txt};opacity:.9">${rico(s.texto, f)}</p>` : ''}${s.botao ? `<div>${botao(s.botao, 38)}</div>` : ''}</div>${assin(f)}`,
  thumb: (s, f) => `<div style="position:absolute;left:80px;top:80px">${pill(esc((s.kicker || '').toUpperCase()), 30, f === FUNDOS.degrade ? C.carvao : C.brasa, f === FUNDOS.degrade ? C.creme : '#fff')}</div>
    <div data-cabe style="position:absolute;left:80px;right:200px;top:180px;bottom:120px;overflow:hidden">${tit(s, f, 116, true)}</div>
    <div style="position:absolute;left:80px;bottom:60px;font-weight:700;font-size:26px;letter-spacing:.16em;color:${f.txt}">INTERPRETAÇÃO BÍBLICA · RENATO TORRES</div>`,
};
export function slides(c) {
  const yt = c.formato === 'youtube';
  const [w, h] = yt ? [1280, 720] : [1920, 1080];
  return { w, h, slides: lista(c.slides).map(s => {
    const f = FUNDOS[s.fundo] || FUNDOS[{ capa: 'degrade', thumb: 'degrade', citacao: 'degrade', fim: 'carvao' }[s.tipo] || 'creme'];
    return `<div style="position:absolute;inset:0;background:${f.bg}"></div>${agua(yt ? 900 : 1300, yt ? -220 : -300, yt ? -300 : -420, f.agua)}${(TIPOS[s.tipo] || TIPOS.conteudo)(s, f)}${canto(f.sim, yt ? 110 : 120, yt ? 56 : 90)}`;
  }) };
}

// Molde "Renato · Carrossel" (Interpretação Bíblica, identidade Brasa): slides 1080×1350.
// Tipos: capa, texto, lista, versiculo, cta. Cada slide escolhe o fundo (degrade, creme, carvao).
import { C, FUNDOS, T, agua, canto, esc, lista, logo, pill, botao, rico } from '../renato-comum/brasa.mjs';

const kicker = (s, f) => s.kicker ? `<div style="font-weight:700;font-size:30px;letter-spacing:.2em;text-transform:uppercase;color:${f.kick}">${esc(s.kicker)}</div>` : '';
const titulo = (s, f, px) => `<div style="font-family:'Bricolage Grotesque';font-weight:800;font-size:${s.ts || px}px;line-height:1.02;letter-spacing:-.035em;color:${f.tit}">${rico(s.titulo, f)}</div>`;
const area = (html, extra = '') => `<div data-cabe style="position:absolute;left:110px;right:110px;top:110px;bottom:260px;display:flex;flex-direction:column;gap:40px;overflow:hidden;${extra}">${html}</div>`;
const rodape = f => `<div style="position:absolute;left:110px;bottom:110px;font-weight:700;font-size:24px;letter-spacing:.2em;color:${f.txt};opacity:.6">INTERPRETAÇÃO BÍBLICA</div>`;

const TIPOS = {
  capa: (s, f) => `${area(`${kicker(s, f)}<div style="margin-top:80px">${titulo(s, f, 132)}</div>${s.texto ? `<div style="font-size:42px;font-weight:500;line-height:1.35;color:${f.txt};opacity:.92">${rico(s.texto, f)}</div>` : ''}`)}
    <div style="position:absolute;left:110px;bottom:110px">${logo(72, { cor: f.tit, pBg: f === FUNDOS.degrade ? C.carvao : C.brasa, pFg: f === FUNDOS.degrade ? C.creme : '#fff', semSimbolo: true })}</div>`,
  texto: (s, f) => `${area(`${kicker(s, f)}${titulo(s, f, 104)}${lista(s.texto).map(p => `<p style="font-size:${s.corpo || 44}px;font-weight:500;line-height:1.38;color:${f.txt}">${rico(p, f)}</p>`).join('')}`, 'justify-content:center')}${rodape(f)}`,
  lista: (s, f) => `${area(`${kicker(s, f)}${titulo(s, f, 104)}<div style="display:flex;flex-direction:column;gap:28px;margin-top:10px">${lista(s.itens).map((t, i) => `<div style="display:flex;gap:28px;align-items:baseline;padding-bottom:24px;border-bottom:2px solid ${f.linha}"><span style="font-family:'Bricolage Grotesque';font-weight:800;font-size:40px;color:${f.num}">${String(i + 1).padStart(2, '0')}</span><span style="font-size:${s.corpo || 42}px;font-weight:500;line-height:1.3;color:${f.txt}">${rico(t, f)}</span></div>`).join('')}</div>`, 'justify-content:center')}${rodape(f)}`,
  versiculo: (s, f) => `${area(`${s.kicker ? pill(esc(s.kicker), 26, f === FUNDOS.degrade ? C.carvao : C.brasa, f === FUNDOS.degrade ? C.creme : '#fff') : ''}<div style="font-family:'Bricolage Grotesque';font-weight:700;font-size:${s.ts || 66}px;line-height:1.2;color:${f.tit}">“${rico(s.texto, f)}”</div><div style="font-weight:700;font-size:32px;letter-spacing:.2em;text-transform:uppercase;color:${f.txt};opacity:.85">${esc(s.ref)}</div>`, 'justify-content:center;align-items:flex-start')}${rodape(f)}`,
  cta: (s, f) => `${area(`${kicker(s, f)}${titulo(s, f, 120)}${s.texto ? `<div style="font-size:44px;font-weight:500;line-height:1.35;color:${f.txt};opacity:.92">${rico(s.texto, f)}</div>` : ''}${s.botao ? `<div>${botao(s.botao, 40)}</div>` : ''}`, 'justify-content:center')}
    <div style="position:absolute;left:110px;bottom:110px">${logo(64, { cor: f.tit, pBg: C.brasa, pFg: '#fff', semSimbolo: true })}</div>`,
};

export function slides(c) {
  return { w: 1080, h: 1350, slides: lista(c.slides).map(s => {
    const f = FUNDOS[s.fundo] || FUNDOS[{ capa: 'degrade', cta: 'carvao', versiculo: 'degrade' }[s.tipo] || 'creme'];
    return `<div style="position:absolute;inset:0;background:${f.bg}"></div>${agua(1300, -380, -420, f.agua)}${(TIPOS[s.tipo] || TIPOS.texto)(s, f)}${canto(f.sim, 130, 90)}`;
  }) };
}

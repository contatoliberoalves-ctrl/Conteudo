// Molde "Plantão Constitucional" (@constitucionalgabaritado): Direito Constitucional no noticiário. Capa com o
// selo do plantão, título numa faixa verde, a pergunta numa pílula e, embaixo, recortes em preto e branco das
// autoridades ("fotos", em fotos/, fora do git) ou o desenho do prédio ("icone": congresso, stf, planalto).
// Slides internos: "linha" (passos ligados por uma linha, ex.: linha sucessória) e os comuns de cg-comum.
import { COR, TITULO, TEXTO, esc, lista, rico, kicker, tit, par, artigo, area, rodape, pagina } from '../cg-comum/base.mjs';

const tr = 'fill="rgba(155,224,163,.16)" stroke="#9be0a3" stroke-width="5" stroke-linejoin="round"';
const PREDIOS = {
  congresso: `<rect x="40" y="380" width="920" height="34" ${tr}/><rect x="452" y="50" width="42" height="330" ${tr}/><rect x="506" y="50" width="42" height="330" ${tr}/><rect x="452" y="190" width="96" height="16" ${tr}/>
    <path d="M130 285 A125 62 0 0 0 380 285 Z" ${tr}/><rect x="236" y="340" width="38" height="40" ${tr}/><path d="M620 380 A125 82 0 0 1 870 380 Z" ${tr}/>`,
  stf: `<rect x="80" y="400" width="840" height="24" ${tr}/><rect x="110" y="150" width="780" height="34" ${tr}/>${Array.from({ length: 11 }, (_, i) => `<path d="M${150 + i * 70} 184 q-18 108 0 216 h14 q18-108 0-216 z" ${tr}/>`).join('')}
    <rect x="455" y="230" width="90" height="170" fill="rgba(155,224,163,.08)" stroke="#9be0a3" stroke-width="3"/>`,
  planalto: `<rect x="40" y="400" width="920" height="22" ${tr}/><rect x="70" y="230" width="860" height="30" ${tr}/>${Array.from({ length: 9 }, (_, i) => `<path d="M${120 + i * 95} 260 q-30 70 0 140 h16 q-30-70 0-140 z" ${tr}/>`).join('')}
    <path d="M640 400 L960 330" stroke="#9be0a3" stroke-width="6"/><rect x="200" y="285" width="600" height="115" fill="rgba(155,224,163,.06)" stroke="#9be0a3" stroke-width="3"/>`,
};

const TIPOS = {
  capa(s, t, ctx) {
    const fotos = lista(s.fotos);
    const imgs = fotos.length
      ? `<div style="position:absolute;left:0;right:0;bottom:0;height:${s.alturaFotos || 760}px;display:flex;justify-content:center;align-items:flex-end;z-index:3">${fotos.map((f, i) => `<img src="${ctx.foto(f)}" style="height:100%;max-width:${fotos.length > 1 ? 620 : 900}px;object-fit:contain;object-position:bottom;filter:grayscale(1) contrast(1.12);margin-left:${i ? -140 : 0}px">`).join('')}</div>`
      : `<svg viewBox="20 30 960 410" style="position:absolute;left:30px;bottom:140px;width:1020px;z-index:3">${PREDIOS[s.icone] || PREDIOS.congresso}</svg>`;
    return `<div style="position:absolute;left:0;right:0;top:110px;display:flex;flex-direction:column;align-items:center;gap:26px;z-index:5;text-align:center">
        <span style="display:inline-flex;align-items:center;gap:12px;background:${COR.base};border:2px solid ${COR.claro};color:${COR.claro};${TEXTO};font-size:24px;font-weight:700;letter-spacing:.18em;border-radius:999px;padding:8px 22px"><span style="width:14px;height:14px;border-radius:50%;background:${COR.claro};box-shadow:0 0 0 6px rgba(155,224,163,.25)"></span>${esc(s.selo || 'PLANTÃO CONSTITUCIONAL')}</span>
        <div data-fit="${esc(lista(s.titulo).join(' '))}" data-min="70" style="${TITULO};font-size:${s.ts || 165}px;line-height:.95;padding-top:.12em;color:#fff;max-width:980px;max-height:440px;overflow:hidden">${lista(s.titulo).map(l => `<span style="background:linear-gradient(180deg,transparent 52%,rgba(155,224,163,.55) 52%,rgba(155,224,163,.55) 92%,transparent 92%);padding:0 .1em">${rico(l, t)}</span>`).join('<br>')}</div>
        ${s.pergunta ? `<div style="border:2px solid rgba(255,255,255,.55);border-radius:20px;padding:12px 30px;${TEXTO};font-size:36px;font-weight:400;color:#fff;max-width:900px">${rico(s.pergunta, t)}</div>` : ''}
      </div>${imgs}
      <div style="position:absolute;left:0;right:0;bottom:56px;text-align:center;z-index:6"><span style="display:inline-block;background:${COR.base};border:1px solid rgba(155,224,163,.35);border-radius:14px;padding:10px 26px;${TEXTO};font-size:30px;font-weight:500;color:#fff">@CONSTITUCIONAL<b style="font-weight:800">GABARITADO</b></span></div>`;
  },
  // Passos ligados por uma linha vertical (linha sucessória, rito, ordem de chamada).
  linha(s, t) {
    const itens = lista(s.itens);
    const passos = itens.map((it, i) => `<div style="display:flex;gap:28px;align-items:flex-start;position:relative">
        <span style="flex:none;width:76px;height:76px;border-radius:50%;background:${i === (s.atual ?? -1) ? COR.claro : t.escuro ? COR.base : '#fff'};border:4px solid ${t.destaque};display:flex;align-items:center;justify-content:center;${TITULO};font-size:46px;color:${i === (s.atual ?? -1) ? COR.base : t.destaque};z-index:2">${esc(it.n ?? i + 1)}</span>
        <div style="display:flex;flex-direction:column;gap:4px;padding-top:6px"><span style="${TITULO};font-size:1.45em;line-height:1;color:${t.tit}">${rico(it.titulo, t)}</span>
          ${it.texto ? `<span style="${TEXTO};font-weight:400;line-height:1.3;color:${t.txt}">${rico(it.texto, t)}</span>` : ''}
          ${it.artigo ? `<span style="${TEXTO};font-size:.72em;font-weight:700;color:${t.kicker}">${esc(it.artigo)}</span>` : ''}</div></div>`).join('');
    return area(`${kicker(s.kicker, t)}${tit(s, t, 110, 240)}
      <div data-fit="linha" data-min="22" style="position:relative;display:flex;flex-direction:column;gap:30px;font-size:${s.corpo || 32}px;max-height:860px;overflow:hidden">
        <span style="position:absolute;left:36px;top:30px;bottom:30px;width:4px;background:${t.destaque};opacity:.5"></span>${passos}</div>${artigo(s.artigo, t)}`) + rodape(t);
  },
};

export const renderCarrossel = (c, ctx) => pagina(c.slides, TIPOS, ctx, c);

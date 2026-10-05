// Molde "Macete" (@constitucionalgabaritado): uma sigla ou regra para decorar (GPS, LIMPE, SOCIDIVAPLU, 3·3·3).
// Capa com a foto do autor (fotos fora do git), a sigla gigante e "regra para…" ao lado; um slide por pedaço da
// sigla ("letra": pedaço vazado gigante, a palavra com o pedaço em verde, explicação e artigo); "resumo" com a
// sigla inteira; e os slides comuns de cg-comum (pegadinha, lista, lei, cta…).
import { COR, TITULO, TEXTO, esc, lista, rico, kicker, par, artigo, area, rodape, pagina } from '../cg-comum/base.mjs';

const PESADO = "font-family:'Poppins',sans-serif;font-weight:900;letter-spacing:-.04em";

const TIPOS = {
  capa(s, t, ctx) {
    const src = s.foto ? ctx.foto(s.foto) : '';
    const sigla = String(s.sigla || '');
    const px = s.tsigla || Math.min(330, Math.floor(940 / (Math.max(sigla.length, 1) * .66)));
    return `${src ? `<img src="${src}" style="position:absolute;left:0;top:${s.fotoY ?? 0}px;width:1080px;height:1350px;object-fit:cover;transform:scale(${s.fotoEscala || 1});transform-origin:50% 15%">` : ''}
      <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(28,31,30,0) 35%,rgba(28,31,30,.7) 60%,${COR.base} 88%);z-index:1"></div>
      <div style="position:absolute;inset:0;background:${COR.verde};mix-blend-mode:color;opacity:.25;z-index:1"></div>
      <div style="position:absolute;left:70px;right:70px;bottom:150px;display:flex;flex-wrap:wrap;align-items:center;column-gap:30px;row-gap:6px;z-index:5">
        <div style="${PESADO};font-size:${px}px;line-height:.9;color:#fff;white-space:nowrap;padding-top:.06em">${esc(sigla)}</div>
        <div style="display:flex;flex-direction:column;gap:2px;${TEXTO};font-size:${s.tregra || 46}px;font-weight:800;line-height:1.08;text-transform:uppercase;color:#fff">${lista(s.regra).map(l => `<span>${rico(l, t)}</span>`).join('')}
          ${s.artigo ? `<span style="margin-top:12px;align-self:flex-start;font-size:24px;font-weight:700;letter-spacing:.06em;text-transform:none;background:${COR.claro};color:${COR.base};border-radius:999px;padding:6px 18px">${esc(s.artigo)}</span>` : ''}</div>
      </div>
      <div style="position:absolute;left:0;right:0;bottom:62px;text-align:center;${TEXTO};font-size:26px;font-weight:600;letter-spacing:.06em;color:#fff;z-index:6">@CONSTITUCIONAL<b style="font-weight:800">GABARITADO</b> <span style="color:${COR.claro}">✔</span></div>`;
  },
  // Um pedaço da sigla: "letra" vazada gigante, "palavra" (com {{pedaço}} em verde), texto e artigo.
  letra(s, t) {
    const px = s.tl || Math.min(420, Math.floor(1500 / Math.max(String(s.letra).length, 1)));
    return `<div style="position:absolute;right:-30px;top:40px;${PESADO};font-size:${px}px;line-height:.85;color:transparent;-webkit-text-stroke:5px ${t.escuro ? 'rgba(155,224,163,.4)' : 'rgba(59,76,73,.22)'};z-index:1">${esc(s.letra)}</div>`
      + area(`${kicker(s.kicker, t)}
        <div data-fit="${esc(s.palavra)}" data-min="60" style="${TITULO};font-size:${s.ts || 130}px;line-height:.9;padding-top:.12em;color:${t.tit};max-height:360px;overflow:hidden">${rico(s.palavra, t)}</div>
        <span style="display:block;width:90px;height:8px;background:${t.destaque}"></span>
        <div data-fit="texto" data-min="28" style="font-size:${s.corpo || 40}px;max-height:560px;overflow:hidden">${par(s.texto, t)}</div>${artigo(s.artigo, t)}`, '', 330) + rodape(t);
  },
  // A sigla inteira: cada pedaço em verde ao lado da palavra.
  resumo(s, t) {
    const itens = lista(s.itens).map(([pedaco, palavra]) => `<div style="display:flex;align-items:center;gap:28px;border-bottom:2px solid ${t.linha};padding-bottom:16px">
      <span style="flex:none;width:200px;${PESADO};font-size:1.7em;line-height:1;color:${t.destaque}">${esc(pedaco)}</span>
      <span style="${TEXTO};font-weight:600;line-height:1.2;color:${t.tit}">${rico(palavra, t)}</span></div>`).join('');
    return area(`${kicker(s.kicker, t)}<div style="${PESADO};font-size:${s.tsigla || Math.min(220, Math.floor(880 / (String(s.sigla).length * .66)))}px;line-height:.95;color:${t.tit};white-space:nowrap">${esc(s.sigla)}</div>
      <div data-fit="resumo" data-min="22" style="display:flex;flex-direction:column;gap:16px;font-size:${s.corpo || 36}px;max-height:820px;overflow:hidden">${itens}</div>${artigo(s.artigo, t)}`) + rodape(t);
  },
};

export const renderCarrossel = (c, ctx) => pagina(c.slides, TIPOS, ctx, c);

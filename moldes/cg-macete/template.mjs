// Molde "Macete" (@constitucionalgabaritado): uma sigla ou regra para decorar (GPS, LIMPE, SOCIDIVAPLU, 3·3·3).
// Capa com a foto do autor (fotos fora do git), a sigla gigante e "regra para…" ao lado; um slide por pedaço da
// sigla ("letra": pedaço vazado gigante, a palavra com o pedaço em verde, explicação e artigo); "resumo" com a
// sigla inteira; e os slides comuns de cg-comum (pegadinha, lista, lei, cta…).
import { DEGRADE as DEGRADE_CG } from '../cg-comum/identidade.mjs';
import { COR, TITULO, TEXTO, esc, lista, rico, kicker, par, artigo, area, rodape, pagina } from '../cg-comum/base.mjs';

const PESADO = "font-family:'Poppins',sans-serif;font-weight:900;letter-spacing:-.04em";

const TIPOS = {
  // Capa: a foto no alto, sem filtro, e embaixo um painel em degradê com a sigla grande (cada pedaço numa
  // caixa reta, quando "pedacos" vier) e a regra. Borda reta entre foto e painel, com um fio verde-claro.
  capa(s, t, ctx) {
    const src = s.foto ? ctx.foto(s.foto) : '';
    const sigla = String(s.sigla || '');
    const ped = lista(s.pedacos);
    const px = s.tsigla || Math.min(250, Math.floor(920 / (Math.max(sigla.length, 1) * .5)));
    const siglaHtml = ped.length
      ? `<div style="display:flex;gap:12px;flex-wrap:nowrap">${ped.map((p, i) => `<span style="${TITULO};font-size:${s.tped || 150}px;line-height:1;padding:10px 22px 6px;${i % 2 ? `background:${COR.claro};color:${COR.base}` : 'background:#fff;color:' + COR.base}">${esc(p)}</span>`).join('')}</div>`
      : `<div style="${TITULO};font-size:${px}px;line-height:1;color:#fff;white-space:nowrap;letter-spacing:.02em">${esc(sigla)}</div>`;
    return `${src ? `<div style="position:absolute;left:0;top:0;width:1080px;height:${s.alturaFoto || 820}px;overflow:hidden"><img src="${src}" style="position:absolute;left:0;top:${s.fotoY ?? 0}px;width:1080px;height:1350px;object-fit:cover;transform:scale(${s.fotoEscala || 1});transform-origin:50% 15%"></div>` : ''}
      <div style="position:absolute;left:0;right:0;top:${s.alturaFoto || 820}px;bottom:0;background:${DEGRADE_CG};z-index:2"></div>
      <div style="position:absolute;left:0;right:0;top:${(s.alturaFoto || 820) - 4}px;height:8px;background:${COR.claro};z-index:3"></div>
      <div style="position:absolute;left:80px;top:${(s.alturaFoto || 820) - 26}px;background:${COR.base};color:${COR.claro};${TEXTO};font-size:22px;font-weight:800;letter-spacing:.2em;padding:10px 20px;z-index:4">MACETE</div>
      <div style="position:absolute;left:80px;right:80px;top:${(s.alturaFoto || 820) + 60}px;bottom:120px;display:flex;flex-direction:column;justify-content:center;gap:20px;z-index:5">
        ${siglaHtml}
        <div style="${TEXTO};font-size:${s.tregra || 40}px;font-weight:700;line-height:1.15;text-transform:uppercase;color:#fff">${lista(s.regra).map(l => rico(l, t)).join(' ')}</div>
        ${s.artigo ? `<div style="${TEXTO};font-size:26px;font-weight:600;color:${COR.claro}">${esc(s.artigo)}</div>` : ''}
      </div>
      <div style="position:absolute;left:0;right:0;bottom:56px;text-align:center;${TEXTO};font-size:24px;font-weight:600;letter-spacing:.06em;color:rgba(255,255,255,.85);z-index:6">@CONSTITUCIONAL<b style="font-weight:800">GABARITADO</b></div>`;
  },
  // Um pedaço da sigla: "letra" vazada gigante, "palavra" (com {{pedaço}} em verde), texto e artigo.
  letra(s, t) {
    const px = s.tl || Math.min(420, Math.floor(1500 / Math.max(String(s.letra).length, 1)));
    return `<div style="position:absolute;right:-30px;top:40px;${PESADO};font-size:${px}px;line-height:.85;color:transparent;-webkit-text-stroke:5px ${t.escuro ? 'rgba(111,211,155,.4)' : 'rgba(31,138,85,.22)'};z-index:1">${esc(s.letra)}</div>`
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

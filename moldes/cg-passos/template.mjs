// Molde "Passo a passo" (@constitucionalgabaritado): um rito em etapas (PEC, lei, impeachment, veto…). Capa com o
// título e a trilha numerada das etapas; um slide por etapa ("etapa": a trilha à esquerda com a etapa atual
// acesa, o quórum em destaque, texto e artigo); "trilha" com o resumo inteiro; e os slides comuns de cg-comum.
import { COR, TITULO, TEXTO, esc, lista, rico, kicker, tit, par, artigo, area, rodape, pagina } from '../cg-comum/base.mjs';

// Etapas do post (campo "etapas" do carrossel: [{nome}]) para as trilhas.
const bola = (n, aceso, t, tam = 70) => `<span style="flex:none;width:${tam}px;height:${tam}px;border-radius:50%;background:${aceso ? COR.claro : t.escuro ? COR.base : '#fff'};border:4px solid ${aceso ? COR.claro : t.destaque};display:flex;align-items:center;justify-content:center;${TITULO};font-size:${Math.round(tam * .6)}px;color:${aceso ? COR.base : t.destaque};z-index:2;box-shadow:${aceso ? '0 0 0 10px rgba(155,224,163,.22)' : 'none'}">${n}</span>`;

const TIPOS = {
  capa(s, t, ctx, c) {
    const et = lista(c.etapas);
    const src = s.foto ? ctx.foto(s.foto) : '';
    return `${src ? `<div style="position:absolute;right:70px;top:90px;width:300px;height:300px;border-radius:50%;overflow:hidden;border:8px solid ${COR.claro};z-index:4"><img src="${src}" style="width:100%;height:100%;object-fit:cover;object-position:${esc(s.fotoPos || '50% 15%')};transform:scale(${s.fotoZoom || 1.35});transform-origin:${esc(s.fotoPos || '50% 15%')}"></div>` : ''}
      <div style="position:absolute;left:90px;right:90px;top:${src ? 430 : 200}px;display:flex;flex-direction:column;gap:26px;z-index:5">
        <span style="align-self:flex-start;background:${COR.claro};color:${COR.base};${TEXTO};font-size:26px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;padding:8px 20px">${esc(s.selo || 'Passo a passo')}</span>
        <div data-fit="${esc(lista(s.titulo).join(' '))}" data-min="80" style="${TITULO};font-size:${s.ts || 170}px;line-height:.9;padding-top:.1em;color:#fff;max-height:470px;overflow:hidden">${lista(s.titulo).map(l => rico(l, t)).join('<br>')}</div>
        ${s.sub ? `<div style="${TEXTO};font-size:36px;font-weight:500;color:${t.txt}">${rico(s.sub, t)}</div>` : ''}
      </div>
      <div style="position:absolute;left:90px;right:90px;bottom:170px;z-index:5">
        <div style="position:relative;display:grid;grid-template-columns:repeat(${et.length},1fr);gap:10px">
          <span style="position:absolute;left:${50 / et.length}%;right:${50 / et.length}%;top:33px;height:4px;background:${COR.claro};opacity:.6"></span>
          ${et.map((e, i) => `<div style="display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center">${bola(i + 1, false, t)}<span style="${TEXTO};font-size:24px;font-weight:600;line-height:1.15;color:#fff">${esc(e.nome)}</span></div>`).join('')}
        </div>
      </div>${rodape(t)}`;
  },
  // Uma etapa: trilha vertical à esquerda (a atual acesa) e o conteúdo à direita.
  etapa(s, t, ctx, c, i) {
    const et = lista(c.etapas), at = (s.etapa ?? 1) - 1;
    const trilha = `<div style="position:absolute;left:70px;top:200px;bottom:200px;width:90px;display:flex;flex-direction:column;justify-content:space-between;align-items:center;z-index:4">
        <span style="position:absolute;top:40px;bottom:40px;left:43px;width:4px;background:${t.destaque};opacity:.35"></span>
        ${et.map((e, k) => `<div style="opacity:${k === at ? 1 : .55}">${bola(k + 1, k === at, t, k === at ? 86 : 64)}</div>`).join('')}</div>`;
    return trilha + `<div style="position:absolute;left:220px;right:90px;top:150px;bottom:170px;display:flex;flex-direction:column;justify-content:center;gap:26px;z-index:5">
        ${kicker(`Etapa ${at + 1} de ${et.length}${et[at] ? ' · ' + et[at].nome : ''}`, t)}
        ${tit(s, t, 120, 300)}
        ${s.quorum ? `<div style="display:flex;align-items:baseline;gap:18px"><span data-fit="${esc(s.quorum)}" data-min="80" style="${TITULO};font-size:${s.tq || 190}px;line-height:.85;color:${t.destaque};white-space:nowrap">${esc(s.quorum)}</span><span style="${TEXTO};font-size:30px;font-weight:600;line-height:1.2;color:${t.txt};max-width:340px">${rico(s.quorumTexto || '', t)}</span></div>` : ''}
        <div data-fit="texto" data-min="26" style="font-size:${s.corpo || 36}px;max-height:520px;overflow:hidden">${par(s.texto, t)}</div>${artigo(s.artigo, t)}
      </div>${rodape(t)}`;
  },
  // A trilha inteira: cada etapa com o resumo e o quórum.
  trilha(s, t, ctx, c) {
    const et = lista(c.etapas);
    const linhas = et.map((e, i) => `<div style="display:flex;gap:26px;align-items:flex-start">${bola(i + 1, false, t, 64)}
        <div style="display:flex;flex-direction:column;gap:2px;padding-top:4px"><span style="${TITULO};font-size:1.4em;line-height:1;color:${t.tit}">${esc(e.nome)}${e.quorum ? ` <span style="color:${t.destaque}">· ${esc(e.quorum)}</span>` : ''}</span>
        ${e.resumo ? `<span style="${TEXTO};font-weight:400;line-height:1.3;color:${t.txt}">${rico(e.resumo, t)}</span>` : ''}</div></div>`).join('');
    return area(`${kicker(s.kicker, t)}${tit(s, t, 110, 240)}<div data-fit="trilha" data-min="22" style="position:relative;display:flex;flex-direction:column;gap:30px;font-size:${s.corpo || 32}px;max-height:880px;overflow:hidden"><span style="position:absolute;left:30px;top:30px;bottom:30px;width:4px;background:${t.destaque};opacity:.4"></span>${linhas}</div>`) + rodape(t);
  },
};

export const renderCarrossel = (c, ctx) => pagina(c.slides, TIPOS, ctx, c);

// Molde "Cartório · PDF": material A4 retrato (794×1123 px CSS) na identidade do cartório.
// Capa e contracapa no carvão; páginas no papel com cabeçalho (emblema + nome), título da página e
// blocos: checklist, avisos, passos, valores, cards, lei e contato. A paginação é a do dados.json
// (cada item de "paginas" é uma folha); o render avisa quando um conteúdo encosta no rodapé.
import { C, CAPS, CONTATO, DISPLAY, FUNDOS, HEAD, PRATA, emblema, esc, lista, logo, rico } from '../cartorio-comum/marca.mjs';

export const W = 794, H = 1123;
const P = FUNDOS.papel, K = FUNDOS.carvao;
const fioP = 'linear-gradient(90deg,#5E5D58,#B9B7B0)';

const marcador = `<span style="flex:none;width:20px;height:20px;margin-top:3px;border-radius:4px;background:${C.carvao};display:flex;align-items:center;justify-content:center;font:700 12px/1 Jost"><span class="prataV">✓</span></span>`;
const h3 = t => t ? `<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px"><span style="${DISPLAY};font-size:25px;color:${C.grafite}">${rico(t, P)}</span><span style="flex:1;height:1px;background:${C.linha}"></span></div>` : '';
const nota = t => t ? `<div style="font-size:12.5px;line-height:1.5;color:${C.cinza};border-left:2px solid #5E5D58;padding-left:12px;margin-top:10px">${rico(t, P)}</div>` : '';

const BLOCOS = {
  checklist: b => `${h3(b.titulo)}<div style="display:flex;flex-direction:column;gap:9px">${lista(b.itens).map(it => {
    const o = typeof it === 'string' ? { texto: it } : it;
    return `<div style="display:flex;gap:12px">${marcador}<div style="font-size:14px;line-height:1.5;color:${C.grafite}">${rico(o.texto, P)}${o.obs ? `<span style="${CAPS};font-size:9.5px;color:${C.cinza};margin-left:8px;white-space:nowrap">${esc(o.obs)}</span>` : ''}</div></div>`;
  }).join('')}</div>${nota(b.nota)}`,
  avisos: b => `${h3(b.titulo)}<div style="display:flex;flex-direction:column;gap:10px">${lista(b.itens).map(t => `<div style="display:flex;gap:12px;font-size:14px;line-height:1.5;color:${C.grafite}"><span style="flex:none;width:7px;height:7px;margin-top:8px;transform:rotate(45deg);background:${C.carvao}"></span><span>${rico(t, P)}</span></div>`).join('')}</div>${nota(b.nota)}`,
  passos: b => `${h3(b.titulo)}<div style="display:grid;grid-template-columns:repeat(${lista(b.itens).length},1fr);gap:12px">${lista(b.itens).map((t, i) => `<div style="background:#fff;border:1px solid ${C.linha};border-radius:10px;padding:14px;display:flex;flex-direction:column;gap:10px"><span style="width:34px;height:34px;border-radius:50%;background:${C.carvao};display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond';font-weight:700;font-size:20px"><span class="prataV">${i + 1}</span></span><span style="font-size:13px;line-height:1.45;color:${C.grafite}">${rico(t, P)}</span></div>`).join('')}</div>${nota(b.nota)}`,
  valores: b => `${h3(b.titulo)}<div style="display:grid;grid-template-columns:repeat(${lista(b.itens).length},1fr);gap:12px">${lista(b.itens).map(v => `<div style="background:${C.carvao};border-radius:10px;padding:18px 20px;display:flex;flex-direction:column;gap:6px"><span class="prataV" style="${DISPLAY};font-weight:700;font-size:40px;line-height:1">${esc(v.valor)}</span><span style="${CAPS};font-size:10px;color:#BDBBB4;line-height:1.5">${esc(v.rotulo)}</span></div>`).join('')}</div>${nota(b.nota)}`,
  cards: b => `${h3(b.titulo)}<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">${lista(b.itens).map(c => `<div style="background:#fff;border:1px solid ${C.linha};border-radius:10px;padding:14px 16px;${c.largo ? 'grid-column:1/-1;' : ''}"><div style="${DISPLAY};font-size:20px;color:${C.grafite};margin-bottom:6px">${rico(c.titulo, P)}</div><div style="font-size:12.5px;line-height:1.5;color:${C.grafite}">${rico(c.texto, P)}</div></div>`).join('')}</div>${nota(b.nota)}`,
  lei: b => `${h3(b.titulo)}<div style="background:#fff;border:1px solid ${C.linha};border-radius:10px;padding:16px 20px">${b.ref ? `<div style="${CAPS};font-size:10px;color:${C.cinza};margin-bottom:10px">${esc(b.ref)}</div>` : ''}${lista(b.itens).map(t => `<p style="font-family:'Cormorant Garamond';font-size:16.5px;line-height:1.45;color:${C.grafite};margin-bottom:6px">${rico(t, P)}</p>`).join('')}</div>${nota(b.nota)}`,
  contato: b => `${h3(b.titulo)}<div style="display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:12px">${[['Endereço', CONTATO.endereco.join('\n')], ['Telefone', CONTATO.telefone], ['Agendamento', CONTATO.site]].map(([r, v]) => `<div style="background:#fff;border:1px solid ${C.linha};border-radius:10px;padding:12px 14px"><div style="${CAPS};font-size:9.5px;color:${C.cinza};margin-bottom:4px">${r}</div><div style="font-size:13px;line-height:1.45;color:${C.grafite};white-space:pre-line">${esc(v)}</div></div>`).join('')}</div>`,
};

const cabecalho = (c, pg) => `<div style="position:absolute;left:56px;right:56px;top:34px;display:flex;align-items:center;gap:14px">
  ${emblema(46)}<div style="${CAPS};font-size:9.5px;line-height:1.55;color:${C.cinza}">Cartório do Registro Civil<br>de Curral Queimado</div>
  <div style="margin-left:auto;${CAPS};font-size:9.5px;color:${C.cinza}">${esc(c.titulo)}</div></div>
  <div style="position:absolute;left:56px;right:56px;top:96px;height:1px;background:${fioP}"></div>
  <div style="position:absolute;left:56px;right:56px;bottom:30px;display:flex;justify-content:space-between;${CAPS};font-size:9px;color:${C.cinza}"><span>${esc(CONTATO.telefone)} · ${esc(CONTATO.site)}</span><span>${String(pg).padStart(2, '0')}</span></div>`;

const capa = c => `<section class="pagina" style="background:${C.carvao}">
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 28%,rgba(255,255,255,.08),transparent 60%)"></div>
  <div style="position:absolute;left:0;right:0;top:120px;display:flex;justify-content:center">${emblema(280)}</div>
  <div style="position:absolute;left:70px;right:70px;top:450px;display:flex;flex-direction:column;align-items:center;gap:22px;text-align:center">
    <div style="display:flex;align-items:center;gap:16px"><span style="width:50px;height:1.5px;background:${PRATA}"></span><span style="${CAPS};font-size:13px;color:#BDBBB4">${esc(c.capa.rotulo)}</span><span style="width:50px;height:1.5px;background:${PRATA}"></span></div>
    <div class="prataV" style="${DISPLAY};font-size:${c.capa.ts || 70}px;line-height:1.02">${lista(c.capa.titulo).map(t => rico(t, K)).join('<br>')}</div>
    ${c.capa.sub ? `<div style="font-size:15px;line-height:1.55;color:#D9D8D3;max-width:520px">${rico(c.capa.sub, K)}</div>` : ''}</div>
  <div style="position:absolute;left:0;right:0;bottom:70px;display:flex;justify-content:center">${logo(72, { comEmblema: false })}</div></section>`;

const contracapa = c => `<section class="pagina" style="background:${C.carvao}">
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 35%,rgba(255,255,255,.07),transparent 60%)"></div>
  <div style="position:absolute;left:0;right:0;top:170px;display:flex;justify-content:center">${logo(96)}</div>
  <div style="position:absolute;left:90px;right:90px;bottom:120px;display:flex;flex-direction:column;gap:16px">
    ${c.fim ? `<div class="prataV" style="${DISPLAY};font-size:34px;text-align:center;margin-bottom:10px">${rico(c.fim, K)}</div>` : ''}
    ${[['Endereço', CONTATO.endereco.join(' · ')], ['Telefone e WhatsApp', CONTATO.telefone], ['Agendamento on-line', CONTATO.site]].map(([r, v]) => `<div style="display:flex;justify-content:space-between;gap:20px;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,.16)"><span style="${CAPS};font-size:10.5px;color:#A9A7A0">${r}</span><span style="font-size:14px;color:#E9E8E4;text-align:right">${esc(v)}</span></div>`).join('')}</div></section>`;

const pagina = (c, p, pg) => `<section class="pagina" style="background:${C.papel}">${cabecalho(c, pg)}
  <div class="corpo" style="position:absolute;left:56px;right:56px;top:124px;display:flex;flex-direction:column;gap:26px">
    <div>${p.kicker ? `<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px"><span style="width:36px;height:1.5px;background:${fioP}"></span><span style="${CAPS};font-size:11px;color:${C.cinza}">${esc(p.kicker)}</span></div>` : ''}
    <div style="${DISPLAY};font-size:${p.ts || 40}px;line-height:1.05;color:${C.grafite}">${rico(p.titulo, P)}</div>${p.texto ? `<p style="font-size:14px;line-height:1.55;color:${C.cinza};margin-top:10px;max-width:600px">${rico(p.texto, P)}</p>` : ''}</div>
    ${lista(p.blocos).map(b => `<div>${(BLOCOS[b.tipo] || BLOCOS.avisos)(b)}</div>`).join('')}</div></section>`;

export function renderCarrossel(c) {
  const html = `<!doctype html><html><head>${HEAD}<style>@page{size:210mm 297mm;margin:0}html,body{background:#888}
  .pagina{position:relative;width:${W}px;height:${H}px;overflow:hidden;break-after:page;-webkit-print-color-adjust:exact;print-color-adjust:exact}</style></head>
  <body>${capa(c)}${lista(c.paginas).map((p, i) => pagina(c, p, i + 2)).join('')}${contracapa(c)}
  <script>document.fonts.ready.then(()=>{window.__pronto=true})</script></body></html>`;
  return { html, avisos: [] };
}

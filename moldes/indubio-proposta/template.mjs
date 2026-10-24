// Propostas comerciais da Indubio Pro Marketing em A4 retrato (794×1123 px = 210×297 mm).
// Linguagem dos moldes do Renato (títulos grandes em Bricolage Grotesque, pílulas, marca-d'água gigante)
// nas cores da Indubio (preto, off-white, dourado) com o logo em Montserrat.
export const W = 794, H = 1123;
const COR = { preto: '#0E0E0F', grafite: '#1B1B1D', off: '#F6F5F1', ouro: '#B89A5E', ouroClaro: '#D9C18E', ouroEsc: '#8C7140', cinza: '#6E6C68', linha: '#E3E0D8' };
const G = `linear-gradient(135deg,${COR.ouroClaro} 0%,${COR.ouro} 55%,${COR.ouroEsc} 100%)`;
const F = "font-family:'Bricolage Grotesque',sans-serif;font-weight:800;letter-spacing:-.035em;text-transform:uppercase";
const I = "font-family:'Inter',sans-serif";
const M = "font-family:'Montserrat',sans-serif";
export const FONTES = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Inter:wght@400;500;600;700;800&family=Montserrat:wght@700&display=swap';
export const HEAD = `<link rel="stylesheet" href="${FONTES}">`;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
// [[texto]] sai em dourado.
const rico = (s, cor = COR.ouro) => esc(s).replace(/\[\[(.+?)\]\]/g, `<span style="color:${cor}">$1</span>`);
const brl = n => 'R$ ' + Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 0 });

const logo = (escuro, px = 26) => `<div style="${M};display:inline-flex;flex-direction:column;align-items:flex-end;line-height:1;color:${escuro ? '#fff' : COR.preto}">
  <span style="font-weight:700;font-size:${px}px;letter-spacing:-.02em">indubio</span><span style="font-weight:700;font-size:${Math.round(px * .36)}px;letter-spacing:.02em;margin-top:${Math.round(px * .06)}px;color:${escuro ? COR.ouroClaro : COR.ouro}">Pro Marketing</span></div>`;
const pilula = (t, escuro) => `<span style="display:inline-flex;align-items:center;gap:8px;${I};font-weight:700;font-size:11px;letter-spacing:.18em;text-transform:uppercase;padding:8px 14px;border-radius:999px;${escuro ? `background:rgba(217,193,142,.12);color:${COR.ouroClaro};border:1px solid rgba(217,193,142,.35)` : `background:#fff;color:${COR.ouroEsc};border:1px solid ${COR.linha}`}"><span style="width:6px;height:6px;border-radius:50%;background:currentColor"></span>${esc(t)}</span>`;
const grao = (op = .3) => `<div style="position:absolute;inset:0;background-image:url(../assets/grao.png);background-size:400px;opacity:${op};mix-blend-mode:overlay;pointer-events:none"></div>`;
const play = (cor, w, extra = '') => `<svg viewBox="0 0 100 100" style="position:absolute;width:${w}px;${extra}" fill="none" stroke="${cor}" stroke-width="3"><rect x="4" y="4" width="92" height="92" rx="26"/><path d="M40 30 L72 50 L40 70 Z" stroke-linejoin="round"/></svg>`;
const titulo = (t, escuro, px = 54) => `<div style="${F};font-size:${px}px;line-height:.92;color:${escuro ? '#fff' : COR.preto}">${lista(t).map(l => rico(l)).join('<br>')}</div>`;
const rodape = (n, escuro, p) => `<div data-r style="position:absolute;left:56px;right:56px;bottom:30px;display:flex;justify-content:space-between;align-items:center;${I};font-size:9.5px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:${escuro ? '#8E8C87' : COR.cinza}"><span>Orçamento de edição de vídeos · ${esc(p.para)}</span><span>${String(n).padStart(2, '0')}</span></div>`;
const cab = (n, t, escuro) => `<div style="display:flex;align-items:center;justify-content:space-between">${pilula(t, escuro)}${logo(escuro, 20)}</div>`;

function capa(p) {
  return { escuro: true, html: `<div style="position:absolute;inset:0;background:radial-gradient(80% 60% at 85% 85%,#2E2820 0%,${COR.preto} 65%)"></div>${grao(.35)}
    ${play('rgba(217,193,142,.16)', 620, 'right:-170px;bottom:-120px')}
    <div style="position:absolute;left:56px;right:56px;top:56px;display:flex;justify-content:space-between;align-items:flex-start">${logo(true, 30)}${pilula('Proposta comercial', true)}</div>
    <div style="position:absolute;left:56px;right:56px;top:300px">
      <div style="${I};font-weight:600;font-size:14px;letter-spacing:.22em;text-transform:uppercase;color:${COR.ouroClaro};margin-bottom:22px">Orçamento de</div>
      <div style="${F};font-size:118px;line-height:.86;color:#fff">Edição<br>de <span style="background:${G};-webkit-background-clip:text;background-clip:text;color:transparent">vídeos</span></div>
      <div style="width:70px;height:3px;background:${G};margin:44px 0 28px"></div>
      <div style="${I};font-size:17px;line-height:1.7;color:#C9C7C2">Por: <b style="color:#fff">${esc(p.por)}</b><br>Para: <b style="color:#fff">${esc(p.para)}</b></div></div>
    <div style="position:absolute;left:56px;bottom:56px;display:flex;gap:10px;flex-wrap:wrap;max-width:520px">${lista(p.etiquetas).map(t => `<span style="${I};font-weight:600;font-size:11.5px;color:#E2E0DB;padding:8px 14px;border-radius:999px;border:1px solid #3A3A3E">${esc(t)}</span>`).join('')}</div>` };
}

function escopo(p, n) {
  const blocos = lista(p.escopo);
  return { escuro: false, html: `<div style="position:absolute;inset:0;background:${COR.off}"></div>${grao(.18)}
    <div style="position:absolute;left:56px;right:56px;top:52px">${cab(n, 'Escopo mensal', false)}
      <div style="margin:52px 0 14px">${titulo(p.escopoTitulo || ['O que será', 'feito [[todo mês]]'], false, 58)}</div>
      <div style="${I};font-size:14px;line-height:1.6;color:${COR.cinza};max-width:560px;margin-bottom:34px">${rico(p.escopoTexto || '', COR.preto)}</div>
      <div style="display:flex;flex-direction:column;gap:22px">${blocos.map((b, bi) => `
        <div style="background:${bi % 2 ? COR.preto : '#fff'};border:1px solid ${bi % 2 ? COR.preto : COR.linha};border-radius:22px;padding:28px 30px;position:relative;overflow:hidden">
          ${play(bi % 2 ? 'rgba(217,193,142,.12)' : 'rgba(184,154,94,.12)', 210, 'right:-50px;top:-50px')}
          <div style="display:flex;align-items:baseline;gap:14px;margin-bottom:18px"><span style="${F};font-size:30px;color:${bi % 2 ? '#fff' : COR.preto}">${esc(b.titulo)}</span>${b.sub ? `<span style="${I};font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:${COR.ouro}">${esc(b.sub)}</span>` : ''}</div>
          <div style="display:flex;flex-direction:column;gap:12px">${lista(b.itens).map(it => `
            <div style="display:flex;align-items:center;gap:18px;padding:12px 0;border-top:1px solid ${bi % 2 ? '#2C2C2F' : COR.linha}">
              <span style="flex:none;width:74px;${F};font-size:${String(it.q).length > 2 ? 26 : 40}px;line-height:1;background:${G};-webkit-background-clip:text;background-clip:text;color:transparent">${esc(it.q)}</span>
              <span style="${I};font-size:15px;line-height:1.45;font-weight:500;color:${bi % 2 ? '#E2E0DB' : '#2A2927'}">${rico(it.t, bi % 2 ? '#fff' : COR.preto)}</span></div>`).join('')}</div></div>`).join('')}</div>
      ${lista(p.numeros).length ? `<div style="display:grid;grid-template-columns:repeat(${lista(p.numeros).length},1fr);gap:14px;margin-top:22px">${lista(p.numeros).map(x => `<div style="background:${G};border-radius:20px;padding:22px 22px 20px"><div style="${F};font-size:56px;line-height:1;color:${COR.preto}">${esc(x.n)}</div><div style="${I};font-size:12.5px;font-weight:600;line-height:1.4;color:#3A2E14;margin-top:8px">${esc(x.t)}</div></div>`).join('')}</div>` : ''}</div>
    ${rodape(n, false, p)}` };
}

function investimento(p, n) {
  const pl = lista(p.planos);
  const unit = lista(p.unitarios);
  return { escuro: true, html: `<div style="position:absolute;inset:0;background:${COR.preto}"></div>${grao(.3)}
    <div style="position:absolute;left:56px;right:56px;top:52px">${cab(n, 'Investimento', true)}
      <div style="margin:48px 0 30px">${titulo(p.investTitulo || ['Valores e', '[[planos]]'], true, 58)}</div>
      <div style="display:grid;grid-template-columns:repeat(${unit.length},1fr);gap:14px;margin-bottom:26px">${unit.map(u => `
        <div style="background:${COR.grafite};border:1px solid #2C2C2F;border-radius:18px;padding:18px 20px">
          <div style="${I};font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${COR.ouroClaro}">${esc(u.t)}</div>
          <div style="${F};font-size:38px;color:#fff;margin:8px 0 4px">${brl(u.valor)}</div>
          <div style="${I};font-size:12px;line-height:1.45;color:#9E9C97">${rico(u.d, '#fff')}</div></div>`).join('')}</div>
      <div style="${I};font-size:12px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#8E8C87;margin-bottom:12px">${esc(p.planosTitulo || 'Planos')}</div>
      <div style="display:flex;flex-direction:column;gap:12px">${pl.map(x => {
        const dest = x.destaque;
        return `<div style="display:flex;align-items:center;gap:20px;padding:20px 24px;border-radius:18px;${dest ? `background:${G};color:${COR.preto}` : `background:${COR.grafite};border:1px solid #2C2C2F;color:#fff`};position:relative">
          <div style="flex:1"><div style="${F};font-size:26px">${esc(x.nome)}</div><div style="${I};font-size:12.5px;margin-top:4px;color:${dest ? '#3A2E14' : '#9E9C97'}">${esc(x.d)}</div></div>
          ${x.de ? `<div style="text-align:right"><div style="${I};font-size:13px;text-decoration:line-through;color:${dest ? '#5A4A26' : '#8E8C87'}">de ${brl(x.de)}</div><div style="${I};font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${dest ? COR.preto : COR.ouroClaro};margin-top:3px">economia de ${brl(x.de - x.por)}</div></div>` : ''}
          <div style="${F};font-size:40px;min-width:150px;text-align:right">${brl(x.por)}</div>
          ${x.selo ? `<span style="position:absolute;top:-11px;right:24px;background:${COR.preto};color:${COR.ouroClaro};${I};font-weight:800;font-size:10px;letter-spacing:.16em;text-transform:uppercase;padding:6px 12px;border-radius:999px;border:1px solid ${COR.ouro}">${esc(x.selo)}</span>` : ''}</div>`;
      }).join('')}</div>
      ${lista(p.extras).map(x => `<div style="margin-top:16px;display:flex;align-items:center;gap:20px;padding:18px 24px;border-radius:18px;border:1px dashed #4A4640">
        <div style="flex:1"><div style="${F};font-size:22px;color:#fff">${esc(x.nome)}</div><div style="${I};font-size:12.5px;margin-top:4px;color:#9E9C97">${rico(x.d, '#fff')}</div></div>
        <div style="${F};font-size:34px;color:${COR.ouroClaro}">${brl(x.valor)}</div></div>`).join('')}
      ${p.bonus ? `<div style="margin-top:22px;display:flex;align-items:center;gap:16px;padding:16px 22px;border-radius:16px;background:rgba(217,193,142,.1);border:1px solid rgba(217,193,142,.35)">
        <span style="flex:none;${I};font-weight:800;font-size:11px;letter-spacing:.18em;text-transform:uppercase;background:${G};color:${COR.preto};padding:7px 12px;border-radius:999px">Bônus</span>
        <span style="${I};font-size:14px;color:#E2E0DB">${rico(p.bonus, '#fff')}</span></div>` : ''}</div>
    ${rodape(n, true, p)}` };
}

// Página de thumbnails: "grande" ocupa a largura; as demais vão em pares.
function thumbs(p, n, pg) {
  const fig = (t, w) => `<figure style="margin:0"><img src="${t.png}" style="display:block;width:${w}px;height:${Math.round(w * 9 / 16)}px;border-radius:14px;box-shadow:0 14px 34px rgba(14,14,15,.18)">
    <figcaption style="${I};font-size:12.5px;font-weight:600;color:#2A2927;margin-top:10px;line-height:1.4">${esc(t.titulo)}${t.nota ? `<span style="display:block;font-weight:400;color:${COR.cinza};font-size:11.5px;margin-top:2px">${esc(t.nota)}</span>` : ''}</figcaption></figure>`;
  const [a, ...resto] = pg.itens;
  const cheio = pg.cheio;
  return { escuro: false, html: `<div style="position:absolute;inset:0;background:${COR.off}"></div>${grao(.18)}
    <div style="position:absolute;left:56px;right:56px;top:52px">${cab(n, 'Bônus · Thumbnails', false)}
      <div style="margin:40px 0 10px">${titulo(pg.titulo, false, 44)}</div>
      ${pg.texto ? `<div style="${I};font-size:13.5px;line-height:1.6;color:${COR.cinza};max-width:600px;margin-bottom:26px">${rico(pg.texto, COR.preto)}</div>` : '<div style="height:16px"></div>'}
      ${cheio ? `<div style="display:flex;flex-direction:column;align-items:center;gap:22px">${pg.itens.map(t => fig(t, 620)).join('')}</div>`
        : `${fig(a, 682)}<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:26px">${resto.map(t => fig(t, 329)).join('')}</div>`}</div>
    ${rodape(n, false, p)}` };
}

function fim(p, n) {
  return { escuro: true, html: `<div style="position:absolute;inset:0;background:radial-gradient(80% 60% at 15% 15%,#2E2820 0%,${COR.preto} 65%)"></div>${grao(.35)}
    ${play('rgba(217,193,142,.16)', 560, 'left:-160px;top:-120px')}
    <div style="position:absolute;left:56px;right:56px;top:420px">
      ${pilula('Obrigado', true)}
      <div style="${F};font-size:92px;line-height:.88;color:#fff;margin:28px 0 30px">${lista(p.fimTitulo || ['Bora pôr', 'os vídeos', '[[no ar?]]']).map(l => rico(l, COR.ouroClaro)).join('<br>')}</div>
      <div style="${I};font-size:16px;line-height:1.7;color:#C9C7C2;max-width:520px">${rico(p.fimTexto || '', '#fff')}</div></div>
    <div style="position:absolute;left:56px;right:56px;bottom:56px;display:flex;justify-content:space-between;align-items:flex-end">
      <div style="${I};font-size:14px;line-height:1.6;color:#C9C7C2"><b style="color:#fff;font-size:17px">${esc(p.por)}</b><br>Edição de vídeos</div>${logo(true, 32)}</div>` };
}

export function renderProposta(p, thumbsPng) {
  const pags = [];
  const push = f => pags.push(f(pags.length + 1));
  push(() => capa(p));
  push(n => escopo(p, n));
  push(n => investimento(p, n));
  for (const pg of lista(p.paginasThumbs)) push(n => thumbs(p, n, { ...pg, itens: pg.thumbs.map(id => thumbsPng[id]) }));
  push(n => fim(p, n));
  const html = `<!doctype html><html><head><meta charset="utf-8">${HEAD}<style>*{box-sizing:border-box}@page{size:210mm 297mm;margin:0}html,body{margin:0;background:#333}
.slide{position:relative;width:${W}px;height:${H}px;overflow:hidden;page-break-after:always;break-after:page}.slide:last-child{page-break-after:auto;break-after:auto}</style></head>
<body>${pags.map(s => `<section class="slide">${s.html}</section>`).join('')}</body></html>`;
  return { html, total: pags.length };
}

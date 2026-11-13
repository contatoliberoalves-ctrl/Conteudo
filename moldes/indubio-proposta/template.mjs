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
const rico = (s, cor = COR.ouro) => esc(s).replace(/\[\[(.+?)\]\]/g, `<span style="color:${cor}">$1</span>`).replace(/\*\*(.+?)\*\*/g, '<b style="font-weight:700">$1</b>');
const brl = n => 'R$ ' + Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 0 });

const logo = (escuro, px = 26) => `<div style="${M};display:inline-flex;flex-direction:column;align-items:flex-end;line-height:1;color:${escuro ? '#fff' : COR.preto}">
  <span style="font-weight:700;font-size:${px}px;letter-spacing:-.02em">indubio</span><span style="font-weight:700;font-size:${Math.round(px * .36)}px;letter-spacing:.02em;margin-top:${Math.round(px * .06)}px;color:${escuro ? COR.ouroClaro : COR.ouro}">Pro Marketing</span></div>`;
const pilula = (t, escuro) => `<span style="display:inline-flex;align-items:center;gap:8px;${I};font-weight:700;font-size:11px;letter-spacing:.18em;text-transform:uppercase;padding:8px 14px;border-radius:999px;${escuro ? `background:rgba(217,193,142,.12);color:${COR.ouroClaro};border:1px solid rgba(217,193,142,.35)` : `background:#fff;color:${COR.ouroEsc};border:1px solid ${COR.linha}`}"><span style="width:6px;height:6px;border-radius:50%;background:currentColor"></span>${esc(t)}</span>`;
const grao = (op = .3) => `<div style="position:absolute;inset:0;background-image:url(../assets/grao.png);background-size:400px;opacity:${op};mix-blend-mode:overlay;pointer-events:none"></div>`;
const play = (cor, w, extra = '') => `<svg viewBox="0 0 100 100" style="position:absolute;width:${w}px;${extra}" fill="none" stroke="${cor}" stroke-width="3"><rect x="4" y="4" width="92" height="92" rx="26"/><path d="M40 30 L72 50 L40 70 Z" stroke-linejoin="round"/></svg>`;
const titulo = (t, escuro, px = 54) => `<div style="${F};font-size:${px}px;line-height:.92;color:${escuro ? '#fff' : COR.preto}">${lista(t).map(l => rico(l)).join('<br>')}</div>`;
const rodape = (n, escuro, p) => `<div data-r style="position:absolute;left:56px;right:56px;bottom:30px;display:flex;justify-content:space-between;align-items:center;${I};font-size:9.5px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:${escuro ? '#8E8C87' : COR.cinza}"><span>${esc(p.rodapeTexto || 'Orçamento de edição de vídeos')} · ${esc(p.para)}</span><span>${String(n).padStart(2, '0')}</span></div>`;
const cab = (n, t, escuro) => `<div style="display:flex;align-items:center;justify-content:space-between">${pilula(t, escuro)}${logo(escuro, 20)}</div>`;

function capa(p) {
  return { escuro: true, html: `<div style="position:absolute;inset:0;background:radial-gradient(80% 60% at 85% 85%,#2E2820 0%,${COR.preto} 65%)"></div>${grao(.35)}
    ${play('rgba(217,193,142,.16)', 620, 'right:-170px;bottom:-120px')}
    <div style="position:absolute;left:56px;right:56px;top:56px;display:flex;justify-content:space-between;align-items:flex-start">${logo(true, 30)}${pilula('Proposta comercial', true)}</div>
    <div style="position:absolute;left:56px;right:56px;top:300px">
      <div style="${I};font-weight:600;font-size:14px;letter-spacing:.22em;text-transform:uppercase;color:${COR.ouroClaro};margin-bottom:22px">${esc(p.capaPre || 'Orçamento de')}</div>
      <div style="${F};font-size:${p.capaTs || 118}px;line-height:.86;color:#fff">${lista(p.capaTitulo || ['Edição', 'de [[vídeos]]']).map(l => esc(l).replace(/\[\[(.+?)\]\]/g, `<span style="background:${G};-webkit-background-clip:text;background-clip:text;color:transparent">$1</span>`)).join('<br>')}</div>
      <div style="width:70px;height:3px;background:${G};margin:44px 0 28px"></div>
      <div style="${I};font-size:17px;line-height:1.7;color:#C9C7C2">Por: <b style="color:#fff">${esc(p.por)}</b><br>Para: <b style="color:#fff">${esc(p.para)}</b></div></div>
    <div style="position:absolute;left:56px;bottom:56px;display:flex;gap:10px;flex-wrap:wrap;max-width:520px">${lista(p.etiquetas).map(t => `<span style="${I};font-weight:600;font-size:11.5px;color:#E2E0DB;padding:8px 14px;border-radius:999px;border:1px solid #3A3A3E">${esc(t)}</span>`).join('')}</div>` };
}

function escopo(p, n) {
  const blocos = lista(p.escopo);
  return { escuro: false, html: `<div style="position:absolute;inset:0;background:${COR.off}"></div>${grao(.18)}
    <div style="position:absolute;left:56px;right:56px;top:52px">${cab(n, p.escopoRotulo || 'Escopo mensal', false)}
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
      <div style="${I};font-size:14px;line-height:1.6;color:#C9C7C2"><b style="color:#fff;font-size:17px">${esc(p.por)}</b><br>${esc(p.servico || 'Edição de vídeos')}</div>${logo(true, 32)}</div>` };
}


// ---------- Páginas extras (propostas de serviço com "paginas": [{tipo, ...}]) ----------
const fundoClaro = `<div style="position:absolute;inset:0;background:${COR.off}"></div>${grao(.18)}`;
const fundoEscuro = `<div style="position:absolute;inset:0;background:${COR.preto}"></div>${grao(.3)}`;
const txt = (t, escuro, px = 14) => `<div style="${I};font-size:${px}px;line-height:1.65;color:${escuro ? '#C9C7C2' : COR.cinza}">${rico(t, escuro ? '#fff' : COR.preto)}</div>`;
const check = (ok, escuro) => ok ? `<span style="flex:none;width:22px;height:22px;border-radius:50%;background:${G};display:inline-flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" width="13"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="${COR.preto}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`
  : `<span style="flex:none;width:22px;height:22px;border-radius:50%;border:1.5px solid ${escuro ? '#3A3A3E' : COR.linha};display:inline-flex;align-items:center;justify-content:center;color:${escuro ? '#5A5853' : '#B9B6AE'};font-size:13px;font-weight:700">–</span>`;

const EXTRAS = {
  // Texto + cartões de pilares numerados.
  sobre: (p, n, g) => ({ escuro: false, html: `${fundoClaro}
    <div style="position:absolute;left:56px;right:56px;top:52px">${cab(n, g.rotulo || 'Sobre', false)}
      <div style="margin:60px 0 22px">${titulo(g.titulo, false, 60)}</div>
      ${lista(g.texto).map(t => `<div style="margin-bottom:14px;max-width:660px">${txt(t, false, 16.5)}</div>`).join('')}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:40px">${lista(g.cartoes).map((c, i) => `
        <div style="background:${i === 0 ? COR.preto : '#fff'};border:1px solid ${i === 0 ? COR.preto : COR.linha};border-radius:20px;padding:30px 28px 34px;position:relative;overflow:hidden;min-height:250px">
          <div style="${F};font-size:52px;line-height:1;background:${G};-webkit-background-clip:text;background-clip:text;color:transparent">${String(i + 1).padStart(2, '0')}</div>
          <div style="${F};font-size:24px;margin:16px 0 10px;color:${i === 0 ? '#fff' : COR.preto}">${esc(c.t)}</div>
          ${txt(c.d, i === 0, 14.5)}</div>`).join('')}</div></div>
    ${rodape(n, false, p)}` }),
  // Três colunas de planos com o que cada um inclui e o valor.
  planos: (p, n, g) => {
    const pl = lista(p.planos), itens = lista(g.itens);
    return { escuro: true, html: `${fundoEscuro}
    <div style="position:absolute;left:56px;right:56px;top:52px">${cab(n, g.rotulo || 'Planos', true)}
      <div style="margin:56px 0 18px">${titulo(g.titulo, true, 60)}</div>
      ${g.texto ? `<div style="max-width:600px;margin-bottom:44px">${txt(g.texto, true, 15.5)}</div>` : ''}
      <div style="display:grid;grid-template-columns:repeat(${pl.length},1fr);gap:12px;align-items:stretch">${pl.map((x, k) => {
        const d = x.destaque;
        return `<div style="position:relative;border-radius:22px;padding:32px 22px 28px;display:flex;flex-direction:column;min-height:560px;${d ? `background:${G};color:${COR.preto}` : `background:${COR.grafite};border:1px solid #2C2C2F;color:#fff`}">
          ${x.selo ? `<span style="position:absolute;top:-11px;left:20px;background:${COR.preto};color:${COR.ouroClaro};${I};font-weight:800;font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;padding:6px 11px;border-radius:999px;border:1px solid ${COR.ouro}">${esc(x.selo)}</span>` : ''}
          <div style="${I};font-size:10.5px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:${d ? '#3A2E14' : COR.ouroClaro}">Plano ${String(k + 1).padStart(2, '0')}</div>
          <div style="${F};font-size:38px;line-height:1;margin:12px 0 6px">${esc(x.nome)}</div>
          <div style="${I};font-size:12.5px;color:${d ? '#3A2E14' : '#9E9C97'};min-height:34px">${esc(x.d)}</div>
          <div style="height:1px;background:${d ? 'rgba(14,14,15,.2)' : '#2C2C2F'};margin:14px 0"></div>
          <div style="display:flex;flex-direction:column;gap:20px;flex:1">${itens.map(it => {
            const ok = it.planos.includes(k);
            return `<div style="display:flex;gap:10px;align-items:flex-start;opacity:${ok ? 1 : .45}">${ok ? (d ? `<span style="flex:none;width:22px;height:22px;border-radius:50%;background:${COR.preto};display:inline-flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" width="13"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="${COR.ouroClaro}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>` : check(true, true)) : check(false, !d)}
              <span style="${I};font-size:14px;line-height:1.4;font-weight:${ok ? 600 : 500}">${esc(it.t)}</span></div>`;
          }).join('')}</div>
          <div style="height:1px;background:${d ? 'rgba(14,14,15,.2)' : '#2C2C2F'};margin:16px 0 12px"></div>
          <div style="${I};font-size:10.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${d ? '#3A2E14' : '#8E8C87'}">Investimento</div>
          <div style="${F};font-size:42px;line-height:1.05">${brl(x.por)}</div></div>`;
      }).join('')}</div>
      ${g.nota ? `<div style="margin-top:30px">${txt(g.nota, true, 13.5)}</div>` : ''}</div>
    ${rodape(n, true, p)}` };
  },
  // Serviços explicados: blocos com título, descrição e o que costuma registrar.
  servicos: (p, n, g) => ({ escuro: false, html: `${fundoClaro}
    <div style="position:absolute;left:56px;right:56px;top:52px">${cab(n, g.rotulo || 'Os serviços', false)}
      <div style="margin:60px 0 34px">${titulo(g.titulo, false, 60)}</div>
      <div style="display:flex;flex-direction:column;gap:22px">${lista(g.blocos).map((b, i) => `
        <div style="display:grid;grid-template-columns:200px 1fr;gap:24px;background:${i % 2 ? COR.preto : '#fff'};border:1px solid ${i % 2 ? COR.preto : COR.linha};border-radius:20px;padding:42px 30px;position:relative;overflow:hidden">
          ${play(i % 2 ? 'rgba(217,193,142,.1)' : 'rgba(184,154,94,.1)', 170, 'right:-40px;bottom:-50px')}
          <div><div style="${F};font-size:28px;line-height:1;color:${i % 2 ? '#fff' : COR.preto}">${esc(b.t)}</div>
            <div style="${I};font-size:10.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${COR.ouro};margin-top:8px">${esc(b.planos)}</div></div>
          <div>${txt(b.d, i % 2, 15)}
            ${lista(b.momentos).length ? `<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:16px">${lista(b.momentos).map(m => `<span style="${I};font-size:12px;font-weight:600;padding:6px 11px;border-radius:999px;${i % 2 ? `background:rgba(217,193,142,.12);color:${COR.ouroClaro};border:1px solid rgba(217,193,142,.3)` : `background:${COR.off};color:${COR.ouroEsc};border:1px solid ${COR.linha}`}">${esc(m)}</span>`).join('')}</div>` : ''}</div></div>`).join('')}</div></div>
    ${rodape(n, false, p)}` }),
  // Portfólio: imagens de trabalhos ({src, w, legenda}); "grade" = colunas da segunda linha.
  portfolio: (p, n, g) => {
    const [a, ...resto] = lista(g.imagens);
    const fig = (im, h) => `<figure style="margin:0"><div style="height:${h}px;border-radius:14px;overflow:hidden;box-shadow:0 14px 34px rgba(0,0,0,.35);background:#222"><img src="${im.src}" style="width:100%;height:100%;object-fit:cover;object-position:${im.pos || 'center'}"></div>
      ${im.legenda ? `<figcaption style="${I};font-size:11.5px;font-weight:600;color:#C9C7C2;margin-top:9px;line-height:1.4">${esc(im.legenda)}</figcaption>` : ''}</figure>`;
    return { escuro: true, html: `${fundoEscuro}
    <div style="position:absolute;left:56px;right:56px;top:52px">${cab(n, g.rotulo || 'Portfólio', true)}
      <div style="margin:44px 0 10px">${titulo(g.titulo, true, 50)}</div>
      ${g.texto ? `<div style="max-width:620px;margin-bottom:24px">${txt(g.texto, true, 13.5)}</div>` : ''}
      ${a ? fig(a, g.h1 || 384) : ''}
      <div style="display:grid;grid-template-columns:repeat(${g.grade || resto.length || 1},1fr);gap:14px;margin-top:20px">${resto.map(im => fig(im, g.h2 || 300)).join('')}</div>
      ${lista(g.tags).length ? `<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:22px">${lista(g.tags).map(t => pilula(t, true)).join('')}</div>` : ''}</div>
    ${rodape(n, true, p)}` };
  },
  // Passos numerados (linha do tempo vertical) + caixa "a definir juntos".
  passos: (p, n, g) => ({ escuro: false, html: `${fundoClaro}
    <div style="position:absolute;left:56px;right:56px;top:52px">${cab(n, g.rotulo || 'Próximos passos', false)}
      <div style="margin:60px 0 36px">${titulo(g.titulo, false, 60)}</div>
      <div style="display:flex;flex-direction:column">${lista(g.passos).map((x, i, arr) => `
        <div style="display:grid;grid-template-columns:62px 1fr;gap:18px">
          <div style="display:flex;flex-direction:column;align-items:center"><span style="width:50px;height:50px;border-radius:50%;background:${i === 0 ? G : COR.preto};color:${i === 0 ? COR.preto : COR.ouroClaro};${F};font-size:20px;display:flex;align-items:center;justify-content:center">${String(i + 1).padStart(2, '0')}</span>${i < arr.length - 1 ? `<span style="flex:1;width:2px;background:${COR.linha};margin:6px 0"></span>` : ''}</div>
          <div style="padding:8px 0 40px"><div style="${F};font-size:26px;color:${COR.preto}">${esc(x.t)}</div><div style="margin-top:6px">${txt(x.d, false, 15)}</div></div></div>`).join('')}</div>
      ${lista(g.definir).length ? `<div style="margin-top:8px;background:#fff;border:1px dashed #C9C3B2;border-radius:20px;padding:28px 30px">
        <div style="${I};font-size:11px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:${COR.ouroEsc};margin-bottom:12px">${esc(g.definirTitulo || 'A definir juntos')}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:9px 24px">${lista(g.definir).map(t => `<div style="display:flex;gap:10px;align-items:center;${I};font-size:14.5px;font-weight:600;color:#2A2927"><span style="width:7px;height:7px;border-radius:50%;background:${COR.ouro};flex:none"></span>${esc(t)}</div>`).join('')}</div></div>` : ''}</div>
    ${rodape(n, false, p)}` }),
};

export function renderProposta(p, thumbsPng) {
  const pags = [];
  const push = f => pags.push(f(pags.length + 1));
  push(() => capa(p));
  if (p.paginas) { for (const g of p.paginas) push(n => EXTRAS[g.tipo](p, n, g)); push(n => fim(p, n)); }
  else { push(n => escopo(p, n));
  push(n => investimento(p, n));
  for (const pg of lista(p.paginasThumbs)) push(n => thumbs(p, n, { ...pg, itens: pg.thumbs.map(id => thumbsPng[id]) }));
  push(n => fim(p, n)); }
  const html = `<!doctype html><html><head><meta charset="utf-8">${HEAD}<style>*{box-sizing:border-box}@page{size:210mm 297mm;margin:0}html,body{margin:0;background:#333}
.slide{position:relative;width:${W}px;height:${H}px;overflow:hidden;page-break-after:always;break-after:page}.slide:last-child{page-break-after:auto;break-after:auto}</style></head>
<body>${pags.map(s => `<section class="slide">${s.html}</section>`).join('')}</body></html>`;
  return { html, total: pags.length };
}

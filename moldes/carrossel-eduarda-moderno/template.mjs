// Carrossel Eduarda Moderno: as três direções modernas do kit da Eduarda Caraciolo (kit/templates/modernos.html).
//   "1a" Editorial (papel, fios finos, Instrument Serif + Hanken Grotesk)
//   "1b" Blocos (rosé claro, grotesca pesada com itálico serifado)
//   "1c" Noir (quase preto, moldura fina, arcos e Cormorant Garamond)
// Tipos de slide: capa, item, resumo, cta. Sem contador de páginas (como no kit).
// Marcação no texto: **negrito**, ==marca-texto==, {cor de destaque}, *itálico de destaque*, quebra de linha com \n.

const NOME = 'Eduarda Caraciolo';
const CARGO = 'Advogada · Direito Civil e ECA';
const ARROBA = '@EDUARDACARACIOLO';

const SEC = '#4A3F40', ROSE = '#C99A9D', MARCA = '#D8B1B3', ROSE_ESC = '#A9767A';
const SERIF = "font-family:'Instrument Serif',serif";
const HANKEN = "font-family:'Hanken Grotesk',sans-serif";
const CORM = "font-family:'Cormorant Garamond',serif";
const CLONE = 'box-decoration-break:clone;-webkit-box-decoration-break:clone';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// ctx: b = cor do negrito, acc = cor de {destaque}, i = estilo do *itálico*, hl = cor do ==marca-texto==
function fmt(t, ctx = {}) {
  return esc(t)
    .replace(/\*\*(.+?)\*\*/g, `<b style="font-weight:600${ctx.b ? ';color:' + ctx.b : ''}">$1</b>`)
    .replace(/==(.+?)==/g, `<span style="background:${ctx.hl || MARCA};padding:2px 10px;${CLONE}">$1</span>`)
    .replace(/\{(.+?)\}/g, `<span style="color:${ctx.acc || ROSE}">$1</span>`)
    .replace(/\*(.+?)\*/g, `<i style="${ctx.i || 'color:' + (ctx.acc || ROSE_ESC)}">$1</i>`)
    .replace(/\n/g, '<br>');
}
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
const ROMANOS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
const ORDINAIS = ['PRIMEIRO', 'SEGUNDO', 'TERCEIRO', 'QUARTO', 'QUINTO', 'SEXTO', 'SÉTIMO', 'OITAVO', 'NONO', 'DÉCIMO'];
const dois = n => String(n).padStart(2, '0');

// ---------- imagens ----------
// Foto da Eduarda sem arquivo: painel rosé com o monograma "EC" (o render avisa).
function foto(ctx, nome, { pos = 'center top', fit = 'cover', tom = 'claro', raio = '' } = {}) {
  const src = nome && ctx.imgs[nome];
  if (src) return `<img data-foto src="${src}" style="width:100%;height:100%;object-fit:${fit};object-position:${pos};display:block${raio}">`;
  if (nome) ctx.faltando.add(nome);
  const [bg, cor] = { claro: ['linear-gradient(180deg,#F1E6E5,#E6D3D3)', '#D4B4B6'], rose: ['linear-gradient(180deg,#E6CFCD,#DDBEBD)', '#C9A3A5'], escuro: ['linear-gradient(180deg,#2A2223,#211B1C)', '#4A3A3B'], papel: ['linear-gradient(180deg,#EAE3DD,#E1D8D1)', '#CDBFB8'] }[tom];
  return `<div data-foto style="width:100%;height:100%;background:${bg};display:flex;align-items:center;justify-content:center"><span style="font-family:'Instrument Serif',serif;font-size:180px;color:${cor};letter-spacing:.04em">EC</span></div>`;
}
function avatar(ctx, px, tom = 'claro') {
  const src = ctx.imgs[ctx.avatar];
  if (!src) ctx.faltando.add(ctx.avatar);
  const dentro = src ? `<img src="${src}" style="width:100%;height:100%;object-fit:cover">`
    : `<span style="font-family:'Instrument Serif',serif;font-size:${Math.round(px * 0.4)}px;color:#fff">EC</span>`;
  return `<div style="width:${px}px;height:${px}px;flex:none;border-radius:50%;overflow:hidden;background:${tom === 'escuro' ? '#3A2E2F' : ROSE};display:flex;align-items:center;justify-content:center">${dentro}</div>`;
}

// ---------- direções modernas ----------
const texto = (s) => lista(s.texto);

// 1a · Editorial: papel, fios finos, Instrument Serif + Hanken Grotesk.
const E = { bg: '#F4EFEA', tinta: '#231C1D', acc: ROSE_ESC, fio: '#CDBFBC' };
const eMold = (tag, miolo) => `
  <div style="position:absolute;left:88px;right:88px;top:72px;display:flex;justify-content:space-between;${HANKEN};font-size:20px;font-weight:600;letter-spacing:.24em;color:${E.tinta}"><span>${NOME.toUpperCase()}</span><span style="color:${E.acc};text-transform:uppercase">${esc(tag || '')}</span></div>
  <div style="position:absolute;left:88px;right:88px;top:118px;height:1px;background:${E.tinta}"></div>
  ${miolo}
  <div style="position:absolute;left:88px;right:88px;bottom:118px;height:1px;background:${E.fio}"></div>
  <div style="position:absolute;left:88px;right:88px;bottom:66px;${HANKEN};font-size:20px;letter-spacing:.08em;color:#6E6263">Advogada — Direito Civil e ECA</div>`;
const EDITORIAL = {
  capa(s, c) {
    return eMold(s.tag, `
      ${s.numeroFundo ? `<div style="position:absolute;left:70px;top:150px;${SERIF};font-style:italic;font-size:620px;line-height:1;color:${ROSE}">${esc(s.numeroFundo)}</div>` : ''}
      ${s.foto ? `<div style="position:absolute;right:88px;top:170px;width:${s.numeroFundo ? 520 : 904}px;height:500px;overflow:hidden">${foto(c, s.foto, { pos: s.fotoPos || 'center 30%', tom: 'papel' })}</div>
        <span style="position:absolute;right:88px;top:684px;${HANKEN};font-size:18px;letter-spacing:.2em;color:#6E6263">FIG. 01 — ${esc(String(s.legenda || 'A AUTORA').toUpperCase())}</span>` : ''}
      <div data-area style="position:absolute;left:88px;right:88px;top:${s.numeroFundo ? 730 : 300}px;bottom:170px;display:flex;flex-direction:column;justify-content:flex-end;gap:36px">
        <span data-titulo style="${SERIF};font-size:${s.ts || 124}px;line-height:.96;letter-spacing:-.01em;text-wrap:balance">${fmt(s.titulo, { acc: E.acc })}</span>
        <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:40px"><span data-corpo style="${HANKEN};font-size:32px;color:${SEC}">${fmt(s.texto)}</span><span style="flex:none;${HANKEN};font-size:22px;font-weight:600;letter-spacing:.16em;color:${E.acc}">ARRASTE →</span></div>
      </div>`);
  },
  item(s, c, n) {
    const ps = texto(s);
    return eMold(s.tag || `${s.rotulo || 'ITEM'} Nº ${dois(n)}`, `
      <div data-area style="position:absolute;left:88px;right:88px;top:220px;bottom:200px;display:grid;grid-template-columns:260px 1fr;gap:40px">
        <span style="${SERIF};font-style:italic;font-size:280px;line-height:.8;color:${ROSE}">${dois(n)}</span>
        <div style="display:flex;flex-direction:column;justify-content:flex-end;gap:44px;padding-bottom:20px">
          <span data-titulo style="${SERIF};font-size:${s.ts || 104}px;line-height:1">${fmt(s.titulo, { i: 'font-style:italic' })}</span>
          <div style="flex:none;height:1px;background:${E.tinta};width:120px"></div>
          ${ps.map((t, i) => `<span data-corpo style="${HANKEN};font-size:36px;line-height:1.5;color:${ps.length > 1 && i === ps.length - 1 ? E.tinta : SEC}">${fmt(t)}</span>`).join('')}
        </div>
      </div>`);
  },
  resumo(s) {
    return eMold(s.tag || 'EM RESUMO', `
      <div data-area style="position:absolute;left:88px;right:88px;top:210px;bottom:170px;display:flex;flex-direction:column;gap:56px">
        <span data-titulo style="${SERIF};font-size:${s.ts || 96}px;line-height:1">${fmt(s.titulo, { acc: E.acc })}</span>
        <div style="display:flex;flex-direction:column">${lista(s.itens).map((t, i) => `<div style="display:flex;align-items:baseline;gap:40px;padding:30px 0;border-top:1px solid ${E.fio}"><span style="${SERIF};font-style:italic;font-size:56px;color:${E.acc};width:80px;flex:none">${dois(i + 1)}</span><span data-corpo style="${HANKEN};font-size:38px;font-weight:500">${fmt(t)}</span></div>`).join('')}</div>
      </div>`);
  },
  cta(s, c) {
    return eMold(s.tag, `
      <div style="position:absolute;left:88px;right:88px;top:170px;height:560px">${foto(c, s.foto, { pos: s.fotoPos || 'center 30%', tom: 'papel' })}</div>
      <div data-area style="position:absolute;left:88px;right:88px;top:790px;bottom:150px;display:flex;flex-direction:column;gap:32px">
        <span data-titulo style="${SERIF};font-size:${s.ts || 88}px;line-height:1.02">${fmt(s.titulo, { acc: E.acc })}</span>
        ${texto(s).map(t => `<span data-corpo style="${HANKEN};font-size:32px;line-height:1.5;color:${SEC}">${fmt(t)}</span>`).join('')}
        ${s.botao ? `<span style="${HANKEN};font-size:30px;font-weight:600;border-bottom:2px solid ${E.tinta};align-self:flex-start;padding-bottom:6px">${fmt(s.botao)} →</span>` : ''}
      </div>`);
  },
};

// 1b · Blocos: rosé claro, grotesca pesada com itálico serifado de destaque.
const BL = { rose: '#EDDCDA', tinta: '#1F1A1B', acc: '#9C6C70' };
const blI = c => `${SERIF};font-style:italic;font-weight:400;letter-spacing:-.01em;color:${c || BL.acc}`;
const BLOCOS = {
  capa(s, c) {
    return `
      <span data-titulo style="position:absolute;left:72px;right:72px;top:190px;${HANKEN};font-size:${s.ts || 118}px;font-weight:700;line-height:.95;letter-spacing:-.045em">${fmt(s.titulo, { i: blI() })}</span>
      <div style="position:absolute;right:72px;bottom:72px;width:520px;height:560px;border-radius:40px;overflow:hidden">${foto(c, s.foto, { pos: s.fotoPos || 'center 25%', tom: 'rose' })}</div>
      <div data-area style="position:absolute;left:72px;bottom:72px;width:380px;display:flex;flex-direction:column;gap:40px">
        <span data-corpo style="${HANKEN};font-size:32px;line-height:1.4;font-weight:500">${fmt(s.texto)}</span>
        <div style="display:flex;align-items:center;gap:18px">${avatar(c, 76)}<div style="display:flex;flex-direction:column"><span style="${HANKEN};font-size:28px;font-weight:600">${NOME}</span><span style="${HANKEN};font-size:19px;color:#6E6263">${CARGO}</span></div></div>
      </div>`;
  },
  item(s, c, n) {
    const ps = texto(s);
    return `
      <div style="position:absolute;left:0;right:0;top:0;height:640px;background:${ROSE}"></div>
      <span style="position:absolute;left:56px;top:40px;${HANKEN};font-size:440px;font-weight:700;line-height:1;letter-spacing:-.06em;color:#fff">${dois(n)}</span>
      <div data-area style="position:absolute;left:72px;right:72px;top:560px;bottom:72px;box-sizing:border-box;background:#fff;border-radius:40px 40px 0 0;padding:72px 64px 0;display:flex;flex-direction:column;gap:40px">
        <span data-titulo style="${HANKEN};font-size:${s.ts || 84}px;font-weight:700;line-height:1;letter-spacing:-.035em">${fmt(s.titulo, { i: blI() })}</span>
        ${ps.map((t, i) => ps.length > 1 && i === ps.length - 1
          ? `<span data-corpo style="${HANKEN};font-size:36px;line-height:1.5;background:${BL.rose};border-radius:24px;padding:32px 36px">${fmt(t)}</span>`
          : `<span data-corpo style="${HANKEN};font-size:36px;line-height:1.5;color:${SEC}">${fmt(t)}</span>`).join('')}
      </div>`;
  },
  resumo(s) {
    const it = lista(s.itens);
    return `
      <div data-area style="position:absolute;left:72px;right:72px;top:150px;bottom:72px;display:flex;flex-direction:column;gap:22px">
        <span data-titulo style="${HANKEN};font-size:${s.ts || 96}px;font-weight:700;line-height:1;letter-spacing:-.04em;margin-bottom:28px">${fmt(s.titulo, { i: blI() })}</span>
        ${it.map((t, i) => { const ult = i === it.length - 1; return `<div style="flex:1;max-height:150px;display:flex;align-items:center;gap:36px;background:${ult ? BL.tinta : '#fff'};color:${ult ? BL.rose : BL.tinta};border-radius:32px;padding:0 44px"><span style="flex:none;width:84px;height:84px;border-radius:50%;background:${ROSE};color:#fff;display:flex;align-items:center;justify-content:center;${HANKEN};font-size:36px;font-weight:700">${i + 1}</span><span data-corpo style="${HANKEN};font-size:40px;font-weight:600;letter-spacing:-.02em">${fmt(t)}</span></div>`; }).join('')}
      </div>`;
  },
  cta(s, c) {
    return `
      <div style="position:absolute;left:52px;top:100px;width:480px;height:480px;border-radius:50%;border:2px solid ${ROSE};box-sizing:border-box"></div>
      <div style="position:absolute;left:72px;top:120px;width:440px;height:440px;border-radius:50%;overflow:hidden">${foto(c, s.foto, { pos: s.fotoPos || 'center 25%', tom: 'escuro' })}</div>
      <span style="position:absolute;left:430px;top:450px;width:110px;height:110px;border-radius:50%;background:${ROSE};color:${BL.tinta};display:flex;align-items:center;justify-content:center;${SERIF};font-style:italic;font-size:44px">VDE</span>
      <div data-area style="position:absolute;left:72px;right:72px;top:560px;bottom:72px;display:flex;flex-direction:column;justify-content:flex-end;gap:44px">
        <span data-titulo style="${HANKEN};font-size:${s.ts || 104}px;font-weight:700;line-height:.98;letter-spacing:-.045em">${fmt(s.titulo, { i: blI(ROSE) })}</span>
        ${texto(s).map(t => `<span data-corpo style="${HANKEN};font-size:34px;line-height:1.5;color:#D8C8C6">${fmt(t)}</span>`).join('')}
        <div style="display:flex;justify-content:space-between;align-items:center;gap:24px">${s.botao ? `<span style="background:${ROSE};color:${BL.tinta};${HANKEN};font-size:30px;font-weight:700;padding:24px 44px;border-radius:999px">${fmt(s.botao)}</span>` : '<span></span>'}<span style="${HANKEN};font-size:22px;font-weight:600;letter-spacing:.1em">${ARROBA}</span></div>
      </div>`;
  },
};

// 1c · Noir: fundo quase preto, moldura fina, arcos e Cormorant Garamond.
const N = { acc: '#E3B8B4', txt: '#D9CCC9', fio: 'rgba(227,184,180,.35)' };
const nMold = miolo => `
  <div style="position:absolute;inset:40px;border:1px solid ${N.fio}"></div>${miolo}
  <div style="position:absolute;left:0;right:0;bottom:78px;display:flex;justify-content:center;${HANKEN};font-size:18px;letter-spacing:.3em;color:#BFAFAC">${NOME.toUpperCase()}</div>`;
const nI = { i: `color:${N.acc}` };
const NOIR = {
  capa(s, c) {
    return nMold(`
      <div style="position:absolute;left:220px;top:110px;width:640px;height:720px;box-sizing:border-box;border-radius:320px 320px 0 0;overflow:hidden;border:1px solid ${N.acc}">${foto(c, s.foto, { pos: s.fotoPos || 'center 20%', tom: 'escuro' })}</div>
      <div data-area style="position:absolute;left:100px;right:100px;top:870px;bottom:130px;display:flex;flex-direction:column;align-items:center;gap:26px;text-align:center">
        ${s.kicker ? `<span style="${HANKEN};font-size:20px;font-weight:600;letter-spacing:.4em;color:${N.acc};text-transform:uppercase">${esc(s.kicker)}</span>` : ''}
        <span data-titulo style="${CORM};font-size:${s.ts || 96}px;font-weight:500;line-height:.98;text-wrap:balance">${fmt(s.titulo, nI)}</span>
      </div>`);
  },
  item(s, c, n) {
    return nMold(`
      <span style="position:absolute;left:100px;top:150px;${CORM};font-style:italic;font-size:300px;line-height:1;color:${N.acc}">${ROMANOS[n - 1] || n}.</span>
      <span style="position:absolute;right:100px;top:190px;${HANKEN};font-size:20px;font-weight:600;letter-spacing:.4em;color:#BFAFAC;text-transform:uppercase">${esc(s.tag || `${ORDINAIS[n - 1] || n + 'º'} ${s.rotulo || 'ITEM'}`)}</span>
      <div data-area style="position:absolute;left:100px;right:100px;top:520px;bottom:140px;display:flex;flex-direction:column;gap:48px">
        <span data-titulo style="${CORM};font-size:${s.ts || 112}px;font-weight:500;line-height:.95">${fmt(s.titulo, nI)}</span>
        <div style="display:flex;align-items:center;gap:20px"><span style="height:1px;flex:1;background:${N.fio}"></span><span style="color:${N.acc};font-size:20px">◆</span><span style="height:1px;flex:1;background:${N.fio}"></span></div>
        <span data-corpo style="${HANKEN};font-size:36px;line-height:1.55;color:${N.txt}">${texto(s).map(t => fmt(t, { b: N.acc })).join(' ')}</span>
      </div>`);
  },
  resumo(s) {
    return nMold(`
      <div data-area style="position:absolute;left:110px;right:110px;top:160px;bottom:140px;display:flex;flex-direction:column;align-items:center;gap:70px">
        <div style="display:flex;flex-direction:column;align-items:center;gap:16px"><span style="${HANKEN};font-size:20px;font-weight:600;letter-spacing:.4em;color:${N.acc}">${esc(s.tag || 'EM RESUMO')}</span><span data-titulo style="${CORM};font-size:${s.ts || 100}px;font-weight:500;font-style:italic;line-height:1;text-align:center">${fmt(s.titulo, nI)}</span></div>
        <div style="width:100%;display:flex;flex-direction:column;gap:44px">${lista(s.itens).map((t, i) => `<div style="display:flex;align-items:baseline;gap:24px"><span style="${CORM};font-style:italic;font-size:52px;color:${N.acc};width:90px;flex:none">${ROMANOS[i]}.</span><span data-corpo style="${HANKEN};font-size:36px">${fmt(t)}</span><span style="flex:1;min-width:40px;border-bottom:1px dotted ${N.fio};transform:translateY(-8px)"></span></div>`).join('')}</div>
      </div>`);
  },
  cta(s, c) {
    return nMold(`
      <div style="position:absolute;right:100px;top:120px;width:420px;height:560px;box-sizing:border-box;border-radius:210px 210px 0 0;overflow:hidden;border:1px solid ${N.acc}">${foto(c, s.foto, { pos: s.fotoPos || 'center 20%', tom: 'escuro' })}</div>
      ${s.marca ? `<span style="position:absolute;left:100px;top:170px;width:440px;${CORM};font-style:italic;font-size:220px;line-height:.8;color:${N.acc}">${esc(s.marca)}</span>` : ''}
      <div data-area style="position:absolute;left:100px;right:100px;top:760px;bottom:140px;display:flex;flex-direction:column;gap:40px">
        <span data-titulo style="${CORM};font-size:${s.ts || 92}px;font-weight:500;line-height:1">${fmt(s.titulo, nI)}</span>
        ${texto(s).map(t => `<span data-corpo style="${HANKEN};font-size:32px;line-height:1.5;color:${N.txt}">${fmt(t, { b: N.acc })}</span>`).join('')}
        ${s.botao ? `<span style="align-self:flex-start;border:1px solid ${N.acc};color:${N.acc};${HANKEN};font-size:24px;font-weight:600;letter-spacing:.2em;padding:22px 40px;text-transform:uppercase">${fmt(s.botao)}</span>` : ''}
      </div>`);
  },
};

const MODERNAS = {
  '1a': { tipos: EDITORIAL, bg: () => E.bg, cor: E.tinta },
  '1b': { tipos: BLOCOS, bg: t => ({ capa: BL.rose, item: '#fff', resumo: BL.rose, cta: BL.tinta }[t]), cor: t => (t === 'cta' ? BL.rose : BL.tinta) },
  '1c': { tipos: NOIR, bg: () => '#1B1516', cor: '#F3E9E6' },
};

const FONTES = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Hanken+Grotesk:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,500;1,500&display=swap';

export function renderCarrossel(c) {
  const linha = c.direcao;
  const total = c.slides.length;
  const ctx = { imgs: c._imgs || {}, avatar: c.avatar || 'avatar.jpg', faltando: new Set() };
  const avisos = [];
  const conta = {};
  const m = MODERNAS[linha];
  if (!m) avisos.push(`direcao "${linha}" não existe (use 1a, 1b ou 1c)`);
  const slides = m ? c.slides.map((s, i) => {
    conta[s.tipo] = (conta[s.tipo] || 0) + 1;
    const n = s.numero ?? conta[s.tipo];
    const f = m.tipos[s.tipo];
    if (!f) { avisos.push(`slide ${i + 1}: tipo "${s.tipo}" não existe (use capa, item, resumo ou cta)`); return ''; }
    const bg = m.bg(s.tipo), cor = typeof m.cor === 'function' ? m.cor(s.tipo) : m.cor;
    return `<div id="slide-${i + 1}" style="position:absolute;left:${i * 1080}px;top:0;width:1080px;height:1350px;overflow:hidden;background:${bg};color:${cor};font-family:'Hanken Grotesk',sans-serif">${f(s, ctx, n)}</div>`;
  }) : [];
  ctx.faltando.forEach(f => avisos.push(`foto pendente: ${f} (coloque em fotos/)`));

  const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTES}" rel="stylesheet">
<style>*{margin:0;padding:0}body{width:${total * 1080}px;height:1350px;-webkit-font-smoothing:antialiased}#painel{position:relative;width:${total * 1080}px;height:1350px}b{font-weight:600}</style>
</head><body><div id="painel">${slides.join('')}</div></body></html>`;
  return { html, total, avisos };
}

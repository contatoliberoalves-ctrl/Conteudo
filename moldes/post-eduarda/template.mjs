// Post Eduarda: posts de TELA ÚNICA (1080×1350) para a Eduarda Caraciolo (Advogada · Direito Civil e ECA).
//   "frase"   frase curta gigante em minúsculas, com a última palavra em letra cursiva; fundo de cor lisa e até 2 fotos redondas
//   "convite" cartão marrom com borda de selo, adesivo rosa "Comenta X que eu te mando", conversa de direct e palavra cursiva ao fundo
// Mesma regra de marca do Carrossel Eduarda Pop: só as 5 cores da paleta + branco, fontes Inter Tight e Yellowtail.
// Marcação: **negrito**, *cursiva*, {cor de destaque}, \n quebra a linha.

const ARROBA = '@eduardacaraciolo';
const FONTES = 'https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Yellowtail&family=Noto+Color+Emoji&display=swap';
const W = 1080, H = 1350;
const C = { blush: '#FFEBED', claro: '#FEBAC5', escuro: '#F4789A', pink: '#FC79AB', pessego: '#FEA9AC' };
const TIGHT = "font-family:'Inter Tight','Noto Color Emoji',sans-serif";
const CURSIVA = "font-family:'Yellowtail',cursive;font-weight:400";

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
const fmt = (t, m = {}) => esc(t)
  .replace(/\*\*(.+?)\*\*/g, `<b style="${m.b || 'font-weight:700'}">$1</b>`)
  .replace(/\{(.+?)\}/g, `<span style="${m.acc || ''}">$1</span>`)
  .replace(/\*(.+?)\*/g, `<span style="${m.i || CURSIVA}">$1</span>`)
  .replace(/\n/g, '<br>');

function img(ctx, nome, pos = 'center 30%') {
  const src = nome && ctx.imgs[nome];
  if (src) return `<div data-foto style="position:relative;width:100%;height:100%"><img src="${src}" style="width:100%;height:100%;object-fit:cover;object-position:${esc(pos)};display:block;filter:saturate(.85)"><div style="position:absolute;inset:0;background:${C.claro};mix-blend-mode:soft-light;opacity:.6"></div></div>`;
  if (nome) ctx.faltando.add(nome);
  return `<div data-foto style="width:100%;height:100%;background:linear-gradient(160deg,${C.claro},${C.pessego});display:flex;align-items:center;justify-content:center;${TIGHT};font-size:90px;color:#fff">EC</div>`;
}
const estrelinha = (x, y, px, cor, rot = 0) => `<svg style="position:absolute;left:${x}px;top:${y}px;width:${px}px;height:${px}px;transform:rotate(${rot}deg);z-index:4" viewBox="0 0 100 100"><path d="M50 6 L61 37 L94 38 L68 58 L78 92 L50 72 L22 92 L32 58 L6 38 L39 37Z" fill="none" stroke="${cor}" stroke-width="4" stroke-linejoin="round"/></svg>`;

// ---------- frase ----------
const CORES = { blush: [C.blush, C.escuro], claro: [C.claro, '#fff'], escuro: [C.escuro, '#fff'], pink: [C.pink, '#fff'], pessego: [C.pessego, '#fff'] };
function frase(s, ctx) {
  const [bg, tinta] = CORES[s.cor] || CORES.blush, fotos = lista(s.fotos).slice(0, 2);
  const tam = s.ts || 150;
  return `<div style="position:absolute;inset:0;background:${bg}">
    <div data-area style="position:absolute;left:90px;right:90px;top:110px;bottom:130px;display:flex;flex-direction:column;justify-content:center;align-items:${s.alinhar === 'esquerda' ? 'flex-start' : 'center'};text-align:${s.alinhar === 'esquerda' ? 'left' : 'center'};gap:10px">
      <div data-titulo style="${TIGHT};font-weight:700;font-size:${tam}px;line-height:.88;letter-spacing:-.065em;color:${tinta}">${fmt(s.frase, { i: `${CURSIVA};letter-spacing:0;font-size:1.15em` })}</div>
      ${fotos.length ? `<div style="position:relative;display:flex;gap:40px;margin:30px 0 10px">${fotos.map((f, i) => `<div style="width:300px;height:300px;border-radius:50%;overflow:hidden;transform:rotate(${i ? 5 : -5}deg)">${img(ctx, f, (s.fotosPos || [])[i])}</div>`).join('')}
        ${estrelinha(-70, 30, 60, tinta, -10)}${estrelinha(fotos.length * 340 - 10, 10, 70, tinta, 12)}${estrelinha(fotos.length * 340 - 60, 220, 44, tinta, 0)}</div>` : ''}
      ${s.fim ? `<div style="${CURSIVA};font-size:${Math.round(tam * (s.fimEscala || 1.35))}px;line-height:.9;white-space:nowrap;color:${tinta};margin-top:${fotos.length ? -40 : 10}px">${fmt(s.fim)}</div>` : ''}
    </div>
    <div style="position:absolute;left:0;right:0;bottom:70px;display:flex;justify-content:center"><div style="${TIGHT};font-size:22px;font-weight:600;color:${tinta};border:1.5px solid ${tinta};border-radius:999px;padding:6px 22px">${ARROBA}</div></div>
  </div>`;
}

// ---------- convite ----------
const CV = { bg: C.blush, cartao: C.escuro, rosa: C.pink, rosaClaro: C.blush };
function convite(s, ctx) {
  const conversa = lista(s.conversa);
  return `<div style="position:absolute;inset:0;background-color:${CV.bg};background-image:linear-gradient(${C.claro}88 1.5px,transparent 1.5px),linear-gradient(90deg,${C.claro}88 1.5px,transparent 1.5px);background-size:45px 45px">
    <div style="position:absolute;left:70px;right:70px;top:56px;display:flex;justify-content:space-between;${TIGHT};font-size:20px;letter-spacing:.14em;color:${C.escuro}"><span style="font-weight:600">EDUARDA CARACIOLO</span><span style="font-weight:800">ADVOGADA · CIVIL E ECA</span></div>
    ${s.fundo ? `<div style="position:absolute;left:-20px;right:-20px;bottom:-60px;text-align:center;${CURSIVA};font-size:330px;line-height:1;color:${C.claro};opacity:.8;white-space:nowrap">${esc(s.fundo)}</div>` : ''}
    <div style="position:absolute;left:90px;top:170px;width:900px;height:612px;background:${CV.cartao};padding:18px;-webkit-mask:linear-gradient(#000 0 0) content-box,radial-gradient(circle 11px,#0000 98%,#000) -18px -18px/36px 36px;filter:drop-shadow(0 12px 18px rgba(244,120,154,.35))">
      <div data-area style="position:absolute;left:78px;right:78px;top:84px;bottom:70px;display:flex;flex-direction:column;justify-content:center;gap:26px">
        <div data-titulo style="${TIGHT};font-weight:700;font-size:${s.ts || 76}px;line-height:1;letter-spacing:-.045em;color:#fff">${fmt(s.manchete, { acc: `background:#fff;color:${C.escuro};padding:0 .14em;border-radius:.14em;box-decoration-break:clone;-webkit-box-decoration-break:clone`, i: `${CURSIVA};color:${C.blush}` })}</div>
        ${s.texto ? `<div data-corpo style="${TIGHT};font-weight:300;font-size:32px;line-height:1.2;letter-spacing:-.03em;color:#fff;max-width:620px">${fmt(s.texto, { b: `font-weight:800;color:#fff` })}</div>` : ''}
      </div>
    </div>
    <div style="position:absolute;left:504px;top:130px;width:84px;height:84px;border-radius:50%;background:radial-gradient(circle at 35% 30%,${C.claro},${C.pink} 70%);border:4px solid #fff;box-shadow:0 4px 10px rgba(244,120,154,.4);display:flex;align-items:center;justify-content:center;${CURSIVA};font-size:44px;color:#fff;z-index:3">E</div>
    ${s.palavra ? `<div style="position:absolute;right:70px;top:640px;transform:rotate(9deg);background:#fff;border-radius:30px;padding:26px 38px;box-shadow:0 10px 20px rgba(244,120,154,.3);outline:3px dashed ${C.pink};outline-offset:-10px;text-align:center;${TIGHT};font-weight:800;font-size:40px;line-height:1.02;letter-spacing:-.03em;color:${C.escuro};z-index:4">Comenta<br><span style="color:${C.pink}">“${esc(s.palavra)}”</span> que eu<br>te mando${s.oque ? ' ' + esc(s.oque) : ''}.</div>` : ''}
    <div style="position:absolute;left:130px;right:170px;top:880px;display:flex;flex-direction:column;gap:22px;z-index:3">
      ${conversa.map(m => { const eu = m.de === 'eu'; return `<div style="display:flex;align-items:flex-end;gap:14px;${eu ? 'flex-direction:row-reverse' : ''}"><div style="width:44px;height:44px;border-radius:50%;flex:none;background:${eu ? C.pink : C.claro};color:#fff;display:flex;align-items:center;justify-content:center;${TIGHT};font-size:18px;font-weight:700">${eu ? 'EC' : ''}</div><div style="max-width:560px;background:#fff;border-radius:22px;padding:18px 28px;box-shadow:0 4px 12px rgba(244,120,154,.18);${TIGHT};font-weight:500;font-size:30px;line-height:1.25;color:${C.escuro}">${fmt(m.texto)}</div></div>`; }).join('')}
    </div>
  </div>`;
}

const LAYOUTS = { frase, convite };

export function renderCarrossel(c) {
  const ctx = { imgs: c._imgs || {}, faltando: new Set() };
  const avisos = [];
  const f = LAYOUTS[c.layout];
  if (!f) avisos.push(`layout "${c.layout}" não existe (${Object.keys(LAYOUTS).join(', ')})`);
  const corpo = f ? f(c, ctx) : '';
  ctx.faltando.forEach(nome => avisos.push(`foto não encontrada: ${nome} (coloque em fotos/)`));
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet">
<style>*{box-sizing:border-box}body{margin:0;-webkit-font-smoothing:antialiased}</style></head><body>
<div id="slide-1" style="position:relative;width:${W}px;height:${H}px;overflow:hidden">${corpo}</div></body></html>`;
  return { html, total: 1, avisos };
}

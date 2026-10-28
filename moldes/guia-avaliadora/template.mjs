// Guia de bolso da avaliadora em A6 retrato (480×677 px = 105×148 mm; render em 3×).
// Linguagem dos PDFs do Renato (títulos grandes em Bricolage Grotesque, pílulas, marca-d'água gigante)
// em cores de advocacia: azul-marinho, vinho, dourado e papel.
export const W = 480, H = 677;
const COR = { marinho: '#13213C', marinho2: '#1D3157', vinho: '#6E1F2F', vinho2: '#8E2C40', ouro: '#B4924F', ouroClaro: '#D9BF86', papel: '#F7F3EA', linha: '#E3DACA', tinta: '#1B1B22', cinza: '#6A665F', verde: '#2F6B4F' };
const F = "font-family:'Bricolage Grotesque',sans-serif;font-weight:800;letter-spacing:-.03em;text-transform:uppercase";
const I = "font-family:'Inter',sans-serif";
export const FONTES = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500&display=swap';
export const HEAD = `<link rel="stylesheet" href="${FONTES}">`;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
// [[texto]] sai em destaque (dourado no escuro, vinho no claro); **texto** em negrito; ___ vira linha para completar.
const rico = (s, cor) => esc(s).replace(/\[\[(.+?)\]\]/g, `<span style="color:${cor}">$1</span>`).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
  .replace(/_{3,}/g, '<span style="display:inline-block;width:70px;border-bottom:1.5px solid currentColor;opacity:.55;transform:translateY(-3px)"></span>');
const TEMAS = {
  papel: { fundo: COR.papel, texto: COR.tinta, sub: COR.cinza, dest: COR.vinho, linha: COR.linha, card: '#fff', escuro: false },
  marinho: { fundo: `radial-gradient(90% 70% at 90% 100%,${COR.marinho2} 0%,${COR.marinho} 70%)`, texto: '#fff', sub: '#B9C0CF', dest: COR.ouroClaro, linha: 'rgba(255,255,255,.14)', card: 'rgba(255,255,255,.06)', escuro: true },
  vinho: { fundo: `radial-gradient(90% 70% at 90% 100%,${COR.vinho2} 0%,${COR.vinho} 70%)`, texto: '#fff', sub: '#E6C9CE', dest: COR.ouroClaro, linha: 'rgba(255,255,255,.18)', card: 'rgba(255,255,255,.07)', escuro: true },
};
const grao = op => `<div style="position:absolute;inset:0;background-image:url(../assets/grao.png);background-size:300px;opacity:${op};mix-blend-mode:overlay;pointer-events:none"></div>`;
const pilula = (t, tm) => `<span style="display:inline-flex;align-items:center;gap:7px;${I};font-weight:700;font-size:10.5px;letter-spacing:.17em;text-transform:uppercase;padding:7px 12px;border-radius:999px;${tm.escuro ? `background:rgba(217,191,134,.12);color:${COR.ouroClaro};border:1px solid rgba(217,191,134,.35)` : `background:#fff;color:${COR.vinho};border:1px solid ${COR.linha}`}"><span style="width:5px;height:5px;border-radius:50%;background:currentColor"></span>${esc(t)}</span>`;
// Marca-d'água: o Y da Teoria do Y, em contorno.
const marcaY = (cor, w, extra) => `<svg viewBox="0 0 100 100" style="position:absolute;width:${w}px;${extra}" fill="none" stroke="${cor}" stroke-width="2.2" stroke-linejoin="round"><path d="M42 98 V58 L14 8 H30 L50 44 L70 8 H86 L58 58 V98 Z"/></svg>`;
const titulo = (t, tm, px = 44) => `<div data-titulo style="${F};font-size:${px}px;line-height:.93;color:${tm.texto}">${lista(t).map(l => rico(l, tm.dest)).join('<br>')}</div>`;

// ---------- blocos ----------
const rotulo = (t, tm) => t ? `<div style="${I};font-size:10.5px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:${tm.escuro ? COR.ouroClaro : COR.ouro};margin-bottom:9px">${esc(t)}</div>` : '';
const caixa = tm => `width:15px;height:15px;flex:none;border-radius:4px;border:1.6px solid ${tm.escuro ? COR.ouroClaro : COR.vinho};margin-top:2px`;
const B = {
  texto: (b, tm) => `<div style="${I};font-size:15.5px;line-height:1.5;color:${tm.sub}">${lista(b.texto).map(t => rico(t, tm.texto)).join('<br>')}</div>`,
  check: (b, tm) => `<div>${rotulo(b.rotulo, tm)}<div style="display:flex;flex-direction:column;gap:8px">${lista(b.itens).map(t => `
    <div style="display:flex;gap:10px;${I};font-size:15px;line-height:1.38;color:${tm.texto}"><span style="${caixa(tm)}"></span><span>${rico(t, tm.dest)}</span></div>`).join('')}</div></div>`,
  fala: (b, tm) => `<div style="background:${tm.escuro ? 'rgba(255,255,255,.07)' : '#fff'};border:1px solid ${tm.linha};border-left:4px solid ${tm.escuro ? COR.ouroClaro : COR.vinho};border-radius:4px 16px 16px 4px;padding:15px 17px 15px 18px">
    ${rotulo(b.rotulo || 'Fala', tm)}${lista(b.texto).map(t => `<div style="${I};font-style:italic;font-weight:500;font-size:15.5px;line-height:1.5;color:${tm.texto};margin-top:4px">${rico(t, tm.dest)}</div>`).join('')}</div>`,
  regra: (b, tm) => `<div style="background:${tm.escuro ? COR.ouroClaro : COR.vinho};color:${tm.escuro ? COR.marinho : '#fff'};border-radius:14px;padding:13px 17px;${I};font-weight:700;font-size:14.5px;line-height:1.42">${b.rotulo ? `<div style="font-size:10px;letter-spacing:.18em;text-transform:uppercase;opacity:.75;margin-bottom:4px">${esc(b.rotulo)}</div>` : ''}${lista(b.texto).map(t => rico(t, tm.escuro ? COR.vinho : COR.ouroClaro)).join('<br>')}</div>`,
  // Sequência curta em linha (A → B → C; sep troca a seta, ex.: "ou") ou numerada em coluna (vertical: true).
  fluxo: (b, tm) => b.vertical
    ? `<div>${rotulo(b.rotulo, tm)}<div style="display:flex;flex-direction:column;gap:0">${lista(b.passos).map((p, i, a) => `
      <div style="display:flex;gap:13px;align-items:stretch"><div style="display:flex;flex-direction:column;align-items:center;width:30px;flex:none">
        <div style="width:30px;height:30px;border-radius:50%;background:${tm.escuro ? COR.ouroClaro : COR.marinho};color:${tm.escuro ? COR.marinho : '#fff'};display:flex;align-items:center;justify-content:center;${F};font-size:15px;letter-spacing:0">${i + 1}</div>
        ${i < a.length - 1 ? `<div style="flex:1;width:2px;background:${tm.escuro ? 'rgba(217,191,134,.4)' : COR.linha};min-height:8px"></div>` : ''}</div>
        <div style="padding:4px 0 ${i < a.length - 1 ? 11 : 0}px;${I};font-size:15px;line-height:1.38;color:${tm.texto}">${rico(p, tm.dest)}</div></div>`).join('')}</div></div>`
    : `<div>${rotulo(b.rotulo, tm)}<div style="display:flex;flex-wrap:wrap;align-items:center;gap:7px 6px">${lista(b.passos).map((p, i) => `${i ? `<span style="color:${tm.escuro ? COR.ouroClaro : COR.ouro};font-weight:800;${I};font-size:${b.sep ? 11 : 14}px;${b.sep ? 'text-transform:uppercase;letter-spacing:.1em' : ''}">${esc(b.sep || '→')}</span>` : ''}<span style="${I};font-weight:700;font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;padding:7px 11px;border-radius:999px;background:${tm.escuro ? 'rgba(255,255,255,.08)' : '#fff'};border:1px solid ${tm.escuro ? 'rgba(217,191,134,.35)' : COR.linha};color:${tm.texto}">${esc(p)}</span>`).join('')}</div></div>`,
  // Pares rótulo → pergunta/resposta.
  perguntas: (b, tm) => `<div>${rotulo(b.rotulo, tm)}<div style="border-top:1px solid ${tm.linha}">${lista(b.itens).map(x => `
    <div style="display:flex;gap:12px;padding:8px 0;border-bottom:1px solid ${tm.linha}"><span style="flex:none;width:${b.largura || 92}px;${I};font-weight:800;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:${tm.escuro ? COR.ouroClaro : COR.vinho};padding-top:2px;line-height:1.3">${esc(x.k)}</span>
    <span style="${I};font-size:14.5px;line-height:1.42;color:${tm.texto}">${rico(x.q, tm.dest)}</span></div>`).join('')}</div></div>`,
  linhas: (b, tm) => `<div>${rotulo(b.rotulo, tm)}${lista(b.itens).map(t => `<div style="margin-top:9px"><div style="${I};font-size:12px;font-weight:600;color:${tm.sub}">${esc(t)}</div>${Array.from({ length: b.n || 2 }, () => `<div style="height:27px;border-bottom:1.4px solid ${tm.escuro ? 'rgba(255,255,255,.3)' : '#CFC5B2'}"></div>`).join('')}</div>`).join('')}</div>`,
  // A estrada em Y: vem por um caminho e se divide em dois.
  y: (b, tm) => `<div style="position:relative;height:${b.altura || 330}px">
    <svg viewBox="0 0 550 330" style="position:absolute;inset:0;width:100%;height:100%">
      <path d="M275 196 Q275 150 240 118 L90 10" fill="none" stroke="${COR.cinza}" stroke-opacity=".35" stroke-width="44" stroke-linecap="round"/>
      <path d="M275 196 Q275 150 310 118 L460 10" fill="none" stroke="${COR.vinho}" stroke-width="44" stroke-linecap="round"/>
      <path d="M275 330 L275 190" fill="none" stroke="${COR.marinho}" stroke-width="44"/>
      <path d="M275 322 L275 196" stroke="#fff" stroke-width="3" stroke-dasharray="12 12"/>
      <path d="M262 160 Q250 140 222 120 L106 36" stroke="#fff" stroke-opacity=".8" stroke-width="3" stroke-dasharray="12 12" fill="none"/>
      <path d="M288 160 Q300 140 328 120 L444 36" stroke="#fff" stroke-width="3" stroke-dasharray="12 12" fill="none"/>
      <circle cx="275" cy="182" r="15" fill="${COR.ouro}" stroke="#fff" stroke-width="4"/>
    </svg>
    <div style="position:absolute;left:0;top:${(b.altura || 330) * .36}px;width:44%;${I}">
      <div style="${F};font-size:21px;line-height:1;color:${COR.cinza}">${esc(b.esquerda)}</div><div style="font-size:13px;line-height:1.38;color:${tm.sub};margin-top:5px">${rico(b.esquerdaTexto, tm.texto)}</div></div>
    <div style="position:absolute;right:0;top:${(b.altura || 330) * .36}px;width:44%;text-align:right;${I}">
      <div style="${F};font-size:21px;line-height:1;color:${COR.vinho}">${esc(b.direita)}</div><div style="font-size:13px;line-height:1.38;color:${tm.sub};margin-top:5px">${rico(b.direitaTexto, tm.texto)}</div></div>
    <div style="position:absolute;left:53%;bottom:2px;width:46%;${I};font-size:12.5px;line-height:1.35;color:${tm.sub}"><b style="color:${COR.marinho}">${esc(b.base)}</b><br>${rico(b.baseTexto, tm.texto)}</div></div>`,
  // Lista grande de perguntas (cartão final).
  grandes: (b, tm) => `<div>${rotulo(b.rotulo, tm)}<div style="display:flex;flex-direction:column;gap:6px">${lista(b.itens).map(t => `<div style="display:flex;gap:10px;align-items:center"><span style="${caixa(tm)};margin:0"></span><span style="${F};font-size:21px;line-height:1.05;color:${tm.texto}">${rico(t, tm.dest)}</span></div>`).join('')}</div></div>`,
};

const rodape = (n, tm, g) => `<div data-r style="position:absolute;left:30px;right:30px;bottom:18px;display:flex;justify-content:space-between;${I};font-size:9px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:${tm.escuro ? 'rgba(255,255,255,.5)' : COR.cinza}"><span>${esc(g.rodape)}</span><span>${String(n).padStart(2, '0')}</span></div>`;

function capa(g, pg) {
  const tm = TEMAS.marinho;
  return `<div style="position:absolute;inset:0;background:${tm.fundo}"></div>${grao(.3)}
    ${marcaY('rgba(217,191,134,.16)', 430, 'right:-150px;bottom:-50px')}
    <div style="position:absolute;left:30px;right:30px;top:30px;display:flex;justify-content:space-between;align-items:center">${pilula(pg.etiqueta || 'Guia de bolso', tm)}<span style="${I};font-weight:700;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#fff">${esc(g.clinica)}</span></div>
    <div style="position:absolute;left:30px;right:30px;top:150px">
      <div style="${I};font-weight:600;font-size:12.5px;letter-spacing:.22em;text-transform:uppercase;color:${COR.ouroClaro};margin-bottom:18px">${esc(pg.kicker)}</div>
      <div style="${F};font-size:${pg.ts || 60}px;line-height:.88;color:#fff">${lista(pg.titulo).map(l => rico(l, COR.ouroClaro)).join('<br>')}</div>
      <div style="width:60px;height:3px;background:${COR.ouro};margin:32px 0 22px"></div>
      <div style="${I};font-size:16px;line-height:1.6;color:#C9CEDA">${lista(pg.sub).map(t => rico(t, '#fff')).join('<br>')}</div></div>
    <div style="position:absolute;left:30px;bottom:30px;display:flex;gap:8px;flex-wrap:wrap;max-width:340px">${lista(pg.pilulas).map(t => `<span style="${I};font-weight:600;font-size:11px;color:#E4E7EE;padding:7px 12px;border-radius:999px;border:1px solid rgba(255,255,255,.22)">${esc(t)}</span>`).join('')}</div>`;
}

function pagina(g, pg, n) {
  const tm = TEMAS[pg.tema || 'papel'];
  return `<div style="position:absolute;inset:0;background:${tm.fundo}"></div>${grao(tm.escuro ? .28 : .16)}
    ${pg.marca !== false ? marcaY(tm.escuro ? 'rgba(217,191,134,.1)' : 'rgba(110,31,47,.07)', 230, 'right:-90px;top:-30px') : ''}
    <div data-area style="position:absolute;left:30px;right:30px;top:28px;bottom:44px;display:flex;flex-direction:column">
      <div>${pilula(pg.etiqueta, tm)}</div>
      <div style="margin:22px 0 ${pg.intro ? 10 : 20}px">${titulo(pg.titulo, tm, pg.ts)}</div>
      ${pg.intro ? `<div style="${I};font-size:14.5px;line-height:1.5;color:${tm.sub};margin-bottom:18px">${rico(pg.intro, tm.texto)}</div>` : ''}
      <div style="display:flex;flex-direction:column;gap:${pg.gap || 16}px">${lista(pg.blocos).map(b => B[b.tipo](b, tm)).join('')}</div></div>
    ${rodape(n, tm, g)}`;
}

export function renderGuia(g) {
  const pags = lista(g.paginas).map((pg, i) => pg.tipo === 'capa' ? capa(g, pg) : pagina(g, pg, i + 1));
  const html = `<!doctype html><html><head><meta charset="utf-8">${HEAD}<style>*{box-sizing:border-box}html,body{margin:0;background:#333}b{font-weight:700}
.slide{position:relative;width:${W}px;height:${H}px;overflow:hidden;margin-bottom:10px}</style></head>
<body>${pags.map(s => `<section class="slide">${s}</section>`).join('')}</body></html>`;
  return { html, total: pags.length };
}

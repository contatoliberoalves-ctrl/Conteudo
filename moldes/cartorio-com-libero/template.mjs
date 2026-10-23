// Molde "Cartório com Líbero" (plataforma de preparação para concursos de cartório / ENAC): peças digitais em
// tamanhos livres (capa de produto 300×250, banner de checkout 1200×400…) na identidade do insta pessoal do
// Líbero: navy profundo, azul do perfil, Big Shoulders nos títulos, Schibsted no texto, granulado e anéis;
// o vermelho do perfil dá lugar a um dourado discreto. renderPeca(p) devolve { html, largura, altura, avisos }.
// Layouts: "capa" (produto, compacto) e "banner" (faixa larga com texto à esquerda e painel de estudos à direita).

const COR = {
  navy: '#0F1A2E', navy2: '#14213A', azul: '#0B4FD8', medio: '#2F64E0', claro: '#8FB0FF',
  ouro: '#C9A45C', ouroClaro: '#E6CC92', texto: '#C9D4EA', branco: '#FFFFFF',
};
const T = "font-family:'Big Shoulders Display',sans-serif;font-weight:900;text-transform:uppercase";
const S = "font-family:'Schibsted Grotesk',sans-serif";
const FONTES = 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@800;900&family=Schibsted+Grotesk:wght@500;600;700;800&display=swap';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
// [[palavra]] = caixa azul com filete dourado embaixo; **negrito**.
const rico = (s, pad) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b style="font-weight:800;color:#fff">$1</b>')
  .replace(/\[\[(.+?)\]\]/g, `<span style="background:${COR.azul};color:#fff;padding:0 ${pad}px;box-shadow:inset 0 -${Math.max(2, Math.round(pad / 3))}px 0 ${COR.ouro}">$1</span>`);

const fundo = (w, h) => `<div style="position:absolute;inset:0;background:radial-gradient(120% 110% at 100% 0%,#203A72 0%,${COR.navy2} 45%,${COR.navy} 100%)"></div>
  <div style="position:absolute;inset:0;background-image:url(../assets/grao.png);background-size:${Math.round(Math.max(w, h) / 3)}px;opacity:.32;mix-blend-mode:overlay"></div>`;
const check = (px, cor = COR.ouro) => `<svg viewBox="0 0 24 24" width="${px}" height="${px}" style="flex:none"><circle cx="12" cy="12" r="11" fill="${cor}"/><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="${COR.navy}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const vazio = px => `<svg viewBox="0 0 24 24" width="${px}" height="${px}" style="flex:none"><circle cx="12" cy="12" r="10" fill="none" stroke="rgba(201,212,234,.45)" stroke-width="2"/></svg>`;

// Calendário de bolso: cabeçalho azul com o mês, grade de dias com alguns marcados.
function calendario(w, rotulo, feitos, total = 14, col = 7) {
  const cel = Math.floor((w - 16 - (col - 1) * 4) / col);
  return `<div style="width:${w}px;background:rgba(255,255,255,.07);border:1px solid rgba(143,176,255,.28);border-radius:${Math.round(w / 18)}px;overflow:hidden;backdrop-filter:blur(2px)">
    <div style="background:${COR.azul};padding:${Math.round(cel / 3)}px 8px;display:flex;justify-content:space-between;align-items:center;${S};font-weight:800;font-size:${Math.max(7, Math.round(cel / 2.2))}px;letter-spacing:.14em;color:#fff;text-transform:uppercase"><span>${esc(rotulo)}</span><span style="display:flex;gap:3px"><i style="width:4px;height:4px;border-radius:50%;background:${COR.ouro}"></i><i style="width:4px;height:4px;border-radius:50%;background:#fff;opacity:.6"></i></span></div>
    <div style="display:grid;grid-template-columns:repeat(${col},${cel}px);gap:4px;padding:8px">${Array.from({ length: total }, (_, i) => feitos.includes(i)
      ? `<div style="height:${cel}px;border-radius:${Math.round(cel / 4)}px;background:${COR.ouro};display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" width="${Math.round(cel * .62)}"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="${COR.navy}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`
      : `<div style="height:${cel}px;border-radius:${Math.round(cel / 4)}px;background:rgba(143,176,255,${i % 3 ? .14 : .26})"></div>`).join('')}</div></div>`;
}
// Linha de evolução: curva subindo em azul-claro, área suave e ponto dourado no fim.
function evolucao(w, h) {
  const p = [[0, .82], [.18, .7], [.34, .74], [.5, .52], [.66, .46], [.82, .28], [1, .12]].map(([x, y]) => [Math.round(8 + x * (w - 16)), Math.round(8 + y * (h - 16))]);
  const d = p.map((q, i) => (i ? 'L' : 'M') + q.join(' ')).join(' ');
  const [ux, uy] = p[p.length - 1];
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="display:block">
    ${[.25, .5, .75].map(f => `<line x1="8" x2="${w - 8}" y1="${Math.round(h * f)}" y2="${Math.round(h * f)}" stroke="rgba(143,176,255,.16)" stroke-width="1"/>`).join('')}
    <path d="${d} L${w - 8} ${h - 4} L8 ${h - 4} Z" fill="rgba(47,100,224,.28)"/>
    <path d="${d}" fill="none" stroke="${COR.claro}" stroke-width="${Math.max(2, Math.round(w / 90))}" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="${ux}" cy="${uy}" r="${Math.max(4, Math.round(w / 40))}" fill="${COR.ouro}" stroke="${COR.navy}" stroke-width="2"/></svg>`;
}

const LAYOUTS = {
  // Capa de produto compacta (300×250): título em duas linhas, a palavra-chave na caixa azul, assinatura em
  // dourado, calendário de bolso no canto e a linha de progresso no pé.
  capa(p) {
    const w = p.w || 300, h = p.h || 250;
    const passos = p.passos || 5, feitos = p.feitos ?? 3;
    return { w, h, html: `${fundo(w, h)}
      <div style="position:absolute;right:-70px;top:-70px;width:170px;height:170px;border-radius:50%;border:16px solid ${COR.azul};box-sizing:border-box"></div>
      <div style="position:absolute;right:-46px;top:-46px;width:122px;height:122px;border-radius:50%;border:1.5px solid ${COR.ouro};opacity:.8;box-sizing:border-box"></div>
      <div data-area style="position:absolute;left:20px;top:26px;right:20px;display:flex;flex-direction:column;align-items:flex-start;gap:8px">
        ${p.selo ? `<div style="${S};font-weight:800;font-size:8.5px;letter-spacing:.2em;text-transform:uppercase;color:${COR.claro}">${esc(p.selo)}</div>` : ''}
        <h1 style="margin:0;${T};font-size:${p.ts || 46}px;line-height:1.02;color:#fff">${lista(p.linhas).map(l => rico(l, 6)).join('<br>')}</h1>
        <div style="display:flex;align-items:center;gap:7px;margin-top:4px"><span style="width:16px;height:2px;background:${COR.ouro}"></span><span style="${S};font-weight:700;font-size:12px;letter-spacing:.04em;color:${COR.ouroClaro}">${esc(p.assinatura)}</span></div>
      </div>
      <div style="position:absolute;right:16px;bottom:44px;transform:rotate(-4deg)">${calendario(92, p.mes || 'Semana 1', [0, 1, 2, 4, 7], 14)}</div>
      <div style="position:absolute;left:20px;right:20px;bottom:18px;display:flex;align-items:center;gap:0">
        ${Array.from({ length: passos }, (_, i) => `${i ? `<span style="flex:1;height:2px;background:${i <= feitos - 1 ? COR.ouro : 'rgba(143,176,255,.3)'}"></span>` : ''}<span style="width:9px;height:9px;border-radius:50%;flex:none;background:${i < feitos ? COR.ouro : 'transparent'};border:2px solid ${i < feitos ? COR.ouro : 'rgba(143,176,255,.55)'}"></span>`).join('')}
      </div>` };
  },
  // Banner largo (1200×400): assinatura em cima, título com a palavra-chave na caixa azul, texto de apoio e,
  // à direita, o painel de estudos (calendário, checklist e evolução) em cartões translúcidos.
  banner(p) {
    const w = p.w || 1200, h = p.h || 400;
    const itens = lista(p.checklist);
    return { w, h, html: `${fundo(w, h)}
      <div style="position:absolute;right:-170px;top:-230px;width:620px;height:620px;border-radius:50%;border:56px solid ${COR.azul};opacity:.55;box-sizing:border-box"></div>
      <div style="position:absolute;right:-90px;top:-150px;width:460px;height:460px;border-radius:50%;border:2px solid ${COR.ouro};opacity:.45;box-sizing:border-box"></div>
      <div style="position:absolute;left:-120px;bottom:-190px;width:300px;height:300px;border-radius:50%;border:2px solid rgba(143,176,255,.25);box-sizing:border-box"></div>
      <div data-area style="position:absolute;left:84px;top:0;bottom:0;width:${p.larguraTexto || 720}px;display:flex;flex-direction:column;justify-content:center;gap:18px">
        <div style="display:flex;align-items:center;gap:12px"><span style="width:34px;height:3px;background:${COR.ouro}"></span><span style="${S};font-weight:800;font-size:17px;letter-spacing:.22em;text-transform:uppercase;color:${COR.ouroClaro}">${esc(p.assinatura)}</span></div>
        <h1 style="margin:0;${T};font-size:${p.ts || 82}px;line-height:1.02;color:#fff">${lista(p.linhas).map(l => rico(l, 14)).join('<br>')}</h1>
        <p style="margin:0;${S};font-weight:500;font-size:${p.tt || 25}px;line-height:1.35;color:${COR.texto};max-width:${p.larguraTexto || 720}px">${rico(p.texto, 0)}</p>
      </div>
      <div style="position:absolute;right:50px;top:50%;transform:translateY(-50%);width:370px;height:300px">
        <div style="position:absolute;left:0;top:0;transform:rotate(-3deg)">${calendario(180, p.mes || 'Cronograma', [0, 1, 2, 3, 5, 8, 9], 21)}</div>
        <div style="position:absolute;right:0;top:6px;width:168px;background:rgba(255,255,255,.08);border:1px solid rgba(143,176,255,.28);border-radius:12px;padding:12px 14px;display:flex;flex-direction:column;gap:9px;transform:rotate(2deg)">
          ${itens.map((t, i) => `<div style="display:flex;align-items:center;gap:8px">${i < (p.feitos ?? itens.length - 1) ? check(16) : vazio(16)}<span style="${S};font-weight:700;font-size:13px;color:${i < (p.feitos ?? itens.length - 1) ? '#fff' : COR.texto}">${esc(t)}</span></div>`).join('')}
        </div>
        <div style="position:absolute;left:70px;bottom:0;width:280px;background:rgba(255,255,255,.07);border:1px solid rgba(143,176,255,.28);border-radius:12px;padding:10px 12px 6px">
          <div style="display:flex;justify-content:space-between;${S};font-weight:800;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:${COR.claro};margin-bottom:2px"><span>${esc(p.rotuloEvolucao || 'Desempenho')}</span><span style="color:${COR.ouroClaro}">▲</span></div>
          ${evolucao(256, 84)}</div>
      </div>` };
  },
};

export function renderPeca(p) {
  const { w, h, html } = (LAYOUTS[p.layout] || LAYOUTS.capa)(p);
  return { largura: w, altura: h, avisos: [], html: `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet">
<style>*{box-sizing:border-box}html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden;background:${COR.navy}}i{display:block}</style></head>
<body><div style="position:relative;width:${w}px;height:${h}px;overflow:hidden">${html}</div></body></html>` };
}

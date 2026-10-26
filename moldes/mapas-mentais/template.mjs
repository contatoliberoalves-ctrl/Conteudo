// Molde "Mapas Mentais · Constitucional com Líbero": A4 horizontal (1123×794 px = 297×210 mm).
// Capa em degradê verde leve, em 4 estilos (capa.estilo): tipografica, caderno, topografico e marcatexto.
// Página do mapa com cara de mapa de estudo feito à mão: papel pontilhado, tema no centro num balão de traço
// duplo, ramos grossos de caneta saindo do centro, títulos com marca-texto, sub-ramos em árvore, artigo numa
// etiqueta e a pegadinha num post-it. Os ramos são desenhados no navegador depois do layout (ver ligar()).
export const W = 1123, H = 794;
const COR = { floresta: '#0B4A30', verde: '#16804F', tinta: '#1C2B24', texto: '#2E3B35', cinza: '#7A8A82', papel: '#FCFDFB' };
// Canetas dos ramos e o marca-texto que combina com cada uma.
const CANETAS = [
  ['#1E8E5A', '#B9F2CF'], ['#2B6CB0', '#C7E2FF'], ['#E07B24', '#FFE08A'],
  ['#C2417A', '#FFC9DF'], ['#0F8C8C', '#BDF0EC'], ['#6B4FBB', '#DCD2FF'],
];
export const FONTES = 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@800;900&family=Inter:wght@400;500;600;700;800&family=Kalam:wght@300;400;700&display=swap';
const T = "font-family:'Big Shoulders Display',sans-serif;font-weight:900;text-transform:uppercase";
const I = "font-family:'Inter',sans-serif";
const K = "font-family:'Kalam',cursive";
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
// **negrito** com marca-texto (cor do ramo) e [[sublinhado]] de caneta.
const marca = (s, cor = '#FFE08A', tinta = COR.tinta) => esc(s)
  .replace(/\*\*(.+?)\*\*/g, `<b style="font-weight:700;color:${tinta};background:linear-gradient(transparent 52%,${cor} 52%,${cor} 92%,transparent 92%);padding:0 2px">$1</b>`)
  .replace(/\[\[(.+?)\]\]/g, `<span style="text-decoration:underline;text-decoration-color:${tinta};text-decoration-thickness:2px;text-underline-offset:3px">$1</span>`);

// ---------- Capas ----------
// Curvas de nível (o "mapa") geradas de forma determinística.
function curvas(cx, cy, n, cor, op = .25, passo = 26, seed = 3) {
  let o = '';
  for (let k = 1; k <= n; k++) {
    const r = k * passo, pts = [];
    for (let a = 0; a <= 360; a += 10) {
      const t = a * Math.PI / 180, d = r * (1 + .12 * Math.sin(3 * t + seed + k * .3) + .07 * Math.cos(5 * t + seed * 2));
      pts.push([cx + d * Math.cos(t) * 1.25, cy + d * Math.sin(t)]);
    }
    o += `<path d="M${pts.map(p => p.map(v => v.toFixed(1)).join(' ')).join(' L')} Z" fill="none" stroke="${cor}" stroke-width="${k % 4 ? 1.2 : 2.2}" opacity="${op}"/>`;
  }
  return o;
}
const rodapeCapa = (c, m, cor) => `<div style="position:absolute;left:70px;right:70px;bottom:56px;display:flex;justify-content:space-between;align-items:flex-end">
    ${c.volume ? `<div><div style="${I};font-size:11px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:${cor};opacity:.75">Tema deste volume</div><div style="${I};font-size:20px;font-weight:700;color:${cor};margin-top:4px">${esc(c.volume)}</div></div>` : '<div></div>'}
    <div style="${I};font-size:14px;font-weight:700;color:${cor}">${esc(m.perfil || '@liberofilho')}</div></div>`;

const CAPAS = {
  // Só tipografia: degradê verde bem claro, título grande em verde-escuro e o número do volume vazado.
  tipografica: (c, m) => `<section class="pagina" style="background:linear-gradient(120deg,#EEF8F1 0%,#D3EEDD 55%,#B4E0C5 100%)">
    <div style="position:absolute;right:40px;top:40px;${T};font-size:420px;line-height:.8;color:transparent;-webkit-text-stroke:2px rgba(11,74,48,.22)">${esc(c.numero || '01')}</div>
    <div style="position:absolute;left:70px;top:150px">
      <div style="${I};font-size:15px;font-weight:700;letter-spacing:.26em;text-transform:uppercase;color:${COR.verde}">${esc(c.pre || 'Constitucional com Líbero')}</div>
      <div style="width:70px;height:4px;background:${COR.verde};margin:18px 0 22px"></div>
      <div style="${T};font-size:170px;line-height:.84;color:${COR.floresta}">Mapas<br>Mentais</div></div>
    ${rodapeCapa(c, m, COR.floresta)}</section>`,

  // Caderno: capa verde com espiral na lateral e etiqueta branca colada, preenchida à mão.
  caderno: (c, m) => `<section class="pagina" style="background:linear-gradient(135deg,#2C8C5A 0%,#1E7149 100%)">
    <div style="position:absolute;inset:0;background:repeating-linear-gradient(90deg,rgba(255,255,255,.025) 0 2px,transparent 2px 6px)"></div>
    <div style="position:absolute;left:0;top:0;bottom:0;width:70px;background:rgba(0,0,0,.12)"></div>
    ${Array.from({ length: 17 }, (_, i) => `<div style="position:absolute;left:18px;top:${40 + i * 43}px;width:46px;height:20px;border-radius:10px;border:4px solid #D9DEDA;border-left-color:#9AA39E;box-shadow:0 2px 3px rgba(0,0,0,.3)"></div><div style="position:absolute;left:52px;top:${46 + i * 43}px;width:10px;height:10px;border-radius:50%;background:#0F3D27"></div>`).join('')}
    <div style="position:absolute;left:300px;top:190px;width:600px;background:#FBFBF6;border-radius:14px;padding:30px 40px 34px;box-shadow:0 10px 24px rgba(0,0,0,.22);transform:rotate(-1.2deg)">
      <div style="position:absolute;inset:10px;border:1.5px solid #1E7149;border-radius:8px"></div>
      <div style="position:relative;${I};font-size:13px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:${COR.verde};text-align:center">${esc(c.pre || 'Constitucional com Líbero')}</div>
      <div style="position:relative;${T};font-size:96px;line-height:.9;color:${COR.floresta};text-align:center;margin-top:12px">Mapas Mentais</div>
      ${c.volume ? `<div style="position:relative;margin-top:22px;display:flex;align-items:flex-end;gap:12px"><span style="${I};font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${COR.cinza}">Tema:</span><span style="flex:1;border-bottom:1.5px solid #9DB3A6;${K};font-size:30px;line-height:1.1;color:#1B3FA0;padding:0 6px">${esc(c.volume)}</span></div>` : ''}</div>
    <div style="position:absolute;right:70px;bottom:56px;${I};font-size:14px;font-weight:700;color:#fff">${esc(m.perfil || '@liberofilho')}</div></section>`,

  // Topográfico: curvas de nível claras sobre o degradê, o "mapa" no sentido literal.
  topografico: (c, m) => `<section class="pagina" style="background:linear-gradient(135deg,#1B7A4C 0%,#2F9A64 55%,#5DBB86 100%)">
    <svg width="${W}" height="${H}" style="position:absolute;inset:0">${curvas(860, 330, 16, '#fff', .22)}${curvas(180, 760, 8, '#fff', .16, 30, 7)}</svg>
    <div style="position:absolute;left:70px;top:170px">
      <div style="${I};font-size:15px;font-weight:700;letter-spacing:.26em;text-transform:uppercase;color:#DFF5E8">${esc(c.pre || 'Constitucional com Líbero')}</div>
      <div style="${T};font-size:160px;line-height:.85;color:#fff;margin-top:18px">Mapas<br>Mentais</div></div>
    ${rodapeCapa(c, m, '#fff')}</section>`,

  // Marca-texto: papel quase branco com um degradê verde leve, título grifado e uma anotação à caneta.
  marcatexto: (c, m) => `<section class="pagina" style="background:linear-gradient(160deg,#FFFFFF 0%,#EAF6EE 60%,#CDEBD8 100%)">
    <div style="position:absolute;inset:0;background-image:radial-gradient(#B9CCBF 1.2px,transparent 1.2px);background-size:26px 26px;opacity:.6"></div>
    <div style="position:absolute;left:90px;top:150px">
      <div style="${I};font-size:15px;font-weight:700;letter-spacing:.26em;text-transform:uppercase;color:${COR.verde}">${esc(c.pre || 'Constitucional com Líbero')}</div>
      <div style="${T};font-size:170px;line-height:.92;color:${COR.tinta};margin-top:20px">
        <span style="background:linear-gradient(transparent 38%,#9FE3B8 38%,#9FE3B8 88%,transparent 88%);padding:0 10px">Mapas</span><br>
        <span style="background:linear-gradient(transparent 38%,#9FE3B8 38%,#9FE3B8 88%,transparent 88%);padding:0 10px">Mentais</span></div></div>
    ${c.nota ? `<div style="position:absolute;left:680px;top:200px;width:300px;${K};font-size:30px;line-height:1.15;color:#1B3FA0;transform:rotate(-4deg)">${esc(c.nota)}</div>
    <svg viewBox="0 0 200 120" style="position:absolute;left:560px;top:270px;width:170px;transform:rotate(-6deg)"><path d="M190 20 C 140 30, 90 50, 30 100" fill="none" stroke="#1B3FA0" stroke-width="4" stroke-linecap="round"/><path d="M30 100 L 46 76 M30 100 L 58 98" stroke="#1B3FA0" stroke-width="4" stroke-linecap="round"/></svg>` : ''}
    ${rodapeCapa(c, m, COR.floresta)}</section>`,
};
const capa = (c, m) => (CAPAS[c.estilo] || CAPAS.tipografica)(c, m);

// ---------- Página do mapa ----------
// Ramos em 3 linhas × 2 lados; cada bloco tem título com marca-texto, etiqueta do artigo, sub-ramos em árvore
// e, se houver, um post-it com a pegadinha.
function mapa(m, p, n) {
  const ramos = lista(p.ramos).map((r, i) => ({ ...r, cor: CANETAS[i % CANETAS.length][0], grifo: CANETAS[i % CANETAS.length][1] }));
  const metade = Math.ceil(ramos.length / 2), esq = ramos.slice(0, metade), dir = ramos.slice(metade);
  const bloco = (r, lado) => `<div class="ramo" data-lado="${lado}" data-cor="${r.cor}" style="position:relative;padding:${lado === 'e' ? '0 18px 0 0' : '0 0 0 18px'}">
      <div class="ancora" style="display:flex;align-items:center;gap:8px;${lado === 'e' ? 'justify-content:flex-end' : ''}">
        ${lado === 'd' && r.artigo ? `<span style="${I};font-size:10px;font-weight:800;color:${r.cor};border:1.5px solid ${r.cor};border-radius:4px;padding:1px 6px;transform:rotate(-3deg)">${esc(r.artigo)}</span>` : ''}
        <span class="tit" style="${K};font-weight:700;font-size:${r.ts || 25}px;line-height:1.05;color:${r.cor};background:linear-gradient(transparent 55%,${r.grifo} 55%,${r.grifo} 95%,transparent 95%);padding:0 4px">${esc(r.titulo)}</span>
        ${lado === 'e' && r.artigo ? `<span style="${I};font-size:10px;font-weight:800;color:${r.cor};border:1.5px solid ${r.cor};border-radius:4px;padding:1px 6px;transform:rotate(3deg)">${esc(r.artigo)}</span>` : ''}</div>
      <div style="margin-top:5px;${lado === 'e' ? `border-right:2px solid ${r.cor};padding-right:12px` : `border-left:2px solid ${r.cor};padding-left:12px`}">
        ${r.resumo ? `<div style="${K};font-size:${p.corpo || 15}px;line-height:1.25;color:${COR.tinta};margin-bottom:3px">${marca(r.resumo, r.grifo)}</div>` : ''}
        ${lista(r.itens).map(it => `<div style="position:relative;${K};font-weight:300;font-size:${(p.corpo || 15) - 1}px;line-height:1.25;color:${COR.texto};margin-top:3px">
          <span style="position:absolute;${lado === 'e' ? 'right:-14px' : 'left:-14px'};top:9px;width:9px;height:2px;background:${r.cor}"></span>${marca(it, r.grifo)}</div>`).join('')}</div>
      ${r.dica ? `<div style="margin-top:8px;${lado === 'e' ? 'margin-left:auto' : ''};width:${p.postit || 250}px;background:#FFF4A8;padding:8px 11px 9px;box-shadow:0 3px 8px rgba(0,0,0,.12);transform:rotate(${lado === 'e' ? -1.5 : 1.5}deg);position:relative">
          <span style="position:absolute;left:50%;top:-7px;width:56px;height:14px;margin-left:-28px;background:rgba(200,215,205,.75);transform:rotate(-2deg)"></span>
          <div style="${K};font-weight:700;font-size:13px;color:#B23A3A">Pegadinha!</div>
          <div style="${K};font-size:13px;line-height:1.2;color:${COR.tinta}">${marca(r.dica, '#FFD54A')}</div></div>` : ''}</div>`;
  const coluna = (rs, lado) => `<div style="width:${p.largura || 350}px;display:flex;flex-direction:column;justify-content:space-around;height:100%;gap:${p.gap || 10}px">${rs.map(r => bloco(r, lado)).join('')}</div>`;
  return `<section class="pagina mapa" style="background:${COR.papel}">
    <div style="position:absolute;inset:0;background-image:radial-gradient(#D5DED8 1px,transparent 1px);background-size:22px 22px"></div>
    <svg class="ligacoes" width="${W}" height="${H}" style="position:absolute;inset:0;z-index:1"></svg>
    <div style="position:absolute;left:40px;right:40px;top:20px;display:flex;justify-content:space-between;align-items:center;z-index:2">
      <span style="${I};font-size:10px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:${COR.verde}">Constitucional com Líbero · Mapas Mentais</span>
      ${p.tema ? `<span style="${I};font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${COR.cinza}">${esc(p.tema)}</span>` : ''}</div>
    <div style="position:absolute;left:30px;right:30px;top:44px;bottom:${p.rodape ? 46 : 28}px;display:flex;align-items:stretch;justify-content:space-between;z-index:2">
      ${coluna(esq, 'e')}
      <div style="flex:1;display:flex;align-items:center;justify-content:center">
        <div class="centro" style="position:relative;width:${p.centroW || 230}px;padding:20px 16px;text-align:center">
          <div style="position:absolute;inset:0;border:3px solid ${COR.floresta};border-radius:46% 54% 50% 50% / 55% 48% 52% 45%;background:#fff"></div>
          <div style="position:absolute;inset:-6px -4px -4px -7px;border:1.5px solid ${COR.floresta};border-radius:52% 48% 46% 54% / 48% 55% 45% 52%;opacity:.55"></div>
          ${p.artigo ? `<div style="position:relative;${I};font-size:10px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:${COR.verde}">${esc(p.artigo)}</div>` : ''}
          <div style="position:relative;${K};font-weight:700;font-size:${p.ts || 34}px;line-height:1;color:${COR.floresta};margin-top:4px">${lista(p.titulo).map(esc).join('<br>')}</div>
          ${p.sub ? `<div style="position:relative;${K};font-size:13.5px;line-height:1.2;color:${COR.texto};margin-top:8px">${marca(p.sub, '#B9F2CF')}</div>` : ''}</div></div>
      ${coluna(dir, 'd')}</div>
    ${p.rodape ? `<div style="position:absolute;left:40px;right:90px;bottom:16px;${K};font-size:14px;line-height:1.2;color:${COR.tinta};z-index:2"><b style="color:${COR.verde}">Pra fixar →</b> ${marca(p.rodape, '#B9F2CF')}</div>` : ''}
    <div style="position:absolute;right:40px;bottom:16px;${I};font-size:10px;font-weight:700;color:${COR.cinza};z-index:2">${String(n).padStart(2, '0')}</div>
  </section>`;
}

// Ramos de caneta do centro até a âncora de cada bloco: traço grosso que afina (dois traços sobrepostos).
const LIGAR = `<script>
function ligar() {
  for (const pg of document.querySelectorAll('.pagina.mapa')) {
    const svg = pg.querySelector('.ligacoes'), base = pg.getBoundingClientRect(), c = pg.querySelector('.centro').getBoundingClientRect();
    let out = '';
    for (const r of pg.querySelectorAll('.ramo')) {
      const a = r.querySelector('.tit').getBoundingClientRect(), b = r.getBoundingClientRect(), esq = r.dataset.lado === 'e', cor = r.dataset.cor;
      const x1 = (esq ? c.left + 14 : c.right - 14) - base.left, y1 = c.top + c.height / 2 - base.top;
      const x2 = (esq ? b.right + 2 : b.left - 2) - base.left, y2 = a.top + a.height - 3 - base.top, mx = (x1 + x2) / 2;
      const d = 'M' + x1 + ' ' + y1 + ' C ' + mx + ' ' + y1 + ', ' + mx + ' ' + y2 + ', ' + x2 + ' ' + y2;
      // sublinha o título do ramo, como no mapa feito à mão
      const xs = (esq ? a.left : a.right) - base.left;
      out += '<path d="' + d + '" stroke="' + cor + '" stroke-width="9" fill="none" stroke-linecap="round" opacity=".35"/>'
        + '<path d="' + d + '" stroke="' + cor + '" stroke-width="4" fill="none" stroke-linecap="round"/>'
        + '<path d="M' + x2 + ' ' + y2 + ' L ' + xs + ' ' + y2 + '" stroke="' + cor + '" stroke-width="3" stroke-linecap="round"/>';
    }
    svg.innerHTML = out;
  }
  window.__avisos = [...document.querySelectorAll('.pagina.mapa')].flatMap((pg, i) => {
    const b = pg.getBoundingClientRect();
    return [...pg.querySelectorAll('.ramo,.centro')].some(e => { const r = e.getBoundingClientRect(); return r.top < b.top + 40 || r.bottom > b.bottom - 24; }) ? ['mapa ' + (i + 1) + ': passa da área'] : [];
  });
  window.__pronto = true;
}
document.fonts.ready.then(() => setTimeout(ligar, 50));
</script>`;

export function renderMapas(m) {
  const pags = [];
  for (const c of lista(m.capas || m.capa)) pags.push(capa(c, m));
  lista(m.mapas).forEach(p => pags.push(mapa(m, p, pags.length + 1)));
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet">
<style>@page{size:297mm 210mm;margin:0}*{box-sizing:border-box}body{margin:0;background:#888}.pagina{position:relative;width:${W}px;height:${H}px;overflow:hidden}</style></head>
<body>${pags.join('')}${LIGAR}</body></html>`;
}

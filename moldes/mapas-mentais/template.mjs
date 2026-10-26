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
export const FONTES = 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@800;900&family=Inter:wght@400;500;600;700;800&family=Kalam:wght@300;400;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap';
const T = "font-family:'Big Shoulders Display',sans-serif;font-weight:900;text-transform:uppercase";
const I = "font-family:'Inter',sans-serif";
const K = "font-family:'Kalam',cursive";
const J = "font-family:'Plus Jakarta Sans',sans-serif";
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
// **negrito** com marca-texto (cor do ramo) e [[sublinhado]] de caneta.
const marca = (s, cor = '#FFE08A', tinta = COR.tinta) => esc(s)
  .replace(/\*\*(.+?)\*\*/g, `<b style="font-weight:700;color:${tinta};background:linear-gradient(transparent 52%,${cor} 52%,${cor} 92%,transparent 92%);padding:0 2px">$1</b>`)
  .replace(/\[\[(.+?)\]\]/g, `<span style="text-decoration:underline;text-decoration-color:${tinta};text-decoration-thickness:2px;text-underline-offset:3px">$1</span>`);

// **negrito** na cor do ramo (com fundo bem claro) e [[texto]] sublinhado: usado no mapa moderno.
const destaque = (s, cor) => esc(s).replace(/\*\*(.+?)\*\*/g, `<b style="font-weight:700;color:${cor};background:${cor}12;border-radius:3px;padding:0 2px">$1</b>`)
  .replace(/\[\[(.+?)\]\]/g, `<span style="text-decoration:underline;text-decoration-color:${cor};text-decoration-thickness:2px;text-underline-offset:2px">$1</span>`);

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
    <div style="position:absolute;left:70px;top:0;bottom:0;right:70px;display:flex;flex-direction:column;justify-content:center">
      <div style="${I};font-size:15px;font-weight:700;letter-spacing:.26em;text-transform:uppercase;color:${COR.verde}">${esc(c.pre || 'Constitucional com Líbero')}</div>
      <div style="width:70px;height:4px;background:${COR.verde};margin:18px 0 22px"></div>
      <div style="${T};font-size:${c.ts || 150}px;line-height:.84;color:${COR.floresta}">Mapas<br>Mentais</div>
      ${c.tema ? `<div style="${J};font-weight:800;font-size:${c.tt || 54}px;line-height:1.05;letter-spacing:-.02em;color:${COR.verde};margin-top:34px;max-width:900px">${lista(c.tema).map(esc).join('<br>')}</div>` : ''}</div>
    <div style="position:absolute;right:70px;bottom:56px;${I};font-size:14px;font-weight:700;color:${COR.floresta}">${esc(m.perfil || '@liberofilho')}</div></section>`,

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
// Moderno: fundo branco com brilho verde nos cantos, nó central verde, ramos em curvas suaves na cor do ramo
// (com ponto na saída e na chegada) e cartões com cabeçalho colorido (título + inciso), resumo, tópicos
// numerados e uma faixa âmbar de "Pegadinha".
const PALETA = ['#138A55', '#0E7C86', '#2563EB', '#0B5C3B', '#7C3AED', '#D97706'];
function mapa(m, p, n) {
  const ramos = lista(p.ramos).map((r, i) => ({ ...r, cor: r.cor || PALETA[i % PALETA.length] }));
  const metade = Math.ceil(ramos.length / 2), esq = ramos.slice(0, metade), dir = ramos.slice(metade);
  const fs = p.corpo || 11.5;
  const cartao = (r, lado) => `<div class="ramo" data-lado="${lado}" data-cor="${r.cor}" style="position:relative;background:#fff;border-radius:16px;box-shadow:0 1px 0 rgba(15,42,30,.04),0 10px 26px rgba(15,42,30,.08);border:1px solid #E3ECE7;overflow:hidden">
      <div class="cab" style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 14px;background:${r.cor}">
        <span style="${J};font-weight:800;font-size:${r.ts || 16}px;letter-spacing:-.01em;color:#fff">${esc(r.titulo)}</span>
        ${r.artigo ? `<span style="flex:none;${I};font-size:10px;font-weight:800;letter-spacing:.04em;color:${r.cor};background:#fff;padding:3px 8px;border-radius:999px">${esc(r.artigo)}</span>` : ''}</div>
      <div style="padding:10px 14px 11px">
        ${r.resumo ? `<div style="${I};font-size:${fs + .5}px;font-weight:600;line-height:1.38;color:${COR.tinta}">${destaque(r.resumo, r.cor)}</div>` : ''}
        ${lista(r.itens).length ? `<div style="display:flex;flex-direction:column;gap:5px;margin-top:7px">${lista(r.itens).map((it, k) => `<div style="display:flex;gap:8px;${I};font-size:${fs}px;line-height:1.4;color:${COR.texto}">
          <span style="flex:none;width:17px;height:17px;border-radius:5px;background:${r.cor}1A;color:${r.cor};${I};font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;margin-top:1px">${k + 1}</span><span>${destaque(it, r.cor)}</span></div>`).join('')}</div>` : ''}</div>
      ${r.dica ? `<div style="display:flex;gap:8px;align-items:flex-start;background:#FFF7E6;border-top:1px solid #F7E2B5;padding:8px 14px;${I};font-size:${fs - .5}px;line-height:1.38;color:#5A4210">
          <svg viewBox="0 0 24 24" width="15" style="flex:none;margin-top:1px"><path d="M12 3 2 20h20L12 3z" fill="#F59E0B"/><rect x="11" y="9" width="2" height="6" rx="1" fill="#fff"/><circle cx="12" cy="17.2" r="1.1" fill="#fff"/></svg>
          <span><b style="font-weight:800;color:#B45309">Pegadinha:</b> ${destaque(r.dica, '#B45309')}</span></div>` : ''}</div>`;
  const coluna = (rs, lado) => `<div style="width:${p.largura || 345}px;display:flex;flex-direction:column;justify-content:center;gap:${p.gap || 14}px">${rs.map(r => cartao(r, lado)).join('')}</div>`;
  return `<section class="pagina mapa" style="background:#fff">
    <div style="position:absolute;left:-180px;top:-200px;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,#DDF3E6 0%,rgba(221,243,230,0) 70%)"></div>
    <div style="position:absolute;right:-200px;bottom:-240px;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,#DDF3E6 0%,rgba(221,243,230,0) 70%)"></div>
    <svg class="ligacoes" width="${W}" height="${H}" style="position:absolute;inset:0;z-index:1"></svg>
    <div style="position:absolute;left:36px;right:36px;top:22px;display:flex;justify-content:space-between;align-items:center;z-index:2">
      <span style="${I};font-size:10px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:${COR.verde}">Constitucional com Líbero · Mapas Mentais</span>
      ${p.tema ? `<span style="${I};font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${COR.cinza}">${esc(p.tema)}</span>` : ''}</div>
    <div style="position:absolute;left:30px;right:30px;top:48px;bottom:${p.rodape ? 50 : 30}px;display:flex;align-items:center;justify-content:space-between;z-index:2">
      ${coluna(esq, 'e')}
      <div style="flex:1;display:flex;align-items:center;justify-content:center">
        <div class="centro" style="position:relative;width:${p.centroW || 230}px;padding:24px 18px;text-align:center;border-radius:28px;background:linear-gradient(150deg,${COR.floresta} 0%,#138A55 100%);box-shadow:0 0 0 8px #E6F5EC,0 18px 40px rgba(11,74,48,.28)">
          ${p.artigo ? `<div style="${I};font-size:10px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:#A7E8C3">${esc(p.artigo)}</div>` : ''}
          <div style="${J};font-weight:800;font-size:${p.ts || 28}px;line-height:1.05;letter-spacing:-.02em;color:#fff;margin-top:6px">${lista(p.titulo).map(esc).join('<br>')}</div>
          ${p.sub ? `<div style="${I};font-size:11.5px;line-height:1.45;color:#D7F0E1;margin-top:10px">${esc(p.sub).replace(/\*\*(.+?)\*\*/g, '<b style="color:#fff">$1</b>')}</div>` : ''}</div></div>
      ${coluna(dir, 'd')}</div>
    ${p.rodape ? `<div style="position:absolute;left:36px;right:80px;bottom:16px;display:flex;align-items:center;gap:10px;z-index:2">
      <span style="flex:none;${I};font-size:10px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#fff;background:${COR.verde};padding:5px 10px;border-radius:999px">Pra fixar</span>
      <span style="${I};font-size:11px;line-height:1.35;color:${COR.tinta}">${destaque(p.rodape, COR.verde)}</span></div>` : ''}
    <div style="position:absolute;right:36px;bottom:18px;${I};font-size:10px;font-weight:700;color:${COR.cinza};z-index:2">${String(n).padStart(2, '0')}</div>
  </section>`;
}

// Liga o centro a cada cartão: curva suave na cor do ramo, ponto branco com borda na saída e na chegada.
const LIGAR = `<script>
function ligar() {
  for (const pg of document.querySelectorAll('.pagina.mapa')) {
    const svg = pg.querySelector('.ligacoes'), base = pg.getBoundingClientRect(), c = pg.querySelector('.centro').getBoundingClientRect();
    let out = '';
    for (const r of pg.querySelectorAll('.ramo')) {
      const b = r.getBoundingClientRect(), h = r.querySelector('.cab').getBoundingClientRect(), esq = r.dataset.lado === 'e', cor = r.dataset.cor;
      const x1 = (esq ? c.left : c.right) - base.left, y1 = c.top + c.height / 2 - base.top;
      const x2 = (esq ? b.right : b.left) - base.left, y2 = h.top + h.height / 2 - base.top, mx = (x1 + x2) / 2;
      out += '<path d="M' + x1 + ' ' + y1 + ' C ' + mx + ' ' + y1 + ', ' + mx + ' ' + y2 + ', ' + x2 + ' ' + y2 + '" stroke="' + cor + '" stroke-width="2.5" fill="none" stroke-linecap="round"/>'
        + '<circle cx="' + x2 + '" cy="' + y2 + '" r="5" fill="#fff" stroke="' + cor + '" stroke-width="2.5"/>';
    }
    svg.innerHTML = out;
  }
  window.__avisos = [...document.querySelectorAll('.pagina.mapa')].flatMap((pg, i) => {
    const b = pg.getBoundingClientRect();
    return [...pg.querySelectorAll('.ramo,.centro')].some(e => { const r = e.getBoundingClientRect(); return r.top < b.top + 44 || r.bottom > b.bottom - 30; }) ? ['mapa ' + (i + 1) + ': passa da área'] : [];
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

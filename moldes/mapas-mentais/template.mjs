// Molde "Mapas Mentais · Constitucional com Líbero": A4 horizontal (1123×794 px = 297×210 mm).
// Capa em degradê verde leve com o livro da Constituição (capa verde-escura com friso e selo dourados) e um "§"
// gigante ao fundo; páginas de mapa em fundo branco: tema no centro, ramos em cartões dos dois lados, ligados ao
// centro por curvas na cor do ramo (desenhadas no navegador depois do layout, ver ligar()).
export const W = 1123, H = 794;
const COR = {
  floresta: '#0B4A30', verde: '#16804F', folha: '#2FA36B', claro: '#7CCB9F', menta: '#EAF6EF', salvia: '#D5EBDD',
  tinta: '#0F2A1E', texto: '#2B4237', cinza: '#6B7F75', ouro: '#C9A646', ouroClaro: '#E9D48C',
};
// Cores dos ramos, em volta do verde: um ramo dourado para quebrar a monotonia.
const RAMOS = ['#16804F', '#0E7C7B', '#2FA36B', '#B8862B', '#1D6FA3', '#0B4A30'];
export const FONTES = 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@800;900&family=Inter:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@1,9..144,500;1,9..144,600&display=swap';
const T = "font-family:'Big Shoulders Display',sans-serif;font-weight:900;text-transform:uppercase";
const I = "font-family:'Inter',sans-serif";
const F = "font-family:'Fraunces',serif;font-style:italic";
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
// **negrito** na cor do ramo e [[caixa]] (palavra com fundo).
const rico = (s, cor = COR.tinta) => esc(s).replace(/\*\*(.+?)\*\*/g, `<b style="font-weight:800;color:${cor}">$1</b>`)
  .replace(/\[\[(.+?)\]\]/g, `<span style="background:${cor};color:#fff;padding:0 .14em;border-radius:3px">$1</span>`);

// Livro da Constituição: capa verde-escura, friso dourado, selo com estrela e "1988".
const livro = (w = 300) => {
  const h = w * 1.36;
  return `<div style="position:relative;width:${w}px;height:${h}px;transform:rotate(-6deg);filter:drop-shadow(0 30px 40px rgba(4,30,18,.45))">
    <div style="position:absolute;left:${w * .06}px;top:${w * .03}px;width:${w}px;height:${h}px;border-radius:6px 14px 14px 6px;background:#F4F1E6"></div>
    <div style="position:absolute;left:${w * .03}px;top:${w * .015}px;width:${w}px;height:${h}px;border-radius:6px 14px 14px 6px;background:#E6E0CC"></div>
    <div style="position:absolute;inset:0;border-radius:6px 14px 14px 6px;background:linear-gradient(135deg,#0E5A3A 0%,#083A25 100%);overflow:hidden">
      <div style="position:absolute;left:0;top:0;bottom:0;width:${w * .09}px;background:linear-gradient(90deg,#052A1A,#0A4A30)"></div>
      <div style="position:absolute;left:${w * .15}px;right:${w * .07}px;top:${w * .07}px;bottom:${w * .07}px;border:2px solid ${COR.ouro};border-radius:4px"></div>
      <div style="position:absolute;left:${w * .17}px;right:${w * .09}px;top:${w * .09}px;bottom:${w * .09}px;border:1px solid rgba(201,166,70,.55);border-radius:2px"></div>
      <div style="position:absolute;left:${w * .15}px;right:${w * .07}px;top:${w * .17}px;text-align:center;${I};font-weight:700;font-size:${w * .042}px;letter-spacing:.16em;line-height:1.5;color:${COR.ouroClaro}">CONSTITUIÇÃO DA<br>REPÚBLICA FEDERATIVA<br>DO BRASIL</div>
      <div style="position:absolute;left:50%;top:${h * .47}px;width:${w * .36}px;height:${w * .36}px;margin-left:-${w * .18 - w * .04}px;border-radius:50%;border:2px solid ${COR.ouro};display:flex;align-items:center;justify-content:center">
        <div style="width:${w * .28}px;height:${w * .28}px;border-radius:50%;border:1px solid rgba(201,166,70,.6);display:flex;align-items:center;justify-content:center">
          <svg viewBox="0 0 24 24" width="${w * .15}"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 20.9l1.6-7L2 9.2l7.1-.6z" fill="${COR.ouro}"/></svg></div></div>
      <div style="position:absolute;left:${w * .15}px;right:${w * .07}px;bottom:${w * .15}px;text-align:center;${T};font-size:${w * .13}px;letter-spacing:.06em;color:${COR.ouro}">1988</div>
    </div></div>`;
};
// Pequenos nós ligados (o "mapa") como textura da capa.
const rede = () => {
  const nos = [[620, 120], [760, 70], [880, 160], [700, 250], [960, 300], [1040, 140], [830, 420], [1010, 520], [680, 560], [900, 650], [1080, 700]];
  const arestas = [[0, 1], [1, 2], [0, 3], [2, 4], [2, 5], [3, 6], [4, 6], [4, 7], [6, 8], [6, 9], [7, 10], [9, 10]];
  return `<svg width="${W}" height="${H}" style="position:absolute;inset:0;opacity:.22">${arestas.map(([a, b]) => `<path d="M${nos[a][0]} ${nos[a][1]} Q ${(nos[a][0] + nos[b][0]) / 2 + 30} ${(nos[a][1] + nos[b][1]) / 2 - 30} ${nos[b][0]} ${nos[b][1]}" stroke="#fff" stroke-width="2" fill="none"/>`).join('')}
    ${nos.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 ? 6 : 10}" fill="#fff"/>`).join('')}</svg>`;
};

function capa(m) {
  const c = m.capa || {};
  return `<section class="pagina" style="background:linear-gradient(135deg,#145F40 0%,#1F8A57 50%,#46A877 100%)">
    ${rede()}
    <div style="position:absolute;right:-30px;top:-90px;${F};font-size:760px;line-height:1;color:rgba(255,255,255,.07)">§</div>
    <div style="position:absolute;right:120px;top:150px">${livro(290)}</div>
    <div style="position:absolute;left:70px;top:70px;display:flex;align-items:center;gap:12px">
      <span style="width:38px;height:38px;border-radius:10px;background:rgba(255,255,255,.16);border:1.5px solid rgba(255,255,255,.4);display:flex;align-items:center;justify-content:center;${F};font-size:28px;color:#fff">§</span>
      <span style="${I};font-size:13px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:#fff">${esc(c.marca || 'CF/88 esquematizada')}</span></div>
    <div style="position:absolute;left:70px;top:230px;width:560px">
      <div style="${F};font-size:34px;color:${COR.ouroClaro}">${esc(c.pre || 'Constitucional com Líbero')}</div>
      <div style="${T};font-size:${c.ts || 150}px;line-height:.86;color:#fff;margin-top:10px">${lista(c.titulo || ['Mapas', 'Mentais']).map(l => rico(l, COR.floresta)).join('<br>')}</div>
      ${c.sub ? `<div style="${I};font-size:17px;line-height:1.55;color:#E6F5EC;margin-top:26px;max-width:470px">${rico(c.sub, '#fff')}</div>` : ''}</div>
    <div style="position:absolute;left:70px;bottom:62px;display:flex;align-items:center;gap:14px">
      ${c.volume ? `<span style="${I};font-size:12px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:${COR.floresta};background:${COR.ouroClaro};padding:8px 14px;border-radius:999px">${esc(c.volume)}</span>` : ''}
      <span style="${I};font-size:14px;font-weight:700;color:#fff">${esc(m.perfil || '@liberofilho')}</span></div>
  </section>`;
}

// Página do mapa: cabeçalho fino, centro com o tema e os ramos em duas colunas (metade de cada lado).
function mapa(m, p, n) {
  const ramos = lista(p.ramos).map((r, i) => ({ ...r, cor: r.cor || RAMOS[i % RAMOS.length] }));
  const metade = Math.ceil(ramos.length / 2), esq = ramos.slice(0, metade), dir = ramos.slice(metade);
  const cartao = (r, lado) => `<div class="ramo" data-lado="${lado}" data-cor="${r.cor}" style="position:relative;background:#fff;border:1.5px solid ${r.cor}33;border-${lado === 'e' ? 'right' : 'left'}:5px solid ${r.cor};border-radius:14px;padding:12px 16px 12px;box-shadow:0 6px 18px rgba(15,42,30,.06)">
      <div style="display:flex;align-items:baseline;justify-content:space-between;gap:10px">
        <span style="${T};font-size:${r.ts || 26}px;line-height:1;color:${r.cor}">${esc(r.titulo)}</span>
        ${r.artigo ? `<span style="flex:none;${I};font-size:10.5px;font-weight:800;letter-spacing:.06em;color:#fff;background:${r.cor};padding:3px 8px;border-radius:999px">${esc(r.artigo)}</span>` : ''}</div>
      ${r.resumo ? `<div style="${I};font-size:12px;font-weight:600;line-height:1.4;color:${COR.tinta};margin-top:6px">${rico(r.resumo, r.cor)}</div>` : ''}
      ${lista(r.itens).length ? `<ul style="margin:6px 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:4px">${lista(r.itens).map(it => `<li style="display:flex;gap:7px;${I};font-size:${p.corpo || 11.5}px;line-height:1.38;color:${COR.texto}"><span style="flex:none;width:6px;height:6px;border-radius:50%;background:${r.cor};margin-top:6px"></span><span>${rico(it, r.cor)}</span></li>`).join('')}</ul>` : ''}
      ${r.dica ? `<div style="margin-top:7px;background:${r.cor}14;border-radius:8px;padding:6px 9px;${I};font-size:11px;line-height:1.35;color:${COR.tinta}"><b style="color:${r.cor}">Pegadinha:</b> ${rico(r.dica, r.cor)}</div>` : ''}</div>`;
  const coluna = (rs, lado) => `<div style="width:${p.largura || 340}px;display:flex;flex-direction:column;justify-content:center;gap:${p.gap || 14}px">${rs.map(r => cartao(r, lado)).join('')}</div>`;
  return `<section class="pagina mapa" style="background:#fff">
    <svg class="ligacoes" width="${W}" height="${H}" style="position:absolute;inset:0;z-index:0"></svg>
    <div style="position:absolute;left:44px;right:44px;top:24px;display:flex;justify-content:space-between;align-items:center;z-index:2">
      <div style="display:flex;align-items:center;gap:9px"><span style="width:24px;height:24px;border-radius:7px;background:linear-gradient(135deg,${COR.floresta},${COR.folha});display:flex;align-items:center;justify-content:center;${F};font-size:17px;color:#fff">§</span>
        <span style="${I};font-size:10px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:${COR.cinza}">Constitucional com Líbero · Mapas Mentais</span></div>
      ${p.tema ? `<span style="${I};font-size:10px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:${COR.verde};background:${COR.menta};padding:5px 12px;border-radius:999px">${esc(p.tema)}</span>` : ''}</div>
    <div style="position:absolute;left:36px;right:36px;top:58px;bottom:44px;display:flex;align-items:center;justify-content:space-between;z-index:1">
      ${coluna(esq, 'e')}
      <div class="centro" style="flex:none;width:${p.centroW || 250}px;text-align:center;background:linear-gradient(150deg,${COR.floresta} 0%,${COR.verde} 100%);border-radius:22px;padding:22px 18px;box-shadow:0 14px 30px rgba(11,74,48,.3);position:relative">
        ${p.artigo ? `<div style="${I};font-size:11px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:${COR.ouroClaro}">${esc(p.artigo)}</div>` : ''}
        <div style="${T};font-size:${p.ts || 40}px;line-height:.95;color:#fff;margin-top:6px">${lista(p.titulo).map(l => esc(l)).join('<br>')}</div>
        ${p.sub ? `<div style="${I};font-size:12px;line-height:1.45;color:#DDF1E5;margin-top:10px">${rico(p.sub, '#fff')}</div>` : ''}</div>
      ${coluna(dir, 'd')}</div>
    ${p.rodape ? `<div style="position:absolute;left:44px;right:120px;bottom:16px;${I};font-size:10.5px;line-height:1.35;color:${COR.texto};z-index:2"><b style="color:${COR.verde}">Pra fixar:</b> ${rico(p.rodape, COR.verde)}</div>` : ''}
    <div style="position:absolute;right:44px;bottom:16px;${I};font-size:10px;font-weight:700;color:${COR.cinza};z-index:2">${String(n).padStart(2, '0')}</div>
  </section>`;
}

// Liga cada cartão ao centro com uma curva na cor do ramo (roda no navegador, depois do layout).
const LIGAR = `<script>
function ligar() {
  for (const pg of document.querySelectorAll('.pagina.mapa')) {
    const svg = pg.querySelector('.ligacoes'), base = pg.getBoundingClientRect(), c = pg.querySelector('.centro').getBoundingClientRect();
    let out = '';
    for (const r of pg.querySelectorAll('.ramo')) {
      const b = r.getBoundingClientRect(), esq = r.dataset.lado === 'e', cor = r.dataset.cor;
      const x1 = (esq ? c.left : c.right) - base.left, y1 = c.top + c.height / 2 - base.top;
      const x2 = (esq ? b.right : b.left) - base.left, y2 = b.top + b.height / 2 - base.top, mx = (x1 + x2) / 2;
      out += '<path d="M' + x1 + ' ' + y1 + ' C ' + mx + ' ' + y1 + ', ' + mx + ' ' + y2 + ', ' + x2 + ' ' + y2 + '" stroke="' + cor + '" stroke-width="3" fill="none" stroke-linecap="round" opacity=".85"/>'
        + '<circle cx="' + x2 + '" cy="' + y2 + '" r="5" fill="' + cor + '"/>';
    }
    svg.innerHTML = out;
  }
  window.__avisos = [...document.querySelectorAll('.pagina')].flatMap((pg, i) => {
    const b = pg.getBoundingClientRect();
    return [...pg.querySelectorAll('.ramo,.centro')].some(e => { const r = e.getBoundingClientRect(); return r.top < b.top + 50 || r.bottom > b.bottom - 34; }) ? ['página ' + (i + 1) + ': mapa passa da área'] : [];
  });
  window.__pronto = true;
}
document.fonts.ready.then(() => setTimeout(ligar, 50));
</script>`;

export function renderMapas(m) {
  const pags = [];
  if (m.capa) pags.push(capa(m));
  lista(m.mapas).forEach(p => pags.push(mapa(m, p, pags.length + 1)));
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet">
<style>@page{size:297mm 210mm;margin:0}*{box-sizing:border-box}body{margin:0;background:#888}.pagina{position:relative;width:${W}px;height:${H}px;overflow:hidden}</style></head>
<body>${pags.join('')}${LIGAR}</body></html>`;
}

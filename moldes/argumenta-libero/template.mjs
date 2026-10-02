// Molde "Argumenta com Líbero" (provas discursivas): carrosséis e cards únicos 1080×1350 na identidade do app
// (verde-escuro, menta e branco; cards com borda verde, etapas, balão de fala do logo). Moderno como o Carrossel
// Libero (textura granulada, títulos grandes, marcação **negrito** e [[caixa]]), com diferenças: títulos em
// caixa baixa (Inter Tight) com a 2ª parte em verde ({{assim}}), serifa nos cards e o balão no lugar dos anéis.
// renderCarrossel(c) devolve { html, total, avisos }; o render.mjs fotografa cada slide.

const COR = {
  verde: '#1F3D31', profundo: '#0C261E', medio: '#2F6549', vivo: '#3A8A5C', claro: '#7FC79B',
  menta: '#EEF4F0', mentaForte: '#DCEBE2', borda: '#CFE0D6', tinta: '#16261F', cinza: '#5E6F66',
};
const TEMAS = {
  verde: { bg: `radial-gradient(130% 90% at 100% 0%,${COR.medio} 0%,${COR.verde} 45%,${COR.profundo} 100%)`, tit: '#fff', destaque: COR.claro, txt: '#E3EEE7', kicker: COR.claro, caixaBg: COR.claro, caixaFg: COR.profundo, cartao: 'rgba(255,255,255,.07)', borda: 'rgba(255,255,255,.16)', linha: 'rgba(255,255,255,.18)', balao: 'rgba(127,199,155,.18)', escuro: true },
  menta: { bg: `linear-gradient(170deg,${COR.menta} 0%,#F6FAF7 100%)`, tit: COR.verde, destaque: COR.vivo, txt: COR.tinta, kicker: COR.medio, caixaBg: COR.verde, caixaFg: '#fff', cartao: '#fff', borda: COR.borda, linha: COR.borda, balao: 'rgba(47,101,73,.08)', escuro: false },
  branco: { bg: '#FFFFFF', tit: COR.verde, destaque: COR.vivo, txt: COR.tinta, kicker: COR.medio, caixaBg: COR.verde, caixaFg: '#fff', cartao: COR.menta, borda: COR.borda, linha: COR.borda, balao: 'rgba(47,101,73,.07)', escuro: false },
};
const PERFIL = '@liberofilho';
const TITULO = "font-family:'Inter Tight',sans-serif;font-weight:800;letter-spacing:-.035em";
const SERIFA = "font-family:'Source Serif 4',Georgia,serif;font-weight:700";
const RUIDO = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .35 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
// **negrito**, [[caixa]] (fundo sólido) e {{verde}} (a 2ª parte do título, em verde e peso leve, como no app).
const rico = (s, t) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b style="font-weight:800">$1</b>')
  .replace(/\[\[(.+?)\]\]/g, `<span style="background:${t.caixaBg};color:${t.caixaFg};padding:0 .14em;border-radius:.14em;box-decoration-break:clone;-webkit-box-decoration-break:clone">$1</span>`)
  .replace(/\{\{(.+?)\}\}/g, `<span style="color:${t.destaque};font-weight:500">$1</span>`);
const pad2 = n => String(n).padStart(2, '0');
const limpo = s => String(s).replace(/\[\[|\]\]|\*\*|\{\{|\}\}/g, '');

// Tamanho do título pela maior palavra (Inter Tight 800 ≈ 0,56 em por letra); o render ainda reduz se passar.
function tamanho(linhas, base, largura) {
  const maior = Math.max(...lista(linhas).map(limpo).join(' ').split(/\s+/).map(p => p.length), 1);
  return Math.min(base, Math.floor(largura / (maior * 0.56)));
}
const titulo = (s, t, base, largura, extra = '') => lista(s.titulo).length
  ? `<h1 data-titulo style="${TITULO};margin:0;font-size:${s.ts || tamanho(s.titulo, base, largura)}px;line-height:${lista(s.titulo).some(l => l.includes('[[')) ? 1.08 : .98};color:${t.tit};text-wrap:balance${extra}">${lista(s.titulo).map(l => rico(l, t)).join('<br>')}</h1>` : '';
const kicker = (txt, t) => txt ? `<div style="font-size:26px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:${t.kicker}">${esc(txt)}</div>` : '';
const corpo = (v, t, px = 40) => lista(v).map(p => `<p data-corpo style="margin:0;font-size:${px}px;font-weight:500;line-height:1.36;color:${t.txt};text-wrap:pretty">${rico(p, t)}</p>`).join('');
const pilula = (txt, t) => txt ? `<span style="align-self:flex-start;background:${t.escuro ? 'rgba(127,199,155,.18)' : COR.mentaForte};color:${t.escuro ? COR.claro : COR.medio};border-radius:999px;padding:12px 26px;font-size:26px;font-weight:800;letter-spacing:.06em">${esc(txt)}</span>` : '';

const textura = t => `<div style="position:absolute;inset:0;pointer-events:none;background-image:${RUIDO};opacity:${t.escuro ? .45 : .28};mix-blend-mode:${t.escuro ? 'overlay' : 'multiply'};z-index:20"></div>`;
// Balão de fala do logo, vazado, saindo pelo canto (no lugar dos anéis do Carrossel Libero).
function balaoFundo(s, t) {
  if (!s.balao) return '';
  const baixo = s.balao === 'baixo';
  return `<svg data-anel viewBox="0 0 200 170" style="position:absolute;${baixo ? 'left:-150px;bottom:-60px' : 'right:-140px;top:-70px'};width:560px;transform:rotate(${baixo ? 8 : -10}deg);z-index:1">
    <path d="M30 10h140a20 20 0 0 1 20 20v80a20 20 0 0 1-20 20H80l-40 32v-32H30a20 20 0 0 1-20-20V30a20 20 0 0 1 20-20z" fill="${t.balao}" stroke="${t.escuro ? 'rgba(127,199,155,.45)' : 'rgba(47,101,73,.22)'}" stroke-width="6"/>
    <rect x="45" y="48" width="90" height="12" rx="6" fill="${t.escuro ? 'rgba(127,199,155,.45)' : 'rgba(47,101,73,.2)'}"/><rect x="45" y="76" width="60" height="12" rx="6" fill="${t.escuro ? 'rgba(127,199,155,.45)' : 'rgba(47,101,73,.2)'}"/></svg>`;
}
// Marca no pé: logo (se houver foto "logo.png") ou nome; @ à direita.
function rodape(t, c, capa, pilulas) {
  const pl = pilulas ? `background:${COR.profundo};border-radius:999px;padding:10px 22px;box-shadow:0 8px 20px rgba(6,22,15,.3);` : '';
  const marca = `<span style="${pl}font-size:26px;font-weight:800;letter-spacing:-.01em;color:${t.tit}">Argumenta <span style="font-weight:500;color:${t.destaque}">com Líbero</span></span>`;
  return `<div style="position:absolute;left:90px;right:90px;bottom:62px;display:flex;justify-content:space-between;align-items:center;z-index:6">
    ${marca}<span style="${pl}font-size:24px;font-weight:700;letter-spacing:.06em;color:${capa ? t.tit : t.kicker}">${capa ? 'Arraste →' : PERFIL}</span></div>`;
}
const foto = (c, nome) => (c._fotos || {})[nome] || '';
// Print do app numa janela de navegador (barra com 3 bolinhas e endereço).
function janela(c, nome, extra = '', alt = null) {
  const src = foto(c, nome);
  return `<div data-foto style="background:#fff;border-radius:22px;overflow:hidden;box-shadow:0 30px 70px rgba(6,22,15,.4);border:1px solid ${COR.borda}${extra}">
    <div style="height:46px;background:${COR.menta};display:flex;align-items:center;gap:10px;padding:0 20px;border-bottom:1px solid ${COR.borda}">
      ${['#E0857A', '#E8C26B', '#7FC79B'].map(k => `<span style="width:14px;height:14px;border-radius:50%;background:${k}"></span>`).join('')}
      <span style="margin-left:16px;flex:1;height:24px;border-radius:12px;background:#fff;font-size:15px;line-height:24px;padding-left:14px;color:${COR.cinza}">argumenta · provas discursivas</span>
    </div>
    ${src ? `<img src="${src}" style="display:block;width:100%;${alt ? `height:${alt}px;object-fit:cover;object-position:top` : ''}">` : `<div style="height:${alt || 400}px;display:flex;align-items:center;justify-content:center;color:${COR.cinza};font-size:26px">print em fotos/${esc(nome)}</div>`}
  </div>`;
}
const area = (html, extra = '', topo = 140, base = 170) => `<div data-area style="position:absolute;left:90px;right:90px;top:${topo}px;bottom:${base}px;display:flex;flex-direction:column;justify-content:center;gap:30px;z-index:3${extra}">${html}</div>`;
// Card do app: rótulo pequeno, ícone, título em serifa, texto e seta; "ativo" com fundo menta e borda verde.
const card = (k, t, i, justo) => `<div style="display:flex;gap:26px;align-items:center;${justo ? 'padding:16px 26px !important;' : ''}background:${k.ativo ? (t.escuro ? 'rgba(127,199,155,.16)' : COR.menta) : t.cartao};border:2px solid ${k.ativo ? (t.escuro ? COR.claro : COR.vivo) : t.borda};border-radius:26px;padding:26px 30px">
    <span style="flex:none;width:84px;height:84px;border-radius:22px;background:${t.escuro ? 'rgba(255,255,255,.1)' : COR.mentaForte};display:flex;align-items:center;justify-content:center;font-size:44px;${k.icone ? '' : `${TITULO};color:${t.tit}`}">${k.icone ? esc(k.icone) : pad2(i + 1)}</span>
    <div style="flex:1;display:flex;flex-direction:column;gap:4px">
      ${k.rotulo ? `<span style="font-size:.5em;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:${t.kicker}">${esc(k.rotulo)}</span>` : ''}
      <span style="${SERIFA};font-size:1em;line-height:1.12;color:${t.tit}">${rico(k.titulo, t)}</span>
      ${k.texto ? `<span style="font-size:.66em;font-weight:500;line-height:1.32;color:${t.escuro ? t.txt : COR.cinza}">${rico(k.texto, t)}</span>` : ''}
    </div>${k.seta === false ? '' : `<span style="flex:none;font-size:.9em;color:${t.kicker}">→</span>`}</div>`;
// Resposta citada (bloco do app: barra verde à esquerda, fundo menta), com selo ✓ / ✗ opcional.
const resposta = (r, t) => {
  const ok = r.status === 'certo', ruim = r.status === 'errado';
  const cor = ok ? COR.vivo : ruim ? '#C0563F' : COR.medio;
  return `<div style="position:relative;background:${t.escuro ? 'rgba(255,255,255,.08)' : COR.menta};border-left:10px solid ${cor};border-radius:0 22px 22px 0;padding:30px 34px">
    ${r.rotulo ? `<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;font-size:22px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:${t.escuro ? COR.claro : cor}">${ok ? '✓ ' : ruim ? '✗ ' : ''}${esc(r.rotulo)}</div>` : ''}
    <div data-corpo style="${SERIFA};font-weight:600;font-size:${r.px || 38}px;line-height:1.32;color:${t.tit}">“${rico(r.texto, t)}”</div>
  </div>`;
};

const TIPOS = {
  // Capa: título grande em 2 tons, texto, pílula; opcional "print" (janela do app saindo pela base) ou "logo".
  capa(s, t, c) {
    const comPrint = !!s.print;
    const logo = s.logo && foto(c, 'logo.png') ? `<div data-foto style="position:absolute;right:80px;top:90px;width:250px;height:250px;border-radius:40px;background:#fff;overflow:hidden;box-shadow:0 20px 50px rgba(6,22,15,.35);transform:rotate(4deg);z-index:4"><img src="${foto(c, 'logo.png')}" style="width:100%;height:100%;object-fit:cover"></div>` : '';
    const prt = comPrint ? `<div style="position:absolute;left:150px;right:-60px;top:${s.printY ?? 820}px;transform:rotate(-4deg);z-index:2">${janela(c, s.print, '', 620)}</div>` : '';
    return `${logo}${prt}${area(`${kicker(s.kicker, t)}${titulo(s, t, 150, 900)}${s.texto ? corpo(s.texto, t, 40) : ''}${pilula(s.pilula, t)}`,
      comPrint ? ';justify-content:flex-start' : '', s.logo ? 380 : 150, comPrint ? 1350 - (s.printY ?? 820) + 40 : 170)}${rodape(t, c, !s.unico, comPrint)}`;
  },
  // Texto corrido com título.
  texto(s, t) {
    return area(`${kicker(s.kicker, t)}${titulo(s, t, 110, 900)}<span style="display:block;width:100px;height:10px;border-radius:5px;background:${t.destaque}"></span>${corpo(s.texto, t, s.corpo || 42)}${pilula(s.pilula, t)}`);
  },
  // Cards do app (blocos, treinos, passos): "cards" [{icone?, rotulo, titulo, texto, ativo}].
  cards(s, t) {
    return area(`${kicker(s.kicker, t)}${titulo(s, t, 100, 900)}${s.texto ? corpo(s.texto, t, 34) : ''}<div style="display:flex;flex-direction:column;gap:18px;font-size:${s.corpo || 40}px">${lista(s.cards).map((k, i) => card(k, t, i, lista(s.cards).length > 4)).join('')}</div>`);
  },
  // As 5 etapas do método em abas (como no topo do app), com a "atual" destacada e a explicação dela.
  etapas(s, t) {
    const et = lista(s.etapas), at = (s.atual ?? 1) - 1;
    const abas = et.map((e, i) => `<div style="display:flex;align-items:center;gap:22px;padding:22px 28px;border-radius:20px;border:2px solid ${i === at ? (t.escuro ? COR.claro : COR.verde) : t.borda};background:${i === at ? (t.escuro ? COR.claro : COR.verde) : t.cartao};color:${i === at ? (t.escuro ? COR.profundo : '#fff') : t.tit}">
        <span style="${TITULO};font-size:46px;width:50px">${i + 1}</span>
        <div style="display:flex;flex-direction:column;gap:2px"><span style="font-size:36px;font-weight:800;line-height:1.1">${esc(e.nome)}</span>${e.texto ? `<span data-corpo style="font-size:26px;font-weight:500;line-height:1.3;opacity:${i === at ? .9 : .75}">${rico(e.texto, t)}</span>` : ''}</div></div>`).join('');
    return area(`${kicker(s.kicker, t)}${titulo(s, t, 100, 900)}<div style="display:flex;flex-direction:column;gap:14px">${abas}</div>`);
  },
  // Resposta(s) citada(s): uma (com comentário) ou duas para comparar (errada x certa).
  resposta(s, t) {
    return area(`${kicker(s.kicker, t)}${titulo(s, t, 96, 900)}${s.pergunta ? `<div data-corpo style="font-size:32px;font-weight:600;line-height:1.35;color:${t.txt};opacity:.85">${rico(s.pergunta, t)}</div>` : ''}
      <div style="display:flex;flex-direction:column;gap:22px">${lista(s.respostas).map(r => resposta(r, t)).join('')}</div>${s.texto ? corpo(s.texto, t, 34) : ''}`);
  },
  // Checklist com caixinhas (marcadas com "✓ " no início do item).
  checklist(s, t) {
    const itens = lista(s.itens).map(it => {
      const ok = it.startsWith('✓ '), txt = ok ? it.slice(2) : it;
      return `<div style="display:flex;gap:24px;align-items:center;background:${t.cartao};border:2px solid ${t.borda};border-radius:20px;padding:22px 26px">
        <span style="flex:none;width:44px;height:44px;border-radius:10px;border:3px solid ${ok ? COR.vivo : t.escuro ? 'rgba(255,255,255,.4)' : '#9DB5A7'};background:${ok ? COR.vivo : 'transparent'};color:#fff;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800">${ok ? '✓' : ''}</span>
        <span data-corpo style="font-size:${s.corpo || 36}px;font-weight:600;line-height:1.28;color:${t.tit}">${rico(txt, t)}</span></div>`;
    }).join('');
    return area(`${kicker(s.kicker, t)}${titulo(s, t, 100, 900)}<div style="display:flex;flex-direction:column;gap:14px">${itens}</div>`);
  },
  // Print grande do app numa janela, com título em cima e legenda embaixo.
  print(s, t, c) {
    return area(`${kicker(s.kicker, t)}${titulo(s, t, 96, 900)}<div style="transform:rotate(${s.giro ?? -1.5}deg)">${janela(c, s.print, '', s.alturaPrint || 560)}</div>${s.texto ? corpo(s.texto, t, 34) : ''}`, '', 120, 160);
  },
  // Número grande + frase (impacto).
  numero(s, t) {
    return area(`${kicker(s.kicker, t)}<div style="${TITULO};font-size:${s.tn || 300}px;line-height:.85;color:${t.destaque}">${esc(s.numero)}</div>${titulo(s, t, 96, 900)}${s.texto ? corpo(s.texto, t, 38) : ''}`);
  },
  // Card único de quiz: pergunta, resposta citada e alternativas em cards; "gabarito" opcional no pé.
  quiz(s, t) {
    const alts = lista(s.alternativas).map((a, i) => `<div style="display:flex;gap:20px;align-items:center;background:${t.cartao};border:2px solid ${t.borda};border-radius:20px;padding:18px 24px">
      <span style="flex:none;width:52px;height:52px;border-radius:14px;background:${t.escuro ? 'rgba(255,255,255,.12)' : COR.mentaForte};color:${t.tit};display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800">${'ABCD'[i]}</span>
      <span data-corpo style="font-size:32px;font-weight:600;line-height:1.25;color:${t.tit}">${rico(a, t)}</span></div>`).join('');
    return `${area(`<div style="display:flex;justify-content:space-between;align-items:center">${kicker(s.kicker, t)}${s.xp ? `<span style="background:${t.escuro ? 'rgba(127,199,155,.2)' : COR.mentaForte};color:${t.escuro ? COR.claro : COR.medio};border-radius:999px;padding:10px 22px;font-size:24px;font-weight:800">${esc(s.xp)}</span>` : ''}</div>
      ${titulo(s, t, 84, 900, `;${SERIFA};letter-spacing:-.01em`)}
      ${lista(s.respostas).map(r => resposta(r, t)).join('')}
      <div style="display:flex;flex-direction:column;gap:12px">${alts}</div>
      ${s.chamada ? `<div style="align-self:flex-start;background:${t.escuro ? COR.claro : COR.verde};color:${t.escuro ? COR.profundo : '#fff'};border-radius:40px 40px 40px 0;padding:18px 32px;font-size:30px;font-weight:800">${rico(s.chamada, t)}</div>` : ''}`, ';gap:26px', 110, 150)}`;
  },
  cta(s, t, c) {
    const logo = s.logo && foto(c, 'logo.png') ? `<div data-foto style="width:280px;height:280px;border-radius:44px;background:#fff;overflow:hidden;box-shadow:0 24px 50px rgba(6,22,15,.35);transform:rotate(-3deg)"><img src="${foto(c, 'logo.png')}" style="width:100%;height:100%;object-fit:cover"></div>` : '';
    return area(`${logo}${kicker(s.kicker, t)}${titulo(s, t, 120, 900)}${corpo(s.texto, t, s.corpo || 40)}
      ${s.botao ? `<span style="align-self:flex-start;background:${t.escuro ? COR.claro : COR.verde};color:${t.escuro ? COR.profundo : '#fff'};border-radius:44px 44px 44px 0;padding:22px 40px;font-size:36px;font-weight:800">${rico(s.botao, t)}</span>` : ''}`);
  },
};

export function renderCarrossel(c) {
  const slides = lista(c.slides);
  const n = slides.length;
  const avisos = [];
  slides.forEach((s, i) => {
    if (i >= 2 && s.tema === slides[i - 1].tema && s.tema === slides[i - 2].tema) avisos.push(`slides ${i - 1} a ${i + 1}: três fundos "${s.tema}" seguidos`);
    if (!TEMAS[s.tema]) avisos.push(`slide ${i + 1}: tema "${s.tema}" não existe (use ${Object.keys(TEMAS).join(', ')})`);
    if (!TIPOS[s.tipo]) avisos.push(`slide ${i + 1}: tipo "${s.tipo}" não existe (${Object.keys(TIPOS).join(', ')})`);
  });
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;700;800&family=Inter:wght@500;600;700;800&family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box}body{margin:0;font-family:'Inter','Noto Color Emoji',sans-serif;-webkit-font-smoothing:antialiased}</style></head><body>
<div id="painel" style="position:relative;width:${n * 1080}px;height:1350px">
${slides.map((s, i) => {
    const t = TEMAS[s.tema] || TEMAS.verde;
    const html = (TIPOS[s.tipo] || TIPOS.texto)(s, t, c);
    return `<div id="slide-${i + 1}" style="position:absolute;left:${i * 1080}px;top:0;width:1080px;height:1350px;overflow:hidden;background:${t.bg}">
  ${balaoFundo(s, t)}${html}${s.tipo === 'capa' ? '' : rodape(t, c, false)}${textura(t)}</div>`;
  }).join('\n')}
</div></body></html>`;
  return { html, total: n, avisos };
}

// Molde "Carrossel Infinito": 5 a 7 slides 1080x1350 numa faixa contínua (n x 1080 de largura),
// ligados por um trilho com nós nas divisões e por figuras/fotos que atravessam a divisão entre slides.
// renderCarrossel(c) devolve { html, total }; o render.mjs fotografa a faixa e recorta de 1080 em 1080.

const TEMAS = {
  dark:  { bg: '#0b2619', title: '#e8eeee', fg: '#b9cbc3', strong: '#e8eeee', accent: '#5fbf8e', num: '#5fbf8e', cardBg: '#143a29', cardFg: '#e8eeee', cardAccent: '#5fbf8e', border: '#5fbf8e', counter: '#5fbf8e', hlBg: '#5fbf8e', hlFg: '#0b2619', pillBg: '#5fbf8e', pillFg: '#0b2619' },
  light: { bg: '#e8eeee', title: '#0b2619', fg: '#1f3a2e', strong: '#0b2619', accent: '#2f8a5e', num: '#5fbf8e', cardBg: '#0b2619', cardFg: '#e8eeee', cardAccent: '#5fbf8e', border: '#5fbf8e', counter: '#2f8a5e', hlBg: '#5fbf8e', hlFg: '#0b2619', pillBg: '#5fbf8e', pillFg: '#0b2619' },
  mint:  { bg: '#5fbf8e', title: '#f4f8f6', fg: '#0b2619', strong: '#0b2619', accent: '#0b2619', num: '#0b2619', cardBg: '#0b2619', cardFg: '#e8eeee', cardAccent: '#5fbf8e', border: '#0b2619', counter: '#0b2619', hlBg: '#0b2619', hlFg: '#f4f8f6', pillBg: '#0b2619', pillFg: '#e8eeee' },
};
const ORDEM = ['dark', 'light', 'mint'];
const VERDE = '#2f8a5e';
const W = 1080, H = 1350;
const PAD = 96, PAD_LIGACAO = 300;
const TOPOS = [420, 640, 360, 700]; // y do topo da figura/foto, em rodízio pelas divisões
const FIGURAS = {
  ring: { w: 380, h: 380, css: `border:18px solid ${VERDE};border-radius:50%` },
  diamond: { w: 260, h: 260, css: `border:16px solid ${VERDE};border-radius:24px` },
  bar: { w: 560, h: 30, css: `background:${VERDE};border-radius:15px` },
  disc: { w: 300, h: 300, css: `background:${VERDE};border-radius:50%` },
};
const TS_BASE = { cover: 160, text: 120, item: 110, list: 100, mnemo: 150, compare: 100, cta: 112 };

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Texto: **negrito**, ==destaque== e quebra de linha com \n.
const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/==(.+?)==/g, '<mark>$1</mark>').replace(/\n/g, '<br>');
const pad2 = n => String(n).padStart(2, '0');

// Tamanho do título: nenhuma palavra pode passar da coluna.
function tamanho(texto, base, coluna, fator = 0.46) {
  const maior = Math.max(...String(texto).replace(/\*\*|==/g, '').split(/\s+/).map(p => p.length), 1);
  return Math.min(base, Math.floor(coluna / (maior * fator)));
}

const selo = t => `<div class="selo" style="background:${t.pillBg};color:${t.pillFg}"><b>@CONSTITUCIONAL</b>GABARITADO</div>`;
const kicker = (txt, t, traco) => txt ? `<div class="kicker" style="color:${t.accent}">${traco ? `<i style="background:${t.accent}"></i>` : ''}${md(txt)}</div>` : '';
const titulo = (s, t, ts, col, extra = '') => `<h1 data-titulo style="color:${t.title};font-size:${tamanho(s.title, s.ts || ts, col)}px${extra}">${md(s.title)}</h1>`;

const TIPOS = {
  cover(s, t, col) {
    const centro = s.align === 'center';
    return `<div class="bloco" style="align-items:${centro ? 'center' : 'flex-start'};text-align:${centro ? 'center' : 'left'}">
      ${kicker(s.kicker, t, true)}
      ${s.pre ? `<div class="pre" style="color:${t.fg}">${md(s.pre)}</div>` : ''}
      ${titulo(s, t, TS_BASE.cover, col, ';line-height:.94')}
      ${s.hl ? `<div class="hl" style="background:${t.hlBg};color:${t.hlFg};font-size:${tamanho(s.hl, 56, col - 40)}px">${md(s.hl)}</div>` : ''}
      ${s.sub ? `<p class="sub" style="color:${t.fg}">${md(s.sub)}</p>` : ''}
    </div>`;
  },
  text(s, t, col) {
    return `${kicker(s.kicker, t)}${titulo(s, t, TS_BASE.text, col)}
      <p class="corpo" style="color:${t.fg}">${s.lead ? `<b style="color:${t.strong}">${md(s.lead)}</b> ` : ''}${md(s.body)}</p>
      ${s.box ? `<div class="caixa" style="border:2px solid ${t.border};color:${t.fg}">${md(s.box)}</div>` : ''}`;
  },
  item(s, t, col) {
    return `<div class="cab"><span class="num" style="color:${t.num}">${esc(s.num)}</span>${s.ref ? `<span class="kicker" style="color:${t.accent}">${md(s.ref)}</span>` : ''}</div>
      ${titulo(s, t, TS_BASE.item, col)}
      <div class="linhas">${(s.rows || []).map(r => `<b style="color:${t.accent}">${md(r.k)}</b><span style="color:${t.fg}">${md(r.v)}</span>`).join('')}</div>
      ${s.tip ? `<div class="caixa cheia" style="background:${t.cardBg};color:${t.cardFg}"><b style="color:${t.cardAccent}">Pegadinha:</b> ${md(s.tip)}</div>` : ''}`;
  },
  list(s, t, col) {
    return `${kicker(s.kicker, t)}${titulo(s, t, TS_BASE.list, col)}
      <div class="lista">${(s.items || []).map(i => `<div class="cartao" style="background:${t.cardBg};color:${t.cardFg}"><span style="color:${t.cardAccent}">${esc(i.n)}</span><p>${md(i.t)}</p></div>`).join('')}</div>`;
  },
  mnemo(s, t, col) {
    const ts = tamanho(s.word, s.ts || TS_BASE.mnemo, col - 48, 0.52);
    return `${kicker(s.kicker, t)}
      <div class="hl palavra" data-titulo style="background:${t.hlBg};color:${t.hlFg};font-size:${ts}px">${md(s.word)}</div>
      <div class="letras" style="grid-template-columns:${s.cols || '1fr'}">${(s.rows || []).map(r => `<div><span style="color:${t.accent}">${esc(r.l)}</span><p style="color:${t.fg}">${md(r.t)}</p></div>`).join('')}</div>`;
  },
  compare(s, t, col) {
    const cartao = (c, cheio) => `<div class="caixa comp${cheio ? ' cheia' : ''}" style="${cheio ? `background:${t.cardBg};color:${t.cardFg}` : `border:2px solid ${t.border};color:${t.fg}`}">
      <h2 style="color:${cheio ? t.cardAccent : t.title}">${md(c.title)}</h2>
      <ul>${(c.items || []).map(i => `<li><i style="background:${cheio ? t.cardAccent : t.accent}"></i>${md(i)}</li>`).join('')}</ul></div>`;
    return `${kicker(s.kicker, t)}${titulo(s, t, TS_BASE.compare, col)}${(s.cols || []).map((c, k) => cartao(c, k === 1)).join('')}`;
  },
  cta(s, t, col) {
    return `<div class="bloco" style="align-items:center;text-align:center">
      ${s.summary ? `<div class="kicker" style="color:${t.accent}">Resumo de bolso</div>
      <div class="resumo">${s.summary.map(r => `<b style="color:${t.accent}">${md(r.k)}</b><span style="color:${t.fg}">${md(r.v)}</span>`).join('')}</div>` : ''}
      ${titulo(s, t, TS_BASE.cta, col)}
      ${s.body ? `<p class="corpo" style="color:${t.fg}">${md(s.body)}</p>` : ''}
    </div>`;
  },
};

// Temas: usa o "bg" de cada slide ou alterna dark/light/mint; dois iguais seguidos viram aviso.
function temas(slides) {
  const out = [];
  slides.forEach((s, i) => {
    let bg = s.bg;
    if (!bg) bg = ORDEM.find(o => o !== out[i - 1] && o !== (slides[i + 1] || {}).bg) || 'dark';
    out.push(bg);
  });
  return out;
}

export function renderCarrossel(c) {
  const slides = c.slides;
  const n = slides.length;
  const seams = c.seams || [];
  const bgs = temas(slides);
  const avisos = [];
  bgs.forEach((b, i) => { if (!TEMAS[b]) avisos.push(`slide ${i + 1}: tema "${b}" não existe`); if (i && b === bgs[i - 1]) avisos.push(`slides ${i} e ${i + 1} com o mesmo tema (${b})`); });
  if (n < 5 || n > 7) avisos.push(`o carrossel tem ${n} slides (o molde pede de 5 a 7)`);

  const secoes = slides.map((s, i) => {
    const t = TEMAS[bgs[i]] || TEMAS.dark;
    const pl = seams.includes(i) ? PAD_LIGACAO : PAD;      // divisão à esquerda (entre o slide i e o i+1, contando de 1)
    const pr = seams.includes(i + 1) ? PAD_LIGACAO : PAD;  // divisão à direita
    const col = W - pl - pr;
    const corpo = (TIPOS[s.type] || TIPOS.text)(s, t, col);
    return `<section id="slide-${i + 1}" style="background:${t.bg}">
      <div class="contador" style="color:${t.counter}">${pad2(i + 1)}/${pad2(n)}</div>
      <div class="conteudo tipo-${s.type}" data-conteudo style="left:${pl}px;right:${pr}px">${corpo}</div>
      ${s.type === 'cover' || s.type === 'cta' ? selo(t) : ''}
    </section>`;
  }).join('');

  // Ligação: figura ou foto centrada em cada divisão escolhida.
  const ligacoes = seams.map((seam, k) => {
    const cx = seam * W;
    if (c.link === 'photo') {
      const w = 430, h = 380, top = TOPOS[k % TOPOS.length];
      const rot = k % 2 ? -5 : 5;
      const arq = (c.fotos || [])[k];
      const sug = (c.ph || [])[k] || 'imagem ligada ao tema';
      const recorte = arq && /\.png$/i.test(arq);
      const dentro = arq
        ? `<img src="../imagens/${esc(arq)}" style="width:100%;height:100%;object-fit:${recorte ? 'contain' : 'cover'};border-radius:${recorte ? 0 : 24}px">`
        : `<div class="ph"><b>IMAGEM</b>${esc(sug)}</div>`;
      const sombra = recorte ? 'filter:drop-shadow(0 30px 40px rgba(0,0,0,.3))' : 'box-shadow:0 30px 60px rgba(0,0,0,.3)';
      return `<div class="lig foto${arq ? '' : ' vazia'}" data-ligacao style="left:${cx - w / 2}px;top:${top}px;width:${w}px;height:${h}px;transform:rotate(${rot}deg);${arq && !recorte ? sombra : ''}${recorte ? sombra : ''}">${dentro}</div>`;
    }
    const f = FIGURAS[c.shape] || FIGURAS.ring;
    const top = TOPOS[k % TOPOS.length] + 60;
    const rot = c.shape === 'bar' ? (k % 2 ? 28 : -28) : c.shape === 'diamond' ? 45 : 0;
    return `<div class="lig" data-ligacao style="left:${cx - f.w / 2}px;top:${top}px;width:${f.w}px;height:${f.h}px;${f.css};transform:rotate(${rot}deg)"></div>`;
  }).join('');

  const tracejado = c.rail === 'dashed';
  const trilho = `<div class="trilho" style="left:96px;width:${n * W - 192}px;${tracejado ? `border-top:3px dashed ${VERDE}` : `background:${VERDE};height:3px`}"></div>`
    + Array.from({ length: n - 1 }, (_, i) => `<div class="no" style="left:${(i + 1) * W - 15}px"></div>`).join('')
    + `<div class="seta" style="left:${n * W - 120}px"></div>`;

  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Antonio:wght@700&family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:${n * W}px;height:${H}px;overflow:hidden;font-family:Poppins,sans-serif;-webkit-font-smoothing:antialiased}
.faixa{position:relative;display:flex;width:${n * W}px;height:${H}px}
section{position:relative;flex:none;width:${W}px;height:${H}px;overflow:hidden}
.contador{position:absolute;top:100px;right:96px;font:600 22px Poppins;letter-spacing:2px;z-index:3}
.conteudo{position:absolute;top:150px;bottom:170px;display:flex;flex-direction:column;justify-content:center;gap:28px;z-index:3}
.bloco{display:flex;flex-direction:column;gap:28px}
.selo{position:absolute;bottom:96px;left:50%;transform:translateX(-50%);padding:8px 18px;border-radius:8px;font:400 24px Poppins;white-space:nowrap;z-index:3}
.selo b{font-weight:700}
.kicker{display:flex;align-items:center;gap:16px;font:600 24px Poppins;letter-spacing:4px;text-transform:uppercase}
.kicker i{display:block;width:48px;height:3px;flex:none}
h1,.num,.hl,.cartao span,.letras span,h2{font-family:Antonio,sans-serif;font-weight:700;text-transform:uppercase;line-height:.96}
h1{overflow-wrap:normal}
.pre{font:300 44px Poppins;line-height:1.2}
.hl{display:inline-block;padding:10px 20px 8px;line-height:1}
.sub{font-size:34px;line-height:1.4;max-width:640px;text-wrap:pretty}
.corpo{font-size:35px;line-height:1.45;text-wrap:pretty}
.corpo b{font-weight:700}
mark{background:none;color:inherit;font-weight:700}
.caixa{padding:28px 32px;border-radius:20px;font-size:31px;line-height:1.45;text-wrap:pretty}
.cab{display:flex;align-items:baseline;gap:28px}
.num{font-size:180px;line-height:.8}
.linhas{display:grid;grid-template-columns:190px 1fr;gap:18px 24px;font-size:32px;line-height:1.35}
.linhas b{font-weight:600}
.lista{display:flex;flex-direction:column;gap:16px}
.cartao{display:flex;align-items:center;gap:28px;padding:16px 30px;border-radius:20px}
.cartao span{font-size:84px;line-height:.9;flex:none;min-width:56px}
.cartao p{font-size:31px;line-height:1.35;text-wrap:pretty}
.palavra{align-self:flex-start;padding:14px 24px 10px}
.letras{display:grid;gap:22px 36px}
.letras div{display:flex;align-items:baseline;gap:22px}
.letras span{font-size:60px;flex:none;min-width:48px}
.letras p{font-size:31px;line-height:1.35}
.comp h2{font-size:52px;margin-bottom:14px}
.comp ul{list-style:none;display:flex;flex-direction:column;gap:10px}
.comp li{display:flex;gap:18px;align-items:baseline;font-size:30px;line-height:1.35}
.comp li i{flex:none;width:12px;height:12px;border-radius:50%;transform:translateY(-4px)}
.resumo{display:grid;grid-template-columns:auto auto;gap:12px 28px;text-align:left;font-size:30px;line-height:1.3}
.resumo b{font-family:Antonio,sans-serif;text-transform:uppercase;font-size:36px}
.lig{position:absolute;z-index:2;pointer-events:none}
.foto{border-radius:24px}
.foto.vazia{border:4px dashed ${VERDE};background:rgba(232,238,238,.85)}
.ph{height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:30px;text-align:center;font:400 28px Poppins;color:#1f3a2e}
.ph b{font:600 20px Poppins;letter-spacing:4px;color:${VERDE}}
.trilho{position:absolute;top:1296px;z-index:2}
.no{position:absolute;top:1283px;width:30px;height:30px;border-radius:50%;background:#e8eeee;border:3px solid ${VERDE};z-index:3}
.seta{position:absolute;top:1285.5px;width:0;height:0;border-left:24px solid ${VERDE};border-top:12px solid transparent;border-bottom:12px solid transparent;z-index:3}
</style></head><body><div class="faixa">${secoes}${ligacoes}${trilho}</div></body></html>`;
  return { html, total: n, avisos };
}

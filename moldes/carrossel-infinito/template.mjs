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
// Ícones de traço (viewBox 100) para as ligações "icones" e para a capa: cada um ligado ao assunto do carrossel.
const ICONES = {
  escudo: '<path d="M50 10 L82 22 V48 C82 70 67 84 50 90 C33 84 18 70 18 48 V22 Z"/><path d="M36 50 L46 60 L65 40"/>',
  balanca: '<path d="M50 14 V84 M30 84 H70 M20 28 H80"/><path d="M50 14 L46 22 H54 Z"/><path d="M20 28 L10 52 H30 Z M80 28 L70 52 H90 Z"/>',
  martelo: '<path d="M30 20 L58 48 M44 6 L72 34"/><path d="M37 13 L65 41"/><path d="M51 41 L22 70"/><path d="M14 90 H62 M20 82 H56"/>',
  livro: '<path d="M50 24 C40 16 26 16 14 20 V80 C26 76 40 76 50 84 C60 76 74 76 86 80 V20 C74 16 60 16 50 24 Z"/><path d="M50 24 V84"/>',
  lupa: '<circle cx="42" cy="42" r="26"/><path d="M61 61 L86 86"/><path d="M30 38 C32 31 37 27 44 26"/>',
  marcador: '<path d="M62 12 L86 36 L50 72 L26 48 Z"/><path d="M26 48 L18 66 L32 80 L50 72"/><path d="M14 90 H52"/>',
  clipe: '<path d="M64 30 V68 C64 80 56 88 46 88 C36 88 28 80 28 68 V24 C28 16 34 10 42 10 C50 10 56 16 56 24 V64 C56 70 52 74 46 74 C40 74 36 70 36 64 V30"/>',
  passaporte: '<rect x="22" y="10" width="56" height="80" rx="6"/><circle cx="50" cy="44" r="14"/><path d="M36 44 H64 M50 30 C44 38 44 50 50 58 C56 50 56 38 50 30"/><path d="M38 74 H62"/>',
  urna: '<path d="M16 46 H84 V86 H16 Z"/><path d="M38 60 H62"/><path d="M32 46 V14 H68 V46"/><path d="M42 26 H58 M42 36 H58"/>',
  coluna: '<path d="M10 32 L50 12 L90 32 Z"/><path d="M14 86 H86 M18 78 H82"/><path d="M24 40 V72 M41 40 V72 M59 40 V72 M76 40 V72"/>',
  grafico: '<path d="M12 86 H88"/><path d="M20 86 V58 H34 V86 M43 86 V36 H57 V86 M66 86 V16 H80 V86"/>',
  alvo: '<circle cx="46" cy="54" r="34"/><circle cx="46" cy="54" r="20"/><circle cx="46" cy="54" r="5"/><path d="M46 54 L84 16 M72 16 H84 V28"/>',
  lampada: '<path d="M36 64 C24 56 20 44 22 34 C26 18 40 10 50 10 C60 10 74 18 78 34 C80 44 76 56 64 64 V74 H36 Z"/><path d="M38 84 H62 M42 92 H58"/><path d="M50 74 V50 L42 42 M50 50 L58 42"/>',
  relogio: '<circle cx="50" cy="54" r="34"/><path d="M50 32 V54 L64 64"/><path d="M40 10 H60 M50 10 V20"/>',
  check: '<rect x="18" y="12" width="64" height="78" rx="8"/><path d="M38 12 V6 H62 V12"/><path d="M30 38 L36 44 L46 32 M54 40 H70 M30 64 L36 70 L46 58 M54 66 H70"/>',
  ponte: '<path d="M8 70 H92"/><path d="M14 70 C24 40 76 40 86 70"/><path d="M30 52 V70 M50 46 V70 M70 52 V70"/><path d="M8 82 C18 78 26 86 36 82 C46 78 54 86 64 82 C74 78 82 86 92 82"/>',
  balao: '<path d="M14 18 H86 V66 H44 L26 84 V66 H14 Z"/><path d="M28 34 H72 M28 48 H58"/>',
  lapis: '<path d="M68 10 L90 32 L36 86 L12 90 L16 66 Z"/><path d="M58 20 L80 42 M16 66 L36 86"/>',
  erro: '<circle cx="50" cy="50" r="38"/><path d="M34 34 L66 66 M66 34 L34 66"/>',
  documento: '<path d="M22 8 H62 L80 26 V92 H22 Z"/><path d="M62 8 V26 H80"/><path d="M34 44 H68 M34 58 H68 M34 72 H56"/>',
  pessoas: '<circle cx="34" cy="34" r="12"/><circle cx="68" cy="30" r="10"/><path d="M12 82 C12 62 22 54 34 54 C46 54 56 62 56 82 Z"/><path d="M56 54 C60 50 64 48 68 48 C80 48 88 56 88 76 H60"/>',
  alerta: '<path d="M50 10 L92 86 H8 Z"/><path d="M50 38 V60"/><circle cx="50" cy="72" r="3"/>',
  bandeira: '<path d="M20 92 V10"/><path d="M20 14 H80 L68 32 L80 50 H20"/>',
  casa: '<path d="M12 48 L50 16 L88 48"/><path d="M22 40 V86 H78 V40"/><path d="M42 86 V62 H58 V86"/>',
  trofeu: '<path d="M30 12 H70 V36 C70 50 60 58 50 58 C40 58 30 50 30 36 Z"/><path d="M30 20 H14 C14 34 22 40 30 40 M70 20 H86 C86 34 78 40 70 40"/><path d="M50 58 V74 M34 88 H66 L62 74 H38 Z"/>',
  filtro: '<path d="M10 14 H90 L60 50 V80 L40 90 V50 Z"/>',
  chave: '<circle cx="30" cy="50" r="18"/><circle cx="30" cy="50" r="6"/><path d="M48 50 H90 M78 50 V64 M66 50 V60"/>',
  camadas: '<path d="M50 12 L90 32 L50 52 L10 32 Z"/><path d="M10 50 L50 70 L90 50"/><path d="M10 68 L50 88 L90 68"/>',
};
const icone = (nome, px, cor, traco = 6) => ICONES[nome] ? `<svg viewBox="0 0 100 100" width="${px}" height="${px}" fill="none" stroke="${cor}" stroke-width="${traco}" stroke-linecap="round" stroke-linejoin="round">${ICONES[nome]}</svg>` : '';
const TS_BASE = { cover: 190, text: 120, item: 110, list: 100, mnemo: 150, compare: 100, cta: 112, vitrine: 100 };

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
  // Capa: só título e subtítulo (kicker, pre e hl ficam de fora, a pedido). O ícone do tema entra grande e
  // vazado no fundo, saindo pelo canto (campo "icone" do carrossel).
  cover(s, t, col) {
    const centro = s.align === 'center';
    return `<div class="bloco" style="align-items:${centro ? 'center' : 'flex-start'};text-align:${centro ? 'center' : 'left'};gap:36px">
      <i class="tracinho" style="background:${t.accent}"></i>
      ${titulo(s, t, TS_BASE.cover, col, ';line-height:.98')}
      ${s.sub ? `<p class="sub" style="color:${t.fg};font-size:38px">${md(s.sub)}</p>` : ''}
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
  // Vitrine: kicker, título e uma imagem grande (imagens/, fora do git) ocupando a coluna, com legenda opcional.
  vitrine(s, t, col) {
    return `${kicker(s.kicker, t)}${titulo(s, t, TS_BASE.vitrine, col)}
      <div class="vit" style="margin:0 ${-(s.sangra || 0)}px"><img src="../imagens/${esc(s.img)}"></div>
      ${s.legenda ? `<p class="corpo" style="color:${t.fg};font-size:32px">${md(s.legenda)}</p>` : ''}`;
  },
  // Oferta (último slide de venda): o produto, o preço grande, o que vem e um botão.
  oferta(s, t, col) {
    return `<div class="bloco" style="align-items:center;text-align:center;gap:22px">
      ${kicker(s.kicker, t)}
      ${s.img ? `<img class="of-img" src="../imagens/${esc(s.img)}" style="width:${s.imgW || 760}px">` : ''}
      <div class="of-pre" style="color:${t.fg}">${md(s.pre || 'Tudo isso por')}</div>
      <div class="of-preco" data-titulo style="color:${t.accent}">${md(s.preco).replace(/^R\$\s*/, '<small>R$</small>')}</div>
      ${s.itens ? `<div class="of-itens">${s.itens.map(i => `<span style="border:2px solid ${t.border};color:${t.fg}"><i style="color:${t.accent}">✓</i> ${md(i)}</span>`).join('')}</div>` : ''}
      <div class="of-botao" style="background:${t.pillBg};color:${t.pillFg}">${md(s.botao || 'Quero os meus')} <span>→</span></div>
      ${s.nota ? `<p style="color:${t.fg};font-size:28px">${md(s.nota)}</p>` : ''}
    </div>`;
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
      <div class="conteudo tipo-${s.type}" data-conteudo style="left:${pl}px;right:${pr}px${s.type === 'cover' && s.img ? ';top:130px;justify-content:flex-start' : ''}${s.type === 'oferta' ? ';top:96px;bottom:160px' : ''}">${corpo}</div>
      ${s.type === 'cover' && s.img ? `<img class="capa-img" src="../imagens/${esc(s.img)}" style="left:${s.imgX ?? 40}px;top:${s.imgY ?? 640}px;width:${s.imgW || 1100}px;transform:rotate(${s.imgRot ?? -4}deg)">` : ''}
      ${s.type === 'cover' && c.icone && !s.img ? `<div class="marca-d" style="opacity:${bgs[i] === 'mint' ? .22 : .14}">${icone(c.icone, 600, bgs[i] === 'mint' ? '#0b2619' : t.accent, 4)}</div>` : ''}
      ${(s.type === 'cover' && !s.img) || s.type === 'cta' || s.type === 'oferta' ? selo(t) : ''}
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
    if (c.link === 'icones') {
      const nome = (c.icones || [])[k] || c.icone, d = 300, top = TOPOS[k % TOPOS.length] + 40;
      return `<div class="lig selo-ic" data-ligacao style="left:${cx - d / 2}px;top:${top}px;width:${d}px;height:${d}px;transform:rotate(${k % 2 ? 8 : -8}deg)">${icone(nome, 170, '#f4f8f6', 6)}</div>`;
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
.conteudo{position:absolute;top:150px;bottom:170px;display:flex;flex-direction:column;justify-content:center;gap:28px;z-index:3}
.bloco{display:flex;flex-direction:column;gap:28px}
.selo{position:absolute;bottom:96px;left:50%;transform:translateX(-50%);padding:8px 18px;border-radius:8px;font:400 24px Poppins;white-space:nowrap;z-index:3}
.selo b{font-weight:700}
.kicker{display:flex;align-items:center;gap:16px;font:600 24px Poppins;letter-spacing:4px;text-transform:uppercase}
.kicker i{display:block;width:48px;height:3px;flex:none}
h1,.num,.hl,.cartao span,.letras span,h2{font-family:Antonio,sans-serif;font-weight:700;text-transform:uppercase;line-height:.96}
h1{overflow-wrap:normal;line-height:1.02}
.pre{font:300 44px Poppins;line-height:1.2}
.hl{display:inline-block;padding:10px 20px 8px;line-height:1}
.sub{font-size:34px;line-height:1.4;max-width:640px;text-wrap:pretty}
.corpo{font-size:35px;line-height:1.45;text-wrap:pretty}
.corpo b{font-weight:700}
mark{background:none;color:inherit;font-weight:700}
h1 mark{color:#5fbf8e}
.caixa{padding:28px 32px;border-radius:20px;font-size:31px;line-height:1.45;text-wrap:pretty}
.cab{display:flex;align-items:baseline;gap:28px}
.num{font-size:180px;line-height:.8}
.linhas{display:grid;grid-template-columns:max-content 1fr;gap:18px 24px;font-size:32px;line-height:1.35}
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
.vit img{display:block;width:100%;border-radius:18px;filter:drop-shadow(0 24px 40px rgba(0,0,0,.28))}
.capa-img{position:absolute;z-index:4;max-width:none}
.of-img{display:block;max-width:none;margin:-10px 0 -6px}
.of-pre{font:600 30px Poppins;letter-spacing:3px;text-transform:uppercase}
.of-preco{font-family:Antonio,sans-serif;font-weight:700;font-size:210px;line-height:1;margin:-30px 0 18px;display:flex;align-items:flex-start;gap:14px}
.of-preco small{font-size:84px;line-height:1;margin-top:28px}
.of-itens{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;max-width:860px}
.of-itens span{padding:8px 20px;border-radius:40px;font-size:27px;line-height:1.2}
.of-itens i{font-style:normal;font-weight:700}
.of-botao{display:flex;align-items:center;gap:18px;padding:24px 56px;border-radius:60px;font:700 40px Poppins;box-shadow:0 18px 40px rgba(0,0,0,.35)}
.of-botao span{font-size:44px}
.selo-ic{border-radius:50%;background:${VERDE};border:10px solid #f4f8f6;display:flex;align-items:center;justify-content:center;box-shadow:0 24px 50px rgba(0,0,0,.28)}
.marca-d{position:absolute;right:-150px;bottom:-190px;transform:rotate(-12deg);z-index:1;pointer-events:none}
.tracinho{display:block;width:96px;height:10px;border-radius:5px}
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

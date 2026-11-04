// Desenho dos elementos do editor do estúdio (textos, formas, personagens, mídia, legenda, efeitos).
// FONTE ÚNICA: o editor da galeria (estudio/galeria/template.html, inserido pelo gerar.py) e a
// composição EditorCamada do Remotion usam estas mesmas funções; assim o render sai igual à prévia.
// Sem dependências: cada função recebe o que precisa.

export const FONTES = {
  'Archivo Expanded': "font-family:'Archivo';font-stretch:125%;font-weight:900",
  'Bebas Neue': "font-family:'Bebas Neue';font-weight:400",
  'Poppins': "font-family:'Poppins';font-weight:800",
  'Big Shoulders': "font-family:'Big Shoulders Display';font-weight:900",
  'Anton': "font-family:'Anton';font-weight:400",
  'Montserrat': "font-family:'Montserrat';font-weight:800",
  'Inter Tight': "font-family:'Inter Tight';font-weight:800",
  'Playfair': "font-family:'Playfair Display';font-weight:900",
  'Instrument Serif': "font-family:'Instrument Serif';font-style:italic;font-weight:400",
  'Mono': "font-family:'IBM Plex Mono';font-weight:600",
};
export const CORES_VIDEO = {natural: {}, quente: {temp: .35, sat: .08}, frio: {temp: -.35, sat: -.05}, cinema: {contraste: .15, sat: -.18, temp: .12, brilho: -.04},
  vivo: {sat: .35, contraste: .1}, pb: {sat: -1, contraste: .18}, petroleo: {temp: -.2, sat: -.12, contraste: .08}, desbotado: {contraste: -.15, sat: -.25, brilho: .05}};
export const FORMAS = {seta: 'Seta', circulo: 'Círculo à mão', retangulo: 'Caixa de destaque', sublinhado: 'Sublinhado', marca: 'Marca-texto', check: 'Certo ✓', xis: 'Errado ✗', balao: 'Balão de fala', progresso: 'Barra de progresso', contador: 'Contador'};

export const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, k) => a + (b - a) * k;
export const suave = (k) => k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
export function easeBack(t) { const c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }
export function claro(h) { if (!h || h[0] !== '#') return true; const n = parseInt(h.slice(1, 7), 16); return ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000 > 150; }

export function filtroCor(c) {
  const p = CORES_VIDEO[c.preset] || {};
  const b = (p.brilho || 0) + (c.brilho || 0), ct = (p.contraste || 0) + (c.contraste || 0), sa = (p.sat || 0) + (c.sat || 0);
  return `brightness(${(1 + b).toFixed(3)}) contrast(${(1 + ct).toFixed(3)}) saturate(${Math.max(0, 1 + sa).toFixed(3)})`;
}
export function tempCor(c) { const p = CORES_VIDEO[c.preset] || {}; return (p.temp || 0) + (c.temp || 0); }

/** posição/escala/rotação/opacidade no tempo t (keyframes com suavização) */
export function propsEm(e, t) {
  const b = {x: e.x, y: e.y, escala: e.escala, rot: e.rot || 0, op: e.op ?? 1};
  const kf = (e.kf || []).slice().sort((a, c) => a.t - c.t);
  if (!kf.length) return b;
  const so = (k) => ({x: k.x ?? b.x, y: k.y ?? b.y, escala: k.escala ?? b.escala, rot: k.rot ?? b.rot, op: k.op ?? b.op});
  if (t <= kf[0].t) return so(kf[0]);
  if (t >= kf[kf.length - 1].t) return so(kf[kf.length - 1]);
  for (let i = 0; i < kf.length - 1; i++) {
    const a = kf[i], c = kf[i + 1];
    if (t >= a.t && t <= c.t) { const k = suave((t - a.t) / Math.max(1e-3, c.t - a.t)); return {x: lerp(a.x, c.x, k), y: lerp(a.y, c.y, k), escala: lerp(a.escala, c.escala, k), rot: lerp(a.rot, c.rot, k), op: lerp(a.op, c.op, k)}; }
  }
  return b;
}

/** animação de entrada/saída no tempo local lt (pausado = mostra pronto, para editar) */
export function animEntrada(e, lt, dur, pausado) {
  const a = e.anim || {}, d = a.dur || .35, rest = dur - lt;
  let tr = '', op = 1;
  const ki = pausado ? 1 : clamp(lt / d, 0, 1);
  switch (a.entra) {
    case 'pop': tr += ` scale(${(.2 + .8 * easeBack(ki)).toFixed(3)})`; op *= Math.min(1, ki * 3); break;
    case 'fade': op *= ki; break;
    case 'subir': tr += ` translateY(${((1 - suave(ki)) * 60).toFixed(1)}%)`; op *= ki; break;
    case 'descer': tr += ` translateY(${(-(1 - suave(ki)) * 60).toFixed(1)}%)`; op *= ki; break;
    case 'esquerda': tr += ` translateX(${(-(1 - suave(ki)) * 80).toFixed(1)}%)`; op *= ki; break;
    case 'direita': tr += ` translateX(${((1 - suave(ki)) * 80).toFixed(1)}%)`; op *= ki; break;
    case 'zoom': tr += ` scale(${(2.2 - 1.2 * suave(ki)).toFixed(3)})`; op *= ki; break;
    case 'girar': tr += ` rotate(${((1 - suave(ki)) * -180).toFixed(1)}deg) scale(${(.3 + .7 * suave(ki)).toFixed(3)})`; op *= ki; break;
    case 'quicar': { const q = ki < 1 ? Math.abs(Math.sin(ki * Math.PI * 2.5)) * (1 - ki) : 0; tr += ` translateY(${(-q * 60).toFixed(1)}%)`; op *= Math.min(1, ki * 4); break; }
  }
  const s = a.sai || 'nenhuma', ks = pausado ? 1 : clamp(rest / .25, 0, 1);
  if (s === 'fade') op *= ks;
  if (s === 'encolher') tr += ` scale(${ks.toFixed(3)})`;
  if (s === 'subir') { tr += ` translateY(${(-(1 - ks) * 60).toFixed(1)}%)`; op *= ks; }
  if (s === 'descer') { tr += ` translateY(${((1 - ks) * 60).toFixed(1)}%)`; op *= ks; }
  return {tr, op, k: ki};
}

/** texto (com *destaque*) */
export function htmlTexto(e, px) {
  const s = FONTES[e.fonte] || FONTES.Poppins;
  let t = esc(e.maiusc ? (e.texto || '').toUpperCase() : e.texto || '');
  t = t.replace(/\*(.+?)\*/g, `<span style="color:${esc(e.destaque || '#FFD52E')}">$1</span>`);
  const contorno = e.contorno ? `-webkit-text-stroke:${(e.espContorno || .06)}em ${e.contorno};paint-order:stroke fill;` : '';
  const sombra = e.sombra ? 'text-shadow:0 .05em .2em rgba(0,0,0,.6);' : '';
  const fundo = e.fundo ? `background:${e.fundo};padding:.32em .7em;border-radius:${(e.raio ?? .3)}em;box-shadow:0 .2em .6em rgba(0,0,0,.35);` : '';
  return `<span style="${s};font-size:${px}px;line-height:1.02;color:${esc(e.cor || '#fff')};letter-spacing:${(e.espac || 0)}em;text-align:${e.alinhar || 'center'};display:inline-block;white-space:pre-wrap;${contorno}${sombra}${fundo}">${t}</span>`;
}

/** formas desenhadas (k = progresso do traço, 0–1) */
export function svgForma(e, k, larg) {
  const c = esc(e.cor || '#FFFFFF'), sw = e.espessura || 6, desenha = k < 1 ? `stroke-dasharray="100" stroke-dashoffset="${(100 * (1 - k)).toFixed(1)}"` : '';
  const base = `fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" pathLength="100" ${desenha}`;
  const W = larg;
  switch (e.forma) {
    case 'seta': return `<svg viewBox="0 0 200 90" width="${W}" style="overflow:visible;display:block"><path ${base} d="M10 70 C 60 72, 120 60, 178 26"/>${k >= .98 ? `<path fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" d="M150 20 L 182 24 L 170 54"/>` : ''}</svg>`;
    case 'circulo': return `<svg viewBox="0 0 200 120" width="${W}" style="overflow:visible;display:block"><path ${base} d="M150 14 C 196 26, 202 92, 120 108 C 40 120, 0 86, 12 50 C 24 16, 100 4, 168 24"/></svg>`;
    case 'retangulo': return `<svg viewBox="0 0 200 120" width="${W}" style="overflow:visible;display:block"><path ${base} d="M14 12 L 188 10 L 190 110 L 12 108 Z"/></svg>`;
    case 'sublinhado': return `<svg viewBox="0 0 200 30" width="${W}" style="overflow:visible;display:block"><path ${base} d="M6 18 C 50 8, 90 26, 130 14 S 180 12, 196 16"/></svg>`;
    case 'marca': return `<svg viewBox="0 0 200 50" width="${W}" style="display:block"><rect x="0" y="6" width="${200 * Math.max(k, .02)}" height="38" rx="6" fill="${c}" opacity=".55"/></svg>`;
    case 'check': return `<svg viewBox="0 0 120 120" width="${W * .5}" style="overflow:visible;display:block"><path ${base} stroke-width="${sw * 1.6}" d="M18 64 L 48 94 L 104 24"/></svg>`;
    case 'xis': return `<svg viewBox="0 0 120 120" width="${W * .5}" style="overflow:visible;display:block"><path ${base} stroke-width="${sw * 1.6}" d="M22 22 L 98 98 M 98 22 L 22 98"/></svg>`;
    case 'balao': return `<div style="position:relative;display:inline-block;background:#fff;color:#111;border-radius:1em;padding:.5em .9em;font:700 ${W / 7}px 'Poppins';box-shadow:0 .2em .6em rgba(0,0,0,.35)">${esc(e.texto || '')}<i style="position:absolute;left:22%;bottom:-.5em;border:.35em solid transparent;border-top:.55em solid #fff;border-bottom:0"></i></div>`;
    case 'progresso': return `<div style="width:${W}px;height:${W / 14}px;border-radius:999px;background:rgba(255,255,255,.25);overflow:hidden"><div style="height:100%;width:${(k * 100).toFixed(1)}%;background:${c}"></div></div>`;
    case 'contador': return `<div style="font:900 ${W / 3}px 'Big Shoulders Display';color:${c};-webkit-text-stroke:.04em #000;paint-order:stroke fill;line-height:1">${Math.round(lerp(+e.de || 0, +e.ate || 0, k))}${esc(e.texto || '')}</div>`;
  }
  return '';
}

/** caixa de imagem/vídeo conforme layout e moldura: {pos, estilo, tr, fit} */
export function caixaMidia(e, p, w, an) {
  const layout = e.layout || 'livre', mold = e.moldura || 'borda';
  const bord = mold === 'borda' ? `border:${(w / 110).toFixed(1)}px solid #fff;border-radius:${(w / 50).toFixed(1)}px;box-shadow:0 8px 24px rgba(0,0,0,.5);` : mold === 'polaroid' ? `border:${(w / 60).toFixed(1)}px solid #F5F1E8;border-bottom-width:${(w / 18).toFixed(1)}px;box-shadow:0 10px 28px rgba(0,0,0,.5);` : mold === 'circulo' ? 'border-radius:50%;aspect-ratio:1;' : mold === 'sombra' ? 'box-shadow:0 14px 40px rgba(0,0,0,.65);' : '';
  let pos = `left:${(p.x * 100).toFixed(2)}%;top:${(p.y * 100).toFixed(2)}%;`, estilo, tr = `translate(-50%,-50%) rotate(${p.rot.toFixed(1)}deg)${an.tr}`;
  if (layout === 'tela-cheia') { pos = 'left:50%;top:50%;'; estilo = 'width:100%;height:100%;'; tr = `translate(-50%,-50%)${an.tr}`; }
  else if (layout === 'pip') { pos = 'left:74%;top:22%;'; estilo = `width:${(w * .42).toFixed(1)}px;${bord}overflow:hidden;`; tr = `translate(-50%,-50%)${an.tr}`; }
  else if (layout === 'cima') { pos = 'left:50%;top:25%;'; estilo = 'width:100%;height:50%;'; tr = `translate(-50%,-50%)${an.tr}`; }
  else if (layout === 'baixo') { pos = 'left:50%;top:75%;'; estilo = 'width:100%;height:50%;'; tr = `translate(-50%,-50%)${an.tr}`; }
  else estilo = `width:${(w * .5 * p.escala).toFixed(1)}px;${bord}overflow:hidden;`;
  const fit = layout === 'livre' || layout === 'pip' ? (mold === 'circulo' ? 'width:100%;height:100%;object-fit:cover' : 'width:100%;display:block') : 'width:100%;height:100%;object-fit:cover';
  return {pos, estilo, tr, fit};
}

/** um elemento no tempo t. o = {pausado, sel, editor, z, personagens: pasta das imagens, urlMidia(e)} */
export function htmlElemento(e, t, w, o) {
  const p = propsEm(e, t), lt = t - e.inicio, dur = e.fim - e.inicio;
  const an = animEntrada(e, lt, dur, o.pausado);
  let op = an.op * p.op; if (o.editor && (t < e.inicio || t > e.fim)) op = .3;
  let corpo = '', estilo = '', tr = `translate(-50%,-50%) rotate(${p.rot.toFixed(1)}deg)${an.tr}`;
  let pos = `left:${(p.x * 100).toFixed(2)}%;top:${(p.y * 100).toFixed(2)}%;`;
  const anim = e.anim || {};
  if (e.tipo === 'texto') {
    let tx = e.texto || '';
    const kA = o.pausado ? 1 : clamp(lt / Math.max(.2, anim.dur || 1), 0, 1);
    if (anim.entra === 'digitar') tx = tx.slice(0, Math.ceil(tx.length * kA));
    if (anim.entra === 'palavras') { const ps = tx.split(/(\s+)/); tx = ps.slice(0, Math.ceil(ps.length * kA)).join(''); }
    corpo = htmlTexto({...e, texto: tx}, (w * .075 * p.escala).toFixed(1)); estilo = `max-width:${(w * .92).toFixed(0)}px;`;
  }
  if (e.tipo === 'emoji') { estilo = `font-size:${(w * .14 * p.escala).toFixed(1)}px;line-height:1;`; corpo = esc(e.emoji); }
  if (e.tipo === 'forma') corpo = svgForma(e, anim.entra === 'desenhar' ? an.k : (e.forma === 'progresso' || e.forma === 'contador' ? clamp(lt / Math.max(.1, dur), 0, 1) : 1), w * .42 * p.escala);
  if (e.tipo === 'personagem') {
    corpo = `<img src="${esc(o.personagens || 'personagens')}/${esc(e.personagem)}-${esc(e.pose)}.png" alt="" draggable="false" style="width:100%;display:block;${e.espelhar ? 'transform:scaleX(-1)' : ''}">`
      + (e.balao ? `<div style="position:absolute;left:50%;bottom:100%;transform:translateX(-50%);background:#fff;color:#111;border-radius:.9em;padding:.4em .8em;font:700 ${(w * .035).toFixed(1)}px 'Poppins';white-space:nowrap;box-shadow:0 .2em .5em rgba(0,0,0,.35)">${esc(e.balao)}</div>` : '');
    estilo = `width:${(w * .34 * p.escala).toFixed(1)}px;`;
  }
  if (e.tipo === 'imagem' || e.tipo === 'video') {
    const c = caixaMidia(e, p, w, an); pos = c.pos; estilo = c.estilo; tr = c.tr;
    const url = o.urlMidia ? o.urlMidia(e) : e.url;
    if (e.tipo === 'imagem') corpo = `<img src="${esc(url)}" alt="" draggable="false" style="${c.fit};display:block">`;
    else corpo = `<div data-vslot="${e.id}" style="${c.fit};background:#000;aspect-ratio:16/9"></div>`;
  }
  const alcas = o.editor && !e.travado ? `<span class="alca" data-alca="${e.id}"></span><span class="giro" data-giro="${e.id}"></span>` : '';
  return `<div class="el${o.sel ? ' sel' : ''}${e.travado ? ' trav' : ''}" data-el="${e.id}" style="position:absolute;transform-origin:50% 50%;white-space:pre-wrap;text-align:center;${pos}opacity:${op.toFixed(3)};transform:${tr};z-index:${10 + (o.z || 0)};${estilo}">${corpo}${alcas}</div>`;
}

export function palavrasDoBloco(b) {
  const txt = (b.texto || '').trim(), ws = txt.split(/\s+/).filter(Boolean);
  if (b.palavras && b.palavras.length === ws.length) return b.palavras.map((p, i) => ({w: ws[i], s: p.s, e: p.e}));
  const d = (b.t1 - b.t0) / Math.max(1, ws.length);
  return ws.map((w, i) => ({w, s: b.t0 + i * d, e: b.t0 + (i + 1) * d}));
}

/** legenda: bloco b no tempo t, com o estilo L */
export function htmlLegenda(L, b, t, w, sel) {
  const f = FONTES[L.fonte] || FONTES.Poppins, px = w * .075 * L.tam;
  const ws = palavrasDoBloco(b), cx = (s) => esc(L.caixaAlta ? s.toUpperCase() : s);
  const contorno = L.contorno ? `-webkit-text-stroke:.09em ${L.contorno};paint-order:stroke fill;` : '';
  let corpo = '';
  const at = ws.findIndex((p) => t >= p.s && t <= p.e + .05);
  if (L.estilo === 'palavra') { const p = ws[Math.max(0, at)] || ws[0]; corpo = p ? `<span style="color:${esc(L.destaque)};font-size:1.5em">${cx(p.w)}</span>` : ''; }
  else if (L.estilo === 'linha') corpo = cx(b.texto);
  else corpo = ws.map((p, i) => {
    const ativo = i === at, falado = t >= p.s;
    if (L.estilo === 'karaoke') return `<span style="color:${falado ? esc(L.destaque) : esc(L.cor)}">${cx(p.w)}</span>`;
    if (L.estilo === 'caixa') return `<span style="${ativo ? `background:${esc(L.destaque)};color:#111;` : ''}border-radius:.2em;padding:0 .12em">${cx(p.w)}</span>`;
    if (L.estilo === 'vox') return `<span style="opacity:${falado ? 1 : 0}">${cx(p.w)}</span>`;
    return `<span style="display:inline-block;${ativo ? `color:${esc(L.destaque)};transform:scale(1.12)` : ''}">${cx(p.w)}</span>`;
  }).join(' ');
  const base = L.estilo === 'caixa' ? `background:#fff;color:#111;padding:.25em .5em;border-radius:.3em;display:inline-block;${f}` : L.estilo === 'linha' ? `${FONTES.Poppins};font-weight:700;color:#fff;text-shadow:0 2px 6px rgba(0,0,0,.8);font-size:.62em` : L.estilo === 'vox' ? `${FONTES['Instrument Serif']};color:#fff;text-shadow:0 .05em .3em rgba(0,0,0,.6);font-size:1.15em` : `${f};color:${esc(L.cor)};${contorno}`;
  return `<div class="leg${sel ? ' sel' : ''}" data-leg="${b.id}" style="position:absolute;left:5%;right:5%;text-align:center;transform:translateY(-50%);top:${(L.y * 100).toFixed(1)}%;font-size:${px.toFixed(1)}px;line-height:1.05;z-index:900"><span style="${base}">${corpo}</span></div>`;
}

/** grão, vinheta e barras por cima de tudo */
export function htmlEfeitos(E, t) {
  const s = Math.floor(t * 12) % 8;
  return (E.vinheta ? `<div style="position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent ${(70 - E.vinheta * 35).toFixed(0)}%,rgba(0,0,0,${(E.vinheta * .85).toFixed(2)}))"></div>` : '')
    + (E.grao ? `<svg width="100%" height="100%" style="position:absolute;inset:0;mix-blend-mode:overlay;opacity:${(E.grao * .7).toFixed(2)}"><filter id="g${s}"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="${s}"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#g${s})"/></svg>` : '')
    + (E.barras ? '<div style="position:absolute;left:0;right:0;top:0;height:11%;background:#000"></div><div style="position:absolute;left:0;right:0;bottom:0;height:11%;background:#000"></div>' : '');
}

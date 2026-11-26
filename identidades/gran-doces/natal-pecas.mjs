// Peças de Natal da Gran Doces (adesivos, lacres, tags, cartões) em mm, usadas pelas folhas de impressão
// (natal-impressos.mjs) e pelo catálogo (natal-catalogo.mjs).
const C = { vermelho: '#A8142A', vinho: '#6D0F1E', verde: '#1E4A3A', verdeEsc: '#16352B', creme: '#FCEEDF', ouro: '#D9B66E', ouroEsc: '#B08A45', cacau: '#3B2418', kraft: '#C99A63' };
const ARROBA = '@grandooces';
const HEAD = `<meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,400..900,100;1,9..144,400..900,100&family=DM+Sans:wght@400;500;700&family=Pinyon+Script&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0}body{font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased}
.f{font-family:Fraunces,serif;font-variation-settings:'SOFT' 100}.s{font-family:'Pinyon Script',cursive;font-weight:400}
@page{size:210mm 297mm;margin:0}</style>`;

let uid = 0;
// Monograma GD (o D em itálico na cor de destaque).
const gd = (mm, cor, d) => `<span class="f" style="font-weight:800;font-size:${mm}mm;line-height:1;letter-spacing:-.04em;color:${cor}">G<i style="font-weight:600;color:${d}">D</i></span>`;
// Logotipo escrito.
const marca = (mm, cor, sub = true) => `<div style="display:flex;flex-direction:column;align-items:center;color:${cor};line-height:1">
  <div class="f" style="font-weight:900;font-size:${mm}mm;letter-spacing:-.035em;white-space:nowrap">Gran Doces</div>
  ${sub ? `<div style="font-weight:700;font-size:${mm * .2}mm;letter-spacing:.42em;margin:${mm * .2}mm -.42em 0 0">CONFEITARIA</div>` : ''}</div>`;
const estrela = (mm, cor) => `<svg viewBox="0 0 24 24" style="width:${mm}mm;height:${mm}mm;flex:none"><path d="M12 2l1.9 7.1L21 12l-7.1 1.9L12 21l-1.9-7.1L3 12l7.1-1.9z" fill="${cor}"/></svg>`;
const arroba = (mm, cor) => `<div style="font-weight:700;font-size:${mm}mm;letter-spacing:.06em;color:${cor}">${ARROBA}</div>`;
const corte = '0 0 0 .25mm #d9c9b0'; // fio de corte nas peças claras

// ---------- Adesivos redondos ----------
const r = {
  // Selo: texto em volta e GD no meio.
  selo: (d, bg, cor, dest, texto = 'GRAN DOCES · FELIZ NATAL · @GRANDOOCES · ') => { const id = 'p' + (++uid);
    return `<div style="width:${d}mm;height:${d}mm;border-radius:50%;background:${bg};position:relative;flex:none;${bg === C.creme ? `box-shadow:${corte}` : ''}">
      <svg viewBox="0 0 400 400" style="position:absolute;inset:0;width:100%;height:100%"><defs><path id="${id}" d="M200,200 m-148,0 a148,148 0 1,1 296,0 a148,148 0 1,1 -296,0"/></defs>
        <circle cx="200" cy="200" r="186" fill="none" stroke="${cor}" stroke-width="5"/><circle cx="200" cy="200" r="112" fill="none" stroke="${cor}" stroke-width="2.5"/>
        <text fill="${cor}" font-family="DM Sans" font-weight="700" font-size="26"><textPath href="#${id}" textLength="920" lengthAdjust="spacing">${texto}</textPath></text></svg>
      <div style="position:absolute;inset:0;display:grid;place-items:center">${gd(d * .26, cor, dest)}</div></div>`; },
  // Nome + Feliz Natal + @.
  feliz: (d, bg, cor, script) => `<div style="width:${d}mm;height:${d}mm;border-radius:50%;background:${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${d * .025}mm;flex:none;${bg === C.creme ? `box-shadow:${corte}` : ''}">
    ${estrela(d * .1, script)}${marca(d * .15, cor, false)}<div class="s" style="font-size:${d * .2}mm;line-height:1.05;color:${script}">Feliz Natal</div>${arroba(d * .055, cor)}</div>`,
  // Produto em destaque.
  produto: (d, bg, cor, dest, nome) => `<div style="width:${d}mm;height:${d}mm;border-radius:50%;background:${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;flex:none;position:relative;${bg === C.creme ? `box-shadow:${corte}` : ''}">
    <div style="position:absolute;inset:${d * .05}mm;border-radius:50%;border:${d * .012}mm solid ${dest}"></div>
    <div style="font-weight:700;font-size:${d * .055}mm;letter-spacing:.3em;margin-right:-.3em;color:${cor}">GRAN DOCES</div>
    <div class="f" style="font-weight:800;font-size:${d * (nome.length > 8 ? .16 : .2)}mm;line-height:1;letter-spacing:-.03em;color:${cor};margin-top:${d * .03}mm">${nome}</div>
    <div class="s" style="font-size:${d * .14}mm;line-height:1.1;color:${dest}">de Natal</div>${arroba(d * .05, cor)}</div>`,
};
// ---------- Quadrados / retangulares ----------
const quad = (w, h, bg, cor, dest, nome, linha = 'FEITO À MÃO') => `<div style="width:${w}mm;height:${h}mm;border-radius:${w * .1}mm;background:${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${w * .03}mm;flex:none;text-align:center;${bg === C.creme ? `box-shadow:${corte}` : ''}">
  ${gd(w * .26, cor, dest)}<div class="f" style="font-weight:800;font-size:${w * .14}mm;line-height:1;color:${cor}">${nome}</div>
  <div style="font-weight:700;font-size:${w * .045}mm;letter-spacing:.28em;margin-right:-.28em;color:${dest}">${linha}</div>${arroba(w * .05, cor)}</div>`;
// Etiqueta de sacola (retângulo em pé).
const sacola = (w, h, bg, cor, dest, frase) => `<div style="width:${w}mm;height:${h}mm;border-radius:${w * .06}mm;background:${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${h * .03}mm;flex:none;text-align:center;padding:${w * .08}mm;${bg === C.creme ? `box-shadow:${corte}` : ''}">
  ${gd(w * .2, cor, dest)}${marca(w * .14, cor)}
  <div class="s" style="font-size:${w * .17}mm;line-height:1.05;color:${dest};margin-top:${h * .02}mm">Feliz Natal</div>
  <div class="f" style="font-weight:500;font-size:${w * .065}mm;line-height:1.3;color:${cor}">${frase}</div>${arroba(w * .055, cor)}</div>`;
// Lacre (fita que fecha a caixa ou a sacola dobrada por cima).
const lacre = (w, h, bg, cor, dest) => `<div style="width:${w}mm;height:${h}mm;border-radius:${h * .2}mm;background:${bg};display:flex;align-items:center;justify-content:space-between;padding:0 ${h * .5}mm;flex:none;${bg === C.creme ? `box-shadow:${corte}` : ''}">
  ${gd(h * .36, cor, dest)}<div class="s" style="font-size:${h * .38}mm;line-height:1;color:${dest};white-space:nowrap">Feliz Natal</div>${arroba(h * .15, cor)}</div>`;
// Sabor (para escrever à mão).
const sabor = (w, h, bg, cor, dest) => `<div style="width:${w}mm;height:${h}mm;border-radius:${h * .2}mm;background:${bg};display:flex;align-items:center;gap:${h * .2}mm;padding:0 ${h * .25}mm;flex:none;box-shadow:${corte}">
  ${gd(h * .45, cor, dest)}<div style="flex:1;display:flex;flex-direction:column;gap:${h * .06}mm"><div style="font-weight:700;font-size:${h * .14}mm;letter-spacing:.24em;color:${dest}">SABOR</div>
  <div style="border-bottom:.3mm solid ${cor};height:${h * .3}mm"></div><div style="font-size:${h * .11}mm;font-weight:700;color:${cor};letter-spacing:.06em">${ARROBA}</div></div></div>`;
// Tag de cordão (furo em cima), com Para / De.
const tag = (w, h, bg, cor, dest, titulo = 'Feliz Natal') => `<div style="width:${w}mm;height:${h}mm;border-radius:${w * .08}mm ${w * .08}mm ${w * .08}mm ${w * .08}mm;background:${bg};position:relative;flex:none;display:flex;flex-direction:column;align-items:center;padding:${h * .14}mm ${w * .1}mm ${w * .08}mm;${bg === C.creme ? `box-shadow:${corte}` : ''}">
  <div style="position:absolute;top:${h * .045}mm;left:50%;transform:translateX(-50%);width:${w * .11}mm;height:${w * .11}mm;border-radius:50%;background:#fff;box-shadow:0 0 0 .25mm ${dest}"></div>
  ${gd(w * .22, cor, dest)}<div class="s" style="font-size:${w * .18}mm;line-height:1.1;color:${dest};margin-top:${h * .02}mm;white-space:nowrap">${titulo}</div>
  <div style="width:100%;margin-top:auto;display:flex;flex-direction:column;gap:${h * .035}mm;font-weight:700;font-size:${w * .07}mm;color:${cor}">
    <div style="display:flex;gap:1.5mm;align-items:flex-end">Para<span style="flex:1;border-bottom:.3mm solid ${cor};opacity:.7"></span></div>
    <div style="display:flex;gap:1.5mm;align-items:flex-end">De<span style="flex:1;border-bottom:.3mm solid ${cor};opacity:.7"></span></div></div>
  <div style="font-weight:700;font-size:${w * .06}mm;letter-spacing:.06em;color:${cor};margin-top:${h * .04}mm">${ARROBA}</div></div>`;
// Cartão (panetone, cesta): mensagem curta.
const cartao = (w, h, bg, cor, dest, msg) => `<div style="width:${w}mm;height:${h}mm;border-radius:${h * .06}mm;background:${bg};display:flex;align-items:center;gap:${w * .05}mm;padding:0 ${w * .07}mm;flex:none;${bg === C.creme ? `box-shadow:${corte}` : ''}">
  <div style="flex:none;display:flex;flex-direction:column;align-items:center;gap:${h * .04}mm">${gd(h * .3, cor, dest)}${arroba(h * .06, cor)}</div>
  <div style="flex:1"><div class="s" style="font-size:${h * .22}mm;line-height:1;color:${dest}">Feliz Natal</div>
  <div class="f" style="font-weight:500;font-size:${h * .085}mm;line-height:1.35;color:${cor};margin-top:${h * .04}mm">${msg}</div>
  <div style="font-weight:700;font-size:${h * .06}mm;letter-spacing:.3em;color:${cor};margin-top:${h * .06}mm">GRAN DOCES</div></div></div>`;
const obrigado = (w, h, bg, cor, dest) => `<div style="width:${w}mm;height:${h}mm;border-radius:${h * .06}mm;background:${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:${h * .04}mm;padding:0 ${w * .08}mm;flex:none;${bg === C.creme ? `box-shadow:${corte}` : ''}">
  <div class="s" style="font-size:${h * .2}mm;line-height:1;color:${dest}">Obrigada</div>
  <div class="f" style="font-weight:500;font-size:${h * .085}mm;line-height:1.35;color:${cor}">por adoçar o seu Natal com a gente.<br>Marca a gente no Instagram!</div>
  ${arroba(h * .08, cor)}</div>`;

const rep = (n, html) => Array(n).fill(html).join('');
const V = C.vermelho, G = C.verde, K = C.creme, O = C.ouro;
const MSG = 'Que a sua mesa fique cheia de doce e de gente querida.';
// ---------- Variações extras ----------
const ceu = (w, h, n, cor, seed = 3) => { let q = seed, o = ''; const rnd = () => (q = (q * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < n; i++) { const t = 1.2 + rnd() * 2.2; o += `<div style="position:absolute;left:${rnd() * (w - t)}mm;top:${rnd() * (h - t)}mm;opacity:${.5 + rnd() * .5}">${estrela(t, cor)}</div>`; } return o; };
const sombra = bg => (bg === C.creme || bg === '#FFFFFF') ? `box-shadow:${corte}` : '';
const extra = {
  // Kraft rústico.
  kraft: (d, nome, linha = 'FEITO À MÃO') => `<div style="width:${d}mm;height:${d}mm;border-radius:50%;background:${C.kraft};display:flex;flex-direction:column;align-items:center;justify-content:center;flex:none;position:relative">
    <div style="position:absolute;inset:${d * .06}mm;border-radius:50%;border:${d * .01}mm solid ${C.cacau};opacity:.55"></div>
    <div class="f" style="font-weight:900;font-size:${d * .12}mm;letter-spacing:-.03em;color:${C.cacau};line-height:1">Gran Doces</div>
    <div class="s" style="font-size:${d * (nome.length > 9 ? .15 : .19)}mm;line-height:1.15;color:${C.vinho}">${nome}</div>
    <div style="font-weight:700;font-size:${d * .045}mm;letter-spacing:.3em;margin-right:-.3em;color:${C.cacau}">${linha}</div></div>`,
  // Céu estrelado.
  estrelado: (d, bg = C.verdeEsc) => `<div style="width:${d}mm;height:${d}mm;border-radius:50%;background:${bg};overflow:hidden;position:relative;flex:none">
    ${ceu(d, d, Math.round(d * .35), C.ouro, Math.round(d))}
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
      <div class="s" style="font-size:${d * .18}mm;line-height:1;color:${C.ouro};white-space:nowrap">Feliz Natal</div>
      <div class="f" style="font-weight:800;font-size:${d * .085}mm;letter-spacing:.02em;color:${C.creme};margin-top:${d * .02}mm">GRAN DOCES</div>
      ${arroba(d * .05, C.creme)}</div></div>`,
  // Bengala doce: aro listrado e miolo creme.
  listras: (d, nome) => `<div style="width:${d}mm;height:${d}mm;border-radius:50%;background:repeating-linear-gradient(45deg,${C.vermelho} 0 ${d * .035}mm,${C.creme} ${d * .035}mm ${d * .07}mm);display:grid;place-items:center;flex:none">
    <div style="width:${d * .8}mm;height:${d * .8}mm;border-radius:50%;background:${C.creme};display:flex;flex-direction:column;align-items:center;justify-content:center">
      ${gd(d * .17, C.vermelho, C.verde)}<div class="f" style="font-weight:800;font-size:${d * (nome.length > 8 ? .1 : .13)}mm;line-height:1.05;color:${C.vermelho};margin-top:${d * .01}mm">${nome}</div>
      ${arroba(d * .045, C.verde)}</div></div>`,
  // Minimalista.
  minimal: (d, bg = C.creme, cor = C.vermelho) => `<div style="width:${d}mm;height:${d}mm;border-radius:50%;background:${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${d * .03}mm;flex:none;${sombra(bg)}">
    ${estrela(d * .08, C.ouro)}<div class="f" style="font-style:italic;font-weight:600;font-size:${d * .15}mm;letter-spacing:-.02em;color:${cor};line-height:1">Gran Doces</div>
    <div style="font-weight:700;font-size:${d * .045}mm;letter-spacing:.35em;margin-right:-.35em;color:${cor};opacity:.8">NATAL 2026</div></div>`,
  // Oval tipo carimbo.
  oval: (w, h, bg, cor, dest, nome) => `<div style="width:${w}mm;height:${h}mm;border-radius:50%;background:${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;flex:none;position:relative;${sombra(bg)}">
    <div style="position:absolute;inset:${h * .07}mm;border-radius:50%;border:${h * .015}mm solid ${dest}"></div>
    <div style="font-weight:700;font-size:${h * .08}mm;letter-spacing:.3em;margin-right:-.3em;color:${dest}">GRAN DOCES</div>
    <div class="s" style="font-size:${h * (nome.length > 8 ? .21 : .28)}mm;line-height:1.05;color:${cor};white-space:nowrap">${nome}</div>
    <div style="font-weight:700;font-size:${h * .065}mm;letter-spacing:.06em;color:${cor}">${ARROBA}</div></div>`,
  // Lacre listrado.
  lacreListra: (w, h) => `<div style="width:${w}mm;height:${h}mm;border-radius:${h * .2}mm;background:repeating-linear-gradient(-55deg,${C.vermelho} 0 ${h * .16}mm,${C.creme} ${h * .16}mm ${h * .32}mm);display:grid;place-items:center;flex:none">
    <div style="background:${C.creme};border-radius:999px;padding:${h * .08}mm ${h * .5}mm;display:flex;align-items:center;gap:${h * .3}mm;box-shadow:0 0 0 ${h * .04}mm ${C.vermelho}">
      ${gd(h * .3, C.vermelho, C.verde)}<span class="s" style="font-size:${h * .34}mm;line-height:1;color:${C.verde}">Feliz Natal</span><span style="font-weight:700;font-size:${h * .13}mm;color:${C.vermelho};letter-spacing:.06em">${ARROBA}</span></div></div>`,
  // Lacre de segurança do delivery.
  lacrado: (w, h, bg = C.vermelho, cor = C.creme, dest = C.ouro) => `<div style="width:${w}mm;height:${h}mm;border-radius:${h * .2}mm;background:${bg};display:flex;align-items:center;justify-content:center;gap:${h * .35}mm;flex:none">
    ${gd(h * .36, cor, dest)}<div style="display:flex;flex-direction:column;line-height:1.1"><span class="s" style="font-size:${h * .32}mm;color:${dest}">Lacrado com carinho</span>
    <span style="font-weight:700;font-size:${h * .12}mm;letter-spacing:.12em;color:${cor}">SE ESTIVER ROMPIDO, AVISE A GENTE · ${ARROBA.toUpperCase()}</span></div></div>`,
  // Tag kraft.
  tagKraft: (w, h, titulo = 'Feliz Natal', linha = '') => `<div style="width:${w}mm;height:${h}mm;border-radius:${w * .08}mm;background:${C.kraft};position:relative;flex:none;display:flex;flex-direction:column;align-items:center;padding:${h * .15}mm ${w * .1}mm ${w * .08}mm">
    <div style="position:absolute;top:${h * .045}mm;left:50%;transform:translateX(-50%);width:${w * .11}mm;height:${w * .11}mm;border-radius:50%;background:#fff;box-shadow:0 0 0 .25mm ${C.cacau}"></div>
    ${estrela(w * .12, C.vinho)}<div class="f" style="font-weight:900;font-size:${w * .14}mm;color:${C.cacau};margin-top:${h * .02}mm;white-space:nowrap">Gran Doces</div>
    <div class="s" style="font-size:${w * .17}mm;line-height:1.1;color:${C.vinho};white-space:nowrap">${titulo}</div>
    ${linha ? `<div style="font-weight:700;font-size:${w * .065}mm;letter-spacing:.2em;color:${C.cacau};margin-top:${h * .02}mm;text-align:center">${linha}</div>` : ''}
    <div style="margin-top:auto;font-weight:700;font-size:${w * .065}mm;letter-spacing:.06em;color:${C.cacau}">${ARROBA}</div></div>`,
  // Cartão postal 15 × 10 com linhas para recado.
  postal: (w, h, bg, cor, dest) => `<div style="width:${w}mm;height:${h}mm;border-radius:${h * .04}mm;background:${bg};display:flex;flex:none;padding:${h * .09}mm;gap:${w * .05}mm;${sombra(bg)}">
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center">${gd(h * .14, cor, dest)}<div class="s" style="font-size:${h * .16}mm;line-height:1;color:${dest};margin-top:${h * .04}mm;white-space:nowrap">Feliz Natal</div>
      <div class="f" style="font-weight:500;font-size:${h * .05}mm;line-height:1.4;color:${cor};margin-top:${h * .04}mm">${MSG}</div>
      <div style="font-weight:700;font-size:${h * .045}mm;letter-spacing:.08em;color:${cor};margin-top:${h * .06}mm">${ARROBA}</div></div>
    <div style="width:.3mm;background:${cor};opacity:.25"></div>
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:${h * .09}mm;font-weight:700;font-size:${h * .05}mm;color:${cor}">
      ${['Para', '', '', 'De'].map(t => `<div style="display:flex;gap:1.5mm;align-items:flex-end">${t}<span style="flex:1;border-bottom:.3mm solid ${cor};opacity:.6"></span></div>`).join('')}</div></div>`,
  // Etiqueta horizontal de sacola 12 × 6.
  sacolaH: (w, h, bg, cor, dest, frase) => `<div style="width:${w}mm;height:${h}mm;border-radius:${h * .1}mm;background:${bg};display:flex;align-items:center;gap:${w * .05}mm;padding:0 ${w * .07}mm;flex:none;${sombra(bg)}">
    ${gd(h * .36, cor, dest)}<div style="display:flex;flex-direction:column;gap:${h * .03}mm"><div class="f" style="font-weight:900;font-size:${h * .17}mm;line-height:1;letter-spacing:-.03em;color:${cor};white-space:nowrap">Gran Doces</div>
    <div class="s" style="font-size:${h * .125}mm;line-height:1.05;color:${dest};white-space:nowrap">${frase}</div>${arroba(h * .07, cor)}</div></div>`,
};

export { C, ARROBA, HEAD, gd, marca, estrela, arroba, corte, r, quad, sacola, lacre, sabor, tag, cartao, obrigado, rep, V, G, K, O, MSG, extra };

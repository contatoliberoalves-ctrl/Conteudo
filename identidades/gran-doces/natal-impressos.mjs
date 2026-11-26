// Impressos de Natal da Gran Doces para os produtos: adesivos (brownie, panetone, torta, biscoitos, sacola),
// lacres, tags de cordão e cartões, em folhas A4 prontas para a gráfica (PDF vetorial + PNG 300 dpi).
// Identidade da linha de Natal (linha-natal.mjs): vermelho, verde, creme e ouro; Fraunces, DM Sans e Pinyon Script.
// Uso: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node natal-impressos.mjs
// Saída: saida/natal-impressos/<folha>.pdf e .png, e visao-geral.png.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const root = path.dirname(new URL(import.meta.url).pathname);
const { chromium } = createRequire(path.join(root, '../../moldes/treino-de-pecas/package.json'))('playwright');
const OUT = path.join(root, 'saida', 'natal-impressos'), BUILD = path.join(root, 'build');
fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(BUILD, { recursive: true });

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
// Folhas A4 (margem 10 mm, peças com 5 mm de intervalo).
const FOLHAS = {
  '01-brownie-redondo-5cm': ['Brownie · adesivo redondo 5 cm (embalagem chique)', [
    rep(3, r.selo(50, V, O, K)), rep(3, r.feliz(50, K, V, G)), rep(3, r.produto(50, G, K, O, 'Brownie')), rep(3, r.produto(50, K, C.cacau, V, 'Brownie'))]],
  '02-brownie-redondo-4cm': ['Brownie · adesivo redondo 4 cm (versão menor)', [
    rep(4, r.selo(40, V, O, K)), rep(4, r.selo(40, G, O, K)), rep(4, r.feliz(40, K, V, G)), rep(4, r.produto(40, V, K, O, 'Brownie'))]],
  '03-panetone-redondo-6cm': ['Panetone · adesivo redondo 6 cm (caixa)', [
    rep(3, r.produto(60, V, K, O, 'Panetone')), rep(3, r.produto(60, K, V, G, 'Panetone')), rep(3, r.selo(60, G, O, K)), rep(3, r.feliz(60, V, K, O))]],
  '04-lacres-caixa-sacola': ['Lacres 12 × 2,5 cm (fechar caixa de panetone ou dobrar sobre a sacola)', [
    rep(3, lacre(120, 25, V, K, O)), rep(3, lacre(120, 25, G, K, O)), rep(3, lacre(120, 25, K, V, G))]],
  '05-cartoes-panetone-9x5': ['Cartão 9 × 5 cm (panetone, presentes)', [
    rep(4, cartao(90, 50, V, K, O, MSG)), rep(4, cartao(90, 50, K, V, G, MSG)), rep(2, obrigado(90, 50, G, K, O))]],
  '06-tags-cordao-5x9': ['Tag de cordão 5,5 × 8,5 cm (biscoitos, panetone): Para / De', [
    rep(3, tag(55, 85, V, K, O)), rep(3, tag(55, 85, K, V, G)), rep(3, tag(55, 85, G, K, O, 'Boas Festas'))]],
  '07-sacola-delivery-9x12': ['Sacola do delivery · etiqueta 9 × 12 cm', [
    sacola(90, 120, V, K, O, 'Feito à mão, com carinho, para o seu Natal.'), sacola(90, 120, K, V, G, 'Feito à mão, com carinho, para o seu Natal.'),
    sacola(90, 120, G, K, O, 'Seu pedido chegou! Bom apetite e Feliz Natal.'), sacola(90, 120, K, G, V, 'Seu pedido chegou! Bom apetite e Feliz Natal.')]],
  '08-torta-acrilico-7cm': ['Torta · adesivo redondo 7 cm (tampa da caixa de acrílico) e etiqueta de sabor 7 × 2,5 cm', [
    rep(2, r.produto(70, K, V, G, 'Torta')), r.selo(70, V, O, K), r.feliz(70, K, G, V), rep(6, sabor(70, 25, K, V, G))]],
  '09-biscoitos-quadrado-6cm': ['Biscoitos · adesivo quadrado 6 cm (caixa branca)', [
    rep(3, quad(60, 60, V, K, O, 'Biscoitos')), rep(3, quad(60, 60, G, K, O, 'Biscoitos')), rep(3, quad(60, 60, K, V, G, 'Biscoitos')), rep(3, quad(60, 60, C.cacau, K, O, 'Biscoitos', 'AMANTEIGADOS'))]],
};

const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 300 / 96 });
const pngs = [];
for (const [nome, [titulo, pecas]] of Object.entries(FOLHAS)) {
  const html = `<!doctype html><html><head>${HEAD}</head><body><div style="width:210mm;height:297mm;padding:9mm 10mm;position:relative;overflow:hidden">
    <div style="font-size:3mm;color:#999;margin-bottom:4mm">Gran Doces · ${titulo} · recorte nas bordas das peças</div>
    <div style="display:flex;flex-wrap:wrap;gap:5mm;align-content:flex-start">${pecas.join('')}</div></div></body></html>`;
  const arq = path.join(BUILD, `natal-${nome}.html`); fs.writeFileSync(arq, html);
  await page.goto('file://' + arq); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(400);
  await page.pdf({ path: path.join(OUT, nome + '.pdf'), width: '210mm', height: '297mm', printBackground: true });
  await page.screenshot({ path: path.join(OUT, nome + '.png') }); pngs.push(nome);
  // a peça no limite da folha some: avisa se alguma passou do fim
  const passou = await page.evaluate(() => [...document.querySelectorAll('body > div > div:last-child > *')].some(e => e.getBoundingClientRect().bottom > 1123 - 20));
  if (passou) console.log('! peças passaram da folha em', nome);
}
await browser.close();
console.log('✓', pngs.length, 'folhas em', OUT);

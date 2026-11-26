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

import { C, ARROBA, HEAD, gd, marca, estrela, arroba, corte, r, quad, sacola, lacre, sabor, tag, cartao, obrigado, rep, V, G, K, O, MSG, extra, bordo, B } from './natal-pecas.mjs';
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
  '10-redondos-extras-5cm': ['Redondos extras 5 cm: kraft, bengala, céu estrelado, minimalista', [
    rep(3, extra.kraft(50, 'Brownie')), rep(3, extra.listras(50, 'Brownie')), rep(3, extra.estrelado(50)), rep(3, extra.minimal(50))]],
  '11-redondos-extras-6cm': ['Redondos extras 6 cm (panetone, torta, biscoitos)', [
    rep(3, extra.kraft(60, 'Panetone')), rep(3, extra.listras(60, 'Panetone')), rep(3, extra.kraft(60, 'Biscoitos', 'AMANTEIGADOS')), rep(3, extra.estrelado(60, C.vinho))]],
  '12-lacres-extras': ['Lacres extras 12 × 2,5 cm: bengala e "lacrado com carinho" (delivery)', [
    rep(4, extra.lacreListra(120, 25)), rep(3, extra.lacrado(120, 25)), rep(2, extra.lacrado(120, 25, G, K, O))]],
  '13-tags-kraft-vinho': ['Tags 5,5 × 8,5 cm: kraft e vinho', [
    rep(3, extra.tagKraft(55, 85)), rep(3, extra.tagKraft(55, 85, 'Boas Festas', 'BISCOITOS AMANTEIGADOS')), rep(3, tag(55, 85, C.vinho, K, O))]],
  '14-cartao-postal-15x10': ['Cartão postal 15 × 10 cm com espaço para recado', [extra.postal(150, 100, K, V, G), extra.postal(150, 100, V, K, O)]],
  '15-sacola-horizontal-e-oval': ['Sacola: etiqueta 12 × 6 cm e oval 8 × 5,5 cm', [
    extra.sacolaH(120, 60, V, K, O, 'Feito à mão pro seu Natal'), extra.sacolaH(120, 60, K, V, G, 'Feito à mão pro seu Natal'),
    rep(2, extra.oval(80, 55, K, V, G, 'Panetone')), rep(2, extra.oval(80, 55, G, K, O, 'Feliz Natal'))]],
  '16-torta-premium-9cm': ['Torta · adesivo bordô 9 cm (tampa do acrílico) e etiqueta de sabor', [
    rep(2, bordo.premium(90)), rep(2, bordo.festone(90, 'Torta')), rep(4, sabor(70, 25, K, B.bordo, B.ouro))]],
  '17-bordo-redondos-5cm': ['Linha bordô · redondos 5 cm (brownie)', [
    rep(3, bordo.mono(50)), rep(3, bordo.nome(50, 'Brownie')), rep(3, bordo.natal(50)), rep(3, bordo.arco(50))]],
  '18-bordo-redondos-6cm': ['Linha bordô · redondos 6 cm (panetone, biscoitos)', [
    rep(3, bordo.festone(60, 'Panetone')), rep(3, bordo.nome(60, 'Panetone')), rep(3, bordo.mono(60)), rep(3, bordo.nome(60, 'Biscoitos'))]],
  '19-bordo-quadrados-e-tags': ['Linha bordô · quadrado 6 cm e tags 5,5 × 8,5 cm', [
    rep(3, bordo.quad(60, 'Biscoitos')), rep(3, bordo.tag(55, 85)), rep(3, bordo.tag(55, 85, 'Boas Festas'))]],
  '20-bordo-lacres-e-cartoes': ['Linha bordô · lacres 12 × 2,5 cm e cartões 9 × 5 cm', [
    rep(4, bordo.lacre(120, 25)), rep(2, bordo.cartao(90, 50)), rep(2, bordo.cartao(90, 50, 'Boas Festas'))]],
  '21-bordo-sacola-9x12': ['Linha bordô · sacola 9 × 12 cm', [rep(4, bordo.sacola(90, 120))]],
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

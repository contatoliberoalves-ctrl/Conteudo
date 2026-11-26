// Catálogo de Natal da Gran Doces (PDF A4 para apresentar): capa, identidade, uma página por produto com as
// versões de adesivo, lacre, tag e cartão (letra, nome e medida) e a página de como imprimir.
// Uso: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node natal-catalogo.mjs
// Saída: saida/natal-impressos/Gran-Doces-Natal-2026-Catalogo.pdf (+ prévias PNG em saida/natal-impressos/catalogo/).
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { C, HEAD, gd, marca, estrela, r, quad, sacola, lacre, sabor, tag, cartao, obrigado, V, G, K, O, MSG, extra } from './natal-pecas.mjs';
const root = path.dirname(new URL(import.meta.url).pathname);
const { chromium } = createRequire(path.join(root, '../../moldes/treino-de-pecas/package.json'))('playwright');
const OUT = path.join(root, 'saida', 'natal-impressos'), PREV = path.join(OUT, 'catalogo'), BUILD = path.join(root, 'build');
fs.mkdirSync(PREV, { recursive: true }); fs.mkdirSync(BUILD, { recursive: true });

const PAPEL = '#FBF5EC';
const ceu = (n, cor, seed = 9) => { let q = seed, o = ''; const rnd = () => (q = (q * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < n; i++) o += `<div style="position:absolute;left:${rnd() * 205}mm;top:${rnd() * 292}mm;opacity:${.35 + rnd() * .55}">${estrela(1.5 + rnd() * 3.5, cor)}</div>`; return o; };
const folha = (bg, html) => `<section style="width:210mm;height:297mm;position:relative;overflow:hidden;background:${bg};page-break-after:always">${html}</section>`;
let nPag = 2;
const rodape = cor => `<div style="position:absolute;left:18mm;right:18mm;bottom:10mm;display:flex;justify-content:space-between;font-size:2.8mm;font-weight:700;letter-spacing:.2em;color:${cor};opacity:.7"><span>GRAN DOCES · NATAL 2026</span><span>@GRANDOOCES · ${String(nPag++).padStart(2, '0')}</span></div>`;

// Página de produto: título, onde usar e as versões em grade, com letra, nome e medida.
const pagina = (titulo, sub, desc, itens, { cols = 3, gap = 8, topo = 52 } = {}) => folha(PAPEL, `
  <div style="position:absolute;left:18mm;right:18mm;top:16mm">
    <div style="display:flex;align-items:baseline;gap:4mm"><div class="f" style="font-weight:900;font-size:13mm;line-height:1;letter-spacing:-.03em;color:${C.vermelho}">${titulo}</div>
      <div class="s" style="font-size:10mm;line-height:1;color:${C.verde}">${sub}</div></div>
    <div style="font-size:3.6mm;line-height:1.5;color:${C.cacau};margin-top:3mm;max-width:150mm">${desc}</div></div>
  <div style="position:absolute;left:18mm;right:18mm;top:${topo}mm;bottom:20mm;display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));gap:${gap}mm ${gap - 2}mm;align-content:start">
    ${itens.map(([html, nome, medida, z = 1], i) => `<div style="display:flex;flex-direction:column;align-items:center;gap:2.5mm${z === 'wide' ? ';grid-column:1/-1' : ''}">
      <div style="display:grid;place-items:center;zoom:${typeof z === 'number' ? z : 1}">${html}</div>
      <div style="text-align:center;line-height:1.3"><span style="font-weight:700;font-size:3.2mm;color:${C.vermelho}">${String.fromCharCode(65 + i)} · </span><span style="font-size:3.2mm;font-weight:700;color:${C.cacau}">${nome}</span><br><span style="font-size:2.8mm;color:${C.cacau};opacity:.7">${medida}</span></div></div>`).join('')}
  </div>${rodape(C.cacau)}`);

const capa = folha(C.vermelho, `${ceu(70, C.ouro)}
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
    ${gd(34, C.creme, C.ouro)}<div style="margin-top:10mm">${marca(22, C.creme)}</div>
    <div class="s" style="font-size:30mm;line-height:1.1;color:${C.ouro};margin-top:8mm">Natal 2026</div>
    <div style="font-size:4.4mm;font-weight:500;line-height:1.6;color:${C.creme};margin-top:8mm;max-width:130mm">Adesivos, lacres, tags e cartões<br>para as embalagens de Natal</div></div>
  <div style="position:absolute;left:0;right:0;bottom:14mm;text-align:center;font-weight:700;font-size:4mm;letter-spacing:.24em;color:${C.creme}">@GRANDOOCES</div>`);

const sw = (cor, nome, hex, txt = '#fff') => `<div style="display:flex;flex-direction:column;gap:2mm"><div style="height:30mm;border-radius:3mm;background:${cor};${cor === C.creme ? 'box-shadow:0 0 0 .3mm #e5d6bf' : ''}"></div>
  <div style="font-weight:700;font-size:3.4mm;color:${C.cacau}">${nome}</div><div style="font-size:3mm;color:${C.cacau};opacity:.7">${hex}</div></div>`;
const identidade = folha(PAPEL, `
  <div style="position:absolute;left:18mm;right:18mm;top:16mm">
    <div style="display:flex;align-items:baseline;gap:4mm"><div class="f" style="font-weight:900;font-size:13mm;line-height:1;letter-spacing:-.03em;color:${C.vermelho}">A linha de Natal</div><div class="s" style="font-size:10mm;color:${C.verde}">Gran Doces</div></div>
    <div style="font-size:3.6mm;line-height:1.5;color:${C.cacau};margin-top:3mm;max-width:160mm">Todas as peças seguem a mesma linha: vermelho e verde de Natal com creme e dourado, o monograma GD e o @grandooces. Assim, brownie, panetone, torta, biscoitos e sacola ficam com cara de coleção quando chegam juntos na mesa do cliente.</div>
    <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:5mm;margin-top:12mm">
      ${sw(C.vermelho, 'Vermelho', '#A8142A')}${sw(C.verde, 'Verde', '#1E4A3A')}${sw(C.vinho, 'Vinho', '#6D0F1E')}${sw(C.creme, 'Creme', '#FCEEDF')}${sw(C.ouro, 'Dourado', '#D9B66E')}${sw(C.kraft, 'Kraft', '#C99A63')}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8mm;margin-top:16mm;align-items:end">
      <div><div class="f" style="font-weight:900;font-size:16mm;line-height:1;color:${C.cacau}">Aa</div><div style="font-size:3.2mm;color:${C.cacau};margin-top:3mm"><b>Fraunces</b> · nomes e títulos</div></div>
      <div><div class="s" style="font-size:15mm;line-height:1;color:${C.vermelho};white-space:nowrap">Feliz Natal</div><div style="font-size:3.2mm;color:${C.cacau};margin-top:3mm"><b>Pinyon Script</b> · o toque de Natal</div></div>
      <div><div style="font-weight:700;font-size:7mm;letter-spacing:.2em;color:${C.verde}">@GRANDOOCES</div><div style="font-size:3.2mm;color:${C.cacau};margin-top:3mm"><b>DM Sans</b> · @ e informações</div></div></div>
    <div style="display:flex;gap:10mm;align-items:center;justify-content:center;margin-top:18mm">
      ${r.selo(38, V, O, K)}${r.feliz(38, K, V, G)}${extra.listras(38, 'Natal')}${extra.estrelado(38)}</div></div>${rodape(C.cacau)}`);

const PAGINAS = [
  pagina('Brownie', 'embalagem chique', 'Adesivo redondo para a própria embalagem do brownie. Escolha uma versão ou alterne as cores na mesma vitrine. Tamanho principal de 5 cm; as versões também saem em 4 cm (folha 02).', [
    [r.selo(50, V, O, K), 'Selo vermelho', '5 cm · folha 01'], [r.selo(50, G, O, K), 'Selo verde', '4 ou 5 cm · folha 02'], [r.feliz(50, K, V, G), 'Feliz Natal creme', '5 cm · folha 01'],
    [r.produto(50, G, K, O, 'Brownie'), 'Brownie de Natal verde', '5 cm · folha 01'], [r.produto(50, K, C.cacau, V, 'Brownie'), 'Brownie de Natal creme', '5 cm · folha 01'], [extra.listras(50, 'Brownie'), 'Bengala doce', '5 cm · folha 10'],
    [extra.kraft(50, 'Brownie'), 'Kraft feito à mão', '5 cm · folha 10'], [extra.estrelado(50), 'Céu estrelado', '5 cm · folha 10'], [extra.minimal(50), 'Minimalista', '5 cm · folha 10']]),
  pagina('Panetone', 'nas caixas', 'Adesivo de 6 cm para a frente ou a tampa da caixa. Para fechar a caixa, use um lacre (página de lacres). O oval fica bom na lateral da caixa.', [
    [r.produto(60, V, K, O, 'Panetone'), 'Panetone de Natal vermelho', '6 cm · folha 03', .7], [r.produto(60, K, V, G, 'Panetone'), 'Panetone de Natal creme', '6 cm · folha 03', .7], [r.selo(60, G, O, K), 'Selo verde', '6 cm · folha 03', .7],
    [r.feliz(60, V, K, O), 'Feliz Natal vermelho', '6 cm · folha 03', .7], [extra.listras(60, 'Panetone'), 'Bengala doce', '6 cm · folha 11', .7], [extra.kraft(60, 'Panetone'), 'Kraft feito à mão', '6 cm · folha 11', .7],
    [extra.oval(80, 55, K, V, G, 'Panetone'), 'Oval creme', '8 × 5,5 cm · folha 15', .7], [extra.oval(80, 55, G, K, O, 'Feliz Natal'), 'Oval verde', '8 × 5,5 cm · folha 15', .7], [extra.estrelado(60, C.vinho), 'Céu estrelado vinho', '6 cm · folha 11', .7]]),
  pagina('Torta', 'caixa de acrílico', 'Adesivo de 7 cm no centro da tampa, combinando com o laço vermelho. A etiqueta de sabor vai na lateral, para escrever à mão (uma só serve para todas as tortas).', [
    [r.produto(70, K, V, G, 'Torta'), 'Torta de Natal creme', '7 cm · folha 08', .7], [r.selo(70, V, O, K), 'Selo vermelho', '7 cm · folha 08', .7], [r.feliz(70, K, G, V), 'Feliz Natal creme', '7 cm · folha 08', .7],
    [extra.listras(70, 'Torta'), 'Bengala doce', '7 cm', .7], [extra.estrelado(70), 'Céu estrelado', '7 cm', .7], [extra.minimal(70, C.creme, C.verde), 'Minimalista verde', '7 cm', .7],
    [sabor(70, 25, K, V, G), 'Etiqueta de sabor', '7 × 2,5 cm · folha 08']]),
  pagina('Biscoitos', 'caixas brancas', 'Na caixa branca, o adesivo quadrado de 6 cm vai na tampa. Com o cordão marrom, pendure uma tag kraft (página de tags): fica com cara de presente feito em casa.', [
    [quad(60, 60, V, K, O, 'Biscoitos'), 'Quadrado vermelho', '6 cm · folha 09', .85], [quad(60, 60, G, K, O, 'Biscoitos'), 'Quadrado verde', '6 cm · folha 09', .85], [quad(60, 60, K, V, G, 'Biscoitos'), 'Quadrado creme', '6 cm · folha 09', .85],
    [quad(60, 60, C.cacau, K, O, 'Biscoitos', 'AMANTEIGADOS'), 'Quadrado chocolate', '6 cm · folha 09', .85], [extra.kraft(60, 'Biscoitos', 'AMANTEIGADOS'), 'Kraft redondo', '6 cm · folha 11', .7], [extra.tagKraft(55, 85, 'Boas Festas', 'BISCOITOS AMANTEIGADOS'), 'Tag kraft no cordão', '5,5 × 8,5 cm · folha 13', .75]]),
  pagina('Sacola', 'do delivery', 'Etiqueta na frente da sacola kraft (23 × 30 cm ou 30 × 30 cm). A grande, de 9 × 12 cm, aparece bem de longe; a horizontal, de 12 × 6 cm, é mais discreta. Feche a boca da sacola com um lacre.', [
    [sacola(90, 120, V, K, O, 'Feito à mão, com carinho, para o seu Natal.'), 'Vermelha', '9 × 12 cm · folha 07', .55], [sacola(90, 120, K, V, G, 'Feito à mão, com carinho, para o seu Natal.'), 'Creme', '9 × 12 cm · folha 07', .55],
    [sacola(90, 120, G, K, O, 'Seu pedido chegou! Bom apetite e Feliz Natal.'), 'Verde · pedido chegou', '9 × 12 cm · folha 07', .55], [sacola(90, 120, K, G, V, 'Seu pedido chegou! Bom apetite e Feliz Natal.'), 'Creme · pedido chegou', '9 × 12 cm · folha 07', .55],
    [extra.sacolaH(120, 60, V, K, O, 'Feito à mão pro seu Natal'), 'Horizontal vermelha', '12 × 6 cm · folha 15', .55], [extra.sacolaH(120, 60, K, V, G, 'Feito à mão pro seu Natal'), 'Horizontal creme', '12 × 6 cm · folha 15', .55]], { cols: 2, gap: 6 }),
  pagina('Lacres', 'caixa e sacola', 'Fita adesiva de 12 × 2,5 cm que fecha a caixa do panetone ou dobra sobre a boca da sacola. O "lacrado com carinho" também serve de lacre de segurança no delivery.', [
    [lacre(120, 25, V, K, O), 'Vermelho', '12 × 2,5 cm · folha 04', .7], [lacre(120, 25, G, K, O), 'Verde', '12 × 2,5 cm · folha 04', .7], [lacre(120, 25, K, V, G), 'Creme', '12 × 2,5 cm · folha 04', .7],
    [extra.lacreListra(120, 25), 'Bengala doce', '12 × 2,5 cm · folha 12', .7], [extra.lacrado(120, 25), 'Lacrado com carinho vermelho', '12 × 2,5 cm · folha 12', .7], [extra.lacrado(120, 25, G, K, O), 'Lacrado com carinho verde', '12 × 2,5 cm · folha 12', .7]], { cols: 2, gap: 8, topo: 52 }),
  pagina('Tags', 'de cordão', 'Tag com furo para o cordão (biscoitos) ou para o laço (panetone e torta). Tem espaço para escrever Para e De à mão. Imprima em papel mais grosso e fure com furador de 6 mm.', [
    [tag(55, 85, V, K, O), 'Vermelha · Para / De', '5,5 × 8,5 cm · folha 06', .82], [tag(55, 85, K, V, G), 'Creme · Para / De', '5,5 × 8,5 cm · folha 06', .82], [tag(55, 85, G, K, O, 'Boas Festas'), 'Verde · Boas Festas', '5,5 × 8,5 cm · folha 06', .82],
    [tag(55, 85, C.vinho, K, O), 'Vinho · Para / De', '5,5 × 8,5 cm · folha 13', .82], [extra.tagKraft(55, 85), 'Kraft · Feliz Natal', '5,5 × 8,5 cm · folha 13', .82], [extra.tagKraft(55, 85, 'Boas Festas', 'BISCOITOS AMANTEIGADOS'), 'Kraft · Biscoitos', '5,5 × 8,5 cm · folha 13', .82]]),
  pagina('Cartões', 'para presentear', 'Cartão pequeno para ir junto do panetone ou da cesta, cartão de agradecimento para o delivery e cartão postal com espaço para o cliente escrever o recado.', [
    [cartao(90, 50, V, K, O, MSG), 'Feliz Natal vermelho', '9 × 5 cm · folha 05', .9], [cartao(90, 50, K, V, G, MSG), 'Feliz Natal creme', '9 × 5 cm · folha 05', .9],
    [obrigado(90, 50, G, K, O), 'Obrigada (delivery)', '9 × 5 cm · folha 05', .9], [obrigado(90, 50, K, V, G), 'Obrigada creme', '9 × 5 cm', .9],
    [extra.postal(150, 100, K, V, G), 'Postal creme com recado', '15 × 10 cm · folha 14', .55], [extra.postal(150, 100, V, K, O), 'Postal vermelho com recado', '15 × 10 cm · folha 14', .55]], { cols: 2, gap: 6 }),
];

const item = (t, d) => `<div style="display:flex;gap:4mm;padding:3.2mm 0;border-bottom:.25mm solid #e5d6bf"><div style="flex:none;width:52mm;font-weight:700;font-size:3.4mm;color:${C.vermelho}">${t}</div><div style="font-size:3.4mm;line-height:1.5;color:${C.cacau}">${d}</div></div>`;
const imprimir = folha(PAPEL, `
  <div style="position:absolute;left:18mm;right:18mm;top:16mm">
    <div style="display:flex;align-items:baseline;gap:4mm"><div class="f" style="font-weight:900;font-size:13mm;line-height:1;letter-spacing:-.03em;color:${C.vermelho}">Como imprimir</div><div class="s" style="font-size:10mm;color:${C.verde}">sem erro</div></div>
    <div style="font-size:3.6mm;line-height:1.5;color:${C.cacau};margin-top:3mm">Cada peça tem uma folha A4 pronta (PDF), com o número indicado nas páginas anteriores. Leve o PDF da folha para a gráfica ou imprima em casa em tamanho real (100%, sem "ajustar à página").</div>
    <div style="margin-top:8mm">
      ${item('Adesivos e lacres', 'Papel adesivo couché (brilho ou fosco). Para a caixa de acrílico e para a geladeira, o vinil adesivo branco aguenta melhor a umidade.')}
      ${item('Tags e cartões', 'Papel couché ou kraft de 240 a 300 g. Fure as tags com furador de 6 mm, no círculo marcado.')}
      ${item('Corte', 'Na gráfica, peça corte especial (meio-corte para os adesivos). Em casa: tesoura para os retângulos e furador de círculo de 4, 5, 6 ou 7 cm para os redondos.')}
      ${item('Peças claras', 'As peças creme têm um fio bem fino em volta só para guiar o corte.')}
      ${item('Antes de imprimir tudo', 'Imprima uma folha de teste e confira o tamanho na embalagem de verdade (tampa da caixa de acrílico, embalagem do brownie, frente da sacola).')}
    </div>
    <div style="margin-top:10mm;font-weight:700;font-size:3.4mm;letter-spacing:.18em;color:${C.verde}">FOLHAS A4 PARA IMPRIMIR</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5mm 8mm;margin-top:3mm;font-size:3.2mm;line-height:1.4;color:${C.cacau}">
      ${['01 · Brownie redondo 5 cm', '02 · Brownie redondo 4 cm', '03 · Panetone redondo 6 cm', '04 · Lacres', '05 · Cartões 9 × 5 cm', '06 · Tags 5,5 × 8,5 cm', '07 · Sacola 9 × 12 cm', '08 · Torta 7 cm e sabor', '09 · Biscoitos quadrado 6 cm', '10 · Redondos extras 5 cm', '11 · Redondos extras 6 cm', '12 · Lacres extras', '13 · Tags kraft e vinho', '14 · Cartão postal 15 × 10 cm', '15 · Sacola horizontal e oval'].map(t => `<div>${t}</div>`).join('')}</div></div>${rodape(C.cacau)}`);

const fim = folha(C.verde, `${ceu(60, C.ouro, 21)}
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
    <div class="s" style="font-size:34mm;line-height:1;color:${C.ouro}">Feliz Natal</div>
    <div style="margin-top:10mm">${marca(16, C.creme)}</div>
    <div style="font-weight:700;font-size:5mm;letter-spacing:.24em;color:${C.creme};margin-top:10mm">@GRANDOOCES</div></div>`);

const html = `<!doctype html><html><head>${HEAD}<style>section:last-child{page-break-after:auto}</style></head><body>${capa}${identidade}${PAGINAS.join('')}${imprimir}${fim}</body></html>`;
const arq = path.join(BUILD, 'natal-catalogo.html'); fs.writeFileSync(arq, html);
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 1.5 });
await page.goto('file://' + arq); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(600);
await page.pdf({ path: path.join(OUT, 'Gran-Doces-Natal-2026-Catalogo.pdf'), width: '210mm', height: '297mm', printBackground: true });
const secs = await page.$$('section');
for (let i = 0; i < secs.length; i++) await secs[i].screenshot({ path: path.join(PREV, `${String(i + 1).padStart(2, '0')}.png`) });
await browser.close();
console.log('✓ catálogo com', secs.length, 'páginas');

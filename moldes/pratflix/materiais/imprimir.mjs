// Imprime um HTML em PDF A4 (texto selecionável, links e marcadores) com rodapé numerado.
// Uso: node imprimir.mjs <entrada.html> <saida.pdf> [rodape|semrodape] ["texto do rodapé"]
import { createRequire } from 'node:module';
import path from 'node:path';
const root = path.dirname(new URL(import.meta.url).pathname);
const { chromium } = createRequire(path.join(root, '..', 'package.json'))('playwright');
const [, , entrada, saida, modo = 'rodape', texto = ''] = process.argv;
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const b = await chromium.launch(launch);
const p = await b.newPage();
await p.goto('file://' + path.resolve(entrada), { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
const rodape = modo === 'rodape';
await p.pdf({
  path: saida, format: 'A4', printBackground: true, preferCSSPageSize: true, outline: true, tagged: true,
  displayHeaderFooter: rodape,
  headerTemplate: '<span></span>',
  footerTemplate: rodape ? `<div style="width:100%;margin:0 18mm;display:flex;justify-content:space-between;align-items:center;font-family:Helvetica,Arial,sans-serif;font-size:7.5pt;color:#7d7158;letter-spacing:.06em"><span><b style="color:#151515">pratflix ▸</b> &nbsp;·&nbsp; ${texto}</span><span class="pageNumber"></span></div>` : '<span></span>',
});
await b.close();

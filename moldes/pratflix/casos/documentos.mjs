// Gera as imagens (1080 px de largura, para celular) dos documentos de um caso simulado.
// Uso (nuvem): CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node casos/documentos.mjs 01
// Saída: saida/casos/<id>/docs/*.png e envelope/*.png, e legendas.json (usado pelos PDFs do caso).
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { W } from './ui.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const n = process.argv[2] || '01';
const arq = fs.readdirSync(root).find((f) => f === `caso-${n}.mjs`);
if (!arq) throw new Error(`caso-${n}.mjs não existe`);
const { caso } = await import(path.join(root, arq));

const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
const saida = path.join(root, '..', 'saida', 'casos', caso.id);
const build = path.join(root, '..', 'build', 'casos');
fs.rmSync(saida, { recursive: true, force: true });
fs.mkdirSync(build, { recursive: true });
const legendas = {};
for (const grupo of ['docs', 'envelope']) {
  fs.mkdirSync(path.join(saida, grupo), { recursive: true });
  for (const d of caso[grupo] || []) {
    const f = path.join(build, `${caso.id}-${d.nome}.html`);
    fs.writeFileSync(f, d.html);
    const page = await browser.newPage({ viewport: { width: W, height: 600 }, deviceScaleFactor: 1080 / W });
    await page.goto('file://' + f, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const out = path.join(saida, grupo, `${d.nome}.png`);
    await page.screenshot({ path: out, fullPage: true });
    await page.close();
    legendas[`${grupo}/${d.nome}.png`] = d.legenda;
    console.log('✓', `${grupo}/${d.nome}.png`);
  }
}
fs.writeFileSync(path.join(saida, 'legendas.json'), JSON.stringify(legendas, null, 1));
await browser.close();

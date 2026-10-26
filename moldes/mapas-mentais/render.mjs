// Uso: node render.mjs [id] -> saida/<id>/<n>.png (2×), saida/<id>/<id>.pdf (A4 horizontal) e painel.png.
// O PDF é montado com as imagens das páginas (sombras e degradês saem iguais em qualquer leitor).
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { renderMapas, W, H } from './template.mjs';
const root = path.dirname(new URL(import.meta.url).pathname);
const { chromium } = createRequire(path.join(root, 'package.json'))('playwright');

const dados = JSON.parse(fs.readFileSync(path.join(root, 'dados.json'), 'utf8')).filter(m => !process.argv[2] || m.id === process.argv[2]);
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
fs.mkdirSync(path.join(root, 'build'), { recursive: true });
let erro = 0;
for (const m of dados) {
  const f = path.join(root, 'build', `${m.id}.html`);
  fs.writeFileSync(f, renderMapas(m));
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  await page.goto('file://' + f);
  await page.waitForFunction(() => window.__pronto === true, null, { timeout: 30000 });
  await page.waitForTimeout(200);
  const avisos = await page.evaluate(() => window.__avisos || []);
  const out = path.join(root, 'saida', m.id);
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  const pags = await page.$$('section.pagina');
  for (let i = 0; i < pags.length; i++) await pags[i].screenshot({ path: path.join(out, `${i + 1}.png`) });
  await page.close();
  const pdf = await browser.newPage();
  await pdf.setContent(`<style>@page{size:297mm 210mm;margin:0}body{margin:0}img{display:block;width:297mm;height:210mm;break-after:page}img:last-child{break-after:auto}</style>${pags.map((_, i) => `<img src="data:image/png;base64,${fs.readFileSync(path.join(out, `${i + 1}.png`)).toString('base64')}">`).join('')}`);
  await pdf.pdf({ path: path.join(out, `${m.id}.pdf`), width: '297mm', height: '210mm', printBackground: true });
  await pdf.close();
  fs.copyFileSync(path.join(out, pags.length > 1 ? '2.png' : '1.png'), path.join(out, 'painel.png'));
  console.log(avisos.length ? '!' : '✓', m.id, `(${pags.length} páginas A4 + PDF)`);
  avisos.forEach(a => console.log('   ', a));
  if (avisos.length) erro = 1;
}
await browser.close();
process.exitCode = erro;

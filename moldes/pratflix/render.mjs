// Gera as telas de cada post do dados.json: saida/<id>/1.png, 2.png… (e painel.png com todas lado a lado).
// Uso: node render.mjs [id]. Nuvem: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { renderTela } from './template.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const dados = JSON.parse(fs.readFileSync(path.join(root, 'dados.json'), 'utf8'));
const filtro = process.argv[2];
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
fs.mkdirSync(path.join(root, 'build'), { recursive: true });
for (const c of dados) {
  if (filtro && c.id !== filtro) continue;
  const outDir = path.join(root, 'saida', c.id);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  for (const [i, t] of c.telas.entries()) {
    const { w, h, html } = renderTela(t);
    const f = path.join(root, 'build', `${c.id}-${i + 1}.html`);
    fs.writeFileSync(f, html);
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.goto('file://' + f);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, `${i + 1}.png`) });
    await page.close();
  }
  console.log('✓', c.id, `(${c.telas.length} tela${c.telas.length > 1 ? 's' : ''})`);
}
await browser.close();

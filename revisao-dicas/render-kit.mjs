// Gera o kit de peças do produto: saida/<id>/kit/<peça>.png (2x, para telas retina; o mockup sai com fundo transparente).
// Uso: node render-kit.mjs <id> [peça ...]
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { renderPeca } from './kit.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const [id, ...so] = process.argv.slice(2);
const prod = JSON.parse(fs.readFileSync(path.join(root, 'produtos.json'), 'utf8')).find(p => p.id === id);
const out = path.join(root, 'saida', id);
const uri = (parte, n) => 'data:image/png;base64,' + fs.readFileSync(path.join(out, typeof parte === 'number' ? `parte${parte}` : parte, `${n}.png`)).toString('base64');
const img = Object.fromEntries((prod.kitCapas || ['capa1', 'capa2']).map(k => [k, uri(...prod.imagens[k])]));
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
const dir = path.join(out, 'kit'); fs.mkdirSync(dir, { recursive: true });
for (const pc of prod.kit.filter(p => !so.length || so.includes(p.id))) {
  const { html, transparente } = renderPeca(pc, prod, img);
  const page = await browser.newPage({ viewport: { width: pc.w, height: pc.h }, deviceScaleFactor: pc.w >= 1200 ? 1 : 2 });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__pronto === true);
  await page.waitForTimeout(250);
  await (await page.$('#arte')).screenshot({ path: path.join(dir, `${pc.id}.png`), omitBackground: transparente });
  await page.close();
  console.log('✓', pc.id);
}
await browser.close();

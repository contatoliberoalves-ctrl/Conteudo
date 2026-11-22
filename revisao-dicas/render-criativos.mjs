// Gera os criativos de um produto: saida/<id>/criativos/<id-do-criativo>.png (+ painel.jpg de conferência).
// Usa páginas dos PDFs como imagem (rode antes: node render-pdf.mjs <id> --png=1,5,10,51,56).
// Uso: node render-criativos.mjs <id> [criativo ...]
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { renderCriativo } from './criativos.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const [id, ...so] = process.argv.slice(2);
const prod = JSON.parse(fs.readFileSync(path.join(root, 'produtos.json'), 'utf8')).find(p => p.id === id);
const conteudo = JSON.parse(fs.readFileSync(path.join(root, 'conteudo', `${id}.json`), 'utf8'));
const dicas = Object.fromEntries(conteudo.materias.flatMap(m => m.blocos.flatMap(b => b.dicas)).map(d => [d.n, d]));
const out = path.join(root, 'saida', id);
const uri = (parte, n) => { const f = path.join(out, typeof parte === 'number' ? `parte${parte}` : parte, `${n}.png`); return fs.existsSync(f) ? 'data:image/png;base64,' + fs.readFileSync(f).toString('base64') : ''; };
const im = prod.imagens || {};
const img = Object.fromEntries(Object.entries(im).map(([k, [p, n]]) => [k, uri(p, n)]));
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
const dir = path.join(out, 'criativos'); fs.mkdirSync(dir, { recursive: true });
for (const cr of prod.criativos.filter(c => !so.length || so.includes(c.id))) {
  const { html, W, H } = renderCriativo(cr, prod, dicas, img);
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__pronto === true);
  await page.waitForTimeout(250);
  await (await page.$('#arte')).screenshot({ path: path.join(dir, `${cr.id}.png`) });
  await page.close();
  console.log('✓', cr.id);
}
await browser.close();

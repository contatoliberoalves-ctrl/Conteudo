// Gera as peças da ANOREG/PE (estilo Azulejo) em saida/<peça>.png
// Uso: node render.mjs [peça ...]   (nuvem: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs)
import fs from 'node:fs';
import path from 'node:path';
import { abrirNavegador } from '../cartorio-comum/render-base.mjs';
import { head, PECAS as BASE, SEM_LOGO } from './template.mjs';
import { EXTRAS } from './extras.mjs';
const PECAS = [...BASE, ...EXTRAS];

const root = path.dirname(new URL(import.meta.url).pathname);
if (SEM_LOGO) console.log('! sem assets/logo-*.png: rode preparar_logo.py com um PDF da ANOREG/PE (ex.: o boleto de contribuição)');
const filtro = process.argv.slice(2);
const out = path.join(root, 'saida'); fs.mkdirSync(out, { recursive: true });
const browser = await abrirNavegador();
for (const p of PECAS) {
  if (filtro.length && !filtro.includes(p.nome)) continue;
  const page = await browser.newPage({ viewport: { width: p.w, height: p.h } });
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8">${head}</head><body>${p.html}</body></html>`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(150);
  const fora = await page.evaluate(([w, h]) => [...document.querySelectorAll('body *')].filter(e => {
    const r = e.getBoundingClientRect(); return e.childElementCount === 0 && e.textContent.trim() && (r.right > w + 1 || r.bottom > h + 1);
  }).map(e => e.textContent.trim().slice(0, 30)), [p.w, p.h]);
  if (fora.length) console.log(`  ! ${p.nome}: passa da borda: ${fora.join(' | ')}`);
  await page.screenshot({ path: path.join(out, p.nome + '.png') });
  await page.close();
}
await browser.close();
console.log('✓', PECAS.length, 'peças em saida/');

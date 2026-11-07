// Gera as peças das 4 direções da identidade ANOREG/PE em saida/<opcao>/<peca>.png
// Uso: node render.mjs [A B ...]   (nuvem: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs)
import fs from 'node:fs';
import path from 'node:path';
import { abrirNavegador } from '../cartorio-comum/render-base.mjs';
import { OPCOES, pecas } from './template.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const filtro = process.argv.slice(2);
const browser = await abrirNavegador();
for (const o of OPCOES) {
  if (filtro.length && !filtro.includes(o.id)) continue;
  const out = path.join(root, 'saida', o.id);
  fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
  for (const p of pecas(o)) {
    const page = await browser.newPage({ viewport: { width: p.w, height: p.h } });
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8">${o.head}</head><body>${p.html}</body></html>`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(150);
    const fora = await page.evaluate(([w, h]) => [...document.querySelectorAll('body *')].filter(e => {
      const r = e.getBoundingClientRect(); return e.childElementCount === 0 && e.textContent.trim() && (r.right > w + 1 || r.bottom > h + 1);
    }).map(e => e.textContent.trim().slice(0, 30)), [p.w, p.h]);
    if (fora.length) console.log(`  ! ${o.id}/${p.nome}: passa da borda: ${fora.join(' | ')}`);
    await page.screenshot({ path: path.join(out, p.nome + '.png') });
    await page.close();
  }
  console.log('✓', o.id, o.nome);
}
await browser.close();

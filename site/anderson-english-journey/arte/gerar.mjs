// Gera as ilustrações em img/*.webp: node arte/gerar.mjs [nome ...]
// No ambiente em nuvem: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node arte/gerar.mjs
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const aqui = dirname(fileURLToPath(import.meta.url)), saida = join(aqui, '..', 'img'), tmp = process.env.ARTE_TMP || join(aqui, '.tmp');
mkdirSync(saida, { recursive: true }); mkdirSync(tmp, { recursive: true });
let chromium; try { ({ chromium } = await import('playwright')); } catch { ({ chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs')); }
const glifos = (readFileSync(join(aqui, '..', 'index.html'), 'utf8').match(/<symbol id="g-[\s\S]*?<\/symbol>/g) || []).join('');
const mods = { rio: './rio.mjs', nyc: './nyc.mjs', sf: './sf.mjs', boston: './boston.mjs', rota: './rota.mjs', 'mapa-nyc': './locais.mjs', 'mapa-sf': './locais.mjs', 'mapa-boston': './locais.mjs', folha: './folha.mjs' };
const fn = n => n.replace(/-(\w)/g, (_, c) => c.toUpperCase());
const quais = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(mods).filter(n => n !== 'folha');
const nav = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, proxy: process.env.RENDER_PROXY ? { server: process.env.RENDER_PROXY } : undefined, args: ['--ignore-certificate-errors'] });
for (const n of quais) {
  const m = await import(mods[n]); const a = m[fn(n)](glifos);
  const pg = await nav.newPage({ viewport: { width: a.w, height: a.h }, deviceScaleFactor: a.esc || 1 });
  await pg.setContent(`<!doctype html><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,800;1,9..144,500;1,9..144,700&family=Barlow+Condensed:wght@500;600;700;800&display=swap"><style>body{margin:0}svg{display:block}</style>${a.svg}`, { waitUntil: 'networkidle' });
  await pg.evaluate(() => document.fonts.ready);
  const png = join(tmp, n + '.png'); await pg.screenshot({ path: png }); await pg.close();
  if (n !== 'folha') execFileSync('python3', ['-c', `from PIL import Image; im=Image.open(${JSON.stringify(png)}).convert('RGB'); im.save(${JSON.stringify(join(saida, n + '.webp'))}, 'WEBP', quality=${a.q || 84}, method=6)`]);
  console.log(n, 'ok');
}
await nav.close();

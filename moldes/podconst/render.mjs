// Uso: node render.mjs [id]  -> saida/<id>/1.png … N.png (1080×1350) e painel.png (3 primeiros slides).
// O visual é o kit do autor (kit/Moldes PodConst.dc.html), sem alteração: cada post do dados.json aponta
// para um grupo de telas do kit ("1a" = telas 1a-01…1a-10; "1e" = tela única). Fotos opcionais em fotos/
// (fora do git) entram nos <image-slot> pelo id: "fotos": {"c1-01": "dupla.jpg"}.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const root = path.dirname(new URL(import.meta.url).pathname);
const dados = JSON.parse(fs.readFileSync(path.join(root, 'dados.json'), 'utf8'));
const filtro = process.argv[2];
const kit = path.join(root, 'kit', 'Moldes PodConst.dc.html');

const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
const page = await browser.newPage({ viewport: { width: 1400, height: 1600 } });
await page.goto('file://' + kit);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(800);

let problemas = 0;
for (const c of dados) {
  if (filtro && c.id !== filtro) continue;
  const avisos = [];
  for (const [slot, arq] of Object.entries(c.fotos || {})) {
    const f = path.join(root, 'fotos', arq);
    if (!fs.existsSync(f)) { avisos.push(`foto não encontrada: fotos/${arq}`); continue; }
    await page.evaluate(([id, src]) => document.getElementById(id)?.setAttribute('src', src), [slot, 'file://' + f]);
  }
  if (c.fotos) await page.waitForTimeout(500);
  const telas = await page.$$(`[data-screen-label="${c.grupo}"], [data-screen-label^="${c.grupo}-"]`);
  if (!telas.length) avisos.push(`grupo "${c.grupo}" não existe no kit`);
  const outDir = path.join(root, 'saida', c.id);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  for (let i = 0; i < telas.length; i++) await telas[i].screenshot({ path: path.join(outDir, `${i + 1}.png`) });
  console.log(avisos.length ? '!' : '✓', c.id, `(${telas.length} slides)`);
  avisos.forEach(a => console.log('   ', a));
  if (avisos.length) problemas++;
}
await browser.close();
if (problemas) process.exitCode = 1;

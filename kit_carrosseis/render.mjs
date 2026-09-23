// Uso: node render.mjs            -> gera todos os carrosséis de dados.json
//      node render.mjs habeas-data -> gera só um (pelo "id")
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { renderCarrossel } from './template.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const dados = JSON.parse(fs.readFileSync(path.join(root, 'dados.json'), 'utf8'));
const filtro = process.argv[2];
const buildDir = path.join(root, 'build');
fs.mkdirSync(buildDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 3240, height: 1350 } });

for (const c of dados) {
  if (filtro && c.id !== filtro) continue;
  const foto = path.isAbsolute(c.foto) ? c.foto : '../fotos/' + c.foto;
  const htmlPath = path.join(buildDir, `${c.id}.html`);
  fs.writeFileSync(htmlPath, renderCarrossel({ ...c, foto }));
  await page.goto('file://' + htmlPath);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const outDir = path.join(root, 'saida', c.id);
  fs.mkdirSync(outDir, { recursive: true });
  for (let i = 0; i < 3; i++) {
    await page.screenshot({ path: path.join(outDir, `${i + 1}.png`), clip: { x: i * 1080, y: 0, width: 1080, height: 1350 } });
  }
  await page.screenshot({ path: path.join(outDir, 'painel.png') });
  console.log('✓', c.id);
}
await browser.close();

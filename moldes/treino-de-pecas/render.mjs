// Uso: node render.mjs          -> gera todos os carrosséis de dados.json
//      node render.mjs <id>     -> gera só um (pelo "id")
// Saída: saida/<id>/1.png (capa), 2.png… (enunciado, quantos slides precisar), "Antes de responder", CTA,
// painel.png (todos lado a lado) e gabarito.txt.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { renderCarrossel } from './template.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const dados = JSON.parse(fs.readFileSync(path.join(root, 'dados.json'), 'utf8'));
const filtro = process.argv.slice(2);
const buildDir = path.join(root, 'build');
fs.mkdirSync(buildDir, { recursive: true });

// Opcional: CHROMIUM_PATH (navegador já instalado) e RENDER_PROXY (proxy para baixar as fontes).
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);

let problemas = 0;
for (const [idx, c] of dados.entries()) {
  if (filtro.length && !filtro.includes(c.id)) continue;
  const { html } = renderCarrossel(c, idx);
  const htmlPath = path.join(buildDir, `${c.id}.html`);
  fs.writeFileSync(htmlPath, html);
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  await page.goto('file://' + htmlPath);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);

  // Letra do enunciado: "px" fixo no dados.json, ou a maior entre 40 e 34px (Autoral) / 34 e 30px (Treino)
  // que usa o menor número de slides.
  const [maior, menor] = c.px ? [c.px, c.px] : c.tipo === 'autoral' ? [40, 34] : [34, 30];
  const tentativas = [];
  for (let t = maior; t >= menor; t -= 1) tentativas.push([t, (await page.evaluate(px => window.__paginar(px), t)).enunciados]);
  const minimo = Math.min(...tentativas.map(t => t[1]));
  const px = tentativas.find(t => t[1] === minimo)[0];
  const r = await page.evaluate(px => window.__paginar(px), px);
  await page.setViewportSize({ width: r.total * 1080, height: 1350 });
  await page.waitForTimeout(200);

  const outDir = path.join(root, 'saida', c.id);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  for (let i = 0; i < r.total; i++) {
    await page.screenshot({ path: path.join(outDir, `${i + 1}.png`), clip: { x: i * 1080, y: 0, width: 1080, height: 1350 } });
  }
  await page.screenshot({ path: path.join(outDir, 'painel.png'), clip: { x: 0, y: 0, width: r.total * 1080, height: 1350 } });
  if (c.gabarito) fs.writeFileSync(path.join(outDir, 'gabarito.txt'), c.gabarito + '\n');
  await page.close();
  const erro = r.avisos.length > 0;
  console.log(erro ? '!' : '✓', c.id, `(${c.tipo || 'treino'}, ${r.total} slides, enunciado em ${r.enunciados} slide(s) a ${px}px)`);
  r.avisos.forEach(a => console.log('   ', a));
  if (erro) problemas++;
}
await browser.close();
if (problemas) process.exitCode = 1;

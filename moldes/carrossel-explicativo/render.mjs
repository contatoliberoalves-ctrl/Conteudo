// Uso: node render.mjs                -> gera todos os carrosséis de dados.json
//      node render.mjs <id>           -> gera só um (pelo "id")
// Saída: saida/<id>/1.png … N.png (1080×1350) e painel.png (3 primeiros slides, para a galeria).
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { renderCarrossel } from './template.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const dados = JSON.parse(fs.readFileSync(path.join(root, 'dados.json'), 'utf8'));
const filtro = process.argv[2];
const buildDir = path.join(root, 'build');
fs.mkdirSync(buildDir, { recursive: true });

// Opcional: CHROMIUM_PATH (navegador já instalado) e RENDER_PROXY (proxy para baixar as fontes).
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);

let problemas = 0;
for (const c of dados) {
  if (filtro && c.id !== filtro) continue;
  const foto = path.isAbsolute(c.foto) ? c.foto : '../fotos/' + c.foto;
  const { html, total } = renderCarrossel({ ...c, foto });
  const htmlPath = path.join(buildDir, `${c.id}.html`);
  fs.writeFileSync(htmlPath, html);
  const page = await browser.newPage({ viewport: { width: total * 1080, height: 1350 } });
  await page.goto('file://' + htmlPath);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);

  // Texto que não cabe: bloco de conteúdo transbordando ou capa subindo sobre o rosto.
  const avisos = await page.evaluate(() => [...document.querySelectorAll('[id^=slide-]')].flatMap((s, i) => {
    const b = s.querySelector('[data-bloco]');
    if (!b) return [];
    const r = b.getBoundingClientRect();
    if (i === 0) return r.top < 420 ? [`slide 1: texto da capa sobe até y=${Math.round(r.top)} e cobre o rosto (encurte o destaque ou o subtítulo)`] : [];
    if (b.scrollHeight > b.clientHeight + 2) return [`slide ${i + 1}: conteúdo passa ${b.scrollHeight - b.clientHeight}px do espaço (divida em dois slides ou encurte)`];
    return [];
  }));

  const outDir = path.join(root, 'saida', c.id);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  for (let i = 0; i < total; i++) {
    await page.screenshot({ path: path.join(outDir, `${i + 1}.png`), clip: { x: i * 1080, y: 0, width: 1080, height: 1350 } });
  }
  await page.screenshot({ path: path.join(outDir, 'painel.png'), clip: { x: 0, y: 0, width: Math.min(total, 3) * 1080, height: 1350 } });
  await page.close();
  console.log(avisos.length ? '!' : '✓', c.id, `(${total} slides)`);
  avisos.forEach(a => console.log('   ', a));
  problemas += avisos.length;
}
await browser.close();
if (problemas) process.exitCode = 1;

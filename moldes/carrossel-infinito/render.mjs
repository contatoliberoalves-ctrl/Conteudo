// Uso: node render.mjs          -> gera todos os carrosséis de dados.json
//      node render.mjs <id>     -> gera só um (pelo "id")
// Saída: saida/<id>/1.png … n.png (fatias de 1080 da faixa) e painel.png (os 3 primeiros slides).
// Confere: texto que não cabe na coluna, texto a menos de 40px de figura/foto, temas repetidos.
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
  const { html, total, avisos } = renderCarrossel(c);
  const htmlPath = path.join(buildDir, `${c.id}.html`);
  fs.writeFileSync(htmlPath, html);
  const page = await browser.newPage({ viewport: { width: total * 1080, height: 1350 } });
  await page.goto('file://' + htmlPath);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);

  const checagem = await page.evaluate(() => {
    const out = [];
    const ligs = [...document.querySelectorAll('[data-ligacao]')].map(e => e.getBoundingClientRect());
    document.querySelectorAll('[data-conteudo]').forEach((cont, i) => {
      const n = i + 1;
      if (cont.scrollHeight > cont.clientHeight + 1) out.push(`slide ${n}: conteúdo passa ${cont.scrollHeight - cont.clientHeight}px da altura`);
      const cr = cont.getBoundingClientRect();
      cont.querySelectorAll('*').forEach(el => {
        if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow !== 'visible') out.push(`slide ${n}: texto passa da largura (${el.tagName.toLowerCase()})`);
      });
      // Retângulos do texto de verdade (cada linha), comparados com a coluna e com figuras/fotos.
      const w = document.createTreeWalker(cont, NodeFilter.SHOW_TEXT);
      let no, fora = 0, perto = 0;
      while ((no = w.nextNode())) {
        if (!no.textContent.trim()) continue;
        const r = document.createRange(); r.selectNodeContents(no);
        for (const q of r.getClientRects()) {
          if (q.left < cr.left - 2 || q.right > cr.right + 2) fora++;
          if (ligs.some(l => q.right > l.left - 40 && q.left < l.right + 40 && q.bottom > l.top - 40 && q.top < l.bottom + 40)) perto++;
        }
      }
      if (fora) out.push(`slide ${n}: ${fora} linha(s) de texto fora da coluna`);
      if (perto) out.push(`slide ${n}: ${perto} linha(s) de texto a menos de 40px de figura/foto`);
    });
    return out;
  });
  const todos = [...avisos, ...checagem];

  const outDir = path.join(root, 'saida', c.id);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  for (let i = 0; i < total; i++) {
    await page.screenshot({ path: path.join(outDir, `${i + 1}.png`), clip: { x: i * 1080, y: 0, width: 1080, height: 1350 } });
  }
  await page.screenshot({ path: path.join(outDir, 'painel.png'), clip: { x: 0, y: 0, width: Math.min(total, 3) * 1080, height: 1350 } });
  await page.close();
  console.log(todos.length ? '!' : '✓', c.id, `(${total} slides, ${c.link === 'photo' ? 'foto' : c.shape || 'ring'})`);
  todos.forEach(a => console.log('   ', a));
  if (todos.length) problemas++;
}
await browser.close();
if (problemas) process.exitCode = 1;

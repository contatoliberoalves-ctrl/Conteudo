// Uso: node render.mjs [id] -> saida/<id>/<id>.pdf (A4 horizontal), saida/<id>/<n>.png (2×) e painel.png.
// As imagens de "print" vêm de prints/ (fora do git: são telas de projetos de clientes).
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { renderApresentacao, W, H } from './template.mjs';
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);

const root = path.dirname(new URL(import.meta.url).pathname);
const dados = JSON.parse(fs.readFileSync(path.join(root, 'dados.json'), 'utf8'));
const filtro = process.argv[2];
fs.mkdirSync(path.join(root, 'build'), { recursive: true });
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
let problemas = 0;
for (const a of dados) {
  if (filtro && a.id !== filtro) continue;
  const imgs = s => [s.print, ...lista(s.prints), ...lista(s.telas).map(t => t.print)].filter(Boolean);
  const faltando = a.slides.flatMap(s => imgs(s).filter(p => !fs.existsSync(path.join(root, p))));
  const url = p => 'file://' + path.join(root, p);
  const { html, total } = renderApresentacao({ ...a, slides: a.slides.map(s => ({ ...s, ...(s.print && { print: url(s.print) }), ...(s.prints && { prints: s.prints.map(url) }), ...(s.telas && { telas: s.telas.map(t => ({ ...t, print: url(t.print) })) }) })) });
  const htmlPath = path.join(root, 'build', `${a.id}.html`);
  fs.writeFileSync(htmlPath, html);
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  await page.goto('file://' + htmlPath);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  const avisos = await page.evaluate(() => [...document.querySelectorAll('.slide')].flatMap((s, i) => {
    const r = s.getBoundingClientRect(), out = [];
    for (const el of s.querySelectorAll('h1,p,div')) { const q = el.getBoundingClientRect(); if (q.width && (q.right > r.right + 1 || q.bottom > r.bottom + 1) && getComputedStyle(el).position !== 'absolute' && el.closest('[style*="perspective"]') == null) { out.push(`slide ${i + 1}: conteúdo passa da borda`); break; } }
    return out;
  }));
  faltando.forEach(f => avisos.push(`print não encontrado: ${f}`));
  const outDir = path.join(root, 'saida', a.id);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  const slides = await page.$$('.slide');
  for (let i = 0; i < slides.length; i++) await slides[i].screenshot({ path: path.join(outDir, `${i + 1}.png`) });
  await page.pdf({ path: path.join(outDir, `${a.id}.pdf`), width: '297mm', height: '210mm', printBackground: true, preferCSSPageSize: true });
  fs.copyFileSync(path.join(outDir, '1.png'), path.join(outDir, 'painel.png'));
  await page.close();
  console.log(avisos.length ? '!' : '✓', a.id, `(${total} slides)`);
  avisos.forEach(x => console.log('   ', x));
  if (avisos.length) problemas++;
}
await browser.close();
if (problemas) process.exitCode = 1;

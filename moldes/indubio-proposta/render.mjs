// Uso: node render.mjs [id] -> build/thumbs/<thumb>.png (1280×720), saida/<id>/<id>.pdf (A4 retrato),
// saida/<id>/<n>.png (2×) e painel.png. As fotos dos recortes ficam em fotos/ (fora do git).
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { renderProposta, HEAD, W, H } from './template.mjs';
import { htmlThumb } from './thumbs.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const dados = JSON.parse(fs.readFileSync(path.join(root, 'dados.json'), 'utf8'));
const thumbs = JSON.parse(fs.readFileSync(path.join(root, 'thumbs.json'), 'utf8'));
const filtro = process.argv[2];
const build = path.join(root, 'build'), dirThumbs = path.join(build, 'thumbs');
fs.mkdirSync(dirThumbs, { recursive: true });
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
const espera = async page => { await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(400); };

// 1. Miniaturas usadas pelas propostas.
const usadas = new Set(dados.filter(p => !filtro || p.id === filtro).flatMap(p => p.paginasThumbs.flatMap(g => g.thumbs)));
const png = {};
let problemas = 0;
for (const t of thumbs) {
  if (!usadas.has(t.id)) continue;
  if (t.foto && !fs.existsSync(path.join(root, t.foto))) { console.log('!', `foto não encontrada: ${t.foto} (rode o recorte das fotos)`); problemas++; continue; }
  const p = path.join(build, `thumb-${t.id}.html`);
  fs.writeFileSync(p, htmlThumb({ ...t, foto: t.foto && 'file://' + path.join(root, t.foto) }, HEAD));
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto('file://' + p);
  await espera(page);
  const saida = path.join(dirThumbs, `${t.id}.png`);
  await page.screenshot({ path: saida });
  await page.close();
  png[t.id] = { ...t, png: 'file://' + saida };
}

// 2. Propostas.
for (const p of dados) {
  if (filtro && p.id !== filtro) continue;
  const { html, total } = renderProposta(p, png);
  const htmlPath = path.join(build, `${p.id}.html`);
  fs.writeFileSync(htmlPath, html);
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  await page.goto('file://' + htmlPath);
  await espera(page);
  const avisos = await page.evaluate(() => [...document.querySelectorAll('.slide')].flatMap((s, i) => {
    const r = s.getBoundingClientRect();
    for (const el of s.querySelectorAll('div,figure,span')) { const q = el.getBoundingClientRect(); if (q.width && !el.closest('[data-r]') && getComputedStyle(el).position !== 'absolute' && (q.right > r.right - 40 || q.bottom > r.bottom - 50)) return [`página ${i + 1}: conteúdo passa da margem`]; }
    return [];
  }));
  const outDir = path.join(root, 'saida', p.id);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  const slides = await page.$$('.slide');
  for (let i = 0; i < slides.length; i++) await slides[i].screenshot({ path: path.join(outDir, `${i + 1}.png`) });
  await page.pdf({ path: path.join(outDir, `${p.id}.pdf`), width: '210mm', height: '297mm', printBackground: true, preferCSSPageSize: true });
  fs.copyFileSync(path.join(outDir, '1.png'), path.join(outDir, 'painel.png'));
  await page.close();
  console.log(avisos.length ? '!' : '✓', p.id, `(${total} páginas)`);
  avisos.forEach(x => console.log('   ', x));
  if (avisos.length) problemas++;
}
await browser.close();
if (problemas) process.exitCode = 1;

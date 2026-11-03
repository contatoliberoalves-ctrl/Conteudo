// Uso: node render.mjs [id]  -> saida/<id>/1.png … N.png (1080×1350) e painel.png (3 primeiros slides).
// O visual é o kit do autor (kit/Moldes PodConst.dc.html), sem alteração: cada post do dados.json aponta
// para um grupo de telas do kit ("1a" = telas 1a-01…1a-10; "1e" = tela única). Fotos opcionais em fotos/
// (fora do git) entram nos <image-slot> pelo id: "fotos": {"c1-01": "dupla.jpg"}.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { paginaHtml } from './posts.mjs';
import { quizHtml } from './quiz.mjs';
import { calmoHtml } from './calmo.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const dados = JSON.parse(fs.readFileSync(process.env.DADOS || path.join(root, 'dados.json'), 'utf8'));  // DADOS=outro.json para prévias fora da galeria
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
  // Grupos escritos em código (posts.mjs): página própria; fotos entram nos <img data-foto="nome">.
  const html = paginaHtml(c.grupo) || quizHtml(c.grupo) || calmoHtml(c.grupo);
  if (html) {
    const build = path.join(root, 'build');
    fs.mkdirSync(build, { recursive: true });
    const arq = path.join(build, `${c.id}.html`);
    fs.writeFileSync(arq, html);
    const pg = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
    await pg.goto('file://' + arq);
    for (const [nome, f] of Object.entries(c.fotos || {})) {
      const caminho = [path.join(root, 'fotos', f), path.join(root, 'elementos', f)].find(fs.existsSync) || path.join(root, 'fotos', f);
      if (!fs.existsSync(caminho)) { avisos.push(`foto não encontrada: fotos/${f} (fica o @ no lugar)`); continue; }
      await pg.evaluate(([n, src]) => document.querySelectorAll(`img[data-foto="${n}"]`).forEach(i => i.setAttribute('src', src)), [nome, 'file://' + caminho]);
    }
    await pg.evaluate(() => Promise.all([document.fonts.ready, ...[...document.images].filter(i => i.src).map(i => i.decode().catch(() => {}))]));
    await pg.waitForTimeout(400);
    const telas = await pg.$$('[data-tela]');
    const outDir = path.join(root, 'saida', c.id);
    fs.rmSync(outDir, { recursive: true, force: true });
    fs.mkdirSync(outDir, { recursive: true });
    for (let i = 0; i < telas.length; i++) await telas[i].screenshot({ path: path.join(outDir, `${i + 1}.png`) });
    await pg.close();
    console.log(avisos.length ? '!' : '✓', c.id, `(${telas.length} slides)`);
    avisos.forEach(a => console.log('   ', a));
    continue;
  }
  for (const [slot, arq] of Object.entries(c.fotos || {})) {
    const f = [path.join(root, 'fotos', arq), path.join(root, 'elementos', arq)].find(fs.existsSync) || path.join(root, 'fotos', arq);
    if (!fs.existsSync(f)) { avisos.push(`foto não encontrada: fotos/${arq}`); continue; }
    await page.evaluate(([id, src]) => document.getElementById(id)?.setAttribute('src', src), [slot, 'file://' + f]);
  }
  if (c.fotos) await page.waitForTimeout(500);
  // O kit repete algumas telas (1d, 1e, 1f aparecem duas vezes): fica só a primeira de cada rótulo.
  const todas = await page.$$(`[data-screen-label="${c.grupo}"], [data-screen-label^="${c.grupo}-"]`);
  const vistos = new Set(), telas = [];
  for (const t of todas) { const r = await t.getAttribute('data-screen-label'); if (!vistos.has(r)) { vistos.add(r); telas.push(t); } }
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

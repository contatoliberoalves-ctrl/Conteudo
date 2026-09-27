// Uso: node render.mjs          -> gera todos os carrosséis de dados.json
//      node render.mjs <id>     -> gera só um (pelo "id")
// Saída: saida/<id>/1.png … N.png (1080×1350) e painel.png (3 primeiros slides, para a galeria).
// Ajusta: diminui o título (até 70%) e depois o texto (até 24px) até caberem em cada área do slide.
// Avisa se ainda assim o texto passar da área ou se faltar foto.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { renderCarrossel } from './template.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const dados = JSON.parse(fs.readFileSync(path.join(root, 'dados.json'), 'utf8'));
const filtro = process.argv[2];
const buildDir = path.join(root, 'build');
fs.mkdirSync(buildDir, { recursive: true });

// Fotos da Eduarda (fora do git) em fotos/ (deste molde ou dos outros da Eduarda); imagens/ tem as fotos CC0 de exemplo.
const pastas = [path.join(root, 'fotos'), path.join(root, 'imagens'), path.join(root, '..', 'carrossel-eduarda', 'fotos'), path.join(root, '..', 'carrossel-eduarda-moderno', 'fotos')];
const achar = nome => pastas.map(p => path.join(p, nome)).find(f => fs.existsSync(f));

const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);

let problemas = 0;
for (const c of dados) {
  if (filtro && c.id !== filtro) continue;
  const nomes = new Set();
  for (const s of c.slides) for (const k of ['foto', 'foto2']) if (s[k]) nomes.add(s[k]);
  const imgs = {};
  for (const n of nomes) { const f = achar(n); if (f) imgs[n] = 'file://' + f; }
  const { html, total, avisos } = renderCarrossel({ ...c, _imgs: imgs });
  const htmlPath = path.join(buildDir, `${c.id}.html`);
  fs.writeFileSync(htmlPath, html);
  const page = await browser.newPage({ viewport: { width: total * 1080, height: 1350 } });
  await page.goto('file://' + htmlPath);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);

  const checagem = await page.evaluate(() => {
    const out = [];
    // Passa da área: alguma linha de texto fora do retângulo da área. Na vertical há folga de 35% do
    // corpo da fonte, porque títulos com entrelinha curta (.8–1) têm o glifo maior que a linha.
    const estoura = a => {
      const r = a.getBoundingClientRect(), w = document.createTreeWalker(a, NodeFilter.SHOW_TEXT);
      let no;
      while ((no = w.nextNode())) {
        if (!no.textContent.trim()) continue;
        if (no.parentElement.closest('[data-livre]')) continue;
        const g = document.createRange(); g.selectNodeContents(no);
        const fv = 2 + 0.35 * parseFloat(getComputedStyle(no.parentElement).fontSize);
        if ([...g.getClientRects()].some(q => q.right > r.right + 2 || q.left < r.left - 2 || q.bottom > r.bottom + fv || q.top < r.top - fv)) return true;
      }
      return false;
    };
    document.querySelectorAll('[id^="slide-"]').forEach((s, i) => {
      const n = i + 1;
      s.querySelectorAll('[data-area]').forEach(a => {
      const t = a.querySelector('[data-titulo]'), corpo = [...a.querySelectorAll('[data-corpo]')];
      if (t) { const base = parseFloat(t.style.fontSize); let px = base; while (estoura(a) && px > base * 0.7) { px -= 4; t.style.fontSize = px + 'px'; } }
      const base = corpo.map(e => parseFloat(getComputedStyle(e).fontSize));
      for (let k = 1; estoura(a) && base.some(b => b - k >= 24); k++) corpo.forEach((e, j) => (e.style.fontSize = Math.max(24, base[j] - k) + 'px'));
      if (estoura(a)) out.push(`slide ${n}: o texto não cabe (encurte ou divida o slide)`);
      });
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
  console.log(todos.length ? '!' : '✓', c.id, `(${total} slides)`);
  todos.forEach(a => console.log('   ', a));
  if (todos.length) problemas++;
}
await browser.close();
if (problemas) process.exitCode = 1;

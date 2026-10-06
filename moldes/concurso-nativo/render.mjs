// Uso: node render.mjs [id]  -> saida/<id>/1.png … N.png (1080×1350) e painel.png (3 primeiros slides).
// Avisa se faltar foto, se um bloco de texto sair da tela ou se dois blocos se encostarem.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { renderCarrossel } from './template.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const dados = JSON.parse(fs.readFileSync(path.join(root, 'dados.json'), 'utf8'));
const filtro = process.argv[2];
const buildDir = path.join(root, 'build');
fs.mkdirSync(buildDir, { recursive: true });

// Fotos do autor (fora do git): fotos/ deste molde ou as dos outros moldes dele.
const pastas = ['fotos', '../carrossel-nativo/fotos', '../carrossel-explicativo/fotos', '../concursocomlibero/fotos'].map(p => path.join(root, p));
const achar = nome => pastas.map(p => path.join(p, nome)).find(f => fs.existsSync(f));

const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);

let problemas = 0;
for (const c of dados) {
  if (filtro && c.id !== filtro) continue;
  const fotos = {};
  for (const s of c.slides || []) for (const n of [s.foto]) if (n) { const f = achar(n); if (f) fotos[n] = 'file://' + f; }
  const { html, total, avisos, altura } = renderCarrossel({ ...c, _fotos: fotos });
  const htmlPath = path.join(buildDir, `${c.id}.html`);
  fs.writeFileSync(htmlPath, html);
  const page = await browser.newPage({ viewport: { width: total * 1080, height: altura } });
  await page.goto('file://' + htmlPath);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  // Cada linha do texto é um balão: se uma não couber na largura e quebrar, diminui a fonte do bloco.
  await page.evaluate(() => document.querySelectorAll('[data-bloco] > div').forEach(d => {
    let t = parseFloat(d.style.fontSize);
    while (t > 30 && [...d.querySelectorAll('span')].some(s => s.getClientRects().length > 1)) d.style.fontSize = (t -= 2) + 'px';
  }));
  // Elementos que passaram a se encostar (fonte maior) descem; se o último sair por baixo, o grupo sobe.
  await page.evaluate(() => document.querySelectorAll('[id^="slide-"]').forEach(s => {
    const bs = [...s.querySelectorAll('[data-bloco],[data-print]')].sort((a, b) => a.offsetTop - b.offsetTop);
    const alt = b => b.offsetHeight;
    for (let k = 1; k < bs.length; k++) {
      const min = bs[k - 1].offsetTop + alt(bs[k - 1]) + 24;
      if (bs[k].offsetTop < min) bs[k].style.top = min + 'px';
    }
    const ult = bs[bs.length - 1];
    const sobra = ult ? ult.offsetTop + alt(ult) - (s.offsetHeight - 70) : 0;
    if (sobra > 0) bs.forEach(b => { b.style.top = Math.max(60, b.offsetTop - sobra) + 'px'; });
  }));
  const checagem = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('[id^="slide-"]').forEach((s, i) => {
      const sr = s.getBoundingClientRect();
      const rs = [...s.querySelectorAll('[data-bloco] > div')].map(b => b.getBoundingClientRect());
      rs.forEach((r, k) => {
        if (r.left < sr.left + 20 || r.right > sr.right - 20 || r.top < sr.top + 20 || r.bottom > sr.bottom - 20) out.push(`slide ${i + 1}: bloco ${k + 1} sai da tela (encurte ou mude o "y")`);
        rs.slice(k + 1).forEach((q, j) => { if (r.bottom > q.top - 12 && q.bottom > r.top - 12) out.push(`slide ${i + 1}: blocos ${k + 1} e ${k + j + 2} se encostam (ajuste o "y")`); });
      });
    });
    return out;
  });
  const todos = [...avisos, ...checagem];
  const outDir = path.join(root, 'saida', c.id);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  for (let i = 0; i < total; i++) await page.screenshot({ path: path.join(outDir, `${i + 1}.png`), clip: { x: i * 1080, y: 0, width: 1080, height: altura } });
  await page.screenshot({ path: path.join(outDir, 'painel.png'), clip: { x: 0, y: 0, width: Math.min(total, 3) * 1080, height: altura } });
  await page.close();
  console.log(todos.length ? '!' : '✓', c.id, `(${total} slides)`);
  todos.forEach(a => console.log('   ', a));
  if (todos.length) problemas++;
}
await browser.close();
if (problemas) process.exitCode = 1;

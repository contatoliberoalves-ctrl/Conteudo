// Uso: node render.mjs          -> gera todos os carrosséis de dados.json
//      node render.mjs <id>     -> gera só um (pelo "id")
// Saída: saida/<id>/1.png … N.png (1080×1350) e painel.png (3 primeiros slides, para a galeria).
// Reduz os títulos marcados com data-fit até a palavra caber na largura e avisa quando o texto
// passa da área do slide ([data-caixa]) ou quando falta imagem.
import { chromium } from 'playwright';
import QRCode from 'qrcode';
import fs from 'node:fs';
import path from 'node:path';
import { renderCarrossel } from './template.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const dados = JSON.parse(fs.readFileSync(path.join(root, 'dados.json'), 'utf8'));
const filtro = process.argv[2];
const buildDir = path.join(root, 'build');
fs.mkdirSync(buildDir, { recursive: true });

// Imagens: fotos/ (fotos pessoais, fora do git) ou imagens/ (ilustrações, prints, gráficos).
const imagem = nome => {
  const f = ['fotos', 'imagens'].map(p => path.join(root, p, nome)).find(f => fs.existsSync(f));
  return f ? 'file://' + f : null;
};

const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);

let problemas = 0;
for (const c of dados) {
  if (filtro && c.id !== filtro) continue;
  const qr = {};
  for (const [i, s] of c.slides.entries()) {
    if (s.modelo === 'L13' && s.link) qr[i] = await QRCode.toString(s.link, { type: 'svg', margin: 0, color: { dark: '#2A2324', light: '#FFFFFF' } });
  }
  const { html, total, avisos } = renderCarrossel(c, { imagem, qr });
  const htmlPath = path.join(buildDir, `${c.id}.html`);
  fs.writeFileSync(htmlPath, html);
  const page = await browser.newPage({ viewport: { width: total * 1080, height: 1350 } });
  await page.goto('file://' + htmlPath);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);

  const checagem = await page.evaluate(() => {
    const out = [];
    // Palavra que não cabe na largura: reduz a fonte (até 55%).
    document.querySelectorAll('[data-fit]').forEach(e => {
      const base = parseFloat(e.style.fontSize);
      let px = base;
      while (e.scrollWidth > e.clientWidth + 1 && px > base * 0.55) { px -= 2; e.style.fontSize = px + 'px'; }
    });
    const estoura = a => {
      if (a.scrollHeight > a.clientHeight + 2) return true;
      const r = a.getBoundingClientRect(), w = document.createTreeWalker(a, NodeFilter.SHOW_TEXT);
      let no;
      while ((no = w.nextNode())) {
        const g = document.createRange(); g.selectNodeContents(no);
        if ([...g.getClientRects()].some(q => q.right > r.right + 2 || q.left < r.left - 2 || q.bottom > r.bottom + 2)) return true;
      }
      return false;
    };
    document.querySelectorAll('[id^="slide-"]').forEach((s, i) => {
      const a = s.querySelector('[data-caixa]');
      if (a && estoura(a)) out.push(`slide ${i + 1} (${s.dataset.modelo}): o texto não cabe (encurte ou divida o slide)`);
      s.querySelectorAll('[data-fit]').forEach(e => { if (e.scrollWidth > e.clientWidth + 1) out.push(`slide ${i + 1}: palavra longa demais no título grande`); });
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

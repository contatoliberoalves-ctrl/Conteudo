// Gera o PDF A4 e as páginas em PNG (para a galeria) de cada material do dados.json.
// Uso: node render.mjs [id]  -> saida/<id>/<id>.pdf, saida/<id>/1.png … N.png (1080 px de largura) e painel.png.
// Nuvem: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { render, W, H } from './template.mjs';
const req = createRequire(import.meta.url);
let chromium; try { ({ chromium } = req('playwright')); } catch { ({ chromium } = createRequire('/opt/node-tools/node_modules/')('playwright')); }

const root = path.dirname(new URL(import.meta.url).pathname);
const colecoes = JSON.parse(fs.readFileSync(path.join(root, 'colecoes.json'), 'utf8'));
const dados = JSON.parse(fs.readFileSync(path.join(root, 'dados.json'), 'utf8')).filter(c => !process.argv[2] || c.id === process.argv[2]);
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
fs.mkdirSync(path.join(root, 'build'), { recursive: true });
const escala = 1080 / W;
for (const c of dados) {
  const html = render({ ...c, base: { colecao: colecoes[c.colecao] } });
  const htmlPath = path.join(root, 'build', `${c.id}.html`);
  fs.writeFileSync(htmlPath, html);
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: escala });
  await page.goto('file://' + htmlPath);
  await page.waitForFunction(() => window.__pronto === true, null, { timeout: 30000 });
  const avisos = await page.evaluate(h => [...document.querySelectorAll('.pagina .corpo')].flatMap((el, i) => 100 + el.scrollHeight * (parseFloat(el.style.zoom) || 1) > h - 60 ? [`página ${i + 2}: conteúdo encosta no rodapé`] : []), H);
  const outDir = path.join(root, 'saida', c.id);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  const secoes = await page.$$('section.pagina');
  for (let i = 0; i < secoes.length; i++) await secoes[i].screenshot({ path: path.join(outDir, `${i + 1}.png`) });
  await page.pdf({ path: path.join(outDir, `${c.id}.pdf`), width: '210mm', height: '297mm', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await page.close();
  // Painel da galeria: as 3 primeiras páginas lado a lado.
  const n = Math.min(3, secoes.length), w = Math.round(W * escala), h = Math.round(H * escala);
  const painel = await browser.newPage({ viewport: { width: w * n, height: h } });
  const ph = path.join(root, 'build', `${c.id}-painel.html`);
  fs.writeFileSync(ph, `<body style="margin:0;display:flex">${Array.from({ length: n }, (_, i) => `<img src="file://${path.join(outDir, `${i + 1}.png`)}" style="width:${w}px">`).join('')}</body>`);
  await painel.goto('file://' + ph);
  await painel.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth));
  await painel.screenshot({ path: path.join(outDir, 'painel.png') });
  await painel.close();
  console.log(avisos.length ? '!' : '✓', c.id, `(${secoes.length} páginas)`);
  avisos.forEach(a => console.log('   ', a));
}
await browser.close();

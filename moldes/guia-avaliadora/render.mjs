// Uso: node render.mjs [id] -> saida/<id>/<n>.png (3×), <id>.pdf (A6, uma página por folha),
// <id>-impressao-A4.pdf (4 páginas A6 por folha A4, para imprimir e cortar) e painel.png.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { renderGuia, W, H } from './template.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const dados = JSON.parse(fs.readFileSync(path.join(root, 'dados.json'), 'utf8'));
const filtro = process.argv[2];
const build = path.join(root, 'build');
fs.mkdirSync(build, { recursive: true });
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);

let problemas = 0;
for (const g of dados) {
  if (filtro && g.id !== filtro) continue;
  const { html, total } = renderGuia(g);
  const htmlPath = path.join(build, `${g.id}.html`);
  fs.writeFileSync(htmlPath, html);
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 3 });
  await page.goto('file://' + htmlPath);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  // Reduz o título até 25% se a página não couber; depois avisa.
  const avisos = await page.evaluate(() => [...document.querySelectorAll('.slide')].flatMap((s, i) => {
    const a = s.querySelector('[data-area]');
    if (!a) return [];
    const cabe = () => a.scrollHeight <= a.clientHeight + 1;
    const t = a.querySelector('[data-titulo]'), base = t && parseFloat(getComputedStyle(t).fontSize);
    for (let k = 1; t && !cabe() && k <= 25; k++) t.style.fontSize = base * (1 - k * .01) + 'px';
    return cabe() ? [] : [`página ${i + 1}: o conteúdo não cabe (encurte ou divida a página)`];
  }));
  const outDir = path.join(root, 'saida', g.id);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  const slides = await page.$$('.slide');
  for (let i = 0; i < slides.length; i++) await slides[i].screenshot({ path: path.join(outDir, `${i + 1}.png`) });
  await page.close();
  const img = i => `file://${path.join(outDir, `${i + 1}.png`)}`;
  const idx = [...Array(total).keys()];
  // PDF montado com as imagens das páginas (o granulado em mix-blend sai em faixas em alguns leitores).
  const pdf = async (nome, corpo, w, h) => {
    const p = path.join(build, `${g.id}-${nome}.html`);
    fs.writeFileSync(p, `<!doctype html><html><head><style>@page{size:${w} ${h};margin:0}html,body{margin:0}.f{width:${w};height:${h};position:relative;overflow:hidden;break-after:page}.f:last-child{break-after:auto}</style></head><body>${corpo}</body></html>`);
    const pg = await browser.newPage();
    await pg.goto('file://' + p);
    await pg.pdf({ path: path.join(outDir, nome === 'a6' ? `${g.id}.pdf` : `${g.id}-impressao-A4.pdf`), width: w, height: h, printBackground: true, preferCSSPageSize: true });
    await pg.close();
  };
  await pdf('a6', idx.map(i => `<div class="f"><img src="${img(i)}" style="width:105mm;height:148mm;display:block"></div>`).join(''), '105mm', '148mm');
  const folhas = [];
  for (let i = 0; i < total; i += 4) folhas.push(idx.slice(i, i + 4));
  await pdf('a4', folhas.map(f => `<div class="f">${f.map((i, k) => `<img src="${img(i)}" style="position:absolute;left:${(k % 2) * 105}mm;top:${Math.floor(k / 2) * 148.5 + .25}mm;width:105mm;height:148mm">`).join('')}
    <div style="position:absolute;left:105mm;top:0;bottom:0;border-left:.2mm dashed #999"></div><div style="position:absolute;top:148.5mm;left:0;right:0;border-top:.2mm dashed #999"></div></div>`).join(''), '210mm', '297mm');
  // Painel da galeria: as 3 primeiras páginas lado a lado.
  const pp = path.join(build, `${g.id}-painel.html`);
  fs.writeFileSync(pp, `<!doctype html><html><body style="margin:0;display:flex">${idx.slice(0, 3).map(i => `<img src="${img(i)}" style="width:${W}px;height:${H}px">`).join('')}</body></html>`);
  const pv = await browser.newPage({ viewport: { width: W * Math.min(3, total), height: H } });
  await pv.goto('file://' + pp);
  await pv.screenshot({ path: path.join(outDir, 'painel.png') });
  await pv.close();
  console.log(avisos.length ? '!' : '✓', g.id, `(${total} páginas)`);
  avisos.forEach(x => console.log('   ', x));
  if (avisos.length) problemas++;
}
await browser.close();
if (problemas) process.exitCode = 1;

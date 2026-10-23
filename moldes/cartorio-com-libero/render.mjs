// Uso: node render.mjs [id]  -> saida/<id>/1.png no tamanho exato da peça, 1@2x.png (o dobro, para telas retina) e painel.png.
// Avisa se o texto sair da peça ou encostar na borda.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { renderPeca } from './template.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const dados = JSON.parse(fs.readFileSync(path.join(root, 'dados.json'), 'utf8'));
const porId = Object.fromEntries(dados.map(c => [c.id, c]));
const filtro = process.argv[2];
fs.mkdirSync(path.join(root, 'build'), { recursive: true });
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
let problemas = 0;
for (const bruto of dados) {
  if (filtro && bruto.id !== filtro) continue;
  const c = bruto.de ? { ...porId[bruto.de], ...bruto } : bruto;
  const { html, largura, altura, avisos } = renderPeca(c);
  const htmlPath = path.join(root, 'build', `${c.id}.html`);
  fs.writeFileSync(htmlPath, html);
  const page = await browser.newPage({ viewport: { width: largura, height: altura } });
  await page.goto('file://' + htmlPath);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  avisos.push(...await page.evaluate(([w, h]) => {
    const out = [], a = document.querySelector('[data-area]');
    if (!a) return out;
    const r = a.getBoundingClientRect();
    if (r.top < 0 || r.bottom > h) out.push('o texto sai do slide (encurte)');
    if (a.scrollHeight > a.clientHeight + 2 && a.style.bottom) out.push('o texto não cabe na área (encurte)');
    const tw = document.createTreeWalker(a, NodeFilter.SHOW_TEXT); let no;
    while ((no = tw.nextNode())) { const g = document.createRange(); g.selectNodeContents(no); if ([...g.getClientRects()].some(q => q.right > w - 12 || q.left < 12)) { out.push('linha de texto encostando na borda'); break; } }
    return out;
  }, [largura, altura]));
  const outDir = path.join(root, 'saida', c.id);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  await page.screenshot({ path: path.join(outDir, '1.png') });
  fs.copyFileSync(path.join(outDir, '1.png'), path.join(outDir, 'painel.png'));
  const p2 = await browser.newPage({ viewport: { width: largura, height: altura }, deviceScaleFactor: 2 });
  await p2.goto('file://' + htmlPath); await p2.evaluate(() => document.fonts.ready); await p2.waitForTimeout(300);
  await p2.screenshot({ path: path.join(outDir, '1@2x.png') }); await p2.close();
  await page.close();
  console.log(avisos.length ? '!' : '✓', c.id, `(${largura}×${altura})`);
  avisos.forEach(a => console.log('   ', a));
  if (avisos.length) problemas++;
}
await browser.close();
if (problemas) process.exitCode = 1;

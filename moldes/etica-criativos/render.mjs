// Uso: node render.mjs [id]  -> saida/<id>/1.png (1080×1350 no feed, 1080×1920 nos stories) e painel.png.
// Um post com "de": "<id>" herda os campos daquele post (o mesmo criativo em outro formato).
// Avisa se o texto sair do slide ou passar da largura, ou se uma foto de fotos/ faltar.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { renderCriativo } from './template.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const dados = JSON.parse(fs.readFileSync(path.join(root, 'dados.json'), 'utf8'));
const porId = Object.fromEntries(dados.map(c => [c.id, c]));
const filtro = process.argv[2];
fs.mkdirSync(path.join(root, 'build'), { recursive: true });
const pasta = path.join(root, 'fotos'), _fotos = {};
if (fs.existsSync(pasta)) for (const f of fs.readdirSync(pasta)) _fotos[f] = 'file://' + path.join(pasta, f);

const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
let problemas = 0;
for (const bruto of dados) {
  if (filtro && bruto.id !== filtro) continue;
  const c = bruto.de ? { ...porId[bruto.de], ...bruto } : bruto;
  const { html, largura, altura, avisos } = renderCriativo({ ...c, _fotos });
  for (const k of ['foto', 'avatar']) if (c[k] && !_fotos[c[k]]) avisos.push(`foto não encontrada: fotos/${c[k]}`);
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
    while ((no = tw.nextNode())) { const g = document.createRange(); g.selectNodeContents(no); if ([...g.getClientRects()].some(q => q.right > w - 40 || q.left < 40)) { out.push('linha de texto encostando na borda'); break; } }
    return out;
  }, [largura, altura]));
  const outDir = path.join(root, 'saida', c.id);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  await page.screenshot({ path: path.join(outDir, '1.png') });
  fs.copyFileSync(path.join(outDir, '1.png'), path.join(outDir, 'painel.png'));
  await page.close();
  console.log(avisos.length ? '!' : '✓', c.id, `(${largura}×${altura})`);
  avisos.forEach(a => console.log('   ', a));
  if (avisos.length) problemas++;
}
await browser.close();
if (problemas) process.exitCode = 1;

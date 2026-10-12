// Render comum dos moldes renato-*: para cada post do dados.json, slides(post) devolve
// { w, h, slides: [html, ...] }; cada slide vira saida/<id>/<n>.png e o conjunto, painel.png.
// Avisa quando um texto passa da área ([data-cabe]). Uso: node render.mjs [id ...]
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { HEAD, SIMB } from './brasa.mjs';
const { chromium } = createRequire(path.join(path.dirname(new URL(import.meta.url).pathname), '../treino-de-pecas/package.json'))('playwright');

export async function renderMolde(root, slides) {
  if (!SIMB) console.log('! sem moldes/renato-comum/assets/simbolo.png: rode preparar_simbolo.py com o símbolo');
  const dados = JSON.parse(fs.readFileSync(path.join(root, 'dados.json'), 'utf8'));
  const filtro = process.argv.slice(2);
  const launch = {};
  if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
  if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
  const browser = await chromium.launch(launch);
  let erros = 0;
  for (const c of dados) {
    if (filtro.length && !filtro.includes(c.id)) continue;
    const { w, h, slides: ss } = slides(c);
    const n = ss.length;
    const html = `<!doctype html><html><head>${HEAD}</head><body><div style="display:flex;width:${w * n}px">${ss.map((s, i) => `<div id="s${i + 1}" style="position:relative;width:${w}px;height:${h}px;overflow:hidden;flex:none">${s}</div>`).join('')}</div></body></html>`;
    fs.mkdirSync(path.join(root, 'build'), { recursive: true });
    const arq = path.join(root, 'build', c.id + '.html');
    fs.writeFileSync(arq, html);
    const page = await browser.newPage({ viewport: { width: w * n, height: h } });
    await page.goto('file://' + arq);
    await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(300);
    const avisos = await page.evaluate(() => [...document.querySelectorAll('[data-cabe]')].filter(e => e.scrollHeight > e.clientHeight + 2 || e.scrollWidth > e.clientWidth + 2).map(e => `slide ${e.closest('[id^=s]').id.slice(1)}: texto passa da área`));
    const out = path.join(root, 'saida', c.id);
    fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
    for (let i = 0; i < n; i++) await page.screenshot({ path: path.join(out, `${i + 1}.png`), clip: { x: i * w, y: 0, width: w, height: h } });
    await page.screenshot({ path: path.join(out, 'painel.png'), clip: { x: 0, y: 0, width: w * n, height: h } });
    await page.close();
    console.log(avisos.length ? '!' : '✓', c.id, `(${n} ${n === 1 ? 'peça' : 'slides'}, ${w}×${h})`);
    avisos.forEach(a => console.log('   ', a));
    if (avisos.length) erros++;
  }
  await browser.close();
  if (erros) process.exitCode = 1;
}

// Gera os slides de cada post do dados.json: saida/<id>/1.png, 2.png… e painel.png (os 3 primeiros lado a lado).
// Uso: node render.mjs [id]. Nuvem: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { renderCarrossel, W, H } from './template.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const dados = JSON.parse(fs.readFileSync(path.join(root, 'dados.json'), 'utf8')).filter(c => !process.argv[2] || c.id === process.argv[2]);
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
fs.mkdirSync(path.join(root, 'build'), { recursive: true });
for (const c of dados) {
  const { html, avisos, n } = renderCarrossel(c);
  const f = path.join(root, 'build', `${c.id}.html`);
  fs.writeFileSync(f, html);
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.goto('file://' + f);
  await page.waitForFunction(() => window.__pronto === true, null, { timeout: 30000 });
  await page.waitForTimeout(300);
  avisos.push(...await page.evaluate(() => window.__avisos || []));
  const out = path.join(root, 'saida', c.id);
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  const secoes = await page.$$('section');
  for (let i = 0; i < secoes.length; i++) await secoes[i].screenshot({ path: path.join(out, `${i + 1}.png`) });
  await page.close();
  if (n > 1) {
    const k = Math.min(3, n);
    const pn = await browser.newPage({ viewport: { width: W * k, height: H } });
    await pn.setContent(`<body style="margin:0;display:flex">${Array.from({ length: k }, (_, i) => `<img src="data:image/png;base64,${fs.readFileSync(path.join(out, `${i + 1}.png`)).toString('base64')}">`).join('')}</body>`);
    await pn.screenshot({ path: path.join(out, 'painel.png') }); await pn.close();
  }
  console.log(avisos.length ? '!' : '✓', c.id, `(${n} slide${n > 1 ? 's' : ''})`);
  avisos.forEach(a => console.log('   ', a));
  if (avisos.length) process.exitCode = 1;
}
await browser.close();

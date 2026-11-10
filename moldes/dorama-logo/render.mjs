// Uso: node render.mjs [id ...]  (no ambiente em nuvem: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs)
// Gera saida/<id>/1.png (prancha) e saida/<id>/avatar.png (1080×1080, para a foto de perfil).
import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { renderMolde } from '../dorama-comum/render-base.mjs';
import { HEAD } from '../dorama-comum/identidade.mjs';
import { slides, avatarSolo } from './template.mjs';
const root = path.dirname(new URL(import.meta.url).pathname);
await renderMolde(root, slides);
const { chromium } = createRequire(path.join(root, '../treino-de-pecas/package.json'))('playwright');
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
const filtro = process.argv.slice(2);
for (const c of JSON.parse(fs.readFileSync(path.join(root, 'dados.json'), 'utf8'))) {
  if (filtro.length && !filtro.includes(c.id)) continue;
  const arq = path.join(root, 'build', c.id + '-avatar.html');
  fs.writeFileSync(arq, `<!doctype html><html><head>${HEAD}</head><body><div style="position:relative;width:1080px;height:1080px">${avatarSolo(c)}</div></body></html>`);
  const page = await browser.newPage({ viewport: { width: 1080, height: 1080 } });
  await page.goto('file://' + arq); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(root, 'saida', c.id, 'avatar.png') });
  await page.close();
}
await browser.close();

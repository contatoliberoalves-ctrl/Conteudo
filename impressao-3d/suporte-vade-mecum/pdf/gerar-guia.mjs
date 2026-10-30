// Gera ../suporte-vade-mecum.pdf a partir de guia.html (rode antes: python3 imagens.py).
// Nuvem: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node gerar-pdf.mjs
import { chromium } from 'playwright';
import path from 'node:path';
const dir = path.dirname(new URL(import.meta.url).pathname);
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const b = await chromium.launch(launch);
const p = await b.newPage();
await p.goto('file://' + path.join(dir, 'guia.html'), { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.pdf({ path: path.join(dir, '..', 'guia-producao.pdf'), format: 'A4', printBackground: true });
await b.close();

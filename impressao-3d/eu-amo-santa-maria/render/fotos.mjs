// Imagem da placa montada. Antes, sirva a pasta da placa: python3 -m http.server 8766 (na pasta eu-amo-santa-maria)
// Nuvem: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render/fotos.mjs
import { chromium } from 'playwright';
import path from 'node:path';
const dir = path.dirname(new URL(import.meta.url).pathname);
const launch = { args: ['--use-gl=angle', '--use-angle=swiftshader', '--ignore-gpu-blocklist'] };
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) { launch.proxy = { server: process.env.RENDER_PROXY, bypass: 'localhost,127.0.0.1' }; launch.args.push('--ignore-certificate-errors'); }
const b = await chromium.launch(launch);
const p = await b.newPage({ viewport: { width: 1800, height: 900 } });
p.on('pageerror', e => console.log(e.message));
await p.goto('http://localhost:8766/render/cena.html');
await p.waitForFunction(() => window.__pronto === true, null, { timeout: 120000 });
await p.locator('canvas').screenshot({ path: path.join(dir, 'placa.png'), omitBackground: true });
await b.close();
console.log('ok');

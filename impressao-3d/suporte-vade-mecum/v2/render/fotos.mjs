// Imagens do suporte v2. Antes, sirva a pasta v2: python3 -m http.server 8768 (dentro de v2)
// Nuvem: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render/fotos.mjs
import { chromium } from 'playwright';
import path from 'node:path';
const dir = path.dirname(new URL(import.meta.url).pathname);
const launch = { args: ['--use-gl=angle', '--use-angle=swiftshader', '--ignore-gpu-blocklist'] };
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) { launch.proxy = { server: process.env.RENDER_PROXY, bypass: 'localhost,127.0.0.1' }; launch.args.push('--ignore-certificate-errors'); }
const b = await chromium.launch(launch);
const fotos = [['v2-com-livro', 'vista=frente&livro=1'], ['v2-vazio', 'vista=frente'], ['v2-tras', 'vista=tras'], ['v2-lado', 'vista=lado&livro=1']];
for (const [nome, qs] of fotos) {
  const p = await b.newPage({ viewport: { width: 1600, height: 1200 } });
  p.on('pageerror', e => console.log(nome, e.message));
  await p.goto(`http://localhost:8768/render/cena.html?${qs}`);
  await p.waitForFunction(() => window.__pronto === true, null, { timeout: 120000 });
  await p.locator('canvas').screenshot({ path: path.join(dir, nome + '.png'), omitBackground: true });
  await p.close(); console.log('ok', nome);
}
await b.close();

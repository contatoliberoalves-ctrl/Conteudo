// Gera as imagens do suporte montado (three.js). Serve a pasta leve/ por http antes:
//   python3 -m http.server 8765 -d ..   (em outro terminal)
// Nuvem: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node fotos.mjs
import { chromium } from 'playwright';
import path from 'node:path';
const dir = path.dirname(new URL(import.meta.url).pathname);
const launch = { args: ['--use-gl=angle', '--use-angle=swiftshader', '--ignore-gpu-blocklist'] };
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) { launch.proxy = { server: process.env.RENDER_PROXY, bypass: 'localhost,127.0.0.1' }; launch.args.push('--ignore-certificate-errors'); }
const b = await chromium.launch(launch);
const fotos = process.argv.slice(2).length ? process.argv.slice(2) : ['suporte:vista=frente', 'com-livro:vista=livro&livro=1', 'lado:vista=lado'];
for (const f of fotos) {
  const [nome, qs] = f.split(':');
  const p = await b.newPage({ viewport: { width: 1600, height: 1200 } });
  p.on('console', m => m.type() === 'error' && console.log(nome, m.text()));
  p.on('pageerror', e => console.log(nome, e.message));
  await p.goto(`http://localhost:8765/render/cena.html?${qs}`);
  await p.waitForFunction(() => window.__pronto === true, null, { timeout: 120000 });
  await p.locator('canvas').screenshot({ path: path.join(dir, nome + '.png'), omitBackground: true });
  await p.close();
  console.log('ok', nome);
}
await b.close();

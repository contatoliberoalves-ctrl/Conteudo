// Uso: node render.mjs            -> gera todos os carrosséis de dados.json
//      node render.mjs habeas-data -> gera só um (pelo "id")
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { renderCarrossel } from './template.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const dados = JSON.parse(fs.readFileSync(path.join(root, 'dados.json'), 'utf8'));
const filtro = process.argv[2];
const buildDir = path.join(root, 'build');
fs.mkdirSync(buildDir, { recursive: true });

// Opcional: CHROMIUM_PATH (navegador já instalado) e RENDER_PROXY (proxy para baixar as fontes).
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
// Fotos com margem (editor de capa / fotoAjuste): fotos/fontes.json + fotos/fontes/<foto>.
const fontesArq = path.join(root, 'fotos', 'fontes.json');
const fontes = fs.existsSync(fontesArq) ? JSON.parse(fs.readFileSync(fontesArq, 'utf8')) : {};
const fonteDe = foto => { const k = path.parse(foto).name; return fontes[k] && { ...fontes[k], src: '../fotos/fontes/' + path.basename(foto) }; };
const browser = await chromium.launch(launch);
const page = await browser.newPage({ viewport: { width: 3240, height: 1350 } });

for (const c of dados) {
  if (filtro && c.id !== filtro) continue;
  const foto = path.isAbsolute(c.foto) ? c.foto : '../fotos/' + c.foto;
  const htmlPath = path.join(buildDir, `${c.id}.html`);
  fs.writeFileSync(htmlPath, renderCarrossel({ ...c, foto, _fonte: fonteDe(c.foto) }));
  await page.goto('file://' + htmlPath);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const outDir = path.join(root, 'saida', c.id);
  fs.mkdirSync(outDir, { recursive: true });
  for (let i = 0; i < 3; i++) {
    await page.screenshot({ path: path.join(outDir, `${i + 1}.png`), clip: { x: i * 1080, y: 0, width: 1080, height: 1350 } });
  }
  await page.screenshot({ path: path.join(outDir, 'painel.png') });

  // Camada de texto da capa (foto escondida, fundo transparente) para o editor de capa da galeria.
  await page.evaluate(() => {
    document.getElementById('painel').style.background = 'transparent';
    const s1 = document.getElementById('slide-1');
    s1.style.background = 'transparent';
    s1.querySelectorAll('[data-foto]').forEach(e => { e.style.visibility = 'hidden'; });
  });
  await page.screenshot({ path: path.join(outDir, 'capa-camada.png'), clip: { x: 0, y: 0, width: 1080, height: 1350 }, omitBackground: true });
  console.log('✓', c.id);
}
await browser.close();

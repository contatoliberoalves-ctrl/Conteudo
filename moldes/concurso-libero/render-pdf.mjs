// Gera os PDFs A4 de pdf.json: saida/<id>/<id>.pdf, 1.png … N.png (1080 px de largura) e painel.png.
// Também lê kits/<kit>/*.json (um PDF por arquivo). Uso: node render-pdf.mjs [id | kit]. Nuvem: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render-pdf.mjs
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { renderPdf, W, H } from './pdf.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const kits = fs.existsSync(path.join(root, 'kits')) ? fs.readdirSync(path.join(root, 'kits')).filter(k => fs.statSync(path.join(root, 'kits', k)).isDirectory()).flatMap(k => fs.readdirSync(path.join(root, 'kits', k)).filter(f => f.endsWith('.json')).sort().map(f => ({ ...JSON.parse(fs.readFileSync(path.join(root, 'kits', k, f), 'utf8')), kit: k }))) : [];
const alvo = process.argv[2];
const dados = [...JSON.parse(fs.readFileSync(path.join(root, 'pdf.json'), 'utf8')), ...kits].filter(c => !alvo || c.id === alvo || c.kit === alvo);
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
fs.mkdirSync(path.join(root, 'build'), { recursive: true });
const escala = 1080 / W;
for (const c of dados) {
  const f = path.join(root, 'build', `${c.id}.html`);
  fs.writeFileSync(f, renderPdf(c).html);
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: escala });
  await page.goto('file://' + f);
  await page.waitForFunction(() => window.__pronto === true, null, { timeout: 30000 });
  await page.waitForTimeout(300);
  const avisos = await page.evaluate(() => window.__avisos || []);
  const out = path.join(root, 'saida', c.id);
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  const secoes = await page.$$('section.pagina');
  for (let i = 0; i < secoes.length; i++) await secoes[i].screenshot({ path: path.join(out, `${i + 1}.png`) });
  await page.pdf({ path: path.join(out, `${c.id}.pdf`), width: '210mm', height: '297mm', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await page.close();
  const k = Math.min(3, secoes.length), w = Math.round(W * escala), hh = Math.round(H * escala);
  const pn = await browser.newPage({ viewport: { width: w * k, height: hh } });
  await pn.setContent(`<body style="margin:0;display:flex">${Array.from({ length: k }, (_, i) => `<img style="width:${w}px" src="data:image/png;base64,${fs.readFileSync(path.join(out, `${i + 1}.png`)).toString('base64')}">`).join('')}</body>`);
  await pn.screenshot({ path: path.join(out, 'painel.png') }); await pn.close();
  console.log(avisos.length ? '!' : '✓', c.id, `(${secoes.length} páginas A4 + PDF)`);
  avisos.forEach(a => console.log('   ', a));
  if (avisos.length) process.exitCode = 1;
}
await browser.close();

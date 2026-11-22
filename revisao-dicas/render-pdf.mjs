// Gera os PDFs A4 de um produto em saida/<id>/: as dicas (Parte 1 e, se houver, Parte 2) e os cadernos
// (produtos.json > cadernos), com PNGs das páginas pedidas e a página de cada marco (marcos.json).
// Uso: node render-pdf.mjs <id> [1|2|<nome do caderno>] [--png=1,3,50]
// Nuvem: ln -sfn /opt/node-tools/node_modules node_modules && CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render-pdf.mjs tce-ma
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { renderPdf, renderCaderno, W, H } from './pdf.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const [id, so] = process.argv.slice(2).filter(a => !a.startsWith('--'));
const png = (process.argv.find(a => a.startsWith('--png=')) || '').slice(6).split(',').filter(Boolean).map(Number);
const prod = JSON.parse(fs.readFileSync(path.join(root, 'produtos.json'), 'utf8')).find(p => p.id === id);
if (!prod) throw new Error('produto não encontrado em produtos.json: ' + id);
const ler = f => JSON.parse(fs.readFileSync(path.join(root, 'conteudo', f), 'utf8'));
const conteudo = ler(`${id}.json`);
const fx = path.join(root, 'conteudo', `${id}-explicadas.json`);
const expl = fs.existsSync(fx) ? ler(`${id}-explicadas.json`) : {};

const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
fs.mkdirSync(path.join(root, 'build'), { recursive: true });
const out = path.join(root, 'saida', id);
fs.mkdirSync(out, { recursive: true });

async function gerar(nome, arquivo, html, salvar = true) {
  const f = path.join(root, 'build', `${arquivo}.html`);
  fs.writeFileSync(f, html);
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  await page.goto('file://' + f);
  await page.waitForFunction(() => window.__pronto === true, null, { timeout: 120000 });
  await page.waitForTimeout(400);
  const { avisos, marcos, n } = await page.evaluate(() => ({ avisos: window.__avisos, marcos: window.__marcos, n: document.querySelectorAll('.pagina').length }));
  if (salvar) {
    const dir = path.join(out, nome);
    fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
    const secoes = await page.$$('section.pagina');
    for (const i of (png.length ? png : [1, 2, 3, 4])) if (secoes[i - 1]) await secoes[i - 1].screenshot({ path: path.join(dir, `${i}.png`) });
    await page.pdf({ path: path.join(out, `${arquivo}.pdf`), width: '210mm', height: '297mm', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
    fs.writeFileSync(path.join(dir, 'marcos.json'), JSON.stringify({ paginas: n, marcos }, null, 1));
    console.log(avisos.length ? '!' : '✓', arquivo, `(${n} páginas)`);
    avisos.forEach(a => console.log('   ', a));
    if (avisos.length) process.exitCode = 1;
  }
  await page.close();
  return Object.fromEntries(marcos);
}

for (const parte of [1, 2].filter(p => prod[`parte${p}`] && (!so || so === String(p)))) {
  if (parte === 2 && Object.keys(expl).length < prod.total) console.log(`! Parte 2: só ${Object.keys(expl).length} de ${prod.total} dicas têm explicação`);
  await gerar(`parte${parte}`, prod[`parte${parte}`].arquivo, renderPdf(prod, conteudo, parte, expl).html);
}
for (const cad of (prod.cadernos || []).filter(c => !so || so === c.nome)) {
  const blocos = ler(`${id}-${cad.nome}.json`);
  const paginas = await gerar(cad.nome, cad.arquivo, renderCaderno(prod, cad, blocos).html, false);   // 1ª passada: páginas do sumário
  await gerar(cad.nome, cad.arquivo, renderCaderno(prod, cad, blocos, paginas).html);
}
await browser.close();

// Uso: node render.mjs          -> gera todos os carrosséis de dados.json
//      node render.mjs <id>     -> gera só um (pelo "id")
// Saída: saida/<id>/1.png (capa), 2.png (enunciado), painel.png (os dois lado a lado) e gabarito.txt.
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
const browser = await chromium.launch(launch);

let problemas = 0;
for (const c of dados) {
  if (filtro && c.id !== filtro) continue;
  const { html, total } = renderCarrossel(c);
  const htmlPath = path.join(buildDir, `${c.id}.html`);
  fs.writeFileSync(htmlPath, html);
  const page = await browser.newPage({ viewport: { width: total * 1080, height: 1350 } });
  await page.goto('file://' + htmlPath);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);

  // Enunciado: reduz a fonte de 0,5 em 0,5 px até caber (mínimo 18px no Treino e 30px no Autoral).
  const minimo = c.tipo === 'autoral' ? 30 : 18;
  const avisos = await page.evaluate(minimo => {
    const out = [];
    const s2 = document.getElementById('slide-2');
    const coluna = s2.lastElementChild;
    const texto = s2.querySelector('[data-texto]');
    let px = parseFloat(texto.style.fontSize);
    while (coluna.scrollHeight > coluna.clientHeight && px > minimo) { px -= 0.5; texto.style.fontSize = px + 'px'; }
    if (coluna.scrollHeight > coluna.clientHeight) out.push(`slide 2: o enunciado não cabe nem com ${minimo}px (passa ${coluna.scrollHeight - coluna.clientHeight}px)`);
    else if (px < parseFloat(texto.dataset.base || px)) out.push(`slide 2: fonte reduzida para ${px}px`);
    texto.dataset.final = px;
    // Capa: título não pode passar da largura
    const t = document.querySelector('#slide-1 [data-titulo]');
    if (t && t.scrollWidth > t.clientWidth + 2) out.push(`slide 1: título passa ${t.scrollWidth - t.clientWidth}px da largura`);
    return out;
  }, minimo);
  const fonte = await page.evaluate(() => document.querySelector('#slide-2 [data-texto]').dataset.final);

  const outDir = path.join(root, 'saida', c.id);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  for (let i = 0; i < total; i++) {
    await page.screenshot({ path: path.join(outDir, `${i + 1}.png`), clip: { x: i * 1080, y: 0, width: 1080, height: 1350 } });
  }
  await page.screenshot({ path: path.join(outDir, 'painel.png'), clip: { x: 0, y: 0, width: total * 1080, height: 1350 } });
  if (c.gabarito) fs.writeFileSync(path.join(outDir, 'gabarito.txt'), c.gabarito + '\n');
  await page.close();
  const erro = avisos.some(a => a.includes('não cabe') || a.includes('passa'));
  console.log(erro ? '!' : '✓', c.id, `(${c.tipo || 'treino'}, capa ${c.capa || 'A'}, enunciado em ${fonte}px)`);
  avisos.filter(a => !a.startsWith('slide 2: fonte')).forEach(a => console.log('   ', a));
  if (erro) problemas++;
}
await browser.close();
if (problemas) process.exitCode = 1;

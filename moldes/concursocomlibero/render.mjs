// Uso: node render.mjs          -> gera todos os posts de dados.json
//      node render.mjs <id>     -> gera só um (pelo "id")
// Saída: saida/<id>/1.png … N.png (1080×1350) e painel.png (até 3 slides, para a galeria).
// Ajusta: diminui título e corpo até caberem na área (top 170 / bottom 180) e avisa se ainda assim
// o texto não couber, se houver travessão ou três fundos iguais seguidos.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { renderCarrossel } from './template.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const dados = JSON.parse(fs.readFileSync(path.join(root, 'dados.json'), 'utf8'));
const filtro = process.argv[2];
const buildDir = path.join(root, 'build');
fs.mkdirSync(buildDir, { recursive: true });

// Fotos do autor: fotos/ deste molde; se não houver, as dos outros moldes do mesmo autor.
const pastasFoto = ['fotos', '../carrossel-explicativo/fotos', '../estrutura-de-pecas/fotos'].map(p => path.join(root, p));
const acharFoto = nome => pastasFoto.map(p => path.join(p, nome)).find(f => fs.existsSync(f));

const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);

let problemas = 0;
for (const c of dados) {
  if (filtro && c.id !== filtro) continue;
  const fotos = {}, faltando = [];
  for (const s of c.slides) for (const nome of [s.foto, s.imagem, ...(s.imagens || [])]) if (nome) { const f = acharFoto(nome); if (f) fotos[nome] = 'file://' + f; else faltando.push(nome); }
  const { html, total, avisos } = renderCarrossel({ ...c, _fotos: fotos });
  faltando.forEach(f => avisos.push(`foto não encontrada: ${f} (coloque em fotos/); o slide sai sem ela`));
  const htmlPath = path.join(buildDir, `${c.id}.html`);
  fs.writeFileSync(htmlPath, html);
  const page = await browser.newPage({ viewport: { width: total * 1080, height: 1350 } });
  await page.goto('file://' + htmlPath);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);

  const checagem = await page.evaluate(() => {
    const out = [];
    const estoura = a => {
      if (a.scrollHeight > a.clientHeight + 2) return true;
      const r = a.getBoundingClientRect(), w = document.createTreeWalker(a, NodeFilter.SHOW_TEXT);
      let no;
      while ((no = w.nextNode())) {
        const g = document.createRange(); g.selectNodeContents(no);
        if ([...g.getClientRects()].some(q => q.right > r.right + 2 || q.left < r.left - 2)) return true;
      }
      return false;
    };
    document.querySelectorAll('[id^="slide-"]').forEach((s, i) => {
      const a = s.querySelector('[data-area]');
      if (!a) return;
      // 1º os títulos (até 70%), depois o corpo (até 28px).
      const ts = [...a.querySelectorAll('[data-titulo]')], corpo = [...a.querySelectorAll('[data-corpo]')];
      const base = ts.map(t => parseFloat(getComputedStyle(t).fontSize));
      for (let k = 1; estoura(a) && k <= 30; k++) ts.forEach((t, j) => { t.style.fontSize = base[j] * (1 - k * 0.01) + 'px'; });
      const cb = corpo.map(e => parseFloat(getComputedStyle(e).fontSize));
      for (let k = 1; estoura(a) && k <= 12; k++) corpo.forEach((e, j) => { e.style.fontSize = Math.max(28, cb[j] - k) + 'px'; });
      if (estoura(a)) out.push(`slide ${i + 1}: o texto não cabe (encurte ou divida o slide)`);
    });
    return out;
  });
  const todos = [...avisos, ...checagem];

  const outDir = path.join(root, 'saida', c.id);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  for (let i = 0; i < total; i++) {
    await page.screenshot({ path: path.join(outDir, `${i + 1}.png`), clip: { x: i * 1080, y: 0, width: 1080, height: 1350 } });
  }
  await page.screenshot({ path: path.join(outDir, 'painel.png'), clip: { x: 0, y: 0, width: Math.min(total, 3) * 1080, height: 1350 } });
  await page.close();
  console.log(todos.length ? '!' : '✓', c.id, `(${total} slide${total > 1 ? 's' : ''})`);
  todos.forEach(a => console.log('   ', a));
  if (todos.length) problemas++;
}
await browser.close();
if (problemas) process.exitCode = 1;

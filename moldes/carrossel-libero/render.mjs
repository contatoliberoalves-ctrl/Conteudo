// Uso: node render.mjs          -> gera todos os carrosséis de dados.json
//      node render.mjs <id>     -> gera só um (pelo "id")
// Saída: saida/<id>/1.png … N.png (1080×1350) e painel.png (3 primeiros slides, para a galeria).
// Ajusta: diminui título e corpo até caberem na área (top 150 / bottom 190). Avisa se o texto
// passar da área, encostar numa foto ou nos anéis, ou se houver três fundos iguais seguidos.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { renderCarrossel } from './template.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const dados = JSON.parse(fs.readFileSync(path.join(root, 'dados.json'), 'utf8'));
const filtro = process.argv[2];
const buildDir = path.join(root, 'build');
fs.mkdirSync(buildDir, { recursive: true });

// Fotos: fotos/ deste molde; se não houver, os recortes do Carrossel Explicativo (mesmo autor).
const pastasFoto = [path.join(root, 'fotos'), path.join(root, '..', 'carrossel-explicativo', 'fotos')];
const acharFoto = nome => pastasFoto.map(p => path.join(p, nome)).find(f => fs.existsSync(f));

const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);

let problemas = 0;
for (const c of dados) {
  if (filtro && c.id !== filtro) continue;
  const fotos = {}, faltando = [];
  for (const s of c.slides) if (s.foto) { const f = acharFoto(s.foto); if (f) fotos[s.foto] = 'file://' + f; else faltando.push(s.foto); }
  const { html, total, avisos } = renderCarrossel({ ...c, _fotos: fotos });
  faltando.forEach(f => avisos.push(`foto não encontrada: ${f} (coloque em fotos/)`));
  const htmlPath = path.join(buildDir, `${c.id}.html`);
  fs.writeFileSync(htmlPath, html);
  const page = await browser.newPage({ viewport: { width: total * 1080, height: 1350 } });
  await page.goto('file://' + htmlPath);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);

  const checagem = await page.evaluate(() => {
    const out = [];
    // Passa da área: altura (áreas de altura fixa) ou alguma linha de texto fora da largura.
    const estoura = a => {
      if (!a.hasAttribute('data-rosto') && a.scrollHeight > a.clientHeight + 2) return true;
      const r = a.getBoundingClientRect(), w = document.createTreeWalker(a, NodeFilter.SHOW_TEXT);
      let no;
      while ((no = w.nextNode())) {
        const g = document.createRange(); g.selectNodeContents(no);
        if ([...g.getClientRects()].some(q => q.right > r.right + 2 || q.left < r.left - 2)) return true;
      }
      return false;
    };
    document.querySelectorAll('[id^="slide-"]').forEach((s, i) => {
      const n = i + 1, a = s.querySelector('[data-area]');
      if (!a) return;
      const t = a.querySelector('[data-titulo]'), corpo = [...a.querySelectorAll('[data-corpo]')];
      // 1º o título (até 70% do tamanho), depois o corpo (até 32px).
      if (t) { const base = parseFloat(t.style.fontSize); let px = base; while (estoura(a) && px > base * 0.7) { px -= 4; t.style.fontSize = px + 'px'; } }
      let cp = corpo.length ? parseFloat(corpo[0].style.fontSize) : 0;
      while (estoura(a) && cp > 32) { cp -= 1; corpo.forEach(e => (e.style.fontSize = cp + 'px')); }
      if (estoura(a)) out.push(`slide ${n}: o texto não cabe (encurte ou divida o slide)`);
      // Texto (linha a linha) contra fotos e anéis, com 24px de folga, e contra o rodapé.
      const evitar = [...s.querySelectorAll('[data-foto]:not(img), [data-anel]')].map(e => e.getBoundingClientRect());
      const w = document.createTreeWalker(a, NodeFilter.SHOW_TEXT);
      let no, perto = 0, baixo = 0;
      while ((no = w.nextNode())) {
        if (!no.textContent.trim()) continue;
        const r = document.createRange(); r.selectNodeContents(no);
        for (const q of r.getClientRects()) {
          if (evitar.some(l => q.right > l.left - 24 && q.left < l.right + 24 && q.bottom > l.top - 24 && q.top < l.bottom + 24)) perto++;
          if (q.bottom > 1350 - 130) baixo++;
        }
      }
      if (perto) out.push(`slide ${n}: ${perto} linha(s) de texto encostando na foto ou nos anéis`);
      if (baixo) out.push(`slide ${n}: texto encostando no rodapé`);
      if (a.hasAttribute('data-rosto') && a.getBoundingClientRect().top < 560) out.push(`slide ${n}: o texto da capa sobe até o rosto (encurte o título)`);
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
  console.log(todos.length ? '!' : '✓', c.id, `(${total} slides)`);
  todos.forEach(a => console.log('   ', a));
  if (todos.length) problemas++;
}
await browser.close();
if (problemas) process.exitCode = 1;

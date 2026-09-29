// Gerador comum dos moldes Libero Dossiê, Duelo e Requisitos.
// Cada molde chama gerar(import.meta.url, renderCarrossel). Saída: saida/<id>/1.png … N.png e painel.png.
// Elementos com data-fit encolhem a fonte até o conteúdo caber na própria caixa (mínimo em data-min);
// se ainda não couber, o render avisa. Também avisa 3 fundos iguais seguidos e fotos que faltam.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

export async function gerar(url, renderCarrossel) {
  const root = path.dirname(new URL(url).pathname);
  const comum = path.dirname(new URL(import.meta.url).pathname);
  const dados = JSON.parse(fs.readFileSync(path.join(root, 'dados.json'), 'utf8'));
  const filtro = process.argv[2];
  fs.mkdirSync(path.join(root, 'build'), { recursive: true });
  // Fotos do autor (fora do git): fotos/ do molde, do Carrossel Libero ou do Carrossel Explicativo.
  const pastas = ['fotos', '../carrossel-libero/fotos', '../carrossel-explicativo/fotos'].map(p => path.join(root, p));
  const faltando = new Set();
  const ctx = {
    asset: n => 'file://' + path.join(comum, 'assets', n),
    foto: n => { const f = pastas.map(p => path.join(p, n)).find(f => fs.existsSync(f)); if (!f) faltando.add(n); return f ? 'file://' + f : ''; },
  };

  const launch = {};
  if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
  if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
  const browser = await chromium.launch(launch);
  let problemas = 0;
  for (const c of dados) {
    if (filtro && c.id !== filtro) continue;
    faltando.clear();
    const { html, total, avisos = [] } = renderCarrossel(c, ctx);
    const temas = (c.slides || []).map(s => s.tema);
    temas.forEach((t, i) => { if (i > 1 && t && t === temas[i - 1] && t === temas[i - 2]) avisos.push(`slides ${i - 1} a ${i + 1} com o mesmo fundo (${t})`); });
    faltando.forEach(f => avisos.push(`foto não encontrada: ${f} (coloque em fotos/)`));
    const htmlPath = path.join(root, 'build', `${c.id}.html`);
    fs.writeFileSync(htmlPath, html);
    const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
    await page.goto('file://' + htmlPath);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    const checagem = await page.evaluate(() => {
      const out = [];
      // Folga de 18% da fonte: títulos com entrelinha < 1 transbordam um pouco a caixa sem cortar nada.
      const passa = el => { const f = parseFloat(getComputedStyle(el).fontSize) * .18 + 2; return el.scrollHeight > el.clientHeight + f || el.scrollWidth > el.clientWidth + 2; };
      document.querySelectorAll('[data-fit]').forEach(el => {
        const min = +(el.dataset.min || 22);
        let px = parseFloat(getComputedStyle(el).fontSize);
        while (passa(el) && px > min) { px -= 2; el.style.fontSize = px + 'px'; }
        if (passa(el)) out.push(`slide ${el.closest('section').id.split('-')[1]}: texto não cabe em "${(el.dataset.fit || el.textContent).slice(0, 40)}" (encurte)`);
      });
      return out;
    });
    avisos.push(...checagem);
    const outDir = path.join(root, 'saida', c.id);
    fs.rmSync(outDir, { recursive: true, force: true });
    fs.mkdirSync(outDir, { recursive: true });
    const secoes = await page.$$('section');
    for (let i = 0; i < secoes.length; i++) await secoes[i].screenshot({ path: path.join(outDir, `${i + 1}.png`) });
    await page.close();
    // Painel da galeria: os 3 primeiros slides lado a lado.
    const n = Math.min(3, secoes.length);
    const painel = await browser.newPage({ viewport: { width: 1080 * n, height: 1350 } });
    // A página precisa ser um arquivo (file://): uma página em branco não pode carregar os PNGs do disco.
    const painelHtml = path.join(root, 'build', `${c.id}-painel.html`);
    fs.writeFileSync(painelHtml, `<body style="margin:0;display:flex">${Array.from({ length: n }, (_, i) => `<img src="file://${path.join(outDir, `${i + 1}.png`)}">`).join('')}</body>`);
    await painel.goto('file://' + painelHtml);
    await painel.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth));
    await painel.screenshot({ path: path.join(outDir, 'painel.png') });
    await painel.close();
    console.log(avisos.length ? '!' : '✓', c.id, `(${total ?? secoes.length} slides)`);
    avisos.forEach(a => console.log('   ', a));
    if (avisos.length) problemas++;
  }
  await browser.close();
  if (problemas) process.exitCode = 1;
}

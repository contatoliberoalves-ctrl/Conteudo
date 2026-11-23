// Capas de vídeo do YouTube (1280×720) na identidade do PodConst: azul, magenta, navy e amarelo, Bebas Neue,
// a dupla recortada (fotos/rec-dupla-0039.png, fora do git; recorte com ../carrossel-libero/recortar_pessoa.py)
// e o logo PODCONST. Uso: node capas-youtube.mjs  (nuvem: CHROMIUM_PATH=... RENDER_PROXY=$HTTPS_PROXY)
// Saída: saida/youtube/<id>.png e .jpg (JPG < 2 MB, como o YouTube pede).
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const root = path.dirname(new URL(import.meta.url).pathname);
const { chromium } = createRequire(path.join(root, '../treino-de-pecas/package.json'))('playwright');

const AMAR = '#f7f400', ROSA = '#e224d6', TINTA = '#0b1a4a';
const FUNDO = {
  azul: 'radial-gradient(120% 120% at 15% 0%,#0d44bd 0%,#0a3aa6 40%,#0a2a7c 100%)',
  magenta: 'radial-gradient(120% 120% at 20% 10%,#ea2ee0 0%,#d61ccf 55%,#c515c2 100%)',
  navy: 'radial-gradient(120% 120% at 85% 0%,#132a7a 0%,#0a1440 70%)',
};
const img = arq => { const p = path.join(root, 'fotos', arq); return fs.existsSync(p) ? 'data:image/png;base64,' + fs.readFileSync(p).toString('base64') : ''; };
const logo = (px, cor = '#ff1ff0') => {
  const barras = [.16, .3, .44, .3, .18].map(h => `<span style="width:.05em;height:${h}em;border-radius:.03em;background:#fff"></span>`).join('');
  return `<div style="font-family:Unbounded,sans-serif;font-weight:900;font-size:${px}px;line-height:.84;letter-spacing:-.02em;color:${cor};text-shadow:.05em .06em 0 ${TINTA};display:inline-flex;flex-direction:column;transform:rotate(-9deg)">
    <div style="display:flex;align-items:center;margin-left:.62em"><span>P</span><span style="width:.72em;height:.72em;border-radius:50%;background:${cor};box-shadow:.05em .06em 0 ${TINTA};display:flex;align-items:center;justify-content:center;gap:.045em">${barras}</span><span>D</span></div><div>CONST</div></div>`;
};
const BB = "font-family:'Bebas Neue';line-height:.86;";

// Cada capa: { id, fundo, html(dupla) }
const CAPAS = [
  { id: 'correcao-oab47-v1', fundo: 'azul', html: d => `
    <img src="${d}" style="position:absolute;right:-70px;top:40px;height:1300px">
    <div style="position:absolute;left:56px;top:40px">${logo(44)}</div>
    <div style="position:absolute;left:56px;top:150px;width:640px">
      <div style="display:inline-block;background:${AMAR};color:${TINTA};${BB}font-size:58px;padding:10px 18px 2px;transform:rotate(-2deg)">O que ninguém te contou</div>
      <div style="${BB}font-size:150px;color:#fff;margin-top:22px;text-shadow:0 8px 0 rgba(0,0,0,.25)">A correção</div>
      <div style="display:inline-block;${BB}font-size:150px;color:#fff;background:${ROSA};padding:6px 22px 0;margin-top:8px">da OAB 47</div>
    </div>` },
  { id: 'correcao-oab47-v2', fundo: 'magenta', html: d => `
    <img src="${d}" style="position:absolute;left:-60px;top:40px;height:1300px">
    <div style="position:absolute;right:50px;top:40px">${logo(40, AMAR)}</div>
    <div style="position:absolute;right:50px;top:170px;width:560px;text-align:right">
      <div style="${BB}font-size:92px;color:#fff">O que ninguém</div>
      <div style="${BB}font-size:92px;color:#fff">te contou sobre a</div>
      <div style="display:inline-block;background:${AMAR};color:${TINTA};${BB}font-size:170px;padding:8px 22px 0;margin-top:14px;transform:rotate(-2deg)">correção</div>
      <div style="${BB}font-size:120px;color:#fff;margin-top:10px">da OAB 47</div>
    </div>` },
  { id: 'correcao-oab47-v3', fundo: 'navy', html: d => `
    <img src="${d}" style="position:absolute;right:-130px;top:40px;height:1300px">
    <div style="position:absolute;left:56px;top:40px">${logo(40)}</div>
    <div style="position:absolute;left:56px;top:150px;width:600px">
      <div style="${BB}font-size:190px;color:#fff">Correção</div>
      <div style="${BB}font-size:190px;color:${AMAR}">OAB 47</div>
      <div style="display:inline-block;margin-top:24px;border:10px solid #ff3b3b;outline:4px solid #ff3b3b;outline-offset:6px;border-radius:12px;color:#ff3b3b;${BB}font-size:52px;padding:10px 22px 0;transform:rotate(-6deg);background:rgba(10,20,64,.6)">O que ninguém te contou</div>
    </div>` },
];

const dupla = img('rec-dupla-0039.png');
if (!dupla) console.log('! sem fotos/rec-dupla-0039.png: a capa sai sem a dupla');
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
const out = path.join(root, 'saida', 'youtube');
fs.mkdirSync(out, { recursive: true });
const filtro = process.argv.slice(2);
for (const c of CAPAS) {
  if (filtro.length && !filtro.includes(c.id)) continue;
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Unbounded:wght@900&display=swap" rel="stylesheet"><style>*{margin:0;box-sizing:border-box}body{width:1280px;height:720px;overflow:hidden}</style></head>
    <body><div style="position:relative;width:1280px;height:720px;overflow:hidden;background:${FUNDO[c.fundo]}">${c.html(dupla)}</div></body></html>`);
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(out, c.id + '.png') });
  await page.screenshot({ path: path.join(out, c.id + '.jpg'), type: 'jpeg', quality: 90 });
  await page.close();
  console.log('✓', c.id);
}
await browser.close();

// Adesivos e etiquetas da Gran Doces (PNG sem fundo) para aplicar nas fotos de embalagem (montar_fotos.py).
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const root = path.dirname(new URL(import.meta.url).pathname);
const { chromium } = createRequire(path.join(root, '../../moldes/treino-de-pecas/package.json'))('playwright');
const OUT = path.join(root, 'build', 'adesivos'); fs.mkdirSync(OUT, { recursive: true });
const GAL = 'data:image/png;base64,' + fs.readFileSync(path.join(root, 'assets/galinha.png')).toString('base64');
const C = { azul: '#0A62E8', noite: '#0B2B6E', creme: '#FCEEDF', caramelo: '#B9762F', cacau: '#3B2418', vermelho: '#B5172E', verde: '#114E3B', ouro: '#E8CF95', ninho: '#F4F8FD' };
const gal = (cor, px) => `<span style="display:block;width:${px * .876}px;height:${px}px;background:${cor};-webkit-mask:url(${GAL}) center/contain no-repeat"></span>`;
const redondo = (bg, cor, linha1, nome, comGal) => `<div style="width:600px;height:600px;border-radius:50%;background:${bg};display:flex;align-items:center;justify-content:center;position:relative">
  <div style="position:absolute;inset:22px;border-radius:50%;border:5px solid ${cor};opacity:.9"></div><div style="position:absolute;inset:40px;border-radius:50%;border:2px dashed ${cor};opacity:.55"></div>
  <div style="display:flex;flex-direction:column;align-items:center;color:${cor};text-align:center">
    ${comGal ? gal(cor, 140) : ''}
    <div class="f" style="font-weight:900;font-size:${comGal ? 76 : 90}px;line-height:1;letter-spacing:-.03em;margin-top:${comGal ? 10 : 0}px">Gran Doces</div>
    <div style="font-weight:700;font-size:22px;letter-spacing:.38em;margin:12px -.38em 0 0">${linha1}</div>
    <div class="s" style="font-size:${nome.length > 11 ? 74 : 92}px;line-height:1.1;margin-top:6px">${nome}</div></div></div>`;
const topo = `<div style="display:flex;flex-direction:column;align-items:center">
  <div style="width:520px;height:250px;background:${C.vermelho};clip-path:polygon(0 0,100% 0,100% 100%,50% 82%,0 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;color:${C.ouro};padding-bottom:40px">
    <div class="f" style="font-weight:900;font-size:74px;letter-spacing:-.03em;color:${C.creme}">Gran Doces</div><div class="s" style="font-size:64px;line-height:1">Feliz Natal</div></div>
  <div style="width:12px;height:520px;background:linear-gradient(90deg,#d9b98a,#f3e2c4,#c49a63)"></div></div>`;
const A = {
  classico: redondo(C.vermelho, C.ouro, 'PANETONE', 'Clássico', true),
  gotas: redondo(C.verde, C.ouro, 'PANETONE', 'Gotas de chocolate', false),
  brownietone: redondo(C.azul, C.creme, 'O FAVORITO DA CASA', 'Brownietone', true),
  mini: redondo(C.creme, C.vermelho, 'MINI PANETONE', 'Feito à mão', true),
  tradicional: redondo(C.creme, C.caramelo, 'KIT BROWNIE', 'Tradicional', true),
  ninho: redondo(C.ninho, C.azul, 'KIT BROWNIE', 'Ninho', true),
  chocolate: redondo(C.cacau, C.ouro, 'KIT BROWNIE', 'Chocolate', true),
  topo,
};
const HEAD = `<meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,500..900,100&family=DM+Sans:wght@700&family=Pinyon+Script&display=swap" rel="stylesheet"><style>*{margin:0;box-sizing:border-box}body{background:transparent;font-family:'DM Sans'}.f{font-family:Fraunces;font-variation-settings:'SOFT' 100}.s{font-family:'Pinyon Script'}</style>`;
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const b = await chromium.launch(launch), page = await b.newPage({ viewport: { width: 900, height: 900 } });
for (const [n, h] of Object.entries(A)) {
  await page.setContent(`<!doctype html><html><head>${HEAD}</head><body><div id="a" style="display:inline-block">${h}</div></body></html>`);
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(300);
  await page.locator('#a').screenshot({ path: path.join(OUT, n + '.png'), omitBackground: true });
}
await b.close(); console.log('✓ adesivos');

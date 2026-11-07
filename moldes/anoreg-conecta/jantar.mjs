// Arte do jantar pós-evento do ANOREG Conecta no Bode do Nô (Petrolina), na identidade das cenas/posts do evento.
// Logo, símbolo e fotos do restaurante (bodedono.com.br/petrolina) e QR do mapa ficam em referencia/bode/ (fora do git).
// Uso: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node jantar.mjs → saida/jantar/{feed,story}.png
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

const root = path.dirname(new URL(import.meta.url).pathname);
const { chromium } = createRequire(path.join(root, '../treino-de-pecas/package.json'))('playwright');
const ref = (n, t) => `data:${t};base64,` + fs.readFileSync(path.join(root, 'referencia', 'bode', n)).toString('base64');
const LOGO = ref('Logotipo_Hor_Bege_1.png', 'image/png'), BODE = ref('_BODE_2_1.png', 'image/png'), QR = ref('qr-mapa.png', 'image/png');
const FOTO = ref('foto-do-local-de-cima1.webp', 'image/webp');
const LOCAL = { rua: 'Estrada da Tapera, km 3', bairro: 'Marina River · Petrolina (PE)', cep: 'CEP 56301-997', fone: '(87) 2019-0303' };

const OURO = 'linear-gradient(180deg,#F7C65A 0%,#E9A62C 100%)';
const css = `*{box-sizing:border-box;margin:0}
body{font-family:'Inter',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}
.c{position:relative;overflow:hidden;color:#fff;background:radial-gradient(120% 100% at 85% 10%,#0f4a63 0%,#0b2e4d 40%,#0a1d36 75%,#081629 100%)}
.abs{position:absolute}
.ondas{position:absolute;border-radius:50%;transform:translate(-50%,-50%);background:repeating-radial-gradient(circle,rgba(110,190,220,.17) 0 1.5px,transparent 1.5px 30px);-webkit-mask:radial-gradient(circle,#000 0%,#000 45%,transparent 70%)}
.rot{font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:#F2B544}
.tit{font-weight:800;letter-spacing:-.045em;line-height:.92}
.ouro{background:${OURO};-webkit-background-clip:text;background-clip:text;color:transparent;padding-top:.12em;line-height:1}
.pill{display:inline-flex;align-items:center;gap:12px;border:2px solid rgba(242,181,68,.6);background:rgba(10,29,54,.55);border-radius:999px;padding:14px 28px}
.card{border:1.5px solid rgba(255,255,255,.16);background:linear-gradient(180deg,rgba(23,63,92,.6),rgba(10,32,58,.6));border-radius:36px}
.marca{font-weight:800;letter-spacing:-.02em}.marca b{font-weight:400}`;
const marca = (px = 30) => `<span class="marca" style="font-size:${px}px">ANOREG <b>CON<span style="color:#F2B544">•</span>ECTA</b></span>`;
const ondas = (x, y, d) => `<div class="ondas" style="left:${x}px;top:${y}px;width:${d}px;height:${d}px"></div>`;

// cartão do local: símbolo do bode, logo, endereço e QR do mapa
const cartao = (w) => `<div class="card" style="width:${w}px;padding:40px 44px;display:flex;gap:36px;align-items:center">
  <div style="flex:1;min-width:0">
    <div style="display:flex;align-items:center;gap:22px"><img src="${BODE}" style="height:92px;margin:-10px -14px -10px -20px"><img src="${LOGO}" style="height:52px"></div>
    <div style="font-size:34px;font-weight:700;margin-top:28px">${LOCAL.rua}</div>
    <div style="font-size:27px;font-weight:400;margin-top:8px;opacity:.85">${LOCAL.bairro}</div>
    <div style="font-size:23px;font-weight:400;margin-top:16px;opacity:.65;letter-spacing:.02em">${LOCAL.cep} · ${LOCAL.fone}</div></div>
  <div style="text-align:center;flex:none"><div style="background:#fff;padding:14px;border-radius:16px"><img src="${QR}" style="width:150px;display:block"></div>
    <div class="rot" style="font-size:15px;margin-top:14px;letter-spacing:.2em">Abrir no mapa</div></div></div>`;

const feed = `<div class="c" style="width:1080px;height:1350px">${ondas(980, 1250, 1300)}
  <div class="abs" style="left:0;top:0;width:1080px;height:640px"><img src="${FOTO}" style="width:100%;height:100%;object-fit:cover;object-position:50% 62%;-webkit-mask:linear-gradient(180deg,#000 55%,transparent 100%)"></div>
  <div class="abs" style="left:0;top:0;width:1080px;height:640px;background:linear-gradient(180deg,rgba(8,22,41,.65) 0%,rgba(8,22,41,0) 28%,rgba(10,29,54,0) 55%,rgba(10,29,54,0) 100%)"></div>
  <div class="abs" style="left:72px;top:64px">${marca(30)}</div>
  <div class="abs" style="right:72px;top:52px"><span class="pill"><span class="rot" style="font-size:20px">Pós-evento</span></span></div>
  <div class="abs" style="left:72px;right:72px;top:560px">
    <div class="rot" style="font-size:24px">Jantar de integração</div>
    <div class="tit" style="font-size:118px;margin-top:20px">NOS VEMOS</div><div class="tit ouro" style="font-size:118px;margin-top:-2px">NO BODE DO NÔ</div></div>
  <div class="abs" style="left:72px;top:900px">${cartao(936)}</div>
  <div class="abs" style="left:72px;right:72px;bottom:56px;text-align:center;font-size:20px;font-weight:700;letter-spacing:.24em;color:#fff;opacity:.85">PETROLINA (PE) · À BEIRA DO VELHO CHICO</div></div>`;

const story = `<div class="c" style="width:1080px;height:1920px">${ondas(980, 1800, 1500)}${ondas(80, 900, 1000)}
  <div class="abs" style="left:0;top:0;width:1080px;height:960px"><img src="${FOTO}" style="width:100%;height:100%;object-fit:cover;object-position:50% 60%;-webkit-mask:linear-gradient(180deg,#000 55%,transparent 100%)"></div>
  <div class="abs" style="left:0;top:0;width:1080px;height:960px;background:linear-gradient(180deg,rgba(8,22,41,.7) 0%,rgba(8,22,41,0) 22%,rgba(10,29,54,0) 55%,rgba(10,29,54,0) 100%)"></div>
  <div class="abs" style="left:0;right:0;top:170px;text-align:center">${marca(36)}</div>
  <div class="abs" style="left:72px;right:72px;top:880px;text-align:center">
    <span class="pill"><span class="rot" style="font-size:22px">Jantar de integração · Pós-evento</span></span>
    <div class="tit" style="font-size:116px;margin-top:40px">NOS VEMOS</div><div class="tit ouro" style="font-size:116px;margin-top:-2px">NO BODE DO NÔ</div></div>
  <div class="abs" style="left:72px;top:1300px">${cartao(936)}</div>
  <div class="abs" style="left:0;right:0;bottom:150px;text-align:center;font-size:22px;font-weight:700;letter-spacing:.24em;opacity:.85">PETROLINA (PE) · À BEIRA DO VELHO CHICO</div></div>`;

const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
const out = path.join(root, 'saida', 'jantar'); fs.mkdirSync(out, { recursive: true });
for (const [nome, h, html] of [['feed', 1350, feed], ['story', 1920, story]]) {
  const page = await browser.newPage({ viewport: { width: 1080, height: h } });
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap" rel="stylesheet"><style>${css}</style></head><body>${html}</body></html>`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(out, nome + '.png') }); await page.close();
  console.log('✓', nome);
}
await browser.close();

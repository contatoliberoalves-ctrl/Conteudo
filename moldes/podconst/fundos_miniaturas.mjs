// Fundos de gravação (1920×1080) e miniaturas do YouTube (1280×720) das aulas PodConst e Método VDE.
// Uso: node fundos_miniaturas.mjs  ->  saida/fundos-miniaturas/*.png
// Nuvem: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node fundos_miniaturas.mjs
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const req = createRequire(import.meta.url);
let chromium; try { ({ chromium } = req('playwright')); } catch { ({ chromium } = createRequire('/opt/node-tools/node_modules/')('playwright')); }

const OUT = path.join(path.dirname(new URL(import.meta.url).pathname), 'saida', 'fundos-miniaturas');
const FONTES = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Grotesk:wght@400;500;700&family=Unbounded:wght@900&family=Poppins:wght@400;600;800;900&display=swap';
const C = { tinta: '#0b1a4a', amar: '#f7f400', rosa: '#e224d6', az: '#0a3aa6' };
const AZUL = 'radial-gradient(120% 120% at 15% 0%,#0d44bd 0%,#0a3aa6 40%,#0a2a7c 100%)';
const MAG = 'radial-gradient(120% 120% at 20% 10%,#ea2ee0 0%,#d61ccf 55%,#c515c2 100%)';
const NAVY = 'radial-gradient(120% 120% at 85% 0%,#132a7a 0%,#0a1440 70%)';
const VDE = 'linear-gradient(125deg,#2E0575 0%,#2a1593 45%,#1937B1 100%)';
const BB = "font-family:'Bebas Neue'";

const logo = (px, cor = '#ff1ff0') => `<div style="font-family:Unbounded;font-weight:900;font-size:${px}px;line-height:.84;letter-spacing:-.02em;color:${cor};text-shadow:.05em .06em 0 ${C.tinta};display:inline-flex;flex-direction:column;transform:rotate(-9deg)"><div style="display:flex;align-items:center;margin-left:.62em"><span>P</span><span style="width:.72em;height:.72em;border-radius:50%;background:${cor};box-shadow:.05em .06em 0 ${C.tinta};display:flex;align-items:center;justify-content:center;gap:.045em">${[.16, .3, .44, .3, .18].map(h => `<span style="width:.05em;height:${h}em;border-radius:.03em;background:#fff"></span>`).join('')}</span><span>D</span></div><div>CONST</div></div>`;
const arrobas = (px = 26) => `<div style="display:flex;flex-direction:column;gap:5px;font-family:'Space Grotesk';font-weight:700;font-size:${px}px;color:${C.tinta}"><div style="background:${C.amar};padding:2px 10px;align-self:flex-start">@LIBERO<span style="font-weight:400">FILHO</span></div><div style="background:${C.rosa};color:#fff;padding:2px 10px;align-self:flex-start;margin-left:60px">@NATALIA<span style="font-weight:400">VALENCA</span></div></div>`;
const anel = (x, y, d, cor, esp) => `<div style="position:absolute;left:${x}px;top:${y}px;width:${d}px;height:${d}px;border-radius:50%;border:${esp}px solid ${cor}"></div>`;

// ---------- fundos: desenho só nas bordas, miolo limpo ----------
function fundoPodconst(fundo, fantasma, tag, corAnel) {
  return `<div style="position:absolute;inset:0;background:${fundo}"></div>
  <div style="position:absolute;left:-40px;bottom:-150px;${BB};font-size:520px;line-height:1;color:transparent;-webkit-text-stroke:3px rgba(255,255,255,.10);white-space:nowrap">${fantasma}</div>
  ${anel(1640, -170, 460, corAnel, 34)}${anel(-210, 760, 420, 'rgba(255,255,255,.12)', 26)}
  <div style="position:absolute;left:56px;top:46px">${arrobas()}</div>
  <div style="position:absolute;right:70px;bottom:56px">${logo(54)}</div>
  <div style="position:absolute;left:60px;bottom:54px;font-family:'Space Grotesk';font-weight:700;font-size:24px;letter-spacing:.28em;color:rgba(255,255,255,.75)">${tag}</div>`;
}
function fundoVde(tag) {
  return `<div style="position:absolute;inset:0;background:${VDE}"></div>
  ${[0, 1, 2, 3, 4].map(i => anel(1500 - i * 60, -260 - i * 60, 640 + i * 120, 'rgba(201,184,255,.18)', 2)).join('')}
  ${[0, 1, 2].map(i => anel(-300 - i * 50, 720 - i * 50, 560 + i * 100, 'rgba(201,184,255,.14)', 2)).join('')}
  <div style="position:absolute;right:60px;bottom:-60px;font-family:Poppins;font-weight:900;font-size:300px;line-height:1;color:transparent;-webkit-text-stroke:2px rgba(201,184,255,.14)">VDE</div>
  <div style="position:absolute;left:60px;top:50px;font-family:Poppins;font-weight:800;font-size:28px;letter-spacing:.24em;color:#C9B8FF">MÉTODO VDE</div>
  <div style="position:absolute;left:60px;bottom:50px;font-family:Poppins;font-weight:600;font-size:24px;color:rgba(255,255,255,.8)">@nataliavalenca · @liberofilho</div>
  <div style="position:absolute;right:60px;top:52px;font-family:Poppins;font-weight:600;font-size:22px;letter-spacing:.2em;color:rgba(255,255,255,.7)">${tag}</div>`;
}

// ---------- miniaturas do YouTube (1280×720) ----------
const miniRepescagem = () => `<div style="position:absolute;inset:0;background:${AZUL}"></div>
  <div style="position:absolute;right:70px;top:70px;width:440px;height:580px;background:#fff;border-radius:16px;transform:rotate(6deg);box-shadow:0 30px 70px rgba(0,0,0,.5);padding:40px">
    <div style="font-family:'Space Grotesk';font-weight:700;font-size:20px;letter-spacing:.22em;color:${C.az}">2ª FASE · OAB</div>
    ${[90, 70, 84, 60, 78, 52].map(w => `<div style="height:16px;border-radius:8px;background:#e2e8f2;margin-top:26px;width:${w}%"></div>`).join('')}
    <div style="position:absolute;right:34px;bottom:44px;width:250px;height:250px;border-radius:50%;border:14px solid #e5484d;color:#e5484d;display:flex;flex-direction:column;align-items:center;justify-content:center;transform:rotate(-12deg);background:rgba(255,255,255,.9)"><div style="${BB};font-size:130px;line-height:.85">5,4</div><div style="font-family:'Space Grotesk';font-weight:700;font-size:22px;letter-spacing:.1em">FALTOU 0,6</div></div></div>
  <div style="position:absolute;left:60px;top:70px;width:720px">
    <div style="display:inline-block;background:${C.amar};color:${C.tinta};font-family:'Space Grotesk';font-weight:700;font-size:30px;padding:6px 16px">REPESCAGEM OAB</div>
    <div style="${BB};font-size:150px;line-height:.86;color:#fff;margin-top:20px;text-shadow:0 6px 0 rgba(0,0,0,.25)">ONDE VOCÊ<br>PERDEU OS</div>
    <div style="display:inline-block;background:${C.rosa};${BB};font-size:170px;line-height:.86;color:#fff;padding:10px 18px 0;margin-top:6px;transform:rotate(-2deg)">PONTOS?</div></div>
  <div style="position:absolute;left:70px;bottom:40px">${logo(44)}</div>`;

const miniDistrital = () => {
  const cores = ['#0b1a4a', '#0a3aa6', '#1d58d8', '#f7f400', '#ff6bf2', '#0a2a7c'];
  let s = 7; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const cel = Array.from({ length: 42 }, () => `<div style="background:${cores[Math.floor(r() * cores.length)]};border-radius:8px"></div>`).join('');
  return `<div style="position:absolute;inset:0;background:${MAG}"></div>
  <div style="position:absolute;right:50px;top:60px;width:480px;height:600px;display:grid;grid-template-columns:repeat(6,1fr);grid-template-rows:repeat(7,1fr);gap:8px;transform:rotate(-4deg);clip-path:polygon(18% 0,70% 3%,100% 22%,92% 55%,100% 80%,62% 100%,20% 92%,0 64%,8% 30%);filter:drop-shadow(0 24px 30px rgba(0,0,0,.35))">${cel}</div>
  <div style="position:absolute;right:170px;top:300px;background:#fff;color:${C.tinta};border-radius:14px;padding:12px 18px;font-family:'Space Grotesk';font-weight:700;font-size:26px;box-shadow:0 14px 30px rgba(0,0,0,.35)">📍 o seu distrito</div>
  <div style="position:absolute;left:60px;top:70px;width:760px">
    <div style="display:inline-block;background:${C.tinta};color:#fff;font-family:'Space Grotesk';font-weight:700;font-size:30px;padding:6px 16px">PROPOSTA DE HUGO MOTTA</div>
    <div style="${BB};font-size:150px;line-height:.86;color:#fff;margin-top:20px;text-shadow:0 6px 0 rgba(0,0,0,.2)">VOTO DISTRITAL</div>
    <div style="display:inline-block;background:${C.amar};${BB};font-size:150px;line-height:.86;color:${C.tinta};padding:10px 18px 0">MISTO</div>
    <div style="${BB};font-size:96px;line-height:.9;color:#fff;margin-top:18px">O QUE MUDA PRA VOCÊ?</div></div>
  <div style="position:absolute;left:70px;bottom:40px">${logo(44, '#fff')}</div>`;
};

const miniVde = () => `<div style="position:absolute;inset:0;background:${VDE}"></div>
  ${[0, 1, 2, 3].map(i => anel(900 - i * 50, -300 - i * 50, 640 + i * 100, 'rgba(201,184,255,.2)', 2)).join('')}
  <div style="position:absolute;left:64px;top:64px;font-family:Poppins;font-weight:800;font-size:28px;letter-spacing:.22em;color:#C9B8FF">MÉTODO VDE · REPESCAGEM OAB</div>
  <div style="position:absolute;left:64px;top:130px;width:1150px;font-family:Poppins;font-weight:900;font-size:110px;line-height:1.02;letter-spacing:-.03em;color:#fff">Devo mudar de <span style="color:#C9B8FF">matéria</span>?</div>
  <div style="position:absolute;left:64px;top:430px;display:flex;align-items:center;gap:34px">
    <div style="background:#fff;color:#2E0575;border-radius:26px;padding:26px 44px;font-family:Poppins;font-weight:900;font-size:64px;transform:rotate(-3deg);box-shadow:0 20px 40px rgba(0,0,0,.3)">FICAR</div>
    <div style="font-family:Poppins;font-weight:800;font-size:44px;color:#C9B8FF">ou</div>
    <div style="background:linear-gradient(135deg,#C9B8FF,#8f7bff);color:#1a0b4f;border-radius:26px;padding:26px 44px;font-family:Poppins;font-weight:900;font-size:64px;transform:rotate(3deg);box-shadow:0 20px 40px rgba(0,0,0,.3)">MUDAR?</div></div>
  <div style="position:absolute;left:64px;bottom:50px;font-family:Poppins;font-weight:600;font-size:26px;color:rgba(255,255,255,.85)">@nataliavalenca · @liberofilho</div>`;

const PECAS = [
  ['fundo-podconst-repescagem', 1920, 1080, () => fundoPodconst(AZUL, 'REPESCAGEM', 'AULA · REPESCAGEM OAB', 'rgba(226,36,214,.85)')],
  ['fundo-podconst-voto-distrital', 1920, 1080, () => fundoPodconst(MAG, 'DISTRITAL', 'AULA · VOTO DISTRITAL MISTO', 'rgba(247,244,0,.85)')],
  ['fundo-vde-mudar-materia', 1920, 1080, () => fundoVde('REPESCAGEM OAB')],
  ['miniatura-podconst-repescagem', 1280, 720, miniRepescagem],
  ['miniatura-podconst-voto-distrital', 1280, 720, miniDistrital],
  ['miniatura-vde-mudar-materia', 1280, 720, miniVde],
];

const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
fs.mkdirSync(OUT, { recursive: true });
for (const [nome, w, h, fn] of PECAS) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet"><style>*{box-sizing:border-box;margin:0}body{width:${w}px;height:${h}px;overflow:hidden;position:relative}</style></head><body>${fn()}</body></html>`);
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, `${nome}.png`) });
  await page.close(); console.log('✓', nome);
}
await browser.close();

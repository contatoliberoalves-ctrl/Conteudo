// Capas do produto de um kit para a Kiwify: foto principal (1080×1080), capa do curso na área de membros (1280×720),
// topo da área de membros (1920×480), banners de checkout (1200×400 e 800×400) e capas dos 8 módulos (600×840).
// Usa as capas dos PDFs (rode antes o render-pdf.mjs do kit). Uso: node render-produto-kit.mjs <id> → saida/kit-<id>/produto/
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { FONTES, marca } from './template.mjs';
import { TEMAS, tex, carimbo } from './kits/tema.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const id = process.argv[2];
const prod = JSON.parse(fs.readFileSync(path.join(root, 'kits', 'produtos.json'), 'utf8')).find(p => p.id === id);
const c = TEMAS[prod.tema], P = prod.produto;
const T = "font-family:'Big Shoulders Display',sans-serif;font-weight:900;text-transform:uppercase", S = "font-family:'Sora',sans-serif", I = "font-family:'Inter',sans-serif";
const capa = i => 'file://' + path.join(root, 'saida', `${id}-${prod.pecas[i][0]}`, '1.png');
const fundo = `<div style="position:absolute;inset:0;background:${c.escuro}"></div><div style="position:absolute;inset:0;background-image:${tex(c, c.claro, .2, 110)}"></div><div style="position:absolute;inset:0;background:radial-gradient(80% 60% at 0% 100%,${c.escuro3},transparent 70%),radial-gradient(70% 50% at 100% 0%,${c.brilho},transparent 70%)"></div>`;
const pilha = (x, y, w, n = 3) => [[2, -9, -.32], [1, 7, .3], [0, -2, 0]].slice(3 - n).map(([i, g, dx]) => `<img src="${capa(i)}" style="position:absolute;left:${x + dx * w}px;top:${y + Math.abs(g) * 3}px;width:${w}px;border-radius:${w / 50}px;transform:rotate(${g}deg);box-shadow:0 ${w / 14}px ${w / 6}px rgba(0,0,0,.55)">`).join('');
const titulo = (px, cor = '#fff') => `<div style="${T};font-size:${px}px;line-height:.9;color:${cor}">${P.titulo[0]}<br><span style="color:${c.claro}">${P.titulo[1]}</span></div>`;
const selo = px => `<span style="display:inline-block;${S};font-weight:700;font-size:${px}px;letter-spacing:.12em;text-transform:uppercase;background:${c.cor};color:#fff;padding:${px * .5}px ${px * .8}px;border-radius:${px * .4}px">${prod.selo}</span>`;
const chips = px => `<div style="display:flex;flex-wrap:wrap;gap:${px * .6}px">${P.chips.map(t => `<span style="${S};font-weight:700;font-size:${px}px;color:${c.claro};border:1.5px solid ${c.claro};padding:${px * .4}px ${px * .7}px;border-radius:${px * .35}px">${t}</span>`).join('')}</div>`;
const car = (px, x, y) => `<div style="position:absolute;left:${x}px;top:${y}px">${carimbo({ px, cor: c.carimbo, ...prod.carimbo, id: 'k' + px })}</div>`;
const PECAS = [
  ['foto-principal-1080', 1080, 1080, `${fundo}<div style="position:absolute;left:70px;top:64px">${marca(40, '#fff', c.claro)}</div>${car(170, 850, 40)}
    <div style="position:absolute;left:70px;top:230px">${selo(17)}<div style="margin-top:24px">${titulo(150)}</div><div style="${I};font-weight:600;font-size:30px;line-height:1.3;color:rgba(255,255,255,.88);margin-top:22px;width:470px">${P.sub}</div></div>
    ${pilha(600, 610, 360)}<div style="position:absolute;left:70px;bottom:70px;width:420px">${chips(20)}</div>`],
  ['capa-curso-1280x720', 1280, 720, `${fundo}<div style="position:absolute;left:70px;top:56px">${marca(36, '#fff', c.claro)}</div>
    <div style="position:absolute;left:70px;top:200px;width:600px">${selo(15)}<div style="margin-top:22px">${titulo(124)}</div><div style="${I};font-weight:600;font-size:26px;color:rgba(255,255,255,.88);margin-top:20px">${P.sub}</div></div>
    ${pilha(790, 150, 330)}${car(140, 1100, 30)}`],
  ['topo-membros-1920x480', 1920, 480, `${fundo}<div style="position:absolute;left:90px;top:60px">${marca(40, '#fff', c.claro)}</div>
    <div style="position:absolute;left:90px;top:160px">${titulo(130)}</div><div style="position:absolute;left:720px;top:190px;width:560px">${selo(16)}<div style="${I};font-weight:600;font-size:28px;line-height:1.35;color:rgba(255,255,255,.9);margin-top:20px">${prod.identidade.texto}</div></div>
    ${pilha(1420, 70, 250)}${car(150, 1730, 300)}`],
  ['checkout-1200x400', 1200, 400, `${fundo}<div style="position:absolute;left:60px;top:44px">${marca(32, '#fff', c.claro)}</div>
    <div style="position:absolute;left:60px;top:128px">${titulo(104)}</div><div style="position:absolute;left:470px;top:110px;width:400px">${selo(13)}<div style="${I};font-weight:700;font-size:25px;line-height:1.35;color:#fff;margin-top:16px">${P.sub}</div><div style="margin-top:18px">${chips(15)}</div></div>
    ${pilha(930, 40, 200)}`],
  ['checkout-800x400', 800, 400, `${fundo}<div style="position:absolute;left:50px;top:40px">${marca(30, '#fff', c.claro)}</div>
    <div style="position:absolute;left:50px;top:120px">${titulo(96)}</div><div style="position:absolute;left:50px;bottom:40px;${I};font-weight:700;font-size:21px;color:#fff;width:440px">${P.sub}</div>
    ${pilha(560, 40, 180, 2)}`],
  ...prod.pecas.map(([p, nome], i) => [`modulo-${i + 1}-600x840`, 600, 840, `${fundo}<div style="position:absolute;left:44px;top:40px">${marca(28, '#fff', c.claro)}</div>
    <div style="position:absolute;right:30px;top:24px;${T};font-size:150px;line-height:1;color:transparent;-webkit-text-stroke:2px ${c.vazado}">${String(i + 1).padStart(2, '0')}</div>
    <img src="${capa(i)}" style="position:absolute;left:150px;top:150px;width:300px;border-radius:6px;transform:rotate(-3deg);box-shadow:0 20px 50px rgba(0,0,0,.55)">
    <div style="position:absolute;left:44px;right:44px;bottom:50px"><div style="${S};font-weight:700;font-size:15px;letter-spacing:.16em;text-transform:uppercase;color:${c.claro}">Módulo ${i + 1} · ${prod.sigla}</div><div style="${T};font-size:54px;line-height:.95;color:#fff;margin-top:10px">${nome}</div></div>`]),
];
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
const out = path.join(root, 'saida', 'kit-' + id, 'produto'); fs.mkdirSync(out, { recursive: true }); fs.mkdirSync(path.join(root, 'build'), { recursive: true });
for (const [nome, W, H, corpo] of PECAS) {
  const f = path.join(root, 'build', `produto-${id}.html`);
  fs.writeFileSync(f, `<!doctype html><html><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet"><style>*{box-sizing:border-box}body{margin:0}</style></head><body><div id="a" style="position:relative;width:${W}px;height:${H}px;overflow:hidden">${corpo}</div><script>document.fonts.ready.then(()=>{window.__pronto=true})</script></body></html>`);
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.goto('file://' + f, { waitUntil: 'networkidle' }); await page.waitForFunction(() => window.__pronto === true); await page.waitForTimeout(200);
  await (await page.$('#a')).screenshot({ path: path.join(out, nome + '.png') }); await page.close();
}
await browser.close(); console.log('✓', PECAS.length, 'peças em', out);

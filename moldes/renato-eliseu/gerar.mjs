// Identidade visual do produto "Eliseu: um santo homem de Deus" (2ª edição ampliada), do Pastor Renato Torres Moul,
// tirada da capa do livro (Editora Café com Literatura): marrom-café da capa, creme, a chama do manto de Elias,
// o vermelho do manto e o verde da túnica. "Eliseu" em letra cursiva, subtítulo em versais espaçadas.
// Peças: identidade (manual), capa do produto, mockup do livro, foto principal (1:1 e 4:5), checkout (topo
// desktop e celular, lateral) e sobre o autor. Fotos em fotos/ (fora do git): pintura.png (arte da capa) e autor.png.
// Uso: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node gerar.mjs
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const R = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(R, 'saida'); fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(path.join(R, 'build'), { recursive: true });
const url = f => 'file://' + path.join(R, f);
const C = { cafe: '#7E5434', cafeEsc: '#4A2E1B', noite: '#2A1A10', creme: '#F5ECDD', papel: '#FBF6EE', chama: '#E8742A', ouro: '#F2B33D', manto: '#8E1F2B', tunica: '#2F5A2E', ceu: '#7FB0DA' };
const HEAD = `<meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Jost:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}body{background:transparent}
.script{font-family:'Great Vibes',cursive;font-weight:400;line-height:1}
.serif{font-family:'Cormorant Garamond',serif}
.sans{font-family:'Jost',sans-serif}
.caps{text-transform:uppercase;letter-spacing:.22em}
.grao::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.10;mix-blend-mode:overlay;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/></filter><rect width='160' height='160' filter='url(%23n)'/></svg>")}
</style>`;
const fundoCafe = `background:radial-gradient(120% 90% at 30% 20%, #93633D 0%, ${C.cafe} 45%, ${C.cafeEsc} 100%)`;
const selo = (d, f = 1) => `<div class="sans" style="width:${d}px;height:${d}px;border-radius:50%;background:${C.tunica};color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-weight:600;line-height:1.05;box-shadow:0 ${6 * f}px ${18 * f}px rgba(0,0,0,.35);border:${3 * f}px solid rgba(255,255,255,.85)"><div style="font-size:${d * .26}px">2ª</div><div style="font-size:${d * .14}px">edição</div><div style="font-size:${d * .14}px">ampliada</div></div>`;
const titulo = (tam, cor = C.creme, sub = true, alinha = 'center') => `<div style="text-align:${alinha}"><div class="script" style="font-size:${tam}px;color:${cor};text-shadow:0 ${tam * .03}px ${tam * .08}px rgba(0,0,0,.35)">Eliseu</div>${sub ? `<div class="serif caps" style="font-size:${tam * .16}px;font-weight:600;color:${cor};margin-top:${-tam * .06}px;letter-spacing:.2em;white-space:nowrap">Um santo homem de Deus</div>` : ''}</div>`;

// ---------- peças ----------
const P = {};
// Capa do produto (digital, 2:3)
P.capa = { w: 1200, h: 1800, html: `<div class="grao" style="position:absolute;inset:0;${fundoCafe}">
  <div style="position:absolute;left:0;right:0;top:0;height:1400px;background:url(${url('fotos/pintura.png')}) center 30%/cover;-webkit-mask-image:linear-gradient(180deg,#000 58%,rgba(0,0,0,.6) 75%,transparent 100%)"></div>
  <div style="position:absolute;left:0;right:0;top:0;height:260px;background:linear-gradient(180deg,rgba(30,18,10,.55),rgba(30,18,10,0))"></div>
  <div class="sans caps" style="position:absolute;top:70px;left:0;right:0;text-align:center;color:#fff;font-size:30px;font-weight:500;letter-spacing:.3em">Renato Torres Moul</div>
  <div style="position:absolute;top:150px;right:70px">${selo(170)}</div>
  <div style="position:absolute;left:0;right:0;top:1205px">${titulo(300)}</div>
  <div class="sans caps" style="position:absolute;bottom:70px;left:0;right:0;text-align:center;color:${C.creme};opacity:.75;font-size:20px;letter-spacing:.35em">Editora Café com Literatura</div>
</div>` };

// Mockup 3D do livro (fundo transparente), usa a capa gerada
const W = 600, H = 900, T = 70;
P.mockup = { w: 1100, h: 1150, transp: true, html: `<div style="position:absolute;inset:0;perspective:2600px;display:flex;align-items:center;justify-content:center">
  <div style="position:absolute;left:250px;right:170px;bottom:95px;height:70px;border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.55),rgba(0,0,0,0));filter:blur(6px)"></div>
  <div style="position:relative;width:${W}px;height:${H}px;transform-style:preserve-3d;transform:rotateY(28deg) rotateX(2deg)">
    <div style="position:absolute;inset:0;transform:translateZ(${T / 2}px);background:url(${url('saida/capa.png')}) center/cover;box-shadow:inset 6px 0 10px rgba(0,0,0,.25)">
      <div style="position:absolute;inset:0;background:linear-gradient(100deg,rgba(255,255,255,.0) 40%,rgba(255,255,255,.14) 55%,rgba(255,255,255,0) 70%)"></div>
      <div style="position:absolute;left:0;top:0;bottom:0;width:16px;background:linear-gradient(90deg,rgba(0,0,0,.35),rgba(255,255,255,.08),rgba(0,0,0,0))"></div></div>
    <div style="position:absolute;top:0;height:${H}px;width:${T}px;left:${(W - T) / 2}px;transform:rotateY(-90deg) translateZ(${W / 2}px);background:linear-gradient(90deg,${C.cafeEsc},${C.cafe} 50%,${C.cafeEsc});display:flex;align-items:center;justify-content:center">
      <div class="sans caps" style="writing-mode:vertical-rl;color:${C.creme};font-size:17px;letter-spacing:.18em;white-space:nowrap">Renato Torres Moul &nbsp;·&nbsp; <span class="serif" style="font-weight:700">Eliseu: um santo homem de Deus</span></div></div>
    <div style="position:absolute;top:6px;height:${H - 12}px;width:${T - 6}px;left:${(W - T) / 2}px;transform:rotateY(90deg) translateZ(${W / 2 - 4}px);background:repeating-linear-gradient(90deg,#f3ead9 0 2px,#dccfb8 2px 3px)"></div>
  </div></div>` };

const livro = (larg, extra = '') => `<img src="${url('saida/mockup.png')}" style="width:${larg}px;display:block;${extra}">`;
const chamaFundo = (pos = 'left center', op = .35) => `<div style="position:absolute;inset:0;background:url(${url('fotos/pintura.png')}) ${pos}/cover;opacity:${op};mix-blend-mode:luminosity"></div>`;

// Foto principal 1:1 (vitrine do produto)
P['foto-principal'] = { w: 1080, h: 1080, html: `<div class="grao" style="position:absolute;inset:0;${fundoCafe}">
  <div style="position:absolute;width:900px;height:900px;left:-170px;top:120px;border-radius:50%;background:radial-gradient(closest-side,rgba(242,179,61,.55),rgba(232,116,42,.18) 55%,rgba(232,116,42,0))"></div>
  <div style="position:absolute;left:-40px;top:110px">${livro(700)}</div>
  <div style="position:absolute;right:30px;top:0;bottom:0;width:480px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center">
    <div class="sans caps" style="color:${C.ouro};font-size:20px;font-weight:600;letter-spacing:.3em;margin-bottom:20px">Livro</div>
    ${titulo(150)}
    <div style="width:70px;height:2px;background:${C.ouro};margin:34px 0 28px"></div>
    <div class="sans" style="color:${C.creme};font-size:28px;font-weight:500">Renato Torres Moul</div>
    <div style="margin-top:40px">${selo(150)}</div>
  </div></div>` };

// Foto principal 4:5 (anúncio/feed)
P['foto-principal-4x5'] = { w: 1080, h: 1350, html: `<div class="grao" style="position:absolute;inset:0;${fundoCafe}">
  <div style="position:absolute;width:1100px;height:1100px;left:-10px;top:330px;border-radius:50%;background:radial-gradient(closest-side,rgba(242,179,61,.5),rgba(232,116,42,.15) 55%,rgba(232,116,42,0))"></div>
  <div style="position:absolute;top:90px;left:0;right:0">${titulo(200)}</div>
  <div class="sans" style="position:absolute;top:385px;left:0;right:0;text-align:center;color:${C.creme};font-size:30px;font-weight:500;letter-spacing:.04em">Renato Torres Moul</div>
  <div style="position:absolute;left:50%;transform:translateX(-50%);top:420px">${livro(860)}</div>
  <div style="position:absolute;right:110px;top:560px">${selo(170)}</div></div>` };

// Checkout: topo desktop
P['checkout-topo-desktop'] = { w: 1920, h: 480, html: `<div class="grao" style="position:absolute;inset:0;${fundoCafe}">
  <div style="position:absolute;right:0;top:0;bottom:0;width:820px;background:url(${url('fotos/pintura.png')}) center 22%/cover;-webkit-mask-image:linear-gradient(90deg,transparent,#000 45%)"></div>
  <div style="position:absolute;left:150px;top:30px">${livro(400)}</div>
  <div style="position:absolute;left:600px;top:0;bottom:0;width:640px;display:flex;flex-direction:column;justify-content:center">
    ${titulo(170, C.creme, true, 'left')}
    <div class="sans" style="color:${C.creme};font-size:26px;margin-top:26px;opacity:.9">Renato Torres Moul &nbsp;<span style="color:${C.ouro}">·</span>&nbsp; 2ª edição ampliada</div>
  </div></div>` };

// Checkout: topo celular
P['checkout-topo-celular'] = { w: 1080, h: 600, html: `<div class="grao" style="position:absolute;inset:0;${fundoCafe}">
  <div style="position:absolute;left:0;top:0;bottom:0;width:560px;background:url(${url('fotos/pintura.png')}) center 22%/cover;-webkit-mask-image:linear-gradient(270deg,transparent,#000 60%);opacity:.55"></div>
  <div style="position:absolute;left:40px;top:40px">${livro(500)}</div>
  <div style="position:absolute;left:470px;top:0;bottom:0;width:560px;display:flex;flex-direction:column;justify-content:center;align-items:center">
    ${titulo(150)}
    <div class="sans" style="color:${C.creme};font-size:26px;margin-top:22px">Renato Torres Moul</div>
    <div style="margin-top:22px">${selo(110)}</div>
  </div></div>` };

// Checkout: lateral (vertical)
P['checkout-lateral'] = { w: 600, h: 1100, html: `<div class="grao" style="position:absolute;inset:0;${fundoCafe}">
  <div style="position:absolute;width:700px;height:700px;left:-50px;top:150px;border-radius:50%;background:radial-gradient(closest-side,rgba(242,179,61,.45),rgba(232,116,42,0))"></div>
  <div style="position:absolute;left:0;right:0;top:40px;display:flex;justify-content:center">${livro(560)}</div>
  <div style="position:absolute;left:0;right:0;top:650px">${titulo(150)}</div>
  <div class="sans" style="position:absolute;left:50px;right:50px;top:860px;text-align:center;color:${C.creme};font-size:24px;line-height:1.5">Uma grande transição de liderança espiritual estava prestes a ser vivida pelo povo de Israel.</div>
  <div class="sans caps" style="position:absolute;left:0;right:0;bottom:50px;text-align:center;color:${C.ouro};font-size:18px;font-weight:600;letter-spacing:.25em">Renato Torres Moul</div></div>` };

// Sobre o autor (para a página de vendas / checkout)
P['sobre-autor'] = { w: 1080, h: 1080, html: `<div style="position:absolute;inset:0;background:${C.papel}">
  <div style="position:absolute;left:0;top:0;bottom:0;width:440px;${fundoCafe}"></div>
  <div style="position:absolute;left:110px;top:200px;width:420px;height:580px;border-radius:210px 210px 24px 24px;overflow:hidden;background:${C.creme};box-shadow:0 20px 50px rgba(0,0,0,.25)"><img src="${url('fotos/autor.png')}" style="width:100%;height:100%;object-fit:cover;object-position:50% 20%"></div>
  <div style="position:absolute;left:590px;right:80px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center">
    <div class="sans caps" style="color:${C.chama};font-size:20px;font-weight:600;letter-spacing:.3em">Sobre o autor</div>
    <div class="serif" style="color:${C.cafeEsc};font-size:62px;font-weight:700;line-height:1.05;margin:16px 0 30px">Renato Torres Moul</div>
    <div class="sans" style="color:#4a3a2c;font-size:27px;line-height:1.5">Biólogo e teólogo de formação. Atua com educação cristã e secular e serve como ministro do Evangelho, convencionado à Assembleia de Deus em Abreu e Lima (PE).</div>
  </div></div>` };

// Identidade (manual em uma tela 16:9)
const chip = (hex, nome) => `<div style="flex:1"><div style="height:150px;border-radius:18px;background:${hex};box-shadow:inset 0 0 0 1px rgba(0,0,0,.08)"></div><div class="sans" style="margin-top:14px;font-size:22px;font-weight:600;color:${C.cafeEsc}">${nome}</div><div class="sans" style="font-size:19px;color:#7a6a5a">${hex}</div></div>`;
P.identidade = { w: 1920, h: 1080, html: `<div style="position:absolute;inset:0;background:${C.papel}">
  <div class="grao" style="position:absolute;left:0;top:0;bottom:0;width:640px;${fundoCafe}">
    <div style="position:absolute;inset:0;background:url(${url('fotos/pintura.png')}) center 25%/cover;opacity:.28;mix-blend-mode:luminosity"></div>
    <div style="position:absolute;left:0;right:0;top:300px">${titulo(210)}</div>
    <div class="sans" style="position:absolute;left:0;right:0;top:600px;text-align:center;color:${C.creme};font-size:26px">Renato Torres Moul</div>
    <div style="position:absolute;left:50%;transform:translateX(-50%);top:680px">${selo(150)}</div>
  </div>
  <div style="position:absolute;left:720px;right:90px;top:80px">
    <div class="sans caps" style="color:${C.chama};font-size:20px;font-weight:600;letter-spacing:.3em">Identidade visual do produto</div>
    <div class="serif" style="color:${C.cafeEsc};font-size:64px;font-weight:700;margin:10px 0 44px">Eliseu: um santo homem de Deus</div>
    <div class="sans caps" style="font-size:17px;font-weight:600;color:#7a6a5a;letter-spacing:.25em;margin-bottom:16px">Cores (da capa do livro)</div>
    <div style="display:flex;gap:22px">${chip(C.cafe, 'Café')}${chip(C.cafeEsc, 'Café escuro')}${chip(C.creme, 'Creme')}${chip(C.chama, 'Chama')}${chip(C.ouro, 'Ouro')}${chip(C.manto, 'Manto')}${chip(C.tunica, 'Túnica')}</div>
    <div style="display:flex;gap:60px;margin-top:56px">
      <div style="flex:1"><div class="sans caps" style="font-size:17px;font-weight:600;color:#7a6a5a;letter-spacing:.25em;margin-bottom:6px">Título</div><div class="script" style="font-size:120px;color:${C.cafeEsc}">Eliseu</div><div class="sans" style="font-size:20px;color:#7a6a5a">Great Vibes · só no nome do livro</div></div>
      <div style="flex:1"><div class="sans caps" style="font-size:17px;font-weight:600;color:#7a6a5a;letter-spacing:.25em;margin-bottom:22px">Subtítulo</div><div class="serif caps" style="font-size:31px;font-weight:600;color:${C.cafeEsc};letter-spacing:.14em">Um santo homem de Deus</div><div class="sans" style="font-size:20px;color:#7a6a5a;margin-top:14px">Cormorant Garamond em versais espaçadas</div></div>
      <div style="flex:1"><div class="sans caps" style="font-size:17px;font-weight:600;color:#7a6a5a;letter-spacing:.25em;margin-bottom:22px">Textos</div><div class="sans" style="font-size:34px;font-weight:600;color:${C.cafeEsc}">Renato Torres Moul</div><div class="sans" style="font-size:24px;color:#4a3a2c;margin-top:8px">Jost para nomes, botões e textos corridos.</div></div>
    </div>
    <div class="sans" style="margin-top:56px;font-size:23px;line-height:1.55;color:#4a3a2c;max-width:1050px">A arte da capa (a chama do manto de Elias) é a imagem principal. Fundo café com brilho dourado atrás do livro; selo verde da 2ª edição ampliada, como na capa impressa.</div>
  </div></div>` };

// ---------- render ----------
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors', '--allow-file-access-from-files'] });
const browser = await chromium.launch(launch);
const ordem = ['capa', 'mockup', 'foto-principal', 'foto-principal-4x5', 'checkout-topo-desktop', 'checkout-topo-celular', 'checkout-lateral', 'sobre-autor', 'identidade'];
for (const id of ordem) {
  const p = P[id];
  const arq = path.join(R, 'build', id + '.html');
  fs.writeFileSync(arq, `<!doctype html><html><head>${HEAD}</head><body><div style="position:relative;width:${p.w}px;height:${p.h}px;overflow:hidden">${p.html}</div></body></html>`);
  const page = await browser.newPage({ viewport: { width: p.w, height: p.h } });
  await page.goto('file://' + arq, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, id + '.png'), omitBackground: !!p.transp });
  await page.close(); console.log('✓', id, `${p.w}×${p.h}`);
}
await browser.close();

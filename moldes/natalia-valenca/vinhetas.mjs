// Vinhetas de abertura do canal da Natália Valença no YouTube ("Advocacia na Prática"), 1920×1080, 6 s, 30 fps.
// Identidade dela: navy, dourado, creme e caramelo; Playfair Display, Poppins/Lato e assinatura cursiva.
// Animação em CSS fotografada a 90 quadros/s e fundida de 3 em 3 no ffmpeg (desfoque de movimento real).
//   ln -sfn /opt/node-tools/node_modules ../node_modules   (na nuvem, para achar o playwright)
//   CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node vinhetas.mjs [ouro|editorial|monograma]
// Saída: saida/natalia-vinheta-<id>.mp4. Trilha opcional: saida/<id>.mp3 (entra no vídeo se existir).
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const root = path.dirname(new URL(import.meta.url).pathname);
const FPS = 30, SUB = 3, DUR = 6;
const NAVY = '#0a1a3a', OURO = '#e3a93f', CREME = '#f1ece0', PAPEL = '#ece7db', TINTA = '#172a4d', CARAMELO = '#a97c50';
const E = 'cubic-bezier(.2,.8,.2,1)', IO = 'cubic-bezier(.65,0,.35,1)';
const FONTES = `<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;0,800;1,500;1,700&family=Poppins:wght@300;400;500;600;700&family=Lato:wght@300;400;700&family=Mrs+Saint+Delafield&display=swap" rel="stylesheet">`;

let semente = 11;
const rnd = () => (semente = (semente * 16807) % 2147483647) / 2147483647;
// granulado que muda a cada quadro
const grao = (op = .2) => `<div style="position:absolute;inset:-300px;pointer-events:none;opacity:${op};mix-blend-mode:overlay;animation:grao .2s steps(1) infinite;background-image:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E&quot;)"></div>`;
const letras = (txt, t0, passo, anim, dur, cls = '') => [...txt].map((c, i) => `<span class="${cls}" style="display:inline-block;animation:${anim} ${dur}s ${E} ${(t0 + i * passo).toFixed(3)}s both">${c}</span>`).join('');
const mascara = (txt, t, dur = .7) => `<span style="display:inline-block;overflow:hidden;vertical-align:bottom;padding:.14em .05em .22em;margin:-.14em -.05em -.22em"><span style="display:inline-block;animation:sobe ${dur}s ${E} ${t}s both">${txt}</span></span>`;

const BASE = `${FONTES}<style>
*{box-sizing:border-box;margin:0}
html,body{width:1920px;height:1080px;overflow:hidden;background:#000}
.v{position:relative;width:1920px;height:1080px;overflow:hidden;font-family:Poppins,sans-serif}
.cheio{position:absolute;inset:0}
.centro{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.pf{font-family:'Playfair Display',serif}
.ouro{background:linear-gradient(180deg,#f8dc98 8%,${OURO} 48%,#b17a26 96%);-webkit-background-clip:text;background-clip:text;color:transparent}
@keyframes grao{0%{transform:translate(0,0)}17%{transform:translate(-97px,61px)}33%{transform:translate(53px,-131px)}50%{transform:translate(-149px,-43px)}67%{transform:translate(89px,113px)}83%{transform:translate(-31px,-89px)}}
@keyframes luz{from{opacity:0}to{opacity:1}}
@keyframes sobe{from{transform:translateY(118%)}to{transform:none}}
@keyframes foco{from{opacity:0;filter:blur(22px);transform:translateY(34px) scale(1.18)}to{opacity:1;filter:blur(0);transform:none}}
@keyframes focoLeve{from{opacity:0;filter:blur(10px)}to{opacity:1;filter:blur(0)}}
@keyframes abre{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes abreY{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes trilho{from{opacity:0;letter-spacing:.7em}to{opacity:1;letter-spacing:var(--ls)}}
@keyframes surge{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}
@keyframes escreve{from{clip-path:inset(-40% 100% -40% 0)}to{clip-path:inset(-40% -6% -40% 0)}}
</style>`;

const VINHETAS = {
  // 1 · OURO: luzes douradas desfocadas em profundidade, título entrando em foco letra a letra, assinatura escrita.
  ouro: () => {
    const bokeh = Array.from({ length: 30 }, () => {
      const d = 24 + rnd() * 150, x = rnd() * 1920, y = rnd() * 1080, b = 4 + rnd() * 26, o = .07 + rnd() * .26, dy = 60 + rnd() * 180, dx = (rnd() - .5) * 90, tw = 1.6 + rnd() * 2.4;
      return `<div style="position:absolute;left:${x.toFixed(0)}px;top:${y.toFixed(0)}px;width:${d.toFixed(0)}px;height:${d.toFixed(0)}px;margin:${(-d / 2).toFixed(0)}px;--dx:${dx.toFixed(0)}px;--dy:${(-dy).toFixed(0)}px;animation:voa 7s linear both"><div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(circle,#ffe2a0 0%,${OURO} 55%,transparent 72%);filter:blur(${b.toFixed(0)}px);--o:${o.toFixed(2)};animation:cintila ${tw.toFixed(2)}s ease-in-out ${(-rnd() * 3).toFixed(2)}s infinite alternate"></div></div>`;
    }).join('');
    return `<div class="v" style="background:${NAVY};color:${CREME}">
<div class="cheio" style="background:radial-gradient(62% 72% at 50% 50%,#1a3572 0%,${NAVY} 60%,#050d22 100%);animation:luz 1.3s ease-out both"></div>
<div class="cheio" style="animation:luz 1.8s ease-out .1s both"><div class="cheio" style="animation:afasta 6.5s ease-out both">${bokeh}</div></div>
<div class="cheio" style="background:radial-gradient(38% 30% at 50% 47%,rgba(227,169,63,.2),transparent 70%);animation:luz 1.6s ease-out .7s both"></div>
<div class="centro" style="animation:aproxima 6.5s cubic-bezier(.1,.6,.2,1) both">
  <div class="pf" style="font-weight:800;font-size:172px;line-height:1.08;white-space:nowrap;letter-spacing:-.012em;filter:drop-shadow(0 14px 34px rgba(0,0,0,.45))">
    ${letras('Advocacia', .55, .05, 'foco', .95, 'ouro')}<span style="display:inline-block;font-style:italic;font-weight:500;font-size:.5em;color:${CREME};margin:0 .34em 0 .38em;position:relative;top:-.1em;animation:focoLeve .9s ${E} 1.15s both">na</span>${letras('Prática', 1.2, .05, 'foco', .95, 'ouro')}</div>
  <div style="position:relative;width:980px;height:2px;margin-top:30px">
    <div class="cheio" style="background:linear-gradient(90deg,transparent,${OURO} 22%,#ffe7ae 50%,${OURO} 78%,transparent);animation:abre 1.1s ${IO} 1.95s both"></div>
    <div style="position:absolute;top:-22px;left:0;width:150px;height:46px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,244,214,.95),rgba(255,214,130,.35) 45%,transparent);opacity:0;animation:faisca 1.35s ${IO} 2.25s both"></div></div>
  <div style="font:400 29px Poppins;--ls:.34em;letter-spacing:.34em;margin:40px 0 0 .34em;white-space:nowrap;animation:trilho 1.1s ${E} 2.45s both">TRIBUTÁRIO <span style="color:${OURO}">·</span> ELEITORAL <span style="color:${OURO}">·</span> CONSTITUCIONAL</div>
  <div style="font:400 132px/1 'Mrs Saint Delafield',cursive;color:#f0c366;padding:0 22px 0 6px;margin-top:26px;white-space:nowrap;filter:drop-shadow(0 6px 18px rgba(0,0,0,.4));animation:escreve 1.3s cubic-bezier(.45,0,.3,1) 3.05s both">Natália Valença</div></div>
<div class="cheio" style="background:radial-gradient(75% 75% at 50% 50%,transparent 55%,rgba(2,6,18,.6) 100%)"></div>
${grao(.22)}
<style>
@keyframes voa{from{transform:translate(0,0)}to{transform:translate(var(--dx),var(--dy))}}
@keyframes cintila{from{opacity:calc(var(--o)*.35)}to{opacity:var(--o)}}
@keyframes afasta{from{transform:scale(1.22)}to{transform:scale(1)}}
@keyframes aproxima{from{transform:scale(.93)}to{transform:scale(1.02)}}
@keyframes faisca{0%{opacity:0;transform:translateX(-80px)}15%{opacity:1}85%{opacity:1}100%{opacity:0;transform:translateX(910px)}}
</style></div>`;
  },

  // 2 · EDITORIAL: a linguagem dos carrosséis dela (creme, caixas navy e caramelo, serifa branca), em tipografia cinética.
  editorial: () => {
    const caixa = (txt, cor, t) => `<div style="position:relative;display:inline-block;padding:2px 44px 22px;margin-top:14px"><div class="cheio" style="background:${cor};transform-origin:left;animation:abre .55s ${IO} ${t}s both"></div><div class="pf" style="position:relative;font-weight:800;font-size:196px;line-height:1.08;color:#fff;white-space:nowrap">${mascara(txt, t + .22, .75)}</div></div>`;
    return `<div class="v" style="background:${PAPEL};color:${TINTA};font-family:Lato,sans-serif">
<div class="cheio" style="background:radial-gradient(90% 90% at 30% 40%,#f6f2e9 0%,${PAPEL} 60%,#ddd6c6 100%)"></div>
<div class="cheio" style="animation:desliza 6.5s linear both">
  <div style="position:absolute;right:-250px;top:50%;width:1040px;height:1040px;margin-top:-520px;border-radius:50%;border:3px solid ${CARAMELO};opacity:.5;transform-origin:center;animation:aro 1.4s ${E} .7s both"></div>
  <div style="position:absolute;right:-120px;top:50%;width:780px;height:780px;margin-top:-390px;border-radius:50%;background:${CARAMELO};opacity:.16;animation:aro 1.4s ${E} .85s both"></div>
  <div style="position:absolute;right:120px;top:50%;margin-top:-430px;opacity:.1"><div class="pf" style="font-weight:700;font-size:720px;line-height:1;color:${TINTA};animation:surge 1.2s ${E} 1.1s both">§</div></div></div>
<div style="position:absolute;left:170px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;animation:empurra 6.5s cubic-bezier(.1,.6,.2,1) both">
  <div style="font:300 62px Lato;letter-spacing:.005em;margin-bottom:22px;white-space:nowrap">${mascara(`Natália <b style="font-weight:700;border-bottom:6px solid ${TINTA};padding-bottom:2px">Valença</b>`, .75, .7)}</div>
  ${caixa('Advocacia', TINTA, 1.05)}
  ${caixa('na Prática', CARAMELO, 1.4)}
  <div style="display:flex;align-items:center;margin-top:50px;white-space:nowrap">
    <div style="width:74px;height:5px;background:${TINTA};margin-right:26px;transform-origin:left;animation:abre .6s ${IO} 2.35s both"></div>
    <div style="font:400 44px Lato;animation:surge .7s ${E} 2.45s both">Tributário, Eleitoral e Constitucional</div></div></div>
<div style="position:absolute;left:170px;bottom:70px;display:flex;align-items:center;gap:22px;animation:surge .7s ${E} 3.0s both">
  <div class="pf" style="width:84px;height:84px;border-radius:50%;background:${TINTA};color:#e8c98a;display:grid;place-items:center;font-weight:700;font-size:34px;letter-spacing:-.02em">NV</div>
  <div><div style="font:700 30px Poppins;letter-spacing:.02em;color:#2a2622">NATALIA VALENÇA</div><div style="font:400 24px Poppins;color:#5a544c">@nataliavalenca</div></div></div>
<div class="cheio" style="background:${TINTA};transform-origin:right;animation:fecha .75s ${IO} .1s both"></div>
<div class="cheio" style="background:${CARAMELO};transform-origin:right;animation:fecha .75s ${IO} 0s both"></div>
${grao(.3)}
<style>
@keyframes fecha{from{transform:scaleX(1)}to{transform:scaleX(0)}}
@keyframes aro{from{opacity:0;transform:scale(.6)}to{transform:scale(1)}}
@keyframes desliza{from{transform:translateX(60px)}to{transform:translateX(-30px)}}
@keyframes empurra{from{transform:translateX(-26px)}to{transform:translateX(14px)}}
</style></div>`;
  },

  // 3 · MONOGRAMA: anéis dourados desenhados em volta das iniciais, que sobem e dão lugar ao nome do canal.
  monograma: () => {
    const canto = (pos, orig, bordas) => `<div style="position:absolute;${pos};width:110px;height:110px;${bordas};transform-origin:${orig};animation:cantoIn .9s ${E} .35s both"></div>`;
    const b = `2px solid rgba(227,169,63,.75)`;
    return `<div class="v" style="background:#071430;color:${CREME}">
<div class="cheio" style="background:radial-gradient(58% 70% at 50% 46%,#16306b 0%,#0a1a3a 58%,#040b1d 100%);animation:luz 1.2s ease-out both"></div>
<div style="position:absolute;left:50%;top:50%;width:2600px;height:2600px;margin:-1300px;opacity:.5;background:repeating-conic-gradient(from 0deg,rgba(227,169,63,.07) 0deg 4deg,transparent 4deg 15deg);-webkit-mask-image:radial-gradient(circle,#000 0,transparent 46%);mask-image:radial-gradient(circle,#000 0,transparent 46%);animation:gira 40s linear both, luz 1.5s ease-out .3s both"></div>
${canto('left:64px;top:64px', 'top left', `border-top:${b};border-left:${b}`)}${canto('right:64px;top:64px', 'top right', `border-top:${b};border-right:${b}`)}
${canto('left:64px;bottom:64px', 'bottom left', `border-bottom:${b};border-left:${b}`)}${canto('right:64px;bottom:64px', 'bottom right', `border-bottom:${b};border-right:${b}`)}
<div style="position:absolute;left:50%;top:50%;width:440px;height:440px;margin:-220px;animation:monoSobe .95s ${IO} 2.1s forwards">
  <svg width="440" height="440" viewBox="0 0 440 440" style="position:absolute;inset:0;transform:rotate(-90deg);filter:drop-shadow(0 0 14px rgba(227,169,63,.45))">
    <circle cx="220" cy="220" r="176" fill="none" stroke="${OURO}" stroke-width="3" stroke-linecap="round" stroke-dasharray="1106" style="animation:traco 1.35s ${IO} .35s both"/>
    <circle cx="220" cy="220" r="198" fill="none" stroke="#f3d28a" stroke-width="1.2" stroke-dasharray="1244" style="animation:tracoInv 1.5s ${IO} .5s both;opacity:.7"/></svg>
  <div class="pf" style="position:absolute;inset:0;display:grid;place-items:center;font-weight:700;font-size:176px;letter-spacing:-.04em;padding:0 10px 14px 0"><span>${letras('NV', 1.0, .16, 'foco', 1.0, 'ouro')}</span></div></div>
<div style="position:absolute;left:0;right:0;top:500px;display:flex;flex-direction:column;align-items:center">
  <div class="pf" style="font-weight:700;font-size:128px;line-height:1.1;white-space:nowrap;letter-spacing:-.01em;filter:drop-shadow(0 10px 28px rgba(0,0,0,.45))">
    ${letras('Advocacia', 2.55, .04, 'foco', .9)}<span style="display:inline-block;font-style:italic;font-weight:500;font-size:.52em;color:${OURO};margin:0 .34em 0 .38em;position:relative;top:-.1em;animation:focoLeve .9s ${E} 2.95s both">na</span>${letras('Prática', 3.0, .04, 'foco', .9)}</div>
  <div style="display:flex;align-items:center;gap:30px;margin-top:34px;white-space:nowrap">
    <div style="width:190px;height:2px;background:linear-gradient(90deg,transparent,${OURO});transform-origin:right;animation:abre .8s ${IO} 3.45s both"></div>
    <div style="font:500 34px Poppins;--ls:.36em;letter-spacing:.36em;margin-right:-.36em;color:#f0c366;animation:trilho 1s ${E} 3.4s both">NATÁLIA VALENÇA</div>
    <div style="width:190px;height:2px;background:linear-gradient(90deg,${OURO},transparent);transform-origin:left;animation:abre .8s ${IO} 3.45s both"></div></div>
  <div style="font:300 30px Poppins;letter-spacing:.06em;margin-top:26px;opacity:.9;white-space:nowrap;animation:surge .8s ${E} 3.85s both">Tributário, Eleitoral e Constitucional</div></div>
<div class="cheio" style="background:radial-gradient(75% 75% at 50% 50%,transparent 55%,rgba(2,6,18,.6) 100%)"></div>
${grao(.22)}
<style>
@keyframes gira{from{transform:rotate(0)}to{transform:rotate(60deg)}}
@keyframes cantoIn{from{opacity:0;transform:scale(0)}to{opacity:1;transform:scale(1)}}
@keyframes traco{from{stroke-dashoffset:1106}to{stroke-dashoffset:0}}
@keyframes tracoInv{from{stroke-dashoffset:-1244}to{stroke-dashoffset:0}}
@keyframes monoSobe{to{transform:translateY(-212px) scale(.6)}}
</style></div>`;
  },
};

const filtro = process.argv[2];
const saida = path.join(root, 'saida');
fs.mkdirSync(saida, { recursive: true });
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
for (const [id, corpo] of Object.entries(VINHETAS)) {
  if (filtro && id !== filtro) continue;
  const quadros = path.join(saida, id + '-quadros');
  fs.rmSync(quadros, { recursive: true, force: true });
  fs.mkdirSync(quadros, { recursive: true });
  const html = path.join(saida, id + '.html');
  fs.writeFileSync(html, `<!doctype html><meta charset="utf-8">${BASE}${corpo()}`);
  await page.goto('file://' + html);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(700);
  await page.evaluate(() => document.getAnimations().forEach((a) => a.pause()));
  const total = FPS * SUB * DUR;
  for (let q = 0; q < total; q++) {
    await page.evaluate((ms) => document.getAnimations().forEach((a) => { a.currentTime = ms; }), (q / (FPS * SUB)) * 1000);
    await page.screenshot({ path: path.join(quadros, String(q).padStart(4, '0') + '.jpg'), type: 'jpeg', quality: 95 });
  }
  const mp3 = path.join(saida, id + '.mp3');
  const audio = fs.existsSync(mp3) ? ['-i', mp3, '-af', `apad,afade=t=out:st=${DUR - 0.7}:d=0.7,loudnorm=I=-16:TP=-1.5`, '-c:a', 'aac', '-b:a', '192k'] : [];
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS * SUB), '-i', path.join(quadros, '%04d.jpg'), ...audio,
    '-vf', `tmix=frames=${SUB},fps=${FPS}`, '-t', String(DUR), '-c:v', 'libx264', '-crf', '15', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    path.join(saida, `natalia-vinheta-${id}.mp4`)]);
  fs.rmSync(quadros, { recursive: true, force: true });
  console.log('✓', `saida/natalia-vinheta-${id}.mp4`, audio.length ? '(com trilha)' : '(sem trilha)');
}
await browser.close();

// Vinhetas de abertura do canal da Natália Valença no YouTube, 1920×1080, 6 s, 30 fps. Só o nome dela.
// Paleta oficial: Berkeley Blue #013364, Oxford Blue #021C36, Satin Sheen Gold #CCA041, Alabaster #EFE7DA; Playfair Display.
// Fotos em fotos/ (fora do git; o repositório é público): retrato.jpg e cafe-sofa.jpg.
// Animação em CSS fotografada a 90 quadros/s e fundida de 3 em 3 no ffmpeg (desfoque de movimento real).
//   ln -sfn /opt/node-tools/node_modules ../node_modules   (na nuvem, para achar o playwright)
//   CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node vinhetas.mjs [retrato|cafe|cinema]
// Saída: saida/natalia-vinheta-<id>.mp4. Trilha opcional: saida/<id>.mp3 (entra no vídeo se existir).
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const root = path.dirname(new URL(import.meta.url).pathname);
const FPS = 30, SUB = 3, DUR = 6;
const AZUL = '#013364', OXFORD = '#021C36', OURO = '#CCA041', ALABASTRO = '#EFE7DA';
const E = 'cubic-bezier(.2,.8,.2,1)', IO = 'cubic-bezier(.65,0,.35,1)';
const FONTES = `<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;0,800;1,500&display=swap" rel="stylesheet">`;
const foto = (arq) => 'file://' + path.join(root, 'fotos', arq);

let semente = 11;
const rnd = () => (semente = (semente * 16807) % 2147483647) / 2147483647;
// granulado que muda a cada quadro
const grao = (op = .2) => `<div style="position:absolute;inset:-300px;pointer-events:none;opacity:${op};mix-blend-mode:overlay;animation:grao .2s steps(1) infinite;background-image:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E&quot;)"></div>`;
const letras = (txt, t0, passo, anim, dur, cls = '') => [...txt].map((c, i) => `<span class="${cls}" style="display:inline-block;animation:${anim} ${dur}s ${E} ${(t0 + i * passo).toFixed(3)}s both">${c}</span>`).join('');
const mascara = (txt, t, dur = .7) => `<span style="display:inline-block;overflow:hidden;vertical-align:bottom;padding:.14em .05em .22em;margin:-.14em -.05em -.22em"><span style="display:inline-block;animation:sobe ${dur}s ${E} ${t}s both">${txt}</span></span>`;
// luzes douradas desfocadas, em profundidade
const bokeh = (n, x0 = 0, x1 = 1920) => Array.from({ length: n }, () => {
  const d = 24 + rnd() * 140, x = x0 + rnd() * (x1 - x0), y = rnd() * 1080, b = 4 + rnd() * 24, o = .07 + rnd() * .24, dy = 60 + rnd() * 170, dx = (rnd() - .5) * 90, tw = 1.6 + rnd() * 2.4;
  return `<div style="position:absolute;left:${x.toFixed(0)}px;top:${y.toFixed(0)}px;width:${d.toFixed(0)}px;height:${d.toFixed(0)}px;margin:${(-d / 2).toFixed(0)}px;--dx:${dx.toFixed(0)}px;--dy:${(-dy).toFixed(0)}px;animation:voa 7s linear both"><div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(circle,#f3dfa6 0%,${OURO} 55%,transparent 72%);filter:blur(${b.toFixed(0)}px);--o:${o.toFixed(2)};animation:cintila ${tw.toFixed(2)}s ease-in-out ${(-rnd() * 3).toFixed(2)}s infinite alternate"></div></div>`;
}).join('');

const BASE = `${FONTES}<style>
*{box-sizing:border-box;margin:0}
html,body{width:1920px;height:1080px;overflow:hidden;background:#000}
.v{position:relative;width:1920px;height:1080px;overflow:hidden}
.cheio{position:absolute;inset:0}
.pf{font-family:'Playfair Display',serif}
.ouro{background:linear-gradient(180deg,#efd692 6%,${OURO} 50%,#9a7424 97%);-webkit-background-clip:text;background-clip:text;color:transparent}
@keyframes grao{0%{transform:translate(0,0)}17%{transform:translate(-97px,61px)}33%{transform:translate(53px,-131px)}50%{transform:translate(-149px,-43px)}67%{transform:translate(89px,113px)}83%{transform:translate(-31px,-89px)}}
@keyframes luz{from{opacity:0}to{opacity:1}}
@keyframes sobe{from{transform:translateY(118%)}to{transform:none}}
@keyframes foco{from{opacity:0;filter:blur(22px);transform:translateY(34px) scale(1.18)}to{opacity:1;filter:blur(0);transform:none}}
@keyframes abre{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes abreY{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes voa{from{transform:translate(0,0)}to{transform:translate(var(--dx),var(--dy))}}
@keyframes cintila{from{opacity:calc(var(--o)*.35)}to{opacity:var(--o)}}
@keyframes traco{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
</style>`;
const nome2 = (t, px, cls = 'ouro', passo = .06) => `<div class="pf" style="font-weight:800;font-size:${px}px;line-height:1.02;letter-spacing:-.012em;white-space:nowrap;filter:drop-shadow(0 14px 34px rgba(0,0,0,.45))"><div>${letras('Natália', t, passo, 'foco', .95, cls)}</div><div>${letras('Valença', t + .45, passo, 'foco', .95, cls)}</div></div>`;

const VINHETAS = {
  // 1 · RETRATO: tela dividida; a foto dela abre à direita e o nome entra em foco à esquerda, em dourado.
  retrato: () => `<div class="v" style="background:${OXFORD}">
<div class="cheio" style="background:radial-gradient(60% 80% at 26% 50%,${AZUL} 0%,${OXFORD} 70%);animation:luz 1.2s ease-out both"></div>
<div style="position:absolute;left:0;top:0;width:1000px;height:1080px;overflow:hidden;animation:luz 1.6s ease-out .2s both">${bokeh(12, 0, 1000)}</div>
<div style="position:absolute;right:0;top:0;width:980px;height:1080px;overflow:hidden;animation:cortina 1.15s ${IO} .3s both">
  <img src="${foto('retrato.jpg')}" style="position:absolute;left:0;top:-190px;width:980px;transform-origin:52% 36%;animation:zoomFoto 7s cubic-bezier(.1,.6,.2,1) both">
  <div class="cheio" style="background:linear-gradient(90deg,${OXFORD} 0%,rgba(2,28,54,.55) 14%,rgba(2,28,54,0) 38%),linear-gradient(0deg,rgba(2,28,54,.5),transparent 35%)"></div></div>
<div style="position:absolute;left:939px;top:0;width:3px;height:1080px;background:linear-gradient(180deg,transparent,${OURO} 20%,#f0dc9e 50%,${OURO} 80%,transparent);transform-origin:top;animation:abreY 1.2s ${IO} .45s both"></div>
<div style="position:absolute;left:130px;top:0;height:1080px;display:flex;flex-direction:column;justify-content:center;animation:deriva 7s cubic-bezier(.1,.6,.2,1) both">
  <div style="width:120px;height:4px;background:${OURO};margin-bottom:38px;transform-origin:left;animation:abre .8s ${IO} 1.0s both"></div>
  ${nome2(1.2, 196)}
  <div style="width:560px;height:2px;margin-top:40px;background:linear-gradient(90deg,${OURO},transparent);transform-origin:left;animation:abre 1.1s ${IO} 2.4s both"></div></div>
<div class="cheio" style="background:radial-gradient(80% 80% at 50% 50%,transparent 58%,rgba(1,10,22,.55) 100%)"></div>
${grao(.2)}
<style>
@keyframes cortina{from{clip-path:inset(0 0 0 100%)}to{clip-path:inset(0 0 0 0)}}
@keyframes zoomFoto{from{transform:scale(1.2)}to{transform:scale(1.04)}}
@keyframes deriva{from{transform:translateX(-22px)}to{transform:translateX(10px)}}
</style></div>`,

  // 2 · CAFÉ: fundo alabastro; uma xícara se desenha em traço azul, o vapor dourado sobe e o nome aparece embaixo.
  cafe: () => {
    const p = (d, cor, lg, t, dur, extra = '') => `<path d="${d}" pathLength="1" fill="none" stroke="${cor}" stroke-width="${lg}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1" style="animation:traco ${dur}s ${IO} ${t}s both${extra}"/>`;
    const vapor = (d, t, i) => `<g style="animation:vaporSobe ${2.6 + i * .3}s ease-in-out ${t + .9}s infinite alternate">${p(d, OURO, 6, t, 1.0)}</g>`;
    return `<div class="v" style="background:${ALABASTRO}">
<div class="cheio" style="background:radial-gradient(70% 80% at 50% 42%,#f8f3ea 0%,${ALABASTRO} 55%,#ddd2bf 100%)"></div>
<div class="cheio" style="display:flex;flex-direction:column;align-items:center;justify-content:center;animation:aproxima 7s cubic-bezier(.1,.6,.2,1) both">
  <div style="position:relative;width:440px;height:400px;margin-bottom:26px">
    <div style="position:absolute;left:50%;top:54%;width:520px;height:520px;margin:-260px;border-radius:50%;background:radial-gradient(circle,rgba(204,160,65,.22),transparent 68%);animation:luz 1.4s ease-out .6s both"></div>
    <svg width="440" height="400" viewBox="0 0 440 400" style="position:absolute;inset:0;overflow:visible">
      <path d="M100 190 H320 C320 285 282 338 210 338 C138 338 100 285 100 190 Z" fill="${AZUL}" style="animation:luz .8s ease-out 1.55s both"/>
      ${p('M100 190 H320 C320 285 282 338 210 338 C138 338 100 285 100 190 Z', AZUL, 7, .45, 1.25)}
      ${p('M320 214 C386 206 392 290 306 300', AZUL, 7, 1.0, .8)}
      ${p('M56 362 Q210 396 364 362', AZUL, 7, 1.25, .8)}
      <path d="M118 204 H302" stroke="${OURO}" stroke-width="4" stroke-linecap="round" pathLength="1" stroke-dasharray="1" fill="none" style="animation:traco .7s ${IO} 1.9s both"/>
      ${vapor('M162 160 C136 128 188 104 162 66', 1.75, 0)}${vapor('M210 156 C184 118 236 90 210 44', 1.9, 1)}${vapor('M258 160 C232 128 284 104 258 66', 2.05, 2)}
    </svg></div>
  <div class="pf" style="font-weight:800;font-size:164px;line-height:1.08;color:${AZUL};letter-spacing:-.012em;white-space:nowrap">${mascara('Natália', 2.3, .85)} ${mascara('Valença', 2.5, .85)}</div>
  <div style="width:520px;height:3px;margin-top:30px;background:linear-gradient(90deg,transparent,${OURO} 25%,${OURO} 75%,transparent);animation:abre 1.1s ${IO} 3.05s both"></div></div>
<div class="cheio" style="background:${AZUL};transform-origin:top;animation:fechaY .8s ${IO} .1s both"></div>
<div class="cheio" style="background:${OURO};transform-origin:top;animation:fechaY .8s ${IO} 0s both"></div>
${grao(.3)}
<style>
@keyframes fechaY{from{transform:scaleY(1)}to{transform:scaleY(0)}}
@keyframes aproxima{from{transform:scale(.95)}to{transform:scale(1.02)}}
@keyframes vaporSobe{from{transform:translateY(4px);opacity:1}to{transform:translateY(-16px);opacity:.45}}
</style></div>`;
  },

  // 3 · CINEMA: a foto dela no café em tela cheia, saindo do desfoque, com véu azul à direita, luzes douradas e o nome.
  cinema: () => `<div class="v" style="background:${OXFORD}">
<div class="cheio" style="animation:revela 1.7s cubic-bezier(.3,.7,.2,1) .15s both">
  <img src="${foto('cafe-sofa.jpg')}" style="position:absolute;left:-60px;top:-800px;width:1920px;transform-origin:32% 40%;animation:zoomLento 7s linear both"></div>
<div class="cheio" style="background:${AZUL};mix-blend-mode:soft-light;opacity:.28"></div>
<div class="cheio" style="background:linear-gradient(90deg,rgba(2,28,54,0) 0%,rgba(2,28,54,.18) 34%,rgba(2,28,54,.86) 56%,${OXFORD} 78%),linear-gradient(0deg,rgba(2,28,54,.6),transparent 30%)"></div>
<div style="position:absolute;left:900px;right:0;top:0;bottom:0;overflow:hidden;animation:luz 1.8s ease-out .5s both">${bokeh(14, 0, 1020)}</div>
<div style="position:absolute;left:1090px;top:0;height:1080px;display:flex;flex-direction:column;justify-content:center;animation:deriva 7s cubic-bezier(.1,.6,.2,1) both">
  <div style="width:120px;height:4px;background:${OURO};margin-bottom:36px;transform-origin:left;animation:abre .8s ${IO} 1.35s both"></div>
  ${nome2(1.55, 178)}
  <div style="position:relative;width:620px;height:2px;margin-top:40px">
    <div class="cheio" style="background:linear-gradient(90deg,${OURO},#f0dc9e 50%,transparent);transform-origin:left;animation:abre 1.1s ${IO} 2.75s both"></div>
    <div style="position:absolute;top:-22px;left:0;width:150px;height:46px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,244,214,.95),rgba(240,214,150,.35) 45%,transparent);opacity:0;animation:faisca 1.3s ${IO} 3.05s both"></div></div></div>
<div class="cheio" style="background:radial-gradient(80% 80% at 50% 50%,transparent 55%,rgba(1,10,22,.6) 100%)"></div>
${grao(.22)}
<style>
@keyframes revela{from{opacity:0;filter:blur(26px) brightness(.5)}to{opacity:1;filter:blur(0) brightness(1)}}
@keyframes zoomLento{from{transform:scale(1.02)}to{transform:scale(1.12)}}
@keyframes deriva{from{transform:translateX(26px)}to{transform:translateX(-8px)}}
@keyframes faisca{0%{opacity:0;transform:translateX(-60px)}15%{opacity:1}80%{opacity:1}100%{opacity:0;transform:translateX(520px)}}
</style></div>`,
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

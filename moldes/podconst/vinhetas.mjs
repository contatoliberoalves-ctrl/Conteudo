// Vinhetas de abertura do PodConst (vídeo 16:9, 1920×1080, 6 s, 30 fps).
// Cada vinheta é uma página com animações CSS; o script avança o relógio das
// animações quadro a quadro, tira um print de cada um e o ffmpeg monta o MP4.
//   node vinhetas.mjs [onda|faixas|noar]
// Logo oficial em marca/ (fora do git; ver README). Trilha opcional: saida/vinhetas/<id>.mp3.
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const saida = path.join(root, 'saida', 'vinhetas');
const FPS = 30, DUR = 6;
const AZUL = '#0a3aa6', NAVY = '#071a4d', MAG = '#e224d6', AMAR = '#f7f400', TINTA = '#111';
const marca = (arq) => 'file://' + path.join(root, 'marca', arq);

const BASE = `<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1920px;height:1080px;overflow:hidden;background:#000}
.palco{position:relative;width:1920px;height:1080px;overflow:hidden;font-family:'Space Grotesk',sans-serif}
.abs{position:absolute}
.logo{position:absolute;left:50%;top:50%;width:1240px;margin:-354px 0 0 -620px}
.etq{position:absolute;font-family:'Bebas Neue',sans-serif;font-size:66px;letter-spacing:2px;padding:8px 26px 2px;border:5px solid ${TINTA};box-shadow:8px 8px 0 ${TINTA};white-space:nowrap}
@keyframes pulsa{from{transform:scaleY(.25)}to{transform:scaleY(1)}}
@keyframes some{to{opacity:0}}
@keyframes surge{from{opacity:0}to{opacity:1}}
@keyframes estoura{0%{transform:scale(0) rotate(-14deg);opacity:0}60%{transform:scale(1.12) rotate(3deg);opacity:1}80%{transform:scale(.97) rotate(-1deg)}100%{transform:scale(1) rotate(0);opacity:1}}
@keyframes respira{from{transform:scale(1)}to{transform:scale(1.035)}}
@keyframes sobe{from{transform:translateY(160px) rotate(var(--r,0deg));opacity:0}to{transform:translateY(0) rotate(var(--r,0deg));opacity:1}}
</style>`;

// Barras de onda sonora (as mesmas 5 do "O" do logo), em tamanho de palco.
const onda = (cor, alturas, larg = 46, vao = 34) => alturas.map((h, i) =>
  `<span style="display:block;width:${larg}px;height:${h}px;border-radius:${larg}px;background:${cor};margin:0 ${vao / 2}px;animation:pulsa ${0.26 + (i % 3) * 0.07}s ${-i * 0.11}s ease-in-out infinite alternate"></span>`).join('');

const VINHETAS = {
  // 1 · ONDA: a onda sonora pulsa no azul, um círculo amarelo toma a tela e o logo estoura.
  onda: `<div class="palco" style="background:radial-gradient(circle at 50% 45%,#1552d8,${AZUL} 45%,#061f66)">
<div class="abs" style="inset:0;background-image:radial-gradient(rgba(255,255,255,.13) 3px,transparent 3.5px);background-size:46px 46px;animation:some .4s 1.9s both"></div>
<div class="abs" style="inset:0;display:flex;align-items:center;justify-content:center;animation:surge .35s both, some .25s 2s forwards">
  <div style="display:flex;align-items:center;animation:respira .5s ease-in-out infinite alternate">${onda(AMAR, [300, 190, 520, 380, 250], 70, 56)}</div></div>
<div class="abs" style="left:50%;top:50%;width:2400px;height:2400px;margin:-1200px;border-radius:50%;background:${TINTA};animation:abre .55s 1.82s cubic-bezier(.7,0,.2,1) both"></div>
<div class="abs" style="left:50%;top:50%;width:2400px;height:2400px;margin:-1200px;border-radius:50%;background:${MAG};animation:abre .55s 1.9s cubic-bezier(.7,0,.2,1) both"></div>
<div class="abs" style="left:50%;top:50%;width:2400px;height:2400px;margin:-1200px;border-radius:50%;background:${AMAR};animation:abre .55s 2s cubic-bezier(.7,0,.2,1) both"></div>
<div class="abs" style="inset:0;background-image:radial-gradient(rgba(17,17,17,.1) 3px,transparent 3.5px);background-size:46px 46px;animation:surge .3s 2.5s both"></div>
<div class="abs" style="inset:0;animation:respira 1.6s 3.2s ease-in-out infinite alternate">
  <img class="logo" src="${marca('2-POD.png')}" style="margin-top:-400px;animation:estoura .7s 2.25s cubic-bezier(.3,1.3,.5,1) both"></div>
<div class="etq" style="left:455px;top:846px;background:${NAVY};color:#fff;--r:-4deg;animation:sobe .45s 3.05s cubic-bezier(.2,1.4,.4,1) both">LÍBERO FILHO</div>
<div class="etq" style="left:985px;top:832px;background:${MAG};color:#fff;--r:3deg;animation:sobe .45s 3.25s cubic-bezier(.2,1.4,.4,1) both">NATÁLIA VALENÇA</div>
<style>@keyframes abre{from{transform:scale(0)}to{transform:scale(1)}}</style></div>`,

  // 2 · FAIXAS: faixas inclinadas (o ângulo do logo) varrem a tela e o logo bate no magenta.
  faixas: (() => {
    const faixa = (cor, t, dir = 1) => `<div class="abs" style="left:-25%;top:-40%;width:150%;height:180%;background:${cor};transform-origin:center;animation:varre${dir > 0 ? 'D' : 'E'} .5s ${t}s cubic-bezier(.75,0,.2,1) both"></div>`;
    const fita = (txt, cor, fundo, pos, anim, t) => `<div class="abs" style="${pos};left:-200px;width:2400px;height:104px;background:${fundo};border-top:6px solid ${TINTA};border-bottom:6px solid ${TINTA};overflow:hidden;transform:rotate(-12deg);animation:surge .01s ${t}s both">
  <div style="white-space:nowrap;font-family:'Bebas Neue',sans-serif;font-size:76px;line-height:100px;letter-spacing:4px;color:${cor};animation:${anim} 9s ${t}s linear infinite">${(txt + ' ✦ ').repeat(14)}</div></div>`;
    return `<div class="palco" style="background:#f4f6fb">
<div class="abs" style="inset:0;display:flex;align-items:center;justify-content:center;animation:some .2s .5s forwards"><div style="display:flex;align-items:center">${onda(AZUL, [150, 95, 260, 190, 125])}</div></div>
${faixa(AZUL, 0.25, 1)}${faixa(AMAR, 0.6, -1)}${faixa(NAVY, 0.95, 1)}${faixa(`linear-gradient(135deg,#ea2ee0,#c515c2)`, 1.3, -1)}
<div class="abs" style="inset:0;background-image:radial-gradient(rgba(255,255,255,.16) 3px,transparent 3.5px);background-size:46px 46px;animation:surge .3s 1.8s both"></div>
${fita('PODCONST · NO AR', AMAR, NAVY, 'top:70px', 'correE', 2.15)}
${fita('LÍBERO FILHO · NATÁLIA VALENÇA', TINTA, AMAR, 'bottom:70px', 'correD', 2.3)}
<div class="abs" style="inset:0;animation:treme .35s 1.98s both">
  <div class="abs" style="inset:0;animation:respira 1.6s 2.6s ease-in-out infinite alternate">
  <img class="logo" src="${marca('3-POD.png')}" style="animation:bate .32s 1.7s cubic-bezier(.6,0,.9,.4) both"></div></div>
<div class="abs" style="inset:0;background:#fff;opacity:0;animation:clarao .3s 1.98s forwards"></div>
<style>
@keyframes varreD{from{transform:rotate(-12deg) translateX(-105%)}to{transform:rotate(-12deg) translateX(0)}}
@keyframes varreE{from{transform:rotate(-12deg) translateX(105%)}to{transform:rotate(-12deg) translateX(0)}}
@keyframes bate{from{transform:scale(3.4) rotate(8deg);opacity:0}30%{opacity:1}to{transform:scale(1) rotate(0);opacity:1}}
@keyframes treme{0%{transform:translate(0,0)}20%{transform:translate(-18px,14px)}40%{transform:translate(14px,-10px)}60%{transform:translate(-8px,6px)}80%{transform:translate(4px,-3px)}100%{transform:translate(0,0)}}
@keyframes clarao{0%{opacity:.75}100%{opacity:0}}
@keyframes correE{from{transform:translateX(0)}to{transform:translateX(-900px)}}
@keyframes correD{from{transform:translateX(-900px)}to{transform:translateX(0)}}
</style></div>`;
  })(),

  // 3 · NO AR: estúdio à noite; a placa NO AR acende, anéis saem do centro e o logo aparece em adesivo.
  noar: (() => {
    const anel = (cor, t) => `<div class="abs" style="left:50%;top:50%;width:300px;height:300px;margin:-150px;border-radius:50%;border:7px solid ${cor};opacity:0;animation:anel 2.4s ${t}s cubic-bezier(.2,.6,.3,1) infinite"></div>`;
    const eq = Array.from({ length: 48 }, (_, i) => {
      const h = 60 + Math.round(170 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.45)));
      const cor = [MAG, AMAR, '#0066ff'][i % 3];
      return `<span style="flex:1;height:${h}px;margin:0 7px;border-radius:10px 10px 0 0;background:${cor};transform-origin:bottom;animation:pulsa ${0.3 + (i % 5) * 0.06}s ${-(i % 7) * 0.09}s ease-in-out infinite alternate"></span>`;
    }).join('');
    return `<div class="palco" style="background:radial-gradient(circle at 50% 48%,#12348f,${NAVY} 55%,#030c26)">
${anel(MAG, 0.5)}${anel(AMAR, 1.3)}${anel('#0066ff', 2.1)}
<div class="abs" style="left:0;right:0;bottom:0;height:240px;display:flex;align-items:flex-end;padding:0 30px;opacity:.9;animation:ergue .7s .7s cubic-bezier(.2,1,.3,1) both">${eq}</div>
<div class="abs" style="left:0;right:0;bottom:0;height:300px;background:linear-gradient(transparent,rgba(3,12,38,.55))"></div>
<div class="abs" style="left:50%;top:78px;margin-left:-150px;width:300px;height:96px;border-radius:14px;border:5px solid #ff2d55;display:flex;align-items:center;justify-content:center;gap:18px;font-family:'Bebas Neue',sans-serif;font-size:64px;letter-spacing:6px;padding-top:6px;color:#ff2d55;box-shadow:0 0 34px rgba(255,45,85,.75),inset 0 0 22px rgba(255,45,85,.45);text-shadow:0 0 18px rgba(255,45,85,.9);animation:acende .9s .25s both">
  <span style="width:24px;height:24px;margin-top:-6px;border-radius:50%;background:#ff2d55;box-shadow:0 0 16px #ff2d55;animation:pisca .5s 1.2s ease-in-out infinite alternate"></span>NO AR</div>
<div class="abs" style="inset:0;animation:respira 1.6s 2.9s ease-in-out infinite alternate">
  <img class="logo" src="${marca('1-POD-adesivo.png')}" style="margin-top:-380px;filter:drop-shadow(0 26px 40px rgba(0,0,0,.5));animation:estoura .75s 1.85s cubic-bezier(.3,1.3,.5,1) both"></div>
<div class="abs" style="left:0;right:0;top:826px;text-align:center;font-size:40px;font-weight:700;letter-spacing:9px;color:#fff;text-shadow:0 4px 18px rgba(0,0,0,.7);animation:sobe .5s 2.9s cubic-bezier(.2,1,.3,1) both">LÍBERO FILHO <span style="color:${AMAR}">+</span> NATÁLIA VALENÇA</div>
<style>
@keyframes anel{from{transform:scale(.3);opacity:.9}to{transform:scale(7);opacity:0}}
@keyframes ergue{from{transform:scaleY(0);transform-origin:bottom}to{transform:scaleY(1);transform-origin:bottom}}
@keyframes acende{0%{opacity:0}18%{opacity:1}26%{opacity:.15}40%{opacity:1}52%{opacity:.3}64%,100%{opacity:1}}
@keyframes pisca{from{opacity:1}to{opacity:.25}}
</style></div>`;
  })(),
};

const filtro = process.argv[2];
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
  fs.writeFileSync(html, `<!doctype html><meta charset="utf-8">${BASE}${corpo}`);
  await page.goto('file://' + html);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  await page.evaluate(() => document.getAnimations().forEach((a) => a.pause()));
  for (let q = 0; q < FPS * DUR; q++) {
    await page.evaluate((ms) => document.getAnimations().forEach((a) => { a.currentTime = ms; }), (q / FPS) * 1000);
    await page.screenshot({ path: path.join(quadros, String(q).padStart(4, '0') + '.jpg'), type: 'jpeg', quality: 96 });
  }
  const mp3 = path.join(saida, id + '.mp3');
  const audio = fs.existsSync(mp3) ? ['-i', mp3, '-af', `apad,afade=t=out:st=${DUR - 0.7}:d=0.7,loudnorm=I=-16:TP=-1.5`, '-c:a', 'aac', '-b:a', '192k'] : [];
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(quadros, '%04d.jpg'), ...audio,
    '-t', String(DUR), '-c:v', 'libx264', '-crf', '16', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    path.join(saida, `podconst-vinheta-${id}.mp4`)]);
  fs.rmSync(quadros, { recursive: true, force: true });
  console.log('✓', `saida/vinhetas/podconst-vinheta-${id}.mp4`, audio.length ? '(com trilha)' : '(sem trilha)');
}
await browser.close();

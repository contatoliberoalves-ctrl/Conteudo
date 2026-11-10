// Vinheta de abertura da PratFlix (vídeo 16:9, 1920×1080, 6 s, 30 fps).
// Animação em CSS fotografada quadro a quadro (relógio das animações avançado à mão) e montada com o ffmpeg.
//   node vinheta.mjs   → saida/vinheta/pratflix-vinheta.mp4
// Trilha opcional: saida/vinheta/trilha.mp3 (entra no vídeo se existir).
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const root = path.dirname(new URL(import.meta.url).pathname);
const { chromium } = createRequire(path.join(root, 'package.json'))('playwright');
import { FONTES } from './template.mjs';

const FPS = 30, DUR = 6;
const C = { bg: '#121212', areia: '#E3D6B4', areia2: '#C9B88E', txt: '#EDEAE3' };
const E = 'cubic-bezier(.2,.8,.2,1)';
const grao = `<div style="position:absolute;inset:0;pointer-events:none;opacity:.16;mix-blend-mode:overlay;background-image:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E&quot;)"></div>`;
const anel = (d, t, op) => `<div class="c" style="width:${d}px;height:${d}px;margin:${-d / 2}px;border-radius:50%;border:2px solid ${C.areia};opacity:0;animation:anel 1.1s ${E} ${t}s forwards;--o:${op}"></div>`;
const letras = [...'pratflix'].map((l, i) => `<span style="display:inline-block;animation:letra .6s ${E} ${(2.0 + i * 0.07).toFixed(2)}s both">${l}</span>`).join('');

const html = `<!doctype html><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet"><style>
*{box-sizing:border-box;margin:0}
html,body{width:1920px;height:1080px;overflow:hidden;background:${C.bg}}
.v{position:relative;width:1920px;height:1080px;overflow:hidden;color:${C.txt};font-family:Manrope,sans-serif}
.c{position:absolute;left:50%;top:50%}
@keyframes luz{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:scale(1)}}
@keyframes anel{from{opacity:0;transform:scale(.35)}to{opacity:var(--o);transform:scale(1)}}
@keyframes selo{0%{opacity:0;transform:scale(.3) rotate(-18deg)}65%{opacity:1;transform:scale(1.08) rotate(2deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
@keyframes seloSai{to{opacity:0;transform:scale(.5) translateY(-60px)}}
@keyframes aneisSaem{to{opacity:0;transform:scale(1.5)}}
@keyframes letra{from{opacity:0;transform:translateY(110px)}to{opacity:1;transform:none}}
@keyframes seta{0%{opacity:0;transform:translateX(-90px) scale(.4)}70%{opacity:1;transform:translateX(8px) scale(1.15)}100%{opacity:1;transform:none}}
@keyframes barra{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes lema{from{opacity:0;letter-spacing:.9em}to{opacity:.8;letter-spacing:.42em}}
@keyframes brilho{from{transform:translateX(-700px) skewX(-18deg)}to{transform:translateX(2400px) skewX(-18deg)}}
@keyframes respira{from{transform:scale(1)}to{transform:scale(1.03)}}
</style><div class="v">
<div style="position:absolute;inset:0;background:radial-gradient(60% 70% at 50% 46%,#2e2a20 0%,${C.bg} 72%);animation:luz 1.4s ${E} .1s both"></div>
<div style="position:absolute;inset:0;animation:aneisSaem .6s ${E} 1.75s forwards">${anel(760, .35, .22)}${anel(560, .5, .32)}</div>
<div class="c" style="width:260px;height:260px;margin:-130px;animation:seloSai .4s ${E} 1.75s forwards">
  <div style="width:260px;height:260px;border-radius:62px;background:linear-gradient(135deg,${C.areia},${C.areia2});display:grid;place-items:center;box-shadow:0 30px 80px rgba(0,0,0,.6);animation:selo .8s ${E} .55s both">
    <span style="font:800 205px/1 Manrope;letter-spacing:-.06em;color:#121212;margin:-32px 0 0 8px">p<span style="font-size:.42em;vertical-align:.32em;margin-left:2px">▸</span></span></div></div>
<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;animation:respira 2.6s ease-in-out 3.2s infinite alternate">
  <div style="position:relative;overflow:hidden;padding:20px 40px 44px">
    <div style="font:800 300px/1 Manrope;letter-spacing:-.05em;white-space:nowrap">${letras}<span style="display:inline-block;font-size:.55em;vertical-align:.25em;margin-left:8px;color:${C.areia};animation:seta .55s ${E} 2.62s both">▸</span></div>
    <div style="position:absolute;top:0;bottom:0;left:0;width:260px;background:linear-gradient(90deg,transparent,rgba(227,214,180,.38),transparent);mix-blend-mode:overlay;animation:brilho 1.1s ease-in-out 3.25s both"></div></div>
  <div style="width:220px;height:8px;background:${C.areia};margin-top:6px;animation:barra .6s ${E} 2.95s both"></div>
  <div style="font:600 40px Manrope;letter-spacing:.42em;margin:38px 0 0 .42em;white-space:nowrap;animation:lema .9s ${E} 3.15s both">A ADVOCACIA NA PRÁTICA</div></div>
${grao}</div>`;

const saida = path.join(root, 'saida', 'vinheta');
const quadros = path.join(saida, 'quadros');
fs.rmSync(quadros, { recursive: true, force: true });
fs.mkdirSync(quadros, { recursive: true });
fs.writeFileSync(path.join(saida, 'vinheta.html'), html);

const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto('file://' + path.join(saida, 'vinheta.html'));
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(500);
await page.evaluate(() => document.getAnimations().forEach((a) => a.pause()));
for (let q = 0; q < FPS * DUR; q++) {
  await page.evaluate((ms) => document.getAnimations().forEach((a) => { a.currentTime = ms; }), (q / FPS) * 1000);
  await page.screenshot({ path: path.join(quadros, String(q).padStart(4, '0') + '.jpg'), type: 'jpeg', quality: 96 });
}
await browser.close();

const mp3 = path.join(saida, 'trilha.mp3');
const audio = fs.existsSync(mp3) ? ['-i', mp3, '-af', `apad,afade=t=out:st=${DUR - 0.7}:d=0.7,loudnorm=I=-16:TP=-1.5`, '-c:a', 'aac', '-b:a', '192k'] : [];
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(quadros, '%04d.jpg'), ...audio,
  '-t', String(DUR), '-c:v', 'libx264', '-crf', '16', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
  path.join(saida, 'pratflix-vinheta.mp4')]);
fs.rmSync(quadros, { recursive: true, force: true });
console.log('✓ saida/vinheta/pratflix-vinheta.mp4', audio.length ? '(com trilha)' : '(sem trilha)');

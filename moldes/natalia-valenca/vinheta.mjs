// Vinheta de abertura do canal da Natália Valença no YouTube ("Advocacia na Prática"), 1920×1080, 6 s, 30 fps.
// Identidade do banner do canal: navy, dourado, serifa de alto contraste (Playfair Display), Poppins e assinatura cursiva.
// Animação em CSS fotografada quadro a quadro e montada com o ffmpeg.
//   ln -sfn /opt/node-tools/node_modules ../node_modules   (na nuvem, para achar o playwright)
//   CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node vinheta.mjs → saida/natalia-vinheta.mp4
// Trilha opcional: saida/trilha.mp3 (entra no vídeo se existir).
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const root = path.dirname(new URL(import.meta.url).pathname);
const FPS = 30, DUR = 6;
const NAVY = '#0b1c3d', OURO = '#e3a93f', OURO2 = '#c99a5b', CREME = '#f1ece0';
const E = 'cubic-bezier(.2,.8,.2,1)';
const grao = `<div style="position:absolute;inset:0;pointer-events:none;opacity:.2;mix-blend-mode:overlay;background-image:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E&quot;)"></div>`;
// cada palavra sobe de trás de uma máscara
// brilho que atravessa a palavra (só dentro das letras)
const LUSTRO = (t) => `, lustro 1.1s ease-in-out ${t}s both;background:linear-gradient(100deg,${OURO} 42%,#fff1c4 50%,${OURO} 58%) 100% 0/320% 100%;-webkit-background-clip:text;background-clip:text;color:transparent`;
const sobe = (txt, t, estilo = '') => `<span style="display:inline-block;overflow:hidden;vertical-align:bottom;padding:.12em .04em .2em;margin:-.12em -.04em -.2em"><span style="display:inline-block;animation:sobe .85s ${E} ${t}s both${estilo}">${txt}</span></span>`;

const html = `<!doctype html><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Poppins:wght@300;400;500&family=Mrs+Saint+Delafield&display=swap" rel="stylesheet"><style>
*{box-sizing:border-box;margin:0}
html,body{width:1920px;height:1080px;overflow:hidden;background:${NAVY}}
.v{position:relative;width:1920px;height:1080px;overflow:hidden;color:${CREME};font-family:Poppins,sans-serif}
.fantasma{position:absolute;font:800 1250px/1 'Playfair Display',serif;color:transparent;-webkit-text-stroke:2px rgba(227,169,63,.09)}
@keyframes luz{from{opacity:0}to{opacity:1}}
@keyframes sobe{from{transform:translateY(115%)}to{transform:none}}
@keyframes deriva{from{transform:translateX(0)}to{transform:translateX(-70px)}}
@keyframes derivaD{from{transform:translateX(0)}to{transform:translateX(70px)}}
@keyframes fio{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes fioV{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes surge{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
@keyframes escreve{from{clip-path:inset(-40% 100% -40% 0)}to{clip-path:inset(-40% -6% -40% 0)}}
@keyframes lustro{from{background-position:100% 0}to{background-position:0 0}}
@keyframes respira{from{transform:scale(1)}to{transform:scale(1.025)}}
</style><div class="v">
<div style="position:absolute;inset:0;background:radial-gradient(70% 80% at 50% 48%,#17306a 0%,${NAVY} 62%,#071229 100%);animation:luz 1.2s ease-out both"></div>
<div style="position:absolute;inset:0;animation:luz 1.6s ease-out .2s both">
  <div class="fantasma" style="left:-120px;top:-210px;animation:deriva 6s linear both">N</div>
  <div class="fantasma" style="right:-140px;top:-40px;animation:derivaD 6s linear both">V</div></div>
<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;animation:respira 2.8s ease-in-out 3.6s infinite alternate">
  <div style="width:150px;height:3px;background:${OURO};margin-bottom:44px;animation:fio .8s ${E} .35s both"></div>
  <div style="position:relative;font:800 168px/1.05 'Playfair Display',serif;color:${OURO};white-space:nowrap;letter-spacing:-.015em">
    ${sobe('Advocacia', 0.7, LUSTRO(2.9))} <span style="font-size:.5em;font-weight:700;color:${CREME};letter-spacing:0;position:relative;top:-.12em;margin:0 .08em">${sobe('na', 1.0)}</span> ${sobe('Prática', 1.2, LUSTRO(3.15))}</div></div>
  <div style="display:flex;align-items:center;margin-top:34px;white-space:nowrap">
    <div style="font:400 46px Poppins;letter-spacing:.005em;animation:surge .7s ${E} 2.15s both">Tributário, Eleitoral e Constitucional</div>
    <div style="width:2px;height:66px;background:${OURO};margin:0 36px;animation:fioV .5s ${E} 2.6s both"></div>
    <div style="font:400 104px/1 'Mrs Saint Delafield',cursive;color:${OURO};padding:0 16px 0 4px;margin-top:8px;animation:escreve 1.15s cubic-bezier(.45,0,.3,1) 2.8s both">Natália Valença</div></div>
</div>
<div style="position:absolute;left:0;right:0;bottom:64px;text-align:center;font:300 30px Poppins;letter-spacing:.02em;color:${CREME};animation:surge .7s ${E} 3.9s both">@<b style="font-weight:500">natalia</b>valenca</div>
${grao}</div>`;

const saida = path.join(root, 'saida'), quadros = path.join(saida, 'quadros');
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
await page.waitForTimeout(600);
await page.evaluate(() => document.getAnimations().forEach((a) => a.pause()));
for (let q = 0; q < FPS * DUR; q++) {
  await page.evaluate((ms) => document.getAnimations().forEach((a) => { a.currentTime = ms; }), (q / FPS) * 1000);
  await page.screenshot({ path: path.join(quadros, String(q).padStart(4, '0') + '.jpg'), type: 'jpeg', quality: 96 });
}
await browser.close();
const mp3 = path.join(saida, 'trilha.mp3');
const audio = fs.existsSync(mp3) ? ['-i', mp3, '-af', `apad,afade=t=out:st=${DUR - 0.7}:d=0.7,loudnorm=I=-16:TP=-1.5`, '-c:a', 'aac', '-b:a', '192k'] : [];
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(quadros, '%04d.jpg'), ...audio,
  '-t', String(DUR), '-c:v', 'libx264', '-crf', '16', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', path.join(saida, 'natalia-vinheta.mp4')]);
fs.rmSync(quadros, { recursive: true, force: true });
console.log('✓ saida/natalia-vinheta.mp4', audio.length ? '(com trilha)' : '(sem trilha)');

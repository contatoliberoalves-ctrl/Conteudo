// Renderiza os cards do gen.py (index.html com a timeline GSAP em window.__timelines.main)
// quadro a quadro com o Playwright/Chromium já instalado, sem depender do "npx hyperframes".
// Uso: node render_cards.mjs <pasta-dos-cards> <saida.mp4> [fps=25] [altura=864]
//   Só a faixa de cima (0..altura) é capturada: é a única parte que o compose.sh usa.
// Nuvem do Claude Code: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render_cards.mjs cards cards/cards_all.mp4
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const [dir, out, fpsArg, hArg] = process.argv.slice(2);
if (!dir || !out) { console.error('uso: node render_cards.mjs <pasta> <saida.mp4> [fps] [altura]'); process.exit(1); }
const FPS = +(fpsArg || 25), H = +(hArg || 864), W = 1080;
const opts = {};
if (process.env.CHROMIUM_PATH) opts.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(opts, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(opts);
const page = await browser.newPage({ viewport: { width: W, height: 1920 }, deviceScaleFactor: 1, ignoreHTTPSErrors: true });
page.on('pageerror', (e) => console.error('erro na página:', e.message));
page.on('requestfailed', (r) => console.error('falhou:', r.url(), r.failure() && r.failure().errorText));
await page.goto('file://' + path.resolve(dir, 'index.html'));
await page.waitForFunction(() => !!(window.__timelines && window.__timelines.main), null, { timeout: 60000, polling: 250 });
await page.evaluate(() => document.fonts && document.fonts.ready);
// duração = data-duration do #root (o gen.py grava o TOTAL ali)
const dur = await page.evaluate(() => parseFloat(document.getElementById('root').dataset.duration));
// O gen.py usa data-start/data-duration por batida (convenção do HyperFrames): aqui a gente
// mostra/esconde cada clipe conforme o tempo, como o HyperFrames faz.
const n = Math.ceil(dur * FPS);
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-vf', `pad=${W}:1920:0:0:black`, out], { stdio: ['pipe', 'inherit', 'inherit'] });
for (let i = 0; i < n; i++) {
  const t = i / FPS;
  await page.evaluate((t) => {
    window.__timelines.main.seek(t, false);
    document.querySelectorAll('[data-start]').forEach((el) => {
      if (el.id === 'root') return;
      const s = parseFloat(el.dataset.start), d = parseFloat(el.dataset.duration);
      el.style.visibility = (t >= s && t < s + d) ? 'visible' : 'hidden';
    });
  }, t);
  const buf = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: W, height: H } });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  if (i % 100 === 0) process.stdout.write(`  quadro ${i}/${n}\r`);
}
ff.stdin.end();
await new Promise((r) => ff.on('close', r));
await browser.close();
console.log(`OK ${out} (${n} quadros, ${dur}s, ${FPS} fps, faixa ${W}x${H} sobre 1080x1920)`);

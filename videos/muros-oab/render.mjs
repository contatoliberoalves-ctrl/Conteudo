// Uso:
//   node render.mjs contato          -> saida/contato.jpg (2 quadros por segundo)
//   node render.mjs video            -> saida/video-mudo.mp4 (30 fps, desfoque de movimento com 2 subquadros)
//   node render.mjs quadro 6.6 9.9   -> saida/q-6.6.jpg ...
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const saida = path.join(dir, 'saida');
mkdirSync(saida, { recursive: true });
const modo = process.argv[2] || 'contato';

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ['--allow-file-access-from-files'],
});
const page = await browser.newPage({ viewport: { width: 720, height: 1280 } });
page.on('console', m => console.log('[page]', m.text()));
page.on('pageerror', e => { console.error('[erro]', e.message); process.exit(1); });
await page.goto('file://' + path.join(dir, 'index.html'));
const info = await page.evaluate(() => window.ready);
console.log(JSON.stringify(info));

const jpeg = async (n, label = false) => Buffer.from((await page.evaluate(([n, l]) => window.frame(n, l), [n, label])).split(',')[1], 'base64');

function ffmpeg(args) {
  const p = spawn('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...args], { stdio: ['pipe', 'inherit', 'inherit'] });
  return { p, done: new Promise((ok, no) => p.on('close', c => c ? no(new Error('ffmpeg ' + c)) : ok())) };
}

if (modo === 'contato') {
  const f = ffmpeg(['-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', '1', '-i', '-',
    '-vf', 'scale=180:320,tile=8x4:padding=4:color=black', '-frames:v', '1', '-q:v', '2', path.join(saida, 'contato.jpg')]);
  for (let s = 0; s < 32; s++) f.p.stdin.write(await jpeg(s * 15, true));
  f.p.stdin.end(); await f.done;
  console.log('saida/contato.jpg');
} else if (modo === 'quadro') {
  for (const t of process.argv.slice(3)) writeFileSync(path.join(saida, `q-${t}.jpg`), await jpeg(Math.round(parseFloat(t) * 30)));
} else if (modo === 'video') {
  const f = ffmpeg(['-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', '30', '-i', '-',
    '-c:v', 'libx264', '-crf', '16', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-r', '30',
    path.join(saida, 'video-mudo.mp4')]);
  for (let n = 0; n < 480; n++) {
    const ok = f.p.stdin.write(await jpeg(n));
    if (!ok) await new Promise(r => f.p.stdin.once('drain', r));
    if (n % 60 === 0) console.log('quadro', n);
  }
  f.p.stdin.end(); await f.done;
  console.log('saida/video-mudo.mp4');
}
await browser.close();

// quadros.cjs <pasta> <saida.png> t1 t2 ... : tira quadros da timeline e junta lado a lado (para conferir)
const { chromium } = require('playwright');
(async () => {
  const [dir, out, ...ts] = process.argv.slice(2);
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy: { server: process.env.HTTPS_PROXY }, args: ['--ignore-certificate-errors'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.log('ERRO', e.message));
  await p.goto('file://' + require('path').resolve(dir, 'index.html'));
  await p.waitForFunction(() => !!(window.__timelines && window.__timelines.main), null, { polling: 250, timeout: 60000 });
  await p.evaluate(() => document.fonts.ready);
  const fs = require('fs'); const tmp = [];
  for (const [i, t] of ts.entries()) {
    await p.evaluate((t) => { window.__timelines.main.seek(+t, false); document.querySelectorAll('[data-start]').forEach(() => {}); }, t);
    await p.waitForTimeout(60);
    const f = `${out}.${i}.png`; await p.screenshot({ path: f }); tmp.push(f);
  }
  await b.close();
  const { execFileSync } = require('child_process');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...tmp.flatMap(f => ['-i', f]), '-filter_complex', tmp.map((_, i) => `[${i}]scale=270:480[s${i}]`).join(';') + ';' + tmp.map((_, i) => `[s${i}]`).join('') + `hstack=${tmp.length}`, out]);
  tmp.forEach(f => fs.unlinkSync(f));
})();

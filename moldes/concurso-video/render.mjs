// Renderiza os vídeos narrados. Uso: node render.mjs [id …]  (sem id: todos os de src/videos.gerado.json)
// Saída: saida/<id>/<id>.mp4 (1080×1920, H.264) e saida/<id>/capa.png (capa do Reels, quadro do fim do gancho).
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const videos = JSON.parse(fs.readFileSync('src/videos.gerado.json'));
const ids = process.argv.slice(2).length ? process.argv.slice(2) : videos.map(v => v.id);
const browserExecutable = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
for (const id of ids) {
  const v = videos.find(x => x.id === id);
  if (!v) { console.error(`✗ ${id}: rode antes node narrar.mjs ${id}`); continue; }
  const comp = await selectComposition({ serveUrl, id, browserExecutable });
  const dir = `saida/${id}`; fs.mkdirSync(dir, { recursive: true });
  let ultimo = -1;
  await renderMedia({ serveUrl, composition: comp, codec: 'h264', crf: 17, outputLocation: `${dir}/${id}.mp4`, browserExecutable,
    concurrency: Number(process.env.CONCORRENCIA || 3), overwrite: true, timeoutInMilliseconds: 120000,
    onProgress: ({ progress }) => { const p = Math.floor(progress * 10); if (p !== ultimo) { ultimo = p; process.stdout.write(`${id} ${p * 10}%\r`); } } });
  // Volume no padrão das redes (-14 LUFS), sem reencodar o vídeo.
  normalizar(`${dir}/${id}.mp4`);
  // Capa: fim da 1ª cena (gancho já montado), antes da transição.
  const fimGancho = Math.round((0.25 + v.tempo.cenas[1].ini) * 30) - 14;
  await renderStill({ serveUrl, composition: comp, frame: Math.max(45, fimGancho), output: `${dir}/capa.png`, browserExecutable, overwrite: true });
  console.log(`✓ ${dir}/${id}.mp4 (${(comp.durationInFrames / 30).toFixed(1)} s) e capa.png`);
}

function normalizar(arq) {
  const tmp = arq.replace(/\.mp4$/, '.tmp.mp4');
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', arq, '-c:v', 'copy', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', tmp]);
  fs.renameSync(tmp, arq);
}
export { normalizar };

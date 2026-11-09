// Confere quadros soltos de um vídeo (sem renderizar tudo). Uso: node quadros.mjs <id> <quadro> [quadro…]
// Salva em saida/<id>/quadros/<quadro>.png e uma folha de contato saida/<id>/quadros/folha.png (meia resolução).
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const [id, ...qs] = process.argv.slice(2);
const browserExecutable = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const comp = await selectComposition({ serveUrl, id, browserExecutable });
const dir = `saida/${id}/quadros`; fs.mkdirSync(dir, { recursive: true });
const arqs = [];
for (const q of qs) {
  const out = `${dir}/${q}.png`;
  await renderStill({ serveUrl, composition: comp, frame: Math.min(+q, comp.durationInFrames - 1), output: out, browserExecutable, scale: 0.5, overwrite: true });
  arqs.push(out);
}
if (arqs.length === 1) fs.copyFileSync(arqs[0], `${dir}/folha.png`);
else try { execFileSync('ffmpeg', ['-v', 'error', '-y', ...arqs.flatMap(a => ['-i', a]), '-filter_complex', `hstack=inputs=${arqs.length}`, `${dir}/folha.png`]); } catch {}
console.log(`✓ ${dir}/folha.png`);

// Uso: node render.mjs [id ...]  (no ambiente em nuvem: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs)
// Gera saida/<id>/1.png (1080×1350 no feed, 1080×1920 nos stories). Avisa se faltar imagem em fotos/.
import fs from 'node:fs';
import path from 'node:path';
import { renderMolde } from '../renato-comum/render-base.mjs';
import { slides, fotosDe } from './template.mjs';
const root = path.dirname(new URL(import.meta.url).pathname);
const dados = JSON.parse(fs.readFileSync(path.join(root, 'dados.json'), 'utf8'));
const porId = Object.fromEntries(dados.map(c => [c.id, c]));
const faltam = new Set();
for (const b of dados) for (const f of fotosDe(b.de ? { ...porId[b.de], ...b } : b)) if (!fs.existsSync(path.join(root, 'fotos', f))) faltam.add(f);
if (faltam.size) { console.log('! faltam em fotos/ (ficam fora do git, veja o README):', [...faltam].join(', ')); process.exitCode = 1; }
await renderMolde(root, slides);

// Uso: node render.mjs [id ...]  (no ambiente em nuvem: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs)
import path from 'node:path';
import { renderMolde } from '../cartorio-comum/render-base.mjs';
import { HEAD_AMIGO } from '../cartorio-comum/amigo.mjs';
import { slides } from './template.mjs';
const root = path.dirname(new URL(import.meta.url).pathname);
await renderMolde(root, c => slides(c, root), HEAD_AMIGO);

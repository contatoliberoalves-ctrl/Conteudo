// Uso: node render.mjs [id ...]  (no ambiente em nuvem: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs)
import path from 'node:path';
import { renderMolde } from '../cartorio-comum/render-base.mjs';
import { slides } from './template.mjs';
await renderMolde(path.dirname(new URL(import.meta.url).pathname), slides);

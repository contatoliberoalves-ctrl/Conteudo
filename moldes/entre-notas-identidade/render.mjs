// Gera o kit da identidade do podcast Entre notas e registros (identidades/entre-notas-e-registros/kit.mjs:
// símbolo, logos, peças, pranchas e manual em PDF) e copia as pranchas para saida/manual-entre-notas/1.png…
// Uso: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs
import fs from 'node:fs';
import path from 'node:path';
const root = path.dirname(new URL(import.meta.url).pathname);
const kit = path.join(root, '../../identidades/entre-notas-e-registros');
await import(path.join(kit, 'kit.mjs'));
const de = path.join(kit, 'saida/pranchas'), para = path.join(root, 'saida/manual-entre-notas');
fs.rmSync(para, { recursive: true, force: true }); fs.mkdirSync(para, { recursive: true });
fs.readdirSync(de).sort().forEach((f, i) => fs.copyFileSync(path.join(de, f), path.join(para, `${i + 1}.png`)));
console.log('✓ manual-entre-notas', fs.readdirSync(para).length, 'pranchas');

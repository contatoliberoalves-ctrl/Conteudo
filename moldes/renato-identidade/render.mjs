// Gera o kit da identidade Brasa (identidades/interpretacao-biblica/brasa.mjs: logos, peças, pranchas e
// manual em PDF) e copia as pranchas para saida/manual-brasa/1.png… (o post da galeria).
// Uso: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs
import fs from 'node:fs';
import path from 'node:path';
const root = path.dirname(new URL(import.meta.url).pathname);
const kit = path.join(root, '../../identidades/interpretacao-biblica');
await import(path.join(kit, 'brasa.mjs'));
const de = path.join(kit, 'saida/brasa/pranchas'), para = path.join(root, 'saida/manual-brasa');
fs.rmSync(para, { recursive: true, force: true }); fs.mkdirSync(para, { recursive: true });
fs.readdirSync(de).sort().forEach((f, i) => fs.copyFileSync(path.join(de, f), path.join(para, `${i + 1}.png`)));
console.log('✓ manual-brasa', fs.readdirSync(para).length, 'pranchas');

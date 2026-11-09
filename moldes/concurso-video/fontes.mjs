// Embute as fontes de public/fonts em src/fontes.gerado.ts (base64), para o render não depender de buscar arquivo.
import fs from 'node:fs';
const F = [['Big Shoulders Display', 'BigShouldersDisplay.woff2', '100 900'], ['Inter', 'Inter.woff2', '100 900'], ['Sora', 'Sora.woff2', '100 800']];
fs.writeFileSync('src/fontes.gerado.ts', `export const FONTES: [string, string, string][] = ${JSON.stringify(F.map(([f, a, p]) => [f, fs.readFileSync(`public/fonts/${a}`).toString('base64'), p]))};\n`);
console.log('✓ src/fontes.gerado.ts');

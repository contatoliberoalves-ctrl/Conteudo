import { readFileSync } from 'node:fs';
// folha de conferência dos glifos (não vai para img/)
export function folha(glifos) {
  const ids = [...glifos.matchAll(/id="(g-[\w-]+)"/g)].map(m => m[1]);
  const corpo = `<rect width="1200" height="${Math.ceil(ids.length / 7) * 180}" fill="#FBF8F1"/>` + ids.map((id, i) => `<g transform="translate(${20 + (i % 7) * 168} ${14 + Math.floor(i / 7) * 180})" color="#0B2347"><use href="#${id}" width="130" height="130"/><use href="#${id}" x="134" y="96" width="30" height="30"/><text y="150" font-size="14" font-family="sans-serif">${id}</text></g>`).join('');
  const h = Math.ceil(ids.length / 7) * 180;
  return { w: 1200, h, esc: 1, svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 ${h}" width="1200" height="${h}"><defs>${glifos}</defs>${corpo}</svg>` };
}

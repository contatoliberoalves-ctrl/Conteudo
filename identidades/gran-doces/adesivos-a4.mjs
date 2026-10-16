// Folhas A4 de adesivos quadrados marrons da Gran Doces (6 × 6 cm, monograma GD + nome do doce + GRAN DOCES),
// no desenho da página "Gran Doces — Identidade Visual" (Dia a dia · Adesivos de brownie). 12 por folha, com
// margem de 8 mm para a impressora e marcas de corte discretas. Gera PDF vetorial e PNG a 300 dpi.
// Uso: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node adesivos-a4.mjs [Pudim Brownie …]
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const root = path.dirname(new URL(import.meta.url).pathname);
const { chromium } = createRequire('/opt/node-tools/node_modules/')('playwright');
const OUT = path.join(root, 'saida', 'adesivos-a4'); fs.mkdirSync(OUT, { recursive: true });
const C = { cacau: '#3B1F14', creme: '#FFF4E2', laranja: '#E59A2F' };
const nomes = process.argv.slice(2).length ? process.argv.slice(2) : ['Pudim', 'Brownie'];

// Adesivo 60 mm (as medidas internas seguem o original de 227 px = 60 mm).
const k = 60 / 227;
const adesivo = nome => `<div style="width:60mm;height:60mm;border-radius:${22 * k}mm;background:${C.cacau};color:${C.creme};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${8 * k}mm;text-align:center">
  <div style="font-family:Fraunces;font-weight:800;font-size:${76 * k}mm;letter-spacing:-.04em;line-height:1">G<i style="font-weight:600;color:${C.laranja}">D</i></div>
  <div style="font-family:Fraunces;font-weight:800;font-size:${30 * k}mm;line-height:1">${nome}</div>
  <div style="font-family:'DM Sans';font-weight:700;font-size:${10 * k}mm;letter-spacing:.34em;margin-right:-.34em">GRAN DOCES</div></div>`;
// Marcas de corte nos cantos (fora do adesivo).
const marcas = `<svg style="position:absolute;left:-3mm;top:-3mm;width:66mm;height:66mm;overflow:visible" viewBox="0 0 66 66"><g stroke="#B9A79B" stroke-width=".2">${[[3, 3], [63, 3], [3, 63], [63, 63]].map(([x, y]) => `<line x1="${x}" y1="${y + (y < 30 ? -2.5 : 2.5)}" x2="${x}" y2="${y + (y < 30 ? -.8 : .8)}"/><line x1="${x + (x < 30 ? -2.5 : 2.5)}" y1="${y}" x2="${x + (x < 30 ? -.8 : .8)}" y2="${y}"/>`).join('')}</g></svg>`;
// A4 com margem de 8 mm: 3 colunas × 4 linhas de 60 mm, espaços iguais.
const folha = nome => `<div style="width:210mm;height:297mm;position:relative;background:#fff;page-break-after:always">
  <div style="position:absolute;left:8mm;top:8mm;right:8mm;bottom:8mm;display:grid;grid-template-columns:repeat(3,60mm);grid-template-rows:repeat(4,60mm);justify-content:space-between;align-content:space-between">
  ${Array.from({ length: 12 }, () => `<div style="position:relative">${marcas}${adesivo(nome)}</div>`).join('')}</div></div>`;

const HEAD = `<meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600..900;1,9..144,600..900&family=DM+Sans:wght@700&display=swap" rel="stylesheet"><style>@page{size:210mm 297mm;margin:0}*{margin:0;box-sizing:border-box}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}</style>`;
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const b = await chromium.launch(launch);
for (const nome of nomes) {
  const p = await b.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 300 / 96 });
  await p.setContent(`<!doctype html><html><head>${HEAD}</head><body>${folha(nome)}</body></html>`);
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  const base = path.join(OUT, `Adesivo-quadrado-${nome}-Gran-Doces-A4`);
  await p.pdf({ path: base + '.pdf', preferCSSPageSize: true, printBackground: true });
  await p.screenshot({ path: base + '-300dpi.png', clip: { x: 0, y: 0, width: 794, height: 1123 } });
  await p.close(); console.log('✓', nome);
}
await b.close();

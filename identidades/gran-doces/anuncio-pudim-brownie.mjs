// Anúncio "Pudim no copo" e "Brownie de Brigadeiro" da Gran Doces: feed 1080×1350 e stories 1080×1920,
// um pra cada doce e um com os dois. Uso: CHROMIUM_PATH=... RENDER_PROXY=... node anuncio-pudim-brownie.mjs
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const root = path.dirname(new URL(import.meta.url).pathname);
const { chromium } = createRequire('/opt/node-tools/node_modules/')('playwright');
const OUT = path.join(root, 'saida', 'anuncio-pudim-brownie'); fs.mkdirSync(OUT, { recursive: true });
const C = { cacau: '#3B1F14', creme: '#FFF4E2', laranja: '#E59A2F', caramelo: '#B8641F', choco: '#4A2617' };

// Ilustrações (SVG): pudim no copo e brownie com brigadeiro.
const pudim = h => `<svg viewBox="0 0 200 240" height="${h}"><defs><linearGradient id="v" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".25" stop-color="#fff" stop-opacity=".15"/><stop offset="1" stop-color="#fff" stop-opacity=".35"/></linearGradient></defs>
  <path d="M30 40 L170 40 L155 225 Q100 236 45 225 Z" fill="#FBE3A8"/><path d="M33 40 L167 40 L162 95 Q100 108 38 95 Z" fill="${C.caramelo}"/><path d="M38 95 Q100 108 162 95 L160 110 Q100 124 40 110 Z" fill="#9A4E15" opacity=".6"/>
  <path d="M30 40 L170 40 L155 225 Q100 236 45 225 Z" fill="url(#v)" stroke="#fff" stroke-opacity=".7" stroke-width="3"/><ellipse cx="100" cy="40" rx="70" ry="10" fill="#fff" opacity=".5"/></svg>`;
const brownie = h => `<svg viewBox="0 0 240 200" height="${h}"><path d="M20 80 L200 60 L225 95 L225 170 L45 190 L20 160 Z" fill="${C.choco}"/><path d="M20 80 L200 60 L225 95 L45 115 Z" fill="#6B3A22"/><path d="M45 115 L225 95 L225 170 L45 190 Z" fill="#3A1C10"/>
  ${[[70, 92], [110, 86], [150, 80], [92, 104], [132, 98], [175, 76]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#2A120A"/><circle cx="${x - 2}" cy="${y - 3}" r="3" fill="#fff" opacity=".25"/>`).join('')}
  <path d="M40 112 Q80 100 120 106 T225 94" fill="none" stroke="#2A120A" stroke-width="6" stroke-linecap="round" opacity=".7"/></svg>`;
const GD = px => `<span style="font-family:Fraunces;font-weight:800;font-size:${px}px;letter-spacing:-.04em;line-height:1">G<i style="font-weight:600;color:${C.laranja}">D</i></span>`;
const pill = (t, px) => `<span style="display:inline-block;background:${C.laranja};color:${C.cacau};font-family:'DM Sans';font-weight:700;font-size:${px}px;letter-spacing:.14em;padding:${px * .6}px ${px * 1.3}px;border-radius:999px">${t}</span>`;

const fundo = `background:radial-gradient(70% 50% at 50% 45%,#55301F 0%,${C.cacau} 70%)`;
const topo = (w, px) => `<div style="position:absolute;left:0;right:0;top:${px * 2.6}px;display:flex;flex-direction:column;align-items:center;gap:${px * .5}px;color:${C.creme}">${GD(px * 2.8)}<span style="font-family:'DM Sans';font-weight:700;font-size:${px * .55}px;letter-spacing:.4em;margin-right:-.4em">GRAN DOCES</span></div>`;
const rodape = (px, txt = 'FAÇA SEU PEDIDO PELO DIRECT') => `<div style="position:absolute;left:0;right:0;bottom:${px * 3}px;display:flex;justify-content:center">${pill(txt, px * .75)}</div>`;

const peca = (w, h, tipo) => {
  const st = h > 1500, px = 40;
  const it = {
    pudim: { art: pudim(st ? 620 : 400), kick: 'NOVIDADE', t1: 'Pudim', t2: 'no copo', sub: 'Lisinho, cremoso e com muita calda de caramelo.' },
    brownie: { art: brownie(st ? 520 : 340), kick: 'NOVIDADE', t1: 'Brownie', t2: 'de Brigadeiro', sub: 'Molhadinho por dentro, com brigadeiro cremoso por cima.' },
  }[tipo];
  const meio = tipo === 'dupla'
    ? `<div style="display:flex;align-items:flex-end;justify-content:center;gap:30px;margin-top:${st ? 40 : 10}px">${pudim(st ? 470 : 360)}${brownie(st ? 360 : 280)}</div>
       <div style="font-family:Fraunces;font-weight:800;font-size:${st ? 108 : 92}px;line-height:.95;margin-top:${st ? 70 : 40}px">Chegaram<br><i style="font-weight:600;color:${C.laranja}">novidades!</i></div>
       <div style="font-family:'DM Sans';font-weight:700;font-size:${st ? 40 : 34}px;line-height:1.5;margin-top:${st ? 40 : 26}px">Pudim no copo <span style="color:${C.laranja}">•</span> Brownie de Brigadeiro</div>`
    : `<div style="display:flex;justify-content:center;margin-top:${st ? 40 : 0}px">${it.art}</div>
       <div style="margin-top:${st ? 70 : 40}px">${pill(it.kick, 26)}</div>
       <div style="font-family:Fraunces;font-weight:800;font-size:${st ? 150 : 128}px;line-height:.9;margin-top:24px">${it.t1}</div>
       <div style="font-family:Fraunces;font-style:italic;font-weight:600;font-size:${st ? 96 : 80}px;line-height:1;color:${C.laranja}">${it.t2}</div>
       <div style="font-family:'DM Sans';font-size:${st ? 38 : 32}px;line-height:1.4;margin-top:${st ? 36 : 24}px;max-width:820px;opacity:.9">${it.sub}</div>`;
  return `<div style="width:${w}px;height:${h}px;position:relative;overflow:hidden;${fundo};color:${C.creme}">
    <div style="position:absolute;inset:${st ? 46 : 36}px;border:2px solid rgba(229,154,47,.35);border-radius:36px"></div>
    ${topo(w, px)}
    <div style="position:absolute;left:0;right:0;top:${st ? 380 : 280}px;display:flex;flex-direction:column;align-items:center;text-align:center">${meio}</div>
    ${rodape(px)}</div>`;
};

const HEAD = `<meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600..900;1,9..144,600..900&family=DM+Sans:wght@400;700&display=swap" rel="stylesheet"><style>*{margin:0;box-sizing:border-box}</style>`;
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const b = await chromium.launch(launch);
for (const tipo of ['dupla', 'pudim', 'brownie']) for (const [fmt, w, h] of [['feed', 1080, 1350], ['stories', 1080, 1920]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.setContent(`<!doctype html><html><head>${HEAD}</head><body>${peca(w, h, tipo)}</body></html>`);
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(OUT, `gran-doces-${tipo}-${fmt}.png`) }); await p.close();
}
await b.close(); console.log('ok');

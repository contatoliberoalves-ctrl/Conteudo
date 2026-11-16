// Kit do perfil @pod.const no Instagram, na identidade do PodConst: foto de perfil (1080×1080, logo no
// círculo central), capas de destaques (1080×1920, ícone e nome no círculo que o Insta recorta) e a página da
// identidade (cores, fontes, logo e @).
// Uso: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node perfil_insta.mjs -> saida/perfil-insta/
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const dir = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(dir, 'saida', 'perfil-insta');
const ARROBA = '@pod.const';
const FONTES = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Grotesk:wght@400;500;600;700&family=Unbounded:wght@900&display=swap';
const COR = { azul: '#0a3aa6', azul2: '#0a2a7c', navy: '#0b1a4a', mag: '#e224d6', mag2: '#ff1ff0', ama: '#f7f400', branco: '#ffffff' };
const FUNDO = {
  azul: 'radial-gradient(130% 100% at 20% 0%,#0d44bd 0%,#0a3aa6 40%,#0a2a7c 100%)',
  mag: 'radial-gradient(120% 90% at 30% 20%,#ea2ee0 0%,#d61ccf 55%,#c515c2 100%)',
  navy: 'radial-gradient(120% 90% at 80% 0%,#132a7a 0%,#0a1440 70%)',
  ama: 'radial-gradient(120% 90% at 30% 20%,#fffb4d 0%,#f7f400 55%,#e6e000 100%)',
};
const LOGO = (px, cor = COR.mag2, sombra = COR.navy) => `<div style="font-family:'Unbounded',sans-serif;font-weight:900;font-size:${px}px;line-height:.84;letter-spacing:-.02em;color:${cor};text-shadow:.05em .06em 0 ${sombra};display:inline-flex;flex-direction:column;align-items:flex-start;transform:rotate(-9deg)"><div style="display:flex;align-items:center;margin-left:.62em"><span>P</span><span style="width:.72em;height:.72em;border-radius:50%;background:${cor};box-shadow:.05em .06em 0 ${sombra};display:flex;align-items:center;justify-content:center;gap:.045em;margin:0 .01em">${[.16, .3, .44, .3, .18].map(h => `<span style="width:.05em;height:${h}em;border-radius:.03em;background:${cor === COR.branco ? COR.mag : '#fff'}"></span>`).join('')}</span><span>D</span></div><div>CONST</div></div>`;
const IC = {
  mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>',
  scale: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
  play: '<polygon points="6 3 20 12 6 21 6 3"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
};
// Destaques: [nome no arquivo, rótulo, ícone, fundo, cor do disco, cor do ícone]
const DESTAQUES = [
  ['episodios', 'EPISÓDIOS', 'mic', 'navy', COR.mag, COR.branco],
  ['oab', '2ª FASE OAB', 'scale', 'azul', COR.ama, COR.navy],
  ['aulas', 'AULAS', 'play', 'mag', COR.branco, COR.mag],
  ['vde', 'MÉTODO VDE', 'star', 'navy', COR.ama, COR.navy],
  ['recursos', 'RECURSOS', 'file', 'azul', COR.mag, COR.branco],
  ['repescagem', 'REPESCAGEM', 'refresh', 'mag', COR.ama, COR.navy],
  ['aprovados', 'APROVADOS', 'trophy', 'navy', COR.ama, COR.navy],
  ['materiais', 'MATERIAIS', 'book', 'azul', COR.branco, COR.azul],
  ['sobre', 'QUEM SOMOS', 'users', 'mag', COR.navy, COR.ama],
  ['links', 'LINKS', 'link', 'navy', COR.mag, COR.branco],
];
const pontos = (cor, op = .14) => `<div style="position:absolute;inset:0;background-image:radial-gradient(${cor} 2px,transparent 2.5px);background-size:38px 38px;opacity:${op}"></div>`;
const svg = (ic, cor, px, sw = 1.6) => `<svg width="${px}" height="${px}" viewBox="0 0 24 24" fill="none" stroke="${cor}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${IC[ic]}</svg>`;

const TELAS = [];
// Foto de perfil: logo grande no centro, anel amarelo e @ embaixo, tudo dentro do círculo.
TELAS.push(['perfil-podconst', 1080, 1080, `<div style="position:absolute;inset:0;background:${FUNDO.azul}"></div>${pontos('#fff', .08)}
  <div style="position:absolute;left:50%;top:50%;width:900px;height:900px;transform:translate(-50%,-50%);border-radius:50%;border:10px solid ${COR.ama}"></div>
  <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding-right:30px;padding-top:10px">${LOGO(150)}</div>`]);
TELAS.push(['perfil-podconst-magenta', 1080, 1080, `<div style="position:absolute;inset:0;background:${FUNDO.mag}"></div>${pontos('#fff', .1)}
  <div style="position:absolute;left:50%;top:50%;width:900px;height:900px;transform:translate(-50%,-50%);border-radius:50%;border:10px solid ${COR.ama}"></div>
  <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding-right:30px;padding-top:10px">${LOGO(150, COR.branco)}</div>`]);
// Capas de destaque: 1080×1920; o Insta mostra o círculo central, então ícone e nome ficam no meio.
for (const [id, rot, ic, fundo, disco, cor] of DESTAQUES) {
  TELAS.push([`destaque-${id}`, 1080, 1920, `<div style="position:absolute;inset:0;background:${FUNDO[fundo]}"></div>${pontos('#fff', .07)}
    <div style="position:absolute;left:50%;top:50%;width:620px;height:620px;transform:translate(-50%,-50%);border-radius:50%;background:${disco};box-shadow:14px 16px 0 ${COR.navy}"></div>
    <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-58%)">${svg(ic, cor, 270)}</div>
    <div style="position:absolute;left:0;right:0;top:calc(50% + 150px);text-align:center;font-family:'Bebas Neue';font-size:${rot.length > 10 ? 64 : 76}px;letter-spacing:.04em;color:${cor}">${rot}</div>
    <div style="position:absolute;left:0;right:0;bottom:170px;text-align:center;font:700 40px 'Space Grotesk';color:#fff;opacity:.8">${ARROBA}</div>`]);
}
// Página da identidade: logo, @, paleta, fontes e aplicações.
const sw = (c, nome, hex, tx = '#fff') => `<div style="flex:1;border-radius:22px;background:${c};padding:26px 24px;height:220px;display:flex;flex-direction:column;justify-content:flex-end;color:${tx};box-shadow:8px 9px 0 ${COR.navy}"><div style="font-family:'Bebas Neue';font-size:46px;line-height:1">${nome}</div><div style="font:600 22px 'Space Grotesk';opacity:.85">${hex}</div></div>`;
TELAS.push(['identidade-podconst', 1080, 1350, `<div style="position:absolute;inset:0;background:#f3f5f9"></div>
  <div style="position:absolute;left:70px;right:70px;top:60px;display:flex;justify-content:space-between;align-items:center"><span style="font:700 26px 'Space Grotesk';letter-spacing:.24em;color:${COR.azul}">IDENTIDADE VISUAL</span><span style="background:${COR.ama};color:${COR.navy};font:700 30px 'Space Grotesk';padding:6px 16px">${ARROBA}</span></div>
  <div style="position:absolute;left:70px;right:70px;top:140px;height:380px;border-radius:30px;background:${FUNDO.azul};overflow:hidden;display:flex;align-items:center;justify-content:space-around">${pontos('#fff', .08)}
    <div style="position:relative">${LOGO(120)}</div>
    <div style="position:relative;width:250px;height:250px;border-radius:50%;background:${FUNDO.mag};border:8px solid ${COR.ama};display:flex;align-items:center;justify-content:center;padding-right:10px">${LOGO(52, COR.branco)}</div></div>
  <div style="position:absolute;left:70px;right:70px;top:570px;font:700 22px 'Space Grotesk';letter-spacing:.24em;color:${COR.navy};opacity:.7">CORES</div>
  <div style="position:absolute;left:70px;right:70px;top:610px;display:flex;gap:18px">${sw(COR.azul, 'AZUL', '#0A3AA6')}${sw(COR.navy, 'NAVY', '#0B1A4A')}${sw(COR.mag, 'MAGENTA', '#E224D6')}${sw(COR.ama, 'AMARELO', '#F7F400', COR.navy)}</div>
  <div style="position:absolute;left:70px;right:70px;top:890px;font:700 22px 'Space Grotesk';letter-spacing:.24em;color:${COR.navy};opacity:.7">FONTES</div>
  <div style="position:absolute;left:70px;right:70px;top:930px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:18px;color:${COR.navy}">
    <div style="background:#fff;border-radius:22px;padding:24px;box-shadow:8px 9px 0 ${COR.navy}"><div style="font-family:'Bebas Neue';font-size:80px;line-height:.9">TÍTULOS</div><div style="font:600 21px 'Space Grotesk';margin-top:10px">Bebas Neue</div></div>
    <div style="background:#fff;border-radius:22px;padding:24px;box-shadow:8px 9px 0 ${COR.navy}"><div style="font:700 40px/1.05 'Space Grotesk'">Texto e legendas</div><div style="font:600 21px 'Space Grotesk';margin-top:10px">Space Grotesk</div></div>
    <div style="background:#fff;border-radius:22px;padding:24px;box-shadow:8px 9px 0 ${COR.navy}"><div style="font:900 44px/1 'Unbounded';color:${COR.mag}">LOGO</div><div style="font:600 21px 'Space Grotesk';margin-top:18px">Unbounded 900</div></div></div>
  <div style="position:absolute;left:70px;right:70px;top:1150px;display:flex;align-items:center;gap:16px"><span style="background:${COR.navy};color:#fff;font:700 28px 'Space Grotesk';padding:6px 14px">@LIBERO<span style="font-weight:400">FILHO</span></span><span style="background:${COR.mag};color:#fff;font:700 28px 'Space Grotesk';padding:6px 14px">@NATALIA<span style="font-weight:400">VALENCA</span></span></div>`]);

const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch(launch);
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
for (const [nome, w, h, corpo] of TELAS) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet"><style>*{margin:0;box-sizing:border-box}body{width:${w}px;height:${h}px;position:relative;overflow:hidden}</style></head><body>${corpo}</body></html>`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(OUT, nome + '.png') });
}
await browser.close();
console.log('✓', TELAS.length, 'imagens em', OUT);

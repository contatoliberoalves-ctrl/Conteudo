// PDF A4 (retrato) na identidade PratFlix: capa escura com a foto do corredor, página "como usar" com o
// sumário, páginas claras (papel) com dois prompts cada em caixas "copie e cole" e fecho escuro.
// Uso: node pdf.mjs [id] -> saida/pdf/<id>/<n>.png e <id>.pdf (montado com as imagens das páginas).
// Nuvem: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node pdf.mjs
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const root = path.dirname(new URL(import.meta.url).pathname);
const { chromium } = createRequire(path.join(root, 'package.json'))('playwright');
import { FONTES } from './template.mjs';

const W = 794, H = 1123;
const foto = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(root, 'fotos', 'corredor.jpg')).toString('base64');
const C = { bg: '#121212', areia: '#E3D6B4', areia2: '#C9B88E', ouro: '#9A7B3A', txt: '#EDEAE3', mute: '#8E8A82', papel: '#F4F1EA' };
const T = "font-family:'Big Shoulders Display';font-weight:900;text-transform:uppercase;letter-spacing:-.005em";
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const tit = (linhas, f) => [].concat(linhas).map(l => esc(l).replace(/\[\[(.+?)\]\]/g, (_, t) => f(t))).join('<br>');
const grao = op => `<div style="position:absolute;inset:0;pointer-events:none;opacity:${op};mix-blend-mode:overlay;background-image:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E&quot;)"></div>`;
const logo = (px, cor) => `<div style="display:inline-flex;flex-direction:column;color:${cor}"><span style="font:800 ${px}px Manrope;letter-spacing:-.05em;line-height:1">pratflix<span style="font-size:.55em;vertical-align:.25em;margin-left:2px">▸</span></span><span style="font:600 ${px * .24}px Manrope;letter-spacing:.42em;margin-top:${px * .18}px;opacity:.75">A ADVOCACIA NA PRÁTICA</span></div>`;
const rotulo = (t, cor) => `<span style="display:inline-flex;align-items:center;gap:8px;border:1px solid ${cor}66;border-radius:6px;padding:7px 12px;font:700 12px Manrope;letter-spacing:.24em;color:${cor}">✦ ${esc(t).toUpperCase()}</span>`;
const pad2 = n => String(n).padStart(2, '0');
const pagina = (bg, html) => `<section style="position:relative;width:${W}px;height:${H}px;overflow:hidden;background:${bg}">${html}</section>`;
const rodape = n => `<div style="position:absolute;left:64px;right:64px;bottom:40px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #d9d1bd;padding-top:16px">
  ${logo(20, '#111')}<span style="font:700 13px Manrope;color:#555">@liberofilho · ${pad2(n)}</span></div>`;

const capa = d => pagina(C.bg, `<img src="${foto}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:blur(2px) brightness(.5) saturate(.8);transform:scale(1.05)">
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(18,18,18,.5) 0%,rgba(18,18,18,.3) 30%,${C.bg} 72%)"></div>${grao(.16)}
  <div style="position:absolute;left:64px;right:64px;top:60px;display:flex;justify-content:space-between;align-items:flex-start">${logo(40, C.txt)}<span style="font:700 17px Manrope;color:${C.txt}">@liberofilho</span></div>
  <div style="position:absolute;left:64px;right:64px;bottom:120px">
    ${rotulo(d.capa.rotulo, C.areia)}
    <div style="${T};font-size:118px;line-height:.86;color:${C.txt};margin-top:24px">${tit(d.capa.titulo, t => `<span style="background:${C.areia};color:#111;padding:0 12px;display:inline-block;margin:6px 0 0 -4px">${t}</span>`)}</div>
    <div style="width:80px;height:5px;background:${C.areia};margin-top:34px"></div>
    <div style="font:600 22px/1.4 Manrope;color:${C.txt};opacity:.85;margin-top:22px;max-width:560px">${esc(d.capa.sub)}</div></div>`);

const comoUsar = (d, n) => pagina(C.papel, `${grao(.12)}
  <div style="position:absolute;right:-140px;top:-120px;width:460px;height:460px;border-radius:50%;border:2px solid ${C.areia2}"></div>
  <div style="position:absolute;left:64px;right:64px;top:70px">
    <div style="font:700 14px Manrope;letter-spacing:.3em;color:${C.ouro}">ANTES DE COMEÇAR</div>
    <div style="${T};font-size:76px;line-height:.88;color:#111;margin-top:14px">Como <span style="color:${C.ouro}">usar</span></div>
    <div style="display:flex;flex-direction:column;gap:14px;margin-top:30px">
      ${d.comoUsar.map((t, i) => `<div style="display:flex;gap:18px;align-items:center;background:#fff;border:1px solid #e3dccb;border-radius:14px;padding:14px 18px">
        <span style="${T};font-size:40px;line-height:1;color:${C.ouro};width:46px;flex:none">${i + 1}</span>
        <span style="font:600 17px/1.45 Manrope;color:#222">${esc(t)}</span></div>`).join('')}</div>
    <div style="font:700 14px Manrope;letter-spacing:.3em;color:${C.ouro};margin-top:46px">OS ${d.prompts.length} PROMPTS</div>
    <div style="margin-top:12px;border-top:2px solid #111">
      ${d.prompts.map((p, i) => `<div style="display:flex;align-items:baseline;gap:18px;padding:12px 0;border-bottom:1px solid #d9d1bd">
        <span style="${T};font-size:30px;color:${C.ouro};width:44px;flex:none">${pad2(i + 1)}</span>
        <span style="font:700 18px Manrope;color:#111">${esc(p.titulo)}</span></div>`).join('')}</div></div>${rodape(n)}`);

const cartao = (p, i) => `<div data-cartao style="display:flex;flex-direction:column;gap:12px">
  <div style="display:flex;align-items:flex-end;gap:16px">
    <span style="${T};font-size:70px;line-height:.8;color:${C.ouro}">${pad2(i + 1)}</span>
    <span style="${T};font-size:36px;line-height:.92;color:#111">${esc(p.titulo)}</span></div>
  <div style="position:relative;background:#fff;border:1px solid #e3dccb;border-left:5px solid ${C.areia2};border-radius:14px;padding:26px 26px 22px">
    <span style="position:absolute;top:-11px;left:20px;background:#111;color:${C.areia};font:800 10.5px Manrope;letter-spacing:.24em;padding:5px 10px;border-radius:5px">COPIE E COLE</span>
    <div style="font:500 17px/1.62 Manrope;color:#222">${esc(p.texto)}</div></div></div>`;
const complemento = t => `<div data-cartao style="background:${C.bg};border-radius:16px;padding:26px 28px;color:${C.txt};position:relative;overflow:hidden">${grao(.14)}
  <div style="font:700 12px Manrope;letter-spacing:.26em;color:${C.areia}">✦ COMPLEMENTO</div>
  <div style="${T};font-size:34px;line-height:.92;margin-top:8px">Cole no final de <span style="color:${C.areia}">qualquer prompt</span></div>
  <div style="font:500 16px/1.6 Manrope;color:${C.txt};opacity:.9;margin-top:14px">${esc(t)}</div></div>`;
const paginaPrompts = (itens, n) => pagina(C.papel, `${grao(.12)}
  <div data-area style="position:absolute;left:64px;right:64px;top:64px;bottom:110px;display:flex;flex-direction:column;justify-content:flex-start;gap:44px">${itens.join('')}</div>${rodape(n)}`);

const fecho = d => pagina(C.bg, `<div style="position:absolute;inset:0;background:radial-gradient(110% 80% at 100% 0%,#2a271f 0%,${C.bg} 60%)"></div>${grao(.16)}
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 80px">
    <div style="width:130px;height:130px;border-radius:32px;background:linear-gradient(135deg,${C.areia},${C.areia2});display:grid;place-items:center"><span style="font:800 104px/1 Manrope;letter-spacing:-.06em;color:#121212;margin:-16px 0 0 4px">p<span style="font-size:.42em;vertical-align:.32em;margin-left:2px">▸</span></span></div>
    <div style="${T};font-size:84px;line-height:.88;color:${C.txt};margin-top:40px">Mais advocacia<br><span style="color:${C.areia}">na prática</span></div>
    <div style="font:600 20px/1.5 Manrope;color:${C.txt};opacity:.8;margin-top:24px">Acompanhe no Instagram</div>
    <div style="font:800 30px Manrope;color:${C.areia};margin-top:8px">@liberofilho</div>
    <div style="margin-top:60px">${logo(34, C.txt)}</div></div>`);

const dados = JSON.parse(fs.readFileSync(path.join(root, 'pdf.json'), 'utf8')).filter(d => !process.argv[2] || d.id === process.argv[2]);
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
fs.mkdirSync(path.join(root, 'build'), { recursive: true });
for (const d of dados) {
  // Dois prompts por página; o complemento entra na última página de prompts (ou numa própria).
  const cards = d.prompts.map(cartao);
  const grupos = [];
  for (let i = 0; i < cards.length; i += 2) grupos.push(cards.slice(i, i + 2));
  if (d.complemento) (grupos.at(-1).length < 2 ? grupos.at(-1) : grupos[grupos.push([]) - 1]).push(complemento(d.complemento));
  const paginas = [capa(d), comoUsar(d, 2), ...grupos.map((g, k) => paginaPrompts(g, k + 3)), fecho(d)];
  const arq = path.join(root, 'build', `pdf-${d.id}.html`);
  fs.writeFileSync(arq, `<!doctype html><html><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet"><style>*{margin:0;box-sizing:border-box}body{margin:0}</style></head><body>${paginas.join('')}</body></html>`);
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  await page.goto('file://' + arq);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const avisos = await page.evaluate(() => [...document.querySelectorAll('[data-area]')].flatMap((a, i) => a.scrollHeight > a.clientHeight + 1 ? [`página de prompts ${i + 1}: conteúdo passa ${a.scrollHeight - a.clientHeight}px`] : []));
  const out = path.join(root, 'saida', 'pdf', d.id);
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  const secs = await page.$$('section');
  for (let i = 0; i < secs.length; i++) await secs[i].screenshot({ path: path.join(out, `${i + 1}.png`) });
  await page.close();
  const pdf = await browser.newPage();
  await pdf.setContent(`<style>@page{size:210mm 297mm;margin:0}body{margin:0}img{display:block;width:210mm;height:297mm;break-after:page}img:last-child{break-after:auto}</style>${secs.map((_, i) => `<img src="data:image/png;base64,${fs.readFileSync(path.join(out, `${i + 1}.png`)).toString('base64')}">`).join('')}`);
  await pdf.pdf({ path: path.join(out, `${d.id}.pdf`), width: '210mm', height: '297mm', printBackground: true });
  await pdf.close();
  console.log(avisos.length ? '!' : '✓', d.id, `(${secs.length} páginas A4 + PDF)`);
  avisos.forEach(a => console.log('   ', a));
  if (avisos.length) process.exitCode = 1;
}
await browser.close();

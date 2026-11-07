// PDFs "Modelos de peça · PratFlix": um PDF por peça + um documento com todas.
// Texto selecionável (dá para copiar para o Word). Estrutura e guias vêm de
// ../plataforma/site-pratflix/modelos.mjs; o texto da peça vem de ./textos.mjs.
// Uso: node gerar.mjs  (nuvem: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node gerar.mjs)
// Saída: saida/<id>.pdf e saida/PratFlix-Modelos-de-peca.pdf
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { MODELS } from '../plataforma/site-pratflix/modelos.mjs';
import { TEXTOS } from './textos.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const { chromium } = createRequire(path.join(root, '..', 'package.json'))('playwright');
const foto = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(root, '..', 'fotos', 'corredor.jpg')).toString('base64');
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const campos = s => esc(s).replace(/\[([^\]]+)\]/g, '<mark>[$1]</mark>');
const html = s => String(s).replace(/<mark>/g, '<b class="hl">').replace(/<\/mark>/g, '</b>'); // explicações das partes já vêm com <mark>
const ROMANOS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
const pad2 = n => String(n).padStart(2, '0');
const logo = (px, cor) => `<span class="logo" style="font-size:${px}px;color:${cor}">pratflix<span>▸</span></span>`;

const CSS = `
@page { size: A4; margin: 18mm 17mm 20mm }
@page capa { margin: 0 }
* { box-sizing: border-box }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact }
body { margin: 0; font: 500 10.6pt/1.6 Manrope, Arial, sans-serif; color: #1f1d19; background: #fff }
.T { font-family: 'Big Shoulders Display', 'Arial Narrow', sans-serif; font-weight: 900; text-transform: uppercase; letter-spacing: -.005em; line-height: .88 }
.logo { font-family: Manrope; font-weight: 800; letter-spacing: -.05em; line-height: 1 } .logo span { font-size: .55em; vertical-align: .25em; margin-left: 2px }
.capa { page: capa; position: relative; width: 210mm; height: 297mm; overflow: hidden; background: #121212; color: #EDEAE3; break-after: page }
.capa img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: blur(2px) brightness(.45) saturate(.7); transform: scale(1.05) }
.capa::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, #12121288 0%, #12121244 30%, #121212 70%) }
.capa > div { position: absolute; z-index: 1; left: 20mm; right: 20mm }
.rot { display: inline-block; border: 1px solid #E3D6B466; border-radius: 6px; padding: 6px 12px; font: 700 9pt Manrope; letter-spacing: .24em; color: #E3D6B4 }
.cabeca { background: #121212; color: #EDEAE3; border-radius: 14px; padding: 22px 26px 24px; position: relative; overflow: hidden }
.cabeca::after { content: ""; position: absolute; right: -90px; top: -110px; width: 300px; height: 300px; border-radius: 50%; border: 1.5px solid #E3D6B433 }
.cabeca .topo { display: flex; justify-content: space-between; align-items: center }
.cabeca h1 { margin: 16px 0 0; font-size: 46pt; color: #EDEAE3 }
.cabeca .base { margin-top: 10px; font: 700 9pt Manrope; letter-spacing: .14em; color: #E3D6B4; text-transform: uppercase }
.cabeca .quando { margin-top: 12px; font-size: 11.5pt; color: #d9d4c8; max-width: 140mm }
.sec { font: 800 8.5pt Manrope; letter-spacing: .26em; color: #8a6d2f; text-transform: uppercase; margin: 22px 0 10px; display: flex; align-items: center; gap: 10px }
.sec::after { content: ""; flex: 1; height: 1px; background: #e2dccd }
.partes { display: grid; grid-template-columns: 1fr 1fr; gap: 8px }
.parte { display: grid; grid-template-columns: 26px 1fr; gap: 0 6px; padding: 10px 12px; border: 1px solid #e7e1d2; border-radius: 10px; background: #faf8f3; break-inside: avoid }
.parte i { grid-row: span 2; font-style: normal; font-weight: 800; color: #8a6d2f }
.parte b { font-size: 10.4pt } .parte span { font-size: 9.6pt; color: #5c584e; line-height: 1.5 }
.hl, mark { background: #efe3c2; color: inherit; padding: 0 3px; border-radius: 3px; font-weight: 700 }
.passos { display: grid; gap: 8px }
.passo { display: grid; grid-template-columns: 30px 1fr; gap: 10px; align-items: start; break-inside: avoid }
.passo > i { width: 26px; height: 26px; border-radius: 50%; background: #121212; color: #E3D6B4; display: grid; place-items: center; font-style: normal; font-weight: 800; font-size: 10pt }
.passo b { display: block; font-size: 10.6pt } .passo span { color: #5c584e; font-size: 10pt }
.modelo { break-before: page }
.folha-topo { display: flex; justify-content: space-between; align-items: end; border-bottom: 2px solid #121212; padding-bottom: 8px; margin-bottom: 18px }
.folha-topo .T { font-size: 26pt } .folha-topo small { font: 700 8.5pt Manrope; letter-spacing: .2em; color: #8a6d2f }
.peca p { margin: 0 0 9px; text-align: justify; hyphens: auto }
.peca .end { font-weight: 800; text-align: left; margin-bottom: 18px }
.peca h2 { font: 800 11.5pt Manrope; text-align: center; margin: 14px 0 12px; letter-spacing: .02em }
.peca h3 { font: 800 10.6pt Manrope; margin: 16px 0 8px; break-after: avoid }
.peca .orient { display: flex; gap: 10px; margin: 6px 0 12px; padding: 9px 12px; border-left: 3px solid #c2a466; background: #f6f1e4; border-radius: 0 8px 8px 0; font-size: 9.4pt; color: #5c4a22; break-inside: avoid }
.peca .orient b { white-space: nowrap; font-size: 8pt; letter-spacing: .14em; padding-top: 1px }
.peca .assin { margin-top: 18px; text-align: center }
.revisao { break-inside: avoid; margin-top: 26px; border: 1.5px solid #121212; border-radius: 12px; padding: 16px 18px }
.revisao h4 { margin: 0 0 10px; font-family: 'Big Shoulders Display'; font-weight: 900; text-transform: uppercase; font-size: 20pt; line-height: 1 }
.revisao li { list-style: none; display: flex; gap: 10px; align-items: center; padding: 6px 0; border-top: 1px solid #ece6d8; font-size: 10.4pt }
.revisao li:first-child { border-top: 0 }
.revisao ul { margin: 0; padding: 0 }
.cx { width: 15px; height: 15px; border: 1.6px solid #121212; border-radius: 4px; flex: none }
.aviso { margin-top: 14px; font-size: 8.6pt; color: #7a756a }
.sumario { break-after: page }
.sumario a { display: grid; grid-template-columns: 40px 1fr auto; gap: 12px; align-items: baseline; padding: 10px 0; border-bottom: 1px solid #e2dccd; color: inherit; text-decoration: none }
.sumario a .T { font-size: 22pt; color: #8a6d2f } .sumario a b { font-size: 12pt } .sumario a small { color: #7a756a; font-size: 9pt; letter-spacing: .1em; text-transform: uppercase; font-weight: 700 }
.peca-bloco + .peca-bloco { break-before: page }
`;

function textoPeca(id) {
  const linhas = TEXTOS[id].split('\n');
  const out = []; let par = [], primeiro = true;
  const flush = () => { if (!par.length) return; const t = par.join('<br>'); out.push(primeiro ? `<p class="end">${t}</p>` : `<p>${t}</p>`); primeiro = false; par = [] };
  for (const l of linhas) {
    if (!l.trim()) { flush(); continue }
    if (l.startsWith('# ')) { flush(); primeiro = false; out.push(`<h2>${campos(l.slice(2))}</h2>`); continue }
    if (l.startsWith('## ')) { flush(); out.push(`<h3>${campos(l.slice(3))}</h3>`); continue }
    if (l.startsWith('> ')) { flush(); out.push(`<div class="orient"><b>ORIENTAÇÃO</b><span>${campos(l.slice(2))}</span></div>`); continue }
    par.push(campos(l));
  }
  flush();
  // Fecho (cidade/data/assinatura) centralizado: os últimos parágrafos curtos depois de "Termos em que pede deferimento."
  return out.join('\n').replace(/<p>(Termos em que pede deferimento\.)<\/p>/g, '<p class="assin">$1</p>');
}

function blocoModelo(m, n, total) {
  return `<section class="peca-bloco" id="m-${m.id}">
  <div class="cabeca"><div class="topo">${logo(20, '#EDEAE3')}<span class="rot">MODELO ${pad2(n)}${total > 1 ? ' DE ' + pad2(total) : ''} · ${esc(m.area).toUpperCase()}</span></div>
    <h1 class="T">${esc(m.t)}</h1><div class="base">${esc(m.base)}</div><div class="quando">${esc(m.when)}</div></div>
  <div class="sec">A estrutura em ${m.parts.length} partes</div>
  <div class="partes">${m.parts.map((p, i) => `<div class="parte"><i>${ROMANOS[i]}</i><b>${esc(p[0])}</b><span>${html(p[1])}</span></div>`).join('')}</div>
  <div class="sec">Como adaptar ao seu caso</div>
  <div class="passos">${m.adapt.map((a, i) => `<div class="passo"><i>${i + 1}</i><div><b>${esc(a[0])}</b><span>${esc(a[1])}</span></div></div>`).join('')}
    ${m.adapt.some(a => /campos/i.test(a[0])) ? '' : `<div class="passo"><i>${m.adapt.length + 1}</i><div><b>Troque todos os campos destacados</b><span>Os trechos entre colchetes, <mark>[assim]</mark>, são para preencher. As caixas “Orientação” não fazem parte da peça: apague antes de protocolar.</span></div></div>`}</div>
  <div class="modelo"><div class="folha-topo"><span class="T">O modelo</span><small>${esc(m.t).toUpperCase()} · PRATFLIX</small></div>
    <div class="peca">${textoPeca(m.id)}</div>
    <div class="revisao"><h4>Antes de protocolar</h4><ul>${m.review.map(r => `<li><span class="cx"></span>${esc(r)}</li>`).join('')}<li><span class="cx"></span>Campos entre colchetes e caixas de orientação removidos</li></ul>
      <p class="aviso">Modelo de referência para estudo e prática. Confira a legislação e a jurisprudência atualizadas e adapte ao caso concreto. PratFlix · Líbero Filho.</p></div></div>
  </section>`;
}

const capa = (titulo, sub, rot) => `<section class="capa"><img src="${foto}" alt="">
  <div style="top:20mm;display:flex;justify-content:space-between;align-items:center">${logo(34, '#EDEAE3')}<span style="font:700 12pt Manrope">@liberofilho</span></div>
  <div style="bottom:28mm"><span class="rot">✦ ${esc(rot)}</span>
    <div class="T" style="font-size:80pt;margin-top:18px;color:#EDEAE3">${titulo}</div>
    <div style="width:64px;height:4px;background:#E3D6B4;margin-top:24px"></div>
    <div style="font:600 14pt/1.45 Manrope;margin-top:16px;opacity:.88;max-width:150mm">${esc(sub)}</div></div></section>`;

const doc = (title, body) => `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${esc(title)}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@800;900&family=Manrope:wght@500;600;700;800&display=swap"><style>${CSS}</style></head><body>${body}</body></html>`;

const rodape = `<div style="width:100%;font:600 8px Arial;color:#8a857a;padding:0 17mm;display:flex;justify-content:space-between"><span>pratflix ▸ · Modelos de peça · Líbero Filho</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`;

const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
const page = await browser.newPage();
const out = path.join(root, 'saida'); fs.mkdirSync(out, { recursive: true });
async function pdf(html, file) {
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: path.join(out, file), format: 'A4', printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: rodape });
  console.log('ok', file);
}
const so = process.argv[2];
for (const [i, m] of MODELS.entries()) {
  if (so && so !== m.id && so !== 'todos') continue;
  await pdf(doc(`${m.t} · Modelo PratFlix`, blocoModelo(m, i + 1, 1)), `${m.id}.pdf`);
}
if (!so || so === 'todos') {
  const sumario = `<section class="sumario"><div class="sec" style="margin-top:0">Neste material</div>
    <div class="T" style="font-size:44pt;margin-bottom:8px">${MODELS.length} modelos <span style="color:#8a6d2f">de peça</span></div>
    <p style="color:#5c584e;max-width:150mm;margin:0 0 14px">Cada modelo traz a estrutura comentada, como adaptar ao seu caso, o texto completo para preencher e um checklist antes de protocolar. Os campos <mark>[entre colchetes]</mark> são para trocar; as caixas “Orientação” não fazem parte da peça.</p>
    ${MODELS.map((m, i) => `<a href="#m-${m.id}"><span class="T">${pad2(i + 1)}</span><b>${esc(m.t)}</b><small>${esc(m.area)}</small></a>`).join('')}</section>`;
  await pdf(doc('Modelos de peça · PratFlix', capa('Modelos<br><span style="background:#E3D6B4;color:#111;padding:0 12px">de peça</span>', 'Entenda a estrutura, adapte ao seu caso e revise antes de protocolar. ' + MODELS.length + ' modelos comentados.', 'PRATFLIX · MODELOS DE PEÇA') + sumario + MODELS.map((m, i) => blocoModelo(m, i + 1, MODELS.length)).join('')), 'PratFlix-Modelos-de-peca.pdf');
}
await browser.close();

// Slides de aula 16:9 (1920×1080) da PratFlix: professores convidados, na identidade da plataforma
// (grafite, areia, Big Shoulders + Manrope, foto do corredor). Conteúdo em aula.json.
// Uso: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node aula.mjs [id]
//   -> saida/aula/<id>/01.png … e <id>.pdf
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { FONTES } from './template.mjs';

const dir = path.dirname(new URL(import.meta.url).pathname);
const foto = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(dir, 'fotos', 'corredor.jpg')).toString('base64');
const C = { bg: '#121212', card: '#1B1B1A', borda: '#2f2f2c', areia: '#E3D6B4', areia2: '#C9B88E', ouro: '#9A7B3A', txt: '#EDEAE3', mute: '#8E8A82', papel: '#F4F1EA', verm: '#C8372D' };
const T = "font-family:'Big Shoulders Display';font-weight:900;text-transform:uppercase;letter-spacing:-.005em";
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const tit = (l, cor = C.areia) => [].concat(l).map(x => esc(x).replace(/\[\[(.+?)\]\]/g, `<span style="color:${cor}">$1</span>`)).join('<br>');
const grao = `<div style="position:absolute;inset:0;pointer-events:none;opacity:.14;mix-blend-mode:overlay;background-image:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E&quot;)"></div>`;
const logo = (px = 40, cor = C.txt) => `<div style="display:inline-flex;flex-direction:column;color:${cor}"><span style="font:800 ${px}px Manrope;letter-spacing:-.05em;line-height:1">pratflix<span style="font-size:.55em;vertical-align:.25em;margin-left:2px">▸</span></span><span style="font:600 ${px * .24}px Manrope;letter-spacing:.42em;margin-top:${px * .18}px;opacity:.75">A ADVOCACIA NA PRÁTICA</span></div>`;
const fundoEsc = `<div style="position:absolute;inset:0;background:radial-gradient(90% 90% at 100% 0%,#2a271f 0%,${C.bg} 60%)"></div>${grao}`;

function moldura(a, n, tot, corpo, claro = false) {
  const cor = claro ? '#111' : C.txt, mute = claro ? '#777' : C.mute;
  return `${claro ? `<div style="position:absolute;inset:0;background:${C.papel}"></div>${grao}` : fundoEsc}
  <div style="position:absolute;left:110px;right:110px;top:70px;display:flex;justify-content:space-between;align-items:center">${logo(38, cor)}<span style="font:700 20px Manrope;letter-spacing:.24em;color:${claro ? C.ouro : C.mute}">${esc(a.aula).toUpperCase()}</span></div>
  ${corpo}
  <div style="position:absolute;left:110px;right:110px;bottom:56px;display:flex;justify-content:space-between;align-items:center;font:600 21px Manrope;color:${mute}"><span>${esc(a.autora)} · ${esc(a.registro)}</span><span style="font-variant-numeric:tabular-nums">${String(n).padStart(2, '0')} / ${String(tot).padStart(2, '0')}</span></div>`;
}
const titulo = (s, px, cor, dest) => `<div style="${T};font-size:${s.ts ?? px}px;line-height:.9;color:${cor}">${tit(s.titulo, dest)}</div>`;

const L = {
  capa: (s, a) => `<img src="${foto}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:blur(2px) brightness(.5) saturate(.8);transform:scale(1.04)">
    <div style="position:absolute;inset:0;background:linear-gradient(90deg,${C.bg} 0%,rgba(18,18,18,.85) 45%,rgba(18,18,18,.35) 100%)"></div>${grao}
    <div style="position:absolute;left:120px;top:90px">${logo(54)}</div>
    <div style="position:absolute;left:120px;right:300px;top:330px">
      <span style="display:inline-flex;align-items:center;gap:12px;border:1px solid ${C.areia}55;border-radius:8px;padding:12px 18px;font:700 20px Manrope;letter-spacing:.24em;color:${C.areia}">✦ ${esc(a.aula).toUpperCase()}</span>
      <div style="${T};font-size:168px;line-height:.86;color:${C.txt};margin-top:34px">${tit(s.titulo)}</div>
      <div style="display:inline-block;margin-top:44px;border:2px solid ${C.areia};border-radius:999px;padding:18px 34px;font:600 34px Manrope;color:${C.txt}">${esc(s.pergunta)}</div></div>
    <div style="position:absolute;left:120px;bottom:90px;display:flex;align-items:center;gap:22px"><span style="width:6px;height:70px;background:${C.areia}"></span><div><div style="font:800 32px Manrope;color:${C.txt}">${esc(a.autora)}</div><div style="font:600 24px Manrope;color:${C.mute};margin-top:4px">${esc(a.registro)}</div></div></div>`,
  lista: (s, a, n, tot) => moldura(a, n, tot, `
    <div style="position:absolute;left:110px;right:110px;top:170px;bottom:120px;display:flex;flex-direction:column;justify-content:center;gap:${s.itens.length > 5 ? 32 : 44}px">
      ${titulo(s, s.titulo.length > 2 ? 92 : 112, C.txt)}
      ${s.intro ? `<div style="font:600 32px Manrope;color:${C.areia};margin-bottom:-14px">${esc(s.intro)}</div>` : ''}
      <div style="display:grid;grid-template-columns:${s.duas ? '1fr 1fr' : '1fr'};gap:16px 26px">${s.itens.map((x, i) => `<div style="display:flex;gap:22px;align-items:center;background:${C.card};border:1px solid ${s.alerta ? C.verm + '66' : C.borda};border-radius:18px;padding:${s.duas ? 18 : s.itens.length > 5 ? 16 : 24}px 28px">
        <span style="${T};font-size:${s.duas ? 42 : 48}px;line-height:.9;color:${s.alerta ? C.verm : C.areia};min-width:${s.duas ? 50 : 58}px">${s.alerta ? '✕' : String(i + 1).padStart(2, '0')}</span><span style="font:600 ${s.duas ? 29 : 33}px/1.3 Manrope;color:${C.txt}">${esc(x)}</span></div>`).join('')}</div>
    </div>`),
  colunas: (s, a, n, tot) => moldura(a, n, tot, `
    <div style="position:absolute;left:110px;right:110px;top:190px">${titulo(s, 120, C.txt)}</div>
    <div style="position:absolute;left:110px;right:110px;top:${s.base ? 380 : 410}px;bottom:${s.base ? 190 : 150}px;display:grid;grid-template-columns:1fr 1fr;gap:30px">${s.cols.map((c, i) => `<div style="border-radius:26px;padding:46px 50px;${i === 0 ? `background:${C.areia};color:#121212` : `background:${C.card};border:1px solid ${C.borda};color:${C.txt}`}">
      <div style="${T};font-size:76px;line-height:.9">${esc(c.t)}</div>
      <div style="width:90px;height:6px;background:${i === 0 ? '#121212' : C.areia};margin:28px 0 30px"></div>
      ${c.d ? `<div style="font:600 42px/1.35 Manrope">${esc(c.d)}</div>` : ''}
      ${c.itens ? `<div style="display:flex;flex-direction:column;gap:18px">${c.itens.map(x => `<div style="display:flex;gap:16px;font:600 31px/1.35 Manrope"><span style="color:${i === 0 ? C.ouro : C.areia}">✓</span><span>${esc(x)}</span></div>`).join('')}</div>` : ''}</div>`).join('')}</div>
    ${s.base ? `<div style="position:absolute;left:110px;right:110px;bottom:120px;font:600 26px Manrope;color:${C.areia}">⚖ ${esc(s.base)}</div>` : ''}`),
  tabela: (s, a, n, tot) => moldura(a, n, tot, `
    <div style="position:absolute;left:110px;right:110px;top:160px">${titulo(s, 112, '#111', C.ouro)}</div>
    <div style="position:absolute;left:110px;right:110px;top:320px;border-radius:22px;overflow:hidden;border:1.5px solid #d8ceb5;background:#fff">
      <div style="display:grid;grid-template-columns:.8fr 1.2fr;background:#121212;color:${C.areia};font:800 21px Manrope;letter-spacing:.24em">${s.cab.map(x => `<div style="padding:18px 34px">${esc(x).toUpperCase()}</div>`).join('')}</div>
      ${s.linhas.map(([x, y], i) => `<div style="display:grid;grid-template-columns:.8fr 1.2fr;border-top:1.5px solid #ece5d3;${i === 2 ? 'background:#FBF3DF' : ''}"><div style="padding:22px 34px;font:800 32px/1.25 Manrope;color:#111">${esc(x)}</div><div style="padding:22px 34px;font:500 31px/1.35 Manrope;color:#333">${esc(y)}</div></div>`).join('')}</div>
    <div style="position:absolute;left:110px;right:110px;bottom:120px;display:flex;gap:20px;align-items:flex-start;background:#121212;border-radius:18px;padding:22px 30px"><span style="font:800 30px Manrope;color:${C.areia}">!</span><span style="font:600 25px/1.4 Manrope;color:${C.txt}">${esc(s.nota)}</span></div>`, true),
  documento: (s, a, n, tot) => moldura(a, n, tot, `
    <div style="position:absolute;left:110px;top:170px;width:470px">${titulo(s, 104, C.txt)}
      <div style="font:600 26px/1.45 Manrope;color:${C.mute};margin-top:30px">Trecho de um acordo de convivência real: cada situação da rotina com regra própria.</div>
      <div style="${T};font-size:150px;line-height:1;color:transparent;-webkit-text-stroke:2px ${C.areia}88;margin-top:40px">${esc(s.parte)}</div></div>
    <div style="position:absolute;left:640px;right:110px;top:160px;bottom:120px;background:${C.papel};border-radius:10px;box-shadow:0 30px 70px rgba(0,0,0,.6);padding:40px 48px;transform:rotate(-.6deg);display:flex;flex-direction:column;gap:${s.clausulas.length > 5 ? 16 : 20}px;overflow:hidden">
      ${s.clausulas.map(([k, d, r]) => `<div style="display:flex;gap:18px;font:500 ${s.clausulas.some(c => c[2].length > 300) ? 21 : 22.5}px/1.42 Manrope;color:#222;text-align:justify"><span style="${T};font-size:34px;line-height:1;color:${C.ouro};min-width:42px">${k}</span><span><b style="font-weight:800;color:#111;background:linear-gradient(transparent 62%,#E3D6B4 62%)">${esc(d)}</b>${esc(r)}</span></div>`).join('')}</div>`),
  final: (s, a, n, tot) => `<img src="${foto}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:blur(3px) brightness(.4) saturate(.7);transform:scale(1.05)">
    <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(18,18,18,.6),${C.bg} 85%)"></div>${grao}
    <div style="position:absolute;left:110px;right:110px;top:70px;display:flex;justify-content:space-between;align-items:center">${logo(38)}<span style="font:700 20px Manrope;letter-spacing:.24em;color:${C.mute}">${esc(a.aula).toUpperCase()}</span></div>
    <div style="position:absolute;left:110px;right:110px;top:220px">
      ${titulo(s, 132, C.txt)}
      <div style="font:500 36px/1.45 Manrope;color:${C.txt};opacity:.85;margin-top:34px;max-width:1300px">${esc(s.texto)}</div>
      <div style="margin-top:60px;background:${C.areia};border-radius:26px;padding:44px 52px;display:flex;gap:34px;align-items:center">
        <span style="${T};font-size:150px;line-height:.8;color:#121212">?</span>
        <span style="font:800 40px/1.32 Manrope;color:#121212">${esc(s.pergunta)}</span></div></div>
    <div style="position:absolute;left:110px;right:110px;bottom:56px;display:flex;justify-content:space-between;font:600 21px Manrope;color:${C.mute}"><span>${esc(a.autora)} · ${esc(a.registro)}</span><span>${String(n).padStart(2, '0')} / ${String(tot).padStart(2, '0')}</span></div>`,
};

const aulas = JSON.parse(fs.readFileSync(path.join(dir, 'aula.json'), 'utf8'));
const filtro = process.argv[2];
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
for (const a of aulas) {
  if (filtro && a.id !== filtro) continue;
  const out = path.join(dir, 'saida', 'aula', a.id);
  fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
  const tot = a.slides.length;
  const html = `<!doctype html><html><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet"><style>*{margin:0;box-sizing:border-box}body{margin:0;background:#000}.s{width:1920px;height:1080px;position:relative;overflow:hidden;background:${C.bg};page-break-after:always}</style></head><body>
${a.slides.map((s, i) => `<div class="s">${L[s.tipo](s, a, i + 1, tot)}</div>`).join('\n')}</body></html>`;
  const f = path.join(out, 'aula.html'); fs.writeFileSync(f, html);
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file://' + f); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(500);
  const els = await page.$$('.s');
  for (let i = 0; i < els.length; i++) await els[i].screenshot({ path: path.join(out, `${String(i + 1).padStart(2, '0')}.png`) });
  await page.pdf({ path: path.join(out, `${a.id}.pdf`), width: '1920px', height: '1080px', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await page.close();
  console.log('✓', a.id, `(${tot} slides)`);
}
await browser.close();

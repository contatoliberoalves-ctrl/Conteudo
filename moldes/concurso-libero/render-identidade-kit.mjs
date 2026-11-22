// Prancha da identidade de um kit de edital (1920×1350): paleta, tipografia, elementos próprios e um exemplo de página.
// Uso: node render-identidade-kit.mjs <id>  →  saida/kit-<id>/identidade.png
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { FONTES, marca } from './template.mjs';
import { TEMAS, tex, carimbo } from './kits/tema.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const id = process.argv[2];
const prod = JSON.parse(fs.readFileSync(path.join(root, 'kits', 'produtos.json'), 'utf8')).find(p => p.id === id);
const c = TEMAS[prod.tema], d = prod.identidade;
const T = "font-family:'Big Shoulders Display',sans-serif;font-weight:900;text-transform:uppercase", S = "font-family:'Sora',sans-serif", I = "font-family:'Inter',sans-serif";
const rot = t => `<div style="${S};font-size:15px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:${c.corForte};margin-bottom:16px">${t}</div>`;
const cores = [[d.cores[0], c.escuro, '#fff'], [d.cores[1], c.escuro3, '#fff'], [d.cores[2], c.cor, '#fff'], [d.cores[3], c.corForte, '#fff'], [d.cores[4], c.claro, c.tinta], [d.cores[5], c.papel, c.tinta]];
const etiqueta = (t, cheia) => `<span style="${S};font-size:14px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;${cheia ? `background:${c.cor};color:#fff` : `color:${c.escuro};border:1.6px solid ${c.escuro}`};padding:7px 12px;border-radius:7px;white-space:nowrap">${t}</span>`;
const regua = `<div style="display:grid;grid-template-columns:repeat(19,1fr);gap:4px;width:100%">${Array.from({ length: 19 }, (_, i) => `<span style="height:${i === 6 ? 54 : 34}px;align-self:end;border-radius:4px;background:${i < 6 ? c.cor : i === 6 ? c.carimbo : c.trilho}"></span>`).join('')}</div>`;
const el = [[`<div style="width:100%;height:120px;border-radius:12px;background:${c.escuro};background-image:${tex(c, c.claro, .4, 66)}"></div>`, 'Dunas', d.texturaTexto],
  [`<div style="height:120px;display:flex;align-items:center;justify-content:center">${carimbo({ px: 124, cor: c.carimbo, ...prod.carimbo, id: 'ce', giro: -8 })}</div>`, 'Carimbo', d.carimboTexto],
  [`<div style="height:120px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px">${d.etiquetas.map((t, i) => etiqueta(t, !i)).join('')}</div>`, 'Etiqueta de peso', d.etiquetaTexto],
  [`<div style="height:120px;display:flex;align-items:center">${regua}</div>`, 'Régua das semanas', d.reguaTexto]];
const barra = (r, n, w, forte) => `<div style="display:grid;grid-template-columns:330px 1fr 70px;gap:16px;align-items:center;padding:9px 0"><div style="${I};font-weight:700;font-size:19px;color:${c.tinta}">${r}</div><div style="height:16px;border-radius:8px;background:${c.trilho};overflow:hidden"><div style="height:100%;width:${w}%;border-radius:8px;background:${forte ? `linear-gradient(90deg,${c.cor},${c.corForte})` : c.suave}"></div></div><div style="${T};font-size:30px;color:${c.tinta};text-align:right">${n}</div></div>`;
const html = `<!doctype html><html><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet"><style>*{box-sizing:border-box}body{margin:0}</style></head><body>
<div id="arte" style="width:1920px;height:1350px;display:grid;grid-template-columns:720px 1fr;background:${c.papel}">
  <div style="position:relative;background:${c.escuro};overflow:hidden;padding:70px 64px">
    <div style="position:absolute;inset:0;background-image:${tex(c, c.claro, .22, 110)}"></div>
    <div style="position:absolute;inset:0;background:radial-gradient(90% 55% at 0% 100%,${c.escuro3},transparent 70%),radial-gradient(70% 45% at 100% 0%,${c.brilho},transparent 70%)"></div>
    <div style="position:absolute;left:0;top:0;bottom:0;width:14px;background:${c.cor}"></div>
    <div style="position:absolute;right:-30px;top:330px;${T};font-size:470px;line-height:.8;color:transparent;-webkit-text-stroke:2.4px ${c.vazado}">08</div>
    <div style="position:relative">${marca(46, '#fff', c.claro)}
      <div style="margin-top:560px"><span style="${S};font-size:15px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;background:${c.cor};color:#fff;padding:9px 14px;border-radius:7px">${prod.selo}</span>
      <div style="${T};font-size:150px;line-height:.93;color:#fff;margin-top:22px">Do edital<br><span style="color:${c.claro}">à prova</span></div>
      <div style="${I};font-size:22px;line-height:1.5;color:rgba(255,255,255,.84);margin-top:22px;max-width:540px">${d.texto}</div></div></div>
    <div style="position:absolute;right:60px;top:86px">${carimbo({ px: 190, cor: c.carimbo, ...prod.carimbo, id: 'ci' })}</div>
  </div>
  <div style="padding:64px 70px;display:grid;grid-template-rows:auto auto auto 1fr;gap:44px">
    <div>${rot('Paleta · ' + c.nome)}<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:14px">${cores.map(([n, h, t]) => `<div style="background:${h};color:${t};border-radius:16px;height:150px;padding:16px;display:flex;flex-direction:column;justify-content:flex-end;border:1.5px solid ${c.borda}"><div style="${I};font-weight:800;font-size:18px">${n}</div><div style="${S};font-size:13px;font-weight:600;opacity:.85">${h}</div></div>`).join('')}</div></div>
    <div>${rot('Tipografia')}<div style="display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:28px;align-items:end">
      <div><div style="${T};font-size:92px;line-height:.9;color:${c.tinta}">2.317 vagas</div><div style="${S};font-size:13px;font-weight:600;color:${c.cinza};margin-top:8px">Big Shoulders Display 900 · títulos e números</div></div>
      <div><div style="${I};font-weight:700;font-size:24px;line-height:1.3;color:${c.tinta}">O dado do edital em negrito.</div><div style="${I};font-size:20px;line-height:1.45;color:${c.corpo}">A leitura dele logo abaixo, em texto corrido.</div><div style="${S};font-size:13px;font-weight:600;color:${c.cinza};margin-top:8px">Inter 400 / 700 / 800 · texto e tabelas</div></div>
      <div><div style="${S};font-size:19px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:${c.corForte}">Peça 1 de 8 · item 10.4</div><div style="${S};font-size:13px;font-weight:600;color:${c.cinza};margin-top:14px">Sora 700 · rótulos, cabeçalhos e fonte</div></div></div></div>
    <div>${rot('Elementos próprios do ' + prod.sigla)}<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px">
      ${el.map(([e, n, t]) => `<div style="background:#fff;border:1.5px solid ${c.borda};border-radius:16px;padding:18px">${e}<div style="${I};font-weight:800;font-size:18px;color:${c.tinta};margin-top:14px">${n}</div><div style="${I};font-size:15px;line-height:1.4;color:${c.cinza};margin-top:2px">${t}</div></div>`).join('')}</div></div>
    <div>${rot('A página de dados')}
      <div style="background:#fff;border:1.5px solid ${c.borda};border-radius:18px;padding:16px 26px">${barra('Interpretação do texto', '173', 100, true)}${barra('Reescrita e "frase clara e correta"', '70', 40, true)}${barra('Sentido de palavra ou de trecho', '59', 34, false)}</div>
      <div style="background:${c.escuro};border-radius:18px;padding:18px 26px;margin-top:14px;display:flex;justify-content:space-between;align-items:center"><div><div style="${S};font-size:12px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:${c.claro}">Nota final</div><div style="${T};font-size:40px;line-height:1.05;color:#fff;margin-top:4px">Objetiva + Discursiva + Títulos</div></div><div style="display:flex;gap:10px">${etiqueta('peso 2', true)}<span style="${S};font-size:14px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#fff;border:1.6px solid ${c.claro};padding:7px 12px;border-radius:7px">peso 1</span></div></div></div>
  </div></div><script>document.fonts.ready.then(()=>{window.__pronto=true})</script></body></html>`;
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
const page = await browser.newPage({ viewport: { width: 1920, height: 1350 } });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.__pronto === true);
await page.waitForTimeout(300);
const out = path.join(root, 'saida', 'kit-' + id);
fs.mkdirSync(out, { recursive: true });
await (await page.$('#arte')).screenshot({ path: path.join(out, 'identidade.png') });
await browser.close();
console.log('✓ identidade', path.join(out, 'identidade.png'));

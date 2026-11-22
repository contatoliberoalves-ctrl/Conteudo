// Prancha da identidade de um produto (1920×1350): paleta, tipografia, elementos e o cartão de dica.
// Uso: node render-identidade.mjs <id>  →  saida/<id>/identidade.png
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { FONTES, T, I, M, TEMAS, marca, azulejo, visto, carimbo } from './tema.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const id = process.argv[2];
const prod = JSON.parse(fs.readFileSync(path.join(root, 'produtos.json'), 'utf8')).find(p => p.id === id);
const c = TEMAS[prod.tema];
const rot = t => `<div style="${M};font-size:15px;letter-spacing:.22em;text-transform:uppercase;color:${c.corForte};margin-bottom:16px">${t}</div>`;
const cores = [['Bordô', c.escuro, '#fff'], ['Bordô 2', c.escuro3, '#fff'], ['Coral', c.cor, '#fff'], ['Coral forte', c.corForte, '#fff'], ['Pêssego', c.claro, c.tinta], ['Papel', c.papel, c.tinta]];
const html = `<!doctype html><html><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet"><style>*{box-sizing:border-box}body{margin:0}</style></head><body>
<div id="arte" style="width:1920px;height:1350px;display:grid;grid-template-columns:720px 1fr;background:${c.papel}">
  <div style="position:relative;background:${c.escuro};overflow:hidden;padding:70px 64px">
    <div style="position:absolute;inset:0;background-image:${azulejo(c.claro, .2, 96)}"></div>
    <div style="position:absolute;inset:0;background:radial-gradient(90% 55% at 0% 100%,${c.escuro3},transparent 70%),radial-gradient(70% 45% at 100% 0%,rgba(240,85,58,.3),transparent 70%)"></div>
    <div style="position:absolute;left:0;top:0;bottom:0;width:14px;background:${c.cor}"></div>
    <div style="position:absolute;right:-30px;top:330px;${T};font-size:470px;line-height:.8;color:transparent;-webkit-text-stroke:2.4px rgba(255,211,196,.28)">${prod.total}</div>
    <div style="position:relative">${marca(54, '#fff', c.claro, 'gi')}
      <div style="margin-top:560px"><span style="${M};font-size:16px;letter-spacing:.12em;text-transform:uppercase;background:${c.cor};color:#fff;padding:9px 14px;border-radius:7px">${prod.selo}</span>
      <div style="${T};font-size:150px;line-height:.86;color:#fff;margin-top:22px">Revisão<br><span style="color:${c.claro}">em dicas</span></div>
      <div style="${I};font-size:22px;line-height:1.5;color:rgba(255,255,255,.84);margin-top:22px;max-width:520px">Identidade do material do TCE MA: a mesma estrutura da linha Revisão em Dicas, com cor, textura e selos próprios.</div></div></div>
    <div style="position:absolute;right:60px;top:86px">${carimbo({ px: 190, cor: c.cor, topo: 'PROVA OBJETIVA', base: prod.banca.toUpperCase(), centro: prod.prova, sub: 'DOMINGO', id: 'ci' })}</div>
  </div>
  <div style="padding:64px 70px;display:grid;grid-template-rows:auto auto auto 1fr;gap:44px">
    <div>${rot('Paleta')}<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:14px">${cores.map(([n, h, t]) => `<div style="background:${h};color:${t};border-radius:16px;height:150px;padding:16px;display:flex;flex-direction:column;justify-content:flex-end;border:1.5px solid ${c.linha}"><div style="${I};font-weight:800;font-size:18px">${n}</div><div style="${M};font-size:13px;opacity:.85">${h}</div></div>`).join('')}</div></div>
    <div>${rot('Tipografia')}<div style="display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:28px;align-items:end">
      <div><div style="${T};font-size:92px;line-height:.9;color:${c.tinta}">Contas de <span style="color:${c.cor}">governo</span></div><div style="${M};font-size:13px;color:${c.cinza};margin-top:8px">Big Shoulders Display 900 · títulos e números</div></div>
      <div><div style="${I};font-weight:700;font-size:24px;line-height:1.3;color:${c.tinta}">A regra em negrito.</div><div style="${I};font-size:20px;line-height:1.45;color:#4A3B3F">A distinção logo abaixo, em texto corrido.</div><div style="${M};font-size:13px;color:${c.cinza};margin-top:8px">Inter 400 / 700 / 800 · texto</div></div>
      <div><div style="${M};font-size:20px;letter-spacing:.18em;color:${c.corForte}">TCE MA · 045–058</div><div style="${M};font-size:13px;color:${c.cinza};margin-top:14px">JetBrains Mono 700 · rótulos, faixas e fundamento</div></div></div></div>
    <div>${rot('Elementos próprios do TCE MA')}<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px">
      ${[[`<div style="width:100%;height:120px;border-radius:12px;background:${c.escuro};background-image:${azulejo(c.claro, .34, 60)}"></div>`, 'Azulejo', 'Textura dos sobrados de São Luís nos fundos escuros'],
         [`<div style="height:120px;display:flex;align-items:center;justify-content:center">${carimbo({ px: 124, cor: c.cor, topo: 'PROVA OBJETIVA', base: 'CEBRASPE', centro: prod.prova, sub: 'DOMINGO', id: 'ce', giro: -8 })}</div>`, 'Carimbo', 'Data da prova, em capas e criativos'],
         [`<div style="height:120px;display:flex;align-items:center;justify-content:center;gap:12px"><span style="${M};font-size:15px;letter-spacing:.1em;text-transform:uppercase;background:${c.cor};color:#fff;padding:7px 12px;border-radius:7px;white-space:nowrap">vale 2 pontos</span><span style="${M};font-size:15px;letter-spacing:.1em;text-transform:uppercase;color:${c.escuro};border:1.6px solid ${c.escuro};padding:6px 11px;border-radius:7px;white-space:nowrap">vale 1 ponto</span></div>`, 'Etiqueta de pontos', 'Mostra o peso da matéria na objetiva'],
         [`<div style="height:120px;display:flex;align-items:center;justify-content:center;gap:18px">${visto(64, c.ok, 3.4)}<span style="display:inline-flex;align-items:center;gap:7px;${M};font-size:14px;color:${c.corForte};background:${c.chip};border-radius:7px;padding:6px 11px;white-space:nowrap">${visto(14, c.corForte, 3.4)}CF, art. 71, II</span></div>`, 'Visto de auditoria', 'Conferência: caixinha marcada e fundamento']].map(([el, n, d]) => `<div style="background:#fff;border:1.5px solid ${c.linha};border-radius:16px;padding:18px">${el}<div style="${I};font-weight:800;font-size:18px;color:${c.tinta};margin-top:14px">${n}</div><div style="${I};font-size:15px;line-height:1.4;color:${c.cinza};margin-top:2px">${d}</div></div>`).join('')}</div></div>
    <div>${rot('O cartão de dica e a faixa de matéria')}
      <div style="position:relative;background:${c.escuro};border-radius:18px;overflow:hidden;padding:20px 28px;display:flex;align-items:flex-end;justify-content:space-between"><div style="position:absolute;inset:0;background-image:${azulejo(c.claro, .13, 54)}"></div><div style="position:absolute;left:0;top:0;bottom:0;width:9px;background:${c.cor}"></div><div style="position:relative"><div style="display:flex;gap:12px;align-items:center"><span style="${M};font-size:14px;letter-spacing:.22em;color:${c.claro}">44 dicas · específicos de auditor</span><span style="${M};font-size:12px;letter-spacing:.1em;text-transform:uppercase;background:${c.cor};color:#fff;padding:4px 9px;border-radius:6px">vale 2 pontos</span></div><div style="${T};font-size:50px;line-height:1;color:#fff;margin-top:8px">Contabilidade Pública</div></div><div style="position:relative;${T};font-size:58px;line-height:.9;color:transparent;-webkit-text-stroke:2px ${c.claro}">297–340</div></div>
      <div style="background:#fff;border:1.5px solid ${c.linha};border-radius:18px;display:grid;grid-template-columns:90px 1fr;padding:18px 26px 18px 0;margin-top:14px"><div style="text-align:center;border-right:1.5px solid ${c.linha};margin-right:22px"><div style="${T};font-size:42px;line-height:1;color:${c.corForte}">320</div><span style="display:block;width:22px;height:22px;border:2.4px solid ${c.tinta};border-radius:6px;margin:9px auto 0"></span></div><div><div style="${I};font-weight:700;font-size:22px;line-height:1.35;color:${c.tinta}">Resultado orçamentário confronta receitas realizadas e despesas empenhadas.</div><div style="${I};font-size:19px;line-height:1.45;color:#4A3B3F;margin-top:5px">Não substitua despesa empenhada por pagamento ao calcular esse resultado.</div></div></div></div>
  </div></div><script>document.fonts.ready.then(()=>{window.__pronto=true})</script></body></html>`;
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
const page = await browser.newPage({ viewport: { width: 1920, height: 1350 } });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.__pronto === true);
await page.waitForTimeout(300);
fs.mkdirSync(path.join(root, 'saida', id), { recursive: true });
await (await page.$('#arte')).screenshot({ path: path.join(root, 'saida', id, 'identidade.png') });
await browser.close();
console.log('✓ identidade');

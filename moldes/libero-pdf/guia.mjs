// Guia em PDF A4 (Libero PDF, `guias/<id>.json`): capa azul com anel vermelho e números grandes, páginas de papel
// com faixa azul de seção e blocos (texto, cartões, linha do tempo, barras, tabela, lista de checagem, destaque,
// conta, CTA). As páginas são fixas (794×1122): cada item de "paginas" é uma página do PDF.
// Gerar: node guia.mjs <id>  →  saida/<id>/<id>.pdf, 1.png … N.png e painel.png.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { COR, FONTES, TITULO, TEXTO, PERFIL, esc, lista, textura, anel } from '../libero-comum/identidade.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const W = 794, H = 1122, M = 56;
// **negrito**, [[caixa azul]], {{vermelho}}.
const rico = (s, caixa = COR.azul) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b style="font-weight:800">$1</b>')
  .replace(/\[\[(.+?)\]\]/g, `<span style="background:${caixa};color:#fff;padding:0 .14em;box-decoration-break:clone;-webkit-box-decoration-break:clone">$1</span>`)
  .replace(/\{\{(.+?)\}\}/g, `<span style="color:${COR.vermelho}">$1</span>`);
const P = (t, px = 14.2, extra = '') => `<p style="${TEXTO};font-size:${px}px;font-weight:500;line-height:1.55;color:${COR.navy};margin:0 0 .7em;text-wrap:pretty${extra}">${rico(t)}</p>`;
const kick = (t, cor = COR.azul) => `<div style="${TEXTO};font-size:10.5px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:${cor}">${esc(t)}</div>`;
const h3 = (t, px = 26) => `<div style="${TITULO};font-size:${px}px;line-height:1;color:${COR.navy};margin:2px 0 8px">${rico(t)}</div>`;

const BLOCOS = {
  texto: b => `${b.titulo ? h3(b.titulo, b.ts) : ''}${lista(b.texto).map(t => P(t, b.px)).join('')}`,
  // Cartões em grade: {titulo, texto, ref, cor: azul|vermelho|navy}.
  cartoes: b => `${b.titulo ? h3(b.titulo) : ''}<div style="display:grid;grid-template-columns:repeat(${b.colunas || 2},1fr);gap:12px">${lista(b.itens).map(c => {
    const cor = { vermelho: COR.vermelho, navy: COR.navy }[c.cor] || COR.azul;
    return `<div style="background:#fff;border-top:6px solid ${cor};border-radius:10px;padding:14px 16px;box-shadow:0 6px 18px rgba(10,30,80,.08)">
      <div style="${TITULO};font-size:${b.tc || 19}px;line-height:1.02;color:${cor};margin-bottom:6px">${rico(c.titulo)}</div>
      <div style="${TEXTO};font-size:${b.px || 13}px;font-weight:500;line-height:1.5;color:${COR.navy}">${rico(c.texto)}</div>
      ${c.ref ? `<div style="${TEXTO};font-size:9.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#8A93A6;margin-top:7px">${esc(c.ref)}</div>` : ''}</div>`;
  }).join('')}</div>`,
  // Linha do tempo: {data, texto, destaque}.
  linha: b => `${b.titulo ? h3(b.titulo) : ''}<div style="position:relative;padding-left:4px">${lista(b.itens).map((it, i, a) => `<div style="display:flex;gap:16px;align-items:stretch">
      <div style="flex:none;width:118px;text-align:right;${TITULO};font-size:${it.destaque ? 21 : 18}px;line-height:1.05;color:${it.destaque ? COR.vermelho : COR.azul};padding-top:2px">${esc(it.data)}</div>
      <div style="flex:none;width:16px;display:flex;flex-direction:column;align-items:center"><span style="width:14px;height:14px;border-radius:50%;margin-top:4px;background:${it.destaque ? COR.vermelho : '#fff'};border:3px solid ${it.destaque ? COR.vermelho : COR.azul}"></span>${i < a.length - 1 ? `<span style="flex:1;width:3px;background:#C9CFDB"></span>` : ''}</div>
      <div style="flex:1;padding-bottom:${b.gap ?? 12}px;${TEXTO};font-size:${b.px || 13.4}px;font-weight:${it.destaque ? 700 : 500};line-height:1.45;color:${COR.navy}">${rico(it.texto)}</div></div>`).join('')}</div>`,
  // Barras horizontais: {rotulo, valor, destaque}; "sufixo" (ex.: %), "max".
  barras: b => {
    const max = b.max || Math.max(...lista(b.itens).map(i => i.valor));
    return `${b.titulo ? h3(b.titulo) : ''}<div style="display:flex;flex-direction:column;gap:${b.gb || 7}px">${lista(b.itens).map(i => `<div style="display:flex;align-items:center;gap:12px">
      <div style="flex:none;width:${b.lr || 150}px;${TEXTO};font-size:${b.tr || 12}px;font-weight:${i.destaque ? 800 : 600};color:${COR.navy};text-align:right">${esc(i.rotulo)}</div>
      <div style="flex:1;height:${b.ab || 22}px;background:#E6E9F0;border-radius:4px;overflow:hidden"><div style="width:${(i.valor / max * 100).toFixed(1)}%;height:100%;background:${i.destaque ? COR.vermelho : COR.azul}"></div></div>
      <div style="flex:none;width:${b.ab ? 84 : 58}px;${TITULO};font-size:${b.tv || 19}px;color:${i.destaque ? COR.vermelho : COR.navy}">${String(i.valor).replace('.', ',')}${esc(b.sufixo || '')}</div></div>`).join('')}</div>
      ${b.fonte ? `<div style="${TEXTO};font-size:9.5px;font-weight:600;color:#8A93A6;margin-top:8px;line-height:1.4">${rico(b.fonte)}</div>` : ''}`;
  },
  // Tabela: cab [..], linhas [[..]]; "larguras" em fr.
  tabela: b => `${b.titulo ? h3(b.titulo) : ''}<table style="width:100%;border-collapse:collapse;${TEXTO};font-size:${b.px || 12.6}px;color:${COR.navy}">
      <thead><tr>${lista(b.cab).map((c, i) => `<th style="text-align:left;background:${COR.navy};color:#fff;font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;padding:8px 10px;${b.larguras ? `width:${b.larguras[i]}` : ''}">${esc(c)}</th>`).join('')}</tr></thead>
      <tbody>${lista(b.linhas).map((l, k) => `<tr style="background:${k % 2 ? '#fff' : '#F0F2F7'}">${l.map((c, i) => `<td style="padding:8px 10px;vertical-align:top;line-height:1.42;font-weight:${i ? 500 : 700}">${rico(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`,
  // Lista com marcador: "tipo": check (✓ azul), x (✗ vermelho), num.
  lista: b => `${b.titulo ? h3(b.titulo, b.ts) : ''}<div style="display:flex;flex-direction:column;gap:${b.gap ?? 7}px">${lista(b.itens).map((it, i) => {
    const m = b.marcador === 'x' ? `<span style="color:${COR.vermelho};font-weight:900">✕</span>` : b.marcador === 'num' ? `<span style="${TITULO};font-size:20px;color:${COR.vermelho};line-height:1">${String(i + 1).padStart(2, '0')}</span>` : `<span style="color:${COR.azul};font-weight:900">✓</span>`;
    return `<div style="display:flex;gap:10px;align-items:flex-start"><span style="flex:none;width:22px;text-align:center;${TEXTO};font-size:14px">${m}</span><span style="${TEXTO};font-size:${b.px || 13.6}px;font-weight:500;line-height:1.5;color:${COR.navy}">${rico(it)}</span></div>`;
  }).join('')}</div>`,
  // Destaque: caixa navy (ou vermelha) com rótulo e texto.
  destaque: b => `<div style="background:${b.cor === 'vermelho' ? COR.vermelho : COR.navy};border-radius:12px;padding:16px 20px;color:#fff">
      ${b.rotulo ? `<div style="${TEXTO};font-size:10.5px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:${b.cor === 'vermelho' ? '#fff' : COR.azulClaro};margin-bottom:6px">${esc(b.rotulo)}</div>` : ''}
      ${b.titulo ? `<div style="${TITULO};font-size:${b.ts || 24}px;line-height:1.02;margin-bottom:6px">${rico(b.titulo, COR.azul)}</div>` : ''}
      ${lista(b.texto).map(t => `<p style="${TEXTO};font-size:${b.px || 13.6}px;font-weight:500;line-height:1.5;margin:0 0 .45em">${rico(t, COR.azul)}</p>`).join('')}</div>`,
  // Números grandes lado a lado: {numero, texto}.
  numeros: b => `<div style="display:grid;grid-template-columns:repeat(${lista(b.itens).length},1fr);gap:12px">${lista(b.itens).map(n => `<div style="border:3px solid ${COR.navy};border-radius:10px;padding:12px 14px;background:#fff">
      <div style="${TITULO};font-size:${b.tn || 40}px;line-height:.95;color:${n.cor === 'vermelho' ? COR.vermelho : COR.azul}">${esc(n.numero)}</div>
      <div style="${TEXTO};font-size:11px;font-weight:700;line-height:1.35;color:${COR.navy};margin-top:5px">${rico(n.texto)}</div></div>`).join('')}</div>`,
  // Ficha para preencher: linhas com rótulo e espaço em branco ({rotulo}), em colunas.
  ficha: b => `${b.titulo ? h3(b.titulo) : ''}<div style="background:#fff;border:2px dashed #AEB7C8;border-radius:12px;padding:14px 18px;display:grid;grid-template-columns:repeat(${b.colunas || 1},1fr);gap:12px 24px">${lista(b.itens).map(r => `<div style="display:flex;align-items:flex-end;gap:10px;${TEXTO};font-size:13px;font-weight:700;color:${COR.navy}"><span style="flex:none">${rico(r)}</span><span style="flex:1;border-bottom:2px solid #C9CFDB;height:20px"></span></div>`).join('')}</div>`,
  espaco: b => `<div style="height:${b.h || 10}px"></div>`,
};

const faixa = (p, n) => `<div style="position:absolute;left:0;right:0;top:0;height:132px;background:linear-gradient(170deg,${COR.azul},${COR.azulFundo});overflow:hidden">
    ${anel(W - 120, -110, 220, 30)}
    <div style="position:absolute;left:${M}px;top:30px;${TITULO};font-size:64px;line-height:1;color:transparent;-webkit-text-stroke:2px rgba(255,255,255,.55)">${String(n).padStart(2, '0')}</div>
    <div style="position:absolute;left:${M + 92}px;top:34px;right:${M + 90}px">
      ${kick(p.rotulo || '', COR.off)}
      <div style="${TITULO};font-size:${p.ts || 38}px;line-height:1;color:#fff;margin-top:6px">${rico(p.titulo, COR.navyFundo)}</div></div>${textura(true)}</div>`;

function capa(c) {
  return `<section class="pagina" style="background:linear-gradient(165deg,${COR.azul} 0%,${COR.azulFundo} 100%)">
    ${anel(W - 230, -170, 480, 64)}${anel(-210, 760, 330, 46)}
    <div style="position:absolute;left:${M}px;top:58px;${TEXTO};font-size:12px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#fff;background:${COR.vermelho};padding:7px 13px;border-radius:6px;z-index:3">${esc(c.rotulo)}</div>
    <div style="position:absolute;left:${M}px;right:${M}px;top:${c.y || 250}px;z-index:3">
      ${c.pre ? `<div style="${TITULO};font-size:44px;line-height:1;color:${COR.off}">${rico(c.pre)}</div>` : ''}
      <div style="${TITULO};font-size:${c.ts || 118}px;line-height:.98;color:#fff;margin-top:6px">${lista(c.titulo).map(l => rico(l, COR.vermelho)).join('<br>')}</div>
      ${c.sub ? `<p style="${TEXTO};font-size:16px;font-weight:600;line-height:1.45;color:${COR.off};margin-top:22px;max-width:560px">${rico(c.sub)}</p>` : ''}</div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:150px;display:grid;grid-template-columns:repeat(${lista(c.numeros).length},1fr);gap:12px;z-index:3">
      ${lista(c.numeros).map(n => `<div style="background:#fff;border-radius:12px;padding:14px 16px;box-shadow:0 18px 40px rgba(8,16,40,.3)">
        <div style="${TITULO};font-size:34px;line-height:.95;color:${COR.azul}">${esc(n.numero)}</div>
        <div style="${TEXTO};font-size:11px;font-weight:700;line-height:1.35;color:${COR.navy};margin-top:5px">${esc(n.texto)}</div></div>`).join('')}</div>
    <div style="position:absolute;left:${M}px;bottom:62px;${TEXTO};font-size:14px;font-weight:800;letter-spacing:.06em;color:#fff;z-index:3">${esc(c.autor || 'Por Líbero Filho')} · ${PERFIL}</div>
    ${textura(true)}</section>`;
}

function pagina(p, n, total) {
  if (p.tipo === 'capa') return capa(p);
  const fundo = p.escura ? `radial-gradient(120% 90% at 100% 0%,#1d3566 0%,${COR.navyFundo} 60%)` : COR.papel;
  return `<section class="pagina" style="background:${fundo}">${p.escura ? '' : faixa(p, n)}
    <div class="conteudo" style="position:absolute;left:${M}px;right:${M}px;top:${p.escura ? 70 : 160}px;bottom:70px;display:flex;flex-direction:column;gap:${p.gap ?? 20}px">
      ${lista(p.blocos).map(b => (BLOCOS[b.tipo] || BLOCOS.texto)(b)).join('')}</div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:30px;display:flex;justify-content:space-between;${TEXTO};font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${p.escura ? '#9FB0D0' : '#8A93A6'}">
      <span>${PERFIL}</span><span>${esc(p.rodape || '')}${n ? ` · ${n}/${total}` : ''}</span></div>
    ${textura(!!p.escura)}</section>`;
}

const id = process.argv[2];
if (!id) { console.error('uso: node guia.mjs <id>'); process.exit(1); }
const guia = JSON.parse(fs.readFileSync(path.join(root, 'guias', `${id}.json`), 'utf8'));
const pags = guia.paginas;
const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${esc(guia.titulo)}</title><link href="${FONTES}" rel="stylesheet">
<style>@page{size:210mm 297mm;margin:0}*{box-sizing:border-box}body{margin:0;${TEXTO};-webkit-font-smoothing:antialiased;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pagina{position:relative;width:${W}px;height:${H}px;overflow:hidden;break-after:page}</style></head><body>
${pags.map((p, i) => pagina(p, i, pags.length - 1)).join('\n')}</body></html>`;

const out = path.join(root, 'saida', id);
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(root, 'build', `${id}.html`), html);
const proxy = process.env.RENDER_PROXY ? { server: process.env.RENDER_PROXY } : undefined;
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, proxy });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1080 / W });
await page.goto('file://' + path.join(root, 'build', `${id}.html`), { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
// Confere se algum conteúdo passou do pé da página.
const avisos = await page.evaluate(() => [...document.querySelectorAll('.pagina')].flatMap((s, i) => {
  const c = s.querySelector(".conteudo");
  return c && c.scrollHeight > c.clientHeight + 1 ? [`página ${i + 1}: conteúdo passa ${c.scrollHeight - c.clientHeight}px`] : [];
}));
await page.pdf({ path: path.join(out, `${id}.pdf`), preferCSSPageSize: true, printBackground: true });
const secs = await page.$$('.pagina');
for (let i = 0; i < secs.length; i++) await secs[i].screenshot({ path: path.join(out, `${i + 1}.png`) });
await browser.close();
avisos.forEach(a => console.log('⚠', a));
console.log(avisos.length ? '✗' : '✓', id, `(${secs.length} páginas)`);

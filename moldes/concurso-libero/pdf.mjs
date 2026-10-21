// PDF A4 (retrato) na identidade do Concurso com Líbero: capa verde com a marca, páginas em papel claro com
// cabeçalho (símbolo + título do material) e blocos: numeros, barras (questões por bloco), lista, datas,
// texto e fonte. Uma folha por item de "paginas"; o render avisa quando o conteúdo passa do espaço.
import { COR, FONTES, PERFIL, esc, marca, simbolo } from './template.mjs';

export const W = 794, H = 1123;
const M = 60;
const T = "font-family:'Big Shoulders Display',sans-serif;font-weight:900;text-transform:uppercase";
const S = "font-family:'Sora',sans-serif", I = "font-family:'Inter',sans-serif";
const VERDE = '#0BA457', VERDE2 = '#078A4A';
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
const rico = (s, escuro) => esc(s).replace(/\*\*(.+?)\*\*/g, `<b style="font-weight:800;color:${escuro ? '#fff' : COR.tinta}">$1</b>`)
  .replace(/\[\[(.+?)\]\]/g, `<span style="background:${escuro ? COR.petroleo : VERDE};color:#fff;padding:0 .12em;box-decoration-break:clone;-webkit-box-decoration-break:clone">$1</span>`);
const h = (t, px = 22) => t ? `<div style="${S};font-size:${px}px;font-weight:700;color:${COR.tinta};margin-bottom:10px;display:flex;align-items:center;gap:10px"><span style="width:6px;height:${px}px;border-radius:3px;background:${VERDE}"></span>${rico(t)}</div>` : '';
const card = c => `background:#fff;border:1px solid #D7E6E2;border-radius:14px;${c || ''}`;

const BLOCOS = {
  numeros: b => `${h(b.titulo)}<div style="display:grid;grid-template-columns:repeat(${b.colunas || 2},1fr);gap:12px">${lista(b.itens).map(x => `<div style="${card('padding:16px 18px')}"><div style="${T};font-size:${x.px || 44}px;line-height:.95;color:${VERDE2}">${esc(x.n)}</div><div style="${I};font-size:12.5px;line-height:1.4;color:#1E3A35;margin-top:6px">${rico(x.rot)}</div></div>`).join('')}</div>`,
  barras: b => `${h(b.titulo)}<div style="${card('padding:16px 18px')}">${lista(b.itens).map(x => `<div style="display:grid;grid-template-columns:170px 1fr 54px;gap:12px;align-items:center;margin:8px 0">
      <div style="${I};font-size:12.5px;font-weight:700;color:${COR.tinta}">${esc(x.rot)}${x.tag ? `<div style="${S};font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${x.elim ? '#C0392B' : COR.cinza};margin-top:2px">${esc(x.tag)}</div>` : ''}</div>
      <div style="height:16px;border-radius:8px;background:#E7F1EE;overflow:hidden"><div style="height:100%;width:${Math.round(100 * x.n / (b.total || 70))}%;background:${x.elim ? `linear-gradient(90deg,${VERDE},${VERDE2})` : '#9CC9B8'};border-radius:8px"></div></div>
      <div style="${T};font-size:24px;color:${COR.tinta};text-align:right">${esc(x.n)}</div></div>`).join('')}${b.nota ? `<div style="${I};font-size:11.5px;color:${COR.cinza};margin-top:8px">${rico(b.nota)}</div>` : ''}</div>`,
  lista: b => `${h(b.titulo)}<div style="display:flex;flex-direction:column;gap:8px">${lista(b.itens).map((x, i) => `<div style="${card('padding:11px 14px;display:flex;gap:12px;align-items:flex-start')}"><span style="${T};font-size:22px;line-height:1;color:${VERDE};width:28px;flex:none">${String(i + 1).padStart(2, '0')}</span><div><div style="${I};font-size:13px;font-weight:800;color:${COR.tinta}">${rico(x.t)}</div>${x.d ? `<div style="${I};font-size:12px;line-height:1.45;color:#1E3A35;margin-top:3px">${rico(x.d)}</div>` : ''}</div></div>`).join('')}</div>`,
  datas: b => `${h(b.titulo)}<div style="position:relative;padding-left:22px;border-left:3px solid ${VERDE};margin-left:6px">${lista(b.itens).map(x => `<div style="position:relative;margin:0 0 12px"><span style="position:absolute;left:-31px;top:3px;width:14px;height:14px;border-radius:50%;background:${x.destaque ? VERDE : '#fff'};border:3px solid ${VERDE}"></span><div style="${T};font-size:20px;color:${VERDE2}">${esc(x.data)}</div><div style="${I};font-size:12.5px;line-height:1.45;color:#1E3A35">${rico(x.t)}</div></div>`).join('')}</div>`,
  texto: b => `${h(b.titulo)}${lista(b.paragrafos).map(p => `<p style="${I};font-size:13px;line-height:1.6;color:#1E3A35;margin:0 0 8px">${rico(p)}</p>`).join('')}${b.destaque ? `<div style="background:${COR.petroleo};border-radius:12px;padding:14px 18px;${I};font-size:13px;font-weight:600;line-height:1.5;color:#EFFFF6">${rico(b.destaque, true)}</div>` : ''}`,
  colunas: b => `${h(b.titulo)}<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">${lista(b.itens).map(c => `<div>${(BLOCOS[c.tipo] || BLOCOS.lista)(c)}</div>`).join('')}</div>`,
};

const capa = p => `<section class="pagina" style="background:linear-gradient(165deg,${VERDE} 0%,${VERDE2} 100%)">
  <div style="position:absolute;left:${M}px;top:56px">${marca(34)}</div>
  <div style="position:absolute;right:-120px;top:150px;opacity:.12">${simbolo(520, '#fff', VERDE2)}</div>
  <div style="position:absolute;left:${M}px;right:${M}px;top:330px">
    ${p.capa.selo ? `<span style="display:inline-block;background:${COR.petroleo};color:#fff;${S};font-size:13px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;padding:8px 14px;border-radius:6px">${esc(p.capa.selo)}</span>` : ''}
    <div style="${T};font-size:${p.capa.ts || 104}px;line-height:.98;color:#fff;margin-top:22px">${lista(p.capa.titulo).map(l => rico(l, true)).join('<br>')}</div>
    ${p.capa.sub ? `<p style="${I};font-size:18px;line-height:1.5;color:#EFFFF6;margin:24px 0 0;max-width:540px">${rico(p.capa.sub, true)}</p>` : ''}</div>
  <div style="position:absolute;left:${M}px;right:${M}px;bottom:130px;display:flex;gap:14px">${lista(p.capa.numeros).map(x => `<div style="flex:1;border-top:2px solid rgba(255,255,255,.4);padding-top:10px"><div style="${T};font-size:40px;line-height:1;color:#fff">${esc(x.n)}</div><div style="${S};font-size:10.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${COR.menta};margin-top:4px">${esc(x.rot)}</div></div>`).join('')}</div>
  <div style="position:absolute;left:${M}px;bottom:52px;${S};font-size:15px;font-weight:700;color:#fff">${PERFIL}</div></section>`;

const pagina = (p, pg, n) => `<section class="pagina" style="background:${COR.papel}">
  <div style="position:absolute;left:0;top:0;bottom:0;width:10px;background:linear-gradient(180deg,${VERDE},${VERDE2})"></div>
  <div style="position:absolute;left:${M}px;right:${M}px;top:30px;display:flex;align-items:center;gap:10px">${simbolo(30)}<span style="${S};font-size:10.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${COR.cinza}">${esc(p.cabecalho || p.titulo)}</span></div>
  <div class="cabe" style="position:absolute;left:${M}px;right:${M}px;top:84px;bottom:64px;overflow:hidden;display:flex;flex-direction:column;gap:20px">
    <div>${pg.kicker ? `<div style="${S};font-size:12px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:${VERDE2}">${esc(pg.kicker)}</div>` : ''}<div style="${T};font-size:${pg.ts || 48}px;line-height:1;color:${COR.tinta};margin-top:6px">${rico(pg.titulo)}</div>${pg.texto ? `<p style="${I};font-size:13.5px;line-height:1.55;color:#1E3A35;margin:10px 0 0">${rico(pg.texto)}</p>` : ''}</div>
    ${lista(pg.blocos).map(b => `<div>${(BLOCOS[b.tipo] || BLOCOS.texto)(b)}</div>`).join('')}
    ${pg.fonte ? `<div style="margin-top:auto;${I};font-size:10.5px;line-height:1.4;color:${COR.cinza}">${esc(pg.fonte)}</div>` : ''}</div>
  <div style="position:absolute;left:${M}px;right:${M}px;bottom:26px;display:flex;justify-content:space-between;${S};font-size:10px;font-weight:600;color:${COR.cinza}"><span>${PERFIL}</span><span>${String(n).padStart(2, '0')}</span></div></section>`;

export function renderPdf(p) {
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet">
<style>@page{size:210mm 297mm;margin:0}*{box-sizing:border-box}body{margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}p{margin:0}.pagina{position:relative;width:${W}px;height:${H}px;overflow:hidden;break-after:page}.pagina:last-child{break-after:auto}</style></head><body>
${capa(p)}${lista(p.paginas).map((pg, i) => pagina(p, pg, i + 2)).join('')}
<script>document.fonts.ready.then(() => { window.__avisos = [...document.querySelectorAll('.cabe')].flatMap((c, i) => c.scrollHeight > c.clientHeight + 1 ? ['página ' + (i + 2) + ': conteúdo passa do espaço (' + (c.scrollHeight - c.clientHeight) + ' px)'] : []); window.__pronto = true; });</script></body></html>`;
  return { html };
}

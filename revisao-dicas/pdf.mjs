// PDFs A4 da linha "Revisão em Dicas", no tema do concurso (tema.mjs):
// - renderPdf: as dicas numeradas (Parte 1: regra + explicação curta, painel e bônus; Parte 2: dicas explicadas).
// - renderCaderno: cadernos corridos do autor (questões discursivas, peças), a partir do .docx extraído.
// O conteúdo entra como uma fila de blocos e o próprio navegador distribui nas páginas (script no fim do HTML):
// cada bloco vai para a página atual até não caber; títulos (data-cola) nunca ficam sozinhos no pé da página,
// data-quebra abre página nova e data-marco registra a página do bloco (sumário e conferência).
import { FONTES, T, I, M, PERFIL, TEMAS, esc, simbolo, marca, tex, visto, carimbo } from './tema.mjs';

export const W = 794, H = 1123;
const MG = 44, TOPO = 78, PE = 62;
const n3 = n => String(n).padStart(3, '0');
const SERIF = "font-family:'Source Serif 4',Georgia,serif";
const FONTES_PDF = FONTES + '&family=Source+Serif+4:ital,wght@0,400;0,600;0,700;1,400';

// ---------- peças comuns ----------
function pecas(c) {
  const par = (t, extra = '') => `<p style="${I};font-size:12.6px;line-height:1.58;color:${c.corpo};margin:0;${extra}">${t}</p>`;
  const rico = t => esc(t).replace(/\*\*(.+?)\*\*/g, `<b style="color:${c.tinta}">$1</b>`);
  const h1 = (t, kicker, { marco, quebra = true } = {}) => `<div ${quebra ? 'data-quebra' : ''} data-cola ${marco ? `data-marco="${esc(marco)}"` : ''} data-mat="${esc(marco || t)}" style="${quebra ? '' : 'margin-top:14px'}"><div style="${M};font-size:10.5px;letter-spacing:.24em;text-transform:uppercase;color:${c.corForte}">${esc(kicker)}</div><div style="${T};font-size:${t.length > 30 ? 38 : 46}px;line-height:.95;color:${c.tinta};margin-top:4px">${esc(t)}</div></div>`;
  const h3 = t => `<div data-cola style="${T};font-size:19px;line-height:1.05;color:${c.tinta};display:flex;align-items:center;gap:9px;margin-top:6px"><span style="width:6px;height:17px;background:${c.cor};border-radius:2px;flex:none"></span>${esc(t)}</div>`;
  const marcar = t => `<div style="display:grid;grid-template-columns:16px 1fr;gap:9px;align-items:start;${I};font-size:12.4px;line-height:1.45;color:${c.tinta};font-weight:600"><span style="width:14px;height:14px;border:1.6px solid ${c.tinta};border-radius:4px;margin-top:2px"></span>${esc(t.replace(/^□\s*/, ''))}</div>`;
  const tabela = (linhas, larg) => `<div style="background:${c.cartao};border:1.3px solid ${c.linha};border-radius:13px;overflow:hidden">${linhas.map((l, i) => `<div style="display:grid;grid-template-columns:${larg || l.map((_, k) => k ? '1fr' : 'minmax(60px,auto)').join(' ')};gap:14px;padding:${i ? '7px' : '9px'} 16px;${i ? `border-top:1px solid ${c.linha}` : `background:${c.escuro}`}">${l.map(x => `<div style="${i ? `${I};font-size:11.6px;line-height:1.4;color:${c.corpo}` : `${M};font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:${c.claro}`}">${esc(x)}</div>`).join('')}</div>`).join('')}</div>`;
  return { par, rico, h1, h3, marcar, tabela };
}

// Capa (comum aos PDFs): textura, número vazado, marca, rótulo do volume, cartões de amostra, carimbo e título.
function capa(c, prod, cfg, amostra) {
  const caixa = `<span style="display:block;width:15px;height:15px;border:1.6px solid ${c.tinta};border-radius:4px;margin:7px auto 0"></span>`;
  const cb = prod.carimbo || { topo: 'PROVA OBJETIVA', base: prod.banca.toUpperCase(), centro: prod.prova, sub: 'DOMINGO' };
  return `<section class="pagina" style="background:${c.escuro}">
    <div style="position:absolute;inset:0;background-image:${tex(c, c.claro, .2, 88)}"></div>
    <div style="position:absolute;inset:0;background:radial-gradient(90% 55% at 0% 100%,${c.escuro3} 0%,transparent 70%),radial-gradient(70% 45% at 100% 0%,${c.brilho} 0%,transparent 70%)"></div>
    <div style="position:absolute;left:0;top:0;bottom:0;width:12px;background:${c.cor}"></div>
    <div style="position:absolute;right:-18px;top:118px;${T};font-size:430px;line-height:.8;color:transparent;-webkit-text-stroke:2.4px ${c.vazado}">${esc(cfg.vazado || prod.total)}</div>
    <div style="position:absolute;left:60px;top:52px">${marca(40, '#fff', c.claro, 'gc')}</div>
    <div style="position:absolute;right:56px;top:58px;${M};font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:${c.escuro};background:${c.claro};padding:6px 11px;border-radius:5px">${esc(cfg.rotulo)}</div>
    <div style="position:absolute;left:120px;right:150px;top:190px;display:grid;gap:13px">${amostra.map((d, i) => `<div style="background:#fff;border-radius:12px;display:grid;grid-template-columns:62px 1fr;padding:11px 16px 11px 0;box-shadow:0 22px 40px -18px rgba(0,0,0,.6);transform:translateX(${[0, -52, 70][i] || 0}px) rotate(${[-1.2, .8, -.6][i] || 0}deg)">
        <div style="text-align:center;border-right:1.3px solid ${c.linha};margin-right:14px"><div style="${T};font-size:28px;line-height:1;color:${c.corForte}">${esc(d.n)}</div>${i === 0 ? `<span style="display:flex;justify-content:center;margin-top:4px">${visto(17, c.ok, 3.6)}</span>` : caixa}</div>
        <div style="${I};font-weight:700;font-size:13.4px;line-height:1.36;color:${c.tinta};align-self:center">${esc(d.r)}</div></div>`).join('')}</div>
    <div style="position:absolute;right:50px;top:486px">${carimbo({ px: 148, cor: c.carimbo, ...cb, id: 'cp' })}</div>
    <div style="position:absolute;left:60px;right:60px;bottom:150px">
      <span style="${M};font-size:12px;letter-spacing:.12em;text-transform:uppercase;background:${c.cor};color:${c.sobreCor};padding:7px 12px;border-radius:6px">${esc(prod.selo)}</span>
      <div style="${T};font-size:112px;line-height:.88;color:#fff;margin-top:18px">${esc(cfg.titulo[0])}<br><span style="color:${c.claro}">${esc(cfg.titulo[1])}</span></div>
      <p style="${I};font-size:15.5px;line-height:1.5;color:rgba(255,255,255,.84);margin:18px 0 0;max-width:540px">${esc(cfg.sub)}</p>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:20px">${cfg.chips.map(x => `<span style="${M};font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:${c.claro};border:1.3px solid ${c.vazado};padding:6px 11px;border-radius:999px">${esc(x)}</span>`).join('')}</div></div>
    <div style="position:absolute;left:60px;right:60px;bottom:56px;display:flex;justify-content:space-between;align-items:flex-end">
      <div><div style="${M};font-size:9.5px;letter-spacing:.22em;text-transform:uppercase;color:${c.claro}">Criado por</div><div style="${I};font-weight:800;font-size:22px;color:#fff;margin-top:3px">Líbero Filho</div></div>
      <div style="${M};font-size:11px;letter-spacing:.16em;color:${c.claro}">${PERFIL}</div></div></section>`;
}

// Documento: capa + fila de blocos + página-molde + script de paginação.
function documento(c, cfg, capaHtml, fila) {
  const css = `@page{size:210mm 297mm;margin:0}*{box-sizing:border-box}body{margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}p{margin:0}
.pagina{position:relative;width:${W}px;height:${H}px;overflow:hidden;break-after:page}.pagina:last-child{break-after:auto}
.corpo{position:absolute;left:${MG}px;right:${MG}px;top:${TOPO}px;bottom:${PE}px;overflow:hidden;display:flex;flex-direction:column;gap:9px}
.corpo>*{flex-shrink:0}
#fila{position:absolute;left:-9999px;width:${W - 2 * MG}px}`;
  const molde = `<section class="pagina" style="background:${c.papel}">
    <div style="position:absolute;left:${MG}px;right:${MG}px;top:26px;display:flex;align-items:center;justify-content:space-between;gap:20px;padding-bottom:12px;border-bottom:1.3px solid ${c.linha}">
      <div style="display:flex;align-items:center;gap:10px;flex:none">${simbolo(26, 'gp')}<div><div style="${M};font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:${c.corForte}">${esc(cfg.cabecalho)}</div><div style="${I};font-weight:700;font-size:10.5px;color:${c.cinza};margin-top:1px">por Líbero Filho</div></div></div>
      <div class="mat" style="${T};font-size:14px;color:${c.tinta};text-align:right;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"></div></div>
    <div class="corpo"></div>
    <div style="position:absolute;left:${MG}px;right:${MG}px;bottom:26px;display:flex;align-items:center;gap:14px;${M};font-size:9px;letter-spacing:.2em;color:${c.cinza}"><span>${PERFIL.toUpperCase()}</span><span style="flex:1;height:4px;border-radius:2px;background:${c.linha};overflow:hidden"><i class="prog" style="display:block;height:100%;background:${c.cor};border-radius:2px"></i></span><span class="num" style="color:${c.tinta}"></span></div></section>`;
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${esc(cfg.cabecalho)}</title><link href="${FONTES_PDF}" rel="stylesheet"><style>${css}</style></head><body>
${capaHtml}<div id="fila">${fila.join('\n')}</div><template id="molde">${molde}</template>
<script>
document.fonts.ready.then(() => {
  const fila = [...document.getElementById('fila').children], molde = document.getElementById('molde'), avisos = [], marcos = [];
  let pg, mat = '';
  const nova = () => { const s = molde.content.firstElementChild.cloneNode(true); document.body.appendChild(s); pg = { s, corpo: s.querySelector('.corpo') }; return pg; };
  const cabe = () => pg.corpo.scrollHeight <= pg.corpo.clientHeight + 1;
  nova();
  for (const el of fila) {
    if (el.hasAttribute('data-quebra') && pg.corpo.children.length) nova();
    pg.corpo.appendChild(el);
    if (!cabe() && pg.corpo.children.length > 1) {
      const leva = [el]; let ant = el.previousElementSibling;
      while (ant && ant.hasAttribute('data-cola') && ant.previousElementSibling) { leva.unshift(ant); ant = ant.previousElementSibling; }
      nova(); leva.forEach(x => pg.corpo.appendChild(x));
      if (!cabe()) avisos.push('bloco maior que a página: ' + el.textContent.slice(0, 60));
    }
    if (el.dataset.mat) mat = el.dataset.mat;
    pg.s.dataset.mat = pg.s.dataset.mat || mat;
    if (el.hasAttribute('data-escura')) pg.s.dataset.escura = '1';
    if (el.dataset.marco) marcos.push([el.dataset.marco, document.querySelectorAll('.pagina').length]);
  }
  document.getElementById('fila').remove();
  const pags = [...document.querySelectorAll('.pagina')], n = pags.length;
  pags.forEach((s, i) => { if (!i) return; s.querySelector('.mat').textContent = s.dataset.mat || ''; s.querySelector('.num').textContent = String(i + 1).padStart(2, '0') + '/' + String(n).padStart(2, '0'); s.querySelector('.prog').style.width = ((i + 1) / n * 100) + '%';
    if (s.dataset.escura) { s.style.background = '${c.escuro}'; s.querySelectorAll('.mat,.num').forEach(x => x.style.color = '#fff'); } });
  window.__avisos = avisos; window.__marcos = marcos; window.__pronto = true;
});
</script></body></html>`;
}

// Divisória de parte: ocupa a página inteira, no fundo escuro com a textura.
const divisoria = (c, kicker, titulo, sub, marco) => `<div data-quebra data-escura data-marco="${esc(marco)}" data-mat="${esc(marco)}" style="height:${H - TOPO - PE}px;position:relative;margin:0 -${MG}px;border-radius:0;overflow:hidden">
  <div style="position:absolute;inset:-${TOPO}px 0 -${PE}px;background:${c.escuro};background-image:${tex(c, c.claro, .12, 120)}"></div>
  <div style="position:absolute;left:0;top:0;bottom:0;width:10px;background:${c.cor}"></div>
  <div style="position:absolute;left:${MG + 10}px;right:${MG}px;bottom:120px"><div style="${M};font-size:13px;letter-spacing:.24em;text-transform:uppercase;color:${c.claro}">${esc(kicker)}</div>
  <div style="${T};font-size:${titulo.length > 22 ? 70 : 92}px;line-height:.9;color:#fff;margin-top:10px">${esc(titulo)}</div>
  ${sub ? `<div style="${I};font-size:15px;line-height:1.5;color:rgba(255,255,255,.82);margin-top:16px;max-width:520px">${esc(sub)}</div>` : ''}</div></div>`;

// ---------- dicas ----------
export function renderPdf(prod, conteudo, parte, explicadas = {}) {
  const c = TEMAS[prod.tema], cfg = { rotulo: `Parte ${parte} de 2`, ...prod[`parte${parte}`] };
  const { par, h1, marcar, tabela } = pecas(c);
  const P = t => par(esc(t));
  const todas = conteudo.materias.flatMap(m => m.blocos.flatMap(b => b.dicas));
  const porN = Object.fromEntries(todas.map(d => [d.n, d]));
  const caixa = `<span style="display:block;width:15px;height:15px;border:1.6px solid ${c.tinta};border-radius:4px;margin:7px auto 0"></span>`;
  // matérias em destaque: as listadas em prod.destaque ou, no TCE, as específicas (2 pontos)
  const forte = nome => prod.destaque ? prod.destaque.includes(nome) : /ESPEC/i.test(conteudo.materias.find(m => m.nome === nome)?.rotulo || '');
  const pontos = m => /ESPEC/i.test(m.rotulo) ? 2 : /GERAIS/i.test(m.rotulo) ? 1 : 0;
  const etiqueta = m => {
    if (prod.faixa === 'pontos') { const p = pontos(m); return p ? [p === 2 ? 'vale 2 pontos' : 'vale 1 ponto', p === 2] : null; }
    return forte(m.nome) && prod.etiquetaForte ? [prod.etiquetaForte, true] : null;
  };
  const kicker = m => {
    const d = m.blocos.flatMap(b => b.dicas).length;
    if (prod.faixa === 'pontos') { const p = pontos(m); return `${d} dicas · ${p === 2 ? 'específicos de auditor' : p === 1 ? 'conhecimentos gerais' : 'objetiva e discursiva'}`; }
    return m.rotulo.toLowerCase().replace(/\s*•\s*/g, ' · ');
  };

  const faixaMateria = m => {
    const d = m.blocos.flatMap(b => b.dicas), et = etiqueta(m);
    const px = m.nome.length > 34 ? 25 : m.nome.length > 24 ? 30 : 36;
    return `<div data-quebra data-cola data-mat="${esc(m.nome)}" data-marco="${esc(m.nome)}" style="position:relative;background:${c.escuro};border-radius:14px;overflow:hidden;padding:15px 20px 16px;display:flex;align-items:flex-end;justify-content:space-between;gap:14px">
      <div style="position:absolute;inset:0;background-image:${tex(c, c.claro, .13, 46)}"></div>
      <div style="position:absolute;left:0;top:0;bottom:0;width:7px;background:${c.cor}"></div>
      <div style="position:relative;min-width:0"><div style="display:flex;align-items:center;gap:10px"><span style="${M};font-size:10.5px;letter-spacing:.22em;color:${c.claro};text-transform:lowercase">${esc(kicker(m))}</span>${et ? `<span style="${M};font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;background:${et[1] ? c.cor : 'transparent'};color:${et[1] ? c.sobreCor : c.claro};border:1.3px solid ${et[1] ? c.cor : c.claro};padding:3px 8px;border-radius:5px;white-space:nowrap">${esc(et[0])}</span>` : ''}</div>
        <div style="${T};font-size:${px}px;line-height:1;color:#fff;margin-top:7px">${esc(m.nome)}</div></div>
      <div style="position:relative;${T};font-size:42px;line-height:.9;color:transparent;-webkit-text-stroke:1.6px ${c.claro};white-space:nowrap">${n3(d[0].n)}–${n3(d.at(-1).n)}</div></div>`;
  };
  const tituloBloco = b => `<div data-cola style="display:flex;align-items:flex-end;justify-content:space-between;gap:20px;border-bottom:2.5px solid ${c.cor};padding:4px 0 7px">
      <div style="${T};font-size:21px;line-height:1.02;color:${c.tinta};max-width:60%">${esc(b.nome)}</div>
      <div style="${I};font-size:10.5px;line-height:1.35;color:${c.cinza};text-align:right;max-width:44%">${esc(b.base)}</div></div>`;
  const dica = (d, mat) => {
    const x = explicadas[n3(d.n)];
    const corpo = parte === 1
      ? `<div style="${I};font-weight:700;font-size:13.6px;line-height:1.36;color:${c.tinta}">${esc(d.r)}</div><div style="${I};font-size:12.4px;line-height:1.45;color:${c.corpo2};margin-top:4px">${esc(d.e)}</div>`
      : `<div style="${I};font-weight:700;font-size:13.6px;line-height:1.36;color:${c.tinta}">${esc(d.r)}</div>
         ${(x?.x || [d.e]).map(p => `<p style="${I};font-size:12.2px;line-height:1.55;color:${c.corpo};margin:6px 0 0;text-align:justify;hyphens:auto">${esc(p)}</p>`).join('')}
         ${x?.f ? `<div style="display:inline-flex;align-items:center;gap:6px;margin-top:8px;${M};font-size:10px;color:${c.corForte};background:${c.chip};border-radius:6px;padding:4px 9px">${visto(11, c.corForte, 3.4)}${esc(x.f)}</div>` : ''}`;
    return `<div data-mat="${esc(mat)}" lang="pt-BR" style="background:${c.cartao};border:1.3px solid ${c.linha};border-radius:13px;display:grid;grid-template-columns:54px 1fr;padding:${parte === 1 ? '10px 16px 11px 0' : '12px 18px 13px 0'}">
      <div style="text-align:center;border-right:1.3px solid ${c.linha};margin-right:14px"><div style="${T};font-size:25px;line-height:1;color:${c.corForte}">${n3(d.n)}</div>${caixa}</div><div style="${I};hyphens:auto">${corpo}</div></div>`;
  };
  const ficha = (t, ps) => `<div style="background:${c.cartao};border:1.3px solid ${c.linha};border-radius:13px;padding:13px 17px"><div style="${I};font-weight:800;font-size:13.4px;color:${c.tinta};margin-bottom:5px">${esc(t)}</div>${ps.map(p => par(esc(p), 'margin-top:4px')).join('')}</div>`;

  const amostra = (prod.amostra || []).map(n => porN[n]).filter(Boolean).map(d => ({ n: n3(d.n), r: d.r }));
  const fila = [];
  const [como, distrib] = conteudo.intro;
  const legenda = prod.legenda || ['Específicos · 2 pontos por questão', 'Gerais · 1 ponto por questão'];
  if (parte === 1) {
    fila.push(h1('Como usar', 'Antes de começar', { marco: 'Como usar' }));
    fila.push(`<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">${prod.numeros.map(x => `<div style="background:${c.cartao};border:1.3px solid ${c.linha};border-radius:13px;padding:13px 14px"><div style="${T};font-size:44px;line-height:.9;color:${c.corForte}">${esc(x.n)}</div><div style="${I};font-size:11.2px;line-height:1.4;color:${c.tinta};margin-top:7px">${esc(x.rot)}</div></div>`).join('')}</div>`);
    como.p.forEach(p => fila.push(P(p)));
    fila.push(h1('Distribuição', `Onde estão as ${prod.total} dicas`, { marco: 'Distribuição das dicas' }));
    fila.push(P(distrib.p[0]));
    const [cab, ...linhas] = conteudo.tabela;
    const col = re => cab.findIndex(h => re.test(h));
    const iD = col(/Dicas/), iF = col(/Numera|Faixa/), iB = col(/Bloco/), iQ = col(/Quest/);
    const max = Math.max(...linhas.map(l => +l[iD]));
    fila.push(`<div style="background:${c.cartao};border:1.3px solid ${c.linha};border-radius:13px;padding:8px 18px">${linhas.map((l, i) => { const f = forte(l[0]); return `<div style="display:grid;grid-template-columns:238px 1fr 34px 82px 74px;gap:12px;align-items:center;padding:7.5px 0;${i ? `border-top:1px solid ${c.linha}` : ''}">
        <div style="${I};font-weight:700;font-size:12.2px;color:${c.tinta}">${esc(l[0])}</div>
        <div style="height:9px;border-radius:5px;background:${c.chip}"><div style="height:100%;width:${l[iD] / max * 100}%;border-radius:5px;background:${f ? c.cor : iB >= 0 && l[iB] === 'Estratégia' ? c.cinza : c.escuro3}"></div></div>
        <div style="${T};font-size:19px;color:${c.corForte};text-align:right">${esc(l[iD])}</div>
        <div style="${M};font-size:9.5px;color:${c.cinza};text-align:right">${esc(l[iF].replace(' a ', '–'))}</div>
        <div style="${M};font-size:8.5px;letter-spacing:.1em;text-transform:uppercase;color:${f ? c.corForte : c.cinza};text-align:right">${esc(iB >= 0 ? l[iB] : `${l[iQ]} questões`)}</div></div>`; }).join('')}</div>`);
    fila.push(`<div style="display:flex;gap:18px;${M};font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;color:${c.cinza}"><span><i style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${c.cor};margin-right:6px"></i>${esc(legenda[0])}</span><span><i style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${c.escuro3};margin-right:6px"></i>${esc(legenda[1])}</span></div>`);
  } else {
    fila.push(h1('Como ler', 'Parte 2 · Dicas explicadas', { marco: 'Como ler' }));
    fila.push(P(`Esta é a segunda parte da Revisão em Dicas do ${prod.concurso}. As ${prod.total} dicas estão na mesma ordem e com a mesma numeração da Parte 1. Aqui, cada uma vem com a explicação completa: o que a regra diz, a distinção ou a pegadinha que costuma aparecer na alternativa errada e o fundamento para conferir.`));
    fila.push(P('Use assim: leia a Parte 1 e marque a caixa das dicas que você não conseguir explicar sem olhar. Depois venha aqui só nas marcadas, pelo número. A etiqueta com o visto, no fim de cada dica, indica onde conferir a regra.'));
    (cfg.avisos || []).forEach(t => fila.push(P(t)));
    fila.push(`<div style="background:${c.escuro};border-radius:13px;padding:15px 18px;display:grid;grid-template-columns:repeat(4,1fr);gap:14px">${prod.numeros.map(x => `<div><div style="${T};font-size:36px;line-height:.9;color:${c.claro}">${esc(x.n)}</div><div style="${I};font-size:10.8px;line-height:1.4;color:rgba(255,255,255,.82);margin-top:6px">${esc(x.rot)}</div></div>`).join('')}</div>`);
  }
  for (const m of conteudo.materias) {
    fila.push(faixaMateria(m));
    for (const b of m.blocos) { fila.push(tituloBloco(b)); b.dicas.forEach(d => fila.push(dica(d, m.nome))); }
  }
  if (parte === 1) {
    fila.push(h1('Painel de revisão', 'Depois da 1ª leitura', { marco: 'Painel de revisão' }));
    fila.push(P('Pinte o número das dicas em que você hesitou. Na véspera, revise só as pintadas: é a sua lista pessoal de pontos fracos.'));
    const faixas = conteudo.materias.map(m => [m.blocos[0].dicas[0].n, forte(m.nome)]);
    const destaque = n => faixas.filter(f => f[0] <= n).at(-1)[1];
    fila.push(`<div style="display:grid;grid-template-columns:repeat(20,1fr);gap:4px">${todas.map(d => `<span style="${M};font-size:8.6px;text-align:center;padding:6.5px 0;border-radius:5px;background:#fff;border:1.2px solid ${destaque(d.n) ? c.painelForte : c.linha};color:${destaque(d.n) ? c.corForte : c.cinza}">${n3(d.n)}</span>`).join('')}</div>`);
    fila.push(`<div style="${M};font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;color:${c.cinza}">${esc(prod.painelNota || 'Em coral: dicas das matérias específicas (2 pontos por questão)')}</div>`);
    fila.push(`<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div style="background:#fff;border:1.3px solid ${c.linha};border-radius:13px;padding:14px 17px"><div style="${T};font-size:19px;color:${c.tinta};margin-bottom:8px">Minhas contas</div>${['Dicas marcadas na 1ª leitura', 'Dicas marcadas na 2ª leitura', 'Matéria com mais marcas'].map(t => `<div style="display:flex;align-items:flex-end;gap:8px;${I};font-weight:600;font-size:12px;color:${c.tinta};margin-top:9px">${t}<span style="flex:1;border-bottom:1.2px solid ${c.cinza}"></span></div>`).join('')}</div>
      <div style="background:${c.escuro};border-radius:13px;padding:14px 17px"><div style="${T};font-size:19px;color:#fff;margin-bottom:8px">Véspera da prova</div>${(prod.vespera || ['Revisar só as dicas pintadas', 'Reler as matérias de 2 pontos', 'Separar documento e caneta preta']).map(t => `<div style="display:flex;align-items:center;gap:9px;${I};font-weight:600;font-size:12px;color:${c.claro};margin-top:8px"><span style="width:14px;height:14px;border:1.6px solid ${c.claro};border-radius:4px"></span>${esc(t)}</div>`).join('')}</div></div>`);
    for (const s of conteudo.bonus) {
      const t = s.titulo;
      const k = /Treino|Gabarito|Questões/.test(t) ? 'Bônus · treino' : /Fontes/.test(t) ? 'Para conferir' : /Técnico/.test(t) ? 'Bônus · cargo 16' : 'Bônus · roteiro';
      fila.push(h1(t, k, { marco: t }));
      if (/Fontes/.test(t)) {
        s.p.filter(p => !/https?:/.test(p)).forEach(p => fila.push(P(p)));
        const links = s.p.filter(p => /https?:/.test(p)).map(p => p.split(/(?=https?:)/));
        for (let i = 0; i < links.length; i += 22) fila.push(`<div style="background:#fff;border:1.3px solid ${c.linha};border-radius:13px;padding:6px 16px">${links.slice(i, i + 22).map(([n, u], j) => `<div style="padding:6px 0;${j ? `border-top:1px solid ${c.linha}` : ''}"><div style="${I};font-weight:700;font-size:11.2px;color:${c.tinta}">${esc(n)}</div><div style="${M};font-weight:500;font-size:8px;color:${c.cinza};word-break:break-all">${esc(u)}</div></div>`).join('')}</div>`);
        continue;
      }
      (s.p || []).forEach(p => fila.push(/^Gabarito:|^\d\d [A-E] \|/.test(p)
        ? `<div style="background:${c.escuro};border-radius:13px;padding:13px 17px;display:grid;grid-template-columns:repeat(12,1fr);gap:6px">${[...p.matchAll(/(\d\d) ([A-E])/g)].map(g => `<div style="text-align:center"><div style="${M};font-size:9px;color:${c.claro}">${g[1]}</div><div style="${T};font-size:26px;color:#fff;line-height:1">${g[2]}</div></div>`).join('')}</div>`
        : P(p)));
      (s.tabelas || []).forEach(tb => fila.push(tabela(tb, tb[0].length === 3 ? '62px 1fr 1.6fr' : null)));
      if (/múltipla escolha|fixação/i.test(t)) {
        s.itens.forEach(q => { const [, num, tema] = q.titulo.match(/Questão (\d+) (.*)/); const alts = q.p.filter(x => /^[A-E]\)/.test(x)), en = q.p.filter(x => !/^[A-E]\)/.test(x));
          fila.push(`<div style="background:#fff;border:1.3px solid ${c.linha};border-radius:13px;display:grid;grid-template-columns:54px 1fr;padding:12px 17px 12px 0"><div style="text-align:center;border-right:1.3px solid ${c.linha};margin-right:14px"><div style="${M};font-size:8px;letter-spacing:.14em;color:${c.cinza}">QUESTÃO</div><div style="${T};font-size:27px;line-height:1;color:${c.corForte}">${num}</div></div><div><div style="${M};font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:${c.corForte}">${esc(tema)}</div>${en.map(e => `<div style="${I};font-weight:700;font-size:12.8px;line-height:1.4;color:${c.tinta};margin-top:3px">${esc(e)}</div>`).join('')}<div style="display:grid;gap:3px;margin-top:7px">${alts.map(a => `<div style="display:grid;grid-template-columns:20px 1fr;gap:8px;${I};font-size:12.2px;line-height:1.4;color:${c.corpo}"><span style="${M};font-size:10px;width:18px;height:18px;border:1.3px solid ${c.cinza};border-radius:50%;display:flex;align-items:center;justify-content:center;color:${c.tinta}">${a[0]}</span>${esc(a.slice(2).trim())}</div>`).join('')}</div></div></div>`); });
      } else if (/Gabarito/.test(t)) {
        s.itens.forEach(q => { const [, num, letra] = q.titulo.match(/Questão (\d+) alternativa ([A-E])/);
          fila.push(`<div style="background:#fff;border:1.3px solid ${c.linha};border-radius:13px;display:grid;grid-template-columns:54px 1fr;padding:11px 17px 11px 0"><div style="text-align:center;border-right:1.3px solid ${c.linha};margin-right:14px"><div style="${M};font-size:9px;color:${c.cinza}">${num}</div><div style="${T};font-size:27px;line-height:1;color:${c.ok}">${letra}</div></div><div>${q.p.map(p => P(p)).join('')}</div></div>`); });
      } else if (/discursiv/i.test(t)) {
        s.itens.forEach(it => {
          if (/^Confira/.test(it.titulo)) { fila.push(`<div style="background:${c.creme};border:1.3px dashed ${c.corForte};border-radius:13px;padding:12px 16px;display:grid;gap:6px"><div style="${M};font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:${c.corForte}">Confira na sua resposta</div>${it.p.map(p => /^□/.test(p) ? marcar(p) : par(esc(p), `font-size:11px;color:${c.cinza};margin-top:3px`)).join('')}</div>`); return; }
          if (/^Resposta/.test(it.titulo)) { fila.push(`<div data-cola style="${M};font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:${c.ok};display:flex;align-items:center;gap:6px">${visto(12, c.ok, 3.4)}Resposta de referência</div>`); it.p.forEach(p => fila.push(par(esc(p), 'text-align:justify'))); return; }
          fila.push(`<div style="background:${c.escuro};border-radius:13px;padding:14px 18px;margin-top:8px"><div style="${T};font-size:21px;line-height:1.05;color:#fff">${esc(it.titulo)}</div>${it.p.map(p => `<p style="${I};font-size:12.4px;line-height:1.55;color:rgba(255,255,255,.86);margin:7px 0 0">${esc(p).replace(/^Comando:/, `<b style="color:${c.claro}">Comando:</b>`)}</p>`).join('')}</div>`);
        });
      } else s.itens.forEach(it => fila.push(ficha(it.titulo, it.p)));
    }
  } else {
    fila.push(h1('Feche a revisão', `Depois das ${prod.total}`, { marco: 'Feche a revisão' }));
    (cfg.fecho || []).forEach(t => fila.push(P(t)));
  }
  return { html: documento(c, cfg, capa(c, prod, cfg, amostra), fila) };
}

// ---------- cadernos corridos (discursivas, peças) ----------
// blocos: [{s: estilo do Word, t: texto ou linhas da tabela}]; paginas: {marco: página} da passada anterior (sumário).
export function renderCaderno(prod, cad, blocos, paginas = {}) {
  const c = TEMAS[prod.tema], cfg = cad;
  const { par, rico, h1, h3, marcar, tabela } = pecas(c);
  const fila = [], sumario = [];
  let secao = '', i0 = blocos.findIndex(b => b.s === 'Heading1'), primeiro = true, pulando = false;
  const romano = { I: 'Parte I', II: 'Parte II', III: 'Parte III', IV: 'Parte IV', V: 'Parte V', VI: 'Parte VI', VII: 'Parte VII', VIII: 'Parte VIII' };
  for (const b of blocos.slice(i0)) {
    if (b.s === 'Heading1') {
      pulando = false; secao = '';
      if (/^Sumário/.test(b.t)) { fila.push('{{SUMARIO}}'); pulando = true; continue; }
      const parte = b.t.match(/^Parte ([IVX]+)\s+(.*)$/);
      if (parte) { sumario.push(['parte', b.t, parte[2]]); fila.push(divisoria(c, romano[parte[1]] || 'Parte ' + parte[1], parte[2], '', b.t)); continue; }
      const quebra = primeiro || /Mapa|Referências/.test(b.t);
      if (quebra) sumario.push(['h1', b.t]);
      fila.push(h1(b.t, /Referências/.test(b.t) ? 'Para conferir' : cfg.kicker || 'Antes de começar', { marco: b.t, quebra }));
      primeiro = false; continue;
    }
    if (pulando) continue;
    if (b.s === 'Heading2') {
      const m = b.t.match(/^(\d+)\s+(.*)$/), num = m ? m[1] : '', tit = m ? m[2] : b.t;
      sumario.push(['caso', b.t, tit, num]);
      fila.push(`<div data-quebra data-cola data-marco="${esc(b.t)}" data-mat="${esc(`${cfg.item || 'Caso'} ${num}`)}" style="position:relative;background:${c.escuro};border-radius:14px;overflow:hidden;padding:18px 22px 18px 0;display:grid;grid-template-columns:96px 1fr;align-items:center">
        <div style="position:absolute;inset:0;background-image:${tex(c, c.claro, .13, 46)}"></div><div style="position:absolute;left:0;top:0;bottom:0;width:7px;background:${c.cor}"></div>
        <div style="position:relative;${T};font-size:56px;line-height:.85;color:transparent;-webkit-text-stroke:1.6px ${c.claro};text-align:center">${esc(num)}</div>
        <div style="position:relative"><div style="${M};font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:${c.claro}">${esc(cfg.item || 'Caso')} ${esc(num)} de ${esc(cfg.total)}</div><div style="${T};font-size:${tit.length > 48 ? 24 : 29}px;line-height:1;color:#fff;margin-top:6px">${esc(tit)}</div></div></div>`);
      continue;
    }
    if (b.s === 'Heading3') { secao = b.t; fila.push(h3(b.t)); continue; }
    if (b.s === 'Heading4') { fila.push(`<div data-cola style="${I};font-weight:800;font-size:13.8px;color:${c.tinta};margin-top:6px">${esc(b.t)}</div>`); continue; }
    if (b.s === 'TBL') { const n = b.t[0].length, [cab, ...rs] = b.t; for (let i = 0; i < rs.length; i += 17) fila.push(tabela([cab, ...rs.slice(i, i + 17)], n === 2 ? (cab[0].length < 12 ? '60px 1fr' : '1fr 1.6fr') : n === 3 ? '60px 1fr 1.5fr' : null)); continue; }
    const t = b.t;
    if (/^Redação|^Resposta de referência/.test(secao) && cfg.documento) {
      // redação do ato: folha de documento, em serifa
      const titulo = /^\*\*[^*]+\*\*$/.test(t);
      fila.push(`<div style="background:#fff;border-left:1.3px solid ${c.linha};border-right:1.3px solid ${c.linha};margin:-9px 0 0;padding:${titulo ? '18px 34px 6px' : '4px 34px'};${titulo ? `border-top:3px solid ${c.cor};margin-top:2px` : ''}"><p style="${SERIF};font-size:${titulo ? 15 : 12.8}px;line-height:1.62;color:#1E1E1A;text-align:${titulo ? 'center' : 'justify'};${titulo ? 'font-weight:700;letter-spacing:.04em' : 'text-indent:2em'};hyphens:auto" lang="pt-BR">${rico(t).replace(/<b[^>]*>|<\/b>/g, titulo ? '' : '$&')}</p></div>`);
      continue;
    }
    if (/^•/.test(t)) { fila.push(`<div style="display:grid;grid-template-columns:14px 1fr;gap:8px;${I};font-size:12.4px;line-height:1.5;color:${c.corpo}"><span style="width:7px;height:7px;border-radius:2px;background:${c.carimbo};margin-top:6px"></span><span>${rico(t.replace(/^•\s*/, ''))}</span></div>`); continue; }
    if (/^□/.test(t)) { fila.push(marcar(t)); continue; }
    if (/^Referências do caso$|^Base normativa$/.test(t)) { fila.push(`<div data-cola style="${M};font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:${c.corForte};margin-top:4px">${esc(t)}</div>`); continue; }
    if (/ · texto de referência$/.test(t)) { fila.push(`<div style="${M};font-weight:500;font-size:9.5px;color:${c.cinza}">${esc(t.replace(/ · texto de referência$/, ''))}</div>`); continue; }
    if (/^Roteiro/.test(secao) && /^\d+\.\s/.test(t)) { const [, n, r] = t.match(/^(\d+)\.\s(.*)$/); fila.push(`<div style="display:grid;grid-template-columns:28px 1fr;gap:8px;align-items:center;${I};font-weight:600;font-size:12.4px;color:${c.tinta}"><span style="${T};font-size:20px;color:${c.corForte}">${n}</span>${esc(r)}</div>`); continue; }
    if (/^Roteiro/.test(secao)) { fila.push(`<div style="${I};font-size:11.6px;line-height:1.45;color:${c.corpo2};padding-left:36px">${esc(t)}</div>`); continue; }
    const lead = t.match(/^\*\*([^*]+?)\s*\*\*\s*(.*)$/);
    if (lead && /Fato alterado/.test(lead[1])) { fila.push(`<div data-cola style="background:${c.creme};border:1.3px dashed ${c.corForte};border-radius:12px;padding:11px 15px;margin-top:4px"><div style="${M};font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:${c.corForte}">Fato alterado</div><p style="${I};font-weight:600;font-size:12.4px;line-height:1.5;color:${c.tinta};margin:4px 0 0">${rico(lead[2])}</p></div>`); continue; }
    if (lead) { fila.push(par(`<b style="color:${c.tinta}">${esc(lead[1])}</b> ${rico(lead[2])}`)); continue; }
    if (/^\*\*.+\*\*$/.test(t) && t.length < 90) { fila.push(`<div style="${I};font-weight:800;font-size:12.6px;color:${c.tinta}">${esc(t.replace(/\*\*/g, ''))}</div>`); continue; }
    fila.push(par(rico(t), /^Resposta|Análise|Comentário/.test(secao) ? 'text-align:justify;hyphens:auto' : ''));
  }
  // sumário com as páginas da passada anterior
  const pg = k => paginas[k] ? String(paginas[k]).padStart(2, '0') : '00';
  const linhas = sumario.map(([tipo, k, tit, num]) => tipo === 'parte'
    ? `<div style="display:flex;align-items:flex-end;gap:10px;margin-top:10px;padding:6px 0;border-bottom:2px solid ${c.cor}"><span style="${T};font-size:17px;color:${c.tinta}">${esc(k)}</span><span style="flex:1"></span><span style="${M};font-size:10px;color:${c.corForte}">${pg(k)}</span></div>`
    : tipo === 'caso'
      ? `<div style="display:grid;grid-template-columns:30px 1fr auto;gap:8px;align-items:baseline;padding:3.5px 0;${I};font-size:11.6px;color:${c.corpo}"><span style="${M};font-size:9.5px;color:${c.corForte}">${esc(num)}</span><span>${esc(tit)}</span><span style="${M};font-size:9.5px;color:${c.cinza}">${pg(k)}</span></div>`
      : `<div style="display:flex;gap:10px;padding:4px 0;${I};font-weight:700;font-size:11.8px;color:${c.tinta}"><span>${esc(k)}</span><span style="flex:1;border-bottom:1px dotted ${c.cinza};margin-bottom:4px"></span><span style="${M};font-size:9.5px;color:${c.cinza}">${pg(k)}</span></div>`);
  const meio = Math.ceil(linhas.length / 2);
  const sumHtml = [h1('Sumário', 'Neste caderno', { marco: 'Sumário' }), `<div style="background:#fff;border:1.3px solid ${c.linha};border-radius:13px;padding:10px 18px">${linhas.slice(0, meio).join('')}</div>`, `<div style="background:#fff;border:1.3px solid ${c.linha};border-radius:13px;padding:10px 18px">${linhas.slice(meio).join('')}</div>`];
  const k = fila.indexOf('{{SUMARIO}}');
  if (k >= 0) fila.splice(k, 1, ...sumHtml);
  return { html: documento(c, cfg, capa(c, prod, cfg, cfg.amostra || []), fila) };
}

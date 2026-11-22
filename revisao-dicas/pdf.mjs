// PDFs A4 da linha "Revisão em Dicas": Parte 1 (regra + explicação curta, painel e bônus) e Parte 2 (dicas
// explicadas). O conteúdo entra como uma fila de blocos e o próprio navegador distribui nas páginas
// (script no fim do HTML): cada bloco vai para a página atual até não caber; títulos nunca ficam sozinhos no pé.
import { FONTES, T, I, M, PERFIL, TEMAS, esc, simbolo, marca, azulejo, visto, carimbo } from './tema.mjs';

export const W = 794, H = 1123;
const MG = 44;
const n3 = n => String(n).padStart(3, '0');
const pontos = m => /ESPEC/i.test(m.rotulo) ? 2 : /GERAIS/i.test(m.rotulo) ? 1 : 0;

export function renderPdf(prod, conteudo, parte, explicadas = {}) {
  const c = TEMAS[prod.tema], cfg = prod[`parte${parte}`];
  const todas = conteudo.materias.flatMap(m => m.blocos.flatMap(b => b.dicas));
  const porN = Object.fromEntries(todas.map(d => [d.n, d]));
  const caixa = `<span style="display:block;width:15px;height:15px;border:1.6px solid ${c.tinta};border-radius:4px;margin:7px auto 0"></span>`;

  // ---------- peças ----------
  const etiquetaPts = p => p ? `<span style="${M};font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;background:${p === 2 ? c.cor : 'transparent'};color:${p === 2 ? '#fff' : c.claro};border:1.3px solid ${p === 2 ? c.cor : c.claro};padding:3px 8px;border-radius:5px;white-space:nowrap">${p === 2 ? 'vale 2 pontos' : 'vale 1 ponto'}</span>` : '';
  const faixaMateria = m => {
    const d = m.blocos.flatMap(b => b.dicas), p = pontos(m);
    const px = m.nome.length > 34 ? 25 : m.nome.length > 24 ? 30 : 36;
    return `<div data-quebra data-cola data-mat="${esc(m.nome)}" data-marco="${esc(m.nome)}" style="position:relative;background:${c.escuro};border-radius:14px;overflow:hidden;padding:15px 20px 16px;display:flex;align-items:flex-end;justify-content:space-between;gap:14px">
      <div style="position:absolute;inset:0;background-image:${azulejo(c.claro, .13, 46)}"></div>
      <div style="position:absolute;left:0;top:0;bottom:0;width:7px;background:${c.cor}"></div>
      <div style="position:relative;min-width:0"><div style="display:flex;align-items:center;gap:10px"><span style="${M};font-size:10.5px;letter-spacing:.22em;color:${c.claro};text-transform:lowercase">${d.length} dicas · ${p === 2 ? 'específicos de auditor' : p === 1 ? 'conhecimentos gerais' : 'objetiva e discursiva'}</span>${etiquetaPts(p)}</div>
        <div style="${T};font-size:${px}px;line-height:1;color:#fff;margin-top:7px">${esc(m.nome)}</div></div>
      <div style="position:relative;${T};font-size:42px;line-height:.9;color:transparent;-webkit-text-stroke:1.6px ${c.claro};white-space:nowrap">${n3(d[0].n)}–${n3(d.at(-1).n)}</div></div>`;
  };
  const tituloBloco = b => `<div data-cola style="display:flex;align-items:flex-end;justify-content:space-between;gap:20px;border-bottom:2.5px solid ${c.cor};padding:4px 0 7px">
      <div style="${T};font-size:21px;line-height:1.02;color:${c.tinta};max-width:60%">${esc(b.nome)}</div>
      <div style="${I};font-size:10.5px;line-height:1.35;color:${c.cinza};text-align:right;max-width:44%">${esc(b.base)}</div></div>`;
  const dica = (d, mat) => {
    const x = explicadas[n3(d.n)];
    const corpo = parte === 1
      ? `<div style="${I};font-weight:700;font-size:13.6px;line-height:1.36;color:${c.tinta}">${esc(d.r)}</div><div style="${I};font-size:12.4px;line-height:1.45;color:#4A3B3F;margin-top:4px">${esc(d.e)}</div>`
      : `<div style="${I};font-weight:700;font-size:13.6px;line-height:1.36;color:${c.tinta}">${esc(d.r)}</div>
         ${(x?.x || [d.e]).map(p => `<p style="${I};font-size:12.2px;line-height:1.55;color:#3B2C30;margin:6px 0 0;text-align:justify;hyphens:auto">${esc(p)}</p>`).join('')}
         ${x?.f ? `<div style="display:inline-flex;align-items:center;gap:6px;margin-top:8px;${M};font-size:10px;color:${c.corForte};background:${c.chip};border-radius:6px;padding:4px 9px">${visto(11, c.corForte, 3.4)}${esc(x.f)}</div>` : ''}`;
    return `<div data-mat="${esc(mat)}" lang="pt-BR" style="background:${c.cartao};border:1.3px solid ${c.linha};border-radius:13px;display:grid;grid-template-columns:54px 1fr;padding:${parte === 1 ? '10px 16px 11px 0' : '12px 18px 13px 0'}">
      <div style="text-align:center;border-right:1.3px solid ${c.linha};margin-right:14px"><div style="${T};font-size:25px;line-height:1;color:${c.corForte}">${n3(d.n)}</div>${caixa}</div><div>${corpo}</div></div>`;
  };
  const h1 = (t, kicker, marco) => `<div data-quebra data-cola ${marco ? `data-marco="${esc(marco)}"` : ''} data-mat="${esc(marco || t)}"><div style="${M};font-size:10.5px;letter-spacing:.24em;text-transform:uppercase;color:${c.corForte}">${esc(kicker)}</div><div style="${T};font-size:46px;line-height:.95;color:${c.tinta};margin-top:4px">${esc(t)}</div></div>`;
  const par = (t, extra = '') => `<p style="${I};font-size:12.6px;line-height:1.58;color:#3B2C30;margin:0;${extra}">${esc(t)}</p>`;
  const h3 = (t, cola = true) => `<div ${cola ? 'data-cola' : ''} style="${T};font-size:19px;line-height:1.05;color:${c.tinta};display:flex;align-items:center;gap:9px;margin-top:4px"><span style="width:6px;height:17px;background:${c.cor};border-radius:2px"></span>${esc(t)}</div>`;
  const ficha = (t, ps) => `<div style="background:${c.cartao};border:1.3px solid ${c.linha};border-radius:13px;padding:13px 17px"><div style="${I};font-weight:800;font-size:13.4px;color:${c.tinta};margin-bottom:5px">${esc(t)}</div>${ps.map(p => par(p, 'margin-top:4px')).join('')}</div>`;
  const marcar = t => `<div style="display:grid;grid-template-columns:16px 1fr;gap:9px;align-items:start;${I};font-size:12.4px;line-height:1.45;color:${c.tinta};font-weight:600"><span style="width:14px;height:14px;border:1.6px solid ${c.tinta};border-radius:4px;margin-top:2px"></span>${esc(t.replace(/^□\s*/, ''))}</div>`;

  // ---------- capa ----------
  const amostra = (prod.amostra || []).map(n => porN[n]).filter(Boolean);
  const capa = `<section class="pagina" style="background:${c.escuro}">
    <div style="position:absolute;inset:0;background-image:${azulejo(c.claro, .2, 88)}"></div>
    <div style="position:absolute;inset:0;background:radial-gradient(90% 55% at 0% 100%,${c.escuro3} 0%,transparent 70%),radial-gradient(70% 45% at 100% 0%,rgba(240,85,58,.28) 0%,transparent 70%)"></div>
    <div style="position:absolute;left:0;top:0;bottom:0;width:12px;background:${c.cor}"></div>
    <div style="position:absolute;right:-18px;top:118px;${T};font-size:430px;line-height:.8;color:transparent;-webkit-text-stroke:2.4px rgba(255,211,196,.3)">${prod.total}</div>
    <div style="position:absolute;left:60px;top:52px">${marca(40, '#fff', c.claro, 'gc')}</div>
    <div style="position:absolute;right:56px;top:58px;${M};font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:${c.escuro};background:${c.claro};padding:6px 11px;border-radius:5px">Parte ${parte} de 2</div>
    <div style="position:absolute;left:120px;right:150px;top:190px;display:grid;gap:13px">${amostra.map((d, i) => `<div style="background:#fff;border-radius:12px;display:grid;grid-template-columns:62px 1fr;padding:11px 16px 11px 0;box-shadow:0 22px 40px -18px rgba(0,0,0,.6);transform:translateX(${[0, -52, 70][i] || 0}px) rotate(${[-1.2, .8, -.6][i] || 0}deg)">
        <div style="text-align:center;border-right:1.3px solid ${c.linha};margin-right:14px"><div style="${T};font-size:28px;line-height:1;color:${c.corForte}">${n3(d.n)}</div>${i === 0 ? `<span style="display:flex;justify-content:center;margin-top:4px">${visto(17, c.ok, 3.6)}</span>` : caixa}</div>
        <div style="${I};font-weight:700;font-size:13.4px;line-height:1.36;color:${c.tinta};align-self:center">${esc(d.r)}</div></div>`).join('')}</div>
    <div style="position:absolute;right:50px;top:486px">${carimbo({ px: 148, cor: c.cor, topo: 'PROVA OBJETIVA', base: prod.banca.toUpperCase(), centro: prod.prova, sub: 'DOMINGO', id: 'cp' })}</div>
    <div style="position:absolute;left:60px;right:60px;bottom:150px">
      <span style="${M};font-size:12px;letter-spacing:.12em;text-transform:uppercase;background:${c.cor};color:#fff;padding:7px 12px;border-radius:6px">${esc(prod.selo)}</span>
      <div style="${T};font-size:112px;line-height:.88;color:#fff;margin-top:18px">${esc(cfg.titulo[0])}<br><span style="color:${c.claro}">${esc(cfg.titulo[1])}</span></div>
      <p style="${I};font-size:15.5px;line-height:1.5;color:rgba(255,255,255,.84);margin:18px 0 0;max-width:520px">${esc(cfg.sub)}</p>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:20px">${cfg.chips.map(x => `<span style="${M};font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:${c.claro};border:1.3px solid rgba(255,211,196,.35);padding:6px 11px;border-radius:999px">${esc(x)}</span>`).join('')}</div></div>
    <div style="position:absolute;left:60px;right:60px;bottom:56px;display:flex;justify-content:space-between;align-items:flex-end">
      <div><div style="${M};font-size:9.5px;letter-spacing:.22em;text-transform:uppercase;color:${c.claro}">Criado por</div><div style="${I};font-weight:800;font-size:22px;color:#fff;margin-top:3px">Líbero Filho</div></div>
      <div style="${M};font-size:11px;letter-spacing:.16em;color:${c.claro}">${PERFIL}</div></div></section>`;

  // ---------- fila de blocos ----------
  const fila = [];
  const [como, distrib] = conteudo.intro;
  if (parte === 1) {
    fila.push(h1('Como usar', 'Antes de começar', 'Como usar'));
    fila.push(`<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">${prod.numeros.map(x => `<div style="background:${c.cartao};border:1.3px solid ${c.linha};border-radius:13px;padding:13px 14px"><div style="${T};font-size:44px;line-height:.9;color:${c.corForte}">${esc(x.n)}</div><div style="${I};font-size:11.2px;line-height:1.4;color:${c.tinta};margin-top:7px">${esc(x.rot)}</div></div>`).join('')}</div>`);
    como.p.forEach(p => fila.push(par(p)));
    fila.push(h1('Distribuição', 'Onde estão as 400 dicas', 'Distribuição das dicas'));
    fila.push(par(distrib.p[0]));
    const linhas = conteudo.tabela.slice(1), max = Math.max(...linhas.map(l => +l[1]));
    fila.push(`<div style="background:${c.cartao};border:1.3px solid ${c.linha};border-radius:13px;padding:8px 18px">${linhas.map((l, i) => `<div style="display:grid;grid-template-columns:238px 1fr 34px 82px 74px;gap:12px;align-items:center;padding:7.5px 0;${i ? `border-top:1px solid ${c.linha}` : ''}">
        <div style="${I};font-weight:700;font-size:12.2px;color:${c.tinta}">${esc(l[0])}</div>
        <div style="height:9px;border-radius:5px;background:${c.chip}"><div style="height:100%;width:${l[1] / max * 100}%;border-radius:5px;background:${l[3] === 'Específicos' ? c.cor : l[3] === 'Gerais' ? c.escuro3 : c.cinza}"></div></div>
        <div style="${T};font-size:19px;color:${c.corForte};text-align:right">${esc(l[1])}</div>
        <div style="${M};font-size:9.5px;color:${c.cinza};text-align:right">${esc(l[2].replace(' a ', '–'))}</div>
        <div style="${M};font-size:8.5px;letter-spacing:.1em;text-transform:uppercase;color:${l[3] === 'Específicos' ? c.corForte : c.cinza};text-align:right">${esc(l[3])}</div></div>`).join('')}</div>`);
    fila.push(`<div style="display:flex;gap:18px;${M};font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;color:${c.cinza}"><span><i style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${c.cor};margin-right:6px"></i>Específicos · 2 pontos por questão</span><span><i style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${c.escuro3};margin-right:6px"></i>Gerais · 1 ponto por questão</span></div>`);
  } else {
    fila.push(h1('Como ler', 'Parte 2 · Dicas explicadas', 'Como ler'));
    fila.push(par('Esta é a segunda parte da Revisão em Dicas do TCE MA. As 400 dicas estão na mesma ordem e com a mesma numeração da Parte 1. Aqui, cada uma vem com a explicação completa: o que a regra diz, a distinção ou a pegadinha que costuma aparecer na alternativa errada e o fundamento para conferir.'));
    fila.push(par('Use assim: leia a Parte 1 e marque a caixa das dicas que você não conseguir explicar sem olhar. Depois venha aqui só nas marcadas, pelo número. A etiqueta com o visto, no fim de cada dica, indica onde conferir a regra.'));
    fila.push(par('Nas dicas de legislação do TCE MA e de História e Geografia do Maranhão, a explicação fica no conceito. Prazos, quóruns e detalhes locais devem ser conferidos no texto das normas indicadas no edital.'));
    fila.push(`<div style="background:${c.escuro};border-radius:13px;padding:15px 18px;display:grid;grid-template-columns:repeat(4,1fr);gap:14px">${prod.numeros.map(x => `<div><div style="${T};font-size:36px;line-height:.9;color:${c.claro}">${esc(x.n)}</div><div style="${I};font-size:10.8px;line-height:1.4;color:rgba(255,255,255,.82);margin-top:6px">${esc(x.rot)}</div></div>`).join('')}</div>`);
  }
  for (const m of conteudo.materias) {
    fila.push(faixaMateria(m));
    for (const b of m.blocos) { fila.push(tituloBloco(b)); b.dicas.forEach(d => fila.push(dica(d, m.nome))); }
  }
  if (parte === 1) {
    // Painel de revisão
    fila.push(h1('Painel de revisão', 'Depois da 1ª leitura', 'Painel de revisão'));
    fila.push(par('Pinte o número das dicas em que você hesitou. Na véspera, revise só as pintadas: é a sua lista pessoal de pontos fracos.'));
    const faixas = conteudo.materias.map(m => { const d = m.blocos.flatMap(b => b.dicas); return [d[0].n, pontos(m)]; });
    const pts = n => faixas.filter(f => f[0] <= n).at(-1)[1];
    fila.push(`<div style="display:grid;grid-template-columns:repeat(20,1fr);gap:4px">${todas.map(d => `<span style="${M};font-size:8.6px;text-align:center;padding:6.5px 0;border-radius:5px;background:#fff;border:1.2px solid ${pts(d.n) === 2 ? '#F3B9A8' : c.linha};color:${pts(d.n) === 2 ? c.corForte : c.cinza}">${n3(d.n)}</span>`).join('')}</div>`);
    fila.push(`<div style="${M};font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;color:${c.cinza}">Em coral: dicas das matérias específicas (2 pontos por questão)</div>`);
    fila.push(`<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div style="background:#fff;border:1.3px solid ${c.linha};border-radius:13px;padding:14px 17px"><div style="${T};font-size:19px;color:${c.tinta};margin-bottom:8px">Minhas contas</div>${['Dicas marcadas na 1ª leitura', 'Dicas marcadas na 2ª leitura', 'Matéria com mais marcas'].map(t => `<div style="display:flex;align-items:flex-end;gap:8px;${I};font-weight:600;font-size:12px;color:${c.tinta};margin-top:9px">${t}<span style="flex:1;border-bottom:1.2px solid ${c.cinza}"></span></div>`).join('')}</div>
      <div style="background:${c.escuro};border-radius:13px;padding:14px 17px"><div style="${T};font-size:19px;color:#fff;margin-bottom:8px">Véspera da prova</div>${['Revisar só as dicas pintadas', 'Reler as matérias de 2 pontos', 'Separar documento e caneta preta'].map(t => `<div style="display:flex;align-items:center;gap:9px;${I};font-weight:600;font-size:12px;color:${c.claro};margin-top:8px"><span style="width:14px;height:14px;border:1.6px solid ${c.claro};border-radius:4px"></span>${t}</div>`).join('')}</div></div>`);
    // Bônus
    for (const s of conteudo.bonus) {
      const t = s.titulo;
      const kicker = /Treino|Gabarito/.test(t) ? 'Bônus · treino' : /Fontes/.test(t) ? 'Para conferir' : /Técnico/.test(t) ? 'Bônus · cargo 16' : 'Bônus · roteiro';
      fila.push(h1(t, kicker, t));
      if (/Fontes/.test(t)) {
        s.p.filter(p => !/https?:/.test(p)).forEach(p => fila.push(par(p)));
        const links = s.p.filter(p => /https?:/.test(p)).map(p => p.split(/(?=https?:)/));
        fila.push(`<div style="background:#fff;border:1.3px solid ${c.linha};border-radius:13px;padding:6px 16px">${links.map(([n, u], i) => `<div style="padding:6px 0;${i ? `border-top:1px solid ${c.linha}` : ''}"><div style="${I};font-weight:700;font-size:11.2px;color:${c.tinta}">${esc(n)}</div><div style="${M};font-weight:500;font-size:8px;color:${c.cinza};word-break:break-all">${esc(u)}</div></div>`).slice(0, 23).join('')}</div>`);
        if (links.length > 23) fila.push(`<div style="background:#fff;border:1.3px solid ${c.linha};border-radius:13px;padding:6px 16px">${links.slice(23).map(([n, u], i) => `<div style="padding:6px 0;${i ? `border-top:1px solid ${c.linha}` : ''}"><div style="${I};font-weight:700;font-size:11.2px;color:${c.tinta}">${esc(n)}</div><div style="${M};font-weight:500;font-size:8px;color:${c.cinza};word-break:break-all">${esc(u)}</div></div>`).join('')}</div>`);
        continue;
      }
      (s.p || []).forEach(p => fila.push(/^Gabarito:/.test(p)
        ? `<div style="background:${c.escuro};border-radius:13px;padding:13px 17px;display:grid;grid-template-columns:repeat(12,1fr);gap:6px">${[...p.matchAll(/(\d\d) ([A-E])/g)].map(g => `<div style="text-align:center"><div style="${M};font-size:9px;color:${c.claro}">${g[1]}</div><div style="${T};font-size:26px;color:#fff;line-height:1">${g[2]}</div></div>`).join('')}</div>`
        : par(p)));
      if (/múltipla escolha/.test(t)) {
        s.itens.forEach(q => { const [, num, tema] = q.titulo.match(/Questão (\d+) (.*)/); const alts = q.p.filter(x => /^[A-E]\)/.test(x)), en = q.p.filter(x => !/^[A-E]\)/.test(x));
          fila.push(`<div style="background:#fff;border:1.3px solid ${c.linha};border-radius:13px;display:grid;grid-template-columns:54px 1fr;padding:12px 17px 12px 0"><div style="text-align:center;border-right:1.3px solid ${c.linha};margin-right:14px"><div style="${M};font-size:8px;letter-spacing:.14em;color:${c.cinza}">QUESTÃO</div><div style="${T};font-size:27px;line-height:1;color:${c.corForte}">${num}</div></div><div><div style="${M};font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:${c.corForte}">${esc(tema)}</div>${en.map(e => `<div style="${I};font-weight:700;font-size:12.8px;line-height:1.4;color:${c.tinta};margin-top:3px">${esc(e)}</div>`).join('')}<div style="display:grid;gap:3px;margin-top:7px">${alts.map(a => `<div style="display:grid;grid-template-columns:20px 1fr;gap:8px;${I};font-size:12.2px;line-height:1.4;color:#3B2C30"><span style="${M};font-size:10px;width:18px;height:18px;border:1.3px solid ${c.cinza};border-radius:50%;display:flex;align-items:center;justify-content:center;color:${c.tinta}">${a[0]}</span>${esc(a.slice(2).trim())}</div>`).join('')}</div></div></div>`); });
      } else if (/Gabarito/.test(t)) {
        s.itens.forEach(q => { const [, num, letra] = q.titulo.match(/Questão (\d+) alternativa ([A-E])/);
          fila.push(`<div style="background:#fff;border:1.3px solid ${c.linha};border-radius:13px;display:grid;grid-template-columns:54px 1fr;padding:11px 17px 11px 0"><div style="text-align:center;border-right:1.3px solid ${c.linha};margin-right:14px"><div style="${M};font-size:9px;color:${c.cinza}">${num}</div><div style="${T};font-size:27px;line-height:1;color:${c.ok}">${letra}</div></div><div>${q.p.map(p => par(p)).join('')}</div></div>`); });
      } else if (/discursivos/.test(t)) {
        s.itens.forEach(it => {
          if (/^Confira/.test(it.titulo)) { fila.push(`<div style="background:${c.creme};border:1.3px dashed ${c.cor};border-radius:13px;padding:12px 16px;display:grid;gap:6px"><div style="${M};font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:${c.corForte}">Confira na sua resposta</div>${it.p.map(p => /^□/.test(p) ? marcar(p) : par(p, `font-size:11px;color:${c.cinza};margin-top:3px`)).join('')}</div>`); return; }
          if (/^Resposta/.test(it.titulo)) { fila.push(`<div data-cola style="${M};font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:${c.ok};display:flex;align-items:center;gap:6px">${visto(12, c.ok, 3.4)}Resposta de referência</div>`); it.p.forEach(p => fila.push(par(p, 'text-align:justify'))); return; }
          fila.push(`<div style="background:${c.escuro};border-radius:13px;padding:14px 18px;margin-top:8px"><div style="${T};font-size:21px;line-height:1.05;color:#fff">${esc(it.titulo)}</div>${it.p.map(p => `<p style="${I};font-size:12.4px;line-height:1.55;color:rgba(255,255,255,.86);margin:7px 0 0">${esc(p).replace(/^Comando:/, `<b style="color:${c.claro}">Comando:</b>`)}</p>`).join('')}</div>`);
        });
      } else s.itens.forEach(it => fila.push(ficha(it.titulo, it.p)));
    }
  } else {
    fila.push(h1('Feche a revisão', 'Depois das 400', 'Feche a revisão'));
    fila.push(par('Volte ao Painel de Revisão, no fim da Parte 1, e pinte os números das dicas em que você ainda hesitou depois de ler a explicação. Essas são as que merecem uma última passada na véspera, começando pelas matérias específicas, que valem 2 pontos por questão.'));
    fila.push(par('As explicações são autorais e sintéticas. Quando houver ressalva, requisito adicional ou controvérsia, consulte a norma completa indicada na etiqueta de cada dica e nas fontes listadas no fim da Parte 1. Material próprio de Líbero Filho, sem vínculo com o TCE MA ou com o Cebraspe.'));
  }

  const css = `@page{size:210mm 297mm;margin:0}*{box-sizing:border-box}body{margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}p{margin:0}
.pagina{position:relative;width:${W}px;height:${H}px;overflow:hidden;break-after:page}.pagina:last-child{break-after:auto}
.corpo{position:absolute;left:${MG}px;right:${MG}px;top:78px;bottom:62px;overflow:hidden;display:flex;flex-direction:column;gap:9px}
#fila{position:absolute;left:-9999px;width:${W - 2 * MG}px}`;
  const molde = `<section class="pagina" style="background:${c.papel}">
    <div style="position:absolute;left:${MG}px;right:${MG}px;top:26px;display:flex;align-items:center;justify-content:space-between;padding-bottom:12px;border-bottom:1.3px solid ${c.linha}">
      <div style="display:flex;align-items:center;gap:10px">${simbolo(26, 'gp')}<div><div style="${M};font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:${c.corForte}">${esc(cfg.cabecalho)}</div><div style="${I};font-weight:700;font-size:10.5px;color:${c.cinza};margin-top:1px">por Líbero Filho</div></div></div>
      <div class="mat" style="${T};font-size:14px;color:${c.tinta};text-align:right"></div></div>
    <div class="corpo"></div>
    <div style="position:absolute;left:${MG}px;right:${MG}px;bottom:26px;display:flex;align-items:center;gap:14px;${M};font-size:9px;letter-spacing:.2em;color:${c.cinza}"><span>${PERFIL.toUpperCase()}</span><span style="flex:1;height:4px;border-radius:2px;background:${c.linha};overflow:hidden"><i class="prog" style="display:block;height:100%;background:${c.cor};border-radius:2px"></i></span><span class="num" style="color:${c.tinta}"></span></div></section>`;
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${esc(cfg.cabecalho)}</title><link href="${FONTES}" rel="stylesheet"><style>${css}</style></head><body>
${capa}<div id="fila">${fila.join('\n')}</div><template id="molde">${molde}</template>
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
    if (el.dataset.marco) marcos.push([el.dataset.marco, document.querySelectorAll('.pagina').length]);
  }
  document.getElementById('fila').remove();
  const pags = [...document.querySelectorAll('.pagina')], n = pags.length;
  pags.forEach((s, i) => { if (!i) return; s.querySelector('.mat').textContent = s.dataset.mat || ''; s.querySelector('.num').textContent = String(i + 1).padStart(2, '0') + '/' + String(n).padStart(2, '0'); s.querySelector('.prog').style.width = ((i + 1) / n * 100) + '%'; });
  window.__avisos = avisos; window.__marcos = marcos; window.__pronto = true;
});
</script></body></html>`;
  return { html };
}

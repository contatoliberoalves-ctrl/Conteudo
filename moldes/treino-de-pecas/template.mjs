// Modelo visual do "Treino de Peças" (@constitucionalgabaritado), 1080×1350 por slide.
// Carrossel: capa (3 estilos) + enunciado em letra grande, paginado sozinho no navegador (quantos slides
// precisar) + "Antes de responder" (diagnóstico do caso) + CTA. tipo "treino" (prova da OAB: verde) ou
// "autoral" (caso do autor: preto). O render chama window.__paginar() e fotografa cada #slide-N.
import { createRequire } from 'node:module';
// Hifenização em português (hífens invisíveis ­): o Chromium não hifeniza pt-BR sozinho em todo sistema.
const { hyphenateSync } = createRequire(import.meta.url)('hyphen/pt');
const hifen = s => hyphenateSync(String(s), { minWordLength: 6 });
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
// **negrito** e *itálico* (nomes fictícios: *Alfa*, *XX*), depois de escapar.
const rico = s => esc(hifen(s)).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>');
const semHifen = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>');

const COR = { verde: '#33443D', verdeEsc: '#26332D', lima: '#8DBA4C', off: '#F6F6F2', cartao: '#FBFBF8', preto: '#1B1C1B', preto2: '#262826', corpo: '#1F2623', cinza: '#6B746F' };
const F = {
  serif: "font-family:'Young Serif',Georgia,serif;font-weight:400",
  slab: "font-family:'Alfa Slab One',Georgia,serif;font-weight:400",
  anton: "font-family:Anton,Impact,sans-serif;font-weight:400",
};
const handle = (px, cor) => `<span style="font-size:${px}px;color:${cor};font-weight:400;letter-spacing:.02em"><b style="font-weight:700">@CONSTITUCIONAL</b>GABARITADO</span>`;
const pilula = (txt, bg, cor) => `<span style="${F.slab};font-size:22px;letter-spacing:4px;background:${bg};color:${cor};padding:10px 18px 12px;border-radius:8px;white-space:nowrap">${esc(txt)}</span>`;
const pontos = cor => `<div style="position:absolute;inset:0;background-image:radial-gradient(${cor} 2px,transparent 2.6px);background-size:28px 28px"></div>`;
const tema = autoral => autoral
  ? { bg: COR.preto, ponto: COR.preto2, tinta: COR.off, tag: 'CASO AUTORAL', selo: 'AUTORAL' }
  : { bg: COR.verde, ponto: '#3B4D46', tinta: COR.off, tag: 'TREINO DE PEÇAS', selo: 'VALENDO 5,00' };

// ---------- Capas ----------
// "folha": QUAL É A PEÇA? gigante e uma folha de prova inclinada com a frase-gancho e o carimbo.
function capaFolha(c, autoral) {
  const T = tema(autoral);
  return { bg: T.bg, html: `${pontos(T.ponto)}
    <div style="position:absolute;left:90px;right:90px;top:80px;display:flex;justify-content:space-between;align-items:center">${handle(24, T.tinta)}${pilula(T.tag, COR.lima, autoral ? COR.preto : COR.verde)}</div>
    <div style="position:absolute;left:0;right:0;top:200px;text-align:center;${F.anton};line-height:.9">
      <div style="font-size:250px;color:${COR.lima}">QUAL É</div><div style="font-size:250px;color:${T.tinta}">A PEÇA?</div></div>
    <div data-cabe style="position:absolute;left:130px;right:130px;top:690px;height:470px;background:${COR.cartao};border-radius:22px;transform:rotate(-2.5deg);box-shadow:0 30px 70px rgba(0,0,0,.45);padding:50px 56px;display:flex;flex-direction:column;gap:18px;overflow:hidden">
      <div style="display:flex;flex-direction:column;gap:14px"><span style="height:3px;background:${COR.corpo}"></span><span style="height:2px;width:70%;background:${COR.corpo};opacity:.15"></span></div>
      <div style="${F.serif};font-size:${c.ts || 58}px;line-height:1.16;color:${COR.corpo};margin-top:10px">${semHifen(c.chamada || '')}</div>
      <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center;font-size:22px;font-weight:500;letter-spacing:3px;color:${COR.cinza}"><span>ENUNCIADO + DESAFIO</span><span>ARRASTE →</span></div>
    </div>
    <div style="position:absolute;right:90px;top:640px;transform:rotate(9deg);border:6px solid ${COR.lima};outline:2px solid ${COR.lima};outline-offset:5px;color:${COR.lima};background:${T.bg};${F.slab};font-size:34px;letter-spacing:3px;padding:10px 20px 12px">${T.selo}</div>
    <div style="position:absolute;left:0;right:0;bottom:70px;text-align:center;font-size:24px;font-weight:500;letter-spacing:5px;color:${T.tinta};opacity:.8">DIREITO CONSTITUCIONAL</div>` };
}

// "manchete": fundo claro, a frase-gancho como manchete em serifa e a faixa QUAL É A PEÇA?
function capaManchete(c, autoral) {
  const T = tema(autoral), escuro = autoral ? COR.preto : COR.verde;
  const siglas = ['MS', 'HD', 'MI', 'AP', 'ACP', 'ADI', 'ADC', 'ADO', 'ADPF', 'RE', 'ROC', 'RCL'];
  return { bg: COR.off, html: `${pontos('#E8E8E1')}
    <div style="position:absolute;left:90px;right:90px;top:80px;display:flex;justify-content:space-between;align-items:center;padding-bottom:26px;border-bottom:3px solid ${escuro}">${handle(24, escuro)}${pilula(T.tag, COR.lima, escuro)}</div>
    <div data-cabe style="position:absolute;left:90px;right:90px;top:210px;height:560px;display:flex;flex-direction:column;justify-content:center;overflow:hidden">
      <div style="${F.serif};font-size:${c.ts || 92}px;line-height:1.06;letter-spacing:-1px;color:${escuro}">${semHifen(c.chamada || '')}</div></div>
    <div style="position:absolute;left:0;right:0;top:820px;height:230px;background:${escuro};display:flex;align-items:center;justify-content:center;${F.anton};font-size:170px;line-height:1;color:${COR.off}">QUAL É A <span style="color:${COR.lima};margin-left:30px">PEÇA?</span></div>
    <div style="position:absolute;left:90px;right:90px;top:1100px;display:flex;flex-wrap:wrap;gap:12px;justify-content:center">${siglas.map(s => `<span style="font-size:24px;font-weight:700;letter-spacing:2px;color:${escuro};border:2px solid ${escuro};border-radius:999px;padding:6px 16px;opacity:.55">${s}</span>`).join('')}</div>
    <div style="position:absolute;left:90px;right:90px;bottom:60px;display:flex;justify-content:space-between;font-size:22px;font-weight:500;letter-spacing:3px;color:${escuro}"><span>VOCÊ ACERTARIA?</span><span>ARRASTE →</span></div>` };
}

// "pista": fundo lima, interrogação vazada gigante e a frase-gancho entre aspas.
function capaPista(c, autoral) {
  const escuro = autoral ? COR.preto : COR.verde, T = tema(autoral);
  return { bg: COR.lima, html: `
    <div style="position:absolute;right:-90px;top:-40px;${F.anton};font-size:1500px;line-height:.8;color:transparent;-webkit-text-stroke:5px rgba(27,28,27,.18)">?</div>
    <div style="position:absolute;left:90px;right:90px;top:80px;display:flex;justify-content:space-between;align-items:center">${handle(24, escuro)}${pilula(T.tag, escuro, COR.lima)}</div>
    <div style="position:absolute;left:90px;top:220px;${F.serif};font-size:220px;line-height:.7;color:${escuro}">“</div>
    <div data-cabe style="position:absolute;left:90px;right:120px;top:360px;height:520px;display:flex;flex-direction:column;justify-content:flex-start;overflow:hidden">
      <div style="${F.serif};font-size:${c.ts || 84}px;line-height:1.1;color:${escuro}">${semHifen(c.chamada || '')}</div></div>
    <div style="position:absolute;left:90px;top:960px;background:${escuro};color:${COR.off};${F.anton};font-size:120px;line-height:1;padding:22px 40px 18px;border-radius:18px">QUAL É A PEÇA?</div>
    <div style="position:absolute;left:90px;right:90px;bottom:70px;display:flex;justify-content:space-between;font-size:22px;font-weight:600;letter-spacing:3px;color:${escuro}"><span>ENUNCIADO + DESAFIO</span><span>ARRASTE →</span></div>` };
}
const CAPAS = { folha: capaFolha, manchete: capaManchete, pista: capaPista, A: capaManchete, B: capaFolha };

// ---------- Enunciado (modelo de slide; o navegador cria quantos precisar) ----------
function moldeEnunciado(autoral) {
  const T = tema(autoral);
  return `<div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:70px 64px 60px">
    <div style="display:flex;justify-content:space-between;align-items:center;padding:0 10px">${handle(22, T.tinta)}<span data-num style="font-size:22px;font-weight:600;letter-spacing:3px;color:${COR.lima}"></span></div>
    <div style="margin-top:30px;flex:1;min-height:0;background:${COR.cartao};border-radius:26px;padding:44px 50px 40px;display:flex;flex-direction:column;gap:26px">
      <div style="display:flex;align-items:center;gap:18px">${pilula(autoral ? 'CASO' : 'ENUNCIADO', COR.lima, COR.cartao)}<span style="flex:1;height:2px;background:${COR.corpo};opacity:.14"></span><span data-parte style="font-size:20px;font-weight:600;letter-spacing:3px;color:${COR.cinza}"></span></div>
      <div data-texto lang="pt-BR" style="flex:1;min-height:0;overflow:hidden;font-size:var(--px);line-height:1.5;color:${COR.corpo};text-align:justify;hyphens:auto;display:flex;flex-direction:column;gap:20px"></div>
    </div>
    <div data-pe style="flex:none;height:150px;padding-top:20px;display:flex;align-items:center;justify-content:center;${F.anton};line-height:1;color:${COR.lima}"></div>
  </div>`;
}

// ---------- Antes de responder ----------
function antes(c, autoral) {
  const escuro = autoral ? COR.preto : COR.verde;
  const qs = lista(c.perguntas).length ? lista(c.perguntas) : ['Quem pede, e quem praticou o ato?', 'O ato é lei, decisão, omissão ou ato administrativo?', 'Qual direito ou regra da Constituição foi atingido?', 'A prova já está pronta ou precisa ser produzida?', 'O que se quer: anular, mandar fazer, declarar ou reformar?'];
  return { bg: COR.off, html: `${pontos('#E8E8E1')}
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:90px 96px 90px;color:${escuro}">
      <div style="display:flex;justify-content:space-between;align-items:center">${handle(24, escuro)}${pilula('ANTES DE RESPONDER', COR.lima, escuro)}</div>
      <div style="margin-top:80px;${F.serif};font-size:96px;line-height:1;letter-spacing:-2px">Marque no<br>enunciado:</div>
      <div style="margin-top:60px;display:flex;flex-direction:column;gap:28px">${qs.map(q => `<div style="display:flex;gap:26px;align-items:flex-start"><span style="flex:none;width:46px;height:46px;border:5px solid ${escuro};border-radius:10px;margin-top:4px"></span><span style="font-size:38px;font-weight:500;line-height:1.3">${semHifen(q)}</span></div>`).join('')}</div>
      <div style="margin-top:auto;font-size:30px;font-weight:600;color:${escuro}">A peça nasce do requisito, <span style="background:${COR.lima};padding:2px 10px">não do nome.</span></div>
    </div>` };
}

// ---------- CTA ----------
function cta(c, autoral) {
  const T = tema(autoral);
  return { bg: T.bg, html: `${pontos(T.ponto)}
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:90px;color:${T.tinta}">
      ${pilula('E AÍ?', COR.lima, autoral ? COR.preto : COR.verde)}
      <div style="margin-top:40px;${F.anton};font-size:190px;line-height:.92">COMENTA<br><span style="color:${COR.lima}">A PEÇA</span></div>
      <div style="margin-top:80px;font-size:40px;font-weight:500;line-height:1.35;max-width:780px">${semHifen(c.ctaTexto || 'O gabarito sai nos stories. Salva pra treinar de novo antes da prova.')}</div>
      <div style="margin-top:60px;display:flex;gap:18px">${['Salvar', 'Compartilhar'].map(b => `<span style="border:3px solid ${T.tinta};border-radius:999px;padding:14px 34px;font-size:30px;font-weight:600">${b}</span>`).join('')}</div>
    </div>
    <div style="position:absolute;left:0;right:0;bottom:70px;text-align:center">${handle(26, T.tinta)}</div>` };
}

export function renderCarrossel(c, idx = 0) {
  const autoral = c.tipo === 'autoral';
  const estilos = ['folha', 'manchete', 'pista'];
  const capa = (CAPAS[c.capa] || CAPAS[estilos[idx % 3]])(c, autoral);
  const fim = [c.antes === false ? null : antes(c, autoral), cta(c, autoral)].filter(Boolean);
  const T = tema(autoral);
  // Parágrafos do enunciado (e o comando, em negrito) quebrados em frases, para a paginação.
  const paras = lista(c.enunciado).map(p => rico(p).split(/(?<=[.;:?!])\s+(?=[A-ZÀ-Ú“(])/));
  const comando = c.comando ? `<b>${rico(c.comando)}</b>${c.valor ? ' ' + esc(c.valor) : ''}` : '';
  const slideHtml = (s, i) => `<section class="slide" style="position:absolute;left:${i * 1080}px;top:0;width:1080px;height:1350px;overflow:hidden;background:${s.bg}">${s.html}</section>`;
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Young+Serif&family=Alfa+Slab+One&family=Anton&family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box}body{margin:0;font-family:Poppins,sans-serif}p{margin:0}</style></head><body>
<div id="painel" style="position:relative;height:1350px">${slideHtml(capa, 0)}</div>
<template id="molde">${moldeEnunciado(autoral)}</template>
<template id="fim">${fim.map((s, i) => slideHtml(s, i)).join('')}</template>
<script>
const PARAS = ${JSON.stringify(paras)}, COMANDO = ${JSON.stringify(comando)}, BG = ${JSON.stringify(T.bg)};
window.__paginar = (px) => {
  const painel = document.getElementById('painel');
  painel.querySelectorAll('.slide:not(:first-child)').forEach(s => s.remove());
  const enun = [];
  const novo = () => {
    const s = document.createElement('section'); s.className = 'slide';
    s.style.cssText = 'position:absolute;top:0;width:1080px;height:1350px;overflow:hidden;background:' + BG + ';--px:' + px + 'px';
    s.innerHTML = document.getElementById('molde').innerHTML; painel.appendChild(s); enun.push(s); return s.querySelector('[data-texto]');
  };
  const cabe = t => t.scrollHeight <= t.clientHeight + 1;
  let t = novo();
  PARAS.forEach(frases => {
    let p = document.createElement('p'); t.appendChild(p);
    frases.forEach(f => {
      const antes = p.innerHTML; p.innerHTML = antes + (antes ? ' ' : '') + f;
      if (!cabe(t)) { p.innerHTML = antes; if (!antes) p.remove(); t = novo(); p = document.createElement('p'); p.innerHTML = f; t.appendChild(p); }
    });
  });
  if (COMANDO) { const p = document.createElement('p'); p.innerHTML = COMANDO; t.appendChild(p); if (!cabe(t)) { p.remove(); t = novo(); t.appendChild(p); } }
  enun.forEach((s, i) => {
    s.querySelector('[data-parte]').textContent = enun.length > 1 ? (i + 1) + '/' + enun.length : '';
    const pe = s.querySelector('[data-pe]'), ult = i === enun.length - 1;
    pe.style.fontSize = ult ? '110px' : '60px'; pe.textContent = ult ? 'QUAL É A PEÇA?' : 'CONTINUA →';
  });
  const fim = document.getElementById('fim').content.cloneNode(true);
  [...fim.children].forEach(s => painel.appendChild(s));
  const todos = [...painel.querySelectorAll('.slide')];
  todos.forEach((s, i) => { s.id = 'slide-' + (i + 1); s.style.left = (i * 1080) + 'px'; const n = s.querySelector('[data-num]'); if (n) n.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(todos.length).padStart(2, '0'); });
  painel.style.width = (todos.length * 1080) + 'px';
  const avisos = [];
  enun.forEach((s, i) => { const tx = s.querySelector('[data-texto]'); if (!cabe(tx)) avisos.push('enunciado ' + (i + 1) + ': uma frase não cabe no slide'); });
  const c1 = document.querySelector('#slide-1 [data-cabe]'); if (c1 && c1.scrollHeight > c1.clientHeight + 2) avisos.push('capa: a chamada não cabe (encurte ou use "ts")');
  return { total: todos.length, enunciados: enun.length, avisos };
};
</script></body></html>`;
  return { html };
}

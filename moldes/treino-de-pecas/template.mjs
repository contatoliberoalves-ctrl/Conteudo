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

import { CG, DEGRADE, FONTES_CG, TIT_CG, TXT_CG, ARROBA } from '../cg-comum/identidade.mjs';

// Identidade única do @constitucionalgabaritado (cg-comum/identidade.mjs): escuro, verde, claro, branco e o degradê.
const COR = { escuro: CG.escuro, escuro2: CG.escuro2, verde: CG.verde, claro: CG.claro, papel: CG.papel, branco: CG.branco, corpo: CG.tinta, cinza: CG.cinza, nevoa: CG.nevoa, menta: CG.menta };
const handle = (px, cor) => `<span style="${TXT_CG};font-size:${px}px;color:${cor};font-weight:400;letter-spacing:.06em">${ARROBA}</span>`;
// Rótulo reto (sem pílula): barra curta + texto espaçado.
const rotulo = (txt, cor, barra = cor) => `<span style="display:inline-flex;align-items:center;gap:14px;${TXT_CG};font-size:22px;font-weight:700;letter-spacing:.2em;color:${cor};white-space:nowrap"><i style="display:block;width:40px;height:4px;background:${barra}"></i>${esc(txt)}</span>`;
const grade = cor => `<div style="position:absolute;inset:0;background-image:linear-gradient(${cor} 1px,transparent 1px),linear-gradient(90deg,${cor} 1px,transparent 1px);background-size:90px 90px"></div>`;
const tema = autoral => autoral
  ? { bg: COR.escuro, tinta: COR.branco, tag: 'CASO AUTORAL', selo: 'AUTORAL' }
  : { bg: DEGRADE, tinta: COR.branco, tag: 'TREINO DE PEÇAS', selo: 'PROVA DA OAB' };
const SIGLAS = ['MS', 'MS COLETIVO', 'HD', 'HC', 'MI', 'AÇÃO POPULAR', 'ACP', 'ADI', 'ADC', 'ADO', 'ADPF', 'RE', 'ROC', 'RECLAMAÇÃO', 'APELAÇÃO'];
const cabecalho = (T, cor = T.tinta) => `<div style="position:absolute;left:90px;right:90px;top:84px;display:flex;justify-content:space-between;align-items:center;padding-bottom:26px;border-bottom:2px solid ${cor === COR.branco ? 'rgba(255,255,255,.25)' : 'rgba(11,38,25,.18)'}">${handle(24, cor)}${rotulo(T.tag, cor === COR.branco ? COR.claro : COR.verde)}</div>`;
const pe = (cor, esq = 'LEIA O CASO ATÉ O FIM') => `<div style="position:absolute;left:90px;right:90px;bottom:76px;display:flex;justify-content:space-between;${TXT_CG};font-size:22px;font-weight:600;letter-spacing:.16em;color:${cor}"><span>${esq}</span><span>ARRASTE →</span></div>`;
// Primeiras linhas do enunciado (sem o comando, sem dizer a peça): só para despertar a leitura.
const comeco = c => semHifen(lista(c.enunciado)[0] || '').slice(0, 260);

// ---------- Capas (nenhuma diz a peça nem resume o caso) ----------
// "folha": QUAL É A PEÇA? grande e a folha de prova com o começo do enunciado, sumindo.
function capaFolha(c, autoral) {
  const T = tema(autoral);
  return { bg: T.bg, html: `${grade('rgba(111,211,155,.06)')}${cabecalho(T)}
    <div style="position:absolute;left:90px;right:90px;top:200px;${TIT_CG};font-size:236px;line-height:.9;color:${T.tinta}">QUAL É<br><span style="color:${COR.claro}">A PEÇA?</span></div>
    <div style="position:absolute;left:150px;right:90px;top:720px;height:450px;background:${COR.branco};transform:rotate(-2deg);box-shadow:0 30px 70px rgba(0,0,0,.4);padding:46px 52px;overflow:hidden">
      <div style="display:flex;justify-content:space-between;align-items:center;${TXT_CG};font-size:20px;font-weight:700;letter-spacing:.18em;color:${COR.verde}"><span>${autoral ? 'CASO' : 'ENUNCIADO'}</span><span style="color:${COR.cinza}">VALE 5,00</span></div>
      <span style="display:block;height:3px;background:${COR.escuro};margin:18px 0 24px"></span>
      <div style="${TXT_CG};font-size:34px;line-height:1.5;color:${COR.corpo};text-align:left">${comeco(c)}…</div>
      <div style="position:absolute;left:0;right:0;bottom:0;height:260px;background:linear-gradient(180deg,rgba(255,255,255,0),#fff 80%)"></div>
    </div>${pe(T.tinta)}` };
}

// "siglas": fundo escuro, a pergunta e as siglas das peças possíveis, com um quadro vazio "?".
function capaSiglas(c, autoral) {
  const T = { ...tema(autoral), bg: COR.escuro };
  const sig = SIGLAS.slice(0, 11);
  return { bg: T.bg, html: `${grade('rgba(111,211,155,.05)')}${cabecalho(T)}
    <div style="position:absolute;left:90px;right:90px;top:210px;${TIT_CG};font-size:200px;line-height:.92;color:${COR.branco}">QUAL É<br>A <span style="color:${COR.claro}">PEÇA?</span></div>
    <div style="position:absolute;left:90px;right:90px;top:668px;${TXT_CG};font-size:34px;line-height:1.4;color:${COR.nevoa}">Leia o ${autoral ? 'caso' : 'enunciado'} e escolha uma.<br>Só uma é a certa.</div>
    <div style="position:absolute;left:90px;right:90px;top:830px;display:grid;grid-template-columns:repeat(4,1fr);gap:14px">
      ${sig.map(s => `<span style="display:flex;align-items:center;justify-content:center;height:96px;border:2px solid rgba(111,211,155,.45);${TIT_CG};font-size:${s.length > 6 ? 30 : 44}px;color:${COR.branco}">${s}</span>`).join('')}
      <span style="display:flex;align-items:center;justify-content:center;height:96px;background:${COR.claro};${TIT_CG};font-size:64px;color:${COR.escuro}">?</span>
    </div>${pe(COR.nevoa)}` };
}

// "branco": fundo claro, interrogação vazada gigante em verde e a pergunta em faixa escura reta.
function capaBranco(c, autoral) {
  const T = { ...tema(autoral), tinta: COR.escuro };
  return { bg: COR.papel, html: `${grade('rgba(11,38,25,.05)')}
    ${cabecalho(T, COR.escuro)}
    <div style="position:absolute;left:90px;top:250px;${TIT_CG};font-size:120px;line-height:1;color:${COR.verde}">VOCÊ ACERTA<br>ESSA?</div>
    <div style="position:absolute;left:0;right:0;top:600px;height:300px;background:${DEGRADE};display:flex;align-items:center;padding-left:90px;${TIT_CG};font-size:170px;line-height:1;white-space:nowrap;color:${COR.branco}">QUAL É A&nbsp;<span style="color:${COR.claro}">PEÇA?</span></div>
    <div style="position:absolute;left:90px;right:90px;top:960px;${TXT_CG};font-size:34px;line-height:1.45;color:${COR.corpo}">${autoral ? 'Um caso autoral' : 'Um enunciado de prova da OAB'}, inteiro, nos próximos slides. A resposta fica com você.</div>
    ${pe(COR.cinza)}` };
}
const CAPAS = { folha: capaFolha, siglas: capaSiglas, branco: capaBranco, manchete: capaBranco, pista: capaSiglas, A: capaBranco, B: capaFolha };

// ---------- Enunciado (modelo de slide; o navegador cria quantos precisar) ----------
function moldeEnunciado(autoral) {
  const T = tema(autoral);
  return `<div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:64px 56px 40px">
    <div style="display:flex;justify-content:space-between;align-items:center;padding:0 10px">${handle(22, COR.branco)}<span data-num style="${TXT_CG};font-size:22px;font-weight:600;letter-spacing:.16em;color:${COR.claro}"></span></div>
    <div style="margin-top:26px;flex:1;min-height:0;background:${COR.branco};padding:40px 46px 36px;display:flex;flex-direction:column;gap:24px;border-top:10px solid ${COR.claro}">
      <div style="display:flex;align-items:center;gap:18px">${rotulo(autoral ? 'CASO' : 'ENUNCIADO', COR.verde)}<span style="flex:1;height:2px;background:${COR.corpo};opacity:.12"></span><span data-parte style="${TXT_CG};font-size:20px;font-weight:600;letter-spacing:.14em;color:${COR.cinza}"></span></div>
      <div data-texto lang="pt-BR" style="flex:1;min-height:0;overflow:hidden;${TXT_CG};font-size:var(--px);line-height:1.48;color:${COR.corpo};text-align:justify;hyphens:auto;display:flex;flex-direction:column;gap:20px"></div>
    </div>
    <div data-pe style="flex:none;height:140px;padding-top:16px;display:flex;align-items:center;justify-content:center;${TIT_CG};line-height:1;color:${COR.claro}"></div>
  </div>`;
}

// ---------- Antes de responder ----------
function antes(c, autoral) {
  const qs = lista(c.perguntas).length ? lista(c.perguntas) : ['Quem pede, e quem praticou o ato?', 'O ato é lei, decisão, omissão ou ato administrativo?', 'Qual direito ou regra da Constituição foi atingido?', 'A prova já está pronta ou precisa ser produzida?', 'O que se quer: anular, mandar fazer, declarar ou reformar?'];
  return { bg: COR.branco, html: `
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:84px 90px 90px;color:${COR.escuro}">
      <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:26px;border-bottom:2px solid rgba(11,38,25,.15)">${handle(24, COR.escuro)}${rotulo('ANTES DE RESPONDER', COR.verde)}</div>
      <div style="margin-top:70px;${TIT_CG};font-size:120px;line-height:.95">MARQUE NO<br><span style="color:${COR.verde}">ENUNCIADO</span></div>
      <div style="margin-top:56px;display:flex;flex-direction:column;gap:0">${qs.map((q, i) => `<div style="display:flex;gap:26px;align-items:center;padding:22px 0;border-bottom:1px solid rgba(11,38,25,.12)"><span style="flex:none;width:46px;height:46px;border:4px solid ${COR.verde}"></span><span style="${TXT_CG};font-size:36px;font-weight:500;line-height:1.28">${semHifen(q)}</span></div>`).join('')}</div>
      <div style="margin-top:auto;background:${COR.escuro};color:${COR.branco};padding:26px 32px;${TXT_CG};font-size:32px;font-weight:600">A peça nasce do requisito, <span style="color:${COR.claro}">não do nome.</span></div>
    </div>` };
}

// ---------- CTA: tudo centralizado, sem vazio ----------
function cta(c, autoral) {
  return { bg: DEGRADE, html: `${grade('rgba(255,255,255,.05)')}
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:110px 90px;color:${COR.branco}">
      ${rotulo('E AÍ, QUAL É?', COR.claro)}
      <div style="margin-top:36px;${TIT_CG};font-size:210px;line-height:.9">COMENTA<br><span style="color:${COR.claro}">A PEÇA</span></div>
      <div style="margin-top:56px;width:860px;display:flex;align-items:center;gap:20px;background:${COR.branco};padding:22px 28px;text-align:left;box-shadow:0 20px 50px rgba(0,0,0,.3)">
        <span style="flex:none;width:64px;height:64px;border-radius:50%;background:${COR.verde};display:flex;align-items:center;justify-content:center;${TIT_CG};font-size:30px;color:#fff">CG</span>
        <span style="${TXT_CG};font-size:34px;font-weight:600;color:${COR.escuro}">Acho que é<span style="display:inline-block;width:3px;height:36px;background:${COR.escuro};margin-left:8px;vertical-align:-6px"></span></span>
        <span style="margin-left:auto;${TXT_CG};font-size:24px;font-weight:700;color:${COR.verde}">Publicar</span></div>
      <div style="margin-top:56px;${TXT_CG};font-size:36px;font-weight:500;line-height:1.4;max-width:820px;color:${COR.branco}">${semHifen(c.ctaTexto || 'O gabarito sai nos stories. Salva o post pra treinar de novo antes da prova.')}</div>
      <div style="margin-top:56px">${handle(26, COR.branco)}</div>
    </div>` };
}

export function renderCarrossel(c, idx = 0) {
  const autoral = c.tipo === 'autoral';
  const estilos = ['folha', 'siglas', 'branco'];
  const capa = (CAPAS[c.capa] || CAPAS[estilos[idx % 3]])(c, autoral);
  const fim = [c.antes === false ? null : antes(c, autoral), cta(c, autoral)].filter(Boolean);
  const T = tema(autoral);
  // Parágrafos do enunciado (e o comando, em negrito) quebrados em frases, para a paginação.
  const paras = lista(c.enunciado).map(p => rico(p).split(/(?<=[.;:?!])\s+(?=[A-ZÀ-Ú“(])/));
  const comando = c.comando ? `<b>${rico(c.comando)}</b>${c.valor ? ' ' + esc(c.valor) : ''}` : '';
  const slideHtml = (s, i) => `<section class="slide" style="position:absolute;left:${i * 1080}px;top:0;width:1080px;height:1350px;overflow:hidden;background:${s.bg}">${s.html}</section>`;
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link href="${FONTES_CG}" rel="stylesheet">
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
    pe.style.fontSize = ult ? '120px' : '64px'; pe.textContent = ult ? 'QUAL É A PEÇA?' : 'CONTINUA →';
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

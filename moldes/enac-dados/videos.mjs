// Vídeos verticais (1080×1920, reels) do ENAC em dados: gráficos animados, narração e trilha sintetizada.
// Cada vídeo é uma lista de cenas. O HTML tem todas as cenas com animações CSS em tempo absoluto e cada quadro
// é capturado pausando as animações no instante certo (como em moldes/pratflix/videos.mjs).
// Narração: campo "fala" de cada cena, gerado na ElevenLabs (voz VOZ, por nome) e guardado em build/voz/.
// A cena dura o tempo da fala + respiro. Saem dois arquivos: <id>.mp4 (com voz) e <id>-sem-voz.mp4 (só trilha).
// Uso: node videos.mjs [id,id]            → saida/videos/<id>.mp4
//      PREVIEW=2,8,15 node videos.mjs id  → só quadros soltos (não gasta narração: estima a duração)
//      SEM_VOZ=1 node videos.mjs          → não gera narração
// Nuvem: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node videos.mjs
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { C, CSS, FONTES, PERFIL, esc, tit, cor, fundo, etiqueta, logo, grade } from './identidade.mjs';
const root = path.dirname(new URL(import.meta.url).pathname);
const { chromium } = createRequire(path.join(root, 'package.json'))('playwright');

const W = 1080, H = 1920, FPS = 30;
const VOZ = process.env.ENAC_VOZ || 'Paulo Radames';
const EASE = 'cubic-bezier(.2,.8,.2,1)';
const an = (nome, dur, t, extra = '') => `animation:${nome} ${dur}s ${EASE} ${t.toFixed(3)}s both${extra}`;

const css = `${CSS}
.v{width:${W}px;height:${H}px}
.cena{position:absolute;inset:0}
.area{position:absolute;left:90px;right:90px;top:330px}
@property --n{syntax:'<integer>';initial-value:0;inherits:false}
.conta{counter-reset:n var(--n)}.conta::after{content:counter(n)}
@keyframes sobe{from{opacity:0;transform:translateY(60px)}to{opacity:1;transform:none}}
@keyframes desce{from{opacity:0;transform:translateY(-40px)}to{opacity:1;transform:none}}
@keyframes entra{from{opacity:0;transform:translateX(-70px)}to{opacity:1;transform:none}}
@keyframes escala{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}
@keyframes barra{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes acende{from{background:${C.apagado};transform:scale(.6)}to{transform:none}}
@keyframes surge{from{opacity:0}to{opacity:1}}
@keyframes digita{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes cursor{0%,49%{opacity:1}50%,100%{opacity:0}}
`;

// ---------- cenas: (s = dados, t0 = início em segundos, ev = eventos de áudio, d = duração da cena) ----------
const CENAS = {
  // número gigante com contagem
  numero(s, t0, ev) {
    ev.impacto.push(t0 + 1.25);
    const k = 'n' + s.n + Math.round(t0 * 10);
    return `<style>@keyframes ${k}{from{--n:0}to{--n:${s.n}}}</style><div class="area">
      <div style="${an('desce', .5, t0 + .1)}">${etiqueta(s.rotulo, s.cor)}</div>
      <div style="display:flex;align-items:flex-end;gap:20px;margin-top:56px;${an('sobe', .6, t0 + .25)}">
        <span class="tit conta" style="font-size:${s.tn || 520}px;line-height:.78;color:${cor(s.cor)};animation:${k} 1.1s cubic-bezier(.1,.7,.2,1) ${(t0 + .3).toFixed(3)}s both"></span>
        ${s.de ? `<span class="mono" style="font-size:54px;color:${C.cinza};padding-bottom:26px">${esc(s.de)}</span>` : ''}</div>
      <div style="width:100%;height:4px;background:${C.linha};margin-top:60px;transform-origin:left;${an('barra', .7, t0 + .9)}"></div>
      <div class="tit" style="font-size:${s.ts || 92}px;margin-top:48px;${an('sobe', .6, t0 + 1.2)}">${tit(s.titulo)}</div>
      ${s.texto ? `<div class="txt" style="margin-top:34px;color:${C.cinza};${an('sobe', .6, t0 + 1.7)}">${tit(s.texto)}</div>` : ''}</div>`;
  },
  // grade de 100: cada quadrado é uma questão
  grade(s, t0, ev, d) {
    const ini = t0 + 1, passo = Math.min(.03, (d - 2.6) / 100), pausa = .5;
    let i0 = 0; const tg = [];
    s.grupos.forEach((g, k) => { tg.push(ini + i0 * passo + k * pausa); i0 += g.n; });
    const idx = s.grupos.flatMap((g, k) => Array.from({ length: g.n }, (_, j) => tg[k] + j * passo));
    tg.forEach(t => ev.tick.push(t));
    return `<div class="area">
      <div style="${an('desce', .5, t0 + .1)}">${etiqueta(s.rotulo, s.cor)}</div>
      <div class="tit" style="font-size:${s.ts || 82}px;margin-top:30px;${an('sobe', .6, t0 + .25)}">${tit(s.titulo)}</div>
      <div style="margin-top:44px;${an('surge', .5, t0 + .5)}">${grade(s.grupos, 760, (i) => idx[i] != null ? `animation:acende .35s ${EASE} ${idx[i].toFixed(3)}s both` : '')}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px 30px;margin-top:44px">
        ${s.grupos.map((g, k) => `<div style="display:flex;align-items:center;gap:18px;${an('entra', .45, tg[k])}">
          <i style="width:34px;height:34px;background:${cor(g.cor)};flex:none"></i>
          <span class="tit" style="font-size:44px;letter-spacing:-.03em">${g.n}</span>
          <span style="font:500 31px/1.1 'Space Grotesk';color:${C.osso}">${esc(g.nome)}</span></div>`).join('')}</div></div>`;
  },
  // barras deitadas (ou blocos: um quadrado por questão)
  barras(s, t0, ev, d) {
    const n = s.itens.length, passo = Math.min(.8, (d - 2) / n), max = s.max || Math.max(...s.itens.map(i => i.v));
    return `<div class="area">
      <div style="${an('desce', .5, t0 + .1)}">${etiqueta(s.rotulo, s.cor)}</div>
      <div class="tit" style="font-size:${s.ts || 82}px;margin-top:30px;${an('sobe', .6, t0 + .25)}">${tit(s.titulo)}</div>
      <div style="display:flex;flex-direction:column;gap:${s.gap ?? 30}px;margin-top:56px">
      ${s.itens.map((it, i) => {
        const t = t0 + .9 + i * passo; ev.tick.push(t + .1);
        const marca = s.blocos
          ? `<div style="display:flex;gap:10px">${Array.from({ length: it.v }, (_, j) => `<i style="width:42px;height:42px;background:${cor(it.cor)};${an('escala', .3, t + .15 + j * .09)}"></i>`).join('')}</div>`
          : `<div style="flex:1;height:48px;background:${C.grafite}"><div style="width:${(it.v / max * 100).toFixed(1)}%;height:100%;background:${cor(it.cor)};transform-origin:left;${an('barra', .7, t + .1)}"></div></div>`;
        return `<div style="${an('entra', .45, t)}">
          <div style="font:600 ${s.tl || 36}px/1.1 'Space Grotesk';margin-bottom:12px">${esc(it.nome)}</div>
          <div style="display:flex;align-items:center;gap:22px">${marca}<span class="tit" style="font-size:${s.blocos ? 42 : 54}px;line-height:1;min-width:70px;color:${cor(it.cor)};${s.blocos ? 'margin-left:6px' : 'text-align:right'}">${it.v}</span></div></div>`;
      }).join('')}</div></div>`;
  },
  // cartões de divergência: tema, onde está em cada tipo de prova e as duas letras
  duelo(s, t0, ev, d) {
    const n = s.itens.length, passo = (d - 2.2) / n;
    const letra = (l, c) => `<span class="tit" style="width:84px;height:84px;display:grid;place-items:center;font-size:56px;border:3px solid ${c};color:${c}">${l}</span>`;
    return `<div class="area">
      <div style="${an('desce', .5, t0 + .1)}">${etiqueta(s.rotulo, 'coral')}</div>
      <div class="tit" style="font-size:${s.ts || 82}px;margin-top:30px;${an('sobe', .6, t0 + .25)}">${tit(s.titulo)}</div>
      <div style="display:flex;flex-direction:column;gap:22px;margin-top:50px">
      ${s.itens.map((it, i) => {
        const t = t0 + 1 + i * passo; ev.tick.push(t + .15);
        return `<div style="display:flex;align-items:center;gap:26px;background:${C.grafite};border:2px solid ${C.linha};border-left:8px solid ${C.coral};padding:26px 28px;${an('entra', .5, t)}">
          <div style="flex:1"><div style="font:700 40px/1.12 'Space Grotesk';letter-spacing:-.02em">${esc(it.tema)}</div>
            <div class="mono" style="font-size:23px;color:${C.cinza};margin-top:14px">${esc(it.ref)}</div></div>
          <div style="display:flex;align-items:center;gap:12px;${an('escala', .4, t + .3)}">${letra(it.a, C.lima)}<span class="mono" style="font-size:26px;color:${C.cinza}">ou</span>${letra(it.b, C.coral)}</div></div>`;
      }).join('')}</div></div>`;
  },
  // lista de normas: chave em mono, nome e contagem
  lista(s, t0, ev, d) {
    const n = s.itens.length, passo = (d - 2.2) / n;
    return `<div class="area">
      <div style="${an('desce', .5, t0 + .1)}">${etiqueta(s.rotulo, s.cor)}</div>
      <div class="tit" style="font-size:${s.ts || 82}px;margin-top:30px;${an('sobe', .6, t0 + .25)}">${tit(s.titulo)}</div>
      <div style="display:flex;flex-direction:column;gap:22px;margin-top:50px">
      ${s.itens.map((it, i) => {
        const t = t0 + 1 + i * passo; ev.tick.push(t + .15);
        return `<div style="display:flex;align-items:center;gap:26px;background:${C.grafite};border:2px solid ${C.linha};border-left:8px solid ${C.lima};padding:26px 28px;${an('entra', .5, t)}">
          <div style="flex:1"><div class="mono" style="font-size:25px;color:${C.lima}">${esc(it.k)}</div>
            <div style="font:700 42px/1.12 'Space Grotesk';letter-spacing:-.02em;margin-top:12px">${esc(it.t)}</div></div>
          <div style="text-align:right;${an('escala', .4, t + .3)}"><div class="tit" style="font-size:78px;color:${C.lima}">${it.n}</div><div class="mono" style="font-size:20px;color:${C.cinza}">${it.n > 1 ? 'questões' : 'questão'}</div></div></div>`;
      }).join('')}</div></div>`;
  },
  // temas: lista numerada do que cada questão cobrou (até 8 por cena)
  temas(s, t0, ev, d) {
    const n = s.itens.length, passo = (d - 2) / n, f = n <= 3 ? 46 : n <= 5 ? 42 : n <= 7 ? 38 : 35, c = cor(s.cor);
    return `<div class="area">
      <div style="${an('desce', .5, t0 + .1)}">${etiqueta(s.rotulo, s.cor)}</div>
      <div class="tit" style="font-size:${s.ts || 82}px;margin-top:30px;${an('sobe', .6, t0 + .25)}">${tit(s.titulo)}</div>
      <div style="display:flex;flex-direction:column;gap:${n <= 5 ? 20 : 14}px;margin-top:46px">
      ${s.itens.map((it, i) => {
        const t = t0 + .9 + i * passo; ev.tick.push(t + .15);
        return `<div style="display:flex;align-items:center;gap:24px;background:${C.grafite};border:2px solid ${C.linha};padding:${n <= 5 ? 24 : 16}px 24px;${an('entra', .45, t)}">
          <span class="mono" style="flex:none;width:62px;height:62px;display:grid;place-items:center;font-size:26px;letter-spacing:0;background:${c};color:${C.tinta}">${String((s.de || 1) + i).padStart(2, '0')}</span>
          <span style="font:600 ${f}px/1.14 'Space Grotesk';letter-spacing:-.02em">${tit(it)}</span></div>`;
      }).join('')}</div></div>`;
  },
  frase(s, t0, ev, d) {
    const p = s.texto.split(' '), passo = Math.min(.16, (d - 1.6) / p.length);
    ev.impacto.push(t0 + .3);
    // [[ ]] e {{ }} valem para a palavra inteira
    let c = null;
    return `<div style="position:absolute;left:90px;right:90px;top:300px;bottom:400px;display:flex;flex-wrap:wrap;align-content:center;gap:6px 24px">
      ${p.map((w, i) => {
        if (w.startsWith('[[')) c = C.lima; if (w.startsWith('{{')) c = C.coral;
        const h = `<span class="tit" style="font-size:${s.ts || 112}px;line-height:1.02;${c ? `color:${c};` : ''}${an('sobe', .45, t0 + .2 + i * passo)}">${esc(w.replace(/\[\[|\]\]|\{\{|\}\}/g, ''))}</span>`;
        if (/\]\]|\}\}/.test(w)) c = null;
        return h;
      }).join('')}</div>`;
  },
  cta(s, t0, ev) {
    ev.impacto.push(t0 + .2); ev.tick.push(t0 + 1.5, t0 + 1.8, t0 + 2.1);
    return `<div class="area" style="top:400px">
      <div style="${an('desce', .5, t0 + .1)}">${etiqueta(s.rotulo || 'Sua vez')}</div>
      <div class="tit" style="font-size:${s.ts || 116}px;margin-top:40px;${an('sobe', .6, t0 + .2)}">${tit(s.titulo)}</div>
      <div class="txt" style="margin-top:36px;color:${C.cinza};${an('sobe', .6, t0 + .6)}">${tit(s.texto)}</div>
      <div style="margin-top:70px;display:flex;align-items:center;gap:24px;background:${C.grafite};border:2px solid ${C.linha};padding:26px 30px;${an('escala', .6, t0 + 1)}">
        <span style="width:76px;height:76px;background:${C.lima};flex:none;display:grid;place-items:center">${logo(40, true).replace(/<div style="display:flex;flex-direction:column[\s\S]*$/, '</div>')}</span>
        <span style="font:600 48px 'Space Grotesk';color:${C.osso};${an('digita', 1, t0 + 1.4)}">${esc(s.digita)}</span>
        <span style="width:4px;height:54px;background:${C.lima};animation:cursor .8s steps(1) ${t0}s 20 both"></span>
        <span class="mono" style="margin-left:auto;font-size:26px;color:${C.lima}">Publicar</span></div>
      <div class="mono" style="margin-top:56px;font-size:26px;color:${C.cinza};${an('sobe', .5, t0 + 2.4)}">Siga ${PERFIL} · a prova em números</div></div>`;
  },
};

const FONTE = 'Fonte: gabaritos extraoficiais';
const VIDEOS = {
  'enac-2026-2-raio-x': { n: '01', cenas: [
    { tipo: 'numero', rotulo: 'ENAC 2026.2 · Raio-x da prova', n: 60, de: '/100', titulo: 'questões de [[uma matéria só]]', texto: 'Direito Notarial e Registral.',
      fala: 'Sessenta das cem questões do ENAC foram de uma matéria só: Direito Notarial e Registral.' },
    { tipo: 'grade', rotulo: 'Cada quadrado é uma questão', titulo: 'Como a prova se [[dividiu]]', grupos: [
      { n: 60, cor: 'lima', nome: 'Notarial e Registral' }, { n: 14, cor: 'osso', nome: 'Direito Civil' }, { n: 8, cor: 'azul', nome: 'Constitucional' }, { n: 18, cor: 'cinza', nome: 'Outras 8 matérias' }],
      fala: 'Cada quadrado aqui é uma questão. Depois de Notarial e Registral vêm Direito Civil, com catorze, e Constitucional, com oito.' },
    { tipo: 'barras', blocos: true, rotulo: 'As outras 18', titulo: 'O resto da prova, [[questão por questão]]', ts: 74, tl: 30, gap: 16, itens: [
      { nome: 'Administrativo', v: 4, cor: 'cinza' }, { nome: 'Tributário', v: 4, cor: 'cinza' }, { nome: 'Empresarial', v: 4, cor: 'cinza' }, { nome: 'Processo Civil', v: 2, cor: 'cinza' },
      { nome: 'Penal', v: 1, cor: 'cinza' }, { nome: 'Processo Penal', v: 1, cor: 'cinza' }, { nome: 'Trabalho', v: 1, cor: 'cinza' }, { nome: 'Processo do Trabalho', v: 1, cor: 'cinza' }],
      fala: 'Administrativo, Tributário e Empresarial tiveram quatro cada. Processo Civil, duas. E Penal, Processo Penal, Trabalho e Processo do Trabalho, uma questão cada.' },
    { tipo: 'frase', ts: 118, texto: 'Notarial + Civil = [[74 questões.]] A habilitação pede [[60 acertos.]]',
      fala: 'Notarial e Civil somam setenta e quatro questões. E a habilitação pede sessenta acertos.' },
    { tipo: 'cta', titulo: 'Quantas você [[acertou]]?', texto: 'Comenta a sua nota pelo gabarito extraoficial.', digita: 'Fiz 67',
      fala: 'E você, quantas acertou? Comenta a sua nota.' },
  ] },
  'enac-2026-2-divergencias': { n: '02', cenas: [
    { tipo: 'numero', cor: 'coral', rotulo: 'ENAC 2026.2 · Gabaritos extraoficiais', n: 4, tn: 600, titulo: 'questões em que os gabaritos {{não batem}}', texto: 'Comparamos dois gabaritos extraoficiais, resposta por resposta.',
      fala: 'Comparamos dois gabaritos extraoficiais do ENAC, resposta por resposta. Eles discordam em quatro questões.' },
    { tipo: 'grade', cor: 'coral', rotulo: '100 respostas comparadas', titulo: '[[96]] iguais, {{4}} diferentes', grupos: [
      { n: 96, cor: 'lima', nome: 'mesma letra nos dois' }, { n: 4, cor: 'coral', nome: 'letras diferentes' }],
      fala: 'Em noventa e seis, a letra é a mesma. Nas outras quatro, cada curso marcou uma alternativa.' },
    { tipo: 'duelo', rotulo: 'As 4 em disputa', titulo: 'Onde está a {{dúvida}}', itens: [
      { tema: 'Protesto de título prescrito', ref: 'Tipo 2 · Q6  |  Tipo 3 · Q19', a: 'A', b: 'C' },
      { tema: 'Extrato eletrônico: limite da qualificação', ref: 'Tipo 2 · Q3  |  Tipo 3 · Q32', a: 'D', b: 'E' },
      { tema: 'Cancelamento do protesto e negativação', ref: 'Tipo 2 · Q82  |  Tipo 3 · Q80', a: 'A', b: 'B' },
      { tema: 'Sentença arbitral no registro de imóveis', ref: 'Tipo 2 · Q87  |  Tipo 3 · Q82', a: 'A', b: 'C' }],
      fala: 'São elas: protesto de título prescrito, qualificação do extrato eletrônico, cancelamento do protesto com baixa da negativação e sentença arbitral no registro de imóveis.' },
    { tipo: 'frase', ts: 108, texto: 'Marcou uma dessas? Sua nota ainda pode variar {{até 4 pontos.}}',
      fala: 'Se você marcou uma dessas, a sua nota ainda pode variar até quatro pontos. Só o gabarito oficial resolve.' },
    { tipo: 'cta', titulo: 'Qual letra você [[marcou]]?', texto: 'Comenta a sua resposta na questão do extrato eletrônico.', digita: 'Marquei D', rotulo: 'Sua vez',
      fala: 'Qual letra você marcou na do extrato eletrônico? Comenta.' },
  ] },
  'enac-2026-2-notarial': { n: '03', cenas: [
    { tipo: 'numero', rotulo: 'ENAC 2026.2 · Dentro das 60', n: 24, de: '/60', titulo: 'questões de [[Registro de Imóveis]]', texto: 'A especialidade que mais caiu em Notarial e Registral.',
      fala: 'Das sessenta questões de Notarial e Registral do ENAC, vinte e quatro foram de Registro de Imóveis.' },
    { tipo: 'barras', rotulo: 'Notarial e Registral por especialidade', titulo: 'O que caiu nas [[60]]', itens: [
      { nome: 'Registro de Imóveis', v: 24 }, { nome: 'Tabelionato de Notas', v: 12, cor: 'osso' }, { nome: 'Parte geral e regime da atividade', v: 7, cor: 'osso' },
      { nome: 'Protesto', v: 6, cor: 'osso' }, { nome: 'Registro Civil das Pessoas Naturais', v: 6, cor: 'osso' }, { nome: 'Títulos e Documentos e Pessoas Jurídicas', v: 5, cor: 'osso' }],
      fala: 'Notas veio em segundo, com doze. Parte geral, sete. Protesto e Registro Civil, seis cada. Títulos e Documentos com Pessoas Jurídicas, cinco.' },
    { tipo: 'numero', rotulo: 'Prova de atualização', n: 21, de: '/60', ts: 84, titulo: 'com norma ou decisão de [[2023 pra cá]]', texto: 'Uma em cada três questões da matéria.',
      fala: 'E a prova cobrou norma nova: vinte e uma das sessenta têm fundamento em lei, provimento ou decisão de dois mil e vinte e três pra cá.' },
    { tipo: 'lista', rotulo: 'As novidades mais cobradas', titulo: 'O que [[mais apareceu]]', itens: [
      { k: 'Lei 14.711/2023', t: 'Marco das Garantias', n: 5 }, { k: 'Prov. CNJ 195/2025', t: 'SIG-RI e matrícula', n: 2 },
      { k: 'Prov. CNJ 196/2025', t: 'Busca e apreensão extrajudicial', n: 2 }, { k: 'Prov. CNJ 228/2026', t: 'Extrato eletrônico', n: 2 }],
      fala: 'Só o Marco das Garantias apareceu em cinco. Depois vêm o SIG-RI, a busca e apreensão extrajudicial e o extrato eletrônico.' },
    { tipo: 'cta', titulo: 'Qual especialidade [[te pegou]]?', texto: 'Comenta a que mais tirou ponto seu.', digita: 'Registro de Imóveis',
      fala: 'Qual especialidade te pegou? Comenta.' },
  ] },
  'enac-2026-2-civil-heranca': { n: '04', cenas: [
    { tipo: 'numero', rotulo: 'ENAC 2026.2 · Direito Civil', n: 7, de: '/14', titulo: 'questões de Civil com [[herança]] no meio', texto: 'Metade da matéria.',
      fala: 'Sete das catorze questões de Civil do ENAC tinham herança no meio.' },
    { tipo: 'temas', rotulo: 'Os temas de herança', titulo: 'O que [[caiu]]', itens: ['Comoriência entre pai e filha', 'Herança jacente e sobrinho-neto', 'Testamento de menor emancipado', 'Renúncia a herança de pessoa viva', 'Partilha desigual como doação', 'Sub-rogação da inalienabilidade', 'Impenhorabilidade sem justa causa'],
      fala: 'Comoriência, herança jacente, testamento de menor emancipado, herança de pessoa viva, partilha desigual e as cláusulas de inalienabilidade e impenhorabilidade.' },
    { tipo: 'temas', cor: 'osso', de: 8, rotulo: 'As outras 7 de Civil', titulo: 'E o [[resto]]', itens: ['Exclusão de associado', 'Reforma de estatuto de fundação', 'Locação built to suit no registro', 'Alienação fiduciária em garantia de mútuo', 'Sentença arbitral no registro de imóveis', 'Cancelamento do protesto e negativação', 'Protesto de cheque e cônjuge'],
      fala: 'As outras sete: associação, fundação, locação built to suit, alienação fiduciária, sentença arbitral e duas de protesto.' },
    { tipo: 'cta', titulo: 'Qual dessas [[te pegou]]?', texto: 'Comenta o tema de Civil que tirou ponto seu.', digita: 'Herança jacente',
      fala: 'Qual dessas te pegou? Comenta.' },
  ] },
  'enac-2026-2-constitucional': { n: '05', cenas: [
    { tipo: 'numero', rotulo: 'ENAC 2026.2 · Constitucional', n: 4, de: '/8', titulo: 'questões de Constitucional sobre [[cartório]]', texto: 'Metade da matéria.',
      fala: 'Metade de Constitucional no ENAC foi sobre cartório.' },
    { tipo: 'temas', rotulo: 'Constitucional de cartório', titulo: 'As 4 [[da casa]]', itens: ['Desacumulação de serventia só na vacância', 'Lei estadual sobre registros públicos', 'Fundo de apoio ao Registro Civil', 'Responsabilidade civil de notários (Tema 777)'],
      fala: 'Desacumulação de serventia, lei estadual sobre registros públicos, fundo de apoio ao Registro Civil e responsabilidade civil de notários.' },
    { tipo: 'temas', cor: 'osso', de: 5, rotulo: 'Constitucional puro', titulo: 'As outras [[4]]', itens: ['Colisão de direitos fundamentais', 'Recepção de lei tributária anterior a 1988', 'PEC: iniciativa, quórum e limites', 'Marco Civil da Internet (Temas 987 e 533)'],
      fala: 'As outras quatro: colisão de direitos fundamentais, recepção de lei anterior a oitenta e oito, PEC e Marco Civil da Internet.' },
    { tipo: 'frase', ts: 104, texto: 'Constitucional puro foi só metade. O resto era [[cartório com outro nome.]]',
      fala: 'Quem estudou Constitucional pensando em cartório saiu na frente.' },
    { tipo: 'cta', titulo: 'Acertou quantas das [[8]]?', texto: 'Comenta o seu placar em Constitucional.', digita: '6 de 8',
      fala: 'Acertou quantas das oito? Comenta.' },
  ] },
  'enac-2026-2-protesto': { n: '06', cenas: [
    { tipo: 'numero', rotulo: 'ENAC 2026.2 · Protesto', n: 8, titulo: 'questões de [[protesto]] na prova', texto: 'E 2 delas estavam escondidas em Direito Civil.',
      fala: 'Protesto apareceu em oito questões do ENAC. Duas estavam escondidas em Civil.' },
    { tipo: 'temas', rotulo: 'As 6 de Notarial e Registral', titulo: 'O que [[caiu]]', itens: ['Duplicata fora do prazo e regresso', 'Título prescrito e responsabilidade', 'Cédula de crédito bancário com planilha', 'Protesto falimentar', 'Central Nacional de Protesto', 'Certidão de protesto e proteção de dados'],
      fala: 'Nas de Notarial: duplicata fora do prazo, título prescrito, cédula de crédito bancário, protesto falimentar, Central Nacional de Protesto e certidão com proteção de dados.' },
    { tipo: 'temas', cor: 'coral', de: 7, rotulo: 'As 2 escondidas em Civil', titulo: 'As que vieram {{disfarçadas}}', itens: ['Cancelamento do protesto e baixa da negativação', 'Protesto de cheque contra cônjuge que não assinou'],
      fala: 'Em Civil: cancelamento do protesto com baixa da negativação e cheque de cônjuge que não assinou.' },
    { tipo: 'cta', titulo: 'Qual dessas você [[errou]]?', texto: 'Comenta o tema de protesto que te derrubou.', digita: 'Título prescrito',
      fala: 'Qual dessas você errou? Comenta.' },
  ] },
  'enac-2026-2-anulacao-extrato': { n: '07', fonte: 'Fonte: gabarito extraoficial', cenas: [
    { tipo: 'frase', ts: 112, texto: 'Uma palavra pode anular esta questão: {{exclusivamente.}}',
      fala: 'Uma palavra pode derrubar uma questão do ENAC: exclusivamente.' },
    { tipo: 'duelo', rotulo: 'Extrato eletrônico', titulo: 'Dois gabaritos, {{duas respostas}}', itens: [
      { tema: 'Extrato eletrônico: limite da qualificação registral', ref: 'Tipo 2 · Q3  |  Tipo 3 · Q32', a: 'D', b: 'E' }],
      fala: 'É a do extrato eletrônico. Um gabarito extraoficial marcou D, o outro marcou E.' },
    { tipo: 'temas', cor: 'coral', rotulo: 'O argumento do recurso', titulo: 'Onde está o {{problema}}', itens: ['A alternativa D diz que o oficial qualifica {{exclusivamente}} pelo extrato', 'O art. 210-I do Código Nacional de Normas deixa exigir o contrato quando o oficial achar necessário', 'Com isso, o “exclusivamente” não fecha com a norma'],
      fala: 'A alternativa D diz que o oficial qualifica o título exclusivamente pelo extrato. Mas o Código Nacional de Normas deixa exigir o contrato quando ele achar necessário.' },
    { tipo: 'frase', ts: 104, texto: 'Se nenhuma alternativa fica inteiramente certa, cabe pedir {{anulação.}}',
      fala: 'Se nenhuma alternativa fica inteiramente certa, cabe pedir anulação.' },
    { tipo: 'cta', titulo: 'Você marcou [[D]] ou {{E}}?', texto: 'Comenta a sua resposta e se vai recorrer.', digita: 'Marquei D, vou recorrer',
      fala: 'Você marcou D ou E? Comenta.' },
  ] },
};

// ---------- narração ----------
const dirVoz = path.join(root, 'build', 'voz');
let vozId;
const curl = (args) => execFileSync('curl', ['-sS', '-f', ...args], { maxBuffer: 1 << 26 });
function idDaVoz() {
  if (vozId) return vozId;
  const vs = JSON.parse(curl(['https://api.elevenlabs.io/v1/voices'])).voices.filter(v => v.name === VOZ);
  if (!vs.length) throw new Error('voz não encontrada: ' + VOZ);
  return vozId = (vs.find(v => v.category === 'professional') || vs[0]).voice_id;
}
const duracao = f => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());
function fala(texto, estimar) {
  const f = path.join(dirVoz, crypto.createHash('sha1').update(VOZ + '|' + texto).digest('hex').slice(0, 16) + '.mp3');
  if (!fs.existsSync(f)) {
    if (estimar) return { f: null, dur: texto.length / 15 };
    fs.mkdirSync(dirVoz, { recursive: true });
    curl(['-X', 'POST', `https://api.elevenlabs.io/v1/text-to-speech/${idDaVoz()}?output_format=mp3_44100_128`, '-H', 'Content-Type: application/json',
      '-d', JSON.stringify({ text: texto, model_id: 'eleven_multilingual_v2', voice_settings: { stability: .5, similarity_boost: .8 } }), '-o', f]);
  }
  return { f, dur: duracao(f) };
}

function montar(id, v, estimar) {
  const ev = { whoosh: [], tick: [], impacto: [] }, vozes = [];
  const semVoz = !!process.env.SEM_VOZ;
  for (const c of v.cenas) {
    const fl = c.fala && !semVoz ? fala(c.fala, estimar) : null;
    c.dur = Math.max(c.dur || 4.5, fl ? fl.dur + 1 : 0, semVoz && c.fala ? c.fala.length / 15 + 1 : 0);
    c.voz = fl;
  }
  let t = 0; const partes = [];
  const total = v.cenas.reduce((a, c) => a + c.dur, 0);
  v.cenas.forEach((c, i) => {
    const fade = .3, a = (fade / c.dur * 100).toFixed(2), b = (100 - fade / c.dur * 100).toFixed(2);
    if (i) ev.whoosh.push(t);
    if (c.voz?.f) vozes.push({ f: c.voz.f, t: t + .4 });
    partes.push(`<style>@keyframes c${i}{0%{opacity:0}${a}%{opacity:1}${b}%{opacity:1}100%{opacity:${i === v.cenas.length - 1 ? 1 : 0}}}</style>
      <div class="cena" style="animation:c${i} ${c.dur}s linear ${t}s both">${CENAS[c.tipo](c, t, ev, c.dur)}</div>`);
    t += c.dur;
  });
  const fixo = `<div style="position:absolute;left:90px;right:90px;top:150px;display:flex;justify-content:space-between;align-items:flex-end;z-index:5">${logo(64)}<span class="mono" style="font-size:22px;color:${C.cinza}">ENAC 2026.2 · Nº ${v.n}</span></div>
    <div style="position:absolute;left:90px;right:90px;top:250px;height:4px;background:${C.linha};z-index:5"><div style="height:100%;background:${C.lima};transform-origin:left;animation:barra ${total}s linear 0s both"></div></div>
    <div class="mono" style="position:absolute;left:90px;right:90px;bottom:330px;display:flex;justify-content:space-between;font-size:22px;color:${C.cinza};z-index:5"><span>${PERFIL}</span><span>${v.fonte || FONTE}</span></div>`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet"><style>${css}</style></head><body><div class="tela v">${fundo()}${partes.join('')}${fixo}</div></body></html>`;
  return { html, total, ev, vozes };
}

async function main() {
  const so = process.argv[2]?.split(',');
  const launch = {};
  if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
  if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
  const browser = await chromium.launch(launch);
  const out = path.join(root, 'saida', 'videos'); fs.mkdirSync(out, { recursive: true });
  for (const [id, v] of Object.entries(VIDEOS)) {
    if (so && !so.includes(id)) continue;
    const { html, total, ev, vozes } = montar(id, v, !!process.env.PREVIEW);
    const tmp = path.join(root, 'build', 'video-' + id); fs.rmSync(tmp, { recursive: true, force: true }); fs.mkdirSync(tmp, { recursive: true });
    const page = await browser.newPage({ viewport: { width: W, height: H } });
    await page.setContent(html); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(500);
    const ir = ms => page.evaluate(ms => document.getAnimations().forEach(a => { a.pause(); a.currentTime = ms; }), ms);
    if (process.env.PREVIEW) {
      console.log('prévia', id, total.toFixed(1), v.cenas.map(c => c.dur.toFixed(1)).join(' '));
      for (const sec of process.env.PREVIEW.split(',').map(Number)) {
        await ir(sec * 1000);
        await page.screenshot({ path: path.join(out, `${id}-prev-${sec}.jpg`), type: 'jpeg', quality: 80 });
      }
      await page.close(); continue;
    }
    const n = Math.round(total * FPS);
    for (let i = 0; i < n; i++) {
      await ir(i * 1000 / FPS);
      await page.screenshot({ path: path.join(tmp, `${String(i).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 92 });
    }
    await page.close();
    ev.dur = total;
    fs.writeFileSync(path.join(tmp, 'eventos.json'), JSON.stringify(ev));
    execFileSync('python3', [path.join(root, 'trilha.py'), path.join(tmp, 'eventos.json'), path.join(tmp, 'trilha.wav')], { stdio: 'inherit' });
    const base = ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(tmp, '%05d.jpg'), '-i', path.join(tmp, 'trilha.wav')];
    const fim = ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '19', '-preset', 'medium', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-t', total.toFixed(3), '-movflags', '+faststart'];
    execFileSync('ffmpeg', [...base, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', ...fim, path.join(out, `${id}${vozes.length ? '-sem-voz' : ''}.mp4`)]);
    if (vozes.length) { // trilha baixa por baixo da narração
      const filtro = `[1:a]volume=0.13[m];${vozes.map((z, i) => `[${i + 2}:a]adelay=${Math.round(z.t * 1000)}:all=1,volume=2[v${i}]`).join(';')};[m]${vozes.map((_, i) => `[v${i}]`).join('')}amix=inputs=${vozes.length + 1}:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11[a]`;
      execFileSync('ffmpeg', [...base, ...vozes.flatMap(z => ['-i', z.f]), '-filter_complex', filtro, '-map', '0:v', '-map', '[a]', ...fim, path.join(out, `${id}.mp4`)]);
    }
    fs.rmSync(tmp, { recursive: true, force: true });
    console.log('✓', id, `${total.toFixed(1)}s`);
  }
  await browser.close();
}
main();

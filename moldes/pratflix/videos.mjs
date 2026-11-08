// Vídeos verticais (1080×1920, reels/stories) da PratFlix com tipografia animada e trilha sintetizada (sem voz).
// Cada vídeo é uma lista de cenas; o HTML tem todas as cenas com animações CSS em tempo absoluto e cada quadro
// é capturado pausando as animações no instante certo. A trilha (trilha.py) recebe os instantes das trocas de
// cena, dos itens e dos títulos para sincronizar whoosh, tick e impacto.
// Uso: node videos.mjs [id,id] → saida/videos/<id>.mp4
// Nuvem: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node videos.mjs
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const root = path.dirname(new URL(import.meta.url).pathname);
const { chromium } = createRequire(path.join(root, 'package.json'))('playwright');
import { FONTES } from './template.mjs';

// FORMATO=vertical gera 1080×1920 (reels); o padrão é slide 16:9 (1920×1080), para aula.
const HOR = process.env.FORMATO !== 'vertical';
const W = HOR ? 1920 : 1080, H = HOR ? 1080 : 1920, FPS = 30;
const C = { bg: '#121212', areia: '#E3D6B4', areia2: '#C9B88E', ouro: '#9A7B3A', txt: '#EDEAE3', mute: '#8E8A82' };
const T = "font-family:'Big Shoulders Display';font-weight:900;text-transform:uppercase;letter-spacing:-.005em";
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const tit = l => esc(l).replace(/\[\[(.+?)\]\]/g, (_, t) => `<span style="color:${C.areia}">${t}</span>`);
const EASE = 'cubic-bezier(.2,.8,.2,1)';
const an = (nome, dur, t, extra = '') => `animation:${nome} ${dur}s ${EASE} ${t.toFixed(3)}s both${extra}`;

const css = `
*{box-sizing:border-box;margin:0}
body{background:${C.bg}}
.v{position:relative;width:${W}px;height:${H}px;overflow:hidden;color:${C.txt};font-family:Manrope,sans-serif}
.cena{position:absolute;inset:0}
.tit{${T};line-height:.9}
.rot{display:inline-flex;align-items:center;gap:14px;border:2px solid ${C.areia}66;border-radius:12px;padding:14px 24px;font:800 26px Manrope;letter-spacing:.24em;color:${C.areia}}
.txt{font:500 46px/1.4 Manrope;color:${C.txt}}
@keyframes sobe{from{opacity:0;transform:translateY(70px)}to{opacity:1;transform:none}}
@keyframes desce{from{opacity:0;transform:translateY(-50px)}to{opacity:1;transform:none}}
@keyframes escala{from{opacity:0;transform:scale(.55)}to{opacity:1;transform:none}}
@keyframes entra{from{opacity:0;transform:translateX(-80px)}to{opacity:1;transform:none}}
@keyframes check{0%{transform:scale(0)}70%{transform:scale(1.25)}100%{transform:scale(1)}}
@keyframes barra{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes gira{from{transform:translate(-50%,-50%) rotate(0)}to{transform:translate(-50%,-50%) rotate(360deg)}}
@keyframes pulso{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
@keyframes cursor{0%,49%{opacity:1}50%,100%{opacity:0}}
@keyframes digita{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes zoom{from{transform:scale(1)}to{transform:scale(1.08)}}
`;
const grao = `<div style="position:absolute;inset:0;pointer-events:none;opacity:.14;mix-blend-mode:overlay;background-image:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E&quot;)"></div>`;
const logo = (px = 40, cor = C.txt) => `<div style="display:inline-flex;flex-direction:column;color:${cor}"><span style="font:800 ${px}px Manrope;letter-spacing:-.05em;line-height:1">pratflix<span style="font-size:.55em;vertical-align:.25em;margin-left:2px">▸</span></span><span style="font:600 ${px * .24}px Manrope;letter-spacing:.42em;margin-top:${px * .18}px;opacity:.75">A ADVOCACIA NA PRÁTICA</span></div>`;

// ---------- cenas: cada uma recebe (s = dados, t0 = início em segundos, ev = eventos de áudio) ----------
const CENAS = {
  capa(s, t0, ev) {
    ev.impacto.push(t0 + .45);
    return `<div style="position:absolute;left:90px;right:90px;top:430px">
      <div style="${an('desce', .6, t0 + .1)}"><span class="rot">✦ ${esc(s.rotulo)}</span></div>
      ${s.titulo.map((l, i) => `<div class="tit" style="font-size:${s.ts || 190}px;margin-top:${i ? 0 : 40}px;${an('sobe', .7, t0 + .35 + i * .22)}">${tit(l)}</div>`).join('')}
      <div style="width:150px;height:10px;background:${C.areia};margin-top:50px;transform-origin:left;${an('barra', .6, t0 + .9)}"></div>
      <div class="txt" style="margin-top:40px;opacity:.85;${an('sobe', .6, t0 + 1.1)}">${esc(s.texto)}</div></div>`;
  },
  frase(s, t0) {
    const palavras = s.texto.split(' ');
    return `<div style="position:absolute;left:90px;right:90px;top:0;bottom:0;display:flex;flex-wrap:wrap;align-content:center;gap:0 22px">
      ${palavras.map((p, i) => `<span class="tit" style="font-size:${s.ts || 120}px;${an('sobe', .45, t0 + .15 + i * .12)}">${tit(p)}</span>`).join('')}</div>`;
  },
  lista(s, t0, ev) {
    const passo = s.passo || 1.3;
    return `<div style="position:absolute;left:90px;right:90px;top:360px">
      ${s.rotulo ? `<div style="${an('desce', .5, t0 + .05)}"><span class="rot">✦ ${esc(s.rotulo)}</span></div>` : ''}
      <div class="tit" style="font-size:${s.ts || 120}px;margin-top:28px;${an('sobe', .6, t0 + .2)}">${tit(s.titulo)}</div>
      ${s.sub ? `<div style="font:600 34px Manrope;color:${C.mute};margin-top:18px;${an('sobe', .5, t0 + .4)}">${esc(s.sub)}</div>` : ''}
      <div style="display:flex;flex-direction:column;gap:${s.gap ?? 32}px;margin-top:60px">
      ${s.itens.map((it, i) => {
        const t = t0 + 1 + i * passo; ev.tick.push(t + .25);
        return `<div style="display:flex;align-items:center;gap:30px;${an('entra', .5, t)}">
          <span style="flex:none;width:64px;height:64px;border-radius:16px;background:linear-gradient(135deg,${C.areia},${C.areia2});display:grid;place-items:center;font:800 38px Manrope;color:#121212;${an('check', .4, t + .2)}">${s.numerado ? i + 1 : '✓'}</span>
          <span style="font:700 ${s.tl || 48}px/1.25 Manrope">${tit(it)}</span></div>`;
      }).join('')}</div></div>`;
  },
  passo(s, t0, ev) {
    ev.impacto.push(t0 + .3);
    return `<div class="tit" style="position:absolute;right:-30px;top:250px;font-size:620px;line-height:.8;color:transparent;-webkit-text-stroke:3px ${C.areia}55;${an('escala', .9, t0 + .05)}">${esc(s.n)}</div>
      <div style="position:absolute;left:90px;right:90px;top:820px">
        <div style="${an('desce', .5, t0 + .25)}"><span class="rot">ETAPA ${esc(s.n)}</span></div>
        <div class="tit" style="font-size:${s.ts || 130}px;margin-top:30px;${an('sobe', .6, t0 + .4)}">${tit(s.titulo)}</div>
        <div style="width:120px;height:8px;background:${C.areia};margin-top:40px;transform-origin:left;${an('barra', .5, t0 + .8)}"></div>
        <div class="txt" style="margin-top:36px;${an('sobe', .6, t0 + 1)}">${tit(s.texto)}</div></div>`;
  },
  alerta(s, t0, ev) {
    ev.impacto.push(t0 + .3);
    return `<div style="position:absolute;left:80px;right:80px;top:0;bottom:0;display:flex;align-items:center">
      <div style="width:100%;background:${C.areia};color:#121212;border-radius:40px;padding:70px 64px;${an('escala', .6, t0 + .15)}">
        <div style="font:800 30px Manrope;letter-spacing:.24em">⚠ ATENÇÃO</div>
        <div class="tit" style="font-size:${s.ts || 110}px;margin-top:24px">${esc(s.titulo)}</div>
        <div style="font:600 44px/1.4 Manrope;margin-top:30px;${an('sobe', .5, t0 + .7)}">${esc(s.texto)}</div></div></div>`;
  },
  cta(s, t0, ev) {
    ev.impacto.push(t0 + .2); ev.tick.push(t0 + 1.4, t0 + 1.7, t0 + 2.0);
    return `<div style="position:absolute;left:0;top:50%;width:1500px;height:1500px;border-radius:50%;border:3px solid ${C.areia}22;${an('gira', 30, t0, ' ,zoom 8s linear ' + t0 + 's both')}"></div>
      <div style="position:absolute;left:90px;right:90px;top:360px">
        <div class="tit" style="font-size:${s.ts || 120}px;${an('sobe', .6, t0 + .1)}">${tit(s.titulo)}</div>
        <div class="txt" style="margin-top:36px;opacity:.85;${an('sobe', .6, t0 + .5)}">${esc(s.texto)}</div>
        <div style="margin-top:80px;display:flex;align-items:center;gap:24px;background:#1E1E1D;border:2px solid #3a3a34;border-radius:999px;padding:26px 30px 26px 34px;${an('escala', .6, t0 + .9)}">
          <span style="width:84px;height:84px;border-radius:50%;background:linear-gradient(135deg,${C.areia},${C.areia2});flex:none"></span>
          <span style="font:700 54px Manrope;color:${C.areia};${an('digita', 1, t0 + 1.3)}">${esc(s.hashtag)}</span>
          <span style="width:5px;height:58px;background:${C.txt};animation:cursor .8s steps(1) ${t0}s 20 both"></span>
          <span style="margin-left:auto;font:800 42px Manrope;color:#4E8BFF">Publicar</span></div>
        <div style="margin-top:60px;font:700 40px Manrope;color:${C.mute};${an('sobe', .5, t0 + 2.4)}">${esc(s.rodape || '')}</div></div>`;
  },
};

// ---------- versão slide (16:9): mesmas cenas, diagramadas em duas colunas ----------
const CENAS_H = {
  capa(s, t0, ev) {
    ev.impacto.push(t0 + .45);
    return `<div style="position:absolute;left:140px;right:640px;top:250px">
      <div style="${an('desce', .6, t0 + .1)}"><span class="rot">✦ ${esc(s.rotulo)}</span></div>
      ${s.titulo.map((l, i) => `<div class="tit" style="font-size:${(s.ts || 190) * .95}px;margin-top:${i ? 0 : 36}px;${an('sobe', .7, t0 + .35 + i * .22)}">${tit(l)}</div>`).join('')}
      <div style="width:150px;height:10px;background:${C.areia};margin-top:44px;transform-origin:left;${an('barra', .6, t0 + .9)}"></div>
      <div class="txt" style="margin-top:34px;opacity:.85;${an('sobe', .6, t0 + 1.1)}">${esc(s.texto)}</div></div>`;
  },
  frase(s, t0) {
    return `<div style="position:absolute;left:160px;right:160px;top:180px;bottom:120px;display:flex;flex-wrap:wrap;align-content:center;gap:0 24px">
      ${s.texto.split(' ').map((p, i) => `<span class="tit" style="font-size:${(s.ts || 120) * 1.05}px;${an('sobe', .45, t0 + .15 + i * .12)}">${tit(p)}</span>`).join('')}</div>`;
  },
  lista(s, t0, ev) {
    const passo = s.passo || 1.3, n = s.itens.length;
    const tl = n > 6 ? 38 : n > 4 ? 42 : 48, gap = n > 6 ? 16 : 26;
    return `<div style="position:absolute;left:120px;width:690px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center">
        ${s.rotulo ? `<div style="${an('desce', .5, t0 + .05)}"><span class="rot">✦ ${esc(s.rotulo)}</span></div>` : ''}
        <div class="tit" style="font-size:${Math.min(150, (s.ts || 120) * 1.15)}px;margin-top:28px;${an('sobe', .6, t0 + .2)}">${tit(s.titulo)}</div>
        ${s.sub ? `<div style="font:600 34px Manrope;color:${C.mute};margin-top:22px;${an('sobe', .5, t0 + .4)}">${esc(s.sub)}</div>` : ''}</div>
      <div style="position:absolute;left:880px;right:120px;top:190px;bottom:130px;display:flex;flex-direction:column;justify-content:center;gap:${gap}px">
      ${s.itens.map((it, i) => {
        const t = t0 + 1 + i * passo; ev.tick.push(t + .25);
        return `<div style="display:flex;align-items:center;gap:26px;background:#1b1a17;border:1.5px solid #2e2c27;border-radius:20px;padding:${n > 6 ? 12 : 18}px 26px;${an('entra', .5, t)}">
          <span style="flex:none;width:${n > 6 ? 52 : 60}px;height:${n > 6 ? 52 : 60}px;border-radius:14px;background:linear-gradient(135deg,${C.areia},${C.areia2});display:grid;place-items:center;font:800 32px Manrope;color:#121212;${an('check', .4, t + .2)}">${s.numerado ? i + 1 : '✓'}</span>
          <span style="font:700 ${tl}px/1.22 Manrope">${tit(it)}</span></div>`;
      }).join('')}</div>`;
  },
  passo(s, t0, ev) {
    ev.impacto.push(t0 + .3);
    return `<div class="tit" style="position:absolute;left:40px;top:150px;width:760px;text-align:center;font-size:${s.n.length > 1 ? 560 : 640}px;line-height:.8;color:transparent;-webkit-text-stroke:3px ${C.areia}66;${an('escala', .9, t0 + .05)}">${esc(s.n)}</div>
      <div style="position:absolute;left:880px;right:130px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center">
        <div style="${an('desce', .5, t0 + .25)}"><span class="rot">${s.n === '!' ? 'DICA' : 'ETAPA ' + esc(s.n)}</span></div>
        <div class="tit" style="font-size:${(s.ts || 130) * 1.05}px;margin-top:30px;${an('sobe', .6, t0 + .4)}">${tit(s.titulo)}</div>
        <div style="width:120px;height:8px;background:${C.areia};margin-top:36px;transform-origin:left;${an('barra', .5, t0 + .8)}"></div>
        <div class="txt" style="margin-top:32px;${an('sobe', .6, t0 + 1)}">${tit(s.texto)}</div></div>`;
  },
  alerta(s, t0, ev) {
    ev.impacto.push(t0 + .3);
    return `<div style="position:absolute;left:260px;right:260px;top:0;bottom:0;display:flex;align-items:center">
      <div style="width:100%;background:${C.areia};color:#121212;border-radius:40px;padding:70px 80px;${an('escala', .6, t0 + .15)}">
        <div style="font:800 30px Manrope;letter-spacing:.24em">⚠ ATENÇÃO</div>
        <div class="tit" style="font-size:${(s.ts || 110) * 1.1}px;margin-top:24px">${esc(s.titulo)}</div>
        <div style="font:600 46px/1.4 Manrope;margin-top:30px;${an('sobe', .5, t0 + .7)}">${esc(s.texto)}</div></div></div>`;
  },
  cta(s, t0, ev) {
    ev.impacto.push(t0 + .2); ev.tick.push(t0 + 1.4, t0 + 1.7, t0 + 2.0);
    return `<div style="position:absolute;left:1500px;top:540px;width:1400px;height:1400px;border-radius:50%;border:3px solid ${C.areia}22;${an('gira', 30, t0, ' ,zoom 8s linear ' + t0 + 's both')}"></div>
      <div style="position:absolute;left:140px;right:520px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center">
        <div class="tit" style="font-size:${(s.ts || 120) * 1.15}px;${an('sobe', .6, t0 + .1)}">${tit(s.titulo)}</div>
        <div class="txt" style="margin-top:30px;opacity:.85;${an('sobe', .6, t0 + .5)}">${esc(s.texto)}</div>
        <div style="margin-top:60px;display:flex;align-items:center;gap:24px;background:#1E1E1D;border:2px solid #3a3a34;border-radius:999px;padding:24px 30px 24px 34px;width:900px;${an('escala', .6, t0 + .9)}">
          <span style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,${C.areia},${C.areia2});flex:none"></span>
          <span style="font:700 52px Manrope;color:${C.areia};${an('digita', 1, t0 + 1.3)}">${esc(s.hashtag)}</span>
          <span style="width:5px;height:56px;background:${C.txt};animation:cursor .8s steps(1) ${t0}s 20 both"></span>
          <span style="margin-left:auto;font:800 40px Manrope;color:#4E8BFF">Publicar</span></div>
        <div style="margin-top:44px;font:700 38px Manrope;color:${C.mute};${an('sobe', .5, t0 + 2.4)}">${esc(s.rodape || '')}</div></div>`;
  },
};

// ---------- os 3 vídeos ----------
const CTA = { tipo: 'cta', dur: 8, titulo: 'Quer o guia [[completo]]?', texto: 'Com os links oficiais de inscrição das 27 seccionais e o checklist pra não esquecer nada.', hashtag: '#CARTEIRA', rodape: 'Comenta #CARTEIRA que eu te mando.' };
const VIDEOS = {
  'carteira-oab-1-antes-de-pedir': { parte: 'PARTE 1 DE 3', cenas: [
    { tipo: 'capa', dur: 5, rotulo: 'Passou na OAB?', titulo: ['Agora vem a', '[[carteira]]'], ts: 165, texto: 'O passo a passo, sem enrolação. Parte 1: antes de pedir.' },
    { tipo: 'frase', dur: 4, texto: 'Antes de juntar qualquer documento, confira [[três]] coisas.' },
    { tipo: 'lista', dur: 12.5, rotulo: 'Estatuto, art. 8º', titulo: 'O que a lei [[exige]]', itens: ['Capacidade civil', 'Diploma ou certidão de graduação em Direito', 'Título de eleitor e quitação militar', 'Aprovação no Exame de Ordem', 'Não exercer atividade incompatível', 'Idoneidade moral', 'Prestar compromisso'], passo: 1.35, tl: 46, gap: 26 },
    { tipo: 'passo', dur: 9, n: '01', titulo: 'A seccional [[certa]]', texto: 'A inscrição principal é no estado do seu [[domicílio profissional]] (art. 10). Não precisa ser onde você estudou ou fez a prova.' },
    { tipo: 'passo', dur: 9, n: '02', titulo: 'Sem [[incompatibilidade]]', ts: 112, texto: 'Juiz, promotor, policial e quem lida com tributos, entre outros, não se inscrevem enquanto estiverem no cargo (art. 28).' },
    { tipo: 'alerta', dur: 7, titulo: 'Servidor ou bancário?', texto: 'Peça logo a declaração do empregador com cargo e atribuições. É o documento que mais demora.' },
    { tipo: 'passo', dur: 9, n: '03', titulo: 'O [[certificado]]', texto: 'Baixe o certificado de aprovação na área do candidato da [[FGV]], depois da homologação. Sem ele, o pedido trava.' },
    { tipo: 'lista', dur: 7, rotulo: 'Resumo', titulo: 'Tudo [[pronto]]?', itens: ['Seccional escolhida', 'Sem incompatibilidade', 'Certificado em PDF'], passo: 1, sub: 'Próximo vídeo: os documentos.' },
    CTA,
  ] },
  'carteira-oab-2-documentos': { parte: 'PARTE 2 DE 3', cenas: [
    { tipo: 'capa', dur: 5, rotulo: 'Parte 2 de 3', titulo: ['Os', '[[documentos]]'], ts: 200, texto: 'O que juntar pra pedir a carteira da OAB.' },
    { tipo: 'frase', dur: 5, ts: 104, texto: 'A lista muda de seccional pra seccional. Mas este [[núcleo]] aparece em quase todas.' },
    { tipo: 'lista', dur: 10.5, rotulo: 'Pessoais', titulo: 'Quem é [[você]]', itens: ['RG ou CIN, frente e verso', 'CPF', 'Título + quitação eleitoral', 'Reservista (homens até 45)', 'Comprovante de residência', 'Certidão de nascimento ou casamento, se o nome mudou'], passo: 1.35, tl: 46 },
    { tipo: 'lista', dur: 7.5, rotulo: 'Formação', titulo: 'Diploma e [[Exame]]', itens: ['Diploma, frente e verso, ou certidão de colação com histórico', 'Certificado de aprovação no Exame', 'Declaração do empregador, se for servidor ou bancário'], passo: 1.6 },
    { tipo: 'lista', dur: 7.5, rotulo: 'Certidões', titulo: 'E as [[declarações]]', ts: 108, itens: ['Certidões criminais: Justiça Estadual e Federal', 'Declaração de não exercer atividade incompatível', 'Foto 3x4 no padrão da seccional'], passo: 1.6 },
    { tipo: 'passo', dur: 8, n: '!', titulo: 'Tudo em [[PDF]]', texto: 'Legível, frente e verso no mesmo arquivo. Foto torta de celular volta em [[diligência]].' },
    { tipo: 'passo', dur: 8, n: '!', titulo: 'Certidões por [[último]]', ts: 118, texto: 'Algumas seccionais só aceitam certidões recentes. Emita perto do envio.' },
    { tipo: 'alerta', dur: 6.5, titulo: 'O nome mudou?', texto: 'Casamento, divórcio, retificação: anexe a certidão que comprova o nome atual.' },
    CTA,
  ] },
  'carteira-oab-3-pedido': { parte: 'PARTE 3 DE 3', cenas: [
    { tipo: 'capa', dur: 5, rotulo: 'Parte 3 de 3', titulo: ['Do pedido à', '[[carteira]]', 'na mão'], ts: 170, texto: 'As etapas, uma por uma.' },
    { tipo: 'lista', dur: 12, rotulo: 'O caminho', titulo: '8 [[etapas]]', itens: ['Certificado de aprovação', 'Lista da sua seccional', 'Documentos em PDF', 'Pedido online', 'Taxa', 'Biometria e foto', 'Acompanhamento', 'Compromisso e carteira'], passo: 1.2, numerado: true, tl: 46, gap: 22 },
    { tipo: 'passo', dur: 9, n: '04', titulo: 'Pedido [[online]]', texto: 'No portal da seccional ou no [[Peticionamento Eletrônico da OAB]]. Use o e-mail que você abre todo dia.' },
    { tipo: 'passo', dur: 7, n: '05', titulo: 'Pague a [[taxa]]', texto: 'O boleto sai no pedido. Sem pagamento, o processo não anda.' },
    { tipo: 'passo', dur: 9, n: '06', titulo: 'Biometria e [[foto]]', texto: 'Digitais, assinatura e foto 3x4 recente, fundo branco, roupa sóbria. Na sede ou na subseção.' },
    { tipo: 'passo', dur: 9, n: '07', titulo: '[[Acompanhe]]', texto: 'Se vier diligência, responda no prazo, pelo mesmo sistema. E olhe o spam.' },
    { tipo: 'passo', dur: 9, n: '08', titulo: 'Compromisso e [[carteira]]', ts: 116, texto: 'Pedido deferido: você presta o compromisso, muitas vezes em sessão solene, e recebe a carteira.' },
    { tipo: 'frase', dur: 5, ts: 140, texto: 'Agora é [[oficial]]. Bem-vindo à advocacia.' },
    CTA,
  ] },
};

function montar(v) {
  const ev = { whoosh: [], tick: [], impacto: [] };
  let t = 0; const partes = [];
  const total = v.cenas.reduce((a, c) => a + c.dur, 0);
  v.cenas.forEach((c, i) => {
    const fade = .35, a = (fade / c.dur * 100).toFixed(2), b = (100 - fade / c.dur * 100).toFixed(2);
    if (i) ev.whoosh.push(t);
    partes.push(`<style>@keyframes c${i}{0%{opacity:0}${a}%{opacity:1}${b}%{opacity:1}100%{opacity:${i === v.cenas.length - 1 ? 1 : 0}}}</style>
      <div class="cena" style="animation:c${i} ${c.dur}s linear ${t}s both">${(HOR ? CENAS_H : CENAS)[c.tipo](c, t, ev)}</div>`);
    t += c.dur;
  });
  const fixo = HOR ? `<div style="position:absolute;left:120px;right:120px;top:56px;display:flex;justify-content:space-between;align-items:center;z-index:5">${logo(34)}<span style="font:800 20px Manrope;letter-spacing:.24em;color:${C.areia}">CARTEIRA DA OAB · ${v.parte}</span></div>
    <div style="position:absolute;left:120px;right:120px;top:138px;height:5px;background:#2a2a28;border-radius:5px;z-index:5"><div style="height:100%;background:${C.areia};border-radius:5px;transform-origin:left;animation:barra ${total}s linear 0s both"></div></div>
    <div style="position:absolute;left:120px;right:120px;bottom:44px;display:flex;justify-content:space-between;font:700 22px Manrope;color:${C.mute};z-index:5"><span>@liberofilho</span><span>liberofilho.com/pratflix</span></div>` : `<div style="position:absolute;left:90px;right:90px;top:150px;display:flex;justify-content:space-between;align-items:center;z-index:5">${logo(38)}<span style="font:800 22px Manrope;letter-spacing:.24em;color:${C.areia}">${v.parte}</span></div>
    <div style="position:absolute;left:90px;right:90px;top:250px;height:6px;background:#2a2a28;border-radius:6px;z-index:5"><div style="height:100%;background:${C.areia};border-radius:6px;transform-origin:left;animation:barra ${total}s linear 0s both"></div></div>
    <div style="position:absolute;left:90px;right:90px;bottom:330px;display:flex;justify-content:space-between;font:700 28px Manrope;color:${C.mute};z-index:5"><span>@liberofilho</span><span>Carteira da OAB</span></div>`;
  const fundo = `<div style="position:absolute;inset:0;background:radial-gradient(80% 60% at 70% 30%,#24221d 0%,${C.bg} 70%)"></div>
    <div style="position:absolute;left:1000px;top:300px;width:900px;height:900px;border-radius:50%;border:2px solid ${C.areia}1c;transform:translate(-50%,-50%)"></div>
    <div style="position:absolute;left:1000px;top:300px;width:640px;height:640px;border-radius:50%;border:2px solid ${C.areia}14;transform:translate(-50%,-50%)"></div>${grao}`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet"><style>${css}</style></head><body><div class="v">${fundo}${partes.join('')}${fixo}</div></body></html>`;
  return { html, total, ev };
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
    const { html, total, ev } = montar(v);
    const tmp = path.join(root, 'build', 'video-' + id); fs.rmSync(tmp, { recursive: true, force: true }); fs.mkdirSync(tmp, { recursive: true });
    const page = await browser.newPage({ viewport: { width: W, height: H } });
    await page.setContent(html); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(500);
    if (process.env.PREVIEW) { // PREVIEW=2,8,15 → só quadros soltos, para conferir
      for (const sec of process.env.PREVIEW.split(',').map(Number)) {
        await page.evaluate(ms => document.getAnimations().forEach(a => { a.pause(); a.currentTime = ms; }), sec * 1000);
        await page.screenshot({ path: path.join(out, `${id}${HOR ? '-slide' : ''}-prev-${sec}.jpg`), type: 'jpeg', quality: 80 });
      }
      await page.close(); console.log('prévia', id, total); continue;
    }
    const n = Math.round(total * FPS);
    for (let i = 0; i < n; i++) {
      await page.evaluate(ms => document.getAnimations().forEach(a => { a.pause(); a.currentTime = ms; }), i * 1000 / FPS);
      await page.screenshot({ path: path.join(tmp, `${String(i).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 92 });
    }
    await page.close();
    ev.dur = total;
    fs.writeFileSync(path.join(tmp, 'eventos.json'), JSON.stringify(ev));
    execFileSync('python3.13', [path.join(root, 'trilha.py'), path.join(tmp, 'eventos.json'), path.join(tmp, 'trilha.wav')], { stdio: 'inherit' });
    const mp4 = path.join(out, `${id}${HOR ? '-slide' : ''}.mp4`);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(tmp, '%05d.jpg'), '-i', path.join(tmp, 'trilha.wav'),
      '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '19', '-preset', 'medium', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', mp4]);
    fs.rmSync(tmp, { recursive: true, force: true });
    console.log('✓', id, `${total.toFixed(1)}s`);
  }
  await browser.close();
}
main();

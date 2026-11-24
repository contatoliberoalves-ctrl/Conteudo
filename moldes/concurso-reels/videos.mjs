// Reels sem narração (1080×1920) do @concursocomlibero: texto animado na tela + trilha sintetizada (trilha.py).
// Mesma paleta do Concurso com Líbero · Plataforma, mas cada vídeo com um visual próprio (tema e layout),
// para não parecerem todos o mesmo vídeo: "papel" (claro), "verde" (degradê vivo) e "noite" (petróleo + ciano).
// Uso: node videos.mjs [id,id]   (nuvem: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY)
//      PREVIEW=2,8,15 node videos.mjs id   → só quadros soltos em saida/<id>-prev-<s>.jpg
// Saída: saida/<id>.mp4 e saida/<id>-capa.jpg
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const root = path.dirname(new URL(import.meta.url).pathname);
let chromium;
try { ({ chromium } = createRequire(path.join(root, 'package.json'))('playwright')); }
catch { ({ chromium } = createRequire('/opt/node-tools/node_modules/')('playwright')); }

const W = 1080, H = 1920, FPS = 30;
const C = { verde: '#0BA457', verdeV: '#00B85A', ciano: '#00D2C8', petroleo: '#04312C', preto: '#020B0A', menta: '#B9FFF1', papel: '#F3F7F5', tinta: '#06201C', cinza: '#5E7A74', aviso: '#FFB511' };
const FONTES = 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900&family=Inter:wght@500;600;700;800&family=JetBrains+Mono:wght@600;700&display=swap';

const TEMAS = {
  papel: { fundo: `${C.papel}`, grade: 'rgba(6,32,28,.07)', txt: C.tinta, sub: '#3D5752', heroi: C.verde, card: '#FFFFFF', cardBorda: '#D7E6E2', logoTxt: C.tinta },
  verde: { fundo: `radial-gradient(60% 45% at 0% 0%,#00C062 0%,transparent 70%),radial-gradient(70% 45% at 100% 100%,#14F0E4 0%,transparent 70%),linear-gradient(165deg,#07A657 0%,#048A63 45%,#036B5C 100%)`, grade: 'rgba(255,255,255,.08)', txt: '#FFFFFF', sub: 'rgba(255,255,255,.86)', heroi: C.petroleo, card: C.petroleo, cardBorda: 'rgba(255,255,255,.18)', logoTxt: '#FFFFFF' },
  noite: { fundo: `radial-gradient(55% 35% at 85% 8%,rgba(0,210,200,.35) 0%,transparent 70%),radial-gradient(60% 40% at 0% 100%,rgba(0,166,81,.28) 0%,transparent 70%),linear-gradient(180deg,#031614 0%,${C.preto} 100%)`, grade: 'rgba(0,210,200,.07)', txt: '#EFFFF6', sub: 'rgba(239,255,246,.72)', heroi: C.ciano, card: 'rgba(0,210,200,.07)', cardBorda: 'rgba(0,210,200,.35)', logoTxt: '#EFFFF6' },
};

// ---------- utilidades de animação ----------
// a(nome, inicio, dur) → style de animação; os nomes estão em CSS_BASE
const a = (nome, t, dur = .6, ease = 'cubic-bezier(.2,.8,.2,1)') => `animation:${nome} ${dur}s ${ease} ${t.toFixed(2)}s both;`;
const rico = s => String(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\[\[(.+?)\]\]/g, '<span class="cx">$1</span>').replace(/\{\{(.+?)\}\}/g, '<span class="hl">$1</span>');
let contas = '';
function conta(n, t, dur = 1.2) { const k = 'c' + n + 'x' + Math.round(t * 100); contas += `@keyframes ${k}{from{--n:0}to{--n:${n}}}`; return `<span class="conta" style="animation:${k} ${dur}s cubic-bezier(.15,.8,.2,1) ${t.toFixed(2)}s both"></span>`; }

const logo = (cor, px = 34) => `<div style="display:flex;align-items:center;gap:14px">
  <svg viewBox="0 0 100 100" width="${px * 1.7}" height="${px * 1.7}"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#00B85A"/><stop offset=".55" stop-color="#009A8C"/><stop offset="1" stop-color="#14E6DA"/></linearGradient></defs><rect width="100" height="100" rx="24" fill="url(#lg)"/><path d="M33 22v54h36" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M49 52l8 8 16-18" stroke="#04312C" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
  <div style="font:800 ${px * .55}px/1 Inter,sans-serif;color:${cor};letter-spacing:.02em">concurso com<br><span style="font:900 ${px * 1.05}px/0.9 'Big Shoulders Display',sans-serif;letter-spacing:.01em">Líbero</span></div></div>`;

const CSS_BASE = `*{margin:0;padding:0;box-sizing:border-box}
@property --n{syntax:'<integer>';inherits:false;initial-value:0}
.conta{counter-reset:n var(--n)}.conta::after{content:counter(n)}
body{width:${W}px;height:${H}px;overflow:hidden;font-family:Inter,sans-serif}
.tela{position:relative;width:${W}px;height:${H}px;overflow:hidden}
.cena{position:absolute;inset:0}
.bs{font-family:'Big Shoulders Display',sans-serif;font-weight:900;text-transform:uppercase;line-height:.96;letter-spacing:-.005em}
.mono{font-family:'JetBrains Mono',monospace;font-weight:700;letter-spacing:.06em}
.cx{background:var(--heroi);color:var(--cxt);padding:0 .12em;box-decoration-break:clone;-webkit-box-decoration-break:clone}
.hl{color:var(--heroi)}
@keyframes sobe{from{opacity:0;transform:translateY(60px)}to{opacity:1;transform:none}}
@keyframes desce{from{opacity:0;transform:translateY(-60px)}to{opacity:1;transform:none}}
@keyframes esq{from{opacity:0;transform:translateX(-120px)}to{opacity:1;transform:none}}
@keyframes dir{from{opacity:0;transform:translateX(120px)}to{opacity:1;transform:none}}
@keyframes pop{0%{opacity:0;transform:scale(.4)}70%{opacity:1;transform:scale(1.06)}100%{opacity:1;transform:scale(1)}}
@keyframes zoom{from{opacity:0;transform:scale(1.35)}to{opacity:1;transform:scale(1)}}
@keyframes some{from{opacity:1}to{opacity:.32}}
@keyframes carimbo{0%{opacity:0;transform:scale(2.4) rotate(-14deg)}60%{opacity:1;transform:scale(.94) rotate(-8deg)}100%{opacity:1;transform:scale(1) rotate(-8deg)}}
@keyframes larg{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes alt{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes aparece{from{opacity:0}to{opacity:1}}
@keyframes digita{from{width:0}to{width:var(--w)}}
@keyframes pisca{0%,49%{opacity:1}50%,100%{opacity:0}}
@keyframes respira{0%,100%{transform:scale(1)}50%{transform:scale(1.035)}}
@keyframes deriva{from{transform:translateY(0)}to{transform:translateY(-120px)}}`;

// ---------- peças de cena ----------
const cab = (T, serie, n) => `<div style="position:absolute;left:84px;right:84px;top:150px;display:flex;justify-content:space-between;align-items:center;z-index:5">${logo(T.logoTxt)}<span class="mono" style="font-size:24px;color:${T.sub}">${serie} · Nº ${n}</span></div>`;
const rodape = (T, txt) => `<div class="mono" style="position:absolute;left:84px;right:84px;bottom:340px;font-size:22px;color:${T.sub};z-index:5;opacity:.85">${txt}</div>`;

// ---------- os vídeos ----------
const VIDEOS = {
  // 1) Receita Federal: tema papel, número chapado, ficha de processo
  'receita-federal-edital-dezembro': { n: '01', serie: 'VEM AÍ', tema: 'papel', fonte: 'Fonte: Portaria MGI nº 5.505/2026 e Receita Federal', capa: 1.6,
    cenas: [
      { dur: 4.6, html: (t, T, ev) => { ev.impacto.push(t + .1, t + 1.1);
        return `<div style="position:absolute;left:84px;top:330px;${a('carimbo', t + .1, .5)}background:${C.aviso};color:${C.tinta};padding:10px 22px 6px" class="bs"><span style="font-size:58px">Vem aí</span></div>
        <div class="bs" style="position:absolute;left:84px;top:450px;font-size:190px;color:${T.txt};${a('esq', t + .25, .6)}">Receita<br>Federal</div>
        <div class="bs" style="position:absolute;left:70px;top:820px;font-size:520px;color:${C.verde};letter-spacing:-.03em;${a('zoom', t + 1.1, .7)}">${conta(146, t + 1.1, 1.1)}</div>
        <div class="bs" style="position:absolute;left:96px;top:1290px;font-size:92px;color:${T.txt};${a('sobe', t + 1.9)}">vagas · edital em <span style="color:${C.verde}">dezembro</span></div>`; } },
      { dur: 6.2, html: (t, T, ev) => { ev.tick.push(t + .9, t + 2.2);
        const barra = (nome, n, max, cor, d) => `<div style="${a('sobe', t + d)}"><div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font:800 54px Inter;color:${T.txt}">${nome}</span><span class="bs" style="font-size:150px;color:${cor}">${conta(n, t + d + .2, 1)}</span></div>
          <div style="height:46px;background:#E3EEEA;margin-top:8px"><div style="height:100%;width:${n / max * 100}%;background:${cor};transform-origin:left;${a('larg', t + d + .2, 1)}"></div></div></div>`;
        return `<div class="bs" style="position:absolute;left:84px;top:330px;font-size:120px;color:${T.txt};${a('desce', t + .1)}">Onde estão<br>as vagas</div>
        <div style="position:absolute;left:84px;right:84px;top:680px;display:flex;flex-direction:column;gap:70px">${barra('Analista-Tributário', 116, 116, C.verde, .9)}${barra('Auditor-Fiscal', 30, 116, C.tinta, 2.2)}</div>
        <div style="position:absolute;left:84px;right:84px;top:1290px;font:700 46px/1.3 Inter;color:${T.sub};${a('aparece', t + 3.4, .6)}">Os dois cargos são de <b style="color:${T.txt}">nível superior</b>.</div>`; } },
      { dur: 7.4, html: (t, T, ev) => { ev.tick.push(t + .9, t + 2.4, t + 3.9);
        const passo = (ok, tit, det, d) => `<div style="display:grid;grid-template-columns:96px 1fr;gap:28px;align-items:start;${a('esq', t + d)}">
          <div style="width:96px;height:96px;border-radius:50%;display:grid;place-items:center;background:${ok ? C.verde : C.aviso};font:900 54px Inter;color:${ok ? '#fff' : C.tinta}">${ok ? '✓' : '…'}</div>
          <div><div class="bs" style="font-size:86px;color:${T.txt}">${tit}</div><div style="font:600 40px/1.3 Inter;color:${T.sub};margin-top:8px">${det}</div></div></div>`;
        return `<div class="bs" style="position:absolute;left:84px;top:330px;font-size:120px;color:${T.txt};${a('desce', t + .1)}">Em que pé<br>está</div>
        <div style="position:absolute;left:84px;right:84px;top:660px;display:flex;flex-direction:column;gap:56px;padding-left:4px;border-left:0">
          ${passo(true, 'Autorizado', 'Portaria MGI nº 5.505, de 3 de julho', .9)}${passo(true, 'Banca: FGV', 'dispensa publicada em 23 de novembro', 2.4)}${passo(false, 'Edital', 'previsto para dezembro', 3.9)}</div>`; } },
      { dur: 5.2, html: (t, T, ev) => { ev.impacto.push(t + .5);
        return `<div style="position:absolute;left:84px;right:84px;top:360px;font:700 52px/1.3 Inter;color:${T.sub};${a('aparece', t + .1)}">A autorização dá até <b style="color:${T.txt}">6 meses</b> pra publicar o edital. Ou seja, no máximo até:</div>
        <div style="position:absolute;left:84px;right:84px;top:720px;background:${T.card};border:4px solid ${C.tinta};${a('pop', t + .5, .6)}">
          <div class="mono" style="background:${C.tinta};color:#fff;font-size:34px;padding:18px 28px">PRAZO FINAL</div>
          <div class="bs" style="font-size:300px;color:${C.verde};padding:30px 28px 10px;text-align:center">03/01</div>
          <div class="bs" style="font-size:90px;color:${T.txt};text-align:center;padding-bottom:30px">de 2027</div></div>`; } },
      { dur: 4.4, html: (t, T, ev) => { ev.impacto.push(t + .3);
        return `<div class="bs" style="position:absolute;left:84px;right:84px;top:560px;font-size:150px;line-height:1.04;color:${T.txt};${a('sobe', t + .2, .7)}">Quem espera<br>o edital pra<br>começar,<br><span class="cx" style="--heroi:${C.verde};--cxt:#fff">começa atrasado.</span></div>`; } },
      { dur: 5.4, cta: 'EDITAL', html: (t, T, ev) => cta(t, T, ev, 'EDITAL', 'que eu te mando o app <b>Edital com Líbero</b> pra acompanhar a Receita') },
    ] },

  // 2) Bacen: tema verde, calendário, grade de 150 vagas
  'bacen-edital-ate-30-dezembro': { n: '02', serie: 'VEM AÍ', tema: 'verde', fonte: 'Fonte: Banco Central (FAQ do concurso) e FGV', capa: 1.7,
    cenas: [
      { dur: 5, html: (t, T, ev) => { ev.impacto.push(t + .6);
        return `<div class="bs" style="position:absolute;left:84px;right:84px;top:330px;font-size:124px;color:#fff;${a('desce', t + .1)}">O edital do<br><span class="cx" style="--heroi:${C.petroleo};--cxt:#fff">Banco Central</span><br>tem data-limite</div>
        <div style="position:absolute;left:220px;width:640px;top:860px;background:#fff;border-radius:28px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.3);${a('pop', t + .6, .7)}">
          <div style="background:${C.petroleo};height:120px;display:flex;align-items:center;justify-content:center;gap:120px"><i style="width:34px;height:34px;border-radius:50%;background:#fff;display:block"></i><i style="width:34px;height:34px;border-radius:50%;background:#fff;display:block"></i></div>
          <div class="bs" style="font-size:330px;color:${C.petroleo};text-align:center;padding-top:20px">30</div>
          <div class="bs" style="font-size:96px;color:${C.verde};text-align:center;padding-bottom:36px">dezembro</div></div>`; } },
      { dur: 6.2, html: (t, T, ev) => { ev.tick.push(t + .8); ev.impacto.push(t + 2.6);
        const q = Array.from({ length: 150 }, (_, i) => `<i style="display:block;aspect-ratio:1;border-radius:6px;background:#fff;${a('pop', t + .8 + i * .012, .35)}"></i>`).join('');
        return `<div style="position:absolute;left:84px;right:84px;top:330px;display:grid;grid-template-columns:repeat(15,1fr);gap:9px">${q}</div>
        <div class="bs" style="position:absolute;left:84px;top:1010px;font-size:330px;color:#fff;${a('zoom', t + 2.6, .6)}">${conta(150, t + 2.6, .9)}</div>
        <div class="bs" style="position:absolute;left:84px;top:1310px;font-size:84px;color:#fff;${a('sobe', t + 3.1)}">vagas · <span style="color:${C.petroleo}">banca FGV</span></div>`; } },
      { dur: 7, html: (t, T, ev) => { ev.tick.push(t + 1, t + 2.6, t + 4.2);
        const etapa = (data, txt, cor, d, alerta) => `<div style="display:flex;flex-direction:column;gap:18px;align-items:flex-start;${a('sobe', t + d)}">
          <div class="bs" style="font-size:92px;color:${alerta ? C.petroleo : '#fff'};${alerta ? `background:${C.aviso};padding:6px 18px 0` : ''}">${data}</div>
          <div style="font:700 42px/1.25 Inter;color:#fff;max-width:280px">${txt}</div></div>`;
        return `<div class="bs" style="position:absolute;left:84px;top:330px;font-size:120px;color:#fff;${a('desce', t + .1)}">A linha<br>do tempo</div>
        <div style="position:absolute;left:84px;right:84px;top:860px;height:10px;background:rgba(255,255,255,.3)"><div style="height:100%;background:#fff;transform-origin:left;${a('larg', t + .6, 3.8, 'linear')}"></div></div>
        <div style="position:absolute;left:84px;right:84px;top:920px;display:grid;grid-template-columns:repeat(3,1fr);gap:24px">
          ${etapa('Nov', 'FGV definida como banca', '#fff', 1)}${etapa('Até 30/12', 'publicação do edital', C.aviso, 2.6, true)}${etapa('Depois', 'inscrições e data da prova', '#fff', 4.2)}</div>`; } },
      { dur: 4.6, html: (t, T, ev) => { ev.impacto.push(t + .3);
        return `<div style="position:absolute;left:84px;right:84px;top:520px;background:${C.petroleo};padding:60px 56px;${a('esq', t + .2, .7)}"><div class="bs" style="font-size:136px;color:#fff">Quem começa<br>antes do edital<br><span style="color:${C.ciano}">chega com a<br>base pronta.</span></div></div>`; } },
      { dur: 5.4, html: (t, T, ev) => cta(t, T, ev, 'EDITAL', 'que eu te mando o app <b>Edital com Líbero</b> pra acompanhar o Bacen') },
    ] },

  // 3) ENAC: tema noite, carimbo de regra nova, antes x agora e 4 mudanças em cartões
  'enac-regra-nova-primeira-fase': { n: '03', serie: 'REGRA NOVA', tema: 'noite', fonte: 'Fonte: CNJ, sessão de 18/08/2026 (nova resolução dos concursos de cartório)', capa: 1.8,
    cenas: [
      { dur: 5, html: (t, T, ev) => { ev.impacto.push(t + .15, t + 1.2);
        return `<div style="position:absolute;right:84px;top:300px;border:10px solid ${C.ciano};outline:4px solid ${C.ciano};outline-offset:8px;color:${C.ciano};padding:14px 26px 6px;${a('carimbo', t + 1.2, .5)}" class="bs"><span style="font-size:76px">Regra nova</span></div>
        <div class="bs" style="position:absolute;left:84px;right:84px;top:560px;font-size:200px;color:#EFFFF6;${a('sobe', t + .15, .6)}">O ENAC<br>pode virar<br>a sua<br><span class="cx" style="--heroi:${C.ciano};--cxt:${C.preto}">1ª fase</span></div>`; } },
      { dur: 6.4, html: (t, T, ev) => { ev.tick.push(t + .5, t + 2.3); ev.impacto.push(t + 1.6);
        return `<div class="mono" style="position:absolute;left:84px;top:330px;font-size:32px;color:${C.ciano};${a('aparece', t + .1)}">CNJ · 18 DE AGOSTO DE 2026</div>
        <div style="position:absolute;left:84px;right:84px;top:420px;border:3px solid rgba(239,255,246,.25);padding:44px;${a('esq', t + .5)}">
          <div class="mono" style="font-size:28px;color:${T.sub}">ANTES</div><div class="bs" style="font-size:110px;color:#EFFFF6;margin-top:14px">Resolução 81<br>de 2009</div>
          <div style="position:absolute;left:30px;right:30px;top:58%;height:12px;background:#FF5A5F;transform-origin:left;${a('larg', t + 1.6, .5)}"></div></div>
        <div style="position:absolute;left:84px;right:84px;top:900px;border:3px solid ${C.ciano};background:rgba(0,210,200,.08);padding:44px;${a('dir', t + 2.3)}">
          <div class="mono" style="font-size:28px;color:${C.ciano}">AGORA</div><div class="bs" style="font-size:110px;color:#EFFFF6;margin-top:14px">Nova resolução<br>dos concursos<br>de cartório</div></div>`; } },
      { dur: 8.2, html: (t, T, ev) => { ev.tick.push(t + .5, t + 3.6);
        return mudancas(t, T, [['01', 'ENAC vira requisito', 'obrigatório pra se inscrever em concurso de **provimento** e de **remoção**', .5], ['02', 'Pode trocar a prova objetiva', 'se o edital do tribunal previr, quem foi aprovado no ENAC vai **direto pra discursiva**', 3.6]]); } },
      { dur: 8.2, html: (t, T, ev) => { ev.tick.push(t + .5, t + 3.6);
        return mudancas(t, T, [['03', 'Nota não desempata', 'o ENAC só **habilita**: não classifica e não serve de critério de desempate', .5], ['04', 'Concurso em até 365 dias', 'e prova oral **gravada em áudio e vídeo**', 3.6]]); } },
      { dur: 4.6, html: (t, T, ev) => { ev.impacto.push(t + .3);
        return `<div class="bs" style="position:absolute;left:84px;right:84px;top:600px;font-size:170px;color:#EFFFF6;${a('zoom', t + .3, .6)}">Passar no ENAC<br><span style="color:${C.ciano}">deixou de ser<br>detalhe.</span></div>`; } },
      { dur: 5.4, html: (t, T, ev) => cta(t, T, ev, 'ENAC', 'que eu te mando o <b>Cronograma ENAC</b> pra estudar desde já') },
    ] },
};

function mudancas(t, T, itens) {
  return `<div style="position:absolute;left:84px;right:84px;top:330px;display:flex;flex-direction:column;gap:46px">${itens.map(([n, tit, det, d]) => `
    <div style="border:3px solid ${T.cardBorda};background:${T.card};padding:44px 44px 48px;${a('sobe', t + d)}">
      <div style="display:flex;gap:30px;align-items:baseline"><span class="bs" style="font-size:150px;color:${C.ciano}">${n}</span><span class="bs" style="font-size:88px;color:#EFFFF6">${tit}</span></div>
      <div style="font:600 46px/1.32 Inter;color:${T.sub};margin-top:18px">${rico(det).replace(/<b>/g, '<b style="color:#EFFFF6">')}</div></div>`).join('')}</div>`;
}

function cta(t, T, ev, palavra, resto) {
  ev.tick.push(t + .9); ev.impacto.push(t + 2.4);
  const claro = T === TEMAS.papel, cartao = claro ? '#fff' : 'rgba(255,255,255,.96)';
  return `<div class="bs" style="position:absolute;left:84px;right:84px;top:420px;font-size:150px;color:${T.txt};${a('desce', t + .1)}">Comenta</div>
  <div style="position:absolute;left:84px;right:84px;top:620px;background:${cartao};border-radius:40px;padding:34px 40px;display:flex;align-items:center;gap:26px;box-shadow:0 24px 60px rgba(0,0,0,.18);${a('pop', t + .5, .5)}">
    <div style="width:84px;height:84px;border-radius:50%;background:linear-gradient(135deg,#00B85A,#14E6DA);flex:none"></div>
    <div style="font:800 96px Inter;color:${C.tinta};white-space:nowrap;overflow:hidden;--w:${palavra.length * .7}em;${a('digita', t + .9, 1.1, `steps(${palavra.length})`)}">${palavra}</div>
    <div style="width:6px;height:90px;background:${C.verde};animation:pisca .9s step-end ${t.toFixed(2)}s 8 both"></div></div>
  <div style="position:absolute;left:84px;right:84px;top:860px;font:700 56px/1.3 Inter;color:${T.sub};${a('aparece', t + 2.4)}">${resto.replace(/<b>/g, `<b style="color:${T.txt}">`)}</div>`;
}

function montar(id, v) {
  contas = '';
  const T = TEMAS[v.tema], ev = { whoosh: [], tick: [], impacto: [] };
  let t = 0; const partes = [];
  const total = v.cenas.reduce((s, c) => s + c.dur, 0);
  v.cenas.forEach((c, i) => {
    const fade = .3, A = (fade / c.dur * 100).toFixed(2), B = (100 - fade / c.dur * 100).toFixed(2);
    if (i) ev.whoosh.push(t);
    partes.push(`<style>@keyframes s${i}{0%{opacity:0}${A}%{opacity:1}${B}%{opacity:1}100%{opacity:${i === v.cenas.length - 1 ? 1 : 0}}}</style>
      <div class="cena" style="animation:s${i} ${c.dur}s linear ${t}s both">${c.html(t, T, ev)}</div>`);
    t += c.dur;
  });
  const grade = `<div style="position:absolute;inset:0;background-image:linear-gradient(${T.grade} 2px,transparent 2px),linear-gradient(90deg,${T.grade} 2px,transparent 2px);background-size:90px 90px;animation:deriva ${total}s linear 0s both"></div>`;
  const prog = `<div style="position:absolute;left:84px;right:84px;top:262px;height:6px;background:${T.grade};z-index:5"><div style="height:100%;background:${T.heroi === C.petroleo ? '#fff' : T.heroi};transform-origin:left;animation:larg ${total}s linear 0s both"></div></div>`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet"><style>${CSS_BASE}${contas}:root{--heroi:${T.heroi};--cxt:#fff}</style></head>
    <body><div class="tela" style="background:${T.fundo};color:${T.txt}">${grade}${partes.join('')}${cab(T, v.serie, v.n)}${prog}${rodape(T, v.fonte)}</div></body></html>`;
  return { html, total, ev };
}

async function main() {
  const so = process.argv[2]?.split(',');
  const launch = {};
  if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
  if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
  const browser = await chromium.launch(launch);
  const out = path.join(root, 'saida'); fs.mkdirSync(out, { recursive: true });
  for (const [id, v] of Object.entries(VIDEOS)) {
    if (so && !so.includes(id)) continue;
    const { html, total, ev } = montar(id, v);
    const page = await browser.newPage({ viewport: { width: W, height: H } });
    await page.setContent(html); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(600);
    const ir = ms => page.evaluate(ms => document.getAnimations().forEach(x => { x.pause(); x.currentTime = ms; }), ms);
    if (process.env.PREVIEW) {
      for (const sec of process.env.PREVIEW.split(',').map(Number)) { await ir(sec * 1000); await page.screenshot({ path: path.join(out, `${id}-prev-${sec}.jpg`), type: 'jpeg', quality: 80 }); }
      console.log('prévia', id, total.toFixed(1) + 's'); await page.close(); continue;
    }
    await ir(v.capa * 1000); await page.screenshot({ path: path.join(out, `${id}-capa.jpg`), type: 'jpeg', quality: 92 });
    const tmp = path.join(root, 'build', id); fs.rmSync(tmp, { recursive: true, force: true }); fs.mkdirSync(tmp, { recursive: true });
    const n = Math.round(total * FPS);
    for (let i = 0; i < n; i++) { await ir(i * 1000 / FPS); await page.screenshot({ path: path.join(tmp, `${String(i).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 90 }); }
    await page.close();
    ev.dur = total; fs.writeFileSync(path.join(tmp, 'eventos.json'), JSON.stringify(ev));
    execFileSync('python3', [path.join(root, 'trilha.py'), path.join(tmp, 'eventos.json'), path.join(tmp, 'trilha.wav')], { stdio: 'inherit' });
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(tmp, '%05d.jpg'), '-i', path.join(tmp, 'trilha.wav'), '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11',
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'medium', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-t', total.toFixed(3), '-movflags', '+faststart', path.join(out, `${id}.mp4`)]);
    fs.rmSync(tmp, { recursive: true, force: true });
    console.log('✓', id, total.toFixed(1) + 's');
  }
  await browser.close();
}
main();

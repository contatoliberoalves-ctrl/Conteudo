// Carrossel "Mentoria VDE na repescagem" em versão jogo (gamificada, didática e com motion), na identidade do PodConst.
// Gera, por página, um PNG (quadro final) e um MP4 de 6 s (animação), pra postar como carrossel misto.
// Uso: node mentoria_game.mjs [pagina]   (nuvem: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node mentoria_game.mjs)
// Saída: saida/vde-mentoria-game/{1..10}.png e {1..10}.mp4
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const req = createRequire(import.meta.url);
let chromium; try { ({ chromium } = req('playwright')); } catch { ({ chromium } = req('/opt/node-tools/node_modules/playwright')); }

const root = path.dirname(new URL(import.meta.url).pathname);
const so = process.argv[2] ? Number(process.argv[2]) : 0;
const W = 1080, H = 1350, DUR = 6, FPS = 30, TOTAL = 10;
const AM = '#f7f400', MG = '#e224d6', NV = '#0b1a4a';
const AZUL = 'radial-gradient(130% 100% at 20% 0%,#0d44bd 0%,#0a3aa6 40%,#0a2a7c 100%)';
const MAG = 'radial-gradient(120% 90% at 30% 20%,#ea2ee0 0%,#d61ccf 55%,#c515c2 100%)';
const NAVY = 'radial-gradient(120% 90% at 80% 0%,#132a7a 0%,#0a1440 70%)';
const BB = "font-family:'Bebas Neue';", PX = "font-family:'Press Start 2P';", SG = "font-family:'Space Grotesk';";
const FONTES = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Grotesk:wght@400;500;600;700&family=Unbounded:wght@900&family=Press+Start+2P&display=swap';

const CSS = `*{box-sizing:border-box;margin:0;padding:0}body{background:#000}
.tela{position:relative;width:${W}px;height:${H}px;overflow:hidden;color:#fff;${SG}}
.grade{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.05) 2px,transparent 2px),linear-gradient(90deg,rgba(255,255,255,.05) 2px,transparent 2px);background-size:54px 54px;animation:grade 6s linear infinite}
@keyframes grade{to{background-position:0 54px,0 54px}}
@keyframes entra{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:none}}
@keyframes bate{0%{opacity:0;transform:scale(1.6) rotate(var(--r,0deg))}60%{opacity:1;transform:scale(.94) rotate(var(--r,0deg))}100%{opacity:1;transform:scale(1) rotate(var(--r,0deg))}}
@keyframes pop{0%{opacity:0;transform:scale(0)}70%{opacity:1;transform:scale(1.18)}100%{opacity:1;transform:scale(1)}}
@keyframes pulsa{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes pisca{0%,55%{opacity:1}56%,100%{opacity:0}}
@keyframes flutua{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@keyframes enche{from{width:0}}
@keyframes vira{from{opacity:0;transform:perspective(1400px) rotateY(80deg)}to{opacity:1;transform:perspective(1400px) rotateY(0)}}
@keyframes brilho{0%{transform:translateX(-140%) skewX(-20deg)}40%,100%{transform:translateX(260%) skewX(-20deg)}}
@keyframes traca{from{stroke-dashoffset:var(--len)}to{stroke-dashoffset:0}}
@keyframes sobe{0%{opacity:0;transform:translateY(0)}20%{opacity:1}100%{opacity:0;transform:translateY(-120px)}}
@keyframes some{to{opacity:0}}
.a{opacity:0;animation:entra .6s cubic-bezier(.2,.8,.2,1) forwards}
.b{opacity:0;animation:bate .55s cubic-bezier(.2,.8,.2,1) forwards}
.p{opacity:0;animation:pop .45s cubic-bezier(.2,.8,.2,1) forwards}
.v{opacity:0;animation:vira .7s cubic-bezier(.2,.8,.2,1) forwards}`;
const d = s => `animation-delay:${s}s;`;

// Logo do PodConst (mesmo desenho do kit).
const LOGO = (px, cor = '#ff1ff0') => `<div style="font-family:'Unbounded',sans-serif;font-weight:900;font-size:${px}px;line-height:.84;letter-spacing:-.02em;color:${cor};text-shadow:.05em .06em 0 #0b1a4a;display:flex;flex-direction:column;align-items:flex-start;transform:rotate(-9deg);"><div style="display:flex;align-items:center;margin-left:.62em;"><span>P</span><span style="width:.72em;height:.72em;border-radius:50%;background:${cor};box-shadow:.05em .06em 0 #0b1a4a;display:flex;align-items:center;justify-content:center;gap:.045em;margin:0 .01em;">${[.16, .3, .44, .3, .18].map(h => `<span style="width:.05em;height:${h}em;border-radius:.03em;background:#fff;"></span>`).join('')}</span><span>D</span></div><div>CONST</div></div>`;

// Ícones (traço branco, 24×24).
const IC = {
  olho: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3.2"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
  live: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3"/><circle cx="7" cy="10" r="1.2" fill="currentColor"/>',
  livro: '<path d="M4 4h7a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4z"/><path d="M20 4h-7a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h7z"/>',
  relogio: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>',
  zap: '<path d="M5 19l1.4-4A8 8 0 1 1 9 18.6z"/><path d="M9.5 9.5c.3 1.8 2.2 3.8 4 4l1.2-1.2 2 1.2c-.4 1.3-1.4 2-2.6 1.8-3-.5-5.6-3.1-6-6-.2-1.2.5-2.2 1.8-2.6l1.2 2z"/>',
  lupa: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21M8 10.5h5M10.5 8v5"/>',
  mapa: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
  trofeu: '<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 14v4M8 21h8M9 18h6"/>',
};
const ic = (n, px = 60, cor = '#fff', sw = 2) => `<svg width="${px}" height="${px}" viewBox="0 0 24 24" fill="none" stroke="${cor}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" style="color:${cor};display:block">${IC[n]}</svg>`;
const coracao = (px, cheio = true, cor = MG) => `<svg width="${px}" height="${px}" viewBox="0 0 7 6" shape-rendering="crispEdges" style="display:block"><path d="M1 0h2v1h1V0h2v1h1v2H6v1H5v1H4v1H3V5H2V4H1V3H0V1h1z" fill="${cheio ? cor : 'none'}" stroke="${cheio ? 'none' : 'rgba(255,255,255,.45)'}" stroke-width=".35"/></svg>`;

// HUD de jogo: arrobas no topo, vidas, fase; barra de XP no rodapé (progresso do carrossel).
const hud = (n, claro = false) => {
  const c = claro ? NV : '#fff', sub = claro ? 'rgba(11,26,74,.55)' : 'rgba(255,255,255,.7)';
  return `<div style="position:absolute;top:46px;left:60px;right:60px;display:flex;justify-content:space-between;align-items:center;z-index:9;">
    <div style="display:flex;gap:16px;font-size:24px;color:${c}"><span><b>@libero</b>filho</span><span><b>@natalia</b>valenca</span><span><b>@pod</b>.const</span></div>
    <div style="${PX}font-size:18px;color:${claro ? MG : AM}">FASE ${String(n).padStart(2, '0')}/${TOTAL}</div></div>
  <div style="position:absolute;bottom:44px;left:60px;right:60px;display:flex;align-items:center;gap:20px;z-index:9;">
    <span style="${PX}font-size:16px;color:${sub}">XP</span>
    <div style="flex:1;height:22px;border:3px solid ${c};padding:3px;"><div style="height:100%;width:${n / TOTAL * 100}%;background:${claro ? MG : AM};animation:enche 1.6s .2s cubic-bezier(.2,.8,.2,1) both;"></div></div>
    <span style="${PX}font-size:16px;color:${c}">${n === TOTAL ? 'MAX' : 'ARRASTA ▶'}</span></div>`;
};
const tela = (fundo, corpo, n, claro = false) => `<div class="tela" style="background:${fundo};color:${claro ? NV : '#fff'}"><div class="grade" style="${claro ? 'background-image:linear-gradient(rgba(11,26,74,.05) 2px,transparent 2px),linear-gradient(90deg,rgba(11,26,74,.05) 2px,transparent 2px)' : ''}"></div>${corpo}${hud(n, claro)}</div>`;
const T = (t, px, extra = '') => `<div style="${BB}font-size:${px}px;line-height:.9;${extra}">${t}</div>`;
const tag = (t, fundo, cor, px = 20) => `<span style="${SG}font-weight:700;letter-spacing:.18em;font-size:${px * 1.45}px;line-height:1.3;background:${fundo};color:${cor};padding:10px 16px;display:inline-block">${t}</span>`;
const MARCA = (t, f = MG, c = '#fff') => `<span style="background:${f};color:${c};padding:0 .12em;">${t}</span>`;
const pixels = (cor, n = 14, seed = 1) => { let s = seed, r = () => (s = (s * 9301 + 49297) % 233280) / 233280; return Array.from({ length: n }, () => `<div style="position:absolute;left:${r() * 100}%;top:${10 + r() * 80}%;width:${10 + r() * 14 | 0}px;height:${10 + r() * 14 | 0}px;background:${cor};opacity:0;animation:sobe ${2.5 + r() * 2}s ${r() * 3}s linear infinite"></div>`).join(''); };

// Os 8 power-ups da mentoria: nome, ícone, efeito (o que resolve).
const PU = [
  ['Acompanhamento de perto', 'olho', 'Alguém olha o seu estudo e corrige a rota antes da prova.'],
  ['Acesso a gente', 'chat', 'Você fala com quem dá a aula: Líbero e Natália.'],
  ['Encontros ao vivo', 'live', 'Um tema por encontro, e você tira as suas dúvidas na hora.'],
  ['Materiais extras', 'livro', 'Material de apoio a mais pra fixar e revisar.'],
  ['Simulado extra', 'relogio', 'Você treina a prova antes da prova.'],
  ['Grupo no WhatsApp', 'zap', 'Avisos e dúvidas do dia a dia, junto com a turma.'],
  ['Análise da prova', 'lupa', 'Saiu da prova? A gente analisa com você.'],
  ['Plano de virada', 'mapa', 'Entender o que te reprovou e traçar um plano.'],
];
const CORES_PU = [MG, AM, '#3ad1ff', MG, AM, '#3ad1ff', MG, AM];

const carta = (i, delay, rot) => {
  const [nome, icone, efeito] = PU[i], cor = CORES_PU[i], escuro = cor === AM || cor === '#3ad1ff';
  return `<div class="v" style="${d(delay)}width:450px;"><div style="transform:rotate(${rot}deg);"><div style="animation:flutua 3s ${delay}s ease-in-out infinite;">
  <div style="position:relative;overflow:hidden;background:#fff;color:${NV};border:6px solid ${NV};border-radius:30px;box-shadow:14px 14px 0 ${NV};">
    <div style="background:${cor};padding:26px 24px 22px;display:flex;justify-content:space-between;align-items:flex-start;border-bottom:6px solid ${NV};">
      <div style="width:120px;height:120px;border-radius:24px;background:${NV};display:grid;place-items:center;">${ic(icone, 74, cor)}</div>
      <div style="text-align:right;${PX}font-size:15px;line-height:1.7;color:${escuro ? NV : '#fff'}">POWER-UP<br><span style="font-size:30px">${String(i + 1).padStart(2, '0')}</span></div></div>
    <div style="padding:26px 28px 34px;">
      <div style="${BB}font-size:66px;line-height:.92;">${nome}</div>
      <div style="${PX}font-size:13px;color:${MG};margin:18px 0 10px;">EFEITO</div>
      <div style="font-weight:600;font-size:32px;line-height:1.28;">${efeito}</div></div>
    <div style="position:absolute;top:0;bottom:0;width:30%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent);animation:brilho 3s ${delay + .8}s ease-in-out infinite;"></div>
  </div></div></div></div>`;
};
const paginaCartas = (n, a, fundo, titulo) => tela(fundo, `${pixels('rgba(255,255,255,.35)', 10, n)}
  <div style="position:absolute;left:70px;right:70px;top:140px;">
    <div class="a">${tag(`COLETADOS ${a + 2}/8`, AM, NV, 18)}</div>
    <div class="a" style="${d(.15)}margin-top:22px;">${T(titulo, 104)}</div></div>
  <div style="position:absolute;left:60px;right:60px;top:420px;display:flex;justify-content:space-between;align-items:flex-start;">
    ${carta(a, .6, -3)}<div style="margin-top:70px">${carta(a + 1, 1.1, 3)}</div></div>`, n);

const P = [];
// 1 · Capa: +1 vida
P.push(tela(AZUL, `${pixels('rgba(247,244,0,.5)', 18, 7)}
  <div style="position:absolute;left:0;right:0;top:190px;display:flex;flex-direction:column;align-items:center;text-align:center;">
    <div class="a">${tag('MÉTODO VDE · REPESCAGEM OAB', 'rgba(11,26,74,.6)', AM, 18)}</div>
    <div class="a" style="${d(.2)}margin-top:44px;background:${NV};font-weight:700;font-size:50px;padding:8px 22px;">A mentoria que vai</div>
    <div class="b" style="${d(.5)}--r:-2deg;margin-top:12px;background:${MG};${BB}font-size:190px;line-height:.9;padding:22px 34px 4px;">TE APROVAR</div>
    <div class="b" style="${d(.85)}--r:1deg;margin-top:12px;background:${AM};color:${NV};${BB}font-size:124px;line-height:.9;padding:16px 28px 2px;">NA REPESCAGEM</div>
    <div class="p" style="${d(1.4)}margin-top:70px;display:flex;align-items:center;gap:22px;background:#fff;color:${NV};border:5px solid ${NV};box-shadow:10px 10px 0 ${NV};padding:18px 30px;">
      <div style="animation:flutua 1.2s 1.8s ease-in-out infinite">${coracao(64)}</div>
      <div style="text-align:left;"><div style="${PX}font-size:22px;color:${MG}">+1 VIDA</div><div style="font-weight:700;font-size:30px;margin-top:8px;">Repescagem é sua nova chance</div></div></div>
    <div style="${PX}font-size:24px;color:${AM};margin-top:60px;opacity:0;animation:entra .3s 1.9s forwards,pisca 1s 2.2s steps(1) infinite;">▶ PRESS START</div></div>
  <div class="p" style="${d(1.6)}position:absolute;bottom:110px;right:80px;">${LOGO(40)}</div>`, 1));

// 2 · Diagnóstico: onde você perdeu pontos?
const danos = ['Peça: escolha e estrutura', 'Fundamentação', 'Interpretação do enunciado', 'Tempo de prova'];
P.push(tela(NAVY, `
  <div style="position:absolute;left:80px;right:80px;top:150px;">
    <div class="a">${tag('RELATÓRIO DA FASE ANTERIOR', MG, '#fff', 18)}</div>
    <div class="a" style="${d(.2)}margin-top:26px;">${T(`ANTES DE JOGAR<br>DE NOVO, DESCUBRA<br>ONDE VOCÊ ${MARCA('PERDEU PONTOS', AM, NV)}`, 112)}</div>
    <div style="margin-top:56px;display:flex;flex-direction:column;gap:20px;">
      ${danos.map((t, i) => `<div class="a" style="${d(.7 + i * .25)}display:grid;grid-template-columns:1fr 330px 90px;align-items:center;gap:22px;background:rgba(255,255,255,.06);border:3px solid rgba(255,255,255,.18);padding:20px 24px;">
        <span style="font-weight:700;font-size:32px;">${t}</span>
        <span style="height:26px;border:3px solid #fff;padding:3px;"><span style="display:block;height:100%;background:repeating-linear-gradient(90deg,${MG} 0 18px,transparent 18px 26px);width:100%;"></span></span>
        <span style="${PX}font-size:26px;color:${AM};text-align:right;animation:pulsa 1.2s ${1 + i * .3}s ease-in-out infinite;">???</span></div>`).join('')}</div>
    <div class="a" style="${d(1.9)}margin-top:44px;font-weight:600;font-size:36px;line-height:1.35;max-width:880px;">Na mentoria, a gente <b style="color:${AM}">descobre isso com você</b> e monta o plano da próxima fase.</div></div>`, 2));

// 3 · Mapa da mentoria: trilha com 8 checkpoints até a aprovação
const nos = [[160, 560], [420, 520], [680, 560], [900, 680], [700, 820], [440, 840], [190, 900], [330, 1060]];
const trilha = 'M160 560 C290 500 330 500 420 520 S600 600 680 560 S900 600 900 680 S800 820 700 820 S520 860 440 840 S240 840 190 900 S220 1040 330 1060 S700 1090 860 1050';
P.push(tela(MAG, `
  <div style="position:absolute;left:80px;right:80px;top:150px;">
    <div class="a">${tag('MAPA DA MENTORIA', NV, AM, 18)}</div>
    <div class="a" style="${d(.2)}margin-top:24px;">${T(`8 POWER-UPS ATÉ<br>A ${MARCA('APROVAÇÃO', AM, NV)}`, 118)}</div></div>
  <svg width="${W}" height="${H}" style="position:absolute;inset:0;">
    <path d="${trilha}" fill="none" stroke="rgba(11,26,74,.35)" stroke-width="34" stroke-linecap="round"/>
    <path d="${trilha}" fill="none" stroke="${NV}" stroke-width="10" stroke-dasharray="2 26" stroke-linecap="round" style="--len:2400;stroke-dashoffset:2400;animation:traca 2.6s .5s linear forwards" pathLength="2400"/></svg>
  ${nos.map(([x, y], i) => `<div class="p" style="${d(.6 + i * .3)}position:absolute;left:${x - 52}px;top:${y - 52}px;width:104px;height:104px;border-radius:50%;background:${CORES_PU[i] === MG ? NV : CORES_PU[i]};border:6px solid ${NV};display:grid;place-items:center;box-shadow:6px 6px 0 ${NV};">${ic(PU[i][1], 50, CORES_PU[i] === MG ? '#fff' : NV)}</div>
    <div class="a" style="${d(.75 + i * .3)}position:absolute;left:${x - 110}px;top:${y + 58}px;width:230px;text-align:center;font-weight:700;font-size:26px;line-height:1.1;">${PU[i][0]}</div>`).join('')}
  <div class="b" style="${d(3.1)}position:absolute;left:800px;top:960px;width:150px;height:150px;border-radius:50%;background:${AM};border:7px solid ${NV};box-shadow:8px 8px 0 ${NV};display:grid;place-items:center;"><div style="animation:flutua 1.4s 3.5s ease-in-out infinite">${ic('trofeu', 86, NV, 2.2)}</div></div>
  <div class="a" style="${d(3.3)}position:absolute;left:760px;top:1125px;width:230px;text-align:center;${SG}font-weight:700;letter-spacing:.14em;font-size:26px;color:${NV};">APROVAÇÃO</div>`, 3));

// 4 a 7 · Cartas de power-up, duas por página
P.push(paginaCartas(4, 0, AZUL, `NÍVEL 1: ${MARCA('PERTO DE VOCÊ')}`));
P.push(paginaCartas(5, 2, NAVY, `NÍVEL 2: ${MARCA('TREINO EXTRA', AM, NV)}`));
P.push(paginaCartas(6, 4, MAG, `NÍVEL 3: ${MARCA('NA RETA FINAL', NV)}`));
P.push(paginaCartas(7, 6, AZUL, `NÍVEL 4: ${MARCA('DEPOIS DA PROVA', AM, NV)}`));

// 8 · Quiz didático: qual power-up resolve?
const quiz = [['“Travei numa dúvida às 22h.”', 5], ['“Não sei por que reprovei.”', 7], ['“Nunca treinei no tempo da prova.”', 4]];
P.push(tela('linear-gradient(165deg,#ffffff 0%,#f3f5f9 50%,#e2e8f2 100%)', `
  <div style="position:absolute;left:80px;right:80px;top:150px;">
    <div class="a">${tag('QUIZ RELÂMPAGO', MG, '#fff', 18)}</div>
    <div class="a" style="${d(.2)}margin-top:24px;">${T(`QUAL POWER-UP<br>${MARCA('RESOLVE?', AM, NV)}`, 130)}</div>
    <div style="margin-top:50px;display:flex;flex-direction:column;gap:30px;">
      ${quiz.map(([q, k], i) => { const t0 = .7 + i * .9; return `<div class="a" style="${d(t0)}display:grid;grid-template-columns:1fr 80px 1fr;align-items:center;gap:10px;">
        <div style="background:#fff;border:5px solid ${NV};box-shadow:8px 8px 0 ${NV};border-radius:24px 24px 24px 4px;padding:22px 24px;font-weight:700;font-size:31px;line-height:1.2;">${q}</div>
        <div style="${BB}font-size:80px;text-align:center;color:${MG};">→</div>
        <div class="p" style="${d(t0 + .45)}display:flex;align-items:center;gap:16px;background:${CORES_PU[k] === MG ? MG : CORES_PU[k]};color:${CORES_PU[k] === MG ? '#fff' : NV};border:5px solid ${NV};box-shadow:8px 8px 0 ${NV};border-radius:22px;padding:16px 20px;">
          <div style="flex:none;width:70px;height:70px;border-radius:16px;background:${NV};display:grid;place-items:center;">${ic(PU[k][1], 44, CORES_PU[k])}</div>
          <div style="${BB}font-size:44px;line-height:.92;">${PU[k][0]}</div></div></div>`; }).join('')}</div>
    <div class="a" style="${d(3.6)}margin-top:46px;display:flex;align-items:center;gap:16px;font-weight:700;font-size:32px;">${coracao(40)}Acertou as 3? Você já entendeu a mentoria.</div></div>`, 8, true));

// 9 · Inventário completo
P.push(tela(NAVY, `${pixels('rgba(247,244,0,.45)', 16, 3)}
  <div style="position:absolute;left:80px;right:80px;top:150px;">
    <div class="a">${tag('INVENTÁRIO', AM, NV, 18)}</div>
    <div class="a" style="${d(.2)}margin-top:24px;">${T(`8/8 ${MARCA('DESBLOQUEADOS')}`, 130)}</div>
    <div style="margin-top:50px;display:grid;grid-template-columns:repeat(4,1fr);gap:22px;">
      ${PU.map(([nome, icone], i) => `<div class="p" style="${d(.6 + i * .22)}position:relative;background:rgba(255,255,255,.07);border:4px solid ${CORES_PU[i]};border-radius:22px;padding:24px 12px 18px;display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center;height:250px;">
        ${ic(icone, 70, CORES_PU[i])}<div style="font-weight:700;font-size:23px;line-height:1.15;">${nome}</div>
        <div style="position:absolute;top:-16px;right:-12px;width:46px;height:46px;border-radius:50%;background:${AM};color:${NV};display:grid;place-items:center;font-weight:700;font-size:26px;border:4px solid ${NV};">✓</div></div>`).join('')}</div>
    <div class="a" style="${d(2.6)}margin-top:46px;background:#fff;color:${NV};border:5px solid ${NV};box-shadow:10px 10px 0 ${MG};padding:24px 28px;display:flex;align-items:center;gap:22px;">
      <div style="${SG}font-weight:700;letter-spacing:.16em;font-size:28px;color:${MG};white-space:nowrap">NÍVEL</div>
      <div style="${BB}font-size:64px;line-height:.9;">PRONTO PRA PROVA</div></div></div>`, 9));

// 10 · Continue?
P.push(tela(MAG, `${pixels('rgba(255,255,255,.5)', 18, 11)}
  <div style="position:absolute;left:0;right:0;top:190px;display:flex;flex-direction:column;align-items:center;text-align:center;">
    <div class="b" style="${d(.2)}${PX}font-size:64px;color:${AM};text-shadow:6px 6px 0 ${NV};">CONTINUE?</div>
    <div class="a" style="${d(.6)}margin-top:50px;">${T('QUER O LINK<br>DA MENTORIA?', 160)}</div>
    <div class="a" style="${d(1)}margin-top:30px;font-weight:600;font-size:38px;">Comenta a palavra abaixo e recebe no direct.</div>
    <div class="p" style="${d(1.5)}margin-top:56px;"><div style="animation:flutua 1.6s 2s ease-in-out infinite;display:flex;align-items:center;gap:20px;background:${NV};border:6px solid ${NV};box-shadow:12px 12px 0 ${AM};padding:26px 40px;">
      <span style="${PX}font-size:24px;color:${AM};animation:pisca 1s 2s steps(1) infinite">▶</span><span style="font-weight:700;font-size:44px;">Comente</span>
      <span style="background:${AM};color:${NV};${BB}font-size:70px;line-height:.9;padding:10px 18px 0;">MENTORIA</span></div></div>
    <div class="a" style="${d(2)}margin-top:60px;display:flex;gap:14px;">${coracao(56, true, AM)}${coracao(56, true, AM)}${coracao(56, false)}</div>
    <div class="a" style="${d(2.1)}${SG}font-weight:700;letter-spacing:.18em;font-size:28px;margin-top:20px;">MÉTODO VDE · REPESCAGEM</div></div>
  <div class="p" style="${d(1.8)}position:absolute;bottom:110px;left:50%;margin-left:-110px;">${LOGO(44)}</div>`, 10));

// Render: PNG do quadro final e MP4 quadro a quadro (animações pausadas e posicionadas no tempo).
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
const saida = path.join(root, 'saida', 'vde-mentoria-game'); fs.mkdirSync(saida, { recursive: true });
const so_png = process.env.SO_PNG === '1';
for (let i = 0; i < P.length; i++) {
  const n = i + 1; if (so && so !== n) continue;
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet"><style>${CSS}</style></head><body>${P[i]}</body></html>`);
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(400);
  const em = t => page.evaluate(ms => document.getAnimations().forEach(a => { a.pause(); a.currentTime = ms; }), t * 1000);
  await em(DUR - .4); await page.screenshot({ path: path.join(saida, `${n}.png`) });
  if (!so_png) {
    const tmp = fs.mkdtempSync(path.join(saida, '.q'));
    for (let f = 0; f < DUR * FPS; f++) { await em(f / FPS); await page.screenshot({ path: path.join(tmp, `${String(f).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 92 }); }
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(tmp, '%04d.jpg'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart', path.join(saida, `${n}.mp4`)]);
    fs.rmSync(tmp, { recursive: true });
  }
  await page.close(); console.log(`✓ ${n}`);
}
await browser.close();

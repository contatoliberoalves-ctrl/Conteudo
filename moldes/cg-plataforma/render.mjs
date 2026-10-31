// Molde "Plataforma (divulgação)" do @constitucionalgabaritado: posts que divulgam a plataforma Constitucional com Líbero
// (Reforço) com os prints dela. 4 carrosséis (2 com foto do autor, 2 só com a plataforma) e 3 cards de tela única, 1080×1350.
// Prints em prints/ e fotos em fotos/ (fora do git). Uso: node render.mjs [id ...]
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { COR, TEMAS, TITULO, TEXTO, FONTES, textura, rodape, rico } from '../cg-comum/base.mjs';
const { chromium } = createRequire('/opt/node-tools/node_modules/')('playwright');
const aqui = path.dirname(new URL(import.meta.url).pathname);
const img = f => 'data:image/' + (f.endsWith('.png') ? 'png' : 'jpeg') + ';base64,' + fs.readFileSync(path.join(aqui, f)).toString('base64');
const P = n => img(`prints/${n}.jpg`);
const FOTO = { classico: img('fotos/classico.png'), megafone: img('fotos/megafone_b.png') };
const abs = (css, h) => `<div style="position:absolute;${css}">${h}</div>`;

// ---------- peças ----------
const fundo = (t, h) => `<div style="position:absolute;inset:0;background:${TEMAS[t].bg}"></div>${h}${textura(TEMAS[t])}${rodape(TEMAS[t], 48)}`;
const T = (s, t, px, extra = '') => `<div style="${TITULO};font-size:${px}px;line-height:.92;color:${TEMAS[t].tit};${extra}">${rico(s, TEMAS[t]).replace(/\n/g, '<br>')}</div>`;
const txt = (s, t, px = 34, extra = '') => `<div style="${TEXTO};font-size:${px}px;line-height:1.42;color:${TEMAS[t].txt};${extra}">${rico(s, TEMAS[t])}</div>`;
const marca = t => `<div style="display:inline-flex;align-items:center;gap:12px;${TEXTO};font-size:22px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${TEMAS[t].escuro ? COR.base : '#fff'};background:${TEMAS[t].escuro ? COR.claro : COR.verde};border-radius:999px;padding:10px 22px"><span style="width:30px;height:30px;border-radius:8px;background:${TEMAS[t].escuro ? COR.base : COR.claro};color:${TEMAS[t].escuro ? COR.claro : COR.base};display:grid;place-items:center;${TITULO};font-size:24px;letter-spacing:0">C</span>Constitucional com Líbero</div>`;
const passo = (n, t) => `<div style="display:inline-block;${TEXTO};font-size:24px;font-weight:800;letter-spacing:.2em;color:${TEMAS[t].kicker}">PASSO ${n} DE 4</div>`;
// Janela de navegador com o print dentro (altura opcional corta a imagem pelo topo).
const janela = (src, w, { h, rot = 0, pos = 'top' } = {}) => `<div style="width:${w}px;border-radius:20px;overflow:hidden;background:#fff;box-shadow:0 30px 70px rgba(0,0,0,.35),0 0 0 1px rgba(0,0,0,.08);transform:rotate(${rot}deg)">
  <div style="height:40px;background:#EEF2F0;display:flex;align-items:center;gap:9px;padding:0 18px"><i style="width:13px;height:13px;border-radius:50%;background:#FF6159"></i><i style="width:13px;height:13px;border-radius:50%;background:#FFBD2E"></i><i style="width:13px;height:13px;border-radius:50%;background:#28C941"></i><span style="margin-left:14px;flex:1;height:22px;border-radius:6px;background:#fff;${TEXTO};font-size:13px;color:#7b8a84;display:flex;align-items:center;padding-left:12px">reforcos com libero · constitucional</span></div>
  <div style="${h ? `height:${h}px;` : ''}overflow:hidden"><img src="${src}" style="display:block;width:100%;${h ? `height:100%;object-fit:cover;object-position:${pos}` : ''}"></div></div>`;
const celular = (src, w, h, rot = 0) => `<div style="width:${w}px;height:${h}px;border-radius:54px;background:#111;padding:16px;box-shadow:0 30px 70px rgba(0,0,0,.4);transform:rotate(${rot}deg)"><div style="width:100%;height:100%;border-radius:40px;overflow:hidden;background:#fff;position:relative"><img src="${src}" style="display:block;width:100%"><div style="position:absolute;top:12px;left:50%;transform:translateX(-50%);width:110px;height:30px;border-radius:20px;background:#111"></div></div></div>`;
const cta = (t, px = 46) => `<div style="display:inline-block;background:${TEMAS[t].escuro ? '#fff' : COR.base};border-radius:22px;padding:26px 36px;box-shadow:0 18px 40px rgba(0,0,0,.25)"><div style="${TEXTO};font-size:${px}px;font-weight:600;line-height:1.2;color:${TEMAS[t].escuro ? COR.texto : '#fff'}">Comenta <b style="font-weight:900;color:${TEMAS[t].escuro ? COR.medio : COR.claro}">REFORÇO</b><br>que eu te mando o link</div></div>`;
const chip = (s, t) => `<span style="display:inline-flex;align-items:center;gap:10px;${TEXTO};font-size:25px;font-weight:600;color:${TEMAS[t].tit};background:${TEMAS[t].escuro ? 'rgba(255,255,255,.08)' : '#fff'};border:2px solid ${TEMAS[t].borda};border-radius:999px;padding:10px 22px"><i style="width:12px;height:12px;border-radius:50%;background:${TEMAS[t].destaque}"></i>${s}</span>`;
const seta = t => `<div style="${TEXTO};font-size:26px;font-weight:600;color:${TEMAS[t].destaque}">arrasta pro lado →</div>`;

// ---------- carrossel 1: por dentro da plataforma ----------
const C1 = [
  fundo('verde', `${abs('left:90px;top:110px', marca('verde'))}
    ${abs('left:90px;top:200px;width:900px', T('Por dentro da\n{{plataforma}} do\nReforço', 'verde', 168))}
    ${abs('left:90px;top:690px;width:900px', txt('Tudo o que você precisa pra **gabaritar Constitucional** na 1ª fase, num lugar só.', 'verde', 32))}
    ${abs('left:400px;top:830px', janela(P('visao'), 760, { rot: -4 }))}
    <img src="${FOTO.classico}" style="position:absolute;left:-40px;bottom:0;height:430px;z-index:6">
    ${abs('right:90px;top:120px', seta('verde'))}`),
  fundo('gelo', `${abs('left:90px;top:110px;width:900px', T('Tudo num\n{{lugar só}}', 'gelo', 150))}
    ${abs('left:90px;top:410px;width:900px', txt('Ao entrar, você já vê a **contagem regressiva** pra prova e o que tem pra estudar:', 'gelo', 32))}
    ${abs('left:90px;top:540px', janela(P('c_cards'), 900))}
    ${abs('left:90px;top:1040px;width:900px;display:flex;flex-wrap:wrap;gap:14px', ['Aulas', 'Ao vivo', 'Materiais', 'Cronograma', 'Ranking', 'Progresso'].map(c => chip(c, 'gelo')).join(''))}`),
  fundo('base', `${abs('left:90px;top:110px;width:900px', T('{{Diversas aulas}}\ngravadas', 'base', 150))}
    ${abs('left:90px;top:420px;width:900px', txt('Aulas **temáticas** e de **resolução de questões**. Você marca o que assistiu, avalia a aula e tira dúvida nos comentários.', 'base', 32))}
    ${abs('left:90px;top:610px', janela(P('c_aulasgrid'), 680, { rot: -2 }))}
    ${abs('left:400px;top:830px', janela(P('c_player'), 600, { rot: 3 }))}`),
  fundo('gelo', `${abs('left:90px;top:110px;width:900px', T('Cronograma\n{{sob medida}}', 'gelo', 160))}
    ${abs('left:90px;top:420px;width:900px', txt('Você diz **quantos dias e quantas horas** tem pra estudar, e a plataforma monta o plano **semana a semana até o dia da prova**.', 'gelo', 32))}
    ${abs('left:90px;top:620px', janela(P('c_crono'), 900, { h: 600 }))}`),
  fundo('verde', `${abs('left:90px;top:110px;width:900px', T('Banco de questões\n{{completo}}', 'verde', 120))}
    ${abs('left:90px;top:400px;width:900px', txt('Questões oficiais da FGV. Filtre por **tema, prova e dificuldade**, faça treinos de 10, 20 ou 30 e veja o **gabarito comentado**. O que errar vai pro **caderno de erros**.', 'verde', 31))}
    ${abs('left:90px;top:640px', janela(P('c_banco'), 640, { h: 470, rot: -2 }))}
    ${abs('left:500px;top:720px', janela(P('c_questao'), 500, { rot: 3 }))}`),
  fundo('gelo', `${abs('left:90px;top:110px;width:900px', T('Dicas rápidas\ne {{resumos}}', 'gelo', 160))}
    ${abs('left:90px;top:420px;width:560px', txt('As **pegadinhas e diferenças** que a FGV gosta de cobrar, em cards curtos pra revisar até no celular.', 'gelo', 32))}
    ${abs('left:90px;top:700px', janela(P('cap1423b'), 640, { rot: -2 }))}
    ${abs('left:690px;top:400px;z-index:5', celular(P('cap1423a'), 320, 640, 4))}`),
  fundo('base', `${abs('left:90px;top:110px;width:900px', T('E ainda:\n{{ao vivo}}, ranking\ne progresso', 'base', 138))}
    ${abs('left:90px;top:540px;width:560px;display:flex;flex-direction:column;gap:26px', [['Encontros ao vivo', 'plantões de dúvida e revisões no YouTube, comigo.'], ['Ranking e conquistas', 'cada aula e cada questão vira ponto.'], ['Meu progresso', 'o que você já fez e o que falta.']].map(([a, b]) => `<div style="border-left:6px solid ${COR.claro};padding-left:22px">${txt(`**${a}:** ${b}`, 'base', 30)}</div>`).join(''))}
    ${abs('left:90px;top:960px;z-index:7', cta('base', 42))}
    <img src="${FOTO.megafone}" style="position:absolute;right:-60px;bottom:0;height:640px;z-index:6">`),
];

// ---------- carrossel 2: o passo a passo ----------
const C2 = [
  fundo('base', `${abs('left:90px;top:110px', marca('base'))}
    ${abs('left:90px;top:210px;width:920px', T('Você estuda\nConstitucional\ne {{esquece tudo}}\nna prova?', 'base', 150))}
    ${abs('left:90px;top:860px;width:520px', txt('Eu montei uma plataforma pra resolver isso. Olha como ela funciona.', 'base', 32))}
    ${abs('left:90px;top:1060px', seta('base'))}
    <img src="${FOTO.classico}" style="position:absolute;right:-60px;bottom:0;height:640px">`),
  fundo('gelo', `${abs('left:90px;top:120px;width:900px', T('O problema\n{{não é você}}', 'gelo', 160))}
    ${abs('left:90px;top:440px;width:880px', txt('É estudar solto: **sem plano**, **sem treinar no estilo da FGV** e **sem revisar** o que errou. Por isso o Reforço é organizado em 4 passos:', 'gelo', 34))}
    ${abs('left:90px;top:700px;width:900px;display:grid;grid-template-columns:1fr 1fr;gap:24px', ['Monte seu plano', 'Assista e marque', 'Treine com a FGV', 'Revise antes da prova'].map((s, i) => `<div style="background:#fff;border:2px solid ${TEMAS.gelo.borda};border-radius:22px;padding:44px 30px;display:flex;align-items:center;gap:20px"><span style="${TITULO};font-size:100px;line-height:.8;color:${COR.medio}">${i + 1}</span><span style="${TEXTO};font-size:29px;font-weight:700;line-height:1.2;color:${COR.texto}">${s}</span></div>`).join(''))}${abs('left:90px;top:1110px', seta('gelo'))}`),
  fundo('verde', `${abs('left:90px;top:110px', passo(1, 'verde'))}${abs('left:90px;top:160px;width:900px', T('Monte seu\n{{plano}}', 'verde', 170))}
    ${abs('left:90px;top:500px;width:520px', txt('A plataforma conta os dias até a prova e transforma o seu tempo livre num **cronograma semana a semana**.', 'verde', 31))}
    ${abs('left:650px;top:480px', `<div style="width:340px;border-radius:22px;overflow:hidden;box-shadow:0 24px 50px rgba(0,0,0,.35);transform:rotate(3deg)"><img src="${P('c_contagem')}" style="display:block;width:100%"></div>`)}
    ${abs('left:90px;top:760px', janela(P('c_crono'), 900, { h: 380 }))}`),
  fundo('gelo', `${abs('left:90px;top:110px', passo(2, 'gelo'))}${abs('left:90px;top:160px;width:900px', T('Assista\ne {{marque}}', 'gelo', 170))}
    ${abs('left:90px;top:500px;width:880px', txt('Cada aula assistida vale **+50 pontos** e sobe você no ranking. Dúvida? Deixa nos comentários da aula.', 'gelo', 32))}
    ${abs('left:90px;top:690px', janela(P('c_player'), 900))}`),
  fundo('base', `${abs('left:90px;top:110px', passo(3, 'base'))}${abs('left:90px;top:160px;width:900px', T('Treine com\n{{a FGV}}', 'base', 170))}
    ${abs('left:90px;top:500px;width:480px', txt('Questões **oficiais** de provas anteriores, com **gabarito comentado** em cada alternativa. Errou? Vai pro caderno de erros pra você refazer.', 'base', 30))}
    ${abs('left:90px;top:900px', janela(P('c_banco'), 900, { h: 260, rot: -1 }))}
    ${abs('left:590px;top:420px;z-index:5', janela(P('c_questao'), 430, { rot: 3 }))}`),
  fundo('gelo', `${abs('left:90px;top:110px', passo(4, 'gelo'))}${abs('left:90px;top:160px;width:900px', T('Revise antes\nda {{prova}}', 'gelo', 160))}
    ${abs('left:90px;top:480px;width:880px', txt('**Dicas rápidas** com as pegadinhas da banca, resumos por tema e **plantões ao vivo** pra tirar a última dúvida.', 'gelo', 32))}
    ${abs('left:90px;top:680px', janela(P('cap1423b'), 900))}`),
  fundo('verde', `${abs('left:90px;top:120px;width:900px', T('Bora gabaritar\n{{Constitucional}}?', 'verde', 150))}
    ${abs('left:90px;top:440px;width:540px', txt('**Constitucional com Líbero**, a plataforma do Reforço: aulas, cronograma, questões, dicas e encontros ao vivo.', 'verde', 31))}
    ${abs('left:90px;top:760px;z-index:7', cta('verde', 42))}
    <img src="${FOTO.megafone}" style="position:absolute;right:-60px;bottom:0;height:660px;z-index:6">`),
];

// ---------- cards de tela única ----------
const CARDS = [
  ['card-340-questoes', fundo('verde', `${abs('left:90px;top:100px', marca('verde'))}
    ${abs('left:90px;top:170px;width:900px', T('Um banco de\nquestões\n{{completo}}', 'verde', 150))}
    ${abs('left:90px;top:600px;width:900px', T('pra treinar no estilo da FGV', 'verde', 70))}
    ${abs('left:90px;top:740px;width:560px', txt('Por **tema, prova e dificuldade**, com gabarito comentado e caderno de erros.', 'verde', 30))}
    ${abs('left:690px;top:720px', janela(P('c_questao'), 330, { rot: 4 }))}
    ${abs('left:90px;top:960px;z-index:7', cta('verde', 34))}`)],
  ['card-cronograma', fundo('gelo', `${abs('left:90px;top:100px', marca('gelo'))}
    ${abs('left:90px;top:190px;width:900px', T('Você diz quanto\ntempo tem.\nA plataforma\nmonta o {{plano}}.', 'gelo', 138))}
    ${abs('left:90px;top:780px', janela(P('c_crono'), 900, { h: 270 }))}
    ${abs('left:730px;top:690px;z-index:6', `<div style="width:270px;border-radius:20px;overflow:hidden;box-shadow:0 24px 50px rgba(0,0,0,.3);transform:rotate(4deg)"><img src="${P('c_contagem')}" style="display:block;width:100%"></div>`)}
    ${abs('left:90px;top:1130px;width:900px', txt('Cronograma sob medida até o dia da prova. Comenta **REFORÇO** que eu te mando o link.', 'gelo', 28))}`)],
  ['card-num-lugar-so', fundo('base', `${abs('left:90px;top:100px', marca('base'))}
    ${abs('left:90px;top:190px;width:900px', T('Aulas, cronograma,\nquestões, dicas\ne ao vivo.\n{{Num lugar só.}}', 'base', 128))}
    ${abs('left:430px;top:700px', janela(P('c_hero'), 600, { rot: -3 }))}
    ${abs('left:520px;top:930px', janela(P('c_aulasgrid'), 480, { h: 220, rot: 3 }))}
    <img src="${FOTO.classico}" style="position:absolute;left:-30px;bottom:0;height:520px;z-index:6">`)],
];

// ---------- versões sem foto: foco na plataforma ----------
const ICO = {
  aula: '<rect x="2.5" y="4.5" width="19" height="13" rx="2.5"/><path d="M10 8.5v5l4-2.5z" fill="currentColor"/><path d="M8 20.5h8"/>',
  crono: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4M7.5 14h3M13.5 14h3M7.5 17.5h3"/>',
  questao: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/>',
  dica: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  vivo: '<circle cx="12" cy="12" r="2.5" fill="currentColor"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14"/>',
  ranking: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v1.5A3.5 3.5 0 0 0 7.5 11M17 6h3v1.5a3.5 3.5 0 0 1-3.5 3.5"/>',
  progresso: '<path d="M4 20h16"/><rect x="5.5" y="12" width="3" height="6" rx="1"/><rect x="10.5" y="8" width="3" height="10" rx="1"/><rect x="15.5" y="4" width="3" height="14" rx="1"/>',
  material: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
};
const ico = (n, s, cor) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${cor}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" style="color:${cor};display:block;flex:none">${ICO[n]}</svg>`;
const ESC = { bg: '#0F1312', glow: 'rgba(63,154,77,.55)' };
// Fundo escuro com brilho verde e colmeia; "vitrine" das telas.
const fundoV = (h, glow = '50% 62%') => `<div style="position:absolute;inset:0;background:radial-gradient(60% 45% at ${glow},${ESC.glow} 0%,rgba(63,154,77,0) 70%),${TEMAS.base.bg.replace(COR.base, ESC.bg)}"></div>${h}${textura(TEMAS.base)}${rodape(TEMAS.base, 44)}`;
const notebook = (src, w) => `<div style="width:${w}px;filter:drop-shadow(0 40px 60px rgba(0,0,0,.55))"><div style="background:#1a1d1c;border-radius:${w * .03}px ${w * .03}px 0 0;padding:${w * .022}px ${w * .022}px ${w * .03}px;border:2px solid #343b39"><div style="border-radius:6px;overflow:hidden;background:#fff"><img src="${src}" style="display:block;width:100%"></div></div><div style="height:${w * .035}px;margin:0 -${w * .06}px;background:linear-gradient(#cfd6d3,#8f9995);border-radius:0 0 ${w * .04}px ${w * .04}px"></div></div>`;
const pilula = (t, { n, escuro = false } = {}) => `<div style="display:inline-flex;align-items:center;gap:14px;background:${escuro ? COR.base : '#fff'};border-radius:999px;padding:14px 26px 14px 16px;box-shadow:0 16px 36px rgba(0,0,0,.3);white-space:nowrap">${n ? `<span style="width:44px;height:44px;border-radius:50%;background:${COR.claro};display:grid;place-items:center">${ico(n, 26, COR.base)}</span>` : `<i style="width:14px;height:14px;border-radius:50%;background:${COR.medio}"></i>`}<span style="${TEXTO};font-size:27px;font-weight:700;color:${escuro ? '#fff' : COR.texto}">${t}</span></div>`;
const rotulo = (num, t) => `<div style="display:flex;align-items:center;gap:16px"><span style="${TITULO};font-size:44px;line-height:1;color:${COR.base};background:${COR.claro};border-radius:12px;padding:6px 14px 2px">${num}</span><span style="${TEXTO};font-size:24px;font-weight:700;letter-spacing:.22em;color:${COR.claro}">${t}</span></div>`;
const TV = (s, px) => `<div style="${TITULO};font-size:${px}px;line-height:.9;color:#fff">${rico(s, TEMAS.base).replace(/\n/g, '<br>')}</div>`;
const lin = (s, px = 32, cor = '#C9D6D1') => `<div style="${TEXTO};font-size:${px}px;line-height:1.35;color:${cor}">${rico(s, TEMAS.base)}</div>`;
const botao = (escuro = true) => `<div style="display:inline-flex;align-items:center;gap:18px;background:${escuro ? COR.claro : COR.base};border-radius:999px;padding:24px 40px;box-shadow:0 0 0 10px ${escuro ? 'rgba(155,224,163,.18)' : 'rgba(28,31,30,.12)'}"><span style="${TEXTO};font-size:36px;font-weight:600;color:${escuro ? COR.base : '#fff'}">Comenta <b style="font-weight:900">REFORÇO</b> e receba o link</span></div>`;

const V3 = [
  fundoV(`${abs('left:0;right:0;top:110px;display:flex;justify-content:center', marca('base'))}
    ${abs('left:0;right:0;top:200px;text-align:center', `<div style="${TEXTO};font-size:30px;font-weight:600;letter-spacing:.3em;color:${COR.claro}">POR DENTRO DA PLATAFORMA</div>${TV('Constitucional\n{{com Líbero}}', 170)}`)}
    ${abs('left:150px;top:640px', notebook(P('visao'), 780))}
    ${abs('left:40px;top:590px;transform:rotate(-4deg)', pilula('Aulas gravadas', { n: 'aula' }))}
    ${abs('right:40px;top:700px;transform:rotate(3deg)', pilula('Banco de questões', { n: 'questao' }))}
    ${abs('left:70px;top:1100px;transform:rotate(2deg)', pilula('Cronograma sob medida', { n: 'crono' }))}`, '50% 70%'),
  fundoV(`${abs('left:90px;top:100px', rotulo('01', 'AULAS'))}
    ${abs('left:90px;top:180px;width:900px', TV('{{Diversas aulas}}\ngravadas', 120))}
    ${abs('left:90px;top:410px;width:900px', lin('Temáticas e de resolução de questões, no seu ritmo.'))}
    ${abs('left:90px;top:520px', janela(P('c_aulasgrid'), 900))}
    ${abs('left:330px;top:850px', janela(P('c_player'), 680, { rot: 2 }))}
    ${abs('left:60px;top:1110px;transform:rotate(-3deg)', pilula('Marque como assistida · +50 pts', { n: 'check' }))}`, '50% 75%'),
  fundoV(`${abs('left:90px;top:100px', rotulo('02', 'CRONOGRAMA'))}
    ${abs('left:90px;top:180px;width:900px', TV('Seu plano até\no {{dia da prova}}', 140))}
    ${abs('left:90px;top:460px;width:900px', lin('Você diz o tempo que tem. A plataforma organiza semana a semana.'))}
    ${abs('left:90px;top:620px', janela(P('c_crono'), 900, { h: 600 }))}
    ${abs('left:700px;top:555px;z-index:6', `<div style="width:300px;border-radius:20px;overflow:hidden;box-shadow:0 24px 50px rgba(0,0,0,.45);transform:rotate(4deg)"><img src="${P('c_contagem')}" style="display:block;width:100%"></div>`)}`, '50% 80%'),
  fundoV(`${abs('left:90px;top:100px', rotulo('03', 'BANCO DE QUESTÕES'))}
    ${abs('left:90px;top:170px;width:450px', TV('Banco de\nquestões\n{{completo}}', 128))}
    ${abs('left:90px;top:560px;width:440px', lin('Questões oficiais das provas da FGV.', 30))}
    ${abs('left:560px;top:170px', janela(P('c_questao'), 470, { rot: 3 }))}
    ${abs('left:90px;top:800px;width:900px;display:grid;grid-template-columns:1fr 1fr;gap:22px', [['Filtro por tema, prova e dificuldade', 'questao'], ['Treinos de 10, 20 ou 30', 'progresso'], ['Gabarito comentado', 'check'], ['Caderno de erros', 'material']].map(([t, n]) => `<div style="background:rgba(255,255,255,.06);border:2px solid rgba(155,224,163,.25);border-radius:22px;padding:44px 28px;display:flex;gap:18px;align-items:center"><span style="width:62px;height:62px;border-radius:16px;background:${COR.claro};display:grid;place-items:center;flex:none">${ico(n, 34, COR.base)}</span><span style="${TEXTO};font-size:28px;font-weight:600;line-height:1.25;color:#fff">${t}</span></div>`).join(''))}`, '70% 30%'),
  fundoV(`${abs('left:90px;top:100px', rotulo('04', 'REVISÃO'))}
    ${abs('left:90px;top:180px;width:900px', TV('Dicas rápidas\ne {{resumos}}', 150))}
    ${abs('left:90px;top:470px;width:520px', lin('As pegadinhas que a FGV gosta de cobrar, em cards curtos.'))}
    ${abs('left:60px;top:700px', janela(P('cap1423b'), 700, { rot: -2 }))}
    ${abs('left:680px;top:420px;z-index:5', celular(P('cap1423a'), 340, 700, 4))}`, '60% 70%'),
  fundoV(`${abs('left:90px;top:100px', rotulo('05', 'E MAIS'))}
    ${abs('left:90px;top:180px;width:900px', TV('O que faz você\n{{não desistir}}', 140))}
    ${abs('left:90px;top:500px;width:900px;display:grid;grid-template-columns:1fr 1fr;gap:22px', [['vivo', 'Ao vivo', 'Plantões de dúvida e revisões no YouTube'], ['ranking', 'Ranking', 'Cada aula e questão vira ponto'], ['progresso', 'Progresso', 'O que você já fez e o que falta'], ['material', 'Materiais', 'Questões autorais, resumos e mapas mentais']].map(([n, a, b]) => `<div style="background:rgba(255,255,255,.06);border:2px solid rgba(155,224,163,.25);border-radius:26px;padding:34px 30px;height:300px;display:flex;flex-direction:column;gap:18px"><span style="width:84px;height:84px;border-radius:22px;background:${COR.claro};display:grid;place-items:center">${ico(n, 46, COR.base)}</span><div style="${TITULO};font-size:58px;line-height:1;color:#fff">${a}</div>${lin(b, 26)}</div>`).join(''))}`, '50% 70%'),
  fundoV(`${abs('left:0;right:0;top:200px;text-align:center', TV('Tudo isso\n{{num lugar só}}', 150))}
    ${abs('left:120px;right:120px;top:570px;display:grid;grid-template-columns:1fr 1fr;gap:26px 40px', [['aula', 'Diversas aulas gravadas'], ['crono', 'Cronograma sob medida'], ['questao', 'Banco de questões completo'], ['dica', 'Dicas e resumos'], ['vivo', 'Encontros ao vivo'], ['ranking', 'Ranking e progresso']].map(([n, t]) => `<div style="display:flex;align-items:center;gap:18px">${ico(n, 46, COR.claro)}<span style="${TEXTO};font-size:30px;font-weight:600;color:#fff">${t}</span></div>`).join(''))}
    ${abs('left:0;right:0;top:990px;display:flex;justify-content:center', botao())}`, '50% 75%'),
];

// Versão clara: blocos verdes com o benefício em cima e a tela grande embaixo.
const GELO = TEMAS.gelo;
const fundoC = h => `<div style="position:absolute;inset:0;background:${GELO.bg}"></div>${h}${textura(GELO)}${rodape(GELO, 44)}`;
const bloco = (alt, h) => `<div style="position:absolute;left:0;right:0;top:0;height:${alt}px;background:${TEMAS.verde.bg};border-radius:0 0 60px 60px"></div>${h}`;
const tag = t => `<span style="display:inline-block;${TEXTO};font-size:24px;font-weight:800;letter-spacing:.2em;color:${COR.base};background:${COR.claro};border-radius:999px;padding:8px 22px">${t}</span>`;
const checks = (itens, cor = '#fff') => `<div style="display:flex;flex-direction:column;gap:16px">${itens.map(t => `<div style="display:flex;align-items:center;gap:16px"><span style="width:44px;height:44px;border-radius:50%;background:${COR.claro};display:grid;place-items:center;flex:none">${ico('check', 26, COR.base)}</span><span style="${TEXTO};font-size:30px;font-weight:500;color:${cor}">${rico(t, TEMAS.verde)}</span></div>`).join('')}</div>`;
const recurso = (t, titulo, itens, tela) => fundoC(bloco(640, `${abs('left:90px;top:100px', tag(t))}
    ${abs('left:90px;top:170px;width:900px', TV(titulo, 120))}
    ${abs('left:90px;top:' + (titulo.includes('\n') ? 400 : 300) + 'px;width:900px', checks(itens))}
    ${tela}`));
const V4 = [
  fundoC(`${abs('left:90px;top:100px', marca('gelo'))}
    ${abs('left:90px;top:180px;width:900px', T('Tudo pra gabaritar\n{{Constitucional}}', 'gelo', 116))}
    ${abs('left:90px;top:420px', `<div style="${TEXTO};font-size:30px;font-weight:600;color:${COR.medio}">por dentro da plataforma →</div>`)}
    <div style="position:absolute;left:0;right:0;top:540px;bottom:0;background:${TEMAS.verde.bg};border-radius:60px 60px 0 0"></div>
    ${abs('left:60px;top:600px', janela(P('c_aulasgrid'), 560, { rot: -5 }))}
    ${abs('left:560px;top:620px', janela(P('c_crono'), 470, { h: 300, rot: 4 }))}
    ${abs('left:110px;top:930px', janela(P('cap1423b'), 470, { rot: 3 }))}
    ${abs('left:590px;top:900px', janela(P('c_questao'), 400, { rot: -3 }))}`),
  fundoC(`${abs('left:90px;top:110px;width:900px', T('O que tem\n{{dentro}}', 'gelo', 150))}
    ${abs('left:90px;top:440px;width:900px;display:grid;grid-template-columns:1fr 1fr;gap:24px', [['aula', 'Aulas', 'Diversas aulas gravadas'], ['crono', 'Cronograma', 'Montado pro seu tempo'], ['questao', 'Questões', 'Banco completo da FGV'], ['dica', 'Revisão', 'Dicas rápidas e resumos'], ['vivo', 'Ao vivo', 'Plantões e revisões'], ['ranking', 'Ranking', 'Pontos e progresso']].map(([n, a, b]) => `<div style="background:#fff;border:2px solid ${GELO.borda};border-radius:24px;padding:46px 26px;display:flex;gap:20px;align-items:center"><span style="width:76px;height:76px;border-radius:20px;background:${COR.verde};display:grid;place-items:center;flex:none">${ico(n, 42, COR.claro)}</span><div><div style="${TITULO};font-size:50px;line-height:1;color:${COR.texto}">${a}</div><div style="${TEXTO};font-size:23px;line-height:1.3;color:${COR.cinza};margin-top:4px">${b}</div></div></div>`).join(''))}`),
  recurso('AULAS', '{{Diversas aulas}}\ngravadas', ['Temáticas e resolução de questões', 'Marque o que já assistiu', 'Tire dúvidas nos comentários'], abs('left:90px;top:620px', janela(P('c_player'), 900))),
  recurso('CRONOGRAMA', 'Plano até o\n{{dia da prova}}', ['Feito pro tempo que você tem', 'Semana a semana, com progresso'], `${abs('left:90px;top:720px', janela(P('c_crono'), 900, { h: 460 }))}${abs('left:720px;top:640px;z-index:6', `<div style="width:280px;border-radius:20px;overflow:hidden;box-shadow:0 24px 50px rgba(0,0,0,.35);transform:rotate(4deg)"><img src="${P('c_contagem')}" style="display:block;width:100%"></div>`)}`),
  recurso('QUESTÕES', 'Banco de questões\n{{completo}}', ['Filtro por tema, prova e dificuldade', 'Gabarito comentado', 'Caderno de erros'], `${abs('left:70px;top:650px', janela(P('c_banco'), 560, { h: 520, rot: -2 }))}${abs('left:520px;top:700px', janela(P('c_questao'), 480, { rot: 3 }))}`),
  recurso('REVISÃO', 'Dicas e {{resumos}}', ['As pegadinhas da FGV', 'Cards curtos pra revisar no celular'], `${abs('left:60px;top:620px', janela(P('cap1423b'), 660, { rot: -2 }))}${abs('left:690px;top:480px;z-index:5', celular(P('cap1423a'), 320, 660, 4))}`),
  fundo('verde', `${abs('left:0;right:0;top:200px;text-align:center', `${TV('Bora gabaritar\n{{Constitucional}}?', 150)}`)}
    ${abs('left:0;right:0;top:600px;display:flex;justify-content:center;gap:16px;flex-wrap:wrap;padding:0 80px', ['Aulas', 'Cronograma', 'Questões', 'Revisão', 'Ao vivo', 'Ranking'].map(c => `<span style="${TEXTO};font-size:26px;font-weight:600;color:#fff;border:2px solid rgba(155,224,163,.5);border-radius:999px;padding:10px 24px">${c}</span>`).join(''))}
    ${abs('left:0;right:0;top:880px;display:flex;justify-content:center', botao())}`),
];

// ---------- render ----------
const POSTS = { 'carrossel-vitrine': V3, 'carrossel-recursos': V4, 'carrossel-por-dentro': C1, 'carrossel-passo-a-passo': C2, ...Object.fromEntries(CARDS.map(([n, h]) => [n, [h]])) };
const pedidos = process.argv.slice(2);
const launch = { executablePath: process.env.CHROMIUM_PATH };
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const b = await chromium.launch(launch);
const HEAD = `<meta charset="utf-8"><link href="${FONTES}" rel="stylesheet"><style>*{margin:0;box-sizing:border-box}i{display:inline-block}</style>`;
const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
for (const [id, slides] of Object.entries(POSTS)) {
  if (pedidos.length && !pedidos.includes(id)) continue;
  const dir = path.join(aqui, 'saida', id); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  for (const [i, html] of slides.entries()) {
    await p.setContent(`<!doctype html><html><head>${HEAD}</head><body><div id="a" style="position:relative;width:1080px;height:1350px;overflow:hidden">${html}</div></body></html>`);
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: path.join(dir, `${i + 1}.png`) });
  }
  console.log(id, slides.length);
}
await b.close();

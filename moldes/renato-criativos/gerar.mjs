// Criativos de tráfego da Formação Bíblica (Pastor Renato Torres), na identidade Brasa (moldes renato-*) e no estilo
// nativo do Instagram (foto + texto em balão). Feed 1080×1350 e stories 1080×1920.
// Fotos em fotos/ (fora do git; CC0/domínio público do Wikimedia Commons, créditos em fotos/CREDITOS.txt).
// Uso: node gerar.mjs [filtro]  -> saida/<id>/<n>.png
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { C, G, T, HEAD, esc, sim } from '../renato-comum/brasa.mjs';
const req = createRequire(import.meta.url);
let chromium; try { ({ chromium } = req('playwright')); } catch { ({ chromium } = req('/opt/node-tools/node_modules/playwright')); }
const raiz = path.dirname(new URL(import.meta.url).pathname);
const filtro = process.argv[2] || '';
const foto = n => 'file://' + path.join(raiz, 'fotos', n);

const PRECO = 'R$ 99';
const OFERTA = '3 cursos · 25 aulas · R$ 99';
const I = 'font-family:Inter,sans-serif';

// Assinatura: FORMAÇÃO BÍBLICA + selo do pastor + V.
const assinatura = (escuro = true, px = 30) => `<div style="display:flex;align-items:center;gap:${px * .5}px">
  ${sim(escuro ? '#fff' : C.brasa, px * 1.5)}
  <div style="display:flex;flex-direction:column;gap:${px * .22}px"><span style="${T};font-size:${px}px;line-height:1;color:${escuro ? '#fff' : C.carvao}">Formação Bíblica</span>
  <span style="${I};font-weight:700;font-size:${px * .42}px;letter-spacing:.16em;color:${escuro ? 'rgba(255,244,232,.8)' : C.brasa}">PASTOR RENATO TORRES</span></div></div>`;
// Texto rico: **negrito** e [[destaque]].
const rico = (s, fundo = C.carvao, cor = '#fff') => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
  .replace(/\[\[(.+?)\]\]/g, `<span style="background:${fundo};color:${cor};padding:0 .12em;box-decoration-break:clone;-webkit-box-decoration-break:clone">$1</span>`);
// Balões do texto nativo do Instagram: cada linha numa caixa arredondada.
const balao = (linhas, { px = 52, bg = '#fff', cor = '#111', alinhar = 'left' } = {}) => `<div style="display:flex;flex-direction:column;align-items:${alinhar === 'center' ? 'center' : 'flex-start'};gap:0">${linhas.map(l =>
  `<span style="${I};font-weight:700;font-size:${px}px;line-height:1.18;background:${bg};color:${cor};padding:${px * .12}px ${px * .32}px;border-radius:${px * .26}px;margin-top:-${px * .06}px;text-align:${alinhar}">${esc(l)}</span>`).join('')}</div>`;
const fotoFundo = (n, { pos = 'center', escurecer = .35, blur = 0, matiz = '' } = {}) =>
  `<img src="${foto(n)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${pos};${blur ? `filter:blur(${blur}px);transform:scale(1.08);` : ''}">
   <div style="position:absolute;inset:0;background:${matiz || `rgba(20,6,0,${escurecer})`}"></div>`;
const tit = (txt, px, cor = '#fff', extra = '') => `<div style="${T};font-size:${px}px;line-height:.98;color:${cor};${extra}">${txt}</div>`;
const kick = (txt, cor = C.brasa) => `<div style="${I};font-weight:700;font-size:26px;letter-spacing:.18em;text-transform:uppercase;color:${cor}">${esc(txt)}</div>`;
const fundo = { degrade: G, creme: C.creme, carvao: C.carvao };
const agua = (px, r, b, cor) => sim(cor, px, `position:absolute;right:${r}px;bottom:${b}px`);

const P = []; // {id, n, w, h, html}
const add = (id, n, w, h, html) => P.push({ id, n, w, h, html });
const feed = (id, n, bg, html) => add(id, n, 1080, 1350, `<div class="p" style="position:relative;width:1080px;height:1350px;overflow:hidden;background:${bg}">${html}</div>`);
const story = (id, n, bg, html) => add(id, n, 1080, 1920, `<div class="p" style="position:relative;width:1080px;height:1920px;overflow:hidden;background:${bg}">${html}</div>`);
const rodape = (escuro = true, extra = '') => `<div style="position:absolute;left:80px;right:80px;bottom:70px;display:flex;align-items:flex-end;justify-content:space-between;gap:20px">${assinatura(escuro)}${extra}</div>`;
const selo = (txt, bg = C.carvao, fg = C.creme, px = 26) => `<span style="display:inline-block;${I};font-weight:700;font-size:${px}px;letter-spacing:.08em;background:${bg};color:${fg};padding:${px * .5}px ${px}px;border-radius:999px;white-space:nowrap">${txt}</span>`;

// ================================ LINHA 1 · Interpretação bíblica ================================
// C01 nativo: página de Bíblia antiga + balões.
const c01 = (h, story_ = false) => {
  const top = story_ ? 560 : 330;
  return `${fotoFundo('pagina-1.jpg', { pos: '30% center', escurecer: .55 })}
  <div style="position:absolute;left:70px;right:70px;top:${top}px;display:flex;flex-direction:column;gap:34px">
    ${balao(['Jeremias 29:11', 'não foi escrito', 'pra você.'], { px: story_ ? 92 : 86 })}
    ${balao(['(E isso é uma ótima notícia.)'], { px: 46, bg: C.brasa, cor: '#fff' })}
  </div>
  <div style="position:absolute;left:70px;right:70px;bottom:${story_ ? 330 : 190}px;${I};font-weight:600;font-size:${story_ ? 40 : 36}px;line-height:1.35;color:#fff;text-shadow:0 2px 14px rgba(0,0,0,.6)">Aprenda a ler o contexto antes de aplicar o versículo.</div>
  ${story_ ? `<div style="position:absolute;left:80px;right:80px;bottom:150px">${assinatura(true)}</div>` : rodape(true)}`;
};
feed('C01-jeremias', 1, '#000', c01());

// C02 carrossel: 3 perguntas.
const meio = h => h.replace(/position:absolute;left:80px;right:80px;top:(2\d\d|3[0-4]\d)px">/, 'position:absolute;left:80px;right:80px;top:60px;bottom:200px;display:flex;flex-direction:column;justify-content:center">');
const telaBrasa = (bg, conteudo, escuro, n, tot) => `${meio(conteudo)}${agua(760, -200, -170, escuro ? 'rgba(255,255,255,.07)' : 'rgba(255,77,0,.06)')}
  <div style="position:absolute;left:80px;right:80px;bottom:70px;display:flex;align-items:flex-end;justify-content:space-between">${assinatura(escuro, 26)}${n ? `<span style="${I};font-weight:700;font-size:24px;color:${escuro ? 'rgba(255,255,255,.7)' : 'rgba(43,14,0,.5)'}">${n}/${tot}</span>` : ''}</div>`;
const numeroGrande = (n, cor) => `<div style="${T};font-size:300px;line-height:.8;color:${cor}">${n}</div>`;
const C02 = [
  [G, true, `<div style="position:absolute;left:80px;right:80px;top:250px">${kick('Antes de ler qualquer versículo', '#fff')}${tit('Faça essas<br>[[3 perguntas]]'.replace('[[', `<span style="background:${C.carvao};color:${C.creme};padding:0 .1em">`).replace(']]', '</span>'), 150, '#fff', 'margin-top:30px')}<div style="${I};font-weight:600;font-size:40px;line-height:1.4;color:#fff;margin-top:40px;max-width:820px">Elas mudam a forma como você entende a Bíblia.</div></div>`],
  ...[['1', 'Quem escreveu,<br>e pra quem?', 'Todo texto tem um autor, um destinatário e uma situação real por trás.'],
      ['2', 'O que significava<br>pra eles?', 'Antes de perguntar o que o texto diz pra você, entenda o que disse aos primeiros leitores.'],
      ['3', 'O que o texto<br>ao redor diz?', 'Leia o capítulo inteiro. O versículo sozinho quase nunca conta a história toda.']]
    .map(([n, p, d]) => [C.creme, false, `<div style="position:absolute;left:80px;right:80px;top:200px">${numeroGrande(n, C.brasa)}${tit(p, 112, C.carvao, 'margin-top:40px')}<div style="${I};font-size:40px;line-height:1.45;color:${C.carvao};margin-top:40px;max-width:860px">${d}</div></div>`]),
  [C.carvao, true, `<div style="position:absolute;left:80px;right:80px;top:250px">${kick('Isso tem nome', C.laranja)}${tit('Isso é<br>hermenêutica.', 140, '#fff', 'margin-top:30px')}<div style="${I};font-weight:600;font-size:44px;line-height:1.4;color:${C.creme};margin-top:40px">E dá pra aprender.</div><div style="margin-top:70px">${selo('Aprenda o método completo · ' + PRECO, G, '#fff', 34)}</div></div>`],
];
C02.forEach(([bg, esc_, html], i) => feed('C02-3-perguntas', i + 1, bg, telaBrasa(bg, html, esc_, i + 1, C02.length)));

// C03 nativo: Bíblia aberta.
feed('C03-le-mas-entende', 1, '#000', `${fotoFundo('biblia-2.jpg', { pos: '55% center', escurecer: .38 })}
  <div style="position:absolute;left:70px;right:70px;top:180px">${balao(['Você lê a Bíblia', 'todo dia, mas sente', 'que não entende', 'metade?'], { px: 78 })}</div>
  <div style="position:absolute;left:70px;right:70px;top:820px">${balao(['Não é falta de fé.', 'É falta de método.'], { px: 54, bg: C.brasa, cor: '#fff' })}</div>
  ${rodape(true)}`);

// C04 carrossel: 4 erros.
const xVinho = `<svg width="120" height="120" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="${C.brasa}"/><path d="M8 8l8 8M16 8l-8 8" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>`;
const erros = [['Tirar o versículo do contexto', 'O texto ao redor muda o sentido da frase.'], ['Ler a cultura de hoje no texto antigo', 'Ele foi escrito em outro tempo, outra língua e outra sociedade.'], ['Fazer de toda narrativa uma regra', 'Nem tudo o que a Bíblia relata ela manda repetir.'], ['Ignorar o gênero literário', 'Poesia, lei, carta e profecia se leem de jeitos diferentes.']];
const C04 = [[G, true, `<div style="position:absolute;left:80px;right:80px;top:260px">${tit('4 erros que<br>quase todo<br>cristão comete', 136, '#fff')}<div style="${I};font-weight:600;font-size:44px;color:#fff;margin-top:40px">ao ler a Bíblia</div></div>`]];
erros.forEach(([e, d], k) => C04.push([k % 2 ? C.carvao : C.creme, k % 2 === 1, `<div style="position:absolute;left:80px;right:80px;top:220px">${xVinho}<div style="${I};font-weight:700;font-size:30px;letter-spacing:.16em;color:${k % 2 ? C.laranja : C.brasa};margin-top:40px">ERRO ${k + 1}</div>${tit(e, 108, k % 2 ? '#fff' : C.carvao, 'margin-top:16px')}<div style="${I};font-size:40px;line-height:1.45;color:${k % 2 ? C.creme : C.carvao};margin-top:40px;max-width:860px">${d}</div></div>`]));
C04.push([G, true, `<div style="position:absolute;left:80px;right:80px;top:260px">${tit('Interpretar<br>se aprende.', 140, '#fff')}<div style="${I};font-weight:600;font-size:42px;line-height:1.4;color:#fff;margin-top:40px">Interpretação Bíblica, Preparação de Sermões e Vida Intelectual.</div><div style="margin-top:60px">${selo(OFERTA, C.carvao, C.creme, 34)}</div></div>`]);
C04.forEach(([bg, e, html], i) => feed('C04-4-erros', i + 1, bg, telaBrasa(bg, html, e, i + 1, C04.length)));

// C05 antes e depois.
feed('C05-antes-depois', 1, C.creme, `
  <div style="position:absolute;left:0;top:0;bottom:0;width:540px;background:#3a2f2a"></div>
  <div style="position:absolute;left:0;top:0;width:540px;bottom:200px;padding:0 56px;display:flex;flex-direction:column;justify-content:center;gap:36px">
    <div style="${I};font-weight:700;font-size:30px;letter-spacing:.2em;color:rgba(255,244,232,.6)">ANTES</div>
    <div style="${T};font-size:78px;line-height:1.02;color:rgba(255,244,232,.75)">Abro a Bíblia em qualquer página e espero uma resposta.</div></div>
  <div style="position:absolute;left:540px;right:0;top:0;bottom:200px;padding:0 56px;display:flex;flex-direction:column;justify-content:center;gap:36px">
    <div style="${I};font-weight:700;font-size:30px;letter-spacing:.2em;color:${C.brasa}">DEPOIS</div>
    <div style="${T};font-size:78px;line-height:1.02;color:${C.carvao}">Sei o contexto, o autor e a intenção do texto.</div></div>
  <div style="position:absolute;left:470px;top:505px;width:140px;height:140px;border-radius:50%;background:${G};display:flex;align-items:center;justify-content:center;box-shadow:0 14px 34px rgba(0,0,0,.3)"><svg width="64" height="64" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
  <div style="position:absolute;left:0;right:0;bottom:0;height:200px;background:${C.carvao};display:flex;align-items:center;justify-content:space-between;padding:0 70px">${assinatura(true, 30)}${selo('Interpretação Bíblica · 9 aulas', G, '#fff', 26)}</div>`);

// C06 comentário.
const comentario = (px = 1) => `<div style="background:#fff;border-radius:${28 * px}px;padding:${34 * px}px ${38 * px}px;box-shadow:0 30px 60px rgba(43,14,0,.3);display:flex;gap:${22 * px}px;align-items:flex-start">
  <div style="flex:none;width:${84 * px}px;height:${84 * px}px;border-radius:50%;background:#d9d2cc;display:flex;align-items:center;justify-content:center"><svg width="${46 * px}" height="${46 * px}" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4.2" fill="#fff"/><path d="M3.5 21c1-4.3 4.5-6.6 8.5-6.6s7.5 2.3 8.5 6.6" fill="#fff"/></svg></div>
  <div style="flex:1"><div style="${I};font-weight:700;font-size:${28 * px}px;color:#111">Comentário <span style="font-weight:400;color:#8e8e8e;font-size:${24 * px}px">· 2 h</span></div>
  <div style="${I};font-size:${40 * px}px;line-height:1.35;color:#111;margin-top:${8 * px}px">Como eu sei se estou interpretando a Bíblia certo?</div>
  <div style="${I};font-weight:600;font-size:${24 * px}px;color:#8e8e8e;margin-top:${14 * px}px">Responder</div></div>
  <svg width="${34 * px}" height="${34 * px}" viewBox="0 0 24 24" style="flex:none;margin-top:${30 * px}px"><path d="M12 21s-7-4.4-9.3-8.6C1 9 3 5 6.6 5c2 0 3.4 1.1 4.4 2.6C12 6.1 13.4 5 15.4 5 19 5 21 9 20.3 12.4 18 16.6 12 21 12 21z" fill="none" stroke="#8e8e8e" stroke-width="1.8"/></svg></div>`;
feed('C06-comentario', 1, G, `${agua(860, -260, -200, 'rgba(255,255,255,.08)')}
  <div style="position:absolute;left:80px;right:80px;top:150px">${kick('A pergunta que mais recebemos', '#fff')}</div>
  <div style="position:absolute;left:70px;right:70px;top:250px;transform:rotate(-2deg)">${comentario()}</div>
  <div style="position:absolute;left:80px;right:80px;top:720px">${tit('Existem regras.', 120, '#fff')}${tit(`E elas cabem<br>em <span style="background:${C.carvao};color:${C.creme};padding:0 .1em">9 aulas.</span>`, 120, '#fff', 'margin-top:10px')}</div>
  ${rodape(true)}`);

// ======================== LINHA 2 · Responder com segurança e vida intelectual ========================
// C07 legendas do Reels (stories 1080×1920), uma frase por tela.
const legendaReels = (n, tot, bg, escuro, html) => story('C07-reels-travou', n, bg, `${html}${agua(1000, -300, -160, escuro ? 'rgba(255,255,255,.07)' : 'rgba(255,77,0,.06)')}
  <div style="position:absolute;left:80px;right:80px;bottom:180px;display:flex;justify-content:space-between;align-items:flex-end">${assinatura(escuro, 30)}<span style="${I};font-weight:700;font-size:26px;color:${escuro ? 'rgba(255,255,255,.7)' : 'rgba(43,14,0,.5)'}">${n}/${tot}</span></div>`);
const centro = (html, top = 0) => `<div style="position:absolute;left:80px;right:80px;top:${top}px;bottom:0;display:flex;flex-direction:column;justify-content:center;gap:40px">${html}</div>`;
[
  [C.carvao, true, centro(`${kick('0 a 3 segundos', C.laranja)}${tit('Alguém já te<br>perguntou algo<br>da Bíblia e você<br><span style="background:' + G + ';padding:0 .1em">travou?</span>', 128, '#fff')}`, -120)],
  [C.creme, false, centro(`${tit('Não é falta<br>de fé.', 150, C.carvao)}${tit(`É falta de estudo<br><span style="background:${G};color:#fff;padding:0 .1em">organizado.</span>`, 110, C.carvao)}`, -120)],
  [G, true, centro(`${tit('Entenda o texto<br>bem o suficiente<br>pra responder<br>com segurança.', 118, '#fff')}<div style="${I};font-weight:600;font-size:46px;line-height:1.4;color:#fff">Aprenda a interpretar a Bíblia e a montar sua rotina de estudo.</div>`, -120)],
  [C.carvao, true, centro(`${kick('Formação Bíblica', C.laranja)}${tit('3 cursos<br>25 aulas<br><span style="background:' + G + ';padding:0 .1em">R$ 99</span>', 170, '#fff')}<div style="${I};font-weight:600;font-size:42px;color:${C.creme}">Interpretação Bíblica · Preparação de Sermões · Vida Intelectual</div>`, -120)],
].forEach(([bg, e, html], i, a) => legendaReels(i + 1, a.length, bg, e, html));

// C08 seminário.
feed('C08-seminario', 1, C.carvao, `${agua(900, -260, -230, 'rgba(255,138,0,.08)')}
  <div style="position:absolute;left:80px;right:80px;top:220px">${tit('Você não<br>precisa de<br>seminário pra<br>estudar a Bíblia<br>com profundidade.', 112, C.creme)}
  <div style="${T};font-size:120px;line-height:1;margin-top:50px;background:${G};-webkit-background-clip:text;background-clip:text;color:transparent;display:inline-block">Precisa de método.</div></div>
  ${rodape(true)}`);

// C09 nativo: caderno + checklist pela metade.
const check = (t, ok) => `<div style="display:flex;gap:22px;align-items:center;${I};font-weight:600;font-size:36px;color:${ok ? '#9a8f88' : '#2b0e00'};${ok ? 'text-decoration:line-through;' : ''}"><span style="flex:none;width:46px;height:46px;border-radius:10px;border:3px solid ${ok ? C.brasa : '#c9bdb3'};background:${ok ? C.brasa : '#fff'};display:flex;align-items:center;justify-content:center">${ok ? '<svg width="28" height="28" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}</span>${t}</div>`;
feed('C09-plano-leitura', 1, '#000', `${fotoFundo('caderno-2.jpg', { pos: 'center', escurecer: .45, blur: 3 })}
  <div style="position:absolute;left:70px;right:70px;top:150px">${balao(['Você já começou', '5 planos de leitura', 'e não terminou', 'nenhum?'], { px: 74 })}</div>
  <div style="position:absolute;left:170px;right:120px;top:640px;background:#fffdf8;border-radius:22px;padding:40px 46px;transform:rotate(-3deg);box-shadow:0 30px 60px rgba(0,0,0,.45);display:flex;flex-direction:column;gap:22px">
    <div style="${T};font-size:40px;color:${C.carvao}">Plano de leitura</div>
    ${check('Gênesis 1 a 3', true)}${check('Gênesis 4 a 6', true)}${check('Gênesis 7 a 9', false)}${check('Gênesis 10 a 12', false)}</div>
  <div style="position:absolute;left:70px;right:70px;bottom:190px">${balao(['Aprenda a criar uma rotina de estudo que dura.'], { px: 38, bg: C.brasa, cor: '#fff' })}</div>
  ${rodape(true, selo('Vida Intelectual', C.carvao, C.creme, 24))}`);

// C10 carrossel ler x estudar.
const duas = (ler, est) => `<div style="position:absolute;left:80px;right:80px;top:330px;bottom:220px;display:grid;grid-template-columns:1fr 1fr;gap:30px">
  <div style="background:#fff;border-radius:30px;padding:56px 44px;box-shadow:0 20px 44px rgba(43,14,0,.08)"><div style="${I};font-weight:700;font-size:30px;letter-spacing:.2em;color:#9a8f88">LER</div><div style="${T};font-size:84px;line-height:1.02;color:#9a8f88;margin-top:40px">${ler}</div></div>
  <div style="background:${G};border-radius:30px;padding:56px 44px;box-shadow:0 20px 44px rgba(255,77,0,.3)"><div style="${I};font-weight:700;font-size:30px;letter-spacing:.2em;color:#fff">ESTUDAR</div><div style="${T};font-size:84px;line-height:1.02;color:#fff;margin-top:40px">${est}</div></div></div>`;
const C10 = [
  [C.carvao, true, `<div style="position:absolute;left:80px;right:80px;top:300px">${tit('Ler a Bíblia', 150, '#fff')}<div style="${T};font-size:200px;line-height:.9;color:${C.laranja}">≠</div>${tit('estudar<br>a Bíblia', 150, '#fff')}</div>`],
  [C.creme, false, tit('Ler x estudar', 90, C.carvao, 'position:absolute;left:80px;top:180px') + duas('Passar os olhos', 'Fazer perguntas ao texto')],
  [C.creme, false, tit('Ler x estudar', 90, C.carvao, 'position:absolute;left:80px;top:180px') + duas('Versículo solto', 'Capítulo, livro e contexto')],
  [C.creme, false, tit('Ler x estudar', 90, C.carvao, 'position:absolute;left:80px;top:180px') + duas('Esquece amanhã', 'Anota no caderno')],
  [G, true, `<div style="position:absolute;left:80px;right:80px;top:260px">${tit('Quer sair do<br>"só ler"?', 140, '#fff')}<div style="${I};font-weight:600;font-size:42px;line-height:1.4;color:#fff;margin-top:40px">Método de interpretação e rotina de estudo, em um só lugar.</div><div style="margin-top:60px">${selo(OFERTA, C.carvao, C.creme, 34)}</div></div>`],
];
C10.forEach(([bg, e, html], i) => feed('C10-ler-x-estudar', i + 1, bg, telaBrasa(bg, html, e, i + 1, C10.length)));

// C11 legendas do Reels "rotina de 20 minutos" (stories).
[
  [G, true, centro(`${tit('Como estudar<br>a Bíblia em<br><span style="background:' + C.carvao + ';color:' + C.creme + ';padding:0 .1em">20 minutos</span><br>por dia', 140, '#fff')}<div style="${I};font-weight:600;font-size:46px;color:#fff">(sem largar no 3º dia)</div>`, -120)],
  ...[['1', 'Leia o trecho', 'Um capítulo ou uma parte dele. Sem pressa.'], ['2', 'Responda às 3 perguntas', 'Quem escreveu e pra quem? O que significava pra eles? O que diz o texto ao redor?'], ['3', 'Anote 1 aplicação', 'Uma só, no caderno. É ela que fica.']]
    .map(([n, t, d]) => [C.creme, false, centro(`${numeroGrande(n, C.brasa)}${tit(t, 120, C.carvao)}<div style="${I};font-size:46px;line-height:1.4;color:${C.carvao}">${d}</div>`, -120)]),
  [C.carvao, true, centro(`${tit('O método<br>completo está na<br><span style="background:' + G + ';padding:0 .1em">Formação Bíblica</span>', 120, '#fff')}<div style="${I};font-weight:600;font-size:46px;color:${C.creme}">${OFERTA}</div>`, -120)],
].forEach(([bg, e, html], i, a) => story('C11-reels-20-minutos', i + 1, bg, `${html}${agua(1000, -300, -160, e ? 'rgba(255,255,255,.07)' : 'rgba(255,77,0,.06)')}
  <div style="position:absolute;left:80px;right:80px;bottom:180px;display:flex;justify-content:space-between;align-items:flex-end">${assinatura(e, 30)}<span style="${I};font-weight:700;font-size:26px;color:${e ? 'rgba(255,255,255,.7)' : 'rgba(43,14,0,.5)'}">${i + 1}/${a.length}</span></div>`));

// ================================ LINHA 3 · Preparação de sermões ================================
// C12 nativo: sábado 23h (relógio de tela de bloqueio sobre foto escurecida).
const c12 = (st = false) => `${fotoFundo('biblia-2.jpg', { pos: '55% center', matiz: 'linear-gradient(180deg,rgba(8,4,20,.82),rgba(20,8,2,.62) 50%,rgba(8,4,20,.88))' })}
  <div style="position:absolute;left:0;right:0;top:${st ? 260 : 120}px;text-align:center;color:#fff">
    <div style="${I};font-weight:600;font-size:${st ? 46 : 40}px;opacity:.9">sábado, 23:00</div>
    <div style="${I};font-weight:300;font-size:${st ? 260 : 230}px;line-height:1;letter-spacing:-.02em;margin-top:6px">23:00</div></div>
  <div style="position:absolute;left:70px;right:70px;top:${st ? 760 : 540}px;background:rgba(255,255,255,.88);backdrop-filter:blur(10px);border-radius:34px;padding:30px 34px;display:flex;gap:24px;align-items:center">
    <div style="flex:none;width:84px;height:84px;border-radius:20px;background:${G};display:flex;align-items:center;justify-content:center">${sim('#fff', 50)}</div>
    <div style="flex:1;color:#111"><div style="display:flex;justify-content:space-between;${I};font-size:26px;color:#666"><b style="color:#111">Lembrete</b><span>agora</span></div>
    <div style="${I};font-weight:600;font-size:36px;line-height:1.25;margin-top:4px">O sermão de amanhã ainda não saiu.</div></div></div>
  <div style="position:absolute;left:70px;right:70px;top:${st ? 1080 : 830}px">${balao(['Aprenda um método pra preparar', 'mensagens fiéis ao texto,', 'sem desespero na véspera.'], { px: st ? 46 : 42 })}</div>
  ${st ? `<div style="position:absolute;left:80px;right:80px;bottom:160px;display:flex;justify-content:space-between;align-items:flex-end">${assinatura(true)}${selo('Preparação de Sermões · 10 aulas', G, '#fff', 24)}</div>` : rodape(true, selo('Preparação de Sermões · 10 aulas', G, '#fff', 24))}`;
feed('C12-sabado-23h', 1, '#000', c12());

// C13 carrossel: temático, textual, expositivo.
const icone = k => [`<svg width="150" height="150" viewBox="0 0 48 48"><circle cx="24" cy="24" r="10" fill="none" stroke="${C.brasa}" stroke-width="3"/><circle cx="9" cy="10" r="4" fill="${C.brasa}"/><circle cx="40" cy="12" r="4" fill="${C.brasa}"/><circle cx="38" cy="40" r="4" fill="${C.brasa}"/><circle cx="8" cy="38" r="4" fill="${C.brasa}"/></svg>`,
  `<svg width="150" height="150" viewBox="0 0 48 48"><rect x="6" y="20" width="36" height="8" rx="4" fill="${C.brasa}"/><path d="M14 28v12M24 28v12M34 28v12" stroke="${C.brasa}" stroke-width="3" stroke-linecap="round"/></svg>`,
  `<svg width="150" height="150" viewBox="0 0 48 48"><rect x="8" y="6" width="32" height="36" rx="4" fill="none" stroke="${C.brasa}" stroke-width="3"/><path d="M14 15h20M14 22h20M14 29h20M14 36h12" stroke="${C.brasa}" stroke-width="3" stroke-linecap="round"/></svg>`][k];
const tipos = [['Temático', 'Parte de um tema e reúne textos da Bíblia que falam sobre ele.'], ['Textual', 'Parte de um texto curto, de onde saem o tema e as divisões da mensagem.'], ['Expositivo', 'Explica uma passagem seguindo a estrutura e a intenção do próprio texto.']];
const C13 = [[G, true, `<div style="position:absolute;left:80px;right:80px;top:250px">${kick('Para quem prega ou ensina', '#fff')}${tit('Temático,<br>textual ou<br>expositivo?', 150, '#fff', 'margin-top:30px')}<div style="${I};font-weight:600;font-size:42px;color:#fff;margin-top:40px">Você sabe a diferença?</div></div>`]];
tipos.forEach(([t, d], k) => C13.push([C.creme, false, `<div style="position:absolute;left:80px;right:80px;top:220px">${icone(k)}<div style="${I};font-weight:700;font-size:30px;letter-spacing:.16em;color:${C.brasa};margin-top:30px">SERMÃO</div>${tit(t, 150, C.carvao, 'margin-top:6px')}<div style="${I};font-size:44px;line-height:1.45;color:${C.carvao};margin-top:40px;max-width:880px">${d}</div></div>`]));
C13.push([C.carvao, true, `<div style="position:absolute;left:80px;right:80px;top:300px">${tit('Saber qual<br>usar muda a sua<br>pregação.', 140, '#fff')}</div>`]);
C13.push([G, true, `<div style="position:absolute;left:80px;right:80px;top:260px">${tit('Preparação<br>de Sermões', 150, '#fff')}<div style="${I};font-weight:600;font-size:42px;line-height:1.4;color:#fff;margin-top:40px">10 aulas, junto com Interpretação Bíblica e Vida Intelectual.</div><div style="margin-top:60px">${selo(OFERTA, C.carvao, C.creme, 34)}</div></div>`]);
C13.forEach(([bg, e, html], i) => feed('C13-tipos-de-sermao', i + 1, bg, telaBrasa(bg, html, e, i + 1, C13.length)));

// C14 eixo do sermão.
feed('C14-eixo', 1, C.creme, `<svg width="1080" height="1350" style="position:absolute;inset:0">
  <line x1="540" y1="560" x2="540" y2="1180" stroke="#FF4D00" stroke-width="14" stroke-linecap="round"/>
  <defs><linearGradient id="gx" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.brasa}"/><stop offset="1" stop-color="${C.laranja}"/></linearGradient></defs>
  ${[[680, -1], [820, 1], [960, -1], [1090, 1]].map(([y, s]) => `<path d="M540 ${y} C ${540 + s * 120} ${y} ${540 + s * 160} ${y - 40} ${540 + s * 300} ${y - 40}" fill="none" stroke="${C.carvao}" stroke-opacity=".35" stroke-width="5"/><circle cx="${540 + s * 300}" cy="${y - 40}" r="16" fill="${C.carvao}" fill-opacity=".55"/>`).join('')}
  <circle cx="540" cy="560" r="34" fill="${C.brasa}"/></svg>
  <div style="position:absolute;left:80px;right:80px;top:140px;text-align:center">${tit('Todo bom sermão<br>tem um <span style="background:' + G + ';color:#fff;padding:0 .1em">eixo.</span>', 104, C.carvao)}
  <div style="${I};font-weight:600;font-size:44px;color:${C.carvao};margin-top:30px">Você sabe qual é o do seu?</div></div>
  ${rodape(false, selo('Preparação de Sermões', C.carvao, C.creme, 24))}`);

// C15 carrossel: 5 erros.
const e15 = [['Usar o texto como trampolim', 'Ler o versículo e falar de outra coisa.'], ['Ter 3 ideias sem conexão', 'Pontos soltos, sem um eixo que os una.'], ['Ilustração maior que a mensagem', 'A história fica, o texto é esquecido.'], ['Aplicação genérica', '"Sejamos pessoas melhores" não muda ninguém.'], ['Não estudar o contexto', 'Sem contexto, a mensagem perde a base.']];
const C15 = [[C.carvao, true, `<div style="position:absolute;left:80px;right:80px;top:280px">${tit('5 erros que<br><span style="background:' + G + ';padding:0 .1em">esvaziam</span><br>um sermão', 150, '#fff')}</div>`]];
e15.forEach(([t, d], k) => C15.push([C.creme, false, `<div style="position:absolute;left:80px;right:80px;top:200px">${numeroGrande(k + 1, C.brasa)}${tit(t, 108, C.carvao, 'margin-top:40px')}<div style="${I};font-size:42px;line-height:1.45;color:${C.carvao};margin-top:36px;max-width:880px">${d}</div></div>`]));
C15.push([G, true, `<div style="position:absolute;left:80px;right:80px;top:260px">${tit('Prepare<br>mensagens fiéis<br>ao texto.', 140, '#fff')}<div style="${I};font-weight:600;font-size:42px;color:#fff;margin-top:40px">Preparação de Sermões · 10 aulas</div><div style="margin-top:60px">${selo(OFERTA, C.carvao, C.creme, 34)}</div></div>`]);
C15.forEach(([bg, e, html], i) => feed('C15-5-erros-sermao', i + 1, bg, telaBrasa(bg, html, e, i + 1, C15.length)));

// C16 nativo: grupo de estudo desfocado.
feed('C16-celula-ebd', 1, '#000', `${fotoFundo('grupo-0.jpg', { pos: 'center', escurecer: .45, blur: 16 })}
  <div style="position:absolute;left:70px;right:70px;top:260px">${balao(['Você ensina', 'na célula', 'ou na EBD?'], { px: 108 })}</div>
  <div style="position:absolute;left:70px;right:70px;top:780px">${balao(['Aprenda a preparar estudos', 'fiéis ao texto.'], { px: 50, bg: C.brasa, cor: '#fff' })}</div>
  ${rodape(true)}`);

// ================================== LINHA 4 · Oferta e prova ==================================
const capaCurso = (t, aulas, rot, bg) => `<div style="width:296px;height:390px;border-radius:18px;background:${bg};padding:30px 26px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 30px 60px rgba(0,0,0,.35);transform:rotate(${rot}deg);position:relative;overflow:hidden">
  ${sim('rgba(255,255,255,.12)', 300, 'position:absolute;right:-80px;bottom:-70px')}
  <div style="${I};font-weight:700;font-size:20px;letter-spacing:.16em;color:rgba(255,255,255,.85)">CURSO</div>
  <div style="${T};font-size:29px;line-height:1.02;color:#fff;position:relative">${t}</div>
  <div style="${I};font-weight:700;font-size:22px;color:#fff;position:relative">${aulas}</div></div>`;
const c17 = (st = false) => `${agua(st ? 1100 : 900, -300, -220, 'rgba(255,255,255,.07)')}
  <div style="position:absolute;left:80px;right:80px;top:${st ? 240 : 110}px">${kick('Formação Bíblica', C.laranja)}${tit('3 cursos por<br><span style="background:' + G + ';padding:0 .1em">R$ 99</span>', st ? 150 : 128, '#fff', 'margin-top:20px')}</div>
  <div style="position:absolute;left:0;right:0;top:${st ? 720 : 520}px;display:flex;justify-content:center;gap:0">
    <div style="margin-right:-6px;margin-top:30px">${capaCurso('Interpretação<br>Bíblica', '9 aulas', -6, G)}</div>
    <div style="z-index:2">${capaCurso('Preparação<br>de Sermões', '10 aulas', 0, '#7a2a00')}</div>
    <div style="margin-left:-6px;margin-top:30px">${capaCurso('Vida<br>Intelectual', '6 aulas', 6, '#4a1a00')}</div></div>
  <div style="position:absolute;right:70px;top:${st ? 640 : 455}px;z-index:3;width:210px;height:210px;border-radius:50%;background:${C.creme};color:${C.carvao};display:flex;flex-direction:column;align-items:center;justify-content:center;transform:rotate(10deg);box-shadow:0 18px 40px rgba(0,0,0,.35)"><div style="${T};font-size:64px;line-height:.9">R$ 99</div><div style="${I};font-weight:700;font-size:20px;text-align:center;line-height:1.2;margin-top:6px">pagamento<br>único</div></div>
  <div style="position:absolute;left:80px;right:80px;top:${st ? 1200 : 980}px;display:grid;grid-template-columns:1fr 1fr;gap:16px 30px">${['25 aulas gravadas', 'Caderno de estudos', 'Devocional bônus', 'Assista no celular'].map(t => `<div style="display:flex;gap:14px;align-items:center;${I};font-weight:600;font-size:${st ? 36 : 32}px;color:${C.creme}"><svg width="34" height="34" viewBox="0 0 24 24" style="flex:none"><circle cx="12" cy="12" r="11" fill="${C.laranja}"/><path d="M6.5 12.5l3.5 3.5 7.5-8" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>${t}</div>`).join('')}</div>
  <div style="position:absolute;left:80px;right:80px;bottom:${st ? 170 : 70}px">${assinatura(true, 28)}</div>`;
feed('C17-oferta', 1, C.carvao, c17());

// C18 moldura para gravação de tela (fundo transparente no meio).
add('C18-moldura-tela', 1, 1080, 1920, `<div class="p" style="position:relative;width:1080px;height:1920px;overflow:hidden">
  <div style="position:absolute;left:0;right:0;top:0;height:420px;background:linear-gradient(180deg,${C.carvao} 0%,${C.carvao} 70%,rgba(43,14,0,0));"></div>
  <div style="position:absolute;left:80px;right:80px;top:150px">${tit('Isso é o que você<br>recebe por <span style="background:' + G + ';padding:0 .1em">R$ 99.</span>', 96, '#fff')}</div>
  <div style="position:absolute;left:0;right:0;bottom:0;height:380px;background:linear-gradient(0deg,${C.carvao} 0%,${C.carvao} 65%,rgba(43,14,0,0));"></div>
  <div style="position:absolute;left:80px;right:80px;bottom:150px;display:flex;justify-content:space-between;align-items:flex-end">${assinatura(true, 28)}${selo(OFERTA, G, '#fff', 24)}</div></div>`);

// C19 autoridade (sem foto: falta a foto real do Renato).
feed('C19-professor', 1, C.carvao, `${agua(900, -240, -200, 'rgba(255,138,0,.08)')}
  <div style="position:absolute;left:80px;right:80px;top:170px">${kick('Quem ensina', C.laranja)}
  ${tit('Pastor,<br>professor e<br>mestre em<br>Teologia.', 128, '#fff', 'margin-top:24px')}
  <div style="${I};font-weight:600;font-size:44px;line-height:1.4;color:${C.creme};margin-top:40px">Agora ensinando você a estudar a Bíblia.</div>
  <div style="margin-top:50px;display:flex;flex-direction:column;align-items:flex-start;gap:14px">${selo('Pr. Renato Torres', G, '#fff', 30)}<div style="${I};font-size:30px;line-height:1.5;color:rgba(255,244,232,.8)">Mestre em Teologia Ministerial<br>Mestre em Ensino de Ciências</div></div></div>
  ${rodape(true, selo('Formação Bíblica · ' + PRECO, C.creme, C.carvao, 26))}`);

// C20 prova social.
const c20 = (st = false) => `${agua(st ? 1100 : 900, -260, -200, 'rgba(255,77,0,.07)')}
  <div style="position:absolute;left:80px;right:80px;top:${st ? 380 : 190}px">
    <div style="${T};font-size:${st ? 420 : 380}px;line-height:.82;background:${G};-webkit-background-clip:text;background-clip:text;color:transparent;display:inline-block">100+</div>
    <div style="${T};font-size:${st ? 88 : 80}px;line-height:1;color:${C.carvao};margin-top:30px">pessoas entraram na Formação Bíblica na primeira semana.</div>
    <div style="${I};font-weight:600;font-size:${st ? 52 : 46}px;color:${C.brasa};margin-top:40px">Você vem?</div></div>
  <div style="position:absolute;left:80px;right:80px;bottom:${st ? 170 : 70}px;display:flex;justify-content:space-between;align-items:flex-end">${assinatura(false, 28)}${selo(OFERTA, C.carvao, C.creme, 24)}</div>`;
feed('C20-100-alunos', 1, C.creme, c20());

// Stories das 5 prioridades (C07 já é stories).
story('S-C01-jeremias', 1, '#000', c01(null, true));
story('S-C12-sabado-23h', 1, '#000', c12(true));
story('S-C17-oferta', 1, C.carvao, c17(true));
story('S-C20-100-alunos', 1, C.creme, c20(true));

// ============================================ RENDER ============================================
const launch = { executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' };
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
fs.mkdirSync(path.join(raiz, 'build'), { recursive: true });
let n = 0;
for (const p of P) {
  if (filtro && !p.id.includes(filtro)) continue;
  const transp = p.id.startsWith('C18');
  const hp = path.join(raiz, 'build', `${p.id}-${p.n}.html`);
  fs.writeFileSync(hp, `<!doctype html><html><head>${HEAD}<style>body{background:${transp ? 'transparent' : '#000'}}</style></head><body>${p.html}</body></html>`);
  const page = await browser.newPage({ viewport: { width: p.w, height: p.h } });
  await page.goto('file://' + hp); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(250);
  const out = path.join(raiz, 'saida', p.id); fs.mkdirSync(out, { recursive: true });
  await page.screenshot({ path: path.join(out, `${p.n}.png`), omitBackground: transp });
  await page.close(); n++;
}
await browser.close();
console.log('ok', n);

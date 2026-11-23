// Anúncios A1–A14 da Formação Bíblica na identidade "Brasa" do Pastor Renato Torres (degradê laranja, creme, carvão,
// Bricolage Grotesque, símbolo V), com um formato diferente por arte. Textos do documento "Prompts de artes · Formação Bíblica".
// Uso: node brasa.mjs [filtro]   (nuvem: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node brasa.mjs)
// Saída: saida-brasa/feed/A1.png, A2-1.png… e saida-brasa/stories/…  (fotos: ../renato-criativos/fotos, fora do git)
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { C, G, T, HEAD, sim, esc } from '../renato-comum/brasa.mjs';
const req = createRequire(import.meta.url);
let chromium; try { ({ chromium } = req('playwright')); } catch { ({ chromium } = req('/opt/node-tools/node_modules/playwright')); }
const root = path.dirname(new URL(import.meta.url).pathname);
const filtro = process.argv[2] || '';
const foto = n => 'file://' + path.join(root, '..', 'renato-criativos', 'fotos', n);
const I = "font-family:Inter,sans-serif";
const FMT = { feed: { w: 1080, h: 1350, t: 110, b: 150 }, stories: { w: 1080, h: 1920, t: 300, b: 360 } };
const M = 80;

// Peças comuns ------------------------------------------------------------------------------------------------
const tit = (s, px, cor = '#fff', extra = '') => `<div style="${T};font-size:${px}px;line-height:.98;color:${cor};${extra}">${s}</div>`;
const caixa = (s, bg = C.carvao, fg = '#fff') => `<span style="background:${bg};color:${fg};padding:0 .12em;box-decoration-break:clone;-webkit-box-decoration-break:clone">${s}</span>`;
const kick = (s, cor = C.brasa) => `<div style="${I};font-weight:700;font-size:26px;letter-spacing:.18em;text-transform:uppercase;color:${cor}">${s}</div>`;
const apoio = (s, px = 36, cor = C.carvao, extra = '') => `<div style="${I};font-weight:500;font-size:${px}px;line-height:1.4;color:${cor};${extra}">${s}</div>`;
const pilula = (s, bg = C.carvao, fg = '#fff', px = 28) => `<span style="display:inline-block;${I};font-weight:700;font-size:${px}px;background:${bg};color:${fg};padding:${px * .55}px ${px * 1.1}px;border-radius:999px;white-space:nowrap">${s}</span>`;
const agua = (px, r, b, cor) => sim(cor, px, `position:absolute;right:${r}px;bottom:${b}px`);
// Rodapé: V + Formação Bíblica · Ponto do Verbum (lote 1 não cita o pastor).
const rodape = (F, escuro, dir = '') => `<div style="position:absolute;left:${M}px;right:${M}px;bottom:${F.b - 90}px;display:flex;align-items:center;justify-content:space-between;z-index:6">
  <div style="display:flex;align-items:center;gap:14px">${sim(escuro ? '#fff' : C.brasa, 40)}<span style="${I};font-weight:700;font-size:21px;letter-spacing:.12em;text-transform:uppercase;color:${escuro ? '#fff' : C.carvao}">Formação Bíblica · Ponto do Verbum</span></div>${dir}</div>`;
const pagina = (n, tot, escuro) => `<span style="${I};font-weight:600;font-size:22px;color:${escuro ? 'rgba(255,255,255,.75)' : 'rgba(43,14,0,.5)'}">${n}/${tot}</span>`;
const tela = (fmt, bg, escuro, corpo, dir = '') => { const F = FMT[fmt]; return `<div style="position:relative;width:${F.w}px;height:${F.h}px;overflow:hidden;background:${bg}">${corpo(F)}${rodape(F, escuro, dir)}</div>`; };
const fotoFundo = (n, pos, veu) => `<div style="position:absolute;inset:0;background:url('${foto(n)}') ${pos}/cover"></div><div style="position:absolute;inset:0;background:${veu}"></div>`;
// Balões no estilo do texto nativo do Instagram.
const balao = (linhas, px = 54, bg = '#fff', cor = '#111') => `<div style="display:flex;flex-direction:column;align-items:flex-start">${linhas.map((l, i) => `<span style="${I};font-weight:600;font-size:${px}px;line-height:1.18;background:${bg};color:${cor};padding:${px * .1}px ${px * .28}px;border-radius:${px * .22}px;${i ? `margin-top:-${px * .06}px` : ''}">${l}</span>`).join('')}</div>`;
const meio = (F, html, extra = '') => `<div style="position:absolute;left:${M}px;right:${M}px;top:${F.t}px;bottom:${F.b}px;display:flex;flex-direction:column;justify-content:center;${extra}">${html}</div>`;
const st = f => f === 'stories';

const A = {};
// A1 · foto da Bíblia aberta + balões nativos
A.A1 = f => tela(f, C.carvao, true, F => `${fotoFundo('pagina-1.jpg', 'center', 'linear-gradient(180deg,rgba(20,6,0,.25),rgba(20,6,0,.72))')}
  ${meio(F, `${balao(['Ler a Bíblia é', 'diferente de', 'estudar a Bíblia.'], st(f) ? 96 : 86)}
    <div style="margin-top:34px">${balao(['Estudar é fazer perguntas ao texto:', 'quem escreveu, para quem e por quê.'], st(f) ? 42 : 38, C.brasa, '#fff')}</div>
    <div style="margin-top:44px">${pilula('Interpretação Bíblica · 9 aulas', '#fff', C.carvao)}</div>`)}`);

// A2 · carrossel de 5 telas: capa degradê, números gigantes, fecho carvão
A['A2-1'] = f => tela(f, G, true, F => `${agua(900, -260, -200, 'rgba(255,255,255,.08)')}
  ${meio(F, `${kick('Antes de ler um versículo', '#fff')}<div style="height:26px"></div>${tit(`${caixa('3 perguntas')}<br>para fazer antes<br>de ler um<br>versículo`, st(f) ? 124 : 112)}`)}`, pagina(1, 5, true));
const pergunta = (n, s, bg, escuro, i) => f => tela(f, bg, escuro, F => `
  <div style="position:absolute;right:-30px;top:${F.t - 40}px;${T};font-size:${st(f) ? 980 : 820}px;line-height:.8;color:${escuro ? 'rgba(255,255,255,.12)' : 'rgba(255,77,0,.12)'}">${n}</div>
  ${meio(F, `<div style="${T};font-size:${st(f) ? 230 : 200}px;line-height:.85;color:${escuro ? '#fff' : C.brasa}">${n}</div>${tit(s, st(f) ? 124 : 108, escuro ? '#fff' : C.carvao, 'margin-top:40px;max-width:900px')}`)}`, pagina(i, 5, escuro));
A['A2-2'] = pergunta('1', 'Quem escreveu, e para quem?', C.creme, false, 2);
A['A2-3'] = pergunta('2', 'O que isso significava para os primeiros leitores?', G, true, 3);
A['A2-4'] = pergunta('3', 'O que dizem os versículos ao redor?', C.creme, false, 4);
A['A2-5'] = f => tela(f, C.carvao, true, F => `${agua(900, -260, -200, 'rgba(255,138,0,.08)')}
  ${meio(F, `${tit(`Isso se chama<br>${caixa('hermenêutica.', G)}<br>E pode ser<br>aprendido.`, st(f) ? 118 : 104)}<div style="margin-top:56px">${pilula('3 cursos · 25 aulas · R$ 99', G)}</div>`)}`, pagina(5, 5, true));

// A3 · carrossel de 6 telas: capa com foto de livros, cartões de cuidado
A['A3-1'] = f => tela(f, C.carvao, true, F => `${fotoFundo('livros-0.jpg', 'center', 'linear-gradient(180deg,rgba(43,14,0,.35),rgba(43,14,0,.9))')}
  <div style="position:absolute;left:${M}px;right:${M}px;bottom:${F.b + 40}px">${kick('Ao ler a Bíblia', C.laranja)}<div style="height:22px"></div>${tit(`4 cuidados<br>ao ler a<br>${caixa('Bíblia', G)}`, st(f) ? 150 : 136)}</div>`, pagina(1, 6, true));
const cuidado = (i, tot, s, ic) => f => tela(f, C.creme, false, F => `${agua(st(f) ? 1000 : 800, -260, -200, 'rgba(255,77,0,.06)')}
  ${meio(F, `<div style="background:#fff;border-radius:40px;padding:${st(f) ? 70 : 60}px;box-shadow:0 40px 80px -40px rgba(43,14,0,.35)">
    <div style="display:flex;justify-content:space-between;align-items:center"><div style="width:110px;height:110px;border-radius:30px;background:${G};display:grid;place-items:center">${ic}</div>
      <span style="${T};font-size:64px;color:rgba(255,77,0,.25)">${String(i).padStart(2, '0')}</span></div>
    ${tit(s, st(f) ? 116 : 104, C.carvao, 'margin-top:56px')}</div>`)}`, pagina(i + 1, tot, false));
const ICO = {
  lupa: '<svg width="58" height="58" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>',
  globo: '<svg width="58" height="58" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/></svg>',
  livro: '<svg width="58" height="58" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"><path d="M4 4h7a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4zM20 4h-7a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h7z"/></svg>',
  pena: '<svg width="58" height="58" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M20 4C12 4 6 10 5 19M20 4c-1 7-6 11-12 11M9 15l-4 4"/></svg>',
  alvo: '<svg width="58" height="58" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="#fff"/></svg>',
  luz: '<svg width="58" height="58" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/></svg>',
  mao: '<svg width="58" height="58" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 4 10-10"/></svg>',
};
A['A3-2'] = cuidado(1, 6, 'Ler o versículo dentro do capítulo', ICO.lupa);
A['A3-3'] = cuidado(2, 6, 'Lembrar a cultura e a época do texto', ICO.globo);
A['A3-4'] = cuidado(3, 6, 'Distinguir narrativa de ensinamento', ICO.livro);
A['A3-5'] = cuidado(4, 6, 'Reconhecer o gênero: poesia, carta, profecia', ICO.pena);
A['A3-6'] = f => tela(f, G, true, F => `${agua(900, -260, -200, 'rgba(255,255,255,.08)')}
  ${meio(F, `${tit(`Aprenda o<br>${caixa('método')}<br>completo`, st(f) ? 160 : 140)}<div style="margin-top:56px">${pilula('Formação Bíblica · R$ 99', C.carvao)}</div>`)}`, pagina(6, 6, true));

// A4 · antes e depois como conversa
A.A4 = f => tela(f, C.creme, false, F => {
  const msg = (rot, s, bg, cor, lado) => `<div style="display:flex;flex-direction:column;align-items:${lado}">
      <div style="${I};font-weight:700;font-size:24px;letter-spacing:.18em;color:${rot === 'ANTES' ? '#9A8F88' : C.brasa};margin:0 14px 12px">${rot}</div>
      <div style="max-width:800px;background:${bg};color:${cor};border-radius:${lado === 'flex-start' ? '44px 44px 44px 10px' : '44px 44px 10px 44px'};padding:44px 50px;${T};font-size:${st(f) ? 84 : 72}px;line-height:1.02">${s}</div></div>`;
  return `${agua(900, -260, -200, 'rgba(255,77,0,.06)')}${meio(F, `${msg('ANTES', 'Leio um versículo solto e tiro minhas conclusões.', '#E9E1D8', '#7A6E68', 'flex-start')}
    <div style="height:${st(f) ? 90 : 60}px"></div>${msg('DEPOIS', 'Leio o contexto, o autor e a intenção do texto.', G, '#fff', 'flex-end')}
    <div style="margin-top:${st(f) ? 90 : 60}px">${pilula('Interpretação Bíblica · 9 aulas')}</div>`)}`;
});

// A5 · carvão com a palavra contexto em destaque e faixa de página
A.A5 = f => tela(f, C.carvao, true, F => `<div style="position:absolute;left:0;right:0;bottom:0;height:${st(f) ? 700 : 470}px;background:url('${foto('pagina-1.jpg')}') center 40%/cover;opacity:.55"></div>
  <div style="position:absolute;left:0;right:0;bottom:0;height:${st(f) ? 700 : 470}px;background:linear-gradient(180deg,${C.carvao},rgba(43,14,0,.35))"></div>
  <div style="position:absolute;left:${M}px;right:${M}px;top:${F.t + (st(f) ? 80 : 40)}px">${tit(`Toda passagem<br>tem um<br>${caixa('contexto.', G)}`, st(f) ? 150 : 132)}
    ${apoio('Aprenda a lê-lo com método e segurança.', st(f) ? 42 : 38, '#fff', 'margin-top:44px')}
    <div style="margin-top:44px">${pilula('3 cursos · 25 aulas · R$ 99', '#fff', C.carvao)}</div></div>`);

// A6 · figurinha de pergunta dos stories sobre foto de caderno
A.A6 = f => tela(f, C.carvao, true, F => `${fotoFundo('caderno-2.jpg', 'center', 'rgba(43,14,0,.45)')}
  ${meio(F, `<div style="background:#fff;border-radius:44px;overflow:hidden;box-shadow:0 40px 90px -30px rgba(0,0,0,.6)">
      <div style="background:${G};padding:${st(f) ? 64 : 54}px 56px">${tit('Você ensina na célula ou na Escola Bíblica?', st(f) ? 84 : 74)}</div>
      <div style="padding:46px 56px">${apoio('Aprenda a preparar estudos fiéis ao texto, do esboço à aplicação.', st(f) ? 40 : 36)}
      <div style="margin-top:38px">${pilula('Preparação de Sermões · 10 aulas', C.carvao)}</div></div></div>`)}`);

// A7 · carrossel de 5 telas: tipos de sermão com diagrama simples
A['A7-1'] = f => tela(f, C.carvao, true, F => `${agua(900, -260, -200, 'rgba(255,138,0,.08)')}
  ${meio(F, `${kick('Para quem prega', C.laranja)}<div style="height:26px"></div>${tit(`Sermão<br>${caixa('temático,', G)}<br>${caixa('textual', G)} ou<br>${caixa('expositivo:', G)}<br>qual a diferença?`, st(f) ? 116 : 102)}`)}`, pagina(1, 5, true));
const diag = { tem: [[0, 0], [1, 0], [2, 0]], tex: [[1, 0]], exp: [[0, 0], [1, 0], [2, 0]] };
const tipo = (i, nome, def, svg) => f => tela(f, i % 2 ? C.creme : G, !(i % 2), F => `
  ${meio(F, `<div style="height:${st(f) ? 260 : 220}px;display:flex;align-items:center">${svg(i % 2 ? C.brasa : '#fff')}</div>
    <div style="margin-top:40px">${pilula(nome, i % 2 ? G : C.carvao, '#fff', 34)}</div>
    ${tit(def, st(f) ? 116 : 100, i % 2 ? C.carvao : '#fff', 'margin-top:40px')}`)}`, pagina(i, 5, !(i % 2)));
const svgTem = c => `<svg width="520" height="200" viewBox="0 0 520 200"><circle cx="260" cy="100" r="44" fill="${c}"/>${[60, 160, 360, 460].map(x => `<rect x="${x - 34}" y="${x % 200 === 60 ? 20 : 120}" width="68" height="60" rx="10" fill="none" stroke="${c}" stroke-width="5"/><line x1="${x}" y1="${x % 200 === 60 ? 80 : 120}" x2="260" y2="100" stroke="${c}" stroke-width="4"/>`).join('')}</svg>`;
const svgTex = c => `<svg width="520" height="200" viewBox="0 0 520 200"><rect x="40" y="70" width="120" height="60" rx="12" fill="${c}"/>${[0, 1, 2].map(k => `<line x1="160" y1="100" x2="330" y2="${40 + k * 60}" stroke="${c}" stroke-width="4"/><circle cx="350" cy="${40 + k * 60}" r="20" fill="none" stroke="${c}" stroke-width="5"/>`).join('')}</svg>`;
const svgExp = c => `<svg width="560" height="200" viewBox="0 0 560 200">${[0, 1, 2, 3].map(k => `<rect x="${20 + k * 135}" y="70" width="100" height="60" rx="12" fill="${k === 0 ? c : 'none'}" stroke="${c}" stroke-width="5"/>${k < 3 ? `<path d="M${125 + k * 135} 100h20m-8-8l8 8-8 8" fill="none" stroke="${c}" stroke-width="4"/>` : ''}`).join('')}</svg>`;
A['A7-2'] = tipo(2, 'Temático', 'Parte de um assunto e reúne textos sobre ele.', svgTem);
A['A7-3'] = tipo(3, 'Textual', 'As ideias principais saem de um texto curto.', svgTex);
A['A7-4'] = tipo(4, 'Expositivo', 'Explica uma passagem na sequência em que foi escrita.', svgExp);
A['A7-5'] = f => tela(f, C.carvao, true, F => `${agua(900, -260, -200, 'rgba(255,138,0,.08)')}
  ${meio(F, `${tit(`Saber quando usar cada um ${caixa('muda a sua pregação.', G)}`, st(f) ? 112 : 98)}<div style="margin-top:56px">${pilula('Preparação de Sermões · 10 aulas', G)}</div>`)}`, pagina(5, 5, true));

// A8 · eixo: linha laranja vertical com três ramos
A.A8 = f => tela(f, C.creme, false, F => {
  const h = st(f) ? 760 : 560, y0 = 0;
  const eixo = `<svg width="920" height="${h}" viewBox="0 0 920 ${h}"><line x1="460" y1="20" x2="460" y2="${h - 10}" stroke="${C.brasa}" stroke-width="8" stroke-linecap="round"/><circle cx="460" cy="30" r="24" fill="${C.brasa}"/>
    ${[.35, .6, .85].map((p, i) => { const y = h * p, d = i % 2 ? 1 : -1; return `<path d="M460 ${y} C ${460 + d * 80} ${y - 10}, ${460 + d * 150} ${y - 60}, ${460 + d * 260} ${y - 70}" fill="none" stroke="${C.carvao}" stroke-width="4" stroke-linecap="round" opacity=".55"/><circle cx="${460 + d * 260}" cy="${y - 70}" r="12" fill="${C.carvao}" opacity=".55"/>`; }).join('')}</svg>`;
  return `<div style="position:absolute;left:${M}px;right:${M}px;top:${F.t + 10}px">${tit(`Todo bom sermão<br>tem um ${caixa('eixo.', G)}`, st(f) ? 112 : 96, C.carvao)}
    ${apoio('Uma ideia central, tirada do texto, que organiza tudo o que você vai dizer.', st(f) ? 40 : 34, C.carvao, 'margin-top:28px;max-width:860px')}</div>
    <div style="position:absolute;left:${M}px;bottom:${F.b + (st(f) ? 160 : 110)}px">${eixo}</div>
    <div style="position:absolute;left:${M}px;bottom:${F.b + 10}px">${pilula('Preparação de Sermões · 10 aulas')}</div>`;
});

// A9 · carrossel de 6 telas: capa carvão, cuidados numerados alternando fundos
A['A9-1'] = f => tela(f, C.carvao, true, F => `${agua(900, -260, -200, 'rgba(255,138,0,.08)')}
  ${meio(F, `${tit(`${caixa('5 cuidados', G)}<br>na preparação<br>de um sermão`, st(f) ? 132 : 118)}`)}`, pagina(1, 6, true));
const passo = (i, s, ic) => f => { const escuro = i % 2 === 0; return tela(f, escuro ? G : C.creme, escuro, F => `
  <div style="position:absolute;left:${M}px;top:${F.t}px;${T};font-size:${st(f) ? 360 : 300}px;line-height:.8;color:${escuro ? 'rgba(255,255,255,.22)' : 'rgba(255,77,0,.16)'}">0${i}</div>
  ${meio(F, `<div style="width:120px;height:120px;border-radius:999px;background:${escuro ? C.carvao : G};display:grid;place-items:center">${ic}</div>${tit(s, st(f) ? 132 : 116, escuro ? '#fff' : C.carvao, 'margin-top:50px')}`, 'padding-top:160px')}`, pagina(i + 1, 6, escuro)); };
A['A9-2'] = passo(1, 'Começar pelo texto, não pela ideia pronta', ICO.livro);
A['A9-3'] = passo(2, 'Ter um eixo claro', ICO.alvo);
A['A9-4'] = passo(3, 'Ilustrar sem tirar o foco da mensagem', ICO.luz);
A['A9-5'] = passo(4, 'Aplicar de forma concreta', ICO.mao);
A['A9-6'] = f => tela(f, C.creme, false, F => `${agua(900, -260, -200, 'rgba(255,77,0,.06)')}
  ${meio(F, `${tit(`Aprenda o<br>${caixa('passo a passo', G)}`, st(f) ? 150 : 132, C.carvao)}<div style="margin-top:56px">${pilula('3 cursos · 25 aulas · R$ 99')}</div>`)}`, pagina(6, 6, false));

// A10 · cartão de plano de estudo sobre foto de caderno
A.A10 = f => tela(f, C.carvao, true, F => `${fotoFundo('caderno-2.jpg', 'center', 'linear-gradient(180deg,rgba(43,14,0,.2),rgba(43,14,0,.8))')}
  <div style="position:absolute;left:${M}px;right:${M}px;top:${F.t + 10}px">${balao(['Uma rotina de estudo', 'que você consegue manter.'], st(f) ? 78 : 68)}</div>
  <div style="position:absolute;left:${M}px;right:${M}px;bottom:${F.b + 30}px;background:#fff;border-radius:36px;padding:48px 52px;box-shadow:0 40px 80px -30px rgba(0,0,0,.6)">
    ${kick('Vida Intelectual · 6 aulas')}
    <div style="margin-top:26px;display:flex;flex-direction:column;gap:20px">${['Plano de leitura', 'Hábitos', 'Organização'].map((s, i) => `<div style="display:flex;align-items:center;gap:22px;${I};font-weight:600;font-size:${st(f) ? 46 : 42}px;color:${C.carvao}"><span style="width:44px;height:44px;border-radius:12px;${i < 2 ? `background:${G}` : `border:3px solid ${C.brasa}`};display:grid;place-items:center">${i < 2 ? '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}</span>${s}</div>`).join('')}</div>
    ${apoio('para estudar a Bíblia com constância.', st(f) ? 34 : 30, '#7A6E68', 'margin-top:24px')}</div>`);

// A11 · degradê com "seminário" riscado e três pílulas
A.A11 = f => tela(f, G, true, F => `${agua(st(f) ? 1100 : 900, -260, -200, 'rgba(255,255,255,.08)')}
  ${meio(F, `${tit(`Estudar a Bíblia com profundidade não exige <span style="text-decoration:line-through;text-decoration-thickness:.09em;text-decoration-color:${C.carvao}">seminário.</span>`, st(f) ? 116 : 100)}
    <div style="${I};font-weight:600;font-size:${st(f) ? 42 : 38}px;color:#fff;margin-top:50px">Exige</div>
    <div style="display:flex;flex-wrap:wrap;gap:16px;margin-top:18px">${['método,', 'rotina', 'e bons materiais.'].map(s => pilula(s, C.carvao, '#fff', st(f) ? 36 : 32)).join('')}</div>
    <div style="margin-top:56px">${pilula('3 cursos · 25 aulas · R$ 99', '#fff', C.carvao)}</div>`)}`);

// A12 · número gigante em degradê
A.A12 = f => tela(f, C.creme, false, F => `${agua(st(f) ? 1100 : 900, -260, -200, 'rgba(255,77,0,.06)')}
  ${meio(F, `<div style="${T};font-size:${st(f) ? 400 : 360}px;line-height:.82;background:${G};-webkit-background-clip:text;color:transparent;letter-spacing:-.06em">100+</div>
    ${tit('pessoas já estudam na Formação Bíblica.', st(f) ? 90 : 80, C.carvao, 'margin-top:40px')}
    <div style="display:flex;flex-wrap:wrap;gap:14px;margin-top:46px">${['Interpretação,', 'preparação de sermões', 'e rotina de estudo.'].map(s => pilula(s, '#fff', C.carvao, st(f) ? 36 : 32)).join('')}</div>`)}`);

// A13 · oferta: três capas de curso em leque + preço
A.A13 = f => tela(f, C.carvao, true, F => {
  const capa = (t, a, rot, bg, i) => `<div style="position:absolute;left:${i * 250}px;top:${[30, 0, 30][i]}px;transform:rotate(${[-6, 0, 6][i]}deg);width:290px;height:390px;border-radius:20px;background:${bg};padding:30px 26px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 30px 60px -20px rgba(0,0,0,.6)">
      <span style="${I};font-weight:700;font-size:18px;letter-spacing:.16em;color:rgba(255,255,255,.75)">CURSO ${i + 1}</span>
      <div>${tit(t, 26, '#fff', 'letter-spacing:-.02em')}<div style="${I};font-weight:600;font-size:22px;color:rgba(255,255,255,.85);margin-top:14px">${a}</div></div></div>`;
  return `${agua(900, -260, -200, 'rgba(255,138,0,.08)')}
  <div style="position:absolute;left:${M}px;right:${M}px;top:${F.t}px">${tit(`3 cursos em uma<br>${caixa('só plataforma', G)}`, st(f) ? 104 : 90)}</div>
  <div style="position:absolute;left:${(1080 - 790) / 2}px;top:${F.t + (st(f) ? 360 : 260)}px;width:790px;height:430px">
    ${capa('Interpretação Bíblica', '9 aulas', 0, G, 0)}${capa('Preparação de Sermões', '10 aulas', 0, '#7A2E10', 1)}${capa('Vida Intelectual', '6 aulas', 0, '#4A1C06', 2)}</div>
  <div style="position:absolute;left:${M}px;right:${M}px;bottom:${F.b + 20}px">
    ${apoio('+ Devocional diário · Caderno de estudos · Assista no celular', st(f) ? 34 : 30, '#fff')}
    <div style="display:flex;align-items:baseline;gap:20px;margin-top:26px">${tit('R$ 99', st(f) ? 130 : 112, C.laranja)}<span style="${I};font-weight:600;font-size:${st(f) ? 36 : 32}px;color:#fff">· pagamento único</span></div></div>`;
});

// A14 · carrossel "por dentro": celular com interface ilustrada (sem prints reais)
const cel = (inner, w = 430) => `<div style="width:${w}px;height:${w * 2.05}px;border-radius:${w * .14}px;background:${C.carvao};padding:${w * .035}px;box-shadow:0 50px 90px -30px rgba(43,14,0,.55)"><div style="width:100%;height:100%;border-radius:${w * .11}px;background:#FFF9F3;overflow:hidden;padding:46px 28px;display:flex;flex-direction:column;gap:18px">${inner}</div></div>`;
const barra = (w, cor = 'rgba(43,14,0,.14)', h = 18) => `<div style="width:${w}%;height:${h}px;border-radius:9px;background:${cor}"></div>`;
const linhaAula = (ok) => `<div style="display:flex;gap:16px;align-items:center;background:#fff;border-radius:18px;padding:18px;box-shadow:0 6px 16px -10px rgba(43,14,0,.3)"><div style="width:70px;height:52px;border-radius:12px;background:${ok ? G : 'rgba(255,77,0,.18)'};flex:none;display:grid;place-items:center"><svg width="20" height="20" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="#fff"/></svg></div><div style="flex:1;display:flex;flex-direction:column;gap:10px">${barra(90)}${barra(55, 'rgba(43,14,0,.08)', 14)}</div></div>`;
const telaCel = (i, txt, inner, bg, escuro) => f => tela(f, bg, escuro, F => `${agua(900, -260, -200, escuro ? 'rgba(255,255,255,.08)' : 'rgba(255,77,0,.06)')}
  <div style="position:absolute;left:${M}px;right:${M}px;top:${F.t}px">${tit(txt, st(f) ? 104 : 88, escuro ? '#fff' : C.carvao)}</div>
  <div style="position:absolute;left:${(1080 - (st(f) ? 400 : 520)) / 2}px;bottom:${st(f) ? F.b + 10 : -420}px">${cel(inner, st(f) ? 400 : 520)}</div>`, pagina(i, 4, escuro));
A['A14-1'] = f => tela(f, G, true, F => `${agua(900, -260, -200, 'rgba(255,255,255,.08)')}
  ${meio(F, `${kick('Por dentro', '#fff')}<div style="height:26px"></div>${tit(`O que você<br>recebe na<br>${caixa('Formação Bíblica')}`, st(f) ? 140 : 124)}`)}`, pagina(1, 4, true));
A['A14-2'] = telaCel(2, '25 aulas gravadas, organizadas em trilhas', `${barra(60, C.brasa, 22)}${[1, 1, 0, 0, 0].map(linhaAula).join('')}`, C.creme, false);
A['A14-3'] = telaCel(3, 'Caderno de estudos e acompanhamento do progresso', `${barra(50, C.brasa, 22)}<div style="background:#fff;border-radius:18px;padding:22px;display:flex;flex-direction:column;gap:14px">${[95, 80, 88, 70, 92, 60].map(w => barra(w, 'rgba(43,14,0,.1)', 14)).join('')}</div>
  <div style="background:#fff;border-radius:18px;padding:22px"><div style="height:22px;border-radius:11px;background:rgba(255,77,0,.15);overflow:hidden"><div style="width:64%;height:100%;background:${G}"></div></div></div>`, C.carvao, true);
A['A14-4'] = f => tela(f, C.creme, false, F => `${agua(900, -260, -200, 'rgba(255,77,0,.06)')}
  ${meio(F, `<div style="width:150px;height:150px;border-radius:44px;background:${G};display:grid;place-items:center">${ICO.luz.replace(/58/g, '84')}</div>
    ${tit(`Devocional diário<br>de ${caixa('bônus', G)}`, st(f) ? 130 : 116, C.carvao, 'margin-top:50px')}<div style="margin-top:56px">${pilula('R$ 99 · pagamento único')}</div>`)}`, pagina(4, 4, false));

// Render -------------------------------------------------------------------------------------------------------
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
for (const fmt of ['feed', 'stories']) {
  const dir = path.join(root, 'saida-brasa', fmt); fs.mkdirSync(dir, { recursive: true });
  for (const [nome, f] of Object.entries(A)) {
    if (filtro && !`${fmt}/${nome}`.includes(filtro)) continue;
    const F = FMT[fmt], hp = path.join(dir, `.${nome}.html`);
    fs.writeFileSync(hp, `<!doctype html><html><head>${HEAD}<style>*{box-sizing:border-box;margin:0;padding:0}</style></head><body>${f(fmt)}</body></html>`);
    const page = await browser.newPage({ viewport: { width: F.w, height: F.h } });
    await page.goto('file://' + hp, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(200);
    const fora = await page.evaluate(([w, h]) => [...document.querySelectorAll('body *')].filter(e => { if (!e.textContent.trim() || e.children.length) return false; const r = e.getBoundingClientRect(); return r.width && (r.right > w - 40 || r.bottom > h - 20); }).map(e => e.textContent.trim().slice(0, 30)), [F.w, F.h]);
    await page.screenshot({ path: path.join(dir, `${nome}.png`) }); await page.close();
    console.log(`✓ ${fmt}/${nome}${fora.length ? `  (verificar: ${fora.join(' | ')})` : ''}`);
  }
}
await browser.close();

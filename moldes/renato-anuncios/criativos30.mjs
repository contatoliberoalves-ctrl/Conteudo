// 30 criativos de venda da Formação Bíblica (Ponto do Verbum, Pastor Renato Torres) na identidade Brasa, 1080×1350.
// Só os fatos do documento de prompts: 3 cursos (Interpretação Bíblica 9 aulas, Preparação de Sermões 10, Vida
// Intelectual 6), 25 aulas gravadas, caderno de estudos, devocional bônus, assistir no celular, R$ 99 pagamento
// único, mais de 100 alunos. Sem urgência falsa, sem promessa espiritual, sem depoimento inventado.
// Fotos (fora do git): fotos/renato-*.jpg e -recorte.png (frames do vídeo dele) e ../renato-criativos/fotos.
// Uso: CHROMIUM_PATH=... RENDER_PROXY=$HTTPS_PROXY node criativos30.mjs  -> saida/criativos30/NN.png e prancha.jpg
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { C, G, T, HEAD, sim } from '../renato-comum/brasa.mjs';
const req = createRequire(import.meta.url);
let chromium; try { ({ chromium } = req('playwright')); } catch { ({ chromium } = req('/opt/node-tools/node_modules/playwright')); }
const root = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(root, 'saida', 'criativos30'); fs.mkdirSync(OUT, { recursive: true });
const FO = n => 'file://' + path.join(root, 'fotos', n);
const FC = n => 'file://' + path.join(root, '..', 'renato-criativos', 'fotos', n);
const I = 'font-family:Inter,sans-serif';
const W = 1080, H = 1350, M = 84;

const tit = (s, px, cor = '#fff', ex = '') => `<div style="${T};font-size:${px}px;line-height:.98;color:${cor};${ex}">${s}</div>`;
const cx = (s, bg = C.carvao, fg = '#fff') => `<span style="background:${bg};color:${fg};padding:0 .12em;box-decoration-break:clone;-webkit-box-decoration-break:clone">${s}</span>`;
const kick = (s, cor = C.brasa) => `<div style="${I};font-weight:700;font-size:26px;letter-spacing:.18em;text-transform:uppercase;color:${cor}">${s}</div>`;
const txt = (s, px = 36, cor = C.carvao, ex = '') => `<div style="${I};font-weight:500;font-size:${px}px;line-height:1.4;color:${cor};${ex}">${s}</div>`;
const pil = (s, bg = C.carvao, fg = '#fff', px = 28) => `<span style="display:inline-block;${I};font-weight:700;font-size:${px}px;background:${bg};color:${fg};padding:${px * .55}px ${px * 1.1}px;border-radius:999px;white-space:nowrap">${s}</span>`;
const agua = (px, r, b, cor) => sim(cor, px, `position:absolute;right:${r}px;bottom:${b}px`);
const pe = (escuro, ex = '') => `<div style="position:absolute;left:${M}px;right:${M}px;bottom:56px;display:flex;align-items:center;justify-content:space-between;z-index:9">
  <div style="display:flex;align-items:center;gap:14px">${sim(escuro ? '#fff' : C.brasa, 38)}<span style="${I};font-weight:700;font-size:21px;letter-spacing:.12em;text-transform:uppercase;color:${escuro ? '#fff' : C.carvao}">Formação Bíblica · Ponto do Verbum</span></div>${ex}</div>`;
const tela = (bg, escuro, corpo, ex = '') => `<div style="position:relative;width:${W}px;height:${H}px;overflow:hidden;background:${bg}">${corpo}${pe(escuro, ex)}</div>`;
const meio = (html, top = 110, bot = 170, ex = '') => `<div style="position:absolute;left:${M}px;right:${M}px;top:${top}px;bottom:${bot}px;display:flex;flex-direction:column;justify-content:center;${ex}">${html}</div>`;
const recorte = (n, h, ex) => `<img src="${FO(n + '-recorte.png')}" style="position:absolute;height:${h}px;${ex}">`;
const fundoFoto = (src, pos, veu) => `<div style="position:absolute;inset:0;background:url('${src}') ${pos}/cover"></div><div style="position:absolute;inset:0;background:${veu}"></div>`;
const balao = (linhas, px = 54, bg = '#fff', cor = '#111') => `<div style="display:flex;flex-direction:column;align-items:flex-start">${linhas.map((l, i) => `<span style="${I};font-weight:600;font-size:${px}px;line-height:1.1;background:${bg};color:${cor};padding:${px * .22}px ${px * .38}px;border-radius:${px * .32}px;margin-top:${i ? -px * .12 : 0}px">${l}</span>`).join('')}</div>`;
const OFERTA = '3 cursos · 25 aulas · R$ 99';
const CURSOS = [['Interpretação Bíblica', '9 aulas'], ['Preparação de Sermões', '10 aulas'], ['Vida Intelectual', '6 aulas']];
const ok = cor => `<span style="flex:none;width:46px;height:46px;border-radius:50%;background:${cor};display:grid;place-items:center"><svg width="24" height="24" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
const check = (itens, cor = C.carvao, ic = C.brasa, px = 40) => `<div style="display:flex;flex-direction:column;gap:24px">${itens.map(t => `<div style="display:flex;gap:22px;align-items:center;${I};font-weight:600;font-size:${px}px;line-height:1.2;color:${cor}">${ok(ic)}<span>${t}</span></div>`).join('')}</div>`;
const avatar = (px, n = 'renato-sorriso') => `<div style="flex:none;width:${px}px;height:${px}px;border-radius:50%;background:url('${FO(n + '.jpg')}') 50% 56%/330% no-repeat"></div>`;
const cel = (inner, w = 420) => `<div style="width:${w}px;height:${w * 2.05}px;border-radius:${w * .14}px;background:${C.carvao};padding:${w * .03}px;box-shadow:0 50px 90px -40px rgba(43,14,0,.6)"><div style="width:100%;height:100%;border-radius:${w * .11}px;background:${C.creme};overflow:hidden;position:relative">${inner}</div></div>`;
const aula = (n, t, feito) => `<div style="display:flex;gap:14px;align-items:center;background:#fff;border-radius:16px;padding:16px;box-shadow:0 6px 16px rgba(43,14,0,.08)"><span style="flex:none;width:40px;height:40px;border-radius:12px;background:${feito ? G : 'rgba(43,14,0,.1)'};display:grid;place-items:center;${I};font-weight:700;font-size:18px;color:${feito ? '#fff' : C.carvao}">${n}</span><span style="${I};font-weight:600;font-size:20px;color:${C.carvao}">${t}</span></div>`;

const A = [];
// ---------- com foto dele ----------
// 1 · recorte sobre degradê, título à esquerda
A.push(['foto-degrade', tela(G, true, `${agua(900, -300, -200, 'rgba(255,255,255,.08)')}${recorte('renato-sorriso', 900, 'right:-120px;bottom:0')}
  ${meio(`${kick('Com o Pastor Renato Torres', '#fff')}<div style="height:24px"></div>${tit(`Aprenda a<br>${cx('estudar', C.carvao)}<br>a Bíblia<br>com método`, 112, '#fff', 'max-width:600px')}<div style="margin-top:44px">${pil(OFERTA, '#fff', C.carvao)}</div>`, 110, 170, 'max-width:620px')}`)]);
// 2 · recorte sobre carvão com convite
A.push(['foto-carvao', tela(C.carvao, true, `${agua(900, -260, -200, 'rgba(255,138,0,.08)')}${recorte('renato-serio', 860, 'right:-140px;bottom:0')}
  ${meio(`${kick('Formação Bíblica', C.laranja)}<div style="height:24px"></div>${tit(`Toda passagem<br>tem um<br>${cx('contexto.', G)}`, 116)}${txt('Vou te ensinar a lê-lo com método e segurança.', 36, C.creme, 'margin-top:36px;max-width:560px')}`, 110, 170, 'max-width:600px')}`)]);
// 3 · tweet dele
A.push(['tweet', tela(C.creme, false, `${agua(900, -260, -200, 'rgba(255,77,0,.06)')}
  ${meio(`<div style="background:#fff;border-radius:36px;padding:52px;box-shadow:0 40px 80px -40px rgba(43,14,0,.35)">
    <div style="display:flex;align-items:center;gap:22px">${avatar(110)}<div style="${I};line-height:1.2"><div style="font-weight:800;font-size:36px;color:#0F1419">Renato Torres</div><div style="font-weight:500;font-size:28px;color:#536471">Pastor · Formação Bíblica</div></div></div>
    <div style="${I};font-weight:500;font-size:50px;line-height:1.3;color:#0F1419;margin-top:34px">Ler a Bíblia todo dia é ótimo. Mas ler com método muda a forma como você entende cada versículo.</div>
    <div style="${I};font-size:26px;color:#536471;margin-top:30px">Interpretação Bíblica · 9 aulas</div></div>`)}`)]);
// 4 · citação com foto redonda
A.push(['citacao', tela(G, true, `<div style="position:absolute;left:${M}px;top:110px;${T};font-size:360px;line-height:1;color:rgba(255,255,255,.22)">“</div>
  ${meio(`${tit('Estudar é fazer perguntas ao texto: quem escreveu, para quem e por quê.', 82, '#fff', 'text-transform:none')}
    <div style="display:flex;align-items:center;gap:24px;margin-top:56px">${avatar(120, 'renato-serio')}<div style="${I};color:#fff;line-height:1.3"><div style="font-weight:800;font-size:34px">Pastor Renato Torres</div><div style="font-weight:500;font-size:28px;opacity:.9">Interpretação Bíblica</div></div></div>`, 200)}`)]);
// 5 · balões nativos sobre a foto inteira
A.push(['foto-baloes', tela(C.carvao, true, `${fundoFoto(FO('renato-sorriso.jpg'), '50% 30%', 'linear-gradient(180deg,rgba(20,6,0,0) 45%,rgba(20,6,0,.85) 80%)').replace('50% 30%/cover', '50% 100%/cover')}
  <div style="position:absolute;left:${M}px;right:${M}px;bottom:150px">${balao(['Você prega ou', 'ensina na célula?'], 70)}<div style="margin-top:24px">${balao(['Preparação de Sermões · 10 aulas'], 36, C.brasa, '#fff')}</div></div>`)]);
// 6 · story-style: pergunta com a figurinha de perguntas e foto
A.push(['pergunta-figurinha', tela(C.carvao, true, `${fundoFoto(FO('renato-serio.jpg'), '50% 28%', 'linear-gradient(180deg,rgba(20,6,0,0) 45%,rgba(20,6,0,.8))').replace('50% 28%/cover', '50% 100%/cover')}
  <div style="position:absolute;left:120px;right:120px;bottom:150px;background:#fff;border-radius:34px;overflow:hidden;box-shadow:0 30px 60px rgba(0,0,0,.35)">
    <div style="background:${G};padding:30px 34px;${I};font-weight:700;font-size:36px;color:#fff;text-align:center">Qual livro da Bíblia você acha mais difícil de entender?</div>
    <div style="padding:30px;${I};font-weight:500;font-size:30px;color:#999;text-align:center">Comente aqui que eu te respondo</div></div>`)]);
// 7 · foto em moldura + 3 cursos
A.push(['foto-moldura', tela(C.creme, false, `<div style="position:absolute;right:${M}px;top:110px;width:440px;height:560px;border-radius:30px;background:url('${FO('renato-sorriso.jpg')}') 50% 62%/auto 150%;box-shadow:24px 24px 0 ${C.brasa}"></div>
  <div style="position:absolute;left:${M}px;top:120px;width:440px">${kick('Pastor Renato Torres')}<div style="height:22px"></div>${tit(`3 cursos<br>em uma<br>${cx('só', G)}<br>plataforma`, 78, C.carvao)}</div>
  <div style="position:absolute;left:${M}px;right:${M}px;top:780px;display:flex;flex-direction:column;gap:18px">${CURSOS.map(([n, a]) => `<div style="display:flex;justify-content:space-between;align-items:center;background:#fff;border-radius:22px;padding:24px 30px;box-shadow:0 10px 24px rgba(43,14,0,.08)"><span style="${T};font-size:40px;color:${C.carvao}">${n}</span><span style="${I};font-weight:700;font-size:26px;color:${C.brasa}">${a}</span></div>`).join('')}</div>`)]);
// 8 · conversa de WhatsApp com ele
A.push(['whatsapp', tela('#ECE5DD', false, `<div style="position:absolute;left:0;right:0;top:0;height:150px;background:#075E54;display:flex;align-items:center;gap:22px;padding:0 50px">${avatar(90)}<div style="${I};color:#fff"><div style="font-weight:700;font-size:34px">Pastor Renato</div><div style="font-size:24px;opacity:.85">online</div></div></div>
  <div style="position:absolute;left:50px;right:50px;top:200px;display:flex;flex-direction:column;gap:20px;${I};font-size:36px;line-height:1.35">
    <div style="align-self:flex-end;max-width:760px;background:#DCF8C6;border-radius:24px 6px 24px 24px;padding:22px 28px">Pastor, eu leio a Bíblia mas sinto que não entendo direito 😕</div>
    <div style="align-self:flex-start;max-width:800px;background:#fff;border-radius:6px 24px 24px 24px;padding:22px 28px">Isso é muito comum! Falta método: entender quem escreveu, para quem e o contexto.</div>
    <div style="align-self:flex-start;max-width:800px;background:#fff;border-radius:6px 24px 24px 24px;padding:22px 28px">Eu ensino isso passo a passo na Formação Bíblica. São 3 cursos e 25 aulas, por R$ 99.</div>
    <div style="align-self:flex-end;max-width:760px;background:#DCF8C6;border-radius:24px 6px 24px 24px;padding:22px 28px">Quero! Como faço? 🙌</div></div>`)]);
// 9 · recorte grande + pílula "comente VERBUM"
A.push(['foto-comente', tela(C.creme, false, `${agua(900, -260, -200, 'rgba(255,77,0,.06)')}${recorte('renato-sorriso', 760, 'left:50%;transform:translateX(-50%);bottom:0')}
  <div style="position:absolute;left:${M}px;right:${M}px;top:110px;text-align:center">${kick('Inscrições abertas')}<div style="height:20px"></div>${tit(`Formação<br>${cx('Bíblica', G)}`, 130, C.carvao)}</div>
  <div style="position:absolute;left:0;right:0;bottom:180px;display:flex;justify-content:center;z-index:5">${pil('Comente VERBUM e receba o link', C.carvao, '#fff', 34)}</div>`)]);
// 10 · polaroide + bilhete
A.push(['polaroide', tela(G, true, `<div style="position:absolute;left:110px;top:130px;width:500px;background:#fff;padding:22px 22px 90px;transform:rotate(-5deg);box-shadow:0 30px 60px rgba(43,14,0,.35)"><div style="height:560px;background:url('${FO('renato-serio.jpg')}') 50% 62%/auto 160%"></div><div style="position:absolute;left:0;right:0;bottom:24px;text-align:center;font-family:'Caveat',cursive;font-size:44px;color:${C.carvao}">Pr. Renato Torres</div></div>
  <div style="position:absolute;right:${M}px;top:520px;width:470px;background:${C.creme};padding:44px;border-radius:8px;transform:rotate(3deg);box-shadow:0 24px 50px rgba(43,14,0,.3)">${tit('Uma rotina de estudo que você consegue manter.', 56, C.carvao, 'text-transform:none')}${txt('Vida Intelectual · 6 aulas', 30, C.brasa, 'margin-top:22px;font-weight:700')}</div>`)]);

// ---------- tipográficos e de interface ----------
// 11 · número gigante 25
A.push(['numero-25', tela(C.creme, false, `<div style="position:absolute;left:40px;top:40px;${T};font-size:760px;line-height:.85;background:${G};-webkit-background-clip:text;color:transparent">25</div>
  <div style="position:absolute;left:${M}px;right:${M}px;bottom:200px">${tit('aulas gravadas para estudar a Bíblia com método', 78, C.carvao, 'text-transform:none')}<div style="margin-top:30px">${pil('R$ 99 · pagamento único', C.carvao)}</div></div>`)]);
// 12 · número 100+
A.push(['numero-100', tela(C.carvao, true, `${agua(900, -260, -200, 'rgba(255,138,0,.08)')}
  ${meio(`<div style="${T};font-size:380px;line-height:.85;color:${C.laranja}">100+</div>${tit('pessoas já estudam na Formação Bíblica.', 76, '#fff', 'text-transform:none;margin-top:30px')}${txt('Interpretação, preparação de sermões e rotina de estudo.', 34, C.creme, 'margin-top:26px')}`)}`)]);
// 13 · preço em ingresso
A.push(['ingresso', tela(G, true, `${meio(`<div style="display:flex;background:${C.creme};border-radius:30px;overflow:hidden;box-shadow:0 40px 80px -30px rgba(43,14,0,.5)">
    <div style="flex:1;padding:56px 50px">${kick('Formação Bíblica')}<div style="height:20px"></div>${tit('3 cursos<br>25 aulas', 96, C.carvao)}${txt('+ caderno de estudos<br>+ devocional bônus', 32, C.carvao, 'margin-top:24px')}</div>
    <div style="width:0;border-left:6px dashed rgba(43,14,0,.25)"></div>
    <div style="width:300px;padding:50px 30px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:${C.carvao};color:#fff;text-align:center"><div style="${I};font-weight:600;font-size:26px;opacity:.8">por</div><div style="${T};font-size:110px;line-height:1">R$ 99</div><div style="${I};font-weight:600;font-size:24px;margin-top:10px">pagamento<br>único</div></div></div>`)}`)]);
// 14 · checklist "o que você recebe"
A.push(['checklist', tela(C.creme, false, `${agua(900, -260, -200, 'rgba(255,77,0,.06)')}${meio(`${kick('O que você recebe')}<div style="height:24px"></div>${tit(`Tudo em<br>${cx('um só lugar', G)}`, 110, C.carvao)}<div style="height:50px"></div>${check(['3 cursos completos', '25 aulas gravadas', 'Caderno de estudos', 'Devocional de bônus', 'Assista no celular'])}`)}`, pil('R$ 99', G, '#fff', 30))]);
// 15 · antes x depois
A.push(['antes-depois', `<div style="position:relative;width:${W}px;height:${H}px;overflow:hidden;display:flex;flex-direction:column">
  <div style="flex:1;background:#E9E3DC;padding:90px ${M}px 40px;display:flex;flex-direction:column;justify-content:center">${kick('Antes', '#8a7f75')}<div style="height:20px"></div>${tit('Leio um versículo solto e tiro minhas conclusões.', 66, '#6b625a', 'text-transform:none')}</div>
  <div style="flex:1;background:${G};padding:40px ${M}px 150px;display:flex;flex-direction:column;justify-content:center">${kick('Depois', '#fff')}<div style="height:20px"></div>${tit('Leio o contexto, o autor e a intenção do texto.', 66, '#fff', 'text-transform:none')}</div>${pe(true)}</div>`]);
// 16 · nota do iPhone
A.push(['nota-iphone', tela(G, true, `${meio(`<div style="background:#fff;border-radius:40px;overflow:hidden;box-shadow:0 40px 80px -30px rgba(43,14,0,.5)">
    <div style="display:flex;justify-content:space-between;padding:30px 40px 0;${I};font-weight:600;font-size:32px;color:#E0A100"><span>‹ Notas</span><span>OK</span></div>
    <div style="padding:20px 50px 50px"><div style="${I};font-weight:800;font-size:62px;color:#111;letter-spacing:-.02em">Metas para 2027</div><div style="height:24px"></div>
    ${[[1, 'Ler a Bíblia inteira'], [0, 'Entender o contexto de cada livro'], [0, 'Preparar estudos para a célula'], [0, 'Ter uma rotina de estudo']].map(([f, t]) => `<div style="display:flex;gap:22px;align-items:center;margin-top:18px;${I};font-size:40px;color:#111"><span style="flex:none;width:46px;height:46px;border-radius:50%;${f ? 'background:#E0A100' : 'border:3px solid #C7C7CC'}"></span>${t}</div>`).join('')}</div></div>
    <div style="margin-top:40px">${pil('Formação Bíblica · R$ 99', C.carvao)}</div>`)}`)]);
// 17 · busca do Google
A.push(['busca', tela(C.creme, false, `${meio(`<div style="background:#fff;border-radius:999px;padding:30px 44px;display:flex;align-items:center;gap:24px;box-shadow:0 20px 50px -20px rgba(43,14,0,.3)"><svg width="44" height="44" viewBox="0 0 24 24"><circle cx="10" cy="10" r="7" fill="none" stroke="#9aa0a6" stroke-width="2.4"/><path d="M15 15l6 6" stroke="#9aa0a6" stroke-width="2.4" stroke-linecap="round"/></svg><span style="${I};font-size:40px;color:#202124">como entender a Bíblia</span></div>
    <div style="margin-top:60px">${tit(`A resposta não é<br>um atalho. É<br>${cx('método.', G)}`, 108, C.carvao)}</div>${txt('Interpretação Bíblica · 9 aulas', 34, C.brasa, 'margin-top:34px;font-weight:700')}`)}`)]);
// 18 · notificações
A.push(['notificacoes', tela(C.carvao, true, `${meio(`${[['Formação Bíblica', 'Nova aula liberada: o contexto do texto'], ['Devocional', 'Seu devocional de hoje chegou'], ['Caderno de estudos', 'Você completou 3 de 9 aulas']].map(([a, b], i) => `<div style="display:flex;gap:22px;align-items:center;background:rgba(255,244,232,.96);border-radius:30px;padding:26px 30px;margin-top:${i ? 20 : 0}px;transform:rotate(${[-2, 1.5, -1][i]}deg)"><div style="flex:none;width:76px;height:76px;border-radius:20px;background:${G};display:grid;place-items:center">${sim('#fff', 44)}</div><div style="${I}"><div style="font-weight:700;font-size:28px;color:${C.carvao}">${a}</div><div style="font-weight:500;font-size:32px;color:${C.carvao};margin-top:4px">${b}</div></div></div>`).join('')}
    <div style="margin-top:60px">${tit(`Estude no seu ritmo,<br>${cx('no celular', G)}`, 92)}</div>`)}`)]);
// 19 · palavra riscada
A.push(['riscado', tela(G, true, `${agua(900, -260, -200, 'rgba(255,255,255,.08)')}${meio(`${tit('Estudar a Bíblia com profundidade não exige', 84, '#fff', 'text-transform:none')}<div style="${T};font-size:150px;color:#fff;margin-top:10px;position:relative;display:inline-block;align-self:flex-start">seminário<span style="position:absolute;left:-10px;right:-10px;top:52%;height:16px;background:${C.carvao};transform:rotate(-4deg)"></span></div>
    ${txt('Exige método, rotina e bons materiais.', 44, '#fff', 'margin-top:40px;font-weight:600')}<div style="margin-top:40px">${pil(OFERTA, C.carvao)}</div>`)}`)]);
// 20 · celular com aulas (ilustrado)
A.push(['celular-aulas', tela(C.creme, false, `<div style="position:absolute;right:70px;top:120px">${cel(`<div style="background:${G};padding:30px 24px 24px;${I};color:#fff"><div style="font-size:18px;font-weight:700;letter-spacing:.12em">INTERPRETAÇÃO BÍBLICA</div><div style="${T};font-size:34px;margin-top:6px">Módulo 1</div></div><div style="padding:18px;display:flex;flex-direction:column;gap:12px">${['Por que interpretar', 'Quem escreveu', 'Para quem', 'O contexto', 'Os gêneros', 'Versículos ao redor'].map((t, i) => aula(i + 1, t, i < 3)).join('')}</div>`, 400)}</div>
  <div style="position:absolute;left:${M}px;top:200px;width:470px">${kick('Por dentro')}<div style="height:22px"></div>${tit(`Aulas<br>organiza-<br>das em<br>${cx('trilhas', G)}`, 84, C.carvao)}${txt('25 aulas gravadas, do básico ao aplicado.', 34, C.carvao, 'margin-top:30px')}</div>`)]);
// 21 · 3 cartões de curso em leque
A.push(['leque', tela(C.carvao, true, `<div style="position:absolute;left:${M}px;right:${M}px;top:110px;text-align:center">${tit(`3 cursos em<br>${cx('uma só plataforma', G)}`, 92)}</div>
  <div style="position:absolute;left:0;right:0;top:470px;height:520px">${CURSOS.map(([n, a], i) => `<div style="position:absolute;left:${130 + i * 270}px;top:${[40, 0, 40][i]}px;width:300px;height:440px;border-radius:30px;background:${[C.creme, G, C.creme][i]};padding:36px 30px;display:flex;flex-direction:column;justify-content:space-between;transform:rotate(${[-8, 0, 8][i]}deg);box-shadow:0 30px 60px rgba(0,0,0,.35)">${sim(i === 1 ? '#fff' : C.brasa, 70)}<div>${tit(n.replace(' ', '<br>'), 31, i === 1 ? '#fff' : C.carvao)}<div style="${I};font-weight:700;font-size:26px;margin-top:14px;color:${i === 1 ? '#fff' : C.brasa}">${a}</div></div></div>`).join('')}</div>
  <div style="position:absolute;left:0;right:0;bottom:170px;text-align:center">${pil('R$ 99 · pagamento único', G)}</div>`)]);
// 22 · enquete
A.push(['enquete', tela(G, true, `${meio(`${tit('Quando você lê a Bíblia, você…', 96, '#fff', 'text-transform:none')}<div style="height:50px"></div>
    <div style="background:#fff;border-radius:34px;padding:34px;display:flex;flex-direction:column;gap:18px">${[['…lê e segue o dia', 62], ['…para e estuda o contexto', 38]].map(([t, p]) => `<div style="position:relative;border-radius:22px;overflow:hidden;background:#F2F2F2;height:96px;display:flex;align-items:center;padding:0 30px;${I};font-weight:700;font-size:36px;color:${C.carvao}"><div style="position:absolute;left:0;top:0;bottom:0;width:${p}%;background:rgba(255,77,0,.22)"></div><span style="position:relative">${t}</span></div>`).join('')}</div>
    ${txt('Na Formação Bíblica você aprende a fazer o segundo.', 38, '#fff', 'margin-top:40px;font-weight:600')}`)}`)]);
// 23 · calendário da semana
A.push(['semana', tela(C.creme, false, `${meio(`${kick('Vida Intelectual · 6 aulas')}<div style="height:22px"></div>${tit(`Sua semana<br>de ${cx('estudo', G)}`, 108, C.carvao)}<div style="height:46px"></div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:12px">${['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'].map((d, i) => `<div style="border-radius:20px;background:${[0, 2, 4].includes(i) ? G : '#fff'};padding:22px 0;text-align:center;box-shadow:0 8px 20px rgba(43,14,0,.08)"><div style="${I};font-weight:700;font-size:22px;color:${[0, 2, 4].includes(i) ? '#fff' : C.carvao}">${d}</div><div style="${T};font-size:40px;margin-top:8px;color:${[0, 2, 4].includes(i) ? '#fff' : 'rgba(43,14,0,.25)'}">${[0, 2, 4].includes(i) ? '✓' : '·'}</div></div>`).join('')}</div>
    ${txt('Plano de leitura, hábitos e organização para estudar com constância.', 36, C.carvao, 'margin-top:40px')}`)}`)]);
// 24 · foto Bíblia aberta + título
A.push(['biblia-foto', tela(C.carvao, true, `${fundoFoto(FC('biblia-2.jpg'), 'center', 'linear-gradient(180deg,rgba(20,6,0,.2),rgba(20,6,0,.85))')}
  <div style="position:absolute;left:${M}px;right:${M}px;bottom:200px">${tit(`Ler a Bíblia é<br>diferente de<br>${cx('estudar', G)} a Bíblia.`, 104)}${txt('Interpretação Bíblica · 9 aulas', 34, C.creme, 'margin-top:30px;font-weight:700')}</div>`)]);
// 25 · tipos de sermão
A.push(['sermoes', tela(C.carvao, true, `${meio(`${kick('Preparação de Sermões · 10 aulas', C.laranja)}<div style="height:22px"></div>${tit('Temático, textual ou expositivo?', 92)}<div style="height:44px"></div>
    ${[['Temático', 'parte de um assunto e reúne textos sobre ele'], ['Textual', 'as ideias saem de um texto curto'], ['Expositivo', 'explica a passagem na ordem em que foi escrita']].map(([a, b]) => `<div style="display:flex;gap:24px;align-items:baseline;padding:22px 0;border-bottom:2px solid rgba(255,244,232,.15)"><span style="flex:none;width:250px;${T};font-size:44px;color:${C.laranja}">${a}</span><span style="${I};font-weight:500;font-size:32px;color:${C.creme};line-height:1.35">${b}</span></div>`).join('')}`)}`)]);
// 26 · eixo do sermão
A.push(['eixo', tela(C.creme, false, `<div style="position:absolute;left:50%;top:0;bottom:0;width:8px;margin-left:-4px;background:${G}"></div>
  <div style="position:absolute;left:${M}px;right:${M}px;top:160px;text-align:center"><span style="background:${C.creme};padding:0 20px">${tit('Todo bom sermão tem um eixo.', 96, C.carvao, 'display:inline')}</span></div>
  <div style="position:absolute;left:${M + 40}px;right:${M + 40}px;top:720px;background:#fff;border-radius:30px;padding:44px;text-align:center;box-shadow:0 30px 60px -30px rgba(43,14,0,.35)">${txt('Uma ideia central, tirada do texto, que organiza tudo o que você vai dizer.', 40, C.carvao)}<div style="margin-top:26px">${pil('Preparação de Sermões · 10 aulas', G)}</div></div>`)]);
// 27 · 3 perguntas
A.push(['3-perguntas', tela(G, true, `${meio(`${tit(`${cx('3 perguntas')} antes de ler um versículo`, 84, '#fff')}<div style="height:44px"></div>
    ${['Quem escreveu, e para quem?', 'O que significava para os primeiros leitores?', 'O que dizem os versículos ao redor?'].map((q, i) => `<div style="display:flex;gap:26px;align-items:center;margin-top:${i ? 22 : 0}px;background:rgba(255,255,255,.14);border-radius:26px;padding:26px 30px"><span style="flex:none;${T};font-size:72px;line-height:1;color:${C.carvao}">${i + 1}</span><span style="${I};font-weight:600;font-size:36px;color:#fff;line-height:1.3">${q}</span></div>`).join('')}
    ${txt('Isso se chama hermenêutica. E pode ser aprendido.', 34, '#fff', 'margin-top:36px;font-weight:700')}`)}`)]);
// 28 · bônus
A.push(['bonus', tela(C.carvao, true, `${agua(900, -260, -200, 'rgba(255,138,0,.08)')}${meio(`<div style="align-self:flex-start;background:${G};${T};font-size:40px;color:#fff;padding:14px 30px 10px;border-radius:14px;transform:rotate(-3deg)">Bônus</div><div style="height:40px"></div>
    ${tit(`Devocional<br>${cx('diário', G)}`, 140)}${txt('Junto com os 3 cursos, um devocional para cada dia e o caderno de estudos para acompanhar seu progresso.', 38, C.creme, 'margin-top:36px')}`)}`, pil('R$ 99', G, '#fff', 30))]);
// 29 · pergunta para célula / EBD com foto do caderno
A.push(['celula', tela(C.creme, false, `<div style="position:absolute;left:0;right:0;top:0;height:560px;background:url('${FC('caderno-2.jpg')}') center/cover"></div>
  <div style="position:absolute;left:${M}px;right:${M}px;top:620px">${tit(`Você ensina na<br>${cx('célula', G)} ou na<br>Escola Bíblica?`, 92, C.carvao)}${txt('Aprenda a preparar estudos fiéis ao texto, do esboço à aplicação.', 36, C.carvao, 'margin-top:28px')}</div>`)]);
// 30 · oferta final com foto recortada pequena
A.push(['oferta', tela(G, true, `${agua(900, -260, -200, 'rgba(255,255,255,.08)')}${recorte('renato-serio', 560, 'right:-60px;bottom:0;opacity:1')}
  ${meio(`${kick('Formação Bíblica', '#fff')}<div style="height:20px"></div>${tit(`3 cursos<br>25 aulas<br>${cx('R$ 99', C.carvao)}`, 136)}${txt('pagamento único · assista no celular', 34, '#fff', 'margin-top:30px;font-weight:600')}<div style="margin-top:44px">${pil('Comente VERBUM', '#fff', C.carvao, 34)}</div>`, 110, 170, 'max-width:620px')}`)]);

const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors', '--allow-file-access-from-files'] });
const browser = await chromium.launch(launch);
const page = await browser.newPage({ viewport: { width: W, height: H } });
const BUILD = path.join(root, 'build'); fs.mkdirSync(BUILD, { recursive: true });
for (const [i, [nome, html]] of A.entries()) {
  const arq = path.join(BUILD, `c30-${i + 1}.html`);
  fs.writeFileSync(arq, `<!doctype html><html><head>${HEAD}<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap" rel="stylesheet"><style>*{box-sizing:border-box;margin:0}body{width:${W}px;height:${H}px;overflow:hidden}</style></head><body>${html}</body></html>`);
  await page.goto('file://' + arq); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(OUT, `${String(i + 1).padStart(2, '0')}-${nome}.png`) });
}
await browser.close();
console.log('✓', A.length, 'criativos em', OUT);

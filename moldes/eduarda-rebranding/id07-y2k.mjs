// Projeto 07 · "Y2K Cromado" (marca EC.exe): estética anos 2000 atual para a Eduarda Caraciolo.
// Fundo pérola e azul-bebê, títulos cromados em Rubik Mono One, leitura em Space Grotesk,
// janelas de sistema antigo, estrelas de 4 pontas, cursor e barra de progresso em pixel,
// barra de tarefas no rodapé como assinatura. Vermelho só para erro/pegadinha.
import { render, CONTEUDO as C, PERFIL, root, esc } from './base.mjs';
import fs from 'node:fs';
// As fotos entram como data URI (a página é montada com setContent e não lê file://).
const d64 = (arq, tipo) => `data:${tipo};base64,${fs.readFileSync(`${root}/fotos/${arq}`).toString('base64')}`;
const memo = {};
const foto = n => (memo['f' + n] ??= d64(`${n}.jpg`, 'image/jpeg'));
const recorte = n => (memo['r' + n] ??= d64(`${n}-recorte.png`, 'image/png'));

const ID = 'id07-y2k';
const FONTES = 'https://fonts.googleapis.com/css2?family=Rubik+Mono+One&family=Space+Grotesk:wght@400;500;700&display=swap';
const K = { perola: '#EEF1F6', prata: '#C3CBD8', bebe: '#B9DCFF', cobalto: '#2A4BFF', noite: '#141A2E', chiclete: '#FF9AD5', erro: '#E5383B' };

const css = `
body{font-family:'Space Grotesk',sans-serif;color:${K.noite};position:relative}
.pg{position:absolute;inset:0;overflow:hidden}
.perola{background:radial-gradient(circle at 18% 12%,#fff 0,rgba(255,255,255,0) 38%),radial-gradient(circle at 88% 78%,#d3e7ff 0,rgba(211,231,255,0) 46%),radial-gradient(circle at 82% 8%,#efe6ff 0,rgba(239,230,255,0) 34%),${K.perola}}
.bebe{background:radial-gradient(circle at 25% 20%,#e6f2ff 0,rgba(230,242,255,0) 45%),radial-gradient(circle at 80% 85%,#d9ccff 0,rgba(217,204,255,0) 40%),${K.bebe}}
.noite{background:radial-gradient(circle at 70% 20%,#25305a 0,rgba(37,48,90,0) 50%),${K.noite};color:#fff}
.ab{position:absolute}
.cromo{font-family:'Rubik Mono One',sans-serif;line-height:.98;letter-spacing:-.01em;
  background:linear-gradient(180deg,#ffffff 0%,#e9eef5 26%,#9aa6b8 47%,#3a4458 51%,#8b9ab0 60%,#e8eef6 82%,#ffffff 100%);
  -webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-stroke:2.5px ${K.noite};
  filter:drop-shadow(7px 7px 0 ${K.cobalto})}
.cromo.az{filter:drop-shadow(7px 7px 0 ${K.noite})}
.mono{font-family:'Rubik Mono One',sans-serif;line-height:1}
.win{position:absolute;background:#FBFCFE;border:4px solid ${K.noite};box-shadow:12px 12px 0 ${K.noite};border-radius:6px;overflow:hidden}
.win .tb{height:62px;background:${K.cobalto};color:#fff;display:flex;align-items:center;padding:0 12px 0 20px;gap:10px;border-bottom:4px solid ${K.noite};font-weight:700;font-size:28px}
.win .tb span{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.win .tb i{width:38px;height:38px;background:${K.perola};border:3px solid ${K.noite};display:grid;place-items:center;font-style:normal;color:${K.noite};font-size:24px;font-weight:700;line-height:1}
.win.err .tb{background:${K.erro}}
.win.prata .tb{background:${K.prata};color:${K.noite}}
.win .wb{position:relative}
.bt{display:inline-flex;align-items:center;justify-content:center;font-family:'Rubik Mono One';font-size:34px;padding:22px 40px;background:${K.perola};border:4px solid ${K.noite};box-shadow:inset -5px -5px 0 ${K.prata},inset 5px 5px 0 #fff,8px 8px 0 ${K.noite};border-radius:6px;color:${K.noite}}
.bt.az{background:${K.cobalto};color:#fff;box-shadow:inset -5px -5px 0 #1a33b8,inset 5px 5px 0 #6f88ff,8px 8px 0 ${K.noite}}
.bt.er{background:${K.erro};color:#fff;box-shadow:inset -5px -5px 0 #a91e22,inset 5px 5px 0 #ff7d80,8px 8px 0 ${K.noite}}
.tag{display:inline-block;font-weight:700;font-size:28px;padding:10px 22px;border:3px solid ${K.noite};border-radius:40px;background:#fff}
.tag.az{background:${K.cobalto};color:#fff}
.tag.bb{background:${K.bebe}}
.taskbar{position:absolute;left:0;right:0;bottom:0;height:84px;background:${K.prata};border-top:4px solid #fff;box-shadow:0 -4px 0 ${K.noite};display:flex;align-items:center;padding:0 18px;gap:16px;z-index:20;font-weight:700;font-size:28px}
.taskbar .start{display:flex;align-items:center;gap:10px;padding:8px 18px;background:${K.perola};border:3px solid ${K.noite};box-shadow:inset -4px -4px 0 #9aa6b8,inset 4px 4px 0 #fff;font-family:'Rubik Mono One';font-size:24px}
.taskbar .sp{flex:1}
.taskbar .tray{padding:8px 18px;border:3px solid #8d99ab;box-shadow:inset 3px 3px 0 #9aa6b8;background:#d4dae4;font-family:'Rubik Mono One';font-size:24px}
img.f{position:absolute;width:100%;height:100%;object-fit:cover}
.campo{border:4px solid ${K.noite};box-shadow:inset 5px 5px 0 ${K.prata};background:#fff;padding:24px 28px;font-size:34px;color:#7b8599;border-radius:4px}
`;

// ---------- elementos ----------
const star = (s, x, y, fill = 'url(#cr)', rot = 0, extra = '') => `<svg class="ab" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px;transform:rotate(${rot}deg);${extra}" viewBox="0 0 100 100"><defs><linearGradient id="cr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="#b9c4d4"/><stop offset=".52" stop-color="#4a5570"/><stop offset=".7" stop-color="#c9d3e0"/><stop offset="1" stop-color="#fff"/></linearGradient></defs><path d="M50 2C54 36 64 46 98 50C64 54 54 64 50 98C46 64 36 54 2 50C36 46 46 36 50 2Z" fill="${fill}" stroke="${K.noite}" stroke-width="3.5" stroke-linejoin="round"/></svg>`;
const cursor = (s, x, y, rot = 0) => `<svg class="ab" style="left:${x}px;top:${y}px;width:${s}px;height:${s * 1.5}px;transform:rotate(${rot}deg);z-index:15;overflow:visible" viewBox="0 0 12 18"><path d="M1 1 L1 15.5 L4.6 12.2 L7.2 17.4 L9.6 16.2 L7 11.2 L11.6 11.2 Z" fill="#fff" stroke="${K.noite}" stroke-width="1.3" stroke-linejoin="miter"/></svg>`;
const aviso = (s, x, y) => `<svg class="ab" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px" viewBox="0 0 16 16" shape-rendering="crispEdges"><path d="M7 1h2v2h1v2h1v2h1v2h1v2h1v2h1v2H1v-2h1v-2h1v-2h1V7h1V5h1V3h1z" fill="#FFD84A" stroke="${K.noite}" stroke-width="1"/><path d="M7 6h2v4H7zM7 11h2v2H7z" fill="${K.noite}"/></svg>`;
const pasta = (s) => `<svg style="width:${s}px;height:${s * .8}px" viewBox="0 0 20 16" shape-rendering="crispEdges"><path d="M1 2h7l2 2h9v11H1z" fill="${K.bebe}" stroke="${K.noite}" stroke-width="1"/><path d="M1 6h18v9H1z" fill="#d7ebff" stroke="${K.noite}" stroke-width="1"/><path d="M2 7h16v1H2z" fill="#fff"/></svg>`;
const disquete = (s, x, y) => `<svg class="ab" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px" viewBox="0 0 16 16" shape-rendering="crispEdges"><path d="M1 1h12l2 2v12H1z" fill="${K.cobalto}" stroke="${K.noite}" stroke-width="1"/><path d="M4 1h7v5H4z" fill="${K.prata}"/><path d="M8 2h2v3H8z" fill="${K.noite}"/><path d="M3 9h10v6H3z" fill="#fff"/><path d="M4 11h8v1H4zM4 13h6v1H4z" fill="${K.prata}"/></svg>`;
const barra = (n, total = 12, cor = K.cobalto) => `<div style="display:flex;gap:6px;padding:6px;border:4px solid ${K.noite};background:#fff;box-shadow:inset 3px 3px 0 ${K.prata}">${Array.from({ length: total }, (_, i) => `<div style="flex:1;height:34px;background:${i < n ? cor : 'transparent'}"></div>`).join('')}</div>`;
const win = ({ x, y, w, h, t, body = '', cls = '', st = '', bst = '' }) => `<div class="win ${cls}" style="left:${x}px;top:${y}px;width:${w}px;${h ? `height:${h}px;` : ''}${st}"><div class="tb"><span>${t}</span><i>_</i><i>□</i><i>×</i></div><div class="wb" style="${bst}">${body}</div></div>`;
const taskbar = (pag) => `<div class="taskbar"><div class="start">${starInline(30)}EC.exe</div><div class="sp"></div><div>${PERFIL.arroba}</div>${pag ? `<div class="tray">${pag}</div>` : ''}</div>`;
const starInline = (s, fill = K.cobalto) => `<svg style="width:${s}px;height:${s}px" viewBox="0 0 100 100"><path d="M50 2C54 36 64 46 98 50C64 54 54 64 50 98C46 64 36 54 2 50C36 46 46 36 50 2Z" fill="${fill}" stroke="${K.noite}" stroke-width="6"/></svg>`;
const pg = (cls, html) => `<div class="pg ${cls}">${html}</div>`;
const W = 1080, H = 1350, HS = 1920;
const P = (nome, html, h = H, w = W) => ({ nome, w, h, html });

// logotipo: "EC" cromado dentro de uma estrela + etiqueta .exe
const logo = (s = 1) => `<div style="position:relative;display:inline-flex;align-items:center;gap:${18 * s}px">
  <div style="position:relative;width:${170 * s}px;height:${170 * s}px">${star(170 * s, 0, 0, K.bebe)}<div class="ab cromo az" style="left:0;right:0;top:${52 * s}px;text-align:center;font-size:${62 * s}px;-webkit-text-stroke:${2 * s}px ${K.noite}">EC</div></div>
  <div><div class="cromo" style="font-size:${54 * s}px">EDUARDA</div><div style="display:flex;align-items:center;gap:${10 * s}px;margin-top:${10 * s}px"><span class="mono" style="font-size:${30 * s}px">CARACIOLO</span><span style="background:${K.cobalto};color:#fff;font-weight:700;font-size:${26 * s}px;padding:${4 * s}px ${12 * s}px;border:${3 * s}px solid ${K.noite}">.exe</span></div></div></div>`;

const pecas = [];

// ---------- 00 identidade ----------
const sw = (nome, hex, txt = K.noite) => `<div style="flex:1"><div style="height:120px;background:${hex};border:4px solid ${K.noite};box-shadow:6px 6px 0 ${K.noite};border-radius:6px"></div><div style="font-weight:700;font-size:28px;margin-top:16px">${nome}</div><div style="font-size:28px;color:#4a5570">${hex}</div></div>`;
pecas.push(P('00-identidade', pg('perola', `
  <div class="ab" style="left:60px;top:50px;font-weight:700;font-size:28px;letter-spacing:.08em">PROJETO 07 · Y2K CROMADO</div>
  <div class="ab" style="left:60px;top:110px">${logo(1.15)}</div>
  ${star(70, 950, 70)}${star(40, 900, 200, K.chiclete)}
  <div class="ab" style="left:60px;top:345px;right:60px;display:flex;gap:22px">${sw('Pérola', K.perola)}${sw('Prata', K.prata)}${sw('Azul-bebê', K.bebe)}${sw('Cobalto', K.cobalto)}${sw('Noite', K.noite)}${sw('Erro', K.erro)}</div>
  ${win({ x: 60, y: 630, w: 470, h: 330, t: 'tipografia.txt', body: `<div style="padding:24px 26px"><div class="cromo" style="font-size:64px">ABC 123</div><div style="font-size:28px;margin:10px 0 22px">Rubik Mono One · títulos</div><div style="font-size:54px;font-weight:700;line-height:1">Aa Bb Cc</div><div style="font-size:28px;margin-top:10px">Space Grotesk · leitura</div></div>` })}
  ${win({ x: 570, y: 630, w: 450, h: 330, t: 'elementos', cls: 'prata', body: `<div style="padding:22px 24px;display:flex;flex-wrap:wrap;gap:20px;align-items:center"><div style="position:relative;width:90px;height:90px">${star(90, 0, 0)}</div><div style="position:relative;width:60px;height:90px">${cursor(56, 0, 0)}</div><div style="position:relative;width:80px;height:80px">${disquete(80, 0, 0)}</div><span class="bt az" style="font-size:24px;padding:14px 22px">OK</span><div style="width:100%">${barra(8)}</div></div>` })}
  <div class="ab" style="left:60px;top:1000px;right:60px">
    <div class="mono" style="font-size:30px;margin-bottom:16px">TOM DE VOZ</div>
    <div style="font-size:32px;line-height:1.3">Divertida, direta e de igual pra igual, como conversa de MSN. Brinca com a forma, nunca com o conteúdo: o artigo de lei vem sempre certinho.</div>
  </div>
  ${taskbar('ID')}`)));

// ---------- c1 · explicativo ----------
const c1 = C.c1;
pecas.push(P('c1-1', pg('perola', `
  ${win({ x: 400, y: 54, w: 620, h: 720, t: 'aula_de_civil.jpg', st: 'transform:rotate(2deg)', body: `<div style="position:relative;height:654px"><img class="f" src="${foto('explicando')}" style="object-position:62% 30%"></div>` })}
  ${star(130, 300, 90)}${star(60, 250, 250, K.chiclete)}${star(80, 960, 700, K.bebe)}
  <div class="ab" style="left:56px;top:150px;width:360px"><span class="tag az">Civil · OAB</span></div>
  <div class="ab cromo" style="left:56px;top:690px;font-size:94px;z-index:5">PRESCRIÇÃO</div>
  <div class="ab" style="left:56px;top:800px;z-index:5;display:flex;align-items:center;gap:24px"><span class="mono" style="font-size:72px;color:${K.cobalto}">×</span><span class="cromo" style="font-size:94px">DECADÊNCIA</span></div>
  <div class="ab" style="left:56px;top:950px;z-index:5"><span class="tag bb" style="font-size:36px;padding:14px 28px">${esc(c1.sub)}</span></div>
  <div class="ab" style="left:56px;top:1060px;width:560px">${barra(5)}<div style="font-weight:700;font-size:28px;margin-top:12px">carregando o macete… arrasta pro lado</div></div>
  ${cursor(46, 640, 1080, -8)}
  ${taskbar('1/3')}`)));
const c1win = (it, x, y, cls) => win({ x, y, w: 880, t: `${it.nome.toLowerCase()}.txt`, cls, body: `<div style="padding:34px 40px 38px">
  <div class="cromo" style="font-size:60px;margin-bottom:22px">${it.nome.toUpperCase()}</div>
  <div style="font-size:42px;font-weight:700;line-height:1.18">${esc(it.txt)}</div>
  <div style="font-size:32px;line-height:1.35;margin-top:18px;color:#323b52">${esc(it.det)}</div>
  <div style="margin-top:22px"><span class="tag bb">${esc(it.base)}</span></div></div>` });
pecas.push(P('c1-2', pg('bebe', `
  <div class="ab mono" style="left:60px;top:56px;font-size:40px">QUAL A DIFERENÇA?</div>
  ${c1win(c1.itens[0], 60, 140, '')}
  ${c1win(c1.itens[1], 140, 650, 'prata')}
  ${star(90, 950, 40)}
  ${taskbar('2/3')}`)));
pecas.push(P('c1-3', pg('perola', `
  <div class="ab cromo" style="left:60px;top:80px;font-size:104px">SALVOU?</div>
  ${star(100, 860, 70)}${star(50, 800, 190, K.chiclete)}
  ${win({ x: 60, y: 280, w: 840, t: 'Salvar como…', cls: 'prata', body: `<div style="padding:36px 40px;position:relative">
    <div style="display:flex;gap:28px;align-items:flex-start"><div style="position:relative;width:110px;height:110px;flex:none">${disquete(110, 0, 0)}</div>
    <div style="font-size:52px;font-weight:700;line-height:1.18">Salva pra revisar e manda pra quem vai fazer a OAB.</div></div>
    <div class="campo" style="margin-top:34px;font-size:30px">prescricao_x_decadencia.png</div>
    <div style="display:flex;gap:24px;margin-top:34px"><span class="bt az">SALVAR</span><span class="bt">ENVIAR</span></div></div>` })}
  ${cursor(60, 330, 870, -6)}
  <img class="ab" src="${recorte('surpresa')}" style="left:560px;top:780px;width:560px;z-index:4">
  ${star(120, 110, 1000)}${star(56, 280, 1110, K.chiclete)}
  ${taskbar('3/3')}`)));

// ---------- c2 · lista ----------
const c2 = C.c2;
pecas.push(P('c2-1', pg('bebe', `
  <div class="ab cromo" style="left:30px;top:10px;font-size:560px;line-height:1;filter:drop-shadow(14px 14px 0 ${K.cobalto})">4</div>
  <img class="ab" src="${recorte('surpresa')}" style="left:470px;top:300px;width:700px;z-index:3">
  ${star(110, 900, 120)}${star(54, 840, 60, K.chiclete)}
  ${win({ x: 50, y: 640, w: 700, t: 'erro_fatal.exe', cls: 'err', st: 'z-index:6', body: `<div style="padding:30px 34px 34px;position:relative">
    <div style="display:flex;gap:24px;align-items:flex-start"><div style="position:relative;width:90px;height:90px;flex:none">${aviso(90, 0, 0)}</div>
    <div class="mono" style="font-size:46px;line-height:1.12">ERROS QUE DERRUBAM A PEÇA DE CIVIL</div></div>
    <div style="font-size:34px;font-weight:700;margin-top:22px">${esc(c2.sub)}</div>
    <div style="display:flex;gap:20px;margin-top:26px"><span class="bt" style="font-size:28px;padding:16px 30px">VER OS 4</span></div></div>` })}
  ${cursor(50, 330, 1130, -6)}
  ${taskbar('1/3')}`)));
pecas.push(P('c2-2', pg('perola', `
  ${c2.itens.map((t, i) => win({ x: 60 + i * 36, y: 56 + i * 292, w: 856, t: `Erro 0${i + 1}`, cls: 'err', st: `z-index:${i + 1}`, body: `<div style="padding:26px 32px;display:flex;gap:26px;align-items:center;min-height:160px"><div style="position:relative;width:80px;height:80px;flex:none">${aviso(80, 0, 0)}</div><div style="font-size:42px;font-weight:700;line-height:1.18">${esc(t)}</div></div>` })).join('')}
  ${star(90, 70, 1080)}${star(44, 190, 1170, K.chiclete)}
  ${taskbar('2/3')}`)));
pecas.push(P('c2-3', pg('bebe', `
  <div class="ab cromo" style="left:60px;top:80px;font-size:112px">E VOCÊ?</div>
  ${star(110, 880, 60)}
  ${win({ x: 60, y: 300, w: 960, t: 'comentarios.exe', body: `<div style="padding:40px">
    <div style="font-size:52px;font-weight:700;line-height:1.15">${esc(c2.fim)}</div>
    <div style="display:flex;gap:20px;margin-top:36px;align-items:center"><div class="campo" style="flex:1">Escreva um comentário…</div><span class="bt az">ENVIAR</span></div></div>` })}
  ${win({ x: 60, y: 760, w: 960, t: 'checklist_da_peca.txt', cls: 'prata', body: `<div style="padding:28px 36px 30px;display:grid;grid-template-columns:1fr 1fr;gap:18px 30px">${['Endereçamento', 'Qualificação completa', 'Pedido específico', 'Valor da causa'].map(t => `<div style="display:flex;gap:16px;align-items:center;font-size:32px;font-weight:700"><span style="width:44px;height:44px;flex:none;border:4px solid ${K.noite};background:#fff;box-shadow:inset 3px 3px 0 ${K.prata}"></span>${t}</div>`).join('')}<div style="grid-column:1/3;margin-top:6px"><span class="tag az">${esc(c2.base)}</span></div></div>` })}
  ${cursor(56, 900, 560, -6)}
  ${taskbar('3/3')}`)));

// ---------- c3 · questão certo/errado ----------
const c3 = C.c3;
const botoes = (marca) => `<div style="display:flex;gap:28px;margin-top:36px">${c3.opcoes.map((o, i) => `<span class="bt ${marca === undefined ? '' : i === c3.certa ? 'er' : ''}" style="flex:1;font-size:40px;padding:28px 0;${marca !== undefined && i !== c3.certa ? 'opacity:.45' : ''}">${o.toUpperCase()}</span>`).join('')}</div>`;
pecas.push(P('c3-1', pg('perola', `
  <div class="ab cromo" style="left:56px;top:70px;font-size:96px">CERTO</div>
  <div class="ab cromo" style="left:56px;top:180px;font-size:96px">OU</div>
  <div class="ab cromo" style="left:56px;top:290px;font-size:96px">ERRADO?</div>
  ${win({ x: 640, y: 50, w: 390, h: 480, t: 'hmm.jpg', st: 'transform:rotate(3deg)', body: `<div style="position:relative;height:414px"><img class="f" src="${foto('pensando')}" style="object-position:50% 36%"></div>` })}
  ${star(80, 560, 420, K.chiclete)}
  ${win({ x: 56, y: 560, w: 968, t: 'quiz_de_familia.exe', st: 'z-index:5', body: `<div style="padding:40px 44px 46px">
    <div style="font-size:30px;font-weight:700;color:${K.cobalto};letter-spacing:.06em">PERGUNTA 01 · ALIMENTOS</div>
    <div style="font-size:54px;font-weight:700;line-height:1.14;margin-top:14px">${esc(c3.pergunta)}</div>${botoes()}</div>` })}
  ${cursor(54, 520, 1110, -10)}
  ${taskbar('1/3')}`)));
pecas.push(P('c3-2', pg('bebe', `
  <div class="ab mono" style="left:60px;top:60px;font-size:40px">RESULTADO</div>
  <div class="ab" style="left:60px;top:130px;width:960px">${barra(12)}</div>
  ${win({ x: 60, y: 230, w: 960, t: 'resposta.txt', st: 'z-index:5', body: `<div style="padding:40px 44px 46px">
    <div style="display:flex;align-items:center;gap:26px"><span class="bt er" style="font-size:60px;padding:24px 44px">ERRADO</span><span style="font-size:32px;font-weight:700;line-height:1.2">a pegadinha<br>está no “automaticamente”</span></div>
    <div style="font-size:42px;line-height:1.28;margin-top:36px">A maioridade <b>não encerra a pensão sozinha</b>: a exoneração depende de decisão judicial, com contraditório.</div>
    <div style="margin-top:32px"><span class="tag az" style="font-size:32px">${esc(c3.base)}</span></div></div>` })}
  <img class="ab" src="${recorte('surpresa')}" style="left:560px;top:930px;width:520px;z-index:2">
  ${star(100, 90, 1040)}${star(50, 240, 1150, K.chiclete)}
  <div class="ab" style="left:60px;top:960px;z-index:3"><span class="tag" style="font-size:32px">pegadinha clássica de Família</span></div>
  ${taskbar('2/3')}`)));
pecas.push(P('c3-3', pg('perola', `
  <div class="ab cromo" style="left:60px;top:90px;font-size:108px">ACERTOU?</div>
  ${win({ x: 60, y: 290, w: 760, t: 'comentarios.exe', st: 'z-index:5', body: `<div style="padding:40px 44px">
    <div style="font-size:50px;font-weight:700;line-height:1.22">Comenta <span style="background:${K.bebe};padding:0 10px;border:3px solid ${K.noite}">acertei</span> e marca quem precisa saber disso.</div>
    <div class="campo" style="margin-top:32px">acertei <span style="color:${K.noite}">|</span></div></div>` })}
  <img class="ab" src="${recorte('empolgada')}" style="left:500px;top:640px;width:620px;z-index:4">
  ${star(120, 80, 860)}${star(60, 230, 1010, K.chiclete)}
  ${taskbar('3/3')}`)));

// ---------- c4 · mito ou verdade ----------
const c4 = C.c4;
const radio = (txt, on, cor) => `<div style="display:flex;align-items:center;gap:20px;background:#fff;border:4px solid ${K.noite};box-shadow:8px 8px 0 ${K.noite};padding:18px 30px 18px 22px;border-radius:60px"><div style="width:50px;height:50px;border-radius:50%;border:4px solid ${K.noite};display:grid;place-items:center;box-shadow:inset 3px 3px 0 ${K.prata}">${on ? `<div style="width:24px;height:24px;border-radius:50%;background:${cor}"></div>` : ''}</div><span class="mono" style="font-size:40px;color:${K.noite}">${txt}</span></div>`;
pecas.push(P('c4-1', pg('noite', `
  <img class="ab" src="${recorte('empolgada')}" style="left:400px;top:330px;width:760px">
  ${star(140, 70, 70)}${star(60, 220, 210, K.chiclete)}${star(90, 930, 300, K.bebe)}
  <div class="ab cromo az" style="left:60px;top:250px;font-size:130px;filter:drop-shadow(8px 8px 0 ${K.cobalto})">ADOÇÃO</div>
  <div class="ab" style="left:60px;top:440px;font-size:40px;font-weight:700;color:${K.bebe}">ECA na prática</div>
  <div class="ab" style="left:60px;top:740px;display:flex;flex-direction:column;gap:30px;z-index:5">${radio('MITO', false)}${radio('VERDADE', false)}</div>
  ${cursor(54, 420, 900, -8)}
  <div class="ab" style="left:60px;top:1060px;z-index:5;font-size:36px;font-weight:700;color:#fff;background:${K.cobalto};border:4px solid #fff;padding:16px 26px">escolha uma opção e arrasta</div>
  ${taskbar('1/3')}`)));
const mv = (it, y) => `<div class="ab" style="left:60px;top:${y}px;width:960px;background:#fff;border:4px solid ${K.noite};box-shadow:12px 12px 0 ${K.noite};border-radius:6px;padding:44px 44px 48px">
  <div style="display:flex;justify-content:space-between;align-items:center;gap:24px"><div style="font-size:52px;font-weight:700;line-height:1.15">“${esc(it.frase)}”</div>
  <span class="bt ${it.v ? 'az' : 'er'}" style="flex:none;font-size:32px;padding:18px 26px">${it.v ? 'VERDADE' : 'MITO'}</span></div>
  <div style="font-size:40px;line-height:1.3;margin-top:26px;color:#323b52">${esc(it.txt)}</div>
  <div style="margin-top:28px"><span class="tag bb">${esc(it.base)}</span></div></div>`;
pecas.push(P('c4-2', pg('bebe', `
  <div class="ab mono" style="left:60px;top:58px;font-size:40px">RESPOSTAS</div>
  ${mv(c4.itens[0], 140)}
  ${mv(c4.itens[1], 680)}
  ${star(90, 940, 40)}
  ${taskbar('2/3')}`)));
pecas.push(P('c4-3', pg('perola', `
  <div class="ab" style="left:60px;top:80px;font-size:62px;font-weight:700;line-height:1.12;width:900px">Quer mais mito ou verdade de ECA?</div>
  ${win({ x: 60, y: 320, w: 960, t: 'buscar', st: 'z-index:5', cls: 'prata', body: `<div style="padding:40px">
    <div style="font-size:34px;font-weight:700;margin-bottom:22px">Comenta a palavra:</div>
    <div style="display:flex;gap:20px;align-items:center"><div style="flex:1;border:4px solid ${K.noite};box-shadow:inset 6px 6px 0 ${K.prata};background:#fff;padding:20px 30px;display:flex;align-items:center;gap:8px"><span class="cromo" style="font-size:110px">ECA</span><span style="width:8px;height:110px;background:${K.noite}"></span></div></div>
    <div style="display:flex;justify-content:flex-end;margin-top:30px"><span class="bt az">COMENTAR</span></div></div>` })}
  ${cursor(56, 880, 760, -6)}
  ${star(120, 90, 880)}${star(56, 250, 1020, K.chiclete)}
  <img class="ab" src="${recorte('surpresa')}" style="left:600px;top:840px;width:480px;z-index:2">
  <div class="ab" style="left:60px;top:1110px;font-size:36px;font-weight:700;width:520px;line-height:1.25">que eu preparo a próxima rodada</div>
  ${taskbar('3/3')}`)));

// ---------- c5 · apresentação ----------
const c5 = C.c5;
pecas.push(P('c5-1', pg('perola', `
  ${win({ x: 40, y: 40, w: 1000, h: 1030, t: 'www.eduardacaraciolo.com', cls: 'prata', body: `<div style="position:relative;height:964px"><img class="f" src="${foto('empolgada')}" style="object-position:55% 22%">
    <div class="ab" style="left:28px;top:28px;display:flex;align-items:center;gap:12px;background:#fff;border:3px solid ${K.noite};padding:10px 20px;font-weight:700;font-size:28px;border-radius:40px"><span style="width:20px;height:20px;border-radius:50%;background:#35C46A;border:2px solid ${K.noite}"></span>online agora</div></div>` })}
  <div class="ab cromo" style="left:56px;top:880px;font-size:112px;z-index:6;filter:drop-shadow(8px 8px 0 ${K.noite})">PRAZER,</div>
  <div class="ab cromo" style="left:56px;top:1000px;font-size:112px;z-index:6;filter:drop-shadow(8px 8px 0 ${K.cobalto})">EDUARDA</div>
  ${star(130, 880, 790)}${star(60, 840, 960, K.chiclete)}
  <div class="ab" style="left:56px;top:1138px;z-index:6"><span class="tag" style="font-size:28px">Advogada · Civil e ECA · professora OAB</span></div>
  ${taskbar('1/3')}`)));
pecas.push(P('c5-2', pg('bebe', `
  <div class="ab" style="left:60px;top:60px;width:960px;font-size:40px;font-weight:700;line-height:1.25">${esc(c5.sub)}</div>
  <div class="ab mono" style="left:60px;top:230px;font-size:44px">AQUI VOCÊ ENCONTRA</div>
  <div class="ab" style="left:60px;top:330px;width:960px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
    ${c5.itens.map(t => `<div style="background:#ffffffcc;border:4px solid ${K.noite};box-shadow:10px 10px 0 ${K.noite};border-radius:6px;padding:34px 32px;display:flex;flex-direction:column;gap:24px;align-items:flex-start;min-height:390px">${pasta(150)}<div style="font-size:44px;font-weight:700;line-height:1.15">${esc(t)}</div></div>`).join('')}
  </div>
  ${cursor(60, 480, 700, -6)}
  ${taskbar('2/3')}`)));
pecas.push(P('c5-3', pg('perola', `
  <div class="ab" style="left:60px;top:90px;width:680px;font-size:62px;font-weight:700;line-height:1.15">${esc(c5.fim)}</div>
  <div class="ab" style="left:60px;top:370px;display:flex;align-items:center;gap:18px"><span class="bt az" style="font-size:52px;padding:30px 60px">SEGUIR</span></div>
  ${cursor(70, 360, 430, -8)}
  <div class="ab" style="left:60px;top:570px;font-size:40px;font-weight:700">${PERFIL.arroba}</div>
  ${star(150, 820, 80)}${star(70, 760, 260, K.chiclete)}
  ${win({ x: 60, y: 700, w: 560, t: 'perfil', st: 'z-index:5', body: `<div style="padding:30px 34px;font-size:32px;line-height:1.45"><b>Eduarda Caraciolo</b><br>Advogada · Direito Civil e ECA<br>Professora de Civil · 2ª fase OAB</div>` })}
  <img class="ab" src="${recorte('empolgada')}" style="left:520px;top:520px;width:600px;z-index:4">
  ${taskbar('3/3')}`)));

// ---------- posts únicos ----------
pecas.push(P('p1', pg('bebe', `
  ${star(180, 820, 60)}${star(80, 740, 230, K.chiclete)}${star(110, 80, 1040)}
  <div class="ab" style="left:70px;top:330px;font-size:84px;font-weight:700;line-height:1.05;width:900px;letter-spacing:-.02em">Peça boa<br>não se decora.</div>
  <div class="ab cromo" style="left:62px;top:600px;font-size:150px;line-height:1.02;filter:drop-shadow(10px 10px 0 ${K.cobalto})">SE<br>ENTENDE.</div>
  <div class="ab" style="left:320px;top:1080px;width:600px">${barra(12)}<div style="font-weight:700;font-size:28px;margin-top:12px">entendimento carregado com sucesso</div></div>
  ${taskbar('')}`)));
pecas.push(P('p2', pg('perola', `
  ${win({ x: 60, y: 60, w: 960, h: 1080, t: 'Eduarda · conversa', body: `<div style="padding:40px;height:1014px;display:flex;flex-direction:column;gap:30px;background:linear-gradient(#fff,#eef4ff)">
    <div style="display:flex;gap:22px;align-items:flex-end"><div style="width:150px;height:150px;border-radius:50%;overflow:hidden;border:4px solid ${K.noite};flex:none;position:relative"><img class="f" src="${foto('surpresa')}" style="object-position:66% 34%;transform:scale(1.8);transform-origin:66% 38%"></div>
      <div><div style="font-weight:700;font-size:28px;color:${K.cobalto};margin-bottom:8px">Eduarda diz:</div><div style="background:${K.bebe};border:4px solid ${K.noite};border-radius:30px 30px 30px 6px;padding:30px 34px"><div class="mono" style="font-size:56px;line-height:1.12">QUAL TEMA DE CIVIL MAIS TE TRAVA?</div></div></div></div>
    <div style="align-self:flex-end;max-width:680px;background:#fff;border:4px solid ${K.noite};border-radius:30px 30px 6px 30px;padding:30px 36px;font-size:44px;font-weight:700;line-height:1.2">${esc(C.p2.txt)}</div>
    <div style="font-size:30px;color:#4a5570;font-weight:700;margin-left:6px">você está digitando…</div>
    <div style="flex:1"></div>
    <div style="display:flex;gap:20px;align-items:center"><div class="campo" style="flex:1">sucessões? contratos? responsabilidade?</div><span class="bt az">ENVIAR</span></div></div>` })}
  ${star(110, 930, 20)}${star(50, 900, 150, K.chiclete)}
  ${taskbar('')}`)));
const p3 = C.p3;
pecas.push(P('p3', pg('perola', `
  ${win({ x: 50, y: 50, w: 980, h: 1110, t: 'instalando: sucessao.exe', body: `<div style="padding:40px 44px">
    <div style="font-size:30px;font-weight:700;color:${K.cobalto};letter-spacing:.06em">DICA RÁPIDA · ${esc(p3.base).toUpperCase()}</div>
    <div class="cromo" style="font-size:66px;margin:16px 0 30px;line-height:1.05">ORDEM DA VOCAÇÃO HEREDITÁRIA</div>
    ${p3.itens.map((t, i) => `<div style="display:flex;gap:24px;align-items:center;padding:20px 0"><div class="mono" style="flex:none;width:92px;height:92px;display:grid;place-items:center;font-size:44px;background:${i === 0 ? K.cobalto : K.bebe};color:${i === 0 ? '#fff' : K.noite};border:4px solid ${K.noite};box-shadow:6px 6px 0 ${K.noite}">${i + 1}</div><div style="font-size:38px;font-weight:700;line-height:1.2">${esc(t)}</div></div>`).join('')}
    <div style="margin-top:26px">${barra(9)}</div><div style="font-weight:700;font-size:28px;margin-top:12px">um grau só é chamado na falta do anterior</div></div>` })}
  ${star(120, 920, 1000)}
  ${taskbar('')}`)));

// ---------- stories ----------
pecas.push(P('s1', pg('bebe', `
  ${star(160, 80, 120)}${star(70, 260, 300, K.chiclete)}${star(100, 900, 160)}
  <img class="ab" src="${recorte('surpresa')}" style="left:180px;top:300px;width:820px">
  ${win({ x: 70, y: 1080, w: 940, t: 'caixinha.exe', st: 'z-index:5', body: `<div style="padding:44px">
    <div class="mono" style="font-size:58px;line-height:1.12">ME PERGUNTA QUALQUER COISA SOBRE ECA</div>
    <div class="campo" style="margin-top:34px;font-size:38px;padding:34px">Digite sua pergunta…</div>
    <div style="display:flex;justify-content:flex-end;margin-top:30px"><span class="bt az">ENVIAR</span></div></div>` })}
  ${cursor(60, 860, 1640, -6)}
  ${taskbar('')}`, HS), HS));
pecas.push(P('s2', pg('perola', `
  <div class="ab cromo" style="left:60px;top:140px;font-size:118px">POST NOVO</div>
  <div class="ab cromo" style="left:60px;top:270px;font-size:118px">NO FEED</div>
  ${star(130, 880, 90)}
  ${win({ x: 120, y: 470, w: 840, h: 1000, t: 'novo_post.png', st: 'transform:rotate(-2deg)', body: `<div style="position:relative;height:934px" class="perola">
    <img class="f" src="${foto('explicando')}" style="height:600px;object-position:62% 30%">
    <div class="ab" style="left:0;right:0;top:600px;bottom:0;background:${K.perola};border-top:4px solid ${K.noite}"></div>
    <div class="ab cromo" style="left:36px;top:640px;font-size:66px">PRESCRIÇÃO</div>
    <div class="ab cromo" style="left:36px;top:730px;font-size:66px">× DECADÊNCIA</div>
    <div class="ab" style="left:36px;top:840px"><span class="tag bb">${esc(c1.sub)}</span></div></div>` })}
  <div class="ab" style="left:120px;top:1560px;display:flex;gap:24px;align-items:center"><span class="bt az" style="font-size:44px;padding:28px 50px">VER POST</span><span style="font-size:36px;font-weight:700">toque e arrasta</span></div>
  ${cursor(64, 430, 1620, -8)}
  ${star(80, 900, 1500, K.chiclete)}
  ${taskbar('')}`, HS), HS));

// ---------- destaques e avatar ----------
const glifos = { Civil: 'CC', ECA: 'ECA', OAB: 'OAB', Dicas: '!', Sobre: 'EC' };
const dest = (n, i) => `<div style="display:flex;flex-direction:column;align-items:center;gap:22px">
  <div style="width:270px;height:270px;border-radius:50%;padding:14px;background:linear-gradient(160deg,#fff,#9aa6b8 48%,#3a4458 52%,#e8eef6);border:4px solid ${K.noite};box-shadow:8px 8px 0 ${K.noite}">
  <div style="width:100%;height:100%;border-radius:50%;background:${i % 2 ? K.cobalto : K.bebe};border:4px solid ${K.noite};display:grid;place-items:center;position:relative">
  <span class="cromo" style="font-size:${glifos[n].length > 2 ? 58 : 80}px;${i % 2 ? `filter:drop-shadow(5px 5px 0 ${K.noite})` : ''}">${glifos[n]}</span>${star(56, 160, 20, i % 2 ? K.bebe : K.chiclete)}</div></div>
  <div style="font-weight:700;font-size:36px">${n}</div></div>`;
pecas.push(P('destaques', pg('perola', `
  <div class="ab mono" style="left:0;right:0;top:90px;text-align:center;font-size:44px">DESTAQUES</div>
  <div class="ab" style="left:60px;right:60px;top:220px;display:flex;justify-content:space-around">${C.destaques.slice(0, 3).map(dest).join('')}</div>
  <div class="ab" style="left:220px;right:220px;top:640px;display:flex;justify-content:space-around">${C.destaques.slice(3).map((n, i) => dest(n, i + 3)).join('')}</div>`), 1080));
pecas.push(P('avatar', pg('bebe', `
  ${star(300, 700, 80, '#fff')}${star(160, 120, 160, K.chiclete)}
  <img class="ab" src="${recorte('empolgada')}" style="left:150px;top:120px;width:860px">`), 1080));

await render(ID, pecas, { fontes: FONTES, css });

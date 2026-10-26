// Identidade de divulgação dos Mapas Mentais (Constitucional com Líbero): peças da plataforma (imagem do
// produto 1:1, capa 16:9, banner de checkout 1200×400) e do Instagram (feed 1080×1350 e stories 1080×1920).
// Mesma linguagem do material: degradê verde leve, "MAPAS MENTAIS" em Big Shoulders, títulos em Plus Jakarta,
// cabeçalhos coloridos dos cartões como motivo e as páginas reais da coleção como mockup.
// Precisa de saida/colecao/ gerada (os PNGs dos mapas). Uso: CHROMIUM_PATH=... RENDER_PROXY=... node divulgacao.mjs [peça]
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const root = path.dirname(new URL(import.meta.url).pathname);
const { chromium } = createRequire(path.join(root, 'package.json'))('playwright');
const OUT = path.join(root, 'saida', 'divulgacao'), BUILD = path.join(root, 'build');
fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(BUILD, { recursive: true });

const C = { floresta: '#0B4A30', verde: '#16804F', folha: '#138A55', menta: '#EAF6EF', tinta: '#0F2A1E', texto: '#2E3B35', cinza: '#6B7F75' };
const RAMOS = ['#138A55', '#0E7C86', '#2563EB', '#0B5C3B', '#7C3AED', '#D97706'];
const FUNDO = 'linear-gradient(120deg,#EEF8F1 0%,#D3EEDD 55%,#B4E0C5 100%)';
const FUNDO_ESC = 'linear-gradient(150deg,#0B4A30 0%,#138A55 100%)';
const T = "font-family:'Big Shoulders Display',sans-serif;font-weight:900;text-transform:uppercase";
const J = "font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;letter-spacing:-.02em";
const I = "font-family:'Inter',sans-serif";
const MAPA = id => 'file://' + path.join(root, 'saida', 'colecao', fs.readdirSync(path.join(root, 'saida', 'colecao')).find(d => d.startsWith(id + '-')), '2.png');

// ---------- Elementos ----------
const marca = (cor = C.verde) => `<div style="${I};font-size:15px;font-weight:800;letter-spacing:.26em;text-transform:uppercase;color:${cor}">Constitucional com Líbero</div>`;
const titulo = (px, cor = C.floresta) => `<div style="${T};font-size:${px}px;line-height:.84;color:${cor}">Mapas<br>Mentais</div>`;
const fio = (cor = C.verde) => `<div style="width:70px;height:5px;border-radius:3px;background:${cor};margin:18px 0 22px"></div>`;
// Faixa de cabeçalhos coloridos, como os cartões dos mapas.
const etiquetas = (itens, px = 20) => `<div style="display:flex;flex-wrap:wrap;gap:10px">${itens.map((t, i) => `<span style="${J};font-size:${px}px;color:#fff;background:${RAMOS[i % RAMOS.length]};padding:${px * .45}px ${px * .8}px;border-radius:${px * .55}px">${t}</span>`).join('')}</div>`;
// Página A4 horizontal (1123×794) em escala: capa da coleção desenhada aqui ou um mapa real.
const capaColecao = `<div style="position:absolute;inset:0;background:${FUNDO};padding:0 70px;display:flex;flex-direction:column;justify-content:center">
    ${marca()}${fio()}${titulo(150)}
    <div style="${J};font-size:58px;line-height:1.05;color:${C.verde};margin-top:30px">100 mapas de<br>Direito Constitucional</div></div>`;
const pagina = (w, conteudo, extra = '') => `<div style="position:absolute;width:1123px;height:794px;transform-origin:0 0;${extra};transform:${(extra.match(/transform:([^;]+)/) || [, ''])[1]} scale(${w / 1123});border-radius:${14 * 1123 / w}px;overflow:hidden;background:#fff;box-shadow:0 ${30 * 1123 / w}px ${70 * 1123 / w}px rgba(11,74,48,.28),0 2px 6px rgba(11,74,48,.15)">${conteudo}</div>`;
const mapa = id => `<img src="${MAPA(id)}" style="width:1123px;height:794px;display:block">`;
// Pilha em leque: dois mapas atrás e a capa na frente.
const pilha = (x, y, w, ids = ['28', '67']) => {
  const h = w * 794 / 1123, s = w / 1123;
  const pg = (cont, dx, dy, rot) => `<div style="position:absolute;left:${x + dx}px;top:${y + dy}px;width:${w}px;height:${h}px;transform:rotate(${rot}deg);border-radius:12px;overflow:hidden;background:#fff;box-shadow:0 26px 60px rgba(11,74,48,.3),0 2px 6px rgba(11,74,48,.15)">
      <div style="width:1123px;height:794px;transform:scale(${s});transform-origin:0 0;position:relative">${cont}</div></div>`;
  return pg(mapa(ids[0]), w * .16, -h * .2, 7) + pg(mapa(ids[1]), w * .08, -h * .1, 3.5) + pg(capaColecao, 0, 0, -2);
};
const numeros = (itens, cor = C.floresta, sub = C.texto) => `<div style="display:flex;gap:34px">${itens.map(([n, t]) => `<div><div style="${T};font-size:64px;line-height:.9;color:${cor}">${n}</div><div style="${I};font-size:17px;font-weight:600;color:${sub};margin-top:6px;max-width:190px;line-height:1.3">${t}</div></div>`).join('')}</div>`;
const brilho = `<div style="position:absolute;right:-220px;top:-260px;width:720px;height:720px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.7) 0%,rgba(255,255,255,0) 70%)"></div>`;
const box = (w, h, bg, html) => `<div style="position:relative;width:${w}px;height:${h}px;overflow:hidden;background:${bg}">${html}</div>`;

const PUBLICO = '1ª fase da OAB e concursos';
const PECAS = {
  // ---------- Plataforma ----------
  'produto-1x1': [1080, 1080, box(1080, 1080, FUNDO, `${brilho}
    <div style="position:absolute;left:80px;top:80px">${marca()}${fio()}${titulo(124)}
      <div style="${J};font-size:38px;line-height:1.1;color:${C.verde};margin-top:20px">100 mapas de<br>Direito Constitucional</div></div>
    ${pilha(360, 640, 600)}
    <div style="position:absolute;left:80px;bottom:70px;${I};font-size:20px;font-weight:700;color:${C.floresta}">Prof. Líbero Filho</div>`)],

  'capa-16x9': [1920, 1080, box(1920, 1080, FUNDO, `${brilho}
    <div style="position:absolute;left:130px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;width:760px">
      ${marca()}${fio()}${titulo(220)}
      <div style="${J};font-size:58px;line-height:1.08;color:${C.verde};margin-top:34px">100 mapas de<br>Direito Constitucional</div>
      <div style="margin-top:40px">${etiquetas(['Teoria', 'Direitos', 'Poderes', 'Controle', 'Ordem social'], 22)}</div></div>
    ${pilha(980, 360, 820)}
    <div style="position:absolute;left:130px;bottom:70px;${I};font-size:22px;font-weight:700;color:${C.floresta}">Prof. Líbero Filho · ${PUBLICO}</div>`)],

  'banner-checkout': [1200, 400, box(1200, 400, FUNDO_ESC, `
    <div style="position:absolute;left:60px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center">
      ${marca('#A7E8C3')}<div style="height:14px"></div>${titulo(104, '#fff')}</div>
    <div style="position:absolute;left:420px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center">
      <div style="${J};font-size:36px;line-height:1.1;color:#fff">100 mapas de<br>Direito Constitucional</div>
      <div style="${I};font-size:17px;color:#D7F0E1;margin-top:12px">Prof. Líbero Filho · ${PUBLICO}</div></div>
    ${pilha(860, 150, 300)}`)],

  // ---------- Feed ----------
  'feed-lancamento': [1080, 1350, box(1080, 1350, FUNDO, `${brilho}
    <div style="position:absolute;left:80px;top:96px">${marca()}${fio()}${titulo(190)}
      <div style="${J};font-size:52px;line-height:1.08;color:${C.verde};margin-top:28px">Todo o Constitucional<br>em 100 mapas</div>
      <div style="${I};font-size:24px;font-weight:700;color:${C.floresta};margin-top:18px">${PUBLICO}</div></div>
    ${pilha(200, 920, 780)}`)],

  'feed-por-dentro': [1080, 1350, box(1080, 1350, '#fff', `
    <div style="position:absolute;left:-180px;top:-200px;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,#DDF3E6 0%,rgba(221,243,230,0) 70%)"></div>
    <div style="position:absolute;left:80px;top:90px;right:80px">${marca()}
      <div style="${J};font-size:72px;line-height:1.02;color:${C.floresta};margin-top:20px">Cada tema com<br>o <span style="color:${C.folha}">desenho certo</span></div>
      <div style="${I};font-size:24px;line-height:1.45;color:${C.texto};margin-top:18px;max-width:820px">Comparação vira colunas, procedimento vira etapas, regra com exceção vira quadro de regra.</div></div>
    <div style="position:absolute;left:80px;right:80px;top:520px;display:grid;grid-template-columns:1fr 1fr;gap:26px">
      ${[['02', 'Colunas'], ['67', 'Etapas'], ['21', 'Regra e exceções'], ['81', 'Perguntas']].map(([id, t], i) => `<div>
        <div style="border-radius:14px;overflow:hidden;box-shadow:0 16px 36px rgba(11,74,48,.18);border:1px solid #E3ECE7"><img src="${MAPA(id)}" style="display:block;width:100%"></div>
        <div style="margin-top:12px">${etiquetas([t], 20).replace(RAMOS[0], RAMOS[i])}</div></div>`).join('')}</div>`)],

  'feed-como-usar': [1080, 1350, box(1080, 1350, FUNDO_ESC, `
    <div style="position:absolute;right:-160px;top:-160px;width:620px;height:620px;border-radius:50%;background:radial-gradient(circle,rgba(167,232,195,.25) 0%,rgba(167,232,195,0) 70%)"></div>
    <div style="position:absolute;left:80px;top:96px;right:80px">${marca('#A7E8C3')}
      <div style="${J};font-size:76px;line-height:1.02;color:#fff;margin-top:20px">Como estudar<br>com os mapas</div></div>
    <div style="position:absolute;left:80px;right:80px;top:470px;display:flex;flex-direction:column;gap:22px">
      ${['Leia a explicação de apoio para entender o mecanismo jurídico.', 'Revise os ramos e identifique regra, condição e exceção.', 'Responda à pergunta antes de consultar a resposta.', 'Volte ao mapa na revisão: o desenho ajuda a lembrar.'].map((t, i) => `<div style="display:flex;gap:24px;align-items:center;background:#fff;border-radius:22px;padding:24px 28px;box-shadow:0 16px 34px rgba(0,0,0,.18)">
        <span style="flex:none;width:64px;height:64px;border-radius:16px;background:${RAMOS[i + 1]};color:#fff;${T};font-size:40px;display:flex;align-items:center;justify-content:center">${i + 1}</span>
        <span style="${I};font-size:28px;font-weight:600;line-height:1.3;color:${C.tinta}">${t}</span></div>`).join('')}</div>
    <div style="position:absolute;left:80px;bottom:70px;${I};font-size:22px;font-weight:700;color:#D7F0E1">Mapas Mentais · Prof. Líbero Filho</div>`)],

  // ---------- Stories ----------
  'stories-lancamento': [1080, 1920, box(1080, 1920, FUNDO, `${brilho}
    <div style="position:absolute;left:90px;top:260px">${marca()}${fio()}${titulo(230)}
      <div style="${J};font-size:60px;line-height:1.08;color:${C.verde};margin-top:30px">100 mapas de<br>Direito Constitucional</div></div>
    ${pilha(170, 960, 780)}
    <div style="position:absolute;left:0;right:0;bottom:190px;display:flex;justify-content:center"><span style="${J};font-size:38px;color:#fff;background:${C.floresta};padding:24px 48px;border-radius:999px;box-shadow:0 16px 34px rgba(11,74,48,.3)">Toque no link e garanta o seu</span></div>`)],

  'stories-mapa': [1080, 1920, box(1080, 1920, '#fff', `
    <div style="position:absolute;left:-200px;top:-220px;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,#DDF3E6 0%,rgba(221,243,230,0) 70%)"></div>
    <div style="position:absolute;left:90px;right:90px;top:250px">${marca()}
      <div style="${J};font-size:84px;line-height:1.02;color:${C.floresta};margin-top:22px">Assim é<br>um mapa por<br><span style="color:${C.folha}">dentro</span></div></div>
    <div style="position:absolute;left:-30px;top:920px;width:1140px;transform:rotate(-3deg)"><div style="border-radius:20px;overflow:hidden;box-shadow:0 30px 70px rgba(11,74,48,.28);border:1px solid #E3ECE7"><img src="${MAPA('28')}" style="display:block;width:100%"></div></div>
    <div style="position:absolute;left:90px;right:90px;bottom:240px">${etiquetas(['Regra', 'Exceção', 'Na prova', 'Confira'], 30)}</div>`)],
};

const HEAD = `<meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@900&family=Inter:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@800&display=swap" rel="stylesheet"><style>*{margin:0;box-sizing:border-box}body{-webkit-font-smoothing:antialiased}</style>`;
const launch = { args: ['--allow-file-access-from-files'] };
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors', '--allow-file-access-from-files'] });
const b = await chromium.launch(launch);
for (const [id, [w, h, html]] of Object.entries(PECAS)) {
  if (process.argv[2] && id !== process.argv[2]) continue;
  const arq = path.join(BUILD, `div-${id}.html`);
  fs.writeFileSync(arq, `<!doctype html><html><head>${HEAD}</head><body>${html}</body></html>`);
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto('file://' + arq);
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => (i.onload = i.onerror = r)))));
  await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(OUT, `mapas-mentais-${id}.png`) }); await p.close();
  console.log('✓', id);
}
await b.close();

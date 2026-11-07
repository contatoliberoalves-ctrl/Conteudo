// Posts de Instagram (1080×1350) do ANOREG Conecta · Petrolina (PE): cards únicos e carrosséis, na identidade das cenas.
// As fotos são quadros do vídeo de abertura do evento (referencia/abertura.mp4, fora do git), recortados em build/q/
// pelo comando do README do molde. Uso: node posts.mjs → saida/posts/<post>/<n>.png
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const root = path.dirname(new URL(import.meta.url).pathname);
const W = 1080, H = 1350;
const foto = n => 'data:image/jpeg;base64,' + fs.readFileSync(path.join(root, 'build', 'q', `${n}.jpg`)).toString('base64');
const OURO = 'linear-gradient(180deg,#F7C65A 0%,#E9A62C 100%)';
const css = `
*{box-sizing:border-box;margin:0}
body{font-family:'Inter',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}
.c{position:relative;width:${W}px;height:${H}px;overflow:hidden;color:#fff}
.fundo{position:absolute;inset:0;background:radial-gradient(120% 100% at 85% 10%,#0f4a63 0%,#0b2e4d 40%,#0a1d36 75%,#081629 100%)}
.claro{position:absolute;inset:0;background:#EEF1F4}
.ondas{position:absolute;border-radius:50%;transform:translate(-50%,-50%);background:repeating-radial-gradient(circle,rgba(110,190,220,.17) 0 1.5px,transparent 1.5px 30px);-webkit-mask:radial-gradient(circle,#000 0%,#000 45%,transparent 70%)}
.ondas.esc{background:repeating-radial-gradient(circle,rgba(11,30,54,.08) 0 1.5px,transparent 1.5px 30px)}
.foto{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.rot{font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:#F2B544}
.tit{font-weight:800;letter-spacing:-.045em;line-height:.92;text-wrap:balance}
.ouro{background:${OURO};-webkit-background-clip:text;background-clip:text;color:transparent}
.txt{font-size:38px;line-height:1.4;color:rgba(255,255,255,.9)}
.pill{display:inline-flex;align-items:center;gap:12px;border:2px solid rgba(242,181,68,.6);background:rgba(10,29,54,.55);border-radius:999px;padding:14px 28px}
.marca{font-weight:800;letter-spacing:-.02em}.marca b{font-weight:400}
.traco{width:120px;height:6px;background:${OURO}}
`;
const marca = (px = 30, cor = '#fff') => `<span class="marca" style="font-size:${px}px;color:${cor}">ANOREG <b>CON<span style="color:#F2B544">•</span>ECTA</b></span>`;
const ondas = (x, y, d, esc = '') => `<div class="ondas ${esc}" style="left:${x}px;top:${y}px;width:${d}px;height:${d}px"></div>`;
const rodape = (cor = '#fff', pag = '') => `<div style="position:absolute;left:80px;right:80px;bottom:60px;display:flex;justify-content:space-between;align-items:center;font-size:20px;font-weight:700;letter-spacing:.24em;color:${cor}">
  ${marca(26, cor)}<span style="opacity:.85">${pag || 'PETROLINA (PE)'}</span></div>`;
const vela = (de = 'baixo', forca = .9) => `<div style="position:absolute;inset:0;background:${de === 'baixo'
  ? `linear-gradient(0deg,rgba(8,22,41,${forca}) 0%,rgba(8,22,41,${forca * .55}) 38%,transparent 62%)`
  : `linear-gradient(180deg,rgba(8,22,41,${forca}) 0%,rgba(8,22,41,${forca * .5}) 35%,transparent 58%)`}"></div>`;
const arraste = `<div style="position:absolute;right:80px;bottom:130px;font-size:24px;font-weight:700;letter-spacing:.2em;color:#F2B544">ARRASTE →</div>`;

// ---------- modelos de tela ----------
const T = {
  // foto cheia com título embaixo
  fotoBaixo: ({ img, rot, l1, l2, txt, px = 120, capa }) => `<img class="foto" src="${foto(img)}">${vela('baixo', .94)}<div style="position:absolute;inset:0 0 auto;height:260px;background:linear-gradient(180deg,rgba(8,22,41,.6),transparent)"></div>
    <div style="position:absolute;left:80px;top:70px">${marca(30)}</div>
    <div style="position:absolute;left:80px;right:80px;bottom:${capa ? 200 : 150}px;display:flex;flex-direction:column;gap:18px">
      ${rot ? `<span class="rot" style="font-size:24px">${rot}</span>` : ''}
      <div class="tit" style="font-size:${px}px">${l1}</div>${l2 ? `<div class="tit ouro" style="font-size:${px}px;margin-top:-4px">${l2}</div>` : ''}
      ${txt ? `<div class="txt" style="margin-top:14px">${txt}</div>` : ''}</div>
    ${capa ? arraste : ''}${rodape('#fff', 'PETROLINA (PE) · 07 & 08 NOV')}`,
  // navy com texto
  navy: ({ rot, l1, l2, txt, px = 110, pag }) => `<div class="fundo"></div>${ondas(950, 180, 1400)}${ondas(80, 1300, 1000)}
    <div style="position:absolute;left:80px;right:80px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;gap:22px">
      ${rot ? `<span class="rot" style="font-size:24px">${rot}</span>` : ''}
      <div class="tit" style="font-size:${px}px">${l1}</div>${l2 ? `<div class="tit ouro" style="font-size:${px}px;margin-top:-6px">${l2}</div>` : ''}
      ${txt ? `<div class="traco" style="margin-top:16px"></div><div class="txt" style="margin-top:8px">${txt}</div>` : ''}</div>
    ${rodape('#fff', pag)}`,
  // claro com foto em cima
  claroFoto: ({ img, rot, l1, l2, txt, px = 92, pag }) => `<div class="claro"></div>${ondas(1000, 1250, 1100, 'esc')}
    <div style="position:absolute;left:60px;right:60px;top:60px;height:640px;border-radius:36px;overflow:hidden"><img class="foto" src="${foto(img)}"></div>
    <div style="position:absolute;left:80px;right:80px;top:760px;display:flex;flex-direction:column;gap:14px;color:#0B1E36">
      ${rot ? `<span class="rot" style="font-size:22px;color:#C98A1B">${rot}</span>` : ''}
      <div class="tit" style="font-size:${px}px">${l1}${l2 ? ` <span style="color:#C98A1B">${l2}</span>` : ''}</div>
      ${txt ? `<div style="font-size:32px;line-height:1.4;color:#3A4B60;margin-top:8px">${txt}</div>` : ''}</div>
    ${rodape('#0B1E36', pag)}`,
  // frase (citação) sobre navy
  frase: ({ frase, autor, pag }) => `<div class="fundo"></div>${ondas(540, 675, 1700)}
    <div style="position:absolute;left:90px;top:170px;font-size:300px;font-weight:800;line-height:1" class="ouro">“</div>
    <div style="position:absolute;left:90px;right:90px;top:400px;display:flex;flex-direction:column;gap:40px">
      <div class="tit" style="font-size:84px;line-height:1.02">${frase}</div>
      <div class="traco"></div>
      <span class="rot" style="font-size:24px">${autor}</span></div>
    ${rodape('#fff', pag)}`,
  // data/agenda
  dia: ({ dia, data, l1, l2, txt, img, pag }) => `<img class="foto" src="${foto(img)}">
    <div style="position:absolute;inset:0;background:linear-gradient(0deg,rgba(8,22,41,.97) 0%,rgba(8,22,41,.9) 45%,rgba(8,22,41,.35) 75%,rgba(8,22,41,.2) 100%)"></div>
    <div style="position:absolute;left:80px;top:80px"><span class="pill"><span class="rot" style="font-size:22px">${dia}</span></span></div>
    <div style="position:absolute;left:80px;right:80px;bottom:170px;display:flex;flex-direction:column;gap:18px">
      <div class="tit ouro" style="font-size:150px">${data}</div>
      <div class="tit" style="font-size:84px">${l1}</div>${l2 ? `<div class="tit" style="font-size:84px;color:#F2B544;margin-top:-6px">${l2}</div>` : ''}
      <div class="txt" style="margin-top:10px">${txt}</div></div>
    ${rodape('#fff', pag)}`,
};

// ---------- posts ----------
const P = {
  // cards únicos
  'card-e-hoje': [T.fotoBaixo({ img: 'porsol', rot: 'Sábado · 07/11 · Petrolina (PE)', l1: 'É HOJE.', l2: 'BEM-VINDOS AO VALE.', px: 118, txt: 'Começa hoje o ANOREG Conecta: lideranças do serviço notarial e registral reunidas no Vale do São Francisco.' })],
  'card-ao-vivo': [`<div class="fundo"></div>${ondas(950, 200, 1500)}
    <div style="position:absolute;left:80px;top:80px;display:flex;align-items:center;gap:14px;background:#E53935;padding:14px 26px;border-radius:12px;font-weight:900;font-size:34px;letter-spacing:.06em"><span style="width:20px;height:20px;border-radius:50%;background:#fff"></span>AO VIVO</div>
    <div style="position:absolute;left:80px;right:80px;top:300px;display:flex;flex-direction:column;gap:20px">
      <div class="tit" style="font-size:132px">ACOMPANHE</div><div class="tit ouro" style="font-size:132px;margin-top:-8px">DE ONDE ESTIVER</div>
      <div class="txt" style="margin-top:20px">A transmissão do ANOREG Conecta está no ar. O link está na bio.</div>
      <span class="rot" style="font-size:24px;margin-top:10px">07 & 08 nov · Petrolina (PE)</span></div>
    ${rodape()}`],
  'card-frase-encontro': [T.frase({ frase: 'O futuro da nossa atividade não nasce no isolamento. <span class="ouro">Nasce quando a gente se encontra.</span>', autor: 'ANOREG Conecta · Vale do São Francisco' })],
  'card-confianca': [T.claroFoto({ img: 'carimbo', rot: 'Notariado e registro', l1: 'Confiança que vira', l2: 'segurança.', txt: 'Todos os dias, o trabalho de cartórios e registros transforma confiança em segurança para a vida das pessoas.' })],
  'card-obrigado': [T.fotoBaixo({ img: 'rio', rot: 'Obrigado pela presença', l1: 'UM ENCONTRO.', l2: 'MUITAS CONEXÕES.', px: 112, txt: 'Obrigado a todos que fizeram o ANOREG Conecta em Petrolina. Até a próxima.' })],

  // carrossel 1: o evento
  'carrossel-o-evento': [
    T.fotoBaixo({ img: 'cidade', rot: '07 & 08 de novembro', l1: 'ANOREG', l2: 'CONECTA', px: 170, txt: 'Dois dias no Vale do São Francisco. Veja o que vem por aí.', capa: true }),
    T.navy({ rot: 'O encontro', l1: 'Lideranças do', l2: 'extrajudicial reunidas.', px: 96, txt: 'O serviço notarial e registral se encontra em Petrolina para dois dias de integração, conhecimento e fortalecimento institucional.', pag: '2 / 6' }),
    T.dia({ img: 'equipe', dia: 'Dia 1 · Sábado', data: '07/11', l1: 'Conhecimento', l2: 'e diálogos.', txt: 'E, à noite, um momento de integração entre os participantes.', pag: '3 / 6' }),
    T.dia({ img: 'rio', dia: 'Dia 2 · Domingo', data: '08/11', l1: 'O Vale', l2: 'de um novo jeito.', txt: 'O Vale do São Francisco vivido de perto, com quem faz a atividade.', pag: '4 / 6' }),
    T.claroFoto({ img: 'catedral', rot: 'Onde', l1: 'Arca Escola de Negócios', l2: '· Petrolina (PE)', px: 80, txt: 'No coração do Vale do São Francisco, onde o rio une Pernambuco e Bahia.', pag: '5 / 6' }),
    T.navy({ rot: 'Vem com a gente', l1: 'Acompanhe', l2: 'por aqui.', px: 130, txt: 'Ative as notificações, marque quem está no evento e acompanhe a transmissão pelo link da bio.', pag: '6 / 6' }),
  ],
  // carrossel 2: por que se encontrar (texto do vídeo de abertura)
  'carrossel-ponto-de-encontro': [
    T.fotoBaixo({ img: 'porsol', rot: 'ANOREG Conecta', l1: 'Todo encontro começa', l2: 'antes da chegada.', px: 104, capa: true }),
    T.fotoBaixo({ img: 'rio', rot: 'Vale do São Francisco', l1: 'Aqui o São Francisco', l2: 'une margens.', px: 96, txt: 'E o Vale une histórias.' }),
    T.fotoBaixo({ img: 'carimbo', rot: 'Todos os dias', l1: 'O notariado e o registro', l2: 'transformam confiança em segurança.', px: 82, txt: 'Para a vida das pessoas.' }),
    T.fotoBaixo({ img: 'moca', rot: 'O futuro da atividade', l1: 'Não nasce', l2: 'no isolamento.', px: 104 }),
    T.fotoBaixo({ img: 'aperto', rot: 'Nasce quando', l1: 'a gente', l2: 'se encontra.', px: 130 }),
    T.navy({ rot: 'Petrolina (PE) · 07 & 08 nov', l1: 'Sejam bem-vindos', l2: 'ao ANOREG Conecta.', px: 92, txt: 'O Vale do São Francisco é mais do que o nosso cenário. É o nosso ponto de encontro.' }),
  ],
};

async function main() {
  const so = process.argv[2]?.split(',');
  const launch = {};
  if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
  if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
  const browser = await chromium.launch(launch);
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  for (const [nome, telas] of Object.entries(P)) {
    if (so && !so.includes(nome)) continue;
    const out = path.join(root, 'saida', 'posts', nome); fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
    for (const [i, html] of telas.entries()) {
      await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap" rel="stylesheet"><style>${css}</style></head><body><div class="c">${html}</div></body></html>`);
      await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(200);
      const estoura = await page.evaluate(() => [...document.querySelectorAll('.tit,.txt')].some(e => e.scrollWidth > e.clientWidth + 2 || e.getBoundingClientRect().right > 1080));
      if (estoura) console.warn(`  ⚠ ${nome} ${i + 1}: texto passa da largura`);
      await page.screenshot({ path: path.join(out, `${i + 1}.png`) });
    }
    console.log('✓', nome, telas.length);
  }
  await browser.close();
}
main();

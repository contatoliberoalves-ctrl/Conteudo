// Capas dos 3 carrosséis do VDE Repescagem Civil (Eduarda), com a foto de óculos.
// As capas 1, 5 e 9 saem do dados.json (capaFoto); aqui ficam as outras 9, em HTML próprio:
// etiquetas de story, texto atrás da cabeça, tweet, nota do iPhone, capa dividida e foto com degradê.
// Uso: CHROMIUM_PATH=... RENDER_PROXY=$HTTPS_PROXY node capas_repescagem.mjs  -> saida/capas-repescagem/<n>.png
// Fotos (fora do git) em fotos/: eduarda-oculos-base.jpg (foto inteira com o pé escurecido),
// eduarda-oculos-topo.jpg (parte de cima, limpa) e eduarda-oculos-recorte.png (recorte sem fundo).
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const root = path.dirname(new URL(import.meta.url).pathname);
const F = n => 'file://' + path.join(root, 'fotos', n);
const out = path.join(root, 'saida', 'capas-repescagem');
fs.mkdirSync(out, { recursive: true });

const PINK = '#EE2A8A', BLUSH = '#FDEAF4', TINTA = '#1E1A1C', PLUM = '#1A0A28';
const TIGHT = "font-family:'Inter Tight',sans-serif";
const SERIF = "font-family:'Gloock',serif;font-weight:400";
const CURS = "font-family:'Yellowtail',cursive";
const ARROBA = '@eduardacaraciolo';

const base = `<img src="${F('eduarda-oculos-base.jpg')}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">`;
const arroba = (cor = '#fff') => `<div style="position:absolute;left:84px;bottom:64px;${TIGHT};font-weight:600;font-size:26px;color:${cor};opacity:.85">${ARROBA}</div>`;

// Etiquetas de story: cada linha numa etiqueta, levemente inclinadas.
const etiquetas = (kicker, l1, l2) => `${base}
  <div style="position:absolute;left:70px;right:70px;bottom:120px;display:flex;flex-direction:column;align-items:flex-start;gap:10px">
    <div style="${TIGHT};font-weight:700;font-size:28px;letter-spacing:.14em;text-transform:uppercase;color:#fff;margin:0 0 10px 14px">${kicker}</div>
    ${l1.map((t, i) => `<div style="background:#fff;color:${PINK};${TIGHT};font-weight:900;font-size:68px;line-height:1;letter-spacing:-.04em;padding:12px 22px 14px;border-radius:18px;transform:rotate(${i % 2 ? 1.5 : -2}deg)">${t}</div>`).join('')}
    <div style="background:${PINK};color:#fff;${CURS};font-size:96px;line-height:1;padding:4px 30px 20px;border-radius:18px;transform:rotate(-3deg);margin-top:6px">${l2}</div>
  </div>${arroba()}`;

// Texto atrás da cabeça: palavra gigante no fundo blush e o recorte por cima.
const atras = (topo, gigante, cursiva, px = 330, topCurs = 430) => `<div style="position:absolute;inset:0;background:${BLUSH}"></div>
  <div style="position:absolute;left:84px;right:84px;top:96px;${TIGHT};font-weight:800;font-size:58px;line-height:1.05;letter-spacing:-.03em;color:${TINTA}">${topo}</div>
  <div style="position:absolute;left:0;right:0;top:210px;text-align:center;${TIGHT};font-weight:900;font-size:${px}px;line-height:.82;letter-spacing:-.06em;color:${PINK}">${gigante}</div>
  <img src="${F('eduarda-oculos-recorte.png')}" style="position:absolute;left:0;bottom:0;width:1300px">
  <div style="position:absolute;left:0;right:0;top:${topCurs}px;display:flex;justify-content:center"><div style="background:${TINTA};color:#fff;${CURS};font-size:80px;line-height:1;padding:6px 30px 20px;border-radius:16px;transform:rotate(-3deg)">${cursiva}</div></div>`;

// Card de tweet sobre a foto.
const tweet = (texto, rodape) => `${base}
  <div style="position:absolute;left:60px;right:60px;bottom:70px;background:#fff;border-radius:32px;padding:34px 40px 30px;box-shadow:0 30px 60px rgba(0,0,0,.35)">
    <div style="display:flex;align-items:center;gap:20px">
      <div style="width:92px;height:92px;border-radius:50%;background:url('${F('eduarda-oculos-topo.jpg')}') 46% 52%/310% no-repeat"></div>
      <div style="${TIGHT};line-height:1.15"><div style="font-weight:800;font-size:34px;color:#0F1419">Eduarda Caraciolo</div><div style="font-weight:500;font-size:28px;color:#536471">${ARROBA}</div></div>
    </div>
    <div style="${TIGHT};font-weight:500;font-size:40px;line-height:1.22;letter-spacing:-.01em;color:#0F1419;margin-top:20px">${texto}</div>
    <div style="${TIGHT};font-weight:500;font-size:26px;color:#536471;margin-top:24px">${rodape}</div>
  </div>`;

// Nota do iPhone (checklist) sobre a foto.
const nota = (titulo, itens) => `${base}
  <div style="position:absolute;left:90px;right:90px;bottom:70px;background:#fff;border-radius:34px;overflow:hidden;box-shadow:0 30px 60px rgba(0,0,0,.35)">
    <div style="display:flex;justify-content:space-between;padding:26px 36px 0;${TIGHT};font-weight:600;font-size:30px;color:#E0A100"><span>‹ Notas</span><span>OK</span></div>
    <div style="padding:12px 36px 32px">
      <div style="${TIGHT};font-weight:500;font-size:24px;color:#8A8A8E;text-align:center">25 de novembro de 2026</div>
      <div style="${TIGHT};font-weight:800;font-size:52px;line-height:1.05;letter-spacing:-.03em;color:#111;margin:10px 0 12px">${titulo}</div>
      ${itens.map(([ok, t]) => `<div style="display:flex;align-items:center;gap:20px;margin-top:12px;${TIGHT};font-weight:500;font-size:34px;color:#111">
        <span style="flex:none;width:44px;height:44px;border-radius:50%;${ok ? 'background:#E0A100' : 'border:3px solid #C7C7CC'};display:grid;place-items:center;color:#fff;font-size:28px;font-weight:800">${ok ? '✓' : ''}</span>${t}</div>`).join('')}
    </div></div>`;

// Capa dividida: foto em cima, painel claro embaixo com serifa.
const dividida = (kicker, titulo, cursiva) => `<div style="position:absolute;inset:0;background:${BLUSH}"></div>
  <div style="position:absolute;left:0;right:0;top:0;height:800px;background:url('${F('eduarda-oculos-topo.jpg')}') center 60%/cover"></div>
  <div style="position:absolute;left:84px;right:84px;top:800px;bottom:120px;display:flex;flex-direction:column;justify-content:center">
    <div style="${TIGHT};font-weight:700;font-size:26px;letter-spacing:.18em;text-transform:uppercase;color:${PINK}">${kicker}</div>
    <div style="${SERIF};font-size:108px;line-height:1;letter-spacing:-.02em;color:${TINTA};margin-top:18px">${titulo}</div>
    <div style="${CURS};font-size:104px;line-height:1.05;color:${PINK};margin-top:2px">${cursiva}</div>
  </div>${arroba(TINTA)}`;

// Foto inteira com degradê e serifa branca (profissional).
const degrade = (kicker, titulo, cursiva) => `${base}
  <div style="position:absolute;left:84px;right:84px;bottom:150px">
    <div style="${TIGHT};font-weight:700;font-size:26px;letter-spacing:.18em;text-transform:uppercase;color:#F7B9E0">${kicker}</div>
    <div style="${SERIF};font-size:104px;line-height:1;letter-spacing:-.02em;color:#fff;margin-top:20px">${titulo}</div>
    <div style="${CURS};font-size:104px;line-height:1.05;color:#F29AD8;margin-top:4px">${cursiva}</div>
  </div>${arroba()}`;

// Variações do degradê (4 e 12): texto só no pé escuro da foto, longe do rosto.
const degradeForte = (kicker, titulo, cursiva) => `${base}
  <div style="position:absolute;left:84px;right:84px;bottom:140px">
    <div style="display:inline-block;background:${PINK};color:#fff;${TIGHT};font-weight:700;font-size:24px;letter-spacing:.14em;text-transform:uppercase;padding:10px 22px;border-radius:999px">${kicker}</div>
    <div style="${TIGHT};font-weight:900;font-size:92px;line-height:.95;letter-spacing:-.045em;text-transform:uppercase;color:#fff;margin-top:22px">${titulo}</div>
    <div style="${CURS};font-size:100px;line-height:1.05;color:#F29AD8;margin-top:2px">${cursiva}</div>
  </div>${arroba()}`;
const degradeCentro = (kicker, titulo, cursiva) => `${base}
  <div style="position:absolute;left:70px;right:70px;bottom:130px;text-align:center">
    <div style="${TIGHT};font-weight:700;font-size:24px;letter-spacing:.2em;text-transform:uppercase;color:#F7B9E0">${kicker}</div>
    <div style="${SERIF};font-size:98px;line-height:1;letter-spacing:-.02em;color:#fff;margin-top:18px">${titulo}</div>
    <div style="${CURS};font-size:98px;line-height:1.05;color:#F29AD8">${cursiva}</div>
  </div><div style="position:absolute;left:0;right:0;bottom:56px;text-align:center;${TIGHT};font-weight:600;font-size:26px;color:#fff;opacity:.85">${ARROBA}</div>`;

const CAPAS = {
  2: etiquetas('Depoimentos · VDE Civil', ['Vieram da', 'repescagem'], 'e passaram!'),
  3: tweet('Elas vieram da repescagem e passaram. Separei 4 mensagens que chegaram no meu direct depois do resultado.', 'Depoimentos · VDE Repescagem Civil'),
  4: degrade('Depoimentos · VDE Civil', 'Vieram da repescagem', 'e passaram'),
  6: atras('Reprovou na', '2ª&nbsp;FASE?', 'não comece do zero', 236),
  7: nota('Reprovou na 2ª fase?', [[true, 'Não comece do zero'], [false, 'Veja onde perdeu ponto']]),
  8: dividida('Repescagem OAB 48 · Civil', 'Reprovou na<br>2ª fase?', 'Não comece do zero'),
  10: atras('Reprovou e pensou em trocar de', 'MATÉRIA?', 'pensa bem', 232, 420),
  11: tweet('Reprovou em Civil e tá pensando em trocar de matéria na repescagem? Lê isso antes de decidir.', 'Repescagem OAB 48 · Civil'),
  12: degrade('Repescagem · Civil', 'Trocar de matéria', 'na repescagem?'),
  13: degradeForte('Depoimentos · VDE Civil', 'Vieram da<br>repescagem', 'e passaram'),
  14: degradeCentro('Depoimentos · VDE Civil', 'Vieram da repescagem', 'e passaram'),
  15: degrade('Repescagem OAB 48 · Civil', 'Reprovou na<br>2ª fase?', 'Não comece do zero'),
  16: degradeForte('Repescagem OAB 48 · Civil', 'Reprovou na<br>2ª fase?', 'não comece do zero'),
  17: degradeForte('Repescagem · Civil', 'Trocar de<br>matéria?', 'pensa bem'),
  18: degradeCentro('Repescagem · Civil', 'Trocar de matéria', 'na repescagem?'),
};

const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors', '--allow-file-access-from-files'] });
const browser = await chromium.launch(launch);
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
for (const [n, corpo] of Object.entries(CAPAS)) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800;900&family=Gloock&family=Yellowtail&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0}body{width:1080px;height:1350px;position:relative;overflow:hidden;-webkit-font-smoothing:antialiased}</style></head><body>${corpo}</body></html>`;
  const arq = path.join(root, 'build', `capa-rep-${n}.html`);
  fs.mkdirSync(path.dirname(arq), { recursive: true });
  fs.writeFileSync(arq, html);
  await page.goto('file://' + arq);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(out, `${n}.png`) });
}
await browser.close();
console.log('✓', Object.keys(CAPAS).length, 'capas em', out);

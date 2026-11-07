// Cenas e vinhetas para a transmissão do evento ANOREG Conecta · Vale do São Francisco (Petrolina, 7 e 8/11/2026),
// na identidade do site do evento: navy → petróleo, dourado no CONECTA, rótulos espaçados, ondas concêntricas.
// Uso: node render.mjs [png|video] → saida/cenas/*.png (1920×1080; tarjas com fundo transparente) e saida/videos/*.mp4
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.dirname(new URL(import.meta.url).pathname);
const W = 1920, H = 1080, FPS = 30;
const OURO = 'linear-gradient(180deg,#F7C65A 0%,#E9A62C 100%)';
const css = `
*{box-sizing:border-box;margin:0}
body{background:transparent;font-family:'Inter',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}
.c{position:relative;width:${W}px;height:${H}px;overflow:hidden;color:#fff}
.fundo{position:absolute;inset:0;background:radial-gradient(120% 120% at 85% 15%,#0f4a63 0%,#0b2e4d 40%,#0a1d36 75%,#081629 100%)}
.claro{position:absolute;inset:0;background:#EEF1F4}
.ondas{position:absolute;width:1600px;height:1600px;border-radius:50%;background:repeating-radial-gradient(circle,rgba(110,190,220,.16) 0 1.5px,transparent 1.5px 30px);-webkit-mask:radial-gradient(circle,#000 0%,#000 45%,transparent 70%)}
.rot{font-weight:700;letter-spacing:.32em;text-transform:uppercase;color:#F2B544}
.tit{font-weight:800;letter-spacing:-.045em;line-height:.9}
.ouro{background:${OURO};-webkit-background-clip:text;background-clip:text;color:transparent}
.pill{display:inline-flex;align-items:center;gap:14px;border:1.5px solid rgba(242,181,68,.45);background:rgba(10,29,54,.55);border-radius:999px;padding:14px 28px}
.card{border:1.5px solid rgba(255,255,255,.14);background:linear-gradient(180deg,rgba(23,63,92,.55),rgba(10,32,58,.55));border-radius:40px}
.marca{font-weight:800;letter-spacing:-.02em}
.marca b{font-weight:400}
@keyframes sobe{from{opacity:0;transform:translateY(60px)}to{opacity:1;transform:none}}
@keyframes some{from{opacity:1}to{opacity:0}}
@keyframes aparece{from{opacity:0}to{opacity:1}}
@keyframes gira{from{transform:translate(-50%,-50%) rotate(0)}to{transform:translate(-50%,-50%) rotate(360deg)}}
@keyframes pulsa{0%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(1.06)}100%{transform:translate(-50%,-50%) scale(1)}}
@keyframes expande{from{transform:translate(-50%,-50%) scale(.4);opacity:0}to{transform:translate(-50%,-50%) scale(1);opacity:1}}
@keyframes linha{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes brilho{from{background-position:-200% 0}to{background-position:200% 0}}
@keyframes cortina{0%{transform:translateX(-100%)}45%,55%{transform:translateX(0)}100%{transform:translateX(100%)}}
`;
const marca = (px = 34, cor = '#fff') => `<span class="marca" style="font-size:${px}px;color:${cor}">ANOREG <b>CON<span style="color:#F2B544">•</span>ECTA</b></span>`;
const ondas = (x, y, d = 1600, anim = '') => `<div class="ondas" style="left:${x}px;top:${y}px;width:${d}px;height:${d}px;transform:translate(-50%,-50%);${anim}"></div>`;
const topo = () => `<div style="position:absolute;left:120px;top:80px;display:flex;flex-direction:column;gap:8px">${marca(34)}<span style="font-size:16px;letter-spacing:.42em;color:rgba(255,255,255,.7)">VALE DO SÃO FRANCISCO</span></div>
  <div style="position:absolute;right:120px;top:92px;font-size:18px;font-weight:700;letter-spacing:.3em;color:rgba(255,255,255,.75)">PETROLINA • PE · 07 & 08 NOV 2026</div>`;
const a = (nome, dur, atraso = 0, extra = '') => `animation:${nome} ${dur}s cubic-bezier(.2,.8,.2,1) ${atraso}s both${extra}`;

// ---------- cenas (cada uma devolve HTML; as animações só valem nos vídeos) ----------
const C = {};
C.abertura = () => `<div class="fundo"></div>${ondas(1640, 200, 1700, a('expande', 2.2))}
  <div style="position:absolute;left:150px;top:200px;display:flex;flex-direction:column;gap:26px">
    <span class="pill" style="align-self:flex-start;${a('sobe', .8, .2)}"><span class="rot" style="font-size:20px">✦ Um encontro que conecta o extrajudicial</span></span>
    <div class="tit" style="font-size:200px;${a('sobe', 1, .4)}">ANOREG</div>
    <div class="tit ouro" style="font-size:208px;margin-top:-24px;${a('sobe', 1, .65)}">CONECTA</div>
    <div style="font-size:40px;font-weight:400;letter-spacing:.32em;color:rgba(255,255,255,.85);${a('sobe', .9, .9)}">VALE DO SÃO FRANCISCO</div>
    <div style="font-size:30px;line-height:1.5;color:rgba(255,255,255,.82);max-width:860px;${a('sobe', .9, 1.15)}">Lideranças do serviço notarial e registral reunidas em Petrolina para dois dias de integração, conhecimento e fortalecimento institucional.</div>
  </div>
  <div class="card" style="position:absolute;right:120px;top:250px;width:600px;padding:50px 52px;${a('sobe', 1, 1.3)}">
    <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:700;letter-spacing:.24em;color:rgba(255,255,255,.85)"><span>PETROLINA • PERNAMBUCO</span><span>2026</span></div>
    <div class="rot" style="font-size:22px;margin-top:46px">Novembro</div>
    <div class="tit" style="font-size:150px;margin-top:10px;white-space:nowrap">07 <span style="font-size:70px;color:#F2B544;font-weight:600">&</span> 08</div>
    <div style="font-size:30px;margin-top:24px;color:rgba(255,255,255,.9)">Um encontro. Muitas conexões.</div>
    <div style="height:1.5px;background:rgba(255,255,255,.18);margin:34px 0 26px"></div>
    <div style="font-size:22px;color:rgba(255,255,255,.85)">📍 Arca Escola de Negócios · Petrolina</div>
  </div>`;
const telaFrase = (rotulo, linha1, linha2, sub, extra = '') => `<div class="fundo"></div>${ondas(1640, 220, 1700, 'animation:pulsa 6s ease-in-out infinite')}${ondas(260, 1000, 1200, 'animation:pulsa 6s ease-in-out 3s infinite')}${topo()}
  <div style="position:absolute;left:150px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;gap:30px">
    <span class="rot" style="font-size:24px;${a('sobe', .8, .1)}">${rotulo}</span>
    <div class="tit" style="font-size:190px;${a('sobe', .9, .3)}">${linha1}</div>
    <div class="tit ouro" style="font-size:190px;margin-top:-20px;${a('sobe', .9, .5)}">${linha2}</div>
    <div style="font-size:36px;color:rgba(255,255,255,.85);margin-top:10px;${a('sobe', .9, .7)}">${sub}</div>${extra}
  </div>`;
C['em-instantes'] = () => telaFrase('Transmissão ao vivo', 'JÁ VAMOS', 'COMEÇAR', 'Fique com a gente: o ANOREG Conecta começa em instantes.');
C.intervalo = () => telaFrase('Intervalo', 'VOLTAMOS', 'EM INSTANTES', 'Aproveite para se conectar com quem está ao seu lado.');
C['dia-1'] = () => telaFrase('Dia 1 · Sábado · 07/11', 'CONHECIMENTO', 'E DIÁLOGOS', 'Conhecimento, diálogos e uma noite de integração.');
C['dia-2'] = () => telaFrase('Dia 2 · Domingo · 08/11', 'O VALE', 'DE UM NOVO JEITO', 'O Vale do São Francisco vivido de um novo jeito.');
C.encerramento = () => telaFrase('Obrigado pela presença', 'UM ENCONTRO.', 'MUITAS CONEXÕES.', 'ANOREG Conecta · Vale do São Francisco · Petrolina 2026');
C.liderancas = () => `<div class="claro"></div>
  <div style="position:absolute;right:-300px;top:-300px;width:1100px;height:1100px;border-radius:50%;background:repeating-radial-gradient(circle,rgba(11,30,54,.07) 0 1.5px,transparent 1.5px 30px)"></div>
  <div style="position:absolute;left:150px;top:90px">${marca(32, '#0B1E36')}</div>
  <div style="position:absolute;left:150px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;gap:34px;color:#0B1E36">
    <span class="rot" style="font-size:24px;color:#C98A1B;${a('sobe', .8, .1)}">Presenças confirmadas</span>
    <div class="tit" style="font-size:150px;line-height:.98;${a('sobe', .9, .3)}">Lideranças que<br>fazem o extrajudicial<br>avançar.</div>
    <div style="font-size:32px;color:#4A5A6E;${a('sobe', .9, .6)}">Dois dias de integração, conhecimento e fortalecimento institucional.</div>
  </div>`;
C['fundo-camera'] = () => `<div class="fundo"></div>${ondas(1700, 160, 1500, 'animation:pulsa 8s ease-in-out infinite')}${ondas(200, 1000, 1100, 'animation:pulsa 8s ease-in-out 4s infinite')}
  <div style="position:absolute;left:120px;bottom:80px;display:flex;flex-direction:column;gap:8px">${marca(30)}<span style="font-size:15px;letter-spacing:.42em;color:rgba(255,255,255,.7)">VALE DO SÃO FRANCISCO · PETROLINA 2026</span></div>`;
C.palestra = () => `<div class="fundo"></div>${ondas(1640, 220, 1700, 'animation:pulsa 6s ease-in-out infinite')}${topo()}
  <div style="position:absolute;left:150px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;gap:26px">
    <span class="rot" style="font-size:24px">A seguir</span>
    <div class="tit" style="font-size:150px">TÍTULO DA PALESTRA</div>
    <div style="width:140px;height:6px;background:${OURO};border-radius:3px"></div>
    <div style="font-size:44px;font-weight:700">Nome do palestrante</div>
    <div style="font-size:30px;color:rgba(255,255,255,.8)">Cargo · Instituição</div>
  </div>`;
// Tarjas (lower thirds) com fundo transparente
const tarja = (nome, cargo) => `<div style="position:absolute;left:110px;bottom:110px;display:flex;align-items:stretch;border-radius:22px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.35)">
  <div style="width:14px;background:${OURO}"></div>
  <div style="background:linear-gradient(180deg,#0f3550,#0a1d36);padding:26px 40px 26px 34px;display:flex;flex-direction:column;gap:8px;min-width:760px">
    <div style="font-size:46px;font-weight:800;letter-spacing:-.02em">${nome}</div>
    <div style="font-size:26px;color:rgba(255,255,255,.82)">${cargo}</div></div>
  <div style="background:rgba(10,29,54,.92);padding:0 30px;display:flex;align-items:center;border-left:1.5px solid rgba(255,255,255,.12)">${marca(24)}</div></div>`;
C['tarja-palestrante'] = () => tarja('Nome do Palestrante', 'Cargo · Instituição');
C['tarja-ao-vivo'] = () => `<div style="position:absolute;right:110px;top:90px;display:flex;align-items:center;gap:16px;background:rgba(10,29,54,.9);border:1.5px solid rgba(242,181,68,.5);border-radius:999px;padding:14px 26px;box-shadow:0 14px 30px rgba(0,0,0,.3)"><span style="width:16px;height:16px;border-radius:50%;background:#E5484D"></span><span style="font-size:22px;font-weight:800;letter-spacing:.24em">AO VIVO</span><span style="width:1.5px;height:26px;background:rgba(255,255,255,.25)"></span>${marca(22)}</div>`;
const TRANSP = new Set(['tarja-palestrante', 'tarja-ao-vivo']);

// ---------- vídeos ----------
const V = {
  'abertura-animada': { cena: 'abertura', seg: 8 },
  'intervalo-loop': { cena: 'intervalo', seg: 12 },
  'em-instantes-loop': { cena: 'em-instantes', seg: 12 },
  'encerramento': { cena: 'encerramento', seg: 8 },
  'contagem-10s': { seg: 11, html: () => `<div class="fundo"></div>${ondas(960, 540, 1500, 'animation:gira 40s linear infinite')}
    <div style="position:absolute;left:0;right:0;top:120px;text-align:center"><span class="rot" style="font-size:26px">A transmissão começa em</span></div>
    ${Array.from({ length: 10 }, (_, i) => `<div class="tit ouro" style="position:absolute;left:0;right:0;top:300px;text-align:center;font-size:420px;opacity:0;animation:aparece .25s ease ${i}s both, some .3s ease ${i + .75}s forwards">${10 - i}</div>`).join('')}
    <div style="position:absolute;left:0;right:0;top:330px;text-align:center;opacity:0;animation:aparece .4s ease 10s both"><div class="tit" style="font-size:200px">ANOREG</div><div class="tit ouro" style="font-size:200px;margin-top:-10px">CONECTA</div></div>
    <div style="position:absolute;left:0;right:0;bottom:110px;text-align:center;font-size:20px;letter-spacing:.42em;color:rgba(255,255,255,.75)">VALE DO SÃO FRANCISCO · PETROLINA 2026</div>` },
  'transicao-stinger': { seg: 1.6, html: () => `<div style="position:absolute;inset:0;background:${OURO};animation:cortina 1.6s cubic-bezier(.7,0,.3,1) both"></div>
    <div style="position:absolute;inset:0;background:#0a1d36;animation:cortina 1.6s cubic-bezier(.7,0,.3,1) .12s both;display:flex;align-items:center;justify-content:center">${marca(90)}</div>`, transp: true },
};

async function main() {
  const modo = process.argv[2];
  const launch = {};
  if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
  if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
  const browser = await chromium.launch(launch);
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  const abrir = async corpo => {
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet"><style>${css}</style></head><body><div class="c">${corpo}</div></body></html>`);
    await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(300);
  };
  const tempo = async ms => page.evaluate(ms => document.getAnimations().forEach(x => { x.pause(); x.currentTime = ms; }), ms);
  if (modo !== 'video') {
    const out = path.join(root, 'saida', 'cenas'); fs.mkdirSync(out, { recursive: true });
    for (const [nome, f] of Object.entries(C)) {
      await abrir(f()); await tempo(20000);
      await page.screenshot({ path: path.join(out, `${nome}.png`), omitBackground: TRANSP.has(nome) });
      console.log('✓ cena', nome);
    }
  }
  if (modo !== 'png') {
    const out = path.join(root, 'saida', 'videos'); fs.mkdirSync(out, { recursive: true });
    for (const [nome, v] of Object.entries(V)) {
      if (process.argv[3] && !process.argv[3].split(",").includes(nome)) continue;
      const tmp = path.join(root, 'build', nome); fs.rmSync(tmp, { recursive: true, force: true }); fs.mkdirSync(tmp, { recursive: true });
      await abrir(v.html ? v.html() : C[v.cena]());
      const n = Math.round(v.seg * FPS);
      for (let i = 0; i < n; i++) { await tempo(i * 1000 / FPS); await page.screenshot({ path: path.join(tmp, `${String(i).padStart(4, '0')}.png`), omitBackground: !!v.transp }); }
      const mp4 = path.join(out, `${nome}.mp4`);
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(tmp, '%04d.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'veryfast', mp4]);
      if (v.transp) execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(tmp, '%04d.png'), '-c:v', 'prores_ks', '-profile:v', '4444', '-pix_fmt', 'yuva444p10le', path.join(out, `${nome}-alfa.mov`)]);
      fs.rmSync(tmp, { recursive: true, force: true });
      console.log('✓ vídeo', nome, `${v.seg}s`);
    }
  }
  await browser.close();
}
main();

// Vídeos de transmissão e reels feitos com as cenas do vídeo de abertura do evento (referência do cliente),
// com textos na identidade do ANOREG Conecta. O vídeo original não vai para o git: fica em referencia/abertura.mp4
// (ou REF=/caminho/do/video.mp4), em 4K 16:9, com legendas queimadas na base, que são cortadas aqui.
// Uso: node videos-ref.mjs [nome1,nome2] → saida/videos/<nome>.mp4
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.dirname(new URL(import.meta.url).pathname);
const REF = process.env.REF || path.join(root, 'referencia', 'abertura.mp4');
const FPS = 30;
const OURO = 'linear-gradient(180deg,#F7C65A 0%,#E9A62C 100%)';
const css = `
*{box-sizing:border-box;margin:0}
body{background:transparent;font-family:'Inter',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}
.c{position:relative;overflow:hidden;color:#fff}
.fundo{position:absolute;inset:0;background:radial-gradient(120% 120% at 85% 15%,#0f4a63 0%,#0b2e4d 40%,#0a1d36 75%,#081629 100%)}
.ondas{position:absolute;border-radius:50%;transform:translate(-50%,-50%);background:repeating-radial-gradient(circle,rgba(110,190,220,.16) 0 1.5px,transparent 1.5px 30px);-webkit-mask:radial-gradient(circle,#000 0%,#000 45%,transparent 70%)}
.rot{font-weight:700;letter-spacing:.32em;text-transform:uppercase;color:#F2B544}
.tit{font-weight:800;letter-spacing:-.045em;line-height:.92}
.ouro{background:${OURO};-webkit-background-clip:text;background-clip:text;color:transparent}
.sombra{text-shadow:0 4px 30px rgba(0,0,0,.45)}
.pill{display:inline-flex;align-items:center;gap:14px;border:1.5px solid rgba(242,181,68,.55);background:rgba(10,29,54,.6);border-radius:999px;padding:14px 30px}
.marca{font-weight:800;letter-spacing:-.02em}.marca b{font-weight:400}
`;
const marca = (px = 34, cor = '#fff') => `<span class="marca" style="font-size:${px}px;color:${cor}">ANOREG <b>CON<span style="color:#F2B544">•</span>ECTA</b></span>`;
const ondas = (x, y, d) => `<div class="ondas" style="left:${x}px;top:${y}px;width:${d}px;height:${d}px"></div>`;
const vela = (lado = 'baixo') => `<div style="position:absolute;inset:0;background:${lado === 'baixo'
  ? 'linear-gradient(0deg,rgba(8,22,41,.82) 0%,rgba(8,22,41,.35) 38%,transparent 60%)'
  : 'linear-gradient(180deg,rgba(8,22,41,.8) 0%,rgba(8,22,41,.3) 30%,transparent 48%)'}"></div>`;

// ---------- camadas (HTML) ----------
// 16:9
const H = {
  selo: () => `<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,22,41,.55) 0%,transparent 16%)"></div>
    <div style="position:absolute;left:90px;top:64px;display:flex;flex-direction:column;gap:6px">${marca(30)}<span style="font-size:14px;letter-spacing:.42em;color:rgba(255,255,255,.8)">VALE DO SÃO FRANCISCO</span></div>
    <div style="position:absolute;right:90px;top:74px;font-size:16px;font-weight:700;letter-spacing:.3em;color:rgba(255,255,255,.85)">PETROLINA • PE · 07 & 08 NOV</div>`,
  frase: (rot, l1, l2, px = 110) => `${vela()}<div class="sombra" style="position:absolute;left:120px;bottom:120px;display:flex;flex-direction:column;gap:20px;max-width:1500px">
    <span class="rot" style="font-size:22px">${rot}</span>
    <div class="tit" style="font-size:${px}px">${l1}</div>${l2 ? `<div class="tit ouro" style="font-size:${px}px;margin-top:-6px">${l2}</div>` : ''}
    <div style="width:140px;height:4px;background:${OURO};margin-top:10px"></div></div>`,
  fundo: () => `<div class="fundo"></div>${ondas(1640, 200, 1700)}${ondas(260, 1000, 1200)}`,
  final: (rot, l1, l2, sub) => `<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;text-align:center">
    <span class="rot" style="font-size:24px">${rot}</span>
    <div class="tit" style="font-size:190px">${l1}</div><div class="tit ouro" style="font-size:190px;margin-top:-16px">${l2}</div>
    <div style="font-size:30px;letter-spacing:.24em;color:rgba(255,255,255,.85);margin-top:18px">${sub}</div></div>`,
  rodape: txt => `<div style="position:absolute;left:0;right:0;bottom:80px;display:flex;justify-content:center"><span class="pill"><span class="rot" style="font-size:20px">${txt}</span></span></div>`,
};
// 9:16
const R = {
  gancho: (rot, l1, l2) => `${vela('topo')}<div class="sombra" style="position:absolute;left:80px;right:80px;top:250px;display:flex;flex-direction:column;gap:16px">
    <span class="rot" style="font-size:24px">${rot}</span>
    <div class="tit" style="font-size:104px">${l1}</div><div class="tit ouro" style="font-size:104px;margin-top:-4px">${l2}</div></div>`,
  meio: (rot, l1, l2) => `${vela()}<div class="sombra" style="position:absolute;left:80px;right:80px;bottom:430px;display:flex;flex-direction:column;gap:14px">
    <span class="rot" style="font-size:24px">${rot}</span>
    <div class="tit" style="font-size:96px">${l1}</div>${l2 ? `<div class="tit ouro" style="font-size:96px;margin-top:-4px">${l2}</div>` : ''}</div>`,
  data: () => `<div style="position:absolute;left:0;right:0;bottom:430px;display:flex;flex-direction:column;align-items:center;gap:22px">
    <span class="pill"><span class="rot" style="font-size:22px">07 & 08 de novembro</span></span>
    <span style="font-size:26px;letter-spacing:.3em;color:rgba(255,255,255,.9)">PETROLINA • PE</span></div>`,
  // moldura do reel com o vídeo 16:9 no meio: fundo com um furo arredondado onde o vídeo aparece
  moldura: (y, w, h) => {
    const x = (1080 - w) / 2;
    const furo = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='1080' height='1920'><rect x='${x}' y='${y}' width='${w}' height='${h}' rx='34' fill='black'/></svg>`)}")`;
    return `<div style="position:absolute;inset:0;-webkit-mask-image:${furo},linear-gradient(#000,#000);-webkit-mask-composite:xor;mask-composite:exclude">
      <div class="fundo"></div>${ondas(980, 260, 1300)}${ondas(100, 1700, 1100)}</div>
    <div style="position:absolute;left:${x - 3}px;top:${y - 3}px;width:${w + 6}px;height:${h + 6}px;border-radius:37px;border:3px solid rgba(242,181,68,.7)"></div>
    <div style="position:absolute;left:80px;right:80px;top:270px;display:flex;flex-direction:column;gap:12px">
      <span class="rot" style="font-size:24px">Mensagem de boas-vindas</span>
      <div class="tit" style="font-size:120px">ANOREG</div><div class="tit ouro" style="font-size:120px;margin-top:-6px">CONECTA</div>
      <span style="font-size:24px;letter-spacing:.42em;color:rgba(255,255,255,.85);margin-top:6px">VALE DO SÃO FRANCISCO</span></div>
    <div style="position:absolute;left:80px;right:80px;top:${y + h + 70}px;display:flex;flex-direction:column;gap:16px">
      <div class="tit" style="font-size:86px">07 <span style="font-size:46px;color:#F2B544;font-weight:600">&</span> 08 NOV</div>
      <span style="font-size:28px;color:rgba(255,255,255,.88)">📍 Arca Escola de Negócios · Petrolina • PE</span></div>`;
  },
};

// ---------- roteiros ----------
// Cortes: [início, fim, modo, centro] no tempo do vídeo de referência.
// modo h = 16:9 sem a faixa da legenda; v = 9:16 recortado (centro = posição horizontal 0–1); fit = 16:9 inteiro sobre fundo desfocado (9:16);
// moldura = 16:9 com legenda, encaixado na moldura do reel B.
// Camadas: [html, início, fim] no tempo do vídeo final (fim = null → até o fim).
const VIDEOS = {
  'bem-vindos-ao-vale': {
    w: 1920, h: 1080, cortes: [[2.0, 7.4, 'h'], [7.6, 10.3, 'h'], [10.5, 13.35, 'h'], [47.5, 51.15, 'h'], [51.3, 53.55, 'h']], fim: 5,
    camadas: t => [
      [H.selo(), 0.6, t.cartao - 0.3],
      [H.frase('Petrolina recebe', 'BEM-VINDOS', 'AO VALE'), 0.9, 5.0],
      [H.frase('Vale do São Francisco', 'Aqui o São Francisco', 'une margens.', 96), t.ini[1] + 0.3, t.ini[3] - 0.2],
      [H.frase('Notariado e registro', 'Um encontro.', 'Muitas conexões.', 104), t.ini[3] + 0.4, t.cartao - 0.3],
      [H.final('Vale do São Francisco', 'ANOREG', 'CONECTA', '07 & 08 NOV 2026 · PETROLINA • PE'), t.cartao + 0.5, null],
    ],
  },
  'confianca-intervalo': {
    w: 1920, h: 1080, cortes: [[13.55, 15.6, 'h'], [15.85, 17.75, 'h'], [18.0, 19.8, 'h'], [40.9, 44.7, 'h'], [44.95, 47.3, 'h']], fim: 5,
    camadas: t => [
      [H.selo(), 0.6, t.cartao - 0.3],
      [H.frase('Notariado e registro', 'Confiança que vira', 'segurança.', 100), 0.8, t.ini[3] - 0.2],
      [H.frase('Para a vida das pessoas', 'Todos os dias,', 'em todo lugar.', 100), t.ini[3] + 0.4, t.ini[4] - 0.1],
      [H.frase('ANOREG Conecta', 'O futuro nasce quando', 'a gente se encontra.', 92), t.ini[4] + 0.2, t.cartao + 0.1],
      [H.final('Intervalo', 'VOLTAMOS', 'EM INSTANTES', 'ANOREG CONECTA · VALE DO SÃO FRANCISCO'), t.cartao + 0.5, null],
    ],
  },
  'ponto-de-encontro': {
    w: 1920, h: 1080, cortes: [[10.5, 13.35, 'h'], [47.5, 51.15, 'h'], [51.3, 55.1, 'h'], [58.55, 62.4, 'hcheio']],
    camadas: t => [
      [H.selo(), 0.6, t.ini[2] - 0.2],
      [H.frase('Vale do São Francisco', 'Mais do que', 'o nosso cenário.', 104), 0.8, t.ini[2] - 0.6],
      [H.rodape('07 & 08 NOV 2026 · Petrolina • PE · Ao vivo'), t.ini[3] + 0.8, null],
    ],
  },
  'reel-encontro': {
    w: 1080, h: 1920, audio: true, xf: 0.3,
    cortes: [[2.0, 7.4, 'v', .5], [7.6, 10.3, 'v', .5], [10.5, 13.35, 'v', .55], [13.5, 15.65, 'v', .45], [15.8, 17.8, 'v', .5], [17.95, 19.85, 'v', .72],
      [47.5, 51.15, 'v', .36], [51.3, 53.6, 'v', .7], [53.6, 55.15, 'fit'], [58.55, 62.6, 'fit']],
    camadas: t => [
      [R.gancho('ANOREG Conecta · 2026', 'TODO ENCONTRO', 'COMEÇA ANTES DA CHEGADA'), 0.5, 5.0],
      [R.meio('Notariado e registro', 'Confiança que vira', 'segurança.'), t.ini[3] + 0.3, t.ini[6] - 0.3],
      [R.meio('Vale do São Francisco', 'O nosso ponto', 'de encontro.'), t.ini[6] + 0.4, t.ini[8] - 0.2],
      [R.data(), t.ini[9] + 0.6, null],
    ],
  },
  'reel-boas-vindas': {
    w: 1080, h: 1920, audio: true, xf: 0.3, moldura: { y: 760, w: 1000, h: 562 },
    cortes: [[19.95, 38.45, 'moldura'], [55.25, 62.6, 'moldura']],
    camadas: () => [],
  },
};

const ff = args => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...args], { stdio: 'inherit' });
const dur = f => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());
const ENC = ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', '-preset', 'fast', '-r', String(FPS)];

function corte([ini, fim, modo, cx], v, saida, comAudio) {
  let vf;
  if (modo === 'h') vf = 'crop=3300:1856:270:0,scale=1920:1080:flags=lanczos';
  else if (modo === 'hcheio') vf = 'scale=1920:1080:flags=lanczos';
  else if (modo === 'v') {
    const x = Math.round(Math.min(3840 - 1046, Math.max(0, cx * 3840 - 523)));
    vf = `crop=1046:1860:${x}:0,scale=1080:1920:flags=lanczos`;
  } else if (modo === 'fit') vf = 'crop=3840:1880:0:0,split[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=40:4,eq=brightness=-0.12[bg];[b]scale=1080:-2:flags=lanczos[fg];[bg][fg]overlay=0:(H-h)/2';
  else if (modo === 'moldura') vf = `scale=${v.moldura.w}:${v.moldura.h}:flags=lanczos,pad=1080:1920:${(1080 - v.moldura.w) / 2}:${v.moldura.y}:color=0x0a1d36`;
  ff(['-ss', String(ini), '-to', String(fim), '-i', REF, '-vf', `${vf},fps=${FPS},format=yuv420p`, ...ENC, ...(comAudio ? ['-c:a', 'aac', '-b:a', '192k', '-ar', '48000'] : ['-an']), saida]);
}

async function main() {
  if (!fs.existsSync(REF)) { console.error(`✗ falta o vídeo de referência: ${REF}`); process.exit(1); }
  const so = process.argv[2]?.split(',');
  const launch = {};
  if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
  if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
  const browser = await chromium.launch(launch);
  const out = path.join(root, 'saida', 'videos'); fs.mkdirSync(out, { recursive: true });
  for (const [nome, v] of Object.entries(VIDEOS)) {
    if (so && !so.includes(nome)) continue;
    const tmp = path.join(root, 'build', nome); fs.rmSync(tmp, { recursive: true, force: true }); fs.mkdirSync(tmp, { recursive: true });
    const page = await browser.newPage({ viewport: { width: v.w, height: v.h } });
    const png = async (corpo, arq, transp = true) => {
      await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet"><style>${css}</style></head><body><div class="c" style="width:${v.w}px;height:${v.h}px">${corpo}</div></body></html>`);
      await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(200);
      await page.screenshot({ path: arq, omitBackground: transp });
    };
    // 1) cortes
    const clipes = v.cortes.map((c, i) => { const f = path.join(tmp, `c${i}.mp4`); corte(c, v, f, v.audio); return f; });
    if (v.fim) { // cartão final: fundo navy parado (sem áudio)
      const fundo = path.join(tmp, 'fundo.png'); await png(H.fundo(), fundo, false);
      const f = path.join(tmp, 'cartao.mp4');
      ff(['-loop', '1', '-framerate', String(FPS), '-t', String(v.fim), '-i', fundo, '-vf', 'format=yuv420p', ...ENC, ...(v.audio ? [] : ['-an']), f]);
      clipes.push(f);
    }
    // 2) emenda com fusões
    const xf = v.xf ?? 0.5;
    const lens = clipes.map(dur);
    const ini = []; // início de cada clipe no vídeo emendado
    for (let i = 0, s = 0; i < lens.length; i++) { ini[i] = s; s += lens[i] - xf; }
    const total = lens.reduce((a, b) => a + b, 0) - xf * (lens.length - 1);
    const t = { ini, total, cartao: v.fim ? ini[ini.length - 1] : total };
    let fv = '', fa = '', ultimo = '[0:v]', ultA = '[0:a]';
    for (let i = 1; i < clipes.length; i++) {
      fv += `${ultimo}[${i}:v]xfade=transition=fade:duration=${xf}:offset=${(ini[i]).toFixed(3)}[x${i}];`; ultimo = `[x${i}]`;
      if (v.audio) { fa += `${ultA}[${i}:a]acrossfade=d=${xf}[a${i}];`; ultA = `[a${i}]`; }
    }
    // 3) camadas com fade e leve subida
    const camadas = v.camadas(t);
    const extra = [];
    if (v.moldura) camadas.unshift([R.moldura(v.moldura.y, v.moldura.w, v.moldura.h), 0, null, true]);
    for (const [i, [html, a, b, fixa]] of camadas.entries()) {
      const arq = path.join(tmp, `l${i}.png`); await png(html, arq);
      extra.push('-loop', '1', '-framerate', String(FPS), '-t', total.toFixed(3), '-i', arq);
      const k = clipes.length + i, fimC = b ?? total;
      const fade = fixa ? '' : `,fade=t=in:st=${a.toFixed(2)}:d=0.7:alpha=1${b != null ? `,fade=t=out:st=${(fimC - 0.5).toFixed(2)}:d=0.5:alpha=1` : ''}`;
      const y = fixa ? '0' : `'if(lt(t,${a.toFixed(2)}),36,36*pow(max(0,1-(t-${a.toFixed(2)})/0.9),2))'`;
      fv += `[${k}:v]format=rgba${fade}[o${i}];${ultimo}[o${i}]overlay=x=0:y=${y}:shortest=1[y${i}];`; ultimo = `[y${i}]`;
    }
    fv += `${ultimo}fade=t=in:st=0:d=0.5,fade=t=out:st=${(total - 0.7).toFixed(2)}:d=0.7,format=yuv420p[vout]`;
    if (v.audio) fa += `${ultA}afade=t=in:st=0:d=0.3,afade=t=out:st=${(total - 1).toFixed(2)}:d=1[aout]`;
    const mp4 = path.join(out, `${nome}.mp4`);
    ff([...clipes.flatMap(c => ['-i', c]), ...extra, '-filter_complex', fv + (v.audio ? ';' + fa : ''), '-map', '[vout]', ...(v.audio ? ['-map', '[aout]', '-c:a', 'aac', '-b:a', '192k'] : ['-an']),
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '19', '-preset', 'medium', '-r', String(FPS), '-movflags', '+faststart', '-t', total.toFixed(3), mp4]);
    await page.close();
    fs.rmSync(tmp, { recursive: true, force: true });
    console.log('✓', nome, `${total.toFixed(1)}s`);
  }
  await browser.close();
}
main();

// Vídeo "Inscrições abertas · Ponto do Verbum" (Pastor Renato) legendado na identidade Brasa, em versões.
// Entrada: videos/verbum-inscricoes.mov (fora do git) e verbum_legenda.json (palavras com tempo, transcritas).
// Cada estado da tela (legenda, abertura, tópicos, chamada final) vira um PNG transparente 1080×1920; os PNGs
// viram uma trilha com transparência que o ffmpeg sobrepõe ao vídeo.
// Uso: CHROMIUM_PATH=... RENDER_PROXY=$HTTPS_PROXY node legendar_verbum.mjs [v1 v2 ...]
// Saída: saida/verbum/<versão>.mp4 (1080×1920, H.264).
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { C, G, T, HEAD } from '../renato-comum/brasa.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const VIDEO = path.join(root, 'videos', 'verbum-inscricoes.mov');
const OUT = path.join(root, 'saida', 'verbum');
const PALAVRAS = JSON.parse(fs.readFileSync(path.join(root, 'verbum_legenda.json'), 'utf8')).flatMap(s => s.words).map(w => ({ ...w, w: w.w.trim() }));
const FIM = 50.1;
const DESTAQUE = /^(inscrições|abertas|ponto|verbum|interpretação|bíblica|comunicador|sermões|preparação|rotina|plano|estudos|leitura|vida|intelectual|palavra|VERBUM)$/i;
const limpa = w => w.replace(/[.,]$/, '');

// Agrupa palavras: até `max` palavras, quebrando em pontuação ou pausa longa.
function grupos(max) {
  const gs = []; let g = [];
  PALAVRAS.forEach((p, i) => {
    g.push(p);
    const prox = PALAVRAS[i + 1];
    if (!prox || g.length >= max || /[.,]$/.test(p.w) || prox.s - p.e > .45) { gs.push(g); g = []; }
  });
  return gs.map((g, i) => ({ ini: g[0].s, fim: gs[i + 1] ? gs[i + 1][0].s : g.at(-1).e + .4, palavras: g }));
}

const pal = (p, estilo) => DESTAQUE.test(limpa(p.w)) ? `<span style="${estilo}">${limpa(p.w)}</span>` : p.w;
const CTA_INI = 43.71;
const intro = `<div style="position:absolute;left:0;right:0;top:250px;display:flex;flex-direction:column;align-items:center;gap:22px">
  <span style="background:${C.carvao};color:${C.creme};font-family:Inter;font-weight:700;font-size:34px;letter-spacing:.16em;padding:14px 30px;border-radius:999px">INSCRIÇÕES ABERTAS</span>
  <span style="background:${G};color:#fff;${T};font-size:92px;line-height:1;padding:18px 34px 14px;border-radius:22px;box-shadow:0 20px 50px rgba(43,14,0,.35)">Ponto do Verbum</span></div>`;
const cta = (fundo = C.creme) => `<div style="position:absolute;left:110px;right:110px;top:1400px;background:${fundo};border-radius:40px;padding:34px 36px 38px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:14px;box-shadow:0 30px 70px rgba(43,14,0,.45)">
  <div style="font-family:Inter;font-weight:700;font-size:38px;color:${C.carvao}">Quer saber mais?</div>
  <div style="display:flex;align-items:center;gap:22px"><span style="${T};font-size:84px;color:${C.carvao}">Comente</span>
    <span style="background:${G};color:#fff;${T};font-size:96px;line-height:1;padding:16px 30px 10px;border-radius:20px">VERBUM</span></div>
  <div style="font-family:Inter;font-weight:500;font-size:34px;color:${C.carvao};opacity:.8">que eu te envio mais informações</div></div>`;

// v1: legenda dinâmica (até 3 palavras, grande, destaque em caixa laranja).
function v1(t) {
  let h = '';
  if (t >= .6 && t < 4) h += intro;
  if (t >= CTA_INI) return h + cta();
  const g = grupos(3).find(g => t >= g.ini && t < g.fim);
  if (g) h += `<div style="position:absolute;left:70px;right:70px;top:1500px;text-align:center;${T};font-size:88px;line-height:1.08;color:#fff;
    text-shadow:0 6px 0 ${C.carvao},0 0 24px rgba(0,0,0,.55);-webkit-text-stroke:3px ${C.carvao};paint-order:stroke">${g.palavras.map(p => pal(p, `display:inline-block;background:${G};padding:0 16px;border-radius:14px;-webkit-text-stroke:0;text-shadow:none;transform:rotate(-2deg)`)).join(' ')}</div>`;
  return h;
}
// v2: frase em cartão creme embaixo + tópicos (os 3 cursos) no alto.
const TOPICOS = [[7.99, 13.3, '01', 'Interpretação Bíblica'], [13.37, 20.7, '02', 'Preparação de Sermões'], [20.77, 35.4, '03', 'Vida Intelectual'], [35.87, CTA_INI, '', 'Tudo em uma só plataforma']];
function v2(t) {
  let h = '';
  if (t >= .6 && t < 4) h += intro;
  const tp = TOPICOS.find(([a, b]) => t >= a && t < b);
  if (tp) h += `<div style="position:absolute;left:90px;right:90px;top:250px;display:flex;align-items:center;gap:24px;background:${C.creme};border-radius:30px;padding:22px 30px;box-shadow:0 20px 50px rgba(43,14,0,.35)">
    ${tp[2] ? `<span style="flex:none;background:${G};color:#fff;${T};font-size:64px;line-height:1;padding:14px 20px 8px;border-radius:16px">${tp[2]}</span>` : ''}
    <span style="${T};font-size:${tp[2] ? 62 : 54}px;line-height:1;color:${C.carvao}">${tp[3]}</span></div>`;
  if (t >= CTA_INI) return h + cta();
  const g = grupos(7).find(g => t >= g.ini && t < g.fim);
  if (g) h += `<div style="position:absolute;left:80px;right:80px;top:1520px;display:flex;justify-content:center"><div style="background:rgba(43,14,0,.82);border-radius:26px;padding:22px 32px;text-align:center;font-family:Inter;font-weight:700;font-size:52px;line-height:1.25;color:#fff">${g.palavras.map(p => pal(p, `color:${C.laranja}`)).join(' ')}</div></div>`;
  return h;
}
// v3/v4 (com a plataforma): a maquete do site redesenhado (verbum_site.mjs) rolando no ritmo da fala
// (verbum_tela.py gera saida/verbum/tela-v3.mp4 e tela-v4.mp4). v3: ele no alto e o site embaixo;
// v4: o site em tela cheia e ele num círculo.
const legenda = (t, top, px = 46) => { const g = grupos(7).find(g => t >= g.ini && t < g.fim);
  return g ? `<div style="position:absolute;left:60px;right:60px;top:${top}px;display:flex;justify-content:center"><div style="background:rgba(43,14,0,.9);border-radius:24px;padding:18px 28px;text-align:center;font-family:Inter;font-weight:700;font-size:${px}px;line-height:1.25;color:#fff;box-shadow:0 14px 36px rgba(0,0,0,.35)">${g.palavras.map(p => pal(p, `color:${C.laranja}`)).join(' ')}</div></div>` : ''; };
const introTopo = top => `<div style="position:absolute;left:0;right:0;top:${top}px;display:flex;flex-direction:column;align-items:center;gap:16px">
  <span style="background:${C.carvao};color:${C.creme};font-family:Inter;font-weight:700;font-size:30px;letter-spacing:.16em;padding:12px 26px;border-radius:999px">INSCRIÇÕES ABERTAS</span>
  <span style="background:${G};color:#fff;${T};font-size:80px;line-height:1;padding:16px 30px 12px;border-radius:20px;box-shadow:0 20px 50px rgba(43,14,0,.35)">Ponto do Verbum</span></div>`;
function v3(t) {
  let h = `<div style="position:absolute;left:0;right:0;top:772px;height:10px;background:${G}"></div>`;
  if (t >= .6 && t < 4) h += introTopo(90);
  if (t >= CTA_INI) return h + cta().replace('top:1400px', 'top:1600px');
  return h + legenda(t, 600, 44);
}
function v4(t) {
  let h = `<div style="position:absolute;left:656px;top:1166px;width:388px;height:388px;border-radius:50%;box-shadow:0 0 0 8px ${C.brasa},0 20px 50px rgba(0,0,0,.4)"></div>`;
  if (t >= CTA_INI) return h + cta().replace('top:1400px', 'top:1575px');
  return h + legenda(t, 1600, 44);
}
const COMPOE = {
  v3: ['-i', path.join(OUT, 'tela-v3.mp4'), '-filter_complex',
    'color=c=0x2B0E00:s=1080x1920:r=25[bg];[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,crop=1080:780:0:640,setsar=1[eu];[bg][eu]overlay=0:0:shortest=1[a];[a][2:v]overlay=0:780[b];[b][1:v]overlay=0:0:eof_action=pass,format=yuv420p[v]'],
  v4: ['-i', path.join(OUT, 'tela-v4.mp4'), '-i', path.join(OUT, 'mascara.png'), '-filter_complex',
    '[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,crop=640:640:220:720,scale=380:380,format=rgba[eu];[3:v]format=gray,scale=380:380[m];[eu][m]alphamerge[circ];[2:v][circ]overlay=660:1170[b];[b][1:v]overlay=0:0:eof_action=pass,format=yuv420p[v]'],
};
if (!fs.existsSync(path.join(OUT, 'mascara.png'))) execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'lavfi', '-i', 'color=c=black:s=760x760', '-vf', "format=gray,geq=lum='if(lt(hypot(X-380,Y-380),378),255,0)'", '-frames:v', '1', path.join(OUT, 'mascara.png')]);

const VERSOES = { v1, v2, v3, v4 };
const pedidas = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(VERSOES);

const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
fs.mkdirSync(OUT, { recursive: true });

for (const nome of pedidas) {
  const f = VERSOES[nome];
  // instantes em que algo muda: começo/fim de grupos, abertura, tópicos e CTA
  const marcos = new Set([0, .6, 4, CTA_INI, FIM]);
  for (const n of [3, 7]) for (const g of grupos(n)) { marcos.add(+g.ini.toFixed(2)); marcos.add(+g.fim.toFixed(2)); }
  for (const [a, b] of TOPICOS) { marcos.add(a); marcos.add(b); }
  const ts = [...marcos].filter(x => x >= 0 && x <= FIM).sort((a, b) => a - b);
  const dir = path.join(OUT, `${nome}-quadros`); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  let lista = '', ultimo = null, ultimoArq = '';
  for (let i = 0; i < ts.length - 1; i++) {
    const t0 = ts[i], dur = ts[i + 1] - t0; if (dur <= 0.005) continue;
    const html = f(t0 + .001);
    let arq = ultimoArq;
    if (html !== ultimo) {
      arq = path.join(dir, `${String(i).padStart(4, '0')}.png`);
      await page.setContent(`<!doctype html><html><head>${HEAD}<style>*{box-sizing:border-box;margin:0}html,body{background:transparent;width:1080px;height:1920px;overflow:hidden}</style></head><body style="position:relative">${html}</body></html>`);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: arq, omitBackground: true });
      ultimo = html; ultimoArq = arq;
    }
    lista += `file '${arq}'\nduration ${dur.toFixed(3)}\n`;
  }
  lista += `file '${ultimoArq}'\n`;
  fs.writeFileSync(path.join(dir, 'lista.txt'), lista);
  const trilha = path.join(dir, 'trilha.mov');
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(dir, 'lista.txt'), '-vf', 'fps=25,format=rgba', '-c:v', 'qtrle', trilha]);
  const filtro = COMPOE[nome] || ['-filter_complex', '[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1[b];[b][1:v]overlay=0:0:shortest=0:eof_action=pass,format=yuv420p[v]'];
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', VIDEO, '-i', trilha, ...filtro,
    '-map', '[v]', '-map', '0:a', '-c:v', 'libx264', '-crf', '27', '-preset', 'medium', '-maxrate', '2500k', '-bufsize', '5000k', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', '-t', String(FIM), path.join(OUT, `${nome}.mp4`)]);
  console.log('✓', nome);
}
await browser.close();

// Direito Aleatório: vídeos verticais (1080×1920, Reels) de humor absurdo com conteúdo de Direito de verdade.
// Um personagem "intruso" entra num fato jurídico real; a narração é feita em IA (ElevenLabs), a legenda
// aparece palavra a palavra em sincronia com a voz e cada fala troca a imagem (foto com zoom, número gigante
// ou o personagem). Tudo sai do dados.json.
//
// Uso:   node video.mjs [id,id]          → saida/<id>/<id>.mp4, capa.jpg e roteiro.txt
//        PREVIEW=1 node video.mjs [id]   → só um quadro por cena em saida/<id>/previa/ (rápido, para conferir)
// Nuvem: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node video.mjs
// Voz:   ELEVENLABS_API_KEY no ambiente (na nuvem do Claude Code o proxy já autentica). A voz fica em cache
//        em saida/<id>/voz.*; só é gerada de novo quando o texto, a voz ou a velocidade mudam.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { CG, DEGRADE } from '../cg-comum/identidade.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const { chromium } = createRequire(import.meta.url)('playwright');
const W = 1080, H = 1920, FPS = 30;
const FONTES = 'https://fonts.googleapis.com/css2?family=Antonio:wght@600;700&family=Poppins:ital,wght@0,600;0,700;1,800;1,900&display=swap';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const D = JSON.parse(fs.readFileSync(path.join(root, 'dados.json'), 'utf8'));

// ---------- texto: [[destaque]] vira palavra colorida na legenda e some da narração ----------
function palavrasDaFala(fala) {
  const out = []; let dentro = false;
  for (const parte of fala.split(/(\[\[|\]\])/)) {
    if (parte === '[[') { dentro = true; continue; }
    if (parte === ']]') { dentro = false; continue; }
    for (const p of parte.split(/\s+/).filter(Boolean)) out.push({ t: p, forte: dentro });
  }
  return out;
}
const limpa = fala => palavrasDaFala(fala).map(p => p.t).join(' ');

// ---------- voz: ElevenLabs com o tempo de cada caractere ----------
function narrar(v, dir) {
  const voz = v.voz || D.voz, vel = v.velocidade || D.velocidade || 1, modelo = D.modelo || 'eleven_multilingual_v2';
  const texto = v.cenas.map(c => limpa(c.fala)).join(' ');
  const chave = crypto.createHash('sha1').update([texto, voz, vel, modelo].join('|')).digest('hex');
  const fj = path.join(dir, 'voz.json'), fa = path.join(dir, 'voz.mp3');
  if (fs.existsSync(fj) && fs.existsSync(fa)) {
    const j = JSON.parse(fs.readFileSync(fj, 'utf8'));
    if (j.chave === chave) return { ...j, audio: fa };
  }
  const corpo = path.join(dir, 'voz-pedido.json'), resp = path.join(dir, 'voz-resposta.json');
  fs.writeFileSync(corpo, JSON.stringify({ text: texto, model_id: modelo, language_code: undefined,
    voice_settings: { stability: .45, similarity_boost: .8, style: .25, speed: vel } }));
  execFileSync('curl', ['-sS', '--fail-with-body', '-X', 'POST', `https://api.elevenlabs.io/v1/text-to-speech/${voz}/with-timestamps?output_format=mp3_44100_128`,
    '-H', 'xi-api-key: ' + (process.env.ELEVENLABS_API_KEY || 'proxy'), '-H', 'Content-Type: application/json', '--data-binary', '@' + corpo, '-o', resp], { stdio: 'inherit' });
  const r = JSON.parse(fs.readFileSync(resp, 'utf8'));
  fs.writeFileSync(fa, Buffer.from(r.audio_base64, 'base64'));
  const a = r.alignment, tempos = []; let ini = null, fim = 0;
  a.characters.forEach((ch, i) => {
    if (/\s/.test(ch)) { if (ini !== null) { tempos.push([ini, fim]); ini = null; } return; }
    if (ini === null) ini = a.character_start_times_seconds[i];
    fim = a.character_end_times_seconds[i];
  });
  if (ini !== null) tempos.push([ini, fim]);
  const j = { chave, tempos };
  fs.writeFileSync(fj, JSON.stringify(j)); fs.rmSync(corpo); fs.rmSync(resp);
  console.log('  voz gerada:', texto.length, 'caracteres');
  return { ...j, audio: fa };
}

// ---------- mídia ----------
const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
const cacheMidia = {};
function midia(nome) {
  if (!nome) return null;
  if (nome in cacheMidia) return cacheMidia[nome];
  const f = [path.join(root, 'midia', nome), path.join(root, nome)].find(p => fs.existsSync(p));
  if (!f) { console.warn('  ! imagem não encontrada:', nome); return (cacheMidia[nome] = null); }
  return (cacheMidia[nome] = `data:${MIME[path.extname(f).toLowerCase()]};base64,${fs.readFileSync(f).toString('base64')}`);
}
const RESERVA = 'assets/ninja.svg'; // personagem sem imagem em midia/personagens/ usa o boneco genérico

// ---------- visual ----------
const FUNDOS = {
  sol: `background:repeating-conic-gradient(from 0deg at 50% 46%, #1F8A55 0 10deg, #24995F 10deg 20deg)`,
  degrade: `background:${DEGRADE}`,
  escuro: `background:radial-gradient(90% 60% at 50% 40%, #174130 0%, ${CG.escuro} 75%)`,
  papel: `background:${CG.papel}`,
  pantano: `background:radial-gradient(80% 50% at 50% 60%, #4c7a3a 0%, #1d3a22 70%, #0f2415 100%)`,
  terra: `background:linear-gradient(180deg,#7fbfe6 0%,#d6ecf7 30%,#c2632f 30%,#8a3d1f 60%)`,
  alerta: `background:radial-gradient(90% 60% at 50% 40%, #7d2a24 0%, #2a0f0d 80%)`,
};
const KB = ['kbIn', 'kbPanD', 'kbOut', 'kbPanE'];
const css = `
*{box-sizing:border-box;margin:0}
body{background:#000}
.v{position:relative;width:${W}px;height:${H}px;overflow:hidden;font-family:Poppins,sans-serif;background:${CG.escuro}}
.cena,.leg{position:absolute;inset:0;visibility:hidden}
.foto{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.veu{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.35) 0%,rgba(0,0,0,0) 22%,rgba(0,0,0,0) 48%,rgba(0,0,0,.55) 72%,rgba(0,0,0,.25) 100%)}
.num{position:absolute;left:60px;right:60px;top:330px;height:720px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.num b{font-family:Antonio;font-weight:700;text-transform:uppercase;line-height:.95;letter-spacing:-.01em}
.num span{font:700 44px/1.25 Poppins;margin-top:34px;letter-spacing:.02em}
.leg{display:flex;align-items:flex-start;justify-content:center;top:1150px;bottom:auto;height:400px;padding:0 70px}
.leg p{font:italic 900 78px/1.08 Poppins;text-transform:uppercase;text-align:center;color:#fff;-webkit-text-stroke:16px #06140d;paint-order:stroke fill;filter:drop-shadow(0 8px 0 rgba(0,0,0,.35));letter-spacing:.005em}
.leg i{font-style:inherit;color:${CG.claro}}
.selo{position:absolute;left:60px;top:150px;display:flex;align-items:center;gap:18px;color:#fff;filter:drop-shadow(0 3px 10px rgba(0,0,0,.6))}
.claro .selo,.claro .arroba{color:${CG.tinta};filter:none}
.claro .selo u{background:${CG.verde}}
.selo u{display:block;width:12px;height:76px;background:${CG.claro}}
.selo b{font:700 44px/.95 Antonio;text-transform:uppercase;letter-spacing:.03em}
.arroba{position:absolute;left:0;right:0;top:1590px;text-align:center;font:600 28px Poppins;letter-spacing:.14em;color:#fff;opacity:.85;filter:drop-shadow(0 2px 8px rgba(0,0,0,.7))}
@keyframes ver{from{visibility:visible}to{visibility:visible}}
@keyframes kbIn{from{transform:scale(1.04)}to{transform:scale(1.2)}}
@keyframes kbOut{from{transform:scale(1.2)}to{transform:scale(1.04)}}
@keyframes kbPanD{from{transform:scale(1.14) translateX(-4%)}to{transform:scale(1.14) translateX(4%)}}
@keyframes kbPanE{from{transform:scale(1.14) translateX(4%)}to{transform:scale(1.14) translateX(-4%)}}
@keyframes gira{from{transform:rotate(0)}to{transform:rotate(40deg)}}
@keyframes pop{0%{transform:scale(0) rotate(-12deg)}60%{transform:scale(1.12) rotate(3deg)}100%{transform:scale(1) rotate(0)}}
@keyframes boia{0%,100%{translate:0 0}50%{translate:0 -26px}}
@keyframes bate{0%{transform:scale(2.2);opacity:0}100%{transform:scale(1);opacity:1}}
@keyframes legpop{0%{transform:scale(.82)}100%{transform:scale(1)}}
`;

// Um quadro do personagem: pos = centro | esq | dir | canto (pequeno, por cima da foto) | clones (vários)
function personagem(c, t0) {
  const src = midia(c.personagem) || midia(RESERVA);
  const um = (st, atraso = 0, bob = true) => `<div style="position:absolute;${st};${bob ? `animation:boia 2.4s ease-in-out ${(t0 + atraso).toFixed(3)}s infinite` : ''}">
    <img src="${src}" style="width:100%;display:block;filter:drop-shadow(0 18px 0 rgba(0,0,0,.22));transform-origin:50% 90%;animation:pop .38s cubic-bezier(.3,1.4,.5,1) ${(t0 + atraso).toFixed(3)}s both"></div>`;
  const pos = c.pos || 'centro';
  if (pos === 'clones') {
    const n = c.clones || 9, cols = 3, lado = 300;
    return Array.from({ length: n }, (_, i) => um(`left:${70 + (i % cols) * 320 + (Math.floor(i / cols) % 2 ? 20 : 0)}px;top:${300 + Math.floor(i / cols) * 270}px;width:${lado}px`, .05 + i * .07, false)).join('');
  }
  const t = c.tam || { centro: 640, esq: 520, dir: 520, canto: 300 }[pos];
  const st = { centro: `left:${(W - t) / 2}px;top:${c.y ?? 330}px`, esq: `left:20px;top:${c.y ?? 420}px`, dir: `right:20px;top:${c.y ?? 420}px`, canto: `right:50px;top:${c.y ?? 290}px` }[pos];
  return um(`${st};width:${t}px`);
}

function cena(c, i, t0, dur, fixo) {
  const foto = midia(c.img);
  const fundo = foto
    ? `${c.foco2 ? `<style>@keyframes f${i}{from{object-position:${c.foco || '50% 50%'}}to{object-position:${c.foco2}}}</style>` : ''}<img class="foto" src="${foto}" style="object-position:${c.foco || '50% 50%'};${c.pb ? 'filter:grayscale(1) contrast(1.08);' : ''}${c.foco2 ? 'transform:scale(1.05);' : ''}animation:${c.foco2 ? 'f' + i : c.mov || KB[i % KB.length]} ${dur.toFixed(3)}s ${c.foco2 ? 'ease-in-out' : 'linear'} ${t0.toFixed(3)}s both">${c.numero ? '<div style="position:absolute;inset:0;background:rgba(6,20,13,.72)"></div>' : '<div class="veu"></div>'}`
    : `<div style="position:absolute;inset:-30%;${FUNDOS[c.fundo] || FUNDOS[c.numero ? 'degrade' : 'sol']};${(c.fundo || (c.numero ? '' : 'sol')) === 'sol' ? `animation:gira 12s linear ${t0.toFixed(3)}s both` : ''}"></div>`;
  const claro = !foto && c.fundo === 'papel';
  const cor = c.cor === 'alerta' ? '#FF7A6E' : claro ? CG.verde : CG.claro;
  const tam = c.numero ? (c.tn || Math.max(150, Math.min(560, Math.round(1900 / Math.max(...String(c.numero).split('|').map(l => l.length)))))) : 0;
  const numero = c.numero ? `<div class="num" style="color:${claro ? CG.tinta : '#fff'};animation:bate .28s cubic-bezier(.2,.9,.3,1) ${t0.toFixed(3)}s both">
      <b style="font-size:${tam}px;color:${cor};${c.carimbo ? `border:14px solid ${cor};padding:10px 40px 26px;transform:rotate(-8deg)` : ''}">${String(c.numero).split('|').map(esc).join('<br>')}</b>
      ${c.rotulo ? `<span>${esc(c.rotulo)}</span>` : ''}</div>` : '';
  return `<div class="cena${claro ? ' claro' : ''}" style="animation:ver ${dur.toFixed(3)}s linear ${t0.toFixed(3)}s">${fundo}${numero}${c.personagem ? personagem(c, t0) : ''}${fixo}</div>`;
}

// Legenda: blocos curtos (até 3 palavras / 16 letras, quebrando na pontuação), um por vez.
function legendas(pal) {
  const blocos = []; let b = [];
  const fecha = () => { if (b.length) blocos.push(b); b = []; };
  pal.forEach((p, i) => {
    const letras = b.reduce((a, x) => a + x.t.length + 1, 0) + p.t.length;
    if (b.length && (b.length >= 3 || letras > 16 || p.cena !== b[0].cena)) fecha();
    b.push(p);
    if (/[.,;:!?”"]$/.test(p.t)) fecha();
  });
  fecha();
  return blocos.map((b, i) => {
    const t0 = b[0].ini, prox = blocos[i + 1]?.[0].ini ?? b.at(-1).fim + .5;
    const t1 = Math.min(prox, b.at(-1).fim + .45);
    const txt = b.map(p => { const s = esc(p.t.replace(/[.,;:]+$/, '')); return p.forte ? `<i>${s}</i>` : s; }).join(' ');
    return `<div class="leg" style="animation:ver ${(t1 - t0).toFixed(3)}s linear ${t0.toFixed(3)}s"><p style="animation:legpop .12s ease-out ${t0.toFixed(3)}s both">${txt}</p></div>`;
  }).join('');
}

function montar(v, voz) {
  const pal = []; let k = 0;
  v.cenas.forEach((c, i) => palavrasDaFala(c.fala).forEach(p => { const [ini, fim] = voz.tempos[k++] || []; pal.push({ ...p, cena: i, ini, fim }); }));
  if (k !== voz.tempos.length) throw new Error(`A voz devolveu ${voz.tempos.length} palavras e o roteiro tem ${k}. Apague saida/${v.id}/voz.json e gere de novo.`);
  const ini = v.cenas.map((_, i) => i ? Math.max(0, pal.find(p => p.cena === i).ini - .06) : 0);
  const total = pal.at(-1).fim + (v.fim ?? D.fim ?? 1.2);
  const ev = { dur: total, corte: ini.slice(1), pop: [], batida: [] };
  const serie = (v.serie ?? D.serie ?? '').split(' ').filter(Boolean); // sem "serie" no dados.json, não há selo no canto
  const fixo = `${serie.length ? `<div class="selo"><u></u><b>${esc(serie.slice(0, Math.ceil(serie.length / 2)).join(' '))}<br>${esc(serie.slice(Math.ceil(serie.length / 2)).join(' '))}</b></div>` : ''}<div class="arroba">${esc((v.perfil || D.perfil).toUpperCase())}</div>`;
  const html = v.cenas.map((c, i) => {
    if (c.personagem) ev.pop.push(ini[i] + .05);
    if (c.numero) ev.batida.push(ini[i]);
    return cena(c, i, ini[i], (ini[i + 1] ?? total) - ini[i], fixo);
  }).join('');
  return { html: `<!doctype html><html><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet"><style>${css}</style></head><body><div class="v">${html}${legendas(pal)}</div></body></html>`, total, ev, ini };
}

async function main() {
  const so = process.argv[2]?.split(',');
  const launch = {};
  if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
  if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
  const browser = await chromium.launch(launch);
  for (const v of D.videos) {
    if (so && !so.includes(v.id)) continue;
    console.log('▶', v.id);
    const out = path.join(root, 'saida', v.id); fs.mkdirSync(out, { recursive: true });
    const voz = narrar(v, out);
    const { html, total, ev, ini } = montar(v, voz);
    fs.writeFileSync(path.join(out, 'roteiro.txt'), `${v.titulo}\n\n${v.cenas.map(c => limpa(c.fala)).join(' ')}\n${v.legenda ? '\nLEGENDA DO POST\n' + v.legenda + '\n' : ''}`);
    const page = await browser.newPage({ viewport: { width: W, height: H } });
    await page.setContent(html); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(600);
    const ir = ms => page.evaluate(ms => (window.__an ||= document.getAnimations()).forEach(a => { a.pause(); a.currentTime = ms; }), ms);
    await ir((v.capaEm ?? ini[1] + .5) * 1000);
    await page.screenshot({ path: path.join(out, 'capa.jpg'), type: 'jpeg', quality: 90 });
    if (process.env.PREVIEW) {
      const pv = path.join(out, 'previa'); fs.rmSync(pv, { recursive: true, force: true }); fs.mkdirSync(pv);
      for (let i = 0; i < ini.length; i++) { await ir((ini[i] + Math.min(.7, ((ini[i + 1] ?? total) - ini[i]) * .7)) * 1000); await page.screenshot({ path: path.join(pv, `${String(i + 1).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 70 }); }
      await page.close(); console.log('  prévia:', ini.length, 'cenas,', total.toFixed(1) + 's'); continue;
    }
    const tmp = path.join(root, 'build', v.id); fs.rmSync(tmp, { recursive: true, force: true }); fs.mkdirSync(tmp, { recursive: true });
    const n = Math.round(total * FPS);
    for (let i = 0; i < n; i++) {
      await ir(i * 1000 / FPS);
      await page.screenshot({ path: path.join(tmp, `${String(i).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 92 });
    }
    await page.close();
    fs.writeFileSync(path.join(tmp, 'eventos.json'), JSON.stringify(ev));
    execFileSync('python3', [path.join(root, 'trilha.py'), path.join(tmp, 'eventos.json'), path.join(tmp, 'trilha.wav')], { stdio: 'inherit' });
    const mp4 = path.join(out, v.id + '.mp4'), vol = v.trilha ?? D.trilha ?? .5;
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(tmp, '%05d.jpg'), '-i', voz.audio, '-i', path.join(tmp, 'trilha.wav'),
      '-filter_complex', `[1:a]loudnorm=I=-15:TP=-1.5:LRA=11,apad[v];[2:a]volume=${vol}[m];[v][m]amix=inputs=2:duration=shortest:normalize=0,alimiter=limit=0.95[a]`,
      '-map', '0:v', '-map', '[a]', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '19', '-preset', 'medium', '-c:a', 'aac', '-b:a', '192k', '-t', total.toFixed(3), '-movflags', '+faststart', mp4]);
    fs.rmSync(tmp, { recursive: true, force: true });
    console.log('✓', v.id, `${total.toFixed(1)}s`, '→', path.relative(root, mp4));
  }
  await browser.close();
}
main();

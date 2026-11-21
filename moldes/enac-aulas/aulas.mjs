// Videoaulas curtas (16:9, 1920×1080) do Cartório com Líbero: slides animados sincronizados com a narração
// (ElevenLabs, voz clonada do Líbero). Cada aula é uma lista de cenas; a `fala` de cada cena leva marcadores
// {1} {2}… e o elemento k da cena entra na tela no instante em que a voz chega ao marcador k.
// Só os quadros em que algo se move são capturados; os parados são repetidos (rápido de gerar).
// Uso: node aulas.mjs <arquivo.json> [id,id]   → saida/<id>.mp4   (PREVIEW=1 → só quadros de conferência)
// Nuvem: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node aulas.mjs modelos.json
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
const root = path.dirname(new URL(import.meta.url).pathname);
const { chromium } = createRequire(import.meta.url)('playwright');

const W = 1920, H = 1080, FPS = 25;
const VOZ = process.env.VOZ || 'CufYHxMjViVAOdW9jhL7'; // Líbero Filho (clone profissional)
const MODELO_TTS = process.env.MODELO_TTS || 'eleven_multilingual_v2';
const FONTES = 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@800;900&family=Schibsted+Grotesk:wght@400;500;600;700;800&family=Source+Serif+4:ital,wght@0,500;0,700;1,500&display=swap';
const TEMAS = {
  navy: { bg: 'radial-gradient(120% 110% at 100% 0%,#203A72 0%,#14213A 45%,#0F1A2E 100%)', ink: '#FFFFFF', txt: '#C9D4EA', mute: '#8FA3C8', card: 'rgba(255,255,255,.06)', line: 'rgba(143,176,255,.28)', acc: '#2F64E0', ouro: '#C9A45C', grao: .3 },
  papel: { bg: 'linear-gradient(160deg,#F6F2E8 0%,#EDE6D6 100%)', ink: '#0F1A2E', txt: '#2B3854', mute: '#6B7690', card: '#FFFFFF', line: 'rgba(15,26,46,.16)', acc: '#0B4FD8', ouro: '#A8813A', grao: .18 },
  azul: { bg: 'linear-gradient(135deg,#0B4FD8 0%,#0A3DAA 55%,#0F1A2E 130%)', ink: '#FFFFFF', txt: '#DCE6FF', mute: '#A9C0FF', card: 'rgba(255,255,255,.1)', line: 'rgba(255,255,255,.3)', acc: '#0F1A2E', ouro: '#E6CC92', grao: .26 },
};
const T = "font-family:'Big Shoulders Display',sans-serif;font-weight:900;text-transform:uppercase;line-height:.92";
const S = "font-family:'Schibsted Grotesk',sans-serif";
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const rico = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b style="font-weight:800;color:var(--ink)">$1</b>')
  .replace(/\[\[(.+?)\]\]/g, '<span style="background:var(--marca);color:#fff;padding:0 .14em;box-shadow:inset 0 -.09em 0 var(--ouro)">$1</span>');
const EASE = 'cubic-bezier(.2,.8,.2,1)';
let JANELAS = []; // intervalos [início, fim] em que há movimento na tela
const an = (nome, dur, t, extra = '') => { JANELAS.push([t, t + dur]); return `animation:${nome} ${dur}s ${EASE} ${t.toFixed(3)}s both${extra}`; };

const css = t => `
*{box-sizing:border-box;margin:0}
:root{--ink:${t.ink};--txt:${t.txt};--mute:${t.mute};--card:${t.card};--line:${t.line};--acc:${t.acc};--ouro:${t.ouro};--marca:${t.acc === '#0F1A2E' ? '#0F1A2E' : '#0B4FD8'}}
body{background:#0F1A2E}
.v{position:relative;width:${W}px;height:${H}px;overflow:hidden;color:var(--txt);${S};font-weight:500}
.cena{position:absolute;inset:0}
.area{position:absolute;left:130px;right:130px;top:150px;bottom:90px}
.tit{${T};color:var(--ink)}
.rot{display:inline-block;${S};font-weight:800;font-size:24px;letter-spacing:.24em;text-transform:uppercase;color:var(--ouro)}
.card{background:var(--card);border:2px solid var(--line);border-radius:22px}
.lei{font-family:'Source Serif 4',serif;font-style:italic;font-weight:500}
@keyframes sobe{from{opacity:0;transform:translateY(60px)}to{opacity:1;transform:none}}
@keyframes desce{from{opacity:0;transform:translateY(-40px)}to{opacity:1;transform:none}}
@keyframes entra{from{opacity:0;transform:translateX(-70px)}to{opacity:1;transform:none}}
@keyframes escala{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}
@keyframes carimbo{0%{opacity:0;transform:scale(2.2) rotate(-14deg)}60%{opacity:1;transform:scale(.94) rotate(-7deg)}100%{opacity:1;transform:scale(1) rotate(-7deg)}}
@keyframes barra{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes some{from{opacity:1}to{opacity:.28}}
@keyframes acende{from{background:var(--card);border-color:var(--line)}to{background:#1E9E62;border-color:#1E9E62;color:#fff}}
@keyframes anel{from{stroke-dashoffset:0}to{stroke-dashoffset:565}}
@keyframes pisca{0%{opacity:0;transform:scale(.5)}15%{opacity:1;transform:scale(1)}85%{opacity:1}100%{opacity:0}}
`;
const aneis = (x, y, cor = 'var(--line)') => [900, 640, 380].map(d => `<div style="position:absolute;left:${x}px;top:${y}px;width:${d}px;height:${d}px;border-radius:50%;border:2px solid ${cor};transform:translate(-50%,-50%);opacity:.7"></div>`).join('');
const num = n => `<span style="flex:none;width:64px;height:64px;border-radius:16px;background:var(--ouro);display:grid;place-items:center;${S};font-weight:800;font-size:34px;color:#0F1A2E">${n}</span>`;

// ---------- cenas: (s = dados da cena, t0 = início, r(k) = instante do marcador {k} da fala, fim) ----------
const CENAS = {
  capa(s, t0) {
    return `${aneis(1560, 420)}<div class="area" style="display:flex;flex-direction:column;justify-content:center">
      <div style="${an('desce', .6, t0 + .1)}"><span class="rot">${esc(s.rotulo)}</span></div>
      ${s.titulo.map((l, i) => `<div class="tit" style="font-size:${s.ts || 170}px;margin-top:${i ? 6 : 34}px;${an('sobe', .7, t0 + .3 + i * .2)}">${rico(l)}</div>`).join('')}
      <div style="width:160px;height:10px;background:var(--ouro);margin-top:46px;transform-origin:left;${an('barra', .6, t0 + .9)}"></div>
      <div style="font-size:42px;line-height:1.35;margin-top:36px;max-width:1200px;${an('sobe', .6, t0 + 1.1)}">${rico(s.texto)}</div></div>`;
  },
  trio(s, t0, r) {
    return `<div class="area">
      <div style="${an('desce', .5, t0 + .1)}"><span class="rot">${esc(s.rotulo)}</span></div>
      <div class="tit" style="font-size:92px;margin-top:18px;${an('sobe', .6, t0 + .2)}">${rico(s.titulo)}</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:36px;margin-top:56px">
      ${s.itens.map((it, i) => `<div class="card" style="padding:40px 38px 36px;min-height:500px;display:flex;flex-direction:column;${an('sobe', .6, r(i + 1))}">
        <div style="display:flex;align-items:center;gap:20px">${num(i + 1)}<span class="tit" style="font-size:66px">${esc(it.nome)}</span></div>
        <div style="font-weight:800;font-size:44px;line-height:1.15;color:var(--ink);margin-top:34px">${rico(it.apelido)}</div>
        <div style="font-size:33px;line-height:1.38;margin-top:20px">${rico(it.texto)}</div>
        <div style="margin-top:auto;padding-top:22px;border-top:2px solid var(--line);font-weight:700;font-size:25px;letter-spacing:.04em;color:var(--ouro)">${esc(it.lei)}</div></div>`).join('')}</div></div>`;
  },
  alerta(s, t0, r) {
    return `<div class="area" style="display:flex;flex-direction:column;justify-content:center">
      <div style="${an('escala', .5, r(1))}"><span style="display:inline-block;background:var(--ouro);color:#0F1A2E;${S};font-weight:800;font-size:28px;letter-spacing:.2em;padding:12px 24px;border-radius:8px">⚠ ${esc(s.rotulo)}</span></div>
      <div class="tit" style="font-size:${s.ts || 132}px;margin-top:30px;${an('sobe', .6, r(1) + .15)}">${rico(s.titulo)}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:36px;margin-top:54px">
        <div class="card" style="padding:34px 38px;border-color:#E0655A;${an('entra', .5, r(1) + .7)}"><div style="font-weight:800;font-size:26px;letter-spacing:.18em;color:#FF8A7E">✗ ERRADO</div><div style="font-size:42px;font-weight:700;color:var(--ink);margin-top:14px;text-decoration:line-through;text-decoration-color:#E0655A">${rico(s.errado)}</div></div>
        <div class="card" style="padding:34px 38px;border-color:#35C285;${an('entra', .5, r(1) + 1.6)}"><div style="font-weight:800;font-size:26px;letter-spacing:.18em;color:#5FE0A6">✓ CERTO</div><div style="font-size:42px;font-weight:700;color:var(--ink);margin-top:14px">${rico(s.certo)}</div></div></div>
      <div style="font-size:40px;line-height:1.35;margin-top:44px;max-width:1500px;${an('sobe', .6, r(2))}">${rico(s.porque)}</div></div>`;
  },
  historia(s, t0, r) {
    return `<div class="area" style="display:grid;grid-template-columns:1fr 1fr;gap:70px;align-items:center">
      <div><div style="${an('desce', .5, t0 + .1)}"><span class="rot">${esc(s.rotulo)}</span></div>
        <div class="tit" style="font-size:150px;margin-top:22px;${an('sobe', .6, t0 + .2)}">${rico(s.titulo)}</div>
        <div style="margin-top:54px;padding:34px 40px;border-left:10px solid var(--ouro);background:var(--card);border-radius:0 22px 22px 0;${an('sobe', .6, r(s.passos.length + 1))}">
          <div class="tit" style="font-size:84px;color:var(--acc)">${rico(s.pergunta)}</div></div></div>
      <div style="display:flex;flex-direction:column;gap:26px">
      ${s.passos.map((p, i) => `<div class="card" style="display:flex;align-items:center;gap:28px;padding:30px 36px;box-shadow:0 10px 30px rgba(15,26,46,.08);${an('entra', .5, r(i + 1))}">
        <span style="flex:none;width:78px;height:78px;border-radius:50%;display:grid;place-items:center;font-size:42px;font-weight:800;color:#fff;background:${p.ok ? '#1E9E62' : '#D8483C'}">${p.ok ? '✓' : '✗'}</span>
        <div><div style="font-weight:800;font-size:46px;color:var(--ink)">${rico(p.nome)}</div><div style="font-size:31px;margin-top:4px">${rico(p.texto)}</div></div></div>`).join('')}</div></div>`;
  },
  matricula(s, t0, r) {
    const ato = (a, t) => `<div style="position:relative;padding:22px ${a.carimbo ? 270 : 0}px 22px 0;border-top:2px dashed rgba(15,26,46,.22);${an('sobe', .5, t)}">
        <div style="font-weight:800;font-size:27px;letter-spacing:.06em;color:#0B4FD8">${esc(a.sigla)} <span style="color:#6B7690;font-weight:600">· ${esc(a.tipo)}</span></div>
        <div style="font-family:'Source Serif 4',serif;font-size:31px;line-height:1.34;color:#1B2740;margin-top:8px">${rico(a.texto)}</div>
        ${a.carimbo ? `<div style="position:absolute;right:6px;top:34px;border:5px solid #B4862F;color:#B4862F;${S};font-weight:800;font-size:30px;letter-spacing:.14em;padding:8px 18px;border-radius:10px;${an('carimbo', .5, t + .5)}">${esc(a.carimbo)}</div>` : ''}</div>`;
    return `<div class="area" style="display:grid;grid-template-columns:780px 1fr;gap:70px;align-items:center">
      <div><div style="${an('desce', .5, t0 + .1)}"><span class="rot">${esc(s.rotulo)}</span></div>
        <div class="tit" style="font-size:104px;margin-top:20px;${an('sobe', .6, t0 + .2)}">${rico(s.titulo)}</div>
        <div class="card" style="margin-top:44px;padding:34px 38px;border-left:10px solid var(--acc);${an('entra', .6, r(2))}">
          <div style="font-weight:800;font-size:26px;letter-spacing:.14em;color:var(--acc)">${esc(s.lei.fonte)}</div>
          <div class="lei" style="font-size:36px;line-height:1.36;color:var(--ink);margin-top:14px">“${rico(s.lei.texto)}”</div></div></div>
      <div style="background:#FFFDF7;border-radius:10px;padding:40px 48px 30px;box-shadow:0 30px 70px rgba(15,26,46,.22),0 0 0 2px rgba(15,26,46,.1);min-height:760px;${an('sobe', .7, t0 + .35)}">
        <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:5px double #0F1A2E;padding-bottom:16px">
          <div><div style="font-weight:700;font-size:19px;letter-spacing:.14em;white-space:nowrap;color:#6B7690">REGISTRO DE IMÓVEIS · LIVRO 2 · REGISTRO GERAL</div><div class="tit" style="font-size:66px;color:#0F1A2E;margin-top:6px">Matrícula nº ${esc(s.numero)}</div></div>
          <div style="font-weight:700;font-size:19px;letter-spacing:.14em;white-space:nowrap;color:#6B7690">FICHA 01</div></div>
        <div style="font-family:'Source Serif 4',serif;font-size:27px;line-height:1.35;color:#3A4660;padding:16px 0"><b>IMÓVEL:</b> ${esc(s.imovel)}</div>
        ${s.atos.map(a => ato(a, a.em ? r(a.em) : t0 + .9)).join('')}</div></div>`;
  },
  bolso(s, t0, r) {
    return `${aneis(1620, 900)}<div class="area" style="display:flex;flex-direction:column;justify-content:center">
      <div style="${an('desce', .5, t0 + .1)}"><span class="rot">${esc(s.rotulo || 'Regra de bolso')}</span></div>
      <div style="display:flex;flex-direction:column;gap:26px;margin-top:40px">
      ${s.linhas.map((l, i) => `<div style="display:flex;align-items:center;gap:34px;${an('entra', .5, r(i + 1))}">
        <span class="tit" style="font-size:${s.ts || 112}px;min-width:${s.col || 620}px">${rico(l[0])}</span><span style="font-size:70px;color:var(--ouro);font-weight:800">→</span><span class="tit" style="font-size:${s.ts || 112}px">${rico(l[1])}</span></div>`).join('')}</div>
      ${s.frase ? `<div style="font-size:48px;font-weight:700;color:var(--ink);margin-top:56px;padding-top:36px;border-top:3px solid var(--line);${an('sobe', .6, r(s.linhas.length + 1))}">${rico(s.frase)}</div>` : ''}</div>`;
  },
  questao(s, t0, r, fim) {
    const tc = fim - (s.conta || 3) - .3;
    return `<div class="area" style="display:grid;grid-template-columns:1fr 330px;gap:60px;align-items:center">
      <div style="background:#fff;border-radius:22px;padding:46px 54px;box-shadow:0 30px 70px rgba(5,15,40,.35);${an('sobe', .6, t0 + .15)}">
        <div style="display:flex;justify-content:space-between;font-weight:800;font-size:23px;letter-spacing:.18em;color:#0B4FD8"><span>${esc(s.rotulo)}</span><span style="color:#6B7690">${esc(s.selo || '')}</span></div>
        <div style="font-family:'Source Serif 4',serif;font-size:39px;line-height:1.36;color:#0F1A2E;margin-top:22px">${rico(s.enunciado).replace(/var\(--ink\)/g, '#0F1A2E')}</div>
        <div style="display:flex;flex-direction:column;gap:14px;margin-top:30px">
        ${s.alternativas.map((a, i) => `<div style="display:flex;align-items:center;gap:22px;border:2px solid rgba(15,26,46,.16);border-radius:14px;padding:14px 22px;${an('entra', .4, r(1) + i * .55)}">
          <span style="flex:none;width:52px;height:52px;border-radius:50%;background:#0F1A2E;color:#fff;display:grid;place-items:center;font-weight:800;font-size:27px">${'ABCDE'[i]}</span>
          <span style="font-size:34px;font-weight:600;color:#1B2740">${esc(a)}</span></div>`).join('')}</div></div>
      <div style="position:relative;height:330px;${an('escala', .5, tc - .4)}">
        <svg viewBox="0 0 200 200" width="330" height="330" style="transform:rotate(-90deg)"><circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="12"/><circle cx="100" cy="100" r="90" fill="none" stroke="${TEMAS.azul.ouro}" stroke-width="12" stroke-linecap="round" stroke-dasharray="565" style="${an('anel', s.conta || 3, tc, ';animation-timing-function:linear')}"/></svg>
        ${Array.from({ length: s.conta || 3 }, (_, i) => `<div class="tit" style="position:absolute;inset:0;display:grid;place-items:center;font-size:190px;${an('pisca', 1, tc + i, ';animation-timing-function:linear')}">${(s.conta || 3) - i}</div>`).join('')}
        <div style="position:absolute;left:0;right:0;bottom:-64px;text-align:center;font-weight:800;font-size:26px;letter-spacing:.2em;color:var(--ouro)">PENSE ANTES</div></div></div>`;
  },
  gabarito(s, t0, r) {
    return `<div class="area" style="display:grid;grid-template-columns:640px 1fr;gap:64px;align-items:center">
      <div><div style="${an('desce', .5, t0 + .1)}"><span class="rot">Gabarito</span></div>
        <div style="display:flex;flex-direction:column;gap:16px;margin-top:26px">
        ${s.alternativas.map((a, i) => `<div class="card" style="display:flex;align-items:center;gap:22px;padding:18px 24px;border-radius:16px;${i === s.certa ? an('acende', .5, r(1)) : an('some', .5, r(1))}">
          <span style="flex:none;width:54px;height:54px;border-radius:50%;background:#fff;color:#0F1A2E;display:grid;place-items:center;font-weight:800;font-size:28px">${'ABCDE'[i]}</span>
          <span style="font-size:35px;font-weight:700;color:#fff">${esc(a)}</span></div>`).join('')}</div></div>
      <div><div class="tit" style="font-size:150px;${an('escala', .5, r(1))}">${rico(s.titulo)}</div>
        <div style="display:flex;flex-direction:column;gap:22px;margin-top:38px">
        ${s.passos.map((p, i) => `<div style="display:flex;gap:26px;align-items:flex-start;${an('entra', .5, r(i + 2))}">${num(i + 1)}<div style="font-size:40px;line-height:1.3;color:var(--ink);padding-top:6px">${rico(p)}</div></div>`).join('')}</div>
        ${s.lei ? `<div style="margin-top:34px;display:inline-block;border:2px solid var(--ouro);border-radius:12px;padding:14px 24px;font-weight:800;font-size:28px;letter-spacing:.06em;color:var(--ouro);${an('sobe', .5, r(s.passos.length + 2))}">${esc(s.lei)}</div>` : ''}</div></div>`;
  },
};

// ---------- narração: uma chamada por cena, com os instantes de cada caractere ----------
function narrar(cena, antes, depois, dir) {
  const partes = cena.fala.split(/\{(\d+)\}/); // texto, n, texto, n, …
  let limpo = ''; const pos = {};
  partes.forEach((p, i) => { if (i % 2) pos[p] = limpo.length; else limpo += p; });
  limpo = limpo.replace(/\s+$/, '');
  const chave = crypto.createHash('sha1').update([VOZ, MODELO_TTS, limpo].join('|')).digest('hex').slice(0, 16);
  const json = path.join(dir, chave + '.json'), mp3 = path.join(dir, chave + '.mp3');
  if (!fs.existsSync(json)) {
    const corpo = { text: limpo, model_id: MODELO_TTS, voice_settings: { stability: .5, similarity_boost: .8, style: .1, use_speaker_boost: true } };
    if (antes) corpo.previous_text = antes; if (depois) corpo.next_text = depois;
    const req = path.join(dir, chave + '.req.json'); fs.writeFileSync(req, JSON.stringify(corpo));
    const out = execFileSync('curl', ['-sS', '--fail-with-body', '-X', 'POST', `https://api.elevenlabs.io/v1/text-to-speech/${VOZ}/with-timestamps?output_format=mp3_44100_128`,
      '-H', 'xi-api-key: dummy', '-H', 'Content-Type: application/json', '--data-binary', '@' + req], { maxBuffer: 1 << 28 });
    const resp = JSON.parse(out); fs.rmSync(req);
    fs.writeFileSync(mp3, Buffer.from(resp.audio_base64, 'base64'));
    fs.writeFileSync(json, JSON.stringify(resp.alignment));
  }
  const al = JSON.parse(fs.readFileSync(json, 'utf8'));
  const dur = al.character_end_times_seconds.at(-1);
  const marcas = {}; for (const [k, i] of Object.entries(pos)) marcas[k] = al.character_start_times_seconds[Math.min(i, al.characters.length - 1)];
  return { mp3, dur, marcas, limpo };
}
const semMarca = c => c.fala.replace(/\{\d+\}/g, '');

async function main() {
  const arq = process.argv[2]; const so = process.argv[3]?.split(',');
  if (!arq) { console.error('uso: node aulas.mjs <arquivo.json> [id,id]'); process.exit(1); }
  const aulas = JSON.parse(fs.readFileSync(path.resolve(arq), 'utf8')).filter(a => !so || so.includes(a.id));
  const cache = path.join(root, 'build', 'voz'); fs.mkdirSync(cache, { recursive: true });
  const out = path.join(root, 'saida'); fs.mkdirSync(out, { recursive: true });
  if (process.env.SO_CONTAR) { for (const a of aulas) console.log(a.id, a.cenas.reduce((n, c) => n + semMarca(c).length, 0), 'caracteres'); return; }
  const launch = {};
  if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
  if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
  const browser = await chromium.launch(launch);
  for (const a of aulas) {
    const tema = TEMAS[a.tema || 'navy'];
    const tmp = path.join(root, 'build', a.id); fs.rmSync(tmp, { recursive: true, force: true }); fs.mkdirSync(tmp, { recursive: true });
    // 1) voz
    const vozes = a.cenas.map((c, i) => narrar(c, i ? semMarca(a.cenas[i - 1]) : '', a.cenas[i + 1] ? semMarca(a.cenas[i + 1]) : '', cache));
    // 2) linha do tempo e HTML
    JANELAS = []; let t = 0; const partes = [], wavs = [], inicios = [];
    a.cenas.forEach((c, i) => {
      const v = vozes[i], atraso = c.espera ?? .5, dur = atraso + v.dur + (c.pausa ?? .7), fim = t + dur;
      const r = k => t + atraso + (v.marcas[k] ?? 0) - .12;
      const fade = .3, p1 = (fade / dur * 100).toFixed(2), p2 = (100 - fade / dur * 100).toFixed(2), ultima = i === a.cenas.length - 1;
      JANELAS.push([t, t + fade], [fim - fade, fim]);
      partes.push(`<style>@keyframes c${i}{0%{opacity:0}${p1}%{opacity:1}${p2}%{opacity:1}100%{opacity:${ultima ? 1 : 0}}}</style>
        <div class="cena" style="animation:c${i} ${dur}s linear ${t}s both">${CENAS[c.tipo](c, t, r, fim)}</div>`);
      const wav = path.join(tmp, `v${i}.wav`);
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', v.mp3, '-af', `adelay=${Math.round(atraso * 1000)}:all=1,apad=whole_dur=${dur.toFixed(3)}`, '-ar', '44100', '-ac', '1', wav]);
      wavs.push(wav); inicios.push(t); t = fim;
    });
    const total = t;
    const fixo = `<div style="position:absolute;left:130px;right:130px;top:58px;display:flex;justify-content:space-between;align-items:center;${S};font-weight:800;font-size:22px;letter-spacing:.24em;text-transform:uppercase">
        <span style="color:var(--ouro)">Cartório com Líbero</span><span style="color:var(--mute)">${esc(a.faixa || 'Registro de Imóveis')}</span></div>
      <div style="position:absolute;left:130px;right:130px;top:108px;display:flex;gap:10px">${a.cenas.map((_, i) => `<div style="flex:1;height:6px;border-radius:6px;background:var(--line);overflow:hidden"><div style="height:100%;background:var(--ouro);transform-origin:left;animation:barra .5s ${EASE} ${inicios[i].toFixed(3)}s both"></div></div>`).join('')}</div>
      <div style="position:absolute;left:130px;right:130px;bottom:38px;display:flex;justify-content:space-between;${S};font-weight:700;font-size:21px;color:var(--mute)"><span>@liberofilho</span><span>${esc(a.rodape || 'Preparação para o ENAC')}</span></div>`;
    const html = `<!doctype html><html><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet"><style>${css(tema)}</style></head><body><div class="v">
      <div style="position:absolute;inset:0;background:${tema.bg}"></div><div style="position:absolute;inset:0;background-image:url(file://${root}/../cartorio-com-libero/assets/grao.png);background-size:640px;opacity:${tema.grao};mix-blend-mode:overlay"></div>
      ${partes.join('')}${fixo}</div></body></html>`;
    const htmlPath = path.join(tmp, 'aula.html'); fs.writeFileSync(htmlPath, html);
    const page = await browser.newPage({ viewport: { width: W, height: H } });
    await page.goto('file://' + htmlPath); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(600);
    const foto = async (seg, arqv) => { await page.evaluate(ms => document.getAnimations().forEach(x => { x.pause(); x.currentTime = ms; }), seg * 1000); await page.screenshot({ path: arqv, type: 'jpeg', quality: 93 }); };
    if (process.env.PREVIEW) { // um quadro no fim de cada cena (tudo já na tela) e um no meio
      for (let i = 0; i < inicios.length; i++) { const f = (inicios[i + 1] ?? total) - .45; await foto(f, path.join(out, `${a.id}-prev-${i + 1}.jpg`)); }
      await page.close(); console.log('prévia', a.id, total.toFixed(1) + 's'); continue;
    }
    // 3) quadros: captura só quando há movimento; o resto repete o último
    const n = Math.ceil(total * FPS); const lista = []; let ult = null, cont = 0;
    const ativo = s => JANELAS.some(([x, y]) => s >= x - .02 && s <= y + .06);
    for (let i = 0; i < n; i++) {
      const s = i / FPS;
      if (ult === null || ativo(s) || ativo((i - 1) / FPS)) { ult = path.join(tmp, `q${String(cont++).padStart(5, '0')}.jpg`); await foto(s, ult); lista.push([ult, 1]); }
      else lista.at(-1)[1]++;
    }
    await page.close();
    fs.writeFileSync(path.join(tmp, 'quadros.txt'), lista.map(([f, k]) => `file '${f}'\nduration ${(k / FPS).toFixed(4)}`).join('\n') + `\nfile '${lista.at(-1)[0]}'\n`);
    fs.writeFileSync(path.join(tmp, 'audio.txt'), wavs.map(w => `file '${w}'`).join('\n'));
    const mp4 = path.join(out, a.id + '.mp4');
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(tmp, 'quadros.txt'), '-f', 'concat', '-safe', '0', '-i', path.join(tmp, 'audio.txt'),
      '-vf', `fps=${FPS}`, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'medium', '-c:a', 'aac', '-b:a', '160k', '-t', total.toFixed(3), '-movflags', '+faststart', mp4]);
    fs.rmSync(tmp, { recursive: true, force: true });
    console.log('✓', a.id, `${total.toFixed(1)}s`, `${cont} quadros capturados de ${n}`);
  }
  await browser.close();
}
main();

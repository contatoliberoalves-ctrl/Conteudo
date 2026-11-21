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
const MODELO_TTS = process.env.MODELO_TTS || 'eleven_turbo_v2_5';
const VEL = +(process.env.VELOCIDADE || .95); // ritmo da fala (1 = normal)
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
const aneis = (x, y, cor = 'var(--line)') => [900, 640, 380].map(d => `<div data-dec style="position:absolute;left:${x}px;top:${y}px;width:${d}px;height:${d}px;border-radius:50%;border:2px solid ${cor};transform:translate(-50%,-50%);opacity:.7"></div>`).join('');
const num = n => `<span style="flex:none;width:64px;height:64px;border-radius:16px;background:var(--ouro);display:grid;place-items:center;${S};font-weight:800;font-size:34px;color:#0F1A2E">${n}</span>`;

// Ilustrações em traço (viewBox 24): entram nos cartões, nas listas e na capa.
const ICONES = {
  casa: 'M3 11l9-7 9 7M5 10v10h14V10M10 20v-6h4v6',
  predio: 'M5 21V4h9v17M14 9h5v12M3 21h18M8 8h3M8 12h3M8 16h3',
  documento: 'M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6',
  livro: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19a2 2 0 0 0 2 2h13M9 7h6M9 11h4',
  relogio: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  carimbo: 'M9 13V9a3 3 0 1 1 6 0v4M6 13h12v4H6zM5 20h14',
  lupa: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM16 16l5 5',
  chave: 'M7.5 19.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM10.5 12.5L20 3M16 7l3 3M13.5 9.5l2 2',
  cadeado: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3M12 14.5v2',
  escudo: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4',
  pessoas: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c0-3.5 2.5-6 6-6s6 2.5 6 6M16 11a3 3 0 1 0 0-6M17 14c2.5.5 4 2.5 4 6',
  senha: 'M4 8h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4zM10 8v10M13.5 11.5h3M13.5 14.5h3',
  forum: 'M3 9l9-5 9 5M4 9h16M6 9v9M10 9v9M14 9v9M18 9v9M3 21h18M4 18h16',
  mapa: 'M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2zM9 4v14M15 6v14',
  corrente: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  caneta: 'M4 20l4-1L19 8l-3-3L5 16zM14 7l3 3',
  calendario: 'M5 6h14v14H5zM5 10h14M9 4v4M15 4v4M9 14h2M13 14h2',
  moeda: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v10M14.5 9.6c-.5-1-1.4-1.4-2.5-1.4-1.5 0-2.5.8-2.5 2s1 1.6 2.5 1.9 2.5.8 2.5 2-1 2-2.5 2c-1 0-2-.5-2.5-1.5',
  olho: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  regua: 'M3 17L17 3l4 4L7 21zM7 13l2 2M10 10l2 2M13 7l2 2',
  alvo: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  raio: 'M13 3L5 13h6l-1 8 8-10h-6z',
  balao: 'M4 5h16v11H10l-5 4v-4H4z',
  globo: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
};
const ic = (n, px, cor = 'var(--ouro)', sw = 1.5) => `<svg viewBox="0 0 24 24" width="${px}" height="${px}" fill="none" stroke="${cor}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" style="flex:none"><path d="${ICONES[n] || ICONES.documento}"/></svg>`;
const ilus = (n, t, d = 440) => `<div data-dec style="position:relative;width:${d}px;height:${d}px;justify-self:center;${an('escala', .7, t)}">
  <div style="position:absolute;inset:0;border-radius:50%;border:2px solid var(--line)"></div><div style="position:absolute;inset:${d * .09}px;border-radius:50%;background:var(--card);border:2px solid var(--line)"></div>
  <div style="position:absolute;inset:0;display:grid;place-items:center">${ic(n, d * .5, 'var(--ouro)', 1.1)}</div></div>`;
const visto = `<span style="flex:none;width:58px;height:58px;border-radius:50%;background:#1E9E62;display:grid;place-items:center;font-size:32px;font-weight:800;color:#fff">✓</span>`;

// ---------- cenas: (s = dados da cena, t0 = início, r(k) = instante do marcador {k} da fala, fim) ----------
const CENAS = {
  capa(s, t0) {
    return `${aneis(1560, 470)}${s.icone ? `<div data-dec style="position:absolute;left:1560px;top:470px;transform:translate(-50%,-50%)"><div style="${an('escala', .8, t0 + .5)}">${ic(s.icone, 250, 'var(--ouro)', 1)}</div></div>` : ''}
      <div class="area" style="display:flex;flex-direction:column;justify-content:center;${s.icone ? 'right:640px' : ''}">
      <div style="${an('desce', .6, t0 + .1)}"><span class="rot">${esc(s.rotulo)}</span></div>
      ${s.titulo.map((l, i) => `<div class="tit" style="font-size:${s.ts || 170}px;margin-top:${i ? 6 : 34}px;${an('sobe', .7, t0 + .3 + i * .2)}">${rico(l)}</div>`).join('')}
      <div style="width:160px;height:10px;background:var(--ouro);margin-top:46px;transform-origin:left;${an('barra', .6, t0 + .9)}"></div>
      <div style="font-size:42px;line-height:1.35;margin-top:36px;max-width:1200px;${an('sobe', .6, t0 + 1.1)}">${rico(s.texto)}</div></div>`;
  },
  trio(s, t0, r) {
    return `<div class="area" style="display:flex;flex-direction:column;justify-content:center">
      <div style="${an('desce', .5, t0 + .1)}"><span class="rot">${esc(s.rotulo)}</span></div>
      <div class="tit" style="font-size:92px;margin-top:18px;${an('sobe', .6, t0 + .2)}">${rico(s.titulo)}</div>
      <div style="display:grid;grid-template-columns:repeat(${s.itens.length},1fr);gap:${s.itens.length > 3 ? 26 : 36}px;margin-top:${s.nota ? 40 : 56}px;zoom:${s.itens.length > 3 ? .86 : 1}">
      ${s.itens.map((it, i) => `<div class="card" style="padding:40px 38px 36px;min-height:${s.nota ? 440 : 500}px;display:flex;flex-direction:column;${an('sobe', .6, r(i + 1))}">
        ${it.numero ? `<div style="display:flex;align-items:baseline;gap:16px"><span class="tit" style="font-size:170px;color:var(--ouro);line-height:.8">${esc(it.numero)}</span><span style="font-weight:800;font-size:30px;letter-spacing:.08em;text-transform:uppercase;color:var(--ouro)">${esc(it.unidade || '')}</span></div>`
          : `<div style="display:flex;align-items:center;gap:20px">${it.icone ? ic(it.icone, 72) : num(i + 1)}<span class="tit" style="font-size:${it.nome.length > 11 ? 54 : 66}px">${esc(it.nome)}</span></div>`}
        <div style="font-weight:800;font-size:${s.itens.length > 3 ? 40 : 44}px;line-height:1.15;color:var(--ink);margin-top:34px">${rico(it.apelido)}</div>
        <div style="font-size:33px;line-height:1.38;margin-top:20px">${rico(it.texto)}</div>
        <div style="margin-top:auto;padding-top:22px;border-top:2px solid var(--line);font-weight:700;font-size:25px;letter-spacing:.04em;color:var(--ouro)">${esc(it.lei)}</div></div>`).join('')}</div>
      ${s.nota ? `<div style="font-size:38px;line-height:1.35;margin-top:34px;color:var(--ink);${an('sobe', .6, r(s.itens.length + 1))}">${rico(s.nota)}</div>` : ''}</div>`;
  },
  lista(s, t0, r) {
    return `<div class="area" style="display:grid;grid-template-columns:${s.icone ? '1fr 460px' : '1fr'};gap:70px;align-items:center">
      <div><div style="${an('desce', .5, t0 + .1)}"><span class="rot">${esc(s.rotulo)}</span></div>
        <div class="tit" style="font-size:${s.ts || 96}px;margin-top:18px;${an('sobe', .6, t0 + .2)}">${rico(s.titulo)}</div>
        <div style="display:flex;flex-direction:column;gap:${s.gap ?? 26}px;margin-top:46px">
        ${s.itens.map((it, i) => { const [a, b] = Array.isArray(it) ? it : [it]; return `<div style="display:flex;gap:28px;align-items:flex-start;${an('entra', .5, r(i + 1))}">${s.check ? visto : num(i + 1)}
          <div style="padding-top:${b ? 0 : 8}px"><div style="font-weight:800;font-size:${s.tl || 42}px;line-height:1.2;color:var(--ink)">${rico(a)}</div>${b ? `<div style="font-size:32px;line-height:1.34;margin-top:6px">${rico(b)}</div>` : ''}</div></div>`; }).join('')}</div></div>
      ${s.icone ? ilus(s.icone, t0 + .4) : ''}</div>`;
  },
  lei(s, t0, r) {
    return `<div class="area" style="display:flex;flex-direction:column;justify-content:center">
      <div style="${an('desce', .5, t0 + .1)}"><span class="rot">${esc(s.rotulo || 'A letra da lei')}</span></div>
      <div class="card" style="margin-top:28px;padding:44px 54px;border-left:12px solid var(--ouro);${an('sobe', .6, t0 + .25)}">
        <div style="display:flex;align-items:center;gap:18px;font-weight:800;font-size:28px;letter-spacing:.14em;text-transform:uppercase;color:var(--ouro)">${ic('livro', 44)}${esc(s.fonte)}</div>
        <div class="lei" style="font-size:${s.ts || 50}px;line-height:1.34;color:var(--ink);margin-top:20px">“${rico(s.texto).replace(/font-weight:800;color:var\(--ink\)/g, 'font-weight:700;color:var(--ouro)')}”</div></div>
      <div style="display:flex;gap:28px;align-items:flex-start;margin-top:44px;${an('sobe', .6, r(1))}">
        <span style="flex:none;background:var(--marca);color:#fff;font-weight:800;font-size:26px;letter-spacing:.16em;padding:12px 20px;border-radius:8px;box-shadow:inset 0 -5px 0 var(--ouro)">TRADUZINDO</span>
        <div style="font-size:42px;line-height:1.34;color:var(--ink)">${rico(s.traducao)}</div></div></div>`;
  },
  compara(s, t0, r) {
    const cab = (c, cor) => `<div style="display:flex;align-items:center;gap:20px;padding:22px 30px;border-radius:18px;background:${cor};${an('sobe', .5, t0 + .5)}">${c.icone ? ic(c.icone, 60, '#fff') : ''}<span class="tit" style="font-size:60px;color:#fff">${esc(c.nome)}</span></div>`;
    return `<div class="area" style="display:flex;flex-direction:column;justify-content:center">
      <div style="${an('desce', .5, t0 + .1)}"><span class="rot">${esc(s.rotulo)}</span></div>
      <div class="tit" style="font-size:${s.ts || 88}px;margin-top:16px;${an('sobe', .6, t0 + .2)}">${rico(s.titulo)}</div>
      <div style="display:grid;grid-template-columns:${s.col || 330}px 1fr 1fr;gap:0 30px;margin-top:40px;align-items:stretch">
        <div></div>${cab(s.a, '#0B4FD8')}${cab(s.b, '#8A6A2C')}
        ${s.linhas.map((l, i) => l.map((c, j) => `<div style="padding:${s.pad || 24}px ${j ? 30 : 0}px;border-bottom:2px solid var(--line);${j ? `font-size:${s.tl || 36}px;line-height:1.3;color:var(--ink)` : 'font-weight:800;font-size:25px;letter-spacing:.14em;text-transform:uppercase;color:var(--ouro);display:flex;align-items:center'};${an('sobe', .5, r(i + 1))}">${rico(c)}</div>`).join('')).join('')}</div></div>`;
  },
  fluxo(s, t0, r) {
    const n = s.passos.length;
    return `<div class="area" style="display:flex;flex-direction:column;justify-content:center">
      <div style="${an('desce', .5, t0 + .1)}"><span class="rot">${esc(s.rotulo)}</span></div>
      <div class="tit" style="font-size:${s.ts || 88}px;margin-top:16px;${an('sobe', .6, t0 + .2)}">${rico(s.titulo)}</div>
      <div style="display:flex;align-items:stretch;gap:0;margin-top:50px;zoom:${n > 4 ? .82 : 1}">
      ${s.passos.map((p, i) => `${i ? `<div style="flex:none;width:${n > 3 ? 56 : 80}px;display:grid;place-items:center;font-size:54px;font-weight:800;color:${s.quebra === i ? '#FF6B5E' : 'var(--ouro)'};${an('escala', .4, r(i + 1) - .1)}">${s.quebra === i ? '✗' : '→'}</div>` : ''}
        <div class="card" style="flex:1;padding:32px 30px;display:flex;flex-direction:column;min-height:${s.nota ? 380 : 440}px;${p.ruim ? 'border-color:#E0655A;' : ''}${an('sobe', .5, r(i + 1))}">
          <div style="display:flex;align-items:center;justify-content:space-between">${p.icone ? ic(p.icone, 76) : num(i + 1)}${p.tag ? `<span style="background:var(--ouro);color:#0F1A2E;font-weight:800;font-size:25px;padding:8px 16px;border-radius:8px">${esc(p.tag)}</span>` : ''}</div>
          <div class="tit" style="font-size:${n > 3 ? 50 : 58}px;margin-top:26px">${rico(p.nome)}</div>
          <div style="font-size:${n > 3 ? 30 : 33}px;line-height:1.36;margin-top:14px">${rico(p.texto)}</div></div>`).join('')}</div>
      ${s.nota ? `<div style="font-size:40px;line-height:1.35;margin-top:38px;color:var(--ink);${an('sobe', .6, r(n + 1))}">${rico(s.nota)}</div>` : ''}</div>`;
  },
  fecho(s, t0, r) {
    return `${aneis(1560, 470)}<div data-dec style="position:absolute;left:1560px;top:470px;transform:translate(-50%,-50%)"><div style="${an('escala', .8, t0 + .4)}">${ic(s.icone || 'alvo', 250, 'var(--ouro)', 1)}</div></div>
      <div class="area" style="display:flex;flex-direction:column;justify-content:center;right:640px">
      <div style="${an('desce', .5, t0 + .1)}"><span class="rot">${esc(s.rotulo || 'Na próxima aula')}</span></div>
      <div class="tit" style="font-size:${s.ts || 130}px;margin-top:26px;${an('sobe', .7, t0 + .3)}">${rico(s.titulo)}</div>
      <div style="width:160px;height:10px;background:var(--ouro);margin-top:40px;transform-origin:left;${an('barra', .6, t0 + .8)}"></div>
      <div style="font-size:42px;line-height:1.35;margin-top:34px;${an('sobe', .6, t0 + 1)}">${rico(s.texto)}</div></div>`;
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
        <div style="font-family:'Source Serif 4',serif;font-size:31px;line-height:1.34;color:#1B2740;margin-top:8px;--ink:#0F1A2E;${a.riscado ? 'text-decoration:line-through;text-decoration-color:#D8483C;opacity:.6' : ''}">${rico(a.texto)}</div>
        ${a.carimbo ? `<div style="position:absolute;right:6px;top:34px;border:5px solid ${a.cor || '#B4862F'};color:${a.cor || '#B4862F'};background:#FFFDF7;${S};font-weight:800;font-size:30px;letter-spacing:.14em;padding:8px 18px;border-radius:10px;${an('carimbo', .5, t + .5)}">${esc(a.carimbo)}</div>` : ''}</div>`;
    return `<div class="area" style="display:grid;grid-template-columns:780px 1fr;gap:70px;align-items:center">
      <div><div style="${an('desce', .5, t0 + .1)}"><span class="rot">${esc(s.rotulo)}</span></div>
        <div class="tit" style="font-size:${s.ts || 96}px;margin-top:20px;${an('sobe', .6, t0 + .2)}">${rico(s.titulo)}</div>
        ${s.lei ? `<div class="card" style="margin-top:44px;padding:34px 38px;border-left:10px solid var(--ouro);${an('entra', .6, r(s.lei.em || 2))}">
          <div style="font-weight:800;font-size:26px;letter-spacing:.14em;color:var(--ouro)">${esc(s.lei.fonte)}</div>
          <div style="font-size:36px;line-height:1.36;color:var(--ink);margin-top:14px">${rico(s.lei.texto)}</div></div>` : ''}</div>
      <div style="background:#FFFDF7;border-radius:10px;padding:40px 48px 30px;box-shadow:0 30px 70px rgba(15,26,46,.22),0 0 0 2px rgba(15,26,46,.1);min-height:760px;${an('sobe', .7, t0 + .35)}">
        <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:5px double #0F1A2E;padding-bottom:16px">
          <div><div style="font-weight:700;font-size:19px;letter-spacing:.14em;white-space:nowrap;color:#6B7690">REGISTRO DE IMÓVEIS · LIVRO 2 · REGISTRO GERAL</div><div class="tit" style="font-size:66px;color:#0F1A2E;margin-top:6px">Matrícula nº ${esc(s.numero)}</div></div>
          <div style="font-weight:700;font-size:19px;letter-spacing:.14em;white-space:nowrap;color:#6B7690">FICHA 01</div></div>
        <div style="font-family:'Source Serif 4',serif;font-size:27px;line-height:1.35;color:#3A4660;padding:16px 0"><b>IMÓVEL:</b> <span style="--ink:#0F1A2E">${rico(s.imovel)}</span></div>
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
      <div><div class="tit" style="font-size:${s.ts || 150}px;${an('escala', .5, r(1))}">${rico(s.titulo)}</div>
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
  const chave = crypto.createHash('sha1').update([VOZ, MODELO_TTS, VEL, limpo].join('|')).digest('hex').slice(0, 16);
  const json = path.join(dir, chave + '.json'), mp3 = path.join(dir, chave + '.mp3');
  if (!fs.existsSync(json)) {
    const corpo = { text: limpo, model_id: MODELO_TTS, ...(MODELO_TTS.includes('v2_5') ? { language_code: 'pt' } : {}), voice_settings: { stability: .5, similarity_boost: .8, style: .1, use_speaker_boost: true, speed: VEL } };
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
  const arqs = fs.statSync(arq).isDirectory() ? fs.readdirSync(arq).filter(f => f.endsWith('.json')).sort().map(f => path.join(arq, f)) : [arq];
  const aulas = arqs.flatMap(f => [JSON.parse(fs.readFileSync(path.resolve(f), 'utf8'))].flat()).filter(a => !so || so.includes(a.id));
  const cache = path.join(root, 'build', 'voz'); fs.mkdirSync(cache, { recursive: true });
  const out = path.join(root, 'saida'); fs.mkdirSync(out, { recursive: true });
  if (process.env.SO_CONTAR) { for (const a of aulas) console.log(a.id, a.cenas.length, 'cenas', a.cenas.reduce((n, c) => n + semMarca(c).length, 0), 'caracteres'); return; }
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
      const v = vozes[i], atraso = c.espera ?? .5, dur = atraso + v.dur + (c.pausa ?? .9), fim = t + dur;
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
        <span style="color:var(--ouro)">Cartório com Líbero</span><span style="color:var(--mute)">${esc(a.faixa || `Registro de Imóveis · Aula ${String(a.n || '').padStart(2, '0')}`)}</span></div>
      <div style="position:absolute;left:130px;right:130px;top:108px;display:flex;gap:10px">${a.cenas.map((_, i) => `<div style="flex:1;height:6px;border-radius:6px;background:var(--line);overflow:hidden"><div style="height:100%;background:var(--ouro);transform-origin:left;animation:barra .5s ${EASE} ${inicios[i].toFixed(3)}s both"></div></div>`).join('')}</div>
      <div style="position:absolute;left:130px;right:130px;bottom:38px;display:flex;justify-content:space-between;${S};font-weight:700;font-size:21px;color:var(--mute)"><span>@liberofilho</span><span>${esc(a.rodape || 'Preparação para o ENAC')}</span></div>`;
    const html = `<!doctype html><html><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet"><style>${css(tema)}</style></head><body><div class="v">
      <div style="position:absolute;inset:0;background:${tema.bg}"></div><div style="position:absolute;inset:0;background-image:url(file://${root}/../cartorio-com-libero/assets/grao.png);background-size:640px;opacity:${tema.grao};mix-blend-mode:overlay"></div>
      ${partes.join('')}${fixo}</div></body></html>`;
    const htmlPath = path.join(tmp, 'aula.html'); fs.writeFileSync(htmlPath, html);
    const page = await browser.newPage({ viewport: { width: W, height: H } });
    await page.goto('file://' + htmlPath); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(600);
    // amplia o conteúdo de cada cena até onde couber (texto maior = mais legível no celular)
    await page.evaluate(fimMs => { document.getAnimations().forEach(x => { x.pause(); x.currentTime = fimMs; });
      for (const ar of document.querySelectorAll('.area')) { const cs = getComputedStyle(ar), base = ['left', 'right', 'top', 'bottom'].map(k => parseFloat(cs[k]));
        const cabe = z => { ar.style.zoom = z; ['left', 'right', 'top', 'bottom'].forEach((k, i) => ar.style[k] = base[i] / z + 'px');
          const R = ar.getBoundingClientRect(); let ok = true;
          for (const e of ar.querySelectorAll('*')) { if (e.closest('[data-dec]') || e.closest('svg')) continue; const b = e.getBoundingClientRect(); if (!b.width) continue; if (b.top < R.top - 2 || b.bottom > R.bottom + 2 || b.right > R.right + 2) { ok = false; break; } }
          return ok; };
        for (const z of [1.3, 1.25, 1.2, 1.15, 1.1, 1.05, 1]) if (cabe(z)) break; } }, total * 1000 + 5000);
    const foto = async (seg, arqv) => { await page.evaluate(ms => document.getAnimations().forEach(x => { x.pause(); x.currentTime = ms; }), seg * 1000); await page.screenshot({ path: arqv, type: 'jpeg', quality: 93 }); };
    if (process.env.PREVIEW) { // um quadro no fim de cada cena (tudo já na tela) e um no meio
      const pv = path.join(out, 'previa', a.id); fs.rmSync(pv, { recursive: true, force: true }); fs.mkdirSync(pv, { recursive: true });
      for (let i = 0; i < inicios.length; i++) { const f = (inicios[i + 1] ?? total) - .45; await foto(f, path.join(pv, `${String(i + 1).padStart(2, '0')}.jpg`));
        const fora = await page.evaluate(([k, W, H]) => { const c = document.querySelectorAll('.cena')[k]; let pior = 0, quem = '';
          for (const e of c.querySelectorAll('*')) { if (e.closest('[data-dec]') || e.closest('svg')) continue; const b = e.getBoundingClientRect(); if (!b.width) continue; const d = Math.max(b.bottom - (H - 84), b.right - (W - 118), 150 - b.top); if (d > pior) { pior = d; quem = (e.textContent || '').trim().slice(0, 40); } }
          return pior > 2 ? `${Math.round(pior)}px fora: ${quem}` : ''; }, [i, W, H]);
        if (fora) console.log(`  ! ${a.id} cena ${i + 1} (${a.cenas[i].tipo}): ${fora}`); }
      const cols = 4, lin = Math.ceil(inicios.length / cols);
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-pattern_type', 'glob', '-i', path.join(pv, '*.jpg'), '-vf', `scale=960:-1,tile=${cols}x${lin}`, '-frames:v', '1', '-q:v', '3', path.join(out, 'previa', a.id + '.jpg')]);
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

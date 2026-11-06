// Palestras do @liberofilho em slides 16:9 (1920×1080), na identidade pessoal (moldes/libero-comum):
// azul, off-white e navy, Big Shoulders + Schibsted Grotesk, granulado e anéis vermelhos. Visual didático e
// gamificado sem perder a seriedade: HUD com a fase e a barra de progresso, divisores de fase, caixas de
// "Missão", "Desafio relâmpago" (questão + resposta) e "Power-up" (prompts).
// Uso: node render.mjs [id]  → saida/<id>/<id>.pdf (vetorial) e saida/<id>/png/NN.png
// Conteúdo: palestras/<id>.json. Fotos e memes ficam em fotos/ e memes/ (fora do git).
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { COR, FONTES, TITULO, TEXTO, esc, rico, textura } from '../libero-comum/identidade.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const W = 1920, H = 1080;
const arq = rel => 'file://' + path.join(root, rel);
const r = (s, caixa = COR.azul, cor = '#fff') => rico(s, caixa, cor);
const AMARELO = '#FFD23F';

const FUNDOS = {
  azul: `linear-gradient(160deg,${COR.azul} 0%,${COR.azulFundo} 100%)`,
  off: COR.off,
  navy: `radial-gradient(120% 90% at 100% 0%,#1d3566 0%,${COR.navyFundo} 60%)`,
  branco: '#FFFFFF',
};
const escuro = f => f === 'azul' || f === 'navy';

function hud(deck, s, fundo) {
  const dark = escuro(fundo), cor = dark ? '#fff' : COR.navy;
  const fases = deck.fases;
  const atual = s._fase ?? 0;
  const seg = fases.map((f, i) => `<div style="flex:1;height:10px;border-radius:5px;background:${i < atual ? (dark ? COR.azulClaro : COR.azul) : i === atual ? COR.vermelho : (dark ? 'rgba(255,255,255,.18)' : '#D5DAE4')}"></div>`).join('');
  return `<div style="position:absolute;left:96px;right:96px;top:52px;display:flex;align-items:center;gap:28px;z-index:12">
  ${atual ? `<span style="${TEXTO};font-size:22px;font-weight:800;letter-spacing:.18em;color:${dark ? COR.navy : '#fff'};background:${dark ? '#fff' : COR.navy};padding:8px 16px;border-radius:8px;white-space:nowrap">FASE ${String(atual).padStart(2, '0')} · ${esc(fases[atual - 1]).toUpperCase()}</span>` : ''}
  <div style="flex:1;display:flex;gap:8px">${seg}</div>
  <span style="${TEXTO};font-size:20px;font-weight:700;letter-spacing:.14em;color:${cor};opacity:.75;white-space:nowrap">${esc(deck.selo)}</span></div>
  <div style="position:absolute;left:96px;bottom:48px;${TEXTO};font-size:24px;font-weight:600;letter-spacing:.08em;color:${cor};opacity:.8;z-index:12">@liberofilho</div>`;
}

const titulo = (t, dark, px = 104) => `<div style="${TITULO};font-size:${px}px;line-height:1.02;color:${dark ? '#fff' : COR.azul}">${[].concat(t).map(l => r(l, dark ? COR.navyFundo : COR.azul)).join('<br>')}</div>`;
const missao = (m, dark) => m ? `<div style="display:flex;align-items:center;gap:20px;background:${dark ? 'rgba(255,255,255,.1)' : '#fff'};border:2px solid ${COR.vermelho};border-radius:18px;padding:18px 26px;${dark ? '' : 'box-shadow:0 10px 24px rgba(20,33,58,.08)'}">
  <span style="flex:none;${TEXTO};font-size:20px;font-weight:800;letter-spacing:.16em;color:#fff;background:${COR.vermelho};padding:6px 12px;border-radius:8px">🎯 MISSÃO</span>
  <span style="${TEXTO};font-size:30px;font-weight:600;line-height:1.3;color:${dark ? '#fff' : COR.navy}">${r(m)}</span></div>` : '';
const fonte = (f, dark) => f ? `<div style="position:absolute;right:96px;bottom:50px;max-width:1100px;text-align:right;${TEXTO};font-size:19px;color:${dark ? '#fff' : COR.navy};opacity:.6;z-index:12">${esc(f)}</div>` : '';
let ZOOM = 1.3;
const corpo = (inner, extra = '') => `<div style="position:absolute;left:96px;right:96px;top:110px;bottom:100px;display:flex;flex-direction:column;justify-content:center"><div style="zoom:${ZOOM};width:${Math.round(1728 / ZOOM)}px;display:flex;flex-direction:column;gap:40px;${extra}">${inner}</div></div>`;

const L = {};

L.capa = (s, deck) => ({
  bg: FUNDOS.azul, escuro: true, html: `
  <div style="position:absolute;right:-180px;top:-200px;width:760px;height:760px;border:90px solid ${COR.vermelho};border-radius:50%"></div>
  ${s.foto ? `<img src="${arq(s.foto)}" style="position:absolute;right:120px;bottom:0;height:980px;z-index:3;filter:drop-shadow(0 30px 50px rgba(0,0,0,.35))">` : ''}
  ${s.logo ? `<div style="position:absolute;left:96px;top:80px;background:#fff;border-radius:14px;padding:14px 22px"><img src="${arq(s.logo)}" style="height:90px;display:block"></div>` : ''}
  <div style="position:absolute;left:96px;top:220px;width:1050px;display:flex;flex-direction:column;gap:26px;z-index:5">
    <span style="align-self:flex-start;${TEXTO};font-size:26px;font-weight:800;letter-spacing:.2em;color:${COR.navy};background:#fff;padding:10px 18px;border-radius:8px">${esc(s.pre)}</span>
    <div style="${TITULO};font-size:${s.ts ?? 150}px;line-height:1;color:#fff">${[].concat(s.titulo).map(l => r(l, COR.navyFundo)).join('<br>')}</div>
    <div style="${TEXTO};font-size:36px;font-weight:600;line-height:1.3;color:#fff;opacity:.9">${r(s.sub)}</div>
  </div>
  <div style="position:absolute;left:96px;bottom:70px;display:flex;align-items:center;gap:18px;z-index:5"><span style="${TEXTO};font-size:24px;font-weight:800;letter-spacing:.2em;color:${COR.navy};background:${AMARELO};padding:10px 18px;border-radius:8px">▶ PRESS START</span><span style="${TEXTO};font-size:26px;font-weight:600;color:#fff;letter-spacing:.06em">${esc(s.autor)}</span>${(s.chips ?? []).map(c => `<span style="${TEXTO};font-size:24px;font-weight:700;color:#fff;border:2px solid rgba(255,255,255,.5);border-radius:40px;padding:8px 20px">${esc(c)}</span>`).join('')}</div>` });

L.mapa = (s, deck) => {
  const n = deck.fases.length;
  const nos = deck.fases.map((f, i) => {
    const x = 250 + i * (1420 / (n - 1)), y = i % 2 ? 640 : 480;
    return `<div style="position:absolute;left:${x - 90}px;top:${y - 90}px;width:180px;display:flex;flex-direction:column;align-items:center;gap:16px;z-index:3">
      <div style="width:180px;height:180px;border-radius:50%;background:${i === n - 1 ? COR.vermelho : '#fff'};border:8px solid ${COR.navy};display:flex;align-items:center;justify-content:center;${TITULO};font-size:90px;color:${i === n - 1 ? '#fff' : COR.azul}">${i + 1}</div>
      <div style="${TEXTO};font-size:34px;font-weight:800;line-height:1.15;text-align:center;color:#fff;width:300px">${esc(f)}</div></div>`;
  }).join('');
  const pts = deck.fases.map((f, i) => `${250 + i * (1420 / (n - 1))},${i % 2 ? 640 : 480}`).join(' ');
  return { bg: FUNDOS.navy, escuro: true, html: `${hud(deck, s, 'navy')}
  <div style="position:absolute;left:96px;top:150px">${titulo(s.titulo, true, 96)}<div style="${TEXTO};font-size:32px;color:#fff;opacity:.85;margin-top:16px">${r(s.texto ?? '')}</div></div>
  <svg style="position:absolute;left:0;top:0" width="${W}" height="${H}"><polyline points="${pts}" fill="none" stroke="${COR.azulClaro}" stroke-width="8" stroke-dasharray="4 26" stroke-linecap="round"/></svg>
  <div style="position:absolute;left:0;top:200px;width:${W}px;height:700px">${nos}</div>` };
};

L.fase = (s, deck) => ({
  bg: FUNDOS.azul, escuro: true, html: `${hud(deck, s, 'azul')}
  <div style="position:absolute;left:-200px;bottom:-260px;width:700px;height:700px;border:80px solid ${COR.vermelho};border-radius:50%"></div>
  <div style="position:absolute;right:80px;top:120px;${TITULO};font-size:620px;line-height:.8;color:transparent;-webkit-text-stroke:4px rgba(255,255,255,.25)">${String(s._fase).padStart(2, '0')}</div>
  <div style="position:absolute;left:96px;top:300px;width:1180px;display:flex;flex-direction:column;gap:30px;z-index:3">
    <span style="align-self:flex-start;${TEXTO};font-size:26px;font-weight:800;letter-spacing:.24em;color:${COR.navy};background:#fff;padding:10px 18px;border-radius:8px">FASE ${String(s._fase).padStart(2, '0')} DE ${deck.fases.length}</span>
    <div style="${TITULO};font-size:170px;line-height:.98;color:#fff">${[].concat(s.titulo).map(l => r(l, COR.navyFundo)).join('<br>')}</div>
    <div style="${TEXTO};font-size:36px;font-weight:600;line-height:1.35;color:#fff;opacity:.92">${r(s.texto ?? '')}</div>
    ${s.xp ? `<div style="display:flex;gap:14px">${s.xp.map(x => `<span style="${TEXTO};font-size:24px;font-weight:800;color:${COR.navy};background:${AMARELO};padding:8px 16px;border-radius:8px">+ ${esc(x)}</span>`).join('')}</div>` : ''}
  </div>` });

L.frase = (s, deck) => {
  const f = s.fundo ?? 'off', dk = escuro(f);
  return { bg: FUNDOS[f], escuro: dk, html: `${hud(deck, s, f)}${corpo(`
    ${s.kicker ? `<span style="${TEXTO};font-size:26px;font-weight:800;letter-spacing:.2em;color:${dk ? COR.azulClaro : COR.vermelho}">${esc(s.kicker).toUpperCase()}</span>` : ''}
    ${titulo(s.titulo, dk, s.ts ?? 120)}
    ${s.texto ? `<div style="${TEXTO};font-size:38px;font-weight:500;line-height:1.4;color:${dk ? '#fff' : COR.navy};max-width:1450px">${r(s.texto)}</div>` : ''}
    ${missao(s.missao, dk)}`, 'padding-right:120px')}${fonte(s.fonte, dk)}` };
};

L.cards = (s, deck) => {
  const f = s.fundo ?? 'off', dk = escuro(f);
  const n = s.itens.length, cols = s.cols ?? (n <= 3 ? n : n === 4 ? 4 : 3);
  const card = (it, i) => `<div style="background:${dk ? 'rgba(255,255,255,.08)' : '#fff'};border:2px solid ${dk ? 'rgba(255,255,255,.18)' : '#DCE1EA'};border-radius:24px;padding:30px 30px 32px;display:flex;flex-direction:column;gap:14px;${dk ? '' : 'box-shadow:0 14px 30px rgba(20,33,58,.07)'}">
    <div style="display:flex;align-items:center;gap:14px"><span style="${TITULO};font-size:${it.icone ? 60 : 64}px;line-height:1;color:${dk ? COR.azulClaro : COR.azul}">${it.icone ? it.icone : String(i + 1).padStart(2, '0')}</span>${it.tag ? `<span style="margin-left:auto;${TEXTO};font-size:18px;font-weight:800;letter-spacing:.14em;color:#fff;background:${it.tagCor ?? COR.navy};padding:5px 10px;border-radius:6px">${esc(it.tag)}</span>` : ''}</div>
    <div style="${TEXTO};font-size:${s.tt ?? 34}px;font-weight:800;line-height:1.15;color:${dk ? '#fff' : COR.navy}">${r(it.t)}</div>
    ${it.d ? `<div style="${TEXTO};font-size:${s.td ?? 26}px;font-weight:500;line-height:1.4;color:${dk ? '#fff' : COR.navy};opacity:.82">${r(it.d)}</div>` : ''}</div>`;
  return { bg: FUNDOS[f], escuro: dk, html: `${hud(deck, s, f)}${corpo(`
    ${titulo(s.titulo, dk, s.ts ?? 96)}
    ${s.texto ? `<div style="${TEXTO};font-size:32px;line-height:1.35;color:${dk ? '#fff' : COR.navy};opacity:.85;margin-top:-14px">${r(s.texto)}</div>` : ''}
    <div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:24px">${s.itens.map(card).join('')}</div>
    ${missao(s.missao, dk)}`)}${fonte(s.fonte, dk)}` };
};

L.fluxo = (s, deck) => {
  const f = s.fundo ?? 'navy', dk = escuro(f);
  const passos = s.passos.map((p, i) => `<div style="flex:1;display:flex;flex-direction:column;gap:14px;align-items:flex-start">
    <div style="width:100%;background:${i === s.passos.length - 1 ? COR.vermelho : dk ? '#fff' : COR.azul};color:${i === s.passos.length - 1 ? '#fff' : dk ? COR.navy : '#fff'};border-radius:18px;padding:22px 20px;${TITULO};font-size:${s.tp ?? 58}px;line-height:.95;text-align:center">${esc(p.t)}</div>
    <div style="${TEXTO};font-size:25px;line-height:1.35;color:${dk ? '#fff' : COR.navy};opacity:.85">${r(p.d ?? '')}</div></div>`).join(`<div style="flex:none;${TITULO};font-size:64px;color:${dk ? COR.azulClaro : COR.azul};padding-top:14px">→</div>`);
  return { bg: FUNDOS[f], escuro: dk, html: `${hud(deck, s, f)}${corpo(`${titulo(s.titulo, dk, s.ts ?? 100)}
    ${s.texto ? `<div style="${TEXTO};font-size:32px;line-height:1.35;color:${dk ? '#fff' : COR.navy};opacity:.85;margin-top:-14px">${r(s.texto)}</div>` : ''}
    <div style="display:flex;gap:18px;align-items:flex-start">${passos}</div>${missao(s.missao, dk)}`)}${fonte(s.fonte, dk)}` };
};

L.numeros = (s, deck) => {
  const f = s.fundo ?? 'azul', dk = escuro(f);
  return { bg: FUNDOS[f], escuro: dk, html: `${hud(deck, s, f)}${corpo(`${titulo(s.titulo, dk, s.ts ?? 100)}
    <div style="display:flex;align-items:stretch;gap:22px">${s.itens.map(it => it.op ? `<div style="display:flex;align-items:center;${TITULO};font-size:110px;color:${dk ? COR.azulClaro : COR.azul}">${esc(it.op)}</div>` : `<div style="flex:1;background:${it.destaque ? COR.vermelho : dk ? '#fff' : COR.azul};border-radius:26px;padding:34px 30px;display:flex;flex-direction:column;gap:10px">
      <div style="${TITULO};font-size:${it.px ?? 150}px;line-height:.85;color:${it.destaque ? '#fff' : dk ? COR.azul : '#fff'}">${esc(it.n)}</div>
      <div style="${TEXTO};font-size:27px;font-weight:700;line-height:1.25;color:${it.destaque ? '#fff' : dk ? COR.navy : '#fff'}">${r(it.rot)}</div></div>`).join('')}</div>
    ${s.texto ? `<div style="${TEXTO};font-size:32px;line-height:1.35;color:${dk ? '#fff' : COR.navy}">${r(s.texto)}</div>` : ''}${missao(s.missao, dk)}`)}${fonte(s.fonte, dk)}` };
};

L.barras = (s, deck) => {
  const f = s.fundo ?? 'off', dk = escuro(f), max = s.max ?? 100;
  const grupo = g => `<div style="flex:1;display:flex;flex-direction:column;gap:16px">
    <div style="${TEXTO};font-size:28px;font-weight:800;color:${dk ? '#fff' : COR.navy}">${esc(g.nome)}</div>
    ${g.barras.map(b => `<div style="display:flex;align-items:center;gap:16px"><span style="width:150px;${TEXTO};font-size:24px;font-weight:700;color:${dk ? '#fff' : COR.navy}">${esc(b.r)}</span>
      <div style="flex:1;height:48px;background:${dk ? 'rgba(255,255,255,.12)' : '#E1E5EE'};border-radius:10px;position:relative;overflow:hidden"><div style="position:absolute;left:0;top:0;bottom:0;width:${b.v / max * 100}%;background:${b.destaque ? COR.vermelho : COR.azul};border-radius:10px"></div></div>
      <span style="width:90px;text-align:right;${TITULO};font-size:44px;color:${b.destaque ? COR.vermelho : dk ? '#fff' : COR.azul}">${esc(String(b.v).replace('.', ','))}</span></div>`).join('')}</div>`;
  return { bg: FUNDOS[f], escuro: dk, html: `${hud(deck, s, f)}${corpo(`${titulo(s.titulo, dk, s.ts ?? 96)}
    <div style="display:flex;gap:80px">${s.grupos.map(grupo).join('')}</div>
    ${s.texto ? `<div style="${TEXTO};font-size:30px;line-height:1.35;color:${dk ? '#fff' : COR.navy}">${r(s.texto)}</div>` : ''}${missao(s.missao, dk)}`)}${fonte(s.fonte, dk)}` };
};

L.tempo = (s, deck) => {
  const f = s.fundo ?? 'navy', dk = escuro(f), tot = s.blocos.reduce((a, b) => a + b.min, 0);
  const cores = [COR.azulClaro, COR.azul, '#3A6BE8', COR.vermelho, AMARELO, '#C9CFDB'];
  return { bg: FUNDOS[f], escuro: dk, html: `${hud(deck, s, f)}${corpo(`${titulo(s.titulo, dk, s.ts ?? 100)}
    <div style="display:flex;height:150px;border-radius:20px;overflow:hidden;border:3px solid ${dk ? '#fff' : COR.navy}">${s.blocos.map((b, i) => `<div style="width:${b.min / tot * 100}%;background:${cores[i % 6]};display:flex;flex-direction:column;justify-content:center;align-items:center;border-right:3px solid ${dk ? COR.navyFundo : '#fff'}"><span style="${TITULO};font-size:${b.min >= 25 ? 56 : 34}px;color:${i === 3 ? '#fff' : COR.navy}">${b.min}'</span></div>`).join('')}</div>
    <div style="display:flex">${s.blocos.map(b => `<div style="width:${b.min / tot * 100}%;padding-right:10px;${TEXTO};font-size:${b.min >= 25 ? 24 : 18}px;font-weight:700;line-height:1.25;color:${dk ? '#fff' : COR.navy}">${esc(b.t)}</div>`).join('')}</div>
    ${s.texto ? `<div style="${TEXTO};font-size:30px;line-height:1.35;color:${dk ? '#fff' : COR.navy};opacity:.9">${r(s.texto)}</div>` : ''}${missao(s.missao, dk)}`)}${fonte(s.fonte, dk)}` };
};

L.quiz = (s, deck) => {
  const f = s.fundo ?? 'off', dk = escuro(f), resp = s.resposta;
  const alt = (a, i) => { const L_ = 'ABCDE'[i], ok = resp && L_ === s.gabarito;
    return `<div style="display:flex;align-items:center;gap:20px;background:${ok ? COR.azul : dk ? 'rgba(255,255,255,.08)' : '#fff'};border:2px solid ${ok ? COR.azul : dk ? 'rgba(255,255,255,.2)' : '#DCE1EA'};border-radius:16px;padding:16px 22px;opacity:${resp && !ok ? .45 : 1}">
      <span style="flex:none;width:54px;height:54px;border-radius:12px;background:${ok ? '#fff' : COR.navy};color:${ok ? COR.azul : '#fff'};display:flex;align-items:center;justify-content:center;${TITULO};font-size:38px">${L_}</span>
      <span style="${TEXTO};font-size:28px;font-weight:600;line-height:1.25;color:${ok ? '#fff' : dk ? '#fff' : COR.navy}">${r(a)}</span>${ok ? `<span style="margin-left:auto;${TEXTO};font-size:24px;font-weight:800;color:${AMARELO}">✓ +10 XP</span>` : ''}</div>`; };
  return { bg: FUNDOS[f], escuro: dk, html: `${hud(deck, s, f)}${corpo(`
    <div style="display:flex;align-items:center;gap:18px"><span style="${TEXTO};font-size:24px;font-weight:800;letter-spacing:.18em;color:${COR.navy};background:${AMARELO};padding:8px 16px;border-radius:8px">⚡ ${resp ? 'RESPOSTA' : 'DESAFIO RELÂMPAGO'}</span><span style="${TEXTO};font-size:24px;font-weight:700;color:${dk ? '#fff' : COR.navy};opacity:.7">${esc(s.tema)} · questão autoral de treino</span></div>
    <div style="${TEXTO};font-size:38px;font-weight:700;line-height:1.3;color:${dk ? '#fff' : COR.navy}">${r(s.pergunta)}</div>
    <div style="display:flex;flex-direction:column;gap:12px">${s.alternativas.map(alt).join('')}</div>
    ${resp ? `<div style="${TEXTO};font-size:30px;font-weight:600;line-height:1.35;color:${dk ? '#fff' : COR.navy};border-left:8px solid ${COR.vermelho};padding-left:22px">${r(s.justificativa)}</div>` : `<div style="${TEXTO};font-size:28px;font-weight:700;color:${COR.vermelho}">⏱ 60 segundos. Vote antes de virar o slide.</div>`}`, 'gap:26px')}` };
};

L.meme = (s, deck) => {
  const f = s.fundo ?? 'azul', dk = escuro(f);
  return { bg: FUNDOS[f], escuro: dk, html: `${hud(deck, s, f)}
  <div style="position:absolute;right:120px;top:190px;width:640px;background:#fff;padding:22px 22px 70px;transform:rotate(${s.rot ?? 3}deg);box-shadow:0 30px 60px rgba(0,0,0,.3);z-index:3">
    <img src="${arq(s.meme)}" style="display:block;width:100%;height:${s.memeAlt ?? 600}px;object-fit:cover;object-position:${s.memePos ?? 'center'}">
    <div style="position:absolute;left:0;right:0;bottom:16px;text-align:center;${TEXTO};font-size:28px;font-weight:700;color:${COR.navy}">${esc(s.legenda ?? '')}</div></div>
  <div style="position:absolute;left:96px;top:120px;bottom:110px;width:980px;display:flex;flex-direction:column;justify-content:center;gap:34px">
    ${titulo(s.titulo, dk, s.ts ?? 140)}
    ${s.texto ? `<div style="${TEXTO};font-size:40px;font-weight:500;line-height:1.4;color:${dk ? '#fff' : COR.navy}">${r(s.texto)}</div>` : ''}
    ${s.itens ? `<div style="display:flex;flex-direction:column;gap:16px">${s.itens.map((it, i) => `<div style="display:flex;gap:18px;align-items:baseline"><span style="${TITULO};font-size:56px;color:${dk ? AMARELO : COR.vermelho}">${i + 1}</span><span style="${TEXTO};font-size:40px;font-weight:600;line-height:1.3;color:${dk ? '#fff' : COR.navy}">${r(it)}</span></div>`).join('')}</div>` : ''}
    ${missao(s.missao, dk)}</div>` };
};

L.compara = (s, deck) => {
  const f = s.fundo ?? 'off', dk = escuro(f);
  const col = (c, i) => `<div style="flex:1;background:${i ? COR.azul : dk ? 'rgba(255,255,255,.08)' : '#fff'};border:2px solid ${i ? COR.azul : '#DCE1EA'};border-radius:26px;padding:36px;display:flex;flex-direction:column;gap:18px">
    <span style="align-self:flex-start;${TEXTO};font-size:22px;font-weight:800;letter-spacing:.16em;color:#fff;background:${i ? COR.navy : COR.vermelho};padding:6px 14px;border-radius:8px">${esc(c.rot)}</span>
    <div style="${TITULO};font-size:${s.tc ?? 62}px;line-height:.95;color:${i ? '#fff' : dk ? '#fff' : COR.navy}">${r(c.t)}</div>
    ${c.d ? `<div style="${TEXTO};font-size:28px;line-height:1.4;color:${i ? '#fff' : dk ? '#fff' : COR.navy};opacity:.9">${r(c.d)}</div>` : ''}</div>`;
  return { bg: FUNDOS[f], escuro: dk, html: `${hud(deck, s, f)}${corpo(`${titulo(s.titulo, dk, s.ts ?? 100)}
    <div style="display:flex;gap:30px;align-items:stretch">${s.colunas.map(col).join(`<div style="align-self:center;${TITULO};font-size:80px;color:${dk ? '#fff' : COR.azul}">→</div>`)}</div>${missao(s.missao, dk)}`)}${fonte(s.fonte, dk)}` };
};

L.grade = (s, deck) => {
  const f = s.fundo ?? 'off', dk = escuro(f);
  return { bg: FUNDOS[f], escuro: dk, html: `${hud(deck, s, f)}${corpo(`${titulo(s.titulo, dk, s.ts ?? 90)}
    <div style="display:grid;grid-template-columns:repeat(${s.cols ?? 5},1fr);gap:12px">${s.itens.map((t, i) => `<div style="display:flex;gap:12px;align-items:center;background:${dk ? 'rgba(255,255,255,.08)' : '#fff'};border:2px solid ${dk ? 'rgba(255,255,255,.16)' : '#DCE1EA'};border-radius:14px;padding:14px 16px;min-height:92px">
      <span style="${TITULO};font-size:34px;color:${dk ? COR.azulClaro : COR.azul};min-width:40px">${String(i + 1).padStart(2, '0')}</span><span style="${TEXTO};font-size:22px;font-weight:700;line-height:1.2;color:${dk ? '#fff' : COR.navy}">${esc(t)}</span></div>`).join('')}</div>
    ${s.texto ? `<div style="${TEXTO};font-size:28px;line-height:1.35;color:${dk ? '#fff' : COR.navy}">${r(s.texto)}</div>` : ''}${missao(s.missao, dk)}`, 'gap:30px')}${fonte(s.fonte, dk)}` };
};

L.prompt = (s, deck) => {
  const f = s.fundo ?? 'navy', dk = escuro(f);
  return { bg: FUNDOS[f], escuro: dk, html: `${hud(deck, s, f)}${corpo(`
    <div style="display:flex;align-items:center;gap:18px"><span style="${TEXTO};font-size:24px;font-weight:800;letter-spacing:.18em;color:${COR.navy};background:${AMARELO};padding:8px 16px;border-radius:8px">⭐ POWER-UP</span><span style="${TEXTO};font-size:24px;font-weight:700;color:${dk ? '#fff' : COR.navy};opacity:.75">${esc(s.para ?? '')}</span></div>
    ${titulo(s.titulo, dk, s.ts ?? 96)}
    <div style="background:${dk ? '#0E1522' : '#fff'};border:2px solid ${dk ? 'rgba(143,176,255,.4)' : '#DCE1EA'};border-radius:24px;overflow:hidden">
      <div style="display:flex;justify-content:space-between;padding:16px 28px;background:${dk ? 'rgba(143,176,255,.12)' : COR.off};${TEXTO};font-size:20px;font-weight:800;letter-spacing:.18em;color:${dk ? COR.azulClaro : COR.azul}"><span>PROMPT</span><span>COPIE E COLE ⧉</span></div>
      <div style="padding:28px 32px;${TEXTO};font-size:${s.tp ?? 30}px;font-weight:500;line-height:1.5;color:${dk ? '#E4E8F0' : COR.navy}">${esc(s.prompt).replace(/\[(.+?)\]/g, `<b style="color:${AMARELO}">[$1]</b>`)}</div></div>
    ${missao(s.missao, dk)}`, 'gap:28px')}` };
};

L.checklist = (s, deck) => {
  const f = s.fundo ?? 'off', dk = escuro(f);
  return { bg: FUNDOS[f], escuro: dk, html: `${hud(deck, s, f)}
  ${s.meme ? `<div style="position:absolute;right:120px;top:200px;width:520px;background:#fff;padding:18px 18px 60px;transform:rotate(-3deg);box-shadow:0 30px 60px rgba(0,0,0,.25);z-index:3"><img src="${arq(s.meme)}" style="display:block;width:100%;height:520px;object-fit:cover;object-position:${s.memePos ?? 'center'}"><div style="position:absolute;left:0;right:0;bottom:14px;text-align:center;${TEXTO};font-size:24px;font-weight:700;color:${COR.navy}">${esc(s.legenda ?? '')}</div></div>` : ''}
  ${corpo(`${titulo(s.titulo, dk, s.ts ?? 100)}
    <div style="display:grid;grid-template-columns:repeat(${s.cols ?? 1},1fr);gap:14px 30px">${s.itens.map(t => `<div style="display:flex;gap:18px;align-items:center"><span style="flex:none;width:46px;height:46px;border-radius:10px;border:4px solid ${dk ? '#fff' : COR.azul};display:flex;align-items:center;justify-content:center;${TEXTO};font-size:30px;font-weight:800;color:${dk ? AMARELO : COR.vermelho}">✓</span><span style="${TEXTO};font-size:${s.tt ?? 32}px;font-weight:600;line-height:1.3;color:${dk ? '#fff' : COR.navy}">${r(t)}</span></div>`).join('')}</div>
    ${missao(s.missao, dk)}`, s.meme ? 'padding-right:560px' : '')}${fonte(s.fonte, dk)}` };
};

L.fim = (s, deck) => ({
  bg: FUNDOS.azul, escuro: true, html: `
  <div style="position:absolute;left:-220px;top:-220px;width:720px;height:720px;border:90px solid ${COR.vermelho};border-radius:50%"></div>
  ${s.foto ? `<img src="${arq(s.foto)}" style="position:absolute;right:140px;bottom:0;height:900px;z-index:3;filter:drop-shadow(0 30px 50px rgba(0,0,0,.35))">` : ''}
  <div style="position:absolute;left:150px;top:150px;width:1050px;display:flex;flex-direction:column;gap:26px;z-index:5">
    <span style="align-self:flex-start;${TEXTO};font-size:26px;font-weight:800;letter-spacing:.2em;color:${COR.navy};background:${AMARELO};padding:10px 18px;border-radius:8px">🏆 FASE FINAL CONCLUÍDA</span>
    <div style="${TITULO};font-size:${s.ts ?? 140}px;line-height:1;color:#fff">${[].concat(s.titulo).map(l => r(l, COR.navyFundo)).join('<br>')}</div>
    <div style="${TEXTO};font-size:36px;font-weight:600;line-height:1.35;color:#fff;opacity:.92">${r(s.texto ?? '')}</div>
    <div style="${TEXTO};font-size:34px;font-weight:800;color:#fff;margin-top:20px">@liberofilho</div></div>` });

async function main() {
  const filtro = process.argv[2];
  const ids = fs.readdirSync(path.join(root, 'palestras')).filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''));
  const launch = {};
  if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
  if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
  const browser = await chromium.launch(launch);
  for (const id of ids) {
    if (filtro && id !== filtro) continue;
    const deck = JSON.parse(fs.readFileSync(path.join(root, 'palestras', id + '.json'), 'utf8'));
    let fase = 0;
    const slides = deck.slides.map(s => { ZOOM = s.zoom ?? ({ grade: 1.08, quiz: 1.1, cards: 1.2, frase: 1.12, tempo: 1.12, fluxo: 1.1, compara: 1.12, prompt: 1.2, checklist: 1.25, barras: 1.22, numeros: 1.3 }[s.tipo] ?? 1.25); if (s.tipo === 'fase') fase++; s._fase = s.tipo === 'capa' || s.tipo === 'mapa' ? 0 : fase; return L[s.tipo](s, deck); });
    const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet">
<style>@page{size:${W}px ${H}px;margin:0}*{box-sizing:border-box}body{margin:0;${TEXTO};-webkit-font-smoothing:antialiased}section{position:relative;width:${W}px;height:${H}px;overflow:hidden;page-break-after:always}</style></head><body>
${slides.map((s, i) => `<section id="s${i + 1}" style="background:${s.bg}">${s.html}${textura(s.escuro)}</section>`).join('\n')}</body></html>`;
    const out = path.join(root, 'saida', id); fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(path.join(out, 'png'), { recursive: true });
    fs.mkdirSync(path.join(root, 'build'), { recursive: true });
    const hf = path.join(root, 'build', id + '.html'); fs.writeFileSync(hf, html);
    const page = await browser.newPage({ viewport: { width: W, height: H } });
    await page.goto('file://' + hf);
    await page.evaluate(() => Promise.all([document.fonts.ready, ...[...document.images].map(i => i.decode().catch(() => {}))]));
    await page.waitForTimeout(500);
    // avisa conteúdo que passa da página
    const avisos = await page.evaluate(() => [...document.querySelectorAll('section')].flatMap((sec, i) => [...sec.querySelectorAll('div')].filter(d => { const r = d.getBoundingClientRect(), s = sec.getBoundingClientRect(); return r.width > 0 && (r.bottom > s.bottom + 1 || r.right > s.right + 1) && getComputedStyle(d).position !== 'absolute' ; }).slice(0, 1).map(() => `slide ${i + 1}: conteúdo passa da página`)));
    const secs = await page.$$('section');
    for (let i = 0; i < secs.length; i++) await secs[i].screenshot({ path: path.join(out, 'png', `${String(i + 1).padStart(2, '0')}.png`) });
    await page.pdf({ path: path.join(out, id + '.pdf'), width: W + 'px', height: H + 'px', printBackground: true });
    await page.close();
    console.log(avisos.length ? '!' : '✓', id, `(${secs.length} slides)`); avisos.forEach(a => console.log('   ', a));
  }
  await browser.close();
}
main();

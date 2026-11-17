// Material "Revisão em Dicas" (Concurso com Líbero): PDF A4 com capa própria (diferente das capas de coleção),
// página de uso com o mapa da prova, as dicas em cartões (dica rápida, explicação e fundamento), painel de revisão
// para marcar as dicas e fontes oficiais. Conteúdo em privado/<id>.json (fora do git: material vendido).
// Uso: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node dicas.mjs <id>
//   lê privado/<id>-meta.json e privado/<id>-*.json -> saida/<id>/<id>.pdf e 1.png … N.png
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { COR, FONTES, esc, W, H } from './template.mjs';
const req = createRequire(import.meta.url);
let chromium; try { ({ chromium } = req('playwright')); } catch { ({ chromium } = createRequire('/opt/node-tools/node_modules/')('playwright')); }

const root = path.dirname(new URL(import.meta.url).pathname);
const id = process.argv[2] || 'enac';
const meta = JSON.parse(fs.readFileSync(path.join(root, 'privado', `${id}-meta.json`), 'utf8'));
const secoes = fs.readdirSync(path.join(root, 'privado')).filter(f => new RegExp(`^${id}-\\d+\\.json$`).test(f)).sort()
  .flatMap(f => JSON.parse(fs.readFileSync(path.join(root, 'privado', f), 'utf8')));
const total = secoes.reduce((a, s) => a + s.dicas.length, 0);

const T = "font-family:'Big Shoulders Display',sans-serif;font-weight:900;text-transform:uppercase;letter-spacing:-.005em";
const S = "font-family:'Sora',sans-serif", I = "font-family:'Inter',sans-serif", MO = "font-family:'JetBrains Mono',monospace";
const tres = n => String(n).padStart(3, '0');
const simbolo = px => `<svg width="${px}" height="${px}" viewBox="0 0 100 100" style="flex:none;display:block"><defs><linearGradient id="g${px}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#00B85A"/><stop offset=".55" stop-color="#009A8C"/><stop offset="1" stop-color="#14E6DA"/></linearGradient></defs><rect x="2" y="2" width="96" height="96" rx="28" fill="url(#g${px})"/><path d="M32 22 V70 H70" fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/><path d="M46 46 l9 9 l18 -20" fill="none" stroke="#B9FFF1" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const marca = (px, escuro) => `<div style="display:inline-flex;align-items:center;gap:${px * .3}px">${simbolo(px * 1.25)}<div style="display:flex;flex-direction:column;line-height:1"><span style="${S};font-weight:600;font-size:${px * .36}px;letter-spacing:.22em;text-transform:uppercase;color:${escuro ? COR.menta : COR.verde2}">Concurso com</span><span style="${S};font-weight:800;font-size:${px}px;letter-spacing:-.03em;color:${escuro ? '#fff' : COR.tinta}">Líbero</span></div></div>`;
const RUIDO = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;
const textura = (escuro) => `<div style="position:absolute;inset:0;pointer-events:none;background-image:${RUIDO};opacity:${escuro ? .3 : .14};mix-blend-mode:${escuro ? 'overlay' : 'multiply'};z-index:30"></div>`;
const caixa = (s = 14) => `<span style="flex:none;width:${s}px;height:${s}px;border-radius:4px;border:1.8px solid ${COR.petroleo};background:#fff;display:inline-block"></span>`;

// Um cartão de dica: número + caixa de marcar | dica rápida, explicação e fundamento.
const cartao = d => `<div class="bloco dica" style="display:grid;grid-template-columns:58px 1fr;gap:14px;background:#fff;border:1.5px solid ${COR.linha};border-radius:14px;padding:12px 16px 12px 12px;margin-bottom:8px;break-inside:avoid">
  <div style="display:flex;flex-direction:column;align-items:center;gap:7px;border-right:1.5px dashed ${COR.linha};padding-right:10px">
    <span style="${T};font-size:24px;line-height:1;color:${COR.verde2}">${tres(d.n)}</span>${caixa(15)}</div>
  <div><div style="${I};font-weight:700;font-size:13.6px;line-height:1.38;color:${COR.tinta}">${esc(d.d)}</div>
    ${d.e ? `<div style="${I};font-size:12px;line-height:1.5;color:#3E5550;margin-top:4px">${esc(d.e)}</div>` : ''}
    ${d.f ? `<div style="margin-top:7px"><span style="display:inline-block;${MO};font-weight:700;font-size:9.6px;letter-spacing:.02em;color:${COR.verde2};background:#E6F6EE;border-radius:5px;padding:3px 8px">⚖ ${esc(d.f)}</span></div>` : ''}</div></div>`;
const faixaMateria = s => `<div class="bloco materia" style="margin:4px 0 12px;border-radius:16px;background:${COR.petroleo};padding:16px 20px;display:flex;align-items:center;gap:16px;position:relative;overflow:hidden">
  <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(185,255,241,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(185,255,241,.07) 1px,transparent 1px);background-size:22px 22px"></div>
  <div style="position:relative;flex:1"><div style="${MO};font-weight:800;font-size:10px;letter-spacing:.2em;color:${COR.menta}">${esc(s.info)}</div><div style="${T};font-size:34px;line-height:.95;color:#fff;margin-top:4px">${esc(s.materia)}</div></div>
  <div style="position:relative;${T};font-size:52px;line-height:.8;color:transparent;-webkit-text-stroke:1.6px ${COR.menta}">${esc(s.faixa)}</div></div>`;
const faixaSub = s => `<div class="bloco sub" style="display:flex;align-items:baseline;gap:12px;margin:10px 0 8px;padding-bottom:6px;border-bottom:2px solid ${COR.verde}">
  <span style="${T};font-size:21px;color:${COR.tinta}">${esc(s.sub)}</span><span style="margin-left:auto;${I};font-size:10.5px;color:${COR.cinza};text-align:right">${esc(s.base)}</span></div>`;

// Blocos em ordem: faixa da matéria (quando muda), faixa da subseção e cartões. O navegador distribui nas páginas.
const blocos = [];
let ultima = '';
const infoMateria = {};
for (const s of secoes) {
  const k = s.materia;
  infoMateria[k] = infoMateria[k] || { dicas: 0, primeira: s.dicas[0].n };
  infoMateria[k].dicas += s.dicas.length;
  infoMateria[k].ultima = s.dicas.at(-1).n;
}
for (const s of secoes) {
  if (s.materia !== ultima) {
    const im = infoMateria[s.materia], mp = meta.mapa.find(m => m.materia === s.materia) || {};
    blocos.push(faixaMateria({ materia: s.materia, info: `${im.dicas} dicas${mp.questoes ? ` · ${mp.questoes} questões na prova` : ''}`, faixa: `${tres(im.primeira)}–${tres(im.ultima)}` }));
    ultima = s.materia;
  }
  blocos.push(faixaSub(s));
  s.dicas.forEach(d => blocos.push(cartao(d)));
}

const cab = () => `<div style="position:absolute;left:44px;right:44px;top:26px;display:flex;align-items:center;gap:12px;padding-bottom:11px;border-bottom:1.5px solid ${COR.linha}">
  ${simbolo(26)}<div style="line-height:1.15"><div style="${MO};font-weight:800;font-size:9.5px;letter-spacing:.2em;color:${COR.verde2}">${esc(meta.exame).toUpperCase()} · REVISÃO EM DICAS</div><div style="${I};font-weight:600;font-size:11px;color:${COR.cinza}">por ${esc(meta.autor)}</div></div>
  <span class="materia-atual" style="margin-left:auto;${T};font-size:16px;color:${COR.tinta}"></span></div>`;
const rod = () => `<div style="position:absolute;left:44px;right:44px;bottom:22px;display:flex;align-items:center;gap:14px">
  <span style="${MO};font-weight:700;font-size:9.5px;letter-spacing:.2em;color:${COR.cinza}">${esc(meta.arroba).toUpperCase()}</span>
  <div style="flex:1;height:4px;border-radius:2px;background:${COR.linha};overflow:hidden"><div class="prog" style="height:100%;background:linear-gradient(90deg,${COR.verde},${COR.ciano})"></div></div>
  <span class="num" style="${MO};font-weight:800;font-size:10.5px;color:${COR.tinta}"></span></div>`;

// ---------- capa própria ----------
const amostra = (n, d, rot, x, y, z) => `<div style="position:absolute;left:${x}px;top:${y}px;width:400px;transform:rotate(${rot}deg);z-index:${z};background:#fff;border-radius:16px;box-shadow:0 22px 44px rgba(0,0,0,.4);padding:16px 18px;display:grid;grid-template-columns:52px 1fr;gap:12px">
  <div style="display:flex;flex-direction:column;align-items:center;gap:6px;border-right:1.5px dashed ${COR.linha}"><span style="${T};font-size:24px;color:${COR.verde2}">${tres(n)}</span>${caixa(14)}</div>
  <div style="${I};font-weight:700;font-size:13px;line-height:1.38;color:${COR.tinta}">${esc(d)}</div></div>`;
const exemplos = secoes.flatMap(s => s.dicas);
const pick = n => exemplos.find(d => d.n === n) || exemplos[0];
const capa = `<section class="pagina" style="background:radial-gradient(80% 60% at 100% 0%,rgba(0,210,200,.28),transparent 70%),radial-gradient(70% 55% at 0% 100%,rgba(0,166,81,.35),transparent 70%),${COR.petroleo2}">
  <div style="position:absolute;inset:0;background-image:radial-gradient(rgba(185,255,241,.16) 1.2px,transparent 1.6px);background-size:22px 22px"></div>
  <div style="position:absolute;left:52px;right:52px;top:48px;display:flex;justify-content:space-between;align-items:center">${marca(28, true)}<span style="${MO};font-weight:800;font-size:10.5px;letter-spacing:.22em;color:${COR.petroleo};background:${COR.menta};border-radius:7px;padding:8px 12px">MATERIAL PRÓPRIO</span></div>
  <div style="position:absolute;right:-30px;top:120px;${T};font-size:430px;line-height:.8;color:transparent;-webkit-text-stroke:2.5px rgba(185,255,241,.22)">${total}</div>
  ${amostra(pick(4).n, pick(4).d, -7, 250, 170, 1)}${amostra(pick(118).n, pick(118).d, 4, 290, 268, 2)}${amostra(pick(61).n, pick(61).d, -2, 230, 366, 3)}
  <div style="position:absolute;left:52px;right:52px;top:560px">
    <span style="display:inline-block;${MO};font-weight:800;font-size:13px;letter-spacing:.16em;color:#fff;background:${COR.verde};border-radius:8px;padding:8px 14px">${esc(meta.exame).toUpperCase()}</span>
    <div style="${T};font-size:118px;line-height:.86;color:#fff;margin-top:18px">Revisão<br><span style="color:${COR.menta}">em dicas</span></div>
    <div style="${I};font-weight:500;font-size:17px;line-height:1.55;color:rgba(239,255,246,.88);margin-top:20px;max-width:560px">${esc(meta.sub)}</div>
    <div style="display:flex;gap:10px;margin-top:22px;flex-wrap:wrap">${meta.selos.map(x => `<span style="${MO};font-weight:700;font-size:11px;letter-spacing:.08em;color:${COR.menta};border:1.5px solid rgba(185,255,241,.45);border-radius:999px;padding:7px 13px">${esc(x)}</span>`).join('')}</div></div>
  <div style="position:absolute;left:52px;right:52px;bottom:52px;display:flex;align-items:flex-end;justify-content:space-between">
    <div><div style="${MO};font-weight:800;font-size:10px;letter-spacing:.22em;color:${COR.menta}">CRIADO POR</div><div style="${S};font-weight:800;font-size:26px;color:#fff;margin-top:4px">${esc(meta.autor)}</div></div>
    <div style="${MO};font-weight:800;font-size:13px;letter-spacing:.06em;color:#fff">${esc(meta.arroba)}</div></div>
  ${textura(true)}</section>`;

// ---------- como usar + mapa ----------
const usar = `<section class="pagina" style="background:${COR.papel}">${cab()}
  <div style="position:absolute;left:44px;right:44px;top:92px">
    <div style="${MO};font-weight:800;font-size:11px;letter-spacing:.2em;color:${COR.verde2}">ANTES DE COMEÇAR</div>
    <div style="${T};font-size:46px;line-height:.92;color:${COR.tinta};margin-top:6px">Como usar este material</div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:16px">${meta.passos.map((p, i) => `<div style="background:#fff;border:1.5px solid ${COR.linha};border-radius:14px;padding:13px 14px"><div style="${T};font-size:30px;line-height:.9;color:${COR.verde}">${i + 1}ª leitura</div><div style="${I};font-size:12px;line-height:1.5;color:#2B3A36;margin-top:6px">${esc(p)}</div></div>`).join('')}</div>
    <div style="${MO};font-weight:800;font-size:10.5px;letter-spacing:.2em;color:${COR.cinza};margin:18px 0 8px">COMO LER UMA DICA</div>
    ${cartao({ n: pick(118).n, d: pick(118).d, e: pick(118).e, f: pick(118).f })}
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;${I};font-size:11.5px;line-height:1.45;color:${COR.cinza}"><div><b style="color:${COR.tinta}">Negrito:</b> a dica rápida, o que você leva para a prova.</div><div><b style="color:${COR.tinta}">Texto menor:</b> a explicação, o porquê e a pegadinha.</div><div><b style="color:${COR.tinta}">⚖</b> o fundamento, para conferir na lei.</div></div>
    <div style="${MO};font-weight:800;font-size:10.5px;letter-spacing:.2em;color:${COR.cinza};margin:20px 0 8px">MAPA DA PROVA</div>
    <div style="border-radius:14px;overflow:hidden;border:1.5px solid ${COR.linha};background:#fff">
      <div style="display:grid;grid-template-columns:2.4fr .8fr .8fr 1fr;background:${COR.petroleo}">${['Matéria', 'Questões', 'Dicas', 'Números'].map(h => `<div style="padding:8px 12px;${MO};font-weight:800;font-size:9.5px;letter-spacing:.14em;color:${COR.menta}">${h.toUpperCase()}</div>`).join('')}</div>
      ${meta.mapa.map((m, i) => { const im = infoMateria[m.materia] || {}; return `<div style="display:grid;grid-template-columns:2.4fr .8fr .8fr 1fr;border-top:1px solid ${COR.linha};background:${i % 2 ? '#fff' : '#F8FBFA'};align-items:center">
        <div style="padding:6px 12px;${I};font-weight:600;font-size:12px;color:${COR.tinta}">${esc(m.materia)}</div>
        <div style="padding:6px 12px;display:flex;align-items:center;gap:8px"><span style="${MO};font-weight:800;font-size:12px;color:${COR.tinta};width:20px">${m.questoes}</span><span style="height:6px;border-radius:3px;background:${COR.verde};width:${Math.max(4, m.questoes * 1.1)}px"></span></div>
        <div style="padding:6px 12px;${MO};font-weight:700;font-size:12px;color:${COR.tinta}">${im.dicas || ''}</div>
        <div style="padding:6px 12px;${MO};font-weight:700;font-size:11px;color:${COR.verde2}">${im.primeira ? `${tres(im.primeira)}–${tres(im.ultima)}` : ''}</div></div>`; }).join('')}</div>
    <div style="${I};font-size:10.5px;color:${COR.cinza};margin-top:8px">${esc(meta.fonteMapa)}</div>
  </div>${rod()}${textura(false)}</section>`;

// ---------- painel de revisão ----------
const painel = `<section class="pagina" style="background:${COR.papel}">${cab()}
  <div style="position:absolute;left:44px;right:44px;top:92px">
    <div style="${MO};font-weight:800;font-size:11px;letter-spacing:.2em;color:${COR.verde2}">DEPOIS DA 1ª LEITURA</div>
    <div style="${T};font-size:44px;line-height:.92;color:${COR.tinta};margin-top:6px">Painel de revisão</div>
    <div style="${I};font-size:12.5px;line-height:1.5;color:#2B3A36;margin-top:8px">Pinte o número das dicas em que você hesitou. Na véspera, revise só as pintadas: é a sua lista pessoal de pontos fracos.</div>
    <div style="display:grid;grid-template-columns:repeat(20,1fr);gap:4px;margin-top:14px">${Array.from({ length: total }, (_, i) => { const n = i + 1; const sec = secoes.find(s => s.dicas.some(d => d.n === n)); const ini = sec && sec.dicas[0].n === n && secoes.find(s => s.materia === sec.materia) === sec; return `<div style="height:27px;border-radius:5px;border:1.4px solid ${ini ? COR.verde : COR.linha};background:#fff;display:grid;place-items:center;${MO};font-weight:700;font-size:9px;color:${ini ? COR.verde2 : '#7C9690'}">${tres(n)}</div>`; }).join('')}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px">
      <div style="background:#fff;border:1.5px solid ${COR.linha};border-radius:14px;padding:12px 14px"><div style="${T};font-size:18px;color:${COR.tinta}">Minhas contas</div>${['Dicas marcadas na 1ª leitura', 'Dicas marcadas na 2ª leitura', 'Matéria com mais marcas'].map(x => `<div style="display:flex;align-items:flex-end;gap:8px;margin-top:9px"><span style="${I};font-weight:600;font-size:11.5px;color:${COR.tinta};white-space:nowrap">${x}</span><span style="flex:1;border-bottom:1.5px solid #B9C9C4;height:12px"></span></div>`).join('')}</div>
      <div style="background:${COR.petroleo};border-radius:14px;padding:12px 14px"><div style="${T};font-size:18px;color:#fff">Véspera da prova</div>${['Revisar só as dicas pintadas', 'Reler as matérias com mais questões', 'Dormir: a memória agradece'].map(x => `<div style="display:flex;gap:9px;align-items:center;margin-top:9px;${I};font-weight:600;font-size:11.5px;color:${COR.menta}">${caixa(13).replace('#fff', 'transparent').replace(COR.petroleo, COR.menta)}${x}</div>`).join('')}</div></div>
  </div>${rod()}${textura(false)}</section>`;

// ---------- fontes e contracapa ----------
const fontes = `<section class="pagina" style="background:${COR.papel}">${cab()}
  <div style="position:absolute;left:44px;right:44px;top:92px">
    <div style="${MO};font-weight:800;font-size:11px;letter-spacing:.2em;color:${COR.verde2}">PARA CONFERIR</div>
    <div style="${T};font-size:44px;line-height:.92;color:${COR.tinta};margin-top:6px">Fontes oficiais</div>
    <div style="display:flex;flex-direction:column;gap:6px;margin-top:14px">${meta.fontes.map(([t, u]) => `<div style="background:#fff;border:1.5px solid ${COR.linha};border-radius:10px;padding:8px 12px"><div style="${I};font-weight:700;font-size:12px;color:${COR.tinta}">${esc(t)}</div><div style="${MO};font-size:9.5px;color:${COR.verde2};margin-top:2px;word-break:break-all">${esc(u)}</div></div>`).join('')}</div>
    <div style="${I};font-size:11px;line-height:1.5;color:${COR.cinza};margin-top:12px">${esc(meta.atualizacao)}</div>
  </div>${rod()}${textura(false)}</section>`;
const contra = `<section class="pagina" style="background:radial-gradient(70% 55% at 50% 30%,rgba(0,210,200,.22),transparent 70%),${COR.petroleo2}">
  <div style="position:absolute;inset:0;background-image:radial-gradient(rgba(185,255,241,.16) 1.2px,transparent 1.6px);background-size:22px 22px"></div>
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 90px">
    ${marca(40, true)}
    <div style="${T};font-size:64px;line-height:.9;color:#fff;margin-top:40px">Boa prova!</div>
    <div style="${I};font-size:15px;line-height:1.6;color:rgba(239,255,246,.85);margin-top:16px">${esc(meta.despedida)}</div>
    <div style="margin-top:34px;${MO};font-weight:800;font-size:11px;letter-spacing:.22em;color:${COR.menta}">CRIADO POR</div>
    <div style="${S};font-weight:800;font-size:24px;color:#fff;margin-top:4px">${esc(meta.autor)}</div>
    <div style="${MO};font-weight:800;font-size:14px;color:${COR.menta};margin-top:18px">${esc(meta.arroba)}</div>
    <div style="${I};font-size:10.5px;line-height:1.5;color:rgba(239,255,246,.55);margin-top:40px;max-width:520px">${esc(meta.direitos)}</div></div>
  ${textura(true)}</section>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet">
<style>@page{size:210mm 297mm;margin:0}*{box-sizing:border-box;margin:0}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}.pagina{position:relative;width:${W}px;height:${H}px;overflow:hidden;break-after:page}.pagina:last-child{break-after:auto}
#fonte{position:absolute;left:-9999px;top:0;width:${W - 88}px}</style></head>
<body>${capa}${usar}<div id="dicas"></div>${painel}${fontes}${contra}
<div id="fonte">${blocos.join('')}</div>
<template id="molde"><section class="pagina" style="background:${COR.papel}">${cab()}<div class="corpo" style="position:absolute;left:44px;right:44px;top:88px"></div>${rod()}${textura(false)}</section></template>
<script>document.fonts.ready.then(()=>setTimeout(()=>{
  const ALT=${H}-88-60, fonte=[...document.getElementById('fonte').children], destino=document.getElementById('dicas'), molde=document.getElementById('molde');
  let pag=null, corpo=null, usado=0, materia='';
  const nova=()=>{pag=molde.content.firstElementChild.cloneNode(true);destino.appendChild(pag);corpo=pag.querySelector('.corpo');usado=0;pag.querySelector('.materia-atual').textContent=materia;};
  nova();
  for(let i=0;i<fonte.length;i++){const b=fonte[i];
    if(b.classList.contains('materia')){materia=b.querySelector('div[style*="font-size:34px"]').textContent; if(usado>0) nova(); else pag.querySelector('.materia-atual').textContent=materia;}
    const h=b.getBoundingClientRect().height+parseFloat(getComputedStyle(b).marginTop)+parseFloat(getComputedStyle(b).marginBottom);
    // faixa de subseção não fica sozinha no pé da página
    const prox=fonte[i+1]; const hProx=(b.classList.contains('sub')&&prox)?prox.getBoundingClientRect().height+8:0;
    if(usado+h+hProx>ALT&&usado>0){nova();}
    corpo.appendChild(b.cloneNode(true)); usado+=h;}
  document.getElementById('fonte').remove();
  const pags=[...document.querySelectorAll('.pagina')], N=pags.length;
  pags.forEach((p,i)=>{const n=p.querySelector('.num'); if(n) n.textContent=String(i+1).padStart(2,'0')+'/'+String(N).padStart(2,'0'); const g=p.querySelector('.prog'); if(g) g.style.width=((i+1)*100/N)+'%';});
  window.__pronto=true},400))</script></body></html>`;

const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
fs.mkdirSync(path.join(root, 'build'), { recursive: true });
const hp = path.join(root, 'build', `${id}-dicas.html`); fs.writeFileSync(hp, html);
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1080 / W });
await page.goto('file://' + hp);
await page.waitForFunction(() => window.__pronto === true, null, { timeout: 60000 });
const out = path.join(root, 'saida', id);
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
const secs = await page.$$('section.pagina');
for (let i = 0; i < secs.length; i++) await secs[i].screenshot({ path: path.join(out, `${i + 1}.png`) });
await page.pdf({ path: path.join(out, `${id}.pdf`), width: '210mm', height: '297mm', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
await browser.close();
console.log('✓', id, `(${secs.length} páginas, ${total} dicas)`);

// Criativos de divulgação de um kit de edital (feed 1080×1350 e stories 1080×1920), sem foto do autor.
// Três famílias: tema (identidade do concurso), nativo (texto de story, Notas, tweet, enquete, caixinha) e
// trash (Arial, marca-texto, seta vermelha, planilha, bloco de notas, print do edital). Textos em
// kits/criativos/<id>.json; {{PRECO}} vem de kits/produtos.json. Nos stories, 250 px no topo e 330 no pé ficam livres.
// Uso: node criativos-kit.mjs <id> [n]  →  saida/kit-<id>/criativos/NN-<nome>.png
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { marca, simbolo } from './template.mjs';
import { TEMAS, tex, carimbo } from './kits/tema.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const [id, so] = process.argv.slice(2);
const prod = JSON.parse(fs.readFileSync(path.join(root, 'kits', 'produtos.json'), 'utf8')).find(p => p.id === id);
const lista = JSON.parse(fs.readFileSync(path.join(root, 'kits', 'criativos', id + '.json'), 'utf8'));
const c = TEMAS[prod.tema];
const FONTES = 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@800;900&family=Inter:wght@400;500;600;700;800;900&family=Sora:wght@600;700;800&family=Comic+Neue:wght@700&family=Roboto:wght@400;500;700&display=swap';
const T = "font-family:'Big Shoulders Display',sans-serif;font-weight:900;text-transform:uppercase", I = "font-family:'Inter',sans-serif", S = "font-family:'Sora',sans-serif";
const A = "font-family:Arial,'Liberation Sans',Helvetica,sans-serif", IG = "font-family:-apple-system,'Roboto','Inter',Helvetica,sans-serif";
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pre = s => String(s ?? '').replaceAll('{{PRECO}}', prod.preco);
const r = (s, hl = c.claro, b = 'inherit') => esc(pre(s)).replace(/\n/g, '<br>').replace(/\*\*(.+?)\*\*/g, `<b style="font-weight:900;color:${b}">$1</b>`).replace(/\[\[(.+?)\]\]/g, `<span style="color:${hl}">$1</span>`);
const img = (pdf, n) => 'file://' + path.join(root, 'saida', `${id}-${pdf}`, `${n}.png`);
const linhas = v => (Array.isArray(v) ? v : [v]);

// ---------- família TEMA
const fundo = (W, H) => `<div style="position:absolute;inset:0;background:${c.escuro}"></div><div style="position:absolute;inset:0;background-image:${tex(c, c.claro, .2, 120)}"></div><div style="position:absolute;inset:0;background:radial-gradient(80% 45% at 0% 100%,${c.escuro3},transparent 70%),radial-gradient(70% 40% at 100% 0%,${c.brilho},transparent 70%)"></div><div style="position:absolute;left:0;top:0;bottom:0;width:16px;background:${c.cor}"></div>`;
const topo = (W, y) => `<div style="position:absolute;left:72px;top:${y}px">${marca(44, '#fff', c.claro)}</div><div style="position:absolute;right:62px;top:${y - 14}px">${carimbo({ px: 170, cor: c.carimbo, ...prod.carimbo, id: 'k' })}</div>`;
const cta = (t, x = 72, b = 72) => t ? `<div style="position:absolute;left:${x}px;right:72px;bottom:${b}px;display:flex;align-items:center;justify-content:space-between;gap:20px"><span style="background:${c.carimbo};color:${c.tinta};${I};font-weight:900;font-size:36px;padding:20px 30px;border-radius:14px">${r(t)}</span><span style="${S};font-weight:700;font-size:24px;color:${c.claro}">@concursocomlibero</span></div>` : '';
const L = {
  manchete: (d, W, H, st) => `${fundo(W, H)}${topo(W, st ? 250 : 64)}
    <div style="position:absolute;left:72px;right:72px;top:${st ? 640 : 330}px">
      <div style="${S};font-weight:700;font-size:26px;letter-spacing:.16em;text-transform:uppercase;color:${c.claro}">${r(d.pre)}</div>
      <div style="${T};font-size:${d.ts || 128}px;line-height:.92;color:#fff;margin-top:22px">${r(d.titulo)}</div>
      ${d.sub ? `<div style="${I};font-size:36px;line-height:1.4;color:rgba(255,255,255,.88);margin-top:30px;max-width:900px">${r(d.sub, c.claro, '#fff')}</div>` : ''}</div>${cta(d.cta, 72, st ? 360 : 72)}`,
  numero: (d, W, H, st) => `${fundo(W, H)}${topo(W, st ? 250 : 64)}
    <div style="position:absolute;left:66px;right:72px;top:${st ? 560 : 290}px">
      <div style="${T};font-size:${d.nts || 400}px;line-height:.82;color:${c.claro}">${r(d.n)}</div>
      <div style="${T};font-size:${d.ts || 84}px;line-height:.95;color:#fff;margin-top:26px">${r(d.titulo)}</div>
      ${d.sub ? `<div style="${I};font-size:34px;line-height:1.42;color:rgba(255,255,255,.86);margin-top:26px;max-width:900px">${r(d.sub, c.claro, '#fff')}</div>` : ''}
      ${d.fonte ? `<div style="${S};font-weight:600;font-size:21px;color:${c.suave};margin-top:24px">${r(d.fonte)}</div>` : ''}</div>${cta(d.cta, 72, st ? 360 : 72)}`,
  capas: (d, W, H, st) => { const y = st ? 980 : 600; return `${fundo(W, H)}${topo(W, st ? 250 : 64)}
    <div style="position:absolute;left:72px;right:72px;top:${st ? 470 : 250}px"><div style="${T};font-size:${d.ts || 104}px;line-height:.92;color:#fff">${r(d.titulo)}</div>${d.sub ? `<div style="${I};font-size:32px;line-height:1.4;color:rgba(255,255,255,.86);margin-top:18px">${r(d.sub, c.claro, '#fff')}</div>` : ''}</div>
    ${[['estrategia', 1, 60, 30, -9], ['cronograma-2h', 1, 600, 10, 8], ['o-que-a-fcc-cobra', 1, 140, 70, -3], ['raio-x-do-edital', 1, 400, 50, 4]].map(([p, n, x, dy, g]) => `<img src="${img(p, n)}" style="position:absolute;left:${x}px;top:${y + dy}px;width:420px;border-radius:10px;transform:rotate(${g}deg);box-shadow:0 24px 50px rgba(0,0,0,.5)">`).join('')}
    ${cta(d.cta, 72, st ? 360 : 60)}`; },
  ficha: (d, W, H, st) => `${fundo(W, H)}${topo(W, st ? 250 : 64)}
    <div style="position:absolute;left:72px;right:72px;top:${st ? 520 : 290}px">
      <div style="${T};font-size:${d.ts || 92}px;line-height:.92;color:#fff">${r(d.titulo)}</div>
      <div style="background:${c.papel};border-radius:22px;padding:30px 36px;margin-top:34px;color:${c.tinta}">
        <div style="${S};font-weight:700;font-size:22px;letter-spacing:.14em;text-transform:uppercase;color:${c.corForte}">${r(d.cargo)}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;margin-top:12px">${d.itens.map(([k, v], i) => `<div style="padding:16px 0;border-top:2px solid ${c.borda}"><div style="${S};font-weight:600;font-size:19px;letter-spacing:.08em;text-transform:uppercase;color:${c.cinza}">${esc(k)}</div><div style="${T};font-size:58px;line-height:1.05;color:${i === d.forte ? c.corForte : c.tinta}">${esc(v)}</div></div>`).join('')}</div>
        ${d.nota ? `<div style="${I};font-size:27px;line-height:1.4;background:${c.realce};border-radius:12px;padding:16px 20px;margin-top:14px">${r(d.nota, c.corForte, c.tinta)}</div>` : ''}</div>
      ${d.fonte ? `<div style="${S};font-weight:600;font-size:20px;color:${c.suave};margin-top:18px">${r(d.fonte)}</div>` : ''}</div>${cta(d.cta, 72, st ? 360 : 60)}`,
  lista: (d, W, H, st) => `${fundo(W, H)}${topo(W, st ? 250 : 64)}
    <div style="position:absolute;left:72px;right:72px;top:${st ? 500 : 270}px">
      <div style="${T};font-size:${d.ts || 100}px;line-height:.92;color:#fff">${r(d.titulo)}</div>
      <div style="margin-top:30px">${d.itens.map(t => `<div style="display:flex;gap:22px;align-items:flex-start;padding:15px 0;border-top:2px solid rgba(255,255,255,.16)"><svg width="40" height="40" viewBox="0 0 24 24" style="flex:none;margin-top:2px"><path d="M4 13l5 5L20 6" fill="none" stroke="${c.carimbo}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg><div style="${I};font-size:${d.px || 33}px;line-height:1.32;color:rgba(255,255,255,.9)">${r(t, c.claro, '#fff')}</div></div>`).join('')}</div></div>${cta(d.cta, 72, st ? 360 : 60)}`,
  conta: (d, W, H, st) => `${fundo(W, H)}${topo(W, st ? 250 : 64)}
    <div style="position:absolute;left:72px;right:72px;top:${st ? 520 : 280}px">
      <div style="${T};font-size:${d.ts || 96}px;line-height:.92;color:#fff">${r(d.titulo)}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:40px">${d.blocos.map(([k, v, s], i) => `<div style="background:${i ? 'rgba(255,255,255,.08)' : c.cor};border:2px solid ${i ? 'rgba(255,255,255,.22)' : c.cor};border-radius:20px;padding:28px"><div style="${S};font-weight:700;font-size:22px;letter-spacing:.1em;text-transform:uppercase;color:${i ? c.claro : '#fff'}">${esc(k)}</div><div style="${T};font-size:120px;line-height:1;color:#fff;margin-top:8px">${esc(v)}</div><div style="${I};font-size:26px;color:rgba(255,255,255,.86)">${esc(s)}</div></div>`).join('')}</div>
      <div style="${I};font-size:34px;line-height:1.42;color:rgba(255,255,255,.88);margin-top:34px">${r(d.sub, c.claro, '#fff')}</div></div>${cta(d.cta, 72, st ? 360 : 60)}`,

  // ---------- família NATIVO
  story: (d, W, H) => `<div style="position:absolute;inset:0;background:${d.bg || '#0E9A94'}"></div>
    <div style="position:absolute;left:70px;right:70px;top:${d.y || 420}px;display:flex;flex-direction:column;align-items:${d.alinha || 'center'};gap:4px">
      ${d.blocos.map(b => `<div style="max-width:100%;text-align:${d.alinha === 'flex-start' ? 'left' : 'center'};${IG};font-weight:700;font-size:${b.px || 60}px;line-height:1.28;margin:${b.gap || 0}px 0 0"><span style="background:${b.fundo || '#fff'};color:${b.cor || '#000'};padding:6px 20px;border-radius:14px;box-decoration-break:clone;-webkit-box-decoration-break:clone">${r(b.t, b.hl || '#E1306C')}</span></div>`).join('')}</div>
    ${d.figurinha ? `<div style="position:absolute;left:50%;transform:translateX(-50%) rotate(-3deg);bottom:${d.fy || 420}px;background:#fff;border-radius:18px;padding:16px 30px;${IG};font-weight:800;font-size:38px;color:${d.fcor || '#0E9A94'};box-shadow:0 6px 20px rgba(0,0,0,.18);white-space:nowrap">${r(d.figurinha)}</div>` : ''}`,
  enquete: (d, W, H) => `<div style="position:absolute;inset:0;background:${d.bg || 'linear-gradient(160deg,#082B45,#0E9A94)'}"></div>
    ${d.topo ? `<div style="position:absolute;left:80px;right:80px;top:330px;text-align:center;${IG};font-weight:700;font-size:58px;line-height:1.25;color:#fff">${r(d.topo, '#F2A33A')}</div>` : ''}
    <div style="position:absolute;left:130px;right:130px;top:${d.y || 760}px;background:#fff;border-radius:34px;box-shadow:0 10px 40px rgba(0,0,0,.25);overflow:hidden">
      <div style="${d.quiz ? 'background:linear-gradient(90deg,#7B3FE4,#E1306C);color:#fff;' : 'color:#111;'}${IG};font-weight:800;font-size:46px;line-height:1.22;text-align:center;padding:${d.quiz ? '34px' : '40px 40px 14px'}">${r(d.pergunta)}</div>
      <div style="padding:${d.quiz ? '28px' : '18px 34px 36px'};display:flex;flex-direction:column;gap:16px">${d.opcoes.map((o, i) => d.quiz ? `<div style="border:3px solid #DBDBDB;border-radius:20px;padding:20px 26px;${IG};font-weight:700;font-size:38px;color:#262626;display:flex;gap:18px;align-items:center"><span style="width:50px;height:50px;border-radius:50%;border:3px solid #DBDBDB;display:flex;align-items:center;justify-content:center;font-size:28px;color:#8E8E8E">${'ABCD'[i]}</span>${esc(o)}</div>` : `<div style="background:#F2F2F2;border-radius:18px;padding:26px;text-align:center;${IG};font-weight:800;font-size:44px;letter-spacing:.02em;background-clip:padding-box"><span style="background:linear-gradient(90deg,#0E9A94,#12507A);-webkit-background-clip:text;color:transparent">${esc(o)}</span></div>`).join('')}</div></div>
    ${d.pe ? `<div style="position:absolute;left:90px;right:90px;bottom:400px;text-align:center;${IG};font-weight:700;font-size:44px;line-height:1.3;color:#fff">${r(d.pe, '#F2A33A')}</div>` : ''}`,
  caixinha: (d, W, H) => `<div style="position:absolute;inset:0;background:${d.bg || '#082B45'}"></div><div style="position:absolute;inset:0;background-image:${tex(c, c.claro, .12, 120)}"></div>
    ${d.topo ? `<div style="position:absolute;left:80px;right:80px;top:330px;text-align:center;${IG};font-weight:700;font-size:56px;line-height:1.25;color:#fff">${r(d.topo, '#F2A33A')}</div>` : ''}
    <div style="position:absolute;left:150px;right:150px;top:${d.y || 780}px;border-radius:34px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,.3)"><div style="background:linear-gradient(135deg,#F58529,#DD2A7B,#8134AF);padding:44px 40px 40px;text-align:center;${IG};font-weight:800;font-size:46px;line-height:1.22;color:#fff">${r(d.pergunta)}</div><div style="background:#fff;padding:34px 40px;text-align:center;${IG};font-size:36px;color:#8E8E8E">Escreva algo…</div></div>
    ${d.pe ? `<div style="position:absolute;left:90px;right:90px;bottom:400px;text-align:center;${IG};font-weight:700;font-size:42px;line-height:1.3;color:#fff">${r(d.pe, '#F2A33A')}</div>` : ''}`,
  notas: (d, W, H, st) => `<div style="position:absolute;inset:0;background:#fff"></div>
    <div style="position:absolute;left:0;right:0;top:${st ? 180 : 0}px;padding:44px 60px 0;display:flex;justify-content:space-between;align-items:center;${IG};font-size:40px;color:#E0A500"><span>‹ Notas</span><span style="display:flex;gap:44px"><span>⋯</span><span style="font-weight:600">OK</span></span></div>
    <div style="position:absolute;left:60px;right:60px;top:${st ? 330 : 150}px">
      <div style="${IG};font-size:26px;color:#8E8E93;text-align:center">${esc(d.data || '22 de novembro de 2026 às 21:14')}</div>
      <div style="${IG};font-weight:800;font-size:${d.ts || 64}px;line-height:1.15;color:#1C1C1E;margin-top:26px">${r(d.titulo, '#1C1C1E')}</div>
      <div style="margin-top:22px">${d.itens.map(t => `<div style="${IG};font-size:${d.px || 40}px;line-height:1.38;color:#1C1C1E;padding:9px 0;display:flex;gap:18px"><span style="flex:none;width:36px;height:36px;border-radius:50%;border:2.5px solid ${t.startsWith('✓') ? '#E0A500' : '#C7C7CC'};background:${t.startsWith('✓') ? '#E0A500' : '#fff'};margin-top:8px"></span><span>${r(t.replace(/^✓ ?/, ''), '#1C1C1E')}</span></div>`).join('')}</div>
      ${d.pe ? `<div style="${IG};font-size:${d.px || 40}px;line-height:1.38;color:#1C1C1E;margin-top:22px">${r(d.pe, '#1C1C1E')}</div>` : ''}</div>`,
  tweet: (d, W, H, st) => `<div style="position:absolute;inset:0;background:${d.escuro ? '#000' : '#fff'}"></div>
    <div style="position:absolute;left:70px;right:70px;top:${st ? 560 : d.y || 300}px;color:${d.escuro ? '#E7E9EA' : '#0F1419'}">
      <div style="display:flex;gap:22px;align-items:center">${simbolo(104)}<div><div style="${IG};font-weight:800;font-size:40px;display:flex;align-items:center;gap:10px">Concurso com Líbero <svg width="38" height="38" viewBox="0 0 24 24"><path fill="#1D9BF0" d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/></svg></div><div style="${IG};font-size:34px;color:#536471">@concursocomlibero</div></div></div>
      <div style="${IG};font-size:${d.px || 52}px;line-height:1.36;margin-top:34px;white-space:normal">${r(d.texto, '#1D9BF0', d.escuro ? '#fff' : '#0F1419')}</div>
      <div style="${IG};font-size:30px;color:#536471;margin-top:34px;padding-bottom:26px;border-bottom:1.5px solid ${d.escuro ? '#2F3336' : '#EFF3F4'}">${esc(d.hora || '9:41 PM · 22 de nov de 2026')}</div></div>`,
  zoom: (d, W, H, st) => `<div style="position:absolute;inset:0;background:${c.papel}"></div>
    <div style="position:absolute;left:60px;right:60px;top:${st ? 270 : 60}px;${A};font-weight:700;font-size:${d.ts || 62}px;line-height:1.15;color:#111">${r(d.titulo, '#C0392B')}</div>
    <div style="position:absolute;left:${d.x ?? 60}px;top:${st ? (d.iy || 560) : (d.iy || 300)}px;width:${d.w || 960}px;height:${d.h || 880}px;overflow:hidden;border-radius:14px;border:3px solid #111;box-shadow:0 18px 40px rgba(7,30,48,.25)"><img src="${img(d.pdf, d.pg)}" style="position:absolute;width:${d.escala || 100}%;left:${-(d.cx || 0)}px;top:${-(d.cy || 0)}px"></div>
    ${d.circulo ? `<div style="position:absolute;left:${d.circulo[0]}px;top:${d.circulo[1]}px;width:${d.circulo[2]}px;height:${d.circulo[3]}px;border:8px solid #E11;border-radius:50%;transform:rotate(-4deg)"></div>` : ''}
    ${d.pe ? `<div style="position:absolute;left:60px;right:60px;bottom:${st ? 360 : 50}px;${A};font-weight:700;font-size:44px;color:#111">${r(d.pe, '#C0392B')}</div>` : ''}`,

  // ---------- família TRASH
  amarelo: (d, W, H, st) => `<div style="position:absolute;inset:0;background:${d.bg || '#FFE600'}"></div>
    <div style="position:absolute;left:60px;right:60px;top:${st ? 330 : 90}px;bottom:${st ? 360 : 90}px;display:flex;flex-direction:column;justify-content:${d.just || 'center'};gap:30px">${linhas(d.linhas).map((l, i) => `<div style="${A};font-weight:${l.leve ? 400 : 700};font-size:${l.px || 80}px;line-height:1.08;color:${l.cor || '#000'};text-align:${d.alinha || 'left'}">${l.sub ? `<span style="text-decoration:underline;text-decoration-color:#E11;text-decoration-thickness:10px;text-underline-offset:12px">${r(l.t, '#E11', '#E11')}</span>` : r(l.t, '#E11', '#E11')}</div>`).join('')}</div>`,
  seta: (d, W, H, st) => `<div style="position:absolute;inset:0;background:#fff"></div>
    <div style="position:absolute;left:50px;right:50px;top:${st ? 290 : 50}px;${A};font-weight:700;font-size:${d.ts || 70}px;line-height:1.1;color:#000">${r(d.titulo, '#E11', '#E11')}</div>
    <img src="${img(d.pdf, d.pg)}" style="position:absolute;left:${d.ix ?? 300}px;top:${st ? d.iy + 240 : d.iy}px;width:${d.iw || 700}px;border:2px solid #999;transform:rotate(${d.giro || 0}deg)">
    <svg style="position:absolute;left:${d.sx || 40}px;top:${(st ? 240 : 0) + (d.sy || 420)}px" width="360" height="300" viewBox="0 0 360 300"><path d="M20 30 C 120 40, 230 90, 290 230" fill="none" stroke="#E11" stroke-width="16" stroke-linecap="round"/><path d="M230 210 L 296 246 L 318 170" fill="none" stroke="#E11" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/></svg>
    ${d.pe ? `<div style="position:absolute;left:50px;right:50px;bottom:${st ? 360 : 40}px;${A};font-weight:700;font-size:${d.pp || 54}px;line-height:1.15;color:#000;background:#FFE600;padding:14px 20px;display:inline-block">${r(d.pe, '#E11', '#E11')}</div>` : ''}`,
  paint: (d, W, H, st) => `<div style="position:absolute;inset:0;background:#fff"></div>
    <div style="position:absolute;left:50px;right:50px;top:${st ? 300 : 70}px;bottom:${st ? 360 : 70}px;display:flex;flex-direction:column;justify-content:center;gap:18px">${d.linhas.map(l => `<div style="font-family:'Comic Neue','Comic Sans MS',cursive;font-weight:700;font-size:${l.px || 84}px;line-height:1.05;color:${l.cor || '#000'};transform:rotate(${l.giro || 0}deg);text-align:${l.al || 'left'}">${r(l.t)}</div>`).join('')}</div>`,
  planilha: (d, W, H, st) => { const y = st ? 300 : 70; return `<div style="position:absolute;inset:0;background:#fff"></div>
    <div style="position:absolute;left:0;right:0;top:${y}px;background:#217346;color:#fff;${A};font-size:30px;padding:16px 30px">${esc(d.arquivo || 'unificado_ma.xlsx')} - Excel</div>
    <div style="position:absolute;left:0;right:0;top:${y + 64}px;border-bottom:1px solid #D4D4D4;background:#F3F3F3;${A};font-size:26px;padding:12px 30px;color:#333">fx &nbsp; ${esc(d.fx || '')}</div>
    <table style="position:absolute;left:0;right:0;top:${y + 120}px;width:100%;border-collapse:collapse;${A};font-size:${d.px || 30}px;color:#000">
      <tr style="background:#E6E6E6;color:#555;font-size:24px"><td style="width:56px;border:1px solid #C6C6C6"></td>${d.cab.map((_, i) => `<td style="border:1px solid #C6C6C6;text-align:center;padding:4px">${'ABCDEFG'[i]}</td>`).join('')}</tr>
      ${[d.cab, ...d.linhas].map((l, j) => `<tr><td style="background:#E6E6E6;color:#555;font-size:24px;text-align:center;border:1px solid #C6C6C6">${j + 1}</td>${l.map((v, i) => `<td style="border:1px solid #D4D4D4;padding:14px 12px;${!j ? 'font-weight:700;background:#DDEBF7;' : ''}${(d.amarelo || []).includes(j) ? 'background:#FFFF00;font-weight:700;' : ''}text-align:${i ? 'right' : 'left'}">${esc(v)}</td>`).join('')}</tr>`).join('')}</table>
    ${d.pe ? `<div style="position:absolute;left:50px;right:50px;bottom:${st ? 360 : 60}px;${A};font-weight:700;font-size:${d.pp || 56}px;line-height:1.15;color:#E11">${r(d.pe, '#000', '#000')}</div>` : ''}`; },
  bloco: (d, W, H, st) => `<div style="position:absolute;inset:0;background:#fff"></div>
    <div style="position:absolute;left:0;right:0;top:${st ? 260 : 0}px;background:#F0F0F0;border-bottom:1px solid #CCC;${A};font-size:30px;color:#000;padding:16px 26px">${esc(d.arquivo || 'unificado ma.txt')} - Bloco de Notas</div>
    <div style="position:absolute;left:0;right:0;top:${(st ? 260 : 0) + 66}px;${A};font-size:26px;color:#000;padding:8px 26px;border-bottom:1px solid #E5E5E5">Arquivo &nbsp;&nbsp; Editar &nbsp;&nbsp; Formatar &nbsp;&nbsp; Exibir &nbsp;&nbsp; Ajuda</div>
    <div style="position:absolute;left:30px;right:40px;top:${(st ? 260 : 0) + 150}px;font-family:Consolas,'DejaVu Sans Mono',monospace;font-size:${d.px || 40}px;line-height:1.5;color:#000;white-space:pre-wrap">${esc(pre(d.texto))}</div>`,
  edital: (d, W, H, st) => `<div style="position:absolute;inset:0;background:#E9E9E9"></div>
    ${d.titulo ? `<div style="position:absolute;left:50px;right:50px;top:${st ? 290 : 50}px;${A};font-weight:700;font-size:${d.ts || 64}px;line-height:1.1;color:#000">${r(d.titulo, '#E11', '#E11')}</div>` : ''}
    <div style="position:absolute;left:50px;right:50px;top:${st ? (d.y || 560) : (d.y || 260)}px;background:#fff;box-shadow:0 4px 18px rgba(0,0,0,.2);padding:50px 56px;${A};font-size:${d.px || 34}px;line-height:1.5;color:#111;text-align:justify">${d.texto.map(p => `<p style="margin:0 0 14px">${esc(p).replace(/\[\[(.+?)\]\]/g, '<span style="background:#FFF200">$1</span>')}</p>`).join('')}</div>
    ${d.pe ? `<div style="position:absolute;left:50px;right:50px;bottom:${st ? 360 : 50}px;${A};font-weight:700;font-size:${d.pp || 56}px;line-height:1.12;color:#E11;transform:rotate(-2deg)">${r(d.pe, '#000', '#000')}</div>` : ''}`,
  preto: (d, W, H, st) => `<div style="position:absolute;inset:0;background:#000"></div>
    <div style="position:absolute;left:80px;right:80px;top:${st ? 300 : 90}px;bottom:${st ? 360 : 90}px;display:flex;flex-direction:column;justify-content:center;gap:34px">${d.linhas.map(l => `<div style="${A};font-size:${l.px || 54}px;line-height:1.3;color:${l.cor || '#fff'};font-weight:${l.b ? 700 : 400}">${r(l.t, '#FFE600', '#FFE600')}</div>`).join('')}</div>`,
};

const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
const out = path.join(root, 'saida', 'kit-' + id, 'criativos');
fs.mkdirSync(out, { recursive: true }); fs.mkdirSync(path.join(root, 'build'), { recursive: true });
let n = 0, avisos = 0;
for (const [i, d] of lista.entries()) {
  const num = String(i + 1).padStart(2, '0');
  if (so && so !== num) continue;
  const st = d.formato === 'story', W = 1080, H = st ? 1920 : 1350;
  const html = `<!doctype html><html><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet"><style>*{box-sizing:border-box}body{margin:0}</style></head><body><div id="a" style="position:relative;width:${W}px;height:${H}px;overflow:hidden">${L[d.layout](d, W, H, st)}</div>
<script>document.fonts.ready.then(()=>{const a=document.getElementById('a').getBoundingClientRect();window.__fora=[...document.querySelectorAll('#a *')].filter(e=>{const b=e.getBoundingClientRect();return b.width&&(b.right>a.right+2||b.bottom>a.bottom+2)&&e.tagName!=='IMG'&&!e.closest('svg')}).length;window.__pronto=true})</script></body></html>`;
  const f = path.join(root, 'build', `criativo-${id}.html`); fs.writeFileSync(f, html);
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.goto('file://' + f, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__pronto === true); await page.waitForTimeout(200);
  const fora = await page.evaluate(() => window.__fora);
  await (await page.$('#a')).screenshot({ path: path.join(out, `${num}-${d.nome}.png`) });
  await page.close(); n++;
  if (fora) { avisos++; console.log('!', num, d.nome, `${fora} elementos passam da borda`); }
}
await browser.close();
console.log(avisos ? '!' : '✓', n, 'criativos em', out);

// Criativos de divulgação da Revisão em Dicas (ENAM e afins), um formato por criativo.
// Uso: node criativos-revisao.mjs rd-enam   → saida/rd-enam/criativos/NN-<nome>.png
// Textos: kits/criativos/<id>.json. Imagens das páginas (mockup, parte1, parte2, painel):
// saida/<id>/assets/ (baixadas do site do produto; ficam fora do git).
import { chromium } from 'playwright';
import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const ID = process.argv[2] || 'rd-enam';
const SO = process.argv.slice(3);
const dados = JSON.parse(readFileSync(resolve(AQUI, 'kits/criativos', ID + '.json'), 'utf8'));
const SAIDA = resolve(AQUI, 'saida', ID, 'criativos');
const ASSETS = resolve(AQUI, 'saida', ID, 'assets');
mkdirSync(SAIDA, { recursive: true });
const img = (n) => { const f = resolve(ASSETS, n + '.webp'); return existsSync(f) ? pathToFileURL(f).href : ''; };

// Identidade do material (a mesma da página de vendas do ENAM)
const TEMAS = {
  'rd-enam': { navy: '#0B1633', navy2: '#12224A', ouro: '#C9A227', ouro2: '#8E6B10', creme: '#F2DE9E', papel: '#F6F3EC', tinta: '#101935', cinza: '#6A6E80', linha: '#E4DCC8', g1: 'rgba(227,190,92,.26)', g2: 'rgba(201,162,39,.3)', chip: '#F5ECD0', rot: 'REVISÃO EM DICAS · ENAM 2026.2', selo: 'ENAM 2026.2', total: 320 },
  // TCE MA: bordô, coral e pêssego (a página de vendas do TCE MA)
  'rd-tce-ma': { navy: '#2A0A14', navy2: '#3D1220', ouro: '#F0553A', ouro2: '#C93A22', creme: '#FFD3C4', papel: '#F8F2EC', tinta: '#1F0A10', cinza: '#6F5F62', linha: '#EADCD2', g1: 'rgba(240,85,58,.28)', g2: 'rgba(86,26,43,.9)', chip: '#FDE6DC', rot: 'REVISÃO EM DICAS · TCE MA 2026', selo: 'TCE MA 2026', total: 400 },
};
const C = TEMAS[ID] || TEMAS['rd-enam'];
const FONTES = 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&family=Caveat:wght@600;700&family=Kalam:wght@400;700&display=swap';
const T = "font-family:'Big Shoulders Display',Impact,sans-serif;font-weight:900;text-transform:uppercase;line-height:.88;letter-spacing:-.005em";
const MONO = "font-family:'JetBrains Mono',monospace";
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const hl = (s, cor = C.ouro) => esc(s).replace(/\[\[(.+?)\]\]/g, `<span style="color:${cor}">$1</span>`).replace(/\n/g, '<br>');

const SIMB = `<svg viewBox="0 0 100 100" width="100%" height="100%"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#00B85A"/><stop offset=".55" stop-color="#009A8C"/><stop offset="1" stop-color="#14E6DA"/></linearGradient></defs><rect x="2" y="2" width="96" height="96" rx="28" fill="url(#g)"/><path d="M32 22 V70 H70" fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/><path d="M46 46 l9 9 l18 -20" fill="none" stroke="#B9FFF1" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const marca = (escuro = true, tam = 52) => `<div style="display:flex;align-items:center;gap:14px"><div style="width:${tam}px;height:${tam}px">${SIMB}</div><div style="line-height:1"><div style="${MONO};font-size:${tam * .26}px;letter-spacing:.2em;color:${escuro ? C.creme : C.ouro2};text-transform:uppercase">Concurso com</div><div style="font-family:Inter;font-weight:800;font-size:${tam * .52}px;letter-spacing:-.03em;color:${escuro ? '#fff' : C.tinta}">Líbero</div></div></div>`;
const cta = (t, fundo = C.ouro, cor = C.navy) => `<div style="display:inline-flex;align-items:center;gap:14px;background:${fundo};color:${cor};font-family:Inter;font-weight:800;font-size:36px;padding:22px 34px;border-radius:999px">${esc(t)}<svg width="30" height="30" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`;
const selo = (t, fundo = C.ouro, cor = C.navy) => `<span style="display:inline-block;white-space:nowrap;${MONO};font-weight:700;font-size:26px;letter-spacing:.1em;background:${fundo};color:${cor};padding:10px 18px;border-radius:10px;text-transform:uppercase">${esc(t)}</span>`;
const fundoNavy = `background:radial-gradient(80% 55% at 100% 0%,${C.g1},transparent 70%),radial-gradient(70% 50% at 0% 100%,${C.g2},transparent 70%),${C.navy};color:#fff`;
const area = (H) => H > 1500 ? { top: 260, bot: 340 } : { top: 80, bot: 80 };
const caixa = (H, css, html) => { const a = area(H); return `<div style="position:absolute;left:80px;right:80px;top:${a.top}px;bottom:${a.bot}px;display:flex;flex-direction:column;${css}">${html}</div>`; };
const rodape = (d, escuro = true) => `<div style="margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:20px">${marca(escuro)}${cta(d.cta)}</div>`;

const L = {
  busca: (d, W, H) => `<div style="position:absolute;inset:0;background:#fff"></div>` + caixa(H, 'gap:34px', `
    <div style="display:flex;align-items:center;gap:22px;border:2px solid #DADCE0;border-radius:999px;padding:28px 36px;box-shadow:0 6px 24px rgba(0,0,0,.08);font-family:Inter;font-size:38px;color:#202124">
      <svg width="40" height="40" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="#5F6368" stroke-width="2.4"/><path d="M15.5 15.5 21 21" stroke="#5F6368" stroke-width="2.4" stroke-linecap="round"/></svg>${esc(d.busca)}<span style="width:3px;height:44px;background:#1a73e8;margin-left:-14px"></span></div>
    <div style="border:2px solid #ECEDEF;border-radius:28px;padding:10px 0">${d.sugestoes.map((s) => `<div style="display:flex;gap:22px;align-items:center;padding:16px 36px;font-family:Inter;font-size:31px;color:#3C4043"><svg width="28" height="28" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="#9AA0A6" stroke-width="2.4"/><path d="M15.5 15.5 21 21" stroke="#9AA0A6" stroke-width="2.4" stroke-linecap="round"/></svg><span>${esc(s).replace(esc(d.busca), `${esc(d.busca)}<b>`)}</b></span></div>`).join('')}</div>
    <div style="background:${C.navy};border-radius:30px;padding:44px;color:#fff;display:grid;gap:18px">
      <div style="${MONO};font-size:24px;color:${C.creme};letter-spacing:.08em">RESULTADO MAIS ÚTIL</div>
      <div style="font-family:Inter;font-weight:800;font-size:50px;line-height:1.1;color:${C.creme}">${esc(d.titulo)}</div>
      <div style="font-family:Inter;font-size:33px;line-height:1.45;color:rgba(255,255,255,.85)">${esc(d.texto)}</div>
      <div style="margin-top:12px">${cta(d.cta)}</div>
    </div>
    <div style="margin-top:auto">${marca(false)}</div>`),

  chat: (d, W, H) => `<div style="position:absolute;inset:0;background:#ECE5DD"></div>
    <div style="position:absolute;left:0;right:0;top:0;height:250px;background:#075E54"></div>
    <div style="position:absolute;left:60px;right:60px;top:150px;display:flex;align-items:center;gap:22px;color:#fff;font-family:Inter"><div style="width:76px;height:76px;border-radius:50%;background:#D9D2C5;display:grid;place-items:center;font-size:38px">👩</div><div><div style="font-weight:700;font-size:36px">${esc(d.contato)}</div><div style="font-size:26px;opacity:.8">online</div></div></div>
    <div style="position:absolute;left:50px;right:50px;top:310px;display:flex;flex-direction:column;gap:22px;font-family:Inter">${d.msgs.map(([q, t], k) => `<div style="align-self:${q === 'd' ? 'flex-end' : 'flex-start'};max-width:78%;background:${q === 'd' ? '#DCF8C6' : '#fff'};border-radius:22px;${q === 'd' ? 'border-top-right-radius:6px' : 'border-top-left-radius:6px'};padding:22px 28px;font-size:40px;line-height:1.3;color:#111;box-shadow:0 2px 2px rgba(0,0,0,.08)">${esc(t)}<span style="font-size:22px;color:#888;margin-left:14px">21:4${k}${q === 'd' ? ' ✓✓' : ''}</span></div>`).join('')}</div>
    <div style="position:absolute;left:80px;right:80px;bottom:340px;display:flex;flex-direction:column;align-items:center;gap:26px"><div style="background:${C.navy};border-radius:26px;padding:26px 34px;display:flex;align-items:center;gap:20px">${marca(true, 46)}<div style="font-family:Inter;font-weight:700;font-size:30px;color:${C.creme}">320 dicas · 8 disciplinas</div></div>${cta(d.cta)}</div>`,

  recibo: (d, W, H) => `<div style="position:absolute;inset:0;background:${C.navy}"></div>
    <div style="position:absolute;left:150px;right:150px;top:70px;bottom:250px;background:#FBFAF5;box-shadow:0 30px 60px rgba(0,0,0,.4);transform:rotate(-1.5deg);padding:56px 60px;${MONO};color:#222;display:flex;flex-direction:column;gap:16px;font-size:28px;-webkit-mask:radial-gradient(14px at 50% 100%,#0000 98%,#000) 0 0/32px 100% repeat-x">
      <div style="text-align:center;font-weight:700;font-size:34px">CONCURSO COM LÍBERO</div>
      <div style="text-align:center;font-size:24px;color:#555">${C.rot}</div>
      <div style="border-top:3px dashed #999;margin:10px 0"></div>
      ${d.itens.map(([a, b]) => `<div style="display:flex;justify-content:space-between;gap:20px"><span>${esc(a)}</span><b style="${b === 'não' ? 'color:#C0392B' : ''}">${esc(b)}</b></div>`).join('')}
      <div style="border-top:3px dashed #999;margin:10px 0"></div>
      <div style="display:flex;justify-content:space-between;align-items:baseline;font-weight:700"><span style="font-size:36px">TOTAL</span><span style="font-size:64px">R$ ${esc(d.total)}</span></div>
      <div style="text-align:center;font-size:22px;color:#666;margin-top:auto">PDF · ACESSO NO SEU E-MAIL · OBRIGADO</div>
      <div style="height:56px;background:repeating-linear-gradient(90deg,#222 0 4px,transparent 4px 8px,#222 8px 10px,transparent 10px 15px)"></div>
    </div>
    <div style="position:absolute;left:80px;right:80px;bottom:70px;display:flex;justify-content:space-between;align-items:center">${marca(true)}${cta(d.cta)}</div>`,

  checklist: (d, W, H) => `<div style="position:absolute;inset:0;background:#FFFDF4;background-image:repeating-linear-gradient(transparent 0 78px,#CFE0F2 78px 81px);"></div><div style="position:absolute;top:0;bottom:0;left:120px;width:3px;background:#F2A9A9"></div>` + `<div style="position:absolute;left:170px;right:80px;top:90px;bottom:80px;display:flex;flex-direction:column">
    <div style="font-family:Caveat;font-weight:700;font-size:92px;color:${C.navy};line-height:1;margin-bottom:30px">${esc(d.titulo)}</div>
    ${d.riscados.map((t) => `<div style="font-family:Kalam;font-size:50px;line-height:81px;color:#8A8F99;text-decoration:line-through;text-decoration-color:#D63A3A;text-decoration-thickness:5px">☐ ${esc(t)}</div>`).join('')}
    ${d.feitos.map((t) => `<div style="font-family:Kalam;font-weight:700;font-size:50px;line-height:81px;color:${C.tinta}"><span style="color:#1F9D55">☑</span> ${esc(t)}</div>`).join('')}
    <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center">${marca(false)}${cta(d.cta, C.navy, '#fff')}</div></div>`,

  artigos: (d, W, H) => `<div style="position:absolute;inset:0;${fundoNavy}"></div>` + caixa(H, 'gap:20px', `
    ${d.linhas.map(([a, b]) => `<div style="display:flex;justify-content:space-between;align-items:baseline;border-bottom:2px solid rgba(242,222,158,.2);padding:14px 0;font-family:Inter;font-size:44px;color:rgba(255,255,255,.85)"><span>${esc(a)}</span><b style="${MONO};color:#fff">${esc(b)}</b></div>`).join('')}
    <div style="${T};font-size:300px;color:${C.creme};margin-top:30px">${esc(d.total)}</div>
    <div style="${T};font-size:84px">${esc(d.titulo)}</div>
    <div style="font-family:Inter;font-weight:700;font-size:52px;line-height:1.25;margin-top:30px">${hl(d.virada)}</div>
    <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center">${marca(true)}${cta(d.cta)}</div>`),

  dica: (d, W, H) => `<div style="position:absolute;inset:0;background:${C.papel}"></div>` + caixa(H, 'gap:36px', `
    <div style="display:flex;justify-content:space-between;align-items:center">${selo('Dica ' + d.n + ' de ' + C.total)}<span style="font-family:Inter;font-weight:600;font-size:28px;color:${C.cinza}">${esc(d.materia)}</span></div>
    <div style="background:#fff;border:3px solid ${C.linha};border-radius:36px;padding:56px;box-shadow:0 40px 70px -40px rgba(11,22,51,.5);display:grid;grid-template-columns:auto 1fr;gap:36px">
      <div style="${T};font-size:150px;color:${C.ouro}">${esc(d.n)}</div>
      <div><div style="font-family:Inter;font-weight:800;font-size:54px;line-height:1.22;color:${C.tinta}">${esc(d.regra)}</div>
      <div style="font-family:Inter;font-size:36px;line-height:1.45;color:${C.cinza};margin-top:26px">${esc(d.explica)}</div>
      <div style="display:inline-block;margin-top:28px;${MONO};font-weight:700;font-size:28px;color:${C.ouro2};background:${C.chip};border-radius:10px;padding:10px 16px">§ ${esc(d.fonte)}</div></div>
    </div>
    <div style="${T};font-size:96px;color:${C.navy}">Uma linha. <span style="color:${C.ouro2}">Com o fundamento.</span></div>
    <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center">${marca(false)}${cta(d.cta, C.navy, '#fff')}</div>`),

  versus: (d, W, H) => `<div style="position:absolute;inset:0;background:#fff"></div><div style="position:absolute;left:0;right:0;top:0;height:640px;background:${C.navy}"></div>
    <div style="position:absolute;left:80px;right:80px;top:80px"><div style="${MONO};font-size:28px;letter-spacing:.12em;color:${C.creme};text-transform:uppercase">${esc(d.pre)}</div>
      <div style="${T};font-size:180px;color:#fff;margin-top:40px">${esc(d.a[0])}</div>
      <div style="font-family:Inter;font-size:46px;line-height:1.3;color:rgba(255,255,255,.85);margin-top:20px">é ${esc(d.a[1])}</div></div>
    <div style="position:absolute;left:50%;top:640px;transform:translate(-50%,-50%);width:140px;height:140px;border-radius:50%;background:${C.ouro};display:grid;place-items:center;${T};font-size:70px;color:${C.navy};box-shadow:0 0 0 14px #fff">X</div>
    <div style="position:absolute;left:80px;right:80px;top:750px"><div style="${T};font-size:150px;color:${C.navy}">${esc(d.b[0])}</div>
      <div style="font-family:Inter;font-size:46px;line-height:1.3;color:${C.cinza};margin-top:16px">é ${esc(d.b[1])}</div>
      <div style="font-family:Inter;font-weight:700;font-size:36px;line-height:1.35;color:${C.tinta};margin-top:30px;border-left:8px solid ${C.ouro};padding-left:22px">${esc(d.pega)} <span style="color:${C.ouro2}">(${esc(d.n)})</span></div></div>
    <div style="position:absolute;left:80px;right:80px;bottom:70px;display:flex;justify-content:space-between;align-items:center">${marca(false)}${cta(d.cta, C.navy, '#fff')}</div>`,

  duelo: (d, W, H) => `<div style="position:absolute;inset:0;display:grid;grid-template-rows:920px 1fr"><div style="background:${C.navy}"></div><div style="background:${C.ouro}"></div></div>
    <div style="position:absolute;left:80px;right:80px;top:270px;color:#fff"><div style="${MONO};font-size:28px;letter-spacing:.12em;color:${C.creme};text-transform:uppercase">${esc(d.pre)}</div><div style="${T};font-size:180px;margin-top:30px">${esc(d.a[0])}</div><div style="font-family:Inter;font-size:50px;line-height:1.3;margin-top:24px;color:rgba(255,255,255,.88)">${esc(d.a[1])}</div></div>
    <div style="position:absolute;left:50%;top:920px;transform:translate(-50%,-50%);width:180px;height:180px;border-radius:50%;background:#fff;display:grid;place-items:center;${T};font-size:96px;color:${C.navy};box-shadow:0 20px 50px rgba(0,0,0,.3)">VS</div>
    <div style="position:absolute;left:80px;right:80px;top:990px;color:${C.navy}"><div style="${T};font-size:140px">${esc(d.b[0])}</div><div style="font-family:Inter;font-size:44px;line-height:1.3;margin-top:18px">${esc(d.b[1])}</div><div style="font-family:Inter;font-weight:800;font-size:34px;line-height:1.3;margin-top:22px">${esc(d.pega)}</div></div>
    <div style="position:absolute;left:80px;right:80px;bottom:340px;display:flex;justify-content:space-between;align-items:center">${marca(false)}${cta(d.cta, C.navy, '#fff')}</div>`,

  tabela: (d, W, H) => `<div style="position:absolute;inset:0;background:${C.papel}"></div>` + caixa(H, 'gap:40px', `
    <div style="${T};font-size:120px;color:${C.navy}">${hl(d.titulo, C.ouro2)}</div>
    <div style="border-radius:30px;overflow:hidden;border:3px solid ${C.navy};font-family:Inter">
      <div style="display:grid;grid-template-columns:230px 1fr 1fr;background:${C.navy};color:${C.creme};font-weight:800;font-size:38px">${d.cab.map((c) => `<div style="padding:26px 24px">${esc(c)}</div>`).join('')}</div>
      ${d.linhas.map((l, i) => `<div style="display:grid;grid-template-columns:230px 1fr 1fr;background:${i % 2 ? '#fff' : '#FBF6E7'};font-size:36px;line-height:1.3;color:${C.tinta}">${l.map((c, k) => `<div style="padding:28px 24px;${k === 0 ? `font-weight:800;color:${C.ouro2}` : ''};border-left:${k ? '2px solid ' + C.linha : '0'}">${esc(c)}</div>`).join('')}</div>`).join('')}
    </div>
    <div style="${MONO};font-size:28px;color:${C.cinza}">${esc(d.n)}</div>
    <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center">${marca(false)}${cta(d.cta, C.navy, '#fff')}</div>`),

  flashcard: (d, W, H) => `<div style="position:absolute;inset:0;background:linear-gradient(160deg,${C.navy2},${C.navy})"></div>
    <div style="position:absolute;left:90px;right:150px;top:300px;height:600px;background:#fff;border-radius:36px;transform:rotate(-3deg);padding:60px;box-shadow:0 40px 80px rgba(0,0,0,.4);display:flex;flex-direction:column"><div style="${MONO};font-size:26px;color:${C.cinza};letter-spacing:.12em">FRENTE · ${esc(d.n)}</div><div style="font-family:Inter;font-weight:800;font-size:58px;line-height:1.22;color:${C.tinta};margin-top:34px">${esc(d.frente)}</div><div style="margin-top:auto;font-family:Caveat;font-size:48px;color:${C.ouro2}">vira o card ↓</div></div>
    <div style="position:absolute;left:150px;right:90px;top:940px;height:560px;background:${C.ouro};border-radius:36px;transform:rotate(2deg);padding:60px;box-shadow:0 40px 80px rgba(0,0,0,.4);display:flex;flex-direction:column;color:${C.navy}"><div style="${MONO};font-size:26px;letter-spacing:.12em">VERSO</div><div style="font-family:Inter;font-weight:800;font-size:54px;line-height:1.22;margin-top:30px">${esc(d.verso)}</div><div style="font-family:Inter;font-size:36px;line-height:1.4;margin-top:24px">${esc(d.obs)}</div></div>
    <div style="position:absolute;left:80px;right:80px;bottom:340px;display:flex;justify-content:space-between;align-items:center">${marca(true)}${cta(d.cta)}</div>`,

  lacuna: (d, W, H) => { let i = 0; const f = esc(d.frase).replace(/____/g, () => `<span style="display:inline-block;min-width:200px;border-bottom:8px solid ${C.ouro};margin:0 8px;color:transparent">${'x'.repeat(6)}</span>`);
    return `<div style="position:absolute;inset:0;${fundoNavy}"></div>` + caixa(H, 'gap:40px', `
    ${selo('Complete a frase')}
    <div style="font-family:Inter;font-weight:800;font-size:76px;line-height:1.45">${f}</div>
    <div style="font-family:Caveat;font-size:60px;color:${C.creme}">resposta ↓ (sem colar)</div>
    <div style="display:flex;flex-wrap:wrap;gap:16px">${d.resp.map((r, k) => `<span style="font-family:Inter;font-weight:800;font-size:44px;background:rgba(242,222,158,.14);border:3px dashed ${C.creme};border-radius:18px;padding:16px 24px;color:${C.creme}">${k + 1}. ${esc(r)}</span>`).join('')}</div>
    <div style="${MONO};font-size:28px;color:rgba(255,255,255,.6)">${esc(d.n)}</div>
    <div style="margin-top:auto;display:flex;flex-direction:column;gap:30px;align-items:flex-start">${cta(d.cta)}${marca(true)}</div>`); },

  agenda: (d, W, H) => `<div style="position:absolute;inset:0;background:#fff"></div>` + caixa(H, 'gap:30px', `
    <div style="display:flex;justify-content:space-between;align-items:flex-end"><div style="${T};font-size:130px;color:${C.navy}">${esc(d.titulo)}</div>${selo(C.selo)}</div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px">${d.dias.map(([n, m, q]) => `<div style="border:3px solid ${C.linha};border-radius:26px;overflow:hidden;font-family:Inter"><div style="background:${C.navy};color:${C.creme};${MONO};font-weight:700;font-size:26px;padding:12px 20px">DIA ${n}</div><div style="padding:22px 20px;min-height:190px;display:flex;flex-direction:column"><div style="font-weight:800;font-size:23px;line-height:1.15;color:${C.tinta}">${esc(m)}</div><div style="margin-top:auto;${T};font-size:76px;color:${C.ouro}">${q}<span style="font-family:Inter;font-weight:600;font-size:24px;color:${C.cinza};text-transform:none;margin-left:8px">dicas</span></div></div></div>`).join('')}</div>
    <div style="font-family:Inter;font-weight:600;font-size:36px;line-height:1.4;color:${C.tinta}">${esc(d.rodape)}</div>
    <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center">${marca(false)}${cta(d.cta, C.navy, '#fff')}</div>`),

  regua: (d, W, H) => `<div style="position:absolute;inset:0;background:${C.ouro}"></div><div style="position:absolute;right:0;top:0;bottom:0;width:130px;background:${C.navy};background-image:repeating-linear-gradient(${C.navy} 0 38px,${C.creme} 38px 42px)"></div>
    <div style="position:absolute;left:80px;right:200px;top:260px;bottom:340px;display:flex;flex-direction:column;color:${C.navy}">
      <div style="${T};font-size:560px;line-height:.8">${esc(d.n)}</div><div style="${T};font-size:150px">${esc(d.titulo)}</div>
      <div style="font-family:Inter;font-weight:700;font-size:48px;line-height:1.3;margin-top:40px">${esc(d.sub)}</div>
      <div style="font-family:Inter;font-size:38px;line-height:1.4;margin-top:26px">${esc(d.extra)}</div>
      <div style="margin-top:auto;display:flex;flex-direction:column;gap:30px;align-items:flex-start">${cta(d.cta, C.navy, '#fff')}${marca(false)}</div></div>`,

  produto: (d, W, H) => `<div style="position:absolute;inset:0;${fundoNavy}"></div>` + caixa(H, 'gap:24px', `
    <div style="display:flex;justify-content:space-between;align-items:center">${marca(true)}${selo(d.selo)}</div>
    <div style="${T};font-size:150px;margin-top:20px">${esc(d.titulo)}</div>
    <div style="display:grid;grid-template-columns:440px 1fr;gap:20px;align-items:center;flex:1">
      <div style="display:grid;gap:22px">${d.itens.map((t) => `<div style="display:flex;gap:16px;font-family:Inter;font-weight:600;font-size:34px;line-height:1.25"><span style="color:${C.ouro}">✔</span>${esc(t)}</div>`).join('')}</div>
      ${img('mockup') ? `<img src="${img('mockup')}" style="width:520px;filter:drop-shadow(0 40px 60px rgba(0,0,0,.5))">` : `<div style="position:relative;height:560px"><img src="${img('capa2')}" style="position:absolute;right:0;top:20px;width:300px;border-radius:10px;transform:rotate(7deg);box-shadow:0 30px 60px rgba(0,0,0,.5)"><img src="${img('capa1')}" style="position:absolute;left:10px;top:0;width:320px;border-radius:10px;transform:rotate(-5deg);box-shadow:0 30px 60px rgba(0,0,0,.5)"></div>`}</div>
    <div style="display:flex;align-items:flex-end;justify-content:space-between"><div style="display:flex;align-items:baseline;gap:10px"><span style="font-family:Inter;font-weight:800;font-size:44px">R$</span><span style="${T};font-size:170px;color:${C.creme}">${esc(d.preco)}</span></div>${cta(d.cta)}</div>`),

  painel: (d, W, H) => `<div style="position:absolute;inset:0;background:${C.papel}"></div>
    <div style="position:absolute;left:80px;right:80px;top:260px"><div style="${T};font-size:118px;color:${C.navy}">${hl(d.titulo, C.ouro2)}</div></div>
    <div style="position:absolute;left:140px;right:140px;top:600px;height:680px;overflow:hidden;border-radius:24px;box-shadow:0 30px 60px rgba(11,22,51,.3);transform:rotate(-2deg)"><img src="${img('painel')}" style="width:100%;margin-top:-80px"></div>
    <div style="position:absolute;left:80px;right:80px;top:1330px;font-family:Inter;font-size:36px;line-height:1.4;color:${C.tinta}">${esc(d.sub)}</div>
    <div style="position:absolute;left:80px;right:80px;bottom:300px;display:flex;justify-content:space-between;align-items:center">${marca(false)}${cta(d.cta, C.navy, '#fff')}</div>`,

  pagina: (d, W, H) => `<div style="position:absolute;inset:0;background:${C.navy}"></div>
    <div style="position:absolute;left:80px;right:80px;top:70px;${T};font-size:100px;color:#fff">${hl(d.titulo, C.creme)}</div>
    <div style="position:absolute;left:80px;width:560px;top:300px;height:860px;overflow:hidden;border-radius:16px;box-shadow:0 30px 60px rgba(0,0,0,.5);transform:rotate(-2deg);background:#fff"><img src="${img('parte1')}" style="width:150%;margin-left:-6%;margin-top:-26%"></div>
    <div style="position:absolute;right:60px;width:340px;top:380px;display:grid;gap:70px">${d.notas.map((t, i) => `<div style="font-family:Caveat;font-weight:700;font-size:54px;line-height:1.05;color:${C.creme}"><span style="${T};font-size:70px;color:${C.ouro};margin-right:10px">${i + 1}</span>${esc(t)}</div>`).join('')}</div>
    <div style="position:absolute;left:80px;right:80px;bottom:70px;display:flex;justify-content:space-between;align-items:center">${marca(true)}${cta(d.cta)}</div>`,

  partes: (d, W, H) => `<div style="position:absolute;inset:0;${fundoNavy}"></div>
    <div style="position:absolute;left:80px;right:80px;top:260px;${T};font-size:130px">${hl(d.titulo, C.creme)}</div>
    ${[['parte1', d.p1, 90, -4], ['parte2', d.p2, 560, 4]].map(([f, t, x, r]) => `<div style="position:absolute;left:${x}px;top:660px;width:430px"><div style="height:600px;overflow:hidden;border-radius:14px;box-shadow:0 30px 60px rgba(0,0,0,.5);transform:rotate(${r}deg);background:#fff"><img src="${img(f)}" style="width:100%"></div><div style="margin-top:40px;font-family:Inter;font-weight:800;font-size:40px;color:${C.creme}">${esc(t[0])}</div><div style="${MONO};font-size:30px;color:rgba(255,255,255,.75)">${esc(t[1])}</div></div>`).join('')}
    <div style="position:absolute;left:80px;right:80px;top:1440px;font-family:Inter;font-weight:600;font-size:40px;line-height:1.35">${esc(d.sub)}</div>
    <div style="position:absolute;left:80px;right:80px;bottom:300px;display:flex;justify-content:space-between;align-items:center">${marca(true)}${cta(d.cta)}</div>`,

  meme: (d, W, H) => `<div style="position:absolute;inset:0;background:#fff"></div>` + caixa(H, 'gap:24px', `
    ${d.linhas.map((t, i) => `<div style="font-family:Inter;font-weight:${i === 2 ? 800 : 600};font-size:${i === 2 ? 64 : 54}px;line-height:1.25;color:#111">${esc(t)}</div>`).join('')}
    <div style="flex:1;margin:20px 0;border-radius:30px;background:${C.navy};display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden">
      <div style="${T};font-size:300px;color:rgba(242,222,158,.15);position:absolute">CPC</div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:10px;position:relative"><div style="font-size:180px">📚😵‍💫</div><div style="${MONO};font-size:34px;color:${C.creme}">art. 1º... art. 2º... art. 3º...</div></div></div>
    <div style="font-family:Inter;font-weight:800;font-size:46px;line-height:1.3;color:${C.navy}">${esc(d.virada)}</div>
    <div style="display:flex;justify-content:space-between;align-items:center">${marca(false)}${cta(d.cta, C.navy, '#fff')}</div>`),

  post: (d, W, H) => `<div style="position:absolute;inset:0;background:#F2F3F5"></div>
    <div style="position:absolute;left:70px;right:70px;top:110px;background:#fff;border-radius:34px;padding:56px;box-shadow:0 10px 40px rgba(0,0,0,.08);font-family:Inter">
      <div style="display:flex;align-items:center;gap:22px"><div style="width:96px;height:96px">${SIMB}</div><div><div style="font-weight:800;font-size:40px;color:#0F1419">${esc(d.autor)} <span style="color:#1D9BF0">●</span></div><div style="font-size:32px;color:#536471">${esc(d.user)}</div></div></div>
      <div style="font-size:44px;line-height:1.42;color:#0F1419;margin-top:36px">${esc(d.texto).replace(/\n/g, '<br>')}</div>
      <div style="display:flex;gap:60px;margin-top:40px;font-size:30px;color:#536471;border-top:2px solid #EFF3F4;padding-top:28px"><span>💬 Responder</span><span>🔁 Repostar</span><span>🔖 Salvar</span></div>
    </div>
    <div style="position:absolute;left:80px;right:80px;bottom:80px;display:flex;justify-content:space-between;align-items:center"><div style="font-family:Inter;font-weight:700;font-size:34px;color:${C.navy}">Revisão em Dicas · ENAM 2026.2</div>${cta(d.cta, C.navy, '#fff')}</div>`,

  lockscreen: (d, W, H) => `<div style="position:absolute;inset:0;background:radial-gradient(90% 60% at 30% 20%,${C.navy2},transparent 70%),radial-gradient(80% 60% at 90% 80%,${C.ouro2},transparent 70%),${C.navy}"></div>
    <div style="position:absolute;left:0;right:0;top:260px;text-align:center;color:#fff;font-family:Inter"><div style="font-size:40px;font-weight:600;opacity:.85">${esc(d.data)}</div><div style="font-size:230px;font-weight:700;letter-spacing:-.04em;line-height:1">${esc(d.hora)}</div></div>
    <div style="position:absolute;left:60px;right:60px;top:640px;display:grid;gap:20px">${d.notifs.map(([a, t, h]) => `<div style="background:rgba(255,255,255,.78);backdrop-filter:blur(20px);border-radius:36px;padding:28px 32px;display:grid;grid-template-columns:76px 1fr;gap:22px;align-items:center;font-family:Inter;color:#111"><div style="width:76px;height:76px;border-radius:18px;background:#fff;display:grid;place-items:center;font-size:44px">✅</div><div><div style="display:flex;justify-content:space-between;font-size:28px;color:#555"><b>${esc(a)}</b><span>${esc(h)}</span></div><div style="font-size:36px;line-height:1.3;margin-top:6px;font-weight:600">${esc(t)}</div></div></div>`).join('')}</div>
    <div style="position:absolute;left:80px;right:80px;top:1190px;${T};font-size:104px;color:#fff">${hl(d.titulo, C.creme)}</div>
    <div style="position:absolute;left:80px;right:80px;bottom:340px;display:flex;justify-content:space-between;align-items:center">${marca(true)}${cta(d.cta)}</div>`,

  rosca: (d, W, H) => { const r = 300, c = 2 * Math.PI * r; return `<div style="position:absolute;inset:0;${fundoNavy}"></div>
    <svg style="position:absolute;left:190px;top:300px" width="700" height="700" viewBox="0 0 700 700"><circle cx="350" cy="350" r="${r}" fill="none" stroke="rgba(242,222,158,.15)" stroke-width="80"/><circle cx="350" cy="350" r="${r}" fill="none" stroke="${C.ouro}" stroke-width="80" stroke-dasharray="${c * d.pct / 100} ${c}" transform="rotate(-90 350 350)" stroke-linecap="butt"/></svg>
    <div style="position:absolute;left:190px;top:300px;width:700px;height:700px;display:grid;place-items:center;${T};font-size:260px;color:${C.creme}">${d.pct}%</div>
    <div style="position:absolute;left:80px;right:80px;top:1060px;${T};font-size:120px">${hl(d.titulo, C.creme)}</div>
    <div style="position:absolute;left:80px;right:80px;top:1330px;font-family:Inter;font-size:40px;line-height:1.4;color:rgba(255,255,255,.88)">${esc(d.sub)}<div style="${MONO};font-size:24px;color:rgba(255,255,255,.55);margin-top:16px">${esc(d.fonte)}</div></div>
    <div style="position:absolute;left:80px;right:80px;bottom:340px;display:flex;justify-content:space-between;align-items:center">${marca(true)}${cta(d.cta)}</div>`; },

  postits: (d, W, H) => { const cores = ['#FFE979', '#FFC2D1', '#B8F0C8', '#BFE3FF', '#FFD59E', '#E3D4FF']; const rot = [-3, 2, -1.5, 3, -2.5, 1.5];
    return `<div style="position:absolute;inset:0;background:#C8A57A;background-image:radial-gradient(rgba(0,0,0,.08) 2px,transparent 2px);background-size:22px 22px"></div>
    <div style="position:absolute;left:70px;right:70px;top:60px;background:${C.navy};border-radius:24px;padding:26px 36px;${T};font-size:78px;color:#fff;text-align:center">${esc(d.titulo)}</div>
    <div style="position:absolute;left:70px;right:70px;top:250px;display:grid;grid-template-columns:repeat(3,1fr);gap:30px">${d.notas.map((t, i) => `<div style="background:${cores[i % 6]};min-height:400px;padding:36px 30px;transform:rotate(${rot[i % 6]}deg);box-shadow:0 14px 24px rgba(0,0,0,.25);font-family:Kalam;font-weight:700;font-size:40px;line-height:1.2;color:#222;position:relative"><div style="position:absolute;top:-16px;left:50%;width:34px;height:34px;border-radius:50%;background:#D63A3A;transform:translateX(-50%);box-shadow:0 4px 6px rgba(0,0,0,.3)"></div>${esc(t)}</div>`).join('')}</div>
    <div style="position:absolute;left:70px;right:70px;bottom:70px;background:#fff;border-radius:28px;padding:22px 26px;display:flex;justify-content:space-between;align-items:center">${marca(false, 46)}${cta(d.cta, C.navy, '#fff')}</div>`; },

  terminal: (d, W, H) => `<div style="position:absolute;inset:0;background:#05070F"></div>
    <div style="position:absolute;left:60px;right:60px;top:260px;border-radius:26px;overflow:hidden;border:2px solid #222A44">
      <div style="background:#161C30;padding:20px 26px;display:flex;gap:14px"><i style="width:24px;height:24px;border-radius:50%;background:#FF5F56;display:block"></i><i style="width:24px;height:24px;border-radius:50%;background:#FFBD2E;display:block"></i><i style="width:24px;height:24px;border-radius:50%;background:#27C93F;display:block"></i></div>
      <div style="background:#0B1020;padding:40px 36px;${MONO};font-size:36px;line-height:1.75;color:#C9D3F0">${d.linhas.map((l, i) => `<div style="color:${i === 0 ? C.creme : i === d.linhas.length - 1 ? '#5EF0A0' : l.includes('[s/N]') ? '#FF8A70' : '#C9D3F0'}">${esc(l)}</div>`).join('')}<span style="display:inline-block;width:22px;height:42px;background:${C.creme};vertical-align:middle"></span></div>
    </div>
    <div style="position:absolute;left:80px;right:80px;top:1150px;${T};font-size:140px;color:#fff">${hl(d.titulo, C.creme)}</div>
    <div style="position:absolute;left:80px;right:80px;bottom:340px;display:flex;justify-content:space-between;align-items:center">${marca(true)}${cta(d.cta)}</div>`,

  embarque: (d, W, H) => `<div style="position:absolute;inset:0;${fundoNavy}"></div>
    <div style="position:absolute;left:80px;right:80px;top:80px;${T};font-size:110px">${hl(d.titulo, C.creme)}</div>
    <div style="position:absolute;left:70px;right:70px;top:340px;height:680px;background:#fff;border-radius:34px;display:grid;grid-template-columns:1fr 250px;overflow:hidden;color:${C.tinta};box-shadow:0 40px 80px rgba(0,0,0,.45)">
      <div style="padding:46px 50px;display:flex;flex-direction:column;gap:26px">
        <div style="display:flex;justify-content:space-between;${MONO};font-size:24px;color:${C.cinza}"><span>CARTÃO DE EMBARQUE</span><span>REVISÃO EM DICAS</span></div>
        <div style="display:flex;align-items:center;gap:30px"><div style="${T};font-size:150px">${esc(d.de)}</div><div style="font-size:70px">✈</div><div style="${T};font-size:150px;color:${C.ouro2}">${esc(d.para)}</div></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:26px 30px">${d.campos.map(([a, b]) => `<div><div style="${MONO};font-size:22px;color:${C.cinza}">${esc(a).toUpperCase()}</div><div style="font-family:Inter;font-weight:800;font-size:44px">${esc(b)}</div></div>`).join('')}</div>
      </div>
      <div style="border-left:4px dashed ${C.linha};background:${C.ouro};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;color:${C.navy}"><div style="${T};font-size:60px;writing-mode:vertical-rl;transform:rotate(180deg)">ENAM 2026.2</div><div style="width:150px;height:150px;background:repeating-linear-gradient(90deg,${C.navy} 0 6px,transparent 6px 10px),repeating-linear-gradient(0deg,${C.navy} 0 6px,transparent 6px 12px);opacity:.85"></div></div>
    </div>
    <div style="position:absolute;left:80px;right:80px;bottom:80px;display:flex;justify-content:space-between;align-items:center">${marca(true)}${cta(d.cta)}</div>`,

  lista: (d, W, H) => `<div style="position:absolute;inset:0;background:${C.papel}"></div>` + caixa(H, 'gap:26px', `
    <div style="${T};font-size:130px;color:${C.navy}">${hl(d.titulo, '#C0392B')}</div>
    ${d.itens.map(([t, n], i) => `<div style="display:grid;grid-template-columns:90px 1fr auto;gap:22px;align-items:center;background:#fff;border:3px solid ${C.linha};border-radius:28px;padding:26px 30px"><div style="${T};font-size:84px;color:${C.ouro}">${i + 1}</div><div style="font-family:Inter;font-weight:800;font-size:40px;line-height:1.2;color:${C.tinta}">${esc(t)}</div><div style="${MONO};font-size:24px;color:${C.ouro2};background:${C.chip};border-radius:10px;padding:8px 12px">dica ${esc(n)}</div></div>`).join('')}
    <div style="font-family:Inter;font-weight:600;font-size:38px;color:${C.tinta}">${esc(d.sub)}</div>
    <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center">${marca(false)}${cta(d.cta, C.navy, '#fff')}</div>`),

  playlist: (d, W, H) => `<div style="position:absolute;inset:0;background:linear-gradient(180deg,#5A4710 0%,#191814 55%,#111 100%)"></div>
    <div style="position:absolute;left:80px;right:80px;top:250px;display:flex;gap:40px;align-items:flex-end"><div style="width:330px;height:330px;flex:0 0 auto;border-radius:16px;overflow:hidden;box-shadow:0 30px 60px rgba(0,0,0,.5);background:${C.navy};display:flex;flex-direction:column;justify-content:flex-end;padding:30px"><div style="${T};font-size:120px;color:${C.creme}">320</div><div style="${T};font-size:52px;color:#fff">dicas · ENAM</div></div>
      <div style="font-family:Inter;color:#fff"><div style="font-size:26px;font-weight:700">PLAYLIST</div><div style="font-weight:800;font-size:84px;letter-spacing:-.03em;line-height:1">${esc(d.titulo)}</div><div style="font-size:30px;opacity:.75;margin-top:14px">${esc(d.sub)}</div></div></div>
    <div style="position:absolute;left:80px;right:80px;top:650px;display:flex;align-items:center;gap:30px"><div style="width:120px;height:120px;border-radius:50%;background:${C.ouro};display:grid;place-items:center"><svg width="56" height="56" viewBox="0 0 24 24"><path d="M7 4v16l13-8z" fill="${C.navy}"/></svg></div><div style="font-size:54px;color:rgba(255,255,255,.7)">🔀 ⬇ ⋯</div></div>
    <div style="position:absolute;left:80px;right:80px;top:800px;display:grid;gap:0;font-family:Inter">${d.faixas.map(([m, q], i) => `<div style="display:grid;grid-template-columns:60px 1fr auto;gap:20px;align-items:center;padding:8px 0"><div style="font-size:32px;color:rgba(255,255,255,.6)">${i + 1}</div><div><div style="font-weight:700;font-size:36px;color:${i === 0 ? C.ouro : '#fff'}">${esc(m)}</div><div style="font-size:24px;color:rgba(255,255,255,.6)">Líbero Filho</div></div><div style="font-size:32px;color:rgba(255,255,255,.6)">${q} dicas</div></div>`).join('')}</div>
    <div style="position:absolute;left:80px;right:80px;bottom:340px;display:flex;justify-content:space-between;align-items:center">${marca(true)}${cta(d.cta)}</div>`,

  pergunta: (d, W, H) => `<div style="position:absolute;inset:0;background:${C.ouro}"></div>` + caixa(H, 'gap:40px', `
    <div>${marca(false)}</div>
    <div style="${T};font-size:190px;color:${C.navy};margin-top:40px">${hl(d.titulo, '#fff')}</div>
    <div style="font-family:Inter;font-weight:700;font-size:54px;line-height:1.3;color:${C.navy}">${esc(d.sub)}</div>
    <div style="margin-top:auto">${cta(d.cta, C.navy, '#fff')}</div>`),

  faq: (d, W, H) => `<div style="position:absolute;inset:0;background:#fff"></div>` + caixa(H, 'gap:30px', `
    <div style="${MONO};font-size:28px;letter-spacing:.12em;color:${C.ouro2}">PERGUNTA SINCERA, RESPOSTA SINCERA</div>
    <div style="align-self:flex-end;max-width:85%;background:${C.navy};color:#fff;border-radius:40px;border-bottom-right-radius:10px;padding:36px 42px;font-family:Inter;font-weight:700;font-size:50px;line-height:1.25">${esc(d.pergunta)}</div>
    <div style="max-width:90%;background:${C.papel};border:3px solid ${C.linha};color:${C.tinta};border-radius:40px;border-bottom-left-radius:10px;padding:36px 42px;font-family:Inter;font-size:42px;line-height:1.4">${esc(d.resposta)}</div>
    <div style="display:grid;gap:14px;margin-top:10px">${d.extra.map((t) => `<div style="font-family:Inter;font-weight:600;font-size:34px;color:${C.tinta}"><span style="color:${C.ouro}">✔</span> ${esc(t)}</div>`).join('')}</div>
    <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center">${marca(false)}${cta(d.cta, C.navy, '#fff')}</div>`),

  sumario: (d, W, H) => `<div style="position:absolute;inset:0;background:#FBF8F0"></div><div style="position:absolute;left:0;top:0;bottom:0;width:40px;background:${C.navy}"></div>` + caixa(H, 'gap:0', `
    <div style="${MONO};font-size:28px;letter-spacing:.14em;color:${C.ouro2}">${C.rot}</div>
    <div style="font-family:Georgia,serif;font-style:italic;font-size:140px;color:${C.navy};margin:20px 0 30px">${esc(d.titulo)}</div>
    ${d.linhas.map(([m, n], i) => `<div style="display:flex;align-items:baseline;gap:16px;padding:18px 0;font-family:Inter;font-size:44px;color:${C.tinta};${i === d.linhas.length - 1 ? 'font-weight:800' : ''}"><span>${esc(m)}</span><span style="flex:1;border-bottom:4px dotted #B9B2A0;transform:translateY(-10px)"></span><span style="${MONO};font-weight:700;color:${C.ouro2}">${esc(n)}</span></div>`).join('')}
    <div style="font-family:Inter;font-size:36px;color:${C.cinza};margin-top:24px">${esc(d.sub)}</div>
    <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center">${marca(false)}${cta(d.cta, C.navy, '#fff')}</div>`),

  amostra: (d, W, H) => `<div style="position:absolute;inset:0;${fundoNavy}"></div>` + caixa(H, 'gap:28px', `
    <div style="${T};font-size:116px">${hl(d.titulo, C.creme)}</div>
    ${d.dicas.map(([n, t]) => `<div style="background:#fff;color:${C.tinta};border-radius:28px;padding:30px 34px;display:grid;grid-template-columns:auto 1fr;gap:26px;align-items:center"><div style="${T};font-size:90px;color:${C.ouro}">${n}</div><div style="font-family:Inter;font-weight:800;font-size:38px;line-height:1.28">${esc(t)}</div></div>`).join('')}
    <div style="font-family:Inter;font-weight:700;font-size:44px;color:${C.creme}">${esc(d.sub)}</div>
    <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center">${marca(true)}${cta(d.cta)}</div>`),
};

const navegador = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, proxy: process.env.RENDER_PROXY ? { server: process.env.RENDER_PROXY } : undefined });
const pg = await navegador.newPage({ deviceScaleFactor: 1 });
const lista = [];
let i = 0;
for (const d of dados) {
  i++;
  const num = String(i).padStart(2, '0');
  const arq = `${num}-${d.nome}-${d.formato}.png`;
  if (SO.length && !SO.includes(num) && !SO.includes(d.nome)) continue;
  const W = 1080, H = d.formato === 'story' ? 1920 : 1350;
  if (!L[d.layout]) { console.error('layout desconhecido:', d.layout); continue; }
  const html = `<!doctype html><html><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet"><style>*{box-sizing:border-box}body{margin:0}</style></head><body><div id="a" style="position:relative;width:${W}px;height:${H}px;overflow:hidden;color:#fff">${L[d.layout](d, W, H)}</div></body></html>`;
  const tmp = resolve(SAIDA, '_tmp.html'); writeFileSync(tmp, html);
  await pg.setViewportSize({ width: W, height: H });
  await pg.goto(pathToFileURL(tmp).href, { waitUntil: 'networkidle' });
  await pg.evaluate(() => document.fonts.ready);
  await pg.locator('#a').screenshot({ path: resolve(SAIDA, arq) });
  lista.push(arq); console.log(arq);
}
await navegador.close();

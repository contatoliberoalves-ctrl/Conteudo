// Kit do produto "ENAM 2026.2 · Revisão em Dicas" (identidade, imagens da Kiwify) e criativos de divulgação
// (2 carrosséis, telas únicas e stories formais). O texto das dicas mostradas vem de privado/ (fora do git);
// as imagens dos PDFs vêm de saida/enam e saida/enam2 (rode antes `node dicas.mjs enam` e `node dicas.mjs enam2`).
// Uso: node produto_enam.mjs [filtro]  -> saida/produto-enam/<grupo>/<peça>.png
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { COR, FONTES, esc } from './template.mjs';
const req = createRequire(import.meta.url);
let chromium; try { ({ chromium } = req('playwright')); } catch { ({ chromium } = req('/opt/node-tools/node_modules/playwright')); }

const root = path.dirname(new URL(import.meta.url).pathname);
const filtro = process.argv[2] || '';
const PRECO = 'R$ 49,99';
const lerDicas = id => fs.readdirSync(path.join(root, 'privado')).filter(f => new RegExp(`^${id}-\\d+\\.json$`).test(f)).sort()
  .flatMap(f => JSON.parse(fs.readFileSync(path.join(root, 'privado', f), 'utf8'))).flatMap(s => s.dicas.map(d => ({ ...d, materia: s.materia })));
const D1 = lerDicas('enam'), D2 = lerDicas('enam2');
const dica = n => D1.find(d => d.n === n), explicada = n => D2.find(d => d.n === n);
const mapa = JSON.parse(fs.readFileSync(path.join(root, 'privado', 'enam-meta.json'), 'utf8')).mapa;
const pg = (id, n) => 'file://' + path.join(root, 'saida', id, `${n}.png`);
const foto = n => 'file://' + path.join(root, '..', 'carrossel-nativo', 'fotos', n);

const T = "font-family:'Big Shoulders Display',sans-serif;font-weight:900;text-transform:uppercase;letter-spacing:-.005em;line-height:.88";
const S = "font-family:'Sora',sans-serif", I = "font-family:'Inter',sans-serif", MO = "font-family:'JetBrains Mono',monospace";
const tres = n => String(n).padStart(3, '0');
let gid = 0;
const simbolo = px => { const id = `g${++gid}`; return `<svg width="${px}" height="${px}" viewBox="0 0 100 100" style="flex:none;display:block"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#00B85A"/><stop offset=".55" stop-color="#009A8C"/><stop offset="1" stop-color="#14E6DA"/></linearGradient></defs><rect x="2" y="2" width="96" height="96" rx="28" fill="url(#${id})"/><path d="M32 22 V70 H70" fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/><path d="M46 46 l9 9 l18 -20" fill="none" stroke="#b9fff1" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>`; };
const marca = (px, escuro = true) => `<div style="display:inline-flex;align-items:center;gap:${px * .3}px">${simbolo(px * 1.25)}<div style="display:flex;flex-direction:column;line-height:1"><span style="${S};font-weight:600;font-size:${px * .36}px;letter-spacing:.22em;text-transform:uppercase;color:${escuro ? COR.menta : COR.verde2}">Concurso com</span><span style="${S};font-weight:800;font-size:${px}px;letter-spacing:-.03em;color:${escuro ? '#fff' : COR.tinta}">Líbero</span></div></div>`;
const RUIDO = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;
const textura = escuro => `<div style="position:absolute;inset:0;pointer-events:none;background-image:${RUIDO};opacity:${escuro ? .08 : .05};z-index:30"></div>`;
const FUNDO = `radial-gradient(80% 60% at 100% 0%,rgba(0,210,200,.28),transparent 70%),radial-gradient(70% 55% at 0% 100%,rgba(0,166,81,.35),transparent 70%),${COR.petroleo2}`;

// Peças básicas ---------------------------------------------------------------------------------------------
const pill = (t, escuro = true, px = 22) => `<span style="${MO};font-weight:800;font-size:${px}px;letter-spacing:.08em;text-transform:uppercase;padding:${px * .45}px ${px * .8}px;border-radius:999px;white-space:nowrap;${escuro ? `border:2px solid rgba(185,255,241,.45);color:${COR.menta}` : `border:2px solid ${COR.verde};color:${COR.verde2};background:#fff`}">${t}</span>`;
const chip = (t, px = 18) => `<span style="${MO};font-weight:700;font-size:${px}px;color:${COR.verde2};background:#E7F6EE;border-radius:8px;padding:${px * .3}px ${px * .6}px;display:inline-block">§ ${esc(t)}</span>`;
// Lockup do produto: rótulo do exame + REVISÃO EM DICAS + assinatura.
const lockup = (px, escuro = true, sub = 'por Líbero Filho', linha2 = 'em dicas') => `<div style="display:flex;flex-direction:column;align-items:flex-start;gap:${px * .14}px">
  <span style="${MO};font-weight:800;font-size:${px * .2}px;letter-spacing:.12em;color:${COR.petroleo2};background:${COR.verde};padding:${px * .06}px ${px * .16}px;border-radius:${px * .08}px">ENAM 2026.2</span>
  <div style="${T};font-size:${px}px;color:${escuro ? '#fff' : COR.tinta}">Revisão<br><span style="color:${escuro ? COR.menta : COR.verde}">${linha2}</span></div>
  ${sub ? `<span style="${S};font-weight:600;font-size:${px * .17}px;color:${escuro ? 'rgba(255,255,255,.75)' : COR.cinza}">${sub}</span>` : ''}</div>`;
// Cartão de dica no visual do PDF; com "explicacao" mostra o texto da Parte 2.
const cartao = (d, { w = 820, px = 30, explicacao = false, sombra = true } = {}) => `<div style="width:${w}px;background:#fff;border-radius:${px * .7}px;border:2px solid ${COR.linha};padding:${px * .8}px ${px}px;display:grid;grid-template-columns:${px * 2.6}px 1fr;gap:${px * .7}px;${sombra ? 'box-shadow:0 30px 60px -20px rgba(0,0,0,.45)' : ''}">
  <div style="${T};font-size:${px * 1.7}px;color:${COR.verde};line-height:1">${tres(d.n)}</div>
  <div><div style="${I};font-weight:800;font-size:${px}px;line-height:1.25;color:${COR.tinta}">${esc(d.d)}</div>
  ${explicacao ? `<div style="${I};font-size:${px * .62}px;line-height:1.5;color:#33504A;margin-top:${px * .45}px;text-align:justify">${esc(explicada(d.n).e)}</div>` : `<div style="${I};font-size:${px * .72}px;line-height:1.4;color:${COR.cinza};margin-top:${px * .3}px">${esc(d.e)}</div>`}
  <div style="margin-top:${px * .45}px">${chip(d.f || (explicada(d.n) || {}).f || '', px * .55)}</div></div></div>`;
// Página do PDF como objeto (sombra, cantos).
const pagina = (src, w, est = '') => `<img src="${src}" style="width:${w}px;height:${w * 1123 / 794}px;border-radius:${w * .012}px;box-shadow:0 ${w * .05}px ${w * .1}px -${w * .02}px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.06);display:block;${est}">`;
// Mockup das duas partes: Parte 2 atrás, Parte 1 na frente, páginas internas em leque.
const mockup = (w, { internas = true } = {}) => { const h = w * 1123 / 794; return `<div style="position:relative;width:${w * 1.75}px;height:${h * 1.12}px">
  ${internas ? `<div style="position:absolute;left:${w * .02}px;top:${h * .1}px;transform:rotate(-9deg)">${pagina(pg('enam', 3), w * .92)}</div>
  <div style="position:absolute;left:${w * .78}px;top:${h * .12}px;transform:rotate(8deg)">${pagina(pg('enam2', 3), w * .92)}</div>` : ''}
  <div style="position:absolute;left:${w * .62}px;top:${h * .02}px;transform:rotate(4deg)">${pagina(pg('enam2', 1), w)}</div>
  <div style="position:absolute;left:${w * .14}px;top:${h * .07}px;transform:rotate(-3deg)">${pagina(pg('enam', 1), w)}</div></div>`; };
const preco = (px, escuro = true) => `<div style="display:flex;align-items:baseline;gap:${px * .12}px;color:${escuro ? '#fff' : COR.tinta}"><span style="${S};font-weight:700;font-size:${px * .32}px">R$</span><span style="${T};font-size:${px}px;line-height:1">49,99</span></div>`;
const cta = (t, px = 30) => `<span style="display:inline-flex;align-items:center;gap:${px * .5}px;background:${COR.verde};color:#fff;${S};font-weight:800;font-size:${px}px;padding:${px * .6}px ${px * 1.1}px;border-radius:999px;box-shadow:0 14px 30px -10px rgba(0,166,81,.7)">${t}<svg width="${px}" height="${px}" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
const check = (t, escuro = true, px = 30) => `<div style="display:flex;gap:${px * .55}px;align-items:flex-start"><svg width="${px * 1.1}" height="${px * 1.1}" viewBox="0 0 24 24" style="flex:none;margin-top:${px * .05}px"><rect width="24" height="24" rx="7" fill="${COR.verde}"/><path d="M6.5 12.5l3.5 3.5 7.5-8" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg><span style="${I};font-weight:600;font-size:${px}px;line-height:1.3;color:${escuro ? '#fff' : COR.tinta}">${t}</span></div>`;
const rodape = (escuro = true, n = '', total = '') => `<div style="position:absolute;left:72px;right:72px;bottom:56px;display:flex;align-items:center;justify-content:space-between;z-index:5">${marca(30, escuro)}<span style="${MO};font-weight:700;font-size:22px;color:${escuro ? 'rgba(185,255,241,.7)' : COR.cinza}">${n ? `${n}/${total}` : '@concursocomlibero'}</span></div>`;
const numeroVazado = (t, px, cor = 'rgba(185,255,241,.18)') => `<div style="${T};font-size:${px}px;line-height:.8;color:transparent;-webkit-text-stroke:${px * .012}px ${cor}">${t}</div>`;
const tela = (w, h, fundo, conteudo, escuro = true) => `<div class="peca" style="position:relative;width:${w}px;height:${h}px;overflow:hidden;background:${fundo}">${conteudo}${textura(escuro)}</div>`;

const P = []; // {grupo, nome, w, h, html, transparente}
const CORES = JSON.parse(fs.readFileSync(path.join(root, 'privado', 'enam-meta.json'), 'utf8')).cores;
Object.assign(CORES, { '#33504A': '#454B5E', '#E7F6EE': '#F5ECD0' });
const trocar = h => { for (const [a, b] of Object.entries(CORES)) h = h.split(a).join(b); return h.split('background:#C9A227;color:#fff').join('background:#C9A227;color:#0B1633').split('color:#fff;background:#C9A227').join('color:#0B1633;background:#C9A227'); };
const add = (grupo, nome, w, h, html, transparente = false, escala = 1) => P.push({ grupo, nome, w, h, html: trocar(html), transparente, escala });

// =========================================================== KIT ===========================================
const cores = [['Marinho', COR.petroleo2, '#fff', 'fundo principal'], ['Dourado', COR.verde, '#fff', 'destaque, botões'], ['Ouro claro', COR.menta, COR.tinta, 'títulos no escuro'], ['Ouro médio', COR.ciano, COR.tinta, 'brilho, degradê'], ['Papel', COR.papel, COR.tinta, 'fundo claro'], ['Tinta', COR.tinta, '#fff', 'texto']];
add('kit', '01-identidade', 1080, 1350, tela(1080, 1350, COR.papel, `
  <div style="position:absolute;left:0;right:0;top:0;height:560px;background:${FUNDO};overflow:hidden">
    <div style="position:absolute;right:-30px;top:40px">${numeroVazado('320', 520)}</div>
    <div style="position:absolute;left:72px;top:64px;${MO};font-weight:700;font-size:20px;letter-spacing:.14em;color:${COR.menta}">IDENTIDADE VISUAL · PRODUTO</div>
    <div style="position:absolute;left:72px;top:130px">${lockup(150)}</div>
  </div>
  <div style="position:absolute;left:72px;right:72px;top:610px">
    <div style="${MO};font-weight:800;font-size:20px;letter-spacing:.14em;color:${COR.verde2};margin-bottom:18px">CORES</div>
    <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:12px">${cores.map(([n, c, t, u]) => `<div><div style="height:130px;border-radius:18px;background:${c};border:1.5px solid ${COR.linha};display:flex;align-items:flex-end;padding:12px;${MO};font-weight:700;font-size:17px;color:${t}">${c.toUpperCase()}</div><div style="${S};font-weight:700;font-size:19px;color:${COR.tinta};margin-top:10px">${n}</div><div style="${I};font-size:15px;color:${COR.cinza};line-height:1.3">${u}</div></div>`).join('')}</div>
    <div style="${MO};font-weight:800;font-size:20px;letter-spacing:.14em;color:${COR.verde2};margin:40px 0 16px">FONTES</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      ${[['Big Shoulders Display 900', `<span style="${T};font-size:58px">Títulos</span>`, 'títulos, números, sempre em caixa alta'], ['Inter 600 / 800', `<span style="${I};font-weight:800;font-size:40px;letter-spacing:-.01em">Texto da dica</span>`, 'texto corrido; a regra em negrito'], ['JetBrains Mono 700', `<span style="${MO};font-weight:700;font-size:30px;color:${COR.verde2}">§ art. 205</span>`, 'fundamento, rótulos, números de dica'], ['Sora 800', `<span style="${S};font-weight:800;font-size:40px;letter-spacing:-.03em">Líbero Filho</span>`, 'marca e assinatura']].map(([n, a, u]) => `<div style="background:#fff;border:1.5px solid ${COR.linha};border-radius:18px;padding:18px 22px;height:150px;display:flex;flex-direction:column;justify-content:space-between"><div style="color:${COR.tinta}">${a}</div><div><div style="${S};font-weight:700;font-size:17px;color:${COR.tinta}">${n}</div><div style="${I};font-size:15px;color:${COR.cinza}">${u}</div></div></div>`).join('')}
    </div>
  </div>`, false));

const d93 = dica(7);
add('kit', '02-elementos', 1080, 1350, tela(1080, 1350, COR.papel, `
  <div style="position:absolute;left:72px;right:72px;top:64px">
    <div style="${MO};font-weight:800;font-size:20px;letter-spacing:.14em;color:${COR.verde2}">ELEMENTOS</div>
    <div style="${T};font-size:76px;color:${COR.tinta};margin-top:10px">A dica é o <span style="color:${COR.verde}">personagem</span></div>
    <div style="margin-top:28px">${cartao(d93, { w: 936, px: 28, sombra: false })}</div>
    <div style="${I};font-size:17px;color:${COR.cinza};margin-top:10px">Cartão de dica: número em dourado, regra em negrito, explicação curta, fundamento em chip.</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:30px">
      <div style="border-radius:20px;background:${FUNDO};padding:26px;height:250px;position:relative;overflow:hidden">
        <div style="position:absolute;right:-10px;bottom:-30px">${numeroVazado('320', 240, 'rgba(185,255,241,.5)')}</div>
        <div style="display:flex;flex-wrap:wrap;gap:10px">${pill('320 dicas', true, 17)}${pill('8 disciplinas', true, 17)}${pill('Material próprio', true, 17)}</div>
        <div style="${I};font-size:16px;color:rgba(255,255,255,.75);position:absolute;left:26px;bottom:22px;width:230px">Número vazado e selos em contorno menta</div>
      </div>
      <div style="border-radius:20px;background:#fff;border:1.5px solid ${COR.linha};padding:26px;height:250px;display:flex;flex-direction:column;justify-content:space-between">
        ${preco(110, false)}${cta('Quero o material', 24)}
        <div style="${I};font-size:16px;color:${COR.cinza}">Preço em Big Shoulders; botão dourado com seta</div>
      </div>
    </div>
    <div style="${MO};font-weight:800;font-size:20px;letter-spacing:.14em;color:${COR.verde2};margin:34px 0 14px">TOM DE VOZ</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div style="background:#fff;border:1.5px solid ${COR.linha};border-left:8px solid ${COR.verde};border-radius:16px;padding:18px 22px;${I};font-size:20px;line-height:1.45;color:${COR.tinta}"><b>Use:</b> número, prazo e artigo. Frase curta. Exemplos reais de dica. "PEC: três quintos, dois turnos."</div>
      <div style="background:#fff;border:1.5px solid ${COR.linha};border-left:8px solid ${COR.erro};border-radius:16px;padding:18px 22px;${I};font-size:20px;line-height:1.45;color:${COR.tinta}"><b>Evite:</b> promessa de aprovação, "garantido", "método secreto", emoji em excesso, travessão.</div>
    </div>
    <div style="${MO};font-weight:800;font-size:20px;letter-spacing:.14em;color:${COR.verde2};margin:34px 0 14px">APLICAÇÃO NOS PDFS</div>
    <div style="display:flex;gap:18px">${[pg('enam', 1), pg('enam2', 1), pg('enam', 3), pg('enam', 40)].map(src => pagina(src, 220)).join('')}</div>
  </div>`, false));

add('kit', 'logo-produto-escuro', 1200, 560, `<div class="peca" style="width:1200px;height:560px;display:flex;align-items:center;padding-left:60px">${lockup(190, false, '')}</div>`, true);
add('kit', 'logo-produto-branco', 1200, 560, `<div class="peca" style="width:1200px;height:560px;display:flex;align-items:center;padding-left:60px">${lockup(190, true, '')}</div>`, true);

// ======================================================== KIWIFY ===========================================
add('kiwify', 'produto-1080x1080', 1080, 1080, tela(1080, 1080, FUNDO, `
  <div style="position:absolute;right:-40px;top:-10px">${numeroVazado('320', 560)}</div>
  <div style="position:absolute;left:70px;top:70px">${lockup(124)}</div>
  <div style="position:absolute;left:70px;top:470px;display:flex;flex-direction:column;gap:12px">${pill('Parte 1 · 320 dicas', true, 20)}${pill('Parte 2 · Explicadas', true, 20)}</div>
  <div style="position:absolute;left:400px;top:330px">${mockup(390)}</div>
  <div style="position:absolute;left:70px;bottom:64px">${marca(34)}</div>`));

const banner = (w, h, k) => tela(w, h, FUNDO, `
  <div style="position:absolute;right:${w * .3}px;top:${-h * .1}px">${numeroVazado('320', h * 1.3)}</div>
  <div style="position:absolute;left:${h * .14}px;top:50%;transform:translateY(-50%)">${lockup(h * .26 * k, true, 'Parte 1 + Parte 2 · por Líbero Filho')}</div>
  <div style="position:absolute;right:${h * .25}px;top:${h * .06}px">${mockup(h * .58, { internas: false })}</div>`);
add('kiwify', 'checkout-topo-desktop-1920x480', 1920, 480, banner(1920, 480, 1));
add('kiwify', 'checkout-topo-mobile-1080x540', 1080, 540, tela(1080, 540, FUNDO, `
  <div style="position:absolute;left:56px;top:56px">${lockup(108, true, 'Parte 1 + Parte 2')}</div>
  <div style="position:absolute;right:20px;top:60px">${mockup(250, { internas: false })}</div>
  <div style="position:absolute;left:56px;bottom:48px">${marca(26)}</div>`));
add('kiwify', 'checkout-lateral-600x1200', 600, 1200, tela(600, 1200, FUNDO, `
  <div style="position:absolute;left:50px;top:60px">${lockup(96)}</div>
  <div style="position:absolute;left:60px;top:370px">${mockup(270, { internas: false })}</div>
  <div style="position:absolute;left:50px;right:50px;top:830px;display:flex;flex-direction:column;gap:16px">
    ${check('320 dicas com fundamento', true, 24)}${check('As 8 disciplinas do edital', true, 24)}${check('Parte 2 com cada dica explicada', true, 24)}${check('Painel de revisão para a véspera', true, 24)}</div>
  <div style="position:absolute;left:50px;bottom:56px">${marca(28)}</div>`));
const modulo = (n, titulo, sub, capa, interna) => tela(1280, 720, FUNDO, `
  <div style="position:absolute;right:-20px;bottom:-60px">${numeroVazado(n, 640)}</div>
  <div style="position:absolute;left:80px;top:80px;${MO};font-weight:800;font-size:24px;letter-spacing:.14em;color:${COR.menta}">ENAM 2026.2 · PARTE ${n}</div>
  <div style="position:absolute;left:80px;top:140px;${T};font-size:132px;color:#fff">${titulo}</div>
  <div style="position:absolute;left:80px;top:440px;width:520px;${I};font-size:28px;line-height:1.4;color:rgba(255,255,255,.8)">${sub}</div>
  <div style="position:absolute;left:80px;bottom:60px">${marca(30)}</div>
  <div style="position:absolute;left:880px;top:150px;transform:rotate(7deg)">${pagina(interna, 320)}</div>
  <div style="position:absolute;left:760px;top:110px;transform:rotate(-4deg)">${pagina(capa, 340)}</div>`);
add('kiwify', 'area-membros-parte1-1280x720', 1280, 720, modulo('1', 'Revisão<br><span style="color:#B9FFF1">em dicas</span>', '320 dicas, uma regra por linha, com explicação curta e fundamento.', pg('enam', 1), pg('enam', 3)));
add('kiwify', 'area-membros-parte2-1280x720', 1280, 720, modulo('2', 'Dicas<br><span style="color:#B9FFF1">explicadas</span>', 'As mesmas 320 dicas, agora com a explicação completa de cada uma.', pg('enam2', 1), pg('enam2', 3)));

// ===================================================== FEED · TELAS ÚNICAS ===================================
add('feed', 'oferta', 1080, 1350, tela(1080, 1350, FUNDO, `
  <div style="position:absolute;right:-40px;top:20px">${numeroVazado('320', 600)}</div>
  <div style="position:absolute;left:72px;top:80px">${lockup(150)}</div>
  <div style="position:absolute;left:440px;top:470px">${mockup(330, { internas: false })}</div>
  <div style="position:absolute;left:72px;top:560px;display:flex;flex-direction:column;gap:24px;width:360px">
    ${check('320 dicas', true, 32)}${check('8 disciplinas', true, 32)}${check('Com fundamento', true, 32)}${check('Parte 2 explicada', true, 32)}</div>
  <div style="position:absolute;left:72px;right:72px;bottom:150px;display:flex;align-items:flex-end;justify-content:space-between">
    <div>${'<div style="' + MO + ';font-weight:700;font-size:22px;letter-spacing:.1em;color:' + COR.menta + ';margin-bottom:6px">PARTE 1 + PARTE 2</div>'}${preco(150)}</div>${cta('Link na bio', 32)}</div>
  ${rodape()}`));

add('feed', 'numeros', 1080, 1350, tela(1080, 1350, COR.papel, `
  <div style="position:absolute;left:72px;top:80px">${lockup(92, false)}</div>
  <div style="position:absolute;left:72px;right:72px;top:420px;display:grid;grid-template-columns:1fr 1fr;gap:18px">
    ${[['320', 'dicas'], ['8', 'disciplinas'], ['141', 'páginas nos 2 PDFs'], ['1', 'painel de revisão pra véspera']].map(([n, t]) => `<div style="background:#fff;border:2px solid ${COR.linha};border-radius:26px;padding:26px 30px;height:230px;display:flex;flex-direction:column;justify-content:space-between"><div style="${T};font-size:130px;color:${COR.verde};line-height:.85">${n}</div><div style="${I};font-weight:700;font-size:28px;color:${COR.tinta}">${t}</div></div>`).join('')}</div>
  <div style="position:absolute;left:72px;right:72px;bottom:150px;display:flex;align-items:center;justify-content:space-between;background:${COR.petroleo2};border-radius:28px;padding:30px 36px">${preco(110)}${cta('Link na bio', 28)}</div>
  ${rodape(false)}`, false));

const d136 = dica(6);
add('feed', 'parte1-x-parte2', 1080, 1350, tela(1080, 1350, COR.papel, `
  <div style="position:absolute;left:72px;right:72px;top:72px">
    <div style="${MO};font-weight:800;font-size:22px;letter-spacing:.14em;color:${COR.verde2}">ENAM 2026.2 · REVISÃO EM DICAS</div>
    <div style="${T};font-size:96px;color:${COR.tinta};margin-top:12px">A mesma dica,<br><span style="color:${COR.verde}">duas leituras</span></div>
    <div style="margin:36px 0 12px">${pill('Parte 1 · rápida', false, 18)}</div>
    ${cartao(d136, { w: 936, px: 30, sombra: false })}
    <div style="margin:30px 0 12px">${pill('Parte 2 · explicada', false, 18)}</div>
    ${cartao(d136, { w: 936, px: 30, explicacao: true, sombra: false })}
  </div>
  <div style="position:absolute;left:72px;right:72px;bottom:130px;display:flex;align-items:center;justify-content:space-between">${preco(96, false)}${cta('Link na bio', 28)}</div>
  ${rodape(false)}`, false));

// ===================================================== CARROSSEL 1 · APRESENTAÇÃO ===========================
const C1 = [];
const titulo = (t, px = 104, escuro = true) => `<div style="${T};font-size:${px}px;color:${escuro ? '#fff' : COR.tinta}">${t}</div>`;
const rot = (t, escuro = true) => `<div style="${MO};font-weight:800;font-size:22px;letter-spacing:.14em;color:${escuro ? COR.menta : COR.verde2};margin-bottom:16px">${t}</div>`;
C1.push(tela(1080, 1350, FUNDO, `
  <div style="position:absolute;right:-50px;top:-10px">${numeroVazado('320', 640)}</div>
  <div style="position:absolute;left:72px;top:90px">${rot('ENAM 2026.2')}${titulo('320 dicas pra<br>revisar <span style="color:#B9FFF1">tudo</span><br>sem reler a lei', 122)}</div>
  <div style="position:absolute;left:80px;top:600px">${mockup(470)}</div>`));
C1.push(tela(1080, 1350, COR.papel, `
  <div style="position:absolute;left:72px;right:72px;top:110px">${rot('O problema', false)}${titulo('8 disciplinas.<br><span style="color:#00A651">Pouco tempo.</span>', 118, false)}
  <div style="${I};font-size:36px;line-height:1.5;color:${COR.tinta};margin-top:50px">Na reta final, ninguém relê a Constituição, os códigos, a Lei de Licitações e as resoluções do CNJ inteiros.</div>
  <div style="${I};font-size:36px;line-height:1.5;color:${COR.tinta};margin-top:30px">O que dá tempo é revisar <b>o que mais cai</b>, do jeito que a prova cobra: prazo, número, exceção e pegadinha.</div></div>
  <div style="position:absolute;left:72px;right:72px;top:820px;display:flex;flex-wrap:wrap;gap:14px">${['CF/88', 'CPC', 'Código Civil', 'Código Penal', 'Lei 14.133/2021', 'Lei 9.784/1999', 'LINDB', 'Lei 11.101/2005', 'Convenção Americana', 'LOMAN', 'Resoluções do CNJ'].map(t => `<span style="${MO};font-weight:700;font-size:24px;color:${COR.cinza};background:#fff;border:2px solid ${COR.linha};border-radius:12px;padding:12px 18px;text-decoration:line-through;text-decoration-color:${COR.erro}">${t}</span>`).join('')}</div>
  ${rodape(false, 2, 8)}`, false));
C1.push(tela(1080, 1350, FUNDO, `
  <div style="position:absolute;left:72px;right:72px;top:100px">${rot('Parte 1 · Revisão em dicas')}${titulo('Uma regra<br>por linha', 118)}
  <div style="${I};font-size:32px;line-height:1.45;color:rgba(255,255,255,.82);margin:34px 0 46px">A regra em negrito, uma explicação curta e o fundamento pra abrir na lei.</div>
  ${cartao(dica(16), { w: 936, px: 34 })}<div style="height:26px"></div>${cartao(dica(131), { w: 936, px: 34 })}</div>
  ${rodape(true, 3, 8)}`));
C1.push(tela(1080, 1350, COR.papel, `
  <div style="position:absolute;left:72px;right:72px;top:100px">${rot('Parte 2 · Dicas explicadas', false)}${titulo('Ficou na<br><span style="color:#00A651">dúvida?</span>', 118, false)}
  <div style="${I};font-size:32px;line-height:1.45;color:${COR.tinta};margin:34px 0 40px">Cada dica volta com a explicação completa: o que a lei diz, a exceção e onde mora a pegadinha.</div>
  ${cartao(d93, { w: 936, px: 36, explicacao: true })}</div>
  ${rodape(false, 4, 8)}`, false));
const maxQ = Math.max(...mapa.map(m => m.questoes));
C1.push(tela(1080, 1350, FUNDO, `
  <div style="position:absolute;left:72px;right:72px;top:90px">${rot('Mapa da prova')}${titulo('O peso de<br>cada <span style="color:#B9FFF1">matéria</span>', 104)}
  <div style="${I};font-size:26px;line-height:1.4;color:rgba(255,255,255,.8);margin:22px 0 30px">As dicas seguem a distribuição do edital: 3 por questão.</div>
  <div style="display:flex;flex-direction:column;gap:20px">${mapa.map(m => `<div style="display:grid;grid-template-columns:330px 1fr 150px;align-items:center;gap:16px"><span style="${I};font-weight:600;font-size:24px;color:#fff;white-space:nowrap">${esc(m.materia.replace('Direito ', ''))}</span><div style="height:26px;border-radius:999px;background:rgba(255,255,255,.08)"><div style="height:100%;width:${Math.max(3, m.questoes / maxQ * 100)}%;border-radius:999px;background:linear-gradient(90deg,${COR.verde},${COR.ciano})"></div></div><span style="${MO};font-weight:800;font-size:22px;color:${COR.menta};text-align:right;white-space:nowrap">${m.questoes}q · ${m.questoes * 4}</span></div>`).join('')}</div>
  <div style="${MO};font-size:16px;color:rgba(185,255,241,.6);margin-top:20px">Fonte: edital ENAM 2026.2, item 8.6. q = questões · número = dicas.</div></div>
  ${rodape(true, 5, 8)}`));
C1.push(tela(1080, 1350, COR.papel, `
  <div style="position:absolute;left:72px;right:72px;top:100px">${rot('Como usar', false)}${titulo('Três leituras<br><span style="color:#00A651">e um painel</span>', 108, false)}</div>
  <div style="position:absolute;left:72px;top:420px;width:470px;display:flex;flex-direction:column;gap:30px">
    ${[['1ª', 'Leia só o negrito. Hesitou? Marque a caixinha.'], ['2ª', 'Volte às marcadas e leia a explicação e o fundamento.'], ['3ª', 'Na véspera, revise só o que ficou pintado no painel.']].map(([n, t]) => `<div style="display:grid;grid-template-columns:90px 1fr;gap:16px"><span style="${T};font-size:80px;color:${COR.verde}">${n}</span><span style="${I};font-size:28px;line-height:1.4;color:${COR.tinta}">${t}</span></div>`).join('')}</div>
  <div style="position:absolute;left:580px;top:440px;transform:rotate(4deg)">${pagina(pg('enam', 40), 440)}</div>
  ${rodape(false, 6, 8)}`, false));
C1.push(tela(1080, 1350, FUNDO, `
  <div style="position:absolute;left:72px;right:72px;top:100px">${rot('O que você recebe')}${titulo('2 PDFs,<br><span style="color:#B9FFF1">141 páginas</span>', 118)}
  <div style="display:flex;flex-direction:column;gap:40px;margin-top:70px">
    ${check('Parte 1: 320 dicas em 42 páginas', true, 34)}${check('Parte 2: as 320 dicas explicadas, em 99 páginas', true, 34)}${check('As 8 disciplinas, no peso do edital', true, 34)}${check('Fundamento de lei, súmula ou tese em cada dica', true, 34)}${check('Painel de revisão de 1 a 320 pra véspera', true, 34)}${check('Material próprio, feito por Líbero Filho', true, 34)}</div></div>
  ${rodape(true, 7, 8)}`));
C1.push(tela(1080, 1350, FUNDO, `
  <div style="position:absolute;right:-40px;top:0">${numeroVazado('320', 600)}</div>
  <div style="position:absolute;left:72px;top:100px">${lockup(140)}</div>
  <div style="position:absolute;left:470px;top:440px">${mockup(320, { internas: false })}</div>
  <div style="position:absolute;left:72px;right:72px;bottom:160px;display:flex;align-items:flex-end;justify-content:space-between"><div><div style="${MO};font-weight:700;font-size:22px;letter-spacing:.1em;color:${COR.menta};margin-bottom:6px">PARTE 1 + PARTE 2</div>${preco(160)}</div>${cta('Link na bio', 32)}</div>
  ${rodape(true, 8, 8)}`));
C1.forEach((h, i) => add('carrossel-apresentacao', String(i + 1), 1080, 1350, h));

// ===================================================== CARROSSEL 2 · PEGADINHAS ==============================
const peg = [
  [6, 'PEC passa por sanção do Presidente.'],
  [16, 'Modulação de efeitos em ADI exige maioria absoluta.'],
  [9, 'Lei municipal pode ser objeto de ADI no STF.'],
  [131, 'Todo tratado de direitos humanos vale como emenda.'],
  [81, 'Recurso administrativo pode exigir depósito prévio.'],
  [312, 'Embriaguez voluntária completa exclui a imputabilidade.'],
];
const C2 = [];
C2.push(tela(1080, 1350, FUNDO, `
  <div style="position:absolute;right:-30px;top:10px">${numeroVazado('6', 760)}</div>
  <div style="position:absolute;left:72px;top:110px">${rot('ENAM 2026.2 · Revisão')}${titulo('6 frases que<br>parecem certas<br><span style="color:#B9FFF1">e estão erradas</span>', 120)}</div>
  <div style="position:absolute;left:72px;top:700px;display:flex;flex-direction:column;gap:22px">
    ${peg.slice(0, 3).map(([, e]) => `<div style="display:flex;gap:16px;align-items:center;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.14);border-radius:20px;padding:22px 28px;width:936px"><span style="${T};font-size:54px;color:${COR.erro}">✕</span><span style="${I};font-weight:600;font-size:34px;color:rgba(255,255,255,.88);text-decoration:line-through;text-decoration-color:${COR.erro}">${esc(e)}</span></div>`).join('')}</div>
  ${rodape(true, 1, 8)}`));
peg.forEach(([n, errado], i) => { const d = dica(n); const escuro = i % 2 === 1;
  C2.push(tela(1080, 1350, escuro ? FUNDO : COR.papel, `
    <div style="position:absolute;right:40px;bottom:120px">${numeroVazado(String(i + 1), 420, escuro ? 'rgba(185,255,241,.16)' : 'rgba(0,166,81,.2)')}</div>
    <div style="position:absolute;left:72px;right:72px;top:190px">${rot(`Pegadinha ${i + 1} de 6 · ${d.materia.replace('Direito ', '')}`, escuro)}
      <div style="${T};font-size:64px;color:${escuro ? '#fff' : COR.tinta};margin-top:18px">Parece certo:</div>
      <div style="display:flex;gap:22px;align-items:flex-start;margin-top:26px"><span style="flex:none;width:84px;height:84px;border-radius:22px;background:${COR.erro};color:#fff;display:grid;place-items:center;${T};font-size:60px">✕</span><span style="${I};font-weight:700;font-size:52px;line-height:1.22;color:${escuro ? 'rgba(255,255,255,.75)' : COR.cinza};text-decoration:line-through;text-decoration-color:${COR.erro};text-decoration-thickness:4px">${esc(errado)}</span></div>
      <div style="display:flex;gap:22px;align-items:center;margin:90px 0 30px"><span style="flex:none;width:84px;height:84px;border-radius:22px;background:${COR.verde};display:grid;place-items:center"><svg width="44" height="44" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span style="${T};font-size:64px;color:${escuro ? COR.menta : COR.verde}">O certo</span></div>
      ${cartao(d, { w: 936, px: 40, sombra: escuro })}
    </div>
    ${rodape(escuro, i + 2, 8)}`, escuro));
});
C2.push(tela(1080, 1350, FUNDO, `
  <div style="position:absolute;left:72px;right:72px;top:100px">${rot('ENAM 2026.2 · Revisão em dicas')}${titulo('Essas são 6.<br><span style="color:#B9FFF1">Faltam 314.</span>', 124)}
  <div style="${I};font-size:32px;line-height:1.45;color:rgba(255,255,255,.82);margin-top:30px">320 dicas das 8 disciplinas, cada uma com fundamento, e a Parte 2 com todas explicadas.</div></div>
  <div style="position:absolute;left:330px;top:500px">${mockup(330, { internas: false })}</div>
  <div style="position:absolute;left:72px;right:72px;bottom:160px;display:flex;align-items:flex-end;justify-content:space-between">${preco(150)}${cta('Link na bio', 32)}</div>
  ${rodape(true, 8, 8)}`));
C2.forEach((h, i) => add('carrossel-pegadinhas', String(i + 1), 1080, 1350, h));

// ===================================================== STORIES FORMAIS (1080×1920) ===========================
const SH = 1920;
const linkVazio = `<div style="width:620px;height:130px;border-radius:30px;border:4px dashed rgba(185,255,241,.6);display:grid;place-items:center;${MO};font-weight:700;font-size:26px;color:rgba(185,255,241,.85)">figurinha de link aqui</div>`;
const ST = [];
ST.push(tela(1080, SH, FUNDO, `
  <div style="position:absolute;right:-60px;top:140px">${numeroVazado('320', 760)}</div>
  <div style="position:absolute;left:80px;top:260px">${rot('Vai fazer o ENAM 2026.2?')}${titulo('Preparei<br>320 dicas<br><span style="color:#B9FFF1">pra sua revisão</span>', 140)}</div>
  <div style="position:absolute;left:60px;top:960px">${mockup(540)}</div>`));
ST.push(tela(1080, SH, COR.papel, `
  <div style="position:absolute;left:72px;right:72px;top:360px">${rot('Parte 1 · Revisão em dicas', false)}${titulo('A regra em<br><span style="color:#00A651">uma linha</span>', 130, false)}
  <div style="${I};font-size:36px;line-height:1.45;color:${COR.tinta};margin:40px 0 50px">E embaixo, a explicação curta e o fundamento pra conferir na lei.</div>
  ${cartao(dica(9), { w: 936, px: 40 })}<div style="height:34px"></div>${cartao(dica(131), { w: 936, px: 40 })}</div>`, false));
ST.push(tela(1080, SH, FUNDO, `
  <div style="position:absolute;left:72px;right:72px;top:330px">${rot('Parte 2 · Dicas explicadas')}${titulo('Cada dica,<br><span style="color:#B9FFF1">explicada</span>', 130)}
  <div style="${I};font-size:36px;line-height:1.45;color:rgba(255,255,255,.85);margin:40px 0 50px">Pra quando o negrito não basta: o que a lei diz, a exceção e a pegadinha.</div>
  ${cartao(d136, { w: 936, px: 44, explicacao: true })}</div>`));
ST.push(tela(1080, SH, FUNDO, `
  <div style="position:absolute;left:80px;right:80px;top:400px">${rot('O que vem')}${titulo('2 PDFs<br><span style="color:#B9FFF1">141 páginas</span>', 140)}
  <div style="display:flex;flex-direction:column;gap:52px;margin-top:90px">
    ${check('320 dicas das 8 disciplinas', true, 48)}${check('No peso do edital: 4 dicas por questão', true, 48)}${check('Fundamento em cada dica', true, 48)}${check('Parte 2 com todas explicadas', true, 48)}${check('Painel de revisão pra véspera', true, 48)}</div></div>
  <div style="position:absolute;left:80px;bottom:150px">${marca(40)}</div>`));
ST.push(tela(1080, SH, FUNDO, `
  <div style="position:absolute;right:-40px;top:120px">${numeroVazado('320', 700)}</div>
  <div style="position:absolute;left:80px;top:220px">${lockup(150)}</div>
  <div style="position:absolute;left:150px;top:680px">${mockup(420, { internas: false })}</div>
  <div style="position:absolute;left:0;right:0;top:1360px;text-align:center"><div style="${MO};font-weight:700;font-size:26px;letter-spacing:.1em;color:${COR.menta};margin-bottom:6px">PARTE 1 + PARTE 2</div><div style="display:inline-block">${preco(190)}</div></div>
  <div style="position:absolute;left:230px;top:1630px">${linkVazio}</div>`));
ST.forEach((h, i) => add('stories', String(i + 1), 1080, SH, h));
add('stories', 'avulso-pegadinha', 1080, SH, tela(1080, SH, COR.papel, `
  <div style="position:absolute;left:72px;right:72px;top:330px">${rot('Certo ou errado?', false)}${titulo('Testamento<br>público exige<br><span style="color:#E5484D">3 testemunhas</span>', 130, false)}
  <div style="${I};font-size:36px;line-height:1.45;color:${COR.tinta};margin:50px 0 40px">Errado. Essa troca derruba muita gente:</div>
  ${cartao(d136, { w: 936, px: 46 })}
  <div style="${I};font-weight:700;font-size:40px;line-height:1.45;color:${COR.tinta};margin-top:50px">É uma das 320 dicas da Revisão em Dicas do ENAM 2026.2.</div></div>
  <div style="position:absolute;left:230px;top:1630px">${linkVazio.replace(/rgba\(185,255,241,\.6\)/, COR.verde).replace(/rgba\(185,255,241,\.85\)/, COR.verde2)}</div>`, false));

// ================================================= BANNER DO CHECKOUT 1200×600 ==================================
// Apostila digital: capa com folhas por trás (espessura), brilho suave e sombra no chão.
const apostila = (src, w, rot, est) => { const h = w * 1123 / 794; return `<div style="position:absolute;${est};width:${w}px;height:${h}px;transform:rotate(${rot}deg)">
  <div style="position:absolute;left:10px;top:9px;width:100%;height:100%;border-radius:6px;background:#C9D6D1;box-shadow:0 30px 50px -14px rgba(0,0,0,.6)"></div>
  <div style="position:absolute;left:6px;top:6px;width:100%;height:100%;border-radius:6px;background:#E3ECE8"></div>
  <div style="position:absolute;left:3px;top:3px;width:100%;height:100%;border-radius:6px;background:#F6FAF8"></div>
  <img src="${src}" style="position:absolute;inset:0;width:100%;height:100%;border-radius:6px;display:block">
  <div style="position:absolute;inset:0;border-radius:6px;background:linear-gradient(115deg,rgba(255,255,255,.16) 0%,rgba(255,255,255,0) 32%,rgba(255,255,255,0) 70%,rgba(0,0,0,.18) 100%);box-shadow:inset 0 0 0 1px rgba(255,255,255,.12)"></div>
  <div style="position:absolute;left:0;top:0;bottom:0;width:10px;border-radius:6px 0 0 6px;background:linear-gradient(90deg,rgba(0,0,0,.28),rgba(0,0,0,0))"></div></div>`; };
const selo = t => `<span style="${MO};font-weight:700;font-size:15px;letter-spacing:.08em;text-transform:uppercase;color:${COR.menta};border:1.5px solid rgba(185,255,241,.4);padding:8px 14px;border-radius:999px;white-space:nowrap">${t}</span>`;
add('kiwify', 'checkout-banner-1200x600', 1200, 600, tela(1200, 600, `radial-gradient(60% 70% at 78% 45%,rgba(0,166,81,.22),transparent 70%),radial-gradient(50% 60% at 0% 100%,rgba(0,210,200,.08),transparent 70%),#062A26`, `
  <div style="position:absolute;left:640px;top:520px;width:500px;height:40px;border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.45),transparent);filter:blur(6px)"></div>
  ${apostila(pg('enam', 1), 266, -5, 'left:640px;top:96px')}
  ${apostila(pg('enam2', 1), 266, 4, 'left:842px;top:118px')}
  <div style="position:absolute;left:72px;top:68px;width:540px">
    <div style="${T};font-size:112px;line-height:.86;color:#fff">Revisão<br>em dicas</div>
    <div style="${T};font-size:52px;line-height:1;color:${COR.verde};margin-top:14px;letter-spacing:.01em">ENAM 2026.2</div>
    <div style="${I};font-weight:600;font-size:26px;line-height:1.3;color:rgba(255,255,255,.9);margin-top:18px">320 dicas para sua revisão final</div>
    <div style="display:flex;gap:10px;margin-top:22px">${selo('8 disciplinas')}${selo('2 PDFs')}${selo('141 páginas')}</div>
    <div style="display:flex;align-items:center;gap:16px;margin-top:30px"><span style="${I};font-weight:600;font-size:22px;color:#fff">Parte 1 + Parte 2 por</span><span style="${T};font-size:50px;line-height:1;color:#fff;background:${COR.verde};padding:6px 16px 4px;border-radius:12px;letter-spacing:.01em">R$ 49,99</span></div>
  </div>
  <div style="position:absolute;left:72px;bottom:34px;${I};font-weight:500;font-size:15px;letter-spacing:.02em;color:rgba(185,255,241,.7)">Líbero Filho <span style="opacity:.5;margin:0 8px">|</span> Concurso com Líbero</div>`), false, 2);

// Topo do checkout no tamanho do bloco de imagem do Checkout Builder (1320×300, exportado em 2x).
add('kiwify', 'checkout-topo-1320x300', 1320, 300, tela(1320, 300, `radial-gradient(60% 120% at 80% 50%,rgba(0,166,81,.22),transparent 70%),#062A26`, `
  <div style="position:absolute;left:560px;top:-40px;${T};font-size:380px;line-height:.8;color:transparent;-webkit-text-stroke:2px rgba(185,255,241,.12)">320</div>
  <div style="position:absolute;left:56px;top:38px">
    <span style="${MO};font-weight:800;font-size:17px;letter-spacing:.12em;color:#062A26;background:${COR.verde};padding:5px 12px;border-radius:7px">ENAM 2026.2</span>
    <div style="${T};font-size:92px;line-height:.86;color:#fff;margin-top:12px">Revisão<br><span style="color:${COR.menta}">em dicas</span></div></div>
  <div style="position:absolute;left:470px;top:56px;width:440px;display:flex;flex-direction:column;gap:16px">
    <div style="${I};font-weight:600;font-size:25px;line-height:1.25;color:#fff">320 dicas para sua revisão final, com a Parte 2 explicada</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">${selo('8 disciplinas')}${selo('2 PDFs')}${selo('141 páginas')}</div>
    <div style="display:flex;align-items:center;gap:12px"><span style="${I};font-weight:600;font-size:19px;color:rgba(255,255,255,.85)">Parte 1 + Parte 2 por</span><span style="${T};font-size:40px;line-height:1;color:#fff;background:${COR.verde};padding:5px 13px 3px;border-radius:10px">R$ 49,99</span></div></div>
  ${apostila(pg('enam', 1), 165, -6, 'left:965px;top:40px')}
  ${apostila(pg('enam2', 1), 165, 5, 'left:1105px;top:52px')}
  <div style="position:absolute;left:56px;bottom:26px;${I};font-weight:500;font-size:15px;color:rgba(185,255,241,.7)">Líbero Filho <span style="opacity:.5;margin:0 6px">|</span> Concurso com Líbero</div>`), false, 2);

// ============================================================= SITE ========================================
add('site', 'mockup', 875, 800, `<div class="peca" style="width:875px;height:800px">${mockup(500)}</div>`, true);
add('site', 'og', 1200, 630, banner(1200, 630, 1));

// ============================================================ RENDER =======================================
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
const build = path.join(root, 'build'); fs.mkdirSync(build, { recursive: true });
const saida = path.join(root, 'saida', 'produto-enam');
for (const p of P) {
  if (filtro && !`${p.grupo}/${p.nome}`.includes(filtro)) continue;
  const html = `<!doctype html><html><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet"><style>*{box-sizing:border-box;margin:0;padding:0}body{background:${p.transparente ? 'transparent' : '#000'}}</style></head><body>${p.html}</body></html>`;
  const hp = path.join(build, `produto-${p.grupo}-${p.nome}.html`); fs.writeFileSync(hp, html);
  const page = await browser.newPage({ viewport: { width: p.w, height: p.h }, deviceScaleFactor: p.escala });
  await page.goto('file://' + hp); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(300);
  const estouro = await page.evaluate(() => [...document.querySelectorAll('.peca *')].filter(e => e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflow === 'visible' && e.children.length === 0).length);
  fs.mkdirSync(path.join(saida, p.grupo), { recursive: true });
  await page.screenshot({ path: path.join(saida, p.grupo, `${p.nome}.png`), omitBackground: p.transparente });
  await page.close();
  console.log(`${p.grupo}/${p.nome}${estouro ? `  (verificar: ${estouro} texto(s) largo(s))` : ''}`);
}
await browser.close();

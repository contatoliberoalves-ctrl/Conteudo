// Identidade visual do podcast "Entre notas e registros", da ANOREG/PE: símbolo e logos (PNG sem fundo),
// peças em tamanho real (Instagram, YouTube, Spotify, gravação) e o manual em pranchas 1920×1080 + PDF.
// Conceito: o selo notarial (borda recortada) guarda uma onda sonora, e a barra do meio é a pena
// de escrever. Notas (tabelionato e som) e registros (registro civil/imóveis e gravação).
// Uso: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node kit.mjs
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const root = path.dirname(new URL(import.meta.url).pathname);
const { chromium } = createRequire(path.join(root, '../../moldes/treino-de-pecas/package.json'))('playwright');
const OUT = path.join(root, 'saida');
fs.rmSync(OUT, { recursive: true, force: true });
for (const d of ['logos', 'pecas', 'pranchas']) fs.mkdirSync(path.join(OUT, d), { recursive: true });

// ---------- Paleta e tipos ----------
const C = { tinta: '#0F1E36', noite: '#0A1527', ouro: '#E2A63B', ambar: '#F3C66B', papel: '#F5EFE4', lacre: '#B8432F', branco: '#FFFFFF', cinza: '#5B6475' };
const OURO = `linear-gradient(135deg,${C.ambar} 0%,${C.ouro} 55%,#C98A22 100%)`;
const FUNDO = `radial-gradient(130% 110% at 80% 10%,#1B3357 0%,${C.tinta} 45%,${C.noite} 100%)`;
const SERIF = "font-family:'Fraunces',Georgia,serif";
const HEAD = `<meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"><style>*{box-sizing:border-box;margin:0}body{font-family:Inter,sans-serif;-webkit-font-smoothing:antialiased}</style>`;

// ---------- Símbolo (SVG) ----------
// Borda do selo: círculo com 28 ondulações; por dentro, um aro fino. Barras da onda + pena no centro.
const selo = (() => {
  const N = 28, pts = [];
  for (let i = 0; i <= 360; i++) {
    const t = (i / 360) * Math.PI * 2, r = 94 + 4.2 * Math.cos(N * t);
    pts.push(`${(100 + r * Math.sin(t)).toFixed(2)},${(100 - r * Math.cos(t)).toFixed(2)}`);
  }
  const circ = r => `M${100 - r},100a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0Z`;
  return `M${pts.join('L')}Z ${circ(84)} ${circ(79)} ${circ(75)}`; // borda + aro (evenodd)
})();
const BARRAS = [[-58, 22], [-44, 42], [-30, 66], [30, 66], [44, 42], [58, 22]]; // [x, altura]
const barras = BARRAS.map(([x, h]) => `<rect x="${100 + x - 5}" y="${100 - h / 2}" width="10" height="${h}" rx="5"/>`).join('');
// Pena: ombros arredondados, ponta para baixo, furo de respiro e fenda.
const PENA = 'M86,48 Q86,44 90,44 L110,44 Q114,44 114,48 L114,80 C114,103 107,124 100,154 C93,124 86,103 86,80 Z M100,79 m-5.5,0 a5.5,5.5 0 1,0 11,0 a5.5,5.5 0 1,0 -11,0 Z M98.8,90 L101.2,90 L101.2,138 L98.8,138 Z';
const simbolo = (px, { cor = C.papel, pena = C.ouro, aro = true, extra = '' } = {}) => `<svg viewBox="0 0 200 200" width="${px}" height="${px}" style="display:block;${extra}">
  ${aro ? `<path d="${selo}" fill="${cor}" fill-rule="evenodd"/>` : ''}<g fill="${cor}">${barras}</g><path d="${PENA}" fill="${pena}" fill-rule="evenodd"/></svg>`;

// ---------- Logotipo ----------
// entre / NOTAS / e REGISTROS, com o "e" em itálico dourado; selo "PODCAST · ANOREG/PE".
const rotulo = (px, cor = C.ouro, txt = 'PODCAST · ANOREG/PE') => `<span style="font-weight:700;font-size:${px}px;letter-spacing:.34em;color:${cor};white-space:nowrap">${txt}</span>`;
const nome = (s, { cor = C.papel, ital = C.ouro } = {}) => `<div style="${SERIF};color:${cor};line-height:.86;font-variation-settings:'SOFT' 50,'WONK' 1">
  <div style="font-style:italic;font-weight:400;font-size:${s * .52}px;color:${ital};margin-left:${s * .04}px;margin-bottom:${s * .04}px">entre</div>
  <div style="font-weight:800;font-size:${s}px;letter-spacing:-.02em">NOTAS</div>
  <div style="font-weight:800;font-size:${s}px;letter-spacing:-.02em;white-space:nowrap"><span style="font-style:italic;font-weight:400;color:${ital};font-size:${s * .78}px;margin-right:${s * .1}px">e</span>REGISTROS</div></div>`;
const logo = (s, o = {}) => `<div style="display:inline-flex;flex-direction:column;align-items:flex-start;gap:${s * .3}px">
  ${simbolo(s * 1.25, o)}${nome(s, o)}<div style="margin-top:${s * .08}px">${rotulo(s * .17, o.ital || C.ouro)}</div></div>`;
const logoH = (s, o = {}) => `<div style="display:inline-flex;align-items:center;gap:${s * .45}px">${simbolo(s * 2.7, o)}
  <div style="display:flex;flex-direction:column;gap:${s * .28}px">${nome(s, o)}${rotulo(s * .17, o.ital || C.ouro)}</div></div>`;
// Linha única (rodapés, tarjas)
const linha = (s, { cor = C.papel, ital = C.ouro, simb = true } = {}) => `<div style="display:inline-flex;align-items:center;gap:${s * .5}px;white-space:nowrap">${simb ? simbolo(s * 1.9, { cor, pena: ital }) : ''}
  <span style="${SERIF};font-size:${s}px;color:${cor};font-weight:700;letter-spacing:-.01em"><i style="font-weight:400;color:${ital}">entre</i> NOTAS <i style="font-weight:400;color:${ital}">e</i> REGISTROS</span></div>`;

// ---------- Elementos de apoio ----------
const box = (w, h, bg, html) => `<div style="position:relative;width:${w}px;height:${h}px;overflow:hidden;background:${bg}">${html}</div>`;
// Pautas do livro de registro: linhas finas horizontais (textura do fundo)
const pauta = (cor = 'rgba(245,239,228,.05)', passo = 46) => `<div style="position:absolute;inset:0;background:repeating-linear-gradient(180deg,transparent 0 ${passo - 2}px,${cor} ${passo - 2}px ${passo}px)"></div>`;
const margem = (x, cor = 'rgba(184,67,47,.35)') => `<div style="position:absolute;top:0;bottom:0;left:${x}px;width:2px;background:${cor}"></div>`;
// Onda decorativa de barras (fileira longa)
const onda = (n, larg, alt, cor = C.ouro, op = 1) => {
  const seq = Array.from({ length: n }, (_, i) => Math.round(alt * (0.18 + 0.82 * Math.abs(Math.sin(i * 0.55) * Math.cos(i * 0.21)))));
  const w = larg / n;
  return `<div style="display:flex;align-items:center;gap:${w * .45}px;height:${alt}px;opacity:${op}">${seq.map(h => `<span style="width:${w * .55}px;height:${h}px;border-radius:${w}px;background:${cor}"></span>`).join('')}</div>`;
};
const marcaDagua = (px, x, y, op = .06) => `<div style="position:absolute;left:${x}px;top:${y}px;opacity:${op}">${simbolo(px, { cor: C.papel, pena: C.papel })}</div>`;
const ep = (n, px, cor = C.ouro) => `<span style="font-weight:800;font-size:${px}px;letter-spacing:.3em;color:${cor}">EPISÓDIO ${String(n).padStart(2, '0')}</span>`;
const foto = (w, h, extra = '') => `<div style="width:${w}px;height:${h}px;border-radius:${w}px ${w}px 24px 24px;background:linear-gradient(180deg,#263F64,#14264A);border:3px solid ${C.ouro};position:relative;overflow:hidden;${extra}">
  <div style="position:absolute;left:50%;top:22%;width:38%;height:30%;border-radius:50%;background:rgba(245,239,228,.13);transform:translateX(-50%)"></div>
  <div style="position:absolute;left:50%;bottom:-8%;width:78%;height:42%;border-radius:50% 50% 0 0;background:rgba(245,239,228,.13);transform:translateX(-50%)"></div>
  <div style="position:absolute;left:0;right:0;bottom:16px;text-align:center;font-size:${Math.max(14, w * .045)}px;font-weight:600;letter-spacing:.2em;color:rgba(245,239,228,.5)">FOTO DO CONVIDADO</div></div>`;
const T = (px, cor = C.papel) => `${SERIF};font-weight:800;font-size:${px}px;line-height:1;letter-spacing:-.02em;color:${cor};font-variation-settings:'SOFT' 50,'WONK' 1`;
const it = t => `<i style="font-weight:400;color:${C.ouro}">${t}</i>`;
const botao = (t, px, bg = OURO, fg = C.noite) => `<span style="display:inline-block;background:${bg};color:${fg};font-weight:800;font-size:${px}px;letter-spacing:.08em;padding:${px * .62}px ${px * 1.3}px;border-radius:${px * .3}px">${t}</span>`;

// ---------- Peças (tamanho real) ----------
const P = {
  'avatar-instagram': [1080, 1080, box(1080, 1080, FUNDO, `${pauta()}<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${simbolo(760)}</div>`)],
  'avatar-claro': [1080, 1080, box(1080, 1080, C.papel, `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${simbolo(760, { cor: C.tinta })}</div>`)],
  'capa-podcast': [1500, 1500, box(1500, 1500, FUNDO, `${pauta('rgba(245,239,228,.045)', 60)}${margem(150)}
    <div style="position:absolute;left:230px;top:190px">${simbolo(380)}</div>
    <div style="position:absolute;left:230px;top:660px">${nome(188)}</div>
    <div style="position:absolute;left:230px;bottom:150px;display:flex;flex-direction:column;gap:18px">${rotulo(34)}<span style="font-size:24px;letter-spacing:.22em;color:rgba(245,239,228,.6);font-weight:600">NOTÁRIOS E REGISTRADORES DE PERNAMBUCO</span></div>`)],
  'post-episodio': [1080, 1350, box(1080, 1350, FUNDO, `${pauta()}${margem(80)}
    <div style="position:absolute;left:130px;top:110px;right:90px;display:flex;justify-content:space-between;align-items:center">${ep(7, 26)}${simbolo(90)}</div>
    <div style="position:absolute;right:-30px;top:250px">${foto(440, 560)}</div>
    <div style="position:absolute;left:130px;top:300px;width:500px;${T(96)}">Usucapião ${it('no')} cartório</div>
    <div style="position:absolute;left:130px;top:560px;width:440px;font-size:30px;line-height:1.4;color:rgba(245,239,228,.85)">O que mudou e como o registrador conduz o pedido, passo a passo.</div>
    <div style="position:absolute;left:130px;right:90px;bottom:190px;display:flex;align-items:center;gap:26px;padding-top:34px;border-top:2px solid rgba(226,166,59,.4)">
      <div><div style="font-size:22px;font-weight:700;letter-spacing:.24em;color:${C.ouro}">CONVIDADO</div><div style="${SERIF};font-weight:700;font-size:44px;color:${C.papel};margin-top:6px">Nome do Convidado</div><div style="font-size:24px;color:rgba(245,239,228,.7);margin-top:4px">Oficial de Registro de Imóveis · Recife</div></div></div>
    <div style="position:absolute;left:130px;bottom:90px">${linha(30, { simb: false })}</div>`)],
  'post-frase': [1080, 1350, box(1080, 1350, C.papel, `${pauta('rgba(15,30,54,.06)')}${margem(80)}
    <div style="position:absolute;left:130px;top:120px">${simbolo(110, { cor: C.tinta })}</div>
    <div style="position:absolute;left:130px;top:290px;${SERIF};font-size:300px;line-height:.6;color:${C.ouro};font-weight:800">“</div>
    <div style="position:absolute;left:130px;right:110px;top:420px;${T(78, C.tinta)};line-height:1.1;font-weight:600">O cartório é onde a vida das pessoas ${it('ganha segurança jurídica.')}</div>
    <div style="position:absolute;left:130px;top:900px;font-size:28px;font-weight:700;letter-spacing:.2em;color:${C.lacre}">— NOME DO CONVIDADO · EP. 07</div>
    <div style="position:absolute;left:130px;right:110px;bottom:110px;display:flex;justify-content:space-between;align-items:center">${linha(28, { cor: C.tinta, simb: false })}<span style="font-size:22px;font-weight:700;letter-spacing:.24em;color:${C.cinza}">ANOREG/PE</span></div>`)],
  'post-novo-ep': [1080, 1350, box(1080, 1350, OURO, `<div style="position:absolute;inset:0;background:repeating-linear-gradient(180deg,transparent 0 44px,rgba(10,21,39,.06) 44px 46px)"></div>
    <div style="position:absolute;left:110px;top:130px;font-size:28px;font-weight:800;letter-spacing:.34em;color:${C.noite}">NO AR</div>
    <div style="position:absolute;left:110px;right:100px;top:220px;${T(170, C.noite)};line-height:.92">Episódio novo ${'<i style="font-weight:400">toda</i>'} quinzena</div>
    <div style="position:absolute;left:110px;right:110px;top:820px">${onda(46, 860, 140, C.noite, .9)}</div>
    <div style="position:absolute;left:110px;bottom:120px;display:flex;gap:18px">${botao('YOUTUBE', 26, C.noite, C.papel)}${botao('SPOTIFY', 26, C.noite, C.papel)}</div>
    <div style="position:absolute;right:100px;bottom:96px">${simbolo(120, { cor: C.noite, pena: C.papel })}</div>`)],
  'story-episodio': [1080, 1920, box(1080, 1920, FUNDO, `${pauta()}${margem(80)}
    <div style="position:absolute;left:130px;top:220px">${linha(34, {})}</div>
    <div style="position:absolute;left:50%;top:420px;transform:translateX(-50%)">${foto(640, 760)}</div>
    <div style="position:absolute;left:130px;top:1260px">${ep(7, 28)}</div>
    <div style="position:absolute;left:130px;right:110px;top:1320px;${T(100)}">Usucapião ${it('no')} cartório</div>
    <div style="position:absolute;left:130px;top:1580px;font-size:34px;color:rgba(245,239,228,.85)">com <b style="color:${C.papel}">Nome do Convidado</b></div>
    <div style="position:absolute;left:0;right:0;bottom:170px;text-align:center">${botao('OUÇA AGORA ↗', 34)}</div>`)],
  'reels-capa': [1080, 1920, box(1080, 1920, FUNDO, `${pauta()}
    <div style="position:absolute;left:0;right:0;top:250px;display:flex;justify-content:center">${linha(30)}</div>
    <div style="position:absolute;left:120px;right:120px;top:560px;text-align:center;${T(132)};line-height:1.02">Quanto custa ${it('casar')} no cartório?</div>
    <div style="position:absolute;left:120px;right:120px;top:1130px;display:flex;justify-content:center">${onda(34, 840, 150, C.ouro)}</div>
    <div style="position:absolute;left:0;right:0;bottom:300px;text-align:center">${ep(7, 28, 'rgba(245,239,228,.7)')}</div>`)],
  'thumb-youtube': [1280, 720, box(1280, 720, FUNDO, `${pauta('rgba(245,239,228,.05)', 36)}
    <div style="position:absolute;right:40px;bottom:0">${foto(460, 600, 'border-radius:230px 230px 0 0;border-bottom:none')}</div>
    <div style="position:absolute;left:70px;top:64px;display:flex;align-items:center;gap:18px">${simbolo(74)}${ep(7, 22)}</div>
    <div style="position:absolute;left:70px;top:190px;width:720px;${T(108)};line-height:.98">Usucapião ${it('sem')} processo</div>
    <div style="position:absolute;left:70px;bottom:62px;background:${C.ouro};color:${C.noite};font-weight:800;font-size:28px;letter-spacing:.06em;padding:12px 22px">NOME DO CONVIDADO</div>`)],
  'banner-youtube': [2560, 1440, box(2560, 1440, FUNDO, `${pauta('rgba(245,239,228,.04)', 54)}
    <div style="position:absolute;left:-60px;top:410px;opacity:.5">${onda(48, 900, 420, C.ouro, .35)}</div>
    <div style="position:absolute;right:-60px;top:410px;opacity:.5">${onda(48, 900, 420, C.ouro, .35)}</div>
    <div style="position:absolute;left:507px;top:508px;width:1546px;height:423px;display:flex;align-items:center;justify-content:center;gap:60px">
      ${simbolo(300)}<div style="display:flex;flex-direction:column;gap:20px">${nome(104)}<div style="display:flex;gap:30px;align-items:center">${rotulo(22)}<span style="font-size:22px;color:rgba(245,239,228,.65);letter-spacing:.14em;font-weight:600">EPISÓDIO NOVO A CADA 15 DIAS</span></div></div></div>`)],
  'fundo-gravacao': [1920, 1080, box(1920, 1080, FUNDO, `${pauta('rgba(245,239,228,.04)', 48)}${marcaDagua(1100, 1080, -40, .05)}
    <div style="position:absolute;left:110px;bottom:90px">${linha(30)}</div>
    <div style="position:absolute;right:110px;bottom:98px">${rotulo(18, 'rgba(245,239,228,.6)', 'ANOREG/PE')}</div>`)],
  'tarja-convidado': [1920, 1080, `<div style="position:relative;width:1920px;height:1080px">
    <div style="position:absolute;left:100px;bottom:100px;display:flex;align-items:stretch;box-shadow:0 20px 50px rgba(0,0,0,.35)">
      <div style="background:${C.ouro};padding:0 26px;display:flex;align-items:center">${simbolo(78, { cor: C.noite, pena: C.papel })}</div>
      <div style="background:${C.tinta};padding:24px 44px;min-width:720px"><div style="${SERIF};font-weight:700;font-size:48px;color:${C.papel}">Nome do Convidado</div>
      <div style="font-size:24px;color:rgba(245,239,228,.75);margin-top:6px;letter-spacing:.04em">Tabelião de Notas · Olinda</div></div></div></div>`, true],
};

// ---------- Logos sem fundo ----------
const L = {
  'simbolo-claro': simbolo(900), 'simbolo-escuro': simbolo(900, { cor: C.tinta }),
  'simbolo-mono-branco': simbolo(900, { cor: '#fff', pena: '#fff' }), 'simbolo-mono-tinta': simbolo(900, { cor: C.tinta, pena: C.tinta }),
  'logo-vertical-claro': logo(200), 'logo-vertical-escuro': logo(200, { cor: C.tinta, ital: '#B9801C' }),
  'logo-horizontal-claro': logoH(130), 'logo-horizontal-escuro': logoH(130, { cor: C.tinta, ital: '#B9801C' }),
  'assinatura-linha-claro': linha(80), 'assinatura-linha-escuro': linha(80, { cor: C.tinta, ital: '#B9801C' }),
};

const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
const pronto = async () => { await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(300); };

for (const [n, [w, h, html, transp]] of Object.entries(P)) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<!doctype html><html><head>${HEAD}<style>body{background:transparent}</style></head><body>${html}</body></html>`); await pronto();
  await page.screenshot({ path: path.join(OUT, 'pecas', `${n}.png`), omitBackground: !!transp });
}
for (const [n, html] of Object.entries(L)) {
  await page.setViewportSize({ width: 2600, height: 1400 });
  await page.setContent(`<!doctype html><html><head>${HEAD}<style>body{background:transparent}</style></head><body><div id="l" style="display:inline-block;padding:40px">${html}</div></body></html>`); await pronto();
  await page.locator('#l').screenshot({ path: path.join(OUT, 'logos', `${n}.png`), omitBackground: true });
}
// Capa do Spotify/Apple em 3000×3000
await page.setViewportSize({ width: 1500, height: 1500 });
{
  const p2 = await browser.newPage({ viewport: { width: 1500, height: 1500 }, deviceScaleFactor: 2 });
  await p2.setContent(`<!doctype html><html><head>${HEAD}</head><body>${P['capa-podcast'][2]}</body></html>`);
  await p2.evaluate(() => document.fonts.ready); await p2.waitForTimeout(300);
  await p2.screenshot({ path: path.join(OUT, 'pecas', 'capa-podcast-3000.png') }); await p2.close();
}

// ---------- Pranchas do manual ----------
const img = (n, w, extra = '') => `<img src="file://${path.join(OUT, 'pecas', n + '.png')}" style="display:block;width:${w}px;border-radius:10px;box-shadow:0 14px 34px rgba(15,30,54,.18);${extra}">`;
const cab = (n, t, sub) => `<div style="font-weight:800;font-size:20px;letter-spacing:.3em;color:${C.lacre}">${n}</div><div style="${T(64, C.tinta)};margin-top:8px">${t}</div>${sub ? `<p style="font-size:21px;line-height:1.5;color:${C.cinza};margin-top:12px;max-width:1250px">${sub}</p>` : ''}`;
const prancha = (corpo, bg = C.papel) => `<section style="position:relative;width:1920px;height:1080px;overflow:hidden;background:${bg};padding:64px 80px;break-after:page">${corpo}
  <div style="position:absolute;right:80px;bottom:40px;display:flex;align-items:center;gap:14px;font-weight:700;font-size:15px;letter-spacing:.22em;color:#8d8a84">ENTRE NOTAS E REGISTROS · IDENTIDADE VISUAL ${simbolo(30, { cor: C.tinta })}</div></section>`;
const tile = (bg, html, w, h, extra = '') => `<div style="width:${w}px;height:${h}px;border-radius:14px;background:${bg};display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;${extra}">${html}</div>`;
const nota = (t, w = 360) => `<div style="font-size:19px;line-height:1.5;color:${C.cinza};width:${w}px">${t}</div>`;

const PR = [
  // capa do manual
  `<section style="position:relative;width:1920px;height:1080px;overflow:hidden;background:${FUNDO};break-after:page">${pauta('rgba(245,239,228,.045)', 54)}${margem(170)}
    <div style="position:absolute;left:260px;top:0;bottom:0;display:flex;align-items:center">${logoH(150)}</div>
    <div style="position:absolute;left:260px;bottom:80px;font-size:20px;font-weight:700;letter-spacing:.3em;color:rgba(245,239,228,.6)">MANUAL DA IDENTIDADE VISUAL · ${new Date().getFullYear()}</div></section>`,
  prancha(`${cab('01', 'O símbolo', 'O selo notarial, com a borda recortada dos carimbos de cartório, guarda uma onda sonora. A barra do meio é a pena de escrever: é ali que a fala vira registro. Notas e registros nos dois sentidos — o do cartório e o do som.')}
    <div style="display:flex;gap:40px;margin-top:40px;align-items:center">
      ${tile(FUNDO, simbolo(460), 620, 620)}
      <div style="display:flex;flex-direction:column;gap:30px">
        ${[['Selo', 'borda recortada de 28 pontas e aro duplo: fé pública, documento, chancela'], ['Onda', 'seis barras simétricas: a voz, a conversa, o áudio gravado'], ['Pena', 'ponta para baixo, com respiro e fenda: notas lavradas, assinatura, registro']].map(([a, b]) => `<div style="display:flex;gap:24px;align-items:baseline;width:760px;padding-bottom:26px;border-bottom:2px solid rgba(15,30,54,.1)"><span style="${T(44, C.tinta)};width:150px">${a}</span><span style="font-size:24px;line-height:1.45;color:${C.cinza}">${b}</span></div>`).join('')}
        <div style="display:flex;gap:18px;margin-top:6px">${tile(C.papel, simbolo(130, { cor: C.tinta }), 170, 170, 'border:2px solid #e3dccf')}${tile(C.ouro, simbolo(130, { cor: C.noite, pena: C.papel }), 170, 170)}${tile(C.tinta, simbolo(130, { cor: '#fff', pena: '#fff' }), 170, 170)}${tile('#fff', simbolo(130, { cor: C.tinta, pena: C.tinta }), 170, 170, 'border:2px solid #e3dccf')}</div>
      </div></div>`),
  prancha(`${cab('02', 'Logotipo e versões', 'Título em Fraunces: NOTAS e REGISTROS em caixa alta pesada, “entre” e “e” em itálico dourado — o tom de conversa entre os dois mundos. Assinatura PODCAST · ANOREG/PE sempre presente nas versões completas.')}
    <div style="display:grid;grid-template-columns:860px 860px;gap:22px;margin-top:28px">
      ${tile(FUNDO, logoH(62), 860, 320)}${tile('#fff', logoH(62, { cor: C.tinta, ital: '#B9801C' }), 860, 320, 'border:2px solid #e3dccf')}
    </div>
    <div style="display:flex;gap:22px;margin-top:22px">
      ${tile(FUNDO, logo(44), 420, 340)}${tile('#fff', logo(44, { cor: C.tinta, ital: '#B9801C' }), 420, 340, 'border:2px solid #e3dccf')}
      <div style="display:flex;flex-direction:column;gap:20px">${tile(C.tinta, linha(22), 438, 160)}${tile(C.ouro, linha(22, { cor: C.noite, ital: C.papel }), 438, 160)}</div>
      ${nota('Vertical: capas e telas quadradas. Horizontal: banners e cabeçalhos. Em linha: rodapés, tarjas e assinaturas pequenas.', 360)}
    </div>`),
  prancha(`${cab('03', 'Cores e tipografia')}
    <div style="display:flex;gap:20px;margin-top:34px">${[['Tinta', C.tinta, '15 30 54', C.papel], ['Noite', C.noite, '10 21 39', C.papel], ['Ouro', C.ouro, '226 166 59', C.noite], ['Papel', C.papel, '245 239 228', C.tinta], ['Lacre', C.lacre, '184 67 47', C.papel]].map(([n, h, rgb, fg]) => `<div style="flex:1;height:250px;border-radius:14px;background:${h};color:${fg};padding:26px;display:flex;flex-direction:column;justify-content:flex-end;border:2px solid #e3dccf"><div style="${SERIF};font-weight:800;font-size:44px">${n}</div><div style="font-size:18px;font-weight:600;margin-top:6px">${h} · RGB ${rgb}</div></div>`).join('')}</div>
    <p style="font-size:19px;color:${C.cinza};margin-top:14px">Tinta e papel são a base (70%), ouro é o destaque (20%), lacre só em detalhes: a margem do livro, assinaturas de citação (10%).</p>
    <div style="display:flex;gap:70px;margin-top:36px;color:${C.tinta}">
      <div style="flex:1.2"><div style="font-size:18px;font-weight:800;letter-spacing:.22em;color:${C.lacre}">TÍTULOS · FRAUNCES 800 + ITÁLICO 400</div><div style="${T(104, C.tinta)};margin-top:12px;line-height:.98">Usucapião <i style="font-weight:400;color:#B9801C">no</i> cartório</div></div>
      <div style="flex:1"><div style="font-size:18px;font-weight:800;letter-spacing:.22em;color:${C.lacre}">TEXTO · INTER 400–800</div><div style="font-size:26px;line-height:1.5;margin-top:12px">O que mudou e como o registrador conduz o pedido, passo a passo, com o convidado da semana.</div>
        <div style="font-size:18px;font-weight:800;letter-spacing:.22em;color:${C.lacre};margin-top:30px">RÓTULOS · INTER 700–800, ESPAÇADO</div><div style="margin-top:12px">${ep(7, 22, C.tinta)}</div></div>
    </div>`),
  prancha(`${cab('04', 'Instagram', 'Capa do episódio no fundo tinta com as pautas do livro de registro e a margem vermelha; citações no papel; chamadas no ouro. Stories e capa de Reels no mesmo ritmo.')}
    <div style="display:flex;gap:22px;margin-top:28px;align-items:flex-start">${[['post-episodio', 384, 'Capa do episódio'], ['post-frase', 384, 'Citação do convidado'], ['post-novo-ep', 384, 'Chamada / aviso'], ['story-episodio', 270, 'Story do episódio'], ['reels-capa', 270, 'Capa de Reels']].map(([n, w, t]) => `<div>${img(n, w)}<div style="font-size:18px;font-weight:800;letter-spacing:.18em;color:${C.tinta};margin-top:18px">${t.toUpperCase()}</div><div style="font-size:16px;color:${C.cinza};margin-top:4px">${w > 300 ? '1080×1350' : '1080×1920'}</div></div>`).join('')}</div>`),
  prancha(`${cab('05', 'YouTube e Spotify', 'Banner do canal com tudo dentro da área segura (1546×423); miniatura com convidado, número do episódio e uma palavra em itálico; capa quadrada de 3000 px para Spotify e Apple Podcasts.')}
    <div style="display:flex;gap:30px;margin-top:26px;align-items:flex-start">
      <div style="display:flex;flex-direction:column;gap:20px">${img('banner-youtube', 900)}<div style="display:flex;gap:24px;align-items:center">${img('thumb-youtube', 400)}${img('avatar-instagram', 180, 'border-radius:50%')}${nota('Miniatura 1280×720 e foto de perfil (só o símbolo, para Instagram, YouTube e Spotify).', 260)}</div></div>
      <div>${img('capa-podcast', 640)}<div style="font-size:18px;font-weight:800;letter-spacing:.18em;color:${C.tinta};margin-top:16px">CAPA DO PODCAST · 3000×3000</div></div></div>`),
  prancha(`${cab('06', 'Gravação e vídeo', 'Fundo para a gravação (tela atrás dos participantes ou no vídeo) e tarja de nome com fundo transparente para a edição.')}
    <div style="display:flex;gap:26px;margin-top:30px;align-items:flex-start">${img('fundo-gravacao', 860)}
      <div style="position:relative;width:860px;height:484px;border-radius:10px;overflow:hidden;background:linear-gradient(135deg,#6d7a8c,#3b4656);box-shadow:0 14px 34px rgba(15,30,54,.18)">
        <img src="file://${path.join(OUT, 'pecas', 'tarja-convidado.png')}" style="position:absolute;inset:0;width:100%"><div style="position:absolute;right:24px;top:20px;font-size:16px;letter-spacing:.2em;color:rgba(255,255,255,.7);font-weight:700">TARJA SOBRE O VÍDEO</div></div></div>
    <div style="display:flex;gap:60px;margin-top:40px">${[['Respiro', 'deixe ao redor do símbolo um espaço livre de pelo menos a altura de uma barra média.'], ['Tamanho mínimo', 'símbolo com 24 px de largura na tela; abaixo disso use a versão sem o aro.'], ['Não fazer', 'não distorcer, não girar, não trocar as fontes, não usar o ouro em textos longos nem o lacre em títulos.']].map(([a, b]) => `<div style="width:540px"><div style="font-size:18px;font-weight:800;letter-spacing:.22em;color:${C.lacre}">${a.toUpperCase()}</div><div style="font-size:22px;line-height:1.5;color:${C.tinta};margin-top:10px">${b}</div></div>`).join('')}</div>`),
];
const doc = `<!doctype html><html><head>${HEAD}<style>@page{size:1920px 1080px;margin:0}body{width:1920px}</style></head><body>${PR.join('')}</body></html>`;
fs.mkdirSync(path.join(root, 'build'), { recursive: true });
fs.writeFileSync(path.join(root, 'build', 'pranchas.html'), doc);
await page.setViewportSize({ width: 1920, height: 1080 });
await page.goto('file://' + path.join(root, 'build', 'pranchas.html')); await pronto();
await page.evaluate(() => Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => (i.onload = i.onerror = r)))));
const secs = await page.locator('section').all();
for (const [i, s] of secs.entries()) await s.screenshot({ path: path.join(OUT, 'pranchas', `0${i + 1}.png`) });
await page.pdf({ path: path.join(OUT, 'Entre-notas-e-registros-identidade-visual.pdf'), width: '1920px', height: '1080px', printBackground: true });
await browser.close();
console.log('✓', Object.keys(P).length + 1, 'peças,', Object.keys(L).length, 'logos,', secs.length, 'pranchas e o PDF em', path.relative(process.cwd(), OUT));

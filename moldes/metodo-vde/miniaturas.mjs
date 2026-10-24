// Uso: node miniaturas.mjs [id] -> saida/miniaturas/<id>.jpg e <id>-foto.jpg (capas do YouTube, 1280×720).
// Identidade do Método VDE (degradê roxo → índigo, lavanda, Poppins, arcos finos) com um objeto do tema à
// direita (edital, vagas, linha do tempo, gráfico, semana). Na versão com foto, a pessoa entra no lugar do
// objeto e o dado principal vai num selo. As fotos (recortes PNG sem fundo) ficam em fotos/, fora do git.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const COR = { roxo: '#2E0575', indigo: '#1937B1', meio: '#261C8C', lavanda: '#C9B8FF', lavandaClara: '#F2EEFF', tinta: '#1A1340', cinza: '#6B6885' };
const DEG = `linear-gradient(135deg,${COR.roxo} 0%,${COR.meio} 50%,${COR.indigo} 100%)`;
const DEG_H = `linear-gradient(90deg,${COR.roxo},${COR.indigo})`;
const P = "font-family:'Poppins',sans-serif";
const FONTES = 'https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800;900&display=swap';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
const rico = (s, escuro) => esc(s).replace(/\[\[(.+?)\]\]/g, escuro ? `<span style="color:${COR.lavanda}">$1</span>`
  : `<span style="background:${DEG_H};-webkit-background-clip:text;background-clip:text;color:transparent">$1</span>`);

const fundo = escuro => `<div style="position:absolute;inset:0;background:${escuro ? DEG : `radial-gradient(90% 100% at 80% 40%,#fff 0%,${COR.lavandaClara} 80%)`}"></div>
  <svg width="1280" height="720" style="position:absolute;inset:0">${Array.from({ length: 7 }, (_, k) => `<circle cx="1480" cy="360" r="${330 + k * 42}" fill="none" stroke="${escuro ? 'rgba(201,184,255,.22)' : 'rgba(46,5,117,.08)'}" stroke-width="2"/>`).join('')}</svg>
  <div style="position:absolute;inset:0;background-image:url(../assets/grao.png);background-size:400px;opacity:${escuro ? .35 : .18};mix-blend-mode:${escuro ? 'overlay' : 'multiply'}"></div>`;
const cartao = (html, { w = 440, h = 520, r = 3, right = 80, top = 100 } = {}) => `<div style="position:absolute;right:${right}px;top:${top}px;width:${w}px;height:${h}px;background:#fff;border-radius:18px;transform:rotate(${r}deg);box-shadow:0 30px 70px rgba(20,8,70,.45),0 2px 6px rgba(20,8,70,.2);overflow:hidden">${html}</div>`;
const rotulo = t => `<div style="${P};font-weight:700;font-size:15px;letter-spacing:.16em;text-transform:uppercase;color:${COR.cinza}">${esc(t)}</div>`;
const cinzas = (n, larg = [92, 84, 95, 70, 88, 60]) => Array.from({ length: n }, (_, i) => `<div style="height:11px;width:${larg[i % larg.length]}%;background:#E6E1F5;border-radius:3px;margin-top:16px"></div>`).join('');

const OBJETOS = {
  // Edital impresso com a ficha do concurso e um carimbo.
  edital: o => cartao(`<div style="height:12px;background:${DEG_H}"></div><div style="padding:30px 34px">
      ${rotulo(o.topo || 'Edital')}<div style="${P};font-weight:800;font-size:30px;line-height:1.15;color:${COR.tinta};margin:8px 0 18px">${esc(o.titulo)}</div>
      ${lista(o.linhas).map(([a, b]) => `<div style="display:flex;justify-content:space-between;align-items:baseline;padding:12px 0;border-top:2px solid #EEEAF8"><span style="${P};font-weight:500;font-size:19px;color:${COR.cinza}">${esc(a)}</span><span style="${P};font-weight:800;font-size:24px;color:${COR.tinta}">${esc(b)}</span></div>`).join('')}
      ${cinzas(4)}</div>
    ${o.carimbo ? `<div style="position:absolute;right:26px;bottom:34px;transform:rotate(-12deg);border:5px solid ${COR.roxo};border-radius:12px;padding:6px 18px;${P};font-weight:900;font-size:44px;letter-spacing:.04em;color:${COR.roxo};opacity:.9">${esc(o.carimbo)}</div>` : ''}`, { r: o.r ?? 3 }),
  // Número de vagas gigante.
  vagas: o => cartao(`<div style="height:12px;background:${DEG_H}"></div><div style="padding:34px 38px;display:flex;flex-direction:column;height:100%">
      ${rotulo(o.topo)}<div style="${P};font-weight:900;font-size:250px;line-height:1;letter-spacing:-.05em;margin-top:6px;background:${DEG_H};-webkit-background-clip:text;background-clip:text;color:transparent">${esc(o.n)}</div>
      <div style="${P};font-weight:800;font-size:40px;color:${COR.tinta};margin-top:-6px">${esc(o.rotulo)}</div>
      <div style="${P};font-weight:500;font-size:21px;color:${COR.cinza};margin-top:10px">${esc(o.sub)}</div></div>`, { r: -3, h: 500, top: 110 }),
  // Linha do tempo do concurso: o que já aconteceu e o que falta.
  linha: o => cartao(`<div style="height:12px;background:${DEG_H}"></div><div style="padding:32px 36px">${rotulo(o.topo)}
      <div style="position:relative;margin-top:22px">${lista(o.etapas).map(([t, d, feito], i, a) => `<div style="display:flex;gap:20px;align-items:flex-start;position:relative;padding-bottom:${i < a.length - 1 ? 30 : 0}px">
        ${i < a.length - 1 ? `<div style="position:absolute;left:21px;top:46px;bottom:0;width:3px;background:${feito ? COR.roxo : '#E6E1F5'}"></div>` : ''}
        <span style="flex:none;width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;${feito ? `background:${DEG_H}` : `border:3px solid #D9D2F2;background:#fff`}">${feito ? '<svg viewBox="0 0 24 24" width="24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>' : ''}</span>
        <div><div style="${P};font-weight:800;font-size:26px;color:${feito ? COR.tinta : '#9C98B3'}">${esc(t)}</div><div style="${P};font-weight:500;font-size:18px;color:${COR.cinza};margin-top:2px">${esc(d)}</div></div></div>`).join('')}</div></div>`, { r: 2, h: 510, top: 105 }),
  // Gráfico de barras com os assuntos que mais caem.
  barras: o => cartao(`<div style="height:12px;background:${DEG_H}"></div><div style="padding:32px 36px">${rotulo(o.topo)}
      <div style="${P};font-weight:800;font-size:28px;color:${COR.tinta};margin:6px 0 22px">${esc(o.titulo)}</div>
      ${lista(o.itens).map(([t, v], i) => `<div style="margin-bottom:20px"><div style="display:flex;justify-content:space-between;${P};font-size:20px;color:${COR.tinta}"><span style="font-weight:600">${esc(t)}</span><b style="font-weight:800">${String(v).replace('.', ',')}%</b></div>
        <div style="height:18px;border-radius:9px;background:#EEEAF8;margin-top:8px"><div style="height:18px;border-radius:9px;width:${Math.max(6, v / o.max * 100)}%;background:${i ? '#B9A8F2' : DEG_H}"></div></div></div>`).join('')}</div>`, { r: -3, h: 520, top: 100 }),
  // Semana de estudos.
  semana: o => cartao(`<div style="height:12px;background:${DEG_H}"></div><div style="padding:30px 34px">${rotulo(o.topo)}
      <div style="margin-top:16px">${lista(o.dias).map(([d, m], i) => `<div style="display:flex;align-items:center;gap:16px;padding:11px 0;border-top:${i ? '2px solid #EEEAF8' : 'none'}"><span style="flex:none;width:58px;height:40px;border-radius:10px;background:${COR.lavandaClara};color:${COR.roxo};display:flex;align-items:center;justify-content:center;${P};font-weight:800;font-size:17px">${esc(d)}</span><span style="${P};font-weight:600;font-size:21px;color:${COR.tinta}">${esc(m)}</span>
        <span style="margin-left:auto;width:28px;height:28px;border-radius:8px;${i < (o.feitos || 0) ? `background:${DEG_H}` : 'border:3px solid #D9D2F2'};display:flex;align-items:center;justify-content:center">${i < (o.feitos || 0) ? '<svg viewBox="0 0 24 24" width="18" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>' : ''}</span></div>`).join('')}</div></div>`, { r: 3, h: 530, top: 95 }),
};

function html(t, foto) {
  const escuro = t.fundo !== 'claro';
  const larg = foto ? 700 : 640;
  return `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="${FONTES}"><style>*{box-sizing:border-box}html,body{margin:0;width:1280px;height:720px;overflow:hidden}</style></head>
<body><div style="position:relative;width:1280px;height:720px;overflow:hidden">${fundo(escuro)}
  ${foto ? `<div style="position:absolute;right:-60px;bottom:-180px;width:720px;height:720px;border-radius:50%;background:radial-gradient(circle,${escuro ? 'rgba(201,184,255,.35)' : 'rgba(46,5,117,.14)'} 0%,transparent 65%)"></div>
    <img src="${foto}" style="position:absolute;right:${t.fotoX ?? 20}px;bottom:0;height:690px;filter:drop-shadow(0 20px 40px rgba(20,8,70,.4))">
    ${t.selo ? `<div style="position:absolute;right:${t.seloX ?? 380}px;bottom:70px;transform:rotate(-6deg);background:${escuro ? '#fff' : DEG_H};color:${escuro ? COR.roxo : '#fff'};${P};font-weight:900;font-size:42px;letter-spacing:-.02em;padding:12px 26px;border-radius:16px;box-shadow:0 16px 36px rgba(20,8,70,.35)">${esc(t.selo)}</div>` : ''}`
    : OBJETOS[t.objeto.tipo](t.objeto)}
  <div style="position:absolute;left:68px;top:74px;width:${larg}px">
    <span style="display:inline-block;${P};font-weight:700;font-size:22px;letter-spacing:.14em;text-transform:uppercase;padding:10px 22px;border-radius:999px;${escuro ? 'background:rgba(255,255,255,.14);color:#fff;border:2px solid rgba(255,255,255,.3)' : `background:${DEG_H};color:#fff`}">${esc(t.kicker)}</span>
    <div data-fit style="${P};font-weight:900;font-size:${t.px || 124}px;line-height:1.02;letter-spacing:-.035em;color:${escuro ? '#fff' : COR.tinta};margin-top:26px;width:${larg}px;max-height:430px">${lista(t.titulo).map(l => `<div style="white-space:nowrap">${rico(l, escuro)}</div>`).join('')}</div>
    ${t.sub ? `<div style="${P};font-weight:600;font-size:30px;line-height:1.35;color:${escuro ? '#E4DCFF' : COR.cinza};margin-top:26px;max-width:${foto ? 560 : 600}px">${rico(t.sub, escuro)}</div>` : ''}</div>
  <div style="position:absolute;left:68px;bottom:44px;display:flex;align-items:center;gap:12px;${P};font-weight:700;font-size:20px;letter-spacing:.18em;color:${escuro ? 'rgba(255,255,255,.8)' : COR.roxo}"><span style="width:34px;height:5px;border-radius:3px;background:${escuro ? COR.lavanda : DEG_H}"></span>MÉTODO VDE</div>
</div></body></html>`;
}

const root = path.dirname(new URL(import.meta.url).pathname);
const itens = JSON.parse(fs.readFileSync(path.join(root, 'miniaturas.json'), 'utf8'));
const filtro = process.argv[2];
const build = path.join(root, 'build'), out = path.join(root, 'saida', 'miniaturas');
fs.mkdirSync(build, { recursive: true }); fs.mkdirSync(out, { recursive: true });
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
for (const t of itens) {
  if (filtro && t.id !== filtro) continue;
  const versoes = [['', null]];
  if (t.foto) {
    if (fs.existsSync(path.join(root, t.foto))) versoes.push(['-foto', 'file://' + path.join(root, t.foto)]);
    else console.log('!', t.id, `foto não encontrada: ${t.foto}`);
  }
  for (const [suf, foto] of versoes) {
    const p = path.join(build, `mini-${t.id}${suf}.html`);
    fs.writeFileSync(p, html(t, foto));
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    await page.goto('file://' + p);
    await page.evaluate(() => document.fonts.ready);
    // Título encolhe até caber na largura e na altura.
    const px = await page.evaluate(() => { const el = document.querySelector('[data-fit]'); let f = parseFloat(el.style.fontSize);
      const cabe = () => [...el.children].every(c => c.scrollWidth <= el.clientWidth) && el.scrollHeight <= parseFloat(el.style.maxHeight);
      while (!cabe() && f > 50) { f -= 2; el.style.fontSize = f + 'px'; } return f; });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(out, `${t.id}${suf}.jpg`), type: 'jpeg', quality: 92 });
    await page.close();
    console.log('✓', `${t.id}${suf}`, `(título ${px}px)`);
  }
}
await browser.close();

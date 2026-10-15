// Identidade visual do livro "O segredo pra argumentar em provas discursivas" (OAB e Concursos),
// de Líbero Alves Rodrigues Filho: 3 direções, todas com degradê verde na capa. Para cada uma, uma prancha
// 1920×1080 (capa, capa aberta com lombada e verso, abertura de capítulo, página de texto, cores e fontes)
// e a capa em alta (16 × 23 cm a 300 dpi). Uso: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node gerar.mjs
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const root = path.dirname(new URL(import.meta.url).pathname);
const { chromium } = createRequire('/opt/node-tools/node_modules/')('playwright');

const W = 640, H = 920, LOMBADA = 100; // capa 16 × 23 cm (40 px/cm); lombada de 2,5 cm (ajustar ao nº de páginas)
const AUTOR = 'Líbero Alves Rodrigues Filho';

const V = [
  {
    id: 'tribuna', nome: 'Tribuna',
    conceito: 'Clássica e segura, como uma boa sustentação oral: serifa elegante, aspas grandes como símbolo do argumento e um fio dourado discreto. Passa autoridade e confiança.',
    fontes: 'family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,800;1,9..144,500;1,9..144,600&family=Inter:wght@400;500;600;700',
    tit: 'Fraunces,serif', txt: 'Inter,sans-serif', tipos: ['Fraunces', 'Inter'],
    cores: [['Floresta', '#0B3328'], ['Esmeralda', '#14684A'], ['Folha', '#2FA36B'], ['Papel', '#F5F1E6'], ['Ouro', '#C9AE6E']],
    g: 'linear-gradient(165deg,#0B3328 0%,#0F4A38 38%,#14684A 70%,#2FA36B 100%)', ac: '#2FA36B', lt: '#C9AE6E', dk: '#0B3328', papel: '#F8F5EC',
    capa: v => `<div style="position:absolute;inset:0;background:${v.g}"></div>
      <div style="position:absolute;left:-30px;top:40px;font-family:Fraunces;font-weight:800;font-size:520px;line-height:1;color:rgba(255,255,255,.07)">“</div>
      <div style="position:absolute;inset:28px;border:1px solid rgba(201,174,110,.45)"></div>
      <div style="position:absolute;left:70px;right:70px;top:86px;display:flex;align-items:center;gap:16px;font-family:Inter;font-weight:600;font-size:15px;letter-spacing:.32em;color:#C9AE6E">OAB <span style="width:6px;height:6px;border-radius:50%;background:#C9AE6E"></span> CONCURSOS<span style="flex:1;height:1px;background:rgba(201,174,110,.6)"></span></div>
      <div style="position:absolute;left:70px;right:60px;top:300px;color:#F5F1E6">
        <div style="font-family:Fraunces;font-style:italic;font-weight:600;font-size:118px;line-height:.92;letter-spacing:-.02em">O segredo</div>
        <div style="font-family:Fraunces;font-weight:400;font-size:46px;line-height:1.08;margin-top:22px">pra argumentar em<br>provas discursivas</div>
        <div style="width:90px;height:3px;background:#C9AE6E;margin-top:40px"></div></div>
      <div style="position:absolute;left:70px;right:70px;bottom:78px;font-family:Inter;font-weight:600;font-size:17px;letter-spacing:.24em;color:#F5F1E6;text-transform:uppercase">${AUTOR}</div>`,
  },
  {
    id: 'chave', nome: 'Chave',
    conceito: 'Ousada e moderna: o "segredo" vira uma fechadura recortada no degradê, do verde-limão ao verde profundo. Título grande e direto, cara de best-seller de não ficção.',
    fontes: 'family=Archivo:wght@500;600;800;900&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400',
    tit: 'Archivo,sans-serif', txt: "'Source Serif 4',serif", tipos: ['Archivo', 'Source Serif 4'],
    cores: [['Limão', '#C6EE6A'], ['Broto', '#3DB672'], ['Mata', '#0F5C3E'], ['Abismo', '#062A1E'], ['Branco', '#FFFFFF']],
    g: 'linear-gradient(150deg,#C6EE6A 0%,#3DB672 34%,#0F5C3E 70%,#062A1E 100%)', ac: '#3DB672', lt: '#C6EE6A', dk: '#062A1E', papel: '#FFFFFF',
    capa: v => `<div style="position:absolute;inset:0;background:${v.g}"></div>
      <svg viewBox="0 0 300 420" style="position:absolute;right:-70px;top:120px;width:420px;opacity:.22"><circle cx="150" cy="120" r="110" fill="#062A1E"/><path d="M95 190 L205 190 L245 420 L55 420Z" fill="#062A1E"/></svg>
      <div style="position:absolute;left:60px;top:70px;background:#062A1E;color:#C6EE6A;font-family:Archivo;font-weight:800;font-size:17px;letter-spacing:.14em;padding:10px 20px;border-radius:999px">OAB · CONCURSOS</div>
      <div style="position:absolute;left:58px;right:50px;top:330px;color:#fff">
        <div style="font-family:Archivo;font-weight:600;font-size:34px;letter-spacing:.02em;text-transform:uppercase;opacity:.92">O</div>
        <div style="font-family:Archivo;font-weight:900;font-size:110px;line-height:.86;letter-spacing:-.04em;text-transform:uppercase">Segredo</div>
        <div style="font-family:Archivo;font-weight:800;font-size:42px;line-height:1.06;letter-spacing:-.01em;margin-top:22px">pra argumentar em<br><span style="background:#C6EE6A;color:#062A1E;padding:0 10px">provas discursivas</span></div></div>
      <div style="position:absolute;left:60px;right:60px;bottom:70px;display:flex;align-items:center;gap:16px;color:#fff;font-family:Archivo;font-weight:600;font-size:20px"><span style="width:40px;height:3px;background:#C6EE6A"></span>${AUTOR}</div>`,
  },
  {
    id: 'fio', nome: 'Fio do argumento',
    conceito: 'Didática e leve: o degradê sai do menta claro e desce até o verde profundo, e um fio liga fato, norma e conclusão, o caminho que o livro ensina. Combina com o Argumenta com Líbero.',
    fontes: 'family=Manrope:wght@500;700;800&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@500',
    tit: 'Manrope,sans-serif', txt: 'Manrope,sans-serif', tipos: ['Manrope', 'Manrope, com destaque em Instrument Serif'],
    cores: [['Menta', '#E4F3E8'], ['Brisa', '#9ED8B4'], ['Verde', '#2E8B57'], ['Profundo', '#0B3D2A'], ['Tinta', '#11251C']],
    g: 'linear-gradient(180deg,#E4F3E8 0%,#B9E3C6 30%,#5DB383 58%,#1E6E47 80%,#0B3D2A 100%)', ac: '#2E8B57', lt: '#9ED8B4', dk: '#0B3D2A', papel: '#FBFDFB',
    capa: v => {
      const pts = [[120, 640], [300, 560], [470, 690], [560, 600]];
      return `<div style="position:absolute;inset:0;background:${v.g}"></div>
      <svg viewBox="0 0 ${W} ${H}" style="position:absolute;inset:0"><path d="M${pts.map(p => p.join(' ')).join(' L')}" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round"/>${pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i === 3 ? 16 : 10}" fill="${i === 3 ? '#fff' : '#0B3D2A'}" stroke="#fff" stroke-width="3"/>`).join('')}</svg>
      ${[['fato', 120, 640], ['norma', 300, 560], ['aplicação', 470, 690], ['conclusão', 560, 600]].map(([t, x, y]) => `<div style="position:absolute;left:${x - 60}px;top:${t === 'conclusão' ? y - 52 : y + 26}px;width:120px;text-align:center;font-family:'JetBrains Mono';font-size:14px;color:#fff;opacity:.9">${t}</div>`).join('')}
      <div style="position:absolute;left:60px;top:70px;font-family:'JetBrains Mono';font-weight:500;font-size:15px;letter-spacing:.08em;color:#1E6E47">// OAB e Concursos</div>
      <div style="position:absolute;left:58px;right:50px;top:150px;color:#0B3D2A">
        <div style="font-family:Manrope;font-weight:800;font-size:66px;line-height:1;letter-spacing:-.035em">O <span style="font-family:'Instrument Serif';font-style:italic;font-weight:400;font-size:92px;letter-spacing:-.01em;color:#1E6E47">segredo</span><br>pra argumentar<br>em provas<br>discursivas</div></div>
      <div style="position:absolute;left:60px;right:60px;bottom:66px;color:#fff;font-family:Manrope;font-weight:700;font-size:19px">${AUTOR}</div>`;
    },
  },
];

// Capa aberta: verso + lombada + capa. Textos do verso são provisórios.
const verso = v => `<div style="position:absolute;inset:0;background:${v.g};filter:saturate(.95)"></div><div style="position:absolute;inset:0;background:rgba(0,0,0,.18)"></div>
  <div style="position:absolute;left:60px;right:60px;top:90px;color:#fff;font-family:${v.txt}">
    <div style="font-family:${v.tit};font-weight:800;font-size:34px;line-height:1.15">Saber a lei não basta. É preciso convencer quem corrige.</div>
    <p style="font-size:19px;line-height:1.55;margin-top:26px;opacity:.92">[Sinopse provisória] Um método direto para transformar conhecimento em resposta que pontua: ler o que a banca pede, ligar o fato à norma e fechar com uma conclusão que não deixa dúvida.</p>
    <p style="font-size:19px;line-height:1.55;margin-top:16px;opacity:.92">Para a 2ª fase da OAB e para as provas discursivas de concursos.</p></div>
  <div style="position:absolute;left:60px;bottom:70px;width:200px;height:110px;background:#fff;border-radius:4px;display:flex;align-items:center;justify-content:center;font-family:monospace;font-size:13px;color:#333">ISBN / código de barras</div>`;
const lombada = v => `<div style="position:absolute;inset:0;background:${v.g}"></div><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center"><div style="transform:rotate(90deg);white-space:nowrap;color:#fff;font-family:${v.tit};font-weight:800;font-size:24px">O segredo pra argumentar em provas discursivas <span style="font-weight:500;opacity:.8;margin-left:24px">${AUTOR.split(' ')[0]} ${AUTOR.split(' ').slice(-2).join(' ')}</span></div></div>`;
const caixa = (w, h, html) => `<div style="position:relative;width:${w}px;height:${h}px;overflow:hidden;flex:none">${html}</div>`;
const aberta = v => `<div style="display:flex;box-shadow:0 20px 40px rgba(0,0,0,.25)">${caixa(W, H, verso(v))}${caixa(LOMBADA, H, lombada(v))}${caixa(W, H, v.capa(v))}</div>`;

// Miolo: abertura de capítulo e página de texto com o box "Segredo" e o exemplo antes × depois.
const abertura = v => `<div style="position:absolute;inset:0;background:${v.papel}"></div>
  <div style="position:absolute;left:0;right:0;top:0;height:330px;background:${v.g}"></div>
  <div style="position:absolute;left:70px;top:80px;font-family:${v.tit};font-weight:800;font-size:220px;line-height:1;color:${v.papel};letter-spacing:-.04em">01</div>
  <div style="position:absolute;left:70px;right:70px;top:470px;font-family:${v.txt}">
    <div style="font-family:${v.tit};font-weight:800;font-size:50px;line-height:1.05;color:${v.dk}">O que a banca quer ler</div>
    <div style="width:70px;height:4px;background:${v.ac};margin:30px 0"></div>
    <p style="font-size:20px;line-height:1.6;color:#2b2b2b">Antes de escrever uma linha, descubra o que o enunciado pergunta de verdade. A maior parte dos pontos perdidos não vem de não saber o Direito, e sim de responder outra coisa.</p></div>`;
const texto = v => `<div style="position:absolute;inset:0;background:${v.papel}"></div>
  <div style="position:absolute;left:70px;right:70px;top:50px;display:flex;justify-content:space-between;font-family:${v.txt};font-size:13px;letter-spacing:.12em;color:#888;text-transform:uppercase"><span>O segredo pra argumentar</span><span>Capítulo 1</span></div>
  <div style="position:absolute;left:70px;right:70px;top:110px;font-family:${v.txt};color:#2b2b2b">
    <p style="font-size:18px;line-height:1.62">Toda resposta que pontua segue o mesmo caminho: identifica o fato relevante, aponta a norma aplicável, mostra como ela incide no caso e fecha com uma conclusão clara. Quando um desses passos falta, o examinador não tem como dar o ponto.</p>
    <div style="margin:28px 0;background:${v.dk};color:#fff;border-radius:14px;padding:26px 28px;position:relative">
      <div style="font-family:${v.tit};font-weight:800;font-size:15px;letter-spacing:.2em;color:${v.lt}">O SEGREDO</div>
      <div style="font-family:${v.tit};font-weight:700;font-size:23px;line-height:1.3;margin-top:8px">Não basta citar o artigo: mostre por que ele resolve aquele caso.</div></div>
    <div style="display:flex;gap:16px">
      <div style="flex:1;border-left:6px solid #C0563F;background:#F7ECE9;padding:16px 18px;border-radius:0 10px 10px 0"><div style="font-weight:700;font-size:13px;letter-spacing:.12em;color:#C0563F">ANTES</div><div style="font-size:16px;line-height:1.45;margin-top:6px">"Cabe mandado de segurança, conforme a lei."</div></div>
      <div style="flex:1;border-left:6px solid ${v.ac};background:#EAF5EE;padding:16px 18px;border-radius:0 10px 10px 0"><div style="font-weight:700;font-size:13px;letter-spacing:.12em;color:${v.ac}">DEPOIS</div><div style="font-size:16px;line-height:1.45;margin-top:6px">"Há direito líquido e certo, provado por documento, violado por ato de autoridade: cabe MS (art. 5º, LXIX, CF)."</div></div></div>
    <p style="font-size:18px;line-height:1.62;margin-top:26px">Nos próximos capítulos, cada passo vira um exercício, com respostas reais comentadas.</p></div>
  <div style="position:absolute;bottom:44px;left:0;right:0;text-align:center;font-family:${v.txt};font-size:14px;color:#888">17</div>`;

const prancha = v => `<div style="width:1920px;height:1080px;background:#EDEFEC;position:relative;overflow:hidden;font-family:Inter,sans-serif">
  <div style="position:absolute;left:60px;top:44px;right:60px;display:flex;align-items:baseline;gap:22px"><span style="font-family:${v.tit};font-weight:800;font-size:44px;color:${v.dk}">${v.nome}</span><span style="font-size:18px;color:#4a4a4a;max-width:1150px;line-height:1.4">${v.conceito}</span></div>
  <div style="position:absolute;left:60px;top:150px;transform:scale(.95);transform-origin:0 0;box-shadow:0 20px 40px rgba(0,0,0,.25)">${caixa(W, H, v.capa(v))}</div>
  <div style="position:absolute;left:700px;top:150px;transform:scale(.4);transform-origin:0 0">${aberta(v)}</div>
  <div style="position:absolute;left:700px;top:560px;transform:scale(.52);transform-origin:0 0;display:flex;gap:40px">${caixa(W, H, abertura(v))}${caixa(W, H, texto(v))}</div>
  <div style="position:absolute;left:1430px;top:560px;width:430px">
    <div style="font-weight:700;font-size:14px;letter-spacing:.16em;color:#666">CORES</div>
    <div style="display:flex;gap:10px;margin-top:12px">${v.cores.map(([n, c]) => `<div style="flex:1"><div style="height:80px;border-radius:10px;background:${c};border:1px solid rgba(0,0,0,.08)"></div><div style="font-size:13px;font-weight:600;margin-top:6px">${n}</div><div style="font-size:12px;color:#777">${c}</div></div>`).join('')}</div>
    <div style="height:70px;border-radius:10px;background:${v.g.replace(/\d+deg/, '90deg')};margin-top:18px"></div><div style="font-size:12px;color:#777;margin-top:6px">Degradê da capa</div>
    <div style="font-weight:700;font-size:14px;letter-spacing:.16em;color:#666;margin-top:26px">FONTES</div>
    <div style="font-family:${v.tit};font-weight:800;font-size:40px;margin-top:8px;color:${v.dk}">Aa ${v.tipos[0]}</div>
    <div style="font-family:${v.txt};font-size:22px;margin-top:4px;color:#333">Texto em ${v.tipos[1]}</div></div>
</div>`;

const head = `<meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?${[...new Set(V.map(v => v.fontes))].join('&')}&display=swap" rel="stylesheet"><style>*{box-sizing:border-box;margin:0}body{margin:0;-webkit-font-smoothing:antialiased}</style>`;

const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
const out = path.join(root, 'saida'); fs.mkdirSync(out, { recursive: true });
const foto = async (html, w, h, arq, escala = 1) => {
  const f = path.join(out, 'tmp.html'); fs.writeFileSync(f, `<!doctype html><html><head>${head}</head><body>${html}</body></html>`);
  const p = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: escala });
  await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  await p.screenshot({ path: path.join(out, arq), clip: { x: 0, y: 0, width: w, height: h } }); await p.close();
};
for (const [i, v] of V.entries()) {
  await foto(prancha(v), 1920, 1080, `${i + 1}-${v.id}-prancha.png`);
  await foto(caixa(W, H, v.capa(v)), W, H, `${i + 1}-${v.id}-capa.png`, 1890 / W); // 16 cm a 300 dpi
  await foto(aberta(v), W * 2 + LOMBADA, H, `${i + 1}-${v.id}-capa-aberta.png`, 2);
}
fs.rmSync(path.join(out, 'tmp.html'));
await browser.close();
console.log('ok');

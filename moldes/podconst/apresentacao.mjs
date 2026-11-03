// Uso: node apresentacao.mjs -> saida/apresentacao-podconst.pdf (16:9, 1920×1080)
// Apresentação da identidade visual do PodConst + todos os posts do dados.json.
// Antes, as miniaturas dos slides precisam estar em build/pdf (ver README).
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { LOGO, ETIQ, AZUL, MAG, NAVY, AMAR, BRANCO, TINTA } from './posts.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const dados = JSON.parse(fs.readFileSync(path.join(root, 'dados.json'), 'utf8'));
const lista = JSON.parse(fs.readFileSync(path.join(root, 'build/pdf/lista.json'), 'utf8'));

const pag = (fundo, corpo, cor = '#fff') => `<section style="background:${fundo};color:${cor}">${corpo}</section>`;
const cab = (n, tit, cor = '#fff', handles = true) => `<div style="position:absolute;top:70px;left:110px;right:110px;display:flex;align-items:center;gap:26px;color:${cor}"><span style="background:${AMAR};color:${TINTA};font-weight:700;font-size:26px;padding:4px 14px">${n}</span><span class="bb" style="font-size:${tit.length > 46 ? 54 : 72}px;line-height:1;white-space:nowrap">${tit}</span><span style="flex:1;height:2px;background:currentColor;opacity:.4"></span>${handles ? '<span style="font-size:24px;opacity:.8"><b>@libero</b>filho · <b>@natalia</b>valenca</span>' : ''}</div>`;

const cores = [
  ['Azul PodConst', AZUL, '#0C4BBD → #0A3AA0 → #0A2A7C', 'Capas e páginas de abertura'],
  ['Navy', NAVY, '#0A1E56 · #0B1A4A (texto)', 'Páginas de virada e contraste'],
  ['Magenta', MAG, '#EA2EE0 → #C515C2 · logo #FF1FF0', 'Destaques e caixas de título'],
  ['Amarelo', AMAR, '#F7F400', 'Barras, etiquetas e páginas de impacto'],
  ['Branco', BRANCO, '#F4F4F2', 'Listas, exemplos e prova social'],
];

const paginas = [];
// 1. capa
paginas.push(pag(AZUL, `
<div class="blur" style="bottom:-160px;right:-80px;font-size:620px;color:#e224d6">PODCONST</div>
${ETIQ('top:90px;left:120px', 'flex-start', 0)}
<div style="position:absolute;left:120px;top:300px;display:flex;flex-direction:column;align-items:flex-start;gap:10px">
<div class="bb" style="font-size:190px;line-height:.88">IDENTIDADE VISUAL</div>
<div class="bb" style="background:#e224d6;font-size:150px;line-height:1;padding:12px 30px 0;transform:rotate(-2deg)">+ OS POSTS</div>
<div style="font-weight:600;font-size:38px;margin-top:40px;max-width:900px;line-height:1.3">O podcast de Constitucional do Líbero Filho e da Natália Valença: cores, letras, elementos e todos os posts feitos até aqui.</div>
</div>
${LOGO(120, 'bottom:110px;right:150px')}`));

// 2. paleta
paginas.push(pag(BRANCO, `${cab('01', 'PALETA', TINTA)}
<div style="position:absolute;top:220px;left:110px;right:110px;bottom:120px;display:flex;gap:30px">
${cores.map(([n, bg, hex, uso]) => `<div style="flex:1;display:flex;flex-direction:column;background:#fff;box-shadow:0 20px 40px rgba(11,26,74,.1)"><div style="flex:1;background:${bg}"></div><div style="padding:26px 24px;color:${TINTA}"><div class="bb" style="font-size:52px;line-height:1">${n}</div><div style="font-weight:700;font-size:21px;margin:8px 0">${hex}</div><div style="font-size:22px;line-height:1.3;opacity:.8">${uso}</div></div></div>`).join('')}
</div>`, TINTA));

// 3. tipografia
paginas.push(pag(NAVY, `${cab('02', 'TIPOGRAFIA')}
<div style="position:absolute;top:220px;left:110px;right:110px;display:grid;grid-template-columns:1.3fr 1fr;gap:60px">
<div><div style="font-size:26px;letter-spacing:4px;color:${AMAR};font-weight:700">TÍTULOS · BEBAS NEUE</div><div class="bb" style="font-size:230px;line-height:.85;margin-top:10px">AaBbCc<br>123 ÇÃ</div><div style="font-size:26px;opacity:.85;margin-top:20px;line-height:1.35">Sempre em caixa alta, entrelinha curta (0,88–0,92). Palavra-chave em caixa magenta, navy ou amarela, levemente inclinada (−2°).</div></div>
<div style="display:flex;flex-direction:column;gap:60px"><div><div style="font-size:26px;letter-spacing:4px;color:${AMAR};font-weight:700">TEXTO · SPACE GROTESK</div><div style="font-size:64px;font-weight:700;margin-top:14px">Aa Bb Cc 123</div><div style="font-size:30px;line-height:1.35;margin-top:10px;font-weight:600">Texto corrido de 32 a 40 px, peso 600–700, com destaques em amarelo.</div></div>
<div><div style="font-size:26px;letter-spacing:4px;color:${AMAR};font-weight:700">LOGO · UNBOUNDED 900</div><div style="position:relative;height:220px">${LOGO(90, 'top:40px;left:40px')}</div><div style="font-size:26px;opacity:.85;line-height:1.35">O "O" de POD vira uma onda sonora. Inclinado −9°, sombra navy.</div></div></div>
</div>`));

// 4. elementos
const el = (t, demo, txt) => `<div style="background:rgba(255,255,255,.08);padding:28px;display:flex;flex-direction:column;gap:18px"><div style="height:170px;position:relative;display:flex;align-items:center;justify-content:center">${demo}</div><div class="bb" style="font-size:40px;line-height:1">${t}</div><div style="font-size:21px;line-height:1.35;opacity:.85">${txt}</div></div>`;
paginas.push(pag(AZUL, `${cab('03', 'ELEMENTOS')}
<div style="position:absolute;top:200px;left:110px;right:110px;display:grid;grid-template-columns:repeat(4,1fr);gap:26px">
${el('@ em etiquetas', `<div style="display:flex;flex-direction:column;gap:6px;font-weight:700;font-size:28px;color:${TINTA}"><div style="background:${AMAR};padding:2px 12px;margin-right:60px">@LIBERO<span style="font-weight:400">FILHO</span></div><div style="background:#e224d6;padding:2px 12px;margin-left:60px">@NATALIA<span style="font-weight:400">VALENCA</span></div></div>`, 'Nas capas: amarelo para o Líbero, magenta para a Natália.')}
${el('@ em linhas', `<div style="width:100%;display:flex;flex-direction:column;gap:50px;font-size:22px"><div style="display:flex;gap:12px;align-items:center"><span><b>@libero</b>filho</span><span style="flex:1;height:2px;background:#fff"></span></div><div style="display:flex;gap:12px;align-items:center"><span style="flex:1;height:2px;background:#fff"></span><span><b>@natalia</b>valenca</span></div></div>`, 'Nas páginas internas: um no topo, outro no rodapé.')}
${el('Caixa de destaque', `<div class="bb" style="background:#e224d6;font-size:90px;line-height:1;padding:10px 24px 0;transform:rotate(-2deg)">PALAVRA</div>`, 'A palavra que vende o título, em magenta, navy ou amarelo.')}
${el('Kicker + barra', `<div style="display:flex;flex-direction:column;gap:20px;align-items:flex-start"><div style="background:${TINTA};color:${AMAR};font-weight:700;font-size:24px;letter-spacing:4px;padding:6px 16px">PASSO 1</div><div style="width:86px;height:16px;background:${AMAR}"></div></div>`, 'Rótulo navy antes do título; barra amarela antes do texto.')}
${el('Palavra desfocada', `<div class="bb" style="font-size:150px;color:#e224d6;filter:blur(9px)">MÉTODO</div>`, 'Fundo com a palavra do tema desfocada, cortada na borda.')}
${el('Número vazado', `<div class="bb" style="font-size:230px;line-height:.8;color:transparent;-webkit-text-stroke:3px rgba(255,255,255,.5)">3</div>`, 'Numera passos e horas, grande, atrás do texto.')}
${el('Polaroide da dupla', `<div style="width:120px;height:150px;background:#fff;padding:8px 8px 26px;transform:rotate(-5deg)"><div style="width:100%;height:100%;background:${MAG}"></div></div><div style="width:120px;height:150px;background:#fff;padding:8px 8px 26px;transform:rotate(4deg);margin-left:-10px"><div style="width:100%;height:100%;background:${NAVY}"></div></div>`, 'No CTA: a foto de cada um, com o @ escrito embaixo.')}
${el('Objetos 3D', `<img src="../elementos/studio_microphone_3d.png" style="height:150px"><img src="../elementos/alarm_clock_3d.png" style="height:120px"><img src="../elementos/trophy_3d.png" style="height:130px">`, 'Quando não há foto: microfone, relógio, troféu, livros (Fluent Emoji, MIT).')}
</div>`));

// 5. regras
const regra = (n, t, txt) => `<div style="display:flex;gap:30px;align-items:flex-start"><span class="bb" style="font-size:110px;line-height:.8;color:#e224d6;width:110px">${n}</span><div><div class="bb" style="font-size:54px;line-height:1">${t}</div><div style="font-size:27px;line-height:1.35;margin-top:8px;max-width:620px">${txt}</div></div></div>`;
paginas.push(pag(AMAR, `${cab('04', 'REGRAS', TINTA)}
<div style="position:absolute;top:230px;left:110px;right:110px;display:grid;grid-template-columns:1fr 1fr;gap:56px 80px;color:${TINTA}">
${regra('1', 'Fundo muda a cada página', 'Azul, magenta, amarelo, navy e branco, sem dois iguais seguidos.')}
${regra('2', 'Capa sempre com os dois @', 'Etiquetas em cima, título com caixa de destaque e o logo PODCONST no canto.')}
${regra('3', 'Foto sem filtro', 'Foto da dupla limpa; escurece só onde entra texto. Sem foto, um objeto 3D.')}
${regra('4', 'Prova social só real', 'Print, número oficial ou resultado da prova. Nada de depoimento inventado.')}
</div>`, TINTA));

// posts
const fundosPost = [AZUL, MAG, NAVY, BRANCO];
const ordem = [...dados].reverse();
const quizzes = dados.filter(p => p.id.startsWith('quiz-'));
let k = 0;
function paginasQuiz() {
  for (let g = 0; g < quizzes.length; g += 5) {
    const grupo = quizzes.slice(g, g + 5);
    const fundo = fundosPost[k % 4], cor = fundo === BRANCO ? TINTA : '#fff';
    const cols = grupo.map(p => { const [a, b] = lista[p.id]; return `<div style="display:flex;flex-direction:column;gap:14px;align-items:center"><span style="background:${AMAR};color:${TINTA};font-weight:700;font-size:20px;padding:2px 10px">${p.id.slice(5)}</span><img src="${a}" style="width:224px;height:398px;box-shadow:0 14px 26px rgba(0,0,0,.25)"><img src="${b}" style="width:224px;height:398px;box-shadow:0 14px 26px rgba(0,0,0,.25)"></div>`; }).join('');
    paginas.push(pag(fundo, `${cab(String(paginas.length + 1).padStart(2, '0'), `QUIZ DE STORIES — ${grupo[0].id.slice(5)} A ${grupo[grupo.length - 1].id.slice(5)}`, cor, false)}
<div style="position:absolute;left:110px;right:110px;top:150px;font-size:23px;opacity:.85">Em cima, a pergunta com espaço para a enquete SIM/NÃO; embaixo, a resposta com o fundamento e espaço para a enquete “Você acertou?” · 1080×1920</div>
<div style="position:absolute;left:110px;right:110px;top:200px;display:flex;justify-content:center;gap:40px">${cols}</div>`, cor));
    k++;
  }
}
let quizFeito = false;
ordem.forEach(p => {
  if (p.id.startsWith('quiz-')) { if (!quizFeito) { quizFeito = true; paginasQuiz(); } return; }
  k++;
  const imgs = lista[p.id] || [];
  const n = imgs.length;
  const escuro = fundosPost[k % 4] !== BRANCO;
  const cor = escuro ? '#fff' : TINTA;
  let grade;
  if (n === 1) grade = `<img src="${imgs[0]}" style="position:absolute;right:140px;top:170px;max-height:820px;max-width:700px;box-shadow:0 30px 60px rgba(0,0,0,.35)">`;
  else {
    const cols = n <= 4 ? n : n <= 8 ? Math.ceil(n / 2) : 5;
    const rows = Math.ceil(n / cols);
    const h = rows === 1 ? 640 : 380, w = h * 0.8;
    grade = `<div style="position:absolute;left:110px;right:110px;top:${rows === 1 ? 300 : 230}px;display:flex;flex-wrap:wrap;gap:22px;justify-content:center">${imgs.map((s, i) => `<div style="position:relative"><img src="${s}" style="width:${w}px;height:${h}px;display:block;box-shadow:0 16px 30px rgba(0,0,0,.25)"><span style="position:absolute;top:-14px;left:-14px;background:${AMAR};color:${TINTA};font-weight:700;font-size:20px;padding:2px 10px">${i + 1}</span></div>`).join('')}</div>`;
  }
  const info = n === 1
    ? `<div style="position:absolute;left:110px;top:260px;width:860px;display:flex;flex-direction:column;gap:26px"><div class="bb" style="font-size:96px;line-height:.9">${p.titulo.replace(/^(Tela única|Linha calma) · /, '')}</div><div style="width:86px;height:16px;background:${AMAR}"></div><div style="font-size:30px;line-height:1.4;font-weight:600">${p.tema}</div><div style="font-size:24px;opacity:.75">Tela única · 1080×1350</div></div>`
    : `<div style="position:absolute;left:110px;right:110px;top:150px;font-size:23px;line-height:1.35;opacity:.85">${p.tema} · ${n} slides</div>`;
  paginas.push(pag(fundosPost[k % 4], `${cab(String(paginas.length + 1).padStart(2, '0'), n === 1 ? 'TELA ÚNICA' : p.titulo.replace(/ · /, ' — '), cor, false)}${info}${grade}`, cor));
});

const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Grotesk:wght@400;500;600;700&family=Unbounded:wght@900&display=swap" rel="stylesheet">
<style>@page{size:1920px 1080px;margin:0}*{box-sizing:border-box}body{margin:0;font-family:'Space Grotesk',sans-serif}
section{position:relative;width:1920px;height:1080px;overflow:hidden;page-break-after:always}
.bb{font-family:'Bebas Neue',sans-serif;font-weight:400}.blur{position:absolute;font-family:'Bebas Neue';line-height:1;filter:blur(14px);white-space:nowrap}</style></head>
<body>${paginas.join('\n')}</body></html>`;
const arq = path.join(root, 'build', 'apresentacao.html');
fs.writeFileSync(arq, html);
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto('file://' + arq);
await page.evaluate(() => Promise.all([document.fonts.ready, ...[...document.images].map(i => i.decode().catch(() => {}))]));
await page.waitForTimeout(500);
fs.mkdirSync(path.join(root, 'saida'), { recursive: true });
await page.pdf({ path: path.join(root, 'saida', 'apresentacao-podconst.pdf'), width: '1920px', height: '1080px', printBackground: true });
await browser.close();
console.log('✓ saida/apresentacao-podconst.pdf', paginas.length, 'páginas');

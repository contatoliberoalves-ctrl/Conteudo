// Pranchas de identidade visual do curso "Interpretação Bíblica" (Renato Torres): 4 direções, cada uma com
// logo, cores, fontes e aplicações (post 4:5, story 9:16 e slide de aula 16:9). O símbolo (V) fica pequeno.
// Uso: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node gerar.mjs
// Precisa de assets/simbolo.png (máscara do V, fora do git) e do playwright de algum molde.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const root = path.dirname(new URL(import.meta.url).pathname);
const { chromium } = createRequire(path.join(root, '../../moldes/treino-de-pecas/package.json'))('playwright');

const SIMB = 'data:image/png;base64,' + fs.readFileSync(path.join(root, 'assets/simbolo.png')).toString('base64');
const sim = (cor, px, extra = '') => `<span style="display:inline-block;flex:none;width:${px}px;height:${px}px;background:${cor};-webkit-mask:url(${SIMB}) center/contain no-repeat;mask:url(${SIMB}) center/contain no-repeat;${extra}"></span>`;
const VERSO = 'Procura apresentar-te a Deus aprovado, como obreiro que não tem de que se envergonhar, que maneja bem a palavra da verdade.';

const V = [
  { id: 'pergaminho', nome: 'Pergaminho', conceito: 'Clássica e serena: papel antigo, serifa elegante e o laranja do símbolo como lacre. Passa tradição e cuidado com o texto.',
    fontes: "family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Inter:wght@400;500;600;700",
    tit: "'Cormorant Garamond',serif", txt: "Inter,sans-serif", tipos: ['Cormorant Garamond', 'Inter'],
    cores: [['Papel', '#F3ECDF'], ['Tinta', '#2A1E16'], ['Lacre', '#D9480F'], ['Ouro velho', '#B08D57'], ['Pedra', '#8A7B6B']],
    bg: '#F3ECDF', ink: '#2A1E16', ac: '#D9480F', sec: '#B08D57',
    logo: (s, c = '#2A1E16') => `<div style="display:flex;flex-direction:column;align-items:center;text-align:center;color:${c}">
      <div style="font-family:Inter;font-weight:600;font-size:${s * .16}px;letter-spacing:.42em;margin-right:-.42em">INTERPRETAÇÃO</div>
      <div style="font-family:'Cormorant Garamond';font-style:italic;font-weight:600;font-size:${s}px;line-height:.95;margin-top:${s * .02}px">Bíblica</div>
      <div style="display:flex;align-items:center;gap:${s * .12}px;margin-top:${s * .12}px"><span style="width:${s * .7}px;height:1.5px;background:currentColor;opacity:.5"></span>${sim('#D9480F', s * .2)}<span style="width:${s * .7}px;height:1.5px;background:currentColor;opacity:.5"></span></div>
      <div style="font-family:Inter;font-weight:500;font-size:${s * .13}px;letter-spacing:.3em;margin-top:${s * .1}px;margin-right:-.3em">RENATO TORRES</div></div>`,
    moldura: c => `<div style="position:absolute;inset:36px;border:2px solid ${c};opacity:.35"></div><div style="position:absolute;inset:46px;border:1px solid ${c};opacity:.25"></div>` },
  { id: 'lampada', nome: 'Lâmpada', conceito: '"Lâmpada para os meus pés é a tua palavra" (Sl 119.105). Fundo noturno com a luz quente do símbolo: profunda, contemplativa e moderna.',
    fontes: "family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@400;500;700",
    tit: "'Playfair Display',serif", txt: "'DM Sans',sans-serif", tipos: ['Playfair Display', 'DM Sans'],
    cores: [['Noite', '#12131A'], ['Pergaminho', '#F5EFE6'], ['Chama', '#FF5A0A'], ['Brasa', '#FF9F1C'], ['Âmbar', '#F2B66D']],
    bg: 'radial-gradient(90% 70% at 50% 18%,#3A1E10 0%,#1A1414 42%,#12131A 75%)', ink: '#F5EFE6', ac: '#FF7A12', sec: '#F2B66D',
    logo: (s, c = '#F5EFE6') => `<div style="display:flex;flex-direction:column;align-items:flex-start;color:${c}">
      <div style="display:flex;align-items:center;gap:${s * .14}px;font-family:'DM Sans';font-weight:700;font-size:${s * .14}px;letter-spacing:.28em">${sim('linear-gradient(180deg,#FF5A0A,#FF9F1C)', s * .26)}CURSO</div>
      <div style="font-family:'Playfair Display';font-weight:800;font-size:${s}px;line-height:.98;margin-top:${s * .1}px">Interpretação</div>
      <div style="font-family:'Playfair Display';font-style:italic;font-weight:700;font-size:${s}px;line-height:1.05;background:linear-gradient(90deg,#FF5A0A,#FF9F1C);-webkit-background-clip:text;color:transparent">Bíblica</div>
      <div style="font-family:'DM Sans';font-weight:500;font-size:${s * .17}px;margin-top:${s * .14}px;opacity:.85">com Renato Torres</div></div>`,
    moldura: () => '' },
  { id: 'estudo', nome: 'Caderno de estudo', conceito: 'Editorial e didática: caderno pautado, referências em fonte mono como anotações de margem e o laranja como marca-texto. Ideal para aulas e materiais.',
    fontes: "family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,800;1,9..144,600&family=IBM+Plex+Mono:wght@500;600&family=Inter:wght@400;500;600",
    tit: "Fraunces,serif", txt: "Inter,sans-serif", tipos: ['Fraunces', 'IBM Plex Mono · Inter'],
    cores: [['Folha', '#FAF8F2'], ['Grafite', '#1D2A26'], ['Marca-texto', '#F25C05'], ['Sálvia', '#A8B5A0'], ['Pauta', '#DCE3EA']],
    bg: '#FAF8F2', ink: '#1D2A26', ac: '#F25C05', sec: '#A8B5A0',
    logo: (s, c = '#1D2A26') => `<div style="display:flex;flex-direction:column;align-items:flex-start;color:${c}">
      <div style="font-family:'IBM Plex Mono';font-weight:600;font-size:${s * .15}px;letter-spacing:.06em;color:#F25C05">// 2 Tm 2.15</div>
      <div style="font-family:Fraunces;font-weight:800;font-size:${s}px;line-height:.95;letter-spacing:-.02em;margin-top:${s * .08}px">Interpretação</div>
      <div style="font-family:Fraunces;font-weight:800;font-size:${s}px;line-height:1;letter-spacing:-.02em"><span style="background:linear-gradient(transparent 58%,rgba(242,92,5,.45) 58%,rgba(242,92,5,.45) 92%,transparent 92%)">Bíblica</span></div>
      <div style="display:flex;align-items:center;gap:${s * .1}px;font-family:'IBM Plex Mono';font-weight:500;font-size:${s * .15}px;margin-top:${s * .14}px">${sim(c, s * .2)}por Renato Torres</div></div>`,
    moldura: () => `<div style="position:absolute;inset:0;background-image:repeating-linear-gradient(0deg,transparent 0 47px,#DCE3EA 47px 49px)"></div><div style="position:absolute;top:0;bottom:0;left:120px;width:3px;background:#F25C05;opacity:.4"></div>` },
  { id: 'brasa', nome: 'Brasa', conceito: 'Vibrante e jovem, no degradê do próprio símbolo: tipografia forte em branco, ótima para anúncios, stories e redes. O V aparece como marca-d’água bem suave.',
    fontes: "family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,800&family=Inter:wght@400;500;700",
    tit: "'Bricolage Grotesque',sans-serif", txt: "Inter,sans-serif", tipos: ['Bricolage Grotesque', 'Inter'],
    cores: [['Brasa', '#FF4D00'], ['Laranja', '#FF8A00'], ['Creme', '#FFF4E8'], ['Carvão', '#2B0E00'], ['Branco', '#FFFFFF']],
    bg: 'linear-gradient(90deg,#FF4D00 0%,#FF8A00 100%)', ink: '#FFFFFF', ac: '#2B0E00', sec: '#FFF4E8',
    logo: (s, c = '#FFFFFF') => `<div style="display:flex;flex-direction:column;align-items:flex-start;color:${c}">
      <div style="font-family:'Bricolage Grotesque';font-weight:800;font-size:${s}px;line-height:.98;letter-spacing:-.035em;text-transform:uppercase">Interpretação<br>Bíblica</div>
      <div style="display:flex;align-items:center;gap:${s * .1}px;margin-top:${s * .16}px"><span style="background:#2B0E00;color:#FFF4E8;font-family:Inter;font-weight:700;font-size:${s * .15}px;letter-spacing:.14em;padding:${s * .05}px ${s * .12}px;border-radius:999px">RENATO TORRES</span>${sim(c, s * .22)}</div></div>`,
    moldura: () => `${sim('rgba(255,255,255,.09)', 1300, 'position:absolute;right:-380px;bottom:-420px')}` },
];

// ---------- Aplicações (tamanho real; a prancha reduz) ----------
const post = v => `<div style="position:relative;width:1080px;height:1350px;overflow:hidden;background:${v.bg};color:${v.ink};font-family:${v.txt}">${v.moldura(v.ink)}
  <div style="position:absolute;left:120px;right:120px;top:130px;display:flex;justify-content:space-between;align-items:center;font-weight:600;font-size:28px;letter-spacing:.2em;text-transform:uppercase"><span style="color:${v.ac === '#2B0E00' ? '#FFF4E8' : v.ac}">Aula 01</span>${sim(v.id === 'brasa' ? '#fff' : v.ac, 56)}</div>
  <div style="position:absolute;left:120px;right:120px;top:330px;font-family:${v.tit};font-weight:${v.id === 'pergaminho' ? 600 : 800};font-size:${v.id === 'brasa' ? 128 : 112}px;line-height:1.02;letter-spacing:${v.id === 'brasa' ? '-.03em' : '0'}">Ler a Bíblia é simples. <span style="${v.id === 'brasa' ? 'background:#2B0E00;color:#FFF4E8;padding:0 14px' : `font-style:italic;color:${v.ac}`}">Interpretar</span> exige método.</div>
  <div style="position:absolute;left:120px;right:120px;bottom:130px;display:flex;justify-content:space-between;align-items:flex-end"><div style="transform-origin:left bottom;transform:scale(.62)">${v.logo(110, v.ink)}</div><span style="font-weight:600;font-size:26px;letter-spacing:.14em;white-space:nowrap">ARRASTE →</span></div></div>`;
const story = v => `<div style="position:relative;width:1080px;height:1920px;overflow:hidden;background:${v.bg};color:${v.ink};font-family:${v.txt}">${v.moldura(v.ink)}
  <div style="position:absolute;left:0;right:0;top:380px;display:flex;justify-content:center">${v.id === 'pergaminho' ? v.logo(230) : `<div>${v.logo(v.id === 'brasa' ? 118 : 128)}</div>`}</div>
  <div style="position:absolute;left:120px;right:120px;top:1050px;text-align:center;font-family:${v.tit};font-weight:${v.id === 'pergaminho' ? 500 : 700};font-style:${v.id === 'brasa' ? 'normal' : 'italic'};font-size:58px;line-height:1.25;opacity:.92">“${VERSO}”<div style="font-family:${v.txt};font-style:normal;font-weight:600;font-size:30px;letter-spacing:.2em;margin-top:30px;opacity:.75">2 TIMÓTEO 2.15</div></div>
  <div style="position:absolute;left:0;right:0;bottom:200px;display:flex;justify-content:center"><span style="background:${v.id === 'brasa' ? '#2B0E00' : v.ac};color:#fff;font-weight:700;font-size:44px;padding:30px 60px;border-radius:999px">Inscrições abertas</span></div></div>`;
const slide = v => `<div style="position:relative;width:1920px;height:1080px;overflow:hidden;background:${v.id === 'lampada' || v.id === 'brasa' ? v.bg : v.bg};color:${v.ink};font-family:${v.txt}">${v.moldura(v.ink)}
  <div style="position:absolute;left:170px;top:120px;display:flex;align-items:center;gap:22px;font-weight:600;font-size:30px;letter-spacing:.2em;text-transform:uppercase">${sim(v.id === 'brasa' ? '#fff' : v.ac, 46)}Módulo 2 · Contexto</div>
  <div style="position:absolute;left:170px;top:260px;width:1000px;font-family:${v.tit};font-weight:${v.id === 'pergaminho' ? 600 : 800};font-size:120px;line-height:1">Quem escreveu, para quem e <span style="${v.id === 'brasa' ? 'background:#2B0E00;color:#FFF4E8;padding:0 14px' : `font-style:italic;color:${v.ac}`}">por quê?</span></div>
  <div style="position:absolute;left:170px;top:720px;width:900px;font-size:38px;line-height:1.4;opacity:.85">Antes de perguntar “o que isso significa pra mim?”, pergunte o que significou para os primeiros leitores.</div>
  <div style="position:absolute;right:150px;top:260px;width:520px;${v.id === 'brasa' ? 'background:#FFF4E8;color:#2B0E00' : v.id === 'lampada' ? 'background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.18)' : `background:#fff;border-left:8px solid ${v.ac}`};padding:50px;border-radius:${v.id === 'pergaminho' ? 0 : 24}px">
    <div style="font-weight:700;font-size:26px;letter-spacing:.18em;color:${v.id === 'lampada' ? v.sec : v.id === 'brasa' ? '#FF4D00' : v.ac}">PERGUNTAS DO TEXTO</div>
    ${['Autor', 'Destinatários', 'Época e lugar', 'Gênero literário', 'Propósito'].map((q, i) => `<div style="display:flex;gap:20px;align-items:baseline;font-size:34px;font-weight:500;padding:16px 0;border-bottom:1px solid currentColor;border-color:rgba(127,127,127,.25)"><span style="font-weight:700;font-size:24px;opacity:.6">0${i + 1}</span>${q}</div>`).join('')}</div>
  <div style="position:absolute;left:170px;bottom:80px;font-weight:600;font-size:24px;letter-spacing:.2em;opacity:.7">INTERPRETAÇÃO BÍBLICA · RENATO TORRES</div></div>`;

// ---------- Prancha 1920×1080 ----------
const escala = (html, w, h, k, extra = '') => `<div style="width:${w * k}px;height:${h * k}px;overflow:hidden;border-radius:14px;box-shadow:0 18px 40px rgba(0,0,0,.18);flex:none;${extra}"><div style="transform:scale(${k});transform-origin:0 0">${html}</div></div>`;
const prancha = (v, i) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?${v.fontes}&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0}body{width:1920px;height:1080px;background:#ECEAE6;font-family:Inter,sans-serif;color:#1c1c1c}</style></head><body>
<div style="position:absolute;left:70px;top:60px;width:700px;bottom:60px;display:flex;flex-direction:column">
  <div style="font-weight:700;font-size:22px;letter-spacing:.24em;color:#777">DIREÇÃO 0${i + 1}</div>
  <div style="font-family:${v.tit};font-weight:700;font-size:64px;margin-top:6px">${v.nome}</div>
  <p style="font-size:21px;line-height:1.45;color:#444;margin-top:12px">${v.conceito}</p>
  <div style="margin-top:30px;height:330px;border-radius:14px;overflow:hidden;position:relative;background:${v.bg};display:flex;align-items:center;justify-content:center">${v.moldura(v.ink)}<div style="position:relative">${v.logo(v.id === 'brasa' ? 82 : v.id === 'pergaminho' ? 120 : 84)}</div></div>
  <div style="display:flex;gap:12px;margin-top:22px">${v.cores.map(([n, h]) => `<div style="flex:1"><div style="height:76px;border-radius:10px;background:${h};border:1px solid rgba(0,0,0,.08)"></div><div style="font-size:16px;font-weight:600;margin-top:8px">${n}</div><div style="font-size:14px;color:#777">${h}</div></div>`).join('')}</div>
  <div style="display:flex;gap:30px;margin-top:22px;align-items:flex-end">
    <div><div style="font-family:${v.tit};font-size:76px;font-weight:700;line-height:1">Aa</div><div style="font-size:15px;color:#666;margin-top:4px">Títulos · ${v.tipos[0]}</div></div>
    <div><div style="font-family:${v.txt};font-size:76px;font-weight:500;line-height:1">Aa</div><div style="font-size:15px;color:#666;margin-top:4px">Texto · ${v.tipos[1]}</div></div>
    <div style="margin-left:auto;display:flex;gap:10px;align-items:center">${['#fff', v.id === 'brasa' ? '#FF4D00' : v.ac, '#1c1c1c'].map(c => `<div style="width:64px;height:64px;border-radius:12px;background:${c === '#fff' ? '#1c1c1c' : '#fff'};display:flex;align-items:center;justify-content:center">${sim(c, 40)}</div>`).join('')}</div>
  </div>
  <div style="font-size:14px;color:#888;margin-top:6px;text-align:right">símbolo pequeno, como assinatura</div>
</div>
<div style="position:absolute;left:830px;top:60px;right:70px;bottom:60px;display:flex;flex-direction:column;gap:26px">
  <div style="display:flex;gap:26px;align-items:flex-start">${escala(post(v), 1080, 1350, .4)}${escala(story(v), 1080, 1920, .281)}
    <div style="font-size:15px;color:#777;line-height:1.5;padding-top:6px">Post 4:5<br>Story 9:16<br><br>Slide de aula 16:9 ↓</div></div>
  ${escala(slide(v), 1920, 1080, .4)}
</div></body></html>`;

const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
fs.mkdirSync(path.join(root, 'build'), { recursive: true });
fs.mkdirSync(path.join(root, 'saida'), { recursive: true });
const pecas = { post: [post, 1080, 1350], story: [story, 1080, 1920], slide: [slide, 1920, 1080] };
for (const [i, v] of V.entries()) {
  const arq = path.join(root, 'build', `${v.id}.html`);
  fs.writeFileSync(arq, prancha(v, i));
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file://' + arq); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(root, 'saida', `0${i + 1}-${v.id}.png`) });
  // Peças em tamanho real
  for (const [nome, [fn, w, h]] of Object.entries(pecas)) {
    await page.setViewportSize({ width: w, height: h });
    await page.setContent(prancha(v, i).replace(/<body>[\s\S]*<\/body>/, `<body style="width:${w}px;height:${h}px">${fn(v)}</body>`));
    await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(root, 'saida', `0${i + 1}-${v.id}-${nome}.png`) });
  }
  await page.close();
  console.log('✓', v.nome);
}
await browser.close();

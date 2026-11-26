// Maquete (versão de celular) do site Ponto do Verbum redesenhado na identidade Brasa, seguindo a proposta
// "Prompt para o site" (identidades/interpretacao-biblica/prompt-site.mjs): início, página de curso, área do aluno,
// cursos e pagamento. Não é print da plataforma real: é a proposta desenhada, para usar no vídeo.
// Gera saida/verbum/site.png (1080 de largura, página inteira) e saida/verbum/site.json (topo de cada seção).
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { C, G, T, HEAD, sim } from '../renato-comum/brasa.mjs';
const root = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(root, 'saida', 'verbum'); fs.mkdirSync(OUT, { recursive: true });
const FO = n => 'file://' + path.join(root, 'fotos', n);
const I = 'font-family:Inter,sans-serif';
const pil = (s, bg = C.carvao, fg = C.creme) => `<span style="display:inline-block;${I};font-weight:700;font-size:11px;letter-spacing:.14em;background:${bg};color:${fg};padding:6px 12px;border-radius:999px">${s}</span>`;
const h = (s, px, cor = C.carvao) => `<div style="${T};font-size:${px}px;line-height:.98;color:${cor}">${s}</div>`;
const cx = (s, bg = G, fg = '#fff') => `<span style="background:${bg};color:${fg};padding:0 .12em;box-decoration-break:clone;-webkit-box-decoration-break:clone">${s}</span>`;
const p = (s, px = 15, cor = C.carvao, ex = '') => `<div style="${I};font-size:${px}px;line-height:1.6;color:${cor};${ex}">${s}</div>`;
const btn = (s, bg = G, fg = '#fff') => `<div style="display:inline-block;${I};font-weight:700;font-size:15px;background:${bg};color:${fg};padding:14px 26px;border-radius:999px">${s}</div>`;
const cab = `<div style="position:sticky;top:0;z-index:5;background:${C.creme};display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid rgba(43,14,0,.08)">
  <div style="display:flex;align-items:center;gap:8px">${sim(C.brasa, 26)}<span style="${T};font-size:17px;color:${C.carvao}">Ponto do Verbum</span></div>
  <span style="${I};font-weight:700;font-size:12px;border:2px solid ${C.carvao};border-radius:999px;padding:6px 12px;color:${C.carvao}">Área do aluno</span></div>`;
const CURSOS = [['01', 'Interpretação Bíblica', '9 aulas', 'Leia cada passagem no seu contexto.'], ['02', 'Preparação de Sermões', '10 aulas', 'Do texto ao esboço e à aplicação.'], ['03', 'Vida Intelectual', '6 aulas', 'Rotina, plano de leitura e constância.']];
const card = ([n, t, a, d]) => `<div style="background:#fff;border-radius:20px;padding:20px;box-shadow:0 10px 24px -12px rgba(43,14,0,.25)">
  <div style="display:flex;justify-content:space-between;align-items:center"><span style="${T};font-size:34px;color:${C.laranja}">${n}</span>${pil(a.toUpperCase(), 'rgba(255,77,0,.1)', C.brasa)}</div>
  ${h(t, 24)}${p(d, 14, C.carvao, 'margin-top:6px;opacity:.8')}<div style="margin-top:14px">${btn('Ver o curso')}</div></div>`;
const aula = (n, t, min, feito) => `<div style="display:flex;align-items:center;gap:12px;background:#fff;border-radius:14px;padding:12px 14px;margin-top:8px">
  <span style="flex:none;width:32px;height:32px;border-radius:10px;background:${feito ? G : 'rgba(43,14,0,.08)'};display:grid;place-items:center;${I};font-weight:700;font-size:13px;color:${feito ? '#fff' : C.carvao}">${feito ? '✓' : n}</span>
  <span style="flex:1;${I};font-weight:600;font-size:14px;color:${C.carvao}">${t}</span><span style="${I};font-size:12px;color:rgba(43,14,0,.55)">${min}</span></div>`;
const modulo = (titulo, aberto, aulas) => `<div style="background:${aberto ? 'rgba(255,77,0,.06)' : '#fff'};border-radius:18px;padding:14px;margin-top:10px">
  <div style="display:flex;justify-content:space-between;${I};font-weight:700;font-size:15px;color:${C.carvao}"><span>${titulo}</span><span style="color:${C.brasa}">${aberto ? '−' : '+'}</span></div>${aberto ? aulas : ''}</div>`;
const paginaCurso = (id, n, nome, aulasTxt, aprender, aulas) => `<section id="${id}">
  <div style="background:${G};padding:30px 20px 34px;position:relative;overflow:hidden">${sim('rgba(255,255,255,.1)', 260, 'position:absolute;right:-60px;bottom:-60px')}
    ${pil('CURSO ' + n)}<div style="height:12px"></div>${h(nome, 40, '#fff')}${p(aulasTxt + ' · aulas gravadas · assista no celular', 14, '#fff', 'margin-top:10px')}<div style="margin-top:16px">${btn('Quero começar', C.carvao)}</div></div>
  <div style="padding:24px 20px"><div style="${I};font-weight:700;font-size:11px;letter-spacing:.14em;color:${C.brasa}">O QUE VOCÊ VAI APRENDER</div>
    ${aprender.map((t, i) => `<div style="display:flex;gap:14px;align-items:baseline;margin-top:14px"><span style="${T};font-size:28px;color:${C.laranja}">${String(i + 1).padStart(2, '0')}</span>${p(t, 15)}</div>`).join('')}
    <div style="${I};font-weight:700;font-size:11px;letter-spacing:.14em;color:${C.brasa};margin-top:26px">MÓDULOS E AULAS</div>
    ${modulo('Módulo 1', true, aulas)}${modulo('Módulo 2', false)}</div></section>`;

const html = `<!doctype html><html><head>${HEAD}<style>*{box-sizing:border-box;margin:0}body{width:432px;background:${C.creme}}</style></head><body>
${cab}
<section id="inicio"><div style="background:${G};padding:30px 20px 0;position:relative;overflow:hidden;height:520px">
  ${pil('RENATO TORRES')}<div style="height:14px"></div>${h(`Estude a<br>Bíblia com<br>${cx('método', C.carvao)}`, 50, '#fff')}
  ${p('Formação Bíblica: 3 cursos para ler, ensinar e estudar a Palavra com segurança.', 15, '#fff', 'margin-top:12px;max-width:230px')}
  <div style="margin-top:18px">${btn('Conhecer os cursos', C.carvao)}</div>
  <img src="${FO('renato-sorriso-recorte.png')}" style="position:absolute;right:-70px;bottom:0;height:330px">
  ${sim('rgba(255,255,255,.85)', 26, 'position:absolute;left:20px;bottom:18px')}</div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:18px 20px">${[['3', 'cursos'], ['25', 'aulas'], ['100+', 'alunos']].map(([a, b]) => `<div style="background:#fff;border-radius:16px;padding:14px 8px;text-align:center"><div style="${T};font-size:30px;color:${C.brasa}">${a}</div>${p(b, 12, C.carvao, 'font-weight:600')}</div>`).join('')}</div></section>
${paginaCurso('interpretacao', '01', 'Interpretação Bíblica', '9 aulas', ['Quem escreveu, e para quem.', 'O que o texto significava para os primeiros leitores.', 'Ler o versículo dentro do capítulo e do livro.'],
  [aula(1, 'Por que interpretar', '', true), aula(2, 'Autor e destinatários', '', true), aula(3, 'O contexto histórico', '', false), aula(4, 'Os gêneros literários', '', false)].join(''))}
${paginaCurso('sermoes', '02', 'Preparação de Sermões', '10 aulas', ['Sermão temático, textual e expositivo.', 'Encontrar o eixo do texto.', 'Ilustrar e aplicar sem perder o foco.'],
  [aula(1, 'O que é pregar', '', true), aula(2, 'Temático, textual e expositivo', '', false), aula(3, 'O eixo do sermão', '', false)].join(''))}
<section id="aluno"><div style="background:${C.carvao};padding:22px 20px;display:flex;align-items:center;gap:12px">${sim(C.laranja, 28)}<span style="${T};font-size:22px;color:#fff">Área do aluno</span></div>
  <div style="padding:20px">${p('Olá! Bom te ver de novo 🙏', 16, C.carvao, 'font-weight:700')}
    <div style="background:${G};border-radius:20px;padding:18px;margin-top:14px;color:#fff"><div style="${I};font-weight:700;font-size:11px;letter-spacing:.14em">CONTINUAR ASSISTINDO</div>${h('Vida Intelectual · Aula 2', 24, '#fff')}${p('O plano de leitura do ano', 14, '#fff', 'margin-top:4px')}
      <div style="height:8px;border-radius:9px;background:rgba(255,255,255,.3);margin-top:14px"><div style="width:40%;height:100%;border-radius:9px;background:#fff"></div></div></div>
    ${CURSOS.map(([n, t, a], i) => `<div style="background:#fff;border-radius:18px;padding:16px;margin-top:12px"><div style="display:flex;justify-content:space-between;${I};font-weight:700;font-size:15px;color:${C.carvao}"><span>${t}</span><span style="color:${C.brasa}">${[67, 30, 33][i]}%</span></div>
      <div style="height:8px;border-radius:9px;background:rgba(43,14,0,.08);margin-top:10px"><div style="width:${[67, 30, 33][i]}%;height:100%;border-radius:9px;background:${G}"></div></div>${p(a, 12, C.carvao, 'margin-top:6px;opacity:.6')}</div>`).join('')}
    <div style="${I};font-weight:700;font-size:11px;letter-spacing:.14em;color:${C.brasa};margin-top:22px">MATERIAIS</div>
    ${[['📖', 'Caderno de estudos', 'acompanhe cada aula'], ['🙏', 'Devocional diário', 'bônus para todos os alunos']].map(([e, a, b]) => `<div style="display:flex;gap:12px;align-items:center;background:#fff;border-radius:16px;padding:14px;margin-top:10px"><span style="font-size:24px">${e}</span><div>${p(a, 15, C.carvao, 'font-weight:700;line-height:1.2')}${p(b, 12, C.carvao, 'opacity:.6;line-height:1.3')}</div></div>`).join('')}</div></section>
<section id="cursos" style="padding:26px 20px"><div style="${I};font-weight:700;font-size:11px;letter-spacing:.14em;color:${C.brasa}">FORMAÇÃO BÍBLICA</div>${h(`3 cursos em<br>${cx('uma só', G)} plataforma`, 38)}
  <div style="display:flex;flex-direction:column;gap:12px;margin-top:18px">${CURSOS.map(card).join('')}</div></section>
<section id="compra" style="background:${C.carvao};padding:30px 20px 40px">${pil('INSCRIÇÕES ABERTAS', G, '#fff')}<div style="height:14px"></div>${h('Formação Bíblica', 40, '#fff')}
  <div style="background:#fff;border-radius:20px;padding:20px;margin-top:18px">${['3 cursos completos', '25 aulas gravadas', 'Caderno de estudos', 'Devocional de bônus', 'Assista no celular'].map(t => `<div style="display:flex;gap:10px;align-items:center;margin-top:8px;${I};font-weight:600;font-size:15px;color:${C.carvao}"><span style="flex:none;width:22px;height:22px;border-radius:50%;background:${G};color:#fff;display:grid;place-items:center;font-size:12px">✓</span>${t}</div>`).join('')}
    <div style="${T};font-size:52px;color:${C.carvao};margin-top:16px">R$ 99</div>${p('pagamento único', 13, C.carvao, 'opacity:.6')}<div style="margin-top:14px">${btn('Garantir minha vaga')}</div></div></section>
</body></html>`;

const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors', '--allow-file-access-from-files'] });
const browser = await chromium.launch(launch);
const page = await browser.newPage({ viewport: { width: 432, height: 900 }, deviceScaleFactor: 2.5 });
const arq = path.join(root, 'build', 'verbum-site.html'); fs.mkdirSync(path.dirname(arq), { recursive: true }); fs.writeFileSync(arq, html);
await page.goto('file://' + arq); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(400);
await page.addStyleTag({ content: 'div[style*="sticky"]{position:relative!important}' });
const tops = await page.evaluate(() => Object.fromEntries([...document.querySelectorAll('section')].map(s => [s.id, Math.round(s.getBoundingClientRect().top + scrollY)])));
await page.screenshot({ path: path.join(OUT, 'site.png'), fullPage: true });
await page.screenshot({ path: path.join(OUT, 'cabecalho.png'), clip: { x: 0, y: 0, width: 432, height: 58 } });
fs.writeFileSync(path.join(OUT, 'site.json'), JSON.stringify({ escala: 2.5, cabecalho: 58, tops }));
await browser.close();
console.log('✓ site', tops);

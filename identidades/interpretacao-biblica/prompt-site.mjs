// PDF A4 "Prompt para o site" no visual da proposta Ponto do Verbum (identidade Brasa: degradê laranja, creme e
// carvão, Bricolage Grotesque + Inter, símbolo V discreto). Traz a identidade, o que melhorar por página e um
// prompt pronto para colar numa IA de criação de sites.
// Uso: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node prompt-site.mjs  → saida/prompt-site-ponto-do-verbum.pdf
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { C, G, T, esc, sim } from '../../moldes/renato-comum/brasa.mjs';
const root = path.dirname(new URL(import.meta.url).pathname);
const { chromium } = createRequire(path.join(root, '../../moldes/treino-de-pecas/package.json'))('playwright');

const RODAPE = 'PROPOSTA DE LÍBERO FILHO · OUTUBRO 2026';
const hl = (s, bg = G, fg = '#fff') => esc(s).replace(/\[\[(.+?)\]\]/g, `<span style="background:${bg};color:${fg};padding:0 .14em;box-decoration-break:clone;-webkit-box-decoration-break:clone">$1</span>`).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
const topo = (sec, escuro) => `<div class="topo"><span class="pil" style="background:${escuro ? G : C.carvao};color:${escuro ? '#fff' : C.creme}">PONTO DO VERBUM</span><span style="color:${escuro ? C.creme : C.carvao};opacity:.6">${esc(sec)}</span></div>`;
const pe = (sec, n, escuro) => `<div class="pe" style="color:${escuro ? C.creme : C.carvao}"><span style="opacity:.55">${RODAPE}</span><span><b style="color:${C.laranja}">${esc(sec)}</b>  /  ${String(n).padStart(2, '0')}</span></div>`;
const tit = (s, cor = C.carvao, px = 40) => `<h1 style="${T};font-size:${px}px;line-height:.98;color:${cor}">${hl(s)}</h1>`;
const kick = (s, cor = C.brasa) => `<div class="kick" style="color:${cor}">${esc(s)}</div>`;

// ---------- conteúdo ----------
const PALETA = [
  ['Brasa', C.brasa, 'Cor principal: botões, destaques, links.'],
  ['Laranja', C.laranja, 'Fim do degradê, números, hover.'],
  ['Creme', C.creme, 'Fundo padrão das páginas.'],
  ['Carvão', C.carvao, 'Texto, rodapé e seções escuras.'],
  ['Branco', C.branco, 'Cartões sobre o creme.'],
];
const PAGINAS = [
  ['Página inicial', ['Hero em degradê com título forte, subtítulo e um botão principal ("Conhecer os cursos").', 'Foto do Pastor em boa qualidade à direita; símbolo V discreto no canto.', 'Faixa de números reais (alunos, aulas, cursos) logo abaixo.', 'Cursos em cartões brancos; Clube do Livro; sobre o Pastor; depoimentos; perguntas frequentes; chamada final em carvão.']],
  ['Página de cada curso', ['Cabeçalho em degradê com nome do curso, para quem é e o botão de compra.', '"O que você vai aprender" em lista numerada 01, 02, 03.', 'Módulos e aulas em acordeão, com a duração de cada um.', 'No celular, botão de compra fixo no pé da tela.']],
  ['Área do aluno', ['Fundo creme, menu lateral em carvão.', 'Cartão "Continuar assistindo" no topo.', 'Barra de progresso laranja em cada curso.', 'Materiais (guia, caderno de atividades) junto da aula.']],
  ['Clube do Livro', ['Os 12 livros do ano em grade, com mês e capa.', 'Vídeo do mês em destaque; cronograma de leitura e perguntas logo abaixo.', 'Espaço para anotações do aluno.']],
  ['Checkout e login', ['Visual limpo, creme/branco, um único botão laranja.', 'Resumo do que está incluído (cursos, plataforma, acesso).', 'Nada de cores fora da paleta.']],
];
const PROMPT = `Você é designer de produto e desenvolvedor front-end. Quero redesenhar o site [COLE AQUI O LINK DO SITE], a plataforma Ponto do Verbum, do Pastor Renato Torres (cursos Interpretação Bíblica, Vida Intelectual e Preparação de Sermões, e o Clube do Livro), aplicando a identidade visual "Brasa".

Mantenha todos os textos, a estrutura de páginas, as URLs e as funcionalidades (login, área do aluno, pagamento). Mude o visual e melhore a usabilidade.

1. CORES (crie como variáveis CSS em :root)
--brasa: #FF4D00 (cor principal: botões, destaques, links)
--laranja: #FF8A00 (fim do degradê, números, hover)
--creme: #FFF4E8 (fundo padrão das páginas)
--carvao: #2B0E00 (texto, rodapé e seções escuras)
--branco: #FFFFFF (cartões)
Degradê da marca: linear-gradient(90deg, #FF4D00, #FF8A00), usado só no topo (hero), nos botões principais e em faixas de seção.
Texto corrido sempre em carvão sobre creme ou branco; nunca texto laranja longo. Não use outras cores (nada de azul, verde ou roxo).

2. TIPOGRAFIA (Google Fonts)
Títulos: Bricolage Grotesque, peso 800, caixa alta, letter-spacing -0.035em.
Texto: Inter 400 a 700, 16 a 18px, entrelinha 1.6.
Rótulos pequenos: Inter 700, caixa alta, letter-spacing 0.14em.
Só essas duas fontes.

3. ELEMENTOS DA MARCA
- Pílula carvão com texto creme para rótulos (ex.: "RENATO TORRES", nome da seção).
- Destaque de palavra em caixa sólida: degradê com texto branco no fundo creme; carvão no fundo em degradê.
- Numeração grande 01, 02, 03 em laranja.
- Símbolo V (logo) discreto: pequeno no canto inferior direito do hero e do rodapé, e como marca-d'água grande com 6 a 9% de opacidade. Nunca grande no centro.

4. RITMO DAS SEÇÕES
Hero em degradê → seções de conteúdo em creme com cartões brancos (raio 20px, sombra suave) → uma seção em carvão perto do fim (depoimentos ou chamada final) → rodapé em carvão. Bastante espaço em branco.

5. PÁGINAS
- Início: hero com título, subtítulo, botão "Conhecer os cursos" e foto do Pastor; faixa com números reais; cursos em cartões; Clube do Livro; sobre o Pastor; depoimentos; perguntas frequentes; chamada final.
- Curso: cabeçalho em degradê, "o que você vai aprender" numerado, módulos em acordeão com duração, botão de compra fixo no celular.
- Área do aluno: fundo creme, menu lateral carvão, cartão "Continuar assistindo", barra de progresso laranja, materiais junto da aula.
- Clube do Livro: os 12 livros em grade com o mês, vídeo do mês em destaque, cronograma de leitura e perguntas.
- Pagamento e login: limpos, um único botão laranja, resumo do que está incluído.

6. COMPONENTES
Botão principal: degradê, texto branco, raio 999px, hover #E64500. Botão secundário: contorno carvão de 2px.
Cartão de curso: branco, raio 20px, número laranja, título em Bricolage, botão.
Cabeçalho fixo: creme com logo à esquerda e botão "Área do aluno" à direita.

7. QUALIDADE
Contraste AA, foco visível (contorno laranja 3px), texto alternativo nas imagens, áreas de toque de 44px, mobile primeiro, imagens em WebP, fontes com display=swap.

8. ENTREGA
Os tokens CSS, os componentes (botão, pílula, cartão, faixa de seção, cabeçalho, rodapé) e as páginas atualizadas. No fim, liste o que mudou em cada página.`;
const PASSOS = [
  ['Abra a ferramenta do site', 'Lovable, v0, Framer AI, Claude ou a IA do construtor que vocês usam.'],
  ['Troque o link', 'Substitua [COLE AQUI O LINK DO SITE] pelo endereço real e cole o prompt inteiro.'],
  ['Envie o símbolo', 'Anexe o V em PNG transparente e uma foto do Pastor em boa qualidade.'],
  ['Peça por partes', 'Primeiro os tokens e componentes; depois a página inicial; depois as outras.'],
  ['Revise com o checklist', 'Cores só da paleta, duas fontes, símbolo discreto, botões laranja, celular perfeito.'],
];

// ---------- páginas ----------
const pg = (bg, html) => `<section class="pg" style="background:${bg}">${html}</section>`;
const capa = pg(G, `${topo('PROMPT · REDESIGN DO SITE', true)}
  ${sim('rgba(255,255,255,.1)', 520, 'position:absolute;right:-120px;top:120px')}
  <div style="position:absolute;left:56px;right:56px;top:300px">
    <div class="kick" style="color:#fff;opacity:.85">OUTUBRO 2026  →  PLATAFORMA PONTO DO VERBUM</div>
    <h1 style="${T};font-size:64px;line-height:.95;color:#fff;margin-top:22px">COMO MELHORAR<br>O SITE COM AS<br>CORES DO <span style="background:${C.carvao};color:#fff;padding:0 .12em">RENATO</span></h1>
    <p style="font-size:17px;color:#fff;margin-top:22px;max-width:420px;line-height:1.5">A identidade Brasa aplicada ao site, página por página, e um prompt pronto para colar numa IA de criação de sites.</p>
  </div>
  <div style="position:absolute;left:56px;right:56px;bottom:120px;display:grid;grid-template-columns:repeat(3,1fr);gap:20px;color:#fff">
    ${[['01', 'A identidade Brasa'], ['02', 'O que melhorar em cada página'], ['03', 'O prompt pronto']].map(([n, t]) => `<div><div style="${T};font-size:30px">${n}</div><div style="font-size:13px;margin-top:6px">${t}</div></div>`).join('')}
  </div>
  <div class="pe" style="color:#fff"><span>${RODAPE}</span><span>POR RENATO TORRES</span></div>
`);

const identidade = pg(C.creme, `${topo('01 / IDENTIDADE')}
  <div class="miolo">
    ${kick('01 / A IDENTIDADE BRASA')}${tit('AS CORES E AS [[FONTES]] DO SITE')}
    <p class="lead">O site passa a falar a mesma língua dos posts, das aulas e desta proposta: degradê laranja no topo, creme nas páginas e carvão no fechamento.</p>
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-top:22px">
      ${PALETA.map(([n, c, d]) => `<div style="background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 6px 18px rgba(43,14,0,.07)"><div style="height:86px;background:${c};${c === C.branco || c === C.creme ? 'border-bottom:1px solid rgba(43,14,0,.1)' : ''}"></div><div style="padding:10px 12px"><div style="font-weight:700;font-size:13px">${n}</div><div style="font-size:11px;opacity:.7;font-family:monospace">${c}</div><div style="font-size:10.5px;margin-top:6px;line-height:1.35">${d}</div></div></div>`).join('')}
    </div>
    <div style="height:56px;border-radius:14px;background:${G};margin-top:14px;display:flex;align-items:center;padding:0 18px;color:#fff;font-weight:700;font-size:13px;letter-spacing:.08em">DEGRADÊ · #FF4D00 → #FF8A00 · só no topo, botões principais e faixas</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:22px">
      <div class="card"><div class="kick">TÍTULOS</div><div style="${T};font-size:34px;margin-top:8px">BRICOLAGE<br>GROTESQUE 800</div><div class="mini">Caixa alta, espaçamento -0,035em.</div></div>
      <div class="card"><div class="kick">TEXTO</div><div style="font-size:24px;font-weight:600;margin-top:8px">Inter 400 a 700</div><div class="mini">16 a 18px no site, entrelinha 1,6. Rótulos em caixa alta com espaçamento.</div></div>
    </div>
    <div class="kick" style="margin-top:24px;color:${C.carvao}">ELEMENTOS DA MARCA</div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:10px">
      <div class="card c"><span class="pil" style="background:${C.carvao};color:${C.creme}">RENATO TORRES</span><div class="mini">Pílula carvão nos rótulos</div></div>
      <div class="card c"><span style="${T};font-size:22px"><span style="background:${G};color:#fff;padding:0 .12em">DESTAQUE</span></span><div class="mini">Palavra em caixa sólida</div></div>
      <div class="card c"><span style="${T};font-size:34px;color:${C.laranja}">01</span><div class="mini">Números grandes em laranja</div></div>
      <div class="card c">${sim(C.brasa, 36)}<div class="mini">Símbolo V pequeno, no canto</div></div>
    </div>
  </div>${pe('IDENTIDADE', 2)}`);

const paginas = pg(C.creme, `${topo('02 / PÁGINAS')}
  <div class="miolo">
    ${kick('02 / PÁGINA POR PÁGINA')}${tit('O QUE MELHORAR EM [[CADA PÁGINA]]')}
    <p class="lead">Mesmo conteúdo, mesma estrutura e as mesmas funções. Muda o visual e fica mais fácil chegar ao curso.</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:20px">
      ${PAGINAS.map(([n, it], i) => `<div class="card" style="${i === 0 ? 'grid-row:span 2' : ''}"><div style="display:flex;align-items:baseline;gap:10px"><span style="${T};font-size:26px;color:${C.laranja}">${String(i + 1).padStart(2, '0')}</span><span style="${T};font-size:17px">${esc(n)}</span></div>
        <ul>${it.map(x => `<li>${hl(x)}</li>`).join('')}</ul></div>`).join('')}
    </div>
    <div style="margin-top:14px;background:${C.carvao};color:${C.creme};border-radius:16px;padding:16px 20px;font-size:13px;line-height:1.5"><b style="color:${C.laranja}">RITMO DAS SEÇÕES</b>  ·  Topo em degradê → conteúdo em creme com cartões brancos → uma faixa carvão perto do fim → rodapé carvão.</div>
  </div>${pe('PÁGINAS', 3)}`);

// O prompt ocupa duas páginas em carvão, em blocos que não se partem.
const blocos = PROMPT.split('\n\n');
const meio = Math.ceil(blocos.length / 2) - 1;
const caixa = bs => `<div class="prompt">${bs.map(b => `<p>${esc(b).replace(/\n/g, '<br>')}</p>`).join('')}</div>`;
const prompt1 = pg(C.carvao, `${topo('03 / PROMPT', true)}
  ${sim('rgba(255,138,0,.07)', 420, 'position:absolute;right:-100px;bottom:-60px')}
  <div class="miolo">
    ${kick('03 / O PROMPT PRONTO', C.laranja)}${tit('COPIE, TROQUE O LINK E [[COLE]]', '#fff')}
    <p class="lead" style="color:${C.creme}">Funciona no Lovable, v0, Framer AI, Claude ou na IA do construtor do site.</p>
    ${caixa(blocos.slice(0, meio))}
  </div>${pe('PROMPT', 4, true)}`);
const prompt2 = pg(C.carvao, `${topo('03 / PROMPT', true)}
  <div class="miolo" style="top:96px">${caixa(blocos.slice(meio))}</div>${pe('PROMPT', 5, true)}`);

const usar = pg(C.creme, `${topo('PRÓXIMOS PASSOS')}
  <div class="miolo">
    ${kick('PRÓXIMOS PASSOS')}${tit('COMO USAR [[O PROMPT]]')}
    <div style="margin-top:22px;display:flex;flex-direction:column;gap:10px">
      ${PASSOS.map(([t, d], i) => `<div class="card" style="display:flex;gap:18px;align-items:center"><span style="${T};font-size:32px;color:${C.laranja};width:48px">${String(i + 1).padStart(2, '0')}</span><div><div style="font-weight:700;font-size:15px">${esc(t)}</div><div class="mini" style="margin-top:2px">${hl(d)}</div></div></div>`).join('')}
    </div>
    <div style="margin-top:18px;background:${G};border-radius:16px;padding:20px 22px;color:#fff">
      <div style="${T};font-size:20px">CHECKLIST ANTES DE PUBLICAR</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px 18px;margin-top:10px;font-size:13px">
        ${['Só as 5 cores da paleta', 'Duas fontes: Bricolage e Inter', 'Degradê só no topo e nos botões', 'Texto longo sempre em carvão', 'Símbolo V pequeno, no canto', 'Celular testado em todas as páginas', 'Botão de compra sempre visível', 'Contraste e foco visíveis'].map(x => `<div>✓  ${x}</div>`).join('')}
      </div>
    </div>
    <p style="margin-top:16px;font-size:13px;line-height:1.5;color:${C.carvao}">O senhor fica com o conteúdo; nós cuidamos da produção, da organização e da publicação.</p>
  </div>${pe('RESUMO', 6)}`);

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>@page{size:A4;margin:0}*{box-sizing:border-box;margin:0;padding:0}body{font-family:Inter,sans-serif;color:${C.carvao};-webkit-font-smoothing:antialiased;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{position:relative;width:210mm;height:297mm;overflow:hidden;page-break-after:always}
.topo{position:absolute;left:56px;right:56px;top:36px;display:flex;gap:12px;align-items:center;font-size:10px;font-weight:700;letter-spacing:.14em}
.pil{display:inline-block;border-radius:999px;padding:4px 11px;font-size:10px;font-weight:700;letter-spacing:.14em}
.pe{position:absolute;left:56px;right:56px;bottom:30px;display:flex;justify-content:space-between;font-size:9.5px;font-weight:600;letter-spacing:.12em}
.miolo{position:absolute;left:56px;right:56px;top:92px}
.kick{font-size:11px;font-weight:700;letter-spacing:.16em;margin-bottom:10px}
.lead{font-size:14px;line-height:1.55;margin-top:12px;max-width:560px}
.card{background:#fff;border-radius:16px;padding:16px 18px;box-shadow:0 6px 18px rgba(43,14,0,.07)}
.card.c{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center;min-height:104px}
.mini{font-size:11.5px;line-height:1.45;opacity:.85}
ul{margin-top:10px;padding-left:16px;font-size:12px;line-height:1.5}li{margin-bottom:4px}li::marker{color:${C.brasa}}
.prompt{margin-top:18px;background:rgba(255,244,232,.06);border:1px solid rgba(255,138,0,.35);border-radius:16px;padding:18px 20px;color:${C.creme};font-family:'Inter',sans-serif;font-size:11.2px;line-height:1.5}
.prompt p{margin-bottom:9px;break-inside:avoid}</style></head><body>
${capa}${identidade}${paginas}${prompt1}${prompt2}${usar}</body></html>`;

fs.mkdirSync(path.join(root, 'saida'), { recursive: true });
fs.writeFileSync(path.join(root, 'saida', 'prompt-site.html'), html);
fs.writeFileSync(path.join(root, 'saida', 'prompt-site.txt'), PROMPT + '\n');
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
const page = await browser.newPage();
await page.goto('file://' + path.join(root, 'saida', 'prompt-site.html'));
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(500);
// Confere se algum bloco passa do pé da página.
const fora = await page.evaluate(() => [...document.querySelectorAll('.pg')].map((p, i) => { const m = p.querySelector('.miolo'); return m && m.getBoundingClientRect().bottom > p.getBoundingClientRect().bottom - 60 ? i + 1 : 0; }).filter(Boolean));
if (fora.length) console.log('! conteúdo encostando no rodapé nas páginas', fora.join(', '));
await page.pdf({ path: path.join(root, 'saida', 'prompt-site-ponto-do-verbum.pdf'), format: 'A4', printBackground: true });
await browser.close();
console.log('✓ saida/prompt-site-ponto-do-verbum.pdf');

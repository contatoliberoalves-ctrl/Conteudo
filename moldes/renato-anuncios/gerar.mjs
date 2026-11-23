// Anúncios da Formação Bíblica (Ponto do Verbum), artes A1–A14 do documento "Prompts de artes · Formação Bíblica" (23/11/2026).
// Estilo editorial sóbrio: creme #F6F0E6, vinho #5A1F2A, dourado #C9A15A em detalhe fino; Literata (título) + Inter (apoio).
// Textos exatamente como no documento. Cada arte em feed 1080×1350 e stories 1080×1920 (250 px livres em cima e embaixo).
// Uso: node gerar.mjs [filtro]  (nuvem: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node gerar.mjs)
// Saída: saida/feed/A1.png, saida/feed/A2-1.png… e saida/stories/…
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const req = createRequire(import.meta.url);
let chromium; try { ({ chromium } = req('playwright')); } catch { ({ chromium } = req('/opt/node-tools/node_modules/playwright')); }
const root = path.dirname(new URL(import.meta.url).pathname);
const filtro = process.argv[2] || '';

const CREME = '#F6F0E6', VINHO = '#5A1F2A', OURO = '#C9A15A', CINZA = '#E6E2DC', TINTA = '#2B1A1D';
const FONTES = 'https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,600;7..72,700;7..72,800&family=Inter:wght@400;500;600&display=swap';
const T = "font-family:'Literata',serif;font-weight:800;letter-spacing:-0.02em";
const I = "font-family:'Inter',sans-serif";
const FMT = { feed: { w: 1080, h: 1350, top: 130, bot: 120 }, stories: { w: 1080, h: 1920, top: 330, bot: 330 } };
const M = 100;

// Cores por fundo.
const COR = f => f === 'vinho' ? { bg: VINHO, tit: '#F7EEE4', txt: 'rgba(247,238,228,.86)', sub: 'rgba(247,238,228,.62)' }
  : { bg: CREME, tit: VINHO, txt: '#4A3A3C', sub: '#8A7A78' };

// Moldura comum: fundo, rodapé "Formação Bíblica · Ponto do Verbum" à esquerda.
const tela = (fmt, fundo, corpo) => {
  const F = FMT[fmt], c = COR(fundo);
  return `<div style="position:relative;width:${F.w}px;height:${F.h}px;overflow:hidden;background:${c.bg}">${corpo(F, c)}
    <div style="position:absolute;left:${M}px;bottom:${fmt === 'stories' ? 270 : 70}px;${I};font-weight:500;font-size:22px;letter-spacing:.04em;color:${c.sub}">Formação Bíblica · Ponto do Verbum</div></div>`;
};
const fio = (w = 72) => `<div style="width:${w}px;height:3px;background:${OURO}"></div>`;
const chamada = (s, c) => `<div style="${I};font-weight:600;font-size:28px;letter-spacing:.02em;color:${c.tit}">${s}</div>`;

// Estático: título no alto, apoio, chamada pequena com fio dourado acima do rodapé.
const estatico = (fundo, titulo, apoio, cham, { px = 104, dir = 40 } = {}) => fmt => tela(fmt, fundo, (F, c) => `
  <div style="position:absolute;left:${M}px;right:${M + dir}px;top:${F.top + (fmt === 'stories' ? 140 : 70)}px">
    <div style="${T};font-size:${fmt === 'stories' ? px * 1.12 : px}px;line-height:1.06;color:${c.tit}">${titulo}</div>
    ${apoio ? `<div style="${I};font-size:${fmt === 'stories' ? 40 : 36}px;line-height:1.45;color:${c.txt};margin-top:${fmt === 'stories' ? 60 : 46}px;max-width:820px">${apoio}</div>` : ''}</div>
  ${cham ? `<div style="position:absolute;left:${M}px;bottom:${F.bot + (fmt === 'stories' ? 60 : 50)}px;display:flex;flex-direction:column;gap:22px">${fio()}${chamada(cham, c)}</div>` : ''}`);

// Telas de carrossel.
// Capa e itens centralizados na vertical (área útil entre topo e rodapé).
const meio = (F, html) => `<div style="position:absolute;left:${M}px;right:${M + 30}px;top:${F.top}px;bottom:${F.bot + 60}px;display:flex;flex-direction:column;justify-content:center">${html}</div>`;
const capaC = (fundo, titulo, px = 124) => fmt => tela(fmt, fundo, (F, c) => meio(F, `${fio(96)}<div style="${T};font-size:${fmt === 'stories' ? px * 1.12 : px}px;line-height:1.05;color:${c.tit};margin-top:50px">${titulo}</div>`));
const itemC = (fundo, n, texto, px = 84) => fmt => tela(fmt, fundo, (F, c) => meio(F, `
    ${n ? `<div style="${T};font-weight:600;font-size:${fmt === 'stories' ? 230 : 200}px;line-height:.9;color:${OURO}">${n}</div>` : fio(96)}
    <div style="${T};font-size:${(fmt === 'stories' ? px * 1.1 : px) * 1.2}px;line-height:1.1;color:${c.tit};margin-top:${n ? 50 : 56}px">${texto}</div>`));
const fimC = (fundo, texto, cham, px = 92) => estatico(fundo, texto, '', cham, { px });
// Texto "Termo: definição" com o termo em ouro.
const termo = s => s.replace(/^([^:]+:)/, `<span style="color:${OURO}">$1</span>`);

const A = {};
A.A1 = estatico('creme', 'Ler a Bíblia é diferente de estudar a Bíblia.', 'Estudar é fazer perguntas ao texto: quem escreveu, para quem e por quê.', 'Interpretação Bíblica · 9 aulas');
A['A2-1'] = capaC('creme', '3 perguntas para fazer antes de ler um versículo');
A['A2-2'] = itemC('creme', '1', 'Quem escreveu, e para quem?');
A['A2-3'] = itemC('creme', '2', 'O que isso significava para os primeiros leitores?');
A['A2-4'] = itemC('creme', '3', 'O que dizem os versículos ao redor?');
A['A2-5'] = fimC('creme', 'Isso se chama hermenêutica. E pode ser aprendido.', '3 cursos · 25 aulas · R$ 99');
A['A3-1'] = capaC('creme', '4 cuidados ao ler a Bíblia', 124);
['Ler o versículo dentro do capítulo', 'Lembrar a cultura e a época do texto', 'Distinguir narrativa de ensinamento', 'Reconhecer o gênero: poesia, carta, profecia'].forEach((s, i) => { A[`A3-${i + 2}`] = itemC('creme', '', s, 90); });
A['A3-6'] = fimC('creme', 'Aprenda o método completo', 'Formação Bíblica · R$ 99', 110);
// A4: dividido (feed lado a lado; stories em cima e embaixo, para o texto caber com folga).
A.A4 = fmt => tela(fmt, 'creme', (F, c) => {
  const lado = (rot, txt, bg, est) => `<div style="position:absolute;${est};background:${bg};padding:${fmt === 'stories' ? '0 100px' : '0 60px'};display:flex;flex-direction:column;justify-content:center;gap:34px">
      <div style="${I};font-weight:600;font-size:24px;letter-spacing:.22em;color:${rot === 'ANTES' ? '#8A7A78' : OURO}">${rot}</div>
      <div style="${T};font-size:${fmt === 'stories' ? 72 : 58}px;line-height:1.14;color:${rot === 'ANTES' ? '#5B5052' : VINHO}">${txt}</div></div>`;
  return fmt === 'stories'
    ? lado('ANTES', 'Leio um versículo solto e tiro minhas conclusões.', CINZA, `left:0;right:0;top:0;height:960px;padding-top:250px !important`) + lado('DEPOIS', 'Leio o contexto, o autor e a intenção do texto.', CREME, 'left:0;right:0;top:960px;height:960px;padding-bottom:250px !important') +
      `<div style="position:absolute;left:${M}px;bottom:330px">${chamada('Interpretação Bíblica · 9 aulas', c)}</div>`
    : lado('ANTES', 'Leio um versículo solto e tiro minhas conclusões.', CINZA, 'left:0;top:0;width:540px;bottom:0') + lado('DEPOIS', 'Leio o contexto, o autor e a intenção do texto.', CREME, 'left:540px;top:0;width:540px;bottom:0') +
      `<div style="position:absolute;left:600px;bottom:150px">${chamada('Interpretação Bíblica · 9 aulas', c)}</div>`;
});
A.A5 = estatico('vinho', 'Toda passagem tem um contexto.', 'Aprenda a lê-lo com método e segurança.', '3 cursos · 25 aulas · R$ 99', { px: 116 });
A.A6 = estatico('creme', 'Você ensina na célula ou na Escola Bíblica?', 'Aprenda a preparar estudos fiéis ao texto, do esboço à aplicação.', 'Preparação de Sermões · 10 aulas');
A['A7-1'] = capaC('vinho', 'Sermão temático, textual ou expositivo: qual a diferença?', 98);
['Temático: parte de um assunto e reúne textos sobre ele.', 'Textual: as ideias principais saem de um texto curto.', 'Expositivo: explica uma passagem na sequência em que foi escrita.'].forEach((s, i) => { A[`A7-${i + 2}`] = itemC('vinho', '', termo(s), 80); });
A['A7-5'] = fimC('vinho', 'Saber quando usar cada um muda a sua pregação.', 'Preparação de Sermões · 10 aulas', 96);
// A8: linha dourada vertical no centro com três ramos finos.
A.A8 = fmt => {
  const base = estatico('creme', 'Todo bom sermão tem um eixo.', 'Uma ideia central, tirada do texto, que organiza tudo o que você vai dizer.', 'Preparação de Sermões · 10 aulas', { px: 104, dir: 160 })(fmt);
  const F = FMT[fmt], x = 950, y0 = F.top + 40, y1 = F.h - F.bot - 40;
  const ramos = [.3, .5, .7].map((p, i) => { const y = y0 + (y1 - y0) * p, d = i % 2 ? 1 : -1; return `<path d="M${x} ${y} q ${d * 30} -24 ${d * 60} -56" fill="none" stroke="${OURO}" stroke-width="2" stroke-linecap="round"/>`; }).join('');
  return base.replace('</div></div>', '</div></div>').replace(/<\/div>$/, `<svg width="${F.w}" height="${F.h}" style="position:absolute;inset:0"><line x1="${x}" y1="${y0}" x2="${x}" y2="${y1}" stroke="${OURO}" stroke-width="2.5"/>${ramos}</svg></div>`);
};
A['A9-1'] = capaC('creme', '5 cuidados na preparação de um sermão', 116);
['Começar pelo texto, não pela ideia pronta', 'Ter um eixo claro', 'Ilustrar sem tirar o foco da mensagem', 'Aplicar de forma concreta'].forEach((s, i) => { A[`A9-${i + 2}`] = itemC('creme', '', s, 96); });
A['A9-6'] = fimC('creme', 'Aprenda o passo a passo', '3 cursos · 25 aulas · R$ 99', 116);
A.A10 = estatico('creme', 'Uma rotina de estudo que você consegue manter.', 'Plano de leitura, hábitos e organização para estudar a Bíblia com constância.', 'Vida Intelectual · 6 aulas');
A.A11 = estatico('vinho', 'Estudar a Bíblia com profundidade não exige seminário.', 'Exige método, rotina e bons materiais.', '3 cursos · 25 aulas · R$ 99', { px: 100 });
A.A12 = fmt => tela(fmt, 'creme', (F, c) => `
  <div style="position:absolute;left:${M}px;right:${M}px;top:${F.top + (fmt === 'stories' ? 160 : 80)}px">
    <div style="${T};font-size:${fmt === 'stories' ? 340 : 300}px;line-height:.86;color:${VINHO}">100+</div>
    <div style="${T};font-size:${fmt === 'stories' ? 84 : 76}px;line-height:1.1;color:${VINHO};margin-top:40px">pessoas já estudam na Formação Bíblica.</div>
    <div style="margin-top:56px">${fio()}</div>
    <div style="${I};font-size:${fmt === 'stories' ? 40 : 36}px;line-height:1.45;color:${c.txt};margin-top:34px;max-width:820px">Interpretação, preparação de sermões e rotina de estudo.</div></div>`);
A.A13 = fmt => tela(fmt, 'vinho', (F, c) => {
  const st = fmt === 'stories';
  const cartao = (s, i) => `<div style="background:${CREME};border-radius:6px;padding:${st ? 40 : 34}px 40px;display:flex;align-items:baseline;gap:26px;box-shadow:0 18px 40px -20px rgba(0,0,0,.5)">
      <span style="${T};font-weight:600;font-size:${st ? 44 : 38}px;color:${OURO}">${i + 1}</span><span style="${T};font-weight:700;font-size:${st ? 46 : 40}px;color:${VINHO}">${s}</span></div>`;
  return `<div style="position:absolute;left:${M}px;right:${M}px;top:${F.top + (st ? 100 : 20)}px">
    <div style="${T};font-size:${st ? 96 : 84}px;line-height:1.08;color:${c.tit}">3 cursos em uma só plataforma</div>
    <div style="display:flex;flex-direction:column;gap:18px;margin-top:${st ? 70 : 52}px">${['Interpretação Bíblica · 9 aulas', 'Preparação de Sermões · 10 aulas', 'Vida Intelectual · 6 aulas'].map(cartao).join('')}</div>
    <div style="${I};font-size:${st ? 34 : 29}px;line-height:1.5;color:${c.txt};margin-top:${st ? 56 : 40}px">+ Devocional diário · Caderno de estudos · Assista no celular</div>
    <div style="margin-top:${st ? 60 : 42}px">${fio()}</div>
    <div style="${T};font-size:${st ? 76 : 66}px;color:${c.tit};margin-top:26px">R$ 99 <span style="${I};font-weight:500;font-size:${st ? 36 : 32}px;color:${c.txt}">· pagamento único</span></div></div>`;
});
A['A14-1'] = capaC('creme', 'O que você recebe na Formação Bíblica', 112);
A['A14-2'] = itemC('creme', '', '25 aulas gravadas, organizadas em trilhas', 96);
A['A14-3'] = itemC('creme', '', 'Caderno de estudos e acompanhamento do progresso', 92);
A['A14-4'] = fimC('creme', 'Devocional diário de bônus', 'R$ 99 · pagamento único', 116);

const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
for (const fmt of ['feed', 'stories']) {
  const dir = path.join(root, 'saida', fmt); fs.mkdirSync(dir, { recursive: true });
  for (const [nome, f] of Object.entries(A)) {
    if (filtro && !`${fmt}/${nome}`.includes(filtro)) continue;
    const F = FMT[fmt], hp = path.join(dir, `.${nome}.html`);
    fs.writeFileSync(hp, `<!doctype html><html><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet"><style>*{box-sizing:border-box;margin:0;padding:0}</style></head><body>${f(fmt)}</body></html>`);
    const page = await browser.newPage({ viewport: { width: F.w, height: F.h } });
    await page.goto('file://' + hp, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(200);
    const fora = await page.evaluate(([w, h]) => [...document.querySelectorAll('body *')].filter(e => { if (!e.textContent.trim() || e.children.length) return false; const r = e.getBoundingClientRect(); return r.right > w - 60 || r.bottom > h; }).map(e => e.textContent.trim().slice(0, 30)), [F.w, F.h]);
    await page.screenshot({ path: path.join(dir, `${nome}.png`) }); await page.close();
    console.log(`✓ ${fmt}/${nome}${fora.length ? `  (verificar: ${fora.join(' | ')})` : ''}`);
  }
}
await browser.close();

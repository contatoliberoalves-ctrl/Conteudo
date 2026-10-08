// Molde "Método VDE · PDF" (Mentoria de Natália Valença e Líbero Filho): caderno de treino em PDF A4 retrato,
// na identidade dos slides do Método VDE (degradê roxo → índigo, páginas brancas com faixa fina, Poppins).
// Páginas: capa, como usar (com os 6 pontos do checklist), para cada caso o enunciado e, na página seguinte,
// o checklist VDE em branco para preencher; depois um divisor, um gabarito por caso e o fechamento.
// Cada página tem tamanho fixo; o render avisa se algum conteúdo passar do espaço (.cabe).

export const W = 794, H = 1122;  // A4 a 96 dpi (210 × 297 mm)
const M = 60;
const COR = {
  roxo: '#2E0575', indigo: '#1937B1', meio: '#261C8C', lavanda: '#C9B8FF', lavandaClara: '#F2EEFF',
  borda: '#E4DDFB', tinta: '#1A1340', cinza: '#5B5875', vermelho: '#E5486A',
};
const DEGRADE = `linear-gradient(170deg,${COR.roxo} 0%,${COR.meio} 45%,${COR.indigo} 100%)`;
const DEG_H = `linear-gradient(90deg,${COR.roxo},${COR.indigo})`;
const FONTES = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap';
const F = "font-family:'Poppins',sans-serif";
const TIT = `${F};font-weight:800;letter-spacing:-.02em`;
const PERFIS = '@nataliavalenca · @liberofilho';
// Os 6 pontos do checklist VDE (a ordem do gabarito segue esta).
export const PONTOS = [
  { nome: 'Endereçamento', pergunta: 'Qual órgão julga esta peça?', marcas: ['STF', 'STJ', 'TJ', 'Juízo de 1º grau'], linhas: 1 },
  { nome: 'Partes e legitimidade', pergunta: 'Quem pede? Contra quem? Com base em qual artigo?', linhas: 2 },
  { nome: 'Cabimento', pergunta: 'Por que esta peça e não outra? Prazo, requisitos, subsidiariedade.', linhas: 2 },
  { nome: 'Tutela de urgência', pergunta: 'Tem urgência no caso? Qual o risco e qual o artigo?', marcas: ['Sim', 'Não'], linhas: 1 },
  { nome: 'Teses', pergunta: 'Artigo + fato do caso. Uma linha por tese.', rotulos: ['Tese 1', 'Tese 2', 'Tese 3'] },
  { nome: 'Pedidos', pergunta: 'Marque o que não pode faltar no fechamento.', marcas: ['Liminar / cautelar', 'Notificação / citação / informações', 'MP / PGR', 'AGU', 'Procedência', 'Provas', 'Valor da causa', 'Custas e honorários'], linhas: 1 },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
const dois = n => String(n).padStart(2, '0');
// **negrito** e [[destaque]] (lavanda no degradê, texto em degradê nas páginas brancas).
const rico = (s, escuro) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b style="font-weight:700">$1</b>')
  .replace(/\[\[(.+?)\]\]/g, escuro ? `<span style="color:${COR.lavanda}">$1</span>`
    : `<span style="background:${DEG_H};-webkit-background-clip:text;background-clip:text;color:transparent">$1</span>`);
const arcos = (cx, cy, r0, n, cor) => `<svg width="${W}" height="${H}" style="position:absolute;inset:0;pointer-events:none">${Array.from({ length: n }, (_, k) => `<circle cx="${cx}" cy="${cy}" r="${r0 + k * 22}" fill="none" stroke="${cor}" stroke-width="1.2"/>`).join('')}</svg>`;
const kick = (txt, cor = COR.indigo) => `<div style="${F};font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:${cor}">${esc(txt)}</div>`;
const quadro = (n, tam = 38, escuro = false) => `<span style="flex:none;width:${tam}px;height:${tam}px;border-radius:${Math.round(tam * .27)}px;background:${escuro ? 'rgba(255,255,255,.16)' : DEG_H};color:#fff;display:inline-flex;align-items:center;justify-content:center;${F};font-weight:700;font-size:${Math.round(tam * .42)}px">${esc(n)}</span>`;
const chip = txt => `<span style="display:inline-block;background:${COR.lavandaClara};color:${COR.roxo};border:1px solid ${COR.borda};${F};font-size:10px;font-weight:600;padding:1px 8px;border-radius:999px;white-space:nowrap;margin:3px 4px 0 0">${esc(txt)}</span>`;
const caixa = () => `<span style="flex:none;width:12px;height:12px;border:1.6px solid ${COR.roxo};border-radius:3px;display:inline-block"></span>`;
const linhaEscrever = () => `<div style="height:28px;border-bottom:1.2px solid #CFC6EE"></div>`;

// Página branca com faixa em degradê, cabeçalho e rodapé numerado.
function branca(corpo, cab, n, bg = '#fff') {
  return `<section class="pagina" style="background:${bg}">
    <div style="position:absolute;left:0;right:0;top:0;height:7px;background:${DEG_H}"></div>
    <div style="position:absolute;left:${M}px;right:${M}px;top:30px;display:flex;justify-content:space-between;${F};font-size:9.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${COR.indigo}"><span>Método VDE · Mentoria 2ª fase</span><span style="color:${COR.cinza}">${esc(cab)}</span></div>
    <div class="cabe" style="position:absolute;left:${M}px;right:${M}px;top:72px;bottom:74px;overflow:hidden;display:flex;flex-direction:column">${corpo}</div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:30px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid ${COR.borda};padding-top:10px;${F};font-size:10px;font-weight:500;color:${COR.cinza}"><span>${PERFIS}</span><span style="font-weight:700;color:${COR.roxo}">${dois(n)}</span></div>
  </section>`;
}

function capa(p) {
  const c = p.capa || {};
  return `<section class="pagina" style="background:${DEGRADE};color:#fff">
    ${arcos(W + 120, 640, 260, 9, 'rgba(201,184,255,.26)')}
    <div style="position:absolute;left:${M}px;top:64px;display:flex;align-items:center;gap:12px">${'<span style="width:34px;height:3px;border-radius:2px;background:#C9B8FF"></span>'}${kick('Método VDE', '#fff')}</div>
    <div style="position:absolute;left:${M}px;top:92px;${F};font-size:11px;font-weight:500;letter-spacing:.12em;color:#ECE8FF">MENTORIA · 2ª FASE OAB</div>
    <div style="position:absolute;left:${M}px;right:${M}px;top:130px;height:1px;background:rgba(255,255,255,.22)"></div>
    <div style="position:absolute;left:${M}px;right:${M + 40}px;top:300px">
      ${kick(c.rotulo || 'Direito Constitucional', COR.lavanda)}
      <div style="${TIT};font-size:${c.ts || 76}px;line-height:1.02;margin-top:16px">${lista(c.titulo).map(l => rico(l, true)).join('<br>')}</div>
      <span style="display:block;width:70px;height:5px;border-radius:3px;background:${COR.lavanda};margin-top:26px"></span>
      <p style="${F};font-size:16px;line-height:1.5;color:#ECE8FF;margin:24px 0 0;max-width:470px">${rico(c.sub, true)}</p>
    </div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:150px;display:flex;gap:26px">
      ${[[p.casos.length, 'casos'], ['6', 'pontos do checklist'], [p.casos.length, 'gabaritos']].map(([n, r]) => `<div style="flex:1;border-top:2px solid rgba(255,255,255,.3);padding-top:12px"><div style="${TIT};font-size:46px;line-height:1">${dois(n)}</div><div style="${F};font-size:10.5px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:${COR.lavanda};margin-top:6px">${r}</div></div>`).join('')}
    </div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:96px;height:1px;background:rgba(255,255,255,.22)"></div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:52px;display:flex;justify-content:space-between;align-items:baseline">
      <span style="${F};font-size:22px;font-weight:700">Natália e Líbero</span><span style="${F};font-size:11px;font-weight:500;color:#ECE8FF">${PERFIS}</span></div>
  </section>`;
}

function comoUsar(p, n) {
  const passos = lista(p.comoUsar).map((t, i) => `<div style="display:flex;gap:14px;align-items:flex-start">${quadro(i + 1, 30)}<p style="margin:3px 0 0;${F};font-size:13px;line-height:1.5;color:${COR.tinta}">${rico(t)}</p></div>`).join('');
  const pontos = PONTOS.map((pt, i) => `<div style="display:flex;gap:12px;align-items:center;background:#fff;border:1px solid ${COR.borda};border-radius:12px;padding:12px 14px">${quadro(i + 1, 30)}<div><div style="${F};font-size:13px;font-weight:700;color:${COR.tinta}">${pt.nome}</div><div style="${F};font-size:10.5px;line-height:1.35;color:${COR.cinza};margin-top:2px">${esc(pt.pergunta)}</div></div></div>`).join('');
  return branca(`${kick('Antes de começar')}
    <div style="${TIT};font-size:40px;line-height:1.05;color:${COR.tinta};margin-top:8px">Como usar <span style="background:${DEG_H};-webkit-background-clip:text;background-clip:text;color:transparent">este caderno</span></div>
    <div style="display:flex;flex-direction:column;gap:14px;margin-top:26px">${passos}</div>
    <div style="margin-top:30px;background:${COR.lavandaClara};border-radius:18px;padding:22px 22px 24px">
      ${kick('O checklist VDE', COR.roxo)}
      <div style="${TIT};font-size:22px;color:${COR.tinta};margin:6px 0 16px">Seis pontos para planejar qualquer peça</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">${pontos}</div>
    </div>
    ${p.nota ? `<p style="margin:22px 0 0;${F};font-size:10.5px;line-height:1.5;color:${COR.cinza}">${rico(p.nota)}</p>` : ''}`, 'Como usar', n);
}

function enunciado(c, i, n) {
  return branca(`<div style="display:flex;align-items:center;gap:16px">
      ${quadro(dois(i + 1), 54)}
      <div>${kick(`Caso ${dois(i + 1)} · enunciado`)}<div style="${TIT};font-size:28px;line-height:1.1;color:${COR.tinta};margin-top:4px">${esc(c.titulo)}</div></div>
    </div>
    ${c.inspirado ? `<div style="margin-top:14px">${chip(c.inspirado)}</div>` : ''}
    <div style="height:1px;background:${COR.borda};margin:18px 0 20px"></div>
    <div style="${F};font-size:13.6px;line-height:1.62;color:${COR.tinta};text-align:justify;hyphens:auto">${lista(c.enunciado).map(t => `<p style="margin:0 0 .85em">${rico(t)}</p>`).join('')}</div>
    <div style="margin-top:18px;background:${COR.lavandaClara};border-left:4px solid ${COR.roxo};border-radius:10px;padding:14px 18px 16px">
      ${kick('Qual é a peça cabível?', COR.roxo)}${linhaEscrever()}${linhaEscrever()}
    </div>
    <p style="margin:14px 0 0;${F};font-size:10.5px;color:${COR.cinza}">Responda antes de virar a página. Na próxima, monte a peça no checklist VDE.</p>
    <div style="flex:1;min-height:0;margin-top:18px;border:1px solid ${COR.borda};border-radius:12px;padding:10px 16px;background:repeating-linear-gradient(180deg,transparent 0 25px,#E4DDFB 25px 26px);background-origin:content-box;background-clip:content-box;overflow:hidden">${kick('Rascunho · pistas do enunciado', COR.cinza)}</div>`, `Caso ${dois(i + 1)}`, n);
}

function checklist(c, i, n) {
  const blocos = PONTOS.map((pt, k) => {
    const marcas = pt.marcas ? `<div style="display:flex;flex-wrap:wrap;gap:6px 16px;margin-top:8px">${pt.marcas.map(m => `<span style="display:inline-flex;align-items:center;gap:6px;${F};font-size:10.5px;font-weight:500;color:${COR.tinta}">${caixa()}${esc(m)}</span>`).join('')}</div>` : '';
    const rot = pt.rotulos ? pt.rotulos.map(r => `<div style="display:flex;align-items:flex-end;gap:10px"><span style="flex:none;width:44px;${F};font-size:9.5px;font-weight:700;color:${COR.indigo};padding-bottom:4px">${r}</span><div style="flex:1">${linhaEscrever()}</div></div>`).join('') : '';
    return `<div style="border:1px solid ${COR.borda};border-radius:14px;padding:12px 16px 12px;background:#fff">
      <div style="display:flex;align-items:center;gap:10px">${quadro(k + 1, 26)}<span style="${F};font-size:13.5px;font-weight:700;color:${COR.tinta}">${pt.nome}</span><span style="${F};font-size:10px;color:${COR.cinza};margin-left:auto;text-align:right;max-width:330px">${esc(pt.pergunta)}</span></div>
      ${marcas}${rot}${Array.from({ length: pt.linhas || 0 }, linhaEscrever).join('')}
    </div>`;
  }).join('');
  return branca(`<div style="display:flex;justify-content:space-between;align-items:flex-end">
      <div>${kick(`Caso ${dois(i + 1)} · checklist`)}<div style="${TIT};font-size:30px;line-height:1.05;color:${COR.tinta};margin-top:4px">Checklist <span style="background:${DEG_H};-webkit-background-clip:text;background-clip:text;color:transparent">VDE</span></div></div>
      <div style="width:300px;background:${COR.lavandaClara};border-radius:10px;padding:8px 14px 6px"><div style="${F};font-size:9.5px;font-weight:700;letter-spacing:.14em;color:${COR.roxo}">PEÇA</div>${linhaEscrever()}</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:9px;margin-top:16px">${blocos}</div>`, `Caso ${dois(i + 1)} · checklist`, n, '#FBFAFF');
}

function divisor(p, n) {
  return `<section class="pagina" style="background:${DEGRADE};color:#fff">
    ${arcos(-140, 560, 240, 9, 'rgba(201,184,255,.24)')}
    <div style="position:absolute;left:${M + 60}px;right:${M}px;top:50%;transform:translateY(-50%)">
      ${kick('Confira depois de treinar', COR.lavanda)}
      <div style="${TIT};font-size:82px;line-height:1;margin-top:14px">Gabaritos</div>
      <span style="display:block;width:70px;height:5px;border-radius:3px;background:${COR.lavanda};margin-top:24px"></span>
      <p style="${F};font-size:15px;line-height:1.55;color:#ECE8FF;margin:22px 0 0;max-width:470px">${rico(p.divisor || 'Compare ponto a ponto com o seu checklist. Errou a peça? Volte ao enunciado e procure a pista que entregava a resposta.', true)}</p>
    </div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:40px;display:flex;justify-content:space-between;${F};font-size:10px;font-weight:500;color:rgba(255,255,255,.75)"><span>${PERFIS}</span><span style="font-weight:700">${dois(n)}</span></div>
  </section>`;
}

function gabarito(c, i, n) {
  const g = lista(c.gabarito);
  const secoes = PONTOS.map((pt, k) => {
    const s = g[k] || {};
    return `<div style="display:grid;grid-template-columns:30px 1fr;gap:12px;padding:10px 0;border-bottom:1px dashed ${COR.borda}">
      ${quadro(k + 1, 26)}
      <div><div style="${F};font-size:10.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${COR.indigo}">${pt.nome}</div>
        <div style="${F};font-size:12px;line-height:1.5;color:${COR.tinta};margin-top:3px">${lista(s.texto).map(t => `<div style="display:flex;gap:8px"><span style="flex:none;width:5px;height:5px;border-radius:2px;background:${COR.roxo};margin-top:7px"></span><span>${rico(t)}</span></div>`).join('')}</div>
        ${lista(s.artigos).length ? `<div style="margin-top:2px">${lista(s.artigos).map(chip).join('')}</div>` : ''}</div>
    </div>`;
  }).join('');
  return branca(`<div style="display:flex;align-items:center;gap:14px">${quadro(dois(i + 1), 44)}<div>${kick(`Gabarito · caso ${dois(i + 1)}`)}<div style="${TIT};font-size:20px;line-height:1.1;color:${COR.tinta};margin-top:3px">${esc(c.titulo)}</div></div></div>
    <div style="margin-top:14px;background:${DEGRADE};border-radius:14px;padding:14px 18px;color:#fff;display:flex;justify-content:space-between;align-items:center;gap:16px">
      <div><div style="${F};font-size:9.5px;font-weight:700;letter-spacing:.16em;color:${COR.lavanda}">PEÇA</div><div style="${TIT};font-size:21px;line-height:1.1;margin-top:2px">${esc(c.peca)}</div></div>
      ${c.pista ? `<div style="${F};font-size:10.5px;line-height:1.4;color:#ECE8FF;max-width:300px;text-align:right">${rico(c.pista, true)}</div>` : ''}
    </div>
    <div style="margin-top:6px">${secoes}</div>
    ${c.atencao ? `<div style="margin-top:12px;display:flex;gap:10px;align-items:flex-start;background:#FFF1F4;border:1px solid #F8C9D4;border-radius:12px;padding:10px 14px"><span style="flex:none;${F};font-size:10px;font-weight:800;letter-spacing:.12em;color:${COR.vermelho};padding-top:1px">ATENÇÃO</span><span style="${F};font-size:11.5px;line-height:1.45;color:${COR.tinta}">${rico(c.atencao)}</span></div>` : ''}`, `Gabarito · caso ${dois(i + 1)}`, n);
}

function fim(p, n) {
  const f = p.fim || {};
  return `<section class="pagina" style="background:${DEGRADE};color:#fff">
    ${arcos(W + 120, 560, 240, 9, 'rgba(201,184,255,.24)')}
    <div style="position:absolute;left:${M}px;right:${M}px;top:50%;transform:translateY(-50%);text-align:center">
      ${kick(f.kicker || 'Método VDE', COR.lavanda)}
      <div style="${TIT};font-size:${f.ts || 64}px;line-height:1.05;margin-top:16px">${lista(f.titulo || 'Confia no processo.').map(l => rico(l, true)).join('<br>')}</div>
      <span style="display:block;width:70px;height:5px;border-radius:3px;background:${COR.lavanda};margin:26px auto 0"></span>
      ${f.texto ? `<p style="${F};font-size:15px;line-height:1.55;color:#ECE8FF;margin:22px auto 0;max-width:470px">${rico(f.texto, true)}</p>` : ''}
    </div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:52px;text-align:center;${F};font-size:13px;font-weight:600">${PERFIS}</div>
  </section>`;
}

export function renderCarrossel(p) {
  const avisos = [];
  p.casos.forEach((c, i) => { if (lista(c.gabarito).length !== PONTOS.length) avisos.push(`caso ${i + 1}: o gabarito precisa de ${PONTOS.length} pontos`); });
  let n = 1;
  const pags = [capa(p), comoUsar(p, ++n)];
  p.casos.forEach((c, i) => { pags.push(enunciado(c, i, ++n)); pags.push(checklist(c, i, ++n)); });
  pags.push(divisor(p, ++n));
  p.casos.forEach((c, i) => pags.push(gabarito(c, i, ++n)));
  pags.push(fim(p, ++n));
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet">
<style>@page{size:210mm 297mm;margin:0}*{box-sizing:border-box}body{margin:0;${F};-webkit-font-smoothing:antialiased;-webkit-print-color-adjust:exact;print-color-adjust:exact}
p{margin:0}.pagina{position:relative;width:${W}px;height:${H}px;overflow:hidden;break-after:page}.pagina:last-child{break-after:auto}</style></head><body>
${pags.join('\n')}
<script>document.fonts.ready.then(() => {
  window.__avisos = [...document.querySelectorAll('.pagina')].flatMap((s, i) => { const c = s.querySelector('.cabe'); return c && c.scrollHeight > c.clientHeight + 1 ? ['página ' + (i + 1) + ': conteúdo passa do espaço (' + (c.scrollHeight - c.clientHeight) + ' px)'] : []; });
  window.__pronto = true; });</script></body></html>`;
  return { html, avisos, largura: W, altura: H };
}

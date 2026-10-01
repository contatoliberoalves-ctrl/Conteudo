// Molde "Carrossel Ética" (@eticagabaritadanaoba): a estrutura do Carrossel Libero (títulos em Big Shoulders,
// textura granulada, anéis, palavra vertical, balão…) na paleta do app Ética Gabaritada: vinho, rosa e branco.
// Fundos: "degrade" (rosa → vinho, o das capas), "branco" e "rosa" (rosa clarinho → branco, como o card do app).
// renderCarrossel(c) devolve { html, total, avisos }; o render.mjs fotografa cada slide.

const COR = {
  vinho: '#5A1430', vinhoEscuro: '#3A0D21', vinhoMedio: '#7A1D45', magenta: '#B8336A', rosa: '#F08BB4',
  rosaSuave: '#F7B6CF', rosaClaro: '#FCE4EE', tinta: '#2B0A18', cinza: '#7A6670',
};
const DEGRADE = `radial-gradient(135% 95% at 100% 0%,${COR.rosa} 0%,#C94A82 26%,${COR.vinhoMedio} 56%,${COR.vinhoEscuro} 100%)`;
const TEMAS = {
  degrade: { bg: DEGRADE, tit: '#fff', txt: '#FDEEF4', acento: COR.rosaSuave, kicker: COR.rosaSuave, caixaBg: COR.rosaClaro, caixaFg: COR.vinho, linha: 'rgba(255,255,255,.3)', num: COR.rosaSuave, anel: COR.rosaSuave, palavra: 'rgba(255,255,255,.12)', cartao: 'rgba(255,255,255,.1)', escuro: true },
  branco: { bg: '#FFFFFF', tit: COR.vinho, txt: COR.tinta, acento: COR.magenta, kicker: COR.magenta, caixaBg: COR.vinho, caixaFg: '#fff', linha: '#F1D2DF', num: COR.magenta, anel: COR.rosa, palavra: 'rgba(184,51,106,.09)', cartao: '#FFF6FA', escuro: false },
  rosa: { bg: `linear-gradient(160deg,${COR.rosaClaro} 0%,#FFF4F8 45%,#FFFFFF 80%)`, tit: COR.vinho, txt: COR.tinta, acento: COR.magenta, kicker: COR.magenta, caixaBg: COR.vinho, caixaFg: '#fff', linha: '#EFC9D9', num: COR.magenta, anel: COR.rosa, palavra: 'rgba(184,51,106,.1)', cartao: '#FFFFFF', escuro: false },
};
const PERFIL = '@eticagabaritadanaoba';
const TITULO = "font-family:'Big Shoulders Display',sans-serif;font-weight:900;text-transform:uppercase";
const RUIDO = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .35 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
// **negrito** (800) e [[caixa]] (palavra com fundo sólido, só nos títulos).
const rico = (s, t) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b style="font-weight:800">$1</b>')
  .replace(/\[\[(.+?)\]\]/g, `<span style="background:${t.caixaBg};color:${t.caixaFg};padding:0 14px;border-radius:14px;box-decoration-break:clone;-webkit-box-decoration-break:clone">$1</span>`);
const pad2 = n => String(n).padStart(2, '0');

// Tamanho do título: a maior palavra precisa caber na largura (Big Shoulders 900 ≈ 0,44 em por letra;
// o render ainda reduz se passar).
function tamanho(linhas, base, largura) {
  const maior = Math.max(...lista(linhas).join(' ').replace(/\[\[|\]\]|\*\*/g, '').split(/\s+/).map(p => p.length), 1);
  return Math.min(base, Math.floor(largura / (maior * 0.44)));
}
const titulo = (s, t, base, largura, extra = '') => lista(s.titulo).length
  ? `<h1 data-titulo style="${TITULO};margin:0;font-size:${s.ts || tamanho(s.titulo, base, largura)}px;line-height:${lista(s.titulo).some(l => l.includes('[[')) ? 1.1 : .88};color:${t.tit}${extra}">${lista(s.titulo).map(l => rico(l, t)).join('<br>')}</h1>` : '';
// Kicker com a estrelinha do app ("✦ DIA 5 DE 5").
const kicker = (txt, t) => txt ? `<div style="font-size:28px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${t.kicker}">✦ ${esc(txt)}</div>` : '';
const barra = t => `<span style="display:block;width:96px;height:12px;border-radius:6px;background:${t.acento};flex:none"></span>`;
const corpo = (s, t, px = 42) => lista(s.texto).map(p => `<p data-corpo style="margin:0;font-size:${px}px;font-weight:500;line-height:1.3;color:${t.txt};text-wrap:pretty">${rico(p, t)}</p>`).join('');
// Pílula do app ("Rota 5 dias · 56 questões/dia"): fundo rosa clarinho e texto vinho.
const pilula = (txt, t) => txt ? `<span style="align-self:flex-start;background:${t.escuro ? 'rgba(255,255,255,.16)' : COR.rosaClaro};color:${t.escuro ? '#fff' : COR.vinho};border-radius:999px;padding:14px 30px;font-size:30px;font-weight:700">${esc(txt)}</span>` : '';

function textura(t) {
  return `<div style="position:absolute;inset:0;pointer-events:none;background-image:${RUIDO};opacity:${t.escuro ? .5 : .35};mix-blend-mode:${t.escuro ? 'overlay' : 'multiply'};z-index:5"></div>`;
}
// Faixa fina em degradê no topo dos slides claros: amarra as páginas brancas às capas.
const faixa = t => t.escuro ? '' : `<div style="position:absolute;left:0;right:0;top:0;height:16px;background:linear-gradient(90deg,${COR.rosa},${COR.vinho});z-index:4"></div>`;
function rodape(t) {
  const st = `position:absolute;bottom:72px;font-size:26px;font-weight:600;letter-spacing:.08em;color:${t.txt};z-index:4`;
  return `<div style="${st};left:110px">${PERFIL}</div><div style="${st};right:110px;color:${t.kicker}">✦ Ética Gabaritada</div>`;
}
// Anéis vazados cortados nos cantos (superior direito e lateral esquerda), rosa em vez do vermelho do Libero.
function aneis(s, t) {
  if (!s.aneis) return '';
  return `<div data-anel style="position:absolute;right:-220px;top:-220px;width:440px;height:440px;border:72px solid ${t.anel};border-radius:50%;box-sizing:border-box;opacity:.95"></div>
  <div data-anel style="position:absolute;left:-340px;top:${s.aneis === 'baixo' ? 880 : 520}px;width:420px;height:420px;border:64px solid ${t.anel};border-radius:50%;box-sizing:border-box;opacity:.95"></div>`;
}
// Palavra-chave vertical colada numa borda. Devolve [html, largura ocupada, lado].
function palavraVertical(s, t) {
  if (!s.palavra) return ['', 0];
  const palavras = lista(s.palavra).map(p => p.toUpperCase());
  const maior = Math.max(...palavras.map(p => p.length));
  const px = Math.min(300, Math.floor(1300 / (maior * 0.5)));
  const lado = s.palavraLado === 'direita' ? 'right' : 'left';
  return [`<div data-palavra style="position:absolute;${lado}:-18px;top:0;bottom:0;display:flex;flex-direction:row;justify-content:center;${TITULO};font-size:${px}px;line-height:.86;color:${t.palavra}">${palavras.map(p => `<div style="writing-mode:vertical-rl;transform:rotate(180deg);text-align:center">${esc(p)}</div>`).join('')}</div>`, Math.round(px * 0.88 * palavras.length) + 40, lado];
}
// Anel de progresso do app ("0% do desafio"): valor de 0 a 100.
function progresso(p, t, tam = 260) {
  if (!p) return '';
  const v = Math.max(0, Math.min(100, Number(p.valor) || 0)), r = tam / 2 - 16, circ = 2 * Math.PI * r;
  const trilho = t.escuro ? 'rgba(255,255,255,.22)' : COR.rosaClaro, cor = t.escuro ? '#fff' : COR.magenta;
  return `<div data-anel style="position:relative;width:${tam}px;height:${tam}px;flex:none">
    <svg width="${tam}" height="${tam}" style="position:absolute;inset:0;transform:rotate(-90deg)"><circle cx="${tam / 2}" cy="${tam / 2}" r="${r}" fill="none" stroke="${trilho}" stroke-width="22"/>
    <circle cx="${tam / 2}" cy="${tam / 2}" r="${r}" fill="none" stroke="${cor}" stroke-width="22" stroke-linecap="round" stroke-dasharray="${circ * v / 100} ${circ}"/></svg>
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:${t.tit}">
      <div style="${TITULO};font-size:${Math.round(tam * .32)}px;line-height:.9">${esc(p.texto ?? v + '%')}</div>
      ${p.rotulo ? `<div style="font-size:${Math.round(tam * .075)}px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${t.kicker};text-align:center;max-width:${tam - 60}px">${esc(p.rotulo)}</div>` : ''}
    </div></div>`;
}

const area = (html, esq = 110, dir = 110, extra = '') => `<div data-area style="position:absolute;left:${esq}px;right:${dir}px;top:150px;bottom:190px;display:flex;flex-direction:column;justify-content:center;gap:32px;z-index:3${extra}">${html}</div>`;

// Selo do perfil e "Arraste →" no pé das capas.
const pe = t => `<div style="position:absolute;left:110px;bottom:72px;background:${t.caixaBg};color:${t.caixaFg};border-radius:999px;font-size:28px;font-weight:700;padding:10px 24px;z-index:6">${PERFIL}</div>
  <div style="position:absolute;right:110px;bottom:82px;font-size:26px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${t.txt};z-index:6">Arraste →</div>`;

// Capas alternativas ("estilo" no slide de capa).
const CAPAS = {
  // Número gigante vazado (listas: "4 sanções…", "3 dicas…").
  numero(s, t) {
    return `<div style="position:absolute;right:70px;top:30px;${TITULO};font-size:${s.tn || 640}px;line-height:.8;color:transparent;-webkit-text-stroke:8px ${t.escuro ? 'rgba(255,255,255,.6)' : COR.magenta};z-index:2">${esc(s.numero)}</div>
      <div data-area style="position:absolute;left:110px;right:110px;top:740px;bottom:190px;display:flex;flex-direction:column;justify-content:flex-end;gap:24px;z-index:3">
        ${kicker(s.kicker, t)}${titulo(s, t, 150, 860)}${s.texto ? corpo(s, t, 40) : ''}${pilula(s.pilula, t)}
      </div>${pe(t)}`;
  },
  // Comparação: metade de cima no degradê, de baixo branca, selo VS no meio.
  versus(s, t) {
    const [a, b] = lista(s.lados);
    const px = w => Math.min(s.ts || 240, Math.floor(800 / (Math.max(...String(w).split(/\s+/).map(p => p.length), 1) * 0.47)));
    const claro = TEMAS.branco;
    return `<div style="position:absolute;inset:0;background:#fff;clip-path:polygon(0 58%,100% 44%,100% 100%,0 100%);z-index:1"></div>
      <div style="position:absolute;left:110px;right:110px;top:150px;display:flex;flex-direction:column;gap:18px;z-index:3">
        ${kicker(s.kicker, TEMAS.degrade)}
        <h1 data-titulo style="${TITULO};margin:0;font-size:${px(a)}px;line-height:${String(a).includes('[[') ? 1.08 : .88};color:#fff">${rico(a, TEMAS.degrade)}</h1>
      </div>
      <div style="position:absolute;left:50%;top:51%;transform:translate(-50%,-50%) rotate(-8deg);width:220px;height:220px;border-radius:50%;background:${COR.vinho};border:12px solid ${COR.rosaSuave};display:flex;align-items:center;justify-content:center;${TITULO};font-size:110px;color:#fff;box-shadow:0 20px 50px rgba(58,13,33,.4);z-index:4">VS</div>
      <div data-area style="position:absolute;left:110px;right:110px;top:840px;bottom:190px;display:flex;flex-direction:column;align-items:flex-end;justify-content:flex-start;gap:18px;text-align:right;z-index:3">
        <h1 data-titulo style="${TITULO};margin:0;font-size:${px(b)}px;line-height:.88;color:${COR.vinho}">${rico(b, claro)}</h1>
        ${s.texto ? corpo(s, claro, 38) : ''}
      </div>${pe(claro)}`;
  },
  // Pergunta: interrogação gigante saindo pela direita e, se houver, as opções de resposta.
  pergunta(s, t) {
    return `<div style="position:absolute;right:-120px;top:60px;${TITULO};font-size:1250px;line-height:.8;color:${t.palavra};z-index:1">?</div>
      <div data-area style="position:absolute;left:110px;right:200px;top:150px;bottom:190px;display:flex;flex-direction:column;justify-content:center;gap:34px;z-index:3">
        ${kicker(s.kicker, t)}${titulo(s, t, 150, 770)}${s.texto ? corpo(s, t, 40) : ''}
        ${lista(s.opcoes).length ? `<div style="display:flex;flex-wrap:wrap;gap:18px;margin-top:10px">${lista(s.opcoes).map((o, i) => `<span style="border-radius:40px 40px 40px 0;padding:22px 48px;font-size:46px;font-weight:800;${i ? `border:4px solid ${t.acento};color:${t.tit}` : `background:${t.caixaBg};color:${t.caixaFg}`}">${esc(o)}</span>`).join('')}</div>` : ''}
      </div>${pe(t)}`;
  },
  // Card do desafio, como a tela do app: kicker "✦ DIA 5 DE 5", título, subtítulo, anel de progresso e pílula.
  desafio(s, t) {
    return `<div data-area style="position:absolute;left:110px;right:110px;top:150px;bottom:190px;display:flex;flex-direction:column;justify-content:center;gap:34px;z-index:3">
        ${s.progresso ? `<div style="align-self:flex-end">${progresso(s.progresso, t, 300)}</div>` : ''}
        ${kicker(s.kicker, t)}${titulo(s, t, 170, 860)}${s.texto ? corpo(s, t, 40) : ''}${pilula(s.pilula, t)}
      </div>${pe(t)}`;
  },
};

const TIPOS = {
  capa(s, t, c) {
    if (s.estilo && CAPAS[s.estilo]) return CAPAS[s.estilo](s, t, c);
    return `${area(`${kicker(s.kicker, t)}
      ${s.pre ? `<div style="font-size:56px;font-weight:600;line-height:1.1;color:${t.txt}">${rico(s.pre, t)}</div>` : ''}
      ${titulo(s, t, 190, 860)}
      ${s.texto ? corpo(s, t, 40) : ''}
      ${s.pilula ? `<div style="display:flex;justify-content:center">${pilula(s.pilula, t)}</div>` : ''}`, 110, 110, ';align-items:center;text-align:center')}${pe(t)}`;
  },
  texto(s, t) {
    const [pv, larg, lado] = palavraVertical(s, t);
    const margem = s.palavra ? 110 : 160;
    const esq = lado === 'left' ? Math.max(larg, 110) : margem, dir = lado === 'right' ? Math.max(larg, 110) : margem;
    return `${pv}${area(`${kicker(s.kicker, t)}${titulo(s, t, 125, 1080 - esq - dir)}${barra(t)}${corpo(s, t, s.corpo || 42)}${pilula(s.pilula, t)}`, esq, dir)}`;
  },
  impacto(s, t) {
    const linhas = lista(s.titulo);
    const [bg, fg] = t.escuro ? ['#fff', COR.vinho] : [COR.vinho, '#fff'];
    return area(`${kicker(s.kicker, t)}
      <div style="align-self:flex-start;background:${bg};border-radius:28px;padding:30px 38px 20px"><h1 data-titulo style="${TITULO};margin:0;font-size:${s.ts || tamanho(linhas, 165, 780)}px;line-height:.86;color:${fg}">${linhas.map(l => rico(l, t)).join('<br>')}</h1></div>
      ${s.sub ? `<div style="${TITULO};font-size:60px;line-height:.95;color:${t.tit}">${rico(s.sub, t)}</div>` : ''}`);
  },
  lei(s, t) {
    return area(`${kicker(s.kicker, t)}${titulo(s, t, 120, 860)}
      <div style="border-left:8px solid ${t.acento};padding-left:32px"><p data-corpo style="margin:0;font-size:${s.corpo || 36}px;font-weight:700;line-height:1.3;color:${t.txt}">${rico(s.citacao, t)}</p></div>
      ${lista(s.traducao).map(p => `<p data-corpo style="margin:0;font-size:40px;font-weight:500;line-height:1.3;color:${t.txt}">${rico(p, t)}</p>`).join('')}`);
  },
  lista(s, t) {
    const romano = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    const itens = lista(s.itens).map((it, i) => `<div style="display:flex;gap:28px;align-items:baseline;padding:0 0 22px;border-bottom:2px solid ${t.linha}">
        <span style="flex:none;min-width:48px;font-size:28px;font-weight:800;color:${t.num}">${(k => s.marcador === 'romano' ? romano[k] : s.marcador === 'letra' ? 'abcdefghij'[k] + ')' : pad2(k + 1))(i + (s.inicio || 0))}</span>
        <span data-corpo style="font-size:${s.corpo || 40}px;font-weight:500;line-height:1.3;color:${t.txt}">${rico(it, t)}</span></div>`).join('');
    return area(`${kicker(s.kicker, t)}${titulo(s, t, 120, 860)}<div style="display:flex;flex-direction:column;gap:22px">${itens}</div>`);
  },
  // Cards de missão do app: ícone (emoji) num quadrado rosa arredondado, borda de destaque à esquerda,
  // rótulo pequeno, título e linha de apoio.
  missao(s, t) {
    const cards = lista(s.cards).map(k => `<div style="display:flex;gap:30px;align-items:center;background:${t.cartao};border:2px solid ${t.escuro ? 'rgba(255,255,255,.18)' : '#F3D9E4'};border-left:12px solid ${t.escuro ? COR.rosaSuave : COR.magenta};border-radius:28px;padding:28px 34px">
        ${k.icone ? `<span style="flex:none;width:100px;height:100px;border-radius:26px;background:${t.escuro ? 'rgba(255,255,255,.16)' : COR.rosaClaro};display:flex;align-items:center;justify-content:center;font-size:54px">${esc(k.icone)}</span>` : ''}
        <div style="display:flex;flex-direction:column;gap:6px">
          ${k.rotulo ? `<span style="font-size:24px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${t.kicker}">${esc(k.rotulo)}</span>` : ''}
          <span data-corpo style="font-size:${s.corpo || 40}px;font-weight:800;line-height:1.15;color:${t.tit}">${rico(k.titulo, t)}</span>
          ${k.texto ? `<span data-corpo style="font-size:${Math.round((s.corpo || 40) * .78)}px;font-weight:500;line-height:1.3;color:${t.escuro ? t.txt : COR.cinza}">${rico(k.texto, t)}</span>` : ''}
        </div></div>`).join('');
    return area(`${kicker(s.kicker, t)}${titulo(s, t, 120, 860)}<div style="display:flex;flex-direction:column;gap:24px">${cards}</div>`);
  },
  frases(s, t) {
    const [bg, fg] = t.escuro ? [COR.rosaClaro, COR.vinho] : [COR.vinho, '#fff'];
    return area(`${kicker(s.kicker, t)}${titulo(s, t, 120, 860)}
      <div style="display:flex;flex-direction:column;align-items:flex-start;gap:18px">${lista(s.frases).map(f => `<span data-corpo style="background:${bg};color:${fg};border-radius:22px;font-size:44px;font-weight:600;line-height:1.2;padding:18px 28px">“${rico(f, t)}”</span>`).join('')}</div>`);
  },
  balao(s, t) {
    const [bg, fg, ponto] = t.escuro ? ['#fff', COR.tinta, COR.magenta] : [COR.vinho, '#fff', COR.rosaSuave];
    return area(`${kicker(s.kicker, t)}${titulo(s, t, 120, 860)}
      <div style="position:relative;background:${bg};border-radius:56px 56px 56px 0;padding:72px 64px 64px">
        <div style="position:absolute;top:30px;right:44px;display:flex;gap:12px">${`<span style="width:22px;height:22px;border-radius:50%;background:${ponto}"></span>`.repeat(3)}</div>
        ${lista(s.texto).map(p => `<p data-corpo style="margin:0;font-size:${s.corpo || 46}px;font-weight:500;line-height:1.3;color:${fg}">${rico(p, t)}</p>`).join('')}
      </div>`, 150, 150);
  },
  cta(s, t) {
    const [bg, fg] = t.escuro ? ['#fff', COR.vinho] : [COR.vinho, '#fff'];
    return area(`${s.progresso ? progresso(s.progresso, t, 240) : ''}${kicker(s.kicker, t)}${titulo(s, t, 130, 860)}${barra(t)}${corpo(s, t, s.corpo || 40)}
      ${s.botao ? `<span style="align-self:flex-start;background:${bg};color:${fg};border-radius:40px 40px 40px 0;padding:22px 40px;font-size:36px;font-weight:800;white-space:nowrap">${esc(s.botao)}</span>` : ''}`);
  },
};

export function renderCarrossel(c) {
  const slides = lista(c.slides);
  const n = slides.length;
  const avisos = [];
  slides.forEach((s, i) => {
    if (i >= 2 && s.tema === slides[i - 1].tema && s.tema === slides[i - 2].tema) avisos.push(`slides ${i - 1} a ${i + 1}: três fundos "${s.tema}" seguidos`);
    if (!TEMAS[s.tema]) avisos.push(`slide ${i + 1}: tema "${s.tema}" não existe (use ${Object.keys(TEMAS).join(', ')})`);
  });
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@900&family=Schibsted+Grotesk:wght@500;600;700;800&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box}body{margin:0;font-family:'Schibsted Grotesk','Noto Color Emoji',sans-serif;-webkit-font-smoothing:antialiased}</style></head><body>
<div id="painel" style="position:relative;width:${n * 1080}px;height:1350px">
${slides.map((s, i) => {
    const t = TEMAS[s.tema] || TEMAS.degrade;
    const tipo = TIPOS[s.tipo] || TIPOS.texto;
    return `<div id="slide-${i + 1}" style="position:absolute;left:${i * 1080}px;top:0;width:1080px;height:1350px;overflow:hidden;background:${t.bg}">
  ${faixa(t)}${aneis(s, t)}${tipo(s, t, c)}${s.tipo === 'capa' ? '' : rodape(t)}${textura(t)}</div>`;
  }).join('\n')}
</div></body></html>`;
  return { html, total: n, avisos };
}

export { COR, TEMAS, TITULO, PERFIL, esc, rico, lista, textura };

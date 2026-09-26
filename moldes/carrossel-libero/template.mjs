// Molde "Carrossel Libero" (@liberofilho): slides 1080×1350 com três fundos (blue, light, dark),
// textura granulada, Big Shoulders Display nos títulos e Schibsted Grotesk no texto.
// renderCarrossel(c) devolve { html, total }; o render.mjs fotografa cada slide.

const COR = {
  azul: '#0B4FD8', azulFundo: '#0839A8', off: '#EFF0F2', navy: '#14213A', navyFundo: '#121A27',
  azulClaro: '#8FB0FF', vermelho: '#FF2D55',
};
const TEMAS = {
  blue: { bg: `linear-gradient(170deg,${COR.azul} 0%,${COR.azulFundo} 100%)`, tit: '#fff', txt: '#fff', acento: '#fff', kicker: COR.off, caixa: COR.navyFundo, linha: 'rgba(255,255,255,.28)', num: '#fff', fundoTexto: '#0A46C2', escuro: true },
  light: { bg: COR.off, tit: COR.azul, txt: COR.navy, acento: COR.azul, kicker: COR.azul, caixa: COR.azul, linha: '#C9CFDB', num: COR.azul, fundoTexto: '#E4E6EA', escuro: false },
  dark: { bg: `radial-gradient(120% 90% at 100% 0%,#1d3566 0%,${COR.navyFundo} 60%)`, tit: '#fff', txt: '#E4E8F0', acento: COR.azul, kicker: COR.azulClaro, caixa: COR.azul, linha: 'rgba(255,255,255,.28)', num: COR.azulClaro, fundoTexto: '#1B2638', escuro: true },
};
const PERFIL = '@liberofilho';
const TITULO = "font-family:'Big Shoulders Display',sans-serif;font-weight:900;text-transform:uppercase";
const RUIDO = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .35 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
// **negrito** (800) e [[caixa]] (palavra com fundo sólido, só nos títulos).
const rico = (s, t) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b style="font-weight:800">$1</b>')
  .replace(/\[\[(.+?)\]\]/g, `<span style="background:${t.caixa};color:#fff;padding:0 14px;box-decoration-break:clone;-webkit-box-decoration-break:clone">$1</span>`);
const pad2 = n => String(n).padStart(2, '0');

// Tamanho do título: a maior palavra precisa caber na largura (Big Shoulders 900 ≈ 0,44 em por letra;
// o render ainda reduz se passar).
function tamanho(linhas, base, largura) {
  const maior = Math.max(...lista(linhas).join(' ').replace(/\[\[|\]\]|\*\*/g, '').split(/\s+/).map(p => p.length), 1);
  return Math.min(base, Math.floor(largura / (maior * 0.44)));
}
const titulo = (s, t, base, largura, extra = '') => lista(s.titulo).length
  ? `<h1 data-titulo style="${TITULO};margin:0;font-size:${s.ts || tamanho(s.titulo, base, largura)}px;line-height:${lista(s.titulo).some(l => l.includes('[[')) ? 1.1 : .88};color:${t.tit}${extra}">${lista(s.titulo).map(l => rico(l, t)).join('<br>')}</h1>` : '';
const kicker = (txt, t) => txt ? `<div style="font-size:28px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:${t.kicker}">${esc(txt)}</div>` : '';
const barra = t => `<span style="display:block;width:96px;height:12px;background:${t.acento};flex:none"></span>`;
const corpo = (s, t, px = 42) => lista(s.texto).map(p => `<p data-corpo style="margin:0;font-size:${px}px;font-weight:500;line-height:1.3;color:${t.txt};text-wrap:pretty">${rico(p, t)}</p>`).join('');

function textura(t) {
  return `<div style="position:absolute;inset:0;pointer-events:none;background-image:${RUIDO};opacity:${t.escuro ? .55 : .5};mix-blend-mode:${t.escuro ? 'overlay' : 'multiply'};z-index:5"></div>`;
}
function rodape(t, i, n) {
  const st = `position:absolute;bottom:72px;font-size:26px;font-weight:600;letter-spacing:.08em;color:${t.txt};z-index:4`;
  return `<div style="${st};left:110px">${PERFIL}</div><div style="${st};right:110px">${pad2(i)} / ${pad2(n)}</div>`;
}
function fundoTexto(s, t) {
  if (!s.fundoTexto) return '';
  const linha = `${esc(s.fundoTexto)} `.repeat(8);
  return `<div style="position:absolute;inset:-200px;transform:rotate(-12deg) scale(1.4);display:flex;flex-direction:column;justify-content:center;${TITULO};font-size:150px;line-height:.95;color:${t.fundoTexto};white-space:nowrap;overflow:hidden">${Array.from({ length: 14 }, () => `<div>${linha}</div>`).join('')}</div>`;
}
// Anéis vermelhos vazados, cortados nos cantos (superior direito e lateral esquerda).
function aneis(s) {
  if (!s.aneis) return '';
  return `<div data-anel style="position:absolute;right:-220px;top:-220px;width:440px;height:440px;border:72px solid ${COR.vermelho};border-radius:50%;box-sizing:border-box"></div>
  <div data-anel style="position:absolute;left:-340px;top:${s.aneis === 'baixo' ? 880 : 520}px;width:420px;height:420px;border:64px solid ${COR.vermelho};border-radius:50%;box-sizing:border-box"></div>`;
}
// Palavra-chave vertical colada numa borda. Devolve [html, largura ocupada].
function palavraVertical(s, t) {
  if (!s.palavra) return ['', 0];
  const palavras = lista(s.palavra).map(p => p.toUpperCase());
  const maior = Math.max(...palavras.map(p => p.length));
  const px = Math.min(300, Math.floor(1300 / (maior * 0.5)));
  const lado = s.palavraLado === 'direita' ? 'right' : 'left';
  const cor = t.escuro ? 'rgba(255,255,255,.14)' : 'rgba(11,79,216,.12)';
  return [`<div data-palavra style="position:absolute;${lado}:-18px;top:0;bottom:0;display:flex;flex-direction:row;justify-content:center;${TITULO};font-size:${px}px;line-height:.86;color:${cor}">${palavras.map(p => `<div style="writing-mode:vertical-rl;transform:rotate(180deg);text-align:center">${esc(p)}</div>`).join('')}</div>`, Math.round(px * 0.88 * palavras.length) + 40, lado];
}
// Foto: arquivo resolvido pelo render (c._fotos[nome] = caminho).
const foto = (c, nome) => (c._fotos || {})[nome] || nome;

// Objetos 3D (assets/, PNG sem fundo): "objeto" dentro de um slide e "pontes" atravessando a divisa
// entre dois slides. A área de texto do slide encolhe sozinha para não encostar neles (RESERVA).
let RESERVA = { esq: 0, dir: 0, topo: 150, base: 190 };
function reservar(obstaculos) {
  const r = { esq: 0, dir: 0, topo: 150, base: 190 };
  for (const o of obstaculos) {
    // Caixa do objeto girado (rot em graus) + 40px de folga.
    const g = Math.abs(o.rot || 0) * Math.PI / 180, e = (o.w * (Math.abs(Math.cos(g)) + Math.abs(Math.sin(g))) - o.w) / 2;
    const [x1, y1, x2, y2] = [o.x - e - 40, o.y - e - 40, o.x + o.w + e + 40, o.y + o.h + e + 40];
    const a = { l: Math.max(110, r.esq), t: r.topo, r: 1080 - Math.max(110, r.dir), b: 1350 - r.base };
    if (x2 <= a.l || x1 >= a.r || y2 <= a.t || y1 >= a.b) continue;
    // Escolhe o corte que deixa a maior área: pela direita, esquerda, cima ou baixo.
    const op = [
      ['dir', 1080 - x1, (x1 - a.l) * (a.b - a.t)], ['esq', x2, (a.r - x2) * (a.b - a.t)],
      ['topo', y2, (a.r - a.l) * (a.b - y2)], ['base', 1350 - y1, (a.r - a.l) * (y1 - a.t)],
    ].sort((m, n) => n[2] - m[2])[0];
    r[op[0]] = Math.max(r[op[0]], op[1]);
  }
  return r;
}
const objetoHtml = (o, x, y) => `<div data-objeto style="position:absolute;left:${x}px;top:${y}px;width:${o.tam || 400}px;height:${o.tam || 400}px;transform:rotate(${o.rot || 0}deg);z-index:4;pointer-events:none"><img src="../assets/${esc(o.img)}" style="width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 30px 40px rgba(8,16,40,.35))"></div>`;
// Posição do "objeto" de um slide: canto (sai pelo canto superior), lado (meio da borda) ou x/y livres.
function posObjeto(o) {
  const w = o.tam || 400;
  if (o.x != null) return [o.x, o.y ?? 400];
  const dir = o.lado !== 'esquerda';
  if (o.onde === 'lado') return [dir ? 1080 - w + 90 : -90, o.y ?? 470];
  if (o.onde === 'baixo') return [dir ? 1080 - w + 60 : -60, 1350 - w + 40];
  return [dir ? 1080 - w + 70 : -70, -50];
}

const area = (html, esq = 110, dir = 110, extra = '') => `<div data-area style="position:absolute;left:${Math.max(esq, RESERVA.esq)}px;right:${Math.max(dir, RESERVA.dir)}px;top:${RESERVA.topo}px;bottom:${RESERVA.base}px;display:flex;flex-direction:column;justify-content:center;gap:32px;z-index:3${extra}">${html}</div>`;

const TIPOS = {
  capa(s, t, c) {
    const tag = `<div style="position:absolute;left:110px;bottom:72px;background:${t === TEMAS.blue ? COR.navyFundo : COR.azul};color:#fff;font-size:30px;font-weight:700;padding:8px 18px;z-index:4">${PERFIL}</div>
      <div style="position:absolute;right:110px;bottom:80px;font-size:26px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${s.foto ? '#fff' : t.txt};z-index:4">Arraste →</div>`;
    if (s.foto) {
      return `<img data-foto src="${foto(c, s.foto)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top">
        <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(18,26,39,0) 30%,rgba(18,26,39,.82) 62%,#121A27 92%)"></div>
        <div data-area data-rosto style="position:absolute;left:110px;right:110px;bottom:190px;display:flex;flex-direction:column;gap:22px;z-index:3">
          ${kicker(s.kicker, TEMAS.dark)}
          ${s.pre ? `<div style="font-size:52px;font-weight:600;line-height:1.1;color:#fff">${rico(s.pre, TEMAS.dark)}</div>` : ''}
          ${titulo(s, { ...TEMAS.dark, caixa: COR.azul }, 180, 860)}
        </div>${tag}`;
    }
    // Capa com "imagem" (foto de banco de imagens, em imagens/): cartão com moldura branca no alto e o
    // título embaixo. Fotos de até ~1024px não aguentam a tela cheia, mas ficam nítidas no cartão.
    let cartao = '';
    if (s.imagem) {
      cartao = `<div data-foto style="position:absolute;left:150px;top:110px;width:780px;height:560px;background:#fff;padding:18px;transform:rotate(-2deg);box-shadow:0 30px 60px rgba(8,16,40,.35);z-index:2"><img src="../imagens/${esc(s.imagem)}" style="display:block;width:100%;height:100%;object-fit:cover;object-position:${esc(s.imagemPos || 'center')}"></div>`;
      RESERVA = { ...RESERVA, topo: Math.max(RESERVA.topo, 730) };
    }
    return `${cartao}${area(`${kicker(s.kicker, t)}
      ${s.pre ? `<div style="font-size:56px;font-weight:600;line-height:1.1;color:${t.txt}">${rico(s.pre, t)}</div>` : ''}
      ${titulo(s, t, 190, 860)}
      ${s.texto ? corpo(s, t, 40) : ''}`, 110, 110, `;align-items:center;text-align:center${s.imagem ? ';gap:16px' : ''}`)}${tag}`;
  },
  texto(s, t) {
    const [pv, larg, lado] = palavraVertical(s, t);
    const margem = s.palavra ? 110 : 180;
    const esq = lado === 'left' ? Math.max(larg, 110) : margem, dir = lado === 'right' ? Math.max(larg, 110) : margem;
    return `${pv}${area(`${kicker(s.kicker, t)}${titulo(s, t, 125, 1080 - esq - dir)}${barra(t)}${corpo(s, t, s.corpo || 42)}`, esq, dir)}`;
  },
  impacto(s, t) {
    const bloco = t === TEMAS.blue ? COR.navyFundo : COR.azul;
    const linhas = lista(s.titulo);
    return area(`${kicker(s.kicker, t)}
      <div style="align-self:flex-start;background:${bloco};padding:26px 34px 18px"><h1 data-titulo style="${TITULO};margin:0;font-size:${s.ts || tamanho(linhas, 165, 780)}px;line-height:.86;color:#fff">${linhas.map(l => rico(l, t)).join('<br>')}</h1></div>
      ${s.sub ? `<div style="${TITULO};font-size:60px;line-height:.95;color:${t.tit}">${rico(s.sub, t)}</div>` : ''}`);
  },
  lei(s, t) {
    const cor = t === TEMAS.blue ? '#fff' : COR.azul;
    return area(`${kicker(s.kicker, t)}${titulo(s, t, 120, 860)}
      <div style="border-left:8px solid ${cor};padding-left:32px"><p data-corpo style="margin:0;font-size:${s.corpo || 36}px;font-weight:700;line-height:1.3;color:${t.txt}">${rico(s.citacao, t)}</p></div>
      ${lista(s.traducao).map(p => `<p data-corpo style="margin:0;font-size:40px;font-weight:500;line-height:1.3;color:${t.txt}">${rico(p, t)}</p>`).join('')}`);
  },
  lista(s, t) {
    const romano = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
    const itens = lista(s.itens).map((it, i) => `<div style="display:flex;gap:28px;align-items:baseline;padding:0 0 22px;border-bottom:2px solid ${t.linha}">
        <span style="flex:none;min-width:48px;font-size:28px;font-weight:800;color:${t.num}">${(k => s.marcador === 'romano' ? romano[k] : s.marcador === 'letra' ? 'abcdefghij'[k] + ')' : pad2(k + 1))(i + (s.inicio || 0))}</span>
        <span data-corpo style="font-size:${s.corpo || 40}px;font-weight:500;line-height:1.3;color:${t.txt}">${rico(it, t)}</span></div>`).join('');
    return area(`${kicker(s.kicker, t)}${titulo(s, t, 120, 860)}<div style="display:flex;flex-direction:column;gap:22px">${itens}</div>`);
  },
  frases(s, t) {
    const [bg, fg] = t === TEMAS.light ? [COR.azul, '#fff'] : [COR.off, COR.azul];
    return area(`${kicker(s.kicker, t)}${titulo(s, t, 120, 860)}
      <div style="display:flex;flex-direction:column;align-items:flex-start;gap:18px">${lista(s.frases).map(f => `<span data-corpo style="background:${bg};color:${fg};font-size:44px;font-weight:600;line-height:1.2;padding:18px 26px">“${rico(f, t)}”</span>`).join('')}</div>`);
  },
  balao(s, t) {
    const bg = t === TEMAS.blue ? COR.navyFundo : COR.azul;
    return area(`${kicker(s.kicker, t)}${titulo(s, t, 120, 860)}
      <div style="position:relative;background:${bg};border-radius:56px 56px 56px 0;padding:72px 64px 64px">
        <div style="position:absolute;top:30px;right:44px;display:flex;gap:12px">${'<span style="width:22px;height:22px;border-radius:50%;background:#fff"></span>'.repeat(3)}</div>
        ${lista(s.texto).map(p => `<p data-corpo style="margin:0;font-size:${s.corpo || 46}px;font-weight:500;line-height:1.3;color:#fff">${rico(p, t)}</p>`).join('')}
      </div>`, 150, 150);
  },
  cta(s, t, c) {
    const [bg, fg] = t === TEMAS.blue ? [COR.off, COR.azul] : [COR.azul, '#fff'];
    const polaroid = s.foto ? `<div data-foto style="position:absolute;right:70px;top:380px;background:#fff;padding:28px 28px 70px;transform:rotate(-3deg);box-shadow:0 30px 60px rgba(10,20,40,.35);z-index:2"><img src="${foto(c, s.foto)}" style="display:block;width:300px;height:375px;object-fit:cover;object-position:center top"></div>` : '';
    return `${polaroid}${area(`${kicker(s.kicker, t)}${titulo(s, t, s.foto ? 96 : 130, s.foto ? 480 : 860)}${barra(t)}${corpo(s, t, s.corpo || 40)}
      ${s.botao ? `<span style="align-self:flex-start;background:${bg};color:${fg};border-radius:40px 40px 40px 0;padding:22px 40px;font-size:36px;font-weight:800;white-space:nowrap">${esc(s.botao)}</span>` : ''}`, 110, s.foto ? 490 : 110)}`;
  },
};

export function renderCarrossel(c) {
  const slides = lista(c.slides);
  const n = slides.length;
  const avisos = [];
  const pontes = lista(c.pontes);
  pontes.forEach(p => { if (!(p.entre >= 1 && p.entre < n)) avisos.push(`ponte "${p.img}": "entre" deve ser de 1 a ${n - 1}`); });
  slides.forEach((s, i) => {
    if (i >= 2 && s.tema === slides[i - 1].tema && s.tema === slides[i - 2].tema) avisos.push(`slides ${i - 1} a ${i + 1}: três fundos "${s.tema}" seguidos`);
    if (!TEMAS[s.tema]) avisos.push(`slide ${i + 1}: tema "${s.tema}" não existe (use blue, light ou dark)`);
  });
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@900&family=Schibsted+Grotesk:wght@500;600;700;800&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box}body{margin:0;font-family:'Schibsted Grotesk',sans-serif;-webkit-font-smoothing:antialiased}</style></head><body>
<div id="painel" style="position:relative;width:${n * 1080}px;height:1350px">
${slides.map((s, i) => {
    const t = TEMAS[s.tipo === 'capa' && s.foto ? 'dark' : s.tema] || TEMAS.blue;
    const tipo = TIPOS[s.tipo] || TIPOS.texto;
    // Obstáculos deste slide: o próprio objeto e a metade das pontes que cai nele.
    const obst = [];
    let obj = '';
    if (s.objeto) { const [x, y] = posObjeto(s.objeto), w = s.objeto.tam || 400; obst.push({ x, y, w, h: w, rot: s.objeto.rot }); obj = objetoHtml(s.objeto, x, y); }
    for (const p of pontes) {
      const w = p.tam || 360, y = p.y ?? 470;
      if (p.entre === i + 1) obst.push({ x: 1080 - w / 2, y, w, h: w, rot: p.rot });
      if (p.entre === i) obst.push({ x: -w / 2, y, w, h: w, rot: p.rot });
    }
    RESERVA = reservar(obst);
    const html = tipo(s, t, c);
    RESERVA = { esq: 0, dir: 0, topo: 150, base: 190 };
    return `<div id="slide-${i + 1}" style="position:absolute;left:${i * 1080}px;top:0;width:1080px;height:1350px;overflow:hidden;background:${t.bg}">
  ${fundoTexto(s, t)}${aneis(s)}${html}${obj}${s.tipo === 'capa' ? '' : rodape(t, i + 1, n)}${textura(t)}</div>`;
  }).join('\n')}
${pontes.map(p => { const w = p.tam || 360; return objetoHtml({ ...p, tam: w }, p.entre * 1080 - w / 2, p.y ?? 470); }).join('')}
</div></body></html>`;
  return { html, total: n, avisos };
}

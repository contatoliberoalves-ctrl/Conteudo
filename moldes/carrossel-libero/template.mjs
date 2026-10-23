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
// Rodapé só com o perfil: o autor pediu para tirar o contador de páginas ("03 / 09").
function rodape(t) {
  const st = `position:absolute;bottom:72px;font-size:26px;font-weight:600;letter-spacing:.08em;color:${t.txt};z-index:4`;
  return `<div style="${st};left:110px">${PERFIL}</div>`;
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

// Selo do perfil e "Arraste →" no pé das capas.
const pe = (t, claro) => `<div style="position:absolute;left:110px;bottom:72px;background:${t === TEMAS.blue ? COR.navyFundo : COR.azul};color:#fff;font-size:30px;font-weight:700;padding:8px 18px;z-index:6">${PERFIL}</div>
  <div style="position:absolute;right:110px;bottom:80px;font-size:26px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${claro ? '#fff' : t.txt};z-index:6">Arraste →</div>`;
const ttl = (linhas, t, px, extra = '') => `<h1 data-titulo style="${TITULO};margin:0;font-size:${px}px;line-height:.88;color:${t.tit}${extra}">${lista(linhas).map(l => rico(l, t)).join('<br>')}</h1>`;

// Capas alternativas ("estilo" no slide de capa), para cada tipo de post ter cara própria.
const CAPAS = {
  // "Teses que caíram na <peça>": sigla gigante, nome por extenso, fichas dos exames e carimbo JÁ CAIU.
  teses(s, t) {
    const exames = lista(s.exames);
    // Título pela linha mais longa (a sigla fica enorme; nomes por extenso encolhem).
    const maior = Math.max(...lista(s.titulo).map(l => l.replace(/\[\[|\]\]|\*\*/g, '').length), 1);
    const px = s.ts || Math.min(330, Math.floor(860 / (maior * 0.46)));
    const linhasFichas = Math.ceil(exames.length / 5);
    return `<div style="position:absolute;left:0;right:0;top:0;height:14px;background:${COR.azul}"></div>
      <div style="position:absolute;left:110px;top:150px;background:${COR.navy};color:#fff;font-size:34px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;padding:14px 24px;z-index:3">${esc(s.rotulo || 'Teses que caíram na')}</div>
      <div data-objeto style="position:absolute;right:100px;top:290px;transform:rotate(8deg);border:10px solid ${COR.vermelho};outline:4px solid ${COR.vermelho};outline-offset:8px;padding:10px 26px 4px;text-align:center;color:${COR.vermelho};z-index:4">
        <div style="${TITULO};font-size:96px;line-height:.9">Já caiu</div>
        ${exames.length ? `<div style="font-size:28px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;padding-bottom:10px">${exames.length === 1 ? '1 vez' : exames.length + ' vezes'}</div>` : ''}
      </div>
      <div data-area style="position:absolute;left:110px;right:110px;top:530px;bottom:${230 + linhasFichas * 64}px;display:flex;flex-direction:column;justify-content:center;gap:26px;z-index:3">
        ${ttl(s.titulo, t, px, `;line-height:${lista(s.titulo).some(l => l.includes('[[')) ? 1.05 : .88}`)}
        ${s.nome ? `<div data-corpo style="font-size:44px;font-weight:700;line-height:1.15;color:${COR.navy}">${rico(s.nome, t)}</div>` : ''}
      </div>
      <div style="position:absolute;left:110px;right:110px;bottom:190px;display:flex;flex-wrap:wrap;gap:14px;z-index:3">
        ${exames.map(e => `<span style="border:4px solid ${COR.navy};background:#fff;color:${COR.navy};font-size:32px;font-weight:800;letter-spacing:.04em;padding:8px 16px">${esc(e)}</span>`).join('')}
      </div>${pe(t)}`;
  },
  // Foto em tela cheia (montagem) com o título dividido nos cantos livres: "cima" no alto à esquerda (com "pre" numa etiqueta logo abaixo), selo
  // vermelho no meio e "baixo" embaixo à esquerda (para comparações sobre uma foto: "Voto nulo x voto em branco").
  cantos(s, t, c) {
    const src = s.foto ? foto(c, s.foto) : `../imagens/${esc(s.imagem)}`;
    const linhas = (v, px, cor) => lista(v).map(l => `<div style="${TITULO};font-size:${px}px;line-height:.86;color:${cor}">${rico(l, TEMAS.dark)}</div>`).join('');
    return `<img data-foto src="${src}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${esc(s.imagemPos || 'center top')}">
      <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(18,26,39,.35) 0%,rgba(18,26,39,0) 30%,rgba(18,26,39,0) 62%,rgba(18,26,39,.85) 88%)"></div>
      <div style="position:absolute;left:${s.margem || 70}px;top:${s.topo || 70}px;display:flex;flex-direction:column;align-items:flex-start;gap:20px;z-index:3"><div>${linhas(s.cima, s.tc || 190, '#fff')}</div>
        ${s.pre ? `<div style="background:#fff;color:${COR.navy};font-size:34px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:10px 20px;transform:rotate(-2deg)">${rico(s.pre, TEMAS.light)}</div>` : ''}</div>
      ${s.selo ? `<div style="position:absolute;left:${(s.seloPos || [190, 520])[0]}px;top:${(s.seloPos || [190, 520])[1]}px;width:170px;height:170px;border-radius:50%;background:${COR.vermelho};display:flex;align-items:center;justify-content:center;${TITULO};font-size:110px;color:#fff;transform:rotate(-8deg);box-shadow:0 20px 50px rgba(8,16,40,.45);z-index:4">${esc(s.selo)}</div>` : ''}
      <div style="position:absolute;left:${s.margem || 70}px;bottom:${s.base || 150}px;display:flex;flex-direction:column;align-items:flex-start;gap:16px;z-index:3">
        <div>${linhas(s.baixo, s.tb || 170, '#fff')}</div></div>
      <div style="position:absolute;left:${s.margem || 70}px;bottom:62px;background:${COR.azul};color:#fff;font-size:30px;font-weight:700;padding:8px 18px;z-index:4">${PERFIL}</div>
      <div style="position:absolute;right:80px;bottom:70px;font-size:26px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#fff;z-index:4">Arraste →</div>`;
  },
  // Ringue: dois recortes (PNG sem fundo) frente a frente sobre fundo dividido azul x navy, um terceiro
  // personagem num círculo no meio com carimbo vermelho e o título curto no alto.
  // Campos: pre (etiqueta), titulo, esquerda/direita/centro ({img, h, x, y}), carimbo.
  ringue(s, t, c) {
    const rec = (r, lado) => r ? `<img data-foto src="${foto(c, r.img)}" style="position:absolute;${lado}:${r.x ?? -20}px;bottom:${r.y ?? 0}px;height:${r.h || 900}px;z-index:2;filter:drop-shadow(0 20px 40px rgba(8,16,40,.45))">` : '';
    const ce = s.centro;
    return `<div style="position:absolute;inset:0;background:${COR.azul}"></div>
      <div style="position:absolute;inset:0;background:${COR.navyFundo};clip-path:polygon(58% 0,100% 0,100% 100%,42% 100%)"></div>
      ${rec(s.esquerda, 'left')}${rec(s.direita, 'right')}
      ${ce ? `<div style="position:absolute;left:${(ce.x ?? 540) - (ce.tam || 260) / 2}px;top:${ce.y ?? 470}px;width:${ce.tam || 260}px;height:${ce.tam || 260}px;border-radius:50%;overflow:hidden;border:10px solid #fff;background:#fff;box-shadow:0 20px 50px rgba(8,16,40,.5);z-index:4"><img src="${foto(c, ce.img)}" style="width:100%;height:100%;object-fit:cover;object-position:center top;filter:grayscale(1)"></div>
        ${s.carimbo ? `<div style="position:absolute;left:${ce.x ?? 540}px;top:${(ce.y ?? 470) + (ce.tam || 260) - 40}px;transform:translateX(-50%) rotate(-8deg);border:7px solid ${COR.vermelho};background:rgba(255,255,255,.92);color:${COR.vermelho};${TITULO};font-size:54px;line-height:1;padding:8px 18px 4px;white-space:nowrap;z-index:5">${esc(s.carimbo)}</div>` : ''}` : ''}
      <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(18,26,39,0) 80%,rgba(18,26,39,.85) 100%);z-index:3"></div>
      <div style="position:absolute;left:0;right:0;top:${s.topo || 80}px;display:flex;flex-direction:column;align-items:center;gap:18px;text-align:center;z-index:5">
        ${s.pre ? `<div style="background:#fff;color:${COR.navy};font-size:36px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;padding:10px 22px;transform:rotate(-2deg)">${rico(s.pre, TEMAS.light)}</div>` : ''}
        <h1 data-titulo style="${TITULO};margin:0;font-size:${s.ts || 150}px;line-height:.9;color:#fff;text-shadow:0 8px 30px rgba(8,16,40,.45)">${lista(s.titulo).map(l => rico(l, TEMAS.dark)).join('<br>')}</h1>
      </div>
      <div style="position:absolute;left:70px;bottom:62px;background:${COR.azul};color:#fff;font-size:30px;font-weight:700;padding:8px 18px;z-index:6">${PERFIL}</div>
      <div style="position:absolute;right:80px;bottom:70px;font-size:26px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#fff;z-index:6">Arraste →</div>`;
  },
  // Apuração: placar de eleição de TV. Cada candidato numa linha (foto redonda, nome, % e barra até a linha
  // da "meta", ex.: 50%); "anulado" deixa a linha em PB, riscada e com carimbo.
  // Campos: pre, titulo, meta, candidatos [{foto, nome, partido, pct, anulado, carimbo}].
  apuracao(s, t, c) {
    const meta = s.meta ?? 50, max = s.max ?? 60;
    const x = p => `${(p / max) * 100}%`;
    const linhas = lista(s.candidatos).map((k, i) => {
      const cor = k.anulado ? 'rgba(255,255,255,.35)' : i === 0 ? COR.azulClaro : '#fff';
      return `<div style="position:relative;display:flex;align-items:center;gap:30px;opacity:${k.anulado ? .9 : 1}">
        <div style="flex:none;width:${k.anulado ? 130 : 170}px;height:${k.anulado ? 130 : 170}px;border-radius:50%;overflow:hidden;border:6px solid ${k.anulado ? 'rgba(255,255,255,.4)' : i === 0 ? COR.azulClaro : '#fff'};margin-left:${k.anulado ? 20 : 0}px"><img src="${foto(c, k.foto)}" style="width:100%;height:100%;object-fit:cover;${k.anulado ? 'filter:grayscale(1) brightness(.8)' : ''}"></div>
        <div style="flex:1;display:flex;flex-direction:column;gap:12px">
          <div style="display:flex;justify-content:space-between;align-items:baseline">
            <span style="font-size:${k.anulado ? 32 : 38}px;font-weight:800;letter-spacing:.02em;text-transform:uppercase;color:${k.anulado ? 'rgba(255,255,255,.6)' : '#fff'}">${esc(k.nome)}${k.partido ? ` <span style="font-weight:500;opacity:.7">${esc(k.partido)}</span>` : ''}</span>
            <span style="${TITULO};font-size:${k.anulado ? 64 : 92}px;line-height:.9;color:${cor};${k.anulado ? 'text-decoration:line-through;text-decoration-thickness:6px;text-decoration-color:' + COR.vermelho : ''}">${esc(String(k.pct).replace('.', ','))}%</span>
          </div>
          <div style="position:relative;height:${k.anulado ? 16 : 26}px;background:rgba(255,255,255,.12)"><div style="position:absolute;left:0;top:0;bottom:0;width:${x(k.pct)};background:${cor}"></div>
            <div style="position:absolute;left:${x(meta)};top:-10px;bottom:-10px;border-left:5px solid ${COR.vermelho}"></div>
            ${i === 0 ? `<div style="position:absolute;left:${x(meta)};top:calc(100% + 14px);transform:translateX(-50%);font-size:24px;font-weight:800;letter-spacing:.06em;color:${COR.vermelho};white-space:nowrap">${esc(s.metaTexto || meta + '%')}</div>` : ''}</div>
        </div>
        ${k.carimbo ? `<div style="position:absolute;left:${k.carimboX ?? 430}px;top:-4px;transform:rotate(-6deg);border:5px solid ${COR.vermelho};color:${COR.vermelho};background:rgba(18,26,39,.85);${TITULO};font-size:40px;line-height:1;padding:5px 12px 1px;z-index:3">${esc(k.carimbo)}</div>` : ''}
      </div>`;
    }).join('');
    return `<div style="position:absolute;inset:0;background:radial-gradient(120% 80% at 50% 0%,${COR.azulFundo} 0%,${COR.navyFundo} 62%)"></div>
      <div style="position:absolute;left:90px;right:90px;top:${s.topo || 90}px;display:flex;flex-direction:column;align-items:flex-start;gap:20px;z-index:3">
        ${s.pre ? `<div style="display:flex;align-items:center;gap:14px;font-size:30px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#fff"><span style="width:20px;height:20px;border-radius:50%;background:${COR.vermelho};box-shadow:0 0 0 8px rgba(255,45,85,.25)"></span>${esc(s.pre)}</div>` : ''}
        <h1 data-titulo style="${TITULO};margin:0;font-size:${s.ts || 170}px;line-height:${lista(s.titulo).some(l => l.includes('[[')) ? 1.08 : .88};color:#fff">${lista(s.titulo).map(l => rico(l, { ...TEMAS.dark, caixa: COR.azul })).join('<br>')}</h1>
      </div>
      <div style="position:absolute;left:90px;right:90px;top:${s.placarY || 640}px;bottom:190px;z-index:3">
        
        <div style="position:relative;display:flex;flex-direction:column;gap:50px">${linhas}</div>
      </div>
      <div style="position:absolute;left:90px;bottom:72px;background:${COR.azul};color:#fff;font-size:30px;font-weight:700;padding:8px 18px;z-index:4">${PERFIL}</div>
      <div style="position:absolute;right:90px;bottom:80px;font-size:26px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#fff;z-index:4">Arraste →</div>`;
  },
  // Treino de peças: título no alto e uma folha de peça inclinada com as etapas para marcar, o carimbo do
  // caso e um lápis. Campos: kicker, titulo, etapas (itens da folha), caso (carimbo), texto (linha de baixo).
  treino(s, t) {
    const etapas = lista(s.etapas).map(e => `<div style="display:flex;align-items:center;gap:22px;padding:16px 0;border-bottom:2px dashed #C9CFDB">
        <span style="flex:none;width:46px;height:46px;border:5px solid ${COR.azul};border-radius:8px"></span>
        <span style="${TITULO};font-size:52px;line-height:1;color:${COR.navy}">${esc(e)}</span>
        <span style="flex:1;height:3px;background:#E1E5EC;margin-left:6px"></span></div>`).join('');
    return `<div style="position:absolute;inset:0;background:${t.bg}"></div>
      <div style="position:absolute;left:100px;right:100px;top:90px;display:flex;flex-direction:column;gap:18px;z-index:3">
        ${kicker(s.kicker, t)}
        <h1 data-titulo style="${TITULO};margin:0;font-size:${s.ts || 150}px;line-height:1.02;color:#fff">${lista(s.titulo).map(l => rico(l, { ...t, caixa: COR.navyFundo })).join('<br>')}</h1>
      </div>
      <div style="position:absolute;left:150px;width:760px;top:${s.folhaY || 600}px;height:${s.folhaH || 540}px;background:#fff;transform:rotate(-4deg);transform-origin:top left;box-shadow:0 40px 80px rgba(8,16,40,.45);padding:46px 60px;z-index:2">
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:24px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:${COR.azul};padding-bottom:14px;border-bottom:4px solid ${COR.azul}"><span>${esc(s.folha || 'Estrutura da peça')}</span><span style="color:#9AA3B5">${esc(s.folhaDir || '')}</span></div>
        ${etapas}
      </div>
      ${s.caso ? `<div style="position:absolute;right:90px;top:${(s.folhaY || 600) - 70}px;transform:rotate(10deg);border:8px solid ${COR.vermelho};outline:3px solid ${COR.vermelho};outline-offset:6px;color:${COR.vermelho};background:rgba(255,255,255,.92);padding:8px 26px 2px;text-align:center;z-index:4"><div style="font-size:22px;font-weight:800;letter-spacing:.2em">CASO</div><div style="${TITULO};font-size:110px;line-height:.9">${esc(s.caso)}</div></div>` : ''}
      <img src="../assets/pencil.png" style="position:absolute;right:40px;bottom:150px;width:260px;transform:rotate(-30deg);z-index:4;filter:drop-shadow(0 24px 30px rgba(8,16,40,.4))">
      ${pe(t, true)}`;
  },
  // Trunfo: cartas de super-herói (jogo de cartas) com os atributos do cargo. 1 carta no centro ou 2
  // inclinadas lado a lado. Campos: pre, titulo, ts, cartas [{nome, foto, numero, fotoPos}] (sem foto =
  // silhueta com "?"), atributos [[rotulo, valor]] (valor 0 sai em vermelho), cartaRotulo, cartasY.
  trunfo(s, t, c) {
    const cartas = lista(s.cartas), duas = cartas.length > 1;
    const w = duas ? 400 : 520, hFoto = duas ? (lista(s.atributos).length > 3 ? 250 : 310) : 380;
    const attrs = lista(s.atributos).map(([r, v]) => `<div style="display:flex;justify-content:space-between;align-items:center;padding:${duas ? 7 : 11}px 0;border-bottom:2px solid #E1E5EC">
        <span style="font-size:${duas ? 23 : 27}px;font-weight:700;color:${COR.navy}">${esc(r)}</span>
        <span style="${TITULO};font-size:${duas ? 40 : 48}px;line-height:1;color:${+v === 0 ? COR.vermelho : COR.azul}">${esc(v)}</span></div>`).join('');
    const silhueta = `<svg viewBox="0 0 200 160" style="position:absolute;inset:0;width:100%;height:100%" preserveAspectRatio="xMidYMax meet"><circle cx="100" cy="62" r="36" fill="#2A3A5C"/><path d="M30 160c4-40 34-58 70-58s66 18 70 58z" fill="#2A3A5C"/></svg>
      <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;${TITULO};font-size:${duas ? 170 : 220}px;color:${COR.vermelho};text-shadow:0 8px 0 ${COR.navyFundo}">?</div>`;
    const carta = (k, i) => {
      const rot = duas ? (i ? 5 : -5) : -3;
      const x = duas ? (i ? 590 : 90) : (1080 - w) / 2;
      return `<div style="position:absolute;left:${x}px;top:${s.cartasY || (duas ? 620 : 520)}px;width:${w}px;background:#fff;border-radius:26px;padding:16px;transform:rotate(${rot}deg);box-shadow:0 34px 70px rgba(8,16,40,.5);z-index:${3 + i}">
        <div style="border:5px solid ${COR.navyFundo};border-radius:16px;overflow:hidden">
          <div style="display:flex;justify-content:space-between;align-items:center;background:${COR.navyFundo};color:#fff;padding:10px 16px">
            <span style="font-size:22px;font-weight:800;letter-spacing:.16em">${esc(s.cartaRotulo || 'PRESIDENTE')}</span>
            <span style="background:${COR.vermelho};${TITULO};font-size:30px;line-height:1;padding:4px 10px 0;border-radius:6px">${esc(k.numero || (i ? 'B1' : 'A1'))}</span></div>
          <div style="position:relative;height:${hFoto}px;background:radial-gradient(circle at 50% 30%,#3D6FE0 0%,${COR.azulFundo} 70%);overflow:hidden">
            ${k.foto ? `<img src="${foto(c, k.foto)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${esc(k.fotoPos || 'center top')}">` : silhueta}
            <div style="position:absolute;left:0;right:0;bottom:0;background:linear-gradient(0deg,rgba(18,26,39,.9),rgba(18,26,39,0));padding:40px 16px 10px;${TITULO};font-size:${duas ? 50 : 60}px;line-height:.9;color:#fff">${esc(k.nome)}</div></div>
          <div style="padding:6px 16px 10px">${attrs}</div>
        </div></div>`;
    };
    return `<div style="position:absolute;right:-230px;top:-230px;width:520px;height:520px;border:80px solid ${COR.vermelho};border-radius:50%;z-index:1"></div>
      <div style="position:absolute;left:-260px;bottom:-200px;width:520px;height:520px;border:70px solid rgba(255,255,255,.12);border-radius:50%;z-index:1"></div>
      <div style="position:absolute;left:100px;right:100px;top:${s.topo || 90}px;display:flex;flex-direction:column;align-items:flex-start;gap:20px;z-index:3">
        ${s.pre ? `<span style="background:${COR.navyFundo};color:#fff;font-size:28px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;padding:10px 18px">${esc(s.pre)}</span>` : ''}
        <h1 data-titulo style="${TITULO};margin:0;font-size:${s.ts || 118}px;line-height:1.04;color:#fff">${lista(s.titulo).map(l => rico(l, { ...t, caixa: COR.navyFundo })).join('<br>')}</h1>
        ${s.texto ? `<p style="margin:6px 0 0;font-size:40px;font-weight:600;line-height:1.25;color:#E6ECFA">${rico(s.texto, t)}</p>` : ''}
      </div>
      ${cartas.map(carta).join('')}
      ${s.selo ? `<div style="position:absolute;left:50%;top:${(s.cartasY || 560) + 300}px;transform:translateX(-50%) rotate(-8deg);width:150px;height:150px;border-radius:50%;background:${COR.vermelho};display:flex;align-items:center;justify-content:center;${TITULO};font-size:70px;color:#fff;box-shadow:0 18px 40px rgba(8,16,40,.45);z-index:8">${esc(s.selo)}</div>` : ''}
      ${pe(t, true)}`;
  },
  // Plenário: título no alto e as fotos dos membros de um tribunal num arco (como as cadeiras do plenário),
  // com o anel na cor do grupo de origem e a legenda embaixo. Campos: pre, titulo, ts, numero (no meio do
  // arco), numeroTexto, assentos [{foto, grupo}], grupos {nome: cor} (cores: vermelho, branco, claro, navy).
  plenario(s, t, c) {
    const cores = { vermelho: COR.vermelho, branco: '#fff', claro: COR.azulClaro, navy: COR.navyFundo };
    const grupos = s.grupos || {};
    const corDe = g => cores[grupos[g]] || '#fff';
    const as = lista(s.assentos), n = as.length, R = s.raio || 370, cx = 540, cy = s.arcoY || 990, d = s.diam || 200;
    const assentos = as.map((a, i) => {
      const ang = Math.PI - (n > 1 ? i / (n - 1) : .5) * Math.PI, x = cx + R * Math.cos(ang), y = cy - R * Math.sin(ang);
      return `<div data-foto style="position:absolute;left:${Math.round(x - d / 2)}px;top:${Math.round(y - d / 2)}px;width:${d}px;height:${d}px;border-radius:50%;border:9px solid ${corDe(a.grupo)};overflow:hidden;background:${COR.navyFundo};box-shadow:0 20px 40px rgba(8,16,40,.45);z-index:3">
        <img src="${foto(c, a.foto)}" style="width:100%;height:100%;object-fit:cover;transform:scale(1.08);object-position:${esc(a.fotoPos || 'center 30%')}"></div>`;
    }).join('');
    const legenda = Object.keys(grupos).map(g => `<span style="display:flex;align-items:center;gap:12px;font-size:28px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#fff"><span style="width:26px;height:26px;border-radius:50%;border:7px solid ${corDe(g)}"></span>${esc(g)}</span>`).join('');
    return `<div style="position:absolute;right:-230px;top:-230px;width:520px;height:520px;border:80px solid ${COR.vermelho};border-radius:50%;z-index:1"></div>
      <div style="position:absolute;left:${cx - R - 40}px;top:${cy - R - 40}px;width:${2 * R + 80}px;height:${2 * R + 80}px;border-radius:50%;border:3px dashed rgba(255,255,255,.25);z-index:1"></div>
      <div style="position:absolute;left:100px;right:100px;top:${s.topo || 90}px;display:flex;flex-direction:column;align-items:flex-start;gap:20px;z-index:3">
        ${s.pre ? `<span style="background:${COR.navyFundo};color:#fff;font-size:28px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;padding:10px 18px">${esc(s.pre)}</span>` : ''}
        <h1 data-titulo style="${TITULO};margin:0;font-size:${s.ts || 150}px;line-height:1.02;color:#fff">${lista(s.titulo).map(l => rico(l, { ...t, caixa: COR.navyFundo })).join('<br>')}</h1>
      </div>
      ${assentos}
      <div style="position:absolute;left:${cx - 210}px;width:420px;top:${cy - R + 140}px;display:flex;flex-direction:column;align-items:center;text-align:center;z-index:3">
        ${s.numero ? `<div style="${TITULO};font-size:${s.tn || 250}px;line-height:.8;color:transparent;-webkit-text-stroke:6px #fff">${esc(s.numero)}</div>` : ''}
        ${s.numeroTexto ? `<div style="margin-top:10px;font-size:32px;font-weight:700;line-height:1.2;color:#fff">${rico(s.numeroTexto, t)}</div>` : ''}
      </div>
      <div style="position:absolute;left:0;right:0;top:${cy + d / 2 + 34}px;display:flex;justify-content:center;gap:36px;z-index:3">${legenda}</div>
      ${pe(t, true)}`;
  },
  // Produto (livro, apostila): a foto do produto (PNG sem fundo em fotos/) grande e inclinada à direita,
  // com o título à esquerda. Campos: pre, titulo, ts, texto, produto {img, h, x, y, rot}, selo (bola vermelha,
  // ex.: "11ª edição"), hashtag (balão no pé: "Comente #X").
  produto(s, t, c) {
    const p = s.produto || {};
    return `<div style="position:absolute;right:-230px;top:-230px;width:520px;height:520px;border:80px solid ${COR.vermelho};border-radius:50%;z-index:1"></div>
      <div style="position:absolute;left:-200px;bottom:-260px;width:620px;height:620px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.18),rgba(255,255,255,0) 70%);z-index:1"></div>
      <img data-foto src="${foto(c, p.img)}" style="position:absolute;left:${p.x ?? 470}px;top:${p.y ?? 500}px;height:${p.h || 720}px;transform:rotate(${p.rot ?? 6}deg);filter:drop-shadow(0 40px 60px rgba(8,16,40,.55));z-index:3">
      <div data-area style="position:absolute;left:100px;width:${s.largura || 520}px;top:${s.topo || 110}px;display:flex;flex-direction:column;align-items:flex-start;gap:22px;z-index:4">
        ${s.pre ? `<span style="background:${COR.navyFundo};color:#fff;font-size:28px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;padding:10px 18px">${esc(s.pre)}</span>` : ''}
        <h1 data-titulo style="${TITULO};margin:0;font-size:${s.ts || 130}px;line-height:1.02;color:#fff">${lista(s.titulo).map(l => rico(l, { ...t, caixa: COR.navyFundo })).join('<br>')}</h1>
        ${s.texto ? `<p style="margin:4px 0 0;font-size:36px;font-weight:600;line-height:1.25;color:#E6ECFA">${rico(s.texto, t)}</p>` : ''}
      </div>
      ${s.selo ? `<div style="position:absolute;left:${s.seloX ?? 380}px;top:${s.seloY ?? 820}px;transform:rotate(-10deg);width:190px;height:190px;border-radius:50%;background:${COR.vermelho};display:flex;align-items:center;justify-content:center;text-align:center;${TITULO};font-size:50px;line-height:.95;color:#fff;box-shadow:0 18px 40px rgba(8,16,40,.45);z-index:6">${lista(s.selo).map(esc).join('<br>')}</div>` : ''}
      ${s.hashtag ? `<div style="position:absolute;left:100px;bottom:170px;background:#fff;color:${COR.azul};border-radius:40px 40px 40px 0;padding:22px 36px;font-size:40px;font-weight:800;box-shadow:0 20px 40px rgba(8,16,40,.35);z-index:6">Comente ${esc(s.hashtag)}</div>` : ''}
      ${s.semArraste ? pe(t, true).replace(/<div[^>]*>Arraste →<\/div>/, '') : pe(t, true)}`;
  },
  // Caso autoral: personagem/famoso recortado (PNG sem fundo) na frente do título gigante (o título fica
  // atrás da cabeça, efeito de revista), luz suave atrás da pessoa, etiqueta "Qual é a peça?" e o nome do
  // personagem numa ficha. Tema blue (azul) ou dark (escuro). Campos: kicker, titulo, ts, tituloY, recorte
  // {img, h, x}, nome (ex.: "Rony Weasley"), nomeRotulo (padrão "Personagem do caso"), selo (ex.: "Caso 08").
  autoral(s, t, c) {
    const r = s.recorte || {}, h = r.h || 900, escuro = s.tema === 'dark';
    const fundo = escuro ? COR.navyFundo : COR.azulFundo;
    const luz = escuro ? 'rgba(11,79,216,.55)' : 'rgba(143,176,255,.55)';
    const ty = s.tituloY || 250;
    return `<div style="position:absolute;inset:0;background:repeating-linear-gradient(-55deg,rgba(255,255,255,${escuro ? .035 : .05}) 0 2px,transparent 2px 46px);z-index:1"></div>
      <div style="position:absolute;left:50%;top:${1350 - h - 40}px;transform:translateX(-50%);width:1100px;height:1100px;background:radial-gradient(circle,${luz} 0%,rgba(0,0,0,0) 62%);z-index:1"></div>
      <div style="position:absolute;left:0;right:0;top:${ty}px;text-align:center;z-index:2">
        <h1 data-titulo style="${TITULO};margin:0;font-size:${s.ts || tamanho(s.titulo, 330, 1000)}px;line-height:.82;color:${escuro ? '#fff' : '#fff'};letter-spacing:.01em;text-shadow:0 14px 40px rgba(8,16,40,.35)">${lista(s.titulo).map(l => rico(l, { ...t, caixa: COR.vermelho })).join('<br>')}</h1>
      </div>
      ${s.kicker ? `<div style="position:absolute;left:0;right:0;top:${ty - 78}px;display:flex;align-items:center;justify-content:center;gap:26px;font-size:40px;font-weight:800;font-style:italic;letter-spacing:.22em;text-transform:uppercase;color:#fff;white-space:nowrap;z-index:3"><span style="width:110px;height:3px;background:${COR.azulClaro}"></span>${esc(s.kicker)}<span style="width:110px;height:3px;background:${COR.azulClaro}"></span></div>` : ''}
      ${r.img ? `<img data-foto src="${foto(c, r.img)}" style="position:absolute;left:${r.x != null ? r.x + 'px' : '50%'};bottom:0;height:${h}px;${r.x != null ? '' : 'transform:translateX(-50%);'}filter:drop-shadow(0 24px 50px rgba(8,16,40,.5));z-index:4">` : ''}
      <div style="position:absolute;left:0;right:0;bottom:0;height:330px;background:linear-gradient(180deg,rgba(0,0,0,0) 0%,${fundo} 88%);z-index:5"></div>
      ${s.nome ? `<div style="position:absolute;left:80px;bottom:150px;display:flex;flex-direction:column;align-items:flex-start;gap:8px;z-index:6">
        <span style="font-size:24px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${COR.azulClaro}">${esc(s.nomeRotulo || 'Personagem do caso')}</span>
        <span style="${TITULO};font-size:72px;line-height:.9;color:#fff">${esc(s.nome)}</span></div>` : ''}
      ${s.selo ? `<div style="position:absolute;right:80px;bottom:172px;transform:rotate(-6deg);background:${COR.vermelho};color:#fff;${TITULO};font-size:54px;line-height:1;padding:12px 22px 6px;box-shadow:0 14px 30px rgba(8,16,40,.35);z-index:6">${esc(s.selo)}</div>` : ''}
      <div style="position:absolute;left:80px;top:60px;display:flex;align-items:center;gap:18px;z-index:6"><span style="font-size:30px;font-weight:800;color:#fff">${PERFIL}</span><span style="display:flex;gap:7px">${'<span style="width:9px;height:9px;border-radius:50%;background:#fff"></span>'.repeat(3)}</span></div>
      <div style="position:absolute;right:80px;top:76px;width:420px;height:3px;background:rgba(255,255,255,.8);z-index:6"></div>
      ${s.rodape ? `<div style="position:absolute;left:80px;right:80px;bottom:70px;font-size:24px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#fff;z-index:6">${esc(s.rodape)}</div>` : ''}`;
  },
  // Notícia: foto no alto (até a metade), etiqueta inclinada ("Notícia urgente") na emenda e a manchete
  // embaixo, no navy. Campos: foto, fotoPos, fotoH (px, padrão 760), etiqueta, titulo (use [[caixa]]), ts,
  // texto (linha fina opcional), fonte (crédito no pé).
  noticia(s, t, c) {
    const fh = s.fotoH || 760;
    return `<img data-foto src="${foto(c, s.foto)}" style="position:absolute;left:0;top:0;width:1080px;height:${fh}px;object-fit:cover;object-position:${esc(s.fotoPos || 'center top')};z-index:1">
      <div style="position:absolute;left:0;right:0;top:${fh}px;bottom:0;background:linear-gradient(180deg,${COR.azulFundo} 0%,${COR.navyFundo} 100%);z-index:1"></div>
      <div style="position:absolute;left:0;right:0;top:${fh}px;height:10px;background:#fff;z-index:2"></div>
      <div style="position:absolute;left:60px;top:${fh - 92}px;transform:skewX(-10deg);background:${COR.azul};border:5px solid #fff;box-shadow:0 18px 30px rgba(8,16,40,.35);padding:14px 44px 10px;z-index:4"><div style="transform:skewX(10deg);${TITULO};font-size:76px;line-height:1;color:#fff">${esc(s.etiqueta || 'Notícia urgente')}</div></div>
      <div data-area style="position:absolute;left:90px;right:90px;top:${fh + 80}px;bottom:150px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:20px;text-align:center;z-index:3">
        <h1 data-titulo style="${TITULO};margin:0;font-size:${s.ts || 92}px;line-height:${lista(s.titulo).some(l => l.includes('[[')) ? 1.08 : .95};color:#fff">${lista(s.titulo).map(l => rico(l, { ...t, caixa: COR.vermelho })).join('<br>')}</h1>
        ${s.texto ? `<p data-corpo style="margin:0;font-size:34px;font-weight:500;line-height:1.3;color:#C9D4EA">${rico(s.texto, TEMAS.dark)}</p>` : ''}
      </div>
      <div style="position:absolute;left:90px;right:90px;bottom:62px;display:flex;align-items:center;gap:24px;z-index:3"><span style="font-size:30px;font-weight:700;color:#fff">${PERFIL}</span><span style="flex:1;height:3px;background:rgba(255,255,255,.7)"></span>${s.fonte ? `<span style="font-size:22px;font-weight:600;color:#C9D4EA">${esc(s.fonte)}</span>` : ''}</div>`;
  },
  // Meme: fundo escuro, a legenda em texto corrido em cima e a foto inteira logo abaixo (bloco centralizado).
  // Campos: foto, titulo (legenda; linhas ou texto), ts (px da legenda, padrão 56).
  meme(s, t, c) {
    return `<div style="position:absolute;inset:0;background:#0E1420;z-index:0"></div>
      <div data-area style="position:absolute;left:70px;right:70px;top:110px;bottom:130px;display:flex;flex-direction:column;justify-content:center;gap:44px;z-index:3">
        <h1 data-titulo style="margin:0;font-size:${s.ts || 56}px;font-weight:700;line-height:1.22;color:#fff">${lista(s.titulo).map(l => esc(l)).join(' ')}</h1>
        <img data-foto src="${foto(c, s.foto)}" style="display:block;width:100%;border-radius:6px">
      </div>
      <div style="position:absolute;left:70px;bottom:60px;font-size:28px;font-weight:700;color:rgba(255,255,255,.75);z-index:3">${PERFIL}</div>`;
  },
  // Urgente (plantão de TV): foto em tela cheia, selo "Urgente" com bolinha vermelha no alto e tarja de
  // manchete embaixo (faixa azul com o rótulo + caixa branca com a manchete) e letreiro vermelho no pé.
  // Campos: foto, fotoPos, selo (padrão "Urgente"), rotulo (padrão "Plantão Constitucional"), titulo, ts,
  // letreiro (texto do pé), hora.
  urgente(s, t, c) {
    return `<img data-foto src="${foto(c, s.foto)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${esc(s.fotoPos || 'center top')};z-index:1">
      <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(18,26,39,.55) 0%,rgba(18,26,39,0) 22%,rgba(18,26,39,0) 45%,rgba(18,26,39,.85) 72%,#121A27 100%);z-index:1"></div>
      <div style="position:absolute;left:70px;top:70px;display:flex;align-items:center;gap:16px;background:${COR.vermelho};color:#fff;padding:12px 26px 8px;z-index:4"><span style="width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 0 0 7px rgba(255,255,255,.35)"></span><span style="${TITULO};font-size:58px;line-height:1">${esc(s.selo || 'Urgente')}</span></div>
      ${s.hora ? `<div style="position:absolute;right:70px;top:78px;background:rgba(18,26,39,.75);color:#fff;font-size:34px;font-weight:800;letter-spacing:.06em;padding:10px 20px;z-index:4">${esc(s.hora)}</div>` : ''}
      <div data-area style="position:absolute;left:60px;right:60px;bottom:170px;display:flex;flex-direction:column;z-index:4">
        <div style="align-self:flex-start;background:${COR.azul};color:#fff;font-size:28px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;padding:12px 24px">${esc(s.rotulo || 'Plantão Constitucional')}</div>
        <div style="background:#fff;padding:26px 30px 20px;border-left:16px solid ${COR.vermelho};box-shadow:0 24px 50px rgba(8,16,40,.45)"><h1 data-titulo style="${TITULO};margin:0;font-size:${s.ts || 86}px;line-height:${lista(s.titulo).some(l => l.includes('[[')) ? 1.08 : .95};color:${COR.navy}">${lista(s.titulo).map(l => rico(l, { ...t, caixa: COR.azul })).join('<br>')}</h1></div>
      </div>
      <div style="position:absolute;left:0;right:0;bottom:70px;height:70px;background:${COR.vermelho};display:flex;align-items:center;overflow:hidden;z-index:4">
        <span style="flex:none;height:100%;display:flex;align-items:center;background:${COR.navyFundo};color:#fff;font-size:28px;font-weight:800;padding:0 26px">${PERFIL}</span>
        <span style="white-space:nowrap;font-size:30px;font-weight:700;color:#fff;padding-left:26px">${esc(s.letreiro || '')}</span></div>
      <div style="position:absolute;right:70px;bottom:18px;font-size:24px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#fff;z-index:4">Arraste →</div>`;
  },
  // Número gigante vazado (listas: "5 erros…", "3 dicas…").
  numero(s, t) {
    return `<div style="position:absolute;left:70px;top:40px;${TITULO};font-size:${s.tn || 760}px;line-height:.8;color:transparent;-webkit-text-stroke:8px ${t.escuro ? 'rgba(255,255,255,.55)' : COR.azul};z-index:2">${esc(s.numero)}</div>
      <div data-area style="position:absolute;left:110px;right:110px;top:760px;bottom:190px;display:flex;flex-direction:column;justify-content:flex-end;gap:24px;z-index:3">
        ${kicker(s.kicker, t)}${titulo(s, t, 150, 860)}${s.texto ? corpo(s, t, 40) : ''}
      </div>${pe(t)}`;
  },
  // Comparação: dois blocos na diagonal e o selo VS no meio.
  versus(s, t) {
    const [a, b] = lista(s.lados);
    const px = w => Math.min(s.ts || 260, Math.floor(820 / (Math.max(...String(w).split(/\s+/).map(p => p.length), 1) * 0.44)));
    return `<div style="position:absolute;inset:0;background:${COR.navyFundo};clip-path:polygon(0 58%,100% 42%,100% 100%,0 100%);z-index:1"></div>
      <div style="position:absolute;left:110px;right:110px;top:150px;display:flex;flex-direction:column;gap:18px;z-index:3">
        ${kicker(s.kicker, t)}
        <h1 data-titulo style="${TITULO};margin:0;font-size:${px(a)}px;line-height:${String(a).includes('[[') ? 1.08 : .88};color:#fff">${rico(a, t)}</h1>
      </div>
      <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(-8deg);width:230px;height:230px;border-radius:50%;background:${COR.vermelho};display:flex;align-items:center;justify-content:center;${TITULO};font-size:120px;color:#fff;box-shadow:0 20px 50px rgba(8,16,40,.45);z-index:4">VS</div>
      <div data-area style="position:absolute;left:110px;right:110px;top:800px;bottom:190px;display:flex;flex-direction:column;align-items:flex-end;justify-content:flex-start;gap:18px;text-align:right;z-index:3">
        <h1 style="${TITULO};margin:0;font-size:${px(b)}px;line-height:.88;color:${COR.azulClaro}">${rico(b, t)}</h1>
        ${s.texto ? corpo(s, { ...t, txt: '#E4E8F0' }, 38) : ''}
      </div>${pe(TEMAS.dark, true)}`;
  },
  // Mira: alvo vermelho no centro com a palavra-chave gigante na cruz e as opções em etiquetas em volta.
  // Pouco texto: "pre" (linha de cima), "titulo" (a palavra no centro), "opcoes" (até 4, nos cantos da mira).
  mira(s, t) {
    const R = COR.vermelho, cx = 540, cy = s.miraY || 640;
    const anel = (d, w, op = 1) => `<div style="position:absolute;left:${cx - d / 2}px;top:${cy - d / 2}px;width:${d}px;height:${d}px;border-radius:50%;border:${w}px solid ${R};opacity:${op};box-sizing:border-box"></div>`;
    const pos = [[150, cy - 330, -6], [700, cy - 300, 5], [170, cy + 250, 4], [690, cy + 270, -5]];
    const palavra = lista(s.titulo).join(' ');
    const px = s.ts || Math.min(300, Math.floor(980 / (palavra.length * 0.46)));
    return `<div style="position:absolute;left:0;right:0;top:${cy}px;height:4px;background:${R};opacity:.55;z-index:1"></div>
      <div style="position:absolute;top:0;bottom:0;left:${cx - 2}px;width:4px;background:${R};opacity:.55;z-index:1"></div>
      ${anel(820, 6, .35)}${anel(600, 10, .6)}${anel(380, 14)}
      <div style="position:absolute;left:${cx - 18}px;top:${cy - 18}px;width:36px;height:36px;border-radius:50%;background:${R};z-index:2"></div>
      <div data-area style="position:absolute;left:40px;right:40px;top:140px;bottom:180px;z-index:4">
      ${s.pre ? `<div style="position:absolute;left:0;right:0;top:0;display:flex;justify-content:center"><div style="background:#fff;color:${COR.navy};${TITULO};font-size:${s.tp || 92}px;line-height:1;padding:8px 26px 0">${rico(s.pre, t)}</div></div>` : ''}
      <h1 data-titulo style="position:absolute;left:0;right:0;top:${cy - 140 - px * .46}px;margin:0;text-align:center;${TITULO};font-size:${px}px;line-height:.92;color:#fff;text-shadow:0 10px 40px rgba(8,16,40,.6)">${esc(palavra)}</h1></div>
      ${lista(s.opcoes).map((o, i) => `<div style="position:absolute;left:${pos[i][0]}px;top:${pos[i][1]}px;transform:rotate(${pos[i][2]}deg);background:${COR.navyFundo};color:#fff;border:3px solid ${R};font-size:40px;font-weight:800;padding:12px 30px;z-index:5">${esc(o)}</div>`).join('')}
      ${s.texto ? `<div style="position:absolute;left:110px;right:110px;bottom:180px;text-align:center;font-size:44px;font-weight:800;color:#fff;z-index:5">${rico(s.texto, t)}</div>` : ''}${pe(t, true)}`;
  },
  // Alerta: aviso oficial no fundo navy, com fitas de atenção (listras vermelhas) cruzando o alto e o pé,
  // triângulo de alerta gigante e etiqueta. Campos: pre (etiqueta), titulo, texto, fita (texto da fita), ts.
  alerta(s, t) {
    const R = COR.vermelho;
    const fita = (y, rot) => `<div style="position:absolute;left:-120px;right:-120px;top:${y}px;height:84px;transform:rotate(${rot}deg);background:repeating-linear-gradient(-45deg,${R} 0 34px,#fff 34px 68px);box-shadow:0 14px 30px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;z-index:2">
        <span style="background:${COR.navyFundo};color:#fff;${TITULO};font-size:52px;line-height:1;padding:8px 26px 2px;letter-spacing:.06em">${esc(s.fita || 'Atenção · Aviso oficial')}</span></div>`;
    return `<div style="position:absolute;inset:0;background:radial-gradient(70% 50% at 50% 42%,#1d2c4f 0%,${COR.navyFundo} 70%);z-index:0"></div>
      ${fita(70, -4)}${fita(1170, 3)}
      <svg viewBox="0 0 200 180" style="position:absolute;left:50%;top:230px;width:300px;transform:translateX(-50%);z-index:3;filter:drop-shadow(0 18px 40px rgba(255,45,85,.35))">
        <path d="M100 10 L190 170 L10 170 Z" fill="${R}" stroke="#fff" stroke-width="8" stroke-linejoin="round"/>
        <rect x="91" y="62" width="18" height="62" rx="9" fill="#fff"/><circle cx="100" cy="146" r="11" fill="#fff"/></svg>
      <div data-area style="position:absolute;left:80px;right:80px;top:530px;bottom:230px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px;text-align:center;z-index:4">
        ${s.pre ? `<div style="background:#fff;color:${COR.navyFundo};font-size:30px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;padding:10px 26px;border-radius:999px">${esc(s.pre)}</div>` : ''}
        <h1 data-titulo style="margin:0;${TITULO};font-size:${s.ts || 150}px;line-height:${lista(s.titulo).some(l => l.includes('[[')) ? 1.04 : .92};color:#fff">${lista(s.titulo).map(l => rico(l, { ...t, caixa: R })).join('<br>')}</h1>
        ${s.texto ? `<p data-corpo style="margin:0;font-size:40px;font-weight:600;line-height:1.3;color:#C9D4EA;max-width:860px">${rico(s.texto, TEMAS.dark)}</p>` : ''}
      </div>`;
  },
  // Urna: urna eletrônica desenhada, com o aviso na tela verde (~~riscado~~ e [[destaque]]) e um pino de
  // mapa saindo do canto. Para avisos de eleição. Campos: pre, titulo, ts, tela ([linhas]; a 1ª é o
  // cabeçalho), texto (frase abaixo da urna).
  urna(s, t) {
    const R = COR.vermelho, L = lista(s.tela);
    const tela = l => esc(l).replace(/~~(.+?)~~/g, `<s style="text-decoration-thickness:5px;text-decoration-color:${R};opacity:.6">$1</s>`)
      .replace(/\[\[(.+?)\]\]/g, `<span style="background:${R};color:#fff;padding:0 10px">$1</span>`).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
    const tecla = (n, bg = '#20242C', cor = '#fff', w = 64) => `<div style="width:${w}px;height:52px;border-radius:9px;background:${bg};color:${cor};display:flex;align-items:center;justify-content:center;font-size:${w > 64 ? 14 : 28}px;font-weight:800;box-shadow:inset 0 -5px 0 rgba(0,0,0,.28)">${n}</div>`;
    return `<div style="position:absolute;left:90px;right:90px;top:96px;display:flex;flex-direction:column;align-items:flex-start;gap:20px;z-index:4">
        ${s.pre ? `<div style="background:#fff;color:${COR.azul};font-size:28px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;padding:9px 24px;border-radius:999px">${esc(s.pre)}</div>` : ''}
        <h1 data-titulo style="margin:0;${TITULO};font-size:${s.ts || 124}px;line-height:${lista(s.titulo).some(l => l.includes('[[')) ? 1.04 : .92};color:#fff">${lista(s.titulo).map(l => rico(l, { ...t, caixa: R })).join('<br>')}</h1></div>
      <div data-objeto style="position:absolute;left:70px;top:${s.urnaY || 600}px;width:940px;height:470px;transform:rotate(-3deg);border-radius:34px;background:linear-gradient(160deg,#F3F4F6 0%,#C9CDD4 100%);box-shadow:0 40px 70px rgba(8,16,40,.5),inset 0 -14px 0 rgba(0,0,0,.08);z-index:3">
        <div style="position:absolute;left:34px;top:34px;width:560px;height:402px;border-radius:16px;background:#1A1E25;padding:18px">
          <div style="width:100%;height:100%;border-radius:8px;background:linear-gradient(180deg,#E8F3DF 0%,#D2E6C4 100%);padding:26px 30px;box-sizing:border-box;display:flex;flex-direction:column;gap:20px;color:#15211A;font-family:'Schibsted Grotesk',sans-serif">
            ${L.map((l, i) => i ? `<div style="font-size:${i === L.length - 1 ? 50 : 36}px;font-weight:${i === L.length - 1 ? 800 : 600};line-height:1.15">${tela(l)}</div>` : `<div style="font-size:22px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;border-bottom:3px solid #15211A;padding-bottom:10px">${tela(l)}</div>`).join('')}
          </div></div>
        <div style="position:absolute;left:624px;top:34px;width:282px;height:402px;border-radius:16px;background:#2B3038;padding:22px 20px;box-sizing:border-box;display:flex;flex-direction:column;gap:12px;align-items:center">
          <div style="font-size:15px;font-weight:800;letter-spacing:.2em;color:#9AA3B2">JUSTIÇA ELEITORAL</div>
          <div style="display:grid;grid-template-columns:repeat(3,64px);gap:10px">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => tecla(n)).join('')}<div></div>${tecla(0)}<div></div></div>
          <div style="display:flex;gap:6px;margin-top:4px">${tecla('BRANCO', '#fff', '#20242C', 72)}${tecla('CORRIGE', '#F28C28', '#20242C', 72)}${tecla('CONFIRMA', '#2E9E44', '#fff', 86)}</div>
        </div>
        <svg viewBox="0 0 100 130" style="position:absolute;right:-30px;top:-120px;width:150px;transform:rotate(12deg);filter:drop-shadow(0 16px 26px rgba(0,0,0,.4))"><path d="M50 4C25 4 6 23 6 47c0 32 44 77 44 77s44-45 44-77C94 23 75 4 50 4z" fill="${R}" stroke="#fff" stroke-width="6"/><circle cx="50" cy="46" r="16" fill="#fff"/></svg>
      </div>
      ${s.texto ? `<div style="position:absolute;left:90px;right:90px;top:${(s.urnaY || 600) + 540}px;font-size:38px;font-weight:600;line-height:1.3;color:#fff;z-index:4">${rico(s.texto, t)}</div>` : ''}
      <div style="position:absolute;left:90px;bottom:60px;background:${COR.navyFundo};color:#fff;font-size:28px;font-weight:700;padding:8px 18px;z-index:4">${PERFIL}</div>
      <div style="position:absolute;right:90px;bottom:68px;font-size:26px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#fff;z-index:4">Arraste →</div>`;
  },
  // Convite: aviso "Atenção!" em selo vermelho, título com o público, um ingresso branco (canhoto "Grátis",
  // picote e furos laterais) com o recado e o logo do parceiro, e um comentário do Insta com a palavra-chave.
  // Com "foto" (recorte PNG sem fundo), a pessoa entra à direita e o ingresso fica mais estreito.
  // Campos: alerta, titulo, ts, cartao {titulo, texto}, selo (canhoto), logo (arquivo em fotos/), parceria
  // (texto antes do logo), cta {texto, tag}, foto.
  convite(s, t, c) {
    const R = COR.vermelho, F = !!s.foto, cart = s.cartao || {}, cta = s.cta || {};
    const larg = F ? 640 : 900, tw = F ? 560 : 860;
    const furo = (lado, y) => `<span style="position:absolute;${lado}:-26px;top:${y};width:52px;height:52px;border-radius:50%;background:${COR.azulFundo}"></span>`;
    return `<div style="position:absolute;inset:0;background:radial-gradient(90% 70% at 85% 10%,#2B6BF0 0%,${COR.azul} 40%,${COR.azulFundo} 100%);z-index:0"></div>
      <div style="position:absolute;right:-240px;top:-240px;width:620px;height:620px;border-radius:50%;border:2px dashed rgba(255,255,255,.22);z-index:1"></div>
      ${F ? `<img data-foto src="${foto(c, s.foto)}" style="position:absolute;right:${s.fotoX ?? -150}px;bottom:0;height:${s.fotoH || 1000}px;z-index:2;filter:drop-shadow(0 30px 40px rgba(8,16,40,.45))">` : ''}
      <div style="position:absolute;left:90px;top:90px;width:${tw}px;display:flex;flex-direction:column;align-items:flex-start;gap:26px;z-index:4">
        <div style="display:flex;align-items:center;gap:14px;background:${R};color:#fff;padding:12px 28px 8px;transform:rotate(-3deg);box-shadow:0 14px 26px rgba(8,16,40,.35)"><svg viewBox="0 0 200 180" width="48"><path d="M100 14 L188 168 L12 168 Z" fill="#fff"/><rect x="91" y="62" width="18" height="60" rx="9" fill="${R}"/><circle cx="100" cy="144" r="11" fill="${R}"/></svg><span style="${TITULO};font-size:60px;line-height:1">${esc(s.alerta || 'Atenção!')}</span></div>
        <h1 data-titulo style="margin:0;${TITULO};font-size:${s.ts || 128}px;line-height:1.02;color:#fff">${lista(s.titulo).map(l => rico(l, { ...t, caixa: COR.navyFundo })).join('<br>')}</h1></div>
      <div data-area style="position:absolute;left:70px;top:${s.cartaoY || 560}px;width:${larg}px;display:flex;background:#fff;border-radius:26px;box-shadow:0 34px 60px rgba(8,16,40,.45);transform:rotate(-1.5deg);z-index:3">
        <div style="position:relative;flex:none;width:${F ? 96 : 120}px;border-right:5px dashed #C9CFDB;display:flex;align-items:center;justify-content:center">
          <div style="writing-mode:vertical-rl;transform:rotate(180deg);${TITULO};font-size:${F ? 62 : 76}px;line-height:1;color:${R};letter-spacing:.04em">${esc(s.selo || 'Grátis')}</div>
          ${furo('left', '18%')}</div>
        <div style="position:relative;flex:1;padding:${F ? '30px 32px 26px' : '34px 44px 30px'};display:flex;flex-direction:column;gap:${F ? 16 : 20}px">
          <div style="${TITULO};font-size:${F ? 66 : 84}px;line-height:.95;color:${COR.azul}">${lista(cart.titulo).map(l => rico(l, TEMAS.light)).join('<br>')}</div>
          <p data-corpo style="margin:0;font-size:${F ? 30 : 36}px;font-weight:500;line-height:1.3;color:${COR.navy}">${rico(cart.texto, TEMAS.light)}</p>
          ${s.logo ? `<div style="display:flex;align-items:center;gap:18px;border-top:3px solid #E4E6EA;padding-top:${F ? 16 : 20}px;margin-top:4px"><span style="font-size:${F ? 22 : 26}px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#6B7590">${esc(s.parceria || 'Em parceria com')}</span><img src="${foto(c, s.logo)}" style="height:${F ? 62 : 76}px"></div>` : ''}
          ${furo('right', '18%')}</div></div>
      <div style="position:absolute;left:70px;${F ? 'width:720px' : 'right:70px'};bottom:118px;display:flex;align-items:center;gap:22px;background:#fff;border-radius:999px;padding:16px 34px 16px 16px;box-shadow:0 20px 40px rgba(8,16,40,.4);z-index:4">
        <span style="flex:none;width:76px;height:76px;border-radius:50%;background:${COR.navyFundo};display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" width="40" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 21l2.1-5.5A8.4 8.4 0 1 1 21 11.5z"/></svg></span>
        <span style="flex:1;font-size:${F ? 28 : 32}px;font-weight:600;line-height:1.2;color:${COR.navy}">${rico(cta.texto || 'Comente', TEMAS.light)}</span>
        <span style="flex:none;background:${R};color:#fff;${TITULO};font-size:${F ? 60 : 70}px;line-height:1;padding:12px 26px 6px;border-radius:16px;transform:rotate(-3deg)">${esc(cta.tag || '#AULA')}</span></div>
      <div style="position:absolute;left:90px;bottom:44px;font-size:28px;font-weight:700;color:#fff;z-index:4">${PERFIL}</div>`;
  },
  // Cartaz (tema dark): "@liberofilho × logo do parceiro" no alto, palavra vazada gigante ao fundo, título em
  // caixa alta, faixa azul com o assunto, recado e CTA com a hashtag num bloco vermelho inclinado. Com "foto"
  // (recorte PNG), a pessoa entra à direita. Campos: pre (pílula vermelha), titulo, ts, faixa, texto, vazado,
  // logo (versão branca), cta {texto, tag}, foto, fotoX, fotoH.
  cartaz(s, t, c) {
    const R = COR.vermelho, F = !!s.foto, cta = s.cta || {}, w = F ? 560 : 900;
    return `<div style="position:absolute;right:-60px;top:0;bottom:0;display:flex;align-items:center;writing-mode:vertical-rl;${TITULO};font-size:420px;line-height:.8;color:transparent;-webkit-text-stroke:4px rgba(143,176,255,.22);z-index:1">${esc(s.vazado || 'Grátis')}</div>
      ${F ? `<img data-foto src="${foto(c, s.foto)}" style="position:absolute;right:${s.fotoX ?? -110}px;bottom:0;height:${s.fotoH || 940}px;z-index:2;-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 22%);filter:drop-shadow(0 30px 50px rgba(0,0,0,.55))">` : ''}
      <div style="position:absolute;left:90px;top:80px;display:flex;align-items:center;gap:22px;z-index:4"><span style="font-size:30px;font-weight:800;color:#fff">${PERFIL}</span><span style="font-size:40px;font-weight:300;color:${COR.azulClaro}">×</span>${s.logo ? `<img src="${foto(c, s.logo)}" style="height:64px">` : ''}</div>
      <div data-area style="position:absolute;left:90px;top:210px;width:${w}px;display:flex;flex-direction:column;align-items:flex-start;gap:26px;z-index:4">
        ${s.pre ? `<div style="background:${R};color:#fff;font-size:30px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;padding:10px 24px;border-radius:999px">${esc(s.pre)}</div>` : ''}
        <h1 data-titulo style="margin:0;${TITULO};font-size:${s.ts || 150}px;line-height:.9;color:#fff">${lista(s.titulo).map(l => rico(l, t).replace(/<span style="background:[^;]+;color:#fff;padding:0 14px;[^"]*">(.+?)<\/span>/g, `<span style="color:${COR.azulClaro}">$1</span>`)).join('<br>')}</h1>
        ${s.faixa ? `<div style="background:${COR.azul};color:#fff;${TITULO};font-size:${F ? 64 : 78}px;line-height:1;padding:14px 26px 8px;box-shadow:12px 12px 0 ${R}">${esc(s.faixa)}</div>` : ''}
        ${s.texto ? `<p data-corpo style="margin:12px 0 0;font-size:${F ? 32 : 38}px;font-weight:500;line-height:1.35;color:#C9D4EA">${rico(s.texto, t)}</p>` : ''}
      </div>
      <div style="position:absolute;left:90px;bottom:${s.ctaY || 90}px;display:flex;flex-direction:column;align-items:flex-start;gap:10px;z-index:4">
        <span style="font-size:${F ? 30 : 34}px;font-weight:600;color:#fff;max-width:${F ? 520 : 800}px;line-height:1.25">${rico(cta.texto || 'Comente', t)}</span>
        <span style="background:${R};color:#fff;${TITULO};font-size:${F ? 120 : 140}px;line-height:1;padding:14px 36px 4px;transform:rotate(-4deg);transform-origin:left;box-shadow:0 20px 40px rgba(0,0,0,.4)">${esc(cta.tag || '#AULA')}</span></div>`;
  },
  // Bilhete (tema light): papel quadriculado, um bilhete branco preso com fitas, carimbo redondo, logo do
  // parceiro e, embaixo, um comentário do Insta com a hashtag e a seta "comenta assim".
  // Campos: alerta, titulo, ts, texto, carimbo ([2 linhas]), logo, parceria, cta {texto, tag, usuario}.
  bilhete(s, t, c) {
    const R = COR.vermelho, cta = s.cta || {};
    const fita = (x, rot) => `<span style="position:absolute;top:-28px;${x};width:170px;height:56px;background:rgba(143,176,255,.55);transform:rotate(${rot}deg);box-shadow:0 2px 6px rgba(0,0,0,.08)"></span>`;
    const c1 = lista(s.carimbo || ['Aulas', 'Grátis']);
    return `<div style="position:absolute;inset:0;background-image:linear-gradient(rgba(11,79,216,.08) 2px,transparent 2px),linear-gradient(90deg,rgba(11,79,216,.08) 2px,transparent 2px);background-size:54px 54px;z-index:0"></div>
      <div data-area style="position:absolute;left:80px;right:80px;top:110px;background:#fff;padding:60px 56px 44px;transform:rotate(-1.5deg);box-shadow:0 30px 60px rgba(20,33,58,.18);display:flex;flex-direction:column;gap:26px;z-index:3">
        ${fita('left:60px', -6)}${fita('right:60px', 5)}
        <div style="${TITULO};font-size:56px;line-height:1;color:${R}">${esc(s.alerta || 'Atenção!')}</div>
        <h1 data-titulo style="margin:0;${TITULO};font-size:${s.ts || 120}px;line-height:1.02;color:${COR.azul}">${lista(s.titulo).map(l => rico(l, t)).join('<br>')}</h1>
        <span style="display:block;width:120px;height:10px;background:${R}"></span>
        <p data-corpo style="margin:0;font-size:38px;font-weight:500;line-height:1.35;color:${COR.navy}">${rico(s.texto, TEMAS.light)}</p>
        ${s.logo ? `<div style="display:flex;align-items:center;gap:20px;margin-top:6px"><span style="font-size:24px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#6B7590">${esc(s.parceria || 'Em parceria com')}</span><img src="${foto(c, s.logo)}" style="height:80px"></div>` : ''}
      </div>
      <div style="position:absolute;right:70px;top:${s.carimboY || 150}px;width:250px;height:250px;border-radius:50%;border:8px solid ${R};outline:3px solid ${R};outline-offset:-22px;display:flex;flex-direction:column;align-items:center;justify-content:center;transform:rotate(14deg);color:${R};${TITULO};font-size:64px;line-height:.9;text-align:center;background:rgba(255,255,255,.6);z-index:4">${c1.map(esc).join('<br>')}</div>
      <div style="position:absolute;left:80px;right:80px;bottom:${s.ctaY || 110}px;display:flex;align-items:center;gap:22px;background:#fff;border-radius:24px;padding:22px 30px;box-shadow:0 18px 40px rgba(20,33,58,.16);z-index:4">
        <span style="flex:none;width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,${COR.azul},${R})"></span>
        <div style="flex:1;display:flex;flex-direction:column;gap:2px"><span style="font-size:24px;font-weight:700;color:#6B7590">${esc(cta.usuario || 'você')}</span><span style="${TITULO};font-size:76px;line-height:1;color:${COR.navy}">${esc(cta.tag || '#AULA')}</span></div>
        <svg viewBox="0 0 24 24" width="44" fill="none" stroke="${R}" stroke-width="2"><path d="M12 21s-7.5-4.6-9.5-9.2C1 8 3.4 4.5 7 4.5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.6 0 6 3.5 4.5 7.3C19.5 16.4 12 21 12 21z" fill="${R}"/></svg></div>
      <div style="position:absolute;left:110px;bottom:${(s.ctaY || 110) + 150}px;display:flex;align-items:flex-end;gap:12px;z-index:4"><span style="font-size:32px;font-weight:700;color:${COR.navy}">${rico(cta.texto || 'Comenta assim', TEMAS.light)}</span><svg viewBox="0 0 60 60" width="56" fill="none" stroke="${R}" stroke-width="5" stroke-linecap="round"><path d="M10 8c22 4 30 18 26 40"/><path d="M26 40l10 10 10-12"/></svg></div>
      <div style="position:absolute;left:80px;bottom:44px;font-size:28px;font-weight:700;color:${COR.navy};z-index:4">${PERFIL}</div>`;
  },
  // Frase (motivacional, tela única): fundo de amanhecer (navy no alto, azul embaixo, com um sol de anéis
  // nascendo no pé), aspas vazadas, kicker e a frase. Uma palavra entre {{chaves}} sai "se preenchendo"
  // (contorno à esquerda, cheia à direita) e [[caixa]] sai em vermelho. Campos: kicker, titulo, ts, assinatura.
  frase(s, t) {
    const R = COR.vermelho;
    const linha = l => rico(l, { ...t, caixa: R }).replace(/\{\{(.+?)\}\}/g, `<span style="background:linear-gradient(90deg,transparent 0%,transparent 18%,#fff 82%);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-stroke:3px #fff">$1</span>`);
    const anel = (d, w, op) => `<div style="position:absolute;left:${540 - d / 2}px;top:${1350 - d * .32}px;width:${d}px;height:${d}px;border-radius:50%;border:${w}px solid rgba(255,255,255,${op});box-sizing:border-box"></div>`;
    return `<div style="position:absolute;inset:0;background:linear-gradient(180deg,${COR.navyFundo} 0%,#14306f 38%,${COR.azul} 78%,#2F6BFF 100%);z-index:0"></div>
      <div style="position:absolute;left:140px;right:140px;top:1050px;height:800px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,170,150,.55),rgba(255,45,85,.25) 55%,transparent);z-index:1"></div>
      <div style="position:absolute;inset:0;overflow:hidden;z-index:1">${anel(1500, 2, .12)}${anel(1180, 2, .18)}${anel(860, 3, .26)}
        <div style="position:absolute;left:340px;top:1180px;width:400px;height:400px;border-radius:50%;background:${R};box-shadow:0 0 120px 30px rgba(255,45,85,.45)"></div></div>
      <div style="position:absolute;left:80px;top:40px;${TITULO};font-size:420px;line-height:1;color:transparent;-webkit-text-stroke:5px rgba(143,176,255,.35);z-index:2">“</div>
      <div data-area style="position:absolute;left:100px;right:80px;top:${s.tituloY || 230}px;bottom:360px;display:flex;flex-direction:column;justify-content:center;gap:30px;z-index:4">
        ${s.kicker ? `<div style="display:flex;align-items:center;gap:18px"><span style="width:60px;height:6px;background:${R}"></span><span style="font-size:30px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:${COR.azulClaro}">${esc(s.kicker)}</span></div>` : ''}
        <h1 data-titulo style="margin:0;${TITULO};font-size:${s.ts || 190}px;line-height:${lista(s.titulo).some(l => l.includes('[[')) ? 1.02 : .9};color:#fff">${lista(s.titulo).map(linha).join('<br>')}</h1>
      </div>
      <div style="position:absolute;left:0;right:0;bottom:70px;text-align:center;font-size:30px;font-weight:700;letter-spacing:.06em;color:#fff;z-index:4">${esc(s.assinatura || '— ' + PERFIL)}</div>`;
  },
  // Suave (frases emocionais, tons pastel e quase nenhum elemento). "variante": papel (bilhete rasgado com
  // fita sobre listras azul-claras, letra cursiva), paisagem (foto de viagem com a frase pequena no céu),
  // ceu (azul pastel granulado, frase grande em creme e estrelinhas), repeticao (creme, frase e a última
  // palavra repetida em cinza, uma delas em destaque) e nevoa (degradê lavanda, frase fina + negrito).
  // Campos: titulo (linhas; na nevoa, a última linha sai em negrito), texto (frase de cima na repeticao),
  // palavra (a palavra repetida), foto (paisagem), fotoPos, assinatura.
  suave(s, t, c) {
    const v = s.variante || 'papel', L = lista(s.titulo), ass = esc(s.assinatura || PERFIL);
    const INTER = "font-family:'Inter',sans-serif", CAV = "font-family:'Caveat',cursive";
    if (v === 'papel') {
      const borda = 'polygon(0% 3%,4% 0%,9% 2%,15% 0%,22% 3%,30% 1%,38% 2.5%,47% 0%,55% 2%,63% .5%,71% 3%,79% 1%,87% 2.5%,94% 0%,100% 2%,99% 12%,100% 25%,98.5% 40%,100% 55%,99% 70%,100% 85%,99% 97%,93% 100%,85% 98%,77% 100%,68% 97.5%,59% 100%,50% 98%,41% 100%,32% 97.5%,23% 100%,14% 98%,6% 100%,0% 97%,1% 85%,0% 70%,1.5% 55%,0% 40%,1% 25%,0% 12%)';
      const fita = (pos, rot) => `<span style="position:absolute;${pos};width:150px;height:60px;background:rgba(244,240,226,.82);transform:rotate(${rot}deg);box-shadow:0 2px 6px rgba(0,0,0,.06);z-index:4"></span>`;
      return `<div style="position:absolute;inset:0;background:repeating-linear-gradient(90deg,#AFC6E6 0 26px,#F4F6FA 26px 30px,#AFC6E6 30px 34px,#F4F6FA 34px 37px);z-index:0"></div>
        <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,.12),rgba(80,100,140,.08));z-index:0"></div>
        <div style="position:absolute;left:90px;right:90px;top:${s.papelY || 400}px;filter:drop-shadow(0 10px 18px rgba(40,60,100,.18));z-index:3">
          <div data-area style="clip-path:${borda};background:#F1ECDD;padding:90px 80px 70px;display:flex;flex-direction:column;gap:30px;text-align:center">
            <h1 data-titulo style="margin:0;${CAV};font-weight:500;font-size:${s.ts || 96}px;line-height:1.08;color:#34466B">${L.map(esc).join('<br>')}</h1>
            <div style="align-self:flex-end;${CAV};font-size:52px;color:#34466B">${ass}</div></div></div>
        ${fita(`left:60px;top:${(s.papelY || 400) - 18}px`, -38)}${fita(`right:60px;top:${(s.papelY || 400) + 470}px`, -38)}`;
    }
    if (v === 'paisagem') {
      return `<img data-foto src="${foto(c, s.foto)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${esc(s.fotoPos || 'center')};z-index:0">
        <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(245,247,250,.78) 0%,rgba(245,247,250,.35) 34%,rgba(245,247,250,0) 55%);z-index:1"></div>
        <div data-area style="position:absolute;left:200px;right:200px;top:${s.textoY || 230}px;text-align:center;z-index:3">
          <h1 data-titulo style="margin:0;${INTER};font-weight:400;font-size:${s.ts || 46}px;line-height:1.3;color:#26303D">${L.map(esc).join('<br>')}</h1></div>
        <div style="position:absolute;left:0;right:0;bottom:56px;text-align:center;${INTER};font-size:24px;color:rgba(255,255,255,.9);z-index:3">${ass}</div>`;
    }
    if (v === 'ceu') {
      const estrela = (x, y, w, rot, cor) => `<svg viewBox="0 0 100 100" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;transform:rotate(${rot}deg);z-index:2"><path d="M50 4 C54 34 66 46 96 50 C66 54 54 66 50 96 C46 66 34 54 4 50 C34 46 46 34 50 4Z" fill="${cor}"/></svg>`;
      return `<div style="position:absolute;inset:0;background:linear-gradient(180deg,#8FB2E3 0%,#A9C5EC 55%,#CFE0F4 100%);z-index:0"></div>
        <div style="position:absolute;left:640px;top:170px;width:300px;height:110px;border-radius:60px;background:rgba(255,255,255,.85);filter:blur(1px);z-index:1"></div>
        <div style="position:absolute;left:700px;top:120px;width:150px;height:150px;border-radius:50%;background:rgba(255,255,255,.85);z-index:1"></div>
        <div style="position:absolute;left:800px;top:150px;width:110px;height:110px;border-radius:50%;background:rgba(255,255,255,.85);z-index:1"></div>
        ${estrela(110, 1060, 110, 8, '#FCE7A8')}${estrela(860, 1120, 70, -10, '#FCE7A8')}${estrela(900, 330, 54, 12, '#FFF6D6')}
        <div style="position:absolute;left:90px;top:110px;${INTER};font-weight:800;font-size:28px;color:#FFF4CC;z-index:3">${ass}</div>
        <div data-area style="position:absolute;left:90px;right:60px;top:${s.textoY || 380}px;bottom:240px;z-index:3">
          <h1 data-titulo style="margin:0;${INTER};font-weight:800;letter-spacing:-.045em;font-size:${s.ts || 150}px;line-height:.92;color:#FFF4CC">${L.map(esc).join('<br>')}</h1></div>`;
    }
    if (v === 'repeticao') {
      const p = esc(s.palavra || 'muda'), n = s.repete || 40, dest = s.destaque ?? 22;
      return `<div style="position:absolute;inset:0;background:#F3EBDC;z-index:0"></div>
        <div data-area style="position:absolute;left:80px;right:80px;top:140px;bottom:150px;display:flex;flex-direction:column;gap:6px;z-index:3">
          <p style="margin:0 0 4px;${INTER};font-weight:800;letter-spacing:-.02em;font-size:${s.ts || 54}px;line-height:1.2;color:#2E3A55;text-align:justify">${rico(s.texto, TEMAS.light)}</p>
          <div style="${INTER};font-weight:400;letter-spacing:-.02em;font-size:${s.ts || 54}px;line-height:1.2;color:#A3A6AE;text-align:justify;text-align-last:justify">${Array.from({ length: n }, (_, i) => i === dest ? `<b style="font-weight:800;color:${COR.azul}">${p}.</b>` : p).join(' ')}</div></div>
        <div style="position:absolute;left:0;right:0;bottom:70px;text-align:center;${INTER};font-weight:800;font-size:24px;color:#2E3A55;z-index:3">${ass}</div>`;
    }
    // nevoa
    return `<div style="position:absolute;inset:0;background:radial-gradient(90% 60% at 30% 25%,#EEF1F8 0%,#D9E0EF 45%,#BAC6E2 100%);z-index:0"></div>
      <div style="position:absolute;right:-200px;bottom:-260px;width:900px;height:900px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,255,255,.7),transparent);z-index:1"></div>
      <div style="position:absolute;left:0;right:0;top:120px;text-align:center;${INTER};font-size:26px;color:#4A5A7C;z-index:3">${ass}</div>
      <div data-area style="position:absolute;left:80px;right:80px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;z-index:3">
        <h1 data-titulo style="margin:0;${INTER};letter-spacing:-.045em;font-size:${s.ts || 140}px;line-height:.98;color:#24324F">${L.map((l, i) => `<span style="font-weight:${i === L.length - 1 ? 800 : 300}">${esc(l)}</span>`).join('<br>')}</h1></div>`;
  },
  // Bolão: cartela 3×3 de coisas que o aluno fez, cada quadrado com a pontuação num selo, e a pergunta final.
  // Campos: pre (etiqueta), titulo, itens ([{texto, pontos}], 9), texto (pergunta do pé), ts.
  bolao(s, t) {
    const R = COR.vermelho, it = lista(s.itens);
    const cel = (o, i) => `<div style="position:relative;background:${i % 2 ? '#fff' : COR.off};border-radius:22px;padding:24px 20px 20px;display:flex;align-items:center;justify-content:center;text-align:center;box-shadow:0 12px 26px rgba(8,16,40,.28)">
        <span style="position:absolute;top:-16px;right:-10px;background:${R};color:#fff;${TITULO};font-size:34px;line-height:1;padding:8px 14px 4px;border-radius:12px;transform:rotate(6deg);box-shadow:0 6px 14px rgba(0,0,0,.25)">+${esc(o.pontos)}</span>
        <span style="font-size:${s.tc || 29}px;font-weight:700;line-height:1.2;color:${COR.navy}">${rico(o.texto, TEMAS.light)}</span></div>`;
    return `<div style="position:absolute;left:70px;right:70px;top:80px;display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center;z-index:4">
        ${s.pre ? `<div style="background:#fff;color:${COR.azul};font-size:26px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;padding:9px 24px;border-radius:999px">${esc(s.pre)}</div>` : ''}
        <h1 data-titulo style="margin:0;${TITULO};font-size:${s.ts || 130}px;line-height:.98;color:#fff">${lista(s.titulo).map(l => rico(l, { ...t, caixa: COR.navyFundo })).join('<br>')}</h1></div>
      <div data-area style="position:absolute;left:60px;right:60px;top:${s.gradeY || 370}px;height:${s.gradeH || 760}px;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);gap:26px 22px;z-index:4">${it.map(cel).join('')}</div>
      ${s.texto ? `<div style="position:absolute;left:60px;right:60px;bottom:70px;display:flex;justify-content:center;z-index:5"><div style="background:${COR.navyFundo};color:#fff;${TITULO};font-size:64px;line-height:1;padding:18px 36px 10px;border-radius:18px;transform:rotate(-1.5deg)">${rico(s.texto, { ...t, caixa: R })}</div></div>` : ''}`;
  },
  // Semana: dois calendários de 7 dias (antes x agora) com os dias de trabalho e as folgas, e um carimbo.
  // Campos: kicker, titulo, linhas ([{rotulo, folgas: [índices 0–6], riscar}]), carimbo (texto do carimbo vermelho), texto.
  semana(s, t) {
    const D = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'], R = COR.vermelho;
    const linha = (l, k) => `<div style="position:relative;display:flex;align-items:center;gap:18px">
        <div style="width:140px;flex:none;${TITULO};font-size:52px;line-height:1;color:#fff;${l.riscar ? 'opacity:.5' : ''}">${esc(l.rotulo)}</div>
        <div style="display:flex;gap:10px;${l.riscar ? 'opacity:.5' : ''}">${D.map((d, i) => { const f = lista(l.folgas).includes(i);
          return `<div style="width:88px;height:116px;border-radius:14px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;${f ? `background:#fff;color:${COR.azul}` : `background:rgba(255,255,255,.08);border:2px solid rgba(255,255,255,.35);color:#fff`}"><span style="${TITULO};font-size:52px;line-height:1">${d}</span><span style="font-size:15px;font-weight:800;letter-spacing:.05em">${f ? 'FOLGA' : 'TRAB.'}</span></div>`; }).join('')}</div>
        ${l.riscar ? `<div style="position:absolute;left:-20px;right:-20px;top:50%;height:12px;margin-top:-6px;background:${R};transform:rotate(-4deg);border-radius:6px"></div>` : ''}
      </div>`;
    return `<div data-area style="position:absolute;left:90px;right:90px;top:140px;bottom:190px;display:flex;flex-direction:column;justify-content:center;gap:40px;z-index:3">
        ${kicker(s.kicker, t)}${titulo(s, t, 190, 900)}
        <div style="display:flex;flex-direction:column;gap:26px;margin-top:10px">${lista(s.linhas).map(linha).join('')}</div>
        ${s.texto ? corpo(s, t, 40) : ''}
      </div>
      ${s.carimbo ? `<div data-objeto style="position:absolute;right:80px;top:150px;transform:rotate(10deg);border:9px solid ${R};outline:3px solid ${R};outline-offset:7px;padding:8px 22px 2px;color:${R};background:rgba(255,255,255,.04);text-align:center;z-index:4"><div style="${TITULO};font-size:84px;line-height:.9">${lista(s.carimbo).map(esc).join('<br>')}</div></div>` : ''}${pe(t, true)}`;
  },
  // Agenda do dia: "HOJE" gigante e uma linha por aula, com o horário num bloco e a etiqueta (onde/para quem).
  agenda(s, t) {
    const R = COR.vermelho;
    const item = a => `<div style="display:flex;align-items:stretch;gap:0;background:rgba(255,255,255,.07);border:3px solid rgba(255,255,255,.28)">
        <div style="flex:none;width:250px;background:#fff;color:${COR.azul};display:flex;align-items:center;justify-content:center;${TITULO};font-size:96px;line-height:1">${esc(a.hora)}</div>
        <div style="flex:1;padding:22px 28px;display:flex;flex-direction:column;gap:10px;justify-content:center">
          <div data-corpo style="${TITULO};font-size:${s.ti || 58}px;line-height:.98;color:#fff;text-transform:uppercase">${rico(a.titulo, t)}</div>
          ${a.etiqueta ? `<span style="align-self:flex-start;background:${a.cor === 'navy' ? COR.navyFundo : R};color:#fff;font-size:24px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:6px 14px">${esc(a.etiqueta)}</span>` : ''}
        </div></div>`;
    return `<div data-area style="position:absolute;left:90px;right:90px;top:120px;bottom:190px;display:flex;flex-direction:column;justify-content:center;gap:34px;z-index:3">
        ${kicker(s.kicker, t)}${titulo(s, t, s.ts || 300, 900)}
        <div style="display:flex;flex-direction:column;gap:26px">${lista(s.aulas).map(item).join('')}</div>
        ${s.texto ? corpo(s, t, 38) : ''}
      </div>${pe(t, true)}`;
  },
  // Pergunta: interrogação gigante saindo pela direita e, se houver, as opções de resposta.
  pergunta(s, t) {
    return `<div style="position:absolute;right:-120px;top:60px;${TITULO};font-size:1250px;line-height:.8;color:${t.escuro ? 'rgba(255,255,255,.1)' : 'rgba(11,79,216,.1)'};z-index:1">?</div>
      <div data-area style="position:absolute;left:110px;right:200px;top:150px;bottom:190px;display:flex;flex-direction:column;justify-content:center;gap:34px;z-index:3">
        ${kicker(s.kicker, t)}${titulo(s, t, 150, 770)}${s.texto ? corpo(s, t, 40) : ''}
        ${lista(s.opcoes).length ? `<div style="display:flex;flex-wrap:wrap;gap:18px;margin-top:10px">${lista(s.opcoes).map((o, i) => `<span style="border-radius:40px 40px 40px 0;padding:22px 48px;font-size:46px;font-weight:800;${i ? `border:4px solid ${t.acento};color:${t.tit}` : `background:${t.caixa};color:#fff`}">${esc(o)}</span>`).join('')}</div>` : ''}
      </div>${pe(t)}`;
  },
  // Manchete de jornal: cabeçalho "O Libero", fios duplos, manchete e linha fina.
  manchete(s, t) {
    const fio = `<div style="height:10px;border-top:3px solid ${COR.navy};border-bottom:3px solid ${COR.navy}"></div>`;
    return `<div style="position:absolute;left:90px;right:90px;top:110px;display:flex;flex-direction:column;gap:14px;z-index:3">
        <div style="display:flex;justify-content:space-between;font-size:24px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${COR.navy}"><span>${esc(s.edicao || 'Edição extra')}</span><span>${esc(s.secao || 'Constitucional')}</span></div>
        ${fio}
        <div style="${TITULO};text-align:center;font-size:150px;line-height:.9;color:${COR.navy}">O Libero</div>
        ${fio}
      </div>
      <div data-area style="position:absolute;left:90px;right:90px;top:470px;bottom:190px;display:flex;flex-direction:column;justify-content:flex-start;gap:30px;z-index:3">
        ${kicker(s.kicker, t)}${titulo(s, t, 150, 900)}
        ${s.texto ? `<div style="border-top:3px solid ${COR.navy};padding-top:24px">${corpo(s, t, 40)}</div>` : ''}
      </div>${pe(t)}`;
  },
};

// Print de tela no CTA (ex.: botão "Assinar" do perfil), com anel vermelho opcional em volta de um ponto.
const printCta = (src, d) => `<div data-print style="position:relative;align-self:stretch;margin-top:10px;border-radius:26px;overflow:visible;box-shadow:0 26px 50px rgba(10,20,40,.35)">
  <img src="${src}" style="display:block;width:100%;border-radius:26px">
  ${d ? `<div style="position:absolute;left:${d[0]}%;top:${d[1]}%;width:${d[2]}%;height:${d[3]}%;border:8px solid ${COR.vermelho};border-radius:999px;transform:scale(1.18)"></div>` : ''}</div>`;

const TIPOS = {
  capa(s, t, c) {
    if (s.estilo && CAPAS[s.estilo]) return CAPAS[s.estilo](s, t, c);
    const tag = `<div style="position:absolute;left:110px;bottom:72px;background:${t === TEMAS.blue ? COR.navyFundo : COR.azul};color:#fff;font-size:30px;font-weight:700;padding:8px 18px;z-index:4">${PERFIL}</div>
      ${s.semArraste ? '' : `<div style="position:absolute;right:110px;bottom:80px;font-size:26px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${s.foto ? '#fff' : t.txt};z-index:4">Arraste →</div>`}`;
    // Fundo em tela cheia: foto do autor ("foto") ou foto de banco ("imagem", salvo imagemModo "cartao").
    // A foto de banco ganha um véu azul da paleta para "ornar" com o perfil.
    const telaCheia = s.foto ? foto(c, s.foto) : s.imagem && s.imagemModo !== 'cartao' ? `../imagens/${esc(s.imagem)}` : null;
    if (telaCheia) {
      return `<img data-foto src="${telaCheia}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${esc(s.imagemPos || 'center top')}">
        ${s.foto ? '' : `<div style="position:absolute;inset:0;background:${COR.azul};opacity:.22;mix-blend-mode:multiply"></div><div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,57,168,.45) 0%,rgba(18,26,39,0) 28%)"></div>`}
        <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(18,26,39,0) 30%,rgba(18,26,39,.82) 62%,#121A27 92%)"></div>
        <div data-area data-rosto style="position:absolute;left:110px;right:110px;bottom:190px;display:flex;flex-direction:column;gap:22px;z-index:3">
          ${kicker(s.kicker, TEMAS.dark)}
          ${s.pre ? `<div style="font-size:52px;font-weight:600;line-height:1.1;color:#fff">${rico(s.pre, TEMAS.dark)}</div>` : ''}
          ${titulo(s, { ...TEMAS.dark, caixa: COR.azul }, 180, 860)}
          ${s.texto ? corpo(s, TEMAS.dark, 40) : ''}
        </div>${tag}`;
    }
    // Capa com "imagem" (foto de banco de imagens, em imagens/): cartão com moldura branca no alto e o
    // título embaixo. Fotos de até ~1024px não aguentam a tela cheia, mas ficam nítidas no cartão.
    let cartao = '';
    if (s.imagem && s.imagemModo === 'cartao') {
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
        <span data-corpo style="font-size:${s.corpo || 40}px;font-weight:500;line-height:1.3;color:${t.txt}${s.riscado ? `;text-decoration:line-through;text-decoration-color:${COR.vermelho};text-decoration-thickness:5px;opacity:.75` : ''}">${rico(it, t)}</span></div>`).join('');
    return area(`${kicker(s.kicker, t)}${titulo(s, t, 120, 860)}<div style="display:flex;flex-direction:column;gap:22px">${itens}</div>`);
  },
  // Teses cobradas num exame: ficha do exame, o caso em uma frase e as teses com o dispositivo.
  teses(s, t) {
    const [bg, fg] = t === TEMAS.light ? [COR.navy, '#fff'] : [COR.off, COR.navy];
    const itens = lista(s.itens).map(it => {
      const [tese, art] = typeof it === 'string' ? [it, ''] : [it.tese, it.artigo];
      return `<div style="display:flex;gap:24px;align-items:flex-start">
        <span style="flex:none;width:34px;height:34px;margin-top:8px;background:${t.acento};${t === TEMAS.light ? '' : `box-shadow:inset 0 0 0 4px ${t.acento}`}"></span>
        <div style="display:flex;flex-direction:column;gap:4px"><span data-corpo style="font-size:${s.corpo || 40}px;font-weight:700;line-height:1.2;color:${t.txt}">${rico(tese, t)}</span>
        ${art ? `<span data-corpo style="font-size:${Math.round((s.corpo || 40) * .78)}px;font-weight:600;letter-spacing:.02em;color:${t.kicker}">${rico(art, t)}</span>` : ''}</div></div>`;
    }).join('');
    return area(`<div style="display:flex;align-items:center;gap:22px;flex-wrap:wrap">
        ${s.exame ? `<span style="background:${bg};color:${fg};font-size:34px;font-weight:800;letter-spacing:.06em;padding:10px 20px">${esc(s.exame)}</span>` : ''}${kicker(s.kicker, t)}</div>
      ${titulo(s, t, 110, 860)}
      ${s.caso ? `<p data-corpo style="margin:0;font-size:${s.corpoCaso || 36}px;font-weight:500;line-height:1.3;color:${t.txt};opacity:.9">${rico(s.caso, t)}</p>` : ''}
      <div style="display:flex;flex-direction:column;gap:26px;border-top:3px solid ${t.linha};padding-top:30px">${itens}</div>`);
  },
  // Treino de peças: o enunciado numa folha (borda azul), com o rótulo do caso e o convite a responder.
  enunciado(s, t) {
    return area(`${kicker(s.kicker, t)}${titulo(s, t, 110, 860)}
      <div style="background:#fff;border-left:14px solid ${COR.azul};padding:44px 48px;box-shadow:0 24px 50px rgba(8,16,40,.28);display:flex;flex-direction:column;gap:18px">
        ${lista(s.texto).map(p => `<p data-corpo style="margin:0;font-size:${s.corpo || 32}px;font-weight:500;line-height:1.38;color:${COR.navy};text-wrap:pretty">${rico(p, TEMAS.light)}</p>`).join('')}
      </div>
      ${s.rodape ? `<div style="font-size:30px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:${t.tit}">${rico(s.rodape, t)}</div>` : ''}`, 90, 90);
  },
  // Retratos: fotos redondas de pessoas (2 a 4) com nome e nota, entre o título e o texto. Campos: titulo,
  // pessoas [{foto, nome, nota, fotoPos}], texto, corpo, fonte (linha pequena no pé, ex.: crédito da composição).
  retratos(s, t, c) {
    const ps = lista(s.pessoas), d = s.diam || (ps.length > 3 ? 190 : ps.length > 2 ? 230 : 260);
    const anel = t === TEMAS.light ? COR.azul : t === TEMAS.blue ? '#fff' : COR.vermelho;
    const fotos = ps.map(p => `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:16px;text-align:center">
        <div data-retrato style="width:${d}px;height:${d}px;border-radius:50%;border:9px solid ${anel};overflow:hidden;box-shadow:0 22px 44px rgba(8,16,40,.35)"><img src="${foto(c, p.foto)}" style="width:100%;height:100%;object-fit:cover;transform:scale(1.08);object-position:${esc(p.fotoPos || 'center 30%')}"></div>
        <div style="${TITULO};font-size:44px;line-height:.95;color:${t.tit}">${esc(p.nome)}</div>
        ${p.nota ? `<div style="font-size:22px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${t.kicker}">${esc(p.nota)}</div>` : ''}</div>`).join('');
    return area(`${kicker(s.kicker, t)}${titulo(s, t, 120, 860)}
      <div style="display:flex;justify-content:center;gap:24px;margin:10px 0">${fotos}</div>
      ${barra(t)}${corpo(s, t, s.corpo || 38)}
      ${s.fonte ? `<div style="font-size:20px;font-weight:600;color:${t.txt};opacity:.6">${esc(s.fonte)}</div>` : ''}`, 90, 90);
  },
  // Pergunta de múltipla escolha: tema no título, a pergunta e as alternativas A–D (o gabarito fica no slide "gabarito").
  questao(s, t) {
    const [bgL, fgL] = t.escuro ? ['#fff', COR.azul] : [COR.azul, '#fff'];
    const ops = lista(s.opcoes).map((o, i) => `<div style="display:flex;align-items:center;gap:26px;padding:22px 28px;border:3px solid ${t.escuro ? 'rgba(255,255,255,.35)' : '#C9CFDB'};background:${t.escuro ? 'rgba(255,255,255,.06)' : '#fff'};border-radius:22px">
        <span style="flex:none;width:64px;height:64px;border-radius:50%;background:${bgL};color:${fgL};display:flex;align-items:center;justify-content:center;${TITULO};font-size:42px">${'ABCDE'[i]}</span>
        <span data-corpo style="font-size:${s.corpo || 34}px;font-weight:600;line-height:1.25;color:${t.txt}">${rico(o, t)}</span></div>`).join('');
    return area(`${kicker(s.kicker, t)}${titulo(s, t, 120, 860)}${s.pergunta ? `<p data-corpo style="margin:0;font-size:${s.corpoPergunta || 40}px;font-weight:700;line-height:1.25;color:${t.tit}">${rico(s.pergunta, t)}</p>` : ''}
      <div style="display:flex;flex-direction:column;gap:18px">${ops}</div>`, 90, 90);
  },
  // Gabarito do treino: uma linha por pergunta, com a letra certa, o porquê e o artigo.
  gabarito(s, t) {
    const linhas = lista(s.itens).map(it => `<div style="display:flex;gap:26px;align-items:flex-start;padding-bottom:20px;border-bottom:2px solid ${t.linha}">
        <span style="flex:none;width:72px;height:72px;border-radius:50%;background:${t.escuro ? '#fff' : COR.azul};color:${t.escuro ? COR.azul : '#fff'};display:flex;align-items:center;justify-content:center;${TITULO};font-size:46px">${esc(it.letra)}</span>
        <div style="display:flex;flex-direction:column;gap:6px"><span style="font-size:24px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:${t.kicker}">${esc(it.tema)}</span>
          <span data-corpo style="font-size:${s.corpo || 30}px;font-weight:500;line-height:1.28;color:${t.txt}">${rico(it.texto, t)}${it.artigo ? ` <b style="font-weight:800;white-space:nowrap">(${esc(it.artigo)})</b>` : ''}</span></div></div>`).join('');
    return area(`${kicker(s.kicker, t)}${titulo(s, t, 120, 860)}<div style="display:flex;flex-direction:column;gap:20px">${linhas}</div>`, 90, 90);
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
  // "print" (ex.: print do perfil com o botão Assinar) numa moldura; "destaque" = [x, y, largura, altura] em %
  // da imagem para o anel vermelho que aponta o botão.
  cta(s, t, c) {
    const [bg, fg] = t === TEMAS.blue ? [COR.off, COR.azul] : [COR.azul, '#fff'];
    const polaroid = s.foto ? `<div data-foto style="position:absolute;right:70px;top:380px;background:#fff;padding:28px 28px 70px;transform:rotate(-3deg);box-shadow:0 30px 60px rgba(10,20,40,.35);z-index:2"><img src="${foto(c, s.foto)}" style="display:block;width:300px;height:375px;object-fit:${s.fotoFit || 'cover'};object-position:center ${s.fotoFit === 'contain' ? 'center' : 'top'}${s.fotoFit === 'contain' ? `;background:linear-gradient(170deg,${COR.azul},${COR.azulFundo})` : ''}"></div>` : '';
    // "centro": true centraliza título, texto e botão (CTA sem foto).
    const meio = s.centro && !s.foto;
    return `${polaroid}${area(`${kicker(s.kicker, t)}${titulo(s, t, s.foto ? 96 : 130, s.foto ? 480 : 860)}${barra(t)}${corpo(s, t, s.corpo || 40)}
      ${s.botao ? `<span style="align-self:${meio ? 'center' : 'flex-start'};background:${bg};color:${fg};border-radius:40px 40px 40px 0;padding:22px 40px;font-size:36px;font-weight:800;white-space:nowrap">${esc(s.botao)}</span>` : ''}
      ${s.print ? printCta(foto(c, s.print), s.destaque) : ''}`, 110, s.foto ? 490 : 110, meio ? ';align-items:center;text-align:center' : '')}`;
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
<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@900&family=Schibsted+Grotesk:wght@500;600;700;800&family=Caveat:wght@500;600&family=Inter:wght@300;400;800&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box}body{margin:0;font-family:'Schibsted Grotesk',sans-serif;-webkit-font-smoothing:antialiased}</style></head><body>
<div id="painel" style="position:relative;width:${n * 1080}px;height:1350px">
${slides.map((s, i) => {
    const telaCheia = (s.tipo === 'capa' && (s.foto || (s.imagem && s.imagemModo !== 'cartao'))) || s.fundoImagem;
    const t = TEMAS[telaCheia ? 'dark' : s.tema] || TEMAS.blue;
    // "fundoImagem" (slides internos): imagem em tela cheia atrás do texto, com véu azul e escurecida.
    const fundoImg = s.fundoImagem && s.tipo !== 'capa' ? `<img src="../imagens/${esc(s.fundoImagem)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${esc(s.imagemPos || 'center')}"><div style="position:absolute;inset:0;background:${COR.azul};opacity:.25;mix-blend-mode:multiply"></div><div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(18,26,39,.55) 0%,rgba(18,26,39,.72) 55%,rgba(18,26,39,.9) 100%)"></div>` : '';
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
  ${fundoImg}${fundoTexto(s, t)}${aneis(s)}${html}${obj}${s.tipo === 'capa' ? '' : rodape(t)}${textura(t)}</div>`;
  }).join('\n')}
${pontes.map(p => { const w = p.tam || 360; return objetoHtml({ ...p, tam: w }, p.entre * 1080 - w / 2, p.y ?? 470); }).join('')}
</div></body></html>`;
  return { html, total: n, avisos };
}

// Peças do visual reaproveitadas pelo molde de tela única (post-libero).
export { COR, TEMAS, TITULO, PERFIL, esc, rico, lista, textura };

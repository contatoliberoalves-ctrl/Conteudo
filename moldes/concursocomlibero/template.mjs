// Molde "concursocomlibero" (@concursocomlibero): mesma lógica do Carrossel Libero (tipos de slide,
// fundos alternados, perfil no rodapé), com estética jurídica: páginas brancas com textos e elementos
// verdes alternadas com páginas em verde profundo, títulos em Playfair Display, texto em Poppins,
// artigos/prazos/números em JetBrains Mono, etiquetas e cards que lembram folhas de processo.
// Capa: só título e subtítulo, tipográfica ou com foto (de fundo ou ao lado do título).
// Serve para carrosséis e para posts de tela única.
// renderCarrossel(c) devolve { html, total, avisos }; o render.mjs fotografa cada slide.

const COR = {
  verde: '#1F8F7F', inst: '#0D3D38', prof: '#06201D', claro: '#BFE6DD', fundo: '#EAFAF5',
  roxo: '#2E1A7A', amarelo: '#F5C53D', vermelho: '#C0392B', acerto: '#1F8A5B',
  preto: '#101319', cinza: '#3B414D', branco: '#FFFFFF',
};
// Temas: dois verdes escuros (destaque em amarelo) e o branco (títulos e elementos em verde).
const ESCURO = {
  escuro: true, tit: '#fff', txt: '#E3F2EE', sub: COR.claro, destaque: COR.amarelo, negrito: '#fff',
  linha: 'rgba(191,230,221,.2)', divisor: 'rgba(191,230,221,.2)', fund: COR.claro,
  tabBg: 'rgba(6,32,29,.45)', tabBorda: 'rgba(191,230,221,.3)', tabCab: [COR.claro, COR.inst], valor: COR.amarelo,
  acento: COR.amarelo, botao: [COR.amarelo, COR.prof], alertaTxt: '#fff',
};
const TEMAS = {
  profundo: { ...ESCURO, bg: `radial-gradient(120% 85% at 85% 0%,#0B302B 0%,${COR.prof} 62%)`, marca: 'rgba(191,230,221,.05)' },
  escuro: { ...ESCURO, bg: `radial-gradient(120% 85% at 10% 0%,#125049 0%,${COR.inst} 65%)`, marca: 'rgba(191,230,221,.07)' },
  branco: {
    escuro: false, bg: 'linear-gradient(180deg,#FFFFFF 0%,#F6FBF9 100%)', tit: COR.inst, txt: COR.cinza, sub: COR.verde,
    destaque: COR.verde, negrito: COR.inst, linha: 'rgba(13,61,56,.14)', divisor: 'rgba(13,61,56,.12)', fund: COR.verde,
    tabBg: COR.fundo, tabBorda: 'rgba(31,143,127,.25)', tabCab: [COR.inst, '#fff'], valor: COR.verde,
    acento: COR.verde, botao: [COR.inst, '#fff'], alertaTxt: COR.preto, marca: 'rgba(31,143,127,.06)',
  },
};
const PERFIL = '@concursocomlibero';
const PLAYFAIR = "font-family:'Playfair Display',serif;font-weight:800";
const MONO = "font-family:'JetBrains Mono',monospace";
const SOMBRA = 'box-shadow:0 30px 60px -28px rgba(0,0,0,.55),0 2px 6px rgba(0,0,0,.18)';
const SOMBRA_LEVE = 'box-shadow:0 24px 48px -30px rgba(13,61,56,.35)';
const RUIDO = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .35 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
const pad2 = n => String(n).padStart(2, '0');
// **negrito**, ==destaque== (amarelo no escuro, verde no branco, marca-texto amarelo nos cards)
// e `mono` (artigo, prazo, número). t = tema ou 'card'.
function rico(s, t) {
  const card = t === 'card';
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, `<b style="font-weight:700;color:${card ? COR.inst : t.negrito}">$1</b>`)
    .replace(/==(.+?)==/g, card
      ? `<span style="background:linear-gradient(transparent 58%,${COR.amarelo} 58%,${COR.amarelo} 92%,transparent 92%);box-decoration-break:clone;-webkit-box-decoration-break:clone">$1</span>`
      : `<span style="color:${t.destaque}">$1</span>`)
    .replace(/`(.+?)`/g, `<span style="${MONO};font-weight:500;font-size:.86em;letter-spacing:-.01em">$1</span>`);
}

// ---------- peças comuns ----------
const titulo = (s, t, px = 96, extra = '') => lista(s.titulo).length
  ? `<h1 data-titulo style="${PLAYFAIR};margin:0;font-size:${s.ts || px}px;line-height:1.06;letter-spacing:-.01em;color:${t.tit};text-wrap:balance${extra}">${lista(s.titulo).map(l => rico(l, t)).join('<br>')}</h1>` : '';
// Etiqueta: pequena, roxa, em mono (o roxo fica só nesses detalhes). Não vai na capa.
const etiqueta = txt => txt ? `<span style="align-self:flex-start;display:inline-flex;align-items:center;gap:12px;background:${COR.roxo};color:#fff;${MONO};font-size:24px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:10px 18px 10px 16px;border-radius:8px"><span style="width:8px;height:8px;border-radius:50%;background:${COR.amarelo};flex:none"></span>${esc(txt)}</span>` : '';
const fio = (t, w = 120) => `<span style="display:block;width:${w}px;height:4px;border-radius:2px;background:${t.acento};flex:none"></span>`;
const corpo = (s, t, px = 38) => lista(s.texto).map(p => `<p data-corpo style="margin:0;font-size:${s.corpo || px}px;font-weight:400;line-height:1.42;color:${t.txt};text-wrap:pretty">${rico(p, t)}</p>`).join('');
const fundamento = (txt, t) => txt ? `<div style="display:flex;align-items:center;gap:14px;${MONO};font-size:24px;font-weight:500;letter-spacing:.04em;color:${t.fund}"><span style="width:10px;height:10px;border:2px solid currentColor;transform:rotate(45deg);flex:none"></span>${esc(txt)}</div>` : '';

// Moldura fina de documento (sem cabeçalho).
const moldura = t => `<div style="position:absolute;inset:44px;border:1.5px solid ${t.linha};border-radius:6px;pointer-events:none;z-index:2"></div>`;
// Rodapé: só o perfil.
const rodape = (t, sobreFoto = false) => `<div style="position:absolute;left:96px;bottom:84px;z-index:4;font-size:26px;font-weight:600;letter-spacing:.02em;color:${sobreFoto || t.escuro ? '#fff' : COR.inst}">${PERFIL}</div>`;
const textura = t => `<div style="position:absolute;inset:0;pointer-events:none;background-image:${RUIDO};opacity:${t.escuro ? .45 : .22};mix-blend-mode:${t.escuro ? 'overlay' : 'multiply'};z-index:6"></div>`;
// Marca d'água: § grande e fraco (ou outra letra/número via "marca").
const marcaDagua = (s, t) => s.marca === false ? '' : `<div style="position:absolute;right:-60px;bottom:-190px;${PLAYFAIR};font-size:1000px;line-height:1;color:${t.marca};pointer-events:none;z-index:1">${esc(s.marca || '§')}</div>`;

const area = (html, extra = '') => `<div data-area style="position:absolute;left:112px;right:112px;top:150px;bottom:180px;display:flex;flex-direction:column;justify-content:center;gap:34px;z-index:3${extra}">${html}</div>`;
// Card claro (texto escuro). Em página branca ganha borda para não sumir.
const card = (t, html, { fundo = COR.fundo, pauta = false, pad = '48px 52px', extra = '' } = {}) =>
  `<div style="position:relative;background:${fundo};${pauta ? `background-image:repeating-linear-gradient(180deg,transparent 0 55px,rgba(31,143,127,.13) 55px 56px);` : ''}border-radius:26px;padding:${pad};${t.escuro ? SOMBRA : `border:1.5px solid rgba(31,143,127,.22);${SOMBRA_LEVE}`};color:${COR.preto}${extra}">${html}</div>`;
const pCard = (txt, px = 34, cor = COR.cinza) => `<p data-corpo style="margin:0;font-size:${px}px;line-height:1.45;color:${cor};text-wrap:pretty">${rico(txt, 'card')}</p>`;

const SOMBRA_FORTE = 'box-shadow:0 50px 90px -30px rgba(0,0,0,.6),0 4px 12px rgba(0,0,0,.2)';
// Janela de navegador com o print dentro (bolinhas na barra).
function janela(t, src, { alturaMax = 640, sombra, barra = 46, pos = 'center top' } = {}) {
  const b = `<div style="height:${barra}px;display:flex;align-items:center;gap:${barra * .22}px;padding:0 ${barra * .48}px;background:${t.escuro ? '#DCEBE6' : '#EEF4F2'};border-bottom:1.5px solid rgba(13,61,56,.1)">${['#E4776C', '#E9C15B', '#6FBF8A'].map(k => `<span style="width:${barra * .3}px;height:${barra * .3}px;border-radius:50%;background:${k}"></span>`).join('')}</div>`;
  const img = src ? `<img data-foto src="${src}" style="display:block;width:100%;max-height:${alturaMax}px;object-fit:cover;object-position:${esc(pos)}">` : `<div style="height:300px;display:flex;align-items:center;justify-content:center;color:${COR.verde};${MONO};font-size:24px">print</div>`;
  return `<div style="border-radius:${barra * .45}px;overflow:hidden;background:#fff;${sombra || (t.escuro ? SOMBRA : `border:1.5px solid rgba(13,61,56,.14);${SOMBRA_LEVE}`)}">${b}${img}</div>`;
}

// Foto (fotos/ deste molde ou das pastas de fotos dos outros moldes), resolvida pelo render.
const foto = (c, nome) => (c._fotos || {})[nome] || null;

// ---------- tipos de slide ----------
const TIPOS = {
  // Capa: só título e subtítulo ("sub"). Com "foto": fotoModo "fundo" (tela cheia, texto embaixo)
  // ou "lado" (foto na metade direita, texto à esquerda).
  capa(s, t, c) {
    const f = s.foto && foto(c, s.foto);
    const sub = s.sub || s.texto;
    const subHtml = (tema, px = 38) => sub ? `<p data-corpo style="margin:0;font-size:${px}px;font-weight:400;line-height:1.4;color:${tema.sub};text-wrap:pretty">${rico(sub, tema)}</p>` : '';
    if (f && s.fotoModo === 'fundo') {
      const d = TEMAS.profundo;
      return `<img data-foto src="${f}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${esc(s.fotoPos || 'center top')};z-index:1">
        <div style="position:absolute;inset:0;z-index:2;background:linear-gradient(180deg,rgba(6,32,29,0) 25%,rgba(6,32,29,.78) 55%,${COR.prof} 82%)"></div>
        <div data-area style="position:absolute;left:112px;right:112px;top:640px;bottom:170px;display:flex;flex-direction:column;justify-content:flex-end;gap:28px;z-index:3">
          ${titulo(s, d, s.ts || 112, ';line-height:1.02')}${subHtml(d, 36)}</div>`;
    }
    if (f) {
      return `<div data-foto style="position:absolute;right:0;top:0;bottom:0;width:540px;z-index:2"><img src="${f}" style="width:100%;height:100%;object-fit:cover;object-position:${esc(s.fotoPos || 'center top')}"></div>
        <div data-area style="position:absolute;left:96px;width:410px;top:150px;bottom:180px;display:flex;flex-direction:column;justify-content:center;gap:30px;z-index:3">
          ${titulo(s, t, s.ts || 92, ';line-height:1.04')}${subHtml(t, 34)}</div>`;
    }
    // Capa "produto": título em cima e a tela (s.imagem) numa janela de navegador inclinada, saindo pela direita.
    if (s.capaModo === 'produto') {
      const img = s.imagem && foto(c, s.imagem);
      return `<div data-area style="position:absolute;left:112px;right:112px;top:150px;height:500px;display:flex;flex-direction:column;justify-content:center;gap:26px;z-index:3">
          ${titulo(s, t, s.ts || 118, ';line-height:1.02')}${subHtml(t, 36)}</div>
        <div data-objeto style="position:absolute;left:150px;top:690px;width:1040px;transform:rotate(-4deg);transform-origin:left top;z-index:2">${janela(t, img, { alturaMax: 520, sombra: SOMBRA_FORTE })}</div>`;
    }
    // Capa "leque": título em cima e três telas (s.imagens) em leque embaixo.
    if (s.capaModo === 'leque') {
      const ims = lista(s.imagens).slice(0, 3).map(n => foto(c, n));
      const pos = [[-70, 760, -9, 1], [510, 760, 9, 1], [200, 700, 0, 2]];
      const ordem = [0, 2, 1];
      return `<div data-area style="position:absolute;left:112px;right:112px;top:120px;height:540px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;gap:22px;z-index:3">
          ${titulo(s, t, s.ts || 120, ';line-height:.98')}${subHtml(t, 36)}</div>
        ${ordem.map(i => { const [x, y, r, z] = pos[i]; return `<div data-objeto style="position:absolute;left:${x}px;top:${y}px;width:680px;transform:rotate(${r}deg);z-index:${z + 1}">${janela(t, ims[i], { alturaMax: 420, sombra: SOMBRA_FORTE, barra: 38 })}</div>`; }).join('')}`;
    }
    return area(`${titulo(s, t, s.ts || 124, ';line-height:1.02')}${subHtml(t)}`);
  },
  // Benefícios: cards em duas colunas (nome em Playfair, uma linha de explicação).
  beneficios(s, t) {
    const itens = lista(s.itens).map((it, i) => `<div style="background:${t.escuro ? 'rgba(234,250,245,.06)' : '#fff'};border:1.5px solid ${t.escuro ? 'rgba(191,230,221,.22)' : 'rgba(31,143,127,.2)'};border-radius:20px;padding:26px 28px;display:flex;flex-direction:column;gap:10px;${t.escuro ? '' : SOMBRA_LEVE}">
        <div style="display:flex;align-items:center;gap:14px"><span style="${MONO};font-size:20px;font-weight:700;color:${t.escuro ? COR.prof : '#fff'};background:${t.escuro ? COR.amarelo : COR.verde};border-radius:8px;padding:4px 9px">${pad2(i + 1)}</span><span style="${PLAYFAIR};font-size:${s.tamNome || 36}px;line-height:1.05;color:${t.tit}">${esc(it.nome)}</span></div>
        <span data-corpo style="font-size:${s.corpo || 25}px;line-height:1.38;color:${t.txt}">${rico(it.texto, t)}</span></div>`).join('');
    return area(`${etiqueta(s.etiqueta)}${titulo(s, t, 76)}<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px">${itens}</div>`, ';gap:30px;top:140px;bottom:170px');
  },
  // Explicação: título, fio, parágrafos e, opcionalmente, um card de destaque.
  texto(s, t) {
    return area(`${etiqueta(s.etiqueta)}${titulo(s, t, 88)}${fio(t)}${corpo(s, t)}
      ${s.destaque ? card(t, pCard(s.destaque, 34, COR.preto), { pad: '36px 44px' }) : ''}`);
  },
  // Frase de impacto: título grande com barra lateral, e uma linha de apoio.
  impacto(s, t) {
    return area(`${etiqueta(s.etiqueta)}
      <div style="border-left:6px solid ${t.acento};padding:6px 0 6px 44px">${titulo(s, t, 116)}</div>
      ${s.sub ? `<div data-corpo style="font-size:40px;font-weight:500;line-height:1.35;color:${t.sub}">${rico(s.sub, t)}</div>` : ''}`);
  },
  // Lei seca: folha pautada com cabeçalho do dispositivo e, abaixo, a tradução.
  lei(s, t) {
    const cab = `<div style="display:flex;justify-content:space-between;align-items:center;gap:20px;padding-bottom:18px;margin-bottom:26px;border-bottom:2px dashed rgba(31,143,127,.45);${MONO};font-size:24px;font-weight:700;letter-spacing:.06em;color:${COR.verde}"><span>${esc(s.dispositivo || '')}</span><span style="color:${COR.roxo}">LEI SECA</span></div>`;
    return area(`${etiqueta(s.etiqueta)}${titulo(s, t, 80)}
      ${card(t, `${cab}<p data-corpo style="margin:0;font-family:'Playfair Display',serif;font-style:italic;font-weight:500;font-size:${s.corpo || 36}px;line-height:1.56;color:${COR.preto}">“${rico(s.citacao, 'card')}”</p>`, { fundo: t.escuro ? '#FFFFFF' : COR.fundo, pauta: true, pad: '40px 52px 44px' })}
      ${lista(s.traducao).map(p => `<p data-corpo style="margin:0;font-size:36px;line-height:1.42;color:${t.txt}">${rico(p, t)}</p>`).join('')}`);
  },
  // Lista numerada em mono, com linhas finas entre os itens.
  lista(s, t) {
    const itens = lista(s.itens).map((it, i) => `<div style="display:flex;gap:30px;align-items:flex-start;padding:24px 0;${i ? `border-top:1.5px solid ${t.divisor}` : ''}">
        <span style="flex:none;width:64px;height:64px;border-radius:14px;background:${COR.verde};color:#fff;display:flex;align-items:center;justify-content:center;${MONO};font-size:28px;font-weight:700">${esc(s.marcadores?.[i] ?? pad2(i + 1))}</span>
        <span data-corpo style="font-size:${s.corpo || 36}px;line-height:1.4;color:${t.txt};padding-top:6px">${rico(it, t)}</span></div>`).join('');
    return area(`${etiqueta(s.etiqueta)}${titulo(s, t, 84)}${fio(t)}<div style="display:flex;flex-direction:column">${itens}</div>`);
  },
  // Tabela de consulta: valor em mono à esquerda, texto à direita.
  tabela(s, t) {
    const col = s.colValor || 210;
    const linhas = lista(s.linhas).map((l, i) => `<div style="display:grid;grid-template-columns:${col}px 1fr;align-items:center;gap:32px;padding:24px 36px;${i ? `border-top:1.5px solid ${t.divisor}` : ''}">
        <span style="${MONO};font-size:${s.tamValor || 52}px;font-weight:700;color:${t.valor};letter-spacing:-.02em">${esc(l.valor)}</span>
        <span data-corpo style="font-size:${s.corpo || 32}px;line-height:1.38;color:${t.txt}">${rico(l.texto, t)}</span></div>`).join('');
    return area(`${etiqueta(s.etiqueta)}${titulo(s, t, 84)}
      <div style="border:1.5px solid ${t.tabBorda};border-radius:24px;background:${t.tabBg};overflow:hidden">
        ${s.cabecalho ? `<div style="display:grid;grid-template-columns:${col}px 1fr;gap:32px;padding:18px 36px;background:${t.tabCab[0]};color:${t.tabCab[1]};${MONO};font-size:22px;font-weight:700;letter-spacing:.1em;text-transform:uppercase">${lista(s.cabecalho).map(h => `<span>${esc(h)}</span>`).join('')}</div>` : ''}
        ${linhas}
      </div>
      ${fundamento(s.fundamento, t)}`);
  },
  // Número em destaque (prazo, idade, quórum) com explicação.
  numero(s, t) {
    return area(`${etiqueta(s.etiqueta)}
      <div style="display:flex;align-items:baseline;gap:22px;flex-wrap:wrap"><span data-titulo style="${MONO};font-size:${s.tn || 230}px;font-weight:700;line-height:.9;letter-spacing:-.05em;color:${t.valor}">${esc(s.numero)}</span>${s.unidade ? `<span style="${MONO};font-size:60px;font-weight:700;color:${t.tit}">${esc(s.unidade)}</span>` : ''}</div>
      ${titulo(s, t, 76)}${fio(t)}${corpo(s, t, 36)}${fundamento(s.fundamento, t)}`);
  },
  // Pegadinha: o que a banca escreve (vermelho, errado) x o certo (verde).
  pegadinha(s, t) {
    const bloco = (tipo, txt) => {
      const [cor, rot, sinal] = tipo === 'errado' ? [COR.vermelho, s.rotuloErrado || 'Pegadinha', '✕'] : [COR.acerto, s.rotuloCerto || 'Certo', '✓'];
      return card(t, `<div style="display:flex;align-items:center;gap:16px;margin-bottom:18px"><span style="width:48px;height:48px;border-radius:50%;background:${cor};color:#fff;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700">${sinal}</span><span style="${MONO};font-size:24px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${cor}">${esc(rot)}</span></div>${pCard(txt, s.corpo || 33, COR.preto)}`,
        { fundo: tipo === 'errado' ? '#FFFFFF' : COR.fundo, pad: '34px 44px 38px', extra: `;border-left:10px solid ${cor}` });
    };
    return area(`${etiqueta(s.etiqueta)}${titulo(s, t, 80)}${bloco('errado', s.errado)}${bloco('certo', s.certo)}${fundamento(s.fundamento, t)}`, ';gap:30px');
  },
  // Print (tela de plataforma, site, material): numa janela de navegador com sombra, abaixo do título.
  print(s, t, c) {
    const f = s.imagem && foto(c, s.imagem);
    const jan = `<div style="flex:none">${janela(t, f, { alturaMax: s.alturaMax || 640, pos: s.imagemPos || 'center top' })}</div>`;
    // layout "topo": o print primeiro e o texto embaixo.
    if (s.layout === 'topo') return area(`${jan}<div style="display:flex;flex-direction:column;gap:22px;margin-top:10px">${etiqueta(s.etiqueta)}${titulo(s, t, 76)}${corpo(s, t, 32)}</div>`, ';gap:26px');
    return area(`${etiqueta(s.etiqueta)}${titulo(s, t, 80)}${corpo(s, t, 34)}${jan}`, ';gap:30px');
  },
  // Oferta: preço antigo riscado e o novo em destaque.
  oferta(s, t) {
    const riscado = t.escuro ? 'rgba(227,242,238,.6)' : 'rgba(59,65,77,.6)';
    return area(`${etiqueta(s.etiqueta)}${titulo(s, t, 84)}${corpo(s, t, 36)}
      <div style="display:flex;flex-direction:column;gap:6px;margin-top:10px">
        <span style="font-size:36px;color:${riscado}">de <span style="${MONO};font-weight:500;text-decoration:line-through;text-decoration-thickness:3px">${esc(s.de)}</span></span>
        <span style="display:flex;align-items:baseline;gap:22px;flex-wrap:wrap"><span style="font-size:44px;font-weight:500;color:${t.tit}">por</span><span data-titulo style="${MONO};font-size:${s.tn || 190}px;font-weight:700;line-height:1;letter-spacing:-.05em;color:${t.valor}">${esc(s.por).replace(/^R\$\s*/, '<span style="font-size:.42em;letter-spacing:0;margin-right:.12em">R$</span>')}</span></span>
        ${s.condicao ? `<span style="font-size:32px;color:${t.sub}">${rico(s.condicao, t)}</span>` : ''}
      </div>`);
  },
  cta(s, t, c) {
    const f = s.foto && foto(c, s.foto);
    const polaroide = f ? `<div data-foto style="position:absolute;right:96px;top:300px;background:#fff;padding:22px 22px 60px;transform:rotate(3deg);${SOMBRA};z-index:2"><img src="${f}" style="display:block;width:300px;height:380px;object-fit:cover;object-position:center top"></div>` : '';
    return `${polaroide}${area(`${etiqueta(s.etiqueta)}${titulo(s, t, f ? 84 : 100)}${fio(t)}${corpo(s, t, 38)}
      ${s.botao ? `<span style="align-self:flex-start;background:${t.botao[0]};color:${t.botao[1]};border-radius:999px;padding:22px 44px;font-size:34px;font-weight:700;${t.escuro ? SOMBRA : SOMBRA_LEVE}">${esc(s.botao)}</span>` : ''}`, f ? ';right:470px' : '')}`;
  },

  // ---------- posts de tela única ----------
  // Certo ou errado: afirmação num card, veredito colorido e o fundamento.
  questao(s, t) {
    const ok = s.gabarito === 'certo';
    const cor = ok ? COR.acerto : COR.vermelho;
    return area(`${etiqueta(s.etiqueta || 'Certo ou errado?')}${titulo(s, t, 72)}
      ${card(t, `<div style="${MONO};font-size:22px;font-weight:700;letter-spacing:.12em;color:${COR.verde};margin-bottom:18px">${esc(s.banca || 'AFIRMAÇÃO')}</div>${pCard(s.afirmacao, s.corpo || 36, COR.preto)}`, { fundo: '#FFFFFF', pad: '38px 48px 42px' })}
      <div style="display:flex;gap:28px;align-items:flex-start">
        <span style="flex:none;display:flex;align-items:center;gap:14px;background:${cor};color:#fff;border-radius:14px;padding:16px 26px;${MONO};font-size:34px;font-weight:700;letter-spacing:.08em">${ok ? '✓ CERTO' : '✕ ERRADO'}</span>
        <p data-corpo style="margin:0;font-size:${s.corpoResposta || 32}px;line-height:1.42;color:${t.txt};padding-top:4px">${rico(s.explicacao, t)}</p>
      </div>
      ${fundamento(s.fundamento, t)}`, ';gap:36px');
  },
  // Prazo/número de bolso: número gigante em mono, o que é e o alerta (vermelho) da prova.
  prazo(s, t) {
    return area(`${etiqueta(s.etiqueta || 'Prazo que cai')}
      ${titulo(s, t, 80)}
      <div style="display:flex;align-items:baseline;gap:22px"><span data-titulo style="${MONO};font-size:${s.tn || 260}px;font-weight:700;line-height:.86;letter-spacing:-.05em;color:${t.valor}">${esc(s.numero)}</span><span style="${MONO};font-size:64px;font-weight:700;color:${t.tit}">${esc(s.unidade || '')}</span></div>
      ${card(t, pCard(s.texto, s.corpo || 34, COR.preto), { pad: '34px 44px' })}
      ${s.alerta ? `<div style="display:flex;gap:18px;align-items:flex-start;border:2px solid ${COR.vermelho};background:rgba(192,57,43,${t.escuro ? .14 : .06});border-radius:18px;padding:22px 28px"><span style="flex:none;${MONO};font-size:22px;font-weight:700;letter-spacing:.1em;color:#fff;background:${COR.vermelho};border-radius:8px;padding:6px 12px">ATENÇÃO</span><span data-corpo style="font-size:30px;line-height:1.4;color:${t.alertaTxt}">${rico(s.alerta, t)}</span></div>` : ''}
      ${fundamento(s.fundamento, t)}`, ';gap:34px');
  },
};

export function renderCarrossel(c) {
  const slides = lista(c.slides);
  const n = slides.length, avisos = [];
  slides.forEach((s, i) => {
    if (!TIPOS[s.tipo]) avisos.push(`slide ${i + 1}: tipo "${s.tipo}" não existe`);
    if (!TEMAS[s.tema]) avisos.push(`slide ${i + 1}: tema "${s.tema}" não existe (use branco, profundo ou escuro)`);
    if (i >= 2 && s.tema === slides[i - 1].tema && s.tema === slides[i - 2].tema) avisos.push(`slides ${i - 1} a ${i + 1}: três fundos "${s.tema}" seguidos`);
    if (s.tipo === 'capa' && (s.etiqueta || s.pre)) avisos.push(`slide ${i + 1}: capa só leva título e subtítulo ("etiqueta" e "pre" são ignorados)`);
    // Direção de arte: sem travessões nos textos.
    if (/[—–]/.test(JSON.stringify(s))) avisos.push(`slide ${i + 1}: tem travessão (— ou –); troque por vírgula, dois-pontos ou ponto`);
  });
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;0,800;1,500&family=Poppins:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box}body{margin:0;font-family:Poppins,sans-serif;-webkit-font-smoothing:antialiased}</style></head><body>
<div id="painel" style="position:relative;width:${n * 1080}px;height:1350px">
${slides.map((s, i) => {
    const t = TEMAS[s.tema] || TEMAS.profundo;
    const tipo = TIPOS[s.tipo] || TIPOS.texto;
    const comFoto = s.tipo === 'capa' && s.foto && foto(c, s.foto);
    const fundo = comFoto && s.fotoModo === 'fundo';
    return `<div id="slide-${i + 1}" data-tipo="${esc(s.tipo)}" style="position:absolute;left:${i * 1080}px;top:0;width:1080px;height:1350px;overflow:hidden;background:${fundo ? COR.prof : t.bg};color:${t.tit}">
  ${comFoto ? '' : marcaDagua(s, t) + moldura(t)}${tipo(s, t, c)}${rodape(t, fundo)}${textura(fundo ? TEMAS.profundo : t)}</div>`;
  }).join('\n')}
</div></body></html>`;
  return { html, total: n, avisos };
}

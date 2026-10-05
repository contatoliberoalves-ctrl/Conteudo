// Base comum dos moldes de série do @constitucionalgabaritado (Plantão Constitucional, Macete e Passo a passo):
// cores e fontes do perfil (base escura, verde, verde-claro, gelo; Bebas Neue + Poppins), fundo de colmeia,
// textura, rodapé e os slides internos que os três compartilham. Gerados por libero-comum/render-base.mjs
// (cada slide é um <section>; elementos com data-fit encolhem a fonte até caber).

export const W = 1080, H = 1350;
export const COR = { base: '#1c1f1e', verde: '#3b4c49', cartao: '#2f3d3a', claro: '#9be0a3', medio: '#3f9a4d', gelo: '#f6f7f6', texto: '#1f2a28', cinza: '#5e6b66' };
export const TITULO = "font-family:'Bebas Neue',sans-serif;font-weight:400;letter-spacing:.01em";
export const TEXTO = "font-family:'Poppins','Noto Color Emoji',sans-serif";
export const PERFIL = '@constitucionalgabaritado';
export const FONTES = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,500&display=swap';
// Imagem SVG embutida com aspas simples e tudo codificado (aspas duplas quebrariam o atributo style).
const svgUrl = svg => `url('data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29')}')`;
const RUIDO = svgUrl("<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .35 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>");
// Colmeia de linhas finas (como no fundo verde dos posts do perfil).
const COLMEIA = cor => svgUrl(`<svg xmlns='http://www.w3.org/2000/svg' width='180' height='312'><path d='M90 0l90 52v104l-90 52-90-52V52zM90 208v104' fill='none' stroke='${cor}' stroke-width='2'/></svg>`);

// Fundos: "verde" (escuro com colmeia), "base" (quase preto), "gelo" (claro).
export const TEMAS = {
  verde: { bg: `${COLMEIA('rgba(155,224,163,.09)')} 0 0/180px 312px, radial-gradient(110% 80% at 80% 0%,#4a5e5a 0%,${COR.verde} 45%,#26302e 100%)`, tit: '#fff', txt: '#E3EBE7', destaque: COR.claro, kicker: COR.claro, cartao: 'rgba(28,31,30,.45)', borda: 'rgba(155,224,163,.22)', linha: 'rgba(255,255,255,.18)', escuro: true },
  base: { bg: `${COLMEIA('rgba(155,224,163,.06)')} 0 0/180px 312px, ${COR.base}`, tit: '#fff', txt: '#DDE5E1', destaque: COR.claro, kicker: COR.claro, cartao: COR.cartao, borda: 'rgba(155,224,163,.2)', linha: 'rgba(255,255,255,.16)', escuro: true },
  gelo: { bg: `${COLMEIA('rgba(59,76,73,.07)')} 0 0/180px 312px, ${COR.gelo}`, tit: COR.texto, txt: COR.texto, destaque: COR.medio, kicker: COR.medio, cartao: '#fff', borda: '#D9E3DE', linha: '#D9E3DE', escuro: false },
};

export const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
// **negrito**, {{destaque}} (verde do tema) e [[caixa]] (fundo escuro com texto claro, como o título do perfil).
export const rico = (s, t) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b style="font-weight:700">$1</b>')
  .replace(/\{\{(.+?)\}\}/g, `<span style="color:${t.destaque}">$1</span>`)
  .replace(/\[\[(.+?)\]\]/g, `<span style="background:${COR.base};color:${COR.gelo};padding:0 .12em;box-decoration-break:clone;-webkit-box-decoration-break:clone">$1</span>`);
export const linhas = (v, t) => lista(v).map(l => rico(l, t)).join('<br>');

export const textura = t => `<div style="position:absolute;inset:0;pointer-events:none;background-image:${RUIDO};opacity:${t.escuro ? .4 : .25};mix-blend-mode:${t.escuro ? 'overlay' : 'multiply'};z-index:40"></div>`;
export const kicker = (txt, t) => txt ? `<div style="${TEXTO};font-size:26px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:${t.kicker}">${esc(txt)}</div>` : '';
export const tit = (s, t, px, alt, extra = '') => lista(s.titulo).length ? `<div data-fit="${esc(lista(s.titulo).join(' '))}" data-min="56" style="${TITULO};font-size:${s.ts || px}px;line-height:.92;padding-top:.14em;color:${t.tit};max-height:${alt}px;overflow:hidden${extra}">${linhas(s.titulo, t)}</div>` : '';
export const par = (v, t) => lista(v).map(p => `<p style="margin:0 0 .6em;${TEXTO};font-weight:400;line-height:1.38;color:${t.txt}">${rico(p, t)}</p>`).join('');
export const artigo = (a, t) => a ? `<span style="align-self:flex-start;${TEXTO};font-size:24px;font-weight:700;letter-spacing:.04em;color:${t.escuro ? COR.base : '#fff'};background:${t.escuro ? COR.claro : COR.verde};border-radius:999px;padding:8px 20px">${esc(a)}</span>` : '';
export const barra = t => `<span style="display:block;width:90px;height:8px;background:${t.destaque}"></span>`;
// Rodapé: @ centralizado, como nos posts do perfil.
export const rodape = (t, alto = 56) => `<div style="position:absolute;left:0;right:0;bottom:${alto}px;text-align:center;${TEXTO};font-size:24px;font-weight:500;letter-spacing:.06em;color:${t.escuro ? 'rgba(255,255,255,.75)' : COR.cinza};z-index:30">@CONSTITUCIONAL<b style="font-weight:700">GABARITADO</b></div>`;
// Área de conteúdo padrão (margens de 100 px).
export const area = (html, extra = '', topo = 130, base = 150) => `<div style="position:absolute;left:100px;right:100px;top:${topo}px;bottom:${base}px;display:flex;flex-direction:column;justify-content:center;gap:28px;z-index:5${extra}">${html}</div>`;

// Slides internos comuns.
export const COMUNS = {
  // Texto com título, barra, parágrafos e o artigo numa pílula.
  texto(s, t) {
    return area(`${kicker(s.kicker, t)}${tit(s, t, 120, 360)}${barra(t)}<div data-fit="texto" data-min="28" style="font-size:${s.corpo || 40}px;max-height:620px;overflow:hidden">${par(s.texto, t)}</div>${artigo(s.artigo, t)}`) + rodape(t);
  },
  // Número ou palavra gigante ("2 anos", "90 dias") com a explicação.
  destaque(s, t) {
    return area(`${kicker(s.kicker, t)}<div data-fit="${esc(s.grande)}" data-min="90" style="${TITULO};font-size:${s.tg || 300}px;line-height:.82;color:${t.destaque};max-height:330px;overflow:hidden;white-space:nowrap">${esc(s.grande)}</div>${tit(s, t, 96, 220)}<div data-fit="texto" data-min="28" style="font-size:${s.corpo || 38}px;max-height:420px;overflow:hidden">${par(s.texto, t)}</div>${artigo(s.artigo, t)}`) + rodape(t);
  },
  // Lei literal num quadro com barra verde e a tradução embaixo.
  lei(s, t) {
    const q = t.escuro ? 'rgba(28,31,30,.55)' : '#fff';
    return area(`${kicker(s.kicker, t)}${tit(s, t, 104, 240)}
      <div data-fit="citação" data-min="26" style="background:${q};border-left:10px solid ${t.destaque};padding:34px 38px;${TEXTO};font-size:${s.corpo || 34}px;font-weight:500;line-height:1.42;color:${t.txt};max-height:560px;overflow:hidden">“${rico(s.citacao, t)}”<div style="margin-top:16px;font-size:.66em;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${t.kicker}">${esc(s.fonte || '')}</div></div>
      ${s.traducao ? `<div data-fit="tradução" data-min="26" style="font-size:34px;max-height:240px;overflow:hidden">${par(s.traducao, t)}</div>` : ''}`) + rodape(t);
  },
  // Lista com marcadores verdes (✓) ou numerados.
  lista(s, t) {
    const itens = lista(s.itens).map((it, i) => `<div style="display:flex;gap:22px;align-items:flex-start;background:${t.cartao};border:1px solid ${t.borda};border-radius:18px;padding:20px 24px">
      <span style="flex:none;min-width:46px;height:46px;border-radius:12px;background:${t.escuro ? COR.claro : COR.verde};color:${t.escuro ? COR.base : '#fff'};display:flex;align-items:center;justify-content:center;${TITULO};font-size:32px">${s.numerada ? i + 1 : '✓'}</span>
      <span style="${TEXTO};font-weight:500;line-height:1.3;color:${t.tit}">${rico(it, t)}</span></div>`).join('');
    return area(`${kicker(s.kicker, t)}${tit(s, t, 110, 240)}<div data-fit="lista" data-min="24" style="display:flex;flex-direction:column;gap:14px;font-size:${s.corpo || 34}px;max-height:860px;overflow:hidden">${itens}</div>`) + rodape(t);
  },
  // Pegadinha: selo "PEGADINHA" e o texto num cartão.
  pegadinha(s, t) {
    return area(`<span style="align-self:flex-start;transform:rotate(-3deg);background:${COR.claro};color:${COR.base};${TITULO};font-size:64px;line-height:1;padding:10px 26px 4px">${esc(s.selo || 'Pegadinha')}</span>${tit(s, t, 100, 240)}
      <div data-fit="pegadinha" data-min="28" style="background:${t.cartao};border:2px dashed ${t.destaque};border-radius:24px;padding:36px 40px;font-size:${s.corpo || 38}px;max-height:620px;overflow:hidden">${par(s.texto, t)}</div>${artigo(s.artigo, t)}`) + rodape(t);
  },
  // CTA: título, texto e botão.
  cta(s, t) {
    return area(`${kicker(s.kicker, t)}${tit(s, t, 130, 380)}${barra(t)}<div style="font-size:40px">${par(s.texto, t)}</div>
      ${s.botao ? `<span style="align-self:flex-start;background:${t.escuro ? COR.claro : COR.verde};color:${t.escuro ? COR.base : '#fff'};${TEXTO};font-size:36px;font-weight:700;border-radius:44px 44px 44px 0;padding:22px 40px">${esc(s.botao)}</span>` : ''}`) + rodape(t);
  },
};

// Monta a página: cada slide é um <section> 1080×1350 com o fundo do tema.
export function pagina(slides, tipos, ctx, c) {
  const avisos = [];
  const secoes = lista(slides).map((s, i) => {
    const t = TEMAS[s.tema] || TEMAS.verde;
    if (!TEMAS[s.tema]) avisos.push(`slide ${i + 1}: tema "${s.tema}" não existe (${Object.keys(TEMAS).join(', ')})`);
    const f = tipos[s.tipo] || COMUNS[s.tipo];
    if (!f) avisos.push(`slide ${i + 1}: tipo "${s.tipo}" não existe`);
    return `<section id="slide-${i + 1}" style="background:${t.bg}">${(f || COMUNS.texto)(s, t, ctx, c, i)}${textura(t)}</section>`;
  });
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet">
<style>*{box-sizing:border-box}body{margin:0;${TEXTO};-webkit-font-smoothing:antialiased}section{position:relative;width:${W}px;height:${H}px;overflow:hidden}p{margin:0}</style></head><body>
${secoes.join('\n')}</body></html>`;
  return { html, total: secoes.length, avisos, largura: W, altura: H };
}

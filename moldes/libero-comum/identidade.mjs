// Identidade visual do @liberofilho, a mesma do Carrossel Libero (moldes/carrossel-libero/template.mjs):
// azul, off-white e navy, textura granulada, Big Shoulders Display 900 nos títulos e Schibsted Grotesk
// no texto, anéis vermelhos e rodapé só com o perfil (sem contador de páginas).
// Usada pelos moldes Libero Dossiê, Libero Duelo e Libero Requisitos.

export const W = 1080, H = 1350;  // post; os moldes de aula passam 1920×1080 para pagina()
export const COR = {
  azul: '#0B4FD8', azulFundo: '#0839A8', off: '#EFF0F2', navy: '#14213A', navyFundo: '#121A27',
  azulClaro: '#8FB0FF', vermelho: '#FF2D55', papel: '#F7F7F4',
};
export const TEMAS = {
  blue: { bg: `linear-gradient(170deg,${COR.azul} 0%,${COR.azulFundo} 100%)`, tit: '#fff', txt: '#fff', acento: '#fff', kicker: COR.off, caixa: COR.navyFundo, linha: 'rgba(255,255,255,.28)', escuro: true },
  light: { bg: COR.off, tit: COR.azul, txt: COR.navy, acento: COR.azul, kicker: COR.azul, caixa: COR.azul, linha: '#C9CFDB', escuro: false },
  dark: { bg: `radial-gradient(120% 90% at 100% 0%,#1d3566 0%,${COR.navyFundo} 60%)`, tit: '#fff', txt: '#E4E8F0', acento: COR.azulClaro, kicker: COR.azulClaro, caixa: COR.azul, linha: 'rgba(255,255,255,.28)', escuro: true },
};
export const PERFIL = '@liberofilho';
export const FONTES = 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&family=Schibsted+Grotesk:wght@500;600;700;800&display=swap';
export const TITULO = "font-family:'Big Shoulders Display',sans-serif;font-weight:900;text-transform:uppercase";
export const TEXTO = "font-family:'Schibsted Grotesk',sans-serif";
const RUIDO = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .35 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
// **negrito** (800) e [[caixa]] (palavra com fundo sólido).
export const rico = (s, caixa = COR.azul, cor = '#fff') => esc(s).replace(/\*\*(.+?)\*\*/g, '<b style="font-weight:800">$1</b>')
  .replace(/\[\[(.+?)\]\]/g, `<span style="background:${caixa};color:${cor};padding:0 .12em;box-decoration-break:clone;-webkit-box-decoration-break:clone">$1</span>`);
export const linhas = (v, caixa, cor) => lista(v).map(l => rico(l, caixa, cor)).join('<br>');

export const textura = escuro => `<div style="position:absolute;inset:0;pointer-events:none;background-image:${RUIDO};opacity:${escuro ? .55 : .5};mix-blend-mode:${escuro ? 'overlay' : 'multiply'};z-index:20"></div>`;
export const rodape = (cor, lado = 'left') => `<div style="position:absolute;bottom:64px;${lado}:96px;${TEXTO};font-size:26px;font-weight:600;letter-spacing:.08em;color:${cor};z-index:15">${PERFIL}</div>`;
export const anel = (x, y, d, borda = 64) => `<div style="position:absolute;left:${x}px;top:${y}px;width:${d}px;height:${d}px;border:${borda}px solid ${COR.vermelho};border-radius:50%;box-sizing:border-box;z-index:1"></div>`;
// Objeto 3D (PNG sem fundo em libero-comum/assets): {img, x, y, tam, rot}.
export const objeto = (ctx, o) => o && o.img ? `<img src="${ctx.asset(o.img)}" style="position:absolute;left:${o.x ?? 700}px;top:${o.y ?? 80}px;width:${o.tam ?? 320}px;transform:rotate(${o.rot ?? 0}deg);filter:drop-shadow(0 18px 24px rgba(0,0,0,.28));z-index:12">` : '';

// Página: cada slide é um <section id="slide-N"> de w×h (post 1080×1350, aula 1920×1080); o render fotografa um por um.
export function pagina(slides, w = W, h = H) {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet">
<style>*{box-sizing:border-box}body{margin:0;${TEXTO};-webkit-font-smoothing:antialiased}
section{position:relative;width:${w}px;height:${h}px;overflow:hidden}
p{margin:0}</style></head><body>
${slides.map((s, i) => `<section id="slide-${i + 1}" style="background:${s.bg}">${s.html}${textura(s.escuro)}</section>`).join('\n')}
</body></html>`;
}

// Molde "Libero Fundos" (@liberofilho): fundos 1920×1080 para transmissão/aula gravada, com a câmera à
// esquerda e o slide à direita por cima. Pouca coisa: o desenho fica nas bordas (anéis vermelhos cortados,
// palavra vazada gigante quase apagada) e o @ no rodapé; o miolo fica limpo para a câmera e o slide.
// Identidade do Carrossel Libero (libero-comum/identidade.mjs).
import { COR, TEMAS, TITULO, TEXTO, PERFIL, esc, anel, pagina } from '../libero-comum/identidade.mjs';

const W = 1920, H = 1080;
const perfil = (lado, cor, fundo) => `<div style="position:absolute;bottom:34px;${lado}:48px;display:flex;align-items:center;gap:14px;${TEXTO};font-size:28px;font-weight:700;letter-spacing:.06em;color:${cor};z-index:15">
  <span style="width:14px;height:14px;border-radius:50%;background:${COR.vermelho};flex:none"></span>${fundo ? `<span style="background:${fundo};padding:6px 16px 7px;border-radius:8px">${PERFIL}</span>` : PERFIL}</div>`;
// Palavra gigante vazada, quase invisível, cortada na borda de baixo.
const vazada = (txt, cor, y = 760, px = 420) => `<div style="position:absolute;left:-20px;right:-20px;top:${y}px;${TITULO};font-size:${px}px;line-height:1;white-space:nowrap;color:transparent;-webkit-text-stroke:3px ${cor};z-index:1">${esc(txt)}</div>`;

const ESTILOS = {
  // Azul da identidade: anéis vermelhos nos cantos (em cima à direita e embaixo à esquerda) e @ à direita.
  azul(s) {
    return { bg: TEMAS.blue.bg, escuro: true, html: `
      ${anel(W - 230, -210, 440, 60)}${anel(-210, H - 230, 440, 60)}
      ${vazada(s.palavra || 'CONSTITUCIONAL', 'rgba(255,255,255,.09)', 800, 400)}
      ${perfil('right', '#fff', 'rgba(18,26,39,.55)')}` };
  },
  // Navy: brilho azul no canto, faixa azul fina embaixo, anel vermelho só em cima à direita e @ à esquerda.
  navy(s) {
    return { bg: `radial-gradient(90% 90% at 100% 100%,#1d3f9a 0%,#162a5c 35%,${COR.navyFundo} 75%)`, escuro: true, html: `
      ${anel(W - 230, -210, 440, 60)}
      ${vazada(s.palavra || 'LIBERO FILHO', 'rgba(143,176,255,.10)', 790, 420)}
      <div style="position:absolute;left:0;right:0;bottom:0;height:10px;background:linear-gradient(90deg,${COR.azul},${COR.azulClaro});z-index:3"></div>
      ${perfil('left', '#fff', '')}` };
  },
};

export function renderCarrossel(c) {
  const avisos = [];
  const slides = (c.slides || []).map((s, i) => {
    const f = ESTILOS[s.estilo];
    if (!f) { avisos.push(`slide ${i + 1}: estilo "${s.estilo}" não existe (${Object.keys(ESTILOS).join(', ')})`); return { bg: COR.navyFundo, escuro: true, html: '' }; }
    return f(s);
  });
  return { html: pagina(slides, W, H), total: slides.length, avisos, largura: W, altura: H };
}

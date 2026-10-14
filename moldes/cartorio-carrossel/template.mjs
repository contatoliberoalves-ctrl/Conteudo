// Molde "Cartório · Carrossel": slides 1080×1350. Tipos: capa, texto, lista, passos, destaque, cta
// (peças em ../cartorio-comum/pecas.mjs). Cada slide pode trocar o fundo (carvao ou papel).
import { lista } from '../cartorio-comum/marca.mjs';
import { peca } from '../cartorio-comum/pecas.mjs';

export function slides(c) {
  const ss = lista(c.slides);
  return { w: 1080, h: 1350, slides: ss.map((s, i) => peca(s, { pagina: i + 1, total: ss.length })) };
}

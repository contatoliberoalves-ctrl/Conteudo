// Molde "Cartório Amigo · Carrossel": slides 1080×1350 na identidade amigável do cartório (cores do
// sertão, Baloo 2 + Nunito). Tipos: capa, texto, lista, mito, numero, pergunta, cta
// (peças em ../cartorio-comum/amigo.mjs). A capa usa a foto em fotos/ (feita em IA) ou a ilustração.
import { lista } from '../cartorio-comum/marca.mjs';
import { peca } from '../cartorio-comum/amigo.mjs';

export function slides(c, root) {
  const ss = lista(c.slides);
  return { w: 1080, h: 1350, slides: ss.map((s, i) => peca(s, { pagina: i + 1, total: ss.length, root })) };
}

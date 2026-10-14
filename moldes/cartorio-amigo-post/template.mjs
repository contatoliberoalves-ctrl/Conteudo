// Molde "Cartório Amigo · Tela única": uma peça 1080×1350 na identidade amigável do cartório.
// Layouts: curiosidade (imagem + título), mito, pergunta, aviso, numero (peças em ../cartorio-comum/amigo.mjs).
// "titulo" é o nome na galeria; o título da peça vai em "chamada".
import { peca } from '../cartorio-comum/amigo.mjs';

export function slides(c, root) {
  return { w: 1080, h: 1350, slides: [peca({ tipo: c.layout || 'curiosidade', ...c, titulo: c.chamada }, { root })] };
}

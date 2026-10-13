// Molde "Cartório · Tela única": uma peça 1080×1350. Layouts: aviso, frase, contato, lista, destaque
// (peças em ../cartorio-comum/pecas.mjs). "titulo" é o nome na galeria; o título da peça vai em "chamada".
import { peca } from '../cartorio-comum/pecas.mjs';

export function slides(c) {
  return { w: 1080, h: 1350, slides: [peca({ tipo: c.layout || 'aviso', ...c, titulo: c.chamada })] };
}

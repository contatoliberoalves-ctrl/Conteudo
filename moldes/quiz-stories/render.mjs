import { gerar } from '../libero-comum/render-base.mjs';
import { renderCarrossel } from './template.mjs';

// Uso: node render.mjs [id]  -> saida/<id>/1.png (pergunta) e 2.png (gabarito), e painel.png.
await gerar(import.meta.url, renderCarrossel);

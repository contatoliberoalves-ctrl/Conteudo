import { gerar } from '../libero-comum/render-base.mjs';
import { renderCarrossel } from './template.mjs';

// Uso: node render.mjs [id]  -> saida/<id>/1.png … N.png e painel.png (veja libero-comum/render-base.mjs).
await gerar(import.meta.url, renderCarrossel);

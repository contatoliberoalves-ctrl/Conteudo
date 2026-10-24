# Indubio Proposta

Propostas comerciais da Indubio Pro Marketing em A4 retrato (PDF + PNG 2×). `node render.mjs [id]` gera
`build/thumbs/<thumb>.png` (1280×720) e `saida/<id>/<id>.pdf`, `saida/<id>/<n>.png`, `painel.png`.

## dados.json (uma proposta por objeto)
| campo | o que é |
|---|---|
| `id`, `por`, `para` | identificação; `para` também vai no rodapé |
| `etiquetas` | pílulas no pé da capa |
| `escopoTexto`, `escopo[]` | blocos `{titulo, sub, itens:[{q, t}]}` (q = quantidade grande; `+` para extra); blocos alternam branco e preto |
| `numeros[]` | faixa dourada `{n, t}` abaixo do escopo (opcional; só se couber) |
| `unitarios[]` | `{t, valor, d}` cartões de preço unitário |
| `planosTitulo`, `planos[]` | `{nome, d, por, de?, destaque?, selo?}`; com `de` mostra o riscado e a economia |
| `extras[]` | `{nome, d, valor}` linha tracejada abaixo dos planos |
| `bonus` | faixa "Bônus" |
| `paginasThumbs[]` | `{titulo, texto?, thumbs:[ids], cheio?}`; sem `cheio`: 1 grande + 2 em par; com `cheio`: todas grandes (até 2) |
| `fimTitulo`, `fimTexto` | encerramento |

`[[texto]]` sai em dourado. Valores em número (`brl` formata).

## thumbs.json
Miniaturas de YouTube em `thumbs.mjs` (estilos `zera`, `gabaritar`, `identificacao`, `sigla`, `pontuacao`).
`foto` = recorte PNG sem fundo em `fotos/` (fora do git; recorte com rembg `u2net_human_seg`).
`sigla` aceita `sigla`, `texto`, `chips`, `fundo`, `cor`, `destaque`, `ts`, `tt`.

# Mapas Mentais · Constitucional com Líbero

A4 horizontal (1123×794 px). `node render.mjs [id]` gera `saida/<id>/<n>.png` (2×), `saida/<id>/<id>.pdf` (montado com as imagens) e `painel.png`.
Nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]` (o `node_modules` é link para `../libero-comum/node_modules`).

Identidade: capa em degradê verde leve, títulos em Big Shoulders Display 900 e o tema em Plus Jakarta Sans; página do mapa moderna: fundo branco com brilho verde nos cantos, nó central verde, curvas finas na cor do ramo e cartões com cabeçalho colorido (título + inciso), resumo, tópicos numerados e faixa âmbar de pegadinha; texto em Inter.

## dados.json (um material por objeto)
- `id`, `titulo`, `perfil`.
- `capa` (opcional): `estilo` (padrão `tipografica`; também `caderno`, `topografico`, `marcatexto`), `pre`, `tema` (linha grande abaixo do título; lista = várias linhas), `ts` (px do título), `tt` (px do tema). `capas` (lista) gera várias capas para comparar.
- `mapas[]`, uma página cada: `tema` (etiqueta no alto à direita), `artigo` (sobre o título do centro), `titulo` (linhas do nó central), `ts`, `sub`, `centroW`, `ramos[]`, `rodape` ("Pra fixar:"), `largura` (px das colunas, padrão 340), `gap`, `corpo` (px dos tópicos, padrão 11,5).
- Ramo: `titulo`, `artigo` (pílula no cabeçalho), `resumo` (1 frase), `itens` (tópicos numerados), `dica` (faixa "Pegadinha"), `cor` (opcional; senão segue a paleta verde/petróleo/azul/floresta/roxo/âmbar), `ts`.

Até 6 ramos por página (3 de cada lado). `**negrito**` sai na cor do ramo com fundo claro; `[[texto]]` sublinhado. O render avisa se o mapa passar da área.

# Mapas Mentais · Constitucional com Líbero

A4 horizontal (1123×794 px). `node render.mjs [id]` gera `saida/<id>/<n>.png` (2×), `saida/<id>/<id>.pdf` (montado com as imagens) e `painel.png`.
Nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]` (o `node_modules` é link para `../libero-comum/node_modules`).

Identidade: capa em verdes (degradê leve) com títulos em Big Shoulders Display 900 e Inter; página do mapa com cara de mapa de estudo feito à mão: papel pontilhado, texto em Kalam (letra de caneta), tema num balão de traço duplo, ramos de caneta coloridos, palavras-chave com marca-texto e pegadinha num post-it.

## dados.json (um material por objeto)
- `id`, `titulo`, `perfil`.
- `capa` (opcional): `estilo` (`tipografica` · `caderno` · `topografico` · `marcatexto`), `pre`, `volume` (tema do volume), `numero` (vazado, só na tipográfica), `nota` (anotação à caneta, só na marcatexto). `capas` (lista) gera várias capas para comparar.
- `mapas[]`, uma página cada: `tema` (etiqueta no alto à direita), `artigo` (sobre o título do centro), `titulo` (linhas do nó central), `ts`, `sub`, `centroW`, `ramos[]`, `rodape` ("Pra fixar:"), `largura` (px das colunas, padrão 340), `gap`, `corpo` (px dos tópicos, padrão 11,5).
- Ramo: `titulo`, `artigo` (etiqueta do inciso), `resumo` (1 frase), `itens` (sub-ramos), `dica` (post-it "Pegadinha!"), `ts`. As cores seguem as canetas (verde, azul, laranja, rosa, petróleo, roxo), cada uma com seu marca-texto.

Até 6 ramos por página (3 de cada lado). `**negrito**` sai com marca-texto na cor do ramo; `[[texto]]` sublinhado. O render avisa se o mapa passar da área.

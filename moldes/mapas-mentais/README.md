# Mapas Mentais · Constitucional com Líbero

A4 horizontal (1123×794 px). `node render.mjs [id]` gera `saida/<id>/<n>.png` (2×), `saida/<id>/<id>.pdf` (montado com as imagens) e `painel.png`.
Nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]` (o `node_modules` é link para `../libero-comum/node_modules`).

Identidade: verdes (`#0B4A30` floresta, `#16804F` verde, `#2FA36B` folha, menta `#EAF6EF`) e dourado (`#C9A646`) só no livro da CF e em detalhes; títulos em Big Shoulders Display 900 caixa alta, texto em Inter, toques em Fraunces itálico (o "§" e o pré-título da capa).

## dados.json (um material por objeto)
- `id`, `titulo`, `perfil`.
- `capa` (opcional): `pre`, `titulo` (linhas), `ts`, `sub`, `volume` (etiqueta dourada no pé), `marca` (texto ao lado do § no alto).
- `mapas[]`, uma página cada: `tema` (etiqueta no alto à direita), `artigo` (sobre o título do centro), `titulo` (linhas do nó central), `ts`, `sub`, `centroW`, `ramos[]`, `rodape` ("Pra fixar:"), `largura` (px das colunas, padrão 340), `gap`, `corpo` (px dos tópicos, padrão 11,5).
- Ramo: `titulo`, `artigo` (inciso/artigo na pílula), `resumo` (1 frase), `itens` (tópicos), `dica` ("Pegadinha:"), `cor` (opcional; senão segue a paleta), `ts`.

Até 6 ramos por página (3 de cada lado). `**negrito**` sai na cor do ramo; `[[caixa]]` com fundo. O render avisa se o mapa passar da área.

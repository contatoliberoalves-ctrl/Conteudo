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

## Desenhos da página (`layout` do mapa)
`radial` (tema no centro, cartões dos dois lados), `arvore` (tema no alto, cartões em fileira, ligação em chave), `colunas` (painel verde à esquerda e quadro comparativo; até 4 ramos), `etapas` (passos numerados em linha, para procedimentos), `perguntas` (linhas "rótulo → resposta") e `regra` (1º ramo como regra num quadro largo; os outros como condições/exceções). O texto cresce até 22 px e diminui até caber; títulos longos encolhem sozinhos. Ramo pode vir como `{titulo, texto}` (1ª frase vira o resumo). Rodapé opcional: `aplicacao` ("Na prova"), `pergunta`/`resposta` ("Confira") e `referencia`.

## Coleção "Constitucional com Líbero · Mapas" (100 mapas, um PDF por mapa)
1. `python3 colecao/importar_docx.py <arquivos .docx>`: lê os volumes do autor (Heading 1 "Mapa NN …", rótulos em negrito no "Texto dos ramos", "Aplicação e distinção", "Confira se entendeu" e a "Composição" do prompt) e junta em `colecao/mapas.json` (acumula entre envios).
2. `node colecao/montar.mjs`: escolhe o desenho de cada mapa pela composição indicada pelo autor, sem repetir o mesmo desenho em mapas seguidos, e grava `colecao/dados-colecao.json` (capa tipográfica + página do mapa).
3. `DADOS=colecao/dados-colecao.json SAIDA=saida/colecao node render.mjs [NN]` (nuvem: com `CHROMIUM_PATH` e `RENDER_PROXY`): `saida/colecao/NN-titulo/NN-titulo.pdf`.
Para trocar o desenho de um mapa, acrescente `"layout"` no item de `colecao/mapas.json` (ele prevalece) e rode `montar.mjs` de novo.

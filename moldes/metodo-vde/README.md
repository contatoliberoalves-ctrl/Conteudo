# Método VDE (Mentoria de Natália Valença e Líbero Filho) · slides de aula 1920×1080

Capa, divisores e fechamento no degradê roxo → índigo do caderno da mentoria (`#2E0575` → `#1937B1`, detalhe lavanda `#C9B8FF`); páginas internas quase sempre brancas (faixa fina em degradê no topo) ou lavanda clarinho. Poppins em tudo. Detalhes discretos: arcos finos no canto, números em quadradinhos com degradê. Rodapé: `@nataliavalenca · @liberofilho` e "MÉTODO VDE".

Gerado por `../libero-comum/render-base.mjs` (textos com `data-fit` encolhem até caber; o render avisa se não couber).
Gerar: `node render.mjs [id]` (nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]`).

## Aula (`dados.json` é uma lista)

`id`, `titulo`, `tema` e `slides`. Em todo slide: `tipo`, `tema` (`degrade`, `branco` ou `lavanda`), `kicker`, `titulo` (linhas; `**negrito**`, `[[destaque]]` em lavanda no degradê e em degradê nas páginas claras; `ts` força o tamanho) e `corpo` (px do texto). Use `degrade` na capa, nos divisores e no fim; o resto em `branco`, com `lavanda` de vez em quando.

## Tipos

- `capa`: `titulo`, `texto`, `pilula`.
- `secao`: divisor de parte, `numero` em contorno ("01"), `titulo`, `texto`, `pilula` (`tn` = tamanho do número).
- `texto`: título à esquerda, `texto` (parágrafos) à direita.
- `cards`: `cards` ({`titulo`, `texto`, `rotulo`, `icone` (troca o número)}); 6 em 3×2, 4 em 2×2 (`colunas` muda).
- `lei`: `citacao` literal num quadro, `fonte`, `traducao` à esquerda.
- `lista`: `itens` à direita com número no quadradinho; `inicio`.
- `comparar`: `lados` = 2 × {`rotulo`, `titulo`, `itens`}, selo VS.
- `tabela`: `colunas` e `linhas`.
- `questao`: `enunciado`, `alternativas`, `correta` (0 = A); repita com `gabarito: true` para revelar.
- `balao`: atenção/pegadinha, `texto` num balão com borda em degradê.
- `fim`: `titulo`, `texto`, `botao`.

Conteúdo: use o material da mentoria (ex.: caderno "Treino de peças", 20 casos com gabarito; peça o PDF ao autor). Não invente gabaritos nem o significado da sigla VDE.

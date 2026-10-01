# Ética Aula (@eticagabaritadanaoba)

Slides de aula 1920×1080 na identidade do Carrossel Ética (`../carrossel-etica/template.mjs`: cores, temas e textura).
Gerados por `../libero-comum/render-base.mjs` (textos com `data-fit` encolhem até caber; o render avisa se não couber).

Gerar: `node render.mjs [id]` (no ambiente em nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]`).
Saída em `saida/<id>/1.png … N.png` e `painel.png`.

## Aula (`dados.json` é uma lista)

`id`, `titulo`, `tema` (assunto) e `slides`. Em todo slide: `tipo`, `tema` (`degrade`, `branco` ou `rosa`),
`kicker` (sai com ✦), `titulo` (lista de linhas; `**negrito**`, `[[caixa]]`; `ts` força o tamanho) e `corpo` (px do texto).

## Tipos

- `capa`: `titulo`, `texto`, `pilula` e, se quiser, `progresso` ({`valor` 0–100, `texto`, `rotulo`}).
- `secao`: divisor de parte, `numero` vazado gigante ("01"), `titulo`, `texto`, `pilula` (`tn` = tamanho do número).
- `texto`: título à esquerda, `texto` (parágrafos) à direita.
- `missao`: `cards` ({`icone` emoji, `rotulo`, `titulo`, `texto`}); 4 cards em 2×2, 3 em linha (`colunas` muda).
- `lei`: `citacao` literal num quadro, `fonte`, e `traducao` à esquerda.
- `lista`: `itens` à direita; `marcador` `romano`/`letra`; `inicio`.
- `comparar`: `lados` = 2 × {`rotulo`, `titulo`, `itens`}, com selo VS.
- `tabela`: `colunas` (cabeçalho) e `linhas` (listas de células).
- `questao`: `enunciado`, `alternativas`, `correta` (0 = A); repita o slide com `gabarito: true` para revelar.
- `balao`: pegadinha, `texto` num balão.
- `fim`: `titulo`, `texto`, `botao`, `progresso`.

# Carrossel Ética (@eticagabaritadanaoba)

Carrossel 1080×1350 de Ética na OAB, na estrutura do Carrossel Libero e nas cores do app Ética Gabaritada
(vinho `#5A1430`, rosa `#F08BB4`, rosa clarinho `#FCE4EE`, branco).

Gerar: `node render.mjs [id]` (no ambiente em nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]`).
Saída em `saida/<id>/1.png … N.png` e `painel.png`.

## Carrossel (`dados.json` é uma lista)

- `id`, `titulo`, `tema` (assunto, para a galeria) e `slides`.

## Campos comuns a todo slide

- `tipo`: `capa`, `texto`, `impacto`, `lei`, `lista`, `missao`, `frases`, `balao` ou `cta`.
- `tema` (fundo): `degrade` (rosa → vinho, o das capas), `branco` (com a faixa em degradê no topo) ou `rosa`
  (rosa clarinho → branco, como o card do app). Alterne degradê e branco; nunca 3 iguais seguidos.
- `kicker`: linha pequena acima do título, sai com ✦ na frente ("✦ ART. 36").
- `titulo`: lista de linhas. `**negrito**` e `[[caixa]]` (palavra com fundo). `ts` força o tamanho em px.
- `texto`: parágrafo ou lista de parágrafos (`**negrito**` para destacar). `corpo` muda o tamanho (px).
- `aneis: true` (ou `"baixo"`): anéis rosa vazados nos cantos.
- `pilula`: etiqueta arredondada ("Lei 8.906/94 · arts. 35 a 39") em `capa` e `texto`.

## Tipos

- `capa`: `pre`, `titulo`, `texto`, `pilula`. Estilos (`estilo`):
  - `numero`: `numero` gigante vazado à direita (listas: "4 sanções");
  - `versus`: `lados: [a, b]`, metade degradê e metade branca com o selo VS, `texto` embaixo;
  - `pergunta`: interrogação gigante e `opcoes`;
  - `desafio`: como a tela do app: `progresso` ({`valor` 0–100, `texto` no lugar do %, `rotulo`}), `titulo`, `texto`, `pilula`.
- `texto`: `titulo`, barra, `texto`; `palavra` vertical na borda (`palavraLado`: `esquerda`/`direita`).
- `impacto`: `titulo` dentro de um bloco e `sub`.
- `lei`: `citacao` (texto literal da lei) e `traducao`.
- `lista`: `itens`; `marcador`: números (padrão), `romano` ou `letra`; `inicio` para continuar a contagem.
- `missao`: `cards` com `icone` (emoji), `rotulo`, `titulo`, `texto` (os cards de missão do app). Até 4.
- `frases`: `frases` em etiquetas.
- `balao`: `texto` num balão de mensagem.
- `cta`: `titulo`, `texto`, `botao` e, se quiser, `progresso`.

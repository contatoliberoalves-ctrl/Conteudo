# Ética Criativos (@eticagabaritadanaoba)

Criativos de tela única para anúncio e divulgação, em **feed** (1080×1350) e **stories** (1080×1920), nas cores do
Carrossel Ética (vinho, rosa, branco). O celular com a tela do app Ética Gabaritada é desenhado no próprio molde
(card "✦ DIA 5 DE 5", anel de progresso, pílula "Rota 5 dias · 56 questões/dia" e as missões).

Gerar: `node render.mjs [id]` (nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]`).
Saída: `saida/<id>/1.png`. Nos stories o texto respeita as faixas de cima e de baixo (≈250–330 px) que o Instagram cobre.

## dados.json
Um item por formato: `id`, `titulo` (nome na galeria), `tema`, `layout`, `formato` (`feed` ou `story`) e os campos do
layout. O mesmo criativo em outro formato: `{"id": "...-story", "titulo": "...", "de": "<id do feed>", "formato": "story"}`
(herda tudo e troca só o que vier junto).

Marcação nos textos: `**negrito**` e `{{destaque}}` (cor de destaque do layout). `app` (opcional) muda a tela do
celular: `{dia, tema, progresso, feitas, missoes: [[emoji, rótulo, título], …]}`.

| layout | referência | campos |
|---|---|---|
| `manchete` | "Como criar um produto digital… do zero" | `linhas` (título empilhado), `destaque` (índice da linha em degradê rosa), `td`/`ts` (px), `acento` (manuscrito), `sub`, `foto` opcional (fundo) |
| `etiquetas` | "Rápido antes que saia do ar" | `etiquetas` (lista de blocos; cada bloco é uma lista de linhas; o último sai em magenta), `tl` (px), `foto` opcional |
| `nota` | nota do iPhone ("Corre pra CST") | `frase` (com `{{fim em magenta}}`), `fecho`, `tf` |
| `tweet` | tweet ("Os 10k…") | `frase`, `fecho`, `nome`, `arroba`, `avatar` (foto opcional; sem ela, "ÉG" no degradê), `tf` |
| `oferta` | "Inscrições abertas" | `linhas`, `caixa` (contornada), `sub`, `prova` (linhas), `acao` (painel da base) |
| `plano` | missões do app | `kicker`, `linhas`, `sub`, `botao` |

Fotos (de pessoas) ficam em `fotos/`, fora do git (repositório público).

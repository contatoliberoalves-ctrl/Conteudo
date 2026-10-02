# Constitucional Criativos (@constitucionalgabaritado)

Criativos de tela única para anúncio e divulgação, em **feed** (1080×1350) e **stories** (1080×1920), nas cores do
@constitucionalgabaritado: base `#1c1f1e`, verde `#3b4c49`, verde-claro `#9be0a3`, verde-médio `#3f9a4d`, gelo
`#f6f7f6`; títulos em Bebas Neue, texto em Poppins. Mesma estrutura do molde Ética Criativos.

Gerar: `node render.mjs [id]` (nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]`).
Saída: `saida/<id>/1.png`. Nos stories o texto respeita as faixas de cima e de baixo que o Instagram cobre.

## Fotos (fora do git)
As do autor, 1080×1350: `fotos/` deste molde ou `../carrossel-explicativo/fotos/` (recriadas pelo `recortar_fotos.py`
de lá). O repositório é público: fotos nunca vão para o git.

## dados.json
Um item por formato: `id`, `titulo` (galeria), `tema`, `layout`, `formato` (`feed`/`story`) e os campos do layout. O
mesmo criativo em stories: `{"id": "...-story", "titulo": "...", "de": "<id do feed>", "formato": "story"}`.
Marcação: `**negrito**`, `{{destaque}}` (verde) e `~~riscado~~` (preço "de").

| layout | referência | campos |
|---|---|---|
| `manchete` | "Como criar um produto digital… do zero" | `foto`, `fotoY`, `fotoEscala`, `linhas`, `destaque` (linha em degradê verde), `td`/`ts`, `acento` (manuscrito), `sub` |
| `etiquetas` | "Rápido antes que saia do ar" | `foto`, `fotoPos`, `etiquetas` (blocos de linhas; o último em verde), `tl`, `etqTopo`, `etqJust` |
| `nota` | nota do iPhone ("Corre pra CST") | `frase`, `fecho`, `tf` |
| `tweet` | tweet ("Os 10k…") | `avatar` (foto; `avatarPos`, `avatarZoom`), `nome`, `arroba`, `frase`, `fecho`, `tf` |
| `oferta` | "Inscrições abertas" | `foto`, `linhas`, `caixa` (ex.: `~~R$ 247~~ {{R$ 119}}`), `sub`, `prova`, `acao` |
| `lista` | lista de benefícios | `foto`, `kicker`, `linhas`, `itens`, `ti`, `preco`, `botao` |

# Molde Indubio Apresentação

Apresentações de projetos da Indubio Pro Marketing em A4 horizontal (1123×794 px por slide). Gere com `node render.mjs [id]` (no ambiente em nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs`). Saída: `saida/<id>/<id>.pdf` e um PNG por slide (em 2×).

Os prints dos sites ficam em `prints/` (fora do git: são telas de projetos de clientes). Corte selos de editor ("Editar site") antes de usar.

Cada apresentação em `dados.json` tem `id`, `titulo`, `marca` (rodapé) e `slides`. Nos títulos, `_texto_` sai em itálico fino e `**texto**` em negrito.

| `tipo` | Campos |
|---|---|
| `capa` | `kicker`, `titulo`, `texto`, `cliente`, `print`, `url` (barra do navegador), `pos` |
| `texto` | `kicker`, `titulo`, `texto`, `pilares` ([{t, d}], até 4), `escuro` |
| `tela` | `kicker`, `titulo`, `texto`, `itens`, `print`, `pos`, `h`, `lado` (`esquerda`/`direita`, lado do texto), `janelaY`, `escuro` |
| `recursos` | `kicker`, `titulo`, `texto`, `cards` ([{icone, t, d}]; ícones: aviso, video, livro, chave, escudo, tela, celular, paleta), `colunas`, `cardsY`, `escuro` |
| `niveis` | `kicker`, `titulo`, `texto`, `login`, `loginTexto`, `niveis` ([{t, d}]) |
| `fim` | `titulo`, `texto` (logo grande da agência) |

# Dorama · Tela única (@cristaodorameiro)

`CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]` → `saida/<id>/1.png`.

`dados.json`: lista de posts com `id`, `titulo` (nome na galeria), `layout`, `fundo` (opcional), `rodape` (chamada final) e:

| layout | campos |
|---|---|
| `indicacao` | `kicker`, `titulo`, `dorama` (`titulo`, `hangul`, `ano`, `eps`, `onde`, `genero`, `cena`/`foto`), `estrelas` (0–5), `motivos` (3) |
| `nota` | `kicker`, `titulo`, `nota`, `dorama`, `criterios` [[nome, nota]] (6), `alertas` |
| `meme` | `kicker`, `titulo`, `legenda`, `legendaKr`, `emoji`, `cena`/`foto`, `episodio` |
| `curiosidade` | `emoji`, `hangul` (fundo), `titulo`, `texto`, `fonte` |
| `reflexao` | `kicker`, `versiculo`, `ref`, `texto`, `dorama` (miniatura do cartaz) |

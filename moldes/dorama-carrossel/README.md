# Dorama · Carrossel (@cristaodorameiro)

`CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]` → `saida/<id>/1.png…` e `painel.png`.

`dados.json`: lista de `{ id, titulo, slides }`. Todo slide aceita `fundo` (`noite`, `creme`, `rosa`; padrão: capa, versículo e cta na noite, o resto no creme), `kicker`, `titulo`, `ts` (tamanho do título).

| tipo | campos |
|---|---|
| `capa` | `estilo`: `cartaz` (`dorama`, `selo`, `texto`), `nota` (`dorama`, `nota` 0–10), `frase` (`hangul`, `emoji`, `texto`), `meme` (campos do meme) |
| `capa` com foto do dorama de fundo | `estilo`: `foto` (tela cheia, título embaixo; `hangul`, `texto`), `cinema` (faixas pretas, foto no meio com `legenda` e `episodio`), `moldura` (foto num arco sobre o creme; `selo`), `vidro` (cartão de vidro fosco; `estrelas`, `onde`), `fotonota` (selo redondo com a `nota`). Todos com `foto` (em `../dorama-comum/fotos/`), `fotoPos`, `fotoZoom`, `escurecer` (0–1) e `credito` (linha pequena com o autor da foto) |
| `ficha` | `dorama` (`titulo`, `hangul`, `original`, `ano`, `eps`, `cena`, `foto`), `itens` [[rótulo, valor]] (4), `texto` |
| `texto` | `texto` (parágrafo ou lista), `corpo` |
| `lista` | `itens` (até 4–5) |
| `nota` | `criterios` [[nome, nota]] (até 6), `final`, `alertas` (o que saber antes do play) |
| `curiosidade` | `numero`, `texto`, `fonte` |
| `versiculo` | `versiculo`, `ref`, `texto` (ponte com o dorama) |
| `meme` | `legenda`, `legendaKr` (legenda em hangul), `emoji`, `cena` ou `foto`, `episodio` ("EP. 14") |
| `cta` | `acoes` (3), `pergunta` |

# Dorama · Nativo (@cristaodorameiro)

`CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]` → `saida/<id>/1.png…` (1080×1440).

`dados.json`: lista de `{ id, titulo, slides }`. Cada slide:
- fundo: `foto` (em `../dorama-comum/fotos/`, com `fotoPos` e `escurecer` 0–1) ou `cena` (`noite`, `cerejeira`, `por`, `mar`, `neve`, `verde`, `vinho`) com `emoji`, `emojiY`, `emojiTam`;
- `blocos`: texto nativo `{ texto, cor, y, tam, largura, alinhar, rot }`. Cores: `branco`, `preto`, `rosa`, `pink`, `noite`, `creme`, `ouro`, `nada` (sem fundo). `y` em px (0–1440) ou `topo`/`meio`/`base`;
- `figurinhas`: `{ tipo, y, rot, ... }` com `slider` (`texto`, `nota` 0–10, `emoji`), `enquete` (`texto`, `opcoes`), `pergunta` (`texto`, `dica`), `mencao` (`texto`, padrão @cristaodorameiro).

Não há conferência automática de sobreposição: confira o PNG.

---
name: molde-libero-duelo
description: Gera carrosséis no molde "Libero Duelo" do @liberofilho (identidade do Carrossel Libero em tela dividida azul x navy com medalhão VS: capa com os dois lutadores, um round por critério, placar em tabela e macete). Use para comparações "X x Y", diferenças entre institutos, peças ou ações.
---

# Molde: Libero Duelo

Pasta `moldes/libero-duelo/` (base em `moldes/libero-comum/`). O visual está em `template.mjs` e não deve ser alterado para gerar posts: só edite `dados.json`. Leia o `README.md` do molde.

1. Estrutura: `capa` → 3 a 5 `round` (um critério cada: natureza, objeto, legitimidade, competência, efeitos…) → `placar` → `macete` → `cta`.
2. Em cada round, 1 ou 2 frases curtas por lado, com o `artigo` exato (vários separados por `;`). `pegadinha` só quando houver uma de verdade.
3. `placar` e `macete` alternam `tema` (`light`/`dark`); os demais usam a tela dividida.
4. Gere (`CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>`); precisa terminar com ✓. Confira os PNGs.
5. Atualize a galeria (seção "Galeria" do `CLAUDE.md`, mesmo link) e faça commit.

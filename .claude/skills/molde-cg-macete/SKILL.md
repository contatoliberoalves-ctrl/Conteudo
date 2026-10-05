---
name: molde-cg-macete
description: Gera carrosséis no molde "Macete" do @constitucionalgabaritado (sigla ou regra para decorar: capa com a foto do autor e a sigla gigante, um slide por pedaço, resumo e pegadinha). Use quando pedirem macete, mnemônico, sigla ou "regra para decorar" (LIMPE, SOCIDIVAPLU, GPS, 3·3·3…) para o Constitucional Gabaritado.
---

# Molde: Macete

Pasta: `moldes/cg-macete/`. Visual em `template.mjs` e `../cg-comum/base.mjs`; para criar, edite só `dados.json`. Leia o `README.md`.

1. Estrutura: `capa` (sigla + "regra para…") → um `letra` por pedaço → `resumo` → `pegadinha` → `cta`. Alterne `gelo` e `verde`.
2. Cada pedaço com o artigo exato (inciso). Macete do autor tem prioridade; não invente siglas que distorçam o texto da lei.
3. Foto do autor (fora do git, `../carrossel-explicativo/fotos/`): escolha uma expressão que combine (pensando, apontando).
4. Gere: `cd moldes/cg-macete && CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>` (✓), confira, atualize a galeria e faça commit.

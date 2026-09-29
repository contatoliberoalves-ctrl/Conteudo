---
name: molde-libero-dossie
description: Gera carrosséis no molde "Libero Dossiê" do @liberofilho (identidade do Carrossel Libero em forma de processo arquivado: folha com aba, carimbo JÁ CAIU, linha do tempo, uma ficha por exame com número vazado e teses com artigo). Use para "teses que caíram", histórico de exames, jurisprudência caso a caso ou quando pedirem "dossiê".
---

# Molde: Libero Dossiê

Pasta `moldes/libero-dossie/` (base em `moldes/libero-comum/`). O visual está em `template.mjs` e não deve ser alterado para gerar posts: só edite `dados.json`. Leia o `README.md` do molde.

1. Estrutura: `capa` → `linha` (todos os exames) → uma `ficha` por exame (caso em uma frase, 2 a 4 teses com `tag` e `artigo`) → `carimbo` (padrão da banca) → `cta`. De 6 a 10 slides.
2. Conteúdo de teses: tabela "Principais Teses" do Livro de Prática Constitucional e gabaritos da FGV (`materiais/README.md`); confira o número do exame. Nunca invente tese, exame ou artigo.
3. Alterne `tema` (`blue`/`light`/`dark`), nunca 3 iguais seguidos. `**negrito**` em 1 a 3 trechos por slide.
4. Gere (`CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>`); precisa terminar com ✓. Se avisar que o texto não cabe, encurte. Confira os PNGs.
5. Atualize a galeria (seção "Galeria" do `CLAUDE.md`, mesmo link) e faça commit.

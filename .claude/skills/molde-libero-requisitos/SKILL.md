---
name: molde-libero-requisitos
description: Gera carrosséis no molde "Libero Requisitos" do @liberofilho (identidade do Carrossel Libero como ficha de candidatura: "fulano poderia ser X?", um slide por requisito com ✔/✘/?, a lei literal, a virada e o checklist com carimbo final). Use para análises de requisitos constitucionais com personagens da cultura pop ou casos hipotéticos ("Naruto poderia ser presidente?").
---

# Molde: Libero Requisitos

Pasta `moldes/libero-requisitos/` (base em `moldes/libero-comum/`). O visual está em `template.mjs` e não deve ser alterado para gerar posts: só edite `dados.json`. Leia o `README.md` do molde.

1. Estrutura: `capa` (pergunta + personagem em 3D) → `lei` (dispositivo **literal**) → um `requisito` por condição que mais rende piada/aula (3 a 5) → `virada` ("e se…?") → `checklist` com todos os requisitos e o `selo` final → `cta`.
2. Requisitos e artigos exatos da CF/88; a análise do personagem usa fatos da obra, com humor, falando com "você". Não use imagens do personagem (direitos autorais): só objetos 3D de `libero-comum/assets/`.
3. Alterne `tema` (`blue`/`light`/`dark`), nunca 3 iguais seguidos.
4. Gere (`CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>`); precisa terminar com ✓. Confira os PNGs.
5. Atualize a galeria (seção "Galeria" do `CLAUDE.md`, mesmo link) e faça commit.

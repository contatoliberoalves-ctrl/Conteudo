---
name: molde-libero-fundos
description: Gera fundos de tela 16:9 (1920×1080) no molde "Libero Fundos" do @liberofilho, para aula ou live com câmera e slide lado a lado, na identidade do Carrossel Libero (azul ou navy, anéis vermelhos nos cantos, palavra vazada, @ no rodapé). Use quando pedirem "fundo", "background", "tela de fundo da live/aula" ou "fundo pra câmera e slide".
---

# Molde: Libero Fundos

Pasta `moldes/libero-fundos/` (base em `moldes/libero-comum/`). Leia o `README.md` do molde.

1. Cada slide do post em `dados.json` é um fundo: `{"estilo": "azul" | "navy", "palavra": "…"}`. Mantenha pouca coisa: o miolo (câmera à esquerda e slide à direita) fica limpo.
2. Gere (`CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>`); precisa terminar com ✓. Confira os PNGs.
3. Atualize a galeria (seção "Galeria" do `CLAUDE.md`, mesmo link) e faça commit.

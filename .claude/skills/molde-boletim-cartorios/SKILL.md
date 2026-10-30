---
name: molde-boletim-cartorios
description: Gera posts de tela única (1080×1350) no molde "Boletim Cartórios PE", que resume ofícios, provimentos e orientações para os cartórios de Pernambuco (FERC-PE, Corregedoria, CNJ) em 3 estilos: oficio (papel e prata), manchete (azul e navy) e ficha (grafite e areia, pode x não pode). Use quando pedirem boletim, resumo de ofício circular ou aviso para os cartórios/registradores de PE.
---

# Molde: Boletim Cartórios PE

Pasta: `moldes/boletim-cartorios/`. Só se edita `dados.json` (campos no `README.md`).

1. Leia o documento enviado e resuma sem inventar: o que muda, para quem, o que pode e o que não pode, a norma citada (com artigo e incisos exatamente como no texto) e quem assina.
2. Um post por estilo pedido (`oficio`, `manchete`, `ficha`). Limites que cabem: chamada até ~70 caracteres (manchete até ~55), cada parágrafo do resumo até ~45 palavras, itens de pode/não pode até ~20 palavras, citação até ~35 palavras.
3. Gere: `cd moldes/boletim-cartorios && CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]`. Tem que terminar com ✓; com `!`, encurte o texto ou baixe `ts`.
4. Confira os PNGs, atualize a galeria (`python3 galeria/atualizar.py boletim-cartorios`) e faça commit do `dados.json`.

---
name: molde-guia-avaliadora
description: Gera guias de bolso em PDF A6 (roteiro de falas, checklists, perguntas, objeções) no molde "Guia da Avaliadora", feito para a Dra. Séfora, dentista avaliadora da Odonto News, na linguagem dos PDFs do Renato em cores de advocacia (marinho, vinho, dourado). Use quando pedirem guia de bolso, roteiro de atendimento, POP ou checklist de avaliação/vendas para clínica nesse visual.
---

# Molde: Guia da Avaliadora

Pasta: `moldes/guia-avaliadora/`. Campos no `README.md`.

1. Escreva o guia em `dados.json` com o protocolo que o usuário mandou. Falas curtas e prontas para dizer; não invente diferenciais da clínica (garantia, aparelhos, prazos) que não vieram. Afirmações clínicas precisam estar corretas e em linguagem simples.
2. Gere: `npm install` (1ª vez) e `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]`. Precisa terminar com ✓; se uma página não couber, divida.
3. Confira os PNGs, envie os dois PDFs (A6 e impressão A4) e atualize a galeria principal (seção "Galeria" do `CLAUDE.md`).

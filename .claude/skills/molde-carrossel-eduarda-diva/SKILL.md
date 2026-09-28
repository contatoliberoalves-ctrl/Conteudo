---
name: molde-carrossel-eduarda-diva
description: Gera carrosséis no molde "Carrossel Eduarda Diva", da Eduarda Caraciolo (advogada e professora de Direito Civil para a OAB), com capas quase iguais às referências dela: filme (foto com granulado, título condensado gasto, emojis e caixa preta), diva (título arredondado 3D branco e rosa sobre foto de diva pop) e recorte (estilo Estúdio Huna, papel quadriculado, caixas roxas e a Eduarda recortada). Use quando pedirem "capa de diva", "divas escolhem direito", "estilo phanystudio", "estilo Huna" ou um carrossel pop de OAB 2ª fase de Civil da Eduarda.
---

# Molde: Carrossel Eduarda Diva

Pasta: `moldes/carrossel-eduarda-diva/`. Leia o `README.md` e um post de `dados.json`.

1. Escolha a capa: `capaFilme` (foto da Eduarda, pessoa à direita), `capaDiva` (foto de diva pop mandada pelo usuário) ou `capaRecorte` (PNG recortado da Eduarda).
2. Conteúdo: a linha editorial dela é caso pop → regra de Civil → aplicação na OAB (`materiais/README.md`, seção da Eduarda). Dados da prova só da análise dos exames 2 a 46; nada inventado. Até ~40 palavras por caixa preta.
3. Fotos fora do git; fotos de artistas só as que o usuário mandar.
4. Gere com `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>` (tem que dar ✓) e confira: título sem cobrir o rosto, emojis sem cobrir texto, acentos inteiros.
5. Atualize a galeria (seção "Galeria" do `CLAUDE.md`, mesmo link) e faça commit.

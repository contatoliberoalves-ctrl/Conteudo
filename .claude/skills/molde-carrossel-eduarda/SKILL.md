---
name: molde-carrossel-eduarda
description: Gera carrosséis de Instagram no molde "Carrossel Eduarda", da Eduarda Caraciolo (Advogada · Direito Civil e ECA): Linha Clara rosé com Gilda Display (capas, cards, checklist, item numerado, questão, gabarito, QR code, CTA com foto) e Linha Escura em Anton para cultura pop (etapas, tabela, número, comparativo, fluxograma). Use quando pedirem carrossel/post para a Eduarda, "molde Eduarda", ou conteúdo de Direito Civil, Sucessões, Família ou ECA nesse visual.
---

# Molde: Carrossel Eduarda

Pasta: `moldes/carrossel-eduarda/`. O visual está em `template.mjs` e **não deve ser alterado** para gerar posts; só se edita `dados.json` (e `fotos/`, `imagens/`). Campos de cada modelo: `README.md` da pasta.

## Passo a passo

1. Leia `moldes/carrossel-eduarda/README.md` e um post parecido em `dados.json`.
2. Escolha a estrutura:
   - **3 páginas:** capa (L01/L02) → conteúdo (L04/L05) → CTA (L12/L13/L16).
   - **7 páginas, lista:** L01 (com `numero`) → 5× L14 → L16.
   - **7 páginas, questões:** L02 → L10 → L10 → L12 → L11 → L07 → L13.
   - **7 páginas, cultura pop:** D01 → D02 → D03 → D04 → D05 → D06 → D07.
   - **10 páginas, guia:** L02 → L03 → L04 → L05 → L06 → L08 → L09 → L15 → L07 → L16.
3. Acrescente um bloco em `dados.json` (`id` em kebab-case sem acento, `titulo`, `slides`).
   - Use o texto do usuário literalmente; só resuma se ele pedir.
   - No máximo ~60 palavras por slide; passou disso, divida em dois.
   - Alterne fundos (claro, rosé, card) para dar ritmo; **nunca dois slides rosé (L05, L15) seguidos**.
   - Destaques: `**negrito**` e `==rosé==` (nos títulos, ex.: `"Herdeiros ==necessários=="`).
   - Não misture as duas linhas no mesmo carrossel.
4. Limites que cabem no layout:
   - L01 título até ~50 caracteres; `destaque` até ~60.
   - L02 `palavra` de 1 a 2 palavras curtas (encolhe sozinha se passar da largura).
   - L05 até 4 itens de ~20 palavras; L14 até 3 itens; L11 até 3 questões com comentário de ~35 palavras.
   - L10: enunciado até ~80 palavras e 4 alternativas curtas; enunciado maior, divida em dois slides.
   - L07 `etiqueta` em uma linha (até ~22 caracteres).
   - Linha Escura: títulos de 2 a 4 palavras por linha, texto até ~40 palavras.
5. Imagens: coloque em `fotos/` (fotos da Eduarda, **nunca vão para o git**: o repositório é público) ou `imagens/` (ilustrações com direito de uso). Stills de filmes/séries também ficam em `fotos/`. Nomes esperados: `eduarda-recorte.png` (L01), `eduarda-cta.jpg` (L16), `avatar.jpg` (assinatura). Se faltarem, peça ao usuário (link do Drive); sem elas o slide sai com espaço reservado tracejado.
6. Gere: `cd moldes/carrossel-eduarda && npm install` (1ª vez) e `node render.mjs <id>`.
   - No ambiente em nuvem do Claude Code: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>`.
7. Leia os avisos do render ("o texto não cabe" → encurte ou divida) e confira os PNGs de `saida/<id>/`, pelo menos a capa e o slide mais longo.
8. Atualize a galeria (seção "Galeria" do `CLAUDE.md`) e faça commit de `dados.json`.

## Revisão de conteúdo

Os textos são jurídicos: mantenha artigos e gabaritos exatamente como no material do usuário. Se algo parecer errado, corrija só com certeza e **avise o usuário** listando cada ajuste.

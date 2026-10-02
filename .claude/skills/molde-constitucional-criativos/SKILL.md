---
name: molde-constitucional-criativos
description: Gera criativos de anúncio/divulgação (tela única) do @constitucionalgabaritado em feed 1080×1350 e stories 1080×1920, nas cores do perfil (verde, base escura, Bebas Neue + Poppins), com foto do autor: manchete, etiquetas de story nativo, nota do iPhone, tweet, oferta com preço e lista de benefícios. Use quando pedirem criativo, anúncio, ad ou story de divulgação de curso/reforço/produto do Constitucional Gabaritado.
---

# Molde: Constitucional Criativos (@constitucionalgabaritado)

Pasta: `moldes/constitucional-criativos/`. O visual está em `template.mjs`; para criar, só se edita `dados.json`. Leia o `README.md`.

## Passo a passo

1. Fotos do autor: `../carrossel-explicativo/fotos/` (fora do git). Sem elas, peça o link do Drive e rode o `recortar_fotos.py` de lá. Escolha olhando a foto: expressão que combine com a copy, fundo que não brigue com o verde (evite os estúdios roxos de outras marcas).
2. Escreva a copy: gancho forte na 1ª linha, uma ideia por criativo, CTA claro. Use o texto do usuário (ofertas, preços, benefícios) **exatamente**; não invente preço, desconto, número de alunos, depoimento nem prazo.
3. Crie o item de feed e o de stories (`"de": "<id-feed>"`, `"formato": "story"`).
4. Gere: `cd moldes/constitucional-criativos && CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>` (precisa terminar com ✓) e confira os PNGs (rosto livre do texto; nos stories, nada importante nas faixas de cima e de baixo).
5. Atualize a galeria (seção "Galeria" do `CLAUDE.md`, mesmo link) e faça commit.

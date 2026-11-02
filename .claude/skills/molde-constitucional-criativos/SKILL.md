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

## Divulgação da plataforma (antigo molde "Plataforma (divulgação)")
Carrosséis e cards que divulgam a plataforma Constitucional com Líbero (Reforço) com prints dela ficam em `moldes/constitucional-criativos/plataforma/` (leia o `README.md` de lá) e aparecem na galeria dentro de Constitucional Criativos.
1. Prints em `plataforma/prints/` (fora do git): baixe da pasta do Drive indicada no README e rode `python3 recortar_prints.py <pasta>`.
2. Os posts são funções em `plataforma/render.mjs` (`POSTS`); o id vai em `plataforma/dados.json`.
3. Só afirme o que aparece nos prints. Sem quantidade de aulas nem de questões ("diversas aulas", "banco de questões completo"); números dos prints borrados. Sem preço sem confirmação.
4. Gere com `cd moldes/constitucional-criativos/plataforma && node render.mjs <id>` (nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY`).

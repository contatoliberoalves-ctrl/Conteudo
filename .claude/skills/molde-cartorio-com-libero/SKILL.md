---
name: molde-cartorio-com-libero
description: Gera peças digitais (capa de produto, banner de checkout, thumbnails em tamanho livre) da plataforma Cartório com Líbero, de preparação para o ENAC e concursos de cartório, na identidade do insta pessoal do Líbero (navy, azul, Big Shoulders, granulado, anéis e dourado discreto). Use quando pedirem capa, banner, card de checkout ou peça de produto do "Cartório com Líbero", "ENAC" ou "Cronograma ENAC".
---

# Molde: Cartório com Líbero

Pasta: `moldes/cartorio-com-libero/`. Não confundir com os `cartorio-*` (o cartório de Curral Queimado, em outra identidade).

1. Leia `moldes/cartorio-com-libero/README.md` e as peças de `dados.json`.
2. Acrescente a peça no fim de `dados.json` com `layout` (`capa` ou `banner`), `w`/`h` exatos do pedido, `linhas` (a palavra-chave entre `[[ ]]`), `assinatura` e os campos do layout.
3. Gere: `cd moldes/cartorio-com-libero && CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>`. Tem de terminar com ✓; confira o PNG (o tamanho sai exato) e mande também o `1@2x.png`.
4. O autor pediu "o estilo que ele gosta": identidade do insta pessoal (Big Shoulders, navy/azul, granulado em `assets/grao.png`, anéis), com dourado no lugar do vermelho. Nada de martelo, balança em destaque, fotos de pessoas, preço, botão ou promessa de aprovação.
5. Atualize a galeria principal e faça commit.

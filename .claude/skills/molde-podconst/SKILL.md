---
name: molde-podconst
description: Gera posts no molde "PodConst" (podcast do Líbero Filho e da Natália Valença): azul/navy/magenta/amarelo, títulos Bebas Neue, carrosséis de 10 páginas (dados e argumentos, lista numerada, storytelling, método e prova social) e telas únicas (aviso/urgência, anúncio/isca). Use quando pedirem post do PodConst, da dupla Líbero e Natália, ou "molde PodConst".
---

# Molde: PodConst

Pasta: `moldes/podconst/`. O visual é o kit do autor em `kit/Moldes PodConst.dc.html`; leia o `README.md` do molde.

## Passo a passo

1. Escolha o formato: 1a dados e argumentos, 1b lista numerada, 1c storytelling, 1d método e prova social (10 páginas) ou 1e aviso/urgência, 1f anúncio/isca (tela única).
2. No HTML do kit, copie as telas desse grupo com um prefixo novo (`2a-01`…), trocando `data-screen-label` e os ids dos `<image-slot>` (precisam ser únicos). Troque só os textos; mantenha estilos, cores e tamanhos. Textos com o mesmo tamanho dos originais cabem; mais longos, encurte.
3. Acrescente em `dados.json`: `{"id", "grupo": "2a", "titulo", "tema", "fotos": {"<slot>": "arquivo"}}`. Fotos da dupla ficam em `fotos/` (fora do git; o repositório é público). Pessoas recortadas: PNG sem fundo.
4. Gere (`CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>`), precisa terminar com ✓. Confira os PNGs.
5. Atualize a galeria (seção "Galeria" do `CLAUDE.md`, sempre no mesmo link) e faça commit.

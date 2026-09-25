---
name: molde-carrossel-infinito
description: Gera carrosséis de Instagram no molde "Carrossel Infinito" do @constitucionalgabaritado (5 a 7 slides ligados por um trilho contínuo e figuras/fotos que atravessam a divisão entre slides; temas escuro, claro e menta). Use quando pedirem um "carrossel infinito", slides conectados/panorâmicos, ou um carrossel com um tópico por slide, macete, comparação e resumo de bolso.
---

# Molde: Carrossel Infinito

Pasta: `moldes/carrossel-infinito/`. O visual está em `template.mjs` e **não deve ser alterado** para gerar posts; só se edita `dados.json`.

## Passo a passo

1. Leia `moldes/carrossel-infinito/README.md` (campos) e um carrossel de `dados.json` como exemplo.
2. Acrescente um objeto em `dados.json` seguindo a estrutura narrativa:
   1. `cover`: gancho + macete ou promessa;
   2. conceito (`text` ou `compare`);
   3. um tópico por slide (`item`, `list`, `mnemo` ou `text`), com `tip` ("Pegadinha") quando couber;
   4. `cta` com resumo de bolso e pedido de salvar, comentar ou enviar.
   - Tom direto, para OAB e concursos; **sempre cite artigo e inciso da CF/88**; frases curtas.
   - Se o conteúdo vier de um material do autor (`materiais/README.md`), use o texto dele; não invente jurisprudência nem enunciados.
   - Temas alternados (`dark`/`light`/`mint`), nunca dois iguais seguidos. Alterne `rail` (`solid`/`dashed`) e `shape` entre carrosséis.
   - `link: "photo"` só se houver imagem em `imagens/` (fora do git); sem arquivo, o slide sai com o quadro tracejado da sugestão (`ph`), que serve só de rascunho.
3. Gere: `cd moldes/carrossel-infinito && node render.mjs <id>` (no ambiente em nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>`). Na primeira vez, `npm install` (ou use o `node_modules` de outro molde).
4. O script precisa terminar com ✓. Se avisar que o conteúdo passa da altura, sai da coluna ou encosta numa figura, encurte o texto daquele slide (ou divida em dois) e gere de novo. Confira os PNGs.
5. Atualize a galeria (seção "Galeria" do `CLAUDE.md`, sempre no mesmo link) e faça commit de `dados.json`.

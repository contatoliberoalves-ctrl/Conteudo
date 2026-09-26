---
name: molde-carrossel-eduarda-moderno
description: Gera carrosséis de Instagram no molde "Carrossel Eduarda Moderno", da Eduarda Caraciolo (Advogada · Direito Civil e ECA), nas direções modernas do kit dela: 1a Editorial (papel, Instrument Serif), 1b Blocos (rosé, grotesca pesada) e 1c Noir (escuro, arcos, Cormorant). Use quando pedirem um carrossel da Eduarda com "visual moderno" ou citarem 1a, 1b ou 1c. Os modelos L01–L16 e D01–D07 ficam no molde Carrossel Eduarda.
---

# Molde: Carrossel Eduarda Moderno

Pasta: `moldes/carrossel-eduarda-moderno/`. O visual está em `template.mjs` e **não deve ser alterado** para gerar posts; só se edita `dados.json`.

## Passo a passo

1. Leia `moldes/carrossel-eduarda-moderno/README.md` e um carrossel de `dados.json`.
2. Escolha a `direcao` (1a, 1b ou 1c; se não pedirem uma, alterne com os posts anteriores) e monte: `capa` → 3 a 6 `item` → `resumo` → `cta`.
   - **Texto do usuário literalmente**; só resuma se pedirem. No máximo cerca de 60 palavras por slide; passou disso, divida.
   - Em cada título, marque uma palavra com `*…*` (é o itálico de destaque das três direções). No item, o último parágrafo sai em destaque: deixe nele a ação ("treine…", "compare…") com 1 trecho em `**negrito**`.
   - Sem contador de páginas.
3. Fotos da Eduarda: `fotos/` ou `../carrossel-eduarda/fotos/`, fora do git (o repositório é público). Se faltarem, peça o link do Drive ao usuário.
4. Gere: `cd moldes/carrossel-eduarda-moderno && CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>`. Tem que terminar com ✓, ou só com avisos de foto pendente. Se o texto não couber, encurte ou divida. Confira os PNGs.
5. Atualize a galeria (seção "Galeria" do `CLAUDE.md`, sempre no mesmo link) e faça commit de `dados.json`.

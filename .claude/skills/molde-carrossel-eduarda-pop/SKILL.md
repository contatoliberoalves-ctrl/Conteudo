---
name: molde-carrossel-eduarda-pop
description: Gera carrosséis de Instagram no molde "Carrossel Eduarda Pop", da Eduarda Caraciolo (Advogada · Direito Civil e ECA), em 4 estilos de Instagram atual: trend e studio (modernos) e scrap e blocos (descontraídos: balões de fala, legenda rosa sobre foto, faixas coloridas). Use quando pedirem um carrossel da Eduarda "mais moderno", "descontraído", "de trend", com "legenda em cima da foto", "balão de fala" ou citarem trend, studio, scrap ou blocos.
---

# Molde: Carrossel Eduarda Pop

Pasta: `moldes/carrossel-eduarda-pop/`. O visual está em `template.mjs`; para gerar posts só se edita `dados.json`.

**Regra da marca:** só as 5 cores da paleta (`#FFEBED`, `#FEBAC5`, `#F4789A`, `#FC79AB`, `#FEA9AC`) + branco, e as 3 fontes do molde (Inter Tight, Gloock, Yellowtail). Não traga cor nem fonte nova; os estilos têm que ornar lado a lado no feed.

## Passo a passo

1. Leia `moldes/carrossel-eduarda-pop/README.md` e o post de exemplo do estilo escolhido em `dados.json`.
2. Escolha o `estilo`: moderno → `trend` (didático, listas) ou `studio` (reflexivo, para clientes); descontraído → `scrap` (conversa com a seguidora, balões, legenda sobre foto) ou `blocos` (explicação passo a passo, um fundo por slide). Se não pedirem um, alterne com os posts anteriores.
3. Monte 4 a 8 slides: capa → conteúdo (`texto`, `lista`, `item`, `legenda`, `dica`…) → `cta`/`pergunta`.
   - **Texto do usuário literalmente**; só resuma se pedirem. Até ~45 palavras por slide (legenda: ~20); passou disso, divida.
   - Conteúdo jurídico com artigo de lei conferido; nada de dado, estatística ou depoimento inventado.
   - No título, marque 1 trecho com `*…*`, `==…==` ou `{…}` (é o destaque de cada estilo).
   - Sem contador de páginas.
4. Fotos da Eduarda ficam em `fotos/` (fora do git: repositório público); se faltarem, peça o link do Drive. Sem elas, use as CC0 de `imagens/` (legenda e capa do studio pedem foto vertical).
5. Gere: `cd moldes/carrossel-eduarda-pop && CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>`. Tem que terminar com ✓. Confira os PNGs (texto sobre rosto na legenda? mude `y` ou `fotoPos`).
6. Atualize a galeria (seção "Galeria" do `CLAUDE.md`, sempre no mesmo link) e faça commit de `dados.json`.

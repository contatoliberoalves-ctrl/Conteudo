---
name: molde-carrossel-libero
description: Gera carrosséis de Instagram no molde "Carrossel Libero", do perfil pessoal @liberofilho (azul/off-white/navy, textura granulada, títulos em Big Shoulders, tom bem-humorado com analogias). Use quando pedirem post ou carrossel para o @liberofilho, "meu insta pessoal", "perfil pessoal" ou "molde Libero". Posts do @constitucionalgabaritado vão nos outros moldes.
---

# Molde: Carrossel Libero (@liberofilho)

Pasta: `moldes/carrossel-libero/`. O visual está em `template.mjs` e **não deve ser alterado** para gerar posts; só se edita `dados.json`.

## Passo a passo

1. Leia `moldes/carrossel-libero/README.md` (tipos de slide e campos) e um carrossel de `dados.json` como exemplo.
2. Acrescente um objeto em `dados.json` com 6 a 10 slides, nesta estrutura:
   1. `capa`: pergunta ou tema provocativo (tipográfica, ou com `foto`);
   2. gancho: uma analogia ou situação do dia a dia (`texto`, quase sempre com `palavra` vertical);
   3. explicação: conceito, `lei` com tradução, `lista`, `impacto`, `frases` ou `balao`;
   4. `cta`: pergunta para comentar, seguir ou enviar, com `botao` e, se houver, `foto` (polaroide).
   - **Texto do usuário como veio**: só corrija erros de digitação. Sem texto do usuário, escreva no tom do perfil (didático, bem-humorado, falando com "você") e cite artigos com exatidão. Em `citacao`, copie a lei literalmente.
   - Alterne os fundos, nunca 3 iguais seguidos. Destaque de 1 a 3 trechos por slide com `**...**`.
   - Fotos: use as do autor (`fotos/` do molde ou `../carrossel-explicativo/fotos/`). O repositório é **público**: fotos nunca vão para o git. Uma foto de objeto (PNG sem fundo) pode ser pedida ao usuário. Nunca desenhe ilustrações.
3. Gere: `cd moldes/carrossel-libero && node render.mjs <id>`. No ambiente em nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>`.
4. O script precisa terminar com ✓. Se avisar que o texto não cabe ou encosta em algo, encurte ou divida o slide. Confira os PNGs.
5. Atualize a galeria (seção "Galeria" do `CLAUDE.md`, sempre no mesmo link) e faça commit de `dados.json`.

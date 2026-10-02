---
name: molde-argumenta-libero
description: Gera carrosséis e cards únicos (1080×1350) no molde "Argumenta com Líbero", do projeto de provas discursivas do Líbero (verde-escuro, menta e branco; títulos com a 2ª parte em verde, cards do app, 5 etapas, respostas antes x depois, prints do app). Use quando pedirem post, carrossel ou card do "Argumenta", "Argumenta com Líbero", provas discursivas ou argumentação nesse visual.
---

# Molde: Argumenta com Líbero

Pasta: `moldes/argumenta-libero/`. O visual está em `template.mjs`; para gerar posts, só se edita `dados.json`.

## Passo a passo

1. Leia `moldes/argumenta-libero/README.md` e um post de `dados.json` como exemplo (há 2 cards únicos e 2 carrosséis).
2. Fotos: `logo.png` e os prints do app ficam em `fotos/` (fora do git; o repositório é público). Numa sessão nova, peça o link da pasta do Drive com os prints e recorte de novo (o logo é o canto superior esquerdo da tela do treino guiado).
3. Acrescente um post em `dados.json`:
   - **Carrossel temático** (argumentação): `capa` → o erro (`resposta` com status `errado`) → o método (`cards`) → um slide por ideia (`texto`) → antes x depois (`resposta`) → `checklist` → `cta`.
   - **Carrossel do projeto**: `capa` com `logo` e `print` → problema → `etapas` → `print` de cada etapa → `cards` do laboratório → `cta` com `logo`.
   - **Card único**: 1 slide `quiz` ou `capa` com `unico: true` (e `print`, se quiser).
   - Títulos em 2 tons: 1ª linha normal, 2ª em `{{verde}}`. Alterne `verde`, `branco` e `menta`.
   - Conteúdo jurídico exato (artigo, inciso, súmula); não invente enunciados de prova nem números. Textos sobre o app: use os do próprio app (prints). A palavra do CTA ("Comenta ARGUMENTA") é a padrão: confirme com o usuário.
4. Gere: `cd moldes/argumenta-libero && CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>`. Precisa terminar com ✓ (se o texto encostar no balão do fundo, tire `balao` ou troque o canto).
5. Confira os PNGs, atualize a galeria (seção "Galeria" do `CLAUDE.md`, sempre no mesmo link) e faça commit.

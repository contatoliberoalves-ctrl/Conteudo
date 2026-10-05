---
name: molde-cg-passos
description: Gera carrosséis no molde "Passo a passo" do @constitucionalgabaritado (rito em etapas com trilha numerada e quórum em destaque: PEC, impeachment, processo legislativo, veto, ADI). Use quando pedirem passo a passo, rito, procedimento, etapas ou quórum de um processo constitucional.
---

# Molde: Passo a passo

Pasta: `moldes/cg-passos/`. Visual em `template.mjs` e `../cg-comum/base.mjs`; para criar, edite só `dados.json`. Leia o `README.md`.

1. Preencha `etapas` (3 a 5: nome, quórum, resumo) e os slides: `capa` → um `etapa` por etapa → `trilha` → `lista` (limites) ou `pegadinha` → `cta`. Alterne `gelo` e `verde`.
2. Quóruns e prazos com o artigo exato; nada de estatística inventada.
3. Gere: `cd moldes/cg-passos && CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>` (✓), confira, atualize a galeria e faça commit.

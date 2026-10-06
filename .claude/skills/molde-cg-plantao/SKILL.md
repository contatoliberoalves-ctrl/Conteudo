---
name: molde-cg-plantao
description: Gera carrosséis no molde "Plantão Constitucional" do @constitucionalgabaritado (Direito Constitucional no noticiário: capa com selo do plantão, título em faixa verde, pergunta em pílula e recortes PB das autoridades ou desenho do Congresso/STF/Planalto). Use quando pedirem post sobre notícia, atualidade, eleição de Mesa, linha sucessória, CPI, impeachment ou "plantão" para o Constitucional Gabaritado.
---

# Molde: Plantão Constitucional

Pasta: `moldes/cg-plantao/`. Visual em `template.mjs` e `../cg-comum/base.mjs`; para criar, edite só `dados.json`. Leia o `README.md`.

1. Estrutura: `capa` (pergunta da notícia) → o que a CF diz (`destaque`, `lei`, `linha`) → `pegadinha` → `cta`. Cerca de 6 slides, alternando `verde` e `gelo`.
2. Fatos: só o que está na Constituição, na lei ou em decisão do STF que você conheça com segurança; cite artigo/decisão. Não invente nomes, datas ou resultados de eleições: notícia do dia vem do usuário.
3. Capa: `icone` (congresso, stf, planalto, cpi, relogio, escudo, sirene, passaporte) ou `fundo` com arte de IA gerada pelo usuário (prompts em `moldes/cg-plantao/PROMPTS-CAPAS.md`; acrescente o prompt de cada post novo lá). Comparações: tipo `versus`.
4. Fotos de autoridades: recortes PNG sem fundo em `fotos/` (fora do git), pedidos ao usuário; sem eles, use `icone`.
5. Gere: `cd moldes/cg-plantao && CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>` (precisa terminar com ✓), confira os PNGs, atualize a galeria (seção "Galeria" do `CLAUDE.md`) e faça commit.

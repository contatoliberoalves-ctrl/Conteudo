---
name: molde-libero-aula
description: Gera slides de AULA (16:9, 1920×1080) no molde "Libero Aula" do @liberofilho, de uso geral, na identidade do Carrossel Libero, com capas em 8 estilos (clássica, foto recortada, duas metades, número gigante, fita de atenção, mural de artigos, branca de miniatura e prova corrigida) e slides de tópico, lista, cards, barras, tabela, passos, frase e CTA. Use quando pedirem aula, slides, vídeo ou capa/miniatura de vídeo no "insta pessoal" que não sejam teses que caíram (Dossiê), comparação (Duelo) ou requisitos (Requisitos).
---

# Molde: Libero Aula

Pasta: `moldes/libero-aula/`. Para gerar aulas, edite só `dados.json` (o visual está em `template.mjs`).

1. Leia `moldes/libero-aula/README.md` e uma aula de exemplo em `dados.json`.
2. Monte a aula: `capa` (escolha um `estilo` que ainda não foi usado nas aulas recentes) → conteúdo (alterne `topico`, `lista`, `cards`, `barras`, `tabela`, `passos`, `frase`) → `cta`. Temas alternados, nunca 3 iguais seguidos.
   - Dados e números: só de fonte conferida (padrões de resposta da FGV, tabela de teses do `libero-pdf`, lei). Sem jurisprudência, salvo pedido.
   - Capas com foto: recorte a foto (README) e confira se ficou profissional; o rosto não pode ficar atrás do título.
3. Gere: `cd moldes/libero-aula && CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>` (tem que terminar com ✓) e confira os PNGs.
4. Atualize a galeria (`python3 galeria/atualizar.py libero-aula <id>`, Galeria do Líbero) e faça commit de `dados.json` (nunca das fotos).

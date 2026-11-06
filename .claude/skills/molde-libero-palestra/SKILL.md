---
name: molde-libero-palestra
description: Gera slides de palestra ou capacitação 16:9 em PDF no molde "Libero Palestra", na identidade pessoal do @liberofilho (azul, off-white, navy, Big Shoulders), com camada didática e gamificada (fases com barra de progresso, missões, desafio relâmpago com questão e resposta, power-ups com prompts de IA, memes em polaroide). Use quando pedirem slides/PDF de palestra, aula para alunos, capacitação ou workshop "na minha id pessoal", gamificado ou didático.
---

# Molde: Libero Palestra

Pasta `moldes/libero-palestra/`. Leia o `README.md` (tipos de slide e campos) e use `palestras/enade-ftc-2026.json` como exemplo.

1. Crie `palestras/<id>.json` com `fases` (4 a 6) e os slides: capa → mapa → para cada fase um `fase` seguido dos slides de conteúdo → `fim`. Alterne fundos (azul, off, navy) e coloque uma `missao` (ação do aluno) em parte dos slides.
2. Conteúdo só do material do usuário; dados com `fonte`. Questões e respostas-modelo autorais devem vir marcadas como treino. Memes: só os que o usuário mandou (em `memes/`, fora do git), um ou outro.
3. Gere (`CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>`), precisa terminar com ✓; se avisar que passou da página, baixe o `zoom` daquele slide. Confira os PNGs.
4. Mande o PDF (SendUserFile) e faça commit do JSON (sem fotos/memes).

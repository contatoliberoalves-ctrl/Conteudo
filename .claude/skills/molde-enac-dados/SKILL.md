---
name: molde-enac-dados
description: Gera vídeos (reels 1080×1920 com gráficos animados, narração e trilha), capas de vídeo e posts de pergunta (1080×1350) do perfil ENAC em dados (@enacemdados), que conta o Exame Nacional dos Cartórios em números, na identidade tinta/osso/lima com a grade de 100 quadrados. Use quando pedirem vídeo, reels, capa, post, legenda ou "dados" do ENAC em dados, ou estatística de uma prova do ENAC (distribuição por matéria, divergência de gabaritos, recursos, nota de corte).
---

# ENAC em dados

Pasta: `moldes/enac-dados/` (campos e layouts no `README.md` de lá; identidade em `identidade.mjs`).

## Regras do perfil

- Toda peça parte de um número conferido. Conte no material que o usuário mandou (gabarito, edital, resultado); não estime. Classificação feita por nós (ex.: especialidade de cada questão) vai avisada na legenda.
- A fonte do dado fica no rodapé ("Fonte: gabaritos extraoficiais"). Não cite o nome de cursos de terceiros nas peças.
- Gabarito extraoficial é provisório: diga isso na legenda e não trate nota como definitiva.
- Lima é o dado, coral só para dúvida, divergência e recurso. Um número grande por tela. Sem emoji e sem pílulas.
- A narração usa um locutor da biblioteca da ElevenLabs (padrão "Paulo Radames"). Não use a voz clonada do Líbero neste perfil: ele pediu assim.
- Posts de tela única usam o layout `direto`: uma frase gigante, no máximo um número e uma linha de chamada, alternando o fundo (tinta, lima, osso). Sem etiqueta, subtítulo, cartões ou lista longa: o Líbero achou a versão cheia de texto "com cara de IA". O detalhe vai na legenda.
- Vídeos e capas seguidos não usam o mesmo tema: alterne `noite`, `papel` e `lima` (campo `tema`), porque o Líbero achou que pareciam o mesmo vídeo.
- Toda peça termina numa pergunta para quem fez a prova comentar.
- A numeração das questões muda conforme o tipo de prova (as letras não): cite o tema e o número em cada tipo.

## Como gerar

1. Telas: edite `dados.json` (post novo no fim) e rode `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]`. Confira o PNG.
2. Vídeos: acrescente o vídeo em `VIDEOS` no `videos.mjs` (5 cenas, 35 a 45 s; números por extenso no campo `fala`). Confira antes com `PREVIEW=3,10,20 node videos.mjs <id>` (não gasta narração) e só então gere. `pip install numpy scipy` se faltar. Entregue o `.mp4` e o `-sem-voz.mp4` com SendUserFile, pois `saida/` fica fora do git.
3. Legenda e hashtags de cada peça em `legendas.md`.
4. Atualize a galeria (seção "Galeria" do `CLAUDE.md`).

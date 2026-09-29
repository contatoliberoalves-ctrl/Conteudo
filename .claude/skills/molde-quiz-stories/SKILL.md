---
name: molde-quiz-stories
description: Gera stories de quiz CERTO OU ERRADO (1080×1920, pergunta + gabarito) no molde "Quiz Stories" do @constitucionalgabaritado, na identidade do Carrossel Infinito. Use quando pedirem quiz, "certo ou errado", stories de perguntas ou gabarito para os stories.
---

# Molde: Quiz Stories

Pasta `moldes/quiz-stories/`. O visual está em `template.mjs` e não deve ser alterado para gerar posts: só edite `dados.json`. Leia o `README.md` do molde.

1. Um post por quiz, numerado em sequência (`quiz-51`, `quiz-52`…): afirmação curta (até ~35 palavras) com o ponto-chave em `**negrito**`, gabarito `certo` ou `errado`, explicação de 1 ou 2 frases e o fundamento exato (artigo da CF/88, súmula ou lei).
2. Conteúdo só do material do autor (`materiais/README.md`) e do que já está nos moldes; nunca invente estatística, tese ou enunciado. Nas afirmações erradas, a explicação diz qual é a regra certa.
3. Equilibre certos e errados e varie os temas.
4. Gere (`CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>`); precisa terminar com ✓. Confira os PNGs.
5. Atualize a galeria (seção "Galeria" do `CLAUDE.md`, mesmo link) e faça commit.

---
name: molde-post-eduarda
description: Gera posts de TELA ÚNICA (1 imagem 1080×1350) no molde "Post Eduarda", da Eduarda Caraciolo (Advogada · Direito Civil e ECA). Layouts: frase (frase curta gigante com palavra final em cursiva, fundo liso, até 2 fotos redondas) e convite ("Comenta X que eu te mando", cartão com borda de selo e conversa de direct). Use quando pedirem post único, frase, citação ou chamada para comentar da Eduarda.
---

# Molde: Post Eduarda

Pasta: `moldes/post-eduarda/`. Para gerar posts só se edita `dados.json`. Mesma regra de marca do Carrossel Eduarda Pop: 5 cores da paleta + branco, Inter Tight e Yellowtail.

1. Leia `moldes/post-eduarda/README.md`.
2. **frase**: 2 a 4 linhas curtas em minúsculas + `fim` (1 a 2 palavras, a virada da frase). **convite**: manchete com um trecho `{rosa}`, texto curto, a `palavra` para comentar e 2 mensagens de exemplo na `conversa`. Só prometa material que a Eduarda tenha de fato.
3. Fotos da Eduarda em `fotos/` (fora do git); se faltarem, peça o link do Drive.
4. Gere: `cd moldes/post-eduarda && CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>`. Tem que terminar com ✓ (se o `fim` for longo, baixe `fimEscala` ou `ts`). Confira o PNG.
5. Atualize a galeria (seção "Galeria" do `CLAUDE.md`, sempre no mesmo link) e faça commit de `dados.json`.

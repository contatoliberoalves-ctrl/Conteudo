---
name: molde-post-libero
description: Gera posts de TELA ÚNICA (1 imagem 1080×1350) no molde "Post Libero", do perfil @liberofilho, no visual do Carrossel Libero. Layouts: dados (ranking/estatística em barras), material (material gratuito, "Comente #X pra receber"), pdf (PDF no direct, "Comente #X"), estrutura (estrutura da peça numa folha de petição) esqueleto (estrutura da peça em trilha), video e video-destaque (divulgar vídeo novo do YouTube com o print e "Comenta #AULA pra receber o link"), trecho (foto de um trecho de livro com pergunta no título e balão "Isso acontece com você?"). Use quando pedirem post único, "tela única", post de dados/ranking, post para divulgar material/PDF com hashtag para comentar, a estrutura de uma peça em uma imagem só, divulgar vídeo novo no canal ou postar um trecho de livro com uma pergunta. Carrosséis do @liberofilho vão no molde Carrossel Libero.
---

# Molde: Post Libero (tela única, @liberofilho)

Pasta: `moldes/post-libero/`. O visual está em `template.mjs` (usa as cores e fontes de `../carrossel-libero/template.mjs`) e **não deve ser alterado** para gerar posts; só se edita `dados.json`.

## Passo a passo

1. Leia `moldes/post-libero/README.md` e o post do mesmo layout em `dados.json`.
2. Escolha o layout:
   - `dados`: números de verdade, com `fonte`. Nunca invente estatística: use o material do autor ou os gabaritos da FGV e diga o período (ex.: "Exames 20 a 46").
   - `material`: nome do material no título, uma linha do que ele tem em `sub`, e a hashtag que o usuário pedir (em maiúsculas, com #).
   - `pdf`: tópicos reais do PDF em `itens` (a página só sugere as linhas de texto).
   - `video` / `video-destaque`: `print` com o print do vídeo em `moldes/post-libero/fotos/` (fora do git; peça ao usuário se não estiver lá). Título padrão "Vídeo novo no [[canal]]"; ajuste `playX`/`playY` se o play cobrir o rosto.
   - `trecho`: `print` com a foto do trecho em `moldes/post-libero/fotos/` (fora do git), `linhas` com a pergunta do título e `pergunta` no balão. Não invente autor/livro em `fonte`: só se o usuário disser. Confira se o balão não cobre as últimas linhas do trecho (ajuste `balaoY`/`printY`).
   - `estrutura` / `esqueleto`: só `"estrutura": "<id>"` com o id da peça em `moldes/estrutura-de-pecas/dados.json`; o texto vem de lá (é o do autor, não reescreva). Peça que não está lá: crie primeiro no molde Estrutura de Peças.
3. Texto curto: título com até 3 linhas, `sub` em uma linha. Destaque uma palavra com `[[...]]`.
4. Gere: `cd moldes/post-libero && CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>`. Tem que terminar com ✓; se o texto não couber ou encostar na apostila/página, encurte. Confira o PNG.
5. Atualize a galeria (`python3 galeria/atualizar.py post-libero <id>` e publique no mesmo link, ver `CLAUDE.md`) e faça commit de `dados.json`.

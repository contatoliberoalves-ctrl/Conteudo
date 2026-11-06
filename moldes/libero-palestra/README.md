# Libero Palestra (@liberofilho)

Slides de palestra/capacitação 16:9 (1920×1080) em PDF, na identidade pessoal (`moldes/libero-comum/identidade.mjs`: azul, off-white, navy, Big Shoulders + Schibsted Grotesk, granulado, anéis vermelhos), com camada **didática e gamificada**: HUD com a fase e a barra de progresso, mapa de fases, divisores de fase com "+ XP", caixas 🎯 Missão, ⚡ Desafio relâmpago (questão e resposta) e ⭐ Power-up (prompts).

Gerar: `ln -sfn ../libero-comum/node_modules node_modules` (1ª vez) e `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]` → `saida/<id>/<id>.pdf` e `saida/<id>/png/NN.png`. Avisa slide que passa da página (baixe `zoom` no slide).

## palestras/<id>.json
`{ titulo, selo (canto do HUD), fases: [nomes], slides: [...] }`. Em textos, `**negrito**` e `[[caixa]]`. Todo slide aceita `fundo` (azul, off, navy, branco), `missao`, `fonte` e `zoom` (escala do conteúdo).

Tipos: `capa` {pre, titulo[], sub, chips[], autor, foto, logo, ts} · `mapa` {titulo, texto} · `fase` {titulo[], texto, xp[]} (conta a fase) · `frase` {kicker, titulo[], texto} · `cards` {titulo, texto, cols, itens:[{icone, t, d, tag, tagCor}], tt, td} · `fluxo` {titulo, passos:[{t, d}], tp} · `numeros` {titulo, itens:[{n, rot, destaque} | {op}]} · `barras` {titulo, grupos:[{nome, barras:[{r, v, destaque}]}], max} · `tempo` {titulo, blocos:[{min, t}]} · `quiz` {tema, pergunta, alternativas[5], gabarito, resposta, justificativa} · `meme` {meme, memePos, legenda, titulo, texto, itens[]} · `compara` {titulo, colunas:[{rot, t, d}]} · `grade` {titulo, itens[], cols} · `prompt` {para, titulo, prompt} (`[trecho]` em amarelo) · `checklist` {titulo, itens[], cols, meme} · `fim` {titulo[], texto, foto}.

Fotos e memes ficam em `fotos/` e `memes/` (fora do git). A palestra `enade-ftc-2026` usa o recorte do Líbero e os memes extraídos da palestra anterior da UNIFTC (PDF enviado pelo usuário) e o sapo do PodConst (`moldes/podconst/kit/sapo.png`).

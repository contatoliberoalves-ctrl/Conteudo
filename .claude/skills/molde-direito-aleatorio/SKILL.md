---
name: molde-direito-aleatorio
description: Gera vídeos verticais para Reels (1080×1920, MP4) no molde "Direito Aleatório" do @constitucionalgabaritado, humor absurdo ligando um personagem ou assunto aleatório a um tema de Direito de verdade ("O que o Naruto teve a ver com a Constituição de 1988?"), com narração em IA, legenda palavra a palavra, fotos com zoom, números gigantes e trilha. Use quando pedirem vídeo, reels, "vídeo engraçado de Direito", "estilo Você Sabia / Peixonauta" ou "o que X teve a ver com Y".
---

# Molde Direito Aleatório (vídeo)

Pasta: `moldes/direito-aleatorio/`. Leia o `README.md` de lá para os campos do `dados.json` e a fórmula do roteiro.

## Passo a passo

1. **Roteiro.** Escolha o fato jurídico e confira cada data, número, artigo e nome (o absurdo é só o personagem). A piada começa logo depois da pergunta (sem bloco de explicação antes; o usuário já reprovou um roteiro com 15 s de contexto): pergunta, absurdo ligado a uma regra de verdade com os dados reais entrando no meio da história, bordão, desfecho real, "a parte do X é mentira, o resto cai na prova". 130 a 170 palavras.
2. **Cenas.** Quebre em falas de 4 a 10 palavras e dê uma imagem a cada uma, alternando foto, número e personagem (nunca mais de duas cenas seguidas do mesmo tipo). Marque com `[[ ]]` uma ou duas palavras-chave por fala. Vídeo novo vai no fim de `videos`.
3. **Imagens.** Fotos reais em `midia/`: domínio público ou CC BY (Agência Brasil, Agência Senado, Wikimedia Commons), com crédito em `midia/CREDITOS.md`. As imagens do personagem (cenas prontas em tela cheia, usadas como `img`, ou PNG de fundo transparente, usado como `personagem`) são enviadas pelo usuário e ficam em `midia/personagens/` (fora do git); sem elas, sai o boneco genérico. Não desenhe nem gere personagens de terceiros.
4. **Prévia.** `PREVIEW=1 CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node video.mjs <id>` e olhe `saida/<id>/previa/`: foco das fotos, número que não encosta na legenda, legenda legível.
5. **Vídeo.** O mesmo comando sem `PREVIEW`. Confira a duração e ouça/transcreva o áudio (números e nomes lidos certo; se a voz errar, escreva por extenso na `fala`).
6. Entregue `saida/<id>/<id>.mp4`, a `capa.jpg` e a legenda do post. Commit e push do `dados.json` e das fotos livres.

## Limites

- Legenda: blocos de até 3 palavras; palavra com mais de 16 letras fica sozinha na linha.
- `numero`: até uns 10 caracteres por linha (use `|` para quebrar e `tn` para fixar o tamanho).
- Vozes: `GET https://api.elevenlabs.io/v2/voices`. Padrão: narrador brasileiro. Para a voz clonada do Líbero, troque `voz` no `dados.json` (só com pedido dele).
- O molde não entra na galeria (ela mostra slides em PNG, não vídeo).

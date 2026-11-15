# Direito Aleatório (vídeos para Reels)

Vídeos verticais 1080×1920 de humor absurdo com Direito de verdade: um personagem "intruso" entra num fato
jurídico real ("O que o Naruto teve a ver com a aprovação da Constituição de 1988?"). Narração em IA
(ElevenLabs), legenda palavra a palavra sincronizada com a voz, uma imagem por fala (foto com zoom, número
gigante ou o personagem) e trilha sintetizada com efeitos. Identidade do @constitucionalgabaritado.

## Gerar

```bash
PREVIEW=1 node video.mjs [id]   # um quadro por cena em saida/<id>/previa/ (segundos)
node video.mjs [id,id]          # saida/<id>/<id>.mp4 + capa.jpg + roteiro.txt (uns 3 min por vídeo)
```

Na nuvem do Claude Code: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node video.mjs`.
Fora dela, defina `ELEVENLABS_API_KEY`. Precisa de `ffmpeg`, `curl` e `python3` com `numpy`.
A voz fica em cache em `saida/<id>/voz.*` e só é gerada (e cobrada) de novo se o texto, a voz ou a velocidade mudarem;
trocar imagem, foco ou número não gasta créditos.

## dados.json

Topo: `serie` (selo no canto), `perfil` (@ no rodapé), `voz` (id da voz no ElevenLabs), `velocidade` (0.7 a 1.2),
`trilha` (volume da música, 0 desliga). Cada vídeo pode sobrescrever esses campos.

Cada vídeo: `id`, `titulo`, `legenda` (texto do post, vai para o `roteiro.txt`), `capaEm` (segundo do quadro da capa) e `cenas`.

Cada cena é **uma fala e uma imagem**; a cena dura o tempo que a voz leva para dizer a fala:

| campo | o que faz |
|---|---|
| `fala` | texto narrado. `[[assim]]` pinta as palavras de verde na legenda |
| `img` | foto em `midia/` em tela cheia. `foco` (`"70% 50%"`) escolhe o trecho; `mov`: `kbIn`, `kbOut`, `kbPanD`, `kbPanE`; `pb: true` deixa em preto e branco |
| `fundo` | sem foto: `sol` (raios verdes), `degrade`, `escuro`, `papel`, `alerta` |
| `numero` | número ou palavra gigante (`\|` quebra a linha), com `rotulo` embaixo. `tn` fixa o tamanho; `cor: "alerta"`; `carimbo: true` |
| `personagem` | PNG com fundo transparente em `midia/personagens/`. `pos`: `centro`, `esq`, `dir`, `canto` (pequeno, sobre a foto) ou `clones` (com `clones: 9`); `tam` e `y` ajustam |

Personagem sem arquivo usa o boneco genérico `assets/ninja.svg`.

## Roteiro (a fórmula da referência)

1. **Pergunta absurda** (até 3 s): "O que X teve a ver com Y?"
2. **Contexto real**, sério, com data, número e nome (é o que cai na prova).
3. **Virada**: "O que quase ninguém comenta é a enorme participação de X."
4. **O absurdo** contado com cara séria, usando um traço conhecido do personagem preso a uma regra jurídica de verdade.
5. **Fala do personagem** (bordão).
6. **Desfecho real**: o que de fato aconteceu.
7. **Fecho**: "A parte do X é mentira. O resto cai na sua prova." Sempre avise o que é piada: o público estuda por esses vídeos.

Falas de 4 a 10 palavras (uma imagem a cada 2 ou 3 s), 130 a 170 palavras no total (50 a 70 s).
Todo dado jurídico precisa estar certo; só o personagem é inventado.

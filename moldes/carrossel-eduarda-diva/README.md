# Carrossel Eduarda Diva

Capas quase iguais às 3 referências que a Eduarda mandou (phanystudio, capa de novela "As divas escolhem direito." e Estúdio Huna), com os efeitos, e slides internos no mesmo clima. Fontes: Anton (condensada), Nunito 900 (arredondada 3D) e Poppins (texto); cores: fúcsia `#EE2A8A`, orquídea `#F29AD8`, roxo `#7A2CC7`, preto e papel.

```
CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]
```

## Tipos de slide
| tipo | campos |
|---|---|
| `capaFilme` | `foto`, `fotoPos` (deixe a pessoa à direita), `corTitulo` (padrão branco; use preto sobre fundo claro), `titulo` (linhas com `\n`; `{…}` sai em rosa), `ts`, `tituloY`, `direita`, `texto` (caixa preta), `caixaY`, `figurinhas` |
| `capaDiva` | `foto`, `fotoPos`, `titulo` (branco em 3D; `{…}` em rosa 3D), `ts`, `tituloY`, `figurinhas` |
| `capaRecorte` | `foto` (PNG recortado, sem fundo), `titulo` (`==…==` caixa roxa tracejada, `{…}` rosa), `ts`, `recorteAltura`, `recorteDireita`, `direita` |
| `texto` | `kicker`, `titulo`, `caixa` (texto na caixa preta), `caixaTam`, `figurinhas` |
| `lista` | `titulo`, `itens[]` (use `→` para "pista → peça"), `contagem[]` (troca o número da linha, ex.: vezes que caiu) |
| `dado` | `numero` (ex.: "8x"), `numeroTam`, `titulo`, `caixa` |
| `cta` | `titulo` (3D), `texto`, `botao`, `foto` (opcional) |

`figurinhas`: `[{"e": "💫", "x": 470, "y": 270, "s": 110, "r": -10}]` (emoji, posição em px, tamanho e rotação).

## Fotos
Fora do git. O render procura em `fotos/` e em `../carrossel-eduarda-pop/fotos/` (fotos da Eduarda e das divas). Recorte para a `capaRecorte`: `pip install "rembg[cpu]"` e `rembg` com o modelo `u2net_human_seg`; depois mantenha só a maior mancha (pedaços de mesa somem) e corte a margem (ver `eduarda-joinha-recorte.png`).

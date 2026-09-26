# Carrossel Libero (@liberofilho)

Carrossel do perfil pessoal do autor. Os slides têm 1080×1350 e usam os fundos `blue`, `light` e `dark`, com textura granulada. Títulos em Big Shoulders Display 900, em caixa alta; texto em Schibsted Grotesk. O tom é didático e bem-humorado, com analogias ("praga/dedetizador", "soneca/despertador") e falando direto com "você".

- `template.mjs`: visual. Não mexa para gerar posts.
- `render.mjs`: gera `saida/<id>/1.png … N.png` e `painel.png`. Diminui título e corpo até caberem e avisa quando o texto passa da área, encosta na foto, nos anéis ou no rodapé, ou quando há 3 fundos iguais seguidos.
- `dados.json`: um objeto por carrossel (`id`, `titulo`, `tema`, `slides`).
- `fotos/`: fotos do molde, fora do git. Sem a foto aqui, o render procura em `../carrossel-explicativo/fotos/`.

Gerar: `node render.mjs [id]`. No ambiente em nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]`.

## Slides

Todos têm `tipo` e `tema` (`blue`, `light` ou `dark`; nunca 3 iguais seguidos). Todos aceitam os opcionais `kicker`, `aneis` (anéis vermelhos nos cantos: `true`, ou `"baixo"` para o anel da esquerda mais embaixo), `fundoTexto` (tema repetido ao fundo) e `ts` (tamanho fixo do título). Nos textos, `**negrito**` sai em 800 (use em 1 a 3 trechos por slide). Nos títulos, `[[palavra]]` coloca a palavra numa caixa sólida.

| tipo | campos |
|---|---|
| `capa` | `pre` (pergunta ou pré-título), `titulo` (linhas), `foto` (opcional: foto inteira com degradê e texto embaixo; sem foto, a capa é tipográfica e centralizada), `texto` (opcional, só na capa sem foto) |
| `texto` | `titulo`, `texto` (parágrafos), `palavra` (palavra-chave vertical na borda; lista = 2 colunas), `palavraLado` (`"esquerda"` ou `"direita"`), `corpo` (px) |
| `impacto` | `titulo` (frase no bloco sólido), `sub` (subtítulo de 60px) |
| `lei` | `titulo`, `citacao` (texto da lei, **literal**), `traducao` |
| `lista` | `titulo`, `itens`, `marcador` (`"num"` ou `"romano"`) |
| `frases` | `titulo`, `frases` (cada uma numa etiqueta, entre aspas) |
| `balao` | `titulo` (opcional), `texto` (card de mensagem com três bolinhas) |
| `cta` | `titulo`, `texto`, `botao` (ex.: "Comente #DICA", "Seguir @liberofilho"), `foto` (opcional: polaroide à direita) |

A capa não tem rodapé. Os demais slides mostram "@liberofilho" e o contador "03 / 09".

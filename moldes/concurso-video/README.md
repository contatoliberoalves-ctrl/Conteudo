# Concurso Vídeo (@concursocomlibero)

Reels animados 1080×1920 com narração (ElevenLabs), legenda palavra a palavra e efeitos sonoros, na identidade do Concurso com Líbero · Plataforma (petróleo com grade, verde, menta, amarelo de alerta; Big Shoulders + Sora + Inter; granulado). Feito em Remotion (React → vídeo). Cada elemento entra **na hora em que a palavra é dita** (`em`).

Três séries (campo `serie`, aparece no cabeçalho):
- `curiosidade` → "Você sabia?" (curiosidades do Direito e do mundo dos concursos)
- `descomplica` → "Descomplica" (assunto difícil ou confuso explicado)
- `edital` → "Edital na mão" (notícia de edital: detalhes, o que cai, o que estudar)
- `dicas` → "O que estudar"

Ideias, ganchos e roteiros prontos para as séries: `IDEIAS.md`.

## Fluxo
```bash
cd moldes/concurso-video && npm install            # 1ª vez
node sfx.mjs                                       # 1ª vez: kit de efeitos em public/sfx/
NODE_USE_ENV_PROXY=1 node narrar.mjs <id>          # narração + tempos (só chama a API se a fala mudou)
node quadros.mjs <id> 30 400 900                   # confere quadros soltos (saida/<id>/quadros/folha.png)
node render.mjs <id>                               # saida/<id>/<id>.mp4 e capa.png
npm run studio                                     # (local) editor visual do Remotion
```
Na nuvem do Claude Code, `NODE_USE_ENV_PROXY=1` faz o `fetch` usar o proxy (que injeta a chave da ElevenLabs). Fora dela, defina `ELEVENLABS_API_KEY`. Fontes ficam em `public/fonts/` e vão embutidas no código (`node fontes.mjs` → `src/fontes.gerado.ts`), sem depender de rede no render. Se o render estourar tempo, baixe `CONCORRENCIA=2`.

## Roteiro (`roteiros/<id>.json`)
`{ id, serie, titulo, voz, ajustesVoz?, legenda, legendas, cenas: [...] }`
- `voz`: `adriano` (padrão), `marcelo`, `lucas`, `victor` ou o id de uma voz da ElevenLabs (ex.: a voz clonada do Líbero).
- `legenda`: texto do post (legenda do Instagram), com as fontes jurídicas.
- `legendas`: trocas só na legenda da tela, para números que a voz fala por extenso: `[["cinco mil e setecentos", "5.700"], …]` (a sequência mais longa casa primeiro).
- Cada cena tem `fala` (o que a voz diz; números e siglas por extenso quando preciso) e os campos visuais. `em` = primeira palavra da fala que faz o elemento entrar (a busca anda para frente, então itens em ordem casam em ordem). Palavra não encontrada: o elemento entra num tempo padrão e o render avisa no console.
- `**negrito**` e `[[caixa verde]]` valem nos textos.

### Tipos de cena
| tipo | campos | uso |
|---|---|---|
| `gancho` | `selo`, `linhas[]`, `numero`, `numeroRot`, `sub`, `ts` | abertura: tudo na tela em 1 s, sem esperar a fala; flash + batida |
| `regra` | `n`, `titulo`, `icone` (tatuagem, idade, cerebro, nomeacao, alerta), `pode`, `em`, `excecao`, `emExcecao`, `fonte` | uma regra/direito por cena (✓ e !) |
| `lista` | `titulo[]`, `itens: [{t, em}]` | recapitulação com ✓ |
| `versus` | `titulo`, `lados: [{nome, itens: [{t, em}]}]` | X x Y, homens x mulheres |
| `analogia` | `titulo`, `lados: [{nome, desenho: parede/porta, t, em}]`, `emCarimbo` | comparação desenhada |
| `fichas` | `titulo`, `itens: [{rot, valor, conta, prefixo, detalhe, em}]` | números do edital (2 = linhas, 4 = grade); `conta` anima o número |
| `rosca` | `titulo`, `partes: [{rot, valor, em}]`, `centro`, `centroRot`, `nota`, `emNota` | distribuição de questões |
| `etapas` | `titulo`, `itens: [{data, t, em, alerta}]` | cronograma; `alerta` em amarelo |
| `lei` | `selo`, `ref`, `texto` (palavra em `[[ ]]`), `troca`, `em`, `emTroca`, `nota` | pegadinha: risca a palavra da lei e troca |
| `frase` | `linhas[]`, `ts` | regra de bolso gigante |
| `cta` | `produto` (edital/curso), `titulo[]`, `comenta` | celular com o app + "Comenta PALAVRA" digitando |

`gancho` e `frase` não mostram legenda embaixo (o texto já está grande na tela); `legenda: false` esconde em qualquer cena.

## Regras do molde
- Gancho nos 2 primeiros segundos, com a promessa ou o choque (ver `IDEIAS.md`). Nada de "Olá, pessoal".
- 45 a 70 s. A fala manda no tempo: cada cena dura o que a fala dela dura.
- Dados de edital: confira em duas fontes e no edital; o que divergir fica de fora. Jurisprudência com número na legenda do post.
- Uma cor-herói (verde) por quadro; amarelo só para alerta, selo e VS. Sem emoji no vídeo (só na legenda do post).
- A tela do app no CTA é uma ilustração; troque por print real quando houver (`public/` + `<Img>`).

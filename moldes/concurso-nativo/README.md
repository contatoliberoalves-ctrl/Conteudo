# Concurso Nativo (@concursocomlibero)

Foto em tela cheia (4:5, 1080×1350) com elementos nativos do Instagram. Primo do Carrossel Nativo do @liberofilho, com
outra cara: texto em **máquina de escrever** (Courier) e **forte** (Anton, caixa alta, levemente inclinado) nas cores
do @concursocomlibero, e **figurinhas dos stories** (enquete, quiz, caixa de perguntas, link, menção).

Gerar: `node render.mjs [id]` (nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]`).

## Fotos (fora do git)
`fotos/` deste molde ou as do autor nos outros moldes (`../carrossel-nativo/fotos`, `../carrossel-explicativo/fotos`,
`../concursocomlibero/fotos`). Olhe a foto antes: nada pode cobrir o rosto.

## dados.json
Lista de posts: `id`, `titulo`, `slides`. Post único = 1 slide. Slide: `foto`, `fotoPos`, `escurecer` (0–1),
`tom` (véu verde 0–1) e `elementos`. Todo elemento tem `y` (px do topo, ou `topo`/`meio`/`base`) e `largura` opcional;
elementos que se encostarem são afastados sozinhos.

| tipo | campos |
|---|---|
| `texto` (padrão) | `texto` ("\n" quebra), `estilo` (`maquina` padrão, ou `forte`), `cor` (`escuro`, `profundo`, `branco`, `amarelo`, `verde`, `menta`, `roxo`, `vermelho`, `preto`), `tam` |
| `enquete` | `pergunta`, `opcoes` [a, b], `votos` [%, %] (opcional) |
| `quiz` | `pergunta`, `opcoes`, `certa` (0 = A), `revelar: true` (mostra o gabarito em verde) |
| `pergunta` | `titulo` (caixa de perguntas), `resposta` (opcional) |
| `link` | `texto` |
| `mencao` | `texto` (padrão @concursocomlibero) |

Como no molde concursocomlibero: sem travessões (o render avisa), vermelho só para pegadinha/erro.

# Carrossel Libero (@liberofilho)

Carrossel do perfil pessoal do autor. Os slides têm 1080×1350 e usam os fundos `blue`, `light` e `dark`, com textura granulada. Títulos em Big Shoulders Display 900, em caixa alta; texto em Schibsted Grotesk. O tom é didático e bem-humorado, com analogias ("praga/dedetizador", "soneca/despertador") e falando direto com "você".

- `template.mjs`: visual. Não mexa para gerar posts.
- `render.mjs`: gera `saida/<id>/1.png … N.png` e `painel.png`. Diminui título e corpo até caberem e avisa quando o texto passa da área, encosta na foto, nos anéis ou no rodapé, ou quando há 3 fundos iguais seguidos.
- `dados.json`: um objeto por carrossel (`id`, `titulo`, `tema`, `slides`, e opcionais `pontes` e `inspiracao`, o post antigo que serviu de base).
- `fotos/`: fotos do molde, fora do git. Sem a foto aqui, o render procura em `../carrossel-explicativo/fotos/`.

Gerar: `node render.mjs [id]`. No ambiente em nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]`.

## Slides

Todos têm `tipo` e `tema` (`blue`, `light` ou `dark`; nunca 3 iguais seguidos). Todos aceitam os opcionais `kicker`, `aneis` (anéis vermelhos nos cantos: `true`, ou `"baixo"` para o anel da esquerda mais embaixo), `fundoTexto` (tema repetido ao fundo) e `ts` (tamanho fixo do título). Nos textos, `**negrito**` sai em 800 (use em 1 a 3 trechos por slide). Nos títulos, `[[palavra]]` coloca a palavra numa caixa sólida.

| tipo | campos |
|---|---|
| `capa` | `pre` (pergunta ou pré-título), `titulo` (linhas), `foto` (opcional: foto do autor em tela cheia, com degradê e texto embaixo), `imagem` (opcional: foto de banco em `imagens/`, em tela cheia com véu azul e o título por cima; com `"imagemModo": "cartao"`, vira um cartão com moldura branca no alto), `imagemPos` (enquadramento, ex.: `"center top"`), `texto` (subtítulo opcional). Sem `foto` nem `imagem`, a capa é só tipográfica. |
| `teses` | `exame` (ficha, ex.: "OAB 43"), `kicker`, `titulo` (opcional), `caso` (o caso em uma frase), `itens` (`{tese, artigo}` ou texto), `corpo` (px) |
| `texto` | `titulo`, `texto` (parágrafos), `palavra` (palavra-chave vertical na borda; lista = 2 colunas), `palavraLado` (`"esquerda"` ou `"direita"`), `corpo` (px) |
| `impacto` | `titulo` (frase no bloco sólido), `sub` (subtítulo de 60px) |
| `lei` | `titulo`, `citacao` (texto da lei, **literal**), `traducao` |
| `lista` | `titulo`, `itens`, `marcador` (`"num"`, `"romano"` ou `"letra"`), `inicio` (continua a contagem: `1` começa em 02/II/b) |
| `frases` | `titulo`, `frases` (cada uma numa etiqueta, entre aspas) |
| `enunciado` | `kicker` (ex.: "Caso 01 · Enunciado (1/2)"), `texto` (parágrafos do caso, numa folha branca com borda azul), `corpo` (px; 36 cabe ~700 caracteres) |
| `questao` | `kicker` ("Pergunta 1 de 5"), `titulo` (o tema: Endereçamento, Partes, Teses, Pedidos), `pergunta`, `opcoes` (A–D), `corpo` |
| `gabarito` | `kicker`, `titulo`, `itens: [{tema, letra, texto, artigo}]` (uma linha por pergunta, com a letra certa) |
| `balao` | `titulo` (opcional), `texto` (card de mensagem com três bolinhas) |
| `cta` | `titulo`, `texto`, `botao` (ex.: "Comente #DICA", "Seguir @liberofilho"), `foto` (opcional: polaroide à direita), `print` (opcional: print de tela em `fotos/`, ex.: o botão "Assinar" do perfil) e `destaque` (`[x, y, largura, altura]` em % do print: anel vermelho em volta do ponto) e `centro` (`true`: título, texto e botão centralizados, sem foto) |

## Estilos de capa

Para cada tipo de post ter cara própria, a `capa` aceita `"estilo"` (sem estilo, é a capa de sempre: tipográfica ou com foto/imagem):

| estilo | para | campos |
|---|---|---|
| `teses` | série "Teses que caíram na <peça>" | `rotulo` ("Teses que caíram na"/"no"), `titulo` (sigla ou nome da peça), `nome` (linha de baixo), `exames` (fichas "OAB 43"…; o carimbo JÁ CAIU conta quantas) |
| `numero` | listas ("3 erros…") | `numero` (vazado gigante), `kicker`, `titulo`, `texto`, `tn` (px do número) |
| `versus` | comparações | `lados` (2 textos; aceita `[[caixa]]`), `kicker`, `texto` |
| `pergunta` | quiz, verdadeiro ou falso | `kicker`, `titulo`, `texto`, `opcoes` (botões, ex.: `["Sim", "Não"]`) |
| `manchete` | dados, notícias, rankings | `edicao`, `secao` (cabeçalho do jornal "O Libero"), `kicker`, `titulo`, `texto` (linha fina) |
| `cantos` | comparação sobre uma foto em tela cheia (montagem de IA) | `imagem` ou `foto`, `cima` (linhas no alto à esquerda), `pre` (etiqueta branca logo abaixo), `selo` (bola vermelha, ex.: "x"; `seloPos` [x, y]), `baixo` (linhas embaixo à esquerda), `tc`/`tb` (px), `base` (distância do rodapé). Deixe o rosto livre à direita |
| `ringue` | treta entre duas pessoas e um terceiro no meio (eleições, disputas) | `pre` (etiqueta), `titulo` (curto, no alto), `esquerda`/`direita` (`{img, h, x, y}`: recortes PNG sem fundo em `fotos/`, `h` = altura em px), `centro` (`{img, x, y, tam}`: círculo PB), `carimbo` (texto vermelho sob o círculo). Para recortar: `rembg` (sessão `u2net_human_seg`) |
| `apuracao` | eleições e resultados (placar de TV) | `pre` (com bolinha vermelha "ao vivo"), `titulo`, `meta` (% da marca vermelha nas barras, padrão 50), `metaTexto`, `max` (% da barra cheia, padrão 60), `candidatos` (`[{foto, nome, partido, pct, anulado, carimbo, carimboX}]`: fotos quadradas do rosto em `fotos/`), `placarY` |
| `trunfo` | cargos e poderes ("o que o presidente pode"), em cartas de jogo de super-herói | `pre`, `titulo`, `texto` (linha abaixo do título), `cartas` (`[{nome, foto, numero, fotoPos}]`: 1 no centro ou 2 inclinadas; sem `foto` sai a silhueta com "?"; fotos verticais do rosto em `fotos/`), `atributos` (`[[rótulo, valor]]`, 4 linhas; valor 0 em vermelho), `cartaRotulo` (padrão "PRESIDENTE"), `cartasY`, `ts` |
| `treino` | série "Vamos treinar estrutura de peças?" | `kicker`, `titulo` (use `[[caixa]]`), `etapas` (itens da folha com caixinha para marcar), `caso` (carimbo vermelho), `folha`/`folhaDir` (cabeçalho da folha), `folhaY`, `folhaH`, `ts` |

Os posts da série de teses têm `"serie": "teses"` e usam a tabela "Principais Teses" do Livro de Prática Constitucional, conferida com os gabaritos da FGV (exames 32 a 46).

## Fotos de banco de imagens

`imagens/` guarda fotos de domínio público (CC0 ou Public Domain Mark), com os créditos em `imagens/CREDITOS.md`. Elas podem ir para o git porque não são fotos pessoais. Para buscar: `python3 buscar_imagens.py "termo em inglês" [n] [fonte]` gera uma prancha em `build/busca/` para escolher. A melhor fonte é `rawpixel` (fotos profissionais e gravuras antigas, verticais), e o script já baixa a versão sem marca d'água. Prepare a escolhida em 1080×1350 com `python3 buscar_imagens.py --preparar build/busca/<arquivo>.jpg imagens/<nome>.jpg`.

## Imagens de IA

`imagens/ia-*` são imagens geradas por IA (ChatGPT/Gemini pelo autor, ou `gerar_imagens_ia.py` com FLUX e `HF_TOKEN`). Elas **não vão para o git** (`.gitignore`): algumas trazem o rosto do autor, como o busto grego. Os originais ficam com o autor. Numa sessão nova, peça as imagens e salve-as em `imagens/` com o nome do `dados.json`. Os prompts ficam no campo `promptIA` de cada slide.

## Objetos 3D

`assets/` tem objetos 3D com fundo transparente (Fluent Emoji da Microsoft, licença MIT em `assets/LICENSE-fluentui-emoji.txt`; ampliados para 512px). Para baixar mais: `https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/<Nome>/3D/<nome>_3d.png` (nome do emoji em inglês, ex.: `Alarm clock` / `alarm_clock_3d.png`).
- No slide: `"objeto": {"img": "robot.png", "onde": "canto" | "lado" | "baixo", "lado": "direita" | "esquerda", "tam": 400, "rot": -8}` (ou `x`/`y` livres).
- No carrossel: `"pontes": [{"img": "chicken.png", "entre": 2, "y": 860, "tam": 340, "rot": -6}]`. O objeto fica metade no slide 2 e metade no 3, ligando os dois.
- A área de texto encolhe sozinha para não encostar nos objetos. Use 1 ou 2 pontes por carrossel, alternando em cima e embaixo.

A capa não tem rodapé. Os demais slides mostram só "@liberofilho", sem contador de páginas (pedido do autor).

## Visuais alternativos (`visual`)

Um carrossel com `"visual": "dossie" | "duelo" | "requisitos"` usa outra diagramação, na mesma identidade, desenhada em `visuais/<visual>.mjs` e gerada pelo `../libero-comum/render-base.mjs` (objetos 3D em `../libero-comum/assets/`). Os campos de cada um estão nos READMEs dos moldes de aula `../libero-dossie/`, `../libero-duelo/` e `../libero-requisitos/` (mesmos tipos de slide, em 1920×1080):
- `dossie`: processo arquivado (capa com folha, carimbo e clipe; `linha`, `ficha`, `carimbo`, `cta`). Para "teses que caíram".
- `duelo`: tela dividida com VS (`capa`, `round`, `placar`, `macete`, `cta`; o carrossel tem `nomes`). Para comparações.
- `requisitos`: ficha de candidatura (`capa`, `lei`, `requisito`, `virada`, `checklist`, `cta`). Para "fulano poderia ser X?".

## Série "Vamos treinar estrutura de peças?"

Posts com `"serie": "treino"`: capa `estilo: treino`, enunciado em 2 slides `enunciado`, 5 `questao` (peça, endereçamento, partes/legitimidade, teses, pedidos), `gabarito` e `cta` centralizado. Fonte dos casos: caderno "Mentoria VDE · Treino de peças" (20 casos com gabarito; peça o PDF ao autor). Varie a letra certa entre as perguntas e use alternativas erradas plausíveis (habeas data x MS, ADI x ADPF…).

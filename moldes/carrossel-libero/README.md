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
| `texto` | `titulo`, `texto` (parágrafos), `palavra` (palavra-chave vertical na borda; lista = 2 colunas), `palavraLado` (`"esquerda"` ou `"direita"`), `corpo` (px) |
| `impacto` | `titulo` (frase no bloco sólido), `sub` (subtítulo de 60px) |
| `lei` | `titulo`, `citacao` (texto da lei, **literal**), `traducao` |
| `lista` | `titulo`, `itens`, `marcador` (`"num"`, `"romano"` ou `"letra"`), `inicio` (continua a contagem: `1` começa em 02/II/b) |
| `frases` | `titulo`, `frases` (cada uma numa etiqueta, entre aspas) |
| `balao` | `titulo` (opcional), `texto` (card de mensagem com três bolinhas) |
| `cta` | `titulo`, `texto`, `botao` (ex.: "Comente #DICA", "Seguir @liberofilho"), `foto` (opcional: polaroide à direita) |

## Fotos de banco de imagens

`imagens/` guarda fotos de domínio público (CC0 ou Public Domain Mark), com os créditos em `imagens/CREDITOS.md`. Elas podem ir para o git porque não são fotos pessoais. Para buscar: `python3 buscar_imagens.py "termo em inglês" [n] [fonte]` gera uma prancha em `build/busca/` para escolher. A melhor fonte é `rawpixel` (fotos profissionais e gravuras antigas, verticais), e o script já baixa a versão sem marca d'água. Prepare a escolhida em 1080×1350 com `python3 buscar_imagens.py --preparar build/busca/<arquivo>.jpg imagens/<nome>.jpg`.

## Imagens de IA

`imagens/ia-*` são imagens geradas por IA (ChatGPT/Gemini pelo autor, ou `gerar_imagens_ia.py` com FLUX e `HF_TOKEN`). Elas **não vão para o git** (`.gitignore`): algumas trazem o rosto do autor, como o busto grego. Os originais ficam com o autor. Numa sessão nova, peça as imagens e salve-as em `imagens/` com o nome do `dados.json`. Os prompts ficam no campo `promptIA` de cada slide.

## Objetos 3D

`assets/` tem objetos 3D com fundo transparente (Fluent Emoji da Microsoft, licença MIT em `assets/LICENSE-fluentui-emoji.txt`; ampliados para 512px). Para baixar mais: `https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/<Nome>/3D/<nome>_3d.png` (nome do emoji em inglês, ex.: `Alarm clock` / `alarm_clock_3d.png`).
- No slide: `"objeto": {"img": "robot.png", "onde": "canto" | "lado" | "baixo", "lado": "direita" | "esquerda", "tam": 400, "rot": -8}` (ou `x`/`y` livres).
- No carrossel: `"pontes": [{"img": "chicken.png", "entre": 2, "y": 860, "tam": 340, "rot": -6}]`. O objeto fica metade no slide 2 e metade no 3, ligando os dois.
- A área de texto encolhe sozinha para não encostar nos objetos. Use 1 ou 2 pontes por carrossel, alternando em cima e embaixo.

A capa não tem rodapé. Os demais slides mostram "@liberofilho" e o contador "03 / 09".

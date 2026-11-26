# Persona Pro na novelinha: quando usar e como

Leia este arquivo inteiro antes de gerar qualquer coisa no Persona Pro. Ele vale no lugar de qualquer trecho mais antigo da skill sobre esse modelo. Saiu de teste na série "A hóspede da chuva" (07/11 e 12/11/2026); o que não foi testado está marcado no fim.

## O que ele é

O Persona Pro é um modelo feito pra cena de novela: recebe as **fichas dos personagens**, a **foto do cenário**, **um áudio com as falas da cena** e um **roteiro com os planos e os cortes**, e devolve a cena inteira já cortada, com cada personagem falando a sua parte. A voz é a do áudio que você entrega, copiada igual. Sai em 1080p.

O Avatar Pro é o contrário: não recebe áudio, você escreve as falas e ele inventa a voz de cada um junto com a boca.

## Quando escolher

| Situação | Modelo |
|---|---|
| O aluno quer a **mesma voz** do personagem em toda cena e em toda parte | Persona Pro |
| O aluno quer a imagem mais nítida (1080p) | Persona Pro |
| O aluno quer emoção na voz e só tem voz de galeria | Avatar Pro (a voz de galeria lê o texto, não atua) |
| O Persona Pro não aparece no `list_models` | Avatar Pro |

## A regra que decide tudo: o roteiro vai no formato dele

O Persona Pro só faz a cena direito quando o pedido vem nas **6 seções** abaixo, em inglês, com a fala no idioma da novela dentro de `<d>` e a marca do idioma (`[Portuguese]`, `[Spanish]` ou `[English]`, S/references/idioma.md). É o modelo de pedido de S/references/prompts.md §Persona Pro. Escrito em outro formato (o do Avatar Pro, por exemplo), ele perde fala e erra quem fala.

Prova, na mesma cena de 12 s (personagem A, personagem B, personagem A; 3 planos; o mesmo áudio):

| Como o pedido foi escrito | Resultado |
|---|---|
| Formato do Avatar Pro, com a foto de abertura como 1º quadro | 1ª fala muda, em 2 de 2 tentativas |
| Cena quebrada em 3 pedidos de um falante, emendados na edição | As falas saem, mas a personagem fica mais falsa e o corte emendado é pior que o do modelo (reprovado) |
| **As 6 seções, fichas + foto do cenário como referência, `<Audio 1>: fully_copy`** | **3 falas inteiras, áudio copiado igual (99%), 2 cortes feitos pelo modelo, de primeira.** Mesmo resultado no teste de 07/11 (2 falantes, corte pro close) |

Não quebre a cena em pedaços. Os cortes de câmera são do modelo.

## Como montar o pedido

1. **Fotos, nesta ordem em `referenceImages`:** a ficha de cada personagem que aparece na cena e, por último, a foto do cenário (a foto de abertura da cena, conferida pela Regra 4 da skill). No texto, cada ficha vira `<Subject N> ... from <Picture N>` e a foto do cenário vira o `<Subject>` do lugar. Todas entram como referência; nenhuma é "1º quadro".
2. **Um áudio só, com todas as falas da cena na ordem**, até 15 s: gere cada fala na voz do personagem, junte com 0,35 s entre uma e outra e suba (§Áudio do Persona Pro na skill). Falas de personagens diferentes no mesmo áudio funcionam, desde que o pedido diga quem fala em que ordem.
3. **`<Audio 1>` definido e marcado como copiado:** em `subject_definitions`, "`<Audio 1>` is the complete <TRILHA> of the scene: `<Subject 1>` (S1) speaks first, then `<Subject 2>` (S2)..." (`<TRILHA>` = "Brazilian Portuguese dialogue track", "Latin American Spanish dialogue track" ou "American English dialogue track", conforme o idioma da série); em `retention_analysis`, "`<Audio 1>`: fully_copy - `<Audio 1>` is reused 1:1 as the target video's complete final audio track."
4. **Planos com o segundo do corte tirado do áudio.** `[Shot 1]` sem tempo; os seguintes `[Shot N] At 00:0X.XXX, the shot cuts to...`. O segundo de cada corte é o meio do silêncio entre duas falas no áudio que você montou (some as durações das falas e os 0,35 s). Quem fala em cada plano: `<Subject N> (Sx) says, <d><IDIOMA> a fala exata do áudio.</d>` (`<IDIOMA>` = `[Portuguese]`, `[Spanish]` ou `[English]`). Quem não fala: "keeps her lips closed" / "does not speak".
5. **A emoção de cada fala escrita como ação visível** no plano (o sorriso que some, a sobrancelha que desce, a mão que empurra o envelope). É assim que a atuação bate com a cena.
6. `model: avatrix-persona-pro`, `mode: audio_to_video`, `audioUrl`, `aspectRatio: 9:16`, `resolution: 1080p`. A duração é a do áudio.

## Os três portões

1. **A voz passa pelo ouvido do aluno antes de qualquer vídeo.** A voz do `list_voices` tem que falar o idioma da novela (voz brasileira lendo espanhol ou inglês sai com sotaque). Gere 1 fala de cada personagem, mostre os áudios e pergunte "é essa a voz?". Sem esse "sim", não gere vídeo. Prova: 12 cenas geradas com voz de galeria lendo o texto foram reprovadas inteiras ("robóticas", "diferentes"), cerca de 300 créditos. Numa continuação, compare com a voz da parte anterior: a moça não pode sair mais grave que a senhora.
2. **Confira se a fala voltou inteira.** `python3 S/scripts/conferir_fala.py <áudio enviado> <vídeo devolvido>`: abaixo de 85%, o pedido está fora do formato ou o modelo comeu um trecho. Confira o formato antes de refazer; refazer igual gasta de novo.
3. **Confira o rosto de cada plano contra a ficha.** Aqui o modelo não recebe foto com gente: ele redesenha cada pessoa a cada corte, só pela ficha, e de vez em quando erra um plano inteiro. Prova: numa Parte 1 de 11 cenas, com a mesma ficha e o mesmo texto em todas, a filha saiu outra pessoa em 2 de 13 planos; quatro conferências em quadro pequeno deram "varia" e a parte foi ao ar assim. Depois de cada cena, a folha de rostos (`S/scripts/rostos.py`, fase 5, passo 5 da SKILL.md): um NÃO BATE = refazer a cena antes da próxima.

Depois, o crítico do clipe como nos outros modelos. Primeiro a cena 1: mostre ao aluno e espere o "gostei" antes de qualquer outra.

## Custo

Sempre do `get_cost`: o vídeo da cena (só cota com o áudio pronto) + as falas + a foto do cenário. Diga o total da Parte antes do primeiro "sim".

## Não verificado

- Cena com 3 pessoas falando no mesmo áudio (testado com 2 falantes, 3 falas).
- Cena de 13 a 15 s e cena com 4 ou mais planos.
- Se o formato das 6 seções acerta sempre: são 2 cenas certas em 2 (07/11 e 12/11). Na 3ª falha seguida, pare e mostre ao aluno.
- A voz atuada: pela conexão do aluno só existe a voz de galeria, que lê o texto.

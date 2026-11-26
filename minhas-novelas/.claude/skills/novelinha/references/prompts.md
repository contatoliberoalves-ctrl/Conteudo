# Modelos de prompt

Prompt em inglês, fala no idioma da novela entre aspas. Use sempre as mesmas palavras pro mesmo personagem e pro mesmo cenário. Cada linha de prompt sai da ficha de direção do clipe (S/references/direcao.md).

**Campos de idioma.** Os modelos abaixo têm 6 campos que mudam com o `idioma` da série: `<IDIOMA>` (a marca da fala: `[Portuguese]`, `[Spanish]` ou `[English]`), `<TRILHA>`, `<SOTAQUE>`, `<PAIS>`, `<TV>` e `<NOVELA>`. Preencha cada um com a coluna do idioma em S/references/idioma.md §O que troca nos pedidos, sempre igual na série inteira. Novela em português: `[Portuguese]`, `Brazilian`, `Brazilian TV drama`, como sempre foi. Nunca deixe `[Portuguese]` numa fala em espanhol ou inglês: o modelo pronuncia com o idioma da marca.

Regras que valem em todo prompt (estudo 9, com fonte):
- **O olhar vai dentro da linha de cada pessoa** ("eyes on <nome>"), nunca como regra solta no fim. No fim o modelo ignora.
- **Emoção como ação visível** ("smile with the mouth only, eyes still", "grips the sleeve"), nunca adjetivo ("scared", "evil"): adjetivo não renderiza e emoção forte vira olho brilhando.
- **Uma fonte de luz, com lugar** ("warm corridor light from the right"). Nunca "lit from the front", "all faces clearly visible": é a instrução de retrato posado.
- **Câmera como fotógrafo** (plano, por cima de quem, lente, abertura, grão, luz disponível). Nunca "cinematic", "8K", "beautiful", "perfect": não rendem.
- **3 camadas**: primeiro plano de costas/3/4 um pouco desfocado, plano do meio nítido (quem fala), fundo pequeno e meio escondido. Por cima do ombro é o plano padrão de diálogo.
- **Negativa curta e só do que o modelo costuma inventar** (texto, logo, fila simétrica, retoque), sempre depois do positivo.
- **A foto do 1º quadro já é meio do gesto, mão ocupada.** Foto parada vira cabeça parada com zoom lento no vídeo.
- **Sem metáfora nem comparação** ("like a", "as if"): o modelo desenha a comparação. Objeto que não deve aparecer não é citado.
- **Todo pedido de cena termina com o bloco de travas** (mão de cada objeto, estado que continua, quem fica calado, o que ainda não acontece): S/references/passagem-e-som.md §5.

## Ficha (1 por personagem, 16:9)
```
<Photorealistic | 3D Pixar-style animated> character reference sheet of the same <who>, shown in four equal panels side by side on a plain seamless light grey studio background, soft even front light, neutral expression, looking at the camera: (1) full body front view, (2) full body 90-degree side profile, (3) three-quarter turn from the waist up, (4) close-up of the face. <traço 1>, <traço 2>, <traço 3>, <roupa, da gola até a barra>, <sapato>. Same face, same clothes in all four panels. No text, no labels, no logo.
```
A ficha é a única imagem em que a pessoa olha pra câmera: é documento, não cena. **Escreva sempre o sapato e a barra da roupa** ("knee-length navy skirt, flat black shoes"): é o que faz a ficha sair de corpo inteiro, dos pés à cabeça. Cada personagem tem 1 detalhe único que ninguém mais do elenco tem (confira contra o elenco inteiro antes de gerar), e a série tem um acento de cor só (ex.: só a vilã usa vermelho). Acrescente, antes do "Same face": "<traço 1>, <traço 2>, <traço 3>" vira a **string de identidade** da série, repetida palavra por palavra em todo prompt; e "natural matte skin texture, preserve minor facial blemishes such as <2 imperfeições com causa: a small mole, sun lines, a chipped tooth>, no beautification". Se a ficha puder ter 8 painéis (Nano Banana Pro aceita), ponha 3 closes de expressão (neutro, sorriso fechado, medo contido) no lugar de repetir vistas (MICW Character Sheet, 5 mil downloads). Personagem de fruta ou bicho: descreva pela forma e pela cor ("head shaped like a shiny dark-purple fruit, round like a large grape, with a Pixar cartoon face on the skin, big eyes, big mouth, arms the same color").

## Storyboard da cena (nano-banana-pro, 2K, 9:16)
Molde (teste 07/11: 4 quadros consistentes da mesma cena): fichas + prefixo fixo + a cena, 1 imagem com 4 quadros. Nano Banana Pro chama a referência de "the person from reference image N"; GPT, de "Image N"; Seedream, de "Figure N".
`referenceImages` = [ficha de A, ficha de B, ficha de C] na ordem em que aparecem no texto.
```
References: Image 1 = <A>'s face and body (identity only). Image 2 = <B>. Image 3 = <C>. Keep each face exactly as in its reference; do not blend or swap them.

ONE image laid out as a strict 2x2 grid (two columns, two rows, equal cells, thin black gutters), each cell a VERTICAL 9:16 frame from the same moment of a <TV>, <estilo fixo da série>, candid and unposed, caught in the middle of the action: <uma frase do que está acontecendo agora, no meio do gesto>.
Setting: <cenário, sempre com as mesmas palavras>. Light: <uma fonte e de onde vem>, <hora>; faces lit by that source only.
Frame 1 (top left), wide shot in three layers: foreground, frame <left|right>, back three-quarter to camera, slightly soft: <A>, <o que as mãos fazem>, eyes on <B>, chin <down|up>. Midground, sharp: <B>, body turned <toward A>, <expressão como ação>, eyes on <A>. Background, small in frame, half hidden by <porta/parede>: <C>, <postura, mãos>, eyes on <B>.
Frame 2 (top right): close-up of <quem fala primeiro> over <X>'s shoulder (<X>'s shoulder soft in the foreground, frame <left|right>), three-quarter view, <expressão como ação>, eyes on <Y>.
Frame 3 (bottom left): close-up of <quem responde> <through the door gap / across the table>, half hidden by <...>, <expressão como ação>, eyes on <quem> (off frame).
Frame 4 (bottom right): close-up of <terceiro> from <quem>'s point of view, three-quarter, <ação>, eyes on <quem>.
Nobody looks into the lens. Shot on a <50mm> at <f/2>, eye level; shallow depth of field; natural matte skin texture, pores, minor facial blemishes preserved, <wet> fabric, slight film grain, available light only, no beautification. Same faces, same clothes and same light in all four frames; each person stays in the same place and on the same side of the frame in all four. In every close-up the face fills at least one third of the frame height.
Constraints: no text, no captions, no logos, no borders, no studio polish, no front fill light, no symmetrical lineup, no heavy retouching.
```
Vilão: "a smile with the mouth only, still eyes, chin down" (na ficha e aqui). Quem fala no clipe fica até três quartos virado pra câmera, olhos no parceiro; quem está de costas é quem escuta.

## Foto de cena sem storyboard (9:16, 1 quadro)
Só quando o storyboard não estiver disponível. Mesma ordem: referências → cena e luz → cada pessoa (posição, mãos, olhar, expressão como ação) → câmera → restrições.
```
References: Image 1 = <A> (identity only). Image 2 = <B>. Image 3 = <C>. Keep each face exactly as in its reference; do not blend or swap them.

A candid, unposed photograph from a <TV>, <estilo fixo>, vertical 9:16, caught in the middle of the action: <o que está acontecendo agora, no meio do gesto>.
Setting: <cenário>. Light: <uma fonte e de onde vem>, <hora>; faces lit by that source only.
Foreground, frame <left|right>, back three-quarter to camera, slightly soft: <A>, <mãos>, eyes on <B>.
Midground, sharp: <B>, body turned <toward A>, <expressão como ação>, eyes on <A>, head slightly <up|down>.
Background, <onde>, small in frame, half hidden by <...>: <C>, <postura, mãos>, eyes on <B>.
Nobody looks into the lens. Shot over <A>'s shoulder on a <50mm> at <f/2>, eye level; shallow depth of field; real skin texture, pores, fabric wear, slight film grain, available light only.
Constraints: no text, no captions, no logos, no studio polish, no front fill light, no symmetrical lineup, no heavy retouching.
```

## Vídeo do clipe (Avatar Pro)
O modelo recebe o prompt como está, sem reescrita, e não recebe áudio: ele inventa a voz a partir do texto. Por isso o pedido abre com **cada personagem e a ficha de voz fixa dele**, sempre com as mesmas palavras em toda cena da série (fase 3 da skill, Voz); depois o cenário, as posições e os planos. É o formato do próprio modelo. Testado em 12/11 (cena de 12 s, 2 falantes, 3 planos, 2 gerações do mesmo pedido): 3 falas e 3 planos nas duas, e a mesma voz nas duas. O formato antigo (foto de abertura como 1º quadro, voz descrita em meia frase na hora da fala) fez a Parte 1 de 10/11 com notas 7 a 7,5, mas a voz mudava de cena pra cena.
`<Picture 1>` é a foto de abertura (o cenário e a posição de cada um); as fichas que vêm depois em `referenceImages` são `<Picture 2>`, `<Picture 3>`… na ordem. Fala a ~2,5 palavras por segundo. Não lotar o clipe.
**O Persona Pro não usa este modelo de pedido.** Ele tem formato próprio, mais abaixo em §Persona Pro; escrito neste aqui, ele perde fala.
```
<Subject 1> <A> is the <idade> <PAIS> <woman|man> in <Picture 2>, keeping the facial features, body proportions and overall appearance of the reference image: <os 3 traços que não mudam>.
<Subject 1>, S1 is always this speaker. S1 always uses one fixed voice: <a ficha de voz de A, palavra por palavra a do elenco.json>. <os proibidos da ficha>.

<Subject 2> <B> is the <idade> <PAIS> <woman|man> in <Picture 3>, keeping the facial features, body proportions and overall appearance of the reference image: <os 3 traços>.
<Subject 2>, S2 is always this speaker. S2 always uses one fixed voice: <a ficha de voz de B>. <os proibidos>.

<Subject 3> is <o cenário> shown in <Picture 1>: <os objetos e a luz, com as mesmas palavras de sempre>.

Character positions: <Subject 1> <A> <onde está, mão ocupada>. <Subject 2> <B> <onde está>. The only sounds are <som do lugar> and the voices.

[Shot 1]
<plano e de onde a câmera vê>. <Subject 1> <A> <gesto no meio da ação, emoção como rosto e gesto>:
<Subject 1> (S1) says:
<d><IDIOMA> "<fala 1, como se fala>"</d>
<Subject 2> <B> keeps her lips closed <reação visível>.

[Shot 2]
Close-up of <Subject 2> <B> seen over the shoulder of <Subject 1> <A>. <gesto e emoção como ação>:
<Subject 2> (S2) says:
<d><IDIOMA> "<fala 2>"</d>

[Shot 3]
Close-up of <Subject 1> <A> seen over the shoulder of <Subject 2> <B>. <gesto e emoção como ação>:
<Subject 1> (S1) says:
<d><IDIOMA> "<fala 3>"</d>
<como a expressão fica até o fim>.

[Forbidden]
Text / UI / watermark / logo / readable text / subtitles. Nobody looks into the lens.

[Mandatory]
No background music, only ambience, voices and sound effects; no subtitles, text, watermark or logo on screen.
```
Um beat por plano de 3 a 10 s (mais de 2 ou 3 beats num plano e o modelo congela a expressão); nos closes o rosto ocupa pelo menos 1/3 da altura; os traços de cada um entram palavra por palavra. **A voz só aparece na ficha do topo**: na hora da fala não escreva adjetivo de voz ("in a cold voice"); a emoção vai no rosto e no gesto do plano. Voz fora da tela usa a frase exata "says in an off-screen voiceover"; se só a distância ou o ângulo muda, prefira movimento de câmera em frase ("the camera pushes in with small amplitude at slow speed") a cortar; "slowly/calmly" vira câmera lenta, use "Real-time motion". Escreva a fala como se fala ("cê vai pegar friagem"; em espanhol "ándale, mijo"; em inglês "you're gonna catch a cold"), dentro do `<d>`, com a marca do idioma, e entre aspas. **Vogal aberta que a voz fecha:** se a voz diz "bôdas" em vez de "bódas", escreva com acento só no texto que vai pra voz (o pedido do vídeo ou o `generate_voice`): "bódas". Na legenda e no título fica a grafia normal: "bodas". Cada plano tem fala: o modelo inventa fala em plano mudo (06/11, 2 de 8 clipes, mesmo com "Nobody speaks"). Depois de gerar, ouça: palavra quebrada ou voz que não é a da cena anterior, refaça o clipe. O modelo tende a virar o rosto pra lente no último segundo: o crítico confere, e a montagem corta 1 s antes se acontecer.

Outro modelo pedido pelo aluno pelo nome: o mesmo conteúdo; no Seedance, em `镜头 1 [0-4s]`, "角色台词（情绪）：", "不要字幕", mais "Real-time motion, no slow motion".

## Persona Pro (cena inteira num pedido, 6 seções)
O modelo recebe o texto como está. As fotos em `referenceImages` são, na ordem, a ficha de cada personagem da cena e por último a foto do cenário: `<Picture 1>`, `<Picture 2>`... `<Audio 1>` é o áudio com todas as falas da cena. Tudo em inglês, a fala no idioma da novela dentro de `<d>` (com a marca `<IDIOMA>`), palavra por palavra a do áudio. O segundo de cada corte é o meio do silêncio entre duas falas do áudio. Método e provas: S/references/persona-pro.md.
```
subject_definitions:
<Subject 1> is <A>, the <idade> <PAIS> <woman|man> from <Picture 1>, preserving <rosto e os 3 traços que não mudam>.
<Subject 2> is <B>, the <idade> <PAIS> <woman|man> from <Picture 2>, preserving <rosto e os 3 traços>.
<Subject 3> is <o cenário> from <Picture 3>, with <os objetos e a luz, com as mesmas palavras de sempre>.
<Audio 1> is the complete <TRILHA> of the scene: <Subject 1> (S1) speaks first, then <Subject 2> (S2), then <Subject 1> (S1) again.

summary:
[reference generation + audio reuse] The target video is a vertical 9:16 live-action <NOVELA> micro-drama scene in <Subject 3>. <o que acontece, em uma frase>. It uses the appearances from <Picture 1>, <Picture 2> and <Picture 3>, and reuses <Audio 1> 1:1 as the complete final audio track, with hard cuts from <plano 1> to <plano 2> and then to <plano 3>.

retention_analysis:
<Subject 1> (appears in [Shot 1], [Shot 3]): fully_preserved - <rosto e traços> are retained.
<Subject 2> (appears in [Shot 1], [Shot 2]): fully_preserved - <rosto e traços> are retained.
<Subject 3> (appears in [Shot 1], [Shot 2], [Shot 3]): fully_preserved - <cenário e luz> are retained.
<Audio 1>: fully_copy - <Audio 1> is reused 1:1 as the target video's complete final audio track.

detailed_description:
The target video uses a realistic vertical 9:16 <NOVELA> style with <a luz, uma fonte e de onde vem>, shallow depth of field, natural acting, <SOTAQUE> and accurate lip synchronization. Only the person who is speaking moves the mouth; the others keep their lips closed. Nobody looks into the lens. No subtitles, on-screen text, watermarks or stickers.
[Shot 1] <plano e de onde a câmera vê> in <Subject 3>. <Subject 1> (S1) <onde está, de frente ou três quartos, mão ocupada>. <Subject 2> <onde está, o que faz, olhando pra quem>. <emoção como ação visível>, <Subject 1> (S1) <gesto> and says, <d><IDIOMA> <fala 1, exata>.</d> Her mouth shapes match each syllable. <Subject 2> keeps her lips closed <reação visível>.
[Shot 2] At 00:0X.XXX, the shot cuts to a close-up of <Subject 2> (S2) seen over the shoulder of <Subject 1>. <gesto e emoção como ação> <Subject 2> (S2) says, <d><IDIOMA> <fala 2, exata>.</d> Her lips close after the last word. <Subject 1> does not speak.
[Shot 3] At 00:0Y.YYY, the shot cuts to a close-up of <Subject 1> (S1) seen over the shoulder of <Subject 2>. <gesto e emoção como ação> <Subject 1> (S1) says quietly, <d><IDIOMA> <fala 3, exata>.</d> Her lips close after the last word and she holds <a expressão> until the final frame. <Subject 2> does not speak.

overall_soundscape:
The complete soundtrack is <Audio 1> reused 1:1, with no added music or sound effects.

non_diegetic_music:
N/A
```

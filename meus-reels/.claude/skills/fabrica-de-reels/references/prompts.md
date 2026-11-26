# Modelos de prompt

Sumário: Regras · §Voz (bloco escrito) · §Fotos fixas · §Imagem de partida · §Imagem do gancho · §Vídeo Persona Pro · §Diálogo · §Vídeo Avatar Pro com a fala · §Vídeo Avatar Pro sem áudio.

Na ficha, o bloco §Voz se divide: altura, textura, ritmo, volume e fim de frase em `timbreRitmo` (até 200 caracteres); a mecânica do sotaque e a cidade em `sotaque` (até 120).

## Regras que valem em todo prompt
- Prompt de imagem e vídeo em inglês; a fala no idioma do personagem, entre `<d>[<Idioma>] ... </d>`.
- **A fala em `<d>` é a do áudio, palavra por palavra:** as frases da cena em `R/frases.json`, na ordem, como foram pra voz (número por extenso, sem símbolo). Palavra a mais ou a menos que no áudio vira boca fora da fala. Sem a fala escrita, o Persona Pro e o Avatar Pro com áudio recusam antes de cobrar.
- **Idioma, sotaque e país saem da ficha** (`voz.idioma`), nunca fixos. `<Idioma>` / `<nacionalidade>` / `<idioma em chinês>` por ficha: pt-BR = Portuguese / Brazilian / 巴西葡萄牙语 · es-MX = Spanish / Mexican / 墨西哥西班牙语 · es-ES = Spanish / Spanish (from Spain) / 西班牙西班牙语 · en-US = English / American / 美式英语. Vale pra imagem, vídeo, roteiro, legenda e a palavra pra comentar.
- **A string de identidade** (as 3 marcas + o figurino, em substantivos: "short red nails, flowered apron, reading glasses on the tip of the nose") entra palavra por palavra em todo prompt do personagem.
- Emoção como o que o corpo faz ("smile with the mouth only, eyebrows raised"), nunca adjetivo ("happy", "angry").
- Luz com fonte e lugar ("soft overcast daylight from the window on the right"). Nunca "cinematic", "8K", "beautiful", "perfect": não rendem.
- **Sem negação do que você não quer na cena, na imagem E no vídeo**: negação desenha o substantivo. Afirme o quadro limpo ("clean frame"). No vídeo vale igual pro rosto: "does not laugh, no wide smile" saiu com sorriso largo; "lips rest together, relaxed" diminuiu o sorriso. Descreva o que a boca e o rosto FAZEM. A única lista de "no" que funciona é a de texto e marca no fim ("No captions, no subtitles, no watermark, no logo"). A outra exceção é a boca: "says this line only once ... no second line, no repetition" e "<Subject 1> does not speak" seguram a fala e ficam.
- **Só entra no prompt o que está naquela cena.** O "Prop na mão" e o objeto fixo da ficha (livro, produto) vão só na cena do fecho que o roteiro marcou. Em `<Subject 2>` do vídeo, liste só os objetos que estão em `<Picture 1>`.
- Proibições da ficha (luz proibida, palavras proibidas, regras) nunca entram no prompt de imagem.

## §Voz (bloco escrito, pra ficha e pro Avatar Pro)
Escreva a voz em mecânica, pelo menos 5 destas 6: altura (grave, sentada no peito), textura (rouca, limpa, gasta na borda), ritmo (sem pressa, em rajadas curtas), volume (nunca levanta a voz, sobe só em [palavra]), fim de frase (cai no fim e fica lá; fala de anúncio sobe, fala de gente cai) e sotaque pela boca e por uma CIDADE do país do personagem, nunca só "voz brasileira" ou "voz mexicana" (R enrolado pra trás no fim da sílaba; S chiado; T antes de I chiando). Nenhuma palavra de emoção (feliz, brava, empolgada).
> Exemplo: "Voz de mulher de 54 anos, média pra grave, gasta na borda. Sem pressa, as palavras se amontoam quando conta um erro que viu. Toda afirmação cai no fim e fica lá. Sotaque de Belo Horizonte: R do fim da sílaba enrolado pra trás, vogal átona final fechada, come o fim das palavras ('cê põe', 'ocê')."

## §Fotos fixas (generate_image, `model: gpt-image-2.5-sunburst`, `quality: 1K`, 9:16, rosto em referenceImages)
Sempre mande `model` e `quality`: sem eles a Avatrix usa o modelo padrão, que custa ~18 créditos por foto em vez de ~4. Vale também pras 2 imagens da prova.
```
Raw vertical 9:16 phone photo of the same <idade> <nacionalidade> <who> from the face reference: <string de identidade>, <figurino>. <QUADRO>. Natural matte skin with real pores and small marks, no beautification. <luz da ficha>. Clean frame, no text.
```
Os 3 quadros (`<QUADRO>`; a foto no lugar não se gera mais: o lugar vai em texto em toda imagem):
1. Rosto: "Head and shoulders, facing the camera, neutral mouth, plain light grey wall behind".
2. Corpo: "Full body standing, arms relaxed, plain light grey wall behind, feet visible".
3. Com o objeto: "Chest-up holding <o objeto> toward the lens with both hands, <lugar da ficha> softly behind".

## §Imagem de partida (generate_image, gpt-image-2.5-sunburst, 1K, 9:16)
`referenceImages` na ordem do passo 6 (S/references/geracao.md): rosto do personagem, corpo, o objeto (só na cena dele) e, em cena com outro personagem, o rosto dele. Fora da cena do gancho, o quadro do viral não entra como referência: o enquadramento, a câmera e a posição do objeto vão descritos em texto, olhando o quadro. Molde:
```
The person is the <who> from reference image 1 (face) with the body of reference image 2: <idade>, <string de identidade>, <figurino>. Keep the face exactly as in reference image 1. Place: <lugar da ficha, 1 frase concreta com 3 ou 4 objetos e a luz>. Framing, copied from the source shot: <enquadramento e altura da câmera do quadro do viral, ex.: chest-up shot from slightly above, centered>, <onde está o objeto no quadro>. <O que as mãos fazem, no meio do gesto, com o objeto do viral descrito de verdade (material, cor, tamanho)>. <Para onde olha>, mouth open mid-sentence. Hands well formed with five fingers each. Raw vertical 9:16 phone photo, natural flat daylight, everything in focus, real skin texture, no studio gloss. No captions, no subtitles, no watermark, no logo, no flag.
```
Os números de "reference image N" seguem a ordem da lista mandada em `referenceImages`: sem a foto do corpo, tire "with the body of reference image 2" e as imagens seguintes sobem uma posição. Na cena do fecho (com a foto do objeto), some "The <objeto> is the one in reference image <N>." antes das mãos.
Cena que no viral não tem gente: "<who> holds <o objeto> in front of the chest, <o objeto> fills the lower half of the frame".
Cena com outro personagem (`elenco`): depois da frase do personagem, "The second person is the <who 2> from reference image <N> (face): <idade>, <string de identidade dele>, <figurino>. Keep this face exactly as in reference image <N>." e onde ele está e o que faz no quadro. Quem não fala no começo da cena fica "lips resting together, eyes on <Nome>".

## §Imagem do gancho (a 1ª cena; generate_image, gpt-image-2.5-sunburst, 1K, 9:16)
O 1º quadro decide se a pessoa para de rolar: a imagem do gancho copia a composição do quadro 0 do viral, com o personagem, o lugar e o objeto dele. `referenceImages` = [o quadro 0 do viral (o fileId do `extract_video_frame`, guardado no `viral.md`; o `R/viral/quadros/c00.jpg` é só pra você olhar), o rosto, o corpo (se existe), o objeto (só se o roteiro põe ele nesta cena)] e, se o quadro tem 2 pessoas e o aluno escolheu um personagem salvo pra outra, o rosto dele por último. Os números de "reference image N" do molde seguem a posição de cada foto nessa lista; com a foto do objeto, escreva "The object becomes the one in reference image <N>: <o objeto descrito>". O quadro vai PRIMEIRO: no fim da lista, a imagem sai parecida com o viral, nunca igual. Molde:
```
Reference image 1 is the frame to copy: reproduce exactly its framing, scale, camera angle and height, the pose, where the hands and the object are, where the eyes look and the number of people, and lock the position of everything. Only three things change. The person becomes the <who> from reference image 2 (face) with the body of reference image 3: <idade>, <string de identidade>, <figurino>; keep the face exactly as in reference image 2. The object becomes <o objeto do personagem, descrito de verdade: material, cor, tamanho>. The place becomes <lugar da ficha, 1 frase concreta com 3 ou 4 objetos e a luz>. <O problema que a fala cita, visível na imagem>. Hands well formed with five fingers each. Raw vertical 9:16 phone photo, natural flat daylight, everything in focus, real skin texture, no studio gloss. No captions, no subtitles, no watermark, no logo, no flag.
```
- Sem a foto do corpo, tire "with the body of reference image 3"; as seguintes sobem uma posição.
- **Copiar o quadro é o piso.** O problema que a fala cita tem que estar NA imagem, e mais forte que no viral quando der (a planta bem amarela, a parede bem manchada). Esse estado continua igual nas cenas seguintes: escreva ele no prompt delas.
- Quadro com 2 pessoas e outro personagem salvo fazendo a 2ª: troque "Only three things change." por "Only four things change." e some, depois da frase da pessoa, "The second person becomes the <who 2> from reference image <N> (face): <idade>, <string de identidade dele>, <figurino>; keep this face exactly as in reference image <N>." (N = a posição do rosto dele na lista: o último) Quadro com 2 pessoas e a cena só com o personagem (o aluno escolheu assim): troque "and the number of people" por "with only one person in the frame, the <who>, where the person who speaks is".
- Quadro só de mãos, sem rosto: o gancho também é só as mãos do personagem.
- Texto, figurinha e marca do quadro não passam pra imagem (o fim do molde segura). O quadro traz o rosto de outra pessoa: no portão do rosto (S/references/geracao.md, passo 6), olhe essa imagem com mais cuidado.

## §Vídeo Persona Pro (generate_video, avatrix-persona-pro, audio_to_video; cena de 1 pessoa falando)
Formato em 6 blocos (é o que faz o modelo manter rosto, lugar e a fala do áudio). A foto do rosto mandada como 2ª, quando o rosto deriva, já está coberta pela frase "Any other picture":
```
subject_definitions:
<Subject 1> is the <who> in <Picture 1> (<Nome>): <idade>, <string de identidade>, <figurino>. Any other picture shows <Subject 1> from another angle.
<Subject 2> is the <lugar> in <Picture 1>: <3 ou 4 objetos do lugar>.
<Picture 1> is the first frame of [Shot 1]: keep its composition, the people, their clothes, the objects, the place and the light exactly as they are.
<Audio 1> is the complete <nacionalidade> <Idioma> speech track: <Subject 1> (S1) speaks it.

summary:
[keyframe completion + reference generation + audio reuse] The target video is one handheld shot of <Subject 1> in <Subject 2> starting from <Picture 1>, speaking the line carried by <Audio 1>.

retention_analysis:
<Subject 1> (appears in [Shot 1]): fully_preserved - facial identity, <marcas> and clothes stay exactly the same for the whole shot.
<Subject 2> (appears in [Shot 1]): fully_preserved - the place, the props and the light stay frozen, with no invented elements.
<Picture 1> ([Shot 1] first frame): fully_preserved - the shot starts from this exact frame.
<Audio 1>: fully_copy - <Audio 1> is reused 1:1 as the target video's complete final audio track.

detailed_description:
The target video has a raw, realistic phone-camera look with natural daylight, real skin texture and no studio gloss. The phone is held by a relative standing in front of <him|her>, with a slight natural handheld sway and no cuts. Only <Subject 1> speaks. No subtitles or on-screen text.
[Shot 1] <Enquadramento>. <Subject 1> <a ação da cena em 3 ou 4 batidas que acompanham a fala: "on '<palavra>' <he|she> lifts the <objeto>; on '<palavra>' <he|she> taps it; ...">, while <he|she> keeps talking to the lens. On the last line <he|she> points at the lens. <Subject 1> (S1) says with natural synchronized mouth movement, in the exact voice and timing of <Audio 1>, <d>[<Idioma>] <a fala inteira da cena, palavra por palavra a do áudio></d> The character says this line only once. After the last word, the character stays silent with the mouth closed and keeps the action going until the video ends: no second line, no repetition, no mumbling. Hands are well formed with five fingers each.

overall_soundscape:
The complete soundtrack is <Audio 1> reused 1:1, with no added music or sound effects.

non_diegetic_music:
N/A
```
Por que câmera na mão e ação em batidas: em teste, a câmera parada no tripé, com a ação descrita de uma vez só, saiu devagar, monótona e com cara de IA. Passou com a câmera na mão de um parente, balançando de leve, o gesto com o objeto marcado em 3 ou 4 palavras da fala e o fecho apontando pra lente. Se o viral é claramente gravado com o celular apoiado, siga o viral, mas mantenha as batidas.

Outro personagem que só reage, na mesma imagem: some em subject_definitions "<Subject 3> is <Nome 2> in <Picture 1>: <string de identidade dele>.", em retention_analysis a linha dele igual à de <Subject 1>, troque "Only <Subject 1> speaks." por "Only <Subject 1> speaks; <Subject 3> keeps <his|her> lips closed." e diga no [Shot 1] o que ele faz enquanto ouve ("<Subject 3> listens and nods once on '<palavra>'").

## §Diálogo (cena de 2 pessoas falando; Persona Pro)
O formato que o Persona Pro segue com 2 falantes (é o da própria ferramenta: fora dele, a 1ª fala costuma sair muda). Um pedido só pra cena inteira, com o corte escrito: não parta em 2 pedidos.
- `referenceImages` = [o rosto de quem fala primeiro, o rosto do outro, a imagem da cena (o taskId em `cenas.NN.imagem`; o `R/imagens/NN.png` é a cópia pra olhar)]: as pessoas na ordem em que falam e o lugar por último. Aqui nenhuma é o 1º quadro: o vídeo parte dos rostos e do lugar, e o 1º quadro pode sair diferente da imagem. Por isso, no gancho, prefira a 2ª pessoa só reagindo e o diálogo a partir da cena 02 (S/references/viral-e-roteiro.md, passo 3).
- `audioUrl` = a `juntada` da cena (as frases dos dois, na ordem, numa fala só).
- O corte é o segundo que o `join_audio` devolveu entre a última frase de um e a 1ª do outro ("At 00:02.400"): cai no meio do silêncio entre as duas falas. Frases seguidas da mesma pessoa vão no mesmo `<d>`, sem corte.
```
subject_definitions:
<Subject 1> is <Nome 1> from <Picture 1>, preserving <his|her> face, hair and clothes: <string de identidade 1>.
<Subject 2> is <Nome 2> from <Picture 2>, preserving <his|her> face, hair and clothes: <string de identidade 2>.
<Subject 3> is the <lugar> from <Picture 3>, with the same <3 objetos do lugar> and light.
<Audio 1> is the complete <nacionalidade> <Idioma> dialogue track: <Subject 1> (S1) speaks first, then <Subject 2> (S2).

summary:
[reference generation + audio reuse] A vertical 9:16 scene in <Subject 3> that reuses <Audio 1> 1:1 as the complete final audio track, with a hard cut from <o plano 1, ex.: a two-shot at the table> to <o plano 2, ex.: a close-up of Subject 2>.

retention_analysis:
<Subject 1> (appears in [Shot 1]): fully_preserved - face, hair and clothes are retained.
<Subject 2> (appears in [Shot 1], [Shot 2]): fully_preserved - face, hair and clothes are retained.
<Subject 3> (appears in [Shot 1], [Shot 2]): fully_preserved - the place and the light are retained.
<Audio 1>: fully_copy - <Audio 1> is reused 1:1 as the target video's complete final audio track.

detailed_description:
Only the person who is speaking moves the mouth; the other keeps <his|her> lips closed. Nobody looks into the lens. No subtitles or on-screen text.
[Shot 1] <Plano 1>. <Subject 1> (S1) <o gesto> and says, <d>[<Idioma>] <as frases de S1, palavra por palavra a do áudio></d> <Subject 2> keeps <his|her> lips closed.
[Shot 2] At <00:0X.XXX>, the shot cuts to <plano 2> of <Subject 2> (S2). <O gesto> and says, <d>[<Idioma>] <as frases de S2></d> <His|Her> lips close after the last word. <Subject 1> does not speak.

overall_soundscape:
The complete soundtrack is <Audio 1> reused 1:1, with no added music or sound effects.

non_diegetic_music:
N/A
```
- Mais uma troca de quem fala: mais um `[Shot N]` com o corte dela, e em "appears in" os shots em que cada um aparece.
- "Nobody looks into the lens" vale quando os dois conversam. No viral em que alguém fala pra câmera, escreva pra onde cada um olha em cada shot.
- Na reserva, a mesma cena vai em §Vídeo Avatar Pro com a fala, com as duas pessoas.

## §Vídeo Avatar Pro com a fala (generate_video, avatrix-avatar-pro, audio_to_video; a reserva)
A voz e o tempo saem iguais aos do áudio (`audioUrl` = a mesma `juntada`), então não há voz pra descrever nem troca de voz depois. A fala vai escrita, a mesma do áudio, entre aspas dentro do `<d>`; sem ela a ferramenta recusa antes de cobrar. `referenceImages` = a imagem da cena (1 basta: ela dá o lugar e o enquadramento). Molde de 1 pessoa:
```
<Subject 1> is <Nome> from <Picture 1>, keeping <his|her> face and appearance: <idade>, <string de identidade>, <figurino>.
<Audio 1> is the complete speech track of <Subject 1> (S1) and is reused 1:1 as the final audio.

[Shot 1]
<Enquadramento>, <a câmera do viral; sem pista, static camera>. <Subject 1> <a ação da cena em 3 ou 4 batidas com a fala>. <Subject 1> (S1) looks at the lens and says, in the exact voice and timing of <Audio 1>:
<d>[<Idioma>] "<a fala inteira da cena, palavra por palavra a do áudio>"</d>
Lips closed after the line.

[Mandatory]
Only ambience and voices; no music, subtitles, text, watermark or logo.
```
- 2 pessoas: `referenceImages` = [o rosto de quem fala primeiro, o rosto do outro, a imagem da cena], como no §Diálogo (até 4 fotos); "<Subject 1> is <Nome 1> from <Picture 1>, ..." e "<Subject 2> is <Nome 2> from <Picture 2>, keeping <his|her> face and appearance: ...", mais "<Picture 3> is the place: the same <lugar>, framing and light."; a linha do áudio vira "<Audio 1> is the complete dialogue track: <Subject 1> (S1) speaks first, then <Subject 2> (S2); it is reused 1:1 as the final audio."; e cada fala vai com o dono, na ordem: "<Subject 2> (S2) says:" + o `<d>` dela + "Lips closed after the line.". É o formato menos testado: na 1ª cena assim, confira a boca de cada um antes do lote.

## §Vídeo Avatar Pro sem áudio (generate_video, avatrix-avatar-pro, ref_images; só personagem sem voz no idioma)
A fala vai escrita no prompt; a voz é descrita uma vez, igual em todas as cenas (o modelo inventa a voz, e a troca de voz depois põe a do personagem). As instruções vão neste formato; a fala fica no idioma do personagem:
```
<Subject1><Nome>是<Picture 1>中<who em chinês: idade, string de identidade, figurino>，保留参考图中的面部特征、身材比例以及整体外貌。
<Subject1>，S1 始终使用一种固定的声音：<o bloco §Voz, traduzido>；从头到尾同一个音调。只说<idioma em chinês>。

场景、构图、道具位置和光线与<Picture 1>完全一致：<o lugar>。固定机位，三脚架，镜头完全不动，不切镜头，背景不变。

[Shot 1]
<enquadramento e a ação da cena, com o objeto>，边做边说：
<Subject 1> (S1) says:
<d>[<Idioma>]<a fala></d>

【禁止项】
字幕/UI/水印/Logo/角标

【强制声明】
无背景音乐，仅保留环境音与人声；台词只说一遍，不重复任何词，说完闭嘴继续动作；双手正常，每只手五根手指。
```

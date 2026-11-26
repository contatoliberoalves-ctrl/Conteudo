# Direção de cena

A skill não descreve a cena: ela dirige. Antes de qualquer imagem, cada clipe ganha uma ficha de direção. O storyboard, o vídeo e os críticos seguem essa ficha. A base é o método do diretor de shotlist (mise-en-scène, ritmo, atuação, continuidade, câmera), aplicado à novelinha.

## Ficha de direção por clipe (vai em direcao.md, uma por clipe)

| Campo | O que escrever | Exemplo |
|---|---|---|
| **O que o viral faz neste bloco** | a ação e o enquadramento do bloco do viral, olhando os quadros dele | "o vilão chega andando de perfil na chuva em direção às vítimas; elas reagem lá de dentro" |
| **O que o público sente** | uma emoção só | "perigo chegando, e a vítima não percebe" |
| **Onde cada um está** (mise-en-scène) | posição no cenário, distância, o que tem entre eles, para onde estão virados | "Dona Cida do lado de fora, na chuva, a um passo da porta; Seu Tonho dentro, segurando a porta entreaberta; Bia no fundo do corredor, meio escondida pela parede" |
| **Para onde cada um olha** | sempre para alguém ou para algo da cena, nunca para a câmera | "Dona Cida olha para o Seu Tonho; Seu Tonho olha para a Dona Cida; Bia olha para a Dona Cida, por cima do ombro dele" |
| **Atuação por fala** | gesto concreto e o que a pessoa esconde, não o adjetivo. A foto do 1º quadro já é o meio do gesto, com a mão ocupada (foto parada vira "cabeça parada com zoom lento" no vídeo). Emoção forte não entra como palavra ("furiosa", "apavorada" viram olho brilhando): entra como o que o corpo faz | Não "Dona Cida simpática", e sim "sorriso só com a boca, olhos parados, segura a garrafa com as duas mãos colada ao peito". Não "Bia com medo", e sim "aperta a manga do cardigã, fala baixo e rápido sem tirar os olhos da Dona Cida" |
| **Câmera** | lente, altura, de onde vê, se mexe e por quê | "por cima do ombro do Seu Tonho, à altura do olho, vendo a Dona Cida na chuva; aproxima devagar no rosto dela quando ela sorri" |
| **Luz e clima** | de onde vem a luz, chuva, cor | "luz quente do corredor batendo na Dona Cida molhada; chuva azul atrás" |
| **Continuidade** | o que vem do clipe anterior: molhado, objeto na mão, humor | "a garrafa térmica segue na mão dela" |

## Regras que a novela de sucesso segue

1. **Ninguém olha pra câmera.** Cada um olha para quem fala ou para o que importa na cena. O olhar é escrito pessoa por pessoa, dentro da linha dela ("eyes on <nome>"), nunca como regra solta no fim do prompt (no fim o modelo ignora). Quem fala fica até três quartos virado pra câmera, com os olhos no parceiro; quem está de costas é quem escuta. A única exceção é o vilão dar UMA olhada rápida pro público, e só quando o viral faz isso.
2. **Ninguém enfileirado: 3 camadas.** Primeiro plano de costas ou três quartos, um pouco desfocado (quem escuta); plano do meio nítido (quem fala); fundo pequeno, meio escondido por porta ou parede. Por cima do ombro é o plano padrão de diálogo. Algo entre eles (porta, mesa, corredor).
3. **A expressão é a do momento, não neutra:** quem está sendo enganado fica à vontade e confiante; quem avisa, tenso e contido; o vilão é doce na frente da vítima e frio quando ela vira as costas. Contenção por padrão: um olhar vale mais que um grito.
4. **Cada plano tem um motivo:** close quando a emoção importa, por cima do ombro em diálogo, aberto pra mostrar quem está onde. É o mesmo tipo de plano do bloco do viral.
5. **O close sai da posição do plano aberto:** quem está à esquerda no aberto continua à esquerda no close (regra dos 180°).

## Como entra no prompt

- **Storyboard (prompts.md §Storyboard):** em cada quadro, a posição, o olhar e o gesto da ficha. Exemplo: "Frame 1: close-up of Dona Cida over Seu Tonho's shoulder, she looks at him, smile with the mouth only, still eyes, both hands holding the thermos to her chest".
- **Vídeo (prompts.md §Vídeo):** em cada "Shot", o gesto concreto de quem fala e a reação de quem escuta, e para onde cada um olha. Termina com: "Nobody looks at the camera."

## O que o crítico confere (crítico da cena e do clipe)

- Alguém olhando para a câmera ou posando? **Mata.**
- A expressão de cada um bate com o que o público deve sentir no bloco? Expressão neutra ou errada **mata** (ex.: a vítima com cara de medo antes da hora).
- As posições batem com a ficha e fazem sentido no cenário? Os personagens estão em profundidades diferentes?
- O plano é o mesmo tipo do plano do viral?
- **No clipe:** o último segundo (o modelo vira o rosto pra lente no fim mesmo com o olhar escrito: corta 1 s antes se acontecer); boca de quem não fala mexendo; 1º quadro contra o último (copo, porta, janela trocaram de lugar? o lado de cada um no eixo mudou?); nada de câmera lenta.
- Nota de 0 a 10. Passa com 7 ou mais e nada que mate.

## Regras que o mercado repete

1. **Identidade é uma string de substantivos repetida palavra por palavra** em todo prompt (ficha → storyboard → vídeo): "black wool beret, thick grey moustache, blue-and-beige plaid shirt". Rosto pequeno no quadro é âncora fraca: abaixo de 15% da altura do quadro a identidade escapa; no vídeo, rosto com pelo menos 1/3 da altura nos closes (medido: 0,27 de semelhança sem close de rosto, 0,60 com).
2. **Imperfeição com causa, pelo menos 2 por personagem**, pele fosca: "preserve minor facial blemishes, no beautification, natural skin texture". "Perfeito demais é falso" (ai-shortfilm, zy-cinematic-realism, Dan Kieft 670 mil views, LoRAs mais baixadas do Civitai).
3. **Um beat por plano de 3 a 10 s, fala curta uma vez.** O modelo apaga a expressão quando o plano tem mais de 2 ou 3 beats (o rosto congela); virada de emoção vem atrás de um piscar.
4. **Luz de fonte real, de um lado, igual na cena inteira**; nada de contraluz, neon, flare ou recorte decorativo sem causa (zy, DirectorSKILL F12).
5. **O quadro tem que funcionar depois de tirar "cinematic", marca de câmera, "8K" e grão** (zy): o que segura é a mecânica (mm, abertura, paleta, fonte de luz).
6. **Conserto de quadro é "CHANGE ONLY / PRESERVE EXACTLY":** ao refazer uma cena reprovada, diga o que muda e liste o que fica igual, palavra por palavra.
7. **Duas escolas de "real":** documental (grão, flash duro, tremida, enquadramento torto) e dorama polido (pele lisa sem brilho, sem grão). Escolha uma por série e trave na frase de estilo. Elas concordam em: pele não plástica, luz com fonte e uma frase de estilo única.
8. **Prévia barata antes do caro** (SEED HUNTER, 40 mil downloads/mês): 3 prévias em baixa, escolhe 1, só então a cara. Na skill isso é o storyboard de 4 quadros, bem mais barato que o vídeo, antes do vídeo.

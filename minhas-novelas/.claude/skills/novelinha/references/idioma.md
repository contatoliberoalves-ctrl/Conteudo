# Idioma da novela (pt, es, en)

A novela sai em um de três idiomas: **português (`pt`, o padrão)**, **espanhol (`es`)** ou **inglês (`en`)**. Este arquivo é o único lugar com o que muda de um idioma pro outro. O resto da skill está escrito em português, mas vale igual nos três.

## Como decidir e gravar
- **A conversa com o aluno** é sempre no idioma em que ele escreve (Regra 7 da skill). Escreveu em espanhol, a skill responde em espanhol; em inglês, em inglês. Na dúvida, português.
- **O idioma da novela** (`idioma` no estado.json) é o da conversa, a não ser que o aluno peça outro ("quero a novela em espanhol", "make it in English"). Pode ser diferente da conversa: um aluno brasileiro pode fazer uma novela em inglês, e a conversa continua em português.
- Grave `"idioma": "pt" | "es" | "en"` no estado.json na primeira fase e na ficha da série (no site). **Não muda dentro da série:** a Parte 2 herda o idioma da Parte 1. Estado.json sem o campo (série de versão antiga) = `pt`.
- Idioma fora desses três: diga que a skill faz pt, es e en e pergunte qual dos três.

## O que troca nos pedidos aos modelos
Os pedidos (prompts) são sempre em inglês. Só a fala, a marca da fala e as palavras de país mudam. Use a coluna do idioma gravado, sem misturar:

| Campo nos modelos de S/references/prompts.md | `pt` | `es` | `en` |
|---|---|---|---|
| `<IDIOMA>` (marca da fala, dentro do `<d>`) | `[Portuguese]` | `[Spanish]` | `[English]` |
| `<TRILHA>` (o `<Audio 1>` do Persona Pro) | `Brazilian Portuguese dialogue track` | `Latin American Spanish dialogue track` | `American English dialogue track` |
| `<SOTAQUE>` (entrega da fala no Persona Pro) | `natural Brazilian Portuguese delivery` | `natural Latin American Spanish delivery` | `natural American English delivery` |
| `<PAIS>` (nacionalidade do personagem e da novela) | `Brazilian` | `Mexican` | `American` |
| `<TV>` (o gênero da cena) | `Brazilian TV drama` | `Latin American TV drama` | `American TV drama` |
| `<NOVELA>` (estilo da cena no Persona Pro) | `Brazilian telenovela` | `Latin American telenovela` | `American TV micro-drama` |
| Fim do vídeo, parte que continua (`montar.py --idioma`, sai sozinho) | `CONTINUA...` / `Comenta PARTE N` | `CONTINUARÁ...` / `Comenta PARTE N` | `TO BE CONTINUED...` / `Comment PART N` |
| Fim do vídeo, última parte (`montar.py --fim segue`) | `ME SEGUE` / `que tem mais novela` | `SÍGUEME` / `que hay más novelas` | `FOLLOW ME` / `for more dramas` |
| Última fala da última parte (o protagonista olhando pra câmera) | "Gostou? Me segue, que tem mais." | "¿Les gustó? Síganme, que hay más." | "Liked it? Follow me, there's more." |
| Cartela antiga (`montar.py --fim cartela`) | `PARTE N?` | `PARTE N?` | `PART N?` |
| Nome do arquivo que o aluno baixa (vídeo final, teste, storyboard) | `parte-1.mp4`, `parte-1-teste.mp4`, `storyboard-01.png` | `parte-1.mp4`, `parte-1-prueba.mp4`, `storyboard-01.png` | `part-1.mp4`, `part-1-test.mp4`, `storyboard-01.png` |

- Espanhol: o padrão é o mexicano (o maior público de novela em espanhol). Se o aluno disser o país (Colômbia, Argentina, Espanha...), troque o `<PAIS>` pelo dele (`Colombian`, `Argentine`, `Spanish`) e, na Espanha, `<TRILHA>` vira `Castilian Spanish dialogue track` e `<SOTAQUE>` `natural Castilian Spanish delivery`.
- Inglês: o padrão é o americano. Aluno do Reino Unido: `British`, `British English dialogue track`, `natural British English delivery`.
- Personagem de fruta ou bicho não tem país: tire o `<PAIS>` da linha dele e deixe o resto.
- **A fala** é escrita no idioma da novela, como se fala na rua desse lugar (no espanhol mexicano, "ándale", "mijo"; no inglês, contrações: "you're", "don't"). Nunca traduza a fala ao pé da letra do português: escreva direto no idioma.
- **Ficha de voz fixa** (fase 3): a mesma régua, com o `<PAIS>` do idioma. Exemplos: `pt` "a 55-year-old Brazilian woman, low warm alto, soft and sweet, slightly husky, slow unhurried pace, quiet volume, every sentence ending low and calm"; `es` "a 55-year-old Mexican woman, low warm alto, ..."; `en` "a 55-year-old American woman, low warm alto, ...".
- **Voz salva (Persona Pro e troca de voz):** no `list_voices`, escolha com o aluno uma voz que fala o idioma da novela. Voz brasileira lendo espanhol ou inglês sai com sotaque: o "é essa a voz?" do aluno é o portão. Sem voz no idioma no `list_voices`: use o Avatar Pro, em que a voz sai do próprio vídeo.
- O Kling 3.0 só fala inglês: numa novela `en` ele deixa de ser exceção, mas continua fora do padrão (a skill só usa se o aluno pedir pelo nome).

## Achar o viral (fase 0), por idioma
Os 3 sinais de que vale clonar e a janela das últimas 2 semanas valem nos três idiomas.

| | `pt` | `es` | `en` |
|---|---|---|---|
| Hashtags do TikTok | #novelaia, #novelinhaia, #noveladasfrutas, #frutasfalantes, #novelasIA, #dramaia, #minisserie | #novelaia, #novelasconia, #telenovelaia, #historiasconia, #dramaia, #miniserie, #frutinovelas | #aidrama, #aistory, #aishortfilm, #microdrama, #fruitdrama |
| Busca | "novelinha parte 1" | "novela ia parte 1" | "ai drama part 1", "ai story part 1" |
| Sinal de série no título | "Parte 1", "Ep 1" | "Parte 1", "Capítulo 1" | "Part 1", "Ep 1" |

As hashtags de `pt` saíram do estudo de 05/11/2026. As de `es` e `en` são o ponto de partida, não medidas do mesmo jeito: se a página de uma estiver vazia ou velha, use a busca e siga os 3 sinais.

**Sem link (molde de S/references/regras-da-novelinha.md §Molde):** "A carona do mal" é um viral brasileiro. Em `es` e `en`, use o mesmo mecanismo bloco a bloco, com a história e as falas novas no idioma da novela, e diga que o molde é "un viral brasileño de 5,4 millones de vistas" / "a Brazilian viral with 5.4 million views".

## Postar (fase 7), por idioma
| | `pt` | `es` | `en` |
|---|---|---|---|
| 1ª linha da legenda | "Parte 1 \| <título com a injustiça>" | "Parte 1 \| <título>" | "Part 1 \| <title>" |
| Legenda (frase que dá raiva e pergunta) | "Ele avisou. Ninguém acreditou." / "Você abriria a porta pra ela?" | "Él avisó. Nadie le creyó." / "¿Tú le abrirías la puerta?" | "He warned them. Nobody listened." / "Would you let her in?" |
| Hashtags (3 a 6) | #novelinha #novelaia #novelinhaia #parte1 | #novelaia #telenovela #historiasconia #parte1 | #aidrama #microdrama #aistory #part1 |
| Comentário fixado, parte que continua | "Você perdoaria ela? 👇 Quer a PARTE 2? Comenta PARTE 2!" | "¿Tú la perdonarías? 👇 ¿Quieres la PARTE 2? ¡Comenta PARTE 2!" | "Would you forgive her? 👇 Want PART 2? Comment PART 2!" |
| Comentário fixado, última parte | "Gostou? Me segue, que amanhã tem novela nova!" | "¿Te gustó? ¡Sígueme, que mañana hay novela nueva!" | "Liked it? Follow me, a new drama drops tomorrow!" |
| Nunca escrever (Regra 8 d) | "comenta que eu te mando a parte 2 no direct" | "comenta y te mando la parte 2 por DM" | "comment and I'll DM you part 2" |

Antes de mandar a legenda e o comentário fixado, releia no idioma deles: promete mandar a parte por direct ou DM? Reescreva. A próxima parte sai no perfil, de graça.

## O "sim" do aluno
O que libera uma geração é o "sim" no idioma do aluno: **"sim"** em português, **"sí"** em espanhol (ou "si" sozinho, ou "si," no começo da resposta), **"yes"** em inglês. "Pode gerar", "puedes generar", "go ahead" também liberam. "Gostei", "me gusta", "ok", "nice" não liberam (Regra 1). A trava do Claude Code (S/scripts/trava-sim.sh) aceita as três palavras.

## Frases fixas pro aluno
O texto da skill traz cada frase fixa em português. Em `es` e `en`, use estas, com as mesmas regras. Rótulo de botão do Claude: use o que aparece na tela do aluno; os desta tabela são os da central de ajuda do Claude (14/11/2026) e podem mudar.

| Onde | `es` | `en` |
|---|---|---|
| Abertura | "novelinha v<N>. Solo gasto créditos después de que escribas sí." | "novelinha v<N>. I only spend credits after you type yes." |
| Abertura, no site | "Vamos a esbozar la temporada y hacer toda la Parte 1 en esta conversación. Para la Parte 2, vuelve aquí." | "We'll sketch the season and make the whole Part 1 in this chat. For Part 2, come back to this chat." |
| A 1ª pergunta | "Mándame el link de una novela que se esté haciendo viral (TikTok, Reels, Shorts, Facebook) o cuéntame tu idea. ¿No tienes link? Te enseño a encontrar uno." | "Send me the link to a micro drama that's going viral (TikTok, Reels, Shorts, Facebook) or tell me your idea. No link? I'll show you how to find one." |
| Versão nova | "Salió la novelinha v<N>. Para actualizar, descarga novelinha.zip en https://github.com/avatrix-io/skills/releases/latest y súbelo de nuevo en Configuración > Plugins (o, en la pantalla antigua, Personalizar > Habilidades)." | "novelinha v<N> is out. To update, download novelinha.zip from https://github.com/avatrix-io/skills/releases/latest and upload it again in Settings > Plugins (or, on the old screen, Customize > Skills)." |
| Ligar a Avatrix (site) | "Vamos a conectar Avatrix, solo con clics: ve a Configuración > Plugins > Añadir > Añadir conector personalizado (en la pantalla antigua, Personalizar > Conectores > + Añadir > Añadir conector personalizado). En el nombre escribe Avatrix; en la URL pega https://avatrix.io/mcp. Dale Continuar hasta Añadir, entra a tu cuenta de Avatrix y haz clic en Permitir. Después abre una conversación nueva y escribe: haz una novelinha." | "Let's connect Avatrix, just clicking: go to Settings > Plugins > Add > Add custom connector (on the old screen, Customize > Connectors > + Add > Add custom connector). Name it Avatrix and paste https://avatrix.io/mcp as the URL. Click Continue until Add, sign in to your Avatrix account and click Allow. Then open a new chat and type: make a novelinha." |
| Rede (site) | "Ve a Configuración > Capacidades. Revisa que 'Ejecución de código y creación de archivos' (o 'Crear y editar archivos') esté activado. Activa la opción de usar internet al crear archivos y, en Sitios permitidos > Gestionar, añade *.avatrix.io (en la pantalla antigua: 'Permitir salida de red' y pega *.avatrix.io en los dominios permitidos). Después abre una conversación nueva, porque la red solo vale en conversación nueva." | "Go to Settings > Capabilities. Make sure 'Code execution and file creation' (or 'Create and edit files') is on. Turn on the option to use the internet when creating files and, under Allowed sites > Manage, add *.avatrix.io (on the old screen: 'Allow network egress', then paste *.avatrix.io in the allowed domains). Then open a new chat, because network access only applies to new chats." |
| Licença do site | "Para generar imagen o video, haz clic en Permitir una vez, cada vez, nunca en Permitir siempre. Para leer tu cuenta (créditos, personajes) puedes Permitir siempre, que no gasta nada." | "To generate an image or video, click Allow once, every time, never Always allow. To read your account (credits, characters) you can Always allow, it doesn't spend anything." |
| Ficha da série | "Guarda esto. Si la conversación se traba o se llena, abre una nueva, pega esta ficha y escribe novelinha continúa." | "Save this. If the chat freezes or gets full, open a new one, paste this sheet and type novelinha continue." |
| Limite do Claude | "Espera la hora que te muestra y escribe continúa, en esta misma conversación." | "Wait until the time it shows and type continue, in this same chat." |
| Total antes do 1º sim | "Parte 1 completa, 6 clips en Avatar Pro: ~N créditos. ¿La genero?" | "Whole Part 1, 6 clips on Avatar Pro: ~N credits. Should I generate it?" |
| Roteiro | "¿Sigo con este guion?" | "Can I go ahead with this script?" |

## Próximo passo (o curso)
O curso de S/references/proximo-passo.md é em português, pra quem está no Brasil. Em conversa `es` ou `en`, não fale do curso nem mande o link: nem no fim da fase 6b, nem quando o aluno perguntar de dinheiro (aí responda só a pergunta, curto, sem número e sem promessa).

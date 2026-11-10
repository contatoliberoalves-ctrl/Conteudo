---
name: molde-dorama
description: Gera posts do @cristaodorameiro (doramas com olhar cristão) na identidade Cristão Dorameiro (noite ameixa com luzes, creme hanji e rosa cerejeira; Fraunces + Plus Jakarta Sans; cruz na tela arredondada): carrossel 1080×1350 (dorama-carrossel), tela única (dorama-post) e nativo 3:4 com texto e figurinhas do Insta (dorama-nativo), nos formatos indicação, nota, meme, curiosidade e reflexão. Use quando pedirem post, carrossel ou story do "Cristão Dorameiro", "cristaodorameiro", ou indicar/dar nota a um dorama nesse perfil.
---

# Moldes do @cristaodorameiro

Identidade em `moldes/dorama-comum/` (leia o README de lá). Três moldes, cada um com README dos campos:

| molde | quando usar |
|---|---|
| `dorama-carrossel` | conteúdo com várias partes: indicação completa (capa cartaz → ficha → do que se trata → motivos → versículo → cta), nota (capa nota → boletim → o que ganhou/pesa → cta), memes de clichês, curiosidades numeradas, reflexão |
| `dorama-post` | uma imagem só: `indicacao`, `nota`, `meme`, `curiosidade`, `reflexao` |
| `dorama-nativo` | post com cara de feito no app (foto/cena + texto nativo + slider de nota, enquete, caixa de perguntas) |

## Capas com foto do dorama
No carrossel, a capa aceita a foto de uma cena de fundo: `estilo` `foto`, `cinema`, `moldura`, `vidro` ou `fotonota` (veja o README do molde). As fotos ficam em `moldes/dorama-comum/fotos/` (fora do git; peça ao usuário as cenas ou o link do Drive). Não baixe cenas das séries por conta própria. Os exemplos usam cenários da Coreia do Wikimedia Commons (`fotos/CREDITOS.txt`), com `credito` na capa. Confira o enquadramento (`fotoPos`) para o rosto não ficar atrás do título.

## Tom e conteúdo
- Português leve, de amiga dorameira, mas com fé: cada indicação/nota liga o dorama a um valor bíblico, sem forçar.
- Nota: sempre com **alertas** honestos para a família ("Beijos", "Violência leve", "Espíritos", "Linguagem") e, se fizer sentido, um critério "Visão de fé".
- Reflexão: um versículo (ARA/ARC, referência certa) + a ponte com uma cena do dorama + aplicação prática.
- **Fatos e curiosidades**: só o que você tem certeza (ano, nº de episódios, onde assistir, elenco). Na dúvida, deixe de fora ou pergunte. Cite a fonte em números de audiência.
- Hangul do título: confira a grafia; se não souber, omita o campo.

## Limites que cabem
- Títulos: até ~45 caracteres na capa (`ts` para diminuir); destaque 1–3 palavras em `*itálico*`.
- Lista: até 4 itens de ~90 caracteres. Boletim: até 6 critérios + até 4 alertas. Ficha: 4 itens.
- O render avisa "texto passa da área" (carrossel e post): encurte ou baixe `ts`/`corpo`.

## Gerar e conferir
```bash
cd moldes/dorama-carrossel && CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>
```
(Mesma coisa em `dorama-post` e `dorama-nativo`.) Abra os PNGs e confira. Post novo vai no fim do `dados.json`. Fotos (cenas, cartazes, fotos do autor) ficam em `moldes/dorama-comum/fotos/`, fora do git: sem elas, cartaz e cena saem tipográficos. Depois, atualize a galeria principal (seção "Cristão Dorameiro") como diz o `CLAUDE.md`.

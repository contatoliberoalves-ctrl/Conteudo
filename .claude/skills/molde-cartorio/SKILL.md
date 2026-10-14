---
name: molde-cartorio
description: Gera posts e materiais do Cartório do Registro Civil das Pessoas Naturais de Curral Queimado (Petrolina/PE, titular Líbero Alves Rodrigues Filho), na identidade do logo (carvão, prata escovada, papel claro, emblema da pena, Cormorant Garamond + Jost): carrossel 1080×1350 (cartorio-carrossel), tela única (cartorio-post) e PDF A4 (cartorio-pdf, com o guia de documentos para casar), e a linha "Cartório Amigo" para a população do povoado (cores quentes do sertão, letra arredondada, curiosidades, mito ou verdade, pergunta do povo, capa com foto feita em IA): cartorio-amigo-carrossel e cartorio-amigo-post. Use quando pedirem post, carrossel, comunicado, aviso, PDF ou material do cartório, de Curral Queimado, de registro civil, casamento civil, certidões ou habilitação.
---

# Moldes do Cartório de Curral Queimado

Base comum: `moldes/cartorio-comum/` (`marca.mjs`: cores, fontes, emblema, logo em texto e contatos; `pecas.mjs`: as peças 1080×1350; `render-base.mjs`). O emblema fica em `moldes/cartorio-comum/assets/emblema.png`, **fora do git**. Numa sessão nova, peça a arte do emblema sozinho em fundo escuro (a pena sobre o quadrado prateado) e rode `python3 moldes/cartorio-comum/preparar_logo.py <imagem>` (precisa do Pillow). Sem ele, os moldes geram com um quadrado prateado no lugar.

Contatos (em `CONTATO`, no `marca.mjs`): Rua Ponta da Serra, nº 25, Curral Queimado, CEP 56306-660, Petrolina/PE · (87) 98166-3179 · agendamento em registrocivil.net/76745. Não invente horário, preço ou serviço que o titular não tenha passado; use o texto dele literalmente, só distribuindo entre as peças. A fonte do conteúdo de casamento é o Google Doc "Documentos para casar - cartório".

Só se edita o `dados.json` de cada molde. Nos textos: `**negrito**` e `[[destaque]]` (itálico prata no carvão; itálico sublinhado no papel). Cada peça aceita `fundo` (`carvao` ou `papel`), `ts` (tamanho do título) e `corpo` (tamanho do texto).

| molde | tamanho | peças |
|---|---|---|
| `cartorio-carrossel` | 1080×1350 | `capa` (kicker, titulo, texto), `texto` (kicker, titulo, texto[]; texto curto sai maior), `lista` (kicker, titulo, itens[] como texto ou `{texto, obs}`, nota), `passos` (kicker, titulo, itens[]), `destaque` (kicker, titulo, `numeros: [{valor, rotulo}]`, `tv`, texto), `cta` (kicker, titulo, texto; mostra os contatos e o logo) |
| `cartorio-post` | 1080×1350 | `layout`: `aviso` (selo, chamada, texto[], valor), `frase` (texto, autor), `contato` (chamada), e também `lista` e `destaque` do carrossel. No post, `titulo` é o nome na galeria e o título da peça vai em `chamada` |
| `cartorio-pdf` | A4 retrato | `capa` {rotulo, titulo[] (uma linha por item), sub, ts}, `paginas[]` {kicker, titulo, texto, blocos[]}, `fim` (frase da contracapa). Blocos: `checklist` (titulo, itens, nota), `avisos`, `passos`, `valores` ({valor, rotulo}), `cards` ({titulo, texto, largo}), `lei` (titulo, ref, itens), `contato` |

Limites: título do carrossel até ~8 palavras (capa até ~10); listas até 4 itens de 2 linhas cada no papel; no PDF, cada item de `paginas` é uma folha, e o render avisa (`!`) quando o conteúdo encosta no rodapé: divida a página.

Gerar: `cd moldes/<molde> && CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]` (o Playwright vem de `moldes/treino-de-pecas/node_modules`; se faltar, `cd moldes/treino-de-pecas && npm install`). O script precisa terminar com ✓; com `!`, encurte o texto ou diminua `ts`/`corpo`. O PDF sai em `saida/<id>/<id>.pdf`. Depois, atualize a galeria principal (seção "Cartório") com `python3 galeria/atualizar.py <molde>` e faça commit.

## Cartório Amigo (para a população do povoado)

`cartorio-amigo-carrossel` e `cartorio-amigo-post`, peças em `moldes/cartorio-comum/amigo.mjs`. Mesmo emblema (num selo creme), mas sem o preto: creme, barro, sol, céu e verde da caatinga, títulos em Baloo 2 e texto em Nunito, tom de conversa ("a gente", "pra", "Você sabia?"). Conteúdo em forma de curiosidade sobre o que o cartório faz, com a base legal certa e sem prometer o que depende do caso. Nos textos: `**negrito**` e `[[destaque]]` (marca-texto amarelo).

| peça | campos |
|---|---|
| `capa` (carrossel) | `cor` (barro, ceu, verde, sol), `foto` (ex.: `fotos/<id>.jpg`), `icone` (sem foto: ilustração do sertão com o ícone), `selo` (padrão "Você sabia?"), `titulo`, `texto`, `ts`, `alturaFoto` |
| `texto` | kicker, titulo, texto[], `destaque` (caixa branca com fio amarelo) |
| `lista` | kicker, titulo, itens[] (bolinhas numeradas coloridas) |
| `mito` | kicker, `frase`, `resposta` (`mito` ou `verdade`), texto[] |
| `numero` | kicker, titulo, `valor`, `tv`, `rotulo`, texto, `cor` |
| `pergunta` | kicker, `pergunta`, `quem`, texto[] (resposta do cartório) |
| `cta` | `cor`, titulo (padrão "Ficou com dúvida? Fala com a gente!"), texto, `salve`; mostra WhatsApp, endereço e agendamento |

No post: `layout` = `curiosidade` (foto/ilustração em cima, `chamada`, texto, `cor`, `icone`, `foto`), `mito`, `pergunta`, `aviso` (`icone`, `selo`, `chamada`, texto, `cor`) ou `numero`. `titulo` é o nome na galeria.

Ícones: documento, caneta, bebe, aliancas, casa, calendario, lupa, coracao, pergunta, relogio, celular, familia.

Imagens: cada post tem `promptImagem` (foto realista, gente e paisagem do sertão nordestino, luz quente, sem texto nem logotipo; carrossel em 3:2, post em 16:9). O usuário gera na IA e manda; salve em `fotos/<id>.jpg` do molde (são imagens geradas, podem ir para o git) e gere de novo. Sem a foto, sai a ilustração.

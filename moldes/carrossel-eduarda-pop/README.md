# Carrossel Eduarda Pop

Carrosséis da Eduarda Caraciolo (Advogada · Direito Civil e ECA) inspirados nas referências que ela separou (studio_debs, Estúdio Huna, Jullia Scabello, phanystudio, Vick Machado, Amanda Fernandes). Quatro estilos, escolhidos no campo `estilo` do post.

**Mais branco que rosa:** capa pode ser rosa; as páginas seguintes ficam, em geral, em fundo branco, com um slide rosa de vez em quando para marcar ritmo.

**Regra da marca** (vale também para o `post-eduarda`): os rosas do Carrossel Eduarda Diva — **fúcsia `#EE2A8A`** (principal: títulos, faixas, balões, fundos fortes) e **orquídea `#F29AD8`** — com os claros `#FDEAF4` (blush) e `#F7B9E0`, e o **branco** como contracor; 3 fontes: Inter Tight (títulos e texto), Gloock (serifa) e Yellowtail (a cursiva do `*destaque*`). Todo estilo repete o cabeçalho EDUARDA CARACIOLO · ADVOGADA · CIVIL E ECA, o @ em pílula e o brilho ✦, para ornarem lado a lado no feed.


| estilo | cara | tipos de slide |
|---|---|---|
| `trend` (moderno) | capa blush quadriculada e páginas brancas, títulos pesados em caixa-alta rosa-escuro, caixas tracejadas arredondadas | `capa`, `texto`, `lista` (fundo pink), `item`, `era` (disco de vinil), `cta` |
| `studio` (moderno) | fundo branco (ou `fundo: "rosa"`), serifa Gloock rosa-escuro com palavra em cursiva, lista em pílulas numeradas, grade da semana e morcegos opcionais | `capa` (foto em cima), `texto`, `lista`, `item`, `faixa` (foto em cima e embaixo), `cta` |
| `scrap` (descontraído) | papel branco quadriculado, grotesca pesada em minúsculas, balões de fala pink, estrelas, papel rasgado blush, abas do perfil | `capa` (agenda + foto redonda), `item` (balão + papel rasgado), `janela` (cartão com fita), `lista` (moldura amarela), `legenda` (foto inteira + legenda rosa com emojis), `pergunta` (balão amarelo) |
| `blocos` (descontraído) | uma cor da paleta (ou branco) por slide, título em faixas, subtítulo em caixa-alta, pílulas, foto em cápsula embaixo | `capa`, `dica`, `lista`, `cta` (todos com o mesmo layout) |
| `chique` (profissional) | editorial em rosa vivo (`tom`: `framboesa` #C8175D ou `fucsia` #EE2A8A, fora da paleta-base, com branco e um vinho do mesmo tom), serifa grande, fios finos, moldura e numeração de página | `capa`, `texto`, `lista`, `compara` (2 colunas), `destaque` (citação), `cta` |

```
CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]
```
Saída: `saida/<id>/1.png … N.png` e `painel.png`. O render diminui título (até 70%) e texto (até 24px) se não couber e avisa se ainda estourar ou se faltar foto.

## Fotos
- `imagens/`: fotos CC0 do StockSnap usadas nos exemplos (créditos em `imagens/CREDITOS.md`). Ficam no git.
- `fotos/`: fotos da Eduarda, **fora do git** (repositório público); `fotos/LEIA.md` diz o nome de cada uma e o original no Drive. O render procura em `fotos/`, `imagens/` e nas `fotos/` dos outros moldes da Eduarda. Nas capas, só fotos em que ela aparece sozinha.
- Cultura pop (séries, cantoras): os posts `*-pop-legenda` esperam fotos que o usuário escolhe e coloca em `fotos/` (`pop-divorcio-1.jpg`…); não baixe foto de artista nem cena de série por conta própria (direito de imagem: art. 20 do CC e Súmula 403 do STJ).
- Para a `legenda` e a capa do `studio`, use foto vertical (retrato); foto deitada fica esticada.

## dados.json
Lista de posts: `id`, `titulo` (nome na galeria), `estilo`, `cor` (só `blocos`: cor padrão dos slides) e `slides`.

Marcação: `**negrito**`, `*destaque*` (cursiva Yellowtail em todos), `==caixa==` (pink no trend, rosa-claro no scrap), `{cor}` (pink no trend, sublinhado no scrap), `\n` quebra a linha. `ts` muda o tamanho do título.

Campos por tipo:
- **capaFoto** (qualquer estilo): foto dela inteira, **sem véu nem filtro**, com `kicker`, `titulo` (cada linha vira uma faixa branca) e `texto` por cima; `y` (`base`, `meio`, `topo` ou px), `alinhar: "esquerda"`.
- **fotoCrua: true** (qualquer slide com foto): usa a foto como veio (fotos de artista na `legenda`). **fotoSugestao**: sem o arquivo, o slide mostra "FOTO AQUI" com essa sugestão e o nome do arquivo esperado.
- **chique**: `tom` no post; `pagina` ("01"…) no rodapé; `compara`: `colunas: [{titulo, itens[]}, {…}]`.
- **capa**: `titulo`, `texto`, `foto`, `fotoPos`; trend: `kicker` (etiqueta) e, sem foto, tudo centralizado; studio: `kicker`, `fotoAltura`; scrap: `agenda: true` (agenda e abas do perfil, mais informação) e `dia`.
- **era** (trend): capa de álbum com o número da era; `numero`, `kicker`, `titulo`, `texto`, `cor` (pink, escuro, pessego), `selo`.
- **oab** (qualquer estilo): "Já caiu na OAB · 2ª fase de Civil"; `titulo`, `itens: [{exame: "9º", texto}]`, `texto`. Tirar os exames só de `materiais/` (análise dos exames 2 a 46).
- **capaFoto** com `fonte: "serif"`: título em serifa num cartão branco (mais chique).
- **studio** (todos os tipos): `fundo: "rosa"` (slide de destaque) e `enfeite: "morcegos"`.
- **texto**: `kicker`, `titulo`; trend: `caixa` (texto na caixa tracejada) e `destaque: true` (caixa rosa); studio: `texto`, `grade: true` (grade da semana).
- **lista**: `titulo`, `itens[]` (até 4–5); trend: `kicker`, `subtitulo`; studio: `texto` (frase de fechamento, alinhada à direita); scrap: `kicker`.
- **item**: `titulo`, `numero` (automático), `texto`; trend e scrap: `fala` (a fala da seguidora, entre aspas).
- **janela** (scrap): `titulo`, `fala`, `texto`.
- **legenda** (scrap): `foto`, `fotoPos`, `texto` (use `\n`; comece com `**Frase em negrito,**`), `y` (`topo`, `meio`, `base` ou px), `tam`, `emojis` (2, padrão 🥴 😵).
- **faixa** (studio): `titulo`, `texto`, `foto`, `foto2`.
- **pergunta** / **cta**: `titulo`, `texto`; trend/studio: `kicker`, `botao`.
- **blocos** (todos os tipos): `cor` (branco, blush, claro, pessego, pink, escuro), `titulo` (cada linha vira uma faixa), `sub`, `caixas[]`, `texto`, `colunas[]` (`{sim, titulo, texto}` → ✅/❌), `foto`, `fotoAltura`.

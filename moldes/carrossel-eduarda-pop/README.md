# Carrossel Eduarda Pop

Carrosséis da Eduarda Caraciolo (Advogada · Direito Civil e ECA) inspirados nas referências que ela separou (studio_debs, Estúdio Huna, Jullia Scabello, phanystudio, Vick Machado, Amanda Fernandes). Quatro estilos, escolhidos no campo `estilo` do post.

**Regra da marca** (vale também para o `post-eduarda`): só as 5 cores da paleta — `#FFEBED` blush, `#FEBAC5` rosa-claro, `#F4789A` rosa-escuro, `#FC79AB` pink, `#FEA9AC` pêssego — e o **branco** como contracor; 3 fontes: Inter Tight (títulos e texto), Gloock (serifa do studio) e Yellowtail (a cursiva do `*destaque*`). Todo estilo repete o cabeçalho EDUARDA CARACIOLO · ADVOGADA · CIVIL E ECA, o @ em pílula, o brilho ✦ e um véu rosa nas fotos, para ornarem lado a lado no feed.


| estilo | cara | tipos de slide |
|---|---|---|
| `trend` (moderno) | fundo blush quadriculado, títulos pesados em caixa-alta rosa-escuro, caixa pink com texto branco, caixas tracejadas arredondadas | `capa`, `texto`, `lista` (fundo roxo), `item`, `cta` |
| `studio` (moderno) | fundo rosa-escuro granulado, serifa Gloock branca com uma palavra em cursiva, etiquetas brancas em pílula, grade de semana inclinada | `capa` (foto em cima), `texto`, `lista` (etiquetas), `item`, `faixa` (claro, foto em cima e embaixo), `cta` |
| `scrap` (descontraído) | papel branco quadriculado, grotesca pesada em minúsculas, balões de fala pink, estrelas, papel rasgado rosa-escuro, abas do perfil | `capa` (agenda + foto redonda), `item` (balão + papel rasgado), `janela` (cartão com fita), `lista` (moldura amarela), `legenda` (foto inteira + legenda rosa com emojis), `pergunta` (balão amarelo) |
| `blocos` (descontraído) | uma cor da paleta por slide, título em faixas, subtítulo em caixa-alta, pílulas brancas, foto em cápsula embaixo | `capa`, `dica`, `lista`, `cta` (todos com o mesmo layout) |

```
CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]
```
Saída: `saida/<id>/1.png … N.png` e `painel.png`. O render diminui título (até 70%) e texto (até 24px) se não couber e avisa se ainda estourar ou se faltar foto.

## Fotos
- `imagens/`: fotos CC0 do StockSnap usadas nos exemplos (créditos em `imagens/CREDITOS.md`). Ficam no git.
- `fotos/`: fotos da Eduarda, **fora do git** (repositório público). O render procura em `fotos/`, `imagens/` e nas `fotos/` dos outros moldes da Eduarda.
- Para a `legenda` e a capa do `studio`, use foto vertical (retrato); foto deitada fica esticada.

## dados.json
Lista de posts: `id`, `titulo` (nome na galeria), `estilo`, `cor` (só `blocos`: cor padrão dos slides) e `slides`.

Marcação: `**negrito**`, `*destaque*` (cursiva Yellowtail em todos), `==caixa==` (pink no trend, rosa-claro no scrap), `{cor}` (pink no trend, sublinhado no scrap), `\n` quebra a linha. `ts` muda o tamanho do título.

Campos por tipo:
- **capa**: `titulo`, `texto`, `foto`, `fotoPos`; studio: `kicker` (etiqueta branca), `fotoAltura`; scrap: `dia` (dia destacado na agenda).
- **texto**: `kicker`, `titulo`; trend: `caixa` (texto na caixa tracejada) e `destaque: true` (caixa rosa); studio: `texto`, `grade: false` (tira a grade).
- **lista**: `titulo`, `itens[]` (até 4–5); trend: `kicker`, `subtitulo`; studio: `texto` (frase de fechamento, alinhada à direita); scrap: `kicker`.
- **item**: `titulo`, `numero` (automático), `texto`; trend e scrap: `fala` (a fala da seguidora, entre aspas).
- **janela** (scrap): `titulo`, `fala`, `texto`.
- **legenda** (scrap): `foto`, `fotoPos`, `texto` (use `\n`; comece com `**Frase em negrito,**`), `y` (`topo`, `meio`, `base` ou px), `tam`, `emojis` (2, padrão 🥴 😵).
- **faixa** (studio): `titulo`, `texto`, `foto`, `foto2`.
- **pergunta** / **cta**: `titulo`, `texto`; trend/studio: `kicker`, `botao`.
- **blocos** (todos os tipos): `cor` (escuro, pink, pessego, claro, blush), `titulo` (cada linha vira uma faixa), `sub`, `caixas[]`, `texto`, `colunas[]` (`{sim, titulo, texto}` → ✅/❌), `foto`, `fotoAltura`.

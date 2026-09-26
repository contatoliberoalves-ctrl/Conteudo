# Carrossel Eduarda Moderno

As três direções modernas do kit da Eduarda Caraciolo (`modernos.html`, "Rodada 1 · Direções modernas"). A Linha Clara e a Linha Escura do mesmo kit estão em `../carrossel-eduarda/`.

- **1a Editorial**: papel `#F4EFEA`, fios finos, cabeçalho "EDUARDA CARACIOLO" com etiqueta à direita, títulos em Instrument Serif e texto em Hanken Grotesk.
- **1b Blocos**: rosé claro `#EDDCDA`, grotesca pesada (Hanken 700) com itálico serifado de destaque, cartões arredondados e CTA escuro.
- **1c Noir**: fundo `#1B1516` com moldura fina, fotos em arco e Cormorant Garamond.

Sem numeração de páginas, como no kit.

```
CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]
```
Saída: `saida/<id>/1.png … N.png` e `painel.png`. O render diminui título e texto (até 27px) se não couber e avisa se ainda estourar ou se faltar foto.

## Fotos
Ficam fora do git (o repositório é público). O render procura em `fotos/` e depois em `../carrossel-eduarda/fotos/`. Nomes usados: `eduarda-cta.jpg` (vertical), `eduarda-horizontal.jpg` (CTA 1a) e `avatar.jpg`. Sem a foto, sai um painel com "EC" no lugar.

## dados.json
Lista de carrosséis: `id`, `titulo` (nome na galeria), `direcao` (`1a`, `1b` ou `1c`), `avatar` (padrão `avatar.jpg`) e `slides`.

Marcação: `**negrito**`, `*itálico de destaque*` (o toque serifado/rosé dos títulos), `{cor de destaque}`, `==marca-texto==`, `\n` quebra a linha. `ts` muda o tamanho-base do título.

| tipo | campos |
|---|---|
| capa | `titulo`, `texto`; 1a: `tag` (canto direito), `numeroFundo` (número gigante); 1b e 1c: `foto`; 1c: `kicker` |
| item | `titulo`, `texto` (lista de parágrafos: o último sai em destaque), `rotulo` ("Erro" → "ERRO Nº 01" na 1a e "PRIMEIRO ERRO" na 1c), `tag` (troca o rótulo inteiro), `numero` (automático) |
| resumo | `titulo`, `itens[]` (até 6), `tag` |
| cta | `titulo`, `texto`, `botao`, `foto`; 1a: `tag`; 1c: `marca` (palavra grande em itálico, ex.: "VDE") |

Estrutura típica: capa → 3 a 6 itens → resumo → cta.

# Molde: Carrossel Infinito

Slides 1080×1350 desenhados numa faixa contínua (n × 1080 px) e recortados de 1080 em 1080, para que o trilho e as figuras atravessem a divisão entre slides.

- `template.mjs`: visual (temas, tipos de slide, trilho, figuras/fotos). Não mexa para gerar posts.
- `render.mjs`: gera `saida/<id>/1.png … n.png` e `painel.png` e confere o texto (não cabe, sai da coluna, fica a menos de 40px de figura/foto, temas repetidos).
- `dados.json`: um objeto por carrossel.
- `imagens/`: fotos de ligação (`link: "photo"`). Ficam fora do git.

Gerar: `node render.mjs [id]` (no ambiente em nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]`).

## Carrossel

| campo | |
|---|---|
| `id` | nome da pasta de saída |
| `name`, `tema` | nome e tema (galeria) |
| `seams` | divisões com figura/foto: `[1, 3]` = entre os slides 1-2 e 3-4 (1 a 3 divisões) |
| `rail` | `"solid"` ou `"dashed"` (alterne entre carrosséis) |
| `link` | `"icones"` (padrão novo: selo verde com um ícone do tema em cada divisão), `"shapes"` ou `"photo"` |
| `icone` | ícone do tema, grande e vazado no fundo da capa |
| `icones` | um ícone por divisão (com `icones`), escolhido pelo que os dois slides vizinhos tratam: `escudo`, `balanca`, `martelo`, `livro`, `lupa`, `marcador`, `clipe`, `passaporte`, `urna`, `coluna`, `grafico`, `alvo`, `lampada`, `relogio`, `check`, `ponte`, `balao`, `lapis`, `erro`, `documento`, `pessoas`, `alerta`, `bandeira`, `casa`, `trofeu`, `filtro`, `chave`, `camadas` |
| `shape` | `ring`, `diamond`, `bar` ou `disc` (com `shapes`) |
| `ph` | sugestões de imagem, uma por divisão (com `photo`; aparecem no quadro tracejado enquanto não há foto) |
| `fotos` | arquivos em `imagens/`, um por divisão (`.png` sem fundo fica recortado, sem moldura) |
| `slides` | 5 a 7 slides |

O lado do slide que encosta numa divisão com figura/foto ganha 300px de margem (os outros, 96px).

## Slides

Todos têm `type` e `bg` (`dark`, `light` ou `mint`; nunca dois iguais seguidos; se faltar, alterna sozinho) e aceitam `ts` (tamanho base do título; o título encolhe sozinho para a maior palavra caber). Nos textos: `**negrito**`, `==destaque==` e `\n` para quebrar linha.

- `cover`: só `title` e `sub` (no máximo isso: sem kicker, pre ou faixa), `align`, `ts`. Com selo e o `icone` do carrossel no fundo. Com `img` (arquivo em `imagens/`; `imgX`, `imgY`, `imgW`, `imgRot`), o texto sobe, a imagem entra grande embaixo e o selo e o ícone saem.
- `text`: `kicker`, `title`, `lead` (negrito inicial), `body`, `box` (caixa vazada, opcional).
- `item`: `num`, `ref` (artigo), `title`, `rows: [{k, v}]`, `tip` (caixa "Pegadinha:", opcional).
- `list`: `kicker`, `title`, `items: [{n, t}]` (até 6 itens curtos).
- `mnemo`: `kicker`, `word` (o macete), `cols` (`"1fr"` ou `"1fr 1fr"`), `rows: [{l, t}]`.
- `compare`: `kicker`, `title`, `cols: [{title, items: []}, {title, items: []}]` (1º vazado, 2º cheio).
- `vitrine`: `kicker`, `title`, `img` (arquivo em `imagens/`, ocupa a coluna), `sangra` (px que a imagem passa da coluna de cada lado), `legenda`. Para mostrar um produto ou material (ex.: páginas dos mapas mentais).
- `oferta`: último slide de venda: `kicker`, `img` (produto em `imagens/`; `imgW`), `pre` ("Tudo isso por"), `preco` ("R$ 29,99", o R$ sai menor), `itens` (selos curtos), `botao`, `nota`. Com selo.
- `cta`: `summary: [{k, v}]` (resumo de bolso), `title`, `body`. Com selo.

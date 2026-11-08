# PratFlix (@liberofilho) · telas únicas

Artes da PratFlix ("a advocacia na prática", plataforma do Líbero Filho) misturadas com o visual do Carrossel Libero: preto grafite `#121212`, areia `#E3D6B4`, Manrope (logo, rótulos espaçados e textos) e Big Shoulders Display em caixa alta nos títulos, granulado, foto do corredor da plataforma (`fotos/corredor.jpg`, recorte da tela inicial da PratFlix) e caixa de comentário com a hashtag.

Gerar: `node render.mjs [id]` (nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]`, com `node_modules` disponível). Saída: `saida/<id>/1.png, 2.png…`.

## dados.json
Lista de posts `{ id, titulo, telas: [...] }`. Cada tela tem `layout` e os campos dele; o tamanho vem do layout. Em `titulo` (lista de linhas), `[[trecho]]` sai destacado (areia; caixa areia no `tipo`; ouro no `claro`). `ts` muda o tamanho do título e `top` a altura do bloco, quando o texto for maior.

| layout | tamanho | campos |
|---|---|---|
| `heroi` | 1080×1350 | `rotulo`, `titulo`, `texto`, `hashtag` (botão "Comente #x → receba o link") |
| `original` | 1080×1350 | `rotulo`, `titulo`, `selo` (padrão "ACESSO GRATUITO"), `beneficios`, `hashtag`, `cta` |
| `tipo` | 1080×1350 | `rotulo`, `titulo`, `hashtag`, `cta` |
| `claro` | 1080×1350 | `rotulo`, `titulo`, `texto`, `hashtag` |
| `comenta` | 1080×1350 | `rotulo`, `titulo`, `texto`, `hashtag`, `cta` ("Comenta #x pra receber o link") |
| `capa` | 1080×1350 | capa de carrossel: `rotulo`, `titulo`, `texto` (com "arrasta →") |
| `lista` | 1080×1350 | `rotulo`, `titulo`, `itens: [{t, d}]` numerados; `claro: true` para a versão papel |
| `passo` | 1080×1350 | passo de tutorial com prompt: `n`, `titulo`, `texto`, `prompt` (`[trecho]` sai em areia, para o que a pessoa troca), `tp` (px do prompt) |
| `evento` | 1080×1350 | convite para live/evento: `dia`, `hora`, `rotulo`, `titulo`, `texto`, `hashtag`, `cta` |
| `stories` | 1080×1920 | `rotulo`, `titulo`, `texto`, `beneficios`, `botao` (fica embaixo para pôr a figurinha de link por cima) |
| `fundo` | 1920×1080 | fundo de live/StreamYard com o centro livre para o slide e a câmera: `variante` (`grafite`, `papel` ou `faixa`) |
| `simbolo` | 1080×1080 | `titulo` (foto de grupo do WhatsApp: selo "p▸", nome e logo no círculo central) |
| `simboloClaro` | 1080×1080 | o `simbolo` em fundo branco (capa da comunidade do WhatsApp): `rotulo` (opcional), `titulo` ([[trecho]] em ouro), `ts`, `cor` (troca o ouro dos anéis, rótulo e destaque) e `corP` (cor do "p" no selo) |

## PDF A4 (`pdf.mjs` + `pdf.json`)
Materiais em PDF A4 retrato na mesma identidade: capa escura com a foto do corredor, página "Como usar" com o sumário, páginas claras (papel) com dois itens por página em caixas "copie e cole" e fecho escuro. `pdf.json`: lista de `{ id, titulo, capa: {rotulo, titulo (linhas, [[trecho]] em caixa areia), sub}, comoUsar: [passos], prompts: [{titulo, texto}], complemento }`.
Gerar: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node pdf.mjs [id]` → `saida/pdf/<id>/<n>.png` e `<id>.pdf` (montado com as imagens das páginas). Avisa se uma página de prompts estourar.

## Materiais em PDF com texto (`materiais/`)
Guias e fichas A4 da biblioteca de materiais, com texto selecionável, sumário com links, marcadores e páginas numeradas (não é PDF de imagem). Capa tipográfica escura (#151515, marfim #F7F4EB, dourado #B49A5B, sem foto) e miolo marfim.
Cada material é um `materiais/NN-*.md` (cabeçalho com `numero`, `titulo`, `destaque`, `tipo`, `arquivo`, `rodape`, `resumo`, `uso`; marcações próprias descritas no topo de `materiais/gerar.py`: `[[quebra]]`, `[[linhas N]]`, `[[caixa N]]`, blocos `::: quadro|atencao|exemplo|fala|ruim|melhor|resposta|pratica`, `- [ ]` checklist e `{.ficha}`/`{.grade}` antes de tabelas para preencher).
Gerar: `pip install markdown pymupdf` e `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY python3 materiais/gerar.py [NN ...]` → `saida/materiais/<arquivo>.pdf`.

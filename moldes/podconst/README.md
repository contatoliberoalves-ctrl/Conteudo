# Molde: PodConst

Kit do autor em `kit/` (`Moldes PodConst.dc.html` + `support.js` + `image-slot.js`), mantido como veio. Cada tela é um `<div data-screen-label="1a-01">` de 1080×1350.

- 1a Dados e argumentos · 1b Lista numerada · 1c Storytelling · 1d Método e prova social (10 páginas cada)
- 1e Aviso / urgência · 1f Anúncio / isca (tela única)

Identidade: azul #0a3aa6 → #0a2a7c, navy #0b2a78, magenta #e224d6, amarelo #f7f400; Bebas Neue (títulos), Space Grotesk (texto), Unbounded 900 (logo).

## dados.json

| campo | |
|---|---|
| `id` | pasta de saída |
| `grupo` | telas do kit: `"1a"` pega 1a-01…1a-10; `"1e"` pega a tela única |
| `titulo`, `tema` | nome e descrição (galeria) |
| `fotos` | opcional: `{ "<id do image-slot>": "arquivo em fotos/" }` (fotos ficam fora do git) |

Gerar: `node render.mjs [id]` (nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]`). Saída em `saida/<id>/1.png…`.

Para um post com conteúdo próprio: copie as telas do grupo no HTML do kit com um prefixo novo (ex.: `2a-01…`), troque os textos e aponte o `grupo` para ele.

`kit/sapo.png`: sapo 3D do Fluent Emoji (Microsoft, licença MIT), usado na tela 2d (#Sapoconst).

## Grupos escritos em código (`posts.mjs`)

Os grupos 3a–3f não estão no kit: são gerados por `posts.mjs`, com os mesmos elementos (fundos azul, magenta, amarelo, navy e branco alternados; @ em etiquetas na capa e em linhas nas páginas; logo PODCONST).

- 3a Storytelling com foto · 3b Storytelling sem foto (a prova em 5 horas, barra de progresso)
- 3c Método e prova social com foto · 3d Método e prova social sem foto (questão discursiva)
- 3e Tela única sem foto (certo ou errado) · 3f Tela única com foto (checklist da véspera)

Fotos: `"fotos": {"capa": "...", "recorte": "PNG sem fundo", "libero": "...", "natalia": "..."}`. Sem o arquivo, a moldura mostra a inicial e o @ no lugar. Prova social só com dado real (print, número oficial): nunca invente depoimento.

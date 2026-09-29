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

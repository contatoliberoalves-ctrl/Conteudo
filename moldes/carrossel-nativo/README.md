# Carrossel Nativo (@liberofilho)

Foto em tela cheia + frases no estilo do **texto nativo do Instagram** (fonte Classic com fundo: cada linha num balão arredondado), em **3:4 (1080×1440)**, como os posts feitos dentro do app. A fonte é a Figtree 800, a mais próxima da Classic entre as gratuitas.

```
CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]
```
Saída: `saida/<id>/1.png … N.png` e `painel.png`.

## Fotos e prints
- `fotos/`: fotos do autor (ensaios, descontraídas, paisagens de viagem). **Fora do git** (o repositório é público). O render também acha as fotos dos outros moldes dele (`../carrossel-explicativo/fotos`, `../carrossel-libero/imagens`).
- `prints/`: prints de materiais, plataforma etc. (campo `print`), também fora do git.
- A foto é cortada em 3:4 pelo centro; use `fotoPos` (CSS `object-position`, ex.: `"center 30%"`) para escolher o enquadramento.

## dados.json
Lista de carrosséis: `id`, `titulo` (nome na galeria) e `slides`. Cada slide:

| campo | o que é |
|---|---|
| `foto` | arquivo em `fotos/` |
| `fotoPos` | enquadramento da foto |
| `escurecer` | véu preto por cima da foto (0 a 1), se a foto for muito clara |
| `blocos` | lista de frases: `{ texto, cor, y, tam, largura }` |
| `print` | `{ img, y, largura, raio }`: imagem no meio do slide, com cantos arredondados |

Blocos:
- `texto`: a frase; `\n` quebra a linha onde você quiser (senão quebra sozinho na largura).
- `cor`: `preto` (padrão), `branco`, `bege`, `marrom`, `rosa`, `lilas`, `verde`, `menta`, `ciano`, `noite` (fundo escuro com letra ciano).
- `y`: topo do bloco em px (0 a 1440) ou `topo`, `meio`, `base`.
- `tam`: tamanho da letra em px (padrão 80, como nos exemplos do Insta; textos longos ficam bons com 55–68). Se uma linha não couber, o render diminui a letra sozinho, e blocos (ou o print) que se encostarem são afastados automaticamente.
- `largura`: largura máxima da frase (padrão 1000).

O render avisa se um bloco sair da tela ou encostar em outro.

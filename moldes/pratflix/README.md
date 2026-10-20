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
| `stories` | 1080×1920 | `rotulo`, `titulo`, `texto`, `beneficios`, `botao` (fica embaixo para pôr a figurinha de link por cima) |
| `simbolo` | 1080×1080 | `titulo` (foto de grupo do WhatsApp: selo "p▸", nome e logo no círculo central) |

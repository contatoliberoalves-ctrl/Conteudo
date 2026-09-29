# Libero Fundos (@liberofilho) · fundos de tela 1920×1080

Fundo para aula ou live com a câmera à esquerda e o slide à direita por cima. O desenho fica só nas bordas (anéis vermelhos cortados, palavra vazada gigante quase apagada embaixo) e o @ no rodapé; o miolo fica limpo. Base: `../libero-comum/`.

Gerar: `node render.mjs [id]` (nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]`). Cada slide do post é um fundo.

| campo do slide | |
|---|---|
| `estilo` | `azul` (anéis em cima à direita e embaixo à esquerda, @ à direita) ou `navy` (brilho azul no canto, faixa azul embaixo, anel em cima à direita, @ à esquerda) |
| `palavra` | palavra vazada ao fundo (padrão: "CONSTITUCIONAL" no azul, "LIBERO FILHO" no navy) |

# Libero comum

Base dos moldes **Libero Dossiê**, **Libero Duelo** e **Libero Requisitos**, todos na identidade do Carrossel Libero (@liberofilho).

- `identidade.mjs`: cores (azul #0B4FD8, off-white #EFF0F2, navy #14213A, vermelho #FF2D55), temas `blue`/`light`/`dark`, textura granulada, Big Shoulders Display 900 + Schibsted Grotesk, rodapé só com "@liberofilho" (sem contador), anéis vermelhos e objetos 3D.
- `render-base.mjs`: gera `saida/<id>/1.png…` e `painel.png`. Textos com `data-fit` encolhem até caber; se não couber, avisa. Também avisa 3 fundos iguais seguidos e fotos que faltam.
- `assets/`: objetos 3D (Fluent Emoji da Microsoft, licença MIT) em 512px. Para mais: `https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/<Nome>/3D/<nome>_3d.png`.

Nos textos: `**negrito**` e `[[caixa]]` (palavra com fundo sólido). Objeto 3D em qualquer slide: `"objeto": {"img": "fox.png", "x": 700, "y": 900, "tam": 260, "rot": -8}`. Fotos do autor (fora do git) são procuradas em `fotos/` do molde, do Carrossel Libero e do Carrossel Explicativo.

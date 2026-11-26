# Placa de formatura do ABC (20×15 cm, frente e verso)

Arte feita por código, em papel recortado, com tema de conto de fadas (torre, trança dourada, lanternas, castelo
e flores, tudo desenhado aqui: sem personagens de filme). Três variações, cada uma com:

- **frente**: janela para a foto do aluno e espaço para o nome completo, a série e a escola;
- **verso**: janela grande para a foto da turma e espaço para o nome da escola.

```bash
mkdir -p fontes && : > fontes/fontes.css && python3 baixar-fontes.py "Berkshire Swash" "Titan One" "Fredoka:wght@400;500;600;700"
node placa.mjs      # html/v<1-3>-<frente|verso>-<previa|limpo>.html
node render.js      # saida/*.png em 2362×1772 (300 dpi); "node render.js 1 previa" é uma conferência rápida
```

`previa` mostra os espaços preenchidos com exemplos; `limpo` sai com a janela da foto transparente e sem os
textos, para pôr a foto por baixo e digitar os nomes (fontes: Berkshire Swash e Fredoka, do Google Fonts).
As posições e as cores de cada variação ficam nas funções `v1`, `v2` e `v3` do `placa.mjs`.

## Versão realista (`placa-real.mjs`)

Mesmo pedido no estilo da referência do cliente: cena 3D de fundo, moldura oval creme com filetes dourados,
"Formandos do" em cursiva roxa (Playball) e "ABC" em serifa roxa com contorno dourado (Cinzel), plaquinha creme
com nome, escola e série, e cubinhos de madeira com A, B e C.

- `fundos/*.jpg`: as três cenas (vale da torre, jardim ao entardecer, noite das lanternas), geradas por IA no Canva
  do usuário, sem personagens.
- `blocos/*-recorte.png`: os cubinhos em 3D. Para refazer: `node render3d.js blocos3d.html` (usa o three.js de
  `moldes/curiosidades-3d/node_modules`) e recorte as sobras transparentes.

```bash
python3 baixar-fontes.py "Playball" "Cinzel:wght@700;800;900" "Alfa Slab One"
node placa-real.mjs && node render.js 2 r      # saida/r<1-3>-<frente|verso>-<previa|limpo>.png
```

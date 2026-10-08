# Método VDE · PDF (Mentoria de Natália Valença e Líbero Filho) · PDF A4

Caderno de treino de peças em PDF A4 retrato, na identidade do molde `metodo-vde` (degradê roxo → índigo, Poppins).

Gerar: `node render.mjs [id]` (nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]`). Saída em `saida/<id>/`: `<id>.pdf` (texto vetorial), `1.png … N.png` (1080 px de largura, para a galeria) e `painel.png`. O render avisa se o conteúdo de alguma página passar do espaço.

## Páginas
1. Capa (degradê): `capa.rotulo`, `capa.titulo` (linhas; `[[palavra]]` em lavanda), `capa.sub`, `capa.ts` (px do título).
2. Como usar: `comoUsar` (passos) + os 6 pontos do checklist VDE (fixos, em `PONTOS` no template) + `nota`.
3. Para cada caso: enunciado (título neutro, selo `inspirado`, parágrafos, "Qual é a peça cabível?" e rascunho) e, na página seguinte, o checklist VDE em branco.
4. Divisor "Gabaritos" (`divisor`), um gabarito por caso e o fechamento (`fim.titulo`, `fim.texto`).

## dados.json
`{ id, tema, capa, comoUsar[], nota, casos[], divisor, fim }`. Cada caso: `{ titulo, inspirado, enunciado[], peca, pista, gabarito[6], atencao }`. `gabarito` segue a ordem dos 6 pontos (Endereçamento, Partes e legitimidade, Cabimento, Tutela de urgência, Teses, Pedidos), cada um `{ texto[], artigos[] }`. `**negrito**` e `[[destaque]]` valem nos textos.

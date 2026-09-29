# Quiz Stories (@constitucionalgabaritado) · 1080×1920

Stories de certo ou errado na identidade do Carrossel Infinito. Cada post tem 2 telas: `1.png` (afirmação + botões CERTO/ERRADO) e `2.png` (gabarito, explicação e fundamento). O trilho sai da pergunta e chega no gabarito. Os temas alternam sozinhos pelo número do quiz (escuro/gelo, menta/escuro, gelo/escuro). O miolo fica entre y 250 e 1580, fora das barras do Instagram.

Gerar: `node render.mjs [id]` (nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]`). Usa o gerador de `../libero-comum/render-base.mjs`.

`dados.json`: `{"id": "quiz-07", "titulo", "tema", "quiz": {"n", "tema" (assunto curto), "afirmacao" (**negrito** no ponto-chave), "gabarito": "certo" | "errado", "explicacao", "fundamento" (artigo, súmula ou lei)}}`.

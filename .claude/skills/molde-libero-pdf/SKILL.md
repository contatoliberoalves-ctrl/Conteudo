---
name: molde-libero-pdf
description: Gera materiais em PDF A4 (retrato) no molde "Libero PDF" do @liberofilho, na identidade do Carrossel Libero (capa azul com anel vermelho, raio-x/sumário, páginas com faixa azul por matéria e índice). Tem o PDF "Todas as teses já cobradas por matéria" (2ª fase OAB, Constitucional). Use quando pedirem PDF, apostila, e-book, material A4 ou "todas as teses" no visual do Líbero.
---

# Molde: Libero PDF

Pasta `moldes/libero-pdf/` (base em `moldes/libero-comum/`). Leia o `README.md` do molde.

1. Edite `dados.json`. Tese nova de um exame novo: acrescente `{exame, peca, materia, tese, artigo}` com o texto do padrão de resposta da FGV ou do material do autor, sem inventar; atualize também o carrossel `teses-<peça>` do Carrossel Libero.
2. Gere: `cd moldes/libero-pdf && CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>`. Tem que terminar com ✓. Confira as páginas (PNG) e o PDF (`saida/<id>/<id>.pdf`).
3. Mande o PDF ao usuário (SendUserFile) e, se ele pedir, envie ao Drive dele. O PDF fica fora do git (`saida/`).
4. Atualize a galeria (seção "Galeria" do `CLAUDE.md`, mesmo link) e faça commit.

## Simulado autoral
Para "simulado" no insta pessoal: crie `simulados/<id>.json` (campos no README) e duas entradas no `dados.json` (`parte: "prova"` e `parte: "gabarito"`). Enunciados no modelo da FGV (Alfa, Beta, Lei nº XX, "(Valor: 0,65)"), questões com itens A e B somando 1,25, peça valendo 5,00, distribuição dos pontos somando o valor certo. Gabarito só com CF e leis, salvo pedido. Mande os dois PDFs separados ao usuário.

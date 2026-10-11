---
name: molde-treino-de-pecas
description: Gera carrosséis no molde "Treino de Peças" do @constitucionalgabaritado (capa com frase-gancho + enunciado paginado com "QUAL É A PEÇA?" + checklist + CTA). Use quando pedirem um treino/desafio de identificação de peça, "qual é a peça?", enunciado de prova da OAB 2ª fase para os seguidores resolverem, ou caso autoral curto nesse formato.
---

# Molde: Treino de Peças

Pasta: `moldes/treino-de-pecas/`. O visual está em `template.mjs` e **não deve ser alterado** para gerar posts; só se edita `dados.json`.

## Passo a passo

1. Leia `moldes/treino-de-pecas/README.md` (campos) e um post de `dados.json` como exemplo.
2. Para cada enunciado, acrescente um bloco em `dados.json`:
   - `tipo`: `"treino"` para enunciado de prova da OAB (longo); `"autoral"` para caso curto do autor. Na dúvida, pergunte.
   - `tema`: `"Prova da OAB"` ou `"Autoral"` (filtro da galeria).
   - `chamada`: frase-gancho da capa, o caso em uma linha sem entregar a peça (ex.: "Uma multa por não entrar na associação de moradores."). `capa` (`folha`, `manchete`, `pista`) é opcional: sem ela, os estilos se alternam.
   - `enunciado`: **copie o texto exatamente como veio**, um item por parágrafo; marque só os nomes fictícios em `*itálico*`. Tire rótulos como "(Autoral)" (a capa já mostra).
   - `comando` (+ `valor` no Treino): a frase final do enunciado.
   - `gabarito`: a peça correta, se o usuário informar (ou se vier no material); não aparece no slide.
   - **Nunca** coloque número do exame na capa, e nunca invente enunciado de prova: se não houver texto, peça ao usuário.
3. Gere: `cd moldes/treino-de-pecas && npm install` (1ª vez) e `node render.mjs <id>`.
   - No ambiente em nuvem do Claude Code: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>`.
4. O enunciado se divide sozinho em quantos slides precisar (nunca corte o texto). Se avisar que a chamada da capa não cabe, encurte-a ou ponha `"ts"` menor (ex.: 78 na manchete) e gere de novo.
   - Casos autorais: só com base na CF e nas leis (sem jurisprudência, salvo pedido); nomes fictícios em itálico; o gabarito cita os artigos.
   - Enunciados reais de peças já estão em `dados.json` (exames 32 a 46, ids `exame-<n>-<peça>`); o índice fica em `materiais/README.md`. Para extrair texto de PDF da FGV, use PyMuPDF (`pip install pymupdf`), não pypdf.
5. Atualize a galeria (seção "Galeria" do `CLAUDE.md`, sempre no mesmo link) e faça commit de `dados.json`.

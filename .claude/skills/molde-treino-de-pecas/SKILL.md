---
name: molde-treino-de-pecas
description: Gera carrosséis de 2 slides no molde "Treino de Peças" do @constitucionalgabaritado (capa "treino de peças" + enunciado com "QUAL É A PEÇA?"). Use quando pedirem um treino/desafio de identificação de peça, "qual é a peça?", enunciado de prova da OAB 2ª fase para os seguidores resolverem, ou caso autoral curto nesse formato.
---

# Molde: Treino de Peças

Pasta: `moldes/treino-de-pecas/`. O visual está em `template.mjs` e **não deve ser alterado** para gerar posts; só se edita `dados.json`.

## Passo a passo

1. Leia `moldes/treino-de-pecas/README.md` (campos) e um post de `dados.json` como exemplo.
2. Para cada enunciado, acrescente um bloco em `dados.json`:
   - `tipo`: `"treino"` para enunciado de prova da OAB (longo); `"autoral"` para caso curto do autor. Na dúvida, pergunte.
   - `capa`: alterne `"A"` e `"B"` entre posts seguidos, se o usuário não escolher.
   - `enunciado`: **copie o texto exatamente como veio**, um item por parágrafo; marque só os nomes fictícios em `*itálico*`. Tire rótulos como "(Autoral)" (a capa já mostra).
   - `comando` (+ `valor` no Treino): a frase final do enunciado.
   - `gabarito`: a peça correta, se o usuário informar (ou se vier no material); não aparece no slide.
   - **Nunca** coloque número do exame na capa, e nunca invente enunciado de prova: se não houver texto, peça ao usuário.
3. Gere: `cd moldes/treino-de-pecas && npm install` (1ª vez) e `node render.mjs <id>`.
   - No ambiente em nuvem do Claude Code: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>`.
4. Se o script avisar que o enunciado não cabe nem com a fonte mínima, **não corte o texto**: acrescente `"quebra": k` (índice do parágrafo que abre o 3º slide, equilibrando os dois lados) e gere de novo.
   - Enunciados reais de peças já estão em `dados.json` (exames 32 a 46, ids `exame-<n>-<peça>`); o índice fica em `materiais/README.md`. Para extrair texto de PDF da FGV, use PyMuPDF (`pip install pymupdf`), não pypdf.
5. Atualize a galeria (seção "Galeria" do `CLAUDE.md`, sempre no mesmo link) e faça commit de `dados.json`.

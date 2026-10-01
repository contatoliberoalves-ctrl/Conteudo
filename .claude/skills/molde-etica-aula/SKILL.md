---
name: molde-etica-aula
description: Gera slides de aula 16:9 (1920×1080) no molde "Ética Aula", do @eticagabaritadanaoba (Ética na OAB), na identidade do Carrossel Ética (degradê rosa → vinho e branco). Use quando pedirem slides, aula ou apresentação para o @eticagabaritadanaoba / Ética Gabaritada.
---

# Molde: Ética Aula (@eticagabaritadanaoba)

Pasta: `moldes/etica-aula/`. O visual está em `template.mjs` (cores e temas vêm de `moldes/carrossel-etica/template.mjs`); para gerar aulas, só se edita `dados.json`.

## Passo a passo

1. Leia `moldes/etica-aula/README.md` (tipos e campos) e a aula de exemplo em `dados.json`.
2. Acrescente uma aula em `dados.json`, nesta estrutura:
   1. `capa` (degradê) → `missao` com o roteiro (um card por parte);
   2. para cada parte: `secao` (degradê, "01", "02"…) e as páginas de conteúdo (`tabela`, `lei`, `comparar`, `lista`, `texto`, `missao`, `balao`);
   3. `questao` (teste rápido) seguida da mesma com `gabarito: true`, e `fim`.
   - Fundos: degradê nas capas e divisores; nas páginas, alterne `branco` e `degrade` (`rosa` de variação). Nunca 3 iguais seguidos.
   - Conteúdo: Estatuto (Lei 8.906/94), Regulamento Geral e Código de Ética e Disciplina. Cite artigo, inciso e parágrafo com exatidão; `citacao` literal. Não invente estatísticas nem apresente questão própria como se fosse da OAB (use "Teste rápido"; questão de exame só com número do exame e gabarito oficial da FGV).
   - Slide de aula é apoio: frases curtas, até ~6 itens por lista, até 4 linhas na tabela.
3. Gere: `cd moldes/etica-aula && CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>`. Precisa terminar com ✓; se avisar que o texto não cabe, encurte ou divida.
4. Confira os PNGs, atualize a galeria (seção "Galeria" do `CLAUDE.md`, sempre no mesmo link) e faça commit.

---
name: molde-metodo-vde
description: Gera slides de AULA (16:9, 1920×1080) no molde "Método VDE", da mentoria de Natália Valença e Líbero Filho (degradê roxo → índigo na capa, divisores e fim; páginas brancas ou lavanda; Poppins; rodapé @nataliavalenca · @liberofilho). Use quando pedirem aula, slides ou apresentação da Mentoria / Método VDE.
---

# Molde: Método VDE (slides de aula)

Pasta: `moldes/metodo-vde/`. O visual está em `template.mjs`; para gerar aulas, edite só `dados.json`.

1. Leia `moldes/metodo-vde/README.md` (tipos e campos) e a aula de exemplo `planejar-a-peca-aula`.
2. Acrescente uma aula em `dados.json`: `capa` (degrade) → `texto`/`cards` → `secao` por parte (degrade) → conteúdo (`lista`, `lei`, `comparar`, `tabela`, `balao`) → `questao` + `questao` com `gabarito: true` → `fim` (degrade). A maioria das páginas em `branco`; `lavanda` para variar.
   - Aula de até ~10 minutos: 10 a 14 slides.
   - **Sem jurisprudência** (súmulas, temas, julgados) nas aulas, salvo pedido expresso: fundamente só com Constituição e leis.
   - Casos autorais no estilo FGV (Município Alfa, Estado Beta…), parecidos com os já cobrados na OAB.
   - Fechamento (`fim`) simples e motivacional.
   - Lei sempre literal em `citacao`. Casos e gabaritos: os do material da mentoria; não invente.
3. Gere: `cd moldes/metodo-vde && CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>`. Precisa terminar com ✓; confira os PNGs.
4. Atualize a galeria (seção "Galeria" do `CLAUDE.md`, mesmo link; o molde aparece no projeto "Método VDE") e faça commit.

---
name: molde-carrossel-etica
description: Gera carrosséis de Instagram no molde "Carrossel Ética", do perfil @eticagabaritadanaoba (Ética na OAB; degradê rosa → vinho nas capas, páginas alternando degradê e branco, estrutura do Carrossel Libero). Use quando pedirem post ou carrossel para o @eticagabaritadanaoba, "Ética Gabaritada" ou "insta de ética".
---

# Molde: Carrossel Ética (@eticagabaritadanaoba)

Pasta: `moldes/carrossel-etica/`. O visual está em `template.mjs` e **não deve ser alterado** para gerar posts; só se edita `dados.json`.

## Passo a passo

1. Leia `moldes/carrossel-etica/README.md` (tipos e campos) e um carrossel de `dados.json` como exemplo.
2. Acrescente um objeto em `dados.json` com 6 a 10 slides:
   1. `capa` em `degrade`, com um `estilo` conforme o post: `numero` (listas), `versus` (comparações), `pergunta` (quiz), `desafio` (revisão, com anel de progresso) ou a padrão (centralizada);
   2. explicação: `texto` (com `palavra` vertical), `lei` com tradução, `lista`, `missao` (cards com ícone), `impacto`, `balao` (pegadinha);
   3. `frases` (resumo "Cola na mente") e `cta` com `botao` ("Comente ÉTICA").
   - **Fundos**: capa em `degrade`; nas páginas, alterne `degrade` e `branco` (o `rosa` serve de variação, ex.: no CTA). Nunca 3 iguais seguidos.
   - **Conteúdo**: Estatuto da Advocacia (Lei 8.906/94), Regulamento Geral e Código de Ética e Disciplina (2015). Cite artigo, inciso e parágrafo com exatidão; em `citacao`, copie a lei literalmente. Não invente estatísticas nem enunciados de prova; texto do usuário entra como veio (só corrija digitação).
   - Até 3 destaques `**...**` por parágrafo; frases curtas, falando com "você".
   - Títulos: até ~14 letras por palavra cabem bem; o render reduz se passar.
3. Gere: `cd moldes/carrossel-etica && CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>`.
4. O script precisa terminar com ✓. Se avisar que o texto não cabe ou encosta nos anéis/rodapé, encurte ou divida o slide. Confira os PNGs.
5. Atualize a galeria (seção "Galeria" do `CLAUDE.md`, sempre no mesmo link) e faça commit de `dados.json`.

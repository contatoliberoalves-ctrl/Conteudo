---
name: molde-concurso-libero
description: Gera carrosséis (estilos alternado, claro ou ficha) e posts de tela única no molde "Concurso com Líbero · Plataforma" (verde, petróleo e branco em cores fixas, símbolo L com visto, títulos em Big Shoulders do insta pessoal), sobre editais, concursos e cursos da plataforma Concurso com Líbero. Use quando pedirem post ou carrossel "da plataforma", "na id do Concurso com Líbero", "tudo sobre o concurso X" ou "saiu o edital" nesse visual. Posts do perfil @concursocomlibero no visual antigo (Playfair, amarelo) ficam no molde concursocomlibero.
---

# Molde: Concurso com Líbero · Plataforma

Pasta `moldes/concurso-libero/`. Leia o `README.md` (tipos de slide e campos).

1. Edital novo: pesquise na web (WebSearch/WebFetch) e confira os números em pelo menos duas fontes (vagas, requisitos, salário, taxa, datas, etapas, blocos e questões por matéria). Não invente dado; o que divergir entre fontes fica de fora ou vai com "confira no edital". Cite o edital num slide (`fonte`).
2. Monte o carrossel em `dados.json`: capa, números, comparativo de cargos, datas, prova, o que cai, atenção e CTA (`comenta` com a palavra). Para variações, repita o miolo nos três estilos (`alternado`, `claro`, `ficha`).
3. Limites: título com até 2 linhas de ~14 caracteres a 92 px; cards de `lista` e `blocos` com até ~3 linhas de descrição; no estilo `ficha` o conteúdo é reduzido e precisa caber no cartão.
4. Gere: `cd moldes/concurso-libero && ln -sfn /opt/node-tools/node_modules ../node_modules && CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>; rm ../node_modules` (tem que terminar com ✓). Confira os PNGs.
5. Mande os PNGs, atualize a galeria principal (seção "Galeria" do `CLAUDE.md`, mesmo link) e faça commit.

Fundos sempre em cores fixas (verde, petróleo, branco/papel) ou degradê leve entre dois verdes; o usuário achou o degradê com brilhos "cara de IA" nos posts.
Capa: só o título pedido, centralizado, e um alerta de prazo (`alerta`) quando houver urgência; sem chips, selos, números, contador de página ou "arrasta". Miolo sem kicker e sem termos genéricos ("anota na agenda", "salva esse post"); títulos diretos.

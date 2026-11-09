---
name: molde-concurso-pdf
description: Gera materiais em PDF A4 no molde "Concurso PDF · coleções" do @concursocomlibero (coleção Concursos com Líbero, um concurso por coleção; a primeira é a Polícia Penal PE): capa com patch da bandeira do estado, missão e trilha da coleção, páginas de regra por regra, checklist, raio X, semana do cronograma, tema de revisão, questões, folha de redação e ficha de resultados. Use quando pedirem PDF, apostila ou material da Polícia Penal PE ou de outra coleção de concurso nessa identidade.
---

# Molde: Concurso PDF · coleções

Pasta `moldes/concurso-pdf/`. Leia o `README.md` (campos e tipos de página).

1. Coleção nova (outro concurso): acrescente em `colecoes.json` (nome, sigla, uf, os 5 nomes curtos da trilha). O patch
   hoje desenha a bandeira de PE; para outro estado, crie a bandeira estilizada em `template.mjs` (sem brasão).
2. Cada material é um item do `dados-<coleção>.json` (ex.: `dados-pmpe.json`) com `n` (posição na trilha) e as `paginas`. Gere uma coleção inteira com `node render.mjs <coleção>-`.
3. Conteúdo: siga o padrão de linguagem do documento de prompts do autor (professor para aluno, sem travessões, sem
   frases de efeito, sem capítulos de fontes ou metodologia). Dado do edital sem conferência vira `{{campo}}`.
4. Gere com `node render.mjs <id>` (nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY`), confira
   os avisos e os PNGs e atualize a galeria principal (`python3 galeria/atualizar.py concurso-pdf`).

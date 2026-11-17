# Concurso PDF · coleções (@concursocomlibero)

Materiais em PDF A4 da coleção Concursos com Líbero, um concurso por coleção. A primeira é a **Polícia Penal PE**, com os
5 materiais do documento de prompts do autor: por dentro do edital, o que priorizar, plano de estudo, revisão por
assunto e treino de prova.

Identidade: cores e símbolo da plataforma Concurso com Líbero (verde `#00A651`, petróleo `#04312C`, menta `#B9FFF1`,
Sora na marca) + o jeito do insta pessoal (Big Shoulders caixa alta, `[[palavra]]` em caixa, granulado) + elementos de
jogo e organização (MISSÃO 01/05, trilha da coleção na capa, barra de progresso no rodapé, checkpoints, checklists com
contador, nível "preciso retomar · consigo explicar · consigo resolver"). O concurso aparece num **patch bordado com a
bandeira do estado** (desenho estilizado da bandeira de PE, sem brasão) e no **fio de três cores** do arco-íris da bandeira.
Visual em `template.mjs`.

Gerar: `node render.mjs [id | prefixo-]` (ex.: `pmpe-` gera os 5 da coleção) (nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]`).
Saída: `saida/<id>/<id>.pdf`, `1.png … N.png` (1080 px) e `painel.png`. O conteúdo de cada página cresce ou encolhe
para ocupar a altura útil; o render avisa se encostar no rodapé.

## Dados
- `colecoes.json`: `{ <id>: { nome, sigla, uf, materiais: [5 nomes curtos] } }` (a trilha da capa e das páginas).
- `dados.json` e `dados-<coleção>.json` (um arquivo por coleção, todos lidos pelo render): um PDF por item: `{ id, titulo, colecao, n (posição na trilha), capa: {titulo[], sub, ts}, paginas: [...] }`.
- Texto: `**negrito**`, `[[caixa]]` e `{{campo}}` (dado a preencher com o edital conferido, aparece tracejado).

Tipos de página (`tipo`): `trilha` {kicker, titulo[], texto, descricoes[5], checkpoint}; `regra` {titulo, texto,
regras[{regra, item, significa, exemplo, faca}], errosTitulo, erros[]}; `checklist` {grupos[{nome, itens[]}], checkpoint};
`incidencia` {provas{colunas, linhas}, disciplinas[{nome, total, temas[{t, v (largura 0–100), p}]}], nota}; `semana`
{fase, dias[[dia, disciplina, tema, tarefa, min]], atraso}; `tema` {n, disciplina, titulo, objetivo, explicacao, regra,
condicao, excecao, exemplo, perguntas[3]}; `questoes` {questoes[{n, disciplina, nivel, enunciado, alternativas[5]}],
folha}; `redacao` {linhas, alturaLinha, nota}; `resultados` {disciplinas[], aviso}; `ficha` {dados[[rótulo, valor]] (o 1º em destaque), colunas, datas[[data, evento]], etapas[{nome, carater, detalhe}], fonte}; `gabarito` {itens[{n, letra, comentario}]}. Em `questoes`, itens de certo ou errado têm `alternativas: ["Certo", "Errado"]` e a página leva `formato: "ce"`.

Coleções com edital publicado (conteúdo conferido no edital): `ppe` (Polícia Penal PE), `pmpe` (PMPE), `cbmpe` (Bombeiros PE) e `pcpe` (Polícia Civil PE). Não invente dados do edital: sem conferir, use `{{campo}}`.

## Revisão em Dicas (`dicas.mjs`)
Material próprio em PDF A4 com capa diferente das coleções (cartões de dica em leque, número gigante vazado, selo "MATERIAL PRÓPRIO", "criado por" e @): como usar com o mapa da prova, dicas em cartões (número + caixa de marcar | dica rápida em negrito, explicação curta e fundamento ⚖), faixas por matéria e subseção, painel de revisão com todas as dicas para pintar, fontes oficiais e contracapa. O conteúdo é vendido, então fica fora do git, em `privado/` (`<id>-meta.json` e `<id>-1.json`, `<id>-2.json`…: `[{materia, sub, base, dicas: [{n, d, e, f}]}]`); a cópia fica no Drive do autor.
Gerar: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node dicas.mjs <id>` → `saida/<id>/<id>.pdf` e as páginas em PNG.

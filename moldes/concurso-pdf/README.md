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

Gerar: `node render.mjs [id]` (nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]`).
Saída: `saida/<id>/<id>.pdf`, `1.png … N.png` (1080 px) e `painel.png`. O conteúdo de cada página cresce ou encolhe
para ocupar a altura útil; o render avisa se encostar no rodapé.

## Dados
- `colecoes.json`: `{ <id>: { nome, sigla, uf, materiais: [5 nomes curtos] } }` (a trilha da capa e das páginas).
- `dados.json`: um PDF por item: `{ id, titulo, colecao, n (posição na trilha), capa: {titulo[], sub, ts}, paginas: [...] }`.
- Texto: `**negrito**`, `[[caixa]]` e `{{campo}}` (dado a preencher com o edital conferido, aparece tracejado).

Tipos de página (`tipo`): `trilha` {kicker, titulo[], texto, descricoes[5], checkpoint}; `regra` {titulo, texto,
regras[{regra, item, significa, exemplo, faca}], errosTitulo, erros[]}; `checklist` {grupos[{nome, itens[]}], checkpoint};
`incidencia` {provas{colunas, linhas}, disciplinas[{nome, total, temas[{t, v (largura 0–100), p}]}], nota}; `semana`
{fase, dias[[dia, disciplina, tema, tarefa, min]], atraso}; `tema` {n, disciplina, titulo, objetivo, explicacao, regra,
condicao, excecao, exemplo, perguntas[3]}; `questoes` {questoes[{n, disciplina, nivel, enunciado, alternativas[5]}],
folha}; `redacao` {linhas, alturaLinha, nota}; `resultados` {disciplinas[], aviso}.

Os itens `ppe-*` atuais são **modelos de página** (textos genéricos e campos `{{…}}`): quando o conteúdo de cada material
ficar pronto, troque os textos e gere de novo. Não invente dados do edital: sem conferir, use `{{campo}}`.

# Libero PDF (@liberofilho) · PDF A4

Material em PDF A4 retrato na identidade do Carrossel Libero (base: `../libero-comum/identidade.mjs`). Primeiro material: **todas as teses já cobradas na 2ª fase de Constitucional, por matéria** (`teses-por-materia`).

Gerar: `node render.mjs [id]` (nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]`). Saída em `saida/<id>/`: `<id>.pdf` (o PDF de verdade, com texto selecionável e links no sumário), `1.png … N.png` (páginas a 1080 px de largura, para a galeria) e `painel.png`.

## Páginas
1. **Capa** (azul, anel vermelho): `capa.rotulo`, `capa.titulo` (linhas; `[[palavra]]` ganha caixa navy), `capa.sub`, `capa.ts` (px do título). Os números (teses, exames, peças, matérias) são contados sozinhos.
2. **Raio-X**: barras com quantas teses há em cada matéria (a maior em vermelho). Serve de sumário: o número da página e o link são preenchidos depois da paginação. Embaixo, "como ler" e a `fonte`.
3. **Conteúdo** (papel): cada matéria abre com uma faixa azul (número vazado, nome, `descricao`, contagem). Depois vêm os grupos de exame + peça, do exame mais recente ao mais antigo. A paginação é feita no navegador: um grupo que não cabe vai inteiro para a página seguinte, e a faixa da matéria nunca fica sozinha no pé da página.
4. **Índice por exame**: exame, peça e quantas teses dele há no PDF.

## Ordem por artigo (`teses-por-artigo`)
Mesmas teses, na sequência dos dispositivos (`"ordem": "artigo"`, `"de": "teses-por-materia"` puxa as teses e a fonte do outro material; visual em `artigos.mjs`). Seções: a CF por título (princípios, direitos e garantias, organização do Estado, dos Poderes, ordem econômica, ordem social), depois leis e códigos (ordem cronológica), súmulas vinculantes e as teses sem dispositivo na fonte. Dentro de cada artigo, caput e incisos antes dos parágrafos. Uma tese que cita vários dispositivos aparece em cada um. `raiox` troca os textos do sumário. O índice por exame no fim confere se há algum exame faltando (avisa em vermelho).

## dados.json
Lista de materiais: `{ id, titulo, capa, fonte, materias: [{id, nome, descricao}], teses: [{exame (número), peca, materia (id), tese, artigo}] }`.

Regras do conteúdo das teses:
- Fonte: tabelas "Principais Teses" do Livro de Prática Constitucional (Drive do autor) e padrões de resposta da FGV para os exames 32 a 46 (os mesmos dos carrosséis `teses-*` do Carrossel Libero). Não invente tese nem artigo; `artigo` vazio quando a fonte não traz.
- Exames conferidos um a um nos padrões de resposta da FGV (1 a 46, no Drive do autor e em oab.fgv.br). As tabelas do Livro estão com o número errado em vários exames; os certos são: Ação Popular 6, 18, 25, 28, 31, 37 e 44; MS 15, 23 e 29 (não 14, 22 e 28); MS coletivo 24 e 39; MI coletivo 22 e 38; ACP 21; o exame 5 aceitou procedimento comum ou MS.
- Reaplicação: a do XXV em Porto Alegre foi ADPF (lei municipal contra imigrantes) e entra como `"peca": "ADPF (reaplicação)"`. A do XX em Porto Velho foi MS (vaga em creche) e não entrou.
- Cada tese vai para a matéria em que se apoia (competência → Organização do Estado; art. 37 → Administração; art. 5º → Direitos individuais; cabimento, controle difuso e omissão → Controle e processo).

## Simulado autoral (`tipo: "simulado"`)
Prova da 2ª fase no modelo da FGV, em dois PDFs: `parte: "prova"` (capa com @liberofilho, instruções, peça, 2 folhas de rascunho numeradas, uma página por questão com itens A/B e linhas, CTA "me segue, gabarito em breve") e `parte: "gabarito"` (capa escura, gabarito comentado e distribuição dos pontos, paginados sozinhos, e CTA). As duas entradas do `dados.json` apontam para o mesmo `conteudo`: `simulados/<conteudo>.json` com `capa`, `capaGabarito`, `instrucoes`, `aviso`, `peca {inspirado, enunciado[], obs, gabarito[], pontos[]}`, `questoes[{tema, enunciado[], itens[{letra, texto, valor}], gabarito[], pontos[]}]`, `cta`, `ctaGabarito`. Em `pontos`, `{grupo}` abre um grupo da tabela e `{item, valor}` é uma linha (valores como na FGV: "0,00/0,10/0,20"). Visual em `simulado.mjs`.

## Relatório de aluno da mentoria (`relatorio.mjs`)
PDF A4 de 4 páginas a partir do relatório individual da plataforma da mentoria: capa azul com os números do período (questões, aproveitamento, melhor simulado, cronograma) e o diagnóstico; aproveitamento por matéria em barras (da pior para a melhor, linha dos 50% da 1ª fase); onde focar (prioridades, temas com menor desempenho, "fique de olho"); rotina e plano de 4 semanas. Os dados do aluno ficam em `relatorios/<id>.json` (**fora do git**: nome, e-mail e notas não vão para o repositório público). Gerar: `node relatorio.mjs <id>` → `saida/relatorios/<id>/<id>.pdf`. Não vai para a galeria.

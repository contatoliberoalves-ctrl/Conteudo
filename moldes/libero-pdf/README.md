# Libero PDF (@liberofilho) · PDF A4

Material em PDF A4 retrato na identidade do Carrossel Libero (base: `../libero-comum/identidade.mjs`). Primeiro material: **todas as teses já cobradas na 2ª fase de Constitucional, por matéria** (`teses-por-materia`).

Gerar: `node render.mjs [id]` (nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]`). Saída em `saida/<id>/`: `<id>.pdf` (o PDF de verdade, com texto selecionável e links no sumário), `1.png … N.png` (páginas a 1080 px de largura, para a galeria) e `painel.png`.

## Páginas
1. **Capa** (azul, anel vermelho): `capa.rotulo`, `capa.titulo` (linhas; `[[palavra]]` ganha caixa navy), `capa.sub`, `capa.ts` (px do título). Os números (teses, exames, peças, matérias) são contados sozinhos.
2. **Raio-X**: barras com quantas teses há em cada matéria (a maior em vermelho). Serve de sumário: o número da página e o link são preenchidos depois da paginação. Embaixo, "como ler" e a `fonte`.
3. **Conteúdo** (papel): cada matéria abre com uma faixa azul (número vazado, nome, `descricao`, contagem). Depois vêm os grupos de exame + peça, do exame mais recente ao mais antigo. A paginação é feita no navegador: um grupo que não cabe vai inteiro para a página seguinte, e a faixa da matéria nunca fica sozinha no pé da página.
4. **Índice por exame**: exame, peça e quantas teses dele há no PDF.

## dados.json
Lista de materiais: `{ id, titulo, capa, fonte, materias: [{id, nome, descricao}], teses: [{exame (número), peca, materia (id), tese, artigo}] }`.

Regras do conteúdo das teses:
- Fonte: tabelas "Principais Teses" do Livro de Prática Constitucional (Drive do autor) e padrões de resposta da FGV para os exames 32 a 46 (os mesmos dos carrosséis `teses-*` do Carrossel Libero). Não invente tese nem artigo; `artigo` vazio quando a fonte não traz.
- Números de exame corrigidos em relação ao Livro: MS "XXXIII" = OAB 34, MS "XXXVIII" = OAB 39, MI "XXXVII" = OAB 38, AP "XXXVI/XXXVII" = OAB 37. A linha AP "XXIX" do Livro repete o RO do OAB 30 e ficou de fora; a AP "XXX" (patrimônio histórico) entrou como OAB 29 (confirmar no caderno da FGV).
- Cada tese vai para a matéria em que se apoia (competência → Organização do Estado; art. 37 → Administração; art. 5º → Direitos individuais; cabimento, controle difuso e omissão → Controle e processo).

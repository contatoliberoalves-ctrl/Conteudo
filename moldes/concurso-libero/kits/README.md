# Kits de edital (Concurso com Líbero)

Materiais para concurso com prova distante: análise do edital, assuntos mais cobrados, estratégia, cronogramas e apoio. Concurso com prova próxima vai na linha Revisão em Dicas (`revisao-dicas/`).

Cada kit é uma pasta `kits/<id>/` com um `.json` por PDF, no formato do `pdf.json` (capa + páginas com blocos). O conteúdo (`*.json`, `*.dados`, `fontes/`) fica **fora do git**: o repositório é público e o material é pago. Gerar: `node render-pdf.mjs <id do kit>` (ou o id de um PDF). Saída em `saida/<id do pdf>/`.

## Identidade e site de cada concurso
Todo concurso da linha ("Do Edital à Prova") ganha identidade própria e site de vendas, como na Revisão em Dicas:
1. **Tema** em `kits/tema.mjs` (`TEMAS[<id>]`): cores, textura e carimbo com a data da prova. Não repita cor nem textura de outro concurso (Revisão em Dicas: ENAM marinho e dourado; TCE MA bordô e coral com azulejo; TJRS verde-mate e amarelo com guilhoché; kits: TJPB índigo e amarelo, PC PE carvão e vermelho, PP PE grafite e laranja, TJSP café e cobalto). Escolha um elemento do lugar ou do órgão. `unificado-ma`: azul de lagoa, turquesa e areia, dunas dos Lençóis, carimbo cor de sol.
2. **PDFs no tema**: cada `.json` do kit leva `"tema": "<id>"` e `"capaKit": {linha, vazado, peca, carimbo}`; a capa vira a escura com textura, carimbo e número da peça vazado, e as páginas trocam o verde pela paleta do tema. Sem `tema`, o PDF sai no verde da plataforma (como o `pdf.json`).
3. **Prancha da identidade**: `node render-identidade-kit.mjs <id>` → `saida/kit-<id>/identidade.png` (paleta, tipografia, elementos e página de dados). Textos em `kits/produtos.json > identidade`.
4. **Capas do produto** (Kiwify): `node render-produto-kit.mjs <id>` → `saida/kit-<id>/produto/`: foto principal 1080×1080, capa do curso 1280×720, topo da área de membros 1920×480, checkout 1200×400 e 800×400 e as 8 capas de módulo 600×840. Usa `produtos.json > produto` e `pecas` (ordem dos PDFs) e as capas dos PDFs já gerados.
5. **Informações do produto**: `kits/<id>/produto.md` (fora do git): nome, descrição curta e longa, o que inclui com páginas, para quem é, perguntas, dados para a Kiwify, mensagem de entrega e legendas. Vai para o Drive como documento.
6. **Site de vendas**: `kits/site/<id>.html` (página única, sem biblioteca; preço e checkout vêm de `kits/produtos.json`; `{{PRECO}}` e `{{CHECKOUT}}`). `python3 kits/montar-site.py <id>` monta `build/site/<id>/` com as imagens das páginas (`produtos.json > site.assets`). Publique `build/site/<id>/index.html` com `root` nessa pasta e `files` = os `assets/*.webp`, sempre no mesmo link. A foto do autor (`kits/site/assets/autor.webp`) fica fora do git: baixe de um site já publicado (Artifact `read` com `path: assets/autor.webp`).
   O site abre com a ficha do cargo (o visitante escolhe o cargo e vê vagas, fila de correção e taxa) e a conta da nota; a amostra mostra só parte da contagem. Nada de depoimento ou número inventado.

## Peças de um kit
1. **Raio-X do edital**: vagas por cargo, como a nota é formada (valor de cada questão), fila de correção da discursiva por cargo, grade da redação, turnos, isenção, cotas e os pontos em aberto ou com erro no edital.
2. **O que a banca mais cobra**: contagem em provas reais, por item do edital, com os comandos que se repetem.
3. **Estratégia**: ordem de estudo pela conta dos pontos, metas de acerto, redação pela grade, divisão do tempo de prova, dois cargos.
4. **Cronogramas** (A: 2 h por dia; B: 4 h por dia; C: reta final), por semana, com as datas do edital e folha de controle.
5. **Apoio**: edital verticalizado na ordem de cobrança e fichas das questões locais já aplicadas pela banca, com o gabarito oficial.

## Regras de conteúdo
- Edital: baixe o PDF oficial da banca e tire os números dele, não de blog. Cite item e capítulo na `fonte` de cada página.
- Contas (valor por questão, mínimo, equivalências) saem dos pesos do edital e são refeitas a cada kit.
- Frequência de cobrança só com contagem em provas de verdade. Provas da FCC em PDF com texto: `eticaconcursos.com.br/provas/bancas/fcc` (até 2022; `…/arquivos/prova/<slug>-prova.pdf` e `…/arquivos/gabarito/<slug>-gabarito.pdf`, o gabarito é imagem). O PCI Concursos pede verificação humana para baixar. Diga no material o recorte e o limite dele.
- Cebraspe: a página de cada concurso (`cebraspe.org.br/concursos/<sigla>`) só abre com JavaScript; use o Playwright para listar os PDFs. Ela publica cadernos com gabarito **e justificativa**, gabaritos definitivos, padrões de resposta e editais de resultado com a nota de cada candidato: dá para calcular a nota de corte real (use só estatística agregada, nunca nomes). Confira sempre as anulações no arquivo de justificativas de alteração de gabarito.
- Método usado no Unificado MA: `pdftotext -layout`, separar questões por disciplina pelo título de seção, tirar as repetidas entre cargos, classificar cada questão por item do edital e conferir por amostragem. Títulos de texto de Português podem ser confundidos com nome de disciplina: confira à mão as disciplinas locais.
- Nada de conselho genérico: cada recomendação precisa apontar para um número do edital ou da contagem. O que for sugestão do material (tempo de prova, horas por semana) vem marcado como sugestão.

## Blocos novos do `pdf.mjs`
`tabela` (cab, linhas, larguras, destaque, num, px, pad, nota; `\n` quebra linha), `ranking` (itens {rot, obs, n, pct, forte, fora}), `check` (itens {m, t} + colunas de marcar), `fichas` (itens {tag, origem, t, d, nota}), `destaque` (rotulo, titulo, paragrafos, claro) e `linhas` (n, alt, numerar).

## Kits
- `tj-sp`: Tribunal de Justiça de São Paulo, Escrevente Técnico Judiciário das CJs da 2ª a 10ª RAJ (interior e litoral), Edital de Abertura nº 02/2026, Vunesp, prova em 14/03/2027 (inscrições até 10/12/2026). Cadastro de reserva em 50 CJs; cada CJ tem fila da redação e nota de corte próprias. 8 PDFs (53 páginas), tema "Mosaico paulista" (café torrado, azul cobalto, carimbo caramelo; o contorno do estado repetido como na calçada paulista). Corpus: provas de Escrevente da Vunesp no TJSP de 2025 (Capital e 1ª RAJ, 70 questões, mesmo Anexo VIII de 2026) e de 2024 (interior e Capital, 100 questões cada): 270 questões. A Vunesp (`vunesp.com.br/<código>`, ex. TJSP2607, TJSP2503, TJSP2401) bloqueia curl: abra a página no Playwright e baixe os documentos com `fetch` de dentro dela (`documento.vunesp.com.br/projeto/<código>/documento/` lista tudo: cadernos, gabaritos, notas de corte, estatística de inscritos, notas e classificação final). A peça 8 traz as normas do TJSP (Corregedoria, resoluções, LC 1.111, Regimento) que já caíram. Site: https://claude.ai/artifact/7xz8pX8QFBzydmTUPcnZud
- `tj-pb`: Tribunal de Justiça da Paraíba, Analista Judiciário – Área Judiciária, Edital nº 01/2026, FGV, prova em 24/01/2027 (inscrições já encerradas). 8 PDFs (51 páginas), tema "Sol nascente" (índigo, amarelo de sol, lilás). Sem concurso anterior da FGV no TJPB: corpus = provas de Analista Judiciário da FGV no TJDFT 2022 e no TJMS 2024 (120 questões; páginas da FGV em `conhecimento.fgv.br/concursos/<sigla>` listam cadernos, gabaritos, espelhos e resultados com notas). A peça 8 é de discursiva (estudo de caso). Site: https://claude.ai/artifact/MzVVxKF55ffCmH3fkWxXGZ
- `pp-pe`: Polícia Penal de Pernambuco, Policial Penal, Edital nº 1 – SAD-SEAP/PE 2026, Cebraspe, prova em 21/03/2027. 8 PDFs (55 páginas), tema "Muralha e sinal" (grafite, laranja de sinalização, concreto; muralha de blocos). Corpus: SERES/PE 2017 e 2021 (120 questões do mesmo cargo, com justificativas de 2021 e notas oficiais dos dois anos). Listas masculina e feminina separadas. Site: https://claude.ai/artifact/D4uhVquiUrLtvrjioiiR4u
- `pc-pe`: Polícia Civil de Pernambuco, Agente e Escrivão, Edital nº 1/2026, Cebraspe, prova em 07/03/2027. 8 PDFs (50 páginas), tema "Cordel e distintivo" (carvão, vermelho, papel; xilogravura). Corpus: PC PE 2023 com justificativas e notas oficiais, PC PB 2021, PC RO 2022 (479 questões). Site: https://claude.ai/artifact/FHo5eVVRjGcgLhhzufRk4h
- `unificado-ma`: Concurso Unificado do Maranhão, Edital nº 01/2026, FCC, prova em 04/04/2027. 8 PDFs (48 páginas). Site: https://claude.ai/artifact/6s7TV6FhQ8tDRjdqYdqV6G

## Criativos de divulgação
`node criativos-kit.mjs <id>` → `saida/kit-<id>/criativos/NN-<nome>.png` (feed 1080×1350 e stories 1080×1920), textos em `kits/criativos/<id>.json` (este vai para o git: é material de divulgação). Sem foto do autor e sem depoimento ou número inventado: tudo sai do edital e da contagem. Três famílias, misturadas na mesma leva:
- **tema** (`manchete`, `numero`, `capas`, `ficha`, `lista`, `conta`): identidade do concurso, carimbo da prova.
- **nativo** (`story` texto do Instagram, `notas` do iPhone, `tweet`, `enquete` e quiz, `caixinha`): parece post de gente, não de marca.
- **trash** (`amarelo`, `seta`, `paint`, `planilha`, `bloco`, `edital` com marca-texto, `preto`, `zoom`): Arial, cor chapada, seta vermelha; o usuário pediu esses porque às vezes convertem mais.
Nos stories, 250 px no topo e 330 no pé ficam livres. Unificado MA, PC PE, Polícia Penal PE, TJPB e TJSP: 30 criativos cada (15 feed, 15 stories).

## Drive
Cada kit vai para `Kits de edital / <Concurso>` no Drive do dono (https://drive.google.com/drive/folders/10nY6pL_6MqUXoXnu9VoA9c3TgkKek9pG), em três subpastas (`1. PDFs do kit`, `2. Criativos`, `3. Identidade e fontes`) e um LEIA-ME com o link do site e as pendências. O zip das fontes é o conteúdo que não vai para o git. Unificado MA: https://drive.google.com/drive/folders/1uc3UB2GQBEwpnmvrHQEeYBX7BfEhEGNA. TJSP (cinco subpastas: as três acima, `4. Produto (imagens da Kiwify)` e `5. Página de vendas` com o zip do build do site): https://drive.google.com/drive/folders/1vvJGFUe64Dpar11JWLuofgWZR2Bz401j. O upload pelo conector aceita até 10 MB por arquivo: zipe as fontes sem os PDFs oficiais (eles ficam no site da banca)

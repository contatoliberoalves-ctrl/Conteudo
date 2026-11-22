# Kits de edital (Concurso com Líbero)

Materiais para concurso com prova distante: análise do edital, assuntos mais cobrados, estratégia, cronogramas e apoio. Concurso com prova próxima vai na linha Revisão em Dicas (`revisao-dicas/`).

Cada kit é uma pasta `kits/<id>/` com um `.json` por PDF, no formato do `pdf.json` (capa + páginas com blocos). O conteúdo (`*.json`, `*.dados`, `fontes/`) fica **fora do git**: o repositório é público e o material é pago. Gerar: `node render-pdf.mjs <id do kit>` (ou o id de um PDF). Saída em `saida/<id do pdf>/`.

## Identidade e site de cada concurso
Todo concurso da linha ("Do Edital à Prova") ganha identidade própria e site de vendas, como na Revisão em Dicas:
1. **Tema** em `kits/tema.mjs` (`TEMAS[<id>]`): cores, textura e carimbo com a data da prova. Não repita cor nem textura de outro concurso (Revisão em Dicas: ENAM marinho e dourado; TCE MA bordô e coral com azulejo; TJRS verde-mate e amarelo com guilhoché). Escolha um elemento do lugar ou do órgão. `unificado-ma`: azul de lagoa, turquesa e areia, dunas dos Lençóis, carimbo cor de sol.
2. **PDFs no tema**: cada `.json` do kit leva `"tema": "<id>"` e `"capaKit": {linha, vazado, peca, carimbo}`; a capa vira a escura com textura, carimbo e número da peça vazado, e as páginas trocam o verde pela paleta do tema. Sem `tema`, o PDF sai no verde da plataforma (como o `pdf.json`).
3. **Prancha da identidade**: `node render-identidade-kit.mjs <id>` → `saida/kit-<id>/identidade.png` (paleta, tipografia, elementos e página de dados). Textos em `kits/produtos.json > identidade`.
4. **Site de vendas**: `kits/site/<id>.html` (página única, sem biblioteca; preço e checkout vêm de `kits/produtos.json`; `{{PRECO}}` e `{{CHECKOUT}}`). `python3 kits/montar-site.py <id>` monta `build/site/<id>/` com as imagens das páginas (`produtos.json > site.assets`). Publique `build/site/<id>/index.html` com `root` nessa pasta e `files` = os `assets/*.webp`, sempre no mesmo link. A foto do autor (`kits/site/assets/autor.webp`) fica fora do git: baixe de um site já publicado (Artifact `read` com `path: assets/autor.webp`).
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
- Método usado no Unificado MA: `pdftotext -layout`, separar questões por disciplina pelo título de seção, tirar as repetidas entre cargos, classificar cada questão por item do edital e conferir por amostragem. Títulos de texto de Português podem ser confundidos com nome de disciplina: confira à mão as disciplinas locais.
- Nada de conselho genérico: cada recomendação precisa apontar para um número do edital ou da contagem. O que for sugestão do material (tempo de prova, horas por semana) vem marcado como sugestão.

## Blocos novos do `pdf.mjs`
`tabela` (cab, linhas, larguras, destaque, num, px, pad, nota; `\n` quebra linha), `ranking` (itens {rot, obs, n, pct, forte, fora}), `check` (itens {m, t} + colunas de marcar), `fichas` (itens {tag, origem, t, d, nota}), `destaque` (rotulo, titulo, paragrafos, claro) e `linhas` (n, alt, numerar).

## Kits
- `unificado-ma`: Concurso Unificado do Maranhão, Edital nº 01/2026, FCC, prova em 04/04/2027. 8 PDFs (48 páginas). Site: https://claude.ai/artifact/6s7TV6FhQ8tDRjdqYdqV6G

## Criativos de divulgação
`node criativos-kit.mjs <id>` → `saida/kit-<id>/criativos/NN-<nome>.png` (feed 1080×1350 e stories 1080×1920), textos em `kits/criativos/<id>.json` (este vai para o git: é material de divulgação). Sem foto do autor e sem depoimento ou número inventado: tudo sai do edital e da contagem. Três famílias, misturadas na mesma leva:
- **tema** (`manchete`, `numero`, `capas`, `ficha`, `lista`, `conta`): identidade do concurso, carimbo da prova.
- **nativo** (`story` texto do Instagram, `notas` do iPhone, `tweet`, `enquete` e quiz, `caixinha`): parece post de gente, não de marca.
- **trash** (`amarelo`, `seta`, `paint`, `planilha`, `bloco`, `edital` com marca-texto, `preto`, `zoom`): Arial, cor chapada, seta vermelha; o usuário pediu esses porque às vezes convertem mais.
Nos stories, 250 px no topo e 330 no pé ficam livres. Unificado MA: 30 criativos (15 feed, 15 stories).

## Drive
Cada kit vai para `Kits de edital / <Concurso>` no Drive do dono: PDFs, identidade, criativos e o zip das fontes (o conteúdo que não vai para o git).

# Kits de edital (Concurso com Líbero)

Materiais para concurso com prova distante: análise do edital, assuntos mais cobrados, estratégia, cronogramas e apoio. Concurso com prova próxima vai na linha Revisão em Dicas (`revisao-dicas/`).

Cada kit é uma pasta `kits/<id>/` com um `.json` por PDF, no formato do `pdf.json` (capa + páginas com blocos). O conteúdo (`*.json`, `*.dados`, `fontes/`) fica **fora do git**: o repositório é público e o material é pago. Gerar: `node render-pdf.mjs <id do kit>` (ou o id de um PDF). Saída em `saida/<id do pdf>/`.

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
- `unificado-ma`: Concurso Unificado do Maranhão, Edital nº 01/2026, FCC, prova em 04/04/2027. 8 PDFs (48 páginas).

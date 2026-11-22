# Revisão em Dicas (Concurso com Líbero)

Linha de materiais pagos de reta final, um por concurso: **Parte 1** (dicas numeradas com caixinha: regra + distinção), **Parte 2** (as mesmas dicas explicadas, com pegadinha e fundamento), identidade, criativos de anúncio e site de vendas. Os do ENAM e do ENAC foram feitos fora deste repositório (artifacts "Revisão em Dicas ENAM/ENAC"); daqui em diante, cada concurso novo é um item de `produtos.json`.

Concursos com prova ainda no ano: revisão em dicas (este molde). Concursos futuros: material de análise, dados e cronograma (a fazer; o PDF de análise de banca do `moldes/concurso-libero/pdf.mjs` é o ponto de partida).

## Identidade
A estrutura é a mesma em todos (Big Shoulders Display + Inter + JetBrains Mono, fundo escuro, papel claro, cartão de dica com número e caixinha, símbolo verde da plataforma). Cada concurso tem um tema em `tema.mjs` (`TEMAS`), com cores e elementos próprios:
- ENAM: marinho e dourado, grade de pontos.
- **TJRS Cartórios** (`tjrs`): verde-mate e amarelo (texto escuro sobre o amarelo); guilhoché das certidões; carimbo vermelho com as duas datas da objetiva; etiqueta "maior bloco da prova" em Notarial e Registral.
- **TCE MA** (`tce-ma`): bordô, coral e pêssego; textura de azulejo de São Luís; carimbo com a data da prova; etiqueta "vale 1 ponto / vale 2 pontos" por matéria; visto de auditoria no fundamento.

Concurso novo: crie um tema (cor e textura que não repitam as anteriores) e um elemento ligado ao órgão ou à cidade.

## Conteúdo (fora do git)
O repositório é público e o material é pago: `conteudo/`, `saida/` e `build/` não vão para o git. O dono envia o .docx das dicas (título de matéria em Heading1, bloco em Heading2, linha "Base: …" e cada dica como `001 □ Regra em negrito. Explicação curta.`).

1. `python3 extrair.py dicas <arquivo.docx> <id>` → `conteudo/<id>.json` (confere a numeração). Cadernos corridos (discursivas, peças): `python3 extrair.py caderno <arquivo.docx> <id> <nome>` → `conteudo/<id>-<nome>.json`, listados em `produtos.json > cadernos` (o PDF sai com sumário de duas passadas, divisória por parte, cabeçalho por caso e, com `"documento": true`, a "Redação do ato" em folha com serifa).
2. Parte 2: `conteudo/<id>-explicadas.json`, `{"001": {"x": [parágrafo 1, parágrafo 2], "f": "fundamento"}}`. Parágrafo 1 explica a regra; o 2 mostra a pegadinha. Só cite artigo, tema ou prazo com certeza; em legislação local e história regional, não acrescente dado que não esteja na dica.
3. `produtos.json`: tema, `faixa` (`pontos` no TCE; `questoes` usa o rótulo da matéria), `destaque` (matérias em destaque), selo, `carimbo`, data da prova, banca, números do edital, dicas da capa (`amostra`), preço, páginas usadas como imagem (`imagens`: `[parte, página]`) e a lista de criativos.

## Gerar (nuvem)
```
ln -sfn /opt/node-tools/node_modules node_modules
export CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY
node render-pdf.mjs tce-ma --png=1,2,3,10,51,56   # PDFs em saida/tce-ma/ + PNGs das páginas pedidas
node render-criativos.mjs tce-ma                   # saida/tce-ma/criativos/*.png
node render-identidade.mjs tce-ma                  # saida/tce-ma/identidade.png
node render-kit.mjs tce-ma                         # saida/tce-ma/kit/*.png (produto, checkout, área de membros)
python3 montar-site.py tce-ma                      # build/site/tce-ma/index.html + assets/
```
O PDF pagina sozinho: os blocos entram numa fila e o navegador distribui nas folhas (títulos não ficam sozinhos no pé; cada matéria abre folha). O render avisa se um bloco for maior que a página.

## Criativos (`criativos.mjs`)
Feed 1080×1350 e stories 1080×1920, sem foto do autor, cada layout num formato diferente: `educativo` (a conta da nota), `crenca` (crença riscada × virada), `postit` (bilhete sobre a página), `faq` (objeção "dá tempo?" com o plano de sete dias), `grade` (páginas do material + preço), `pegadinha` (certo ou errado com uma dica real), `versus`, `pagina` (uma dica ampliada com marca-texto) e os nativos de story `enquete`, `caixinha` e `lembrete`. Nos stories, 250 px no topo e 330 px no pé ficam livres. Nada de depoimento, conversa ou número inventado: o texto sai das dicas e do edital. Os textos de cada layout ficam em `produtos.json > cr.<layout>` (os do TCE MA e do TJRS servem de modelo).

## Kit do produto (`kit.mjs`)
Peças para a Kiwify e a área de membros, listadas em `produtos.json > kit` com `w` e `h` livres: `capa` (imagem do produto, 300×250), `selo` (quadrado 1080), `banner` (checkout 1200×400 e 800×400 com `compacto`; topo da área de membros 1920×480; capa do curso 1280×720 com `alto`), `modulo` (capa vertical 600×840, uma por módulo) e `mockup` (os dois PDFs em PNG transparente). As medidas seguem o que já foi usado no Cartório com Líbero; confira na plataforma e ajuste se ela pedir outra.

Criativos `simples-*`: fundo liso, uma frase em Inter e a página real do PDF (pagina, duas, capas, painel, zoom, celular), para testar contra os mais desenhados.

## Site (`site/<id>.html`)
Página única e leve (HTML + CSS + um script, 6 imagens .webp, sem biblioteca), publicada como artifact próprio. Tem contagem de dias até a prova, calculadora da nota (G + 2E), abas Parte 1/Parte 2, quiz de 3 pegadinhas, mapa das dicas, oferta e barra de compra no celular. O link do checkout é a constante `CHECKOUT` no script. `{{PRECO}}`, `{{P1}}`, `{{P2}}` e `{{BARRAS}}` são preenchidos pelo `montar-site.py`. A foto do autor (`site/assets/autor.webp`) fica fora do git.
Com `site.assets` no `produtos.json` (imagens = [parte ou caderno, página]) e `{{PG:<parte1|caderno>}}` no HTML, o mesmo montador serve qualquer produto.
- TCE MA: https://claude.ai/artifact/DHDmsZnPhaGRVX9fjKeeef
- TJRS Cartórios: https://claude.ai/artifact/LLCPDDrEy9tanD4u6nFKRm (`site/tjrs.html`, root `build/site/tjrs`, 8 `assets/*.webp`) (atualize sempre este link, com `root: build/site/tce-ma` e `files` = os 6 `assets/*.webp`)

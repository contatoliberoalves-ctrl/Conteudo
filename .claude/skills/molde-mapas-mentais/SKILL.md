---
name: molde-mapas-mentais
description: Gera mapas mentais de Direito Constitucional em PDF A4 horizontal no molde "Mapas Mentais · Constitucional com Líbero" (capa tipográfica em degradê verde leve com o tema em destaque; páginas modernas com nó central verde e cartões de cabeçalho colorido ligados por curvas: inciso, resumo, tópicos e pegadinha). Use quando pedirem mapa mental, esquema ou resumo visual de Constitucional nessa identidade.
---

# Molde: Mapas Mentais

Pasta: `moldes/mapas-mentais/`. Campos no `README.md`.

1. Um objeto em `dados.json` por material (capa + uma página por mapa). Até 6 ramos por mapa (3 de cada lado).
2. Conteúdo didático e **só com base na Constituição e nas leis** (sem jurisprudência, salvo pedido): cada ramo com o inciso/artigo, uma frase de resumo, 2–3 tópicos com o texto da lei explicado e, quando houver, uma pegadinha real. Confira os artigos antes de escrever.
3. Gere com `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>`; precisa terminar com ✓ (se o mapa passar da área, encurte os tópicos ou use `corpo`/`largura`).
4. Confira os PNGs, envie o PDF e atualize a Galeria do Líbero (seção "Galeria" do `CLAUDE.md`).

## Coleção de 100 mapas (volumes .docx do autor)
Siga a seção "Coleção" do `README.md`: importar os .docx (`colecao/importar_docx.py`), montar (`colecao/montar.mjs`) e gerar com `DADOS=colecao/dados-colecao.json SAIDA=saida/colecao`. O texto dos ramos é do autor e vai **literal** (não resumir, não acrescentar). Confira as folhas de contato: nada cortado, texto legível, desenhos variados.

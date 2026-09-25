---
name: molde-carrossel-explicativo
description: Gera carrosséis de Instagram no molde "Carrossel Explicativo" do @constitucionalgabaritado (6–7 slides: capa com foto e palavra-chave em marca-texto, slides de conteúdo claro/verde alternados, CTA com selo). Use quando pedirem um carrossel para explicar um tema, dica, conceito, jurisprudência ou passo a passo (não a estrutura de peça em 3 slides, que é o molde Estrutura de Peças), ou quando colarem o bloco "CONTEÚDO" do prompt desse modelo.
---

# Molde: Carrossel Explicativo

Pasta: `moldes/carrossel-explicativo/`. O visual está em `template.mjs` e **não deve ser alterado** para gerar posts; só se edita `dados.json`.

## Passo a passo

1. Leia `moldes/carrossel-explicativo/README.md` (todos os campos) e um post existente de `dados.json` como exemplo.
2. Monte um bloco novo em `dados.json` (ou atualize o de mesmo `id`):
   - **Texto literal.** Use o conteúdo do usuário sem reescrever: só distribua entre os slides e marque com `**...**` os trechos-chave. Títulos curtos de slide ("POR QUÊ?", "EXEMPLO PRÁTICO:", "O QUE PEDIR?") podem vir do usuário ou ser rótulos neutros como esses.
   - **Capa:** `etiqueta`, `apoio`, `destaque` (palavra-chave; quebre em 2 linhas se tiver mais de ~12 letras), `subtitulo` opcional, `foto`.
   - **4 ou 5 slides** em `slides`. Cabe por slide, aproximadamente: um título + 1 parágrafo de até ~45 palavras, **ou** até 8 itens curtos numerados, **ou** 3 itens de lista com ~25 palavras cada. Mais que isso: divida em dois slides.
   - No máximo um `marca` (texto gigante translúcido) ou uma `figura` por slide, coerente com o conteúdo (ex.: número da lei, sigla, prazo).
   - Não defina `fundo`/`alinhamento` a menos que o usuário peça: o ritmo automático já segue o modelo.
   - **Foto:** use um recorte de `fotos/` que ainda não esteja em uso neste molde. O repositório é **público**: fotos nunca vão para o git. Se `fotos/` estiver vazia, peça o link da pasta do Google Drive, baixe os originais (conector do Drive: `download_file_content` salva o base64 em arquivo; decodifique) e rode `python3 recortar_fotos.py <pasta>`. Foto nova: acrescente a posição do rosto em `C` de `moldes/estrutura-de-pecas/recortar_fotos.py` (vale para os dois moldes).
   - **Questões:** enunciado num slide (`texto`, `afirmativas`), alternativas no seguinte (`alternativas`, sem título, `barra: false`), ambos `compacto: true`; gabarito no campo `gabarito` do post. Posts do Diário Constitucional: use o gerador em `moldes/carrossel-explicativo/diario/`.
3. Gere: `cd moldes/carrossel-explicativo && npm install` (1ª vez) e `node render.mjs <id>`.
   - No ambiente em nuvem do Claude Code: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>`.
4. Se o script imprimir `!` com um aviso, ajuste (divida o slide ou encurte o destaque) e gere de novo. Depois abra os PNGs da capa e do slide mais cheio para conferir.
5. Atualize a galeria (seção "Galeria" do `CLAUDE.md`, sempre no mesmo link).
6. Commit de `dados.json` (fotos e `saida/` não vão para o git).

## Revisão de conteúdo

Os textos são jurídicos: mantenha artigos e números exatamente como no material do usuário. Se algo parecer errado, **não corrija sozinho**: avise o usuário e pergunte.

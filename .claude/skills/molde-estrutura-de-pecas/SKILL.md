---
name: molde-estrutura-de-pecas
description: Gera carrosséis de Instagram no molde "Estrutura de Peças" do @constitucionalgabaritado (capa com foto, card com endereçamento/qualificação/tópicos, slide de CTA). Use quando pedirem posts, carrosséis ou "estrutura" de peças jurídicas (OAB 2ª fase, remédios constitucionais, recursos, ações) nesse molde, ou para trocar fotos/textos de posts já existentes.
---

# Molde: Estrutura de Peças

Pasta: `moldes/estrutura-de-pecas/`. O visual está em `template.mjs` e **não deve ser alterado** para gerar posts; só se edita `dados.json` (e `fotos/`).

## Passo a passo

1. Leia `moldes/estrutura-de-pecas/README.md` (campos do `dados.json`) e um bloco existente de `dados.json` como exemplo.
2. Para cada peça pedida, acrescente (ou atualize, se o `id` já existir) um bloco em `dados.json`:
   - `id` em kebab-case sem acento; `titulo` quebrado em até 2 linhas (ex.: `["Mandado de", "Segurança"]`); siglas curtas numa linha só (`["ADPF"]`).
   - `enderecamento`: uma frase curta com os artigos principais.
   - `topicos`: um item por tópico da peça; observação curta entre parênteses no fim (vira texto menor). Máximo recomendado: 8 tópicos, e no máximo 3–4 com observação.
   - `valor`: "Valor da Causa" nas iniciais; "Termos em que, pede deferimento" em recursos/contestação; "SMJ, este é o Parecer" no parecer.
   - `tema`: alterne `"escuro"` e `"claro"` entre posts seguidos.
   - `foto`: arquivo em `fotos/`. O repositório é **público**: fotos pessoais nunca vão para o git (`fotos/*.jpg` está no `.gitignore`). Os originais ficam no Google Drive do usuário (peça o link da pasta se não houver fotos em `fotos/`). Baixe com o conector do Google Drive (`download_file_content` salva o base64 em arquivo; decodifique) e rode `python3 recortar_fotos.py <pasta>`. Foto nova: acrescente em `C` do `recortar_fotos.py` a posição do rosto e a largura do recorte, gere e confira os recortes numa folha de contato. Evite fotos parecidas em posts seguidos.
3. Gere: `cd moldes/estrutura-de-pecas && npm install` (1ª vez) e `node render.mjs <id>` para cada post (ou `npm run gerar` para todos).
   - No ambiente em nuvem do Claude Code: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>`.
4. Confira se nada estoura o card do slide 2: abra `saida/<id>/2.png`. Se o último tópico ou a pílula final estiver cortado, encurte as observações entre parênteses (ou o endereçamento) e gere de novo.
5. Atualize a galeria (skill/seção "Galeria" do `CLAUDE.md`).
6. Commit de `dados.json` e `recortar_fotos.py` (fotos e `saida/` não vão para o git).

## Revisão de conteúdo

Os textos são jurídicos: mantenha a numeração de artigos exatamente como no material do usuário. Se notar um artigo que parece errado ou copiado de outra peça, corrija só quando tiver certeza e **avise o usuário** listando cada ajuste.

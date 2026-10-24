---
name: molde-indubio-proposta
description: Gera propostas comerciais / orçamentos da agência Indubio Pro Marketing em PDF A4 retrato (capa, escopo mensal, valores e planos com desconto, bônus de thumbnails do YouTube, encerramento), nas cores da Indubio com a linguagem dos moldes do Renato. Use quando pedirem proposta, orçamento ou plano de serviço (edição de vídeo, social media etc.) no molde da Indubio.
---

# Molde: Indubio Proposta

Pasta: `moldes/indubio-proposta/`. Campos no `README.md`.

1. Escreva a proposta em `dados.json` **só com o que o usuário passou**: preços, quantidades e planos exatamente como vieram. Contas simples (economia, total de vídeos do plano) podem entrar; prazos, formas de pagamento, contatos ou condições que não vieram, não.
2. Thumbnails de bônus ficam em `thumbs.json`. Chips de conteúdo jurídico precisam estar corretos na lei (ex.: ADI art. 102, I, a; MS Lei 12.016/2009, arts. 1º e 23). Versões com foto usam recortes em `fotos/` (fora do git, repo público): baixe as fotos do Drive do usuário e recorte com rembg (`u2net_human_seg`). Nunca gere imagem de pessoa real.
3. Gere: `npm install` (1ª vez) e `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]`. Precisa terminar com ✓; se avisar que passa da margem, tire `numeros` ou encurte itens.
4. Confira os PNGs, envie os PDFs e atualize a galeria principal (seção "Galeria" do `CLAUDE.md`).

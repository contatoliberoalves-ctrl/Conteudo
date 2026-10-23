---
name: molde-indubio-apresentacao
description: Gera apresentações de projetos (sites, plataformas, campanhas) da agência Indubio Pro Marketing em slides A4 horizontal, em PDF e PNG, na linha chique da agência (preto, off-white, dourado discreto, Montserrat), com prints do projeto em janelas de navegador. Use quando pedirem apresentação, case ou portfólio "no molde da Indubio" ou da agência Indubio Pro Marketing.
---

# Molde: Indubio Apresentação

Pasta: `moldes/indubio-apresentacao/`.

1. Leia o `README.md` e a apresentação de exemplo em `dados.json` (`anoreg-pe-portal`).
2. Prints: salve em `prints/` (fora do git). Se tiverem selo de editor ("Editar site") ou outros elementos de ferramenta, corte essa faixa antes (use `python3.13` com Pillow neste ambiente).
3. Monte os slides: `capa` → `texto` (o projeto) → uma `tela` por seção do site (alternando `lado` e `escuro`) → `niveis`/`recursos` para o que não tem print → `fim`.
   - Descreva só o que aparece nos prints ou no texto do usuário; não invente funções, números ou resultados.
4. Gere com `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>` (se faltar `node_modules`, rode `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install`), confira os PNGs e mande o PDF.
5. Atualize a galeria principal e faça commit (sem os prints).

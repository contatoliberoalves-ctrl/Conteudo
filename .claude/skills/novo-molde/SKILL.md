---
name: novo-molde
description: Cadastra um novo molde de post/carrossel no repositório (a partir de um zip de kit, imagens de referência ou arte do Canva exportada), cria a skill dele e o coloca na galeria de moldes. Use quando o usuário enviar "outro molde", "novo modelo de post", um kit de template ou referências visuais para um formato novo.
---

# Novo molde

Cada molde é uma pasta em `moldes/<id-do-molde>/` que gera PNGs em `saida/<post>/1.png, 2.png, …` a partir de um `dados.json`. A galeria (`galeria/gerar.py`) lê todas as pastas que tiverem `molde.json`.

## 1. Montar a pasta

- **Veio um kit pronto (zip com template/render/dados):** descompacte em `moldes/<id>/`, mantendo o código do autor. Rode-o como está antes de mudar qualquer coisa.
- **Vieram só imagens de referência:** use `moldes/estrutura-de-pecas/` como base (`render.mjs`, `package.json`, `.gitignore`) e escreva um `template.mjs` novo que reproduza a referência em HTML/CSS no tamanho certo (1080×1350 por slide; para N slides, painel de N×1080). Compare o PNG gerado com a referência e ajuste até ficar fiel.

Requisitos para toda pasta de molde:
- `render.mjs` gera `saida/<id>/<n>.png` (numerados a partir de 1) e, se fizer sentido, `saida/<id>/painel.png`. Deve aceitar `CHROMIUM_PATH` e `RENDER_PROXY` como o de `estrutura-de-pecas`.
- `.gitignore` com `node_modules/`, `build/`, `saida/`.
- `molde.json`:
  ```json
  {
    "nome": "Nome do Molde",
    "descricao": "Uma frase dizendo o que o post mostra.",
    "formato": "Carrossel · 3 slides · 1080×1350",
    "perfil": "@constitucionalgabaritado",
    "skill": "molde-<id>",
    "pedido": "Crie posts no molde Nome do Molde para: "
  }
  ```
- `README.md` com os campos do `dados.json`.

## 2. Criar a skill do molde

Crie `.claude/skills/molde-<id>/SKILL.md` seguindo o formato de `.claude/skills/molde-estrutura-de-pecas/SKILL.md`: quando usar, quais campos preencher, limites de texto que cabem no layout, como gerar e conferir.

## 3. Gerar e publicar

1. Gere todos os posts do molde e confira visualmente pelo menos o mais longo e o mais curto.
2. Atualize a galeria conforme a seção "Galeria" do `CLAUDE.md` (republicando **no mesmo link**).
3. Commit e push.

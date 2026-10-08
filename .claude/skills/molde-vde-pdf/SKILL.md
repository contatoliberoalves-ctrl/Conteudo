---
name: molde-vde-pdf
description: Gera cadernos de treino em PDF A4 da Mentoria Método VDE (casos estilo FGV + checklist VDE em branco + gabaritos). Use quando pedirem PDF, caderno ou material de treino de peças no molde VDE.
---

# Molde: Método VDE · PDF

Pasta: `moldes/vde-pdf/`. Só se edita `dados.json` (campos no `README.md`).

## Conteúdo
- Casos no formato da FGV: personagens e entes genéricos (João, Maria, Município Alfa, Lei nº XX), fechando com "Elabore a peça processual adequada. (Valor: 5,00)". Use as peças reais dos exames como modelo (`inspirado`: "Inspirado no XLIII Exame (FGV)"), mas escreva fatos novos e deixe as pistas da peça claras quando pedirem casos mais fáceis.
- Títulos dos casos não revelam a peça.
- Gabarito nos 6 pontos do checklist VDE, **só com Constituição e leis** (sem jurisprudência nem súmulas, salvo pedido). Não invente artigo: confira cada um.
- `pista`: o que no enunciado entrega a peça. `atencao`: o erro mais comum.
- Fechamento motivacional simples ("Confia no processo.").

## Gerar
1. `cd moldes/vde-pdf && CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>`; precisa terminar com ✓ (senão encurte o texto da página indicada).
2. Confira os PNGs, atualize a Galeria do Líbero (`python3 galeria/atualizar.py vde-pdf <id>`) e faça commit.

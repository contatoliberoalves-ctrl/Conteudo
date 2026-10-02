---
name: molde-etica-criativos
description: Gera criativos de anúncio/divulgação (tela única) do @eticagabaritadanaoba em feed 1080×1350 e stories 1080×1920, na identidade do Carrossel Ética: manchete com o app no celular, etiquetas de story nativo, nota do iPhone, tweet, oferta com "Saiba mais" e plano do dia. Use quando pedirem criativo, anúncio, ad, story de divulgação ou peça de tráfego para o Ética Gabaritada.
---

# Molde: Ética Criativos (@eticagabaritadanaoba)

Pasta: `moldes/etica-criativos/`. O visual está em `template.mjs`; para criar, só se edita `dados.json`. Leia o `README.md`.

## Passo a passo

1. Escolha o layout pela referência (tabela do README) e escreva a copy:
   - **Gancho** forte na primeira linha (dor, urgência, curiosidade, número), **uma** ideia por criativo e **CTA** claro ("Comenta ÉTICA", "Toque em Saiba mais", "Corre pro Desafio").
   - Use só fatos verdadeiros: Ética tem 8 questões na 1ª fase da OAB; o app tem a rota de 5 dias e 56 questões por dia. **Não invente** preço, desconto, número de alunos, depoimentos ou prazos: peça ao usuário.
   - Destaque 1 trecho por frase com `{{...}}`.
2. Crie o item de feed e o de stories (`"de": "<id-feed>"`, `"formato": "story"`).
3. Gere: `cd moldes/etica-criativos && CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>`. Precisa terminar com ✓.
4. Confira os PNGs (nos stories, nada importante nas faixas de cima e de baixo), atualize a galeria (seção "Galeria" do `CLAUDE.md`, mesmo link) e faça commit.

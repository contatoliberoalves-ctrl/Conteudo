# Treino de Peças (@constitucionalgabaritado)

Carrossel (1080×1350) para treinar a identificação da peça:
1. **capa** com a frase-gancho do caso (`chamada`) em um de três estilos;
2. **enunciado** em letra grande, dividido sozinho em quantos slides precisar (frase a frase; "CONTINUA →" e, no último, "QUAL É A PEÇA?");
3. **Antes de responder** (checklist do que marcar no enunciado);
4. **CTA** ("COMENTA A PEÇA").

O visual está em `template.mjs`; o conteúdo vem de `dados.json`. Não usa foto.

## Como usar
1. Node.js 18+ e `npm run setup` (1ª vez; instala também a hifenização `hyphen`).
2. `npm run gerar` (ou `node render.mjs <id> [id …]`). Saída: `saida/<id>/1.png`, `2.png`…, `painel.png` e `gabarito.txt`.
3. A letra do enunciado é a maior que usa o menor número de slides: Autoral de 40 a 34px, Prova da OAB de 34 a 30px (ou fixa com `px`). O script avisa com `!` se a chamada da capa não couber.

## Campos do `dados.json`
```json
{
  "id": "autoral-habeas-data-ficha",
  "tipo": "autoral",
  "tema": "Autoral",
  "chamada": "Uma punição que nunca existiu está na ficha dele. E o órgão não quer apagar.",
  "enunciado": ["Parágrafo 1 com nome fictício em *itálico*.", "Parágrafo 2…"],
  "comando": "Diante dessa situação hipotética, indique a medida judicial cabível.",
  "gabarito": "Caso autoral\nGabarito: Habeas data…"
}
```
- `tipo`: `"treino"` (enunciado da OAB; verde, selo VALENDO 5,00) ou `"autoral"` (caso do autor; preto, selo AUTORAL).
- `tema`: `"Prova da OAB"` ou `"Autoral"`; vira o filtro da galeria (e o "Baixar todos (.zip)" baixa só o filtro).
- `chamada`: frase-gancho da capa (o caso em uma linha, sem dizer a peça). `ts` (opcional) muda o tamanho da letra da chamada se não couber.
- `capa` (opcional): `"folha"` (QUAL É A PEÇA? gigante + folha de prova inclinada), `"manchete"` (fundo claro, chamada como manchete e faixa) ou `"pista"` (fundo lima, chamada entre aspas). Sem o campo, os estilos se alternam pela ordem do post no arquivo.
- `enunciado`: texto copiado **sem alterações**, um item por parágrafo. `*Alfa*` vira itálico, `**…**` vira negrito.
- `comando`: frase do comando final (sai em negrito). `valor` só na Prova da OAB.
- `perguntas` (opcional): troca o checklist do "Antes de responder"; `"antes": false` tira esse slide. `ctaTexto` troca o texto do CTA.
- `px` (opcional): letra fixa do enunciado.
- `gabarito`: não aparece no slide; vai para `gabarito.txt` (legenda ou primeiro comentário).

## Regras do modelo
- Não colocar número de exame (ex.: "OAB 39") nas capas.
- Fontes: Young Serif (chamadas), Alfa Slab One (selos), Anton (QUAL É A PEÇA?), Poppins (texto).
- Cores: verde `#33443D`, lima `#8DBA4C`, off-white `#F6F6F2`, cartão `#FBFBF8`, preto `#1B1C1B`, texto `#1F2623`.

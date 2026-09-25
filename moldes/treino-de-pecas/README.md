# Treino de Peças (@constitucionalgabaritado)

Carrossel de **2 slides** (1080×1350) para treinar a identificação da peça: **capa** + **enunciado** com "QUAL É A PEÇA?". O visual está em `template.mjs`; o conteúdo vem de `dados.json`. Não usa foto.

## Como usar
1. Node.js 18+ e `npm run setup` (1ª vez; instala também a hifenização `hyphen`).
2. `npm run gerar` (ou `node render.mjs <id>`). Saída: `saida/<id>/1.png` (capa), `2.png` (enunciado), `painel.png` (os dois) e `gabarito.txt`.
3. O enunciado diminui sozinho até caber (Treino: de 19px até 18px; Autoral: de 38px até 30px). Se nem assim couber, o script avisa com `!`.

## Campos do `dados.json`
```json
{
  "id": "treino-exame-xx",
  "tipo": "treino",
  "capa": "A",
  "enunciado": ["Parágrafo 1 com nome fictício em *itálico*.", "Parágrafo 2…"],
  "comando": "Na qualidade de advogado(a), elabore a peça processual cabível.",
  "valor": "(Valor: 5,00)",
  "gabarito": "Mandado de Segurança"
}
```
- `tipo`: `"treino"` (enunciado longo da OAB; tema verde/claro) ou `"autoral"` (caso curto; tema preto, selo AUTORAL).
- `capa`: `"A"` (Editorial) ou `"B"` (Folha de prova).
- `enunciado`: texto copiado **sem alterações**, um item por parágrafo. `*Alfa*` vira itálico, `**…**` vira negrito.
- `comando`: frase do comando final (sai em negrito; no Treino vem separada por um filete). `valor` só no Treino.
- `quebra` (opcional, só no Treino): quando o enunciado não cabe num slide nem com 18px, divide os parágrafos em dois slides de enunciado — `enunciado[0:quebra]` no slide 2 (fecha com "CONTINUA →") e o resto + comando no slide 3. A fonte volta a começar em 24px.
- `gabarito`: não aparece no slide; vai para `gabarito.txt` (legenda ou primeiro comentário).

## Regras do modelo
- Não colocar número de exame (ex.: "OAB 39") nas capas.
- Fontes: Young Serif (treino/peças), Alfa Slab One (selos), Anton (QUAL É A PEÇA?), Poppins.
- Cores: verde `#33443D`, lima `#8DBA4C`, off-white `#F6F6F2` (capa clara `#F4F3EE`, cartão `#FBFBF8`), preto `#1B1C1B`, texto `#1F2623`.
- O prompt original pede os arquivos como `01-capa.png` e `02-enunciado.png`; aqui saem `1.png` e `2.png`, o padrão da galeria.

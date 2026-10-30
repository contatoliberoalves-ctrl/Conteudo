# Boletim Cartórios PE

Post de tela única (1080×1350) que resume um ofício, provimento ou orientação para os cartórios de Pernambuco.

```
CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]
```
Saída: `saida/<id>/1.png`. O render avisa (`!`) quando um texto passa da área.

## Estilos (`layout`)
- `oficio`: folha de papel sobre carvão, título em Cormorant Garamond, resumo, citação da norma e assinatura (identidade do Cartório).
- `manchete`: azul com anel vermelho e granulado, manchete gigante em Big Shoulders, resumo e os selos ✓ pode / ✕ não pode (Carrossel Libero).
- `ficha`: grafite e areia, faixa com o assunto, resumo e duas colunas Pode x Não pode (PratFlix).

## Campos do dados.json
| campo | o que é |
|---|---|
| `id`, `titulo` | nome do arquivo e nome na galeria |
| `layout` | `oficio`, `manchete` ou `ficha` |
| `origem`, `data` | documento resumido (ex.: "Ofício Circular nº 18/2026 · FERC-PE") e data |
| `chamada` | título da peça; `[[...]]` destaca |
| `ts` | tamanho do título (padrão 70 / 118 / 74) |
| `kicker` | (ficha) linha acima do título |
| `resumo` | 1 ou 2 parágrafos curtos; `**negrito**` e `[[destaque]]` |
| `pode`, `naoPode` | listas curtas (manchete usa só o 1º item de cada) |
| `base` | `{ ref, texto }`: norma citada (o oficio mostra o texto; os outros, só a referência) |
| `assinatura` | quem assina o documento |

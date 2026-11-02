# Plataforma (divulgação) · parte do molde Constitucional Criativos

Posts 1080×1350 que divulgam a plataforma **Constitucional com Líbero** (Reforço) com os prints dela, nas cores e
fontes do perfil (base de `../cg-comum/base.mjs`: Bebas Neue + Poppins, verde, base escura, gelo).

Os posts ficam em `render.mjs` (objeto `POSTS`); `dados.json` só lista id, título e tema para a galeria.

| id | o que é |
|---|---|
| `carrossel-vitrine` | 7 slides, fundo escuro com brilho verde, sem foto: capa com notebook, um recurso por slide (número + rótulo), "tudo isso num lugar só" |
| `carrossel-recursos` | 7 slides, gelo com bloco verde no alto, sem foto: capa com mosaico de telas, "o que tem dentro", um recurso por slide com 2 ou 3 benefícios |
| `carrossel-por-dentro` | 7 slides com foto do autor (capa e CTA) |
| `carrossel-passo-a-passo` | 7 slides com foto: problema, 4 passos, CTA |
| `card-*` | 3 telas únicas (banco de questões, cronograma, tudo num lugar só) |

## Prints e fotos (fora do git)
- `prints/`: prints da plataforma (pasta do Drive `1sYc4JFOVpYtBksBDZKI4EhB3vzJ2zIRX`) em JPG, mais recortes `c_*.jpg`
  (contagem, player, questão, cards, hero, aulasgrid, banco, crono). Mostram a conta do autor, por isso não vão pro git.
- `fotos/`: recortes sem fundo do autor (`classico.png`, `megafone_b.png`), só nos posts "com foto".

Gerar: `node render.mjs [id ...]` (nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs`).
Saída: `saida/<id>/1.png …`.

Fatos usados (dos prints): aulas gravadas (temáticas e resolução de questões), +50 pontos por aula, cronograma
sob medida até a prova, banco de questões oficiais FGV com filtros, treinos de 10/20/30, gabarito comentado e caderno de
erros, dicas rápidas, resumos por tema, encontros ao vivo, ranking, progresso, materiais de apoio. Chamada:
"Comenta REFORÇO". Sem preço (confirmar com o autor antes de pôr) e sem quantidade de aulas ou questões: o autor pediu "diversas aulas" e "banco de questões completo"; os números dentro dos prints são borrados pelo `recortar_prints.py`.

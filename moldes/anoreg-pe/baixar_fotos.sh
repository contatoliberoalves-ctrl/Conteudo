#!/bin/sh
# Fotos de banco livre (Pexels, uso gratuito sem crédito obrigatório) usadas nas capas. Ficam fora do git.
cd "$(dirname "$0")" && mkdir -p fotos/fontes && cd fotos/fontes
# 58890 Olinda · 17488159 Marco Zero · 17298658 Recife · 35810442 casario com azulejo · 20091878 alianças
# 325690 pés de bebê · 7641906 chaves · 34381970 e 30781747 retratos de exemplo
for id in 58890 17488159 17298658 35810442 20091878 7907264 325690 32894058 7641906 31989061 30781747 34381970; do
  [ -f $id.jpg ] || curl -s -o $id.jpg "https://images.pexels.com/photos/$id/pexels-photo-$id.jpeg?auto=compress&cs=tinysrgb&w=1600"
done

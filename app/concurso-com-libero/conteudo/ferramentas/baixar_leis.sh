#!/usr/bin/env bash
# Baixa o texto consolidado das leis cobradas no TJ-SP para $LEIS_DIR (fora do git).
# O site do Planalto bloqueia acesso automático; a Câmara e a Assembleia de SP funcionam.
# Uso: LEIS_DIR=/pasta ./baixar_leis.sh   e depois   LEIS_DIR=/pasta python3 artigos.py cp 312 327
set -u
D="${LEIS_DIR:-/tmp/leis}"; mkdir -p "$D"; cd "$D"
B=https://www2.camara.leg.br/legin/fed
baixa(){ for i in 1 2 3; do curl -sL -m 60 -A "Mozilla/5.0" "$2" -o "$1.htm"; [ "$(stat -c%s "$1.htm" 2>/dev/null || echo 0)" -gt 50000 ] && { echo "$1 ok"; return; }; sleep 3; done; echo "$1 FALHOU: $2"; }
baixa cf    "$B/consti/1988/constituicao-1988-5-outubro-1988-322142-normaatualizada-pl.html"
baixa cp    "$B/declei/1940-1949/decreto-lei-2848-7-dezembro-1940-412868-normaatualizada-pe.html"
baixa cpp   "$B/declei/1940-1949/decreto-lei-3689-3-outubro-1941-322206-normaatualizada-pe.html"
baixa cpc   "$B/lei/2015/lei-13105-16-marco-2015-780273-normaatualizada-pl.html"
baixa l9099 "$B/lei/1995/lei-9099-26-setembro-1995-348608-normaatualizada-pl.html"
baixa l8429 "$B/lei/1992/lei-8429-2-junho-1992-357452-normaatualizada-pl.html"
baixa l10261 "https://www.al.sp.gov.br/repositorio/legislacao/lei/1968/lei-10261-28.10.1968.html"

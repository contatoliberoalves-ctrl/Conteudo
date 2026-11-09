#!/usr/bin/env bash
# Gera o APK do Concurso com Líbero a partir de ../index.html.
# Uso: ANDROID_HOME=... COLECAO=/pasta/da/colecao [CCL_KEYSTORE=... CCL_KEYSTORE_PASS=...] ./build.sh
# COLECAO: pasta com os PDFs e as páginas .webp da Coleção PPPE (ficam fora do git).
# Sem CCL_KEYSTORE, o APK sai assinado com a chave de depuração.
set -euo pipefail
cd "$(dirname "$0")"
WWW=app/src/main/assets/www
rm -rf "$WWW" && mkdir -p "$WWW"
{ printf '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>'; cat ../index.html; printf '</body></html>'; } > "$WWW/index.html"
if [ -n "${COLECAO:-}" ]; then mkdir -p "$WWW/colecao" && cp "$COLECAO"/*.pdf "$COLECAO"/*.webp "$WWW/colecao/"; fi
echo "sdk.dir=${ANDROID_HOME}" > local.properties
gradle -q --no-daemon assembleRelease
ls -l app/build/outputs/apk/release/

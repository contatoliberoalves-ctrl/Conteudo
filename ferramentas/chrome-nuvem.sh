#!/bin/sh
# Chromium para o cinecode no ambiente em nuvem do Claude Code: roda como root (--no-sandbox), sem placa de vídeo
# (WebGL por software, SwiftShader), canvas 2D em software (o acelerado muda o antisserrilhado depois da primeira
# leitura e quebra o determinismo dos quadros) e atrás do proxy (fontes e three.js vêm de CDNs).
# Uso: CHROME_PATH=$PWD/ferramentas/chrome-nuvem.sh node <tools>/capture.mjs ...
exec /opt/pw-browsers/chromium --no-sandbox --use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist --disable-accelerated-2d-canvas \
  ${HTTPS_PROXY:+--proxy-server="$HTTPS_PROXY" --ignore-certificate-errors} "$@"

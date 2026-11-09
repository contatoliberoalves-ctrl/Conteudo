#!/bin/sh
# Chromium para o cinecode no ambiente em nuvem do Claude Code: roda como root (--no-sandbox), sem placa de vídeo
# (WebGL por software, SwiftShader) e atrás do proxy (fontes e three.js vêm de CDNs).
# Uso: CHROME_PATH=$PWD/ferramentas/chrome-nuvem.sh node <tools>/capture.mjs ...
exec /opt/pw-browsers/chromium --no-sandbox --use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist \
  ${HTTPS_PROXY:+--proxy-server="$HTTPS_PROXY" --ignore-certificate-errors} "$@"

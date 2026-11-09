#!/usr/bin/env bash
# Baixa os efeitos e trilhas (todos CC0, OpenGameArt.org) usados por som.py.
# Uso: bash baixar_sons.sh <pasta>
set -e
D="${1:?pasta de destino}"; mkdir -p "$D"; cd "$D"
B=https://opengameart.org/sites/default/files
for f in 100-CC0-SFX_0.zip sfx_100_v2.zip sfx_breaking_and_falling.zip; do curl -sfL -O "$B/$f"; unzip -oq "$f" -d "x_${f%.zip}"; done
for f in crackleelectricityloop.wav charge.wav shieldhit.wav snaploop.wav rock_break_0.ogg cave_in_-_starninjas_0.ogg whoosh2_0.wav groundhit.wav powerup.wav; do curl -sfL -O "$B/$f"; done
curl -sfL -o music_boss.wav "$B/Juhani%20Junkala%20-%20Epic%20Boss%20Battle%20%5BSeamlessly%20Looping%5D.wav"
curl -sfL -o music_adv.wav "$B/Adventure%20Theme%20Intro.wav"

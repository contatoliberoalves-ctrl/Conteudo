# Vídeo de apresentação (Reels, 1080×1920, 31 s)

Feito com Remotion a partir de telas reais do app.

1. `npm install remotion@4 @remotion/cli@4 react@18 react-dom@18`
2. Telas: `capturar-telas.js` (Playwright, 390×844 em 3x) grava os PNGs em `public/telas/`. Ajuste os caminhos no topo do script.
3. Em `public/`: `logo.png` (ícone do app), `manrope.woff2` e `dmsans.woff2` (de `../android/fontes/`) e `musica.mp3` (trilha instrumental de 31 s; fica fora do git).
4. `npx remotion render src/index.ts Reel out/reel.mp4 --codec h264 --crf 17 --browser-executable=<headless_shell do Playwright>`

Textos e tempos de cada cena ficam na lista `CENAS`, no topo de `src/Reel.tsx`.

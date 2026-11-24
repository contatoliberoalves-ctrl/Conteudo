# Concurso Reels (@concursocomlibero)

Reels de 25 a 40 s, **sem narração**: texto animado na tela e trilha sintetizada (`trilha.py`, whoosh na troca de cena, tick nos itens, impacto nos números).

Cada vídeo fica em `VIDEOS` dentro de `videos.mjs`:
- `tema`: `papel` (fundo claro, número verde chapado), `verde` (degradê vivo, cartões petróleo) ou `noite` (petróleo/preto com ciano). Não repita o mesmo tema em vídeos seguidos: é isso que evita a cara de "mesmo vídeo".
- `serie` e `n`: etiqueta do canto (ex.: `VEM AÍ · Nº 01`).
- `fonte`: linha de fonte no rodapé (sempre a fonte oficial do dado).
- `capa`: segundo usado para a capa (`saida/<id>-capa.jpg`).
- `cenas`: `{dur, html(t, T, ev)}`; `t` é o início da cena, e `ev.tick/impacto` marcam os sons.

Gerar (nuvem): `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node videos.mjs [id,id]`
Prévia de quadros: `PREVIEW=2,8,15 node videos.mjs <id>`.
Precisa de `ffmpeg` e de `numpy`/`scipy` no python3.

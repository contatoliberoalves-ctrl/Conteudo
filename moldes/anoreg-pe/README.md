# ANOREG/PE · Identidade visual

Quatro direções (azul, branco e um toque de vermelho) para as redes da ANOREG/PE, todas com o mesmo conteúdo para comparar:
feed (serviço, agenda, frase), carrossel de 5 slides, 6 capas de destaque, banner e perfil do YouTube.

- `template.mjs`: as 4 direções (A Selo, B Grade, C Editorial, D Azulejo) e o conteúdo comum.
- `render.mjs`: gera `saida/<A|B|C|D>/<peça>.png`. Uso: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [A B ...]`
- `montar_apresentacao.py`: recorta as peças em `saida/apresentacao/img/` para a página de apresentação
  (`saida/apresentacao/index.html`, publicada em https://claude.ai/artifact/EPcrN7twRh94KJN1fHSYw7).

As marcas são propostas desenhadas em código; troque pelo logo oficial se a associação mantiver o dela.

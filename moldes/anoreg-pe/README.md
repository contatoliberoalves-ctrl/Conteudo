# ANOREG/PE · Identidade das redes (estilo Azulejo)

Logo oficial, cores tiradas dele (índigo #0E1170, vermelho #E0070F, amarelo #FCF10C; vermelho e amarelo só dentro do logo),
azulejo português pintado (Recife/Olinda), degradê índigo de fundo e Lexend.

Peças: feed (serviço, agenda, frase), carrossel de 6 slides, 6 capas de destaque, banner e perfil do YouTube.

1. Logo (fora do git): `python3 preparar_logo.py <pdf>` com um PDF da ANOREG/PE que traga o logo
   (o boleto de contribuição no Drive, "ANOREG - REGISTRO CIVIL ... CURRAL QUEIMADO - PETROLINA.pdf") → `assets/`.
2. `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [peça ...]` → `saida/<peça>.png`.
3. `python3 montar_apresentacao.py` → `saida/apresentacao/img/`; a página é `apresentacao.html`
   (publicada em https://claude.ai/artifact/EPcrN7twRh94KJN1fHSYw7, `root` = `saida/apresentacao`).

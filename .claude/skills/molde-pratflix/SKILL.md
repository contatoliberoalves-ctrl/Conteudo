---
name: molde-pratflix
description: Gera artes de tela única no molde "PratFlix" (plataforma "a advocacia na prática" do Líbero Filho, preto grafite e areia, títulos em caixa alta, foto do corredor e caixa de comentário com hashtag): post de feed, stories e símbolo para foto de grupo do WhatsApp. Use quando pedirem arte, post, stories ou foto de grupo "nos moldes PratFlix", do grupo #pratflix, do grupo Dicas da Advocacia ou da PratFlix.
---

# Molde: PratFlix

Pasta `moldes/pratflix/`. Leia o `README.md` do molde (layouts e campos).

1. Acrescente um post em `dados.json` (`{id, titulo, telas: [{layout, ...}]}`). Para "variações pra eu escolher", ponha várias telas no mesmo post (uma por layout). Feed: `heroi`, `original`, `tipo`, `claro` ou `comenta` (CTA "Comenta #X pra receber o link"); stories: `stories`; foto de grupo do WhatsApp: `simbolo`.
2. Limites: título do feed com até ~18 caracteres por linha a 116–150 px (use `ts` para reduzir); no `simbolo`, 2 linhas curtas. Texto de apoio em 1 a 2 linhas. Não invente benefícios nem números da plataforma; frase de apoio criada por você deve ser avisada ao usuário.
3. Gere: `cd moldes/pratflix && ln -sfn /opt/node-tools/node_modules ../node_modules && CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>; rm ../node_modules`. Confira os PNGs (texto estourando a largura, título em cima do texto).
4. Mande os PNGs ao usuário (SendUserFile), atualize a Galeria do Líbero (seção "Galeria" do `CLAUDE.md`, mesmo link) e faça commit.

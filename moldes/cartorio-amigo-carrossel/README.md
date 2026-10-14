# Cartório Amigo · Carrossel

Carrossel de curiosidades do Cartório de Curral Queimado para a população do povoado, em cores quentes do sertão (barro, sol, céu e caatinga) e letra arredondada: capa com foto feita em IA ou ilustração do sertão com ícone e o selo "Você sabia?", páginas de texto, lista numerada, mito ou verdade com carimbo, número em destaque, pergunta do povo em balão de fala e fechamento com WhatsApp e endereço.

Peças e campos: `.claude/skills/molde-cartorio/SKILL.md` (seção "Cartório Amigo"). Identidade: `moldes/cartorio-comum/amigo.mjs`. As imagens das capas (feitas em IA a partir do `promptImagem` de cada post) ficam em `fotos/`; sem o arquivo, sai a ilustração do sertão.

Gerar: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]`

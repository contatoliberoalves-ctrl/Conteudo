---
name: molde-concurso-nativo
description: Gera posts no molde "Concurso Nativo" do @concursocomlibero (foto do autor em tela cheia com texto nativo do Instagram nos estilos máquina de escrever e forte, nas cores do perfil, e figurinhas dos stories: enquete, quiz, caixa de perguntas, link e menção). Use quando pedirem post "nativo", "estilo stories", com enquete ou quiz para o @concursocomlibero / Concurso com Líbero.
---

# Molde: Concurso Nativo (@concursocomlibero)

Pasta: `moldes/concurso-nativo/`. O visual está em `template.mjs`; para criar, só se edita `dados.json`. Leia o `README.md`.

1. Estrutura sugerida: capa (`texto` forte + `enquete`) → regra (`texto` máquina com o artigo) → exceções/lista → `quiz` e o mesmo quiz com `revelar` → pegadinha (forte vermelho) → fecho com `pergunta` e `mencao`. Post único: `quiz` com `link` do gabarito.
2. Fotos do autor (fora do git): olhe cada uma e deixe rosto livre (ajuste `y` e `fotoPos`). Não repita fotos de outros posts recentes.
3. Conteúdo jurídico exato (artigo e inciso); texto do usuário literal. Sem travessões e sem emoticons no texto do perfil.
4. Gere: `cd moldes/concurso-nativo && CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>` (✓), confira os PNGs, atualize a galeria (seção "Galeria" do `CLAUDE.md`) e faça commit.

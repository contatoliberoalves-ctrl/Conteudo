---
name: molde-concursocomlibero
description: Gera carrosséis e posts de tela única no molde "concursocomlibero", do perfil @concursocomlibero (concursos públicos; verde profundo, títulos em Playfair Display com palavras em amarelo, artigos e prazos em JetBrains Mono, cards como folhas de processo, pegadinha em vermelho e acerto em verde). Use quando pedirem post ou carrossel para o @concursocomlibero, "concurso com Libero", ou conteúdo para concurseiros nesse visual.
---

# Molde: concursocomlibero (@concursocomlibero)

Pasta: `moldes/concursocomlibero/`. O visual está em `template.mjs` e **não deve ser alterado** para gerar posts; só se edita `dados.json`. Tipos e campos: `README.md` da pasta.

## Passo a passo

1. Leia `moldes/concursocomlibero/README.md` e um post parecido em `dados.json`.
2. Acrescente um objeto em `dados.json` (`id` em kebab-case, `titulo`, `materia`, `slides`):
   - **Carrossel (6 a 8 slides):** `capa` → `lei` (texto literal) → explicação (`lista`, `tabela`, `numero` ou `texto`) → `impacto` ou macete → `pegadinha` → `cta`.
   - **Post único:** um só slide `questao` (certo ou errado) ou `prazo`.
   - **Capa: só `titulo` e `sub`** (sem etiqueta, sem frase antes do título). Tipográfica, ou com `foto` ao lado (`fotoModo: "lado"`) ou de fundo (`"fundo"`). Fotos do autor: `fotos/` deste molde ou dos outros moldes; confira o enquadramento do rosto e ajuste `fotoPos`.
   - Alterne páginas `branco` com `profundo`/`escuro` (o branco com verde deixa mais chique); nunca 3 iguais seguidos.
   - Não há cabeçalho e o rodapé é só o @: não peça "arraste" nem nº de página.
   - Destaque de 1 a 3 palavras por slide com `==amarelo==`; artigos e números em `` `mono` `` quando estiverem no meio do texto.
   - Vermelho só aparece em `pegadinha` (lado errado), `questao` com gabarito errado e `alerta`; verde, só em acertos.
3. Tom: didático, direto, próximo, sem formalidade de livro antigo. **Sem emoticons e sem travessões** (use vírgula, dois-pontos ou ponto; o render avisa).
4. Conteúdo jurídico: cite artigos com exatidão e copie a lei literalmente em `citacao`. Texto do usuário vai como veio (só corrija digitação). Se algo parecer errado, **avise o usuário** em vez de corrigir por conta.
5. Gere: `cd moldes/concursocomlibero && npm install` (1ª vez) e `node render.mjs <id>`.
   - No ambiente em nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs <id>`.
6. O script precisa terminar com ✓. Se avisar que o texto não cabe, encurte ou divida o slide. Confira os PNGs de `saida/<id>/`.
7. Atualize a galeria (seção "Galeria" do `CLAUDE.md`, sempre no mesmo link) e faça commit de `dados.json`.

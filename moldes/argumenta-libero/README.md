# Argumenta com Líbero (provas discursivas)

Posts 1080×1350 (carrossel ou card único) na identidade do app Argumenta com Líbero: verde-escuro `#1F3D31`,
profundo `#0C261E`, médio `#2F6549`, vivo `#3A8A5C`, verde-claro `#7FC79B`, menta `#EEF4F0`. Títulos em
Inter Tight 800 (caixa baixa, a 2ª parte em verde com `{{...}}`), texto em Inter, títulos de card e respostas
citadas em Source Serif 4. Textura granulada e o balão de fala do logo vazado no canto (`balao`).

Gerar: `node render.mjs [id]` (nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]`).

## Fotos (fora do git)
`fotos/logo.png` (logo com a foto do Líbero) e os prints do app (`app-leitura.png`, `app-problemas.png`,
`app-indice.png`, `app-construcao.png`, `app-laboratorio.png`). O repositório é público: ficam só em `fotos/`.
Originais na pasta do Drive do usuário (peça o link numa sessão nova).

## Post (`dados.json` é uma lista)
`id`, `titulo`, `tema` (galeria) e `slides`. Card único = post com 1 slide.

Em todo slide: `tipo`, `tema` (`verde`, `menta`, `branco`; nunca 3 iguais seguidos), `kicker`, `titulo` (linhas;
`**negrito**`, `[[caixa]]`, `{{verde}}`; `ts` força o tamanho), `balao` (`true` = canto superior direito,
`"baixo"` = inferior esquerdo; o render avisa se encostar no texto).

## Tipos
- `capa`: `titulo`, `texto`, `pilula`; `print` (janela do app saindo pela base, `printY`), `logo: true`
  (logo no canto), `unico: true` (card único: @ no pé em vez de "Arraste →").
- `texto`: `titulo`, barra e `texto` (parágrafos), `pilula`.
- `cards`: `cards` [{`icone`?, `rotulo`, `titulo`, `texto`, `ativo`, `seta`}] (sem ícone sai o número). Até 6 (`corpo` 28).
- `etapas`: abas numeradas, `etapas` [{`nome`, `texto`?}] e `atual` (destacada).
- `resposta`: `respostas` [{`rotulo`, `status` (`certo`/`errado`), `texto`, `px`}], `pergunta`, `texto`.
- `checklist`: `itens` (comece com `"✓ "` para marcar).
- `print`: print do app (`print`, `alturaPrint`, `giro`) com título e `texto`.
- `numero`: `numero` grande, `titulo`, `texto`.
- `quiz` (card único): `xp`, `titulo` (serifa), `respostas`, `alternativas`, `chamada`.
- `cta`: `titulo`, `texto`, `botao`, `logo`.

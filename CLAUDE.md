# Conteúdo @constitucionalgabaritado

Posts e carrosséis de Instagram gerados por código a partir de moldes. Idioma do projeto: português.

## Estrutura
- `moldes/<id>/`: um molde por pasta (`template.mjs` visual, `render.mjs` gera PNGs, `dados.json` conteúdo, `molde.json` dados para a galeria, `fotos/`, `assets/`). Saída em `moldes/<id>/saida/` (fora do git).
- `.claude/skills/molde-<id>/`: como gerar posts em cada molde. `.claude/skills/novo-molde/`: como cadastrar um molde novo.
- `galeria/`: página que mostra todos os moldes e posts.

## Galeria
Publicada em https://claude.ai/artifact/JSzYWuCwSijXjH6GcfzvGq — sempre atualize **esse mesmo link** (Artifact com `url`), nunca crie outro.

1. Gere os PNGs dos moldes que mudaram.
2. `pip install pillow` (se preciso) e `python3 galeria/gerar.py` → `galeria/dist/index.html` + `galeria/dist/img/**.jpg`.
3. Publique `galeria/dist/index.html` com `root: galeria/dist` e `files` = lista de todos os `img/**/*.jpg`.

## Ambiente em nuvem do Claude Code
O Playwright do `package.json` pede um Chromium que não vem instalado aqui e o navegador não usa o proxy sozinho. Gere assim:
`CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs`
Sem o proxy, as fontes do Google não carregam e os títulos saem com a fonte errada (e estouram a largura).

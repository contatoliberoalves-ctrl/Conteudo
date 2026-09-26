# Conteúdo @constitucionalgabaritado (e @liberofilho)

Posts e carrosséis de Instagram gerados por código a partir de moldes. Idioma do projeto: português. Quase todos os moldes são do @constitucionalgabaritado; o `carrossel-libero` é do perfil pessoal @liberofilho (o campo `perfil` do `molde.json` diz de quem é cada molde).

## Estrutura
- `moldes/<id>/`: um molde por pasta (`template.mjs` visual, `render.mjs` gera PNGs, `dados.json` conteúdo, `molde.json` dados para a galeria, `fotos/`, `assets/`). Saída em `moldes/<id>/saida/` (fora do git).
- `.claude/skills/molde-<id>/`: como gerar posts em cada molde. `.claude/skills/novo-molde/`: como cadastrar um molde novo.
- `galeria/`: página que mostra todos os moldes e posts.

## Fotos
O repositório é **público**. Fotos pessoais do dono nunca vão para o git: os originais ficam no Google Drive dele e cada molde tem um script que recria os recortes (ex.: `moldes/estrutura-de-pecas/recortar_fotos.py`). Numa sessão nova sem as fotos, peça o link da pasta do Drive.

## Materiais-base
`materiais/README.md` lista o conteúdo do autor já recebido (estruturas, competências, guia, Diário Constitucional…) e os temas de cada um. Os arquivos em si não ficam no repositório: peça-os ao usuário quando for escrever um post a partir deles.

## Galeria
Publicada em https://claude.ai/artifact/JSzYWuCwSijXjH6GcfzvGq — sempre atualize **esse mesmo link** (Artifact com `url`), nunca crie outro.

1. Gere os PNGs dos moldes que mudaram. Nos moldes com foto, rode antes o `recortar_fotos.py` (cria `fotos/fontes/` e `fotos/fontes.json`, usados pelo editor de capa; ficam fora do git).
2. `pip install pillow` (se preciso) e `python3 galeria/gerar.py` → `galeria/dist/index.html`, `galeria/dist/img/**` (2 por post: `-painel.jpg` e `-slides.webp`) e `galeria/dist/editor/*.webp` (editor de capa).
3. Publique `galeria/dist/index.html` com `root: galeria/dist`, `capabilities: {assets: {}, db: {}, downloads: true}` e `files` = todos os `img/**/*-painel.jpg` e `img/**/*-slides.webp`. No máximo 255 arquivos por versão; arquivos que saírem da galeria são removidos com `null` no `files`.
4. Se `galeria/dist/editor/pendentes.txt` não estiver vazio: envie esses arquivos como assets (Artifact `publish` com `url`, `asset: true`, `file_paths`, até 25 por chamada), anote nome → `{id, sha1}` em `galeria/ativos.json`, rode `gerar.py` de novo e republique.

A página baixa cada carrossel em .zip e tem um editor de capa (mover/zoom da foto por baixo do texto). O ajuste salvo fica no banco da página, coleção `ajustes` (doc `<molde>__<post>` com `molde, post, dx, dy, z`). Quando o usuário pedir para **aplicar os ajustes da galeria**: leia a coleção com `ArtifactData` (list `ajustes`), grave `"fotoAjuste": {"dx", "dy", "z"}` no post do `dados.json`, gere o post de novo, atualize a galeria e apague os docs aplicados.

## Ambiente em nuvem do Claude Code
O Playwright do `package.json` pede um Chromium que não vem instalado aqui e o navegador não usa o proxy sozinho. Gere assim:
`CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs`
Sem o proxy, as fontes do Google não carregam e os títulos saem com a fonte errada (e estouram a largura).

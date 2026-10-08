# Conteúdo @constitucionalgabaritado (e @liberofilho, @eticagabaritadanaoba, Eduarda Caraciolo)

Posts e carrosséis de Instagram gerados por código a partir de moldes. Idioma do projeto: português. Quase todos os moldes são do @constitucionalgabaritado (entre eles o `quiz-stories`, stories 1080×1920 de certo ou errado, o `constitucional-criativos`, criativos de anúncio em feed e stories, e as séries `cg-plantao` (Direito no noticiário), `cg-macete` (siglas para decorar) e `cg-passos` (ritos em etapas), com base comum em `moldes/cg-comum/`); o `carrossel-libero`, o `post-libero` (tela única), o `carrossel-nativo` (foto + texto nativo do Insta, 3:4) os `libero-dossie`, `libero-duelo` e `libero-requisitos` (slides de aula 16:9, 1920×1080, na identidade do Carrossel Libero, base em `moldes/libero-comum/`; a versão de post deles é o campo `visual` do Carrossel Libero) e o `libero-fundos` (fundos de tela 16:9 para aula/live com câmera e slide), o `libero-pdf` (materiais em PDF A4 na mesma identidade, como todas as teses já cobradas por matéria) são do perfil pessoal @liberofilho e o `carrossel-eduarda`, o `carrossel-eduarda-moderno`, o `carrossel-eduarda-pop`, o `carrossel-eduarda-diva` e o `post-eduarda` (tela única) são da Eduarda Caraciolo, Advogada · Direito Civil e ECA; o `carrossel-etica` (estrutura do Carrossel Libero no degradê rosa → vinho, páginas alternando degradê e branco) o `etica-aula` (slides de aula 16:9 na mesma identidade) e o `etica-criativos` (criativos de anúncio em feed e stories) são do @eticagabaritadanaoba (Ética na OAB); o `concursocomlibero` e o `concurso-nativo` (foto + texto e figurinhas nativas do Insta) são do @concursocomlibero; o `argumenta-libero` (carrosséis e cards únicos em verde/menta/branco, com prints do app) é do projeto Argumenta com Líbero (provas discursivas); o `podconst` é do PodConst, podcast do Líbero com a Natália Valença; o `metodo-vde` (slides de aula 16:9 no degradê roxo → índigo, Poppins) é da Mentoria Método VDE, da Natália Valença e do Líbero (o campo `perfil` do `molde.json` diz de quem é cada molde).

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
2. `pip install pillow` (se preciso) e `python3 galeria/gerar.py` → `galeria/dist/index.html`, `galeria/dist/img/**` (`-slides.webp` por post, em resolução cheia; quando a tira passaria de 16.000 px, o limite do WebP, ela é dividida em `-slides-2.webp`, `-slides-3.webp`…, que também vão no `files`; e, só nos posts com mais de 3 slides, `-painel.jpg`; nos outros o painel é a própria tira, para caber no limite de 511 arquivos por versão) e `galeria/dist/editor/*.webp` (editor de capa).
3. Publique `galeria/dist/index.html` com `root: galeria/dist`, `capabilities: {assets: {}, db: {}, downloads: true, mcp: {servers: [{server: "Google Drive", tools: ["search_files", "create_file", "trash_file"]}]}}` e `files` = todos os `img/**/*-painel.jpg` e `img/**/*-slides*.webp`. No máximo 255 arquivos por versão; arquivos que saírem da galeria são removidos com `null` no `files`.
4. Se `galeria/dist/editor/pendentes.txt` não estiver vazio: envie esses arquivos como assets (Artifact `publish` com `url`, `asset: true`, `file_paths`, até 25 por chamada), anote nome → `{id, sha1}` em `galeria/ativos.json`, rode `gerar.py` de novo e republique.

Para atualizar só um molde (mais rápido que o `gerar.py`, que refaz as imagens de todos os posts): `python3 galeria/atualizar.py <molde> [post ...]` refaz a entrada do molde no `dist/index.html` e as imagens dos posts novos ou indicados, e imprime o `files` a publicar.

Numa sessão nova, só os moldes gerados nela têm `saida/`, e o `gerar.py` deixa os outros de fora. Nesse caso, leia a galeria publicada (Artifact `read`), junte ao `const MOLDES` do `dist/index.html` as entradas publicadas dos moldes que não foram gerados e publique só as imagens novas no `files` (as que já estão publicadas continuam lá).

A página baixa cada carrossel em .zip (ou só os slides marcados, um slide avulso, ou, nos slides de aula 16:9, a "Miniatura YouTube" em JPG 1280×720), envia pro Google Drive do usuário (botão "Enviar pro Drive": pasta `Carrosséis Instagram` / molde / carrossel / `01.png`…, reenviar troca os slides) e tem um editor de capa (mover/zoom da foto por baixo do texto). O ajuste salvo fica no banco da página, coleção `ajustes` (doc `<molde>__<post>` com `molde, post, dx, dy, z`). Quando o usuário pedir para **aplicar os ajustes da galeria**: leia a coleção com `ArtifactData` (list `ajustes`), grave `"fotoAjuste": {"dx", "dy", "z"}` no post do `dados.json`, gere o post de novo, atualize a galeria e apague os docs aplicados.

Pedidos de alteração: no visor, o usuário clica num ponto de um slide e escreve o que alterar, remover ou adicionar. Cada pedido é um doc na coleção `pedidos` do banco da página (`molde, post, titulo, slide` (1 = capa), `x, y` (0–1, posição do clique no slide), `tipo` (alterar/remover/adicionar), `texto`, `criado`). Quando o usuário pedir para **aplicar os pedidos da galeria**: leia a coleção com `ArtifactData` (list `pedidos`), abra o PNG do slide em `moldes/<molde>/saida/<post>/<slide>.png` e veja o que está no ponto (x·1080, y·1350), faça a mudança no `dados.json` (ou no template, se for do visual do molde), gere de novo, confira, atualize a galeria e apague os docs aplicados. Pedido ambíguo: pergunte antes e deixe o doc.

## Ambiente em nuvem do Claude Code
O Playwright do `package.json` pede um Chromium que não vem instalado aqui e o navegador não usa o proxy sozinho. Gere assim:
`CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs`
Sem o proxy, as fontes do Google não carregam e os títulos saem com a fonte errada (e estouram a largura).

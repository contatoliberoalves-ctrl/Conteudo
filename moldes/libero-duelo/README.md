# Libero Duelo (@liberofilho) · slides de aula 1920×1080

Comparação em tela dividida (lado A azul, lado B navy, medalhão VS). Slides deitados (16:9) para dar aula. A versão de post (1080×1350) com o mesmo design é o `visual` do Carrossel Libero (`../carrossel-libero/visuais/`). Base: `../libero-comum/`. Gerar: `node render.mjs [id]` (nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]`).

Carrossel: `id`, `titulo`, `tema`, `nomes` (os dois lados, ex.: `["MI", "ADO"]`), `slides`. `capa`, `round` e `cta` usam a tela dividida (sem `tema`); `placar` e `macete` usam `tema` (`blue`, `light`, `dark`).

| tipo | campos |
|---|---|
| `capa` | `kicker` (faixa branca), `lados: [{sigla, nome, ts}, {…}]`, `texto` (tarja embaixo), `objeto` |
| `round` | `numero`, `titulo` (critério), `lados: [{texto, artigo}, {…}]` (artigos separados por `;` viram etiquetas), `pegadinha` (faixa vermelha), `corpo` |
| `placar` | `kicker`, `titulo`, `linhas: [{criterio, a, b}]` |
| `macete` | `kicker`, `titulo`, `frases` (uma por lado) |
| `cta` | `titulo`, `texto`, `botao`, `foto` (medalhão "VS VOCÊ") |

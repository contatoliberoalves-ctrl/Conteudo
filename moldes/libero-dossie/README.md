# Libero Dossiê (@liberofilho)

Carrossel em forma de processo arquivado. Base: `../libero-comum/`. Gerar: `node render.mjs [id]` (nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]`).

Carrossel: `id`, `titulo`, `tema`, `fonte`, `slides`. Cada slide tem `tipo` e `tema` (`blue`, `light`, `dark`; nunca 3 iguais seguidos).

| tipo | campos |
|---|---|
| `capa` | `aba` (etiqueta da pasta), `rotulo` ("Teses que caíram na"), `titulo` (sigla), `nome`, `exames` (fichas; o carimbo conta "Já caiu N×"), `ts` |
| `linha` | `kicker`, `titulo`, `itens: [{exame, texto}]` (linha do tempo), `corpo` |
| `ficha` | `exame` ("OAB 40": o número sai vazado gigante), `kicker`, `aba`, `caso`, `itens: [{tag ("Formal"/"Material"), tese, artigo}]`, `corpo` |
| `carimbo` | `kicker`, `titulo`, `texto`, `selo`, `seloSub` |
| `cta` | `titulo`, `texto`, `botao`, `foto` (polaroide presa por clipe) |

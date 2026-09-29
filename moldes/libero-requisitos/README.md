# Libero Requisitos (@liberofilho) · slides de aula 1920×1080

"Fulano poderia ser X?" checado requisito por requisito, como ficha de candidatura. Slides deitados (16:9) para dar aula. A versão de post (1080×1350) com o mesmo design é o `visual` do Carrossel Libero (`../carrossel-libero/visuais/`). Base: `../libero-comum/`. Gerar: `node render.mjs [id]` (nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]`).

Carrossel: `id`, `titulo`, `tema`, `personagem` ("o Naruto": aparece em "E o Naruto?"), `slides`. Cada slide tem `tipo` e `tema` (`blue`, `light`, `dark`; nunca 3 iguais seguidos). Veredito: `sim` (✔ Cumpre), `nao` (✘ Não cumpre) ou `talvez` (? Depende; troque o texto com `rotulo`).

| tipo | campos |
|---|---|
| `capa` | `kicker`, `titulo` (aceita `[[caixa]]`), `texto`, `selo` (carimbo, padrão "Em análise"), `objeto` (personagem em 3D) |
| `lei` | `kicker`, `titulo`, `ref`, `citacao` (texto **literal** da lei, um item por linha), `traducao` |
| `requisito` | `numero`, `titulo`, `veredito`, `rotulo`, `artigo`, `regra` (o que a CF diz), `analise`, `quem` |
| `virada` | `kicker`, `titulo` (bloco sólido), `texto` |
| `checklist` | `kicker`, `titulo`, `itens: [{v, t, art}]`, `selo` (carimbo final), `seloX`, `seloY`, `seloTam` |
| `cta` | `titulo`, `texto`, `botao`, `foto` (crachá "Candidato aprovado"; troque com `cracha`) |

# English Journey · Teacher Anderson

Plataforma de inglês refeita do zero (aluno e professor), publicada em https://claude.ai/artifact/1kfuxknfAqDoNpwQUdihof
(publique `index.html` com `root: site/anderson-english-journey` e `files` = `anderson.webp` e todos os `img/*.webp`).

- A jornada vai do Rio de Janeiro aos Estados Unidos: New York (unidade 1), San Francisco (unidade 2) e Boston (unidade 3). O mapa da rota, o cartaz de cada cidade e o mapa de ruas com as paradas são ilustrações próprias, desenhadas por código em `arte/` e gravadas em `img/*.webp`. Nada vem de banco de imagens.
- Para refazer as ilustrações: `node arte/gerar.mjs [rio nyc sf boston rota mapa-nyc mapa-sf mapa-boston]` (no ambiente em nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node arte/gerar.mjs`). Precisa de Playwright e Pillow. `node arte/gerar.mjs folha` gera só uma folha de conferência dos glifos.
- Os glifos dos lugares (`<symbol id="g-...">` no `index.html`) servem aos carimbos do passaporte e aos medalhões do mapa da rota; o `arte/gerar.mjs` lê esses símbolos do próprio `index.html`.
- As paradas ficam em `UNIDADES[].paradas` com `x` (a partir do centro) e `y` em pixels do mapa do destino (`img/mapa-*.webp`, 860 px de largura). Mudou a posição ou o número de paradas, confira o mapa e, se preciso, a altura (`mapaH`, igual à do desenho em `arte/locais.mjs`).
- A foto do professor (`anderson.webp`) fica fora do git; recorte da foto que veio embutida na prévia original.
- Tudo num arquivo só: dados (unidades, lições, leituras, diálogos, trilhas, baralhos, semana, carimbos) no topo do `<script>`, estado salvo no navegador (`localStorage`, chave `ej-v4`).
- Áudio pela voz do navegador em três velocidades (lento, normal, rápido); leituras destacam a palavra lida. Sem voz em inglês no aparelho, o diálogo e o destaque seguem pelo tempo de leitura.
- Tipos de exercício: escolha, monte a frase, pares, ouça e escreva, ouça e escolha, complete a lacuna, encontre o erro, leitura com tradução por toque e diálogo.

## Contas, aulas e app instalável
- **Contas de aluno:** ficam neste aparelho (`localStorage`: `ej-contas` com a lista e `ej-v5-<id>` com o estado de cada uma; a conta de demonstração usa `ej-v5`). Sem senha e sem nuvem por enquanto.
- **Teste de nivelamento:** `NIV_Q` no `index.html`; define nível, objetivo e meta diária da conta.
- **Aulas ao vivo:** o professor publica título, data, link e gravações em "Aulas" (`ej-aulas`); o aluno entra pelo link e a presença fica registrada na conta.
- **App instalável e offline:** `python3 montar.py` gera `dist/` (fora do git) com `<head>`, `manifest.webmanifest`, `sw.js` e ícones, para hospedar em qualquer servidor estático com https. No Artifact do claude.ai isso não funciona (sem service worker). Ao publicar versão nova, troque `VERSAO` no `sw.js`.

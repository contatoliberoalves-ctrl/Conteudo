# ENAC em dados

Perfil de dados sobre o Exame Nacional dos Cartórios (`@enacemdados`). Identidade em `identidade.mjs`: tinta, osso, lima (o dado) e coral (dúvida e recurso), Space Grotesk + IBM Plex Mono, cantos retos, sem emoji, e a grade de 100 quadrados em que cada quadrado é uma questão.

## Telas (`dados.json` → `node render.mjs [id]` → `saida/<id>/<n>.png`)

Cada post tem `id`, `titulo` e `telas`. Layouts:

- `capa` (1080×1920, capa de reels; tudo no miolo 4:5): `rotulo`, `numero`, `de` (ex.: `/60`; não use junto com `grupos`), `titulo` (`[[lima]]`, `{{coral}}`), `sub`, `cor` (`lima` ou `coral`), `tn`/`ts` (tamanho do número e do título), `grupos` (`[{n, cor}]`, minigrade de 100).
- `pergunta` (1080×1350): `rotulo`, `titulo`, `sub`, `cta`, `ctaSub`, `fonte` e `visual`:
  - `{tipo: "regua", corte, rotulo: [linha, linha]}`: régua de 0 a 100 com a linha de corte;
  - `{tipo: "opcoes", itens: [{letra, nome, v}]}`: enquete com barras (até 4);
  - `{tipo: "alerta", numero, legenda, titulo, itens: [até 3 frases]}`.
- `direto` (1080×1350, o padrão dos posts): `fundo` (`tinta`, `lima`, `osso` ou `coral`), `titulo` (lista de linhas, `[[destaque]]`), `ts`, `numero` e `tn` (opcional), `linhas` (até 5 linhas curtas), `cta` e `selo` (edição da prova no canto, padrão "ENAC 2026.2").
- `marca` e `elementos`: pranchas do manual da identidade.

## Vídeos (`videos.mjs`)

`node videos.mjs [id,id]` gera `saida/videos/<id>.mp4` (com narração) e `<id>-sem-voz.mp4` (só trilha). As cenas ficam no objeto `VIDEOS` do arquivo: `numero` (número gigante com contagem), `grade` (100 quadrados por grupo), `barras` (ou `blocos: true`, um quadrado por questão), `duelo` (duas letras em disputa), `lista` (norma + contagem), `frase` e `cta`. O campo `fala` de cada cena é narrado na ElevenLabs (voz `ENAC_VOZ`, padrão "Paulo Radames", locutor da biblioteca; não usar a voz do Líbero neste perfil) e a cena dura o tempo da fala. `PREVIEW=3,10 node videos.mjs id` tira só quadros soltos, sem gastar narração. A trilha é sintetizada em `trilha.py` (precisa de `numpy` e `scipy`).

Legendas e hashtags: `legendas.md`.

Nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs`

---
name: molde-concurso-video
description: Gera Reels animados (1080×1920, MP4) com narração da ElevenLabs, legenda palavra a palavra e efeitos sonoros no molde "Concurso Vídeo" do @concursocomlibero, em Remotion, nas séries Você sabia? (curiosidades de Direito e concursos), Descomplica (assunto difícil ou confuso: controle de constitucionalidade, licitação, imunidade x isenção…) e Edital na mão (saiu o edital, o que mais cai, por onde começar), com CTA para o app Edital com Líbero ou o Curso Concurso com Líbero. Use quando pedirem vídeo, Reels, vídeo animado ou narrado para o Concurso com Líbero.
---

# Molde: Concurso Vídeo

Pasta `moldes/concurso-video/`. Leia o `README.md` (tipos de cena e campos) e o `IDEIAS.md` (ganchos, trilogia do edital, pauta).

1. **Pesquisa.** Edital: WebSearch/WebFetch, números conferidos em pelo menos duas fontes (vagas, salário, requisito, banca, taxa, datas, prova, TAF); o que divergir fica de fora. Jurisprudência e artigos: só o que tiver certeza, com número na `legenda` do post.
2. **Roteiro** em `roteiros/<nn>-<slug>.json`. Comece pelo gancho (fórmulas no `IDEIAS.md`): a frase mais forte do vídeo, legível em 1 s. Falas curtas, faladas (números e siglas como se leem), 45 a 70 s no total (~800–950 caracteres). Cada elemento visual com `em` = uma palavra da fala daquela cena. Números ditos por extenso entram em `legendas` para aparecer como algarismo na legenda. CTA entrega a continuação útil (comenta EDITAL → app; CURSO/FLASH → curso).
3. **Narração:** `cd moldes/concurso-video && (test -d node_modules || npm install) && (test -f public/sfx/pop.wav || node sfx.mjs) && NODE_USE_ENV_PROXY=1 node narrar.mjs <id>`. Veja a duração impressa; se passar de ~70 s, corte fala e narre de novo (só gasta crédito quando a fala muda).
4. **Conferir quadros:** `node quadros.mjs <id> <q1> <q2> …` (um quadro perto do fim de cada cena: início da cena seguinte − 12; os inícios saem de `src/videos.gerado.json`, `(0.25 + cenas[k].ini) × 30`). Abra `saida/<id>/quadros/folha.png` e olhe: texto estourando, elemento que não entrou (aviso `[marca]` no console = palavra do `em` que não está na fala), sobreposição.
5. **Render:** `node render.mjs <id>` → `saida/<id>/<id>.mp4` e `capa.png` (~1–2 min por vídeo). Se der timeout, `CONCORRENCIA=2`.
6. Mande o MP4 e a capa ao usuário (SendUserFile), com a `legenda` do post. Faça commit (o MP4 fica fora do git, em `saida/`).

Voz: `adriano` por padrão (PT-BR). Se o Líbero clonar a própria voz na ElevenLabs, use o id dela em `voz`.
Fora da galeria de imagens (o molde gera vídeo, sem `dados.json`).

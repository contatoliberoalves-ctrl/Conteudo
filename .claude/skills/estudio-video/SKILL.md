---
name: estudio-video
description: Estúdio de vídeo com modelos (mapa do Brasil em blocos, caminho de luz, neon e vidro, aura, cartoon narrado com personagens desenhados por código, Reels com inserções — personagens, imagens, ícones, cards, tela dividida e recorte na frente de cenário entrando na palavra dita —, motion Remotion+GSAP com 6 controles — espaçamento, tipografia, desfoque, easing, follow-through, antecipação —, Reels com motion, Reels destaque, palavra gigante atrás da cabeça, faixa 9:16 com título, uma palavra por vez, legenda em caixa, aula do YouTube e explicativo animado narrado feito por código). Edita vídeos de verdade (Reels, Shorts, Stories, aulas do YouTube) a partir do vídeo bruto gravado: transcreve local e grátis, corta silêncios, hesitações e regravações, reenquadra 16:9 → 9:16 seguindo o rosto, dá punch-in nos cortes, corrige cor e áudio (-14 LUFS), queima legenda palavra a palavra nas cores de cada perfil, põe cartelas, animações (HyperFrames/Remotion), b-roll e música com ducking, e aprende o estilo de cada perfil. Use quando pedirem para editar, cortar, legendar ou montar um vídeo/reels, "tirar as pausas", "colocar legenda", "deixar no formato do Reels", analisar um vídeo de referência ou narrar um roteiro.
---

# Estúdio de vídeo

**Galeria de modelos**: https://claude.ai/artifact/54aB1qgWLkk6ajNfJie6FY (página `estudio/galeria/`).
Quando o usuário citar um modelo pelo nome, siga a receita dele abaixo.

## Modelos
| Modelo | Estilo | Receita |
|---|---|---|
| Reels com legenda destaque | `<perfil>` | transcrever → cortar → revisar → `render --formato reels` |
| Reels do insta pessoal | `liberofilho` | idem |
| Palavra gigante atrás da cabeça | `palavra-atras` | ver seção própria |
| Faixa 9:16 com título fixo | qualquer | `render --formato faixa --titulo "…"` (ou `titulo_fixo` no EDL) |
| Uma palavra por vez | `palavra-pop` | idem Reels |
| Legenda em caixa | `eduarda` | `--formato feed` |
| Explicativo animado narrado | `<perfil>` | `ev.py explicativo roteiro.json` (seção própria) |
| Motion com 6 controles | `<perfil>` | `ev.py motion …` (seção própria) |
| Cartoon narrado | `<perfil>` | `ev.py cartoon roteiro.json` (seção própria) |
| Mapa em blocos | livre | `ev.py blocos roteiro.json` (seção "Motion narrado por roteiro") |
| Caminho de luz | `<perfil>` | `ev.py caminho roteiro.json` |
| Neon e vidro | livre | `ev.py neon roteiro.json` |
| Aura | livre | `ev.py aura roteiro.json` |
| Reels com inserções | `<perfil>` | `insercoes` + `layout` no edl.json → `render` (seção própria) |
| Reels com motion | `<perfil>` | motion transparente (`"transparente": true`) → `sobreposicoes` do EDL → render |
| Aula no YouTube | `aula-youtube` | `--formato youtube` + `ev.py texto` para capítulos |

Modelo novo = estilo novo em `estudio/estilos/` (+ código só se o visual pedir) + entrada em
`estudio/galeria/modelos.json` com amostra em `estudio/galeria/amostras/<id>.mp4` (preview, ~1 MB) →
`python3 estudio/galeria/gerar.py` → publique `estudio/galeria/dist/index.html` com `root:
estudio/galeria/dist` e o `files` que ele imprime, sempre no MESMO link acima (Artifact com `url`).
Numa sessão nova sem amostras, baixe as publicadas (Artifact read, `path: videos/<id>.mp4`).
Publique com `capabilities: {db: {}, user: {}, assets: {}}`. Os personagens do editor
(`dist/personagens/<tipo>-<pose>.png`, fora do git) saem da composição `Retrato` do motion:
`npx remotion still src/index.ts Retrato dist/personagens/libero-acena.png --props='{"tipo":"libero","pose":"acena"}'`
(com `REMOTION_BROWSER` como nos outros renders); o `gerar.py` lista os que existirem.

### O editor da galeria (ilha de edição completa) e os bancos dele
A galeria é um editor: trilho de painéis à esquerda (Modelos, Projetos, Mídia, Texto, Elementos,
Legendas, Áudio, Efeitos, Transições), monitor (enquadrar, grade, zona segura do Reels, tela cheia),
linha do tempo com trilhas T (texto), G (gráficos), L (legenda), V1 (vídeo com tira de miniaturas),
A1 (onda do áudio), A2 (trilha, efeitos sonoros, narrações) e M (marcadores e pedidos), e inspetor
contextual (trecho, elemento, bloco de legenda, trilha, efeito, narração, marcador ou projeto).
Ferramentas: lâmina/dividir (S, B), remover trecho (Del, vira hachurado e some da prévia), "tirar
pausas" (pela onda), velocidade por trecho, zoom/punch-in, cor (presets + brilho, contraste,
saturação, temperatura), transição de entrada, keyframes de posição/tamanho/rotação/opacidade
(Shift+K), animação de entrada e saída, ímã, I/O + repetir, J/K/L, versões, kit por perfil
(fonte e cores de `estudio/estilos/`), formato 9:16/4:5/1:1/16:9 e exportar.
O desenho dos elementos fica em `estudio/motion/src/editor-desenho.js`, usado pelo editor (o
`gerar.py` insere no lugar de `__DESENHO__`) e pela composição `EditorCamada` do render: mude ali.
O `gerar.py` também transcreve cada amostra (cache em `amostras/<id>.palavras.json`) para a
"Legenda automática" do editor; apague o cache quando trocar a amostra.

Banco da página (leia com `ArtifactData`, `url` acima):
- `edicoes/<video>` (v2): `{v: 2, video, nome, arquivo, perfil, formato, enquadre {modo, x, y, fundo},
  segmentos [{ini, fim, vel, vol, fora, trans, cor {preset, brilho, contraste, sat, temp}, zoom {de, para, x, y}}],
  elementos [{tipo: texto|emoji|forma|personagem|imagem|video, inicio, fim, x, y, escala, rot, op, kf [{t, x, y, escala, rot, op}],
  anim {entra, sai, dur}, …}], legendas {ativo, estilo, fonte, cor, destaque, contorno, caixaAlta, tam, y, blocos [{t0, t1, texto, palavras}]},
  audio {volOriginal, mudo, musica {preset, ini, fim, vol, fadeIn, fadeOut, ducking}, sfx [{t, tipo, vol}], narracoes [{t, texto, vol}]},
  efeitos {grao, vinheta, barras}, marcadores, exportar {res, fps, legenda, audio, destino, obs}, status}`.
  `status: "render-pedido"` = clicou em Exportar. Tempos sempre no vídeo ORIGINAL.
- `pedidos`: `{video, t, fim?, x?, y?, tipo, texto, status: "pendente"}`: o que o editor não faz sozinho.
- `solicitacoes`: vídeos novos `{modelo, perfil, formato, duracao, voz, roteiro_pedido, tema, material, personagens, extras, obs, status}`;
  no Reels viral, grave `roteiro` e `nota` no doc para o usuário ver antes de gravar.
- `midia`: o que o usuário enviou `{tipo, assetId, url, nome}`. `versoes`: `{video, nome, criado, ed}`.
- `projetos` (escrito pelo Claude): `{titulo, video, poster, status, descricao}`. Publique o mp4 como
  asset (Artifact `asset: true`) e grave o `url` em `video`: o usuário abre o pronto e edita de novo.

**"Aplica as edições do estúdio"**: para cada `edicoes` com `status: "render-pedido"`: salve o doc em
`estudio/projetos/<video>/edicao.json`, baixe as mídias (`Artifact read path=<assetId>` para uma pasta)
e rode `python3 estudio/ev.py edicao estudio/projetos/<video>/edicao.json [--video original.mp4]
--midia <pasta>` (primeiro `--rascunho`). Ele corta e acelera trecho a trecho, aplica enquadre, zoom,
cor e transição no vídeo, sobrepõe a camada `EditorCamada` (igual à prévia), mistura trilha com
ducking, efeitos e narrações com a voz do perfil, normaliza o áudio e gera o `.srt` se pedido.
Confira (`ev.py verificar`), entregue em `projetos`, marque `status: "pronto"`. Depois os `pedidos`
pendentes e as `solicitacoes` ("faz os vídeos novos do estúdio"), marcando `"feito"`. Ambíguo:
pergunte e deixe como está.

Tudo roda pelo `estudio/ev.py` (Python + ffmpeg). O vídeo nunca é "assistido":
o Claude lê o **texto** (`falas.md`, `ev.py ver`) e olha **uma imagem** por checagem
(`ev.py verificar`). É isso que deixa a edição barata em tokens.

## Começo de sessão
1. `bash estudio/instalar.sh` (segundos se já instalado; numa sessão nova instala tudo).
   Animação: `--skills` (HyperFrames + Remotion). Clonar voz: `--voz`.
2. Vídeos do usuário: upload na conversa, link do Google Drive (`download_file_content`) ou
   pasta local. **Fotos e vídeos pessoais nunca vão para o git** (repositório público):
   trabalhe em `estudio/projetos/<nome>/` (fora do git) ou no scratchpad.
3. Se já existe `edit/projeto.md`, leia e resuma a última sessão numa frase.

## Fluxo
1. **Inventário**: `python3 estudio/ev.py transcrever <pasta>` → `edit/falas.md`
   (frases com `[início-fim]`, `{hã}` hesitação, `⟨tipo⟩` muleta, `(pausa 1.2s)`, `?palavra` dúvida).
   Transcrição fica em cache: nunca transcreva de novo o mesmo arquivo.
2. **Leia o falas.md** e anote: regravações, erros, frases fracas, o gancho mais forte.
3. **Converse e proponha** (4–8 frases): perfil/estilo, formato, duração alvo, gancho,
   o que sai, cartelas/animações, música. **Espere o ok** antes de cortar (a menos que o
   pedido já seja direto, tipo "corta as pausas e legenda").
4. **Corte**: `ev.py cortar <pasta> --estilo <perfil>` gera `edit/edl.json` (silêncios e
   hesitações fora, punch-in alternado, regravações marcadas com ⚠).
   `ev.py ver edit/edl.json` lista os trechos numerados. Edite o `edl.json`:
   apague trechos de regravação (fica a última tomada, em geral), erros e enrolação; ajuste
   `inicio`/`fim` com `ver --palavras` (tempos de cada palavra). Reordene trechos para pôr o
   gancho no começo se fizer sentido. Use `correcoes` para a legenda (`"69": "LXIX"`).
5. **Preview**: `ev.py render edit/edl.json --formato reels --preview` (metade da resolução, rápido).
6. **Autoavaliação antes de mostrar**: `ev.py verificar edit/preview-reels.mp4` → abra o JPG
   (Read) e confira: rosto enquadrado, legenda legível e não coberta, cartela no lugar,
   sem quadro preto/pulo estranho no corte; números de áudio (-14 LUFS, pico ≤ -1).
   Corrija e refaça (no máx. 3 rodadas; depois avise o que ficou).
7. **Final**: `ev.py render edit/edl.json --formato reels` → `edit/final-reels.mp4` + `.srt`.
   Envie com `SendUserFile` (ou suba no Drive). Outros formatos do mesmo EDL:
   `--formato feed|quadrado|youtube|youtube-1440|faixa`.
8. **Memória**: acrescente em `edit/projeto.md` (data, estratégia, decisões, pendências) e
   grave as preferências novas no estilo do perfil (ver "Aprender o estilo").

## Regras fixas (são de correção, não de gosto)
- Corte só entre palavras (o `cortar` já faz; ao editar à mão, use os tempos do `ver --palavras`).
- Respiro de 30–200 ms nas pontas de cada trecho (o Whisper erra 50–100 ms).
- Cada trecho é codificado uma vez, com fade de 30 ms no áudio (sem "clique") e depois
  juntado sem recodificar. Os trechos ficam em cache em `edit/trechos/`: só refaz o que mudou.
- Legenda é a ÚLTIMA camada (nenhuma arte cobre). Tempo da legenda = tempo no vídeo final.
- Loudness medido, não "achado": `verificar` mostra LUFS e pico. Você não ouve o vídeo: diga isso
  e mostre os números.
- Animação com fonte da web: confirme que a fonte carregou (fonte errada falha calada).
- Nunca apresente sem rodar o `verificar` e olhar a folha.

## edl.json
```json
{
 "estilo": "constitucionalgabaritado",
 "fontes": {"bruto": "/abs/bruto.mp4"},
 "trechos": [
  {"fonte": "bruto", "inicio": 8.47, "fim": 14.66, "texto": "…", "zoom": 1.12},
  {"fonte": "bruto", "inicio": 15.47, "fim": 18.38, "enquadro_x": 0.6, "modo": "desfoque"}
 ],
 "sobreposicoes": [
  {"arquivo": "cartelas/gancho.png", "inicio": 0, "fim": 2.8, "x": "centro", "y": 307, "largura": 885},
  {"arquivo": "animacoes/artigo/render.webm", "inicio": 9, "fim": 12, "x": 0, "y": 0, "largura": 1080},
  {"arquivo": "broll/stf.mp4", "inicio": 4, "fim": 6.5, "cobrir": true}
 ],
 "correcoes": {"ms": "MS", "69": "LXIX"},
 "musica": "trilha.mp3"
}
```
- `zoom` 1.0–1.3 (centrado no rosto); `enquadro_x` 0–1 força o centro horizontal; `modo:
  "desfoque"` = vídeo inteiro com fundo desfocado (bom para tela/slide gravado na horizontal).
- Sobreposições usam o tempo do vídeo final e coordenadas da resolução cheia (1080 de largura).
  PNG/JPG, MP4 ou WEBM com transparência. `cobrir: true` = b-roll em tela cheia (o áudio da
  fala continua).
- `musica`: entra em loop, com ducking automático sob a voz (`--musica-vol -16` dB por padrão).

## Palavra gigante atrás da cabeça (`palavra-atras`)
Talking head horizontal. A legenda é o único grafismo: uma palavra por vez (curtas como É/O/DE grudam
na seguinte), Archivo Expanded Black com a maiúscula a ~13% da altura, base no topo da cabeça, a
pessoa NA FRENTE (recorte MODNet quadro a quadro, `estudio/modelos/modnet.onnx`), letra com o fundo
invertido e desfocado puxado para bronze. Se a cabeça cobre mais de 50% da palavra, ela sobe; o
render avisa as palavras que continuaram cobertas (`edit/atras-relatorio.json`).
1. `cortar --estilo palavra-atras` (pausas > 0,6 s encurtadas para 0,3 s, sem picotar a respiração;
   zoom 100/112% no máximo a cada 5 s).
2. Gancho de 15–20 s: copie para o INÍCIO do `trechos` os trechos com as frases mais fortes (a
   promessa/história), depois a ordem normal. Os trechos copiados repetem mais adiante, tudo bem.
3. `render --formato youtube-1440` (master 2560×1440, 30 fps, H.264 CRF 16, BT.709) e
   `render --formato faixa --titulo "<gancho>"` (9:16, vídeo inteiro no meio, título creme em cima;
   o processamento da palavra é reaproveitado). Confira o tamanho (< 300 MB).
4. Entregas de texto: `ev.py texto edit/edl.json` dá a fala no tempo final. Escreva em
   `edit/entregas.md`: 5–7 títulos (marque o recomendado), descrição curta com capítulos
   (`00:00 Título`), um post para o X. Só fatos ditos no vídeo.
5. Conferir: sincronia (cortes pegam vídeo e áudio juntos; olhe um quadro de boca aberta no
   `verificar`), relatório de cobertura e loudness.
Trilha por bloco: `"musica": [{"arquivo": "a.mp3", "inicio": 0, "fim": 18, "db": -20}, …]` (tempo
final; ducking automático; fade em cada bloco). Cor `petroleo`: ambiente frio, pele protegida.

## Inserções: o que aparece além de você (`insercoes` e `layout` no edl.json)
Não entregue só legenda: todo vídeo gravado pede pelo menos 3–5 inserções ligadas ao que é dito.
Cada item tem `gatilho` (a palavra dita no vídeo final; `ocorrencia`, `antes`, `duracao`) ou
`inicio`/`fim` em segundos. Renderizadas no Remotion (camada transparente) e compostas no `render`.
```json
"insercoes": [
 {"tipo": "personagem", "personagem": "ana", "pose": "pensando", "expressao": "surpreso", "balao": "Eu não sei nada!", "posicao": "canto-dir", "gatilho": "ideal", "duracao": 2.2},
 {"tipo": "icone", "icone": "scale", "texto": "Constitucional", "posicao": "topo", "gatilho": "constitucional", "duracao": 1.6},
 {"tipo": "lista", "titulo": "É para você que:", "itens": ["…", "…"], "posicao": "metade-topo", "gatilho": "até", "duracao": 2.7},
 {"tipo": "objeto", "objeto": {"tipo": "carimbo", "texto": "6 / 6", "x": 0.5, "y": 0.2}, "gatilho": "gabaritar"},
 {"tipo": "card", "titulo": "Art. 5º, LXIX", "texto": "…", "posicao": "topo", "gatilho": "…"},
 {"tipo": "imagem", "arquivo": "print.png", "rotulo": "…", "posicao": "topo", "gatilho": "…", "duracao": 3},
 {"tipo": "video", "arquivo": "broll.mp4", "posicao": "metade-topo", "gatilho": "…", "duracao": 3}],
"layout": [
 {"tipo": "recorte", "gatilho": "inscrições", "antes": 0.6, "duracao": 3.5, "cenario": "sala", "quadro": "REFORÇO 1ª FASE", "escala": 0.84},
 {"tipo": "dividida", "gatilho": "até", "duracao": 2.7}]
```
- Personagens: `libero` (o autor em desenho: cabelo raspado, sobrancelhas grossas, óculos redondos de
  tartaruga, terno marinho, gravata azul de bolinhas), `lex`, `martelo`, `ana`, `beto`; poses `parado, acena, aponta, joinha, pensando, comemora,
  explica, bracos-cruzados`; expressões `feliz, neutro, surpreso, bravo, triste, confiante`.
- Objetos: `calendario` (numero, rotulo), `carimbo`/`certo`/`errado` (texto), `documento`, `balanca`, `relogio`, `placa`, `imagem`.
- Ícones: qualquer nome do Lucide (lucide.dev/icons: `scale`, `gavel`, `calendar-days`, `tag`,
  `mouse-pointer-click`, `book-open`, `alarm-clock`, `badge-check`…).
- `recorte`: você recortado (MODNet) na frente de um cenário desenhado (`sala`, `tribunal`, `estudo`,
  `palco`) ou de uma `arquivo` de imagem; `escala` < 1 deixa o cenário aparecer.
- `dividida`: você vai para a metade de baixo; use inserções `"posicao": "metade-topo"` em cima. A
  legenda vai para o meio sozinha.
- Imagens/vídeos de apoio: do usuário (Drive/upload), prints que você fizer (Playwright) ou bancos com
  licença (Pexels/Pixabay pedem chave de API: peça ao usuário). Unsplash e Openverse bloqueiam daqui.
  Nunca use imagem sem licença clara.
- Evite empilhar no rodapé: personagem no canto + legenda + botão brigam. Uma coisa por canto.

## Estúdio de voz (clonar a voz do autor) — `ev.py voz`
Aprendido do VoiceStudio (app AGPL; não copiamos código, usamos os mesmos motores abertos):
a semelhança vem de uma referência LIMPA de 6–12 s com a TRANSCRIÇÃO EXATA, num motor que faz
clone por continuação. Motores (`bash estudio/instalar.sh --voz`): `omnivoice` (k2-fsa, Apache-2.0,
24 kHz), `voxcpm` (VoxCPM2, Apache-2.0, 48 kHz, português) e `chatterbox` (MIT, sem transcrição).
1. Áudio: vídeos só com a voz do autor (pasta do Drive com link aberto enquanto baixa; o YouTube
   bloqueia daqui). Ficam em `estudio/projetos/` (fora do git).
2. `ev.py voz preparar <vídeos>` → trechos limpos em `estudio/projetos/voz/amostras/` + `amostras.txt`.
3. `ev.py voz comparar "frase de teste"` → a mesma frase em cada motor × 2 referências
   (as referências são retranscritas com o Whisper medium), em `projetos/voz/comparar/*.mp3`.
4. `ev.py voz medir` → nota objetiva de semelhança (impressão de voz de cada teste × trechos reais
   que não foram referência; controle "você × você" ≈ 0,91). Mande os mp3 para o usuário ouvir também.
5. `ev.py voz escolher melhor` (ou o nome que ele preferir de ouvido) → `projetos/voz/perfil.json`.
   Hoje: `voxcpm-ref1`, nota 0,944.
6. Com o perfil salvo, **a voz clonada é o padrão**: todo roteiro sem `"voz"` narra com ela
   (explicativo, blocos, caminho, neon, documentário, narrações do editor) e o Líbero do cartoon fala
   com ela. Os outros personagens continuam com vozes edge-tts. Avulso: `ev.py voz falar "texto"`.
   `"velocidade": "+5%"` vale também para a voz clonada (atempo).
- **Estilo, efeito, tom e velocidade** (`ev/vozes.py`, `ev/efeitos_voz.py`):
  `ev.py voz falar "texto" --estilo animado|calmo|serio --efeito podcast|radio|telefone|megafone|eco|sala|robo|sussurro --tom 2 --velocidade 1.1`.
  O estilo escolhe, entre as amostras do autor, a referência com aquele jeito de falar (ritmo, energia e
  variação de tom medidos em `projetos/voz/estilos.json`); o clone copia a entrega da referência. Tom em
  semitons (rubberband, sem mudar a duração), velocidade sem mudar o tom. Nos roteiros:
  `"voz": {"perfil": true, "estilo": "animado", "efeito": "radio", "tom": 1, "vel": 1.05}`. No editor:
  cada narração tem esses campos e `audio.vozVideo {efeito, tom}` muda a voz do próprio vídeo (o efeito
  toca ao vivo na prévia; o `ev.py edicao` aplica tudo). `ev.py voz estilos "frase"` gera um exemplo de cada.
- Confira a fala depois (transcreva o mp4): se uma palavra saiu errada ("copos" no lugar de
  "corpos"), apague o cache daquela frase em `edit/voz-*/` e gere de novo (cada geração varia).
- Siglas são escritas como se leem (OAB → "Ó A BÊ", STF…) e o texto vai frase a frase.
- **Referência que termina no meio da frase vaza** (aprendido em nov/2026): o VoxCPM continua a referência, então se o
  trecho termina em "…e mande para" mas a transcrição diz "…e mande para a Justiça Federal", ele fala "Justiça Federal"
  no começo de TODA frase. Escolha uma referência que termine em ponto final e confira a transcrição do resultado.
  O perfil atual usa `amostras/14.wav` (nota 0,94; controle você × você 0,953).
- Nomes próprios e siglas: transcreva o resultado com o Whisper `medium` e reescreva o que sair errado na fala.
  "STF" e "ÉSSE TÊ ÉFE" saem mal: use "o Supremo". "Alcolumbre" sozinho sai "ao Columbre": use "Davi Alcolumbre".
  "pê éle" sai PL. A tela pode continuar com a sigla (a legenda vem da transcrição; corrija no texto exibido).
- Velocidade na CPU (4 núcleos): ~17× o tempo real (1 min de narração ≈ 17 min). Gere tudo num processo só (modelo carregado uma vez).
- Na CPU é lento (dezenas de segundos por frase); com GPU é rápido. Para ficar ainda mais igual:
  treino com 15–30 min de áudio (notebook `estudio/voz/treinar_voz_colab.ipynb`, RVC no Colab grátis)
  ou o clone profissional do ElevenLabs (pago).
- Só a voz do próprio usuário ou de quem autorizou.

## Cartoon narrado (`ev.py cartoon`)
Desenho animado inteiro por código (Remotion): `estudio/motion/src/personagens.tsx` (os 5 personagens, com o
`libero` como protagonista quando o vídeo é do autor,
rubber hose, rosto, poses) e `Cartoon.tsx` (cenários, objetos, balões, câmera). Roteiro:
```json
{"estilo": "constitucionalgabaritado", "formato": "reels", "velocidade": "+8%",
 "vozes": {"ana": "pt-BR-FranciscaNeural", "lex": "pt-BR-AntonioNeural"},
 "cenas": [
  {"cenario": "estudo", "camera": "zoom-in", "titulo": "Prova da OAB amanhã",
   "personagens": [{"id": "ana", "x": 0.5, "pose": "pensando", "expressao": "triste"}],
   "falas": [{"quem": "ana", "texto": "…", "expressao": "surpreso"}]},
  {"cenario": "sala", "quadro": "ART. 5º, LXIX", "camera": "pan",
   "personagens": [{"id": "ana", "x": 0.28}, {"id": "lex", "x": 0.72, "entra_na_fala": 0, "virado": true}],
   "falas": [{"quem": "lex", "texto": "…", "pose": "explica", "balao": "Calma, Ana!"}],
   "objetos": [{"tipo": "calendario", "numero": 120, "rotulo": "dias", "x": 0.5, "y": 0.26, "gatilho": "cento", "fala": 0}]}]}
```
- Cada fala é narrada com a voz do personagem (edge-tts; ou troque por ElevenLabs/voz clonada como no
  explicativo); a boca segue o áudio quadro a quadro; quem escuta olha para quem fala.
- `pose`/`expressao` por fala mudam o personagem enquanto ele fala; `x` de 0 a 1; `virado` olha para a
  esquerda (o texto da capa do Lex não espelha). `camera`: parada, zoom-in, zoom-out, pan.
- Objetos entram com mola na palavra `gatilho` da fala indicada (`fala`: índice). Cada cena tem
  `titulo` opcional nos primeiros 2,6 s.
- Legenda no chão, abaixo dos pés; `"legenda": false` desliga. ~1 min de render para 40 s em rascunho.
- Personagem novo: desenhe em `personagens.tsx` na mesma caixa 400×600 (pés em y=590), com `Olhos`,
  `Boca` e `Braco`; registre o tipo. Elenco para conferir: composição `Elenco` (`npx remotion still src/index.ts Elenco`).
- Exemplo: `estudio/exemplos/cartoon-ms/roteiro.json`.

## Documentário estilo Vox (`ev.py documentario`)
Reels de 20–45 s que contam UMA história com início surpreendente, virada e final que paga (ex.: Ulysses
ergue a Constituição em 1988 → 4 anos depois o helicóptero cai no mar → o corpo nunca foi achado → ficou
o livro). Visual: papel com fibra, fotos P&B recortadas em colagem (sombra, papel rasgado, moldura),
palavras grandes em serifada itálica (Instrument Serif) no instante em que a voz as diz, marcas à mão
(`circulo`, `sublinhado`, `seta`, `risco`, desenhadas em degraus) e movimento em stop motion (`passo`: 3 =
10 poses/s, com tremidinha). Roteiro no docstring de `ev/documentario.py`; exemplo em
`estudio/exemplos/documentario-ulysses/`.

Método (aprendido do guia "Vox-style reels" da Naomi Metzger, só as ideias):
1. **Fatos checados antes de gravar**; se as fontes divergem, a frase diz menos ("quase não ouvia").
   Roteiro curto: 45–60 palavras.
2. **Áudio primeiro**: a narração define a duração de cada cena (o `ev.py` já faz assim). Ouça e troque
   palavra que soa ambígua.
3. **Uma ideia visual por frase** (decompor uma referência pausando cena a cena: "papel, moldura com
   retrato, casarão ao fundo"). Mostre o rascunho em folha de quadros antes do render final.
4. **Imagens**: mesma luz e mesmo tom em todas (`tom: pb|sepia`); fundos vazios e pessoas/objetos à parte
   (`recorte: pessoa` com MODNet, `verde` se a imagem vier com fundo verde, `rasgado` para fotos inteiras);
   **rosto de pessoa real só de foto real**. Fontes livres: Wikimedia Commons (CC BY/domínio público),
   Agência Brasil (CC BY 3.0 BR); crédito na legenda do post. Gerador de imagem por IA só com o OK do
   usuário (custa créditos).
5. Notas do usuário: uma ou duas por vez; refaça primeiro a cena mais fraca (quase sempre a 1ª).
Checklist "não parece IA": textura de papel · recorte que parece colado · palavra no tempo exato · marca à
mão · movimento em passos. Notas musicais, assinaturas, rabiscos: desenho/imagem, nunca símbolo de fonte.

## Motion narrado por roteiro (blocos, caminho, neon, aura)
Todos no Remotion (`estudio/motion/src/Blocos.tsx`, `Caminho.tsx`, `Neon.tsx`, `Aura.tsx`), som feito em
código, narração pelo mesmo `sintetizar` (edge-tts, ElevenLabs ou voz clonada via `"voz"`), máx. ~1 min.
O formato de cada roteiro está no cabeçalho do `ev/<modelo>.py`; exemplos em `estudio/exemplos/`
(`blocos-constituicoes`, `caminho-pec`, `neon-reforco`, `aura-libero`, `cartoon-poderes`).
- **Mapa em blocos** (história/linha do tempo): Brasil em blocos 3D com os 27 estados
  (`motion/public/geo/brasil-grade.json`, gerado do geojson dos estados), capítulos com `data` (placar
  pixel), `cor` e `cores_uf` (ex.: SP e MG), `origem` (de onde a cor se espalha), `capital` (torre),
  `rotulos` (cidades conhecidas: Rio de Janeiro, Brasília, Salvador, São Paulo, Recife, Manaus, Belém,
  Porto Alegre, Ouro Preto, Petrolina, ou siglas de UF), `camera` (`brasil`, uma cidade, ou x/y/zoom) e
  `fumaca`. Fatos e datas conferidos antes de narrar.
- **Caminho de luz** (rito em etapas): `abertura` (o Lex bate na tela), `chips` (com `gatilho` por chip),
  `contador` (número/de, dígitos em células), `check`, `carimbo` (`riscado` + `carimbo`), `final` (frase de
  3 linhas e o caminho inteiro). Ideal para PEC, processo legislativo, ADI, impeachment.
- **Neon e vidro** (promo/anúncio): `titulo` (linhas com `|`), `cartao` (ícone + título + sub), `numero`,
  `pilulas` (itens com `gatilho`), `cta` (botão). 20–30 s.
- **Aura** (impacto/hype, sem narração): `tomadas` em batidas (personagem, pose, expressão, ângulo
  `frente|baixo|close|lado`, cor da aura), `letreiros` (batida, batidas, texto com `\n`), `bpm`, `queda`.
- Não copie marca ou personagem de terceiros (Minecraft, Duolingo…): use o estilo, com nossos personagens
  e cores. Higgsfield/KATANA é geração de vídeo por IA paga; aqui o equivalente é o modelo Aura, feito em código.

## Motion com 6 controles (`ev.py motion`, Remotion + GSAP)
Projeto Remotion em `estudio/motion/` (GSAP pela integração oficial `useGsapTimeline` do
`@remotion/gsap`: a timeline segue o relógio de quadros do Remotion; nada de play/seek/callback/
Math.random). Tudo sai de UM `controles.json`:
```json
{"estilo": "constitucionalgabaritado", "formato": "reels", "fps": 30, "transparente": false, "som": true,
 "controles": {
  "espacamento":   {"distancia": 140, "direcao": "baixo"},
  "tipografia":    {"escala": 1.0, "rastreamento": -0.01, "altura_linha": 0.92, "max_caracteres": 12, "caixa_alta": true},
  "desfoque":      {"obturador": 180, "amostras": 6},
  "easing":        {"entrada": "expo.out", "saida": "power3.in", "duracao_entrada": 18, "duracao_saida": 9, "escalonar": 3},
  "followthrough": {"atraso_cauda": 2, "overshoot": 0.12, "oscilacoes": 1, "arrasto": 0.35},
  "antecipacao":   {"frames": 4, "recuo": 0.15}},
 "cenas": [
  {"tipo": "titulo", "kicker": "1ª fase OAB", "texto": "Inscrições|abertas", "destaque": ["abertas"], "segura": 1.0, "posicao": "topo", "placa": true},
  {"tipo": "sequencia", "palavras": ["Reforço", "em", "Constitucional"], "segura": 0.5},
  {"tipo": "numero", "numero": 6, "rotulo": "questões para gabaritar", "segura": 1.0},
  {"tipo": "cta", "texto": "Valor promocional", "botao": "Inscreva-se", "segura": 1.4,
   "controles": {"antecipacao": {"frames": 6}}}]}
```
Quadros (q) para tempo de animação; `segura` em segundos. Cada cena pode sobrescrever qualquer controle.
O corpo (linha/palavra) faz antecipação → movimento principal; a cauda (letras, barra, seta) chega
`atraso_cauda` quadros depois, com overshoot/oscilação. `"|"` força quebra de linha; palavra longa
encolhe para caber. `placa: true` põe fundo atrás do título (para usar sobre vídeo claro).

Ciclo **construir → renderizar → esfregar → ajustar → repetir**:
1. `ev.py motion novo <pasta>` (ou escreva o json) · 2. `ev.py motion render <pasta>/controles.json --rascunho`
   (metade da resolução; imprime a agenda com o quadro de cada cena) · 3. `ev.py motion esfregar …`
   (folha com quadros NUMERADOS; `--cena 0 --passo 2`, `--de 10 --ate 40`, `--frames 0,4,8`) → abra o JPG
   e confira contra a checklist abaixo · 4. traduza o feedback em ajuste e rode de novo:
   - "adicione 4 frames de antecipação" → `ev.py motion ajustar <json> antecipacao.frames=+4`
   - "atrasar a cauda em 3 frames" → `followthrough.atraso_cauda=+3`
   - "manter o título por 1 segundo" → `cenas.0.segura=1`
   - "mais longe" → `espacamento.distancia=+60` · "mais rápido" → `easing.duracao_entrada=-4`
   - "sem borrão" → `desfoque.obturador=0` · "mais elástico" → `followthrough.oscilacoes=3`
   - "título maior / mais apertado" → `tipografia.escala=+0.2`, `tipografia.rastreamento=-0.02`
5. Final: `ev.py motion render <json>` (resolução cheia; mp4 com som, ou `.webm` transparente para
   sobrepor a um vídeo com o `render` do estúdio).
Checklist da folha: um foco por quadro; nada colidindo na troca de cenas; nada a menos de ~60 px da
borda; texto não se mexe enquanto deve ser lido (segura ≥ 1 s, +0,25 s por palavra além de 3);
saídas mais rápidas que entradas; nada congelado (o bloco "respira" 2,5%); primeiro quadro não vazio
quando o vídeo começar pelo motion (ou escolha a capa no Instagram).
Som: `ev/sfx.py` sintetiza whoosh no arranque, pop no pouso, impacto no CTA e uma cama suave, no quadro
de cada evento (desligue com `"som": false` ou `--sem-som`). Abrir no Studio: `cd estudio/motion && npx remotion studio`.
Gosto (das skills claude-motion e LottieFiles): entrada `expo.out`/`(0.16,1,0.3,1)`, saída `power3.in`
com metade da duração, escalonar palavras ~3 q, uma cor de acento que significa algo, um momento
"herói" por vídeo, nada linear em algo que começa ou para.

## Explicativo animado narrado (`ev.py explicativo`)
Para vídeo sem gravação (o estilo "Manda Boa" do tutorial do X). `roteiro.json`:
```json
{"estilo": "constitucionalgabaritado", "formato": "reels", "voz": "pt-BR-AntonioNeural", "musica": "trilha.mp3",
 "cenas": [
  {"tipo": "titulo", "kicker": "2ª fase OAB", "titulo": "A peça que *mais cai*", "sub": "…", "fala": "…"},
  {"tipo": "artigo", "ref": "Art. 5º, LXIX", "texto": "…", "destaque": "direito líquido e certo", "fala": "…"},
  {"tipo": "lista", "titulo": "Quando cabe", "itens": [{"texto": "Ato de *autoridade*", "gatilho": "autoridade"}], "fala": "…"},
  {"tipo": "numero", "numero": "120", "rotulo": "dias", "gatilho": "cento", "fala": "…"},
  {"tipo": "comparacao", "titulo": "…", "esquerda": {"titulo": "MS", "itens": ["…"]}, "direita": {"titulo": "HC", "itens": ["…"]}, "fala": "…"},
  {"tipo": "frase", "texto": "…*destaque*…", "autor": "…", "fala": "…"},
  {"tipo": "tela", "imagem": "print.png", "marcar": {"x": .1, "y": .3, "w": .5, "h": .1}, "gatilho": "…", "legenda": "…", "fala": "…"},
  {"tipo": "cta", "titulo": "Quer o *resumo*?", "botao": "Comenta MS", "arroba": "@…", "fala": "…"}
 ]}
```
- Cada elemento entra quando a voz fala o `gatilho` (ou a própria palavra); `*palavra*` = cor de acento.
- Cerca de 19 palavras por cena; uma ideia por cena; comece pela dor, termine numa linha.
- Voz: edge-tts (grátis, com tempo de cada palavra), `{"elevenlabs": "<voice_id>", "modelo": "…"}` com
  `ELEVENLABS_API_KEY` no ambiente (nunca no git), ou `{"clonar": "minha-voz.wav"}` (Chatterbox).
- `--preview` renderiza em qualidade de rascunho; `--so-montar` só escreve a composição.
- O projeto fica em `edit/explicativo/` (abre no HyperFrames Studio). Para cenas fora do padrão,
  edite o `index.html` gerado seguindo a skill `hyperframes` e rode o render de novo.
- Prints reais do painel/site (`tipo: tela`) valem mais que desenho: peça-os ou capture com
  `npx hyperframes capture <url>`.
- Exemplo pronto: `estudio/exemplos/explicativo-ms/roteiro.json`. Leva ~5 min para 45 s na CPU.

## Cartelas e animações
- **Rápido (PIL)**: `ev.py cartela <pasta> --tipo gancho|nome|selo|cta --texto "…" --estilo <perfil>
  --inicio 0 --fim 2.8` → PNG nas cores e fontes do perfil + a linha pronta para `sobreposicoes`.
- **Animado (HyperFrames, recomendado)**: depois de `instalar.sh --skills`, leia
  `.claude/skills/hyperframes/SKILL.md` (e `hyperframes-registry`: ~450 blocos prontos de
  títulos, transições, gráficos, legendas, 3D). Para cada animação, em `edit/animacoes/<nome>/`:
  `npx --yes hyperframes init . --example blank --non-interactive --skip-skills`, ajuste
  1080×1920 e `--ground: transparent`, use as cores/fontes do perfil (os moldes em `moldes/`
  têm as paletas), e `npx hyperframes render . --format webm -o render.webm`. Várias animações:
  um subagente por animação, em paralelo, cada um com caminho de saída, tamanho, duração,
  paleta, fonte e roteiro quadro a quadro.
- **Remotion**: quando for um modelo React reaproveitável (ex.: um vídeo por linha de planilha).
  Skills em `.claude/skills/remotion-*` (ou a skill `remotion-motion-graphics`). Licença: grátis
  para pessoa física e empresa pequena.
- Ritmo: card simples 3–7 s; quem lê precisa de tempo. Animação que "paga" uma palavra termina
  no instante em que a palavra é dita (pegue o tempo no `ver --palavras`). Easing, nunca linear.
- Slides e artes estáticas dos moldes (`moldes/<id>/saida/*.png`) também entram como
  sobreposição ou b-roll (`cobrir: true`).

## Estilos (um por perfil) e "aprender o estilo"
`ev.py estilos` lista: `padrao`, `constitucionalgabaritado`, `liberofilho`, `eticagabaritada`,
`concursocomlibero`, `eduarda`, `aula-youtube`, `palavra-atras`, `palavra-pop`. Cada `estudio/estilos/<perfil>.json` só muda o que
difere do `padrao.json`: `corte` (silêncio máximo, respiros), `zoom`, `enquadro`, `cor`
(`natural|quente|frio|cinema|vivo|pb|nenhum` ou filtro ffmpeg), `audio`, `legenda` (fonte,
tamanho em px na tela 1920, cor, destaque, caixa alta, palavras por bloco, posição 0–1,
`animacao: destaque|palavra|frase`, `fundo_caixa`), `cartela` e `notas`.

- **A partir de uma referência**: `ev.py referencia <arquivo ou link>` → cortes/min, plano médio,
  palavras/min, folha de 16 quadros. Olhe a folha, traduza em valores e crie/ajuste o estilo.
  Instagram/TikTok podem pedir login no yt-dlp: peça o arquivo.
- **A cada correção do usuário** ("legenda maior", "menos zoom", "não corta tão seco"), mude o
  valor no estilo do perfil e anote em `notas` (uma linha, com a data). Assim o próximo vídeo já
  sai certo. Commit e push do estilo.
- Fontes ficam em `estudio/fontes/` (nome da família no campo `fonte`, ex.: `Bebas Neue`,
  `Big Shoulders Display Black`, `Poppins ExtraBold`, `Inter Tight ExtraBold`).

## Narração e voz
- `ev.py narrar roteiro.txt --saida narracao.mp3 --voz pt-BR-AntonioNeural` (grátis, edge-tts;
  outras: `pt-BR-FranciscaNeural`, `pt-BR-ThalitaMultilingualNeural`).
- Voz do próprio autor: `instalar.sh --voz` e `--clonar minha-voz.wav` (Chatterbox; 10–20 s de
  áudio limpo; lento sem GPU). Só a própria voz ou com autorização.
- Narração vira fonte de áudio: monte um vídeo com b-roll/slides e a narração, transcreva e siga
  o fluxo normal para ter legenda.

## Dicas de edição que funcionam
- Corte pelo texto, nunca só pelo volume (corte por silêncio puro gera centenas de picotes).
  Pausas longas são ENCURTADAS (`pausa_manter`), não zeradas: aula 0,3 s, vlog 0,6 s.
- Zoom alternado só dentro da mesma tomada; troca de cena volta a 100%. Se reclamarem de "picotado",
  meça a causa (pausas? zoom?) antes de mexer.
- Punch-in de 115% só na frase de efeito (um trecho com `"zoom": 1.15` do começo ao fim da frase).
- Legenda limpa, não literal: o render tira gaguejo ("pro-produto"), palavra abandonada e repetição
  colada. `"escrita_correta": true` no estilo troca cê/tá/pra por você/está/para (aula, texto formal).
- A legenda desvia do rosto sozinha (vai para baixo do queixo ou acima da cabeça).
- Gancho nos 2 primeiros segundos: a frase mais forte vai para o começo (mesmo que fora de ordem)
  e uma cartela `gancho` reforça. Nada de "Olá, pessoal" no início do Reels.
- Punch-in alternado (1.0 ↔ 1.12) esconde o pulo do jump cut. Em aula longa, desligue
  (`aula-youtube`).
- Legenda: 2–3 palavras, caixa alta e destaque na palavra falada para Reels; frase inteira para aula.
- Música baixa (‑16 a ‑20 dB) e sem letra sob a fala; o `verificar` mostra se a voz ficou por cima.
- Deixe ≥ 1 s no final (CTA/cartela) antes de cortar.
- Peça e respeite direção: para onde olhar, o que o público deve sentir, onde NÃO pôr efeito.

## Outras ferramentas (fora do pipeline, sob demanda)
- `auto-editor` (pip): corte por silêncio em lote, exporta para Premiere/DaVinci/Final Cut
  (`auto-editor bruto.mp4 --export premiere`).
- OpenCut (opencut.app): editor de timeline no navegador para retoques manuais.
- Skill `video-use` (browser-use): mesma filosofia, transcrição paga (ElevenLabs).
- Motion (lidos e aproveitados como ideia, código próprio): whaleyxbt/claude-motion (gosto, ciclo de
  revisão por folhas, som em código), howseen-ai/claude-motion-design (obturador 180°, nada congelado,
  saídas mais rápidas), LottieFiles/motion-design-skill (12 princípios, personalidades de movimento),
  remotion-dev/skills e greensock/gsap-skills (instalados com `instalar.sh --skills`).
- `appariciojunior/video-editor-skills` (DaVinci Resolve Studio): de onde vieram as regras de pausa,
  zoom, legenda limpa e EQ de voz. Licença CC BY-NC: só a ideia foi usada, nada copiado.
- Manim (diagramas e fórmulas animadas), Three.js e Anime.js (cenas 3D e números animados
  em HTML, gravados com o HyperFrames).
- Detalhes, links e comparativos: `estudio/README.md`.

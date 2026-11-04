---
name: editor-reels
description: Edita um vídeo bruto de talking head (vertical ou 16:9, até 4K) e transforma num reel 9:16 pronto no estilo "reels viral": você na metade de baixo, cards animados (gráficos, números que contam, checklists, terminal, chat, CTA) na faixa de cima, na cor do perfil, legenda karaokê de UMA palavra, cortes secos sem pausas nem regravações e trilha baixa. Use quando pedirem "edita esse reels", "faz um reels viral desse vídeo", "reels com os gráficos em cima", "reels com animação", "faz igual a esse reel <link>", quando mandarem um .mov/.mp4 de talking head para virar reel, ou quando o Estúdio de Vídeo tiver um pedido do modelo "Reels viral". Não é para postar nem para vídeo longo do YouTube. Adaptação da skill famous-reel-editor (de Riccardo, Martes AI) para os perfis do Líbero e para a nuvem do Claude Code.
---

# Editor de reels ("Reels viral")

Transforma UM vídeo bruto de talking head num reel 9:16 pronto: a pessoa na metade de baixo, cards animados na faixa de cima (0–864 px), legenda karaokê de uma palavra, trilha baixa. Par natural da skill `roteiro-viral`: **escreva com ela, grave, edite com esta**.

> `<skill>` = `.claude/skills/editor-reels` (neste repositório). Trabalhe numa pasta por reel FORA do git, por exemplo `estudio/<nome>/` (já ignorada) ou o scratchpad: o vídeo bruto e o render final são do Líbero e o repositório é público.

## Ferramentas
- **Transcrição** (tempo de cada palavra):
  - `scripts/transcribe_local.py` — **padrão aqui na nuvem**: faster-whisper local, grátis, sem chave. `pip install faster-whisper` (já testado). Use `--language pt --model small` (rápido) ou `--model large-v3` (melhor, mais lento). Precisa de `SSL_CERT_FILE=/root/.ccr/ca-bundle.crt` na primeira vez (baixa o modelo do Hugging Face).
  - `transcribe.py` (ElevenLabs Scribe, melhor tempo, pago, precisa de `ELEVENLABS_API_KEY`) e `transcribe_groq.py` (Groq, `GROQ_API_KEY`) ficam no Drive (pasta "skills viralizar") e não vêm no repositório. Mesma linha de comando, mesmo JSON de saída.
- **Corte**: `scripts/cutjoin.py` (extrai e junta com o filtro concat, sincronia perfeita) e `scripts/silence_keep.py` (tira os silêncios reais).
- **Cards**: `scripts/gen.py` gera `index.html` (HTML + GSAP) a partir do transcript e de um `batidas.json`; `scripts/render_cards.mjs` renderiza quadro a quadro com o Chromium/Playwright já instalado:
  `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node <skill>/scripts/render_cards.mjs cards cards/cards_all.mp4`
  (o original usava `npx hyperframes render`; aqui na nuvem a política não deixa rodar pacote externo do npm, e o renderizador próprio dá o mesmo resultado. No Mac, `npx hyperframes render . -o cards_all.mp4` continua valendo.)
- **Legenda**: `scripts/captions.py` desenha com PIL (o ffmpeg daqui não tem libass). Montserrat Black em `assets/fonts/`.
- **Composição + trilha**: `scripts/compose.sh`. Sem `MUSIC=/caminho/trilha.m4a` ele sai só com a voz normalizada (a `bg-music.m4a` do kit original não vai para o git: era só um exemplo e tem licença incerta; use a biblioteca de música da rede ou uma trilha licenciada).
- **Cor do perfil**: `perfis.json`. `PERFIL=constitucionalgabaritado` (verde #6FD39B), `liberofilho` (azul claro #8FB0FF), `eticagabaritadanaoba` (rosa #F06BA8), `concursocomlibero` (ciano #14F0E4), `eduarda` (rosé), `podconst` (amarelo), ou `ACENTO=#hex`. UMA cor de destaque por vídeo, sobre preto.
- **B-roll com IA** (Higgsfield/Seedance no original): só se o conector Higgsfield estiver ligado nesta sessão. Sem ele, use B-roll do próprio Líbero (tela gravada, print, foto) ou pule. Nunca invente imagem da pessoa.

## Passo a passo (numa pasta por reel)

0. **Se veio um reel de referência** (link IG/TikTok): estude ANTES (ver "Copiar um reel de referência"). Baixe, faça a folha de contato, tire a cor de destaque.
1. **Bruto HORIZONTAL** (16:9): recorte para 1080×1920 centrado no rosto e trabalhe em `edit/raw9.mp4`:
   `ffmpeg -i <bruto> -vf "crop=1215:2160:<x>:0,scale=1080:1920" -c:v libx264 -crf 18 -c:a aac edit/raw9.mp4` (1215 = 2160·9/16; ache o `<x>` extraindo um quadro; numa fonte de 3840 de largura, x≈1293). **Antes, olhe um quadro**: celular grava "1920×1080" com rotação e na verdade é vertical.
2. **Transcreva o BRUTO**: `SSL_CERT_FILE=/root/.ccr/ca-bundle.crt python3 <skill>/scripts/transcribe_local.py <bruto> --edit-dir edit --language pt --model small`
3. **Leia o transcript palavra por palavra** (`edit/transcripts/*.json`, índices + tempos). Bruto costuma ter **várias tomadas e recados falados** ("corta isso", "de novo", "ó, põe um print aqui"). Isso NÃO entra na narração. **Escolha a tomada limpa de cada frase** e monte uma EDL só com os trechos bons.
4. **Escreva a EDL** à mão: `{"sources":{"src":"<caminho absoluto>"},"ranges":[{"start":a,"end":b},...]}` (a chave é `sources`, um dicionário). `make_edl.py` só serve para bruto de uma tomada. **Estique cada `end` em +0,2/0,4 s** (solta da palavra + respiração). Uma "palavra" de 4 s no transcript = várias tomadas escondidas: investigue com `silencedetect` e divida.
5. **Corte**: `python3 <skill>/scripts/cutjoin.py edit/edl.json edit/cut.mp4`
6. **Tire os silêncios que sobraram** (ESSENCIAL): `python3 <skill>/scripts/silence_keep.py edit/cut.mp4 edit/edl_sil.json` (padrão -40 dB / 0,35 s; sala barulhenta: tente `-35 0.35`) → `python3 <skill>/scripts/cutjoin.py edit/edl_sil.json edit/cutF.mp4`. **NUNCA -30/-32 dB**: come o fim das palavras.
7. **Transcreva de novo o corte final** (`edit/tF`) e **confira se nenhuma palavra foi cortada**: o transcritor "completa" palavra cortada. Sinais: palavra terminando depois do fim do arquivo, frase que "pula", última palavra sumindo. Apague o JSON antigo antes (ele usa cache pelo nome do arquivo).
8. **Escreva as batidas** em `cards/batidas.json` lendo `edit/tF/transcripts/cutF.json`: `[["gatilho","tipo",{params}], ...]`. Cada card começa no `gatilho` (palavra ou frase dita) e vai até o próximo: **contínuos**, sempre tem um na tela. Exemplo real: `references/examples/batidas-reforco-constitucional.json`. Elementos internos podem ter seus próprios gatilhos (os itens do `listcheck`, `comstep`, `wachat`). `"A"`/`"RED"` num parâmetro de cor viram as cores do perfil.
9. **Recursos do projeto**: `mkdir -p cards/assets/logos` e ponha ali só os logos que algum card usar (os do kit original, whatsapp/claude/openai/github, ficaram no Drive; confira cada SVG sobre fundo preto). Prints reais (questão da FGV, artigo, app) vão em `cards/assets/` dentro de uma moldura.
10. **Gere e renderize os cards**: `cd cards && PERFIL=<perfil> python3 <skill>/scripts/gen.py ../edit/tF/transcripts/cutF.json batidas.json && cd .. && CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node <skill>/scripts/render_cards.mjs cards cards/cards_all.mp4`
11. **Corrija o transcript da legenda e gere a legenda**: o Whisper erra nome e termo ("AB"→"OAB", "Inscreções"→"Inscrições", "gabaritais"→"gabaritar", "MS" vira "MS."): corrija só o campo `text` numa cópia `cutF_cap.json` (os tempos não mudam; os gatilhos dos cards ficam no original). `python3 <skill>/scripts/captions.py edit/tF/transcripts/cutF_cap.json edit/capt 12 92` (último número = tamanho; ~92; palavra comprida tipo INCONSTITUCIONALIDADE: 72–80).
12. **B-roll** (opcional, ver acima): janelas tiradas do transcript FINAL, nunca no gancho (~2 s) nem no CTA, 2–4 s cada, separadas. Composição em `references/examples/compose-broll.sh`.
13. **Componha**: `bash <skill>/scripts/compose.sh edit/cutF.mp4 cards/cards_all.mp4 edit/capt renders/<nome>-FINAL.mp4 <crop_y>` (com trilha: `MUSIC=... MUSIC_VOL=0.06`). O `crop_y` muda por vídeo (~120–300): teste 3–4 valores em quadros (`scale=1080:-2,crop=1080:1056:0:$cy`) e deixe o rosto na parte de CIMA da faixa de baixo.
14. **Avalie antes de mostrar**: extraia um quadro de cada card, faça uma folha de contato e compare com a referência. Confira sempre: primeira palavra inteira, última palavra + legenda inteiras, legenda legível em todo B-roll, troca de card sem piscar, **sincronia A/V** (`ffprobe` duração do vídeo ≈ do áudio, < 1 quadro) e **legenda == palavra falada** em 3–4 pontos.
15. **Retrospectiva + aprendizado** (OBRIGATÓRIO, ver abaixo).

## Estilo (fixo, menos a cor)
- 9:16, talking head nos ~55% de baixo (overlay y=864), faixa de cima 0–864 preta para os cards.
- **UMA cor de destaque por vídeo** sobre preto, a do perfil (`perfis.json`). Vermelho do perfil para "não / errou / caro".
- Legenda: Montserrat **Black**, branca, MAIÚSCULA, **UMA palavra**, sem contorno preto (sombra suave), na borda com o vídeo.
- Camada decorativa SEMPRE ligada: partículas subindo, riscos de luz, brilho respirando, grade correndo: a faixa nunca fica parada.
- Cards GRANDES que enchem a faixa (palavra ~112 px, número ~200 px, gráficos altos).
- **MENOS TEXTO nos cards**: o card leva o VISUAL (um número, uma palavra, um ícone, um gráfico). A narração + legenda levam as palavras. Gancho: um visual + no máximo uma palavra.
- Cores e fontes: os cards usam Montserrat. Se o vídeo é de um perfil com fonte própria e o Líbero pedir, troque `font-family` no HTML do `gen.py` (Antonio/Poppins no CG, Big Shoulders no @liberofilho).

## Vocabulário de cards
Implementados no `gen.py`: `intro` (avião num arco tracejado, `eb`/`t1`/`t2`) · `statgraph` (número que conta + unidade + linha que se desenha) · `summary` (rótulo + palavra grande) · `graph` (linha subindo verde / descendo vermelha) · `crm` (linhas de contato com etiqueta, `tag`) · `listcheck` (✓ entrando nos gatilhos) · `calendar` (dia destacado) · `comstep` (lista riscada em vermelho, item por palavra, e carimbo) · `iphone` (print real do produto em `assets/iphone_phone.png`) · `wachat` (chat escuro do WhatsApp, `nome`) · `msgtpl` (mensagem-modelo, exemplo em italiano: reescreva antes de usar) · `vflow` (3 caixas empilhadas com setas) · `cta` (palavra + barra que enche).

**Cards prontos para colar** em `references/card-snippets.md` (em inglês, código): gancho em etapas com logo · TERMINAL que digita · pílula por palavra + resultado · blocos numerados 1-2-3-4 · troca antes/depois · título com selo · número que "estoura" · CTA com palavra colorida. Mais ideias em `references/animacoes.md` (barras, velocímetro, rosca, mapa de calor, estrelas, tabela, diff de código, odômetro, linha do tempo, notificações, comparação com cortina…). Para Direito: artigo de lei com grifo, carimbo "CAI NA PROVA", balança, rito em trilha (PEC: 3/5, dois turnos), placar de votação (308/513).

## Copiar um reel de referência (quando vier um link)
1. Baixe (`yt-dlp -o ref.%(ext)s "<url>"`, se o yt-dlp estiver disponível; senão peça o arquivo).
2. Folha de contato a 2 fps: `ffmpeg -ss A -t 15 -i ref.mp4 -vf "fps=2,scale=216:384,tile=5x6:padding=4:color=black" folhaA.jpg` e LEIA: onde fica o talking head, que cards aparecem, de quanto em quanto tempo o card muda, estilo da legenda.
3. Tire a cor de destaque de um quadro (pixels vivos com PIL) → `ACENTO=#hex`.
4. Distribua as SUAS batidas nos cards observados. Não copie o texto da referência.

## Integração com o Estúdio de Vídeo
O Estúdio (https://claude.ai/artifact/54aB1qgWLkk6ajNfJie6FY) tem o modelo **"Reels viral (roteiro + edição)"** (id `reels-viral`). Quando o Líbero pedir "faz os vídeos novos do estúdio" ou "edita o pedido X":
1. Leia a coleção `solicitacoes` com `ArtifactData` (list). Pedido com `modelo: "reels-viral"`:
   - **sem vídeo gravado** (`roteiro_pedido: "escrever"` ou `"meu"`, sem vídeo em `material`): escreva/revise o roteiro com `roteiro-viral`, grave no pedido (`roteiro`, `nota`, `status: "roteiro"`) e devolva para ele gravar.
   - **com vídeo** (link do Drive em `material`): baixe (o conector do Drive não traz vídeo de centenas de MB: peça uma versão menor, exportada em 1080p, ou o arquivo pelo chat) e siga o passo a passo acima com o `PERFIL` do pedido (`@constitucionalgabaritado` → `constitucionalgabaritado`, etc.).
2. Publique o resultado como projeto do Estúdio (aba "Projetos"): mp4 de 540×960 + pôster jpg em `videos/` no `files` do Artifact, e um doc na coleção `projetos` com `titulo`, `video` (`videos/<nome>.mp4`), `poster`, `descricao` e `status`. Marque o pedido em `solicitacoes` como `status: "pronta"`. O vídeo final em resolução cheia vai para o Drive dele, não para o git.
3. Pedidos de alteração que ele marcar no vídeo (coleção `pedidos` do Estúdio: tempo `t`, ponto `x,y`, texto) viram mudanças no `batidas.json`, na EDL ou na legenda; gere de novo e marque o pedido como `aplicado`.

## ERROS PARA NÃO REPETIR (aprendidos na marra)
| Erro | Regra |
|--------|--------|
| Card = texto numa caixa | NÃO. Use gráfico, número, esquema. As PALAVRAS vão na legenda; os cards levam o VISUAL. |
| Caixa pulsando a cada palavra | NUNCA. Movimento = entradas rápidas + camada decorativa contínua + gráfico que se desenha. |
| Sincronia calculada no papel | Acumula erro. **SEMPRE transcreva de novo o corte final** e ancore cards e legenda nos tempos reais. |
| Só tirar os buracos entre palavras | Sobram silêncios de 0,6–1,1 s. SEMPRE rode `silence_keep.py`. |
| Cards esparsos (1 a cada 5 s) | Cards **contínuos**, sempre um na tela, cada um na palavra que o chama. |
| Recado falado na narração | Bruto tem várias tomadas e recados ("corta", "de novo"). Escolha a tomada limpa de cada frase. |
| Música alta | Voz loudnorm -16, música 0,06. Meça com `volumedetect` se a voz foi gravada baixa. |
| Arquivo não abre (QuickTime/IG) | Precisa de `+faststart` (o compose.sh já põe). |
| Legenda com erro do transcritor | Corrija no JSON da LEGENDA antes de gerar (gatilhos ficam no original). Termos jurídicos e siglas (OAB, STF, MS, ADI, PEC) são os que mais saem errados. |
| Sequência de etapas num card curto | Ancore cada etapa numa palavra DIFERENTE e termine antes da saída do card. |
| **Palavra cortada (O MAIS CARO)** | -30 dB come o fim das palavras. Regra: silence_keep no padrão (-40 dB, última palavra protegida) + `end` esticado na EDL + **conferir o ÁUDIO**, não só o texto (o transcritor completa palavra cortada). |
| `find()` pega a PRIMEIRA ocorrência | Palavra que aparece antes (no gancho e na frase seguinte) faz o card entrar cedo. Use `find_after(gatilho, depois_de)`. |
| Legenda branca sobre B-roll claro | O captions.py já tem sombra suave; B-roll claro vai em tela cheia para a legenda ficar na borda escura. |
| Efeito de digitação com TextPlugin | TextPlugin escreve em innerHTML e come tags. Use contador + `textContent=val.slice(0,n)`. |
| Contagem num card curto | Contar de 0 a 91.000 em 0,9 s é ilegível: se o card dura < 1,2 s, mostre o número final com um "pop". |
| Card por baixo do B-roll piscando nas pontas | Cubra com faixa preta (`enable=between`) até o começo do próximo card. |
| Tomada repetida escondida numa palavra longa | Só aparece transcrevendo o corte. Depois do cutF, procure frases duplicadas e palavras truncadas; divida com `silencedetect` e corte de novo. Sem pausa para dividir: transcreva só um trecho de ±2 s em volta (o Whisper "acha" as palavras escondidas). Depois confira de novo cada emenda no corte FINAL. |
| Dessincronia que cresce no meio/fim | Juntar segmentos AAC com concat-copy acumula atraso. O `cutjoin.py` usa o FILTRO concat (sincronia exata). Confira com `ffprobe`. |
| SVG de logo quebrado | Confira TODO logo sobre fundo preto antes de renderizar. Logo com `currentColor` em `<img>` sai PRETO: ponha `fill="#fff"`. |
| Pausas longas entre frases | `silence_keep` padrão MIN 0,35 / PAD 0,12. Reel bem seco: `MIN 0.30`. Depois do corte, confira os buracos (> 0,30 s entre frases = apertar). |
| Visual principal entrando na ÚLTIMA palavra | Deixa o card meio vazio por 2–3 s. Ancore o visual principal CEDO no card (uma das primeiras palavras ou `s+0.2`). |
| Print com moldura de janela "assada" | A borda clara da janela no PNG fica feia no preto. Recorte por PIL e ponha borda na cor do perfil via CSS. |
| Frase repetida 3 vezes igual no bruto | Normalmente fica UMA (a mais limpa). Diferente de lista de três de conteúdo: essa fica. |
| Número sozinho = sem graça | Transforme em VISUAL: curva que se desenha + número estourando no pico. |
| silence_keep acha 0 silêncios (sala barulhenta) | Teste `-35 0.35` antes de escrever a EDL à mão. -30/-32 come o fim das palavras. |
| Gatilho por índice sem conferência | Um índice errado dessincroniza calado. Use gatilho por palavra (`find`) ou um bloco `EXPECT={idx:"palavra"}` que confere antes de gerar. |
| CTA vazio antes da palavra | O CTA de verdade entra tarde (na palavra), então encha o começo do card com elementos secundários que ecoam a frase e escureça-os (opacidade 0,35) quando o principal entrar. Nunca > 1 s de card vazio. |
| Palavra com largura zero na legenda | Depois de muitas emendas o Whisper pode dar `start==end` e empurrar a vizinha. Procure `end-start==0` e conserte os tempos no `*_cap.json`. |
| Transcript velho do cache depois de cortar de novo | Os transcritores guardam pelo nome do arquivo ("cached: cutF.json"). Depois de QUALQUER corte novo, apague o JSON antes. Palavra terminando depois do fim do arquivo = transcript velho. |
| Frase com hífens virando uma "palavra" gigante | Divida no `*_cap.json` em palavras com tempos repartidos. |
| B-roll com IA mudando a roupa no meio | Ao escolher o trecho, confira roupa/óculos contra o talking head. |
| Gancho "antes/depois" vazio no começo | O ANTES fica na tela desde o quadro 1; a troca para o DEPOIS fica na palavra, sequencial (sai rápido, ~0,16 s, e o novo entra). |
| (nuvem) `npx hyperframes` bloqueado | Use `render_cards.mjs` (Playwright). `waitForFunction` precisa de `polling: 250` (o polling por rAF trava). |
| (nuvem) faster-whisper quebrando no PyAV | O `transcribe_local.py` passa o áudio já decodificado (numpy), sem o `av`. |
| (nuvem) edge-tts sem conexão | O proxy não deixa WebSocket: voz sintética de teste com gTTS (`pip install gTTS`) ou a voz do próprio vídeo. |

## Aprendizado (OBRIGATÓRIO no fim de cada reel)
O objetivo é acertar de primeira. Cada edição tem que deixar a skill melhor. Quando o reel for entregue e aprovado (ou depois da última rodada de ajustes):
1. **Retrospectiva honesta no chat**: o que deu certo e o que deu errado NESTE reel (onde cortou, que bugs, quantas rodadas, o que dava para prever). Sem autoelogio.
2. **Vire regra**: erro repetível → linha na tabela acima + conserto no script certo. Técnica ou animação nova → entrada em `references/animacoes.md` e no vocabulário. Preferência de estilo → seção Estilo.
3. **Guarde o exemplo**: o `batidas.json` do projeto vai para `references/examples/` (sem dados pessoais), para o próximo reel começar de uma referência melhor.

## Observações
- O render dos cards sai em `yuv420p` (sem alfa): por isso os cards ficam numa faixa preta e são recortados (0–864).
- Os geradores de exemplo completos do kit original (`gen-reel1-skills.py`, `gen-reel2-claude.py`, `gen-c0886-website.py`, `gen-shortvid-15skills.py`, em inglês/italiano, com terminal, versus, mockups de site, etc.) ficaram no Drive, pasta "skills viralizar/viral-video-skills/famous-reel-editor/references/examples". Peça o arquivo se precisar de um card de lá que não esteja em `card-snippets.md`.
- Referências de estilo do original (Instagram): DYu6wymj8Vu, DYBv913x2IV, DYZs9FiDIii, DZpZb6-jAYv (verde/tech), DZ4sE1RlGT- (laranja Claude: terminal, grade de contribuições, versus, cronômetro, barra de comando).

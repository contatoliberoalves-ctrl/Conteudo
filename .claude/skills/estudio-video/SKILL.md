---
name: estudio-video
description: Edita vídeos de verdade (Reels, Shorts, Stories, aulas do YouTube) a partir do vídeo bruto gravado: transcreve local e grátis, corta silêncios, hesitações e regravações, reenquadra 16:9 → 9:16 seguindo o rosto, dá punch-in nos cortes, corrige cor e áudio (-14 LUFS), queima legenda palavra a palavra nas cores de cada perfil, põe cartelas, animações (HyperFrames/Remotion), b-roll e música com ducking, e aprende o estilo de cada perfil. Use quando pedirem para editar, cortar, legendar ou montar um vídeo/reels, "tirar as pausas", "colocar legenda", "deixar no formato do Reels", analisar um vídeo de referência ou narrar um roteiro.
---

# Estúdio de vídeo

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
   `--formato feed|quadrado|youtube`.
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
`concursocomlibero`, `eduarda`, `aula-youtube`. Cada `estudio/estilos/<perfil>.json` só muda o que
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
- Manim (diagramas e fórmulas animadas), Three.js e Anime.js (cenas 3D e números animados
  em HTML, gravados com o HyperFrames).
- Detalhes, links e comparativos: `estudio/README.md`.

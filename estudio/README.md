# Estúdio de vídeo

Galeria dos modelos: https://claude.ai/artifact/54aB1qgWLkk6ajNfJie6FY

Edição de vídeo profissional feita pelo Claude Code, com ferramentas gratuitas e
poucos tokens: o Claude lê o **texto** da fala e olha **uma imagem** por checagem,
em vez de assistir o vídeo. Como usar está na skill `.claude/skills/estudio-video/`.

## Como pedir
- "Edita esse vídeo pro Reels do @constitucionalgabaritado: tira as pausas, os erros e põe legenda."
- "Corta esse bruto em 3 Reels de até 45 s, cada um com um gancho."
- "Analisa esse vídeo de referência e cria um estilo igual pro @liberofilho."
- "Faz uma vinheta animada com o artigo 5º, LXIX, aparecendo quando eu falo 'mandado de segurança'."
- "Narra esse roteiro e monta com os slides da aula."
- Depois: "legenda maior", "menos zoom", "tira o trecho do prazo", "salva isso no meu estilo".

## O que tem
| Etapa | Ferramenta | Comando |
|---|---|---|
| Transcrição palavra a palavra (local, grátis) | faster-whisper (`small` na CPU, `large-v3` com GPU) + `vocabulario.txt` | `ev.py transcrever` |
| Corte de silêncios, "hã", regravações | `ev/cortar.py` + leitura do Claude | `ev.py cortar`, `ev.py ver` |
| 16:9 → 9:16 seguindo o rosto, punch-in | OpenCV YuNet + ffmpeg | no `render` |
| Cor | presets ffmpeg (natural, quente, frio, cinema, vivo, pb) | estilo `cor` |
| Áudio | filtro de ruído, compressor, ducking da música, loudnorm 2 passadas (-14 LUFS) | no `render` |
| Legenda animada nas cores do perfil | ASS + libass, fontes de cada perfil | no `render` (+ `.srt`) |
| Cartelas (gancho, nome, selo, CTA) | Pillow | `ev.py cartela` |
| Animações e motion design | HyperFrames (HeyGen), Remotion, Manim | `instalar.sh --skills` |
| Referência de estilo | yt-dlp + detecção de cena | `ev.py referencia` |
| Narração / clonagem de voz | edge-tts (vozes pt-BR) / Chatterbox | `ev.py narrar` |
| Palavra gigante atrás da cabeça | MODNet (recorte de pessoa, ONNX na CPU) + Archivo Expanded | estilo `palavra-atras` |
| Faixa 9:16 com título fixo, master 1440p | ffmpeg | `--formato faixa`, `--formato youtube-1440` |
| Explicativo animado narrado (sem gravar) | edge-tts/ElevenLabs/Chatterbox + HyperFrames | `ev.py explicativo roteiro.json` |
| Motion com 6 controles (antecipação, follow-through, easing, desfoque…) | Remotion + GSAP (`@remotion/gsap`) + `@remotion/motion-blur` | `ev.py motion novo/render/esfregar/ajustar` |
| Cartoon narrado com personagens desenhados (Lex, Martelo, Ana, Beto) | Remotion + SVG, boca pelo envelope da voz | `ev.py cartoon roteiro.json` |
| Inserções no vídeo gravado (personagens, ícones, cards, imagens, b-roll, tela dividida, recorte na frente de cenário) | Remotion (camada transparente) + MODNet + ffmpeg | `insercoes` e `layout` no `edl.json` |
| Mapa do Brasil em blocos, caminho de luz, neon e vidro, aura | Remotion + canvas/SVG | `ev.py blocos/caminho/neon/aura roteiro.json` |
| Som de motion escrito em código | numpy (whoosh, pop, impacto, cama) | automático no `motion render` |
| Fala no tempo final (capítulos, títulos, post) | — | `ev.py texto` |
| Autoavaliação | folha de quadros + onda + LUFS | `ev.py verificar` |

Estilos por perfil em `estilos/` (cores e fontes tiradas dos moldes de post).

## Pastas
- `ev.py` + `ev/`: o código. `estilos/`: um JSON por perfil. `vocabulario.txt`: termos que a
  transcrição deve acertar (adicione nomes e termos novos).
- Fora do git (recriados pelo `instalar.sh`): `fontes/`, `modelos/`. Fora do git sempre:
  `projetos/` (vídeos do usuário) e as skills de terceiros em `.claude/skills/`.

## Pesquisa: repositórios e o que aproveitamos
Dos materiais enviados (carrossel "7 repositórios" e guia "Editor de Reels com Claude"):
- [HyperFrames](https://github.com/heygen-com/hyperframes) (HeyGen): HTML + GSAP → MP4/WebM, ~450
  blocos prontos; 21 skills para agentes. Testado aqui: renderiza WebM transparente que entra como
  sobreposição. `npx skills add heygen-com/hyperframes`.
- [Remotion](https://github.com/remotion-dev/remotion): vídeo em React, ótimo para "um modelo →
  centenas de versões" (planilha). Skills: `npx skills add remotion-dev/skills`. Licença paga para
  empresas maiores.
- [faster-whisper](https://github.com/SYSTRAN/faster-whisper): base da transcrição.
- [Chatterbox](https://github.com/resemble-ai/chatterbox): clonagem de voz multilíngue (pt).
- [OpenCut](https://github.com/OpenCut-app/OpenCut): editor de timeline no navegador para retoque manual.
- [Three.js](https://github.com/mrdoob/three.js) / [Anime.js](https://github.com/juliangarnier/anime):
  cenas 3D e números animados (usar dentro de uma composição HyperFrames).
- Guia "Editor de Reels": a ideia da skill "meu estilo" que aprende com as correções virou os
  `estilos/` + `notas`; e a dica de dar direção (olhar, emoção, onde não pôr efeito).

Pesquisados além disso:
- [video-use](https://github.com/browser-use/video-use) (browser-use): de onde vêm as regras de
  produção (legenda por último, fade de 30 ms, cortes entre palavras, autoavaliação). Usa
  ElevenLabs (pago); aqui trocamos por faster-whisper (grátis).
- [video-editor-skills](https://github.com/appariciojunior/video-editor-skills): 12 skills para
  DaVinci Resolve Studio. Aproveitamos as regras (cortar pelo texto, encurtar pausas em vez de zerar,
  zoom só dentro da tomada, legenda limpa, EQ de voz). Licença CC BY-NC: só as ideias, nada copiado.
- Tutorial do X (@jotage0410): vídeo de produto feito todo por código, com voz clonada no ElevenLabs e
  telas reais animadas no Remotion. Virou o modelo "Explicativo animado narrado".
- Motion: [claude-motion](https://github.com/whaleyxbt/claude-motion), [claude-motion-design](https://github.com/howseen-ai/claude-motion-design),
  [motion-design-skill](https://github.com/LottieFiles/motion-design-skill), [gsap-skills](https://github.com/greensock/gsap-skills),
  [Remotion skills](https://github.com/remotion-dev/skills) e a lista [awesome-motion-design-agent-skills](https://github.com/frankxai/awesome-motion-design-agent-skills)
  (todos MIT, lidos; o código do estúdio é próprio). Outros da lista (animate, product-launch-motion,
  motion-graphics, hyperframes-student-kit) ficam como referência para estilos novos.
- [auto-editor](https://github.com/WyattBlue/auto-editor): corte por silêncio em lote e exportação
  de timeline para Premiere/DaVinci/Final Cut.

## Limites honestos
- O Claude não ouve: o áudio é medido (LUFS, pico), não julgado de ouvido. Ouça antes de postar.
- Sem GPU, o `large-v3` é lento; o `small` acerta bem português falado com o `vocabulario.txt`.
- Instagram/TikTok bloqueiam o yt-dlp sem login: para referências de lá, mande o arquivo.
- Primeira versão é rascunho; a segunda, com suas correções, é a que vai ao ar.

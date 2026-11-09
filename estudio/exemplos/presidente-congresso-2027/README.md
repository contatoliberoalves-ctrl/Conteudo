# Presidente do Congresso 2027 (Alcolumbre x Marinho), 3 reels narrados com a voz clonada

Feito em 9/11/2026. Três formatos, todos 1080×1920 na identidade do @constitucionalgabaritado:
1. **O STF proibiu. Em 2027, pode.** (`gen_v1.py`): linha do tempo das legislaturas, art. 57 com grifo, carimbo do STF, fotos.
2. **5 regras pra comandar o Congresso** (`gen_v2.py`): tipografia de tela cheia, artigo por regra, pegadinha do art. 80.
3. **3 erros sobre a eleição do Senado** (`gen_v3.py`): a Ana pergunta por mensagem (texto + som), o Líbero em desenho responde com a voz clonada.

Roteiros: `*.txt` (tela/legenda) e `*.fala.txt` (o que a voz lê: números por extenso, "o Supremo" no lugar de STF,
"Davi Alcolumbre" sempre com o primeiro nome). Passos:
- `narrar_tudo.py` (perfil de `estudio/projetos/voz/perfil.json`), transcrever o wav com o Whisper `medium` e conferir;
  frase errada → `refazer_frases.py frases.json` (tenta até 4 vezes, confere pela transcrição) e `emendar.py` para encaixar.
- Nome no FIM da frase sai errado no VoxCPM ("barrar o Davi Alcolumbre." falhou 4 vezes): reescreva para o nome ficar no meio.
- `gen_vN.py <transcrição.json>` → `vN/index.html`; `quadros.cjs` tira quadros para conferir;
  `render_cards.mjs vN vN/video.mp4 25 1920` (skill editor-reels) e junte com o áudio.
- Fotos (fora do git, em `img/`): Wikimedia Commons, Agência Senado / Senado Federal (CC BY); crédito na tela quando aparecem.

# editor-reels

Adaptação em português da skill **famous-reel-editor** (kit "Viral video skills for Claude", editor feito por Riccardo / Martes AI), recebida na pasta do Drive "skills viralizar" (https://drive.google.com/drive/folders/1DNO7BZgQirYfn396KVKQqiUZRLB6CSGm). O par dela é a skill `roteiro-viral` (adaptação da viral-video-writing).

O que mudou em relação ao original:
- `SKILL.md` em português, com os perfis do Líbero (`perfis.json`: cor de destaque por perfil) e a ligação com o Estúdio de Vídeo.
- `scripts/gen.py`: cor por perfil (`PERFIL=` / `ACENTO=`), batidas em `batidas.json` (2º argumento), gatilhos sem acento (ç/ã/õ), Montserrat do Google Fonts, textos fixos em italiano viraram parâmetros.
- `scripts/render_cards.mjs` (novo): renderiza os cards com o Playwright/Chromium já instalado, no lugar do `npx hyperframes render`.
- `scripts/transcribe_local.py`: passa o áudio decodificado em numpy (evita erro de versão do PyAV).
- `scripts/compose.sh`: funciona sem trilha (a `bg-music.m4a` do kit não foi para o git).
- Ficaram só no Drive: `transcribe.py` (ElevenLabs), `transcribe_groq.py`, os 4 geradores de exemplo grandes, `bg-music.m4a`, logos e `INSTALL-PROMPT.md`.
- Fonte: Montserrat (SIL Open Font License), baixada do repositório google/fonts.

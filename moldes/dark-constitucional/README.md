# Dark Constitucional

Reels/Shorts 1080×1920 do perfil dark de Direito Constitucional, gerados por código com [Remotion](https://www.remotion.dev). Como roteirizar, os tipos de cena e os limites de texto: `.claude/skills/molde-dark-constitucional/SKILL.md`.

```bash
npm install
node render.mjs 15-diretas            # MP4 + um quadro por cena em saida/15-diretas/
node render.mjs --rapido 15-diretas   # só os quadros, para conferir
node scripts/voz.mjs 15-diretas       # narração pelo ElevenLabs (opcional)
npx remotion studio src/index.ts      # pré-visualização interativa
```

- `roteiros/<id>.json`: um vídeo por arquivo (cenas, fala, legenda do post, fontes).
- `dados.json`: índice dos vídeos para a galeria (o `render.mjs` mantém).
- `config.json`: marca do topo, ritmo sem voz e voz do ElevenLabs.
- `src/`: `theme.ts` (cores, fontes, curvas), `cenas/cenas.tsx` (os 9 tipos de cena), `comp/` (fundo, legenda, carimbo), `Reel.tsx`.
- `scripts/sons.mjs`: sintetiza a trilha e os efeitos em `public/sfx/` (fora do git).
- Fontes em `public/fonts/` (Old Standard TT e IBM Plex, licença SIL OFL).
- Saída em `saida/` e voz em `public/voz/` ficam fora do git.

A licença do Remotion é gratuita para pessoa física e empresas de até 3 funcionários.

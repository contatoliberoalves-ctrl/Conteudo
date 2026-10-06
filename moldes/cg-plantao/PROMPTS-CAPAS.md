# Prompts para capas criativas do Plantão Constitucional

Use num gerador de imagem (ChatGPT/DALL·E, Midjourney, Gemini, Ideogram, Leonardo, FLUX…). Formato **4:5 (1080×1350)**.
Salve a imagem em `moldes/cg-plantao/fotos/<nome>.jpg` (fora do git) e ponha `"fundo": "<nome>.jpg"` na capa do post
no `dados.json`: o molde escurece a imagem, puxa para o verde do perfil e escreve o título por cima (no alto),
então a imagem precisa de **espaço vazio no terço de cima** e o assunto no centro/baixo.

**Estilo base** (cole no fim de todo prompt):
> dark moody cinematic photo, deep green and charcoal color palette (#1c1f1e, #3b4c49, mint #9be0a3 accents), dramatic rim light, shallow depth of field, editorial magazine cover look, empty negative space in the top third for a headline, 4:5 vertical, no text, no letters, no logos, no flags with text, no real people's faces

| Post | Arquivo | Prompt (antes do estilo base) |
|---|---|---|
| Presidente do Senado | `fundo-senado.jpg` | empty Brazilian Senate plenary seen from above, curved rows of blue leather chairs, one single empty presidential chair lit by a spotlight |
| Linha sucessória | `fundo-sucessao.jpg` | an empty presidential chair behind a long wooden desk, four chairs lined up behind it in a row fading into darkness, like a queue of successors |
| CPI | `fundo-cpi.jpg` | investigation desk with stacked confidential folders, a magnifying glass over documents, red string evidence board blurred in the background, desk lamp light |
| Medida provisória | `fundo-mp.jpg` | a giant vintage stopwatch melting over a stack of law books, sand hourglass beside it, time pressure concept |
| Imunidade parlamentar | `fundo-imunidade.jpg` | a microphone on a parliament tribune protected by a translucent glowing shield dome, debate hall blurred behind |
| Estado de defesa x sítio | `fundo-sitio.jpg` | a rotating emergency siren light on top of a government building at night, beams cutting through fog, city lockdown mood |
| Nato x naturalizado | `fundo-nacionalidade.jpg` | two passports on a table, one open showing a generic green cover with a globe emblem, airport window light, travel and citizenship concept |

Dicas: peça 3–4 variações e escolha a de fundo mais limpo no alto; evite rostos de pessoas reais (políticos) em imagem de IA.

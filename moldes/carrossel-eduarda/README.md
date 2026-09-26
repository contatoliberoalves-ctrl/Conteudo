# Carrossel Eduarda

Molde convertido do kit "Carrosséis · Eduarda Caraciolo" (Advogada · Direito Civil e ECA). Slides de 1080×1350 em duas linhas:

- **Linha Clara** (L01–L16): fundo off-white/rosé, títulos em Gilda Display, texto em Poppins, rodapé "Eduarda Caraciolo | Advogada · Direito Civil e ECA" com barra rosé.
- **Linha Escura** (D01–D07): fundo `#0F0D0D`, títulos em Anton caixa-alta com acento `#E8B9B9`. Para temas de cultura pop.

O contador "01/07" é automático; "arraste →" aparece sozinho na capa L02 (ou com `"arraste": true`).

## Gerar

```
npm install
node render.mjs [id]
# no ambiente em nuvem do Claude Code:
CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]
```

Saída: `saida/<id>/1.png … N.png` e `painel.png`. O render avisa quando o texto não cabe ou falta imagem; os títulos grandes encolhem sozinhos se uma palavra não couber na largura.

## dados.json

Lista de posts: `{ "id", "titulo" (nome na galeria), "avatar"? (padrão avatar.jpg), "slides": [ … ] }`.
Cada slide tem `"modelo"` e os campos abaixo. Nos textos: `**negrito**` e `==destaque rosé==`. Campos marcados com [] aceitam texto ou lista de parágrafos.
Todo slide aceita `"contador": false`, `"arraste": true|false` e, nos títulos, `"tamanhoTitulo"` (px) para forçar o tamanho.

Imagens: nome de arquivo procurado em `fotos/` (fotos pessoais, fora do git) e depois em `imagens/`. Sem arquivo, o slide sai com um espaço reservado tracejado e o render avisa. `"posicao"` (CSS `object-position`) ajusta o enquadramento.

### Linha Clara

| modelo | uso | campos |
|---|---|---|
| L01 | Capa com foto (recorte à direita) | `numero` (número gigante ao fundo, opcional), `titulo`, `destaque` (faixa rosé), `foto` |
| L02 | Capa tipográfica | `sobretitulo`, `titulo`, `palavra` (grande, rosé), `selo` (pílula) |
| L03 | Card com borda, centralizado | `titulo` (use `==…==`), `texto`[] |
| L04 | Título caixa-alta + destaque | `titulo`, `texto`[], `destaque` (caixa rosé) |
| L05 | Fundo rosé com checklist | `titulo`, `itens` (2 a 4) |
| L06 | Card branco com sombra | `titulo` (rosé), `texto`[] |
| L07 | Etiqueta sobre card | `etiqueta` (curta, 1 linha), `texto`[] |
| L08 | Marca-texto + imagem | `titulo` (sublinhado), `marcaTexto`, `texto`[], `imagem` (objeto recortado), `legendaImagem` |
| L09 | Dado + gráfico | `titulo` (em moldura), `texto`[], `grafico` (imagem) **ou** `barras: [{rotulo, valor, texto?, destaque?}]`, `fonte` |
| L10 | Questão | `numero`, `tema`, `enunciado`, `comando`, `alternativas` (4 ou 5) |
| L11 | Gabarito comentado | `titulo`? (padrão "Gabarito comentado"), `itens: [{questao, letra, texto}]` (até 3) |
| L12 | Pergunta para comentários | `pergunta`, `complemento` |
| L13 | Material gratuito · QR code | `titulo`, `texto`, `link` (gera o QR) **ou** `qr` (imagem), `mostrarLink`? |
| L14 | Item numerado de lista | `numero`, `titulo`, `itens` (2 ou 3) |
| L15 | Caiu na prova (print) | `titulo` (padrão "Caiu na peça:"), `imagem` |
| L16 | CTA final com foto | `titulo`, `texto`, `botao`, `foto` |

### Linha Escura

| modelo | uso | campos |
|---|---|---|
| D01 | Capa com foto de fundo | `sobretitulo`, `titulo` (gigante), `subtitulo`, `foto` |
| D02 | Texto + etapas numeradas | `titulo`, `subtitulo`, `texto`[], `etapas` (até 4), `obs`, `imagem` |
| D03 | Lista em tabela | `titulo`, `texto`[], `tabelaTitulo`, `linhas` (até 5), `rodape`, `imagem` |
| D04 | Número em destaque | `numero`, `legenda`, `palavra`, `texto`, `imagem` (à esquerda) |
| D05 | Comparativo 50/50 | `titulo`, `texto`[], `colunas: [{valor, rotulo}, {valor, rotulo}]`, `imagem` |
| D06 | Fluxograma | `titulo`, `texto`[], `fluxo: {inicio, meioRotulo, meio, fim: [..]}`, `nota` |
| D07 | CTA salvar post | `titulo`, `texto`[], `itens: [{icone: coracao|salvar|seta|check|estrela, texto}]`, `foto` |

## Origem

O kit original (HTML com `<image-slot>` e runtime do editor de design) não fica no repositório; os modelos foram transcritos para `template.mjs` com os mesmos tamanhos, cores e posições. Os 6 posts de `dados.json` são os carrosséis de exemplo do kit (C1–C6).

# Carrossel Explicativo (@constitucionalgabaritado)

Carrossel de Instagram para explicar um tema em 6 ou 7 slides de 1080×1350: **capa** com foto em tela cheia → **4 ou 5 slides de conteúdo** → **CTA**. O visual está em `template.mjs`; o conteúdo vem de `dados.json`.

## Como usar
1. Node.js 18+ e `npm run setup` (1ª vez).
2. Fotos: os recortes ficam em `fotos/` e **não vão para o git** (repositório público). Recrie-os a partir dos originais com `python3 recortar_fotos.py <pasta-dos-originais>` (usa a tabela de rostos de `../estrutura-de-pecas/recortar_fotos.py`).
3. `npm run gerar` (ou `node render.mjs <id>`). Saída: `saida/<id>/1.png … N.png` e `painel.png` (3 primeiros slides, para a galeria).
4. O script avisa (`!`) quando um slide tem texto demais ou quando o texto da capa sobe sobre o rosto.

## Campos do `dados.json`
```json
{
  "id": "mandado-de-seguranca",
  "etiqueta": "2ª Fase OAB",
  "apoio": "Estrutura do",
  "destaque": ["Mandado de", "Segurança"],
  "subtitulo": "opcional",
  "foto": "dsc08842.jpg",
  "slides": [
    { "titulo": "Endereçamento", "texto": "Parágrafo com **negrito**.", "marca": "GPS + M" },
    { "titulo": "Os tópicos", "numerada": ["Dos Fatos", "Do Cabimento"] },
    { "titulo": "Não esqueça:", "lista": ["**Rótulo:** texto"] }
  ],
  "cta": { "pergunta": "Gostou da explicação?", "chamada": "Salva pra revisar depois", "cartao": "escuro" }
}
```

### Capa
- `etiqueta`: pílula branca (ex.: "2ª Fase OAB", "Controle de constitucionalidade").
- `apoio`: linha em Bebas branca acima do destaque (texto ou lista de linhas).
- `destaque`: palavra-chave no marca-texto verde. Texto ou lista de linhas (quebre títulos longos em 2). O tamanho se ajusta à largura.
- `subtitulo` (opcional): traço verde + frase em Poppins.
- `foto`: arquivo em `fotos/`. `fotoPos` (opcional) muda o `object-position`.
- `elemento` (opcional): um detalhe temático em Bebas verde no canto superior direito (ex.: "z z Z").

### Slides de conteúdo (`slides`, 4 ou 5)
Cada slide aceita, nesta ordem na tela: `titulo` (curto, Bebas), `texto` (parágrafo ou lista de parágrafos), `lista` (itens com quadradinho), `numerada` (itens com número em Bebas) e `textoFinal` (parágrafo depois da lista).
- `**trecho**` vira negrito (em fundo verde, fica verde-claro).
- `marca` (opcional): texto gigante translúcido vazando pela borda oposta ao texto (ex.: "ADI 1616", "120 DIAS").
- `figura` (opcional): PNG sem fundo encostado na borda oposta ao texto.
- Automático: fundos na ordem claro, claro, verde, verde, claro; alinhamento alternando esquerda/direita. Para mudar num slide: `"fundo": "claro" | "verde"` e `"alinhamento": "esquerda" | "direita"`. `"barra": false` tira a barrinha de acento.

- Questões: `alternativas` (itens com A, B, C…), `afirmativas` (itens com I, II, III…), `textoMeio` (parágrafo entre as duas), `inicio` (continua a contagem quando a lista vem de um slide anterior).
- `"compacto": true`: letra e espaçamentos menores para slides cheios (texto 42px, listas 34px).
- `gabarito` (no post, não no slide): vira `saida/<id>/gabarito.txt`.

### CTA
`cta.pergunta`, `cta.chamada` e `cta.cartao` (`"escuro"`, padrão, ou `"branco"`).

## Regras do modelo
- Texto do conteúdo usado **literalmente**: só distribuir entre slides e marcar negritos.
- Sem emoji, ícones ou numeração de página.
- Tokens: verde `#3b4c49`, cartão `#2f3d3a`, base da capa `#1c1f1e`, gelo `#f6f7f6`, texto `#1f2a28`, verde-claro `#9be0a3`, verde médio `#3f9a4d`. Fontes Bebas Neue + Poppins (Google Fonts, precisa de internet ao gerar).

# Carrossel Explicativo (@constitucionalgabaritado)

Carrossel de Instagram para explicar um tema em 6 ou 7 slides de 1080×1350: **capa** com foto (5 layouts) → **4 ou 5 slides de conteúdo** → **CTA**. O visual está em `template.mjs`; o conteúdo vem de `dados.json`.

## Como usar
1. Node.js 18+ e `npm run setup` (1ª vez).
2. Fotos: os recortes ficam em `fotos/` e **não vão para o git** (repositório público). Recrie-os a partir dos originais com `python3 recortar_fotos.py <pasta-dos-originais>` (usa a tabela de rostos de `../estrutura-de-pecas/recortar_fotos.py`).
3. `npm run gerar` (ou `node render.mjs <id>`). Saída: `saida/<id>/1.png … N.png` e `painel.png` (3 primeiros slides, para a galeria).
4. O script avisa (`!`) quando um slide tem texto demais ou quando o texto da capa sobe sobre o rosto.

## Campos do `dados.json`
```json
{
  "id": "mandado-de-seguranca",
  "capa": "B",
  "estilo": "caderno",
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

### Variações (para o feed não parecer repetido)
- `capa`: layout da capa (todas com os mesmos campos: etiqueta, apoio, destaque, subtitulo; fotos sem filtro colorido):
  - `A` Editorial: foto em tela cheia, escurecimento neutro embaixo e o título grande solto (última linha em verde-claro).
  - `B` Dividida: foto à esquerda em altura cheia, coluna da direita em degradê com o título.
  - `C` Quadro: foto num passe-partout branco e o título num bloco escuro reto sobre a borda.
  - `D` Painel: foto no alto e painel em degradê com o título.
  - `F` Número: degradê com o número do dia vazado ao fundo (tirado da etiqueta "Dia N"), foto num retângulo com fio claro e título embaixo.
  - `G` Documento: fundo em degradê, folha inclinada com riscos e correções, carimbo e o autor recortado (`recorte`). Para retificação e anulação.
  (Saíram, a pedido: marca-texto, fita, página de jornal e balão.)
- `estilo`: ordem dos fundos dos slides de conteúdo, sempre na mesma paleta:
  - `classico`: branco e degradê.
  - `caderno`: papel e verde-escuro.
  - `noturno`: verde-escuro e branco.
  O CTA é sempre o mesmo: tela em degradê, tudo centralizado (rótulo, pergunta, chamada e os botões Comente/Salve/Envie).
- Regra: **nunca repita a capa do post anterior nem o estilo dos dois anteriores**. Rodízio automático (posts novos do Diário): capas B, C, D, F, A e estilos caderno, noturno, clássico.
- Nas capas B, C e F o título tem área fixa: o render diminui o destaque até caber e avisa se nem assim couber.

### Capa
- `etiqueta`: pílula branca (ex.: "2ª Fase OAB", "Controle de constitucionalidade").
- `apoio`: linha em Bebas branca acima do destaque (texto ou lista de linhas).
- `destaque`: palavra-chave no marca-texto verde. Texto ou lista de linhas (quebre títulos longos em 2). O tamanho se ajusta à largura.
- `subtitulo` (opcional): traço verde + frase em Poppins.
- `foto`: arquivo em `fotos/`. Cada capa posiciona o rosto sozinha; para acertar à mão, use o editor de capa da galeria (vira `fotoAjuste`).
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
`cta.pergunta`, `cta.chamada`, `cta.rotulo` (padrão "ANTES DE SAIR"), `cta.acao1` (padrão "Comente").

## Regras do modelo
- Texto do conteúdo usado **literalmente**: só distribuir entre slides e marcar negritos.
- Sem emoji, ícones ou numeração de página.
- Identidade única do perfil em `../cg-comum/identidade.mjs`: verde-escuro `#0B2619`, verde `#1F8A55`, verde-claro `#6FD39B`, branco/papel e o degradê; Antonio + Poppins. Sem pílulas e sem títulos em balão arredondado.
- Posts do Diário: a "Dica de ouro" fica no fim (último slide antes do CTA) e os títulos dizem o assunto (nada de "Explicação" ou "Tabelinha").

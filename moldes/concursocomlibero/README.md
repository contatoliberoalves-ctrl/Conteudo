# concursocomlibero (@concursocomlibero)

Carrosséis e posts de tela única (1080×1350) para concursos. Segue a lógica do Carrossel Libero (tipos de slide, fundos alternados, perfil no rodapé, textura granulada) com uma estética jurídica: moldura fina de documento com cantos marcados, cabeçalho com a matéria e o nº da folha ("fl. 03/07"), § em marca d'água, etiquetas roxas em mono e cards claros como folhas pautadas.

## Identidade

| uso | cor |
|---|---|
| Fundos (temas `profundo` e `escuro`) | `#06201D`, `#0D3D38` |
| Verde principal (números da lista, fundamento) | `#1F8F7F` |
| Cards e cabeçalhos de tabela | `#EAFAF5`, `#BFE6DD`, branco |
| Palavras estratégicas, prazos, botão | amarelo `#F5C53D` |
| Etiquetas e detalhes especiais | roxo `#2E1A7A` |
| Só erros, pegadinhas, alertas | vermelho `#C0392B` |
| Só acertos e confirmações | verde `#1F8A5B` |
| Texto nos cards | `#101319`, `#3B414D` |

Fontes: **Playfair Display** 800 (títulos), **Poppins** (textos), **JetBrains Mono** (artigos, prazos, números, etiquetas).
Sem emoticons e sem travessões: o render avisa se encontrar `—` ou `–`.

## Gerar

```
npm install
node render.mjs [id]
# no ambiente em nuvem do Claude Code:
CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]
```

Saída: `saida/<id>/1.png … N.png` e `painel.png`. O render reduz título e corpo até caberem e avisa se ainda assim não couber.

## dados.json

Lista de posts: `{ "id", "titulo" (nome na galeria), "materia" (cabeçalho de todos os slides), "slides": [...] }`. Post de tela única = um só slide (sem nº de folha; rodapé com "Salve para revisar").

Todo slide: `tipo`, `tema` (`profundo` | `escuro`, alterne; nunca 3 iguais seguidos), `etiqueta` (opcional, curta), `marca` (letra da marca d'água, padrão `§`; `false` tira).
Nos textos: `**negrito**`, `==amarelo==` (em card claro vira marca-texto amarelo) e `` `mono` `` para artigos e números. `titulo` aceita lista de linhas. `ts` força o tamanho do título; `corpo`, o do texto.

| tipo | uso | campos |
|---|---|---|
| `capa` | abertura | `pre`, `titulo`, `texto`, `foto`? (à direita, com degradê) |
| `texto` | explicação | `titulo`, `texto` [], `destaque` (card claro) |
| `impacto` | frase para guardar | `titulo`, `sub` |
| `lei` | lei seca + tradução | `titulo`, `dispositivo` (ex.: "CF/88 · ART. 37, CAPUT"), `citacao` (literal), `traducao` [] |
| `lista` | itens numerados | `titulo`, `itens` (até 5), `marcadores`? (ex.: `["I","II"]` ou letras) |
| `tabela` | consulta rápida | `titulo`, `cabecalho`? `[col1, col2]`, `linhas: [{valor, texto}]` (até 5), `colValor`?, `tamValor`?, `fundamento` |
| `numero` | prazo, idade, quórum | `numero`, `unidade`, `titulo`, `texto`, `fundamento` |
| `pegadinha` | errado x certo | `titulo`, `errado`, `certo`, `rotuloErrado`?, `rotuloCerto`?, `fundamento` |
| `cta` | fechamento | `titulo`, `texto`, `botao`, `foto`? (polaroide) |
| `questao` | **post único**: certo ou errado | `titulo`, `banca`? (ex.: "CESPE · 2024"), `afirmacao`, `gabarito` (`certo`/`errado`), `explicacao`, `fundamento` |
| `prazo` | **post único**: prazo que cai | `titulo`, `numero`, `unidade`, `texto`, `alerta` (vermelho), `fundamento` |

# concursocomlibero (@concursocomlibero)

Carrosséis e posts de tela única (1080×1350) para concursos. Segue a lógica do Carrossel Libero (tipos de slide, fundos alternados, perfil no rodapé, textura granulada) com uma estética jurídica: páginas brancas com títulos e elementos verdes alternadas com páginas em verde profundo, moldura fina de documento, § em marca d'água, etiquetas roxas em mono e cards claros como folhas pautadas.

Menos é mais (pedido do autor): sem cabeçalho, rodapé só com o @, e capa só com título e subtítulo, sem etiqueta nem traço (a capa pode ter foto de fundo ou ao lado do título).

## Identidade

| uso | cor |
|---|---|
| Fundos: tema `branco` e temas escuros `profundo` e `escuro` | branco, `#06201D`, `#0D3D38` |
| Títulos e destaques nas páginas brancas | `#0D3D38`, `#1F8F7F` |
| Verde principal (números da lista, fundamento) | `#1F8F7F` |
| Cards e cabeçalhos de tabela | `#EAFAF5`, `#BFE6DD`, branco |
| Palavras estratégicas e números nas páginas escuras | amarelo `#F5C53D` |
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

Lista de posts: `{ "id", "titulo" (nome na galeria), "materia" (só para organizar; não aparece), "slides": [...] }`. Post de tela única = um só slide.

Todo slide: `tipo`, `tema` (`branco` | `profundo` | `escuro`; alterne branco com um escuro, nunca 3 iguais seguidos), `etiqueta` (opcional, curta), `marca` (letra da marca d'água, padrão `§`; `false` tira).
Nos textos: `**negrito**`, `==destaque==` (amarelo no escuro, verde no branco, marca-texto amarelo nos cards) e `` `mono` `` para artigos e números. `titulo` aceita lista de linhas. `ts` força o tamanho do título; `corpo`, o do texto.

| tipo | uso | campos |
|---|---|---|
| `capa` | abertura: só título e subtítulo | `titulo`, `sub`; com foto: `foto`, `fotoModo` (`lado`: metade direita, texto à esquerda; `fundo`: tela cheia com degradê e texto embaixo), `fotoPos` (enquadramento CSS, ex.: `"58% top"`); ou `capaModo`: `produto` (título em cima e a tela `imagem` numa janela inclinada) ou `leque` (três telas `imagens` em leque) |
| `texto` | explicação | `titulo`, `texto` [], `destaque` (card claro) |
| `impacto` | frase para guardar | `titulo`, `sub` |
| `lei` | lei seca + tradução | `titulo`, `dispositivo` (ex.: "CF/88 · ART. 37, CAPUT"), `citacao` (literal), `traducao` [] |
| `lista` | itens numerados | `titulo`, `itens` (até 5), `marcadores`? (ex.: `["I","II"]` ou letras) |
| `tabela` | consulta rápida | `titulo`, `cabecalho`? `[col1, col2]`, `linhas: [{valor, texto}]` (até 5), `colValor`?, `tamValor`?, `fundamento` |
| `numero` | prazo, idade, quórum | `numero`, `unidade`, `titulo`, `texto`, `fundamento` |
| `pegadinha` | errado x certo | `titulo`, `errado`, `certo`, `rotuloErrado`?, `rotuloCerto`?, `fundamento` |
| `print` | tela de plataforma/site numa janela de navegador | `titulo`, `texto`, `imagem` (arquivo em `fotos/`, ex.: `enac/print-0856-recorte.png`; recorte antes tirando barra do sistema, dock e abas), `alturaMax`?, `imagemPos`?, `layout`? (`topo`: print em cima e texto embaixo) |
| `beneficios` | resumo em cards (2 colunas) | `titulo`, `itens: [{nome, texto}]` (até 8) |
| `oferta` | preço de/por | `titulo`, `texto`, `de` (ex.: "R$ 497"), `por` (ex.: "R$ 297"), `condicao`? |
| `cta` | fechamento | `titulo`, `texto`, `botao`, `foto`? (polaroide) |
| `questao` | **post único**: certo ou errado | `titulo`, `banca`? (ex.: "CESPE · 2024"), `afirmacao`, `gabarito` (`certo`/`errado`), `explicacao`, `fundamento` |
| `prazo` | **post único**: prazo que cai | `titulo`, `numero`, `unidade`, `texto`, `alerta` (vermelho), `fundamento` |

# Videoaulas ENAC (Cartório com Líbero)

Aulas curtas em vídeo (1920×1080, MP4) com slides animados e narração na voz clonada do Líbero (ElevenLabs). Identidade do Cartório com Líbero: navy, azul, dourado, Big Shoulders.

- `aulas.mjs`: o motor. `node aulas.mjs <arquivo.json ou pasta> [id,id]` → `saida/<id>.mp4`.
- `aulas/aula-NN.json`: um roteiro por aula (Registro de Imóveis, aulas 1 a 30).
- `modelos.json`: as três amostras de formato (A Quadro, B Caso na matrícula, C Questão comentada). O aprovado para a série é o A, com cenas dos outros dois dentro.
- `pesquisa-ri.md`: edital, o que já caiu no ENAC e lista de temas.

Na nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node aulas.mjs aulas`. Variáveis: `CAPAS=1` (só a capa de cada aula, em PNG, em `saida/capas/`), `PREVIEW=1` (só painel de conferência em `saida/previa/`), `SO_CONTAR=1` (conta os caracteres de fala), `MODELO_TTS` (padrão `eleven_turbo_v2_5`, o mais barato; `eleven_multilingual_v2` é o de maior qualidade), `VELOCIDADE` (padrão 0.95), `VOZ`.

## Aula

`{ id, n, tema: "navy" | "papel" | "azul", cenas: [...] }`. Toda cena tem `tipo` e `fala`. Na `fala`, `{k}` marca o instante em que o elemento k entra na tela. `pausa` (segundos de silêncio no fim) e `espera` (antes da fala) são opcionais. Nos textos, `**negrito**` e `[[destaque]]` (caixa azul nos títulos). O conteúdo de cada cena é ampliado sozinho até onde couber.

| Cena | Campos | Marcadores |
|---|---|---|
| `capa` | `rotulo`, `titulo[]`, `ts`, `texto`, `icone` | nenhum |
| `trio` | `rotulo`, `titulo`, `itens[2 a 4]` com `nome`, `apelido`, `texto`, `lei`, `icone` ou `numero` + `unidade`; `nota` | um por item, depois a nota |
| `lista` | `rotulo`, `titulo`, `itens[]` (texto ou `[título, texto]`), `icone`, `check` (resumo) | um por item |
| `lei` | `fonte`, `texto` (literal), `traducao` | `{1}` = tradução |
| `compara` | `rotulo`, `titulo`, `a`, `b` (`nome`, `icone`), `linhas[[rótulo, a, b]]` | um por linha |
| `fluxo` | `rotulo`, `titulo`, `passos[3 a 4]` com `nome`, `texto`, `tag`, `icone`, `ruim`; `quebra` (seta vira ✗), `nota` | um por passo, depois a nota |
| `alerta` | `rotulo`, `titulo`, `errado`, `certo`, `porque` | `{1}` título e caixas, `{2}` porquê |
| `matricula` | `rotulo`, `titulo`, `numero`, `imovel`, `lei` (`fonte`, `texto`, `em`), `atos[]` com `sigla`, `tipo`, `texto`, `em`, `carimbo`, `cor` | os de `em` |
| `questao` | `rotulo`, `selo`, `enunciado`, `alternativas[4]`, `pausa: 3.6` | `{1}` alternativas |
| `gabarito` | `certa` (índice), `titulo`, `alternativas[]`, `passos[]`, `lei` | `{1}` letra, um por passo, depois a lei |
| `bolso` | `rotulo`, `linhas[[a, b]]`, `frase` | um por linha, depois a frase |
| `fecho` | `titulo`, `texto`, `icone` | nenhum |

Ícones: casa, predio, documento, livro, relogio, carimbo, lupa, chave, cadeado, escudo, pessoas, senha, forum, mapa, corrente, caneta, calendario, moeda, olho, regua, alvo, raio, balao, globo.

# Libero Aula (@liberofilho) · slides de aula 1920×1080

Aula de uso geral na identidade do Carrossel Libero (base: `../libero-comum/`). Para "teses que caíram" use o Libero Dossiê; para comparações, o Libero Duelo; para requisitos, o Libero Requisitos. Gerar: `node render.mjs [id]` (nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]`).

Aula: `id`, `titulo`, `tema`, `slides`. Cada slide tem `tipo` e `tema` (`blue`, `light`, `dark`; nunca 3 iguais seguidos). Textos aceitam `**negrito**` e `[[caixa]]`.

## Capas (`tipo: "capa"`, campo `estilo`)
Use um estilo diferente por aula, para os vídeos não ficarem iguais.

| estilo | o que é | campos |
|---|---|---|
| `classica` | título à esquerda, símbolo vazado gigante à direita | `kicker`, `titulo`, `texto`, `simbolo` (ex.: "?", "§"), `ts2` |
| `foto` | o autor recortado à direita sobre um círculo | `foto` (PNG sem fundo em `fotos/`), `fotoX`, `fotoH`, `circuloX`, `anelX`, `anelY`, `selo`, `kicker`, `titulo`, `texto`, `largura` |
| `split` | duas metades (claro x navy) com medalhão | `lados: [{sigla, nome, ts}, {…}]`, `selo` ("ou"), `seloY`, `titulo` (faixa azul embaixo), `ts` |
| `numero` | número vazado gigante | `numero` ("2,3"), `rotulo`, `rotuloY`, `kicker`, `titulo`, `texto`, `tn` |
| `fita` | faixas vermelhas de atenção cruzando a tela | `fita` (texto repetido), `kicker`, `titulo`, `texto` |
| `mapa` | mural de etiquetas (artigos) à direita | `etiquetas`, `kicker`, `titulo`, `texto` |
| `branca` | miniatura de vídeo: fundo branco, título navy, faixa navy | `foto` (opcional), `selo`, `titulo`, `ts`, `rodape`, `simbolo` (sem foto) |
| `dica` | Capa de série numerada (post de Twitter/X): número vazado gigante com "/ total", etiqueta Antes/Depois da prova (`fase`, `numero`, `total`, `titulo`, `texto`). |
| `folha` | prova corrigida com nota carimbada | `nota`, `notaRotulo`, `kicker`, `titulo`, `texto` |

Recortes: `python3 ../carrossel-libero/recortar_pessoa.py ../carrossel-explicativo/fotos/<foto>.jpg fotos/recorte-<foto>.png` (fotos fora do git).

## Conteúdo
| tipo | campos |
|---|---|
| `topico` | `kicker`, `titulo` (esquerda), `texto` (parágrafos à direita), `citacao` + `fonte`, `largura`, `corpo` |
| `lista` | `kicker`, `titulo`, `itens: [{t, d, tag}]`, `colunas` (1 ou 2), `inicio`, `destaque` (false tira o vermelho do 1º), `corpo` |
| `cards` | `kicker`, `titulo`, `cards: [{rotulo, titulo, texto, itens, marca, chips, cor}]` (`cor`: `vermelho`, `navy`, `azul`; sem cor é branco), `corpo` |
| `barras` | `kicker`, `titulo`, `barras: [{rotulo, texto, valor, destaque}]`, `unidade`, `casas`, `max`, `lado` (texto à direita), `colRotulo`, `colValor` |
| `tabela` | `kicker`, `titulo`, `colunas`, `linhas`, `grade` (CSS das colunas), `corpo` |
| `passos` | `kicker`, `titulo`, `passos: [{t, d}]` (o último em vermelho), `corpo` |
| `frase` | `kicker`, `titulo` (bloco grande), `texto`, `caixa` ("vermelho"), `anel` (false tira) |
| `cta` | `kicker`, `titulo`, `texto`, `botao`, `foto` (recorte opcional) |

Capas avulsas (miniatura de vídeo) são aulas com um slide só. Fundamente com lei e com os padrões de resposta da FGV; sem jurisprudência, salvo pedido.

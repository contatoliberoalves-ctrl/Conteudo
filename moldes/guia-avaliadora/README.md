# Guia da Avaliadora

Guia de bolso A6 (105×148 mm) com o roteiro da avaliação odontológica. `node render.mjs [id]` gera em `saida/<id>/`:
`<n>.png` (3×, 1440×2031), `<id>.pdf` (A6, uma página por folha), `<id>-impressao-A4.pdf` (4 páginas por A4, com linha de corte) e `painel.png`.

Cores: marinho `#13213C`, vinho `#6E1F2F`, dourado `#B4924F`, papel `#F7F3EA`. Fontes: Bricolage Grotesque 800 (títulos), Inter.

## dados.json
Um guia por objeto: `id`, `titulo` (galeria), `clinica`, `rodape`, `paginas[]`.

- Capa: `{tipo: "capa", etiqueta, kicker, titulo[], sub[], pilulas[], ts?}`
- Página: `{tema: papel|marinho|vinho, etiqueta, titulo[], intro?, ts?, gap?, marca?: false, blocos[]}`

Blocos (`tipo`):
| tipo | campos |
|---|---|
| `check` | `rotulo?`, `itens[]` (caixinhas) |
| `fala` | `rotulo`, `texto[]` (itálico, barra lateral) |
| `regra` | `rotulo?`, `texto` (faixa vinho; dourada nos temas escuros) |
| `fluxo` | `passos[]`, `rotulo?`, `vertical?` (numerado em coluna), `sep?` (troca a seta, ex.: "ou") |
| `perguntas` | `itens: [{k, q}]`, `largura?` da coluna do rótulo |
| `linhas` | `itens[]` (rótulos) e `n` linhas em branco para escrever |
| `y` | Teoria do Y: `esquerda`, `esquerdaTexto`, `direita`, `direitaTexto`, `base`, `baseTexto`, `altura?` |
| `grandes` | `itens[]` perguntas grandes com caixinha (cartão de mesa) |
| `texto` | `texto` |

Nos textos: `[[destaque]]`, `**negrito**`, `___` (linha para completar). O render reduz o título até 25% e avisa se a página não couber.

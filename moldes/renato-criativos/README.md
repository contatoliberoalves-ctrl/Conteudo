# Renato · Criativos

Criativos de anúncio da plataforma Ponto do Verbum (Formação Bíblica, Pr. Renato Torres), na identidade Brasa (`../renato-comum/brasa.mjs`). Cada post do `dados.json` é uma peça de tela única: feed 1080×1350 ou stories 1080×1920. Nos stories, 250 px em cima e 330 px embaixo ficam livres para o nome do perfil e o botão do anúncio.

Gerar: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id ...]` (precisa terminar com ✓).

## Campos comuns

| campo | uso |
|---|---|
| `id`, `titulo`, `tema` | identificação na galeria (`titulo` não aparece na peça) |
| `formato` | `feed` ou `story` |
| `de` | id de outro post: herda todos os campos (o mesmo criativo no outro formato) |
| `layout` | um dos layouts abaixo |
| `fundo` | `degrade`, `creme` ou `carvao` |
| `tituloPeca` | título da peça; aceita `[[destaque]]`, `**negrito**` e `\n` |
| `kicker`, `sub` | linha de cima e texto de apoio |
| `ts` | tamanho do título, quando o padrão não cabe |
| `escala` | escala dos textos (stories usam 1,0 a 1,3 conforme o layout) |
| `cta`, `ctaSub` | texto do botão (padrão "Toque em Saiba mais") e da linha ao lado (padrão o site) |

## Layouts

| layout | campos próprios |
|---|---|
| `manchete` | `print` (print da plataforma dentro do celular) |
| `tipo` | só `tituloPeca` e `sub` |
| `lista` | `itens[]` |
| `cursos` | `cursos[]` com `nome`, `info`, `capa` |
| `nota` | `itens[]`, `fecho`, `data` |
| `versiculo` | `texto`, `ref`, `sub` (sempre com a referência; os exemplos usam a Almeida Revista e Atualizada) |
| `numeros` | `numeros[]` com `n`, `t` |
| `passos` | `itens[]` |
| `etiquetas` | `etiquetas[]` (cada uma é uma lista de linhas), `print` |
| `comparativo` | `a` e `b`, cada um com `titulo`, `itens[]` |
| `busca` | `busca`, `sub`, `itens[]` |
| `notificacao` | `avisos[]` com `t`, `d`, `hora` |
| `aula` | `capa`, `itens[]` |
| `foto` | `foto`, `pos` (posição do recorte) |

## Imagens (fora do git)

`fotos/` não vai para o repositório. São prints da área do aluno (`print-*.png`, 1170×2532), as capas das aulas (`capa-*.png`, `aula-*.png`), a foto do professor (`renato.jpg`) e o símbolo (`../renato-comum/assets/simbolo.png`, feito com `preparar_simbolo.py`). Numa sessão nova, peça os arquivos ao dono. O `render.mjs` avisa quais faltam.

Não inventar preço, data ou número de alunos. Os números das peças (3 cursos, 25 aulas, 9 + 10 + 6) vêm da estrutura real da Formação Bíblica.

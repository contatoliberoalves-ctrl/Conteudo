# Molde Cartório com Líbero

Peças digitais da plataforma Cartório com Líbero (ENAC e concursos de cartório), em qualquer tamanho, na identidade do insta pessoal do Líbero com dourado no lugar do vermelho. Gere com `node render.mjs [id]` (no ambiente em nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs`). Saída: `saida/<id>/1.png` no tamanho exato e `1@2x.png` (o dobro, para telas retina).

Campos de cada peça em `dados.json`:

| Campo | Uso |
|---|---|
| `id`, `titulo` | identificação (o `titulo` é o nome na galeria) |
| `layout` | `capa` (produto compacto) ou `banner` (faixa larga) |
| `w`, `h` | tamanho em px (padrão 300×250 na capa e 1200×400 no banner) |
| `linhas` | título da peça, uma linha por item; `[[palavra]]` sai na caixa azul com filete dourado |
| `ts` | px do título |
| `assinatura` | "Cartório com Líbero" (dourado) |
| `selo` | (capa) linha pequena acima do título |
| `mes`, `passos`, `feitos` | (capa) rótulo do calendário de bolso; pontos da linha de progresso e quantos estão concluídos |
| `texto`, `tt`, `larguraTexto` | (banner) texto de apoio, px e largura da coluna |
| `checklist`, `feitos` | (banner) itens do cartão de checklist e quantos aparecem marcados |
| `rotuloEvolucao` | (banner) rótulo do cartão do gráfico (padrão "Desempenho") |

Sem martelo, balança, foto de pessoas, preço ou botão.

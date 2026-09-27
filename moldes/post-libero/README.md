# Post Libero (@liberofilho)

Post de **tela única** (1080×1350) no visual do Carrossel Libero: mesmas cores, fontes (Big Shoulders Display e Schibsted Grotesk) e textura granulada, importadas de `../carrossel-libero/template.mjs`.

```
CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]
```
Saída: `saida/<id>/1.png` (e `painel.png`, igual, para a galeria).

## dados.json

Campos comuns: `id`, `titulo` (nome do post na galeria), `layout`, `tema` (`blue`, `light` ou `dark`), `linhas` (o título na imagem, uma linha por item; `[[palavra]]` ganha caixa sólida, `**negrito**`), `ts` (px do título, opcional).

| layout | para | campos |
|---|---|---|
| `dados` | ranking, estatística | `kicker`, `sub`, `barras` (`[{rotulo, valor}]`, em ordem), `unidade` (padrão `×`), `fonte` (no pé, à direita). As barras com o maior valor ficam vermelhas. |
| `material` | material gratuito pra receber no direct | `selo` (padrão "Material gratuito"), `sub`, `apostila` (`{titulo, rodape, ts}`: o que aparece na capa da apostila), `hashtag`, `chamada` (padrão "pra receber no direct") |
| `pdf` | PDF pra receber no direct | `selo` (ex.: "PDF gratuito"), `kicker`, `sub`, `pagina` (título da página do PDF), `itens` (tópicos da página; as linhas de texto ficam só sugeridas), `hashtag`, `botao` (padrão "Enviar ➤"), `chamada` (padrão "e receba o PDF no direct") |
| `estrutura` | estrutura da peça numa folha de petição | `estrutura` (id de um post de `../estrutura-de-pecas/dados.json`: o render puxa título, endereçamento, qualificação, tópicos e valor), `selo` (padrão "Estrutura da peça"). Os tópicos saem em romanos; o que está entre parênteses vira a linha menor. |
| `esqueleto` | estrutura da peça em trilha numerada | `estrutura` (como acima), `kicker` (padrão "Esqueleto da peça"). O endereçamento fica numa faixa azul; o valor da causa fecha a trilha. |

Nos layouts `estrutura` e `esqueleto`, qualquer campo do post (`linhas`, `topicos`…) substitui o que vem da Estrutura de Peças.

Nos layouts `material` e `pdf`, a apostila e a página são desenhos: não precisam de arquivo. Não coloque na página conteúdo que o material não tem.

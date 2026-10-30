# Concurso com Líbero · Plataforma (@concursocomlibero)

Posts 1080×1350 da plataforma Concurso com Líbero. Identidade: cores da plataforma em fundos fixos (verde `#0BA457` → `#078A4A` em degradê leve, petróleo `#04312C`/`#062A26`, papel `#F3F7F5`; o degradê cheio com ciano fica só nas capas de curso e na plataforma), símbolo "L com visto" + "Concurso com Líbero" (Sora), menta `#B9FFF1`. Do insta pessoal (Carrossel Libero) vêm os títulos em Big Shoulders Display caixa alta, `[[palavra]]` em caixa (petróleo no verde, verde no claro), o granulado e o rodapé só com o @. Sem anel, sem número de página e sem "arrasta"; cada página leva só um sinal da marca (logo no topo na capa, no CTA e na tela única; @ no rodapé no miolo). Textos em Inter. Visual em `template.mjs`.

Gerar: `node render.mjs [id]` (nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]`, com `node_modules` disponível). Saída: `saida/<id>/1.png…` e `painel.png`. O render avisa quando o conteúdo passa da página ou, no estilo ficha, do cartão.

## dados.json
- **Carrossel:** `{ id, titulo, estilo, slides: [...] }`, `estilo` = `alternado` (páginas alternando verde e branco, como o azul e o off-white do Carrossel Libero), `claro` (capa e fim verdes, miolo em papel claro com faixa lateral verde) ou `ficha` (miolo como ficha branca do edital, com aba `aba` e carimbo "conferido no edital", sobre fundo petróleo com grade).
- **Tela única:** `{ id, titulo, tipo: "post", selo, manchete[], sub, numeros: [{n, rot, px}], comenta, comentaTexto }`.

Slides (`tipo`): `capa` {pre, titulo[], sub, alerta, ts} (título centralizado; `alerta` = prazo com relógio, para urgência; capa verde no alternado, papel no claro e petróleo na ficha); `numeros` {kicker, titulo[], itens: [{n, rot, px}], fonte}; `comparativo` {kicker, titulo[], colunas: [a, b], linhas: [[critério, a, b]]}; `datas` {kicker, titulo[], itens: [{data, t, destaque}]}; `lista` {kicker, titulo[], itens: [{t, d}]}; `blocos` {kicker, titulo[], itens: [{n, nome, elim, d}]} (blocos de prova); `texto` {kicker, titulo[], paragrafos[], destaque}; `cta` {titulo[], texto, comenta, botao}. `**negrito**` e `[[caixa]]` valem nos textos; `fonte` (rodapé pequeno) em qualquer slide de conteúdo.

Dados de edital: pesquise e confira em mais de uma fonte; cite os editais (número, banca, data de publicação) num slide.

Capa objetiva: só o título que o usuário pediu (e o subtítulo dele); nada de chips, selos ou números na capa. Títulos do miolo diretos ("Vagas e salários", "Datas do concurso"), sem kicker nem frases de efeito genéricas.
O conteúdo de cada página (e da tela única) se ajusta sozinho ao espaço: cresce até ocupar ~92% da altura (no máximo 1,3x) e fica centralizado; o render avisa se não couber.
- **Capa de grupo:** `{ id, titulo, tipo: "grupo", bandeira: "sp" | "pe", manchete[], rotulo (padrão "Grupo de estudos"), ts }`, 1080×1080 com tudo no círculo central (recorte do WhatsApp).

## Capas com elemento gráfico (`visual` na capa)
Para chamar atenção no feed, a capa aceita `visual` (mantém o logo no topo e o fundo do estilo):
- `numero`: número gigante vazado (`numero`, `tn`), etiqueta (`numeroSub`) e título embaixo. Ex.: "60% da prova do ENAC é uma matéria só".
- `trio`: título e três fichas brancas inclinadas (`fichas: [{sigla, nome}]`). Ex.: ENAC × ENAM × ENAP.
- `versus`: título e duas metades (branca e petróleo) com o selo VS (`lados: [linhas, linhas]`).
- `contagem`: folhinha de calendário com os dias que faltam (`dias`, `diasRotulo`, `data`) e título embaixo.
- `curva`: título e o gráfico da curva do esquecimento com as revisões (`rotulos`: 3 marcas do eixo).

## Tela única de material grátis (`tipo: "post"`, `visual: "pdf"`)
Fundo petróleo com grade, manchete (`manchete`, `ts`, `selo`, `sub`), capa do PDF desenhada à direita (`pdf: {titulo[], sub, itens[]}`, `pdfY`) com o selo "PDF grátis" e a caixa de comentário com a palavra (`comenta`, `comentaTexto`, padrão "e receba o PDF").

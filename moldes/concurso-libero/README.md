# Concurso com Líbero · Plataforma (@concursocomlibero)

Posts 1080×1350 da plataforma Concurso com Líbero. Identidade: cores da plataforma em fundos fixos (verde `#0BA457` → `#078A4A` em degradê leve, petróleo `#04312C`/`#062A26`, papel `#F3F7F5`; o degradê cheio com ciano fica só nas capas de curso e na plataforma), símbolo "L com visto" + "Concurso com Líbero" (Sora), menta `#B9FFF1`. Do insta pessoal (Carrossel Libero) vêm os títulos em Big Shoulders Display caixa alta, `[[palavra]]` em caixa (petróleo no verde, verde no claro), o granulado, o anel decorativo e o rodapé só com o @. Textos em Inter. Visual em `template.mjs`.

Gerar: `node render.mjs [id]` (nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]`, com `node_modules` disponível). Saída: `saida/<id>/1.png…` e `painel.png`. O render avisa quando o conteúdo passa da página ou, no estilo ficha, do cartão.

## dados.json
- **Carrossel:** `{ id, titulo, estilo, slides: [...] }`, `estilo` = `alternado` (páginas alternando verde e branco, como o azul e o off-white do Carrossel Libero), `claro` (capa e fim verdes, miolo em papel claro com faixa lateral verde) ou `ficha` (miolo como ficha branca do edital, com aba `aba` e carimbo "conferido no edital", sobre fundo petróleo com grade).
- **Tela única:** `{ id, titulo, tipo: "post", selo, manchete[], sub, numeros: [{n, rot, px}], comenta, comentaTexto }`.

Slides (`tipo`): `capa` {selo, pre, titulo[], sub, chips[], fundoTexto, ts, top}; `numeros` {kicker, titulo[], itens: [{n, rot, px}], fonte}; `comparativo` {kicker, titulo[], colunas: [a, b], linhas: [[critério, a, b]]}; `datas` {kicker, titulo[], itens: [{data, t, destaque}]}; `lista` {kicker, titulo[], itens: [{t, d}]}; `blocos` {kicker, titulo[], itens: [{n, nome, elim, d}]} (blocos de prova); `texto` {kicker, titulo[], paragrafos[], destaque}; `cta` {titulo[], texto, comenta, botao}. `**negrito**` e `[[caixa]]` valem nos textos; `fonte` (rodapé pequeno) em qualquer slide de conteúdo.

Dados de edital: pesquise e confira em mais de uma fonte; cite os editais (número, banca, data de publicação) num slide.

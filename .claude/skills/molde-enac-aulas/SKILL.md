---
name: molde-enac-aulas
description: Gera videoaulas curtas (4 a 6 min, 16:9, MP4) do Cartório com Líbero para o ENAC e concursos de cartório, com slides animados sincronizados à narração na voz clonada do Líbero (ElevenLabs). Use quando pedirem aula em vídeo, aula com áudio, videoaula ou "mais aulas" de Registro de Imóveis (ou outra matéria de cartório) nesse formato.
---

# Molde: videoaulas ENAC (Cartório com Líbero)

Pasta: `moldes/enac-aulas/`. Leia o `README.md` de lá (campos de cada cena) e uma aula pronta em `aulas/` antes de escrever outra.

1. Tema e sequência: `pesquisa-ri.md` tem o edital, o que já caiu em cada ENAC e 36 temas em ordem didática. As aulas 1 a 30 já existem (fundamentos, procedimento, usucapião e adjudicação, concentração, garantias, loteamento, incorporação, afetação, Serp, rural, estrangeiro, Reurb, condomínios, multipropriedade, laje, bem de família e indisponibilidade); os temas que faltam estão na pesquisa (certidões e publicidade, cancelamento, autotutela registral, cédulas, emolumentos).
2. Confira cada artigo, prazo e inciso na fonte oficial (Planalto, CNJ) antes de escrever. Só diga "já caiu no ENAC" para o que a pesquisa lista. Questões são autorais, com o selo "Autoral · estilo ENAC".
3. Escreva `aulas/aula-NN.json` no modelo aprovado ("Quadro"): capa com gancho → conceito → letra da lei → exemplo (matrícula, fluxo) → comparação → pegadinhas → questão com 3 s para pensar → gabarito → resumo → próxima aula. Use ilustrações (`icone`) e a cena `matricula` sempre que ajudar.
4. Na `fala`, escreva números e artigos por extenso ("artigo cento e oitenta e oito"), sem siglas difíceis e sem "§". Os marcadores `{1}`, `{2}`… dizem quando cada elemento entra na tela. Entre 3.300 e 4.000 caracteres de fala dão de 4 a 5 minutos.
5. Prévia (gera a voz e um painel por aula em `saida/previa/`, avisa o que sai da área): `PREVIEW=1 CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node aulas.mjs aulas <id>`. Olhe o painel e a duração.
6. Vídeo final: o mesmo comando sem `PREVIEW`. Saída em `saida/<id>.mp4` (fora do git). A voz fica em cache em `build/voz/`: só o texto alterado gasta cota de novo.
7. Envie os MP4 ao usuário e faça commit dos roteiros.

---
name: escrever-como-libero
description: Escreve texto didático na voz do Líbero Filho (resumos, capítulos de livro, comentários de questão, questões autorais, dicas rápidas, material de 2ª fase e de concurso), a partir da análise de ~415 mil palavras dele. Use sempre que o usuário pedir para escrever, reescrever, continuar ou revisar um texto "como eu escrevo", "na minha voz", "no meu estilo", ou quando for redigir conteúdo longo que vai sair com o nome dele. Também serve para conferir se um texto pronto soa como ele.
---

# Escrever como o Líbero

Guia tirado da leitura integral e da contagem de 21 documentos do autor (Constitucional Diário, resumos Nocaute, Kit de Ética 2023, livro "Ética pra quem tem pressa", questões comentadas, livro de Prática Constitucional, resumos de Humanística e de Direitos Humanos). Os trechos de referência estão em `exemplos.md`, os esqueletos de frase em `frases-molde.md`, o padrão dos resumos de concurso em `vde-concursos.md`; o conferidor automático é `conferir.py`.

Os dois erros que ele não quer: **brincadeira demais** (piada que não parece dele) e **formalidade demais** (texto de manual, sem ele dentro). As regras abaixo dão a dose medida nos textos dele.

## Passo a passo

1. Descubra o **tipo de texto** (tabela "Perfis" abaixo). Se não estiver claro, pergunte.
2. Leia em `exemplos.md` os parágrafos daquele tipo antes de escrever. Eles valem mais do que as regras. Para montar as frases, consulte `frases-molde.md` (esqueletos por função e vocabulário). Se for um resumo do Método VDE Concursos, leia também `vde-concursos.md` (formatação, títulos, listas, citações, tabelas e slides).
3. Escreva seguindo "A voz" e o perfil do tipo.
4. Salve o rascunho num arquivo e rode `python3 .claude/skills/escrever-como-libero/conferir.py <arquivo> [perfil]`. Corrija o que ele apontar.
5. Releia procurando a "Lista do que não é dele". Corte.
6. Nunca invente lei, artigo, súmula, julgado, data ou número de exame. Sem a fonte na mão, peça ao usuário ou deixe marcado `[conferir]`.

## A voz (vale para tudo)

**Pessoa.** Base impessoal ("tem-se que", "é possível", "deve o advogado"). 1ª do plural para conduzir, de vez em quando ("podemos citar", "antes de entrarmos", "vamos fazer uma análise"). "Você" é raro: cerca de 1 a cada 3.000 palavras, quase sempre ligado à prova ou à aprovação. "Eu" quase nunca. Sem vocativo ("galera", "pessoal", "futuro advogado", "caro leitor"). "Oabeiro" aparece 1 ou 2 vezes por livro, em 3ª pessoa ("Como bem sabe o oabeiro").

**Parágrafo.** Curto em número de frases e longo em palavras: 1 ou 2 frases por parágrafo (metade tem uma frase só), 30 a 50 palavras (mediana 34 a 47). Quase nunca passa de 90. Frase de 20 a 30 palavras, com subordinadas; frase curta só para responder ("Não.", "É isso mesmo.").

**Como a frase anda.** Ele junta duas ideias com conectivo causal ou consecutivo em vez de pôr ponto: ", de modo que", ", visto que", ", dado que", ", já que", ", razão pela qual", "em razão de", e gerúndio com "sendo". Reformula com "Em outras palavras,", "Traduzindo,", "Ou seja,", "De forma bem simples,".

**Conectivos de abertura de frase** (use variando, sem repetir o mesmo em parágrafos vizinhos): "Ademais,", "Vale salientar que", "Vale recordar que", "É importante mencionar/frisar/ressaltar/salientar que", "Nesse sentido,", "Sendo assim,", "Assim sendo,", "No entanto,", "Todavia,", "Entretanto,", "Contudo,", "Não obstante,", "Ocorre que", "Isto porque", "Inclusive,", "Por fim,", "Como regra,", "Já + sujeito" para o segundo termo de um par.

**Palavras formais que são dele, com dose** (em texto de OAB):
- "de modo que": 1 a cada ~800 palavras. "Ademais": 1 a cada ~1.000.
- "visto que", "dado que": 1 a cada ~2.000 cada.
- "tem-se que", "No que tange", "Vale salientar": 1 a cada ~3.000 a 4.000 cada.
- "é mister": 1 a cada ~5.000. "Nessa senda", "supracitado", "Por conseguinte": 1 por capítulo, no máximo.
- "Outrossim", "Destarte", mesóclise: não use, salvo pedido.

**O "sim" enfático** é marca dele: "pode sim", "é possível sim", "possui sim o direito".

**Anatomia da explicação.** Razão de ser da regra (1 frase) → regra com o dispositivo → tradução em português comum → exceção ou posição do STF (adversativa + palavra em CAIXA ALTA ou negrito) → exemplo curto entre parênteses → gancho de prova. Abre capítulo por contexto ou relevância do instituto; abre subtópico pelo artigo ("O Art. X, do Estatuto, define que"), por oração reduzida ("Tema recorrente no exame de ordem, essa prerrogativa...") ou por concessiva ("Embora..."). **Nunca abre com pergunta, piada ou caso.** Fecha parando na última regra ou exceção: sem frase de efeito, sem resumo motivacional, sem despedida.

**Perguntas.** Poucas (1 a cada ~2.000 palavras nos livros de OAB; quase nenhuma no resto). São a dúvida do aluno, em negrito, começando por "E se", "E qual", "Mas por que", "Certo, mas", "Ah, mas", "Como assim". A resposta vem na frase seguinte, seca ("Não.", "NÃO.", "É isso mesmo.", "Porque...") e emenda no artigo.

**Citação de lei.** Em OAB: "Art." maiúsculo, parêntese no fim da frase com sigla: "(Art. 7º, XX, EAOAB)", "(Art. 48, § 1º, CEDOAB)", "(Art. 5º, XIII, CF/88)". Por extenso: "O Art. 20, § 1º, do Estatuto da Advocacia, define que", "Conforme o disposto no Art.", "na forma do Art.". Verbos: define, prevê, estabelece, dispõe, menciona. Jurisprudência: "O Supremo Tribunal Federal, na ADI 7020, entendeu que"; sem ementa. Não cita doutrinador em material de OAB.

**Exemplo.** Quase sempre um parêntese "(ex: ...)" de 3 a 15 palavras. Às vezes "a título de exemplo", "Como exemplo podemos citar", "Imagine o seguinte caso:". Sem personagem com nome na explicação.

**Pontuação.**
- Vírgula: muita (75 a 85 por mil palavras).
- Exclamação: praticamente zero (menos de 1 a cada 10.000 palavras). A ênfase vem de CAIXA ALTA e negrito.
- Ponto e vírgula: só em enumeração.
- Aparte: hífen simples com espaços (" - "), nunca travessão longo (—).
- Parênteses: muitos (11 a 15 por mil palavras), para glosa, exemplo e artigo.
- Aspas para termo figurado ("ressuscita", "engessada").

**Formatação.** Negrito no núcleo da regra ou no termo definido, 1 ou 2 por parágrafo, trecho de 2 a 5 palavras. CAIXA ALTA em uma palavra de virada: NÃO, SIM, SALVO, TOTAL, PARCIAL, INDEPENDE, INCONSTITUCIONAL. Tabela para comparar dois institutos ou listar requisitos. Títulos numerados (1., 1.1, 1.1.1), capítulo em caixa alta. Sem emoji.

**Não faça caricatura.** As muletas são tempero: de 4 a 16 conectivos de assinatura por mil palavras, ou seja, de 1 a 3 num trecho de 200 palavras. A maioria das frases dele é sujeito + verbo + regra, sem muleta.

## A dose de brincadeira (o ponto que a IA mais erra)

Medido nos textos dele:

| Tipo de texto | Frequência | Forma |
|---|---|---|
| Livro/resumo de OAB (explicação) | 1 a cada ~1.200 a 1.800 palavras; várias seções sem nenhuma | parêntese de 3 a 10 palavras no fim de frase técnica, pergunta-gancho em negrito, ou expressão popular entre aspas |
| Questão autoral | nome pop em ~4 de cada 10 questões; piada em frase, quase nunca | só o nome do personagem (Naruto, Hermione, Shrek, Son Ye-jin); o enunciado segue sério e não comenta a referência |
| Comentário de questão | 1 a cada ~6.000 palavras | nota solta de uma linha |
| Dicas rápidas, tabelas, lei, rito | zero | |
| Resumo de concurso | 1 a cada ~4.000 a 8.000 palavras | parêntese de 2 a 6 palavras |
| Prática de 2ª fase | zero (no máximo 1 aparte por capítulo) | |

Regras:
- **Uma oração, não um parágrafo.** A frase seguinte já é artigo de lei.
- **A graça vem da situação humana em volta da regra** (o cliente palpiteiro, o primo estudante de direito, a mãe, o dinheiro, a carteirinha, o guru do marketing), nunca da regra, do aluno ou da banca.
- **Nunca** abre capítulo com piada, não explica a referência, não empilha duas, não repete em parágrafos seguidos.
- Risada digitada ("hehe", "kkk"), emoticon e gíria ("treta", "money"): ele usa umas 5 vezes num livro de 69 mil palavras. **Não gere por conta própria**; só se ele pedir tom mais solto, e no máximo uma por capítulo.
- Na dúvida, não ponha. Texto dele sem brincadeira nenhuma é comum; texto dele com brincadeira a cada parágrafo não existe.

Exemplos da dose certa: "(dado que não seria lógico quem já passou querer ser estagiário)"; "O uso da tão sonhada carteirinha não é apenas um direito como também uma obrigação"; "**E se houver treta na divisão?** A Ordem dos Advogados ou os seus Tribunais de Ética poderão ser solicitados..."; "Porque advogado não é todo mundo, como diria sua mãe."

## Lista do que não é dele (corte se aparecer)

- Travessão longo (—). Emoji. Exclamação para animar.
- "não apenas X, mas também Y"; "não é X, é Y"; "Não basta X; é preciso Y" em série. (O dele é "não apenas... como também", raro.)
- Frases de efeito para fechar parágrafo ("É um esforço cooperativo."), trios de substantivos abstratos ("racionalidade, economia e efetividade"), gerúndio final de finalidade (", garantindo...", ", assegurando...", ", reforçando...").
- "Isso significa que" abrindo frase a todo momento; "É importante destacar", "Vale destacar", "Cabe ressaltar", "crucial", "fundamental para", "papel essencial", "nesse contexto" repetido.
- Dois-pontos de anúncio em série ("A lógica é simples:", "Em resumo:", "Mas atenção:", "E detalhe importante:").
- Parágrafos de uma frase curta, um atrás do outro.
- Vocativo, saudação, despedida, motivação ("você vai gabaritar", "bora", "foco").
- "Lembre-se", "note que", "veremos", "vimos", "pois bem", "calma": não aparecem nos textos dele.
- Piada construída, trocadilho, sarcasmo com a banca, historinha pessoal.

Esses traços aparecem numa parte dos textos mais recentes (resumos de concurso, parte do livro de Prática, capítulos 10 a 14 do livro de Ética, comentários de 2024 e 2025). São a camada em que a voz dele some. Não imite essa camada, salvo se ele disser que quer.

## Perfis por tipo de texto

**1. Capítulo ou resumo de OAB** (livro de Ética, Kit, Nocaute). É o padrão descrito acima. Capítulo termina em lista de regras soltas e "dicas rápidas". Quadros de destaque com rótulo fixo dele ("DICA DO PREFEITO!", "NÃO CONFUNDA, MEU FI!" no livro de Ética): conteúdo sério, 40 a 90 palavras, começa direto pela regra.

**2. Ficha diária** (Constitucional Diário). Formato fixo: título "DIA 09 - Tema" → frase-tese de uma oração, muitas vezes negativa ("O Habeas Corpus não pode ser realizado de forma apócrifa.") → explicação em 3 a 6 parágrafos curtos (80 a 200 palavras) que termina reafirmando a tese → tabela comparativa → questão autoral → gabarito "B. ..." em 1 ou 2 frases. Não fala de prova nem de banca na explicação.

**3. Comentário de questão.** Um parágrafo corrido de 60 a 200 palavras. Abre pelo dispositivo, pelo instituto ou pelo personagem → regra → "Entretanto/Todavia/Ocorre que" → "Como [personagem]..." aplicando ao caso → fecha com "Sendo assim, [personagem] pode sim/não pode...". Erradas, quando comentadas: "(A) ... (B) ..." uma frase cada, sem rótulo "Incorreta", com "Como dito,", "Pelo contrário,", "Embora mencione corretamente que..., a alternativa errou ao...".

**4. Questão autoral.** Cabeçalho "(Autoral - @liberofilho)". Enunciado de 3 a 5 frases no molde FGV: personagem + situação + "Ocorre que..." + reação ("Indignada, ela decide...") + consulta. Comando em linha própria ("Sobre a situação narrada, é correto afirmar que:"). Quatro alternativas longas com justificativa embutida ("..., visto que..."), muitas vezes espelhadas duas a duas. Distrator troca um número, inverte regra e exceção ou dá justificativa falsa plausível.

**5. Dicas rápidas.** Lista numerada, 20 por capítulo. Cada dica: uma frase declarativa de 10 a 22 palavras, começa pelo sujeito ("O advogado", "A censura"), sem conectivo, sem "lembre-se", sem humor. "Regra: ... Exceção: ..." quando couber.

**6. Prática de 2ª fase.** Mais seco: impessoal com "o candidato", "art." minúsculo e "CRFB/88", zero humor, zero pergunta retórica. Estrutura fixa por peça: Introdução → Estrutura da peça com a) Cabimento, b) Competência, c) Legitimidade Ativa e Passiva, d) tópico próprio, e) Tutela de Urgência, f) Principais Teses (tabela), g) Pedidos → esqueleto → caso → gabarito → tabela de pontos. Notas práticas com seta ("→ ...") e "IMPORTANTE:". A banca como sujeito: "a banca costuma pontuar", "a banca geralmente aceita as duas".

**7. Resumo de concurso** (Humanística, Direitos Humanos). Não fala de prova nem de banca. Cita autores ("De acordo com Max Weber,", "Para Durkheim,", "Nas palavras de Miguel Reale:"). Mais dois-pontos e listas; tabela-resumo no fim do tópico. Em matéria legislativa, artigo transcrito e depois tradução ("Em termos práticos, isso significa que"). Use os conectivos dele (de modo que, visto que, dado que, Ademais, Sendo assim, na medida em que, posto que).

**Sem amostra:** legenda de Instagram, roteiro de vídeo, e-mail de venda, texto de slide. Nada disso estava no material analisado. Antes de escrever nesses formatos na voz dele, peça 5 a 10 exemplos reais.

## Deslizes de digitação

Os originais têm erros de revisão (crase faltando, "Art.2º" colado, ordinal "2º fase", barra invertida em "CF\88", parêntese sem fechar, vírgula entre sujeito e verbo, "implica em", "independente se"). **Não reproduza.** Escreva com a ortografia correta; o que é escolha de estilo e fica é o hífen com espaços, o "(ex: ...)", o "Art." maiúsculo em OAB e os números em algarismo ("3 anos", "2/3").

# Passagem, som e montagem

A história está em S/references/historia-em-partes.md. Este arquivo cuida do que faz a história passar de uma cena pra outra sem furo, do que vai travado no pedido, do som e da montagem.

## 1. Planta de cada cenário (uma vez por cenário)

Tire da IMAGEM do cenário, não do texto que você escreveu: de 4 a 8 marcos fixos com o lugar no quadro ("porta no terço direito", "mesa no centro, embaixo") e de onde vem a luz. Toda cena naquele lugar usa essas mesmas palavras.

## 2. Lista de objetos da série (no máximo 5)

- Cada objeto ganha um nome fixo de 3 a 5 palavras ("chave de ferro com barbante") e aparece igual em todo pedido.
- **Objeto que viaja na história** (muda de mão, de lugar, volta noutra parte) ganha **foto própria** e entra no pedido como **sujeito próprio** (`<Subject N>` com a foto dele), com uma linha dizendo em que plano aparece e na mão de quem.
- Ele **não entra na descrição do cenário.** Num teste, o objeto descrito "em cima da cadeira" junto com o cômodo apareceu duas vezes na mesma cena.

## 3. Tabela de passagem (`passagem.json`)

Uma linha por cena, com **COMEÇA** e **TERMINA**: o lugar, onde cada personagem está e pra onde olha, o que cada mão segura (e de quem é), quem saiu e com o quê, o estado (molhado, sentado, dormindo), o som do lugar.

Regras duras:
- O COMEÇA da cena N é igual ao TERMINA da N-1, palavra por palavra. Mudou alguma coisa? Ou aparece na tela, ou vira salto de tempo dito.
- Objeto só troca de mão **dentro de um plano** (quem dá, quem pega). Um objeto que trocou de mão fora da tela quebrou uma parte inteira.
- Trocar de cômodo só com passagem visível: a cena de saída termina na porta, a de entrada abre chegando.
- Chegada de personagem é ação no quadro, com o lado de entrada. Nunca só falada.

Confira por máquina antes de qualquer gasto:
```
python3 S/scripts/conferir_passagem.py novelinha/<serie>/parte-N/passagem.json
```
O formato do arquivo está no começo do script (`python3 S/scripts/conferir_passagem.py` sem nada mostra). Ele aponta começo diferente do fim anterior, objeto sem lugar, troca sem plano e lugar novo sem passagem. Saiu FURO: conserte a tabela (e o roteiro) e rode de novo, até "passagem ok".

## 4. Leitor frio (portão antes de gastar)

Um ajudante que NÃO escreveu a parte (subagente; no site, você mesmo num bloco separado, lendo só isto) recebe:
- só as falas da parte anterior;
- da parte nova, em ordem, o que a IMAGEM mostra em cada plano e as falas.

Ele não recebe a bíblia, a escaleta nem a sua opinião. Devolve:
- cada momento "do nada": onde (cena e plano), o que falta pra entender, gravidade **MATA**, **ATRAPALHA** ou **DETALHE**;
- duas notas de 0 a 10: `entender` ("dá pra entender assistindo uma vez") e `quer_p2` ("comentaria pedindo a próxima parte, com raiva do vilão").

**Passa com as duas notas em 8 ou mais e nenhum MATA nem ATRAPALHA.** Na Parte 1, item da Régua de S/references/metodo-atual.md que falha conta como MATA. Achado sem lugar e sem motivo não vale. Não passou: conserto cirúrgico e nova leitura, até 4 (S/references/metodo-atual.md §Leitor frio). Depois disso, mostre o texto ao aluno e espere o "sim" do texto. Só então sai crédito.

## 5. Pedido de cena: bloco de travas no fim

Todo pedido de cena termina com um bloco de travas: em que mão está cada objeto, o estado que continua, quem fica calado e **o que ainda NÃO acontece** (o que fica pra cena seguinte). Sai da tabela de passagem. Exemplo:
```
Constraints: the iron key with string stays in the caretaker's left hand in every shot.
The stepmother's apron stays wet at the hem until the final frame.
The stepdaughter does not speak in this scene; her lips stay closed.
The caretaker does not show the key to anyone yet; the safe is not opened yet.
```
A 1ª frase do plano 1 repete o TERMINA da cena anterior; a última frase do último plano é o TERMINA desta.

**Quem está na cena mas não entra nas fotos de referência** (fala de outro cômodo, espera na porta, é só citado) ganha uma linha nas travas dizendo onde está, fora do quadro, e que ninguém mais aparece:
```
The grandmother is in the kitchen, off screen, and never enters the frame. No other person appears in any shot.
```
Sem essa linha, o modelo põe a pessoa na cena com um rosto inventado, ou alguém a mais.

**Barre metáfora e comparação no pedido.** "Like a", "as if", "como um", "parece": o modelo desenha a comparação ("como uma flor" vira uma flor). Escreva o que se vê. Tire também do pedido o objeto que NÃO deve aparecer: citado, ele aparece. É a mesma família do "no smile", que puxa sorriso.

## 6. Som por plano

- Cada plano tem a sua coluna de som: o ambiente do lugar (chuva no telhado, vento, geladeira) e de 1 a 3 ruídos da ação, com o segundo (chave na fechadura, passo no cascalho, porta). Mudou a ação, muda o som.
- **Avatar Pro:** o modelo faz o som. Ambiente e ruídos vão escritos no pedido, plano a plano. Sem música.
- **Persona Pro:** opção a testar mais (aprovada em 1 cena): o áudio enviado leva só as vozes, e o som da cena vai descrito no pedido, plano a plano e no bloco do som geral. Mandar chuva e efeito já misturados no áudio foi reprovado duas vezes (chiado constante, efeito fraco). Em cada cena, confira se a voz voltou com o mesmo tom (S/scripts/conferir_fala.py).
- **Música:** uma faixa só pro episódio, posta na montagem, abaixando sob a fala. Nunca por cena: recomeça a cada corte.

## 7. Montagem

`S/scripts/montar.py` junta os clipes com corte seco e um fade curtinho, deixa tudo em -15 LUFS, põe um ruído bem baixo por baixo de tudo (sem buraco de silêncio digital entre as falas), escreve o fim por cima da última cena e confere os portões (S/references/metodo-atual.md §Portões). Por cima disso (no CapCut, se o aluno quiser):
- **Fundo contínuo:** um ambiente por cenário, bem baixo (bem abaixo da fala), correndo por baixo de todos os clipes daquele lugar e atravessando as emendas. Cobre a diferença de fundo entre um clipe e outro, e o som nunca some no corte.
- **Volume igualado fala por fala** (no ffmpeg da conversa): o ganho vale só dentro daquela fala. Confira o fim da peça: ganho que vaza pro trecho sem fala sobe o chiado do fim. O S/scripts/montar.py iguala por clipe, sem vazar.
- **Emenda com som cruzado:** o som do fim da cena N continua meio segundo por baixo do começo da N+1 (a fala que passa do corte vai por cima do plano seguinte, como na fase 6).
- **Um som subindo antes da virada principal**, só um. Depois da última fala do vilão: corte seco, sem música.
- **Corte o defeito antes de refazer.** Plano com rosto errado ou objeto duplicado: tire o trecho, troque por outro plano da mesma cena ou leve a fala por cima de outra imagem. Refazer o clipe é o último recurso.
- **Lista do que falta:** os efeitos que não entraram, com plano e som, entregues ao aluno em vez de calar.

**Recap da Parte 2 em diante:** os primeiros 2 a 3 s mostram o que importa da parte anterior (o momento do perigo, o objeto, o rosto do vilão), pra quem chega no meio. Dá pra fazer com trechos da parte anterior por baixo da 1ª fala, sem gerar nada.

## 8. Conferência da parte montada

Antes de mostrar ao aluno:
- **Cada emenda lado a lado:** último quadro da cena N contra o primeiro da N+1 (posição, objeto e dono, luz, molhado).
- **Passada sem som:** só a imagem. Dá pra entender quem quer o quê?
- **Passada de olhos fechados:** só o som. Soa como um filme só? O fundo pulou? A música recomeçou?
- **Cada batida aprovada da escaleta ainda está lá?** Corte de montagem já apagou batida sem ninguém ver.
- Leitor frio de novo, agora na parte montada, com nota.

Diga ao aluno o que foi conferido e o que não foi.

## 9. Registro do custo

`custos.md` na pasta da série, uma linha por geração: data, parte, cena, o que (quadro, voz, vídeo), modelo, créditos cotados no `get_cost`, créditos gastos de verdade (`list_tasks`, campo de créditos da tarefa), e se foi aprovada ou refeita. Ao fechar a parte, some e diga: "A Parte N gastou X créditos, conferido na sua conta". Refação conta junto: é ela que mostra onde o método falhou.

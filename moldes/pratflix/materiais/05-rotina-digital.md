---
numero: 05
titulo: Escritório digital
destaque: arquivos, comunicações e conferências
tipo: Guia de implantação
arquivo: 05_Rotina_Digital_Escritorio.pdf
rodape: Escritório digital · arquivos, comunicações e conferências
resumo: Uma organização básica de pastas e nomes, um fluxo para receber arquivos, um registro confiável de conferência de comunicações, acessos, backup testado e o que fazer quando algo dá errado, com modelos e implantação em sete dias.
uso:
  Comece pelo caso da parte 01: ele mostra por que a organização importa.
  Implante uma parte por dia, seguindo o plano de sete dias da parte 09.
  Nenhum programa específico é necessário: tudo funciona com as pastas e a planilha que você já usa.
---

# O contrato com dois "final"

Você precisa mandar ao cliente a versão do contrato que ele aprovou. Na pasta do caso há dois arquivos:

- `Contrato_final.docx`, alterado em 12/08/2026
- `Contrato_final_revisado.docx`, alterado em 14/08/2026

O impulso é mandar o mais recente. Mas a data de alteração diz quando o arquivo foi salvo pela última vez, não qual versão foi aprovada. O arquivo de 14/08 pode ter sido aberto e salvo sem querer, ou pode conter uma sugestão que o cliente recusou.

## Como investigar

1. **Origem.** Quem criou cada arquivo e de onde ele veio? Procure o e-mail ou a mensagem em que cada versão foi enviada ou recebida.
2. **Autoria das mudanças.** Compare os dois arquivos (a maioria dos editores de texto tem a função "comparar documentos"). Veja o que mudou e quem mudou, se o controle de alterações estava ativo.
3. **Aprovação.** Procure a mensagem em que o cliente aprovou. A versão aprovada é a que estava anexada ou citada nessa mensagem.
4. **Registro.** Renomeie com o status correto (parte 03) e anote no registro de versões o que você conferiu.

::: atencao Data mais recente não é versão correta
A aprovação está numa comunicação, não no nome nem na data do arquivo. Se não encontrar a aprovação, pergunte ao cliente e registre a resposta antes de enviar.
:::

# Estrutura de pastas por caso

Uma pasta por caso, identificada por um código interno, com as mesmas subpastas em todos os casos.

| Subpasta | O que guarda | Exemplo |
|---|---|---|
| 01_Entrada | Ficha do primeiro atendimento, resumo de reuniões, proposta | Ficha de 03/09/2026 |
| 02_Documentos | Documentos recebidos do cliente e de terceiros | Contrato, comprovantes, prints exportados |
| 03_Analise | Pesquisas, anotações, minutas de análise | Análise da cláusula de entrega |
| 04_Pecas | Peças e minutas, com versões | Petição inicial, notificação |
| 05_Comprovantes | Protocolos, recibos, comprovantes de envio | Recibo de protocolo com a peça enviada |
| 06_Encerramento | Prestação de contas, termo de encerramento, devolução de documentos | Termo de 20/12/2026 |

**Nome da pasta do caso:** `2026-031_Fotografias` em vez de `Marina Souto x Caio Ramos`. O código identifica; o assunto ajuda a achar. Nomes de pessoas e dados sensíveis no nome da pasta ficam expostos em listagens, backups e telas compartilhadas.

## Quando adaptar

- **Muitos documentos de um tipo** (por exemplo, centenas de notas fiscais): crie subpastas dentro de 02_Documentos.
- **Processo e procedimento administrativo no mesmo caso:** uma subpasta para cada dentro de 04_Pecas e 05_Comprovantes.
- **Consultoria sem processo:** 04_Pecas pode virar 04_Pareceres.

Mude a estrutura de propósito e para todos os casos parecidos, não de um caso para outro.

# Convenção de nomes

**Padrão:** `AAAA-MM-DD_assunto_vNN_status`

A data vem primeiro, no formato ano-mês-dia, para que a lista se ordene sozinha. O status diz em que pé está o documento.

| Status | Quer dizer |
|---|---|
| minuta | Em elaboração, ninguém revisou |
| revisado | Revisado internamente, ainda não aprovado pelo cliente |
| aprovado | Aprovado pelo cliente (aprovação registrada) |
| protocolado | Enviado ao órgão; o recibo está junto |
| recebido | Documento de terceiro, como chegou |

## Dez exemplos

1. `2026-08-10_contrato-locacao_v01_minuta.docx`
2. `2026-08-12_contrato-locacao_v02_revisado.docx`
3. `2026-08-14_contrato-locacao_v02_aprovado.pdf`
4. `2026-09-03_ficha-primeiro-atendimento.pdf`
5. `2026-09-05_conversa-whatsapp-exportada_recebido.zip`
6. `2026-09-05_comprovante-pix_recebido.pdf`
7. `2026-09-15_notificacao-extrajudicial_v01_minuta.docx`
8. `2026-09-16_notificacao-extrajudicial_v02_aprovado.pdf`
9. `2026-10-20_peticao-inicial_v03_protocolado.pdf`
10. `2026-10-20_peticao-inicial_recibo-protocolo.pdf`

::: quadro Protocolo: conteúdo e recibo juntos
O recibo de protocolo prova que algo foi enviado. O arquivo enviado prova o que foi enviado. Guarde os dois na mesma pasta, com o mesmo nome base (exemplos 9 e 10). Se o sistema permitir, baixe também a versão que ficou no processo depois do protocolo.
:::

# Fluxo de entrada de arquivos

Todo arquivo que chega passa pelos mesmos seis passos.

| Passo | O que fazer | Pergunta de controle |
|---|---|---|
| 1. Receber | Salvar o arquivo, sem abrir edições | De quem veio, por qual canal, em que data? |
| 2. Conferir origem e legibilidade | Abrir e ler; conferir páginas e assinaturas | Está completo e legível? É o documento que eu pedi? |
| 3. Nomear | Aplicar a convenção | O nome diz data, assunto e status? |
| 4. Arquivar | Colocar na subpasta certa | Outra pessoa encontraria? |
| 5. Registrar uso | Anotar no registro de versões quando o arquivo for usado numa peça ou análise | Dá para saber depois qual versão foi usada? |
| 6. Restringir acesso | Conferir quem tem acesso à pasta | Só quem precisa tem acesso? |

## Checklist de problemas comuns na entrada

- [ ] **PDF incompleto:** contei as páginas? Bate com a numeração do documento?
- [ ] **Digitalização cortada:** margens, carimbos e assinaturas aparecem inteiros?
- [ ] **Arquivo corrompido:** abre em outro programa? Se não abrir, pedir novo envio no mesmo dia.
- [ ] **Documento sem identificação:** sei de quem é e a que se refere? Se não, perguntar antes de arquivar.
- [ ] **Foto de documento:** está legível? Pedir digitalização se for usar em peça.
- [ ] **Print de conversa:** tenho a exportação da conversa? Mostra data, hora e remetente?

# Comunicações oficiais: conferir e registrar

## Canais diferentes, funções diferentes

O Conselho Nacional de Justiça instituiu o Diário de Justiça Eletrônico Nacional (DJEN) e o Domicílio Judicial Eletrônico pela Resolução CNJ 455/2022, alterada pela Resolução CNJ 569/2024. Em linhas gerais:

| Canal | Função | Atenção |
|---|---|---|
| DJEN | Publicação das comunicações processuais em geral, como as intimações dirigidas aos advogados | Confira no ato do CNJ e do tribunal como e quando a publicação produz efeito |
| Domicílio Judicial Eletrônico | Comunicações pessoais às partes, como citações e intimações pessoais, conforme as regras de cada destinatário | As regras de cadastro, ciência e prazo para ciência estão na resolução vigente |
| Sistema processual do tribunal (PJe, eproc, e-SAJ e outros) | Onde o processo tramita; mostra atos, decisões e prazos lançados | O painel de prazos do sistema ajuda, mas confira o ato que deu origem ao prazo |
| Alertas auxiliares (e-mail, aplicativo, robô de acompanhamento) | Avisam que algo aconteceu | Não são comunicação oficial. O alerta manda conferir; não substitui a conferência |

::: atencao Verifique as regras vigentes
As regras sobre DJEN, Domicílio e contagem de prazos mudaram nos últimos anos e variam entre tribunais e tipos de ato. Este material não traz tabela de contagem de prazos. Antes de concluir qualquer prazo, confira o texto vigente das resoluções do CNJ, as normas do tribunal e o próprio processo.
:::

## Registro de conferência

Toda conferência de comunicação vira uma linha. O registro mostra o que foi visto, onde, por quem e quando.

{.grade}
| Data da conferência | Canal | Processo | Ato comunicado | Evidência guardada | Prazo conferido e fonte | Responsável | Revisão por |
|---|---|---|---|---|---|---|---|
| | | | | | | | |
| | | | | | | | |
| | | | | | | | |

**Exemplo preenchido:** "21/10/2026 · DJEN · 0001234-56.2026.8.00.0001 (fictício) · intimação para manifestação sobre laudo · PDF da publicação salvo em 05_Comprovantes · prazo conferido no ato e no sistema do tribunal · advogado A · revisado por advogado B em 22/10."

# Acessos: quem entra, como entra, quem sai

- **Acesso individual.** Cada pessoa tem o próprio login em cada sistema. Login compartilhado impede saber quem fez o quê.
- **Autenticação adicional.** Ative a verificação em duas etapas onde o serviço oferecer (e-mail, armazenamento em nuvem, sistemas de tribunais que tenham a opção).
- **Compartilhamento mínimo.** Compartilhe a pasta do caso, não a pasta de todos os casos. Revise links públicos: link "qualquer pessoa com o link" deve ser exceção e ter prazo.
- **Senha e certificado digital não se compartilham.** O certificado identifica você; quem o usa age em seu nome. Se outra pessoa precisa protocolar, ela usa o próprio certificado.

## Entrada e saída de colaborador

**Entrada**
- [ ] Contas individuais criadas (e-mail, nuvem, sistemas)
- [ ] Acesso só às pastas necessárias
- [ ] Verificação em duas etapas ativada
- [ ] Orientação sobre sigilo, nomes de arquivos e fluxo de entrada
- [ ] Registro da data de início e dos acessos concedidos

**Saída**
- [ ] Acessos revogados no último dia (lista dos acessos concedidos em mãos)
- [ ] Senhas de contas compartilhadas, se existirem, trocadas
- [ ] Arquivos de trabalho transferidos para as pastas do escritório
- [ ] Equipamentos devolvidos
- [ ] Registro da data de saída e dos acessos revogados

# Backup que funciona é backup testado

## Sincronização não é cópia recuperável

Uma pasta sincronizada com a nuvem replica tudo, inclusive o erro. Se você apaga um arquivo ou ele é corrompido, a sincronização apaga ou corrompe a cópia também. Uma cópia recuperável é separada da pasta de trabalho e guarda versões anteriores por algum tempo.

## O que decidir

| Decisão | Pergunta | Exemplo de escolha |
|---|---|---|
| O que copiar | O que não pode ser perdido? | Pastas dos casos, modelos, planilhas de controle |
| Frequência | Quanto trabalho você aceitaria refazer? | Cópia diária automática e uma cópia semanal em outro lugar |
| Onde | A cópia sobrevive se o computador for perdido? | Um serviço de nuvem com histórico de versões e um disco externo |
| Acesso | Quem pode restaurar? | O titular do escritório, com verificação em duas etapas |

## Teste de recuperação com arquivo fictício

1. Crie `teste-restauracao.txt` numa pasta de caso fictícia, com a data de hoje escrita dentro.
2. Espere o próximo backup acontecer.
3. Apague o arquivo da pasta de trabalho.
4. Restaure-o a partir do backup.
5. Abra e confira se o conteúdo está correto.
6. Registre o resultado.

{.grade}
| Data do teste | Arquivo | Origem do backup | Tempo para restaurar | Conteúdo correto? | Problemas | Responsável |
|---|---|---|---|---|---|---|
| | | | | | | |
| | | | | | | |

Repita o teste a cada três meses e sempre que mudar de serviço ou de computador. Nenhuma rotina torna o escritório invulnerável; o teste mostra se a sua funciona hoje.

# Quando algo dá errado

Situações comuns: um e-mail com documentos foi para o destinatário errado; um link de pasta ficou público; você perdeu o acesso ao celular com o aplicativo de autenticação; um computador com arquivos foi furtado.

## Primeira resposta

1. **Interromper a exposição, quando possível.** Pedir ao destinatário errado que apague a mensagem e confirme; desativar o link público; bloquear o celular e trocar senhas a partir de outro aparelho.
2. **Preservar as informações.** Anotar o que aconteceu, quando, quais dados estavam envolvidos e o que já foi feito. Guardar prints e e-mails relacionados.
3. **Avaliar com quem entende.** Incidentes com dados pessoais podem gerar obrigações de comunicação ao titular e à Autoridade Nacional de Proteção de Dados (ANPD). Os critérios e prazos estão na regulamentação da ANPD: consulte a versão vigente e, se necessário, busque orientação especializada.
4. **Informar o cliente com clareza**, quando os dados dele estiverem envolvidos, depois de entender o que aconteceu.

::: exemplo Registro de incidente
Data e hora em que foi percebido · o que aconteceu · dados envolvidos · pessoas afetadas · o que foi feito e quando · quem foi comunicado · avaliação pendente
:::

# Modelos e implantação

## Mapa de pastas (em branco)

{.ficha}
| Subpasta | O que vai guardar no seu escritório |
|---|---|
| 01_Entrada | |
| 02_Documentos | |
| 03_Analise | |
| 04_Pecas | |
| 05_Comprovantes | |
| 06_Encerramento | |

## Registro de versões

{.grade}
| Arquivo | Versão | O que mudou | Quem mudou | Aprovado por (e onde) | Usado em |
|---|---|---|---|---|---|
| | | | | | |
| | | | | | |
| | | | | | |

**Exemplo:** "contrato-locacao · v02 · cláusula 7 com multa proporcional · advogado · cliente, por e-mail de 14/08/2026 · versão enviada para assinatura em 15/08."

## Implantação em sete dias

| Dia | Tarefa | Pronto quando |
|---|---|---|
| 1 | Criar a estrutura de pastas e mover um caso ativo para ela | Um caso inteiro organizado |
| 2 | Renomear os arquivos desse caso pela convenção | Lista ordenada por data, com status |
| 3 | Aplicar o fluxo de entrada a tudo que chegar no dia | Nenhum arquivo novo sem nome padrão |
| 4 | Criar o registro de conferência e lançar as conferências da semana | Planilha com as linhas da semana |
| 5 | Revisar acessos: contas, verificação em duas etapas, links públicos | Lista de acessos revisada |
| 6 | Configurar o backup e fazer o teste de recuperação | Teste registrado com resultado |
| 7 | Migrar os demais casos ativos (ou programar a migração) | Todos os casos com data de migração |

## Teste prático

Você recebeu hoje, por WhatsApp, três arquivos do cliente Rui: `IMG_2041.jpg`, `doc.pdf` e `notas.pdf`. O `doc.pdf` tem 3 páginas, mas a numeração no rodapé diz "1/4". O caso é 2026-047.

**O que você faz?**

[[caixa 6]]

::: resposta Resposta comentada
1. **Conferir:** abrir os três. `IMG_2041.jpg` é a foto de um orçamento assinado, legível. `notas.pdf` traz as notas fiscais. `doc.pdf` está incompleto: falta a página 2 de 4.
2. **Pedir no mesmo dia:** "Rui, recebi os arquivos. No documento do orçamento (doc.pdf) está faltando a página 2. Consegue me mandar de novo?"
3. **Nomear:** `2026-10-19_orcamento-assinado_recebido.jpg`, `2026-10-19_notas-fiscais_recebido.pdf`, `2026-10-19_doc-incompleto-falta-pag2_recebido.pdf`.
4. **Arquivar** em `2026-047_Cobranca-oficina/02_Documentos`.
5. **Registrar** no painel do caso: "Aguardando página 2 do doc.pdf, pedida em 19/10."

O ponto central é não arquivar o documento incompleto como se estivesse completo. O nome e o registro avisam quem abrir depois.
:::

::: pratica Continue na PratFlix
A rotina digital se completa com a revisão semanal (material 03). Aulas e materiais: [liberofilho.com/pratflix/aulas.html](https://liberofilho.com/pratflix/aulas.html).
:::

## Fontes consultadas

<ul class="fontes">
<li>Resolução CNJ 455/2022 (Portal de Serviços do Poder Judiciário, DJEN e Domicílio Judicial Eletrônico), com as alterações da Resolução CNJ 569/2024. Consultado em 08/11/2026: <a href="https://atos.cnj.jus.br/atos/detalhar/4509">atos.cnj.jus.br/atos/detalhar/4509</a></li>
<li>Autoridade Nacional de Proteção de Dados: materiais educativos e publicações, incluindo o guia de segurança para agentes de tratamento de pequeno porte. Consultado em 08/11/2026: <a href="https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes">gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes</a></li>
<li>Lei 13.709/2018 (Lei Geral de Proteção de Dados Pessoais).</li>
</ul>

<p class="pequeno">Casos, nomes, números de processo e datas são fictícios. Seguir este material não garante conformidade integral com a LGPD.</p>

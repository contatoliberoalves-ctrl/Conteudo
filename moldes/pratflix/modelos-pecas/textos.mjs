// Texto-base de cada modelo de peça (PDF "Modelos de peça · PratFlix").
// Convenções: linha começando com "# " = título centralizado; "## " = tópico; "> " = orientação (sai em caixa, não é texto da peça);
// [campo] = trecho a preencher; linha vazia separa parágrafos.
export const TEXTOS = {
inicial: `EXCELENTÍSSIMO(A) SENHOR(A) JUIZ(A) DE DIREITO DA [__] VARA CÍVEL DA COMARCA DE [CIDADE/UF]

[NOME DO AUTOR], [nacionalidade], [estado civil], [profissão], inscrito(a) no CPF sob o nº [___], endereço eletrônico [e-mail], residente e domiciliado(a) em [endereço completo com CEP], por seu advogado que esta subscreve (procuração anexa), com escritório em [endereço], onde recebe intimações, vem, respeitosamente, propor

# AÇÃO DE [NOME DA AÇÃO]

pelo procedimento comum, em face de [NOME DO RÉU], [qualificação completa: nacionalidade, estado civil, profissão, CPF/CNPJ, e-mail e endereço], pelos fatos e fundamentos a seguir expostos.

## I – DOS FATOS

[Narre os fatos em ordem cronológica, em parágrafos curtos, indicando o documento que comprova cada um: "Em [data], as partes celebraram contrato de [___] (doc. 2)".]

> Separe o que foi narrado pelo cliente do que está comprovado em documento. Fato sem prova pede pedido de produção de prova.

## II – DO DIREITO

[Apresente os fundamentos jurídicos que ligam os fatos aos pedidos: dispositivos legais, súmulas e precedentes aplicáveis.]

## III – DA TUTELA DE URGÊNCIA

> Use este tópico apenas se houver urgência. Demonstre a probabilidade do direito e o perigo de dano ou o risco ao resultado útil do processo (art. 300 do CPC).

[Fundamentação da urgência.]

## IV – DOS PEDIDOS

Diante do exposto, requer:

a) a concessão da tutela de urgência para [___];

b) a citação do réu para comparecer à audiência de conciliação ou de mediação, nos termos do art. 334 do CPC [ou: o autor manifesta desinteresse na audiência de conciliação, nos termos do art. 319, VII, do CPC];

c) a procedência do pedido para [descreva o pedido de forma certa e determinada];

d) a condenação do réu ao pagamento das custas processuais e dos honorários advocatícios (art. 85 do CPC).

## V – DAS PROVAS

Protesta pela produção de todas as provas em direito admitidas, especialmente [documental, testemunhal e pericial].

## VI – DO VALOR DA CAUSA

Dá-se à causa o valor de R$ [___] ([valor por extenso]), nos termos do art. 292 do CPC.

Termos em que pede deferimento.

[Cidade], [data].

[NOME DO ADVOGADO]
OAB/[UF] nº [___]`,

contestacao: `EXCELENTÍSSIMO(A) SENHOR(A) JUIZ(A) DE DIREITO DA [__] VARA CÍVEL DA COMARCA DE [CIDADE/UF]

Processo nº [___]

[NOME DO RÉU], já qualificado(a) nos autos da ação de [nome da ação] que lhe move [NOME DO AUTOR], por seu advogado que esta subscreve (procuração anexa), vem, respeitosamente, no prazo legal, apresentar

# CONTESTAÇÃO

pelos fatos e fundamentos a seguir expostos.

## I – SÍNTESE DA INICIAL

[Resuma, em poucos parágrafos, o que o autor alega e o que pede.]

## II – DA TEMPESTIVIDADE

A presente contestação é tempestiva, pois apresentada dentro do prazo de 15 (quinze) dias úteis previsto no art. 335 do CPC, contado de [termo inicial: data da audiência de conciliação / do protocolo do pedido de cancelamento / da juntada do aviso de recebimento].

## III – DAS PRELIMINARES

> Verifique as matérias do art. 337 do CPC (incompetência, inépcia da inicial, ilegitimidade, falta de interesse, litispendência, coisa julgada, entre outras). Use apenas as cabíveis.

[Preliminar 1.]

## IV – DO MÉRITO

[Impugne de forma especificada cada fato narrado na inicial (art. 341 do CPC) e apresente os fatos impeditivos, modificativos ou extintivos do direito do autor.]

> Toda a defesa deve ser apresentada agora (art. 336 do CPC). Se houver reconvenção, ela vem na própria contestação (art. 343 do CPC).

## V – DAS PROVAS

Protesta pela produção de todas as provas em direito admitidas, especialmente [___].

## VI – DOS PEDIDOS

Diante do exposto, requer:

a) o acolhimento da(s) preliminar(es) arguida(s), com a extinção do processo sem resolução do mérito (art. 485 do CPC);

b) subsidiariamente, a total improcedência dos pedidos;

c) a condenação do autor ao pagamento das custas processuais e dos honorários advocatícios (art. 85 do CPC).

Termos em que pede deferimento.

[Cidade], [data].

[NOME DO ADVOGADO]
OAB/[UF] nº [___]`,

alimentos: `EXCELENTÍSSIMO(A) SENHOR(A) JUIZ(A) DE DIREITO DA [__] VARA DE FAMÍLIA DA COMARCA DE [CIDADE/UF]

> Foro do domicílio ou da residência de quem pede os alimentos (art. 53, II, do CPC).

[NOME DO ALIMENTANDO], [menor impúbere / relativamente incapaz], nascido(a) em [data], representado(a) [ou assistido(a)] por sua genitora [NOME], [nacionalidade], [estado civil], [profissão], CPF nº [___], residentes em [endereço], por seu advogado (procuração anexa), vem propor

# AÇÃO DE ALIMENTOS

pelo rito da Lei nº 5.478/1968, em face de [NOME DO ALIMENTANTE], [qualificação], residente em [endereço], [empregado(a) de / local de trabalho, se conhecido], pelos fatos e fundamentos a seguir.

## I – DO VÍNCULO

O(A) autor(a) é filho(a) do réu, conforme certidão de nascimento anexa (doc. [__]).

## II – DAS NECESSIDADES DO ALIMENTANDO

[Descreva as despesas mensais: alimentação, moradia, escola, saúde, transporte, lazer. Anexe planilha e comprovantes.]

## III – DAS POSSIBILIDADES DO ALIMENTANTE

[Indique a renda do réu ou os sinais exteriores de riqueza: emprego, atividade, bens, padrão de vida.]

## IV – DO DIREITO

Os alimentos devem ser fixados na proporção das necessidades de quem os reclama e dos recursos da pessoa obrigada (art. 1.694, § 1º, do Código Civil).

## V – DOS ALIMENTOS PROVISÓRIOS

Comprovado o vínculo, requer a fixação de alimentos provisórios desde o despacho inicial (art. 4º da Lei nº 5.478/1968).

## VI – DOS PEDIDOS

Diante do exposto, requer:

a) a fixação de alimentos provisórios em [__% dos rendimentos líquidos do réu / R$ ___];

b) a citação do réu para a audiência de conciliação e julgamento;

c) a intimação do Ministério Público (art. 178, II, do CPC);

d) a procedência do pedido, fixando os alimentos definitivos em [___];

e) que o pagamento seja feito mediante [desconto em folha, oficiando-se o empregador / depósito na conta (dados bancários)];

f) a concessão da gratuidade da justiça (art. 98 do CPC);

g) a condenação do réu nas custas e honorários advocatícios.

Dá-se à causa o valor de R$ [___], correspondente a doze prestações mensais pedidas (art. 292, III, do CPC).

Termos em que pede deferimento.

[Cidade], [data].

[NOME DO ADVOGADO]
OAB/[UF] nº [___]`,

saude: `EXCELENTÍSSIMO(A) SENHOR(A) JUIZ(A) DE DIREITO DA [__] VARA CÍVEL DA COMARCA DE [CIDADE/UF]

[NOME DO BENEFICIÁRIO], [qualificação], beneficiário(a) do plano de saúde nº [___], por seu advogado (procuração anexa), vem propor

# AÇÃO DE OBRIGAÇÃO DE FAZER COM PEDIDO DE TUTELA DE URGÊNCIA

em face de [NOME DA OPERADORA], pessoa jurídica de direito privado, CNPJ nº [___], com sede em [endereço], pelos fatos e fundamentos a seguir.

## I – DOS FATOS

[Contrato e data de adesão; diagnóstico (CID) e indicação médica do tratamento, exame ou cirurgia; pedido de autorização em (data), protocolo nº (___); negativa em (data) e o motivo informado pela operadora.]

## II – DO DIREITO

A relação entre as partes é de consumo, aplicando-se o Código de Defesa do Consumidor (Súmula 608 do STJ), salvo nos planos de autogestão.

[Fundamente com a Lei nº 9.656/1998, a cobertura obrigatória da doença, a indicação do médico assistente e, se for o caso, os critérios do art. 10, §§ 12 e 13, da Lei nº 9.656/1998 para procedimentos fora do rol da ANS. Aponte a abusividade da negativa (art. 51, IV, do CDC).]

## III – DA TUTELA DE URGÊNCIA

A probabilidade do direito está demonstrada pelo contrato, pelo relatório médico e pela negativa. O perigo de dano decorre de [risco à saúde descrito no relatório médico]. Presentes os requisitos do art. 300 do CPC.

## IV – DOS PEDIDOS

Diante do exposto, requer:

a) a concessão da tutela de urgência para determinar que a ré autorize e custeie [tratamento/procedimento] no prazo de [__] horas, sob pena de multa diária de R$ [___] (art. 537 do CPC);

b) a inversão do ônus da prova (art. 6º, VIII, do CDC);

c) a citação da ré;

d) a procedência do pedido, confirmando a tutela de urgência;

e) [a condenação da ré ao pagamento de indenização por danos morais de R$ ___];

f) a condenação da ré nas custas e honorários advocatícios.

Dá-se à causa o valor de R$ [___].

Termos em que pede deferimento.

[Cidade], [data].

[NOME DO ADVOGADO]
OAB/[UF] nº [___]`,

trabalhista: `EXCELENTÍSSIMO(A) SENHOR(A) JUIZ(A) DA [__] VARA DO TRABALHO DE [CIDADE/UF]

[NOME DO RECLAMANTE], [nacionalidade], [estado civil], [profissão], CPF nº [___], CTPS nº [___], PIS nº [___], residente em [endereço], por seu advogado (procuração anexa), vem ajuizar

# RECLAMAÇÃO TRABALHISTA

pelo rito [ordinário / sumaríssimo], em face de [NOME DA RECLAMADA], CNPJ nº [___], com sede em [endereço], pelos fatos e fundamentos a seguir.

## I – DO CONTRATO DE TRABALHO

O(A) reclamante foi admitido(a) em [data], na função de [___], com último salário de R$ [___], jornada de [___], e o contrato terminou em [data], por [dispensa sem justa causa / pedido de demissão / outra modalidade].

## II – [TÍTULO DO PEDIDO 1: ex. DAS HORAS EXTRAS]

[Fatos e fundamentos deste pedido.]

## III – [TÍTULO DO PEDIDO 2]

[Fatos e fundamentos deste pedido.]

## IV – DA JUSTIÇA GRATUITA

[Fundamente nos §§ 3º e 4º do art. 790 da CLT e junte declaração ou comprovante de renda.]

## V – DOS PEDIDOS

Diante do exposto, requer a condenação da reclamada ao pagamento de:

a) [pedido 1] – R$ [___];

b) [pedido 2] – R$ [___];

c) honorários advocatícios de sucumbência (art. 791-A da CLT) – [__]%.

Requer, ainda: a notificação da reclamada para comparecer à audiência e apresentar defesa; a concessão da justiça gratuita; e a produção de todas as provas em direito admitidas.

> Os pedidos devem ser certos, determinados e com indicação de valor (art. 840, § 1º, da CLT).

Dá-se à causa o valor de R$ [soma dos pedidos].

Termos em que pede deferimento.

[Cidade], [data].

[NOME DO ADVOGADO]
OAB/[UF] nº [___]`,

inss: `AO INSTITUTO NACIONAL DO SEGURO SOCIAL – INSS
AGÊNCIA DA PREVIDÊNCIA SOCIAL DE [CIDADE/UF]

> O pedido é protocolado pelo Meu INSS ou pela central 135. Use este texto como requerimento anexo, com os documentos.

REQUERENTE: [NOME], CPF nº [___], NIT nº [___], nascido(a) em [data], residente em [endereço], telefone [___], e-mail [___].

PROCURADOR: [NOME DO ADVOGADO], OAB/[UF] nº [___] (procuração e termo de representação anexos).

# REQUERIMENTO DE [ESPÉCIE DO BENEFÍCIO]

## I – DO PEDIDO

O(A) requerente vem requerer a concessão de [aposentadoria por ___ / benefício ___], com data de entrada do requerimento (DER) na data deste protocolo.

## II – DOS FATOS

[Descreva os períodos de trabalho e contribuição. Destaque os períodos que não constam ou constam com erro no CNIS: atividade rural, especial, sem registro, recolhimentos em atraso.]

## III – DOS FUNDAMENTOS

[Requisitos do benefício na Lei nº 8.213/1991, art. ___, e no Decreto nº 3.048/1999.]

## IV – DOS DOCUMENTOS

a) documento de identificação e CPF;
b) extrato do CNIS;
c) CTPS (todas as páginas com registros);
d) [PPP e LTCAT / autodeclaração e provas de atividade rural / laudos médicos];
e) procuração e termo de representação.

## V – DOS REQUERIMENTOS

a) o reconhecimento dos períodos de [___];
b) a análise de todos os documentos anexos;
c) [a realização de justificação administrativa, se necessária];
d) que as exigências sejam comunicadas também ao procurador;
e) a concessão do benefício com efeitos desde a DER.

[Cidade], [data].

[NOME DO ADVOGADO]
OAB/[UF] nº [___]`,

ms: `EXCELENTÍSSIMO(A) SENHOR(A) JUIZ(A) [FEDERAL / DE DIREITO] DA [__] VARA [CÍVEL / DA FAZENDA PÚBLICA] DE [CIDADE/UF]

> A competência é definida pela autoridade coatora e pela pessoa jurídica a que ela pertence.

[NOME DO IMPETRANTE], [qualificação completa], por seu advogado (procuração anexa), vem impetrar

# MANDADO DE SEGURANÇA COM PEDIDO LIMINAR

com fundamento no art. 5º, LXIX, da Constituição Federal e na Lei nº 12.016/2009, contra ato do(a) [CARGO DA AUTORIDADE COATORA], com endereço em [___], vinculado(a) à [PESSOA JURÍDICA], pelos fatos e fundamentos a seguir.

## I – DOS FATOS

[Descreva o ato coator, quem o praticou e a data em que o impetrante teve ciência dele.]

## II – DO CABIMENTO E DA TEMPESTIVIDADE

O ato foi conhecido em [data], estando a impetração dentro do prazo de 120 dias (art. 23 da Lei nº 12.016/2009).

## III – DO DIREITO LÍQUIDO E CERTO

[Demonstre o direito com a prova documental anexa. O mandado de segurança não admite produção de provas.]

## IV – DA LIMINAR

Há fundamento relevante e o ato impugnado pode resultar na ineficácia da medida, se concedida apenas ao final (art. 7º, III, da Lei nº 12.016/2009), porque [___].

## V – DOS PEDIDOS

Diante do exposto, requer:

a) a concessão da liminar para [___];

b) a notificação da autoridade coatora para prestar informações em 10 dias (art. 7º, I);

c) a ciência do feito ao órgão de representação judicial da [pessoa jurídica] (art. 7º, II);

d) a oitiva do Ministério Público (art. 12);

e) a concessão da segurança para [___], confirmando a liminar.

> Não há condenação em honorários advocatícios no mandado de segurança (art. 25 da Lei nº 12.016/2009).

Dá-se à causa o valor de R$ [___].

Termos em que pede deferimento.

[Cidade], [data].

[NOME DO ADVOGADO]
OAB/[UF] nº [___]`,

hc: `EXCELENTÍSSIMO(A) SENHOR(A) DESEMBARGADOR(A) PRESIDENTE DO EGRÉGIO TRIBUNAL DE JUSTIÇA DO ESTADO DE [UF]

> Endereçamento ao tribunal quando a autoridade coatora for juiz de primeiro grau. Se a coação vier de delegado, o pedido vai ao juiz de primeiro grau.

[NOME DO IMPETRANTE], advogado(a), inscrito(a) na OAB/[UF] sob o nº [___], com escritório em [endereço], vem impetrar

# HABEAS CORPUS COM PEDIDO LIMINAR

em favor de [NOME DO PACIENTE], [qualificação], atualmente [preso(a) em ___ / ameaçado(a) de prisão], com fundamento no art. 5º, LXVIII, da Constituição Federal e nos arts. 647 e seguintes do Código de Processo Penal, contra ato do(a) MM. Juiz(a) de Direito da [__] Vara Criminal da Comarca de [___], nos autos nº [___], pelos fatos e fundamentos a seguir.

## I – DOS FATOS

[Narre a prisão ou a ameaça, a decisão atacada e as datas.]

## II – DO CONSTRANGIMENTO ILEGAL

[Indique a hipótese do art. 648 do CPP: falta de justa causa, excesso de prazo, incompetência, cessação do motivo da coação, entre outras, e demonstre com os documentos anexos.]

## III – DA LIMINAR

[Demonstre a plausibilidade do direito e o risco da demora.]

## IV – DOS PEDIDOS

Diante do exposto, requer:

a) a concessão de liminar para [expedir alvará de soltura em favor do paciente / suspender ___];

b) a requisição de informações à autoridade coatora;

c) a vista à Procuradoria de Justiça;

d) a concessão definitiva da ordem, confirmando a liminar.

Termos em que pede deferimento.

[Cidade], [data].

[NOME DO ADVOGADO]
OAB/[UF] nº [___]`,

inominado: `EXCELENTÍSSIMO(A) SENHOR(A) JUIZ(A) DE DIREITO DO [__] JUIZADO ESPECIAL CÍVEL DA COMARCA DE [CIDADE/UF]

Processo nº [___]

[NOME DO RECORRENTE], já qualificado(a) nos autos da ação que move em face de [NOME DO RECORRIDO], por seu advogado, inconformado(a) com a sentença de [ID / fls. ___], vem interpor

# RECURSO INOMINADO

com fundamento no art. 41 da Lei nº 9.099/1995, requerendo seu recebimento e a remessa à Turma Recursal. Informa o recolhimento do preparo [ou: requer a gratuidade da justiça].

Termos em que pede deferimento.

[Cidade], [data].

[NOME DO ADVOGADO]
OAB/[UF] nº [___]

# RAZÕES DE RECURSO INOMINADO

Recorrente: [___]
Recorrido: [___]
Processo nº [___]

EGRÉGIA TURMA RECURSAL,
COLENDOS JULGADORES,

## I – DA TEMPESTIVIDADE E DO PREPARO

O recurso é tempestivo, interposto no prazo de 10 dias contado da ciência da sentença (art. 42 da Lei nº 9.099/1995). O preparo [foi recolhido / será recolhido nas 48 horas seguintes à interposição] (art. 42, § 1º).

## II – SÍNTESE DA DEMANDA E DA SENTENÇA

[Resuma o pedido inicial e o que a sentença decidiu.]

## III – DAS RAZÕES PARA A REFORMA

[Ataque, um a um, os fundamentos da sentença, citando o trecho e mostrando o erro de fato ou de direito.]

## IV – DOS PEDIDOS

Diante do exposto, requer o conhecimento e o provimento do recurso para reformar a sentença e [___].

> O recurso tem efeito apenas devolutivo; o efeito suspensivo pode ser pedido para evitar dano irreparável (art. 43).

Termos em que pede deferimento.

[Cidade], [data].

[NOME DO ADVOGADO]
OAB/[UF] nº [___]`,

notificacao: `# NOTIFICAÇÃO EXTRAJUDICIAL

NOTIFICANTE: [NOME], [qualificação], neste ato representado(a) por seu advogado [NOME], OAB/[UF] nº [___].

NOTIFICADO(A): [NOME], [qualificação], com endereço em [___].

[Cidade], [data].

Prezado(a) Senhor(a),

Pela presente, o(a) NOTIFICANTE vem, respeitosamente, NOTIFICÁ-LO(A) nos seguintes termos:

## 1. DOS FATOS

[Descreva a relação entre as partes e o que aconteceu, com datas.]

## 2. DA OBRIGAÇÃO NÃO CUMPRIDA

[Indique a cláusula contratual ou o dispositivo legal e o que deixou de ser cumprido.]

## 3. DA SOLICITAÇÃO

Diante disso, solicita que, no prazo de [__] dias contados do recebimento desta, Vossa Senhoria [descreva exatamente o que deve ser feito].

## 4. DAS CONSEQUÊNCIAS

O não atendimento no prazo indicado levará à adoção das medidas judiciais cabíveis. Esta notificação serve também para constituí-lo(a) em mora (art. 397, parágrafo único, do Código Civil).

> Mantenha um tom firme e cordial. A notificação pode ser lida por um juiz depois.

Atenciosamente,

[NOME DO NOTIFICANTE / DO ADVOGADO]
[OAB/UF nº ___]`,

honorarios: `# CONTRATO DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS

CONTRATANTE: [NOME], [nacionalidade], [estado civil], [profissão], CPF nº [___], residente em [endereço], e-mail [___].

CONTRATADO(A): [NOME DO ADVOGADO / DA SOCIEDADE], inscrito(a) na OAB/[UF] sob o nº [___], com escritório em [endereço].

As partes acima ajustam o presente contrato, que se regerá pelas cláusulas seguintes.

## CLÁUSULA 1ª – DO OBJETO

O(A) CONTRATADO(A) prestará ao(à) CONTRATANTE os seguintes serviços: [descreva o serviço de forma precisa, ex.: ajuizamento e acompanhamento de ação de ___ em primeira instância].

Parágrafo único. Não estão incluídos neste contrato: [recursos aos tribunais, cumprimento de sentença, ações conexas, diligências fora da comarca], que dependerão de novo ajuste.

## CLÁUSULA 2ª – DOS HONORÁRIOS

Pelos serviços, o(a) CONTRATANTE pagará o valor de R$ [___] ([por extenso]), da seguinte forma: [à vista / entrada de R$ ___ e ___ parcelas de R$ ___, com vencimento em ___] [e/ou ___% sobre o proveito econômico obtido].

## CLÁUSULA 3ª – DAS DESPESAS

Custas, taxas, perícias, cópias e deslocamentos correm por conta do(a) CONTRATANTE, mediante prestação de contas.

## CLÁUSULA 4ª – DOS HONORÁRIOS DE SUCUMBÊNCIA

Os honorários de sucumbência pertencem ao(à) CONTRATADO(A), sem prejuízo dos honorários contratados (arts. 22 e 23 da Lei nº 8.906/1994).

## CLÁUSULA 5ª – DAS OBRIGAÇÕES DO(A) CONTRATANTE

Fornecer documentos e informações verdadeiras e completas, manter seus dados de contato atualizados e comunicar qualquer fato novo relacionado ao objeto.

## CLÁUSULA 6ª – DA REVOGAÇÃO E DA RENÚNCIA

Em caso de revogação do mandato ou de renúncia, são devidos os honorários proporcionais ao trabalho realizado, observado o Código de Ética e Disciplina da OAB.

## CLÁUSULA 7ª – DO FORO

Fica eleito o foro da Comarca de [___] para dirimir questões relativas a este contrato.

E, por estarem de acordo, assinam o presente em duas vias.

[Cidade], [data].

[CONTRATANTE]

[CONTRATADO(A)] – OAB/[UF] nº [___]

Testemunhas:
1. [Nome e CPF]
2. [Nome e CPF]`
};

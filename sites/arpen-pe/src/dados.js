/* Conteúdo inicial do portal. Tudo o que a equipe cadastra no painel substitui estes exemplos. */
const LRP = 'https://www.planalto.gov.br/ccivil_03/leis/l6015compilada.htm';
const CC = 'https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm';
const PORTAL_RC = 'https://www.registrocivil.org.br/';

const SERVICOS = [
  { id: 'nascimento', foto: 'nascimento', curto: 'Nascimento', titulo: 'Meu bebê nasceu', desc: 'Entenda por onde começar o registro de nascimento.', capa: ['O primeiro', 'capítulo.'],
    pergunta: 'O nascimento já foi registrado em cartório?', opcoes: ['Ainda não foi registrado', 'Já foi registrado. Preciso de outra certidão', 'Não tenho certeza se existe registro'],
    fonte: LRP, fonteNome: 'Lei de Registros Públicos, arts. 30, 50 e 54',
    lista: ['Separar a Declaração de Nascido Vivo (DNV), se disponível.', 'Reunir os documentos dos responsáveis.', 'Confirmar no registro civil os documentos exigidos para a situação.'],
    resultado: 'Comece pelo cartório de registro civil. Em um nascimento recente, a DNV ajuda a preparar o atendimento; situações sem esse documento precisam de orientação específica. O registro e a primeira certidão são gratuitos.',
    proximo: 'Converse com o registro civil sobre a documentação e o prazo aplicável ao seu caso.' },
  { id: 'casamento', foto: 'casamento', curto: 'Casamento', titulo: 'Quero me casar', desc: 'Organize o primeiro passo antes de marcar a celebração.', capa: ['Uma vida.', 'A dois.'],
    pergunta: 'Em qual momento vocês estão?', opcoes: ['Vamos iniciar a habilitação', 'Já casamos. Precisamos de outra certidão', 'Precisamos de orientação sobre os documentos'],
    fonte: CC, fonteNome: 'Código Civil, art. 1.525',
    lista: ['Reunir as certidões e os documentos de identificação.', 'Informar ao cartório o estado civil de cada pessoa.', 'Confirmar a documentação, as testemunhas e a agenda com a serventia.'],
    resultado: 'A preparação começa com a habilitação no registro civil. Os documentos variam conforme o estado civil e a situação do casal. Antes de fechar a data, confirme os requisitos, os prazos e os valores no cartório.',
    proximo: 'Procure o registro civil para iniciar a habilitação e receber a lista adequada à situação de vocês.' },
  { id: 'certidao', foto: 'certidao', curto: 'Certidões', titulo: 'Preciso de uma certidão', desc: 'Encontre o caminho para pedir uma segunda via.', capa: ['Sua história,', 'em mãos.'],
    pergunta: 'De qual certidão você precisa?', opcoes: ['Nascimento', 'Casamento', 'Óbito'],
    fonte: PORTAL_RC, fonteNome: 'Portal oficial do Registro Civil',
    lista: ['Identificar o tipo de certidão e o nome da pessoa registrada.', 'Reunir os dados do registro que você já tem.', 'Confirmar o formato aceito por quem pediu o documento.'],
    resultado: 'Você pode solicitar a segunda via no cartório responsável ou consultar o portal oficial do Registro Civil. Confira o formato, os valores e a entrega antes de concluir. Se não souber onde foi feito o registro, procure orientação para a busca.',
    proximo: 'Acesse o portal oficial ou fale com o cartório onde o registro foi feito.' },
  { id: 'nome', curto: 'Nome civil', titulo: 'Quero alterar meu nome', desc: 'Entenda a diferença entre trocar o nome e corrigir um erro.', capa: ['Seu nome.', 'Sua identidade.'],
    pergunta: 'O que você deseja fazer?', opcoes: ['Mudar meu prenome (primeiro nome)', 'Alterar um sobrenome', 'Corrigir um erro no registro'],
    fonte: LRP, fonteNome: 'Lei de Registros Públicos, arts. 56, 57, 109 e 110',
    lista: ['Identificar exatamente qual alteração você deseja.', 'Reunir as certidões e os documentos atuais.', 'Pedir ao registro civil a análise e a lista de documentos do seu caso.'],
    resultado: 'Os caminhos variam conforme a alteração. Não é preciso presumir que toda mudança exige processo judicial: o registro civil pode analisar a hipótese e orientar o procedimento correto.',
    proximo: 'Explique ao registro civil a alteração desejada antes de providenciar documentos adicionais.' },
  { id: 'obito', curto: 'Óbito', titulo: 'Falecimento na família', desc: 'Orientação acolhedora sobre o registro de óbito.', capa: ['Cuidado em', 'cada passo.'],
    pergunta: 'O óbito já foi registrado em cartório?', opcoes: ['Ainda precisamos fazer o registro', 'Já foi registrado. Precisamos de outra certidão', 'Não sabemos se o registro foi feito'],
    fonte: LRP, fonteNome: 'Lei de Registros Públicos, arts. 30 e 77 a 80',
    lista: ['Reunir a Declaração de Óbito, quando disponível.', 'Separar os documentos da pessoa falecida e de quem fará a declaração.', 'Procurar prontamente o registro civil para confirmar os requisitos do caso.'],
    resultado: 'Sinto muito pela sua perda. O registro civil orienta a família sobre a documentação e o procedimento. O registro de óbito e a primeira certidão são gratuitos. A declaração médica de óbito e a certidão emitida pelo cartório são documentos diferentes.',
    proximo: 'Busque o registro civil para receber orientação sobre o atendimento, inclusive quando faltar algum documento.' },
];

const DUVIDAS = [
  { q: 'Perdi a certidão. Preciso fazer um novo registro?', a: 'Não. Se o registro já existe, o caminho é solicitar uma segunda via da certidão. A perda do papel não apaga o registro.', fonte: 'https://www.tjdft.jus.br/informacoes/perguntas-mais-frequentes/extrajudicial/nascimento', nome: 'TJDFT · Perguntas sobre nascimento' },
  { q: 'Posso pedir uma certidão pela internet?', a: 'O portal oficial do Registro Civil recebe pedidos de segunda via de certidões de nascimento, casamento e óbito. Verifique a disponibilidade, o formato e as condições do pedido.', fonte: PORTAL_RC, nome: 'Portal oficial do Registro Civil' },
  { q: 'Registrar o nascimento tem custo?', a: 'O registro de nascimento e a primeira certidão são gratuitos para todos.', fonte: LRP, nome: 'Lei de Registros Públicos · art. 30' },
  { q: 'A segunda via também é sempre gratuita?', a: 'Não em todos os casos. A lei prevê gratuidade para pessoas reconhecidamente pobres, comprovada por declaração na forma legal. Consulte o cartório sobre o pedido e os requisitos.', fonte: LRP, nome: 'Lei de Registros Públicos · art. 30, §§ 1º e 2º' },
  { q: 'O que devo fazer antes do casamento civil?', a: 'Procure o registro civil para a habilitação. A documentação depende da situação de cada pessoa; confirme a lista, as testemunhas e os prazos antes de marcar a celebração.', fonte: CC, nome: 'Código Civil · art. 1.525' },
  { q: 'Posso trocar meu primeiro nome sem decisão judicial?', a: 'Após a maioridade civil, é possível requerer pessoalmente a alteração imotivada do prenome no registro civil. Essa via só pode ser usada uma vez e está sujeita à análise e aos requisitos legais.', fonte: LRP, nome: 'Lei de Registros Públicos · art. 56' },
  { q: 'A declaração de óbito é a mesma coisa que a certidão?', a: 'Não. A declaração médica e a certidão do registro civil são documentos distintos. Procure o cartório para orientar o registro.', fonte: LRP, nome: 'Lei de Registros Públicos · arts. 77 a 80' },
  { q: 'O registro de óbito e a primeira certidão são pagos?', a: 'Não. O registro de óbito e a primeira certidão são gratuitos.', fonte: LRP, nome: 'Lei de Registros Públicos · art. 30' },
  { q: 'Fiz o guia aqui. Meu pedido já foi enviado?', a: 'Não. O guia é educativo: não protocola pedidos nem substitui o atendimento. Use o próximo passo indicado para falar com o cartório ou acessar o portal oficial.', fonte: null, nome: '' },
];

const DESAFIO = [
  { q: 'Perdi minha certidão de nascimento. Qual é o próximo passo?', op: ['Fazer outro registro de nascimento', 'Pedir a segunda via da certidão', 'Não é possível recuperar a certidão'], certa: 1, porque: 'O registro continua existindo. A segunda via fornece novamente a certidão desse registro.', duvida: 0 },
  { q: 'O registro de nascimento e a primeira certidão são gratuitos para quem?', op: ['Apenas quem recebe benefício social', 'Somente crianças de até um ano', 'Todas as pessoas'], certa: 2, porque: 'A gratuidade do registro de nascimento e da primeira certidão é para todos.', duvida: 2 },
  { q: 'Qual destes serviços está disponível no portal oficial do Registro Civil?', op: ['Solicitar segunda via de certidão', 'Emitir carteira de motorista', 'Emitir passaporte'], certa: 0, porque: 'O portal permite pedir segunda via de certidões de nascimento, casamento e óbito.', duvida: 1 },
  { q: 'Antes de marcar o casamento civil, qual é uma boa providência?', op: ['Presumir que todos os casos exigem os mesmos documentos', 'Confirmar com o cartório os requisitos para a habilitação', 'Esperar até o dia da celebração para levar os documentos'], certa: 1, porque: 'A documentação depende da situação do casal. Confirme os requisitos da habilitação com a serventia.', duvida: 4 },
  { q: 'Este guia já envia meu pedido ao cartório?', op: ['Sim, basta terminar as perguntas', 'Sim, depois de ganhar a medalha', 'Não. Ele orienta o próximo passo'], certa: 2, porque: 'O guia é educativo. Solicitações são feitas nos canais oficiais e nos cartórios.', duvida: 8 },
];

const CREDITOS_FOTOS = [
  ['Nascimento: bady abbas / Unsplash', 'https://unsplash.com/photos/N-VEeMnm7gE'],
  ['Casamento: Elizeu Dias / Unsplash', 'https://unsplash.com/photos/3On-02ybWXQ'],
  ['Certidões: Isaac Smith / Unsplash', 'https://unsplash.com/photos/XYogQSkSYZ8'],
];

function aulaVazia(titulo) { return { id: novoId(), titulo, desc: '', video: null, dur: 0, indice: [], anexos: [], status: 'rascunho' }; }
function programa(id, titulo, cat, desc, capa, modulos) {
  return { id, titulo, cat, desc, capa, status: 'publicado', modulos: modulos.map((m, i) => ({ id: id + 'm' + i, titulo: m, aulas: [aulaVazia(m)] })) };
}

function conteudoInicial() {
  return {
    versao: 1,
    noticias: [
      { id: 'n1', tipo: 'Institucional', titulo: 'ARPEN-PE e TJPE: parceria pela cidadania e pelo acesso à justiça', resumo: 'Uma iniciativa voltada à documentação civil e à inclusão social em Pernambuco.', data: '2025-11-03', corpo: 'A ARPEN-PE participou de ações de cidadania em parceria com o TJPE, incluindo a Semana Nacional da Conciliação e o Mutirão PopRuaJud. A notícia destaca o acesso à documentação civil para pessoas em situação de vulnerabilidade.\n\nEsta é uma notícia de arquivo, publicada em 3 de novembro de 2025. Consulte a publicação original para os detalhes das ações.', link: 'https://arpenbrasil.org.br/arpen-pe-e-tjpe-firmam-parceria-em-acoes-de-cidadania-e-acesso-a-justica/', status: 'publicado' },
      { id: 'n2', tipo: 'Cidadania', titulo: 'Registro civil presente nas ações de solidariedade em Pernambuco', resumo: 'Confira no arquivo a mobilização dos cartórios para apoiar famílias afetadas pelas chuvas.', data: '2022-06-02', corpo: 'Em junho de 2022, a ARPEN-PE mobilizou cartórios para arrecadar doações destinadas a famílias afetadas pelas chuvas.\n\nNotícia de arquivo. Esta página não indica uma campanha de arrecadação atualmente ativa.', link: 'https://arpenbrasil.org.br/cartorios-de-registro-civil-de-pernambuco-sao-pontos-de-coleta-de-doacoes-para-desabrigados/', status: 'publicado' },
      { id: 'n3', tipo: 'Institucional', titulo: 'Diálogo institucional com a Corregedoria de Pernambuco', resumo: 'Registro de encontro para discutir assuntos relacionados ao serviço extrajudicial.', data: '2022-05-04', corpo: 'O TJPE registrou uma visita da diretoria da ARPEN-PE à Corregedoria em maio de 2022 para tratar de assuntos do serviço extrajudicial.\n\nNotícia histórica. Os cargos e mandatos daquela publicação não representam necessariamente a composição atual.', link: 'https://portal.tjpe.jus.br/web/corregedoria/-/representantes-da-arpen-pe-vistam-corregedoria', status: 'publicado' },
    ],
    orientacoes: [
      { id: 'o1', tipo: 'Informativos', titulo: 'Um jeito mais simples de acompanhar as atualizações', resumo: 'Veja como cada informativo será organizado no portal.', corpo: 'MODELO EDITORIAL · Não constitui orientação normativa.\n\n1. O que aconteceu\nResumo da atualização em linguagem direta.\n\n2. Quem precisa observar\nServentias, equipes e situações alcançadas.\n\n3. O que muda na prática\nProcedimentos e cuidados a considerar.\n\n4. Quando se aplica\nData de vigência e eventuais regras de transição.\n\n5. Fonte oficial\nLink para o ato integral e data da revisão do conteúdo.', link: '', status: 'publicado' },
      { id: 'o2', tipo: 'Decisões', titulo: 'Decisões explicadas, com contexto e fonte oficial', resumo: 'Modelo de leitura para conectar a decisão à rotina da serventia.', corpo: 'MODELO EDITORIAL · Nenhuma decisão foi cadastrada ainda.\n\nCada publicação poderá apresentar: contexto do caso, questão analisada, entendimento adotado, alcance da decisão, possíveis efeitos práticos e link para a íntegra.\n\nA equipe deverá revisar o conteúdo antes de publicá-lo.', link: '', status: 'publicado' },
      { id: 'o3', tipo: 'Instruções', titulo: 'Passo a passo para a rotina do registro civil', resumo: 'Um espaço para instruções, documentos de referência e checklists.', corpo: 'MODELO EDITORIAL · Nenhuma instrução normativa foi cadastrada ainda.\n\nEstrutura prevista: finalidade, requisitos, sequência do procedimento, pontos de atenção, materiais relacionados e fonte oficial.\n\nAs instruções deverão ser validadas pela equipe responsável.', link: '', status: 'publicado' },
    ],
    materiais: [],
    avisos: [
      { id: 'a1', titulo: 'Boas-vindas à área de capacitação', corpo: 'Aqui você encontra aulas, materiais e avisos dos próximos encontros. Comece pelo curso de demonstração para conhecer o reprodutor e o índice das aulas.', data: '2026-11-17', status: 'publicado' },
    ],
    encontros: [],
    participantes: [],
    cursos: [
      { id: 'demo', titulo: 'Conheça a área do aluno', cat: 'Demonstração', desc: 'Duas aulas de exemplo para testar o reprodutor, o índice clicável e as anotações. Pode ser apagado pela equipe.', capa: 'varanda', status: 'publicado',
        modulos: [{ id: 'demom0', titulo: 'Primeiros passos', aulas: [
          { id: 'demoa1', titulo: 'Como funciona o reprodutor', desc: 'Vídeo curto de demonstração, sem narração. Use o índice ao lado para pular entre os trechos, mude a velocidade e teste as anotações com marcação de tempo.', video: { tipo: 'arquivo', url: 'img/aula-demo.mp4' }, dur: 48,
            indice: [{ t: 0, titulo: 'Abertura' }, { t: 12, titulo: 'O índice da aula' }, { t: 24, titulo: 'Anotações com tempo' }, { t: 36, titulo: 'Próxima aula' }],
            anexos: [], status: 'publicado' },
          { id: 'demoa2', titulo: 'Exemplo com vídeo do YouTube', desc: 'Aula hospedada no YouTube: “Treinamento Prático - Serviços de CPF no RCPN”, do canal Arpen Brasil. Os marcadores do índice são apenas exemplos de posição; a equipe cola o índice real no painel.', video: { tipo: 'youtube', id: 'Xpuodb_oE0o' }, dur: 0,
            indice: [{ t: 0, titulo: 'Início (marcador de exemplo)' }, { t: 300, titulo: 'Marcador de exemplo aos 5 min' }, { t: 900, titulo: 'Marcador de exemplo aos 15 min' }],
            anexos: [{ titulo: 'Canal Arpen Brasil no YouTube', url: 'https://www.youtube.com/@ArpenBrasilOficial' }], status: 'publicado' },
        ] }] },
      programa('p1', 'Atendimento que acolhe', 'Atendimento ao cidadão', 'Comunicação clara, escuta e organização do atendimento.', 'recife', ['Boas-vindas e objetivos', 'Comunicação em situações sensíveis', 'Organização e encaminhamento']),
      programa('p2', 'Registro civil na prática', 'Rotina da serventia', 'Uma proposta de formação para a rotina da equipe.', 'varanda', ['Mapa dos serviços', 'Conferência da documentação', 'Qualidade e revisão dos atos']),
      programa('p3', 'Serviços digitais, passo a passo', 'Transformação digital', 'Uma trilha para aproximar tecnologia e serviço.', 'certidao', ['Canais oficiais e segurança', 'Organização dos pedidos', 'Comunicação com o usuário']),
    ],
  };
}

// Pauta · 15 identidades visuais e modelos de posts (10 carrosséis, 3 telas únicas, 3 stories/destaques, 3 extras).
// Os slides têm tamanho fixo (540×675 no feed, 540×960 nos stories, 540×540 nos destaques) e exportam em 2× (1080 px).
// Texto entre *asteriscos* sai destacado no estilo da identidade.
window.MODELOS = (() => {
const IDT = [
  { id:'toga', nome:'Toga Moderna', desc:'Clássico e sóbrio, com moldura dourada fina.', ideal:['familia','sucessoes','civel'], motivo:'toga',
    c:{ bg:'#F7F4EC', sf:'#FFFFFF', ink:'#14213D', mu:'#5A6478', ac:'#B8913A', ac2:'#14213D', on:'#FFFFFF', cbg:'#14213D', cink:'#F7F4EC' },
    f:{ t:"'Playfair Display', Georgia, serif", b:"'Inter', Arial, sans-serif", tw:700, tt:'none', tl:'-.01em', lh:1.04, k:1 }, rad:4, hl:'italico' },
  { id:'jornal', nome:'Editorial Jornal', desc:'Manchete de jornal, fios e colunas: ótimo para notícias.', ideal:['publico','criminal','tributario'], motivo:'jornal',
    c:{ bg:'#F3EFE6', sf:'#FBF8F1', ink:'#111111', mu:'#555555', ac:'#C8102E', ac2:'#111111', on:'#FFFFFF', cbg:'#F3EFE6', cink:'#111111' },
    f:{ t:"'Fraunces', Georgia, serif", b:"'IBM Plex Sans', Arial, sans-serif", tw:900, tt:'none', tl:'-.03em', lh:.98, k:1.02 }, rad:0, hl:'sublinhado' },
  { id:'minimal', nome:'Minimal Branco', desc:'Muito respiro, tipografia enorme e um acento elétrico.', ideal:['empresarial','tributario','digital'], motivo:'minimal',
    c:{ bg:'#FFFFFF', sf:'#F3F4F6', ink:'#0A0A0A', mu:'#6B7280', ac:'#2F4BFF', ac2:'#0A0A0A', on:'#FFFFFF', cbg:'#FFFFFF', cink:'#0A0A0A' },
    f:{ t:"'Inter Tight', Arial, sans-serif", b:"'Inter Tight', Arial, sans-serif", tw:800, tt:'none', tl:'-.045em', lh:.96, k:1.04 }, rad:18, hl:'cor' },
  { id:'neon', nome:'Pop Neon', desc:'Fundo preto, verde-limão e rosa: chama atenção no feed.', ideal:['consumidor','digital','carreira'], motivo:'neon',
    c:{ bg:'#0D0D0D', sf:'#1C1C1C', ink:'#F5F5F5', mu:'#A3A3A3', ac:'#C6FF3D', ac2:'#FF4FD8', on:'#0D0D0D', cbg:'#0D0D0D', cink:'#F5F5F5' },
    f:{ t:"'Archivo Black', Impact, sans-serif", b:"'Archivo', Arial, sans-serif", tw:400, tt:'uppercase', tl:'-.01em', lh:.94, k:.92 }, rad:16, hl:'caixa' },
  { id:'caderno', nome:'Caderno de Estudos', desc:'Folha pautada, letra de mão e marca-texto amarelo.', ideal:['carreira','previdenciario','consumidor'], motivo:'caderno',
    c:{ bg:'#FFFDF5', sf:'#FFF6C9', ink:'#1F2937', mu:'#4B5563', ac:'#FFE14D', ac2:'#E5484D', on:'#1F2937', cbg:'#FFFDF5', cink:'#1F2937' },
    f:{ t:"'Caveat', 'Comic Sans MS', cursive", b:"'Nunito', Arial, sans-serif", tw:700, tt:'none', tl:'0', lh:.95, k:1.32 }, rad:10, hl:'marcatexto' },
  { id:'terracota', nome:'Terracota Acolhedor', desc:'Cores da terra e formas suaves: acolhe sem perder a seriedade.', ideal:['familia','sucessoes','saude'], motivo:'terracota',
    c:{ bg:'#F6EDE3', sf:'#FFF9F3', ink:'#3B2A20', mu:'#7A6455', ac:'#C4622D', ac2:'#6B7B4B', on:'#FFFFFF', cbg:'#C4622D', cink:'#FFF4EA' },
    f:{ t:"'DM Serif Display', Georgia, serif", b:"'DM Sans', Arial, sans-serif", tw:400, tt:'none', tl:'-.01em', lh:1.02, k:1.04 }, rad:26, hl:'italico' },
  { id:'verde', nome:'Verde Sereno', desc:'Letras grandes e contraste alto: pensado para o público 60+.', ideal:['previdenciario','saude','bancario'], motivo:'verde',
    c:{ bg:'#F1F6F2', sf:'#FFFFFF', ink:'#12372A', mu:'#4E6B5E', ac:'#2E8A6E', ac2:'#F2C14E', on:'#FFFFFF', cbg:'#12372A', cink:'#F1F6F2' },
    f:{ t:"'Bricolage Grotesque', Arial, sans-serif", b:"'Bricolage Grotesque', Arial, sans-serif", tw:800, tt:'none', tl:'-.03em', lh:1, k:1 }, rad:28, hl:'pilula' },
  { id:'brutal', nome:'Brutalista', desc:'Bordas grossas, laranja e caixa alta: firme e direto.', ideal:['criminal','trabalho','publico'], motivo:'brutal',
    c:{ bg:'#E9E9E6', sf:'#FFFFFF', ink:'#000000', mu:'#2B2B2B', ac:'#FF5A1F', ac2:'#000000', on:'#000000', cbg:'#FF5A1F', cink:'#000000' },
    f:{ t:"'Anton', Impact, sans-serif", b:"'IBM Plex Mono', monospace", tw:400, tt:'uppercase', tl:'0', lh:.95, k:1.06 }, rad:0, hl:'caixa' },
  { id:'lilas', nome:'Lilás Elegante', desc:'Arcos, serifa delicada e lilás: feminino e firme.', ideal:['familia','criminal','extrajudicial'], motivo:'lilas',
    c:{ bg:'#F4EEF8', sf:'#FFFFFF', ink:'#3A1E4D', mu:'#6E5A7E', ac:'#8E4FBF', ac2:'#E8B4C8', on:'#FFFFFF', cbg:'#3A1E4D', cink:'#F4EEF8' },
    f:{ t:"'Cormorant Garamond', Georgia, serif", b:"'Manrope', Arial, sans-serif", tw:700, tt:'none', tl:'-.01em', lh:.98, k:1.14 }, rad:24, hl:'italico' },
  { id:'corporativo', nome:'Corporativo Azul', desc:'Degradê azul e cartões brancos: confiança e tecnologia.', ideal:['empresarial','bancario','tributario'], motivo:'corporativo',
    c:{ bg:'#EEF3FF', sf:'#FFFFFF', ink:'#0B1B3F', mu:'#5A6B8C', ac:'#1D5BF0', ac2:'#00C2FF', on:'#FFFFFF', cbg:'#0B2A8A', cink:'#FFFFFF' },
    f:{ t:"'Plus Jakarta Sans', Arial, sans-serif", b:"'Plus Jakarta Sans', Arial, sans-serif", tw:800, tt:'none', tl:'-.035em', lh:1, k:1 }, rad:22, hl:'pilula' },
  { id:'luxo', nome:'Revista Luxo', desc:'Preto, champanhe e Bodoni: alto padrão.', ideal:['imobiliario','sucessoes','empresarial'], motivo:'luxo',
    c:{ bg:'#0F0F0F', sf:'#1A1A1A', ink:'#F2EBDD', mu:'#A89F8E', ac:'#D4B483', ac2:'#F2EBDD', on:'#0F0F0F', cbg:'#0F0F0F', cink:'#F2EBDD' },
    f:{ t:"'Bodoni Moda', Didot, serif", b:"'Jost', Arial, sans-serif", tw:700, tt:'none', tl:'-.01em', lh:1, k:1.02 }, rad:0, hl:'italico' },
  { id:'scrap', nome:'Scrapbook', desc:'Papel kraft, fita adesiva e anotações: humano e próximo.', ideal:['consumidor','civel','imobiliario'], motivo:'scrap',
    c:{ bg:'#D9C3A0', sf:'#FFFDF7', ink:'#2B2118', mu:'#5C4A38', ac:'#E85D4A', ac2:'#3D7EA6', on:'#FFFFFF', cbg:'#D9C3A0', cink:'#2B2118' },
    f:{ t:"'Rubik', Arial, sans-serif", b:"'Rubik', Arial, sans-serif", tw:800, tt:'none', tl:'-.03em', lh:1, k:1 }, rad:6, hl:'marcatexto' },
  { id:'tech', nome:'Tech Digital', desc:'Grade, brilho ciano e fonte mono: para Direito Digital e LGPD.', ideal:['digital','empresarial','bancario'], motivo:'tech',
    c:{ bg:'#0B1020', sf:'#121A33', ink:'#E6EDFF', mu:'#8FA0C8', ac:'#2EE6D6', ac2:'#7B61FF', on:'#0B1020', cbg:'#0B1020', cink:'#E6EDFF' },
    f:{ t:"'Sora', Arial, sans-serif", b:"'Sora', Arial, sans-serif", tw:700, tt:'none', tl:'-.035em', lh:1.02, k:1 }, rad:14, hl:'cor' },
  { id:'saude', nome:'Saúde Clean', desc:'Branco, verde-água e ondas suaves: Direito da Saúde.', ideal:['saude','previdenciario','familia'], motivo:'saude',
    c:{ bg:'#F3FAFB', sf:'#FFFFFF', ink:'#0E3B43', mu:'#4F7177', ac:'#0FA3A3', ac2:'#6CB4FF', on:'#FFFFFF', cbg:'#0FA3A3', cink:'#FFFFFF' },
    f:{ t:"'Outfit', Arial, sans-serif", b:"'Outfit', Arial, sans-serif", tw:700, tt:'none', tl:'-.03em', lh:1.02, k:1.02 }, rad:24, hl:'pilula' },
  { id:'retro', nome:'Retrô 70', desc:'Creme, laranja e listras curvas: leve e memorável.', ideal:['trabalho','consumidor','carreira'], motivo:'retro',
    c:{ bg:'#F6E7C8', sf:'#FFF4DD', ink:'#3B2314', mu:'#7A5A3E', ac:'#E2702A', ac2:'#B5462A', on:'#FFFFFF', cbg:'#E2702A', cink:'#FFF4DD' },
    f:{ t:"'Fraunces', Georgia, serif", b:"'Work Sans', Arial, sans-serif", tw:900, tt:'none', tl:'-.03em', lh:.98, k:1, it:true }, rad:30, hl:'caixa' }
];

// Conteúdo de exemplo de cada modelo (editável no editor). Casos sempre fictícios.
const PACKS = {
  c1:{ area:'Consumidor', tag:'Seus direitos', titulo:'Comprou pela internet e *se arrependeu?*', sub:'Você tem 7 dias. Entenda como funciona.',
    itens:[{ t:'O direito de arrependimento', d:'Está no art. 49 do Código de Defesa do Consumidor.' }, { t:'Vale para compras fora da loja física', d:'Internet, telefone, catálogo ou venda em casa.' }, { t:'O prazo é de 7 dias', d:'Contados da compra ou do recebimento do produto.' }, { t:'Você recebe tudo de volta', d:'Inclusive o frete, com correção monetária.' }, { t:'Como pedir', d:'Avise a loja por escrito e guarde o protocolo.' }],
    fim:{ titulo:'Salve para consultar quando precisar.', sub:'Mande para quem compra muito pela internet.' } },
  c2:{ area:'Família', tag:'Pensão alimentícia', titulo:'Mito ou *verdade?*', sub:'4 frases que você já ouviu sobre pensão.',
    itens:[{ t:'A pensão acaba aos 18 anos.', v:'MITO', d:'O fim depende de decisão judicial (Súmula 358 do STJ).' }, { t:'Quem atrasa a pensão perde o direito de visita.', v:'MITO', d:'Pensão e convivência são direitos separados.' }, { t:'Três parcelas atrasadas podem levar à prisão.', v:'VERDADE', d:'A prisão civil alcança as três últimas parcelas (art. 528, § 7º, do CPC).' }, { t:'Desempregado não precisa pagar.', v:'MITO', d:'O valor pode ser revisto, mas a obrigação continua.' }],
    fim:{ titulo:'Qual dessas você já ouviu?', sub:'Comente e salve para lembrar.' } },
  c3:{ area:'Sucessões', tag:'Passo a passo', titulo:'Inventário em cartório em *5 passos*', sub:'Mais rápido que o processo judicial, quando cabe.',
    itens:[{ t:'Confira se cabe', d:'Em regra, herdeiros capazes e de acordo, com advogado.' }, { t:'Reúna os documentos', d:'Certidão de óbito, documentos dos herdeiros e dos bens.' }, { t:'Calcule o ITCMD', d:'É o imposto estadual sobre a herança.' }, { t:'Escolha o cartório de notas', d:'Pode ser qualquer tabelionato do país.' }, { t:'Assine a escritura', d:'Com ela, os bens são registrados no nome dos herdeiros.' }],
    fim:{ titulo:'Guarde este passo a passo.', sub:'Cada família tem detalhes: confirme os requisitos do seu caso.' } },
  c4:{ area:'Trabalhista', tag:'Demissão', titulo:'3 erros que fazem você *perder direitos* na demissão', sub:'E o que fazer no lugar.',
    itens:[{ t:'Assinar a rescisão sem conferir', d:'Confira verbas, datas e o saldo do FGTS antes de assinar.' }, { t:'Perder o prazo de 2 anos', d:'Depois da saída, há 2 anos para entrar com a ação.' }, { t:'Não guardar provas', d:'Salve mensagens, holerites, escalas e e-mails.' }],
    fim:{ titulo:'Mande para quem acabou de sair do emprego.', sub:'Informação certa na hora certa faz diferença.' } },
  c5:{ area:'Previdenciário', tag:'Checklist', titulo:'Documentos para pedir a *aposentadoria*', sub:'Separe antes de entrar no Meu INSS.',
    itens:[{ t:'Documento com foto e CPF' }, { t:'Carteiras de trabalho (todas)' }, { t:'Extrato do CNIS' }, { t:'Carnês de contribuição, se foi autônomo' }, { t:'PPP, se trabalhou exposto a agentes nocivos' }, { t:'Certidões de casamento e de nascimento dos filhos, quando pedidas' }],
    dica:'Confira o CNIS antes de tudo: erros no extrato atrasam o pedido.', fim:{ titulo:'Salve e use como lista de conferência.', sub:'Compartilhe com quem está perto de se aposentar.' } },
  c6:{ area:'Imobiliário', tag:'Aluguel', titulo:'*3 dúvidas* de quem mora de aluguel', sub:'Respondidas pela Lei do Inquilinato.',
    itens:[{ t:'O dono pode entrar no imóvel sem avisar?', d:'Não. A visita precisa ser combinada antes (art. 23, IX, da Lei 8.245/91).' }, { t:'Quem paga o IPTU?', d:'O proprietário, salvo se o contrato passar ao inquilino (art. 22, VIII).' }, { t:'Posso sair antes do fim do contrato?', d:'Sim, pagando multa proporcional ao tempo que falta (art. 4º).' }],
    fim:{ titulo:'Qual é a sua dúvida sobre aluguel?', sub:'Deixe nos comentários: ela pode virar o próximo post.' } },
  c7:{ area:'Bancário', tag:'Caso fictício', titulo:'Joana caiu no golpe do *falso atendente*', sub:'O que ela pode fazer agora.',
    itens:[{ t:'Conheça Joana', d:'Ela recebeu a ligação do “banco” e fez transferências para “proteger” a conta.' }, { t:'O problema', d:'O banco disse que a culpa era dela.' }, { t:'O que a lei diz', d:'Os bancos respondem por fraudes ligadas à sua atividade (Súmula 479 do STJ), conforme o caso.' }, { t:'O que fazer', d:'Avisar o banco na hora, pedir o MED do Pix, registrar boletim de ocorrência e guardar provas.' }],
    aviso:'Caso fictício, criado para fins educativos.', fim:{ titulo:'Mande para quem precisa saber disso.', sub:'Golpe evitado é melhor que golpe resolvido.' } },
  c8:{ area:'Saúde', tag:'Entenda a lei', kicker:'Plano de saúde', titulo:'Tratamento fora do rol da ANS pode ter *cobertura*', sub:'A Lei 14.454/2022 mudou o jogo. Veja o que ela diz.',
    itens:[{ t:'O que mudou', d:'O rol da ANS passou a ser referência básica, e não uma lista fechada.' }, { t:'Quando o plano deve cobrir', d:'Quando há comprovação técnica de eficácia ou recomendação de órgãos de avaliação.' }, { t:'Se o plano negar', d:'Peça a negativa por escrito e o relatório detalhado do seu médico.' }],
    fonte:'Fonte: Lei 14.454/2022.', fim:{ titulo:'Salve e compartilhe com quem tem plano de saúde.', sub:'Cada caso depende do contrato e do laudo.' } },
  c9:{ area:'Família', tag:'Comparativo', a:'União estável', b:'Casamento', titulo:'União estável *x* casamento', sub:'O que muda na prática.',
    itens:[{ t:'Como começa', a:'Pela convivência; pode ser registrada em cartório', b:'Pela celebração no cartório' }, { t:'Regime de bens padrão', a:'Comunhão parcial', b:'Comunhão parcial' }, { t:'Estado civil', a:'Não muda', b:'Passa a ser casado' }, { t:'Como termina', a:'Dissolução', b:'Divórcio' }],
    fim:{ titulo:'Ficou alguma dúvida?', sub:'Comente: a próxima pode ser a sua.' } },
  c10:{ area:'Geral', tag:'Juridiquês', titulo:'5 palavras do juridiquês *traduzidas*', sub:'Para você entender o seu processo.',
    itens:[{ t:'Trânsito em julgado', d:'Quando não cabe mais recurso.' }, { t:'Liminar', d:'Decisão rápida, dada antes do fim do processo.' }, { t:'Citação', d:'Aviso oficial de que você está sendo processado.' }, { t:'Petição inicial', d:'O pedido que dá início à ação.' }, { t:'Audiência de conciliação', d:'Encontro para tentar um acordo.' }],
    fim:{ titulo:'Qual palavra você quer que eu explique?', sub:'Comente aqui embaixo.' } },
  t1:{ area:'Geral', titulo:'Conhecer os seus direitos é o *primeiro passo* para defendê-los.', sub:'' },
  t2:{ area:'Consumidor', tag:'Dica rápida', titulo:'Guarde notas e comprovantes de compra por *pelo menos 5 anos.*', sub:'É o prazo para pedir reparação por danos causados por produto ou serviço (art. 27 do CDC).' },
  t3:{ area:'Consumidor', dia:'15', mes:'março', titulo:'Dia do *Consumidor*', sub:'Conheça seus direitos e compre com segurança.' },
  s1:{ area:'Família', tag:'Stories', titulo:'Vem que eu te explico: *guarda compartilhada*', sub:'Toque para continuar →' },
  s2:{ area:'Família', titulo:'A pensão acaba *aos 18 anos?*', a:'Mito', b:'Verdade', sub:'Responda e veja a resposta no próximo story.' },
  s3:{ area:'Geral', itens:[{ t:'Sobre mim', i:'user' }, { t:'Dúvidas', i:'q' }, { t:'Família', i:'heart' }, { t:'Consumidor', i:'bag' }, { t:'Bastidores', i:'cam' }, { t:'Materiais', i:'doc' }] },
  e1:{ area:'Trabalhista', tag:'Reels', titulo:'Seu chefe pode *mandar mensagem* fora do horário?', sub:'' },
  e2:{ area:'Geral', titulo:'Ninguém lê o contrato de aluguel até o dia em que precisa sair antes do prazo.', sub:'' },
  c11:{ area:'Trabalhista', tag:'Linha do tempo', titulo:'Da demissão ao processo: *a linha do tempo*', sub:'O que acontece em cada fase, sem juridiquês.',
    itens:[{ t:'Dia 1', d:'Aviso prévio: trabalhado ou indenizado.' }, { t:'Até 10 dias', d:'Pagamento das verbas rescisórias.' }, { t:'Na rescisão', d:'Guias do FGTS e do seguro-desemprego.' }, { t:'Até 2 anos', d:'Prazo para entrar com a ação trabalhista.' }],
    fim:{ titulo:'Salve e confira as suas datas.', sub:'Cada contrato tem detalhes próprios.' } },
  c12:{ area:'Consumidor', tag:'Quiz', titulo:'Quiz: você conhece seus *direitos de consumidor?*', sub:'3 perguntas. Responda antes de passar.',
    itens:[{ t:'A loja é obrigada a trocar um produto sem defeito?', a:'Sim, sempre', b:'Não, só se prometeu', c:'Só em 7 dias', v:'b', d:'Sem defeito, a troca depende da política da loja (o arrependimento de 7 dias vale para compras fora da loja).' }, { t:'Cobrança indevida paga deve ser devolvida em dobro?', a:'Sim, em regra', b:'Nunca', c:'Só com processo', v:'a', d:'O art. 42 do CDC prevê a devolução em dobro, salvo engano justificável.' }, { t:'Posso cancelar internet sem multa no fim da fidelidade?', a:'Não', b:'Sim', c:'Só pessoalmente', v:'b', d:'Terminado o prazo de fidelidade, não cabe multa.' }],
    fim:{ titulo:'Quantas você acertou?', sub:'Conte nos comentários.' } },
  c13:{ area:'Previdenciário', tag:'Números', titulo:'4 números que todo *segurado do INSS* deve saber', sub:'Guarde para não perder prazo.',
    itens:[{ num:'15', un:'anos', t:'de contribuição mínima para a aposentadoria por idade.' }, { num:'65', un:'anos', t:'idade mínima do homem para a aposentadoria por idade urbana.' }, { num:'62', un:'anos', t:'idade mínima da mulher para a aposentadoria por idade urbana.' }, { num:'10', un:'anos', t:'prazo para pedir a revisão do benefício.' }],
    fonte:'Regras gerais após a EC 103/2019. Há regras de transição.', fim:{ titulo:'Salve e mande para quem está perto de se aposentar.', sub:'Cada caso tem regras de transição.' } },
  c14:{ area:'Geral', tag:'Prazos', titulo:'Prazos que você *não pode perder*', sub:'Anote no calendário.',
    itens:[{ num:'7', un:'dias', t:'para desistir de compra feita pela internet (art. 49 do CDC).' }, { num:'90', un:'dias', t:'para reclamar de defeito em produto durável (art. 26 do CDC).' }, { num:'2', un:'meses', t:'para abrir o inventário (art. 611 do CPC).' }, { num:'2', un:'anos', t:'para a ação trabalhista depois da saída.' }],
    fim:{ titulo:'Qual prazo você não conhecia?', sub:'Comente aqui embaixo.' } },
  c15:{ area:'Imobiliário', tag:'Pode ou não pode', titulo:'Condomínio: o que *pode* e o que *não pode*', sub:'As dúvidas que mais viram briga.',
    itens:[{ t:'Proibir animais de estimação de forma geral', v:'NÃO PODE', d:'O STJ entende que a proibição genérica não vale.' }, { t:'Multar quem faz barulho fora do horário', v:'PODE', d:'Se a convenção ou o regimento preverem.' }, { t:'Cortar a água de quem está devendo', v:'NÃO PODE', d:'A cobrança deve seguir os meios legais.' }, { t:'Expor a lista de devedores no elevador', v:'NÃO PODE', d:'Pode gerar dano moral por exposição.' }],
    fim:{ titulo:'Mande no grupo do condomínio.', sub:'Informação evita briga.' } },
  c16:{ area:'Apresentação', tag:'Prazer', titulo:'Prazer, eu sou *quem vai traduzir o Direito* para você', sub:'3 coisas sobre mim.',
    itens:[{ t:'Por que escolhi o Direito', d:'Porque vi de perto como a informação muda a vida das pessoas.' }, { t:'Com o que eu trabalho', d:'As áreas em que você pode me encontrar por aqui.' }, { t:'O que você vai ver neste perfil', d:'Direitos explicados sem juridiquês, toda semana.' }],
    fim:{ titulo:'Me conta: de onde você me acompanha?', sub:'Responda nos comentários.' } },
  t4:{ area:'Família', tag:'Lei em destaque', art:'Art. 1.694', lei:'Código Civil', titulo:'“Podem os parentes, os cônjuges ou companheiros pedir uns aos outros os alimentos de que necessitem para viver.”', sub:'Ou seja: pensão não é só de pai para filho.' },
  t5:{ area:'Geral', tag:'Comente', titulo:'Qual é a sua *maior dúvida* sobre os seus direitos?', sub:'A resposta pode virar o próximo post.' },
  t6:{ area:'Geral', tag:'Aviso', titulo:'Recesso de *fim de ano*', sub:'Os prazos processuais ficam suspensos de 20 de dezembro a 20 de janeiro (art. 220 do CPC). Atendimentos urgentes continuam.' },
  s4:{ area:'Geral', tag:'Contagem', num:'3', un:'dias', titulo:'para a nossa *live* sobre pensão', sub:'Ative o lembrete.' },
  s5:{ area:'Família', titulo:'Me pergunte sobre *divórcio*', caixa:'Digite sua pergunta…', sub:'Respondo as melhores amanhã.' },
  s6:{ area:'Geral', hora:'07:30', titulo:'Um dia na minha *rotina*', sub:'Do café à audiência.' },
  e4:{ area:'Notícias', tag:'Notícia', jornal:'Diário do Direito', titulo:'STJ decide que proibição genérica de animais em condomínio *não vale*', sub:'Entenda o que isso muda para você no próximo post.' },
  e5:{ area:'Geral', a:'O cliente: “É só uma perguntinha rápida…”', b:'Eu, abrindo o Código, a jurisprudência e três doutrinas:', titulo:'*Toda* pergunta merece resposta certa.' },
  e3:{ area:'Consumidor', num:'30', un:'dias', titulo:'é o prazo para a loja *consertar* um produto com defeito.', sub:'Se não resolver, você escolhe: troca, dinheiro de volta ou abatimento (art. 18 do CDC).' }
};

const TPL = [
  { id:'c1', grupo:'carrossel', nome:'Educativo', desc:'Capa, tópicos numerados, resumo e chamada final.' },
  { id:'c2', grupo:'carrossel', nome:'Mito ou verdade', desc:'Uma frase por slide, com o carimbo MITO ou VERDADE.' },
  { id:'c3', grupo:'carrossel', nome:'Passo a passo', desc:'Número gigante em cada etapa e barra de progresso.' },
  { id:'c4', grupo:'carrossel', nome:'Erros comuns', desc:'O erro com ✕ e o jeito certo com ✓.' },
  { id:'c5', grupo:'carrossel', nome:'Checklist', desc:'Lista de documentos para salvar e conferir.' },
  { id:'c6', grupo:'carrossel', nome:'Perguntas e respostas', desc:'Balão de pergunta e resposta com a lei.' },
  { id:'c7', grupo:'carrossel', nome:'Caso fictício', desc:'História em capítulos com o que a lei diz.' },
  { id:'c8', grupo:'carrossel', nome:'Notícia explicada', desc:'Manchete, o que mudou e o que fazer.' },
  { id:'c9', grupo:'carrossel', nome:'Comparativo', desc:'A x B em duas colunas, critério por critério.' },
  { id:'c10', grupo:'carrossel', nome:'Juridiquês traduzido', desc:'Um termo por slide, com definição simples.' },
  { id:'t1', grupo:'unica', nome:'Frase de destaque', desc:'Citação grande com assinatura.' },
  { id:'t2', grupo:'unica', nome:'Dica rápida', desc:'Cartão de nota com a dica e a base legal.' },
  { id:'t3', grupo:'unica', nome:'Data comemorativa', desc:'Data em destaque e a mensagem do dia.' },
  { id:'s1', grupo:'stories', nome:'Capa de sequência', desc:'Abre uma sequência de stories explicativos.' },
  { id:'s2', grupo:'stories', nome:'Enquete', desc:'Pergunta com figurinha de enquete.' },
  { id:'s3', grupo:'stories', nome:'Capas de destaque', desc:'6 capas redondas para os destaques do perfil.' },
  { id:'c11', grupo:'carrossel', nome:'Linha do tempo', desc:'Etapas com datas numa linha vertical.' },
  { id:'c12', grupo:'carrossel', nome:'Quiz', desc:'Pergunta com 3 opções e a resposta no slide seguinte.' },
  { id:'c13', grupo:'carrossel', nome:'Números que importam', desc:'Um número grande por slide, com a explicação.' },
  { id:'c14', grupo:'carrossel', nome:'Prazos', desc:'Os prazos da área para salvar e anotar.' },
  { id:'c15', grupo:'carrossel', nome:'Pode ou não pode', desc:'Carimbo PODE ou NÃO PODE em cada situação.' },
  { id:'c16', grupo:'carrossel', nome:'Sobre mim', desc:'Apresentação em 3 fatos e convite.' },
  { id:'t4', grupo:'unica', nome:'Artigo de lei', desc:'O artigo em destaque e o que ele quer dizer.' },
  { id:'t5', grupo:'unica', nome:'Pergunta para comentar', desc:'Uma pergunta grande que puxa comentários.' },
  { id:'t6', grupo:'unica', nome:'Aviso', desc:'Recesso, feriado ou comunicado do escritório.' },
  { id:'s4', grupo:'stories', nome:'Contagem regressiva', desc:'Número grande para live ou lançamento.' },
  { id:'s5', grupo:'stories', nome:'Caixinha de perguntas', desc:'Espaço para a figurinha de perguntas.' },
  { id:'s6', grupo:'stories', nome:'Rotina', desc:'Horário em destaque e título do dia.' },
  { id:'e4', grupo:'extras', nome:'Notícia recortada', desc:'Manchete como recorte de jornal.' },
  { id:'e5', grupo:'extras', nome:'Meme jurídico', desc:'Dois quadros: a situação e a sua reação.' },
  { id:'e1', grupo:'extras', nome:'Capa de reels', desc:'Título na área segura e espaço para o seu rosto.' },
  { id:'e2', grupo:'extras', nome:'Post de texto', desc:'No formato de um post de rede social.' },
  { id:'e3', grupo:'extras', nome:'Número gigante', desc:'Um número que prende a atenção e a explicação.' }
];

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const marca = s => esc(s).replace(/\*(.+?)\*/g, '<span class="hl">$1</span>').replace(/\n/g, '<br>');
const ICON = { user:'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', q:'M9 9a3 3 0 1 1 4 2.8c-.7.3-1 .9-1 1.7V15 M12 18h.01 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0', heart:'M12 21s-8-5-8-11a5 5 0 0 1 8-3 5 5 0 0 1 8 3c0 6-8 11-8 11z', bag:'M5 8h14l-1 13H6z M9 8V6a3 3 0 0 1 6 0v2', cam:'M3 7h4l2-3h6l2 3h4v13H3z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', doc:'M5 2h9l5 5v15H5z M14 2v6h5 M8 13h8 M8 17h8', x:'M6 6l12 12 M6 18L18 6', ok:'M5 12l4 4L19 6', play:'M8 5l11 7-11 7z', chat:'M3 4h18v13H8l-5 4z' };
const ic = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${ICON[n] || ICON.doc}"/></svg>`;

function vars(idt) {
  const c = idt.c, f = idt.f;
  return `--bg:${c.bg};--sf:${c.sf};--ink:${c.ink};--mu:${c.mu};--ac:${c.ac};--ac2:${c.ac2};--on:${c.on};--cbg:${c.cbg};--cink:${c.cink};--ft:${f.t};--fb:${f.b};--tw:${f.tw};--tt:${f.tt};--tl:${f.tl};--lh:${f.lh};--k:${f.k};--rad:${idt.rad}px;--fi:${f.it ? 'italic' : 'normal'}`;
}
// Gera os slides de um modelo. ctx: { idt, d (conteúdo), edit (bool), handle }
function slides(tid, ctx) {
  const { idt, d, edit, handle } = ctx, out = [];
  const E = (k, v, cls, tag = 'div') => `<${tag} class="${cls}"${edit ? ` contenteditable="true" spellcheck="false" data-k="${k}"` : ''}>${marca(v)}</${tag}>`;
  const base = (tipo, corpo, extra = '') => `<div class="mx k-${idt.motivo} hl-${idt.hl} ${tipo} ${extra}" style="${vars(idt)}">${corpo}</div>`;
  const topo = (escuro) => `<div class="mx-top"><span>${esc(handle)}</span>${E('tag', d.tag || d.area, 'mx-tag', 'span')}</div>`;
  const rod = (i, n) => `<div class="mx-foot"><span>${String(i).padStart(2, '0')} / ${String(n).padStart(2, '0')}</span>${i < n ? '<span class="mx-seta">→</span>' : ''}</div>`;
  const it = d.itens || [];
  const capa = n => base('feed mx-c', `${topo()}<div class="mx-capa">${E('titulo', d.titulo, 'mx-t xl')}${d.sub ? E('sub', d.sub, 'mx-sub') : ''}</div><div class="mx-foot"><span>${esc(ctx.nome || '')}</span><span class="mx-arrasta">Arrasta →</span></div><span class="mx-deco"></span>`);
  const fim = n => base('feed mx-c mx-f', `${topo()}<div class="mx-capa">${E('fim.titulo', d.fim.titulo, 'mx-t l')}${E('fim.sub', d.fim.sub, 'mx-sub')}<div class="mx-acoes"><span>${ic('ok')}Salvar</span><span>${ic('chat')}Comentar</span><span>${ic('play')}Compartilhar</span></div></div>${rod(n, n)}<span class="mx-deco"></span>`);
  const meio = (i, n, corpo, extra = '') => base('feed mx-m', `${topo()}${corpo}${rod(i, n)}`, extra);
  if (tid === 'c1') { const n = it.length + 3; out.push(capa(n)); it.forEach((x, j) => out.push(meio(j + 2, n, `<div class="mx-num">${String(j + 1).padStart(2, '0')}</div><div class="mx-bloco">${E(`itens.${j}.t`, x.t, 'mx-t m')}${E(`itens.${j}.d`, x.d, 'mx-p')}</div>`)));
    out.push(meio(n - 1, n, `<div class="mx-bloco">${`<div class="mx-t m">Resumo</div>`}<ul class="mx-lista">${it.map((x, j) => `<li>${ic('ok')}${E(`itens.${j}.t`, x.t, '', 'span')}</li>`).join('')}</ul></div>`)); out.push(fim(n)) }
  if (tid === 'c2') { const n = it.length + 2; out.push(capa(n)); it.forEach((x, j) => out.push(meio(j + 2, n, `<div class="mx-bloco">${E(`itens.${j}.t`, '“' + x.t.replace(/^“|”$/g, '') + '”', 'mx-t m aspas')}<div class="mx-carimbo ${x.v === 'MITO' ? 'mito' : 'verdade'}">${E(`itens.${j}.v`, x.v, '', 'span')}</div>${E(`itens.${j}.d`, x.d, 'mx-p cardp')}</div>`))); out.push(fim(n)) }
  if (tid === 'c3') { const n = it.length + 2; out.push(capa(n)); it.forEach((x, j) => out.push(meio(j + 2, n, `<div class="mx-passo"><small>PASSO</small><b>${j + 1}</b></div><div class="mx-bloco baixo">${E(`itens.${j}.t`, x.t, 'mx-t m')}${E(`itens.${j}.d`, x.d, 'mx-p')}<div class="mx-prog">${it.map((_, k) => `<i class="${k <= j ? 'on' : ''}"></i>`).join('')}</div></div>`))); out.push(fim(n)) }
  if (tid === 'c4') { const n = it.length + 2; out.push(capa(n)); it.forEach((x, j) => out.push(meio(j + 2, n, `<div class="mx-bloco"><div class="mx-erro"><span class="mx-x">${ic('x')}</span><div><small>ERRO ${j + 1}</small>${E(`itens.${j}.t`, x.t, 'mx-t m')}</div></div><div class="mx-certo"><span class="mx-v">${ic('ok')}</span><div><small>FAÇA ASSIM</small>${E(`itens.${j}.d`, x.d, 'mx-p')}</div></div></div>`))); out.push(fim(n)) }
  if (tid === 'c5') { const g = [it.slice(0, 3), it.slice(3)].filter(z => z.length), n = g.length + 3; out.push(capa(n));
    g.forEach((gr, gi) => out.push(meio(gi + 2, n, `<div class="mx-bloco">${gi === 0 ? '<div class="mx-t m">Separe:</div>' : '<div class="mx-t m">E também:</div>'}<ul class="mx-check">${gr.map((x, k) => { const j = gi * 3 + k; return `<li><span class="mx-box">${ic('ok')}</span>${E(`itens.${j}.t`, x.t, '', 'span')}</li>` }).join('')}</ul></div>`)));
    out.push(meio(n - 1, n, `<div class="mx-bloco"><div class="mx-selo">DICA</div>${E('dica', d.dica, 'mx-t m')}</div>`)); out.push(fim(n)) }
  if (tid === 'c6') { const n = it.length + 2; out.push(capa(n)); it.forEach((x, j) => out.push(meio(j + 2, n, `<div class="mx-bloco"><div class="mx-balao">${E(`itens.${j}.t`, x.t, 'mx-t s')}</div><div class="mx-resp"><small>RESPOSTA</small>${E(`itens.${j}.d`, x.d, 'mx-p g')}</div></div>`))); out.push(fim(n)) }
  if (tid === 'c7') { const n = it.length + 3; out.push(capa(n)); it.forEach((x, j) => out.push(meio(j + 2, n, `<div class="mx-cap">CAPÍTULO ${j + 1}</div><div class="mx-bloco baixo">${E(`itens.${j}.t`, x.t, 'mx-t l')}${E(`itens.${j}.d`, x.d, 'mx-p g')}</div>`)));
    out.push(meio(n - 1, n, `<div class="mx-bloco"><div class="mx-selo">ATENÇÃO</div>${E('aviso', d.aviso, 'mx-t m')}</div>`)); out.push(fim(n)) }
  if (tid === 'c8') { const n = it.length + 2;
    out.push(base('feed mx-c noticia', `${topo()}<div class="mx-capa">${E('kicker', d.kicker || 'Entenda', 'mx-kicker', 'span')}${E('titulo', d.titulo, 'mx-t xl')}${E('sub', d.sub, 'mx-sub')}</div><div class="mx-foot"><span>${esc(ctx.nome || '')}</span><span class="mx-arrasta">Arrasta →</span></div><span class="mx-deco"></span>`));
    it.forEach((x, j) => out.push(meio(j + 2, n, `<div class="mx-bloco"><div class="mx-sec">${E(`itens.${j}.t`, x.t, '', 'span')}</div>${E(`itens.${j}.d`, x.d, 'mx-t m')}${j === it.length - 1 && d.fonte ? E('fonte', d.fonte, 'mx-fonte') : ''}</div>`))); out.push(fim(n)) }
  if (tid === 'c9') { const n = it.length + 2;
    out.push(base('feed mx-c', `${topo()}<div class="mx-capa vs">${E('a', d.a, 'mx-t l lado')}<span class="mx-vs">x</span>${E('b', d.b, 'mx-t l lado')}${E('sub', d.sub, 'mx-sub')}</div><div class="mx-foot"><span>${esc(ctx.nome || '')}</span><span class="mx-arrasta">Arrasta →</span></div><span class="mx-deco"></span>`));
    it.forEach((x, j) => out.push(meio(j + 2, n, `<div class="mx-bloco">${E(`itens.${j}.t`, x.t, 'mx-sec', 'div')}<div class="mx-cols"><div><small>${esc(d.a)}</small>${E(`itens.${j}.a`, x.a, 'mx-p g')}</div><div><small>${esc(d.b)}</small>${E(`itens.${j}.b`, x.b, 'mx-p g')}</div></div></div>`))); out.push(fim(n)) }
  if (tid === 'c10') { const n = it.length + 2; out.push(capa(n)); it.forEach((x, j) => out.push(meio(j + 2, n, `<div class="mx-bloco"><small class="mx-mini">substantivo jurídico</small>${E(`itens.${j}.t`, x.t, 'mx-t xl')}<div class="mx-fio"></div>${E(`itens.${j}.d`, x.d, 'mx-p g')}</div>`))); out.push(fim(n)) }
  if (tid === 't1') out.push(base('feed mx-c frase', `${topo()}<div class="mx-capa"><span class="mx-aspas">“</span>${E('titulo', d.titulo, 'mx-t l')}<div class="mx-ass">${esc(handle)}</div></div><span class="mx-deco"></span>`));
  if (tid === 't2') out.push(base('feed mx-m', `${topo()}<div class="mx-nota"><div class="mx-nota-top"><span class="mx-selo">${E('tag', d.tag, '', 'span')}</span><span>${ic('ok')}</span></div>${E('titulo', d.titulo, 'mx-t m')}${E('sub', d.sub, 'mx-p')}</div><div class="mx-foot"><span>${esc(handle)}</span><span>Salve ✓</span></div>`));
  if (tid === 't3') out.push(base('feed mx-c data', `${topo()}<div class="mx-capa"><div class="mx-dia">${E('dia', d.dia, '', 'b')}${E('mes', d.mes, '', 'small')}</div>${E('titulo', d.titulo, 'mx-t xl')}${E('sub', d.sub, 'mx-sub')}</div><span class="mx-deco"></span>`));
  if (tid === 's1') out.push(base('story mx-c', `${topo()}<div class="mx-capa">${E('titulo', d.titulo, 'mx-t xl')}</div>${E('sub', d.sub, 'mx-toque')}<span class="mx-deco"></span>`));
  if (tid === 's2') out.push(base('story mx-m', `${topo()}<div class="mx-capa">${E('titulo', d.titulo, 'mx-t xl')}<div class="mx-enquete"><span>${E('a', d.a, '', 'b')}</span><span>${E('b', d.b, '', 'b')}</span></div>${E('sub', d.sub, 'mx-p')}</div>`));
  if (tid === 's3') d.itens.forEach((x, j) => out.push(base('quad mx-c', `<div class="mx-dest"><span>${ic(x.i)}</span>${E(`itens.${j}.t`, x.t, '', 'b')}</div><span class="mx-deco"></span>`)));
  if (tid === 'e1') out.push(base('story mx-c reel', `${topo()}<div class="mx-rosto"><span>sua foto ou vídeo aqui</span></div><div class="mx-capa">${E('titulo', d.titulo, 'mx-t xl')}</div><span class="mx-reel">${ic('play')}REELS</span>`));
  if (tid === 'e2') out.push(base('feed mx-m post-texto', `<div class="mx-tw"><div class="mx-tw-top"><span class="mx-tw-av">${esc((handle || '@').replace('@', '')[0] || 'A').toUpperCase()}</span><div><b>${esc(ctx.nome || 'Seu nome')}</b><small>${esc(handle)}</small></div></div>${E('titulo', d.titulo, 'mx-tw-t')}<div class="mx-tw-f"><span>${ic('chat')} 128</span><span>${ic('play')} 342</span><span>${ic('heart')} 2,1 mil</span></div></div>`));
  if (tid === 'e3') out.push(base('feed mx-c numero', `${topo()}<div class="mx-capa"><div class="mx-big">${E('num', d.num, '', 'b')}${E('un', d.un, '', 'small')}</div>${E('titulo', d.titulo, 'mx-t l')}${E('sub', d.sub, 'mx-sub')}</div><span class="mx-deco"></span>`));
  if (tid === 'c11') { const n = 3; out.push(capa(n)); out.push(meio(2, n, `<div class="mx-bloco"><div class="mx-t m">Passo a passo no tempo</div><ol class="mx-tl">${it.map((x, j) => `<li><b>${E(`itens.${j}.t`, x.t, '', 'span')}</b>${E(`itens.${j}.d`, x.d, 'mx-p', 'span')}</li>`).join('')}</ol></div>`)); out.push(fim(n)) }
  if (tid === 'c12') { const n = it.length * 2 + 2; out.push(capa(n)); it.forEach((x, j) => { out.push(meio(2 + j * 2, n, `<div class="mx-bloco"><small class="mx-mini">Pergunta ${j + 1}</small>${E(`itens.${j}.t`, x.t, 'mx-t m')}<div class="mx-ops">${['a', 'b', 'c'].map(o => `<div class="mx-op"><i>${o.toUpperCase()}</i>${E(`itens.${j}.${o}`, x[o], '', 'span')}</div>`).join('')}</div><small class="mx-mini">Responda e passe →</small></div>`));
    out.push(meio(3 + j * 2, n, `<div class="mx-bloco"><div class="mx-selo">RESPOSTA ${String(x.v).toUpperCase()}</div>${E(`itens.${j}.${x.v}`, x[x.v], 'mx-t l')}${E(`itens.${j}.d`, x.d, 'mx-p g')}</div>`)) }); out.push(fim(n)) }
  if (tid === 'c13' || tid === 'c14') { const n = it.length + 2; out.push(capa(n)); it.forEach((x, j) => out.push(meio(j + 2, n, `<div class="mx-bloco"><div class="mx-big">${E(`itens.${j}.num`, x.num, '', 'b')}${E(`itens.${j}.un`, x.un, '', 'small')}</div>${E(`itens.${j}.t`, x.t, 'mx-t m')}${j === it.length - 1 && d.fonte ? E('fonte', d.fonte, 'mx-fonte') : ''}</div>`))); out.push(fim(n)) }
  if (tid === 'c15') { const n = it.length + 2; out.push(capa(n)); it.forEach((x, j) => out.push(meio(j + 2, n, `<div class="mx-bloco">${E(`itens.${j}.t`, x.t, 'mx-t m')}<div class="mx-carimbo ${/NÃO/.test(x.v) ? 'mito' : 'verdade'}">${E(`itens.${j}.v`, x.v, '', 'span')}</div>${E(`itens.${j}.d`, x.d, 'mx-p cardp')}</div>`))); out.push(fim(n)) }
  if (tid === 'c16') { const n = it.length + 2; out.push(capa(n)); it.forEach((x, j) => out.push(meio(j + 2, n, `<div class="mx-cap">${String(j + 1).padStart(2, '0')} · SOBRE MIM</div><div class="mx-bloco baixo">${E(`itens.${j}.t`, x.t, 'mx-t l')}${E(`itens.${j}.d`, x.d, 'mx-p g')}</div>`))); out.push(fim(n)) }
  if (tid === 't4') out.push(base('feed mx-m', `${topo()}<div class="mx-bloco"><div class="mx-artigo">${E('art', d.art, '', 'b')}${E('lei', d.lei, '', 'small')}</div>${E('titulo', d.titulo, 'mx-t s aspas')}<div class="mx-fio"></div>${E('sub', d.sub, 'mx-p g')}</div><div class="mx-foot"><span>${esc(handle)}</span><span>Salve ✓</span></div>`));
  if (tid === 't5') out.push(base('feed mx-c frase', `${topo()}<div class="mx-capa">${E('titulo', d.titulo, 'mx-t xl')}${E('sub', d.sub, 'mx-sub')}<div class="mx-coment">${ic('chat')}<span>Comente aqui embaixo</span></div></div><span class="mx-deco"></span>`));
  if (tid === 't6') out.push(base('feed mx-c', `${topo()}<div class="mx-capa"><div class="mx-selo">${E('tag', d.tag, '', 'span')}</div>${E('titulo', d.titulo, 'mx-t xl')}${E('sub', d.sub, 'mx-sub')}</div><div class="mx-foot"><span>${esc(ctx.nome || '')}</span><span>${esc(handle)}</span></div><span class="mx-deco"></span>`));
  if (tid === 's4') out.push(base('story mx-c', `${topo()}<div class="mx-capa"><small class="mx-mini">Faltam</small><div class="mx-big">${E('num', d.num, '', 'b')}${E('un', d.un, '', 'small')}</div>${E('titulo', d.titulo, 'mx-t l')}</div>${E('sub', d.sub, 'mx-toque')}<span class="mx-deco"></span>`));
  if (tid === 's5') out.push(base('story mx-c', `${topo()}<div class="mx-capa"><div class="mx-cx"><div class="mx-cx-h">${E('titulo', d.titulo, 'mx-t m')}</div>${E('caixa', d.caixa, 'mx-cx-in')}</div></div>${E('sub', d.sub, 'mx-toque')}<span class="mx-deco"></span>`));
  if (tid === 's6') out.push(base('story mx-c', `${topo()}<div class="mx-capa"><div class="mx-hora">${E('hora', d.hora, '', 'b')}</div>${E('titulo', d.titulo, 'mx-t xl')}${E('sub', d.sub, 'mx-sub')}</div><span class="mx-deco"></span>`));
  if (tid === 'e4') out.push(base('feed mx-m', `${topo()}<div class="mx-recorte"><div class="mx-rec-top">${E('jornal', d.jornal, '', 'b')}<span>${new Date().toLocaleDateString('pt-BR')}</span></div>${E('titulo', d.titulo, 'mx-t m')}<div class="mx-linhas">${'<i></i>'.repeat(5)}</div></div>${E('sub', d.sub, 'mx-p g')}<div class="mx-foot"><span>${esc(handle)}</span><span class="mx-seta">→</span></div>`));
  if (tid === 'e5') out.push(base('feed mx-m', `${topo()}<div class="mx-meme"><div>${E('a', d.a, 'mx-p g')}</div><div class="esc">${E('b', d.b, 'mx-p g')}<span class="mx-livros">${'<i></i>'.repeat(3)}</span></div></div>${E('titulo', d.titulo, 'mx-t m')}<div class="mx-foot"><span>${esc(handle)}</span><span>${esc(ctx.nome || '')}</span></div>`));
  return out;
}
const FONTES_URL = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Inter:wght@400;600;800&family=Fraunces:ital,wght@0,900;1,900&family=IBM+Plex+Sans:wght@400;600&family=Inter+Tight:wght@500;800&family=Archivo+Black&family=Archivo:wght@400;700&family=Caveat:wght@700&family=Nunito:wght@500;800&family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;700&family=Bricolage+Grotesque:wght@500;800&family=Anton&family=IBM+Plex+Mono:wght@500;700&family=Cormorant+Garamond:ital,wght@0,700;1,700&family=Plus+Jakarta+Sans:wght@500;800&family=Bodoni+Moda:ital,wght@0,700;1,700&family=Jost:wght@400;600&family=Rubik:wght@500;800&family=Sora:wght@400;700&family=Outfit:wght@400;700&family=Work+Sans:wght@400;700&display=swap';
return { IDT, PACKS, TPL, slides, FONTES_URL };
})();

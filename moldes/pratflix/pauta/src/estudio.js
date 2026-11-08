// Pauta · Coleção Editorial: 14 identidades no estilo dos estúdios de design de post (colagem, papel, foto,
// fonte manuscrita, texto miúdo de textura) e 14 modelos com sua foto. Slides 540×675 (feed) e 540×960 (stories).
// Texto: *palavra* = destaque da identidade (manuscrita, itálico, cor ou caixa); _trecho_ = negrito.
window.ESTUDIO = (() => {
const IDT = [
  { id:'vinho', nome:'Vinho & Céu', desc:'Vinho, creme, azul-bebê e rosa; serifa estreita com palavra manuscrita.', ideal:['familia','sucessoes','carreira'],
    c:{ cl:'#EEE7DE', es:'#5B1631', ink:'#4A1129', on:'#F7EFE7', ac:'#D9739A', ac2:'#93B4DA', ac3:'#F2D5DE', pa:'#F6F0E7', aon:'#4A1129', hcl:'#D9739A', hce:'#F2A9C3', hca:'#4A1129' },
    f:{ d:"'Instrument Serif', Georgia, serif", dw:400, dl:'-.045em', dlh:.88, dt:'none', s:"'Yellowtail', cursive", sk:1.3, b:"'Inter Tight', Arial, sans-serif", n:"'Nothing You Could Do', cursive" }, hl:'script', tex:'grao' },
  { id:'serie', nome:'Verde Série', desc:'Verde-escuro e bege, sem serifa pesada com itálico fino: cultura pop e séries.', ideal:['familia','criminal','civel'],
    c:{ cl:'#E6E1D5', es:'#1F4A3B', ink:'#1F4A3B', on:'#F2EEE5', ac:'#A9BCA5', ac2:'#2E6B55', ac3:'#D5DDD0', pa:'#F1EDE4', aon:'#1F4A3B', hcl:'#2E6B55', hce:'#C9D8C3', hca:'#1F4A3B' },
    f:{ d:"'Inter Tight', Arial, sans-serif", dw:800, dl:'-.06em', dlh:.9, dt:'none', s:"'Instrument Serif', Georgia, serif", sk:1.08, it:true, b:"'Inter Tight', Arial, sans-serif", n:"'Nothing You Could Do', cursive" }, hl:'italico', tex:'grao' },
  { id:'magenta', nome:'Magenta Real', desc:'Magenta, azul-royal e creme, com manuscrita amanteigada: ousado e chique.', ideal:['empresarial','consumidor','carreira'],
    c:{ cl:'#F3EEE6', es:'#2B3A9F', ink:'#1C1C1C', on:'#FFFFFF', ac:'#D6336F', ac2:'#EAD58A', ac3:'#F6C9D9', pa:'#FBF7F0', aon:'#FFFFFF', hcl:'#D6336F', hce:'#EAD58A', hca:'#EAD58A' },
    f:{ d:"'Playfair Display', Georgia, serif", dw:600, dl:'-.045em', dlh:.9, dt:'none', s:"'Yellowtail', cursive", sk:1.3, b:"'Inter Tight', Arial, sans-serif", n:"'Nothing You Could Do', cursive" }, hl:'script', tex:'grao' },
  { id:'oliva', nome:'Oliva Botânica', desc:'Verde-oliva, laranja e amarelo, com folhas: acolhedor e atual.', ideal:['saude','previdenciario','familia'],
    c:{ cl:'#EEEAE0', es:'#4B5D35', ink:'#2E3A20', on:'#F4F0E6', ac:'#D5642C', ac2:'#E9D36C', ac3:'#C4CFAE', pa:'#F7F4EC', aon:'#FFFFFF', hcl:'#D5642C', hce:'#E9D36C', hca:'#2E3A20' },
    f:{ d:"'Hanken Grotesk', Arial, sans-serif", dw:800, dl:'-.055em', dlh:.9, dt:'none', s:"'Instrument Serif', Georgia, serif", sk:1.1, it:true, b:"'Hanken Grotesk', Arial, sans-serif", n:"'Nothing You Could Do', cursive" }, hl:'cor', tex:'grao' },
  { id:'tijolo', nome:'Tijolo Cinema', desc:'Vermelho-tijolo, marrom e azul-claro, com cara de cartaz de filme.', ideal:['empresarial','consumidor','trabalho'],
    c:{ cl:'#F0E8DA', es:'#9C2E22', ink:'#3E1D16', on:'#F7EFE3', ac:'#A8CEE0', ac2:'#4A231B', ac3:'#E9B8A8', pa:'#F7F1E6', aon:'#3E1D16', hcl:'#9C2E22', hce:'#A8CEE0', hca:'#9C2E22' },
    f:{ d:"'Gloock', Georgia, serif", dw:400, dl:'-.035em', dlh:.92, dt:'none', s:"'Instrument Serif', Georgia, serif", sk:1.08, it:true, b:"'Inter Tight', Arial, sans-serif", n:"'Nothing You Could Do', cursive" }, hl:'cor', tex:'grao' },
  { id:'cafe', nome:'Café Deco', desc:'Marrom, laranja queimado e creme, títulos em caixa alta: forte para Previdenciário.', ideal:['previdenciario','trabalho','bancario'],
    c:{ cl:'#E8E2D8', es:'#3A2A22', ink:'#2E2019', on:'#F1EAE0', ac:'#C86B3C', ac2:'#E9B98F', ac3:'#D7C9B8', pa:'#F2ECE3', aon:'#FFFFFF', hcl:'#C86B3C', hce:'#E39565', hca:'#2E2019' },
    f:{ d:"'Gloock', Georgia, serif", dw:400, dl:'-.04em', dlh:.86, dt:'uppercase', s:"'Instrument Serif', Georgia, serif", sk:1.1, it:true, b:"'Inter Tight', Arial, sans-serif", n:"'Homemade Apple', cursive" }, hl:'cor', tex:'papel' },
  { id:'ferrugem', nome:'Ferrugem & Sálvia', desc:'Ferrugem, verde-sálvia e osso, com ramos e manuscrita delicada.', ideal:['saude','familia','previdenciario'],
    c:{ cl:'#E3E1D6', es:'#8D3B23', ink:'#3B2A1F', on:'#F5EFE6', ac:'#7F8C6E', ac2:'#C9A27E', ac3:'#B5BEA3', pa:'#EFEDE4', aon:'#FFFFFF', hcl:'#8D3B23', hce:'#F2E4D0', hca:'#F5EFE6' },
    f:{ d:"'Inter Tight', Arial, sans-serif", dw:400, dl:'-.055em', dlh:.92, dt:'none', s:"'Mrs Saint Delafield', cursive", sk:1.55, b:"'Inter Tight', Arial, sans-serif", n:"'Nothing You Could Do', cursive" }, hl:'script', tex:'grao' },
  { id:'uva', nome:'Uva Pop', desc:'Roxo e rosa, letras gordas e coladas, adesivos: didático e divertido.', ideal:['consumidor','digital','saude'],
    c:{ cl:'#ECE5EA', es:'#571B5C', ink:'#3C0F40', on:'#FFFFFF', ac:'#C2479F', ac2:'#FF8DC2', ac3:'#F5D0E6', pa:'#F7F2F5', aon:'#FFFFFF', hcl:'#C2479F', hce:'#FF8DC2', hca:'#3C0F40' },
    f:{ d:"'Rubik', Arial, sans-serif", dw:800, dl:'-.065em', dlh:.84, dt:'none', s:"'Rubik', Arial, sans-serif", sk:1, b:"'Rubik', Arial, sans-serif", n:"'Nothing You Could Do', cursive" }, hl:'cor', tex:'grao' },
  { id:'bordo', nome:'Bordô Pincel', desc:'Bordô e creme-amarelo, com manuscrita de pincel: intenso e marcante.', ideal:['criminal','familia','carreira'],
    c:{ cl:'#EFE6D8', es:'#5C1A26', ink:'#3A1018', on:'#FFFFFF', ac:'#EBDDA0', ac2:'#9E3B4C', ac3:'#2A1A1A', pa:'#F6EFE2', aon:'#3A1018', hcl:'#9E3B4C', hce:'#EBDDA0', hca:'#5C1A26' },
    f:{ d:"'Inter Tight', Arial, sans-serif", dw:800, dl:'-.06em', dlh:.9, dt:'none', s:"'Mr Dafoe', cursive", sk:1.4, b:"'Inter Tight', Arial, sans-serif", n:"'Nothing You Could Do', cursive" }, hl:'script', tex:'grao' },
  { id:'zine', nome:'Zine Rosa', desc:'Papel, preto, rosa e azul, com faixas atrás das palavras e estrelas: criativo.', ideal:['digital','consumidor','carreira'],
    c:{ cl:'#F1EDE7', es:'#17171A', ink:'#17171A', on:'#FFFFFF', ac:'#F4C3D0', ac2:'#A8CDEE', ac3:'#C9C9CE', pa:'#FBF9F5', aon:'#17171A', hcl:'#17171A', hce:'#F4C3D0', hca:'#17171A' },
    f:{ d:"'Inter Tight', Arial, sans-serif", dw:700, dl:'-.06em', dlh:.88, dt:'none', s:"'Mr Dafoe', cursive", sk:1.3, b:"'Inter Tight', Arial, sans-serif", n:"'Nothing You Could Do', cursive" }, hl:'caixa', tex:'papel' },
  { id:'noir', nome:'Noir Editorial', desc:'Preto, vinho e champanhe, serifa com itálico: o estilo dos escritórios no Behance.', ideal:['criminal','empresarial','imobiliario'],
    c:{ cl:'#ECE5DC', es:'#151113', ink:'#1A1416', on:'#F3ECE4', ac:'#8E1F2F', ac2:'#C9B79C', ac3:'#D9CDBE', pa:'#F4EEE6', aon:'#F3ECE4', hcl:'#8E1F2F', hce:'#C9B79C', hca:'#F3ECE4' },
    f:{ d:"'Instrument Serif', Georgia, serif", dw:400, dl:'-.035em', dlh:.92, dt:'none', s:"'Instrument Serif', Georgia, serif", sk:1.05, it:true, b:"'Inter Tight', Arial, sans-serif", n:"'Nothing You Could Do', cursive" }, hl:'italico', tex:'grao' },
  { id:'eletrico', nome:'Azul Elétrico', desc:'Azul-royal em degradê e branco, molduras de post: tecnologia e empresas.', ideal:['tributario','empresarial','digital'],
    c:{ cl:'#EEF1F8', es:'#1534D8', ink:'#0B1236', on:'#FFFFFF', ac:'#9FB4FF', ac2:'#FFD84D', ac3:'#DCE4FF', pa:'#FFFFFF', aon:'#0B1236', hcl:'#1534D8', hce:'#FFD84D', hca:'#1534D8' },
    f:{ d:"'Inter Tight', Arial, sans-serif", dw:800, dl:'-.045em', dlh:.92, dt:'uppercase', s:"'Instrument Serif', Georgia, serif", sk:1.12, it:true, b:"'Inter Tight', Arial, sans-serif", n:"'Nothing You Could Do', cursive" }, hl:'italico', tex:'grade' },
  { id:'areia', nome:'Areia & Grafite', desc:'Areia, grafite e caramelo, serifa clássica com caligrafia: sóbrio sem ser frio.', ideal:['sucessoes','imobiliario','extrajudicial'],
    c:{ cl:'#E8E0D3', es:'#262321', ink:'#262321', on:'#EFE8DD', ac:'#B08A63', ac2:'#D9CBB6', ac3:'#7A6A5B', pa:'#F3EEE6', aon:'#FFFFFF', hcl:'#9A7550', hce:'#D3B48F', hca:'#262321' },
    f:{ d:"'Cormorant Garamond', Georgia, serif", dw:600, dl:'-.03em', dlh:.88, dt:'none', s:"'Pinyon Script', cursive", sk:1.25, b:"'Inter Tight', Arial, sans-serif", n:"'Homemade Apple', cursive" }, hl:'script', tex:'papel' },
  { id:'nativa', nome:'Foto Nativa', desc:'Sua foto ocupa tudo, com o texto no estilo do próprio Instagram.', ideal:['consumidor','familia','carreira'],
    c:{ cl:'#F4ECE6', es:'#5E3F4A', ink:'#3D2830', on:'#FFFFFF', ac:'#E9A3A8', ac2:'#F6E7A6', ac3:'#E7D6D0', pa:'#FFFFFF', aon:'#3D2830', hcl:'#C86F78', hce:'#F6E7A6', hca:'#3D2830' },
    f:{ d:"'Lato', Arial, sans-serif", dw:900, dl:'-.03em', dlh:.95, dt:'none', s:"'Lobster', cursive", sk:1.35, b:"'Lato', Arial, sans-serif", n:"'Nothing You Could Do', cursive" }, hl:'script', tex:'liso' }
];

// Conteúdo de exemplo. Cada slide: t = tipo, v = variação, tom = cl (claro) | es (escuro) | ac (cor de destaque).
const PACKS = {
  ea1:{ area:'Apresentação', s:[
    { t:'capa', v:'foto', tom:'cl', pill:'Antes de qualquer processo, existe uma', titulo:'História', nota:'Um pouco sobre quem sou e como eu trabalho', foto:'f1' },
    { t:'texto', tom:'es', lead:'Quem chega até o escritório _nem sempre sabe_ exatamente _o que precisa fazer._', titulo:'E tudo bem. *Caminhos* existem para o seu caso.', nota:'Às vezes chega uma dúvida. Às vezes, uma preocupação.' },
    { t:'caminho', tom:'cl', lead:'Por isso, _todo atendimento_ segue a mesma ordem:', titulo:'Primeiro eu escuto. Depois a gente traça o *caminho*', passos:['ouvir', 'entender', 'analisar', 'orientar', 'agir', 'acompanhar'], rodape:'Uma boa decisão começa por uma boa conversa.' },
    { t:'pergunta', tom:'es', titulo:'Por que eu *escolhi* esta área?', bolha:'E aí?', texto:'Porque eu vi de perto como _uma informação na hora certa_ muda a vida de uma família inteira.', faixa:'Informação clara é a primeira forma de proteção.', foto:'f3' },
    { t:'cta', tom:'cl', titulo:'Prazer, eu sou *você sabe quem*.', sub:'Salve este post e me conte nos comentários de onde você está me acompanhando.' }
  ] },
  ea2:{ area:'Previdenciário', s:[
    { t:'capa', v:'manchete', tom:'cl', tag:'Finalmente cheguei na', titulo:'idade para me\n*aposentar*', pill:'Agora é só fazer o pedido, certo?', foto:'f2' },
    { t:'capa', v:'papel', tom:'ac', titulo:'Tudo parece certo até o momento em que o INSS diz', script:'não.', assin:'Por isso, vale investigar antes.' },
    { t:'lista', tom:'cl', titulo:'Os motivos mais comuns da *negativa*', itens:['_CNIS_ com períodos faltando', 'Tempo _rural_ sem documento', '_PPP_ que nunca foi pedido à empresa', 'Contribuição _abaixo do mínimo_', 'Pedido feito _antes da hora_'], postit:'Um detalhe esquecido pode mudar o resultado.' },
    { t:'caminho', tom:'es', lead:'Antes de clicar em _pedir_ no Meu INSS:', titulo:'Faça o seu pedido percorrer um *caminho*', passos:['puxar o CNIS', 'conferir', 'juntar provas', 'simular', 'pedir', 'acompanhar'], rodape:'Pedido bem preparado é pedido que anda.' },
    { t:'cta', tom:'cl', titulo:'Salve antes de pedir a sua *aposentadoria*.', sub:'E mande para quem está chegando lá.' }
  ] },
  ea3:{ area:'Família', s:[
    { t:'capa', v:'cartaz', tom:'es', sobre:'Um drama brasileiro em quatro atos', titulo:'*Pensão*', linha:'Dirigido e escrito pelo Código Civil', creditos:'Estrelando: o filho que cresceu, o pai que perdeu o emprego, a mãe que paga tudo sozinha e a avó que achava que não tinha nada a ver com isso.', selo:'Classificação: recomendado para pais, mães e avós.' },
    { t:'passo', tom:'cl', n:'1', kicker:'Ato', titulo:'A pensão não acaba *aos 18*', texto:'O fim depende de decisão judicial (Súmula 358 do STJ). Quem está estudando pode continuar recebendo.' },
    { t:'passo', tom:'es', n:'2', kicker:'Ato', titulo:'Desemprego não *apaga* a dívida', texto:'O valor pode ser revisto, mas a obrigação continua. Quem paga deve pedir a revisão, não parar de pagar.' },
    { t:'passo', tom:'cl', n:'3', kicker:'Ato', titulo:'Três parcelas e a *prisão*', texto:'O atraso das três últimas parcelas permite a prisão civil (art. 528, § 7º, do CPC).' },
    { t:'passo', tom:'es', n:'4', kicker:'Ato', titulo:'Os avós podem *entrar* na história', texto:'Quando os pais não conseguem pagar, os avós podem ser chamados, de forma complementar.' },
    { t:'cta', tom:'cl', titulo:'Qual ato você *já viveu*?', sub:'Conte nos comentários e salve para lembrar.' }
  ] },
  ea4:{ area:'Consumidor', s:[
    { t:'capa', v:'nativa', tom:'es', titulo:'Explicando\n_o golpe do Pix_\ncomo se fosse uma\n*fofoca*', caixa:'Senta que lá vem história…', foto:'f1' },
    { t:'chat', tom:'cl', lead:'Começou com uma mensagem de um número _desconhecido_:', msgs:['Oi, mãe! Troquei de número.', 'Salva esse aí. O outro quebrou.', 'Consegue me fazer um Pix rapidinho? Te devolvo amanhã.'], titulo:'Parecia o filho. Era o *golpista*.' },
    { t:'lista', tom:'es', titulo:'Os sinais que *entregam* o golpe', itens:['_Número novo_ pedindo dinheiro', 'Pressa: “é _urgente_”', 'Chave Pix no nome de _outra pessoa_', 'Pedido de _segredo_'], postit:'Desconfie de toda pressa.' },
    { t:'texto', tom:'cl', lead:'E se já fez o Pix?', titulo:'Ligue para o banco e peça o *MED* na hora.', nota:'O Mecanismo Especial de Devolução existe para isso. Registre também o boletim de ocorrência e guarde os prints.' },
    { t:'cta', tom:'es', titulo:'Mande para quem *precisa* ver isso.', sub:'Golpe evitado é melhor que golpe resolvido.' }
  ] },
  ea5:{ area:'Trabalhista', s:[
    { t:'capa', v:'zine', tom:'cl', tag1:'Assédio moral', tag2:'no trabalho', titulo:'Você não está', baixo:'*exagerando.*', foto:'f2' },
    { t:'texto', tom:'es', lead:'Assédio moral não é _uma bronca_ num dia ruim.', titulo:'É a *repetição* que adoece.', nota:'Humilhações, isolamento e cobranças abusivas, de forma constante, por um tempo.' },
    { t:'lista', tom:'cl', titulo:'5 sinais para *não* ignorar', itens:['Apelidos e _humilhação_ em público', 'Metas _impossíveis_ só para você', 'Ser _isolado_ da equipe', 'Tarefas abaixo da sua _função_', 'Ameaças _veladas_ de demissão'], postit:'Anote datas, horários e quem viu.' },
    { t:'texto', tom:'ac', lead:'O que fazer agora?', titulo:'Guarde as *provas* antes de qualquer conversa.', nota:'Mensagens, e-mails, testemunhas e atestados. Depois, procure orientação.' },
    { t:'cta', tom:'es', titulo:'Mande para quem anda *calado* demais.', sub:'Às vezes a pessoa só precisa saber que não está sozinha.' }
  ] },
  ea6:{ area:'Bancário', s:[
    { t:'capa', v:'janela', tom:'es', lead:'Caiu num golpe e não sabe por onde começar?', titulo:'O que fazer nas primeiras *24 horas*' },
    { t:'passo', tom:'cl', n:'1', kicker:'Na primeira hora', titulo:'Ligue para o *banco*', texto:'Peça o bloqueio e a contestação. No Pix, peça o MED (Mecanismo Especial de Devolução).' },
    { t:'passo', tom:'es', n:'2', kicker:'No mesmo dia', titulo:'Faça o *boletim* de ocorrência', texto:'Dá para registrar pela internet na maioria dos estados. Leve o número do protocolo do banco.' },
    { t:'passo', tom:'cl', n:'3', kicker:'Antes de apagar', titulo:'Guarde todas as *provas*', texto:'Prints, comprovantes, número do golpista, horários. Não apague a conversa.' },
    { t:'texto', tom:'es', lead:'E a responsabilidade do banco?', titulo:'Fraude ligada ao serviço é *risco* do banco.', nota:'Súmula 479 do STJ. Cada caso depende de como o golpe aconteceu.' },
    { t:'cta', tom:'cl', titulo:'Salve: na hora do susto ninguém *lembra*.', sub:'Mande para os seus pais e avós.' }
  ] },
  ea7:{ area:'Sucessões', s:[
    { t:'capa', v:'caderno', tom:'ac', titulo:'Inventário é\ncomo uma\n*receita*', nota:'E toda família tem o seu modo de preparo', rodape:'Não adianta ter os ingredientes se ninguém sabe como combiná-los.', foto:'f3' },
    { t:'lista', tom:'cl', titulo:'Os *ingredientes*', itens:['Certidão de _óbito_', 'Documentos dos _herdeiros_', 'Documentos dos _bens_', 'Certidões _negativas_ de dívidas', 'Comprovante do _ITCMD_'], postit:'Separe tudo antes da primeira conversa.' },
    { t:'caminho', tom:'es', lead:'Com tudo em mãos, o _modo de preparo_:', titulo:'Do luto à escritura, um *caminho*', passos:['reunir', 'conferir', 'calcular', 'pagar ITCMD', 'assinar', 'registrar'], rodape:'Em cartório, quando todos concordam, é mais rápido.' },
    { t:'texto', tom:'cl', lead:'E o prazo?', titulo:'Dois meses para *abrir*. Depois, multa.', nota:'O inventário deve começar em até 2 meses do falecimento (art. 611 do CPC). Muitos estados cobram multa no ITCMD.' },
    { t:'cta', tom:'es', titulo:'Salve a *receita* e mande para a família.', sub:'Conversar antes evita brigar depois.' }
  ] },
  ea8:{ area:'Contratos', s:[
    { t:'capa', v:'papel', tom:'cl', titulo:'O seu contrato _não é apenas um papel_ que você assina e guarda na gaveta. É o que vai', script:'te proteger quando der errado.', assin:'Leia antes de assinar' },
    { t:'lista', tom:'es', titulo:'Confira *antes* de assinar', itens:['Quem são as _partes_', 'O que exatamente está sendo _entregue_', '_Prazos_ e o que acontece no atraso', '_Multa_ e como sair do contrato', 'Onde resolver um _conflito_'], postit:'Se não está escrito, é difícil provar.' },
    { t:'chat', tom:'cl', lead:'A frase mais cara do Brasil:', msgs:['Relaxa, a gente se conhece há anos.', 'Não precisa disso de contrato.', 'Depois a gente vê.'], titulo:'Amizade não substitui *cláusula*.' },
    { t:'cta', tom:'es', titulo:'Salve para o seu próximo *contrato*.', sub:'E mande para quem vai abrir um negócio.' }
  ] },
  eu1:{ area:'Prazos', s:[{ t:'capa', v:'papel', tom:'ac', titulo:'Prazos existem e _correm_ mesmo quando você não está olhando. O Direito não socorre os que', script:'dormem.', assin:'Brocardo jurídico' }] },
  eu2:{ area:'Criminal', s:[{ t:'capa', v:'pop', tom:'es', titulo:'Isso é\n*crime?*', selo:'explicando como se você tivesse 5 anos', baixo:'Gravar a conversa sem avisar', foto:'f1' }] },
  eu3:{ area:'Previdenciário', s:[{ t:'capa', v:'data', tom:'es', antes:'O que todo', titulo:'aposentado', dias:['23', '24', '25'], rotulo:'Dia Nacional do Aposentado', depois:'deveria *saber*', sub:'3 direitos que quase ninguém usa', foto:'f3' }] },
  es1:{ area:'Stories', s:[{ t:'story', v:'caixa', tom:'es', titulo:'Me pergunte sobre *pensão*', caixa:'Digite algo…', topo:'Caixinha aberta até as 20h', foto:'f1' }] },
  es2:{ area:'Stories', s:[{ t:'story', v:'quiz', tom:'cl', titulo:'Mito ou *verdade*?', pergunta:'Quem pede demissão perde o FGTS inteiro.', ops:['Mito', 'Verdade', 'Depende'], certa:'0', nota:'Responda e veja amanhã' }] },
  es3:{ area:'Stories', s:[{ t:'story', v:'bastidor', tom:'es', hora:'08:47', pre:'um dia no', titulo:'*escritório*', sub:'Tudo o que você não vê nos bastidores', foto:'f2' }] }
};

const TPL = [
  { id:'ea1', grupo:'carrossel', nome:'Apresentação', desc:'Sua história, com foto em arco e bilhete escrito à mão.' },
  { id:'ea2', grupo:'carrossel', nome:'Manchete com foto', desc:'Título em duas medidas, foto com borda de adesivo e etiquetas.' },
  { id:'ea3', grupo:'carrossel', nome:'Cartaz de filme', desc:'O tema como um filme: capa de cartaz e um ato por slide.' },
  { id:'ea4', grupo:'carrossel', nome:'Fofoca explicada', desc:'Foto inteira com texto nativo e conversa de celular.' },
  { id:'ea5', grupo:'carrossel', nome:'Zine', desc:'Faixas atrás das palavras, moldura oval e estrelas.' },
  { id:'ea6', grupo:'carrossel', nome:'Janela do navegador', desc:'Título dentro de uma janela, passos com número grande.' },
  { id:'ea7', grupo:'carrossel', nome:'Caderno de receitas', desc:'Fichário, polaroide e bilhete: metáfora que prende.' },
  { id:'ea8', grupo:'carrossel', nome:'Papel com clipe', desc:'Folha presa com clipe e frase que termina à mão.' },
  { id:'eu1', grupo:'unica', nome:'Frase no papel', desc:'Uma folha com clipe sobre o calendário.' },
  { id:'eu2', grupo:'unica', nome:'Pergunta pop', desc:'Letras gordas, adesivo e foto recortada.' },
  { id:'eu3', grupo:'unica', nome:'Data no calendário', desc:'Dia circulado, selo com foto e espiral.' },
  { id:'es1', grupo:'stories', nome:'Caixinha de perguntas', desc:'Sua foto com a caixinha no centro.' },
  { id:'es2', grupo:'stories', nome:'Quiz no bloco de notas', desc:'Pergunta de mito ou verdade com opções.' },
  { id:'es3', grupo:'stories', nome:'Bastidor', desc:'Foto, horário e o título manuscrito.' }
];

/* ---------- utilidades ---------- */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const marca = s => esc(s).replace(/\*(.+?)\*/g, '<span class="hl">$1</span>').replace(/_(.+?)_/g, '<b>$1</b>').replace(/\n/g, '<br>');
const SVG = {
  clipe:'<svg class="ex-clipe" viewBox="0 0 40 110"><path d="M27 32v52a10 10 0 0 1-20 0V18a7.5 7.5 0 0 1 15 0v62a3.5 3.5 0 0 1-7 0V32" fill="none" stroke="#8F969E" stroke-width="3.6" stroke-linecap="round"/></svg>',
  estrela:c => `<svg viewBox="0 0 24 24"><path d="M12 1.5l3.1 6.8 7.4.8-5.5 5 1.6 7.3L12 17.7l-6.6 3.7L7 14.1l-5.5-5 7.4-.8z" fill="${c}"/></svg>`,
  brilho:c => `<svg viewBox="0 0 24 24"><path d="M12 0c1 8 4 11 12 12-8 1-11 4-12 12-1-8-4-11-12-12 8-1 11-4 12-12z" fill="${c}"/></svg>`,
  purpurina:() => { const id = 'g' + Math.random().toString(36).slice(2, 7); return `<svg viewBox="0 0 24 24"><defs><pattern id="${id}" width="2.4" height="2.4" patternUnits="userSpaceOnUse"><rect width="2.4" height="2.4" fill="#B9BCC2"/><circle cx=".7" cy=".7" r=".55" fill="#fff"/><circle cx="1.8" cy="1.6" r=".4" fill="#7E8389"/></pattern></defs><path d="M12 1.5l3.1 6.8 7.4.8-5.5 5 1.6 7.3L12 17.7l-6.6 3.7L7 14.1l-5.5-5 7.4-.8z" fill="url(#${id})"/></svg>` },
  ramo:c => `<svg viewBox="0 0 120 160"><path d="M60 158C58 110 62 60 88 8" fill="none" stroke="${c}" stroke-width="2.4"/>${[[62, 130, -40], [61, 104, 35], [66, 80, -45], [70, 58, 40], [78, 36, -40], [84, 20, 30]].map(([x, y, r], i) => `<ellipse cx="${x + (i % 2 ? 16 : -16)}" cy="${y}" rx="17" ry="7.5" transform="rotate(${r} ${x + (i % 2 ? 16 : -16)} ${y})" fill="${c}"/>`).join('')}</svg>`,
  flor:(c, m) => `<svg viewBox="0 0 100 100">${[0, 72, 144, 216, 288].map(r => `<ellipse cx="50" cy="27" rx="15" ry="24" transform="rotate(${r} 50 50)" fill="${c}"/>`).join('')}<circle cx="50" cy="50" r="9" fill="${m}"/></svg>`,
  seta:c => `<svg viewBox="0 0 60 120"><path d="M30 6C10 30 46 50 26 78s4 30 4 34" fill="none" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/><path d="M20 102l10 12 10-12" fill="none" stroke="${c}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  raio:c => `<svg viewBox="0 0 40 60"><path d="M24 2L6 34h12l-4 24 20-34H22z" fill="${c}" stroke="#1a1a1a" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  pasta:c => `<svg viewBox="0 0 64 50"><path d="M2 8a4 4 0 0 1 4-4h16l6 6h30a4 4 0 0 1 4 4v30a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z" fill="${c}"/><path d="M2 16h60v28a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z" fill="${c}" opacity=".75" style="mix-blend-mode:multiply"/></svg>`,
  olhos:'<svg viewBox="0 0 64 52"><path d="M8 2h48a6 6 0 0 1 6 6v26a6 6 0 0 1-6 6H24l-12 10V40H8a6 6 0 0 1-6-6V8a6 6 0 0 1 6-6z" fill="#3B82F6"/><ellipse cx="24" cy="21" rx="9" ry="11" fill="#fff"/><ellipse cx="42" cy="21" rx="9" ry="11" fill="#fff"/><circle cx="27" cy="23" r="4.5" fill="#111"/><circle cx="45" cy="23" r="4.5" fill="#111"/></svg>',
  alfinete:c => `<svg viewBox="0 0 30 40"><circle cx="15" cy="12" r="10" fill="${c}"/><circle cx="11.5" cy="8.5" r="3" fill="#fff" opacity=".55"/><path d="M15 22v16" stroke="#777" stroke-width="2"/></svg>`
};
function silhueta(edit) {
  return `<span class="ex-ph"><svg viewBox="0 0 100 120" preserveAspectRatio="xMidYMax meet"><circle cx="50" cy="44" r="17"/><path d="M12 124c0-30 16-50 38-50s38 20 38 50z"/></svg>${edit ? '<i>Toque para pôr a sua foto</i>' : ''}</span>`;
}
function vars(idt) {
  const c = idt.c, f = idt.f;
  return `--cl:${c.cl};--es:${c.es};--ink:${c.ink};--on:${c.on};--ac:${c.ac};--ac2:${c.ac2};--ac3:${c.ac3};--pa:${c.pa};--aon:${c.aon};--hcl:${c.hcl};--hce:${c.hce};--hca:${c.hca};--d:${f.d};--dw:${f.dw};--dl:${f.dl};--dlh:${f.dlh};--dt:${f.dt};--fs:${f.s};--sk:${f.sk};--b:${f.b};--n:${f.n};--sit:${f.it ? 'italic' : 'normal'}`;
}

/* ---------- gerador ---------- */
function slides(tid, ctx) {
  const { idt, d, edit, handle, nome = '', fotos = {} } = ctx, out = [], N = d.s.length;
  const E = (k, v, cls = '', tag = 'div') => `<${tag} class="${cls}"${edit ? ` contenteditable="true" spellcheck="false" data-k="${k}"` : ''}>${marca(v)}</${tag}>`;
  const foto = (slot, cls) => `<div class="ex-foto ${cls}" data-foto="${slot || 'f1'}">${fotos[slot || 'f1'] ? `<img src="${fotos[slot || 'f1']}" alt="">` : silhueta(edit)}</div>`;
  const miudo = (txt, cls = '') => `<div class="ex-miudo ${cls}">${esc((txt + ' ').repeat(9))}</div>`;
  const topo = () => `<div class="ex-top"><span>${esc(nome)}</span><span>${esc(handle)}</span><span>${esc(d.area)}</span></div>`;
  const rod = (i, extra = '') => `<div class="ex-bot"><span>${i === 0 && N > 1 ? 'Arrasta para o lado <i class="ex-pt"></i>' : N > 1 ? `Pág. ${i + 1}/${N}` : esc(handle)}</span>${extra}<span>${i < N - 1 ? '→' : ''}</span></div>`;
  const pre = i => `s.${i}.`;
  const wrap = (s, i, corpo, tam = 'feed') => `<div class="mx ex i-${idt.id} ${tam} t-${s.t} v-${s.v || ''} tom-${s.tom || 'cl'} tx-${idt.tex}" data-hl="${idt.hl}" style="${vars(idt)}">${corpo}</div>`;
  d.s.forEach((s, i) => {
    const k = pre(i); let c = '';
    const deco = () => idt.id === 'oliva' || idt.id === 'ferrugem' ? `<div class="ex-ramo r1">${SVG.ramo(s.tom === 'es' ? 'var(--ac3)' : 'var(--ac)')}</div>` : idt.id === 'zine' || idt.id === 'uva' || idt.id === 'nativa' ? `<div class="ex-st s1">${SVG.estrela('var(--ac)')}</div><div class="ex-st s2">${SVG.brilho('var(--ac2)')}</div>` : idt.id === 'vinho' || idt.id === 'magenta' ? `<div class="ex-flor">${SVG.flor('var(--ac)', 'var(--ac2)')}</div>` : '';
    if (s.t === 'capa' && s.v === 'foto') c = `${topo()}${miudo(s.nota, 'm-dir')}${E(k + 'pill', s.pill, 'ex-pill')}${E(k + 'titulo', s.titulo, 'mx-t ex-d ex-gig')}${foto(s.foto, 'f-arco farc')}<div class="ex-nota n-capa">${E(k + 'nota', s.nota, 'ex-mao')}</div>${rod(i)}`;
    else if (s.t === 'capa' && s.v === 'manchete') c = `${topo()}${miudo(s.pill)}${E(k + 'tag', s.tag, 'ex-balao')}${E(k + 'titulo', s.titulo, 'mx-t ex-d ex-man')}${foto(s.foto, 'f-adesivo fman')}${E(k + 'pill', s.pill, 'ex-pill baixo')}${rod(i)}`;
    else if (s.t === 'capa' && s.v === 'cartaz') c = `<div class="ex-luz"></div>${E(k + 'sobre', s.sobre, 'ex-sobre')}<div class="ex-tv"><i></i></div>${E(k + 'titulo', s.titulo, 'mx-t ex-d ex-cartaz')}${E(k + 'linha', s.linha, 'ex-linha')}${E(k + 'creditos', s.creditos, 'ex-creditos')}${E(k + 'selo', s.selo, 'ex-classif')}<div class="ex-st s1">${SVG.brilho('var(--ac)')}</div>${rod(i)}`;
    else if (s.t === 'capa' && s.v === 'nativa') c = `${foto(s.foto, 'f-full')}<div class="ex-sombra"></div><div class="ex-olhos">${SVG.olhos}</div>${E(k + 'titulo', s.titulo, 'mx-t ex-nat')}<div class="ex-input"><span class="ex-mais">+</span>${E(k + 'caixa', s.caixa, '', 'span')}<span class="ex-env">↑</span></div><div class="ex-assin">${esc(handle)} | ${esc(nome)}</div>`;
    else if (s.t === 'capa' && s.v === 'zine') c = `${topo()}<div class="ex-fantasma">${esc((s.baixo || '').replace(/[*_.]/g, ''))}</div>${miudo(s.titulo + ' ' + s.baixo, 'm-esq')}<div class="ex-tags">${E(k + 'tag1', s.tag1, 'ex-tg a', 'span')}${E(k + 'tag2', s.tag2, 'ex-tg b', 'span')}</div>${E(k + 'titulo', s.titulo, 'mx-t ex-d ex-zt')}<div class="ex-moldura">${foto(s.foto, 'f-oval')}</div>${E(k + 'baixo', s.baixo, 'mx-t ex-d ex-zb')}<div class="ex-st s1">${SVG.estrela('var(--ac)')}</div><div class="ex-st s2">${SVG.purpurina()}</div><div class="ex-st s3">${SVG.estrela('var(--ink)')}</div><div class="ex-st s4">${SVG.estrela('var(--ac2)')}</div>${rod(i)}`;
    else if (s.t === 'capa' && s.v === 'janela') c = `${topo()}<div class="ex-pasta p1">${SVG.pasta('var(--ac)')}</div><div class="ex-pasta p2">${SVG.pasta('var(--ac)')}</div><div class="ex-jan"><div class="ex-jan-b"><i></i><i></i><i></i><span>${esc(handle)}</span></div><div class="ex-jan-c">${E(k + 'lead', s.lead, 'ex-lead')}${E(k + 'titulo', s.titulo, 'mx-t ex-d ex-jt')}<small>${esc(nome)} · ${esc(d.area)}</small></div></div>${rod(i)}`;
    else if (s.t === 'capa' && s.v === 'caderno') c = `<div class="ex-fichario"><div class="ex-aros">${'<i></i>'.repeat(5)}</div><div class="ex-folha">${foto(s.foto, 'f-polaroide')}<div class="ex-alf">${SVG.alfinete('var(--ac)')}</div><div class="ex-nota n-cad">${E(k + 'nota', s.nota, 'ex-mao')}</div>${E(k + 'titulo', s.titulo, 'mx-t ex-d ex-cad')}${E(k + 'rodape', s.rodape, 'ex-pontilhado')}</div></div>`;
    else if (s.t === 'capa' && s.v === 'papel') c = `${N > 1 ? topo() : ''}<div class="ex-cal">${['08', '09', '10', '11', '15', '16', '17', '18'].map(n => `<span>${n}</span>`).join('')}</div><div class="ex-papel">${SVG.clipe}${E(k + 'titulo', s.titulo, 'ex-pl')}${E(k + 'script', s.script, 'mx-t ex-scr')}${E(k + 'assin', s.assin, 'ex-pa')}</div>${N > 1 ? rod(i) : ''}`;
    else if (s.t === 'capa' && s.v === 'pop') c = `${topo()}${E(k + 'titulo', s.titulo, 'mx-t ex-d ex-pop')}<div class="ex-raio r1">${SVG.raio('var(--ac2)')}</div><div class="ex-raio r2">${SVG.raio('var(--ac2)')}</div><div class="ex-meio-tom"></div>${foto(s.foto, 'f-recorte')}<div class="ex-adesivo">${E(k + 'selo', s.selo, '', 'span')}</div>${E(k + 'baixo', s.baixo, 'ex-fita')}`;
    else if (s.t === 'capa' && s.v === 'data') c = `<div class="ex-espiral">${'<i></i>'.repeat(9)}</div>${E(k + 'antes', s.antes, 'mx-t ex-d ex-da')}${E(k + 'titulo', s.titulo, 'mx-t ex-d ex-dt')}<div class="ex-dias">${s.dias.map((n, j) => j === 1 ? `<b>${E(k + 'dias.' + j, n, '', 'span')}<small>${esc(s.rotulo)}</small></b>` : E(k + 'dias.' + j, n, '', 'span')).join('')}</div>${foto(s.foto, 'f-selo')}${E(k + 'depois', s.depois, 'mx-t ex-d ex-dd')}${E(k + 'sub', s.sub, 'ex-sub')}`;
    else if (s.t === 'texto') c = `${topo()}${deco()}<div class="ex-centro">${E(k + 'lead', s.lead, 'ex-lead')}${E(k + 'titulo', s.titulo, 'mx-t ex-d ex-tt')}${s.nota ? E(k + 'nota', s.nota, 'ex-caixa') : ''}</div>${rod(i)}`;
    else if (s.t === 'caminho') c = `${topo()}<div class="ex-sel">${E(k + 'lead', s.lead, 'ex-lead')}<i></i><i></i><i></i><i></i></div>${E(k + 'titulo', s.titulo, 'mx-t ex-d ex-ct')}<div class="ex-trilha"><svg viewBox="0 0 460 200" preserveAspectRatio="none"><path d="M30 20H400a40 40 0 0 1 0 80H70a40 40 0 0 0 0 80H440" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>${s.passos.map((p, j) => `<span class="ex-no n${j}">${E(k + 'passos.' + j, p, '', 'em')}</span>`).join('')}</div>${E(k + 'rodape', s.rodape, 'ex-faixa')}${rod(i)}`;
    else if (s.t === 'lista') c = `${topo()}${deco()}<div class="ex-lcol">${E(k + 'titulo', s.titulo, 'mx-t ex-d ex-lt')}<ul class="ex-lista">${s.itens.map((x, j) => `<li><i></i>${E(k + 'itens.' + j, x, '', 'span')}</li>`).join('')}</ul></div><div class="ex-postit">${SVG.clipe}${E(k + 'postit', s.postit, 'ex-mao')}</div>${rod(i)}`;
    else if (s.t === 'pergunta') c = `${topo()}${E(k + 'titulo', s.titulo, 'mx-t ex-d ex-pt-t')}<div class="ex-pg">${foto(s.foto, 'f-circ')}${E(k + 'bolha', s.bolha, 'ex-bolha', 'span')}${E(k + 'texto', s.texto, 'mx-p ex-pg-t')}</div>${E(k + 'faixa', s.faixa, 'ex-pill largo')}${rod(i)}`;
    else if (s.t === 'chat') c = `${topo()}${E(k + 'lead', s.lead, 'ex-lead topo')}<div class="ex-chat">${s.msgs.map((m, j) => `<div class="ex-msg m${j}">${E(k + 'msgs.' + j, m, '', 'span')}<small>${String(9 + j).padStart(2, '0')}:4${j}</small></div>`).join('')}</div>${E(k + 'titulo', s.titulo, 'mx-t ex-d ex-cht')}${rod(i)}`;
    else if (s.t === 'passo') c = `${topo()}${deco()}<div class="ex-num">${E(k + 'n', s.n, '', 'span')}</div>${E(k + 'kicker', s.kicker, 'ex-kick')}${E(k + 'titulo', s.titulo, 'mx-t ex-d ex-pst')}${E(k + 'texto', s.texto, 'mx-p ex-pstx')}${miudo(s.texto, 'm-baixo')}${rod(i)}`;
    else if (s.t === 'cta') c = `${topo()}${deco()}<div class="ex-centro">${E(k + 'titulo', s.titulo, 'mx-t ex-d ex-tt')}${E(k + 'sub', s.sub, 'ex-lead')}<div class="ex-acoes"><span>Salvar</span><span>Compartilhar</span><span>Comentar</span></div></div>${rod(i)}`;
    else if (s.t === 'story' && s.v === 'caixa') c = `${foto(s.foto, 'f-full')}<div class="ex-sombra est"></div>${E(k + 'topo', s.topo, 'ex-pill st-topo')}<div class="ex-caixinha"><div class="ex-cx-h"><span class="ex-av">${esc((nome || 'A')[0])}</span>${E(k + 'titulo', s.titulo, 'mx-t ex-cx-t')}</div>${E(k + 'caixa', s.caixa, 'ex-cx-in')}</div><div class="ex-st s1">${SVG.brilho('var(--ac2)')}</div><div class="ex-st s2">${SVG.brilho('#fff')}</div>`;
    else if (s.t === 'story' && s.v === 'quiz') c = `<div class="ex-notas-b"><span>‹ Notas</span><span>◎ ⋯ OK</span></div>${E(k + 'titulo', s.titulo, 'mx-t ex-d ex-qt')}<div class="ex-quiz">${E(k + 'pergunta', s.pergunta, 'ex-qp')}${s.ops.map((o, j) => `<div class="ex-op ${String(j) === String(s.certa) ? 'ok' : ''}"><i>${'ABC'[j]}</i>${E(k + 'ops.' + j, o, '', 'span')}</div>`).join('')}</div>${E(k + 'nota', s.nota, 'ex-mao ex-qn')}<div class="ex-seta">${SVG.seta('var(--ink)')}</div>`;
    else if (s.t === 'story' && s.v === 'bastidor') c = `${foto(s.foto, 'f-full')}<div class="ex-sombra est"></div><div class="ex-hora">${E(k + 'hora', s.hora, '', 'span')}</div>${E(k + 'pre', s.pre, 'ex-bpre')}${E(k + 'titulo', s.titulo, 'mx-t ex-d ex-bt')}${E(k + 'sub', s.sub, 'ex-pill st-sub')}<div class="ex-assin est">${esc(handle)}</div>`;
    out.push(wrap(s, i, c, s.t === 'story' ? 'story' : 'feed'));
  });
  return out;
}
const FONTES_URL = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Yellowtail&family=Nothing+You+Could+Do&family=Playfair+Display:wght@600&family=Hanken+Grotesk:wght@400;600;800&family=Gloock&family=Homemade+Apple&family=Mrs+Saint+Delafield&family=Rubik:wght@400;600;800&family=Mr+Dafoe&family=Cormorant+Garamond:wght@500;600&family=Pinyon+Script&family=Lato:wght@400;700;900&family=Lobster&display=swap';
return { nome:'Editorial', IDT, PACKS, TPL, slides, FONTES_URL, temFoto:true };
})();

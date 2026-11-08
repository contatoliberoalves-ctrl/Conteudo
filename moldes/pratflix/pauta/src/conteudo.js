// Pauta · conteúdo fixo da plataforma: formatos, pilares, ideias, ganchos, cronograma de 6 meses,
// datas, guias de design e vídeo, regras de ética (Provimento 205/2021) e perfil.
window.PAUTA = {};
const P = window.PAUTA;

P.FORMATOS = {
  carrossel: { nome:'Carrossel', curto:'Carrossel', cor:'#3047E6', dur:'7 a 10 slides · 1080×1350', tempo:90 },
  reels: { nome:'Reels com você', curto:'Reels', cor:'#E5484D', dur:'30 a 60 s · 1080×1920', tempo:75 },
  'reels-texto': { nome:'Reels sem rosto', curto:'Reels texto', cor:'#F06A3A', dur:'15 a 30 s · texto na tela e imagens', tempo:45 },
  post: { nome:'Post único', curto:'Post', cor:'#0E9F6E', dur:'1 imagem · 1080×1350', tempo:30 },
  stories: { nome:'Sequência de stories', curto:'Stories', cor:'#B7791F', dur:'4 a 7 telas · 1080×1920', tempo:20 },
  live: { nome:'Live', curto:'Live', cor:'#7C3AED', dur:'30 a 45 min', tempo:120 },
  youtube: { nome:'Vídeo longo', curto:'YouTube', cor:'#9F1239', dur:'6 a 12 min · 16:9', tempo:180 }
};
P.PILARES = {
  educar:{ nome:'Educar', desc:'Explica um direito ou um procedimento em linguagem simples.', meta:'Salvamentos' },
  desmistificar:{ nome:'Desmistificar', desc:'Corrige uma crença errada que prejudica as pessoas.', meta:'Compartilhamentos' },
  passo:{ nome:'Passo a passo', desc:'Mostra o caminho prático, com etapas e documentos.', meta:'Salvamentos' },
  autoridade:{ nome:'Autoridade', desc:'Mostra profundidade: casos fictícios, decisões, análise.', meta:'Visitas ao perfil' },
  conexao:{ nome:'Conexão', desc:'Bastidores, rotina e valores: as pessoas confiam em quem conhecem.', meta:'Comentários e mensagens' },
  comunidade:{ nome:'Comunidade', desc:'Perguntas, enquetes e respostas aos seguidores.', meta:'Respostas e comentários' },
  conversao:{ nome:'Orientação', desc:'Explica quando procurar um advogado e como funciona o atendimento, sem oferta.', meta:'Mensagens e cliques no link' }
};

// Modelos de ideia aplicados a cada tema da área.
P.MODELOS_IDEIA = [
  { id:'pergunta', formato:'carrossel', pilar:'educar', titulo:x => x.q, gancho:x => x.q },
  { id:'mito', formato:'reels', pilar:'desmistificar', titulo:x => `Mito ou verdade: “${x.m}”`, gancho:x => `“${x.m}” Será?` },
  { id:'passo', formato:'carrossel', pilar:'passo', titulo:x => `Passo a passo: ${x.t}`, gancho:x => `${cap(x.t)}: o caminho em poucos passos` },
  { id:'erros', formato:'carrossel', pilar:'educar', titulo:x => `3 erros comuns sobre ${x.t}`, gancho:x => `3 erros sobre ${x.t} que custam caro` },
  { id:'caso', formato:'reels', pilar:'autoridade', titulo:x => `Caso fictício: ${x.t}`, gancho:x => `Imagine esta situação sobre ${x.t}…` },
  { id:'minuto', formato:'reels', pilar:'autoridade', titulo:x => `${cap(x.t)} em 1 minuto`, gancho:x => `Tudo o que você precisa saber sobre ${x.t} em 1 minuto` },
  { id:'caixa', formato:'stories', pilar:'comunidade', titulo:x => `Caixa de perguntas: ${x.t}`, gancho:x => `Me pergunte o que quiser sobre ${x.t}` },
  { id:'quando', formato:'post', pilar:'conversao', titulo:x => `Quando buscar orientação jurídica sobre ${x.t}`, gancho:x => `Sinais de que é hora de buscar orientação sobre ${x.t}` },
  { id:'live', formato:'live', pilar:'comunidade', titulo:x => `Live: tire suas dúvidas sobre ${x.t}`, gancho:x => `Ao vivo: suas dúvidas sobre ${x.t}` },
  { id:'longo', formato:'youtube', pilar:'autoridade', titulo:x => `${cap(x.t)}: guia completo`, gancho:x => `Neste vídeo eu explico ${x.t} do começo ao fim` }
];
function cap(s){ return s.charAt(0).toUpperCase() + s.slice(1) }
P.cap = cap;

// Ideias de conexão e bastidor (servem para qualquer área; {area} vira a área principal).
P.IDEIAS_GERAIS = [
  { t:'Quem sou e como posso ajudar', f:'post', p:'conexao', fixo:true },
  { t:'Por que escolhi atuar com {area}', f:'reels', p:'conexao' },
  { t:'Um dia na minha rotina de advocacia', f:'reels', p:'conexao' },
  { t:'Como funciona o primeiro atendimento', f:'carrossel', p:'conversao' },
  { t:'O que levar para a primeira reunião com um advogado', f:'carrossel', p:'conversao' },
  { t:'5 perguntas que você pode fazer ao seu advogado', f:'carrossel', p:'conversao' },
  { t:'Termos jurídicos de {area} traduzidos', f:'carrossel', p:'educar' },
  { t:'O que eu estudo para atender melhor', f:'stories', p:'conexao' },
  { t:'Minha mesa de trabalho e o que uso todo dia', f:'stories', p:'conexao' },
  { t:'O que aprendi no meu primeiro ano de advocacia', f:'reels', p:'conexao' },
  { t:'Livros e leis que todo mundo deveria conhecer sobre {area}', f:'carrossel', p:'educar' },
  { t:'Respondendo os comentários da semana', f:'reels', p:'comunidade' },
  { t:'Enquete: qual tema você quer ver na próxima semana?', f:'stories', p:'comunidade' },
  { t:'Mitos sobre advogados que eu ouço toda semana', f:'reels', p:'conexao' },
  { t:'Como organizo um caso do começo ao fim (sem dados de clientes)', f:'carrossel', p:'autoridade' },
  { t:'Glossário de {area}: 10 palavras que você vai ouvir', f:'carrossel', p:'educar' },
  { t:'Os 6 meses de conteúdo: o que mudou no meu trabalho', f:'reels', p:'conexao' },
  { t:'Decisão recente sobre {area} explicada em linguagem simples', f:'carrossel', p:'autoridade' }
];

// Datas que rendem conteúdo (mês 1–12, dia). areas vazias = serve para todas.
P.DATAS = [
  { m:1, d:24, t:'Dia Nacional do Aposentado', areas:['previdenciario'] },
  { m:1, d:30, t:'Volta às aulas: lista de material e matrícula', areas:['consumidor','familia'] },
  { m:3, d:8, t:'Dia Internacional da Mulher', areas:['criminal','trabalho','familia','previdenciario'] },
  { m:3, d:15, t:'Dia do Consumidor', areas:['consumidor','bancario','saude','digital'] },
  { m:3, d:20, t:'Começa a temporada do Imposto de Renda', areas:['tributario','previdenciario'] },
  { m:4, d:2, t:'Dia Mundial de Conscientização do Autismo', areas:['saude','previdenciario','familia'] },
  { m:4, d:7, t:'Dia Mundial da Saúde', areas:['saude'] },
  { m:5, d:1, t:'Dia do Trabalhador', areas:['trabalho','previdenciario'] },
  { m:5, d:10, t:'Semana do Dia das Mães', areas:['familia','trabalho','previdenciario'] },
  { m:5, d:15, t:'Dia Internacional da Família', areas:['familia','sucessoes','extrajudicial'] },
  { m:6, d:12, t:'Dia dos Namorados: união estável e regime de bens', areas:['familia','extrajudicial','sucessoes'] },
  { m:7, d:13, t:'Aniversário do Estatuto da Criança e do Adolescente', areas:['familia','criminal'] },
  { m:7, d:15, t:'Férias: viagens, voos e hospedagem', areas:['consumidor'] },
  { m:8, d:7, t:'Aniversário da Lei Maria da Penha', areas:['criminal','familia'] },
  { m:8, d:11, t:'Dia do Advogado e dos cursos jurídicos', areas:[] },
  { m:8, d:9, t:'Semana do Dia dos Pais: guarda e convivência', areas:['familia'] },
  { m:9, d:11, t:'Aniversário do Código de Defesa do Consumidor', areas:['consumidor','bancario','saude'] },
  { m:9, d:21, t:'Dia Nacional de Luta da Pessoa com Deficiência', areas:['previdenciario','saude','tributario'] },
  { m:10, d:5, t:'Aniversário da Constituição de 1988', areas:['publico','criminal','carreira'] },
  { m:10, d:28, t:'Dia do Servidor Público', areas:['publico'] },
  { m:11, d:20, t:'Dia da Consciência Negra', areas:['criminal','trabalho','publico','carreira'] },
  { m:11, d:25, t:'Black Friday: compras sem cair em armadilhas', areas:['consumidor','digital','bancario'] },
  { m:11, d:30, t:'Primeira parcela do 13º salário', areas:['trabalho','previdenciario'] },
  { m:12, d:10, t:'Dia Internacional dos Direitos Humanos', areas:['criminal','publico'] },
  { m:12, d:20, t:'Fim de ano: planejamento sucessório e doações', areas:['sucessoes','tributario','extrajudicial'] }
];

// Cronograma: 6 fases (meses) e 26 semanas.
P.FASES = [
  { n:1, nome:'Fundação', cor:'#3047E6', obj:'Perfil pronto, identidade definida e os primeiros posts publicados.',
    kpis:['Bio e foto revisadas','4 a 6 destaques criados','3 posts fixados','12 publicações'], mix:['carrossel','carrossel','post','reels','carrossel'] },
  { n:2, nome:'Constância', cor:'#0E9F6E', obj:'Ritmo semanal sem falhar, séries com nome e stories todos os dias.',
    kpis:['Nenhuma semana sem postar','2 séries fixas','Stories 5 dias por semana','Responder em até 24 h'], mix:['carrossel','reels','carrossel','post','reels'] },
  { n:3, nome:'Autoridade', cor:'#B7791F', obj:'Conteúdo mais profundo: casos fictícios, decisões explicadas e um material gratuito.',
    kpis:['1 conteúdo aprofundado por semana','1 material gratuito (PDF)','Salvamentos em alta','Citação de fontes'], mix:['carrossel','reels','carrossel','carrossel','reels'] },
  { n:4, nome:'Vídeo', cor:'#E5484D', obj:'Gravar e editar com segurança: ganchos fortes, legendas e gravação em lote.',
    kpis:['8 vídeos gravados em lote','Retenção nos 3 primeiros segundos','Legendas em todos','1 modelo de edição'], mix:['reels','reels','carrossel','reels','reels'] },
  { n:5, nome:'Comunidade', cor:'#7C3AED', obj:'Conversa com quem segue: lives, respostas, colaborações e parcerias locais.',
    kpis:['1 live ou colab no mês','Série de respostas','1 parceria local','Mensagens em alta'], mix:['reels','carrossel','live','reels','carrossel'] },
  { n:6, nome:'Escala', cor:'#0F766E', obj:'Reaproveitar o que deu certo, levar para outras redes e planejar o próximo semestre.',
    kpis:['Conteúdo reaproveitado em 3 formatos','Presença em mais 1 rede','Plano do próximo semestre','Balanço dos 6 meses'], mix:['carrossel','reels','reels','carrossel','post'] }
];
P.SEMANAS = [
  // Mês 1 · Fundação
  { f:1, tema:'Base do perfil', tarefas:['Defina o nome do perfil com a sua área (ex.: “Ana Souza | Direito de Família”)','Faça uma foto de perfil com fundo limpo, rosto centralizado e boa luz','Escreva a bio no gerador da aba Perfil e coloque o número da OAB','Escolha 3 pilares de conteúdo para os próximos 6 meses'] },
  { f:1, tema:'Identidade visual', tarefas:['Escolha a paleta e o par de fontes na aba Perfil › Identidade','Crie a capa padrão dos seus carrosséis','Separe 20 fotos suas (trabalhando, falando, retrato) para usar nos posts'] },
  { f:1, tema:'Primeiros posts e destaques', tarefas:['Publique o post “Quem sou e como posso ajudar”','Monte de 4 a 6 destaques: Sobre mim, áreas, Dúvidas e Conteúdos','Fixe 3 posts no topo do perfil (apresentação, um educativo e um passo a passo)'] },
  { f:1, tema:'Rotina de produção', tarefas:['Escolha um dia fixo para roteirizar e outro para gravar e criar','Favorite 30 ideias no Banco de ideias','Revisão do mês: anote alcance, salvamentos e compartilhamentos na aba Métricas'] },
  // Mês 2 · Constância
  { f:2, tema:'Séries fixas', tarefas:['Crie 2 séries com nome (ex.: “Mito ou verdade”, “Pergunta da semana”)','Padronize a capa de cada série com a mesma estrutura','Anuncie as séries nos stories'] },
  { f:2, tema:'Stories todos os dias', tarefas:['Poste de 3 a 5 stories por dia: bastidor, conteúdo e interação','Use enquete ou caixa de perguntas 2 vezes na semana','Salve as melhores sequências em destaques'] },
  { f:2, tema:'Legendas que funcionam', tarefas:['Primeira linha da legenda = gancho; o resto em parágrafos curtos','Termine com um convite: salvar, compartilhar ou comentar','Use de 3 a 5 hashtags, incluindo uma da sua cidade'] },
  { f:2, tema:'Conversa e respostas', tarefas:['Responda todos os comentários em até 24 horas','Escreva respostas-padrão para direct (sem orientar caso concreto por mensagem)','Leve as dúvidas recebidas para o Banco de ideias'] },
  { f:2, tema:'Revisão do mês 2', tarefas:['Registre as métricas das últimas 4 semanas','Liste os 3 posts mais salvos e repita o formato','Ajuste os dias e horários de publicação'] },
  // Mês 3 · Autoridade
  { f:3, tema:'Conteúdo aprofundado', tarefas:['Faça um carrossel de 10 slides com um passo a passo completo','Cite a lei e o artigo em todo conteúdo técnico','Transforme uma dúvida frequente em um guia salvável'] },
  { f:3, tema:'Casos fictícios', tarefas:['Escreva 3 casos fictícios a partir de situações comuns, sem dados de clientes','Grave um deles em vídeo','Peça nos stories: “o que você faria nesse caso?”'] },
  { f:3, tema:'Decisões explicadas', tarefas:['Explique uma decisão recente da sua área em linguagem simples','Mostre o impacto prático para quem segue','Guarde a fonte (tribunal, número e data)'] },
  { f:3, tema:'Material gratuito', tarefas:['Crie um checklist em PDF (ex.: documentos para um procedimento da sua área)','Divulgue com uma palavra para comentar, sem oferecer serviços','Revise o material na aba Ética antes de publicar'] },
  // Mês 4 · Vídeo
  { f:4, tema:'Montando o set', tarefas:['Grave de frente para uma janela ou com luz a 45°','Celular na altura dos olhos, câmera traseira e 1080p ou 4K a 30 fps','Teste o áudio com microfone de lapela e um ambiente sem eco'] },
  { f:4, tema:'Ganchos', tarefas:['Grave 10 ganchos diferentes para o mesmo tema','Coloque o gancho também como texto na tela nos 3 primeiros segundos','Compare a retenção de 3 segundos nos insights'] },
  { f:4, tema:'Edição', tarefas:['Crie um modelo de edição (legenda, cores e fonte) no seu editor','Corte pausas e respirações: um corte a cada 2 a 4 segundos','Legenda em todos os vídeos, com palavras-chave destacadas'] },
  { f:4, tema:'Gravação em lote', tarefas:['Escreva 8 roteiros curtos em tópicos','Grave os 8 vídeos em um bloco de 2 horas','Edite e agende para as próximas 3 semanas'] },
  { f:4, tema:'Revisão do vídeo', tarefas:['Veja a retenção média e o ponto em que as pessoas saem','Refaça o gancho dos vídeos com pior retenção','Escolha 1 vídeo para virar carrossel'] },
  // Mês 5 · Comunidade
  { f:5, tema:'Live ou colaboração', tarefas:['Convide um colega de área complementar para uma live ou post em colaboração','Divulgue a live com 3 dias de antecedência','Corte os melhores trechos em reels'] },
  { f:5, tema:'Respostas aos seguidores', tarefas:['Abra uma caixa de perguntas e responda em série','Grave respostas curtas em vídeo','Agradeça publicamente as perguntas (sem expor ninguém)'] },
  { f:5, tema:'Parcerias locais', tarefas:['Ofereça uma palestra gratuita sobre direitos em escola, associação ou igreja','Faça conteúdo sobre um tema da sua cidade','Marque instituições parceiras nos posts'] },
  { f:5, tema:'Revisão do mês 5', tarefas:['Registre as métricas do mês','Veja quais assuntos geraram mensagens','Atualize os destaques com os melhores conteúdos'] },
  // Mês 6 · Escala
  { f:6, tema:'Reaproveitamento', tarefas:['Transforme um carrossel campeão em reels','Transforme um reels em sequência de stories','Corte a live em 3 vídeos curtos'] },
  { f:6, tema:'Outras redes', tarefas:['Adapte 3 conteúdos para LinkedIn ou TikTok','Publique um vídeo longo no YouTube com um tema campeão','Coloque todos os links na bio'] },
  { f:6, tema:'Próximo semestre', tarefas:['Liste as datas importantes dos próximos 6 meses','Escolha as 3 séries que vão continuar','Defina a meta de cada pilar'] },
  { f:6, tema:'Balanço dos 6 meses', tarefas:['Compare as métricas da semana 1 e da semana 26','Escreva o que funcionou e o que não funcionou','Gere um novo plano de 6 meses na aba Ajustes'] }
];

// Ganchos ({t} = tema). Usados nos roteiros e na aba Roteiros.
P.GANCHOS = [
  'Se você está passando por {t}, pare 30 segundos e veja isso.',
  'Ninguém te contou isso sobre {t}.',
  'O erro que mais vejo em {t}.',
  'Antes de assinar qualquer coisa sobre {t}, assista.',
  '3 coisas sobre {t} que a lei garante e pouca gente sabe.',
  'Você pode estar perdendo dinheiro com {t}.',
  'Isso que você ouviu sobre {t} não é bem assim.',
  'A pergunta que eu mais recebo sobre {t}.',
  'Guarde este vídeo: ele vai te ajudar com {t}.',
  'Se alguém te disse que {t} é simples, falta uma parte.',
  'Em 1 minuto: tudo sobre {t}.',
  'O documento que muda tudo em {t}.',
  'Você sabia que {t} tem prazo?',
  'Mande para alguém que está passando por {t}.',
  'Antes de ir ao cartório ou ao fórum por {t}, veja isso.',
  '“Doutor(a), é verdade que…?” Hoje a pergunta é sobre {t}.',
  'O que fazer nos primeiros dias de {t}.',
  'Três sinais de que {t} precisa de atenção.',
  'Isso acontece com mais gente do que você imagina: {t}.',
  'Vou te mostrar o caminho de {t} em 4 passos.'
];
P.CTAS = [
  'Salve para consultar quando precisar.',
  'Mande para alguém que precisa saber disso.',
  'Comente sua dúvida que ela pode virar o próximo conteúdo.',
  'Siga para mais conteúdos sobre {area} em linguagem simples.',
  'Quer o checklist completo? Comente “{palavra}”.',
  'Cada caso tem detalhes: na dúvida, busque orientação de um profissional de confiança.'
];

// Rotina de stories por dia da semana.
P.STORIES_SEMANA = [
  { d:'Segunda', ideia:'Bom dia + o que vem no conteúdo da semana (enquete de tema)' },
  { d:'Terça', ideia:'Bastidor de estudo ou de organização do escritório' },
  { d:'Quarta', ideia:'Caixa de perguntas sobre o tema da semana' },
  { d:'Quinta', ideia:'Respostas da caixa de perguntas, em vídeo curto' },
  { d:'Sexta', ideia:'Quiz “certo ou errado” + repost do conteúdo da semana' },
  { d:'Sábado', ideia:'Algo pessoal e leve (leitura, café, cidade)' },
  { d:'Domingo', ideia:'Opcional: resumo da semana ou descanso' }
];

// Guias do Estúdio (design, vídeo, stories, rotina).
P.GUIAS = {
  design:{ titulo:'Design de posts', secoes:[
    { h:'Medidas', itens:['Feed e carrossel: 1080 × 1350 px (4:5). É o formato que ocupa mais tela no feed.','Stories e reels: 1080 × 1920 px (9:16).','A grade do perfil corta a miniatura em 3:4: deixe o título no centro da capa.','Margem de segurança de 80 px nas bordas em todo post.'] },
    { h:'Capa do carrossel', itens:['Título com 5 a 9 palavras, em fonte grande (60 a 110 px).','Uma palavra ou trecho em destaque com a cor de acento.','Foto sua ou elemento visual forte; nada de capas só com texto pequeno.','Sinal de continuidade: “arrasta →” ou seta no canto.'] },
    { h:'Slides internos', itens:['Uma ideia por slide, no máximo 40 palavras.','Texto corrido com pelo menos 30 px; títulos de 48 px ou mais.','Numere os passos e use a mesma posição para o título em todos os slides.','Último slide: resumo ou convite (salvar, compartilhar, comentar).'] },
    { h:'Identidade', itens:['Duas fontes no máximo: uma para títulos e outra para texto.','Três ou quatro cores: fundo, texto, acento e uma de apoio.','Contraste alto: texto escuro em fundo claro ou o contrário.','Mesma estrutura de capa em cada série: quem segue reconhece de longe.'] },
    { h:'Fotos', itens:['Fotos reais suas trabalham melhor que banco de imagens.','Luz natural, fundo organizado, roupa que você usaria no atendimento.','Evite balanças, martelos e livros genéricos: mostre você e o tema.','Não use fotos de clientes ou documentos reais, nem com tarja.'] }
  ]},
  video:{ titulo:'Gravação e edição de vídeo', secoes:[
    { h:'Antes de gravar', itens:['Roteiro em tópicos, não em texto corrido: fica natural.','Luz de frente (janela) ou a 45°; evite luz atrás de você.','Celular na altura dos olhos, câmera traseira, 1080p ou 4K a 30 fps.','Microfone de lapela: o áudio importa mais que a imagem.','Fundo simples e organizado, sem eco no ambiente.'] },
    { h:'Gravando', itens:['Olhe para a lente, não para a tela.','Comece pelo gancho, sem “oi, gente”: os 3 primeiros segundos decidem.','Grave frases curtas; errou, repita a frase inteira e corte depois.','Grave 2 versões do gancho para testar.','Grave imagens de apoio (mãos escrevendo, mesa, cidade) para cobrir cortes.'] },
    { h:'Editando', itens:['Corte silêncios e respirações: um corte a cada 2 a 4 segundos mantém o ritmo.','Legenda em todos os vídeos: no máximo 2 linhas, palavras-chave em destaque.','Texto do gancho na tela nos 3 primeiros segundos.','Zoom de 110 a 120% para dar ênfase em frases importantes.','Música baixa, bem abaixo da voz (cerca de -25 dB), ou nenhuma.','Duração: 20 a 40 s para alcance, 45 a 90 s para explicar.'] },
    { h:'Zona segura do 9:16', itens:['Deixe livres os 250 px de cima (nome e botões).','Deixe livres os 420 px de baixo (legenda e botões do app).','Deixe livres os 120 px da direita (curtir, comentar, compartilhar).','Legendas e títulos no meio da tela.'] },
    { h:'Exportar e publicar', itens:['1080 × 1920, 30 fps, H.264, entre 10 e 15 Mbps.','Capa do reels com título legível também recortada em 4:5 na grade.','Legenda do post com o gancho na primeira linha.','Editores que resolvem: CapCut, Edits (Instagram), InShot ou VN.'] }
  ]},
  stories:{ titulo:'Stories que geram conversa', secoes:[
    { h:'Estrutura de uma sequência', itens:['Tela 1: contexto ou pergunta (“você sabia que…?”).','Telas 2 a 4: o conteúdo, uma ideia por tela.','Tela 5: interação (enquete, quiz ou caixa de perguntas).','Tela 6: convite para o post do feed ou para o destaque.'] },
    { h:'Figurinhas', itens:['Enquete: escolha de tema e “mito ou verdade”.','Quiz: teste de conhecimento com 3 opções.','Caixa de perguntas: pauta para a semana seguinte.','Link: material gratuito ou conteúdo completo.'] },
    { h:'Cuidados', itens:['Não responda caso concreto pela caixa de perguntas: explique a regra geral.','Ao mostrar uma pergunta, esconda o nome de quem perguntou.','Salve as melhores sequências em destaques.'] }
  ]},
  rotina:{ titulo:'Rotina de produção em lote', secoes:[
    { h:'Semana tipo (cerca de 4 horas)', itens:['Segunda · 30 min: revisar o calendário e escolher os temas.','Terça · 1 h: roteiros e legendas da semana seguinte.','Quarta · 1 h: gravar todos os vídeos de uma vez.','Quinta · 1 h 30: design dos carrosséis e edição dos vídeos.','Sexta · 30 min: agendar, responder e registrar as métricas.'] },
    { h:'Ferramentas', itens:['Agendamento: Meta Business Suite (gratuito).','Design: Canva ou Figma, com modelos fixos.','Edição: CapCut, Edits ou InShot.','Roteiro e organização: esta plataforma.'] },
    { h:'Reaproveitamento', itens:['1 tema rende: carrossel + reels + stories + post no LinkedIn.','Live vira 3 a 5 cortes curtos.','Carrossel campeão vira reels com o mesmo roteiro.','Repita conteúdos que deram certo depois de 3 a 4 meses, com nova capa.'] }
  ]}
};

// Ética: verificador de texto (Provimento 205/2021 e Código de Ética e Disciplina da OAB).
P.ETICA_REGRAS = [
  { re:/garant\w*\s+(o\s+|a\s+|de\s+)?(resultado|vit[oó]ria|êxito|exito|ganho|indeniza)|100\s?%\s*(de\s+)?(sucesso|êxito|exito|garantid)|causa ganha|ganhe (sua|a) (a[cç][aã]o|causa)|indeniza[cç][aã]o (garantida|certa)/i, nivel:'proibido', msg:'Promessa de resultado. A advocacia não pode garantir resultado.' },
  { re:/(o|a) melhor advogad|melhor escrit[oó]rio|n[uú]mero 1|mais barat|o mais (r[aá]pido|experiente) d/i, nivel:'proibido', msg:'Comparação ou autoexaltação. Evite superlativos e comparações com colegas.' },
  { re:/R\$\s?\d|honor[aá]rios?\s+(a partir|de apenas|por apenas)|pre[cç]o (da|de) consulta|valor da consulta|promo[cç][aã]o|desconto|parcele/i, nivel:'proibido', msg:'Divulgação de valores, promoções ou descontos de serviços não é permitida.' },
  { re:/consulta (gr[aá]tis|gratuita)|primeira consulta (gr[aá]tis|gratuita)|atendimento gratuito/i, nivel:'atencao', msg:'Oferta de serviço gratuito pode ser vista como captação de clientela. Revise.' },
  { re:/(chame|me chame|fale comigo|entre em contato|clique)\b.{0,40}(contrat|resolv\w* seu caso|seu processo|entrar com)/i, nivel:'atencao', msg:'Chamada para contratar soa como captação. Prefira um convite informativo.' },
  { re:/(meu|minha|nosso|nossa) cliente|ganhei (a causa|o processo|a a[cç][aã]o)|caso real/i, nivel:'atencao', msg:'Menção a clientes ou casos reais. Use casos fictícios e não exponha ninguém.' },
  { re:/sorteio|brinde|ganhe um|presente para quem/i, nivel:'atencao', msg:'Sorteios e brindes ligados a serviços jurídicos devem ser evitados.' },
  { re:/[uú]ltimas vagas|vagas limitadas|s[oó] hoje|corre que|n[aã]o perca|urgente/i, nivel:'atencao', msg:'Linguagem de urgência comercial (mercantilização). Mantenha o tom informativo.' },
  { re:/voc[eê] tem direito a receber|receba (at[eé]|seu dinheiro)|dinheiro de volta garantido/i, nivel:'atencao', msg:'Afirmação de direito certo para quem lê. Cada caso depende de análise.' }
];
P.ETICA_PODE = [
  'Conteúdo informativo e educativo sobre direitos e procedimentos.',
  'Perfil profissional com nome, área de atuação e número da OAB.',
  'Impulsionar conteúdo informativo, sem oferta mercantil de serviços.',
  'Falar de bastidores e rotina, com discrição e sem expor clientes.',
  'Lives, palestras, artigos e entrevistas sobre temas jurídicos.',
  'Material gratuito educativo (e-book, checklist) para quem segue.',
  'Uso de vídeos, áudios e fotos profissionais.'
];
P.ETICA_NAO = [
  'Prometer ou sugerir resultado (“causa ganha”, “indenização garantida”).',
  'Divulgar preços, valores de honorários, promoções ou descontos.',
  'Captar clientela: oferecer serviços em comentários ou mensagens de quem não pediu.',
  'Citar clientes ou casos reais identificáveis, mesmo com autorização genérica.',
  'Comparar-se com colegas ou usar superlativos (“o melhor”).',
  'Ostentar bens e padrão de vida ligados à advocacia.',
  'Responder caso concreto publicamente como se fosse consulta.'
];
P.ETICA_CHECK = [
  'O tom é informativo e não oferece serviços.',
  'Não há promessa de resultado nem afirmação de direito certo para quem lê.',
  'Não há preços, descontos ou condições comerciais.',
  'Nenhum cliente ou caso real pode ser identificado.',
  'A lei ou a fonte está citada quando há informação técnica.',
  'O perfil mostra nome e número da OAB.'
];

// Identidade (presets usados agora no Perfil e depois pelos modelos de posts).
P.PALETAS = [
  { id:'grafite', nome:'Grafite e areia', cores:['#121212','#F4F1EA','#E3D6B4','#7D6A3E'] },
  { id:'marinho', nome:'Marinho e azul', cores:['#0F1B33','#F5F7FB','#3B6FE0','#A9C1F5'] },
  { id:'verde', nome:'Verde-escuro', cores:['#102A22','#F3F6F2','#2E8A6E','#CFE3D6'] },
  { id:'vinho', nome:'Vinho e rosé', cores:['#3A0F1E','#FBF4F5','#C2577A','#F2C9D4'] },
  { id:'terracota', nome:'Terracota', cores:['#2B1A12','#FAF5F0','#C4622D','#F0D2BF'] },
  { id:'preto', nome:'Preto e branco', cores:['#0B0B0C','#FFFFFF','#0B0B0C','#D9D9D9'] }
];
P.FONTES = [
  { id:'manrope', nome:'Manrope + Big Shoulders', titulo:"'Big Shoulders Display', 'Arial Narrow', sans-serif", texto:"Manrope, sans-serif" },
  { id:'serif', nome:'Fraunces + Inter', titulo:"Fraunces, Georgia, serif", texto:"Inter, sans-serif" },
  { id:'grotesca', nome:'Archivo + Archivo', titulo:"'Archivo Black', Arial, sans-serif", texto:"Archivo, sans-serif" },
  { id:'classica', nome:'Playfair + Lato', titulo:"'Playfair Display', Georgia, serif", texto:"Lato, sans-serif" }
];
P.MODELOS_FUTUROS = [
  { grupo:'Posts de feed', itens:['Capa de carrossel educativo','Mito ou verdade','Passo a passo numerado','Pergunta da semana','Frase de destaque','Data comemorativa','Decisão explicada','Checklist salvável'] },
  { grupo:'Capas de destaque', itens:['Sobre mim','Áreas de atuação','Dúvidas','Conteúdos','Bastidores','Materiais'] },
  { grupo:'Stories', itens:['Enquete de tema','Caixa de perguntas','Resposta em vídeo','Quiz certo ou errado','Bastidor','Contagem para live','Repost do feed'] }
];

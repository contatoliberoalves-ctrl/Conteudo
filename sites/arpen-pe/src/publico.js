/* Páginas públicas: capa, espaço do cidadão, notícias, orientações, materiais e entrada da área do aluno. */
const img = nome => `img/${nome}.webp`;
const palavras = (txt, de = 0) => txt.split(' ').map((p, i) => `<span class="pal"><span style="--i:${de + i}">${p}</span></span>`).join(' ');
const ARCOS = `<svg class="arcos" viewBox="0 0 220 120" fill="none" stroke-width="12" aria-hidden="true"><path d="M10 120a100 100 0 0 1 200 0" stroke="#D2553F"/><path d="M28 120a82 82 0 0 1 164 0" stroke="#F6C544"/><path d="M46 120a64 64 0 0 1 128 0" stroke="#DDEDAA"/></svg>`;
const CAPA_FRASE = ['Cidadania.', 'Gente pela gente.', 'Diálogo que constrói.'];

function cabeca(titulo, desc, olho = 'ARPEN Pernambuco', figura = 'recife', extra = '') {
  return `<header class="cabeca"><img src="${img(figura)}" alt=""><div class="migalha"><a href="#inicio">Início</a> / ${esc(titulo.replace(/<[^>]+>/g, ''))}</div><span class="olho">${olho}</span>${extra ? `<div class="cid-topo"><div style="display:grid;gap:14px"><h1>${titulo}</h1><p>${desc}</p></div>${extra}</div>` : `<h1>${titulo}</h1><p>${desc}</p>`}</header>`;
}
function cartaoNoticia(n, i, forma = '') {
  return `<article class="nt ${forma} rv" style="--d:${i}">
    <div class="nt-capa c${i % 3}">${i === 0 && forma === 'nt-grande' ? `<img src="${img('recife')}" alt="Ilustração de Pernambuco" loading="lazy"><small>Ilustração editorial</small>` : `${ARCOS}<small>Pernambuco</small><b>${CAPA_FRASE[i % 3]}</b>`}</div>
    <div class="nt-corpo"><div class="nt-meta"><span class="tag">${esc(n.tipo)}</span><span>${dataBR(n.data)}</span></div><h3><a class="cobre" href="#noticia-${n.id}">${esc(n.titulo)}</a></h3><p>${esc(n.resumo)}</p></div>
  </article>`;
}

function paginaInicio() {
  const D = Banco.dados, noticias = publicados(D.noticias).slice(0, 3), orient = publicados(D.orientacoes).slice(0, 3);
  const fita = ['Do litoral ao sertão', 'Registro civil', 'Cidadania', 'Pernambuco', 'Informação que aproxima', 'Nossa terra, nossa gente'];
  const cores = ['var(--verde)', 'var(--azul)', 'var(--amarelo)', 'var(--vermelho)'];
  return `<section class="heroi"><div class="larg"><div class="heroi-painel" id="heroi">
      <img class="heroi-img" src="${img('recife')}" alt="Ilustração inspirada nas pontes, no casario e na paisagem de Pernambuco" fetchpriority="high">
      <div class="heroi-texto">
        <span class="olho entra-1">Registro civil · Cidadania · Pernambuco</span>
        <h1>${palavras('Pernambuco,')}<br>${palavras('feito de', 1)}<br><em>${palavras('histórias.', 3)}</em></h1>
        <p class="entra-2">Uma vida começa. Uma família se forma. O registro civil está em cada capítulo, e a gente está aqui para aproximar você.</p>
        <a class="bt bt-lima entra-3" href="#cidadao"><span>Encontre o seu próximo passo</span>${ico('seta')}</a>
      </div>
      <div class="heroi-legenda entra-3">Interpretação artística de Pernambuco<br>Uma terra, muitas histórias</div>
      <a class="gira entra-3" href="#cidadao" aria-label="Abrir o passaporte da cidadania"><svg class="volta" viewBox="0 0 120 120"><defs><path id="circulo" d="M60 60m-48 0a48 48 0 1 1 96 0a48 48 0 1 1-96 0"/></defs><text><textPath href="#circulo" textLength="296" lengthAdjust="spacing">Passaporte da cidadania · Abra o seu ·</textPath></text></svg><span class="miolo">${ico('seta')}</span></a>
    </div>
    <nav class="doca entra-3" aria-label="O que você procura">
      <div class="doca-rotulo">Seu caminho começa aqui.<strong>O que você procura?</strong></div>
      <a href="#cidadao"><span class="doca-ico">${ico('bussola')}</span><span><strong>Sou cidadão</strong><small>Serviços sem complicação</small></span>${ico('seta')}</a>
      <a href="#orientacoes"><span class="doca-ico">${ico('certidao')}</span><span><strong>Sou registrador</strong><small>Orientações para a rotina</small></span>${ico('seta')}</a>
      <a href="#entrar"><span class="doca-ico">${ico('play')}</span><span><strong>Quero aprender</strong><small>Aulas e capacitações</small></span>${ico('seta')}</a>
    </nav>
  </div></section>
  <div class="fita" aria-hidden="true"><div class="fita-trilho">${[0, 1].map(() => fita.map((f, i) => `<span style="--c:${cores[i % 4]}">${f}</span>`).join('')).join('')}</div></div>

  <section class="sec"><div class="larg">
    <div class="sec-topo rv"><div><span class="olho">Em pauta</span><h2>O que nos move.<br><em>O que nos conecta.</em></h2></div><a class="link-seta" href="#noticias">Explore as notícias ${ico('seta')}</a></div>
    ${noticias.length ? `<div class="noticias-grade">${noticias.map((n, i) => cartaoNoticia(n, i, i === 0 ? 'nt-grande' : 'nt-lado')).join('')}</div><p class="miudo" style="margin-top:16px">Consulte a data e a fonte de cada publicação.</p>` : `<div class="vazio">${ico('jornal')}<b>As próximas notícias aparecem aqui.</b>A equipe publica pelo painel.</div>`}
  </div></section>

  <section class="passa sec"><div class="larg">
    <div class="passa-grade">
      <div class="rv"><span class="olho">Seu espaço de descobertas</span><h2>Cidadania é saber <em>por onde ir.</em></h2>
        <p>O cartório faz parte da sua vida. Entender os serviços pode ser mais simples: escolha sua situação e descubra o caminho, passo a passo.</p>
        <a class="bt bt-lima" href="#cidadao"><span>Abrir meu passaporte da cidadania</span>${ico('seta')}</a>
        <div class="pilulas"><span>Sem cadastro</span><span>No seu ritmo</span><span>Fontes oficiais</span></div>
      </div>
      <div class="cena rv" id="cena" style="--d:2" aria-hidden="true">
        <div class="carimbo">DESCOBRIR<br>✦<br>PARA SEGUIR</div>
        <div class="passaporte"><b>ARPEN PERNAMBUCO</b><div class="sol">${ico('estrela')}</div><div><h3>Passaporte<br>da cidadania</h3><small>CONHECER TAMBÉM É UM DIREITO</small></div></div>
        <div class="bilhete"><small>SEU PRÓXIMO CAMINHO</small><div><i>1</i>Escolha uma situação</div><div><i>2</i>Descubra o que precisa</div><div><i>3</i>Saiba o próximo passo</div></div>
      </div>
    </div>
    <div class="atalhos">${SERVICOS.map((s, i) => `<a class="rv" style="--d:${i}" href="#cidadao-${s.id}">${ico(s.id)}<span>${s.curto}</span></a>`).join('')}</div>
  </div></section>

  <section class="sec"><div class="larg"><div class="reg">
    <div class="rv"><span class="olho">Para quem faz acontecer</span><h2>Da informação à prática. <em>Com clareza.</em></h2><p>Um espaço para transformar atualizações, decisões e instruções em apoio ao trabalho de quem faz o registro civil.</p><a class="link-seta" href="#orientacoes">Entre no espaço do registrador ${ico('seta')}</a></div>
    <div>${orient.map((o, i) => `<div class="linha-reg rv" style="--d:${i}"><span class="ord">0${i + 1}</span><div><span class="tag">${esc(o.tipo)}</span><h3><a href="#orientacao-${o.id}">${esc(o.titulo)}</a></h3></div>${ico('seta')}</div>`).join('')}
      <div class="linha-reg rv" style="--d:3"><span class="ord">${ico('baixar')}</span><div><span class="tag cinza">Materiais de apoio</span><h3><a href="#materiais">Recursos para usar na sua serventia.</a></h3></div>${ico('seta')}</div></div>
  </div></div></section>

  <section><div class="larg"><div class="capacita rv">
    <div class="capacita-texto"><span class="olho">ARPEN Capacita · Área do aluno</span><h2>Seu próximo capítulo é de <em>aprendizado.</em></h2><p>Conhecimento para acompanhar as mudanças. Aulas com índice clicável, materiais e encontros em um só lugar.</p><a class="bt bt-lima" href="#entrar"><span>Acessar a área de capacitação</span>${ico('seta')}</a></div>
    <div class="capacita-arte" aria-hidden="true"><img src="${img('varanda')}" alt="" loading="lazy"><div class="mini-player"><div class="mini-tela"><img src="${img('varanda')}" alt="" loading="lazy"><i>${ico('play')}</i></div><div class="mini-barra"><div class="mini-linha"></div><div class="mini-cap"><span>00:00 Abertura</span><span>04:10 Na prática</span><span>12:30 Dúvidas</span></div></div></div></div>
  </div></div></section>`;
}

/* ---------- Notícias e orientações ---------- */
const Lista = { filtro: 'Todos', busca: '' };
function paginaColecao(tipo) {
  const noticia = tipo === 'noticias';
  const itens = publicados(Banco.dados[tipo]);
  const cats = ['Todos', ...new Set(itens.map(x => x.tipo))];
  return `<div class="larg">${cabeca(noticia ? 'Notícias' : 'Informativos e <em>orientações</em>', noticia ? 'Acompanhe as publicações e o arquivo de notícias do registro civil.' : 'Conteúdo organizado para entender a atualização e seus efeitos na prática.')}
    <div class="pagina"><div class="filtros">${cats.map(c => `<button class="chip ${Lista.filtro === c ? 'on' : ''}" data-filtro="${esc(c)}">${esc(c)}</button>`).join('')}
      <label class="campo-busca">${ico('busca')}<input id="busca-colecao" type="search" placeholder="Buscar por assunto" aria-label="Buscar publicações" value="${esc(Lista.busca)}"></label></div>
      <div id="resultado-colecao" class="${noticia ? 'noticias-grade igual' : 'cartoes'}"></div></div></div>`;
}
function listarColecao(tipo) {
  const noticia = tipo === 'noticias';
  const itens = publicados(Banco.dados[tipo]).filter(n => (Lista.filtro === 'Todos' || n.tipo === Lista.filtro) && contem(n.titulo + ' ' + n.resumo, Lista.busca));
  $('#resultado-colecao').innerHTML = itens.length
    ? itens.map((n, i) => noticia ? cartaoNoticia(n, i) : `<article class="cartao rv" style="--d:${i}"><span class="tag" style="width:fit-content">${esc(n.tipo)}</span><h3><a class="cobre" href="#orientacao-${n.id}">${esc(n.titulo)}</a></h3><p>${esc(n.resumo)}</p><span class="link-seta">Ler conteúdo ${ico('seta')}</span></article>`).join('')
    : `<div class="vazio" style="grid-column:1/-1">${ico('busca')}<b>Nada encontrado.</b>Tente outro termo ou outra categoria.</div>`;
  revelar();
}
function paginaLeitura(tipo, id) {
  const n = publicados(Banco.dados[tipo]).find(x => x.id === id), volta = tipo === 'noticias' ? 'noticias' : 'orientacoes';
  if (!n) return `<div class="larg"><div class="leitura"><div class="vazio">${ico('jornal')}<b>Publicação não encontrada.</b><a class="link-seta" href="#${volta}">Voltar</a></div></div></div>`;
  return `<div class="larg"><article class="leitura">
    <a class="link-seta" href="#${volta}" style="width:fit-content">${ico('voltar')} ${tipo === 'noticias' ? 'Todas as notícias' : 'Todas as orientações'}</a>
    <div class="nt-meta"><span class="tag">${esc(n.tipo)}</span>${n.data ? `<span>${dataBR(n.data)}${tipo === 'noticias' ? ' · Arquivo de notícias' : ''}</span>` : ''}</div>
    <h1>${esc(n.titulo)}</h1><p class="resumo">${esc(n.resumo)}</p>
    ${tipo === 'noticias' ? `<div class="capa-leitura"><img src="${img('recife')}" alt="Ilustração editorial de Pernambuco, não é foto do evento"></div>` : ''}
    <div class="texto">${paragrafos(n.corpo)}</div>
    ${linkSeguro(n.link) ? `<div class="acoes"><a class="bt bt-linha" target="_blank" rel="noopener noreferrer" href="${esc(linkSeguro(n.link))}"><span>Consultar fonte original</span>${ico('fora')}</a></div>` : ''}
  </article></div>`;
}

/* ---------- Materiais ---------- */
function bannerSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350"><rect width="1080" height="1350" fill="#f5f8f4"/><rect width="1080" height="20" fill="#006747"/><rect x="740" width="150" height="20" fill="#164a96"/><rect x="890" width="110" height="20" fill="#f2c750"/><rect x="1000" width="80" height="20" fill="#d85c50"/><text x="85" y="170" font-family="Arial" font-size="60" font-weight="bold" fill="#006747">arpen/pe</text><text x="85" y="230" font-family="Arial" font-size="25" letter-spacing="8" fill="#006747">PERNAMBUCO</text><circle cx="865" cy="410" r="70" fill="#f2c750"/><text x="85" y="565" font-family="Georgia" font-size="90" fill="#073f32">Toda história</text><text x="85" y="680" font-family="Georgia" font-size="90" fill="#073f32">merece um</text><text x="85" y="795" font-family="Georgia" font-style="italic" font-size="90" fill="#006747">começo.</text><text x="85" y="925" font-family="Arial" font-size="32" fill="#687870">Registro civil. Cidadania. Pernambuco.</text><path d="M85 1050H995" stroke="#006747" stroke-width="3"/><text x="85" y="1180" font-family="Arial" font-size="22" fill="#687870">PROPOSTA VISUAL • MATERIAL DEMONSTRATIVO</text></svg>`;
}
function cartaoMaterial(m, i) {
  const link = linkSeguro(m.link);
  return `<article class="cartao rv" style="--d:${i}"><span class="tag" style="width:fit-content">${esc(m.tipo || 'Material')}</span><h3>${esc(m.titulo)}</h3><p>${esc(m.resumo || '')}</p>${link ? `<a class="link-seta" target="_blank" rel="noopener noreferrer" href="${esc(link)}">Abrir material ${ico('fora')}</a>` : '<span class="miudo">Arquivo ainda não anexado.</span>'}</article>`;
}
function paginaMateriais() {
  const lista = publicados(Banco.dados.materiais).filter(m => m.publico !== 'Alunos');
  return `<div class="larg">${cabeca('Materiais para <em>fazer acontecer.</em>', 'Recursos de comunicação e apoio para o dia a dia da sua serventia.')}
    <div class="pagina">
      <div class="destaque-mat rv"><div><span class="olho">Comunicação que aproxima</span><h2>A informação certa. <em>No lugar certo.</em></h2><p>Modelo de banner para avaliação: arquivo vetorial demonstrativo, 1080 × 1350, ainda sem validação institucional.</p><button class="bt bt-verde" data-acao="banner"><span>Baixar banner demonstrativo</span>${ico('baixar')}</button></div>
        <div class="poster" aria-hidden="true"><small>ARPEN PERNAMBUCO</small><strong>Toda história<br>merece um<br><em>começo.</em></strong><span>REGISTRO CIVIL. CIDADANIA.</span></div></div>
      ${lista.length ? `<div class="cartoes">${lista.map(cartaoMaterial).join('')}</div>` : `<div class="cartoes">${[['Cartilhas', 'Informação para compartilhar'], ['Modelos', 'Apoio para a sua rotina'], ['Apresentações', 'Para reuniões e treinamentos']].map((x, i) => `<article class="cartao rv" style="--d:${i}"><span class="tag cinza" style="width:fit-content">Em preparação</span><h3>${x[0]}</h3><p>${x[1]}. Os arquivos serão cadastrados pela equipe.</p></article>`).join('')}</div>`}
    </div></div>`;
}

/* ---------- Espaço do cidadão ---------- */
const Guia = { id: null, passo: 0, escolha: null, feitos: [] };
let Quiz = { i: 0, respostas: [], comecou: false };
let buscaDuvida = '';
const pontos = () => Eu.d.guias.length * 20 + (Eu.d.desafioFeito ? 10 : 0) + Eu.d.desafio * 10;
const nivel = () => pontos() >= 100 ? 'Explorador da cidadania' : pontos() >= 40 ? 'Caminho aberto' : 'Primeiros passos';
const fonteHTML = (link, nome) => link ? `<a class="fonte" href="${esc(link)}" target="_blank" rel="noopener noreferrer">Fonte oficial: ${esc(nome)} ${ico('fora')}</a>` : '';

function paginaCidadao(sub) {
  const aba = ['faq', 'quiz', 'conquistas'].includes(sub) ? sub : 'guias';
  const servico = SERVICOS.find(s => s.id === sub);
  const xp = `<div class="xp"><small>Suas descobertas</small><b>${pontos()}<span>pontos</span></b><div class="barra"><i style="--v:${Math.min(100, pontos() / 160 * 100)}%"></i></div><small>${nivel()}</small></div>`;
  return `<div class="larg">${cabeca('Seu passaporte <em>da cidadania.</em>', 'Descubra como o registro civil pode ajudar em cada momento da sua vida. Uma situação de cada vez.', 'Espaço do cidadão', 'recife', xp)}
    <div class="pagina">
      <nav class="abas" aria-label="Espaço do cidadão">${[['guias', 'Encontre seu caminho', 'cidadao'], ['faq', 'Tire suas dúvidas', 'cidadao-faq'], ['quiz', 'Teste o que sabe', 'cidadao-quiz'], ['conquistas', 'Suas descobertas', 'cidadao-conquistas']].map(([k, t, h]) => `<a class="${aba === k ? 'on' : ''}" href="#${h}">${t}</a>`).join('')}</nav>
      <div id="cid-conteudo">${sub === 'faq' ? telaDuvidas() : sub === 'quiz' ? telaQuiz() : sub === 'conquistas' ? telaConquistas() : servico ? telaGuia(servico) : telaJornadas()}</div>
      <p class="miudo">Guia educativo com referências oficiais, consultadas em 09/10/2026. Não envia pedidos ao cartório. Confirme os requisitos do seu caso com a serventia. O progresso fica apenas neste navegador; pontos e conquistas são educativos, sem prioridade ou benefício no atendimento.</p>
    </div></div>`;
}
function telaJornadas() {
  const cartoes = [...SERVICOS, { id: 'duvidas', titulo: 'Ainda tenho dúvidas', desc: 'Respostas diretas, sem termos complicados.', capa: ['Informação', 'que aproxima.'], faq: true }];
  const alt = { nascimento: 'Mão de bebê segurada por um adulto', casamento: 'Mãos de um casal com alianças', certidao: 'Caderno e caneta sobre uma mesa' };
  return `<div style="display:grid;gap:26px"><div class="sec-topo" style="margin:0"><div><h2 style="font-size:clamp(30px,4vw,46px)">Em que momento você está?</h2><p class="mudo">Escolha sua situação. Vamos encontrar o primeiro passo.</p></div></div>
    <div class="jornadas">${cartoes.map((s, i) => `<article class="jornada rv" style="--d:${i % 3}">
      <div class="jornada-capa ${s.foto ? '' : 'sem-foto t-' + s.id}">${s.foto ? `<img src="${img(s.foto)}" alt="${alt[s.id]}" loading="lazy">` : ico(s.faq ? 'busca' : s.id)}<strong>${s.capa[0]}<br><em>${s.capa[1]}</em></strong></div>
      <div class="jornada-corpo"><h3><a href="#cidadao-${s.faq ? 'faq' : s.id}">${s.titulo}</a></h3><p>${s.desc}</p><div class="jornada-pe"><span>${s.faq ? 'Tire suas dúvidas' : s.id === 'obito' ? 'Orientação com cuidado' : Eu.d.guias.includes(s.id) ? '✓ Guia explorado' : 'Guia em 3 passos'}</span>${ico('seta')}</div></div>
    </article>`).join('')}</div>
    <div class="convite rv"><div><span class="olho">Desafio cidadão · 5 perguntas</span><h3>Conhecer seus direitos faz diferença.</h3><p>Teste o que sabe e descubra algo novo. Sem pressa, sem competição.</p></div><a class="bt bt-lima" href="#cidadao-quiz"><span>Começar o desafio</span>${ico('seta')}</a></div>
    <p class="miudo">Fotografias: bady abbas, Elizeu Dias e Isaac Smith / Unsplash. <button class="fonte" data-acao="creditos">Ver créditos</button></p></div>`;
}
function resultadoGuia(s) {
  let texto = s.resultado, proximo = s.proximo, lista = [...s.lista], portal = false;
  const c = Guia.escolha;
  if (['nascimento', 'casamento', 'obito'].includes(s.id) && c === 1) {
    texto = 'Como o registro já existe, você precisa de uma segunda via da certidão. Consulte o cartório responsável ou o portal oficial do Registro Civil.';
    proximo = 'Confira os dados disponíveis e o formato solicitado por quem receberá a certidão.';
    lista = [...SERVICOS.find(x => x.id === 'certidao').lista]; portal = true;
  }
  if (['nascimento', 'obito'].includes(s.id) && c === 2) {
    texto = 'Antes de solicitar qualquer novo registro, procure o registro civil para verificar se ele já existe. Reúna os dados conhecidos para ajudar na busca.';
    proximo = 'Peça orientação à serventia sobre a localização do registro e o procedimento adequado.';
    lista = ['Anotar nome, data e município do nascimento ou do falecimento.', 'Reunir documentos ou cópias antigas, se houver.', 'Pedir ao registro civil orientação para localizar o registro.'];
  }
  if (s.id === 'nome') {
    if (c === 0) texto = 'A partir da maioridade civil, a pessoa pode requerer pessoalmente a alteração imotivada do prenome no cartório, observados os requisitos legais. Essa via pode ser usada uma única vez. O caso é analisado pelo oficial.';
    if (c === 1) texto = 'A alteração de sobrenome tem hipóteses previstas em lei, como inclusão de sobrenome familiar e mudanças relacionadas ao casamento ou à filiação. O cartório precisa verificar qual delas se aplica.';
    if (c === 2) texto = 'Correção de erro e mudança de nome são procedimentos diferentes. Algumas retificações podem ser administrativas; outras dependem da via judicial. Mostre os documentos ao registro civil para avaliar o caminho.';
  }
  if (s.id === 'certidao') { portal = true; proximo = `Consulte a segunda via da certidão de ${s.opcoes[c].toLowerCase()} no portal oficial ou diretamente na serventia.`; }
  return { texto, proximo, lista, portal };
}
function telaGuia(s) {
  if (Guia.id !== s.id) Object.assign(Guia, { id: s.id, passo: 0, escolha: null, feitos: [] });
  const p = Guia.passo;
  let painel;
  if (p === 0) painel = `<span class="olho">Passo 1 de 3</span><h2>${s.pergunta}</h2><p class="mudo">Escolha a opção que mais combina com o que você precisa.</p>
    <div class="opcoes">${s.opcoes.map((o, i) => `<button class="opcao" data-escolha="${i}"><i>${'ABC'[i]}</i>${o}${ico('seta')}</button>`).join('')}</div>`;
  else {
    const r = resultadoGuia(s);
    if (p === 1) painel = `<span class="olho">Passo 2 de 3</span><h2>Vamos organizar o primeiro passo.</h2><p class="mudo">Marque o que você já preparou. Pode continuar mesmo sem ter tudo em mãos.</p>
      <div class="opcoes">${r.lista.map((c, i) => `<label class="checa"><input type="checkbox" id="checa-${i}" data-feito="${i}" ${Guia.feitos.includes(i) ? 'checked' : ''}><span>${c}</span></label>`).join('')}</div>
      <div class="acoes"><button class="bt bt-verde" data-passo="2"><span>Ver minha orientação</span>${ico('seta')}</button><button class="bt bt-linha" data-passo="0"><span>Voltar</span></button></div>`;
    else painel = `<span class="olho">Passo 3 de 3</span><h2>Seu próximo passo, mais claro.</h2>
      <div class="resultado"><p>${esc(r.texto)}</p><p><strong>Agora, o que fazer?</strong><br>${esc(r.proximo)}</p>${fonteHTML(s.fonte, s.fonteNome)}</div>
      <div class="opcoes">${r.lista.map((c, i) => `<div class="checa" style="cursor:default">${ico(Guia.feitos.includes(i) ? 'ok' : 'relogio')}<span>${c}</span></div>`).join('')}</div>
      <div class="acoes">${r.portal ? `<a class="bt bt-verde" target="_blank" rel="noopener noreferrer" href="${PORTAL_RC}"><span>Ir ao portal oficial</span>${ico('fora')}</a>` : ''}
        <button class="bt ${r.portal ? 'bt-linha' : 'bt-verde'}" data-acao="concluir-guia"><span>${s.id === 'obito' ? 'Concluir orientação' : Eu.d.guias.includes(s.id) ? '✓ Guia já explorado' : 'Concluir guia · +20 pontos'}</span></button>
        ${PREVIA ? '' : `<button class="bt bt-linha" onclick="window.print()"><span>Imprimir orientação</span></button>`}<button class="link-seta" data-passo="1">${ico('voltar')} Voltar</button></div><div id="guia-fim" role="status"></div>`;
  }
  return `<div class="guia"><aside class="guia-mapa"><a class="link-seta" href="#cidadao" style="width:fit-content">${ico('voltar')} Todos os serviços</a><h3>${ico(s.id)} ${s.titulo}</h3>
    <div class="passos">${['Sua situação', 'Prepare-se', 'Próximo passo'].map((t, i) => `<div class="passo ${p === i ? 'atual' : p > i ? 'feito' : ''}"><b>${p > i ? '✓' : i + 1}</b><span>${t}</span></div>`).join('')}</div></aside>
    <section class="guia-painel" aria-live="polite">${painel}</section></div>`;
}
const listaDuvidas = () => {
  const l = DUVIDAS.filter(f => contem(f.q + ' ' + f.a, buscaDuvida));
  return l.length ? l.map(f => `<details><summary>${f.q}</summary><div class="resp"><p>${f.a}</p>${fonteHTML(f.fonte, f.nome)}</div></details>`).join('') : `<div class="vazio">${ico('busca')}<b>Não encontramos essa dúvida.</b>Tente outro termo ou procure o registro civil para orientação.</div>`;
};
function telaDuvidas() {
  return `<div style="display:grid;gap:22px"><div class="sec-topo" style="margin:0"><div><h2 style="font-size:clamp(30px,4vw,46px)">Uma resposta já ajuda.</h2><p class="mudo">Busque uma dúvida ou explore as perguntas abaixo.</p></div>
    <label class="campo-busca" style="margin:0">${ico('busca')}<input id="busca-duvida" type="search" placeholder="Ex.: segunda via, casamento, nome" aria-label="Buscar dúvidas" value="${esc(buscaDuvida)}"></label></div><div class="perguntas" id="lista-duvidas">${listaDuvidas()}</div></div>`;
}
function telaQuiz() {
  if (!Quiz.comecou) return `<div class="guia-painel desafio centro"><span class="olho">Desafio cidadão · 5 perguntas</span><h2>Um pouco de curiosidade.<br><em>Um monte de descobertas.</em></h2><p class="mudo" style="max-width:52ch">Teste o que sabe sobre certidões e serviços. Cada resposta vem com uma explicação. Não tem cronômetro nem penalidade por errar.</p><span class="tag">10 pontos por acerto · +10 por concluir · vale a melhor tentativa</span><button class="bt bt-verde" data-acao="quiz-comecar"><span>Começar desafio</span>${ico('seta')}</button></div>`;
  if (Quiz.i >= DESAFIO.length) {
    const n = Quiz.respostas.filter((a, i) => a === DESAFIO[i].certa).length;
    return `<div class="guia-painel desafio centro"><span class="olho">Desafio concluído</span><div class="placar" style="--v:${n * 20}">${n}/5</div><h2>Informação é um bom começo.</h2><p class="mudo">${n === 5 ? 'Todas as respostas corretas. Continue descobrindo!' : 'Reveja as explicações e tente novamente quando quiser.'}</p>
      <div class="acoes" style="justify-content:center"><button class="bt bt-verde" data-acao="quiz-comecar"><span>Tentar novamente</span></button><a class="bt bt-linha" href="#cidadao-conquistas"><span>Ver meu progresso</span></a></div>
      <div class="perguntas" style="width:100%;text-align:left">${DESAFIO.map((q, i) => `<details style="background:var(--papel)"><summary style="font-size:17px">${Quiz.respostas[i] === q.certa ? '✓' : '↺'} ${q.q}</summary><div class="resp"><p>${q.porque}</p></div></details>`).join('')}</div></div>`;
  }
  const q = DESAFIO[Quiz.i], r = Quiz.respostas[Quiz.i], respondeu = r !== undefined;
  return `<section class="guia-painel desafio" aria-live="polite"><div class="nt-meta" style="justify-content:space-between"><span class="olho">Pergunta ${Quiz.i + 1} de ${DESAFIO.length}</span><span>Sem pressa. Aprenda no seu ritmo.</span></div>
    <div class="barra"><i style="--v:${(Quiz.i + (respondeu ? 1 : 0)) / DESAFIO.length * 100}%"></i></div><h2>${q.q}</h2>
    <div class="opcoes">${q.op.map((o, i) => `<button class="opcao ${respondeu ? (i === q.certa ? 'certa' : i === r ? 'errada' : '') : ''}" ${respondeu ? 'disabled' : ''} data-resposta="${i}"><i>${respondeu && i === q.certa ? '✓' : 'ABC'[i]}</i>${o}</button>`).join('')}</div>
    ${respondeu ? `<div class="resultado" style="animation:aparece .5s var(--suave)"><p><strong>${r === q.certa ? 'Isso mesmo!' : 'Vamos esclarecer juntos.'}</strong><br>${q.porque}</p>${fonteHTML(DUVIDAS[q.duvida].fonte, DUVIDAS[q.duvida].nome)}</div><div><button class="bt bt-verde" data-acao="quiz-proxima"><span>${Quiz.i === DESAFIO.length - 1 ? 'Ver minhas descobertas' : 'Próxima pergunta'}</span>${ico('seta')}</button></div>` : '<p class="miudo">Escolha uma resposta para ver a explicação.</p>'}</section>`;
}
function telaConquistas() {
  const selos = [{ nome: 'Primeiro caminho', icone: 'bussola', ok: Eu.d.guias.length > 0 }, { nome: 'Curiosidade em ação', icone: 'raio', ok: Eu.d.desafioFeito }, { nome: 'Cinco descobertas', icone: 'estrela', ok: Eu.d.desafio === 5 }];
  return `<div style="display:grid;gap:24px"><div><h2 style="font-size:clamp(30px,4vw,46px)">Conhecimento que fica com você.</h2><p class="mudo">Veja os caminhos que já explorou. Seu progresso é pessoal, sem ranking ou competição.</p></div>
    <div class="selos">${selos.map((b, i) => `<div class="selo rv ${b.ok ? '' : 'travado'}" style="--d:${i}">${ico(b.icone)}<b>${b.nome}</b><span class="miudo">${b.ok ? 'Conquista desbloqueada' : 'Continue explorando'}</span></div>`).join('')}</div>
    <div class="convite" style="background:var(--branco);color:var(--tinta)"><div><h3>${Eu.d.guias.length} de 5 guias explorados</h3><p style="color:var(--mudo)">${Eu.d.desafioFeito ? 'Melhor resultado no desafio: ' + Eu.d.desafio + '/5' : 'O desafio cidadão está esperando por você.'}</p></div><a class="link-seta" href="#cidadao">Explorar outro caminho ${ico('seta')}</a></div>
    <p class="miudo">Não é um certificado nem um registro de atendimento.</p></div>`;
}
const redesenharCidadao = () => { const sub = Rota.atual.slice(8); $('#cid-conteudo').innerHTML = sub === 'faq' ? telaDuvidas() : sub === 'quiz' ? telaQuiz() : sub === 'conquistas' ? telaConquistas() : telaGuia(SERVICOS.find(s => s.id === sub)); revelar(); };

/* ---------- Entrada da área do aluno ---------- */
function paginaEntrar() {
  return `<div class="larg"><div class="entrar">
    <div class="entrar-arte"><img src="${img('varanda')}" alt="Ilustração de uma varanda com livros e a paisagem de Pernambuco"><span class="olho">ARPEN Capacita</span><h1>Seu próximo passo <em>começa aqui.</em></h1><p style="color:rgba(255,255,255,.82);max-width:42ch">Aulas, materiais e encontros em um ambiente simples de acompanhar.</p></div>
    <div class="entrar-form"><h2>Como você quer entrar?</h2>
      <div class="nota">Demonstração navegável: nenhuma senha é pedida e os dados ficam só neste navegador. O acesso individual é ativado quando o site for hospedado com o cadastro dos participantes.</div>
      <label class="campo"><span>Seu nome (opcional)</span><input id="entrar-nome" autocomplete="name" placeholder="Como quer ser chamado" value="${esc(Eu.d.nome)}"></label>
      <div class="perfis">
        <button class="perfil" data-entrar="aluno">${ico('livro')}<span><strong>Sou participante</strong><small>Assistir às aulas e acompanhar meu progresso</small></span>${ico('seta')}</button>
        <button class="perfil" data-entrar="equipe">${ico('lapis')}<span><strong>Sou da equipe ARPEN</strong><small>Cadastrar aulas, avisos, encontros e notícias</small></span>${ico('seta')}</button>
      </div>
    </div></div></div>`;
}

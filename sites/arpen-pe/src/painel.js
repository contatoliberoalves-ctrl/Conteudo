/* Painel da equipe: cursos e aulas (com índice e vídeo), encontros, avisos, materiais, notícias, orientações e participantes. */
const MENU_EQUIPE = [['painel', 'Visão geral', 'casa'], ['painel-cursos', 'Cursos e aulas', 'play'], ['painel-encontros', 'Encontros', 'agenda'], ['painel-avisos', 'Avisos', 'sino'], ['painel-materiais', 'Materiais', 'pasta'], ['painel-noticias', 'Notícias', 'jornal'], ['painel-orientacoes', 'Orientações', 'certidao'], ['painel-participantes', 'Participantes', 'pessoas']];
const hoje = () => new Date().toISOString().slice(0, 10);
/* campo: [chave, rótulo, tipo, obrigatório, opções ou dica] */
const COLECOES = {
  encontros: { um: 'encontro', nome: 'Encontros', icone: 'agenda', frase: 'Agenda dos encontros ao vivo. O participante vê a data, entra na sala e adiciona ao calendário.', campos: [['titulo', 'Título', 'texto', 1], ['data', 'Data', 'date', 1], ['hora', 'Horário de Brasília', 'time', 1], ['link', 'Link da sala (Meet, Zoom, YouTube)', 'url'], ['corpo', 'Descrição', 'longo']], detalhe: e => `${dataBR(e.data)} · ${e.hora || ''}` },
  avisos: { um: 'aviso', nome: 'Avisos', icone: 'sino', frase: 'Recados que aparecem na área do aluno com o selo de novo.', campos: [['titulo', 'Título', 'texto', 1], ['corpo', 'Mensagem', 'longo', 1]], detalhe: a => dataBR(a.data), novo: () => ({ data: hoje() }) },
  materiais: { um: 'material', nome: 'Materiais', icone: 'pasta', frase: 'Cartilhas, modelos e apresentações. Cole o link do arquivo (Drive, site ou PDF).', campos: [['titulo', 'Título', 'texto', 1], ['tipo', 'Tipo', 'select', 1, ['Cartilha', 'Modelo', 'Banner', 'Apresentação']], ['publico', 'Quem vê', 'select', 1, ['Público', 'Alunos']], ['link', 'Link do arquivo', 'url'], ['resumo', 'Descrição curta', 'longo']], detalhe: m => `${m.tipo} · ${m.publico}` },
  noticias: { um: 'notícia', nome: 'Notícias', icone: 'jornal', frase: 'Publicações da capa e da página de notícias.', campos: [['titulo', 'Título', 'texto', 1], ['tipo', 'Categoria', 'select', 1, ['Institucional', 'Cidadania']], ['data', 'Data', 'date', 1], ['resumo', 'Resumo (uma frase)', 'texto', 1], ['corpo', 'Texto', 'longo', 1], ['link', 'Link da fonte original', 'url']], detalhe: n => `${n.tipo} · ${dataBR(n.data)}`, novo: () => ({ data: hoje() }) },
  orientacoes: { um: 'orientação', nome: 'Orientações', icone: 'certidao', frase: 'Informativos, decisões e instruções para o registrador.', campos: [['titulo', 'Título', 'texto', 1], ['tipo', 'Categoria', 'select', 1, ['Informativos', 'Decisões', 'Instruções']], ['resumo', 'Resumo (uma frase)', 'texto', 1], ['corpo', 'Explicação, aplicação prática e fonte', 'longo', 1], ['link', 'Link da fonte oficial', 'url']], detalhe: n => n.tipo },
  participantes: { um: 'participante', nome: 'Participantes', icone: 'pessoas', frase: 'Quem terá acesso à área do aluno quando o login individual for ativado.', semStatus: true, tituloDe: 'nome', campos: [['nome', 'Nome', 'texto', 1], ['email', 'E-mail', 'email', 1], ['serventia', 'Serventia', 'texto'], ['perfil', 'Perfil', 'select', 1, ['Aluno', 'Instrutor']]], detalhe: p => `${p.email} · ${p.perfil}${p.serventia ? ' · ' + p.serventia : ''}` },
};
const Adm = { curso: null, busca: '', gaveta: null, desfazer: null };

function salvarAdm(msg) {
  Banco.gravar();
  const s = $('.salvo'); if (s) { s.classList.remove('agora'); void s.offsetWidth; s.classList.add('agora'); }
  if (msg) aviso(msg);
}
function comDesfazer(msg, fazer) {
  const antes = JSON.stringify(Banco.dados);
  fazer(); Banco.gravar(); Rota.pintar();
  aviso(msg, { rotulo: 'Desfazer', fazer() { Banco.dados = JSON.parse(antes); Banco.gravar(); Rota.pintar(); aviso('Restaurado.'); } });
}
const topoAdm = (titulo, direita = '') => topoApp('Painel da equipe', titulo, `<div class="acoes"><span class="salvo">Tudo salvo neste navegador</span>${direita}</div>`);
const chave = (ligado, attrs, rotulo) => `<label class="chave"><input type="checkbox" ${ligado ? 'checked' : ''} ${attrs}><i></i><span>${rotulo}</span></label>`;

/* ---------- Visão geral ---------- */
function telaPainel() {
  const D = Banco.dados, aulas = D.cursos.flatMap(c => todasAulas(c).map(a => ({ a, c })));
  const semVideo = aulas.filter(x => !x.a.video), semIndice = aulas.filter(x => x.a.video && x.a.status === 'publicado' && !x.a.indice?.length), rascunho = aulas.filter(x => x.a.video && x.a.status !== 'publicado');
  const pend = [
    semVideo.length && [`${semVideo.length} ${semVideo.length === 1 ? 'aula está' : 'aulas estão'} sem vídeo`, 'painel-cursos'],
    rascunho.length && [`${rascunho.length} ${rascunho.length === 1 ? 'aula com vídeo ainda está' : 'aulas com vídeo ainda estão'} em rascunho`, 'painel-cursos'],
    semIndice.length && [`${semIndice.length} ${semIndice.length === 1 ? 'aula publicada não tem' : 'aulas publicadas não têm'} índice`, 'painel-cursos'],
    !proximosEncontros().length && ['Nenhum encontro marcado na agenda', 'painel-encontros'],
    !publicados(D.materiais).length && ['Nenhum material publicado', 'painel-materiais'],
    !D.participantes.length && ['Nenhum participante cadastrado', 'painel-participantes'],
  ].filter(Boolean);
  return moldura(MENU_EQUIPE, 'painel', `${topoAdm(`Olá${primeiroNome() ? ', ' + esc(primeiroNome()) : ''}. <em>O que vamos publicar?</em>`)}
    <div class="rapidas">
      <button class="rapida" data-adm="nova-aula-rapida">${ico('play')}Nova aula<small>Cole o link do vídeo e o índice</small></button>
      <button class="rapida" data-adm="novo" data-col="avisos">${ico('sino')}Novo aviso<small>Recado para os participantes</small></button>
      <button class="rapida" data-adm="novo" data-col="encontros">${ico('agenda')}Novo encontro<small>Data, hora e link da sala</small></button>
      <button class="rapida" data-adm="novo" data-col="noticias">${ico('jornal')}Nova notícia<small>Vai para a capa do portal</small></button>
      <button class="rapida" data-adm="novo" data-col="materiais">${ico('pasta')}Novo material<small>Cartilha, modelo ou banner</small></button>
    </div>
    <div class="duas">
      <section class="bloco"><h2>Para resolver</h2><div class="tarefas">${pend.map(p => `<a class="tarefa" href="#${p[1]}">${ico('relogio')}<span>${p[0]}</span>${ico('seta')}</a>`).join('') || `<div class="tarefa tudo-certo">${ico('ok')}<span>Tudo em dia. Nada pendente.</span></div>`}</div></section>
      <section class="bloco"><h2>No ar agora</h2><div class="tarefas">${[['Cursos publicados', publicados(D.cursos).length, 'painel-cursos'], ['Aulas publicadas', aulas.filter(x => x.a.video && x.a.status === 'publicado').length, 'painel-cursos'], ['Notícias', publicados(D.noticias).length, 'painel-noticias'], ['Orientações', publicados(D.orientacoes).length, 'painel-orientacoes'], ['Participantes', D.participantes.length, 'painel-participantes']].map(x => `<a class="tarefa tudo-certo" href="#${x[2]}"><b style="min-width:26px;font-variant-numeric:tabular-nums">${x[1]}</b><span>${x[0]}</span>${ico('seta')}</a>`).join('')}</div></section>
    </div>
    <section class="bloco"><div class="bloco-topo"><div><h2>Cópia de segurança</h2><p class="miudo">Nesta demonstração o conteúdo fica salvo só neste navegador. Baixe uma cópia para levar a outro computador ou para a versão hospedada.</p></div>
      <div class="acoes"><button class="bt bt-linha bt-p" data-adm="exportar">${ico('baixar')}<span>Baixar cópia</span></button><label class="bt bt-linha bt-p" style="cursor:pointer">${ico('caixa')}<span>Carregar cópia</span><input type="file" id="importar-arquivo" accept="application/json,.json" hidden></label><button class="bt bt-linha bt-p" data-adm="restaurar">${ico('volta10')}<span>Voltar ao exemplo inicial</span></button></div></div></section>`, true);
}

/* ---------- Cursos e aulas ---------- */
function seloVideo(a) {
  return !a.video ? `<span class="tag ambar">Sem vídeo</span>` : `<span class="tag ${a.video.tipo === 'youtube' ? 'rubro' : 'azul'}">${ico(a.video.tipo === 'youtube' ? 'youtube' : 'filme')} ${a.video.tipo === 'youtube' ? 'YouTube' : 'Arquivo'}</span>`;
}
function linhaAulaAdm(a, m, c) {
  return `<div class="aula-adm" draggable="true" data-aula="${a.id}"><span class="pega" title="Arraste para reordenar">${ico('arrastar')}</span>
    <button class="meio" data-adm="editar-aula" data-id="${a.id}"><strong>${esc(a.titulo)}</strong><span class="meta">${seloVideo(a)}${a.dur ? `<span class="tag cinza">${duracao(a.dur)}</span>` : ''}<span class="tag ${a.indice?.length ? '' : 'cinza'}">${a.indice?.length ? a.indice.length + ' no índice' : 'Sem índice'}</span></span></button>
    <span class="fim">${chave(a.status === 'publicado', `data-adm="status-aula" data-id="${a.id}" ${a.video ? '' : 'disabled'} aria-label="Publicada"`, '')}
      <button class="mini" data-adm="mover-aula" data-id="${a.id}" data-dir="-1" aria-label="Subir">${ico('cima')}</button><button class="mini" data-adm="mover-aula" data-id="${a.id}" data-dir="1" aria-label="Descer">${ico('baixo')}</button>
      <button class="mini" data-adm="duplicar-aula" data-id="${a.id}" aria-label="Duplicar">${ico('copiar')}</button><button class="mini perigo" data-adm="apagar-aula" data-id="${a.id}" aria-label="Excluir">${ico('lixo')}</button></span></div>`;
}
function telaPainelCursos() {
  const D = Banco.dados;
  if (!D.cursos.some(c => c.id === Adm.curso)) Adm.curso = D.cursos[0]?.id || null;
  const c = D.cursos.find(x => x.id === Adm.curso);
  const lista = `<div class="lista-cursos">${D.cursos.map(x => `<a href="#painel-cursos" data-adm="abrir-curso" data-id="${x.id}" class="${x.id === Adm.curso ? 'on' : ''}"><strong>${esc(x.titulo)}</strong><small><span class="tag ${x.status === 'publicado' ? '' : 'ambar'}">${x.status === 'publicado' ? 'Publicado' : 'Rascunho'}</span>${todasAulas(x).length} aulas</small></a>`).join('')}<button class="fantasma" data-adm="novo-curso">${ico('mais')} Novo curso</button></div>`;
  const editor = !c ? `<div class="vazio">${ico('play')}<b>Crie o primeiro curso.</b>Depois é só adicionar módulos e colar os links das aulas.</div>` : `<div style="display:grid;gap:18px;min-width:0">
    <section class="bloco">
      <div class="bloco-topo"><input class="titulo-vivo" id="curso-titulo" data-campo-curso="titulo" value="${esc(c.titulo)}" aria-label="Nome do curso" style="flex:1 1 260px">
        <div class="acoes">${chave(c.status === 'publicado', 'data-adm="status-curso" id="curso-status"', 'Publicado')}<a class="mini" href="#curso-${c.id}" aria-label="Ver como aluno" title="Ver como aluno">${ico('olho')}</a><button class="mini perigo" data-adm="apagar-curso" aria-label="Excluir curso" title="Excluir curso">${ico('lixo')}</button></div></div>
      <div class="campos"><label class="campo"><span>Categoria</span><input id="curso-cat" data-campo-curso="cat" value="${esc(c.cat || '')}" placeholder="Ex.: Rotina da serventia"></label>
        <div class="campo"><span>Capa</span><div class="capas">${['recife', 'varanda', 'certidao', 'nascimento', 'casamento'].map(n => `<label><input type="radio" name="curso-capa" id="capa-${n}" value="${n}" data-adm="capa-curso" ${c.capa === n ? 'checked' : ''}><img src="${img(n)}" alt="Capa ${n}"></label>`).join('')}</div></div>
        <label class="campo larga"><span>Descrição</span><textarea id="curso-desc" data-campo-curso="desc" style="min-height:70px">${esc(c.desc || '')}</textarea></label></div>
    </section>
    ${c.modulos.map((m, i) => `<section class="mod-adm" data-modulo="${m.id}"><header><span class="tag">Módulo ${i + 1}</span><input id="mod-${m.id}" data-campo-modulo="${m.id}" value="${esc(m.titulo)}" aria-label="Nome do módulo">
        <button class="mini" data-adm="mover-modulo" data-id="${m.id}" data-dir="-1" aria-label="Subir módulo">${ico('cima')}</button><button class="mini" data-adm="mover-modulo" data-id="${m.id}" data-dir="1" aria-label="Descer módulo">${ico('baixo')}</button><button class="mini perigo" data-adm="apagar-modulo" data-id="${m.id}" aria-label="Excluir módulo">${ico('lixo')}</button></header>
      ${m.aulas.map(a => linhaAulaAdm(a, m, c)).join('')}
      <div class="mod-pe"><button class="fantasma" data-adm="nova-aula" data-id="${m.id}">${ico('mais')} Aula</button><button class="fantasma" data-adm="colar-aulas" data-id="${m.id}">${ico('lista')} Colar várias aulas</button></div></section>`).join('')}
    <button class="fantasma" data-adm="novo-modulo" style="justify-self:start">${ico('mais')} Novo módulo</button></div>`;
  return moldura(MENU_EQUIPE, 'painel-cursos', `${topoAdm('Cursos e <em>aulas</em>')}<div class="editor">${lista}${editor}</div>`, true);
}
const cursoAtual = () => Banco.dados.cursos.find(c => c.id === Adm.curso);

/* Gaveta da aula */
function abrirAula(id, nova = false) {
  const { aula } = acharAula(id);
  Adm.gaveta = { tipo: 'aula', id, nova };
  gaveta(nova ? 'Nova aula' : 'Editar aula', `
    <label class="campo"><span>Título da aula</span><input id="aula-titulo" value="${esc(aula.titulo)}" required></label>
    <label class="campo"><span>Link do vídeo</span><input id="aula-link" type="url" inputmode="url" placeholder="Cole o link do YouTube ou do arquivo .mp4" value="${esc(linkDoVideo(aula.video))}"><small>Aceita qualquer link do YouTube (inclusive ao vivo e não listado) ou o endereço de um arquivo de vídeo.</small></label>
    <div id="aula-video-previa"></div>
    <label class="campo"><span>Índice da aula</span><textarea id="aula-indice" placeholder="00:00 Abertura&#10;04:10 Documentos exigidos&#10;12:30 Dúvidas frequentes" style="min-height:130px;font-variant-numeric:tabular-nums">${esc(escreverIndice(aula.indice))}</textarea><small>Um trecho por linha: o tempo e o assunto. Pode colar a descrição inteira do YouTube; só as linhas com tempo são aproveitadas.</small></label>
    <div id="aula-indice-previa"></div>
    <label class="campo"><span>Descrição</span><textarea id="aula-desc" style="min-height:90px">${esc(aula.desc || '')}</textarea></label>
    <div class="campo"><span>Materiais da aula</span><div id="aula-anexos" style="display:grid;gap:8px">${(aula.anexos || []).map(linhaAnexo).join('')}</div><button type="button" class="fantasma" data-adm="mais-anexo" style="justify-self:start">${ico('mais')} Adicionar link</button></div>
    <div class="campos"><label class="campo"><span>Duração</span><input id="aula-dur" placeholder="mm:ss" value="${aula.dur ? tempo(aula.dur) : ''}"><small>Preenchida sozinha na primeira vez que o vídeo tocar.</small></label>
      <div class="campo"><span>Situação</span>${chave(nova || aula.status === 'publicado', 'id="aula-status"', 'Publicada para os participantes')}</div></div>`,
    `<button class="bt bt-linha bt-p" type="button" data-adm="apagar-aula" data-id="${id}">${ico('lixo')}<span>Excluir</span></button><div class="acoes"><button class="bt bt-linha bt-p" type="button" data-adm="testar-aula">${ico('play')}<span>Salvar e assistir</span></button><button class="bt bt-verde bt-p" type="submit">${ico('ok')}<span>Salvar aula</span></button></div>`);
  previaVideo(); previaIndice();
  if (nova) $('#aula-titulo').select();
}
const linhaAnexo = (x = {}) => `<div class="anexo-linha"><input class="solto" placeholder="Nome do material" aria-label="Nome do material" value="${esc(x.titulo || '')}"><input class="solto" type="url" placeholder="https://" aria-label="Link do material" value="${esc(x.url || '')}"><button type="button" class="mini perigo" data-adm="menos-anexo" aria-label="Remover">${ico('x')}</button></div>`;
function previaVideo() {
  const link = $('#aula-link').value.trim(), v = lerVideo(link), el = $('#aula-video-previa');
  if (!link) return el.innerHTML = '';
  if (!v) return el.innerHTML = `<div class="video-previa erro">Não reconheci este link. Cole o endereço completo do vídeo no YouTube ou de um arquivo .mp4.</div>`;
  el.innerHTML = v.tipo === 'youtube'
    ? `<div class="video-previa"><div class="quadro" ${PREVIA ? '' : `style="background-image:url('https://i.ytimg.com/vi/${v.id}/mqdefault.jpg')"`}>${ico('youtube')}</div><div><strong>Vídeo do YouTube reconhecido</strong><br><span class="miudo">Código ${esc(v.id)}. Ele toca dentro do site, com o índice ao lado.</span></div></div>`
    : `<div class="video-previa"><div class="quadro">${ico('filme')}</div><div><strong>Arquivo de vídeo</strong><br><span class="miudo">Toca no reprodutor do site, com velocidade, tela cheia e janela flutuante.</span></div></div>`;
}
function previaIndice() {
  const itens = lerIndice($('#aula-indice').value), el = $('#aula-indice-previa'), temTexto = $('#aula-indice').value.trim();
  el.innerHTML = itens.length ? `<div class="indice-previa">${itens.map(c => `<div><time>${tempo(c.t)}</time><span>${esc(c.titulo)}</span></div>`).join('')}</div><small class="miudo">${itens.length} ${itens.length === 1 ? 'trecho reconhecido' : 'trechos reconhecidos'}. É assim que aparece para o participante.</small>` : temTexto ? `<div class="video-previa erro">Nenhum tempo encontrado. Comece cada linha com o tempo, por exemplo: 04:10 Documentos exigidos.</div>` : '';
}
function salvarAula() {
  const { aula } = acharAula(Adm.gaveta.id), link = $('#aula-link').value.trim(), v = lerVideo(link);
  if (!$('#aula-titulo').value.trim()) { aviso('Dê um título para a aula.'); $('#aula-titulo').focus(); return false; }
  if (link && !v) { aviso('O link do vídeo não foi reconhecido.'); $('#aula-link').focus(); return false; }
  const mudouVideo = linkDoVideo(aula.video) !== linkDoVideo(v);
  aula.titulo = $('#aula-titulo').value.trim(); aula.desc = $('#aula-desc').value.trim();
  aula.video = v ? (v.tipo === 'youtube' ? { tipo: 'youtube', id: v.id } : v) : null;
  aula.indice = lerIndice($('#aula-indice').value);
  aula.anexos = $$('#aula-anexos .anexo-linha').map(l => { const [t, u] = $$('input', l); return { titulo: t.value.trim(), url: u.value.trim() }; }).filter(x => linkSeguro(x.url));
  const d = segundos($('#aula-dur').value || '0'); aula.dur = mudouVideo && !$('#aula-dur').value ? 0 : (d || 0);
  aula.status = $('#aula-status').checked && aula.video ? 'publicado' : 'rascunho';
  if ($('#aula-status').checked && !aula.video) aviso('Aula salva como rascunho: falta o link do vídeo.'); else aviso('Aula salva.');
  Banco.gravar(); return true;
}

/* ---------- Coleções (encontros, avisos, materiais, notícias, orientações, participantes) ---------- */
function telaColecao(col) {
  const def = COLECOES[col], chaveTitulo = def.tituloDe || 'titulo';
  const todos = Banco.dados[col], lista = todos.filter(x => contem(Object.values(x).join(' '), Adm.busca));
  return moldura(MENU_EQUIPE, 'painel-' + col, `${topoAdm(def.nome, `<button class="bt bt-verde bt-p" data-adm="novo" data-col="${col}">${ico('mais')}<span>${def.um === 'notícia' || def.um === 'orientação' ? 'Nova' : 'Novo'} ${def.um}</span></button>`)}
    <p class="mudo" style="max-width:70ch">${def.frase}</p>
    <section class="bloco"><div class="bloco-topo"><label class="campo-busca" style="margin:0">${ico('busca')}<input id="busca-adm" type="search" placeholder="Buscar" aria-label="Buscar em ${def.nome}" value="${esc(Adm.busca)}"></label>
      ${col === 'participantes' ? `<button class="fantasma" data-adm="colar-participantes">${ico('lista')} Colar lista de participantes</button>` : `<span class="miudo">${todos.length} ${todos.length === 1 ? 'registro' : 'registros'}</span>`}</div>
      ${lista.length ? `<div class="tabela-rolo"><table class="dados"><thead><tr><th>${def.tituloDe ? 'Nome' : 'Título'}</th><th>Detalhes</th>${def.semStatus ? '' : '<th>No ar</th>'}<th></th></tr></thead><tbody>${lista.map(x => `<tr data-adm="editar" data-col="${col}" data-id="${x.id}"><td><strong>${esc(x[chaveTitulo])}</strong></td><td><small>${esc(def.detalhe(x))}</small></td>${def.semStatus ? '' : `<td>${chave(x.status !== 'rascunho', `data-adm="status" data-col="${col}" data-id="${x.id}" aria-label="Publicado"`, '')}</td>`}
        <td class="acoes-td"><button class="mini" data-adm="duplicar" data-col="${col}" data-id="${x.id}" aria-label="Duplicar">${ico('copiar')}</button><button class="mini perigo" data-adm="apagar" data-col="${col}" data-id="${x.id}" aria-label="Excluir">${ico('lixo')}</button></td></tr>`).join('')}</tbody></table></div>`
        : `<div class="vazio" style="border:0">${ico(def.icone)}<b>${todos.length ? 'Nada encontrado.' : 'Nada cadastrado ainda.'}</b>${todos.length ? 'Tente outro termo.' : `Use o botão acima para criar ${def.um === 'notícia' || def.um === 'orientação' ? 'a primeira' : 'o primeiro'} ${def.um}.`}</div>`}</section>`, true);
}
function abrirRegistro(col, id) {
  const def = COLECOES[col], novo = !id, x = id ? Banco.dados[col].find(r => r.id === id) : { ...(def.novo?.() || {}) };
  Adm.gaveta = { tipo: 'registro', col, id };
  const campo = ([k, rot, tipo, obr, op]) => {
    const v = esc(x[k] ?? ''), req = obr ? 'required' : '', idc = `reg-${k}`;
    const corpo = tipo === 'longo' ? `<textarea id="${idc}" name="${k}" ${req}>${v}</textarea>` : tipo === 'select' ? `<select id="${idc}" name="${k}">${op.map(o => `<option ${x[k] === o ? 'selected' : ''}>${o}</option>`).join('')}</select>` : `<input id="${idc}" name="${k}" type="${tipo === 'texto' ? 'text' : tipo}" value="${v}" ${req} ${tipo === 'url' ? 'placeholder="https://"' : ''}>`;
    return `<label class="campo ${['longo', 'url'].includes(tipo) || k === 'titulo' || k === 'resumo' ? 'larga' : ''}"><span>${rot}${obr ? '' : ' <span class="miudo">(opcional)</span>'}</span>${corpo}</label>`;
  };
  gaveta(`${novo ? (['notícia', 'orientação'].includes(def.um) ? 'Nova' : 'Novo') : 'Editar'} ${def.um}`, `<div class="campos">${def.campos.map(campo).join('')}</div>${def.semStatus ? '' : chave(novo ? true : x.status !== 'rascunho', 'id="reg-status"', 'Publicado no site')}`,
    `${novo ? '<span></span>' : `<button class="bt bt-linha bt-p" type="button" data-adm="apagar" data-col="${col}" data-id="${id}">${ico('lixo')}<span>Excluir</span></button>`}<button class="bt bt-verde bt-p" type="submit">${ico('ok')}<span>Salvar</span></button>`);
  $('.gaveta input, .gaveta textarea')?.focus();
}
function salvarRegistro() {
  const { col, id } = Adm.gaveta, def = COLECOES[col], dados = Object.fromEntries(new FormData($('#gaveta-form')));
  for (const k in dados) dados[k] = dados[k].trim();
  if (dados.link && !linkSeguro(dados.link)) { aviso('Use um link iniciado por https://'); return false; }
  if (col === 'participantes' && Banco.dados.participantes.some(p => p.id !== id && p.email.toLowerCase() === dados.email.toLowerCase())) { aviso('Este e-mail já está cadastrado.'); return false; }
  if (!def.semStatus) dados.status = $('#reg-status').checked ? 'publicado' : 'rascunho';
  if (id) Object.assign(Banco.dados[col].find(r => r.id === id), dados); else Banco.dados[col].unshift({ id: novoId(), ...(def.novo?.() || {}), ...dados });
  Banco.gravar(); aviso(id ? 'Alterações salvas.' : `${def.um[0].toUpperCase() + def.um.slice(1)} ${['notícia', 'orientação'].includes(def.um) ? 'criada' : 'criado'}.`); return true;
}

/* Gaveta lateral */
function gaveta(titulo, corpo, pe) {
  fecharGaveta(false);
  document.body.insertAdjacentHTML('beforeend', `<div class="gaveta-fundo" data-adm="fechar-gaveta"></div><form class="gaveta" id="gaveta-form" novalidate role="dialog" aria-label="${esc(titulo)}"><header><h2>${titulo}</h2><button type="button" class="mini" data-adm="fechar-gaveta" aria-label="Fechar">${ico('x')}</button></header><div class="gaveta-corpo">${corpo}</div><footer>${pe}</footer></form>`);
}
function fecharGaveta(limpar = true) { $('.gaveta-fundo')?.remove(); $('.gaveta')?.remove(); if (limpar) Adm.gaveta = null; }

/* Colar várias de uma vez */
function lerAulasColadas(texto) {
  return texto.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
    const m = l.match(/https?:\/\/\S+/), v = m ? lerVideo(m[0]) : null;
    const titulo = (m ? l.replace(m[0], '') : l).replace(/^[\s|;,\-–—\d.)]+(?=\S)|[\s|;,\-–—]+$/g, '').trim();
    return { titulo: titulo || 'Aula sem título', video: v ? (v.tipo === 'youtube' ? { tipo: 'youtube', id: v.id } : v) : null };
  });
}
function lerParticipantesColados(texto) {
  return texto.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
    const email = (l.match(/[^\s;,<>|]+@[^\s;,<>|]+\.[^\s;,<>|]+/) || [''])[0];
    const resto = l.replace(email, '').split(/[;,|\t]/).map(s => s.replace(/[<>]/g, '').trim()).filter(Boolean);
    return { nome: resto[0] || email.split('@')[0], email, serventia: resto[1] || '', perfil: 'Aluno' };
  }).filter(p => p.email);
}

/* ---------- Ações do painel (cliques) ---------- */
function acaoAdm(el, ev) {
  const a = el.dataset.adm, id = el.dataset.id, col = el.dataset.col, c = cursoAtual();
  const mover = (lista, i, dir) => { const j = i + dir; if (j < 0 || j >= lista.length) return false; [lista[i], lista[j]] = [lista[j], lista[i]]; return true; };
  switch (a) {
    case 'fechar-gaveta': fecharGaveta(); break;
    case 'abrir-curso': ev.preventDefault(); Adm.curso = id; Rota.pintar(); break;
    case 'novo-curso': { const n = { id: novoId(), titulo: 'Novo curso', cat: '', desc: '', capa: 'varanda', status: 'rascunho', modulos: [{ id: novoId(), titulo: 'Módulo 1', aulas: [] }] }; Banco.dados.cursos.push(n); Adm.curso = n.id; salvarAdm(); Rota.pintar(); $('#curso-titulo')?.select(); break; }
    case 'status-curso': c.status = el.checked ? 'publicado' : 'rascunho'; salvarAdm(el.checked ? 'Curso publicado.' : 'Curso voltou para rascunho.'); Rota.pintar(); break;
    case 'capa-curso': c.capa = el.value; salvarAdm(); break;
    case 'apagar-curso': comDesfazer(`Curso “${c.titulo}” excluído.`, () => { Banco.dados.cursos = Banco.dados.cursos.filter(x => x !== c); Adm.curso = null; }); break;
    case 'novo-modulo': c.modulos.push({ id: novoId(), titulo: 'Módulo ' + (c.modulos.length + 1), aulas: [] }); salvarAdm(); Rota.pintar(); $(`#mod-${c.modulos.at(-1).id}`)?.select(); break;
    case 'mover-modulo': if (mover(c.modulos, c.modulos.findIndex(m => m.id === id), +el.dataset.dir)) { salvarAdm(); Rota.pintar(); } break;
    case 'apagar-modulo': { const m = c.modulos.find(x => x.id === id); comDesfazer(`Módulo “${m.titulo}” excluído${m.aulas.length ? ' com ' + m.aulas.length + ' aulas' : ''}.`, () => { c.modulos = c.modulos.filter(x => x !== m); }); break; }
    case 'nova-aula': { const m = c.modulos.find(x => x.id === id), n = aulaVazia('Nova aula'); m.aulas.push(n); Banco.gravar(); Rota.pintar(); abrirAula(n.id, true); break; }
    case 'nova-aula-rapida': { let cur = Banco.dados.cursos.find(x => x.id === Adm.curso) || Banco.dados.cursos[0]; if (!cur) { cur = { id: novoId(), titulo: 'Novo curso', cat: '', desc: '', capa: 'varanda', status: 'rascunho', modulos: [] }; Banco.dados.cursos.push(cur); } if (!cur.modulos.length) cur.modulos.push({ id: novoId(), titulo: 'Módulo 1', aulas: [] }); Adm.curso = cur.id; const n = aulaVazia('Nova aula'); cur.modulos.at(-1).aulas.push(n); Banco.gravar(); Adm.abrirDepois = n.id; location.hash = 'painel-cursos'; break; }
    case 'editar-aula': abrirAula(id); break;
    case 'status-aula': { const { aula } = acharAula(id); aula.status = el.checked ? 'publicado' : 'rascunho'; salvarAdm(el.checked ? 'Aula publicada.' : 'Aula voltou para rascunho.'); break; }
    case 'mover-aula': { const { modulo, aula } = acharAula(id), i = modulo.aulas.indexOf(aula), dir = +el.dataset.dir, mi = c.modulos.indexOf(modulo); if (!mover(modulo.aulas, i, dir)) { const outro = c.modulos[mi + dir]; if (!outro) break; modulo.aulas.splice(i, 1); dir > 0 ? outro.aulas.unshift(aula) : outro.aulas.push(aula); } salvarAdm(); Rota.pintar(); break; }
    case 'duplicar-aula': { const { modulo, aula } = acharAula(id), n = { ...JSON.parse(JSON.stringify(aula)), id: novoId(), titulo: aula.titulo + ' (cópia)', status: 'rascunho' }; modulo.aulas.splice(modulo.aulas.indexOf(aula) + 1, 0, n); salvarAdm('Aula duplicada como rascunho.'); Rota.pintar(); break; }
    case 'apagar-aula': { const { modulo, aula } = acharAula(id); fecharGaveta(); comDesfazer(`Aula “${aula.titulo}” excluída.`, () => { modulo.aulas = modulo.aulas.filter(x => x !== aula); }); break; }
    case 'mais-anexo': $('#aula-anexos').insertAdjacentHTML('beforeend', linhaAnexo()); $('#aula-anexos .anexo-linha:last-child input').focus(); break;
    case 'menos-anexo': el.closest('.anexo-linha').remove(); break;
    case 'testar-aula': { const idAula = Adm.gaveta.id; if (salvarAula()) { if (!acharAula(idAula).aula.video) { aviso('Cole o link do vídeo para assistir.'); break; } fecharGaveta(); location.hash = 'aula-' + idAula; } break; }
    case 'colar-aulas': Adm.colarEm = id; janela(`<h2>Colar várias aulas</h2><p class="mudo">Uma aula por linha: o título e o link do vídeo, em qualquer ordem. Linha sem link vira aula em rascunho, para completar depois.</p><textarea class="solto" id="colar-texto" style="min-height:190px" placeholder="Boas-vindas https://youtu.be/...&#10;Documentos do casamento | https://www.youtube.com/watch?v=...&#10;Aula ainda sem vídeo"></textarea><p class="miudo" id="colar-conta">Nenhuma aula reconhecida ainda.</p><div class="acoes"><button class="bt bt-verde" data-adm="confirmar-colar-aulas"><span>Adicionar aulas</span></button></div>`); $('#colar-texto').focus(); break;
    case 'confirmar-colar-aulas': { const novas = lerAulasColadas($('#colar-texto').value); if (!novas.length) { aviso('Cole pelo menos uma linha.'); break; } const m = c.modulos.find(x => x.id === Adm.colarEm); novas.forEach(n => m.aulas.push({ ...aulaVazia(n.titulo), video: n.video, status: n.video ? 'publicado' : 'rascunho' })); fecharJanela(); salvarAdm(`${novas.length} ${novas.length === 1 ? 'aula adicionada' : 'aulas adicionadas'}.`); Rota.pintar(); break; }
    case 'colar-participantes': janela(`<h2>Colar lista de participantes</h2><p class="mudo">Uma pessoa por linha: nome, e-mail e serventia, separados por vírgula, ponto e vírgula ou tabulação (pode copiar direto da planilha).</p><textarea class="solto" id="colar-texto" style="min-height:190px" placeholder="Maria Souza; maria@cartorio.com.br; 1º RCPN de Caruaru"></textarea><div class="acoes"><button class="bt bt-verde" data-adm="confirmar-colar-participantes"><span>Adicionar participantes</span></button></div>`); $('#colar-texto').focus(); break;
    case 'confirmar-colar-participantes': { const ja = new Set(Banco.dados.participantes.map(p => p.email.toLowerCase())); const novos = lerParticipantesColados($('#colar-texto').value).filter(p => !ja.has(p.email.toLowerCase()) && ja.add(p.email.toLowerCase())); if (!novos.length) { aviso('Nenhum e-mail novo encontrado.'); break; } Banco.dados.participantes.unshift(...novos.map(p => ({ id: novoId(), ...p }))); fecharJanela(); salvarAdm(`${novos.length} ${novos.length === 1 ? 'participante adicionado' : 'participantes adicionados'}.`); Rota.pintar(); break; }
    case 'novo': if (Rota.atual !== 'painel-' + col) { Adm.novoDepois = col; location.hash = 'painel-' + col; } else abrirRegistro(col); break;
    case 'editar': if (!ev.target.closest('button, label, a')) abrirRegistro(col, id); break;
    case 'status': { const x = Banco.dados[col].find(r => r.id === id); x.status = el.checked ? 'publicado' : 'rascunho'; salvarAdm(el.checked ? 'Publicado.' : 'Fora do ar (rascunho).'); break; }
    case 'duplicar': { const lista = Banco.dados[col], x = lista.find(r => r.id === id), k = COLECOES[col].tituloDe || 'titulo'; lista.splice(lista.indexOf(x) + 1, 0, { ...x, id: novoId(), [k]: x[k] + ' (cópia)', ...(COLECOES[col].semStatus ? { email: '' } : { status: 'rascunho' }) }); salvarAdm('Duplicado.'); Rota.pintar(); break; }
    case 'apagar': { const x = Banco.dados[col].find(r => r.id === id); fecharGaveta(); comDesfazer(`“${x[COLECOES[col].tituloDe || 'titulo']}” excluído.`, () => { Banco.dados[col] = Banco.dados[col].filter(r => r !== x); }); break; }
    case 'exportar': baixar(JSON.stringify(Banco.dados, null, 2), `arpen-pe-conteudo-${hoje()}.json`, 'application/json'); break;
    case 'restaurar': janela(`<h2>Voltar ao exemplo inicial?</h2><p class="mudo">Tudo o que foi cadastrado neste navegador será trocado pelo conteúdo de exemplo. Baixe uma cópia antes, se quiser guardar.</p><div class="acoes"><button class="bt bt-perigo" data-adm="confirmar-restaurar"><span>Sim, voltar ao exemplo</span></button><button class="bt bt-linha" onclick="fecharJanela()"><span>Cancelar</span></button></div>`); break;
    case 'confirmar-restaurar': Banco.restaurar(); fecharJanela(); Rota.pintar(); aviso('Conteúdo de exemplo restaurado.'); break;
  }
}
function depoisDePintarPainel() {
  if (Adm.abrirDepois && Rota.atual === 'painel-cursos') { const id = Adm.abrirDepois; Adm.abrirDepois = null; abrirAula(id, true); }
  if (Adm.novoDepois && Rota.atual === 'painel-' + Adm.novoDepois) { const col = Adm.novoDepois; Adm.novoDepois = null; abrirRegistro(col); }
}
/* Arrastar aulas para reordenar (inclusive entre módulos) */
let arrastada = null;
document.addEventListener('dragstart', ev => { const l = ev.target.closest?.('.aula-adm'); if (!l) return; arrastada = l.dataset.aula; l.classList.add('arrastando'); ev.dataTransfer.effectAllowed = 'move'; ev.dataTransfer.setData('text/plain', arrastada); });
document.addEventListener('dragend', () => { arrastada = null; $$('.arrastando, .alvo').forEach(e => e.classList.remove('arrastando', 'alvo')); });
document.addEventListener('dragover', ev => { if (!arrastada) return; const alvo = ev.target.closest?.('.aula-adm, .mod-adm'); if (!alvo) return; ev.preventDefault(); $$('.alvo').forEach(e => e.classList.remove('alvo')); if (alvo.classList.contains('aula-adm')) alvo.classList.add('alvo'); });
document.addEventListener('drop', ev => {
  if (!arrastada) return; const linha = ev.target.closest?.('.aula-adm'), mod = ev.target.closest?.('.mod-adm'); if (!mod) return; ev.preventDefault();
  const de = acharAula(arrastada), destino = cursoAtual().modulos.find(m => m.id === mod.dataset.modulo);
  if (linha?.dataset.aula === arrastada) return;
  de.modulo.aulas.splice(de.modulo.aulas.indexOf(de.aula), 1);
  const i = linha ? destino.aulas.findIndex(a => a.id === linha.dataset.aula) : -1;
  i >= 0 ? destino.aulas.splice(i, 0, de.aula) : destino.aulas.push(de.aula);
  arrastada = null; salvarAdm(); Rota.pintar();
});

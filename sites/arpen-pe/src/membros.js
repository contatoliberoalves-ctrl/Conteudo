/* Área do aluno: início, cursos, sala de aula com reprodutor, índice clicável e anotações. */
const MENU_ALUNO = [['aluno', 'Início', 'casa'], ['aluno-cursos', 'Cursos', 'play'], ['aluno-encontros', 'Encontros', 'agenda'], ['aluno-materiais', 'Materiais', 'pasta'], ['aluno-avisos', 'Avisos', 'sino']];
const avisosNovos = () => publicados(Banco.dados.avisos).filter(a => !Eu.d.lidos.includes(a.id)).length;
const primeiroNome = () => (Eu.d.nome || '').trim().split(' ')[0];
const CAPAS = ['generica', 'recife', 'varanda', 'certidao', 'nascimento', 'casamento'];
const capa = n => n === 'generica' ? 'img/generica.svg' : img(n);
const capaCurso = c => capa(CAPAS.includes(c.capa) ? c.capa : 'generica');
const miniatura = (a, n, marca) => `<span class="miniatura" style="background-image:url('${a.video?.tipo === 'youtube' && !PREVIA ? `https://i.ytimg.com/vi/${a.video.id}/mqdefault.jpg` : 'img/generica.svg'}')"><b>${a.video?.tipo === 'youtube' && !PREVIA ? '' : 'Aula ' + String(n).padStart(2, '0')}</b><i>${ico(marca)}</i></span>`;

function moldura(menu, ativa, conteudo, equipe = false) {
  const conta = r => r === 'aluno-avisos' && avisosNovos() ? `<span class="conta">${avisosNovos()}</span>` : '';
  const itens = menu.map(([r, t, i]) => `<a href="#${r}" class="${ativa === r ? 'on' : ''}">${ico(i)}<span>${t}</span>${conta(r)}</a>`).join('');
  return `<div class="area"><aside class="lado ${equipe ? 'equipe' : ''}">
      <a class="marca" href="#inicio"><span class="marca-nome"><strong>arpen<span>/pe</span></strong><small>${equipe ? 'Painel da equipe' : 'Área do aluno'}</small></span></a>
      ${itens}
      <div class="lado-pe">
        ${equipe ? `<a href="#aluno">${ico('olho')}<span>Ver como aluno</span></a>` : Eu.d.perfil === 'equipe' ? `<a href="#painel">${ico('lapis')}<span>Painel da equipe</span></a>` : ''}
        <a href="#inicio">${ico('voltar')}<span>Voltar ao portal</span></a>
        <button class="item" data-acao="sair">${ico('sair')}<span>Sair</span></button>
        <div class="lado-eu"><span>${esc((primeiroNome() || (equipe ? 'E' : 'A'))[0].toUpperCase())}</span><div><strong>${esc(primeiroNome() || (Eu.d.perfil === 'equipe' ? 'Equipe ARPEN' : 'Participante'))}</strong><small>${Eu.d.perfil === 'equipe' ? 'Equipe' : 'Participante'} · demonstração</small></div></div>
      </div></aside>
    <div class="miolo-app">${conteudo}</div>
    <nav class="barra-movel" aria-label="Navegação">${menu.map(([r, t, i]) => `<a href="#${r}" class="${ativa === r ? 'on' : ''}">${ico(i)}<span>${t.split(' ')[0]}</span>${conta(r)}</a>`).join('')}</nav></div>`;
}
const topoApp = (olho, titulo, direita = '') => `<header class="app-topo"><div><span class="olho">${olho}</span><h1>${titulo}</h1></div>${direita}</header>`;

function cartaoCurso(c, i = 0) {
  const p = progressoCurso(c), primeira = aulasNoAr(c)[0];
  return `<article class="curso rv" style="--d:${i % 4}"><div class="curso-capa"><img src="${capaCurso(c)}" alt="" loading="lazy"><span class="tag">${esc(c.cat || 'Capacitação')}</span>${primeira ? `<span class="tocar">${ico('play')}</span>` : ''}</div>
    <div class="curso-corpo"><h3><a class="cobre" href="#curso-${c.id}">${esc(c.titulo)}</a></h3><p>${esc(c.desc)}</p>
    ${p.total ? `<div class="barra"><i style="--v:${p.pct}%"></i></div><div class="curso-pe"><span>${p.feitas} de ${p.total} ${p.total === 1 ? 'aula' : 'aulas'}</span><span>${p.pct}%</span></div>` : `<div class="curso-pe"><span class="tag cinza">Aulas em preparação</span><span>${c.modulos.length} módulos</span></div>`}</div></article>`;
}
function linhaAviso(a) {
  const lido = Eu.d.lidos.includes(a.id);
  return `<div class="aviso-linha ${lido ? 'lido' : ''}"><span class="ponto"></span><div><h3>${esc(a.titulo)}</h3><p>${esc(a.corpo)}</p><div class="acoes" style="margin-top:6px"><span class="miudo">${dataBR(a.data)}</span>${lido ? '' : `<button class="fonte" data-lido="${a.id}">Marcar como lido</button>`}</div></div></div>`;
}
const proximosEncontros = () => publicados(Banco.dados.encontros).filter(e => e.data >= new Date().toISOString().slice(0, 10)).sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
function cartaoEncontro(e) {
  const d = new Date(e.data + 'T12:00:00'), link = linkSeguro(e.link);
  return `<div class="bloco encontro"><div class="encontro-data"><span>${d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}</span><b>${d.getDate()}</b><span>${d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</span></div>
    <div style="display:grid;gap:8px"><span class="tag aovivo" style="width:fit-content">${esc(e.hora || '')} · Horário de Brasília</span><h2>${esc(e.titulo)}</h2><p class="mudo">${esc(e.corpo || '')}</p>
    <div class="acoes">${link ? `<a class="bt bt-verde bt-p" target="_blank" rel="noopener noreferrer" href="${esc(link)}"><span>Acessar sala</span>${ico('fora')}</a>` : ''}<button class="bt bt-linha bt-p" data-agenda="${e.id}"><span>Adicionar ao calendário</span>${ico('baixar')}</button></div></div></div>`;
}
function baixarAgenda(id) {
  const e = Banco.dados.encontros.find(x => x.id === id), ini = new Date(e.data + 'T' + (e.hora || '19:00') + ':00-03:00');
  if (isNaN(ini)) return aviso('Data do encontro inválida.');
  const f = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''), limpo = t => String(t || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, '\\$&');
  baixar(`BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//ARPEN PE//PT\r\nBEGIN:VEVENT\r\nUID:${e.id}@arpen-pe\r\nDTSTAMP:${f(new Date())}\r\nDTSTART:${f(ini)}\r\nDTEND:${f(new Date(+ini + 3600000))}\r\nSUMMARY:${limpo(e.titulo)}\r\nDESCRIPTION:${limpo(e.corpo)}\r\nURL:${linkSeguro(e.link)}\r\nEND:VEVENT\r\nEND:VCALENDAR`, 'Encontro-ARPEN.ics', 'text/calendar');
}

function telaAlunoInicio() {
  const cursos = publicados(Banco.dados.cursos);
  let alvo = Eu.d.ultima && acharAula(Eu.d.ultima);
  if (!alvo || alvo.aula.status !== 'publicado') { const c = cursos.find(c => aulasNoAr(c).length); alvo = c ? acharAula(aulasNoAr(c)[0].id) : null; }
  const pr = alvo ? Eu.d.progresso[alvo.aula.id] : null, feitas = Object.values(Eu.d.progresso).filter(p => p.feita).length;
  const hora = new Date().getHours(), oi = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';
  const enc = proximosEncontros()[0], avisos = publicados(Banco.dados.avisos).slice(0, 3);
  return moldura(MENU_ALUNO, 'aluno', `
    ${topoApp('ARPEN Capacita', `${oi}${primeiroNome() ? ', ' + esc(primeiroNome()) : ''}. <em>Bom ter você aqui.</em>`)}
    ${alvo ? `<section class="continuar rv"><img src="${capaCurso(alvo.curso)}" alt=""><div><span class="olho">${pr?.t ? 'Continue de onde parou' : 'Comece por aqui'}</span><h2>${esc(alvo.aula.titulo)}</h2><p>${esc(alvo.curso.titulo)}${pr?.t && pr.d ? ` · parou em ${tempo(pr.t)} de ${tempo(pr.d)}` : ''}</p>${pr?.d ? `<div class="barra escuro" style="color:#fff;max-width:340px"><i style="--v:${Math.min(100, pr.t / pr.d * 100)}%"></i></div>` : ''}<a class="cobre" href="#aula-${alvo.aula.id}" aria-label="Assistir: ${esc(alvo.aula.titulo)}"></a></div><span class="botao-play">${ico('play')}</span></section>` : `<div class="vazio">${ico('play')}<b>As aulas chegam em breve.</b>A equipe está preparando os primeiros vídeos.</div>`}
    <div class="numeros">
      <div class="numero rv">${ico('ok')}<div><b data-conta="${feitas}">${feitas}</b><span>aulas concluídas</span></div></div>
      <div class="numero rv" style="--d:1">${ico('livro')}<div><b data-conta="${cursos.length}">${cursos.length}</b><span>cursos disponíveis</span></div></div>
      <div class="numero rv" style="--d:2">${ico('sino')}<div><b data-conta="${avisosNovos()}">${avisosNovos()}</b><span>avisos novos</span></div></div>
      <div class="numero rv" style="--d:3">${ico('agenda')}<div><b data-conta="${proximosEncontros().length}">${proximosEncontros().length}</b><span>encontros marcados</span></div></div>
    </div>
    <section style="display:grid;gap:18px"><div class="bloco-topo"><h2 style="font-size:30px">Seus cursos</h2><a class="link-seta" href="#aluno-cursos">Ver todos ${ico('seta')}</a></div><div class="cursos">${cursos.slice(0, 3).map(cartaoCurso).join('')}</div></section>
    <div class="duas">
      <section class="bloco rv"><div class="bloco-topo"><h2>O que há de novo</h2><a class="link-seta" href="#aluno-avisos">Todos os avisos ${ico('seta')}</a></div><div>${avisos.map(linhaAviso).join('') || '<p class="mudo">Nenhum aviso por enquanto.</p>'}</div></section>
      <section class="bloco rv" style="--d:1;background:var(--mata);color:#fff"><span class="olho" style="color:var(--lima)">Encontros ao vivo</span>${enc ? `<h2>${esc(enc.titulo)}</h2><p style="opacity:.8">${dataBR(enc.data)} · ${esc(enc.hora || '')}</p>` : `<h2>Conhecimento também nasce da conversa.</h2><p style="opacity:.8">A próxima data será anunciada nos avisos.</p>`}<a class="bt bt-lima bt-p" href="#aluno-encontros" style="width:fit-content"><span>Ver agenda</span>${ico('seta')}</a></section>
    </div>`);
}
function telaCursos() {
  const cursos = publicados(Banco.dados.cursos);
  return moldura(MENU_ALUNO, 'aluno-cursos', `${topoApp('Biblioteca de capacitações', 'Conhecimento com <em>raízes e horizontes.</em>')}
    ${cursos.length ? `<div class="cursos">${cursos.map(cartaoCurso).join('')}</div>` : `<div class="vazio">${ico('livro')}<b>Nenhum curso publicado.</b>Os cursos aparecem aqui assim que a equipe publicar.</div>`}`);
}
function telaCurso(id) {
  const c = publicados(Banco.dados.cursos).find(x => x.id === id);
  if (!c) return moldura(MENU_ALUNO, 'aluno-cursos', `<div class="vazio">${ico('livro')}<b>Curso não encontrado.</b><a class="link-seta" href="#aluno-cursos">Ver cursos</a></div>`);
  const p = progressoCurso(c), prox = aulasNoAr(c).find(a => !Eu.d.progresso[a.id]?.feita) || aulasNoAr(c)[0];
  const total = aulasNoAr(c).reduce((s, a) => s + (a.dur || 0), 0);
  return moldura(MENU_ALUNO, 'aluno-cursos', `
    <section class="continuar"><img src="${capaCurso(c)}" alt=""><div><a class="link-seta" href="#aluno-cursos" style="color:var(--lima);width:fit-content;position:relative;z-index:2">${ico('voltar')} Cursos</a><span class="olho">${esc(c.cat || 'Capacitação')}</span><h2>${esc(c.titulo)}</h2><p>${esc(c.desc)}</p>
      ${p.total ? `<div class="barra" style="color:#fff;max-width:340px"><i style="--v:${p.pct}%;background:var(--lima)"></i></div><p style="font-size:14px">${p.feitas} de ${p.total} aulas concluídas${total ? ' · ' + duracao(total) + ' de conteúdo' : ''}</p>` : ''}
      ${prox ? `<a class="cobre" href="#aula-${prox.id}" aria-label="Assistir: ${esc(prox.titulo)}"></a>` : ''}</div>${prox ? `<span class="botao-play">${ico('play')}</span>` : ''}</section>
    <div style="display:grid;gap:14px">${(c.n = 0, c.modulos).map((m, i) => `<details class="modulo rv" style="--d:${i}" open><summary><span class="num">${String(i + 1).padStart(2, '0')}</span><h3>${esc(m.titulo)}</h3><span class="miudo">${m.aulas.filter(a => a.status === 'publicado' && a.video).length || 'Em breve'}${m.aulas.filter(a => a.status === 'publicado' && a.video).length ? ' aulas' : ''}</span>${ico('baixo')}</summary>
      ${m.aulas.map(a => {
        const noAr = a.status === 'publicado' && a.video, pr = Eu.d.progresso[a.id], n = ++c.n;
        return noAr ? `<a class="aula-linha ${pr?.feita ? 'feita' : ''}" href="#aula-${a.id}">${miniatura(a, n, pr?.feita ? 'ok' : 'play')}<div><strong>${esc(a.titulo)}</strong><small>${[duracao(a.dur), a.indice?.length ? a.indice.length + ' trechos no índice' : '', pr?.t && !pr.feita ? 'parou em ' + tempo(pr.t) : ''].filter(Boolean).join(' · ')}</small></div>${ico('seta')}</a>`
          : `<div class="aula-linha breve">${miniatura(a, n, 'relogio')}<div><strong>${esc(a.titulo)}</strong><small>Aula em preparação</small></div><span class="tag cinza">Em breve</span></div>`;
      }).join('') || '<div class="aula-linha breve"><span></span><div><small>Nenhuma aula neste módulo ainda.</small></div></div>'}</details>`).join('')}</div>`);
}

/* ---------- Sala de aula ---------- */
let Sala = null; // { aula, curso, player, aba }
function telaAula(id) {
  const achado = acharAula(id);
  if (!achado || !achado.aula.video || (achado.aula.status !== 'publicado' && Eu.d.perfil !== 'equipe')) return moldura(MENU_ALUNO, 'aluno-cursos', `<div class="vazio">${ico('play')}<b>Aula não disponível.</b><a class="link-seta" href="#aluno-cursos">Ver cursos</a></div>`);
  const { curso, aula } = achado, fila = aulasNoAr(curso), pos = fila.findIndex(a => a.id === aula.id), feita = Eu.d.progresso[aula.id]?.feita;
  Sala = { aula, curso, fila, pos, aba: aula.indice?.length ? 'indice' : 'aulas', player: null };
  return moldura(MENU_ALUNO, 'aluno-cursos', `<div class="sala">
    <div class="sala-principal">
      <div id="player-ponto"></div>
      <div class="aula-topo"><div><a class="link-seta" href="#curso-${curso.id}" style="width:fit-content;font-size:14px">${ico('voltar')} ${esc(curso.titulo)}</a><h1>${esc(aula.titulo)}</h1><div class="nt-meta"><span class="tag ${aula.video.tipo === 'youtube' ? 'rubro' : ''}">${ico(aula.video.tipo === 'youtube' ? 'youtube' : 'filme')} ${aula.video.tipo === 'youtube' ? 'YouTube' : 'Vídeo'}</span><span>Aula ${pos + 1} de ${fila.length}</span>${aula.status !== 'publicado' ? '<span class="tag ambar">Rascunho, só a equipe vê</span>' : ''}</div></div>
        <div class="acoes"><button class="bt bt-linha bt-p bt-feito ${feita ? 'on' : ''}" id="bt-feita" data-acao="aula-feita">${ico('ok')}<span>${feita ? 'Concluída' : 'Marcar como concluída'}</span></button>${fila[pos + 1] ? `<a class="bt bt-verde bt-p" href="#aula-${fila[pos + 1].id}"><span>Próxima aula</span>${ico('seta')}</a>` : ''}</div></div>
      ${aula.desc ? `<div class="bloco"><h2>Sobre esta aula</h2><div style="display:grid;gap:10px;color:var(--mudo)">${paragrafos(aula.desc)}</div></div>` : ''}
      ${aula.anexos?.length ? `<div class="bloco"><h2>Materiais da aula</h2><div class="tarefas">${aula.anexos.filter(x => linkSeguro(x.url)).map(x => `<a class="tarefa tudo-certo" target="_blank" rel="noopener noreferrer" href="${esc(linkSeguro(x.url))}">${ico('baixar')}<span>${esc(x.titulo || x.url)}</span>${ico('fora')}</a>`).join('')}</div></div>` : ''}
      <div class="atalhos-tecla"><span><kbd>Espaço</kbd>tocar ou pausar</span><span><kbd>←</kbd><kbd>→</kbd>10 segundos</span><span><kbd>↑</kbd><kbd>↓</kbd>volume</span><span><kbd>F</kbd>tela cheia</span><span><kbd>N</kbd>anotar neste ponto</span></div>
    </div>
    <aside class="painel-aula"><div class="painel-abas" role="tablist">
      <button data-aba="indice" role="tab">${ico('lista')} Índice</button><button data-aba="aulas" role="tab">${ico('play')} Aulas</button><button data-aba="notas" role="tab">${ico('nota')} Anotações</button></div>
      <div class="painel-corpo" id="painel-corpo"></div></aside></div>`);
}
function pintarPainelAula() {
  const { aula, curso, aba } = Sala, corpo = $('#painel-corpo');
  if (!corpo) return;
  $$('.painel-abas button').forEach(b => b.classList.toggle('on', b.dataset.aba === aba));
  if (aba === 'indice') {
    const fora = PREVIA && aula.video.tipo === 'youtube';
    corpo.innerHTML = aula.indice?.length ? `${aula.indice.length > 6 ? `<div class="ind-busca"><input id="busca-indice" type="search" placeholder="Buscar no índice" aria-label="Buscar no índice"></div>` : ''}` + aula.indice.map((c, i) => fora
      ? `<a class="ind" data-i="${i}" target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/watch?v=${aula.video.id}&t=${c.t}s"><time>${tempo(c.t)}</time><span>${esc(c.titulo)}</span></a>`
      : `<button class="ind" data-ir="${c.t}" data-i="${i}"><time>${tempo(c.t)}</time><span>${esc(c.titulo)}</span><i></i></button>`).join('')
      : `<div class="vazio" style="border:0">${ico('lista')}<b>Sem índice nesta aula.</b>Quando a equipe cadastrar os trechos, você pula direto para cada assunto.</div>`;
    Sala.player && marcarTrecho(Sala.player.estado.t, Sala.player.estado.dur);
  } else if (aba === 'aulas') {
    let n = 0;
    corpo.innerHTML = curso.modulos.map(m => {
      const linhas = m.aulas.filter(a => a.status === 'publicado' && a.video).map(a => { n++; const f = Eu.d.progresso[a.id]?.feita; return `<a class="fila ${a.id === aula.id ? 'on' : ''} ${f ? 'feita' : ''}" href="#aula-${a.id}"><span class="bola">${f ? ico('ok') : n}</span><div><strong>${esc(a.titulo)}</strong><small>${duracao(a.dur) || (a.video.tipo === 'youtube' ? 'YouTube' : 'Vídeo')}</small></div></a>`; }).join('');
      return linhas ? `<div class="fila-mod">${esc(m.titulo)}</div>${linhas}` : '';
    }).join('');
    $('.fila.on', corpo)?.scrollIntoView({ block: 'nearest' });
  } else {
    const notas = (Eu.d.notas[aula.id] || []).slice().sort((a, b) => a.t - b.t);
    corpo.innerHTML = `<form class="nota-nova" id="nota-form"><textarea id="nota-texto" placeholder="Escreva uma anotação. Ela guarda o ponto do vídeo em que você está." aria-label="Nova anotação"></textarea><button class="bt bt-verde bt-p" type="submit">${ico('mais')}<span>Anotar em <b id="nota-tempo">${tempo(Sala.player?.estado.t || 0)}</b></span></button></form>
      ${notas.map(n => `<div class="nota-item"><header><button class="tag" data-ir="${n.t}">${ico('play')} ${tempo(n.t)}</button><button class="mini perigo" data-apagar-nota="${n.id}" aria-label="Apagar anotação">${ico('lixo')}</button></header><p>${esc(n.texto)}</p></div>`).join('') || '<p class="miudo" style="padding:6px 4px">Suas anotações ficam salvas neste navegador e só você vê.</p>'}`;
  }
}
function marcarTrecho(t, dur) {
  const indice = Sala?.aula.indice || [];
  let atual = -1;
  indice.forEach((c, i) => { if (t + .25 >= c.t) atual = i; });
  if (Sala.aba === 'indice') $$('#painel-corpo .ind').forEach(el => {
    const i = +el.dataset.i, ativo = i === atual;
    el.classList.toggle('on', ativo); el.classList.toggle('passou', i < atual);
    const fim = indice[i + 1]?.t ?? dur ?? 0, barra = $('i', el);
    if (barra) barra.style.setProperty('--v', ativo && fim > indice[i].t ? Math.min(100, (t - indice[i].t) / (fim - indice[i].t) * 100) + '%' : '0%');
    if (ativo && Sala.trechoVisto !== i) { Sala.trechoVisto = i; el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
  });
  const nt = $('#nota-tempo'); if (nt) nt.textContent = tempo(t);
  return atual >= 0 ? indice[atual].titulo : '';
}
function iniciarSala() {
  const { aula, fila, pos } = Sala, salvo = Eu.d.progresso[aula.id];
  Eu.d.ultima = aula.id; Eu.gravar();
  Sala.player = criarPlayer($('#player-ponto'), aula, {
    inicio: salvo && !salvo.feita && salvo.d && salvo.t < salvo.d - 8 ? salvo.t : 0,
    proxima: fila[pos + 1] || null, capa: capaCurso(Sala.curso),
    aoTempo(t, dur) {
      marcarTrecho(t, dur);
      const p = Eu.d.progresso[aula.id] || (Eu.d.progresso[aula.id] = { t: 0, d: 0, feita: false });
      p.t = t; if (dur) p.d = dur;
      if (dur && t / dur > .92 && !p.feita) { p.feita = true; pintarFeita(); }
      if (!Sala.gravouEm || Date.now() - Sala.gravouEm > 4000) { Sala.gravouEm = Date.now(); Eu.gravar(); }
    },
    aoPausar() { Eu.gravar(); },
  });
  pintarPainelAula();
}
function pintarFeita() {
  const b = $('#bt-feita'), f = Eu.d.progresso[Sala.aula.id]?.feita;
  if (b) { b.classList.toggle('on', !!f); $('span', b).textContent = f ? 'Concluída' : 'Marcar como concluída'; }
  Eu.gravar();
}

/* ---------- Reprodutor: o mesmo controle para arquivo de vídeo e para YouTube ---------- */
function criarPlayer(ponto, aula, op = {}) {
  const v = aula.video, yt = v.tipo === 'youtube', indice = aula.indice || [];
  const E = { t: op.inicio || 0, dur: aula.dur || 0, tocando: false, carga: 0, vol: Eu.d.volume ?? 1, mudo: false, vel: Eu.d.velocidade || 1, pronto: false };
  const capa = yt ? `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg` : (op.capa || '');
  ponto.innerHTML = `<div class="pl" id="pl" tabindex="0" aria-label="Reprodutor de vídeo">
    ${yt ? '' : `<video playsinline preload="metadata" src="${esc(v.url)}"></video>`}
    <div class="pl-toque"></div>
    <div class="pl-capa" ${capa ? `style="background-image:url('${capa}')"` : ''}><span class="botao-play">${ico('play')}</span></div>
    <div class="pl-centro">${ico('play')}</div><div class="pl-gira"></div>
    <div class="pl-controles">
      <div class="pl-trecho"></div>
      <div class="pl-linha" role="slider" tabindex="0" aria-label="Posição do vídeo" aria-valuemin="0"><div class="pl-trilho"><div class="pl-carga"></div><div class="pl-feito"></div><span class="pl-cortes"></span></div><div class="pl-dica"></div></div>
      <div class="pl-botoes">
        <button class="pl-b cheio" data-pl="alterna" aria-label="Tocar ou pausar">${ico('play')}</button>
        <button class="pl-b some" data-pl="volta" aria-label="Voltar 10 segundos">${ico('volta10')}<small>10</small></button>
        <button class="pl-b some" data-pl="avanca" aria-label="Avançar 10 segundos">${ico('avanca10')}<small>10</small></button>
        <span class="pl-vol"><button class="pl-b" data-pl="mudo" aria-label="Som">${ico('volume')}</button><input type="range" id="pl-volume" min="0" max="1" step="0.05" value="${E.vol}" aria-label="Volume"></span>
        <span class="pl-tempo"><b>0:00</b> <span>/ 0:00</span></span><span class="vao"></span>
        <button class="pl-b txt" data-pl="menu" aria-label="Velocidade e opções">${E.vel}×</button>
        ${yt ? '' : `<button class="pl-b some" data-pl="pip" aria-label="Janela flutuante">${ico('pip')}</button>`}
        <button class="pl-b" data-pl="tela" aria-label="Tela cheia">${ico('tela')}</button>
      </div></div></div>`;
  const pl = $('.pl', ponto), video = $('video', pl), linha = $('.pl-linha', pl), q = s => $(s, pl);
  let quadro = null, ocioso, ytOuvindo = null, ytFalhou = null, fim = null, vivo = true, ultimoAviso = 0;

  if (yt && PREVIA) {
    pl.insertAdjacentHTML('beforeend', `<div class="pl-previa" style="background-image:linear-gradient(rgba(4,38,29,.86),rgba(4,38,29,.94)),url('${img('recife')}')"><div>${ico('youtube')}<h3>O vídeo do YouTube toca aqui no site publicado</h3><p>Esta prévia não consegue incorporar o YouTube. No site hospedado, o vídeo roda neste reprodutor com o índice clicável ao lado. Por enquanto, os trechos do índice abrem direto no YouTube.</p><a class="bt bt-lima bt-p" target="_blank" rel="noopener noreferrer" href="${linkDoVideo(v)}"><span>Abrir no YouTube</span>${ico('fora')}</a></div></div>`);
  }

  /* --- comandos para as duas fontes --- */
  const mandaYT = (func, ...args) => quadro?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args }), '*');
  const C = {
    tocar() { if (yt) { if (!quadro) return montarYT(true); mandaYT('playVideo'); vigiarYT(); } else video.play().catch(() => {}); },
    pausar() { yt ? mandaYT('pauseVideo') : video.pause(); },
    ir(t) { t = Math.max(0, Math.min(t, (E.dur || 1e9) - .2)); E.t = t; if (yt) { if (!quadro) { E.t = t; return montarYT(true); } mandaYT('seekTo', t, true); } else video.currentTime = t; pintar(); op.aoTempo?.(E.t, E.dur); },
    volume(n) { E.vol = Math.max(0, Math.min(1, n)); E.mudo = E.vol === 0; if (yt) { mandaYT('setVolume', E.vol * 100); mandaYT(E.mudo ? 'mute' : 'unMute'); } else { video.volume = E.vol; video.muted = E.mudo; } Eu.d.volume = E.vol; Eu.gravar(); pintar(); },
    mudo() { E.mudo = !E.mudo; if (yt) mandaYT(E.mudo ? 'mute' : 'unMute'); else video.muted = E.mudo; pintar(); },
    velocidade(n) { E.vel = n; yt ? mandaYT('setPlaybackRate', n) : (video.playbackRate = n); Eu.d.velocidade = n; Eu.gravar(); q('[data-pl="menu"]').textContent = n + '×'; },
  };
  function alterna() { pl.classList.add('iniciou'); const c = q('.pl-centro'); c.innerHTML = ico(E.tocando ? 'pausa' : 'play'); c.classList.remove('pulsa'); void c.offsetWidth; c.classList.add('pulsa'); E.tocando ? C.pausar() : C.tocar(); }

  /* --- YouTube por mensagens (sem carregar script externo) --- */
  function montarYT(tocar, nativo = pl.classList.contains('yt-nativo')) {
    if (PREVIA) return;
    quadro?.remove();
    const origem = location.origin.startsWith('http') ? '&origin=' + encodeURIComponent(location.origin) : '';
    quadro = document.createElement('iframe');
    quadro.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; quadro.allowFullscreen = true; quadro.title = aula.titulo;
    quadro.src = `https://www.youtube.com/embed/${v.id}?enablejsapi=1&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&controls=${nativo ? 1 : 0}&disablekb=${nativo ? 0 : 1}&fs=${nativo ? 1 : 0}&autoplay=${tocar ? 1 : 0}&start=${Math.floor(E.t)}${origem}`;
    pl.prepend(quadro); pl.classList.add('iniciou', 'carregando');
    let n = 0;
    clearInterval(ytOuvindo);
    quadro.addEventListener('load', () => { ytOuvindo = setInterval(() => { if (E.pronto || ++n > 60 || !vivo) return clearInterval(ytOuvindo); quadro.contentWindow?.postMessage(JSON.stringify({ event: 'listening', id: 'arpen', channel: 'widget' }), '*'); }, 250); });
    if (tocar) vigiarYT();
  }
  /* Se o navegador não deixar comandar o vídeo, mostramos os controles do próprio YouTube. */
  function vigiarYT() { clearTimeout(ytFalhou); if (pl.classList.contains('yt-nativo')) return; ytFalhou = setTimeout(() => { if (vivo && !E.tocando && !E.jaTocou) { pl.classList.add('yt-nativo'); pl.classList.remove('carregando'); E.pronto = false; montarYT(false, true); aviso('Toque no vídeo para iniciar.'); } }, 6000); }
  function ouvirYT(ev) {
    if (!quadro || ev.source !== quadro.contentWindow) return;
    let m; try { m = typeof ev.data === 'string' ? JSON.parse(ev.data) : ev.data; } catch { return; }
    const i = m?.info; if (!i || typeof i !== 'object') return;
    if (!E.pronto) { E.pronto = true; pl.classList.remove('carregando'); mandaYT('setVolume', E.vol * 100); if (E.vel !== 1) mandaYT('setPlaybackRate', E.vel); }
    if (typeof i.duration === 'number' && i.duration) { E.dur = i.duration; lembrarDuracao(); }
    if (typeof i.currentTime === 'number' && !arrastando) E.t = i.currentTime;
    if (typeof i.videoLoadedFraction === 'number') E.carga = i.videoLoadedFraction;
    if (typeof i.muted === 'boolean') E.mudo = i.muted;
    if (typeof i.playbackRate === 'number') { E.vel = i.playbackRate; q('[data-pl="menu"]').textContent = E.vel + '×'; }
    if (typeof i.playerState === 'number') {
      const antes = E.tocando;
      E.tocando = i.playerState === 1 || i.playerState === 3;
      pl.classList.toggle('carregando', i.playerState === 3);
      if (i.playerState === 1) { E.jaTocou = true; clearTimeout(ytFalhou); }
      if (antes && !E.tocando) op.aoPausar?.();
      if (i.playerState === 0) acabou();
    }
    pintar(); avisarTempo();
  }
  function lembrarDuracao() { if (E.dur && Math.abs((aula.dur || 0) - E.dur) > 1) { aula.dur = Math.round(E.dur); Banco.gravar(); cortes(); } }
  function avisarTempo(forca) { if (forca || Date.now() - ultimoAviso > 220) { ultimoAviso = Date.now(); op.aoTempo?.(E.t, E.dur); } }

  /* --- pintura --- */
  function cortes() { q('.pl-cortes').innerHTML = E.dur ? indice.filter(c => c.t > 0 && c.t < E.dur).map(c => `<i class="pl-corte" style="left:${c.t / E.dur * 100}%"></i>`).join('') : ''; }
  function pintar() {
    const pct = E.dur ? Math.min(100, E.t / E.dur * 100) : 0;
    q('.pl-feito').style.width = pct + '%'; q('.pl-carga').style.width = E.carga * 100 + '%';
    q('.pl-tempo').innerHTML = `<b>${tempo(E.t)}</b> <span>/ ${tempo(E.dur)}</span>`;
    q('[data-pl="alterna"]').innerHTML = ico(E.tocando ? 'pausa' : 'play');
    q('[data-pl="mudo"]').innerHTML = ico(E.mudo || !E.vol ? 'mudo' : 'volume');
    pl.classList.toggle('tocando', E.tocando);
    linha.setAttribute('aria-valuemax', Math.round(E.dur)); linha.setAttribute('aria-valuenow', Math.round(E.t)); linha.setAttribute('aria-valuetext', tempo(E.t));
    let nome = ''; indice.forEach(c => { if (E.t + .25 >= c.t) nome = c.titulo; });
    q('.pl-trecho').textContent = nome;
  }
  function acabou() {
    E.tocando = false; pintar(); avisarTempo(true);
    const p = Eu.d.progresso[aula.id]; if (p) { p.feita = true; pintarFeita(); }
    if (!op.proxima || fim) return;
    let s = 8;
    pl.insertAdjacentHTML('beforeend', `<div class="pl-fim"><div><small>A seguir</small><h3>${esc(op.proxima.titulo)}</h3><div class="acoes" style="justify-content:center"><a class="bt bt-lima bt-p" href="#aula-${op.proxima.id}"><span>Assistir agora (<b id="pl-conta">${s}</b>)</span>${ico('seta')}</a><button class="bt bt-claro bt-p" data-pl="ficar"><span>Ficar nesta aula</span></button></div></div></div>`);
    fim = setInterval(() => { if (!vivo) return clearInterval(fim); s--; const c = $('#pl-conta'); if (c) c.textContent = s; if (s <= 0) { clearInterval(fim); location.hash = 'aula-' + op.proxima.id; } }, 1000);
  }
  function fecharFim() { clearInterval(fim); fim = null; q('.pl-fim')?.remove(); }
  function acordar() { pl.classList.remove('ocioso'); clearTimeout(ocioso); ocioso = setTimeout(() => !q('.pl-menu') && pl.classList.add('ocioso'), 2800); }
  function menu() {
    if (q('.pl-menu')) return q('.pl-menu').remove();
    q('.pl-controles').insertAdjacentHTML('beforebegin', `<div class="pl-menu"><small>Velocidade</small>${[0.75, 1, 1.25, 1.5, 1.75, 2].map(n => `<button data-vel="${n}" class="${E.vel === n ? 'on' : ''}">${n === 1 ? 'Normal' : n + '×'}${E.vel === n ? ico('ok') : ''}</button>`).join('')}${yt ? `<small>YouTube</small><button data-pl="nativo">Usar controles do YouTube</button>` : ''}</div>`);
  }

  /* --- eventos --- */
  if (video) {
    video.volume = E.vol; video.playbackRate = E.vel;
    video.addEventListener('loadedmetadata', () => { E.dur = video.duration; E.pronto = true; if (op.inicio) video.currentTime = op.inicio; lembrarDuracao(); cortes(); pintar(); });
    video.addEventListener('timeupdate', () => { if (!arrastando) E.t = video.currentTime; pintar(); avisarTempo(); });
    video.addEventListener('progress', () => { try { E.carga = video.buffered.length ? video.buffered.end(video.buffered.length - 1) / video.duration : 0; } catch { /* sem buffer */ } pintar(); });
    video.addEventListener('play', () => { E.tocando = true; fecharFim(); pintar(); acordar(); });
    video.addEventListener('pause', () => { E.tocando = false; pintar(); op.aoPausar?.(); });
    video.addEventListener('waiting', () => pl.classList.add('carregando'));
    ['playing', 'canplay', 'seeked'].forEach(e => video.addEventListener(e, () => pl.classList.remove('carregando')));
    video.addEventListener('ended', acabou);
    video.addEventListener('error', () => { pl.classList.remove('carregando'); aviso('Não foi possível carregar este vídeo. Confira o link no painel.'); });
  } else window.addEventListener('message', ouvirYT);

  let arrastando = false;
  const pontoDaLinha = ev => { const r = linha.getBoundingClientRect(); return Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)); };
  function dica(ev) {
    const f = pontoDaLinha(ev), t = f * E.dur, d = q('.pl-dica');
    let nome = ''; indice.forEach(c => { if (t >= c.t) nome = c.titulo; });
    d.innerHTML = `${nome ? `<b>${esc(nome)}</b>` : ''}${tempo(t)}`;
    const r = linha.getBoundingClientRect(), meio = d.offsetWidth / 2;
    d.style.left = Math.max(meio, Math.min(r.width - meio, f * r.width)) + 'px';
    return t;
  }
  linha.addEventListener('pointermove', ev => { const t = dica(ev); if (arrastando) { E.t = t; pintar(); } });
  linha.addEventListener('pointerdown', ev => { if (!E.dur) return; arrastando = true; linha.classList.add('arrasta'); linha.setPointerCapture(ev.pointerId); E.t = dica(ev); pintar(); });
  const soltar = ev => { if (!arrastando) return; arrastando = false; linha.classList.remove('arrasta'); pl.classList.add('iniciou'); C.ir(dica(ev)); };
  linha.addEventListener('pointerup', soltar); linha.addEventListener('pointercancel', soltar);
  linha.addEventListener('keydown', ev => { if (ev.key === 'ArrowRight') { C.ir(E.t + 5); ev.stopPropagation(); ev.preventDefault(); } if (ev.key === 'ArrowLeft') { C.ir(E.t - 5); ev.stopPropagation(); ev.preventDefault(); } });
  q('#pl-volume').addEventListener('input', ev => C.volume(+ev.target.value));
  pl.addEventListener('pointermove', acordar); pl.addEventListener('pointerleave', () => E.tocando && !q('.pl-menu') && pl.classList.add('ocioso'));
  q('.pl-toque').addEventListener('click', () => { if (q('.pl-menu')) return q('.pl-menu').remove(); alterna(); acordar(); });
  q('.pl-toque').addEventListener('dblclick', telaCheia);
  q('.pl-capa').addEventListener('click', alterna);
  function telaCheia() { (document.fullscreenElement ? document.exitFullscreen() : (pl.requestFullscreen?.() || (video?.webkitEnterFullscreen?.(), Promise.resolve())))?.catch?.(() => aviso('A tela cheia não está disponível aqui.')); }
  pl.addEventListener('click', ev => {
    const b = ev.target.closest('[data-pl],[data-vel]'); if (!b) return;
    if (b.dataset.vel) { C.velocidade(+b.dataset.vel); return q('.pl-menu')?.remove(); }
    const a = b.dataset.pl;
    if (a === 'alterna') alterna(); else if (a === 'volta') C.ir(E.t - 10); else if (a === 'avanca') C.ir(E.t + 10); else if (a === 'mudo') C.mudo(); else if (a === 'menu') menu();
    else if (a === 'tela') telaCheia(); else if (a === 'ficar') fecharFim();
    else if (a === 'pip') (document.pictureInPictureElement ? document.exitPictureInPicture() : video.requestPictureInPicture?.())?.catch?.(() => aviso('Janela flutuante indisponível neste navegador.'));
    else if (a === 'nativo') { q('.pl-menu')?.remove(); pl.classList.add('yt-nativo'); E.pronto = false; montarYT(E.tocando, true); }
  });
  function teclas(ev) {
    if (!vivo || ev.target.closest('input, textarea, select, [contenteditable]') || ev.metaKey || ev.ctrlKey || ev.altKey) return;
    const k = ev.key.toLowerCase(); let usou = true;
    if (k === ' ' || k === 'k') { if (ev.target.closest('button, a') && k === ' ') return; alterna(); }
    else if (k === 'arrowright' || k === 'l') C.ir(E.t + 10); else if (k === 'arrowleft' || k === 'j') C.ir(E.t - 10);
    else if (k === 'arrowup') C.volume(E.vol + .1); else if (k === 'arrowdown') C.volume(E.vol - .1);
    else if (k === 'm') C.mudo(); else if (k === 'f') telaCheia();
    else if (k === 'n') { Sala.aba = 'notas'; pintarPainelAula(); $('#nota-texto')?.focus(); }
    else if (/^[0-9]$/.test(k) && E.dur) C.ir(E.dur * k / 10); else usou = false;
    if (usou) { ev.preventDefault(); acordar(); }
  }
  document.addEventListener('keydown', teclas);
  cortes(); pintar();
  if (yt && !PREVIA && E.t > 0) op.aoTempo?.(E.t, E.dur);

  return {
    estado: E, ir(t) { pl.classList.add('iniciou'); fecharFim(); C.ir(t); if (!E.tocando) C.tocar(); }, pausar: C.pausar,
    destruir() { vivo = false; clearInterval(ytOuvindo); clearInterval(fim); clearTimeout(ytFalhou); clearTimeout(ocioso); document.removeEventListener('keydown', teclas); window.removeEventListener('message', ouvirYT); video?.pause(); Eu.gravar(); },
  };
}

function telaEncontros() {
  const prox = proximosEncontros(), hoje = new Date().toISOString().slice(0, 10), passados = publicados(Banco.dados.encontros).filter(e => e.data < hoje);
  return moldura(MENU_ALUNO, 'aluno-encontros', `${topoApp('Encontros ao vivo', 'Um encontro. <em>Muitas perspectivas.</em>')}
    ${prox.length ? prox.map(cartaoEncontro).join('') : `<div class="vazio">${ico('agenda')}<b>A agenda ganha vida por aqui.</b>Assim que a equipe publicar um encontro, você encontra o tema, a data e o acesso à sala neste espaço.</div>`}
    <div class="numeros">${[['Prepare suas perguntas', 'Traga situações da rotina para enriquecer a conversa.'], ['Participe do encontro', 'Acesse a sala pelo link disponível na agenda.'], ['Leve o aprendizado', 'Consulte os materiais publicados depois da capacitação.']].map((x, i) => `<div class="bloco rv" style="--d:${i}"><h2 style="font-size:22px">${x[0]}</h2><p class="mudo">${x[1]}</p></div>`).join('')}</div>
    ${passados.length ? `<section class="bloco"><h2>Encontros anteriores</h2>${passados.map(e => `<div class="aviso-linha lido"><span class="ponto"></span><div><h3>${esc(e.titulo)}</h3><p>${dataBR(e.data)}${linkSeguro(e.link) ? ` · <a class="fonte" target="_blank" rel="noopener noreferrer" href="${esc(linkSeguro(e.link))}">abrir link</a>` : ''}</p></div></div>`).join('')}</section>` : ''}`);
}
function telaMateriaisAluno() {
  const lista = publicados(Banco.dados.materiais);
  return moldura(MENU_ALUNO, 'aluno-materiais', `${topoApp('Biblioteca de apoio', 'Recursos para <em>levar com você.</em>')}
    ${lista.length ? `<div class="cartoes">${lista.map(cartaoMaterial).join('')}</div>` : `<div class="vazio">${ico('pasta')}<b>Nenhum material publicado ainda.</b>Cartilhas, modelos e apresentações aparecem aqui.</div>`}`);
}
function telaAvisos() {
  const lista = publicados(Banco.dados.avisos);
  return moldura(MENU_ALUNO, 'aluno-avisos', `${topoApp('Fique por dentro', 'Seus <em>avisos.</em>', avisosNovos() ? `<button class="bt bt-linha bt-p" data-acao="ler-tudo">${ico('ok')}<span>Marcar todos como lidos</span></button>` : '')}
    <section class="bloco">${lista.map(linhaAviso).join('') || `<div class="vazio" style="border:0">${ico('sino')}<b>Nenhum aviso.</b></div>`}</section>`);
}

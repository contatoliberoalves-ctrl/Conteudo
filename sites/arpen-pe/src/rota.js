/* Navegação entre as páginas (pelo # do endereço), movimento e todos os cliques. */
const Rota = {
  atual: 'inicio',
  ler() { return decodeURIComponent(location.hash.slice(1)) || 'inicio'; },
  tela(r) {
    const [base, ...resto] = r.split('-'), id = resto.join('-');
    const precisa = perfil => { if (!Eu.d.perfil || (perfil === 'equipe' && Eu.d.perfil !== 'equipe')) { Rota.depois = r; return paginaEntrar(); } };
    if (r === 'inicio') return paginaInicio();
    if (r === 'noticias' || r === 'orientacoes') return paginaColecao(r);
    if (base === 'noticia') return paginaLeitura('noticias', id);
    if (base === 'orientacao') return paginaLeitura('orientacoes', id);
    if (r === 'materiais') return paginaMateriais();
    if (base === 'cidadao') return paginaCidadao(id);
    if (r === 'entrar') return paginaEntrar();
    if (base === 'aluno' || base === 'curso' || base === 'aula') {
      const bloqueio = precisa('aluno'); if (bloqueio) return bloqueio;
      if (base === 'curso') return telaCurso(id);
      if (base === 'aula') return telaAula(id);
      return { '': telaAlunoInicio, cursos: telaCursos, encontros: telaEncontros, materiais: telaMateriaisAluno, avisos: telaAvisos }[id]?.() || telaAlunoInicio();
    }
    if (base === 'painel') {
      const bloqueio = precisa('equipe'); if (bloqueio) return bloqueio;
      if (id === 'cursos') return telaPainelCursos();
      return COLECOES[id] ? telaColecao(id) : telaPainel();
    }
    return paginaInicio();
  },
  pintar() {
    const r = this.ler();
    if (Sala?.player) { Sala.player.destruir(); Sala = null; }
    this.atual = r;
    const html = this.tela(r), app = /class="area"/.test(html.slice(0, 40));
    document.body.classList.toggle('app-modo', app);
    $('#app').innerHTML = html;
    const base = r.split('-')[0], grupo = { noticia: 'noticias', orientacao: 'orientacoes' }[base] || base;
    $$('#menu a').forEach(a => a.classList.toggle('on', a.dataset.rota === grupo));
    if (r === 'noticias' || r === 'orientacoes') listarColecao(r);
    if (Sala && $('#player-ponto')) iniciarSala();
    if (app && base === 'painel') depoisDePintarPainel();
    revelar(); contar();
  },
};

/* Elementos que entram ao rolar: só ficam escondidos quando o script está ativo. */
const observador = 'IntersectionObserver' in window ? new IntersectionObserver(itens => itens.forEach(i => { if (i.isIntersecting) { i.target.classList.add('visto'); observador.unobserve(i.target); } }), { rootMargin: '0px 0px -8% 0px' }) : null;
function revelar() { $$('.rv:not(.visto)').forEach(el => observador ? observador.observe(el) : el.classList.add('visto')); }
function contar() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  $$('[data-conta]').forEach(el => {
    const alvo = +el.dataset.conta; if (!alvo) return;
    const ini = performance.now(), passo = agora => { const f = Math.min(1, (agora - ini) / 900); el.textContent = Math.round(alvo * (1 - Math.pow(1 - f, 3))); if (f < 1 && el.isConnected) requestAnimationFrame(passo); };
    requestAnimationFrame(passo);
  });
}
function mudarPagina() {
  fecharGaveta(); fecharJanela();
  $('#menu').classList.remove('aberto'); $('#menu-botao').setAttribute('aria-expanded', 'false');
  const troca = () => { Rota.pintar(); window.scrollTo(0, 0); };
  document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches ? document.startViewTransition(troca) : troca();
}

/* ---------- Cliques ---------- */
document.addEventListener('click', ev => {
  const alvo = s => ev.target.closest(s);
  let el;
  if ((el = alvo('[data-adm]')) && !el.matches('input')) return acaoAdm(el, ev);
  if (alvo('#menu-botao')) { const aberto = $('#menu').classList.toggle('aberto'); $('#menu-botao').setAttribute('aria-expanded', aberto); return; }
  if (ev.target === $('#janela')) return fecharJanela();
  if ((el = alvo('[data-filtro]'))) { Lista.filtro = el.dataset.filtro; $$('[data-filtro]').forEach(c => c.classList.toggle('on', c === el)); return listarColecao(Rota.atual); }
  if ((el = alvo('[data-escolha]'))) { Guia.escolha = +el.dataset.escolha; Guia.passo = 1; Guia.feitos = []; return redesenharCidadao(); }
  if ((el = alvo('[data-passo]'))) { Guia.passo = +el.dataset.passo; return redesenharCidadao(); }
  if ((el = alvo('[data-resposta]'))) { if (Quiz.respostas[Quiz.i] === undefined) { Quiz.respostas[Quiz.i] = +el.dataset.resposta; redesenharCidadao(); } return; }
  if ((el = alvo('[data-entrar]'))) { Eu.d.perfil = el.dataset.entrar; Eu.d.nome = $('#entrar-nome').value.trim(); Eu.gravar(); const ir = Rota.depois || (Eu.d.perfil === 'equipe' ? 'painel' : 'aluno'); Rota.depois = null; if (Rota.ler() === ir) mudarPagina(); else location.hash = ir; return; }
  if ((el = alvo('[data-lido]'))) { Eu.d.lidos.push(el.dataset.lido); Eu.gravar(); return Rota.pintar(); }
  if ((el = alvo('[data-agenda]'))) return baixarAgenda(el.dataset.agenda);
  if ((el = alvo('[data-aba]'))) { Sala.aba = el.dataset.aba; Sala.trechoVisto = null; return pintarPainelAula(); }
  if ((el = alvo('[data-ir]'))) { Sala?.player?.ir(+el.dataset.ir); if (innerWidth < 1080) $('#pl')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
  if ((el = alvo('[data-apagar-nota]'))) { const l = Eu.d.notas[Sala.aula.id]; Eu.d.notas[Sala.aula.id] = l.filter(n => n.id !== el.dataset.apagarNota); Eu.gravar(); return pintarPainelAula(); }
  if ((el = alvo('[data-acao]'))) {
    switch (el.dataset.acao) {
      case 'banner': baixar(bannerSVG(), 'Banner-ARPEN-PE-modelo.svg', 'image/svg+xml'); break;
      case 'creditos': janela(`<h2>Fotografias e créditos</h2><p class="mudo">Imagens de apoio editorial, sem vínculo dos fotografados com a ARPEN.</p>${CREDITOS_FOTOS.map(c => `<a class="fonte" href="${c[1]}" target="_blank" rel="noopener noreferrer">${c[0]} ${ico('fora')}</a>`).join('')}`); break;
      case 'concluir-guia': { const id = Guia.id; if (!Eu.d.guias.includes(id)) { Eu.d.guias.push(id); Eu.gravar(); } $('#guia-fim').innerHTML = `<div class="festa">${ico('ok')}<div><h3>${id === 'obito' ? 'Orientação concluída.' : 'Mais um caminho descoberto.'}</h3><p>${id === 'obito' ? 'Esperamos que estas informações ajudem neste momento.' : 'Seu progresso foi salvo. Você pode explorar outros guias quando quiser.'}</p><a class="link-seta" href="#cidadao">Voltar aos serviços ${ico('seta')}</a></div></div>`; break; }
      case 'quiz-comecar': Quiz = { i: 0, respostas: [], comecou: true }; redesenharCidadao(); break;
      case 'quiz-proxima': Quiz.i++; if (Quiz.i === DESAFIO.length) { Eu.d.desafio = Math.max(Eu.d.desafio, Quiz.respostas.filter((a, i) => a === DESAFIO[i].certa).length); Eu.d.desafioFeito = true; Eu.gravar(); } redesenharCidadao(); break;
      case 'sair': Eu.d.perfil = null; Eu.gravar(); location.hash = 'inicio'; break;
      case 'aula-feita': { const p = Eu.d.progresso[Sala.aula.id] || (Eu.d.progresso[Sala.aula.id] = { t: 0, d: 0 }); p.feita = !p.feita; pintarFeita(); if (Sala.aba === 'aulas') pintarPainelAula(); break; }
      case 'ler-tudo': Eu.d.lidos = publicados(Banco.dados.avisos).map(a => a.id); Eu.gravar(); Rota.pintar(); aviso('Todos os avisos marcados como lidos.'); break;
    }
  }
});

/* ---------- Digitação e trocas ---------- */
let esperaGravar;
document.addEventListener('input', ev => {
  const t = ev.target;
  if (t.id === 'busca-colecao') { Lista.busca = t.value; return listarColecao(Rota.atual); }
  if (t.id === 'busca-duvida') { buscaDuvida = t.value; $('#lista-duvidas').innerHTML = listaDuvidas(); return; }
  if (t.id === 'busca-indice') return $$('#painel-corpo .ind').forEach(el => { el.hidden = !contem(el.textContent, t.value); });
  if (t.id === 'busca-adm') { Adm.busca = t.value; Rota.pintar(); const b = $('#busca-adm'); b.focus(); b.setSelectionRange(b.value.length, b.value.length); return; }
  if (t.id === 'aula-link') return previaVideo();
  if (t.id === 'aula-indice') return previaIndice();
  if (t.id === 'colar-texto' && $('#colar-conta')) { const n = lerAulasColadas(t.value); $('#colar-conta').textContent = n.length ? `${n.length} ${n.length === 1 ? 'aula reconhecida' : 'aulas reconhecidas'}, ${n.filter(x => x.video).length} com vídeo.` : 'Nenhuma aula reconhecida ainda.'; return; }
  if (t.dataset.campoCurso || t.dataset.campoModulo) {
    const c = cursoAtual();
    if (t.dataset.campoCurso) { c[t.dataset.campoCurso] = t.value; if (t.dataset.campoCurso === 'titulo') { const s = $('.lista-cursos a.on strong'); if (s) s.textContent = t.value; } }
    else c.modulos.find(m => m.id === t.dataset.campoModulo).titulo = t.value;
    clearTimeout(esperaGravar); esperaGravar = setTimeout(() => salvarAdm(), 500);
  }
});
document.addEventListener('change', ev => {
  const t = ev.target;
  if (t.matches('input[data-adm]')) return acaoAdm(t, ev);
  if (t.dataset.feito !== undefined) { const i = +t.dataset.feito; Guia.feitos = t.checked ? [...new Set([...Guia.feitos, i])] : Guia.feitos.filter(x => x !== i); return; }
  if (t.id === 'importar-arquivo' && t.files[0]) {
    const leitor = new FileReader();
    leitor.onload = () => { try { const d = JSON.parse(leitor.result); if (!Array.isArray(d.cursos) || !Array.isArray(d.noticias)) throw 0; Banco.dados = Object.assign(conteudoInicial(), d); Banco.gravar(); Rota.pintar(); aviso('Cópia carregada.'); } catch { aviso('Este arquivo não é uma cópia do conteúdo do portal.'); } };
    leitor.readAsText(t.files[0]);
  }
});
document.addEventListener('submit', ev => {
  ev.preventDefault();
  if (ev.target.id === 'gaveta-form') {
    const falta = $$('[required]', ev.target).find(c => !c.value.trim());
    if (falta) { aviso('Preencha: ' + falta.closest('.campo').querySelector('span').firstChild.textContent.trim() + '.'); return falta.focus(); }
    if (Adm.gaveta.tipo === 'aula' ? salvarAula() : salvarRegistro()) { fecharGaveta(); Rota.pintar(); }
  }
  if (ev.target.id === 'nota-form') {
    const texto = $('#nota-texto').value.trim(); if (!texto) return $('#nota-texto').focus();
    (Eu.d.notas[Sala.aula.id] ||= []).push({ id: novoId(), t: Math.floor(Sala.player?.estado.t || 0), texto });
    Eu.gravar(); pintarPainelAula(); aviso('Anotação salva.');
  }
});
document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && $('.gaveta')) fecharGaveta(); });

/* ---------- Movimento que acompanha o ponteiro ---------- */
document.addEventListener('pointermove', ev => {
  if (ev.pointerType === 'touch') return;
  const h = $('#heroi'), c = $('#cena');
  if (h) { const r = h.getBoundingClientRect(); if (ev.clientY < r.bottom) { const i = $('.heroi-img', h); i.style.setProperty('--px', ((ev.clientX - r.left) / r.width - .5) * -18 + 'px'); i.style.setProperty('--py', ((ev.clientY - r.top) / r.height - .5) * -12 + 'px'); } }
  if (c) { const r = c.getBoundingClientRect(); if (ev.clientY > r.top - 100 && ev.clientY < r.bottom + 100) { const p = $('.passaporte', c); p.style.setProperty('--rx', ((ev.clientX - r.left) / r.width - .5) * 26 + 'deg'); p.style.setProperty('--ry', ((ev.clientY - r.top) / r.height - .5) * -18 + 'deg'); } }
}, { passive: true });
window.addEventListener('scroll', () => $('#topo').classList.toggle('rolou', scrollY > 12), { passive: true });
window.addEventListener('hashchange', mudarPagina);
window.addEventListener('pagehide', () => Eu.gravar());

document.documentElement.classList.add('js');
Banco.ler(); Eu.ler();
Rota.pintar();

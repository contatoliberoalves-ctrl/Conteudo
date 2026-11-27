import { html, useState, useEffect, useMemo } from '../vendor/preact-htm.mjs';
import { sb, mensagemErro, TIPOS, SUBTIPOS, MODOS, LETRAS, dividir, juntar, gerarCodigo, fmt, textoGabarito, valorInicial } from './core.js';
import { Icone, Marca, Responder, Toast, useToast } from './ui.js';
import { useSessao, Login, useSalaProf, urlEntrada, rotuloFase } from './prof.js';

export const PECAS = ['Mandado de Segurança Individual', 'Mandado de Segurança Coletivo', 'Habeas Corpus', 'Habeas Data', 'Mandado de Injunção', 'Ação Popular', 'Ação Civil Pública', 'ADI', 'ADC', 'ADPF', 'ADO', 'Reclamação Constitucional', 'Recurso Extraordinário', 'Recurso Ordinário Constitucional', 'Agravo de Instrumento', 'Apelação'];

export function novoRascunho(tipo, modo) {
  switch (tipo) {
    case 'ce': return { afirmacao: '', certo: true, comentario: '' };
    case 'multipla': return { enunciado: '', alternativas: ['', '', '', ''], correta: 0, comentario: '' };
    case 'multi': return { enunciado: '', opcoes: ['', '', ''], corretas: [], comentario: '' };
    case 'ordenar': return { enunciado: '', itens: ['', '', ''], comentario: '' };
    case 'artigo': return { enunciado: '', dica: '', aceitas: [''], resposta: '', comentario: '' };
    case 'texto': return { enunciado: '', palavras: [''], modelo: '', comentario: '' };
    case 'etapas':
      if (modo === 'peca') return { enunciado: '', comentario: '', etapas: [
        { titulo: 'Qual é a peça cabível?', tipo: 'multipla', enunciado: '', alternativas: PECAS.slice(0, 8), correta: 0, comentario: '' },
        { titulo: 'Para quem a peça é endereçada?', tipo: 'multipla', enunciado: '', alternativas: ['', '', '', ''], correta: 0, comentario: '' },
        { titulo: 'Qual o fundamento do cabimento / legitimidade?', tipo: 'artigo', enunciado: '', dica: '', aceitas: [''], resposta: '', comentario: '' },
        { titulo: 'Quem fica no polo passivo?', tipo: 'multi', enunciado: '', opcoes: ['', '', ''], corretas: [], comentario: '' },
        { titulo: 'Quais teses de mérito entram?', tipo: 'multi', enunciado: '', opcoes: ['', '', '', ''], corretas: [], comentario: '' },
        { titulo: 'Monte a estrutura da peça', tipo: 'ordenar', enunciado: '', itens: ['Endereçamento', 'Qualificação das partes', 'Dos fatos', 'Do cabimento e da legitimidade', 'Do direito', 'Da liminar', 'Dos pedidos', 'Valor da causa', 'Fechamento'], comentario: '' },
        { titulo: 'Quais pedidos não podem faltar?', tipo: 'multi', enunciado: '', opcoes: ['', '', '', ''], corretas: [], comentario: '' },
      ] };
      return { enunciado: '', comentario: '', etapas: [
        { titulo: 'Qual é o problema jurídico (instituto)?', tipo: 'multipla', enunciado: '', alternativas: ['', '', '', ''], correta: 0, comentario: '' },
        { titulo: 'Qual o fundamento? Ache o artigo', tipo: 'artigo', enunciado: '', dica: '', aceitas: [''], resposta: '', comentario: '' },
        { titulo: 'Qual a conclusão?', tipo: 'multipla', enunciado: '', alternativas: ['Sim', 'Não'], correta: 0, comentario: '' },
        { titulo: 'Escreva a tese em uma frase', tipo: 'texto', enunciado: '', palavras: [''], modelo: '', comentario: '' },
      ] };
  }
  return {};
}
const tipoPadrao = (modo) => ({ quiz: 'ce', raciocinio: 'etapas', peca: 'etapas', artigo: 'artigo' }[modo] || 'multipla');
const tempoPadrao = (tipo) => ({ ce: 20, multipla: 30, multi: 45, ordenar: 60, artigo: 90, texto: 120, etapas: 240 }[tipo] || 60);

// ---------- entrada ----------
export function Admin({ rota, ir }) {
  const sessao = useSessao();
  if (sessao.carregando) return html`<div class="entrar-wrap"><div class="pontinhos"><span></span><span></span><span></span></div></div>`;
  if (!sessao.user || !sessao.admin) return html`<${Login} sessao=${sessao} />`;
  const [, , sub, id] = rota;
  return html`
    <div class="admin">
      <header class="topo"><a href="#/admin" class="marca" style="text-decoration:none"><${Marca} titulo="Painel do professor" /></a>
        <div class="acoes"><span class="fraco" style="font-size:13px">${sessao.user.email}</span><button class="btn btn-s btn-peq" onClick=${() => sb.auth.signOut()}><${Icone} n="sair" t="16" /> Sair</button></div></header>
      ${sub === 'aula' ? html`<${EditorAula} id=${id} ir=${ir} />` : sub === 'sala' ? html`<${ControleSala} codigo=${id} ir=${ir} />` : html`<${Painel} ir=${ir} aba=${sub || 'aulas'} />`}
    </div>`;
}

function Painel({ ir, aba }) {
  return html`<div class="admin-corpo">
    <div class="hero"><span class="sobrelinha" style="opacity:.85">Método VDE · aulas interativas</span><h1>Jogos da Ordem</h1>
      <p>Monte desafios, transmita a tela no StreamYard e libere o gabarito para a turma em tempo real.</p></div>
    <div class="abas" style="margin-top:22px">
      ${[['aulas', 'Aulas e desafios'], ['salas', 'Salas e resultados'], ['alunos', 'Alunos VDE'], ['ajuda', 'Como usar']].map(([k, t]) => html`<button class=${aba === k ? 'on' : ''} onClick=${() => ir(`#/admin/${k}`)}>${t}</button>`)}
    </div>
    ${aba === 'salas' ? html`<${Salas} ir=${ir} />` : aba === 'alunos' ? html`<${Alunos} />` : aba === 'ajuda' ? html`<${Ajuda} />` : html`<${Aulas} ir=${ir} />`}
  </div>`;
}

function Aulas({ ir }) {
  const [aulas, setAulas] = useState(null);
  const [nova, setNova] = useState(false);
  const [iniciar, setIniciar] = useState(null);
  const [toast, mostrar] = useToast();
  const carregar = async () => {
    const { data, error } = await sb.from('aovivo_aulas').select('*, aovivo_perguntas(count)').order('atualizado_em', { ascending: false });
    if (error) mostrar(mensagemErro(error)); setAulas(data || []);
  };
  useEffect(() => { carregar(); }, []);
  const criar = async (modo) => {
    const { data, error } = await sb.from('aovivo_aulas').insert({ titulo: MODOS[modo].nome, modo, permitir_indice: true }).select().single();
    if (error) return mostrar(mensagemErro(error));
    ir(`#/admin/aula/${data.id}`);
  };
  const duplicar = async (a) => {
    const { data: qs } = await sb.from('aovivo_perguntas').select('*').eq('aula_id', a.id).order('ordem');
    const { data: n, error } = await sb.from('aovivo_aulas').insert({ titulo: a.titulo + ' (cópia)', descricao: a.descricao, modo: a.modo, permitir_indice: a.permitir_indice, vinheta: a.vinheta }).select().single();
    if (error) return mostrar(mensagemErro(error));
    if (qs?.length) await sb.from('aovivo_perguntas').insert(qs.map(({ id, aula_id, ...q }) => ({ ...q, aula_id: n.id })));
    mostrar('Aula duplicada'); carregar();
  };
  const excluir = async (a) => { if (!confirm(`Excluir "${a.titulo}"? As salas e resultados dela também somem.`)) return; await sb.from('aovivo_aulas').delete().eq('id', a.id); carregar(); };
  const importar = async () => {
    const txt = prompt('Cole o JSON da aula (exportado pelo painel):'); if (!txt) return;
    try { await importarAula(JSON.parse(txt)); mostrar('Aula importada'); carregar(); } catch (e) { alert('JSON inválido: ' + e.message); }
  };
  return html`
    <div class="linha-flex entre" style="margin-top:24px">
      <h2 style="margin:0">Suas aulas</h2>
      <div class="linha-flex"><button class="btn btn-s" onClick=${importar}>Importar JSON</button><button class="btn btn-p" onClick=${() => setNova(!nova)}><${Icone} n="mais" t="18" /> Nova aula</button></div>
    </div>
    ${nova && html`<div class="grade-aulas" style="animation:surge .3s">${Object.entries(MODOS).map(([k, m]) => html`
      <button class="cartao" style="text-align:left;border:2px solid transparent;cursor:pointer" onClick=${() => criar(k)}>
        <span class="chip">${m.nome}</span><p class="suave" style="margin:10px 0 0;font-size:14px">${m.desc}</p></button>`)}</div>`}
    ${!aulas ? html`<div class="vazio"><div class="pontinhos"><span></span><span></span><span></span></div></div>`
      : !aulas.length ? html`<div class="vazio">Nenhuma aula ainda. Clique em <b>Nova aula</b>.</div>`
      : html`<div class="grade-aulas">${aulas.map((a) => html`
        <div class="aula-card" key=${a.id}>
          <div class="capa" data-sigla=${(MODOS[a.modo]?.nome || 'VDE').split(' ')[0].slice(0, 4).toUpperCase()}><span class="chip branco">${MODOS[a.modo]?.nome || a.modo}</span><h3>${a.titulo}</h3></div>
          <div class="corpo">
            <div class="suave" style="font-size:14px">${a.aovivo_perguntas?.[0]?.count || 0} desafios ${a.permitir_indice ? '· índice liberado' : ''}</div>
            ${a.descricao && html`<div class="fraco" style="font-size:13px">${a.descricao}</div>`}
            <div class="acoes">
              <button class="btn btn-p btn-peq" onClick=${() => setIniciar(a)} disabled=${!a.aovivo_perguntas?.[0]?.count}><${Icone} n="play" t="14" /> Iniciar ao vivo</button>
              <button class="btn btn-s btn-peq" onClick=${() => ir(`#/admin/aula/${a.id}`)}><${Icone} n="editar" t="14" /> Editar</button>
              <button class="btn btn-s btn-peq" onClick=${() => duplicar(a)}><${Icone} n="copiar" t="14" /></button>
              <button class="btn btn-perigo btn-peq" onClick=${() => excluir(a)}><${Icone} n="lixo" t="14" /></button>
            </div></div></div>`)}</div>`}
    ${iniciar && html`<${IniciarSala} aula=${iniciar} fechar=${() => setIniciar(null)} ir=${ir} />`}
    <${Toast} msg=${toast} />`;
}

export async function importarAula(j) {
  const { data: a, error } = await sb.from('aovivo_aulas').insert({ titulo: j.titulo, descricao: j.descricao || '', modo: j.modo || 'misto', permitir_indice: j.permitir_indice !== false }).select().single();
  if (error) throw error;
  const qs = (j.perguntas || []).map((q, i) => { const d = dividir(q.tipo, q.r || q); return { aula_id: a.id, ordem: i, tipo: q.tipo, titulo: q.titulo || '', tempo: q.tempo ?? tempoPadrao(q.tipo), pontos: q.pontos ?? 1000, conteudo: d.c, gabarito: d.g }; });
  if (qs.length) { const { error: e2 } = await sb.from('aovivo_perguntas').insert(qs); if (e2) throw e2; }
  return a;
}

function IniciarSala({ aula, fechar, ir }) {
  const [exigir, setExigir] = useState(false);
  const [indo, setIndo] = useState(false);
  const criar = async () => {
    setIndo(true);
    const { count } = await sb.from('aovivo_perguntas').select('id', { count: 'exact', head: true }).eq('aula_id', aula.id);
    let sala, erro;
    for (let k = 0; k < 4 && !sala; k++) {
      const { data, error } = await sb.from('aovivo_salas').insert({ codigo: gerarCodigo(), aula_id: aula.id, titulo: aula.titulo, modo: aula.modo, permitir_indice: aula.permitir_indice, vinheta: aula.vinheta !== false, exigir_lista: exigir, total: count || 0 }).select().single();
      sala = data; erro = error;
    }
    setIndo(false);
    if (!sala) return alert(mensagemErro(erro));
    window.open(`#/tela/${sala.codigo}`, `tela-${sala.codigo}`);
    ir(`#/admin/sala/${sala.codigo}`);
  };
  return html`<div class="gaveta-fundo" onClick=${fechar}></div>
    <div class="cartao" style="position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:41;width:min(520px,92vw);animation:surge .3s">
      <span class="chip">${MODOS[aula.modo]?.nome}</span><h2 style="margin:10px 0 6px">${aula.titulo}</h2>
      <p class="suave" style="margin:0 0 16px;font-size:14px">Cria uma sala com código e QR code. A tela de transmissão abre numa janela nova: compartilhe essa janela no StreamYard.</p>
      <label class="linha-flex" style="margin-bottom:18px;cursor:pointer"><input type="checkbox" checked=${exigir} onChange=${(e) => setExigir(e.target.checked)} />
        <span>Só aceitar e-mails da lista de <b>Alunos VDE</b></span></label>
      <div class="linha-flex"><button class="btn btn-p cresce" disabled=${indo} onClick=${criar}>${indo ? 'Criando…' : 'Criar sala e abrir a tela'}</button><button class="btn btn-s" onClick=${fechar}>Cancelar</button></div>
    </div>`;
}

// ---------- editor ----------
function EditorAula({ id, ir }) {
  const [aula, setAula] = useState(null);
  const [qs, setQs] = useState([]);
  const [sel, setSel] = useState(0);
  const [sujo, setSujo] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [previa, setPrevia] = useState(false);
  const [toast, mostrar] = useToast();
  useEffect(() => { (async () => {
    const { data: a } = await sb.from('aovivo_aulas').select('*').eq('id', id).single();
    const { data: p } = await sb.from('aovivo_perguntas').select('*').eq('aula_id', id).order('ordem').order('id');
    setAula(a); setQs((p || []).map((q) => ({ id: q.id, tipo: q.tipo, titulo: q.titulo, tempo: q.tempo, pontos: q.pontos, r: juntar(q.tipo, q.conteudo, q.gabarito) })));
  })(); }, [id]);
  useEffect(() => { const f = (e) => { if (sujo) { e.preventDefault(); e.returnValue = ''; } }; addEventListener('beforeunload', f); return () => removeEventListener('beforeunload', f); }, [sujo]);
  if (!aula) return html`<div class="vazio"><div class="pontinhos"><span></span><span></span><span></span></div></div>`;
  const mudaAula = (k, v) => { setAula({ ...aula, [k]: v }); setSujo(true); };
  const mudaQ = (i, nq) => { const n = [...qs]; n[i] = nq; setQs(n); setSujo(true); };
  const add = (tipo) => { const t = tipo || tipoPadrao(aula.modo); setQs([...qs, { tipo: t, titulo: '', tempo: tempoPadrao(t), pontos: 1000, r: novoRascunho(t, aula.modo) }]); setSel(qs.length); setSujo(true); };
  const mover = (i, d) => { const j = i + d; if (j < 0 || j >= qs.length) return; const n = [...qs]; [n[i], n[j]] = [n[j], n[i]]; setQs(n); setSel(j); setSujo(true); };
  const remover = (i) => { if (!confirm('Remover este desafio?')) return; setQs(qs.filter((_, k) => k !== i)); setSel(Math.max(0, i - 1)); setSujo(true); };
  const salvar = async () => {
    setSalvando(true);
    try {
      const { error: e1 } = await sb.from('aovivo_aulas').update({ titulo: aula.titulo, descricao: aula.descricao, modo: aula.modo, permitir_indice: aula.permitir_indice, vinheta: aula.vinheta !== false, atualizado_em: new Date().toISOString() }).eq('id', id);
      if (e1) throw e1;
      const { data: antigos } = await sb.from('aovivo_perguntas').select('id').eq('aula_id', id);
      const manter = new Set(qs.filter((q) => q.id).map((q) => q.id));
      const apagar = (antigos || []).filter((x) => !manter.has(x.id)).map((x) => x.id);
      if (apagar.length) await sb.from('aovivo_perguntas').delete().in('id', apagar);
      const novos = [...qs];
      for (let i = 0; i < qs.length; i++) {
        const q = qs[i]; const d = dividir(q.tipo, q.r);
        const linha = { aula_id: id, ordem: i, tipo: q.tipo, titulo: q.titulo || '', tempo: Number(q.tempo) || 0, pontos: Number(q.pontos) || 1000, conteudo: d.c, gabarito: d.g };
        if (q.id) { const { error } = await sb.from('aovivo_perguntas').update(linha).eq('id', q.id); if (error) throw error; }
        else { const { data, error } = await sb.from('aovivo_perguntas').insert(linha).select('id').single(); if (error) throw error; novos[i] = { ...q, id: data.id }; }
      }
      setQs(novos); setSujo(false); mostrar('Aula salva');
    } catch (e) { alert(mensagemErro(e)); }
    setSalvando(false);
  };
  const exportar = () => {
    const j = { titulo: aula.titulo, descricao: aula.descricao, modo: aula.modo, permitir_indice: aula.permitir_indice, perguntas: qs.map(({ id, ...q }) => q) };
    const b = new Blob([JSON.stringify(j, null, 2)], { type: 'application/json' }); const a = document.createElement('a');
    a.href = URL.createObjectURL(b); a.download = `${aula.titulo.replace(/[^\w\-]+/g, '-').slice(0, 50)}.json`; a.click();
  };
  const q = qs[sel];
  return html`<div class="admin-corpo">
    <div class="linha-flex entre">
      <button class="btn btn-s" onClick=${() => (!sujo || confirm('Sair sem salvar?')) && ir('#/admin')}><${Icone} n="voltar" t="18" /> Aulas</button>
      <div class="linha-flex"><button class="btn btn-s" onClick=${exportar}><${Icone} n="baixar" t="16" /> Exportar</button>
        <button class="btn btn-p" disabled=${salvando || !sujo} onClick=${salvar}>${salvando ? 'Salvando…' : sujo ? 'Salvar alterações' : 'Tudo salvo'}</button></div>
    </div>
    <div class="cartao" style="margin-top:16px">
      <div class="linha-flex" style="align-items:flex-start;gap:16px">
        <label class="campo cresce" style="min-width:240px"><span>Título da aula</span><input class="inp" style="font-size:18px;font-weight:600" value=${aula.titulo} onInput=${(e) => mudaAula('titulo', e.target.value)} /></label>
        <label class="campo" style="width:280px"><span>Tipo de aula</span><select class="inp" value=${aula.modo} onChange=${(e) => mudaAula('modo', e.target.value)}>${Object.entries(MODOS).map(([k, m]) => html`<option value=${k}>${m.nome}</option>`)}</select></label>
      </div>
      <label class="campo"><span>Descrição (só você vê)</span><input class="inp" value=${aula.descricao || ''} onInput=${(e) => mudaAula('descricao', e.target.value)} /></label>
      <label class="linha-flex" style="cursor:pointer"><input type="checkbox" checked=${aula.permitir_indice} onChange=${(e) => mudaAula('permitir_indice', e.target.checked)} /> Liberar o Índice Remissivo para os alunos durante a aula</label>
      <label class="linha-flex" style="cursor:pointer;margin-top:8px"><input type="checkbox" checked=${aula.vinheta !== false} onChange=${(e) => mudaAula('vinheta', e.target.checked)} /> Vinheta de convocação (7 s, toca obrigatoriamente na primeira entrada de cada aluno)</label>
    </div>
    <div class="editor-grid">
      <div>
        <div class="lista-q">${qs.map((x, i) => html`<button class=${`item-q ${i === sel ? 'on' : ''}`} onClick=${() => { setSel(i); setPrevia(false); }}>
          <span class="n">${i + 1}</span><span class="t"><small>${TIPOS[x.tipo]?.nome} · ${x.tempo}s</small><span>${x.titulo || resumoQ(x) || 'Sem título'}</span></span></button>`)}</div>
        <div class="cartao" style="margin-top:12px;padding:14px"><b style="font-size:13px">Adicionar desafio</b>
          <div class="linha-flex" style="margin-top:8px;gap:6px">${Object.entries(TIPOS).map(([k, t]) => html`<button class="btn btn-chip btn-peq" onClick=${() => add(k)}>${t.curto}</button>`)}</div></div>
      </div>
      <div>${q ? html`<div class="cartao" key=${sel}>
        <div class="linha-flex entre" style="margin-bottom:14px"><span class="chip">${sel + 1}. ${TIPOS[q.tipo]?.nome}</span>
          <div class="linha-flex" style="gap:6px">
            <button class="btn btn-s btn-peq" onClick=${() => setPrevia(!previa)}><${Icone} n="olho" t="15" /> ${previa ? 'Editar' : 'Prévia do aluno'}</button>
            <button class="btn btn-s btn-icone" title="Subir" onClick=${() => mover(sel, -1)}><${Icone} n="cima" t="16" /></button>
            <button class="btn btn-s btn-icone" title="Descer" onClick=${() => mover(sel, 1)}><${Icone} n="baixo" t="16" /></button>
            <button class="btn btn-perigo btn-icone" title="Remover" onClick=${() => remover(sel)}><${Icone} n="lixo" t="16" /></button></div></div>
        ${previa ? html`<${Previa} q=${q} />` : html`
        <div class="linha-flex" style="align-items:flex-start;gap:12px">
          <label class="campo cresce" style="min-width:220px"><span>Título (aparece na tela)</span><input class="inp" value=${q.titulo} placeholder="Ex.: OAB 47 · Questão 1" onInput=${(e) => mudaQ(sel, { ...q, titulo: e.target.value })} /></label>
          <label class="campo" style="width:200px"><span>Tipo</span><select class="inp" value=${q.tipo} onChange=${(e) => confirm('Trocar o tipo apaga o conteúdo deste desafio. Continuar?') && mudaQ(sel, { ...q, tipo: e.target.value, tempo: tempoPadrao(e.target.value), r: novoRascunho(e.target.value, aula.modo) })}>${Object.entries(TIPOS).map(([k, t]) => html`<option value=${k}>${t.nome}</option>`)}</select></label>
          <label class="campo" style="width:110px"><span>Tempo (s)</span><input class="inp" type="number" min="0" value=${q.tempo} onInput=${(e) => mudaQ(sel, { ...q, tempo: e.target.value })} /></label>
          <label class="campo" style="width:110px"><span>Pontos</span><input class="inp" type="number" min="0" step="100" value=${q.pontos} onInput=${(e) => mudaQ(sel, { ...q, pontos: e.target.value })} /></label>
        </div>
        <${EditorTipo} tipo=${q.tipo} r=${q.r} set=${(r) => mudaQ(sel, { ...q, r })} />`}
      </div>` : html`<div class="cartao vazio">Adicione o primeiro desafio ao lado.</div>`}</div>
    </div>
    <${Toast} msg=${toast} />
  </div>`;
}
const resumoQ = (q) => String(q.r?.afirmacao || q.r?.enunciado || '').slice(0, 70);

function Previa({ q }) {
  const d = dividir(q.tipo, q.r);
  const [v, setV] = useState(valorInicial(q.tipo, d.c));
  return html`<div style="max-width:480px;margin:0 auto;background:var(--fundo);border-radius:24px;padding:16px">
    <${Responder} tipo=${q.tipo} c=${d.c} valor=${v} setValor=${setV} />
    <div class="gabarito-box"><h4>Gabarito</h4>${q.tipo === 'etapas' ? (d.c.etapas || []).map((e, i) => html`<div style="font-size:14px"><b>${i + 1}.</b> ${textoGabarito(e.tipo, e, d.g.etapas[i])}</div>`) : textoGabarito(q.tipo, d.c, d.g)}</div>
  </div>`;
}

function Campo({ rot, v, set, area, ph, linhas }) {
  return html`<label class="campo"><span>${rot}</span>${area
    ? html`<textarea class="inp" rows=${linhas || 3} placeholder=${ph || ''} value=${v || ''} onInput=${(e) => set(e.target.value)}></textarea>`
    : html`<input class="inp" placeholder=${ph || ''} value=${v || ''} onInput=${(e) => set(e.target.value)} />`}</label>`;
}

function ListaEdit({ rot, itens, set, marcados, marcar, unico, ph, area }) {
  itens = itens || [];
  const mud = (i, t) => { const n = [...itens]; n[i] = t; set(n); };
  const tira = (i) => {
    set(itens.filter((_, k) => k !== i));
    if (marcar) unico ? marcar(marcados === i ? 0 : marcados > i ? marcados - 1 : marcados) : marcar((marcados || []).filter((k) => k !== i).map((k) => (k > i ? k - 1 : k)));
  };
  return html`<div class="campo"><span>${rot}</span><div class="lista-edit">${itens.map((t, i) => html`<div class="lin">
    ${marcar && html`<button type="button" title="Marcar como correta" class=${`marcador ${(unico ? marcados === i : (marcados || []).includes(i)) ? 'on' : ''}`}
      onClick=${() => unico ? marcar(i) : marcar((marcados || []).includes(i) ? marcados.filter((k) => k !== i) : [...(marcados || []), i].sort((a, b) => a - b))}>${unico ? LETRAS[i] : '✓'}</button>`}
    ${area ? html`<textarea class="inp cresce" rows="1" placeholder=${ph || ''} value=${t} onInput=${(e) => mud(i, e.target.value)}></textarea>` : html`<input class="inp cresce" placeholder=${ph || ''} value=${t} onInput=${(e) => mud(i, e.target.value)} />`}
    <button type="button" class="btn btn-s btn-icone" onClick=${() => tira(i)}><${Icone} n="fechar" t="14" /></button></div>`)}
    <button type="button" class="btn btn-chip btn-peq" style="justify-self:start" onClick=${() => set([...itens, ''])}><${Icone} n="mais" t="14" /> adicionar</button></div></div>`;
}

function EditorTipo({ tipo, r, set, sub }) {
  const m = (k) => (v) => set({ ...r, [k]: v });
  const com = html`<${Campo} rot="Comentário do professor (aparece no gabarito)" v=${r.comentario} set=${m('comentario')} area ph="Por que essa é a resposta…" />`;
  switch (tipo) {
    case 'ce': return html`
      <${Campo} rot="Afirmação" v=${r.afirmacao} set=${m('afirmacao')} area linhas="4" />
      <div class="campo"><span>Gabarito</span><div class="linha-flex">
        <button type="button" class=${`btn ${r.certo ? 'btn-p' : 'btn-s'}`} onClick=${() => set({ ...r, certo: true })}>Certo</button>
        <button type="button" class=${`btn ${!r.certo ? 'btn-p' : 'btn-s'}`} onClick=${() => set({ ...r, certo: false })}>Errado</button></div></div>${com}`;
    case 'multipla': return html`
      ${!sub || true ? html`<${Campo} rot=${sub ? 'Pergunta da etapa (opcional)' : 'Enunciado'} v=${r.enunciado} set=${m('enunciado')} area linhas=${sub ? 2 : 4} />` : null}
      ${sub && html`<div class="linha-flex" style="margin:-6px 0 10px"><span class="fraco" style="font-size:12px">Atalho:</span><button type="button" class="btn btn-chip btn-peq" onClick=${() => set({ ...r, alternativas: [...PECAS] })}>lista de peças</button><button type="button" class="btn btn-chip btn-peq" onClick=${() => set({ ...r, alternativas: ['Sim', 'Não'] })}>Sim / Não</button></div>`}
      <${ListaEdit} rot="Alternativas (clique na letra da correta)" itens=${r.alternativas} set=${m('alternativas')} marcados=${r.correta} marcar=${m('correta')} unico area />${com}`;
    case 'multi': return html`
      <${Campo} rot=${sub ? 'Pergunta da etapa (opcional)' : 'Enunciado'} v=${r.enunciado} set=${m('enunciado')} area linhas=${sub ? 2 : 4} />
      <${ListaEdit} rot="Opções (marque ✓ em todas as corretas)" itens=${r.opcoes} set=${m('opcoes')} marcados=${r.corretas} marcar=${m('corretas')} area />${com}`;
    case 'ordenar': return html`
      <${Campo} rot=${sub ? 'Instrução (opcional)' : 'Enunciado'} v=${r.enunciado} set=${m('enunciado')} area linhas="2" />
      <${ListaEdit} rot="Itens NA ORDEM CERTA (o aluno recebe embaralhado)" itens=${r.itens} set=${m('itens')} />${com}`;
    case 'artigo': return html`
      <${Campo} rot=${sub ? 'Pergunta da etapa (opcional)' : 'Enunciado'} v=${r.enunciado} set=${m('enunciado')} area linhas=${sub ? 2 : 4} />
      <${Campo} rot="Dica (opcional)" v=${r.dica} set=${m('dica')} ph="Ex.: pesquise “ação popular” no índice" />
      <${ListaEdit} rot="Respostas aceitas (ex.: 5 LXXIII · 22 parágrafo único · 176 §1 · 29 VI alínea a)" itens=${r.aceitas} set=${m('aceitas')} ph="art. 5º, LXXIII" />
      <p class="fraco" style="font-size:12px;margin:-8px 0 12px">A correção compara número do artigo, incisos, parágrafos e alíneas, na ordem. Acertar só o artigo vale 50%.</p>
      <${Campo} rot="Como mostrar no gabarito" v=${r.resposta} set=${m('resposta')} ph="Art. 5º, LXXIII, da CF/88" />${com}`;
    case 'texto': return html`
      <${Campo} rot=${sub ? 'Pergunta da etapa (opcional)' : 'Enunciado'} v=${r.enunciado} set=${m('enunciado')} area linhas=${sub ? 2 : 4} />
      <${ListaEdit} rot="Palavras-chave que valem ponto (sinônimos separados por | )" itens=${r.palavras} set=${m('palavras')} ph="subsídio|subsidio" />
      <${Campo} rot="Resposta modelo" v=${r.modelo} set=${m('modelo')} area />${com}`;
    case 'etapas': {
      const et = r.etapas || [];
      const mudE = (i, e) => { const n = [...et]; n[i] = e; set({ ...r, etapas: n }); };
      const moverE = (i, d) => { const j = i + d; if (j < 0 || j >= et.length) return; const n = [...et]; [n[i], n[j]] = [n[j], n[i]]; set({ ...r, etapas: n }); };
      return html`
        <${Campo} rot="Caso / enunciado (o aluno vê em todas as etapas)" v=${r.enunciado} set=${m('enunciado')} area linhas="7" />
        ${et.map((e, i) => html`<div class="sub-etapa">
          <div class="linha-flex" style="align-items:flex-start;gap:8px">
            <span class="chip roxo" style="margin-top:30px">Etapa ${i + 1}</span>
            <label class="campo cresce" style="min-width:200px"><span>Título da etapa</span><input class="inp" value=${e.titulo} onInput=${(ev) => mudE(i, { ...e, titulo: ev.target.value })} /></label>
            <label class="campo" style="width:190px"><span>Tipo</span><select class="inp" value=${e.tipo} onChange=${(ev) => mudE(i, { titulo: e.titulo, tipo: ev.target.value, ...novoRascunho(ev.target.value) })}>${SUBTIPOS.map((k) => html`<option value=${k}>${TIPOS[k].nome}</option>`)}</select></label>
            <div class="linha-flex" style="margin-top:28px;gap:4px"><button type="button" class="btn btn-s btn-icone" onClick=${() => moverE(i, -1)}><${Icone} n="cima" t="14" /></button><button type="button" class="btn btn-s btn-icone" onClick=${() => moverE(i, 1)}><${Icone} n="baixo" t="14" /></button>
            <button type="button" class="btn btn-perigo btn-icone" onClick=${() => set({ ...r, etapas: et.filter((_, k) => k !== i) })}><${Icone} n="lixo" t="14" /></button></div>
          </div>
          <${EditorTipo} tipo=${e.tipo} r=${e} set=${(x) => mudE(i, { ...x, titulo: e.titulo, tipo: e.tipo })} sub />
        </div>`)}
        <div class="linha-flex" style="margin-bottom:14px"><span class="fraco" style="font-size:13px">Nova etapa:</span>${SUBTIPOS.map((k) => html`<button type="button" class="btn btn-chip btn-peq" onClick=${() => set({ ...r, etapas: [...et, { titulo: '', tipo: k, ...novoRascunho(k) }] })}>${TIPOS[k].curto}</button>`)}</div>
        <${Campo} rot="Comentário geral (aparece no fim do gabarito)" v=${r.comentario} set=${m('comentario')} area />`;
    }
  }
  return null;
}

// ---------- salas e resultados ----------
function Salas({ ir }) {
  const [salas, setSalas] = useState(null);
  useEffect(() => { sb.from('aovivo_salas').select('*, aovivo_participantes(count)').order('criado_em', { ascending: false }).limit(100).then(({ data }) => setSalas(data || [])); }, []);
  if (!salas) return html`<div class="vazio"><div class="pontinhos"><span></span><span></span><span></span></div></div>`;
  if (!salas.length) return html`<div class="cartao vazio" style="margin-top:20px">Nenhuma sala ainda. Inicie uma aula ao vivo na aba Aulas.</div>`;
  return html`<div class="cartao rolagem-x" style="margin-top:20px;padding:10px"><table class="tabela"><thead><tr><th>Data</th><th>Aula</th><th>Código</th><th>Alunos</th><th>Situação</th><th></th></tr></thead><tbody>
    ${salas.map((s) => html`<tr><td>${new Date(s.criado_em).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</td><td><b>${s.titulo}</b></td><td><span class="chip">${s.codigo}</span></td>
      <td>${s.aovivo_participantes?.[0]?.count || 0}</td><td>${s.status === 'encerrada' ? html`<span class="chip verde">encerrada</span>` : s.status === 'lobby' ? 'sala de espera' : html`<span class="chip roxo">ao vivo</span>`}</td>
      <td style="text-align:right"><button class="btn btn-s btn-peq" onClick=${() => ir(`#/admin/sala/${s.codigo}`)}>${s.status === 'encerrada' ? 'Resultados' : 'Controlar'}</button></td></tr>`)}
  </tbody></table></div>`;
}

function ControleSala({ codigo, ir }) {
  const st = useSalaProf(codigo);
  const { sala, perguntas, participantes, respostas, pergunta, respAtual } = st;
  const [aba, setAba] = useState('aovivo');
  if (!sala) return html`<div class="admin-corpo">${st.erro ? html`<div class="erro">${st.erro}</div>` : html`<div class="vazio"><div class="pontinhos"><span></span><span></span><span></span></div></div>`}</div>`;
  const url = urlEntrada(codigo);
  return html`<div class="admin-corpo">
    <div class="linha-flex entre"><button class="btn btn-s" onClick=${() => ir('#/admin/salas')}><${Icone} n="voltar" t="18" /> Salas</button>
      <div class="linha-flex"><a class="btn btn-s" href=${`#/tela/${codigo}`} target=${`tela-${codigo}`}><${Icone} n="tela" t="16" /> Abrir tela de transmissão</a>
      <button class="btn btn-s" onClick=${() => { navigator.clipboard?.writeText(url); }}><${Icone} n="copiar" t="16" /> Copiar link dos alunos</button></div></div>
    <div class="hero" style="margin-top:16px;padding:26px 30px"><div class="linha-flex entre" style="position:relative;z-index:1">
      <div><span class="sobrelinha" style="opacity:.85">Sala ${codigo} · ${participantes.length} alunos</span><h1 style="font-size:32px">${sala.titulo}</h1>
        <span class=${`fase-tag ${sala.fase === 'aberta' && sala.status === 'ativa' ? 'aberta' : ''}`}><i></i>${rotuloFase(sala, pergunta, perguntas)}</span></div>
      <div style="text-align:center"><div style="font-size:12px;opacity:.85">link dos alunos</div><div style="font-weight:600;word-break:break-all;max-width:320px;font-size:13px">${url}</div></div></div></div>
    <div class="abas" style="margin-top:18px">${[['aovivo', 'Controle ao vivo'], ['resultados', 'Resultados']].map(([k, t]) => html`<button class=${aba === k ? 'on' : ''} onClick=${() => setAba(k)}>${t}</button>`)}</div>
    ${aba === 'aovivo' ? html`<div class="controle-grid">
      <div>
        <button class="btn btn-p bloco grande-acao" disabled=${sala.status === 'encerrada'} onClick=${st.avancar}>${st.proximoRotulo()} <${Icone} n="seta" t="22" /></button>
        <div class="linha-flex" style="margin-top:10px">
          ${sala.fase === 'aberta' && html`<button class="btn btn-s" onClick=${() => st.controlar('mais_tempo')}>+15 segundos</button>`}
          ${pergunta && sala.fase !== 'aguardando' && html`<button class="btn btn-s" onClick=${() => st.controlar('ir', sala.indice)}>Refazer esta pergunta</button>`}
          ${sala.status !== 'lobby' && html`<button class="btn btn-s" onClick=${() => st.controlar('lobby')}>Voltar à sala de espera</button>`}
          ${sala.status === 'encerrada' ? html`<button class="btn btn-s" onClick=${() => st.controlar('reabrir')}>Reabrir sala</button>` : html`<button class="btn btn-perigo" onClick=${() => confirm('Encerrar a aula e mostrar o pódio?') && st.controlar('encerrar')}>Encerrar aula</button>`}
        </div>
        <div class="cartao" style="margin-top:16px;padding:14px"><b>Ir direto para</b><div class="lista-q" style="margin-top:10px">${perguntas.map((q, i) => html`
          <button class=${`item-q ${sala.indice === i && sala.status !== 'lobby' ? 'on' : ''}`} onClick=${() => st.controlar('ir', i)}><span class="n">${i + 1}</span><span class="t"><small>${TIPOS[q.tipo]?.nome} · ${respostas.filter((r) => r.pergunta_id === q.id).length} respostas</small><span>${q.titulo || q.conteudo?.afirmacao || q.conteudo?.enunciado || ''}</span></span></button>`)}</div></div>
      </div>
      <div>
        ${pergunta && html`<div class="cartao" style="padding:18px"><div class="linha-flex entre"><b>Respostas agora</b><span class="chip">${respAtual.length} / ${participantes.length}</span></div>
          <div class="fraco" style="font-size:13px;margin:6px 0 10px">Gabarito: <b style="color:#0b7a45">${pergunta.tipo === 'etapas' ? `${(pergunta.conteudo.etapas || []).length} etapas` : textoGabarito(pergunta.tipo, pergunta.conteudo, pergunta.gabarito)}</b></div>
          <div style="max-height:300px;overflow:auto">${respAtual.map((r) => { const p = participantes.find((x) => x.id === r.participante_id); return html`<div class="linha-flex" style="padding:6px 0;border-top:1px solid var(--linha);font-size:14px"><span class="cresce">${p?.nome}</span><span class="fraco">${(r.ms / 1000).toFixed(1)}s</span>${r.fracao != null && html`<span class=${`chip ${r.fracao >= 1 ? 'verde' : r.fracao > 0 ? '' : 'vermelho'}`}>${Math.round(r.fracao * 100)}%</span>`}</div>`; })}</div></div>`}
        <div class="cartao" style="padding:18px;margin-top:16px"><b>Ranking</b>${[...participantes].sort((a, b) => b.pontos - a.pontos).slice(0, 10).map((p, i) => html`<div class="linha-flex" style="padding:6px 0;border-top:${i ? '1px solid var(--linha)' : 0};font-size:14px"><b style="width:26px;color:var(--indigo)">${i + 1}º</b><span class="cresce">${p.nome}</span><b>${fmt(p.pontos)}</b></div>`)}</div>
      </div></div>` : html`<${Resultados} st=${st} />`}
  </div>`;
}

function Resultados({ st }) {
  const { sala, perguntas, participantes, respostas } = st;
  const ord = [...participantes].sort((a, b) => b.pontos - a.pontos);
  const nota = (pid, qid) => respostas.find((r) => r.participante_id === pid && r.pergunta_id === qid);
  const media = (qid) => { const rs = respostas.filter((r) => r.pergunta_id === qid && r.fracao != null); return rs.length ? Math.round((rs.reduce((s, r) => s + Number(r.fracao), 0) / rs.length) * 100) : null; };
  const csv = () => {
    const cab = ['Posição', 'Nome', 'E-mail', 'Pontos', 'Acertos (100%)', ...perguntas.map((q, i) => `Q${i + 1} (%)`)];
    const linhas = ord.map((p, i) => [i + 1, p.nome, p.email, p.pontos, p.acertos, ...perguntas.map((q) => { const r = nota(p.id, q.id); return r?.fracao != null ? Math.round(r.fracao * 100) : ''; })]);
    const txt = [cab, ...linhas].map((l) => l.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(';')).join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + txt], { type: 'text/csv;charset=utf-8' })); a.download = `resultados-${sala.codigo}.csv`; a.click();
  };
  const cor = (f) => (f == null ? '#eef1f7' : f >= 1 ? 'var(--certo-f)' : f > 0 ? '#fff1dc' : 'var(--errado-f)');
  return html`<div class="cartao" style="margin-top:18px;padding:16px">
    <div class="linha-flex entre" style="margin-bottom:10px"><b>${participantes.length} participantes</b><button class="btn btn-p btn-peq" onClick=${csv}><${Icone} n="baixar" t="15" /> Baixar planilha (CSV)</button></div>
    <div class="rolagem-x"><table class="tabela"><thead><tr><th>#</th><th>Aluno</th><th>Pontos</th><th>Acertos</th>${perguntas.map((q, i) => html`<th title=${q.titulo}>Q${i + 1}<br /><span style="font-weight:400">${media(q.id) != null ? media(q.id) + '%' : '—'}</span></th>`)}</tr></thead><tbody>
      ${ord.map((p, i) => html`<tr><td><b>${i + 1}</b></td><td><b>${p.nome}</b><br /><span class="fraco" style="font-size:12px">${p.email}</span></td><td><b>${fmt(p.pontos)}</b></td><td>${p.acertos}</td>
        ${perguntas.map((q) => { const r = nota(p.id, q.id); return html`<td><span class="cel-nota" style=${{ background: cor(r?.fracao) }}>${r ? (r.fracao != null ? Math.round(r.fracao * 100) : '…') : '—'}</span></td>`; })}</tr>`)}
    </tbody></table></div></div>`;
}

function Alunos() {
  const [total, setTotal] = useState(null);
  const [txt, setTxt] = useState('');
  const [msg, setMsg] = useState('');
  const contar = () => sb.from('aovivo_alunos').select('email', { count: 'exact', head: true }).then(({ count }) => setTotal(count || 0));
  useEffect(() => { contar(); }, []);
  const importar = async () => {
    const linhas = txt.split(/\n+/).map((l) => l.trim()).filter(Boolean);
    const regs = []; const vistos = new Set();
    for (const l of linhas) { const m = l.match(/[^\s,;<>"']+@[^\s,;<>"']+\.[^\s,;<>"']+/); if (!m) continue; const email = m[0].toLowerCase(); if (vistos.has(email)) continue; vistos.add(email); const nome = l.replace(m[0], '').replace(/[,;"<>\t]+/g, ' ').trim(); regs.push({ email, nome }); }
    if (!regs.length) return setMsg('Nenhum e-mail encontrado no texto.');
    for (let i = 0; i < regs.length; i += 500) { const { error } = await sb.from('aovivo_alunos').upsert(regs.slice(i, i + 500)); if (error) return setMsg(mensagemErro(error)); }
    setMsg(`${regs.length} e-mails importados.`); setTxt(''); contar();
  };
  const limpar = async () => { if (!confirm('Apagar a lista inteira de alunos?')) return; await sb.from('aovivo_alunos').delete().neq('email', ''); contar(); };
  return html`<div class="cartao" style="margin-top:20px">
    <h3 style="margin:0 0 4px">Alunos cadastrados no VDE</h3>
    <p class="suave" style="margin:0 0 14px;font-size:14px">Opcional. Ao iniciar uma sala, você pode exigir que o aluno use um e-mail desta lista. Cole a exportação da plataforma (um aluno por linha; nome e e-mail em qualquer ordem, ou planilha copiada).</p>
    <div class="linha-flex" style="margin-bottom:12px"><span class="chip">${total == null ? '…' : `${fmt(total)} e-mails na lista`}</span>${total > 0 && html`<button class="btn btn-perigo btn-peq" onClick=${limpar}>Limpar lista</button>`}</div>
    <textarea class="inp" rows="8" placeholder="Maria Souza; maria@email.com&#10;joao@email.com" value=${txt} onInput=${(e) => setTxt(e.target.value)}></textarea>
    ${msg && html`<div class="ok-msg" style="margin-top:10px">${msg}</div>`}
    <button class="btn btn-p" style="margin-top:12px" onClick=${importar}>Importar e-mails</button>
  </div>`;
}

function Ajuda() {
  const passos = [
    ['Monte a aula', 'Em Aulas e desafios, crie uma aula pelo tipo (quiz relâmpago, construção do raciocínio, peça, caça ao artigo ou mista) e adicione os desafios. Use “Prévia do aluno” para ver como fica no celular.'],
    ['Inicie ao vivo', '“Iniciar ao vivo” cria a sala com código e abre a tela de transmissão numa janela nova. No StreamYard, compartilhe essa janela (Compartilhar tela → Janela). Aperte F para tela cheia.'],
    ['Os alunos são convocados', 'Pelo QR code ou pelo link: nome, e-mail do VDE e Seccional. Na primeira entrada toca a vinheta de convocação (7 s). Na tela, V toca a vinheta de abertura para a live e S liga/desliga os sons.'],
    ['Patentes e Seccionais', 'Cada prova gabaritada sobe a patente do aluno (Examinando(a) → … → Lenda da Ordem). O placar mostra a Disputa das Seccionais: média de pontos por examinando de cada estado.'],
    ['Conduza com o espaço', 'Cada toque na barra de espaço (ou →) avança: abrir respostas → encerrar o tempo → revelar o gabarito → ranking → próxima pergunta. O tempo fecha sozinho quando acaba ou quando todos respondem. T dá +15 segundos.'],
    ['Controle pelo celular', 'Se preferir não mexer na janela transmitida, abra a página de Controle (no celular ou em outra janela) e conduza por lá.'],
    ['Resultados', 'Em Salas e resultados você vê a nota de cada aluno por pergunta e baixa a planilha.'],
  ];
  return html`<div class="grade-aulas">${passos.map(([t, d], i) => html`<div class="cartao"><span class="chip">${i + 1}</span><h3 style="margin:10px 0 6px">${t}</h3><p class="suave" style="margin:0;font-size:14px">${d}</p></div>`)}</div>`;
}

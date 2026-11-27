import { html, useState, useEffect, useRef, useCallback, useMemo } from '../vendor/preact-htm.mjs';
import { sb, mensagemErro, sincronizarRelogio, agoraServidor, corrigir, calcularPontos, notasEtapas, textoGabarito, TIPOS, MODOS, LETRAS, corDoNome, iniciais, fmt } from './core.js';
import { Icone, Marca, confete, Contador } from './ui.js';
import { NOME_JOGO, LEMA, Brasas, Emblema, Convocacao, tocar, preCarregar, patente, nomeSeccional } from './jogos.js';

// ---------- sessão do professor ----------
export function useSessao() {
  const [s, setS] = useState({ carregando: true, user: null, admin: false });
  useEffect(() => {
    const checar = async (sess) => {
      const user = sess?.user || null;
      let admin = false;
      if (user) { const { data } = await sb.rpc('aovivo_is_admin'); admin = !!data; }
      setS({ carregando: false, user, admin });
    };
    sb.auth.getSession().then(({ data }) => checar(data.session));
    const { data: sub } = sb.auth.onAuthStateChange((_e, sess) => checar(sess));
    return () => sub.subscription.unsubscribe();
  }, []);
  return s;
}

export function Login({ sessao }) {
  const [email, setEmail] = useState(''); const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(''); const [indo, setIndo] = useState(false); const [msg, setMsg] = useState('');
  const entrar = async (e) => {
    e.preventDefault(); setErro(''); setIndo(true);
    const { error } = await sb.auth.signInWithPassword({ email, password: senha });
    setIndo(false); if (error) setErro(mensagemErro(error));
  };
  const link = async () => {
    if (!email) return setErro('Digite seu e-mail primeiro.');
    const { error } = await sb.auth.signInWithOtp({ email, options: { shouldCreateUser: false, emailRedirectTo: location.href } });
    if (error) setErro(mensagemErro(error)); else setMsg('Enviamos um link de acesso para o seu e-mail.');
  };
  if (sessao?.user && !sessao.admin) return html`<div class="entrar-wrap"><div class="entrar"><${Marca} titulo="Painel do professor" />
    <div class="cartao" style="margin-top:20px"><p>A conta <b>${sessao.user.email}</b> não tem acesso ao painel.</p>
    <button class="btn btn-s" onClick=${() => sb.auth.signOut()}>Sair</button></div></div></div>`;
  return html`
    <div class="entrar-wrap"><div class="entrar">
      <${Marca} titulo="Painel do professor" />
      <h1>Entrar no painel</h1>
      <p class="suave" style="margin:0 0 18px">Use a mesma conta das suas plataformas.</p>
      <form class="cartao" onSubmit=${entrar}>
        <label class="campo"><span>E-mail</span><input class="inp" type="email" required value=${email} onInput=${(e) => setEmail(e.target.value)} autocomplete="username" /></label>
        <label class="campo"><span>Senha</span><input class="inp" type="password" value=${senha} onInput=${(e) => setSenha(e.target.value)} autocomplete="current-password" /></label>
        ${erro && html`<div class="erro">${erro}</div>`}${msg && html`<div class="ok-msg" style="margin-bottom:12px">${msg}</div>`}
        <button class="btn btn-p btn-g bloco" disabled=${indo}>${indo ? 'Entrando…' : 'Entrar'}</button>
        <button type="button" class="btn btn-s bloco" style="margin-top:10px" onClick=${link}>Receber link de acesso por e-mail</button>
      </form>
    </div></div>`;
}

// ---------- dados ao vivo de uma sala ----------
export function useSalaProf(codigo) {
  const [d, setD] = useState({ sala: null, perguntas: [], participantes: [], respostas: [], erro: '' });
  const ocupado = useRef(false);
  const carregar = useCallback(async () => {
    if (ocupado.current) return; ocupado.current = true;
    try {
      const { data: sala, error } = await sb.from('aovivo_salas').select('*').eq('codigo', codigo).maybeSingle();
      if (error || !sala) { setD((x) => ({ ...x, erro: error ? mensagemErro(error) : 'Sala não encontrada.' })); return; }
      const [pq, pa, re] = await Promise.all([
        sb.from('aovivo_perguntas').select('*').eq('aula_id', sala.aula_id).order('ordem').order('id'),
        sb.from('aovivo_participantes').select('id,nome,email,seccional,pontos,acertos,sequencia,melhor_sequencia,criado_em').eq('sala_id', sala.id).order('criado_em'),
        sb.from('aovivo_respostas').select('id,pergunta_id,participante_id,resposta,ms,fracao,pontos,enviada_em').eq('sala_id', sala.id),
      ]);
      setD({ sala, perguntas: pq.data || [], participantes: pa.data || [], respostas: re.data || [], erro: '' });
    } finally { ocupado.current = false; }
  }, [codigo]);
  useEffect(() => {
    sincronizarRelogio(); carregar();
    const canal = sb.channel(`prof-${codigo}-${Math.random().toString(36).slice(2, 7)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'aovivo_salas', filter: `codigo=eq.${codigo}` }, carregar)
      .subscribe();
    const t = setInterval(carregar, 1500);
    return () => { sb.removeChannel(canal); clearInterval(t); };
  }, [codigo]);

  const { sala, perguntas, participantes, respostas } = d;
  const pergunta = sala ? perguntas.find((p) => p.id === sala.pergunta_id) : null;
  const respAtual = pergunta ? respostas.filter((r) => r.pergunta_id === pergunta.id) : [];

  const [ocupado2, setOcupado] = useState(false);
  const controlar = async (acao, indice = null) => {
    const { error } = await sb.rpc('aovivo_controlar', { p_sala: sala.id, p_acao: acao, p_indice: indice });
    if (error) alert(mensagemErro(error));
    await carregar();
  };
  const revelar = async (pergunta = d.perguntas.find((p) => p.id === d.sala?.pergunta_id)) => {
    if (!pergunta) return;
    const { data: frescas } = await sb.from('aovivo_respostas').select('participante_id,resposta,ms').eq('sala_id', sala.id).eq('pergunta_id', pergunta.id);
    const notas = (frescas || []).map((r) => {
      const fracao = Math.round(corrigir(pergunta.tipo, pergunta.conteudo, pergunta.gabarito, r.resposta) * 1000) / 1000;
      return { participante_id: r.participante_id, fracao, pontos: calcularPontos(fracao, r.ms, pergunta.tempo, pergunta.pontos) };
    });
    const { error } = await sb.rpc('aovivo_aplicar_correcao', { p_sala: sala.id, p_pergunta: pergunta.id, p_notas: notas });
    if (error) return alert(mensagemErro(error));
    await controlar('revelada');
  };
  const avancar = async () => {
    if (!sala || ocupado2) return;
    setOcupado(true);
    try { await passo(); } finally { setOcupado(false); }
  };
  const passo = async () => {
    // relê a sala para decidir pelo estado real (evita pular etapa se a tela estiver um segundo atrasada)
    const { data: atual } = await sb.from('aovivo_salas').select('*').eq('id', sala.id).single();
    const sala2 = atual || sala;
    const pergunta2 = perguntas.find((p) => p.id === sala2.pergunta_id);
    return decidir(sala2, pergunta2);
  };
  const decidir = async (sala, pergunta) => {
    if (sala.status === 'encerrada') return;
    if (sala.status === 'lobby' || !pergunta) return controlar('ir', 0);
    if (sala.fase === 'aguardando') return controlar('abrir');
    if (sala.fase === 'aberta') return controlar('fechar');
    if (sala.fase === 'fechada') return revelar(pergunta);
    if (sala.fase === 'revelada') return controlar('ranking');
    if (sala.fase === 'ranking') return sala.indice + 1 < perguntas.length ? controlar('ir', sala.indice + 1) : controlar('encerrar');
  };
  const proximoRotulo = () => {
    if (!sala) return '';
    if (ocupado2) return 'Um instante…';
    if (sala.status === 'encerrada') return 'Aula encerrada';
    if (sala.status === 'lobby' || !pergunta) return 'Começar a aula';
    return { aguardando: 'Abrir respostas', aberta: 'Encerrar tempo', fechada: 'Revelar gabarito', revelada: 'Mostrar ranking' }[sala.fase]
      || (sala.indice + 1 < perguntas.length ? 'Próxima pergunta' : 'Encerrar e ver pódio');
  };
  return { ...d, pergunta, respAtual, carregar, controlar, revelar, avancar, proximoRotulo };
}

export function urlEntrada(codigo) {
  const base = location.href.split('#')[0].replace(/index\.html$/, '');
  return `${base}#/entrar/${codigo}`;
}

function QR({ texto }) {
  const svg = useMemo(() => { const q = window.qrcode(0, 'M'); q.addData(texto); q.make(); return q.createSvgTag({ cellSize: 8, margin: 0, scalable: true }); }, [texto]);
  return html`<div class="qrimg" dangerouslySetInnerHTML=${{ __html: svg }}></div>`;
}

function useRestante(prazo) {
  const [r, setR] = useState(null);
  useEffect(() => {
    if (!prazo) { setR(null); return; }
    const f = () => setR(Math.max(0, (new Date(prazo).getTime() - agoraServidor()) / 1000));
    f(); const t = setInterval(f, 200); return () => clearInterval(t);
  }, [prazo]);
  return r;
}

// ---------- TELA DE TRANSMISSÃO ----------
export function Tela({ codigo }) {
  const st = useSalaProf(codigo);
  const { sala, pergunta, participantes, respAtual, perguntas } = st;
  const [escala, setEscala] = useState(1);
  const [dock, setDock] = useState(true);
  const [abertura, setAbertura] = useState(false);
  const [somLigado, setSom] = useState(true);
  const tDock = useRef();
  useEffect(() => { preCarregar(); }, []);
  const vinheta = () => { tocar('vinheta'); setAbertura(true); };
  // som de revelação
  const ultimaFase = useRef('');
  useEffect(() => {
    const k = `${sala?.pergunta_id}-${sala?.fase}-${sala?.status}`;
    if (ultimaFase.current && k !== ultimaFase.current && somLigado && (sala?.fase === 'revelada' || sala?.status === 'encerrada')) tocar('revelar', .8);
    ultimaFase.current = k;
  }, [sala?.pergunta_id, sala?.fase, sala?.status]);
  useEffect(() => {
    const f = () => setEscala(Math.min(innerWidth / 1920, innerHeight / 1080));
    f(); addEventListener('resize', f); return () => removeEventListener('resize', f);
  }, []);
  useEffect(() => {
    const mexeu = () => { setDock(true); clearTimeout(tDock.current); tDock.current = setTimeout(() => setDock(false), 2500); };
    mexeu(); addEventListener('mousemove', mexeu); return () => removeEventListener('mousemove', mexeu);
  }, []);
  // atalhos
  useEffect(() => {
    const k = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === ' ' || e.key === 'ArrowRight' || e.key === 'Enter' || e.key === 'PageDown') { e.preventDefault(); st.avancar(); }
      else if (e.key === 't' || e.key === 'T') st.controlar('mais_tempo');
      else if (e.key === 'f' || e.key === 'F') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.();
      else if (e.key === 'l' || e.key === 'L') st.controlar('lobby');
      else if (e.key === 'v' || e.key === 'V') vinheta();
      else if (e.key === 's' || e.key === 'S') setSom((x) => !x);
    };
    addEventListener('keydown', k); return () => removeEventListener('keydown', k);
  });
  // fecha sozinho quando o tempo acaba ou todos responderam
  const rest = useRestante(sala?.fase === 'aberta' ? sala?.prazo_em : null);
  const fechou = useRef('');
  useEffect(() => {
    if (sala?.fase !== 'aberta' || !pergunta) return;
    const todos = participantes.length > 0 && respAtual.length >= participantes.length;
    if ((rest === 0 || todos) && fechou.current !== pergunta.id + sala.aberta_em) { fechou.current = pergunta.id + sala.aberta_em; setTimeout(() => st.controlar('fechar'), todos ? 1200 : 300); }
  }, [rest, respAtual.length, participantes.length, sala?.fase]);

  if (st.erro && !sala) return html`<div class="entrar-wrap"><div class="erro">${st.erro}</div></div>`;
  if (!sala) return html`<div class="palco-fora"><div class="pontinhos"><span></span><span></span><span></span></div></div>`;
  const encerrada = sala.status === 'encerrada';
  const claro = !encerrada && sala.status !== 'lobby' && pergunta && sala.fase !== 'aguardando' && sala.fase !== 'ranking';
  return html`
    <div class="palco-fora">
      <div class=${`palco ${claro ? 'p-claro' : ''}`} style=${{ transform: `translate(-50%,-50%) scale(${escala})` }}>
        ${!claro && html`<div class="fundo-grad"></div><${Brasas} qtd=${110} /><div class="marca-d">VDE</div>`}
        ${claro && html`<div class="p-pergunta"><div class="faixa"></div></div>`}
        <div class="p-topo"><${Marca} claro titulo=${NOME_JOGO} />
          <div class="p-codigo"><span>Entre em</span><b>${sala.codigo}</b><span style="opacity:.75">· ${participantes.length} <${Icone} n="pessoas" t="22" /></span></div></div>
        ${encerrada ? html`<${Podio} participantes=${participantes} final />`
          : sala.status === 'lobby' || !pergunta ? html`<${Lobby} sala=${sala} participantes=${participantes} />`
          : sala.fase === 'aguardando' ? html`<${Intro} key=${pergunta.id} sala=${sala} pergunta=${pergunta} total=${perguntas.length} />`
          : sala.fase === 'ranking' ? html`<${RankingTela} key=${'r' + pergunta.id} participantes=${participantes} sala=${sala} total=${perguntas.length} />`
          : html`<${PerguntaTela} key=${pergunta.id + sala.fase} st=${st} rest=${rest} />`}
        ${abertura && html`<${Convocacao} modo="tela" titulo=${sala.titulo} jaTocando aoFim=${() => setAbertura(false)} />`}
      </div>
      <div class=${`dock ${dock ? '' : 'oculto'}`}>
        <span class="info">${rotuloFase(sala, pergunta, perguntas)}</span>
        <button class="btn btn-p" onClick=${st.avancar} disabled=${encerrada}>${st.proximoRotulo()} <kbd>espaço</kbd></button>
        ${sala.fase === 'aberta' && html`<button class="btn btn-s" onClick=${() => st.controlar('mais_tempo')}>+15s <kbd>T</kbd></button>`}
        <button class="btn btn-s" onClick=${vinheta}>Vinheta <kbd>V</kbd></button>
        <button class="btn btn-s" onClick=${() => setSom(!somLigado)}>${somLigado ? 'Som ligado' : 'Som desligado'} <kbd>S</kbd></button>
        <button class="btn btn-s" onClick=${() => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.()}>Tela cheia <kbd>F</kbd></button>
        <a class="btn btn-s" href=${`#/admin/sala/${sala.codigo}`} target="_blank">Controle</a>
      </div>
    </div>`;
}
export function rotuloFase(sala, pergunta, perguntas) {
  if (!sala) return '';
  if (sala.status === 'encerrada') return 'Encerrada';
  if (sala.status === 'lobby' || !pergunta) return 'Sala de espera';
  const f = { aguardando: 'preparando', aberta: 'respostas abertas', fechada: 'tempo encerrado', revelada: 'gabarito revelado', ranking: 'ranking' }[sala.fase];
  return `Prova ${sala.indice + 1}/${perguntas.length} · ${f}`;
}

function Lobby({ sala, participantes }) {
  const url = urlEntrada(sala.codigo);
  const ultimos = participantes.slice(-28);
  return html`
    <div class="lobby">
      <div class="esq">
        <div class="linha-flex" style="gap:22px"><${Emblema} t=${110} /><div><div class="sobrelinha" style="color:#FFE29A;font-size:22px">Convocação aberta</div><div style="font-size:28px;opacity:.9">${MODOS[sala.modo]?.nome || 'Aula ao vivo'}</div></div></div>
        <h1>${sala.titulo}</h1>
        <div class="passos">
          <div><i>1</i>Aponte a câmera para o QR code</div>
          <div><i>2</i>Escolha sua Seccional e se apresente</div>
          <div><i>3</i>Vença as provas e suba no placar</div>
        </div>
        <div style="margin-top:30px;font-style:italic;color:#FFE29A;font-size:28px">${LEMA}</div>
      </div>
      <div class="qr"><${QR} texto=${url} /><div class="cod">${sala.codigo}</div><div class="url">${url.replace(/^https?:\/\//, '').replace(/#\/entrar\/.*$/, '')}</div></div>
      <div class="contador"><b><${Contador} valor=${participantes.length} /></b>${participantes.length === 1 ? 'examinando convocado' : 'examinandos convocados'}</div>
      <div class="nomes">${ultimos.map((p) => html`<div class="nome" key=${p.id}><span class="av" style=${{ background: corDoNome(p.nome) }}>${iniciais(p.nome)}</span>${p.nome.split(' ').slice(0, 2).join(' ')}${p.seccional && html`<span class="sec">${p.seccional}</span>`}</div>`)}</div>
    </div>`;
}

function Intro({ sala, pergunta, total }) {
  return html`
    <div class="p-intro" style="animation:surge .6s">
      <div class="emb-fundo"><${Emblema} t=${420} /></div>
      <div class="prova">Prova ${sala.indice + 1} de ${total}</div>
      <h1>${pergunta.titulo || TIPOS[pergunta.tipo]?.nome}</h1>
      <div class="linha-flex" style="gap:16px">
        <span class="chip branco" style="font-size:26px;padding:10px 24px">${TIPOS[pergunta.tipo]?.nome}</span>
        ${pergunta.tempo > 0 && html`<span class="chip branco" style="font-size:26px;padding:10px 24px"><${Icone} n="relogio" t="26" /> ${pergunta.tempo}s</span>`}
        <span class="chip branco" style="font-size:26px;padding:10px 24px"><${Icone} n="raio" t="24" /> até ${fmt(Math.round(pergunta.pontos * 1.25))} pts</span>
      </div>
    </div>`;
}

function tamanhoTexto(t) { const n = String(t || '').length; return n > 900 ? 'minimo' : n > 380 ? 'menor' : ''; }

function PerguntaTela({ st, rest }) {
  const { sala, pergunta: q, participantes, respAtual } = st;
  const c = q.conteudo || {}, g = q.gabarito || {};
  const rev = sala.fase === 'revelada';
  const n = respAtual.length, tot = Math.max(participantes.length, 1);
  const pct = (k) => (n ? Math.round((k / n) * 100) : 0);
  useEffect(() => { if (rev) { const certos = respAtual.filter((r) => Number(r.fracao) >= 1).length; if (n && certos / n >= .6) confete(160); } }, []);
  let corpo;
  if (q.tipo === 'ce') {
    const certo = respAtual.filter((r) => r.resposta?.v === true).length, errado = respAtual.filter((r) => r.resposta?.v === false).length;
    corpo = html`<div class="p-cartao"><div class=${`p-enunciado ${tamanhoTexto(c.afirmacao)}`}>${c.afirmacao}</div></div>
      <div class="p-ce">
        <div class=${`c ${rev ? (g.certo ? 'vence' : 'apaga') : ''}`}><${Icone} n="certo" c="3" />CERTO${rev && html`<span class="pct">${pct(certo)}%</span>`}</div>
        <div class=${`e ${rev ? (!g.certo ? 'vence' : 'apaga') : ''}`}><${Icone} n="errado" c="3" />ERRADO${rev && html`<span class="pct">${pct(errado)}%</span>`}</div>
      </div>`;
  } else if (q.tipo === 'multipla' || q.tipo === 'multi') {
    const ops = q.tipo === 'multipla' ? c.alternativas || [] : c.opcoes || [];
    const conta = (i) => respAtual.filter((r) => (q.tipo === 'multipla' ? r.resposta?.i === i : (r.resposta?.sel || []).includes(i))).length;
    const ok = (i) => (q.tipo === 'multipla' ? g.correta === i : (g.corretas || []).includes(i));
    corpo = html`${c.enunciado && html`<div class="p-cartao" style="padding:32px 44px"><div class=${`p-enunciado ${tamanhoTexto(c.enunciado) || 'menor'}`}>${c.enunciado}</div></div>`}
      <div class="p-ops">${ops.map((a, i) => html`<div class=${`p-op ${rev ? (ok(i) ? 'ok' : 'apaga') : ''}`} style=${{ animationDelay: `${i * 90}ms` }}>
        ${q.tipo === 'multipla' ? html`<span class=${`letra l${i % 6}`}>${LETRAS[i]}</span>` : html`<span class="letra" style="background:var(--grad)">${i + 1}</span>`}
        <span style=${ops.join('').length > 400 ? 'font-size:23px' : ''}>${a}</span>
        ${rev && html`<span class="pct">${pct(conta(i))}%</span><span class="barra" style=${{ width: `${pct(conta(i))}%` }}></span>`}</div>`)}</div>`;
  } else if (q.tipo === 'etapas') {
    const medias = (c.etapas || []).map((_, i) => {
      if (!n) return 0;
      return respAtual.reduce((s, r) => s + (notasEtapas(c, g, r.resposta)[i] || 0), 0) / n;
    });
    const muitas = (c.etapas || []).length > 4;
    corpo = html`${!(rev && muitas) && html`<div class="p-cartao" style="padding:28px 40px"><div class=${`p-enunciado ${tamanhoTexto(c.enunciado) || 'menor'}`} style=${rev ? 'font-size:22px;max-height:170px;overflow:hidden' : muitas ? 'max-height:330px;overflow:hidden' : ''}>${c.enunciado}</div></div>`}
      <div class=${`p-etapas ${muitas ? 'duas' : ''}`}>${(c.etapas || []).map((e, i) => html`<div class=${`p-etapa ${muitas ? 'compacta' : ''}`} style=${{ animationDelay: `${i * 80}ms` }}>
        <span class="n">${i + 1}</span><div class="t"><b>${e.titulo}</b>${rev && html`<span>${textoGabarito(e.tipo, e, (g.etapas || [])[i])}</span>`}</div>
        ${rev && html`<div class="medidor"><b>${Math.round(medias[i] * 100)}%</b><div><i style=${{ width: `${medias[i] * 100}%` }}></i></div></div>`}</div>`)}</div>`;
  } else if (q.tipo === 'ordenar') {
    corpo = html`${c.enunciado && html`<div class="p-cartao" style="padding:32px 44px"><div class="p-enunciado menor">${c.enunciado}</div></div>`}
      <div class="p-etapas">${(rev ? g.ordem : c.itens || []).map((t, i) => {
        const pos = rev ? (n ? respAtual.filter((r) => (r.resposta?.ordem || [])[i] === t).length / n : 0) : 0;
        return html`<div class="p-etapa" style=${{ animationDelay: `${i * 80}ms` }}><span class="n" style=${rev ? '' : 'background:#c5cee3'}>${rev ? i + 1 : '?'}</span><div class="t"><b>${t}</b></div>
        ${rev && html`<div class="medidor"><b>${Math.round(pos * 100)}%</b><div><i style=${{ width: `${pos * 100}%` }}></i></div></div>`}</div>`;
      })}</div>`;
  } else {
    corpo = html`<div class="p-cartao"><div class=${`p-enunciado ${tamanhoTexto(c.enunciado)}`}>${c.enunciado}</div>
      ${q.tipo === 'artigo' && !rev && html`<div class="linha-flex" style="margin-top:24px;gap:16px"><span class="chip" style="font-size:24px;padding:10px 22px"><${Icone} n="livro" t="24" /> Vale usar o Índice Remissivo</span>${c.dica && html`<span class="chip roxo" style="font-size:24px;padding:10px 22px">Dica: ${c.dica}</span>`}</div>`}</div>`;
  }
  const certos = respAtual.filter((r) => Number(r.fracao) >= 1).length;
  const parciais = respAtual.filter((r) => Number(r.fracao) > 0 && Number(r.fracao) < 1).length;
  const mostraGab = rev && !['ce', 'multipla', 'multi', 'etapas', 'ordenar'].includes(q.tipo);
  const larg = rev ? 90 : 470;
  return html`
    <div class="p-pergunta">
      <div class="conteudo" style=${{ right: `${larg}px` }}>
        <div class="meta"><span class="chip" style="background:rgba(255,255,255,.2);color:#fff">${TIPOS[q.tipo]?.nome}</span><span style="color:#fff;font-size:26px;font-weight:600">${q.titulo}</span></div>
        <div class="rolo">${corpo}
          ${mostraGab && html`<div class="p-gabarito"><div class="sobrelinha">Gabarito</div><div class="res">${textoGabarito(q.tipo, c, g)}</div></div>`}
          ${rev && g.comentario && !(q.tipo === 'etapas' && (c.etapas || []).length > 4) && html`<div class="p-coment">${g.comentario}</div>`}
          ${rev && html`<div class="p-taxa">
            <div><b style="color:var(--certo)">${pct(certos)}%</b><span>acertaram tudo</span></div>
            ${parciais > 0 && html`<div><b style="color:#e8890c">${pct(parciais)}%</b><span>acertaram em parte</span></div>`}
            <div><b style="color:var(--indigo)">${n}</b><span>respostas de ${participantes.length}</span></div></div>`}
        </div>
      </div>
      ${!rev && html`<div class="p-lado">
        <${Relogio} rest=${rest} tempo=${q.tempo} fase=${sala.fase} />
        <div class="respostas-box"><b><${Contador} valor=${n} dur=${400} /></b><span>de ${participantes.length} responderam</span><div class="mini"><i style=${{ width: `${(n / tot) * 100}%` }}></i></div></div>
      </div>`}
    </div>`;
}

function Relogio({ rest, tempo, fase }) {
  const R = 150, C = 2 * Math.PI * R;
  const k = fase === 'aberta' && rest != null && tempo ? rest / tempo : 0;
  const s = fase === 'aberta' ? (rest != null ? Math.ceil(rest) : '∞') : 0;
  return html`<div class=${`relogio ${fase === 'aberta' && rest != null && rest < 6 ? 'urgente' : ''}`}>
    <svg viewBox="0 0 330 330"><defs><linearGradient id="gr" x1="0" x2="1"><stop offset="0" stop-color="#1A6DF0" /><stop offset="1" stop-color="#8B2BE2" /></linearGradient></defs>
      <circle cx="165" cy="165" r=${R} fill="none" stroke="#E7ECF7" stroke-width="18" />
      <circle cx="165" cy="165" r=${R} fill="none" stroke="url(#gr)" stroke-width="18" stroke-linecap="round" stroke-dasharray=${C} stroke-dashoffset=${C * (1 - k)} style="transition: stroke-dashoffset .25s linear" /></svg>
    <div><div class="num">${s}</div><small>${fase === 'aberta' ? 'segundos' : 'tempo encerrado'}</small></div></div>`;
}

function RankingTela({ participantes, sala, total }) {
  const ord = [...participantes].sort((a, b) => b.pontos - a.pontos).slice(0, 7);
  const max = Math.max(1, ...ord.map((p) => p.pontos));
  const secs = disputaSeccionais(participantes);
  return html`
    <div class="ranking-p">
      <h2 style="top:160px">Placar da arena · prova ${sala.indice + 1} de ${total}</h2>
      ${secs.length > 0 && html`<${CaixaSeccionais} secs=${secs} />`}
      <div class=${`lista-rank ${secs.length ? 'com-secc' : ''}`} style="top:290px">${ord.map((p, i) => html`<div class="lin" key=${p.id} style=${{ animationDelay: `${i * 90}ms` }}>
        <span class="pos" style=${i === 0 ? 'color:#c58f00' : ''}>${i + 1}º</span>
        <span class="av" style=${{ background: corDoNome(p.nome) }}>${iniciais(p.nome)}</span>
        <span class="nm">${p.nome}</span>
        ${p.seccional && html`<span class="sec">${p.seccional}</span>`}
        ${p.sequencia >= 2 && html`<span class="fogo"><${Icone} n="fogo" />${p.sequencia}</span>`}
        <span class="pt"><${Contador} valor=${p.pontos} /></span>
        <span class="barra" style=${{ width: `${(p.pontos / max) * 100}%` }}></span></div>`)}
        ${!ord.length && html`<div class="lin">Ninguém pontuou ainda.</div>`}</div>
    </div>`;
}

export function Podio({ participantes, final }) {
  const ord = [...participantes].sort((a, b) => b.pontos - a.pontos);
  useEffect(() => { if (final && ord.length) { confete(220); const t = setTimeout(() => confete(160), 1600); return () => clearTimeout(t); } }, []);
  const col = (p, k) => p && html`<div class=${`col p${k}`}>
    ${k === 1 && html`<div class="coroa"><${Icone} n="coroa" t="70" c="1.5" /></div>`}
    <div class="av" style=${{ background: `linear-gradient(150deg, ${corDoNome(p.nome)}, #8B2BE2)` }}>${iniciais(p.nome)}</div>
    ${p.seccional && html`<div class="sec">OAB/${p.seccional}</div>`}<div class="nm">${p.nome}</div><div class="pt">${fmt(p.pontos)} pts · ${p.acertos} ${p.acertos === 1 ? 'acerto' : 'acertos'}</div><div class="bloco-p">${k}º</div></div>`;
  return html`
    <div class="ranking-p">
      <h2>${final ? NOME_JOGO : 'Pódio'}</h2>
      ${final && ord[0] && html`<div class="campeao">Campeã(o): ${ord[0].nome}${ord[0].seccional ? ` · Seccional ${nomeSeccional(ord[0].seccional)}` : ''}</div>`}
      ${final && disputaSeccionais(participantes).length > 1 && html`<${CaixaSeccionais} secs=${disputaSeccionais(participantes)} topo=${330} />`}
      <div class="podio">${col(ord[1], 2)}${col(ord[0], 1)}${col(ord[2], 3)}</div>
      ${!ord.length && html`<p style="position:absolute;top:500px;width:100%;text-align:center">Ninguém participou.</p>`}
    </div>`;
}

export function disputaSeccionais(participantes) {
  const g = {};
  for (const p of participantes) if (p.seccional) { (g[p.seccional] ||= { uf: p.seccional, soma: 0, n: 0 }); g[p.seccional].soma += p.pontos; g[p.seccional].n++; }
  return Object.values(g).map((x) => ({ ...x, media: Math.round(x.soma / x.n) })).sort((a, b) => b.media - a.media).slice(0, 5);
}
function CaixaSeccionais({ secs, topo }) {
  return html`<div class="secc-box" style=${topo ? { top: `${topo}px`, width: '330px' } : null}><h3>Seccionais</h3>
    ${secs.map((x, i) => html`<div class="l"><b style="margin:0;width:34px;color:#FFE29A">${i + 1}º</b><span class="selo-sec" style="font-size:18px">${x.uf}</span><span style="font-size:20px;opacity:.85">${x.n}</span><b>${fmt(x.media)}</b></div>`)}</div>`;
}

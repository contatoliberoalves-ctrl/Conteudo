import { html, useState, useEffect, useRef, useCallback } from '../vendor/preact-htm.mjs';
import { sb, mensagemErro, ajustarRelogio, agoraServidor, TIPOS, MODOS, respostaPronta, valorInicial, fmt } from './core.js';
import { Responder, Correcao, GavetaIndice, Icone, Marca, Avatar, confete, Contador, Toast, useToast } from './ui.js';

const chave = (cod) => `arena:${String(cod).toUpperCase()}`;
const lerLocal = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const gravarLocal = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

export function Entrar({ codigo: codInicial, ir }) {
  const salvo = lerLocal('arena:eu') || {};
  const [codigo, setCodigo] = useState(codInicial || '');
  const [nome, setNome] = useState(salvo.nome || '');
  const [email, setEmail] = useState(salvo.email || '');
  const [erro, setErro] = useState('');
  const [indo, setIndo] = useState(false);
  const [indice, setIndice] = useState(false);
  const enviar = async (e) => {
    e.preventDefault(); setErro(''); setIndo(true);
    const { data, error } = await sb.rpc('aovivo_entrar', { p_codigo: codigo.trim(), p_nome: nome, p_email: email });
    setIndo(false);
    if (error) return setErro(mensagemErro(error));
    gravarLocal('arena:eu', { nome, email });
    gravarLocal(chave(data.sala), { token: data.token, nome: data.nome });
    ir(`#/sala/${data.sala}`);
  };
  return html`
    <div class="entrar-wrap"><div class="entrar">
      <${Marca} />
      <h1>Entre na aula ao vivo</h1>
      <p class="suave" style="margin:0 0 18px">Responda as perguntas do professor e veja na hora o quanto você acertou.</p>
      <form class="cartao" onSubmit=${enviar}>
        <label class="campo"><span>Código da sala</span><input class="inp inp-codigo" maxlength="8" required value=${codigo} onInput=${(e) => setCodigo(e.target.value.toUpperCase())} placeholder="ABC12" autocomplete="off" /></label>
        <label class="campo"><span>Seu nome</span><input class="inp" required maxlength="60" value=${nome} onInput=${(e) => setNome(e.target.value)} placeholder="Como quer aparecer no ranking" autocomplete="name" /></label>
        <label class="campo"><span>E-mail cadastrado no VDE</span><input class="inp" type="email" required value=${email} onInput=${(e) => setEmail(e.target.value)} placeholder="voce@email.com" autocomplete="email" /></label>
        ${erro && html`<div class="erro">${erro}</div>`}
        <button class="btn btn-p btn-g bloco" disabled=${indo}>${indo ? 'Entrando…' : html`Entrar na sala <${Icone} n="seta" t="20" />`}</button>
        <p class="fraco" style="font-size:12px;text-align:center;margin:12px 0 0">Seu nome aparece no ranking da aula. O e-mail fica só com o professor.</p>
      </form>
      <button class="btn btn-s bloco" style="margin-top:12px" onClick=${() => setIndice(true)}><${Icone} n="livro" t="18" /> Abrir o Índice Remissivo</button>
    </div></div>
    <${GavetaIndice} aberto=${indice} fechar=${() => setIndice(false)} />`;
}

export function SalaAluno({ codigo, ir }) {
  const eu = lerLocal(chave(codigo));
  const [est, setEst] = useState(null);
  const [erro, setErro] = useState('');
  const [indice, setIndice] = useState(false);
  const [toast, mostrar] = useToast();
  const buscando = useRef(false);

  const carregar = useCallback(async () => {
    if (!eu || buscando.current) return;
    buscando.current = true;
    const { data, error } = await sb.rpc('aovivo_estado', { p_codigo: codigo, p_token: eu.token });
    buscando.current = false;
    if (error) {
      if (String(error.message).includes('participante_invalido')) { localStorage.removeItem(chave(codigo)); ir(`#/entrar/${codigo}`); }
      return setErro(mensagemErro(error));
    }
    setErro(''); ajustarRelogio(data.sala.agora); setEst(data);
  }, [codigo]);

  useEffect(() => {
    if (!eu) { ir(`#/entrar/${codigo}`); return; }
    carregar();
    const canal = sb.channel(`sala-${codigo}-${Math.random().toString(36).slice(2, 7)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'aovivo_salas', filter: `codigo=eq.${codigo}` }, () => carregar())
      .subscribe();
    const t = setInterval(carregar, 6000);
    const vis = () => document.visibilityState === 'visible' && carregar();
    document.addEventListener('visibilitychange', vis);
    return () => { sb.removeChannel(canal); clearInterval(t); document.removeEventListener('visibilitychange', vis); };
  }, [codigo]);

  if (!eu) return null;
  if (!est) return html`<div class="entrar-wrap"><div style="text-align:center">${erro ? html`<div class="erro">${erro}</div><button class="btn btn-s" onClick=${carregar}>Tentar de novo</button>` : html`<div class="pontinhos"><span></span><span></span><span></span></div>`}</div></div>`;

  const { sala, pergunta } = est;
  const usar = (art) => {
    if (pergunta?.tipo === 'artigo' && rascunhoGlobal.set) rascunhoGlobal.set({ t: art });
    else { navigator.clipboard?.writeText(art); mostrar('Artigo copiado: ' + art); }
  };
  return html`
    <div class="aluno">
      <header class="aluno-topo">
        <${Marca} claro titulo=${sala.titulo || 'Arena ao vivo'} />
        <div class="placar">
          <span class="pill-pontos" title="Seus pontos"><${Icone} n="raio" t="16" /> <${Contador} valor=${est.eu.pontos} /></span>
          ${est.eu.sequencia >= 2 && html`<span class="pill-pontos" title="Acertos seguidos" style="color:#ffd36b"><${Icone} n="fogo" t="16" />${est.eu.sequencia}</span>`}
        </div>
      </header>
      <main class="aluno-corpo">
        ${erro && html`<div class="erro">${erro}</div>`}
        <${Corpo} est=${est} codigo=${codigo} eu=${eu} recarregar=${carregar} />
      </main>
      ${sala.permitir_indice && sala.status !== 'encerrada' && html`<button class="fab-indice" onClick=${() => setIndice(true)}><${Icone} n="livro" /> Índice</button>`}
      <${GavetaIndice} aberto=${indice} fechar=${() => setIndice(false)} aoUsar=${usar} />
      <${Toast} msg=${toast} />
    </div>`;
}
const rascunhoGlobal = {};

function Corpo({ est, codigo, eu, recarregar }) {
  const { sala, pergunta, minha } = est;
  if (sala.status === 'encerrada') return html`<${Final} est=${est} />`;
  if (sala.status === 'lobby' || !pergunta) return html`
    <div class="espera">
      <${Avatar} nome=${eu.nome} g />
      <h2 style="margin:0 0 4px">Você está na sala, ${eu.nome.split(' ')[0]}!</h2>
      <p class="suave" style="margin:0 0 18px">${MODOS[sala.modo]?.nome || 'Aula ao vivo'} · ${est.eu.participantes} ${est.eu.participantes === 1 ? 'aluno' : 'alunos'} conectados</p>
      <div class="pontinhos"><span></span><span></span><span></span></div>
      <p class="suave" style="margin-top:16px">Aguardando o professor começar…</p>
      ${sala.permitir_indice && html`<div class="cartao" style="margin-top:26px;text-align:left"><b>Dica:</b> deixe o <b>Índice Remissivo</b> à mão (botão no canto). Nos desafios você pode pesquisar o artigo.</div>`}
    </div>`;
  const cab = html`<div class="q-cab"><span class="chip">${TIPOS[pergunta.tipo]?.nome}</span><span class="fraco" style="font-size:14px;font-weight:600">${sala.indice + 1} / ${sala.total}</span></div>`;
  if (sala.fase === 'aguardando') return html`
    <div class="espera" key=${'ag' + pergunta.id}>
      <div class="medalha"><div>${sala.indice + 1}</div></div>
      <span class="chip roxo">${TIPOS[pergunta.tipo]?.nome}</span>
      <h2 style="margin:14px 0 6px">${pergunta.titulo || 'Prepare-se!'}</h2>
      <p class="suave">A pergunta vai abrir em instantes. Olho na tela!</p>
      <div class="pontinhos" style="margin-top:10px"><span></span><span></span><span></span></div>
    </div>`;
  if (sala.fase === 'aberta' && !minha) return html`<${Pergunta} key=${pergunta.id} est=${est} codigo=${codigo} eu=${eu} cab=${cab} recarregar=${recarregar} />`;
  if (sala.fase === 'aberta' || sala.fase === 'fechada') return html`
    <div class="espera" key=${'env' + pergunta.id}>
      ${minha ? html`<div class="resultado nada" style="background:var(--grad)"><div class="icone-g"><${Icone} n="certo" c="3" /></div><h2>Resposta enviada!</h2><div class="sub" style="margin-top:6px">O gabarito sai quando o professor revelar.</div></div>`
        : html`<div class="resultado nada"><div class="icone-g"><${Icone} n="relogio" /></div><h2>Tempo esgotado</h2><div class="sub" style="margin-top:6px">Você não respondeu esta. Na próxima, vai!</div></div>`}
      <p class="suave" style="margin-top:18px">${est.respostas} de ${est.eu.participantes} já responderam</p>
      <div class="pontinhos"><span></span><span></span><span></span></div>
    </div>`;
  if (sala.fase === 'revelada') return html`<${Revelado} key=${'rv' + pergunta.id} est=${est} cab=${cab} />`;
  if (sala.fase === 'ranking') return html`<${RankingAluno} est=${est} />`;
  return null;
}

function useRestante(prazo) {
  const [r, setR] = useState(null);
  useEffect(() => {
    if (!prazo) { setR(null); return; }
    const f = () => setR(Math.max(0, (new Date(prazo).getTime() - agoraServidor()) / 1000));
    f(); const t = setInterval(f, 250); return () => clearInterval(t);
  }, [prazo]);
  return r;
}

function Pergunta({ est, codigo, eu, cab, recarregar }) {
  const { pergunta, sala } = est;
  const [valor, setValor] = useState(() => valorInicial(pergunta.tipo, pergunta.conteudo));
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const rest = useRestante(sala.prazo_em);
  rascunhoGlobal.set = setValor;
  useEffect(() => () => { rascunhoGlobal.set = null; }, []);
  const imediato = pergunta.tipo === 'ce' || pergunta.tipo === 'multipla';
  const enviar = async (v = valor) => {
    if (enviando) return;
    setEnviando(true); setErro('');
    const { error } = await sb.rpc('aovivo_responder', { p_codigo: codigo, p_token: eu.token, p_pergunta: pergunta.id, p_resposta: v });
    setEnviando(false);
    if (error) setErro(mensagemErro(error));
    if (navigator.vibrate) navigator.vibrate(30);
    recarregar();
  };
  const pronto = respostaPronta(pergunta.tipo, pergunta.conteudo, valor);
  return html`
    <div style="animation:surge .4s">
      ${cab}
      ${rest != null && html`<div class=${`barra-tempo ${rest < 6 ? 'urgente' : ''}`}><i style=${{ width: `${Math.min(100, (rest / pergunta.tempo) * 100)}%` }}></i></div>`}
      ${pergunta.titulo && html`<h2 style="margin:0 0 10px;font-size:20px;line-height:1.3">${pergunta.titulo}</h2>`}
      <${Responder} tipo=${pergunta.tipo} c=${pergunta.conteudo} valor=${valor} setValor=${setValor} desab=${enviando || rest === 0} aoEnviar=${imediato ? enviar : null} imediato=${imediato} />
      ${erro && html`<div class="erro">${erro}</div>`}
    </div>
    ${!imediato && html`<div class="rodape-fixo"><div class="dentro">
      <button class="btn btn-p btn-g bloco" disabled=${!pronto || enviando || rest === 0} onClick=${() => enviar()}>
        ${enviando ? 'Enviando…' : pergunta.tipo === 'etapas' ? html`Enviar meu raciocínio <${Icone} n="seta" t="20" />` : html`Enviar resposta <${Icone} n="seta" t="20" />`}</button></div></div>`}
    ${rest != null && html`<p class="fraco" style="text-align:center;font-size:13px;margin-top:14px"><${Icone} n="relogio" t="14" /> ${Math.ceil(rest)}s</p>`}`;
}

function Revelado({ est, cab }) {
  const { pergunta, minha } = est;
  const f = minha?.fracao != null ? Number(minha.fracao) : null;
  const classe = !minha ? 'nada' : f >= 1 ? 'ok' : f > 0 ? 'parcial' : 'no';
  useEffect(() => { if (f >= 1) setTimeout(() => confete(120), 250); }, []);
  const titulo = !minha ? 'Sem resposta' : f >= 1 ? (est.eu.sequencia >= 3 ? 'Imparável!' : 'Acertou!') : f > 0 ? `Acertou ${Math.round(f * 100)}%` : 'Não foi dessa vez';
  return html`
    ${cab}
    <div class=${`resultado ${classe}`}>
      <div class="icone-g"><${Icone} n=${!minha ? 'relogio' : f > 0 ? 'certo' : 'errado'} c="3" /></div>
      <h2>${titulo}</h2>
      <div class="pts">+<${Contador} valor=${minha?.pontos || 0} /></div>
      <div class="sub">${est.eu.posicao}º lugar · ${fmt(est.eu.pontos)} pontos${est.eu.sequencia >= 2 ? ` · ${est.eu.sequencia} seguidas 🔥` : ''}</div>
    </div>
    <${Correcao} tipo=${pergunta.tipo} c=${pergunta.conteudo} g=${pergunta.gabarito} valor=${minha?.resposta} />`;
}

function RankingAluno({ est }) {
  const top = est.ranking || [];
  return html`
    <div style="text-align:center;padding-top:8px;animation:surge .4s">
      <span class="sobrelinha" style="color:var(--azul)">Placar parcial</span>
      <div class="medalha" style="margin-top:14px"><div>${est.eu.posicao}º</div></div>
      <h2 style="margin:0">${est.eu.posicao === 1 ? 'Você lidera!' : est.eu.posicao <= 3 ? 'Você está no pódio!' : 'Continue subindo!'}</h2>
      <div class="stats-aluno">
        <div class="stat"><b><${Contador} valor=${est.eu.pontos} /></b><span>pontos</span></div>
        <div class="stat"><b>${est.eu.acertos}</b><span>acertos</span></div>
        <div class="stat"><b>${est.eu.melhor_sequencia}</b><span>melhor sequência</span></div>
      </div>
      <div class="cartao" style="margin-top:14px;text-align:left;padding:14px 16px">${top.slice(0, 5).map((p, i) => html`
        <div class="linha-flex" style="padding:7px 0;border-top:${i ? '1px solid var(--linha)' : '0'}"><b style="width:28px;color:var(--indigo)">${i + 1}º</b><span class="cresce">${p.nome}</span><b>${fmt(p.pontos)}</b></div>`)}</div>
    </div>`;
}

function Final({ est }) {
  const r = est.resumo || {};
  useEffect(() => { if (est.eu.posicao <= 3) setTimeout(() => confete(200), 300); }, []);
  const pct = Math.round(Number(r.media || 0) * 100);
  const selo = pct >= 90 ? 'Gabaritou' : pct >= 70 ? 'Mandou bem' : pct >= 40 ? 'No caminho' : 'Bora revisar';
  return html`
    <div style="text-align:center;animation:surge .5s">
      <span class="sobrelinha" style="color:var(--azul)">Fim da aula</span>
      <div class="medalha" style="margin-top:16px;width:150px;height:150px"><div style="font-size:46px">${est.eu.posicao}º</div></div>
      <h2 style="margin:0 0 4px;font-size:28px">${selo}!</h2>
      <p class="suave" style="margin:0">${est.sala.titulo}</p>
      <div class="stats-aluno">
        <div class="stat"><b><${Contador} valor=${est.eu.pontos} /></b><span>pontos</span></div>
        <div class="stat"><b>${pct}%</b><span>de aproveitamento</span></div>
        <div class="stat"><b>${est.eu.melhor_sequencia}</b><span>melhor sequência</span></div>
      </div>
      <div class="cartao" style="margin-top:14px;text-align:left;padding:14px 16px"><b style="display:block;margin-bottom:6px">Ranking final</b>${(est.ranking || []).map((p, i) => html`
        <div class="linha-flex" style="padding:7px 0;border-top:${i ? '1px solid var(--linha)' : '0'}"><b style="width:28px;color:${i === 0 ? '#c58f00' : 'var(--indigo)'}">${i + 1}º</b><span class="cresce">${p.nome}</span><b>${fmt(p.pontos)}</b></div>`)}</div>
      <p class="suave" style="margin-top:18px">Continue treinando no VDE. Constância vence talento.</p>
    </div>`;
}

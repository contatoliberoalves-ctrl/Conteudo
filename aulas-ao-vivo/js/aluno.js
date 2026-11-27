import { html, useState, useEffect, useRef, useCallback } from '../vendor/preact-htm.mjs';
import { sb, mensagemErro, ajustarRelogio, agoraServidor, TIPOS, MODOS, respostaPronta, valorInicial, fmt } from './core.js';
import { Responder, Correcao, GavetaIndice, Icone, Marca, Avatar, confete, Contador, Toast, useToast } from './ui.js';
import { NOME_JOGO, LEMA, SECCIONAIS, nomeSeccional, Brasas, Convocacao, SeloSeccional, Emblema, patente, tocar, som, preCarregar } from './jogos.js';

const chave = (cod) => `arena:${String(cod).toUpperCase()}`;
const lerLocal = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const gravarLocal = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

export function Entrar({ codigo: codInicial, ir }) {
  const salvo = lerLocal('arena:eu') || {};
  const [codigo, setCodigo] = useState(codInicial || '');
  const [nome, setNome] = useState(salvo.nome || '');
  const [email, setEmail] = useState(salvo.email || '');
  const [sec, setSec] = useState(salvo.seccional || '');
  const [erro, setErro] = useState('');
  const [indo, setIndo] = useState(false);
  const [indice, setIndice] = useState(false);
  const [previa, setPrevia] = useState(null);
  const [conv, setConv] = useState(false);
  const pronto = useRef({ fim: false, destino: null });
  useEffect(() => { preCarregar(); }, []);
  useEffect(() => {
    const c = codigo.trim();
    if (c.length < 5) { setPrevia(null); return; }
    let vivo = true;
    sb.from('aovivo_salas').select('titulo,vinheta,status').eq('codigo', c).maybeSingle().then(({ data }) => vivo && setPrevia(data || false));
    return () => { vivo = false; };
  }, [codigo]);
  const seguir = () => { if (pronto.current.fim && pronto.current.destino) ir(pronto.current.destino); };
  const enviar = async (e) => {
    e.preventDefault(); setErro('');
    if (!sec) return setErro('Escolha a sua Seccional.');
    const cod = codigo.trim().toUpperCase();
    const primeira = !lerLocal(chave(cod)) && previa && previa.vinheta !== false;
    pronto.current = { fim: !primeira, destino: null };
    if (primeira) { tocar('vinheta'); setConv(true); }   // toca já no clique, para o navegador liberar o som
    setIndo(true);
    const { data, error } = await sb.rpc('aovivo_entrar', { p_codigo: cod, p_nome: nome, p_email: email, p_seccional: sec });
    setIndo(false);
    if (error) { som('vinheta').pause(); setConv(false); return setErro(mensagemErro(error)); }
    gravarLocal('arena:eu', { nome, email, seccional: sec });
    gravarLocal(chave(data.sala), { token: data.token, nome: data.nome, seccional: data.seccional });
    pronto.current.destino = `#/sala/${data.sala}`; seguir();
  };
  return html`
    <div class="entrar-wrap arena"><${Brasas} qtd=${45} /><div class="entrar">
      <${Marca} claro titulo=${NOME_JOGO} />
      <h1>Você foi convocado(a) para a arena</h1>
      <p class="suave" style="margin:0 0 18px">Responda as provas do professor, veja na hora o quanto acertou e leve a sua Seccional ao topo do placar.</p>
      <form class="cartao" onSubmit=${enviar}>
        <label class="campo"><span>Código da sala</span><input class="inp inp-codigo" maxlength="8" required value=${codigo} onInput=${(e) => setCodigo(e.target.value.toUpperCase())} placeholder="ABC12" autocomplete="off" /></label>
        ${previa && html`<div class="sala-previa"><${Icone} n="raio" t="16" /> ${previa.status === 'encerrada' ? 'Esta arena já foi encerrada.' : previa.titulo}</div>`}
        ${previa === false && codigo.trim().length >= 5 && html`<div class="sala-previa" style="background:var(--errado-f);color:#b4142b">Não achei essa sala. Confira o código.</div>`}
        <label class="campo"><span>Seu nome</span><input class="inp" required maxlength="60" value=${nome} onInput=${(e) => setNome(e.target.value)} placeholder="Como quer aparecer no placar" autocomplete="name" /></label>
        <label class="campo"><span>E-mail cadastrado no VDE</span><input class="inp" type="email" required value=${email} onInput=${(e) => setEmail(e.target.value)} placeholder="voce@email.com" autocomplete="email" /></label>
        <div class="campo"><span>Sua Seccional ${sec && html`· <b style="color:#8a5300">${nomeSeccional(sec)}</b>`}</span>
          <div class="sec-grade">${SECCIONAIS.map(([uf, n]) => html`<button type="button" title=${n} class=${sec === uf ? 'on' : ''} onClick=${() => setSec(uf)}>${uf}</button>`)}</div></div>
        ${erro && html`<div class="erro">${erro}</div>`}
        <button class="btn btn-ouro btn-g bloco" disabled=${indo}>${indo ? 'Entrando…' : html`Entrar na arena <${Icone} n="seta" t="20" />`}</button>
        <p class="fraco" style="font-size:12px;text-align:center;margin:12px 0 0">Na primeira entrada toca a vinheta de convocação (7 s): aumente o volume. Seu nome aparece no placar; o e-mail fica só com o professor.</p>
      </form>
      <button class="btn btn-s bloco" style="margin-top:12px" onClick=${() => setIndice(true)}><${Icone} n="livro" t="18" /> Abrir o Índice Remissivo</button>
      <p class="lema">${LEMA}</p>
    </div></div>
    ${conv && html`<${Convocacao} nome=${nome} seccional=${sec} jaTocando aoFim=${() => { pronto.current.fim = true; seguir(); }} />`}
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
        <${Marca} claro titulo=${NOME_JOGO} />
        <div class="placar">
          <${SeloSeccional} uf=${est.eu.seccional} />
          <span class="pill-pontos" title="Seus pontos"><${Icone} n="raio" t="16" /> <${Contador} valor=${est.eu.pontos} /></span>
          ${est.eu.sequencia >= 2 && html`<span class="pill-pontos" title="Em brasa: acertos seguidos" style="color:#ffd36b"><${Icone} n="fogo" t="16" />${est.eu.sequencia}</span>`}
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
    <div class="espera arena-card">
      <${Brasas} qtd=${40} />
      <${Emblema} t=${110} />
      <div class="sobrelinha" style="color:#FFE29A;margin-top:10px">Convocação confirmada</div>
      <h2 style="margin:6px 0 10px;font-size:26px">${eu.nome}</h2>
      <div class="linha-flex" style="justify-content:center;margin-bottom:14px"><${SeloSeccional} uf=${est.eu.seccional} grande /><span class="patente escura">${patente(est.eu.acertos).nome}</span></div>
      <p class="suave" style="margin:0 0 14px">${sala.titulo} · ${est.eu.participantes} ${est.eu.participantes === 1 ? 'examinando' : 'examinandos'} na arena</p>
      <div class="pontinhos"><span></span><span></span><span></span></div>
      <p class="suave" style="margin-top:12px">Aguardando o início dos jogos…</p>
    </div>
    ${sala.permitir_indice && html`<div class="cartao" style="margin-top:16px;text-align:left"><b>Sua arma:</b> o <b>Índice Remissivo</b> (botão no canto). Nas provas você pode pesquisar o artigo.</div>`}
    <div class="cartao" style="margin-top:12px;text-align:left;font-size:14px"><b>Patentes</b><div class="suave" style="margin-top:4px">Cada prova gabaritada te faz subir: Examinando(a) → Aprovado(a) na 1ª fase → Combatente da 2ª fase → Advogado(a) da Ordem → Conselheiro(a) Seccional → Lenda da Ordem.</div></div>`;
  const cab = html`<div class="q-cab"><span class="chip">${TIPOS[pergunta.tipo]?.nome}</span><span class="fraco" style="font-size:14px;font-weight:600">Prova ${sala.indice + 1} / ${sala.total}</span></div>`;
  if (sala.fase === 'aguardando') return html`
    <div class="espera arena-card" key=${'ag' + pergunta.id}>
      <${Brasas} qtd=${40} />
      <div class="sobrelinha" style="color:#FFE29A">Prova ${sala.indice + 1} de ${sala.total}</div>
      <div class="medalha" style="margin-top:14px"><div>${sala.indice + 1}</div></div>
      <span class="patente escura">${TIPOS[pergunta.tipo]?.nome}</span>
      <h2 style="margin:14px 0 6px">${pergunta.titulo || 'Prepare-se!'}</h2>
      <p class="suave">A prova vai abrir em instantes. Olho na tela!</p>
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
  const pat = patente(est.eu.acertos), antes = patente(est.eu.acertos - (f >= 1 ? 1 : 0));
  const subiu = f >= 1 && pat.nivel > antes.nivel;
  const titulo = !minha ? 'Sem resposta' : f >= 1 ? (est.eu.sequencia >= 3 ? 'Imparável!' : 'Acertou!') : f > 0 ? `Acertou ${Math.round(f * 100)}%` : 'Não foi dessa vez';
  return html`
    ${cab}
    <div class=${`resultado ${classe}`}>
      <div class="icone-g"><${Icone} n=${!minha ? 'relogio' : f > 0 ? 'certo' : 'errado'} c="3" /></div>
      <h2>${titulo}</h2>
      <div class="pts">+<${Contador} valor=${minha?.pontos || 0} /></div>
      <div class="sub">${est.eu.posicao}º lugar · ${fmt(est.eu.pontos)} pontos${est.eu.sequencia >= 2 ? ` · em brasa: ${est.eu.sequencia} seguidas 🔥` : ''}</div>
    </div>
    ${subiu && html`<div class="subiu"><${Emblema} t=${28} /> Nova patente: ${pat.nome}</div>`}
    <${Correcao} tipo=${pergunta.tipo} c=${pergunta.conteudo} g=${pergunta.gabarito} valor=${minha?.resposta} />`;
}

function RankingAluno({ est }) {
  const top = est.ranking || [];
  return html`
    <div style="text-align:center;padding-top:8px;animation:surge .4s">
      <span class="sobrelinha" style="color:var(--azul)">Placar da arena</span>
      <div class="medalha" style="margin-top:14px"><div>${est.eu.posicao}º</div></div>
      <h2 style="margin:0">${est.eu.posicao === 1 ? 'Você lidera!' : est.eu.posicao <= 3 ? 'Você está no pódio!' : 'Continue subindo!'}</h2>
      <div class="stats-aluno">
        <div class="stat"><b><${Contador} valor=${est.eu.pontos} /></b><span>pontos</span></div>
        <div class="stat"><b>${est.eu.acertos}</b><span>acertos</span></div>
        <div class="stat"><b>${est.eu.melhor_sequencia}</b><span>melhor sequência</span></div>
      </div>
      <div class="cartao" style="margin-top:14px;text-align:left;padding:14px 16px">${top.slice(0, 5).map((p, i) => html`
        <div class="linha-flex" style="padding:7px 0;border-top:${i ? '1px solid var(--linha)' : '0'}"><b style="width:28px;color:var(--indigo)">${i + 1}º</b><span class="cresce">${p.nome}</span><${SeloSeccional} uf=${p.seccional} /><b>${fmt(p.pontos)}</b></div>`)}</div>
      <${Seccionais} lista=${est.seccionais} minha=${est.eu.seccional} />
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
      <h2 style="margin:0 0 4px;font-size:28px">${est.eu.posicao === 1 ? 'Campeã(o) dos Jogos da Ordem!' : selo + '!'}</h2>
      <div class="linha-flex" style="justify-content:center;margin:8px 0"><${SeloSeccional} uf=${est.eu.seccional} /><span class="patente">${patente(est.eu.acertos).nome}</span></div>
      <p class="suave" style="margin:0">${est.sala.titulo}</p>
      <div class="stats-aluno">
        <div class="stat"><b><${Contador} valor=${est.eu.pontos} /></b><span>pontos</span></div>
        <div class="stat"><b>${pct}%</b><span>de aproveitamento</span></div>
        <div class="stat"><b>${est.eu.melhor_sequencia}</b><span>melhor sequência</span></div>
      </div>
      <div class="cartao" style="margin-top:14px;text-align:left;padding:14px 16px"><b style="display:block;margin-bottom:6px">Ranking final</b>${(est.ranking || []).map((p, i) => html`
        <div class="linha-flex" style="padding:7px 0;border-top:${i ? '1px solid var(--linha)' : '0'}"><b style="width:28px;color:${i === 0 ? '#c58f00' : 'var(--indigo)'}">${i + 1}º</b><span class="cresce">${p.nome}</span><${SeloSeccional} uf=${p.seccional} /><b>${fmt(p.pontos)}</b></div>`)}</div>
      <${Seccionais} lista=${est.seccionais} minha=${est.eu.seccional} />
      <p class="suave" style="margin-top:18px">${LEMA}<br />Continue treinando no VDE. Constância vence talento.</p>
    </div>`;
}

function Seccionais({ lista, minha }) {
  if (!lista?.length) return null;
  return html`<div class="cartao" style="margin-top:12px;text-align:left;padding:14px 16px"><b style="display:block;margin-bottom:4px">Disputa das Seccionais</b><span class="fraco" style="font-size:12px">média de pontos por examinando</span>
    ${lista.map((x, i) => html`<div class="linha-flex" style="padding:7px 0;border-top:${i ? '1px solid var(--linha)' : '0'};${x.seccional === minha ? 'font-weight:700' : ''}"><b style="width:28px;color:var(--indigo)">${i + 1}º</b><${SeloSeccional} uf=${x.seccional} /><span class="cresce">${nomeSeccional(x.seccional)} <span class="fraco" style="font-size:12px">(${x.n})</span></span><b>${fmt(x.media)}</b></div>`)}</div>`;
}

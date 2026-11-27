import { html, useState, useEffect, useRef, useMemo } from '../vendor/preact-htm.mjs';
import { LETRAS, TIPOS, carregarIndice, buscarIndice, semAcento, corrigir, notasEtapas, textoGabarito, corDoNome, iniciais, linkPlanalto } from './core.js';

// ---------- ícones ----------
const P = {
  certo: 'M5 12.5l4.5 4.5L19 7.5',
  errado: 'M6 6l12 12M18 6L6 18',
  livro: 'M4 5.5A2.5 2.5 0 016.5 3H20v15H6.5A2.5 2.5 0 004 20.5v-15zM4 20.5A2.5 2.5 0 016.5 23H20v-5',
  busca: 'M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3',
  fogo: 'M12 22c4.4 0 7-2.9 7-6.6 0-3.4-2.3-5.8-4.2-8.1-.5 1.9-1.6 3-2.8 3.4.4-2.9-.6-5.9-3.3-8.7.2 3.3-1.4 5.1-2.9 7C4.6 10.6 5 12.4 5 15.4 5 19.1 7.6 22 12 22z',
  trofeu: 'M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4zM7 6H4v1a3 3 0 003 3M17 6h3v1a3 3 0 01-3 3',
  cima: 'M6 15l6-6 6 6',
  baixo: 'M6 9l6 6 6-6',
  seta: 'M5 12h14M13 6l6 6-6 6',
  voltar: 'M19 12H5M11 18l-6-6 6-6',
  fechar: 'M6 6l12 12M18 6L6 18',
  play: 'M7 5l12 7-12 7V5z',
  olho: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z',
  relogio: 'M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2',
  pessoas: 'M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM22 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8',
  mais: 'M12 5v14M5 12h14',
  lixo: 'M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14',
  copiar: 'M9 9h11v11H9zM5 15H4V4h11v1',
  tela: 'M3 4h18v12H3zM8 20h8M12 16v4',
  controle: 'M4 6h16M4 12h16M4 18h10',
  baixar: 'M12 3v12M6 11l6 6 6-6M4 21h16',
  coroa: 'M3 8l4.5 4L12 4l4.5 8L21 8l-2 11H5L3 8z',
  raio: 'M13 2L4 14h7l-1 8 9-12h-7l1-8z',
  editar: 'M4 20h4L19 9l-4-4L4 16v4z',
  sair: 'M15 4h4v16h-4M10 17l5-5-5-5M15 12H3',
  ajuda: 'M12 22a10 10 0 100-20 10 10 0 000 20zM9.1 9a3 3 0 015.8 1c0 2-3 2.5-3 4.5M12 18h.01',
};
export const Icone = ({ n, t = 22, c = 2.2, cls = '' }) => html`<svg class=${cls} width=${t} height=${t} viewBox="0 0 24 24" fill=${n === 'fogo' || n === 'coroa' || n === 'raio' || n === 'play' ? 'currentColor' : 'none'} stroke="currentColor" stroke-width=${c} stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d=${P[n] || ''} /></svg>`;

export const Marca = ({ claro, titulo = 'Arena ao vivo' }) => html`
  <div class=${'marca' + (claro ? ' claro' : '')}><div class="selo">V</div><div><small>Método VDE</small><b>${titulo}</b></div></div>`;

export const Avatar = ({ nome, g, cls = '' }) => html`<div class=${`avatar ${g ? 'g' : ''} ${cls}`} style=${{ background: `linear-gradient(150deg, ${corDoNome(nome)}, #8B2BE2)` }}>${iniciais(nome)}</div>`;

// ---------- entrada de resposta (aluno) ----------
// controlado: valor/setValor. "imediato" envia ao tocar (C/E e múltipla soltas).
export function Responder({ tipo, c, valor, setValor, desab, aoEnviar, imediato }) {
  c = c || {};
  if (tipo === 'ce') {
    const escolher = (v) => { if (desab) return; setValor({ v }); if (imediato) aoEnviar?.({ v }); };
    return html`
      <div class="afirmacao">${c.afirmacao}</div>
      <div class="ce-botoes">
        <button class=${`ce-btn certo ${valor?.v === true ? 'sel' : ''} ${valor && valor.v !== true ? 'apagado' : ''}`} disabled=${desab} onClick=${() => escolher(true)}><${Icone} n="certo" c="3" />CERTO</button>
        <button class=${`ce-btn errado ${valor?.v === false ? 'sel' : ''} ${valor && valor.v !== false ? 'apagado' : ''}`} disabled=${desab} onClick=${() => escolher(false)}><${Icone} n="errado" c="3" />ERRADO</button>
      </div>`;
  }
  if (tipo === 'multipla') {
    const escolher = (i) => { if (desab) return; setValor({ i }); if (imediato) aoEnviar?.({ i }); };
    return html`
      ${c.enunciado && html`<div class="enunciado">${c.enunciado}</div>`}
      <div class="opcoes">${(c.alternativas || []).map((a, i) => html`
        <button class=${`opcao ${valor?.i === i ? 'sel' : ''}`} disabled=${desab} onClick=${() => escolher(i)}>
          <span class=${`letra l${i % 6}`}>${LETRAS[i]}</span><span>${a}</span></button>`)}</div>`;
  }
  if (tipo === 'multi') {
    const sel = new Set(valor?.sel || []);
    const alternar = (i) => { if (desab) return; sel.has(i) ? sel.delete(i) : sel.add(i); setValor({ sel: [...sel].sort((a, b) => a - b) }); };
    return html`
      ${c.enunciado && html`<div class="enunciado">${c.enunciado}</div>`}
      <p class="fraco" style="font-size:13px;margin:10px 0 0">Marque todas as que se aplicam. Marcar errado desconta.</p>
      <div class="opcoes">${(c.opcoes || []).map((a, i) => html`
        <button class=${`opcao ${sel.has(i) ? 'sel' : ''}`} disabled=${desab} onClick=${() => alternar(i)}>
          <span class="caixa">${sel.has(i) && html`<${Icone} n="certo" t="16" c="3.2" />`}</span><span>${a}</span></button>`)}</div>`;
  }
  if (tipo === 'ordenar') {
    const ordem = valor?.ordem || c.itens || [];
    const mover = (i, d) => { const o = [...ordem]; const j = i + d; if (j < 0 || j >= o.length) return; [o[i], o[j]] = [o[j], o[i]]; setValor({ ordem: o }); };
    return html`
      ${c.enunciado && html`<div class="enunciado">${c.enunciado}</div>`}
      <div class="ordem-lista">${ordem.map((t, i) => html`
        <div class="ordem-item" key=${t}><span class="num">${i + 1}</span><span class="txt">${t}</span>
          <span class="setas"><button disabled=${desab || i === 0} onClick=${() => mover(i, -1)} aria-label="Subir"><${Icone} n="cima" t="18" c="2.6" /></button>
          <button disabled=${desab || i === ordem.length - 1} onClick=${() => mover(i, 1)} aria-label="Descer"><${Icone} n="baixo" t="18" c="2.6" /></button></span></div>`)}</div>`;
  }
  if (tipo === 'artigo') {
    return html`
      ${c.enunciado && html`<div class="enunciado">${c.enunciado}</div>`}
      ${c.dica && html`<p class="chip roxo" style="margin-top:12px">Dica: ${c.dica}</p>`}
      <label class="campo" style="margin-top:16px"><span>Dispositivo (ex.: art. 5º, LXXIII, CF)</span>
        <input class="inp" style="font-size:18px;font-weight:600" value=${valor?.t || ''} disabled=${desab} placeholder="Art. ..." onInput=${(e) => setValor({ t: e.target.value })} /></label>
      <p class="fraco" style="font-size:13px;margin:-4px 0 0">Use o Índice Remissivo para achar o artigo.</p>`;
  }
  if (tipo === 'texto') {
    return html`
      ${c.enunciado && html`<div class="enunciado">${c.enunciado}</div>`}
      <label class="campo" style="margin-top:16px"><span>Sua resposta</span>
        <textarea class="inp" rows="5" maxlength="1500" value=${valor?.t || ''} disabled=${desab} placeholder="Escreva com as palavras-chave da tese…" onInput=${(e) => setValor({ t: e.target.value })}></textarea></label>`;
  }
  if (tipo === 'etapas') return html`<${Etapas} c=${c} valor=${valor} setValor=${setValor} desab=${desab} />`;
  return html`<p>Tipo desconhecido.</p>`;
}

function Etapas({ c, valor, setValor, desab }) {
  const [at, setAt] = useState(0);
  const et = c.etapas || [];
  const vals = valor?.etapas || [];
  const e = et[at];
  if (!e) return null;
  const setSub = (v) => { const n = [...vals]; n[at] = v; setValor({ etapas: n }); };
  return html`
    <div class="enunciado caso">${c.enunciado}</div>
    <div class="etapas-trilha">${et.map((_, i) => html`<button aria-label=${`Etapa ${i + 1}`} class=${i === at ? 'atual' : vals[i] ? 'feita' : ''} onClick=${() => setAt(i)}></button>`)}</div>
    <div key=${at} style="animation: surge .35s">
      <div class="etapa-titulo"><span class="n">${at + 1}</span><div><small class="fraco">Etapa ${at + 1} de ${et.length} · ${TIPOS[e.tipo]?.nome}</small><h3>${e.titulo}</h3></div></div>
      <${Responder} tipo=${e.tipo} c=${e} valor=${vals[at]} setValor=${setSub} desab=${desab} />
      <div class="linha-flex entre" style="margin-top:14px">
        <button class="btn btn-s" disabled=${at === 0} onClick=${() => setAt(at - 1)}><${Icone} n="voltar" t="18" /> Anterior</button>
        ${at < et.length - 1 && html`<button class="btn btn-chip" onClick=${() => setAt(at + 1)}>Próxima etapa <${Icone} n="seta" t="18" /></button>`}
      </div>
    </div>`;
}

// ---------- correção para o aluno ----------
export function Correcao({ tipo, c, g, valor }) {
  c = c || {}; g = g || {};
  if (tipo === 'ce') return html`<div class="gabarito-box"><h4>Gabarito</h4><div style="font-size:22px;font-weight:700;color:${g.certo ? 'var(--certo)' : 'var(--errado)'}">${g.certo ? 'CERTO' : 'ERRADO'}</div>
    <div class="fraco" style="font-size:14px">Você marcou: ${valor ? (valor.v ? 'certo' : 'errado') : '—'}</div>${coment(g)}</div>`;
  if (tipo === 'multipla') return html`<div class="gabarito-box"><h4>Gabarito</h4><div class="opcoes" style="margin-top:6px">${(c.alternativas || []).map((a, i) => {
    const ok = i === g.correta; const meu = valor?.i === i;
    return html`<div class=${`opcao ${ok ? 'ok' : meu ? 'no' : ''}`}><span class=${`letra l${i % 6}`}>${LETRAS[i]}</span><span>${a}</span>${meu && html`<span class="marca-res">você</span>`}</div>`;
  })}</div>${coment(g)}</div>`;
  if (tipo === 'multi') {
    const cor = new Set(g.corretas || []); const sel = new Set(valor?.sel || []);
    return html`<div class="gabarito-box"><h4>Gabarito</h4><div class="opcoes" style="margin-top:6px">${(c.opcoes || []).map((a, i) => html`
      <div class=${`opcao ${cor.has(i) ? 'ok' : sel.has(i) ? 'no' : ''}`}><span class="caixa" style=${cor.has(i) ? 'background:var(--certo);border-color:var(--certo);color:#fff' : ''}>${cor.has(i) && html`<${Icone} n="certo" t="16" c="3.2" />`}</span><span>${a}</span>
      ${sel.has(i) && html`<span class="marca-res" style=${`color:${cor.has(i) ? 'var(--certo)' : 'var(--errado)'}`}>${cor.has(i) ? 'marcou ✓' : 'marcou ✗'}</span>`}</div>`)}</div>${coment(g)}</div>`;
  }
  if (tipo === 'ordenar') {
    const r = valor?.ordem || [];
    return html`<div class="gabarito-box"><h4>Ordem certa</h4><div class="ordem-lista">${(g.ordem || []).map((t, i) => html`
      <div class=${`ordem-item ${r[i] === t ? 'ok' : 'no'}`}><span class="num">${i + 1}</span><span class="txt">${t}</span>${r[i] !== t && html`<small class="fraco" style="max-width:40%">você: ${r[i] || '—'}</small>`}</div>`)}</div>${coment(g)}</div>`;
  }
  if (tipo === 'artigo') return html`<div class="gabarito-box"><h4>Dispositivo</h4><div style="font-size:20px;font-weight:700;color:var(--certo)">${g.resposta || (g.aceitas || [])[0]}</div>
    <div class="fraco" style="font-size:14px">Você escreveu: ${valor?.t || '—'}</div>${coment(g)}</div>`;
  if (tipo === 'texto') return html`<div class="gabarito-box"><h4>Resposta esperada</h4>${g.modelo && html`<div style="white-space:pre-wrap">${g.modelo}</div>`}
    ${(g.palavras || []).length > 0 && html`<div class="linha-flex" style="margin-top:10px">${g.palavras.map((p) => {
      const ok = semAcento(valor?.t || '').includes(semAcento(String(p).split('|')[0]).trim()) || String(p).split('|').some((x) => semAcento(valor?.t || '').includes(semAcento(x).trim()));
      return html`<span class=${`chip ${ok ? 'verde' : 'vermelho'}`}>${ok ? '✓' : '✗'} ${String(p).split('|')[0]}</span>`;
    })}</div>`}
    <div class="fraco" style="font-size:14px;margin-top:10px;white-space:pre-wrap">Você escreveu: ${valor?.t || '—'}</div>${coment(g)}</div>`;
  if (tipo === 'etapas') {
    const notas = notasEtapas(c, g, valor);
    return html`<div class="gabarito-box"><h4>Etapa por etapa</h4>${(c.etapas || []).map((e, i) => {
      const n = notas[i]; const cor = n >= 1 ? 'var(--certo)' : n > 0 ? '#e8890c' : 'var(--errado)';
      return html`<div class="etapa-res"><span class="bol" style=${`background:${cor}`}>${i + 1}</span><div class="cresce"><b style="font-size:15px">${e.titulo}</b>
        <div style="color:#0b7a45;font-size:14.5px;font-weight:600">${textoGabarito(e.tipo, e, (g.etapas || [])[i])}</div>
        ${(g.etapas || [])[i]?.comentario && html`<div class="fraco" style="font-size:13.5px">${g.etapas[i].comentario}</div>`}</div>
        <b style=${`color:${cor};font-size:14px`}>${Math.round(n * 100)}%</b></div>`;
    })}${coment(g)}</div>`;
  }
  return null;
}
const coment = (g) => g?.comentario ? html`<div class="comentario">${g.comentario}</div>` : null;

// ---------- Índice Remissivo ----------
export function GavetaIndice({ aberto, fechar, aoUsar }) {
  const [lista, setLista] = useState(null);
  const [q, setQ] = useState('');
  const ref = useRef();
  useEffect(() => { if (aberto) { carregarIndice().then(setLista); setTimeout(() => ref.current?.focus(), 250); } }, [aberto]);
  const res = useMemo(() => (lista && q.trim().length >= 2 ? buscarIndice(lista, q) : []), [lista, q]);
  if (!aberto) return null;
  return html`
    <div class="gaveta-fundo" onClick=${fechar}></div>
    <aside class="gaveta" role="dialog" aria-label="Índice Remissivo">
      <div class="gaveta-cab">
        <div class="linha-flex entre"><span class="sobrelinha" style="opacity:.85">Consulta inteligente · CF/88 e leis</span>
          <button class="btn btn-icone" style="background:rgba(255,255,255,.18);color:#fff" onClick=${fechar} aria-label="Fechar"><${Icone} n="fechar" t="18" /></button></div>
        <h3>Índice Remissivo Virtual</h3>
        <div class="busca"><${Icone} n="busca" /><input ref=${ref} class="inp" placeholder="Ex.: ação popular, subsídio, art. 29…" value=${q} onInput=${(e) => setQ(e.target.value)} /></div>
      </div>
      <div class="gaveta-lista">
        ${!lista && html`<div class="vazio"><div class="pontinhos"><span></span><span></span><span></span></div></div>`}
        ${lista && q.trim().length < 2 && html`<div class="vazio"><b>${lista.length.toLocaleString('pt-BR')} verbetes</b><br />Busque por palavra, expressão ou artigo. A busca ignora acentos.</div>`}
        ${lista && q.trim().length >= 2 && !res.length && html`<div class="vazio">Nada encontrado para “${q}”. Tente um sinônimo.</div>`}
        ${res.map((e) => html`<div class="verbete" key=${e.t}>
          <b>${realce(e.t, q)}</b>
          <span class="art">${e.a.length > 70 ? e.a.slice(0, 70).replace(/[;,]?\s*\S*$/, '') + '…' : e.a}</span>
          ${e.d && e.d !== e.a && html`<div class="det" title="Toque para ver tudo" onClick=${(ev) => ev.currentTarget.classList.toggle('aberto')}>${e.d}</div>`}
          ${aoUsar && html`<div style="margin-top:8px"><button class="btn btn-chip btn-peq" onClick=${() => { aoUsar(e.a); fechar(); }}>Usar na resposta</button></div>`}
        </div>`)}
        ${lista && html`<p class="fraco" style="font-size:12px;text-align:center;margin-top:14px">Texto integral: <a href=${linkPlanalto()} target="_blank" rel="noopener">Constituição no Planalto</a></p>`}
      </div>
    </aside>`;
}
function realce(txt, q) {
  const t = semAcento(q).split(/\s+/).filter(Boolean)[0];
  if (!t) return txt;
  const i = semAcento(txt).indexOf(t);
  if (i < 0) return txt;
  return html`${txt.slice(0, i)}<mark>${txt.slice(i, i + t.length)}</mark>${txt.slice(i + t.length)}`;
}

// ---------- confete ----------
export function confete(qtd = 140) {
  const cv = document.createElement('canvas'); cv.className = 'confete'; document.body.appendChild(cv);
  const ctx = cv.getContext('2d'); const W = (cv.width = innerWidth), H = (cv.height = innerHeight);
  const cores = ['#1A6DF0', '#4F46E5', '#8B2BE2', '#14B86A', '#F5B400', '#ffffff', '#FF5A8A'];
  const ps = Array.from({ length: qtd }, () => ({ x: W / 2 + (Math.random() - .5) * W * .3, y: H * .35, vx: (Math.random() - .5) * 18, vy: -Math.random() * 18 - 6, r: Math.random() * 6 + 4, c: cores[Math.floor(Math.random() * cores.length)], a: Math.random() * 6, va: (Math.random() - .5) * .3 }));
  let f = 0;
  (function loop() {
    ctx.clearRect(0, 0, W, H);
    for (const p of ps) { p.vy += .45; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.va; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore(); }
    if (++f < 200) requestAnimationFrame(loop); else cv.remove();
  })();
}

// número que sobe
export function Contador({ valor, dur = 900 }) {
  const [v, setV] = useState(0); const de = useRef(0);
  useEffect(() => {
    const ini = de.current, t0 = performance.now(); let id;
    const passo = (t) => { const k = Math.min(1, (t - t0) / dur); const e = 1 - Math.pow(1 - k, 3); setV(Math.round(ini + (valor - ini) * e)); if (k < 1) id = requestAnimationFrame(passo); else de.current = valor; };
    id = requestAnimationFrame(passo); return () => cancelAnimationFrame(id);
  }, [valor]);
  return html`${v.toLocaleString('pt-BR')}`;
}

export function Toast({ msg }) { return msg ? html`<div class="toast">${msg}</div>` : null; }
export function useToast() {
  const [msg, setMsg] = useState(''); const t = useRef();
  return [msg, (m) => { setMsg(m); clearTimeout(t.current); t.current = setTimeout(() => setMsg(''), 2600); }];
}

export { corrigir };

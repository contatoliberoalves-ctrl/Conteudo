// Jogos da Ordem: a camada de jogo da Arena (temática autoral: Seccionais da OAB, convocação, provas, patentes).
import { html, useEffect, useRef, useState } from '../vendor/preact-htm.mjs';

export const NOME_JOGO = 'Jogos da Ordem';
export const LEMA = 'Que o artigo certo esteja sempre ao seu alcance.';

export const SECCIONAIS = [
  ['AC', 'Acre'], ['AL', 'Alagoas'], ['AP', 'Amapá'], ['AM', 'Amazonas'], ['BA', 'Bahia'], ['CE', 'Ceará'], ['DF', 'Distrito Federal'],
  ['ES', 'Espírito Santo'], ['GO', 'Goiás'], ['MA', 'Maranhão'], ['MT', 'Mato Grosso'], ['MS', 'Mato Grosso do Sul'], ['MG', 'Minas Gerais'],
  ['PA', 'Pará'], ['PB', 'Paraíba'], ['PR', 'Paraná'], ['PE', 'Pernambuco'], ['PI', 'Piauí'], ['RJ', 'Rio de Janeiro'], ['RN', 'Rio Grande do Norte'],
  ['RS', 'Rio Grande do Sul'], ['RO', 'Rondônia'], ['RR', 'Roraima'], ['SC', 'Santa Catarina'], ['SP', 'São Paulo'], ['SE', 'Sergipe'], ['TO', 'Tocantins'],
];
export const nomeSeccional = (uf) => (SECCIONAIS.find((s) => s[0] === uf) || [uf, uf])[1];

// patente pelo número de provas gabaritadas
export const PATENTES = [
  [0, 'Inscrito(a)'], [1, 'Examinando(a)'], [2, 'Aprovado(a) na 1ª fase'], [4, 'Combatente da 2ª fase'],
  [6, 'Advogado(a) da Ordem'], [9, 'Conselheiro(a) Seccional'], [12, 'Lenda da Ordem'],
];
export function patente(acertos) {
  let p = PATENTES[0], i = 0;
  PATENTES.forEach((x, k) => { if (acertos >= x[0]) { p = x; i = k; } });
  return { nome: p[1], nivel: i, proxima: PATENTES[i + 1] || null };
}

// ---------- emblema (autoral: balança cujo fiel é uma chama, dentro de um anel com ramos) ----------
export function Emblema({ t = 120, cls = '' }) {
  const ramos = [];
  for (let i = 0; i < 8; i++) {
    const a = (110 + i * 17) * Math.PI / 180, b = (70 - i * 17) * Math.PI / 180;
    for (const ang of [a, b]) {
      const x = 60 + 47 * Math.cos(ang), y = 60 + 47 * Math.sin(ang);
      const rot = (ang * 180 / Math.PI) + (ang === a ? 55 : -55);
      ramos.push(html`<ellipse cx=${x} cy=${y} rx="5.2" ry="2.2" transform=${`rotate(${rot} ${x} ${y})`} fill="url(#emb-ouro)" />`);
    }
  }
  return html`<svg class=${`emblema ${cls}`} width=${t} height=${t} viewBox="0 0 120 120" aria-hidden="true">
    <defs>
      <linearGradient id="emb-ouro" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE29A" /><stop offset=".5" stop-color="#F5B942" /><stop offset="1" stop-color="#C77B14" /></linearGradient>
      <linearGradient id="emb-fogo" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FF4D2E" /><stop offset=".55" stop-color="#FF9A3D" /><stop offset="1" stop-color="#FFE29A" /></linearGradient>
    </defs>
    <circle cx="60" cy="60" r="56" fill="none" stroke="url(#emb-ouro)" stroke-width="3" />
    <circle cx="60" cy="60" r="38" fill="rgba(20,10,46,.55)" stroke="url(#emb-ouro)" stroke-width="1.5" />
    ${ramos}
    <path d="M60 30c5 7 9 11 9 18a9 9 0 01-18 0c0-4 2-7 4-9 0 4 2 6 4 6-2-5 0-10 1-15z" fill="url(#emb-fogo)" />
    <path d="M60 57v22M50 82h20M36 58h48" stroke="url(#emb-ouro)" stroke-width="3" stroke-linecap="round" />
    <path d="M40 58l-7 14h14zM80 58l-7 14h14z" fill="none" stroke="url(#emb-ouro)" stroke-width="1.8" stroke-linejoin="round" />
    <path d="M32 72a8 4 0 0016 0zM72 72a8 4 0 0016 0z" fill="url(#emb-ouro)" />
  </svg>`;
}

export const SeloSeccional = ({ uf, grande }) => uf ? html`<span class=${`selo-sec ${grande ? 'g' : ''}`} title=${`Seccional ${nomeSeccional(uf)}`}><small>OAB</small>${uf}</span>` : null;

// ---------- brasas subindo (canvas) ----------
export function Brasas({ qtd = 60, cls = '' }) {
  const ref = useRef();
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d'); let W, H, id;
    const ajustar = () => { W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight; };
    ajustar(); addEventListener('resize', ajustar);
    const nova = (inicio) => ({ x: Math.random() * W, y: inicio ? Math.random() * H : H + 10, r: Math.random() * 2.4 + .6, vy: Math.random() * .7 + .3, fase: Math.random() * 6.28, vida: Math.random() * .5 + .5 });
    const ps = Array.from({ length: qtd }, () => nova(true));
    const reduzir = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const passo = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of ps) {
        p.y -= p.vy; p.fase += .03; p.x += Math.sin(p.fase) * .4;
        if (p.y < -10) Object.assign(p, nova(false));
        const a = Math.min(1, p.y / H + .15) * p.vida;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, `rgba(255,214,140,${a})`); g.addColorStop(.35, `rgba(255,140,50,${a * .7})`); g.addColorStop(1, 'rgba(255,90,30,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, 6.29); ctx.fill();
      }
      if (!reduzir) id = requestAnimationFrame(passo);
    };
    passo();
    return () => { cancelAnimationFrame(id); removeEventListener('resize', ajustar); };
  }, []);
  return html`<canvas ref=${ref} class=${`brasas ${cls}`} aria-hidden="true"></canvas>`;
}

// ---------- sons ----------
const cache = {};
export function som(nome) {
  if (!cache[nome]) { cache[nome] = new Audio(new URL(`../sons/${nome}.mp3`, import.meta.url).href); cache[nome].preload = 'auto'; }
  return cache[nome];
}
export function tocar(nome, vol = 1) {
  const a = som(nome); a.volume = vol;
  try { a.currentTime = 0; } catch {}
  return a.play().then(() => true).catch(() => false);
}
export function preCarregar() { som('vinheta'); som('revelar'); }

// ---------- cena de convocação (7 s, sem pular) ----------
// aluno: "A Seccional X convoca: NOME". Tela de transmissão: abertura dos jogos.
export function Convocacao({ nome, seccional, titulo, aoFim, modo = 'aluno', jaTocando }) {
  const [t, setT] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);
  const inicio = useRef(0);
  useEffect(() => {
    let id;
    const rodar = () => {
      inicio.current = performance.now();
      const loop = (agora) => { const s = (agora - inicio.current) / 1000; setT(s); if (s < 7.2) id = requestAnimationFrame(loop); else aoFim?.(); };
      id = requestAnimationFrame(loop);
    };
    if (jaTocando) rodar();
    else tocar('vinheta').then((ok) => { if (ok) rodar(); else setBloqueado(true); });
    return () => cancelAnimationFrame(id);
  }, []);
  if (bloqueado) return html`<div class="convoca"><${Brasas} /><button class="btn btn-ouro btn-g" onClick=${() => { setBloqueado(false); tocar('vinheta').then(() => { inicio.current = performance.now(); const loop = (a) => { const s = (a - inicio.current) / 1000; setT(s); if (s < 7.2) requestAnimationFrame(loop); else aoFim?.(); }; requestAnimationFrame(loop); }); }}>Toque para ouvir a convocação</button></div>`;
  const fase = t < 1.1 ? 0 : t < 2.6 ? 1 : t < 5.2 ? 2 : 3;
  const primeiro = String(nome || '').trim().split(/\s+/)[0];
  return html`
    <div class=${`convoca f${fase} ${modo}`} role="dialog" aria-label="Convocação">
      <${Brasas} qtd=${modo === 'tela' ? 120 : 70} />
      <div class="convoca-luz"></div>
      ${fase === 3 && html`<div class="convoca-flash"></div>`}
      <div class="convoca-centro">
        <div class="convoca-emblema"><${Emblema} t=${modo === 'tela' ? 300 : 150} /></div>
        <div class="convoca-sobre">${NOME_JOGO}</div>
        ${modo === 'aluno' ? html`
          ${fase >= 1 && html`<div class="convoca-linha">${seccional ? `A Seccional ${nomeSeccional(seccional)} convoca` : 'A Ordem convoca'}</div>`}
          ${fase >= 2 && html`<div class="convoca-nome">${nome}</div>`}
          ${fase >= 3 && html`<div class="convoca-lema">${primeiro}, ${LEMA.charAt(0).toLowerCase() + LEMA.slice(1)}</div>`}`
        : html`
          ${fase >= 1 && html`<div class="convoca-linha">${titulo}</div>`}
          ${fase >= 2 && html`<div class="convoca-nome">Que comecem os ${NOME_JOGO}</div>`}
          ${fase >= 3 && html`<div class="convoca-lema">${LEMA}</div>`}`}
      </div>
      <div class="convoca-barra"><i style=${{ width: `${Math.min(100, (t / 7) * 100)}%` }}></i></div>
    </div>`;
}

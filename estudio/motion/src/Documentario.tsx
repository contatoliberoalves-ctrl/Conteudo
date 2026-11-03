// Documentário estilo Vox: papel, recortes em colagem, palavras grandes no tempo da voz,
// marcas feitas à mão (círculo, sublinhado, seta) e movimento em passos de stop motion.
// O roteiro vem do ev/documentario.py; tempos em quadros relativos à cena.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, interpolate, random, staticFile, useCurrentFrame} from 'remotion';

type Pose = {dx?: number; dy?: number; s?: number; r?: number};
type CamadaDoc = {
  img: string; x: number; y: number; w: number; rot?: number; t?: number; ate?: number;
  de?: Pose; para?: Pose; dur?: number; passo?: number; sombra?: boolean; moldura?: 'quadro' | 'foto' | 'nenhuma';
  cor?: boolean; legenda?: string; opacidade?: number;
};
type PalavraDoc = {texto: string; t: number; x: number; y: number; tam: number; cor?: string; reto?: boolean; ate?: number; largura?: number};
type MarcaDoc = {tipo: 'circulo' | 'sublinhado' | 'seta' | 'risco'; t: number; x: number; y: number; w: number; h: number; cor?: string; dur?: number};
type CenaDoc = {
  inicio: number; duracao: number;
  fundo?: {img?: string; papel?: boolean; zoom?: [number, number]; escurecer?: number; cor?: boolean; x?: number; y?: number};
  camadas?: CamadaDoc[]; palavras?: PalavraDoc[]; marcas?: MarcaDoc[];
  rodape?: {texto: string; t: number; y?: number; cor?: string};
};
export type DocumentarioProps = {
  largura: number; altura: number; fps: number; total: number;
  tom?: 'pb' | 'sepia' | 'cor'; papel?: string;
  fontes: {serif: string; reto: string};
  cenas: CenaDoc[];
};

const filtroTom = (tom: string | undefined, cor?: boolean) =>
  cor || tom === 'cor' ? 'contrast(1.05) saturate(.85)' : tom === 'sepia' ? 'grayscale(1) sepia(.35) contrast(1.15) brightness(.98)' : 'grayscale(1) contrast(1.18) brightness(.97)';

// passo de stop motion: o tempo anda em degraus (passo=3 → 10 poses por segundo)
const degrau = (f: number, passo: number) => Math.floor(f / passo) * passo;

const Papel: React.FC<{seed: number; cor: string; W: number; H: number}> = ({seed, cor, W, H}) => (
  <AbsoluteFill style={{background: cor}}>
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      <filter id={`fibra${seed}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves={4} seed={seed} />
        <feColorMatrix values="0 0 0 0 0.42  0 0 0 0 0.38  0 0 0 0 0.32  0 0 0 0.55 0" />
      </filter>
      <rect width={W} height={H} filter={`url(#fibra${seed})`} opacity={0.16} />
      <filter id={`fino${seed}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.55 0.9" numOctaves={2} seed={seed + 7} />
        <feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.27  0 0 0 0 0.22  0 0 0 0.9 0" />
      </filter>
      <rect width={W} height={H} filter={`url(#fino${seed})`} opacity={0.22} />
      <radialGradient id="mancha" cx="50%" cy="45%" r="75%">
        <stop offset="55%" stopColor="#000" stopOpacity={0} />
        <stop offset="100%" stopColor="#3b3226" stopOpacity={0.22} />
      </radialGradient>
      <rect width={W} height={H} fill="url(#mancha)" />
    </svg>
  </AbsoluteFill>
);

// grão de filme que muda a cada 2 quadros (dá a sensação de "feito à mão")
const Grao: React.FC<{f: number; W: number; H: number}> = ({f, W, H}) => {
  const s = Math.floor(f / 2) % 24;
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0, mixBlendMode: 'overlay', opacity: 0.5, pointerEvents: 'none'}}>
      <filter id={`grao${s}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={s} /><feColorMatrix type="saturate" values="0" /></filter>
      <rect width={W} height={H} filter={`url(#grao${s})`} />
    </svg>
  );
};

const Camada: React.FC<{c: CamadaDoc; lf: number; W: number; H: number; tom?: string; seed: number}> = ({c, lf, W, H, tom, seed}) => {
  const t0 = c.t ?? 0;
  if (lf < t0 || (c.ate !== undefined && lf >= c.ate)) return null;
  const passo = c.passo ?? 3;
  const q = degrau(lf - t0, passo);
  const dur = c.dur ?? 18;
  const k = interpolate(q, [0, dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const e = 1 - Math.pow(1 - k, 3);
  const de = c.de ?? {}, pa = c.para ?? {};
  const v = (a?: number, b?: number, base = 0) => (a ?? base) + ((b ?? base) - (a ?? base)) * e;
  // tremidinha de stop motion: cada pose fica 1–2 px fora do lugar
  const jx = (random(`${seed}-${q}-x`) - 0.5) * 0.003 * W, jy = (random(`${seed}-${q}-y`) - 0.5) * 0.003 * W;
  const jr = (random(`${seed}-${q}-r`) - 0.5) * 0.5;
  const x = (c.x + v(de.dx, pa.dx)) * W + jx, y = (c.y + v(de.dy, pa.dy)) * H + jy;
  const s = v(de.s, pa.s, 1), r = (c.rot ?? 0) + v(de.r, pa.r) + jr;
  const entra = Math.min(1, (lf - t0) / 3);
  const mold = c.moldura ?? 'nenhuma';
  const borda = mold === 'foto' ? {padding: 0.018 * W, paddingBottom: 0.05 * W, background: '#f3efe6'} : mold === 'quadro' ? {padding: 0.025 * W, background: 'linear-gradient(135deg,#6b5636,#2c2214 45%,#7a6440)', boxShadow: 'inset 0 0 0 3px #a88b55'} : {};
  return (
    <div style={{position: 'absolute', left: x, top: y, width: c.w * W, transform: `translate(-50%,-50%) rotate(${r}deg) scale(${s})`, opacity: entra * (c.opacidade ?? 1),
      filter: c.sombra === false ? undefined : `drop-shadow(0 ${0.012 * W}px ${0.016 * W}px rgba(0,0,0,.45))`}}>
      <div style={borda}>
        <Img src={staticFile(c.img)} style={{width: '100%', display: 'block', filter: filtroTom(tom, c.cor)}} />
      </div>
      {c.legenda ? <div style={{fontFamily: 'DocSerif', fontSize: 0.03 * W, color: '#222', textAlign: 'center', marginTop: 0.008 * W}}>{c.legenda}</div> : null}
    </div>
  );
};

const Palavra: React.FC<{p: PalavraDoc; lf: number; W: number; H: number}> = ({p, lf, W, H}) => {
  if (lf < p.t || (p.ate !== undefined && lf >= p.ate)) return null;
  const k = Math.min(1, (lf - p.t) / 4);
  const cor = p.cor ?? '#fff';
  const claro = cor.toLowerCase() === '#fff' || cor.toLowerCase() === '#ffffff';
  return (
    <div style={{position: 'absolute', left: p.x * W, top: p.y * H, transform: `translate(-50%,-50%) scale(${1.06 - 0.06 * k})`, opacity: k,
      fontFamily: p.reto ? 'DocReto' : 'DocSerif', fontSize: p.tam * W, lineHeight: 0.95, color: cor, whiteSpace: 'pre', textAlign: 'center',
      letterSpacing: '-0.01em', textShadow: claro ? `0 ${0.004 * W}px ${0.02 * W}px rgba(0,0,0,.55)` : 'none'}}>{p.texto}</div>
  );
};

// traço "de caneta": pontos com ruído, desenhado em degraus
const caminhoMarca = (m: MarcaDoc, W: number, H: number, seed: number) => {
  const cx = m.x * W, cy = m.y * H, rx = (m.w * W) / 2, ry = (m.h * H) / 2;
  const pts: [number, number][] = [];
  if (m.tipo === 'circulo') {
    const n = 46, a0 = -2.2;
    for (let i = 0; i <= n; i++) {
      const a = a0 + (i / n) * Math.PI * 2 * 1.12;
      const ruido = 1 + (random(`${seed}-${i}`) - 0.5) * 0.06 + (i / n) * 0.07;
      pts.push([cx + Math.cos(a) * rx * ruido, cy + Math.sin(a) * ry * ruido * 1.04]);
    }
  } else if (m.tipo === 'sublinhado' || m.tipo === 'risco') {
    const n = 18, yy = m.tipo === 'risco' ? cy : cy + ry;
    for (let i = 0; i <= n; i++) pts.push([cx - rx + (i / n) * 2 * rx, yy + Math.sin(i * 0.7 + seed) * ry * 0.06 + (random(`${seed}-${i}`) - 0.5) * 4]);
  } else {
    const n = 16;
    for (let i = 0; i <= n; i++) { const k = i / n; pts.push([cx - rx + k * 2 * rx, cy + ry - k * 2 * ry + Math.sin(k * 3) * ry * 0.12]); }
  }
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
    d += ` Q${pts[i][0]},${pts[i][1]} ${mx},${my}`;
  }
  return {d, fim: pts[pts.length - 1], antes: pts[pts.length - 3]};
};

const Marca: React.FC<{m: MarcaDoc; lf: number; W: number; H: number; seed: number}> = ({m, lf, W, H, seed}) => {
  if (lf < m.t) return null;
  const dur = m.dur ?? 10;
  const k = Math.min(1, degrau(lf - m.t, 2) / dur);
  const {d, fim, antes} = caminhoMarca(m, W, H, seed);
  const L = 4000;
  const cor = m.cor ?? '#fff';
  const ang = Math.atan2(fim[1] - antes[1], fim[0] - antes[0]);
  const ponta = 0.035 * W;
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.35))'}}>
      <path d={d} fill="none" stroke={cor} strokeWidth={0.0075 * W} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={L} strokeDashoffset={L * (1 - k)} pathLength={L} />
      {m.tipo === 'seta' && k >= 1 ? (
        <path d={`M${fim[0] - ponta * Math.cos(ang - 0.5)},${fim[1] - ponta * Math.sin(ang - 0.5)} L${fim[0]},${fim[1]} L${fim[0] - ponta * Math.cos(ang + 0.5)},${fim[1] - ponta * Math.sin(ang + 0.5)}`}
          fill="none" stroke={cor} strokeWidth={0.0075 * W} strokeLinecap="round" strokeLinejoin="round" />
      ) : null}
    </svg>
  );
};

const Cena: React.FC<{c: CenaDoc; f: number; p: DocumentarioProps; i: number}> = ({c, f, p, i}) => {
  const W = p.largura, H = p.altura, lf = f - c.inicio;
  const fu = c.fundo ?? {papel: true};
  const [z0, z1] = fu.zoom ?? [1.0, 1.07];
  const z = interpolate(lf, [0, c.duracao], [z0, z1]);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: `${(fu.x ?? 0.5) * 100}% ${(fu.y ?? 0.45) * 100}%`}}>
        {fu.papel !== false || !fu.img ? <Papel seed={i + 3} cor={p.papel ?? '#e9e4d8'} W={W} H={H} /> : null}
        {fu.img ? <Img src={staticFile(fu.img)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: filtroTom(p.tom, fu.cor),
          mixBlendMode: fu.papel ? 'multiply' : undefined}} /> : null}
        {fu.escurecer ? <AbsoluteFill style={{background: `rgba(0,0,0,${fu.escurecer})`}} /> : null}
        {(c.camadas ?? []).map((k, j) => <Camada key={j} c={k} lf={lf} W={W} H={H} tom={p.tom} seed={i * 50 + j} />)}
      </AbsoluteFill>
      {(c.palavras ?? []).map((w, j) => <Palavra key={j} p={w} lf={lf} W={W} H={H} />)}
      {(c.marcas ?? []).map((m, j) => <Marca key={j} m={m} lf={lf} W={W} H={H} seed={i * 50 + j} />)}
      {c.rodape && lf >= c.rodape.t ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: (c.rodape.y ?? 0.84) * H, textAlign: 'center', fontFamily: 'DocSerif', fontSize: 0.036 * W,
          color: c.rodape.cor ?? (fu.img ? '#f4efe4' : '#2a2620'), opacity: Math.min(1, (lf - c.rodape.t) / 6), textShadow: fu.img ? '0 2px 8px rgba(0,0,0,.6)' : 'none'}}>{c.rodape.texto}</div>
      ) : null}
    </AbsoluteFill>
  );
};

export const Documentario: React.FC<DocumentarioProps> = (p) => {
  const f = useCurrentFrame();
  const [h] = useState(() => delayRender('fontes'));
  useEffect(() => {
    const fs = [new FontFace('DocSerif', `url(${staticFile(p.fontes.serif)})`), new FontFace('DocReto', `url(${staticFile(p.fontes.reto)})`)];
    Promise.all(fs.map((x) => x.load())).then((r) => { r.forEach((x) => document.fonts.add(x)); continueRender(h); });
  }, [h, p.fontes.serif, p.fontes.reto]);
  const i = Math.max(0, p.cenas.findIndex((x) => f >= x.inicio && f < x.inicio + x.duracao));
  const c = p.cenas[i] ?? p.cenas[p.cenas.length - 1];
  // leve oscilação de exposição, como projetor
  const luz = 1 + (random(`luz-${Math.floor(f / 3)}`) - 0.5) * 0.03;
  return (
    <AbsoluteFill style={{background: '#111', filter: `brightness(${luz})`}}>
      {c ? <Cena c={c} f={f} p={p} i={i} /> : null}
      <Grao f={f} W={p.largura} H={p.altura} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.42))', pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};

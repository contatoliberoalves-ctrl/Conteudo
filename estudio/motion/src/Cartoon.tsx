// Cartoon narrado: cenários desenhados, personagens com boca sincronizada à voz (envelope
// por quadro, calculado no Python a partir do áudio), balões de fala, objetos de cena que
// entram quando a palavra é dita, câmera que anda. Tudo função do quadro.
import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill, Easing, Sequence, continueRender, delayRender, interpolate, spring, staticFile,
  useCurrentFrame, useVideoConfig, Img,
} from 'remotion';
import {Expressao, Personagem, Pose, TipoPersonagem} from './personagens';

type Paleta = {fundo: string; fundo2: string; texto: string; acento: string; apagado: string};
export type CartaPersonagem = {id: string; tipo: TipoPersonagem; x: number; escala?: number; pose?: Pose; expressao?: Expressao;
  entra?: number; sai?: number; virado?: boolean};
export type Fala = {quem: string; inicio: number; fim: number; envelope: number[]; pose?: Pose; expressao?: Expressao; balao?: string};
export type Objeto = {tipo: 'calendario' | 'carimbo' | 'documento' | 'balanca' | 'certo' | 'errado' | 'relogio' | 'imagem' | 'placa';
  x: number; y: number; escala?: number; inicio: number; fim?: number; texto?: string; numero?: number; rotulo?: string; cor?: string; arquivo?: string};
export type CenaCartoon = {inicio: number; duracao: number; cenario: 'sala' | 'tribunal' | 'estudo' | 'palco';
  quadro?: string; camera?: 'parada' | 'zoom-in' | 'zoom-out' | 'pan'; personagens: CartaPersonagem[]; falas: Fala[]; objetos: Objeto[];
  titulo?: {texto: string; inicio: number; fim: number}};
export type CartoonProps = {largura: number; altura: number; fps: number; total: number; paleta: Paleta;
  fontes: {titulo: string; corpo: string}; cenas: CenaCartoon[]; legenda_y?: number};

// ---------------- cenários ----------------
export const Cenario: React.FC<{c: CenaCartoon; W: number; H: number; p: Paleta; f: number}> = ({c, W, H, p, f}) => {
  const chao = H * 0.74;
  const nuvem = (x: number, y: number, s: number, k: number) => (
    <g transform={`translate(${((x + f * 0.4 * k) % (W + 400)) - 200} ${y}) scale(${s})`} opacity={0.9}>
      <ellipse cx={0} cy={0} rx={90} ry={40} fill="#fff" /><ellipse cx={60} cy={-22} rx={60} ry={42} fill="#fff" /><ellipse cx={-55} cy={-12} rx={50} ry={32} fill="#fff" />
    </g>
  );
  if (c.cenario === 'tribunal') {
    const bx = W / 2, bw = Math.min(W * 0.9, H * 0.62), topo = chao - bw * 0.62;
    const cols = 6;
    return (
      <svg width={W} height={H} style={{position: 'absolute'}}>
        <defs><linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7EC3E8" /><stop offset="1" stopColor="#D9F0F7" /></linearGradient></defs>
        <rect width={W} height={H} fill="url(#ceu)" />
        <circle cx={W * 0.82} cy={H * 0.13} r={W * 0.07} fill="#FFE08A" />
        {nuvem(W * 0.2, H * 0.12, W / 1080, 1)}{nuvem(W * 0.75, H * 0.22, W / 1300, 0.6)}
        <rect y={chao} width={W} height={H - chao} fill="#B9C4B2" />
        <g>
          <polygon points={`${bx - bw / 2},${topo + bw * 0.16} ${bx},${topo} ${bx + bw / 2},${topo + bw * 0.16}`} fill="#F1ECE0" stroke="#3A3A3A" strokeWidth={5} />
          <rect x={bx - bw / 2} y={topo + bw * 0.16} width={bw} height={bw * 0.06} fill="#E2DCCB" stroke="#3A3A3A" strokeWidth={5} />
          {Array.from({length: cols}).map((_, i) => {
            const cx = bx - bw / 2 + bw * 0.08 + (i * bw * 0.84) / (cols - 1);
            return <rect key={i} x={cx - bw * 0.035} y={topo + bw * 0.22} width={bw * 0.07} height={chao - topo - bw * 0.3} fill="#FAF6EC" stroke="#3A3A3A" strokeWidth={4} />;
          })}
          {[0, 1, 2].map((i) => <rect key={i} x={bx - bw / 2 - i * 18} y={chao - bw * 0.08 + i * bw * 0.027} width={bw + i * 36} height={bw * 0.03} fill="#E2DCCB" stroke="#3A3A3A" strokeWidth={4} />)}
          <circle cx={bx} cy={topo + bw * 0.1} r={bw * 0.035} fill={p.acento} stroke="#3A3A3A" strokeWidth={4} />
        </g>
      </svg>
    );
  }
  if (c.cenario === 'sala') {
    const qx = W * 0.08, qw = W * 0.84, qy = H * 0.14, qh = H * 0.3;
    return (
      <svg width={W} height={H} style={{position: 'absolute'}}>
        <rect width={W} height={H} fill="#F3E3C3" />
        {Array.from({length: 14}).map((_, i) => <rect key={i} x={(i * W) / 13 - 6} y={0} width={12} height={chao} fill="#EAD5AE" />)}
        <rect x={qx - 18} y={qy - 18} width={qw + 36} height={qh + 36} rx={10} fill="#8A5A33" />
        <rect x={qx} y={qy} width={qw} height={qh} fill="#2E5A47" />
        <rect x={qx + qw * 0.6} y={qy + qh + 4} width={qw * 0.2} height={12} rx={4} fill="#fff" opacity={0.8} />
        {c.quadro ? <text x={W / 2} y={qy + qh / 2} textAnchor="middle" dominantBaseline="middle" fontFamily="Titulo" fontSize={Math.min(qw / (c.quadro.length * 0.48), qh * 0.55)} fill="#F2F2EA" opacity={0.92}>{c.quadro}</text> : null}
        <rect y={chao} width={W} height={H - chao} fill="#B07A4A" />
        {Array.from({length: 8}).map((_, i) => <line key={i} x1={0} y1={chao + i * 42} x2={W} y2={chao + i * 42} stroke="#9A6A3E" strokeWidth={3} />)}
      </svg>
    );
  }
  if (c.cenario === 'estudo') {
    const ang = (f / 30) * 6;
    return (
      <svg width={W} height={H} style={{position: 'absolute'}}>
        <rect width={W} height={H} fill="#DCE6E0" />
        <rect x={W * 0.08} y={H * 0.1} width={W * 0.28} height={W * 0.36} rx={8} fill="#fff" stroke="#3A3A3A" strokeWidth={5} />
        <rect x={W * 0.11} y={H * 0.1 + W * 0.04} width={W * 0.22} height={W * 0.06} fill={p.acento} />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={W * 0.11} y={H * 0.1 + W * (0.14 + i * 0.05)} width={W * (0.22 - i * 0.03)} height={W * 0.018} rx={4} fill="#C9D3CD" />)}
        <g transform={`translate(${W * 0.76} ${H * 0.15})`}>
          <circle r={W * 0.08} fill="#fff" stroke="#3A3A3A" strokeWidth={6} />
          <line x1={0} y1={0} x2={0} y2={-W * 0.05} stroke="#3A3A3A" strokeWidth={7} strokeLinecap="round" transform={`rotate(${ang / 12})`} />
          <line x1={0} y1={0} x2={0} y2={-W * 0.065} stroke={p.acento} strokeWidth={5} strokeLinecap="round" transform={`rotate(${ang})`} />
        </g>
        <rect y={chao} width={W} height={H - chao} fill="#8FA89A" />
        <rect x={W * 0.52} y={chao - H * 0.06} width={W * 0.46} height={H * 0.03} rx={8} fill="#A0683A" stroke="#3A3A3A" strokeWidth={5} />
        <rect x={W * 0.56} y={chao - H * 0.03} width={W * 0.03} height={H * 0.09} fill="#7E4F2A" /><rect x={W * 0.91} y={chao - H * 0.03} width={W * 0.03} height={H * 0.09} fill="#7E4F2A" />
        {[['#2F8F5B', 0], ['#C0392B', 1], ['#2C4A86', 2]].map(([cor, i]) => (
          <rect key={i as number} x={W * 0.6} y={chao - H * 0.06 - (Number(i) + 1) * H * 0.018} width={W * (0.2 - Number(i) * 0.02)} height={H * 0.017} rx={4} fill={cor as string} stroke="#3A3A3A" strokeWidth={4} />
        ))}
        <path d={`M ${W * 0.86} ${chao - H * 0.06} L ${W * 0.88} ${chao - H * 0.16} L ${W * 0.8} ${chao - H * 0.2}`} stroke="#3A3A3A" strokeWidth={8} fill="none" />
        <path d={`M ${W * 0.76} ${chao - H * 0.23} L ${W * 0.84} ${chao - H * 0.2} L ${W * 0.79} ${chao - H * 0.16} Z`} fill={p.acento} stroke="#3A3A3A" strokeWidth={5} />
      </svg>
    );
  }
  // palco: degradê da marca com formas flutuando
  return (
    <svg width={W} height={H} style={{position: 'absolute'}}>
      <defs><radialGradient id="pg" cx="50%" cy="20%" r="90%"><stop offset="0" stopColor={p.fundo2} /><stop offset="1" stopColor={p.fundo} /></radialGradient></defs>
      <rect width={W} height={H} fill="url(#pg)" />
      {Array.from({length: 7}).map((_, i) => (
        <circle key={i} cx={(W * (0.1 + 0.13 * i) + Math.sin(f / 40 + i) * 30) % W} cy={H * (0.15 + 0.1 * (i % 4)) + Math.cos(f / 50 + i) * 25}
          r={W * (0.02 + 0.015 * (i % 3))} fill={p.acento} opacity={0.12 + 0.04 * (i % 3)} />
      ))}
      <ellipse cx={W / 2} cy={chao + 20} rx={W * 0.48} ry={H * 0.04} fill="#000" opacity={0.22} />
    </svg>
  );
};

// ---------------- objetos de cena ----------------
export const ObjetoCena: React.FC<{o: Objeto; f: number; W: number; H: number; p: Paleta; fps: number}> = ({o, f, W, H, p, fps}) => {
  if (f < o.inicio || (o.fim !== undefined && f > o.fim + 8)) return null;
  const s = spring({frame: f - o.inicio, fps, config: {damping: 11, stiffness: 190, mass: 0.7}});
  const saida = o.fim !== undefined ? interpolate(f, [o.fim, o.fim + 8], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  const esc = (o.escala || 1) * (W / 1080);
  const base = {position: 'absolute' as const, left: o.x * W, top: o.y * H, transform: `translate(-50%,-50%) scale(${s * saida * esc}) rotate(${(1 - s) * -12}deg)`};
  const tinta = '#20201E';
  if (o.tipo === 'calendario') {
    const n = Math.round(interpolate(f - o.inicio, [4, 26], [0, o.numero || 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}));
    return (
      <div style={{...base, width: 340, background: '#fff', border: `8px solid ${tinta}`, borderRadius: 30, overflow: 'hidden', boxShadow: '0 20px 0 rgba(0,0,0,.18)'}}>
        <div style={{background: o.cor || '#C0392B', height: 70, borderBottom: `8px solid ${tinta}`}} />
        <div style={{fontFamily: 'Titulo', fontSize: 170, textAlign: 'center', color: tinta, lineHeight: 1.05}}>{n}</div>
        <div style={{fontFamily: 'Corpo', fontSize: 40, textAlign: 'center', color: tinta, paddingBottom: 18}}>{o.rotulo || 'dias'}</div>
      </div>
    );
  }
  if (o.tipo === 'carimbo' || o.tipo === 'certo' || o.tipo === 'errado') {
    const cor = o.cor || (o.tipo === 'errado' ? '#D63B3B' : '#1E9E5A');
    const txt = o.texto || (o.tipo === 'errado' ? 'ERRADO' : 'CERTO');
    const pancada = interpolate(f - o.inicio, [0, 6], [2.2, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)});
    return (
      <div style={{...base, transform: `translate(-50%,-50%) scale(${pancada * esc * saida}) rotate(-10deg)`, border: `12px solid ${cor}`, borderRadius: 26,
        padding: '10px 40px', fontFamily: 'Titulo', fontSize: 130, color: cor, letterSpacing: '0.04em', background: 'rgba(255,255,255,.85)'}}>{txt}</div>
    );
  }
  if (o.tipo === 'documento') {
    return (
      <div style={{...base, width: 420, background: '#FBFAF4', border: `7px solid ${tinta}`, borderRadius: 18, padding: 30, boxShadow: '0 18px 0 rgba(0,0,0,.15)'}}>
        <div style={{fontFamily: 'Titulo', fontSize: 58, color: tinta, lineHeight: 1}}>{o.texto || 'PETIÇÃO'}</div>
        {[0.9, 0.75, 0.95, 0.6, 0.85].map((w, i) => (
          <div key={i} style={{height: 16, width: `${w * 100}%`, background: '#D9D5C7', borderRadius: 8, marginTop: 18,
            transform: `scaleX(${interpolate(f - o.inicio, [6 + i * 3, 14 + i * 3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})})`, transformOrigin: '0 50%'}} />
        ))}
        {o.rotulo ? <div style={{fontFamily: 'Corpo', fontSize: 30, color: p.fundo, background: p.acento, display: 'inline-block', padding: '6px 16px', borderRadius: 10, marginTop: 22}}>{o.rotulo}</div> : null}
      </div>
    );
  }
  if (o.tipo === 'balanca') {
    const inc = Math.sin((f - o.inicio) / 12) * 8 * Math.exp(-(f - o.inicio) / 60);
    return (
      <svg style={{...base, overflow: 'visible'}} width={360} height={340} viewBox="-180 -40 360 340">
        <rect x={-10} y={0} width={20} height={250} fill={p.acento} stroke={tinta} strokeWidth={6} />
        <rect x={-90} y={240} width={180} height={34} rx={10} fill={p.acento} stroke={tinta} strokeWidth={6} />
        <g transform={`rotate(${inc})`}>
          <rect x={-160} y={-8} width={320} height={16} rx={8} fill={p.acento} stroke={tinta} strokeWidth={6} />
          {[-1, 1].map((l) => (
            <g key={l} transform={`translate(${l * 140} 0) rotate(${-inc})`}>
              <line x1={0} y1={0} x2={-40} y2={110} stroke={tinta} strokeWidth={4} /><line x1={0} y1={0} x2={40} y2={110} stroke={tinta} strokeWidth={4} />
              <path d="M -60 110 Q 0 160 60 110 Z" fill={p.acento} stroke={tinta} strokeWidth={6} />
            </g>
          ))}
        </g>
        <circle cx={0} cy={0} r={18} fill={p.acento} stroke={tinta} strokeWidth={6} />
      </svg>
    );
  }
  if (o.tipo === 'relogio') {
    const a = (f - o.inicio) * 14;
    return (
      <svg style={base} width={260} height={260} viewBox="-130 -130 260 260">
        <circle r={118} fill="#fff" stroke={tinta} strokeWidth={10} />
        {Array.from({length: 12}).map((_, i) => <line key={i} x1={0} y1={-96} x2={0} y2={-82} stroke={tinta} strokeWidth={6} transform={`rotate(${i * 30})`} />)}
        <line x1={0} y1={0} x2={0} y2={-58} stroke={tinta} strokeWidth={10} strokeLinecap="round" transform={`rotate(${a / 12})`} />
        <line x1={0} y1={0} x2={0} y2={-88} stroke={o.cor || '#C0392B'} strokeWidth={6} strokeLinecap="round" transform={`rotate(${a})`} />
        <circle r={10} fill={tinta} />
      </svg>
    );
  }
  if (o.tipo === 'imagem' && o.arquivo) {
    return (
      <div style={{...base, width: 640, border: `10px solid #fff`, borderRadius: 26, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,.35)'}}>
        <Img src={staticFile(o.arquivo)} style={{width: '100%', display: 'block', transform: `scale(${1 + (f - o.inicio) / 900})`}} />
        {o.rotulo ? <div style={{fontFamily: 'Corpo', fontSize: 34, background: '#fff', padding: '10px 16px', color: tinta}}>{o.rotulo}</div> : null}
      </div>
    );
  }
  // placa
  return (
    <div style={{...base, background: p.acento, color: p.fundo, fontFamily: 'Titulo', fontSize: 92, padding: '14px 44px', borderRadius: 24,
      border: `8px solid ${tinta}`, boxShadow: '0 14px 0 rgba(0,0,0,.2)', whiteSpace: 'nowrap'}}>{o.texto}</div>
  );
};

// ---------------- balão de fala ----------------
export const Balao: React.FC<{texto: string; f: number; ini: number; fim: number; ax: number; ay: number; W: number; fps: number; p: Paleta}> =
  ({texto, f, ini, fim, ax, ay, W, fps}) => {
    if (f < ini || f > fim + 6) return null;
    const s = spring({frame: f - ini, fps, config: {damping: 12, stiffness: 220, mass: 0.6}});
    const sai = interpolate(f, [fim, fim + 6], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    const larg = Math.min(W * 0.8, 620);
    const x = Math.min(Math.max(ax, larg / 2 + 30), W - larg / 2 - 30);
    return (
      <div style={{position: 'absolute', left: x, top: ay, transform: `translate(-50%,-100%) scale(${s * sai})`, transformOrigin: `${50 + ((ax - x) / larg) * 100}% 100%`, width: larg}}>
        <div style={{background: '#fff', border: '7px solid #20201E', borderRadius: 44, padding: '26px 34px', fontFamily: 'Corpo', fontSize: 46,
          lineHeight: 1.15, color: '#20201E', textAlign: 'center'}}>{texto}</div>
        <svg width={60} height={50} style={{position: 'absolute', left: `calc(${50 + ((ax - x) / larg) * 100}% - 30px)`, bottom: -42}}>
          <path d="M 8 0 L 30 46 L 50 0" fill="#fff" stroke="#20201E" strokeWidth={7} strokeLinejoin="round" />
          <rect x={6} y={-8} width={48} height={12} fill="#fff" />
        </svg>
      </div>
    );
  };

// ---------------- cena ----------------
const Cena: React.FC<{c: CenaCartoon; p: CartoonProps}> = ({c, p}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const W = p.largura, H = p.altura;
  const prog = interpolate(f, [0, c.duracao], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const zoom = c.camera === 'zoom-in' ? 1 + 0.1 * prog : c.camera === 'zoom-out' ? 1.1 - 0.1 * prog : 1.02;
  const pan = c.camera === 'pan' ? (prog - 0.5) * -W * 0.06 : 0;
  const entra = interpolate(f, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const vertical = H > W;
  const escPers = Math.min(W, H * 0.62) / 1080 * (vertical ? 1.45 : 1.05);
  const chao = H * (vertical ? 0.84 : 0.86);
  const falaAgora = c.falas.find((fl) => f >= fl.inicio && f < fl.fim);
  return (
    <AbsoluteFill style={{opacity: entra}}>
      <AbsoluteFill style={{transform: `scale(${zoom}) translateX(${pan}px)`, transformOrigin: '50% 70%'}}>
        <Cenario c={c} W={W} H={H} p={p.paleta} f={f} />
        <svg width={W} height={H} style={{position: 'absolute'}}>
          {c.personagens.map((pe) => {
            const fala = c.falas.filter((fl) => fl.quem === pe.id && f >= fl.inicio - 4 && f < fl.fim + 6).slice(-1)[0];
            const ultima = c.falas.filter((fl) => fl.quem === pe.id && f >= fl.inicio).slice(-1)[0];
            const env = fala ? fala.envelope[Math.max(0, Math.min(fala.envelope.length - 1, f - fala.inicio))] || 0 : 0;
            const pose = (fala || ultima)?.pose || pe.pose || 'parado';
            const expr = (fala || ultima)?.expressao || pe.expressao || 'feliz';
            // quem escuta olha para quem fala
            const quemFala = falaAgora ? c.personagens.find((o) => o.id === falaAgora.quem) : undefined;
            const olhar = quemFala && quemFala.id !== pe.id ? Math.sign(quemFala.x - pe.x) * 0.8 : 0.1;
            const e = pe.entra ?? 0;
            if (f < e) return null;
            const t = f - e;
            const yIn = interpolate(t, [0, 5, 13, 19], [H * 0.25, H * 0.27, -H * 0.02, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
            const sy = interpolate(t, [0, 5, 13, 19, 25], [1, 0.84, 1.1, 0.95, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
            const sc = escPers * (pe.escala || 1);
            const x = pe.x * W;
            return (
              <g key={pe.id} transform={`translate(${x} ${chao + yIn}) scale(${(pe.virado ? -1 : 1) * sc} ${sc * sy}) translate(-200 -600)`}>
                <Personagem tipo={pe.tipo} frame={f + (pe.id.length * 17)} boca={env} pose={pose} expressao={expr} olhar={pe.virado ? -olhar : olhar} semente={pe.id} espelhado={pe.virado} />
              </g>
            );
          })}
        </svg>
        {c.objetos.map((o, i) => <ObjetoCena key={i} o={o} f={f} W={W} H={H} p={p.paleta} fps={fps} />)}
      </AbsoluteFill>
      {c.falas.filter((fl) => fl.balao).map((fl, i) => {
        const pe = c.personagens.find((o) => o.id === fl.quem)!;
        const sc = escPers * (pe.escala || 1);
        return <Balao key={i} texto={fl.balao!} f={f} ini={fl.inicio} fim={fl.fim} ax={pe.x * W} ay={chao - 600 * sc - 30} W={W} fps={fps} p={p.paleta} />;
      })}
      {c.titulo && f >= c.titulo.inicio && f <= c.titulo.fim + 8 ? (
        <div style={{position: 'absolute', top: H * 0.06, left: 0, right: 0, textAlign: 'center',
          transform: `translateY(${interpolate(f - c.titulo.inicio, [0, 10], [-80, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2))})}px)`,
          opacity: interpolate(f, [c.titulo.fim, c.titulo.fim + 8], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
          <span style={{fontFamily: 'Titulo', fontSize: 104 * (W / 1080), color: '#fff', background: p.paleta.fundo, padding: '8px 36px', borderRadius: 22,
            border: '7px solid #20201E', display: 'inline-block', maxWidth: '88%'}}>{c.titulo.texto}</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const Cartoon: React.FC<CartoonProps> = (p) => {
  const [h] = useState(() => delayRender('fontes'));
  useEffect(() => {
    const fs = [new FontFace('Titulo', `url(${staticFile(p.fontes.titulo)})`), new FontFace('Corpo', `url(${staticFile(p.fontes.corpo)})`)];
    Promise.all(fs.map((x) => x.load())).then((ok) => { ok.forEach((x) => document.fonts.add(x)); continueRender(h); });
  }, [h, p.fontes.titulo, p.fontes.corpo]);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {p.cenas.map((c, i) => (
        <Sequence key={i} from={c.inicio} durationInFrames={c.duracao}>
          <Cena c={c} p={p} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

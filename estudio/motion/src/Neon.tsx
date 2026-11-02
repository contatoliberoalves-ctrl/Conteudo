// "Neon e vidro": promo escura no estilo anúncio Apple + synthwave. Grade em perspectiva que
// corre, sol em degradê, cartões de vidro fosco com borda de luz, texto com brilho que varre.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Easing, continueRender, delayRender, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

export type CenaNeon = {inicio: number; duracao: number; tipo: 'titulo' | 'cartao' | 'numero' | 'pilulas' | 'cta';
  titulo?: string; sub?: string; icone?: string; numero?: number; sufixo?: string; itens?: {texto: string; t: number}[]; botao?: string; t?: number};
export type NeonProps = {largura: number; altura: number; fps: number; total: number; cenas: CenaNeon[];
  cores: {a: string; b: string; c: string}; fontes: {titulo: string; corpo: string}};

const ok = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const Fundo: React.FC<{p: NeonProps; f: number}> = ({p, f}) => {
  const W = p.largura, H = p.altura, u = Math.min(W, H) / 1080;
  const hz = H * 0.62;
  const linhas = [];
  const corre = (f % 30) / 30;
  for (let k = 0; k < 16; k++) {
    const z = (k + corre) / 16;
    const y = hz + (H - hz) * z * z;
    linhas.push(<line key={`h${k}`} x1={0} x2={W} y1={y} y2={y} stroke={p.cores.a} strokeOpacity={0.15 + z * 0.5} strokeWidth={1 + z * 3 * u} />);
  }
  for (let k = -12; k <= 12; k++) {
    linhas.push(<line key={`v${k}`} x1={W / 2 + k * W * 0.02} y1={hz} x2={W / 2 + k * W * 0.22} y2={H} stroke={p.cores.a} strokeOpacity={0.35} strokeWidth={2 * u} />);
  }
  return (
    <svg width={W} height={H} style={{position: 'absolute'}}>
      <defs>
        <linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#05030D" /><stop offset="0.6" stopColor="#1A0B33" /><stop offset="1" stopColor="#05030D" /></linearGradient>
        <linearGradient id="sol" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={p.cores.c} /><stop offset="1" stopColor={p.cores.b} /></linearGradient>
        <filter id="b"><feGaussianBlur stdDeviation={40 * u} /></filter>
      </defs>
      <rect width={W} height={H} fill="url(#ceu)" />
      <circle cx={W / 2} cy={hz - W * 0.05} r={W * 0.28} fill="url(#sol)" opacity={0.35} filter="url(#b)" />
      <circle cx={W / 2} cy={hz - W * 0.05} r={W * 0.2} fill="url(#sol)" opacity={0.9} />
      {Array.from({length: 7}).map((_, k) => <rect key={k} x={0} y={hz - W * 0.05 + k * W * 0.028} width={W} height={W * (0.004 + k * 0.002)} fill="#1A0B33" />)}
      <rect y={hz} width={W} height={H - hz} fill="#07040F" />
      {linhas}
      {Array.from({length: 50}).map((_, k) => (
        <circle key={k} cx={random(`x${k}`) * W} cy={random(`y${k}`) * hz * 0.9} r={(0.8 + random(`r${k}`) * 1.8) * u} fill="#fff"
          opacity={0.3 + 0.5 * Math.abs(Math.sin(f / 25 + k))} />
      ))}
    </svg>
  );
};

const Vidro: React.FC<{children: React.ReactNode; u: number; p: NeonProps; style?: React.CSSProperties}> = ({children, u, p, style}) => (
  <div style={{background: 'linear-gradient(135deg, rgba(255,255,255,.14), rgba(255,255,255,.04))', backdropFilter: `blur(${18 * u}px)`,
    border: `${2 * u}px solid rgba(255,255,255,.22)`, borderRadius: 40 * u, boxShadow: `0 0 ${40 * u}px ${p.cores.b}55, inset 0 ${2 * u}px 0 rgba(255,255,255,.25)`, ...style}}>
    {children}
  </div>
);

const Cena: React.FC<{c: CenaNeon; p: NeonProps; f: number}> = ({c, p, f}) => {
  const {fps} = useVideoConfig();
  const W = p.largura, H = p.altura, u = Math.min(W, H) / 1080;
  const t = f - c.inicio;
  const ent = spring({frame: t, fps, config: {damping: 16, stiffness: 120}});
  const sai = interpolate(t, [c.duracao - 8, c.duracao], [0, 1], ok);
  const brilho = interpolate(t, [6, 30], [-30, 130], ok);   // luz que varre o texto
  const txt = (s: string, tam: number) => {
    const t2 = Math.min(tam * u, (W * 0.86) / (Math.max(s.length, 1) * 0.78));   // cabe na largura
    return (
      <span style={{display: 'inline-block', filter: `drop-shadow(0 0 ${18 * u}px ${p.cores.b})`}}>
        <span style={{fontFamily: 'Titulo', fontSize: t2, lineHeight: 1, letterSpacing: '-0.01em', display: 'inline-block',
          backgroundImage: `linear-gradient(100deg, #fff 0%, #fff ${brilho - 15}%, ${p.cores.c} ${brilho}%, #fff ${brilho + 15}%, #fff 100%)`,
          WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent'}}>{s}</span>
      </span>
    );
  };
  const box: React.CSSProperties = {position: 'absolute', left: 70 * u, right: 70 * u, top: H * 0.16, opacity: ent * (1 - sai),
    transform: `translateY(${(1 - ent) * 60 * u - sai * 40 * u}px) scale(${0.94 + 0.06 * ent})`, filter: `blur(${(1 - ent) * 12 + sai * 10}px)`,
    display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 26 * u};
  if (c.tipo === 'titulo') {
    return <div style={box}>{(c.titulo || '').split('|').map((l, k) => <div key={k}>{txt(l, 150)}</div>)}
      {c.sub ? <div style={{fontFamily: 'Corpo', fontSize: 44 * u, color: '#D9D2F2'}}>{c.sub}</div> : null}</div>;
  }
  if (c.tipo === 'cartao') {
    return (
      <div style={box}>
        <Vidro u={u} p={p} style={{padding: `${44 * u}px ${48 * u}px`, width: '100%'}}>
          {c.icone ? <div style={{fontSize: 110 * u, lineHeight: 1, marginBottom: 14 * u}}>{c.icone}</div> : null}
          <div>{txt(c.titulo || '', 104)}</div>
          {c.sub ? <div style={{fontFamily: 'Corpo', fontSize: 44 * u, color: '#E6E0FA', marginTop: 16 * u}}>{c.sub}</div> : null}
        </Vidro>
      </div>
    );
  }
  if (c.tipo === 'numero') {
    const n = Math.round(interpolate(t, [c.t || 6, (c.t || 6) + 30], [0, c.numero || 0], {...ok, easing: Easing.out(Easing.cubic)}));
    return <div style={box}><div>{txt(`${n}${c.sufixo || ''}`, 330)}</div><div style={{fontFamily: 'Corpo', fontSize: 50 * u, color: '#E6E0FA'}}>{c.titulo}</div></div>;
  }
  if (c.tipo === 'pilulas') {
    return (
      <div style={box}>
        <div>{txt(c.titulo || '', 96)}</div>
        {(c.itens || []).map((it, k) => {
          const a = spring({frame: t - it.t, fps, config: {damping: 14, stiffness: 170}});
          return <Vidro key={k} u={u} p={p} style={{padding: `${22 * u}px ${34 * u}px`, width: '100%', opacity: a, transform: `translateX(${(1 - a) * (k % 2 ? 1 : -1) * 200 * u}px)`,
            fontFamily: 'Corpo', fontSize: 50 * u, color: '#fff', textAlign: 'left'}}>✦ {it.texto}</Vidro>;
        })}
      </div>
    );
  }
  // cta
  const pulsa = 1 + Math.sin(t / 6) * 0.03;
  return (
    <div style={box}>
      {(c.titulo || '').split('|').map((l, k) => <div key={k}>{txt(l, 130)}</div>)}
      <div style={{marginTop: 30 * u, padding: `${28 * u}px ${70 * u}px`, borderRadius: 999, fontFamily: 'Titulo', fontSize: 72 * u, color: '#fff',
        background: `linear-gradient(90deg, ${p.cores.b}, ${p.cores.a})`, boxShadow: `0 0 ${50 * u}px ${p.cores.b}`, transform: `scale(${pulsa})`}}>{c.botao}</div>
      {c.sub ? <div style={{fontFamily: 'Corpo', fontSize: 42 * u, color: '#D9D2F2'}}>{c.sub}</div> : null}
    </div>
  );
};

export const Neon: React.FC<NeonProps> = (p) => {
  const f = useCurrentFrame();
  const [h] = useState(() => delayRender('fontes'));
  useEffect(() => {
    const fs = [new FontFace('Titulo', `url(${staticFile(p.fontes.titulo)})`), new FontFace('Corpo', `url(${staticFile(p.fontes.corpo)})`)];
    Promise.all(fs.map((x) => x.load())).then((r) => { r.forEach((x) => document.fonts.add(x)); continueRender(h); });
  }, [h, p.fontes.titulo, p.fontes.corpo]);
  const c = p.cenas.find((x) => f >= x.inicio && f < x.inicio + x.duracao) || p.cenas[p.cenas.length - 1];
  const zoom = 1 + (f / p.total) * 0.06;
  return (
    <AbsoluteFill style={{background: '#05030D', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`}}><Fundo p={p} f={f} /></AbsoluteFill>
      <Cena c={c} p={p} f={f} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,.6))'}} />
    </AbsoluteFill>
  );
};

// "Aura": edit cinematográfico curto no ritmo da batida. Personagem com luz de recorte e aura,
// raios de luz, fumaça, faíscas, tarja de cinema, flashes e letreiros que batem na tela.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Easing, continueRender, delayRender, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {Expressao, Personagem, Pose, TipoPersonagem} from './personagens';

export type Tomada = {inicio: number; duracao: number; personagem: TipoPersonagem; pose: Pose; expressao: Expressao;
  angulo: 'frente' | 'baixo' | 'close' | 'lado'; cor?: string};
export type Letreiro = {inicio: number; duracao: number; texto: string; tamanho?: number; cor?: string};
export type AuraProps = {largura: number; altura: number; fps: number; total: number; batida: number;
  tomadas: Tomada[]; letreiros: Letreiro[]; cores: {aura: string; fundo: string; luz: string}; fontes: {titulo: string; corpo: string}};

const ok = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const Aura: React.FC<AuraProps> = (p) => {
  const f = useCurrentFrame();
  const [h] = useState(() => delayRender('fontes'));
  useEffect(() => {
    const fs = [new FontFace('Titulo', `url(${staticFile(p.fontes.titulo)})`)];
    Promise.all(fs.map((x) => x.load())).then((r) => { r.forEach((x) => document.fonts.add(x)); continueRender(h); });
  }, [h, p.fontes.titulo]);
  const W = p.largura, H = p.altura, u = Math.min(W, H) / 1080;
  const tom = p.tomadas.find((t) => f >= t.inicio && f < t.inicio + t.duracao) || p.tomadas[p.tomadas.length - 1];
  const tT = f - tom.inicio;
  const fase = (f % p.batida) / p.batida;               // 0 no golpe
  const golpe = Math.exp(-fase * 6);                     // pulso que decai a cada batida
  const corte = tT < 2;                                  // flash no corte
  const push = 1 + (tT / Math.max(tom.duracao, 1)) * 0.12;
  const cfg = {frente: {s: 1.5, y: 0.88, r: 0}, baixo: {s: 2.0, y: 1.02, r: -3}, close: {s: 3.4, y: 1.55, r: 0}, lado: {s: 1.7, y: 0.95, r: 4}}[tom.angulo];
  const shake = golpe * 10 * u;
  const sx = (random(`a${f}`) - 0.5) * shake, sy = (random(`b${f}`) - 0.5) * shake;
  const aura = tom.cor || p.cores.aura;
  const let_ = p.letreiros.find((l) => f >= l.inicio && f < l.inicio + l.duracao);
  return (
    <AbsoluteFill style={{background: p.cores.fundo, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${sx}px,${sy}px) scale(${push}) rotate(${cfg.r}deg)`, filter: `contrast(1.25) saturate(1.1) brightness(${1 + golpe * 0.25})`}}>
        {/* raios de luz */}
        <svg width={W} height={H} style={{position: 'absolute'}}>
          <defs><filter id="bl"><feGaussianBlur stdDeviation={30 * u} /></filter>
            <radialGradient id="au"><stop offset="0" stopColor={aura} stopOpacity="0.95" /><stop offset="1" stopColor={aura} stopOpacity="0" /></radialGradient></defs>
          {Array.from({length: 7}).map((_, k) => {
            const x = W * (0.15 + k * 0.12) + Math.sin(f / 40 + k) * 30 * u;
            return <polygon key={k} points={`${x},0 ${x + 40 * u},0 ${x + 220 * u},${H} ${x - 140 * u},${H}`} fill={p.cores.luz} opacity={0.05 + 0.04 * Math.sin(f / 15 + k)} filter="url(#bl)" />;
          })}
          <ellipse cx={W / 2} cy={H * cfg.y - 330 * u * cfg.s} rx={W * 0.45 * (0.9 + golpe * 0.2)} ry={H * 0.3 * (0.9 + golpe * 0.2)} fill="url(#au)" opacity={0.75} />
          {/* fumaça */}
          {Array.from({length: 10}).map((_, k) => (
            <ellipse key={k} cx={((random(`fx${k}`) * W * 1.4 + f * (1 + k % 3) * u) % (W * 1.4)) - W * 0.2} cy={H * (0.62 + random(`fy${k}`) * 0.35)}
              rx={W * 0.35} ry={H * 0.06} fill="#9AA4C0" opacity={0.07} filter="url(#bl)" />
          ))}
        </svg>
        {/* personagem com luz de recorte */}
        <svg width={W} height={H} style={{position: 'absolute', filter: `drop-shadow(0 0 ${14 * u}px ${aura}) drop-shadow(${-6 * u}px 0 0 ${p.cores.luz})`}}>
          <g transform={`translate(${W / 2} ${H * cfg.y}) scale(${cfg.s * u}) translate(-200 -600)`}>
            <Personagem tipo={tom.personagem} frame={f} boca={0} pose={tom.pose} expressao={tom.expressao} olhar={0} semente="aura" />
          </g>
        </svg>
        {/* faíscas subindo */}
        <svg width={W} height={H} style={{position: 'absolute'}}>
          {Array.from({length: 46}).map((_, k) => {
            const vida = ((f * (0.6 + random(`v${k}`)) + random(`o${k}`) * 300) % 300) / 300;
            const x = random(`ex${k}`) * W + Math.sin(f / 20 + k) * 40 * u + vida * 160 * u;
            return <rect key={k} x={x} y={H * (1 - vida * 1.1)} width={(3 + random(`es${k}`) * 4) * u} height={(3 + random(`es${k}`) * 4) * u}
              fill={k % 3 ? aura : '#FFD27A'} opacity={(1 - vida) * 0.9} />;
          })}
        </svg>
      </AbsoluteFill>
      {/* linhas de velocidade no golpe */}
      {golpe > 0.4 ? (
        <svg width={W} height={H} style={{position: 'absolute', opacity: golpe * 0.5}}>
          {Array.from({length: 28}).map((_, k) => {
            const a = random(`l${k}`) * Math.PI * 2, r0 = Math.min(W, H) * 0.35;
            return <line key={k} x1={W / 2 + Math.cos(a) * r0} y1={H / 2 + Math.sin(a) * r0} x2={W / 2 + Math.cos(a) * W} y2={H / 2 + Math.sin(a) * W} stroke="#fff" strokeWidth={3 * u} />;
          })}
        </svg>
      ) : null}
      {/* letreiro com aberração cromática */}
      {let_ ? (() => {
        const tl = f - let_.inicio;
        const s = interpolate(tl, [0, 4, 8], [1.8, 0.94, 1], {...ok, easing: Easing.out(Easing.cubic)});
        const desl = interpolate(tl, [0, 6], [14, 2], ok) * u;
        const maior = Math.max(...let_.texto.split('\n').map((l) => l.length), 1);
        const tam = Math.min((let_.tamanho || 220) * u, (W * 0.88) / (maior * 0.98));
        const estilo: React.CSSProperties = {position: 'absolute', left: 0, right: 0, top: H * 0.16, textAlign: 'center', fontFamily: 'Titulo', fontSize: tam,
          lineHeight: 0.92, letterSpacing: '-0.01em', transform: `scale(${s})`, whiteSpace: 'pre-line'};
        return (
          <>
            <div style={{...estilo, color: '#FF2A4F', transform: `translate(${desl}px,0) scale(${s})`, opacity: 0.8, mixBlendMode: 'screen'}}>{let_.texto}</div>
            <div style={{...estilo, color: '#2AE4FF', transform: `translate(${-desl}px,0) scale(${s})`, opacity: 0.8, mixBlendMode: 'screen'}}>{let_.texto}</div>
            <div style={{...estilo, color: let_.cor || '#fff', textShadow: `0 0 ${30 * u}px ${aura}`}}>{let_.texto}</div>
          </>
        );
      })() : null}
      {/* flash do corte, grão, tarja e vinheta */}
      <AbsoluteFill style={{background: '#fff', opacity: corte ? 0.7 : golpe > 0.9 ? 0.15 : 0}} />
      <AbsoluteFill style={{opacity: 0.12, backgroundImage: 'radial-gradient(#fff 1px, transparent 1.3px)', backgroundSize: `${4 * u}px ${4 * u}px`,
        transform: `translate(${random(`g${f}`) * 4}px, ${random(`h${f}`) * 4}px)`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,.85))'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: H * 0.085, background: '#000'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: H * 0.085, background: '#000'}} />
      <AbsoluteFill style={{background: '#000', opacity: interpolate(f, [p.total - 14, p.total], [0, 1], ok)}} />
    </AbsoluteFill>
  );
};

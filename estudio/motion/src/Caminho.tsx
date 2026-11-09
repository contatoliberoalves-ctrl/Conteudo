// "Caminho de luz": um fio de luz contínuo liga as estações de um processo (ex.: a PEC),
// a câmera voa de uma estação à outra sem cortes, cada estação é um botão "gordinho" com
// borda escura embaixo, e o conteúdo entra no tempo da fala. Abre com o Lex batendo na tela.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Easing, continueRender, delayRender, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Personagem} from './personagens';

export type Estacao = {
  inicio: number; duracao: number; tipo: 'abertura' | 'chips' | 'contador' | 'check' | 'carimbo' | 'final';
  titulo: string; rotulo?: string; chips?: {texto: string; t: number}[]; numero?: number; de?: number; t?: number;
  carimbo?: string; riscado?: string; frase?: string[]; arroba?: string;
};
export type CaminhoProps = {
  largura: number; altura: number; fps: number; total: number; estacoes: Estacao[];
  cores: {fundo: string; fio: string; fio2: string; borda: string; card: string; texto: string; apagado: string};
  fontes: {titulo: string; corpo: string};
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function geometria(p: CaminhoProps) {
  const W = p.largura, H = p.altura, vertical = H > W;
  const pts = p.estacoes.map((_, i) => (vertical
    ? [W * (i % 2 ? 0.7 : 0.3), H * 0.5 + i * H * 0.62]
    : [W * 0.5 + i * W * 0.55, H * (i % 2 ? 0.62 : 0.4)]) as [number, number]);
  // curva S entre estações, amostrada
  const amostras: [number, number][] = [];
  const marcos: number[] = [0];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    const c1 = vertical ? [x0, lerp(y0, y1, 0.55)] : [lerp(x0, x1, 0.55), y0];
    const c2 = vertical ? [x1, lerp(y0, y1, 0.45)] : [lerp(x0, x1, 0.45), y1];
    for (let k = 0; k <= 40; k++) {
      const t = k / 40, m = 1 - t;
      amostras.push([m * m * m * x0 + 3 * m * m * t * c1[0] + 3 * m * t * t * c2[0] + t * t * t * x1,
        m * m * m * y0 + 3 * m * m * t * c1[1] + 3 * m * t * t * c2[1] + t * t * t * y1]);
    }
    marcos.push(amostras.length - 1);
  }
  if (!amostras.length) amostras.push(pts[0]);
  const acum = [0];
  for (let k = 1; k < amostras.length; k++) acum.push(acum[k - 1] + Math.hypot(amostras[k][0] - amostras[k - 1][0], amostras[k][1] - amostras[k - 1][1]));
  return {pts, amostras, marcos, acum, vertical};
}

const Botao: React.FC<{x: number; y: number; r: number; aceso: number; rotulo: string; c: CaminhoProps['cores']}> = ({x, y, r, aceso, rotulo, c}) => {
  const pulo = 1 + Math.sin(Math.min(aceso, 1) * Math.PI) * 0.25;
  const cor = aceso > 0 ? c.fio : '#3A4448', lip = aceso > 0 ? c.borda : '#252D30';
  return (
    <g transform={`translate(${x} ${y}) scale(${pulo})`}>
      <ellipse cx={0} cy={r * 0.22} rx={r} ry={r * 0.92} fill={lip} />
      <ellipse cx={0} cy={0} rx={r} ry={r * 0.92} fill={cor} />
      <ellipse cx={-r * 0.3} cy={-r * 0.35} rx={r * 0.32} ry={r * 0.18} fill="#fff" opacity={aceso > 0 ? 0.35 : 0.08} />
      <text x={0} y={r * 0.2} textAnchor="middle" fontFamily="Titulo" fontSize={r * 0.95} fill={aceso > 0 ? '#0B2410' : '#6E7B80'}>{rotulo}</text>
    </g>
  );
};

const Card: React.FC<{e: Estacao; f: number; c: CaminhoProps['cores']; u: number; fps: number}> = ({e, f, c, u, fps}) => {
  const t = f - e.inicio;
  const s = spring({frame: t - 6, fps, config: {damping: 13, stiffness: 180, mass: 0.8}});
  const caixa = {background: c.card, borderRadius: 34 * u, boxShadow: `0 ${12 * u}px 0 ${c.borda}`, padding: `${30 * u}px ${36 * u}px`, color: c.texto};
  const titulo = <div style={{fontFamily: 'Titulo', fontSize: 74 * u, lineHeight: 1, color: c.fio2, marginBottom: 16 * u}}>{e.titulo}</div>;
  let corpo: React.ReactNode = null;
  if (e.tipo === 'chips') {
    corpo = (
      <div style={{display: 'flex', flexDirection: 'column', gap: 14 * u}}>
        {(e.chips || []).map((ch, i) => {
          const a = spring({frame: t - ch.t, fps, config: {damping: 12, stiffness: 220}});
          return <div key={i} style={{transform: `scale(${a}) rotate(${(1 - a) * -6}deg)`, transformOrigin: '0 50%', opacity: a, background: '#24302F',
            boxShadow: `0 ${7 * u}px 0 #121A19`, borderRadius: 22 * u, padding: `${16 * u}px ${24 * u}px`, fontFamily: 'Corpo', fontSize: 48 * u}}>{ch.texto}</div>;
        })}
      </div>
    );
  } else if (e.tipo === 'contador') {
    const n = Math.round(interpolate(t, [e.t || 10, (e.t || 10) + 34], [0, e.numero || 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}));
    const fr = (n / (e.de || 1));
    corpo = (
      <div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 14 * u, fontFamily: 'Titulo'}}>
          {String(n).padStart(String(e.numero).length, '0').split('').map((d, i) => (
            <span key={i} style={{display: 'inline-block', width: 96 * u, textAlign: 'center', fontSize: 160 * u, lineHeight: 1, background: '#24302F', borderRadius: 18 * u,
              boxShadow: `0 ${8 * u}px 0 #121A19`}}>{d}</span>
          ))}
          <span style={{fontSize: 56 * u, color: c.apagado}}>de {e.de}</span>
        </div>
        <div style={{marginTop: 24 * u, height: 34 * u, borderRadius: 99, background: '#24302F', overflow: 'hidden', position: 'relative'}}>
          <div style={{position: 'absolute', inset: 0, width: `${fr * 100}%`, background: c.fio, boxShadow: `0 0 ${20 * u}px ${c.fio}`}} />
          <div style={{position: 'absolute', left: '60%', top: -6 * u, bottom: -6 * u, width: 6 * u, background: '#fff'}} />
        </div>
        <div style={{fontFamily: 'Corpo', fontSize: 38 * u, marginTop: 12 * u, color: c.apagado}}>{e.rotulo}</div>
      </div>
    );
  } else if (e.tipo === 'check') {
    const a = spring({frame: t - (e.t || 12), fps, config: {damping: 9, stiffness: 240}});
    corpo = (
      <div style={{display: 'flex', alignItems: 'center', gap: 24 * u}}>
        <div style={{width: 130 * u, height: 130 * u, borderRadius: '50%', background: c.fio, boxShadow: `0 ${10 * u}px 0 ${c.borda}`, display: 'grid', placeItems: 'center',
          fontFamily: 'Titulo', fontSize: 100 * u, color: '#0B2410', transform: `scale(${a}) rotate(${(1 - a) * -90}deg)`}}>✓</div>
        <div style={{fontFamily: 'Corpo', fontSize: 44 * u, lineHeight: 1.15}}>{e.rotulo}</div>
      </div>
    );
  } else if (e.tipo === 'carimbo') {
    const bate = interpolate(t, [(e.t || 14), (e.t || 14) + 6], [2.4, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)});
    const vis = t >= (e.t || 14) ? 1 : 0;
    corpo = (
      <div style={{position: 'relative', height: 200 * u, display: 'grid', placeItems: 'center'}}>
        {e.riscado ? <div style={{fontFamily: 'Titulo', fontSize: 120 * u, color: c.apagado, position: 'relative'}}>{e.riscado}
          <div style={{position: 'absolute', left: -10 * u, right: -10 * u, top: '48%', height: 14 * u, background: '#E5484D', borderRadius: 99,
            transform: `scaleX(${interpolate(t, [(e.t || 14) - 8, (e.t || 14)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})})`, transformOrigin: '0 50%'}} /></div> : null}
        {e.carimbo ? <div style={{position: 'absolute', opacity: vis, transform: `scale(${bate}) rotate(-9deg)`, border: `${10 * u}px solid ${c.fio}`, color: c.fio, borderRadius: 22 * u,
          padding: `${6 * u}px ${28 * u}px`, fontFamily: 'Titulo', fontSize: 92 * u, background: 'rgba(11,20,16,.75)'}}>{e.carimbo}</div> : null}
      </div>
    );
  }
  return <div style={{...caixa, transform: `translateY(${(1 - s) * 80 * u}px) scale(${0.9 + 0.1 * s})`, opacity: s, width: '100%'}}>{titulo}{corpo}</div>;
};

export const Caminho: React.FC<CaminhoProps> = (p) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const [h] = useState(() => delayRender('fontes'));
  useEffect(() => {
    const fs = [new FontFace('Titulo', `url(${staticFile(p.fontes.titulo)})`), new FontFace('Corpo', `url(${staticFile(p.fontes.corpo)})`)];
    Promise.all(fs.map((x) => x.load())).then((ok) => { ok.forEach((x) => document.fonts.add(x)); continueRender(h); });
  }, [h, p.fontes.titulo, p.fontes.corpo]);
  const W = p.largura, H = p.altura, u = Math.min(W, H) / 1080;
  const g = geometria(p);
  const c = p.cores;
  const E = p.estacoes;
  let i = E.findIndex((e) => f >= e.inicio && f < e.inicio + e.duracao);
  if (i < 0) i = E.length - 1;
  const e = E[i];
  const tE = f - e.inicio;
  // o fio avança da estação anterior até esta nos primeiros 18 quadros
  const voo = interpolate(tE, [0, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const kA = g.marcos[Math.max(0, i - 1)], kB = g.marcos[i];
  const kPonta = i === 0 ? 0 : lerp(kA, kB, voo);
  const ki = Math.min(g.amostras.length - 1, Math.floor(kPonta)), kf = kPonta - ki;
  const a0 = g.amostras[ki], a1 = g.amostras[Math.min(g.amostras.length - 1, ki + 1)];
  const ponta = [lerp(a0[0], a1[0], kf), lerp(a0[1], a1[1], kf)];
  const comp = lerp(g.acum[ki], g.acum[Math.min(g.acum.length - 1, ki + 1)], kf);
  // câmera segue a ponta; no final abre para mostrar o caminho todo
  const ultima = e.tipo === 'final';
  const xs = g.pts.map((q) => q[0]), ys = g.pts.map((q) => q[1]);
  const largTudo = Math.max(...xs) - Math.min(...xs) + W * 0.5, altTudo = Math.max(...ys) - Math.min(...ys) + H * 0.4;
  const zTudo = Math.min(W / largTudo, H / altTudo, 1);
  const abre = ultima ? interpolate(tE, [0, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)}) : 0;
  const centroTudo = [(Math.max(...xs) + Math.min(...xs)) / 2, (Math.max(...ys) + Math.min(...ys)) / 2];
  const alvo = g.vertical ? [W / 2 + (ponta[0] - W / 2) * 0.25, ponta[1] - H * 0.2] : [ponta[0] - W * 0.2, H / 2];
  const camX = lerp(alvo[0], centroTudo[0], abre), camY = lerp(alvo[1], centroTudo[1], abre);
  const zoom = lerp(1, zTudo, abre);
  // abertura: o Lex despenca e bate na tela
  const tA = f - E[0].inicio;
  const batida = E[0].tipo === 'abertura' && i === 0;
  const shake = batida ? Math.max(0, 1 - Math.abs(tA - 6) / 8) * 18 * u : 0;
  const sx = (random(`sx${f}`) - 0.5) * shake, sy = (random(`sy${f}`) - 0.5) * shake;
  const mundo = `translate(${W / 2 + sx} ${H / 2 + sy}) scale(${zoom}) translate(${-camX} ${-camY})`;
  const d = g.amostras.map((q, k) => `${k ? 'L' : 'M'}${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(' ');
  const total = g.acum[g.acum.length - 1] || 1;
  const fioCompleto = ultima ? total : comp;
  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 70% at 50% 40%, #0F2A1C 0%, ${c.fundo} 60%)`, overflow: 'hidden'}}>
      <svg width={W} height={H} style={{position: 'absolute'}}>
        <defs><filter id="brilho" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={14 * u} /></filter></defs>
        <g transform={mundo}>
          {/* poeira de fundo */}
          {Array.from({length: 40}).map((_, k) => (
            <circle key={k} cx={(random(`px${k}`) - 0.2) * W * 1.6 + (g.vertical ? 0 : k * W * 0.08)} cy={(random(`py${k}`) - 0.2) * H * (g.vertical ? E.length * 0.7 : 1.5)}
              r={(2 + random(`pr${k}`) * 4) * u} fill={c.fio} opacity={0.12 + 0.1 * Math.sin(f / 20 + k)} />
          ))}
          <path d={d} stroke="#22302B" strokeWidth={22 * u} fill="none" strokeLinecap="round" />
          <path d={d} stroke={c.fio} strokeWidth={30 * u} fill="none" strokeLinecap="round" filter="url(#brilho)" opacity={0.55}
            strokeDasharray={`${fioCompleto} ${total}`} />
          <path d={d} stroke={c.fio2} strokeWidth={14 * u} fill="none" strokeLinecap="round" strokeDasharray={`${fioCompleto} ${total}`} />
          {!ultima ? <circle cx={ponta[0]} cy={ponta[1]} r={20 * u} fill="#fff" filter="url(#brilho)" /> : null}
          {g.pts.map((q, k) => {
            const ac = k < i || (k === i && (k === 0 || voo >= 1)) ? interpolate(f - E[k].inicio, [k === 0 ? 4 : 18, k === 0 ? 14 : 28], [0.01, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
            return <Botao key={k} x={q[0]} y={q[1]} r={78 * u} aceso={ultima ? 1 : ac} rotulo={String(k + 1)} c={c} />;
          })}
        </g>
      </svg>
      {/* card da estação */}
      {!ultima && e.tipo !== 'abertura' ? (
        <div style={{position: 'absolute', left: 60 * u, right: 60 * u, top: g.vertical ? H * 0.08 : H * 0.14, maxWidth: g.vertical ? undefined : W * 0.42}}>
          <Card e={e} f={f} c={c} u={u} fps={fps} />
        </div>
      ) : null}
      {/* abertura */}
      {batida ? (() => {
        const cai = interpolate(tA, [0, 6], [-H * 0.6, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad)});
        const sq = tA < 6 ? [0.8, 1.3] : [interpolate(tA, [6, 9, 14, 20], [1.35, 0.85, 1.08, 1]), interpolate(tA, [6, 9, 14, 20], [0.7, 1.15, 0.95, 1])];
        const sai = interpolate(tA, [e.duracao - 14, e.duracao - 2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.back(1.5))});
        const sc = (g.vertical ? 2.1 : 1.5) * u;
        return (
          <>
            <svg width={W} height={H} style={{position: 'absolute'}}>
              {Array.from({length: 12}).map((_, k) => {
                const v = Math.max(0, tA - 6), ang = (k / 12) * Math.PI * 2;
                return <rect key={k} x={W / 2 + Math.cos(ang) * v * 22 * u} y={H * 0.8 + Math.sin(ang) * v * 16 * u} width={16 * u} height={16 * u}
                  fill={k % 2 ? c.fio : c.fio2} opacity={Math.max(0, 1 - v / 18)} transform={`rotate(${v * 20} ${W / 2} ${H * 0.8})`} />;
              })}
              <g transform={`translate(${W / 2} ${H * 0.86 + cai + sai * H * 0.6}) scale(${sq[0] * sc} ${sq[1] * sc}) translate(-200 -600)`}>
                <Personagem tipo="lex" frame={f} boca={tA > 10 && tA < 40 ? (Math.sin(tA / 2.5) + 1) / 2 : 0} pose={tA < 30 ? 'comemora' : 'acena'} expressao="feliz" />
              </g>
            </svg>
            <div style={{position: 'absolute', left: 0, right: 0, top: H * 0.07, textAlign: 'center', fontFamily: 'Titulo', fontSize: 190 * u, color: c.fio2, letterSpacing: '0.02em',
              clipPath: `inset(0 ${100 - interpolate(tA, [8, 22], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}% 0 0)`, textShadow: `0 0 ${30 * u}px ${c.fio}`}}>{e.titulo}</div>
            {e.rotulo ? <div style={{position: 'absolute', left: 0, right: 0, top: H * 0.07 + 200 * u, textAlign: 'center', fontFamily: 'Corpo', fontSize: 48 * u, color: c.texto,
              opacity: interpolate(tA, [16, 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>{e.rotulo}</div> : null}
          </>
        );
      })() : null}
      {/* final: frase com o fio de base */}
      {ultima ? (
        <div style={{position: 'absolute', left: 60 * u, right: 60 * u, top: g.vertical ? H * 0.1 : H * 0.1, textAlign: 'center'}}>
          {(e.frase || []).map((l, k) => {
            const a = spring({frame: tE - 30 - k * 10, fps, config: {damping: 14, stiffness: 160}});
            return <div key={k} style={{fontFamily: 'Titulo', fontSize: 96 * u, lineHeight: 1.05, color: k === (e.frase || []).length - 1 ? c.fio2 : c.texto,
              opacity: a, transform: `translateY(${(1 - a) * 40 * u}px)`}}>{l}</div>;
          })}
          <div style={{height: 10 * u, margin: `${18 * u}px auto 0`, background: c.fio, borderRadius: 99, boxShadow: `0 0 ${24 * u}px ${c.fio}`,
            width: `${interpolate(tE, [44, 70], [0, 80], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}%`}} />
          {e.arroba ? <div style={{fontFamily: 'Corpo', fontSize: 44 * u, color: c.apagado, marginTop: 22 * u, opacity: interpolate(tE, [60, 72], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>{e.arroba}</div> : null}
        </div>
      ) : null}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.55))', pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};

import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { cor, ease, fonte, mola, PERFIL, SERIE } from './tema';
import { clamp, norm, quadro, useVideo } from './util';

// Camada 1: fundo petróleo com grade fina (como a "ficha" dos posts) e uma luz verde bem suave que respira.
export const Fundo: React.FC = () => {
  const f = useCurrentFrame();
  const d1 = Math.sin(f / 70) * 60, d2 = Math.cos(f / 90) * 50;
  return <AbsoluteFill style={{ background: cor.base }}>
    <AbsoluteFill style={{ backgroundImage: `linear-gradient(rgba(185,255,241,.05) 2px,transparent 2px),linear-gradient(90deg,rgba(185,255,241,.05) 2px,transparent 2px)`, backgroundSize: '90px 90px', backgroundPosition: `0 ${-(f * 0.6) % 90}px` }} />
    <div style={{ position: 'absolute', width: 1300, height: 1300, borderRadius: '50%', left: -520 + d1, top: -380, background: `radial-gradient(circle, rgba(11,164,87,.28), transparent 62%)`, filter: 'blur(40px)' }} />
    <div style={{ position: 'absolute', width: 1100, height: 1100, borderRadius: '50%', right: -480 - d2, bottom: -300, background: `radial-gradient(circle, rgba(4,49,44,.9), transparent 65%)`, filter: 'blur(50px)' }} />
  </AbsoluteFill>;
};

// Camadas finais: granulado (identidade do perfil) e vinheta.
const RUIDO = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .35 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;
export const Acabamento: React.FC = () => {
  const f = useCurrentFrame();
  return <>
    <AbsoluteFill style={{ pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(0,0,0,.18), transparent 22%, transparent 75%, rgba(0,0,0,.28))' }} />
    <AbsoluteFill style={{ pointerEvents: 'none', backgroundImage: RUIDO, backgroundPosition: `${(f * 37) % 240}px ${(f * 53) % 240}px`, opacity: 0.4, mixBlendMode: 'overlay' }} />
    <AbsoluteFill style={{ pointerEvents: 'none', background: 'radial-gradient(ellipse at center, transparent 58%, rgba(0,0,0,.35) 100%)' }} />
  </>;
};

// Símbolo "L com visto" da plataforma.
export const Simbolo: React.FC<{ px: number; p?: number }> = ({ px, p = 1 }) =>
  <svg width={px} height={px} viewBox="0 0 100 100" style={{ display: 'block', flex: 'none' }}>
    <defs><linearGradient id="gs" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#00B85A" /><stop offset=".55" stopColor="#009A8C" /><stop offset="1" stopColor="#14E6DA" /></linearGradient></defs>
    <rect x="2" y="2" width="96" height="96" rx="28" fill="url(#gs)" />
    <path d="M34 22 V66 H58 L76 34" fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    <circle cx="76" cy="20" r="5.5" fill="#fff" opacity={0.9 * p} />
  </svg>;

export const Marca: React.FC<{ px?: number; p?: number }> = ({ px = 30, p = 1 }) =>
  <div style={{ display: 'flex', alignItems: 'center', gap: px * 0.3 }}>
    <Simbolo px={px * 1.25} p={p} />
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
      <span style={{ fontFamily: fonte.sora, fontWeight: 600, fontSize: px * 0.36, letterSpacing: '.22em', textTransform: 'uppercase', color: cor.menta }}>Concurso com</span>
      <span style={{ fontFamily: fonte.sora, fontWeight: 800, fontSize: px, letterSpacing: '-.035em', color: cor.branco, marginTop: px * 0.08 }}>Líbero</span>
    </div>
  </div>;

// Cabeçalho fixo: série (em caixa) à esquerda, marca à direita; barra de progresso no topo (segura a retenção).
export const Cabecalho: React.FC = () => {
  const v = useVideo(); const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const p = spring({ frame: f - 4, fps, config: mola.smooth });
  const prog = interpolate(f, [0, durationInFrames - 1], [0, 1], clamp);
  return <>
    <div style={{ position: 'absolute', left: 0, top: 0, height: 10, width: `${prog * 100}%`, background: cor.verde }} />
    <div style={{ position: 'absolute', left: 80, right: 80, top: 190, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: p, transform: `translateY(${interpolate(p, [0, 1], [-30, 0])}px)` }}>
      <span style={{ fontFamily: fonte.sora, fontWeight: 800, fontSize: 30, letterSpacing: '.16em', textTransform: 'uppercase', color: cor.branco, background: cor.verdeEsc, padding: '10px 18px 8px' }}>{SERIE[v.serie] || v.serie}</span>
      <Marca px={34} p={interpolate(f, [6, 30], [0, 1], { ...clamp, easing: ease.out })} />
    </div>
  </>;
};

// Transição: faixa verde inclinada que varre a tela e esconde o corte (12 quadros, centrada no corte).
export const Varredura: React.FC<{ em: number }> = ({ em }) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [em - 6, em + 6], [1300, -1500], { ...clamp, easing: ease.inOut });
  if (f < em - 6 || f > em + 6) return null;
  return <div style={{ position: 'absolute', top: -200, bottom: -200, left: x, width: 1300, background: cor.verde, transform: 'skewX(-14deg)', boxShadow: `-60px 0 0 ${cor.menta}` }} />;
};

// Trocas só na legenda (a voz continua lendo por extenso): [["cinco mil e setecentos", "5.700"], …].
// A sequência de palavras vira uma só, com o tempo da primeira à última. Casa a sequência mais longa primeiro.
const trocarLegendas = (ps: any[], trocas: any[] = []) => {
  const regras = trocas.map(([de, para]) => [de.split(/\s+/).map(norm), para]).sort((a: any, b: any) => b[0].length - a[0].length);
  const out: any[] = [];
  for (let i = 0; i < ps.length;) {
    const r = regras.find(([seq]: any) => seq.every((w: string, j: number) => ps[i + j] && norm(ps[i + j].w) === w && ps[i + j].cena === ps[i].cena));
    if (r) { const n = r[0].length; const ult = ps[i + n - 1]; const pont = (ult.w.match(/[.,!?:;]$/) || [''])[0];
      out.push({ ...ps[i], w: r[1] + pont, fim: ult.fim }); i += n; }
    else out.push(ps[i++]);
  }
  return out;
};

// Legendas palavra a palavra (2–4 palavras por vez), palavra dita em caixa verde.
export const Legendas: React.FC<{ ocultas: boolean[] }> = ({ ocultas }) => {
  const v = useVideo(); const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const ps = trocarLegendas(v.tempo.palavras, v.legendas);
  // Monta os blocos uma vez por render (determinístico).
  const blocos: any[][] = []; let atual: any[] = [];
  ps.forEach((p, i) => {
    atual.push({ ...p, i });
    const chars = atual.map(a => a.w).join(' ').length;
    const fimFrase = /[.,!?:;]$/.test(p.w);
    const prox = ps[i + 1];
    if (fimFrase || atual.length >= 4 || chars > 20 || !prox || prox.cena !== p.cena) { blocos.push(atual); atual = []; }
  });
  const agora = f;
  const b = blocos.find((bl, k) => {
    const ini = quadro(bl[0].ini, fps);
    const prox = blocos[k + 1];
    const fim = prox ? quadro(prox[0].ini, fps) : quadro(bl.at(-1).fim, fps) + 10;
    return agora >= ini && agora < Math.min(fim, quadro(bl.at(-1).fim, fps) + 12);
  });
  if (!b || ocultas[b[0].cena]) return null;
  const ini = quadro(b[0].ini, fps);
  const p = spring({ frame: f - ini, fps, config: mola.snappy });
  return <div style={{ position: 'absolute', left: 70, right: 70, top: 1440, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 14, transform: `scale(${interpolate(p, [0, 1], [0.86, 1])})`, opacity: Math.min(1, p * 1.6) }}>
    {b.map(w => {
      const ativa = agora >= quadro(w.ini, fps) - 1 && agora < quadro(w.fim, fps) + 2;
      return <span key={w.i} style={{ fontFamily: fonte.sora, fontWeight: 800, fontSize: 56, lineHeight: 1.15, color: ativa ? cor.branco : cor.txt, background: ativa ? cor.verde : 'transparent', padding: '2px 12px 6px', textShadow: ativa ? 'none' : '0 3px 0 rgba(0,0,0,.45), 0 0 18px rgba(0,0,0,.5)' }}>{w.w.replace(/[.,;:]$/, '')}</span>;
    })}
  </div>;
};

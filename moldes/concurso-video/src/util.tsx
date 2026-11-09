import React, { createContext, useContext } from 'react';
import { Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { cor, ease, fonte, LEAD, mola } from './tema';

export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
export const lista = (v: any) => (v == null ? [] : Array.isArray(v) ? v : [v]);
export const norm = (s: string) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');

// Contexto do vídeo: palavras narradas com tempo e início de cada cena (em quadros absolutos).
export const Ctx = createContext<any>(null);
export const useVideo = () => useContext(Ctx);
export const quadro = (t: number, fps: number) => Math.round((LEAD + t) * fps);

// Marcas de sincronia: m("palavra") devolve o quadro (relativo à cena) em que a palavra começa a ser dita.
// A busca anda para frente a cada chamada, então itens de uma lista casam em ordem.
export function useMarcas(k: number) {
  const v = useVideo();
  const { fps } = useVideoConfig();
  const { p0, p1 } = v.tempo.cenas[k];
  const t0 = v.inicios[k];
  let cursor = p0, n = 0;
  return (em?: string, reserva?: number) => {
    n++;
    const alvo = norm((em || '').split(/\s+/)[0]);
    if (alvo) {
      for (let i = cursor; i < p1; i++) {
        const w = norm(v.tempo.palavras[i].w);
        if (w === alvo || (alvo.length >= 4 && w.startsWith(alvo))) {
          cursor = i + 1;
          return Math.max(0, quadro(v.tempo.palavras[i].ini, fps) - t0 - 2);
        }
      }
      if (typeof window !== 'undefined') console.warn(`[marca] "${em}" não encontrada na cena ${k + 1}`);
    }
    return reserva ?? 8 + n * 10;
  };
}

// Entrada padrão: opacidade + subida + escala, com mola.
export const Entra: React.FC<{ em: number; y?: number; s?: number; x?: number; m?: any; style?: any; children: any }> =
  ({ em, y = 40, s = 0.94, x = 0, m = mola.smooth, style, children }) => {
    const f = useCurrentFrame(); const { fps } = useVideoConfig();
    const p = spring({ frame: f - em, fps, config: m });
    return <div style={{ opacity: Math.min(1, p * 1.4), transform: `translate(${interpolate(p, [0, 1], [x, 0])}px,${interpolate(p, [0, 1], [y, 0])}px) scale(${interpolate(p, [0, 1], [s, 1])})`, ...style }}>{children}</div>;
  };

// Efeito sonoro 2 quadros antes do visual.
export const Sfx: React.FC<{ em: number; som: string; vol?: number }> = ({ em, som, vol = 0.3 }) =>
  <Sequence from={Math.max(0, em - 2)} durationInFrames={40} layout="none"><Audio src={staticFile(`sfx/${som}.wav`)} volume={vol} /></Sequence>;

// Texto com **negrito** e [[caixa]] (fundo verde sólido, como nos posts do perfil).
export const Rico: React.FC<{ t: string; caixa?: string; caixaTxt?: string; forte?: string }> = ({ t, caixa = cor.verde, caixaTxt = cor.branco, forte }) => {
  const partes = String(t).split(/(\*\*.+?\*\*|\[\[.+?\]\])/g).filter(Boolean);
  return <>{partes.map((p, i) => p.startsWith('**') ? <b key={i} style={{ fontWeight: 800, color: forte }}>{p.slice(2, -2)}</b>
    : p.startsWith('[[') ? <span key={i} style={{ background: caixa, color: caixaTxt, padding: '0 .14em', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}>{p.slice(2, -2)}</span>
      : <React.Fragment key={i}>{p}</React.Fragment>)}</>;
};

// Título de cena (display, caixa alta), entrando palavra a palavra.
// O tamanho cai sozinho quando o verso mais longo não caberia em `larg` px (Big Shoulders ≈ 0,46 em por letra).
export const Titulo: React.FC<{ t: any; em?: number; px?: number; cor?: string; centro?: boolean; larg?: number }> = ({ t, em = 0, px: pxMax = 110, cor: c = cor.branco, centro, larg = 920 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const maior = Math.max(...lista(t).map((l: string) => l.replace(/\[\[|\]\]/g, '').length));
  const px = Math.min(pxMax, Math.floor(larg / (maior * 0.46)));
  let n = 0;
  return <div style={{ fontFamily: fonte.display, fontWeight: 900, fontSize: px, lineHeight: 1, textTransform: 'uppercase', color: c, textAlign: centro ? 'center' : 'left' }}>
    {lista(t).map((linha: string, li: number) => <div key={li} style={{ display: 'flex', flexWrap: 'wrap', gap: px * 0.24, justifyContent: centro ? 'center' : 'flex-start', marginTop: li ? px * 0.06 : 0 }}>
      {(linha.match(/\[\[.+?\]\]\S*|\S+/g) || []).map((tok, wi) => {
        const caixa = tok.startsWith('[[');
        const w = caixa ? tok.slice(0, tok.indexOf(']]') + 2) : tok, resto = caixa ? tok.slice(tok.indexOf(']]') + 2) : '';
        const d = em + (n++) * 3;
        const p = spring({ frame: f - d, fps, config: mola.snappy });
        const pc = spring({ frame: f - d - 5, fps, config: mola.smooth });
        return <span key={wi} style={{ display: 'inline-block', opacity: Math.min(1, p * 1.5), transform: `translateY(${interpolate(p, [0, 1], [px * 0.35, 0])}px) scale(${interpolate(p, [0, 1], [1.15, 1])})` }}>
          <span style={{ position: 'relative', display: 'inline-block', padding: caixa ? '0 .12em' : 0 }}>
            {caixa && <span style={{ position: 'absolute', inset: '0.04em 0 -0.02em', background: cor.verde, transformOrigin: 'left', transform: `scaleX(${pc})` }} />}
            <span style={{ position: 'relative' }}>{caixa ? w.slice(2, -2) : w}</span>
          </span>{resto}
        </span>;
      })}
    </div>)}
  </div>;
};

// Contador numérico com mola.
export const Conta: React.FC<{ alvo: number; em: number; prefixo?: string; sufixo?: string }> = ({ alvo, em, prefixo = '', sufixo = '' }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = spring({ frame: f - em, fps, config: mola.conta });
  const v = Math.round(interpolate(p, [0, 1], [0, alvo], clamp));
  return <span style={{ fontVariantNumeric: 'tabular-nums' }}>{prefixo}{v.toLocaleString('pt-BR')}{sufixo}</span>;
};

// Oscilação leve para elementos parados na tela (respiração).
export const useRespira = (vel = 30, amp = 4) => { const f = useCurrentFrame(); return Math.sin(f / vel) * amp; };

// Desenho de traço (SVG): progresso 0→1 de uma linha.
export const useTraco = (em: number, dur = 18) => { const f = useCurrentFrame(); return interpolate(f, [em, em + dur], [0, 1], { ...clamp, easing: ease.out }); };

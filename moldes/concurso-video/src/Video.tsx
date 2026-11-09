import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Acabamento, Cabecalho, Fundo, Legendas, Varredura } from './camadas';
import { CENAS, SEM_LEGENDA } from './cenas';
import { ease, LEAD } from './tema';
import { FONTES } from './fontes.gerado';
import { clamp, Ctx, quadro, Sfx } from './util';

// Fontes embutidas (src/fontes.gerado.ts, de public/fonts via `node fontes.mjs`) como @font-face em data URL:
// nada a buscar, então não há delayRender que possa travar o render.
const CSS_FONTES = FONTES.map(([fam, b64, peso]) => `@font-face{font-family:'${fam}';font-weight:${peso};font-display:block;src:url(data:font/woff2;base64,${b64}) format('woff2')}`).join('');

// Início de cada cena em quadros absolutos: a 1ª no quadro 0; as outras 3 quadros antes da 1ª palavra.
export const inicios = (v: any, fps: number) => v.tempo.cenas.map((c: any, k: number) => (k === 0 ? 0 : quadro(c.ini, fps) - 3));

const Saida: React.FC<{ dur: number; children: any; ultima: boolean }> = ({ dur, children, ultima }) => {
  const f = useCurrentFrame();
  if (ultima) return <AbsoluteFill>{children}</AbsoluteFill>;
  const p = interpolate(f, [dur - 9, dur], [0, 1], { ...clamp, easing: ease.in });
  return <AbsoluteFill style={{ opacity: 1 - p, transform: `translateY(${-50 * p}px) scale(${1 - 0.04 * p})` }}>{children}</AbsoluteFill>;
};

export const Video: React.FC<{ video: any }> = ({ video }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const ini = inicios(video, fps);
  const ctx = { ...video, inicios: ini };
  const ocultas = video.cenas.map((c: any) => c.legenda === false || (c.legenda == null && SEM_LEGENDA.has(c.tipo)));
  return <Ctx.Provider value={ctx}>
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <style>{CSS_FONTES}</style>
      <Fundo />
      {video.cenas.map((c: any, k: number) => {
        const dur = (k + 1 < ini.length ? ini[k + 1] : durationInFrames) - ini[k];
        const C = CENAS[c.tipo];
        if (!C) throw new Error(`tipo de cena desconhecido: ${c.tipo}`);
        return <Sequence key={k} from={ini[k]} durationInFrames={dur} name={`${k + 1} · ${c.tipo}`}>
          <Saida dur={dur} ultima={k === ini.length - 1}><C c={c} k={k} /></Saida>
        </Sequence>;
      })}
      <Cabecalho />
      <Legendas ocultas={ocultas} />
      {ini.slice(1).map((q: number, i: number) => <React.Fragment key={i}><Varredura em={q} /><Sfx em={q - 4} som="whoosh" vol={0.28} /></React.Fragment>)}
      <Acabamento />
      <Sequence from={Math.round(LEAD * fps)} layout="none"><Audio src={staticFile(`audio/${video.id}.mp3`)} /></Sequence>
    </AbsoluteFill>
  </Ctx.Provider>;
};

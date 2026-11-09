import React from "react";
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

const C = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const fontesCss = `
@font-face{font-family:'Old Standard TT';font-weight:400;src:url(${staticFile("fonts/OldStandardTT-400.ttf")})}
@font-face{font-family:'Old Standard TT';font-weight:700;src:url(${staticFile("fonts/OldStandardTT-700.ttf")})}
@font-face{font-family:'IBM Plex Sans';font-weight:500;src:url(${staticFile("fonts/IBMPlexSans-500.ttf")})}
@font-face{font-family:'IBM Plex Sans';font-weight:600;src:url(${staticFile("fonts/IBMPlexSans-600.ttf")})}
@font-face{font-family:'IBM Plex Sans';font-weight:700;src:url(${staticFile("fonts/IBMPlexSans-700.ttf")})}
@font-face{font-family:'IBM Plex Sans Condensed';font-weight:600;src:url(${staticFile("fonts/IBMPlexSansCondensed-600.ttf")})}
@font-face{font-family:'IBM Plex Sans Condensed';font-weight:700;src:url(${staticFile("fonts/IBMPlexSansCondensed-700.ttf")})}
@font-face{font-family:'IBM Plex Mono';font-weight:500;src:url(${staticFile("fonts/IBMPlexMono-500.ttf")})}
@font-face{font-family:'IBM Plex Mono';font-weight:600;src:url(${staticFile("fonts/IBMPlexMono-600.ttf")})}
`;

/** Entrada padrão: sobe, cresce e aparece (nunca só opacidade). */
export const useEntrada = (atraso = 0, mola: keyof typeof theme.mola = "suave") => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - atraso, fps, config: theme.mola[mola] });
  return {
    p,
    style: {
      opacity: p,
      transform: `translateY(${interpolate(p, [0, 1], [46, 0])}px) scale(${interpolate(p, [0, 1], [0.94, 1])})`,
    } as React.CSSProperties,
  };
};

export const Entra: React.FC<{ atraso?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ atraso = 0, children, style }) => {
  const e = useEntrada(atraso);
  return <div style={{ ...e.style, ...style }}>{children}</div>;
};

/** Saída da cena: mais rápida que a entrada. */
export const Saida: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [dur - 9, dur - 1], [1, 0], { ...C, easing: theme.ease.in });
  const y = interpolate(f, [dur - 9, dur - 1], [0, -36], { ...C, easing: theme.ease.in });
  const blur = interpolate(f, [dur - 9, dur - 1], [0, 6], C);
  return <AbsoluteFill style={{ opacity: o, transform: `translateY(${y}px)`, filter: blur > 0.1 ? `blur(${blur}px)` : undefined }}>{children}</AbsoluteFill>;
};

/** Fundo: arquivo escuro com luz de luminária, pautas de papel e poeira. */
export const Fundo: React.FC = () => {
  const f = useCurrentFrame();
  const dx = Math.sin(f / 70) * 40, dy = Math.cos(f / 90) * 30;
  return (
    <AbsoluteFill style={{ background: theme.cor.fundo }}>
      <div style={{ position: "absolute", width: 1500, height: 1500, borderRadius: "50%", left: -210 + dx, top: 80 + dy,
        background: `radial-gradient(circle, ${theme.cor.fundo2} 0%, ${theme.cor.fundo2}88 35%, transparent 70%)` }} />
      <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", right: -380 - dx, bottom: -300,
        background: `radial-gradient(circle, ${theme.cor.lacre}14, transparent 68%)` }} />
      <AbsoluteFill style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent 0 61px, ${theme.cor.linha}33 61px 62px)`, opacity: 0.5,
        transform: `translateY(${(f * 0.25) % 62}px)` }} />
    </AbsoluteFill>
  );
};

/** Camadas de cima: tom, grão de filme e vinheta. */
export const Acabamento: React.FC = () => {
  const f = useCurrentFrame();
  const ruido = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ backgroundColor: "#7a5a2a", mixBlendMode: "soft-light", opacity: 0.2 }} />
      <AbsoluteFill style={{ backgroundImage: ruido, backgroundSize: "240px", opacity: 0.09, mixBlendMode: "overlay",
        backgroundPosition: `${(f * 7) % 240}px ${(f * 13) % 240}px` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 50%, rgba(0,0,0,0.62) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Etiqueta fixa no topo: marca do perfil e número da pauta, com barra de progresso. */
export const Etiqueta: React.FC<{ marca: string; pauta?: number; serie?: string; total: number }> = ({ marca, pauta, serie, total }) => {
  const f = useCurrentFrame();
  const prog = interpolate(f, [0, total], [0, 1], C);
  return (
    <div style={{ position: "absolute", top: 170, left: theme.area.lado, right: theme.area.lado, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: theme.fonte.mono, fontWeight: 500, fontSize: 26,
        letterSpacing: 4, color: theme.cor.apagado, textTransform: "uppercase" }}>
        <span>{marca}</span>
        <span />
      </div>
      <div style={{ height: 3, background: theme.cor.linha }}>
        <div style={{ height: 3, width: `${prog * 100}%`, background: theme.cor.apagado }} />
      </div>
      {serie ? <div style={{ fontFamily: theme.fonte.mono, fontSize: 22, letterSpacing: 3, color: theme.cor.apagado, textTransform: "uppercase" }}>{serie}</div> : null}
    </div>
  );
};

/** Carimbo de lacre que bate na tela. */
export const Carimbo: React.FC<{ texto: string; atraso: number; giro?: number; tam?: number; style?: React.CSSProperties }> = ({ texto, atraso, giro = -8, tam = 64, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - atraso, fps, config: theme.mola.carimbo });
  const vis = f >= atraso ? 1 : 0;
  return (
    <div style={{ display: "inline-block", opacity: vis * Math.min(1, p * 1.4), transform: `rotate(${giro}deg) scale(${interpolate(p, [0, 1], [2.2, 1])})`,
      border: `6px solid ${theme.cor.lacre}`, color: theme.cor.lacre, padding: "10px 26px", fontFamily: theme.fonte.mono, fontWeight: 600,
      fontSize: tam, letterSpacing: 6, textTransform: "uppercase", lineHeight: 1.1, mixBlendMode: "screen", ...style }}>{texto}</div>
  );
};

/** Texto com trechos entre ** ** pintados de lacre. */
export const Marcado: React.FC<{ texto: string; cor?: string }> = ({ texto, cor = theme.cor.lacre }) => (
  <>{texto.split(/(\*\*[^*]+\*\*)/g).map((t, i) => t.startsWith("**") ? <span key={i} style={{ color: cor }}>{t.slice(2, -2)}</span> : <React.Fragment key={i}>{t}</React.Fragment>)}</>
);

export const clamp = C;

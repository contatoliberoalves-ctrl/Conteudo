import React from "react";
import {
  AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { theme } from "./theme";

const C = theme.colors;
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const useIsV = () => { const { width, height } = useVideoConfig(); return height > width; };

/* ---------- Camadas de base ---------- */
export const BgMesh: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const d1 = Math.sin(f / 70) * 60, d2 = Math.cos(f / 85) * 50, d3 = Math.sin(f / 110) * 40;
  const s = Math.max(width, height);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(140deg, ${C.bg} 0%, ${C.bgAlt} 55%, #1a2068 100%)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: s * 0.9, height: s * 0.9, borderRadius: "50%", top: -s * 0.35 + d3, left: -s * 0.25 + d1, filter: "blur(60px)", background: `radial-gradient(circle, ${C.navyMid}55, transparent 62%)` }} />
      <div style={{ position: "absolute", width: s * 0.7, height: s * 0.7, borderRadius: "50%", bottom: -s * 0.32, right: -s * 0.2 - d2, filter: "blur(80px)", background: `radial-gradient(circle, ${C.primary}1c, transparent 65%)` }} />
      <Rings />
    </AbsoluteFill>
  );
};

const Rings: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const r = Math.min(width, height) * 0.55;
  const rot = f * 0.04;
  return (
    <div style={{ position: "absolute", right: -r * 0.45, top: -r * 0.45, width: r * 1.6, height: r * 1.6, transform: `rotate(${rot}deg)` }}>
      {[1, 0.78, 0.56].map((k, i) => (
        <div key={i} style={{ position: "absolute", inset: `${(1 - k) * 50}%`, borderRadius: "50%", border: `1px solid rgba(255,255,255,${0.05 + i * 0.015})` }} />
      ))}
    </div>
  );
};

export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: C.navyMid, mixBlendMode: "soft-light", opacity: 0.16 }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,20,0.10), transparent 28%, transparent 72%, rgba(0,0,20,0.22))" }} />
  </AbsoluteFill>
);

export const Grain: React.FC = () => {
  const f = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return <AbsoluteFill style={{ pointerEvents: "none", backgroundImage: noise, backgroundSize: "220px", backgroundPosition: `${(f * 7) % 220}px ${(f * 13) % 220}px`, opacity: 0.06, mixBlendMode: "overlay" }} />;
};

export const Vignette: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,15,0.38) 100%)" }} />
);

/* ---------- Movimento ---------- */
export const useSpring = (delay = 0, cfg: keyof typeof theme.spring = "smooth") => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: theme.spring[cfg] });
};

export const Entrance: React.FC<{ delay?: number; y?: number; scale?: number; x?: number; cfg?: keyof typeof theme.spring; style?: React.CSSProperties; children: React.ReactNode }> =
  ({ delay = 0, y = 40, x = 0, scale = 0.94, cfg = "smooth", style, children }) => {
    const p = useSpring(delay, cfg);
    return (
      <div style={{ opacity: interpolate(p, [0, 0.6], [0, 1], clamp), transform: `translate(${interpolate(p, [0, 1], [x, 0])}px, ${interpolate(p, [0, 1], [y, 0])}px) scale(${interpolate(p, [0, 1], [scale, 1])})`, ...style }}>
        {children}
      </div>
    );
  };

/** Saída da cena: mais rápida que a entrada (10 frames). */
export const SceneExit: React.FC<{ dur: number; children: React.ReactNode; noExit?: boolean }> = ({ dur, children, noExit }) => {
  const f = useCurrentFrame();
  const t = noExit ? 0 : interpolate(f, [dur - 11, dur - 1], [0, 1], { ...clamp, easing: theme.ease.in });
  return (
    <AbsoluteFill style={{ opacity: 1 - t, transform: `scale(${1 + t * 0.05}) translateY(${-t * 30}px)`, filter: t > 0.01 ? `blur(${t * 8}px)` : undefined }}>
      {children}
    </AbsoluteFill>
  );
};

export const WordReveal: React.FC<{ text: string; delay?: number; per?: number; style?: React.CSSProperties; italicFrom?: number; gold?: boolean }> =
  ({ text, delay = 0, per = 3, style, italicFrom = 999, gold = false }) => {
    const f = useCurrentFrame(); const { fps } = useVideoConfig();
    const words = text.split(" ");
    return (
      <div style={{ display: "flex", flexWrap: "wrap", columnGap: "0.24em", ...style }}>
        {words.map((w, i) => {
          const p = spring({ frame: f - delay - i * per, fps, config: theme.spring.snappy });
          const it = i >= italicFrom;
          return (
            <span key={i} style={{ display: "inline-block", opacity: interpolate(p, [0, 0.5], [0, 1], clamp), transform: `translateY(${interpolate(p, [0, 1], [0.5, 0])}em)`, fontStyle: it ? "italic" : "normal", color: it && gold ? C.primary : undefined }}>
              {w}
            </span>
          );
        })}
      </div>
    );
  };

/* ---------- Tipografia ---------- */
export const Kicker: React.FC<{ children: React.ReactNode; delay?: number; size?: number; color?: string }> = ({ children, delay = 0, size = 22, color = C.textDim }) => {
  const p = useSpring(delay, "snappy");
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: size, letterSpacing: "0.18em", textTransform: "uppercase", color, opacity: p, transform: `translateX(${interpolate(p, [0, 1], [-20, 0])}px)` }}>
      <span style={{ width: interpolate(p, [0, 1], [0, size * 1.4]), height: 3, background: C.primary, borderRadius: 2 }} />
      {children}
    </div>
  );
};

export const display = (size: number): React.CSSProperties => ({ fontFamily: theme.fonts.display, fontWeight: 400, fontSize: size, lineHeight: 1.04, letterSpacing: "-0.025em", color: C.text });
export const body = (size: number): React.CSSProperties => ({ fontFamily: theme.fonts.body, fontWeight: 500, fontSize: size, lineHeight: 1.5, color: C.textDim });

/* ---------- Molduras ---------- */
export const Browser: React.FC<{ src: string; width: number; height: number; scrollTo?: number; scrollFrom?: number; scrollStart?: number; scrollEnd?: number; zoom?: [number, number]; imgW?: number; label?: string }> =
  ({ src, width, height, scrollFrom = 0, scrollTo = 0, scrollStart = 0, scrollEnd = 100, zoom = [1, 1.04], label = "Portal ANOREG Pernambuco" }) => {
    const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
    const bar = Math.round(height * 0.055) + 14;
    const y = interpolate(f, [scrollStart, scrollEnd], [scrollFrom, scrollTo], { ...clamp, easing: theme.ease.inOut });
    const z = interpolate(f, [0, durationInFrames], zoom, { ...clamp, easing: theme.ease.soft });
    return (
      <div style={{ width, height, borderRadius: 18, overflow: "hidden", background: "#fff", boxShadow: "0 50px 100px -30px rgba(0,0,10,0.75), 0 0 0 1px rgba(255,255,255,0.10)" }}>
        <div style={{ height: bar, display: "flex", alignItems: "center", gap: 10, padding: "0 20px", background: "#eceae4", borderBottom: "1px solid #dcd9d0" }}>
          {["#ec6a5e", "#f4bf4f", "#61c554"].map((c) => <span key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c }} />)}
          <div style={{ marginLeft: 18, flex: 1, maxWidth: width * 0.5, height: bar * 0.56, borderRadius: 99, background: "#fff", display: "flex", alignItems: "center", gap: 8, padding: "0 16px", fontFamily: theme.fonts.body, fontWeight: 600, fontSize: Math.max(13, bar * 0.27), color: "#5a5e75" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5a5e75" strokeWidth="2.2"><rect x="5" y="10.5" width="14" height="10" rx="2" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></svg>
            {label}
          </div>
        </div>
        <div style={{ position: "relative", height: height - bar, overflow: "hidden" }}>
          <Img src={staticFile(src)} style={{ position: "absolute", top: 0, left: 0, width: "100%", transformOrigin: "50% 0%", transform: `translateY(${-y}px) scale(${z})` }} />
        </div>
      </div>
    );
  };

export const Phone: React.FC<{ src: string; height: number; scrollTo?: number; start?: number; end?: number }> = ({ src, height, scrollTo = 0, start = 0, end = 100 }) => {
  const f = useCurrentFrame();
  const w = height * 0.49;
  const y = interpolate(f, [start, end], [0, scrollTo], { ...clamp, easing: theme.ease.inOut });
  const pad = height * 0.022;
  return (
    <div style={{ width: w, height, borderRadius: height * 0.085, background: "#0a0c22", padding: pad, boxShadow: "0 50px 90px -30px rgba(0,0,10,0.85), inset 0 0 0 2px rgba(255,255,255,0.14)" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: height * 0.068, overflow: "hidden", background: "#fff" }}>
        <Img src={staticFile(src)} style={{ position: "absolute", width: "100%", top: 0, transform: `translateY(${-y}px)` }} />
        <div style={{ position: "absolute", top: height * 0.012, left: "50%", transform: "translateX(-50%)", width: w * 0.3, height: height * 0.028, borderRadius: 99, background: "#0a0c22" }} />
      </div>
    </div>
  );
};

export const Card: React.FC<{ src: string; width: number; height: number; zoom?: [number, number]; pan?: [number, number]; position?: string; inset?: number }> = ({ src, width, height, zoom = [1, 1.07], pan = [0, -20], position = "50% 0%", inset = 0 }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const z = interpolate(f, [0, durationInFrames], zoom, { ...clamp, easing: theme.ease.soft });
  const px = interpolate(f, [0, durationInFrames], pan, { ...clamp, easing: theme.ease.soft });
  return (
    <div style={{ width, height, borderRadius: 22, overflow: "hidden", background: C.paper, boxShadow: "0 50px 100px -30px rgba(0,0,10,0.75), 0 0 0 1px rgba(255,255,255,0.10)" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: inset ? "contain" : "cover", objectPosition: position, padding: inset, transform: `scale(${z}) translateX(${px}px)` }} />
    </div>
  );
};

/** Etiqueta de destaque (callout) */
export const Callout: React.FC<{ n: string; title: string; text?: string; delay: number; active?: boolean; size?: number }> = ({ n, title, text, delay, active, size = 1 }) => {
  const p = useSpring(delay, "snappy");
  const f = useCurrentFrame();
  const float = Math.sin((f + delay * 3) / 26) * 2;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 18 * size, padding: `${20 * size}px ${24 * size}px`, borderRadius: 18 * size, background: active ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.05)", border: `1px solid ${active ? "rgba(244,210,31,0.45)" : C.line}`, opacity: interpolate(p, [0, 0.5], [0, 1], clamp), transform: `translateX(${interpolate(p, [0, 1], [40, 0])}px) translateY(${float}px) scale(${interpolate(p, [0, 1], [0.95, 1])})` }}>
      <span style={{ flex: "none", display: "grid", placeItems: "center", width: 46 * size, height: 46 * size, borderRadius: "50%", background: active ? C.primary : "rgba(255,255,255,0.08)", color: active ? C.bg : C.text, fontFamily: theme.fonts.display, fontStyle: "italic", fontSize: 24 * size }}>{n}</span>
      <div>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 25 * size, color: C.text, lineHeight: 1.3 }}>{title}</div>
        {text && <div style={{ ...body(19 * size), marginTop: 4 }}>{text}</div>}
      </div>
    </div>
  );
};

/* ---------- Selo (mesmo desenho do site) ---------- */
const sealPts = (() => { const p: string[] = []; for (let i = 0; i < 48; i++) { const a = (i / 48) * Math.PI * 2, r = i % 2 ? 44 : 48; p.push(`${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`); } return p.join(" "); })();
const ICONS: Record<string, string> = {
  flag: "M5 21V4M5 4h11l-2 4 2 4H5",
  cap: "M2.5 9.5 12 5l9.5 4.5L12 14 2.5 9.5Z M6.5 11.5V16c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-4.5",
  calendar: "M3.5 5h17v15.5h-17z M3.5 10h17M8 3v4M16 3v4",
  bell: "M18 9a6 6 0 0 0-12 0c0 6.5-2.5 7.5-2.5 8.5h17C20.5 16.5 18 15.5 18 9ZM10 21h4",
  seal: "M12 4a6 6 0 1 1 0 12a6 6 0 1 1 0-12M8.5 14.8 7 21l5-2.5 5 2.5-1.5-6.2",
  pen: "m14.5 5.5 4 4L8 20H4v-4L14.5 5.5Z",
  book: "M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5v-13ZM20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5v-13Z",
  users: "M9 5.3a3.2 3.2 0 1 1 0 6.4a3.2 3.2 0 1 1 0-6.4M3 19.5a6 6 0 0 1 12 0M16 5.5a3 3 0 0 1 0 6M17.5 14.2A6 6 0 0 1 21 19.5",
  lock: "M5 10.5h14v10H5z M8 10.5V8a4 4 0 0 1 8 0v2.5",
};
export const Seal: React.FC<{ icon: string; earned: boolean; size: number }> = ({ icon, earned, size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <polygon points={sealPts} fill={earned ? C.primary : "rgba(255,255,255,0.04)"} stroke={earned ? "#e2bb10" : "rgba(255,255,255,0.25)"} strokeWidth={1.2} strokeDasharray={earned ? undefined : "3 3"} />
    <circle cx="50" cy="50" r="36" fill={earned ? "#131950" : "rgba(255,255,255,0.04)"} stroke={earned ? "none" : "rgba(255,255,255,0.15)"} />
    <circle cx="50" cy="50" r="31" fill="none" stroke={earned ? C.primary : "rgba(255,255,255,0.12)"} strokeWidth={1.4} strokeDasharray={earned ? "2 2.5" : undefined} />
    <g transform="translate(35 35) scale(1.25)" fill="none" stroke={earned ? C.primary : "rgba(255,255,255,0.45)"} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d={ICONS[earned ? icon : "lock"]} />
    </g>
  </svg>
);

export const Ring: React.FC<{ pct: number; size: number; stroke?: number; children?: React.ReactNode }> = ({ pct, size, stroke = 16, children }) => {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.primary} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${c * pct} ${c}`} style={{ filter: `drop-shadow(0 0 18px ${C.glow})` }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>{children}</div>
    </div>
  );
};

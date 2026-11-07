/* Estilo C · Cinematográfico 3D: escuro, telas flutuando em perspectiva, feixes de luz e câmera lenta. 90 BPM. */
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";
import { Phone, Ring, Seal, clamp, useIsV } from "./components";

export const C_BEAT = 20, C_BAR = 80, C_TOTAL = 22 * 80;
const K = { bg: "#05061a", deep: "#0b0f33", gold: "#f4d21f", goldSoft: "#e8c96a", text: "#f3f2ee", dim: "#9ea3c8" };
const disp = (s: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ fontFamily: theme.fonts.display, fontWeight: 400, fontSize: s, lineHeight: 1.02, letterSpacing: "-0.02em", color: K.text, ...extra });
const caps = (s: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: s, letterSpacing: "0.32em", textTransform: "uppercase", color: K.dim, ...extra });
const useSp = (d: number, cfg: keyof typeof theme.spring = "smooth") => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return spring({ frame: f - d, fps, config: theme.spring[cfg] }); };
const ease = (f: number, a: number, b: number, from: number, to: number, e = theme.ease.inOut) => interpolate(f, [a, b], [from, to], { ...clamp, easing: e });

const Space: React.FC = () => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const s = Math.max(width, height);
  const stars = React.useMemo(() => Array.from({ length: 70 }).map((_, i) => ({ x: (i * 73.13) % 100, y: (i * 41.7 + (i % 7) * 13) % 100, r: 1 + (i % 3) * 0.6, sp: 0.2 + (i % 5) * 0.08 })), []);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${K.deep} 0%, ${K.bg} 70%)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: s, height: s * 0.5, left: (width - s) / 2, top: height * 0.55, background: "radial-gradient(ellipse at center, rgba(60,70,163,0.35), transparent 65%)", filter: "blur(40px)", transform: `translateX(${Math.sin(f / 90) * 60}px)` }} />
      {stars.map((st, i) => <div key={i} style={{ position: "absolute", left: `${(st.x + f * st.sp * 0.05) % 100}%`, top: `${st.y}%`, width: st.r * 2, height: st.r * 2, borderRadius: "50%", background: "#fff", opacity: 0.12 + 0.18 * (0.5 + 0.5 * Math.sin(f / 20 + i)) }} />)}
      {/* chão refletido */}
      <div style={{ position: "absolute", left: "-20%", right: "-20%", bottom: 0, height: "38%", backgroundImage: "linear-gradient(rgba(123,131,201,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(123,131,201,0.10) 1px, transparent 1px)", backgroundSize: "90px 90px", backgroundPosition: `0 ${(f * 1.2) % 90}px`, transform: "perspective(600px) rotateX(62deg)", transformOrigin: "50% 100%", maskImage: "linear-gradient(transparent, black 60%)", WebkitMaskImage: "linear-gradient(transparent, black 60%)" }} />
    </AbsoluteFill>
  );
};

const LightSweep: React.FC<{ at: number; dur?: number; angle?: number }> = ({ at, dur = 40, angle = 18 }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + dur, 0, 1);
  if (p <= 0 || p >= 1) return null;
  return <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", overflow: "hidden" }}><div style={{ position: "absolute", top: "-30%", bottom: "-30%", left: `${-40 + p * 160}%`, width: "22%", transform: `rotate(${angle}deg)`, background: "linear-gradient(90deg, transparent, rgba(244,210,31,0.10), rgba(255,255,255,0.22), rgba(244,210,31,0.10), transparent)", filter: "blur(10px)" }} /></AbsoluteFill>;
};

const Screen: React.FC<{ src: string; w: number; h: number; pos?: string; glow?: boolean; scroll?: number }> = ({ src, w, h, pos = "50% 0%", glow, scroll = 0 }) => (
  <div style={{ width: w, height: h, borderRadius: 16, overflow: "hidden", background: "#fff", boxShadow: `0 60px 120px -30px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.12)${glow ? ", 0 0 90px rgba(244,210,31,0.18)" : ""}`, position: "relative" }}>
    <Img src={staticFile(src)} style={{ position: "absolute", left: 0, top: -scroll, width: "100%", minHeight: "100%", objectFit: "cover", objectPosition: pos }} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0.18), transparent 30%, transparent 70%, rgba(0,0,30,0.18))" }} />
  </div>
);
/** Reflexo no chão */
const Reflect: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ WebkitBoxReflect: "below 18px linear-gradient(transparent 70%, rgba(255,255,255,0.18))" } as React.CSSProperties}>{children}</div>
);
const Fade: React.FC<{ dur: number; children: React.ReactNode; inF?: number }> = ({ dur, children, inF = 16 }) => {
  const f = useCurrentFrame();
  const o = Math.min(ease(f, 0, inF, 0, 1, theme.ease.out), ease(f, dur - 14, dur, 1, 0, theme.ease.in));
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};
const Title: React.FC<{ kicker?: string; lines: [string, boolean][]; d: number; size: number; align?: "center" | "left" }> = ({ kicker, lines, d, size, align = "center" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return (
    <div style={{ display: "grid", justifyItems: align === "center" ? "center" : "start", gap: 18, textAlign: align }}>
      {kicker && <div style={{ ...caps(22), opacity: ease(f, d, d + 20, 0, 1), letterSpacing: `${ease(f, d, d + 40, 0.6, 0.32, theme.ease.out)}em` }}>{kicker}</div>}
      {lines.map(([t, gold], i) => {
        const p = spring({ frame: f - d - 8 - i * 10, fps, config: { damping: 30, stiffness: 60 } });
        return <div key={i} style={{ ...disp(size, { fontStyle: gold ? "italic" : "normal", color: gold ? K.gold : K.text }), opacity: p, filter: `blur(${(1 - p) * 14}px)`, transform: `translateY(${(1 - p) * 30}px)`, textShadow: gold ? "0 0 40px rgba(244,210,31,0.35)" : undefined }}>{t}</div>;
      })}
    </div>
  );
};

/* ---- Cenas ---- */
const Abertura: React.FC = () => {
  const f = useCurrentFrame(); const v = useIsV();
  const reveal = ease(f, 10, 70, 0, 1, theme.ease.soft);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: v ? 80 : 60 }}>
      <div style={{ position: "relative", padding: "30px 44px", background: "#fff", borderRadius: 18, transform: `perspective(1400px) rotateY(${(1 - reveal) * -28}deg) scale(${0.9 + reveal * 0.1})`, opacity: reveal, boxShadow: "0 0 120px rgba(244,210,31,0.15), 0 40px 80px -20px rgba(0,0,0,0.8)" }}>
        <Img src={staticFile("img/logo.jpg")} style={{ width: v ? 600 : 540 }} />
      </div>
      <Title kicker="ANOREG Pernambuco" lines={[["Pernambuco merece", false], ["um portal à altura.", true]]} d={C_BAR + 10} size={v ? 92 : 96} />
      <LightSweep at={20} dur={50} />
    </AbsoluteFill>
  );
};

const Carrossel: React.FC = () => {
  const f = useCurrentFrame(); const v = useIsV();
  const shots = ["img/site-hero.jpg", "img/portal-painel-top.jpg", "img/sec-comissoes.png", "img/portal-jornada-top.jpg", "img/sec-cidadania.png", "img/portal-trilha-top.jpg"];
  const rot = ease(f, 0, 3 * C_BAR, 30, -150, theme.ease.soft);
  const R = v ? 760 : 1050, w = v ? 680 : 760, h = w * 0.62;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", top: v ? 220 : 90, width: "100%" }}><Title kicker="O novo portal" lines={[["Um só lugar para a categoria", false], ["e para a sociedade.", true]]} d={8} size={v ? 72 : 64} /></div>
      <div style={{ perspective: v ? 2400 : 2600, width: "100%", height: "100%", display: "grid", placeItems: "center", marginTop: v ? 260 : 170 }}>
        <div style={{ transformStyle: "preserve-3d", transform: `translateZ(${-R}px) rotateX(-6deg) rotateY(${rot}deg)`, position: "relative", width: w, height: h }}>
          {shots.map((s, i) => {
            const a = (360 / shots.length) * i;
            return <div key={i} style={{ position: "absolute", inset: 0, transform: `rotateY(${a}deg) translateZ(${R}px)`, backfaceVisibility: "hidden" }}><Screen src={s} w={w} h={h} /></div>;
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Pista: React.FC = () => {
  const f = useCurrentFrame(); const v = useIsV();
  const w = v ? 900 : 1100;
  const imgH = w * (13414 / 2880);
  const scroll = ease(f, 0, 3 * C_BAR, 0, imgH * 0.72, theme.ease.soft);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: v ? 230 : 80, width: "100%", zIndex: 2 }}><Title kicker="Uma página" lines={[["Todo o estado,", false], ["do litoral ao sertão.", true]]} d={10} size={v ? 84 : 74} /></div>
      <div style={{ position: "absolute", bottom: v ? -260 : -40, perspective: v ? 1100 : 1400, width: "100%", display: "grid", justifyItems: "center" }}>
        <div style={{ width: w, height: v ? 1500 : 1050, overflow: "hidden", borderRadius: 18, transform: `rotateX(${v ? 52 : 50}deg)`, transformOrigin: "50% 100%", boxShadow: "0 0 140px rgba(60,70,163,0.55)", maskImage: "linear-gradient(transparent 0%, black 30%)", WebkitMaskImage: "linear-gradient(transparent 0%, black 30%)" }}>
          <Img src={staticFile("img/site-full.jpg")} style={{ width: w, transform: `translateY(${-scroll}px)` }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Numeros: React.FC = () => {
  const f = useCurrentFrame(); const v = useIsV();
  const data: [number, string][] = [[14, "comissões temáticas"], [12, "diretorias regionais"], [38, "projetos no acervo"]];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: v ? "column" : "row", gap: v ? 70 : 140, alignItems: "center" }}>
        {data.map(([n, l], i) => {
          const d = 8 + i * C_BEAT;
          const val = Math.round(ease(f, d, d + 50, 0, n, theme.ease.out));
          const p = useSp(d);
          return (
            <div key={l} style={{ display: "grid", justifyItems: "center", gap: 8, opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>
              <div style={{ ...disp(v ? 230 : 220, { fontVariantNumeric: "tabular-nums", backgroundImage: "linear-gradient(180deg, #fff 30%, #9ea3c8)", WebkitBackgroundClip: "text", color: "transparent" }) }}>{val}</div>
              <div style={{ width: ease(f, d + 10, d + 40, 0, 120, theme.ease.out), height: 2, background: K.gold }} />
              <div style={caps(20, { color: K.text })}>{l}</div>
            </div>
          );
        })}
      </div>
      <LightSweep at={30} dur={60} angle={-15} />
    </AbsoluteFill>
  );
};

const Portal: React.FC = () => {
  const f = useCurrentFrame(); const v = useIsV();
  const z = ease(f, 0, C_BAR, 0.8, 1.06, theme.ease.soft);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: `radial-gradient(circle at 50% 50%, rgba(244,210,31,${ease(f, 0, 30, 0, 0.12)}), transparent 45%)` }}>
      <div style={{ transform: `scale(${z})` }}><Title kicker="E para quem faz a ANOREG" lines={[["Área de", false], ["membros.", true]]} d={4} size={v ? 160 : 170} /></div>
    </AbsoluteFill>
  );
};

/** Painel em "vista explodida": camadas recortadas da captura saltam em profundidade */
const Explodido: React.FC = () => {
  const f = useCurrentFrame(); const v = useIsV();
  const W = v ? 940 : 1300, H = W * (3656 / 2880);
  const viewH = v ? 1050 : 760;
  const sep = ease(f, C_BEAT * 2, C_BAR * 1.6, 0, 1, theme.ease.inOut);
  const ry = ease(f, 0, 3 * C_BAR, v ? -18 : -24, v ? 10 : 14, theme.ease.soft);
  // recortes: [x,y,w,h] em fração da imagem
  const parts: [number, number, number, number, string][] = [[0.22, 0.06, 0.755, 0.17, "Boas-vindas e nível"], [0.22, 0.24, 0.755, 0.065, "Indicadores"], [0.22, 0.33, 0.41, 0.24, "Metas com pontos"], [0.645, 0.6, 0.33, 0.165, "Selos"]];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", top: v ? 200 : 70, left: v ? 0 : 110, right: v ? 0 : undefined }}><Title kicker="Seu painel" lines={[["Cada informação", false], ["no seu lugar.", true]]} d={6} size={v ? 78 : 66} align={v ? "center" : "left"} /></div>
      <div style={{ perspective: 2200, marginTop: v ? 260 : 120, marginLeft: v ? 0 : 340 }}>
        <div style={{ position: "relative", width: W, height: viewH, transformStyle: "preserve-3d", transform: `rotateX(${10 + sep * 6}deg) rotateY(${ry}deg) scale(${v ? 0.95 : 0.85})` }}>
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 16, boxShadow: "0 60px 120px -30px rgba(0,0,0,0.9)", filter: `brightness(${1 - sep * 0.45})` }}>
            <Img src={staticFile("img/portal-painel.jpg")} style={{ width: W }} />
          </div>
          {parts.map(([x, y, w, h, label], i) => {
            const pz = ease(f, C_BEAT * 2 + i * 8, C_BAR * 1.4 + i * 8, 0, 1, theme.ease.out);
            if (y * H > viewH) return null;
            return (
              <div key={i} style={{ position: "absolute", left: x * W, top: y * H, width: w * W, height: Math.min(h * H, viewH - y * H), transform: `translateZ(${pz * (90 + i * 45)}px)`, borderRadius: 12, overflow: "hidden", boxShadow: pz > 0.05 ? `0 ${30 * pz}px ${60 * pz}px -10px rgba(0,0,0,0.7), 0 0 0 ${2 * pz}px rgba(244,210,31,${0.6 * pz})` : undefined }}>
                <Img src={staticFile("img/portal-painel.jpg")} style={{ position: "absolute", width: W, left: -x * W, top: -y * H }} />
                <div style={{ position: "absolute", left: 12, top: 12, padding: "6px 12px", borderRadius: 99, background: K.gold, ...caps(13, { color: K.bg, letterSpacing: "0.12em" }), opacity: ease(f, C_BAR * 1.2 + i * 10, C_BAR * 1.4 + i * 10, 0, 1) }}>{label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const JornadaC: React.FC = () => {
  const f = useCurrentFrame(); const v = useIsV();
  const pts = ease(f, 10, C_BAR * 1.8, 0, 320, theme.ease.soft);
  const lvl = pts >= 300 ? 3 : pts >= 120 ? 2 : 1;
  const fl = [0, 120, 300, 550];
  const pct = (pts - fl[lvl - 1]) / (fl[lvl] - fl[lvl - 1]);
  const seals = ["flag", "bell", "cap", "seal", "pen", "calendar", "book", "users"];
  const orbit = f * 0.6;
  const R = v ? 380 : 380;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", top: v ? 210 : 70, width: "100%" }}><Title kicker="Minha jornada" lines={[["Participação que se reconhece.", false]]} d={4} size={v ? 70 : 62} /></div>
      <div style={{ position: "relative", width: R * 2 + 200, height: R * 2 + 200, display: "grid", placeItems: "center", marginTop: v ? 160 : 90, transform: v ? "scale(0.95)" : "scale(0.92)" }}>
        <Ring pct={Math.min(1, pct)} size={380} stroke={14}>
          <div><div style={{ ...disp(120, { fontVariantNumeric: "tabular-nums" }) }}>{Math.round(pts)}</div><div style={caps(18)}>pontos · nível {lvl}</div></div>
        </Ring>
        {seals.map((s, i) => {
          const a = ((360 / seals.length) * i + orbit) * Math.PI / 180;
          const p = useSp(20 + i * 6);
          const earned = f > 30 + i * 22;
          const depth = Math.sin(a);
          return <div key={s} style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-50%,-50%) translate(${Math.cos(a) * R * p}px, ${depth * R * 0.42 * p}px) scale(${0.75 + 0.3 * (depth + 1) / 2})`, zIndex: depth > 0 ? 3 : 1, opacity: p * (0.55 + 0.45 * (depth + 1) / 2) }}><Seal icon={s} earned={earned} size={130} /></div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

const Celulares: React.FC = () => {
  const f = useCurrentFrame(); const v = useIsV();
  const shots = ["img/mob-home.jpg", "img/mob-painel.jpg", "img/mob-jornada.jpg"];
  const ry = ease(f, 0, 2 * C_BAR, 25, -15, theme.ease.soft);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", top: v ? 220 : 70, width: "100%" }}><Title kicker="Em qualquer tela" lines={[["Pronto para o celular.", false]]} d={4} size={v ? 80 : 66} /></div>
      <div style={{ perspective: 2000, marginTop: v ? 200 : 140 }}>
        <div style={{ display: "flex", gap: v ? 30 : 70, transformStyle: "preserve-3d", transform: `rotateY(${ry}deg) rotateX(6deg)` }}>
          {shots.map((s, i) => { const p = useSp(8 + i * 8); return <div key={s} style={{ transform: `translateZ(${(i === 1 ? 120 : 0)}px) translateY(${(1 - p) * 200 + Math.sin((f + i * 25) / 30) * 8}px)`, opacity: p }}><Reflect><Phone src={s} height={v ? 760 : 640} /></Reflect></div>; })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Final: React.FC = () => {
  const f = useCurrentFrame(); const v = useIsV();
  const p = ease(f, 6, 50, 0, 1, theme.ease.soft);
  const fade = ease(f, 2 * C_BAR - 50, 2 * C_BAR - 4, 0, 1);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: v ? 70 : 54 }}>
      <div style={{ padding: "30px 44px", background: "#fff", borderRadius: 18, opacity: p, transform: `scale(${0.94 + p * 0.06})`, boxShadow: "0 0 140px rgba(244,210,31,0.18)" }}><Img src={staticFile("img/logo.jpg")} style={{ width: v ? 600 : 520 }} /></div>
      <Title lines={[["Conectando cartórios.", false], ["Fortalecendo a cidadania.", true]]} d={C_BEAT * 2} size={v ? 84 : 80} />
      <LightSweep at={10} dur={60} />
      <AbsoluteFill style={{ background: K.bg, opacity: fade }} />
    </AbsoluteFill>
  );
};

const SCENES: [React.FC, number, number][] = [
  [Abertura, 0, 3], [Carrossel, 3, 3], [Pista, 6, 3], [Numeros, 9, 2], [Portal, 11, 1], [Explodido, 12, 3], [JornadaC, 15, 3], [Celulares, 18, 2], [Final, 20, 2],
];
export const StyleC: React.FC = () => (
  <AbsoluteFill style={{ background: K.bg }}>
    <Space />
    {SCENES.map(([S, a, n], i) => <Sequence key={i} from={a * C_BAR} durationInFrames={n * C_BAR}>{i === SCENES.length - 1 ? <S /> : <Fade dur={n * C_BAR}><S /></Fade>}</Sequence>)}
    <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,8,0.6) 100%)" }} />
    <AbsoluteFill style={{ pointerEvents: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`, opacity: 0.07, mixBlendMode: "overlay" }} />
    {/* barras de cinema na versão horizontal */}
    <Letterbox />
    <Audio src={staticFile("music-c.wav")} />
  </AbsoluteFill>
);
const Letterbox: React.FC = () => { const v = useIsV(); if (v) return null; return <><div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 40, background: "#000" }} /><div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 40, background: "#000" }} /></>; };

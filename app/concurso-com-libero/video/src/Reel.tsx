import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, Img, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";

const FPS = 30;
const s = (sec: number) => Math.round(sec * FPS);
// linha do tempo (segundos)
const CENAS = [
  { id: "hoje", ini: 3.0, olho: "Tela simples", titulo: ["Uma coisa", "de cada vez."], destaque: 1, sub: "Feito para quem perde o foco fácil.", telas: [["hoje", 0]], tilt: -7, selo: { t: "6 dias seguidos", k: "fogo", lado: "d", y: 300 } },
  { id: "foco", ini: 7.6, olho: "Modo foco", titulo: ["25 minutos.", "Só isso."], destaque: 0, sub: "Um toque e o cronômetro começa.", telas: [["foco", 0]], tilt: 6, selo: null },
  { id: "check", ini: 11.0, olho: "Checklist do edital", titulo: ["O edital inteiro", "em caixinhas."], destaque: 1, sub: "53 tópicos do TJ-SP · Escrevente.", telas: [["checklist", 0]], tilt: -5, selo: { t: "Edital 02/2026", k: "doc", lado: "d", y: 830 } },
  { id: "dicas", ini: 14.8, olho: "Dicas do edital", titulo: ["Role e revise", "em 2 minutos."], destaque: 1, sub: "Lei seca, conceitos e pegadinhas da banca.", telas: [["dica1", 0], ["dica2", 1.35], ["dica3", 2.7]], tilt: 5, selo: null },
  { id: "quest", ini: 19.2, olho: "Questões comentadas", titulo: ["Cada alternativa", "explicada."], destaque: 1, sub: "No estilo da VUNESP, com o artigo da lei.", telas: [["questao", 0], ["correcao", 1.3]], tilt: -6, selo: null },
  { id: "rev", ini: 23.2, olho: "Revisão inteligente", titulo: ["O que você errou", "volta no dia certo."], destaque: 1, sub: "Errou, volta amanhã. Acertou, o intervalo aumenta.", telas: [["caderno", 0]], tilt: 4, selo: { t: "Volta em 4 dias", k: "ciclo", lado: "d", y: 520 } },
] as const;
const FIM_CENAS = 26.8;
export const TOTAL = s(31);

const useFonts = () => {
  const [h] = useState(() => delayRender("fontes"));
  useEffect(() => {
    const a = new FontFace("Manrope", `url(${staticFile("manrope.woff2")})`, { weight: "500 800" });
    const b = new FontFace("DM Sans", `url(${staticFile("dmsans.woff2")})`, { weight: "400 700" });
    Promise.all([a.load(), b.load()]).then((fs) => { fs.forEach((f) => (document as any).fonts.add(f)); continueRender(h); }).catch(() => continueRender(h));
  }, [h]);
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Fundo: React.FC = () => {
  const f = useCurrentFrame();
  const d1 = Math.sin(f / 55) * 60, d2 = Math.cos(f / 70) * 50;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(170deg, ${theme.colors.bgAlt}, ${theme.colors.bg} 70%)` }}>
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${theme.colors.grid} 2px, transparent 2px), linear-gradient(90deg, ${theme.colors.grid} 2px, transparent 2px)`, backgroundSize: "72px 72px", backgroundPosition: `${-(f * 0.35) % 72}px ${-(f * 0.6) % 72}px` }} />
      <div style={{ position: "absolute", width: 1300, height: 1300, borderRadius: "50%", top: -520, left: -380 + d1, filter: "blur(60px)", background: `radial-gradient(circle, ${theme.colors.accent}66, transparent 62%)` }} />
      <div style={{ position: "absolute", width: 1100, height: 1100, borderRadius: "50%", bottom: -420, right: -360 - d2, filter: "blur(80px)", background: `radial-gradient(circle, ${theme.colors.primary}2e, transparent 65%)` }} />
    </AbsoluteFill>
  );
};
const Grao: React.FC = () => {
  const f = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return <AbsoluteFill style={{ pointerEvents: "none", backgroundImage: noise, backgroundSize: "220px", backgroundPosition: `${(f * 7) % 220}px ${(f * 13) % 220}px`, opacity: 0.07, mixBlendMode: "overlay" }} />;
};
const Vinheta: React.FC = () => <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.32) 100%)" }} />;

const Palavras: React.FC<{ texto: string; atraso: number; cor?: string }> = ({ texto, atraso, cor }) => {
  const f = useCurrentFrame();
  return (
    <span style={{ display: "inline-flex", flexWrap: "wrap", columnGap: 22, color: cor }}>
      {texto.split(" ").map((w, i) => {
        const p = spring({ frame: f - atraso - i * 3, fps: FPS, config: theme.spring.snappy });
        return <span key={i} style={{ display: "inline-block", opacity: p, transform: `translateY(${interpolate(p, [0, 1], [46, 0])}px) scale(${interpolate(p, [0, 1], [0.92, 1])})` }}>{w}</span>;
      })}
    </span>
  );
};

const Icone: React.FC<{ k: string }> = ({ k }) => {
  const c = { fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={40} height={40} viewBox="0 0 24 24" {...c}>
      {k === "fogo" && <path d="M12 3c1 3 4 4.500 4 8.500a4 4 0 0 1-8 0c0-1.500.600-2.500 1.300-3.300C9.500 10 11 9 12 3z" />}
      {k === "doc" && <><path d="M7 3h7l4 4v14H7z" /><path d="M10 12h5M10 16h5" /></>}
      {k === "ciclo" && <><path d="M20 12a8 8 0 1 1-2.600-5.900" /><path d="M20 4v5h-5" /></>}
    </svg>
  );
};

const Legenda: React.FC<{ c: (typeof CENAS)[number]; fim: number }> = ({ c, fim }) => {
  const f = useCurrentFrame();
  const ini = s(c.ini);
  if (f < ini - 2 || f > fim + 2) return null;
  const sai = interpolate(f, [fim - 9, fim], [0, 1], { ...clamp, easing: theme.ease.in });
  const pO = spring({ frame: f - ini - 2, fps: FPS, config: theme.spring.snappy });
  const pS = spring({ frame: f - ini - 16, fps: FPS, config: theme.spring.smooth });
  return (
    <div style={{ position: "absolute", left: 84, right: 84, top: 236, opacity: 1 - sai, transform: `translateY(${-30 * sai}px)` }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "12px 24px", borderRadius: 999, background: "rgba(180,247,223,0.14)", border: `2px solid rgba(180,247,223,0.35)`, color: theme.colors.primary, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, letterSpacing: 3.5, textTransform: "uppercase", opacity: pO, transform: `translateX(${interpolate(pO, [0, 1], [-40, 0])}px) scale(${interpolate(pO, [0, 1], [0.9, 1])})` }}>
        <span style={{ width: 14, height: 14, borderRadius: 7, background: theme.colors.primary }} />{c.olho}
      </div>
      <div style={{ marginTop: 26, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 92, lineHeight: 1.04, letterSpacing: -3.5, color: theme.colors.text }}>
        {c.titulo.map((l, i) => <div key={i}><Palavras texto={l} atraso={ini + 5 + i * 7} cor={i === c.destaque ? theme.colors.primary : undefined} /></div>)}
      </div>
      <div style={{ marginTop: 22, fontFamily: theme.fonts.body, fontWeight: 500, fontSize: 38, lineHeight: 1.3, color: theme.colors.textDim, opacity: pS, transform: `translateY(${interpolate(pS, [0, 1], [24, 0])}px)` }}>{c.sub}</div>
    </div>
  );
};

const PW = 640, PH = Math.round((PW * 844) / 390), PTOP = 668;
const Celular: React.FC = () => {
  const f = useCurrentFrame();
  const ini = s(CENAS[0].ini), fim = s(FIM_CENAS);
  const entra = spring({ frame: f - ini + 6, fps: FPS, config: theme.spring.smooth });
  const sai = interpolate(f, [fim - 12, fim + 2], [0, 1], { ...clamp, easing: theme.ease.in });
  let tilt = CENAS[0].tilt as number;
  for (let i = 1; i < CENAS.length; i++) tilt += (CENAS[i].tilt - CENAS[i - 1].tilt) * spring({ frame: f - s(CENAS[i].ini) + 4, fps: FPS, config: theme.spring.smooth });
  const flut = Math.sin(f / 26) * 9;
  const telas: { nome: string; em: number }[] = [];
  CENAS.forEach((c) => c.telas.forEach(([n, d]) => telas.push({ nome: n as string, em: s(c.ini + (d as number)) })));
  return (
    <div style={{ position: "absolute", left: (1080 - PW) / 2, top: PTOP, width: PW, height: PH, opacity: entra * (1 - sai), transform: `perspective(2200px) translateY(${interpolate(entra, [0, 1], [520, 0]) + flut + sai * 260}px) rotateY(${tilt}deg) rotateX(${interpolate(entra, [0, 1], [14, 3])}deg) scale(${interpolate(entra, [0, 1], [0.9, 1]) - sai * 0.08})` }}>
      <div style={{ position: "absolute", inset: -40, borderRadius: 110, background: `radial-gradient(ellipse at 50% 40%, ${theme.colors.primary}40, transparent 68%)`, filter: "blur(50px)" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 78, background: "#0B1513", boxShadow: "0 60px 120px -30px rgba(0,0,0,0.75), 0 0 0 3px rgba(255,255,255,0.14) inset, 0 0 0 2px #000", padding: 16 }}>
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 62, overflow: "hidden", background: "#fff" }}>
          {telas.map((t, i) => {
            const prox = telas[i + 1];
            if (f < t.em - 8 || (prox && f > prox.em + 30)) return null;
            const p = i === 0 ? 1 : spring({ frame: f - t.em + 6, fps: FPS, config: { damping: 22, stiffness: 120, mass: 0.9 } });
            const some = prox ? spring({ frame: f - prox.em + 6, fps: FPS, config: { damping: 22, stiffness: 120, mass: 0.9 } }) : 0;
            const kb = interpolate(f - t.em, [0, 150], [1, 1.035], { ...clamp, easing: theme.ease.inOut });
            return <Img key={t.nome} src={staticFile(`telas/${t.nome}.png`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transformOrigin: "50% 30%", transform: `translateY(${(1 - p) * 100 - some * 14}%) scale(${kb - some * 0.05})`, filter: `brightness(${1 - some * 0.35})` }} />;
          })}
          <AbsoluteFill style={{ background: "linear-gradient(115deg, rgba(255,255,255,0.16) 0%, transparent 28%)", pointerEvents: "none" }} />
        </div>
      </div>
    </div>
  );
};

const Selos: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      {CENAS.map((c, i) => {
        if (!c.selo) return null;
        const ini = s(c.ini) + 34, fim = s(i + 1 < CENAS.length ? CENAS[i + 1].ini : FIM_CENAS) - 6;
        if (f < ini - 2 || f > fim + 2) return null;
        const p = spring({ frame: f - ini, fps: FPS, config: theme.spring.bouncy });
        const sai = interpolate(f, [fim - 8, fim], [0, 1], { ...clamp, easing: theme.ease.in });
        const dir = c.selo.lado === "d";
        return (
          <div key={c.id} style={{ position: "absolute", top: PTOP + c.selo.y + Math.sin(f / 18) * 7, ...(dir ? { right: 40 } : { left: 40 }), display: "flex", alignItems: "center", gap: 14, padding: "20px 30px 20px 22px", borderRadius: 30, background: "#fff", color: theme.colors.ink, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, letterSpacing: -0.5, boxShadow: "0 30px 60px -18px rgba(0,0,0,0.55)", opacity: p * (1 - sai), transform: `translateX(${interpolate(p, [0, 1], [dir ? 120 : -120, 0])}px) rotate(${interpolate(p, [0, 1], [dir ? 10 : -10, dir ? 3 : -3])}deg) scale(${interpolate(p, [0, 1], [0.6, 1]) - sai * 0.2})` }}>
            <span style={{ width: 64, height: 64, borderRadius: 20, display: "grid", placeItems: "center", background: c.selo.k === "fogo" ? "#FFF0DF" : "#E4F3EB", color: c.selo.k === "fogo" ? "#C2540A" : "#087B63" }}><Icone k={c.selo.k} /></span>
            {c.selo.t}
          </div>
        );
      })}
    </>
  );
};

const Progresso: React.FC = () => {
  const f = useCurrentFrame();
  const ini = s(CENAS[0].ini), fim = s(FIM_CENAS);
  if (f < ini || f > fim) return null;
  const op = interpolate(f, [ini, ini + 12, fim - 10, fim], [0, 1, 1, 0], { ...clamp, easing: theme.ease.out });
  return (
    <div style={{ position: "absolute", top: 168, left: 84, right: 84, display: "flex", gap: 10, opacity: op }}>
      {CENAS.map((c, i) => {
        const a = s(c.ini), b = s(i + 1 < CENAS.length ? CENAS[i + 1].ini : FIM_CENAS);
        const w = interpolate(f, [a, b], [0, 100], { ...clamp, easing: theme.ease.inOut });
        return <div key={c.id} style={{ flex: 1, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.2)", overflow: "hidden" }}><div style={{ width: `${w}%`, height: "100%", background: theme.colors.primary, borderRadius: 4 }} /></div>;
      })}
    </div>
  );
};

const Abertura: React.FC = () => {
  const f = useCurrentFrame();
  const fim = s(3.0);
  const pL = spring({ frame: f - 3, fps: FPS, config: theme.spring.bouncy });
  const sai = interpolate(f, [fim - 10, fim], [0, 1], { ...clamp, easing: theme.ease.in });
  const pS = spring({ frame: f - 40, fps: FPS, config: theme.spring.smooth });
  const anel = interpolate(f, [4, 44], [0.4, 2.4], { ...clamp, easing: theme.ease.out });
  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: "0 84px", opacity: 1 - sai, transform: `translateY(${-60 * sai}px) scale(${1 - sai * 0.05})` }}>
      <div style={{ position: "relative", width: 190, height: 190, marginBottom: 56 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 48, border: `4px solid ${theme.colors.primary}`, opacity: interpolate(anel, [0.4, 2.4], [0.7, 0]), transform: `scale(${anel})` }} />
        <Img src={staticFile("logo.png")} style={{ width: 190, height: 190, borderRadius: 46, boxShadow: "0 40px 80px -20px rgba(0,0,0,0.6)", opacity: pL, transform: `scale(${interpolate(pL, [0, 1], [0.3, 1])}) rotate(${interpolate(pL, [0, 1], [-18, 0])}deg) translateY(${Math.sin(f / 20) * 6}px)` }} />
      </div>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 118, lineHeight: 1.02, letterSpacing: -5, color: theme.colors.text }}>
        <div><Palavras texto="Seu edital vira" atraso={12} /></div>
        <div><Palavras texto="um plano de" atraso={22} cor={theme.colors.primary} /></div>
        <div><Palavras texto="estudo diário." atraso={30} cor={theme.colors.primary} /></div>
      </div>
      <div style={{ marginTop: 40, fontFamily: theme.fonts.body, fontWeight: 500, fontSize: 42, color: theme.colors.textDim, opacity: pS, transform: `translateY(${interpolate(pS, [0, 1], [26, 0])}px)` }}>Conheça o app Concurso com Líbero.</div>
    </AbsoluteFill>
  );
};

const Final: React.FC = () => {
  const f = useCurrentFrame() ;
  const ini = s(FIM_CENAS) - 2, l = f - ini;
  if (l < 0) return null;
  const pL = spring({ frame: l - 4, fps: FPS, config: theme.spring.bouncy });
  const itens = ["Plano de estudo do seu edital", "Questões comentadas e revisão", "Funciona sem internet"];
  const pB = spring({ frame: l - 58, fps: FPS, config: theme.spring.snappy });
  const pulso = 1 + Math.sin(l / 9) * 0.018;
  const fade = interpolate(f, [TOTAL - 8, TOTAL - 1], [1, 0], { ...clamp, easing: theme.ease.in });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 84px", opacity: fade }}>
      <Img src={staticFile("logo.png")} style={{ width: 230, height: 230, borderRadius: 56, boxShadow: "0 50px 100px -24px rgba(0,0,0,0.65)", opacity: pL, transform: `scale(${interpolate(pL, [0, 1], [0.3, 1])}) translateY(${Math.sin(l / 20) * 7}px)` }} />
      <div style={{ marginTop: 50, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 104, lineHeight: 1.02, letterSpacing: -4.5, color: theme.colors.text, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div><Palavras texto="Concurso" atraso={ini + 12} /></div>
        <div><Palavras texto="com Líbero" atraso={ini + 17} cor={theme.colors.primary} /></div>
      </div>
      <div style={{ marginTop: 54, display: "flex", flexDirection: "column", gap: 18, alignItems: "stretch", width: 760 }}>
        {itens.map((t, i) => {
          const p = spring({ frame: l - 30 - i * 5, fps: FPS, config: theme.spring.snappy });
          return (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 20, padding: "22px 28px", borderRadius: 26, background: "rgba(255,255,255,0.09)", border: "2px solid rgba(255,255,255,0.14)", fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 38, color: theme.colors.text, opacity: p, transform: `translateX(${interpolate(p, [0, 1], [-70, 0])}px) scale(${interpolate(p, [0, 1], [0.94, 1])})` }}>
              <span style={{ width: 50, height: 50, borderRadius: 25, background: theme.colors.primary, color: theme.colors.ink, display: "grid", placeItems: "center", flex: "none" }}>
                <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.500 4.500 4.500L19 7.500" /></svg>
              </span>{t}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 54, padding: "30px 60px", borderRadius: 999, background: theme.colors.primary, color: theme.colors.ink, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, letterSpacing: -1, boxShadow: `0 30px 70px -20px ${theme.colors.primary}80`, opacity: pB, transform: `translateY(${interpolate(pB, [0, 1], [50, 0])}px) scale(${interpolate(pB, [0, 1], [0.85, 1]) * pulso})` }}>TJ-SP · Escrevente já no app</div>
      <div style={{ marginTop: 30, fontFamily: theme.fonts.body, fontWeight: 500, fontSize: 32, color: theme.colors.textDim, opacity: pB }}>App para Android · versão de teste</div>
    </AbsoluteFill>
  );
};

export const Reel: React.FC = () => {
  useFonts();
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const vol = interpolate(f, [0, 8, durationInFrames - 24, durationInFrames - 1], [0, 0.9, 0.9, 0], clamp);
  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      <Fundo />
      <Sequence durationInFrames={s(3.0) + 2}><Abertura /></Sequence>
      <Progresso />
      <Celular />
      <Selos />
      {CENAS.map((c, i) => <Legenda key={c.id} c={c} fim={s(i + 1 < CENAS.length ? CENAS[i + 1].ini : FIM_CENAS) - 2} />)}
      <Final />
      <AbsoluteFill style={{ pointerEvents: "none", backgroundColor: theme.colors.accent, mixBlendMode: "soft-light", opacity: 0.12 }} />
      <Grao />
      <Vinheta />
      <Audio src={staticFile("musica.mp3")} volume={vol} />
    </AbsoluteFill>
  );
};

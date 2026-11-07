/* Estilo B · Dinâmico editorial: fundo claro, tipografia gigante no tempo, cortes secos e cortinas. 120 BPM. */
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";
import { Browser, Card, Phone, Seal, clamp, useIsV } from "./components";

export const B_BEAT = 15, B_BAR = 60, B_TOTAL = 22 * 60;
const C = { paper: "#f4f2ec", ink: "#121535", navy: "#1b2270", gold: "#f4d21f", mute: "#6b6f86", line: "rgba(18,21,53,0.10)" };
const disp = (s: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ fontFamily: theme.fonts.display, fontWeight: 400, fontSize: s, lineHeight: 0.98, letterSpacing: "-0.035em", color: C.ink, ...extra });
const sans = (s: number, w = 800, extra: React.CSSProperties = {}): React.CSSProperties => ({ fontFamily: theme.fonts.body, fontWeight: w, fontSize: s, color: C.ink, ...extra });

const useSp = (d: number, cfg: keyof typeof theme.spring = "snappy") => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return spring({ frame: f - d, fps, config: theme.spring[cfg] }); };
/** "punch" no tempo: pequeno zoom a cada batida */
const usePunch = (every = B_BEAT, amt = 0.025) => { const f = useCurrentFrame(); const k = (f % every) / every; return 1 + amt * Math.exp(-k * 6); };

const PaperBg: React.FC = () => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const off = (f * 0.6) % 80;
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`, backgroundSize: "80px 80px", backgroundPosition: `${off}px ${off}px`, opacity: 0.55 }} />
      <div style={{ position: "absolute", width: Math.max(width, height) * 0.8, height: Math.max(width, height) * 0.8, borderRadius: "50%", right: -width * 0.25, bottom: -height * 0.35, background: "radial-gradient(circle, rgba(244,210,31,0.16), transparent 62%)" }} />
    </AbsoluteFill>
  );
};
const Grain: React.FC = () => {
  const f = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return <AbsoluteFill style={{ backgroundImage: noise, backgroundSize: "220px", backgroundPosition: `${(f * 7) % 220}px ${(f * 13) % 220}px`, opacity: 0.07, mixBlendMode: "multiply", pointerEvents: "none" }} />;
};

/** Cortina de transição: bloco marinho e faixa dourada varrendo a tela */
const Wipe: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame(); const v = useIsV();
  const p = interpolate(f, [at - 8, at + 6], [0, 1], { ...clamp, easing: theme.ease.inOut });
  if (p <= 0 || p >= 1) return null;
  const x = interpolate(p, [0, 1], [-110, 110]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "-20%", bottom: "-20%", left: `${x - 10}%`, width: "70%", background: C.navy, transform: `skewX(${v ? -8 : -14}deg)` }} />
      <div style={{ position: "absolute", top: "-20%", bottom: "-20%", left: `${x + 58}%`, width: "6%", background: C.gold, transform: `skewX(${v ? -8 : -14}deg)` }} />
    </AbsoluteFill>
  );
};

const Exit: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [dur - 7, dur], [0, 1], { ...clamp, easing: theme.ease.in });
  return <AbsoluteFill style={{ opacity: 1 - t * 0.9, transform: `scale(${1 + t * 0.08})` }}>{children}</AbsoluteFill>;
};

const Slam: React.FC<{ text: string; d: number; size: number; italic?: boolean; gold?: boolean; style?: React.CSSProperties }> = ({ text, d, size, italic, gold, style }) => {
  const p = useSp(d, "bouncy");
  const f = useCurrentFrame();
  if (f < d) return null;
  return (
    <div style={{ ...disp(size, { fontStyle: italic ? "italic" : "normal" }), position: "relative", display: "inline-block", opacity: interpolate(p, [0, 0.3], [0, 1], clamp), transform: `scale(${interpolate(p, [0, 1], [1.5, 1])})`, filter: `blur(${interpolate(p, [0, 0.5], [12, 0], clamp)}px)`, ...style }}>
      {gold && <span style={{ position: "absolute", left: "-2%", right: "-2%", bottom: "8%", height: "22%", background: C.gold, zIndex: -1, transformOrigin: "0 50%", transform: `scaleX(${interpolate(p, [0.3, 1], [0, 1], clamp)})` }} />}
      {text}
    </div>
  );
};
const Tag: React.FC<{ children: React.ReactNode; d: number; dark?: boolean; size?: number }> = ({ children, d, dark, size = 24 }) => {
  const p = useSp(d);
  return <div style={{ ...sans(size, 800, { letterSpacing: "0.16em", textTransform: "uppercase", color: dark ? "#fff" : C.navy }), display: "inline-flex", justifySelf: "start", width: "fit-content", alignItems: "center", gap: 14, padding: "10px 18px", background: dark ? C.navy : "#fff", border: `2px solid ${C.navy}`, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [20, 0])}px)` }}>{children}</div>;
};

/* ---- Cenas ---- */
const Intro: React.FC = () => {
  const f = useCurrentFrame(); const v = useIsV();
  const words = ["Cartórios.", "Pessoas.", "Cidadania.", "Pernambuco."];
  const i = Math.min(3, Math.floor(f / B_BEAT));
  const show = f < B_BEAT * 4;
  const p = useSp(B_BEAT * 4, "smooth");
  const punch = usePunch(B_BEAT, 0.06);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {show ? (
        <div style={{ transform: `scale(${punch})` }}>
          <Slam key={i} text={words[i]} d={i * B_BEAT} size={v ? 190 : 260} italic={i % 2 === 1} gold={i === 3} />
        </div>
      ) : (
        <div style={{ display: "grid", justifyItems: "center", gap: v ? 50 : 40, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)` }}>
          <div style={{ background: "#fff", padding: "34px 46px", boxShadow: "18px 18px 0 #1b2270" }}><Img src={staticFile("img/logo.jpg")} style={{ width: v ? 600 : 560 }} /></div>
          <Tag d={B_BEAT * 5} dark size={v ? 26 : 24}>Um novo portal</Tag>
        </div>
      )}
    </AbsoluteFill>
  );
};

const SiteSplit: React.FC = () => {
  const v = useIsV(); const f = useCurrentFrame();
  const panel = useSp(0, "smooth");
  const z = interpolate(f, [0, 2 * B_BAR], [1.0, 1.12], { ...clamp, easing: theme.ease.soft });
  return (
    <AbsoluteFill style={{ flexDirection: v ? "column" : "row" }}>
      <div style={{ flex: v ? "0 0 42%" : "0 0 42%", background: C.navy, display: "grid", alignContent: "center", padding: v ? "0 80px" : "0 100px", gap: 26, transform: v ? `translateY(${interpolate(panel, [0, 1], [-100, 0])}%)` : `translateX(${interpolate(panel, [0, 1], [-100, 0])}%)` }}>
        <Tag d={6}>O site público</Tag>
        <Slam text="Novo." d={10} size={v ? 200 : 210} style={{ color: "#fff" }} />
        <Slam text="Claro." d={10 + B_BEAT} size={v ? 200 : 210} italic style={{ color: C.gold }} />
        <Slam text="Seu." d={10 + B_BEAT * 2} size={v ? 200 : 210} style={{ color: "#fff" }} />
      </div>
      <div style={{ flex: 1, position: "relative", overflow: "hidden", display: "grid", placeItems: "center" }}>
        <div style={{ transform: `scale(${z * usePunch(B_BEAT * 2, 0.015)})` }}>
          <Browser src="img/site-hero.jpg" width={v ? 960 : 1040} height={v ? 600 : 650} zoom={[1, 1]} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Mosaic: React.FC = () => {
  const v = useIsV(); const f = useCurrentFrame();
  const tiles = ["img/sec-noticias.png", "img/sec-cidadania.png", "img/sec-comissoes.png", "img/sec-academia.png", "img/portal-painel-top.jpg", "img/portal-jornada-top.jpg"];
  const cols = v ? 2 : 3, tw = v ? 470 : 540, th = v ? 340 : 330, gap = 24;
  const zoomIn = interpolate(f, [B_BAR + 20, 2 * B_BAR - 4], [1, 2.55], { ...clamp, easing: theme.ease.inOut });
  const target = 2; // comissões
  const tx = ((target % cols) - (cols - 1) / 2) * (tw + gap), ty = (Math.floor(target / cols) - (Math.ceil(tiles.length / cols) - 1) / 2) * (th + gap);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", top: v ? 140 : 70, left: v ? 70 : 100, zIndex: 3, opacity: interpolate(zoomIn, [1, 1.3], [1, 0], clamp) }}>
        <Slam text="Tudo num só lugar." d={4} size={v ? 96 : 92} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${tw}px)`, gap, transform: `scale(${zoomIn}) translate(${-tx * (zoomIn - 1) / zoomIn}px, ${-ty * (zoomIn - 1) / zoomIn}px)`, marginTop: v ? 120 : 110 }}>
        {tiles.map((s, i) => {
          const p = useSp(8 + i * 4, "bouncy");
          return <div key={s} style={{ width: tw, height: th, overflow: "hidden", background: "#fff", boxShadow: "10px 10px 0 rgba(27,34,112,0.9)", opacity: p, transform: `translateY(${interpolate(p, [0, 1], [80, 0])}px) rotate(${interpolate(p, [0, 1], [i % 2 ? 4 : -4, 0])}deg)` }}><Img src={staticFile(s)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0%" }} /></div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

const Cidadao: React.FC = () => {
  const v = useIsV(); const f = useCurrentFrame();
  const mx = interpolate(f, [0, 2 * B_BAR], [v ? 200 : 300, v ? -520 : -360], { ...clamp, easing: theme.ease.soft });
  const items = ["Encontre um cartório", "Certidões e registros", "Escrituras e procurações", "Consulta de protesto"];
  const idx = Math.min(3, Math.floor(f / (B_BEAT * 2)));
  return (
    <AbsoluteFill style={{ padding: v ? 80 : 100, justifyContent: "center", gap: v ? 60 : 40 }}>
      <div style={{ display: "grid", gap: 18 }}>
        <Tag d={0}>Para o cidadão</Tag>
        <div style={{ height: v ? 200 : 170, display: "flex", alignItems: "center" }}><Slam key={idx} text={items[idx]} d={idx * B_BEAT * 2} size={v ? 96 : 120} italic={idx % 2 === 1} /></div>
      </div>
      <div style={{ display: "flex", gap: 40, transform: `translateX(${mx}px)` }}>
        {["img/mob-servicos.jpg", "img/mob-home.jpg", "img/mob-servicos.jpg"].map((s, i) => {
          const p = useSp(4 + i * 4, "smooth");
          return <div key={i} style={{ opacity: p, transform: `translateY(${interpolate(p, [0, 1], [120, 0])}px) rotate(${(i - 1) * 3}deg)` }}><Phone src={s} height={v ? 820 : 560} scrollTo={i === 1 ? (v ? 260 : 180) : 0} start={10} end={100} /></div>;
        })}
        <div style={{ width: v ? 760 : 900, alignSelf: "center" }}><Card src="img/sec-cidadania.png" width={v ? 760 : 900} height={v ? 420 : 470} position="70% 30%" /></div>
      </div>
    </AbsoluteFill>
  );
};

const Numbers: React.FC = () => {
  const f = useCurrentFrame(); const v = useIsV();
  const data = [["14", "comissões temáticas"], ["12", "diretorias regionais"], ["38", "projetos no acervo"], ["184", "municípios, do litoral ao sertão"]];
  const i = Math.min(3, Math.floor(f / (B_BEAT * 2)));
  const p = useSp(i * B_BEAT * 2, "bouncy");
  const bg = i % 2 ? C.navy : C.paper;
  return (
    <AbsoluteFill style={{ background: bg, alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "grid", justifyItems: "center", gap: 10, transform: `scale(${usePunch(B_BEAT, 0.02)})` }}>
        <div style={{ ...disp(v ? 420 : 460, { color: i % 2 ? C.gold : C.ink, fontVariantNumeric: "tabular-nums" }), transform: `scale(${interpolate(p, [0, 1], [0.6, 1])})`, opacity: p }}>{data[i][0]}</div>
        <div style={{ ...sans(v ? 44 : 46, 700, { color: i % 2 ? "#fff" : C.ink }), opacity: p, transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)` }}>{data[i][1]}</div>
      </div>
    </AbsoluteFill>
  );
};

const Membros: React.FC = () => {
  const f = useCurrentFrame(); const v = useIsV();
  const x = interpolate(f, [0, B_BAR], [0, -900], { ...clamp, easing: theme.ease.soft });
  const row = (dir: number, out: boolean) => (
    <div style={{ display: "flex", gap: 60, whiteSpace: "nowrap", transform: `translateX(${dir * x - (dir < 0 ? 900 : 0)}px)` }}>
      {Array.from({ length: 4 }).map((_, i) => <span key={i} style={{ ...disp(v ? 210 : 230, { fontStyle: "italic", color: out ? "transparent" : C.gold, WebkitTextStroke: out ? "2px rgba(255,255,255,0.55)" : undefined }) }}>Área de membros</span>)}
    </div>
  );
  return (
    <AbsoluteFill style={{ background: C.navy, justifyContent: "center", gap: 10, overflow: "hidden" }}>
      {row(1, true)}{row(-1, false)}{row(1, true)}
    </AbsoluteFill>
  );
};

const PainelZoom: React.FC = () => {
  const f = useCurrentFrame(); const v = useIsV();
  const bw = v ? 980 : 1500, bh = v ? 1180 : 860;
  const W = bw, H = bw * (3656 / 2880);
  // [x, y] (fração da imagem), escala, legenda
  const targets: [number, number, number, string][] = [[0.5, (bh / 2) / H, 1, "Seu painel."], [0.42, 0.45, v ? 2.1 : 1.9, "Metas com pontos."], [0.8, 0.39, v ? 2.1 : 1.9, "Continue de onde parou."], [0.8, 0.67, v ? 2.2 : 2.0, "Selos conquistados."]];
  const segLen = B_BAR * 0.75;
  const seg = Math.min(3, Math.floor(f / segLen));
  const segStart = seg * segLen;
  const prev = targets[Math.max(0, seg - 1)], cur = targets[seg];
  const t = seg === 0 ? 1 : interpolate(f, [segStart, segStart + 14], [0, 1], { ...clamp, easing: theme.ease.inOut });
  const L = (a: number, b: number) => a + (b - a) * t;
  const sc = L(prev[2], cur[2]), fx = L(prev[0], cur[0]), fy = L(prev[1], cur[1]);
  const tx = bw / 2 - fx * W * sc, ty = bh / 2 - fy * H * sc;
  const cx = Math.min(0, Math.max(bw - W * sc, tx)), cy = Math.min(0, Math.max(bh - H * sc, ty));
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", width: bw, height: bh, overflow: "hidden", boxShadow: "16px 16px 0 #1b2270", background: "#fff" }}>
        <Img src={staticFile("img/portal-painel.jpg")} style={{ position: "absolute", left: 0, top: 0, width: W, transformOrigin: "0 0", transform: `translate(${cx}px, ${cy}px) scale(${sc})` }} />
      </div>
      <div style={{ position: "absolute", left: v ? 60 : 110, bottom: v ? 260 : 90 }}>
        <Slam key={seg} text={cur[3]} d={segStart} size={v ? 74 : 78} style={{ color: "#fff", background: C.ink, padding: "14px 28px 18px" }} />
      </div>
    </AbsoluteFill>
  );
};

const JornadaB: React.FC = () => {
  const f = useCurrentFrame(); const v = useIsV();
  const pts = Math.round(interpolate(f, [4, B_BAR * 1.2], [0, 320], { ...clamp, easing: theme.ease.out }));
  const seals = ["flag", "bell", "cap", "seal", "pen", "calendar"];
  return (
    <AbsoluteFill style={{ background: C.ink, flexDirection: v ? "column" : "row", alignItems: "center", justifyContent: "center", gap: v ? 60 : 120 }}>
      <div style={{ display: "grid", gap: 6 }}>
        <div style={{ ...sans(26, 800, { color: C.gold, letterSpacing: "0.18em" }) }}>MINHA JORNADA</div>
        <div style={{ ...disp(v ? 300 : 320, { color: "#fff", fontVariantNumeric: "tabular-nums" }) }}>{pts}</div>
        <div style={{ ...sans(40, 600, { color: "rgba(255,255,255,0.75)" }) }}>pontos · nível {pts >= 300 ? 3 : pts >= 120 ? 2 : 1}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 30 }}>
        {seals.map((s, i) => {
          const d = 12 + i * (B_BEAT / 2);
          const p = useSp(d, "bouncy");
          return <div key={s} style={{ opacity: interpolate(p, [0, 0.3], [0, 1], clamp), transform: `scale(${interpolate(p, [0, 1], [1.8, 1])}) rotate(${interpolate(p, [0, 1], [-25, 0])}deg)` }}><Seal icon={s} earned={i < 4 || f > B_BAR * 1.4} size={v ? 230 : 200} /></div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

const AcademiaB: React.FC = () => {
  const v = useIsV(); const f = useCurrentFrame();
  const steps = ["Conteúdo", "Aplicação", "Selo"];
  return (
    <AbsoluteFill style={{ flexDirection: v ? "column" : "row", alignItems: "center", justifyContent: "center", gap: v ? 50 : 80, padding: v ? 70 : 100 }}>
      <div style={{ display: "grid", gap: 20, width: v ? 940 : 560 }}>
        <Tag d={0}>ANOREG Academia</Tag>
        {steps.map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
            <Slam text={`0${i + 1}`} d={6 + i * B_BEAT * 2} size={v ? 70 : 64} italic style={{ color: C.navy }} />
            <Slam text={s} d={8 + i * B_BEAT * 2} size={v ? 120 : 112} gold={i === 2} />
          </div>
        ))}
      </div>
      <div style={{ boxShadow: "16px 16px 0 #1b2270", transform: `scale(${usePunch(B_BEAT * 2, 0.012)})` }}>
        <Browser src="img/portal-trilha.jpg" width={v ? 940 : 1100} height={v ? 640 : 700} scrollStart={20} scrollEnd={100} scrollTo={v ? 120 : 140} zoom={[1, 1.05]} label="ANOREG Academia · Trilha" />
      </div>
    </AbsoluteFill>
  );
};

const PhonesB: React.FC = () => {
  const v = useIsV(); const f = useCurrentFrame();
  const shots = ["img/mob-home.jpg", "img/mob-painel.jpg", "img/mob-jornada.jpg", "img/mob-servicos.jpg", "img/mob-painel.jpg"];
  const x = interpolate(f, [0, 2 * B_BAR], [v ? 300 : 500, v ? -900 : -500], { ...clamp, easing: theme.ease.soft });
  return (
    <AbsoluteFill style={{ background: C.navy, justifyContent: "center", gap: v ? 80 : 50, overflow: "hidden" }}>
      <div style={{ padding: v ? "0 80px" : "0 110px" }}><Slam text="No bolso de cada associado." d={4} size={v ? 92 : 96} style={{ color: "#fff" }} /></div>
      <div style={{ display: "flex", gap: 50, transform: `translateX(${x}px) rotate(-4deg)` }}>
        {shots.map((s, i) => { const p = useSp(6 + i * 3, "smooth"); return <div key={i} style={{ opacity: p, transform: `translateY(${interpolate(p, [0, 1], [200, 0]) + (i % 2 ? 50 : 0)}px)` }}><Phone src={s} height={v ? 900 : 640} /></div>; })}
      </div>
    </AbsoluteFill>
  );
};

const OutroB: React.FC = () => {
  const v = useIsV(); const f = useCurrentFrame();
  const p = useSp(4, "bouncy");
  const fade = interpolate(f, [2 * B_BAR - 20, 2 * B_BAR], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: v ? 60 : 44 }}>
      <div style={{ background: "#fff", padding: "34px 46px", boxShadow: "18px 18px 0 #1b2270", transform: `scale(${interpolate(p, [0, 1], [0.7, 1])})`, opacity: p }}><Img src={staticFile("img/logo.jpg")} style={{ width: v ? 620 : 560 }} /></div>
      <div style={{ display: "grid", justifyItems: "center", textAlign: "center" }}>
        <Slam text="Conectando cartórios." d={B_BEAT * 2} size={v ? 100 : 110} />
        <Slam text="Fortalecendo a cidadania." d={B_BEAT * 3} size={v ? 100 : 110} italic gold />
      </div>
      <AbsoluteFill style={{ background: C.paper, opacity: fade }} />
    </AbsoluteFill>
  );
};

const SCENES: [React.FC, number, number][] = [
  [Intro, 0, 2], [SiteSplit, 2, 2], [Mosaic, 4, 2], [Cidadao, 6, 2], [Numbers, 8, 2], [Membros, 10, 1], [PainelZoom, 11, 3], [JornadaB, 14, 2], [AcademiaB, 16, 2], [PhonesB, 18, 2], [OutroB, 20, 2],
];
export const StyleB: React.FC = () => (
  <AbsoluteFill>
    <PaperBg />
    {SCENES.map(([S, a, n], i) => (
      <Sequence key={i} from={a * B_BAR} durationInFrames={n * B_BAR}>{i === SCENES.length - 1 ? <S /> : <Exit dur={n * B_BAR}><S /></Exit>}</Sequence>
    ))}
    {[2, 4, 6, 11, 14, 16, 18, 20].map((b) => <Wipe key={b} at={b * B_BAR} />)}
    <Grain />
    <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 60%, rgba(18,21,53,0.16) 100%)" }} />
    <Audio src={staticFile("music-b.wav")} />
  </AbsoluteFill>
);

/* Estilo D · Motion graphics: tudo em vetor, cores chapadas da marca, ícones, linhas que se desenham e carimbos. 112,5 BPM. */
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";
import { Seal, clamp, useIsV } from "./components";
import EV from "./d_events.json";

export const D_BEAT = 16, D_BAR = 64, D_TOTAL = 25 * 64;
const P = { navy: "#141a52", royal: "#2a3389", sky: "#dfe3f7", paper: "#f6f5f1", gold: "#f4d21f", ink: "#141738", white: "#ffffff", ok: "#1d7349", mute: "#7d82a3" };
const disp = (s: number, c = P.ink, extra: React.CSSProperties = {}): React.CSSProperties => ({ fontFamily: theme.fonts.display, fontWeight: 400, fontSize: s, lineHeight: 1.02, letterSpacing: "-0.025em", color: c, ...extra });
const sans = (s: number, c = P.ink, w = 700, extra: React.CSSProperties = {}): React.CSSProperties => ({ fontFamily: theme.fonts.body, fontWeight: w, fontSize: s, color: c, ...extra });
const useSp = (d: number, cfg: keyof typeof theme.spring = "snappy") => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return spring({ frame: f - d, fps, config: theme.spring[cfg] }); };
const ez = (f: number, a: number, b: number, x: number, y: number, e = theme.ease.inOut) => interpolate(f, [a, b], [x, y], { ...clamp, easing: e });

const PATHS: Record<string, string> = {
  pin: "M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21Z M12 7.6a2.4 2.4 0 1 1 0 4.8a2.4 2.4 0 1 1 0-4.8",
  doc: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z M14 3v5h5M9 13h6M9 17h4",
  pen: "m14.5 5.5 4 4L8 20H4v-4L14.5 5.5Z m12.5 7.5 4 4",
  shield: "M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6l-7-3Z m9 12 2 2 4-4",
  check: "m5 12.5 4.5 4.5L19 7.5",
  lock: "M5 10.5h14v10H5z",
  shackle: "M8 10.5V8a4 4 0 0 1 8 0v2.5",
  chat: "M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 4v-4A1.5 1.5 0 0 1 4 14.5v-9Z",
  cursor: "M5 3l14 7-6 2-2 6L5 3Z",
};
const Icon: React.FC<{ name: string; size: number; color: string; draw?: number; sw?: number }> = ({ name, size, color, draw = 1, sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={PATHS[name]} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
  </svg>
);

/** Fundo chapado com transição por círculo que cresce */
const Bg: React.FC<{ from: string; to: string; at?: number; cx?: string; cy?: string }> = ({ from, to, at = 0, cx = "50%", cy = "50%" }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const r = ez(f, at, at + 18, 0, Math.hypot(width, height), theme.ease.inOut);
  return <AbsoluteFill style={{ background: from }}><div style={{ position: "absolute", left: cx, top: cy, width: r * 2, height: r * 2, marginLeft: -r, marginTop: -r, borderRadius: "50%", background: to }} /></AbsoluteFill>;
};
const Shapes: React.FC<{ color?: string }> = ({ color = "rgba(255,255,255,0.08)" }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: width * 0.06, top: height * 0.12 + Math.sin(f / 30) * 14, width: 90, height: 90, borderRadius: "50%", border: `10px solid ${color}` }} />
      <div style={{ position: "absolute", right: width * 0.08, bottom: height * 0.14 + Math.cos(f / 34) * 14, width: 120, height: 120, background: color, transform: `rotate(${f * 0.6}deg)` }} />
      <div style={{ position: "absolute", right: width * 0.2, top: height * 0.1, width: 18, height: 18, borderRadius: "50%", background: P.gold, transform: `translateY(${Math.sin(f / 22) * 10}px)` }} />
    </AbsoluteFill>
  );
};
const Exit: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const t = ez(f, dur - 8, dur, 0, 1, theme.ease.in);
  return <AbsoluteFill style={{ opacity: 1 - t, transform: `scale(${1 - t * 0.06})` }}>{children}</AbsoluteFill>;
};
const Head: React.FC<{ k?: string; t: string; d?: number; c?: string; kc?: string; size: number; italic?: boolean }> = ({ k, t, d = 0, c = P.ink, kc = P.royal, size, italic }) => {
  const p = useSp(d, "smooth"), q = useSp(d + 6, "smooth"); const v = useIsV();
  return (
    <div style={{ display: "grid", justifyItems: "center", gap: 14, textAlign: "center", maxWidth: v ? 940 : 1600, padding: v ? "0 40px" : 0 }}>
      {k && <div style={{ ...sans(22, kc, 800, { letterSpacing: "0.2em", textTransform: "uppercase" }), opacity: p, transform: `translateY(${(1 - p) * 16}px)` }}>{k}</div>}
      <div style={{ ...disp(size, c, { fontStyle: italic ? "italic" : "normal" }), opacity: q, transform: `translateY(${(1 - q) * 30}px)`, clipPath: `inset(-30% -5% ${(1 - q) * 100}% -5%)` }}>{t}</div>
    </div>
  );
};

/* ---- Cenas ---- */
const Abertura: React.FC = () => {
  const f = useCurrentFrame(); const v = useIsV();
  const dots = Array.from({ length: 10 });
  const plate = useSp(D_BEAT * 2, "bouncy");
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 50 }}>
      <Bg from={P.paper} to={P.royal} at={0} />
      {dots.map((_, i) => {
        const a = (i / dots.length) * Math.PI * 2; const p = ez(f, 4, D_BEAT * 2 + 4, 0, 1, theme.ease.out);
        return <div key={i} style={{ position: "absolute", left: "50%", top: "50%", width: 26, height: 26, marginLeft: -13, marginTop: -13, borderRadius: i % 3 ? "50%" : 4, background: i % 2 ? P.gold : P.white, opacity: 1 - plate, transform: `translate(${Math.cos(a) * 380 * p}px, ${Math.sin(a) * 380 * p}px) rotate(${f * 4}deg)` }} />;
      })}
      <div style={{ zIndex: 2, background: P.white, padding: "32px 44px", borderRadius: 26, transform: `scale(${interpolate(plate, [0, 1], [0.3, 1])}) rotate(${interpolate(plate, [0, 1], [-8, 0])}deg)`, opacity: plate, boxShadow: `14px 14px 0 ${P.gold}` }}><Img src={staticFile("img/logo.jpg")} style={{ width: v ? 600 : 540 }} /></div>
      <div style={{ zIndex: 2 }}><Head t="Um portal novo, por dentro." d={D_BEAT * 4} c={P.white} size={v ? 80 : 76} italic /></div>
    </AbsoluteFill>
  );
};

const Wireframe: React.FC = () => {
  const f = useCurrentFrame(); const v = useIsV();
  const W = v ? 900 : 1180, H = v ? 640 : 680;
  const draw = ez(f, 4, 34, 0, 1, theme.ease.out);
  const blocks: [number, number, number, number, string, number][] = [
    [0.04, 0.12, 0.92, 0.06, P.sky, 0], [0.06, 0.26, 0.38, 0.07, P.ink, 1], [0.06, 0.36, 0.30, 0.07, P.royal, 2], [0.06, 0.48, 0.36, 0.03, P.sky, 3], [0.06, 0.53, 0.30, 0.03, P.sky, 3],
    [0.06, 0.62, 0.15, 0.06, P.navy, 4], [0.5, 0.24, 0.44, 0.46, P.royal, 2], [0.06, 0.78, 0.2, 0.14, P.sky, 5], [0.28, 0.78, 0.2, 0.14, P.sky, 6], [0.5, 0.78, 0.2, 0.14, P.sky, 7], [0.72, 0.78, 0.22, 0.14, P.gold, 8],
  ];
  const cx = ez(f, 70, 104, W * 0.95, W * 0.13), cy = ez(f, 70, 104, H * 0.95, H * 0.65);
  const click = ez(f, 106, 112, 1, 0.8, theme.ease.out) * ez(f, 112, 118, 1, 1.25, theme.ease.out);
  return (
    <AbsoluteFill style={{ background: P.paper, alignItems: "center", justifyContent: "center", gap: v ? 70 : 40 }}>
      <Shapes color="rgba(42,51,137,0.07)" />
      <Head k="O site público" t="Claro, organizado, institucional." d={4} size={v ? 74 : 66} />
      <div style={{ position: "relative", width: W, height: H }}>
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <rect x={2} y={2} width={W - 4} height={H - 4} rx={18} fill={P.white} fillOpacity={draw} stroke={P.ink} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
          <line x1={2} y1={H * 0.08} x2={W - 2} y2={H * 0.08} stroke={P.ink} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
          {[0, 1, 2].map((i) => <circle key={i} cx={26 + i * 22} cy={H * 0.04} r={6} fill={["#ec6a5e", "#f4bf4f", "#61c554"][i]} opacity={draw} />)}
        </svg>
        {blocks.map(([x, y, w, h, c, k], i) => {
          const p = useSp(30 + k * 5, "snappy");
          return <div key={i} style={{ position: "absolute", left: x * W, top: y * H, width: w * W * interpolate(p, [0, 1], [0.2, 1]), height: h * H, borderRadius: h > 0.1 ? 14 : 99, background: c, opacity: p }} />;
        })}
        <div style={{ position: "absolute", left: 0.06 * W, top: 0.62 * H, width: 0.15 * W, height: 0.06 * H, borderRadius: 99, boxShadow: `0 0 0 ${ez(f, 112, 126, 0, 26, theme.ease.out)}px rgba(244,210,31,${ez(f, 112, 126, 0.6, 0)})` }} />
        <div style={{ position: "absolute", left: cx, top: cy, transform: `scale(${click})`, opacity: ez(f, 66, 72, 0, 1) }}><Icon name="cursor" size={56} color={P.ink} sw={2} /></div>
      </div>
    </AbsoluteFill>
  );
};

const Cidadao: React.FC = () => {
  const f = useCurrentFrame(); const v = useIsV();
  const st = 4 * D_BAR;
  const items: [string, string][] = [["pin", "Encontrar um cartório"], ["doc", "Certidões e registros"], ["pen", "Escrituras e procurações"], ["shield", "Consulta de protesto"]];
  const node = EV.node[0] - st;
  const R = v ? 300 : 0;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: v ? 80 : 60 }}>
      <Bg from={P.paper} to={P.navy} at={0} />
      <Shapes />
      <div style={{ zIndex: 2 }}><Head k="Para o cidadão" kc={P.gold} t="Cada serviço, um caminho oficial." d={10} c={P.white} size={v ? 72 : 66} /></div>
      <div style={{ zIndex: 2, position: "relative", display: "grid", gridTemplateColumns: v ? "1fr 1fr" : "repeat(4, 1fr)", gap: v ? 40 : 50, width: v ? 900 : 1500 }}>
        {items.map(([ic, t], i) => {
          const d = EV.icons[i] - st; const p = useSp(d, "bouncy");
          const lit = f > node;
          return (
            <div key={ic} style={{ display: "grid", justifyItems: "center", gap: 20, opacity: interpolate(p, [0, 0.3], [0, 1], clamp), transform: `scale(${interpolate(p, [0, 1], [0.4, 1])})` }}>
              <div style={{ width: 150, height: 150, borderRadius: 40, display: "grid", placeItems: "center", background: lit ? P.gold : P.white, transition: "none" }}><Icon name={ic} size={78} color={P.navy} draw={ez(f, d, d + 20, 0, 1, theme.ease.out)} /></div>
              <div style={sans(v ? 30 : 26, P.white, 700, { textAlign: "center" })}>{t}</div>
            </div>
          );
        })}
      </div>
      <div style={{ zIndex: 2, display: "flex", alignItems: "center", gap: 18, padding: "18px 30px", borderRadius: 99, background: P.white, transform: `scale(${useSp(node, "bouncy")})` }}>
        <span style={{ display: "grid", placeItems: "center", width: 48, height: 48, borderRadius: "50%", background: P.ok }}><Icon name="check" size={32} color={P.white} sw={2.6} draw={ez(f, node + 4, node + 16, 0, 1)} /></span>
        <span style={sans(v ? 32 : 30, P.ink, 800)}>Direto para o canal oficial</span>
      </div>
    </AbsoluteFill>
  );
};

const Rota: React.FC = () => {
  const f = useCurrentFrame(); const v = useIsV();
  const st = 7 * D_BAR;
  const W = v ? 920 : 1560;
  const line = ez(f, 6, 24 + 12 * 6, 0, 1, theme.ease.inOut);
  const pts = Array.from({ length: 12 }).map((_, i) => ({ x: (i / 11) * W, y: Math.sin(i * 0.9) * (v ? 50 : 60) }));
  const path = pts.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y + 100}`).join(" ");
  const c1 = Math.round(ez(f, 70, 110, 0, 14, theme.ease.out)), c2 = Math.round(ez(f, 76, 116, 0, 12, theme.ease.out));
  return (
    <AbsoluteFill style={{ background: P.gold, alignItems: "center", justifyContent: "center", gap: v ? 70 : 50 }}>
      <Head k="Comissões e diretorias regionais" kc={P.navy} t="Do litoral ao sertão." d={4} size={v ? 90 : 84} italic />
      <div style={{ position: "relative", width: W, height: 220 }}>
        <svg width={W} height={220} style={{ overflow: "visible", position: "absolute" }}>
          <path d={path} fill="none" stroke={P.navy} strokeWidth={5} strokeLinecap="round" strokeDasharray="1" pathLength={1} strokeDashoffset={1 - line} />
        </svg>
        {pts.map((p, i) => {
          const d = EV.pins[i] - st; const s = useSp(d, "bouncy");
          return (
            <div key={i} style={{ position: "absolute", left: p.x - 26, top: p.y + 100 - 64, opacity: interpolate(s, [0, 0.3], [0, 1], clamp), transform: `translateY(${interpolate(s, [0, 1], [-60, 0])}px)` }}>
              <svg width={52} height={64} viewBox="0 0 24 30"><path d="M12 29s-10-8.6-10-17a10 10 0 0 1 20 0c0 8.4-10 17-10 17Z" fill={P.navy} /><circle cx="12" cy="12" r="4" fill={P.gold} /></svg>
              {(i === 0 || i === 11) && <div style={{ ...sans(v ? 24 : 22, P.navy, 800, { position: "absolute", top: 74, left: 26, transform: "translateX(-50%)", whiteSpace: "nowrap", letterSpacing: "0.1em", textTransform: "uppercase" }) }}>{i ? "Sertão" : "Litoral"}</div>}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: v ? 60 : 120 }}>
        {[[c1, "comissões temáticas"], [c2, "diretorias regionais"]].map(([n, l], i) => (
          <div key={i} style={{ display: "grid", justifyItems: "center", opacity: useSp(66 + i * 6, "smooth") }}>
            <span style={{ ...disp(v ? 150 : 140, P.navy, { fontVariantNumeric: "tabular-nums" }) }}>{n}</span>
            <span style={sans(v ? 28 : 26, P.navy, 700)}>{l}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Cadeado: React.FC = () => {
  const f = useCurrentFrame(); const v = useIsV();
  const st = 9 * D_BAR; const open = EV.lock[0] - st;
  const sh = ez(f, open, open + 12, 0, 1, theme.ease.out);
  const p = useSp(2, "bouncy");
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 50 }}>
      <Bg from={P.gold} to={P.navy} at={0} />
      <Shapes />
      <div style={{ zIndex: 2, position: "relative", width: 260, height: 260, transform: `scale(${interpolate(p, [0, 1], [0.3, 1]) * (1 + 0.08 * Math.sin(Math.min(1, sh) * Math.PI))})` }}>
        <svg width={260} height={260} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", overflow: "visible" }}>
          <g style={{ transformOrigin: "16px 10.5px", transform: `translateY(${-sh * 1.6}px) rotate(${sh * 35}deg)` }}><path d={PATHS.shackle} stroke={P.gold} strokeWidth={2} /></g>
          <rect x={5} y={10.5} width={14} height={10} rx={2.2} fill={P.gold} />
          <circle cx={12} cy={15.5} r={1.6} fill={P.navy} />
        </svg>
      </div>
      <div style={{ zIndex: 2 }}><Head k="E para quem faz a ANOREG" kc={P.gold} t="Área de membros." d={open - 6} c={P.white} size={v ? 120 : 130} italic /></div>
    </AbsoluteFill>
  );
};

const Painel: React.FC = () => {
  const f = useCurrentFrame(); const v = useIsV();
  const st = 11 * D_BAR;
  const W = v ? 940 : 1400, H = v ? 1040 : 760;
  const card = (d: number, style: React.CSSProperties, children?: React.ReactNode, from: [number, number] = [0, 80]) => {
    const p = useSp(d, "smooth");
    return <div style={{ position: "absolute", borderRadius: 22, background: P.white, boxShadow: "0 18px 40px -18px rgba(20,26,82,0.35)", opacity: p, transform: `translate(${(1 - p) * from[0]}px, ${(1 - p) * from[1]}px)`, ...style }}>{children}</div>;
  };
  const side = v ? 0 : 0.2;
  const goals = ["Ler comunicados", "Concluir um módulo", "Consultar referências"];
  return (
    <AbsoluteFill style={{ background: P.sky, alignItems: "center", justifyContent: "center", gap: v ? 60 : 30 }}>
      <Head k="Seu painel" t="Tudo em ordem, à primeira vista." d={4} size={v ? 70 : 60} />
      <div style={{ position: "relative", width: W, height: H }}>
        {!v && card(8, { left: 0, top: 0, width: W * 0.18, height: H, background: P.white }, <div style={{ padding: 24, display: "grid", gap: 16 }}>
          <div style={{ height: 70, borderRadius: 16, background: P.navy }} />
          {Array.from({ length: 7 }).map((_, i) => <div key={i} style={{ height: 16, width: `${60 + (i * 13) % 35}%`, borderRadius: 99, background: i === 0 ? P.royal : P.sky }} />)}
        </div>, [-120, 0])}
        {card(14, { left: W * side, right: 0, top: 0, height: H * 0.28, background: P.navy }, <div style={{ padding: v ? 34 : 30, display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%" }}>
          <div style={{ display: "grid", gap: 10 }}><div style={sans(18, P.gold, 800, { letterSpacing: "0.18em" })}>ESPAÇO DO ASSOCIADO</div><div style={disp(v ? 52 : 50, P.white)}>Boa tarde! <i style={{ color: P.gold }}>Que bom ter você aqui.</i></div></div>
        </div>)}
        {[0, 1, 2, 3].map((i) => {
          const d = 24 + i * 5; const n = [150, 3, 2, 1][i]; const val = Math.round(ez(f, d, d + 40, 0, n, theme.ease.out));
          const gw = v ? (W - 3 * 16) / 4 : (W * (1 - side) - 3 * 16) / 4;
          return <React.Fragment key={i}>{card(d, { left: W * side + i * (gw + 16), top: H * 0.31, width: gw, height: H * 0.16 }, <div style={{ padding: 20, display: "grid", gap: 4 }}><span style={disp(v ? 50 : 54, P.ink, { fontVariantNumeric: "tabular-nums" })}>{val}</span><span style={sans(v ? 16 : 17, P.mute, 600)}>{["pontos", "selos", "módulos", "avisos"][i]}</span></div>)}</React.Fragment>;
        })}
        {card(40, { left: W * side, top: H * 0.5, width: (W * (1 - side)) * (v ? 1 : 0.58), height: v ? H * 0.28 : H * 0.5 }, <div style={{ padding: 26, display: "grid", gap: 16 }}>
          <div style={sans(22, P.ink, 800)}>Seus próximos passos</div>
          {goals.map((g, i) => {
            const t = EV.checks[i] - st; const ok = f >= t; const pp = useSp(t, "bouncy");
            return <div key={g} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ width: 40, height: 40, borderRadius: "50%", display: "grid", placeItems: "center", background: ok ? P.ok : "transparent", border: ok ? "none" : `2px solid ${P.sky}`, transform: `scale(${ok ? interpolate(pp, [0, 1], [0.6, 1]) : 1})` }}>{ok && <Icon name="check" size={26} color={P.white} sw={2.8} />}</span>
              <span style={{ flex: 1 }}><div style={sans(20, ok ? P.mute : P.ink, 700)}>{g}</div><div style={{ height: 6, borderRadius: 99, background: P.sky, marginTop: 8 }}><div style={{ height: "100%", width: `${ok ? 100 : 30}%`, borderRadius: 99, background: ok ? P.ok : P.royal }} /></div></span>
            </div>;
          })}
        </div>)}
        {card(48, { left: v ? 0 : W * side + W * (1 - side) * 0.61, right: 0, top: v ? H * 0.8 : H * 0.5, height: v ? H * 0.2 : H * 0.5, background: P.royal }, <div style={{ padding: 26, display: "grid", gap: 14, color: P.white }}>
          <div style={sans(22, P.white, 800)}>Continue aprendendo</div>
          <div style={{ height: 12, borderRadius: 99, background: "rgba(255,255,255,0.2)" }}><div style={{ height: "100%", borderRadius: 99, width: `${ez(f, 60, 140, 0, 50, theme.ease.out)}%`, background: P.gold }} /></div>
          <div style={sans(18, "rgba(255,255,255,0.8)", 600)}>Gestão que transforma o cartório · {Math.round(ez(f, 60, 140, 0, 50, theme.ease.out))}%</div>
        </div>, [80, 0])}
      </div>
    </AbsoluteFill>
  );
};

const Jornada: React.FC = () => {
  const f = useCurrentFrame(); const v = useIsV();
  const st = 14 * D_BAR;
  const [l2, l3] = EV.levels.map((x) => x - st);
  const lvl = f >= l3 ? 3 : f >= l2 ? 2 : 1;
  const names = ["Ingresso", "Participante", "Colaborador"];
  const bar = f < l2 ? ez(f, 8, l2, 0, 1) : f < l3 ? ez(f, l2 + 4, l3, 0, 1) : ez(f, l3 + 4, l3 + 60, 0, 0.1);
  const pop = useSp(lvl === 3 ? l3 : lvl === 2 ? l2 : 0, "bouncy");
  const seals = ["flag", "cap", "calendar", "bell"];
  return (
    <AbsoluteFill style={{ background: P.navy, alignItems: "center", justifyContent: "center", gap: v ? 70 : 46 }}>
      <Shapes />
      <Head k="Minha jornada" kc={P.gold} t="Participar vale pontos, níveis e selos." d={4} c={P.white} size={v ? 66 : 60} />
      <div style={{ display: "flex", alignItems: "center", gap: 30, width: v ? 900 : 1200 }}>
        <div style={{ flex: "none", width: 150, height: 150, borderRadius: 34, background: P.gold, display: "grid", placeItems: "center", transform: `scale(${interpolate(pop, [0, 1], [1.35, 1])}) rotate(${interpolate(pop, [0, 1], [-12, 0])}deg)` }}>
          <div style={{ textAlign: "center" }}><div style={disp(76, P.navy)}>{lvl}</div><div style={sans(15, P.navy, 800, { letterSpacing: "0.14em" })}>NÍVEL</div></div>
        </div>
        <div style={{ flex: 1, display: "grid", gap: 14 }}>
          <div style={disp(v ? 60 : 64, P.white)}>{names[lvl - 1]}</div>
          <div style={{ height: 22, borderRadius: 99, background: "rgba(255,255,255,0.14)", overflow: "hidden" }}><div style={{ width: `${bar * 100}%`, height: "100%", borderRadius: 99, background: P.gold }} /></div>
        </div>
      </div>
      <div style={{ display: "flex", gap: v ? 30 : 60 }}>
        {seals.map((s, i) => {
          const t = EV.seals[i] - st; const p = useSp(t, "bouncy"); const on = f >= t;
          return <div key={s} style={{ opacity: on ? 1 : 0.25, transform: on ? `scale(${interpolate(p, [0, 1], [1.9, 1])}) rotate(${interpolate(p, [0, 1], [-30, 0])}deg)` : "none" }}><Seal icon={s} earned={on} size={v ? 190 : 170} /></div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

const Kanban: React.FC = () => {
  const f = useCurrentFrame(); const v = useIsV();
  const st = 17 * D_BAR;
  const cols = ["A fazer", "Em andamento", "Concluída"];
  const CW = v ? 300 : 420, gap = v ? 20 : 40;
  const cards = [{ t: "Pauta da reunião", moves: [EV.cards[0], EV.cards[2]] }, { t: "Levantar prioridades", moves: [EV.cards[1]] }, { t: "Ata de outubro", moves: [] as number[] }];
  return (
    <AbsoluteFill style={{ background: P.paper, alignItems: "center", justifyContent: "center", gap: v ? 60 : 40 }}>
      <Head k="Espaço das comissões" t="Da conversa à entrega." d={4} size={v ? 80 : 70} italic />
      <div style={{ position: "relative", display: "flex", gap, height: v ? 640 : 440 }}>
        {cols.map((c, i) => <div key={c} style={{ width: CW, borderRadius: 24, background: [P.sky, "#fbf1c4", "#e5f3ea"][i], padding: 20, opacity: useSp(6 + i * 4, "smooth") }}><div style={sans(v ? 24 : 26, P.ink, 800)}>{c}</div></div>)}
        {cards.map((cd, i) => {
          let col = 0;
          const pos = cd.moves.reduce((acc, t) => acc + ez(f, t - st, t - st + 14, 0, 1, theme.ease.inOut), 0);
          col = pos;
          const startCol = i === 2 ? 2 : 0;
          const x = 20 + (startCol + col) * (CW + gap), y = 80 + i * (v ? 150 : 110);
          const p = useSp(14 + i * 5, "bouncy");
          const lift = cd.moves.some((t) => f > t - st && f < t - st + 14) ? 1 : 0;
          return <div key={cd.t} style={{ position: "absolute", left: x, top: y, width: CW - 40, padding: "18px 20px", borderRadius: 16, background: P.white, boxShadow: lift ? "0 24px 40px -14px rgba(20,26,82,0.4)" : "0 8px 18px -10px rgba(20,26,82,0.3)", transform: `scale(${interpolate(p, [0, 1], [0.5, 1]) * (1 + lift * 0.05)}) rotate(${lift * 3}deg)`, opacity: p }}>
            <div style={sans(v ? 22 : 22, P.ink, 700)}>{cd.t}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}><span style={{ width: 30, height: 30, borderRadius: "50%", background: "#fbf1c4" }} /><span style={{ height: 10, width: 80, borderRadius: 99, background: P.sky, alignSelf: "center" }} /></div>
          </div>;
        })}
        {EV.bubbles.map((t, i) => {
          const p = useSp(t - st, "bouncy");
          return <div key={i} style={{ position: "absolute", right: v ? 10 - i * 30 : -60 - i * 40, top: v ? -90 - i * 0 : -40 + i * 90, display: "flex", alignItems: "center", gap: 12, padding: "14px 22px", borderRadius: "22px 22px 22px 4px", background: i ? P.gold : P.royal, color: i ? P.navy : P.white, transform: `scale(${p})`, transformOrigin: "0 100%" }}><Icon name="chat" size={28} color={i ? P.navy : P.white} /><span style={sans(22, i ? P.navy : P.white, 700)}>{i ? "Entregue!" : "Pauta pronta para revisão"}</span></div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

const Trilha: React.FC = () => {
  const f = useCurrentFrame(); const v = useIsV();
  const st = 20 * D_BAR;
  const W = v ? 860 : 1300;
  const labels = ["Diagnóstico", "Processos", "Atendimento", "Indicadores"];
  const seal = EV.trailSeal[0] - st;
  const n = 5;
  return (
    <AbsoluteFill style={{ background: P.royal, alignItems: "center", justifyContent: "center", gap: v ? 90 : 70 }}>
      <Shapes />
      <Head k="ANOREG Academia" kc={P.gold} t="Uma trilha. Um selo no fim." d={2} c={P.white} size={v ? 80 : 74} />
      <div style={{ position: "relative", width: W, height: 220 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 60, height: 8, borderRadius: 99, background: "rgba(255,255,255,0.18)" }}><div style={{ height: "100%", borderRadius: 99, background: P.gold, width: `${ez(f, EV.nodes[0] - st, seal, 0, 100, theme.ease.inOut)}%` }} /></div>
        {Array.from({ length: n }).map((_, i) => {
          const last = i === n - 1; const t = last ? seal : EV.nodes[i] - st; const on = f >= t; const p = useSp(t, "bouncy");
          return <div key={i} style={{ position: "absolute", left: (i / (n - 1)) * W, top: 64, transform: "translate(-50%,-50%)", display: "grid", justifyItems: "center", gap: 14 }}>
            {last ? <div style={{ transform: on ? `scale(${interpolate(p, [0, 1], [2, 1])}) rotate(${interpolate(p, [0, 1], [-30, 0])}deg)` : "scale(0.9)", opacity: on ? 1 : 0.35, marginTop: 56 }}><Seal icon="seal" earned={on} size={150} /></div>
              : <div style={{ width: 70, height: 70, borderRadius: "50%", display: "grid", placeItems: "center", background: on ? P.gold : P.royal, border: `4px solid ${on ? P.gold : "rgba(255,255,255,0.35)"}`, transform: `scale(${on ? interpolate(p, [0, 1], [1.4, 1]) : 1})` }}>{on ? <Icon name="check" size={40} color={P.navy} sw={2.8} /> : <span style={sans(26, P.white, 800)}>{i + 1}</span>}</div>}
            {!last && <div style={sans(v ? 20 : 22, on ? P.white : "rgba(255,255,255,0.55)", 700, { whiteSpace: "nowrap" })}>{labels[i]}</div>}
          </div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

const Final: React.FC = () => {
  const f = useCurrentFrame(); const v = useIsV();
  const t = EV.logo[0] - 22 * D_BAR;
  const p = useSp(t, "bouncy");
  const fade = ez(f, 3 * D_BAR - 24, 3 * D_BAR, 0, 1);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: v ? 60 : 44 }}>
      <Bg from={P.royal} to={P.paper} at={0} />
      <div style={{ zIndex: 2, background: P.white, padding: "32px 44px", borderRadius: 26, boxShadow: `14px 14px 0 ${P.gold}`, transform: `scale(${interpolate(p, [0, 1], [1.8, 1])}) rotate(${interpolate(p, [0, 1], [-10, 0])}deg)`, opacity: interpolate(p, [0, 0.2], [0, 1], clamp) }}><Img src={staticFile("img/logo.jpg")} style={{ width: v ? 620 : 560 }} /></div>
      <div style={{ zIndex: 2, display: "grid", gap: 6 }}>
        <Head t="Conectando cartórios." d={D_BEAT * 2} size={v ? 84 : 80} />
        <Head t="Fortalecendo a cidadania." d={D_BEAT * 3} size={v ? 84 : 80} italic c={P.royal} />
      </div>
      <AbsoluteFill style={{ background: P.paper, opacity: fade, zIndex: 3 }} />
    </AbsoluteFill>
  );
};

const SCENES: [React.FC, number, number][] = [
  [Abertura, 0, 2], [Wireframe, 2, 2], [Cidadao, 4, 3], [Rota, 7, 2], [Cadeado, 9, 2], [Painel, 11, 3], [Jornada, 14, 3], [Kanban, 17, 3], [Trilha, 20, 2], [Final, 22, 3],
];
export const StyleD: React.FC = () => (
  <AbsoluteFill style={{ background: P.paper }}>
    {SCENES.map(([S, a, n], i) => <Sequence key={i} from={a * D_BAR} durationInFrames={n * D_BAR}>{i === SCENES.length - 1 ? <S /> : <Exit dur={n * D_BAR}><S /></Exit>}</Sequence>)}
    <Audio src={staticFile("music-d.wav")} />
  </AbsoluteFill>
);

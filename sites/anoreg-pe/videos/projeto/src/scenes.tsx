import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, BAR, BEAT } from "./theme";
import {
  Browser, Callout, Card, Entrance, Kicker, Phone, Ring, Seal, WordReveal, body, clamp, display, useIsV, useSpring,
} from "./components";

const C = theme.colors;
const IMG = { siteFull: [2880, 13414], painel: [2880, 3656], trilha: [2880, 2356] } as const;
const ratio = (k: keyof typeof IMG) => IMG[k][1] / IMG[k][0];

const LogoPlate: React.FC<{ width: number; delay?: number }> = ({ width, delay = 0 }) => {
  const p = useSpring(delay, "bouncy");
  const f = useCurrentFrame();
  const shine = interpolate(f, [delay + 14, delay + 40], [-30, 130], { ...clamp, easing: theme.ease.soft });
  return (
    <div style={{ position: "relative", padding: `${width * 0.07}px ${width * 0.09}px`, background: "#fff", borderRadius: width * 0.06, overflow: "hidden", opacity: interpolate(p, [0, 0.4], [0, 1], clamp), transform: `scale(${interpolate(p, [0, 1], [0.8, 1])}) translateY(${interpolate(p, [0, 1], [30, 0])}px)`, boxShadow: "0 40px 90px -30px rgba(0,0,10,0.8)" }}>
      <Img src={staticFile("img/logo.jpg")} style={{ width, display: "block" }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${shine}%`, width: "18%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent)", transform: "skewX(-20deg)", mixBlendMode: "screen" }} />
    </div>
  );
};

/* 1 · Abertura */
export const Intro: React.FC = () => {
  const v = useIsV();
  const f = useCurrentFrame();
  const lineW = interpolate(f, [BEAT * 3 + 20, BEAT * 3 + 44], [0, 100], { ...clamp, easing: theme.ease.out });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: v ? 70 : 56, padding: v ? 80 : 120 }}>
      <LogoPlate width={v ? 620 : 520} delay={4} />
      <div style={{ textAlign: "center", display: "grid", justifyItems: "center", gap: 26 }}>
        <Kicker delay={BEAT * 2} size={v ? 24 : 22}>Proposta de novo portal</Kicker>
        <div style={{ position: "relative" }}>
          <WordReveal text="A força dos cartórios." delay={BEAT * 2 + 6} style={{ ...display(v ? 92 : 96), justifyContent: "center" }} />
          <WordReveal text="A serviço de Pernambuco." delay={BEAT * 3 + 4} italicFrom={0} gold style={{ ...display(v ? 92 : 96), justifyContent: "center", marginTop: 6 }} />
          <div style={{ height: 4, width: `${lineW * 0.62}%`, background: C.primary, margin: "18px auto 0", borderRadius: 4, boxShadow: `0 0 30px ${C.glow}` }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* 2 · Primeira impressão do site */
export const Hero: React.FC = () => {
  const v = useIsV();
  const p = useSpring(6, "smooth");
  const tilt = interpolate(p, [0, 1], [14, 0]);
  const bw = v ? 940 : 1180, bh = bw * 0.625;
  return (
    <AbsoluteFill style={{ flexDirection: v ? "column" : "row", alignItems: "center", justifyContent: "center", gap: v ? 70 : 80, padding: v ? 70 : 110 }}>
      <div style={{ width: v ? 900 : 520, display: "grid", gap: 28, textAlign: v ? "center" : "left", justifyItems: v ? "center" : "start" }}>
        <Kicker delay={2}>O site público</Kicker>
        <WordReveal text="Refinado, harmônico e institucional." delay={8} italicFrom={2} style={{ ...display(v ? 86 : 78), justifyContent: v ? "center" : "flex-start" }} />
        <Entrance delay={BEAT * 2}><div style={body(v ? 30 : 26)}>Na paleta do logo, com tipografia editorial e informação clara para a sociedade e para a categoria.</div></Entrance>
      </div>
      <div style={{ perspective: 2000 }}>
        <div style={{ opacity: interpolate(p, [0, 0.4], [0, 1], clamp), transform: `translateY(${interpolate(p, [0, 1], [120, 0])}px) rotateX(${tilt}deg) scale(${interpolate(p, [0, 1], [0.9, 1])})` }}>
          <Browser src="img/site-hero.jpg" width={bw} height={bh} zoom={[1, 1.06]} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* 3 · Percorrendo o site */
const SECTIONS = ["Notícias em pauta", "Serviços ao cidadão", "A ANOREG/PE", "Comissões e regionais", "ANOREG Academia", "Referências oficiais"];
export const Scroll: React.FC = () => {
  const v = useIsV();
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const bw = v ? 940 : 1240, bh = v ? 1200 : 820;
  const imgH = bw * ratio("siteFull");
  const end = imgH - (bh - 60) - bw * 0.2;
  const active = Math.min(SECTIONS.length - 1, Math.floor(interpolate(f, [16, durationInFrames - 30], [0, SECTIONS.length], clamp)));
  const list = (
    <div style={{ display: "grid", gap: v ? 10 : 14, width: v ? 940 : 470 }}>
      {SECTIONS.map((s, i) => {
        const on = i === active;
        return (
          <Entrance key={s} delay={6 + i * 4} x={-30} y={0}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: v ? 28 : 27, color: on ? C.text : "rgba(255,255,255,0.42)", transition: "none" }}>
              <span style={{ width: on ? 34 : 14, height: 3, borderRadius: 3, background: on ? C.primary : "rgba(255,255,255,0.25)" }} />
              {s}
            </div>
          </Entrance>
        );
      })}
    </div>
  );
  return (
    <AbsoluteFill style={{ flexDirection: v ? "column" : "row", alignItems: "center", justifyContent: "center", gap: v ? 56 : 90, padding: v ? 70 : 100 }}>
      {v ? (
        <div style={{ display: "grid", gap: 28, width: 940 }}>
          <Kicker delay={0}>Tudo em uma página</Kicker>
          <WordReveal text="Do cidadão à categoria." delay={4} italicFrom={2} style={display(78)} />
        </div>
      ) : (
        <div style={{ display: "grid", gap: 40 }}>
          <Kicker delay={0}>Tudo em uma página</Kicker>
          <WordReveal text="Do cidadão à categoria." delay={4} italicFrom={2} style={{ ...display(76), width: 470 }} />
          {list}
        </div>
      )}
      <Entrance delay={2} y={80}>
        <Browser src="img/site-full.jpg" width={bw} height={bh} scrollStart={14} scrollEnd={durationInFrames - 16} scrollTo={end} zoom={[1, 1]} />
      </Entrance>
    </AbsoluteFill>
  );
};

/* 4 · Para o cidadão */
export const Citizen: React.FC = () => {
  const v = useIsV();
  return (
    <AbsoluteFill style={{ flexDirection: v ? "column" : "row", alignItems: "center", justifyContent: "center", gap: v ? 60 : 90, padding: v ? 70 : 110 }}>
      <div style={{ width: v ? 920 : 560, display: "grid", gap: 26, textAlign: v ? "center" : "left", justifyItems: v ? "center" : "start" }}>
        <Kicker delay={0}>Para o cidadão</Kicker>
        <WordReveal text="O caminho certo até o canal oficial." delay={6} italicFrom={3} style={{ ...display(v ? 80 : 74), justifyContent: v ? "center" : "flex-start" }} />
        <Entrance delay={BEAT * 2}><div style={body(v ? 29 : 25)}>Certidões, escrituras, protesto e a busca por cartórios, explicados em linguagem simples.</div></Entrance>
      </div>
      <div style={{ position: "relative", width: v ? 920 : 1000, height: v ? 760 : 620 }}>
        <Entrance delay={4} y={70} style={{ position: "absolute", left: 0, top: v ? 0 : 30 }}>
          <Card src="img/sec-cidadania.png" width={v ? 860 : 900} height={v ? 470 : 470} position="70% 30%" zoom={[1.02, 1.1]} pan={[0, -18]} />
        </Entrance>
        <Entrance delay={BEAT + 6} y={140} style={{ position: "absolute", right: v ? 0 : -20, bottom: v ? 0 : -60 }}>
          <Phone src="img/mob-servicos.jpg" height={v ? 520 : 560} scrollTo={v ? 160 : 170} start={BEAT * 3} end={BEAT * 7} />
        </Entrance>
      </div>
    </AbsoluteFill>
  );
};

/* 5 · Comissões */
const Counter: React.FC<{ to: number; label: string; delay: number; size: number }> = ({ to, label, delay, size }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = useSpring(delay, "snappy");
  const val = interpolate(f, [delay, delay + fps * 1.1], [0, to], { ...clamp, easing: theme.ease.out });
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 22, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)` }}>
      <span style={{ ...display(size), fontVariantNumeric: "tabular-nums", minWidth: size * 1.1 }}>{Math.round(val)}</span>
      <span style={{ ...body(size * 0.28), color: C.text, fontWeight: 600 }}>{label}</span>
    </div>
  );
};
export const Commissions: React.FC = () => {
  const v = useIsV();
  return (
    <AbsoluteFill style={{ flexDirection: v ? "column" : "row", alignItems: "center", justifyContent: "center", gap: v ? 60 : 100, padding: v ? 70 : 110 }}>
      <div style={{ display: "grid", gap: v ? 18 : 22, width: v ? 920 : 560 }}>
        <Kicker delay={0}>Quem faz. O que acontece.</Kicker>
        <div style={{ height: 10 }} />
        <Counter to={14} label="comissões temáticas" delay={6} size={v ? 120 : 112} />
        <Counter to={12} label="diretorias regionais" delay={12} size={v ? 120 : 112} />
        <Counter to={38} label="projetos no acervo" delay={18} size={v ? 120 : 112} />
      </div>
      <Entrance delay={8} y={90}>
        <Card src="img/sec-comissoes.png" width={v ? 920 : 980} height={v ? 700 : 740} zoom={[1, 1.05]} pan={[0, 0]} position="50% 50%" inset={v ? 34 : 40} />
      </Entrance>
    </AbsoluteFill>
  );
};

/* 6 · Virada: área de membros */
export const MembersTitle: React.FC = () => {
  const v = useIsV();
  const f = useCurrentFrame();
  const sc = interpolate(f, [0, BAR], [0.97, 1.03], { ...clamp, easing: theme.ease.soft });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 80 }}>
      <div style={{ display: "grid", justifyItems: "center", gap: 30, transform: `scale(${sc})`, textAlign: "center" }}>
        <Kicker delay={2} size={v ? 26 : 24}>E para quem faz a ANOREG</Kicker>
        <WordReveal text="Área de membros" delay={10} per={5} italicFrom={2} gold style={{ ...display(v ? 136 : 150), justifyContent: "center" }} />
      </div>
    </AbsoluteFill>
  );
};

/* 7 · Painel do associado */
export const Painel: React.FC = () => {
  const v = useIsV();
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const bw = v ? 940 : 1180, bh = v ? 640 : 760;
  const imgH = bw * ratio("painel");
  const items = [["1", "Menu organizado por grupos", "Início, participação, conhecimento"], ["2", "Metas com pontos", "Próximos passos sempre à vista"], ["3", "Continue aprendendo", "A trilha retoma de onde parou"], ["4", "Comunicados e selos", "Leitura confirmada, conquistas"]];
  const active = Math.min(3, Math.floor(interpolate(f, [BEAT * 2, durationInFrames - 20], [0, 4], clamp)));
  return (
    <AbsoluteFill style={{ flexDirection: v ? "column" : "row", alignItems: "center", justifyContent: "center", gap: v ? 50 : 70, padding: v ? 70 : 90 }}>
      <Entrance delay={0} y={90}>
        <Browser src="img/portal-painel.jpg" width={bw} height={bh} scrollStart={BEAT * 4} scrollEnd={durationInFrames - 14} scrollTo={imgH * 0.26} zoom={[1, 1.03]} label="Área de membros · Visão geral" />
      </Entrance>
      <div style={{ display: "grid", gap: v ? 14 : 16, width: v ? 940 : 520 }}>
        <Kicker delay={4}>Seu painel</Kicker>
        <WordReveal text="Tudo em ordem, à primeira vista." delay={8} italicFrom={3} style={{ ...display(v ? 70 : 62), marginBottom: 14 }} />
        {items.map(([n, t, d], i) => <Callout key={n} n={n} title={t} text={v ? undefined : d} delay={BEAT * 2 + i * 6} active={i === active} size={v ? 0.95 : 0.9} />)}
      </div>
    </AbsoluteFill>
  );
};

/* 8 · Jornada: pontos, níveis e selos */
const LEVELS = ["Ingresso", "Participante", "Colaborador", "Articulador", "Referência", "Membro notável"];
const SEALS = [["flag", "Primeiro acesso"], ["bell", "Bem informado"], ["cap", "Primeira etapa"], ["seal", "Trilha concluída"], ["pen", "Prática refletida"], ["calendar", "Presença marcada"], ["book", "Pesquisador"], ["users", "Voz da comissão"]];
const EARN = [0, 2, 5, 1, 3];
export const Jornada: React.FC = () => {
  const v = useIsV();
  const f = useCurrentFrame();
  const pts = interpolate(f, [10, 10 + BAR * 1.5], [0, 320], { ...clamp, easing: theme.ease.soft });
  const lvl = pts >= 300 ? 3 : pts >= 120 ? 2 : 1;
  const floors = [0, 120, 300, 550];
  const pct = (pts - floors[lvl - 1]) / (floors[lvl] - floors[lvl - 1]);
  const earnedAt = (i: number) => { const k = EARN.indexOf(i); return k < 0 ? Infinity : 24 + k * 16; };
  const ringSize = v ? 420 : 400;
  const ringP = useSpring(4, "smooth");
  const levelPop = useSpring(lvl === 3 ? 10 + BAR * 1.5 * 0.94 : lvl === 2 ? 40 : 999, "bouncy");
  return (
    <AbsoluteFill style={{ flexDirection: v ? "column" : "row", alignItems: "center", justifyContent: "center", gap: v ? 60 : 110, padding: v ? 70 : 110 }}>
      <div style={{ display: "grid", justifyItems: "center", gap: 30 }}>
        <div style={{ transform: `scale(${interpolate(ringP, [0, 1], [0.8, 1])})`, opacity: ringP }}>
          <Ring pct={Math.min(1, pct)} size={ringSize} stroke={18}>
            <div>
              <div style={{ ...display(ringSize * 0.3), fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{Math.round(pts)}</div>
              <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.16em", color: C.textDim, marginTop: 10 }}>PONTOS</div>
            </div>
          </Ring>
        </div>
        <div style={{ textAlign: "center", transform: `scale(${1 + 0.06 * Math.sin(Math.min(1, levelPop) * Math.PI)})` }}>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: "0.16em", color: C.textDim }}>NÍVEL {lvl} DE 6</div>
          <div style={{ ...display(64), marginTop: 6 }}>{LEVELS[lvl - 1]}</div>
        </div>
      </div>
      <div style={{ display: "grid", gap: 30, width: v ? 940 : 820 }}>
        <Kicker delay={2}>Minha jornada</Kicker>
        <WordReveal text="Participar vale pontos, níveis e selos." delay={6} italicFrom={2} style={display(v ? 72 : 66)} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: v ? 22 : 18, marginTop: 10 }}>
          {SEALS.map(([ic, t], i) => {
            const p = useSpring(14 + i * 4, "snappy");
            const earned = f >= earnedAt(i);
            const pop = useSpring(earnedAt(i) === Infinity ? 9999 : earnedAt(i), "bouncy");
            const s = (v ? 150 : 128) * (1 + 0.12 * Math.sin(Math.min(1, pop) * Math.PI));
            return (
              <div key={t} style={{ display: "grid", justifyItems: "center", gap: 10, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)` }}>
                <div style={{ width: v ? 150 : 128, height: v ? 150 : 128, display: "grid", placeItems: "center", filter: earned ? `drop-shadow(0 10px 24px rgba(0,0,0,0.45))` : undefined }}>
                  <Seal icon={ic} earned={earned} size={s} />
                </div>
                <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: v ? 22 : 19, color: earned ? C.text : "rgba(255,255,255,0.45)", textAlign: "center" }}>{t}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* 9 · Academia */
export const Trilha: React.FC = () => {
  const v = useIsV();
  const f = useCurrentFrame();
  const steps = ["Conteúdo", "Aplicação", "Selo da trilha"];
  const active = Math.min(2, Math.floor(interpolate(f, [BEAT * 2, BEAT * 7], [0, 3], clamp)));
  const bw = v ? 940 : 1180, bh = v ? 720 : 740;
  return (
    <AbsoluteFill style={{ flexDirection: v ? "column-reverse" : "row-reverse", alignItems: "center", justifyContent: "center", gap: v ? 50 : 80, padding: v ? 70 : 100 }}>
      <Entrance delay={0} y={90}>
        <Browser src="img/portal-trilha.jpg" width={bw} height={bh} scrollStart={BEAT * 3} scrollEnd={BEAT * 7} scrollTo={bw * ratio("trilha") * 0.12} zoom={[1, 1.04]} label="ANOREG Academia · Trilha" />
      </Entrance>
      <div style={{ display: "grid", gap: 26, width: v ? 940 : 520 }}>
        <Kicker delay={2}>ANOREG Academia</Kicker>
        <WordReveal text="Aprender no seu ritmo, com progresso visível." delay={6} italicFrom={4} style={display(v ? 70 : 62)} />
        <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "nowrap" }}>
          {steps.map((s, i) => {
            const p = useSpring(BEAT * 2 + i * 5, "snappy");
            const on = i === active;
            return (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: 999, border: `1px solid ${on ? "rgba(244,210,31,0.6)" : C.line}`, background: on ? "rgba(244,210,31,0.12)" : "rgba(255,255,255,0.04)", fontFamily: theme.fonts.body, fontWeight: 700, fontSize: v ? 26 : 21, whiteSpace: "nowrap", color: C.text, opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.85, 1])})` }}>
                <span style={{ display: "grid", placeItems: "center", width: 30, height: 30, borderRadius: "50%", background: on ? C.primary : "rgba(255,255,255,0.12)", color: on ? C.bg : C.text, fontSize: 16 }}>{i + 1}</span>
                {s}
              </div>
            );
          })}
        </div>
        <Entrance delay={BEAT * 4}><div style={body(v ? 28 : 24)}>Cada módulo concluído soma 40 pontos. No fim da trilha, um selo.</div></Entrance>
      </div>
    </AbsoluteFill>
  );
};

/* 10 · No celular */
export const Mobile: React.FC = () => {
  const v = useIsV();
  const f = useCurrentFrame();
  const h = v ? 860 : 740;
  const phones = [["img/mob-home.jpg", -1], ["img/mob-painel.jpg", 0], ["img/mob-jornada.jpg", 1]] as const;
  return (
    <AbsoluteFill style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", gap: v ? 70 : 46, padding: 70 }}>
      <div style={{ display: "grid", justifyItems: "center", gap: 22, textAlign: "center" }}>
        <Kicker delay={0}>Em qualquer tela</Kicker>
        <WordReveal text="Pronto para o celular." delay={5} italicFrom={2} style={{ ...display(v ? 86 : 74), justifyContent: "center" }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: v ? 0 : 50, height: h }}>
        {phones.map(([src, k], i) => {
          const p = useSpring(6 + i * 5, "smooth");
          const drift = Math.sin((f + i * 20) / 28) * 6;
          const side = v ? k * -60 : 0;
          return (
            <div key={src} style={{ zIndex: k === 0 ? 2 : 1, marginLeft: v && i ? -140 : 0, opacity: interpolate(p, [0, 0.4], [0, 1], clamp), transform: `translateY(${interpolate(p, [0, 1], [160, 0]) + drift + (k === 0 ? -20 : 20)}px) rotate(${k * (v ? 6 : 3)}deg) translateX(${side}px) scale(${k === 0 ? 1 : 0.9})` }}>
              <Phone src={src} height={h * (k === 0 ? 1 : 0.92)} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* 11 · Encerramento */
export const Outro: React.FC = () => {
  const v = useIsV();
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const fade = interpolate(f, [durationInFrames - 34, durationInFrames - 2], [0, 1], { ...clamp, easing: theme.ease.inOut });
  const breathe = 1 + Math.sin(f / 26) * 0.006;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: v ? 64 : 50, padding: 90, transform: `scale(${breathe})` }}>
        <LogoPlate width={v ? 600 : 480} delay={4} />
        <div style={{ display: "grid", justifyItems: "center", gap: 18, textAlign: "center" }}>
          <WordReveal text="Conectando cartórios." delay={BEAT + 4} style={{ ...display(v ? 84 : 80), justifyContent: "center" }} />
          <WordReveal text="Fortalecendo a cidadania." delay={BEAT * 2 + 2} italicFrom={0} gold style={{ ...display(v ? 84 : 80), justifyContent: "center" }} />
        </div>
        <Entrance delay={BEAT * 4}>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: v ? 24 : 22, letterSpacing: "0.16em", textTransform: "uppercase", color: C.textDim }}>ANOREG Pernambuco · Proposta de portal</div>
        </Entrance>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: C.bg, opacity: fade }} />
    </AbsoluteFill>
  );
};

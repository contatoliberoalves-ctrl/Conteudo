// As cenas do molde. Cada formato do plano é um tipo de cena:
// gancho, frase, placar, cedula, documentos, cartas, pausa, linha, pergunta.
// Cada tipo exporta o componente e os sons (com os mesmos tempos da animação).
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import type { CenaPronta } from "../tipos";
import { Carimbo, Entra, Marcado, clamp, useEntrada } from "../comp/base";

type P = { c: CenaPronta };
export type Som = { src: string; em: number; vol: number };

const T = theme;
const areaGrafico: React.CSSProperties = { position: "absolute", left: T.area.lado, right: T.area.lado, top: 330, height: 930, display: "flex", flexDirection: "column", justifyContent: "center" };
const seg = (s: number, fps: number) => Math.round(s * fps);
const norm = (t: string) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
/** Momento de um evento da cena: número = segundos; texto = a palavra da fala em que acontece (ex.: "trezentos"). */
const momento = (c: CenaPronta, v: unknown, fps: number, padrao: number) => {
  if (typeof v === "number") return seg(v, fps);
  if (typeof v === "string" && v) {
    const alvo = norm(v);
    const p = c.palavras.find((w) => norm(w.w).startsWith(alvo));
    if (p) return p.ini;
  }
  return padrao;
};
const tamTitulo = (linhas: string[], max = 170, min = 78) => {
  const maior = Math.max(...linhas.map((l) => l.replace(/\*\*/g, "").length));
  return Math.max(min, Math.min(max, Math.floor(1700 / Math.max(1, maior))));
};

/** Palavras de um título entrando uma a uma, com quebras de linha (\n) e trechos ** ** em lacre. */
const TituloRevelado: React.FC<{ texto: string; atraso?: number; tam: number; por?: number; alinhar?: "left" | "center" }> = ({ texto, atraso = 0, tam, por = 3, alinhar = "left" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  let k = 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: tam * 0.08, alignItems: alinhar === "center" ? "center" : "flex-start", textAlign: alinhar }}>
      {texto.split("\n").map((linha, li) => (
        <div key={li} style={{ display: "flex", flexWrap: "wrap", columnGap: tam * 0.26, justifyContent: alinhar === "center" ? "center" : "flex-start" }}>
          {linha.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).flatMap((trecho, ti) => {
            const lacre = trecho.startsWith("**");
            return trecho.replace(/\*\*/g, "").split(" ").filter(Boolean).map((w, wi) => {
              const p = spring({ frame: f - atraso - k++ * por, fps, config: T.mola.seca });
              return (
                <span key={`${ti}-${wi}`} style={{ display: "inline-block", opacity: p, color: lacre ? T.cor.lacre : T.cor.texto,
                  transform: `translateY(${interpolate(p, [0, 1], [tam * 0.35, 0])}px) scale(${interpolate(p, [0, 1], [1.08, 1])})`,
                  filter: p < 0.97 ? `blur(${interpolate(p, [0, 1], [8, 0])}px)` : undefined }}>{w}</span>
              );
            });
          })}
        </div>
      ))}
    </div>
  );
};

const Respira: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return <div style={{ transform: `scale(${1 + Math.sin(f / 26) * 0.008}) translateY(${Math.sin(f / 34) * 3}px)` }}>{children}</div>;
};

// ───────────────────────── gancho ─────────────────────────
// { texto: "298 a 65.\nE **perdeu.**", selo?: "1984", imagem?: { arquivo: "imagens/x.jpg", credito: "Foto: …", foco?: "50% 30%" } }
// Com imagem vira a CAPA: foto em tela cheia (sépia, zoom lento), título condensado em caixa alta e a palavra-chave em tarja.
const TituloCapa: React.FC<{ texto: string; tam: number; atraso?: number; estatico?: boolean }> = ({ texto, tam, atraso = 0, estatico }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  let k = 0;
  const anima = (i: number) => (estatico ? 1 : spring({ frame: f - atraso - i * 4, fps, config: T.mola.seca }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: tam * 0.06, alignItems: "flex-start" }}>
      {texto.split("\n").map((linha, li) => (
        <div key={li} style={{ display: "flex", flexWrap: "wrap", columnGap: tam * 0.24, rowGap: tam * 0.06, alignItems: "center" }}>
          {linha.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).flatMap((trecho, ti) => {
            if (trecho.startsWith("**")) {
              const p = anima(k++);
              return [<span key={ti} style={{ display: "inline-block", background: T.cor.lacre, color: T.cor.papel, padding: `${tam * 0.02}px ${tam * 0.14}px ${tam * 0.04}px`,
                transform: `scale(${interpolate(p, [0, 1], [1.5, 1])}) rotate(${interpolate(p, [0, 1], [-4, -1.5])}deg)`, opacity: Math.min(1, p * 1.6),
                boxShadow: "0 12px 40px rgba(0,0,0,0.55)" }}>{trecho.slice(2, -2)}</span>];
            }
            return trecho.split(" ").filter(Boolean).map((w, wi) => {
              const p = anima(k++);
              return <span key={`${ti}-${wi}`} style={{ display: "inline-block", opacity: p, color: T.cor.texto, textShadow: "0 6px 30px rgba(0,0,0,0.9)",
                transform: `translateY(${interpolate(p, [0, 1], [tam * 0.4, 0])}px)` }}>{w}</span>;
            });
          })}
        </div>
      ))}
    </div>
  );
};

export const CapaFoto: React.FC<{ c: CenaPronta; estatico?: boolean }> = ({ c, estatico }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const im = c.imagem as { arquivo: string; credito?: string; foco?: string; zoom?: number };
  const zoom = estatico ? 1.06 : interpolate(f, [0, c.dur], [1.0, 1.1], { ...clamp, easing: T.ease.inOut });
  const deriva = estatico ? 0 : interpolate(f, [0, c.dur], [0, -30], clamp);
  const linhas = String(c.texto).replace(/\*\*/g, "").split("\n");
  const tam = Math.max(84, Math.min(150, Math.floor(1500 / Math.max(...linhas.map((l) => l.length)))));
  const luz = estatico ? 1 : spring({ frame: f, fps, config: { damping: 30, stiffness: 40 } });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img src={staticFile(im.arquivo)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: im.foco ?? "50% 35%",
          transform: `scale(${zoom * (im.zoom ?? 1)}) translateY(${deriva}px)`, transformOrigin: im.foco ?? "50% 35%", filter: `grayscale(1) sepia(0.45) contrast(1.15) brightness(${0.35 + 0.35 * luz})` }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${T.cor.fundo}cc 0%, transparent 22%, transparent 34%, ${T.cor.fundo}e6 62%, ${T.cor.fundo} 100%)` }} />
      <div style={{ position: "absolute", left: T.area.lado, right: T.area.lado, bottom: 1920 - 1250, fontFamily: T.fonte.legenda, fontWeight: 700,
        fontSize: tam, lineHeight: 0.98, textTransform: "uppercase", letterSpacing: -0.5 }}>
        <TituloCapa texto={c.texto} tam={tam} estatico={estatico} />
      </div>
      {im.credito ? <div style={{ position: "absolute", right: T.area.lado, bottom: 300, fontFamily: T.fonte.mono, fontSize: 20, color: T.cor.apagado, letterSpacing: 1, maxWidth: 700, textAlign: "right" }}>{im.credito}</div> : null}
    </AbsoluteFill>
  );
};

export const Gancho: React.FC<P> = ({ c }) => {
  if (c.imagem) return <CapaFoto c={c} />;
  const linhas = String(c.texto).split("\n");
  const tam = tamTitulo(linhas);
  return (
    <div style={{ ...areaGrafico, fontFamily: T.fonte.titulo, fontWeight: 700, fontSize: tam, lineHeight: 1.02, letterSpacing: -1 }}>
      <Respira><TituloRevelado texto={c.texto} tam={tam} por={4} /></Respira>
      {c.selo ? <div style={{ marginTop: 56 }}><Carimbo texto={c.selo} atraso={18} tam={52} /></div> : null}
    </div>
  );
};
Gancho.displayName = "Gancho";
export const sonsGancho = (c: CenaPronta): Som[] => [
  { src: "sfx/grave.wav", em: 0, vol: 0.9 },
  ...(c.selo && !c.imagem ? [{ src: "sfx/carimbo.wav", em: 17, vol: 0.8 }] : []),
  ...(c.imagem && /\*\*/.test(String(c.texto)) ? [{ src: "sfx/carimbo.wav", em: 4 * (String(c.texto).replace(/\*\*[^*]+\*\*/g, "X").split(/\s+/).length - 1), vol: 0.7 }] : []),
];

// ───────────────────────── frase ─────────────────────────
// { data?: "Abril de 1984", texto: "...", nota?: "..." }
export const Frase: React.FC<P> = ({ c }) => {
  const linhas = String(c.texto).split("\n");
  const tam = tamTitulo(linhas, 104, 64);
  return (
    <div style={{ ...areaGrafico, gap: 36 }}>
      {c.data ? (
        <Entra><div style={{ display: "flex", alignItems: "center", gap: 22, fontFamily: T.fonte.mono, fontWeight: 600, fontSize: 36, letterSpacing: 5,
          color: T.cor.apagado, textTransform: "uppercase" }}><span style={{ width: 60, height: 3, background: T.cor.apagado }} />{c.data}</div></Entra>
      ) : null}
      <div style={{ fontFamily: T.fonte.titulo, fontWeight: 700, fontSize: tam, lineHeight: 1.1 }}>
        <Respira><TituloRevelado texto={c.texto} atraso={c.data ? 6 : 0} tam={tam} por={2} /></Respira>
      </div>
      {c.nota ? <Entra atraso={22}><div style={{ fontFamily: T.fonte.texto, fontWeight: 500, fontSize: 40, lineHeight: 1.35, color: T.cor.apagado, maxWidth: 860 }}><Marcado texto={c.nota} /></div></Entra> : null}
    </div>
  );
};
export const sonsFrase = (): Som[] => [{ src: "sfx/whoosh.wav", em: 0, vol: 0.45 }];

// ───────────────────────── placar ─────────────────────────
// { a: 298, b: 65, rotuloA: "Sim", rotuloB: "Não", linha?: 320, rotuloLinha?: "Mínimo: 320", linhaEm?: s, carimbo?: "Rejeitada", titulo?: "Câmara · 25/4/1984" }
const tempoPlacar = (c: CenaPronta, fps: number) => {
  const linhaEm = momento(c, c.linhaEm, fps, Math.round(c.dur * 0.42));
  return { conta: 8, contaDur: seg(1.6, fps), linhaEm, carimboEm: linhaEm + seg(1.1, fps) };
};
export const Placar: React.FC<P> = ({ c }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = tempoPlacar(c, fps);
  const max = Math.max(c.a, c.b, c.linha ?? 0) * 1.12;
  const H = 600;
  const valor = (v: number) => interpolate(f, [t.conta, t.conta + t.contaDur], [0, v], { ...clamp, easing: T.ease.out });
  const linhaP = spring({ frame: f - t.linhaEm, fps, config: T.mola.suave });
  const linhaY = interpolate(linhaP, [0, 1], [0, (c.linha ?? 0) / max * H]);
  const titulo = useEntrada(0);
  const Barra = ({ v, rot, i }: { v: number; rot: string; i: number }) => {
    const atual = valor(v);
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: 300 }}>
        <div style={{ height: H, width: 220, display: "flex", alignItems: "flex-end", borderBottom: `3px solid ${T.cor.apagado}` }}>
          <div style={{ width: "100%", height: atual / max * H, background: i === 0 ? T.cor.papel : T.cor.papelSombra, opacity: i === 0 ? 1 : 0.55 }} />
        </div>
        <div style={{ fontFamily: T.fonte.titulo, fontWeight: 700, fontSize: 120, color: T.cor.texto, fontVariantNumeric: "tabular-nums", lineHeight: 1, marginTop: 10 }}>{Math.round(atual)}</div>
        <div style={{ fontFamily: T.fonte.mono, fontWeight: 600, fontSize: 34, letterSpacing: 4, color: T.cor.apagado, textTransform: "uppercase" }}>{rot}</div>
      </div>
    );
  };
  return (
    <div style={{ ...areaGrafico, alignItems: "center", gap: 28 }}>
      {c.titulo ? <div style={{ ...titulo.style, fontFamily: T.fonte.mono, fontSize: 32, letterSpacing: 4, color: T.cor.apagado, textTransform: "uppercase" }}>{c.titulo}</div> : null}
      <div style={{ position: "relative", display: "flex", gap: 120 }}>
        <Barra v={c.a} rot={c.rotuloA ?? "Sim"} i={0} />
        <Barra v={c.b} rot={c.rotuloB ?? "Não"} i={1} />
        {c.linha ? (
          <div style={{ position: "absolute", left: -60, right: -60, top: H - linhaY, opacity: Math.min(1, linhaP * 3), borderTop: `5px dashed ${T.cor.lacre}` }}>
            <div style={{ position: "absolute", right: 0, top: -58, fontFamily: T.fonte.mono, fontWeight: 600, fontSize: 36, color: T.cor.lacre, letterSpacing: 2 }}>{c.rotuloLinha ?? c.linha}</div>
          </div>
        ) : null}
        {c.carimbo ? <div style={{ position: "absolute", left: 0, right: 0, top: H * 0.45, display: "flex", justifyContent: "center" }}><Carimbo texto={c.carimbo} atraso={t.carimboEm} tam={78} /></div> : null}
      </div>
    </div>
  );
};
export const sonsPlacar = (c: CenaPronta, fps: number): Som[] => {
  const t = tempoPlacar(c, fps);
  const tiques = Array.from({ length: 12 }, (_, i) => ({ src: "sfx/tique.wav", em: t.conta + Math.round(i * t.contaDur / 12), vol: 0.35 }));
  return [
    ...tiques,
    ...(c.linha ? [{ src: "sfx/subida.wav", em: t.linhaEm - seg(1.2, fps), vol: 0.5 }, { src: "sfx/grave.wav", em: t.linhaEm + 6, vol: 0.8 }] : []),
    ...(c.carimbo ? [{ src: "sfx/carimbo.wav", em: t.carimboEm - 1, vol: 0.9 }] : []),
  ];
};

// ───────────────────────── cédula ─────────────────────────
// { titulo?: "Plebiscito · 21/4/1993", pergunta: "...", opcoes: ["República", "Monarquia"], vencedor?: 0, resultados?: ["66%", "10%"], contagem?: true, revelaEm?: s }
const tempoCedula = (c: CenaPronta, fps: number) => {
  const contaEm = seg(1.0, fps);
  const ultima = c.palavras.length ? c.palavras[c.palavras.length - 1].fim + (c.contagem === false ? 8 : 3 * fps + 4) : Math.round(c.dur * 0.6);
  const revelaEm = momento(c, c.revelaEm, fps, Math.min(ultima, c.dur - fps * 2));
  return { contaEm, revelaEm };
};
export const Cedula: React.FC<P> = ({ c }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = tempoCedula(c, fps);
  const papel = useEntrada(0);
  const revela = c.vencedor != null && f >= t.revelaEm;
  const marca = spring({ frame: f - t.revelaEm, fps, config: T.mola.carimbo });
  const restante = c.contagem === false ? 0 : Math.ceil((t.revelaEm - f) / fps);
  const mostraConta = c.contagem !== false && f >= t.contaEm && f < t.revelaEm && restante <= 3;
  return (
    <div style={{ ...areaGrafico, alignItems: "center" }}>
      <div style={{ ...papel.style, transform: `${papel.style.transform} rotate(-1.5deg)`, background: T.cor.papel, color: T.cor.tinta, width: 860, padding: "54px 60px",
        boxShadow: "0 40px 90px rgba(0,0,0,0.6)", display: "flex", flexDirection: "column", gap: 34, position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: T.fonte.mono, fontWeight: 600, fontSize: 28, letterSpacing: 5, textTransform: "uppercase", borderBottom: `2px solid ${T.cor.tinta}`, paddingBottom: 18 }}>
          <span>Cédula</span><span>{c.titulo ?? ""}</span>
        </div>
        <div style={{ fontFamily: T.fonte.titulo, fontWeight: 700, fontSize: 60, lineHeight: 1.12 }}>{c.pergunta}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          {(c.opcoes as string[]).map((o, i) => {
            const e = spring({ frame: f - 10 - i * 5, fps, config: T.mola.seca });
            const venceu = revela && i === c.vencedor;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 30, opacity: e * (revela && !venceu ? 0.45 : 1), transform: `translateX(${interpolate(e, [0, 1], [40, 0])}px)` }}>
                <div style={{ width: 74, height: 74, border: `5px solid ${T.cor.tinta}`, position: "relative", flex: "none" }}>
                  {venceu ? <div style={{ position: "absolute", inset: -10, fontFamily: T.fonte.texto, fontWeight: 700, fontSize: 96, lineHeight: "84px", textAlign: "center", color: T.cor.lacre, transform: `scale(${interpolate(marca, [0, 1], [2, 1])}) rotate(-6deg)`, opacity: Math.min(1, marca * 2) }}>✕</div> : null}
                </div>
                <div style={{ fontFamily: T.fonte.texto, fontWeight: 600, fontSize: o.length > 13 ? 46 : 54 }}>{String.fromCharCode(65 + i)}) {o}</div>
                {revela && c.resultados?.[i] ? <div style={{ marginLeft: "auto", fontFamily: T.fonte.mono, fontWeight: 600, fontSize: 34, opacity: Math.min(1, marca) }}>{c.resultados[i]}</div> : null}
              </div>
            );
          })}
        </div>
      </div>
      {mostraConta ? (
        <div style={{ marginTop: 50, fontFamily: T.fonte.mono, fontWeight: 600, fontSize: 40, letterSpacing: 4, color: T.cor.apagado, textTransform: "uppercase", display: "flex", gap: 24, alignItems: "baseline" }}>
          <span>Vota nos comentários</span><span style={{ fontSize: 92, color: T.cor.texto, fontVariantNumeric: "tabular-nums" }}>{restante}</span>
        </div>
      ) : null}
    </div>
  );
};
export const sonsCedula = (c: CenaPronta, fps: number): Som[] => {
  const t = tempoCedula(c, fps);
  const s: Som[] = [{ src: "sfx/whoosh.wav", em: 0, vol: 0.4 }];
  (c.opcoes as string[]).forEach((_, i) => s.push({ src: "sfx/tecla.wav", em: 10 + i * 5, vol: 0.5 }));
  if (c.contagem !== false) for (let k = 3; k >= 1; k--) s.push({ src: "sfx/tique.wav", em: t.revelaEm - k * fps, vol: 0.6 });
  if (c.vencedor != null) s.push({ src: "sfx/carimbo.wav", em: t.revelaEm - 1, vol: 0.9 });
  return s;
};

// ───────────────────────── documentos ─────────────────────────
// { a: { cabecalho: "CF/88 · art. 5º, LXVII", texto: "... **prisão** ..." }, b: {...}, ponte?: "2008 · STF", segundoEm?: s }
const tempoDocs = (c: CenaPronta, fps: number) => ({ segundoEm: momento(c, c.segundoEm, fps, Math.round(c.dur * 0.42)) });
const Folha: React.FC<{ d: { cabecalho: string; texto: string }; atraso: number; giro: number }> = ({ d, atraso, giro }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: f - atraso, fps, config: T.mola.suave });
  const chars = Math.round(interpolate(f, [atraso + 6, atraso + 6 + d.texto.length * 0.55], [0, d.texto.length], clamp));
  // Datilografa o texto, mantendo os trechos ** ** marcados
  let usados = 0;
  const partes = d.texto.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((t, i) => {
    const marc = t.startsWith("**"), puro = marc ? t.slice(2, -2) : t;
    const vis = puro.slice(0, Math.max(0, chars - usados)); usados += puro.length;
    return marc
      ? <span key={i} style={{ boxShadow: `inset 0 -0.42em 0 ${T.cor.lacre}55`, color: T.cor.tinta }}>{vis}</span>
      : <span key={i}>{vis}</span>;
  });
  return (
    <div style={{ opacity: e, transform: `translateY(${interpolate(e, [0, 1], [80, 0])}px) rotate(${giro}deg)`, background: T.cor.papel, color: T.cor.tinta,
      padding: "40px 48px", boxShadow: "0 30px 70px rgba(0,0,0,0.55)", display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ fontFamily: T.fonte.mono, fontWeight: 600, fontSize: 28, letterSpacing: 4, textTransform: "uppercase", borderBottom: `2px solid ${T.cor.tinta}`, paddingBottom: 14 }}>{d.cabecalho}</div>
      <div style={{ fontFamily: T.fonte.titulo, fontSize: 46, lineHeight: 1.32, minHeight: 120 }}>{partes}</div>
    </div>
  );
};
export const Documentos: React.FC<P> = ({ c }) => {
  const { fps } = useVideoConfig();
  const t = tempoDocs(c, fps);
  return (
    <div style={{ ...areaGrafico, gap: 30 }}>
      <Folha d={c.a} atraso={0} giro={-1.2} />
      {c.ponte ? <Entra atraso={t.segundoEm - 6}><div style={{ textAlign: "center", fontFamily: T.fonte.mono, fontWeight: 600, fontSize: 36, letterSpacing: 5, color: T.cor.apagado, textTransform: "uppercase" }}>↓ {c.ponte}</div></Entra> : null}
      <Folha d={c.b} atraso={t.segundoEm} giro={1.4} />
    </div>
  );
};
export const sonsDocumentos = (c: CenaPronta, fps: number): Som[] => {
  const t = tempoDocs(c, fps);
  const teclas = (ini: number, n: number) => Array.from({ length: Math.min(10, Math.ceil(n / 12)) }, (_, i) => ({ src: "sfx/tecla.wav", em: ini + 6 + i * 4, vol: 0.28 }));
  return [{ src: "sfx/whoosh.wav", em: 0, vol: 0.4 }, ...teclas(0, c.a.texto.length), { src: "sfx/whoosh.wav", em: t.segundoEm, vol: 0.4 }, ...teclas(t.segundoEm, c.b.texto.length)];
};

// ───────────────────────── cartas ─────────────────────────
// { cartas: [{ titulo: "Executivo", sub?: "..." , marcada?: true }], dono?: "Imperador", marcaEm?: s }
const tempoCartas = (c: CenaPronta, fps: number) => ({ marcaEm: momento(c, c.marcaEm, fps, Math.round(c.dur * 0.5)) });
export const Cartas: React.FC<P> = ({ c }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = tempoCartas(c, fps);
  const m = spring({ frame: f - t.marcaEm, fps, config: T.mola.suave });
  const lista = c.cartas as { titulo: string; sub?: string; marcada?: boolean }[];
  return (
    <div style={{ ...areaGrafico, alignItems: "center", gap: 46 }}>
      <div style={{ display: "grid", gridTemplateColumns: lista.length > 2 ? "1fr 1fr" : `repeat(${lista.length}, 1fr)`, gap: 34, width: "100%" }}>
        {lista.map((k, i) => {
          const e = spring({ frame: f - 4 - i * 6, fps, config: T.mola.seca });
          const giro = interpolate(e, [0, 1], [i % 2 ? 14 : -14, i % 2 ? 1.5 : -1.5]);
          const sobe = k.marcada ? interpolate(m, [0, 1], [0, -26]) : 0;
          const apaga = k.marcada ? 1 : interpolate(m, [0, 1], [1, c.dono ? 0.42 : 1]);
          return (
            <div key={i} style={{ opacity: e * apaga, transform: `translateY(${interpolate(e, [0, 1], [-260, 0]) + sobe}px) rotate(${giro}deg)`,
              background: T.cor.papel, color: T.cor.tinta, height: lista.length > 2 ? 330 : 420, padding: "34px 30px", display: "flex", flexDirection: "column", justifyContent: "space-between",
              boxShadow: "0 26px 60px rgba(0,0,0,0.55)", outline: k.marcada && m > 0.05 ? `6px solid ${T.cor.lacre}` : "none", outlineOffset: -14 }}>
              <div style={{ fontFamily: T.fonte.mono, fontSize: 26, letterSpacing: 4, opacity: 0.7 }}>{String(i + 1).padStart(2, "0")}</div>
              <div style={{ fontFamily: T.fonte.titulo, fontWeight: 700, fontSize: k.titulo.length > 11 ? 50 : 62, lineHeight: 1.05 }}>{k.titulo}</div>
              <div style={{ fontFamily: T.fonte.texto, fontWeight: 500, fontSize: lista.length > 2 ? 28 : 34, lineHeight: 1.25, minHeight: 36 }}>{k.sub ?? ""}</div>
            </div>
          );
        })}
      </div>
      {c.dono ? <Carimbo texto={c.dono} atraso={t.marcaEm + 8} tam={60} giro={-4} /> : null}
    </div>
  );
};
export const sonsCartas = (c: CenaPronta, fps: number): Som[] => {
  const t = tempoCartas(c, fps);
  return [
    ...(c.cartas as unknown[]).map((_, i) => ({ src: "sfx/whoosh.wav", em: 2 + i * 6, vol: 0.3 })),
    ...(c.dono ? [{ src: "sfx/carimbo.wav", em: t.marcaEm + 7, vol: 0.9 }] : []),
  ];
};

// ───────────────────────── pausa (porta congelada) ─────────────────────────
// { texto: "O que a polícia já sabia\nantes de abrir a porta?", rotulo?: "Pausa" }
export const Pausa: React.FC<P> = ({ c }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: f, fps, config: T.mola.carimbo });
  const pisca = Math.floor(f / (fps * 0.6)) % 2 === 0 ? 1 : 0.35;
  const linhas = String(c.texto).split("\n");
  const tam = tamTitulo(linhas, 96, 60);
  return (
    <div style={{ ...areaGrafico, gap: 60 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 30, opacity: e, transform: `scale(${interpolate(e, [0, 1], [1.6, 1])})`, transformOrigin: "left center" }}>
        <div style={{ display: "flex", gap: 22 }}>
          <div style={{ width: 38, height: 130, background: T.cor.lacre, opacity: pisca }} />
          <div style={{ width: 38, height: 130, background: T.cor.lacre, opacity: pisca }} />
        </div>
        <div style={{ fontFamily: T.fonte.mono, fontWeight: 600, fontSize: 48, letterSpacing: 8, textTransform: "uppercase", color: T.cor.apagado }}>{c.rotulo ?? "Pausa"}</div>
      </div>
      <div style={{ fontFamily: T.fonte.titulo, fontWeight: 700, fontSize: tam, lineHeight: 1.1 }}><Respira><TituloRevelado texto={c.texto} atraso={8} tam={tam} /></Respira></div>
    </div>
  );
};
export const sonsPausa = (): Som[] => [{ src: "sfx/grave.wav", em: 0, vol: 0.7 }];

// ───────────────────────── linha do tempo ─────────────────────────
// { marcos: [{ data: "1984", texto: "..." }], virada?: 2 }
export const Linha: React.FC<P> = ({ c }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const marcos = c.marcos as { data: string; texto: string }[];
  const passo = Math.max(10, Math.floor((c.dur - fps) / (marcos.length + 0.4)));
  const total = spring({ frame: f, fps, config: { damping: 30, stiffness: 30 } });
  return (
    <div style={{ ...areaGrafico, justifyContent: "center" }}>
      <div style={{ position: "relative", paddingLeft: 90, display: "flex", flexDirection: "column", gap: 54 }}>
        <div style={{ position: "absolute", left: 22, top: 20, bottom: 20, width: 4, background: T.cor.linha, transformOrigin: "top", transform: `scaleY(${total})` }} />
        {marcos.map((m, i) => {
          const em = 4 + i * passo;
          const e = spring({ frame: f - em, fps, config: T.mola.seca });
          const virada = c.virada === i;
          return (
            <div key={i} style={{ position: "relative", opacity: e, transform: `translateX(${interpolate(e, [0, 1], [50, 0])}px)` }}>
              <div style={{ position: "absolute", left: -84, top: 22, width: 32, height: 32, borderRadius: "50%", background: virada ? T.cor.lacre : T.cor.papel, transform: `scale(${e})` }} />
              <div style={{ fontFamily: T.fonte.titulo, fontWeight: 700, fontSize: 92, lineHeight: 1, color: virada ? T.cor.lacre : T.cor.texto, fontVariantNumeric: "tabular-nums" }}>{m.data}</div>
              <div style={{ fontFamily: T.fonte.texto, fontWeight: 500, fontSize: 42, lineHeight: 1.3, color: T.cor.papelSombra, marginTop: 8, maxWidth: 780 }}><Marcado texto={m.texto} cor={T.cor.texto} /></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export const sonsLinha = (c: CenaPronta, fps: number): Som[] => {
  const n = (c.marcos as unknown[]).length;
  const passo = Math.max(10, Math.floor((c.dur - fps) / (n + 0.4)));
  return Array.from({ length: n }, (_, i) => ({ src: c.virada === i ? "sfx/grave.wav" : "sfx/whoosh.wav", em: 3 + i * passo, vol: c.virada === i ? 0.7 : 0.35 }));
};

// ───────────────────────── pergunta (fecho + loop) ─────────────────────────
// { texto: "Faltar à votação deveria\ncontar como voto **contra?**", rotulo?: "Comenta" , loop?: true }
export const Pergunta: React.FC<P & { gancho?: CenaPronta }> = ({ c, gancho }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const linhas = String(c.texto).split("\n");
  const tam = tamTitulo(linhas, 100, 60);
  const loopEm = c.dur - Math.round(fps * 0.9);
  const usaLoop = c.loop !== false && gancho && f >= loopEm;
  if (usaLoop && gancho!.imagem) {
    const o = interpolate(f, [loopEm, loopEm + 6], [0, 1], clamp);
    return <AbsoluteFill style={{ opacity: o }}><CapaFoto c={gancho!} estatico /></AbsoluteFill>;
  }
  if (usaLoop) {
    // Último instante: o gancho já montado, para o fim encaixar no começo
    const gl = String(gancho!.texto).split("\n");
    const gt = tamTitulo(gl);
    const o = interpolate(f, [loopEm, loopEm + 6], [0, 1], clamp);
    return (
      <div style={{ ...areaGrafico, opacity: o, fontFamily: T.fonte.titulo, fontWeight: 700, fontSize: gt, lineHeight: 1.02, letterSpacing: -1 }}>
        <TituloRevelado texto={gancho!.texto} atraso={loopEm - 400} tam={gt} />
      </div>
    );
  }
  return (
    <div style={{ ...areaGrafico, gap: 44 }}>
      <Entra><div style={{ display: "inline-flex", fontFamily: T.fonte.mono, fontWeight: 600, fontSize: 40, letterSpacing: 8, textTransform: "uppercase", color: T.cor.fundo, background: T.cor.papel, padding: "10px 24px" }}>{c.rotulo ?? "Comenta"}</div></Entra>
      <div style={{ fontFamily: T.fonte.titulo, fontWeight: 700, fontSize: tam, lineHeight: 1.1 }}><Respira><TituloRevelado texto={c.texto} atraso={6} tam={tam} /></Respira></div>
    </div>
  );
};
export const sonsPergunta = (): Som[] => [{ src: "sfx/whoosh.wav", em: 0, vol: 0.4 }];

export const CENAS = {
  gancho: { C: Gancho, sons: sonsGancho },
  frase: { C: Frase, sons: sonsFrase },
  placar: { C: Placar, sons: sonsPlacar },
  cedula: { C: Cedula, sons: sonsCedula },
  documentos: { C: Documentos, sons: sonsDocumentos },
  cartas: { C: Cartas, sons: sonsCartas },
  pausa: { C: Pausa, sons: sonsPausa },
  linha: { C: Linha, sons: sonsLinha },
  pergunta: { C: Pergunta, sons: sonsPergunta },
} as const;

export { AbsoluteFill };

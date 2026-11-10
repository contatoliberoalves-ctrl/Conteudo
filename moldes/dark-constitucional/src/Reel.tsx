import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Acabamento, Etiqueta, Fundo, Saida, fontesCss } from "./comp/base";
import { Legenda } from "./comp/Legenda";
import { CENAS, CapaFoto, Pergunta } from "./cenas/cenas";
import type { Props } from "./tipos";

// No 16:9 as cenas (desenhadas para 1080×1920) entram numa "folha" reduzida e centralizada;
// a capa com foto e o loop final ocupam a tela inteira.
const ESCALA = 0.78;
const Folha: React.FC<{ deitado: boolean; children: React.ReactNode }> = ({ deitado, children }) =>
  deitado ? (
    <div style={{ position: "absolute", width: 1080, height: 1920, left: (1920 - 1080 * ESCALA) / 2, top: 125 - 330 * ESCALA,
      transform: `scale(${ESCALA})`, transformOrigin: "top left" }}>{children}</div>
  ) : <>{children}</>;

const LoopCapa: React.FC<{ dur: number; gancho: any }> = ({ dur, gancho }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ini = dur - Math.round(fps * 0.9);
  if (f < ini) return null;
  return <AbsoluteFill style={{ opacity: interpolate(f, [ini, ini + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}><CapaFoto c={gancho} estatico /></AbsoluteFill>;
};

export const Reel: React.FC<Props> = (props) => {
  const { fps, width, height } = useVideoConfig();
  const deitado = width > height;
  const gancho = props.cenas.find((c) => c.tipo === "gancho");
  return (
    <AbsoluteFill>
      <style>{fontesCss}</style>
      <Fundo />
      {props.cenas.map((c, i) => {
        const def = CENAS[c.tipo];
        if (!def) throw new Error(`Tipo de cena desconhecido: ${c.tipo}`);
        const Comp = def.C as React.FC<any>;
        return (
          <Sequence key={i} from={c.inicio} durationInFrames={c.dur} name={`${i + 1} · ${c.tipo}`}>
            {deitado && c.tipo === "gancho" && c.imagem ? (
              <Saida dur={c.dur}><Comp c={c} /></Saida>
            ) : (
              <Folha deitado={deitado}>
                <Saida dur={c.dur}>
                  {c.tipo === "pergunta" ? <Pergunta c={deitado && gancho?.imagem ? { ...c, loop: false } : c} gancho={gancho} /> : <Comp c={c} />}
                </Saida>
              </Folha>
            )}
            {deitado && c.tipo === "pergunta" && gancho?.imagem && c.loop !== false ? <LoopCapa dur={c.dur} gancho={gancho} /> : null}
            {props.capa ? null : <Legenda palavras={c.palavras} />}
            {c.audio ? <Audio src={staticFile(c.audio)} volume={1} /> : null}
            {def.sons(c as any, fps).filter((s) => s.em < c.dur).map((s, k) => (
              <Sequence key={k} from={Math.max(0, s.em)} durationInFrames={Math.max(1, c.dur - Math.max(0, s.em))}>
                <Audio src={staticFile(s.src)} volume={s.vol * (props.comVoz ? 0.7 : 1)} />
              </Sequence>
            ))}
          </Sequence>
        );
      })}
      <Audio src={staticFile("sfx/trilha.wav")} loop volume={props.comVoz ? 0.16 : 0.34} />
      <Etiqueta marca={props.marca} pauta={props.pauta} serie={props.serie} total={props.total} />
      <Acabamento />
    </AbsoluteFill>
  );
};

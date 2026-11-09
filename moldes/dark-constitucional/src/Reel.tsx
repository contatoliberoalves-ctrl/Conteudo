import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { Acabamento, Etiqueta, Fundo, Saida, fontesCss } from "./comp/base";
import { Legenda } from "./comp/Legenda";
import { CENAS, Pergunta } from "./cenas/cenas";
import type { Props } from "./tipos";

export const Reel: React.FC<Props> = (props) => {
  const { fps } = useVideoConfig();
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
            <Saida dur={c.dur}>
              {c.tipo === "pergunta" ? <Pergunta c={c} gancho={gancho} /> : <Comp c={c} />}
            </Saida>
            <Legenda palavras={c.palavras} />
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

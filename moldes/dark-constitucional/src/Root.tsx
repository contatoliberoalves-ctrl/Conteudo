import React from "react";
import { Composition } from "remotion";
import { Reel } from "./Reel";
import type { Props } from "./tipos";

const vazio: Props = { id: "exemplo", marca: "Arquivo Constitucional", cenas: [], total: 30, comVoz: false };

export const Root: React.FC = () => (
  <>
  <Composition
    id="Video169"
    component={Reel as unknown as React.FC<Record<string, unknown>>}
    width={1920}
    height={1080}
    fps={30}
    durationInFrames={30}
    defaultProps={vazio as unknown as Record<string, unknown>}
    calculateMetadata={({ props }) => ({ durationInFrames: Math.max(1, (props as unknown as Props).total) })}
  />
  <Composition
    id="Reel"
    component={Reel as unknown as React.FC<Record<string, unknown>>}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={30}
    defaultProps={vazio as unknown as Record<string, unknown>}
    calculateMetadata={({ props }) => ({ durationInFrames: Math.max(1, (props as unknown as Props).total) })}
  />
  </>
);

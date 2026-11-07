import React from "react";
import { AbsoluteFill, Audio, Composition, Sequence, continueRender, delayRender, staticFile } from "remotion";
import { BAR, FPS, TOTAL, fontFiles } from "./theme";
import { BgMesh, Grade, Grain, SceneExit, Vignette } from "./components";
import { Citizen, Commissions, Hero, Intro, Jornada, MembersTitle, Mobile, Outro, Painel, Scroll, Trilha } from "./scenes";

const fontHandle = delayRender("fontes");
Promise.all(fontFiles.map((f) => {
  const face = new FontFace(f.family, `url(${staticFile(f.file)}) format('woff2')`, { style: f.style, weight: f.weight });
  return face.load().then((l) => { (document.fonts as any).add(l); });
})).then(() => continueRender(fontHandle)).catch((e) => { console.error(e); continueRender(fontHandle); });

// [componente, compasso inicial, compassos]
const SCENES: [React.FC, number, number][] = [
  [Intro, 0, 2], [Hero, 2, 2], [Scroll, 4, 3], [Citizen, 7, 2], [Commissions, 9, 2],
  [MembersTitle, 11, 1], [Painel, 12, 3], [Jornada, 15, 3], [Trilha, 18, 2], [Mobile, 20, 2], [Outro, 22, 3],
];

export const Main: React.FC<{ music?: boolean }> = ({ music = true }) => (
  <AbsoluteFill style={{ background: "#0b0f33" }}>
    <BgMesh />
    {SCENES.map(([S, start, len], i) => (
      <Sequence key={i} from={start * BAR} durationInFrames={len * BAR}>
        <SceneExit dur={len * BAR} noExit={i === SCENES.length - 1}><S /></SceneExit>
      </Sequence>
    ))}
    <Grade />
    <Grain />
    <Vignette />
    {music && <Audio src={staticFile("music.wav")} />}
  </AbsoluteFill>
);

export const Root: React.FC = () => (
  <>
    <Composition id="Apresentacao16x9" component={Main} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />
    <Composition id="Reels9x16" component={Main} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
  </>
);

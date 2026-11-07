import { Easing } from "remotion";
import { FONT_FILES } from "./fontlist";

export const FPS = 30;
export const BEAT = 18; // 100 BPM a 30 fps
export const BAR = BEAT * 4; // 72 frames
export const TOTAL = BAR * 25; // 1800 frames = 60 s

export const theme = {
  colors: {
    bg: "#0b0f33",
    bgAlt: "#131950",
    navy: "#1b2270",
    navyMid: "#3c46a3",
    primary: "#f4d21f", // ouro do logo: um elemento por quadro
    text: "#ffffff",
    textDim: "#c3c8ec",
    paper: "#f7f6f2",
    ink: "#141738",
    line: "rgba(255,255,255,0.12)",
    glow: "rgba(244,210,31,0.35)",
  },
  fonts: { display: "Newsreader", body: "Manrope" },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    soft: Easing.bezier(0.45, 0, 0.2, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
  },
} as const;

export const fontFiles = FONT_FILES.filter((f) => f.file.endsWith("-latin.woff2"));

import { Easing } from "remotion";
export const theme = {
  colors: { bg: "#042F2A", bgAlt: "#053B34", primary: "#B4F7DF", accent: "#0E8A6E", text: "#FFFFFF", textDim: "#C5DED5", ink: "#053B34", warm: "#FFB86B", grid: "rgba(255,255,255,0.055)" },
  fonts: { display: "Manrope", body: "DM Sans" },
  ease: { out: Easing.bezier(0.16, 1, 0.3, 1), inOut: Easing.bezier(0.83, 0, 0.17, 1), in: Easing.bezier(0.7, 0, 0.84, 0) },
  spring: { snappy: { damping: 14, stiffness: 160, mass: 0.6 }, smooth: { damping: 20, stiffness: 90, mass: 1 }, bouncy: { damping: 11, stiffness: 170, mass: 0.7 } },
} as const;

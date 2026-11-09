// Identidade "arquivo à noite": fundo de arquivo escuro, papel envelhecido, um vermelho de lacre.
// Nenhuma cor, fonte ou curva fica fora daqui.
import { Easing } from "remotion";

export const theme = {
  cor: {
    fundo: "#0f0e0c",
    fundo2: "#1a1814",
    papel: "#e9dfc8",
    papelSombra: "#cdbf9f",
    tinta: "#1d1a15",
    texto: "#efe6d2",
    apagado: "#8f8676",
    linha: "#3a352d",
    lacre: "#c2453a", // a cor de destaque: no máximo um elemento por quadro
  },
  fonte: {
    titulo: "'Old Standard TT', 'Times New Roman', serif",
    texto: "'IBM Plex Sans', system-ui, sans-serif",
    legenda: "'IBM Plex Sans Condensed', 'IBM Plex Sans', sans-serif",
    mono: "'IBM Plex Mono', ui-monospace, monospace",
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  mola: {
    seca: { damping: 14, stiffness: 160, mass: 0.6 },
    suave: { damping: 20, stiffness: 90, mass: 1 },
    carimbo: { damping: 9, stiffness: 220, mass: 0.8 },
  },
  // Área útil no 9:16 (o Instagram cobre o topo e a base)
  area: { topo: 250, base: 1560, lado: 90 },
} as const;

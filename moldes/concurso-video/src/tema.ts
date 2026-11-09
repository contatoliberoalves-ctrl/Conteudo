// Fonte única de cores, fontes, curvas e molas do molde (identidade do Concurso com Líbero · Plataforma).
// Nunca escreva cor ou easing direto num componente: importe daqui.
import { Easing } from 'remotion';

export const W = 1080, H = 1920, FPS = 30;
// Atraso da narração em relação ao 1º quadro e sobra depois da última fala (segundos).
export const LEAD = 0.25, CAUDA = 1.4;

export const cor = {
  base: '#062A26',      // petróleo (fundo)
  base2: '#04312C',
  fundoCard: 'rgba(255,255,255,.06)',
  bordaCard: 'rgba(185,255,241,.16)',
  verde: '#0BA457',     // cor-herói: no máximo um elemento em destaque por quadro
  verdeEsc: '#078A4A',
  menta: '#B9FFF1',
  papel: '#F3F7F5',
  tinta: '#06201C',
  cinza: '#5E7A74',
  amarelo: '#FFB511',   // alerta, selo, "VS"
  erro: '#FF5A5F',
  branco: '#FFFFFF',
  txt: '#EFFFF6',
  txtDim: 'rgba(239,255,246,.72)',
};

export const fonte = {
  display: "'Big Shoulders Display', sans-serif", // títulos, números (caixa alta, 800–900)
  sora: "'Sora', sans-serif",                     // rótulos, selos, legendas
  corpo: "'Inter', sans-serif",                   // textos
};

export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.83, 0, 0.17, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
};

export const mola = {
  snappy: { damping: 14, stiffness: 160, mass: 0.6 },
  smooth: { damping: 20, stiffness: 90, mass: 1 },
  bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
  conta: { damping: 30, stiffness: 50, mass: 1 },
};

// Nome de cada série no cabeçalho.
export const SERIE: Record<string, string> = {
  curiosidade: 'Você sabia?',
  descomplica: 'Descomplica',
  edital: 'Edital na mão',
  dicas: 'Dica de estudo',
};
export const PERFIL = '@concursocomlibero';

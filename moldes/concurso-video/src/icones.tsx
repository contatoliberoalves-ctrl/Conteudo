import React from 'react';
import { cor } from './tema';

// Ícones de traço (SVG) desenhados com progresso p (0→1). Nada de emoji: tudo na paleta.
const T = (p: number, w = 7) => ({ fill: 'none', stroke: cor.menta, strokeWidth: w, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p });
const ICONES: Record<string, (p: number) => any> = {
  tatuagem: p => <><path d="M50 18 V82" {...T(p)} /><circle cx="50" cy="16" r="7" {...T(p)} /><path d="M34 34 H66" {...T(p)} /><path d="M20 58 C22 76 36 84 50 84 C64 84 78 76 80 58" {...T(p)} /><path d="M14 64 L20 56 L28 62 M86 64 L80 56 L72 62" {...T(p)} /></>,
  idade: p => <><path d="M26 12 H74 M26 88 H74" {...T(p)} /><path d="M30 12 C30 36 50 42 50 50 C50 58 30 64 30 88 M70 12 C70 36 50 42 50 50 C50 58 70 64 70 88" {...T(p)} /><path d="M38 80 H62" {...T(p, 9)} /></>,
  cerebro: p => <><rect x="20" y="14" width="60" height="76" rx="8" {...T(p)} /><path d="M38 10 H62 V22 H38 Z" {...T(p)} /><path d="M32 44 L38 50 L48 38 M32 68 L38 74 L48 62 M56 46 H70 M56 70 H70" {...T(p, 6)} /></>,
  nomeacao: p => <><path d="M24 10 H62 L78 26 V90 H24 Z" {...T(p)} /><path d="M62 10 V26 H78" {...T(p)} /><path d="M34 40 H66 M34 52 H58" {...T(p, 6)} /><circle cx="56" cy="72" r="13" {...T(p)} /><path d="M50 72 L55 77 L63 67" {...T(p, 6)} /></>,
  alerta: p => <><path d="M50 12 L90 84 H10 Z" {...T(p)} /><path d="M50 40 V60" {...T(p, 9)} /><circle cx="50" cy="72" r="2" {...T(p, 9)} /></>,
};
export const Icone: React.FC<{ nome: string; px: number; p: number }> = ({ nome, px, p }) =>
  <svg width={px} height={px} viewBox="0 0 100 100" style={{ display: 'block', overflow: 'visible' }}>{(ICONES[nome] || ICONES.alerta)(p)}</svg>;

export const Check: React.FC<{ px: number; p: number; fundo?: string; traco?: string }> = ({ px, p, fundo = cor.verde, traco = cor.branco }) =>
  <svg width={px} height={px} viewBox="0 0 100 100" style={{ display: 'block', flex: 'none' }}>
    <circle cx="50" cy="50" r="48" fill={fundo} transform={`scale(${Math.min(1, p * 1.3)})`} style={{ transformOrigin: '50px 50px' }} />
    <path d="M28 52 L44 67 L73 35" fill="none" stroke={traco} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, Math.min(1, p * 1.6 - 0.4))} />
  </svg>;

export const Exclama: React.FC<{ px: number; p: number }> = ({ px, p }) =>
  <svg width={px} height={px} viewBox="0 0 100 100" style={{ display: 'block', flex: 'none' }}>
    <circle cx="50" cy="50" r="48" fill={cor.amarelo} transform={`scale(${Math.min(1, p * 1.3)})`} style={{ transformOrigin: '50px 50px' }} />
    <path d="M50 24 V58" stroke={cor.tinta} strokeWidth="12" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, Math.min(1, p * 1.6 - 0.4))} />
    <circle cx="50" cy="76" r="7" fill={cor.tinta} opacity={p > 0.7 ? 1 : 0} />
  </svg>;

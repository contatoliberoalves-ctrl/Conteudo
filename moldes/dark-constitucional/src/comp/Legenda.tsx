import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import type { Palavra } from "../tipos";

/** Legenda queimada, palavra a palavra, em páginas de até ~24 caracteres. */
export const Legenda: React.FC<{ palavras: Palavra[] }> = ({ palavras }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const deitado = width > height;
  const MAX = deitado ? 40 : 24;
  if (!palavras.length) return null;
  const paginas: Palavra[][] = [];
  let atual: Palavra[] = [], tam = 0;
  for (const p of palavras) {
    const quebra = atual.length && (tam + p.w.length > MAX || /[.!?:]$/.test(atual[atual.length - 1].w));
    if (quebra) { paginas.push(atual); atual = []; tam = 0; }
    atual.push(p); tam += p.w.length + 1;
  }
  if (atual.length) paginas.push(atual);
  const pag = paginas.find((pg, i) => f < (paginas[i + 1]?.[0].ini ?? Infinity) && f >= pg[0].ini - 2);
  if (!pag) return null;
  const desde = f - pag[0].ini;
  return (
    <div style={{ position: "absolute", left: deitado ? 200 : theme.area.lado - 20, right: deitado ? 200 : theme.area.lado - 20, top: deitado ? 880 : 1330, display: "flex", justifyContent: "center",
      flexWrap: "wrap", columnGap: 18, rowGap: 4, fontFamily: theme.fonte.legenda, fontWeight: 700, fontSize: 70, lineHeight: 1.12,
      textAlign: "center", transform: `translateY(${Math.max(0, 10 - desde * 3)}px)`, opacity: Math.min(1, (desde + 3) / 4) }}>
      {pag.map((p, i) => {
        const dita = f >= p.ini;
        return (
          <span key={i} style={{ color: dita ? theme.cor.texto : theme.cor.apagado, opacity: dita ? 1 : 0.55,
            textShadow: "0 4px 18px rgba(0,0,0,0.85), 0 0 2px rgba(0,0,0,0.9)" }}>{p.w}</span>
        );
      })}
    </div>
  );
};

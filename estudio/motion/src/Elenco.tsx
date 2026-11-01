import React, {useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import {Personagem, Pose, TipoPersonagem, Expressao} from './personagens';

const LISTA: [TipoPersonagem, Pose, Expressao][] = [['lex', 'acena', 'feliz'], ['martelo', 'aponta', 'confiante'], ['ana', 'pensando', 'surpreso'], ['beto', 'explica', 'neutro']];

export const Elenco: React.FC = () => {
  const frame = useCurrentFrame();
  const [h] = useState(() => delayRender('fonte'));
  useEffect(() => {
    const f = new FontFace('Titulo', `url(${staticFile('fonts/BebasNeue-Regular.ttf')})`);
    f.load().then((ok) => { document.fonts.add(ok); continueRender(h); });
  }, [h]);
  return (
    <AbsoluteFill style={{background: '#EDE6D6'}}>
      <svg viewBox="0 0 1600 700" width="100%" height="100%">
        {LISTA.map(([t, p, e], i) => (
          <g key={t} transform={`translate(${i * 400} 60)`}>
            <Personagem tipo={t} frame={frame} boca={(Math.sin(frame / 3) + 1) / 2 * (i % 2 ? 1 : 0.4)} pose={p} expressao={e} olhar={0.4} />
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

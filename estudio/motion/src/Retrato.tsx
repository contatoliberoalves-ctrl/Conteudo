import React, {useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, staticFile} from 'remotion';
import {Expressao, Personagem, Pose, TipoPersonagem} from './personagens';

// Um personagem parado, fundo transparente (para o editor do estúdio).
export const Retrato: React.FC<{tipo: TipoPersonagem; pose: Pose; expressao: Expressao}> = ({tipo, pose, expressao}) => {
  const [h] = useState(() => delayRender('fonte'));
  useEffect(() => {
    const f = new FontFace('Titulo', `url(${staticFile('fonts/BebasNeue-Regular.ttf')})`);
    f.load().then((ok) => { document.fonts.add(ok); continueRender(h); });
  }, [h]);
  return (
    <AbsoluteFill style={{background: 'transparent'}}>
      <svg viewBox="-20 0 440 620" width="100%" height="100%">
        <Personagem tipo={tipo} frame={8} boca={0.15} pose={pose} expressao={expressao} olhar={0} />
      </svg>
    </AbsoluteFill>
  );
};

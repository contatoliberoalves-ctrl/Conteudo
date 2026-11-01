import React from 'react';
import {Composition} from 'remotion';
import {Motion, Props} from './Motion';
import exemplo from './exemplo-props.json';

// As props reais vêm do ev.py motion (--props). O exemplo só serve para abrir o Studio.
export const Root: React.FC = () => (
  <Composition
    id="Motion"
    component={Motion as unknown as React.FC<Record<string, unknown>>}
    defaultProps={exemplo as unknown as Record<string, unknown>}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={90}
    calculateMetadata={({props}) => {
      const p = props as unknown as Props;
      return {width: p.largura, height: p.altura, fps: p.fps, durationInFrames: p.total};
    }}
  />
);

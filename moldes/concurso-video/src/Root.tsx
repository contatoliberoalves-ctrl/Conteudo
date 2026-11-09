import React from 'react';
import { Composition } from 'remotion';
import { Video } from './Video';
import { CAUDA, FPS, H, LEAD, W } from './tema';
import videos from './videos.gerado.json';

export const Root: React.FC = () => <>
  {(videos as any[]).map(v => <Composition key={v.id} id={v.id} component={Video} defaultProps={{ video: v }}
    durationInFrames={Math.ceil((LEAD + v.tempo.duracao + CAUDA) * FPS)} fps={FPS} width={W} height={H} />)}
</>;

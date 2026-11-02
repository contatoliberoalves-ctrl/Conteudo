import React from 'react';
import {Composition} from 'remotion';
import {Motion, Props} from './Motion';
import exemplo from './exemplo-props.json';
import {Elenco} from './Elenco';
import {Cartoon, CartoonProps} from './Cartoon';
import {Camada, CamadaProps} from './Camada';
import {Blocos, BlocosProps} from './Blocos';
import {Caminho, CaminhoProps} from './Caminho';
import {Neon, NeonProps} from './Neon';
import {Aura, AuraProps} from './Aura';

// As props reais vêm do ev.py motion (--props). O exemplo só serve para abrir o Studio.
export const Root: React.FC = () => (
  <>
  <Composition id="Elenco" component={Elenco} width={2000} height={700} fps={30} durationInFrames={60} />
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
  <Composition
    id="Cartoon"
    component={Cartoon as unknown as React.FC<Record<string, unknown>>}
    defaultProps={{largura: 1080, altura: 1920, fps: 30, total: 60, paleta: exemplo.paleta, fontes: exemplo.fontes, cenas: [], itens: []} as unknown as Record<string, unknown>}
    width={1080} height={1920} fps={30} durationInFrames={60}
    calculateMetadata={({props}) => {
      const p = props as unknown as CartoonProps;
      return {width: p.largura, height: p.altura, fps: p.fps, durationInFrames: p.total};
    }}
  />
  <Composition
    id="Camada"
    component={Camada as unknown as React.FC<Record<string, unknown>>}
    defaultProps={{largura: 1080, altura: 1920, fps: 30, total: 60, paleta: exemplo.paleta, fontes: exemplo.fontes, cenas: [], itens: []} as unknown as Record<string, unknown>}
    width={1080} height={1920} fps={30} durationInFrames={60}
    calculateMetadata={({props}) => {
      const p = props as unknown as CamadaProps;
      return {width: p.largura, height: p.altura, fps: p.fps, durationInFrames: p.total};
    }}
  />
  <Composition
    id="Blocos"
    component={Blocos as unknown as React.FC<Record<string, unknown>>}
    defaultProps={{largura: 1080, altura: 1920, fps: 30, total: 60, grade: {cols: 1, rows: 1, grid: [[0]], ufs: []}, capitulos: [], serie: ''} as unknown as Record<string, unknown>}
    width={1080} height={1920} fps={30} durationInFrames={60}
    calculateMetadata={({props}) => {
      const p = props as unknown as BlocosProps;
      return {width: p.largura, height: p.altura, fps: p.fps, durationInFrames: p.total};
    }}
  />
  <Composition
    id="Caminho"
    component={Caminho as unknown as React.FC<Record<string, unknown>>}
    defaultProps={{largura: 1080, altura: 1920, fps: 30, total: 60, estacoes: [], cores: {}, fontes: exemplo.fontes} as unknown as Record<string, unknown>}
    width={1080} height={1920} fps={30} durationInFrames={60}
    calculateMetadata={({props}) => {
      const p = props as unknown as CaminhoProps;
      return {width: p.largura, height: p.altura, fps: p.fps, durationInFrames: p.total};
    }}
  />
  <Composition
    id="Neon"
    component={Neon as unknown as React.FC<Record<string, unknown>>}
    defaultProps={{largura: 1080, altura: 1920, fps: 30, total: 60, cenas: [], cores: {}, fontes: exemplo.fontes} as unknown as Record<string, unknown>}
    width={1080} height={1920} fps={30} durationInFrames={60}
    calculateMetadata={({props}) => {
      const p = props as unknown as NeonProps;
      return {width: p.largura, height: p.altura, fps: p.fps, durationInFrames: p.total};
    }}
  />
  <Composition
    id="Aura"
    component={Aura as unknown as React.FC<Record<string, unknown>>}
    defaultProps={{largura: 1080, altura: 1920, fps: 30, total: 60, cenas: [], cores: {}, fontes: exemplo.fontes} as unknown as Record<string, unknown>}
    width={1080} height={1920} fps={30} durationInFrames={60}
    calculateMetadata={({props}) => {
      const p = props as unknown as AuraProps;
      return {width: p.largura, height: p.altura, fps: p.fps, durationInFrames: p.total};
    }}
  />
  </>
);

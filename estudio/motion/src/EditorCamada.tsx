// Camada transparente com tudo que o usuário pôs no editor da galeria (textos, formas, emojis,
// personagens, imagens, b-roll, legenda, grão/vinheta/barras), no TEMPO DO VÍDEO ORIGINAL.
// O ev/edicao.py corta e acelera esta camada junto com o vídeo, trecho a trecho.
// O desenho vem de editor-desenho.js, o mesmo arquivo que o editor usa na prévia.
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
// @ts-ignore: módulo JS compartilhado com o editor
import {animEntrada, caixaMidia, htmlEfeitos, htmlElemento, htmlLegenda, propsEm} from './editor-desenho.js';

type Fonte = {familia: string; arquivo: string; peso?: string; estilo?: string; largura?: string};
export type EditorCamadaProps = {
  largura: number; altura: number; fps: number; total: number;
  ed: any; fontes: Fonte[]; personagens: string; midia: Record<string, string>;
  semLegenda?: boolean;
};

const cssObj = (css: string): React.CSSProperties => {
  const o: Record<string, string> = {};
  for (const par of css.split(';')) {
    const i = par.indexOf(':'); if (i < 0) continue;
    const k = par.slice(0, i).trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase()); if (k) o[k] = par.slice(i + 1).trim();
  }
  return o as React.CSSProperties;
};

export const EditorCamada: React.FC<EditorCamadaProps> = (p) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const [h] = useState(() => delayRender('fontes e imagens'));
  useEffect(() => {
    const fs = p.fontes.map((x) => new FontFace(x.familia, `url(${staticFile(x.arquivo)})`, {weight: x.peso || 'normal', style: x.estilo || 'normal', stretch: x.largura || 'normal'}));
    const imgs = [...Object.values(p.midia), ...((p.ed.elementos || []).filter((e: any) => e.tipo === 'personagem').map((e: any) => `${p.personagens}/${e.personagem}-${e.pose}.png`))]
      .filter((u) => !/\.(mp4|webm|mov)$/i.test(u))
      .map((u) => new Promise((ok) => { const im = new Image(); im.onload = ok; im.onerror = ok; im.src = staticFile(u); }));
    Promise.all([...fs.map((x) => x.load().then((r) => document.fonts.add(r)).catch(() => null)), ...imgs]).then(() => continueRender(h));
  }, [h, p.fontes, p.midia, p.personagens, p.ed]);
  const W = p.largura, t = f / fps, ed = p.ed;
  const vis = (ed.elementos || []).filter((e: any) => !e.oculto && t >= e.inicio && t <= e.fim);
  const o = {pausado: false, editor: false, personagens: staticFile(p.personagens), urlMidia: (e: any) => (p.midia[e.assetId] ? staticFile(p.midia[e.assetId]) : e.url)};
  let html = '';
  vis.forEach((e: any) => { if (e.tipo !== 'video') html += htmlElemento(e, t, W, {...o, z: ed.elementos.indexOf(e)}); });
  const L = ed.legendas || {};
  if (L.ativo && !p.semLegenda) { const b = (L.blocos || []).find((x: any) => t >= x.t0 && t <= x.t1); if (b) html += htmlLegenda(L, b, t, W, false); }
  const broll = (ed.elementos || []).filter((e: any) => e.tipo === 'video' && !e.oculto && p.midia[e.assetId]);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      {broll.map((e: any) => {
        const ini = Math.round(e.inicio * fps), dur = Math.max(1, Math.round((e.fim - e.inicio) * fps));
        return (
          <Sequence key={e.id} from={ini} durationInFrames={dur} layout="none">
            <BRoll e={e} src={staticFile(p.midia[e.assetId])} W={W} />
          </Sequence>
        );
      })}
      <AbsoluteFill dangerouslySetInnerHTML={{__html: html}} />
      <AbsoluteFill dangerouslySetInnerHTML={{__html: htmlEfeitos(ed.efeitos || {}, t)}} />
    </AbsoluteFill>
  );
};

const BRoll: React.FC<{e: any; src: string; W: number}> = ({e, src, W}) => {
  const lf = useCurrentFrame(), {fps} = useVideoConfig(), t = e.inicio + lf / fps;
  const pp = propsEm(e, t), an = animEntrada(e, t - e.inicio, e.fim - e.inicio, false), c = caixaMidia(e, pp, W, an);
  return (
    <div style={{position: 'absolute', ...cssObj(c.pos + c.estilo), transform: c.tr, opacity: an.op * pp.op, zIndex: 5}}>
      <OffthreadVideo src={src} muted={!(e.vol > 0)} volume={Math.min(1, e.vol || 0)} style={cssObj(c.fit)} />
    </div>
  );
};

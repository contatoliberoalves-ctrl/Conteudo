// Camada de inserções sobre um vídeo gravado (fundo transparente), no tempo do vídeo final.
// camada = "frente": personagens que entram reagindo, imagens/vídeos em quadro, ícones, cards,
//   checklist e objetos de cena. camada = "fundo": cenários ou imagens em tela cheia que ficam
//   ATRÁS da pessoa recortada (efeito "tela verde" sem tela verde).
import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, spring, staticFile,
  useCurrentFrame, useVideoConfig,
} from 'remotion';
import {Balao, Cenario, CenaCartoon, Objeto, ObjetoCena} from './Cartoon';
import {Expressao, Personagem, Pose, TipoPersonagem} from './personagens';

type Paleta = {fundo: string; fundo2: string; texto: string; acento: string; apagado: string};
export type Item = {
  tipo: 'personagem' | 'imagem' | 'video' | 'icone' | 'card' | 'lista' | 'objeto' | 'cenario' | 'fundo-imagem';
  inicio: number; fim: number;                     // quadros, no vídeo final
  posicao?: 'canto-esq' | 'canto-dir' | 'topo' | 'centro' | 'base' | 'metade-topo';
  // personagem
  personagem?: TipoPersonagem; pose?: Pose; expressao?: Expressao; balao?: string;
  // imagem / vídeo
  arquivo?: string; rotulo?: string; inclinacao?: number;
  // ícone
  svg?: string; cor?: string;
  // card / lista
  titulo?: string; texto?: string; itens?: string[]; passo?: number;
  // objeto de cena / cenário
  objeto?: Objeto; cenario?: CenaCartoon['cenario']; quadro?: string;
};
export type CamadaProps = {largura: number; altura: number; fps: number; total: number; paleta: Paleta;
  fontes: {titulo: string; corpo: string}; itens: Item[]; camada: 'frente' | 'fundo'};

const TINTA = '#20201E';

function entradaSaida(f: number, ini: number, fim: number, fps: number) {
  const s = spring({frame: f - ini, fps, config: {damping: 12, stiffness: 200, mass: 0.7}});
  const o = interpolate(f, [fim - 7, fim], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)});
  return {s, o};
}

function lugar(pos: Item['posicao'], W: number, H: number) {
  switch (pos) {
    case 'canto-esq': return {x: W * 0.2, y: H * 0.78};
    case 'canto-dir': return {x: W * 0.8, y: H * 0.78};
    case 'centro': return {x: W * 0.5, y: H * 0.45};
    case 'base': return {x: W * 0.5, y: H * 0.72};
    case 'metade-topo': return {x: W * 0.5, y: H * 0.26};
    default: return {x: W * 0.5, y: H * 0.2};
  }
}

const ItemFrente: React.FC<{it: Item; p: CamadaProps}> = ({it, p}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const W = p.largura, H = p.altura, u = W / 1080;
  if (f < it.inicio || f > it.fim) return null;
  const {s, o} = entradaSaida(f, it.inicio, it.fim, fps);
  const {x, y} = lugar(it.posicao, W, H);

  if (it.tipo === 'personagem' && it.personagem) {
    // sobe do rodapé com antecipação, reage e sai descendo
    const lado = it.posicao === 'canto-esq' ? -1 : 1;
    const t = f - it.inicio;
    const sobe = interpolate(t, [0, 5, 13, 19], [1, 1.06, -0.03, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    const desce = interpolate(f, [it.fim - 8, it.fim], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)});
    const sc = 1.3 * u;
    const px = W / 2 + lado * W * 0.3;
    const altura = 600 * sc;
    const topo = H - altura * 0.92 + (sobe + desce) * altura;
    return (
      <>
        <svg width={W} height={H} style={{position: 'absolute'}}>
          <g transform={`translate(${px} ${topo}) scale(${-lado * sc} ${sc}) translate(-200 0)`}>
            <Personagem tipo={it.personagem} frame={f} boca={0} pose={it.pose || 'acena'} expressao={it.expressao || 'feliz'} olhar={-lado * -0.6} semente={`c${it.inicio}`} />
          </g>
        </svg>
        {it.balao ? <Balao texto={it.balao} f={f} ini={it.inicio + 10} fim={it.fim - 8} ax={px - lado * 40 * u} ay={topo - 20 * u} W={W} fps={fps} p={p.paleta} /> : null}
      </>
    );
  }
  if (it.tipo === 'imagem' || it.tipo === 'video') {
    const larg = (it.posicao === 'metade-topo' ? 0.86 : 0.62) * W;
    const kb = 1 + (f - it.inicio) / (fps * 30);
    return (
      <div style={{position: 'absolute', left: x, top: y, width: larg, transform: `translate(-50%,-50%) scale(${s * o}) rotate(${(it.inclinacao ?? -2) * s}deg)`,
        background: '#fff', padding: 12 * u, borderRadius: 28 * u, boxShadow: `0 ${24 * u}px ${60 * u}px rgba(0,0,0,.4)`}}>
        <div style={{borderRadius: 18 * u, overflow: 'hidden', aspectRatio: it.posicao === 'metade-topo' ? '16 / 10' : '4 / 3'}}>
          {it.tipo === 'video'
            ? <OffthreadVideo src={staticFile(it.arquivo!)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            : <Img src={staticFile(it.arquivo!)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kb})`}} />}
        </div>
        {it.rotulo ? <div style={{fontFamily: 'Corpo', fontSize: 34 * u, color: TINTA, padding: `${12 * u}px ${8 * u}px ${2 * u}px`}}>{it.rotulo}</div> : null}
      </div>
    );
  }
  if (it.tipo === 'icone') {
    const gira = interpolate(f - it.inicio, [0, 14], [-30, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2))});
    return (
      <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s * o})`, display: 'flex', alignItems: 'center', gap: 22 * u,
        background: '#fff', border: `${7 * u}px solid ${TINTA}`, borderRadius: 999, padding: `${16 * u}px ${36 * u}px ${16 * u}px ${16 * u}px`, boxShadow: `0 ${12 * u}px 0 rgba(0,0,0,.18)`}}>
        <div style={{width: 110 * u, height: 110 * u, borderRadius: '50%', background: it.cor || p.paleta.acento, display: 'grid', placeItems: 'center', transform: `rotate(${gira}deg)`}}>
          <svg width={64 * u} height={64 * u} viewBox="0 0 24 24" fill="none" stroke={TINTA} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"
            dangerouslySetInnerHTML={{__html: it.svg || ''}} />
        </div>
        {it.texto ? <span style={{fontFamily: 'Titulo', fontSize: 70 * u, color: TINTA, whiteSpace: 'nowrap'}}>{it.texto}</span> : null}
      </div>
    );
  }
  if (it.tipo === 'card') {
    const dx = interpolate(s, [0, 1], [-W * 0.6, 0]);
    return (
      <div style={{position: 'absolute', left: W * 0.07, right: W * 0.07, top: y, transform: `translate(${dx}px,-50%)`, opacity: o,
        background: p.paleta.fundo, color: '#fff', borderRadius: 30 * u, padding: `${30 * u}px ${38 * u}px`, borderLeft: `${16 * u}px solid ${p.paleta.acento}`,
        boxShadow: `0 ${18 * u}px ${50 * u}px rgba(0,0,0,.35)`}}>
        {it.titulo ? <div style={{fontFamily: 'Titulo', fontSize: 74 * u, lineHeight: 1, color: p.paleta.acento}}>{it.titulo}</div> : null}
        {it.texto ? <div style={{fontFamily: 'Corpo', fontSize: 40 * u, lineHeight: 1.25, marginTop: 10 * u}}>{it.texto}</div> : null}
      </div>
    );
  }
  if (it.tipo === 'lista') {
    const passo = it.passo || 12;
    const g = it.posicao === 'metade-topo' ? 1.35 : 1;   // na tela dividida, metade inteira para a lista
    return (
      <div style={{position: 'absolute', left: W * 0.08, right: W * 0.08, top: y, transform: `translateY(-50%) scale(${0.9 + 0.1 * s})`, opacity: o * s,
        background: '#FBFAF4', border: `${7 * u}px solid ${TINTA}`, borderRadius: 30 * u, padding: `${28 * u}px ${36 * u}px`}}>
        {it.titulo ? <div style={{fontFamily: 'Titulo', fontSize: 66 * u * g, color: TINTA, marginBottom: 12 * u}}>{it.titulo}</div> : null}
        {(it.itens || []).map((t, i) => {
          const a = spring({frame: f - it.inicio - 8 - i * passo, fps, config: {damping: 13, stiffness: 210}});
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 18 * u, fontFamily: 'Corpo', fontSize: 42 * u * g, color: TINTA,
              padding: `${8 * u}px 0`, opacity: a, transform: `translateX(${(1 - a) * 60 * u}px)`}}>
              <span style={{flex: 'none', width: 54 * u * g, height: 54 * u * g, borderRadius: 14 * u, background: p.paleta.acento, display: 'grid', placeItems: 'center',
                fontFamily: 'Titulo', fontSize: 44 * u, transform: `scale(${a})`}}>✓</span>{t}
            </div>
          );
        })}
      </div>
    );
  }
  if (it.tipo === 'objeto' && it.objeto) {
    return <ObjetoCena o={{...it.objeto, inicio: it.inicio, fim: it.fim - 8}} f={f} W={W} H={H} p={p.paleta} fps={fps} />;
  }
  return null;
};

const ItemFundo: React.FC<{it: Item; p: CamadaProps}> = ({it, p}) => {
  const f = useCurrentFrame();
  const W = p.largura, H = p.altura;
  if (f < it.inicio || f > it.fim) return null;
  const op = interpolate(f, [it.inicio, it.inicio + 6, it.fim - 6, it.fim], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (it.tipo === 'cenario' && it.cenario) {
    const c = {inicio: 0, duracao: 1, cenario: it.cenario, quadro: it.quadro, personagens: [], falas: [], objetos: []} as CenaCartoon;
    return <AbsoluteFill style={{opacity: op}}><Cenario c={c} W={W} H={H} p={p.paleta} f={f} /></AbsoluteFill>;
  }
  if (it.tipo === 'fundo-imagem' && it.arquivo) {
    return <AbsoluteFill style={{opacity: op}}><Img src={staticFile(it.arquivo)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.05 + (f - it.inicio) / 1500})`}} /></AbsoluteFill>;
  }
  return null;
};

export const Camada: React.FC<CamadaProps> = (p) => {
  const [h] = useState(() => delayRender('fontes'));
  useEffect(() => {
    const fs = [new FontFace('Titulo', `url(${staticFile(p.fontes.titulo)})`), new FontFace('Corpo', `url(${staticFile(p.fontes.corpo)})`)];
    Promise.all(fs.map((x) => x.load())).then((ok) => { ok.forEach((x) => document.fonts.add(x)); continueRender(h); });
  }, [h, p.fontes.titulo, p.fontes.corpo]);
  const fundo = p.camada === 'fundo';
  return (
    <AbsoluteFill style={{background: 'transparent'}}>
      {p.itens.filter((it) => (fundo ? ['cenario', 'fundo-imagem'].includes(it.tipo) : !['cenario', 'fundo-imagem'].includes(it.tipo))).map((it, i) => (
        <Sequence key={i} from={0} durationInFrames={p.total} layout="none">
          {fundo ? <ItemFundo it={it} p={p} /> : <ItemFrente it={it} p={p} />}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

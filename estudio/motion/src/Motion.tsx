// Modelo de motion do estúdio. Tudo vem das props (geradas pelo ev.py motion a partir do
// controles.json): os 6 controles (espaçamento, tipografia, desfoque, easing, follow-through,
// antecipação) e a agenda de cada cena em quadros. O GSAP roda no relógio do Remotion
// (useGsapTimeline): nada de play/seek/callback, tudo é função do quadro.
import {useGsapTimeline} from '@remotion/gsap';
import {CameraMotionBlur} from '@remotion/motion-blur';
import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill, Sequence, continueRender, delayRender, interpolate, random, staticFile, useCurrentFrame,
  useVideoConfig, Easing,
} from 'remotion';

export type Controles = {
  espacamento: {distancia: number; direcao: 'baixo' | 'cima' | 'esquerda' | 'direita'};
  tipografia: {escala: number; rastreamento: number; altura_linha: number; max_caracteres: number; caixa_alta: boolean};
  desfoque: {obturador: number; amostras: number};
  easing: {entrada: string; saida: string; duracao_entrada: number; duracao_saida: number; escalonar: number};
  followthrough: {atraso_cauda: number; overshoot: number; oscilacoes: number; arrasto: number};
  antecipacao: {frames: number; recuo: number};
};

export type Cena = {
  tipo: 'titulo' | 'sequencia' | 'cta' | 'numero';
  inicio: number; duracao: number;           // quadros
  segura: number;                             // quadros parado depois de entrar
  controles: Controles;
  kicker?: string; texto?: string; linhas?: string[]; palavras?: string[]; destaque?: string[];
  botao?: string; sub?: string; numero?: number; prefixo?: string; sufixo?: string; rotulo?: string;
  posicao?: 'centro' | 'topo' | 'base';
  placa?: boolean;                            // fundo atrás do texto (para pôr sobre vídeo claro)
};

export type Props = {
  largura: number; altura: number; fps: number; total: number; transparente: boolean;
  paleta: {fundo: string; fundo2: string; texto: string; acento: string; apagado: string};
  fontes: {titulo: string; corpo: string};
  cenas: Cena[];
};

const f2s = (q: number, fps: number) => q / fps;

function vetor(c: Controles) {
  const d = c.espacamento.distancia;
  switch (c.espacamento.direcao) {
    case 'cima': return {x: 0, y: -d};
    case 'esquerda': return {x: -d, y: 0};
    case 'direita': return {x: d, y: 0};
    default: return {x: 0, y: d};
  }
}

// cauda: overshoot/oscilação viram o ease do GSAP
function easeCauda(c: Controles) {
  const o = c.followthrough;
  if (o.oscilacoes > 1) return `elastic.out(${1 + o.overshoot * 2}, ${Math.max(0.2, 0.9 - o.oscilacoes * 0.15)})`;
  return `back.out(${1 + o.overshoot * 12})`;
}

/** Entrada do corpo (com antecipação) + cauda atrasada (follow-through) + saída. */
function animar(tl: gsap.core.Timeline, corpo: Element[], cauda: Element[], c: Controles, fps: number,
                entra: number, sai: number | null) {
  const v = vetor(c);
  const a = f2s(c.antecipacao.frames, fps);
  const d = f2s(c.easing.duracao_entrada, fps);
  const t0 = f2s(entra, fps);
  const esc = f2s(c.easing.escalonar, fps);
  const r = c.antecipacao.recuo;
  tl.set(corpo, {x: v.x, y: v.y, opacity: 0}, 0);
  corpo.forEach((el, i) => {
    const ti = t0 + i * esc;
    if (a > 0) {   // recua um pouco na direção contrária antes de ir
      tl.to(el, {x: v.x * (1 + r), y: v.y * (1 + r), opacity: 1, duration: a, ease: 'power1.out'}, ti);
    } else {
      tl.set(el, {opacity: 1}, ti);
    }
    tl.to(el, {x: 0, y: 0, duration: d, ease: c.easing.entrada}, ti + a);
  });
  if (cauda.length) {
    const arr = c.followthrough.arrasto;
    tl.set(cauda, {x: v.x * arr, y: v.y * arr}, 0);
    // escalonamento da cauda limitado a ~6 quadros no total (rótulo longo não fica "ondulando")
    const passo = Math.min(esc / 3, f2s(6, fps) / Math.max(cauda.length, 1));
    tl.to(cauda, {x: 0, y: 0, duration: d * 1.2, ease: easeCauda(c), stagger: passo},
      t0 + a + f2s(c.followthrough.atraso_cauda, fps));
  }
  if (sai !== null) {
    const ds = f2s(c.easing.duracao_saida, fps);
    const ts = f2s(sai, fps);
    corpo.forEach((el, i) => {
      const ti = ts + i * esc * 0.5;
      if (a > 0) tl.to(el, {x: v.x * r * 0.5, y: v.y * r * 0.5, duration: a * 0.75, ease: 'power1.out'}, ti);
      tl.to(el, {x: -v.x, y: -v.y, opacity: 0, duration: ds, ease: c.easing.saida}, ti + a * 0.75);
    });
  }
}

function linhasDe(c: Cena): string[] {
  if (c.linhas?.length) return c.linhas;
  const t = c.texto || '';
  if (t.includes('|')) return t.split('|').map((s) => s.trim());
  const max = c.controles.tipografia.max_caracteres;
  const out: string[] = [];
  let atual = '';
  for (const p of t.split(/\s+/)) {
    if ((atual + ' ' + p).trim().length > max && atual) { out.push(atual); atual = p; } else atual = (atual + ' ' + p).trim();
  }
  if (atual) out.push(atual);
  return out;
}

const Letras: React.FC<{texto: string; destaque: string[]; acento: string}> = ({texto, destaque, acento}) => (
  <>
    {texto.split(' ').map((palavra, wi) => {
      const limpo = palavra.replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();
      const cor = destaque.some((d) => d.toLowerCase() === limpo) ? acento : undefined;
      return (
        <span key={wi} style={{display: 'inline-block', whiteSpace: 'nowrap', color: cor}}>
          {[...palavra].map((ch, i) => <span key={i} data-cauda style={{display: 'inline-block'}}>{ch}</span>)}
          {' '}
        </span>
      );
    })}
  </>
);

const Titulo: React.FC<{c: Cena; p: Props}> = ({c, p}) => {
  const {fps} = useVideoConfig();
  const T = c.controles.tipografia;
  const u = p.largura / 1080;
  const linhas = linhasDe(c).map((l) => (T.caixa_alta ? l.toUpperCase() : l));
  const sai = c.duracao - c.controles.easing.duracao_saida - c.controles.antecipacao.frames;
  const scope = useGsapTimeline<HTMLDivElement>(({timeline, selector}) => {
    const kick = selector('[data-kicker]');
    if (kick.length) animar(timeline, kick, [], c.controles, fps, 0, sai);
    animar(timeline, selector('[data-linha]'), selector('[data-cauda]'), c.controles, fps, 3, sai);
    timeline.fromTo(selector('[data-respira]'), {scale: 1}, {scale: 1.025, duration: f2s(c.duracao, fps), ease: 'none'}, 0);
    const barra = selector('[data-barra]');
    if (barra.length) {
      timeline.set(barra, {scaleX: 0, transformOrigin: '0% 50%'}, 0);
      timeline.to(barra, {scaleX: 1, duration: f2s(c.controles.easing.duracao_entrada, fps) * 1.3, ease: easeCauda(c.controles)},
        f2s(3 + c.controles.antecipacao.frames + c.controles.followthrough.atraso_cauda + 4, fps));
      timeline.to(barra, {scaleX: 0, transformOrigin: '100% 50%', duration: f2s(c.controles.easing.duracao_saida, fps), ease: c.controles.easing.saida}, f2s(sai, fps));
    }
  }, {dependencies: [JSON.stringify(c)]});
  const maiorLinha = Math.max(...linhas.map((l) => l.length), 1);
  const tam = Math.min(150 * T.escala * u, (p.largura * 0.86) / (maiorLinha * 0.5));
  const alinh = c.posicao === 'topo' ? 'flex-start' : c.posicao === 'base' ? 'flex-end' : 'center';
  return (
    <AbsoluteFill ref={scope} style={{justifyContent: alinh, alignItems: 'center', padding: `${140 * u}px ${80 * u}px`}}>
      <div data-respira style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 * u,
        ...(c.placa ? {background: p.paleta.fundo + 'E6', borderRadius: 36 * u, padding: `${34 * u}px ${54 * u}px ${30 * u}px`, boxShadow: `0 ${20 * u}px ${60 * u}px rgba(0,0,0,.35)`} : {})}}>
        {c.kicker ? <div data-kicker style={{fontFamily: 'Corpo', fontSize: 34 * u, letterSpacing: '0.22em', textTransform: 'uppercase', color: p.paleta.acento}}>{c.kicker}</div> : null}
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          {linhas.map((l, i) => (
            <div key={i} data-linha style={{fontFamily: 'Titulo', fontSize: tam, lineHeight: T.altura_linha, letterSpacing: `${T.rastreamento}em`, color: p.paleta.texto, textAlign: 'center', whiteSpace: 'nowrap'}}>
              <Letras texto={l} destaque={c.destaque || []} acento={p.paleta.acento} />
            </div>
          ))}
        </div>
        {c.sub ? <div data-kicker style={{fontFamily: 'Corpo', fontSize: 40 * u, color: p.paleta.texto, opacity: 0.85, textAlign: 'center'}}>{c.sub}</div> : null}
        <div data-barra style={{height: 12 * u, width: 220 * u, background: p.paleta.acento, borderRadius: 99}} />
      </div>
    </AbsoluteFill>
  );
};

const Sequencia: React.FC<{c: Cena; p: Props}> = ({c, p}) => {
  const {fps} = useVideoConfig();
  const T = c.controles.tipografia;
  const u = p.largura / 1080;
  const palavras = c.palavras || [];
  const cada = Math.floor(c.duracao / Math.max(1, palavras.length));
  const scope = useGsapTimeline<HTMLDivElement>(({timeline, selector}) => {
    palavras.forEach((_, i) => {
      const el = selector(`[data-p="${i}"]`);
      const cauda = selector(`[data-p="${i}"] [data-cauda]`);
      const ultima = i === palavras.length - 1;
      const sai = ultima ? c.duracao - c.controles.easing.duracao_saida - c.controles.antecipacao.frames
        : (i + 1) * cada - c.controles.easing.duracao_saida;
      animar(timeline, el, cauda, c.controles, fps, i * cada, sai);
    });
  }, {dependencies: [JSON.stringify(c)]});
  return (
    <AbsoluteFill ref={scope} style={{justifyContent: 'center', alignItems: 'center'}}>
      {palavras.map((w, i) => (
        <div key={i} data-p={i} style={{position: 'absolute', fontFamily: 'Titulo', lineHeight: T.altura_linha,
          // palavra longa diminui para caber em ~88% da largura
          fontSize: Math.min(210 * T.escala * u, (p.largura * 0.88) / (Math.max(w.length, 1) * 0.5)),
          letterSpacing: `${T.rastreamento}em`, color: (c.destaque || []).includes(w) ? p.paleta.acento : p.paleta.texto, whiteSpace: 'nowrap'}}>
          <Letras texto={T.caixa_alta ? w.toUpperCase() : w} destaque={[]} acento={p.paleta.acento} />
        </div>
      ))}
    </AbsoluteFill>
  );
};

const Cta: React.FC<{c: Cena; p: Props}> = ({c, p}) => {
  const {fps} = useVideoConfig();
  const u = p.largura / 1080;
  const C = c.controles;
  const sai = c.duracao - C.easing.duracao_saida - C.antecipacao.frames;
  const scope = useGsapTimeline<HTMLDivElement>(({timeline, selector}) => {
    animar(timeline, selector('[data-texto]'), [], C, fps, 0, sai);
    const pilula = selector('[data-pilula]');
    const a = f2s(C.antecipacao.frames, fps);
    const t0 = f2s(6, fps);
    timeline.set(pilula, {scale: 0, opacity: 0}, 0);
    // antecipação = achata antes de saltar; follow-through = a seta chega atrasada
    if (a > 0) timeline.to(pilula, {scaleX: 0.3, scaleY: 0.18, opacity: 1, duration: a, ease: 'power1.out'}, t0);
    timeline.to(pilula, {scaleX: 1, scaleY: 1, opacity: 1, duration: f2s(C.easing.duracao_entrada, fps), ease: easeCauda(C)}, t0 + a);
    const seta = selector('[data-seta]');
    timeline.set(seta, {x: -C.espacamento.distancia * 0.4, opacity: 0}, 0);
    timeline.to(seta, {x: 0, opacity: 1, duration: f2s(C.easing.duracao_entrada, fps), ease: easeCauda(C)},
      t0 + a + f2s(C.followthrough.atraso_cauda + 4, fps));
    // respira enquanto espera (nada fica congelado)
    timeline.to(pilula, {scale: 1.04, duration: 0.5, yoyo: true, repeat: Math.max(1, Math.floor(f2s(c.segura, fps) / 0.5) - 1), ease: 'sine.inOut'},
      t0 + a + f2s(C.easing.duracao_entrada, fps));
    timeline.to(pilula, {scale: 0, opacity: 0, duration: f2s(C.easing.duracao_saida, fps), ease: C.easing.saida}, f2s(sai, fps));
  }, {dependencies: [JSON.stringify(c)]});
  const tam = 74 * C.tipografia.escala * u;
  return (
    <AbsoluteFill ref={scope} style={{justifyContent: c.posicao === 'base' ? 'flex-end' : 'center', alignItems: 'center', padding: `${220 * u}px ${60 * u}px`}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36 * u}}>
        {c.texto ? <div data-texto style={{fontFamily: 'Titulo', fontSize: tam * 1.3, color: p.paleta.texto, textAlign: 'center', letterSpacing: `${C.tipografia.rastreamento}em`, lineHeight: 1}}>{C.tipografia.caixa_alta ? c.texto.toUpperCase() : c.texto}</div> : null}
        <div data-pilula style={{display: 'flex', alignItems: 'center', gap: 22 * u, background: p.paleta.acento, color: p.paleta.fundo, borderRadius: 999,
          padding: `${26 * u}px ${56 * u}px`, fontFamily: 'Titulo', fontSize: tam, letterSpacing: `${C.tipografia.rastreamento}em`}}>
          <span>{C.tipografia.caixa_alta ? (c.botao || '').toUpperCase() : c.botao}</span>
          <span data-seta style={{display: 'inline-block'}}>→</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Numero: React.FC<{c: Cena; p: Props}> = ({c, p}) => {
  const {fps} = useVideoConfig();
  const frame = useCurrentFrame();
  const u = p.largura / 1080;
  const C = c.controles;
  const sai = c.duracao - C.easing.duracao_saida - C.antecipacao.frames;
  const ini = C.antecipacao.frames;
  const fim = ini + C.easing.duracao_entrada * 2;
  const v = interpolate(frame, [ini, fim], [0, c.numero || 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const scope = useGsapTimeline<HTMLDivElement>(({timeline, selector}) => {
    timeline.fromTo(selector('[data-respira]'), {scale: 1}, {scale: 1.03, duration: f2s(c.duracao, fps), ease: 'none'}, 0);
    animar(timeline, selector('[data-n]'), [], C, fps, 0, sai);
    animar(timeline, selector('[data-rot]'), selector('[data-rot] [data-cauda]'), C, fps, 6, sai);
  }, {dependencies: [JSON.stringify(c)]});
  return (
    <AbsoluteFill ref={scope} style={{justifyContent: 'center', alignItems: 'center'}}>
     <div data-respira style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 * u}}>
      <div data-n style={{fontFamily: 'Titulo', fontSize: 340 * C.tipografia.escala * u, color: p.paleta.acento, lineHeight: 1, fontVariantNumeric: 'tabular-nums'}}>
        {(c.prefixo || '') + Math.round(v).toLocaleString('pt-BR') + (c.sufixo || '')}
      </div>
      <div data-rot style={{fontFamily: 'Corpo', fontSize: 56 * u, color: p.paleta.texto}}>
        <Letras texto={c.rotulo || ''} destaque={c.destaque || []} acento={p.paleta.acento} />
      </div>
     </div>
    </AbsoluteFill>
  );
};

const Fundo: React.FC<{p: Props}> = ({p}) => {
  const frame = useCurrentFrame();
  const u = p.largura / 1080;
  const dx = Math.sin(frame / 90) * 120 * u, dy = Math.cos(frame / 110) * 90 * u;
  const semente = Math.floor(frame / 2);   // grão trocado "em dois"
  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 80% at 50% 0%, ${p.paleta.fundo2}, ${p.paleta.fundo} 70%)`}}>
      <div style={{position: 'absolute', width: 760 * u, height: 760 * u, borderRadius: '50%', background: p.paleta.acento, opacity: 0.16,
        filter: `blur(${110 * u}px)`, left: -200 * u + dx, top: -160 * u + dy}} />
      <div style={{position: 'absolute', width: 620 * u, height: 620 * u, borderRadius: '50%', background: p.paleta.acento, opacity: 0.1,
        filter: `blur(${110 * u}px)`, right: -220 * u - dx, bottom: -120 * u - dy}} />
      <AbsoluteFill style={{opacity: 0.08, backgroundImage: 'radial-gradient(#fff 1px, transparent 1.2px)', backgroundSize: `${5 * u}px ${5 * u}px`,
        transform: `translate(${random(`g${semente}`) * 5}px, ${random(`h${semente}`) * 5}px)`}} />
    </AbsoluteFill>
  );
};

function useFontes(p: Props) {
  const [h] = useState(() => delayRender('fontes'));
  useEffect(() => {
    const fs = [new FontFace('Titulo', `url(${staticFile(p.fontes.titulo)})`), new FontFace('Corpo', `url(${staticFile(p.fontes.corpo)})`)];
    Promise.all(fs.map((f) => f.load())).then((ok) => { ok.forEach((f) => document.fonts.add(f)); continueRender(h); })
      .catch((e) => { throw new Error('fonte não carregou: ' + e); });
  }, [h, p.fontes.titulo, p.fontes.corpo]);
}

const CENAS = {titulo: Titulo, sequencia: Sequencia, cta: Cta, numero: Numero};

export const Motion: React.FC<Props> = (p) => {
  useFontes(p);
  const obt = Math.max(...p.cenas.map((c) => c.controles.desfoque.obturador));
  const amostras = Math.max(...p.cenas.map((c) => c.controles.desfoque.amostras));
  const conteudo = (
    <AbsoluteFill>
      {p.cenas.map((c, i) => {
        const Comp = CENAS[c.tipo];
        return (
          <Sequence key={i} from={c.inicio} durationInFrames={c.duracao} layout="none">
            <Comp c={c} p={p} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill style={{background: p.transparente ? 'transparent' : p.paleta.fundo}}>
      {p.transparente ? null : <Fundo p={p} />}
      {obt > 0 && amostras > 1 ? <CameraMotionBlur shutterAngle={obt} samples={amostras}>{conteudo}</CameraMotionBlur> : conteudo}
    </AbsoluteFill>
  );
};

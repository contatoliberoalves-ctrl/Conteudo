// Estilo "motivacional" (roteiro com `estilo: "motivacional"`): mesma marca (verde, menta, petróleo, Big Shoulders),
// mas em clima de virada: fundo quase preto com um amanhecer verde que sobe e clareia conforme o vídeo avança,
// poeira de luz subindo, granulado mais forte, tipografia cinética gigante (a fala vira o visual) e transição por
// clarão em vez da faixa verde.
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { cor, ease, fonte, mola } from './tema';
import { clamp, Entra, lista, norm, quadro, Sfx, Titulo, useMarcas, useRespira, useTraco, useVideo } from './util';
import { Icone } from './icones';

export const preto = '#020B0A';

// Pseudoaleatório determinístico (mesmo resultado em todo quadro).
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

export const FundoMotiva: React.FC = () => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const prog = f / durationInFrames;                 // o amanhecer clareia ao longo do vídeo
  const sol = interpolate(prog, [0, 1], [0.65, 1.1], clamp);
  const sobe = interpolate(prog, [0, 1], [380, 120], clamp);
  const raio = f * 0.04;
  return <AbsoluteFill style={{ background: preto, overflow: 'hidden' }}>
    {/* amanhecer verde vindo de baixo */}
    <div style={{ position: 'absolute', left: -500, right: -500, bottom: -900 + (380 - sobe), height: 1700, borderRadius: '50%', background: `radial-gradient(closest-side, rgba(11,164,87,${0.55 * sol}), rgba(4,49,44,${0.7 * sol}) 45%, transparent 75%)`, filter: 'blur(30px)' }} />
    <div style={{ position: 'absolute', left: 140, right: 140, bottom: -420 + (380 - sobe) * 0.6, height: 700, borderRadius: '50%', background: `radial-gradient(closest-side, rgba(185,255,241,${0.28 * sol}), transparent 70%)`, filter: 'blur(40px)' }} />
    {/* feixes de luz girando bem devagar a partir do horizonte */}
    <div style={{ position: 'absolute', left: '50%', bottom: -200, width: 2600, height: 2600, marginLeft: -1300, transform: `translateY(50%) rotate(${raio}deg)`, background: `repeating-conic-gradient(from 0deg, rgba(185,255,241,${0.05 * sol}) 0deg 4deg, transparent 4deg 18deg)`, maskImage: 'radial-gradient(circle, black 0%, transparent 60%)', WebkitMaskImage: 'radial-gradient(circle, black 0%, transparent 60%)' }} />
    {/* poeira de luz subindo */}
    {Array.from({ length: 34 }).map((_, i) => {
      const vel = 0.6 + rnd(i) * 1.6, x = rnd(i + 99) * 1080, tam = 3 + rnd(i + 7) * 7;
      const y = 1980 - ((f * vel + rnd(i + 3) * 2000) % 2100);
      const brilho = 0.25 + 0.5 * Math.abs(Math.sin(f / (20 + rnd(i) * 30) + i));
      return <div key={i} style={{ position: 'absolute', left: x + Math.sin(f / 40 + i) * 20, top: y, width: tam, height: tam, borderRadius: '50%', background: cor.menta, opacity: brilho * (0.4 + 0.6 * sol), filter: tam > 7 ? 'blur(2px)' : 'none' }} />;
    })}
  </AbsoluteFill>;
};

// Transição: clarão menta rápido (cobre o corte) em vez da faixa verde.
export const Clarao: React.FC<{ em: number }> = ({ em }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [em - 4, em, em + 8], [0, 0.85, 0], { ...clamp, easing: ease.out });
  if (o <= 0) return null;
  return <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 60%, ${cor.branco}, ${cor.menta} 40%, rgba(11,164,87,.6) 75%)`, opacity: o, mixBlendMode: 'screen' }} />;
};

// ---------- IMPACTO: a própria fala em tipografia cinética, 1 a 3 palavras por vez ----------
// Campos: fala, destaques: ["palavra", …] (em verde com brilho), ts (px máximo).
export const Impacto: React.FC<any> = ({ c, k }) => {
  const v = useVideo(); const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const t0 = v.inicios[k];
  const { p0, p1 } = v.tempo.cenas[k];
  const ps = v.tempo.palavras.slice(p0, p1);
  const dest = new Set(lista(c.destaques).map(norm));
  // Blocos: quebra em pontuação, a cada 3 palavras ou acima de 16 letras.
  const blocos: any[][] = []; let atual: any[] = [];
  ps.forEach((p: any, i: number) => {
    atual.push(p);
    const letras = atual.map(a => a.w).join(' ').length;
    if (/[.,!?:;…]$/.test(p.w) || atual.length >= 3 || letras > 14 || i === ps.length - 1) { blocos.push(atual); atual = []; }
  });
  const rel = (t: number) => quadro(t, fps) - t0;
  const idx = blocos.findIndex((b, i) => f >= rel(b[0].ini) - 2 && (i === blocos.length - 1 || f < rel(blocos[i + 1][0].ini) - 2));
  const b = blocos[Math.max(0, idx)] || [];
  const ini = b.length ? rel(b[0].ini) - 2 : 0;
  const texto = b.map(p => p.w.replace(/[.,;:]$/, '')).join(' ');
  const maior = Math.max(...b.map(p => p.w.length), 1);
  const px = Math.min(c.ts || 230, Math.floor(900 / (Math.max(maior, texto.length / 2) * 0.47)));
  const pb = spring({ frame: f - ini, fps, config: mola.snappy });
  return <AbsoluteFill>
    {idx === 0 && <Sfx em={0} som="hit" vol={0.5} />}
    <div style={{ position: 'absolute', left: 70, right: 70, top: 380, height: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: `0 ${px * 0.22}px`, transform: `scale(${interpolate(pb, [0, 1], [1.25, 1])})`, opacity: Math.min(1, pb * 1.5), filter: `blur(${(1 - Math.min(1, pb)) * 10}px)` }}>
        {b.map((p, i) => {
          const fw = rel(p.ini) - 1;
          const pw = spring({ frame: f - fw, fps, config: mola.snappy });
          const d = dest.has(norm(p.w));
          return <span key={i} style={{ fontFamily: fonte.display, fontWeight: 900, fontSize: px, lineHeight: 0.95, textTransform: 'uppercase', color: d ? cor.verde : cor.branco,
            opacity: interpolate(pw, [0, 1], [0.22, 1], clamp), transform: `translateY(${interpolate(pw, [0, 1], [px * 0.12, 0])}px)`,
            textShadow: d ? `0 0 60px rgba(11,164,87,.7), 0 0 120px rgba(11,164,87,.35)` : '0 6px 30px rgba(0,0,0,.5)' }}>{p.w.replace(/[.,;:]$/, '')}</span>;
        })}
      </div>
    </div>
  </AbsoluteFill>;
};

// ---------- DICA: número gigante vazado ao fundo, "dica 01", título, ícone e o "como" ----------
// Campos: n, titulo[], icone, texto, em (palavra que mostra o texto).
export const Dica: React.FC<any> = ({ c, k }) => {
  const m = useMarcas(k); const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const eTxt = m(c.em, 40);
  const pn = spring({ frame: f, fps, config: mola.smooth });
  const r = useRespira(30, 6);
  return <AbsoluteFill>
    <Sfx em={1} som="hit" vol={0.4} />
    <div style={{ position: 'absolute', right: -60, top: 230, fontFamily: fonte.display, fontWeight: 900, fontSize: 1000, lineHeight: 0.8, color: 'transparent', WebkitTextStroke: '5px rgba(185,255,241,.22)', transform: `translateX(${interpolate(pn, [0, 1], [200, 0])}px) translateY(${r}px)`, opacity: pn }}>{c.n}</div>
    <div style={{ position: 'absolute', left: 80, right: 80, top: 360, height: 1040, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Entra em={2} x={-40} y={0}><div style={{ fontFamily: fonte.sora, fontWeight: 800, fontSize: 34, letterSpacing: '.3em', textTransform: 'uppercase', color: cor.menta }}>dica {String(c.n).padStart(2, '0')}</div></Entra>
      <div style={{ marginTop: 26 }}><Titulo t={c.titulo} em={5} px={c.ts || 170} /></div>
      {c.icone && <div style={{ marginTop: 40 }}><Icone nome={c.icone} px={150} p={useTraco(10, 30)} /></div>}
      <Sfx em={eTxt} som="pop" vol={0.25} />
      <Entra em={eTxt} style={{ marginTop: 40 }}>
        <div style={{ borderLeft: `8px solid ${cor.verde}`, paddingLeft: 28, fontFamily: fonte.corpo, fontWeight: 600, fontSize: 48, lineHeight: 1.3, color: cor.txt }}>{c.texto}</div>
      </Entra>
    </div>
  </AbsoluteFill>;
};

// ---------- NÚMERO: contador grande com casas decimais (payoff) ----------
// Campos: antes (linha acima), de, ate, casas, prefixo, sufixo, depois (linha abaixo), em, emDepois.
export const Numero: React.FC<any> = ({ c, k }) => {
  const m = useMarcas(k); const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const eConta = m(c.em, 30), eDepois = m(c.emDepois, 70);
  const p = spring({ frame: f - eConta, fps, config: { damping: 40, stiffness: 30, mass: 1.2 } });
  const v = interpolate(p, [0, 1], [c.de ?? 0, c.ate], clamp);
  const txt = v.toLocaleString('pt-BR', { minimumFractionDigits: c.casas ?? 0, maximumFractionDigits: c.casas ?? 0 });
  const brilho = interpolate(p, [0.8, 1], [0, 1], clamp);
  return <AbsoluteFill>
    <Sfx em={eConta} som="whoosh" vol={0.3} />
    <Sfx em={eConta + 40} som="hit" vol={0.45} />
    <div style={{ position: 'absolute', left: 70, right: 70, top: 360, height: 1040, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <Entra em={2}><div style={{ fontFamily: fonte.sora, fontWeight: 700, fontSize: 46, lineHeight: 1.3, color: cor.txtDim }}>{c.antes}</div></Entra>
      <div style={{ fontFamily: fonte.display, fontWeight: 900, fontSize: c.tn || 420, lineHeight: 0.9, color: cor.verde, marginTop: 20, fontVariantNumeric: 'tabular-nums', textShadow: `0 0 ${80 * brilho}px rgba(11,164,87,.8)`, opacity: f >= eConta ? 1 : 0.15 }}>{c.prefixo}{txt}{c.sufixo}</div>
      <Entra em={eDepois} style={{ marginTop: 50 }}><div style={{ fontFamily: fonte.display, fontWeight: 900, fontSize: 92, lineHeight: 1, textTransform: 'uppercase', color: cor.branco }}>{c.depois}</div></Entra>
    </div>
  </AbsoluteFill>;
};

// Capa do Reels (roteiro com `capa: {linhas: [...], sub}`): a frase do gancho inteira, com [[palavra]] em verde.
export const CapaMotiva: React.FC<{ capa: any }> = ({ capa }) => {
  const maior = Math.max(...lista(capa.linhas).map((l: string) => l.replace(/\[\[|\]\]/g, '').length));
  const px = Math.min(capa.ts || 200, Math.floor(920 / (maior * 0.46)));
  return <div style={{ position: 'absolute', left: 70, right: 70, top: 360, height: 1060, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
    {lista(capa.linhas).map((l: string, i: number) => <div key={i} style={{ fontFamily: fonte.display, fontWeight: 900, fontSize: px, lineHeight: 0.98, textTransform: 'uppercase', color: cor.branco, textShadow: '0 6px 30px rgba(0,0,0,.5)' }}>
      {l.split(/(\[\[.+?\]\])/g).map((p, j) => p.startsWith('[[') ? <span key={j} style={{ color: cor.verde, textShadow: '0 0 60px rgba(11,164,87,.7), 0 0 120px rgba(11,164,87,.35)' }}>{p.slice(2, -2)}</span> : p)}
    </div>)}
    {capa.sub && <div style={{ marginTop: 40, fontFamily: fonte.sora, fontWeight: 700, fontSize: 44, color: cor.menta }}>{capa.sub}</div>}
  </div>;
};

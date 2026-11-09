import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { cor, ease, fonte, mola } from './tema';
import { clamp, Conta, Entra, lista, Rico, Sfx, Titulo, useMarcas, useRespira, useTraco } from './util';
import { Check, Exclama, Icone } from './icones';
import { Marca, Simbolo } from './camadas';

// Área útil (fora do cabeçalho e da faixa de legendas; longe da interface do Instagram).
const Area: React.FC<{ children: any; topo?: number; alt?: number; centro?: boolean }> = ({ children, topo = 330, alt = 1070, centro = true }) =>
  <div style={{ position: 'absolute', left: 80, right: 80, top: topo, height: alt, display: 'flex', flexDirection: 'column', justifyContent: centro ? 'center' : 'flex-start' }}>{children}</div>;

const card = { background: cor.fundoCard, border: `2px solid ${cor.bordaCard}`, borderRadius: 26 };
const txt = (px: number, peso = 600, c = cor.txt) => ({ fontFamily: fonte.corpo, fontWeight: peso, fontSize: px, lineHeight: 1.3, color: c });
const sora = (px: number, c = cor.menta) => ({ fontFamily: fonte.sora, fontWeight: 800, fontSize: px, letterSpacing: '.14em', textTransform: 'uppercase' as const, color: c });

// ---------- GANCHO: frase de impacto em segundos (sem esperar a fala), selo e número opcional ----------
const Gancho: React.FC<any> = ({ c }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const zoom = interpolate(f, [0, 90], [1.06, 1], { ...clamp, easing: ease.out });
  const flash = interpolate(f, [0, 7], [0.55, 0], clamp);
  const ps = spring({ frame: f - 2, fps, config: mola.bouncy });
  const temNum = c.numero != null;
  return <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
    <Sfx em={1} som="hit" vol={0.55} />
    <Area>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36 }}>
        {c.selo && <div style={{ ...sora(40, cor.tinta), background: cor.amarelo, padding: '14px 28px 12px', transform: `rotate(-3deg) scale(${ps})` }}>{c.selo}</div>}
        {temNum && <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontFamily: fonte.display, fontWeight: 900, fontSize: c.tn || 400, lineHeight: 0.82, color: 'transparent', WebkitTextStroke: `6px ${cor.menta}` }}><Conta alvo={c.numero} em={4} /></div>
          <Entra em={12}><div style={{ ...sora(46, cor.branco), marginTop: 10 }}>{c.numeroRot}</div></Entra>
        </div>}
        <Titulo t={c.linhas} em={temNum ? 10 : 4} px={c.ts || (temNum ? 128 : 158)} centro />
        {c.sub && <Entra em={22}><div style={{ ...txt(50, 600, cor.menta), textAlign: 'center' }}>{c.sub}</div></Entra>}
      </div>
    </Area>
    <AbsoluteFill style={{ background: cor.branco, opacity: flash }} />
  </AbsoluteFill>;
};

// ---------- REGRA: número da regra, título, ícone, "pode" (✓), exceção (!), fonte ----------
const Regra: React.FC<any> = ({ c, k }) => {
  const m = useMarcas(k); const f = useCurrentFrame();
  const ePode = m(c.em, 30), eExc = m(c.emExcecao, 60);
  const r = useRespira(28, 5);
  return <Area>
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
      <div>
        <Entra em={2} x={-60} y={0}><div style={{ fontFamily: fonte.display, fontWeight: 900, fontSize: 230, lineHeight: 0.8, color: 'transparent', WebkitTextStroke: `5px ${cor.menta}` }}>{String(c.n).padStart(2, '0')}</div></Entra>
        <div style={{ marginTop: 22 }}><Titulo t={c.titulo} em={6} px={130} /></div>
      </div>
      <div style={{ transform: `translateY(${r}px)`, marginBottom: 10 }}><Icone nome={c.icone} px={210} p={useTraco(8, 26)} /></div>
    </div>
    <Sfx em={ePode} som="pop" />
    <Entra em={ePode} style={{ marginTop: 60 }}>
      <div style={{ background: cor.papel, borderRadius: 26, padding: '34px 34px', display: 'flex', gap: 26, alignItems: 'center' }}>
        <Check px={86} p={interpolate(f, [ePode + 4, ePode + 22], [0, 1], clamp)} />
        <div style={{ fontFamily: fonte.sora, fontWeight: 700, fontSize: 46, lineHeight: 1.22, color: cor.tinta }}>{c.pode}</div>
      </div>
    </Entra>
    {c.excecao && <><Sfx em={eExc} som="pop" vol={0.22} />
      <Entra em={eExc} style={{ marginTop: 22 }}>
        <div style={{ ...card, padding: '28px 32px', display: 'flex', gap: 24, alignItems: 'center', borderLeft: `10px solid ${cor.amarelo}` }}>
          <Exclama px={64} p={interpolate(f, [eExc + 4, eExc + 22], [0, 1], clamp)} />
          <div style={txt(38, 600)}>{c.excecao}</div>
        </div>
      </Entra></>}
    {c.fonte && <Entra em={eExc + 14} y={16}><div style={{ ...sora(26, cor.txtDim), letterSpacing: '.08em', marginTop: 30 }}>{c.fonte}</div></Entra>}
  </Area>;
};

// ---------- LISTA: título + itens com ✓ entrando quando são ditos ----------
const ListaC: React.FC<any> = ({ c, k }) => {
  const m = useMarcas(k); const f = useCurrentFrame();
  const ems = lista(c.itens).map((it: any, i: number) => m(it.em, 20 + i * 18));
  return <Area>
    <Titulo t={c.titulo} em={2} px={130} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 56 }}>
      {lista(c.itens).map((it: any, i: number) => <React.Fragment key={i}>
        <Sfx em={ems[i]} som="pop" vol={0.25} />
        <Entra em={ems[i]} x={-80} y={0}>
          <div style={{ ...card, padding: '30px 30px', display: 'flex', gap: 26, alignItems: 'center' }}>
            <Check px={74} p={interpolate(f, [ems[i] + 2, ems[i] + 18], [0, 1], clamp)} />
            <div style={{ fontFamily: fonte.sora, fontWeight: 700, fontSize: 46, lineHeight: 1.2, color: cor.branco }}><Rico t={it.t} /></div>
          </div>
        </Entra>
      </React.Fragment>)}
    </div>
  </Area>;
};

// ---------- VERSUS: duas colunas com selo VS; itens entram quando são ditos ----------
const Versus: React.FC<any> = ({ c, k }) => {
  const m = useMarcas(k); const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const lados = lista(c.lados);
  const ems = lados.map((l: any) => lista(l.itens).map((it: any, i: number) => m(it.em)));
  const inicioLado = ems.map((e: number[], i: number) => Math.max(4 + i * 6, (e[0] ?? 20) - 8));
  const pv = spring({ frame: f - 10, fps, config: mola.bouncy });
  return <Area>
    <Titulo t={c.titulo} em={2} px={110} centro />
    <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26, marginTop: 54 }}>
      {lados.map((l: any, li: number) => <div key={li} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Entra em={inicioLado[li]} y={-30}>
          <div style={{ background: li ? cor.verde : cor.papel, color: li ? cor.branco : cor.tinta, fontFamily: fonte.display, fontWeight: 900, fontSize: l.nome.length > 8 ? 64 : 84, lineHeight: 1, textTransform: 'uppercase', textAlign: 'center', padding: l.nome.length > 8 ? '40px 10px 32px' : '30px 10px 24px', borderRadius: 24 }}>{l.nome}</div>
        </Entra>
        {lista(l.itens).map((it: any, i: number) => <React.Fragment key={i}>
          <Sfx em={ems[li][i]} som="pop" vol={0.22} />
          <Entra em={ems[li][i]} y={30}>
            <div style={{ ...card, padding: '26px 24px', minHeight: 160, display: 'flex', alignItems: 'center', ...txt(42, 500) }}><div><Rico t={it.t} forte={cor.branco} /></div></div>
          </Entra>
        </React.Fragment>)}
      </div>)}
      <div style={{ position: 'absolute', left: '50%', top: 6, width: 120, height: 120, marginLeft: -60, borderRadius: '50%', background: cor.amarelo, border: `7px solid ${cor.base}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonte.display, fontWeight: 900, fontSize: 56, color: cor.tinta, transform: `scale(${pv}) rotate(${interpolate(pv, [0, 1], [-40, -8])}deg)` }}>VS</div>
    </div>
  </Area>;
};

// ---------- ANALOGIA: dois quadros desenhados (parede sem porta x porta com passe livre) ----------
const Desenho: React.FC<{ tipo: string; p: number; carimbo: number }> = ({ tipo, p, carimbo }) => {
  const T = (w = 6, c: string = cor.menta) => ({ fill: 'none', stroke: c, strokeWidth: w, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p });
  if (tipo === 'parede') return <svg width="360" height="330" viewBox="0 0 360 330">
    {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M20 ${40 + i * 40} H340`} stroke="rgba(185,255,241,.12)" strokeWidth="2" />)}
    <path d="M40 300 V40 H320 V300" {...T(10)} />
    <path d="M40 300 H320" {...T(10)} />
    <rect x="140" y="150" width="80" height="150" fill="none" stroke={cor.menta} strokeWidth="4" strokeDasharray="12 10" opacity={p * 0.6} />
    <path d="M150 170 L210 230 M210 170 L150 230" stroke={cor.amarelo} strokeWidth="9" strokeLinecap="round" opacity={carimbo} />
  </svg>;
  return <svg width="360" height="330" viewBox="0 0 360 330">
    <path d="M40 300 V40 H320 V300 H40" {...T(10)} />
    <rect x="130" y="110" width="100" height="190" rx="6" {...T(7)} />
    <circle cx="212" cy="210" r="6" fill={cor.menta} opacity={p} />
    <g transform={`translate(225 130) rotate(${-12 + (1 - p) * 20})`} opacity={p}>
      <rect x="0" y="0" width="120" height="64" rx="8" fill={cor.amarelo} />
      <text x="60" y="27" textAnchor="middle" fontFamily="Sora" fontWeight="800" fontSize="15" fill={cor.tinta}>PASSE</text>
      <text x="60" y="48" textAnchor="middle" fontFamily="Sora" fontWeight="800" fontSize="15" fill={cor.tinta}>LIVRE</text>
    </g>
    <g opacity={carimbo} transform={`translate(285 162) rotate(-18) scale(${1.6 - 0.6 * carimbo})`}>
      <rect x="-82" y="-24" width="164" height="48" rx="6" fill="none" stroke={cor.erro} strokeWidth="6" />
      <text x="0" y="10" textAnchor="middle" fontFamily="Sora" fontWeight="800" fontSize="24" fill={cor.erro}>REVOGADO</text>
    </g>
  </svg>;
};
const Analogia: React.FC<any> = ({ c, k }) => {
  const m = useMarcas(k); const f = useCurrentFrame();
  const lados = lista(c.lados);
  const ems: number[] = [], emsT: number[] = [];
  lados.forEach((l: any, i: number) => { ems.push(m(l.nome, 10 + i * 40)); emsT.push(m(l.em, 30 + i * 40)); });
  const eCar = m(c.emCarimbo || 'cancelado', 9999);
  return <Area>
    <Titulo t={c.titulo} em={2} px={110} centro />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 26, marginTop: 50 }}>
      {lados.map((l: any, i: number) => <React.Fragment key={i}>
        <Sfx em={ems[i]} som="whoosh" vol={0.2} />
        <Entra em={ems[i]} x={i ? 80 : -80} y={0}>
          <div style={{ ...card, display: 'grid', gridTemplateColumns: '360px 1fr', alignItems: 'center', gap: 20, padding: '18px 26px 18px 10px' }}>
            <Desenho tipo={l.desenho} p={interpolate(f, [ems[i] + 2, ems[i] + 30], [0, 1], { ...clamp, easing: ease.out })}
              carimbo={l.desenho === 'parede' ? interpolate(f, [emsT[i], emsT[i] + 10], [0, 1], clamp) : interpolate(f, [eCar, eCar + 8], [0, 1], clamp)} />
            <div>
              <div style={{ fontFamily: fonte.display, fontWeight: 900, fontSize: 72, textTransform: 'uppercase', color: i ? cor.verde : cor.branco, lineHeight: 1 }}>{l.nome}</div>
              <Entra em={emsT[i]} y={20}><div style={{ ...txt(36, 600), marginTop: 12 }}>{l.t}</div></Entra>
            </div>
          </div>
        </Entra>
      </React.Fragment>)}
      <Sfx em={eCar} som="hit" vol={0.3} />
    </div>
  </Area>;
};

// ---------- FICHAS: números do edital / exemplos, contando quando são ditos ----------
const Fichas: React.FC<any> = ({ c, k }) => {
  const m = useMarcas(k);
  const it = lista(c.itens);
  const ems = it.map((x: any, i: number) => m(x.em, 16 + i * 30));
  const grade = it.length > 2;
  return <Area>
    <Titulo t={c.titulo} em={2} px={110} />
    <div style={{ display: 'grid', gridTemplateColumns: grade ? '1fr 1fr' : '1fr', gap: 22, marginTop: 50 }}>
      {it.map((x: any, i: number) => <React.Fragment key={i}>
        <Sfx em={ems[i]} som="pop" vol={0.25} />
        <Entra em={ems[i]} y={50} s={0.9} m={mola.snappy}>
          <div style={{ background: cor.papel, borderRadius: 26, padding: grade ? '30px 28px 30px' : '34px 36px', minHeight: grade ? 330 : 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ ...sora(grade ? 24 : 28, cor.cinza) }}>{x.rot}</div>
            <div style={{ fontFamily: fonte.display, fontWeight: 900, fontSize: grade ? (String(x.valor).length > 7 ? 100 : 120) : 130, lineHeight: 0.95, color: cor.tinta, textTransform: 'uppercase', marginTop: 10 }}>
              {x.conta != null ? <Conta alvo={x.conta} em={ems[i] + 2} prefixo={x.prefixo} /> : x.valor}</div>
            {x.detalhe && <div style={{ ...txt(grade ? 30 : 34, 600, cor.cinza), marginTop: 10 }}>{x.detalhe}</div>}
          </div>
        </Entra>
      </React.Fragment>)}
    </div>
  </Area>;
};

// ---------- ROSCA: gráfico de rosca com as partes crescendo ----------
const Rosca: React.FC<any> = ({ c, k }) => {
  const m = useMarcas(k); const f = useCurrentFrame();
  const partes = lista(c.partes);
  const ems = partes.map((p: any, i: number) => m(p.em, 20 + i * 30));
  const eNota = m(c.emNota, 999);
  const total = partes.reduce((s: number, p: any) => s + p.valor, 0);
  const R = partes.length > 2 ? 190 : 230, ESP = partes.length > 2 ? 84 : 96, C = 2 * Math.PI * R;
  const cores = [cor.menta, cor.verde, cor.amarelo];
  let acum = 0;
  const r = useRespira(40, 3);
  return <Area>
    <Titulo t={c.titulo} em={2} px={110} centro />
    <div style={{ position: 'relative', alignSelf: 'center', marginTop: 40, transform: `translateY(${r}px)` }}>
      <svg width={2 * R + ESP} height={2 * R + ESP} viewBox={`0 0 ${2 * R + ESP} ${2 * R + ESP}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={R + ESP / 2} cy={R + ESP / 2} r={R} fill="none" stroke="rgba(185,255,241,.1)" strokeWidth={ESP} />
        {partes.map((p: any, i: number) => {
          const g = interpolate(f, [ems[i], ems[i] + 22], [0, 1], { ...clamp, easing: ease.out });
          const tam = (p.valor / total) * C;
          const el = <circle key={i} cx={R + ESP / 2} cy={R + ESP / 2} r={R} fill="none" stroke={cores[i]} strokeWidth={ESP} strokeDasharray={`${Math.max(0, tam * g - 6)} ${C}`} strokeDashoffset={-acum} />;
          acum += tam; return el;
        })}
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: fonte.display, fontWeight: 900, fontSize: Math.round(R * 0.82), lineHeight: 0.85, color: cor.branco }}><Conta alvo={+c.centro} em={4} /></div>
        <div style={sora(32, cor.menta)}>{c.centroRot}</div>
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 40 }}>
      {partes.map((p: any, i: number) => <React.Fragment key={i}><Sfx em={ems[i]} som="pop" vol={0.25} />
        <Entra em={ems[i]} x={-50} y={0}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <span style={{ width: 40, height: 40, borderRadius: 10, background: cores[i], flex: 'none' }} />
            <span style={{ fontFamily: fonte.display, fontWeight: 900, fontSize: 76, color: cor.branco, lineHeight: 1, width: 90 }}>{p.valor}</span>
            <span style={txt(40, 600)}>{p.rot}</span>
          </div>
        </Entra></React.Fragment>)}
      {c.nota && <><Sfx em={eNota} som="pop" vol={0.22} /><Entra em={eNota} style={{ marginTop: 14 }}>
        <div style={{ ...card, borderLeft: `10px solid ${cor.amarelo}`, padding: '22px 28px', ...txt(36, 600) }}>{c.nota}</div></Entra></>}
    </div>
  </Area>;
};

// ---------- ETAPAS: linha do tempo que se desenha; datas com alerta em amarelo ----------
const Etapas: React.FC<any> = ({ c, k }) => {
  const m = useMarcas(k); const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const it = lista(c.itens);
  const ems = it.map((x: any, i: number) => m(x.em, 16 + i * 30));
  const ultimo = ems[ems.length - 1];
  const linha = interpolate(f, [ems[0], ultimo + 10], [0, 1], { ...clamp, easing: ease.inOut });
  return <Area>
    <Titulo t={c.titulo} em={2} px={130} />
    <div style={{ position: 'relative', marginTop: 56, paddingLeft: 70 }}>
      <div style={{ position: 'absolute', left: 20, top: 20, width: 6, bottom: 40, background: 'rgba(185,255,241,.15)', borderRadius: 3 }} />
      <div style={{ position: 'absolute', left: 20, top: 20, width: 6, height: `calc((100% - 60px) * ${linha})`, background: cor.menta, borderRadius: 3 }} />
      {it.map((x: any, i: number) => {
        const p = spring({ frame: f - ems[i], fps, config: mola.bouncy });
        const pulso = x.alerta ? 1 + Math.max(0, Math.sin((f - ems[i]) / 5)) * 0.05 * (f > ems[i] ? 1 : 0) : 1;
        return <div key={i} style={{ position: 'relative', marginBottom: 46 }}>
          <Sfx em={ems[i]} som={x.alerta ? 'hit' : 'pop'} vol={x.alerta ? 0.3 : 0.25} />
          <span style={{ position: 'absolute', left: -66, top: 12, width: 40, height: 40, borderRadius: '50%', background: x.alerta ? cor.amarelo : cor.base, border: `6px solid ${x.alerta ? cor.amarelo : cor.menta}`, transform: `scale(${p})` }} />
          <Entra em={ems[i]} x={60} y={0}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, transform: `scale(${pulso})`, transformOrigin: 'left center' }}>
              <span style={{ fontFamily: fonte.display, fontWeight: 900, fontSize: 82, lineHeight: 1, color: x.alerta ? cor.amarelo : cor.menta }}>{x.data}</span>
              {x.alerta && <span style={{ ...sora(24, cor.tinta), background: cor.amarelo, padding: '8px 14px 6px' }}>atenção</span>}
            </div>
            <div style={{ ...txt(48, 600, cor.branco), marginTop: 6 }}>{x.t}</div>
          </Entra>
        </div>;
      })}
    </div>
  </Area>;
};

// ---------- LEI: trecho da lei em papel, palavra riscada e trocada (pegadinha) ----------
const Lei: React.FC<any> = ({ c, k }) => {
  const m = useMarcas(k); const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const eRisca = m(c.em, 40), eTroca = m(c.emTroca, 80);
  const risco = interpolate(f, [eRisca + 4, eRisca + 14], [0, 1], { ...clamp, easing: ease.out });
  const pt = spring({ frame: f - eTroca, fps, config: mola.bouncy });
  const ps = spring({ frame: f - 2, fps, config: mola.bouncy });
  const partes = String(c.texto).split(/(\[\[.+?\]\])/g);
  return <Area>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ ...sora(44, cor.tinta), background: cor.amarelo, padding: '14px 28px 12px', transform: `rotate(-3deg) scale(${ps})` }}>{c.selo}</div>
    </div>
    <Sfx em={2} som="hit" vol={0.4} />
    <Entra em={8} y={60} style={{ marginTop: 50 }}>
      <div style={{ background: cor.papel, borderRadius: 26, padding: '44px 44px 50px', boxShadow: '0 40px 80px -20px rgba(0,0,0,.5)', transform: `rotate(${interpolate(f, [0, 200], [-1.2, 0.4], clamp)}deg)` }}>
        <div style={{ fontFamily: fonte.corpo, fontWeight: 500, fontSize: 48, lineHeight: 1.5, color: cor.tinta, marginTop: 50 }}>
          {partes.map((p, i) => p.startsWith('[[') ? <span key={i} style={{ position: 'relative', display: 'inline-block', fontWeight: 800 }}>
            <span style={{ position: 'absolute', left: -6, right: -6, top: '52%', height: 8, background: cor.erro, transformOrigin: 'left', transform: `scaleX(${risco}) rotate(-3deg)` }} />
            {p.slice(2, -2)}
            <span style={{ position: 'absolute', left: '50%', bottom: '78%', transform: `translateX(-50%) rotate(-6deg) scale(${pt})`, background: cor.verde, color: cor.branco, fontFamily: fonte.display, fontWeight: 900, fontSize: 64, textTransform: 'uppercase', padding: '2px 16px 0', whiteSpace: 'nowrap' }}>{c.troca}</span>
          </span> : <React.Fragment key={i}>{p}</React.Fragment>)}
        </div>
        <div style={{ ...sora(30, cor.verdeEsc), letterSpacing: '.1em', marginTop: 26 }}>{c.ref}</div>
      </div>
    </Entra>
    <Sfx em={eRisca + 4} som="erro" vol={0.25} />
    <Sfx em={eTroca} som="ding" vol={0.3} />
    {c.nota && <Entra em={eTroca + 10} style={{ marginTop: 50 }}><div style={{ fontFamily: fonte.display, fontWeight: 900, fontSize: 92, lineHeight: 1, textTransform: 'uppercase', color: cor.branco, textAlign: 'center' }}>{c.nota}</div></Entra>}
  </Area>;
};

// ---------- FRASE: regra de bolso gigante ----------
const Frase: React.FC<any> = ({ c }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, 120], [1, 1.05], { ...clamp, easing: ease.inOut });
  return <Area><Sfx em={2} som="hit" vol={0.35} /><div style={{ transform: `scale(${s})` }}><Titulo t={c.linhas} em={3} px={c.ts || 170} centro /></div></Area>;
};

// ---------- CTA: celular com a tela do produto + caixa de comentário com a palavra ----------
const TELAS: any = {
  edital: { nome: 'Edital com Líbero', sub: 'Polícia Penal PE', itens: [['Língua Portuguesa', 0.8], ['Direito Penal', 0.55], ['Execução Penal', 0.35], ['Direito Constitucional', 0.65], ['Legislação Especial', 0.2]] },
  curso: { nome: 'Curso Concurso', sub: 'com Líbero', blocos: ['Banco de questões', 'Flashcards', 'Material de apoio', 'Aulas'] },
};
const Celular: React.FC<{ produto: string; em: number; tela?: any }> = ({ produto, em, tela: t }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const tela = { ...(TELAS[produto] || TELAS.curso), ...(t || {}) };
  return <div style={{ width: 470, height: 860, borderRadius: 64, background: '#0d1513', padding: 16, boxShadow: '0 50px 90px -20px rgba(0,0,0,.7), 0 0 0 3px rgba(185,255,241,.25)' }}>
    <div style={{ width: '100%', height: '100%', borderRadius: 50, background: cor.papel, overflow: 'hidden', position: 'relative' }}>
      <div style={{ background: cor.base, padding: '56px 30px 28px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Simbolo px={64} p={interpolate(f, [em, em + 20], [0, 1], clamp)} />
        <div><div style={{ fontFamily: fonte.sora, fontWeight: 800, fontSize: 28, color: cor.branco }}>{tela.nome}</div><div style={{ fontFamily: fonte.sora, fontWeight: 600, fontSize: 20, color: cor.menta, marginTop: 4 }}>{tela.sub}</div></div>
      </div>
      <div style={{ padding: '24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {tela.itens && tela.itens.map(([n, v]: any, i: number) => {
          const g = interpolate(f, [em + 10 + i * 5, em + 40 + i * 5], [0, v], { ...clamp, easing: ease.out });
          return <div key={i} style={{ background: cor.branco, borderRadius: 18, padding: '18px 20px', boxShadow: '0 4px 12px rgba(6,32,28,.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: fonte.corpo, fontWeight: 700, fontSize: 22, color: cor.tinta }}><span>{n}</span><span style={{ color: cor.verdeEsc }}>{Math.round(g * 100)}%</span></div>
            <div style={{ height: 12, borderRadius: 6, background: '#DCE9E5', marginTop: 12 }}><div style={{ height: '100%', width: `${g * 100}%`, borderRadius: 6, background: cor.verde }} /></div>
          </div>;
        })}
        {tela.blocos && tela.blocos.map((n: string, i: number) => {
          const p = spring({ frame: f - em - 8 - i * 5, fps, config: mola.snappy });
          return <div key={i} style={{ background: i === 0 ? cor.verde : cor.branco, borderRadius: 20, padding: '26px 22px', display: 'flex', alignItems: 'center', gap: 16, opacity: p, transform: `translateY(${(1 - p) * 30}px)`, boxShadow: '0 4px 12px rgba(6,32,28,.08)' }}>
            <Check px={46} p={p} fundo={i === 0 ? cor.branco : cor.verde} traco={i === 0 ? cor.verde : cor.branco} />
            <span style={{ fontFamily: fonte.sora, fontWeight: 700, fontSize: 28, color: i === 0 ? cor.branco : cor.tinta }}>{n}</span>
          </div>;
        })}
      </div>
    </div>
  </div>;
};
const Cta: React.FC<any> = ({ c, k }) => {
  const m = useMarcas(k); const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const eCom = m('comenta', 10);
  const palavra = String(c.comenta);
  const letras = Math.floor(interpolate(f, [eCom + 6, eCom + 6 + palavra.length * 3], [0, palavra.length], clamp));
  const r = useRespira(32, 8);
  const pc = spring({ frame: f - eCom, fps, config: mola.bouncy });
  return <Area topo={300} alt={1110} centro={false}>
    <Titulo t={c.titulo} em={2} px={104} centro />
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
      <Entra em={6} y={120} s={0.9}><div style={{ transform: `translateY(${r}px) rotate(${Math.sin(f / 40) * 1.2}deg) scale(.96)`, transformOrigin: 'top center', height: 830 }}><Celular produto={c.produto} em={10} tela={c.tela} /></div></Entra>
    </div>
    <Sfx em={eCom} som="pop" vol={0.35} />
    <div style={{ position: 'absolute', left: 30, right: 30, top: 1000, display: 'flex', alignItems: 'center', gap: 20, background: cor.branco, borderRadius: 60, padding: '18px 26px', boxShadow: '0 20px 50px rgba(0,0,0,.4)', opacity: pc, transform: `scale(${interpolate(pc, [0, 1], [0.7, 1])})` }}>
      <div style={{ width: 70, height: 70, borderRadius: '50%', background: cor.verde, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Simbolo px={50} /></div>
      <div style={{ fontFamily: fonte.sora, fontWeight: 600, fontSize: 34, color: cor.cinza }}>Comenta</div>
      <div style={{ fontFamily: fonte.display, fontWeight: 900, fontSize: 70, color: cor.tinta, lineHeight: 1, letterSpacing: '.02em' }}>{palavra.slice(0, letras)}<span style={{ opacity: Math.floor(f / 8) % 2 ? 1 : 0.2, color: cor.verde }}>|</span></div>
      <div style={{ marginLeft: 'auto', width: 70, height: 70, borderRadius: '50%', background: cor.verde, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="34" height="34" viewBox="0 0 24 24"><path d="M3 12 L21 3 L14 21 L11 13 Z" fill={cor.branco} /></svg></div>
    </div>
  </Area>;
};

export const CENAS: Record<string, React.FC<any>> = { gancho: Gancho, regra: Regra, lista: ListaC, versus: Versus, analogia: Analogia, fichas: Fichas, rosca: Rosca, etapas: Etapas, lei: Lei, frase: Frase, cta: Cta };
// Cenas sem legenda embaixo (o texto grande já está na tela).
export const SEM_LEGENDA = new Set(['gancho', 'frase']);

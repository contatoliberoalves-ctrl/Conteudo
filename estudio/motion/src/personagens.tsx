// Personagens originais do estúdio, em SVG puro, estilo "rubber hose" (braços e pernas de
// mangueira, mãos de luva). Cada um tem rosto (olhos que piscam, sobrancelhas por expressão,
// boca que abre com a voz), respiração, e braços com poses. Tudo é função do quadro.
import React from 'react';
import {interpolate, random} from 'remotion';

export type Pose = 'parado' | 'acena' | 'aponta' | 'joinha' | 'pensando' | 'comemora' | 'explica' | 'bracos-cruzados';
export type Expressao = 'feliz' | 'neutro' | 'surpreso' | 'bravo' | 'triste' | 'confiante';
export type TipoPersonagem = 'lex' | 'martelo' | 'ana' | 'beto' | 'libero';

export type PersonagemProps = {
  tipo: TipoPersonagem;
  frame: number;               // quadro local (para piscar, respirar, acenar)
  boca: number;                // 0 fechada … 1 aberta (vem do envelope da voz)
  pose?: Pose;
  expressao?: Expressao;
  olhar?: number;              // -1 esquerda … 1 direita
  semente?: string;
  cores?: Partial<Cores>;
  espelhado?: boolean;          // desenhado virado: desfaz o espelho dos textos
};

type Cores = {pele: string; roupa: string; roupa2: string; cabelo: string; tinta: string; luva: string; acento: string};
const PADRAO: Record<TipoPersonagem, Cores> = {
  lex: {pele: '#1F5C4A', roupa: '#174536', roupa2: '#F4E9D0', cabelo: '#D9B45A', tinta: '#14211C', luva: '#FFFFFF', acento: '#D9B45A'},
  martelo: {pele: '#B9773F', roupa: '#8E5527', roupa2: '#E7B57A', cabelo: '#5B3417', tinta: '#2A1709', luva: '#FFFFFF', acento: '#E8C17F'},
  ana: {pele: '#B97A52', roupa: '#2F8F5B', roupa2: '#1D3A2E', cabelo: '#2B1B14', tinta: '#1B1210', luva: '#B97A52', acento: '#9BE0A3'},
  beto: {pele: '#E8B48F', roupa: '#2C4A86', roupa2: '#1A2338', cabelo: '#6B4A2E', tinta: '#1B1210', luva: '#E8B48F', acento: '#FFD52E'},
  // inspirado no Líbero: terno marinho, camisa clara, gravata azul de bolinhas, óculos de tartaruga
  libero: {pele: '#C9946E', roupa: '#1E2A44', roupa2: '#18213A', cabelo: '#231A16', tinta: '#1B1210', luva: '#C9946E', acento: '#2F5BB5'},
};

// ---------- rosto ----------
function piscando(frame: number, semente: string) {
  // pisca a cada ~2,5–4,5 s, por 4 quadros; às vezes duas vezes seguidas
  let t = 0, k = 0;
  while (t <= frame) {
    const prox = t + 75 + Math.floor(random(`${semente}-p${k}`) * 60);
    if (frame >= prox && frame < prox + 4) return 1 - Math.abs(frame - prox - 1.5) / 2;
    t = prox; k++;
  }
  return 0;
}

const Olhos: React.FC<{cx: number; cy: number; sep: number; r: number; frame: number; semente: string; olhar: number; expressao: Expressao; tinta: string; sobrancelha?: number}> =
  ({cx, cy, sep, r, frame, semente, olhar, expressao, tinta, sobrancelha = 0.2}) => {
    const fecha = piscando(frame, semente);
    const surpreso = expressao === 'surpreso';
    const ry = r * (surpreso ? 1.15 : 1) * (1 - 0.92 * fecha);
    const px = olhar * r * 0.35;
    const sob = {feliz: [-4, 0], neutro: [0, 0], surpreso: [-14, 0], bravo: [6, 18], triste: [2, -16], confiante: [-2, 8]}[expressao];
    return (
      <g>
        {[-1, 1].map((lado) => (
          <g key={lado}>
            <ellipse cx={cx + lado * sep} cy={cy} rx={r * 0.82} ry={ry} fill="#fff" stroke={tinta} strokeWidth={r * 0.14} />
            {fecha < 0.6 ? <ellipse cx={cx + lado * sep + px} cy={cy + r * 0.08} rx={r * 0.38} ry={Math.min(ry, r * 0.48)} fill={tinta} /> : null}
            {fecha < 0.6 ? <circle cx={cx + lado * sep + px + r * 0.14} cy={cy - r * 0.12} r={r * 0.12} fill="#fff" /> : null}
            {/* sobrancelha: inclinação pela expressão */}
            <path d={`M ${cx + lado * sep - r * 0.7} ${cy - r * 1.35 + sob[0] * (r / 30) - lado * sob[1] * (r / 60) * -1}
                      Q ${cx + lado * sep} ${cy - r * 1.6 + sob[0] * (r / 30)} ${cx + lado * sep + r * 0.7} ${cy - r * 1.35 + sob[0] * (r / 30) + lado * sob[1] * (r / 60) * -1}`}
              stroke={tinta} strokeWidth={r * sobrancelha} strokeLinecap="round" fill="none"
              transform={sob[1] ? `rotate(${lado * sob[1] * 0.6} ${cx + lado * sep} ${cy - r * 1.4})` : undefined} />
          </g>
        ))}
      </g>
    );
  };

const Boca: React.FC<{cx: number; cy: number; w: number; abre: number; expressao: Expressao; tinta: string; lingua?: string}> =
  ({cx, cy, w, abre, expressao, tinta, lingua = '#E0636B'}) => {
    const sorriso = {feliz: 0.35, neutro: 0.08, surpreso: 0, bravo: -0.18, triste: -0.3, confiante: 0.22}[expressao];
    const a = Math.max(abre, expressao === 'surpreso' ? 0.55 : 0);
    if (a < 0.08) {
      return <path d={`M ${cx - w / 2} ${cy} Q ${cx} ${cy + w * sorriso} ${cx + w / 2} ${cy}`} stroke={tinta} strokeWidth={w * 0.09} strokeLinecap="round" fill="none" />;
    }
    const h = w * 0.62 * a;
    const ww = w * (0.85 - 0.2 * a);
    return (
      <g>
        <path d={`M ${cx - ww / 2} ${cy - sorriso * w * 0.1} Q ${cx} ${cy + w * sorriso * 0.6 - h * 0.15} ${cx + ww / 2} ${cy - sorriso * w * 0.1}
                  Q ${cx + ww * 0.45} ${cy + h} ${cx} ${cy + h * 1.05} Q ${cx - ww * 0.45} ${cy + h} ${cx - ww / 2} ${cy - sorriso * w * 0.1} Z`}
          fill={tinta} stroke={tinta} strokeWidth={w * 0.07} strokeLinejoin="round" />
        <ellipse cx={cx} cy={cy + h * 0.78} rx={ww * 0.28} ry={h * 0.22} fill={lingua} />
      </g>
    );
  };

// ---------- braços de mangueira ----------
type Ponto = [number, number];
function maoDaPose(pose: Pose, lado: -1 | 1, ombro: Ponto, comp: number, frame: number): {mao: Ponto; luva: 'aberta' | 'dedo' | 'joinha' | 'punho'} {
  const [ox, oy] = ombro;
  const onda = Math.sin(frame / 4.2);
  const lento = Math.sin(frame / 22);
  const descanso: Ponto = [ox + lado * comp * 0.28, oy + comp * 0.92 + lento * 4];
  switch (pose) {
    case 'acena':
      return lado === 1 ? {mao: [ox + comp * 0.55 + onda * comp * 0.18, oy - comp * 0.75], luva: 'aberta'} : {mao: descanso, luva: 'aberta'};
    case 'aponta':
      return lado === 1 ? {mao: [ox + comp * 1.0, oy - comp * 0.25 + lento * 6], luva: 'dedo'} : {mao: descanso, luva: 'aberta'};
    case 'joinha':
      return lado === 1 ? {mao: [ox + comp * 0.62, oy - comp * 0.15 + lento * 5], luva: 'joinha'} : {mao: descanso, luva: 'aberta'};
    case 'pensando':
      return lado === 1 ? {mao: [ox - comp * 0.42, oy - comp * 0.06], luva: 'punho'} : {mao: [ox + comp * 0.35, oy + comp * 0.42], luva: 'punho'};
    case 'comemora': {
      const pulo = Math.abs(Math.sin(frame / 5)) * comp * 0.1;
      return {mao: [ox + lado * comp * 0.5, oy - comp * 0.95 - pulo], luva: 'punho'};
    }
    case 'explica':
      return {mao: [ox + lado * comp * (0.62 + 0.08 * Math.sin(frame / 7 + lado)), oy + comp * 0.15 + Math.sin(frame / 6 + lado) * comp * 0.12], luva: 'aberta'};
    case 'bracos-cruzados':
      return {mao: [ox - lado * comp * 0.55, oy + comp * 0.45], luva: 'punho'};
    default:
      return {mao: descanso, luva: 'aberta'};
  }
}

const Braco: React.FC<{ombro: Ponto; mao: Ponto; luva: 'aberta' | 'dedo' | 'joinha' | 'punho'; grossura: number; cor: string; corLuva: string; tinta: string; lado: -1 | 1}> =
  ({ombro, mao, luva, grossura, cor, corLuva, tinta, lado}) => {
    const [ox, oy] = ombro, [mx, my] = mao;
    // cotovelo: curva macia para fora
    const cx = (ox + mx) / 2 + lado * grossura * 1.6, cy = (oy + my) / 2 + grossura * 0.8;
    const r = grossura * 1.25;
    const ang = (Math.atan2(my - cy, mx - cx) * 180) / Math.PI;
    return (
      <g>
        <path d={`M ${ox} ${oy} Q ${cx} ${cy} ${mx} ${my}`} stroke={tinta} strokeWidth={grossura + grossura * 0.36} strokeLinecap="round" fill="none" />
        <path d={`M ${ox} ${oy} Q ${cx} ${cy} ${mx} ${my}`} stroke={cor} strokeWidth={grossura} strokeLinecap="round" fill="none" />
        <g transform={`translate(${mx} ${my}) rotate(${ang})`}>
          {luva === 'dedo' ? <rect x={r * 0.4} y={-r * 0.22} width={r * 1.25} height={r * 0.46} rx={r * 0.23} fill={corLuva} stroke={tinta} strokeWidth={r * 0.16} /> : null}
          {luva === 'joinha' ? <rect x={-r * 0.25} y={-r * 1.55} width={r * 0.5} height={r * 1.1} rx={r * 0.25} fill={corLuva} stroke={tinta} strokeWidth={r * 0.16} transform={`rotate(${-ang})`} /> : null}
          <circle r={luva === 'punho' ? r * 0.85 : r} fill={corLuva} stroke={tinta} strokeWidth={r * 0.16} />
          {luva === 'aberta' ? [-40, -10, 20].map((a, i) => (
            <path key={i} d={`M ${r * 0.3} 0 L ${r * 0.95} 0`} stroke={tinta} strokeWidth={r * 0.1} strokeLinecap="round" transform={`rotate(${a})`} />
          )) : null}
        </g>
      </g>
    );
  };

const Pernas: React.FC<{x: number; y: number; abertura: number; comp: number; grossura: number; cor: string; sapato: string; tinta: string; frame: number; pula?: boolean}> =
  ({x, y, abertura, comp, grossura, cor, sapato, tinta, frame, pula}) => {
    const dobra = pula ? Math.abs(Math.sin(frame / 5)) * comp * 0.12 : 0;
    return (
      <g>
        {[-1, 1].map((l) => {
          const px = x + l * abertura, pe = y + comp - dobra;
          return (
            <g key={l}>
              <path d={`M ${px} ${y} Q ${px + l * grossura} ${y + comp / 2} ${px} ${pe}`} stroke={tinta} strokeWidth={grossura * 1.36} strokeLinecap="round" fill="none" />
              <path d={`M ${px} ${y} Q ${px + l * grossura} ${y + comp / 2} ${px} ${pe}`} stroke={cor} strokeWidth={grossura} strokeLinecap="round" fill="none" />
              <ellipse cx={px + l * grossura * 0.9} cy={pe + grossura * 0.4} rx={grossura * 1.6} ry={grossura * 0.85} fill={sapato} stroke={tinta} strokeWidth={grossura * 0.25} />
            </g>
          );
        })}
      </g>
    );
  };

// ---------- os personagens (desenhados numa caixa 400 × 600, pés em y = 590) ----------
export const Personagem: React.FC<PersonagemProps> = ({tipo, frame, boca, pose = 'parado', expressao = 'feliz', olhar = 0, semente, cores, espelhado}) => {
  const C = {...PADRAO[tipo], ...cores};
  const s = semente || tipo;
  const resp = Math.sin(frame / 14) * 4;                       // respiração
  const pulo = pose === 'comemora' ? -Math.abs(Math.sin(frame / 5)) * 30 : 0;
  const t = C.tinta;
  const corpoY = resp * 0.5 + pulo;

  if (tipo === 'lex') {
    // a Constituição em pessoa: livro em pé, capa verde com "CF/88" dourado
    const ombroE: Ponto = [118, 300 + corpoY], ombroD: Ponto = [282, 300 + corpoY];
    const bE = maoDaPose(pose, -1, ombroE, 150, frame), bD = maoDaPose(pose, 1, ombroD, 150, frame);
    return (
      <g>
        <ellipse cx={200} cy={592} rx={120} ry={16} fill="#000" opacity={0.18} />
        <Pernas x={200} y={470 + corpoY} abertura={40} comp={105 + pulo * -0.2} grossura={16} cor={C.roupa} sapato={t} tinta={t} frame={frame} pula={pose === 'comemora'} />
        <Braco ombro={ombroE} mao={bE.mao} luva={bE.luva} grossura={16} cor={C.roupa} corLuva={C.luva} tinta={t} lado={-1} />
        <g transform={`translate(0 ${corpoY}) rotate(${Math.sin(frame / 30) * 1.5} 200 480)`}>
          {/* páginas */}
          <rect x={112} y={150} width={196} height={330} rx={18} fill={C.roupa2} stroke={t} strokeWidth={7} />
          {[0, 1, 2, 3].map((i) => <line key={i} x1={300} y1={175 + i * 75} x2={300} y2={205 + i * 75} stroke="#D7C9A8" strokeWidth={5} strokeLinecap="round" />)}
          {/* capa */}
          <rect x={100} y={140} width={190} height={340} rx={20} fill={C.pele} stroke={t} strokeWidth={8} />
          <rect x={100} y={140} width={26} height={340} rx={12} fill={C.roupa} />
          <rect x={146} y={176} width={118} height={30} rx={6} fill="none" stroke={C.acento} strokeWidth={4} />
          <text x={205} y={199} textAnchor="middle" fontFamily="Titulo" fontSize={24} fill={C.acento} letterSpacing={1}
            transform={espelhado ? 'translate(410 0) scale(-1 1)' : undefined}>CF/88</text>
          <Olhos cx={205} cy={282} sep={36} r={26} frame={frame} semente={s} olhar={olhar} expressao={expressao} tinta={t} />
          <Boca cx={205} cy={352} w={64} abre={boca} expressao={expressao} tinta={t} />
          <circle cx={150} cy={330} r={11} fill="#E8826A" opacity={0.35} /><circle cx={262} cy={330} r={11} fill="#E8826A" opacity={0.35} />
        </g>
        <Braco ombro={ombroD} mao={bD.mao} luva={bD.luva} grossura={16} cor={C.roupa} corLuva={C.luva} tinta={t} lado={1} />
      </g>
    );
  }

  if (tipo === 'martelo') {
    // o martelo do juiz: cabeça de madeira na horizontal, cabo como corpo
    const ombroE: Ponto = [160, 330 + corpoY], ombroD: Ponto = [240, 330 + corpoY];
    const bE = maoDaPose(pose, -1, ombroE, 140, frame), bD = maoDaPose(pose, 1, ombroD, 140, frame);
    return (
      <g>
        <ellipse cx={200} cy={592} rx={110} ry={15} fill="#000" opacity={0.18} />
        <Pernas x={200} y={478 + corpoY} abertura={30} comp={98} grossura={15} cor={C.roupa} sapato={t} tinta={t} frame={frame} pula={pose === 'comemora'} />
        <Braco ombro={ombroE} mao={bE.mao} luva={bE.luva} grossura={15} cor={C.roupa} corLuva={C.luva} tinta={t} lado={-1} />
        <g transform={`translate(0 ${corpoY}) rotate(${Math.sin(frame / 26) * 2} 200 480)`}>
          <rect x={176} y={300} width={48} height={190} rx={22} fill={C.roupa} stroke={t} strokeWidth={7} />
          <rect x={184} y={312} width={12} height={160} rx={6} fill={C.roupa2} opacity={0.5} />
          <rect x={60} y={150} width={280} height={160} rx={44} fill={C.pele} stroke={t} strokeWidth={8} />
          <rect x={60} y={176} width={34} height={108} rx={10} fill={C.acento} stroke={t} strokeWidth={6} />
          <rect x={306} y={176} width={34} height={108} rx={10} fill={C.acento} stroke={t} strokeWidth={6} />
          <path d="M 110 180 Q 200 168 290 180" stroke={C.roupa2} strokeWidth={6} fill="none" opacity={0.6} strokeLinecap="round" />
          <Olhos cx={200} cy={222} sep={40} r={24} frame={frame} semente={s} olhar={olhar} expressao={expressao} tinta={t} />
          <Boca cx={200} cy={274} w={58} abre={boca} expressao={expressao} tinta={t} />
        </g>
        <Braco ombro={ombroD} mao={bD.mao} luva={bD.luva} grossura={15} cor={C.roupa} corLuva={C.luva} tinta={t} lado={1} />
      </g>
    );
  }

  if (tipo === 'libero') {
    // Líbero: cabeça oval com cabelo raspado (entradas leves), sobrancelhas grossas, óculos redondos
    // de tartaruga, sombra de bigode; terno marinho, camisa clara e gravata azul de bolinhas.
    const ombroE: Ponto = [136, 336 + corpoY], ombroD: Ponto = [264, 336 + corpoY];
    const bE = maoDaPose(pose, -1, ombroE, 150, frame), bD = maoDaPose(pose, 1, ombroD, 150, frame);
    const cab = Math.sin(frame / 18) * 1.6 + (boca > 0.3 ? Math.sin(frame / 3) * 0.9 : 0);
    const tart = '#7A3E17', tartClaro = '#B5652A';
    return (
      <g>
        <ellipse cx={200} cy={592} rx={115} ry={15} fill="#000" opacity={0.18} />
        <Pernas x={200} y={482 + corpoY} abertura={32} comp={96} grossura={23} cor={C.roupa2} sapato="#141414" tinta={t} frame={frame} pula={pose === 'comemora'} />
        <Braco ombro={ombroE} mao={bE.mao} luva={bE.luva} grossura={25} cor={C.roupa} corLuva={C.luva} tinta={t} lado={-1} />
        <g transform={`translate(0 ${corpoY})`}>
          {/* paletó */}
          <path d="M 122 336 Q 200 304 278 336 L 292 494 Q 200 510 108 494 Z" fill={C.roupa} stroke={t} strokeWidth={7} strokeLinejoin="round" />
          {/* camisa e gravata */}
          <path d="M 170 318 L 200 420 L 230 318 Z" fill="#E9EDF2" stroke={t} strokeWidth={5} strokeLinejoin="round" />
          <path d="M 190 336 L 210 336 L 216 352 L 206 360 L 214 440 L 200 456 L 186 440 L 194 360 L 184 352 Z" fill={C.acento} stroke={t} strokeWidth={4} strokeLinejoin="round" />
          {[[198, 372], [205, 392], [195, 410], [204, 428], [199, 446]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.6} fill="#fff" />)}
          {/* lapelas */}
          <path d="M 168 320 L 196 420 L 150 360 L 162 340 Z" fill={C.roupa2} stroke={t} strokeWidth={5} strokeLinejoin="round" />
          <path d="M 232 320 L 204 420 L 250 360 L 238 340 Z" fill={C.roupa2} stroke={t} strokeWidth={5} strokeLinejoin="round" />
          <path d="M 252 380 L 270 378" stroke="#E9EDF2" strokeWidth={5} strokeLinecap="round" />
          <g transform={`rotate(${cab} 200 300)`}>
            <rect x={182} y={270} width={36} height={50} fill={C.pele} stroke={t} strokeWidth={6} />
            {/* orelhas */}
            <ellipse cx={100} cy={206} rx={15} ry={22} fill={C.pele} stroke={t} strokeWidth={6} />
            <ellipse cx={300} cy={206} rx={15} ry={22} fill={C.pele} stroke={t} strokeWidth={6} />
            {/* cabeça oval, testa alta */}
            <ellipse cx={200} cy={180} rx={98} ry={114} fill={C.pele} stroke={t} strokeWidth={8} />
            {/* cabelo raspado: sombra escura com textura, entradas leves nas têmporas */}
            <path d="M 106 168 Q 100 76 200 64 Q 300 76 294 168 Q 286 124 262 112 Q 236 96 200 98 Q 164 96 138 112 Q 114 124 106 168 Z"
              fill={C.cabelo} opacity={0.82} />
            {Array.from({length: 46}).map((_, i) => {
              const a = Math.PI * (0.08 + 0.84 * ((i * 37) % 46) / 46), rr = 92 + (i % 3) * 3;
              return <circle key={i} cx={200 - Math.cos(a) * rr * 0.98} cy={176 - Math.sin(a) * rr * 1.12 + 4} r={1.6} fill={C.pele} opacity={0.35} />;
            })}
            <ellipse cx={200} cy={180} rx={98} ry={114} fill="none" stroke={t} strokeWidth={8} />
            {/* sobrancelhas grossas + olhos */}
            <Olhos cx={200} cy={203} sep={42} r={18} frame={frame} semente={s} olhar={olhar} expressao={expressao} tinta={t} sobrancelha={0} />
            {/* sobrancelhas grossas, acima dos óculos, mudando com a expressão */}
            {[-1, 1].map((l) => {
              const [sobe, inclina] = {feliz: [-3, 0], neutro: [0, 0], surpreso: [-12, -2], bravo: [6, 9], triste: [0, -8], confiante: [-2, 5]}[expressao];
              const x0 = 200 + l * 22, x1 = 200 + l * 66, y = 160 + sobe;
              return <path key={l} d={`M ${x0} ${y + inclina} Q ${(x0 + x1) / 2} ${y - 9} ${x1} ${y + 3}`} stroke={C.cabelo} strokeWidth={11} strokeLinecap="round" fill="none" />;
            })}
            {/* óculos redondos de tartaruga */}
            <g fill="none">
              <circle cx={158} cy={203} r={33} fill="#DDEAF2" fillOpacity={0.18} stroke={tart} strokeWidth={8} />
              <circle cx={242} cy={203} r={33} fill="#DDEAF2" fillOpacity={0.18} stroke={tart} strokeWidth={8} />
              <path d="M 186 196 Q 200 188 214 196" stroke={tart} strokeWidth={7} strokeLinecap="round" />
              <path d="M 125 198 L 104 192" stroke={tart} strokeWidth={6} strokeLinecap="round" />
              <path d="M 275 198 L 296 192" stroke={tart} strokeWidth={6} strokeLinecap="round" />
              {[[134, 186], [150, 172], [176, 180], [228, 174], [262, 184], [270, 214], [140, 226], [250, 232]].map(([x, y], i) =>
                <circle key={i} cx={x} cy={y} r={3.2} fill={tartClaro} />)}
              <path d="M 140 186 Q 148 178 158 176" stroke="#fff" strokeWidth={4} strokeLinecap="round" opacity={0.7} />
              <path d="M 224 186 Q 232 178 242 176" stroke="#fff" strokeWidth={4} strokeLinecap="round" opacity={0.7} />
            </g>
            {/* nariz arredondado */}
            <path d="M 196 214 Q 186 240 190 248 Q 200 256 212 248" stroke={t} strokeWidth={5} fill="none" strokeLinecap="round" />
            {/* sombra de bigode */}
            <path d="M 172 262 Q 200 254 228 262" stroke={C.cabelo} strokeWidth={7} strokeLinecap="round" fill="none" opacity={0.08} />
            <Boca cx={200} cy={274} w={58} abre={boca} expressao={expressao} tinta={t} />
            <circle cx={140} cy={252} r={11} fill="#E07A6A" opacity={0.25} /><circle cx={260} cy={252} r={11} fill="#E07A6A" opacity={0.25} />
          </g>
        </g>
        <Braco ombro={ombroD} mao={bD.mao} luva={bD.luva} grossura={25} cor={C.roupa} corLuva={C.luva} tinta={t} lado={1} />
      </g>
    );
  }

  // humanos: Ana (concurseira, coque e óculos) e Beto (professor, barba)
  const ana = tipo === 'ana';
  const ombroE: Ponto = [140, 330 + corpoY], ombroD: Ponto = [260, 330 + corpoY];
  const bE = maoDaPose(pose, -1, ombroE, 150, frame), bD = maoDaPose(pose, 1, ombroD, 150, frame);
  const cab = Math.sin(frame / 18) * 1.6 + (boca > 0.3 ? Math.sin(frame / 3) * 0.8 : 0);
  return (
    <g>
      <ellipse cx={200} cy={592} rx={115} ry={15} fill="#000" opacity={0.18} />
      <Pernas x={200} y={478 + corpoY} abertura={32} comp={100} grossura={22} cor={C.roupa2} sapato={t} tinta={t} frame={frame} pula={pose === 'comemora'} />
      <Braco ombro={ombroE} mao={bE.mao} luva={bE.luva} grossura={24} cor={C.roupa} corLuva={C.luva} tinta={t} lado={-1} />
      <g transform={`translate(0 ${corpoY})`}>
        {/* tronco */}
        <path d="M 128 330 Q 200 300 272 330 L 286 490 Q 200 506 114 490 Z" fill={C.roupa} stroke={t} strokeWidth={7} strokeLinejoin="round" />
        <path d="M 176 318 L 200 352 L 224 318" fill="none" stroke={ana ? C.acento : '#fff'} strokeWidth={8} strokeLinecap="round" />
        {!ana ? <path d="M 200 352 L 192 410 L 200 424 L 208 410 Z" fill={C.cabelo === '#6B4A2E' ? '#C0392B' : C.acento} stroke={t} strokeWidth={4} /> : null}
        <g transform={`rotate(${cab} 200 300)`}>
          {/* pescoço e cabeça */}
          <rect x={184} y={268} width={32} height={46} fill={C.pele} stroke={t} strokeWidth={6} />
          {ana ? <circle cx={200} cy={92} r={46} fill={C.cabelo} stroke={t} strokeWidth={7} /> : null}
          <ellipse cx={200} cy={190} rx={100} ry={104} fill={C.pele} stroke={t} strokeWidth={8} />
          {ana
            ? <path d="M 100 196 Q 96 92 200 86 Q 304 92 300 196 Q 286 130 200 128 Q 128 130 112 200 Z" fill={C.cabelo} stroke={t} strokeWidth={7} strokeLinejoin="round" />
            : <path d="M 104 170 Q 120 80 210 84 Q 298 92 298 172 Q 270 120 200 124 Q 140 128 104 170 Z" fill={C.cabelo} stroke={t} strokeWidth={7} strokeLinejoin="round" />}
          {!ana ? <path d="M 118 222 Q 130 300 200 304 Q 270 300 282 222 Q 262 262 200 262 Q 138 262 118 222 Z" fill={C.cabelo} stroke={t} strokeWidth={6} /> : null}
          <circle cx={98} cy={200} r={16} fill={C.pele} stroke={t} strokeWidth={6} /><circle cx={302} cy={200} r={16} fill={C.pele} stroke={t} strokeWidth={6} />
          <Olhos cx={200} cy={190} sep={40} r={21} frame={frame} semente={s} olhar={olhar} expressao={expressao} tinta={t} />
          {ana ? <g fill="none" stroke={t} strokeWidth={6}><circle cx={160} cy={192} r={30} /><circle cx={240} cy={192} r={30} /><path d="M 190 190 Q 200 182 210 190" /></g> : null}
          <path d="M 200 206 Q 190 226 202 230" stroke={t} strokeWidth={5} fill="none" strokeLinecap="round" />
          <Boca cx={200} cy={250} w={56} abre={boca} expressao={expressao} tinta={t} />
          <circle cx={140} cy={234} r={12} fill="#E8826A" opacity={0.35} /><circle cx={260} cy={234} r={12} fill="#E8826A" opacity={0.35} />
        </g>
      </g>
      <Braco ombro={ombroD} mao={bD.mao} luva={bD.luva} grossura={24} cor={C.roupa} corLuva={C.luva} tinta={t} lado={1} />
    </g>
  );
};

/** Entrada com antecipação (agacha) e pulo; saída para o lado. Devolve transform em px. */
export function entradaPersonagem(frame: number, inicio: number, fps: number) {
  const t = frame - inicio;
  const y = interpolate(t, [0, 5, 14, 20], [260, 290, -30, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sy = interpolate(t, [0, 5, 14, 20, 26], [1, 0.82, 1.12, 0.94, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const op = interpolate(t, [0, 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return {y, sy, op, fps};
}

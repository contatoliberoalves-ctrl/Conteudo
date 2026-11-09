// "Mapa em blocos": o Brasil em blocos 3D (grade dos 27 estados), cada capítulo repinta o mapa
// a partir de um ponto, com placar de data, legenda, caixa de texto e barra de capítulos.
// Desenhado num <canvas> a cada quadro (projeção oblíqua de cima, norte para cima).
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {AbsoluteFill, Easing, continueRender, delayRender, interpolate, random, staticFile, useCurrentFrame} from 'remotion';

type Ponto = [number, number];
export type Capitulo = {
  inicio: number; duracao: number; data: string; titulo: string; linha: string;
  palavras: {w: string; s: number; e: number}[];       // tempos (quadros, relativos ao capítulo)
  cor: string; coresUf?: Record<string, string>; origem: Ponto; capital?: Ponto | null; capitalNome?: string;
  rotulos: {texto: string; x: number; y: number; destaque?: boolean}[];
  legenda: [string, string][]; camera: {x: number; y: number; zoom: number}; fumaca?: boolean;
};
export type BlocosProps = {
  largura: number; altura: number; fps: number; total: number;
  grade: {cols: number; rows: number; grid: number[][]; ufs: {sigla: string}[]};
  capitulos: Capitulo[]; serie: string;
};

const MAR = '#2E5E9E', MAR2 = '#3A6FB3', CINZA = '#7FA36A';

function hex(c: string): [number, number, number] {
  const h = c.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i] - v) * t);
const css = (c: number[], k = 1) => `rgb(${Math.round(c[0] * k)},${Math.round(c[1] * k)},${Math.round(c[2] * k)})`;

function altura(x: number, y: number) {
  // relevo suave + serras do Sudeste
  const n = random(`h${x},${y}`) * 0.6 + Math.sin(x / 7) * 0.4 + Math.cos(y / 9) * 0.4;
  const serra = Math.exp(-(((x - 78) / 10) ** 2 + ((y - 75) / 9) ** 2)) * 2.2;
  return 1.2 + Math.max(0, n) + serra;
}

function camera(p: BlocosProps, f: number) {
  const caps = p.capitulos;
  let i = caps.findIndex((c) => f >= c.inicio && f < c.inicio + c.duracao);
  if (i < 0) i = f < 0 ? 0 : caps.length - 1;
  const c = caps[i], ant = caps[Math.max(0, i - 1)];
  const t = interpolate(f - c.inicio, [0, 36], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const deriva = (f - c.inicio) / Math.max(c.duracao, 1);
  return {
    x: ant.camera.x + (c.camera.x - ant.camera.x) * t + deriva * 1.2,
    y: ant.camera.y + (c.camera.y - ant.camera.y) * t,
    zoom: (ant.camera.zoom + (c.camera.zoom - ant.camera.zoom) * t) * (1 + deriva * 0.04),
    i,
  };
}

export const Blocos: React.FC<BlocosProps> = (p) => {
  const f = useCurrentFrame();
  const ref = useRef<HTMLCanvasElement>(null);
  const W = p.largura, H = p.altura, u = Math.min(W, H) / 1080;
  const [h] = useState(() => delayRender('fontes'));
  useEffect(() => {
    const fs = [new FontFace('Pixel', `url(${staticFile('fonts/Silkscreen-Bold.ttf')})`), new FontFace('Terminal', `url(${staticFile('fonts/VT323-Regular.ttf')})`)];
    Promise.all(fs.map((x) => x.load())).then((ok) => { ok.forEach((x) => document.fonts.add(x)); continueRender(h); });
  }, [h]);

  const cam = camera(p, f);
  const s = (Math.min(W, H * 1.15) / (p.grade.rows * 0.92)) * cam.zoom;
  const proj = (gx: number, gy: number, hh = 0): Ponto => [(gx - cam.x) * s + W / 2, (gy - cam.y) * s * 0.78 + H / 2 - hh * s * 0.55];

  useLayoutEffect(() => {
    const cv = ref.current!;
    const g = cv.getContext('2d')!;
    const {cols, rows, grid, ufs} = p.grade;
    const caps = p.capitulos;
    const c = caps[cam.i], ant = caps[Math.max(0, cam.i - 1)];
    const tCap = f - c.inicio;
    g.fillStyle = MAR;
    g.fillRect(0, 0, W, H);
    // mar em blocos (só o que aparece)
    const x0 = Math.floor(cam.x - W / 2 / s) - 1, x1 = Math.ceil(cam.x + W / 2 / s) + 1;
    const y0 = Math.floor(cam.y - H / 2 / (s * 0.78)) - 2, y1 = Math.ceil(cam.y + H / 2 / (s * 0.78)) + 3;
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const dentro = y >= 0 && y < rows && x >= 0 && x < cols && grid[y][x] > 0;
        if (dentro) continue;
        const onda = Math.sin(x * 0.7 + y * 0.4 + f / 18) * 0.5 + 0.5;
        const [sx, sy] = proj(x, y, 0);
        g.fillStyle = css(mix(hex(MAR), hex(MAR2), onda * 0.6 + random(`m${x},${y}`) * 0.4));
        g.fillRect(sx, sy, s + 0.6, s * 0.78 + 0.6);
      }
    }
    // terra: de trás para frente
    const [ox, oy] = c.origem;
    const raio = Math.hypot(cols, rows);
    for (let y = Math.max(0, y0); y < Math.min(rows, y1 + 1); y++) {
      for (let x = Math.max(0, x0); x < Math.min(cols, x1 + 1); x++) {
        const id = grid[y][x];
        if (!id) continue;
        const sig = ufs[id - 1].sigla;
        const corNova = hex(c.coresUf?.[sig] || c.cor);
        const corVelha = cam.i === 0 ? hex(CINZA) : hex(ant.coresUf?.[sig] || ant.cor);
        const dist = Math.hypot(x - ox, y - oy) / raio;
        const t = Math.min(1, Math.max(0, (tCap - 6 - dist * 40) / 8));   // a cor se espalha a partir da origem
        const base = mix(corVelha, corNova, t);
        const j = 0.9 + random(`c${x},${y}`) * 0.18;
        const hh = altura(x, y) + (t > 0 && t < 1 ? Math.sin(t * Math.PI) * 0.8 : 0);
        const [sx, sy] = proj(x, y, hh);
        // frente (só se o vizinho de baixo é mais baixo)
        const yb = y + 1 < rows ? grid[y + 1][x] : 0;
        const hb = yb ? altura(x, y + 1) : 0;
        if (hh > hb) {
          g.fillStyle = css(base, 0.62 * j);
          g.fillRect(sx, sy + s * 0.78, s + 0.6, (hh - hb) * s * 0.55 + 0.6);
        }
        g.fillStyle = css(base, j);
        g.fillRect(sx, sy, s + 0.6, s * 0.78 + 0.6);
        // contorno de estado: borda escura quando o vizinho é outra UF
        if ((x + 1 < cols && grid[y][x + 1] && grid[y][x + 1] !== id) || (y + 1 < rows && grid[y + 1][x] && grid[y + 1][x] !== id)) {
          g.fillStyle = 'rgba(0,0,0,.16)';
          g.fillRect(sx, sy, s + 0.6, s * 0.78 + 0.6);
        }
      }
    }
    // capital: torre dourada com bandeira
    if (c.capital) {
      const [cx, cy] = c.capital;
      const sobe = interpolate(tCap, [10, 26], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.6))});
      const base = altura(Math.round(cx), Math.round(cy));
      for (let k = 0; k < 4; k++) {
        const [sx, sy] = proj(cx, cy, base + (k + 1) * 1.1 * sobe);
        g.fillStyle = k === 3 ? '#FFE27A' : '#E0B640';
        g.fillRect(sx, sy, s * 1.6, s * 0.78 * 1.6);
        g.fillStyle = '#9C7A1E';
        g.fillRect(sx, sy + s * 0.78 * 1.6, s * 1.6, s * 0.55 * 1.1 * sobe);
      }
      const [fx, fy] = proj(cx + 0.8, cy, base + 5.6 * sobe);
      g.fillStyle = '#3A2A12'; g.fillRect(fx, fy, s * 0.2, s * 3 * sobe);
      g.fillStyle = '#2F9E4F'; g.fillRect(fx + s * 0.2, fy, s * 1.6 * sobe, s * 1.0 * sobe);
      g.fillStyle = '#F2D33C'; g.fillRect(fx + s * 0.6, fy + s * 0.25, s * 0.7 * sobe, s * 0.5 * sobe);
    }
    // fumaça (golpes, crises)
    if (c.fumaca) {
      for (let k = 0; k < 14; k++) {
        const vida = ((tCap + k * 9) % 60) / 60;
        const px = ox + (random(`fx${k}`) - 0.5) * 30, py = oy + (random(`fy${k}`) - 0.5) * 24;
        const [sx, sy] = proj(px, py, 3 + vida * 8);
        const r = s * (0.8 + vida * 2.2);
        g.fillStyle = `rgba(70,70,70,${0.55 * (1 - vida)})`;
        g.fillRect(sx - r / 2, sy - r / 2, r, r);
        if (vida < 0.15) { g.fillStyle = 'rgba(255,170,40,.9)'; g.fillRect(sx - r / 4, sy - r / 4, r / 2, r / 2); }
      }
    }
    // vinheta
    const vg = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.max(W, H) * 0.75);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.45)');
    g.fillStyle = vg; g.fillRect(0, 0, W, H);
  });

  const c = p.capitulos[cam.i];
  const tCap = f - c.inicio;
  const ant = p.capitulos[cam.i - 1];
  // texto que vai sendo escrito no tempo da fala
  const escrito = c.palavras.filter((w) => w.s <= tCap).map((w) => w.w).join(' ');
  const flip = interpolate(tCap, [0, 8], [90, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2))});
  const restante = Math.max(0, Math.ceil((p.total - f) / p.fps));
  const caixa = {background: 'rgba(14,8,32,.86)', border: `${3 * u}px solid #3B2A6B`, borderRadius: 6 * u};
  return (
    <AbsoluteFill>
      <canvas ref={ref} width={W} height={H} style={{position: 'absolute', inset: 0}} />
      {/* rótulos */}
      {c.rotulos.map((r, k) => {
        const [x, y] = proj(r.x, r.y, 4);
        const ap = interpolate(tCap, [14 + k * 4, 22 + k * 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return (
          <div key={k} style={{position: 'absolute', left: Math.min(Math.max(x, W * 0.14), W * 0.86), top: y, transform: `translate(-50%,-100%) scale(${0.6 + 0.4 * ap})`, opacity: ap,
            ...caixa, background: r.destaque ? 'rgba(60,40,0,.85)' : caixa.background, borderColor: r.destaque ? '#E0B640' : '#3B2A6B',
            padding: `${4 * u}px ${12 * u}px`, fontFamily: 'Pixel', fontSize: 32 * u, color: r.destaque ? '#FFE27A' : '#fff', whiteSpace: 'nowrap'}}>{r.texto}</div>
        );
      })}
      {/* placar da data + legenda */}
      <div style={{position: 'absolute', left: 40 * u, top: 50 * u, ...caixa, padding: `${14 * u}px ${24 * u}px`}}>
        <div style={{fontFamily: 'Pixel', fontSize: 92 * u, color: '#F7E86A', lineHeight: 1, transform: `perspective(600px) rotateX(${flip}deg)`}}>{c.data}</div>
        <div style={{marginTop: 10 * u, display: 'flex', flexDirection: 'column', gap: 4 * u}}>
          {c.legenda.map(([cor, t], k) => (
            <div key={k} style={{display: 'flex', alignItems: 'center', gap: 10 * u, fontFamily: 'Terminal', fontSize: 38 * u, color: '#E8E8F0'}}>
              <span style={{width: 18 * u, height: 18 * u, background: cor, display: 'inline-block'}} />{t}
            </div>
          ))}
        </div>
      </div>
      {/* caixa de texto */}
      <div style={{position: 'absolute', left: 30 * u, right: 30 * u, bottom: 120 * u, fontFamily: 'Terminal', fontSize: 54 * u, lineHeight: 1.1, textShadow: '0 2px 0 #000'}}>
        {ant ? <div style={{color: 'rgba(230,230,240,.45)'}}><span style={{color: 'rgba(247,232,106,.5)'}}>[{ant.data}]</span> {ant.linha}</div> : null}
        <div style={{color: '#fff', ...caixa, background: 'rgba(14,8,32,.6)', padding: `${8 * u}px ${12 * u}px`, marginTop: 6 * u}}>
          <span style={{color: '#F7E86A'}}>[{c.data}]</span> {escrito}<span style={{opacity: f % 16 < 8 ? 1 : 0}}>▌</span>
        </div>
      </div>
      {/* barra de capítulos */}
      <div style={{position: 'absolute', left: 30 * u, right: 30 * u, bottom: 40 * u}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'Terminal', fontSize: 32 * u, color: '#D8D8E4', marginBottom: 8 * u}}>
          <span>Capítulo {cam.i + 1} de {p.capitulos.length} · {c.titulo}</span><span>{p.serie} · {Math.floor(restante / 60)}:{String(restante % 60).padStart(2, '0')} restantes</span>
        </div>
        <div style={{height: 8 * u, background: 'rgba(255,255,255,.18)', position: 'relative'}}>
          <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(f / p.total) * 100}%`, background: '#E04848'}} />
          {p.capitulos.map((k, i) => <div key={i} style={{position: 'absolute', left: `${(k.inicio / p.total) * 100}%`, top: -4 * u, width: 3 * u, height: 16 * u, background: '#fff'}} />)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

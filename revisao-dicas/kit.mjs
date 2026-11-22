// Kit de peças do produto para a plataforma de venda (Kiwify) e a área de membros, no tema do concurso:
// capa (imagem do produto), selo (quadrado para avatar/miniatura), banner (checkout e topo da área de membros,
// em qualquer tamanho), modulo (capa vertical de módulo) e mockup (os dois PDFs em PNG com fundo transparente).
// Os tamanhos ficam em produtos.json > kit; troque `w` e `h` se a plataforma pedir outra medida.
import { FONTES, T, I, M, TEMAS, esc, simbolo, marca, tex, carimbo } from './tema.mjs';

export function renderPeca(pc, prod, img) {
  const c = TEMAS[prod.tema], { w, h } = pc, u = Math.min(w, h) / 100;
  const rico = s => esc(s).replace(/\[\[(.+?)\]\]/g, `<span style="color:${c.claro}">$1</span>`);
  const fundo = (lado = 12 * u) => `<div style="position:absolute;inset:0;background:${c.escuro}"></div><div style="position:absolute;inset:0;background-image:${tex(c, c.claro, .17, lado)}"></div><div style="position:absolute;inset:0;background:radial-gradient(90% 60% at 0% 100%,${c.escuro3},transparent 70%),radial-gradient(70% 50% at 100% 0%,${c.brilho},transparent 70%)"></div><div style="position:absolute;left:0;top:0;bottom:0;width:${1.6 * u}px;background:${c.cor}"></div>`;
  const selo = px => `<span style="display:inline-block;${M};font-size:${px}px;letter-spacing:.1em;text-transform:uppercase;background:${c.cor};color:${c.sobreCor};padding:${px * .45}px ${px * .8}px;border-radius:${px * .4}px;white-space:nowrap">${esc(prod.seloKit || prod.concurso)}</span>`;
  const capas = (larg, extra = '') => { const cs = (prod.kitCapas || ['capa2', 'capa1']).map(k => img[k]), tres = cs.length === 3;
    const pos = tres ? [['right:0;top:0', 8], ['left:19%;top:5%', 0], ['left:0;top:11%', -7]] : [['right:0;top:2%', 7], ['left:2%;top:9%', -5]];
    return `<div style="position:relative;width:${larg}px;height:${larg * 1.12}px;${extra}">${cs.map((s, i) => `<img src="${s}" style="position:absolute;${pos[i][0]};width:${tres ? 56 : 62}%;transform:rotate(${pos[i][1]}deg);border-radius:${larg * .012}px;box-shadow:0 ${larg * .06}px ${larg * .1}px -${larg * .04}px rgba(0,0,0,.6)">`).join('')}</div>`; };
  const P = {
    capa: () => `${fundo(14 * u)}<div style="position:absolute;right:${-4 * u}px;top:${4 * u}px;${T};font-size:${62 * u}px;line-height:.8;color:transparent;-webkit-text-stroke:${.5 * u}px ${c.vazado}">${prod.total}</div>
      <div style="position:absolute;left:${9 * u}px;top:${8 * u}px">${simbolo(13 * u, 'gk' + pc.id)}</div>
      <div style="position:absolute;left:${9 * u}px;right:${6 * u}px;bottom:${9 * u}px">${selo(4.2 * u)}<div style="${T};font-size:${25 * u}px;line-height:.88;color:#fff;margin-top:${3.5 * u}px">${esc((prod.tituloKit || ['Revisão', 'em dicas'])[0])}<br><span style="color:${c.claro}">${esc((prod.tituloKit || ['Revisão', 'em dicas'])[1])}</span></div></div>`,
    selo: () => `${fundo(13 * u)}<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center"><div style="${T};font-size:${44 * u}px;line-height:.8;color:transparent;-webkit-text-stroke:${.35 * u}px ${c.claro}">${prod.total}</div><div style="${T};font-size:${13 * u}px;line-height:.9;color:#fff;margin-top:${2 * u}px">dicas · <span style="color:${c.claro}">${esc(prod.sigla || prod.concurso)}</span></div><div style="margin-top:${5 * u}px">${simbolo(9 * u, 'gk' + pc.id)}</div></div>`,
    banner: () => { const ts = pc.alto ? 15 * u : pc.compacto ? 13 * u : 17 * u; return `${fundo(pc.alto ? 12 * u : 20 * u)}
      <div style="position:absolute;left:${(pc.compacto ? 7 : 9) * u}px;top:0;bottom:0;width:${pc.compacto ? 62 : 56}%;display:flex;flex-direction:column;justify-content:center">
        <div style="margin-bottom:${4.5 * u}px">${marca(pc.alto ? 7 * u : 9.5 * u, '#fff', c.claro, 'gk' + pc.id)}</div>
        <div style="${T};font-size:${ts}px;line-height:.9;color:#fff">${pc.titulo.map(rico).join('<br>')}</div>
        ${pc.texto ? `<div style="${I};font-size:${(pc.alto ? 3.4 : 4.6) * u}px;line-height:1.4;color:rgba(255,255,255,.86);margin-top:${3.5 * u}px;max-width:${pc.alto ? 60 : 120}em">${esc(pc.texto)}</div>` : ''}</div>
      <div style="position:absolute;right:${(pc.compacto ? -2 : 5) * u}px;top:50%;transform:translateY(-52%)">${capas((pc.alto ? 62 : pc.compacto ? 70 : 84) * u)}</div>
      ${pc.compacto || pc.alto ? '' : `<div style="position:absolute;right:${92 * u}px;top:${10 * u}px">${carimbo({ px: 30 * u, cor: c.carimbo, ...(prod.carimbo || { topo: 'PROVA OBJETIVA', base: prod.banca.toUpperCase(), centro: prod.prova, sub: 'DOMINGO' }), id: 'ck' + pc.id })}</div>`}`; },
    modulo: () => `${fundo(15 * u)}<div style="position:absolute;right:${4 * u}px;top:${4 * u}px;${T};font-size:${58 * u}px;line-height:.8;color:transparent;-webkit-text-stroke:${.45 * u}px ${c.vazado}">${esc(pc.n)}</div>
      <div style="position:absolute;left:${9 * u}px;top:${9 * u}px">${simbolo(11 * u, 'gk' + pc.id)}</div>
      <div style="position:absolute;left:${9 * u}px;right:${7 * u}px;bottom:${10 * u}px"><span style="${M};font-size:${3.6 * u}px;letter-spacing:.12em;text-transform:uppercase;background:${c.cor};color:${c.sobreCor};padding:${1.5 * u}px ${2.8 * u}px;border-radius:${1.4 * u}px">${esc(pc.titulo[0])}</span>
        <div style="${T};font-size:${19 * u}px;line-height:.88;color:#fff;margin-top:${4 * u}px">${esc(pc.titulo[1])}<br><span style="color:${c.claro}">${esc(pc.titulo[2])}</span></div>
        <div style="${I};font-size:${4.2 * u}px;line-height:1.35;color:rgba(255,255,255,.84);margin-top:${3.5 * u}px">${esc(pc.sub)}</div>
        <div style="${M};font-size:${3 * u}px;letter-spacing:.16em;color:${c.claro};margin-top:${5 * u}px">${esc(prod.concurso).toUpperCase()} · ${esc(prod.linhaKit || 'REVISÃO EM DICAS')}</div></div>`,
    mockup: () => `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${capas(w * .86)}</div>`,
  };
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet"><style>*{box-sizing:border-box}html,body{margin:0;background:transparent}</style></head><body><div id="arte" style="position:relative;width:${w}px;height:${h}px;overflow:hidden">${P[pc.tipo]()}</div><script>document.fonts.ready.then(()=>{window.__pronto=true})</script></body></html>`;
  return { html, transparente: pc.tipo === 'mockup' };
}

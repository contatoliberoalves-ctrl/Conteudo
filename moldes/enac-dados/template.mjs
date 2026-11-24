// Telas estáticas do ENAC em dados: capas dos vídeos (1080×1920, tudo dentro do miolo 4:5 que aparece na grade),
// posts de pergunta (1080×1350) e as pranchas da identidade.
import { C, cssBase, aplicarTema, FONTES, PERFIL, esc, tit, cor, fundo, etiqueta, logo, grade } from './identidade.mjs';

const pagina = (w, h, miolo) => ({ w, h, html: `<!doctype html><html><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet"><style>${cssBase()}</style></head><body><div class="tela" style="width:${w}px;height:${h}px">${fundo()}${miolo}</div></body></html>` });
const topo = (y, dir) => `<div style="position:absolute;left:80px;right:80px;top:${y}px;display:flex;justify-content:space-between;align-items:flex-end">${logo(64)}<span class="mono" style="font-size:22px;color:${C.cinza}">${esc(dir)}</span></div>
  <div style="position:absolute;left:80px;right:80px;top:${y + 92}px;height:4px;background:${C.linha}"><div style="width:22%;height:100%;background:${C.lima}"></div></div>`;
const pe = (y, fonte) => `<div class="mono" style="position:absolute;left:80px;right:80px;top:${y}px;display:flex;justify-content:space-between;font-size:21px;color:${C.cinza}"><span>${PERFIL}</span><span>${esc(fonte || 'Fonte: gabaritos extraoficiais')}</span></div>`;
const chamada = (t, sub) => `<div style="background:${C.lima};color:${C.tinta};padding:30px 36px;display:flex;align-items:center;gap:28px">
  <svg width="54" height="54" viewBox="0 0 54 54" style="flex:none"><path d="M4 4h46v34H22L10 50V38H4z" fill="${C.tinta}"/></svg>
  <div><div class="tit" style="font-size:46px;letter-spacing:-.03em;line-height:1.05">${esc(t)}</div>${sub ? `<div style="font:500 28px/1.25 'Space Grotesk';margin-top:8px">${esc(sub)}</div>` : ''}</div></div>`;

const VISUAL = {
  // régua de 0 a 100 com a linha de corte
  regua(v) {
    return `<div style="position:relative;height:250px">
      <div style="position:absolute;left:0;right:0;top:92px;height:70px;background:${C.grafite};border:2px solid ${C.linha}"></div>
      <div style="position:absolute;left:${v.corte}%;right:0;top:92px;height:70px;background:${C.lima}"></div>
      ${Array.from({ length: 11 }, (_, i) => `<div style="position:absolute;left:${i * 10}%;top:162px;width:2px;height:16px;background:${C.cinza}"></div><div class="mono" style="position:absolute;left:${i * 10}%;top:188px;transform:translateX(-50%);font-size:22px;color:${C.cinza}">${i * 10}</div>`).join('')}
      <div style="position:absolute;left:${v.corte}%;top:0;width:4px;height:162px;background:${C.osso}"></div>
      <div class="tit" style="position:absolute;left:calc(${v.corte}% + 20px);top:-2px;font-size:76px">${v.corte}</div>
      <div class="mono" style="position:absolute;right:calc(${100 - v.corte}% + 20px);top:6px;font-size:22px;line-height:1.5;text-align:right;color:${C.lima}">${v.rotulo.map(esc).join('<br>')}</div></div>`;
  },
  // opções de enquete com barra proporcional
  opcoes(v) {
    const max = Math.max(...v.itens.map(i => i.v));
    return `<div style="display:flex;flex-direction:column;gap:18px">${v.itens.map((it, i) => `<div style="display:flex;align-items:center;gap:24px">
      <span class="tit" style="width:84px;height:84px;display:grid;place-items:center;font-size:52px;flex:none;${i ? `border:3px solid ${C.osso}` : `background:${C.lima};color:${C.tinta}`}">${esc(it.letra)}</span>
      <div style="flex:1"><div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font:700 38px/1.1 'Space Grotesk';letter-spacing:-.02em">${esc(it.nome)}</span><span class="mono" style="font-size:22px;color:${C.cinza}">${it.v} ${it.v > 1 ? 'questões' : 'questão'}</span></div>
        <div style="height:16px;background:${C.grafite};margin-top:12px"><div style="height:100%;width:${it.v / max * 100}%;background:${i ? C.osso : C.lima}"></div></div></div></div>`).join('')}</div>`;
  },
  // número de alerta + lista curta
  alerta(v) {
    return `<div style="display:flex;gap:44px;align-items:flex-start">
      <div style="flex:none"><div class="tit" style="font-size:300px;line-height:.8;color:${C.coral}">${esc(v.numero)}</div><div class="mono" style="font-size:21px;color:${C.cinza};margin-top:22px;max-width:330px;line-height:1.4">${esc(v.legenda)}</div></div>
      <div style="flex:1"><div class="mono" style="font-size:21px;color:${C.coral};margin-bottom:14px">${esc(v.titulo)}</div>
        ${v.itens.map(t => `<div style="border-left:6px solid ${C.coral};background:${C.grafite};padding:16px 20px;margin-bottom:12px;font:600 29px/1.15 'Space Grotesk'">${esc(t)}</div>`).join('')}</div></div>`;
  },
};

// três números lado a lado
VISUAL.numeros = (v) => `<div style="display:grid;grid-template-columns:repeat(${v.itens.length},1fr);gap:16px">${v.itens.map((it, i) => `<div style="background:${C.grafite};border:2px solid ${C.linha};border-top:8px solid ${i ? C.osso : C.lima};padding:26px 22px">
  <div class="tit" style="font-size:92px;line-height:.9;color:${i ? C.osso : C.lima}">${esc(it.n)}</div><div class="mono" style="font-size:20px;line-height:1.4;color:${C.cinza};margin-top:16px">${esc(it.t)}</div></div>`).join('')}</div>`;

// post direto: uma frase gigante, no máximo um número e uma linha de chamada. Sem etiqueta, sem subtítulo, sem caixa.
// fundo: tinta, lima ou osso (alternar no feed). [[trecho]] vira o destaque do fundo escolhido.
const DIRETO = {
  tinta: { bg: C.tinta, fg: C.osso, apoio: C.cinza, hl: `color:${C.lima}`, barra: C.lima, cta: C.lima },
  lima: { bg: C.lima, fg: C.tinta, apoio: '#33410a', hl: `background:${C.tinta};color:${C.lima};padding:0 .12em;display:inline-block;line-height:1.08;margin-top:.14em`, barra: C.tinta, cta: C.tinta },
  osso: { bg: C.osso, fg: C.tinta, apoio: '#6a6f78', hl: `background:${C.lima};padding:0 .12em;display:inline-block;line-height:1.08;margin-top:.14em`, barra: C.tinta, cta: C.tinta },
  coral: { bg: C.tinta, fg: C.osso, apoio: C.cinza, hl: `color:${C.coral}`, barra: C.coral, cta: C.coral },
};
function direto(t) {
  const k = DIRETO[t.fundo || 'tinta'], b = h => `<i style="width:11px;height:${h}px;background:${k.barra}"></i>`;
  const m = s => esc(s).replace(/\[\[(.+?)\]\]/g, `<span style="${k.hl};box-decoration-break:clone;-webkit-box-decoration-break:clone">$1</span>`);
  const html = `<!doctype html><html><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet"><style>${cssBase()}</style></head><body>
    <div class="tela" style="width:1080px;height:1350px;background:${k.bg};color:${k.fg}">
      <div class="mono" style="position:absolute;left:84px;top:84px;font-size:30px;letter-spacing:.1em;border:3px solid ${k.fg};padding:10px 18px">${esc(t.selo || 'ENAC 2026.2')}</div>
      <div style="position:absolute;left:84px;right:84px;top:170px;bottom:250px;display:flex;flex-direction:column;justify-content:center">
        ${t.numero ? `<div class="tit" style="font-size:${t.tn || 330}px;line-height:.8;margin-bottom:36px">${m(t.numero)}</div>` : ''}
        <div class="tit" style="font-size:${t.ts || 132}px;line-height:1.14">${t.titulo.map(m).join('<br>')}</div>
        ${t.linhas ? `<div style="margin-top:44px;font:600 ${t.tl || 50}px/1.28 'Space Grotesk';letter-spacing:-.02em">${t.linhas.map(m).join('<br>')}</div>` : ''}
      </div>
      <div style="position:absolute;left:84px;right:84px;bottom:92px;display:flex;justify-content:space-between;align-items:flex-end">
        <div class="tit" style="font-size:${t.tc || 58}px;letter-spacing:-.03em;color:${k.cta}">${m(t.cta || '')}</div>
        <div style="display:flex;align-items:flex-end;gap:12px"><div style="display:flex;align-items:flex-end;gap:5px">${b(17)}${b(28)}${b(40)}</div><span class="mono" style="font-size:20px;color:${k.apoio}">${PERFIL}</span></div></div>
    </div></body></html>`;
  return { w: 1080, h: 1350, html };
}

const LAYOUTS = {
  direto,
  // meme de dados: frase, lista do que o personagem fez (com a questão) e o número no fim
  meme(t) {
    return pagina(1080, 1350, `${topo(70, t.dir || 'ENAC 2026.2')}
      <div style="position:absolute;left:80px;right:80px;top:216px">
        <div class="tit" style="font-size:${t.ts || 66}px;line-height:1.02">${tit(t.titulo)}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 14px;margin-top:34px">${t.itens.map(([q, x]) => `<div style="display:flex;align-items:center;gap:14px;background:${C.grafite};border:2px solid ${C.linha};padding:12px 14px">
          <span class="mono" style="flex:none;font-size:17px;letter-spacing:.02em;background:${C.lima};color:${C.tinta};padding:6px 8px">${esc(q)}</span><span style="font:600 26px/1.12 'Space Grotesk';letter-spacing:-.01em">${esc(x)}</span></div>`).join('')}</div></div>
      <div style="position:absolute;left:80px;right:80px;bottom:130px;display:flex;align-items:center;gap:30px;background:${C.lima};color:${C.tinta};padding:22px 34px">
        <span class="tit" style="font-size:130px;line-height:.85">${esc(t.numero)}</span><div><div class="tit" style="font-size:40px;line-height:1.05;letter-spacing:-.03em">${esc(t.legenda)}</div><div style="font:500 26px/1.25 'Space Grotesk';margin-top:8px">${esc(t.cta)}</div></div></div>
      ${pe(1262, t.fonte)}`);
  },
  capa(t) {
    return pagina(1080, 1920, `${topo(330, t.dir || 'ENAC 2026.2')}
      <div style="position:absolute;left:80px;right:80px;top:500px">
        ${etiqueta(t.rotulo, t.cor)}
${t.numero ? `<div style="display:flex;align-items:flex-end;gap:18px;margin-top:44px"><span class="tit" style="font-size:${t.tn || 470}px;line-height:.78;color:${cor(t.cor)}">${esc(t.numero)}</span>${t.de ? `<span class="mono" style="font-size:50px;color:${C.cinza};padding-bottom:22px">${esc(t.de)}</span>` : ''}</div>` : ''}
        <div class="tit" style="font-size:${t.ts || 104}px;margin-top:56px;line-height:${t.tema && t.tema !== 'noite' ? 1.16 : .98}">${tit(t.titulo)}</div>
        ${t.sub ? `<div class="txt" style="font-size:40px;color:${C.cinza};margin-top:28px">${tit(t.sub)}</div>` : ''}</div>
      ${t.grupos ? `<div style="position:absolute;right:80px;top:610px">${grade(t.grupos, 280)}</div>` : ''}
      <div style="position:absolute;left:80px;top:1480px;display:flex;align-items:center;gap:18px"><svg width="46" height="46" viewBox="0 0 46 46"><rect width="46" height="46" fill="${C.lima}"/><path d="M17 12l16 11-16 11z" fill="${C.tinta}"/></svg><span class="mono" style="font-size:24px">${esc(t.chamada || 'Assista até o fim')}</span></div>
      ${pe(1580, t.fonte)}`);
  },
  pergunta(t) {
    return pagina(1080, 1350, `${topo(70, t.dir || 'ENAC 2026.2')}
      <div style="position:absolute;left:80px;right:80px;top:226px">
        ${etiqueta(t.rotulo, t.cor)}
        <div class="tit" style="font-size:${t.ts || 104}px;margin-top:30px">${tit(t.titulo)}</div>
        ${t.sub ? `<div class="txt" style="font-size:36px;color:${C.cinza};margin-top:22px">${tit(t.sub)}</div>` : ''}</div>
      <div style="position:absolute;left:80px;right:80px;bottom:330px">${VISUAL[t.visual.tipo](t.visual)}</div>
      <div style="position:absolute;left:80px;right:80px;bottom:130px">${chamada(t.cta, t.ctaSub)}</div>
      ${pe(1262, t.fonte)}`);
  },
  // foto de perfil: símbolo e nome dentro do círculo que o Instagram recorta
  perfil(t) {
    const b = (h) => `<i style="width:112px;height:${h}px;background:${C.lima}"></i>`;
    return pagina(1080, 1080, `<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
      <div style="display:flex;align-items:flex-end;gap:38px;height:330px">${b(140)}${b(232)}${b(330)}</div>
      <div class="tit" style="font-size:${t.semNome ? 0 : 190}px;line-height:.9;margin-top:54px">ENAC</div>
      <div class="mono" style="font-size:${t.semNome ? 0 : 50}px;letter-spacing:.3em;color:${C.lima};margin-top:20px;padding-left:.3em">em dados</div></div>`);
  },
  marca() {
    const cores = [['Tinta', C.tinta, 'fundo'], ['Grafite', C.grafite, 'cartões'], ['Osso', C.osso, 'texto'], ['Lima', C.lima, 'o dado'], ['Coral', C.coral, 'alerta'], ['Azul', C.azul, '3ª série'], ['Cinza', C.cinza, 'apoio']];
    return pagina(1080, 1350, `<div style="position:absolute;left:80px;right:80px;top:80px">
      ${etiqueta('Identidade visual · 01 marca, cor e letra')}
      <div style="margin-top:60px">${logo(190)}</div>
      <div class="txt" style="font-size:38px;margin-top:50px;max-width:860px">A prova do ENAC contada em números. <span style="color:${C.lima}">Cada questão vira um ponto de dado.</span></div>
      <div class="mono" style="font-size:21px;color:${C.cinza};margin-top:56px">Paleta</div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:12px;margin-top:16px">${cores.map(([n, h, u]) => `<div><div style="height:120px;background:${h};border:2px solid ${C.linha}"></div><div style="font:700 24px 'Space Grotesk';margin-top:10px">${n}</div><div class="mono" style="font-size:15px;color:${C.cinza};letter-spacing:.04em;margin-top:4px">${h}</div><div class="mono" style="font-size:15px;color:${C.cinza};letter-spacing:.04em;margin-top:2px">${u}</div></div>`).join('')}</div>
      <div class="mono" style="font-size:21px;color:${C.cinza};margin-top:56px">Tipografia</div>
      <div style="display:flex;gap:40px;margin-top:16px;align-items:flex-end"><div style="flex:1"><div class="tit" style="font-size:118px">60/100</div><div class="mono" style="font-size:18px;color:${C.cinza};margin-top:10px">Space Grotesk Bold · títulos e números</div></div>
        <div style="flex:1"><div class="mono" style="font-size:34px;line-height:1.3">Fonte: gabarito<br>Tipo 3 · Q32</div><div class="mono" style="font-size:18px;color:${C.cinza};margin-top:10px">IBM Plex Mono · etiquetas e fontes</div></div></div></div>${pe(1262, 'Manual da identidade')}`);
  },
  elementos() {
    const regra = (t) => `<div style="display:flex;gap:16px;align-items:flex-start;font:500 25px/1.25 'Space Grotesk'"><i style="width:14px;height:14px;background:${C.lima};flex:none;margin-top:9px"></i><span>${t}</span></div>`;
    return pagina(1080, 1350, `<div style="position:absolute;left:80px;right:80px;top:80px">
      ${etiqueta('Identidade visual · 02 elementos')}
      <div style="display:flex;gap:50px;margin-top:44px">
        <div><div class="mono" style="font-size:19px;color:${C.cinza};margin-bottom:14px">A grade de 100 · um quadrado por questão</div>${grade([{ n: 60, cor: 'lima' }, { n: 14, cor: 'osso' }, { n: 8, cor: 'azul' }, { n: 18, cor: 'cinza' }], 400)}</div>
        <div style="flex:1"><div class="mono" style="font-size:19px;color:${C.cinza};margin-bottom:14px">Número gigante</div><div class="tit" style="font-size:210px;line-height:.8;color:${C.lima}">24</div>
          <div class="mono" style="font-size:19px;color:${C.cinza};margin:36px 0 14px">Etiqueta</div>${etiqueta('Fig. 02 · Recursos', 'coral')}
          <div class="mono" style="font-size:19px;color:${C.cinza};margin:30px 0 14px">Destaque e alerta</div><div class="tit" style="font-size:46px">${tit('[[dado]] e {{dúvida}}')}</div></div></div>
      <div class="mono" style="font-size:19px;color:${C.cinza};margin:34px 0 14px">Barras e cartões</div>
      ${[['Registro de Imóveis', 24, C.lima], ['Tabelionato de Notas', 12, C.osso]].map(([n, v, c]) => `<div style="display:flex;align-items:center;gap:20px;margin-bottom:12px"><span style="font:600 26px 'Space Grotesk';width:300px">${n}</span><div style="flex:1;height:34px;background:${C.grafite}"><div style="width:${v / 24 * 100}%;height:100%;background:${c}"></div></div><span class="tit" style="font-size:38px;width:50px;text-align:right">${v}</span></div>`).join('')}
      <div style="margin-top:18px">${chamada('Comenta a sua nota.', 'Toda peça termina numa pergunta para quem fez a prova.')}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 40px;margin-top:28px">
        ${regra('Cantos retos. Nada de pílula, sombra ou emoji.')}${regra('Lima é o dado. Coral, só para dúvida e recurso.')}${regra('Um número por tela, o maior que couber.')}${regra('A fonte do dado sempre no rodapé.')}</div></div>${pe(1262, 'Manual da identidade')}`);
  },
};
export const renderTela = t => { aplicarTema(t.tema); try { return LAYOUTS[t.layout](t); } finally { aplicarTema(); } };

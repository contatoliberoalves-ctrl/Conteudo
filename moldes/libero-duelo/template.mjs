// Molde "Libero Duelo" (@liberofilho), slides de AULA 1920×1080: comparação em tela dividida. Lado A
// em azul, lado B em navy, medalhão "VS" vermelho na divisa. Capa com os dois lutadores, um "round" por
// critério (faixa branca com o critério, a resposta de cada lado e os artigos), placar final em tabela,
// macete e fechamento. A versão de post (1080×1350) é o visual "duelo" do Carrossel Libero.
// Identidade do Carrossel Libero (libero-comum/identidade.mjs).
import { COR, TEMAS, TITULO, TEXTO, esc, lista, rico, linhas, rodape, anel, objeto, pagina } from '../libero-comum/identidade.mjs';

const W = 1920, H = 1080, M = W / 2;
const A = `linear-gradient(170deg,${COR.azul} 0%,${COR.azulFundo} 100%)`;
const B = `radial-gradient(120% 90% at 100% 0%,#1d3566 0%,${COR.navyFundo} 60%)`;
const dividido = `linear-gradient(90deg,${COR.azulFundo} 0 50%,${COR.navyFundo} 50% 100%)`;
const metades = `<div style="position:absolute;left:0;top:0;bottom:0;width:${M}px;background:${A}"></div><div style="position:absolute;right:0;top:0;bottom:0;width:${M}px;background:${B}"></div>`;
const vs = (y, d = 150) => `<div style="position:absolute;left:${M - d / 2}px;top:${y - d / 2}px;width:${d}px;height:${d}px;border-radius:50%;background:${COR.vermelho};border:8px solid #fff;display:flex;align-items:center;justify-content:center;${TITULO};font-size:${Math.round(d * .42)}px;color:#fff;z-index:10;box-shadow:0 12px 30px rgba(0,0,0,.35)">VS</div>`;
const linhaMeio = `<div style="position:absolute;left:${M - 3}px;top:0;bottom:0;width:6px;background:rgba(255,255,255,.9);z-index:2"></div>`;
const kick = (txt, cor = COR.off) => txt ? `<div style="${TEXTO};font-size:28px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${cor}">${esc(txt)}</div>` : '';
const perfil = (lado = 'left:120px') => `<div style="position:absolute;bottom:50px;${lado};${TEXTO};font-size:26px;font-weight:600;letter-spacing:.08em;color:#fff;z-index:15">@liberofilho</div>`;
const rod = t => rodape(t.txt).replace('left:96px', 'left:120px').replace('bottom:64px', 'bottom:50px');

const TIPOS = {
  // Capa: os dois lados como lutadores (sigla gigante + nome), medalhão VS e a chamada embaixo.
  capa(s, t, ctx) {
    const [a, b] = lista(s.lados);
    const lado = (l, x) => `<div style="position:absolute;left:${x}px;width:${M - 240}px;top:200px;height:560px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;gap:26px;z-index:4">
      <div data-fit="${esc(l.sigla)}" data-min="100" style="${TITULO};font-size:${l.ts || 340}px;line-height:.85;padding-top:.1em;color:#fff;width:100%;overflow:hidden">${esc(l.sigla)}</div>
      <div style="${TEXTO};font-size:40px;font-weight:600;line-height:1.2;color:#fff;max-width:600px">${rico(l.nome || '', '#fff', COR.azul)}</div></div>`;
    return `${metades}${linhaMeio}
      <div style="position:absolute;left:0;right:0;top:90px;display:flex;justify-content:center;z-index:5"><div style="background:#fff;color:${COR.azul};${TITULO};font-size:70px;line-height:1;padding:14px 38px 8px">${esc(s.kicker || 'Duelo')}</div></div>
      ${lado(a || {}, 120)}${lado(b || {}, M + 120)}${vs(480, 210)}
      ${anel(-200, 820, 420)}${objeto(ctx, s.objeto && { x: 1640, y: 40, tam: 220, rot: 16, ...s.objeto })}
      ${s.texto ? `<div style="position:absolute;left:300px;right:300px;bottom:110px;text-align:center;z-index:6"><div data-fit="texto" data-min="26" style="display:inline-block;background:${COR.navyFundo};color:#fff;${TEXTO};font-size:42px;font-weight:600;line-height:1.25;padding:22px 40px;max-height:200px;overflow:hidden">${rico(s.texto, COR.azul)}</div></div>` : ''}`;
  },
  // Round: faixa branca com o número e o critério; embaixo, a resposta de cada lado e os artigos.
  round(s, t, ctx, c) {
    const [a, b] = lista(s.lados);
    const [na, nb] = lista(c.nomes);
    const col = (l, x, nome) => `<div style="position:absolute;left:${x}px;width:${M - 240}px;top:360px;bottom:${s.pegadinha ? 240 : 120}px;display:flex;flex-direction:column;gap:20px;z-index:4">
      <div style="${TITULO};font-size:76px;line-height:.9;color:${COR.azulClaro}">${esc(nome || '')}</div>
      <div data-fit="${esc(nome)}" data-min="24" style="flex:1;overflow:hidden;${TEXTO};font-size:${s.corpo || 56}px;font-weight:500;line-height:1.26;color:#fff">${lista(l && l.texto).map(p => `<p style="margin-bottom:.5em">${rico(p, '#fff', COR.azul)}</p>`).join('')}
        ${l && l.artigo ? `<div style="display:flex;flex-wrap:wrap;gap:10px">${String(l.artigo).split(/;\s*/).map(a => `<span style="background:#fff;color:${COR.azul};font-size:.62em;font-weight:800;padding:8px 16px;border-radius:8px;white-space:nowrap">${esc(a)}</span>`).join('')}</div>` : ''}</div></div>`;
    return `${metades}${linhaMeio}
      <div style="position:absolute;left:0;right:0;top:70px;height:190px;background:#fff;z-index:6;display:flex;align-items:center;gap:40px;padding:0 120px">
        <div style="${TEXTO};font-size:28px;font-weight:800;letter-spacing:.2em;color:${COR.vermelho};white-space:nowrap">ROUND ${esc(s.numero ?? '')}</div>
        <div data-fit="${esc(lista(s.titulo).join(' '))}" data-min="60" style="${TITULO};font-size:${s.ts || 130}px;line-height:.9;padding-top:.1em;color:${COR.azul};overflow:hidden;max-height:170px">${linhas(s.titulo)}</div>
      </div>
      ${vs(330, 120)}
      ${col(a, 120, na)}${col(b, M + 120, nb)}
      ${s.pegadinha ? `<div style="position:absolute;left:120px;right:120px;bottom:100px;height:110px;background:${COR.vermelho};z-index:6;display:flex;align-items:center;padding:0 40px"><div data-fit="pegadinha" data-min="22" style="${TEXTO};font-size:36px;font-weight:600;line-height:1.2;color:#fff;max-height:100px;overflow:hidden"><b style="font-weight:800">Pegadinha:</b> ${rico(s.pegadinha)}</div></div>` : ''}
      ${objeto(ctx, s.objeto)}${perfil()}`;
  },
  // Placar: tabela-resumo critério × lado A × lado B, na largura toda.
  placar(s, t, ctx, c) {
    const [na, nb] = lista(c.nomes);
    return `<div style="position:absolute;left:120px;right:120px;top:90px;bottom:120px;display:flex;flex-direction:column;gap:26px">
      ${kick(s.kicker, t.kicker)}
      <div style="${TITULO};font-size:${s.ts || 110}px;line-height:.88;color:${t.tit}">${linhas(s.titulo, t.caixa)}</div>
      <div data-fit="placar" data-min="20" style="flex:1;overflow:hidden;font-size:${s.corpo || 42}px;${TEXTO}">
        <div style="display:grid;grid-template-columns:.6fr 1fr 1fr;border-radius:18px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,.15)">
          <div style="background:${COR.navyFundo}"></div>
          <div style="background:${COR.azul};color:#fff;${TITULO};font-size:1.8em;padding:.3em .6em .15em">${esc(na)}</div>
          <div style="background:${COR.navyFundo};color:#fff;${TITULO};font-size:1.8em;padding:.3em .6em .15em">${esc(nb)}</div>
          ${lista(s.linhas).map((l, k) => { const bg = k % 2 ? '#fff' : '#E7ECF8'; return `
            <div style="background:${bg};padding:.55em .7em;font-weight:800;color:${COR.azul};text-transform:uppercase;font-size:.8em;letter-spacing:.06em;display:flex;align-items:center">${esc(l.criterio)}</div>
            <div style="background:${bg};padding:.55em .7em;font-weight:500;line-height:1.22;color:${COR.navy};border-left:2px solid #D4DBEA">${rico(l.a)}</div>
            <div style="background:${bg};padding:.55em .7em;font-weight:500;line-height:1.22;color:${COR.navy};border-left:2px solid #D4DBEA">${rico(l.b)}</div>`; }).join('')}
        </div>
      </div>
    </div>${rod(t)}`;
  },
  // Macete: título à esquerda e as frases de bolso à direita (uma por lado).
  macete(s, t) {
    return `<div style="position:absolute;left:120px;top:150px;bottom:150px;width:680px;display:flex;flex-direction:column;justify-content:center;gap:26px">
        ${kick(s.kicker, t.kicker)}
        <div style="${TITULO};font-size:${s.ts || 160}px;line-height:.88;color:${t.tit}">${linhas(s.titulo, t.caixa)}</div>
      </div>
      <div style="position:absolute;left:900px;right:120px;top:150px;bottom:150px;display:flex;flex-direction:column;justify-content:center;gap:50px">
        ${lista(s.frases).map((f, k) => `<div style="display:flex;gap:30px;align-items:stretch">
          <div style="width:18px;flex:none;background:${k ? COR.vermelho : COR.azul}"></div>
          <div data-fit="frase" data-min="24" style="${TEXTO};font-size:${s.corpo || 48}px;font-weight:500;line-height:1.28;color:${t.txt};max-height:320px;overflow:hidden">${rico(f, t.caixa)}</div></div>`).join('')}
      </div>${rod(t)}`;
  },
  // Fechamento: foto do autor no medalhão "VS VOCÊ" à esquerda, pergunta e botão à direita.
  cta(s, t, ctx) {
    const f = s.foto ? ctx.foto(s.foto) : '';
    return `${metades}
      ${f ? `<div style="position:absolute;left:${M - 640}px;top:220px;width:560px;height:560px;border-radius:50%;border:14px solid #fff;background:url('${f}') center 22%/cover;z-index:8;box-shadow:0 20px 40px rgba(0,0,0,.35)"></div>
        <div style="position:absolute;left:${M - 230}px;top:680px;background:${COR.vermelho};color:#fff;${TITULO};font-size:64px;padding:8px 24px 2px;transform:rotate(-6deg);z-index:9">VS VOCÊ</div>` : ''}
      <div style="position:absolute;left:${f ? M + 120 : 120}px;right:120px;top:150px;bottom:150px;display:flex;flex-direction:column;justify-content:center;gap:34px;z-index:7">
        <div data-fit="${esc(lista(s.titulo).join(' '))}" data-min="60" style="flex:none;${TITULO};font-size:${s.ts || 130}px;line-height:.9;padding-top:.08em;color:#fff;max-height:380px;overflow:hidden">${linhas(s.titulo, '#fff', COR.azul)}</div>
        ${s.texto ? `<p style="font-size:42px;font-weight:500;line-height:1.3;color:#fff">${rico(s.texto)}</p>` : ''}
        ${s.botao ? `<div><span style="display:inline-block;background:#fff;color:${COR.azul};${TEXTO};font-size:36px;font-weight:800;padding:22px 46px;border-radius:999px">${esc(s.botao)}</span></div>` : ''}
      </div>${perfil()}`;
  },
};

export function renderCarrossel(c, ctx) {
  const avisos = [];
  const slides = (c.slides || []).map((s, i) => {
    const dividida = ['capa', 'round', 'cta'].includes(s.tipo);
    const t = TEMAS[s.tema] || TEMAS.light;
    const f = TIPOS[s.tipo];
    if (!f) avisos.push(`slide ${i + 1}: tipo "${s.tipo}" não existe (${Object.keys(TIPOS).join(', ')})`);
    return { bg: dividida ? dividido : t.bg, escuro: dividida || t.escuro, html: f ? f(s, t, ctx, c) : '' };
  });
  return { html: pagina(slides, W, H), total: slides.length, avisos, largura: W, altura: H };
}

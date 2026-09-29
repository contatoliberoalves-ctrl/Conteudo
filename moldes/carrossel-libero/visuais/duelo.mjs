// Visual "Duelo" do Carrossel Libero (posts 1080×1350 com "visual" no dados.json; a versão de aula, 1920×1080, é o molde libero-*): comparação em tela dividida. Lado A em azul, lado B em navy,
// medalhão "VS" vermelho na divisa. Capa com os dois lutadores, um "round" por critério (faixa branca com
// o critério, a resposta de cada lado e o artigo), placar final em tabela, macete e CTA.
// Identidade do Carrossel Libero (libero-comum/identidade.mjs).
import { COR, TEMAS, TITULO, TEXTO, esc, lista, rico, linhas, rodape, anel, objeto, pagina } from '../../libero-comum/identidade.mjs';

const A = `linear-gradient(170deg,${COR.azul} 0%,${COR.azulFundo} 100%)`;
const B = `radial-gradient(120% 90% at 100% 0%,#1d3566 0%,${COR.navyFundo} 60%)`;
const dividido = `linear-gradient(90deg,${COR.azulFundo} 0 50%,${COR.navyFundo} 50% 100%)`;
const metades = `<div style="position:absolute;left:0;top:0;bottom:0;width:540px;background:${A}"></div><div style="position:absolute;right:0;top:0;bottom:0;width:540px;background:${B}"></div>`;
const vs = (y, d = 150) => `<div style="position:absolute;left:${540 - d / 2}px;top:${y - d / 2}px;width:${d}px;height:${d}px;border-radius:50%;background:${COR.vermelho};border:8px solid #fff;display:flex;align-items:center;justify-content:center;${TITULO};font-size:${Math.round(d * .42)}px;color:#fff;z-index:10;box-shadow:0 12px 30px rgba(0,0,0,.35)">VS</div>`;
const linhaMeio = `<div style="position:absolute;left:537px;top:0;bottom:0;width:6px;background:rgba(255,255,255,.9);z-index:2"></div>`;
const kick = (txt, cor = COR.off) => txt ? `<div style="${TEXTO};font-size:26px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${cor}">${esc(txt)}</div>` : '';

const TIPOS = {
  // Capa: os dois lados como lutadores (sigla gigante + nome), medalhão VS e a chamada embaixo.
  capa(s, t, ctx) {
    const [a, b] = lista(s.lados);
    const lado = (l, x) => `<div style="position:absolute;left:${x}px;width:460px;top:330px;height:560px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;gap:24px;z-index:4">
      <div data-fit="${esc(l.sigla)}" data-min="90" style="${TITULO};font-size:${l.ts || 230}px;line-height:.85;padding-top:.1em;color:#fff;width:100%;overflow:hidden">${esc(l.sigla)}</div>
      <div style="${TEXTO};font-size:34px;font-weight:600;line-height:1.2;color:#fff;max-width:380px">${rico(l.nome || '', '#fff', COR.azul)}</div></div>`;
    return `${metades}${linhaMeio}
      <div style="position:absolute;left:0;right:0;top:120px;display:flex;justify-content:center;z-index:5"><div style="background:#fff;color:${COR.azul};${TITULO};font-size:64px;line-height:1;padding:14px 34px 8px">${esc(s.kicker || 'Duelo')}</div></div>
      ${lado(a || {}, 40)}${lado(b || {}, 580)}${vs(610, 190)}
      ${anel(-200, 1080, 400)}${objeto(ctx, s.objeto && { x: 850, y: 40, tam: 200, rot: 16, ...s.objeto })}
      ${s.texto ? `<div style="position:absolute;left:120px;right:120px;bottom:120px;text-align:center;z-index:6"><div data-fit="texto" data-min="26" style="display:inline-block;background:${COR.navyFundo};color:#fff;${TEXTO};font-size:40px;font-weight:600;line-height:1.25;padding:22px 34px;max-height:220px;overflow:hidden">${rico(s.texto, COR.azul)}</div></div>` : ''}`;
  },
  // Round: faixa com o número e o critério; embaixo, a resposta de cada lado e o artigo (chip).
  round(s, t, ctx, c) {
    const [a, b] = lista(s.lados);
    const [na, nb] = lista(c.nomes);
    const col = (l, x, nome) => `<div style="position:absolute;left:${x}px;width:410px;top:470px;bottom:${s.pegadinha ? 330 : 170}px;display:flex;flex-direction:column;gap:22px;z-index:4">
      <div style="${TITULO};font-size:70px;line-height:.9;color:${COR.azulClaro}">${esc(nome || '')}</div>
      <div data-fit="${esc(nome)}" data-min="24" style="flex:1;overflow:hidden;${TEXTO};font-size:${s.corpo || 48}px;font-weight:500;line-height:1.28;color:#fff">${lista(l && l.texto).map(p => `<p style="margin-bottom:.5em">${rico(p, '#fff', COR.azul)}</p>`).join('')}
        ${l && l.artigo ? `<div style="display:flex;flex-wrap:wrap;gap:10px">${String(l.artigo).split(/;\s*/).map(a => `<span style="background:#fff;color:${COR.azul};font-size:.6em;font-weight:800;padding:8px 16px;border-radius:8px;white-space:nowrap">${esc(a)}</span>`).join('')}</div>` : ''}</div></div>`;
    return `${metades}${linhaMeio}
      <div style="position:absolute;left:0;right:0;top:150px;height:250px;background:#fff;z-index:6;display:flex;flex-direction:column;justify-content:center;padding:0 96px">
        <div style="${TEXTO};font-size:26px;font-weight:800;letter-spacing:.2em;color:${COR.vermelho}">ROUND ${esc(s.numero ?? '')}</div>
        <div data-fit="${esc(lista(s.titulo).join(' '))}" data-min="60" style="${TITULO};font-size:${s.ts || 120}px;line-height:.9;color:${COR.azul};overflow:hidden;max-height:200px;padding-top:.1em">${linhas(s.titulo)}</div>
      </div>
      ${vs(400, 110)}
      ${col(a, 80, na)}${col(b, 620, nb)}
      ${s.pegadinha ? `<div style="position:absolute;left:80px;right:80px;bottom:150px;height:150px;background:${COR.vermelho};z-index:6;display:flex;align-items:center;padding:0 40px"><div data-fit="pegadinha" data-min="22" style="${TEXTO};font-size:34px;font-weight:600;line-height:1.25;color:#fff;max-height:130px;overflow:hidden"><b style="font-weight:800">Pegadinha:</b> ${rico(s.pegadinha)}</div></div>` : ''}
      ${objeto(ctx, s.objeto)}
      <div style="position:absolute;bottom:64px;left:96px;${TEXTO};font-size:26px;font-weight:600;letter-spacing:.08em;color:#fff;z-index:15">@liberofilho</div>`;
  },
  // Placar: tabela-resumo critério × lado A × lado B.
  placar(s, t, ctx, c) {
    const [na, nb] = lista(c.nomes);
    const linhasT = lista(s.linhas);
    return `<div style="position:absolute;left:80px;right:80px;top:140px;bottom:170px;display:flex;flex-direction:column;gap:30px">
      ${kick(s.kicker, t.kicker)}
      <div style="${TITULO};font-size:${s.ts || 120}px;line-height:.88;color:${t.tit}">${linhas(s.titulo, t.caixa)}</div>
      <div data-fit="placar" data-min="20" style="flex:1;overflow:hidden;font-size:${s.corpo || 36}px;${TEXTO}">
        <div style="display:grid;grid-template-columns:.8fr 1fr 1fr;border-radius:18px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,.15)">
          <div style="background:${COR.navyFundo}"></div>
          <div style="background:${COR.azul};color:#fff;${TITULO};font-size:1.9em;padding:.3em .5em .15em">${esc(na)}</div>
          <div style="background:${COR.navyFundo};color:#fff;${TITULO};font-size:1.9em;padding:.3em .5em .15em">${esc(nb)}</div>
          ${linhasT.map((l, k) => { const bg = k % 2 ? '#fff' : '#E7ECF8'; return `
            <div style="background:${bg};padding:.6em .6em;font-weight:800;color:${COR.azul};text-transform:uppercase;font-size:.8em;letter-spacing:.06em">${esc(l.criterio)}</div>
            <div style="background:${bg};padding:.6em .6em;font-weight:500;line-height:1.22;color:${COR.navy};border-left:2px solid #D4DBEA">${rico(l.a)}</div>
            <div style="background:${bg};padding:.6em .6em;font-weight:500;line-height:1.22;color:${COR.navy};border-left:2px solid #D4DBEA">${rico(l.b)}</div>`; }).join('')}
        </div>
      </div>
    </div>${rodape(t.txt)}`;
  },
  // Macete: frase de bolso em cartões empilhados (um por lado).
  macete(s, t) {
    return `<div style="position:absolute;left:96px;right:96px;top:150px;bottom:190px;display:flex;flex-direction:column;justify-content:center;gap:36px">
      ${kick(s.kicker, t.kicker)}
      <div style="${TITULO};font-size:${s.ts || 130}px;line-height:.88;color:${t.tit}">${linhas(s.titulo, t.caixa)}</div>
      ${lista(s.frases).map((f, k) => `<div style="display:flex;gap:26px;align-items:stretch">
        <div style="width:16px;flex:none;background:${k ? COR.vermelho : COR.azul}"></div>
        <div data-fit="frase" data-min="24" style="${TEXTO};font-size:${s.corpo || 42}px;font-weight:500;line-height:1.28;color:${t.txt};max-height:260px;overflow:hidden">${rico(f, t.caixa)}</div></div>`).join('')}
    </div>${rodape(t.txt)}`;
  },
  // CTA: pergunta e botão sobre a tela dividida, com a foto do autor no medalhão.
  cta(s, t, ctx) {
    const f = s.foto ? ctx.foto(s.foto) : '';
    return `${metades}
      ${f ? `<div style="position:absolute;left:340px;top:150px;width:400px;height:400px;border-radius:50%;border:12px solid #fff;background:url('${f}') center 22%/cover;z-index:8;box-shadow:0 20px 40px rgba(0,0,0,.35)"></div>
        <div style="position:absolute;left:640px;top:440px;background:${COR.vermelho};color:#fff;${TITULO};font-size:56px;padding:8px 22px 2px;transform:rotate(-6deg);z-index:9">VS VOCÊ</div>` : ''}
      <div style="position:absolute;left:96px;right:96px;top:${f ? 640 : 300}px;bottom:170px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:30px;z-index:7">
        <div data-fit="${esc(lista(s.titulo).join(' '))}" data-min="60" style="flex:none;${TITULO};font-size:${s.ts || 120}px;line-height:.9;color:#fff;max-height:230px;overflow:hidden">${linhas(s.titulo, '#fff', COR.azul)}</div>
        ${s.texto ? `<p style="font-size:38px;font-weight:500;line-height:1.3;color:#fff;max-width:760px">${rico(s.texto)}</p>` : ''}
        ${s.botao ? `<span style="display:inline-block;background:#fff;color:${COR.azul};${TEXTO};font-size:34px;font-weight:800;padding:22px 44px;border-radius:999px">${esc(s.botao)}</span>` : ''}
      </div>
      <div style="position:absolute;bottom:64px;left:0;right:0;text-align:center;${TEXTO};font-size:26px;font-weight:600;letter-spacing:.08em;color:#fff;z-index:15">@liberofilho</div>`;
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
  return { html: pagina(slides), total: slides.length, avisos };
}

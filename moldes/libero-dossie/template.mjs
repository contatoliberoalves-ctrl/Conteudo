// Molde "Libero Dossiê" (@liberofilho), slides de AULA 1920×1080: o tema vira um processo arquivado.
// Capa com a folha do dossiê (aba, carimbo vermelho e clipe), linha do tempo horizontal dos exames, uma
// ficha por exame (número vazado gigante à esquerda, autos do caso à direita), carimbo com o padrão da
// banca e fechamento com foto presa por clipe. A versão de post (1080×1350) é o visual "dossie" do
// Carrossel Libero. Identidade do Carrossel Libero (libero-comum/identidade.mjs).
import { COR, TEMAS, TITULO, TEXTO, esc, lista, rico, linhas, rodape, anel, objeto, pagina } from '../libero-comum/identidade.mjs';

const W = 1920, H = 1080;
const pap = COR.papel;
const aba = (txt, bg, cor) => `<div style="display:inline-block;background:${bg};color:${cor};${TEXTO};font-size:26px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;padding:14px 34px 12px;border-radius:16px 16px 0 0">${esc(txt)}</div>`;
const carimbo = (txt, sub, x, y, rot = -12, tam = 250) => `<div style="position:absolute;left:${x}px;top:${y}px;width:${tam}px;height:${tam}px;border:10px solid ${COR.vermelho};border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;transform:rotate(${rot}deg);color:${COR.vermelho};${TITULO};font-size:${Math.round(tam * .26)}px;line-height:.9;text-align:center;z-index:13;opacity:.93;box-shadow:inset 0 0 0 6px ${pap},inset 0 0 0 10px ${COR.vermelho}">${esc(txt)}${sub ? `<span style="${TEXTO};font-size:${Math.round(tam * .1)}px;font-weight:800;letter-spacing:.1em;margin-top:6px">${esc(sub)}</span>` : ''}</div>`;
const chip = (txt, bg, cor, px = 26) => `<span style="display:inline-block;background:${bg};color:${cor};${TEXTO};font-size:${px}px;font-weight:700;padding:6px 16px;border-radius:8px;white-space:nowrap">${esc(txt)}</span>`;
const kick = (txt, cor) => txt ? `<div style="${TEXTO};font-size:28px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${cor}">${esc(txt)}</div>` : '';
const rod = t => rodape(t.txt).replace('left:96px', 'left:120px').replace('bottom:64px', 'bottom:50px');

const TIPOS = {
  // Folha do dossiê à esquerda (aba, rótulo, sigla gigante, nome, fichas dos exames) e carimbo; pasta 3D à direita.
  capa(s, t, ctx) {
    const exames = lista(s.exames);
    return `${anel(1600, -230, 460)}
    <div style="position:absolute;left:150px;top:120px;width:1180px;transform:rotate(-1.5deg);z-index:4">
      ${aba(s.aba || 'Dossiê · OAB 2ª fase', COR.navyFundo, '#fff')}
      <div style="position:relative;background:${pap};border-radius:0 18px 18px 18px;padding:60px 70px 56px;box-shadow:0 30px 60px rgba(0,0,0,.3);height:780px;display:flex;flex-direction:column">
        <div style="${TEXTO};font-size:44px;font-weight:700;color:${COR.navy}">${esc(s.rotulo)}</div>
        <div data-fit="${esc(lista(s.titulo).join(' '))}" data-min="80" style="${TITULO};font-size:${s.ts || 300}px;line-height:${lista(s.titulo).some(l => l.includes('[[')) ? 1.05 : .9};padding-top:.1em;color:${COR.azul};height:300px;overflow:hidden;max-width:640px">${linhas(s.titulo)}</div>
        <div style="${TEXTO};font-size:40px;font-weight:600;color:${COR.navy};margin-top:14px;max-width:760px">${esc(s.nome)}</div>
        <div style="margin-top:auto;border-top:3px dashed #C9CFDB;padding-top:26px">
          <div style="${TEXTO};font-size:22px;font-weight:700;letter-spacing:.16em;color:${COR.azul};margin-bottom:16px">EXAMES EM QUE CAIU</div>
          <div style="display:flex;flex-wrap:wrap;gap:12px;max-width:760px">${exames.map(e => chip(e, COR.azul, '#fff', 30)).join('')}</div>
        </div>
        ${carimbo(exames.length ? `Já caiu ${exames.length}×` : 'Já caiu', 'na FGV', 850, 170, -14, 280)}
      </div>
    </div>
    ${objeto(ctx, { img: 'paperclip.png', x: 1190, y: 70, tam: 190, rot: 18 })}
    ${objeto(ctx, { img: 'file_folder.png', x: 1400, y: 560, tam: 420, rot: 8, ...(s.objeto || {}) })}`;
  },
  // Linha do tempo horizontal: um marco por exame, com o exame em cima e o assunto embaixo.
  linha(s, t) {
    const itens = lista(s.itens);
    return `<div style="position:absolute;left:120px;right:120px;top:110px">
      ${kick(s.kicker, t.kicker)}
      <div style="${TITULO};font-size:${s.ts || 120}px;line-height:.9;color:${t.tit};margin-top:14px">${linhas(s.titulo, t.caixa)}</div>
    </div>
    <div style="position:absolute;left:120px;right:120px;top:598px;height:8px;background:${t.linha}"></div>
    <div data-fit="linha do tempo" data-min="20" style="position:absolute;left:120px;right:120px;top:460px;bottom:120px;display:grid;grid-template-columns:repeat(${itens.length},1fr);gap:24px;font-size:${s.corpo || 32}px;overflow:hidden">
      ${itens.map(i => `<div style="display:flex;flex-direction:column">
        <div style="height:120px;display:flex;align-items:flex-end;${TITULO};font-size:1.9em;line-height:.95;color:${t.tit}">${esc(i.exame)}</div>
        <div style="width:44px;height:44px;border-radius:50%;background:${COR.vermelho};border:8px solid ${t.escuro ? COR.navyFundo : COR.off};margin:0 0 22px"></div>
        <div style="${TEXTO};font-weight:500;line-height:1.28;color:${t.txt}">${rico(i.texto, t.caixa)}</div>
      </div>`).join('')}
    </div>${rod(t)}`;
  },
  // Ficha do exame: número vazado gigante e o exame à esquerda; autos do caso (o caso e as teses) à direita.
  ficha(s, t) {
    const num = s.numero ?? (String(s.exame || '').match(/\d+/) || [''])[0];  // número vazado: o do exame (ou "numero")
    const papel = t.escuro ? pap : '#fff';
    return `<div style="position:absolute;left:60px;top:360px;${TITULO};font-size:600px;line-height:.8;color:transparent;-webkit-text-stroke:5px ${t.escuro ? 'rgba(255,255,255,.35)' : 'rgba(11,79,216,.3)'};z-index:1">${esc(num)}</div>
      <div style="position:absolute;left:120px;top:120px;width:560px;z-index:3">
        ${kick(s.kicker || 'Ficha do exame', t.kicker)}
        <div style="${TITULO};font-size:${s.ts || 170}px;line-height:.88;color:${t.tit};margin-top:10px">${esc(s.exame)}</div>
      </div>
      <div style="position:absolute;left:760px;right:120px;top:110px;bottom:130px;z-index:4;display:flex;flex-direction:column">
        ${aba(s.aba || 'Autos do caso', COR.vermelho, '#fff')}
        <div data-fit="${esc(s.exame)}" data-min="22" style="background:${papel};border-radius:0 18px 18px 18px;padding:44px 52px;box-shadow:0 20px 40px rgba(0,0,0,.18);flex:1;overflow:hidden;font-size:${s.corpo || 42}px;color:${COR.navy}">
          ${s.caso ? `<div style="font-weight:600;line-height:1.28;border-bottom:3px dashed #C9CFDB;padding-bottom:.7em;margin-bottom:.8em"><span style="font-weight:800;color:${COR.azul}">O caso: </span>${rico(s.caso)}</div>` : ''}
          ${lista(s.itens).map((i, k) => `<div style="display:flex;gap:.6em;margin-bottom:.7em">
            <div style="${TITULO};font-size:1.6em;line-height:.9;color:${COR.vermelho};width:1.1em;flex:none">${k + 1}</div>
            <div style="line-height:1.25">${i.tag ? chip(i.tag, COR.navy, '#fff', 20) + ' ' : ''}<span style="font-weight:600">${rico(i.tese)}</span>${i.artigo ? `<div style="margin-top:.25em">${chip(i.artigo, '#E4ECFF', COR.azul, 26)}</div>` : ''}</div>
          </div>`).join('')}
        </div>
      </div>${rod(t)}`;
  },
  // Carimbo: título grande à esquerda, explicação à direita e o carimbo vermelho.
  carimbo(s, t) {
    return `<div style="position:absolute;left:120px;top:150px;bottom:150px;width:820px;display:flex;flex-direction:column;justify-content:center;gap:30px">
        ${kick(s.kicker, t.kicker)}
        <div data-fit="${esc(lista(s.titulo).join(' '))}" data-min="60" style="flex:none;${TITULO};font-size:${s.ts || 170}px;line-height:${lista(s.titulo).some(l => l.includes('[[')) ? 1.08 : .9};padding-top:.06em;color:${t.tit};max-height:600px;overflow:hidden">${linhas(s.titulo, t.caixa)}</div>
      </div>
      <div style="position:absolute;left:1040px;right:120px;top:150px;bottom:150px;display:flex;flex-direction:column;justify-content:center;gap:34px;border-left:8px solid ${COR.vermelho};padding-left:56px">
        ${lista(s.texto).map(p => `<p style="font-size:44px;font-weight:500;line-height:1.3;color:${t.txt}">${rico(p, t.caixa)}</p>`).join('')}
      </div>
      ${carimbo(s.selo || 'Padrão', s.seloSub || 'da banca', 1580, 60, 12, 240)}${rod(t)}`;
  },
  // Fechamento: foto do autor presa por clipe à esquerda; pergunta e botão à direita.
  cta(s, t, ctx) {
    const f = s.foto ? ctx.foto(s.foto) : '';
    return `${anel(1640, 800, 460)}
    ${f ? `<div style="position:absolute;left:160px;top:110px;width:520px;background:#fff;padding:24px 24px 90px;transform:rotate(-4deg);box-shadow:0 30px 50px rgba(0,0,0,.35);z-index:6"><div style="height:640px;background:url('${f}') center 25%/cover"></div></div>
      ${objeto(ctx, { img: 'paperclip.png', x: 480, y: 50, tam: 180, rot: 20 })}` : ''}
    <div style="position:absolute;left:${f ? 820 : 120}px;right:160px;top:150px;bottom:150px;display:flex;flex-direction:column;justify-content:center;gap:36px;z-index:7">
      <div data-fit="${esc(lista(s.titulo).join(' '))}" data-min="60" style="flex:none;${TITULO};font-size:${s.ts || 150}px;line-height:.9;padding-top:.06em;color:${t.tit};max-height:420px;overflow:hidden">${linhas(s.titulo, t.caixa)}</div>
      ${s.texto ? `<p style="font-size:44px;font-weight:500;line-height:1.3;color:${t.txt}">${rico(s.texto, t.caixa)}</p>` : ''}
      ${s.botao ? `<div><span style="display:inline-block;background:${t.escuro ? '#fff' : COR.azul};color:${t.escuro ? COR.azul : '#fff'};${TEXTO};font-size:38px;font-weight:800;padding:24px 50px;border-radius:999px">${esc(s.botao)}</span></div>` : ''}
    </div>${rod(t)}`;
  },
};

export function renderCarrossel(c, ctx) {
  const avisos = [];
  const slides = (c.slides || []).map((s, i) => {
    const t = TEMAS[s.tema] || TEMAS.blue;
    const f = TIPOS[s.tipo];
    if (!f) avisos.push(`slide ${i + 1}: tipo "${s.tipo}" não existe (${Object.keys(TIPOS).join(', ')})`);
    return { bg: t.bg, escuro: t.escuro, html: f ? f(s, t, ctx) : '' };
  });
  return { html: pagina(slides, W, H), total: slides.length, avisos, largura: W, altura: H };
}

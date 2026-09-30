// Visual "Dossiê" do Carrossel Libero (posts 1080×1350 com "visual" no dados.json; a versão de aula, 1920×1080, é o molde libero-*): o carrossel vira um processo arquivado. Capa com a folha do
// dossiê (aba, carimbo vermelho e clipe), linha do tempo dos exames, uma ficha por exame (número vazado
// gigante, o caso e as teses com o artigo), carimbo com o padrão da banca e CTA com foto presa por clipe.
// Identidade do Carrossel Libero (libero-comum/identidade.mjs).
import { COR, TEMAS, TITULO, TEXTO, esc, lista, rico, linhas, rodape, anel, objeto, pagina } from '../../libero-comum/identidade.mjs';

const pap = COR.papel;
const aba = (txt, bg, cor) => `<div style="display:inline-block;background:${bg};color:${cor};${TEXTO};font-size:24px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;padding:14px 30px 12px;border-radius:16px 16px 0 0">${esc(txt)}</div>`;
const carimbo = (txt, sub, x, y, rot = -12, tam = 250) => `<div style="position:absolute;left:${x}px;top:${y}px;width:${tam}px;height:${tam}px;border:10px solid ${COR.vermelho};border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;transform:rotate(${rot}deg);color:${COR.vermelho};${TITULO};font-size:${Math.round(tam * .26)}px;line-height:.9;text-align:center;z-index:13;opacity:.93;box-shadow:inset 0 0 0 6px ${pap},inset 0 0 0 10px ${COR.vermelho}">${esc(txt)}${sub ? `<span style="${TEXTO};font-size:${Math.round(tam * .1)}px;font-weight:800;letter-spacing:.1em;margin-top:6px">${esc(sub)}</span>` : ''}</div>`;
const chip = (txt, bg, cor, px = 26) => `<span style="display:inline-block;background:${bg};color:${cor};${TEXTO};font-size:${px}px;font-weight:700;padding:6px 16px;border-radius:8px;white-space:nowrap">${esc(txt)}</span>`;

const TIPOS = {
  // Folha do dossiê sobre o fundo azul: aba, rótulo, sigla gigante, nome, fichas dos exames e carimbo.
  capa(s, t, ctx) {
    const exames = lista(s.exames);
    return `<div style="position:absolute;left:96px;right:96px;top:170px;transform:rotate(-2deg)">
      ${aba(s.aba || 'Dossiê · OAB 2ª fase', COR.navyFundo, '#fff')}
      <div style="position:relative;background:${pap};border-radius:0 18px 18px 18px;padding:70px 64px 64px;box-shadow:0 30px 60px rgba(0,0,0,.3);height:900px;display:flex;flex-direction:column">
        <div style="${TEXTO};font-size:40px;font-weight:700;color:${COR.navy}">${esc(s.rotulo)}</div>
        <div data-fit="${esc(lista(s.titulo).join(' '))}" data-min="120" style="${TITULO};font-size:${s.ts || 330}px;line-height:.86;color:${COR.azul};margin:10px 0 0;height:300px;overflow:hidden">${linhas(s.titulo)}</div>
        <div style="${TEXTO};font-size:36px;font-weight:600;color:${COR.navy};margin-top:18px;max-width:640px">${esc(s.nome)}</div>
        <div style="margin-top:auto;border-top:3px dashed #C9CFDB;padding-top:30px">
          <div style="${TEXTO};font-size:22px;font-weight:700;letter-spacing:.16em;color:${COR.azul};margin-bottom:16px">EXAMES EM QUE CAIU</div>
          <div style="display:flex;flex-wrap:wrap;gap:12px;max-width:470px">${exames.map(e => chip(e, COR.azul, '#fff', 28)).join('')}</div>
        </div>
        ${carimbo(exames.length ? `Já caiu ${exames.length}×` : 'Já caiu', 'na FGV', 560, 530, -14, 250)}
      </div>
    </div>
    ${objeto(ctx, { img: 'paperclip.png', x: 790, y: 110, tam: 190, rot: 18, ...(s.objeto || {}) })}`;
  },
  // Linha do tempo: um marco por exame, do mais recente ao mais antigo.
  linha(s, t) {
    const itens = lista(s.itens);
    return `<div style="position:absolute;left:96px;right:96px;top:140px;bottom:170px;display:flex;flex-direction:column">
      ${s.kicker ? `<div style="${TEXTO};font-size:28px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:${t.kicker}">${esc(s.kicker)}</div>` : ''}
      <div style="${TITULO};font-size:${s.ts || 120}px;line-height:.88;color:${t.tit};margin:14px 0 50px">${linhas(s.titulo, t.caixa)}</div>
      <div data-fit="linha do tempo" data-min="22" style="position:relative;flex:1;overflow:hidden;font-size:${s.corpo || 38}px;padding-left:70px">
        <div style="position:absolute;left:20px;top:10px;bottom:10px;width:6px;background:${t.linha}"></div>
        ${itens.map(i => `<div style="position:relative;margin-bottom:.9em">
          <div style="position:absolute;left:-64px;top:.2em;width:38px;height:38px;border-radius:50%;background:${COR.vermelho};border:7px solid ${t.escuro ? COR.navyFundo : COR.off}"></div>
          <div style="${TITULO};font-size:1.5em;line-height:1;color:${t.tit}">${esc(i.exame)}</div>
          <div style="${TEXTO};font-weight:500;line-height:1.28;color:${t.txt};margin-top:.2em">${rico(i.texto, t.caixa)}</div>
        </div>`).join('')}
      </div>
    </div>${rodape(t.txt)}`;
  },
  // Ficha do exame: número vazado gigante, o caso e as teses (com tag formal/material e o artigo).
  ficha(s, t) {
    const num = s.numero ?? (String(s.exame || '').match(/\d+/) || [''])[0];  // número vazado: o do exame (ou "numero")
    const papel = t.escuro ? pap : '#fff';
    return `<div style="position:absolute;right:60px;top:40px;${TITULO};font-size:430px;line-height:.8;color:transparent;-webkit-text-stroke:5px ${t.escuro ? 'rgba(255,255,255,.4)' : 'rgba(11,79,216,.35)'};z-index:1">${esc(num)}</div>
      <div style="position:absolute;left:96px;top:150px;z-index:3">
        <div style="${TEXTO};font-size:28px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:${t.kicker}">${esc(s.kicker || 'Ficha do exame')}</div>
        <div style="${TITULO};font-size:150px;line-height:.88;color:${t.tit};margin-top:10px">${esc(s.exame)}</div>
      </div>
      <div style="position:absolute;left:96px;right:96px;top:470px;bottom:160px;z-index:4;display:flex;flex-direction:column">
        ${aba(s.aba || 'Autos do caso', COR.vermelho, '#fff')}
        <div data-fit="${esc(s.exame)}" data-min="22" style="background:${papel};border-radius:0 18px 18px 18px;padding:40px 46px;box-shadow:0 20px 40px rgba(0,0,0,.18);flex:1;overflow:hidden;font-size:${s.corpo || 42}px;color:${COR.navy}">
          ${s.caso ? `<div style="font-weight:600;line-height:1.28;border-bottom:3px dashed #C9CFDB;padding-bottom:.7em;margin-bottom:.8em"><span style="font-weight:800;color:${COR.azul}">O caso: </span>${rico(s.caso)}</div>` : ''}
          ${lista(s.itens).map((i, k) => `<div style="display:flex;gap:.6em;margin-bottom:.75em">
            <div style="${TITULO};font-size:1.6em;line-height:.9;color:${COR.vermelho};width:1.1em;flex:none">${k + 1}</div>
            <div style="line-height:1.25">${i.tag ? chip(i.tag, COR.navy, '#fff', 20) + '<br>' : ''}<span style="font-weight:600">${rico(i.tese)}</span>${i.artigo ? `<div style="margin-top:.25em">${chip(i.artigo, '#E4ECFF', COR.azul, 24)}</div>` : ''}</div>
          </div>`).join('')}
        </div>
      </div>${rodape(t.txt)}`;
  },
  // Carimbo: a conclusão do dossiê numa frase grande, com o carimbo vermelho.
  carimbo(s, t) {
    return `<div style="position:absolute;left:96px;right:96px;top:170px;bottom:190px;display:flex;flex-direction:column;justify-content:center;gap:40px">
      ${s.kicker ? `<div style="${TEXTO};font-size:28px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:${t.kicker}">${esc(s.kicker)}</div>` : ''}
      <div data-fit="${esc(lista(s.titulo).join(' '))}" data-min="60" style="flex:none;${TITULO};font-size:${s.ts || 130}px;line-height:.9;color:${t.tit};max-height:560px;overflow:hidden">${linhas(s.titulo, t.caixa)}</div>
      ${lista(s.texto).map(p => `<p style="font-size:40px;font-weight:500;line-height:1.3;color:${t.txt};max-width:820px">${rico(p, t.caixa)}</p>`).join('')}
    </div>
    ${carimbo(s.selo || 'Padrão', s.seloSub || 'da banca', 700, 110, 12, 260)}${rodape(t.txt)}`;
  },
  // CTA: foto do autor presa por clipe (polaroide), pergunta e botão.
  cta(s, t, ctx) {
    const f = s.foto ? ctx.foto(s.foto) : '';
    return `${f ? anel(-230, 160, 420) : anel(850, -220, 440)}
    ${f ? `<div style="position:absolute;right:100px;top:150px;width:470px;background:#fff;padding:22px 22px 80px;transform:rotate(4deg);box-shadow:0 30px 50px rgba(0,0,0,.35);z-index:6"><div style="height:520px;background:url('${f}') center 25%/cover"></div></div>
      ${objeto(ctx, { img: 'paperclip.png', x: 620, y: 70, tam: 170, rot: 20 })}` : ''}
    <div style="position:absolute;left:96px;right:96px;top:${f ? 760 : 150}px;bottom:170px;display:flex;flex-direction:column;justify-content:${f ? 'flex-start' : 'center'};gap:30px;z-index:7">
      <div data-fit="${esc(lista(s.titulo).join(' '))}" data-min="60" style="flex:none;${TITULO};font-size:${s.ts || 110}px;line-height:.9;color:${t.tit};max-height:230px;overflow:hidden">${linhas(s.titulo, t.caixa)}</div>
      ${s.texto ? `<p style="font-size:38px;font-weight:500;line-height:1.3;color:${t.txt};max-width:760px">${rico(s.texto, t.caixa)}</p>` : ''}
      ${s.botao ? `<div><span style="display:inline-block;background:${t.escuro ? '#fff' : COR.azul};color:${t.escuro ? COR.azul : '#fff'};${TEXTO};font-size:34px;font-weight:800;padding:22px 44px;border-radius:999px">${esc(s.botao)}</span></div>` : ''}
      ${s.print ? `<div style="position:relative;margin-top:20px;transform:rotate(-1.5deg)">
        <img src="${ctx.foto(s.print)}" style="display:block;width:100%;border-radius:22px;box-shadow:0 26px 50px rgba(0,0,0,.35);border:10px solid #fff">
        ${s.destaque ? `<div style="position:absolute;left:${s.destaque[0]}%;top:${s.destaque[1]}%;width:${s.destaque[2]}%;height:${s.destaque[3]}%;border:8px solid ${COR.vermelho};border-radius:999px;transform:scale(1.2)"></div>` : ''}
        ${objeto(ctx, { img: 'paperclip.png', x: 790, y: -95, tam: 150, rot: 20 })}</div>` : ''}
    </div>${rodape(t.txt)}`;
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
  return { html: pagina(slides), total: slides.length, avisos };
}

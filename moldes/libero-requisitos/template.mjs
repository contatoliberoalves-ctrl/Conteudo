// Molde "Libero Requisitos" (@liberofilho): "fulano poderia ser X?" checado requisito por requisito,
// como uma ficha de candidatura. Capa com a pergunta e o carimbo EM ANÁLISE, a lei literal, um slide por
// requisito (caixa marcada ✔/✘/?, o que a CF diz e a análise do caso, com o veredito embaixo), a
// virada ("e se…?"), o checklist com o veredito final carimbado e o CTA.
// Identidade do Carrossel Libero (libero-comum/identidade.mjs).
import { COR, TEMAS, TITULO, TEXTO, esc, lista, rico, linhas, rodape, anel, objeto, pagina } from '../libero-comum/identidade.mjs';

// Veredito: sim (cumpre), nao (não cumpre) ou talvez (depende / ainda não).
const VER = {
  sim: { marca: '✔', cor: COR.azul, rotulo: 'Cumpre' },
  nao: { marca: '✘', cor: COR.vermelho, rotulo: 'Não cumpre' },
  talvez: { marca: '?', cor: '#F2A516', rotulo: 'Depende' },
};
const ver = v => VER[v] || VER.talvez;
const kick = (txt, cor) => txt ? `<div style="${TEXTO};font-size:26px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${cor}">${esc(txt)}</div>` : '';
const caixa = (v, tam, fundo) => `<div style="width:${tam}px;height:${tam}px;flex:none;border:${Math.round(tam * .07)}px solid ${ver(v).cor};border-radius:${Math.round(tam * .14)}px;background:${fundo};display:flex;align-items:center;justify-content:center;color:${ver(v).cor};font-size:${Math.round(tam * .7)}px;font-weight:800;line-height:1;${TEXTO}">${ver(v).marca}</div>`;
const carimbo = (txt, x, y, rot, px = 110, cor = COR.vermelho) => `<div style="position:absolute;left:${x}px;top:${y}px;transform:rotate(${rot}deg);border:9px solid ${cor};color:${cor};${TITULO};font-size:${px}px;line-height:1;padding:.12em .3em .02em;z-index:14;opacity:.94;outline:4px solid ${cor};outline-offset:6px">${esc(txt)}</div>`;

const TIPOS = {
  // Capa: pergunta gigante, subtítulo, objeto 3D do personagem e o carimbo EM ANÁLISE.
  capa(s, t, ctx) {
    return `${anel(820, -230, 440)}
      <div style="position:absolute;left:96px;right:96px;top:150px;display:flex;flex-direction:column;gap:34px;z-index:6">
        ${kick(s.kicker || 'Ficha de candidatura', t.kicker)}
        <div data-fit="${esc(lista(s.titulo).join(' '))}" data-min="80" style="${TITULO};font-size:${s.ts || 170}px;line-height:1.02;padding-top:.06em;color:${t.tit};max-height:640px;overflow:hidden">${linhas(s.titulo, t.escuro ? '#fff' : COR.azul, t.escuro ? COR.azul : '#fff')}</div>
        ${s.texto ? `<p style="${TEXTO};font-size:40px;font-weight:500;line-height:1.28;color:${t.txt};max-width:560px">${rico(s.texto)}</p>` : ''}
      </div>
      ${carimbo(s.selo || 'Em análise', 96, 1110, -6, 88)}
      ${objeto(ctx, s.objeto && { x: 560, y: 720, tam: 500, rot: -8, ...s.objeto })}`;
  },
  // Lei: o dispositivo copiado literalmente num cartão de papel e a tradução embaixo.
  lei(s, t) {
    return `<div style="position:absolute;left:96px;right:96px;top:140px;bottom:170px;display:flex;flex-direction:column;gap:30px">
      ${kick(s.kicker, t.kicker)}
      <div style="${TITULO};font-size:${s.ts || 120}px;line-height:.9;color:${t.tit}">${linhas(s.titulo, t.caixa)}</div>
      <div style="flex:1;min-height:0;background:#fff;border-left:18px solid ${COR.azul};padding:40px 44px;box-shadow:0 20px 40px rgba(0,0,0,.12);display:flex;flex-direction:column">
        ${s.ref ? `<div style="${TEXTO};font-size:26px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:${COR.vermelho};margin-bottom:18px">${esc(s.ref)}</div>` : ''}
        <div data-fit="lei" data-min="22" style="flex:1;overflow:hidden;${TEXTO};font-size:${s.corpo || 38}px;font-weight:500;line-height:1.32;color:${COR.navy}">${lista(s.citacao).map(p => `<p style="margin-bottom:.35em">${rico(p)}</p>`).join('')}</div>
      </div>
      ${s.traducao ? `<div data-fit="traducao" data-min="24" style="flex:none;${TEXTO};font-size:38px;font-weight:600;line-height:1.28;color:${t.txt};max-height:150px;overflow:hidden">${rico(s.traducao, t.caixa)}</div>` : ''}
    </div>${rodape(t.txt)}`;
  },
  // Requisito: caixa marcada + título, o que a CF diz (com o artigo) e a análise; veredito na faixa de baixo.
  requisito(s, t, ctx, c) {
    const v = ver(s.veredito);
    const fundoCaixa = t.escuro ? 'rgba(255,255,255,.08)' : '#fff';
    const cartao = t.escuro ? 'rgba(255,255,255,.08)' : '#fff';
    return `<div style="position:absolute;left:96px;right:96px;top:140px;bottom:300px;display:flex;flex-direction:column;gap:34px">
        <div style="display:flex;gap:36px;align-items:center">
          ${caixa(s.veredito, 170, fundoCaixa)}
          <div style="flex:1;min-width:0">
            ${kick(s.numero ? `Requisito ${s.numero}` : s.kicker, t.kicker)}
            <div data-fit="${esc(lista(s.titulo).join(' '))}" data-min="50" style="${TITULO};font-size:${s.ts || 116}px;line-height:.92;padding-top:.08em;color:${t.tit};max-height:200px;overflow:hidden">${linhas(s.titulo, t.caixa)}</div>
          </div>
        </div>
        <div data-fit="requisito" data-min="22" style="flex:1;min-height:0;overflow:hidden;display:flex;flex-direction:column;gap:.7em;${TEXTO};font-size:${s.corpo || 48}px">
          <div style="background:${cartao};padding:.8em .9em;border-radius:14px">
            <div style="font-size:.6em;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:${t.escuro ? COR.azulClaro : COR.azul};margin-bottom:.4em">O que a CF diz${s.artigo ? ` · ${esc(s.artigo)}` : ''}</div>
            <div style="font-weight:600;line-height:1.28;color:${t.escuro ? '#fff' : COR.navy}">${rico(s.regra, t.caixa)}</div>
          </div>
          <div style="padding:0 .2em">
            <div style="font-size:.6em;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:${COR.vermelho};margin-bottom:.4em">E ${esc(s.quem || c.personagem || 'no caso')}?</div>
            ${lista(s.analise).map(p => `<p style="font-weight:500;line-height:1.3;color:${t.txt};margin-bottom:.4em">${rico(p, t.caixa)}</p>`).join('')}
          </div>
        </div>
      </div>
      <div style="position:absolute;left:0;right:0;bottom:0;height:250px;background:${v.cor};display:flex;align-items:center;justify-content:space-between;padding:0 96px 40px;z-index:6">
        <div style="${TITULO};font-size:110px;line-height:1;color:#fff">${v.marca} ${esc(s.rotulo || v.rotulo)}</div>
        <div style="${TEXTO};font-size:26px;font-weight:600;letter-spacing:.08em;color:#fff;align-self:flex-end;margin-bottom:24px">@liberofilho</div>
      </div>
      ${objeto(ctx, s.objeto)}`;
  },
  // Virada: "e se…?" num bloco sólido e a resposta embaixo.
  virada(s, t, ctx) {
    return `${anel(760, -200, 440)}
      <div style="position:absolute;left:96px;right:96px;top:170px;bottom:190px;display:flex;flex-direction:column;justify-content:center;gap:44px;z-index:4">
        ${kick(s.kicker || 'Plot twist', t.kicker)}
        <div><span data-fit="${esc(lista(s.titulo).join(' '))}" style="display:inline-block;background:${t.escuro ? '#fff' : COR.azul};color:${t.escuro ? COR.azul : '#fff'};${TITULO};font-size:${s.ts || 120}px;line-height:1;padding:.14em .24em .06em">${linhas(s.titulo)}</span></div>
        ${lista(s.texto).map(p => `<p style="${TEXTO};font-size:${s.corpo || 42}px;font-weight:500;line-height:1.3;color:${t.txt}">${rico(p, t.caixa)}</p>`).join('')}
      </div>${objeto(ctx, s.objeto)}${rodape(t.txt)}`;
  },
  // Checklist: todos os requisitos com a marca e o veredito final carimbado.
  checklist(s, t) {
    return `<div style="position:absolute;left:96px;right:96px;top:140px;bottom:170px;display:flex;flex-direction:column;gap:30px">
      ${kick(s.kicker || 'Resultado da análise', t.kicker)}
      <div style="${TITULO};font-size:${s.ts || 120}px;line-height:.9;color:${t.tit}">${linhas(s.titulo, t.caixa)}</div>
      <div data-fit="checklist" data-min="22" style="flex:1;min-height:0;overflow:hidden;${TEXTO};font-size:${s.corpo || 44}px;display:flex;flex-direction:column;gap:.55em">
        ${lista(s.itens).map(i => `<div style="display:flex;gap:.6em;align-items:center">${caixa(i.v, 58, t.escuro ? 'transparent' : '#fff')}
          <div style="font-weight:600;line-height:1.2;color:${t.txt}">${rico(i.t, t.caixa)}${i.art ? `<br><span style="font-size:.62em;font-weight:700;color:${t.escuro ? COR.azulClaro : COR.azul}">${esc(i.art)}</span>` : ''}</div></div>`).join('')}
      </div>
    </div>
    ${s.selo ? carimbo(s.selo, s.seloX ?? 620, s.seloY ?? 180, -6, s.seloTam || 78) : ''}${rodape(t.txt)}`;
  },
  // CTA: foto do autor no crachá "candidato", pergunta e botão.
  cta(s, t, ctx) {
    const f = s.foto ? ctx.foto(s.foto) : '';
    return `${f ? `<div style="position:absolute;right:96px;top:110px;width:400px;background:#fff;border-radius:24px;padding:20px 20px 26px;transform:rotate(3deg);box-shadow:0 30px 50px rgba(0,0,0,.35);z-index:6">
        <div style="height:380px;border-radius:14px;background:url('${f}') center 22%/cover"></div>
        <div style="${TITULO};font-size:54px;line-height:1;color:${COR.azul};margin-top:18px">${esc(s.cracha || 'Candidato aprovado')}</div>
        <div style="margin-top:10px;display:flex;align-items:center;gap:12px;${TEXTO};font-size:24px;font-weight:700;color:${COR.navy}">${caixa('sim', 44, '#fff')} Todos os requisitos</div></div>` : ''}
      <div style="position:absolute;left:96px;right:96px;top:${f ? 750 : 300}px;bottom:150px;display:flex;flex-direction:column;gap:28px;z-index:7">
        <div data-fit="${esc(lista(s.titulo).join(' '))}" data-min="60" style="flex:none;${TITULO};font-size:${s.ts || 110}px;line-height:.92;padding-top:.06em;color:${t.tit};max-height:220px;overflow:hidden">${linhas(s.titulo, t.caixa)}</div>
        ${s.texto ? `<p style="${TEXTO};font-size:38px;font-weight:500;line-height:1.3;color:${t.txt};max-width:800px">${rico(s.texto)}</p>` : ''}
        ${s.botao ? `<div><span style="display:inline-block;background:${t.escuro ? '#fff' : COR.azul};color:${t.escuro ? COR.azul : '#fff'};${TEXTO};font-size:34px;font-weight:800;padding:22px 44px;border-radius:999px">${esc(s.botao)}</span></div>` : ''}
      </div>${objeto(ctx, s.objeto)}${rodape(t.txt)}`;
  },
};

export function renderCarrossel(c, ctx) {
  const avisos = [];
  const slides = (c.slides || []).map((s, i) => {
    const t = TEMAS[s.tema] || TEMAS.blue;
    const f = TIPOS[s.tipo];
    if (!f) avisos.push(`slide ${i + 1}: tipo "${s.tipo}" não existe (${Object.keys(TIPOS).join(', ')})`);
    return { bg: t.bg, escuro: t.escuro, html: f ? f(s, t, ctx, c) : '' };
  });
  return { html: pagina(slides), total: slides.length, avisos };
}

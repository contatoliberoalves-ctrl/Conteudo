// Molde "Libero Requisitos" (@liberofilho), slides de AULA 1920×1080: "fulano poderia ser X?" checado
// requisito por requisito, como uma ficha de candidatura. Capa com a pergunta e o carimbo EM ANÁLISE, a lei
// literal, um slide por requisito (caixa ✔/✘/?, o que a CF diz e a análise do caso, com a faixa do
// veredito), a virada ("e se…?"), o checklist com o carimbo final e o fechamento. A versão de post
// (1080×1350) é o visual "requisitos" do Carrossel Libero. Identidade do Carrossel Libero (libero-comum/identidade.mjs).
import { COR, TEMAS, TITULO, TEXTO, esc, lista, rico, linhas, rodape, anel, objeto, pagina } from '../libero-comum/identidade.mjs';

const W = 1920, H = 1080;
// Veredito: sim (cumpre), nao (não cumpre) ou talvez (depende / ainda não).
const VER = {
  sim: { marca: '✔', cor: COR.azul, rotulo: 'Cumpre' },
  nao: { marca: '✘', cor: COR.vermelho, rotulo: 'Não cumpre' },
  talvez: { marca: '?', cor: '#F2A516', rotulo: 'Depende' },
};
const ver = v => VER[v] || VER.talvez;
const kick = (txt, cor) => txt ? `<div style="${TEXTO};font-size:28px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${cor}">${esc(txt)}</div>` : '';
const caixa = (v, tam, fundo) => `<div style="width:${tam}px;height:${tam}px;flex:none;border:${Math.round(tam * .07)}px solid ${ver(v).cor};border-radius:${Math.round(tam * .14)}px;background:${fundo};display:flex;align-items:center;justify-content:center;color:${ver(v).cor};font-size:${Math.round(tam * .7)}px;font-weight:800;line-height:1;${TEXTO}">${ver(v).marca}</div>`;
const carimbo = (txt, x, y, rot, px = 110, cor = COR.vermelho) => `<div style="position:absolute;left:${x}px;top:${y}px;transform:rotate(${rot}deg);border:9px solid ${cor};color:${cor};${TITULO};font-size:${px}px;line-height:1;padding:.12em .3em .02em;z-index:14;opacity:.94;outline:4px solid ${cor};outline-offset:6px;white-space:nowrap">${esc(txt)}</div>`;
const rod = t => rodape(t.txt).replace('left:96px', 'left:120px').replace('bottom:64px', 'bottom:50px');

const TIPOS = {
  // Capa: pergunta gigante à esquerda, personagem 3D à direita e o carimbo EM ANÁLISE.
  capa(s, t, ctx) {
    return `${anel(1640, -230, 460)}
      <div style="position:absolute;left:120px;top:120px;width:1150px;display:flex;flex-direction:column;gap:34px;z-index:6">
        ${kick(s.kicker || 'Ficha de candidatura', t.kicker)}
        <div data-fit="${esc(lista(s.titulo).join(' '))}" data-min="80" style="${TITULO};font-size:${s.ts || 190}px;line-height:1.02;padding-top:.06em;color:${t.tit};max-height:640px;overflow:hidden">${linhas(s.titulo, t.escuro ? '#fff' : COR.azul, t.escuro ? COR.azul : '#fff')}</div>
        ${s.texto ? `<p style="${TEXTO};font-size:44px;font-weight:500;line-height:1.28;color:${t.txt}">${rico(s.texto)}</p>` : ''}
      </div>
      ${carimbo(s.selo || 'Em análise', 1350, 860, -6, 90)}
      ${objeto(ctx, s.objeto && { x: 1300, y: 200, tam: 560, rot: -8, ...s.objeto })}`;
  },
  // Lei: título e tradução à esquerda; o dispositivo copiado literalmente num cartão à direita.
  lei(s, t) {
    return `<div style="position:absolute;left:120px;top:150px;bottom:150px;width:620px;display:flex;flex-direction:column;justify-content:center;gap:34px">
        ${kick(s.kicker, t.kicker)}
        <div style="${TITULO};font-size:${s.ts || 116}px;line-height:.9;color:${t.tit}">${linhas(s.titulo, t.caixa)}</div>
        ${s.traducao ? `<div data-fit="traducao" data-min="24" style="${TEXTO};font-size:42px;font-weight:600;line-height:1.28;color:${t.txt};max-height:240px;overflow:hidden">${rico(s.traducao, t.caixa)}</div>` : ''}
      </div>
      <div style="position:absolute;left:820px;right:120px;top:110px;bottom:130px;background:#fff;border-left:18px solid ${COR.azul};padding:44px 52px;box-shadow:0 20px 40px rgba(0,0,0,.12);display:flex;flex-direction:column">
        ${s.ref ? `<div style="${TEXTO};font-size:28px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:${COR.vermelho};margin-bottom:20px">${esc(s.ref)}</div>` : ''}
        <div data-fit="lei" data-min="22" style="flex:1;overflow:hidden;${TEXTO};font-size:${s.corpo || 40}px;font-weight:500;line-height:1.32;color:${COR.navy}">${lista(s.citacao).map(p => `<p style="margin-bottom:.35em">${rico(p)}</p>`).join('')}</div>
      </div>${rod(t)}`;
  },
  // Requisito: à esquerda a caixa marcada, o número e o título; à direita o que a CF diz e a análise;
  // faixa do veredito embaixo, na largura toda.
  requisito(s, t, ctx, c) {
    const v = ver(s.veredito);
    const cartao = t.escuro ? 'rgba(255,255,255,.08)' : '#fff';
    return `<div style="position:absolute;left:120px;top:110px;bottom:240px;width:620px;display:flex;flex-direction:column;justify-content:center;gap:30px">
        ${caixa(s.veredito, 200, cartao)}
        ${kick(s.numero ? `Requisito ${s.numero}` : s.kicker, t.kicker)}
        <div data-fit="${esc(lista(s.titulo).join(' '))}" data-min="60" style="${TITULO};font-size:${s.ts || 130}px;line-height:.92;padding-top:.08em;color:${t.tit};max-height:260px;overflow:hidden">${linhas(s.titulo, t.caixa)}</div>
      </div>
      <div data-fit="requisito" data-min="22" style="position:absolute;left:820px;right:120px;top:110px;bottom:240px;overflow:hidden;display:flex;flex-direction:column;justify-content:center;gap:.8em;${TEXTO};font-size:${s.corpo || 50}px">
        <div style="background:${cartao};padding:.8em .9em;border-radius:14px">
          <div style="font-size:.6em;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:${t.escuro ? COR.azulClaro : COR.azul};margin-bottom:.4em">O que a CF diz${s.artigo ? ` · ${esc(s.artigo)}` : ''}</div>
          <div style="font-weight:600;line-height:1.28;color:${t.escuro ? '#fff' : COR.navy}">${rico(s.regra, t.caixa)}</div>
        </div>
        <div style="padding:0 .2em">
          <div style="font-size:.6em;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:${COR.vermelho};margin-bottom:.4em">E ${esc(s.quem || c.personagem || 'no caso')}?</div>
          ${lista(s.analise).map(p => `<p style="font-weight:500;line-height:1.3;color:${t.txt};margin-bottom:.4em">${rico(p, t.caixa)}</p>`).join('')}
        </div>
      </div>
      <div style="position:absolute;left:0;right:0;bottom:0;height:190px;background:${v.cor};display:flex;align-items:center;justify-content:space-between;padding:0 120px;z-index:6">
        <div style="${TITULO};font-size:120px;line-height:1;padding-top:.08em;color:#fff">${v.marca} ${esc(s.rotulo || v.rotulo)}</div>
        <div style="${TEXTO};font-size:26px;font-weight:600;letter-spacing:.08em;color:#fff">@liberofilho</div>
      </div>
      ${objeto(ctx, s.objeto)}`;
  },
  // Virada: "e se…?" num bloco sólido à esquerda e a resposta à direita.
  virada(s, t, ctx) {
    return `${anel(-230, -230, 460)}
      <div style="position:absolute;left:120px;top:150px;bottom:150px;width:880px;display:flex;flex-direction:column;justify-content:center;gap:40px;z-index:4">
        ${kick(s.kicker || 'Plot twist', t.kicker)}
        <div><span data-fit="${esc(lista(s.titulo).join(' '))}" style="display:inline-block;background:${t.escuro ? '#fff' : COR.azul};color:${t.escuro ? COR.azul : '#fff'};${TITULO};font-size:${s.ts || 150}px;line-height:1;padding:.14em .24em .06em">${linhas(s.titulo)}</span></div>
      </div>
      <div style="position:absolute;left:1080px;right:120px;top:150px;bottom:150px;display:flex;flex-direction:column;justify-content:center;gap:34px;z-index:4">
        ${lista(s.texto).map(p => `<p style="${TEXTO};font-size:${s.corpo || 46}px;font-weight:500;line-height:1.3;color:${t.txt}">${rico(p, t.caixa)}</p>`).join('')}
      </div>${objeto(ctx, s.objeto)}${rod(t)}`;
  },
  // Checklist: título e carimbo final em cima; os requisitos com a marca em duas colunas.
  checklist(s, t) {
    return `<div style="position:absolute;left:120px;right:120px;top:100px;bottom:120px;display:flex;flex-direction:column;gap:40px">
      <div>${kick(s.kicker || 'Resultado da análise', t.kicker)}
      <div style="${TITULO};font-size:${s.ts || 130}px;line-height:.9;color:${t.tit};margin-top:10px">${linhas(s.titulo, t.caixa)}</div></div>
      <div data-fit="checklist" data-min="22" style="flex:1;min-height:0;overflow:hidden;${TEXTO};font-size:${s.corpo || 46}px;display:grid;grid-template-columns:1fr 1fr;align-content:start;gap:.7em 2em">
        ${lista(s.itens).map(i => `<div style="display:flex;gap:.6em;align-items:center">${caixa(i.v, 64, t.escuro ? 'transparent' : '#fff')}
          <div style="font-weight:600;line-height:1.2;color:${t.txt}">${rico(i.t, t.caixa)}${i.art ? `<br><span style="font-size:.62em;font-weight:700;color:${t.escuro ? COR.azulClaro : COR.azul}">${esc(i.art)}</span>` : ''}</div></div>`).join('')}
      </div>
    </div>
    ${s.selo ? carimbo(s.selo, s.seloX ?? 1120, s.seloY ?? 110, -6, s.seloTam || 110) : ''}${rod(t)}`;
  },
  // Fechamento: foto do autor no crachá "candidato" à esquerda; pergunta e botão à direita.
  cta(s, t, ctx) {
    const f = s.foto ? ctx.foto(s.foto) : '';
    return `${f ? `<div style="position:absolute;left:180px;top:100px;width:500px;background:#fff;border-radius:24px;padding:22px 22px 28px;transform:rotate(-3deg);box-shadow:0 30px 50px rgba(0,0,0,.35);z-index:6">
        <div style="height:600px;border-radius:14px;background:url('${f}') center 22%/cover"></div>
        <div style="${TITULO};font-size:60px;line-height:1;color:${COR.azul};margin-top:18px">${esc(s.cracha || 'Candidato aprovado')}</div>
        <div style="margin-top:10px;display:flex;align-items:center;gap:12px;${TEXTO};font-size:26px;font-weight:700;color:${COR.navy}">${caixa('sim', 46, '#fff')} Todos os requisitos</div></div>` : ''}
      <div style="position:absolute;left:${f ? 820 : 120}px;right:160px;top:150px;bottom:150px;display:flex;flex-direction:column;justify-content:center;gap:36px;z-index:7">
        <div data-fit="${esc(lista(s.titulo).join(' '))}" data-min="60" style="flex:none;${TITULO};font-size:${s.ts || 150}px;line-height:.92;padding-top:.06em;color:${t.tit};max-height:420px;overflow:hidden">${linhas(s.titulo, t.caixa)}</div>
        ${s.texto ? `<p style="${TEXTO};font-size:44px;font-weight:500;line-height:1.3;color:${t.txt}">${rico(s.texto)}</p>` : ''}
        ${s.botao ? `<div><span style="display:inline-block;background:${t.escuro ? '#fff' : COR.azul};color:${t.escuro ? COR.azul : '#fff'};${TEXTO};font-size:38px;font-weight:800;padding:24px 50px;border-radius:999px">${esc(s.botao)}</span></div>` : ''}
      </div>${objeto(ctx, s.objeto)}${rod(t)}`;
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
  return { html: pagina(slides, W, H), total: slides.length, avisos, largura: W, altura: H };
}

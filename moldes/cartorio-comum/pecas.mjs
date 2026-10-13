// Peças 1080×1350 comuns ao carrossel e à tela única do cartório. Cada tipo recebe (s, f, ctx), onde
// s é o slide do dados.json, f o fundo (FUNDOS) e ctx = { pagina, total } (só no carrossel).
import { C, CAPS, CONTATO, DISPLAY, FUNDOS, PRATA, emblema, esc, lista, logo, rico } from './marca.mjs';

const M = 100; // margem lateral
const kicker = (s, f, centro = false) => s.kicker ? `<div style="display:flex;align-items:center;gap:22px;${centro ? 'justify-content:center' : ''}">
  <span style="width:70px;height:2px;background:${fio(f)}"></span>
  <span style="${CAPS};font-size:28px;color:${f.sub}">${esc(s.kicker)}</span>${centro ? `<span style="width:70px;height:2px;background:${fio(f)}"></span>` : ''}</div>` : '';
const titulo = (s, f, px, centro = false) => `<div class="${f.escuro ? 'prataV' : ''}" style="${DISPLAY};font-size:${s.ts || px}px;line-height:1.04;${f.escuro ? '' : `color:${f.tit};`}${centro ? 'text-align:center;' : ''}">${rico(s.titulo, f)}</div>`;
const corpo = (t, f, px = 40) => `<p style="font-size:${px}px;line-height:1.42;color:${f.txt}">${rico(t, f)}</p>`;
const area = (html, { top = 120, bottom = 210, extra = '' } = {}) => `<div data-cabe style="position:absolute;left:${M}px;right:${M}px;top:${top}px;bottom:${bottom}px;display:flex;flex-direction:column;gap:34px;overflow:hidden;${extra}">${html}</div>`;

// Rodapé: emblema pequeno + nome; número da página à direita no carrossel.
export const rodape = (f, ctx = {}) => `<div style="position:absolute;left:${M}px;right:${M}px;bottom:70px;display:flex;align-items:center;gap:22px">
  ${emblema(76)}<div style="${CAPS};font-size:22px;line-height:1.5;color:${f.sub}">Cartório<br>Curral Queimado</div>
  ${ctx.total ? `<div style="margin-left:auto;font-family:'Cormorant Garamond';font-weight:600;font-size:34px;color:${f.sub}">${String(ctx.pagina).padStart(2, '0')} <span style="opacity:.5">/ ${String(ctx.total).padStart(2, '0')}</span></div>` : ''}</div>`;

// No carvão o marcador é prata com ✓ escuro; no papel, carvão com ✓ prata (o prata some no claro).
const marcador = f => f.escuro
  ? `<span style="flex:none;width:44px;height:44px;margin-top:6px;border-radius:8px;background:${PRATA};display:flex;align-items:center;justify-content:center;color:${C.carvao};font:700 26px/1 Jost">✓</span>`
  : `<span style="flex:none;width:44px;height:44px;margin-top:6px;border-radius:8px;background:${C.carvao};display:flex;align-items:center;justify-content:center;font:700 26px/1 Jost"><span class="prataV">✓</span></span>`;
const fio = f => f.escuro ? PRATA : 'linear-gradient(90deg,#5E5D58,#B9B7B0)';
const itens = (s, f) => `<div style="display:flex;flex-direction:column;gap:26px">${lista(s.itens).map(it => {
  const o = typeof it === 'string' ? { texto: it } : it;
  return `<div style="display:flex;gap:26px;align-items:flex-start">${marcador(f)}<div style="font-size:${s.corpo || 38}px;line-height:1.36;color:${f.txt}">${rico(o.texto, f)}${o.obs ? `<span style="${CAPS};font-size:22px;color:${f.sub};margin-left:14px;white-space:nowrap">${esc(o.obs)}</span>` : ''}</div></div>`;
}).join('')}</div>`;

const contatoLinhas = (f, px = 34) => [['Endereço', CONTATO.endereco.join('\n')], ['Telefone e WhatsApp', CONTATO.telefone], ['Agendamento on-line', CONTATO.site]]
  .map(([r, v]) => `<div style="display:flex;flex-direction:column;gap:6px;padding-bottom:20px;border-bottom:1px solid ${f.linha}"><span style="${CAPS};font-size:22px;color:${f.sub}">${r}</span><span style="font-size:${px}px;line-height:1.3;color:${f.txt};white-space:pre-line">${esc(v)}</span></div>`).join('');

const vinheta = f => f.escuro ? `<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 30%,rgba(255,255,255,.07),transparent 60%)"></div>` : '';

export const TIPOS = {
  // Capa no carvão: emblema, kicker, título em prata e linha do cartório no pé.
  capa: (s, f) => `${vinheta(f)}<div style="position:absolute;left:0;right:0;top:120px;display:flex;justify-content:center">${emblema(330)}</div>
    ${area(`${kicker(s, f, true)}${titulo(s, f, 112, true)}${s.texto ? `<div style="text-align:center">${corpo(s.texto, f, 38)}</div>` : ''}`, { top: 500, bottom: 200, extra: 'justify-content:center' })}
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:80px;display:flex;align-items:center;gap:24px"><span style="flex:1;height:2px;background:${PRATA}"></span><span style="${CAPS};font-size:24px;color:${f.sub}">Cartório · Curral Queimado</span><span style="flex:1;height:2px;background:${PRATA}"></span></div>`,
  // Texto curto ganha letra maior para não sobrar página vazia.
  texto: (s, f, ctx) => { const curto = lista(s.texto).join(' ').length < 230; return `${vinheta(f)}${area(`${kicker(s, f)}${titulo(s, f, curto ? 104 : 92)}${lista(s.texto).map(t => corpo(t, f, s.corpo || (curto ? 48 : 40))).join('')}`, { extra: 'justify-content:center' })}${rodape(f, ctx)}`; },
  lista: (s, f, ctx) => `${vinheta(f)}${area(`${kicker(s, f)}${titulo(s, f, 88)}${itens(s, f)}${s.nota ? `<div style="font-size:30px;line-height:1.4;color:${f.sub};border-left:3px solid ${f.escuro ? '#BDBDBD' : '#5E5D58'};padding-left:22px">${rico(s.nota, f)}</div>` : ''}`, { extra: 'justify-content:center' })}${rodape(f, ctx)}`,
  passos: (s, f, ctx) => `${vinheta(f)}${area(`${kicker(s, f)}${titulo(s, f, 88)}<div style="display:flex;flex-direction:column;gap:30px">${lista(s.itens).map((t, i) => `<div style="display:flex;gap:30px;align-items:center"><span style="flex:none;width:86px;height:86px;border-radius:50%;background:${f.escuro ? PRATA : C.carvao};display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond';font-weight:700;font-size:50px;${f.escuro ? `color:${C.carvao}` : ''}"><span class="${f.escuro ? '' : 'prataV'}">${i + 1}</span></span><span style="font-size:${s.corpo || 38}px;line-height:1.36;color:${f.txt}">${rico(t, f)}</span></div>`).join('')}</div>`, { extra: 'justify-content:center' })}${rodape(f, ctx)}`,
  // Número ou valor em destaque (ex.: R$ 323,64), com rótulo e texto.
  destaque: (s, f, ctx) => `${vinheta(f)}${area(`${kicker(s, f, true)}${s.titulo ? titulo(s, f, 72, true) : ''}
    ${lista(s.numeros || [{ valor: s.valor, rotulo: s.rotulo }]).map(n => `<div style="display:flex;flex-direction:column;align-items:center;gap:10px"><div class="${f.escuro ? 'prataV' : ''}" style="${DISPLAY};font-weight:700;font-size:${s.tv || 170}px;line-height:1;${f.escuro ? '' : `color:${f.tit}`}">${esc(n.valor)}</div><div style="${CAPS};font-size:28px;color:${f.sub};text-align:center">${esc(n.rotulo)}</div></div>`).join(`<span style="width:120px;height:2px;align-self:center;background:${PRATA}"></span>`)}
    ${lista(s.texto).map(t => `<div style="text-align:center">${corpo(t, f, 34)}</div>`).join('')}`, { extra: 'justify-content:center;align-items:stretch' })}${rodape(f, ctx)}`,
  // Fechamento: chamada, contatos e o logo em texto.
  cta: (s, f) => `${vinheta(f)}${area(`${kicker(s, f)}${titulo(s, f, 84)}${s.texto ? corpo(s.texto, f, 36) : ''}<div style="display:flex;flex-direction:column;gap:20px;margin-top:6px">${contatoLinhas(f)}</div>`, { top: 110, bottom: 330 })}
    <div style="position:absolute;left:0;right:0;bottom:80px;display:flex;justify-content:center">${logo(118, { comEmblema: false })}</div>`,
  // Tela única: comunicado com selo, título, texto e contato no pé.
  aviso: (s, f) => `${vinheta(f)}<div style="position:absolute;left:0;right:0;top:110px;display:flex;justify-content:center">${emblema(250)}</div>
    ${area(`<div style="display:flex;justify-content:center"><span style="${CAPS};font-size:26px;color:${f.escuro ? '#EDEDED' : f.tit};padding:14px 34px 10px;border:2px solid #BDBDBD;border-radius:999px">${esc(s.selo || 'Comunicado')}</span></div>${titulo(s, f, 100, true)}${lista(s.texto).map(t => `<div style="text-align:center">${corpo(t, f, 38)}</div>`).join('')}${s.valor ? `<div class="${f.escuro ? 'prataV' : ''}" style="${DISPLAY};font-weight:700;font-size:150px;line-height:1;text-align:center;${f.escuro ? '' : `color:${f.tit}`}">${esc(s.valor)}</div>` : ''}`, { top: 410, bottom: 200, extra: 'justify-content:center' })}
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:72px;display:flex;justify-content:center;gap:40px;${CAPS};font-size:24px;color:${f.sub}"><span>${esc(CONTATO.telefone)}</span><span style="opacity:.5">|</span><span>${esc(CONTATO.site)}</span></div>`,
  // Tela única: frase grande em prata.
  frase: (s, f) => `${vinheta(f)}${area(`<div style="${DISPLAY};font-size:220px;line-height:.6;height:90px" class="prataV">“</div><div class="${f.escuro ? 'prataV' : ''}" style="${DISPLAY};font-style:italic;font-weight:500;font-size:${s.ts || 96}px;line-height:1.1;${f.escuro ? '' : `color:${f.tit}`}">${rico(s.texto, f)}</div>${s.autor ? `<div style="${CAPS};font-size:28px;color:${f.sub}">${esc(s.autor)}</div>` : ''}`, { extra: 'justify-content:center' })}${rodape(f)}`,
  // Tela única: o logo inteiro e os contatos.
  contato: (s, f) => `${vinheta(f)}<div style="position:absolute;left:0;right:0;top:110px;display:flex;justify-content:center">${logo(150)}</div>
    ${area(`${s.titulo ? titulo(s, f, 64, true) : ''}<div style="display:flex;flex-direction:column;gap:20px">${contatoLinhas(f, 32)}</div>`, { top: 790, bottom: 70 })}`,
};

export const fundoPadrao = { capa: 'carvao', destaque: 'carvao', cta: 'carvao', aviso: 'carvao', frase: 'carvao', contato: 'carvao' };
export const peca = (s, ctx) => {
  const f = FUNDOS[s.fundo] || FUNDOS[fundoPadrao[s.tipo] || 'papel'];
  return `<div style="position:absolute;inset:0;background:${f.bg}"></div>${(TIPOS[s.tipo] || TIPOS.texto)(s, f, ctx)}`;
};

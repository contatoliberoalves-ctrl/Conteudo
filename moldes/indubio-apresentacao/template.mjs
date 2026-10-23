// Molde "Indubio Apresentação" (agência Indubio Pro Marketing): apresentações de projeto em slides A4 horizontal
// (297×210 mm = 1123×794 px), na linha da agência: "chique, alto padrão", preto e branco com um dourado discreto,
// Montserrat (a fonte do logo, "indubio" + "Pro Marketing"). Prints de sites entram numa janela de navegador.
// renderApresentacao(a) devolve { html, total }; o render gera o PDF e um PNG por slide.

export const W = 1123, H = 794;
const COR = { preto: '#0E0E0F', grafite: '#1B1B1D', off: '#F6F5F1', papel: '#FFFFFF', ouro: '#B89A5E', ouroClaro: '#D9C18E', cinza: '#6E6C68', linha: '#E3E0D8' };
const M = "font-family:'Montserrat',sans-serif";
const FONTES = 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,500&display=swap';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
// **negrito**; _itálico fino_ (o toque elegante dos títulos).
const rico = (s, cor) => esc(s).replace(/\*\*(.+?)\*\*/g, `<b style="font-weight:700;color:${cor || 'inherit'}">$1</b>`).replace(/_(.+?)_/g, '<em style="font-weight:300">$1</em>');

const logo = (escuro, px = 30) => `<div style="${M};display:inline-flex;flex-direction:column;align-items:flex-end;line-height:1;color:${escuro ? '#fff' : COR.preto}">
  <span style="font-weight:700;font-size:${px}px;letter-spacing:-.02em">indubio</span><span style="font-weight:700;font-size:${Math.round(px * .36)}px;letter-spacing:.02em;margin-top:${Math.round(px * .06)}px;color:${escuro ? COR.ouroClaro : COR.ouro}">Pro Marketing</span></div>`;
const kicker = (t, escuro) => t ? `<div style="${M};display:flex;align-items:center;gap:12px;font-size:11px;font-weight:600;letter-spacing:.26em;text-transform:uppercase;color:${escuro ? COR.ouroClaro : COR.ouro}"><span style="width:28px;height:1.5px;background:currentColor"></span>${esc(t)}</div>` : '';
const titulo = (t, escuro, px = 40) => `<h1 style="margin:0;${M};font-weight:700;font-size:${px}px;line-height:1.08;letter-spacing:-.02em;color:${escuro ? '#fff' : COR.preto}">${lista(t).map(l => rico(l)).join('<br>')}</h1>`;
const par = (t, escuro, px = 14) => lista(t).map(p => `<p style="margin:0;${M};font-weight:400;font-size:${px}px;line-height:1.65;color:${escuro ? '#C9C7C2' : '#3C3B38'}">${rico(p, escuro ? '#fff' : COR.preto)}</p>`).join('');
// Janela de navegador com o print do site (endereço opcional na barra).
const janela = (src, w, h, url, pos = 'top', escuro) => `<div style="width:${w}px;border-radius:12px;overflow:hidden;background:${escuro ? '#2A2A2D' : '#fff'};box-shadow:0 30px 60px rgba(0,0,0,${escuro ? .5 : .16}),0 0 0 1px rgba(0,0,0,.06)">
  <div style="height:28px;display:flex;align-items:center;gap:6px;padding:0 12px;background:${escuro ? '#2A2A2D' : '#EFEDE8'}">${['#E0605A', '#E9B94B', '#5DBB63'].map(c => `<i style="width:9px;height:9px;border-radius:50%;background:${c}"></i>`).join('')}
    ${url ? `<span style="flex:1;margin-left:14px;height:16px;border-radius:8px;background:${escuro ? '#3A3A3E' : '#fff'};${M};font-size:9px;line-height:16px;color:${COR.cinza};padding:0 10px">${esc(url)}</span>` : ''}</div>
  <div style="height:${h}px;overflow:hidden;position:relative"><img src="${src}" style="display:block;width:100%;height:auto;position:absolute;left:0;${pos === 'bottom' ? 'bottom:0' : 'top:0'}"></div></div>`;
const rodape = (n, escuro, marca) => `<div style="position:absolute;left:64px;right:64px;bottom:28px;display:flex;justify-content:space-between;align-items:center;${M};font-size:9.5px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:${escuro ? '#8E8C87' : COR.cinza}"><span>${esc(marca)}</span><span>${String(n).padStart(2, '0')}</span></div>`;

const TIPOS = {
  // Capa: fundo preto, logo da agência, kicker, título do projeto, texto e a janela com o print principal.
  capa(s, a) {
    return { escuro: true, html: `<div style="position:absolute;inset:0;background:radial-gradient(90% 90% at 85% 30%,#2A2622 0%,${COR.preto} 60%)"></div>
      <div style="position:absolute;left:64px;top:52px">${logo(true, 26)}</div>
      <div style="position:absolute;left:64px;top:0;bottom:0;width:400px;display:flex;flex-direction:column;justify-content:center;gap:22px">
        ${kicker(s.kicker, true)}${titulo(s.titulo, true, s.ts || 46)}${par(s.texto, true, 14)}
        ${s.cliente ? `<div style="${M};font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:#8E8C87;margin-top:8px">${esc(s.cliente)}</div>` : ''}</div>
      <div style="position:absolute;right:56px;top:50%;transform:translateY(-50%)">${janela(s.print, 560, 350, s.url, s.pos, true)}</div>
      <div style="position:absolute;left:64px;bottom:40px;width:60px;height:2px;background:${COR.ouro}"></div>` };
  },
  // Texto: título à esquerda, parágrafos e até 4 pilares numerados em cartões.
  texto(s) {
    const e = !!s.escuro;
    return { escuro: e, html: `<div style="position:absolute;inset:0;background:${e ? COR.preto : COR.off}"></div>
      <div style="position:absolute;left:64px;top:70px;width:440px;display:flex;flex-direction:column;gap:20px">${kicker(s.kicker, e)}${titulo(s.titulo, e, s.ts || 38)}${par(s.texto, e)}</div>
      <div style="position:absolute;right:64px;top:70px;bottom:90px;width:470px;display:flex;flex-direction:column;justify-content:center;gap:14px">
        ${lista(s.pilares).map((p, i) => `<div style="display:flex;gap:20px;align-items:flex-start;padding:20px 22px;background:${e ? COR.grafite : '#fff'};border:1px solid ${e ? '#2C2C2F' : COR.linha};border-radius:10px">
          <span style="${M};font-weight:300;font-size:30px;line-height:1;color:${COR.ouro};width:40px;flex:none">${String(i + 1).padStart(2, '0')}</span>
          <div><div style="${M};font-weight:700;font-size:15px;color:${e ? '#fff' : COR.preto};margin-bottom:5px">${esc(p.t)}</div><div style="${M};font-size:12px;line-height:1.55;color:${e ? '#B7B5B0' : COR.cinza}">${rico(p.d)}</div></div></div>`).join('')}
      </div>` };
  },
  // Tela: print do site numa janela grande + coluna com kicker, título e destaques (lado "esquerda" ou "direita").
  tela(s) {
    const e = !!s.escuro, dir = s.lado === 'direita';
    const col = `<div style="position:absolute;${dir ? 'right' : 'left'}:64px;top:0;bottom:70px;width:300px;display:flex;flex-direction:column;justify-content:center;gap:18px">
        ${kicker(s.kicker, e)}${titulo(s.titulo, e, s.ts || 30)}${par(s.texto, e, 12.5)}
        ${lista(s.itens).length ? `<div style="display:flex;flex-direction:column;gap:9px;margin-top:4px">${lista(s.itens).map(t => `<div style="display:flex;gap:10px;align-items:flex-start;${M};font-size:12px;line-height:1.45;color:${e ? '#E2E0DB' : '#2A2927'}"><span style="width:5px;height:5px;margin-top:6px;border-radius:50%;background:${COR.ouro};flex:none"></span><span>${rico(t)}</span></div>`).join('')}</div>` : ''}</div>`;
    return { escuro: e, html: `<div style="position:absolute;inset:0;background:${e ? COR.preto : COR.off}"></div>${col}
      <div style="position:absolute;${dir ? 'left' : 'right'}:56px;top:${s.janelaY || 120}px">${janela(s.print, 640, s.h || 400, s.url, s.pos, e)}</div>` };
  },
  // Dupla: duas telas sobrepostas (a segunda um pouco abaixo e à frente) + coluna de texto.
  dupla(s) {
    const e = !!s.escuro, dir = s.lado === 'direita';
    const [a, b] = lista(s.prints);
    return { escuro: e, html: `<div style="position:absolute;inset:0;background:${e ? COR.preto : COR.off}"></div>
      <div style="position:absolute;${dir ? 'right' : 'left'}:64px;top:0;bottom:70px;width:290px;display:flex;flex-direction:column;justify-content:center;gap:18px">
        ${kicker(s.kicker, e)}${titulo(s.titulo, e, s.ts || 30)}${par(s.texto, e, 12.5)}
        ${lista(s.itens).length ? `<div style="display:flex;flex-direction:column;gap:9px;margin-top:4px">${lista(s.itens).map(t => `<div style="display:flex;gap:10px;align-items:flex-start;${M};font-size:12px;line-height:1.45;color:${e ? '#E2E0DB' : '#2A2927'}"><span style="width:5px;height:5px;margin-top:6px;border-radius:50%;background:${COR.ouro};flex:none"></span><span>${rico(t)}</span></div>`).join('')}</div>` : ''}</div>
      <div style="position:absolute;${dir ? 'left' : 'right'}:${dir ? 40 : 150}px;top:56px">${janela(a, 520, 325, null, 'top', e)}</div>
      <div style="position:absolute;${dir ? 'left' : 'right'}:${dir ? 170 : 40}px;top:330px">${janela(b, 520, 325, null, 'top', e)}</div>` };
  },
  // Trio: três telas lado a lado com legenda (ex.: o mesmo painel para cada perfil).
  trio(s) {
    const e = !!s.escuro;
    return { escuro: e, html: `<div style="position:absolute;inset:0;background:${e ? COR.preto : COR.off}"></div>
      <div style="position:absolute;left:64px;top:56px;width:760px;display:flex;flex-direction:column;gap:14px">${kicker(s.kicker, e)}${titulo(s.titulo, e, s.ts || 30)}${par(s.texto, e, 12.5)}</div>
      <div style="position:absolute;left:64px;right:64px;top:${s.telasY || 270}px;display:grid;grid-template-columns:repeat(3,1fr);gap:20px">
        ${lista(s.telas).map(t => `<div style="display:flex;flex-direction:column;gap:14px">${janela(t.print, 311, 195, null, 'top', e)}
          <div><div style="${M};font-weight:700;font-size:14px;color:${e ? '#fff' : COR.preto}">${esc(t.t)}</div><div style="${M};font-size:11.5px;line-height:1.55;color:${e ? '#B7B5B0' : COR.cinza};margin-top:4px">${rico(t.d)}</div></div></div>`).join('')}
      </div>` };
  },
  // Recursos: grade de cartões com ícone simples (para a área de membros e outras funções sem print).
  recursos(s) {
    const e = !!s.escuro;
    const ic = { aviso: '<path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6zM9.5 19a2.5 2.5 0 0 0 5 0"/>', video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3"/>', livro: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 5v16"/>', chave: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3"/>', escudo: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>', tela: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>', celular: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>', paleta: '<circle cx="12" cy="12" r="9"/><circle cx="8" cy="10" r="1.2"/><circle cx="12" cy="7.5" r="1.2"/><circle cx="16" cy="10" r="1.2"/>' };
    return { escuro: e, html: `<div style="position:absolute;inset:0;background:${e ? COR.preto : COR.off}"></div>
      <div style="position:absolute;left:64px;top:62px;width:${s.larguraTitulo || 620}px;display:flex;flex-direction:column;gap:16px">${kicker(s.kicker, e)}${titulo(s.titulo, e, s.ts || 34)}${par(s.texto, e, 13)}</div>
      <div style="position:absolute;left:64px;right:64px;top:${s.cardsY || 300}px;display:grid;grid-template-columns:repeat(${s.colunas || 3},1fr);gap:16px">
        ${lista(s.cards).map(c => `<div style="padding:24px 22px;background:${e ? COR.grafite : '#fff'};border:1px solid ${e ? '#2C2C2F' : COR.linha};border-radius:10px;display:flex;flex-direction:column;gap:10px;min-height:150px">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${COR.ouro}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ic[c.icone] || ic.livro}</svg>
          <div style="${M};font-weight:700;font-size:14px;color:${e ? '#fff' : COR.preto}">${esc(c.t)}</div>
          <div style="${M};font-size:11.5px;line-height:1.55;color:${e ? '#B7B5B0' : COR.cinza}">${rico(c.d)}</div></div>`).join('')}
      </div>` };
  },
  // Níveis de acesso: faixas em escada (associados, diretoria, presidência).
  niveis(s) {
    const n = lista(s.niveis);
    return { escuro: true, html: `<div style="position:absolute;inset:0;background:${COR.preto}"></div>
      <div style="position:absolute;left:64px;top:0;bottom:70px;width:400px;display:flex;flex-direction:column;justify-content:center;gap:18px">${kicker(s.kicker, true)}${titulo(s.titulo, true, s.ts || 34)}${par(s.texto, true, 13)}</div>
      <div style="position:absolute;right:64px;top:0;bottom:70px;width:500px;display:flex;flex-direction:column;justify-content:center;gap:12px">
        <div style="display:flex;align-items:center;gap:12px;padding:16px 20px;border:1px solid ${COR.ouro};border-radius:10px;${M};color:#fff"><svg viewBox="0 0 24 24" width="22" fill="none" stroke="${COR.ouroClaro}" stroke-width="1.6"><circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3"/></svg><b style="font-size:14px">${esc(s.login || 'Login único')}</b><span style="font-size:11.5px;color:#B7B5B0;margin-left:auto">${esc(s.loginTexto || '')}</span></div>
        ${n.map((x, i) => `<div style="margin-left:${i * 36}px;padding:16px 20px;background:${['#1B1B1D', '#232120', '#2C2823'][i] || COR.grafite};border-left:3px solid ${COR.ouro};border-radius:8px;${M}">
          <div style="font-weight:700;font-size:14px;color:#fff">${esc(x.t)}</div><div style="font-size:11.5px;line-height:1.5;color:#B7B5B0;margin-top:3px">${rico(x.d)}</div></div>`).join('')}
      </div>` };
  },
  // Encerramento: logo grande, frase e assinatura.
  fim(s) {
    return { escuro: true, html: `<div style="position:absolute;inset:0;background:radial-gradient(80% 80% at 50% 40%,#2A2622 0%,${COR.preto} 65%)"></div>
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px;text-align:center">
        ${logo(true, 64)}<div style="width:60px;height:2px;background:${COR.ouro}"></div>
        ${titulo(s.titulo, true, s.ts || 30)}${par(s.texto, true, 13)}</div>` };
  },
};

export function renderApresentacao(a) {
  const paginas = lista(a.slides).map((s, i) => {
    const { escuro, html } = (TIPOS[s.tipo] || TIPOS.texto)(s, a);
    return `<section class="slide">${html}${s.tipo === 'capa' || s.tipo === 'fim' ? '' : rodape(i + 1, escuro, a.marca || 'Indubio Pro Marketing')}</section>`;
  });
  return { total: paginas.length, html: `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet">
<style>@page{size:297mm 210mm;margin:0}*{box-sizing:border-box}html,body{margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}i{display:block}
.slide{position:relative;width:${W}px;height:${H}px;overflow:hidden;break-after:page}.slide:last-child{break-after:auto}</style></head>
<body>${paginas.join('\n')}</body></html>` };
}

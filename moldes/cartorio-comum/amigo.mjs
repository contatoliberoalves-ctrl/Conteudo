// Identidade "Cartório Amigo": a versão para a população de Curral Queimado. Mantém o emblema da pena,
// mas troca o carvão e a prata por cores quentes do sertão (creme, barro, sol, céu e caatinga), letra
// arredondada (Baloo 2 + Nunito) e capas com foto (feita em IA) ou ilustração do sertão com um ícone.
// Peças 1080×1350 usadas pelo cartorio-amigo-carrossel e pelo cartorio-amigo-post.
import fs from 'node:fs';
import path from 'node:path';
import { CONTATO, emblema, esc, lista } from './marca.mjs';

export const A = {
  creme: '#FFF5E4', areia: '#F6E2C2', tinta: '#2B2019', suave: '#6E5E52',
  barro: '#D2552B', sol: '#F5B323', ceu: '#2B7FA8', verde: '#4C8A3E', rosa: '#E07A8B', branco: '#FFFFFF',
};
// Cor de fundo da capa/fechamento e a cor de apoio (ilustração e destaques).
export const CORES = {
  barro: { bg: A.barro, claro: '#F7C9A8', escuro: '#8E3214' },
  ceu: { bg: A.ceu, claro: '#BFE3F2', escuro: '#164E69' },
  verde: { bg: A.verde, claro: '#CFE7B8', escuro: '#2B5422' },
  sol: { bg: A.sol, claro: '#FFE7A3', escuro: '#8A5A00' },
};
const ROD = [A.barro, A.ceu, A.verde, A.sol]; // cores que se alternam nos números e cartões

export const HEAD_AMIGO = `<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@500;600;700;800;900&display=swap" rel="stylesheet"><style>body{font-family:Nunito,sans-serif}</style>`;
const TIT = "font-family:'Baloo 2',sans-serif;font-weight:800;letter-spacing:-.01em";

// Texto rico: **negrito** e [[destaque]] (faixa amarela; na capa colorida, faixa amarela com letra escura).
export const rico = (s, marca = A.sol, letra = A.tinta) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b style="font-weight:800">$1</b>')
  .replace(/\[\[(.+?)\]\]/g, `<span style="background:linear-gradient(transparent 12%,${marca} 12%,${marca} 94%,transparent 94%);color:${letra};padding:0 .12em;box-decoration-break:clone;-webkit-box-decoration-break:clone">$1</span>`);

// Ícones simples (traço), em viewBox 24.
const IC = {
  documento: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M9.5 12h6M9.5 15h6M9.5 18h4"/>',
  caneta: '<path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/><path d="M4 20h16"/>',
  bebe: '<circle cx="12" cy="11" r="6.5"/><path d="M9.5 10.5h.01M14.5 10.5h.01"/><path d="M10 14c1.2 1 2.8 1 4 0"/><path d="M12 4.5c-1-1.5 1-2.5 1.5-1.2"/>',
  aliancas: '<circle cx="9" cy="14" r="5"/><circle cx="15" cy="14" r="5"/><path d="M10 6l2-3 2 3"/>',
  casa: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  calendario: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M8 14h3v3H8z"/>',
  lupa: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/>',
  coracao: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
  pergunta: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7v.5"/><path d="M12 17h.01"/>',
  relogio: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  celular: '<rect x="7" y="2.5" width="10" height="19" rx="2.2"/><path d="M11 18.5h2"/>',
  familia: '<circle cx="8" cy="7" r="2.5"/><circle cx="16" cy="7" r="2.5"/><circle cx="12" cy="13" r="2"/><path d="M4 20v-4a4 4 0 0 1 8 0M12 20v-4a4 4 0 0 1 8 0"/>',
};
export const icone = (nome, px, cor, traco = 2) => `<svg viewBox="0 0 24 24" width="${px}" height="${px}" fill="none" stroke="${cor}" stroke-width="${traco}" stroke-linecap="round" stroke-linejoin="round" style="display:block">${IC[nome] || IC.documento}</svg>`;

// Foto da capa: arquivo em <molde>/fotos/ (imagem feita em IA). Devolve data URI ou null.
export const foto = (root, arq) => {
  if (!arq) return null;
  const p = path.join(root, arq);
  if (!fs.existsSync(p)) return null;
  const ext = path.extname(p).slice(1).toLowerCase().replace('jpg', 'jpeg');
  return `data:image/${ext};base64,` + fs.readFileSync(p).toString('base64');
};

// Ilustração do sertão (céu, sol, serras, mandacaru e uma casinha) com o ícone num círculo branco.
export const sertao = (w, h, cor, ic) => {
  const c = CORES[cor] || CORES.barro;
  return `<svg viewBox="0 0 960 700" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" style="display:block">
  <defs><linearGradient id="ceu-${cor}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.claro}"/><stop offset="1" stop-color="#FFF1DA"/></linearGradient></defs>
  <rect width="960" height="700" fill="url(#ceu-${cor})"/>
  <circle cx="770" cy="170" r="92" fill="${A.sol}"/><circle cx="770" cy="170" r="128" fill="${A.sol}" opacity=".22"/>
  <path d="M0 470 Q160 330 330 430 T640 400 T960 420 V700 H0z" fill="${c.bg}" opacity=".35"/>
  <path d="M0 540 Q220 430 430 520 T960 500 V700 H0z" fill="#E9B47C"/>
  <path d="M0 610 Q260 540 520 600 T960 590 V700 H0z" fill="#D99A5B"/>
  <g fill="${A.verde}"><rect x="128" y="380" width="34" height="240" rx="17"/><rect x="82" y="440" width="26" height="110" rx="13"/><rect x="82" y="530" width="62" height="24" rx="12"/><rect x="182" y="410" width="26" height="120" rx="13"/><rect x="146" y="510" width="62" height="24" rx="12"/></g>
  <g transform="translate(720 470)"><rect x="0" y="40" width="130" height="92" fill="#FFF8EC"/><path d="M-14 46 L65 -6 L144 46z" fill="${c.escuro}"/><rect x="52" y="78" width="28" height="54" fill="${c.bg}"/><rect x="16" y="66" width="24" height="22" fill="${A.ceu}" opacity=".7"/><rect x="94" y="66" width="24" height="22" fill="${A.ceu}" opacity=".7"/></g>
  <circle cx="480" cy="300" r="150" fill="#fff"/><circle cx="480" cy="300" r="150" fill="none" stroke="${c.bg}" stroke-width="10" stroke-dasharray="4 18" stroke-linecap="round"/>
  <g transform="translate(390 210) scale(7.5)" fill="none" stroke="${c.bg}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${IC[ic] || IC.documento}</g></svg>`;
};

// Emblema dentro de um selo creme (o prata do emblema não some no colorido).
export const selo = px => `<span style="display:flex;align-items:center;justify-content:center;flex:none;width:${px}px;height:${px}px;border-radius:${px * .26}px;background:${A.creme}">${emblema(px * .8)}</span>`;
const nome = (cor, px = 24) => `<div style="font-weight:800;font-size:${px}px;line-height:1.2;color:${cor}">Cartório de<br>Curral Queimado</div>`;
const etiqueta = (txt, bg, fg, px = 30, extra = '') => `<span style="display:inline-block;background:${bg};color:${fg};font-weight:900;font-size:${px}px;letter-spacing:.06em;text-transform:uppercase;padding:${px * .32}px ${px * .7}px ${px * .26}px;border-radius:999px;${extra}">${esc(txt)}</span>`;
const area = (html, { top = 110, bottom = 200, extra = '' } = {}) => `<div data-cabe style="position:absolute;left:90px;right:90px;top:${top}px;bottom:${bottom}px;display:flex;flex-direction:column;gap:30px;overflow:hidden;${extra}">${html}</div>`;
const titulo = (t, px, cor = A.tinta, extra = '') => `<div style="${TIT};font-size:${px}px;line-height:1.1;color:${cor};${extra}">${rico(t)}</div>`;
const corpo = (t, px = 40, cor = A.tinta) => `<p style="margin:0;font-weight:600;font-size:${px}px;line-height:1.42;color:${cor}">${rico(t)}</p>`;

// Rodapé das páginas de conteúdo: selo + nome, e as bolinhas de página.
const rodape = (ctx = {}) => `<div style="position:absolute;left:90px;right:90px;bottom:64px;display:flex;align-items:center;gap:20px">
  ${selo(78)}${nome(A.suave)}
  ${ctx.total ? `<div style="margin-left:auto;display:flex;gap:10px;align-items:center">${Array.from({ length: ctx.total }, (_, i) => `<span style="width:${i + 1 === ctx.pagina ? 34 : 12}px;height:12px;border-radius:6px;background:${i + 1 === ctx.pagina ? A.barro : '#E3CDB0'}"></span>`).join('')}</div>` : ''}</div>`;
const fundoCreme = `<div style="position:absolute;inset:0;background:${A.creme}"></div><div style="position:absolute;right:-160px;top:-160px;width:420px;height:420px;border-radius:50%;background:${A.areia}"></div>`;
const kicker = (s, cor = A.barro) => s.kicker ? `<div>${etiqueta(s.kicker, cor, '#fff', 26)}</div>` : '';

// Imagem da capa: foto (IA) ou a ilustração do sertão.
const imagem = (s, ctx, w, h) => {
  const img = foto(ctx.root, s.foto);
  return img ? `<div style="width:${w}px;height:${h}px;background:url(${img}) ${s.fotoPos || 'center'}/cover"></div>` : sertao(w, h, s.cor || 'barro', s.icone);
};

export const TIPOS = {
  // Capa: imagem em cima (moldura arredondada), selo "Você sabia?" e título grande no colorido.
  capa: (s, f, ctx) => {
    const c = CORES[s.cor] || CORES.barro;
    return `<div style="position:absolute;inset:0;background:${c.bg}"></div>
    <div style="position:absolute;left:50px;right:50px;top:50px;height:${s.alturaFoto || 640}px;border-radius:44px;overflow:hidden;box-shadow:0 18px 0 ${c.escuro}">${imagem(s, ctx, 980, s.alturaFoto || 640)}</div>
    <div style="position:absolute;left:80px;top:${(s.alturaFoto || 640) + 10}px;transform:rotate(-4deg)">${etiqueta(s.selo || 'Você sabia?', A.sol, A.tinta, 38, `box-shadow:0 6px 0 ${c.escuro}`)}</div>
    ${area(`${titulo(s.titulo, s.ts || 100, '#fff')}${s.texto ? corpo(s.texto, 36, '#fff') : ''}`, { top: (s.alturaFoto || 640) + 110, bottom: 150, extra: 'gap:22px' })}
    <div style="position:absolute;left:90px;right:90px;bottom:52px;display:flex;align-items:center;gap:18px">${selo(70)}${nome('#fff', 22)}
      <span style="margin-left:auto;font-weight:900;font-size:26px;color:${c.escuro};background:#fff;border-radius:999px;padding:12px 26px">${esc(s.arrasta || 'Arrasta pro lado')} →</span></div>`;
  },
  texto: (s, f, ctx) => `${fundoCreme}${area(`${kicker(s)}${titulo(s.titulo, s.ts || 92)}${lista(s.texto).map(t => corpo(t, s.corpo || 46)).join('')}${s.destaque ? `<div style="background:#fff;border-radius:30px;padding:30px 36px;border-left:14px solid ${A.sol};font-weight:700;font-size:38px;line-height:1.4;color:${A.tinta}">${rico(s.destaque)}</div>` : ''}`, { extra: 'justify-content:center' })}${rodape(ctx)}`,
  // Lista numerada em cartões brancos, com bolinhas coloridas.
  lista: (s, f, ctx) => `${fundoCreme}${area(`${kicker(s)}${titulo(s.titulo, s.ts || 88)}<div style="display:flex;flex-direction:column;gap:20px">${lista(s.itens).map((t, i) => `<div style="display:flex;gap:26px;align-items:center;background:#fff;border-radius:28px;padding:24px 30px"><span style="flex:none;width:72px;height:72px;border-radius:50%;background:${ROD[i % 4]};color:#fff;display:flex;align-items:center;justify-content:center;${TIT};font-size:44px">${i + 1}</span><span style="font-weight:600;font-size:${s.corpo || 40}px;line-height:1.36;color:${A.tinta}">${rico(t)}</span></div>`).join('')}</div>`, { extra: 'justify-content:center' })}${rodape(ctx)}`,
  // Mito ou verdade: a frase num balão e o carimbo com a resposta.
  mito: (s, f, ctx) => {
    const v = /verdade/i.test(s.resposta || '');
    const cor = v ? A.verde : A.barro;
    return `${fundoCreme}${area(`${kicker(s, A.ceu)}
    <div style="position:relative;background:#fff;border-radius:40px;padding:44px 48px 52px;box-shadow:0 10px 0 #EAD3B5"><div style="font-weight:800;font-size:28px;letter-spacing:.06em;text-transform:uppercase;color:${A.suave};margin-bottom:12px">Dizem por aí:</div>${titulo(`“${s.frase}”`, s.ts || 78)}
      <div style="position:absolute;right:40px;bottom:-46px;transform:rotate(-6deg);border:7px solid ${cor};color:${cor};background:${A.creme};border-radius:20px;padding:6px 30px 0;${TIT};font-size:76px;line-height:1.05">${v ? 'Verdade' : 'Mito'}</div></div>
    <div style="height:20px"></div>${lista(s.texto).map(t => corpo(t, s.corpo || 44)).join('')}`, { extra: 'justify-content:center' })}${rodape(ctx)}`;
  },
  // Número grande num círculo colorido.
  numero: (s, f, ctx) => {
    const c = CORES[s.cor] || CORES.ceu;
    return `${fundoCreme}${area(`${kicker(s)}${s.titulo ? titulo(s.titulo, s.ts || 72) : ''}
    <div style="display:flex;align-items:center;gap:40px"><div style="flex:none;min-width:330px;height:330px;padding:0 40px;border-radius:165px;background:${c.bg};color:#fff;display:flex;align-items:center;justify-content:center;${TIT};font-size:${s.tv || 150}px;line-height:1;box-shadow:0 14px 0 ${c.escuro}">${esc(s.valor)}</div>
      <div style="font-weight:800;font-size:44px;line-height:1.25;color:${A.tinta}">${rico(s.rotulo || '')}</div></div>
    ${lista(s.texto).map(t => corpo(t, s.corpo || 44)).join('')}`, { extra: 'justify-content:center' })}${rodape(ctx)}`;
  },
  // Pergunta de alguém do povoado (balão de fala) e a resposta do cartório (balão creme).
  // Nome artístico x nome de registro: foto redonda (ou ícone), o nome famoso e a ficha do registro.
  ficha: (s, f, ctx) => {
    const c = CORES[s.cor] || CORES.barro;
    const img = foto(ctx.root, s.foto);
    return `${fundoCreme}${area(`${kicker(s)}
    <div style="display:flex;align-items:center;gap:40px"><div style="flex:none;width:260px;height:260px;border-radius:50%;overflow:hidden;background:${c.claro};border:10px solid #fff;box-shadow:0 12px 0 ${c.bg};display:flex;align-items:center;justify-content:center">${img ? `<div style="width:100%;height:100%;background:url(${img}) ${s.fotoPos || 'center 25%'}/cover"></div>` : icone(s.icone || 'pergunta', 130, c.bg, 1.8)}</div>
      <div><div style="font-weight:800;font-size:28px;letter-spacing:.06em;text-transform:uppercase;color:${A.suave}">Conhecido como</div>${titulo(s.artistico, s.ts || 104, c.bg)}</div></div>
    <div style="background:#fff;border-radius:36px;padding:34px 40px;border:4px dashed ${c.bg}"><div style="display:flex;align-items:center;gap:14px;margin-bottom:10px">${icone('documento', 40, c.bg, 2.2)}<span style="font-weight:900;font-size:28px;letter-spacing:.06em;text-transform:uppercase;color:${c.bg}">Nome de registro</span></div>${titulo(s.registro, s.tr || 70)}</div>
    ${lista(s.texto).map(t => corpo(t, s.corpo || 38)).join('')}`, { extra: 'justify-content:center' })}${rodape(ctx)}`;
  },
  // Ranking em barras: itens [{nome, valor}] (valor numérico, mostrado com ponto de milhar).
  ranking: (s, f, ctx) => {
    const it = lista(s.itens), max = s.max || Math.max(...it.map(i => i.valor));
    return `${fundoCreme}${area(`${kicker(s)}${titulo(s.titulo, s.ts || 80)}<div style="display:flex;flex-direction:column;gap:16px">${it.map((i, k) => `<div style="display:flex;align-items:center;gap:20px"><span style="flex:none;width:56px;${TIT};font-size:44px;color:${A.suave};text-align:right">${k + (s.inicio || 1)}º</span><div style="flex:1;position:relative;height:84px;background:#fff;border-radius:22px;overflow:hidden"><div style="position:absolute;left:0;top:0;bottom:0;width:${Math.max(38, 100 * i.valor / max)}%;background:${ROD[k % 4]};border-radius:22px"></div><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:space-between;padding:0 26px"><span style="${TIT};font-size:46px;color:#fff">${esc(i.nome)}</span><span style="font-weight:800;font-size:30px;color:${A.tinta}">${Number(i.valor).toLocaleString('pt-BR')}</span></div></div></div>`).join('')}</div>${lista(s.texto).map(t => corpo(t, s.corpo || 34, A.suave)).join('')}`, { extra: 'justify-content:center' })}${rodape(ctx)}`;
  },
  pergunta: (s, f, ctx) => `${fundoCreme}${area(`${kicker(s, A.verde)}
    <div style="align-self:flex-start;max-width:860px;position:relative;background:${A.ceu};color:#fff;border-radius:44px 44px 44px 10px;padding:40px 46px">${titulo(s.pergunta, s.ts || 72, '#fff')}${s.quem ? `<div style="font-weight:800;font-size:28px;margin-top:14px;opacity:.85">${esc(s.quem)}</div>` : ''}</div>
    <div style="align-self:flex-end;max-width:860px;background:#fff;border-radius:44px 44px 10px 44px;padding:38px 46px;display:flex;flex-direction:column;gap:18px;box-shadow:0 10px 0 #EAD3B5"><div style="display:flex;align-items:center;gap:14px">${selo(56)}<span style="font-weight:900;font-size:28px;color:${A.barro}">O cartório responde</span></div>${lista(s.texto).map(t => corpo(t, s.corpo || 40)).join('')}</div>`, { extra: 'justify-content:center;gap:40px' })}${rodape(ctx)}`,
  // Fechamento: chamada, WhatsApp, endereço e agendamento, no colorido.
  cta: (s, f) => {
    const c = CORES[s.cor] || CORES.verde;
    const linha = (ic, r, v) => `<div style="display:flex;gap:24px;align-items:center;background:rgba(255,255,255,.14);border-radius:28px;padding:22px 28px"><span style="flex:none;width:70px;height:70px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center">${icone(ic, 40, c.bg, 2.2)}</span><div><div style="font-weight:800;font-size:24px;letter-spacing:.06em;text-transform:uppercase;opacity:.85">${r}</div><div style="font-weight:800;font-size:34px;line-height:1.25;white-space:pre-line">${esc(v)}</div></div></div>`;
    return `<div style="position:absolute;inset:0;background:${c.bg}"></div><div style="position:absolute;left:-200px;bottom:-260px;width:620px;height:620px;border-radius:50%;background:${c.escuro};opacity:.35"></div>
    ${area(`${titulo(s.titulo || 'Ficou com [[dúvida]]? Fala com a gente!', s.ts || 92, '#fff')}${s.texto ? corpo(s.texto, 36, '#fff') : ''}
      <div style="display:flex;flex-direction:column;gap:16px;color:#fff">${linha('celular', 'WhatsApp', CONTATO.telefone)}${linha('casa', 'Endereço', CONTATO.endereco.join('\n'))}${linha('calendario', 'Agende on-line', CONTATO.site)}</div>`, { top: 100, bottom: 190, extra: 'justify-content:center' })}
    <div style="position:absolute;left:90px;right:90px;bottom:60px;display:flex;align-items:center;gap:18px">${selo(84)}${nome('#fff', 26)}<span style="margin-left:auto;font-weight:900;font-size:26px;color:${c.escuro};background:${A.sol};border-radius:999px;padding:12px 26px">${esc(s.salve || 'Salve e mande pra quem precisa')}</span></div>`;
  },
  // Tela única: curiosidade com imagem, título e texto curto, com o contato no pé.
  curiosidade: (s, f, ctx) => {
    const c = CORES[s.cor] || CORES.barro;
    const alt = s.alturaFoto || 600;
    return `<div style="position:absolute;inset:0;background:${A.creme}"></div>
    <div style="position:absolute;left:0;right:0;top:0;height:${alt}px;overflow:hidden;border-radius:0 0 60px 60px">${imagem(s, ctx, 1080, alt)}</div>
    <div style="position:absolute;left:80px;top:${alt - 40}px;transform:rotate(-3deg)">${etiqueta(s.selo || 'Você sabia?', A.sol, A.tinta, 38, `box-shadow:0 6px 0 ${c.escuro}`)}</div>
    ${area(`${titulo(s.titulo, s.ts || 92, c.bg === A.sol ? A.tinta : c.escuro)}${lista(s.texto).map(t => corpo(t, s.corpo || 38)).join('')}`, { top: alt + 80, bottom: 180, extra: 'gap:24px' })}
    <div style="position:absolute;left:90px;right:90px;bottom:56px;display:flex;align-items:center;gap:18px">${selo(78)}${nome(A.suave)}<span style="margin-left:auto;font-weight:900;font-size:28px;color:#fff;background:${c.bg};border-radius:999px;padding:14px 28px">${esc(CONTATO.telefone)}</span></div>`;
  },
  // Tela única: aviso amigável com ícone grande.
  aviso: (s, f) => {
    const c = CORES[s.cor] || CORES.ceu;
    return `<div style="position:absolute;inset:0;background:${c.bg}"></div><div style="position:absolute;right:-180px;top:-180px;width:560px;height:560px;border-radius:50%;background:${c.claro};opacity:.25"></div>
    ${area(`<div style="width:220px;height:220px;border-radius:60px;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 14px 0 ${c.escuro}">${icone(s.icone || 'calendario', 130, c.bg, 1.9)}</div>
      ${etiqueta(s.selo || 'Aviso', A.sol, A.tinta, 30, 'align-self:flex-start')}${titulo(s.titulo, s.ts || 104, '#fff')}${lista(s.texto).map(t => corpo(t, s.corpo || 40, '#fff')).join('')}`, { top: 110, bottom: 190, extra: 'justify-content:center' })}
    <div style="position:absolute;left:90px;right:90px;bottom:60px;display:flex;align-items:center;gap:18px">${selo(80)}${nome('#fff', 24)}<span style="margin-left:auto;font-weight:900;font-size:28px;color:${c.escuro};background:#fff;border-radius:999px;padding:14px 28px">${esc(CONTATO.telefone)}</span></div>`;
  },
};

export const peca = (s, ctx) => (TIPOS[s.tipo] || TIPOS.texto)(s, null, ctx);

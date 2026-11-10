// Molde "Dorama · Nativo" (@cristaodorameiro): slides 3:4 (1080×1440) como os posts feitos dentro do Instagram:
// foto (ou cena em degradê com luzes) em tela cheia + texto nativo (Figtree 800, cada linha num balão) e
// figurinhas dos stories: slider de emoji (para dar nota), enquete, caixa de perguntas e menção.
import { C, esc, cena, foto } from '../dorama-comum/identidade.mjs';

const W = 1080, H = 1440;
const CORES = {
  branco: ['#FFFFFF', '#111111'], preto: ['#111111', '#FFFFFF'], rosa: [C.rosa, '#2A0F1C'], pink: [C.rosaForte, '#FFFFFF'],
  noite: [C.noite, C.rosa], creme: [C.creme, C.tinta], ouro: [C.ouro, '#2A1A00'], turquesa: [C.turquesa, '#FFFFFF'], laranja: [C.laranja, C.tinta], nada: ['transparent', '#FFFFFF'],
};
const posY = (y, h = 0) => y === 'topo' ? 150 : y === 'meio' ? (H - h) / 2 : y === 'base' ? H - 220 - h : y ?? 150;
const linhas = t => esc(t).split('\n');
// Texto nativo: cada linha num balão arredondado da cor escolhida.
const bloco = b => {
  const [bg, fg] = CORES[b.cor] || CORES.branco, px = b.tam || 64, larg = b.largura || 940;
  const sombra = b.cor === 'nada' ? 'text-shadow:0 2px 14px rgba(0,0,0,.55);' : '';
  return `<div style="position:absolute;left:${(W - larg) / 2}px;width:${larg}px;top:${posY(b.y)}px;text-align:${b.alinhar || 'center'};transform:rotate(${b.rot || 0}deg)">
    ${linhas(b.texto).map(l => `<div><span style="display:inline-block;margin:-${px * .02}px 0;padding:${px * .1}px ${px * .3}px;border-radius:${px * .26}px;background:${bg};color:${fg};font-family:Figtree;font-weight:800;font-size:${px}px;line-height:1.18;${sombra}">${l}</span></div>`).join('')}</div>`;
};
const card = (y, w, html, rot = 0, extra = '') => `<div style="position:absolute;left:${(W - w) / 2}px;width:${w}px;top:${posY(y)}px;transform:rotate(${rot}deg);border-radius:34px;background:#fff;box-shadow:0 18px 50px rgba(0,0,0,.28);overflow:hidden;font-family:Figtree;${extra}">${html}</div>`;
const FIGURINHAS = {
  // Slider de emoji: a nota vai de 0 a 10 (ou valor de 0 a 1).
  slider: f => { const v = f.nota != null ? f.nota / 10 : (f.valor ?? .8), w = f.largura || 760;
    return card(f.y, w, `<div style="padding:40px 50px 54px;text-align:center"><div style="font-weight:800;font-size:${f.tam || 46}px;line-height:1.2;color:#111">${esc(f.texto || 'Minha nota')}</div>
      <div style="position:relative;margin-top:50px;height:20px;border-radius:99px;background:#E8E3EA"><div style="width:${v * 100}%;height:100%;border-radius:99px;background:linear-gradient(90deg,${C.rosaForte},${C.ouro})"></div>
      <span style="position:absolute;left:${v * 100}%;top:50%;transform:translate(-50%,-50%);font-size:96px;line-height:1">${f.emoji || '😍'}</span></div>
      ${f.nota != null ? `<div style="margin-top:44px;font-weight:800;font-size:34px;color:${C.rosaForte}">${String(f.nota).replace('.', ',')} / 10</div>` : ''}</div>`, f.rot); },
  enquete: f => { const w = f.largura || 760;
    return `<div style="position:absolute;left:${(W - w) / 2}px;width:${w}px;top:${posY(f.y)}px;transform:rotate(${f.rot || 0}deg);font-family:Figtree">
      ${f.texto ? `<div style="text-align:center;margin-bottom:-26px;position:relative;z-index:2"><span style="display:inline-block;padding:16px 34px;border-radius:24px;background:${C.rosaForte};color:#fff;font-weight:800;font-size:44px;line-height:1.15">${esc(f.texto)}</span></div>` : ''}
      <div style="border-radius:34px;background:#fff;box-shadow:0 18px 50px rgba(0,0,0,.28);padding:52px 34px 30px;display:flex;flex-direction:column;gap:18px">${(f.opcoes || ['Sim', 'Não']).map(o => `<div style="padding:24px;border-radius:22px;border:3px solid #ECE6EE;text-align:center;font-weight:800;font-size:42px;color:${C.rosaForte}">${esc(o)}</div>`).join('')}</div></div>`; },
  pergunta: f => card(f.y, f.largura || 760, `<div style="padding:40px 46px 34px;background:linear-gradient(135deg,${C.rosaForte},#B5418F);text-align:center;color:#fff;font-weight:800;font-size:${f.tam || 48}px;line-height:1.2">${esc(f.texto || 'Me faz uma pergunta')}</div><div style="margin:28px 34px 34px;padding:28px;border-radius:20px;background:#F2EEF3;text-align:center;font-weight:700;font-size:34px;color:#9A90A0">${esc(f.dica || 'Escreva algo…')}</div>`, f.rot),
  mencao: f => `<div style="position:absolute;left:0;right:0;top:${posY(f.y)}px;text-align:center"><span style="display:inline-block;transform:rotate(${f.rot ?? -3}deg);padding:16px 34px;border-radius:20px;background:#fff;box-shadow:0 12px 34px rgba(0,0,0,.25);font-family:Figtree;font-weight:800;font-size:${f.tam || 46}px;background-image:linear-gradient(90deg,${C.rosaForte},#B5418F,${C.ouro});-webkit-background-clip:text;color:transparent;background-color:#fff">@${esc(f.texto || 'cristaodorameiro').replace(/^@/, '')}</span></div>`,
};
const MENCAO_BG = h => h.replace(/background-image:([^;]+);-webkit-background-clip:text;color:transparent;background-color:#fff">(@[^<]+)</, (m, g, t) => `background:#fff"><span style="background-image:${g};-webkit-background-clip:text;color:transparent">${t}</span><`);

const fundoSlide = s => {
  const src = foto(s.foto);
  if (src) return `<img src="${src}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${s.fotoPos || 'center'}">${s.escurecer ? `<div style="position:absolute;inset:0;background:rgba(0,0,0,${s.escurecer})"></div>` : ''}`;
  return `${cena(s.cena || 'noite', W, H, (s.blocos || []).length * 7 + 5)}${s.emoji ? `<div style="position:absolute;left:0;right:0;top:${s.emojiY ?? 520}px;text-align:center;font-size:${s.emojiTam || 300}px;line-height:1;filter:drop-shadow(0 20px 40px rgba(0,0,0,.25))">${s.emoji}</div>` : ''}`;
};
export const slides = post => ({ w: W, h: H, slides: post.slides.map(s => `${fundoSlide(s)}${(s.blocos || []).map(bloco).join('')}${(s.figurinhas || []).map(f => { const h = (FIGURINHAS[f.tipo] || FIGURINHAS.mencao)(f); return f.tipo === 'mencao' ? MENCAO_BG(h) : h; }).join('')}`) });

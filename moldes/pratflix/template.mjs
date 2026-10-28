// Molde "PratFlix" (@liberofilho): telas únicas da plataforma PratFlix ("a advocacia na prática") misturadas
// com o Carrossel Libero: preto grafite, areia, Manrope com rótulos espaçados, títulos em Big Shoulders caixa
// alta, granulado, foto do corredor da plataforma e caixa de comentário "#hashtag". Cada post tem uma ou mais
// `telas`; o tamanho vem do layout (feed 1080×1350, stories 1080×1920, simbolo 1080×1080).
import fs from 'node:fs';
import path from 'node:path';

const dir = path.dirname(new URL(import.meta.url).pathname);
const foto = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(dir, 'fotos', 'corredor.jpg')).toString('base64');
const C = { bg: '#121212', areia: '#E3D6B4', areia2: '#C9B88E', ouro: '#9A7B3A', txt: '#EDEAE3', mute: '#8E8A82', azul: '#0B4FD8' };
const T = "font-family:'Big Shoulders Display';font-weight:900;text-transform:uppercase;letter-spacing:-.005em";
export const FONTES = 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@800;900&family=Manrope:wght@500;600;700;800&display=swap';
export const TAMANHOS = { heroi: [1080, 1350], original: [1080, 1350], tipo: [1080, 1350], claro: [1080, 1350], comenta: [1080, 1350], stories: [1080, 1920], simbolo: [1080, 1080] };

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Linhas do título; [[trecho]] sai em areia (ou na cor/caixa passada).
const tit = (linhas, f = t => `<span style="color:${C.areia}">${t}</span>`) => [].concat(linhas).map(l => esc(l).replace(/\[\[(.+?)\]\]/g, (_, t) => f(t))).join('<br>');
const grao = `<div style="position:absolute;inset:0;pointer-events:none;opacity:.16;mix-blend-mode:overlay;background-image:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E&quot;)"></div>`;
const logo = (px = 46, cor = C.txt) => `<div style="display:inline-flex;flex-direction:column;color:${cor}"><span style="font:800 ${px}px Manrope;letter-spacing:-.05em;line-height:1">pratflix<span style="font-size:.55em;vertical-align:.25em;margin-left:2px">▸</span></span><span style="font:600 ${px * .24}px Manrope;letter-spacing:.42em;margin-top:${px * .18}px;opacity:.75">A ADVOCACIA NA PRÁTICA</span></div>`;
const rotulo = (t, cor = C.areia) => `<span style="display:inline-flex;align-items:center;gap:12px;border:1px solid ${cor}55;border-radius:8px;padding:10px 16px;font:700 17px Manrope;letter-spacing:.24em;color:${cor}">✦ ${esc(t).toUpperCase()}</span>`;
const perfil = (cor = C.txt, bg = 'transparent') => `<span style="font:700 24px Manrope;color:${cor};background:${bg};padding:${bg === 'transparent' ? 0 : '6px 14px'}">@liberofilho</span>`;
const comentario = (tag, px = 30) => `<div style="display:flex;align-items:center;gap:18px;background:#1E1E1D;border:1px solid #34342f;border-radius:999px;padding:16px 18px 16px 22px">
  <span style="width:${px * 1.7}px;height:${px * 1.7}px;border-radius:50%;background:linear-gradient(135deg,${C.areia},${C.areia2});flex:none"></span>
  <span style="font:600 ${px}px Manrope;color:${C.txt}"><b style="color:${C.areia}">${esc(tag)}</b><span style="display:inline-block;width:3px;height:${px}px;background:${C.txt};margin-left:4px;vertical-align:-5px"></span></span>
  <span style="margin-left:auto;font:800 ${px * .8}px Manrope;color:#4E8BFF">Publicar</span></div>`;
const fundoFoto = (alt = '100%', grad = `rgba(18,18,18,.55) 0%,rgba(18,18,18,.35) 35%,${C.bg} 78%`) => `<img src="${foto}" style="position:absolute;left:0;top:0;width:100%;height:${alt};object-fit:cover;filter:blur(2px) brightness(.55) saturate(.8);transform:scale(1.05)">
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,${grad})"></div>${grao}`;
const beneficios = (b, px = 28) => b ? `<div style="display:flex;gap:16px;flex-wrap:wrap;font:600 ${px}px Manrope;color:${C.txt};opacity:.85">${b.map(x => `<span>✓ ${esc(x)}</span>`).join('<span style="opacity:.4">·</span>')}</div>` : '';

const L = {};
// Herói da plataforma: foto do corredor, rótulo, título grande e botão areia "Comente #tag".
L.heroi = t => `${fundoFoto()}
  <div style="position:absolute;left:90px;right:90px;top:80px;display:flex;justify-content:space-between;align-items:flex-start">${logo(54)}${perfil()}</div>
  <div style="position:absolute;left:90px;right:90px;top:${t.top ?? 520}px">
    ${rotulo(t.rotulo)}
    <div style="${T};font-size:${t.ts ?? 116}px;line-height:.88;color:${C.txt};margin-top:30px">${tit(t.titulo)}</div>
    <div style="font:500 30px/1.45 Manrope;color:${C.txt};opacity:.8;margin-top:30px">${esc(t.texto)}</div>
    <div style="display:flex;gap:18px;margin-top:44px;align-items:center">
      <span style="background:${C.areia};color:#111;border-radius:14px;padding:24px 34px;font:800 30px Manrope">💬 Comente <b>${esc(t.hashtag)}</b></span>
      <span style="border:1px solid #3a3a38;border-radius:14px;padding:24px 30px;font:700 28px Manrope;color:${C.txt}">→ receba o link</span></div></div>`;
// Card "PratFlix Original", como um título do catálogo, com a caixa de comentário embaixo.
L.original = t => `${grao}
  <div style="position:absolute;left:80px;right:80px;top:76px;display:flex;justify-content:space-between;align-items:center">${logo(46)}${perfil(C.mute)}</div>
  <div style="position:absolute;left:80px;right:80px;top:210px;height:880px;border-radius:28px;overflow:hidden;border:1px solid #2c2c2a">
    <img src="${foto}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(.5) saturate(.75)">
    <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.15),rgba(0,0,0,.2) 40%,rgba(12,12,12,.95) 88%)"></div>
    <div style="position:absolute;left:44px;top:40px;font:700 18px Manrope;letter-spacing:.3em;color:${C.txt};opacity:.85">PRATFLIX ORIGINAL</div>
    <div style="position:absolute;right:40px;top:30px;background:rgba(18,18,18,.8);border:1px solid #444;border-radius:8px;padding:10px 16px;font:800 17px Manrope;letter-spacing:.14em;color:${C.areia}">${esc(t.selo ?? 'ACESSO GRATUITO')}</div>
    <div style="position:absolute;left:44px;right:44px;bottom:48px">
      <div style="font:700 18px Manrope;letter-spacing:.3em;color:${C.areia}">${esc(t.rotulo).toUpperCase()}</div>
      <div style="${T};font-size:${t.ts ?? 108}px;line-height:.88;color:#fff;margin-top:16px">${tit(t.titulo, x => x)}</div>
      <div style="display:flex;align-items:center;gap:16px;margin-top:30px"><span style="font:600 22px Manrope;color:${C.txt};opacity:.75">01</span><span style="width:90px;height:3px;background:${C.areia}"></span><span style="width:60px;height:3px;background:#555"></span><span style="width:60px;height:3px;background:#555"></span><span style="margin-left:auto">${beneficios(t.beneficios, 22)}</span></div></div></div>
  <div style="position:absolute;left:80px;right:80px;top:1140px">${comentario(t.hashtag)}<div style="text-align:center;font:600 26px Manrope;color:${C.mute};margin-top:22px">${t.cta ? esc(t.cta).replace(esc(t.hashtag), `<b style="color:${C.areia}">${esc(t.hashtag)}</b>`) : ''}</div></div>`;
// Tipográfica no escuro: título gigante com trechos em caixa areia e caixa de comentário.
L.tipo = t => `<div style="position:absolute;inset:0;background:radial-gradient(110% 80% at 100% 0%,#2a271f 0%,${C.bg} 60%)"></div>${grao}
  <div style="position:absolute;left:90px;right:90px;top:80px;display:flex;justify-content:space-between;align-items:center">${rotulo(t.rotulo)}${logo(40)}</div>
  <div style="position:absolute;left:90px;right:60px;top:250px;${T};font-size:${t.ts ?? 150}px;line-height:.86;color:${C.txt}">${tit(t.titulo, x => `<span style="background:${C.areia};color:#111;padding:0 18px;display:inline-block;margin:10px 0 10px -6px">${x}</span>`)}</div>
  <div style="position:absolute;left:90px;right:90px;bottom:200px">${comentario(t.hashtag)}</div>
  <div style="position:absolute;left:90px;right:90px;bottom:100px;display:flex;justify-content:space-between;align-items:center;font:600 26px Manrope;color:${C.mute}"><span>${esc(t.cta ?? 'Comente e receba o link')}</span>${perfil(C.txt, C.azul)}</div>`;
// Versão clara: papel, título preto com trecho em ouro, anéis areia e faixa preta "Comente #tag".
L.claro = t => `<div style="position:absolute;inset:0;background:#F4F1EA"></div>${grao}
  <div style="position:absolute;left:90px;right:90px;top:80px;display:flex;justify-content:space-between;align-items:center">${logo(46, '#111')}${perfil('#fff', '#111')}</div>
  <div style="position:absolute;right:-160px;top:200px;width:620px;height:620px;border-radius:50%;border:2px solid ${C.areia2}"></div>
  <div style="position:absolute;right:-60px;top:300px;width:420px;height:420px;border-radius:50%;border:2px solid ${C.areia2};opacity:.6"></div>
  <div style="position:absolute;left:90px;right:90px;top:330px">
    <div style="font:700 20px Manrope;letter-spacing:.3em;color:${C.ouro}">${esc(t.rotulo).toUpperCase()}</div>
    <div style="${T};font-size:${t.ts ?? 124}px;line-height:.88;color:#111;margin-top:24px">${tit(t.titulo, x => `<span style="color:${C.ouro}">${x}</span>`)}</div>
    <div style="width:110px;height:6px;background:#111;margin-top:40px"></div>
    <div style="font:500 32px/1.45 Manrope;color:#333;margin-top:34px;width:820px">${esc(t.texto)}</div></div>
  <div style="position:absolute;left:90px;right:90px;bottom:120px;background:#111;border-radius:30px;padding:40px 44px;display:flex;align-items:center;gap:30px">
    <span style="font-size:64px">💬</span><div><div style="font:600 26px Manrope;color:#bbb">Comente</div><div style="${T};font-size:82px;line-height:.9;color:${C.areia}">${esc(t.hashtag)}</div></div>
    <div style="margin-left:auto;font:700 26px/1.3 Manrope;color:#fff;text-align:right">e receba<br>o link →</div></div>`;
// Feed com a caixa de comentário no pé: "Comenta #tag pra receber o link".
L.comenta = t => `${fundoFoto('100%', `rgba(18,18,18,.55) 0%,rgba(18,18,18,.3) 30%,${C.bg} 70%`)}
  <div style="position:absolute;left:90px;right:90px;top:80px;display:flex;justify-content:space-between;align-items:flex-start">${logo(54)}${perfil()}</div>
  <div style="position:absolute;left:90px;right:90px;top:${t.top ?? 400}px">
    ${rotulo(t.rotulo)}
    <div style="${T};font-size:${t.ts ?? 150}px;line-height:.86;color:${C.txt};margin-top:28px">${tit(t.titulo)}</div>
    <div style="font:500 30px/1.45 Manrope;color:${C.txt};opacity:.8;margin-top:28px">${esc(t.texto)}</div></div>
  <div style="position:absolute;left:90px;right:90px;bottom:90px">${comentario(t.hashtag, 34)}
    <div style="text-align:center;font:600 30px Manrope;color:${C.txt};margin-top:24px">${esc(t.cta).replace(esc(t.hashtag), `<b style="color:${C.areia}">${esc(t.hashtag)}</b>`)}</div></div>`;
// Stories 1080×1920: foto no alto, título grande, benefícios e botão (para pôr a figurinha de link por cima).
L.stories = t => `${fundoFoto('1150px', `rgba(18,18,18,.5) 0%,rgba(18,18,18,.25) 25%,${C.bg} 58%`)}
  <div style="position:absolute;left:90px;right:90px;top:150px;display:flex;justify-content:space-between;align-items:flex-start">${logo(58)}${perfil()}</div>
  <div style="position:absolute;left:90px;right:90px;top:${t.top ?? 760}px">
    ${rotulo(t.rotulo)}
    <div style="${T};font-size:${t.ts ?? 178}px;line-height:.86;color:${C.txt};margin-top:36px">${tit(t.titulo)}</div>
    <div style="font:500 36px/1.45 Manrope;color:${C.txt};opacity:.82;margin-top:36px">${esc(t.texto)}</div>
    <div style="margin-top:40px">${beneficios(t.beneficios)}</div></div>
  <div style="position:absolute;left:90px;right:90px;bottom:250px;display:flex;justify-content:center"><span style="background:${C.areia};color:#111;border-radius:22px;padding:30px 46px;font:800 38px Manrope;box-shadow:0 20px 50px rgba(0,0,0,.45)">${esc(t.botao ?? '🔗 Toque no link e entre no grupo')}</span></div>`;
// Símbolo (1080×1080, foto de grupo do WhatsApp): selo areia com o "p▸", nome e logo, tudo no círculo central.
L.simbolo = t => `<div style="position:absolute;inset:0;background:radial-gradient(75% 75% at 50% 42%,#2a271f 0%,${C.bg} 70%)"></div>${grao}
  <div style="position:absolute;left:50%;top:50%;width:820px;height:820px;transform:translate(-50%,-50%);border-radius:50%;border:2px solid ${C.areia}33"></div>
  <div style="position:absolute;left:50%;top:50%;width:700px;height:700px;transform:translate(-50%,-50%);border-radius:50%;border:2px solid ${C.areia}22"></div>
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
    <div style="width:190px;height:190px;border-radius:46px;background:linear-gradient(135deg,${C.areia},${C.areia2});display:grid;place-items:center;box-shadow:0 24px 60px rgba(0,0,0,.5)"><span style="font:800 150px/1 Manrope;letter-spacing:-.06em;color:#121212;margin:-24px 0 0 6px">p<span style="font-size:.42em;vertical-align:.32em;margin-left:2px">▸</span></span></div>
    <div style="${T};font-size:${t.ts ?? 132}px;line-height:.86;color:${C.txt};margin-top:46px">${tit(t.titulo)}</div>
    <div style="margin-top:34px">${logo(44)}</div></div>`;

export function renderTela(t) {
  if (!L[t.layout]) throw new Error(`layout desconhecido: ${t.layout}`);
  const [w, h] = TAMANHOS[t.layout];
  return { w, h, html: `<!doctype html><html><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet"><style>*{margin:0;box-sizing:border-box}body{margin:0}</style></head>
<body><div style="width:${w}px;height:${h}px;position:relative;overflow:hidden;background:${C.bg}">${L[t.layout](t)}</div></body></html>` };
}

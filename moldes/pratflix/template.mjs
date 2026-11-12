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
export const FONTES = 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@800;900&family=Manrope:wght@500;600;700;800&family=IBM+Plex+Mono:wght@400;700&display=swap';
export const TAMANHOS = { heroi: [1080, 1350], original: [1080, 1350], tipo: [1080, 1350], claro: [1080, 1350], comenta: [1080, 1350], capa: [1080, 1350], lista: [1080, 1350], passo: [1080, 1350], evento: [1080, 1350], catalogo: [1080, 1350], notinha: [1080, 1350], preco: [1080, 1350], frase: [1080, 1350], valores: [1080, 1350], stories: [1080, 1920], capaFoto: [1080, 1350], tweet: [1080, 1350], nota: [1080, 1350], versus: [1080, 1350], enquete: [1080, 1920], pergunta: [1080, 1920], storyFoto: [1080, 1920], simbolo: [1080, 1080], material: [1080, 1350] };

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

// Material gratuito com foto do autor no alto (identidade do Post Libero "material" nas cores da PratFlix): foto em
// tons de areia, rótulo, título, o PDF desenhado (checklist com `itens` linhas numeradas), o bônus (live) e o botão.
// Foto em fotos/<t.foto> (pessoal, fora do git).
L.material = t => {
  const fotoAutor = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(dir, 'fotos', t.foto)).toString('base64');
  const n = t.itens ?? 9;
  const linhas = Array.from({ length: n }, (_, i) => `<div style="display:flex;align-items:center;gap:12px;padding:5px 0;border-bottom:1px solid #d8ccae"><span style="width:22px;height:22px;border:2px solid #7d6a3e;border-radius:5px;flex:none"></span><span style="font:800 15px Manrope;color:#7d6a3e">${String(i + 1).padStart(2, '0')}</span><span style="height:9px;border-radius:5px;background:#cdbf9c;width:${[78, 62, 85, 55, 70, 80, 60, 74, 66][i % 9]}%"></span></div>`).join('');
  return `<img src="${fotoAutor}" style="position:absolute;left:0;top:0;width:100%;height:760px;object-fit:cover;object-position:${t.fotoPos ?? '50% 18%'};filter:grayscale(.55) sepia(.35) brightness(.78) contrast(1.05)">
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(18,18,18,.55) 0%,rgba(18,18,18,0) 16%,rgba(18,18,18,.15) 30%,rgba(18,18,18,.92) 44%,${C.bg} 50%)"></div>${grao}
  <div style="position:absolute;left:80px;right:80px;top:70px;display:flex;justify-content:space-between;align-items:flex-start">${logo(46)}${perfil()}</div>
  <div style="position:absolute;right:66px;top:${t.pdfTop ?? 190}px;width:300px;transform:rotate(4deg);background:#EFE6CF;border-radius:10px;box-shadow:0 30px 60px rgba(0,0,0,.55);padding:26px 26px 22px;z-index:3">
    <div style="display:flex;justify-content:space-between;align-items:center"><span style="font:800 13px Manrope;letter-spacing:.2em;color:#7d6a3e">CHECKLIST · PDF</span><span style="font:800 13px Manrope;color:#fff;background:#121212;border-radius:6px;padding:4px 8px">${n} DOCS</span></div>
    <div style="${T};font-size:40px;line-height:.9;color:#121212;margin:14px 0 10px">${tit(t.pdf, x => `<span style="color:${C.ouro}">${x}</span>`)}</div>${linhas}</div>
  <div style="position:absolute;left:80px;right:80px;top:${t.top ?? 560}px">
    ${rotulo(t.rotulo)}
    <div style="${T};font-size:${t.ts ?? 96}px;line-height:.9;color:${C.txt};margin-top:24px">${tit(t.titulo)}</div>
    ${t.texto ? `<div style="font:500 29px/1.4 Manrope;color:${C.txt};opacity:.8;margin-top:22px;max-width:880px">${esc(t.texto)}</div>` : ''}
    ${t.bonus ? `<div style="display:flex;align-items:center;gap:22px;margin-top:30px;border:1px solid #3a3a38;background:#1A1A19;border-radius:18px;padding:20px 26px">
      <div style="flex:none;text-align:center;border-right:1px solid #3a3a38;padding-right:22px"><div style="font:800 15px Manrope;letter-spacing:.2em;color:${C.areia}">${esc(t.bonus.dia)}</div><div style="${T};font-size:50px;line-height:.95;color:#fff">${esc(t.bonus.data)}</div><div style="font:700 20px Manrope;color:${C.txt};opacity:.75">${esc(t.bonus.hora)}</div></div>
      <div><div style="display:inline-flex;align-items:center;gap:10px;font:800 16px Manrope;letter-spacing:.2em;color:#121212;background:${C.areia};border-radius:6px;padding:5px 10px"><span style="width:10px;height:10px;border-radius:50%;background:#C8372D"></span>${esc(t.bonus.selo)}</div><div style="font:700 25px/1.3 Manrope;color:${C.txt};margin-top:10px">${esc(t.bonus.texto)}</div></div></div>` : ''}
  </div>
  <div style="position:absolute;left:80px;right:80px;bottom:70px;display:flex;align-items:center;gap:18px">
    <span style="flex:1;background:${C.areia};color:#111;border-radius:16px;padding:26px 30px;font:800 30px Manrope;text-align:center">${esc(t.botao).replace(/(#\S+)/, '<b style="font-weight:800;background:#121212;color:#E3D6B4;border-radius:8px;padding:2px 10px">$1</b>')}</span></div>`;
};

// ---- Carrossel ----
const topoC = (dir = '') => `<div style="position:absolute;left:90px;right:90px;top:80px;display:flex;justify-content:space-between;align-items:center">${logo(40)}<span style="font:700 22px Manrope;color:${C.mute};letter-spacing:.08em">${esc(dir)}</span></div>`;
const pe = () => `<div style="position:absolute;left:90px;right:90px;bottom:70px;display:flex;justify-content:space-between;align-items:center;font:600 24px Manrope;color:${C.mute}">${perfil(C.mute)}<span>arrasta →</span></div>`;
// Capa do carrossel: foto do corredor, rótulo, título grande e subtítulo.
L.capa = t => `${fundoFoto('100%', `rgba(18,18,18,.5) 0%,rgba(18,18,18,.3) 30%,${C.bg} 72%`)}
  <div style="position:absolute;left:90px;right:90px;top:80px;display:flex;justify-content:space-between;align-items:flex-start">${logo(54)}${perfil()}</div>
  <div style="position:absolute;left:90px;right:90px;top:${t.top ?? 470}px">
    ${rotulo(t.rotulo)}
    <div style="${T};font-size:${t.ts ?? 140}px;line-height:.86;color:${C.txt};margin-top:30px">${tit(t.titulo)}</div>
    <div style="font:500 32px/1.45 Manrope;color:${C.txt};opacity:.82;margin-top:32px">${esc(t.texto)}</div></div>
  <div style="position:absolute;right:90px;bottom:80px;font:700 26px Manrope;color:${C.areia}">arrasta →</div>`;
// Lista: título e itens numerados em cartões (escuro, ou papel com claro: true).
L.lista = t => { const cl = t.claro; const cor = cl ? '#111' : C.txt;
  return `<div style="position:absolute;inset:0;background:${cl ? '#F4F1EA' : `radial-gradient(110% 80% at 100% 0%,#2a271f 0%,${C.bg} 60%)`}"></div>${grao}
  <div style="position:absolute;left:90px;right:90px;top:80px;display:flex;justify-content:space-between;align-items:center">${logo(40, cor)}<span style="font:700 22px Manrope;color:${cl ? C.ouro : C.mute};letter-spacing:.2em">${esc(t.rotulo ?? '').toUpperCase()}</span></div>
  <div style="position:absolute;left:90px;right:90px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;gap:34px">
    <div style="${T};font-size:${t.ts ?? 124}px;line-height:.88;color:${cor}">${tit(t.titulo, x => `<span style="color:${cl ? C.ouro : C.areia}">${x}</span>`)}</div>
    <div style="display:flex;flex-direction:column;gap:16px">${t.itens.map((it, i) => `<div style="display:flex;gap:24px;align-items:flex-start;background:${cl ? '#fff' : '#1B1B1A'};border:1px solid ${cl ? '#e3ddcf' : '#2f2f2c'};border-radius:20px;padding:30px 32px">
      <span style="${T};font-size:52px;line-height:.9;color:${cl ? C.ouro : C.areia};min-width:56px">${String(i + 1).padStart(2, '0')}</span>
      <div><div style="font:800 36px/1.25 Manrope;color:${cor}">${esc(it.t)}</div>${it.d ? `<div style="font:500 29px/1.4 Manrope;color:${cl ? '#555' : C.txt};opacity:${cl ? 1 : .75};margin-top:6px">${esc(it.d)}</div>` : ''}</div></div>`).join('')}</div>
  </div>
  <div style="position:absolute;left:90px;right:90px;bottom:70px;display:flex;justify-content:space-between;font:600 24px Manrope;color:${cl ? '#777' : C.mute}">${perfil(cl ? '#777' : C.mute)}<span>arrasta →</span></div>`; };
// Passo com prompt: número grande, título curto, explicação e a caixa "copie e cole" com o prompt.
L.passo = t => `<div style="position:absolute;inset:0;background:${C.bg}"></div>${grao}
  ${topoC(`PASSO ${t.n}`)}
  <div style="position:absolute;left:90px;right:90px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;gap:34px">
    <div style="display:flex;align-items:flex-end;gap:30px"><span style="${T};font-size:250px;line-height:.78;color:transparent;-webkit-text-stroke:3px ${C.areia}">${t.n}</span>
      <div style="${T};font-size:${t.ts ?? 116}px;line-height:.88;color:${C.txt};padding-bottom:6px">${tit(t.titulo)}</div></div>
    <div style="font:500 34px/1.45 Manrope;color:${C.txt};opacity:.85">${esc(t.texto)}</div>
    <div style="background:#1C1B19;border:1px solid #3a372f;border-radius:24px;overflow:hidden">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:20px 30px;background:#25231f;border-bottom:1px solid #3a372f;font:800 21px Manrope;letter-spacing:.24em;color:${C.areia}"><span>✦ PROMPT</span><span style="color:${C.mute};letter-spacing:.1em">copie e cole ⧉</span></div>
      <div style="padding:32px 34px;font:500 ${t.tp ?? 31}px/1.5 Manrope;color:#E9E4D8">${esc(t.prompt).replace(/\[(.+?)\]/g, `<span style="color:${C.areia};font-weight:700">[$1]</span>`)}</div></div>
  </div>${pe()}`;
// Convite para evento: data em destaque, título, texto e caixa de comentário.
L.evento = t => `${fundoFoto('100%', `rgba(18,18,18,.6) 0%,rgba(18,18,18,.4) 30%,${C.bg} 66%`)}
  <div style="position:absolute;left:90px;right:90px;top:80px;display:flex;justify-content:space-between;align-items:flex-start">${logo(54)}${perfil()}</div>
  <div style="position:absolute;left:90px;right:90px;top:${t.top ?? 300}px">
    <div style="display:inline-flex;align-items:stretch;border-radius:16px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,.4)"><span style="background:${C.areia};color:#111;padding:18px 26px;font:800 34px Manrope">${esc(t.dia)}</span><span style="background:#111;color:${C.areia};padding:18px 26px;font:800 34px Manrope;border:1px solid ${C.areia}55">${esc(t.hora)}</span></div>
    <div style="font:700 22px Manrope;letter-spacing:.3em;color:${C.areia};margin-top:44px">${esc(t.rotulo).toUpperCase()}</div>
    <div style="${T};font-size:${t.ts ?? 132}px;line-height:.86;color:${C.txt};margin-top:18px">${tit(t.titulo)}</div>
    <div style="font:500 31px/1.45 Manrope;color:${C.txt};opacity:.85;margin-top:30px">${esc(t.texto)}</div></div>
  <div style="position:absolute;left:90px;right:90px;bottom:90px">${comentario(t.hashtag, 34)}
    <div style="text-align:center;font:600 30px Manrope;color:${C.txt};margin-top:24px">${esc(t.cta).replace(esc(t.hashtag), `<b style="color:${C.areia}">${esc(t.hashtag)}</b>`)}</div></div>`;

// Catálogo de cursos, como a tela da plataforma: título e cartões de curso com "▶" em grade de 2 colunas.
L.catalogo = t => `<div style="position:absolute;inset:0;background:radial-gradient(110% 80% at 100% 0%,#2a271f 0%,${C.bg} 60%)"></div>${grao}
  ${topoC((t.rotulo ?? '').toUpperCase())}
  <div style="position:absolute;left:90px;right:90px;top:210px">
    <div style="${T};font-size:${t.ts ?? 120}px;line-height:.88;color:${C.txt}">${tit(t.titulo)}</div>
    ${t.texto ? `<div style="font:500 29px/1.4 Manrope;color:${C.txt};opacity:.75;margin-top:22px">${esc(t.texto)}</div>` : ''}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:40px">${t.cursos.map((c, i) => `<div style="position:relative;height:${t.alt ?? 150}px;border-radius:18px;overflow:hidden;border:1px solid #34322c;background:${['linear-gradient(135deg,#6b5a35,#2a2419)', 'linear-gradient(135deg,#3a3936,#1c1c1b)', 'linear-gradient(135deg,#cbbb8e,#7e6c43)', 'linear-gradient(135deg,#2f2e2b,#151514)'][i % 4]};padding:22px 24px;display:flex;flex-direction:column;justify-content:space-between">
      <span style="font:700 26px Manrope;color:${i % 4 === 2 ? '#121212' : C.txt}">▶</span><span style="font:800 ${t.tc ?? 28}px/1.15 Manrope;color:${i % 4 === 2 ? '#121212' : '#fff'}">${esc(c)}</span></div>`).join('')}</div></div>
  ${pe()}`;
// Notinha (cupom) com os bônus: itens "INCLUSO" e, depois do tracejado, os extras com selo próprio.
L.notinha = t => `<div style="position:absolute;inset:0;background:radial-gradient(110% 80% at 0% 0%,#2a271f 0%,${C.bg} 60%)"></div>${grao}
  ${topoC((t.rotulo ?? '').toUpperCase())}
  <div style="position:absolute;left:90px;right:90px;top:190px;${T};font-size:${t.ts ?? 110}px;line-height:.88;color:${C.txt}">${tit(t.titulo)}</div>
  <div style="position:absolute;left:110px;right:110px;top:${t.top ?? 430}px;background:#F4F1EA;color:#151515;padding:40px 40px 30px;transform:rotate(-1.5deg);box-shadow:0 30px 70px rgba(0,0,0,.6);font-family:'IBM Plex Mono',monospace">
    <div style="text-align:center;font-weight:700;font-size:34px;letter-spacing:.16em">PRATFLIX</div>
    <div style="text-align:center;font-size:19px;margin-top:6px">BÔNUS DA TURMA FUNDADORA</div>
    <div style="border-top:2px dashed #333;margin:18px 0 8px"></div>
    ${t.itens.map(([a, b]) => `<div style="display:flex;justify-content:space-between;gap:16px;font-size:23px;padding:6px 0"><span>${esc(a)}</span><b style="white-space:nowrap">${esc(b)}</b></div>`).join('')}
    ${t.extras ? `<div style="border-top:2px dashed #333;margin:10px 0 8px"></div>${t.extras.map(([a, b]) => `<div style="display:flex;justify-content:space-between;gap:16px;font-size:23px;padding:6px 0"><span>${esc(a)}</span><b style="white-space:nowrap;background:#121212;color:${C.areia};padding:0 8px">${esc(b)}</b></div>`).join('')}` : ''}
    <div style="border-top:2px dashed #333;margin:12px 0 12px"></div>
    <div style="display:flex;justify-content:space-between;font-weight:700;font-size:27px"><span>VOCÊ PAGA POR ELES</span><span>R$ 0,00</span></div>
    <div style="height:54px;margin-top:16px;background:repeating-linear-gradient(90deg,#151515 0 3px,transparent 3px 6px,#151515 6px 7px,transparent 7px 11px,#151515 11px 15px,transparent 15px 17px)"></div></div>
  ${pe()}`;
// Preço promocional: valor "de" riscado, parcela gigante, à vista, extras com ✓ e selo de prazo.
L.preco = t => `${fundoFoto('100%', `rgba(18,18,18,.82) 0%,rgba(18,18,18,.78) 30%,${C.bg} 62%`)}
  ${topoC('')}
  <div style="position:absolute;left:90px;right:90px;top:${t.top ?? 300}px">
    ${rotulo(t.rotulo)}
    <div style="font:600 34px Manrope;color:${C.mute};margin-top:44px">${esc(t.deTxt ?? "Tudo isso valeria")} <s style="text-decoration-color:${C.areia};text-decoration-thickness:3px">${esc(t.de)}</s></div>
    <div style="font:600 34px Manrope;color:${C.txt};margin-top:14px">Na turma fundadora, por</div>
    <div style="${T};font-size:${t.tp ?? 214}px;line-height:.9;white-space:nowrap;margin-top:10px;background:linear-gradient(180deg,#F4F0E4,${C.areia2});-webkit-background-clip:text;color:transparent">${esc(t.parcela)}</div>
    <div style="font:700 42px Manrope;color:${C.txt};margin-top:8px">ou <span style="color:${C.areia}">${esc(t.vista)}</span> à vista</div>
    <div style="display:flex;flex-direction:column;gap:14px;margin-top:44px">${t.extras.map(x => `<div style="font:600 30px Manrope;color:${C.txt}"><span style="color:${C.areia};margin-right:12px">✓</span>${esc(x)}</div>`).join('')}</div></div>
  <div style="position:absolute;left:90px;right:90px;bottom:70px;display:flex;justify-content:space-between;align-items:center">
    <span style="display:inline-flex;align-items:center;gap:14px;background:#C8372D;color:#fff;border-radius:12px;padding:16px 24px;font:800 24px Manrope;letter-spacing:.12em"><span style="width:12px;height:12px;border-radius:50%;background:#fff"></span>${esc(t.prazo)}</span>
    <span style="font:700 26px Manrope;color:${C.areia}">arrasta →</span></div>`;

// Frase de impacto: rótulo, título grande, texto e, opcional, um número/selo gigante vazado ao fundo (`fundo`).
L.frase = t => { const cl = t.claro; const cor = cl ? '#111' : C.txt;
  return `<div style="position:absolute;inset:0;background:${cl ? '#F4F1EA' : `radial-gradient(110% 80% at 100% 0%,#2a271f 0%,${C.bg} 60%)`}"></div>${grao}
  ${t.fundo ? `<div style="position:absolute;right:-40px;bottom:120px;${T};font-size:${t.fs ?? 560}px;line-height:.8;color:transparent;-webkit-text-stroke:3px ${cl ? '#d9cfb6' : '#3a362c'}">${esc(t.fundo)}</div>` : ''}
  <div style="position:absolute;left:90px;right:90px;top:80px;display:flex;justify-content:space-between;align-items:center">${logo(40, cor)}<span style="font:700 22px Manrope;color:${cl ? C.ouro : C.mute};letter-spacing:.2em">${esc(t.topo ?? '').toUpperCase()}</span></div>
  <div style="position:absolute;left:90px;right:90px;top:${t.top ?? 360}px">
    ${t.rotulo ? rotulo(t.rotulo, cl ? C.ouro : C.areia) : ''}
    <div style="${T};font-size:${t.ts ?? 130}px;line-height:.88;color:${cor};margin-top:30px">${tit(t.titulo, x => `<span style="color:${cl ? C.ouro : C.areia}">${x}</span>`)}</div>
    ${t.texto ? `<div style="font:500 34px/1.45 Manrope;color:${cor};opacity:${cl ? .8 : .82};margin-top:34px;max-width:860px">${esc(t.texto)}</div>` : ''}
    ${t.selos ? `<div style="display:flex;gap:14px;flex-wrap:wrap;margin-top:40px">${t.selos.map(x => `<span style="border:1.5px solid ${cl ? '#111' : C.areia}88;border-radius:12px;padding:14px 22px;font:700 26px Manrope;color:${cl ? '#111' : C.areia}">${esc(x)}</span>`).join('')}</div>` : ''}
  </div>
  <div style="position:absolute;left:90px;right:90px;bottom:70px;display:flex;justify-content:space-between;font:600 24px Manrope;color:${cl ? '#777' : C.mute}">${perfil(cl ? '#777' : C.mute)}<span>arrasta →</span></div>`; };
// Tabela de valores ("quanto custaria sozinho"): linhas com nome, detalhe e valor, e o total embaixo.
L.valores = t => `<div style="position:absolute;inset:0;background:#F4F1EA"></div>${grao}
  <div style="position:absolute;left:90px;right:90px;top:80px;display:flex;justify-content:space-between;align-items:center">${logo(40, '#111')}<span style="font:700 22px Manrope;color:${C.ouro};letter-spacing:.2em">${esc(t.rotulo ?? '').toUpperCase()}</span></div>
  <div style="position:absolute;left:90px;right:90px;top:180px">
    <div style="${T};font-size:${t.ts ?? 104}px;line-height:.88;color:#111">${tit(t.titulo, x => `<span style="color:${C.ouro}">${x}</span>`)}</div>
    <div style="margin-top:26px">${t.linhas.map(([n, d, v]) => `<div style="display:flex;align-items:baseline;gap:18px;padding:13px 0;border-bottom:1.5px dashed #c9bfa6">
      <div style="flex:1;font:800 29px Manrope;color:#111">${esc(n)} <span style="font:500 21px Manrope;color:#6f6a5f;margin-left:6px">${esc(d)}</span></div>
      <div style="${T};font-size:48px;color:${C.ouro};white-space:nowrap">${esc(v)}</div></div>`).join('')}</div>
    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:22px;background:#121212;border-radius:18px;padding:16px 30px"><span style="font:800 30px Manrope;color:#fff">SOMANDO TUDO</span><span style="${T};font-size:76px;color:${C.areia}">${esc(t.total)}</span></div></div>
  <div style="position:absolute;left:90px;right:90px;bottom:70px;display:flex;justify-content:space-between;font:600 24px Manrope;color:#777">${perfil('#777')}<span>arrasta →</span></div>`;

// ---- Variações de criativo (fotos do autor em fotos/libero-*.jpg, fora do git) ----
const fotoB64 = nome => 'data:image/jpeg;base64,' + fs.readFileSync(path.join(dir, 'fotos', nome)).toString('base64');
const fotoTom = 'filter:grayscale(.5) sepia(.32) brightness(.8) contrast(1.05)';
// Capa de carrossel com a foto do autor no alto (tons de areia) e o título embaixo.
L.capaFoto = t => `<img src="${fotoB64(t.foto)}" style="position:absolute;left:0;top:0;width:100%;height:${t.alt ?? 900}px;object-fit:cover;object-position:${t.fotoPos ?? '50% 20%'};${fotoTom}">
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(18,18,18,.5) 0%,rgba(18,18,18,0) 14%,rgba(18,18,18,.1) 34%,rgba(18,18,18,.9) 52%,${C.bg} 60%)"></div>${grao}
  <div style="position:absolute;left:90px;right:90px;top:80px;display:flex;justify-content:space-between;align-items:flex-start">${logo(54)}${perfil()}</div>
  <div style="position:absolute;left:90px;right:90px;top:${t.top ?? 660}px">
    ${rotulo(t.rotulo)}
    <div style="${T};font-size:${t.ts ?? 124}px;line-height:.86;color:${C.txt};margin-top:26px">${tit(t.titulo)}</div>
    ${t.texto ? `<div style="font:500 31px/1.42 Manrope;color:${C.txt};opacity:.82;margin-top:26px">${esc(t.texto)}</div>` : ''}</div>
  <div style="position:absolute;right:90px;bottom:70px;font:700 26px Manrope;color:${C.areia}">${esc(t.seta ?? 'arrasta →')}</div>`;
// Post estilo tweet: cartão com avatar, nome, @ e o texto; embaixo a caixa de comentário.
L.tweet = t => `<div style="position:absolute;inset:0;background:${t.claro ? '#F4F1EA' : `radial-gradient(110% 80% at 100% 0%,#2a271f 0%,${C.bg} 60%)`}"></div>${grao}
  <div style="position:absolute;left:80px;right:80px;top:80px;display:flex;justify-content:space-between;align-items:center">${logo(40, t.claro ? '#111' : C.txt)}<span style="font:700 22px Manrope;color:${t.claro ? C.ouro : C.mute};letter-spacing:.2em">${esc(t.rotulo ?? '').toUpperCase()}</span></div>
  <div style="position:absolute;left:80px;right:80px;top:${t.top ?? 250}px;background:${t.claro ? '#fff' : '#1A1A19'};border:1px solid ${t.claro ? '#e3ddcf' : '#30302d'};border-radius:36px;padding:54px 56px;box-shadow:0 30px 70px rgba(0,0,0,${t.claro ? .12 : .5})">
    <div style="display:flex;align-items:center;gap:22px">
      <img src="${fotoB64(t.foto)}" style="width:104px;height:104px;border-radius:50%;object-fit:cover;object-position:${t.fotoPos ?? '50% 18%'}">
      <div><div style="font:800 36px Manrope;color:${t.claro ? '#111' : '#fff'};display:flex;align-items:center;gap:10px">Líbero Filho <svg width="34" height="34" viewBox="0 0 24 24"><path fill="#1D9BF0" d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"/></svg></div>
      <div style="font:500 28px Manrope;color:${C.mute}">@liberofilho</div></div></div>
    <div style="font:500 ${t.tt ?? 46}px/1.36 Manrope;color:${t.claro ? '#111' : C.txt};margin-top:40px;letter-spacing:-.01em">${esc(t.texto).replace(/\n/g, '<br>').replace(/\[\[(.+?)\]\]/g, `<b style="color:${t.claro ? C.ouro : C.areia}">$1</b>`)}</div>
    <div style="display:flex;gap:46px;margin-top:40px;padding-top:26px;border-top:1px solid ${t.claro ? '#eee' : '#30302d'};font:600 26px Manrope;color:${C.mute}"><span>💬 ${esc(t.comentarios ?? '')}</span><span>🔁</span><span>♡</span><span style="margin-left:auto">${esc(t.hora ?? '')}</span></div></div>
  ${t.hashtag ? `<div style="position:absolute;left:80px;right:80px;bottom:150px">${comentario(t.hashtag)}</div><div style="position:absolute;left:80px;right:80px;bottom:80px;text-align:center;font:600 28px Manrope;color:${t.claro ? '#444' : C.txt}">Comenta <b style="color:${t.claro ? C.ouro : C.areia}">${esc(t.hashtag)}</b> que eu te mando o link</div>` : ''}`;
// Nota do iPhone: barra amarela, título em negrito e lista com bolinhas marcadas.
L.nota = t => `<div style="position:absolute;inset:0;background:${C.bg}"></div>${grao}
  <div style="position:absolute;left:80px;right:80px;top:80px;display:flex;justify-content:space-between;align-items:center">${logo(40)}${perfil(C.mute)}</div>
  <div style="position:absolute;left:80px;right:80px;top:${t.top ?? 230}px;padding-bottom:50px;background:#FFFDF7;border-radius:40px;overflow:hidden;box-shadow:0 30px 70px rgba(0,0,0,.55);font-family:-apple-system,'Manrope',sans-serif">
    <div style="display:flex;justify-content:space-between;align-items:center;padding:30px 40px 18px;color:#E0A100;font:600 30px Manrope"><span>‹ Notas</span><span>⋯</span></div>
    <div style="padding:6px 48px">
      <div style="font:600 22px Manrope;color:#999;text-align:center">${esc(t.data ?? '')}</div>
      <div style="font:800 ${t.ts ?? 52}px/1.15 Manrope;color:#111;margin-top:18px;letter-spacing:-.02em">${esc(t.titulo)}</div>
      ${t.texto ? `<div style="font:500 30px/1.4 Manrope;color:#333;margin-top:16px">${esc(t.texto)}</div>` : ''}
      <div style="display:flex;flex-direction:column;gap:${t.gap ?? 20}px;margin-top:28px">${t.itens.map(([feito, x]) => `<div style="display:flex;gap:20px;align-items:flex-start;font:500 ${t.ti ?? 32}px/1.3 Manrope;color:${feito ? '#999' : '#111'}"><span style="flex:none;width:40px;height:40px;border-radius:50%;margin-top:1px;${feito ? 'background:#E0A100;color:#fff;display:grid;place-items:center;font:800 24px Manrope' : 'border:2.5px solid #bbb'}">${feito ? '✓' : ''}</span><span style="${feito ? 'text-decoration:line-through' : ''}">${esc(x)}</span></div>`).join('')}</div></div></div>
  ${t.hashtag ? `<div style="position:absolute;left:80px;right:80px;bottom:90px">${comentario(t.hashtag)}</div>` : ''}`;
// Comparativo: duas colunas "sem" (risco) e "com" (areia), uma linha por situação.
L.versus = t => `<div style="position:absolute;inset:0;background:radial-gradient(110% 80% at 100% 0%,#2a271f 0%,${C.bg} 60%)"></div>${grao}
  ${topoC((t.rotulo ?? '').toUpperCase())}
  <div style="position:absolute;left:80px;right:80px;top:190px">
    <div style="${T};font-size:${t.ts ?? 104}px;line-height:.88;color:${C.txt}">${tit(t.titulo)}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:40px">
      <div style="font:800 22px Manrope;letter-spacing:.24em;color:${C.mute};padding:0 6px">${esc(t.a ?? 'SEM PRÁTICA')}</div><div style="font:800 22px Manrope;letter-spacing:.24em;color:${C.areia};padding:0 6px">${esc(t.b ?? 'COM A PRATFLIX')}</div>
      ${t.linhas.map(([x, y]) => `<div style="background:#1A1A19;border:1px solid #2f2f2c;border-radius:20px;padding:24px 26px;font:600 ${t.tl ?? 28}px/1.35 Manrope;color:${C.mute}"><span style="color:#C8372D;margin-right:8px">✕</span>${esc(x)}</div><div style="background:${C.areia};border-radius:20px;padding:24px 26px;font:700 ${t.tl ?? 28}px/1.35 Manrope;color:#121212"><span style="margin-right:8px">✓</span>${esc(y)}</div>`).join('')}
    </div></div>${pe()}`;
// Stories com foto do autor no alto, título e texto; `botao` embaixo para a figurinha de link.
L.storyFoto = t => `<img src="${fotoB64(t.foto)}" style="position:absolute;left:0;top:0;width:100%;height:1180px;object-fit:cover;object-position:${t.fotoPos ?? '50% 15%'};${fotoTom}">
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(18,18,18,.55) 0%,rgba(18,18,18,0) 14%,rgba(18,18,18,.1) 36%,rgba(18,18,18,.92) 54%,${C.bg} 62%)"></div>${grao}
  <div style="position:absolute;left:90px;right:90px;top:150px;display:flex;justify-content:space-between;align-items:flex-start">${logo(54)}${perfil()}</div>
  <div style="position:absolute;left:90px;right:90px;top:${t.top ?? 1000}px">
    ${rotulo(t.rotulo)}
    <div style="${T};font-size:${t.ts ?? 150}px;line-height:.86;color:${C.txt};margin-top:30px">${tit(t.titulo)}</div>
    ${t.texto ? `<div style="font:500 36px/1.42 Manrope;color:${C.txt};opacity:.85;margin-top:30px">${esc(t.texto)}</div>` : ''}</div>
  ${t.botao ? `<div style="position:absolute;left:90px;right:90px;bottom:250px;display:flex;justify-content:center"><span style="background:${C.areia};color:#111;border-radius:22px;padding:30px 46px;font:800 38px Manrope">${esc(t.botao)}</span></div>` : ''}`;
// Stories com enquete: pergunta grande e a figurinha de enquete do Insta (duas opções).
L.enquete = t => `<div style="position:absolute;inset:0;background:radial-gradient(90% 60% at 80% 10%,#2a271f 0%,${C.bg} 60%)"></div>${grao}
  <div style="position:absolute;left:90px;right:90px;top:150px;display:flex;justify-content:space-between;align-items:flex-start">${logo(54)}${perfil()}</div>
  <div style="position:absolute;left:90px;right:90px;top:${t.top ?? 420}px">
    ${t.rotulo ? rotulo(t.rotulo) : ''}
    <div style="${T};font-size:${t.ts ?? 150}px;line-height:.86;color:${C.txt};margin-top:30px">${tit(t.titulo)}</div>
    ${t.texto ? `<div style="font:500 36px/1.42 Manrope;color:${C.txt};opacity:.85;margin-top:30px">${esc(t.texto)}</div>` : ''}</div>
  <div style="position:absolute;left:150px;right:150px;top:${t.ey ?? 1180}px;background:#fff;border-radius:34px;padding:34px 34px 30px;box-shadow:0 24px 60px rgba(0,0,0,.5);transform:rotate(-2deg)">
    <div style="font:800 34px/1.25 Manrope;color:#111;text-align:center">${esc(t.pergunta)}</div>
    <div style="display:flex;flex-direction:column;gap:14px;margin-top:24px">${t.opcoes.map(o => `<div style="border:2px solid #e5e5e5;border-radius:999px;padding:20px 26px;font:700 32px Manrope;color:#111;text-align:center">${esc(o)}</div>`).join('')}</div></div>`;
// Stories com a caixa de perguntas do Insta (pergunta + "Escreva algo...").
L.pergunta = t => `${fundoFoto('1200px', `rgba(18,18,18,.55) 0%,rgba(18,18,18,.4) 30%,${C.bg} 60%`)}
  <div style="position:absolute;left:90px;right:90px;top:150px;display:flex;justify-content:space-between;align-items:flex-start">${logo(54)}${perfil()}</div>
  <div style="position:absolute;left:90px;right:90px;top:${t.top ?? 520}px">
    ${t.rotulo ? rotulo(t.rotulo) : ''}
    <div style="${T};font-size:${t.ts ?? 150}px;line-height:.86;color:${C.txt};margin-top:30px">${tit(t.titulo)}</div>
    ${t.texto ? `<div style="font:500 36px/1.42 Manrope;color:${C.txt};opacity:.85;margin-top:30px">${esc(t.texto)}</div>` : ''}</div>
  <div style="position:absolute;left:170px;right:170px;top:${t.ey ?? 1240}px;border-radius:34px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.5)">
    <div style="background:linear-gradient(135deg,${C.areia},${C.areia2});padding:36px 34px 30px;font:800 36px/1.25 Manrope;color:#121212;text-align:center">${esc(t.pergunta)}</div>
    <div style="background:#fff;padding:30px;text-align:center;font:500 30px Manrope;color:#aaa">Escreva algo...</div></div>`;

export function renderTela(t) {
  if (!L[t.layout]) throw new Error(`layout desconhecido: ${t.layout}`);
  const [w, h] = TAMANHOS[t.layout];
  return { w, h, html: `<!doctype html><html><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet"><style>*{margin:0;box-sizing:border-box}body{margin:0}</style></head>
<body><div style="width:${w}px;height:${h}px;position:relative;overflow:hidden;background:${C.bg}">${L[t.layout](t)}</div></body></html>` };
}

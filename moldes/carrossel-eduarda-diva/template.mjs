// Carrossel Eduarda Diva: capas no estilo das referências que a Eduarda mandou, quase iguais, com os efeitos.
//   capaFilme   (phanystudio) foto com granulado de filme, título condensado gigante com letra "gasta" (textura),
//               figurinhas de emoji e caixa preta com a frase de apoio.
//   capaDiva    (novela/diva) foto sem filtro, título arredondado grosso em 3D (branco e rosa) e figurinhas de emoji.
//   capaRecorte (Estúdio Huna) papel quadriculado, título condensado com palavras em caixa roxa tracejada e
//               a Eduarda recortada à direita, com cabeçalho e rodapé de revista.
// Slides internos no mesmo clima: texto (título condensado + caixa preta), lista (papel quadriculado),
// dado (número gigante) e cta (título 3D arredondado).
// Marcação: **negrito**, {rosa}, ==caixa roxa==, *cursiva*, \n quebra a linha.

const W = 1080, H = 1350;
const FONTES = 'https://fonts.googleapis.com/css2?family=Anton&family=Nunito:wght@800;900&family=Poppins:wght@400;500;600;700;800&family=Yellowtail&family=Noto+Color+Emoji&display=swap';
const R = { fucsia: '#EE2A8A', orquidea: '#F29AD8', roxo: '#7A2CC7', preto: '#161616', papel: '#F6F2EE', tinta: '#1B1B1B' };
const ANTON = "font-family:'Anton',sans-serif;font-weight:400";
const NUNITO = "font-family:'Nunito','Noto Color Emoji',sans-serif;font-weight:900";
const POP = "font-family:'Poppins','Noto Color Emoji',sans-serif";
const CURSIVA = "font-family:'Yellowtail',cursive;font-weight:400;text-transform:none;letter-spacing:0";
const EMOJI = "font-family:'Noto Color Emoji'";
const CLONE = 'box-decoration-break:clone;-webkit-box-decoration-break:clone';
const ARROBA = '@eduardacaraciolo';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
function fmt(t, m = {}) {
  return esc(t)
    .replace(/\*\*(.+?)\*\*/g, `<b style="${m.b || 'font-weight:700'}">$1</b>`)
    .replace(/==(.+?)==/g, `<span style="${m.hl || ''};${CLONE}">$1</span>`)
    .replace(/\{(.+?)\}/g, `<span style="${m.acc || `color:${R.fucsia}`}">$1</span>`)
    .replace(/\*(.+?)\*/g, `<span style="${CURSIVA};font-size:1.1em;${m.i ? 'color:' + m.i : ''}">$1</span>`)
    .replace(/\n/g, '<br>');
}
function img(ctx, nome, pos = 'center', filtro = '') {
  const src = nome && ctx.imgs[nome];
  if (src) return `<img data-foto src="${src}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${esc(pos)};${filtro ? 'filter:' + filtro : ''}">`;
  if (nome) ctx.faltando.add(nome);
  return `<div data-foto style="position:absolute;inset:0;background:linear-gradient(160deg,#F6D2E6,#E9A9CB)"></div>`;
}
// Figurinhas: [{e: "💫", x, y, s, r}] (x/y em px no slide, s = tamanho, r = rotação).
const figurinhas = v => lista(v).map(f => `<div data-livre style="position:absolute;left:${f.x}px;top:${f.y}px;${EMOJI};font-size:${f.s || 90}px;line-height:1;transform:rotate(${f.r || 0}deg);filter:drop-shadow(0 6px 10px rgba(0,0,0,.25));z-index:8">${f.e}</div>`).join('');

// Texturas (SVG): grão de filme e "desgaste" das letras (máscara com furinhos).
const svgUrl = s => `url("data:image/svg+xml;utf8,${s.replace(/#/g, '%23')}")`;
const GRAO = svgUrl(`<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`);
const GASTO = svgUrl(`<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='1.3' numOctaves='2' seed='4' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -12 8.6'/></filter><rect width='100%' height='100%' filter='url(#g)'/></svg>`);
// As texturas vão como classes no <style> (as aspas do SVG quebrariam o atributo style).
const grao = (op = .35, modo = 'overlay') => `<div class="grao" style="position:absolute;inset:0;opacity:${op};mix-blend-mode:${modo};pointer-events:none;z-index:6"></div>`;
const papel = (bg = R.papel) => `background-color:${bg}`;
const quadriculado = `background-color:${R.papel};background-image:linear-gradient(rgba(0,0,0,.06) 1.5px,transparent 1.5px),linear-gradient(90deg,rgba(0,0,0,.06) 1.5px,transparent 1.5px);background-size:40px 40px`;

// Título condensado (Anton) em linhas; {x} rosa, ==x== caixa roxa tracejada.
const anton = (t, px, cor = R.tinta, extra = '', cls = '') => `<div data-titulo class="${cls}" style="${ANTON};font-size:${px}px;line-height:.9;text-transform:uppercase;letter-spacing:-.005em;color:${cor};${extra}">${fmt(t, { acc: `color:${R.fucsia}`, hl: `background:${R.roxo};color:#fff;padding:0 .1em;outline:3px dashed rgba(0,0,0,.55);outline-offset:-2px` })}</div>`;
// Título arredondado 3D (Nunito 900).
const tres = (cor, sombra) => `color:${cor};text-shadow:0 2px 0 ${sombra[0]},0 4px 0 ${sombra[0]},0 6px 0 ${sombra[1]},0 8px 0 ${sombra[1]},0 10px 0 ${sombra[2]},0 22px 28px rgba(0,0,0,.35)`;
const BRANCO3D = tres('#fff', ['#EDE4EA', '#D9CCD5', '#C4B3BE']);
const ROSA3D = tres(R.orquidea, ['#E27FC4', '#CC67AE', '#B55197']);
const FUCSIA3D = tres(R.fucsia, ['#D21F77', '#B81966', '#9C1356']);
const diva3d = (t, px, al = 'center', acc = ROSA3D) => `<div data-titulo style="${NUNITO};font-size:${px}px;line-height:1.02;letter-spacing:-.02em;text-align:${al};${BRANCO3D}">${fmt(t, { acc })}</div>`;
const caixaPreta = (t, px = 44, extra = '') => `<div style="background:${R.preto};padding:34px 44px;${extra}"><div data-corpo style="${POP};font-weight:400;font-size:${px}px;line-height:1.15;letter-spacing:-.02em;color:#fff">${fmt(t, { b: 'font-weight:700;color:#fff', acc: `color:${R.orquidea};font-weight:700` })}</div></div>`;
const arroba = (cor = '#fff', y = 150) => `<div style="position:absolute;left:120px;top:${y}px;${POP};font-size:34px;letter-spacing:-.02em;color:${cor};opacity:.9;z-index:7"><span style="font-weight:400">@</span><b style="font-weight:700;color:${R.orquidea}">eduarda</b><span style="font-weight:400">caraciolo</span></div>`;
// Cabeçalho: só o nome, centralizado. Rodapé: só o @, centralizado.
const cabecalho = (cor = '#555') => `<div style="position:absolute;left:0;right:0;top:70px;text-align:center;${ANTON};font-size:30px;letter-spacing:.06em;color:${cor};z-index:7">EDUARDA CARACIOLO</div>`;
const rodape = (cor = R.tinta) => `<div style="position:absolute;left:0;right:0;bottom:60px;text-align:center;${POP};font-weight:700;font-size:26px;letter-spacing:.04em;color:${cor};z-index:7">${ARROBA}</div>`;

const TIPOS = {
  capaFilme(s, ctx) {
    return `<div style="position:absolute;inset:0;background:#3a2f2a">
      ${img(ctx, s.foto, s.fotoPos, s.filtro ?? 'contrast(1.04)')}
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 60%,rgba(0,0,0,.2) 100%);z-index:1"></div>
      ${arroba(s.corTitulo || '#f3eee8', s.arrobaY || 170)}
      <div data-area style="position:absolute;left:110px;right:${s.direita ?? 170}px;top:${s.tituloY || 240}px;z-index:4">
        ${anton(s.titulo, s.ts || 200, s.corTitulo || '#F3EFEA', 'line-height:.86;padding:.24em 0;margin:-.24em 0', 'gasto')}
      </div>
      ${s.texto ? `<div data-area style="position:absolute;left:150px;right:${s.caixaDireita ?? 230}px;top:${s.caixaY || 1140}px;z-index:5">${caixaPreta(s.texto, s.caixaTam || 46, 'text-align:center')}</div>` : ''}
      ${figurinhas(s.figurinhas)}${grao(.22)}</div>`;
  },
  capaDiva(s, ctx) {
    return `<div style="position:absolute;inset:0;background:#caa">
      ${img(ctx, s.foto, s.fotoPos)}
      <div data-area style="position:absolute;left:80px;right:80px;top:${s.tituloY || 640}px;z-index:4">${diva3d(s.titulo, s.ts || 150)}</div>
      ${figurinhas(s.figurinhas)}</div>`;
  },
  capaRecorte(s, ctx) {
    const src = s.foto && ctx.imgs[s.foto];
    if (s.foto && !src) ctx.faltando.add(s.foto);
    const rec = src ? `<img data-foto src="${src}" style="position:absolute;right:${s.recorteDireita ?? -40}px;bottom:${s.recorteBaixo ?? 0}px;height:${s.recorteAltura || 900}px;z-index:2;filter:drop-shadow(0 20px 30px rgba(0,0,0,.18));-webkit-mask-image:linear-gradient(180deg,#000 85%,transparent 100%);mask-image:linear-gradient(180deg,#000 85%,transparent 100%)">` : '';
    return `<div style="position:absolute;inset:0;${quadriculado}">${cabecalho()}${rec}
      <div data-area style="position:absolute;left:100px;right:${s.direita ?? 470}px;top:240px;bottom:250px;display:flex;flex-direction:column;justify-content:center;z-index:4">
        ${anton(s.titulo, s.ts || 150, R.tinta, 'line-height:1.02')}
      </div>
      ${rodape()}${grao(.18, 'multiply')}</div>`;
  },
  // Texto: título condensado + caixa preta (clima da capa filme), fundo papel.
  texto(s) {
    return `<div style="position:absolute;inset:0;${papel()}">${cabecalho('#777')}
      <div data-area style="position:absolute;left:100px;right:100px;top:190px;bottom:190px;display:flex;flex-direction:column;justify-content:center;gap:50px;z-index:3">
        ${s.kicker ? `<div data-corpo style="${POP};font-weight:600;font-size:32px;color:${R.fucsia}">${fmt(s.kicker)}</div>` : ''}
        ${anton(s.titulo, s.ts || 120)}
        ${s.caixa ? caixaPreta(s.caixa, s.caixaTam || 40) : ''}
      </div>
      ${figurinhas(s.figurinhas)}${rodape()}${grao(.22, 'multiply')}</div>`;
  },
  // Lista em papel quadriculado: número rosa condensado, fios tracejados.
  lista(s) {
    return `<div style="position:absolute;inset:0;${quadriculado}">${cabecalho()}
      <div data-area style="position:absolute;left:100px;right:100px;top:180px;bottom:180px;display:flex;flex-direction:column;justify-content:center;gap:36px;z-index:3">
        ${anton(s.titulo, s.ts || 104)}
        <div style="border-top:2.5px dashed ${R.tinta}">
          ${lista(s.itens).map((t, i) => {
            const [a, b] = String(t).split('→').map(x => x.trim());
            return `<div style="display:flex;align-items:center;gap:30px;padding:22px 0;border-bottom:2.5px dashed ${R.tinta}"><span style="${ANTON};font-size:66px;line-height:1;color:${R.fucsia};width:70px;flex:none">${s.contagem ? esc(s.contagem[i] ?? '') : i + 1}</span><div data-corpo style="${POP};font-weight:500;font-size:32px;line-height:1.2;letter-spacing:-.02em;color:${R.tinta}">${fmt(a, { b: 'font-weight:800' })}${b ? ` <span style="color:${R.fucsia}">→</span> <b style="font-weight:800;${'color:' + R.roxo}">${fmt(b)}</b>` : ''}</div></div>`;
          }).join('')}
        </div>
      </div>
      ${figurinhas(s.figurinhas)}${rodape()}${grao(.18, 'multiply')}</div>`;
  },
  // Número gigante (dado da prova).
  dado(s) {
    return `<div style="position:absolute;inset:0;background:${R.fucsia}">${cabecalho('rgba(255,255,255,.85)')}
      <div data-area style="position:absolute;left:100px;right:100px;top:170px;bottom:190px;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;gap:26px;z-index:3">
        ${s.kicker ? `<div data-corpo style="${POP};font-weight:600;font-size:32px;color:#fff">${fmt(s.kicker)}</div>` : ''}
        <div class="gasto" style="${ANTON};font-size:${s.numeroTam || 420}px;line-height:.85;color:#fff">${esc(s.numero)}</div>
        ${anton(s.titulo, s.ts || 96, '#fff')}
        ${s.caixa ? caixaPreta(s.caixa, 36) : ''}
      </div>
      ${figurinhas(s.figurinhas)}${rodape('#fff')}${grao(.3)}</div>`;
  },
  cta(s, ctx) {
    const foto = s.foto ? img(ctx, s.foto, s.fotoPos) + '<div style="position:absolute;inset:0;background:rgba(0,0,0,.18)"></div>' : '';
    return `<div style="position:absolute;inset:0;background:${R.orquidea}">${foto}
      <div data-area style="position:absolute;left:90px;right:90px;top:220px;bottom:220px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:50px;z-index:3">
        ${diva3d(s.titulo, s.ts || 120, 'center', FUCSIA3D)}
        ${s.texto ? caixaPreta(s.texto, 34, 'text-align:center') : ''}
        ${s.botao ? `<div style="background:#fff;color:${R.fucsia};${POP};font-weight:800;font-size:34px;padding:18px 48px;border-radius:999px;box-shadow:0 10px 0 ${R.fucsia}">${fmt(s.botao)}</div>` : ''}
      </div>
      ${figurinhas(s.figurinhas)}</div>`;
  },
};

export function renderCarrossel(c) {
  const ctx = { imgs: c._imgs || {}, faltando: new Set() };
  const avisos = [];
  const slides = (c.slides || []).map((s, i) => {
    const f = TIPOS[s.tipo];
    if (!f) { avisos.push(`slide ${i + 1}: tipo "${s.tipo}" não existe (${Object.keys(TIPOS).join(', ')})`); return ''; }
    return `<div id="slide-${i + 1}" style="position:absolute;left:${i * W}px;top:0;width:${W}px;height:${H}px;overflow:hidden">${f(s, ctx, c)}</div>`;
  });
  ctx.faltando.forEach(n => avisos.push(`foto não encontrada: ${n} (coloque em fotos/)`));
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet">
<style>*{box-sizing:border-box}body{margin:0;-webkit-font-smoothing:antialiased}
.grao{background-image:${GRAO}}
.gasto{-webkit-mask-image:${GASTO};mask-image:${GASTO};-webkit-mask-size:220px;mask-size:220px}</style></head><body>
<div id="painel" style="position:relative;width:${slides.length * W}px;height:${H}px">${slides.join('\n')}</div></body></html>`;
  return { html, total: slides.length, avisos };
}

// Molde "Concurso Nativo" (@concursocomlibero): foto em tela cheia (4:5, 1080×1350) com elementos nativos do
// Instagram, como o Carrossel Nativo do @liberofilho, mas com outra cara: texto nos estilos "máquina de escrever"
// (Courier) e "forte" (condensado, caixa alta) nas cores do @concursocomlibero, e figurinhas dos stories
// (enquete, quiz, caixa de perguntas, link e menção).
//
// Slide: { foto, fotoPos, escurecer, tom (véu verde 0–1), elementos: [...] }
// Elemento (todos têm "y": px do topo, ou "topo" | "meio" | "base"; "largura", "lado" e "escala" opcionais):
//   texto    { texto ("\n" quebra), estilo: "maquina" | "forte", cor, tam }
//   enquete  { pergunta, opcoes: [a, b], votos?: [%, %] }
//   quiz     { pergunta, opcoes: [...], certa (0 = A), revelar?: true }
//   pergunta { titulo, resposta? }            (caixa de perguntas)
//   link     { texto }                        (figurinha de link)
//   mencao   { texto? }                       (figurinha @concursocomlibero)
const CORES = {
  escuro: ['#06201D', '#F5C53D'], profundo: ['#0D3D38', '#FFFFFF'], branco: ['#FFFFFF', '#0D3D38'],
  amarelo: ['#F5C53D', '#06201D'], verde: ['#1F8F7F', '#FFFFFF'], menta: ['#BFE6DD', '#06201D'],
  roxo: ['#2E1A7A', '#FFFFFF'], vermelho: ['#C0392B', '#FFFFFF'], preto: ['#000000', '#FFFFFF'],
};
const POS = { topo: 140, meio: 560, base: 980 };
const H = 1350;
const PERFIL = '@concursocomlibero';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
const MAQ = "font-family:'Courier Prime','Noto Color Emoji',monospace;font-weight:700";
const FORTE = "font-family:'Anton','Noto Color Emoji',sans-serif;font-weight:400;text-transform:uppercase";
const UI = "font-family:'Inter','Noto Color Emoji',sans-serif";
const GRAD = 'linear-gradient(120deg,#2E1A7A 0%,#1F8F7F 60%,#F5C53D 100%)';
const yDe = e => typeof e.y === 'number' ? e.y : POS[e.y] ?? POS.meio;
// "lado": "esquerda" | "direita" encosta o elemento na margem; "escala" (ex.: 0.7) diminui a figurinha.
const LADO = { esquerda: ['flex-start', 'top left'], direita: ['flex-end', 'top right'] };
const caixa = (e, html) => {
  const [jc, origem] = LADO[e.lado] || ['center', 'top center'];
  const esc = e.escala && e.escala !== 1;
  return `<div data-bloco style="position:absolute;left:0;right:0;top:${yDe(e)}px;padding:0 60px;display:flex;justify-content:${jc};z-index:3${esc ? `;height:0` : ''}">${esc ? `<div style="transform:scale(${e.escala});transform-origin:${origem}">${html}</div>` : html}</div>`;
};
const sombra = 'box-shadow:0 14px 34px rgba(0,0,0,.28)';

const ELEMENTOS = {
  // Texto nativo: "maquina" (cada linha numa caixa reta) ou "forte" (caixa alta condensada, levemente inclinada).
  texto(e) {
    const [bg, fg] = CORES[e.cor] || CORES.escuro;
    const forte = e.estilo === 'forte';
    const tam = e.tam || (forte ? 96 : 54);
    const linhas = esc(e.texto).replace(/\*\*(.+?)\*\*/g, '$1').split('\n');
    return caixa(e, `<div style="max-width:${e.largura || 960}px;text-align:center;${forte ? FORTE : MAQ};font-size:${tam}px;line-height:${forte ? 1.24 : 1.3};${forte ? 'transform:rotate(-2deg)' : ''}">
      ${linhas.map(l => `<span style="background:${bg};color:${fg};padding:${forte ? '.04em .3em 0' : '.1em .36em .12em'};border-radius:${forte ? '.08em' : '.14em'};box-decoration-break:clone;-webkit-box-decoration-break:clone">${l}</span>`).join('<br>')}</div>`);
  },
  // Enquete: cartão branco, pergunta e duas opções (com % se houver "votos").
  enquete(e) {
    const votos = lista(e.votos);
    return caixa(e, `<div style="width:${e.largura || 660}px;background:#fff;border-radius:34px;padding:34px 30px 30px;${sombra};${UI};text-align:center">
      <div style="font-size:40px;font-weight:800;line-height:1.2;color:#111;margin-bottom:24px">${esc(e.pergunta)}</div>
      <div style="display:flex;flex-direction:column;gap:14px">${lista(e.opcoes).map((o, i) => `<div style="position:relative;overflow:hidden;border-radius:22px;background:#EFEFF1;padding:22px 26px;display:flex;justify-content:space-between;font-size:34px;font-weight:700;color:#111">
        ${votos[i] != null ? `<div style="position:absolute;left:0;top:0;bottom:0;width:${votos[i]}%;background:${i ? '#BFE6DD' : '#F5C53D'}"></div>` : ''}<div style="position:relative">${esc(o)}</div>${votos[i] != null ? `<div style="position:relative">${votos[i]}%</div>` : ''}</div>`).join('')}</div></div>`);
  },
  // Quiz: faixa em degradê com a pergunta e as alternativas; com "revelar", a certa fica verde com ✓.
  quiz(e) {
    return caixa(e, `<div style="width:${e.largura || 760}px;border-radius:34px;overflow:hidden;${sombra};${UI}">
      <div style="background:${GRAD};padding:30px 34px;font-size:40px;font-weight:800;line-height:1.2;color:#fff;text-align:center">${esc(e.pergunta)}</div>
      <div style="background:#fff;padding:22px;display:flex;flex-direction:column;gap:12px">${lista(e.opcoes).map((o, i) => {
        const certa = e.revelar && i === e.certa, apagada = e.revelar && i !== e.certa;
        return `<div style="display:flex;align-items:center;gap:18px;border-radius:20px;padding:16px 20px;background:${certa ? '#1F8A5B' : '#F2F2F4'};opacity:${apagada ? .55 : 1}">
          <div style="flex:none;width:50px;height:50px;border-radius:50%;background:${certa ? '#fff' : '#fff'};border:3px solid ${certa ? '#fff' : '#D4D4DA'};display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:800;color:${certa ? '#1F8A5B' : '#555'}">${certa ? '✓' : 'ABCD'[i]}</div>
          <div style="font-size:32px;font-weight:700;line-height:1.2;color:${certa ? '#fff' : '#111'}">${esc(o)}</div></div>`;
      }).join('')}</div></div>`);
  },
  // Caixa de perguntas: topo em degradê com o título e o campo branco (com a resposta, se houver).
  pergunta(e) {
    return caixa(e, `<div style="width:${e.largura || 700}px;border-radius:34px;overflow:hidden;${sombra};${UI};text-align:center;background:#fff">
      <div style="background:${GRAD};padding:30px 30px 26px;font-size:38px;font-weight:800;line-height:1.2;color:#fff">${esc(e.titulo || 'Me faça uma pergunta')}</div>
      <div style="margin:22px;border-radius:20px;background:#F2F2F4;padding:24px;font-size:32px;font-weight:${e.resposta ? 700 : 500};line-height:1.25;color:${e.resposta ? '#111' : '#9A9AA2'}">${esc(e.resposta || 'Digite algo...')}</div></div>`);
  },
  // Figurinha de link: pílula branca com o ícone de corrente e o texto em caixa alta.
  link(e) {
    return caixa(e, `<div style="display:inline-flex;align-items:center;gap:16px;background:#fff;border-radius:22px;padding:16px 28px;${sombra};${UI};font-size:34px;font-weight:800;letter-spacing:.02em;color:#1F8F7F;text-transform:uppercase">
      <svg width="40" height="40" viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" stroke="#1F8F7F" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>${esc(e.texto)}</div>`);
  },
  // Figurinha de menção: @ em degradê numa pílula branca.
  mencao(e) {
    return caixa(e, `<div style="display:inline-block;background:#fff;border-radius:18px;padding:14px 26px;${sombra};${UI};font-size:34px;font-weight:900;text-transform:uppercase;letter-spacing:.01em"><span style="background:${GRAD};-webkit-background-clip:text;background-clip:text;color:transparent">${esc(e.texto || PERFIL)}</span></div>`);
  },
};

export function renderCarrossel(c) {
  const slides = lista(c.slides);
  const avisos = [];
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Courier+Prime:wght@700&family=Anton&family=Inter:wght@500;700;800;900&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box}body{margin:0;-webkit-font-smoothing:antialiased}</style></head><body>
<div id="painel" style="position:relative;width:${slides.length * 1080}px;height:${H}px">
${slides.map((s, i) => {
    const foto = s.foto && (c._fotos || {})[s.foto];
    if (s.foto && !foto) avisos.push(`slide ${i + 1}: foto não encontrada: ${s.foto} (coloque em fotos/)`);
    lista(s.elementos).forEach(e => {
      if (!ELEMENTOS[e.tipo || 'texto']) avisos.push(`slide ${i + 1}: elemento "${e.tipo}" não existe (${Object.keys(ELEMENTOS).join(', ')})`);
      if (e.cor && !CORES[e.cor]) avisos.push(`slide ${i + 1}: cor "${e.cor}" não existe (${Object.keys(CORES).join(', ')})`);
      if (/[—–]/.test(JSON.stringify(e))) avisos.push(`slide ${i + 1}: tem travessão (o perfil não usa)`);
    });
    return `<div id="slide-${i + 1}" style="position:absolute;left:${i * 1080}px;top:0;width:1080px;height:${H}px;overflow:hidden;background:#06201D">
  ${foto ? `<img data-foto src="${foto}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${esc(s.fotoPos || 'center')}">` : ''}
  ${s.tom ? `<div style="position:absolute;inset:0;background:#0D3D38;mix-blend-mode:color;opacity:${s.tom}"></div>` : ''}
  ${s.escurecer ? `<div style="position:absolute;inset:0;background:rgba(0,0,0,${s.escurecer})"></div>` : ''}
  ${lista(s.elementos).map(e => (ELEMENTOS[e.tipo || 'texto'] || ELEMENTOS.texto)(e)).join('')}
</div>`;
  }).join('\n')}
</div></body></html>`;
  return { html, total: slides.length, avisos, altura: H };
}

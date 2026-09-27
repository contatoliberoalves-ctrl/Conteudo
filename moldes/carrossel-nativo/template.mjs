// Molde "Carrossel Nativo" (@liberofilho): foto em tela cheia (3:4, 1080×1440) + frases no estilo do
// texto nativo do Instagram (fonte Classic, cada linha num balão arredondado), opcionalmente com um
// print no meio. Feito para produzir em quantidade: cada slide é só foto + blocos de texto.
//
// Slide: { foto, fotoPos, escurecer, blocos: [{ texto, cor, tam, y, largura }], print: { img, y, largura, raio } }
//   texto  — "\n" quebra a linha; **negrito** não muda nada (o nativo é todo em negrito).
//   cor    — preto, branco, bege, marrom, rosa, lilas, verde, menta, ciano, noite (ver CORES).
//   tam    — corpo do texto em px (padrão 60); y — topo do bloco em px (0–1440) ou "topo", "meio", "base".
//   largura— largura máxima do texto em px (padrão 900); o bloco fica centralizado.
const CORES = {
  preto: ['#000000', '#FFFFFF'], branco: ['#FFFFFF', '#000000'],
  bege: ['#E3B48A', '#272119'], marrom: ['#5A4636', '#FFFFFF'], rosa: ['#C56A7C', '#FFF1F4'],
  lilas: ['#E5E1FC', '#3D1DA3'], verde: ['#2E3F1A', '#E9F4DB'], menta: ['#29FFA1', '#171E18'],
  ciano: ['#01FEE9', '#173332'], noite: ['#151B1B', '#49E3E1'],
};
const POS = { topo: 170, meio: 620, base: 1080 };
const H = 1440;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const FONTE = "'Figtree','Noto Color Emoji',sans-serif";

function bloco(b) {
  const [bg, fg] = CORES[b.cor] || CORES.preto;
  const tam = b.tam || 60, y = typeof b.y === 'number' ? b.y : POS[b.y] ?? POS.meio;
  const linhas = esc(b.texto).replace(/\*\*(.+?)\*\*/g, '$1').split('\n');
  return `<div data-bloco style="position:absolute;left:0;right:0;top:${y}px;display:flex;justify-content:center;z-index:3">
    <div style="max-width:${b.largura || 900}px;text-align:center;font-family:${FONTE};font-weight:800;font-size:${tam}px;line-height:1.32;letter-spacing:-.005em">
      ${linhas.map(l => `<span style="background:${bg};color:${fg};padding:.16em .48em .2em;border-radius:.34em;box-decoration-break:clone;-webkit-box-decoration-break:clone">${l}</span>`).join('<br>')}
    </div></div>`;
}

export function renderCarrossel(c) {
  const slides = c.slides || [];
  const avisos = [];
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@800&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box}body{margin:0;-webkit-font-smoothing:antialiased}</style></head><body>
<div id="painel" style="position:relative;width:${slides.length * 1080}px;height:${H}px">
${slides.map((s, i) => {
    const foto = s.foto && (c._fotos || {})[s.foto];
    if (s.foto && !foto) avisos.push(`slide ${i + 1}: foto não encontrada: ${s.foto} (coloque em fotos/)`);
    const pr = s.print, prSrc = pr && (c._fotos || {})[pr.img];
    if (pr && !prSrc) avisos.push(`slide ${i + 1}: print não encontrado: ${pr.img} (coloque em prints/)`);
    lista(s.blocos).forEach(b => { if (b.cor && !CORES[b.cor]) avisos.push(`slide ${i + 1}: cor "${b.cor}" não existe (${Object.keys(CORES).join(', ')})`); });
    return `<div id="slide-${i + 1}" style="position:absolute;left:${i * 1080}px;top:0;width:1080px;height:${H}px;overflow:hidden;background:#222">
  ${foto ? `<img data-foto src="${foto}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${esc(s.fotoPos || 'center')}">` : ''}
  ${s.escurecer ? `<div style="position:absolute;inset:0;background:rgba(0,0,0,${s.escurecer})"></div>` : ''}
  ${prSrc ? `<img src="${prSrc}" style="position:absolute;left:50%;top:${typeof pr.y === 'number' ? pr.y : POS[pr.y] ?? 420}px;transform:translateX(-50%);width:${pr.largura || 820}px;border-radius:${pr.raio ?? 26}px;box-shadow:0 18px 40px rgba(0,0,0,.35);z-index:2">` : ''}
  ${lista(s.blocos).map(bloco).join('')}
</div>`;
  }).join('\n')}
</div></body></html>`;
  return { html, total: slides.length, avisos, altura: H };
}
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);

// Modelo visual do carrossel "Estrutura de Peças" — gera um painel 3240×1350 (3 slides de 1080×1350).
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function renderCarrossel(c) {
  const light = c.tema === 'claro';
  const T = {
    cardBg: light ? '#F4F3EE' : '#3A4A44', cardInk: light ? '#2E3A36' : '#EEF0EA', cardHead: light ? '#3A4A44' : '#FFFFFF',
    cardRule: light ? 'rgba(58,74,68,.16)' : 'rgba(255,255,255,.14)', cardLine: light ? 'rgba(58,74,68,.07)' : 'rgba(255,255,255,.05)',
    s3Bg: light ? '#3A4A44' : '#F4F3EE', s3Ink: light ? '#FFFFFF' : '#3A4A44', s3Line: light ? 'rgba(255,255,255,.05)' : 'rgba(58,74,68,.07)',
    ctaBg: light ? '#FFFFFF' : '#3A4A44', ctaInk: light ? '#3A4A44' : '#FFFFFF',
  };
  const titulo = c.titulo.map(l => l.toUpperCase());
  const maxLen = Math.max(...titulo.map(l => l.length));
  const titleSize = Math.min(230, Math.round(880 / (maxLen * 0.4)));
  const titleLH = titulo.length > 1 ? .96 : .86;
  const itens = c.topicos.map((t, i) => {
    const m = t.match(/^(.*?)\s*\((.*)\)\s*;?$/);
    return { n: String(i + 1).padStart(2, '0'), text: m ? m[1] : t, note: m ? m[2] : '' };
  });
  const dense = itens.length >= 7 || itens.filter(i => i.note).length >= 2;
  const extra = itens.length >= 8;
  const topGap = extra ? 36 : dense ? 60 : 110, ruleGap = extra ? 28 : dense ? 40 : 60, rowPad = extra ? 6 : dense ? 9 : 13;
  const handle = `@CONSTITUCIONAL<b style="font-weight:700">GABARITADO</b>`;
  const bebas = `font-family:'Bebas Neue',sans-serif`;

  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box}body{margin:0;font-family:Poppins,sans-serif}</style></head><body>
<div id="painel" style="position:relative;width:3240px;height:1350px;overflow:hidden;background:${T.s3Bg}">
  <div style="position:absolute;left:2160px;top:0;width:1080px;height:1350px;background-image:repeating-radial-gradient(circle at 80% 30%,transparent 0 38px,${T.s3Line} 38px 40px);opacity:.5"></div>

  <!-- SLIDE 1: capa -->
  <div style="position:absolute;left:0;top:0;width:1080px;height:1350px;background:#141412;overflow:hidden">
    <img src="${c.foto}" style="position:absolute;left:0;top:0;width:1020px;height:${c.fotoAltura || 1000}px;object-fit:cover;object-position:center top;-webkit-mask-image:linear-gradient(180deg,#000 80%,transparent 100%)">
    <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(20,20,18,.15) 0%,rgba(20,20,18,0) 30%,rgba(20,20,18,.55) 50%,#141412 66%)"></div>
    <div style="position:absolute;left:84px;right:120px;bottom:190px;display:flex;flex-direction:column;gap:20px">
      <div style="display:flex;align-items:center;gap:18px">
        <span style="width:64px;height:5px;background:#8DC63F"></span>
        <span style="font-size:34px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#8DC63F">${esc(c.kicker || 'Estrutura de Peças')}</span>
      </div>
      <div style="${bebas};font-size:${titleSize}px;line-height:${titleLH};color:#fff">${titulo.map(l => `<div>${esc(l)}</div>`).join('')}</div>
    </div>
    <div style="position:absolute;left:84px;right:120px;bottom:84px;display:flex;justify-content:space-between;align-items:center;color:#fff;font-size:26px;letter-spacing:.04em">
      <span style="font-weight:300">${handle}</span>
      <span style="display:flex;align-items:center;gap:12px;font-weight:500;opacity:.85">Arraste <span style="font-size:34px;color:#8DC63F">→</span></span>
    </div>
  </div>

  <!-- SLIDE 2: estrutura (card atravessa a divisa dos slides) -->
  <div style="position:absolute;left:1020px;top:0;width:1200px;height:1350px;border-radius:64px 64px 0 0;background:${T.cardBg};color:${T.cardInk};overflow:hidden">
    <div style="position:absolute;inset:0;background-image:repeating-radial-gradient(circle at 20% 70%,transparent 0 46px,${T.cardLine} 46px 48px);opacity:.5"></div>
    <div style="position:relative;height:100%;padding:70px 110px 90px 120px;display:flex;flex-direction:column">
      <div style="align-self:center;font-size:24px;letter-spacing:.04em;font-weight:300;margin-bottom:${topGap}px;margin-left:-60px">${handle}</div>
      <div style="display:flex;flex-direction:column;gap:18px">
        <div style="display:flex;align-items:baseline;gap:22px">
          <span style="${bebas};font-size:44px;color:#8DC63F">01</span>
          <span style="${bebas};font-size:92px;line-height:.9;color:${T.cardHead}">${esc(c.bloco1 || 'Endereçamento')}</span>
        </div>
        <div style="font-size:34px;line-height:1.4;padding-left:66px;max-width:860px;text-wrap:pretty">${esc(c.enderecamento)}</div>
      </div>
      <div style="height:2px;background:${T.cardRule};margin:${ruleGap}px 0 ${ruleGap}px 66px"></div>
      <div style="display:flex;align-items:baseline;gap:22px">
        <span style="${bebas};font-size:44px;color:#8DC63F">02</span>
        <span style="${bebas};font-size:80px;line-height:.92;color:${T.cardHead};max-width:880px;text-wrap:balance">${esc(c.qualificacao || 'Qualificação e identificação da peça')}</span>
      </div>
      <div style="display:flex;flex-direction:column;padding-left:66px;margin-top:34px;max-width:880px">
        ${itens.map(it => `<div style="display:grid;grid-template-columns:62px minmax(0,1fr);align-items:baseline;padding:${rowPad}px 0;border-bottom:1px solid ${T.cardRule}">
          <span style="${bebas};font-size:40px;color:#8DC63F">${it.n}</span>
          <div style="display:flex;flex-direction:column;gap:4px">
            <span style="font-size:33px;font-weight:500;line-height:1.3">${esc(it.text)}</span>
            ${it.note ? `<span style="font-size:25px;line-height:1.4;opacity:.72;text-wrap:pretty">${esc(it.note)}</span>` : ''}
          </div></div>`).join('')}
      </div>
      <div style="margin-top:auto;padding-top:36px;padding-left:66px;display:flex">
        <span style="display:flex;align-items:center;gap:16px;border:2px solid #8DC63F;border-radius:999px;padding:14px 34px;font-size:30px;font-weight:600">
          <span style="width:12px;height:12px;border-radius:50%;background:#8DC63F"></span>${esc(c.valor || 'Valor da Causa')}</span>
      </div>
    </div>
  </div>

  <!-- SLIDE 3: CTA -->
  <div style="position:absolute;left:2220px;top:0;width:1020px;height:1350px;display:flex;flex-direction:column;align-items:center;padding:140px 90px 120px 90px">
    <div style="font-size:30px;letter-spacing:.04em;font-weight:300;color:${T.s3Ink}">${handle}</div>
    <div style="margin-top:auto;width:100%;background:${T.ctaBg};border-radius:40px;padding:64px 56px 60px;display:flex;flex-direction:column;align-items:center;gap:36px;box-shadow:0 40px 80px rgba(0,0,0,.18)">
      <span style="width:120px;height:5px;background:#8DC63F;border-radius:3px"></span>
      <div style="${bebas};font-size:112px;line-height:.92;text-align:center;color:${T.ctaInk};text-wrap:balance">${esc(c.ctaTitulo || 'Gostou de aprender o funcionamento da peça?')}</div>
      <div style="font-size:34px;font-weight:600;color:#8DC63F;text-align:center">${esc(c.ctaSub || 'Então já salva pra revisar depois')}</div>
    </div>
    <div style="display:flex;gap:18px;margin-top:40px">
      ${['SALVAR', 'COMPARTILHAR'].map(t => `<span style="font-size:24px;font-weight:600;letter-spacing:.08em;color:${T.s3Ink};border:2px solid ${T.s3Ink};border-radius:999px;padding:10px 26px;opacity:.8">${t}</span>`).join('')}
    </div>
    <div style="margin-top:auto;width:200px;height:200px;border-radius:50%;background:#F4F3EE;display:flex;align-items:center;justify-content:center;box-shadow:0 20px 40px rgba(0,0,0,.15)">
      <img src="../assets/logo.png" style="width:160px;height:160px;object-fit:contain;mix-blend-mode:multiply">
    </div>
  </div>
</div></body></html>`;
}

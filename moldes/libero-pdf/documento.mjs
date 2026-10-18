// Documento de uma página (Libero PDF, `tipo: "documento"`): faixa azul com rótulo, título e autor, a carta ou
// e-mail modelo numa janela de e-mail (Para, Assunto e corpo, com os [CAMPOS] destacados) e o "como usar".
import { COR, FONTES, TITULO, TEXTO, PERFIL, esc, rico, linhas, textura, anel } from '../libero-comum/identidade.mjs';

export const W = 794, H = 1122;
const M = 58;
// [CAMPO] vira etiqueta amarela; o resto passa pelo rico (**negrito**).
const campos = t => rico(t).replace(/\[([^\]]+)\]/g, '<span style="background:#FFF1A8;color:#5A4A00;font-weight:800;padding:0 4px;border-radius:4px;white-space:nowrap">[$1]</span>');

export function renderDocumento(p) {
  const d = p.documento || {};
  const linha = (rot, val) => `<div style="display:flex;gap:12px;padding:9px 0;border-bottom:1px solid #DCE1EA;${TEXTO};font-size:13px;color:${COR.navy}"><span style="width:62px;flex:none;font-weight:800;color:#8A93A6">${esc(rot)}</span><span style="font-weight:700">${campos(val)}</span></div>`;
  const corpo = (d.corpo || []).map(t => `<p style="${TEXTO};font-size:13.6px;font-weight:500;line-height:1.6;color:${COR.navy};text-align:justify;margin:0 0 .85em">${campos(t)}</p>`).join('');
  const assinatura = (d.assinatura || []).map(t => `<div style="${TEXTO};font-size:13.6px;font-weight:600;line-height:1.55;color:${COR.navy}">${campos(t)}</div>`).join('');
  const passos = (d.passos || []).map((t, i) => `<div style="flex:1;display:flex;gap:10px;align-items:flex-start"><span style="${TITULO};font-size:30px;line-height:.9;color:${COR.vermelho}">${i + 1}</span><span style="${TEXTO};font-size:12px;font-weight:600;line-height:1.4;color:${COR.navy}">${rico(t)}</span></div>`).join('');
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet">
<style>@page{size:210mm 297mm;margin:0}*{box-sizing:border-box}body{margin:0;${TEXTO};-webkit-font-smoothing:antialiased;-webkit-print-color-adjust:exact;print-color-adjust:exact}
p{margin:0}.pagina{position:relative;width:${W}px;height:${H}px;overflow:hidden}</style></head><body>
<section class="pagina" style="background:${COR.papel}">
  <div style="position:absolute;left:0;right:0;top:0;height:410px;background:linear-gradient(170deg,${COR.azul} 0%,${COR.azulFundo} 100%);overflow:hidden">
    ${anel(640, -210, 340, 42)}
    <div style="position:absolute;left:${M}px;top:48px;${TEXTO};font-size:12px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:#fff;background:${COR.navyFundo};padding:7px 13px;border-radius:6px;z-index:3">${esc(p.capa?.rotulo || '')}</div>
    <div style="position:absolute;left:${M}px;right:${M + 120}px;top:104px;z-index:3">
      <div style="${TITULO};font-size:${p.capa?.ts || 66}px;line-height:1.02;color:#fff">${linhas(p.capa?.titulo, COR.navyFundo)}</div>
      ${p.capa?.sub ? `<p style="${TEXTO};font-size:15px;font-weight:600;line-height:1.4;color:${COR.off};margin-top:14px">${esc(p.capa.sub)}</p>` : ''}
      <div style="${TEXTO};font-size:14px;font-weight:800;letter-spacing:.06em;color:#fff;margin-top:8px">${esc(p.capa?.autor || 'Por Líbero Filho')} · ${PERFIL}</div>
    </div>
    ${textura(true)}
  </div>
  <div class="corpo" style="position:absolute;left:${M}px;right:${M}px;top:372px;background:#fff;border-radius:16px;box-shadow:0 18px 40px rgba(10,30,80,.16);overflow:hidden;z-index:4">
    <div style="display:flex;align-items:center;gap:7px;padding:12px 18px;background:#EEF1F7;border-bottom:1px solid #DCE1EA">
      <span style="width:11px;height:11px;border-radius:50%;background:${COR.vermelho}"></span><span style="width:11px;height:11px;border-radius:50%;background:#F5B700"></span><span style="width:11px;height:11px;border-radius:50%;background:#2BB673"></span>
      <span style="margin-left:10px;${TEXTO};font-size:11px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:${COR.azul}">${esc(d.janela || 'Novo e-mail')}</span>
    </div>
    <div style="padding:6px 28px 26px">
      ${d.para ? linha('Para', d.para) : ''}${linha('Assunto', d.assunto || '')}
      <div style="padding-top:18px">${corpo}<div style="margin-top:18px">${assinatura}</div></div>
    </div>
  </div>
  ${passos ? `<div style="position:absolute;left:${M}px;right:${M}px;bottom:78px;border-top:2px solid ${COR.navy};padding-top:12px">
    <div style="${TEXTO};font-size:10.5px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:${COR.azul};margin-bottom:10px">Como usar</div>
    <div style="display:flex;gap:22px">${passos}</div></div>` : ''}
  <div style="position:absolute;left:${M}px;right:${M}px;bottom:34px;display:flex;justify-content:space-between;${TEXTO};font-size:11px;font-weight:700;letter-spacing:.08em;color:${COR.navy}"><span>${esc(p.capa?.autor || 'Por Líbero Filho')} · ${PERFIL}</span><span>${esc(p.capa?.data || '')}</span></div>
  ${textura(false)}
</section>
<script>document.fonts.ready.then(() => { window.__pronto = true; });</script></body></html>`;
  return { html, avisos: [], largura: W, altura: H };
}

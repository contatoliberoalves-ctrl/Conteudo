// Peças visuais dos documentos dos casos simulados: prints de celular genéricos (conversa, e-mail,
// banco, rastreio). Nada imita marca real; toda imagem leva a tarja "caso fictício".
export const W = 432; // largura CSS do "celular"; sai com 1080 px (escala 2,5)

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const br = (s) => esc(s).replace(/\n/g, '<br>');

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{width:${W}px;font-family:Inter,Roboto,Helvetica,Arial,sans-serif;color:#111;background:#fff;-webkit-font-smoothing:antialiased}
.tarja{background:#151515;color:#F7F4EB;font:700 9.5px/1 Manrope,Inter,sans-serif;letter-spacing:.16em;padding:8px 14px;display:flex;justify-content:space-between;text-transform:uppercase}
.tarja b{color:#B49A5B;font-weight:800}
.status{height:30px;display:flex;align-items:center;justify-content:space-between;padding:0 18px;font-size:13px;font-weight:600}
.status .ic{display:flex;gap:5px;align-items:center;font-size:11px}
.bat{width:22px;height:11px;border:1.5px solid currentColor;border-radius:3px;position:relative}
.bat:after{content:"";position:absolute;left:1px;top:1px;bottom:1px;width:var(--b,70%);background:currentColor;border-radius:1px}
/* conversa */
.chat .top{background:#1f5f55;color:#fff}
.chat .cab{display:flex;align-items:center;gap:10px;padding:6px 12px 10px}
.chat .av{width:36px;height:36px;border-radius:50%;background:#c9d6d2;color:#1f5f55;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px}
.chat .nm{font-weight:600;font-size:15.5px}
.chat .sub{font-size:11.5px;opacity:.8}
.chat .fundo{background:#ece5dd;padding:10px 10px 14px;min-height:200px}
.dia{text-align:center;margin:8px 0}
.dia span{background:#d9eef6;color:#3b4a50;font-size:11.5px;padding:4px 10px;border-radius:7px;display:inline-block}
.aviso{text-align:center;margin:6px 18px 10px;background:#fbf1c7;color:#5d5434;font-size:11px;line-height:1.35;padding:6px 9px;border-radius:7px}
.m{max-width:80%;padding:6px 8px 4px 9px;border-radius:8px;font-size:14.2px;line-height:1.36;margin:3px 0;position:relative;box-shadow:0 1px .5px rgba(0,0,0,.13);word-wrap:break-word}
.m .h{float:right;font-size:10.5px;color:#667;margin:7px 0 -3px 10px;white-space:nowrap}
.m .h i{font-style:normal;color:#4fa3d8;letter-spacing:-3px;margin-left:3px}
.m .h i.cz{color:#99a}
.eu{background:#dcf7c5;margin-left:auto}
.ele{background:#fff}
.m .quem{font-size:12px;font-weight:700;color:#b5651d;margin-bottom:1px}
.audio{display:flex;align-items:center;gap:9px;min-width:230px}
.audio .play{width:0;height:0;border-left:12px solid #607d8b;border-top:8px solid transparent;border-bottom:8px solid transparent}
.audio .onda{flex:1;height:22px;background:repeating-linear-gradient(90deg,#8aa 0 2px,transparent 2px 5px);mask:linear-gradient(90deg,#000,#000);opacity:.7;border-radius:2px}
.transc{font-size:12.3px;color:#444;font-style:italic;border-top:1px solid rgba(0,0,0,.08);margin-top:5px;padding-top:4px}
.img{width:118px;height:118px;border-radius:6px;background:#cfd8d4;display:inline-flex;align-items:center;justify-content:center;font-size:11px;color:#456;margin:2px}
.grade{display:grid;grid-template-columns:118px 118px;gap:4px}
.entrada{display:flex;gap:8px;align-items:center;padding:7px 8px 10px;background:#ece5dd}
.entrada div{flex:1;background:#fff;border-radius:20px;padding:9px 14px;color:#888;font-size:14px}
.entrada span{width:40px;height:40px;border-radius:50%;background:#1f5f55}
/* e-mail */
.mail{padding:4px 16px 18px}
.mail .assunto{font-size:19px;font-weight:600;line-height:1.3;margin:8px 0 12px}
.mail .tag{display:inline-block;font-size:11px;background:#eef0f3;padding:2px 7px;border-radius:4px;margin-left:6px;vertical-align:2px;font-weight:500}
.mail .de{display:flex;gap:10px;align-items:center;margin-bottom:14px}
.mail .de .av{width:38px;height:38px;border-radius:50%;background:#e9a94b;color:#fff;font-weight:700;display:flex;align-items:center;justify-content:center}
.mail .de .n{font-weight:600;font-size:14px}
.mail .de .e{font-size:12px;color:#667}
.corpo{border:1px solid #e5e5e5;border-radius:8px;overflow:hidden;font-size:13.5px;line-height:1.5}
.marca{background:#2b2f3a;color:#f3d9a4;padding:14px 16px;font-weight:800;letter-spacing:.08em;font-size:15px}
.marca small{display:block;color:#bfc3cc;font-weight:500;letter-spacing:.02em;font-size:11px;margin-top:2px}
.corpo .in{padding:14px 16px}
.corpo p{margin-bottom:9px}
.tab{width:100%;border-collapse:collapse;font-size:12.8px;margin:6px 0 10px}
.tab td{padding:6px 0;border-bottom:1px solid #eee;vertical-align:top}
.tab td:last-child{text-align:right;white-space:nowrap;padding-left:10px}
.tab tr.tot td{font-weight:700;border-bottom:0;font-size:14px}
.cx{background:#f6f6f4;border-radius:6px;padding:9px 11px;font-size:12.5px;margin:8px 0}
.cupom{border:1.5px dashed #c18a2b;background:#fff8ea;text-align:center;padding:10px;border-radius:6px;margin:10px 0;font-weight:700;letter-spacing:.06em}
.cupom small{display:block;font-weight:500;letter-spacing:0;font-size:11.5px;color:#6a5a3a;margin-top:3px}
.rod{font-size:10.5px;color:#888;padding:10px 16px 14px;border-top:1px solid #eee;line-height:1.4}
/* banco */
.banco{background:#f4f2fb;padding-bottom:18px}
.banco .top{background:#4b2a8c;color:#fff;padding:4px 16px 16px}
.banco .bn{font-weight:800;font-size:16px;letter-spacing:.02em;margin-top:6px}
.banco .card{background:#fff;margin:14px 14px 0;border-radius:12px;padding:16px;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.banco .ok{width:42px;height:42px;border-radius:50%;background:#e4f5ea;color:#1c8a4a;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;margin-bottom:8px}
.banco .tt{font-size:14px;color:#555}
.banco .val{font-size:30px;font-weight:700;margin:2px 0 4px}
.banco .dt{font-size:12.5px;color:#666}
.lin{display:flex;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid #f0eef5;font-size:13px}
.lin span:first-child{color:#777;flex:none}
.lin span:last-child{text-align:right;font-weight:600}
.banco h4{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#4b2a8c;margin:4px 0 2px}
.mini{font-size:10.5px;color:#888;word-break:break-all;margin-top:10px}
/* rastreio */
.rast{background:#fff}
.rast .barra{background:#f1f3f4;margin:4px 10px 0;border-radius:18px;padding:8px 14px;font-size:12.5px;color:#444}
.rast .top2{background:#0c6b3e;color:#fff;padding:14px 16px;margin-top:8px}
.rast .top2 b{font-size:17px;letter-spacing:.03em}
.rast .obj{padding:14px 16px;border-bottom:1px solid #eee}
.rast .obj .c{font-size:20px;font-weight:700;letter-spacing:.04em}
.rast .st{display:inline-block;margin-top:6px;background:#fff3cd;color:#7a5b00;font-size:12px;font-weight:700;padding:4px 9px;border-radius:4px}
.ev{display:flex;gap:12px;padding:12px 16px 0}
.ev .pt{width:12px;flex:none;display:flex;flex-direction:column;align-items:center}
.ev .pt i{width:12px;height:12px;border-radius:50%;background:#0c6b3e;margin-top:3px}
.ev .pt u{flex:1;width:2px;background:#cfe3d8;margin-top:3px}
.ev .tx{padding-bottom:12px;font-size:13.3px;line-height:1.4}
.ev .tx b{display:block}
.ev .tx span{color:#666;font-size:12.3px}
.rast .ult{margin:10px 16px 18px;font-size:12px;color:#666;background:#f7f7f7;padding:9px 11px;border-radius:6px}
`;

export function pagina(tarja, corpo, { fundo = '#fff', claro = false } = {}) {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@700;800&display=swap" rel="stylesheet">
<style>${CSS}</style></head><body style="background:${fundo}">
<div class="tarja"><span><b>pratflix ▸</b> ${esc(tarja.esq)}</span><span>${esc(tarja.dir || 'caso fictício')}</span></div>
${corpo}</body></html>`;
}

export function status(hora, { escuro = false, bat = '64%' } = {}) {
  return `<div class="status" style="${escuro ? 'background:#1f5f55;color:#fff' : ''}"><span>${hora}</span><span class="ic">●●●● 4G <span class="bat" style="--b:${bat}"></span></span></div>`;
}

// msgs: {dia} | {aviso} | {de:'eu'|'ele', t, h, lido, quem, audio, transc, imgs}
export function chat({ hora, nome, sub, inicial, msgs, bat }) {
  const corpo = msgs.map((m) => {
    if (m.dia) return `<div class="dia"><span>${esc(m.dia)}</span></div>`;
    if (m.aviso) return `<div class="aviso">${esc(m.aviso)}</div>`;
    const tique = m.de === 'eu' ? `<i class="${m.lido === false ? 'cz' : ''}">✓✓</i>` : '';
    let inner = m.quem ? `<div class="quem">${esc(m.quem)}</div>` : '';
    if (m.audio) inner += `<div class="audio"><div class="play"></div><div class="onda"></div><span style="font-size:11.5px;color:#667">${m.audio}</span></div>${m.transc ? `<div class="transc">Transcrição: “${br(m.transc)}”</div>` : ''}`;
    else if (m.imgs) inner += `<div class="grade">${m.imgs.map((x) => `<div class="img">${esc(x)}</div>`).join('')}</div>`;
    else inner += br(m.t);
    return `<div class="m ${m.de}">${inner}<span class="h">${m.h}${tique}</span><div style="clear:both"></div></div>`;
  }).join('\n');
  return `<div class="chat"><div class="top">${status(hora, { escuro: true, bat })}
<div class="cab"><span style="font-size:20px">‹</span><div class="av">${esc(inicial)}</div><div><div class="nm">${esc(nome)}</div><div class="sub">${esc(sub)}</div></div></div></div>
<div class="fundo">${corpo}</div><div class="entrada"><div>Mensagem</div><span></span></div></div>`;
}

export function email({ hora, assunto, pasta, remetente, endereco, inicial, quando, marca, corpo, rodape }) {
  return `${status(hora)}<div class="mail"><div style="font-size:20px;color:#555">←</div>
<div class="assunto">${esc(assunto)}<span class="tag">${esc(pasta)}</span></div>
<div class="de"><div class="av">${esc(inicial)}</div><div><div class="n">${esc(remetente)}</div><div class="e">${esc(endereco)} · ${esc(quando)}</div><div class="e">para mim</div></div></div>
<div class="corpo"><div class="marca">${marca}</div><div class="in">${corpo}</div>${rodape ? `<div class="rod">${rodape}</div>` : ''}</div></div>`;
}

export function banco({ hora, titulo, valor, data, linhas, id }) {
  const ls = linhas.map((l) => (l.h4 ? `<h4>${esc(l.h4)}</h4>` : `<div class="lin"><span>${esc(l[0])}</span><span>${esc(l[1])}</span></div>`)).join('');
  return `<div class="banco"><div class="top">${status(hora)}<div class="bn">Banco Aurora <span style="font-weight:500;opacity:.75;font-size:12px">· comprovante</span></div></div>
<div class="card"><div class="ok">✓</div><div class="tt">${esc(titulo)}</div><div class="val">${esc(valor)}</div><div class="dt">${esc(data)}</div></div>
<div class="card">${ls}<div class="mini">ID da transação: ${esc(id)}</div></div></div>`;
}

export function rastreio({ hora, url, empresa, codigo, situacao, eventos, ultima }) {
  const ev = eventos.map((e, i) => `<div class="ev"><div class="pt"><i style="${i ? 'background:#9cc5ae' : ''}"></i>${i < eventos.length - 1 ? '<u></u>' : ''}</div><div class="tx"><b>${esc(e.t)}</b><span>${esc(e.d)}</span></div></div>`).join('');
  return `<div class="rast">${status(hora)}<div class="barra">🔒 ${esc(url)}</div><div class="top2"><b>${esc(empresa)}</b><div style="font-size:12px;opacity:.85">Acompanhe sua entrega</div></div>
<div class="obj"><div style="font-size:12px;color:#666">Código de rastreamento</div><div class="c">${esc(codigo)}</div><span class="st">${esc(situacao)}</span></div>${ev}
<div class="ult">${esc(ultima)}</div></div>`;
}

// Molde "Libero Aula" (@liberofilho): slides de AULA 16:9 (1920×1080) de uso geral, na identidade do
// Carrossel Libero (libero-comum/identidade.mjs). A capa tem vários estilos (`estilo`), para cada aula ter
// cara própria; os slides de conteúdo são tópico, lista, cards, barras, tabela, passos, frase e cta.
// Temas: blue, light, dark (nunca 3 iguais seguidos). Texto: **negrito** e [[caixa]].
import { COR, TEMAS, TITULO, TEXTO, esc, lista, rico, linhas, rodape, anel, objeto, pagina } from '../libero-comum/identidade.mjs';

const W = 1920, H = 1080;
const kick = (txt, cor) => txt ? `<div style="${TEXTO};font-size:28px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${cor}">${esc(txt)}</div>` : '';
const chip = (txt, bg, cor, px = 24) => `<span style="display:inline-block;background:${bg};color:${cor};${TEXTO};font-size:${px}px;font-weight:700;padding:5px 14px;border-radius:8px;white-space:nowrap">${esc(txt)}</span>`;
const rod = t => rodape(t.txt).replace('left:96px', 'left:120px').replace('bottom:64px', 'bottom:50px');
const tit = (s, t, px, w, caixa) => `<div data-fit="${esc(lista(s.titulo).join(' '))}" data-min="56" style="${TITULO};font-size:${s.ts || px}px;line-height:${lista(s.titulo).some(l => l.includes('[[')) ? 1.06 : .92};padding-top:.08em;color:${t.tit};max-width:${w}px;max-height:${s.th || 520}px;overflow:hidden">${linhas(s.titulo, caixa || t.caixa)}</div>`;
const corpo = (s, t, px = 40) => lista(s.texto).map(p => `<p style="font-size:${px}px;font-weight:500;line-height:1.32;color:${t.txt}">${rico(p, t.caixa)}</p>`).join('');
const recorte = (ctx, f, css) => f ? `<img src="${ctx.foto(f.img || f)}" style="position:absolute;${css};${f.css || ''};filter:drop-shadow(0 30px 40px rgba(0,0,0,.35));z-index:6">` : '';

// ---------- Capas ----------
const CAPAS = {
  // Clássica: título grande à esquerda, símbolo vazado gigante à direita e anel vermelho.
  classica(s, t) {
    return `${anel(1500, -260, 620)}
      <div style="position:absolute;right:${s.simboloX ?? 80}px;top:50%;transform:translateY(-50%);${TITULO};font-size:${s.ts2 || 760}px;line-height:.8;color:transparent;-webkit-text-stroke:7px ${t.escuro ? 'rgba(255,255,255,.4)' : 'rgba(11,79,216,.35)'};z-index:2">${esc(s.simbolo || '?')}</div>
      <div style="position:absolute;left:130px;top:150px;bottom:170px;width:1150px;display:flex;flex-direction:column;justify-content:center;gap:30px;z-index:4">
        ${kick(s.kicker, t.kicker)}${tit(s, t, 170, 1150)}${s.texto ? `<div style="max-width:900px">${corpo(s, t, 40)}</div>` : ''}
      </div>${rod(t)}`;
  },
  // Foto: o autor recortado à direita, sobre um círculo, e o título à esquerda.
  foto(s, t, ctx) {
    return `<div style="position:absolute;right:${s.circuloX ?? 170}px;top:120px;width:820px;height:820px;border-radius:50%;background:${t.escuro ? 'rgba(255,255,255,.08)' : '#E4ECFF'};z-index:1"></div>
      ${anel(s.anelX ?? 1180, s.anelY ?? 70, 300, 46)}
      ${recorte(ctx, s.foto, `right:${s.fotoX ?? 120}px;bottom:0;height:${s.fotoH || 1000}px`)}
      <div style="position:absolute;left:130px;top:140px;bottom:160px;width:${s.largura || 980}px;display:flex;flex-direction:column;justify-content:center;gap:30px;z-index:7">
        ${s.selo ? `<div>${chip(s.selo, COR.vermelho, '#fff', 30)}</div>` : ''}${kick(s.kicker, t.kicker)}${tit(s, t, 150, s.largura || 980)}${s.texto ? `<div style="max-width:820px">${corpo(s, t, 38)}</div>` : ''}
      </div>${rod(t)}`;
  },
  // Duas metades (A x B) com medalhão no meio e o título numa faixa embaixo.
  split(s) {
    const [a, b] = lista(s.lados);
    const lado = (l, bg, cor, x) => `<div style="position:absolute;left:${x}px;top:0;width:960px;height:${H}px;background:${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;padding-bottom:260px;gap:28px">
        <div style="${TITULO};font-size:${l.ts || 230}px;line-height:.85;color:${cor}">${esc(l.sigla)}</div>
        <div style="${TEXTO};font-size:38px;font-weight:700;color:${cor};opacity:.85">${esc(l.nome || '')}</div></div>`;
    return `${lado(a, COR.off, COR.azul, 0)}${lado(b, `linear-gradient(170deg,${COR.navy},${COR.navyFundo})`, '#fff', 960)}
      <div style="position:absolute;left:830px;top:${s.seloY || 170}px;width:260px;height:260px;border-radius:50%;background:${COR.vermelho};border:14px solid #fff;display:flex;align-items:center;justify-content:center;${TITULO};font-size:130px;color:#fff;z-index:4;box-shadow:0 20px 40px rgba(0,0,0,.25)">${esc(s.selo || 'ou')}</div>
      <div style="position:absolute;left:0;right:0;bottom:0;height:260px;background:${COR.azul};display:flex;align-items:center;justify-content:center;padding:40px 120px 0;z-index:3">
        <div data-fit="${esc(lista(s.titulo).join(' '))}" data-min="50" style="${TITULO};font-size:${s.ts || 110}px;line-height:.95;color:#fff;text-align:center;max-width:1700px">${linhas(s.titulo, COR.navyFundo)}</div>
      </div>`;
  },
  // Número: um valor gigante vazado (ex.: "2,3"), o rótulo e o título.
  numero(s, t) {
    return `${anel(1640, 760, 460)}
      <div style="position:absolute;left:110px;top:60px;${TITULO};font-size:${s.tn || 640}px;line-height:.85;color:transparent;-webkit-text-stroke:8px ${t.escuro ? '#fff' : COR.azul};z-index:2">${esc(s.numero)}</div>
      <div style="position:absolute;left:130px;top:${s.rotuloY || 800}px;${TEXTO};font-size:44px;font-weight:800;color:${COR.vermelho};letter-spacing:.06em;text-transform:uppercase;z-index:3">${esc(s.rotulo || '')}</div>
      <div style="position:absolute;left:1000px;right:120px;top:140px;bottom:170px;display:flex;flex-direction:column;justify-content:center;gap:30px;z-index:4">
        ${kick(s.kicker, t.kicker)}${tit(s, t, 140, 800)}${s.texto ? corpo(s, t, 36) : ''}
      </div>${rod(t)}`;
  },
  // Fita: faixas de "atenção" cruzando a tela e o título no meio.
  fita(s, t) {
    const faixa = (rot, y, txt) => `<div style="position:absolute;left:-200px;right:-200px;top:${y}px;height:96px;background:${COR.vermelho};transform:rotate(${rot}deg);display:flex;align-items:center;overflow:hidden;z-index:2;box-shadow:0 14px 30px rgba(0,0,0,.3)"><div style="${TITULO};font-size:56px;color:#fff;white-space:nowrap;letter-spacing:.08em">${Array(14).fill(esc(txt)).join(' &nbsp;✕&nbsp; ')}</div></div>`;
    return `${faixa(-6, 120, s.fita || 'ATENÇÃO')}${faixa(5, 840, s.fita || 'ATENÇÃO')}
      <div style="position:absolute;left:130px;right:130px;top:250px;bottom:250px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:24px;text-align:center;z-index:4">
        ${kick(s.kicker, t.kicker)}${tit(s, t, 150, 1600)}${s.texto ? corpo(s, t, 38) : ''}
      </div>`;
  },
  // Mapa: título à esquerda e um mural de etiquetas (artigos) à direita.
  mapa(s, t) {
    const et = lista(s.etiquetas);
    return `${anel(1560, 760, 520)}
      <div style="position:absolute;left:130px;top:150px;bottom:170px;width:820px;display:flex;flex-direction:column;justify-content:center;gap:30px;z-index:4">
        ${kick(s.kicker, t.kicker)}${tit(s, t, 150, 820)}${s.texto ? corpo(s, t, 38) : ''}
      </div>
      <div style="position:absolute;left:1030px;right:110px;top:150px;bottom:170px;display:flex;flex-wrap:wrap;align-content:center;gap:22px;z-index:4">
        ${et.map((e, i) => `<div style="background:${i % 3 === 0 ? '#fff' : i % 3 === 1 ? COR.navyFundo : 'rgba(255,255,255,.14)'};color:${i % 3 === 0 ? COR.azul : '#fff'};${TITULO};font-size:${e.length > 10 ? 58 : 76}px;line-height:1;padding:20px 30px 14px;border-radius:16px;transform:rotate(${[-3, 2, -1, 3, -2][i % 5]}deg);box-shadow:0 14px 26px rgba(0,0,0,.2)">${esc(e)}</div>`).join('')}
      </div>${rod(t)}`;
  },
  // Branca (miniatura de vídeo): fundo branco, título navy enorme, faixa navy embaixo e foto opcional.
  branca(s, t, ctx) {
    const f = s.foto;
    return `<div style="position:absolute;inset:0;background:#fff"></div>
      <div style="position:absolute;left:0;right:0;bottom:0;height:300px;background:${COR.navyFundo}"></div>
      ${f ? `<div style="position:absolute;right:${s.circuloX ?? 140}px;bottom:120px;width:760px;height:760px;border-radius:50%;background:${COR.azul}"></div>${recorte(ctx, f, `right:${s.fotoX ?? 90}px;bottom:0;height:${s.fotoH || 980}px`)}` : `<div style="position:absolute;right:60px;top:40px;${TITULO};font-size:900px;line-height:.8;color:transparent;-webkit-text-stroke:8px ${COR.azul};opacity:.25">${esc(s.simbolo || '?')}</div>`}
      <div style="position:absolute;left:120px;top:110px;width:${f ? 1050 : 1500}px;display:flex;flex-direction:column;gap:22px;z-index:7">
        ${s.selo ? `<div>${chip(s.selo, COR.vermelho, '#fff', 32)}</div>` : ''}
        <div data-fit="${esc(lista(s.titulo).join(' '))}" data-min="60" style="${TITULO};font-size:${s.ts || 150}px;line-height:1.02;color:${COR.navyFundo};max-height:640px;overflow:hidden">${linhas(s.titulo, COR.azul)}</div>
      </div>
      <div style="position:absolute;left:120px;bottom:0;height:300px;display:flex;align-items:center;gap:26px;z-index:7">
        <span style="${TEXTO};font-size:44px;font-weight:800;color:#fff">${esc(s.rodape || '2ª fase OAB · Constitucional')}</span>
      </div>`;
  },
  // Folha: uma prova corrigida (linhas, marcas vermelhas e nota) à direita e o título à esquerda.
  folha(s, t) {
    const lin = w => `<div style="height:16px;border-radius:8px;background:#DCE1EA;width:${w}%;margin-top:26px"></div>`;
    return `<div style="position:absolute;right:150px;top:110px;width:640px;height:860px;background:#fff;border-radius:22px;transform:rotate(4deg);box-shadow:0 40px 70px rgba(0,0,0,.35);padding:60px 56px;z-index:3">
        <div style="${TEXTO};font-size:24px;font-weight:800;letter-spacing:.14em;color:${COR.azul}">PADRÃO DE RESPOSTA</div>
        ${[88, 76, 92, 60, 84, 70, 90, 66, 80].map(lin).join('')}
        <div style="position:absolute;left:520px;top:180px;${TITULO};font-size:90px;color:${COR.vermelho};transform:rotate(-8deg)">✓</div>
        <div style="position:absolute;left:470px;top:400px;${TITULO};font-size:90px;color:${COR.vermelho};transform:rotate(6deg)">✓</div>
        <div style="position:absolute;left:30px;bottom:40px;width:250px;height:250px;border:10px solid ${COR.vermelho};border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;transform:rotate(-12deg);color:${COR.vermelho}"><span style="${TITULO};font-size:110px;line-height:.85">${esc(s.nota || '?')}</span><span style="${TEXTO};font-size:22px;font-weight:800;letter-spacing:.12em">${esc(s.notaRotulo || 'NOTA')}</span></div>
      </div>
      <div style="position:absolute;left:130px;top:150px;bottom:170px;width:960px;display:flex;flex-direction:column;justify-content:center;gap:30px;z-index:4">
        ${kick(s.kicker, t.kicker)}${tit(s, t, 150, 960)}${s.texto ? corpo(s, t, 38) : ''}
      </div>${rod(t)}`;
  },
  // Dica de série (capa de post no Twitter/X): número vazado gigante com "/total", etiqueta da fase e o título.
  dica(s, t) {
    const depois = s.fase === 'depois';
    return `${anel(1560, -300, 620)}
      <div style="position:absolute;right:110px;top:50%;transform:translateY(-52%);text-align:right;z-index:2">
        <div style="${TITULO};font-size:${s.tn || 640}px;line-height:.8;color:transparent;-webkit-text-stroke:7px ${t.escuro ? 'rgba(255,255,255,.45)' : 'rgba(11,79,216,.4)'}">${esc(String(s.numero).padStart(2, '0'))}</div>
        <div style="${TITULO};font-size:90px;line-height:1;color:${depois ? COR.vermelho : t.kicker};margin-top:10px">/ ${esc(s.total || 20)}</div>
      </div>
      <div style="position:absolute;left:130px;top:130px;bottom:170px;width:${s.largura || 1150}px;display:flex;flex-direction:column;justify-content:center;gap:30px;z-index:4">
        <div style="display:flex;gap:14px;align-items:center">${chip(depois ? 'Depois da prova' : 'Antes da prova', depois ? COR.vermelho : (t.escuro ? '#fff' : COR.azul), depois || !t.escuro ? '#fff' : COR.azul, 30)}${kick(s.kicker || 'Dica · 2ª fase OAB', t.kicker)}</div>
        ${tit(s, t, 150, s.largura || 1150)}${s.texto ? `<div style="max-width:980px">${corpo(s, t, 40)}</div>` : ''}
      </div>${rod(t)}`;
  },
};

// ---------- Slides de conteúdo ----------
const TIPOS = {
  capa(s, t, ctx) { return (CAPAS[s.estilo] || CAPAS.classica)(s, t, ctx); },
  // Tópico: título à esquerda; texto à direita, com fio vermelho.
  topico(s, t) {
    return `<div style="position:absolute;left:120px;top:140px;bottom:150px;width:${s.largura || 760}px;display:flex;flex-direction:column;justify-content:center;gap:26px">
        ${kick(s.kicker, t.kicker)}${tit(s, t, 140, s.largura || 760)}
      </div>
      <div data-fit="${esc(lista(s.titulo).join(' '))} texto" data-min="26" style="position:absolute;left:${(s.largura || 760) + 220}px;right:120px;top:150px;bottom:150px;display:flex;flex-direction:column;justify-content:center;gap:30px;border-left:8px solid ${COR.vermelho};padding-left:56px;font-size:${s.corpo || 42}px;overflow:hidden">
        ${lista(s.texto).map(p => `<p style="font-size:1em;font-weight:500;line-height:1.32;color:${t.txt}">${rico(p, t.caixa)}</p>`).join('')}
        ${s.citacao ? `<div style="background:${t.escuro ? 'rgba(255,255,255,.1)' : '#fff'};border-radius:16px;padding:26px 30px;font-size:.92em;font-style:italic;font-weight:600;line-height:1.3;color:${t.tit}">“${esc(s.citacao)}”${s.fonte ? `<div style="font-style:normal;font-size:.6em;font-weight:700;margin-top:10px;color:${t.kicker}">${esc(s.fonte)}</div>` : ''}</div>` : ''}
      </div>${rod(t)}`;
  },
  // Lista numerada (1 ou 2 colunas): itens {t, d, tag}.
  lista(s, t) {
    const it = lista(s.itens), cols = s.colunas || (it.length > 4 ? 2 : 1);
    return `<div style="position:absolute;left:120px;right:120px;top:100px">${kick(s.kicker, t.kicker)}<div style="margin-top:12px">${tit(s, t, 110, 1680)}</div></div>
      <div data-fit="${esc(lista(s.titulo).join(' '))} itens" data-min="22" style="position:absolute;left:120px;right:120px;top:${s.topo || 330}px;bottom:140px;display:grid;grid-template-columns:repeat(${cols},1fr);gap:22px 60px;align-content:center;font-size:${s.corpo || (cols === 1 ? 48 : 40)}px;overflow:hidden">
        ${it.map((x, i) => `<div style="display:flex;gap:.6em;align-items:flex-start;border-bottom:3px solid ${t.linha};padding-bottom:.5em">
          <div style="flex:none;width:1.6em;height:1.6em;border-radius:12px;background:${i === 0 && s.destaque !== false ? COR.vermelho : t.escuro ? '#fff' : COR.azul};color:${i === 0 && s.destaque !== false ? '#fff' : t.escuro ? COR.azul : '#fff'};display:flex;align-items:center;justify-content:center;${TITULO};font-size:1.05em">${(s.inicio || 0) + i + 1}</div>
          <div style="line-height:1.28;color:${t.txt}"><span style="font-weight:800;color:${t.tit}">${rico(x.t || x, t.caixa)}</span>${x.d ? `<div style="font-size:.78em;font-weight:500;margin-top:.2em">${rico(x.d, t.caixa)}</div>` : ''}${x.tag ? `<div style="margin-top:.3em">${lista(x.tag).map(g => chip(g, t.escuro ? 'rgba(255,255,255,.14)' : '#E4ECFF', t.escuro ? '#fff' : COR.azul, 20)).join(' ')}</div>` : ''}</div>
        </div>`).join('')}
      </div>${rod(t)}`;
  },
  // Cards (2 a 4 colunas): {rotulo, titulo, texto (ou lista), chips, cor}.
  cards(s, t) {
    const cs = lista(s.cards);
    return `<div style="position:absolute;left:120px;right:120px;top:100px">${kick(s.kicker, t.kicker)}<div style="margin-top:12px">${tit(s, t, 104, 1680)}</div></div>
      <div style="position:absolute;left:120px;right:120px;top:${s.topo || 320}px;bottom:140px;display:grid;grid-template-columns:repeat(${cs.length},1fr);gap:34px">
        ${cs.map((c, i) => { const forte = c.cor === 'vermelho' ? COR.vermelho : c.cor === 'navy' ? COR.navyFundo : c.cor === 'azul' ? COR.azul : null;
          const bg = forte || '#fff', cor = forte ? '#fff' : COR.navy;
          return `<div data-fit="card ${i + 1}" data-min="20" style="background:${bg};border-radius:22px;padding:34px 36px;box-shadow:0 20px 40px rgba(0,0,0,.14);display:flex;flex-direction:column;gap:18px;font-size:${s.corpo || 38}px;overflow:hidden;${forte ? '' : `border-top:12px solid ${COR.azul}`}">
            ${c.rotulo ? `<div style="${TEXTO};font-size:.7em;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:${forte ? 'rgba(255,255,255,.75)' : COR.vermelho}">${esc(c.rotulo)}</div>` : ''}
            <div style="${TITULO};font-size:1.9em;line-height:.95;color:${forte ? '#fff' : COR.azul}">${rico(c.titulo || '', COR.vermelho)}</div>
            ${lista(c.texto).map(p => `<div style="font-weight:500;line-height:1.3;color:${cor}">${rico(p, COR.azul)}</div>`).join('')}
            ${c.itens ? `<div style="display:flex;flex-direction:column;gap:.35em">${lista(c.itens).map(x => `<div style="display:flex;gap:.45em;line-height:1.25;color:${cor};font-weight:600"><span style="color:${forte ? '#fff' : COR.vermelho}">${esc(c.marca || '•')}</span><span>${rico(x, COR.azul)}</span></div>`).join('')}</div>` : ''}
            ${c.chips ? `<div style="margin-top:auto;display:flex;flex-wrap:wrap;gap:8px">${lista(c.chips).map(g => chip(g, forte ? 'rgba(255,255,255,.18)' : '#E4ECFF', forte ? '#fff' : COR.azul, 20)).join('')}</div>` : ''}
          </div>`; }).join('')}
      </div>${rod(t)}`;
  },
  // Barras horizontais: {rotulo, valor, texto} com valor numérico; a maior (ou `destaque`) em vermelho.
  barras(s, t) {
    const bs = lista(s.barras), max = s.max || Math.max(...bs.map(b => b.valor));
    const fmt = v => (s.casas != null ? v.toFixed(s.casas) : String(v)).replace('.', ',');
    return `<div style="position:absolute;left:120px;right:120px;top:100px">${kick(s.kicker, t.kicker)}<div style="margin-top:12px">${tit(s, t, 104, 1680)}</div></div>
      <div style="position:absolute;left:120px;right:${s.lado ? 700 : 120}px;top:${s.topo || 320}px;bottom:150px;display:flex;flex-direction:column;justify-content:center;gap:30px">
        ${bs.map((b, i) => { const dest = b.destaque ?? i === 0; return `<div style="display:grid;grid-template-columns:${s.colRotulo || 420}px 1fr ${s.colValor || 210}px;gap:24px;align-items:center">
          <div style="${TEXTO};font-size:36px;font-weight:800;line-height:1.15;color:${t.tit}">${esc(b.rotulo)}${b.texto ? `<div style="font-size:25px;font-weight:600;color:${t.txt};opacity:.8;margin-top:4px">${esc(b.texto)}</div>` : ''}</div>
          <div style="height:46px;border-radius:23px;background:${t.escuro ? 'rgba(255,255,255,.14)' : '#DCE1EA'};overflow:hidden"><div style="height:100%;width:${Math.max(3, 100 * b.valor / max).toFixed(1)}%;border-radius:23px;background:${dest ? COR.vermelho : t.escuro ? '#fff' : COR.azul}"></div></div>
          <div style="${TITULO};font-size:58px;line-height:1;color:${dest ? COR.vermelho : t.tit};text-align:right;white-space:nowrap">${fmt(b.valor)}${s.unidade ? `<span style="font-size:.5em"> ${esc(s.unidade)}</span>` : ''}</div>
        </div>`; }).join('')}
      </div>
      ${s.lado ? `<div style="position:absolute;right:120px;top:${s.topo || 320}px;bottom:150px;width:500px;display:flex;flex-direction:column;justify-content:center;gap:24px;border-left:8px solid ${COR.vermelho};padding-left:44px">${lista(s.lado).map(p => `<p style="font-size:34px;font-weight:500;line-height:1.3;color:${t.txt}">${rico(p, t.caixa)}</p>`).join('')}</div>` : ''}${rod(t)}`;
  },
  // Tabela: colunas e linhas; a 1ª coluna em destaque.
  tabela(s, t) {
    const cols = lista(s.colunas), ls = lista(s.linhas);
    return `<div style="position:absolute;left:120px;right:120px;top:90px">${kick(s.kicker, t.kicker)}<div style="margin-top:12px">${tit(s, t, 100, 1680)}</div></div>
      <div data-fit="tabela ${esc(lista(s.titulo).join(' '))}" data-min="18" style="position:absolute;left:120px;right:120px;top:${s.topo || 300}px;bottom:130px;font-size:${s.corpo || 30}px;overflow:hidden">
        <div style="display:grid;grid-template-columns:${s.grade || cols.map(() => '1fr').join(' ')};border-radius:18px;overflow:hidden;box-shadow:0 18px 36px rgba(0,0,0,.12)">
          ${cols.map(c => `<div style="background:${COR.navyFundo};color:#fff;${TEXTO};font-size:.72em;font-weight:800;letter-spacing:.12em;text-transform:uppercase;padding:18px 24px">${esc(c)}</div>`).join('')}
          ${ls.map((l, i) => l.map((c, j) => `<div style="background:${i % 2 ? (t.escuro ? '#1E2A44' : '#F3F5F9') : (t.escuro ? '#18233A' : '#fff')};padding:16px 24px;line-height:1.25;${j === 0 ? `font-weight:800;color:${t.escuro ? '#fff' : COR.azul}` : `font-weight:500;color:${t.escuro ? '#E4E8F0' : COR.navy}`}">${rico(c, COR.azul)}</div>`).join('')).join('')}
        </div>
      </div>${rod(t)}`;
  },
  // Passos numa trilha horizontal: {t, d}.
  passos(s, t) {
    const ps = lista(s.passos);
    return `<div style="position:absolute;left:120px;right:120px;top:100px">${kick(s.kicker, t.kicker)}<div style="margin-top:12px">${tit(s, t, 104, 1680)}</div></div>
      <div style="position:absolute;left:120px;right:120px;top:${(s.topo || 330) + 52}px;height:8px;background:${t.linha}"></div>
      <div style="position:absolute;left:120px;right:120px;top:${s.topo || 330}px;bottom:140px;display:grid;grid-template-columns:repeat(${ps.length},1fr);gap:30px">
        ${ps.map((p, i) => `<div data-fit="passo ${i + 1}" data-min="20" style="display:flex;flex-direction:column;gap:20px;font-size:${s.corpo || 36}px;overflow:hidden">
          <div style="width:110px;height:110px;border-radius:50%;background:${i === ps.length - 1 ? COR.vermelho : t.escuro ? '#fff' : COR.azul};color:${i === ps.length - 1 ? '#fff' : t.escuro ? COR.azul : '#fff'};display:flex;align-items:center;justify-content:center;${TITULO};font-size:60px;border:8px solid ${t.escuro ? COR.navyFundo : COR.off}">${i + 1}</div>
          <div style="${TITULO};font-size:1.6em;line-height:.98;color:${t.tit}">${rico(p.t, t.caixa)}</div>
          ${p.d ? `<div style="font-weight:500;line-height:1.3;color:${t.txt}">${rico(p.d, t.caixa)}</div>` : ''}
        </div>`).join('')}
      </div>${rod(t)}`;
  },
  // Frase de impacto: um bloco sólido grande e um texto de apoio; selo opcional.
  frase(s, t) {
    return `${s.anel !== false ? anel(1580, -200, 520) : ''}
      <div style="position:absolute;left:150px;right:150px;top:140px;bottom:150px;display:flex;flex-direction:column;justify-content:center;gap:40px;z-index:3">
        ${kick(s.kicker, t.kicker)}
        <div data-fit="${esc(lista(s.titulo).join(' '))}" data-min="60" style="${TITULO};font-size:${s.ts || 150}px;line-height:1.08;color:${t.tit};max-height:600px;overflow:hidden">${linhas(s.titulo, s.caixa === 'vermelho' ? COR.vermelho : t.caixa)}</div>
        ${s.texto ? `<div style="max-width:1400px">${corpo(s, t, 42)}</div>` : ''}
      </div>${rod(t)}`;
  },
  // Fechamento: pergunta/pedido e botão; foto recortada opcional à direita.
  cta(s, t, ctx) {
    return `${anel(1600, -220, 500)}
      ${s.foto ? `<div style="position:absolute;right:170px;top:170px;width:700px;height:700px;border-radius:50%;background:${t.escuro ? 'rgba(255,255,255,.1)' : '#E4ECFF'}"></div>${recorte(ctx, s.foto, 'right:110px;bottom:0;height:940px')}` : ''}
      <div style="position:absolute;left:150px;top:150px;bottom:160px;width:${s.foto ? 1000 : 1500}px;display:flex;flex-direction:column;justify-content:center;gap:36px;z-index:7">
        ${kick(s.kicker, t.kicker)}${tit(s, t, 150, s.foto ? 1000 : 1500)}${s.texto ? corpo(s, t, 42) : ''}
        ${s.botao ? `<div><span style="display:inline-block;background:${t.escuro ? '#fff' : COR.azul};color:${t.escuro ? COR.azul : '#fff'};${TEXTO};font-size:40px;font-weight:800;padding:24px 52px;border-radius:999px">${esc(s.botao)}</span></div>` : ''}
      </div>${rod(t)}`;
  },
};

export function renderCarrossel(c, ctx) {
  const avisos = [];
  const slides = (c.slides || []).map((s, i) => {
    const t = TEMAS[s.tema] || TEMAS.blue;
    const f = TIPOS[s.tipo];
    if (!f) avisos.push(`slide ${i + 1}: tipo "${s.tipo}" não existe (${Object.keys(TIPOS).join(', ')})`);
    if (s.tipo === 'capa' && s.estilo && !CAPAS[s.estilo]) avisos.push(`slide ${i + 1}: estilo de capa "${s.estilo}" não existe (${Object.keys(CAPAS).join(', ')})`);
    const bg = s.tipo === 'capa' && s.estilo === 'branca' ? '#fff' : t.bg;
    return { bg, escuro: t.escuro, html: f ? f(s, t, ctx) : '' };
  });
  return { html: pagina(slides, W, H), total: slides.length, avisos, largura: W, altura: H };
}

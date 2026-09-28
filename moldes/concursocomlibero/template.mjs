// Molde "concursocomlibero" (@concursocomlibero): mesma lógica do Carrossel Libero (tipos de slide,
// fundos alternados, rodapé com o perfil), com estética jurídica: verdes profundos, títulos em
// Playfair Display, texto em Poppins, artigos/prazos/números em JetBrains Mono, etiquetas, linhas finas
// e cards que lembram folhas de processo. Serve para carrosséis e para posts de tela única.
// renderCarrossel(c) devolve { html, total, avisos }; o render.mjs fotografa cada slide.

const COR = {
  verde: '#1F8F7F', inst: '#0D3D38', prof: '#06201D', claro: '#BFE6DD', fundo: '#EAFAF5',
  roxo: '#2E1A7A', amarelo: '#F5C53D', vermelho: '#C0392B', acerto: '#1F8A5B',
  preto: '#101319', cinza: '#3B414D', branco: '#FFFFFF',
};
// Só fundos escuros (direção de arte); os cards internos é que são claros.
const TEMAS = {
  profundo: { bg: `radial-gradient(120% 85% at 85% 0%,#0B302B 0%,${COR.prof} 62%)`, linha: 'rgba(191,230,221,.18)', marca: 'rgba(191,230,221,.05)' },
  escuro: { bg: `radial-gradient(120% 85% at 10% 0%,#125049 0%,${COR.inst} 65%)`, linha: 'rgba(191,230,221,.24)', marca: 'rgba(191,230,221,.07)' },
};
const PERFIL = '@concursocomlibero';
const PLAYFAIR = "font-family:'Playfair Display',serif;font-weight:800";
const MONO = "font-family:'JetBrains Mono',monospace";
const SOMBRA = 'box-shadow:0 30px 60px -28px rgba(0,0,0,.55),0 2px 6px rgba(0,0,0,.18)';
const RUIDO = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .35 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
const pad2 = n => String(n).padStart(2, '0');
// **negrito**, ==amarelo== (palavra estratégica) e `mono` (artigo, prazo, número).
// Em fundo escuro o negrito é branco; em card claro, verde institucional.
function rico(s, claro = false) {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, `<b style="font-weight:700;color:${claro ? COR.inst : '#fff'}">$1</b>`)
    .replace(/==(.+?)==/g, claro
      ? `<span style="background:linear-gradient(transparent 58%,${COR.amarelo} 58%,${COR.amarelo} 92%,transparent 92%);box-decoration-break:clone;-webkit-box-decoration-break:clone">$1</span>`
      : `<span style="color:${COR.amarelo}">$1</span>`)
    .replace(/`(.+?)`/g, `<span style="${MONO};font-weight:500;font-size:.86em;letter-spacing:-.01em">$1</span>`);
}

// ---------- peças comuns ----------
const titulo = (s, px = 96, extra = '') => lista(s.titulo).length
  ? `<h1 data-titulo style="${PLAYFAIR};margin:0;font-size:${s.ts || px}px;line-height:1.06;letter-spacing:-.01em;color:#fff;text-wrap:balance${extra}">${lista(s.titulo).map(l => rico(l)).join('<br>')}</h1>` : '';
// Etiqueta: pequena, roxa, em mono (o roxo fica só nesses detalhes).
const etiqueta = (txt, cor = COR.roxo, fg = '#fff') => txt ? `<span style="align-self:flex-start;display:inline-flex;align-items:center;gap:12px;background:${cor};color:${fg};${MONO};font-size:24px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:10px 18px 10px 16px;border-radius:8px"><span style="width:8px;height:8px;border-radius:50%;background:${COR.amarelo};flex:none"></span>${esc(txt)}</span>` : '';
const fio = (w = 120, cor = COR.amarelo) => `<span style="display:block;width:${w}px;height:4px;border-radius:2px;background:${cor};flex:none"></span>`;
const corpo = (s, px = 38, cor = '#E3F2EE') => lista(s.texto).map(p => `<p data-corpo style="margin:0;font-size:${s.corpo || px}px;font-weight:400;line-height:1.42;color:${cor};text-wrap:pretty">${rico(p)}</p>`).join('');
const fundamento = (txt, claro = false) => txt ? `<div style="display:flex;align-items:center;gap:14px;${MONO};font-size:24px;font-weight:500;letter-spacing:.04em;color:${claro ? COR.verde : COR.claro}"><span style="width:28px;height:2px;background:currentColor"></span>${esc(txt)}</div>` : '';

// Moldura de documento: linha fina a 44px da borda, com cantos marcados, cabeçalho com a matéria
// (esquerda) e o nº da folha (direita), como nos autos.
function moldura(t, c, i, n) {
  const canto = (pos) => `<span style="position:absolute;${pos};width:26px;height:26px;border-color:${COR.claro};border-style:solid;opacity:.55"></span>`;
  return `<div style="position:absolute;inset:44px;border:1.5px solid ${t.linha};border-radius:6px;pointer-events:none;z-index:2">
      ${canto('left:-2px;top:-2px;border-width:3px 0 0 3px')}${canto('right:-2px;top:-2px;border-width:3px 3px 0 0')}
      ${canto('left:-2px;bottom:-2px;border-width:0 0 3px 3px')}${canto('right:-2px;bottom:-2px;border-width:0 3px 3px 0')}
    </div>
    <div style="position:absolute;left:96px;right:96px;top:86px;display:flex;justify-content:space-between;align-items:center;gap:24px;${MONO};font-size:21px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:${COR.claro};opacity:.8;z-index:3">
      <span>${esc(c.materia || 'Concursos')}</span>${n > 1 ? `<span>fl. ${pad2(i + 1)}/${pad2(n)}</span>` : ''}
    </div>`;
}
function rodape(s, i, n) {
  const dir = n === 1 ? (s.salvar === false ? '' : 'Salve para revisar') : i === 0 ? 'Arraste' : '';
  return `<div style="position:absolute;left:96px;right:96px;bottom:84px;display:flex;justify-content:space-between;align-items:center;z-index:3">
      <span style="display:flex;align-items:center;gap:14px;font-size:26px;font-weight:600;color:#fff;letter-spacing:.02em"><span style="width:14px;height:14px;background:${COR.amarelo};border-radius:3px"></span>${PERFIL}</span>
      ${dir ? `<span style="display:flex;align-items:center;gap:12px;${MONO};font-size:22px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${COR.amarelo}">${dir}${i === 0 && n > 1 ? '<span style="font-family:Poppins;font-size:30px;line-height:1">→</span>' : ''}</span>` : ''}
    </div>`;
}
const textura = () => `<div style="position:absolute;inset:0;pointer-events:none;background-image:${RUIDO};opacity:.45;mix-blend-mode:overlay;z-index:6"></div>`;
// Marca d'água: § grande e fraco (ou outra letra/número via "marca").
const marcaDagua = (s, t) => s.marca === false ? '' : `<div style="position:absolute;right:-60px;bottom:-190px;${PLAYFAIR};font-size:1000px;line-height:1;color:${t.marca};pointer-events:none;z-index:1">${esc(s.marca || '§')}</div>`;

const area = (html, extra = '') => `<div data-area style="position:absolute;left:112px;right:112px;top:170px;bottom:180px;display:flex;flex-direction:column;justify-content:center;gap:34px;z-index:3${extra}">${html}</div>`;
// Card claro com linhas de caderno opcionais.
const card = (html, { fundo = COR.fundo, pauta = false, pad = '48px 52px', extra = '' } = {}) =>
  `<div style="position:relative;background:${fundo};${pauta ? `background-image:repeating-linear-gradient(180deg,transparent 0 55px,rgba(31,143,127,.13) 55px 56px);` : ''}border-radius:26px;padding:${pad};${SOMBRA};color:${COR.preto}${extra}">${html}</div>`;
const pCard = (txt, px = 34, cor = COR.cinza) => `<p data-corpo style="margin:0;font-size:${px}px;line-height:1.45;color:${cor};text-wrap:pretty">${rico(txt, true)}</p>`;

// Foto do autor (fotos/ deste molde ou do Carrossel Explicativo), resolvida pelo render.
const foto = (c, nome) => (c._fotos || {})[nome] || null;

// ---------- tipos de slide ----------
const TIPOS = {
  capa(s, t, c) {
    const f = s.foto && foto(c, s.foto);
    const fotoHtml = f ? `<div data-foto style="position:absolute;right:0;top:0;bottom:0;width:520px;z-index:1"><img src="${f}" style="width:100%;height:100%;object-fit:cover;object-position:${esc(s.fotoPos || 'center top')}"><div style="position:absolute;inset:0;background:linear-gradient(90deg,${COR.prof} 0%,rgba(6,32,29,.2) 45%,rgba(6,32,29,0) 70%)"></div></div>` : '';
    return `${fotoHtml}${area(`${etiqueta(s.etiqueta)}
      ${s.pre ? `<div style="font-size:44px;font-weight:500;line-height:1.2;color:${COR.claro}">${rico(s.pre)}</div>` : ''}
      ${titulo(s, s.ts || 124, ';line-height:1.02')}
      ${fio(140)}
      ${s.texto ? corpo(s, 38) : ''}`, f ? ';right:470px' : '')}`;
  },
  // Explicação: título, fio amarelo, parágrafos e, opcionalmente, um card de destaque.
  texto(s) {
    return area(`${etiqueta(s.etiqueta)}${titulo(s, 88)}${fio()}${corpo(s)}
      ${s.destaque ? card(pCard(s.destaque, 34, COR.preto), { pad: '36px 44px' }) : ''}`);
  },
  // Frase de impacto: título grande num bloco com borda, e uma linha de apoio.
  impacto(s) {
    return area(`${etiqueta(s.etiqueta)}
      <div style="border-left:6px solid ${COR.amarelo};padding:6px 0 6px 44px">${titulo(s, 116)}</div>
      ${s.sub ? `<div data-corpo style="font-size:40px;font-weight:500;line-height:1.35;color:${COR.claro}">${rico(s.sub)}</div>` : ''}`);
  },
  // Lei seca: folha pautada com cabeçalho do dispositivo e, abaixo, a tradução.
  lei(s) {
    const cab = `<div style="display:flex;justify-content:space-between;align-items:center;gap:20px;padding-bottom:18px;margin-bottom:26px;border-bottom:2px dashed rgba(31,143,127,.45);${MONO};font-size:24px;font-weight:700;letter-spacing:.06em;color:${COR.verde}"><span>${esc(s.dispositivo || '')}</span><span style="color:${COR.roxo}">LEI SECA</span></div>`;
    return area(`${etiqueta(s.etiqueta)}${titulo(s, 80)}
      ${card(`${cab}<p data-corpo style="margin:0;font-family:'Playfair Display',serif;font-style:italic;font-weight:500;font-size:${s.corpo || 36}px;line-height:1.56;color:${COR.preto}">“${rico(s.citacao, true)}”</p>`, { fundo: '#FFFFFF', pauta: true, pad: '40px 52px 44px' })}
      ${lista(s.traducao).map(p => `<p data-corpo style="margin:0;font-size:36px;line-height:1.42;color:#E3F2EE">${rico(p)}</p>`).join('')}`);
  },
  // Lista numerada em mono, com linhas finas entre os itens.
  lista(s) {
    const itens = lista(s.itens).map((it, i) => `<div style="display:flex;gap:30px;align-items:flex-start;padding:24px 0;${i ? `border-top:1.5px solid rgba(191,230,221,.2)` : ''}">
        <span style="flex:none;width:64px;height:64px;border-radius:14px;background:${COR.verde};color:#fff;display:flex;align-items:center;justify-content:center;${MONO};font-size:28px;font-weight:700">${esc(s.marcadores?.[i] ?? pad2(i + 1))}</span>
        <span data-corpo style="font-size:${s.corpo || 36}px;line-height:1.4;color:#E3F2EE;padding-top:6px">${rico(it)}</span></div>`).join('');
    return area(`${etiqueta(s.etiqueta)}${titulo(s, 84)}${fio()}<div style="display:flex;flex-direction:column">${itens}</div>`);
  },
  // Tabela de consulta: valor em mono amarelo à esquerda, texto à direita, num card escuro.
  tabela(s) {
    const linhas = lista(s.linhas).map((l, i) => `<div style="display:grid;grid-template-columns:${s.colValor || 210}px 1fr;align-items:center;gap:32px;padding:24px 36px;${i ? 'border-top:1.5px solid rgba(191,230,221,.18)' : ''}">
        <span style="${MONO};font-size:${s.tamValor || 52}px;font-weight:700;color:${COR.amarelo};letter-spacing:-.02em">${esc(l.valor)}</span>
        <span data-corpo style="font-size:${s.corpo || 32}px;line-height:1.38;color:#E3F2EE">${rico(l.texto)}</span></div>`).join('');
    return area(`${etiqueta(s.etiqueta)}${titulo(s, 84)}
      <div style="border:1.5px solid rgba(191,230,221,.3);border-radius:24px;background:rgba(6,32,29,.45);overflow:hidden">
        ${s.cabecalho ? `<div style="display:grid;grid-template-columns:${s.colValor || 210}px 1fr;gap:32px;padding:18px 36px;background:${COR.claro};color:${COR.inst};${MONO};font-size:22px;font-weight:700;letter-spacing:.1em;text-transform:uppercase">${lista(s.cabecalho).map(h => `<span>${esc(h)}</span>`).join('')}</div>` : ''}
        ${linhas}
      </div>
      ${fundamento(s.fundamento)}`);
  },
  // Número em destaque (prazo, idade, quórum) com explicação.
  numero(s) {
    return area(`${etiqueta(s.etiqueta)}
      <div style="display:flex;align-items:baseline;gap:22px;flex-wrap:wrap"><span data-titulo style="${MONO};font-size:${s.ts || 230}px;font-weight:700;line-height:.9;letter-spacing:-.05em;color:${COR.amarelo}">${esc(s.numero)}</span>${s.unidade ? `<span style="${MONO};font-size:60px;font-weight:700;color:#fff">${esc(s.unidade)}</span>` : ''}</div>
      ${titulo({ titulo: s.titulo }, 76)}${fio()}${corpo(s, 36)}${fundamento(s.fundamento)}`);
  },
  // Pegadinha: o que a banca escreve (vermelho, errado) x o certo (verde).
  pegadinha(s) {
    const bloco = (tipo, txt) => {
      const [cor, rot, sinal] = tipo === 'errado' ? [COR.vermelho, s.rotuloErrado || 'Pegadinha', '✕'] : [COR.acerto, s.rotuloCerto || 'Certo', '✓'];
      return card(`<div style="display:flex;align-items:center;gap:16px;margin-bottom:18px"><span style="width:48px;height:48px;border-radius:50%;background:${cor};color:#fff;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700">${sinal}</span><span style="${MONO};font-size:24px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${cor}">${esc(rot)}</span></div>${pCard(txt, s.corpo || 33, COR.preto)}`,
        { fundo: tipo === 'errado' ? '#FFFFFF' : COR.fundo, pad: '34px 44px 38px', extra: `;border-left:10px solid ${cor}` });
    };
    return area(`${etiqueta(s.etiqueta)}${titulo(s, 80)}${bloco('errado', s.errado)}${bloco('certo', s.certo)}${fundamento(s.fundamento)}`, ';gap:30px');
  },
  cta(s, t, c) {
    const f = s.foto && foto(c, s.foto);
    const polaroide = f ? `<div data-foto style="position:absolute;right:96px;top:300px;background:#fff;padding:22px 22px 60px;transform:rotate(3deg);${SOMBRA};z-index:2"><img src="${f}" style="display:block;width:300px;height:380px;object-fit:cover;object-position:center top"></div>` : '';
    return `${polaroide}${area(`${etiqueta(s.etiqueta)}${titulo(s, f ? 84 : 100)}${fio()}${corpo(s, 38)}
      ${s.botao ? `<span style="align-self:flex-start;background:${COR.amarelo};color:${COR.prof};border-radius:999px;padding:22px 44px;font-size:34px;font-weight:700;${SOMBRA}">${esc(s.botao)}</span>` : ''}`, f ? ';right:470px' : '')}`;
  },

  // ---------- posts de tela única ----------
  // Certo ou errado: afirmação num card, veredito colorido e o fundamento.
  questao(s) {
    const ok = s.gabarito === 'certo';
    const cor = ok ? COR.acerto : COR.vermelho;
    return area(`${etiqueta(s.etiqueta || 'Certo ou errado?')}${titulo(s, 72)}
      ${card(`<div style="${MONO};font-size:22px;font-weight:700;letter-spacing:.12em;color:${COR.verde};margin-bottom:18px">${esc(s.banca || 'AFIRMAÇÃO')}</div>${pCard(s.afirmacao, s.corpo || 36, COR.preto)}`, { fundo: '#FFFFFF', pad: '38px 48px 42px' })}
      <div style="display:flex;gap:28px;align-items:flex-start">
        <span style="flex:none;display:flex;align-items:center;gap:14px;background:${cor};color:#fff;border-radius:14px;padding:16px 26px;${MONO};font-size:34px;font-weight:700;letter-spacing:.08em">${ok ? '✓ CERTO' : '✕ ERRADO'}</span>
        <p data-corpo style="margin:0;font-size:${s.corpoResposta || 32}px;line-height:1.42;color:#E3F2EE;padding-top:4px">${rico(s.explicacao)}</p>
      </div>
      ${fundamento(s.fundamento)}`, ';gap:36px');
  },
  // Prazo/número de bolso: número gigante em mono, o que é e o alerta (vermelho) da prova.
  prazo(s) {
    return area(`${etiqueta(s.etiqueta || 'Prazo que cai')}
      ${titulo(s, 80)}
      <div style="display:flex;align-items:baseline;gap:22px"><span data-titulo style="${MONO};font-size:${s.tn || 260}px;font-weight:700;line-height:.86;letter-spacing:-.05em;color:${COR.amarelo}">${esc(s.numero)}</span><span style="${MONO};font-size:64px;font-weight:700;color:#fff">${esc(s.unidade || '')}</span></div>
      ${card(pCard(s.texto, s.corpo || 34, COR.preto), { pad: '34px 44px' })}
      ${s.alerta ? `<div style="display:flex;gap:18px;align-items:flex-start;border:2px solid ${COR.vermelho};background:rgba(192,57,43,.14);border-radius:18px;padding:22px 28px"><span style="flex:none;${MONO};font-size:22px;font-weight:700;letter-spacing:.1em;color:#fff;background:${COR.vermelho};border-radius:8px;padding:6px 12px">ATENÇÃO</span><span data-corpo style="font-size:30px;line-height:1.4;color:#fff">${rico(s.alerta)}</span></div>` : ''}
      ${fundamento(s.fundamento)}`, ';gap:34px');
  },
};

export function renderCarrossel(c) {
  const slides = lista(c.slides);
  const n = slides.length, avisos = [];
  slides.forEach((s, i) => {
    if (!TIPOS[s.tipo]) avisos.push(`slide ${i + 1}: tipo "${s.tipo}" não existe`);
    if (!TEMAS[s.tema]) avisos.push(`slide ${i + 1}: tema "${s.tema}" não existe (use profundo ou escuro)`);
    if (i >= 2 && s.tema === slides[i - 1].tema && s.tema === slides[i - 2].tema) avisos.push(`slides ${i - 1} a ${i + 1}: três fundos "${s.tema}" seguidos`);
    // Direção de arte: sem travessões nos textos.
    if (/[—–]/.test(JSON.stringify(s))) avisos.push(`slide ${i + 1}: tem travessão (— ou –); troque por vírgula, dois-pontos ou ponto`);
  });
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;0,800;1,500&family=Poppins:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box}body{margin:0;font-family:Poppins,sans-serif;-webkit-font-smoothing:antialiased}</style></head><body>
<div id="painel" style="position:relative;width:${n * 1080}px;height:1350px">
${slides.map((s, i) => {
    const t = TEMAS[s.tema] || TEMAS.profundo;
    const tipo = TIPOS[s.tipo] || TIPOS.texto;
    return `<div id="slide-${i + 1}" data-tipo="${esc(s.tipo)}" style="position:absolute;left:${i * 1080}px;top:0;width:1080px;height:1350px;overflow:hidden;background:${t.bg};color:#fff">
  ${marcaDagua(s, t)}${moldura(t, c, i, n)}${tipo(s, t, c)}${rodape(s, i, n)}${textura()}</div>`;
  }).join('\n')}
</div></body></html>`;
  return { html, total: n, avisos };
}

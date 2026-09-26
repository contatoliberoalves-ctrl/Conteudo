// Carrossel Eduarda: slides de 1080×1350 a partir dos modelos do kit "Carrosséis · Eduarda Caraciolo"
// (Linha Clara L01–L16 e Linha Escura D01–D07). Cada slide do dados.json diz o "modelo" e os textos.
// Texto rico: **negrito** e ==destaque rosé==. Imagens: nomes de arquivo resolvidos por opts.imagem().

const TINTA = '#2A2324', SEC = '#4A3F40', ROSE = '#C99A9D', MARCA = '#D8B1B3', ROSE_TXT = '#B5868A', ROSE_ESC = '#A9767A';
const DARK = '#0F0D0D', ACENTO = '#E8B9B9', CLARO_DARK = '#E7DEDE';
const BG_CLARO = 'radial-gradient(130% 90% at 25% 15%,#FFFFFF 0%,#F3EFEE 100%)';
const BG_CARD = 'radial-gradient(130% 90% at 25% 15%,#FFFFFF 0%,#EFE9E8 100%)';
const BG_ROSE = 'linear-gradient(160deg,#C79496 0%,#D9AFB1 100%)';
const GILDA = "font-family:'Gilda Display',serif", ANTON = 'font-family:Anton,sans-serif';
const NOME = 'Eduarda Caraciolo', CARGO_RODAPE = 'Advogada · Direito Civil e ECA', CARGO = 'Advogada | Direito Civil e ECA';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Texto rico. Na Linha Escura o negrito e o destaque ficam no rosé claro.
const rt = (s, escuro = false, corB = TINTA) => esc(s)
  .replace(/\*\*(.+?)\*\*/g, escuro ? `<b style="color:${ACENTO};font-weight:600">$1</b>` : `<b style="font-weight:600;color:${corB}">$1</b>`)
  .replace(/==(.+?)==/g, `<span style="color:${escuro ? ACENTO : ROSE}">$1</span>`)
  .replace(/\n/g, '<br>');
const lista = v => (Array.isArray(v) ? v : v ? [v] : []);

// Imagem ou, sem arquivo, um espaço reservado com a legenda (como o <image-slot> do kit).
function imagem(ctx, nome, legenda, { fit = 'cover', pos = 'center', escuro = false } = {}) {
  const url = nome && ctx.imagem(nome);
  if (url) return `<img data-foto src="${url}" style="display:block;width:100%;height:100%;object-fit:${fit};object-position:${pos}">`;
  if (nome) ctx.avisos.push(`slide ${ctx.n}: imagem não encontrada: ${nome} (coloque em fotos/ ou imagens/)`);
  const cor = escuro ? 'rgba(232,185,185,.35)' : 'rgba(169,118,122,.45)';
  return `<div data-vazio style="width:100%;height:100%;box-sizing:border-box;border:2px dashed ${cor};background:${escuro ? 'rgba(255,255,255,.04)' : 'rgba(201,154,157,.10)'};display:flex;align-items:center;justify-content:center;text-align:center;padding:24px;font-size:24px;color:${escuro ? '#8E8282' : ROSE_ESC}">${esc(legenda)}</div>`;
}

function avatar(ctx, px = 80) {
  const url = ctx.imagem(ctx.post.avatar || 'avatar.jpg');
  const dentro = url ? `<img src="${url}" style="width:100%;height:100%;object-fit:cover">`
    : `<span style="${GILDA};font-size:${px * 0.42}px;color:#fff">EC</span>`;
  return `<div style="width:${px}px;height:${px}px;flex:none;border-radius:50%;overflow:hidden;background:${ROSE};display:flex;align-items:center;justify-content:center">${dentro}</div>`;
}
const assinatura = (ctx, escuro = false) => escuro
  ? `<div style="display:flex;align-items:center;gap:16px">${avatar(ctx, 72)}<div style="display:flex;flex-direction:column;align-items:flex-start;gap:2px"><span style="font-size:30px;font-weight:500">${NOME}</span><span style="font-size:17px;color:#B9AEAE">${CARGO}</span></div></div>`
  : `<div style="display:flex;align-items:center;gap:18px">${avatar(ctx, 80)}<div style="display:flex;flex-direction:column;gap:2px"><span style="font-size:32px;font-weight:500">${NOME}</span><span style="font-size:18px;color:#8C7F80">${CARGO}</span></div></div>`;

const RODAPE = `<div style="position:absolute;left:0;right:0;bottom:52px;display:flex;justify-content:center;gap:14px;font-size:20px;color:#8C7F80"><span>${NOME}</span><span style="color:${ROSE}">|</span><span style="font-weight:600;color:#5A4E4F">${CARGO_RODAPE}</span></div>`;
const RODAPE_ROSE = `<div style="position:absolute;left:0;right:0;bottom:48px;display:flex;justify-content:center;gap:14px;font-size:20px;color:#3E3334"><span>${NOME}</span><span>|</span><span style="font-weight:600">${CARGO_RODAPE}</span></div>`;
const BARRA = `<div style="position:absolute;left:0;right:0;bottom:0;height:14px;background:${ROSE}"></div>`;
const check = (px = 44, fs = 26, mt = 4) => `<span style="flex:none;width:${px}px;height:${px}px;border-radius:50%;background:${TINTA};color:#fff;display:flex;align-items:center;justify-content:center;font-size:${fs}px;margin-top:${mt}px">✓</span>`;
// Título grande de capa: tamanho padrão por comprimento do texto (o render ainda reduz se estourar).
const porTamanho = (s, faixas) => { const n = String(s || '').length; for (const [max, px] of faixas) if (n <= max) return px; return faixas[faixas.length - 1][1]; };

// Cada modelo: fundo, rodapé (claro | rose | nenhum) e o conteúdo.
const MODELOS = {
  // ---------- Linha Clara ----------
  L01: { nome: 'Capa com foto', fundo: BG_CLARO, rodape: 'barra', html: (s, ctx) => {
    const px = s.tamanhoTitulo || porTamanho(s.titulo, [[34, 104], [50, 92], [999, 84]]);
    return `${s.numero != null && s.numero !== '' ? `<div style="position:absolute;right:-40px;top:-80px;${GILDA};font-size:1500px;line-height:1;color:#EBDADB">${esc(s.numero)}</div>` : ''}
      <div style="position:absolute;right:0;top:0;bottom:0;width:560px">${imagem(ctx, s.foto, 'foto da Eduarda (recorte)', { pos: s.posicao || 'center bottom' })}</div>
      <div data-caixa style="position:absolute;left:84px;top:${s.topo || (px >= 104 ? 380 : 340)}px;width:${px >= 104 ? 520 : 540}px;bottom:230px;display:flex;flex-direction:column;gap:40px">
        <span data-fit style="${GILDA};font-size:${px}px;line-height:1.03;text-wrap:balance">${rt(s.titulo)}</span>
        ${s.destaque ? `<span style="font-size:40px;font-weight:600;line-height:1.5;color:#fff"><span style="background:${ROSE};padding:2px 12px;box-decoration-break:clone;-webkit-box-decoration-break:clone">${rt(s.destaque, false, '#fff')}</span></span>` : ''}
      </div>
      <div style="position:absolute;left:84px;bottom:110px">${assinatura(ctx)}</div>`;
  } },
  L02: { nome: 'Capa tipográfica', fundo: BG_CLARO, rodape: 'barra', arraste: true, html: (s, ctx) => `
      <div data-caixa style="position:absolute;left:96px;right:96px;top:60px;bottom:220px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:36px;text-align:center">
        ${s.sobretitulo ? `<span style="font-size:26px;letter-spacing:.3em;text-transform:uppercase;color:${ROSE_ESC};font-weight:600">${esc(s.sobretitulo)}</span>` : ''}
        ${s.titulo ? `<span style="${GILDA};font-size:76px;line-height:1.1;text-wrap:balance">${rt(s.titulo)}</span>` : ''}
        <span data-fit style="${GILDA};font-size:${s.tamanhoPalavra || porTamanho(s.palavra, [[10, 180], [999, 170]])}px;line-height:.9;color:${ROSE}">${rt(s.palavra)}</span>
        ${s.selo ? `<span style="background:${ROSE};color:#fff;font-size:36px;font-weight:500;padding:14px 48px;border-radius:999px;margin-top:12px">${esc(s.selo)}</span>` : ''}
      </div>
      <div style="position:absolute;left:0;right:0;bottom:110px;display:flex;justify-content:center">${assinatura(ctx)}</div>` },
  L03: { nome: 'Card com borda', fundo: BG_CLARO, rodape: 'barra', html: s => `
      <div data-caixa style="position:absolute;left:72px;right:72px;top:-40px;bottom:130px;border:2px solid #D9B9BB;border-radius:36px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:56px;padding:0 90px;text-align:center">
        <span data-fit style="${GILDA};font-size:${s.tamanhoTitulo || 80}px;line-height:1.15;text-wrap:balance">${rt(s.titulo)}</span>
        ${lista(s.texto).map(t => `<span style="font-size:36px;line-height:1.55;color:${SEC};text-wrap:pretty">${rt(t)}</span>`).join('')}
      </div>` },
  L04: { nome: 'Título caixa-alta + destaque', fundo: BG_CLARO, rodape: 'barra', html: s => `
      <div data-caixa style="position:absolute;left:110px;right:110px;top:60px;bottom:130px;display:flex;flex-direction:column;justify-content:center;gap:48px">
        <div style="width:100%;height:2px;background:${ROSE};flex:none"></div>
        <span data-fit style="${GILDA};font-size:${s.tamanhoTitulo || 96}px;line-height:1.05;text-transform:uppercase">${rt(s.titulo)}</span>
        ${lista(s.texto).map(t => `<span style="font-size:36px;line-height:1.55;color:${SEC};text-wrap:pretty">${rt(t)}</span>`).join('')}
        ${s.destaque ? `<div style="background:${MARCA};border-radius:20px;padding:32px 40px;font-size:36px;line-height:1.5">${rt(s.destaque)}</div>` : ''}
      </div>` },
  L05: { nome: 'Fundo rosé com checklist', fundo: BG_ROSE, rodape: 'rose', html: s => `
      <div data-caixa style="position:absolute;left:64px;right:64px;top:-40px;bottom:120px;border:2px solid rgba(255,255,255,.7);border-radius:36px;display:flex;flex-direction:column;justify-content:center;gap:${lista(s.itens).length > 3 ? 44 : 56}px;padding:0 80px">
        <span data-fit style="${GILDA};font-size:${s.tamanhoTitulo || 84}px;line-height:1.1;color:${TINTA}">${rt(s.titulo)}</span>
        ${lista(s.itens).map(t => `<div style="display:flex;gap:24px;align-items:flex-start">${check()}<span style="font-size:35px;line-height:1.5;color:${TINTA}">${rt(t)}</span></div>`).join('')}
      </div>` },
  L06: { nome: 'Card branco com sombra', fundo: BG_CARD, rodape: 'barra', html: s => `
      <div data-caixa style="position:absolute;left:90px;right:90px;top:90px;bottom:150px;background:#fff;border:2px solid #E6D2D3;border-radius:40px;box-shadow:0 40px 80px -30px rgba(90,60,62,.35);display:flex;flex-direction:column;justify-content:center;gap:48px;padding:0 84px">
        <span data-fit style="${GILDA};font-size:${s.tamanhoTitulo || 84}px;line-height:1.1;color:${ROSE}">${rt(s.titulo)}</span>
        ${lista(s.texto).map(t => `<span style="font-size:35px;line-height:1.55;color:${SEC}">${rt(t)}</span>`).join('')}
      </div>` },
  L07: { nome: 'Etiqueta sobre card', fundo: BG_CLARO, rodape: 'barra', html: s => `
      <div style="position:absolute;left:90px;right:90px;top:0;bottom:130px;display:flex;flex-direction:column;justify-content:center;align-items:center">
        <div data-caixa style="position:relative;width:100%;box-sizing:border-box;max-height:1000px;border:2px solid #D9B9BB;border-radius:32px;padding:130px 80px 90px;text-align:center;font-size:36px;line-height:1.6;color:${SEC}">
          <span style="position:absolute;left:50%;top:0;transform:translate(-50%,-50%);background:${ROSE};color:${TINTA};${GILDA};font-size:68px;padding:10px 48px;border-radius:18px;white-space:nowrap">${esc(s.etiqueta)}</span>
          ${lista(s.texto).map(rt).join('<br><br>')}
        </div>
      </div>` },
  L08: { nome: 'Marca-texto + imagem', fundo: BG_CLARO, rodape: 'barra', html: (s, ctx) => `
      <div style="position:absolute;right:0;top:80px;bottom:120px;width:460px">${imagem(ctx, s.imagem, s.legendaImagem || 'objeto recortado (ex: Vade Mecum)', { fit: 'contain' })}</div>
      <div data-caixa style="position:absolute;left:90px;width:560px;top:60px;bottom:130px;display:flex;flex-direction:column;justify-content:center;gap:48px">
        <span data-fit style="${GILDA};font-size:${s.tamanhoTitulo || 80}px;line-height:1.12;text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:14px;text-decoration-color:${ROSE}">${rt(s.titulo)}</span>
        ${s.marcaTexto ? `<span style="font-size:36px;font-weight:600;line-height:1.55"><span style="background:${MARCA};padding:2px 10px;box-decoration-break:clone;-webkit-box-decoration-break:clone">${rt(s.marcaTexto)}</span></span>` : ''}
        ${lista(s.texto).map(t => `<span style="font-size:35px;line-height:1.55;color:${SEC}">${rt(t)}</span>`).join('')}
      </div>` },
  L09: { nome: 'Dado + gráfico', fundo: BG_CLARO, rodape: 'barra', html: (s, ctx) => {
    let quadro;
    if (s.grafico) quadro = imagem(ctx, s.grafico, 'gráfico ou print', { fit: 'contain' });
    else if (s.barras) {
      const max = Math.max(...s.barras.map(b => b.valor));
      quadro = `<div style="height:100%;box-sizing:border-box;padding:48px 56px;display:flex;flex-direction:column;justify-content:center;gap:30px">${s.barras.map(b => `
        <div style="display:flex;flex-direction:column;gap:10px;text-align:left">
          <div style="display:flex;justify-content:space-between;font-size:28px;${b.destaque ? `font-weight:600;color:${TINTA}` : `color:${SEC}`}"><span>${esc(b.rotulo)}</span><span>${esc(b.texto ?? b.valor)}</span></div>
          <div style="height:30px;border-radius:999px;background:#F3E8E8"><div style="height:100%;width:${(100 * b.valor / max).toFixed(1)}%;border-radius:999px;background:${b.destaque ? ROSE : '#E3CDCE'}"></div></div>
        </div>`).join('')}</div>`;
    } else quadro = imagem(ctx, null, 'gráfico ou print');
    return `
      <div data-caixa style="position:absolute;left:96px;right:96px;top:110px;bottom:140px;display:flex;flex-direction:column;align-items:center;gap:44px;text-align:center">
        <span data-fit style="${GILDA};font-size:${s.tamanhoTitulo || 72}px;line-height:1.1;border:2px solid ${TINTA};border-radius:16px;padding:6px 32px">${rt(s.titulo)}</span>
        ${lista(s.texto).map(t => `<span style="font-size:34px;line-height:1.55;color:${SEC}">${rt(t)}</span>`).join('')}
        <div style="flex:1;min-height:0;width:100%;border:2px solid #D9B9BB;border-radius:28px;overflow:hidden;background:#fff">${quadro}</div>
        ${s.fonte ? `<span style="align-self:flex-start;font-size:20px;color:#8C7F80">${esc(s.fonte)}</span>` : ''}
      </div>`;
  } },
  L10: { nome: 'Questão', fundo: BG_CLARO, rodape: 'barra', html: s => {
    const letras = 'ABCDE';
    return `
      <div data-caixa style="position:absolute;left:64px;right:64px;top:-40px;bottom:120px;border:2px solid #D9B9BB;border-radius:36px;display:flex;flex-direction:column;gap:30px;padding:140px 72px 60px">
        <div style="display:flex;align-items:baseline;justify-content:space-between;gap:24px"><span style="${GILDA};font-size:80px;text-transform:uppercase">Questão ${esc(String(s.numero ?? 1).padStart(2, '0'))}</span>${s.tema ? `<span style="font-size:22px;letter-spacing:.2em;color:${ROSE_ESC};font-weight:600;text-transform:uppercase">${esc(s.tema)}</span>` : ''}</div>
        <span style="font-size:28px;line-height:1.55;color:#3E3334;text-wrap:pretty">${rt(s.enunciado)}</span>
        ${s.comando ? `<span style="font-size:28px;font-weight:600">${rt(s.comando)}</span>` : ''}
        <div style="display:flex;flex-direction:column;gap:18px;font-size:27px;line-height:1.45;color:#3E3334">
          ${lista(s.alternativas).map((a, i) => `<div style="display:flex;gap:18px"><b style="flex:none;width:44px;height:44px;border-radius:50%;border:2px solid ${ROSE};display:flex;align-items:center;justify-content:center;font-size:22px;box-sizing:border-box">${letras[i]}</b><span>${rt(a)}</span></div>`).join('')}
        </div>
      </div>`;
  } },
  L11: { nome: 'Gabarito comentado', fundo: BG_CLARO, rodape: 'barra', html: s => `
      <div data-caixa style="position:absolute;left:96px;right:96px;top:110px;bottom:140px;display:flex;flex-direction:column;gap:44px">
        <span style="align-self:flex-start;background:${MARCA};${GILDA};font-size:68px;text-transform:uppercase;padding:8px 32px;border-radius:16px">${esc(s.titulo || 'Gabarito comentado')}</span>
        ${lista(s.itens).map(it => `<div style="display:flex;flex-direction:column;gap:12px"><div style="display:flex;gap:16px;align-items:center"><span style="font-size:26px;font-weight:600;letter-spacing:.05em">QUESTÃO ${esc(String(it.questao).padStart(2, '0'))}</span><span style="background:${TINTA};color:#fff;font-size:24px;font-weight:600;padding:2px 14px;border-radius:8px">${esc(it.letra)}</span></div><span style="font-size:30px;line-height:1.5;color:${SEC}">${rt(it.texto)}</span></div>`).join('<div style="height:1px;background:#DCC4C5;flex:none"></div>')}
      </div>` },
  L12: { nome: 'Pergunta para comentários', fundo: BG_CLARO, rodape: 'barra', html: s => `
      <div data-caixa style="position:absolute;left:110px;right:110px;top:60px;bottom:130px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:48px;text-align:center">
        <span data-fit style="${GILDA};font-size:${s.tamanhoTitulo || 92}px;line-height:1.15;text-wrap:balance">${rt(s.pergunta)}</span>
        <div style="width:120px;height:2px;background:${ROSE};flex:none"></div>
        ${s.complemento ? `<span style="font-size:38px;font-weight:600;color:${ROSE_TXT}">${rt(s.complemento)}</span>` : ''}
      </div>` },
  L13: { nome: 'QR code', fundo: BG_CLARO, rodape: 'so-barra', html: (s, ctx) => `
      <div data-caixa style="position:absolute;left:96px;right:96px;top:150px;bottom:240px;display:flex;flex-direction:column;align-items:center;gap:40px;text-align:center">
        <span data-fit style="${GILDA};font-size:${s.tamanhoTitulo || 96}px;line-height:1.1">${rt(s.titulo)}</span>
        ${s.texto ? `<span style="font-size:38px;font-weight:600;line-height:1.5;color:${ROSE_TXT}">${rt(s.texto)}</span>` : ''}
        <div style="width:440px;height:440px;flex:none;box-sizing:content-box;border:10px solid ${MARCA};border-radius:40px;padding:24px;background:#fff;margin-top:16px">${s._qr || imagem(ctx, s.qr, 'QR code', { fit: 'contain' })}</div>
        ${s.link && s.mostrarLink !== false ? `<span style="font-size:26px;color:#8C7F80;margin-top:-8px">${esc(s.link.replace(/^https?:\/\//, ''))}</span>` : ''}
      </div>
      <div style="position:absolute;left:0;right:0;bottom:110px;display:flex;justify-content:center">${assinatura(ctx)}</div>` },
  L14: { nome: 'Item numerado', fundo: BG_CLARO, rodape: 'barra', html: s => `
      <div style="position:absolute;right:-60px;top:-120px;${GILDA};font-size:1400px;line-height:1;color:#F0E3E4">${esc(s.numero)}</div>
      <div style="position:absolute;left:90px;right:90px;top:0;bottom:130px;display:flex;flex-direction:column;justify-content:center">
        <div data-caixa style="background:#fff;border:2px solid ${TINTA};border-radius:32px;overflow:hidden;box-shadow:0 30px 60px -30px rgba(90,60,62,.35);max-height:1080px">
          <div style="background:linear-gradient(90deg,#C79496,#DDB4B6);display:flex;align-items:center;gap:36px;padding:36px 48px;border-bottom:2px solid ${TINTA}">
            <span style="flex:none;width:120px;height:120px;background:#fff;border:2px solid ${TINTA};border-radius:20px;display:flex;align-items:center;justify-content:center;${GILDA};font-size:88px">${esc(s.numero)}</span>
            <span style="font-size:58px;font-weight:600;line-height:1.1;color:#fff">${rt(s.titulo, false, '#fff')}</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:36px;padding:64px 56px 72px">
            ${lista(s.itens).map(t => `<div style="display:flex;gap:22px;align-items:flex-start">${check(40, 22, 6)}<span style="font-size:36px;line-height:1.5">${rt(t)}</span></div>`).join('')}
          </div>
        </div>
      </div>` },
  L15: { nome: 'Caiu na prova (print)', fundo: BG_ROSE, rodape: 'rose', html: (s, ctx) => `
      <div style="position:absolute;left:80px;right:80px;top:130px;bottom:150px;display:flex;flex-direction:column;align-items:center;gap:56px">
        <span data-fit style="${GILDA};font-size:${s.tamanhoTitulo || 96}px;line-height:1;color:${TINTA};text-align:center">${rt(s.titulo || 'Caiu na peça:')}</span>
        <div style="flex:1;min-height:0;width:100%;box-sizing:border-box;background:#fff;border-radius:24px;box-shadow:0 40px 80px -30px rgba(60,30,32,.45);padding:24px">${imagem(ctx, s.imagem, 'print do Vade Mecum / índice / prova', { fit: 'contain' })}</div>
      </div>` },
  L16: { nome: 'CTA final com foto', fundo: BG_CLARO, rodape: 'so-barra', html: (s, ctx) => `
      <div style="position:absolute;right:0;top:0;bottom:0;width:440px">${imagem(ctx, s.foto, 'foto da Eduarda', { pos: s.posicao || 'center' })}</div>
      <div data-caixa style="position:absolute;left:90px;width:520px;top:40px;bottom:40px;display:flex;flex-direction:column;justify-content:center;gap:44px">
        <span data-fit style="${GILDA};font-size:${s.tamanhoTitulo || 74}px;line-height:1.15;text-wrap:pretty">${rt(s.titulo)}</span>
        ${s.texto ? `<span style="font-size:36px;font-weight:600;line-height:1.5;color:${ROSE_TXT}">${rt(s.texto)}</span>` : ''}
        ${s.botao ? `<span style="align-self:flex-start;background:${TINTA};color:#fff;font-size:30px;font-weight:500;padding:18px 36px;border-radius:999px">${esc(s.botao)}</span>` : ''}
        <div style="margin-top:20px">${assinatura(ctx)}</div>
      </div>` },

  // ---------- Linha Escura ----------
  D01: { nome: 'Capa dark', fundo: DARK, escuro: true, html: (s, ctx) => `
      <div style="position:absolute;inset:0">${imagem(ctx, s.foto, 'foto de fundo / montagem', { escuro: true, pos: s.posicao || 'center top' })}</div>
      <div style="position:absolute;left:0;right:0;bottom:0;height:780px;background:linear-gradient(180deg,rgba(15,13,13,0) 0%,rgba(15,13,13,.85) 45%,${DARK} 100%)"></div>
      <div data-caixa style="position:absolute;left:80px;right:80px;bottom:120px;display:flex;flex-direction:column;align-items:center;gap:18px;text-align:center">
        ${s.sobretitulo ? `<span style="font-size:40px;font-weight:500;letter-spacing:.02em">${rt(s.sobretitulo, true)}</span>` : ''}
        <span data-fit style="${ANTON};font-size:${s.tamanhoTitulo || porTamanho(s.titulo, [[10, 210], [16, 190], [999, 160]])}px;line-height:.9;color:${ACENTO};text-transform:uppercase;width:100%">${rt(s.titulo, true)}</span>
        ${s.subtitulo ? `<span style="font-size:32px;color:${CLARO_DARK};margin-top:12px">${rt(s.subtitulo, true)}</span>` : ''}
        <div style="margin-top:28px">${assinatura(ctx, true)}</div>
      </div>` },
  D02: { nome: 'Etapas numeradas', fundo: DARK, escuro: true, html: (s, ctx) => `
      <div style="position:absolute;right:0;top:0;bottom:0;width:520px">${imagem(ctx, s.imagem, 'personagem / imagem temática', { escuro: true, pos: s.posicao || 'center' })}</div>
      <div style="position:absolute;right:0;top:0;bottom:0;width:620px;background:linear-gradient(90deg,${DARK} 0%,rgba(15,13,13,0) 45%)"></div>
      <div data-caixa style="position:absolute;left:80px;width:560px;top:110px;bottom:110px;display:flex;flex-direction:column;gap:30px">
        <span data-fit style="${ANTON};font-size:${s.tamanhoTitulo || 104}px;line-height:.92;text-transform:uppercase">${rt(s.titulo, true)}</span>
        ${s.subtitulo ? `<span style="${ANTON};font-size:44px;color:${ACENTO};text-transform:uppercase;letter-spacing:.02em">${rt(s.subtitulo, true)}</span>` : ''}
        ${lista(s.texto).map(t => `<span style="font-size:32px;line-height:1.5;color:${CLARO_DARK}">${rt(t, true)}</span>`).join('')}
        <div style="display:flex;flex-direction:column;gap:18px;margin-top:12px">
          ${lista(s.etapas).map((e, i) => `<div style="display:flex;align-items:center;gap:22px"><span style="flex:none;width:64px;height:64px;background:${ACENTO};color:${DARK};border-radius:14px;display:flex;align-items:center;justify-content:center;${ANTON};font-size:38px">${i + 1}</span><span style="flex:1;border:1.5px solid rgba(232,185,185,.6);border-radius:14px;padding:14px 22px;font-size:28px;font-weight:600;letter-spacing:.04em;text-transform:uppercase">${rt(e, true)}</span></div>`).join('')}
        </div>
        ${s.obs ? `<span style="margin-top:auto;align-self:flex-start;background:${ACENTO};color:${DARK};font-size:22px;font-weight:600;padding:10px 18px;border-radius:10px">${esc(s.obs)}</span>` : ''}
      </div>` },
  D03: { nome: 'Tabela', fundo: DARK, escuro: true, html: (s, ctx) => `
      <div style="position:absolute;right:0;top:0;bottom:0;width:500px">${imagem(ctx, s.imagem, 'personagem / imagem temática', { escuro: true, pos: s.posicao || 'center' })}</div>
      <div style="position:absolute;right:0;top:0;bottom:0;width:600px;background:linear-gradient(90deg,${DARK} 0%,rgba(15,13,13,0) 45%)"></div>
      <div data-caixa style="position:absolute;left:80px;width:560px;top:130px;bottom:110px;display:flex;flex-direction:column;gap:40px">
        <span data-fit style="${ANTON};font-size:${s.tamanhoTitulo || 120}px;line-height:.92;text-transform:uppercase">${rt(s.titulo, true)}</span>
        <div style="width:64px;height:4px;background:${ACENTO};flex:none"></div>
        ${lista(s.texto).map(t => `<span style="font-size:32px;line-height:1.5;color:${CLARO_DARK}">${rt(t, true)}</span>`).join('')}
        <div style="border:1.5px solid rgba(232,185,185,.6);border-radius:18px;overflow:hidden;flex:none">
          ${s.tabelaTitulo ? `<div style="background:${ACENTO};color:${DARK};font-size:30px;font-weight:700;padding:18px 28px;letter-spacing:.03em;text-transform:uppercase">${esc(s.tabelaTitulo)}</div>` : ''}
          <div style="display:flex;flex-direction:column;font-size:32px;text-align:center">
            ${lista(s.linhas).map((l, i, a) => `<span style="padding:16px;${i < a.length - 1 ? 'border-bottom:1px solid rgba(255,255,255,.12)' : ''}">${rt(l, true)}</span>`).join('')}
          </div>
        </div>
        ${s.rodape ? `<span style="margin-top:auto;font-size:28px;line-height:1.5;color:${ACENTO};font-weight:500">${rt(s.rodape, true)}</span>` : ''}
      </div>` },
  D04: { nome: 'Número em destaque', fundo: DARK, escuro: true, html: (s, ctx) => `
      <div style="position:absolute;left:0;top:0;bottom:0;width:620px">${imagem(ctx, s.imagem, 'personagem / imagem temática', { escuro: true, pos: s.posicao || 'center' })}</div>
      <div style="position:absolute;left:0;top:0;bottom:0;width:720px;background:linear-gradient(270deg,${DARK} 0%,rgba(15,13,13,0) 50%)"></div>
      <div data-caixa style="position:absolute;right:80px;width:440px;top:80px;bottom:80px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:10px;text-align:center">
        <span data-fit style="${ANTON};font-size:${s.tamanhoNumero || 250}px;line-height:.9;width:100%">${esc(s.numero)}</span>
        ${s.legenda ? `<span style="font-size:28px;letter-spacing:.2em;color:${CLARO_DARK};text-transform:uppercase">${esc(s.legenda)}</span>` : ''}
        ${s.palavra ? `<span data-fit style="${ANTON};font-size:${s.tamanhoPalavra || 130}px;line-height:1;color:${ACENTO};text-transform:uppercase;width:100%">${esc(s.palavra)}</span>` : ''}
        ${s.texto ? `<span style="margin-top:36px;font-size:30px;line-height:1.5;color:${CLARO_DARK}">${rt(s.texto, true)}</span>` : ''}
      </div>` },
  D05: { nome: 'Comparativo 50/50', fundo: DARK, escuro: true, html: (s, ctx) => {
    const col = lista(s.colunas);
    return `
      <div style="position:absolute;right:0;top:0;width:560px;height:760px">${imagem(ctx, s.imagem, 'personagem / imagem temática', { escuro: true, pos: s.posicao || 'center top' })}</div>
      <div style="position:absolute;right:0;top:0;width:660px;height:760px;background:linear-gradient(90deg,${DARK} 0%,rgba(15,13,13,0) 40%),linear-gradient(0deg,${DARK} 0%,rgba(15,13,13,0) 35%)"></div>
      <div data-caixa style="position:absolute;left:80px;right:80px;top:120px;bottom:110px;display:flex;flex-direction:column;gap:40px">
        <span data-fit style="${ANTON};font-size:${s.tamanhoTitulo || 96}px;line-height:.92;text-transform:uppercase;width:560px">${rt(s.titulo, true)}</span>
        <div style="width:64px;height:4px;background:${ACENTO};flex:none"></div>
        ${lista(s.texto).map(t => `<span style="font-size:32px;line-height:1.5;color:${CLARO_DARK};width:600px">${rt(t, true)}</span>`).join('')}
        <div style="flex:none;margin-top:auto;display:grid;grid-template-columns:1fr 1fr;border:1.5px solid rgba(232,185,185,.6);border-radius:20px;overflow:hidden">
          ${col.map((c, i) => `<span style="background:${ACENTO};color:${DARK};${ANTON};font-size:64px;text-align:center;padding:14px;${i ? `border-left:1.5px solid ${DARK}` : ''}">${esc(c.valor)}</span>`).join('')}
          ${col.map((c, i) => `<span style="${ANTON};font-size:${c.rotulo && c.rotulo.length > 10 ? 60 : 72}px;text-align:center;padding:28px 16px;color:${ACENTO};text-transform:uppercase;${i ? 'border-left:1.5px solid rgba(232,185,185,.6)' : ''}">${esc(c.rotulo)}</span>`).join('')}
        </div>
      </div>`;
  } },
  D06: { nome: 'Fluxograma', fundo: `radial-gradient(90% 60% at 50% 0%,#231C1C 0%,${DARK} 70%)`, escuro: true, html: s => {
    const f = s.fluxo || {}, seta = `<span style="width:2px;height:40px;background:${ACENTO}"></span>`;
    return `
      <div data-caixa style="position:absolute;left:100px;right:100px;top:120px;bottom:110px;display:flex;flex-direction:column;align-items:center;gap:30px;text-align:center">
        <span data-fit style="${ANTON};font-size:${s.tamanhoTitulo || 120}px;line-height:.92;text-transform:uppercase">${rt(s.titulo, true)}</span>
        ${lista(s.texto).map(t => `<span style="font-size:32px;line-height:1.5;color:${CLARO_DARK}">${rt(t, true)}</span>`).join('')}
        <div style="display:flex;flex-direction:column;align-items:center;gap:14px;margin-top:20px">
          ${f.inicio ? `<span style="border:1.5px solid ${ACENTO};border-radius:14px;padding:14px 40px;${ANTON};font-size:48px;text-transform:uppercase">${esc(f.inicio)}</span>${seta}` : ''}
          ${f.meio ? `<div style="border:1.5px solid ${ACENTO};border-radius:14px;padding:14px 48px;display:flex;flex-direction:column;gap:4px">${f.meioRotulo ? `<span style="font-size:20px;letter-spacing:.15em;color:${CLARO_DARK};text-transform:uppercase">${esc(f.meioRotulo)}</span>` : ''}<span style="${ANTON};font-size:60px;color:${ACENTO};text-transform:uppercase">${esc(f.meio)}</span></div>` : ''}
          ${lista(f.fim).length ? `${f.meio ? seta : ''}<div style="display:flex;gap:24px">${lista(f.fim).map(x => `<span style="border:1.5px solid rgba(232,185,185,.6);border-radius:14px;min-width:220px;box-sizing:border-box;padding:18px 24px;${ANTON};font-size:64px;text-transform:uppercase">${esc(x)}</span>`).join('')}</div>` : ''}
        </div>
        ${s.nota ? `<span style="margin-top:auto;background:${ACENTO};color:${DARK};border-radius:14px;padding:18px 36px;font-size:28px;font-weight:600;line-height:1.4">${rt(s.nota)}</span>` : ''}
      </div>`;
  } },
  D07: { nome: 'CTA dark', fundo: DARK, escuro: true, html: (s, ctx) => {
    const ICONE = { coracao: '♥', salvar: '▼', seta: '→', check: '✓', estrela: '★' };
    return `
      <div style="position:absolute;inset:0">${imagem(ctx, s.foto, 'imagem de fundo', { escuro: true, pos: s.posicao || 'right center' })}</div>
      <div style="position:absolute;inset:0;background:linear-gradient(90deg,${DARK} 0%,rgba(15,13,13,.85) 45%,rgba(15,13,13,.1) 100%)"></div>
      <div data-caixa style="position:absolute;left:80px;width:600px;top:60px;bottom:60px;display:flex;flex-direction:column;justify-content:center;gap:40px">
        <span data-fit style="${ANTON};font-size:${s.tamanhoTitulo || 136}px;line-height:.92;text-transform:uppercase">${rt(s.titulo, true)}</span>
        ${lista(s.texto).map(t => `<span style="font-size:34px;line-height:1.5;color:${CLARO_DARK}">${rt(t, true)}</span>`).join('')}
        <div style="display:flex;flex-direction:column;gap:18px">
          ${lista(s.itens).map(it => `<div style="display:flex;align-items:stretch;border:1.5px solid rgba(232,185,185,.7);border-radius:16px;overflow:hidden"><span style="flex:none;width:80px;background:${ACENTO};color:${DARK};display:flex;align-items:center;justify-content:center;font-size:34px">${esc(ICONE[it.icone] || it.icone || '♥')}</span><span style="padding:16px 22px;font-size:28px;line-height:1.4">${rt(it.texto, true)}</span></div>`).join('')}
        </div>
        <div style="margin-top:20px">${assinatura(ctx, true)}</div>
      </div>`;
  } },
};

export const modelos = Object.fromEntries(Object.entries(MODELOS).map(([k, m]) => [k, m.nome]));

// post: { id, titulo, slides: [{ modelo, ... }] }
// opts.imagem(nome) -> URL do arquivo ou null. opts.qr[i] -> SVG do QR code do slide i (link).
export function renderCarrossel(post, opts = {}) {
  const total = post.slides.length, avisos = [];
  const slides = post.slides.map((s, i) => {
    const m = MODELOS[s.modelo];
    if (!m) throw new Error(`${post.id}: slide ${i + 1} com modelo desconhecido "${s.modelo}"`);
    const ctx = { post, n: i + 1, avisos, imagem: opts.imagem || (() => null) };
    const corpo = m.html({ ...s, _qr: opts.qr?.[i] }, ctx);
    const escuro = !!m.escuro, rose = m.fundo === BG_ROSE;
    const contador = s.contador === false ? '' : `<span style="position:absolute;top:48px;right:64px;font-size:22px;font-weight:600;letter-spacing:.12em;color:${escuro ? ACENTO : rose ? '#6E4A4D' : ROSE_ESC}">${String(i + 1).padStart(2, '0')}/${String(total).padStart(2, '0')}</span>`;
    const arraste = (s.arraste ?? (m.arraste && i === 0)) ? `<span style="position:absolute;right:64px;bottom:120px;font-size:24px;font-weight:500;letter-spacing:.08em;color:${escuro ? ACENTO : ROSE_ESC}">arraste →</span>` : '';
    const rodape = m.rodape === 'barra' ? RODAPE + BARRA : m.rodape === 'so-barra' ? BARRA : m.rodape === 'rose' ? RODAPE_ROSE : '';
    return `<div id="slide-${i + 1}" data-modelo="${s.modelo}" style="position:relative;width:1080px;height:1350px;flex:none;overflow:hidden;background:${m.fundo};color:${escuro ? '#fff' : TINTA}">${corpo}${rodape}${arraste}${contador}</div>`;
  });
  const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Gilda+Display&family=Poppins:wght@400;500;600;700&family=Anton&display=swap" rel="stylesheet">
<style>html,body{margin:0;padding:0}[data-fit]{min-width:0;max-width:100%}body{font-family:Poppins,sans-serif;-webkit-font-smoothing:antialiased}#painel{display:flex;width:${total * 1080}px;height:1350px}</style>
</head><body><div id="painel">${slides.join('')}</div></body></html>`;
  return { html, total, avisos };
}

// Identidade da linha "Revisão em Dicas" (Concurso com Líbero): a mesma estrutura em todos os concursos
// (Big Shoulders Display + Inter + JetBrains Mono, fundo escuro, papel claro, cartão de dica) e, por concurso,
// um tema: cores, textura e selo próprios. ENAM = marinho e dourado com grade de pontos; TCE MA = bordô e coral
// com azulejo de São Luís, visto de auditoria e etiqueta de pontos por questão; TJRS Cartórios = verde-mate e
// amarelo com guilhoché de papel de segurança (o fundo das certidões) e carimbo vermelho com as duas datas.
// Campos do tema: sobreCor (texto sobre a cor de destaque), brilho e vazado (luz e número vazado das capas),
// corpo/corpo2 (texto corrido), carimbo, painelForte (borda dos números em destaque) e textura.
export const FONTES = 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap';
export const T = "font-family:'Big Shoulders Display','Arial Narrow',Impact,sans-serif;font-weight:900;text-transform:uppercase";
export const I = "font-family:'Inter',system-ui,sans-serif";
export const M = "font-family:'JetBrains Mono',ui-monospace,Menlo,monospace;font-weight:700";
export const PERFIL = '@concursocomlibero';

export const TEMAS = {
  'tce-ma': {
    escuro: '#2A0A14', escuro2: '#3D1220', escuro3: '#561A2B', papel: '#F8F2EC', cartao: '#FFFFFF', tinta: '#1F0A10',
    cor: '#F0553A', corForte: '#C93A22', claro: '#FFD3C4', creme: '#FFF1E8', chip: '#FDE6DC',
    cinza: '#6F5F62', linha: '#EADCD2', ok: '#1F8A5B',
    sobreCor: '#FFFFFF', brilho: 'rgba(240,85,58,.28)', vazado: 'rgba(255,211,196,.3)', corpo: '#3B2C30', corpo2: '#4A3B3F',
    carimbo: '#F0553A', painelForte: '#F3B9A8', textura: 'azulejo', marcaTexto: '#FFD9A0', escuroLembrete: '#3D1220',
  },
  tjrs: {
    escuro: '#141C14', escuro2: '#1E2A1D', escuro3: '#2F4429', papel: '#F5F3EA', cartao: '#FFFFFF', tinta: '#121A11',
    cor: '#F2C230', corForte: '#8A6A00', claro: '#F7E3A0', creme: '#FBF4DA', chip: '#F6EDC6',
    cinza: '#5F6658', linha: '#E2DFCF', ok: '#2F7D3A',
    sobreCor: '#121A11', brilho: 'rgba(242,194,48,.22)', vazado: 'rgba(247,227,160,.28)', corpo: '#2C3328', corpo2: '#424A3D',
    carimbo: '#D2412F', painelForte: '#E9CF72', textura: 'guilhoche', marcaTexto: '#F9E27A', escuroLembrete: '#22321F',
  },
};

export const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Símbolo da plataforma (L com visto). Fica sempre no verde da marca.
export const simbolo = (px = 34, id = 'g') => `<svg width="${px}" height="${px}" viewBox="0 0 100 100" style="display:block;flex:none"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#00B85A"/><stop offset=".55" stop-color="#009A8C"/><stop offset="1" stop-color="#14E6DA"/></linearGradient></defs><rect x="2" y="2" width="96" height="96" rx="28" fill="url(#${id})"/><path d="M32 22V70H70" fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/><path d="M46 46l9 9l18-20" fill="none" stroke="#B9FFF1" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
export const marca = (px = 34, cor = '#fff', sub = '#FFD3C4', id = 'g') => `<div style="display:flex;align-items:center;gap:${px * .28}px">${simbolo(px, id)}<div style="line-height:1"><div style="${M};font-size:${px * .27}px;letter-spacing:.2em;text-transform:uppercase;color:${sub}">Concurso com</div><div style="${I};font-weight:800;font-size:${px * .62}px;letter-spacing:-.03em;color:${cor};margin-top:${px * .06}px">Líbero</div></div></div>`;

// Azulejo (textura do tema TCE MA): flor de quatro pétalas em arcos + losango, repetida.
export const azulejo = (cor, op = .12, lado = 72) => {
  const s = lado, h = s / 2;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${s}' height='${s}' viewBox='0 0 ${s} ${s}' fill='none' stroke='${cor}' stroke-opacity='${op}' stroke-width='1.4'><path d='M${h} 0A${h} ${h} 0 0 1 ${s} ${h}A${h} ${h} 0 0 1 ${h} ${s}A${h} ${h} 0 0 1 0 ${h}A${h} ${h} 0 0 1 ${h} 0Z'/><path d='M0 0A${h} ${h} 0 0 0 ${h} ${h}A${h} ${h} 0 0 0 ${s} 0M0 ${s}A${h} ${h} 0 0 1 ${h} ${h}A${h} ${h} 0 0 1 ${s} ${s}'/><path d='M${h} ${h - 9}L${h + 9} ${h}L${h} ${h + 9}L${h - 9} ${h}Z'/><circle cx='0' cy='0' r='5'/><circle cx='${s}' cy='0' r='5'/><circle cx='0' cy='${s}' r='5'/><circle cx='${s}' cy='${s}' r='5'/></svg>`;
  return `url(data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, '%27')})`;
};

// Guilhoché (textura do tema TJRS): ondas entrelaçadas como no fundo de segurança das certidões e dos selos.
export const guilhoche = (cor, op = .12, lado = 72) => {
  const w = lado * 2, h = lado, ondas = [];
  for (let k = 0; k < 8; k++) {
    const fase = k * Math.PI / 4, amp = h * .5, y0 = h / 2;
    let d = '';
    for (let x = 0; x <= w; x += w / 48) d += (x ? 'L' : 'M') + x.toFixed(1) + ' ' + (y0 + amp * Math.sin(2 * Math.PI * x / w * 2 + fase)).toFixed(1);
    ondas.push(`<path d='${d}'/>`);
  }
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}' fill='none' stroke='${cor}' stroke-opacity='${op}' stroke-width='1.1'>${ondas.join('')}</svg>`;
  return `url(data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, '%27')})`;
};
// Textura do tema: tex(c, cor, opacidade, lado).
export const tex = (c, cor, op, lado) => (c.textura === 'guilhoche' ? guilhoche : azulejo)(cor, op, lado);

// Visto de auditoria (o "tique" de conferência dos papéis de trabalho).
export const visto = (px, cor, tr = 3) => `<svg width="${px}" height="${px}" viewBox="0 0 24 24" style="display:block;flex:none"><path d="M4 13l5 5L20 6" fill="none" stroke="${cor}" stroke-width="${tr}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

// Carimbo redondo (duas linhas no anel + texto central).
export const carimbo = ({ px = 150, cor, topo, base, centro, sub, giro = -12, id = 'c' }) => `<svg width="${px}" height="${px}" viewBox="0 0 200 200" style="display:block;transform:rotate(${giro}deg)"><defs><path id="${id}a" d="M100 100m-74 0a74 74 0 1 1 148 0"/><path id="${id}b" d="M100 100m-82 0a82 82 0 0 0 164 0"/></defs><circle cx="100" cy="100" r="95" fill="none" stroke="${cor}" stroke-width="5"/><circle cx="100" cy="100" r="60" fill="none" stroke="${cor}" stroke-width="2.5"/><text font-family="JetBrains Mono,monospace" font-weight="700" font-size="17" letter-spacing="3" fill="${cor}"><textPath href="#${id}a" startOffset="50%" text-anchor="middle">${esc(topo)}</textPath></text><text font-family="JetBrains Mono,monospace" font-weight="700" font-size="17" letter-spacing="3" fill="${cor}"><textPath href="#${id}b" startOffset="50%" text-anchor="middle">${esc(base)}</textPath></text><text x="100" y="${sub ? 108 : 116}" text-anchor="middle" font-family="Big Shoulders Display,sans-serif" font-weight="900" font-size="${sub ? 50 : 46}" fill="${cor}">${esc(centro)}</text>${sub ? `<text x="100" y="130" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="13" letter-spacing="2" fill="${cor}">${esc(sub)}</text>` : ''}</svg>`;

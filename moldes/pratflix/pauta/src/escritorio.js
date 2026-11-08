// Pauta · Coleção Escritórios: 30 variações inspiradas em identidades de escritórios de advocacia publicadas no Behance.
// Cada variação tem composição de capa própria (lay), tratamento dos slides internos (mt), paleta e par de fontes.
// Slides 540×675 (feed) e 540×960 (stories). *palavra* = destaque; _trecho_ = negrito.
window.ESCRITORIO = (() => {
// c: bg (fundo dos slides internos), sf (cartões), ink, mu, ac (destaque), ac2, on (texto sobre o destaque), cbg (fundo da capa), cink (texto da capa)
const V = (id, nome, desc, ideal, lay, mt, c, f, hl, foto, ex) => ({ id, nome, desc, ideal, lay, mt, c, f, hl, foto, ex });
const F = (t, b, tw = 800, tt = 'none', tl = '-.03em', lh = 1, k = 1, it = false) => ({ t, b, tw, tt, tl, lh, k, it });
const IDT = [
  V('indigo', 'Índigo Institucional', 'Índigo profundo, foto recortada à direita e botões arredondados.', ['trabalho', 'civel', 'consumidor'], 'indigo', 'cards',
    { bg:'#F2F1FB', sf:'#FFFFFF', ink:'#17124A', mu:'#5E5A86', ac:'#5B4BFF', ac2:'#9C8CFF', on:'#FFFFFF', cbg:'#1B1464', cink:'#FFFFFF' }, F("'Plus Jakarta Sans', Arial, sans-serif", "'Plus Jakarta Sans', Arial, sans-serif"), 'cor', 'f1',
    { tag:'Direito do Trabalho', titulo:'Seus direitos *começam aqui*', sub:'Informação clara para você não sair no prejuízo.' }),
  V('drx', 'Digital Noturno', 'Azul-noite, pergunta centralizada e notificação de celular.', ['digital', 'empresarial', 'consumidor'], 'drx', 'linha',
    { bg:'#0C1222', sf:'#141C33', ink:'#EEF2FF', mu:'#93A0C2', ac:'#5C8BFF', ac2:'#B7C8FF', on:'#FFFFFF', cbg:'#070B16', cink:'#EEF2FF' }, F("'Inter Tight', Arial, sans-serif", "'Inter Tight', Arial, sans-serif", 500, 'none', '-.045em', 1.02), 'cor', 'f2',
    { tag:'Direito Digital', titulo:'Hackearam seu perfil. *E agora?*', sub:'O passo a passo para recuperar e se proteger.' }),
  V('nome', 'Assinatura Verde', 'Foto inteira, verde-escuro e o nome em serifa com itálico.', ['imobiliario', 'extrajudicial', 'sucessoes'], 'nome', 'serif',
    { bg:'#F3EFE6', sf:'#FFFFFF', ink:'#14261F', mu:'#5B6A62', ac:'#C9A36A', ac2:'#1E3A30', on:'#14261F', cbg:'#14261F', cink:'#F3EFE6' }, F("'Playfair Display', Georgia, serif", "'Manrope', Arial, sans-serif", 600, 'none', '-.02em', .98, 1.05), 'italico', 'f1',
    { tag:'Imobiliário · Notarial', titulo:'Comprar imóvel *sem susto*', sub:'O que conferir antes de assinar.' }),
  V('terra', 'Terracota Celular', 'Cartões empilhados em terracota e a capa dentro de uma tela.', ['empresarial', 'consumidor', 'carreira'], 'terra', 'cards',
    { bg:'#F5E9DE', sf:'#FFF8F2', ink:'#3A1E12', mu:'#86604C', ac:'#C4532A', ac2:'#E9A27A', on:'#FFFFFF', cbg:'#B9481F', cink:'#FFF4EA' }, F("'DM Serif Display', Georgia, serif", "'DM Sans', Arial, sans-serif", 400, 'none', '-.02em', .98, 1.05), 'italico', 'f3',
    { tag:'Empresarial', titulo:'Esses erros *custam caros*', sub:'3 falhas que quebram pequenas empresas.' }),
  V('widget', 'Azul Interface', 'Azul-claro com widgets: cronômetro, balão e ícones.', ['previdenciario', 'trabalho', 'bancario'], 'widget', 'bolha',
    { bg:'#EAF1FB', sf:'#FFFFFF', ink:'#13284A', mu:'#5C7193', ac:'#2F6FE4', ac2:'#8DB4F5', on:'#FFFFFF', cbg:'#DCE8F8', cink:'#13284A' }, F("'Manrope', Arial, sans-serif", "'Manrope', Arial, sans-serif", 800, 'none', '-.035em'), 'cor', 'f2',
    { tag:'Previdenciário', titulo:'Seu benefício *está demorando?*', sub:'Veja o que o INSS tem de prazo para responder.' }),
  V('malhete', 'Malhete Laranja', 'Creme quadriculado, azul-marinho, laranja e um malhete.', ['trabalho', 'criminal', 'civel'], 'malhete', 'num',
    { bg:'#F6F1E8', sf:'#FFFFFF', ink:'#14213D', mu:'#5E6576', ac:'#EF7A2A', ac2:'#14213D', on:'#FFFFFF', cbg:'#F6F1E8', cink:'#14213D' }, F("'Sora', Arial, sans-serif", "'Sora', Arial, sans-serif", 700, 'none', '-.04em'), 'cor', 'f1',
    { tag:'Trabalhista', titulo:'Demissão injusta *não é o fim*', sub:'O que você ainda pode reivindicar.' }),
  V('gigante', 'Palavra Gigante', 'A palavra da área enorme e vazada atrás da foto.', ['publico', 'empresarial', 'tributario'], 'gigante', 'num',
    { bg:'#F2ECE2', sf:'#FFFFFF', ink:'#2A1D12', mu:'#7A6650', ac:'#B08A57', ac2:'#2A1D12', on:'#FFFFFF', cbg:'#3A2A1C', cink:'#F2ECE2' }, F("'Bebas Neue', Impact, sans-serif", "'Manrope', Arial, sans-serif", 400, 'uppercase', '0', .92, 1.1), 'cor', 'f2',
    { tag:'Advocacia', palavra:'ADVOCACIA', titulo:'3 *direitos* que você não sabia que tinha', sub:'Eleitoral · Administrativo · Licitações' }),
  V('impacto', 'Impacto Preto', 'Caixa-alta preta e pesada com a foto quente ao lado.', ['familia', 'consumidor', 'carreira'], 'impacto', 'cards',
    { bg:'#F4F0EB', sf:'#FFFFFF', ink:'#111111', mu:'#555555', ac:'#111111', ac2:'#E7B98C', on:'#FFFFFF', cbg:'#2B201A', cink:'#FFFFFF' }, F("'Archivo Black', Impact, sans-serif", "'Archivo', Arial, sans-serif", 400, 'uppercase', '-.02em', .92, .95), 'caixa', 'f3',
    { tag:'Família', titulo:'Pensão *atrasada?*', sub:'Os caminhos para cobrar o que é do seu filho.' }),
  V('noir', 'Noir Clássico', 'Preto e branco, serifa em caixa-alta e filetes finos.', ['criminal', 'sucessoes', 'familia'], 'noir', 'serif',
    { bg:'#111111', sf:'#1C1C1C', ink:'#F1F1F1', mu:'#A1A1A1', ac:'#FFFFFF', ac2:'#777777', on:'#111111', cbg:'#0A0A0A', cink:'#F1F1F1' }, F("'Libre Caslon Text', Georgia, serif", "'Inter', Arial, sans-serif", 400, 'uppercase', '.02em', 1.05, .9), 'italico', 'f1',
    { tag:'Planejamento', titulo:'O fantasma da *herança* confusa', sub:'Organize hoje para a sua família não brigar amanhã.' }),
  V('coluna', 'Coluna Bordô', 'Bordô, coluna clássica e foto em arco com o nome manuscrito.', ['familia', 'sucessoes', 'carreira'], 'coluna', 'serif',
    { bg:'#F4ECE8', sf:'#FFFFFF', ink:'#3B1220', mu:'#7C5A64', ac:'#8F2D45', ac2:'#E3C1A5', on:'#FFFFFF', cbg:'#4A1526', cink:'#F6E9E2' }, F("'Cormorant Garamond', Georgia, serif", "'Manrope', Arial, sans-serif", 600, 'none', '-.01em', .95, 1.15), 'italico', 'f2',
    { tag:'Advogada', titulo:'O amor não protege *patrimônio*', sub:'Por que o regime de bens importa.' }),
  V('ampulheta', 'Oliva Editorial', 'Bege e oliva, foto arredondada e texto em duas colunas.', ['previdenciario', 'familia', 'saude'], 'ampulheta', 'linha',
    { bg:'#EFEBE1', sf:'#F8F5EE', ink:'#2F3322', mu:'#6E7160', ac:'#6B7442', ac2:'#C9B98F', on:'#FFFFFF', cbg:'#EFEBE1', cink:'#2F3322' }, F("'Lora', Georgia, serif", "'Inter', Arial, sans-serif", 500, 'none', '-.02em', 1, 1.02), 'italico', 'f3',
    { tag:'Previdenciário', titulo:'Quando o INSS *nega*, o prazo começa', sub:'Você tem 30 dias para recorrer na via administrativa.' }),
  V('azulao', 'Azul Manchete', 'Azul forte, palavra gigante cortada e itálico por cima.', ['empresarial', 'tributario', 'digital'], 'azulao', 'num',
    { bg:'#EDF2FF', sf:'#FFFFFF', ink:'#0A1B4D', mu:'#53618A', ac:'#1D4ED8', ac2:'#93B0FF', on:'#FFFFFF', cbg:'#1D4ED8', cink:'#FFFFFF' }, F("'Anton', Impact, sans-serif", "'Manrope', Arial, sans-serif", 400, 'uppercase', '0', .92, 1), 'italico', 'f1',
    { tag:'Advogado', palavra:'DIREITO', titulo:'Acidente *aéreo*: quem responde?', sub:'O que a companhia deve pagar.' }),
  V('menta', 'Menta Suave', 'Verde-menta, recortes redondos e serifa leve.', ['saude', 'familia', 'consumidor'], 'menta', 'bolha',
    { bg:'#EDF5F0', sf:'#FFFFFF', ink:'#1D3B2E', mu:'#5E7A6C', ac:'#2F8F68', ac2:'#BFE3CF', on:'#FFFFFF', cbg:'#D7EBDF', cink:'#1D3B2E' }, F("'Fraunces', Georgia, serif", "'Outfit', Arial, sans-serif", 400, 'none', '-.03em', 1, 1.05), 'italico', 'f2',
    { tag:'Direito da Saúde', titulo:'Plano negou? *Troque o medo* por informação', sub:'O que pedir por escrito ao plano.' }),
  V('mosaico', 'Mosaico Marinho', 'Grade de quadros com fotos e palavras-chave grandes.', ['tributario', 'empresarial', 'bancario'], 'mosaico', 'linha',
    { bg:'#EEF1F6', sf:'#FFFFFF', ink:'#101B33', mu:'#5A6680', ac:'#C59D5F', ac2:'#22345E', on:'#101B33', cbg:'#101B33', cink:'#F1F4F9' }, F("'Oswald', Impact, sans-serif", "'Inter', Arial, sans-serif", 600, 'uppercase', '0', .95, 1), 'cor', 'f3',
    { tag:'Societário', palavra:'INADIMPLEMENTO', titulo:'Seu sócio deixou de pagar. *E agora?*', sub:'As saídas previstas no contrato social.' }),
  V('ouro', 'Marinho & Ouro', 'Marinho, moldura dourada fina, monograma e balança.', ['sucessoes', 'civel', 'imobiliario'], 'ouro', 'serif',
    { bg:'#F5F2EA', sf:'#FFFFFF', ink:'#0E1B33', mu:'#5B6475', ac:'#B8913A', ac2:'#0E1B33', on:'#FFFFFF', cbg:'#0E1B33', cink:'#F5F2EA' }, F("'Prata', Georgia, serif", "'Lato', Arial, sans-serif", 400, 'none', '0', 1.08, .95), 'italico', 'f1',
    { tag:'Sucessões', titulo:'Testamento não é só *para rico*', sub:'Quem deveria pensar nisso hoje.' }),
  V('jornal', 'Primeira Página', 'Capa de jornal: cabeçalho, foto em retícula e colunas.', ['publico', 'criminal', 'tributario'], 'jornal', 'linha',
    { bg:'#F1EDE3', sf:'#FBF8F1', ink:'#121212', mu:'#555555', ac:'#B3261E', ac2:'#121212', on:'#FFFFFF', cbg:'#F1EDE3', cink:'#121212' }, F("'Libre Baskerville', Georgia, serif", "'Inter', Arial, sans-serif", 700, 'none', '-.02em', 1.02, .95), 'sublinhado', 'f2',
    { tag:'Edição de hoje', titulo:'Nova lei muda *o seu IPTU*', sub:'Entenda em 5 pontos o que vale a partir de janeiro.' }),
  V('numero', 'Número Corporativo', 'Branco, número azul enorme e lista com ícones de linha.', ['trabalho', 'previdenciario', 'empresarial'], 'numero', 'num',
    { bg:'#FFFFFF', sf:'#F2F5FA', ink:'#0B1B33', mu:'#5B6880', ac:'#1F5EFF', ac2:'#C9D7FF', on:'#FFFFFF', cbg:'#FFFFFF', cink:'#0B1B33' }, F("'Space Grotesk', Arial, sans-serif", "'Space Grotesk', Arial, sans-serif", 700, 'none', '-.04em', .98), 'cor', 'f3',
    { tag:'Checklist', num:'03', titulo:'Documentos para *não perder* a rescisão', sub:'Separe antes de assinar qualquer coisa.' }),
  V('split', 'Meio a Meio', 'Tela dividida: foto de um lado, bloco de cor do outro.', ['familia', 'imobiliario', 'consumidor'], 'split', 'cards',
    { bg:'#F7F3EF', sf:'#FFFFFF', ink:'#22202A', mu:'#6B6772', ac:'#D25E7A', ac2:'#2C2A3A', on:'#FFFFFF', cbg:'#2C2A3A', cink:'#FFFFFF' }, F("'Poppins', Arial, sans-serif", "'Poppins', Arial, sans-serif", 700, 'none', '-.03em', 1.02, .95), 'cor', 'f1',
    { tag:'Família', titulo:'Guarda compartilhada *não é* metade do tempo', sub:'Entenda o que a lei diz de verdade.' }),
  V('diagonal', 'Faixa Diagonal', 'Foto com uma faixa de cor em diagonal atravessando.', ['trabalho', 'criminal', 'publico'], 'diagonal', 'num',
    { bg:'#FFF7EC', sf:'#FFFFFF', ink:'#1A1A1A', mu:'#666666', ac:'#FFB000', ac2:'#1A1A1A', on:'#1A1A1A', cbg:'#1A1A1A', cink:'#FFFFFF' }, F("'Montserrat', Arial, sans-serif", "'Montserrat', Arial, sans-serif", 900, 'uppercase', '-.03em', .95, .9), 'caixa', 'f2',
    { tag:'Alerta', titulo:'Horas extras *não pagas*', sub:'Como provar e até quando cobrar.' }),
  V('cartao', 'Cartão de Visita', 'Um cartão elegante sobre fundo texturizado, com o título nele.', ['empresarial', 'extrajudicial', 'carreira'], 'cartao', 'serif',
    { bg:'#EFEDEA', sf:'#FFFFFF', ink:'#1E1E1E', mu:'#6B6B6B', ac:'#9C7A4B', ac2:'#1E1E1E', on:'#FFFFFF', cbg:'#2A2826', cink:'#1E1E1E' }, F("'Italiana', Georgia, serif", "'Manrope', Arial, sans-serif", 400, 'uppercase', '.04em', 1.05, 1.05), 'italico', 'f3',
    { tag:'Apresentação', titulo:'Prazer, eu cuido *do seu negócio*', sub:'Contratos, sociedade e prevenção de riscos.' }),
  V('documento', 'Contrato Marcado', 'Folha de contrato com marca-texto e carimbo de atenção.', ['civel', 'imobiliario', 'empresarial'], 'documento', 'linha',
    { bg:'#F4F1EA', sf:'#FFFFFF', ink:'#202020', mu:'#666666', ac:'#FFE55C', ac2:'#C8352E', on:'#202020', cbg:'#D9D3C7', cink:'#202020' }, F("'IBM Plex Serif', Georgia, serif", "'IBM Plex Sans', Arial, sans-serif", 600, 'none', '-.02em', 1.05, .95), 'marcatexto', 'f1',
    { tag:'Contratos', titulo:'A cláusula que *ninguém lê* (e devia)', sub:'Multa por rescisão: o que é abusivo.' }),
  V('tempo', 'Linha do Tempo', 'Título no alto e uma linha do tempo com marcos na base.', ['previdenciario', 'trabalho', 'sucessoes'], 'tempo', 'num',
    { bg:'#F2F4F3', sf:'#FFFFFF', ink:'#14302B', mu:'#5B6F6A', ac:'#0F8B73', ac2:'#BFE4DA', on:'#FFFFFF', cbg:'#14302B', cink:'#F2F4F3' }, F("'Outfit', Arial, sans-serif", "'Outfit', Arial, sans-serif", 700, 'none', '-.035em'), 'cor', 'f2',
    { tag:'Aposentadoria', titulo:'Do primeiro emprego *à aposentadoria*', sub:'Os marcos que mudam o seu benefício.' }),
  V('aspas', 'Aspas Gigantes', 'Aspas enormes, frase da lei e assinatura discreta.', ['familia', 'publico', 'carreira'], 'aspas', 'serif',
    { bg:'#F6F0F2', sf:'#FFFFFF', ink:'#2E1A24', mu:'#7A6470', ac:'#B5476B', ac2:'#F1C9D6', on:'#FFFFFF', cbg:'#F6F0F2', cink:'#2E1A24' }, F("'Gloock', Georgia, serif", "'Inter', Arial, sans-serif", 400, 'none', '-.02em', 1.05, .95), 'cor', 'f3',
    { tag:'Constituição, art. 5º', titulo:'Todos são iguais perante a lei, *sem distinção de qualquer natureza*.', sub:'O que isso significa no seu dia a dia.' }),
  V('suico', 'Grade Suíça', 'Grade rígida, índice numerado, filetes e vermelho.', ['tributario', 'empresarial', 'publico'], 'suico', 'linha',
    { bg:'#F4F4F2', sf:'#FFFFFF', ink:'#111111', mu:'#666666', ac:'#E3262E', ac2:'#111111', on:'#FFFFFF', cbg:'#F4F4F2', cink:'#111111' }, F("'Inter Tight', Arial, sans-serif", "'Inter Tight', Arial, sans-serif", 700, 'none', '-.05em', .95), 'cor', 'f1',
    { tag:'Tributário', titulo:'Reforma tributária: *o que muda* em 2027', sub:'Índice: IBS, CBS, transição e o seu bolso.' }),
  V('vidro', 'Vidro Fosco', 'Manchas de cor desfocadas e um cartão de vidro fosco.', ['digital', 'saude', 'consumidor'], 'vidro', 'bolha',
    { bg:'#F1EEFB', sf:'#FFFFFF', ink:'#1D1735', mu:'#6D6688', ac:'#7C5CFF', ac2:'#FF8FB8', on:'#FFFFFF', cbg:'#1D1735', cink:'#FFFFFF' }, F("'Unbounded', Arial, sans-serif", "'Outfit', Arial, sans-serif", 600, 'none', '-.04em', 1.02, .88), 'cor', 'f2',
    { tag:'LGPD', titulo:'Seus dados *valem dinheiro*', sub:'O que as empresas não podem fazer com eles.' }),
  V('rubro', 'Rubro Criminal', 'Preto, um traço de luz vermelha e caixa-alta condensada.', ['criminal', 'publico', 'digital'], 'rubro', 'num',
    { bg:'#121212', sf:'#1E1E1E', ink:'#F2F2F2', mu:'#A0A0A0', ac:'#E2232A', ac2:'#5A0F12', on:'#FFFFFF', cbg:'#0B0B0B', cink:'#F2F2F2' }, F("'Big Shoulders Display', Impact, sans-serif", "'Inter', Arial, sans-serif", 900, 'uppercase', '0', .92, 1.1), 'cor', 'f3',
    { tag:'Criminal', titulo:'Fui intimado. *O que fazer?*', sub:'Seus direitos antes de dizer qualquer coisa.' }),
  V('urna', 'Listras Eleitorais', 'Listras verticais, caixa-alta forte e selo de votação.', ['publico', 'carreira', 'empresarial'], 'urna', 'cards',
    { bg:'#F3F6F2', sf:'#FFFFFF', ink:'#0F2A1E', mu:'#5A6F63', ac:'#159A55', ac2:'#F4C21B', on:'#FFFFFF', cbg:'#0F2A1E', cink:'#FFFFFF' }, F("'Syne', Arial, sans-serif", "'Inter', Arial, sans-serif", 800, 'uppercase', '-.02em', .95, .95), 'cor', 'f1',
    { tag:'Eleitoral', titulo:'Pré-campanha: *o que pode* postar', sub:'Os limites da propaganda antecipada.' }),
  V('ilustra', 'Pastel Ilustrado', 'Formas ilustradas em tons pastel, balança e sol.', ['familia', 'consumidor', 'saude'], 'ilustra', 'bolha',
    { bg:'#FFF6EC', sf:'#FFFFFF', ink:'#2B2A4C', mu:'#6B6A8C', ac:'#FF8A65', ac2:'#8EC5FF', on:'#FFFFFF', cbg:'#FFE8D6', cink:'#2B2A4C' }, F("'Figtree', Arial, sans-serif", "'Figtree', Arial, sans-serif", 900, 'none', '-.04em', .98), 'pilula', 'f2',
    { tag:'Seus direitos', titulo:'Comprou e *se arrependeu?*', sub:'Você tem 7 dias nas compras pela internet.' }),
  V('cinema', 'Tela de Cinema', 'Faixas pretas de cinema e o título como legenda amarela.', ['criminal', 'familia', 'civel'], 'cinema', 'num',
    { bg:'#151515', sf:'#202020', ink:'#F4F4F4', mu:'#A3A3A3', ac:'#FFD23F', ac2:'#3A3A3A', on:'#151515', cbg:'#000000', cink:'#FFFFFF' }, F("'Bebas Neue', Impact, sans-serif", "'Inter', Arial, sans-serif", 400, 'uppercase', '.01em', .95, 1.05), 'cor', 'f3',
    { tag:'Cena real', titulo:'“Assina aqui, depois a gente vê.” *Não assine.*', sub:'O que todo contrato verbal esconde.' }),
  V('fino', 'Linha Fina', 'Off-white, serifa finíssima enorme e um selo redondo com foto.', ['sucessoes', 'extrajudicial', 'imobiliario'], 'fino', 'serif',
    { bg:'#F8F6F2', sf:'#FFFFFF', ink:'#1F1D1A', mu:'#77726B', ac:'#1F1D1A', ac2:'#D8CFC2', on:'#FFFFFF', cbg:'#F8F6F2', cink:'#1F1D1A' }, F("'Bodoni Moda', Didot, serif", "'Manrope', Arial, sans-serif", 400, 'none', '-.03em', .95, 1.1), 'italico', 'f1',
    { tag:'Escritura', titulo:'Escritura *não é* registro', sub:'A diferença que pode custar o seu imóvel.' })
];

const PACKS = {
  o1:{ area:'', tag:'', titulo:'', sub:'', itens:[{ t:'O que diz a lei', d:'A regra geral, explicada em linguagem simples, com o artigo.' }, { t:'Na prática', d:'Um exemplo fictício de como isso acontece no dia a dia.' }, { t:'O que fazer agora', d:'Guarde provas, peça tudo por escrito e confira os prazos.' }], fim:{ titulo:'Salve para consultar quando precisar.', sub:'E mande para quem precisa saber disso.' } },
  o2:{ area:'', tag:'', titulo:'', sub:'', lista:['Documento com foto e CPF', 'Comprovante de residência', 'Contratos e recibos', 'Prints e mensagens', 'Protocolos de atendimento'], num:'5', un:'anos', dado:'é o prazo para pedir reparação por defeito de produto ou serviço (art. 27 do CDC).', fim:{ titulo:'Qual item você não tinha?', sub:'Comente aqui embaixo.' } },
  o3:{ area:'', tag:'', titulo:'', sub:'' },
  o4:{ area:'', tag:'Stories', titulo:'', sub:'Toque para continuar →' },
  o5:{ area:'', tag:'Enquete', titulo:'Você já passou por isso?', a:'Sim', b:'Ainda não', sub:'Responda: amanhã eu explico.' }
};
const TPL = [
  { id:'o1', grupo:'carrossel', nome:'Carrossel do escritório', desc:'Capa da variação, 3 telas de conteúdo e chamada final.' },
  { id:'o2', grupo:'carrossel', nome:'Lista e dado', desc:'Capa, lista para salvar, número em destaque e chamada.' },
  { id:'o3', grupo:'unica', nome:'Tela única', desc:'A capa da variação como post único.' },
  { id:'o4', grupo:'stories', nome:'Capa de stories', desc:'A composição da variação em 9:16.' },
  { id:'o5', grupo:'stories', nome:'Enquete nos stories', desc:'Pergunta com figurinha de enquete.' }
];

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const marca = s => esc(s).replace(/\*(.+?)\*/g, '<span class="hl">$1</span>').replace(/_(.+?)_/g, '<b>$1</b>').replace(/\n/g, '<br>');
const P_ = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
const IC = { balanca:P_('M12 3v18 M5 21h14 M4 8h16 M6 8l-3 6a3 3 0 0 0 6 0z M18 8l-3 6a3 3 0 0 0 6 0z'), seta:P_('M5 12h14 M13 6l6 6-6 6'), check:P_('M5 12l4 4L19 6'), relogio:P_('M12 7v5l3 2 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0'), chat:P_('M3 5h18v12H8l-5 4z'), doc:P_('M5 2h9l5 5v15H5z M14 2v6h5 M8 13h8 M8 17h6'), escudo:P_('M12 2L3 6v6c0 5 9 10 9 10s9-5 9-10V6z'), casa:P_('M3 10l9-7 9 7v10H3z M9 21v-7h6v7'), sino:P_('M6 16V11a6 6 0 1 1 12 0v5l2 2H4z M10 21h4'), pessoa:P_('M20 21a8 8 0 1 0-16 0 M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'), voto:P_('M4 12h16v8H4z M8 12V4h8v8 M10 8l2 2 3-4') };
const MALHETE = '<svg viewBox="0 0 120 90"><rect x="24" y="14" width="56" height="22" rx="5" transform="rotate(-30 52 25)" fill="#7A4A2A"/><rect x="18" y="20" width="10" height="30" rx="3" transform="rotate(-30 23 35)" fill="#5B3520"/><rect x="76" y="-2" width="10" height="30" rx="3" transform="rotate(-30 81 13)" fill="#5B3520"/><rect x="50" y="34" width="8" height="44" rx="4" transform="rotate(-30 54 56)" fill="#8C5A35"/><rect x="62" y="70" width="52" height="12" rx="4" fill="#5B3520"/></svg>';
const COLUNA = '<svg viewBox="0 0 80 300" preserveAspectRatio="xMidYMax meet"><rect x="4" y="0" width="72" height="16" rx="3" fill="currentColor"/><path d="M10 16 Q40 30 70 16 V26 H10z" fill="currentColor" opacity=".8"/>' + Array.from({ length:6 }, (_, i) => `<rect x="${14 + i * 9.5}" y="28" width="6" height="246" rx="3" fill="currentColor" opacity="${.55 + (i % 2) * .25}"/>`).join('') + '<rect x="8" y="274" width="64" height="12" rx="2" fill="currentColor"/><rect x="2" y="286" width="76" height="14" rx="2" fill="currentColor"/></svg>';
function sil(edit) { return `<span class="of-ph"><svg viewBox="0 0 100 120" preserveAspectRatio="xMidYMax meet"><circle cx="50" cy="44" r="17"/><path d="M12 124c0-30 16-50 38-50s38 20 38 50z"/></svg>${edit ? '<i>Toque para pôr a sua foto</i>' : ''}</span>` }
function vars(idt) { const c = idt.c, f = idt.f;
  return `--bg:${c.bg};--sf:${c.sf};--ink:${c.ink};--mu:${c.mu};--ac:${c.ac};--ac2:${c.ac2};--on:${c.on};--cbg:${c.cbg};--cink:${c.cink};--ft:${f.t};--fb:${f.b};--tw:${f.tw};--tt:${f.tt};--tl:${f.tl};--lh:${f.lh};--k:${f.k};--fi:${f.it ? 'italic' : 'normal'}` }

function slides(tid, ctx) {
  const { idt, edit, handle = '@seuperfil', nome = '', fotos = {} } = ctx, d = { ...ctx.d }, ex = idt.ex, out = [];
  ['tag', 'titulo', 'sub'].forEach(k => { if (!d[k]) d[k] = ex[k] }); if (!d.area) d.area = ex.tag;
  const E = (k, v, cls = '', tag = 'div') => `<${tag} class="${cls}"${edit ? ` contenteditable="true" spellcheck="false" data-k="${k}"` : ''}>${marca(v)}</${tag}>`;
  const foto = (cls, slot = idt.foto) => `<div class="of-foto ${cls}" data-foto="${slot}">${fotos[slot] ? `<img src="${fotos[slot]}" alt="">` : sil(edit)}</div>`;
  const topo = () => `<div class="of-top"><span>${esc(nome)}</span><span>${esc(handle)}</span></div>`;
  const tag = () => E('tag', d.tag, 'of-tag', 'span'), T = (cls = '') => E('titulo', d.titulo, 'mx-t of-t ' + cls), S = (cls = '') => E('sub', d.sub, 'of-sub ' + cls);
  const pal = esc((ex.palavra || d.area || '').toUpperCase());
  const base = (tipo, corpo) => `<div class="mx of L-${idt.lay} mt-${idt.mt} hl-${idt.hl} ${tipo}" style="${vars(idt)}">${corpo}</div>`;
  const arrasta = '<span class="of-arr">Arrasta →</span>';
  const L = {
    indigo:() => `${topo()}<div class="of-mark">${IC.balanca}</div>${foto('fx')}<div class="of-esq">${tag()}${T()}${S()}<div class="of-btns"><span>${IC.seta}Saiba mais</span><span>${IC.chat}</span></div></div>${arrasta}`,
    drx:() => `${topo()}<div class="of-glow"></div><div class="of-centro">${tag()}${T()}</div><div class="of-phone"><div class="of-noti"><i>${IC.sino}</i><div><b>${esc(d.area)}</b><small>${esc(d.sub)}</small></div><span>agora</span></div><div class="of-hora">21:10</div></div><div class="of-marca">${esc(nome || handle)}</div>`,
    nome:() => `${foto('fx')}<div class="of-veu"></div>${topo()}<div class="of-base">${tag()}${T()}${S()}</div>`,
    terra:() => `<div class="of-pilha">${'<i></i>'.repeat(4)}</div><div class="of-cel"><div class="of-cel-top"><span>${esc(handle)}</span><span>···</span></div>${T()}${foto('fx')}${S()}</div>`,
    widget:() => `${topo()}${T()}<div class="of-w w1"><i>${IC.relogio}</i><b>02:47:13</b></div><div class="of-w w2"><i>${IC.chat}</i><span>${esc(d.sub)}</span></div><div class="of-w w3">${[IC.doc, IC.escudo, IC.casa].map(x => `<i>${x}</i>`).join('')}</div>${foto('fx')}${tag()}`,
    malhete:() => `${topo()}${tag()}${T()}<div class="of-malhete">${MALHETE}</div>${S()}<div class="of-pe"><span>${esc(handle)}</span><b>${IC.seta}</b></div>`,
    gigante:() => `<div class="of-pal">${pal}</div>${foto('fx')}<div class="of-veu"></div><div class="of-base">${tag()}${T()}${S()}</div>${topo()}`,
    impacto:() => `${foto('fx')}<div class="of-esq">${T()}${S()}</div><div class="of-assin">${esc(nome || handle)}</div>${topo()}`,
    noir:() => `${foto('fx')}<div class="of-veu"></div>${topo()}<div class="of-centro"><i class="of-fio"></i>${tag()}${T()}<i class="of-fio"></i>${S()}</div>`,
    coluna:() => `${topo()}<div class="of-col">${COLUNA}</div>${foto('fx')}<div class="of-base">${tag()}${T()}<div class="of-script">${esc(nome || 'Advogada')}</div></div>`,
    ampulheta:() => `${topo()}${foto('fx')}${tag()}${T()}<div class="of-2col">${S()}<p>${esc(d.area)} · ${esc(handle)}</p></div>`,
    azulao:() => `<div class="of-pal">${pal}</div>${foto('fx')}${topo()}<div class="of-base">${tag()}${T()}${S()}</div>`,
    menta:() => `${topo()}<div class="of-circ c1">${foto('fx')}</div><div class="of-circ c2"></div>${tag()}${T()}${S()}<div class="of-badges"><span>${IC.check}Gratuito</span><span>${IC.doc}Salve</span></div>`,
    mosaico:() => `<div class="of-grid"><div class="g1">${foto('fx')}</div><div class="g2"><b>${pal}</b></div><div class="g3">${tag()}${T()}</div><div class="g4">${foto('fx', 'f2')}</div></div>${topo()}`,
    ouro:() => `<div class="of-moldura"></div>${topo()}<div class="of-centro"><div class="of-mono">${esc((nome || 'A').trim()[0] || 'A')}</div>${tag()}${T()}<div class="of-bal">${IC.balanca}</div>${S()}</div>`,
    jornal:() => `<div class="of-cab"><span>${esc(handle)}</span><b>${esc(nome || 'O Jurídico')}</b><span>${new Date().toLocaleDateString('pt-BR')}</span></div>${tag()}${T()}<div class="of-colunas">${foto('fx')}<div>${S()}<p class="of-lorem"></p></div></div>`,
    numero:() => `${topo()}<div class="of-num">${esc(ex.num || '03')}</div>${tag()}${T()}<ul class="of-ics">${[IC.doc, IC.check, IC.escudo].map((x, i) => `<li><i>${x}</i><span>${['Separe os documentos', 'Confira os valores', 'Guarde os protocolos'][i]}</span></li>`).join('')}</ul>${foto('fx')}`,
    split:() => `${foto('fx')}<div class="of-bloco">${tag()}${T()}${S()}${arrasta}</div>${topo()}`,
    diagonal:() => `${foto('fx')}<div class="of-faixa"></div><div class="of-base">${tag()}${T()}${S()}</div>${topo()}`,
    cartao:() => `${topo()}<div class="of-card">${tag()}${T()}<i class="of-fio"></i>${S()}<div class="of-card-pe"><span>${esc(nome)}</span><span>${esc(handle)}</span></div></div>${foto('fx')}`,
    documento:() => `${topo()}<div class="of-folha"><div class="of-folha-c"><small>CLÁUSULA 7ª</small>${T()}<p class="of-lorem"></p>${S()}<p class="of-lorem"></p></div><div class="of-carimbo">ATENÇÃO</div></div>${tag()}`,
    tempo:() => `${topo()}${tag()}${T()}${S()}<div class="of-linha">${['1º emprego', '15 anos', '25 anos', 'pedido'].map((x, i) => `<span><i></i><b>${x}</b></span>`).join('')}</div>${foto('fx')}`,
    aspas:() => `${topo()}<div class="of-aspas">“</div>${T()}<i class="of-fio"></i>${tag()}${S()}${foto('fx')}`,
    suico:() => `${topo()}<div class="of-idx"><b>01</b><span>/05</span></div><i class="of-regua"></i>${T()}<i class="of-regua"></i><div class="of-2col">${tag()}${S()}</div>${foto('fx')}<div class="of-quad"></div>`,
    vidro:() => `<div class="of-blob b1"></div><div class="of-blob b2"></div><div class="of-blob b3"></div>${topo()}<div class="of-vidro">${tag()}${T()}${S()}</div>${foto('fx')}`,
    rubro:() => `${foto('fx')}<div class="of-veu"></div><div class="of-luz"></div>${topo()}<div class="of-base">${tag()}${T()}${S()}</div>`,
    urna:() => `<div class="of-listras"></div>${topo()}<div class="of-selo">${IC.voto}<span>2026</span></div>${tag()}${T()}${S()}${foto('fx')}`,
    ilustra:() => `${topo()}<div class="of-sol"></div><div class="of-forma f1"></div><div class="of-forma f2"></div><div class="of-ilbal">${IC.balanca}</div>${tag()}${T()}${S()}${foto('fx')}`,
    cinema:() => `${foto('fx')}<div class="of-barra cima"><span>${esc(handle)}</span><span>${esc(d.tag)}</span></div><div class="of-barra baixo">${T()}</div>${S()}`,
    fino:() => `${topo()}${tag()}${T()}<i class="of-fio"></i>${S()}<div class="of-selo-f">${foto('fx')}<svg viewBox="0 0 100 100"><defs><path id="cf${idt.id}" d="M50 50m-41 0a41 41 0 1 1 82 0a41 41 0 1 1-82 0"/></defs><text><textPath href="#cf${idt.id}">${esc((nome || handle) + ' · ' + d.area + ' · ').toUpperCase().repeat(2)}</textPath></text></svg></div>`
  };
  const capa = (tipo = 'feed') => base(`${tipo} capa`, (L[idt.lay] || L.indigo)());
  const meio = (i, n, corpo) => base(`feed meio ${i % 2 ? 'alt' : ''}`, `<div class="of-fundo">${String(i - 1).padStart(2, '0')}</div><i class="of-faixa-top"></i>${topo()}${corpo}<div class="of-rod"><span>${String(i).padStart(2, '0')}/${String(n).padStart(2, '0')}</span><span>${i < n ? '→' : ''}</span></div>`);
  const fim = (i, n) => meio(i, n, `<div class="of-meio fim">${E('fim.titulo', d.fim.titulo, 'mx-t of-mt')}${E('fim.sub', d.fim.sub, 'of-md')}<div class="of-acoes"><span>Salvar</span><span>Compartilhar</span><span>Comentar</span></div></div>`);
  if (tid === 'o1') { const it = d.itens, n = it.length + 2; out.push(capa());
    it.forEach((x, j) => out.push(meio(j + 2, n, `<div class="of-meio"><div class="of-n">${String(j + 1).padStart(2, '0')}</div>${E(`itens.${j}.t`, x.t, 'mx-t of-mt')}${E(`itens.${j}.d`, x.d, 'of-md')}</div>`))); out.push(fim(n, n)) }
  if (tid === 'o2') { out.push(capa());
    out.push(meio(2, 4, `<div class="of-meio"><div class="mx-t of-mt">Separe:</div><ul class="of-lista">${d.lista.map((x, j) => `<li><i>${IC.check}</i>${E(`lista.${j}`, x, '', 'span')}</li>`).join('')}</ul></div>`));
    out.push(meio(3, 4, `<div class="of-meio"><div class="of-dado">${E('num', d.num, '', 'b')}${E('un', d.un, '', 'small')}</div>${E('dado', d.dado, 'of-md')}</div>`)); out.push(fim(4, 4)) }
  if (tid === 'o3') out.push(capa());
  if (tid === 'o4') out.push(capa('story'));
  if (tid === 'o5') out.push(base('story capa enq', `${topo()}<div class="of-enq">${tag()}${T('enq-t')}<div class="of-poll"><span>${E('a', d.a, '', 'b')}</span><span>${E('b', d.b, '', 'b')}</span></div>${S()}</div>`));
  return out;
}
const FONTES_URL = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&family=Inter+Tight:wght@400;500;700&family=Playfair+Display:ital,wght@0,600;1,600&family=Manrope:wght@400;600;800&family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;700&family=Sora:wght@400;700&family=Bebas+Neue&family=Archivo+Black&family=Archivo:wght@400;700&family=Libre+Caslon+Text:ital,wght@0,400;1,400&family=Inter:wght@400;600;800&family=Cormorant+Garamond:ital,wght@0,600;1,600&family=Lora:ital,wght@0,500;1,500&family=Anton&family=Fraunces:ital,wght@0,400;1,400&family=Outfit:wght@400;700&family=Oswald:wght@600&family=Prata&family=Lato:wght@400;700&family=Libre+Baskerville:ital,wght@0,700;1,400&family=Space+Grotesk:wght@400;700&family=Poppins:wght@400;700&family=Montserrat:wght@500;900&family=Italiana&family=IBM+Plex+Serif:wght@600&family=IBM+Plex+Sans:wght@400;600&family=Gloock&family=Unbounded:wght@600&family=Big+Shoulders+Display:wght@900&family=Syne:wght@800&family=Figtree:wght@400;900&family=Bodoni+Moda:ital,wght@0,400;1,400&family=Mrs+Saint+Delafield&display=swap';
return { nome:'Escritórios', IDT, PACKS, TPL, slides, FONTES_URL, temFoto:true };
})();

// Caso 01 · Meu primeiro caso de consumidor ("A fritadeira que não chegou").
// Linha do tempo (tudo fictício): pedido e Pix de R$ 480,00 em 02/10/2026 (produto R$ 449,90 + frete R$ 30,10),
// entrega prevista até 15/10, rastreio parado em 09/10, chamado em 20/10 com promessa de estorno integral,
// devolução de R$ 200,00 em 23/10 e e-mail (escondido) convertendo R$ 280,00 em crédito na loja, mensagens sem
// resposta em 27/10 e 03/11, primeiro contato com o advogado em 10/11/2026.
import { pagina, chat, email, banco, rastreio } from './ui.mjs';

const T = (n) => ({ esq: `Caso 01 · Doc ${n}` });
const LOJA = '<span>CASA LUME</span><small>utilidades para casa · loja fictícia</small>';
const ROD_LOJA = 'Casa Lume Utilidades Ltda. (empresa fictícia) · CNPJ 12.345.678/0001-90 (fictício) · casalume.exemplo.br<br>Este é um e-mail automático. Para falar conosco, use o WhatsApp de atendimento.';

export const caso = {
  id: '01-consumidor',
  // ordem em que a cliente mandou (fora da ordem cronológica, de propósito)
  docs: [
    {
      nome: 'doc1-conversa-com-voce',
      legenda: 'Doc 1 · A primeira mensagem de Daniela para você (10/11/2026)',
      html: pagina(T(1), chat({
        hora: '19:51', nome: 'Daniela Moura', sub: 'online', inicial: 'DM', bat: '38%',
        msgs: [
          { dia: 'TERÇA-FEIRA, 10 DE NOVEMBRO' },
          { de: 'ele', h: '19:42', t: 'Boa noite! Peguei seu contato com a Lúcia, lá da escola' },
          { de: 'ele', h: '19:42', t: 'Você atende caso de compra pela internet?' },
          { de: 'ele', h: '19:43', t: 'Comprei uma air fryer num site em outubro, paguei 480 no pix e ela nunca chegou' },
          { de: 'ele', h: '19:44', t: 'Fiquei reclamando com eles um tempão aí eles devolveram 200 reais e sumiram' },
          { de: 'ele', h: '19:44', t: 'Não respondem mais nada 😤' },
          { de: 'ele', h: '19:46', audio: '1:08', transc: 'Então, eu tenho tudo aqui, os prints, o comprovante, tá tudo no zap. Eu não sou de ficar brigando, mas do jeito que tá não pode ficar, né? Ou eles resolvem ou devolvem. É muito desaforo. Paguei na hora, à vista, e é isso que eles fazem.' },
          { de: 'ele', h: '19:48', t: 'Vou te mandar os prints, tá meio bagunçado' },
          { de: 'ele', h: '19:48', imgs: ['imagem', 'imagem', 'imagem', 'imagem', 'imagem'] },
          { de: 'ele', h: '19:49', t: 'Ah, a loja é a Casa Lume' },
          { de: 'ele', h: '19:50', t: 'Quanto você cobra pra ver isso?' },
        ],
      }), { fundo: '#ece5dd' }),
    },
    {
      nome: 'doc2-devolucao-pix',
      legenda: 'Doc 2 · Comprovante da devolução de R$ 200,00 (23/10/2026)',
      html: pagina(T(2), banco({
        hora: '15:09', titulo: 'Você recebeu uma devolução de Pix', valor: 'R$ 200,00', data: 'Sexta, 23/10/2026 às 15:02:41',
        linhas: [
          { h4: 'Quem devolveu' },
          ['Nome', 'CASA LUME UTILIDADES LTDA'],
          ['CNPJ', '12.345.678/0001-90'],
          ['Instituição', 'Banco Meridiano S.A.'],
          { h4: 'Pix original' },
          ['Valor do Pix original', 'R$ 480,00'],
          ['Data do Pix original', '02/10/2026'],
          ['Motivo', 'Devolução solicitada pelo recebedor'],
          ['Mensagem', 'Ref. pedido CL-104877'],
          { h4: 'Quem recebeu' },
          ['Nome', 'Daniela Moura Teixeira'],
          ['CPF', '•••.482.917-••'],
        ],
        id: 'D99001234202610231502RfX4qL7mNcTe',
      }), { fundo: '#f4f2fb' }),
    },
    {
      nome: 'doc3-atendimento-loja-20-10',
      legenda: 'Doc 3 · Atendimento da loja pelo WhatsApp (20/10/2026)',
      html: pagina(T(3), chat({
        hora: '10:44', nome: 'Casa Lume Atendimento', sub: 'Conta comercial', inicial: 'CL', bat: '81%',
        msgs: [
          { dia: 'TERÇA-FEIRA, 20 DE OUTUBRO' },
          { de: 'eu', h: '10:05', t: 'Bom dia, meu pedido CL-104877 era pra chegar dia 15 e até agora nada. O rastreio tá parado desde dia 9' },
          { de: 'ele', h: '10:05', quem: 'Lu · assistente virtual', t: 'Olá! Eu sou a Lu, assistente virtual da Casa Lume 💛 Já recebi sua mensagem e um atendente vai falar com você em breve.\nSeu protocolo é 2026-55210.' },
          { de: 'ele', h: '10:31', quem: 'Rafael', t: 'Bom dia, Daniela! Verifiquei aqui e o seu pedido consta como extraviado pela transportadora. Peço desculpas pelo transtorno.' },
          { de: 'ele', h: '10:31', quem: 'Rafael', t: 'Já vou solicitar o estorno integral, que ocorre em até 10 dias úteis, ok?' },
          { de: 'eu', h: '10:33', t: 'Mas eu queria o produto, não tem como mandar outro?' },
          { de: 'ele', h: '10:40', quem: 'Rafael', t: 'No momento esse modelo está sem estoque 😕 assim que tiver reposição avisamos! Por isso já segue com o estorno' },
          { de: 'eu', h: '10:41', t: 'Tá bom, aguardo então' },
          { de: 'ele', h: '10:41', quem: 'Rafael', t: 'A Casa Lume agradece o contato! Tenha um ótimo dia' },
        ],
      }), { fundo: '#ece5dd' }),
    },
    {
      nome: 'doc4-pix-480',
      legenda: 'Doc 4 · Comprovante do Pix de R$ 480,00 (02/10/2026)',
      html: pagina(T(4), banco({
        hora: '21:17', titulo: 'Pix enviado', valor: 'R$ 480,00', data: 'Sexta, 02/10/2026 às 21:16:08',
        linhas: [
          { h4: 'Para' },
          ['Nome', 'CASA LUME UTILIDADES LTDA'],
          ['CNPJ', '12.345.678/0001-90'],
          ['Instituição', 'Banco Meridiano S.A.'],
          ['Chave Pix', 'CNPJ'],
          { h4: 'De' },
          ['Nome', 'Daniela Moura Teixeira'],
          ['CPF', '•••.482.917-••'],
          ['Conta', 'Corrente · ag. 0031'],
          { h4: 'Detalhes' },
          ['Mensagem', 'Pedido CL-104877'],
          ['Tipo', 'Transferência Pix'],
        ],
        id: 'E77001234202610022116bW2kP9sZaQm',
      }), { fundo: '#f4f2fb' }),
    },
    {
      nome: 'doc5-rastreio',
      legenda: 'Doc 5 · Página de rastreio (print feito em 20/10/2026)',
      html: pagina(T(5), rastreio({
        hora: '09:58', url: 'rastreio.rotasul.exemplo.br', empresa: 'EXPRESSO ROTA SUL', codigo: 'ERS 5583 0071 PE',
        situacao: 'EM TRÂNSITO',
        eventos: [
          { t: 'Em trânsito para a unidade de destino', d: '09/10/2026 14:37 · de CD Salvador/BA para Unidade Petrolina/PE' },
          { t: 'Recebido no centro de distribuição', d: '08/10/2026 06:12 · CD Salvador/BA' },
          { t: 'Em trânsito', d: '06/10/2026 19:40 · de CD Cajamar/SP para CD Salvador/BA' },
          { t: 'Coletado no remetente', d: '05/10/2026 16:05 · Casa Lume Utilidades · Cajamar/SP' },
          { t: 'Etiqueta emitida', d: '05/10/2026 09:21' },
        ],
        ultima: 'Previsão de entrega: 15/10/2026 · Última atualização: 09/10/2026 14:37',
      })),
    },
    {
      nome: 'doc6-atendimento-loja-27-10-e-03-11',
      legenda: 'Doc 6 · Atendimento da loja pelo WhatsApp (27/10 e 03/11/2026)',
      html: pagina(T(6), chat({
        hora: '09:20', nome: 'Casa Lume Atendimento', sub: 'Conta comercial', inicial: 'CL', bat: '57%',
        msgs: [
          { dia: 'TERÇA-FEIRA, 27 DE OUTUBRO' },
          { de: 'eu', h: '18:20', t: 'Boa tarde. Recebi só 200 reais de volta. Cadê o resto? Paguei 480' },
          { de: 'ele', h: '18:20', quem: 'Lu · assistente virtual', t: 'Oi! Nosso horário de atendimento é de segunda a sexta, das 9h às 18h. Assim que possível um atendente vai te responder 💛' },
          { dia: 'TERÇA-FEIRA, 3 DE NOVEMBRO' },
          { de: 'eu', h: '09:12', t: 'Bom dia, já faz uma semana. Até agora ninguém me respondeu. Quero o restante do meu dinheiro' },
          { de: 'eu', h: '09:13', t: '??' },
          { de: 'eu', h: '09:19', t: 'Protocolo 2026-55210' },
        ],
      }), { fundo: '#ece5dd' }),
    },
    {
      nome: 'doc7-email-pedido',
      legenda: 'Doc 7 · E-mail de confirmação do pedido (02/10/2026)',
      html: pagina(T(7), email({
        hora: '21:20', assunto: 'Recebemos seu pedido CL-104877 🎉', pasta: 'Caixa de entrada', remetente: 'Casa Lume', endereco: 'pedidos@casalume.exemplo.br',
        inicial: 'CL', quando: '2 de out. de 2026, 21:14', marca: LOJA,
        corpo: `<p>Olá, <b>Daniela</b>! Recebemos o seu pedido e o pagamento já foi confirmado.</p>
<table class="tab"><tr><td>Fritadeira Elétrica sem Óleo Lume Fry 5,5 L Inox 127 V<br><span style="color:#888;font-size:11.5px">Qtd.: 1 · Cód. LF55-127</span></td><td>R$ 449,90</td></tr>
<tr><td>Frete · Expresso Rota Sul (até 8 dias úteis)</td><td>R$ 30,10</td></tr><tr class="tot"><td>Total</td><td>R$ 480,00</td></tr></table>
<div class="cx"><b>Pagamento:</b> Pix · aprovado em 02/10/2026<br><b>Previsão de entrega:</b> até 15/10/2026<br><b>Entrega em:</b> Rua das Acácias, 214, ap. 102 · Jardim Primavera · Petrolina/PE</div>
<p>Você receberá o código de rastreio assim que o pedido for despachado.</p>`,
        rodape: ROD_LOJA,
      })),
    },
  ],
  // envelope: só aparece se o aluno perguntar
  envelope: [
    {
      nome: 'env1-email-credito',
      legenda: 'Envelope · E-mail da loja que Daniela não tinha visto (23/10/2026, pasta Promoções)',
      html: pagina({ esq: 'Caso 01 · Envelope', dir: 'só se perguntarem' }, email({
        hora: '20:03', assunto: 'Atualização do seu pedido CL-104877', pasta: 'Promoções', remetente: 'Casa Lume', endereco: 'naoresponda@casalume.exemplo.br',
        inicial: 'CL', quando: '23 de out. de 2026, 14:48', marca: LOJA,
        corpo: `<p>Olá, Daniela.</p>
<p>Informamos que o seu pedido <b>CL-104877</b> foi cancelado em razão de extravio pela transportadora.</p>
<p>Conforme a nossa Política de Trocas e Devoluções, realizamos a devolução de <b>R$ 200,00</b> via Pix e o valor restante foi convertido em crédito para usar em qualquer produto do nosso site:</p>
<div class="cupom">LUME-DMT-280<small>Crédito de R$ 280,00 · válido por 90 dias (até 21/01/2027)</small></div>
<p>Aproveite as ofertas da semana! 🛒</p>`,
        rodape: ROD_LOJA,
      })),
    },
  ],
};

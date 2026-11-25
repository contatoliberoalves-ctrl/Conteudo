# Canal de promoções (Telegram + WhatsApp)

Robô que acompanha ofertas de marketplaces, filtra o desconto de verdade e publica num canal (ou grupo) do
Telegram. Para o WhatsApp, cada oferta vem com um botão que abre o WhatsApp com a mensagem pronta: você só
escolhe o grupo e envia (o WhatsApp não tem API aberta para grupos).

Roda no Supabase do Líbero: uma Edge Function (`promo-bot`), o schema `promo` no Postgres (fora da API
pública) e um agendamento do `pg_cron` a cada 5 minutos.

## Como funciona

| Loja | Como as ofertas entram |
| --- | --- |
| Shopee | Busca automática pela API de afiliados (precisa das chaves) |
| AliExpress | Busca automática pela API do Portals (precisa das chaves) |
| Mercado Livre, Amazon, Magazine Luiza, KaBuM! | Você manda o link de afiliado para o robô no privado |

- **Busca automática**: a cada 5 minutos o robô pega o próximo termo da lista (`/buscas`), procura nas lojas
  com API, guarda o preço de cada produto e escolhe as melhores ofertas.
- **Desconto de verdade**: o desconto anunciado só vale se o preço também estiver abaixo do que o robô já viu
  (mediana de 30 dias), o que barra o "metade do dobro". Produto sem histórico precisa de desconto maior.
  Também filtra nota, número de vendas e faixa de preço.
- **Modo revisão** (padrão): as ofertas achadas chegam no seu privado com os botões Publicar, WhatsApp,
  Descartar e "Por que essa?". **Modo automático** (`/automatico`): o robô publica sozinho e te avisa em
  silêncio, com o botão do WhatsApp.
- **Oferta manual**: mande o link (com foto e texto, se quiser: `de 399,90 por 199,90`, `cupom ABC10`,
  `loja: kabum`). Se faltar nome, foto ou preço, o robô tenta pegar da página do produto. Links completos da
  Amazon ganham a sua etiqueta de associado (`AMAZON_TAG`).
- Silêncio das 23h às 7h, no máximo 6 ofertas automáticas por hora e 2 por ciclo, sem repetir o mesmo
  produto por 3 dias (tudo ajustável na tabela `promo.config`).

## Pôr para funcionar

1. No Telegram, fale com o **@BotFather**, mande `/newbot` e guarde o token que ele der.
2. No Supabase do projeto: **Edge Functions → Secrets**, crie `TELEGRAM_BOT_TOKEN` com esse token.
   Nunca cole o token em conversas nem no código.
3. Abra `https://<ref-do-projeto>.supabase.co/functions/v1/promo-bot` no navegador: a página registra o
   webhook e mostra o nome do robô.
4. No Telegram, mande para o robô `/start CÓDIGO`. O código de ativação foi gerado no banco e só vale uma vez;
   para vê-lo: `select valor from promo.config where chave = 'codigo_admin';`
5. Crie o canal (ou grupo) e adicione o robô como **administrador** com permissão de publicar mensagens.
   O robô avisa no seu privado quando o canal estiver conectado.
6. Para a busca automática, cadastre-se nos programas de afiliados e crie os segredos abaixo.

| Segredo | Para quê |
| --- | --- |
| `TELEGRAM_BOT_TOKEN` | Token do robô (@BotFather) |
| `SHOPEE_APP_ID`, `SHOPEE_SECRET` | API de afiliados da Shopee (affiliate.shopee.com.br → Open API) |
| `ALIEXPRESS_APP_KEY`, `ALIEXPRESS_APP_SECRET`, `ALIEXPRESS_TRACKING_ID` | API do AliExpress Portals |
| `AMAZON_TAG` | Sua etiqueta de Associado da Amazon (ex.: `seunome-20`) |

Se não der para criar o segredo pelo painel, o token também pode ficar no Vault do banco, com o nome
`telegram_bot_token` (`select vault.create_secret('<token>', 'telegram_bot_token');`); o segredo das
Edge Functions, quando existe, vale no lugar dele.

O Supabase já entrega `SUPABASE_URL` e `SUPABASE_DB_URL` para a função. O segredo interno `promo_segredo`
(protege o webhook e o ciclo) fica no Vault do banco.

## Comandos (no privado do robô)

`/status` situação · `/revisao` e `/automatico` modo · `/pausar` e `/retomar` ofertas automáticas ·
`/desconto 35` desconto mínimo · `/buscas`, `/addbusca termo`, `/delbusca termo` lista de buscas ·
`/teste` exemplo de post · `/ajuda`

## Estrutura

```
supabase/functions/promo-bot/index.ts   ponto de entrada: webhook (POST do Telegram), página (GET) e ciclo (POST do cron)
supabase/functions/promo-bot/bot.ts     mensagens, comandos, botões e conexão do canal
supabase/functions/promo-bot/ciclo.ts   busca automática, filtros, limites e envio
supabase/functions/_shared/             formatação, leitura de oferta manual, filtros, Telegram, banco, lojas
supabase/migrations/                    o que foi aplicado no banco (schema promo, função de registro, agendamento)
testes/                                 testes de unidade e de ponta a ponta
```

## Testes

```bash
cd automacoes/canal-promocoes
deno test --allow-env testes/unidade.test.ts
```

O teste de ponta a ponta roda as funções contra um Postgres local descartável, com o Telegram, as lojas e as
páginas simulados. Ele apaga e recria os schemas `promo` e `vault` do banco indicado: nunca aponte para o
Supabase.

```bash
PROMO_TESTE_DB=postgres://postgres@127.0.0.1:54329/postgres deno test -A testes/integracao.test.ts
```

## Publicar de novo

Com a CLI do Supabase, de dentro de `automacoes/canal-promocoes`:

```bash
supabase functions deploy promo-bot --no-verify-jwt --project-ref <ref-do-projeto>
```

`--no-verify-jwt` é necessário: o Telegram e o agendamento se identificam pelos segredos próprios, não por JWT.

## Quando algo não funciona

- A página do passo 3 mostra o último erro informado pelo Telegram.
- `select em, tipo, detalhe from promo.eventos order by em desc limit 20;` mostra ciclos e erros.
- Resposta `402` com `exceed_storage_size_quota`: a organização do Supabase passou da cota do plano e o
  Supabase bloqueou Storage e Edge Functions de todos os projetos dela. Resolve-se reduzindo o uso e
  esperando o próximo ciclo de cobrança, ou mudando de plano.

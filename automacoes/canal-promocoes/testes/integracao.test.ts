// Teste de ponta a ponta: as duas funções contra um Postgres de verdade (local, descartável),
// com o Telegram, a Shopee, o AliExpress e as páginas de produto simulados.
//
//   PROMO_TESTE_DB=postgres://postgres@127.0.0.1:54329/postgres deno test -A testes/integracao.test.ts
//
// ATENÇÃO: o teste apaga e recria os schemas promo e vault do banco indicado. Nunca aponte para o Supabase.
import { assert, assertEquals, assertMatch, assertStringIncludes } from "jsr:@std/assert@1";
import postgres from "npm:postgres@3.4.5";

const URL_DB = Deno.env.get("PROMO_TESTE_DB") ?? "";
const TOKEN = "000000:token_de_teste_nao_e_real_000000000000"; // falso, de propósito
const ADMIN = 5551234;
const ESTRANHO = 777;
const CANAL = -1001234567890;

// deno-lint-ignore no-explicit-any
type Corpo = Record<string, any>;
const chamadas: { metodo: string; corpo: Corpo }[] = [];
let proximaMsg = 1000;
let webhookUrl = "";
let falharTelegram = false;
const paginas: Record<string, { html: string; urlFinal?: string }> = {};
const shopee: unknown[] = [];
const ali: unknown[] = [];

globalThis.fetch = (async (entrada: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof entrada === "string" ? entrada : entrada instanceof URL ? entrada.href : entrada.url;
  const ok = (result: unknown) => Response.json({ ok: true, result });
  if (url.startsWith("https://api.telegram.org/bot")) {
    if (falharTelegram) throw new TypeError(`error sending request for url (${url})`);
    const metodo = url.split("/").pop()!;
    const corpo: Corpo = JSON.parse(String(init?.body ?? "{}"));
    chamadas.push({ metodo, corpo });
    switch (metodo) {
      case "getMe":
        return ok({ id: 999, is_bot: true, username: "PromoTesteBot" });
      case "getWebhookInfo":
        return ok({ url: webhookUrl, pending_update_count: 0 });
      case "setWebhook":
        webhookUrl = corpo.url;
        return ok(true);
      case "sendPhoto":
        if (String(corpo.photo).includes("quebrada")) {
          return Response.json({ ok: false, error_code: 400, description: "Bad Request: wrong file identifier/HTTP URL specified" });
        }
        return ok({ message_id: ++proximaMsg, chat: { id: corpo.chat_id } });
      case "sendMessage":
        return ok({ message_id: ++proximaMsg, chat: { id: corpo.chat_id } });
      default:
        return ok(true);
    }
  }
  if (url.startsWith("https://open-api.affiliate.shopee.com.br/")) {
    const h = new Headers(init?.headers);
    chamadas.push({ metodo: "shopee", corpo: { autorizacao: h.get("authorization"), ...JSON.parse(String(init?.body)) } });
    return Response.json(shopee.shift() ?? { data: { productOfferV2: { nodes: [] } } });
  }
  if (url.startsWith("https://api-sg.aliexpress.com/")) {
    chamadas.push({ metodo: "aliexpress", corpo: Object.fromEntries(new URLSearchParams(String(init?.body))) });
    return Response.json(ali.shift() ?? { aliexpress_affiliate_product_query_response: { resp_result: { resp_code: 405 } } });
  }
  const p = paginas[url];
  if (p) {
    const r = new Response(p.html, { headers: { "content-type": "text/html; charset=utf-8" } });
    Object.defineProperty(r, "url", { value: p.urlFinal ?? url });
    return r;
  }
  return new Response("não encontrado", { status: 404 });
}) as typeof fetch;

const enviadas = (metodo: string, chat?: number) =>
  chamadas.filter((c) => c.metodo === metodo && (chat == null || c.corpo.chat_id === chat));
const ultima = (metodo: string, chat?: number) => enviadas(metodo, chat).at(-1);
const textoDe = (c?: { corpo: Corpo }) => String(c?.corpo.text ?? c?.corpo.caption ?? "");
const marcar = () => chamadas.length;
const desde = (n: number) => chamadas.slice(n);

const produtoShopee = (id: number, nome: string, preco: string, taxa: number, extra: Corpo = {}) => ({
  itemId: id,
  productName: nome,
  priceMin: preco,
  priceMax: preco,
  priceDiscountRate: taxa,
  imageUrl: `https://cf.shopee.com.br/file/${id}`,
  productLink: `https://shopee.com.br/product/1/${id}`,
  offerLink: `https://s.shopee.com.br/${id}`,
  ratingStar: "4.8",
  sales: 1500,
  ...extra,
});
const respostaShopee = (...nodes: unknown[]) => ({ data: { productOfferV2: { nodes } } });

Deno.test({
  name: "fluxo completo do robô",
  ignore: !URL_DB,
  sanitizeOps: false,
  sanitizeResources: false,
  async fn(t) {
    Deno.env.set("SUPABASE_DB_URL", URL_DB);
    Deno.env.set("SUPABASE_URL", "https://exemplo.supabase.co");
    Deno.env.set("TELEGRAM_BOT_TOKEN", TOKEN);
    Deno.env.set("SHOPEE_APP_ID", "111");
    Deno.env.set("SHOPEE_SECRET", "segredo-shopee");
    Deno.env.set("ALIEXPRESS_APP_KEY", "222");
    Deno.env.set("ALIEXPRESS_APP_SECRET", "segredo-ali");
    Deno.env.set("ALIEXPRESS_TRACKING_ID", "canal");
    Deno.env.set("AMAZON_TAG", "canal-20");

    const sql = postgres(URL_DB, { prepare: false, max: 1, onnotice: () => {} });
    await sql.unsafe(`
      drop schema if exists promo cascade;
      drop schema if exists vault cascade;
      do $$ begin
        if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon; end if;
        if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
      end $$;
      create schema if not exists extensions;
      create extension if not exists pgcrypto with schema extensions;
      create schema vault;
      create table vault.decrypted_secrets (name text primary key, decrypted_secret text, description text);
      create function vault.create_secret(s text, n text, d text) returns uuid language sql
        as $f$ insert into vault.decrypted_secrets values (n, s, d) returning gen_random_uuid() $f$;`);
    const pasta = new URL("../supabase/migrations/", import.meta.url);
    const arquivos = [...Deno.readDirSync(pasta)].map((e) => e.name).filter((n) => n.endsWith(".sql") && !n.includes("agendar")).sort(); // o agendamento (pg_cron) só existe no Supabase
    for (const arq of arquivos) {
      const texto = await Deno.readTextFile(new URL(arq, pasta));
      await sql.unsafe(texto.replace(/^create extension if not exists pg_(cron|net).*$/gm, ""));
    }
    await sql`update promo.config set valor = 'null'::jsonb where chave = 'silencio'`;
    const [{ decrypted_secret: segredo }] = await sql`select decrypted_secret from vault.decrypted_secrets`;
    const [{ codigo }] = await sql`select valor #>> '{}' as codigo from promo.config where chave = 'codigo_admin'`;
    const cfg = async (chave: string) => (await sql`select valor from promo.config where chave = ${chave}`)[0]?.valor;

    const { sha256hex } = await import("../supabase/functions/_shared/seguranca.ts");
    const bot = await import("../supabase/functions/promo-bot/bot.ts");
    const ciclo = await import("../supabase/functions/promo-bot/ciclo.ts");
    const { fecharBanco } = await import("../supabase/functions/_shared/db.ts");
    const segredoTg = await sha256hex("telegram:" + segredo);

    let updateId = 1;
    const update = (u: Corpo, cabecalho = segredoTg) =>
      bot.tratarRequisicao(
        new Request("https://exemplo.supabase.co/functions/v1/promo-bot", {
          method: "POST",
          headers: { "content-type": "application/json", "x-telegram-bot-api-secret-token": cabecalho },
          body: JSON.stringify({ update_id: updateId++, ...u }),
        }),
      );
    const msg = (de: number, texto: string, extra: Corpo = {}) =>
      update({
        message: { message_id: updateId, from: { id: de, first_name: de === ADMIN ? "Líbero" : "Fulano" }, chat: { id: de, type: "private" }, text: texto, ...extra },
      });
    const botao = (dados: string, msgId = 1) =>
      update({ callback_query: { id: `cb${updateId}`, from: { id: ADMIN }, message: { message_id: msgId, chat: { id: ADMIN, type: "private" } }, data: dados } });
    const membro = (chat: Corpo, de: number, status: string, extra: Corpo = {}) =>
      update({ my_chat_member: { chat, from: { id: de }, new_chat_member: { status, user: { id: 999 }, ...extra } } });
    const rodarCiclo = async (cabecalho = segredo) => {
      const r = await ciclo.tratarRequisicao(new Request("https://exemplo.supabase.co/functions/v1/promo-bot", { method: "POST", headers: { "x-promo-segredo": cabecalho } }));
      return { status: r.status, corpo: await r.json().catch(() => null) as Corpo };
    };

    await t.step("página de situação registra o webhook", async () => {
      const r = await bot.tratarRequisicao(new Request("https://exemplo.supabase.co/functions/v1/promo-bot"));
      const texto = await r.text();
      assertStringIncludes(texto, "@PromoTesteBot");
      assertStringIncludes(texto, "Webhook registrado agora");
      assert(!texto.includes(codigo), "a página não pode mostrar o código");
      assertEquals(webhookUrl, "https://exemplo.supabase.co/functions/v1/promo-bot");
      const w = ultima("setWebhook")!.corpo;
      assertEquals(w.secret_token, segredoTg);
      assert(w.allowed_updates.includes("my_chat_member"));
      const r2 = await bot.tratarRequisicao(new Request("https://exemplo.supabase.co/functions/v1/promo-bot"));
      assertStringIncludes(await r2.text(), "já estava registrado");
      assertEquals(enviadas("setWebhook").length, 1);
    });

    await t.step("sem o segredo do webhook: 401", async () => {
      assertEquals((await update({ message: {} }, "errado")).status, 401);
      assertEquals((await update({ message: {} }, "")).status, 401);
    });

    await t.step("estranhos e código errado", async () => {
      const n = marcar();
      await msg(ESTRANHO, "oi");
      assertEquals(desde(n).length, 0);
      await msg(ESTRANHO, "/start");
      assertStringIncludes(textoDe(ultima("sendMessage", ESTRANHO)), "particular");
      await msg(ESTRANHO, "/start PROMO-000000");
      assertEquals(textoDe(ultima("sendMessage", ESTRANHO)), "Código inválido.");
      assertEquals(await cfg("admin_id"), null);
    });

    await t.step("canal adicionado antes do /start fica guardado", async () => {
      await membro({ id: CANAL, type: "channel", title: "Promoções <Top>" }, ADMIN, "administrator", { can_post_messages: true });
      assertEquals((await cfg("canal_pendente"))?.id, CANAL);
      assertEquals(await cfg("canal_id"), null);
    });

    await t.step("/start com o código certo faz de você o administrador", async () => {
      await msg(ADMIN, `/start ${codigo.toLowerCase()}`);
      assertEquals(await cfg("admin_id"), ADMIN);
      assertEquals(ultima("setMyCommands")?.corpo.scope, { type: "chat", chat_id: ADMIN });
      const boasVindas = textoDe(ultima("sendMessage", ADMIN));
      assertStringIncludes(boasVindas, "Você é o administrador");
      assertStringIncludes(boasVindas, "Canal <b>Promoções &lt;Top&gt;</b> conectado");
      assertEquals(await cfg("canal_id"), CANAL);
      assertEquals(await cfg("canal_pendente"), null);
      const n = marcar();
      await msg(ESTRANHO, `/start ${codigo}`);
      assertEquals(desde(n).length, 0);
      assertEquals(await cfg("admin_id"), ADMIN);
    });

    let idAmazon = 0;
    await t.step("oferta manual com texto: monta o post e pede aprovação", async () => {
      paginas["https://www.amazon.com.br/dp/B08XYZ1234?tag=canal-20"] = {
        html: `<meta property="og:image" content="https://m.media-amazon.com/images/I/fone.jpg">`,
      };
      await msg(ADMIN, "Fone JBL Tune 520BT\nhttps://www.amazon.com.br/Fone/dp/B08XYZ1234/ref=sr_1_1?k=fone\nde 399,90 por 199,90\ncupom jbl10");
      const foto = ultima("sendPhoto", ADMIN)!;
      assertEquals(foto.corpo.photo, "https://m.media-amazon.com/images/I/fone.jpg");
      assertStringIncludes(foto.corpo.caption, "Fone JBL Tune 520BT");
      assertStringIncludes(foto.corpo.caption, "De <s>R$ 399,90</s> por <b>R$ 199,90</b>");
      assertStringIncludes(foto.corpo.caption, "<code>JBL10</code>");
      const teclado = foto.corpo.reply_markup.inline_keyboard;
      assertMatch(teclado[0][0].callback_data, /^pub:\d+$/);
      assertMatch(teclado[1][0].url, /^https:\/\/wa\.me\/\?text=/);
      idAmazon = Number(teclado[0][0].callback_data.split(":")[1]);
      const [p] = await sql`select * from promo.postagens where id = ${idAmazon}`;
      assertEquals([p.status, p.origem, p.loja, p.link], ["pendente", "manual", "amazon", "https://www.amazon.com.br/dp/B08XYZ1234?tag=canal-20"]);
    });

    await t.step("Publicar manda para o canal (uma vez só)", async () => {
      await botao(`pub:${idAmazon}`, 77);
      const noCanal = ultima("sendPhoto", CANAL)!;
      assertStringIncludes(noCanal.corpo.caption, "Fone JBL Tune 520BT");
      assertEquals(noCanal.corpo.reply_markup.inline_keyboard, [[{ text: "🛒 Ver oferta", url: "https://www.amazon.com.br/dp/B08XYZ1234?tag=canal-20" }]]);
      const [p] = await sql`select * from promo.postagens where id = ${idAmazon}`;
      assertEquals(p.status, "publicada");
      assert(p.telegram_msg_id && p.publicado_em);
      const edit = ultima("editMessageReplyMarkup")!.corpo;
      assertEquals(edit.message_id, 77);
      assertEquals(edit.reply_markup.inline_keyboard[0][0].url, `https://t.me/c/1234567890/${p.telegram_msg_id}`);
      assertEquals(ultima("answerCallbackQuery")?.corpo.text, "✅ Publicada no canal!");
      const n = enviadas("sendPhoto", CANAL).length;
      await botao(`pub:${idAmazon}`);
      assertEquals(enviadas("sendPhoto", CANAL).length, n);
      assertEquals(ultima("answerCallbackQuery")?.corpo.text, "Essa oferta já foi publicada.");
    });

    let idMeli = 0;
    await t.step("só o link: título e preço vêm da página; foto ruim vira texto", async () => {
      paginas["https://meli.la/abc"] = {
        urlFinal: "https://produto.mercadolivre.com.br/MLB-1",
        html: `<meta property="og:title" content="Air Fryer Mondial 4L | Mercado Livre">
               <meta property="og:image" content="https://exemplo.com/quebrada.jpg">
               <meta property="product:price:amount" content="299.90">`,
      };
      await msg(ADMIN, "https://meli.la/abc");
      const m = ultima("sendMessage", ADMIN)!;
      assertStringIncludes(m.corpo.text, "Air Fryer Mondial 4L");
      assertStringIncludes(m.corpo.text, "Por <b>R$ 299,90</b>");
      assertStringIncludes(m.corpo.text, "🏪 Mercado Livre");
      assertEquals(m.corpo.link_preview_options.url, "https://meli.la/abc");
      idMeli = Number(m.corpo.reply_markup.inline_keyboard[0][0].callback_data.split(":")[1]);
    });

    await t.step("Descartar", async () => {
      await botao(`desc:${idMeli}`);
      assertEquals((await sql`select status from promo.postagens where id = ${idMeli}`)[0].status, "descartada");
      assertEquals(ultima("editMessageReplyMarkup")?.corpo.reply_markup.inline_keyboard[0][0].text, "🗑️ Descartada");
      assertEquals(ultima("answerCallbackQuery")?.corpo.text, "🗑️ Descartada");
      await botao(`pub:${idMeli}`);
      assertEquals(ultima("answerCallbackQuery")?.corpo.text, "Essa oferta foi descartada.");
    });

    await t.step("link encaminhado escondido no texto e mensagem sem link", async () => {
      await msg(ADMIN, "Clique aqui 🔥 Mochila Executiva", { entities: [{ type: "text_link", offset: 0, length: 11, url: "https://s.shopee.com.br/mochila" }] });
      const ofertas = [...enviadas("sendMessage", ADMIN), ...enviadas("sendPhoto", ADMIN)];
      assert(ofertas.some((c) => textoDe(c).includes("🏪 Shopee")));
      await msg(ADMIN, "bom dia");
      assertStringIncludes(textoDe(ultima("sendMessage", ADMIN)), "Não achei nenhum link");
    });

    await t.step("comandos", async () => {
      await msg(ADMIN, "/status");
      const s = textoDe(ultima("sendMessage", ADMIN));
      assertStringIncludes(s, "Situação do robô");
      assertStringIncludes(s, "Shopee ✅");
      assertStringIncludes(s, "Promoções &lt;Top&gt;");
      assertStringIncludes(s, "Hoje: 1 publicadas");
      await msg(ADMIN, "/desconto 35%");
      assertEquals([await cfg("desconto_minimo"), await cfg("desconto_minimo_sem_historico")], [35, 45]);
      await msg(ADMIN, "/desconto 200");
      assertStringIncludes(textoDe(ultima("sendMessage", ADMIN)), "de 5 a 90");
      await msg(ADMIN, "/desconto 30");
      await sql`update promo.config set valor = '40' where chave = 'desconto_minimo_sem_historico'`;
      await msg(ADMIN, "/addbusca   Air Fryer   Philips");
      assert((await cfg("buscas")).includes("air fryer philips"));
      await msg(ADMIN, "/delbusca air fryer philips");
      assert(!(await cfg("buscas")).includes("air fryer philips"));
      await msg(ADMIN, "/buscas");
      assertStringIncludes(textoDe(ultima("sendMessage", ADMIN)), "fone bluetooth");
      await msg(ADMIN, "/pausar");
      assertEquals(await cfg("pausado"), true);
      await msg(ADMIN, "/retomar@PromoTesteBot");
      assertEquals(await cfg("pausado"), false);
      await msg(ADMIN, "/teste");
      assertStringIncludes(textoDe(ultima("sendMessage", ADMIN)), "(exemplo)");
      await msg(ADMIN, "/xyz");
      assertStringIncludes(textoDe(ultima("sendMessage", ADMIN)), "Não conheço");
    });

    await t.step("ciclo sem o segredo: 401", async () => {
      assertEquals((await rodarCiclo("errado")).status, 401);
    });

    const idsRevisao: number[] = [];
    await t.step("ciclo em modo revisão: acha, filtra e manda as 2 melhores para você", async () => {
      shopee.push(
        { errors: [{ message: 'Cannot query field "shopName" on type "ProductOfferV2".' }] },
        respostaShopee(
          produtoShopee(111, "Fone Bluetooth TWS Pro", "59.90", 50),
          produtoShopee(222, "Garrafa Térmica 1L", "45.00", 10),
          produtoShopee(333, "Mouse Sem Fio", "39.90", 60, { ratingStar: "3.9" }),
        ),
      );
      ali.push({
        aliexpress_affiliate_product_query_response: {
          resp_result: {
            resp_code: 200,
            result: {
              products: {
                product: [{
                  product_id: 1005001,
                  product_title: "Smartwatch Ultra 2",
                  target_sale_price: "99.00",
                  target_original_price: "250.00",
                  evaluate_rate: "96.5%",
                  lastest_volume: 800,
                  promotion_link: "https://s.click.aliexpress.com/e/_abc",
                  product_main_image_url: "https://ae01.alicdn.com/kf/relogio.jpg",
                }],
              },
            },
          },
        },
      });
      const n = marcar();
      const r = await rodarCiclo();
      assertEquals(r.status, 200);
      assertEquals([r.corpo.achados, r.corpo.aprovados, r.corpo.enviados, r.corpo.modo], [4, 2, 2, "revisao"]);
      assertEquals(r.corpo.termos, ["fone bluetooth"]);
      const pedidos = desde(n).filter((c) => c.metodo === "shopee");
      assertEquals(pedidos.length, 2);
      assert(pedidos[0].corpo.query.includes("shopName") && !pedidos[1].corpo.query.includes("shopName"));
      assertMatch(pedidos[1].corpo.autorizacao, /^SHA256 Credential=111, Timestamp=\d+, Signature=[0-9a-f]{64}$/);
      const pedidoAli = desde(n).find((c) => c.metodo === "aliexpress")!.corpo;
      assertEquals([pedidoAli.keywords, pedidoAli.tracking_id, pedidoAli.target_currency], ["fone bluetooth", "canal", "BRL"]);
      assertMatch(pedidoAli.sign, /^[0-9A-F]{64}$/);
      const previas = desde(n).filter((c) => c.metodo === "sendPhoto" && c.corpo.chat_id === ADMIN);
      assertEquals(previas.length, 2);
      for (const p of previas) {
        const teclado = p.corpo.reply_markup.inline_keyboard;
        idsRevisao.push(Number(teclado[0][0].callback_data.split(":")[1]));
        assertMatch(teclado.at(-1)[0].callback_data, /^info:\d+$/);
      }
      assert(previas.some((p) => p.corpo.caption.includes("Smartwatch Ultra 2") && p.corpo.caption.includes("-60%")));
      assertEquals((await sql`select count(*)::int as n from promo.precos`)[0].n, 4);
      assertEquals((await sql`select count(*)::int as n from promo.postagens where origem = 'auto' and status = 'pendente'`)[0].n, 2);
      assertEquals(await cfg("cursor_buscas"), 1);
    });

    await t.step("Por que essa?", async () => {
      await botao(`info:${idsRevisao[0]}`);
      const r = ultima("answerCallbackQuery")!.corpo;
      assertEquals(r.show_alert, true);
      assertStringIncludes(r.text, "anunciado pela loja");
      assertStringIncludes(r.text, "sem histórico");
      assert(r.text.length <= 200);
    });

    await t.step("ciclo seguinte não repete o que já foi mandado", async () => {
      shopee.push(respostaShopee(produtoShopee(111, "Fone Bluetooth TWS Pro", "59.90", 50)));
      const n = marcar();
      const r = await rodarCiclo();
      assertEquals([r.corpo.achados, r.corpo.aprovados], [1, 0]);
      assertEquals(desde(n).filter((c) => c.metodo === "sendPhoto").length, 0);
      assertEquals((await sql`select count(*)::int as n from promo.precos`)[0].n, 4);
    });

    await t.step("modo automático publica no canal e te avisa em silêncio", async () => {
      await msg(ADMIN, "/automatico");
      assertEquals(await cfg("modo"), "automatico");
      shopee.push(respostaShopee(produtoShopee(444, "Caixa de Som JBL Go 3", "149.90", 55)));
      const n = marcar();
      const r = await rodarCiclo();
      assertEquals([r.corpo.enviados, r.corpo.modo], [1, "automatico"]);
      const noCanal = desde(n).find((c) => c.metodo === "sendPhoto" && c.corpo.chat_id === CANAL)!;
      assertStringIncludes(noCanal.corpo.caption, "Caixa de Som JBL Go 3");
      const aviso = desde(n).find((c) => c.metodo === "sendPhoto" && c.corpo.chat_id === ADMIN)!;
      assertEquals(aviso.corpo.disable_notification, true);
      assertEquals(aviso.corpo.reply_markup.inline_keyboard[0][0].text, "📢 Ver no canal");
      const [p] = await sql`select * from promo.postagens where origem = 'auto' and status = 'publicada'`;
      assert(p.telegram_msg_id != null);
    });

    await t.step("limite por hora", async () => {
      await sql`update promo.config set valor = '3' where chave = 'max_posts_hora'`;
      shopee.push(respostaShopee(produtoShopee(555, "Ring Light 26cm", "49.90", 50)));
      const r = await rodarCiclo();
      assertEquals([r.corpo.aprovados, r.corpo.enviados], [1, 0]);
      await sql`update promo.config set valor = '6' where chave = 'max_posts_hora'`;
    });

    await t.step("horário de silêncio e pausa", async () => {
      const h = (new Date().getUTCHours() + 21) % 24;
      await sql`update promo.config set valor = ${JSON.stringify({ inicio: h, fim: (h + 1) % 24 })}::text::jsonb where chave = 'silencio'`;
      shopee.push(respostaShopee(produtoShopee(666, "Umidificador de Ar", "59.90", 50)));
      const r = await rodarCiclo();
      assertEquals([r.corpo.aprovados, r.corpo.silencio, r.corpo.enviados], [1, true, undefined]);
      await sql`update promo.config set valor = 'null'::jsonb where chave = 'silencio'`;
      await msg(ADMIN, "/pausar");
      assertEquals((await rodarCiclo()).corpo.pausado, true);
      await msg(ADMIN, "/retomar");
    });

    await t.step("histórico: preço que não caiu de verdade é barrado", async () => {
      const [{ id }] = await sql`select id from promo.produtos where id_externo = '666'`;
      await sql`delete from promo.precos where produto_id = ${id}`;
      for (const [dias, preco] of [[10, 60], [8, 59.9], [5, 61], [2, 60]]) {
        await sql`insert into promo.precos (produto_id, preco, em) values (${id}, ${preco}, now() - make_interval(days => ${dias}))`;
      }
      shopee.push(respostaShopee(produtoShopee(666, "Umidificador de Ar", "59.90", 50)));
      const r = await rodarCiclo();
      assertEquals([r.corpo.achados, r.corpo.aprovados], [1, 0]);
    });

    await t.step("canal removido e grupo de estranho", async () => {
      await membro({ id: -100999, type: "supergroup", title: "Grupo alheio" }, ESTRANHO, "member");
      assertEquals(ultima("leaveChat")?.corpo.chat_id, -100999);
      assertEquals(await cfg("canal_id"), CANAL);
      await membro({ id: CANAL, type: "channel", title: "Promoções <Top>" }, ADMIN, "left");
      assertEquals(await cfg("canal_id"), null);
      assertStringIncludes(textoDe(ultima("sendMessage", ADMIN)), "Perdi o acesso");
    });

    await t.step("o token nunca vai para os registros", async () => {
      falharTelegram = true;
      await msg(ADMIN, "/status");
      falharTelegram = false;
      const eventos = await sql`select tipo, detalhe::text as d from promo.eventos`;
      const erro = eventos.find((e) => e.tipo === "erro_bot");
      assert(erro, "o erro do Telegram devia ter sido registrado");
      assertStringIncludes(erro.d, "***");
      assert(eventos.every((e) => !String(e.d).includes(TOKEN.split(":")[1])));
    });

    await sql.end();
    await fecharBanco();
  },
});

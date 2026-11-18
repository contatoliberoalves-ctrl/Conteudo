// Testes das partes sem rede nem banco.  deno test testes/unidade.test.ts
import { assert, assertAlmostEquals, assertEquals, assertMatch, assertStringIncludes } from "jsr:@std/assert@1";
import { avaliar, emSilencio, regrasDe } from "../supabase/functions/_shared/filtro.ts";
import { assinar, converterAliExpress } from "../supabase/functions/_shared/fontes/aliexpress.ts";
import { autorizacao, converterShopee } from "../supabase/functions/_shared/fontes/shopee.ts";
import {
  desconto,
  encurtarTitulo,
  linkWhatsApp,
  reais,
  textoTelegram,
  textoWhatsApp,
} from "../supabase/functions/_shared/formatar.ts";
import { lojaDoLink, lojaPeloNome, prepararLinkAmazon } from "../supabase/functions/_shared/loja.ts";
import { lerOfertaManual } from "../supabase/functions/_shared/oferta_manual.ts";
import { extrairDados, limparTitulo } from "../supabase/functions/_shared/pagina.ts";
import { igual } from "../supabase/functions/_shared/seguranca.ts";

Deno.test("reais e desconto", () => {
  assertEquals(reais(199.9), "R$ 199,90");
  assertEquals(reais(1299.9), "R$ 1.299,90");
  assertEquals(desconto({ preco: 199.9, precoDe: 399.9 }), 50);
  assertEquals(desconto({ preco: 199.9, precoDe: 150 }), null);
  assertEquals(desconto({ preco: 199.9 }), null);
});

Deno.test("encurtarTitulo corta em palavra inteira", () => {
  const t = encurtarTitulo("Palavra ".repeat(30), 50);
  assert(t.length <= 51);
  assert(t.endsWith("…"));
  assertEquals(encurtarTitulo("  Fone   JBL  "), "Fone JBL");
});

Deno.test("texto do Telegram escapa HTML e mostra o preço riscado", () => {
  const t = textoTelegram({
    loja: "amazon",
    titulo: "Kit <2> pilhas & carregador",
    link: "https://www.amazon.com.br/dp/B000000000?tag=a&x=1",
    preco: 199.9,
    precoDe: 399.9,
    cupom: "ABC10",
  });
  assertStringIncludes(t, "Kit &lt;2&gt; pilhas &amp; carregador");
  assertStringIncludes(t, "De <s>R$ 399,90</s> por <b>R$ 199,90</b> · <b>-50%</b>");
  assertStringIncludes(t, '<a href="https://www.amazon.com.br/dp/B000000000?tag=a&amp;x=1">');
  assertStringIncludes(t, "<code>ABC10</code>");
  assertStringIncludes(t, "🏪 Amazon");
});

Deno.test("texto do WhatsApp usa a formatação do WhatsApp", () => {
  const t = textoWhatsApp({ loja: "shopee", titulo: "Fone *top* _novo_", link: "https://s.shopee.com.br/x", preco: 50, precoDe: 100 });
  assertStringIncludes(t, "🔥 *Fone top novo*");
  assertStringIncludes(t, "De ~R$ 100,00~ por *R$ 50,00* (-50%)");
  assertStringIncludes(t, "👉 https://s.shopee.com.br/x");
  const url = linkWhatsApp({ loja: "shopee", titulo: "Fone", link: "https://s.shopee.com.br/x", preco: 50 });
  assert(url?.startsWith("https://wa.me/?text="));
  assertEquals(linkWhatsApp({ loja: "outra", titulo: "X", link: "https://exemplo.com/" + "a".repeat(2000) }), null);
});

Deno.test("loja pelo link e pelo nome", () => {
  assertEquals(lojaDoLink("https://amzn.to/3abc"), "amazon");
  assertEquals(lojaDoLink("https://www.amazon.com.br/dp/B08XYZ1234"), "amazon");
  assertEquals(lojaDoLink("https://produto.mercadolivre.com.br/MLB-123"), "mercadolivre");
  assertEquals(lojaDoLink("https://meli.la/1abc"), "mercadolivre");
  assertEquals(lojaDoLink("https://s.shopee.com.br/abc"), "shopee");
  assertEquals(lojaDoLink("https://s.click.aliexpress.com/e/_abc"), "aliexpress");
  assertEquals(lojaDoLink("https://www.magazinevoce.com.br/magazineloja/p/123"), "magalu");
  assertEquals(lojaDoLink("https://www.awin1.com/cread.php?awinmid=1"), "kabum");
  assertEquals(lojaDoLink("https://www.kabum.com.br/produto/1"), "kabum");
  assertEquals(lojaDoLink("https://amazon.com.br.golpe.com/x"), "outra");
  assertEquals(lojaDoLink("https://exemplo.com"), "outra");
  assertEquals(lojaDoLink("isso não é link"), "outra");
  assertEquals(lojaPeloNome("Magazine Luiza"), "magalu");
  assertEquals(lojaPeloNome("Mercado livre"), "mercadolivre");
  assertEquals(lojaPeloNome("sei lá"), null);
});

Deno.test("link da Amazon: encurta e põe a etiqueta só se faltar", () => {
  assertEquals(
    prepararLinkAmazon("https://www.amazon.com.br/Fone-JBL/dp/B08xyz1234/ref=sr_1_1?keywords=fone", "minha-20"),
    "https://www.amazon.com.br/dp/B08XYZ1234?tag=minha-20",
  );
  assertEquals(
    prepararLinkAmazon("https://www.amazon.com.br/dp/B08XYZ1234?tag=outra-20&th=1", "minha-20"),
    "https://www.amazon.com.br/dp/B08XYZ1234?tag=outra-20",
  );
  assertEquals(prepararLinkAmazon("https://amzn.to/3abc", "minha-20"), "https://amzn.to/3abc");
  assertEquals(prepararLinkAmazon("https://www.amazon.com.br/s?k=fone", null), "https://www.amazon.com.br/s?k=fone");
  assertEquals(prepararLinkAmazon("https://s.shopee.com.br/x", "minha-20"), "https://s.shopee.com.br/x");
});

Deno.test("oferta manual: formato completo", () => {
  const o = lerOfertaManual("Fone JBL Tune 520BT\nhttps://amzn.to/3abc\nde 399,90 por 199,90\ncupom jbl10");
  assertEquals(o?.titulo, "Fone JBL Tune 520BT");
  assertEquals(o?.loja, "amazon");
  assertEquals(o?.link, "https://amzn.to/3abc");
  assertEquals(o?.preco, 199.9);
  assertEquals(o?.precoDe, 399.9);
  assertEquals(o?.cupom, "JBL10");
  assertEquals(o?.faltaTitulo, false);
});

Deno.test("oferta manual: outras formas de escrever o preço", () => {
  const a = lerOfertaManual("Air Fryer Mondial por R$ 299,90 (era 499) https://meli.la/abc");
  assertEquals([a?.titulo, a?.preco, a?.precoDe, a?.loja], ["Air Fryer Mondial", 299.9, 499, "mercadolivre"]);
  const b = lerOfertaManual("Notebook Gamer\nR$ 4.299,90 R$ 3.499,00\nhttps://www.awin1.com/cread.php?a=1");
  assertEquals([b?.preco, b?.precoDe, b?.loja], [3499, 4299.9, "kabum"]);
  const c = lerOfertaManual("Smart TV 50\nhttps://bit.ly/x\nloja: magalu\nde 2.999 → 2.199");
  assertEquals([c?.loja, c?.preco, c?.precoDe], ["magalu", 2199, 2999]);
  const d = lerOfertaManual("Caneca de 99 por 129 https://s.shopee.com.br/z");
  assertEquals([d?.preco, d?.precoDe], [129, null]);
});

Deno.test("oferta manual: só o link, ou nenhum link", () => {
  const o = lerOfertaManual("https://www.amazon.com.br/dp/B08XYZ1234.");
  assertEquals(o?.link, "https://www.amazon.com.br/dp/B08XYZ1234");
  assertEquals(o?.faltaTitulo, true);
  assertEquals(o?.titulo, "Oferta Amazon");
  assertEquals(lerOfertaManual("oi, tudo bem?"), null);
  assertEquals(lerOfertaManual("Foto", { imagem: "file-id" })?.imagem, undefined);
});

const regras = regrasDe({});

Deno.test("filtro: produto sem histórico precisa de desconto maior", () => {
  assert(avaliar({ preco: 50, precoOriginal: 100, nota: 4.8, vendas: 500 }, { pontos: 0, minimo: null, mediana: null }, regras).ok);
  const r = avaliar({ preco: 65, precoOriginal: 100, nota: 4.8, vendas: 500 }, { pontos: 0, minimo: null, mediana: null }, regras);
  assertEquals([r.ok, r.motivo], [false, "desconto pequeno para produto sem histórico"]);
});

Deno.test("filtro: com histórico, o preço tem de cair de verdade", () => {
  const h = { pontos: 10, minimo: 80, mediana: 100 };
  assert(avaliar({ preco: 85, precoOriginal: 150, nota: 4.7, vendas: 100 }, h, regras).ok);
  assertEquals(avaliar({ preco: 95, precoOriginal: 190, nota: 4.7, vendas: 100 }, h, regras).motivo, "preço não caiu em relação ao histórico");
  assertEquals(avaliar({ preco: 85, precoOriginal: 100, nota: 4.7, vendas: 100 }, h, regras).motivo, "desconto pequeno");
  const menor = avaliar({ preco: 79, precoOriginal: 150, nota: 4.7, vendas: 100 }, h, regras);
  const normal = avaliar({ preco: 85, precoOriginal: 160, nota: 4.7, vendas: 100 }, h, regras);
  assert(menor.pontuacao > 0 && normal.pontuacao > 0);
});

Deno.test("filtro: nota, vendas e faixa de preço", () => {
  const h = { pontos: 0, minimo: null, mediana: null };
  assertEquals(avaliar({ preco: 50, precoOriginal: 100, nota: 4.1, vendas: 500 }, h, regras).motivo, "nota baixa");
  assertEquals(avaliar({ preco: 50, precoOriginal: 100, nota: 4.8, vendas: 3 }, h, regras).motivo, "poucas vendas");
  assertEquals(avaliar({ preco: 9, precoOriginal: 30, nota: 4.8, vendas: 500 }, h, regras).motivo, "fora da faixa de preço");
  assert(avaliar({ preco: 50, precoOriginal: 100, nota: 0, vendas: null }, h, regras).ok); // sem nota ainda
});

Deno.test("regras vêm da configuração", () => {
  assertEquals(regrasDe({ desconto_minimo: 35, nota_minima: "4.2" }).desconto_minimo, 35);
  assertEquals(regrasDe({ nota_minima: "4.2" }).nota_minima, 4.2);
  assertEquals(regrasDe({ preco_maximo: "abc" }).preco_maximo, 5000);
});

Deno.test("silêncio no horário de Brasília", () => {
  const noite = { inicio: 23, fim: 7 };
  assert(emSilencio(new Date("2026-11-18T03:00:00Z"), noite)); // 0h
  assert(emSilencio(new Date("2026-11-18T02:00:00Z"), noite)); // 23h
  assert(!emSilencio(new Date("2026-11-18T10:00:00Z"), noite)); // 7h
  assert(!emSilencio(new Date("2026-11-18T15:00:00Z"), noite)); // 12h
  assert(emSilencio(new Date("2026-11-18T15:00:00Z"), { inicio: 9, fim: 18 }));
  assert(!emSilencio(new Date(), null));
});

Deno.test("página do produto: og:title, imagem e preço", () => {
  const html = `<html><head><title>x</title>
    <meta property="og:title" content="Air Fryer Mondial 4L &amp; Cesto | Mercado Livre">
    <meta content="/img/foto.jpg" property="og:image">
    <meta property="product:price:amount" content="349.90"></head></html>`;
  const d = extrairDados(html, "https://produto.mercadolivre.com.br/MLB-1");
  assertEquals(d.titulo, "Air Fryer Mondial 4L & Cesto");
  assertEquals(d.imagem, "https://produto.mercadolivre.com.br/img/foto.jpg");
  assertEquals(d.preco, 349.9);
  const ld = extrairDados(
    `<title>Amazon.com.br : Fone JBL</title><script type="application/ld+json">{"offers":{"price":"199.90"}}</script>`,
    "https://www.amazon.com.br/dp/B1",
  );
  assertEquals([ld.titulo, ld.preco, ld.imagem], ["Fone JBL", 199.9, null]);
  assertEquals(limparTitulo("Smart TV 50 - Magazine Luiza"), "Smart TV 50");
  assertEquals(limparTitulo("Mouse Gamer | KaBuM!"), "Mouse Gamer");
});

Deno.test("Shopee: conversão e assinatura", async () => {
  const a = converterShopee({
    itemId: 111,
    productName: "Fone Bluetooth X",
    priceMin: "59.90",
    priceDiscountRate: 50,
    imageUrl: "https://cf.shopee.com.br/file/abc",
    productLink: "https://shopee.com.br/product/1/111",
    offerLink: "https://s.shopee.com.br/AbC",
    ratingStar: "4.8",
    sales: 1500,
  });
  assertEquals([a?.idExterno, a?.preco, a?.precoOriginal, a?.nota, a?.vendas], ["111", 59.9, 119.8, 4.8, 1500]);
  assertEquals(converterShopee({ itemId: 1, productName: "X", priceMin: "10", priceDiscountRate: 0.5 })?.precoOriginal, 20);
  assertEquals(converterShopee({ itemId: 1, productName: "X" }), null);
  assertEquals(
    await autorizacao("123", "abc", "{}", 1700000000),
    "SHA256 Credential=123, Timestamp=1700000000, Signature=1a49ed3b9b2d40933c0eba9e68d3722fe7fa4e60a039c05ce57845ba58736684",
  );
});

Deno.test("AliExpress: conversão e assinatura", async () => {
  const a = converterAliExpress({
    product_id: 1005001,
    product_title: "Smartwatch Y",
    target_sale_price: "99.00",
    target_original_price: "250.00",
    evaluate_rate: "96.5%",
    lastest_volume: 800,
    promotion_link: "https://s.click.aliexpress.com/e/_abc",
  });
  assertEquals([a?.idExterno, a?.preco, a?.precoOriginal, a?.vendas], ["1005001", 99, 250, 800]);
  assertAlmostEquals(a!.nota!, 4.825, 0.01);
  assertEquals(converterAliExpress({ product_id: 1, product_title: "X", target_sale_price: "10", target_original_price: "10" })?.precoOriginal, null);
  assertEquals(await assinar({ b: "2", a: "1" }, "seg"), "63A73073B66984ACB466ECCD892BA68CF5FCBC6338013FA89B0BB794EC28B225");
});

Deno.test("comparação de segredos", () => {
  assert(igual("abc", "abc"));
  assert(!igual("abc", "abd"));
  assert(!igual("abc", "abcd"));
  assert(!igual("", "a"));
  assertMatch("ok", /ok/);
});

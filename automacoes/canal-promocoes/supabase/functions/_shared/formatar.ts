// Textos das ofertas: legenda do Telegram (HTML) e mensagem pronta para o WhatsApp.

export type Loja = "shopee" | "aliexpress" | "mercadolivre" | "amazon" | "magalu" | "kabum" | "outra";

export const NOME_LOJA: Record<Loja, string> = {
  shopee: "Shopee",
  aliexpress: "AliExpress",
  mercadolivre: "Mercado Livre",
  amazon: "Amazon",
  magalu: "Magazine Luiza",
  kabum: "KaBuM!",
  outra: "Loja",
};

export interface Oferta {
  loja: Loja;
  titulo: string;
  link: string;
  preco?: number | null;
  precoDe?: number | null;
  cupom?: string | null;
  imagem?: string | null;
  pix?: boolean | null; // preço no PIX
  detalhes?: string[] | null; // regras do cupom, frete etc. (ex.: "R$300 OFF acima de R$2699")
}

export const HASHTAG: Record<Loja, string> = {
  shopee: "#Shopee",
  aliexpress: "#AliExpress",
  mercadolivre: "#MercadoLivre",
  amazon: "#Amazon",
  magalu: "#Magalu",
  kabum: "#KaBuM",
  outra: "#Oferta",
};

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export const reais = (v: number) => brl.format(v).replace(/\u00a0/g, " ");
// No post: sem ",00" quando o valor é redondo (R$ 2.789), como nos canais de oferta.
export const reaisPost = (v: number) => (Number.isInteger(v) ? reais(v).replace(/,00$/, "") : reais(v));

export function desconto(o: Pick<Oferta, "preco" | "precoDe">): number | null {
  if (!o.preco || !o.precoDe || o.precoDe <= o.preco) return null;
  return Math.round((1 - o.preco / o.precoDe) * 100);
}

export function encurtarTitulo(t: string, max = 110): string {
  const limpo = t.replace(/\s+/g, " ").trim();
  if (limpo.length <= max) return limpo;
  const corte = limpo.slice(0, max);
  const espaco = corte.lastIndexOf(" ");
  return (espaco > max * 0.6 ? corte.slice(0, espaco) : corte).replace(/[\s,.;:–-]+$/, "") + "…";
}

export const html = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const atributo = (s: string) => html(s).replace(/"/g, "&quot;");

// Link à mostra, como nos canais de oferta; link comprido vira "loja.com.br/…" (o endereço inteiro vai no clique).
export function linkVisivel(link: string): string {
  if (link.length <= 48) return link;
  try {
    const u = new URL(link);
    return `${u.hostname.replace(/^www\./, "")}/…`;
  } catch {
    return link.slice(0, 45) + "…";
  }
}

export function textoTelegram(o: Oferta): string {
  const linhas = [HASHTAG[o.loja], "", `🔥 <b>${html(encurtarTitulo(o.titulo))}</b>`, ""];
  const d = desconto(o);
  const pix = o.pix ? " no PIX" : "";
  if (o.preco && o.precoDe && d) {
    linhas.push(`❌ De: <s>${reaisPost(o.precoDe)}</s>`, `✅ <b>Por: ${reaisPost(o.preco)}${pix}</b>  📉 <b>-${d}%</b>`);
  } else if (o.preco) linhas.push(`✅ <b>Por: ${reaisPost(o.preco)}${pix}</b>`);
  if (o.cupom) linhas.push(`🏷️ <b>Cupom:</b> <code>${html(o.cupom)}</code>`);
  for (const det of o.detalhes ?? []) linhas.push(`<i>${html(det)}</i>`);
  if (linhas[linhas.length - 1] !== "") linhas.push("");
  linhas.push("🔗 <b>Link do produto:</b>", `<a href="${atributo(o.link)}">${html(linkVisivel(o.link))}</a>`);
  return linhas.join("\n");
}

// No WhatsApp, *negrito*, _itálico_ e ~riscado~: esses símbolos saem do título para não quebrar a formatação.
const semMarcas = (s: string) => s.replace(/[*_~`]/g, "");

export function textoWhatsApp(o: Oferta, curto = false): string {
  const linhas = [`🔥 *${semMarcas(encurtarTitulo(o.titulo, curto ? 60 : 110))}*`, ""];
  const d = desconto(o);
  const pix = o.pix ? " no PIX" : "";
  if (o.preco && o.precoDe && d) linhas.push(`❌ De: ~${reaisPost(o.precoDe)}~`, `✅ *Por: ${reaisPost(o.preco)}${pix}* (-${d}%)`);
  else if (o.preco) linhas.push(`✅ *Por: ${reaisPost(o.preco)}${pix}*`);
  if (o.cupom) linhas.push(`🏷️ Cupom: *${semMarcas(o.cupom)}*`);
  if (!curto) for (const det of o.detalhes ?? []) linhas.push(`_${semMarcas(det)}_`);
  if (linhas[linhas.length - 1] !== "") linhas.push("");
  linhas.push("🔗 Link do produto:", o.link);
  return linhas.join("\n");
}

// Abre o WhatsApp com a mensagem pronta; você só escolhe o grupo. Botões do Telegram não aceitam
// endereços muito longos, então a mensagem encolhe se for preciso (ou o botão some: null).
export function linkWhatsApp(o: Oferta): string | null {
  for (const curto of [false, true]) {
    const url = "https://wa.me/?text=" + encodeURIComponent(textoWhatsApp(o, curto));
    if (url.length <= 1900) return url;
  }
  return null;
}

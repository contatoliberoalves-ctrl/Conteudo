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
}

export const AVISO = "Link de afiliado · preço e estoque podem mudar";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export const reais = (v: number) => brl.format(v).replace(/\u00a0/g, " ");

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

export function textoTelegram(o: Oferta): string {
  const linhas = [`🔥 <b>${html(encurtarTitulo(o.titulo))}</b>`, ""];
  const d = desconto(o);
  if (o.preco && o.precoDe && d) linhas.push(`De <s>${reais(o.precoDe)}</s> por <b>${reais(o.preco)}</b> · <b>-${d}%</b>`);
  else if (o.preco) linhas.push(`Por <b>${reais(o.preco)}</b>`);
  if (o.cupom) linhas.push(`🎟️ Cupom: <code>${html(o.cupom)}</code>`);
  linhas.push(`🏪 ${NOME_LOJA[o.loja]}`, "", `👉 <a href="${atributo(o.link)}">Pegar a oferta</a>`, `<i>${AVISO}</i>`);
  return linhas.join("\n");
}

// No WhatsApp, *negrito*, _itálico_ e ~riscado~: esses símbolos saem do título para não quebrar a formatação.
const semMarcas = (s: string) => s.replace(/[*_~`]/g, "");

export function textoWhatsApp(o: Oferta, curto = false): string {
  const linhas = [`🔥 *${semMarcas(encurtarTitulo(o.titulo, curto ? 60 : 110))}*`, ""];
  const d = desconto(o);
  if (o.preco && o.precoDe && d) linhas.push(`De ~${reais(o.precoDe)}~ por *${reais(o.preco)}* (-${d}%)`);
  else if (o.preco) linhas.push(`Por *${reais(o.preco)}*`);
  if (o.cupom) linhas.push(`🎟️ Cupom: *${semMarcas(o.cupom)}*`);
  linhas.push(`🏪 ${NOME_LOJA[o.loja]}`, "", `👉 ${o.link}`);
  if (!curto) linhas.push("", `_${AVISO}_`);
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

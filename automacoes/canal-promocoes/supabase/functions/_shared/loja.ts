import type { Loja } from "./formatar.ts";

// Loja pelo domínio do link. Links da Awin contam como KaBuM!, a única loja da Awin no plano.
const DOMINIOS: [RegExp, Loja][] = [
  [/(^|\.)(amazon\.com\.br|amzn\.to|amzn\.com|a\.co)$/i, "amazon"],
  [/(^|\.)(mercadolivre\.com\.br|mercadolibre\.com|meli\.la)$/i, "mercadolivre"],
  [/(^|\.)(shopee\.com\.br|shope\.ee)$/i, "shopee"],
  [/(^|\.)(aliexpress\.com|aliexpress\.us)$/i, "aliexpress"],
  [/(^|\.)(magazineluiza\.com\.br|magazinevoce\.com\.br|magalu\.com|magazineluiza\.onelink\.me)$/i, "magalu"],
  [/(^|\.)(kabum\.com\.br|awin1\.com)$/i, "kabum"],
];

export function lojaDoLink(link: string): Loja {
  let host: string;
  try {
    host = new URL(link).hostname;
  } catch {
    return "outra";
  }
  return DOMINIOS.find(([re]) => re.test(host))?.[1] ?? "outra";
}

const NOMES: [RegExp, Loja][] = [
  [/amazon/i, "amazon"],
  [/shopee/i, "shopee"],
  [/ali\s*express/i, "aliexpress"],
  [/mercado\s*livre/i, "mercadolivre"],
  [/magalu|magazine\s*luiza/i, "magalu"],
  [/kabum/i, "kabum"],
];

export function lojaPeloNome(nome: string): Loja | null {
  return NOMES.find(([re]) => re.test(nome))?.[1] ?? null;
}

// Link completo da Amazon: encurta para /dp/ASIN e põe a sua etiqueta de Associado se ele não tiver
// nenhuma. Links curtos (amzn.to) já saem da Amazon com a etiqueta e ficam como estão.
export function prepararLinkAmazon(link: string, tag?: string | null): string {
  let u: URL;
  try {
    u = new URL(link);
  } catch {
    return link;
  }
  if (!/(^|\.)amazon\.com\.br$/i.test(u.hostname)) return link;
  const asin = u.pathname.match(/\/(?:dp|gp\/product|gp\/aw\/d)\/([A-Z0-9]{10})(?:[/?]|$)/i)?.[1];
  const etiqueta = u.searchParams.get("tag") || tag?.trim() || null;
  const novo = asin ? new URL(`https://www.amazon.com.br/dp/${asin.toUpperCase()}`) : u;
  if (etiqueta) novo.searchParams.set("tag", etiqueta);
  return novo.toString();
}

// Shopee: API de Afiliados (GraphQL). Chaves em affiliate.shopee.com.br → Open API.
// Segredos: SHOPEE_APP_ID e SHOPEE_SECRET.
import { sha256hex } from "../seguranca.ts";
import { type Achado, centavos, type Fonte, inteiro, numero, texto } from "./tipos.ts";

const URL_API = "https://open-api.affiliate.shopee.com.br/graphql";
const CAMPOS = [
  "itemId",
  "productName",
  "priceMin",
  "priceMax",
  "priceDiscountRate",
  "imageUrl",
  "productLink",
  "offerLink",
  "ratingStar",
  "sales",
  "shopName",
];
// Se a Shopee deixar de aceitar algum campo, ele sai da lista e a busca é refeita sem ele.
let campos = [...CAMPOS];

const chaves = () => {
  const appId = Deno.env.get("SHOPEE_APP_ID")?.trim();
  const segredo = Deno.env.get("SHOPEE_SECRET")?.trim();
  return appId && segredo ? { appId, segredo } : null;
};

// Authorization: SHA256 Credential=<AppId>, Timestamp=<ts>, Signature=sha256(AppId + ts + corpo + Secret)
export async function autorizacao(appId: string, segredo: string, corpo: string, ts: number): Promise<string> {
  const assinatura = await sha256hex(`${appId}${ts}${corpo}${segredo}`);
  return `SHA256 Credential=${appId}, Timestamp=${ts}, Signature=${assinatura}`;
}

export function converterShopee(n: Record<string, unknown>): Achado | null {
  const preco = numero(n.priceMin) ?? numero(n.price) ?? numero(n.priceMax);
  const id = n.itemId != null ? String(n.itemId) : null;
  const titulo = texto(n.productName);
  if (!preco || preco <= 0 || !id || !titulo) return null;
  let taxa = numero(n.priceDiscountRate) ?? 0;
  if (taxa > 0 && taxa < 1) taxa *= 100; // às vezes vem como fração
  const original = taxa > 0 && taxa < 95 ? centavos(preco / (1 - taxa / 100)) : null;
  return {
    loja: "shopee",
    idExterno: id,
    titulo,
    url: texto(n.productLink),
    linkAfiliado: texto(n.offerLink),
    imagem: texto(n.imageUrl),
    categoria: null,
    preco: centavos(preco),
    precoOriginal: original,
    nota: numero(n.ratingStar),
    vendas: inteiro(n.sales),
  };
}

export const shopee: Fonte = {
  loja: "shopee",
  nome: "Shopee",
  ativa: () => chaves() != null,
  async buscar(termo: string): Promise<Achado[]> {
    const k = chaves();
    if (!k) return [];
    for (let tentativa = 0; tentativa < 3; tentativa++) {
      const query = `{ productOfferV2(keyword: ${JSON.stringify(termo)}, sortType: 2, page: 1, limit: 30) { nodes { ${
        campos.join(" ")
      } } } }`;
      const corpo = JSON.stringify({ query });
      const r = await fetch(URL_API, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: await autorizacao(k.appId, k.segredo, corpo, Math.floor(Date.now() / 1000)),
        },
        body: corpo,
        signal: AbortSignal.timeout(20000),
      });
      const j = await r.json().catch(() => null);
      if (!j) throw new Error(`Shopee respondeu ${r.status} sem JSON`);
      const erros: { message?: string }[] = j.errors ?? [];
      if (erros.length) {
        const ruins = erros.map((e) => /Cannot query field "(\w+)"/.exec(e.message ?? "")?.[1]).filter((c): c is string =>
          !!c
        );
        if (ruins.length && tentativa < 2) {
          campos = campos.filter((c) => !ruins.includes(c));
          continue;
        }
        throw new Error("Shopee: " + erros.map((e) => e.message).join("; ").slice(0, 400));
      }
      const nos: Record<string, unknown>[] = j.data?.productOfferV2?.nodes ?? [];
      return nos.map(converterShopee).filter((a): a is Achado => a != null);
    }
    return [];
  },
};

// AliExpress: API do Portals (programa de afiliados). Chaves em portals.aliexpress.com → API.
// Segredos: ALIEXPRESS_APP_KEY, ALIEXPRESS_APP_SECRET e ALIEXPRESS_TRACKING_ID.
import { credencial } from "../credenciais.ts";
import { hmacSha256hex } from "../seguranca.ts";
import { type Achado, centavos, type Fonte, inteiro, numero, texto } from "./tipos.ts";

const URL_API = "https://api-sg.aliexpress.com/sync";
const CAMPOS = [
  "product_id",
  "product_title",
  "product_main_image_url",
  "target_sale_price",
  "target_original_price",
  "sale_price",
  "original_price",
  "evaluate_rate",
  "lastest_volume",
  "promotion_link",
  "product_detail_url",
  "first_level_category_name",
].join(",");

const chaves = () => {
  const appKey = credencial("ALIEXPRESS_APP_KEY");
  const segredo = credencial("ALIEXPRESS_APP_SECRET");
  const tracking = credencial("ALIEXPRESS_TRACKING_ID");
  return appKey && segredo && tracking ? { appKey, segredo, tracking } : null;
};

// Assinatura do gateway: HMAC-SHA256 dos parâmetros em ordem alfabética, chave e valor colados.
export async function assinar(params: Record<string, string>, segredo: string): Promise<string> {
  const base = Object.keys(params).sort().map((k) => k + params[k]).join("");
  return (await hmacSha256hex(segredo, base)).toUpperCase();
}

export function converterAliExpress(p: Record<string, unknown>): Achado | null {
  const preco = numero(p.target_sale_price) ?? numero(p.sale_price);
  const original = numero(p.target_original_price) ?? numero(p.original_price);
  const id = p.product_id != null ? String(p.product_id) : null;
  const titulo = texto(p.product_title);
  if (!preco || preco <= 0 || !id || !titulo) return null;
  const aprovacao = numero(p.evaluate_rate); // "97.5%" = avaliações positivas
  return {
    loja: "aliexpress",
    idExterno: id,
    titulo,
    url: texto(p.product_detail_url),
    linkAfiliado: texto(p.promotion_link),
    imagem: texto(p.product_main_image_url),
    categoria: texto(p.first_level_category_name),
    preco: centavos(preco),
    precoOriginal: original && original > preco ? centavos(original) : null,
    nota: aprovacao != null && aprovacao > 0 ? Math.round((aprovacao / 20) * 100) / 100 : null,
    vendas: inteiro(p.lastest_volume),
  };
}

export const aliexpress: Fonte = {
  loja: "aliexpress",
  nome: "AliExpress",
  ativa: () => chaves() != null,
  async buscar(termo: string): Promise<Achado[]> {
    const k = chaves();
    if (!k) return [];
    const params: Record<string, string> = {
      method: "aliexpress.affiliate.product.query",
      app_key: k.appKey,
      sign_method: "sha256",
      timestamp: String(Date.now()),
      keywords: termo,
      page_no: "1",
      page_size: "30",
      sort: "LAST_VOLUME_DESC",
      target_currency: "BRL",
      target_language: "PT",
      ship_to_country: "BR",
      tracking_id: k.tracking,
      fields: CAMPOS,
    };
    params.sign = await assinar(params, k.segredo);
    const r = await fetch(URL_API, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded;charset=utf-8" },
      body: new URLSearchParams(params),
      signal: AbortSignal.timeout(20000),
    });
    const j = await r.json().catch(() => null);
    if (!j) throw new Error(`AliExpress respondeu ${r.status} sem JSON`);
    if (j.error_response) throw new Error(`AliExpress: ${j.error_response.code} ${j.error_response.msg ?? ""}`.trim());
    const res = j.aliexpress_affiliate_product_query_response?.resp_result;
    if (!res) throw new Error("AliExpress: resposta sem resp_result");
    if (Number(res.resp_code) === 405) return []; // busca sem resultado
    if (Number(res.resp_code) !== 200) throw new Error(`AliExpress: ${res.resp_code} ${res.resp_msg ?? ""}`.trim());
    const lista: Record<string, unknown>[] = res.result?.products?.product ?? [];
    return lista.map(converterAliExpress).filter((a): a is Achado => a != null);
  },
};

// Completa uma oferta manual com o que a página do produto mostra para prévias de link
// (og:title, og:image, preço). É só uma ajuda: se a loja bloquear, segue sem.
import { paraNumero } from "./oferta_manual.ts";

export interface DadosPagina {
  urlFinal: string;
  titulo: string | null;
  imagem: string | null;
  preco: number | null;
  barrada?: boolean; // a loja mandou para verificação/captcha em vez da página do produto
}

// Lojas que barram robôs mandam para uma página de verificação, com o nome da loja no título.
const BARRADA = /account-verification|captcha|validatecaptcha|\/challenge\b/i;
const SO_LOJA = /^(?:mercado\s*l[ií]bre|mercado\s*livre|amazon(?:\.com(?:\.br)?)?|magalu|magazine\s*luiza|kabum!?|shopee(?:\s*brasil)?|aliexpress)$/i;

const UA = "Mozilla/5.0 (compatible; CanalPromocoesBot/1.0; link preview)";
const ENTIDADES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

export function decodificar(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === "#") {
      const n = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(n) && n > 0 && n < 0x110000 ? String.fromCodePoint(n) : m;
    }
    return ENTIDADES[e.toLowerCase()] ?? m;
  });
}

function metas(html: string): Map<string, string> {
  const m = new Map<string, string>();
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const attr = (n: string) => {
      const r = tag.match(new RegExp(`\\s${n}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i"));
      return r ? (r[1] ?? r[2]) : null;
    };
    const chave = attr("property") ?? attr("name") ?? attr("itemprop");
    const valor = attr("content");
    if (chave && valor && !m.has(chave.toLowerCase())) m.set(chave.toLowerCase(), decodificar(valor).trim());
  }
  return m;
}

// Tira o nome da loja que as páginas põem no título.
export function limparTitulo(t: string): string {
  return t
    .replace(/^\s*Amazon\.com\.br\s*:\s*/i, "")
    .replace(/\s*[|:–-]\s*(Mercado\s*Livre|Magazine\s*Luiza|Magalu|KaBuM!?|Amazon\.com\.br.*|Shopee\s*Brasil|AliExpress)\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function extrairDados(html: string, urlFinal: string): DadosPagina {
  const m = metas(html);
  let titulo = m.get("og:title") ?? m.get("twitter:title") ?? null;
  if (!titulo) {
    const t = html.match(/<title[^>]*>([^<]{3,400})<\/title>/i);
    titulo = t ? decodificar(t[1]) : null;
  }
  let imagem = m.get("og:image:secure_url") ?? m.get("og:image") ?? m.get("twitter:image") ?? null;
  if (imagem) {
    try {
      imagem = new URL(imagem, urlFinal).toString();
      if (!/^https?:/i.test(imagem)) imagem = null;
    } catch {
      imagem = null;
    }
  }
  let preco = paraNumero(m.get("product:price:amount") ?? m.get("og:price:amount") ?? m.get("price") ?? "");
  if (preco == null) {
    for (const bloco of html.match(/<script[^>]*application\/ld\+json[^>]*>[\s\S]*?<\/script>/gi) ?? []) {
      const p = bloco.match(/"(?:price|lowPrice)"\s*:\s*"?(\d+(?:[.,]\d+)?)"?/);
      if (p && (preco = paraNumero(p[1])) != null) break;
    }
  }
  titulo = titulo ? limparTitulo(titulo) : null;
  if (titulo && SO_LOJA.test(titulo)) titulo = null;
  return { urlFinal, titulo: titulo || null, imagem, preco };
}

async function lerAte(r: Response, max: number): Promise<string> {
  const leitor = r.body?.getReader();
  if (!leitor) return "";
  const partes: Uint8Array[] = [];
  let total = 0;
  while (total < max) {
    const { done, value } = await leitor.read();
    if (done) break;
    partes.push(value);
    total += value.length;
  }
  leitor.cancel().catch(() => {});
  const tudo = new Uint8Array(Math.min(total, max));
  let pos = 0;
  for (const p of partes) {
    const pedaco = p.subarray(0, tudo.length - pos);
    tudo.set(pedaco, pos);
    pos += pedaco.length;
    if (pos >= tudo.length) break;
  }
  return new TextDecoder().decode(tudo);
}

export async function lerPagina(link: string): Promise<DadosPagina | null> {
  try {
    const r = await fetch(link, {
      redirect: "follow",
      signal: AbortSignal.timeout(7000),
      headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml", "accept-language": "pt-BR,pt;q=0.9" },
    });
    const urlFinal = r.url || link;
    if (BARRADA.test(urlFinal)) {
      await r.body?.cancel().catch(() => {});
      return { urlFinal, titulo: null, imagem: null, preco: null, barrada: true };
    }
    if (!r.ok || !(r.headers.get("content-type") ?? "").includes("html")) {
      await r.body?.cancel().catch(() => {});
      return { urlFinal, titulo: null, imagem: null, preco: null };
    }
    return extrairDados(await lerAte(r, 800_000), urlFinal);
  } catch {
    return null;
  }
}

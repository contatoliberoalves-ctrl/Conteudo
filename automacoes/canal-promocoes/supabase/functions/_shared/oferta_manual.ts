// Lê a oferta que você manda no privado do bot, por exemplo:
//
//   Fone JBL Tune 520BT
//   https://amzn.to/xxxx
//   de 399,90 por 199,90
//   cupom JBL10
//
// Também entende "por R$ 199,90 (era 399)", dois valores com R$ e "loja: kabum".
import { type Loja, NOME_LOJA, type Oferta } from "./formatar.ts";
import { lojaDoLink, lojaPeloNome } from "./loja.ts";

const URL_RE = /https?:\/\/[^\s<>"]+/gi;
// Valor em reais: 1.299,90 | 1299,90 | 299 | 299.90
const NUM = String.raw`(\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?|\d+(?:[.,]\d{1,2})?)`;
const SETA = String.raw`(?:por|→|->|➜|=>)`;

export function paraNumero(s: string): number | null {
  let t = s.trim();
  if (/^\d{1,3}(\.\d{3})+(,\d{1,2})?$/.test(t)) t = t.replace(/\./g, "").replace(",", ".");
  else t = t.replace(",", ".");
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : null;
}

// faltaTitulo: a mensagem não tinha o nome do produto (o robô tenta pegar da página).
export type OfertaLida = Oferta & { faltaTitulo: boolean };

export function lerOfertaManual(texto: string, opcoes: { imagem?: string | null } = {}): OfertaLida | null {
  const primeiro = texto.match(URL_RE)?.[0];
  if (!primeiro) return null;
  const link = primeiro.replace(/[).,;]+$/, "");
  const semLinks = texto.replace(URL_RE, " ");

  // "loja: kabum" escrito à mão vence a detecção pelo link.
  let loja: Loja = lojaDoLink(link);
  const lojaEscrita = semLinks.match(/\bloja\s*[:\-]?\s*([^\n]+)/i);
  if (lojaEscrita) loja = lojaPeloNome(lojaEscrita[1]) ?? loja;

  let preco: number | null = null;
  let precoDe: number | null = null;
  const dePor = semLinks.match(new RegExp(String.raw`\bde\s*(?:R\$\s*)?${NUM}\s*${SETA}\s*(?:R\$\s*)?${NUM}`, "i"));
  if (dePor) {
    precoDe = paraNumero(dePor[1]);
    preco = paraNumero(dePor[2]);
  } else {
    const por = semLinks.match(new RegExp(String.raw`\bpor\s*(?:R\$\s*)?${NUM}`, "i"));
    const era = semLinks.match(new RegExp(String.raw`\b(?:era|antes)\s*(?:R\$\s*)?${NUM}`, "i"));
    const comCifrao = [...semLinks.matchAll(new RegExp(String.raw`R\$\s*${NUM}`, "gi"))]
      .map((m) => paraNumero(m[1]))
      .filter((n): n is number => n != null);
    if (por) preco = paraNumero(por[1]);
    if (era) precoDe = paraNumero(era[1]);
    if (preco == null && comCifrao.length) preco = Math.min(...comCifrao);
    if (precoDe == null && comCifrao.length > 1) precoDe = Math.max(...comCifrao);
  }
  if (precoDe != null && preco != null && precoDe <= preco) precoDe = null;

  const cupom = semLinks.match(/\bcupom\s*[:\-]?\s*([A-Za-z0-9_-]{3,30})/i)?.[1]?.toUpperCase() ?? null;

  // Título: a primeira linha com texto depois de tirar preços, cupom e loja.
  const titulo = semLinks
    .split("\n")
    .map((l) =>
      l
        .replace(new RegExp(String.raw`\bde\s*(?:R\$\s*)?[\d.,]+\s*${SETA}\s*(?:R\$\s*)?[\d.,]+`, "gi"), "")
        .replace(/\b(?:por|era|antes)\s*(?:R\$\s*)?[\d.,]+/gi, "")
        .replace(/R\$\s*[\d.,]+/gi, "")
        .replace(/\bcupom\s*[:\-]?\s*\S+/gi, "")
        .replace(/\bloja\s*[:\-]?.*$/gi, "")
        .replace(/\(\s*\)|\[\s*\]/g, "")
        .replace(/[\s()\[\]|•·,;:–-]+$/g, "")
        .trim()
    )
    .find((l) => /[A-Za-zÀ-ÿ]{3,}/.test(l));

  return {
    loja,
    link,
    titulo: titulo ?? `Oferta ${NOME_LOJA[loja]}`,
    faltaTitulo: !titulo,
    preco,
    precoDe,
    cupom,
    imagem: opcoes.imagem ?? null,
  };
}

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

// Regras do cupom, frete, parcelas: viram "detalhes" (e os valores delas não contam como preço).
const DETALHE = /\b(?:off|acima de|limite|frete|parcel\w*|sem juros|[àa] vista|cashback|v[aá]lid[oa]|m[ií]nimo)\b/i;
// Linhas que só apontam para o link ("Link do produto:", "Resgate aqui"...).
const ROTULO = /^(?:link(?: do produto| da oferta)?|resgate(?: aqui)?|compre(?: aqui)?|pegue(?: aqui)?|clique aqui|pegar a oferta|ver oferta|acesse(?: aqui)?|aproveite|confira)\W*$/i;
const HASHTAGS = /^(?:#[\p{L}\p{N}_]+[\s,]*)+$/u;
// Emojis e marcadores no começo da linha (🔥, 🏷️, 👉, •...).
const ENFEITE = /^[\s\p{Extended_Pictographic}‍️⃣*•·>\-–—]+/u;

const linhaDePreco = (l: string) => /\bpor\s*:?\s*(?:R\$\s*)?\d/i.test(l) || /^de\s*:?\s*(?:R\$\s*)?\d/i.test(l);

function lerCupom(texto: string): string | null {
  const explicito = texto.match(/\bcupom\s*:\s*([A-Za-z0-9_-]{3,30})/i);
  if (explicito) return explicito[1].toUpperCase();
  // "cupom jbl10" sim; "Cupom Mercado Livre" não (código tem número ou é todo maiúsculo).
  const solto = texto.match(/\bcupom\s+([A-Za-z0-9_-]{3,30})\b/i);
  if (solto && (/\d/.test(solto[1]) || solto[1] === solto[1].toUpperCase())) return solto[1].toUpperCase();
  // "Limite de R$ 200 OFF: LIVREOFF", "use: FRETE10" (o código vem todo em maiúsculas).
  const rotulado = texto.match(/\b(?:off|c[oó]digo|use)\s*:\s*([A-Za-z0-9][A-Za-z0-9_-]{3,29})\b/i);
  return rotulado && rotulado[1] === rotulado[1].toUpperCase() ? rotulado[1] : null;
}

export function lerOfertaManual(texto: string, opcoes: { imagem?: string | null } = {}): OfertaLida | null {
  const primeiro = texto.match(URL_RE)?.[0];
  if (!primeiro) return null;
  const link = primeiro.replace(/[).,;]+$/, "");
  const linhas = texto.replace(URL_RE, " ").split("\n").map((l) => l.replace(ENFEITE, "").trim()).filter(Boolean);
  const tudo = linhas.join("\n");

  // "loja: kabum" escrito à mão vence a detecção pelo link; sem loja no link, vale a hashtag (#Magalu).
  let loja: Loja = lojaDoLink(link);
  const lojaEscrita = tudo.match(/\bloja\s*[:\-]?\s*([^\n]+)/i);
  if (lojaEscrita) loja = lojaPeloNome(lojaEscrita[1]) ?? loja;
  if (loja === "outra") {
    for (const h of tudo.matchAll(/#([\p{L}\p{N}_]+)/gu)) {
      const l = lojaPeloNome(h[1].replace(/([a-z])([A-Z])/g, "$1 $2"));
      if (l) {
        loja = l;
        break;
      }
    }
  }

  const cupom = lerCupom(tudo);
  const detalhes = linhas
    .filter((l) => DETALHE.test(l) && !linhaDePreco(l))
    .map((l) =>
      (cupom ? l.replace(new RegExp(String.raw`\s*(?:cupom\s*)?:?\s*${cupom}\b`, "gi"), "") : l)
        .replace(/[\s:,;–-]+$/, "")
        .trim()
    )
    .filter((l) => l.length >= 4)
    .slice(0, 2)
    .map((l) => (l.length > 120 ? l.slice(0, 117) + "…" : l));
  const base = linhas.filter((l) => !(DETALHE.test(l) && !linhaDePreco(l))).join("\n");

  let preco: number | null = null;
  let precoDe: number | null = null;
  const dePor = base.match(new RegExp(String.raw`\bde\s*:?\s*(?:R\$\s*)?${NUM}\s*,?\s*${SETA}\s*:?\s*(?:R\$\s*)?${NUM}`, "i"));
  if (dePor) {
    precoDe = paraNumero(dePor[1]);
    preco = paraNumero(dePor[2]);
  } else {
    const por = base.match(new RegExp(String.raw`\bpor\s*:?\s*(?:R\$\s*)?${NUM}`, "i"));
    const era = base.match(new RegExp(String.raw`\b(?:era|antes)\s*:?\s*(?:R\$\s*)?${NUM}|\bde\s*:\s*(?:R\$\s*)?${NUM}`, "i"));
    const comCifrao = [...base.matchAll(new RegExp(String.raw`R\$\s*${NUM}`, "gi"))]
      .map((m) => paraNumero(m[1]))
      .filter((n): n is number => n != null);
    if (por) preco = paraNumero(por[1]);
    if (era) precoDe = paraNumero(era[1] ?? era[2]);
    if (preco == null && comCifrao.length) preco = Math.min(...comCifrao);
    if (precoDe == null && comCifrao.length > 1) precoDe = Math.max(...comCifrao);
  }
  if (precoDe != null && preco != null && precoDe <= preco) precoDe = null;
  const pix = preco != null && /\bpix\b/i.test(base);

  // Título: a primeira linha com texto depois de tirar preços, cupom, loja, hashtags e rótulos.
  const titulo = base
    .split("\n")
    .filter((l) => !HASHTAGS.test(l) && !ROTULO.test(l))
    .map((l) =>
      l
        .replace(/^(?:clique|compre|pegue|resgate)\s+aqui\b/i, "")
        .replace(ENFEITE, "")
        .replace(new RegExp(String.raw`\bde\s*:?\s*(?:R\$\s*)?[\d.,]+\s*,?\s*${SETA}\s*:?\s*(?:R\$\s*)?[\d.,]+`, "gi"), "")
        .replace(/\b(?:por|era|antes)\s*:?\s*(?:R\$\s*)?[\d.,]+/gi, "")
        .replace(/\bde\s*:\s*(?:R\$\s*)?[\d.,]+/gi, "")
        .replace(/R\$\s*[\d.,]+/gi, "")
        .replace(/\b(?:no\s+)?pix\b/gi, "")
        .replace(cupom ? new RegExp(String.raw`\bcupom\s*:?\s*${cupom}\b`, "gi") : /$^/, "")
        .replace(/\bloja\s*[:\-]?.*$/gi, "")
        .replace(/#[\p{L}\p{N}_]+/gu, "")
        .replace(/\(\s*\)|\[\s*\]/g, "")
        .replace(/^[\s:|•·,;–—-]+|[\s()\[\]|•·,;:–—-]+$/g, "")
        .trim()
    )
    .find((l) => /[A-Za-zÀ-ÿ]{3,}/.test(l) && !ROTULO.test(l));

  return {
    loja,
    link,
    titulo: titulo ?? `Oferta ${NOME_LOJA[loja]}`,
    faltaTitulo: !titulo,
    preco,
    precoDe,
    cupom,
    pix,
    detalhes,
    imagem: opcoes.imagem ?? null,
  };
}

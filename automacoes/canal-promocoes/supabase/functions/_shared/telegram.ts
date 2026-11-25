// Conversa com a Bot API do Telegram.
import { gravarConfig, lerConfig, lerVault, segredo, segredoWebhook } from "./db.ts";
import { linkWhatsApp, type Oferta, textoTelegram } from "./formatar.ts";
import { mensagem, sha256hex } from "./seguranca.ts";

export class ErroTelegram extends Error {
  constructor(public metodo: string, public codigo: number, public descricao: string) {
    super(`Telegram ${metodo}: ${codigo} ${descricao}`);
  }
}

// O token vem do segredo TELEGRAM_BOT_TOKEN das Edge Functions ou, se ele não existir, do Vault do banco
// (nome telegram_bot_token). prepararToken() roda no começo de cada requisição.
let tokenVault: string | null = null;
export async function prepararToken(): Promise<void> {
  if (Deno.env.get("TELEGRAM_BOT_TOKEN")?.trim() || tokenVault) return;
  try {
    tokenVault = (await lerVault("telegram_bot_token"))?.trim() || null;
  } catch (e) {
    console.error("token no Vault", mensagem(e));
  }
}
const token = () => Deno.env.get("TELEGRAM_BOT_TOKEN")?.trim() || tokenVault || null;
export const temToken = () => token() != null;

// Erros do fetch trazem a URL inteira, com o token: nada vai para o log sem passar por aqui.
export function semToken(texto: string): string {
  const t = token();
  const s = t ? texto.split(t).join("***") : texto;
  return s.replace(/\d{6,}:[A-Za-z0-9_-]{30,}/g, "***");
}

// deno-lint-ignore no-explicit-any
export async function tg<T = any>(metodo: string, corpo: Record<string, unknown> = {}): Promise<T> {
  const t = token();
  if (!t) throw new Error("TELEGRAM_BOT_TOKEN não configurado");
  let r: Response;
  try {
    r = await fetch(`https://api.telegram.org/bot${t}/${metodo}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(corpo),
      signal: AbortSignal.timeout(15000),
    });
  } catch (e) {
    throw new Error(semToken(`Telegram ${metodo}: ${mensagem(e)}`));
  }
  const j = await r.json().catch(() => ({ ok: false, error_code: r.status, description: "resposta inválida" }));
  if (!j.ok) throw new ErroTelegram(metodo, j.error_code ?? r.status, j.description ?? "");
  return j.result as T;
}

type Botao = { text: string; url?: string; callback_data?: string };
export type Teclado = Botao[][];

const verOferta = (o: Oferta): Botao => ({ text: "🛒 Ver oferta", url: o.link });
const whats = (o: Oferta): Botao[][] => {
  const url = linkWhatsApp(o);
  return url ? [[{ text: "💬 Mandar no WhatsApp", url }]] : [];
};

// No canal: só o botão da oferta.
export const tecladoCanal = (o: Oferta): Teclado => [[verOferta(o)]];

// No seu privado, antes de publicar.
export function tecladoRevisao(id: number, o: Oferta, comInfo: boolean): Teclado {
  return [
    [{ text: "✅ Publicar no canal", callback_data: `pub:${id}` }, { text: "🗑️ Descartar", callback_data: `desc:${id}` }],
    ...whats(o),
    comInfo ? [{ text: "📊 Por que essa?", callback_data: `info:${id}` }, verOferta(o)] : [verOferta(o)],
  ];
}

export const tecladoPublicada = (o: Oferta, linkCanal: string): Teclado => [
  [{ text: "✅ Publicada · ver no canal", url: linkCanal }],
  ...whats(o),
  [verOferta(o)],
];

export const tecladoDescartada = (o: Oferta): Teclado => [[{ text: "🗑️ Descartada", callback_data: "nada" }], [verOferta(o)]];

// Aviso no seu privado quando o robô publica sozinho (modo automático).
export const tecladoAvisoAdmin = (o: Oferta, linkCanal: string): Teclado => [
  [{ text: "📢 Ver no canal", url: linkCanal }],
  ...whats(o),
];

export function linkMensagem(canalId: number, usuario: unknown, msgId: number): string {
  if (typeof usuario === "string" && usuario) return `https://t.me/${usuario}/${msgId}`;
  const s = String(canalId);
  return `https://t.me/c/${s.startsWith("-100") ? s.slice(4) : s.replace(/^-/, "")}/${msgId}`;
}

// Foto com legenda quando houver imagem; se o Telegram recusar a imagem, vai só o texto com prévia do link.
export async function enviarOferta(
  chatId: number,
  o: Oferta,
  teclado: Teclado,
  extra: Record<string, unknown> = {},
): Promise<{ message_id: number }> {
  const texto = textoTelegram(o);
  const reply_markup = { inline_keyboard: teclado };
  if (o.imagem) {
    try {
      return await tg("sendPhoto", { chat_id: chatId, photo: o.imagem, caption: texto, parse_mode: "HTML", reply_markup, ...extra });
    } catch (e) {
      if (!(e instanceof ErroTelegram) || e.codigo !== 400 || /parse entities/i.test(e.descricao)) throw e;
    }
  }
  return await tg("sendMessage", {
    chat_id: chatId,
    text: texto,
    parse_mode: "HTML",
    reply_markup,
    link_preview_options: { url: o.link, prefer_large_media: true },
    ...extra,
  });
}

export const responder = (chatId: number, texto: string, extra: Record<string, unknown> = {}) =>
  tg("sendMessage", { chat_id: chatId, text: texto, parse_mode: "HTML", link_preview_options: { is_disabled: true }, ...extra });

export const COMANDOS = [
  { command: "status", description: "Situação do robô" },
  { command: "revisao", description: "Ofertas achadas vêm para você aprovar" },
  { command: "automatico", description: "Publicar sozinho as ofertas achadas" },
  { command: "pausar", description: "Pausar as ofertas automáticas" },
  { command: "retomar", description: "Retomar as ofertas automáticas" },
  { command: "desconto", description: "Desconto mínimo (ex.: /desconto 35)" },
  { command: "buscas", description: "O que eu procuro nas lojas" },
  { command: "addbusca", description: "Procurar mais um produto (ex.: /addbusca air fryer)" },
  { command: "delbusca", description: "Parar de procurar um produto" },
  { command: "teste", description: "Ver um exemplo de post" },
  { command: "chaves", description: "Chaves de afiliado (Shopee, AliExpress, Amazon)" },
  { command: "ajuda", description: "Como usar" },
];

export const urlWebhook = () => `${Deno.env.get("SUPABASE_URL")}/functions/v1/promo-bot`;

export interface SituacaoWebhook {
  usuario: string;
  mudou: boolean;
  ultimoErro: string | null;
}

// Registra o webhook do robô (de novo só se o token, o segredo ou o endereço mudarem).
export async function garantirWebhook(): Promise<SituacaoWebhook> {
  const eu = await tg<{ id: number; username: string }>("getMe");
  const info = await tg<{ url: string; last_error_message?: string; last_error_date?: number }>("getWebhookInfo");
  const url = urlWebhook();
  const marca = (await sha256hex(`${token()}|${await segredo()}|${url}`)).slice(0, 16);
  const cfg = await lerConfig();
  let mudou = false;
  if (info.url !== url || cfg.webhook_marca !== marca) {
    await tg("setWebhook", {
      url,
      secret_token: await segredoWebhook(),
      allowed_updates: ["message", "callback_query", "my_chat_member"],
      max_connections: 5,
    });
    await gravarConfig("webhook_marca", marca);
    mudou = true;
  }
  if (cfg.bot_usuario !== eu.username) await gravarConfig("bot_usuario", eu.username);
  const recente = info.last_error_date != null && Date.now() / 1000 - info.last_error_date < 3600;
  return { usuario: eu.username, mudou, ultimoErro: !mudou && recente ? info.last_error_message ?? null : null };
}

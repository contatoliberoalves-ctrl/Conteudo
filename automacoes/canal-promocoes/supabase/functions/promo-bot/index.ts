// Uma função só: webhook do Telegram (POST com o cabeçalho do Telegram), página de situação (GET)
// e ciclo de busca de ofertas (POST do pg_cron com o cabeçalho x-promo-segredo).
import { tratarRequisicao as bot } from "./bot.ts";
import { tratarRequisicao as ciclo } from "./ciclo.ts";
import { carregarCredenciais } from "../_shared/credenciais.ts";
import { prepararToken } from "../_shared/telegram.ts";

Deno.serve(async (req) => {
  await Promise.all([prepararToken(), carregarCredenciais()]);
  return req.headers.has("x-promo-segredo") ? ciclo(req) : bot(req);
});

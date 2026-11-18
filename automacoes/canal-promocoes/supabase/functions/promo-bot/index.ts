// Uma função só: webhook do Telegram (POST com o cabeçalho do Telegram), página de situação (GET)
// e ciclo de busca de ofertas (POST do pg_cron com o cabeçalho x-promo-segredo).
import { tratarRequisicao as bot } from "./bot.ts";
import { tratarRequisicao as ciclo } from "./ciclo.ts";

Deno.serve((req) => (req.headers.has("x-promo-segredo") ? ciclo(req) : bot(req)));

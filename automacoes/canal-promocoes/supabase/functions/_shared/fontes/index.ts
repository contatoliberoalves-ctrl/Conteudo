// Lojas com busca automática. As outras (Mercado Livre, Amazon, Magalu, KaBuM!) entram pelo
// link que você manda para o robô: elas não têm API aberta de ofertas para afiliados.
import { aliexpress } from "./aliexpress.ts";
import { shopee } from "./shopee.ts";
import type { Fonte } from "./tipos.ts";

export const FONTES: Fonte[] = [shopee, aliexpress];

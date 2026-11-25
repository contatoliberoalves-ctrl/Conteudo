// Chaves de afiliado. Vêm do segredo das Edge Functions (NOME) ou, sem ele, do Vault do banco (nome em
// minúsculas), onde os comandos /shopee, /aliexpress e /amazon do robô gravam. carregarCredenciais() roda no
// começo de cada requisição; credencial() é síncrona.
import { gravarVault, lerVaultVarios } from "./db.ts";
import { mensagem } from "./seguranca.ts";

export const NOMES_CREDENCIAIS = [
  "SHOPEE_APP_ID",
  "SHOPEE_SECRET",
  "ALIEXPRESS_APP_KEY",
  "ALIEXPRESS_APP_SECRET",
  "ALIEXPRESS_TRACKING_ID",
  "AMAZON_TAG",
] as const;
export type NomeCredencial = (typeof NOMES_CREDENCIAIS)[number];

let doVault: Partial<Record<NomeCredencial, string>> = {};

export async function carregarCredenciais(): Promise<void> {
  try {
    const lidos = await lerVaultVarios(NOMES_CREDENCIAIS.map((n) => n.toLowerCase()));
    doVault = Object.fromEntries(NOMES_CREDENCIAIS.flatMap((n) => (lidos[n.toLowerCase()] ? [[n, lidos[n.toLowerCase()]]] : [])));
  } catch (e) {
    console.error("credenciais no Vault", mensagem(e));
  }
}

export function credencial(nome: NomeCredencial): string | null {
  return Deno.env.get(nome)?.trim() || doVault[nome]?.trim() || null;
}

export async function salvarCredenciais(valores: Partial<Record<NomeCredencial, string>>): Promise<void> {
  for (const [nome, valor] of Object.entries(valores) as [NomeCredencial, string][]) {
    await gravarVault(nome.toLowerCase(), valor.trim());
    doVault[nome] = valor.trim();
  }
}

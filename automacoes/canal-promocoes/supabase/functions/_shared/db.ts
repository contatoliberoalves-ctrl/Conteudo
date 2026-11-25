// Acesso direto ao Postgres do projeto (schema promo, fora da API pública).
import postgres from "npm:postgres@3.4.5";
import { sha256hex } from "./seguranca.ts";

type Sql = ReturnType<typeof postgres>;
let conexao: Sql | null = null;

export function sql(): Sql {
  if (!conexao) {
    const url = Deno.env.get("SUPABASE_DB_URL");
    if (!url) throw new Error("SUPABASE_DB_URL não está definido");
    // prepare: false funciona também pelo pooler em modo transação.
    conexao = postgres(url, { prepare: false, max: 2, idle_timeout: 10, connect_timeout: 10 });
  }
  return conexao;
}

export async function fecharBanco(): Promise<void> {
  await conexao?.end({ timeout: 1 });
  conexao = null;
}

export type Config = Record<string, unknown>;

export async function lerConfig(): Promise<Config> {
  const linhas = await sql()`select chave, valor from promo.config`;
  return Object.fromEntries(linhas.map((l) => [l.chave as string, l.valor as unknown]));
}

// JSON vai como texto e o Postgres converte (::text::jsonb). Com ::jsonb direto, o driver
// transforma o parâmetro em JSON de novo e o valor vira uma string dentro do jsonb.
export async function gravarConfig(chave: string, valor: unknown): Promise<void> {
  await sql()`
    insert into promo.config (chave, valor) values (${chave}, ${JSON.stringify(valor ?? null)}::text::jsonb)
    on conflict (chave) do update set valor = excluded.valor, atualizado_em = now()`;
}

export async function evento(tipo: string, detalhe?: unknown): Promise<void> {
  try {
    await sql()`insert into promo.eventos (tipo, detalhe)
      values (${tipo}, ${detalhe === undefined ? null : JSON.stringify(detalhe)}::text::jsonb)`;
  } catch (e) {
    console.error("evento", tipo, e);
  }
}

export const numeroOuNulo = (v: unknown): number | null => {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

export async function lerVault(nome: string): Promise<string | null> {
  const [l] = await sql()`select decrypted_secret from vault.decrypted_secrets where name = ${nome}`;
  return l?.decrypted_secret ? String(l.decrypted_secret) : null;
}

// Segredo guardado no Vault: protege o ciclo de busca e o webhook do Telegram.
let segredoGuardado: string | null = null;
export async function segredo(): Promise<string> {
  if (segredoGuardado) return segredoGuardado;
  const [l] = await sql()`select decrypted_secret from vault.decrypted_secrets where name = 'promo_segredo'`;
  if (!l?.decrypted_secret) throw new Error("segredo promo_segredo não encontrado no Vault");
  segredoGuardado = String(l.decrypted_secret);
  return segredoGuardado;
}

// O Telegram manda este valor no cabeçalho de cada atualização (secret_token do webhook).
export async function segredoWebhook(): Promise<string> {
  return await sha256hex("telegram:" + (await segredo()));
}

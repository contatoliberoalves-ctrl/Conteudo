const enc = new TextEncoder();
const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");

export async function sha256hex(texto: string): Promise<string> {
  return hex(await crypto.subtle.digest("SHA-256", enc.encode(texto)));
}

export async function hmacSha256hex(chave: string, texto: string): Promise<string> {
  const k = await crypto.subtle.importKey("raw", enc.encode(chave), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", k, enc.encode(texto)));
}

// Compara segredos sem revelar, pelo tempo de resposta, onde está a primeira diferença.
export function igual(a: string, b: string): boolean {
  const x = enc.encode(a);
  const y = enc.encode(b);
  let dif = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) dif |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return dif === 0;
}

export const mensagem = (e: unknown) => (e instanceof Error ? e.message : String(e));

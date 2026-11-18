import type { Loja } from "../formatar.ts";

// Um produto encontrado numa busca automática.
export interface Achado {
  loja: Loja;
  idExterno: string;
  titulo: string;
  url: string | null;
  linkAfiliado: string | null;
  imagem: string | null;
  categoria: string | null;
  preco: number;
  precoOriginal: number | null;
  nota: number | null;
  vendas: number | null;
}

export interface Fonte {
  loja: Loja;
  nome: string;
  // Tem as chaves de afiliado configuradas?
  ativa(): boolean;
  buscar(termo: string): Promise<Achado[]>;
}

export function numero(v: unknown): number | null {
  if (v == null || v === "") return null;
  const n = typeof v === "number" ? v : Number(String(v).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

export const centavos = (n: number) => Math.round(n * 100) / 100;

export function inteiro(v: unknown): number | null {
  const n = numero(v);
  return n == null ? null : Math.round(n);
}

export const texto = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v.trim() : null);

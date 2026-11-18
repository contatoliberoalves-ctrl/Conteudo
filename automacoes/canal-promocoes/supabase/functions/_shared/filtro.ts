// Quais ofertas encontradas valem um post. O desconto anunciado pela loja só conta se o
// preço também cair em relação ao que o próprio robô já viu (barra o "metade do dobro").

export interface Regras {
  desconto_minimo: number;
  desconto_minimo_sem_historico: number;
  queda_vs_mediana: number;
  preco_minimo: number;
  preco_maximo: number;
  nota_minima: number;
  vendas_minimas: number;
}

export interface Candidato {
  preco: number;
  precoOriginal?: number | null;
  nota?: number | null;
  vendas?: number | null;
}

export interface Historico {
  pontos: number;
  minimo: number | null;
  mediana: number | null;
}

export interface Avaliacao {
  ok: boolean;
  motivo?: string;
  desconto: number;
  pontuacao: number;
}

export function regrasDe(cfg: Record<string, unknown>): Regras {
  const n = (k: keyof Regras, padrao: number) => (Number.isFinite(Number(cfg[k])) ? Number(cfg[k]) : padrao);
  return {
    desconto_minimo: n("desconto_minimo", 30),
    desconto_minimo_sem_historico: n("desconto_minimo_sem_historico", 40),
    queda_vs_mediana: n("queda_vs_mediana", 10),
    preco_minimo: n("preco_minimo", 15),
    preco_maximo: n("preco_maximo", 5000),
    nota_minima: n("nota_minima", 4.5),
    vendas_minimas: n("vendas_minimas", 30),
  };
}

export function avaliar(c: Candidato, h: Historico, r: Regras): Avaliacao {
  const desconto = c.precoOriginal && c.precoOriginal > c.preco ? Math.round((1 - c.preco / c.precoOriginal) * 100) : 0;
  const nao = (motivo: string): Avaliacao => ({ ok: false, motivo, desconto, pontuacao: 0 });

  if (c.preco < r.preco_minimo || c.preco > r.preco_maximo) return nao("fora da faixa de preço");
  if (c.nota != null && c.nota > 0 && c.nota < r.nota_minima) return nao("nota baixa");
  if (c.vendas != null && c.vendas < r.vendas_minimas) return nao("poucas vendas");

  const temHistorico = h.pontos >= 3 && h.mediana != null;
  if (temHistorico) {
    if (desconto < r.desconto_minimo) return nao("desconto pequeno");
    if (c.preco > h.mediana! * (1 - r.queda_vs_mediana / 100)) return nao("preço não caiu em relação ao histórico");
  } else if (desconto < r.desconto_minimo_sem_historico) {
    return nao("desconto pequeno para produto sem histórico");
  }

  const menorPreco = h.minimo != null && c.preco <= h.minimo ? 10 : 0;
  const pontuacao = desconto + Math.log10((c.vendas ?? 0) + 1) * 5 + ((c.nota ?? 4.5) - 4.5) * 10 + menorPreco;
  return { ok: true, desconto, pontuacao: Math.round(pontuacao * 10) / 10 };
}

// Horário de Brasília (UTC-3, sem horário de verão). Ex.: { inicio: 23, fim: 7 } = das 23h às 7h.
export function emSilencio(agora: Date, s: { inicio: number; fim: number } | null | undefined): boolean {
  if (!s) return false;
  const h = (agora.getUTCHours() + 21) % 24;
  return s.inicio > s.fim ? h >= s.inicio || h < s.fim : h >= s.inicio && h < s.fim;
}

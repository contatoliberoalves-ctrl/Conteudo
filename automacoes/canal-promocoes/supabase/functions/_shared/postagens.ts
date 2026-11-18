// Ofertas que passam pelo robô: as que esperam a sua aprovação e as já publicadas.
import { type Config, numeroOuNulo, sql } from "./db.ts";
import { desconto, type Loja, type Oferta, reais } from "./formatar.ts";
import { enviarOferta, linkMensagem, tecladoCanal } from "./telegram.ts";

export interface Postagem {
  id: number;
  produtoId: number | null;
  origem: string;
  loja: Loja;
  titulo: string;
  link: string;
  imagem: string | null;
  preco: number | null;
  precoDe: number | null;
  cupom: string | null;
  status: string;
}

function paraPostagem(r: Record<string, unknown>): Postagem {
  return {
    id: Number(r.id),
    produtoId: numeroOuNulo(r.produto_id),
    origem: String(r.origem),
    loja: r.loja as Loja,
    titulo: String(r.titulo),
    link: String(r.link),
    imagem: (r.imagem as string | null) ?? null,
    preco: numeroOuNulo(r.preco),
    precoDe: numeroOuNulo(r.preco_de),
    cupom: (r.cupom as string | null) ?? null,
    status: String(r.status),
  };
}

export const ofertaDe = (p: Postagem): Oferta => ({
  loja: p.loja,
  titulo: p.titulo,
  link: p.link,
  preco: p.preco,
  precoDe: p.precoDe,
  cupom: p.cupom,
  imagem: p.imagem,
});

export async function criarPostagem(
  o: Oferta,
  origem: "auto" | "manual",
  produtoId: number | null,
  status: "pendente" | "publicada" = "pendente",
  msgId: number | null = null,
): Promise<number> {
  const [r] = await sql()`
    insert into promo.postagens
      (produto_id, origem, loja, titulo, link, imagem, preco, preco_de, desconto, cupom, status, telegram_msg_id, publicado_em)
    values
      (${produtoId}, ${origem}, ${o.loja}, ${o.titulo}, ${o.link}, ${o.imagem ?? null}, ${o.preco ?? null},
       ${o.precoDe ?? null}, ${desconto(o)}, ${o.cupom ?? null}, ${status}, ${msgId},
       case when ${status}::text = 'publicada' then now() end)
    returning id`;
  return Number(r.id);
}

export async function buscarPostagem(id: number): Promise<Postagem | null> {
  const [r] = await sql()`select * from promo.postagens where id = ${id}`;
  return r ? paraPostagem(r) : null;
}

export type ResultadoPublicar =
  | { ok: true; link: string; postagem: Postagem }
  | { ok: false; motivo: "sem_canal" | "ja_tratada" };

// Marca como publicada antes de enviar (dois toques no botão não publicam duas vezes)
// e volta para pendente se o Telegram recusar.
export async function publicarPostagem(id: number, cfg: Config): Promise<ResultadoPublicar> {
  const canal = numeroOuNulo(cfg.canal_id);
  if (canal == null) return { ok: false, motivo: "sem_canal" };
  const [r] = await sql()`
    update promo.postagens set status = 'publicada', publicado_em = now()
    where id = ${id} and status = 'pendente' returning *`;
  if (!r) return { ok: false, motivo: "ja_tratada" };
  const p = paraPostagem(r);
  try {
    const m = await enviarOferta(canal, ofertaDe(p), tecladoCanal(ofertaDe(p)));
    await sql()`update promo.postagens set telegram_msg_id = ${m.message_id} where id = ${id}`;
    return { ok: true, link: linkMensagem(canal, cfg.canal_usuario, m.message_id), postagem: p };
  } catch (e) {
    await sql()`update promo.postagens set status = 'pendente', publicado_em = null where id = ${id}`;
    throw e;
  }
}

export async function descartarPostagem(id: number): Promise<Postagem | null> {
  const [r] = await sql()`
    update promo.postagens set status = 'descartada' where id = ${id} and status = 'pendente' returning *`;
  return r ? paraPostagem(r) : null;
}

// Texto curto (até 200 caracteres) do botão "Por que essa?".
export async function explicarPostagem(id: number): Promise<string> {
  const [r] = await sql()`
    select s.preco, s.desconto, p.nota, p.vendas, h.pontos, h.minimo, h.mediana
    from promo.postagens s
    left join promo.produtos p on p.id = s.produto_id
    left join lateral promo.historico(s.produto_id, 30) h on s.produto_id is not null
    where s.id = ${id}`;
  if (!r) return "Não achei essa oferta.";
  const preco = numeroOuNulo(r.preco);
  const minimo = numeroOuNulo(r.minimo);
  const mediana = numeroOuNulo(r.mediana);
  const pontos = Number(r.pontos ?? 0);
  const partes: string[] = [];
  if (r.desconto) partes.push(`-${r.desconto}% anunciado pela loja`);
  if (pontos >= 3 && mediana != null && preco != null) {
    partes.push(`${reais(preco)} contra ${reais(mediana)} de preço típico em 30 dias`);
    if (minimo != null && preco <= minimo) partes.push("menor preço que já vi");
  } else {
    partes.push("produto novo para mim, ainda sem histórico de preço");
  }
  if (r.nota != null) partes.push(`nota ${Number(r.nota).toLocaleString("pt-BR")}`);
  if (r.vendas != null) partes.push(`${Number(r.vendas).toLocaleString("pt-BR")} vendas`);
  return partes.join(" · ").slice(0, 200);
}

// Ciclo de busca, chamado pelo pg_cron a cada 5 minutos:
// procura ofertas nas lojas com API, guarda o histórico de preço, escolhe as melhores e
// manda para você aprovar (modo revisão) ou publica direto no canal (modo automático).
import { type Config, evento, gravarConfig, lerConfig, numeroOuNulo, segredo, sql } from "../_shared/db.ts";
import { avaliar, type Avaliacao, emSilencio, regrasDe } from "../_shared/filtro.ts";
import { FONTES } from "../_shared/fontes/index.ts";
import type { Achado, Fonte } from "../_shared/fontes/tipos.ts";
import type { Oferta } from "../_shared/formatar.ts";
import { criarPostagem } from "../_shared/postagens.ts";
import { igual, mensagem } from "../_shared/seguranca.ts";
import {
  enviarOferta,
  garantirWebhook,
  linkMensagem,
  semToken,
  tecladoAvisoAdmin,
  tecladoCanal,
  tecladoRevisao,
  temToken,
} from "../_shared/telegram.ts";

export async function tratarRequisicao(req: Request, fontes: Fonte[] = FONTES): Promise<Response> {
  if (req.method !== "POST") return new Response("Método não permitido", { status: 405 });
  if (!igual(req.headers.get("x-promo-segredo") ?? "", await segredo())) {
    return new Response("Não autorizado", { status: 401 });
  }
  try {
    return Response.json(await ciclo(fontes));
  } catch (e) {
    const erro = semToken(mensagem(e)).slice(0, 500);
    await evento("erro_ciclo", { erro });
    return Response.json({ ok: false, erro }, { status: 500 });
  }
}

async function ciclo(fontes: Fonte[]) {
  // Trava simples: um ciclo por vez (uma trava esquecida vence em 4 minutos).
  const [trava] = await sql()`
    update promo.config set valor = to_jsonb(now()), atualizado_em = now()
    where chave = 'ciclo_trava'
      and (valor = 'null'::jsonb or (valor #>> '{}')::timestamptz < now() - interval '4 minutes')
    returning chave`;
  if (!trava) return { ok: true, pulado: "outro ciclo em andamento" };
  try {
    return await rodar(fontes);
  } finally {
    await sql()`update promo.config set valor = 'null'::jsonb where chave = 'ciclo_trava'`;
  }
}

type Aprovado = { a: Achado; produtoId: number; av: Avaliacao };

async function rodar(todas: Fonte[]) {
  const cfg = await lerConfig();
  const resumo: Record<string, unknown> = { ok: true };

  if (temToken()) {
    try {
      if ((await garantirWebhook()).mudou) resumo.webhook = "registrado";
    } catch (e) {
      await evento("erro_webhook", { erro: semToken(mensagem(e)).slice(0, 500) });
    }
  }
  await limpezaDiaria();

  if (cfg.pausado === true) return await fechar({ ...resumo, pausado: true });
  const fontes = todas.filter((f) => f.ativa());
  resumo.fontes = fontes.map((f) => f.loja);
  if (!fontes.length) return await fechar(resumo);

  const termos = await proximosTermos(cfg);
  resumo.termos = termos;
  const achados: Achado[] = [];
  for (const f of fontes) {
    for (const t of termos) {
      try {
        achados.push(...await f.buscar(t));
      } catch (e) {
        await evento("erro_fonte", { loja: f.loja, termo: t, erro: semToken(mensagem(e)).slice(0, 500) });
      }
    }
  }
  resumo.achados = achados.length;

  const regras = regrasDe(cfg);
  const diasRepostar = numeroOuNulo(cfg.repostar_apos_dias) ?? 3;
  const vistos = new Set<string>();
  const aprovados: Aprovado[] = [];
  for (const a of achados) {
    const chave = `${a.loja}:${a.idExterno}`;
    if (vistos.has(chave)) continue;
    vistos.add(chave);
    const [r] = await sql()`
      select * from promo.registrar_achado(
        ${a.loja}, ${a.idExterno}, ${a.titulo}, ${a.url}, ${a.linkAfiliado}, ${a.imagem}, ${a.categoria},
        ${a.nota}, ${a.vendas}, ${a.preco}, ${a.precoOriginal}, 30, ${diasRepostar})`;
    if (r.r_recente || !a.linkAfiliado) continue;
    const av = avaliar(
      { preco: a.preco, precoOriginal: a.precoOriginal, nota: a.nota, vendas: a.vendas },
      { pontos: Number(r.r_pontos), minimo: numeroOuNulo(r.r_minimo), mediana: numeroOuNulo(r.r_mediana) },
      regras,
    );
    if (av.ok) aprovados.push({ a, produtoId: Number(r.r_produto), av });
  }
  aprovados.sort((x, y) => y.av.pontuacao - x.av.pontuacao);
  resumo.aprovados = aprovados.length;
  if (!aprovados.length) return await fechar(resumo);

  if (emSilencio(new Date(), cfg.silencio as { inicio: number; fim: number } | null)) {
    return await fechar({ ...resumo, silencio: true });
  }

  const [{ n: naUltimaHora }] = await sql()`
    select count(*)::int as n from promo.postagens where origem = 'auto' and criado_em > now() - interval '1 hour'`;
  const porCiclo = numeroOuNulo(cfg.max_por_ciclo) ?? 2;
  const porHora = numeroOuNulo(cfg.max_posts_hora) ?? 6;
  const vagas = Math.max(0, Math.min(porCiclo, porHora - naUltimaHora));

  const admin = numeroOuNulo(cfg.admin_id);
  const canal = numeroOuNulo(cfg.canal_id);
  const automatico = cfg.modo === "automatico" && canal != null;
  if (!automatico && admin == null) return await fechar({ ...resumo, aviso: "sem administrador para revisar" });

  let enviados = 0;
  for (const { a, produtoId } of aprovados.slice(0, vagas)) {
    const oferta: Oferta = {
      loja: a.loja,
      titulo: a.titulo,
      link: a.linkAfiliado!,
      preco: a.preco,
      precoDe: a.precoOriginal,
      imagem: a.imagem,
    };
    try {
      if (automatico) {
        const m = await enviarOferta(canal!, oferta, tecladoCanal(oferta));
        await criarPostagem(oferta, "auto", produtoId, "publicada", m.message_id);
        if (admin != null) {
          const link = linkMensagem(canal!, cfg.canal_usuario, m.message_id);
          await enviarOferta(admin, oferta, tecladoAvisoAdmin(oferta, link), { disable_notification: true }).catch(() => {});
        }
      } else {
        const id = await criarPostagem(oferta, "auto", produtoId, "pendente");
        await enviarOferta(admin!, oferta, tecladoRevisao(id, oferta, true));
      }
      enviados++;
    } catch (e) {
      await evento("erro_envio", { loja: a.loja, id: a.idExterno, erro: semToken(mensagem(e)).slice(0, 500) });
    }
  }
  return await fechar({ ...resumo, enviados, modo: automatico ? "automatico" : "revisao" });
}

async function fechar(resumo: Record<string, unknown>) {
  await evento("ciclo", resumo);
  return resumo;
}

// Gira pela lista de buscas: cada ciclo pega os próximos termos.
async function proximosTermos(cfg: Config): Promise<string[]> {
  const lista = Array.isArray(cfg.buscas) ? cfg.buscas.map(String).filter(Boolean) : [];
  if (!lista.length) return [];
  const quantos = Math.max(1, Math.min(5, numeroOuNulo(cfg.buscas_por_ciclo) ?? 1, lista.length));
  const inicio = (numeroOuNulo(cfg.cursor_buscas) ?? 0) % lista.length;
  const termos = Array.from({ length: quantos }, (_, i) => lista[(inicio + i) % lista.length]);
  await gravarConfig("cursor_buscas", (inicio + quantos) % lista.length);
  return termos;
}

// Uma vez por dia: apaga o que ficou velho para o banco não crescer à toa.
async function limpezaDiaria() {
  const [hoje] = await sql()`
    update promo.config set valor = to_jsonb(current_date), atualizado_em = now()
    where chave = 'limpeza' and valor is distinct from to_jsonb(current_date) returning chave`;
  if (!hoje) return;
  await sql()`delete from promo.eventos where em < now() - interval '30 days'`;
  await sql()`delete from promo.precos where em < now() - interval '120 days'`;
  await sql()`update promo.postagens set status = 'descartada' where status = 'pendente' and criado_em < now() - interval '3 days'`;
  await sql()`
    delete from promo.produtos p where p.ultima_vez < now() - interval '120 days'
      and not exists (select 1 from promo.postagens s where s.produto_id = p.id)`;
}

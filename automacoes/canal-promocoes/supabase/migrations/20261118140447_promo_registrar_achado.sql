-- Canal de promoções: registro de cada produto achado (um ida e volta ao banco por produto).
insert into promo.config (chave, valor) values
  ('ciclo_trava', 'null'),
  ('limpeza', 'null'),
  ('buscas_por_ciclo', '1'),
  ('webhook_marca', 'null'),
  ('bot_usuario', 'null'),
  ('canal_usuario', 'null'),
  ('canal_tipo', 'null'),
  ('admin_nome', 'null')
on conflict (chave) do nothing;

-- Atualiza o produto, lê o histórico de preço (antes de gravar o preço de agora, para a oferta
-- ser comparada com o passado), grava o ponto de preço e diz se ele já foi postado há pouco.
create or replace function promo.registrar_achado (
  p_loja text, p_id_externo text, p_titulo text, p_url text, p_link_afiliado text, p_imagem text,
  p_categoria text, p_nota numeric, p_vendas integer, p_preco numeric, p_preco_original numeric,
  p_dias_historico integer default 30, p_dias_repostar integer default 3)
returns table (r_produto bigint, r_pontos integer, r_minimo numeric, r_mediana numeric, r_recente boolean)
language plpgsql set search_path = '' as $$
begin
  insert into promo.produtos as p (loja, id_externo, titulo, url, link_afiliado, imagem, categoria, nota, vendas)
  values (p_loja, p_id_externo, left(p_titulo, 500), p_url, p_link_afiliado, p_imagem, p_categoria, p_nota, p_vendas)
  on conflict (loja, id_externo) do update set
    titulo = excluded.titulo,
    url = coalesce(excluded.url, p.url),
    link_afiliado = coalesce(excluded.link_afiliado, p.link_afiliado),
    imagem = coalesce(excluded.imagem, p.imagem),
    categoria = coalesce(excluded.categoria, p.categoria),
    nota = coalesce(excluded.nota, p.nota),
    vendas = coalesce(excluded.vendas, p.vendas),
    ultima_vez = now()
  returning p.id into r_produto;

  select h.pontos, h.minimo, h.mediana into r_pontos, r_minimo, r_mediana
  from promo.historico(r_produto, p_dias_historico) h;

  -- Um ponto por mudança de preço (ou um por dia, se o preço ficar parado).
  insert into promo.precos (produto_id, preco, preco_original)
  select r_produto, p_preco, p_preco_original
  where not exists (
    select 1 from promo.precos x
    where x.produto_id = r_produto and x.preco = p_preco and x.em > now() - interval '20 hours');

  r_recente := exists (
    select 1 from promo.postagens s
    where s.produto_id = r_produto and s.status in ('pendente', 'publicada')
      and s.criado_em > now() - make_interval(days => p_dias_repostar));
  return next;
end $$;

revoke all on function promo.registrar_achado (
  text, text, text, text, text, text, text, numeric, integer, numeric, numeric, integer, integer
) from public, anon, authenticated;

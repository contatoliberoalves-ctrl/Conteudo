-- Controle da sala pelo professor: os horários saem do relógio do servidor.
create or replace function public.aovivo_agora() returns timestamptz language sql stable set search_path = public as $$ select now() $$;
grant execute on function public.aovivo_agora() to anon, authenticated;

create or replace function public.aovivo_controlar(p_sala uuid, p_acao text, p_indice int default null)
returns json language plpgsql security definer set search_path = public as $$
declare s public.aovivo_salas; q public.aovivo_perguntas;
begin
  if not public.aovivo_is_admin() then raise exception 'sem_permissao'; end if;
  select * into s from public.aovivo_salas where id = p_sala for update;
  if not found then raise exception 'sala_nao_encontrada'; end if;
  if p_acao = 'ir' then
    select * into q from public.aovivo_perguntas where aula_id = s.aula_id order by ordem, id offset greatest(p_indice,0) limit 1;
    if not found then raise exception 'pergunta_nao_encontrada'; end if;
    update public.aovivo_salas set status = 'ativa', indice = p_indice, pergunta_id = q.id, fase = 'aguardando',
      aberta_em = null, prazo_em = null where id = p_sala;
  elsif p_acao = 'abrir' then
    select * into q from public.aovivo_perguntas where id = s.pergunta_id;
    update public.aovivo_salas set fase = 'aberta', aberta_em = now(),
      prazo_em = case when coalesce(q.tempo,0) > 0 then now() + make_interval(secs => q.tempo) end where id = p_sala;
  elsif p_acao = 'mais_tempo' then
    update public.aovivo_salas set prazo_em = greatest(coalesce(prazo_em, now()), now()) + interval '15 seconds' where id = p_sala and fase = 'aberta';
  elsif p_acao = 'fechar' then
    update public.aovivo_salas set fase = 'fechada', prazo_em = least(coalesce(prazo_em, now()), now()) where id = p_sala and fase = 'aberta';
  elsif p_acao in ('revelada','ranking') then
    update public.aovivo_salas set fase = p_acao where id = p_sala;
  elsif p_acao = 'lobby' then
    update public.aovivo_salas set status = 'lobby', indice = -1, pergunta_id = null, fase = 'aguardando', aberta_em = null, prazo_em = null where id = p_sala;
  elsif p_acao = 'encerrar' then
    update public.aovivo_salas set status = 'encerrada', fase = 'ranking', encerrada_em = now() where id = p_sala;
  elsif p_acao = 'reabrir' then
    update public.aovivo_salas set status = 'ativa', encerrada_em = null where id = p_sala;
  else
    raise exception 'acao_invalida';
  end if;
  select * into s from public.aovivo_salas where id = p_sala;
  return row_to_json(s);
end $$;
revoke all on function public.aovivo_controlar(uuid, text, int) from public, anon;
grant execute on function public.aovivo_controlar(uuid, text, int) to authenticated;

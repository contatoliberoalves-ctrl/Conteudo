-- Jogos da Ordem: Seccional do aluno, vinheta de convocação e Disputa das Seccionais.
alter table public.aovivo_participantes add column if not exists seccional text;
alter table public.aovivo_aulas add column if not exists vinheta boolean not null default true;
alter table public.aovivo_salas add column if not exists vinheta boolean not null default true;

drop function if exists public.aovivo_entrar(text, text, text);
create or replace function public.aovivo_entrar(p_codigo text, p_nome text, p_email text, p_seccional text default null)
returns json language plpgsql security definer set search_path = public as $$
declare s public.aovivo_salas; p public.aovivo_participantes; e text := lower(trim(p_email)); n text := trim(p_nome);
  sec text := upper(left(trim(coalesce(p_seccional, '')), 2));
begin
  select * into s from public.aovivo_salas where codigo = upper(trim(p_codigo));
  if not found then raise exception 'sala_nao_encontrada'; end if;
  if s.status = 'encerrada' then raise exception 'sala_encerrada'; end if;
  if length(n) < 2 then raise exception 'nome_invalido'; end if;
  if e !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'email_invalido'; end if;
  if s.exigir_lista and not exists(select 1 from public.aovivo_alunos where email = e) then
    raise exception 'email_nao_cadastrado';
  end if;
  insert into public.aovivo_participantes(sala_id, nome, email, seccional) values (s.id, left(n, 60), e, nullif(sec, ''))
  on conflict (sala_id, email) do update set nome = excluded.nome, seccional = coalesce(excluded.seccional, aovivo_participantes.seccional)
  returning * into p;
  return json_build_object('token', p.token, 'nome', p.nome, 'sala', s.codigo, 'seccional', p.seccional, 'vinheta', s.vinheta, 'titulo', s.titulo);
end $$;
grant execute on function public.aovivo_entrar(text, text, text, text) to anon, authenticated;

create or replace function public.aovivo_estado(p_codigo text, p_token uuid)
returns json language plpgsql stable security definer set search_path = public as $$
declare s public.aovivo_salas; p public.aovivo_participantes; q public.aovivo_perguntas; r public.aovivo_respostas;
  revelado boolean; pos int; tot int; nresp int; top json; res json; secs json;
begin
  select * into s from public.aovivo_salas where codigo = upper(trim(p_codigo));
  if not found then raise exception 'sala_nao_encontrada'; end if;
  select * into p from public.aovivo_participantes where token = p_token and sala_id = s.id;
  if not found then raise exception 'participante_invalido'; end if;
  revelado := s.fase in ('revelada','ranking');
  select count(*) into tot from public.aovivo_participantes where sala_id = s.id;
  select 1 + count(*) into pos from public.aovivo_participantes where sala_id = s.id and pontos > p.pontos;
  if s.pergunta_id is not null then
    select * into q from public.aovivo_perguntas where id = s.pergunta_id;
    select * into r from public.aovivo_respostas where sala_id = s.id and pergunta_id = s.pergunta_id and participante_id = p.id;
    select count(*) into nresp from public.aovivo_respostas where sala_id = s.id and pergunta_id = s.pergunta_id;
  end if;
  if s.fase = 'ranking' or s.status = 'encerrada' then
    select coalesce(json_agg(t), '[]') into top from (
      select nome, pontos, acertos, seccional from public.aovivo_participantes where sala_id = s.id
      order by pontos desc, criado_em limit 10) t;
    select coalesce(json_agg(t), '[]') into secs from (
      select seccional, round(avg(pontos))::int as media, count(*) as n from public.aovivo_participantes
      where sala_id = s.id and seccional is not null group by seccional order by avg(pontos) desc limit 5) t;
  end if;
  if s.status = 'encerrada' then
    select json_build_object('respondidas', count(*), 'certas', count(*) filter (where fracao >= 1),
      'media', coalesce(sum(fracao), 0) / greatest(s.total, 1)) into res
    from public.aovivo_respostas where sala_id = s.id and participante_id = p.id;
  end if;
  return json_build_object(
    'sala', json_build_object('codigo', s.codigo, 'titulo', s.titulo, 'modo', s.modo, 'status', s.status, 'fase', s.fase,
      'indice', s.indice, 'total', s.total, 'permitir_indice', s.permitir_indice, 'vinheta', s.vinheta, 'prazo_em', s.prazo_em, 'aberta_em', s.aberta_em, 'agora', now()),
    'eu', json_build_object('nome', p.nome, 'seccional', p.seccional, 'pontos', p.pontos, 'acertos', p.acertos, 'sequencia', p.sequencia,
      'melhor_sequencia', p.melhor_sequencia, 'posicao', pos, 'participantes', tot),
    'pergunta', case when q.id is null then null else json_build_object('id', q.id, 'tipo', q.tipo, 'titulo', q.titulo,
      'conteudo', q.conteudo, 'tempo', q.tempo, 'pontos', q.pontos,
      'gabarito', case when revelado then q.gabarito else null end) end,
    'minha', case when r.id is null then null else json_build_object('resposta', r.resposta,
      'fracao', case when revelado then r.fracao end, 'pontos', case when revelado then r.pontos end) end,
    'respostas', coalesce(nresp, 0),
    'ranking', top,
    'seccionais', secs,
    'resumo', res);
end $$;

-- Arena VDE · aulas ao vivo. Tudo com prefixo aovivo_ para não se misturar às outras plataformas.

create table if not exists public.aovivo_admins (email text primary key);
insert into public.aovivo_admins(email) values ('contatoliberoalves@gmail.com') on conflict do nothing;

create or replace function public.aovivo_is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.aovivo_admins where email = lower(coalesce(auth.jwt()->>'email','')));
$$;

create table if not exists public.aovivo_aulas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text default '',
  modo text not null default 'misto',          -- quiz | raciocinio | peca | artigo | misto
  permitir_indice boolean not null default true,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists public.aovivo_perguntas (
  id uuid primary key default gen_random_uuid(),
  aula_id uuid not null references public.aovivo_aulas(id) on delete cascade,
  ordem int not null default 0,
  tipo text not null,                           -- ce | multipla | multi | ordenar | artigo | texto | etapas
  titulo text default '',
  conteudo jsonb not null default '{}',         -- o que o aluno vê
  gabarito jsonb not null default '{}',         -- só o professor vê até revelar
  tempo int not null default 60,
  pontos int not null default 1000
);
create index if not exists aovivo_perguntas_aula on public.aovivo_perguntas(aula_id, ordem);

create table if not exists public.aovivo_salas (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  aula_id uuid not null references public.aovivo_aulas(id) on delete cascade,
  titulo text not null default '',
  modo text not null default 'misto',
  permitir_indice boolean not null default true,
  exigir_lista boolean not null default false,
  status text not null default 'lobby',         -- lobby | ativa | encerrada
  pergunta_id uuid references public.aovivo_perguntas(id) on delete set null,
  indice int not null default -1,
  total int not null default 0,
  fase text not null default 'aguardando',      -- aguardando | aberta | fechada | revelada | ranking
  aberta_em timestamptz,
  prazo_em timestamptz,
  criado_em timestamptz not null default now(),
  encerrada_em timestamptz
);

create table if not exists public.aovivo_participantes (
  id uuid primary key default gen_random_uuid(),
  sala_id uuid not null references public.aovivo_salas(id) on delete cascade,
  nome text not null,
  email text not null,
  token uuid not null default gen_random_uuid(),
  pontos int not null default 0,
  acertos int not null default 0,
  sequencia int not null default 0,
  melhor_sequencia int not null default 0,
  criado_em timestamptz not null default now(),
  unique (sala_id, email)
);

create table if not exists public.aovivo_respostas (
  id uuid primary key default gen_random_uuid(),
  sala_id uuid not null references public.aovivo_salas(id) on delete cascade,
  pergunta_id uuid not null references public.aovivo_perguntas(id) on delete cascade,
  participante_id uuid not null references public.aovivo_participantes(id) on delete cascade,
  resposta jsonb not null,
  ms int not null default 0,
  fracao numeric,
  pontos int,
  enviada_em timestamptz not null default now(),
  unique (sala_id, pergunta_id, participante_id)
);
create index if not exists aovivo_respostas_sala on public.aovivo_respostas(sala_id, pergunta_id);

create table if not exists public.aovivo_alunos (   -- e-mails cadastrados no VDE (opcional)
  email text primary key,
  nome text default ''
);

alter table public.aovivo_admins enable row level security;
alter table public.aovivo_aulas enable row level security;
alter table public.aovivo_perguntas enable row level security;
alter table public.aovivo_salas enable row level security;
alter table public.aovivo_participantes enable row level security;
alter table public.aovivo_respostas enable row level security;
alter table public.aovivo_alunos enable row level security;

create policy aovivo_admins_adm on public.aovivo_admins for select to authenticated using (public.aovivo_is_admin());
create policy aovivo_aulas_adm on public.aovivo_aulas for all to authenticated using (public.aovivo_is_admin()) with check (public.aovivo_is_admin());
create policy aovivo_perguntas_adm on public.aovivo_perguntas for all to authenticated using (public.aovivo_is_admin()) with check (public.aovivo_is_admin());
create policy aovivo_salas_adm on public.aovivo_salas for all to authenticated using (public.aovivo_is_admin()) with check (public.aovivo_is_admin());
create policy aovivo_salas_ler on public.aovivo_salas for select to anon, authenticated using (true);
create policy aovivo_part_adm on public.aovivo_participantes for all to authenticated using (public.aovivo_is_admin()) with check (public.aovivo_is_admin());
create policy aovivo_resp_adm on public.aovivo_respostas for all to authenticated using (public.aovivo_is_admin()) with check (public.aovivo_is_admin());
create policy aovivo_alunos_adm on public.aovivo_alunos for all to authenticated using (public.aovivo_is_admin()) with check (public.aovivo_is_admin());

-- Realtime: a sala avisa todo mundo; respostas e participantes chegam só ao professor (RLS).
do $$ begin
  begin alter publication supabase_realtime add table public.aovivo_salas; exception when others then null; end;
  begin alter publication supabase_realtime add table public.aovivo_respostas; exception when others then null; end;
  begin alter publication supabase_realtime add table public.aovivo_participantes; exception when others then null; end;
end $$;

-- ---------- Funções do aluno (sem login) ----------

create or replace function public.aovivo_entrar(p_codigo text, p_nome text, p_email text)
returns json language plpgsql security definer set search_path = public as $$
declare s public.aovivo_salas; p public.aovivo_participantes; e text := lower(trim(p_email)); n text := trim(p_nome);
begin
  select * into s from public.aovivo_salas where codigo = upper(trim(p_codigo));
  if not found then raise exception 'sala_nao_encontrada'; end if;
  if s.status = 'encerrada' then raise exception 'sala_encerrada'; end if;
  if length(n) < 2 then raise exception 'nome_invalido'; end if;
  if e !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'email_invalido'; end if;
  if s.exigir_lista and not exists(select 1 from public.aovivo_alunos where email = e) then
    raise exception 'email_nao_cadastrado';
  end if;
  insert into public.aovivo_participantes(sala_id, nome, email) values (s.id, left(n, 60), e)
  on conflict (sala_id, email) do update set nome = excluded.nome
  returning * into p;
  return json_build_object('token', p.token, 'nome', p.nome, 'sala', s.codigo);
end $$;

create or replace function public.aovivo_estado(p_codigo text, p_token uuid)
returns json language plpgsql stable security definer set search_path = public as $$
declare s public.aovivo_salas; p public.aovivo_participantes; q public.aovivo_perguntas; r public.aovivo_respostas;
  revelado boolean; pos int; tot int; nresp int; top json; res json;
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
      select nome, pontos, acertos from public.aovivo_participantes where sala_id = s.id
      order by pontos desc, criado_em limit 10) t;
  end if;
  if s.status = 'encerrada' then
    select json_build_object('respondidas', count(*), 'certas', count(*) filter (where fracao >= 1),
      'media', coalesce(sum(fracao), 0) / greatest(s.total, 1)) into res
    from public.aovivo_respostas where sala_id = s.id and participante_id = p.id;
  end if;
  return json_build_object(
    'sala', json_build_object('codigo', s.codigo, 'titulo', s.titulo, 'modo', s.modo, 'status', s.status, 'fase', s.fase,
      'indice', s.indice, 'total', s.total, 'permitir_indice', s.permitir_indice, 'prazo_em', s.prazo_em, 'aberta_em', s.aberta_em, 'agora', now()),
    'eu', json_build_object('nome', p.nome, 'pontos', p.pontos, 'acertos', p.acertos, 'sequencia', p.sequencia,
      'melhor_sequencia', p.melhor_sequencia, 'posicao', pos, 'participantes', tot),
    'pergunta', case when q.id is null then null else json_build_object('id', q.id, 'tipo', q.tipo, 'titulo', q.titulo,
      'conteudo', q.conteudo, 'tempo', q.tempo, 'pontos', q.pontos,
      'gabarito', case when revelado then q.gabarito else null end) end,
    'minha', case when r.id is null then null else json_build_object('resposta', r.resposta,
      'fracao', case when revelado then r.fracao end, 'pontos', case when revelado then r.pontos end) end,
    'respostas', coalesce(nresp, 0),
    'ranking', top,
    'resumo', res);
end $$;

create or replace function public.aovivo_responder(p_codigo text, p_token uuid, p_pergunta uuid, p_resposta jsonb)
returns json language plpgsql security definer set search_path = public as $$
declare s public.aovivo_salas; p public.aovivo_participantes;
begin
  select * into s from public.aovivo_salas where codigo = upper(trim(p_codigo));
  if not found then raise exception 'sala_nao_encontrada'; end if;
  select * into p from public.aovivo_participantes where token = p_token and sala_id = s.id;
  if not found then raise exception 'participante_invalido'; end if;
  if s.fase <> 'aberta' or s.pergunta_id is distinct from p_pergunta then raise exception 'pergunta_fechada'; end if;
  if s.prazo_em is not null and now() > s.prazo_em + interval '3 seconds' then raise exception 'tempo_esgotado'; end if;
  if pg_column_size(p_resposta) > 20000 then raise exception 'resposta_grande'; end if;
  insert into public.aovivo_respostas(sala_id, pergunta_id, participante_id, resposta, ms)
  values (s.id, p_pergunta, p.id, p_resposta, greatest(0, (extract(epoch from (now() - coalesce(s.aberta_em, now()))) * 1000)::int))
  on conflict (sala_id, pergunta_id, participante_id) do nothing;
  return json_build_object('ok', true);
end $$;

-- ---------- Funções do professor ----------

-- grava a correção calculada no painel: p_notas = [{participante_id, fracao, pontos}]
create or replace function public.aovivo_aplicar_correcao(p_sala uuid, p_pergunta uuid, p_notas jsonb)
returns void language plpgsql security definer set search_path = public as $$
declare n jsonb; ja boolean;
begin
  if not public.aovivo_is_admin() then raise exception 'sem_permissao'; end if;
  select exists(select 1 from public.aovivo_respostas where sala_id = p_sala and pergunta_id = p_pergunta and pontos is not null) into ja;
  if ja then  -- desfaz a correção anterior (revelar de novo não soma em dobro)
    update public.aovivo_participantes pa set pontos = pa.pontos - coalesce(r.pontos,0),
      acertos = pa.acertos - (case when r.fracao >= 1 then 1 else 0 end)
    from public.aovivo_respostas r where r.participante_id = pa.id and r.sala_id = p_sala and r.pergunta_id = p_pergunta and r.pontos is not null;
  end if;
  for n in select * from jsonb_array_elements(p_notas) loop
    update public.aovivo_respostas set fracao = (n->>'fracao')::numeric, pontos = (n->>'pontos')::int
    where sala_id = p_sala and pergunta_id = p_pergunta and participante_id = (n->>'participante_id')::uuid;
  end loop;
  update public.aovivo_participantes pa set
    pontos = pa.pontos + coalesce(r.pontos, 0),
    acertos = pa.acertos + (case when r.fracao >= 1 then 1 else 0 end),
    sequencia = case when ja then pa.sequencia when r.fracao >= 1 then pa.sequencia + 1 else 0 end,
    melhor_sequencia = greatest(pa.melhor_sequencia, case when not ja and r.fracao >= 1 then pa.sequencia + 1 else 0 end)
  from (select pa2.id, rr.pontos, rr.fracao from public.aovivo_participantes pa2
        left join public.aovivo_respostas rr on rr.participante_id = pa2.id and rr.sala_id = p_sala and rr.pergunta_id = p_pergunta
        where pa2.sala_id = p_sala) r
  where pa.id = r.id;
end $$;

revoke all on function public.aovivo_aplicar_correcao(uuid, uuid, jsonb) from anon;
grant execute on function public.aovivo_entrar(text, text, text) to anon, authenticated;
grant execute on function public.aovivo_estado(text, uuid) to anon, authenticated;
grant execute on function public.aovivo_responder(text, uuid, uuid, jsonb) to anon, authenticated;
grant execute on function public.aovivo_aplicar_correcao(uuid, uuid, jsonb) to authenticated;

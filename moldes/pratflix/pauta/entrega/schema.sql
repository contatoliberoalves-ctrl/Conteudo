-- Pauta · esquema sugerido no Supabase (Postgres). Rode no SQL Editor.

-- Opção A (mais simples): um documento JSON por usuário, igual ao localStorage "pauta.v2".
create table if not exists pauta_estado (
  user_id uuid primary key references auth.users(id) on delete cascade,
  estado jsonb not null,
  atualizado_em timestamptz not null default now()
);
alter table pauta_estado enable row level security;
create policy "dono lê" on pauta_estado for select using (auth.uid() = user_id);
create policy "dono grava" on pauta_estado for insert with check (auth.uid() = user_id);
create policy "dono atualiza" on pauta_estado for update using (auth.uid() = user_id);

-- Opção B (normalizada): contas, peças e métricas em tabelas próprias.
create table if not exists pauta_contas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cor text not null default '#1D5BF0',
  perfil jsonb not null,            -- nome, marca, arroba, cidade, areas, principal, freq, dias, video, tom, inicio...
  identidade jsonb not null default '{"paleta":"marca","fonte":"figtree"}',
  tarefas jsonb not null default '{}',
  favoritas text[] not null default '{}',
  missoes jsonb not null default '{}',
  flags jsonb not null default '{}',
  nivel_visto int not null default 0,
  conq_vistas text[] not null default '{}',
  criado_em timestamptz not null default now()
);
create table if not exists pauta_posts (
  id uuid primary key default gen_random_uuid(),
  conta_id uuid not null references pauta_contas(id) on delete cascade,
  data date not null,
  semana int not null,
  formato text not null,            -- carrossel, reels, reels-texto, post, stories, live, youtube
  pilar text not null,
  area text not null,
  ideia text not null,
  titulo text not null,
  status text not null default 'ideia', -- ideia, roteiro, producao, edicao, agendado, publicado
  roteiro text default '',
  legenda text default '',
  notas text default '',
  checklist int[] not null default '{}',
  versoes jsonb not null default '[]',
  alcance int, curtidas int, salvos int, compart int,
  instagram_media_id text,          -- para ligar à Graph API
  atualizado_em timestamptz not null default now()
);
create index if not exists pauta_posts_conta_data on pauta_posts(conta_id, data);
create table if not exists pauta_metricas (
  conta_id uuid not null references pauta_contas(id) on delete cascade,
  data date not null,
  seguidores int, alcance int, salvos int, compart int, visitas int, mensagens int,
  primary key (conta_id, data)
);
alter table pauta_contas enable row level security;
alter table pauta_posts enable row level security;
alter table pauta_metricas enable row level security;
create policy "dono das contas" on pauta_contas for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "dono dos posts" on pauta_posts for all using (exists (select 1 from pauta_contas c where c.id = conta_id and c.user_id = auth.uid())) with check (exists (select 1 from pauta_contas c where c.id = conta_id and c.user_id = auth.uid()));
create policy "dono das métricas" on pauta_metricas for all using (exists (select 1 from pauta_contas c where c.id = conta_id and c.user_id = auth.uid())) with check (exists (select 1 from pauta_contas c where c.id = conta_id and c.user_id = auth.uid()));

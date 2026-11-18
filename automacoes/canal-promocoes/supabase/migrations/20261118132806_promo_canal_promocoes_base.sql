-- Canal de promoções: robô que coleta ofertas, filtra desconto real e publica no Telegram.
-- Tudo fica no schema "promo", fora da API pública (só as Edge Functions acessam, pela conexão direta).

create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

create schema if not exists promo;
revoke all on schema promo from public, anon, authenticated;

create table promo.config (
  chave text primary key,
  valor jsonb not null,
  atualizado_em timestamptz not null default now()
);

create table promo.produtos (
  id bigint generated always as identity primary key,
  loja text not null check (loja in ('shopee', 'aliexpress', 'mercadolivre', 'amazon', 'magalu', 'kabum', 'outra')),
  id_externo text not null,
  titulo text not null,
  url text,
  link_afiliado text,
  imagem text,
  categoria text,
  nota numeric(4, 2),
  vendas integer,
  primeira_vez timestamptz not null default now(),
  ultima_vez timestamptz not null default now(),
  unique (loja, id_externo)
);

-- Histórico de preços: base para descobrir desconto real (e barrar o "metade do dobro").
create table promo.precos (
  id bigint generated always as identity primary key,
  produto_id bigint not null references promo.produtos (id) on delete cascade,
  em timestamptz not null default now(),
  preco numeric(12, 2) not null check (preco > 0),
  preco_original numeric(12, 2)
);
create index precos_produto_em on promo.precos (produto_id, em desc);

create table promo.postagens (
  id bigint generated always as identity primary key,
  produto_id bigint references promo.produtos (id) on delete set null,
  origem text not null check (origem in ('auto', 'manual')),
  loja text not null,
  titulo text not null,
  link text not null,
  imagem text,
  preco numeric(12, 2),
  preco_de numeric(12, 2),
  desconto integer,
  cupom text,
  status text not null default 'pendente' check (status in ('pendente', 'publicada', 'descartada')),
  telegram_msg_id bigint,
  criado_em timestamptz not null default now(),
  publicado_em timestamptz
);
create index postagens_status on promo.postagens (status, criado_em desc);
create index postagens_produto on promo.postagens (produto_id, publicado_em desc);

-- Registro de ciclos e erros, para diagnóstico.
create table promo.eventos (
  id bigint generated always as identity primary key,
  em timestamptz not null default now(),
  tipo text not null,
  detalhe jsonb
);
create index eventos_em on promo.eventos (em desc);

alter table promo.config enable row level security;
alter table promo.produtos enable row level security;
alter table promo.precos enable row level security;
alter table promo.postagens enable row level security;
alter table promo.eventos enable row level security;

-- Mínimo, mediana e número de pontos do preço nos últimos N dias.
create or replace function promo.historico (p_produto bigint, p_dias integer default 30)
returns table (pontos integer, minimo numeric, mediana numeric)
language sql
stable
set search_path = ''
as $$
  select count(*)::integer,
         min(p.preco),
         (percentile_cont(0.5) within group (order by p.preco))::numeric
  from promo.precos p
  where p.produto_id = p_produto
    and p.em > now() - make_interval(days => p_dias);
$$;
revoke all on function promo.historico (bigint, integer) from public, anon, authenticated;

-- Configuração inicial (ajustável pelo bot com comandos).
insert into promo.config (chave, valor) values
  ('modo', '"revisao"'),
  ('pausado', 'false'),
  ('desconto_minimo', '30'),
  ('desconto_minimo_sem_historico', '40'),
  ('queda_vs_mediana', '10'),
  ('preco_minimo', '15'),
  ('preco_maximo', '5000'),
  ('nota_minima', '4.5'),
  ('vendas_minimas', '30'),
  ('max_posts_hora', '6'),
  ('max_por_ciclo', '2'),
  ('silencio', '{"inicio": 23, "fim": 7}'),
  ('repostar_apos_dias', '3'),
  ('codigo_admin', to_jsonb('PROMO-' || upper(substr(encode(extensions.gen_random_bytes(6), 'hex'), 1, 6)))),
  ('admin_id', 'null'),
  ('canal_id', 'null'),
  ('canal_titulo', 'null'),
  ('canal_pendente', 'null'),
  ('cursor_buscas', '0'),
  ('buscas', '["fone bluetooth", "smartwatch", "air fryer", "carregador turbo", "power bank", "caixa de som bluetooth", "mouse sem fio", "teclado mecânico", "garrafa térmica", "jogo de panelas", "mochila", "tênis masculino", "tênis feminino", "relógio", "perfume", "maquiagem", "skincare", "aspirador robô", "liquidificador", "cafeteira", "lâmpada inteligente", "câmera de segurança wifi", "ssd", "pendrive", "cabo usb c", "suporte celular", "ring light", "organizador", "jogo de cama", "toalha de banho", "brinquedo", "lego", "furadeira", "jogo de chaves", "fita led", "umidificador", "ventilador", "secador de cabelo", "prancha de cabelo", "barbeador elétrico"]');

-- Segredo que protege as funções do robô (gerado aqui, guardado no Vault).
select vault.create_secret(encode(extensions.gen_random_bytes(24), 'hex'), 'promo_segredo', 'Canal de promoções: protege promo-ciclo e o webhook do Telegram');

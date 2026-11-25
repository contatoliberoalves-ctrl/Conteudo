-- Canal de promoções: "no PIX" e as regras do cupom/frete ("R$300 OFF acima de R$2699") no post.
alter table promo.postagens add column if not exists pix boolean not null default false;
alter table promo.postagens add column if not exists detalhes text[];

-- Canal de promoções: chama o ciclo de busca a cada 5 minutos. O segredo é lido do Vault na hora
-- (não fica gravado no texto do agendamento).
-- No repositório (público) o endereço do projeto aparece como <ref-do-projeto>: troque pelo id do seu.
select cron.schedule(
  'promo-ciclo',
  '*/5 * * * *',
  $$
  select net.http_post(
    url := 'https://<ref-do-projeto>.supabase.co/functions/v1/promo-bot',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-promo-segredo', (select decrypted_secret from vault.decrypted_secrets where name = 'promo_segredo')
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 55000
  );
  $$
);

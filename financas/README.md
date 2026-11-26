# Casa & Cartórios

Painel financeiro pessoal (casal) e dos dois cartórios. É uma página única (`index.html`) publicada como Artifact privado:
https://claude.ai/artifact/Mezp5WMFxdHpCEmBoUvkvf

- O repositório é público: aqui fica **só o código**. Nomes, valores e lançamentos ficam no banco da página (capacidade `db`), nunca no git.
- Coleções do banco: `config/geral` (nomes, divisão padrão, regime dos cartórios), `config/openfinance` (estado da conexão), `contas` (contas e cartões), `fixas` (contas fixas), `lanc` (lançamentos) e `metas`. Espaços: `casa`, `c1`, `c2`.
- Compra parcelada: cada parcela é um documento de `lanc` com `parc: "2/6"`, `grp` (o mesmo em todas as parcelas da compra) e `d0` (data da compra, usada para achar a fatura de cada parcela). Lançamentos antigos sem `grp`/`d0` continuam valendo.
- A divisão do casal fica gravada como percentual em cada lançamento (`div`); mudar o padrão em Ajustes vale só para os próximos.
- A página confere cada documento ao ler (valor em texto, data vazia, mapa ausente) e lista em Lançamentos os que estão sem data ou sem painel válido.
- Categorias próprias ficam em `config/geral`: `catsExtra: {casa:{desp:[],rec:[]}, cart:{desp:[[nome, grupo]], rec:[]}}` (grupo `rep`, `ded`, `nd` ou `ret`) e `catsOcultas: [nomes]`. As categorias que vêm com a página não mudam de nome (os cálculos dependem delas), só podem ser ocultadas.
- A Visão geral abre com o bloco "Hoje" (sempre pela data real); cada cartório tem as abas Mês (lista de fechamento), Livro caixa e Histórico; lançamento novo usa a folha rápida (`rapido`), edição usa o formulário completo.
- Para atualizar: edite `index.html` e publique com o Artifact tool usando `url` acima e `capabilities: {db: {}, downloads: true, assets: {}}`.
- Anexos (boleto, comprovante): arquivos enviados pela página com a capacidade `assets`; o lançamento guarda `anexos: [{id, nome, tipo}]` e a conta fixa guarda `anexosMes: {<mês>: [...]}`.

## Open Finance (Meu Pluggy)

O plano gratuito do Meu Pluggy cobre uso pessoal: até 5 bancos do mesmo titular, atualização diária. A página não acessa bancos; quem sincroniza é o Claude, numa sessão em nuvem:

1. O dono guarda as chaves como variáveis do ambiente do Claude Code (nunca no git nem no chat): `PLUGGY_CLIENT_ID`, `PLUGGY_CLIENT_SECRET` e `PLUGGY_ITEM_IDS` (Item IDs separados por vírgula).
2. Quando ele pedir para **sincronizar o Open Finance**: `python3 financas/sync_pluggy.py --saida <pasta do scratchpad>`. O script grava um JSON por conta do banco em `<pasta>/of_inbox/` e o `openfinance.json`.
3. Grave no banco da página com `ArtifactData`: cada `of_inbox/<accountId>.json` como documento da coleção `of_inbox` (`set` com `file_path`; leia a coleção antes para passar o `if_version` dos que já existem) e `openfinance.json` em `config/openfinance`.
4. Na página, em Conexões, o dono vincula cada conta do banco a um painel e classifica (ou ignora) os lançamentos. Os ignorados ficam em `config/ofignorados`.

Os arquivos gerados têm dados bancários: ficam só no scratchpad, nunca no repositório.

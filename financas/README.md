# Casa & Cartórios

Painel financeiro pessoal (casal) e dos dois cartórios. É uma página única (`index.html`) publicada como Artifact privado:
https://claude.ai/artifact/Mezp5WMFxdHpCEmBoUvkvf

- O repositório é público: aqui fica **só o código**. Nomes, valores e lançamentos ficam no banco da página (capacidade `db`), nunca no git.
- Coleções do banco: `config/geral` (nomes, divisão padrão, regime dos cartórios), `config/openfinance` (estado da conexão), `contas` (contas e cartões), `fixas` (contas fixas), `lanc` (lançamentos) e `metas`. Espaços: `casa`, `c1`, `c2`.
- Para atualizar: edite `index.html` e publique com o Artifact tool usando `url` acima e `capabilities: {db: {}, downloads: true}`.
- Open Finance ainda não está ligado. A página importa extratos OFX/CSV; lançamentos vindos de conexão entram com `rev: false` e aparecem em "Para classificar".

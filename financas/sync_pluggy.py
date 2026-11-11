#!/usr/bin/env python3
"""Baixa contas e lançamentos do Open Finance (Meu Pluggy) e prepara os documentos da coleção
`of_inbox` do painel Casa & Cartórios (um documento por conta do banco).

As chaves vêm de variáveis de ambiente, nunca do repositório nem do chat:
  PLUGGY_CLIENT_ID, PLUGGY_CLIENT_SECRET  (aplicação criada em dashboard.pluggy.ai)
  PLUGGY_ITEM_IDS                         (Item IDs separados por vírgula, um por banco conectado)

Uso:  python3 sync_pluggy.py --saida <pasta fora do git> [--dias 90]
Gera <pasta>/of_inbox/<accountId>.json e <pasta>/openfinance.json (documento config/openfinance).
Quem grava no banco da página é o Claude, com ArtifactData (ver README.md).
"""
import argparse, datetime as dt, json, os, pathlib, sys
import requests

API = 'https://api.pluggy.ai'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--saida', required=True)
    ap.add_argument('--dias', type=int, default=90)
    a = ap.parse_args()
    cid, sec = os.environ.get('PLUGGY_CLIENT_ID'), os.environ.get('PLUGGY_CLIENT_SECRET')
    itens = [x.strip() for x in os.environ.get('PLUGGY_ITEM_IDS', '').split(',') if x.strip()]
    if not (cid and sec and itens):
        sys.exit('Faltam as variáveis PLUGGY_CLIENT_ID, PLUGGY_CLIENT_SECRET ou PLUGGY_ITEM_IDS no ambiente.')
    r = requests.post(f'{API}/auth', json={'clientId': cid, 'clientSecret': sec}, timeout=30)
    if r.status_code != 200:
        sys.exit(f'O Pluggy recusou as chaves (HTTP {r.status_code}). Confira o Client ID e o Client Secret.')
    s = requests.Session()
    s.headers['X-API-KEY'] = r.json()['apiKey']

    def get(caminho, **params):
        r = s.get(f'{API}{caminho}', params=params, timeout=60)
        if r.status_code != 200:
            sys.exit(f'Erro do Pluggy em {caminho}: HTTP {r.status_code} {r.text[:200]}')
        return r.json()

    saida = pathlib.Path(a.saida)
    (saida / 'of_inbox').mkdir(parents=True, exist_ok=True)
    desde = (dt.date.today() - dt.timedelta(days=a.dias)).isoformat()
    resumo = []
    for item in itens:
        info = get(f'/items/{item}')
        banco = (info.get('connector') or {}).get('name', '')
        for c in get('/accounts', itemId=item).get('results', []):
            cartao = c.get('type') == 'CREDIT'
            txs, params = [], {'accountId': c['id'], 'dateFrom': desde}
            while True:
                pag = get('/v2/transactions', **params)
                txs += pag.get('results', [])
                prox = pag.get('next')
                if not prox:
                    break
                # `next` vem como query string ou cursor da página seguinte
                params = dict(p.split('=', 1) for p in prox.lstrip('?').split('&')) if '=' in str(prox) else {**params, 'after': prox}
            itens_doc = []
            for t in txs:
                v = float(t.get('amount') or 0)
                if not v:
                    continue
                # conta: negativo é saída; cartão: positivo é compra
                despesa = v > 0 if cartao else v < 0
                itens_doc.append({'id': t['id'], 'data': str(t.get('date', ''))[:10], 'valor': round(abs(v), 2),
                                  'tipo': 'desp' if despesa else 'rec', 'desc': (t.get('description') or 'Sem descrição')[:120],
                                  'catBanco': t.get('category') or ''})
            itens_doc.sort(key=lambda x: x['data'], reverse=True)
            cd = c.get('creditData') or {}
            doc = {'nome': f"{banco} · {c.get('marketingName') or c.get('name') or ''}".strip(' ·'), 'banco': banco,
                   'tipo': 'cartao' if cartao else 'conta', 'final': str(c.get('number') or '')[-4:],
                   'saldo': round(float(c.get('balance') or 0), 2), 'limite': cd.get('creditLimit'),
                   'atualizado': dt.datetime.now().strftime('%d/%m/%Y %H:%M'), 'desde': desde, 'itens': itens_doc}
            (saida / 'of_inbox' / f"{c['id']}.json").write_text(json.dumps(doc, ensure_ascii=False))
            resumo.append({'id': c['id'], 'nome': doc['nome'], 'banco': banco, 'n': len(itens_doc)})
    (saida / 'openfinance.json').write_text(json.dumps(
        {'status': 'ativo', 'ultima': dt.datetime.now().strftime('%d/%m/%Y %H:%M'), 'contas': [{'nome': x['nome'], 'banco': x['banco']} for x in resumo]},
        ensure_ascii=False))
    for x in resumo:
        print(f"{x['id']}  {x['n']:4d} lançamentos  {x['nome']}")


if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""Baixa contas e lançamentos do Open Finance (Meu Pluggy) e prepara os documentos da coleção
`of_inbox` do painel Casa & Cartórios (um documento por conta do banco).

As chaves vêm de variáveis de ambiente, nunca do repositório nem do chat:
  PLUGGY_CLIENT_ID, PLUGGY_CLIENT_SECRET  (aplicação criada em dashboard.pluggy.ai)
  PLUGGY_ITEM_IDS                         (Item IDs separados por vírgula, um por banco conectado)

Uso:  python3 sync_pluggy.py --saida <pasta fora do git> [--dias 90]
Gera <pasta>/of_inbox/<accountId>.json e <pasta>/openfinance.json (documento config/openfinance).
Quem grava no banco da página é o Claude, com ArtifactData (ver README.md).

As mensagens de erro nunca mostram as chaves, o token nem o corpo da resposta de /auth.
"""
import argparse, datetime as dt, json, os, pathlib, re, sys, time
from urllib.parse import parse_qsl

import requests

API = 'https://api.pluggy.ai'
BRT = dt.timezone(dt.timedelta(hours=-3))  # horário de Brasília (sem horário de verão)
MAX_PAGINAS = 200  # 500 lançamentos por página; trava de segurança contra cursor que não anda


def data_local(iso):
    """Data do lançamento no fuso do Brasil. O Pluggy manda ISO 8601 em UTC; meia-noite exata em UTC
    é tratada como data sem hora (se fosse convertida, cairia no dia anterior)."""
    s = str(iso or '')
    try:
        d = dt.datetime.fromisoformat(s.replace('Z', '+00:00'))
    except ValueError:
        return s[:10] if re.match(r'\d{4}-\d\d-\d\d', s) else ''
    if d.tzinfo is None or (d.utcoffset() == dt.timedelta(0) and (d.hour, d.minute, d.second) == (0, 0, 0)):
        return d.date().isoformat()
    return d.astimezone(BRT).date().isoformat()


def num(v):
    try:
        return float(v or 0)
    except (TypeError, ValueError):
        return 0.0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--saida', required=True)
    ap.add_argument('--dias', type=int, default=90)
    a = ap.parse_args()
    cid, sec = os.environ.get('PLUGGY_CLIENT_ID'), os.environ.get('PLUGGY_CLIENT_SECRET')
    itens = [x.strip() for x in os.environ.get('PLUGGY_ITEM_IDS', '').split(',') if x.strip()]
    if not (cid and sec and itens):
        sys.exit('Faltam as variáveis PLUGGY_CLIENT_ID, PLUGGY_CLIENT_SECRET ou PLUGGY_ITEM_IDS no ambiente.')
    try:
        r = requests.post(f'{API}/auth', json={'clientId': cid, 'clientSecret': sec}, timeout=30)
    except requests.RequestException as e:
        sys.exit(f'Não foi possível falar com o Pluggy ({type(e).__name__}). Confira a rede e tente de novo.')
    if r.status_code != 200:
        sys.exit(f'O Pluggy recusou as chaves (HTTP {r.status_code}). Confira o Client ID e o Client Secret.')
    try:
        chave = r.json()['apiKey']
    except (ValueError, KeyError, TypeError):
        sys.exit('O Pluggy respondeu ao login sem a chave de acesso. Tente de novo em instantes.')
    s = requests.Session()
    s.headers['X-API-KEY'] = chave

    def get(caminho, params=None):
        """GET com até 4 tentativas em erro de rede, 429 e 5xx. Em erro, mostra só o status e a
        mensagem curta do Pluggy (nunca cabeçalhos nem parâmetros)."""
        rotulo = caminho.split('/')[1] if '/' in caminho else caminho  # sem o Item ID
        for tentativa in range(4):
            try:
                r = s.get(f'{API}{caminho}', params=params, timeout=60)
            except requests.RequestException as e:
                if tentativa == 3:
                    sys.exit(f'Sem resposta do Pluggy em /{rotulo} ({type(e).__name__}).')
                time.sleep(2 ** tentativa)
                continue
            if r.status_code == 200:
                try:
                    return r.json()
                except ValueError:
                    sys.exit(f'Resposta do Pluggy em /{rotulo} não é JSON.')
            if r.status_code in (429, 500, 502, 503, 504) and tentativa < 3:
                try:
                    espera = min(30.0, float(r.headers.get('Retry-After', '')))
                except ValueError:
                    espera = 2 ** tentativa
                time.sleep(espera)
                continue
            try:
                msg = str(r.json().get('message', ''))[:160]
            except (ValueError, AttributeError):
                msg = ''
            sys.exit(f'Erro do Pluggy em /{rotulo}: HTTP {r.status_code} {msg}'.rstrip())

    saida = pathlib.Path(a.saida)
    (saida / 'of_inbox').mkdir(parents=True, exist_ok=True)
    desde = (dt.date.today() - dt.timedelta(days=max(1, a.dias))).isoformat()
    agora = dt.datetime.now(BRT).strftime('%d/%m/%Y %H:%M')
    resumo = []
    for item in itens:
        info = get(f'/items/{item}')
        banco = (info.get('connector') or {}).get('name', '')
        if info.get('status') not in (None, 'UPDATED'):
            print(f"Aviso: {banco or 'um banco'} está com status {info.get('status')}; os dados podem estar desatualizados "
                  '(reabra a conexão no Meu Pluggy se continuar assim).', file=sys.stderr)
        for c in get('/accounts', {'itemId': item}).get('results', []):
            cartao = c.get('type') == 'CREDIT'
            # /v2/transactions pagina por cursor: `next` é a query string pronta da página seguinte
            # (já codificada), ou null no fim.
            txs, params, vistos = [], {'accountId': c['id'], 'dateFrom': desde}, set()
            for _ in range(MAX_PAGINAS):
                pag = get('/v2/transactions', params)
                txs += pag.get('results') or []
                prox = pag.get('next')
                if not prox or prox in vistos:
                    break
                vistos.add(prox)
                prox = str(prox)
                # parse_qsl decodifica; o requests codifica de novo (sem isso o cursor iria codificado duas vezes)
                params = dict(parse_qsl(prox.split('?', 1)[-1], keep_blank_values=True)) if '=' in prox else {**params, 'after': prox}
                params.setdefault('accountId', c['id'])
            else:
                print(f"Aviso: {c.get('name') or 'conta'} passou de {MAX_PAGINAS} páginas; o período foi cortado.", file=sys.stderr)
            itens_doc, ids = [], set()
            for t in txs:
                v = num(t.get('amount'))
                if not v or not t.get('id') or t['id'] in ids:
                    continue
                # Em conta, PENDING é agendamento ou bloqueio (pode mudar ou sumir). Em cartão, PENDING é
                # a compra da fatura aberta, que interessa.
                if not cartao and t.get('status') == 'PENDING':
                    continue
                ids.add(t['id'])
                # O campo `type` (DEBIT = saída, CREDIT = entrada) é o que vale. Sem ele, usa o sinal:
                # em conta, negativo é saída; em cartão, positivo é compra.
                tipo = t.get('type')
                despesa = tipo == 'DEBIT' if tipo in ('DEBIT', 'CREDIT') else (v > 0 if cartao else v < 0)
                itens_doc.append({'id': t['id'], 'data': data_local(t.get('date')), 'valor': round(abs(v), 2),
                                  'tipo': 'desp' if despesa else 'rec', 'desc': (t.get('description') or 'Sem descrição')[:120],
                                  'catBanco': t.get('category') or ''})
            itens_doc.sort(key=lambda x: x['data'], reverse=True)
            cd = c.get('creditData') or {}
            doc = {'nome': f"{banco} · {c.get('marketingName') or c.get('name') or ''}".strip(' ·'), 'banco': banco,
                   'tipo': 'cartao' if cartao else 'conta', 'final': str(c.get('number') or '')[-4:],
                   'saldo': round(num(c.get('balance')), 2), 'limite': cd.get('creditLimit'),
                   'atualizado': agora, 'desde': desde, 'itens': itens_doc}
            nome_arq = re.sub(r'[^A-Za-z0-9_-]', '_', str(c['id']))
            (saida / 'of_inbox' / f'{nome_arq}.json').write_text(json.dumps(doc, ensure_ascii=False), encoding='utf-8')
            resumo.append({'id': c['id'], 'nome': doc['nome'], 'banco': banco, 'n': len(itens_doc)})
    (saida / 'openfinance.json').write_text(json.dumps(
        {'status': 'ativo', 'ultima': agora, 'contas': [{'nome': x['nome'], 'banco': x['banco']} for x in resumo]},
        ensure_ascii=False), encoding='utf-8')
    for x in resumo:
        print(f"{x['id']}  {x['n']:4d} lançamentos  {x['nome']}")


if __name__ == '__main__':
    main()

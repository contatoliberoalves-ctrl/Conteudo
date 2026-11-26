#!/usr/bin/env python3
"""Portão do nexo: confere a tabela de passagem de uma parte ANTES de qualquer gasto.

Uso: python3 conferir_passagem.py passagem.json      (sai 1 se achar furo)
     python3 conferir_passagem.py --teste

passagem.json:
{"personagens": ["A", "B"], "objetos": ["carteira marrom"],
 "cenas": [{"n": 1, "lugar": "cozinha",
            "comeca":  {"personagens": {"A": "em pé na mesa", "B": "fora"},
                        "objetos": {"carteira marrom": "dentro da mochila"}},
            "termina": {...mesmo formato...},
            "movimentos": [{"quem": "B", "plano": 3, "como": "entra pela porta, da direita"}],
            "trocas": [{"objeto": "carteira marrom", "plano": 1, "como": "A tira da mochila"}],
            "passagem_visivel": ""}]}

Regras: o COMEÇA da cena N é igual ao TERMINA da N-1; quem muda de lugar ou de estado
dentro da cena tem movimento com plano; objeto que muda de dono ou de lugar tem troca
com plano; lugar novo pede passagem_visivel.
"""
import json
import sys


def conferir(t):
    furos = []
    pers, objs, ant = t["personagens"], t["objetos"], None
    for c in t["cenas"]:
        n = c["n"]
        for ponta in ("comeca", "termina"):
            for grupo, nomes in (("personagens", pers), ("objetos", objs)):
                for nome in nomes:
                    if not c[ponta].get(grupo, {}).get(nome):
                        furos.append(f"cena {n}, {ponta}: falta dizer onde está '{nome}'")
        if ant:
            for grupo in ("personagens", "objetos"):
                for nome, antes in ant["termina"].get(grupo, {}).items():
                    agora = c["comeca"].get(grupo, {}).get(nome)
                    if agora and agora != antes:
                        furos.append(f"cena {ant['n']} → {n}: '{nome}' terminou \"{antes}\" e começa \"{agora}\" (mudou fora da tela)")
            if c["lugar"] != ant["lugar"] and not c.get("passagem_visivel"):
                furos.append(f"cena {ant['n']} → {n}: lugar muda de {ant['lugar']} pra {c['lugar']} sem passagem visível")
        moveu = {m["quem"] for m in c.get("movimentos", []) if m.get("plano") and m.get("como")}
        trocou = {x["objeto"] for x in c.get("trocas", []) if x.get("plano") and x.get("como")}
        for nome in pers:
            a, b = c["comeca"].get("personagens", {}).get(nome), c["termina"].get("personagens", {}).get(nome)
            if a and b and a != b and nome not in moveu:
                furos.append(f"cena {n}: '{nome}' vai de \"{a}\" pra \"{b}\" sem movimento com plano")
        for nome in objs:
            a, b = c["comeca"].get("objetos", {}).get(nome), c["termina"].get("objetos", {}).get(nome)
            if a and b and a != b and nome not in trocou:
                furos.append(f"cena {n}: '{nome}' vai de \"{a}\" pra \"{b}\" sem troca com plano")
        ant = c
    return furos


def teste():
    base = {"personagens": ["A"], "objetos": ["mochila"], "cenas": [
        {"n": 1, "lugar": "cozinha", "comeca": {"personagens": {"A": "na mesa"}, "objetos": {"mochila": "na cadeira"}},
         "termina": {"personagens": {"A": "na mesa"}, "objetos": {"mochila": "na cadeira"}}},
        {"n": 2, "lugar": "cozinha", "comeca": {"personagens": {"A": "na mesa"}, "objetos": {"mochila": "na cadeira"}},
         "termina": {"personagens": {"A": "na mesa"}, "objetos": {"mochila": "na mão de A"}},
         "trocas": [{"objeto": "mochila", "plano": 1, "como": "A puxa da cadeira"}]}]}
    assert conferir(base) == [], conferir(base)
    ruim = json.loads(json.dumps(base))
    ruim["cenas"][1]["lugar"] = "quarto"                                  # lugar novo sem passagem
    ruim["cenas"][1]["comeca"]["objetos"]["mochila"] = "na cama"          # objeto se mexeu fora da tela
    ruim["cenas"][1]["trocas"] = []                                       # troca de mão sem plano
    f = conferir(ruim)
    assert len(f) == 3, f
    print("teste ok: 0 furos na tabela boa, 3 na ruim")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    if sys.argv[1] == "--teste":
        teste()
        sys.exit(0)
    furos = conferir(json.load(open(sys.argv[1], encoding="utf-8")))
    for f in furos:
        print("FURO:", f)
    print(f"{len(furos)} furo(s)" if furos else "passagem ok: nenhum furo")
    sys.exit(1 if furos else 0)

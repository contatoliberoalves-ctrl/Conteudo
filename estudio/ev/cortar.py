"""Corte automático (silêncios e hesitações) → edit/edl.json, e visão do EDL.

O automático faz o trabalho braçal. Depois o Claude lê `ev.py ver` e remove
as regravações ("deixa eu começar de novo"), erros e trechos fracos, apagando
ou ajustando trechos do edl.json. Todo corte cai entre palavras.
"""
import difflib
import re
from pathlib import Path

from .comum import carregar_estilo, gravar_json, ler_json, pasta_edit, tempo
from .transcrever import e_vicio, limpa

GATILHOS = re.compile(r"(come[çc]ar de novo|de novo|vou repetir|repetindo|corta( isso| aí)?|errei|"
                      r"pera[ií]|espera|calma|n[ãa]o,? n[ãa]o)", re.I)


def blocos(palavras, silencio_max):
    """Trechos de fala contínua (sem hesitações e sem silêncio > silencio_max)."""
    out, atual = [], []
    for w in palavras:
        if e_vicio(w["w"]):
            if atual:
                out.append(atual)
                atual = []
            continue
        if atual and w["s"] - atual[-1]["e"] > silencio_max:
            out.append(atual)
            atual = []
        atual.append(w)
    if atual:
        out.append(atual)
    return out


def auto_edl(transcricoes, estilo, fontes_ordem):
    c = dict(estilo["corte"])
    if c.get("pausa_manter"):
        c["respiro_depois"] = 0.4 * c["pausa_manter"]
        c["respiro_antes"] = 0.6 * c["pausa_manter"]
    ranges = []
    for nome in fontes_ordem:
        d = transcricoes[nome]
        ws, dur = d["palavras"], d["info"]["duracao"]
        bl = blocos(ws, c["silencio_max"])
        for i, b in enumerate(bl):
            ini = b[0]["s"] - c["respiro_antes"]
            fim = b[-1]["e"] + c["respiro_depois"]
            # nunca invadir a palavra vizinha (nem a hesitação cortada)
            idx0 = ws.index(b[0])
            idx1 = ws.index(b[-1])
            if idx0 > 0:
                ini = max(ini, (ws[idx0 - 1]["e"] + b[0]["s"]) / 2)
            if idx1 + 1 < len(ws):
                fim = min(fim, (b[-1]["e"] + ws[idx1 + 1]["s"]) / 2)
            ini, fim = max(0.0, ini), min(dur, fim)
            ranges.append({"fonte": nome, "inicio": round(ini, 3), "fim": round(fim, 3),
                           "texto": " ".join(w["w"] for w in b)})
    # junta trechos colados (corte invisível de < 60 ms não vale a pena)
    junt = []
    for r in ranges:
        if junt and junt[-1]["fonte"] == r["fonte"] and r["inicio"] - junt[-1]["fim"] < 0.06:
            junt[-1]["fim"] = r["fim"]
            junt[-1]["texto"] += " " + r["texto"]
        else:
            junt.append(r)
    marcar_suspeitos(junt)
    if estilo["zoom"]["alternar"]:
        alternar_zoom(junt, estilo["zoom"]["fator"], estilo["zoom"].get("intervalo_min", 0))
    return junt


def marcar_suspeitos(ranges):
    """Marca prováveis regravações: frase com gatilho ou repetida logo adiante."""
    norm = [" ".join(limpa(x) for x in r["texto"].split()) for r in ranges]
    for i, r in enumerate(ranges):
        r.pop("suspeita", None)
        if GATILHOS.search(r["texto"]):
            r["suspeita"] = "gatilho de regravação"
            continue
        a = norm[i].split()[:8]
        for j in range(i + 1, min(i + 4, len(ranges))):
            b = norm[j].split()[:8]
            if len(a) >= 3 and difflib.SequenceMatcher(None, a, b).ratio() > 0.6:
                r["suspeita"] = f"repetida no trecho {j + 1} (fica a última, em geral)"
                break


def alternar_zoom(ranges, fator, intervalo_min=0.0):
    """Punch-in alternado (ex.: 100% ↔ 112%): o jump cut parece troca de câmera.
    Só em corte DENTRO da mesma tomada; troca de fonte volta a 100%; no máximo uma
    troca a cada `intervalo_min` segundos (senão o vídeo "pula")."""
    z, desde, t = 1.0, 1e9, 0.0
    for i, r in enumerate(ranges):
        mesmo = i > 0 and ranges[i - 1]["fonte"] == r["fonte"]
        if not mesmo:
            z, desde = 1.0, 1e9
        elif r["inicio"] - ranges[i - 1]["fim"] > 0.25 and desde >= intervalo_min:
            z, desde = (fator if z == 1.0 else 1.0), 0.0
        r["zoom"] = z
        d = r["fim"] - r["inicio"]
        desde += d
        t += d


def total(edl):
    return sum(r["fim"] - r["inicio"] for r in edl["trechos"])


def main(args):
    estilo = carregar_estilo(args.estilo)
    edit = pasta_edit(args.pasta)
    trs = {p.stem: ler_json(p) for p in sorted((edit / "transcricoes").glob("*.json"))}
    if not trs:
        raise SystemExit("rode antes: ev.py transcrever <vídeos>")
    ordem = args.fontes.split(",") if args.fontes else sorted(trs)
    trechos = auto_edl(trs, estilo, ordem)
    edl = {"versao": 1, "estilo": args.estilo,
           "fontes": {n: trs[n]["fonte"] for n in ordem},
           "trechos": trechos, "sobreposicoes": [], "musica": None}
    destino = edit / "edl.json"
    if destino.exists() and not args.sobrescrever:
        destino = edit / "edl.auto.json"
        print("(edl.json já existe; o automático foi para edl.auto.json. Use --sobrescrever.)")
    gravar_json(destino, edl)
    bruto = sum(trs[n]["info"]["duracao"] for n in ordem)
    print(f"✓ {len(trechos)} trechos · {tempo(bruto)} → {tempo(total(edl))} "
          f"({100 * (1 - total(edl) / bruto):.0f}% cortado) → {destino}")
    sus = [i + 1 for i, r in enumerate(trechos) if r.get("suspeita")]
    if sus:
        print(f"⚠ revisar trechos {sus} (possível regravação): ev.py ver {destino}")


def ver(args):
    edl = ler_json(args.edl)
    trs = {}
    t_out = 0.0
    for i, r in enumerate(edl["trechos"], 1):
        dur = r["fim"] - r["inicio"]
        flag = f"  ⚠ {r['suspeita']}" if r.get("suspeita") else ""
        z = f" z{r['zoom']}" if r.get("zoom", 1) != 1 else ""
        print(f"{i:3d}. [{tempo(t_out)}] {r['fonte']} {r['inicio']:.2f}-{r['fim']:.2f}{z}  {r['texto']}{flag}")
        if args.palavras:
            if r["fonte"] not in trs:
                trs[r["fonte"]] = ler_json(Path(args.edl).parent / "transcricoes" / f"{r['fonte']}.json")
            ws = [w for w in trs[r["fonte"]]["palavras"] if w["e"] > r["inicio"] and w["s"] < r["fim"]]
            print("      " + " ".join(f"{w['w']}@{w['s']:.2f}" for w in ws))
        t_out += dur
    print(f"total {tempo(t_out)}")


def texto_final(args):
    """A fala no tempo do vídeo FINAL, em frases: base para capítulos, títulos, descrição e post."""
    from .legendas import palavras_saida
    from .transcrever import frases
    edl = ler_json(args.edl)
    pasta = Path(args.edl).parent
    trs = {n: ler_json(pasta / "transcricoes" / f"{n}.json") for n in edl["fontes"]}
    ws = palavras_saida(edl, trs, edl.get("correcoes", {}))
    for g in frases(ws, 0.45):
        print(f"[{tempo(g[0]['s'])}] {' '.join(w['w'] for w in g)}")

#!/usr/bin/env python3
"""Confere se um texto está dentro das faixas medidas nos textos do Líbero.

Uso: python3 conferir.py texto.md [perfil]
Perfis: oab (padrão), diario, comentario, pratica, concurso
Analisa só a prosa: ignora títulos, tabelas, listas, alternativas e artigos transcritos.
"""
import re, sys, statistics as st

PERFIS = {
    # mediana de palavras por parágrafo, mediana por frase, humor: palavras por toque (mínimo)
    "oab":        dict(par=(28, 55), frase=(18, 32), humor=1200, perguntas=2.0),
    "diario":     dict(par=(24, 45), frase=(18, 30), humor=1500, perguntas=1.0),
    "comentario": dict(par=(45, 200), frase=(20, 32), humor=6000, perguntas=1.0),
    "pratica":    dict(par=(22, 50), frase=(18, 32), humor=10**9, perguntas=0.5),
    "concurso":   dict(par=(26, 50), frase=(17, 28), humor=4000, perguntas=1.2),
}
NAO_E_DELE = [
    (r"—", "travessão longo (ele usa hífen com espaços)"),
    (r"não apenas[^.]{3,80}mas também", '"não apenas... mas também"'),
    (r"\bN[ãa]o basta\b[^.]{3,80};", '"Não basta X; é preciso Y"'),
    (r"\b(É importante|Vale|Cabe|Cumpre) destacar\b", '"destacar" (ele diz salientar, mencionar, frisar, ressaltar)'),
    (r"\bCabe ressaltar\b", '"Cabe ressaltar"'),
    (r"\b(crucial|cruciais)\b", '"crucial"'),
    (r"\bpapel (essencial|fundamental|central)\b", '"papel essencial/fundamental"'),
    (r"\b(Lembre-se|Note que|Veremos|Vimos|Pois bem|Calma)\b", "fórmula que ele não usa"),
    (r"\b(galera|pessoal,|bora|futuro advogado|futura advogada|caro leitor)\b", "vocativo ou gíria que ele não usa"),
    (r"(A lógica é simples|Em resumo|Mas atenção|E detalhe importante|E não para por aí)\s*[:!]", "dois-pontos de anúncio"),
    (r"[\U0001F300-\U0001FAFF☀-➿]", "emoji"),
]
HUMOR = r"\b(k{3,}|ksks\w*|hehe\w*|haha\w*|rsrs)\b|:\)|<3|;\(|=/|\b(treta|money|problemão|b\.o|mainha|hein)\b"
ASSINATURA = [r"de modo que", r"\bvisto que", r"\bdado que", r"\bademais\b", r"vale (salientar|recordar|mencionar)",
              r"tem-se", r"no que tange", r"em razão d", r"sendo assim|assim sendo", r"\bmister\b", r"razão pela qual",
              r"em outras palavras|traduzindo", r"\b(pode|podem|possui|é possível|deve) sim\b"]

def prosa(texto):
    out = []
    for l in texto.split("\n"):
        s = l.strip()
        plain = re.sub(r"[*_`>#]+", "", s).strip()
        if not plain or s.startswith("|") or s.startswith("#"): continue
        if re.match(r"^([-*+•]|\d+[.)])\s", s): continue
        if re.match(r"^\(?[A-Ea-e]\)\s", plain): continue
        if re.match(r"^(Art\.|§|Parágrafo único)", plain): continue
        if len(plain.split()) <= 12 and not re.search(r"[.!?:;]$", plain): continue
        if plain.isupper() and len(plain.split()) <= 12: continue  # rótulo de quadro
        out.append(plain)
    return out

def frases(p):
    p = re.sub(r"\b(Art|art|arts|nº|n|ex|Ex|inc|etc|Dr|Sr|Min|cf)\.", r"\1§", p)
    p = re.sub(r"(\d)\.(\d)", r"\1§\2", p)
    return [x for x in re.split(r"(?<=[.!?…])\s+(?=[A-ZÁÉÍÓÚÂÊÔÃÕÀ“\"(\d])", p) if x.strip()]

def main():
    if len(sys.argv) < 2: sys.exit(__doc__)
    perfil = sys.argv[2] if len(sys.argv) > 2 else "oab"
    alvo = PERFIS.get(perfil) or sys.exit(f"perfil desconhecido: {perfil}")
    bruto = open(sys.argv[1], encoding="utf-8").read()
    P = prosa(bruto)
    if not P: sys.exit("nenhum parágrafo de prosa encontrado")
    txt = "\n".join(P); W = len(txt.split())
    pw = [len(p.split()) for p in P]; F = [f for p in P for f in frases(p)]; fw = [len(f.split()) for f in F]
    fpp = [len(frases(p)) for p in P]
    avisos = []
    def faixa(nome, v, lo, hi, un=""):
        ok = lo <= v <= hi
        print(f"  {'ok ' if ok else 'FORA'} {nome}: {v:g}{un} (faixa dele: {lo:g} a {hi:g}{un})")
        if not ok: avisos.append(nome)
    print(f"Perfil: {perfil} | {W} palavras de prosa, {len(P)} parágrafos, {len(F)} frases")
    if W < 300: print("  (texto curto: as taxas por mil palavras oscilam muito; leia com cuidado)")
    faixa("palavras por parágrafo (mediana)", st.median(pw), *alvo["par"])
    faixa("palavras por frase (mediana)", st.median(fw), *alvo["frase"])
    faixa("frases por parágrafo (média)", round(st.mean(fpp), 2), 1.3, 2.4)
    faixa("parágrafos de até 15 palavras", round(100 * sum(x <= 15 for x in pw) / len(pw)), 0, 22, "%")
    faixa("vírgulas por mil palavras", round(1000 * txt.count(",") / W), 58, 98)
    faixa("exclamações por mil palavras", round(1000 * txt.count("!") / W, 2), 0, 0.25)
    faixa("perguntas por mil palavras", round(1000 * txt.count("?") / W, 2), 0, alvo["perguntas"])
    faixa("parênteses por mil palavras", round(1000 * txt.count("(") / W, 1), 4, 18)
    n_ass = sum(len(re.findall(p, txt, re.I)) for p in ASSINATURA)
    if perfil != "pratica":
        faixa("conectivos de assinatura por mil palavras", round(1000 * n_ass / W, 1), 4, 16)
    hum = re.findall(HUMOR, txt, re.I)
    if hum:
        por = W / len(hum)
        ok = por >= alvo["humor"] or (W < alvo["humor"] and len(hum) <= 1)
        print(f"  {'ok ' if ok else 'FORA'} marcas de gíria/risada: {len(hum)} (1 a cada {por:.0f} palavras; o perfil pede no máximo 1 a cada {alvo['humor']})")
        if not ok: avisos.append("gíria/risada")
    else:
        print("  ok  marcas de gíria/risada: 0")
    print("  (piada sem gíria o script não enxerga: confira à mão a tabela de dose do SKILL.md)")
    achou = False
    for pat, nome in NAO_E_DELE:
        m = re.findall(pat, bruto, re.I)
        if m:
            achou = True; avisos.append(nome)
            print(f"  FORA {nome}: {len(m)}x")
    if not achou: print("  ok  nenhuma marca da lista 'não é dele'")
    ger = len(re.findall(r", (garantindo|assegurando|reforçando|promovendo|permitindo|evidenciando) ", txt))
    faixa("gerúndio final de finalidade por mil palavras", round(1000 * ger / W, 2), 0, 0.4)
    curtos = sum(1 for a, b in zip(pw, pw[1:]) if a <= 15 and b <= 15)
    faixa("parágrafos curtos em sequência", round(100 * curtos / len(pw)), 0, 4, "%")
    print("\nResultado:", "dentro das faixas." if not avisos else f"{len(avisos)} ponto(s) a rever: " + "; ".join(dict.fromkeys(avisos)))

if __name__ == "__main__":
    main()

"""Legendas palavra a palavra (ASS, queimadas pelo libass) no tempo do vídeo final.

Animações: "destaque" (bloco de palavras, a falada muda de cor e dá um pulo:
o visual dos Reels de hoje), "palavra" (uma por vez, com pop), "frase" (bloco
inteiro, sem destaque; para aula e documentário). Também gera o .srt para
subir no YouTube/Instagram.
"""
import re

from .transcrever import e_vicio


def cor_ass(hexa, alfa=0):
    h = hexa.lstrip("#")
    return f"&H{alfa:02X}{h[4:6]}{h[2:4]}{h[0:2]}".upper()


def palavras_saida(edl, transcricoes, correcoes):
    """Palavras com tempo já no vídeo final (fim do trecho anterior = início do próximo)."""
    out, desloc = [], 0.0
    for r in edl["trechos"]:
        ws = transcricoes[r["fonte"]]["palavras"]
        for w in ws:
            if w["s"] >= r["inicio"] - 0.03 and w["e"] <= r["fim"] + 0.08 and not e_vicio(w["w"]):
                s = max(w["s"], r["inicio"]) - r["inicio"] + desloc
                e = min(w["e"], r["fim"]) - r["inicio"] + desloc
                t = w["w"]
                for de, para in correcoes.items():
                    t = re.sub(rf"\b{re.escape(de)}\b", para, t, flags=re.I)
                out.append({"w": t, "s": s, "e": max(e, s + 0.05)})
        desloc += r["fim"] - r["inicio"]
    return out


def agrupar(ws, n, max_chars, pausa=0.3, dur_min=0.35):
    """Blocos de até n palavras; quebra em pontuação e pausas; nunca pisca < dur_min."""
    blocos, atual = [], []
    for i, w in enumerate(ws):
        if atual:
            gap = w["s"] - atual[-1]["e"]
            chars = sum(len(x["w"]) + 1 for x in atual) + len(w["w"])
            fim_frase = re.search(r"[.!?:;,]$", atual[-1]["w"])
            dur = atual[-1]["e"] - atual[0]["s"]
            if (len(atual) >= n or gap >= pausa or chars > max_chars or fim_frase) and dur >= dur_min:
                blocos.append(atual)
                atual = []
        atual.append(w)
    if atual:
        blocos.append(atual)
    return blocos


def ts(t):
    t = max(t, 0)
    h, r = divmod(t, 3600)
    m, s = divmod(r, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}"


def gerar_ass(ws, estilo, largura, altura):
    L = estilo["legenda"]
    esc = min(largura, altura) / 1080      # tamanhos pensados para 1080 de largura
    tam = round(L["tamanho"] * esc)
    caixa_alta = L.get("caixa_alta", True)
    margem_v = round((1 - L["posicao_y"]) * altura)
    margem_h = round(largura * 0.08)
    cor, dest = cor_ass(L["cor"]), cor_ass(L["destaque"])
    contorno = cor_ass(L.get("contorno_cor", "#000000"))
    sombra = cor_ass(L.get("sombra_cor", "#000000"), 0x60)
    borda = 3 if L.get("fundo_caixa") else 1
    cab = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {largura}
PlayResY: {altura}
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: L,{L['fonte']},{tam},{cor},{dest},{contorno if borda == 1 else cor_ass(L.get('fundo_caixa', '#000000'), 0x30)},{sombra},0,0,0,0,100,100,{L.get('espaco', 0)},0,{borda},{round((max(L.get('contorno', 6), 14) if borda == 3 else L.get('contorno', 6)) * esc)},{round(L.get('sombra', 2) * esc)},2,{margem_h},{margem_h},{margem_v},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    linhas = []
    anim = L.get("animacao", "destaque")
    n = 1 if anim == "palavra" else L.get("palavras_por_bloco", 3)
    blocos = agrupar(ws, n, L.get("max_caracteres", 22))
    pop = L.get("pop", 1.12)

    def txt(w):
        t = w["w"].upper() if caixa_alta else w["w"]
        if L.get("sem_pontuacao", True):
            t = re.sub(r"[.,;:!?…]+$", "", t)
        return t.replace("{", "(").replace("}", ")")

    for bi, b in enumerate(blocos):
        fim_bloco = b[-1]["e"] + 0.15
        if bi + 1 < len(blocos):
            fim_bloco = min(max(b[-1]["e"], blocos[bi + 1][0]["s"] - 0.01), b[-1]["e"] + 0.6)
        if anim == "frase":
            linhas.append(f"Dialogue: 0,{ts(b[0]['s'])},{ts(fim_bloco)},L,,0,0,0,,{' '.join(txt(w) for w in b)}")
            continue
        for i, w in enumerate(b):
            ini = w["s"] if i else b[0]["s"]
            fim = b[i + 1]["s"] if i + 1 < len(b) else fim_bloco
            if fim <= ini:
                continue
            p = round(pop * 100)
            efeito = (f"{{\\fscx{p}\\fscy{p}\\t(0,90,\\fscx100\\fscy100)}}" if anim == "palavra"
                      else "")
            partes = []
            for j, x in enumerate(b):
                if j == i and anim == "destaque":
                    partes.append(f"{{\\1c{dest}\\fscx{p}\\fscy{p}\\t(0,90,\\fscx100\\fscy100)}}{txt(x)}{{\\1c{cor}}}")
                elif anim == "destaque":
                    partes.append(txt(x))
            corpo = " ".join(partes) if anim == "destaque" else efeito + txt(w)
            entrada = "{\\fad(60,0)}" if i == 0 and L.get("entrada_suave", True) else ""
            linhas.append(f"Dialogue: 0,{ts(ini)},{ts(fim)},L,,0,0,0,,{entrada}{corpo}")
    return cab + "\n".join(linhas) + "\n"


def gerar_srt(ws, max_chars=42):
    blocos = agrupar(ws, 12, max_chars, pausa=0.6, dur_min=1.0)

    def t(x):
        h, r = divmod(max(x, 0), 3600)
        m, s = divmod(r, 60)
        return f"{int(h):02d}:{int(m):02d}:{int(s):02d},{int(round((s % 1) * 1000)) % 1000:03d}"
    return "\n".join(f"{i}\n{t(b[0]['s'])} --> {t(b[-1]['e'] + 0.1)}\n{' '.join(w['w'] for w in b)}\n"
                     for i, b in enumerate(blocos, 1))

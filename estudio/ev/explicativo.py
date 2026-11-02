"""Vídeo explicativo animado e narrado (o "tipo X": tudo por código, voz clonada).

roteiro.json → narração por cena (edge-tts grátis, ElevenLabs ou a sua voz no
Chatterbox) com o tempo de cada palavra → composição HyperFrames (HTML + GSAP)
em que cada elemento entra no instante em que a voz fala dele, fundo sempre em
movimento → render → voz + trilha com ducking → -14 LUFS.

O projeto HyperFrames fica em <pasta>/edit/explicativo/: dá para abrir no
HyperFrames Studio e ajustar à mão.

Tipos de cena: titulo, lista, numero, artigo, comparacao, frase, tela, cta.
"""
import asyncio
import hashlib
import html
import json
import os
import re
import shutil
import ssl
import subprocess
import unicodedata
from pathlib import Path

from .comum import FONTES, FORMATOS, carregar_estilo, ler_json, pasta_edit, rodar, sonda

GAP = 0.35          # respiro entre cenas (s)
FIM = 1.2           # segura o último quadro


# ---------------------------------------------------------------- narração
def norm(t):
    t = unicodedata.normalize("NFD", t.lower())
    return re.sub(r"[^a-z0-9º°]", "", "".join(c for c in t if unicodedata.category(c) != "Mn"))


def edge_com_tempos(texto, voz, saida, velocidade="+0%"):
    import aiohttp
    import edge_tts

    async def go():
        kw = {}
        ca = "/root/.ccr/ca-bundle.crt"
        if os.path.exists(ca):
            kw["connector"] = aiohttp.TCPConnector(ssl=ssl.create_default_context(cafile=ca))
            kw["proxy"] = os.environ.get("HTTPS_PROXY")
        c = edge_tts.Communicate(texto, voz, rate=velocidade, boundary="WordBoundary", **kw)
        ws, audio = [], bytearray()
        async for ch in c.stream():
            if ch["type"] == "audio":
                audio.extend(ch["data"])
            elif ch["type"] == "WordBoundary":
                s = ch["offset"] / 1e7
                ws.append({"w": ch["text"], "s": round(s, 3), "e": round(s + ch["duration"] / 1e7, 3)})
        Path(saida).write_bytes(bytes(audio))
        return ws
    return asyncio.run(go())


def whisper_palavras(audio):
    import numpy as np
    from faster_whisper import WhisperModel

    from .transcrever import modelo_padrao
    nome, disp, tipo = modelo_padrao()
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", str(audio), "-ac", "1", "-ar", "16000", "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    segs, _ = WhisperModel(nome, device=disp, compute_type=tipo).transcribe(
        np.frombuffer(pcm, np.float32), language="pt", word_timestamps=True)
    return [{"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)} for s in segs for w in s.words]


def elevenlabs(texto, voz_id, saida, modelo):
    import requests
    chave = os.environ.get("ELEVENLABS_API_KEY")
    if not chave:
        raise SystemExit("defina ELEVENLABS_API_KEY no ambiente (nunca no git) ou use a voz grátis do edge-tts")
    ca = "/root/.ccr/ca-bundle.crt"
    r = requests.post(f"https://api.elevenlabs.io/v1/text-to-speech/{voz_id}?output_format=mp3_44100_128",
                      headers={"xi-api-key": chave}, json={"text": texto, "model_id": modelo},
                      timeout=180, verify=ca if os.path.exists(ca) else True)
    if r.status_code != 200:
        raise SystemExit(f"ElevenLabs: {r.status_code} {r.text[:300]}")
    Path(saida).write_bytes(r.content)


def sintetizar(texto, voz, mp3, velocidade="+0%"):
    """Gera a fala em mp3 e devolve as palavras com tempo. `voz` pode ser:
    - "pt-BR-AntonioNeural" (edge-tts, grátis)
    - {"elevenlabs": "<voice_id>", "modelo": "eleven_multilingual_v2"} (precisa de ELEVENLABS_API_KEY)
    - {"clonar": "estudio/projetos/voz/referencia-curta.wav"} (Chatterbox, local)"""
    if voz == "perfil" or (isinstance(voz, dict) and voz.get("perfil")):
        from .vozes import falar
        wav = Path(mp3).with_suffix(".wav")
        falar(texto, wav)
        rodar(["ffmpeg", "-y", "-v", "error", "-i", wav, mp3])
        return whisper_palavras(mp3)
    if isinstance(voz, dict) and voz.get("elevenlabs"):
        elevenlabs(texto, voz["elevenlabs"], mp3, voz.get("modelo", "eleven_multilingual_v2"))
        return whisper_palavras(mp3)
    if isinstance(voz, dict) and voz.get("clonar"):
        from .narrar import chatterbox
        wav = Path(mp3).with_suffix(".wav")
        chatterbox(texto, voz["clonar"], wav)
        rodar(["ffmpeg", "-y", "-v", "error", "-i", wav, mp3])
        return whisper_palavras(mp3)
    return edge_com_tempos(texto, voz, mp3, velocidade)


def narrar_cenas(roteiro, pasta):
    voz = roteiro.get("voz", "pt-BR-AntonioNeural")
    cache = pasta / "narracao"
    cache.mkdir(exist_ok=True)
    out = []
    for i, c in enumerate(roteiro["cenas"]):
        texto = c["fala"].strip()
        chave = hashlib.sha1(json.dumps([texto, voz], ensure_ascii=False).encode()).hexdigest()[:10]
        mp3, js = cache / f"{i:02d}-{chave}.mp3", cache / f"{i:02d}-{chave}.json"
        if not js.exists():
            ws = sintetizar(texto, voz, mp3, roteiro.get("velocidade", "+0%"))
            js.write_text(json.dumps(ws, ensure_ascii=False))
        out.append((mp3, json.loads(js.read_text()), sonda(mp3)["duracao"]))
        print(f"\r  narração {i + 1}/{len(roteiro['cenas'])}", end="", flush=True)
    print()
    return out


# ---------------------------------------------------------------- composição
def quando(ws, termo, padrao):
    """Instante (relativo à cena) em que a voz fala `termo` (1ª palavra significativa)."""
    if not termo:
        return padrao
    alvos = [norm(p) for p in re.split(r"\s+", str(termo)) if len(norm(p)) >= 3] or [norm(str(termo))]
    for alvo in alvos[:2]:
        for w in ws:
            nw = norm(w["w"])
            if nw and (nw == alvo or (len(alvo) >= 4 and (nw.startswith(alvo[:5]) or alvo.startswith(nw[:5]) and len(nw) >= 4))):
                return w["s"]
    return padrao


def esc(t):
    return html.escape(str(t))


def realce(t):
    """*palavra* → destaque na cor de acento."""
    return re.sub(r"\*(.+?)\*", r'<em>\1</em>', esc(t))


def palavras_realce(texto):
    """Divide em palavras mantendo o *destaque* que atravessa várias palavras."""
    out, dentro = [], False
    for p in texto.split():
        ini = p.startswith("*")
        fim = p.endswith("*") and len(p) > 1
        limpo = p.strip("*")
        dentro = dentro or ini
        out.append((limpo, f"<em>{esc(limpo)}</em>" if dentro else esc(limpo)))
        if fim:
            dentro = False
    return out


def cena_html(i, c, ws, dur, anims):
    """Devolve o HTML interno da cena e acrescenta os tweens (tempos relativos à cena) em anims."""
    tipo = c.get("tipo", "titulo")
    a = anims.append
    pid = f"c{i}"
    if tipo == "titulo":
        spans = []
        t0 = 0.15
        for j, (p, h) in enumerate(palavras_realce(c["titulo"])):
            t = max(quando(ws, p, t0 + 0.12 * j), t0 + 0.08 * j)
            spans.append(f'<span class="w" id="{pid}w{j}">{h}</span>')
            a((f"#{pid}w{j}", "from", "{opacity:0,y:70,rotate:3,duration:.45,ease:'back.out(1.6)'}", t))
        kick = f'<div class="kicker" id="{pid}k">{esc(c.get("kicker", ""))}</div>' if c.get("kicker") else ""
        sub = f'<p class="sub" id="{pid}s">{realce(c.get("sub", ""))}</p>' if c.get("sub") else ""
        if kick:
            a((f"#{pid}k", "from", "{opacity:0,x:-40,duration:.5,ease:'power3.out'}", 0.05))
        if sub:
            a((f"#{pid}s", "from", "{opacity:0,y:30,duration:.5,ease:'power3.out'}",
               quando(ws, c.get("sub_gatilho") or c.get("sub", "").strip("*"), min(dur * 0.55, 1.6))))
        return f'<div class="bloco centro">{kick}<h1 class="titulo">{" ".join(spans)}</h1>{sub}</div>'
    if tipo == "lista":
        itens = c["itens"]
        li = []
        for j, it in enumerate(itens):
            txt = it if isinstance(it, str) else it["texto"]
            gat = (it.get("gatilho") if isinstance(it, dict) else None) or txt
            base = 0.6 + j * max(0.5, (dur - 1.2) / max(len(itens), 1))
            t = quando(ws, gat, base)
            li.append(f'<li class="item" id="{pid}i{j}"><span class="num">{j + 1}</span><span>{realce(txt)}</span></li>')
            a((f"#{pid}i{j}", "from", "{opacity:0,x:80,duration:.5,ease:'power3.out'}", t))
            a((f"#{pid}i{j} .num", "from", "{scale:0,rotate:-90,duration:.5,ease:'back.out(2)'}", t + 0.05))
        a((f"#{pid}h", "from", "{opacity:0,y:-30,duration:.45,ease:'power3.out'}", 0.05))
        a((f"#{pid}bar", "from", "{scaleX:0,transformOrigin:'0 50%',duration:.6,ease:'power2.out'}", 0.2))
        return (f'<div class="bloco"><h2 id="{pid}h">{realce(c.get("titulo", ""))}</h2><div class="barra" id="{pid}bar"></div>'
                f'<ul class="lista">{"".join(li)}</ul></div>')
    if tipo == "numero":
        alvo = float(str(c["numero"]).replace(".", "").replace(",", "."))
        t = quando(ws, c.get("gatilho") or str(c["numero"]), 0.4)
        ini = max(0.1, t - 0.9)
        a((f"#{pid}n", "count", json.dumps({"de": c.get("de", 0), "ate": alvo, "pre": c.get("prefixo", ""),
                                            "suf": c.get("sufixo", ""), "dur": round(t - ini + 0.3, 2)}), ini))
        a((f"#{pid}n", "from", "{scale:.6,opacity:0,duration:.5,ease:'back.out(1.7)'}", ini))
        a((f"#{pid}r", "from", "{opacity:0,y:30,duration:.5,ease:'power3.out'}", t + 0.1))
        a((f"#{pid}ring", "from", "{scale:0,opacity:0,duration:.9,ease:'expo.out'}", t))
        return (f'<div class="bloco centro"><div class="anel" id="{pid}ring"></div>'
                f'<div class="numero" id="{pid}n">{esc(c.get("prefixo", ""))}{c.get("de", 0)}{esc(c.get("sufixo", ""))}</div>'
                f'<p class="rotulo" id="{pid}r">{realce(c.get("rotulo", ""))}</p></div>')
    if tipo == "artigo":
        texto = esc(c["texto"])
        m = c.get("destaque")
        if m and esc(m) in texto:
            texto = texto.replace(esc(m), f'<mark id="{pid}m">{esc(m)}</mark>', 1)
            a((f"#{pid}m", "to", "{backgroundSize:'100% 42%',duration:.7,ease:'power2.out'}",
               quando(ws, c.get("gatilho") or m, dur * 0.5)))
        a((f"#{pid}ref", "from", "{opacity:0,y:-40,duration:.5,ease:'back.out(1.6)'}", 0.1))
        a((f"#{pid}card", "from", "{opacity:0,y:60,rotateX:-12,duration:.6,ease:'power3.out'}", 0.25))
        return (f'<div class="bloco centro"><div class="selo" id="{pid}ref">{esc(c["ref"])}</div>'
                f'<div class="folha" id="{pid}card"><p>“{texto}”</p></div></div>')
    if tipo == "comparacao":
        e, d = c["esquerda"], c["direita"]
        te = quando(ws, e.get("gatilho") or e["titulo"], 0.3)
        td = quando(ws, d.get("gatilho") or d["titulo"], max(te + 0.8, dur * 0.45))
        a((f"#{pid}e", "from", "{opacity:0,x:-120,duration:.55,ease:'power3.out'}", te))
        a((f"#{pid}d", "from", "{opacity:0,x:120,duration:.55,ease:'power3.out'}", td))
        a((f"#{pid}vs", "from", "{scale:0,rotate:-180,duration:.6,ease:'back.out(2)'}", (te + td) / 2))

        def col(x, k):
            itens = "".join(f"<li>{realce(t)}</li>" for t in x.get("itens", []))
            return f'<div class="col {k}" id="{pid}{k}"><h3>{realce(x["titulo"])}</h3><ul>{itens}</ul></div>'
        return (f'<div class="bloco"><h2 class="topo">{realce(c.get("titulo", ""))}</h2><div class="duelo">'
                f'{col(e, "e")}<div class="vs" id="{pid}vs">VS</div>{col(d, "d")}</div></div>')
    if tipo == "frase":
        spans = []
        for j, (p, h) in enumerate(palavras_realce(c["texto"])):
            t = max(quando(ws, p, 0.2 + 0.18 * j), 0.1 + 0.05 * j)
            spans.append(f'<span class="w" id="{pid}w{j}">{h}</span>')
            a((f"#{pid}w{j}", "from", "{opacity:0,y:40,filter:'blur(8px)',duration:.4,ease:'power2.out'}", t))
        aut = f'<p class="autor" id="{pid}a">{esc(c["autor"])}</p>' if c.get("autor") else ""
        if aut:
            a((f"#{pid}a", "from", "{opacity:0,duration:.5}", dur * 0.6))
        return f'<div class="bloco centro"><div class="aspas">“</div><p class="frase">{" ".join(spans)}</p>{aut}</div>'
    if tipo == "tela":
        a((f"#{pid}tela", "from", "{opacity:0,y:80,scale:.92,duration:.7,ease:'power3.out'}", 0.1))
        a((f"#{pid}img", "to", f"{{scale:1.08,duration:{dur:.2f},ease:'none'}}", 0))
        extra = ""
        if c.get("marcar"):
            mx = c["marcar"]
            extra = (f'<div class="marca" id="{pid}mk" style="left:{mx["x"] * 100}%;top:{mx["y"] * 100}%;'
                     f'width:{mx["w"] * 100}%;height:{mx["h"] * 100}%"></div>')
            a((f"#{pid}mk", "from", "{opacity:0,scale:1.4,duration:.45,ease:'back.out(2)'}",
               quando(ws, c.get("gatilho"), dur * 0.5)))
        leg = f'<p class="legtela">{realce(c.get("legenda", ""))}</p>' if c.get("legenda") else ""
        return (f'<div class="bloco centro"><div class="janela" id="{pid}tela"><div class="barrinha"><i></i><i></i><i></i></div>'
                f'<div class="vis"><img id="{pid}img" src="assets/{esc(Path(c["imagem"]).name)}">{extra}</div></div>{leg}</div>')
    if tipo == "cta":
        a((f"#{pid}t", "from", "{opacity:0,scale:.8,duration:.55,ease:'back.out(1.7)'}", 0.1))
        a((f"#{pid}b", "from", "{opacity:0,y:40,duration:.5,ease:'power3.out'}", quando(ws, c.get("gatilho") or c.get("botao", ""), 0.8)))
        a((f"#{pid}b", "to", "{scale:1.06,duration:.45,yoyo:true,repeat:5,ease:'sine.inOut'}", 1.4))
        a((f"#{pid}h", "from", "{opacity:0,duration:.5}", 1.0))
        return (f'<div class="bloco centro"><h1 class="titulo" id="{pid}t">{realce(c["titulo"])}</h1>'
                f'<div class="botao" id="{pid}b">{esc(c.get("botao", "Comenta aqui"))}</div>'
                f'<p class="arroba" id="{pid}h">{esc(c.get("arroba", ""))}</p></div>')
    raise SystemExit(f"tipo de cena desconhecido: {tipo}")


CSS = """
@font-face{font-family:'Titulo';src:url('assets/fonts/titulo.ttf')}
@font-face{font-family:'Corpo';src:url('assets/fonts/corpo.ttf')}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:__W__px;height:__H__px;overflow:hidden;background:var(--fundo)}
:root{--fundo:__FUNDO__;--fundo2:__FUNDO2__;--texto:__TEXTO__;--acento:__ACENTO__;--card:__CARD__;--u:__U__px}
#root{width:100%;height:100%;position:relative;font-family:'Corpo',sans-serif;color:var(--texto);overflow:hidden}
.bg{position:absolute;inset:0;background:radial-gradient(120% 90% at 50% 0%,var(--fundo2),var(--fundo) 70%)}
.blob{position:absolute;border-radius:50%;filter:blur(calc(var(--u)*90));opacity:.55}
#b1{width:calc(var(--u)*700);height:calc(var(--u)*700);background:var(--acento);left:-15%;top:-10%;opacity:.25}
#b2{width:calc(var(--u)*600);height:calc(var(--u)*600);background:var(--acento);right:-20%;bottom:-5%;opacity:.18}
.grao{position:absolute;inset:-50%;opacity:.07;background-image:radial-gradient(#fff 1px,transparent 1px);background-size:calc(var(--u)*5) calc(var(--u)*5)}
.cena{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
.inner{width:88%;display:flex;justify-content:center}
.bloco{width:100%}.centro{text-align:center;display:flex;flex-direction:column;align-items:center}
em{font-style:normal;color:var(--acento)}
.kicker{font-family:'Corpo';font-size:calc(var(--u)*36);letter-spacing:.18em;text-transform:uppercase;color:var(--acento);margin-bottom:calc(var(--u)*24)}
.titulo{font-family:'Titulo';font-size:calc(var(--u)*__TT__);line-height:.98;text-transform:__CAIXA__;letter-spacing:.01em}
.w{display:inline-block;margin-right:.18em}
.sub{font-size:calc(var(--u)*40);opacity:.85;margin-top:calc(var(--u)*30);max-width:90%}
h2{font-family:'Titulo';font-size:calc(var(--u)*86);line-height:1;text-transform:__CAIXA__}
.barra{height:calc(var(--u)*10);width:calc(var(--u)*160);background:var(--acento);border-radius:99px;margin:calc(var(--u)*26) 0 calc(var(--u)*40)}
.lista{list-style:none;display:flex;flex-direction:column;gap:calc(var(--u)*26)}
.item{display:flex;align-items:center;gap:calc(var(--u)*28);background:var(--card);border-radius:calc(var(--u)*28);padding:calc(var(--u)*30) calc(var(--u)*36);font-size:calc(var(--u)*44);font-weight:700}
.num{flex:none;width:calc(var(--u)*72);height:calc(var(--u)*72);border-radius:50%;background:var(--acento);color:var(--fundo);display:flex;align-items:center;justify-content:center;font-family:'Titulo';font-size:calc(var(--u)*44)}
.numero{font-family:'Titulo';font-size:calc(var(--u)*300);line-height:1;color:var(--acento);position:relative}
.rotulo{font-size:calc(var(--u)*52);font-weight:700;margin-top:calc(var(--u)*10)}
.anel{position:absolute;width:calc(var(--u)*620);height:calc(var(--u)*620);border:calc(var(--u)*6) solid var(--acento);border-radius:50%;opacity:.35}
.selo{background:var(--acento);color:var(--fundo);font-family:'Titulo';font-size:calc(var(--u)*64);padding:calc(var(--u)*14) calc(var(--u)*40);border-radius:99px;margin-bottom:calc(var(--u)*40)}
.folha{background:#fbfaf6;color:#1d1d1d;border-radius:calc(var(--u)*26);padding:calc(var(--u)*56);font-size:calc(var(--u)*46);line-height:1.35;text-align:left;box-shadow:0 calc(var(--u)*30) calc(var(--u)*80) rgba(0,0,0,.35)}
mark{background-image:linear-gradient(var(--acento),var(--acento));background-repeat:no-repeat;background-position:0 88%;background-size:0% 42%;background-color:transparent;color:inherit;padding:0 .1em}
.topo{text-align:center;margin-bottom:calc(var(--u)*40)}
.duelo{display:flex;gap:calc(var(--u)*24);align-items:stretch;position:relative;__DUELO__}
.col{flex:1;background:var(--card);border-radius:calc(var(--u)*28);padding:calc(var(--u)*40)}
.col h3{font-family:'Titulo';font-size:calc(var(--u)*64);text-transform:__CAIXA__;color:var(--acento);margin-bottom:calc(var(--u)*18)}
.col ul{list-style:none;font-size:calc(var(--u)*38);display:flex;flex-direction:column;gap:calc(var(--u)*14)}
.col li:before{content:'— ';color:var(--acento)}
.vs{align-self:center;flex:none;width:calc(var(--u)*120);height:calc(var(--u)*120);border-radius:50%;background:var(--acento);color:var(--fundo);display:flex;align-items:center;justify-content:center;font-family:'Titulo';font-size:calc(var(--u)*52)}
.aspas{font-family:'Titulo';font-size:calc(var(--u)*240);line-height:.6;color:var(--acento)}
.frase{font-family:'Titulo';font-size:calc(var(--u)*__TF__);line-height:1.05;text-transform:__CAIXA__}
.autor{margin-top:calc(var(--u)*30);font-size:calc(var(--u)*36);opacity:.8}
.janela{width:100%;background:#fff;border-radius:calc(var(--u)*24);overflow:hidden;box-shadow:0 calc(var(--u)*40) calc(var(--u)*90) rgba(0,0,0,.45)}
.barrinha{height:calc(var(--u)*44);background:#ececec;display:flex;gap:calc(var(--u)*10);align-items:center;padding-left:calc(var(--u)*18)}
.barrinha i{width:calc(var(--u)*14);height:calc(var(--u)*14);border-radius:50%;background:#c9c9c9}
.vis{position:relative;overflow:hidden}.vis img{width:100%;display:block;transform-origin:50% 40%}
.marca{position:absolute;border:calc(var(--u)*7) solid var(--acento);border-radius:calc(var(--u)*18)}
.legtela{margin-top:calc(var(--u)*30);font-size:calc(var(--u)*42);font-weight:700}
.botao{margin-top:calc(var(--u)*50);background:var(--acento);color:var(--fundo);font-family:'Titulo';font-size:calc(var(--u)*64);padding:calc(var(--u)*24) calc(var(--u)*60);border-radius:99px}
.arroba{margin-top:calc(var(--u)*36);font-size:calc(var(--u)*40);opacity:.85}
"""


def montar(roteiro, narr, estilo, W, H, proj):
    C = estilo["cartela"]
    E = estilo.get("explicativo", {})
    vertical = H > W
    u = min(W, H) / 1080 * (1.3 if vertical else 1.0)   # no vertical sobra altura: tudo maior
    (proj / "assets" / "fonts").mkdir(parents=True, exist_ok=True)
    shutil.copy(FONTES / E.get("fonte_titulo", C.get("arquivo_titulo", "BebasNeue-Regular.ttf")), proj / "assets/fonts/titulo.ttf")
    shutil.copy(FONTES / E.get("fonte_corpo", C.get("arquivo_corpo", "Poppins-Bold.ttf")), proj / "assets/fonts/corpo.ttf")
    css = CSS
    for k, v in {"__W__": W, "__H__": H, "__U__": round(u, 4), "__FUNDO__": E.get("fundo", C["fundo"]),
                 "__FUNDO2__": E.get("fundo2", C.get("fundo2", C["fundo"])), "__TEXTO__": E.get("texto", C["texto"]),
                 "__ACENTO__": E.get("acento", C["acento"]), "__CARD__": E.get("card", "rgba(255,255,255,.08)"),
                 "__TT__": 135 if vertical else 130, "__TF__": 84,
                 "__CAIXA__": "uppercase" if C.get("caixa_alta", True) else "none",
                 "__DUELO__": "flex-direction:column" if vertical else ""}.items():
        css = css.replace(k, str(v))
    cenas_html, tl = [], []
    t = 0.0
    tempos = []
    for i, (c, (mp3, ws, d)) in enumerate(zip(roteiro["cenas"], narr)):
        dur = d + GAP + (FIM if i == len(narr) - 1 else 0)
        if c.get("tipo") == "tela":
            shutil.copy(Path(roteiro["_pasta"]) / c["imagem"], proj / "assets" / Path(c["imagem"]).name)
        anims = []
        corpo = cena_html(i, c, ws, dur, anims)
        cenas_html.append(f'<div id="c{i}" class="clip cena" data-start="{t:.3f}" data-duration="{dur:.3f}" '
                          f'data-track-index="1"><div class="inner" id="c{i}in">{corpo}</div></div>')
        tl.append(f"tl.from('#c{i}in',{{opacity:0,y:50,scale:.97,duration:.45,ease:'power3.out'}},{t:.3f});")
        tl.append(f"tl.to('#c{i}in',{{scale:1.03,duration:{dur:.3f},ease:'none'}},{t:.3f});")
        if i < len(narr) - 1:
            tl.append(f"tl.to('#c{i}in',{{opacity:0,y:-40,duration:.3,ease:'power2.in'}},{t + dur - 0.3:.3f});")
        for sel, modo, props, rel in anims:
            at = t + max(0.0, min(rel, dur - 0.4))
            if modo == "count":
                p = json.loads(props)
                tl.append(f"(function(){{const o={{v:{p['de']}}},el=document.querySelector('{sel}');"
                          f"tl.to(o,{{v:{p['ate']},duration:{p['dur']},ease:'power2.out',onUpdate:()=>"
                          f"{{el.textContent='{p['pre']}'+Math.round(o.v).toLocaleString('pt-BR')+'{p['suf']}'}}}},{at:.3f});}})();")
            else:
                tl.append(f"tl.{modo}('{sel}',{props},{at:.3f});")
        tempos.append((t, dur))
        t += dur
    total = t
    voltas = max(1, int(total / 6))
    fundo_mov = (f"tl.to('#b1',{{x:{int(260 * u)},y:{int(180 * u)},duration:{total / voltas:.2f},yoyo:true,repeat:{voltas - 1},ease:'sine.inOut'}},0);"
                 f"tl.to('#b2',{{x:{int(-220 * u)},y:{int(-160 * u)},duration:{total / voltas:.2f},yoyo:true,repeat:{voltas - 1},ease:'sine.inOut'}},0);"
                 f"tl.to('.grao',{{x:{int(40 * u)},y:{int(30 * u)},duration:{total:.2f},ease:'none'}},0);")
    doc = f"""<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width={W}, height={H}">
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
<style>{css}</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{total:.3f}" data-width="{W}" data-height="{H}">
<div class="bg"></div><div class="blob" id="b1"></div><div class="blob" id="b2"></div><div class="grao"></div>
{chr(10).join(cenas_html)}
</div>
<script>
const tl = gsap.timeline({{ paused: true }});
{fundo_mov}
{chr(10).join(tl)}
window.__timelines["main"] = tl;
tl.seek(0);
</script></body></html>"""
    (proj / "index.html").write_text(doc)
    if not (proj / "hyperframes.json").exists():
        (proj / "hyperframes.json").write_text(json.dumps({"paths": {"assets": "assets"}}))
    return total, tempos


def main(args):
    rot_path = Path(args.roteiro).resolve()
    roteiro = ler_json(rot_path)
    roteiro["_pasta"] = str(rot_path.parent)
    estilo = carregar_estilo(args.estilo or roteiro.get("estilo", "padrao"))
    formato = args.formato or roteiro.get("formato", "reels")
    W, H = FORMATOS[formato]
    edit = pasta_edit(rot_path)
    proj = edit / "explicativo"
    proj.mkdir(exist_ok=True)
    narr = narrar_cenas(roteiro, edit)
    total, tempos = montar(roteiro, narr, estilo, W, H, proj)
    print(f"✓ composição {proj / 'index.html'} ({total:.1f}s, {len(tempos)} cenas)")
    if args.so_montar:
        return

    # voz: cenas em sequência com o respiro
    partes, filtro = [], []
    for i, ((mp3, _, _), (t0, _)) in enumerate(zip(narr, tempos)):
        partes += ["-i", str(mp3)]
        filtro.append(f"[{i}:a]aresample=48000,adelay={int(t0 * 1000)}:all=1[a{i}]")
    filtro.append("".join(f"[a{i}]" for i in range(len(narr))) + f"amix=inputs={len(narr)}:normalize=0,apad=whole_dur={total:.3f}[v]")
    voz = edit / "explicativo-voz.wav"
    rodar(["ffmpeg", "-y", "-v", "error", *partes, "-filter_complex", ";".join(filtro), "-map", "[v]", "-t", f"{total:.3f}", voz])

    env = dict(os.environ)
    if Path("/opt/pw-browsers/chromium").exists():
        env.setdefault("PUPPETEER_EXECUTABLE_PATH", "/opt/pw-browsers/chromium")
    video = edit / "explicativo-video.mp4"
    r = subprocess.run(["npx", "--yes", "hyperframes", "render", str(proj), "-o", str(video)] +
                       (["--quality", "draft"] if args.preview else []),
                       capture_output=True, text=True, env=env)
    if r.returncode or not video.exists():
        print(r.stdout[-2500:], r.stderr[-2500:])
        raise SystemExit("o render do HyperFrames falhou (rode `npx hyperframes check` na pasta do projeto)")

    # mix: voz + trilha com ducking, legenda opcional, -14 LUFS
    entradas = ["-i", str(video), "-i", str(voz)]
    fc = []
    a = "[1:a]"
    musica = args.musica or roteiro.get("musica")
    if musica:
        mus = str((rot_path.parent / musica).resolve()) if not Path(musica).is_absolute() else musica
        entradas += ["-stream_loop", "-1", "-i", mus]
        fc.append(f"[2:a]atrim=0:{total:.3f},volume={estilo['audio'].get('musica_db', -16)}dB,afade=t=in:d=.5,"
                  f"afade=t=out:st={total - 2:.3f}:d=2[m];[1:a]asplit[vz][sc];"
                  f"[m][sc]sidechaincompress=threshold=0.03:ratio=8:attack=15:release=350[du];"
                  f"[vz][du]amix=inputs=2:normalize=0:duration=first[mx]")
        a = "[mx]"
    lufs = estilo["audio"].get("lufs", -14)
    med = rodar(["ffmpeg", "-hide_banner", *entradas, "-filter_complex",
                 ";".join(fc + [f"{a}loudnorm=I={lufs}:TP=-1:LRA=11:print_format=json[an]"]),
                 "-map", "[an]", "-f", "null", "-"]).stderr
    m = json.loads(med[med.rindex("{"):med.rindex("}") + 1])
    fc.append(f"{a}loudnorm=I={lufs}:TP=-1:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
              f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,aresample=48000[af]")
    v = "0:v"
    if roteiro.get("legenda") or args.legenda:
        from .legendas import gerar_ass
        ws = [{"w": w["w"], "s": w["s"] + t0, "e": w["e"] + t0} for (_, wl, _), (t0, _) in zip(narr, tempos) for w in wl]
        (edit / "explicativo.ass").write_text(gerar_ass(ws, estilo, W, H))
        fdir = str(FONTES).replace(":", r"\:")
        fc.append(f"[0:v]subtitles=explicativo.ass:fontsdir='{fdir}'[vv]")
        v = "[vv]"
    saida = edit / (args.saida or f"explicativo-{formato}.mp4")
    cmd = ["ffmpeg", "-y", "-v", "error", *entradas, "-filter_complex", ";".join(fc), "-map", v, "-map", "[af]"]
    cmd += (["-c:v", "copy"] if v == "0:v" else ["-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p"])
    cmd += ["-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-t", f"{total:.3f}", str(saida)]
    r = subprocess.run(cmd, capture_output=True, text=True, cwd=edit)
    if r.returncode:
        print(r.stderr[-2500:])
        raise SystemExit("falhou a mixagem final")
    print(f"✓ {saida} ({sonda(saida)['duracao']:.1f}s)")

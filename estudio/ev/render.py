"""Monta o vídeo a partir do edl.json.

Ordem (cada regra evita uma falha silenciosa):
1. Cada trecho é extraído e codificado UMA vez (enquadramento + zoom + cor +
   limpeza de voz + fade de 30 ms nas pontas, que mata o "clique" do corte).
   Os trechos ficam em cache: mudar um corte só refaz aquele trecho.
2. Junta tudo sem recodificar (concat -c copy).
3. Passada final: sobreposições → música com ducking → legendas POR ÚLTIMO
   (senão a arte cobre a legenda) → loudnorm em 2 passadas (-14 LUFS, pico -1).
"""
import hashlib
import json
import subprocess
from pathlib import Path

from .comum import FONTES, FORMATOS, assinatura, carregar_estilo, ler_json, pasta_edit, rodar, sonda
from .legendas import gerar_ass, gerar_srt, palavras_saida
from .rostos import centro, detectar

GRADES = {
    "nenhum": "",
    "natural": "eq=contrast=1.05:brightness=0.01:saturation=1.08",
    "quente": "colorbalance=rs=0.04:bs=-0.04:rm=0.03:bm=-0.03,eq=contrast=1.05:saturation=1.08",
    "frio": "colorbalance=rs=-0.03:bs=0.04:bm=0.02,eq=contrast=1.05:saturation=1.02",
    "cinema": "colorbalance=rs=-0.05:bs=0.06:rh=0.06:bh=-0.05,eq=contrast=1.08:saturation=0.92",
    "vivo": "eq=contrast=1.08:saturation=1.25,unsharp=5:5:0.35",
    "pb": "hue=s=0,eq=contrast=1.15",
    # frio azul-petróleo no ambiente, pele (vermelhos/amarelos) protegida e um pouco mais quente
    "petroleo": ("selectivecolor=blacks='0.08 0 -0.06 0':neutrals='0.05 0 -0.05 0':blues='0.06 0 0 0':"
                 "cyans='0.05 0 -0.03 0':reds='-0.04 0 0.03 0':yellows='-0.03 0 0.02 0',"
                 "eq=contrast=1.06:saturation=1.05"),
}
FPS = 30


def janela(info, W, H, z, rosto, e):
    """Recorte (x, y, largura, altura) na fonte: maior janela no formato de saída, com zoom, no rosto."""
    sw, sh = info["largura"], info["altura"]
    alvo = W / H
    if sw / sh > alvo:
        ch, cw = sh, sh * alvo
    else:
        cw, ch = sw, sw / alvo
    cw, ch = cw / z, ch / z
    if rosto:
        fx, fy, _ = rosto
        x = fx * sw - cw / 2
        y = fy * sh - ch * e.get("rosto_y", 0.36)
    else:
        x, y = (sw - cw) / 2, (sh - ch) / 2
    x = min(max(x, 0), sw - cw)
    y = min(max(y, 0), sh - ch)
    return x, y, cw, ch


def rosto_na_tela(info, W, H, z, rosto, e):
    """Onde o rosto fica no vídeo final: (centro y, altura), frações da altura. None se não há rosto."""
    if not rosto:
        return None
    x, y, cw, ch = janela(info, W, H, z, rosto, e)
    return ((rosto[1] * info["altura"] - y) / ch, rosto[2] * info["altura"] / ch)


def enquadrar(info, W, H, z, rosto, e):
    """Filtro de recorte: maior janela no formato de saída, com zoom, centrada no rosto."""
    x, y, cw, ch = janela(info, W, H, z, rosto, e)
    par = lambda v: int(v) // 2 * 2  # noqa: E731
    return f"crop={par(cw)}:{par(ch)}:{par(x)}:{par(y)},scale={W}:{H}:flags=lanczos"


def extrair(i, r, fonte, info, rostos, estilo, W, H, preview, cache):
    e = estilo["enquadro"]
    z = r.get("zoom", 1.0)
    rosto = centro(rostos, r["inicio"], r["fim"]) if rostos else None
    if r.get("enquadro_x") is not None:      # ajuste manual: centro horizontal 0–1
        rosto = (r["enquadro_x"], rosto[1] if rosto else 0.4, 0)
    grade = estilo.get("cor", "nenhum")
    grade = GRADES.get(grade, grade)
    dur = r["fim"] - r["inicio"]
    landscape_para_vertical = info["largura"] / info["altura"] > 1.2 and W / H < 0.9
    vertical_para_horizontal = info["largura"] / info["altura"] < 0.8 and W / H > 1.2
    desfoque = r.get("modo") == "desfoque" or vertical_para_horizontal and r.get("modo") != "recorte" or (
        landscape_para_vertical and rosto is None and e.get("sem_rosto") == "desfoque")
    chave = json.dumps([assinatura(fonte), r["inicio"], r["fim"], z, rosto, grade, desfoque,
                        W, H, preview, estilo["audio"]], sort_keys=True)
    nome = cache / f"{i:03d}-{hashlib.sha1(chave.encode()).hexdigest()[:10]}.mp4"
    if nome.exists():
        return nome
    if desfoque:
        vf = (f"[0:v]split[a][b];[a]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},"
              f"gblur=sigma=30,eq=brightness=-0.08[fundo];[b]scale={W}:{H}:force_original_aspect_ratio=decrease[frente];"
              f"[fundo][frente]overlay=(W-w)/2:(H-h)/2")
    else:
        vf = "[0:v]" + enquadrar(info, W, H, z, rosto, e)
    vf += f",fps={FPS},setsar=1" + (f",{grade}" if grade else "") + ",format=yuv420p[v]"
    a = estilo["audio"]
    af = ["aresample=48000"]
    if a.get("limpar_voz", True):
        af += [f"highpass=f={a.get('passa_alta', 80)}", "afftdn=nf=-25:tn=1" if a.get("reduzir_ruido", True) else ""]
        if a.get("eq_voz", True):   # tira o "embolado" (250 Hz), dá presença (3,5 kHz) e ar (10 kHz)
            af += ["equalizer=f=250:t=q:w=1.2:g=-3", "equalizer=f=3500:t=q:w=1:g=3", "highshelf=f=10000:g=2"]
        af += ["acompressor=threshold=-20dB:ratio=3:attack=5:release=90:makeup=2"]
    af += [f"afade=t=in:st=0:d=0.03", f"afade=t=out:st={max(dur - 0.03, 0):.3f}:d=0.03"]
    af = ",".join(x for x in af if x)
    cmd = ["ffmpeg", "-y", "-v", "error", "-ss", f"{r['inicio']:.3f}", "-i", fonte, "-t", f"{dur:.3f}"]
    if not info["audio"]:
        cmd += ["-f", "lavfi", "-t", f"{dur:.3f}", "-i", "anullsrc=r=48000:cl=stereo"]
    cmd += ["-filter_complex", vf + f";[{1 if not info['audio'] else 0}:a]{af}[a]",
            "-map", "[v]", "-map", "[a]",
            "-c:v", "libx264", "-preset", "ultrafast" if preview else "medium",
            "-crf", "28" if preview else "17", "-g", str(FPS * 2), "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2", nome]
    rodar(cmd)
    return nome


def faixa_titulo(texto, estilo, W, H, banda_topo, destino):
    """Título fixo na área preta de cima (formato faixa)."""
    from PIL import Image, ImageDraw, ImageFont
    L = estilo.get("faixa", {})
    fonte = str(FONTES / L.get("arquivo_fonte", estilo["cartela"].get("arquivo_titulo", "BebasNeue-Regular.ttf")))
    cor = L.get("cor", "#F3E6CC")
    img = Image.new("RGBA", (W, banda_topo), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    txt = texto.upper() if L.get("caixa_alta", True) else texto
    tam = int(L.get("tamanho", 72) * W / 1080)
    while tam > 20:
        f = ImageFont.truetype(fonte, tam)
        linhas, atual = [], ""
        for p in txt.split():
            t = (atual + " " + p).strip()
            if d.textlength(t, font=f) <= W * 0.86 or not atual:
                atual = t
            else:
                linhas.append(atual)
                atual = p
        linhas.append(atual)
        lh = int(tam * 1.08)
        if lh * len(linhas) <= banda_topo * 0.78:
            break
        tam -= 4
    y = (banda_topo - lh * len(linhas)) / 2 + banda_topo * 0.06
    for l in linhas:
        d.text(((W - d.textlength(l, font=f)) / 2, y), l, font=f, fill=cor)
        y += lh
    img.save(destino)


def chave_arquivo(*partes):
    return hashlib.sha1(json.dumps(partes, sort_keys=True, default=str).encode()).hexdigest()[:12]


def main(args):
    edl_path = Path(args.edl).resolve()
    edit = edl_path.parent
    edl = ler_json(edl_path)
    estilo = carregar_estilo(args.estilo or edl.get("estilo", "padrao"))
    faixa = args.formato == "faixa"
    CW, CH = FORMATOS[args.formato]                      # tela final
    W, H = (1920, 1080) if faixa else (CW, CH)           # tamanho dos trechos
    preview = args.preview
    if preview:
        W, H, CW, CH = (x // 2 // 2 * 2 for x in (W, H, CW, CH))
    cache = edit / "trechos"
    cache.mkdir(exist_ok=True)

    infos, rostos, trs = {}, {}, {}
    for nome, fonte in edl["fontes"].items():
        infos[nome] = sonda(fonte)
        precisa_rosto = (infos[nome]["largura"] / infos[nome]["altura"]) != (W / H) or any(
            r.get("zoom", 1) != 1 for r in edl["trechos"] if r["fonte"] == nome)
        if precisa_rosto and estilo["enquadro"].get("seguir_rosto", True):
            rostos[nome] = detectar(fonte)
        tp = edit / "transcricoes" / f"{nome}.json"
        if tp.exists():
            trs[nome] = ler_json(tp)

    partes, rostos_saida, t_out = [], [], 0.0
    for i, r in enumerate(edl["trechos"]):
        if rostos.get(r["fonte"]) and r.get("modo") != "desfoque":
            ro = centro(rostos[r["fonte"]], r["inicio"], r["fim"])
            if r.get("enquadro_x") is not None and ro:
                ro = (r["enquadro_x"], ro[1], ro[2])
            pos = rosto_na_tela(infos[r["fonte"]], W, H, r.get("zoom", 1.0), ro, estilo["enquadro"])
            if pos:
                rostos_saida.append((t_out, t_out + r["fim"] - r["inicio"], *pos))
        t_out += r["fim"] - r["inicio"]
        partes.append(extrair(i, r, edl["fontes"][r["fonte"]], infos[r["fonte"]],
                              rostos.get(r["fonte"]), estilo, W, H, preview, cache))
        print(f"\r  trechos {i + 1}/{len(edl['trechos'])}", end="", flush=True)
    print()
    lista = edit / "trechos.txt"
    lista.write_text("".join(f"file '{p}'\n" for p in partes))
    montagem = edit / "montagem.mp4"
    rodar(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", lista, "-c", "copy", montagem])
    dur = sonda(montagem)["duracao"]

    L = estilo["legenda"]
    legenda_on = L.get("ativa", True) and trs and not args.sem_legenda
    ws = palavras_saida(edl, trs, {**L.get("correcoes", {}), **edl.get("correcoes", {})},
                        L.get("escrita_correta", False)) if trs else []

    # palavra gigante atrás da cabeça: desenhada nos quadros antes da passada final
    if legenda_on and L.get("animacao") == "atras":
        from .palavra_atras import processar
        k_atr = chave_arquivo([str(p) for p in partes], ws, L, preview, "v2-512")
        atras = edit / f"atras-{k_atr}.mp4"
        if not atras.exists():
            so_video = edit / "atras-tmp.mp4"
            rel = processar(montagem, ws, L, so_video, preview)
            rodar(["ffmpeg", "-y", "-v", "error", "-i", so_video, "-i", montagem, "-map", "0:v", "-map", "1:a",
                   "-c", "copy", atras])
            so_video.unlink()
            (edit / "atras-relatorio.json").write_text(json.dumps(rel, ensure_ascii=False, indent=1))
        rel = json.loads((edit / "atras-relatorio.json").read_text())
        if rel["cobertas_demais"]:
            print("⚠ palavras muito cobertas pela cabeça:", rel["cobertas_demais"])
        montagem = atras

    # ---------- passada final ----------
    entradas = ["-i", montagem]
    fc, v = [], "[0:v]"
    k = 1
    if faixa:   # vídeo 16:9 inteiro numa faixa no meio, título fixo em cima
        bh = CW * H // W // 2 * 2
        topo = (CH - bh) // 2
        fc.append(f"[0:v]scale={CW}:{bh}:flags=lanczos,pad={CW}:{CH}:0:{topo}:black[vb]")
        v = "[vb]"
        titulo = args.titulo or edl.get("titulo_fixo")
        if titulo:
            faixa_titulo(titulo, estilo, CW, CH, topo, edit / "titulo-faixa.png")
            entradas += ["-i", str(edit / "titulo-faixa.png")]
            fc.append(f"{v}[{k}:v]overlay=0:0[vt]")
            v = "[vt]"
            k += 1
    # inserções (personagens, imagens, ícones, cards…) e layouts (tela dividida, recorte)
    from .insercoes import aplicar
    v, k, fixas = aplicar(edl, ws, dur, montagem, edit, CW, CH, preview, estilo, rostos_saida, entradas, fc, v, k)
    esc = CW / FORMATOS[args.formato][0]
    for j, o in enumerate(edl.get("sobreposicoes", [])):
        arq = str((edit / o["arquivo"]).resolve()) if not Path(o["arquivo"]).is_absolute() else o["arquivo"]
        ini, fim, fd = o["inicio"], o["fim"], o.get("fade", 0.25)
        imagem = Path(arq).suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}
        alfa = ["-c:v", "libvpx-vp9"] if arq.lower().endswith(".webm") else []   # mantém a transparência
        entradas += (["-loop", "1", "-t", f"{fim:.3f}", "-i", arq] if imagem else [*alfa, "-i", arq])
        if o.get("cobrir"):
            esc_f = f"scale={CW}:{CH}:force_original_aspect_ratio=increase,crop={CW}:{CH}"
            x, y = "0", "0"
        else:
            larg = round(o.get("largura", FORMATOS[args.formato][0] * 0.8) * esc) // 2 * 2
            esc_f = f"scale={larg}:-2"
            x = "(W-w)/2" if o.get("x", "centro") == "centro" else str(round(o["x"] * esc))
            y = str(round(o.get("y", 0) * esc)) if not isinstance(o.get("y"), str) else o["y"]
        tempo = "" if imagem else f",setpts=PTS-STARTPTS+{ini}/TB"
        fc.append(f"[{k}:v]{esc_f},format=rgba{tempo},fade=t=in:st={ini}:d={fd}:alpha=1,"
                  f"fade=t=out:st={max(fim - fd, ini)}:d={fd}:alpha=1[o{j}]")
        fc.append(f"{v}[o{j}]overlay={x}:{y}:enable='between(t,{ini},{fim})':eof_action=pass[v{j}]")
        v = f"[v{j}]"
        k += 1

    # legendas por último
    srt = gerar_srt(ws) if ws else None
    if legenda_on and L.get("animacao") != "atras":
        evitar = [] if faixa else rostos_saida
        (edit / "legendas.ass").write_text(gerar_ass(ws, estilo, CW, CH, evitar, fixas))
        fdir = str(FONTES).replace(":", r"\:")
        fc.append(f"{v}subtitles=legendas.ass:fontsdir='{fdir}'[vf]")
        v = "[vf]"

    # áudio: voz + música (uma trilha ou uma por bloco) com ducking
    musica = args.musica or edl.get("musica")
    mv_pad = args.musica_vol if args.musica_vol is not None else estilo["audio"].get("musica_db", -16)
    if musica:
        blocos = [{"arquivo": musica}] if isinstance(musica, str) else musica
        rotulos = []
        for bi, b in enumerate(blocos):
            ini, fim = b.get("inicio", 0.0), min(b.get("fim", dur), dur)
            mus = str((edit / b["arquivo"]).resolve()) if not Path(b["arquivo"]).is_absolute() else b["arquivo"]
            entradas += ["-stream_loop", "-1", "-i", mus]
            fo = min(1.5, (fim - ini) / 3)
            fc.append(f"[{k}:a]atrim=0:{fim - ini:.3f},asetpts=PTS-STARTPTS,volume={b.get('db', mv_pad)}dB,"
                      f"afade=t=in:d=0.4,afade=t=out:st={max(fim - ini - fo, 0):.3f}:d={fo:.3f},"
                      f"adelay={int(ini * 1000)}:all=1,apad=whole_dur={dur:.3f}[mb{bi}]")
            rotulos.append(f"[mb{bi}]")
            k += 1
        trilha = "".join(rotulos) + (f"amix=inputs={len(rotulos)}:normalize=0:duration=longest[m]"
                                     if len(rotulos) > 1 else "anull[m]")
        fc.append(trilha)
        fc.append("[0:a]asplit[voz][sc];[m][sc]sidechaincompress=threshold=0.03:ratio=8:attack=15:release=350[duck];"
                  "[voz][duck]amix=inputs=2:duration=first:normalize=0[mix]")
        a = "[mix]"
    else:
        a = "[0:a]"

    # loudnorm em duas passadas (mede o áudio já mixado, depois aplica)
    lufs = estilo["audio"].get("lufs", -14)
    so_audio = [x for x in fc if ":a]" in x or x.startswith("[mb") or "[m]" in x]
    med = rodar(["ffmpeg", "-hide_banner", *entradas, "-filter_complex",
                 ";".join(so_audio + [f"{a}loudnorm=I={lufs}:TP=-1:LRA=11:print_format=json[an]"]),
                 "-map", "[an]", "-f", "null", "-"], capturar=False).stderr
    m = json.loads(med[med.rindex("{"):med.rindex("}") + 1])
    fc.append(f"{a}loudnorm=I={lufs}:TP=-1:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
              f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:"
              f"linear=true,aresample=48000[af]")

    nome_saida = args.saida or f"{'preview' if preview else 'final'}-{args.formato}.mp4"
    saida = edit / nome_saida
    crf = "28" if preview else ("16" if args.formato == "youtube-1440" else "18")
    cmd = ["ffmpeg", "-y", "-v", "error", *entradas, "-filter_complex", ";".join(fc),
           "-map", v if v != "[0:v]" else "0:v", "-map", "[af]",
           "-c:v", "libx264", "-preset", "veryfast" if preview else "slow",
           "-crf", crf, "-profile:v", "high", "-pix_fmt", "yuv420p", "-r", str(FPS),
           "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
           "-c:a", "aac", "-b:a", "256k" if args.formato == "youtube-1440" else "192k", "-ar", "48000",
           "-movflags", "+faststart", "-t", f"{dur:.3f}", saida]
    if v == "[0:v]":   # nada a desenhar: copia o vídeo
        cmd[cmd.index("-c:v") + 1] = "copy"
        for opc in ("-preset", "-crf", "-profile:v", "-pix_fmt", "-r"):
            i = cmd.index(opc)
            del cmd[i:i + 2]
    r = subprocess.run([str(c) for c in cmd], capture_output=True, text=True, cwd=edit)
    if r.returncode:
        print(r.stderr[-3000:])
        raise SystemExit("falhou a passada final")
    if srt:
        saida.with_suffix(".srt").write_text(srt)
    final = sonda(saida)
    mb = saida.stat().st_size / 1e6
    print(f"✓ {saida}  ({final['duracao']:.1f}s, {final['largura']}x{final['altura']}, {mb:.0f} MB)")

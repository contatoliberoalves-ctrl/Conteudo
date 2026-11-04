"""Render de uma edição feita no editor da galeria do estúdio (coleção `edicoes` do banco da página).

  ev.py edicao edicao.json [--video original.mp4] [--midia pasta] [--rascunho] [--saida nome.mp4]

edicao.json é o documento salvo pelo editor (ArtifactData get `edicoes/<video>`), com:
  formato, enquadre {modo preencher|caber, x, y, fundo}, segmentos [{ini, fim, vel, vol, fora, trans, cor, zoom}],
  elementos [...], legendas {ativo, estilo, blocos}, audio {volOriginal, mudo, musica, sfx, narracoes},
  efeitos {grao, vinheta, barras}, exportar {res, fps, legenda, audio}.
--video: o arquivo original (melhor qualidade); sem ele, usa a amostra publicada (galeria/dist/<arquivo>).
--midia: pasta com as imagens/vídeos que o usuário enviou, com o nome = assetId (baixe com Artifact read path=<assetId>).

Como fica igual à prévia: a camada de cima (textos, formas, personagens, legenda, efeitos) é a composição
EditorCamada do Remotion, que usa o MESMO editor-desenho.js do editor; ela é feita no tempo do original e
cortada/acelerada junto com o vídeo, trecho a trecho. Zoom, cor e transição valem só para o vídeo (como na prévia).
"""
import json
import os
import shutil
import subprocess
from pathlib import Path

import numpy as np

from .comum import RAIZ, rodar, sonda, voz_padrao
from .efeitos_voz import cadeia
from .motion import NAVEGADOR, PROJETO, garantir_projeto

AR = {"9:16": (1080, 1920), "4:5": (1080, 1350), "1:1": (1080, 1080), "16:9": (1920, 1080)}
FONTES_EDITOR = [  # família CSS do editor → arquivo em estudio/fontes/
    ("Archivo", "ArchivoExpanded-Black.ttf", "900", "normal", "125%"),
    ("Bebas Neue", "BebasNeue-Regular.ttf", "400", "normal", "normal"),
    ("Poppins", "Poppins-ExtraBold.ttf", "800", "normal", "normal"),
    ("Poppins", "Poppins-Bold.ttf", "700", "normal", "normal"),
    ("Big Shoulders Display", "BigShouldersDisplay-Black.ttf", "900", "normal", "normal"),
    ("Playfair Display", "PlayfairDisplay-Black.ttf", "900", "normal", "normal"),
    ("Instrument Serif", "InstrumentSerif-Italic.ttf", "400", "italic", "normal"),
    ("Instrument Serif", "InstrumentSerif-Regular.ttf", "400", "normal", "normal"),
    ("Montserrat", "Montserrat-ExtraBold.ttf", "800", "normal", "normal"),
    ("Inter Tight", "InterTight-ExtraBold.ttf", "800", "normal", "normal"),
    ("Anton", "Anton-Regular.ttf", "400", "normal", "normal"),
    ("IBM Plex Mono", "IBMPlexMono-SemiBold.ttf", "600", "normal", "normal"),
]
TONS = {"cama": 98.0, "tensao": 73.4, "animada": 196.0, "lofi": 130.8, "epica": 65.4}


def vivos(ed):
    return [s for s in sorted(ed["segmentos"], key=lambda s: s["ini"]) if not s.get("fora")]


def mapear(ed, t):
    """Tempo do original → tempo do vídeo final (None se cai num trecho removido)."""
    acc = 0.0
    for s in vivos(ed):
        if s["ini"] <= t < s["fim"]:
            return acc + (t - s["ini"]) / s.get("vel", 1)
        acc += (s["fim"] - s["ini"]) / s.get("vel", 1)
    return None


def _atempo(v):
    out = []
    while v > 2.0:
        out.append("atempo=2.0"); v /= 2.0
    while v < 0.5:
        out.append("atempo=0.5"); v /= 0.5
    out.append(f"atempo={v:.4f}")
    return ",".join(out)


def _suave(k):
    return f"if(lt({k},0.5),2*{k}*{k},1-pow(-2*{k}+2,2)/2)"


def _cor(c):
    from .editor_cores import CORES
    p = CORES.get(c.get("preset", "natural"), {})
    b = p.get("brilho", 0) + c.get("brilho", 0)
    ct = p.get("contraste", 0) + c.get("contraste", 0)
    sa = p.get("sat", 0) + c.get("sat", 0)
    tp = p.get("temp", 0) + c.get("temp", 0)
    f = [f"eq=brightness={b * 0.5:.3f}:contrast={1 + ct:.3f}:saturation={max(0, 1 + sa):.3f}"]
    if abs(tp) > 0.01:
        k = tp * 0.18
        f.append(f"colorbalance=rs={k:.3f}:gs={k * 0.3:.3f}:bs={-k:.3f}:rm={k * 0.7:.3f}:bm={-k * 0.7:.3f}")
    return ",".join(f)


def cadeia_video(s, i, W, H, en, cortes_trans):
    """Filtros de um trecho: enquadre → zoom → cor → transição → velocidade."""
    d = s["fim"] - s["ini"]
    f = [f"trim=start={s['ini']:.3f}:end={s['fim']:.3f}", "setpts=PTS-STARTPTS"]
    if en.get("modo") == "caber":
        f.append(f"scale={W}:{H}:force_original_aspect_ratio=decrease,pad={W}:{H}:(ow-iw)/2:(oh-ih)/2:color={en.get('fundo', '#000000') if str(en.get('fundo', '')).startswith('#') else '#000000'}")
    else:
        f.append(f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H}:(iw-{W})*{en.get('x', .5):.3f}:(ih-{H})*{en.get('y', .5):.3f}")
    z = s.get("zoom", {"de": 1, "para": 1, "x": .5, "y": .5})
    tr = s.get("trans", "corte") if i else "corte"
    extra = f"*(1+0.35*(1-{_suave('min(t/0.3,1)')}))" if tr == "zoom" else ""
    if abs(z.get("de", 1) - 1) > 1e-3 or abs(z.get("para", 1) - 1) > 1e-3 or extra:
        k = f"min(t/{d:.3f},1)"
        zz = f"({z['de']}+({z['para']}-{z['de']})*{_suave(k)}){extra}"
        f.append(f"scale=w='trunc({W}*{zz}/2)*2':h='trunc({H}*{zz}/2)*2':eval=frame,crop={W}:{H}:(iw-{W})*{z.get('x', .5):.3f}:(ih-{H})*{z.get('y', .5):.3f}")
    f.append(_cor(s.get("cor", {})))
    if tr in ("fade", "desfoque", "chicote", "deslizar"):
        f.append(f"fade=t=in:st=0:d={0.3 if tr == 'fade' else 0.15}:color=black")
    if tr == "flash":
        f.append("fade=t=in:st=0:d=0.3:color=white")
    v = s.get("vel", 1)
    if abs(v - 1) > 1e-3:
        f.append(f"setpts=PTS/{v}")
    f.append("format=yuv420p")
    return ",".join(f)


def render_camada(ed, W, H, fps, dur, midia, edit, rascunho, sem_legenda):
    garantir_projeto()
    pub = PROJETO / "public" / "editor"
    (pub / "fontes").mkdir(parents=True, exist_ok=True)
    fontes = []
    for fam, arq, peso, estilo, larg in FONTES_EDITOR:
        src = RAIZ / "fontes" / arq
        if src.exists():
            shutil.copy(src, pub / "fontes" / arq)
            fontes.append({"familia": fam, "arquivo": f"editor/fontes/{arq}", "peso": peso, "estilo": estilo, "largura": larg})
    pers = RAIZ / "galeria" / "dist" / "personagens"
    if pers.exists():
        shutil.copytree(pers, pub / "personagens", dirs_exist_ok=True)
    mapa = {}
    for e in ed.get("elementos", []):
        if e.get("tipo") in ("imagem", "video") and e.get("assetId"):
            achados = list(Path(midia).glob(e["assetId"] + "*")) if midia else []
            if not achados:
                print(f"⚠ mídia {e['assetId']} não encontrada em --midia; o elemento fica de fora")
                continue
            (pub / "midia").mkdir(exist_ok=True)
            shutil.copy(achados[0], pub / "midia" / achados[0].name)
            mapa[e["assetId"]] = f"editor/midia/{achados[0].name}"
    props = {"largura": W, "altura": H, "fps": fps, "total": int(np.ceil(dur * fps)) + 1, "ed": ed, "fontes": fontes,
             "personagens": "editor/personagens", "midia": mapa, "semLegenda": sem_legenda}
    pj = edit / "editor-camada.json"
    pj.write_text(json.dumps(props, ensure_ascii=False))
    saida = edit / f"editor-camada{'-rascunho' if rascunho else ''}.webm"
    env = {**os.environ, **({"REMOTION_BROWSER": NAVEGADOR} if Path(NAVEGADOR).exists() else {})}
    cmd = ["npx", "remotion", "render", "src/index.ts", "EditorCamada", str(saida), f"--props={pj}", "--log=error",
           "--codec=vp9", "--image-format=png", "--pixel-format=yuva420p"] + (["--scale=0.5"] if rascunho else [])
    r = subprocess.run(cmd, cwd=PROJETO, env=env, capture_output=True, text=True)
    if r.returncode or not saida.exists():
        print(r.stdout[-2500:], r.stderr[-2500:])
        raise SystemExit("render da camada do editor falhou")
    return saida


def tem_camada(ed, sem_legenda):
    L = ed.get("legendas", {})
    E = ed.get("efeitos", {})
    return bool([e for e in ed.get("elementos", []) if not e.get("oculto")]) or (L.get("ativo") and L.get("blocos") and not sem_legenda) \
        or E.get("grao") or E.get("vinheta") or E.get("barras")


def srt(ed, caminho):
    def tc(s):
        ms = int(round(s * 1000)); return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"
    linhas, n = [], 0
    for b in ed.get("legendas", {}).get("blocos", []):
        a, z = mapear(ed, b["t0"]), mapear(ed, max(b["t0"], b["t1"] - 0.01))
        if a is None or z is None:
            continue
        n += 1
        linhas += [str(n), f"{tc(a)} --> {tc(z)}", b["texto"], ""]
    Path(caminho).write_text("\n".join(linhas))
    return caminho


def main(args):
    from .remotion_util import decodificar
    from .sfx import SR, Mix, cama, clique, impacto, pop, whoosh
    doc = Path(args.edicao).resolve()
    ed = json.loads(doc.read_text())
    edit = doc.parent / "edit"
    edit.mkdir(exist_ok=True)
    src = Path(args.video) if args.video else RAIZ / "galeria" / "dist" / ed.get("arquivo", "")
    if not src.exists():
        raise SystemExit(f"vídeo de origem não encontrado: {src} (use --video)")
    info = sonda(src)
    dur = info["duracao"]
    if not ed.get("segmentos"):
        ed["segmentos"] = [{"ini": 0, "fim": dur, "vel": 1, "vol": 1, "fora": False, "trans": "corte", "cor": {"preset": "natural"}, "zoom": {"de": 1, "para": 1, "x": .5, "y": .5}}]
    ex = ed.get("exportar", {})
    W, H = AR.get(ed.get("formato", "9:16"), AR["9:16"])
    esc_res = {"720": 2 / 3, "1080": 1, "1440": 4 / 3, "2160": 2}.get(str(ex.get("res", "1080")), 1)
    if args.rascunho:
        esc_res = 0.5
    W, H = int(round(W * esc_res / 2) * 2), int(round(H * esc_res / 2) * 2)
    fps = int(ex.get("fps", 30))
    leg_modo = ex.get("legenda", "queimada")
    sem_legenda = leg_modo in ("srt", "sem")
    camada = render_camada(ed, W, H, fps, dur, args.midia, edit, args.rascunho, sem_legenda) if tem_camada(ed, sem_legenda) else None
    A = ed.get("audio", {})
    tem_audio = bool(info.get("audio", True))
    partes = []
    en = ed.get("enquadre", {})
    for i, s in enumerate(vivos(ed)):
        out = edit / f"trecho-{i:03d}.mp4"
        fv = cadeia_video(s, i, W, H, en, None)
        if camada:
            v = s.get("vel", 1)
            fc = f"[0:v]{fv}[b];[1:v]trim=start={s['ini']:.3f}:end={s['fim']:.3f},setpts=PTS-STARTPTS{f',setpts=PTS/{v}' if abs(v - 1) > 1e-3 else ''},scale={W}:{H}[o];[b][o]overlay=0:0:format=auto,fps={fps},format=yuv420p[v]"
            entradas = ["-i", src, "-c:v", "libvpx-vp9", "-i", camada]
        else:
            fc = f"[0:v]{fv},fps={fps}[v]"
            entradas = ["-i", src]
        vol = 0 if A.get("mudo") else A.get("volOriginal", 1) * s.get("vol", 1)
        vv = A.get("vozVideo") or {}
        fx = cadeia(vv.get("efeito", "nenhum"), vv.get("tom", 0), 1.0)
        fa = f"[0:a]atrim=start={s['ini']:.3f}:end={s['fim']:.3f},asetpts=PTS-STARTPTS,volume={vol:.3f},{_atempo(s.get('vel', 1))}{',' + fx if fx else ''},aresample=48000[a]"
        cmd = ["ffmpeg", "-y", "-v", "error", *entradas, "-filter_complex", fc + (";" + fa if tem_audio else ""), "-map", "[v]"]
        cmd += (["-map", "[a]"] if tem_audio else ["-f", "lavfi", "-t", f"{(s['fim'] - s['ini']) / s.get('vel', 1):.3f}", "-i", "anullsrc=r=48000:cl=stereo"])
        cmd += ["-c:v", "libx264", "-preset", "veryfast" if args.rascunho else "medium", "-crf", "24" if args.rascunho else "17", "-c:a", "aac", "-b:a", "192k", "-shortest", out]
        rodar(cmd)
        partes.append(out)
        print(f"\r  trecho {i + 1}/{len(vivos(ed))}", end="", flush=True)
    print()
    lista = edit / "trechos.txt"
    lista.write_text("".join(f"file '{p.name}'\n" for p in partes))
    base = edit / "base.mp4"
    rodar(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", lista, "-c", "copy", base])
    total = sonda(base)["duracao"]
    # áudio: original já cortado + trilha (ducking) + efeitos + narrações com a voz do perfil
    m = Mix(total)
    voz_orig = decodificar(base, SR)
    m.put(0, voz_orig, 1.0)
    env_voz = np.convolve(np.abs(voz_orig), np.ones(int(SR * .25)) / int(SR * .25), "same") if len(voz_orig) else np.zeros(1)
    mus = A.get("musica")
    if mus:
        a, z = mapear(ed, mus.get("ini", 0)) or 0.0, mapear(ed, min(dur - .01, mus.get("fim", dur))) or total
        n = max(1, int((z - a) * SR))
        y = cama(z - a, TONS.get(mus.get("preset", "cama"), 98.0))[:n]
        g = np.ones(len(y), np.float32)
        fi, fo = int(mus.get("fadeIn", 1) * SR), int(mus.get("fadeOut", 1.5) * SR)
        if fi: g[:fi] *= np.linspace(0, 1, min(fi, len(g)))[:len(g[:fi])]
        if fo: g[-fo:] *= np.linspace(1, 0, min(fo, len(g)))[-len(g[-fo:]):]
        if mus.get("ducking", True) and not A.get("mudo"):
            seg = env_voz[int(a * SR): int(a * SR) + len(y)]
            if len(seg) == len(y):
                g *= np.where(seg > 0.02, 0.35, 1.0).astype(np.float32)
                g = np.convolve(g, np.ones(4800) / 4800, "same").astype(np.float32)
        m.put(a, y * g, mus.get("vol", .35) * 0.9)
    gera = {"whoosh": lambda k: whoosh(.45, 400, 3500, np.random.default_rng(k)), "pop": lambda k: pop(900), "impacto": lambda k: impacto(.8),
            "clique": lambda k: clique(.03, np.random.default_rng(k)), "ding": lambda k: pop(1320, .6), "erro": lambda k: pop(200, .25), "caixa": lambda k: pop(2000, .3)}
    for k, x in enumerate(A.get("sfx", [])):
        t = mapear(ed, x["t"])
        if t is not None:
            m.put(t, gera.get(x.get("tipo"), gera["pop"])(k), x.get("vol", .7) * 0.6)
    if A.get("narracoes"):
        from .explicativo import sintetizar
        for k, nr in enumerate(A["narracoes"]):
            t = mapear(ed, nr["t"])
            if t is None:
                continue
            o = {"estilo": nr.get("estilo", "neutro"), "efeito": nr.get("efeito", "nenhum"), "tom": nr.get("tom", 0), "vel": nr.get("vel", 1.0)}
            mp3 = edit / f"narracao-{k:02d}-{abs(hash(json.dumps([nr['texto'], o], sort_keys=True))) % 10 ** 8}.mp3"
            if not mp3.exists():
                if voz_padrao() == "perfil":
                    sintetizar(nr["texto"], {"perfil": True, **o}, mp3)
                else:                                   # sem voz clonada: voz grátis + os mesmos efeitos
                    from .efeitos_voz import aplicar
                    cru = mp3.with_name(mp3.stem + "-cru.mp3")
                    sintetizar(nr["texto"], voz_padrao(), cru)
                    aplicar(cru, mp3, o["efeito"], o["tom"], o["vel"])
            m.put(t, decodificar(mp3, SR), nr.get("vol", 1))
    wav = edit / "mix.wav"
    m.salvar(wav)
    saida = edit / (args.saida or f"{Path(ed.get('arquivo', 'video')).stem}-editado{'-rascunho' if args.rascunho else ''}.mp4")
    af = [] if ex.get("audio") == "original" else ["-af", f"loudnorm=I={ex.get('audio', '-14')}:TP=-1.5:LRA=11"]
    rodar(["ffmpeg", "-y", "-v", "error", "-i", base, "-i", wav, "-map", "0:v", "-map", "1:a", "-c:v", "copy", *af,
           "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-shortest", saida])
    if leg_modo in ("srt", "ambas"):
        print(f"✓ {srt(ed, saida.with_suffix('.srt'))}")
    for p in partes:
        p.unlink()
    print(f"✓ {saida} ({sonda(saida)['duracao']:.1f}s de {dur:.1f}s; {len(vivos(ed))} trechos)")

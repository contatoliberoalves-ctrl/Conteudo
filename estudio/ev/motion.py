"""Modelo de motion: Remotion + GSAP com 6 controles num único controles.json.

  ev.py motion novo <pasta> [--estilo perfil]       cria <pasta>/controles.json de exemplo
  ev.py motion render <controles.json> [--rascunho] [--sem-som]
  ev.py motion esfregar <controles.json> [--frames 0,4,8 | --de 10 --ate 40 --passo 2 | --cena 1]
  ev.py motion ajustar <controles.json> antecipacao.frames=+4 followthrough.atraso_cauda=+3 cenas.0.segura=1

Os 6 controles (globais em "controles"; cada cena pode sobrescrever qualquer um):
  espacamento    distância (px na tela de 1080) que o objeto percorre entre as poses, e a direção
  tipografia     escala, rastreamento (em), altura da linha, quebra (máx. caracteres ou "|")
  desfoque       obturador (graus; 180 = cinema, 0 = desliga) e amostras por quadro
  easing         curvas de entrada/saída (GSAP), duração de entrada/saída e escalonamento (quadros)
  followthrough  atraso da cauda (quadros), overshoot, oscilações e arrasto da cauda
  antecipacao    quadros de recuo antes do movimento principal e tamanho do recuo

Ciclo: construir → renderizar (--rascunho) → esfregar → ajustar → repetir.
"""
import copy
import json
import os
import re
import shutil
import subprocess
from pathlib import Path

from .comum import FONTES, FORMATOS, RAIZ, carregar_estilo, ler_json, pasta_edit, rodar, sonda

PROJETO = RAIZ / "motion"
NAVEGADOR = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell"

PADRAO = {
    "espacamento": {"distancia": 140, "direcao": "baixo"},
    "tipografia": {"escala": 1.0, "rastreamento": -0.01, "altura_linha": 0.92, "max_caracteres": 12, "caixa_alta": True},
    "desfoque": {"obturador": 180, "amostras": 6},
    "easing": {"entrada": "expo.out", "saida": "power3.in", "duracao_entrada": 18, "duracao_saida": 9, "escalonar": 3},
    "followthrough": {"atraso_cauda": 2, "overshoot": 0.12, "oscilacoes": 1, "arrasto": 0.35},
    "antecipacao": {"frames": 4, "recuo": 0.15},
}


def mesclar(a, b):
    r = copy.deepcopy(a)
    for k, v in (b or {}).items():
        r[k] = mesclar(r[k], v) if isinstance(v, dict) and isinstance(r.get(k), dict) else v
    return r


def agenda(cfg):
    """Quadros de cada cena: entrada (antecipação + corpo + cauda) + segura + saída. Cenas se sobrepõem."""
    fps = cfg.get("fps", 30)
    glob = mesclar(PADRAO, cfg.get("controles", {}))
    t, cenas = 0, []
    sobre = cfg.get("sobreposicao", 0)   # >0 só quando as cenas não ocupam o mesmo lugar
    for c in cfg["cenas"]:
        ctl = mesclar(glob, c.get("controles", {}))
        e, a, ft = ctl["easing"], ctl["antecipacao"], ctl["followthrough"]
        entrada = a["frames"] + e["duracao_entrada"] + ft["atraso_cauda"] + 6
        saida = int(a["frames"] * 0.75) + e["duracao_saida"] + 2
        segura = round(float(c.get("segura", 1.0)) * fps)
        n = len(c.get("palavras", [])) if c["tipo"] == "sequencia" else 1
        dur = n * (entrada + segura + saida) if c["tipo"] == "sequencia" else entrada + segura + saida
        inicio = max(0, t - (sobre if cenas else 0))
        cenas.append({**{k: v for k, v in c.items() if k not in ("controles", "segura")},
                      "inicio": inicio, "duracao": dur, "segura": segura, "controles": ctl})
        t = inicio + dur
    return cenas, t


def props(cfg_path):
    cfg = ler_json(cfg_path)
    estilo = carregar_estilo(cfg.get("estilo", "padrao"))
    E, C = estilo.get("explicativo", {}), estilo["cartela"]
    W, H = FORMATOS[cfg.get("formato", "reels")]
    pal = {"fundo": E.get("fundo", C["fundo"]), "fundo2": E.get("fundo2", C["fundo"]), "texto": E.get("texto", C["texto"]),
           "acento": E.get("acento", C["acento"]), "apagado": "#8A9099"}
    pal.update(cfg.get("paleta", {}))
    ft = cfg.get("fontes", {})
    titulo = ft.get("titulo", E.get("fonte_titulo", C.get("arquivo_titulo", "BebasNeue-Regular.ttf")))
    corpo = ft.get("corpo", E.get("fonte_corpo", C.get("arquivo_corpo", "Poppins-Bold.ttf")))
    (PROJETO / "public" / "fonts").mkdir(parents=True, exist_ok=True)
    for f in (titulo, corpo):
        shutil.copy(FONTES / f, PROJETO / "public" / "fonts" / f)
    cenas, total = agenda(cfg)
    return {"largura": W, "altura": H, "fps": cfg.get("fps", 30), "total": total + cfg.get("cauda_final", 6),
            "transparente": bool(cfg.get("transparente")), "paleta": pal,
            "fontes": {"titulo": f"fonts/{titulo}", "corpo": f"fonts/{corpo}"}, "cenas": cenas}


def garantir_projeto():
    if not (PROJETO / "node_modules" / "remotion").exists():
        subprocess.run(["npm", "install", "--no-audit", "--no-fund"], cwd=PROJETO, check=True)


def render(args):
    cfg_path = Path(args.controles).resolve()
    cfg = ler_json(cfg_path)
    edit = pasta_edit(cfg_path)
    p = props(cfg_path)
    garantir_projeto()
    pj = edit / "motion-props.json"
    pj.write_text(json.dumps(p, ensure_ascii=False))
    alfa = p["transparente"]
    nome = cfg_path.stem.replace("controles", "motion") or "motion"
    saida = edit / f"{nome}{'-rascunho' if args.rascunho else ''}.{'webm' if alfa else 'mp4'}"
    cmd = ["npx", "remotion", "render", "src/index.ts", "Motion", str(saida), f"--props={pj}", "--log=error"]
    if alfa:
        cmd += ["--codec=vp9", "--image-format=png", "--pixel-format=yuva420p"]
    else:
        cmd += ["--codec=h264", "--crf=16" if not args.rascunho else "--crf=26"]
    if args.rascunho:
        cmd += ["--scale=0.5"]
    env = dict(os.environ)
    if Path(NAVEGADOR).exists():
        env["REMOTION_BROWSER"] = NAVEGADOR
    r = subprocess.run(cmd, cwd=PROJETO, env=env, capture_output=True, text=True)
    if r.returncode or not saida.exists():
        print(r.stdout[-3000:], r.stderr[-3000:])
        raise SystemExit("render do Remotion falhou")
    if not args.sem_som and not alfa and cfg.get("som", True):
        from .sfx import trilha_motion
        wav = edit / f"{nome}-som.wav"
        trilha_motion(p, wav, cfg.get("som_volume", 1.0))
        com_som = saida.with_name(saida.stem + "-som.mp4")
        rodar(["ffmpeg", "-y", "-v", "error", "-i", saida, "-i", wav, "-map", "0:v", "-map", "1:a", "-c:v", "copy",
               "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-c:a", "aac", "-b:a", "192k", "-shortest", com_som])
        com_som.replace(saida)
    (edit / f"{nome}-agenda.txt").write_text(texto_agenda(p))
    print(f"✓ {saida} ({sonda(saida)['duracao']:.2f}s, {p['total']} quadros)")
    print(texto_agenda(p))


def texto_agenda(p):
    linhas = [f"{p['total']} quadros a {p['fps']} fps"]
    for i, c in enumerate(p["cenas"]):
        C = c["controles"]
        nome = c.get("texto") or " / ".join(c.get("palavras", [])) or c.get("botao") or str(c.get("numero", ""))
        linhas.append(f"cena {i} {c['tipo']:9s} q{c['inicio']:>4}–{c['inicio'] + c['duracao']:<4} "
                      f"antecipa {C['antecipacao']['frames']}q · entra {C['easing']['duracao_entrada']}q · "
                      f"cauda +{C['followthrough']['atraso_cauda']}q · segura {c['segura']}q · \"{nome[:40]}\"")
    return "\n".join(linhas)


def esfregar(args):
    """Folha de quadros NUMERADOS (é assim que se confere '4 quadros de antecipação')."""
    from PIL import Image, ImageDraw, ImageFont
    cfg_path = Path(args.controles).resolve()
    edit = pasta_edit(cfg_path)
    nome = cfg_path.stem.replace("controles", "motion") or "motion"
    video = next((v for v in [edit / f"{nome}-rascunho.mp4", edit / f"{nome}.mp4", edit / f"{nome}.webm"] if v.exists()), None)
    if not video:
        raise SystemExit("renderize antes: ev.py motion render <controles.json> --rascunho")
    p = ler_json(edit / "motion-props.json")
    if args.frames:
        qs = [int(x) for x in args.frames.split(",")]
    elif args.cena is not None:
        c = p["cenas"][args.cena]
        qs = list(range(c["inicio"], c["inicio"] + c["duracao"], args.passo or 2))[:24]
    elif args.de is not None:
        qs = list(range(args.de, (args.ate or args.de + 30) + 1, args.passo or 2))
    else:   # um quadro por cena: começo, fim da antecipação, meio da entrada, pouso, saída
        qs = []
        for c in p["cenas"]:
            C = c["controles"]
            a, d = C["antecipacao"]["frames"], C["easing"]["duracao_entrada"]
            qs += [c["inicio"] + x for x in (0, a, a + d // 3, a + d + C["followthrough"]["atraso_cauda"] + 4)]
    qs = sorted(set(q for q in qs if q < p["total"]))[:32]
    fdir = edit / "esfregar"
    fdir.mkdir(exist_ok=True)
    sel = "+".join(f"eq(n\\,{q})" for q in qs)
    rodar(["ffmpeg", "-y", "-v", "error", "-i", video, "-vf", f"select='{sel}',scale=-2:420", "-vsync", "0",
           str(fdir / "q%03d.png")])
    ims = [Image.open(fdir / f"q{i + 1:03d}.png").convert("RGB") for i in range(len(qs)) if (fdir / f"q{i + 1:03d}.png").exists()]
    if not ims:
        raise SystemExit("nenhum quadro extraído")
    w, h = ims[0].size
    col = min(8, len(ims))
    lin = (len(ims) + col - 1) // col
    folha = Image.new("RGB", (col * w, lin * (h + 24)), (16, 16, 16))
    d = ImageDraw.Draw(folha)
    try:
        f = ImageFont.truetype("DejaVuSans-Bold.ttf", 16)
    except OSError:
        f = ImageFont.load_default()
    for i, (q, im) in enumerate(zip(qs, ims)):
        x, y = (i % col) * w, (i // col) * (h + 24)
        folha.paste(im, (x, y + 24))
        cena = next((k for k, c in enumerate(p["cenas"]) if c["inicio"] <= q < c["inicio"] + c["duracao"]), "-")
        d.text((x + 6, y + 4), f"q{q}  cena {cena}", fill=(240, 240, 240), font=f)
    out = edit / "esfregar.jpg"
    folha.save(out, quality=85)
    for x in fdir.glob("q*.png"):
        x.unlink()
    print(f"✓ {out} (quadros {qs})")


def ajustar(args):
    """caminho=valor; '+N'/'-N' soma ao valor atual. Sem 'cenas.' o caminho vai em 'controles'."""
    cfg_path = Path(args.controles)
    cfg = ler_json(cfg_path)
    for a in args.mudancas:
        caminho, valor = a.split("=", 1)
        partes = caminho.split(".")
        if partes[0] not in ("cenas", "controles", "formato", "fps", "estilo", "transparente", "sobreposicao", "paleta", "fontes"):
            partes = ["controles"] + partes
        alvo = cfg
        for k in partes[:-1]:
            k = int(k) if k.isdigit() else k
            if isinstance(alvo, dict) and k not in alvo:
                alvo[k] = {}
            alvo = alvo[k]
        k = partes[-1]
        atual = alvo.get(k) if isinstance(alvo, dict) else None
        if atual is None and partes[0] in ("controles", "cenas"):
            base = PADRAO
            for x in partes[-2:-1]:
                base = base.get(x, {}) if isinstance(base, dict) else {}
            atual = base.get(k) if isinstance(base, dict) else None
        if re.fullmatch(r"[+-]\d+(\.\d+)?", valor) and isinstance(atual, (int, float)):
            novo = atual + float(valor)
            novo = int(novo) if float(novo).is_integer() and isinstance(atual, int) else round(novo, 3)
        else:
            try:
                novo = json.loads(valor)
            except json.JSONDecodeError:
                novo = valor
        alvo[k] = novo
        print(f"{'.'.join(partes)}: {atual} → {novo}")
    cfg_path.write_text(json.dumps(cfg, ensure_ascii=False, indent=1) + "\n")


EXEMPLO = {
    "estilo": "constitucionalgabaritado", "formato": "reels", "fps": 30, "transparente": False,
    "controles": PADRAO,
    "cenas": [
        {"tipo": "titulo", "kicker": "1ª fase OAB", "texto": "Inscrições|abertas", "destaque": ["abertas"], "segura": 1.0},
        {"tipo": "sequencia", "palavras": ["Reforço", "em", "Constitucional"], "destaque": ["Constitucional"], "segura": 0.5},
        {"tipo": "numero", "numero": 6, "rotulo": "questões para gabaritar", "segura": 1.0},
        {"tipo": "cta", "texto": "Valor promocional", "botao": "Inscreva-se", "segura": 1.4},
    ],
}


def novo(args):
    pasta = Path(args.pasta)
    pasta.mkdir(parents=True, exist_ok=True)
    cfg = copy.deepcopy(EXEMPLO)
    cfg["estilo"] = args.estilo
    destino = pasta / "controles.json"
    if destino.exists():
        raise SystemExit(f"{destino} já existe")
    destino.write_text(json.dumps(cfg, ensure_ascii=False, indent=1) + "\n")
    print(f"✓ {destino}")


def main(args):
    {"novo": novo, "render": render, "esfregar": esfregar, "ajustar": ajustar}[args.acao](args)

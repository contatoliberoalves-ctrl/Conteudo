"""Funções comuns do estúdio: ffprobe, pastas, estilos, execução de comandos."""
import hashlib
import json
import os
import shlex
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent          # estudio/
FONTES = RAIZ / "fontes"
ESTILOS = RAIZ / "estilos"

FORMATOS = {
    "reels":    (1080, 1920),   # Reels, Stories, TikTok, Shorts
    "feed":     (1080, 1350),   # feed 4:5
    "quadrado": (1080, 1080),
    "youtube":  (1920, 1080),
    "youtube-1440": (2560, 1440),  # master do YouTube (1440p recebe o codec melhor, VP9)
    "faixa":    (1080, 1920),   # 9:16 com o vídeo 16:9 inteiro numa faixa no meio + título fixo
}


def rodar(cmd, silencioso=True, capturar=False):
    """Roda um comando (lista). Mostra o erro do ffmpeg por inteiro se falhar."""
    if not silencioso:
        print("$", " ".join(shlex.quote(str(c)) for c in cmd), file=sys.stderr)
    r = subprocess.run([str(c) for c in cmd], capture_output=True, text=True)
    if r.returncode != 0:
        sys.stderr.write(r.stderr[-4000:])
        raise SystemExit(f"falhou: {cmd[0]} (código {r.returncode})")
    return r.stdout if capturar else r


def sonda(arquivo):
    """Duração, largura, altura, fps e se tem áudio (já considerando rotação de celular)."""
    out = rodar(["ffprobe", "-v", "error", "-print_format", "json", "-show_format",
                 "-show_streams", arquivo], capturar=True)
    d = json.loads(out)
    v = next((s for s in d["streams"] if s["codec_type"] == "video"), None)
    a = next((s for s in d["streams"] if s["codec_type"] == "audio"), None)
    info = {"duracao": float(d["format"].get("duration", 0)), "audio": a is not None}
    if v:
        w, h = int(v["width"]), int(v["height"])
        rot = 0
        for sd in v.get("side_data_list", []) or []:
            if "rotation" in sd:
                rot = int(sd["rotation"])
        rot = int(v.get("tags", {}).get("rotate", rot))
        if abs(rot) in (90, 270):
            w, h = h, w
        num, den = (v.get("avg_frame_rate") or "30/1").split("/")
        fps = float(num) / float(den) if float(den) else 30.0
        info.update(largura=w, altura=h, fps=round(fps, 3))
    return info


def pasta_edit(video_ou_pasta):
    """Saídas de cada projeto ficam em <pasta dos vídeos>/edit/."""
    p = Path(video_ou_pasta).resolve()
    base = p if p.is_dir() else p.parent
    if base.name == "edit":
        return base
    e = base / "edit"
    e.mkdir(exist_ok=True)
    return e


def assinatura(arquivo):
    """Identifica a versão do arquivo sem ler o vídeo inteiro (tamanho + mtime + início)."""
    st = os.stat(arquivo)
    h = hashlib.sha1(f"{st.st_size}:{int(st.st_mtime)}".encode())
    with open(arquivo, "rb") as f:
        h.update(f.read(1 << 20))
    return h.hexdigest()[:16]


def carregar_estilo(nome="padrao"):
    """Lê estilos/<nome>.json por cima de estilos/padrao.json."""
    base = json.loads((ESTILOS / "padrao.json").read_text())
    if nome and nome != "padrao":
        arq = ESTILOS / f"{nome}.json"
        if not arq.exists():
            raise SystemExit(f"estilo '{nome}' não existe. Disponíveis: "
                             + ", ".join(sorted(p.stem for p in ESTILOS.glob('*.json'))))
        base = mesclar(base, json.loads(arq.read_text()))
    return base


def mesclar(a, b):
    r = dict(a)
    for k, v in b.items():
        r[k] = mesclar(r[k], v) if isinstance(v, dict) and isinstance(r.get(k), dict) else v
    return r


def ler_json(p):
    return json.loads(Path(p).read_text())


def gravar_json(p, dados):
    Path(p).write_text(json.dumps(dados, ensure_ascii=False, indent=1))


def tempo(s):
    m, s = divmod(max(s, 0), 60)
    return f"{int(m):02d}:{s:05.2f}"


def voz_padrao():
    """A voz clonada do autor (perfil do estúdio de voz) quando existe; senão, a edge-tts grátis."""
    return "perfil" if (RAIZ / "projetos" / "voz" / "perfil.json").exists() else "pt-BR-AntonioNeural"


def chave_voz(voz):
    """Parte da chave de cache da narração: com "perfil", muda quando o perfil muda."""
    if voz == "perfil" or (isinstance(voz, dict) and voz.get("perfil")):
        p = RAIZ / "projetos" / "voz" / "perfil.json"
        return ["perfil", p.read_text() if p.exists() else "", voz if isinstance(voz, dict) else {}]
    return voz

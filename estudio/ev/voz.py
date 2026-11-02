"""Prepara a sua voz para clonagem a partir de vídeos seus.

  ev.py voz preparar <vídeos ou pasta> [--saida estudio/projetos/voz]

Transcreve, escolhe os trechos de fala contínua e limpa (3–12 s, sem palavras de baixa confiança),
tira grave de ruído (passa-alta), normaliza o volume e grava, FORA do git:
  amostras/NN.wav          trechos soltos (para o ElevenLabs: suba 1–3 min deles)
  referencia.wav           ~90 s colados (Instant Voice Clone)
  referencia-curta.wav     ~15 s (Chatterbox)
  amostras.txt             o que é dito em cada trecho
Use vídeos só com a sua voz (sem música de fundo, sem outra pessoa falando).
"""
from pathlib import Path

from .comum import RAIZ, rodar
from .transcrever import frases, transcrever

EXT = {".mp4", ".mov", ".mkv", ".m4v", ".webm", ".mp3", ".wav", ".m4a"}


def preparar(args):
    fontes = []
    for a in args.videos:
        p = Path(a)
        fontes += sorted(x for x in p.iterdir() if x.suffix.lower() in EXT) if p.is_dir() else [p]
    saida = Path(args.saida) if args.saida else RAIZ / "projetos" / "voz"
    (saida / "amostras").mkdir(parents=True, exist_ok=True)
    trechos = []
    for f in fontes:
        d = transcrever(str(f), args.modelo)
        grupos = []
        for g in frases(d["palavras"], pausa=0.45):
            atual = []
            for i, w in enumerate(g):          # fala corrida: corta em respiros curtos a cada 5–12 s
                atual.append(w)
                prox = g[i + 1] if i + 1 < len(g) else None
                d_at = atual[-1]["e"] - atual[0]["s"]
                if prox is None or (d_at >= 5 and prox["s"] - w["e"] >= 0.12) or d_at >= (14 if args.treino else 11):
                    grupos.append(atual)
                    atual = []
        for g in grupos:
            dur = g[-1]["e"] - g[0]["s"]
            conf = sum(w["p"] for w in g) / len(g)
            lo, hi = (2.0, 15.0) if args.treino else (3.0, 12.0)
            if lo <= dur <= hi and conf >= args.conf and min(w["p"] for w in g) >= 0.25:
                trechos.append((conf * dur, f, g[0]["s"] - 0.08, g[-1]["e"] + 0.15, " ".join(w["w"] for w in g)))
    if not trechos:
        raise SystemExit("nenhum trecho limpo de 3–12 s encontrado")
    trechos.sort(key=lambda x: -x[0])
    lista, total = [], 0.0
    for i, (_, f, a, b, txt) in enumerate(trechos):
        out = saida / "amostras" / f"{i + 1:02d}.wav"
        rodar(["ffmpeg", "-y", "-v", "error", "-ss", f"{a:.2f}", "-to", f"{b:.2f}", "-i", str(f), "-vn", "-ac", "1", "-ar", "44100",
               "-af", "highpass=f=70,afftdn=nf=-28,loudnorm=I=-18:TP=-2:LRA=7", str(out)])
        lista.append((out, b - a, txt, f.name))
        total += b - a
        if total > args.max_min * 60:
            break
    (saida / "amostras.txt").write_text("\n".join(f"{o.name}\t{d:.1f}s\t{n}\t{t}" for o, d, t, n in lista))

    def colar(alvo_s, nome):
        sel, acc = [], 0.0
        for o, d, _, _ in lista:
            if acc >= alvo_s:
                break
            sel.append(o)
            acc += d
        txt = saida / f"{nome}.txt"
        txt.write_text("".join(f"file '{o.resolve()}'\n" for o in sel))
        rodar(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", txt, "-c", "copy", saida / f"{nome}.wav"])
        txt.unlink()
        return acc
    d1 = colar(90, "referencia")
    d2 = colar(15, "referencia-curta")
    print(f"✓ {len(lista)} trechos ({total / 60:.1f} min) em {saida / 'amostras'}")
    print(f"✓ referencia.wav ({d1:.0f}s) e referencia-curta.wav ({d2:.0f}s)")
    if total < 60:
        print("⚠ pouco áudio: para um clone bom, mande vídeos que somem pelo menos 3–5 minutos de fala sua")


def main(args):
    {"preparar": preparar, "comparar": comparar, "escolher": escolher, "falar": falar}[args.acao](args)


def comparar(args):
    """Mesma frase em cada motor e em cada referência candidata, para escolher de ouvido."""
    import time
    from . import vozes
    refs = vozes.melhores_refs(n=args.refs)
    if not refs:
        raise SystemExit("rode antes: ev.py voz preparar <vídeos>")
    pasta = vozes.PASTA / "comparar"
    pasta.mkdir(parents=True, exist_ok=True)
    lista = []
    for motor in args.motores.split(","):
        for i, (ref, txt, d) in enumerate(refs, 1):
            nome = pasta / f"{motor}-ref{i}.wav"
            t0 = time.time()
            try:
                vozes.gerar(args.frase, motor, ref, txt, nome)
            except Exception as e:      # motor não instalado ou falhou: segue com os outros
                print(f"✗ {motor}: {str(e)[:200]}")
                break
            lista.append({"arquivo": str(vozes.mp3(nome)), "motor": motor, "ref": str(ref), "ref_texto": txt})
            print(f"✓ {nome.stem} ({time.time() - t0:.0f}s)")
    (pasta / "opcoes.json").write_text(json.dumps(lista, ensure_ascii=False, indent=1))
    print(f"→ ouça os mp3 em {pasta} e escolha: ev.py voz escolher <motor>-ref<N>")


def escolher(args):
    from . import vozes
    opcoes = json.loads((vozes.PASTA / "comparar" / "opcoes.json").read_text())
    op = next((o for o in opcoes if Path(o["arquivo"]).stem == args.opcao), None)
    if not op:
        raise SystemExit(f"opção não encontrada. Existem: {[Path(o['arquivo']).stem for o in opcoes]}")
    perfil = {"nome": args.nome, "motor": op["motor"], "ref": op["ref"], "ref_texto": op["ref_texto"], "parametros": {}}
    vozes.PERFIL.write_text(json.dumps(perfil, ensure_ascii=False, indent=1))
    print(f"✓ perfil de voz '{args.nome}': {op['motor']} com {Path(op['ref']).name}. No roteiro: \"voz\": \"perfil\"")


def falar(args):
    from . import vozes
    texto = Path(args.texto).read_text() if Path(args.texto).exists() else args.texto
    out = vozes.falar(texto, Path(args.saida))
    print(f"✓ {out}")

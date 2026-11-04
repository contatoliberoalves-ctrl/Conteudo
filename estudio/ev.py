#!/usr/bin/env python3
"""Estúdio de vídeo: um comando só, várias etapas.

  ev.py transcrever <vídeo|pasta> [--modelo small|medium|large-v3]
  ev.py cortar <pasta> --estilo <perfil>            → edit/edl.json (silêncios e "hã" fora)
  ev.py ver edit/edl.json [--palavras]              → trechos numerados (revisar regravações)
  ev.py render edit/edl.json --formato reels [--preview] [--musica trilha.mp3]
  ev.py verificar edit/final-reels.mp4              → folha de quadros + loudness
  ev.py cartela <pasta> --tipo gancho --texto "..." --estilo <perfil>
  ev.py referencia <arquivo|link>                   → ritmo, cortes/min, folha de quadros
  ev.py narrar roteiro.txt --saida narracao.mp3 [--voz ...] [--clonar minha-voz.wav]
  ev.py explicativo roteiro.json [--formato reels]  → vídeo animado e narrado (HyperFrames)
  ev.py motion novo|render|esfregar|ajustar ...      → motion Remotion+GSAP com 6 controles
  ev.py edicao edicao.json [--video original]     → render do que foi editado no editor da galeria
  ev.py documentario roteiro.json [--rascunho]     → documentário estilo Vox (papel, recortes, palavras no tempo da voz)
  ev.py cartoon roteiro.json [--rascunho]          → cartoon narrado com personagens desenhados
  ev.py voz preparar <vídeos>                      → trechos limpos da sua voz para clonar
  ev.py texto edit/edl.json                         → fala no tempo do vídeo final (capítulos, títulos)
  ev.py estilos                                     → lista os estilos
"""
import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))


def main():
    p = argparse.ArgumentParser(prog="ev.py", description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    s = p.add_subparsers(dest="cmd", required=True)

    a = s.add_parser("transcrever")
    a.add_argument("videos", nargs="+")
    a.add_argument("--modelo")
    a.add_argument("--forcar", action="store_true")

    a = s.add_parser("cortar")
    a.add_argument("pasta")
    a.add_argument("--estilo", default="padrao")
    a.add_argument("--fontes", help="ordem das fontes, separadas por vírgula (nomes sem extensão)")
    a.add_argument("--sobrescrever", action="store_true")

    a = s.add_parser("ver")
    a.add_argument("edl")
    a.add_argument("--palavras", action="store_true")

    a = s.add_parser("render")
    a.add_argument("edl")
    a.add_argument("--formato", default="reels",
                   choices=["reels", "feed", "quadrado", "youtube", "youtube-1440", "faixa"])
    a.add_argument("--titulo", help="título fixo em cima (formato faixa)")
    a.add_argument("--estilo")
    a.add_argument("--preview", action="store_true")
    a.add_argument("--musica")
    a.add_argument("--musica-vol", type=float)
    a.add_argument("--sem-legenda", action="store_true")
    a.add_argument("--saida")

    a = s.add_parser("verificar")
    a.add_argument("video")
    a.add_argument("--edl")
    a.add_argument("--em", help="tempos em segundos, separados por vírgula")
    a.add_argument("--max", type=int, default=24)

    a = s.add_parser("cartela")
    a.add_argument("pasta")
    a.add_argument("--tipo", required=True, choices=["gancho", "nome", "selo", "cta"])
    a.add_argument("--texto", required=True)
    a.add_argument("--sub")
    a.add_argument("--estilo", default="padrao")
    a.add_argument("--formato", default="reels", choices=["reels", "feed", "quadrado", "youtube"])
    a.add_argument("--inicio", type=float, default=0.0)
    a.add_argument("--fim", type=float, default=3.0)
    a.add_argument("--nome")

    a = s.add_parser("referencia")
    a.add_argument("video")
    a.add_argument("--pasta")
    a.add_argument("--modelo")
    a.add_argument("--sem-transcricao", action="store_true")

    a = s.add_parser("narrar")
    a.add_argument("roteiro")
    a.add_argument("--saida", default="narracao.mp3")
    a.add_argument("--voz", default="pt-BR-AntonioNeural")
    a.add_argument("--velocidade", default="+0%")
    a.add_argument("--clonar")

    a = s.add_parser("explicativo")
    a.add_argument("roteiro")
    a.add_argument("--estilo")
    a.add_argument("--formato", choices=["reels", "feed", "quadrado", "youtube"])
    a.add_argument("--musica")
    a.add_argument("--legenda", action="store_true")
    a.add_argument("--preview", action="store_true")
    a.add_argument("--so-montar", action="store_true", help="só gera a composição (sem render)")
    a.add_argument("--saida")

    a = s.add_parser("motion", help="motion design Remotion + GSAP com 6 controles")
    a.add_argument("acao", choices=["novo", "render", "esfregar", "ajustar"])
    a.add_argument("controles", help="controles.json (no 'novo', a pasta)")
    a.add_argument("mudancas", nargs="*", help="ajustar: caminho=valor, +N/-N soma")
    a.add_argument("--estilo", default="constitucionalgabaritado")
    a.add_argument("--rascunho", action="store_true")
    a.add_argument("--sem-som", action="store_true")
    a.add_argument("--frames")
    a.add_argument("--de", type=int)
    a.add_argument("--ate", type=int)
    a.add_argument("--passo", type=int)
    a.add_argument("--cena", type=int)

    a = s.add_parser("cartoon", help="cartoon narrado com personagens desenhados")
    a.add_argument("roteiro")
    a.add_argument("--formato", choices=["reels", "feed", "quadrado", "youtube"])
    a.add_argument("--rascunho", action="store_true")
    a.add_argument("--sem-legenda", action="store_true")
    a.add_argument("--saida")

    for nome, ajuda in [("blocos", "mapa do Brasil em blocos"), ("caminho", "caminho de luz"), ("neon", "neon e vidro"),
                        ("aura", "aura cinematográfica no ritmo da batida"),
                        ("documentario", "documentário estilo Vox: papel, recortes, palavras e círculos à mão")]:
        a = s.add_parser(nome, help=ajuda)
        a.add_argument("roteiro")
        a.add_argument("--formato", choices=["reels", "feed", "quadrado", "youtube"])
        a.add_argument("--rascunho", action="store_true")
        a.add_argument("--saida")

    a = s.add_parser("edicao", help="render de uma edição feita no editor da galeria (coleção edicoes)")
    a.add_argument("edicao", help="JSON do documento edicoes/<video>")
    a.add_argument("--video", help="vídeo original (senão, a amostra publicada)")
    a.add_argument("--midia", help="pasta com as mídias enviadas (nome = assetId)")
    a.add_argument("--rascunho", action="store_true")
    a.add_argument("--saida")

    a = s.add_parser("voz", help="estúdio de voz: preparar, comparar motores, escolher perfil, falar")
    sv = a.add_subparsers(dest="acao", required=True)
    b = sv.add_parser("preparar")
    b.add_argument("videos", nargs="+")
    b.add_argument("--saida")
    b.add_argument("--modelo")
    b.add_argument("--max-min", type=float, default=10)
    b.add_argument("--treino", action="store_true", help="pacote para treinar um clone (aceita mais trechos)")
    b.add_argument("--conf", type=float, default=0.7, help="confiança média mínima da transcrição")
    b = sv.add_parser("comparar")
    b.add_argument("frase")
    b.add_argument("--motores", default="omnivoice,voxcpm,chatterbox")
    b.add_argument("--refs", type=int, default=2)
    sv.add_parser("medir", help="nota objetiva de semelhança de cada teste com a sua voz real")
    b = sv.add_parser("escolher")
    b.add_argument("opcao", help="ex.: voxcpm-ref1")
    b.add_argument("--nome", default="libero")
    b = sv.add_parser("falar")
    b.add_argument("texto")
    b.add_argument("--saida", default="fala.wav")

    a = s.add_parser("texto")
    a.add_argument("edl")

    s.add_parser("estilos")

    args = p.parse_args()
    if args.cmd == "transcrever":
        from ev.transcrever import main as m
    elif args.cmd == "cortar":
        from ev.cortar import main as m
    elif args.cmd == "ver":
        from ev.cortar import ver as m
    elif args.cmd == "render":
        from ev.render import main as m
    elif args.cmd == "verificar":
        from ev.verificar import main as m
    elif args.cmd == "cartela":
        from ev.cartela import main as m
    elif args.cmd == "referencia":
        from ev.referencia import main as m
    elif args.cmd == "explicativo":
        from ev.explicativo import main as m
    elif args.cmd == "motion":
        from ev.motion import main as m
        if args.acao == "novo":
            args.pasta = args.controles
    elif args.cmd == "cartoon":
        from ev.cartoon import main as m
    elif args.cmd == "voz":
        from ev.voz import main as m
    elif args.cmd == "neon":
        from ev.neon import main as m
    elif args.cmd == "aura":
        from ev.aura import main as m
    elif args.cmd == "edicao":
        from ev.edicao import main as m
    elif args.cmd == "documentario":
        from ev.documentario import main as m
    elif args.cmd == "caminho":
        from ev.caminho import main as m
    elif args.cmd == "blocos":
        from ev.blocos import main as m
    elif args.cmd == "texto":
        from ev.cortar import texto_final as m
    elif args.cmd == "narrar":
        from ev.narrar import main as m
    else:
        import json
        from ev.comum import ESTILOS
        for f in sorted(ESTILOS.glob("*.json")):
            print(f"{f.stem:28s} {json.loads(f.read_text()).get('descricao', '')}")
        return
    m(args)


if __name__ == "__main__":
    main()

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

    a = s.add_parser("voz", help="prepara a sua voz para clonagem")
    a.add_argument("acao", choices=["preparar"])
    a.add_argument("videos", nargs="+")
    a.add_argument("--saida")
    a.add_argument("--modelo")
    a.add_argument("--max-min", type=float, default=10)

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

"""Narração a partir de um roteiro.

- edge-tts (padrão): vozes neurais pt-BR grátis, sem GPU (precisa de internet).
  Ex.: pt-BR-AntonioNeural, pt-BR-FranciscaNeural, pt-BR-ThalitaMultilingualNeural.
- Chatterbox (--clonar minha-voz.wav): clona a SUA voz a partir de ~10 s de
  áudio limpo. Roda local; lento sem GPU. Só clone a própria voz ou a de quem
  autorizou.
"""
import asyncio
import os
import ssl
from pathlib import Path


def edge(texto, voz, saida, velocidade):
    import aiohttp
    import edge_tts

    async def go():
        kw = {}
        ca = "/root/.ccr/ca-bundle.crt"          # proxy do ambiente em nuvem
        if os.path.exists(ca):
            kw["connector"] = aiohttp.TCPConnector(ssl=ssl.create_default_context(cafile=ca))
            kw["proxy"] = os.environ.get("HTTPS_PROXY")
        await edge_tts.Communicate(texto, voz, rate=velocidade, **kw).save(str(saida))
    asyncio.run(go())


def chatterbox(texto, referencia, saida):
    try:
        import torchaudio
        from chatterbox.mtl_tts import ChatterboxMultilingualTTS
    except ImportError:
        raise SystemExit("instale antes: bash estudio/instalar.sh --voz")
    import torch
    dev = "cuda" if torch.cuda.is_available() else "cpu"
    m = ChatterboxMultilingualTTS.from_pretrained(device=dev)
    import re
    # uma frase por vez (o modelo perde o fim em frases longas); siglas soletradas soam melhor
    texto = re.sub(r"\bOAB\b", "Ó A BÊ", texto)
    partes = [p.strip() for p in re.split(r"(?<=[.!?])\s+", texto.replace("\n", " ")) if p.strip()]
    wavs = [m.generate(p if p.endswith((".", "!", "?")) else p + ".", language_id="pt",
                       audio_prompt_path=str(referencia)) for p in partes]
    torchaudio.save(str(saida), torch.cat(wavs, dim=-1), m.sr)


def main(args):
    texto = Path(args.roteiro).read_text() if Path(args.roteiro).exists() else args.roteiro
    saida = Path(args.saida)
    if args.clonar:
        chatterbox(texto, args.clonar, saida.with_suffix(".wav"))
        saida = saida.with_suffix(".wav")
    else:
        edge(texto, args.voz, saida, args.velocidade)
    print(f"✓ {saida}")

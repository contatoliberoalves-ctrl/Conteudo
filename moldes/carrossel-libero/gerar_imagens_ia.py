# Gera as imagens de IA dos carrosséis (campos "promptIA" do dados.json) com o FLUX.1-schnell no Hugging Face.
# Uso: HF_TOKEN=hf_... python3 gerar_imagens_ia.py [id-do-carrossel] [--refazer]
#   Para cada slide com "promptIA", gera imagens/<imagem ou fundoImagem>.jpg em 1080×1350 (se ainda não existir).
#   "semente" (opcional, no slide) fixa o resultado; mude a semente para outra variação.
# O token é gratuito: huggingface.co → Settings → Access Tokens → "Make calls to Inference Providers".
# Imagens geradas por IA: registre em imagens/CREDITOS.md (feito automaticamente) e não use para imitar pessoas reais.
import io, json, os, sys, urllib.request
from PIL import Image, ImageFilter

raiz = os.path.dirname(os.path.abspath(__file__))
token = os.environ.get('HF_TOKEN') or os.environ.get('HUGGINGFACE_TOKEN')
if not token:
    sys.exit('Falta o HF_TOKEN (variável de ambiente). Veja o topo deste arquivo.')
filtro = [a for a in sys.argv[1:] if not a.startswith('--')]
refazer = '--refazer' in sys.argv
MODELO = 'black-forest-labs/FLUX.1-schnell'
URL = f'https://router.huggingface.co/hf-inference/models/{MODELO}'
ESTILO = ', high quality, detailed, cinematic lighting, no text, no letters, no watermark'

dados = json.load(open(os.path.join(raiz, 'dados.json')))
creditos = os.path.join(raiz, 'imagens', 'CREDITOS.md')
for c in dados:
    if filtro and c['id'] not in filtro:
        continue
    for s in c['slides']:
        nome = s.get('imagem') or s.get('fundoImagem')
        if not s.get('promptIA') or not nome:
            continue
        destino = os.path.join(raiz, 'imagens', nome)
        if os.path.exists(destino) and not refazer:
            continue
        corpo = json.dumps({'inputs': s['promptIA'] + ESTILO, 'parameters': {'width': 1072, 'height': 1344, 'num_inference_steps': 4, 'seed': s.get('semente', 7)}}).encode()
        req = urllib.request.Request(URL, data=corpo, headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json', 'Accept': 'image/jpeg'})
        try:
            im = Image.open(io.BytesIO(urllib.request.urlopen(req, timeout=180).read())).convert('RGB')
        except Exception as e:
            print(f'! {nome}: {e}')
            continue
        k = max(1080 / im.width, 1350 / im.height)
        im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
        x, y = (im.width - 1080) // 2, (im.height - 1350) // 2
        im.crop((x, y, x + 1080, y + 1350)).filter(ImageFilter.UnsharpMask(radius=1.2, percent=30, threshold=2)).save(destino, quality=92)
        linha = f"| {nome} | gerada por IA ({MODELO}) | — | IA | prompt: {s['promptIA'][:120]} |"
        txt = open(creditos).read()
        if f'| {nome} |' not in txt:
            open(creditos, 'a').write(linha + '\n')
        print(f'✓ {nome}')

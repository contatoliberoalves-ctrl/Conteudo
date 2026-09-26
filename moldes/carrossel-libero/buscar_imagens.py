# Busca fotos de domínio público (CC0 / Public Domain Mark) no Openverse e monta uma prancha para escolher.
# Uso: python3 buscar_imagens.py "termo em inglês" [quantidade] [fonte]
#   -> baixa as candidatas em build/busca/<termo>-<n>.jpg e build/busca/prancha-<termo>.jpg (+ .json com autor e link)
#   fonte: rawpixel (padrão: fotos profissionais e gravuras, verticais), flickr, stocksnap... ou "todas"
# Depois: python3 buscar_imagens.py --preparar build/busca/<arquivo>.jpg imagens/<nome>.jpg [foco_x 0-1]
#   -> recorta/amplia para 1080×1350 (tela cheia da capa). Acrescente o crédito em imagens/CREDITOS.md e use
#   "imagem": "<nome>.jpg" na capa. Do Rawpixel, a versão image_1300 tem marca d'água: o script usa a editor_1024.
# Precisa da rede liberada para api.openverse.org e live.staticflickr.com. O Wikimedia costuma recusar (erro 429).
import io, json, os, re, sys, urllib.parse, urllib.request
from PIL import Image, ImageDraw

UA = {'User-Agent': 'Mozilla/5.0'}
if sys.argv[1] == '--preparar':
    from PIL import ImageFilter
    im = Image.open(sys.argv[2]).convert('RGB'); fx = float(sys.argv[4]) if len(sys.argv) > 4 else .5
    k = max(1080 / im.width, 1350 / im.height)
    im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.6, percent=45, threshold=2))
    x = round((im.width - 1080) * fx); y = (im.height - 1350) // 2
    im.crop((x, y, x + 1080, y + 1350)).save(sys.argv[3], quality=90, optimize=True, progressive=True)
    sys.exit(f'pronto: {sys.argv[3]} (ampliação {k:.2f}x; acima de ~1,7x fica mole)')
termo, n = sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else 12
fonte = sys.argv[3] if len(sys.argv) > 3 else 'rawpixel'
pasta = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'build', 'busca')
os.makedirs(pasta, exist_ok=True)
slug = re.sub(r'[^a-z0-9]+', '-', termo.lower()).strip('-')
params = {'q': termo, 'license': 'cc0,pdm', 'page_size': n, 'aspect_ratio': 'tall'}
if fonte != 'todas':
    params['source'] = fonte
url = 'https://api.openverse.org/v1/images/?' + urllib.parse.urlencode(params)
res = json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30))['results']
info, miniaturas = [], []
for k, x in enumerate(res):
    try:
        dados = urllib.request.urlopen(urllib.request.Request(x['url'].replace('/image_1300/', '/editor_1024/'), headers=UA), timeout=40).read()
        im = Image.open(io.BytesIO(dados)).convert('RGB')
    except Exception as e:
        print(f'  {k}: não baixou ({str(e)[:60]})')
        continue
    open(os.path.join(pasta, f'{slug}-{k}.jpg'), 'wb').write(dados)
    info.append({'n': k, 'titulo': x['title'], 'autor': x['creator'], 'licenca': x['license'], 'origem': x['foreign_landing_url'], 'tamanho': f'{im.width}x{im.height}'})
    im.thumbnail((240, 300)); miniaturas.append((k, im))
if not miniaturas:
    sys.exit('Nenhuma imagem baixada.')
prancha = Image.new('RGB', (240 * len(miniaturas), 320), 'white')
d = ImageDraw.Draw(prancha)
for j, (k, im) in enumerate(miniaturas):
    prancha.paste(im, (240 * j, 0)); d.text((240 * j + 5, 302), f'{k}', fill='black')
prancha.save(os.path.join(pasta, f'prancha-{slug}.jpg'), quality=80)
json.dump(info, open(os.path.join(pasta, f'{slug}.json'), 'w'), ensure_ascii=False, indent=1)
print(f'{len(miniaturas)} imagens em {pasta} (prancha-{slug}.jpg)')

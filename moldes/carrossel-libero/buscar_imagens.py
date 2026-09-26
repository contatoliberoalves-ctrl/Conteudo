# Busca fotos de domínio público (CC0 / Public Domain Mark) no Openverse e monta uma prancha para escolher.
# Uso: python3 buscar_imagens.py "termo em inglês" [quantidade]
#   -> baixa as candidatas em build/busca/<termo>-<n>.jpg e build/busca/prancha-<termo>.jpg (+ .json com autor e link)
# Escolhida a foto: copie para imagens/<nome>.jpg, acrescente o crédito em imagens/CREDITOS.md e use
# "imagem": "<nome>.jpg" na capa. As do Flickr vêm com até 1024px: servem para o cartão da capa, não para tela cheia.
# Precisa da rede liberada para api.openverse.org e live.staticflickr.com. O Wikimedia costuma recusar (erro 429).
import io, json, os, re, sys, urllib.parse, urllib.request
from PIL import Image, ImageDraw

UA = {'User-Agent': 'conteudo-constitucional/1.0'}
termo, n = sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else 12
pasta = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'build', 'busca')
os.makedirs(pasta, exist_ok=True)
slug = re.sub(r'[^a-z0-9]+', '-', termo.lower()).strip('-')
url = 'https://api.openverse.org/v1/images/?' + urllib.parse.urlencode({'q': termo, 'license': 'cc0,pdm', 'page_size': n})
res = json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30))['results']
info, miniaturas = [], []
for k, x in enumerate(res):
    try:
        dados = urllib.request.urlopen(urllib.request.Request(x['url'], headers=UA), timeout=40).read()
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

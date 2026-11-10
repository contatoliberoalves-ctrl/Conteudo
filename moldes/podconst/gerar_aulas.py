"""Slides de AULA 16:9 (1920×1080) na identidade do PodConst, injetados no kit (grupos pa1, pa2…).
Uso: python3 moldes/podconst/gerar_aulas.py  e depois  node render.mjs <id>.
Visual didático: páginas claras para o conteúdo, azul/magenta/navy na capa, nas frases e no fim."""
import re
from pathlib import Path

KIT = Path(__file__).parent / 'kit' / 'Moldes PodConst.dc.html'
INI, FIM = '<!-- PODCONST-AULAS:INICIO -->', '<!-- PODCONST-AULAS:FIM -->'
W, H = 1920, 1080
BB = "font-family:'Bebas Neue';"
AZUL = 'background:radial-gradient(120% 120% at 15% 0%,#0d44bd 0%,#0a3aa6 40%,#0a2a7c 100%);'
MAG = 'background:radial-gradient(120% 120% at 20% 10%,#ea2ee0 0%,#d61ccf 55%,#c515c2 100%);'
NAVY = 'background:radial-gradient(120% 120% at 85% 0%,#132a7a 0%,#0a1440 70%);'
CLARO = 'background:linear-gradient(160deg,#ffffff 0%,#f3f5f9 55%,#e6ebf4 100%);'
TINTA, AMAR, ROSA, AZ = '#0b1a4a', '#f7f400', '#e224d6', '#0a3aa6'

def logo(px, cor='#ff1ff0'):
    barras = ''.join(f'<span style="width:.05em;height:{h}em;border-radius:.03em;background:#fff;"></span>' for h in (.16, .3, .44, .3, .18))
    return (f'<div style="font-family:Unbounded,sans-serif;font-weight:900;font-size:{px}px;line-height:.84;letter-spacing:-.02em;color:{cor};text-shadow:.05em .06em 0 {TINTA};display:inline-flex;flex-direction:column;transform:rotate(-9deg);">'
            f'<div style="display:flex;align-items:center;margin-left:.62em;"><span>P</span><span style="width:.72em;height:.72em;border-radius:50%;background:{cor};box-shadow:.05em .06em 0 {TINTA};display:flex;align-items:center;justify-content:center;gap:.045em;">{barras}</span><span>D</span></div><div>CONST</div></div>')

def rico(t, claro=True):
    t = re.sub(r'\*\*(.+?)\*\*', lambda m: f'<b style="color:{TINTA if claro else "#fff"};">{m.group(1)}</b>', t)
    return re.sub(r'\[\[(.+?)\]\]', lambda m: f'<span style="background:{AMAR if claro else ROSA};color:{TINTA if claro else "#fff"};padding:0 .12em;">{m.group(1)}</span>', t)

def selos(top=50, left=70):
    return (f'<div style="position:absolute;top:{top}px;left:{left}px;display:flex;flex-direction:column;gap:6px;font-weight:700;font-size:28px;color:{TINTA};">'
            f'<div style="background:{AMAR};padding:2px 12px;align-self:flex-start;">@LIBERO<span style="font-weight:400;">FILHO</span></div>'
            f'<div style="background:{ROSA};color:#fff;padding:2px 12px;align-self:flex-start;margin-left:70px;">@NATALIA<span style="font-weight:400;">VALENCA</span></div></div>')

def rodape(n, total, claro=True):
    c = '#5a6a8f' if claro else 'rgba(255,255,255,.75)'
    return (f'<div style="position:absolute;left:90px;right:90px;bottom:44px;display:flex;align-items:center;gap:24px;font-size:24px;color:{c};">'
            f'<span><b>@libero</b>filho · <b>@natalia</b>valenca</span><span style="flex:1;height:2px;background:{c};opacity:.35;"></span>'
            f'<span style="font-weight:700;letter-spacing:.2em;">PODCONST · {n:02d}/{total:02d}</span></div>')

def tela(label, fundo, corpo, claro=True):
    return f'<div data-screen-label="{label}" style="position:relative;flex:none;width:{W}px;height:{H}px;overflow:hidden;color:{TINTA if claro else "#fff"};font-family:\'Space Grotesk\',sans-serif;{fundo}">{corpo}</div>\n'

def cab(kicker, titulo, claro=True, px=104):
    k = ROSA if claro else AMAR
    return (f'<div style="position:absolute;left:90px;right:90px;top:70px;">'
            f'<div style="display:flex;align-items:center;gap:16px;font-weight:700;font-size:26px;letter-spacing:.28em;color:{k};"><span style="width:44px;height:6px;background:{k};"></span>{kicker.upper()}</div>'
            f'<div style="{BB}font-size:{px}px;line-height:.95;margin-top:14px;">{rico(titulo, claro)}</div></div>')

def area(html, top=290, bottom=120, left=90, right=90, extra=''):
    return f'<div style="position:absolute;left:{left}px;right:{right}px;top:{top}px;bottom:{bottom}px;display:flex;flex-direction:column;justify-content:center;{extra}">{html}</div>'

# ---------- tipos de slide ----------
def s_topico(s, n, tot):
    pars = ''.join(f'<p style="margin:0 0 .6em;font-size:38px;line-height:1.4;">{rico(p)}</p>' for p in s['texto'])
    cit = (f'<div style="background:#fff;border-left:10px solid {ROSA};border-radius:18px;padding:34px 40px;box-shadow:0 18px 40px rgba(11,26,74,.1);">'
           f'<div style="font-size:34px;line-height:1.45;font-style:italic;">“{s["citacao"]}”</div><div style="margin-top:16px;font-weight:700;font-size:26px;letter-spacing:.16em;color:{AZ};">{s["fonte"].upper()}</div></div>') if s.get('citacao') else ''
    corpo = (cab(s['kicker'], s['titulo']) + f'<div style="position:absolute;left:90px;right:90px;top:290px;bottom:120px;display:grid;grid-template-columns:{"1.05fr .95fr" if cit else "1fr"};gap:60px;align-items:center;">'
             f'<div>{pars}</div>{cit}</div>' + rodape(n, tot))
    return tela(s['label'], CLARO, corpo)

def s_cards(s, n, tot):
    cores = s.get('cores') or ['#fff'] * len(s['cards'])
    def card(c, cor):
        esc = cor not in ('#fff',)
        txt = '#fff' if cor in (TINTA, ROSA, AZ) else TINTA
        itens = ''.join(f'<div style="display:flex;gap:14px;align-items:flex-start;font-size:32px;line-height:1.35;"><span style="flex:none;width:14px;height:14px;margin-top:13px;border-radius:3px;background:{AMAR if esc else ROSA};"></span><span>{rico(i, not esc)}</span></div>' for i in c.get('itens', []))
        return (f'<div style="background:{cor};color:{txt};border-radius:26px;padding:40px 42px;box-shadow:0 18px 40px rgba(11,26,74,.12);display:flex;flex-direction:column;gap:18px;">'
                f'<div style="font-weight:700;font-size:24px;letter-spacing:.24em;color:{AMAR if esc else ROSA};">{c["rotulo"].upper()}</div>'
                f'<div style="{BB}font-size:66px;line-height:.95;">{c["titulo"]}</div>'
                + (f'<div style="font-size:32px;line-height:1.4;">{rico(c["texto"], not esc)}</div>' if c.get('texto') else '') + itens + '</div>')
    grade = ''.join(card(c, cor) for c, cor in zip(s['cards'], cores))
    corpo = cab(s['kicker'], s['titulo']) + area(f'<div style="display:grid;grid-template-columns:repeat({len(s["cards"])},1fr);gap:40px;">{grade}</div>') + rodape(n, tot)
    return tela(s['label'], CLARO, corpo)

def s_lista(s, n, tot):
    itens = ''.join(f'<div style="display:flex;gap:30px;align-items:flex-start;background:#fff;border-radius:22px;padding:26px 34px;box-shadow:0 12px 30px rgba(11,26,74,.08);">'
                    f'<span style="flex:none;{BB}font-size:80px;line-height:.8;color:{ROSA};width:84px;">{i + 1:02d}</span>'
                    f'<div><div style="font-weight:700;font-size:38px;">{rico(it["t"])}</div><div style="font-size:31px;line-height:1.4;margin-top:6px;color:#33426b;">{rico(it["d"])}</div></div></div>'
                    for i, it in enumerate(s['itens']))
    cols = s.get('colunas', 1)
    corpo = cab(s['kicker'], s['titulo']) + area(f'<div style="display:grid;grid-template-columns:repeat({cols},1fr);gap:26px;">{itens}</div>') + rodape(n, tot)
    return tela(s['label'], CLARO, corpo)

def s_tabela(s, n, tot):
    g = s.get('grade', ' '.join(['1fr'] * len(s['colunas'])))
    head = ''.join(f'<div style="padding:22px 30px;font-weight:700;font-size:26px;letter-spacing:.2em;color:{AMAR};">{c.upper()}</div>' for c in s['colunas'])
    linhas = ''.join(f'<div style="display:grid;grid-template-columns:{g};background:{"#fff" if i % 2 == 0 else "#f1f4fa"};border-top:2px solid #e2e8f2;">'
                     + ''.join(f'<div style="padding:22px 30px;font-size:34px;line-height:1.3;{"font-weight:700;" if j == 0 else ""}">{rico(c) if c else "<span style=\"display:block;border-bottom:3px solid #b8c3da;height:36px;\"></span>"}</div>' for j, c in enumerate(l)) + '</div>'
                     for i, l in enumerate(s['linhas']))
    t = f'<div style="border-radius:22px;overflow:hidden;box-shadow:0 18px 40px rgba(11,26,74,.12);"><div style="display:grid;grid-template-columns:{g};background:{TINTA};">{head}</div>{linhas}</div>'
    nota = f'<div style="font-size:30px;margin-top:26px;">{rico(s["nota"])}</div>' if s.get('nota') else ''
    corpo = cab(s['kicker'], s['titulo']) + area(t + nota) + rodape(n, tot)
    return tela(s['label'], CLARO, corpo)

def s_passos(s, n, tot):
    ps = s['passos']
    nos = ''.join(f'<div style="display:flex;flex-direction:column;align-items:flex-start;gap:18px;">'
                  f'<div style="width:96px;height:96px;border-radius:50%;background:{ROSA if i == len(ps) - 1 else "#fff"};color:{"#fff" if i == len(ps) - 1 else TINTA};display:flex;align-items:center;justify-content:center;{BB}font-size:60px;box-shadow:0 0 0 8px rgba(255,255,255,.25);position:relative;z-index:2;">{i + 1}</div>'
                  f'<div style="{BB}font-size:52px;line-height:.95;">{p["t"]}</div><div style="font-size:29px;line-height:1.35;opacity:.9;">{p["d"]}</div></div>' for i, p in enumerate(ps))
    corpo = (cab(s['kicker'], s['titulo'], claro=False) +
             f'<div style="position:absolute;left:90px;right:90px;top:360px;"><div style="position:absolute;left:48px;right:48px;top:46px;height:6px;background:{AMAR};"></div>'
             f'<div style="position:relative;display:grid;grid-template-columns:repeat({len(ps)},1fr);gap:40px;">{nos}</div></div>' + rodape(n, tot, False))
    return tela(s['label'], AZUL, corpo, claro=False)

def s_frase(s, n, tot):
    fundo = {'azul': AZUL, 'magenta': MAG, 'navy': NAVY}[s.get('fundo', 'navy')]
    fant = f'<div style="position:absolute;right:-40px;bottom:-140px;{BB}font-size:640px;line-height:1;color:rgba(255,255,255,.06);">{s.get("fantasma", "")}</div>'
    corpo = (fant + f'<div style="position:absolute;left:110px;right:110px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;gap:34px;">'
             f'<div style="display:flex;align-items:center;gap:16px;font-weight:700;font-size:28px;letter-spacing:.28em;color:{AMAR};"><span style="width:44px;height:6px;background:{AMAR};"></span>{s["kicker"].upper()}</div>'
             f'<div style="{BB}font-size:150px;line-height:.92;">{rico(s["titulo"], False)}</div><div style="width:150px;height:20px;background:{AMAR};"></div>'
             f'<div style="font-size:42px;line-height:1.4;max-width:1400px;">{rico(s["texto"], False)}</div></div>' + rodape(n, tot, False))
    return tela(s['label'], fundo, corpo, claro=False)

def s_cta(s, n, tot):
    corpo = (selos() + f'<div style="position:absolute;left:0;right:0;top:0;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:34px;">'
             f'<div style="{BB}font-size:170px;line-height:.9;">{rico(s["titulo"], False)}</div><div style="width:150px;height:20px;background:{ROSA};"></div>'
             f'<div style="font-size:42px;line-height:1.4;max-width:1300px;">{rico(s["texto"], False)}</div>'
             + (f'<div style="background:{AMAR};color:{TINTA};border-radius:999px;padding:22px 48px;font-weight:700;font-size:40px;">{s["botao"]}</div>' if s.get('botao') else '') +
             f'</div><div style="position:absolute;right:90px;bottom:70px;">{logo(54)}</div>')
    return tela(s['label'], NAVY, corpo, claro=False)

TIPOS = {'topico': s_topico, 'cards': s_cards, 'lista': s_lista, 'tabela': s_tabela, 'passos': s_passos, 'frase': s_frase, 'cta': s_cta}

# ---------- capas (uma ideia por aula) ----------
def capa_prova(label):
    linhas = ''.join(f'<div style="height:20px;border-radius:10px;background:#e2e8f2;margin-top:30px;width:{w}%;"></div>' for w in (90, 72, 84, 62, 80, 55, 70))
    folha = (f'<div style="position:absolute;right:150px;top:120px;width:640px;height:840px;background:#fff;border-radius:18px;transform:rotate(5deg);box-shadow:0 40px 90px rgba(0,0,0,.45);padding:56px;color:{TINTA};">'
             f'<div style="font-weight:700;font-size:26px;letter-spacing:.24em;color:{AZ};">2ª FASE · OAB</div><div style="{BB}font-size:60px;margin-top:8px;">PEÇA PROFISSIONAL</div>{linhas}'
             f'<div style="position:absolute;right:56px;bottom:70px;width:260px;height:260px;border-radius:50%;border:12px solid #e5484d;color:#e5484d;display:flex;flex-direction:column;align-items:center;justify-content:center;transform:rotate(-12deg);">'
             f'<div style="{BB}font-size:130px;line-height:.9;">5,4</div><div style="font-weight:700;font-size:24px;letter-spacing:.14em;">FALTOU 0,6</div></div></div>')
    corpo = (selos() + folha + f'<div style="position:absolute;left:90px;top:300px;width:1000px;">'
             f'<div style="display:flex;align-items:center;gap:16px;font-weight:700;font-size:30px;letter-spacing:.28em;color:{AMAR};"><span style="width:50px;height:6px;background:{AMAR};"></span>AULA · REPESCAGEM</div>'
             f'<div style="{BB}font-size:140px;line-height:.9;margin-top:20px;">VAI FAZER A<br>REPESCAGEM?</div>'
             f'<div style="display:inline-block;background:{ROSA};{BB}font-size:92px;line-height:.95;padding:14px 22px 2px;margin-top:20px;">PRIMEIRO, DESCUBRA<br>O QUE DEU ERRADO</div></div>'
             f'<div style="position:absolute;left:100px;bottom:70px;">{logo(58)}</div>')
    return tela(label, AZUL, corpo, claro=False)

def capa_mapa(label):
    import random
    random.seed(7)
    cores = [TINTA, AZ, '#1d58d8', AMAR, '#ff6bf2', '#0a2a7c']
    cel = ''.join(f'<div style="background:{random.choice(cores)};border-radius:10px;"></div>' for _ in range(48))
    mapa = (f'<div style="position:absolute;right:110px;top:150px;width:700px;height:780px;display:grid;grid-template-columns:repeat(6,1fr);grid-template-rows:repeat(8,1fr);gap:10px;transform:rotate(-4deg);'
            f'clip-path:polygon(18% 0,70% 3%,100% 22%,92% 55%,100% 80%,62% 100%,20% 92%,0 64%,8% 30%);filter:drop-shadow(0 30px 40px rgba(0,0,0,.3));">{cel}</div>'
            f'<div style="position:absolute;right:300px;top:460px;background:#fff;color:{TINTA};border-radius:18px;padding:16px 24px;font-weight:700;font-size:30px;box-shadow:0 18px 40px rgba(0,0,0,.3);">📍 o seu distrito</div>')
    corpo = (selos() + mapa + f'<div style="position:absolute;left:90px;top:290px;width:1050px;">'
             f'<div style="display:flex;align-items:center;gap:16px;font-weight:700;font-size:30px;letter-spacing:.28em;color:{TINTA};"><span style="width:50px;height:6px;background:{TINTA};"></span>AULA · REFORMA ELEITORAL</div>'
             f'<div style="{BB}font-size:170px;line-height:.88;margin-top:20px;">VOTO DISTRITAL<br><span style="background:{AMAR};color:{TINTA};padding:0 .1em;">MISTO</span></div>'
             f'<div style="background:{TINTA};display:inline-block;font-weight:700;font-size:44px;padding:10px 20px;margin-top:26px;">O que mudaria na eleição pro Congresso</div></div>'
             f'<div style="position:absolute;left:100px;bottom:70px;">{logo(58, "#fff")}</div>')
    return tela(label, MAG, corpo, claro=False)

CAPAS = {'prova': capa_prova, 'mapa': capa_mapa}

AULAS = [
 ('pa1', 'Aula · Vai fazer a repescagem? Primeiro, descubra o que deu errado', 'prova', [
  {'tipo': 'frase', 'fundo': 'navy', 'fantasma': '?', 'kicker': 'Antes de estudar de novo', 'titulo': 'ESTUDAR TUDO DE NOVO<br>[[NÃO]] É O PLANO',
   'texto': 'Repetir a mesma preparação tende a repetir o mesmo resultado. O primeiro passo é abrir a sua prova e descobrir onde a nota ficou.'},
  {'tipo': 'lista', 'kicker': 'O que separar', 'titulo': 'SEU KIT DE [[DIAGNÓSTICO]]', 'colunas': 3, 'itens': [
    {'t': 'A sua prova', 'd': 'Peça e questões, do jeito que você entregou.'},
    {'t': 'O padrão de resposta da FGV', 'd': 'O que a banca esperava em cada item.'},
    {'t': 'A sua nota por item', 'd': 'É ela que mostra onde os pontos ficaram.'}]},
  {'tipo': 'tabela', 'kicker': 'Faça a conta', 'titulo': 'ONDE FICOU A SUA [[NOTA]]?', 'colunas': ['Parte', 'Vale', 'Você fez', 'Perdeu'], 'grade': '1.4fr 1fr 1fr 1fr',
   'linhas': [['Peça', '5,00', '', ''], ['Questão 1', '1,25', '', ''], ['Questão 2', '1,25', '', ''], ['Questão 3', '1,25', '', ''], ['Questão 4', '1,25', '', '']],
   'nota': 'Para aprovar: **6,00 de 10**. A coluna "perdeu" mostra por onde o estudo começa.'},
  {'tipo': 'cards', 'kicker': 'Diagnósticos 1 e 2', 'titulo': 'OS PROBLEMAS DA [[PEÇA]]', 'cores': [ROSA, TINTA], 'cards': [
    {'rotulo': 'Diagnóstico 1', 'titulo': 'ERREI A PEÇA', 'texto': 'Peça inadequada leva **nota zero na peça**.', 'itens': ['Foco: identificação', 'Treinar casos e o cabimento de cada ação']},
    {'rotulo': 'Diagnóstico 2', 'titulo': 'ACERTEI, MAS PERDI PONTOS', 'texto': 'Faltou endereçamento, qualificação, cabimento ou pedido.', 'itens': ['Foco: estrutura', 'Esqueleto treinado até sair no automático']}]},
  {'tipo': 'cards', 'kicker': 'Diagnósticos 3 e 4', 'titulo': 'OS PROBLEMAS DO [[CONTEÚDO]]', 'cards': [
    {'rotulo': 'Diagnóstico 3', 'titulo': 'FUNDAMENTEI POUCO', 'texto': 'Citei o artigo e não expliquei como ele resolve o caso.', 'itens': ['A banca pontua a aplicação ao caso', 'Treinar: tese + artigo + fato']},
    {'rotulo': 'Diagnóstico 4', 'titulo': 'AS QUESTÕES ME DERRUBARAM', 'texto': 'Resposta curta, sem fundamento ou fora do que foi perguntado.', 'itens': ['Cada item tem a sua pontuação', 'Resposta direta + fundamento + aplicação']}]},
  {'tipo': 'frase', 'fundo': 'magenta', 'fantasma': '5', 'kicker': 'Diagnóstico 5', 'titulo': 'FALTOU [[TEMPO]]<br>OU FALTOU VADE?',
   'texto': 'Não terminou a prova ou demorou para achar o artigo. O treino aqui é de simulado cronometrado e de índice remissivo.'},
  {'tipo': 'passos', 'kicker': 'Com o diagnóstico na mão', 'titulo': 'MONTE O PLANO DA [[REPESCAGEM]]', 'passos': [
    {'t': 'Ataque o que mais tirou ponto', 'd': 'É por ali que o estudo começa'}, {'t': 'Siga um cronograma', 'd': 'Semana a semana até a prova'},
    {'t': 'Treine toda semana', 'd': 'Peça e questões, com correção'}, {'t': 'Simulados cronometrados', 'd': 'Prova se aprende fazendo prova'},
    {'t': 'Refaça o diagnóstico', 'd': 'A cada simulado, veja o que melhorou'}]},
  {'tipo': 'cta', 'titulo': 'JÁ SABE ONDE<br>[[ERROU]]?', 'texto': 'Conta nos comentários qual foi o seu diagnóstico.', 'botao': 'Comente #REPESCAGEM'},
 ]),
 ('pa2', 'Aula · Voto distrital misto: o que mudaria na eleição pro Congresso', 'mapa', [
  {'tipo': 'topico', 'kicker': 'Como é hoje', 'titulo': 'VOCÊ VOTA EM [[UM NOME]]', 'texto': [
    'Para deputado, o Brasil usa o **sistema proporcional de lista aberta**.',
    'Os votos de todos os candidatos de um partido são somados, as cadeiras são divididas entre os partidos e entram os mais votados de cada um.',
    'Por isso existe o **puxador de votos**: um campeão de votos ajuda a eleger colegas com bem menos voto.'],
   'citacao': 'A Câmara dos Deputados compõe-se de representantes do povo, eleitos, pelo sistema proporcional, em cada Estado, em cada Território e no Distrito Federal.', 'fonte': 'CF, art. 45'},
  {'tipo': 'cards', 'kicker': 'Os dois modelos', 'titulo': 'DISTRITAL X [[DISTRITAL MISTO]]', 'cores': ['#fff', ROSA], 'cards': [
    {'rotulo': 'Distrital puro', 'titulo': 'CADA REGIÃO ELEGE O SEU', 'itens': ['O estado é dividido em distritos', 'Em cada um, o mais votado leva a vaga', 'Como uma eleição de prefeito']},
    {'rotulo': 'Distrital misto', 'titulo': 'METADE E METADE', 'itens': ['50% das cadeiras: eleitos nos distritos', '50%: divididas pelos votos dos partidos', 'Nessa metade, entra o topo da lista do partido']}]},
  {'tipo': 'passos', 'kicker': 'Linha do tempo', 'titulo': 'COMO A PROPOSTA [[ANDOU]]', 'passos': [
    {'t': '28/10/2026', 'd': 'Hugo Motta anuncia que quer votar uma PEC do distrital misto ainda em 2026'},
    {'t': 'Centrão reunido', 'd': 'União, PP, PSD, Republicanos, MDB, Podemos e PSDB-Cidadania'},
    {'t': '9/11/2026', 'd': 'O PSD apresenta o esboço da PEC; relator: Domingos Neto (PSD-CE)'},
    {'t': 'Meta', 'd': 'Levar ao plenário da Câmara até o fim de novembro'}]},
  {'tipo': 'lista', 'kicker': 'O que diz o esboço', 'titulo': 'OS [[DETALHES]] DA PEC', 'colunas': 2, 'itens': [
    {'t': 'Voto único', 'd': 'O voto no candidato do distrito também conta para a lista do partido. O texto do Senado de 2017 previa dois votos.'},
    {'t': 'Distritos', 'd': 'População parecida e território contínuo, com base no IBGE, revistos a cada censo.'},
    {'t': 'Por distrito', 'd': '1 deputado federal e 2 deputados estaduais.'},
    {'t': 'Listas', 'd': 'Pelo menos 1 mulher a cada 3 nomes.'}]},
  {'tipo': 'tabela', 'kicker': 'Quem muda e quando', 'titulo': 'SÓ O [[LEGISLATIVO]] MUDA', 'colunas': ['Cargo', 'Muda?'], 'grade': '1.5fr 1fr', 'linhas': [
    ['Deputado federal, estadual e distrital', '**Sim**'], ['Vereador', 'Em discussão'], ['Presidente, governador, senador e prefeito', 'Não: seguem no sistema majoritário']],
   'nota': '**2030**: eleição de transição · **2034**: distrital misto completo'},
  {'tipo': 'frase', 'fundo': 'azul', 'fantasma': '3/5', 'kicker': 'CF, arts. 45 e 60, § 2º', 'titulo': 'POR QUE PRECISA<br>DE [[PEC]]?',
   'texto': 'O sistema proporcional está no art. 45 da Constituição. Para trocar, só emenda constitucional: **3/5 dos votos, em dois turnos, em cada Casa**. Na Câmara, 308 de 513 deputados; no Senado, 49 de 81 senadores.'},
  {'tipo': 'cards', 'kicker': 'O debate', 'titulo': 'PRÓS E [[CONTRAS]]', 'cores': [AZ, ROSA], 'cards': [
    {'rotulo': 'A favor', 'titulo': 'REPRESENTANTE PERTO', 'itens': ['Eleitor sabe quem é o deputado da sua região', 'Fim do puxador de votos', 'Campanha em área menor, mais barata']},
    {'rotulo': 'Contra', 'titulo': 'RISCOS APONTADOS', 'itens': ['Mais difícil para minorias', 'Distritos desenhados a favor de alguém', 'Mais poder para dirigentes nas listas']}]},
  {'tipo': 'cta', 'titulo': 'E VOCÊ,<br>[[PREFERE]]?', 'texto': 'Votar no candidato da sua região ou continuar com o sistema de hoje? Status: a PEC ainda não foi votada.', 'botao': 'Comenta: DISTRITAL ou ATUAL'},
 ]),
]

html = []
for gid, nome, capa, slides in AULAS:
    tot = len(slides) + 1
    telas = [CAPAS[capa](f'{gid}-01')]
    for i, s in enumerate(slides, 2):
        s = dict(s, label=f'{gid}-{i:02d}')
        telas.append(TIPOS[s['tipo']](s, i, tot))
    html.append(f'<div id="{gid}" style="display:flex;flex-direction:column;gap:36px;"><div style="display:flex;align-items:center;gap:18px;color:#fff;">'
                f'<span style="background:#f7f400;color:#111;font-weight:700;font-size:30px;padding:6px 16px;border-radius:6px;">{gid}</span><span style="font-size:44px;font-weight:700;">{nome}</span></div>'
                f'<div style="display:flex;gap:56px;">\n{"".join(telas)}</div></div>\n')
bloco = INI + '\n' + ''.join(html) + FIM
s = KIT.read_text()
s = re.sub(re.escape(INI) + '.*?' + re.escape(FIM), lambda m: bloco, s, flags=re.S) if INI in s else s.replace('</section>\n</x-dc>', bloco + '\n</section>\n</x-dc>')
KIT.write_text(s)
print('ok', s.count('data-screen-label="pa'))

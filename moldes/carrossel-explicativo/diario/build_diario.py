# Monta os carrosséis "Meu Diário Constitucional" (Esboço, dias 31-55) no molde Carrossel Explicativo.
# Texto sempre literal do material; só escolhe trechos e distribui entre slides.
import json, re, sys

D = {d['dia']: d for d in json.load(open('esboco.json'))}
AJUSTES = json.load(open('ajustes.json'))

CAPA = {
    31: ("Os princípios da", ["Administração", "Pública"], None),
    32: ("Ingresso no", ["Serviço público"], None),
    33: ("Direitos e deveres dos", ["Servidores", "públicos"], None),
    34: ("Poder Legislativo:", ["Congresso", "Nacional"], None),
    35: ("Poder Legislativo:", ["Câmara dos", "Deputados"], None),
    36: ("Poder Legislativo:", ["Senado", "Federal"], None),
    37: ("O que pode a", ["CPI"], "Comissão Parlamentar de Inquérito"),
    38: ("Vacância da Presidência:", ["Mandato", "tampão"], None),
    39: ("Parlamentares:", ["Imunidade", "formal e material"], None),
    40: ("Presidente da República:", ["Irresponsabilidade", "penal relativa"], None),
    41: ("Eleições:", ["Inelegibilidade", "reflexa"], None),
    42: ("Pode ou não pode?", ["Prefeito", "itinerante"], None),
    43: ("Normas de", ["Reprodução", "obrigatória"], None),
    45: ("Quem pode propor uma", ["PEC"], "Proposta de Emenda à Constituição"),
    46: ("O que é a", ["Mutação", "constitucional"], None),
    47: ("O que são as", ["Emendas", "avulsas"], None),
    48: ("Controle concentrado:", ["ADI"], "Ação Direta de Inconstitucionalidade"),
    49: ("Controle concentrado:", ["ADC"], "Ação Declaratória de Constitucionalidade"),
    50: ("Controle concentrado:", ["ADO"], "Ação Direta de Inconstitucionalidade por Omissão"),
    51: ("Controle concentrado:", ["ADPF"], "Arguição de Descumprimento de Preceito Fundamental"),
    52: ("Quando cabe a", ["Reclamação", "constitucional"], None),
    53: ("Controle concentrado:", ["O papel", "do AGU"], None),
    54: ("Controle estadual:", ["Legitimados", "ativos"], None),
    55: ("Como funcionam as", ["Medidas", "provisórias"], None),
    44: ("Tribunais:", ["Quinto", "constitucional"], None),
    56: ("Como funcionam as", ["Súmulas", "vinculantes"], None),
    57: ("Emendas parlamentares:", ["Contrabando", "legislativo"], None),
    58: ("Fiscalização:", ["Tribunal de", "Contas da União"], None),
    59: ("Princípio da", ["Reserva de", "plenário"], None),
    60: ("Constituição:", ["Ordem econômica", "e social"], None),
}
FOTOS = ['0341', 'img-3161', '0465', 'whatsapp-image-2026-09-25-at-09-35-14-1', 'dsc08915', '0211', 'etica-17',
         'dsc08922', '0467', 'constitucional-25', '0558', 'whatsapp-image-2026-09-25-at-09-35-13-2',
         'etica-25', '1539', 'dsc08848', '0357', 'etica-27', 'dsc08713', 'constitucional-17', 'dsc08925', 'etica-4', '0322',
         'whatsapp-image-2026-09-25-at-09-35-14-2', 'etica-31', 'dsc08888', 'etica-14', 'constitucional-3', 'dsc08700',
         'whatsapp-image-2026-09-25-at-09-35-13-1', 'dsc08920']

limpa = lambda s: re.sub(r'\s+', ' ', s.replace(' ', ' ')).strip()
sem_marcador = lambda s: limpa(re.sub(r'^(•\s*|[A-Ea-e][.)]\s*|[IVX]+[.)-]\s+)', '', s))


def slug(t):
    import unicodedata
    t = unicodedata.normalize('NFD', t).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', t).strip('-')


def tabela(rows):
    """Linhas "| a | b |" -> lista de slides {titulo, lista}."""
    slides, titulo, itens, cols = [], None, [], None
    def fecha():
        nonlocal itens, cols
        if cols:
            for nome, lst in cols:
                if lst: slides.append({'titulo': nome.capitalize() if nome.isupper() else nome, 'lista': lst})
        elif itens:
            slides.append({'titulo': titulo, 'lista': itens})
        itens, cols = [], None
    for r in rows:
        cells = [limpa(c) for c in r.strip().strip('|').split(' | ')]
        cells = [c for c in cells]
        cheias = [c for c in cells if c]
        if not cheias: continue
        if len(cheias) == 1 and len(cells) == 1 and (cheias[0].isupper() or not titulo and not itens and not cols):
            fecha(); titulo = cheias[0].capitalize() if cheias[0].isupper() else cheias[0]; continue
        if len(cells) >= 2 and all(c and len(c) <= 40 and not c.endswith(('.', ';')) for c in cells) and not itens and not cols:
            cols = [(c, []) for c in cells]; continue
        if cols and len(cells) == len(cols):
            for (nome, lst), c in zip(cols, cells):
                if c: lst.append(c)
            continue
        if len(cells) == 2 and len(cells[0]) <= 60:
            itens.append(f'**{cells[0].capitalize() if cells[0].isupper() else cells[0]}:** {cells[1]}'); continue
        itens.extend(cheias)
    fecha()
    return slides


def questao(q):
    """Separa enunciado, afirmativas (I, II…), instrução e alternativas (A, B…)."""
    blocos, atual = [], None
    for l in q:
        tipo = 'item' if re.match(r'^(•|[A-E][.)])\s*', l) else 'texto'
        if not atual or atual[0] != tipo: atual = [tipo, []]; blocos.append(atual)
        atual[1].append(l)
    enun = [limpa(t) for t in blocos[0][1]] if blocos[0][0] == 'texto' else []
    grupos = [b[1] for b in blocos if b[0] == 'item']
    textos = [b[1] for b in blocos if b[0] == 'texto']
    s = {'texto': enun}
    if len(grupos) >= 2:
        s['afirmativas'] = [sem_marcador(x) for x in grupos[0]]
        s['textoMeio'] = [limpa(t) for t in textos[1]] if len(textos) > 1 else []
        s['alternativas'] = [sem_marcador(x) for x in grupos[1]]
    elif grupos:
        s['alternativas'] = [sem_marcador(x) for x in grupos[0]]
    return s


def pacotes(pars, limite):
    out, cur = [], []
    for p in pars:
        if cur and sum(map(len, cur)) + len(p) > limite: out.append(cur); cur = []
        cur.append(p)
    if cur: out.append(cur)
    return out


posts = []
for i, n in enumerate(sorted(CAPA)):
    d = D[n]; aj = AJUSTES.get(str(n), {})
    apoio, destaque, sub = CAPA[n]
    dica = [limpa(x) for x in d['dica']][:aj.get('dica_n', 1)]
    q = d['questao'][:aj['q_corte']] if 'q_corte' in aj else d['questao']
    qs = questao(q)
    gab = limpa(d['gabarito'][0]) if d['gabarito'] else ''
    if not re.match(r'^[A-E]\s*[.)]', gab):  # gabarito sem letra: acha a alternativa pelo texto
        alts = qs.get('alternativas', [])
        k = next((j for j, a in enumerate(alts) if sem_marcador(gab)[:60] == a[:60]), None)
        gab = f'{"ABCDE"[k]}. {sem_marcador(gab)}' if k is not None else gab
    # Questão: enunciado (+ afirmativas) | alternativas. "q3": mais um slide (divide afirmativas, enunciado ou alternativas).
    enun, afi, meio, alts = qs['texto'], qs.get('afirmativas', []), qs.get('textoMeio', []), qs['alternativas']
    base = {'_tipo': 'q', 'barra': False, 'compacto': True, 'alinhamento': 'esquerda'}
    if aj.get('q3') == 'afirmativas':
        h = (len(afi) + 1) // 2
        q_slides = [dict(base, titulo='Questão', texto=enun, afirmativas=afi[:h]),
                    dict(base, afirmativas=afi[h:], inicio=h),
                    dict(base, texto=meio, alternativas=alts)]
    elif aj.get('q3') == 'enunciado':
        fr = re.split(r'(?<=[.:?])\s+', ' '.join(enun)); h = len(fr) // 2
        q_slides = [dict(base, titulo='Questão', texto=' '.join(fr[:h])),
                    dict(base, texto=' '.join(fr[h:]), afirmativas=afi),
                    dict(base, texto=meio, alternativas=alts)]
    elif aj.get('q3') == 'alternativas':
        h = (len(alts) + 1) // 2
        q_slides = [dict(base, titulo='Questão', texto=enun, afirmativas=afi),
                    dict(base, texto=meio, alternativas=alts[:h]),
                    dict(base, alternativas=alts[h:], inicio=h)]
    else:
        q_slides = [dict(base, titulo='Questão', texto=enun, afirmativas=afi),
                    dict(base, texto=meio, alternativas=alts)]
    for q_ in q_slides:
        for k in [k for k, v in q_.items() if v in ([], None, '')]: del q_[k]
    tab = tabela(d['tabela'][:aj['tab_corte']] if 'tab_corte' in aj else d['tabela'])
    tab = [dict(t, _tipo='tab', alinhamento='esquerda') for t in tab if t.get('lista')][:aj.get('tab_max', 0 if aj.get('q3') else 1)]
    for t in tab:
        if not t.get('titulo'): t['titulo'] = 'Tabelinha'
        t['lista'] = t['lista'][:aj.get('tab_itens', 8)]
    livre = 5 - 1 - len(q_slides) - len(tab)
    while livre < 1 and tab: tab.pop(); livre += 1
    expl = [limpa(x) for x in d['explicacao']]
    if 'expl_idx' in aj: expl = [expl[k] for k in aj['expl_idx']]
    ex = pacotes(expl, aj.get('expl_limite', 430))[:livre]
    exp_slides = [{'titulo': 'Explicação' if k == 0 else 'E mais:', '_tipo': 'exp', 'texto': p} for k, p in enumerate(ex)]
    slides = [{'titulo': 'Dica de ouro', '_tipo': 'dica', 'texto': dica, 'marca': f'DIA {n}'}] + exp_slides + tab + q_slides
    post = {
        'id': f'diario-{n}-{slug(" ".join(destaque))}',
        'etiqueta': f'Diário Constitucional · Dia {n}',
        'apoio': apoio, 'destaque': destaque, **({'subtitulo': sub} if sub else {}),
        'foto': FOTOS[i] + '.jpg',
        'slides': slides,
        'cta': {'pergunta': 'E aí, qual a resposta?', 'chamada': 'Comenta a letra e salva pra revisar', **({'cartao': 'branco'} if i % 2 else {})},
        'gabarito': f'Dia {n} – {limpa(d["tema"])}\nGabarito: {gab}',
    }
    posts.append(post)
json.dump(posts, open('diario_posts.json', 'w'), ensure_ascii=False, indent=2)
print(len(posts), 'posts')
